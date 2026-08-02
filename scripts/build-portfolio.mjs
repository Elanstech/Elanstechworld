/**
 * ELAN'S TECH WORLD — portfolio build
 * ---------------------------------------------------------------------------
 * Reads  content/clients/*.json   (written by the CMS)
 * Writes portfolio/index.html     the client index
 *        portfolio/<slug>.html    one page per client
 *        sitemap-portfolio.xml    for Search Console
 *
 * Run:   node scripts/build-portfolio.mjs
 *
 * Everything renders to real static HTML — no client-side fetching — so search
 * engines and AI crawlers get the full content on first request, and every
 * client has its own indexable URL.
 * ---------------------------------------------------------------------------
 */

import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'content/clients';
const OUT = 'portfolio';
const ORIGIN = 'https://www.elanstechworld.com';
const CAPTURES = 'assets/captures';

/* ── helpers ─────────────────────────────────────────────────────────── */

const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const exists = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

const DISCIPLINE = {
  website: 'Website',
  platform: 'Platform',
  logo: 'Logo',
  print: 'Print',
  signage: 'Signage',
  promo: 'Promo',
  packaging: 'Packaging',
  pos: 'POS',
  ads: 'Google Ads',
};

const label = (key) => DISCIPLINE[key] || key;

/* strip protocol and trailing slash for display */
const prettyUrl = (url = '') => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

/* ── shared chrome ───────────────────────────────────────────────────── */

