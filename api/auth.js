/**
 * GitHub OAuth — step 1 of 2: send the user to GitHub.
 *
 * Implements the Netlify/Decap OAuth client protocol that Sveltia CMS speaks,
 * running on your own Vercel deployment so the client secret never leaves your
 * infrastructure and no third party sees your tokens.
 *
 * Reached at https://your-domain.com/auth via the rewrite in vercel.json.
 *
 * Required environment variables (Vercel → Settings → Environment Variables):
 *   GITHUB_CLIENT_ID        OAuth app client ID
 *   GITHUB_CLIENT_SECRET    OAuth app client secret  (used in callback.js)
 *   SITE_ORIGIN             https://www.elanstechworld.com  (no trailing slash)
 *   ALLOWED_GITHUB_USERS    comma-separated logins        (used in callback.js)
 *   GITHUB_OAUTH_SCOPE      optional, defaults to "repo"
 */

import crypto from 'node:crypto';

export const STATE_COOKIE = 'etw_oauth_state';

export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const siteOrigin = (process.env.SITE_ORIGIN || '').replace(/\/$/, '');

  if (!clientId || !siteOrigin) {
    res.status(500).json({ error: 'Server is missing GITHUB_CLIENT_ID or SITE_ORIGIN.' });
    return;
  }

  /* Only GitHub is wired up here. Reject anything else rather than silently
     treating it as GitHub. */
  const provider = String(req.query.provider || 'github');
  if (provider !== 'github') {
    res.status(400).json({ error: `Unsupported provider: ${provider}` });
    return;
  }

  /* CSRF protection: a random state we hand to GitHub and simultaneously store
     in an httpOnly cookie. The callback only proceeds if the two match, so an
     attacker cannot feed us an authorization code from their own session. */
  const state = crypto.randomBytes(32).toString('hex');

  res.setHeader('Set-Cookie', [
    `${STATE_COOKIE}=${state}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
  ]);
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${siteOrigin}/callback`,
    /* "repo" is required for private repositories. If your repo is public,
       set GITHUB_OAUTH_SCOPE=public_repo — least privilege is worth the edit. */
    scope: process.env.GITHUB_OAUTH_SCOPE || 'repo',
    state,
    allow_signup: 'false',
  });

  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
}
