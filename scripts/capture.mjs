/**
 * Full-page screenshot capture — desktop, mobile, and interior pages.
 *
 * For every client with a liveUrl, writes into assets/captures/:
 *   <slug>.webp          homepage, desktop, full page   (the portfolio pans this)
 *   <slug>-mobile.webp   homepage, 390px, full page
 *   <slug>-2.webp        second page, desktop
 *   <slug>-3.webp        third page, desktop
 *
 * Interior pages are discovered from the site's own navigation — the two most
 * substantial internal links, preferring the pages that actually sell
 * (services, about, menu, gallery, contact). A client can override this by
 * adding a "capturePages" array to their JSON:
 *
 *   "capturePages": ["/services", "/gallery"]
 *
 * Local:  npx playwright install chromium && node scripts/capture.mjs
 * CI:     .github/workflows/capture.yml
 * One:    node scripts/capture.mjs evia-aesthetics
 */

import { readdir, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const SRC = 'content/clients';
const OUT = 'assets/captures';

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

/* taller than this and the pan becomes a chore and the file gets heavy */
const MAX_HEIGHT = 6000;
const MAX_INTERIOR = 2;

/* pages worth showing, in the order we'd choose them */
const PREFERRED = [
  /service/i,
  /menu|price/i,
  /gallery|portfolio|work|product|shop/i,
  /about|team|story/i,
  /contact|book|appointment/i,
];

const only = process.argv[2];

/* ── helpers ─────────────────────────────────────────────────────────── */

const settle = async (page) => {
  /* Scroll the whole page so lazy images load, then return to the top.
     Bounded by a step count so an infinite-scroll page can't trap us. */
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let steps = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, 700);
        steps += 1;
        if (steps > 40 || window.scrollY + window.innerHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 80);
    });
  });

  await page.waitForTimeout(1800);
};

const shoot = async (page, file) => {
  const height = await page.evaluate(() => Math.min(document.documentElement.scrollHeight, 20000));
  const width = page.viewportSize().width;

  await page.screenshot({
    path: file,
    type: 'webp',
    quality: 78,
    ...(height > MAX_HEIGHT
      ? { clip: { x: 0, y: 0, width, height: MAX_HEIGHT } }
      : { fullPage: true }),
  });

  return Math.min(height, MAX_HEIGHT);
};

/* pull the most promising internal links out of the site's own nav */
const findPages = async (page, origin) => {
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('header a[href], nav a[href]')].map((a) => a.href),
  );

  const seen = new Set(['/']);
  const candidates = [];

  for (const href of links) {
    let url;
    try {
      url = new URL(href);
    } catch {
      continue;
    }

    if (url.origin !== origin) continue;
    if (/\.(pdf|jpe?g|png|webp|zip|mp4|docx?)$/i.test(url.pathname)) continue;

    const key = url.pathname.replace(/\/$/, '') || '/';
    if (key === '/' || seen.has(key)) continue;

    seen.add(key);
    candidates.push(key);
  }

  /* rank by how much a buyer would want to see the page */
  const ranked = candidates.sort((a, b) => {
    const score = (p) => {
      const i = PREFERRED.findIndex((rx) => rx.test(p));
      return i === -1 ? 99 : i;
    };
    return score(a) - score(b);
  });

  return ranked.slice(0, MAX_INTERIOR);
};

/* ── run ─────────────────────────────────────────────────────────────── */

const run = async () => {
  const files = (await readdir(SRC)).filter((f) => f.endsWith('.json'));

  const targets = [];
  for (const file of files) {
    const client = JSON.parse(await readFile(path.join(SRC, file), 'utf8'));
    if (!client.liveUrl) continue;
    if (only && client.slug !== only) continue;
    targets.push({
      slug: client.slug,
      url: client.liveUrl,
      name: client.name,
      pages: Array.isArray(client.capturePages) ? client.capturePages : null,
    });
  }

  if (!targets.length) {
    console.log(only ? `No client matching "${only}" with a live URL.` : 'No live URLs found.');
    return;
  }

  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const ua =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/124.0 Safari/537.36 ElansTechWorldPortfolioBot/1.0';

  let shots = 0;
  let failed = 0;

  for (const target of targets) {
    console.log(`\n${target.name}`);

    /* ── desktop: homepage + interior pages ── */
    const desktop = await browser.newContext({
      viewport: DESKTOP,
      deviceScaleFactor: 1,
      userAgent: ua,
      reducedMotion: 'reduce',
    });

    const page = await desktop.newPage();
    let interior = [];

    try {
      /* 'load' rather than 'networkidle' — chat widgets and tracking pixels
         keep the network busy forever and a site that never idles is not a
         broken site */
      await page.goto(target.url, { waitUntil: 'load', timeout: 45000 });
      await settle(page);

      const px = await shoot(page, path.join(OUT, `${target.slug}.webp`));
      console.log(`  ✓ home · desktop  (${px}px)`);
      shots += 1;

      const origin = new URL(target.url).origin;
      interior = target.pages || (await findPages(page, origin));

      for (let i = 0; i < interior.length && i < MAX_INTERIOR; i += 1) {
        const url = new URL(interior[i], origin).href;
        try {
          await page.goto(url, { waitUntil: 'load', timeout: 35000 });
          await settle(page);
          const h = await shoot(page, path.join(OUT, `${target.slug}-${i + 2}.webp`));
          console.log(`  ✓ ${interior[i]} · desktop  (${h}px)`);
          shots += 1;
        } catch (error) {
          console.error(`  ✗ ${interior[i]} — ${error.message.split('\n')[0]}`);
          failed += 1;
        }
      }
    } catch (error) {
      /* one unreachable site must never take down the run */
      console.error(`  ✗ home · desktop — ${error.message.split('\n')[0]}`);
      failed += 1;
    } finally {
      await page.close();
      await desktop.close();
    }

    /* ── mobile: homepage only ── */
    const mobile = await browser.newContext({
      viewport: MOBILE,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
        'Version/17.0 Mobile/15E148 Safari/604.1 ElansTechWorldPortfolioBot/1.0',
      reducedMotion: 'reduce',
    });

    const phone = await mobile.newPage();

    try {
      await phone.goto(target.url, { waitUntil: 'load', timeout: 45000 });
      await settle(phone);
      const px = await shoot(phone, path.join(OUT, `${target.slug}-mobile.webp`));
      console.log(`  ✓ home · mobile   (${px}px)`);
      shots += 1;
    } catch (error) {
      console.error(`  ✗ home · mobile — ${error.message.split('\n')[0]}`);
      failed += 1;
    } finally {
      await phone.close();
      await mobile.close();
    }
  }

  await browser.close();
  console.log(`\n${shots} screenshots written, ${failed} failed.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