const head = ({ title, description, canonical, schema, depth = 1 }) => {
  const up = '../'.repeat(depth);
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <link rel="canonical" href="${canonical}">
    <meta name="theme-color" content="#0E1B3D">

    <meta name="geo.region" content="US-NY">
    <meta name="geo.placename" content="Rego Park, Queens, New York">
    <meta name="geo.position" content="40.7268;-73.8620">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Elan's Tech World">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">

${schema.map((block) => `    <script type="application/ld+json">\n${JSON.stringify(block, null, 2)}\n    </script>`).join('\n')}

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Instrument+Serif:ital@0;1&family=Onest:wght@300;400;500;600&family=Fragment+Mono&display=swap" rel="stylesheet">

    <link rel="icon" type="image/png" href="/assets/favicon/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/svg+xml" href="/assets/favicon/favicon.svg">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png">

    <link rel="stylesheet" href="${up}css/style.css">
    <link rel="stylesheet" href="${up}css/portfolio.css">
</head>`;
};

const header = (activePortfolio = true) => `
<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
<div class="cursor-dot" id="cursorDot" aria-hidden="true"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"><span class="cursor-label" id="cursorLabel">View</span></div>
<div class="grain" aria-hidden="true"></div>

<header class="header" id="header">
    <div class="header-inner">
        <a href="/" class="logo" aria-label="Elan's Tech World — home">
            <span class="logo-mark"><img src="/assets/images/Elanslogo.jpeg" alt="Elan's Tech World logo" width="46" height="46"></span>
            <span class="logo-type"><span class="logo-name">Elan's</span><span class="logo-tag">Tech World · NYC</span></span>
        </a>
        <nav class="nav" aria-label="Primary">
            <ul>
                <li><a href="/" class="nav-link" data-hover="Home"><span>Home</span></a></li>
                <li><a href="/pages/services.html" class="nav-link" data-hover="Services"><span>Services</span></a></li>
                <li><a href="/pages/whyus.html" class="nav-link" data-hover="Why Us"><span>Why Us</span></a></li>
                <li><a href="/portfolio/" class="nav-link${activePortfolio ? ' active' : ''}" data-hover="Portfolio"><span>Portfolio</span></a></li>
                <li><a href="/shop/" class="nav-link" data-hover="Shop"><span>Shop</span></a></li>
                <li><a href="/pages/contact.html" class="nav-link" data-hover="Contact"><span>Contact</span></a></li>
            </ul>
        </nav>
        <div class="header-actions">
            <a href="/pages/contact.html" class="btn btn--fill header-cta magnetic"><span class="btn-text">Start a project</span></a>
            <button class="burger" id="burger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span></button>
        </div>
    </div>
</header>

<div class="mmenu" id="mmenu" aria-hidden="true">
    <span class="mmenu-orb mmenu-orb--1" aria-hidden="true"></span>
    <span class="mmenu-orb mmenu-orb--2" aria-hidden="true"></span>
    <nav aria-label="Mobile">
        <ul>
            <li><a href="/"><i>01</i><span>Home</span></a></li>
            <li><a href="/pages/services.html"><i>02</i><span>Services</span></a></li>
            <li><a href="/pages/whyus.html"><i>03</i><span>Why Us</span></a></li>
            <li><a href="/portfolio/"><i>04</i><span>Portfolio</span></a></li>
            <li><a href="/shop/"><i>05</i><span>Shop</span></a></li>
            <li><a href="/pages/contact.html"><i>06</i><span>Contact</span></a></li>
        </ul>
    </nav>
    <div class="mmenu-foot">
        <a href="tel:+19294176819">(929) 417-6819</a>
        <a href="mailto:elan@elanstechworld.com">elan@elanstechworld.com</a>
        <a href="https://www.instagram.com/elan_tech_world/" target="_blank" rel="noopener">@elan_tech_world</a>
    </div>
</div>`;

const footer = () => `
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-brand">
                <a href="/" class="logo">
                    <span class="logo-mark"><img src="/assets/images/Elanslogo.jpeg" alt="Elan's Tech World logo" width="46" height="46"></span>
                    <span class="logo-type"><span class="logo-name" style="color:var(--paper)">Elan's</span><span class="logo-tag">Tech World · NYC</span></span>
                </a>
                <p>Premium digital solutions crafted with precision and care. Based in Rego Park, Queens, New York City.</p>
                <div class="footer-social">
                    <a href="https://www.instagram.com/elan_tech_world/" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
                </div>
            </div>
            <div class="footer-col">
                <h4>Navigate</h4>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/pages/services.html">Services</a></li>
                    <li><a href="/pages/whyus.html">Why Us</a></li>
                    <li><a href="/portfolio/">Portfolio</a></li>
                    <li><a href="/pages/contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Services</h4>
                <ul>
                    <li><a href="/pages/services.html#web">Web Development</a></li>
                    <li><a href="/pages/services.html#marketing">Digital Marketing</a></li>
                    <li><a href="/pages/services.html#materials">Business Materials</a></li>
                    <li><a href="/pages/services.html#signage">Custom Signage</a></li>
                    <li><a href="/pages/services.html#property">Property Platforms</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Contact</h4>
                <ul>
                    <li><a href="tel:+19294176819">(929) 417-6819</a></li>
                    <li><a href="mailto:elan@elanstechworld.com">elan@elanstechworld.com</a></li>
                    <li><span>Rego Park, Queens, NY</span></li>
                </ul>
            </div>
        </div>
        <div class="footer-word" id="footerWord" aria-hidden="true">Elan's <em>Tech</em></div>
        <div class="footer-bottom">
            <p>© ${new Date().getFullYear()} Elan's Tech World. All rights reserved.</p>
            <p>Stitched in NYC ◆</p>
        </div>
    </div>
</footer>

<a href="#top" class="to-top" id="toTop" aria-label="Back to top">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 15V3M9 3L3 9M9 3L15 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
</a>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
<script src="/js/script.js" defer></script>
<script src="/js/portfolio.js" defer></script>
</body>
</html>`;

/* ── index page ──────────────────────────────────────────────────────── */

const indexPage = (clients, stats) => {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${ORIGIN}/portfolio/#page`,
      url: `${ORIGIN}/portfolio/`,
      name: 'Portfolio — Elan\'s Tech World',
      description: `Selected work for ${stats.clients} New York businesses: websites, platforms, brand identity, print and signage.`,
      isPartOf: { '@type': 'WebSite', '@id': `${ORIGIN}/#website` },
      about: { '@id': `${ORIGIN}/#business` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${ORIGIN}/portfolio/` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Client work by Elan\'s Tech World',
      numberOfItems: clients.length,
      itemListElement: clients.map((client, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          name: `${client.name} — ${client.disciplines.map(label).join(', ')}`,
          url: `${ORIGIN}/portfolio/${client.slug}.html`,
          creator: { '@id': `${ORIGIN}/#business` },
          about: { '@type': 'Organization', name: client.name },
          dateCreated: client.yearFirst,
        },
      })),
    },
  ];

  const filters = [...new Set(clients.flatMap((c) => c.disciplines))];

  const rows = clients
    .map((client, i) => {
      const metric = client.headlineMetric?.value
        ? `<span class="pf-metric"><b>${esc(client.headlineMetric.value)}</b>${esc(client.headlineMetric.label || '')}</span>`
        : `<span class="pf-metric pf-metric--empty">${esc(client.industry)}</span>`;

      const shot = client.capture
        ? `<img src="/${CAPTURES}/${client.slug}.webp" alt="" loading="lazy" decoding="async">`
        : '';

      return `
            <li class="pf-row rv" data-disciplines="${client.disciplines.join(' ')}" style="--accent:${esc(client.accent || '#2B4BDF')}">
                <a class="pf-link" href="/portfolio/${client.slug}.html" data-shot="${client.capture ? `/${CAPTURES}/${client.slug}.webp` : ''}">
                    <span class="pf-idx">${String(i + 1).padStart(2, '0')}</span>
                    <span class="pf-main">
                        <span class="pf-name">${esc(client.name)}</span>
                        <span class="pf-sub">${esc(client.industry)}${client.neighborhood ? ` · ${esc(client.neighborhood)}` : ''}</span>
                    </span>
                    <span class="pf-tags">${client.disciplines.map((d) => `<i>${esc(label(d))}</i>`).join('')}</span>
                    ${metric}
                    <span class="pf-year">${esc(client.yearFirst)}</span>
                    <span class="pf-arrow" aria-hidden="true">↗</span>
                </a>
                <div class="pf-thumb" aria-hidden="true">${shot}</div>
            </li>`;
    })
    .join('');

  return `${head({
    title: "Portfolio — NYC Web Design, Branding & Signage | Elan's Tech World",
    description: `Selected work for ${stats.clients} New York businesses — ${stats.work} projects across websites, platforms, brand identity, print and signage. Hand-coded, never templated.`,
    canonical: `${ORIGIN}/portfolio/`,
    schema,
    depth: 1,
  })}
<body data-page="portfolio" id="top">
${header(true)}

<main id="main">

<section class="pf-hero" aria-label="Portfolio introduction">
    <div class="pf-hero-rule" aria-hidden="true"></div>
    <div class="container">
        <div class="eyebrow rv"><span class="dm">◆</span><span>Selected Work · 2020 — ${new Date().getFullYear()}</span></div>
        <h1 class="pf-title rv">The <em>work.</em></h1>
        <p class="pf-lead rv">Every brand below was carried end to end — website, identity, print, the sign over the door. Hover a row to scroll the live site.</p>

        <dl class="pf-stats rv">
            <div><dt>Clients</dt><dd>${stats.clients}</dd></div>
            <div><dt>Projects delivered</dt><dd>${stats.work}</dd></div>
            <div><dt>Years</dt><dd>${stats.years}</dd></div>
            <div><dt>Average rating</dt><dd>5.0<i>★</i></dd></div>
        </dl>
    </div>
</section>

<section class="pf-list-sec" aria-label="Client work">
    <div class="container">
        <div class="pf-filters rv" role="group" aria-label="Filter by discipline">
            <button type="button" class="pf-filter is-on" data-filter="all">All<i>${clients.length}</i></button>
            ${filters
              .map((f) => {
                const count = clients.filter((c) => c.disciplines.includes(f)).length;
                return `<button type="button" class="pf-filter" data-filter="${f}">${esc(label(f))}<i>${count}</i></button>`;
              })
              .join('\n            ')}
        </div>

        <ul class="pf-list" id="pfList">${rows}
        </ul>

        <p class="pf-empty" id="pfEmpty" hidden>No work in that discipline yet.</p>
    </div>
</section>

<!-- floating preview: a real browser frame that scrolls the captured page -->
<div class="pf-preview" id="pfPreview" aria-hidden="true">
    <div class="pf-frame">
        <div class="pf-chrome"><i></i><i></i><i></i><span id="pfUrl"></span></div>
        <div class="pf-screen"><img id="pfShot" src="" alt=""></div>
    </div>
</div>

<section class="slab mega" aria-label="Start your project">
    <span class="mega-orb mega-orb--a" aria-hidden="true"></span>
    <span class="mega-orb mega-orb--b" aria-hidden="true"></span>
    <div class="section">
        <div class="container mega-inner">
            <div class="eyebrow rv"><span class="dm">◆</span><span>Free Consultation · From $2,000</span></div>
            <a href="/pages/contact.html" class="mega-link rv">Yours<em>next.</em></a>
            <p class="mega-sub rv">One call, zero pressure. We'll tell you honestly what your project should cost.</p>
        </div>
    </div>
</section>

</main>
${footer()}`;
};

