// Builds the whole site from data/portfolio.json. No dependencies — runs on any Node 18+.
//   node scripts/build.mjs
// Vercel runs this automatically on every push (see vercel.json → buildCommand).
import fs from 'node:fs';
import path from 'node:path';
import { SITE } from './layout.mjs';
import { ROOT } from './media.mjs';
import { homePage } from './pages/home.mjs';
import { portfolioIndex, caseStudy } from './pages/portfolio.mjs';
import { servicesPage, whyUsPage, contactPage, notFoundPage } from './pages/static.mjs';

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/portfolio.json'), 'utf8'));
const projects = data.projects.filter(p => !p.hidden);

// Basic validation so a typo in the JSON fails loudly instead of shipping a broken page.
for (const p of projects) {
  for (const k of ['slug', 'name', 'type', 'location', 'summary', 'brief', 'built', 'services', 'palette', 'fonts', 'stack', 'shots']) {
    if (p[k] == null || (Array.isArray(p[k]) && !p[k].length && k !== 'stack')) throw new Error(`portfolio.json: "${p.slug || p.name}" is missing "${k}"`);
  }
  if (!fs.existsSync(path.join(ROOT, 'assets/work', p.slug, 'hero.webp'))) console.warn(`! ${p.slug}: no hero.webp in assets/work/${p.slug}/`);
}

const out = [];
const write = (rel, html) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  out.push(rel);
};

write('index.html', homePage(projects));
write('services/index.html', servicesPage(projects));
write('whyus/index.html', whyUsPage(projects));
write('contact/index.html', contactPage(projects));
write('portfolio/index.html', portfolioIndex(projects));
projects.forEach((p, i) => write(`portfolio/${p.slug}/index.html`, caseStudy(p, i, projects)));
write('404.html', notFoundPage(projects));

// Remove case-study folders for projects no longer in the JSON.
const keep = new Set(projects.map(p => p.slug));
for (const d of fs.readdirSync(path.join(ROOT, 'portfolio'), { withFileTypes: true })) {
  if (d.isDirectory() && !keep.has(d.name)) fs.rmSync(path.join(ROOT, 'portfolio', d.name), { recursive: true });
}

// Sitemap
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ['/', '1.0'], ['/portfolio/', '0.9'], ['/services/', '0.9'], ['/whyus/', '0.7'], ['/contact/', '0.8'],
  ...projects.map(p => [`/portfolio/${p.slug}/`, '0.8']),
  ['/shop/', '0.4'],
];
const img = p => `\n    <image:image><image:loc>${SITE.origin}/assets/work/${p.slug}/hero.webp</image:loc><image:title>${p.name.replace(/&/g, '&amp;')} website</image:title></image:image>`;
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(([u, pr]) => {
  const p = projects.find(x => u === `/portfolio/${x.slug}/`);
  return `  <url>\n    <loc>${SITE.origin}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${pr}</priority>${p ? img(p) : ''}\n  </url>`;
}).join('\n')}
</urlset>
`);

console.log(`Built ${out.length} files:\n  ${out.join('\n  ')}`);
