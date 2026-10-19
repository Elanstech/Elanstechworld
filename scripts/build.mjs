// Builds the whole site from data/portfolio.json. No dependencies — runs on any Node 18+.
//   node scripts/build.mjs
// Vercel runs this automatically on every push (see vercel.json → buildCommand).
import fs from 'node:fs';
import path from 'node:path';
import { SITE, DATA } from './layout.mjs';
import { ROOT } from './media.mjs';
import { homePage } from './pages/home.mjs';
import { portfolioIndex, caseStudy } from './pages/portfolio.mjs';
import { whyUsPage, contactPage, notFoundPage } from './pages/static.mjs';
import { servicesIndex, servicePage } from './pages/services.mjs';

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/portfolio.json'), 'utf8'));
const allProjects = data.projects.filter(p => !p.hidden);
const projects = allProjects.filter(p => p.featured);
const svc = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/services.json'), 'utf8'));
const services = svc.services.filter(s => !s.hidden);
Object.assign(DATA, { projects, allProjects, services, groups: svc.groups });
for (const s of services) {
  for (const k of ['slug', 'group', 'menu', 'name', 'blurb', 'title', 'description', 'h1', 'lede', 'body', 'includes', 'faqs']) if (s[k] == null) throw new Error(`services.json: "${s.slug}" is missing "${k}"`);
  if (!svc.groups.includes(s.group)) throw new Error(`services.json: "${s.slug}" has unknown group "${s.group}"`);
}

// Basic validation so a typo in the JSON fails loudly instead of shipping a broken page.
for (const p of allProjects) {
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

write('index.html', homePage());
write('services/index.html', servicesIndex());
services.forEach(s => write(`services/${s.slug}/index.html`, servicePage(s)));
write('whyus/index.html', whyUsPage());
write('contact/index.html', contactPage());
write('portfolio/index.html', portfolioIndex());
allProjects.forEach(p => write(`portfolio/${p.slug}/index.html`, caseStudy(p)));
write('404.html', notFoundPage());

// Remove generated folders for projects/services no longer in the JSON.
for (const [dir, list] of [['portfolio', allProjects], ['services', services]]) {
  const keep = new Set(list.map(x => x.slug));
  for (const d of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (d.isDirectory() && !keep.has(d.name)) fs.rmSync(path.join(ROOT, dir, d.name), { recursive: true });
  }
}

// Sitemap
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ['/', '1.0'], ['/services/', '0.9'], ...services.map(x => [`/services/${x.slug}/`, '0.9']), ['/portfolio/', '0.9'], ['/whyus/', '0.7'], ['/contact/', '0.8'],
  ...allProjects.map(p => [`/portfolio/${p.slug}/`, p.featured ? '0.8' : '0.7']),
  ['/shop/', '0.4'],
];
const img = p => `\n    <image:image><image:loc>${SITE.origin}/assets/work/${p.slug}/hero.webp</image:loc><image:title>${p.name.replace(/&/g, '&amp;')} website</image:title></image:image>`;
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(([u, pr]) => {
  const p = allProjects.find(x => u === `/portfolio/${x.slug}/`);
  return `  <url>\n    <loc>${SITE.origin}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${pr}</priority>${p ? img(p) : ''}\n  </url>`;
}).join('\n')}
</urlset>
`);

console.log(`Built ${out.length} files:\n  ${out.join('\n  ')}`);