/* ── client page ─────────────────────────────────────────────────────── */

const clientPage = (client) => {
  const disciplines = client.disciplines.map(label).join(', ');
  const metric = client.headlineMetric?.value;

  const description = `${client.name} — ${disciplines} by Elan's Tech World, New York City.${
    metric ? ` ${client.headlineMetric.value} ${client.headlineMetric.label}.` : ''
  } ${client.story?.challenge || ''}`.slice(0, 300);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${ORIGIN}/portfolio/${client.slug}.html#work`,
      name: `${client.name} — ${disciplines}`,
      url: `${ORIGIN}/portfolio/${client.slug}.html`,
      description,
      dateCreated: client.yearFirst,
      creator: { '@id': `${ORIGIN}/#business` },
      about: {
        '@type': 'Organization',
        name: client.name,
        ...(client.liveUrl ? { url: client.liveUrl } : {}),
      },
      keywords: client.disciplines.map(label).join(', '),
      ...(client.testimonial?.text
        ? {
            review: {
              '@type': 'Review',
              reviewBody: client.testimonial.text,
              author: { '@type': 'Person', name: client.testimonial.author || client.name },
              reviewRating: {
                '@type': 'Rating',
                ratingValue: String(client.testimonial.rating || 5),
                bestRating: '5',
              },
            },
          }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${ORIGIN}/portfolio/` },
        {
          '@type': 'ListItem',
          position: 3,
          name: client.name,
          item: `${ORIGIN}/portfolio/${client.slug}.html`,
        },
      ],
    },
  ];

  /* group work by discipline so a client with nine pieces reads as a system */
  const groups = client.work.reduce((acc, item) => {
    (acc[item.discipline] ||= []).push(item);
    return acc;
  }, {});

  const workBlocks = Object.entries(groups)
    .map(
      ([discipline, items]) => `
            <section class="cw-group">
                <h3 class="cw-group-title"><span>${esc(label(discipline))}</span><i>${items.length}</i></h3>
                ${items
                  .map(
                    (item) => `
                <article class="cw-item">
                    <div class="cw-item-head">
                        <h4>${esc(item.title)}</h4>
                        <span class="cw-year">${esc(item.year || '')}</span>
                    </div>
                    ${item.metric?.value ? `<p class="cw-metric"><b>${esc(item.metric.value)}</b> ${esc(item.metric.label || '')}</p>` : ''}
                    ${
                      item.images?.length
                        ? `<div class="cw-shots">${item.images
                            .map(
                              (src) =>
                                `<img src="${esc(src)}" alt="${esc(item.title)} — ${esc(client.name)}" loading="lazy" decoding="async">`,
                            )
                            .join('')}</div>`
                        : ''
                    }
                    ${
                      item.specs && Object.keys(item.specs).length
                        ? `<dl class="cw-specs">${Object.entries(item.specs)
                            .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
                            .join('')}</dl>`
                        : ''
                    }
                    ${
                      item.technologies?.length
                        ? `<ul class="cw-tech">${item.technologies.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
                        : ''
                    }
                </article>`,
                  )
                  .join('')}
            </section>`,
    )
    .join('');

  return `${head({
    title: `${client.name} — ${disciplines} | Elan's Tech World NYC`,
    description,
    canonical: `${ORIGIN}/portfolio/${client.slug}.html`,
    schema,
    depth: 1,
  })}
