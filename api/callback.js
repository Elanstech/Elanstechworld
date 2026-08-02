/**
 * GitHub OAuth — step 2 of 2: exchange the code for a token and hand it to the
 * CMS window that opened this popup.
 *
 * Reached at https://your-domain.com/callback via the rewrite in vercel.json.
 * This must exactly match the "Authorization callback URL" on the GitHub OAuth
 * app, or GitHub will refuse the exchange.
 */

import crypto from 'node:crypto';

const STATE_COOKIE = 'etw_oauth_state';

/** Constant-time compare so we don't leak the state via response timing. */
const safeEqual = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

const readCookie = (header, name) => {
  const match = String(header || '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
};

/**
 * The CMS listens for a postMessage handshake:
 *   1. this popup announces "authorizing:github"
 *   2. the CMS window replies
 *   3. this popup sends the result
 * Every message is scoped to our exact origin — never "*", which would leak the
 * token to any window that happened to be listening.
 */
const respond = (res, { status, origin, payload, ok }) => {
  const type = ok ? 'success' : 'error';
  const body = JSON.stringify(JSON.stringify(payload)).replace(/</g, '\\u003c');
  const target = JSON.stringify(origin);

  res.status(status);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Signing in…</title></head>
<body style="font:15px/1.6 system-ui,sans-serif;padding:40px;color:#0E1B3D">
<p id="msg">Completing sign-in…</p>
<script>
(function () {
  var ORIGIN = ${target};
  var CONTENT = ${body};
  var MESSAGE = 'authorization:github:${type}:' + CONTENT;

  if (!window.opener) {
    document.getElementById('msg').textContent =
      'This page must be opened from the content manager. Close it and try again.';
    return;
  }

  function onMessage(event) {
    if (event.origin !== ORIGIN) return;
    window.opener.postMessage(MESSAGE, ORIGIN);
    window.removeEventListener('message', onMessage, false);
    setTimeout(function () { window.close(); }, 600);
  }

  window.addEventListener('message', onMessage, false);
  window.opener.postMessage('authorizing:github', ORIGIN);
})();
</script>
</body>
</html>`);
};

export default async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const siteOrigin = (process.env.SITE_ORIGIN || '').replace(/\/$/, '');
  const allowList = (process.env.ALLOWED_GITHUB_USERS || '')
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);

  if (!clientId || !clientSecret || !siteOrigin) {
    res.status(500).json({ error: 'Server is missing OAuth environment variables.' });
    return;
  }

  /* Deliberately fail closed. An unset allowlist would otherwise let any GitHub
     account complete the flow and reach your admin UI. */
  if (!allowList.length) {
    respond(res, {
      status: 500,
      origin: siteOrigin,
      ok: false,
      payload: { message: 'ALLOWED_GITHUB_USERS is not configured on the server.' },
    });
    return;
  }

  const fail = (status, message) =>
    respond(res, { status, origin: siteOrigin, ok: false, payload: { message } });

  const { code, state, error: oauthError } = req.query;

  if (oauthError) return fail(400, `GitHub returned an error: ${oauthError}`);
  if (!code || !state) return fail(400, 'Missing authorization code or state.');

  /* Burn the state cookie immediately — it is single use. */
  const expected = readCookie(req.headers.cookie, STATE_COOKIE);
  res.setHeader('Set-Cookie', [
    `${STATE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  ]);

  if (!expected || !safeEqual(state, expected)) {
    return fail(403, 'Sign-in expired or could not be verified. Please try again.');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${siteOrigin}/callback`,
      }),
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok || data.error || !data.access_token) {
      /* Never echo GitHub's raw response — it can carry request details we
         don't want rendered into a page. */
      return fail(401, 'GitHub declined the sign-in request.');
    }

    const token = data.access_token;

    /* Confirm who this token belongs to before handing it back. */
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'elanstechworld-cms',
      },
    });

    if (!userRes.ok) return fail(401, 'Could not verify the GitHub account.');

    const user = await userRes.json();
    const login = String(user.login || '').toLowerCase();

    if (!allowList.includes(login)) {
      return fail(403, 'This GitHub account is not authorized to edit the site.');
    }

    return respond(res, {
      status: 200,
      origin: siteOrigin,
      ok: true,
      payload: { token, provider: 'github' },
    });
  } catch {
    /* Swallow the underlying error object: it may contain the token or secret. */
    return fail(500, 'Sign-in failed. Please try again.');
  }
}
