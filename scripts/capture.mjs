/**
 * Full-page screenshot capture.
 *
 * Reads every client's liveUrl from content/clients/*.json, captures the whole
 * page top to bottom, and writes assets/captures/<slug>.webp. The portfolio
 * scrolls these inside a browser frame on hover.
 *
 * Local:  npx playwright install chromium && node scripts/capture.mjs
 * CI:     runs weekly via .github/workflows/capture.yml
 *
 * Capture one client only:
 *   node scripts/capture.mjs evia-aesthetics
 */

import { readdir, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const SRC = 'content/clients';
const OUT = 'assets/captures';
const WIDTH = 1440;
const HEIGHT = 900;
/* a capture taller than this gets unwieldy to scroll and heavy to ship */
const MAX_HEIGHT = 6000;

const only = process.argv[2];

const run = async () => {
  const files = (await readdir(SRC)).filter((f) => f.endsWith('.json'));

  const targets = [];
  for (const file of files) {
    const client = JSON.parse(await readFile(path.join(SRC, file), 'utf8'));
    if (!client.liveUrl) continue;
    if (only && client.slug !== only) continue;
    targets.push({ slug: client.slug, url: client.liveUrl, name: client.name });
  }

  if (!targets.length) {
    console.log(only ? `No client matching "${only}" with a live URL.` : 'No live URLs found.');
    return;
  }

  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    /* identify ourselves honestly rather than spoofing a random browser */
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/124.0 Safari/537.36 ElansTechWorldPortfolioBot/1.0',
    reducedMotion: 'reduce',
  });

  let ok = 0;
  let failed = 0;

  for (const target of targets) {
    const page = await context.newPage();

    try {
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 45000 });

      /* Scroll the whole page once so lazy-loaded images actually render,
         then return to the top before capturing. */
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let y = 0;
          const step = 600;
          const timer = setInterval(() => {
            window.scrollBy(0, step);
            y += step;
            if (y >= document.body.scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 90);
        });
      });

      /* let fonts settle and any entrance animation finish */
      await page.waitForTimeout(2200);

      const height = await page.evaluate(() =>
        Math.min(document.documentElement.scrollHeight, 20000),
      );

      await page.screenshot({
        path: path.join(OUT, `${target.slug}.webp`),
        type: 'webp',
        quality: 78,
        ...(height > MAX_HEIGHT
          ? { clip: { x: 0, y: 0, width: WIDTH, height: MAX_HEIGHT } }
          : { fullPage: true }),
      });

      console.log(`✓ ${target.slug}  (${Math.min(height, MAX_HEIGHT)}px)`);
      ok += 1;
    } catch (error) {
      /* One dead client site should never fail the whole run — the build
         falls back gracefully when a capture is missing. */
      console.error(`✗ ${target.slug} — ${error.message.split('\n')[0]}`);
      failed += 1;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\n${ok} captured, ${failed} failed.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