<body data-page="portfolio-client" id="top" style="--accent:${esc(client.accent || '#2B4BDF')}">
${header(true)}

<main id="main">

<article class="cw">
    <header class="cw-hero">
        <div class="container">
            <nav class="cw-crumbs" aria-label="Breadcrumb">
                <a href="/portfolio/">Portfolio</a><span aria-hidden="true">/</span><span>${esc(client.name)}</span>
            </nav>

            <h1 class="cw-title">${esc(client.name)}</h1>
            <p class="cw-sub">${esc(client.industry)}${client.neighborhood ? ` · ${esc(client.neighborhood)}` : ''} · since ${esc(client.yearFirst)}</p>

            <ul class="cw-disciplines">${client.disciplines.map((d) => `<li>${esc(label(d))}</li>`).join('')}</ul>

            ${
              metric
                ? `<p class="cw-headline"><b>${esc(client.headlineMetric.value)}</b><span>${esc(client.headlineMetric.label || '')}</span></p>`
                : ''
            }

            ${
              client.liveUrl
                ? `<a class="cw-live" href="${esc(client.liveUrl)}" target="_blank" rel="noopener">${esc(prettyUrl(client.liveUrl))} <i aria-hidden="true">↗</i></a>`
                : `<span class="cw-live cw-live--soon">Launching soon</span>`
            }
        </div>
    </header>

    ${
      client.capture
        ? `<div class="cw-capture container"><div class="pf-frame">
        <div class="pf-chrome"><i></i><i></i><i></i><span>${esc(prettyUrl(client.liveUrl))}</span></div>
        <div class="cw-capture-screen"><img src="/${CAPTURES}/${client.slug}.webp" alt="${esc(client.name)} homepage" loading="lazy" decoding="async"></div>
    </div></div>`
        : ''
    }

    <section class="cw-story container" aria-label="The work">
        <div class="cw-story-col">
            <h2>The challenge</h2>
            <p>${esc(client.story?.challenge || '')}</p>
        </div>
        <div class="cw-story-col">
            <h2>What we did</h2>
            <p>${esc(client.story?.solution || '')}</p>
        </div>
        ${
          client.story?.impact
            ? `<div class="cw-story-col cw-story-col--impact">
            <h2>The result</h2>
            <p>${esc(client.story.impact)}</p>
        </div>`
            : ''
        }
    </section>

    <section class="cw-work container" aria-label="Everything delivered">
        <div class="sec-head">
            <div class="eyebrow"><span class="dm">◆</span><span>Everything Delivered</span></div>
            <h2 class="sec-title">${client.work.length} ${client.work.length === 1 ? 'piece' : 'pieces'}, <em>one standard.</em></h2>
        </div>
        ${workBlocks}
    </section>

    ${
      client.testimonial?.text
        ? `<section class="cw-quote" aria-label="Client testimonial">
        <div class="container">
            <blockquote>${esc(client.testimonial.text)}</blockquote>
            <p class="cw-quote-who"><b>${esc(client.testimonial.author || '')}</b><span>${esc(client.testimonial.role || client.name)}</span></p>
        </div>
    </section>`
        : ''
    }
</article>

<section class="slab mega" aria-label="Start your project">
    <span class="mega-orb mega-orb--a" aria-hidden="true"></span>
    <span class="mega-orb mega-orb--b" aria-hidden="true"></span>
    <div class="section">
        <div class="container mega-inner">
            <div class="eyebrow rv"><span class="dm">◆</span><span>Free Consultation · From $2,000</span></div>
            <a href="/pages/contact.html" class="mega-link rv">Want<em>this?</em></a>
            <p class="mega-sub rv">One call, zero pressure. Or see <a href="/portfolio/" style="text-decoration:underline">the rest of the work</a>.</p>
        </div>
    </div>
</section>

</main>
${footer()}`;
};

/* ── build ───────────────────────────────────────────────────────────── */

const run = async () => {
  const files = (await readdir(SRC)).filter((f) => f.endsWith('.json'));

  const clients = [];
  for (const file of files) {
    const client = JSON.parse(await readFile(path.join(SRC, file), 'utf8'));
    client.work ||= [];
    client.disciplines ||= [];
    client.capture = await exists(path.join(CAPTURES, `${client.slug}.webp`));
    if (client.status === 'archived') continue;
    clients.push(client);
  }

  /* featured first, then most recent */
  clients.sort(
    (a, b) =>
      Number(!!b.featured) - Number(!!a.featured) ||
      Number(b.yearFirst) - Number(a.yearFirst) ||
      a.name.localeCompare(b.name),
  );

  const years = clients.map((c) => Number(c.yearFirst)).filter(Boolean);
  const stats = {
    clients: clients.length,
    work: clients.reduce((sum, c) => sum + c.work.length, 0),
    years: new Date().getFullYear() - Math.min(...years) + 1,
  };

  await mkdir(OUT, { recursive: true });
  await writeFile(path.join(OUT, 'index.html'), indexPage(clients, stats), 'utf8');

  for (const client of clients) {
    await writeFile(path.join(OUT, `${client.slug}.html`), clientPage(client), 'utf8');
  }

  /* sitemap fragment — submit this in Search Console */
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    `${ORIGIN}/portfolio/`,
    ...clients.map((c) => `${ORIGIN}/portfolio/${c.slug}.html`),
  ];
  await writeFile(
    'sitemap-portfolio.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url><loc>${url}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${url.endsWith('/portfolio/') ? '0.9' : '0.8'}</priority></url>`,
  )
  .join('\n')}
</urlset>
`,
    'utf8',
  );

  const missing = clients.filter((c) => !c.capture && c.liveUrl).length;
  console.log(`✓ ${clients.length} clients · ${stats.work} projects · ${clients.length + 1} pages`);
  if (missing) console.log(`  ${missing} clients have no screenshot yet — run scripts/capture.mjs`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
