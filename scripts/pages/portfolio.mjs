import { SITE, DATA, esc, page, breadcrumbSchema, businessId } from '../layout.mjs';
import { shotImg, host, hasShot } from '../media.mjs';

const clip = (t, n = 158) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n - 1)).replace(/[,.;:]$/, '') + '…');

const fontSpecimenHref = fonts =>
  'https://fonts.googleapis.com/css2?' +
  fonts.map(f => `family=${encodeURIComponent(f).replace(/%20/g, '+')}`).join('&') +
  `&text=${encodeURIComponent('Aa' + fonts.join(''))}&display=swap`;

export function portfolioIndex() {
  const { projects, allProjects } = DATA;
  const more = allProjects.filter(p => !p.featured);
  const rows = projects.map((p, i) => `
    <article class="pf-row${i % 2 ? ' pf-row--flip' : ''}">
      <a class="pf-row__media" href="/portfolio/${p.slug}/" aria-label="${esc(p.name)} case study">
        <div class="device">
          <div class="chrome"><span></span><span></span><span></span><em>${esc(host(p.liveUrl || p.browseUrl))}</em></div>
          ${shotImg(p, 'hero', { sizes: '(min-width: 900px) 58vw, 92vw', alt: `${p.name} website designed and built by Elan's Tech World`, lazy: i > 0 })}
        </div>
        ${p.mobile?.[0] && hasShot(p.slug, p.mobile[0]) ? `<div class="phone phone--float">${shotImg(p, p.mobile[0], { phone: true, sizes: '200px', alt: `${p.name} on a phone` })}</div>` : ''}
      </a>
      <div class="pf-row__text">
        <img class="pf-row__logo" src="/assets/work/${p.slug}/logo.webp" alt="${esc(p.name)} logo" loading="lazy">
        <p class="pf-row__meta"><span>${esc(p.type)}</span><span>${esc(p.location)}</span>${p.isNew ? '<span class="tag tag--new">New</span>' : ''}${p.status ? `<span class="tag">${esc(p.status)}</span>` : ''}</p>
        <h2><a href="/portfolio/${p.slug}/">${esc(p.name)}</a></h2>
        <p>${esc(p.summary)}</p>
        <ul class="chips">${p.services.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
        <a class="link-arrow" href="/portfolio/${p.slug}/">See the case study</a>
      </div>
    </article>`).join('');

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: "Web design portfolio — Elan's Tech World",
      url: `${SITE.origin}/portfolio/`,
      about: { '@id': businessId },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: allProjects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.origin}/portfolio/${p.slug}/`, name: p.name })),
      },
    },
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Work', path: '/portfolio/' }]),
  ];

  const body = `
<section class="page-hero">
  <div class="wrap">
    <h1 class="page-hero__title" data-reveal="chars">Work</h1>
    <p class="page-hero__lede">Brands we built end to end for practices, firms and buildings across New York — logos, websites, content and more. Open any case study to browse the real site.</p>
  </div>
</section>
<section class="pf-list">
  <div class="wrap">${rows}
  </div>
</section>
${more.length ? `<section class="pf-more" id="more" aria-labelledby="more-title">
  <div class="wrap">
    <div class="split-head">
      <h2 id="more-title" data-reveal="lines">More projects</h2>
      <p>Salons, spas, therapists, real estate, property management and an online store — ${more.length} more sites we designed and built across Queens, Manhattan and Brooklyn.</p>
    </div>
    <ul class="pf-cards" data-reveal="stagger">
      ${more.map(p => `<li><a class="pf-card" href="/portfolio/${p.slug}/">
        <span class="pf-card__shot"><span class="chrome"><span></span><span></span><span></span><em>${esc(host(p.liveUrl || p.browseUrl))}</em></span>${shotImg(p, 'hero', { sizes: '(min-width: 1100px) 400px, (min-width: 700px) 46vw, 92vw', alt: `${p.name} website designed by Elan's Tech World` })}</span>
        <span class="pf-card__body">
          <span class="pf-card__logo${p.logoDark ? ' is-dark' : ''}"><img src="/assets/work/${p.slug}/logo.webp" alt="" loading="lazy"></span>
          <span class="pf-card__name">${esc(p.name)}</span>
          <span class="pf-card__meta">${esc(p.type)}, ${esc(p.location)}</span>
          <span class="pf-card__go">See the project</span>
        </span>
      </a></li>`).join('\n      ')}
    </ul>
  </div>
</section>` : ''}`;

  return page({
    meta: {
      title: "Web Design Portfolio — NYC Client Websites | Elan's Tech World",
      description: `${allProjects.length} client websites we designed and built: medical practices, therapists, med spas, salons, real estate, property management and e-commerce across NYC.`,
      path: '/portfolio/',
      schema,
    },
    active: 'work',
    body,
  });
}

export function caseStudy(p) {
  const { allProjects } = DATA;
  const i = allProjects.indexOf(p);
  const next = allProjects[(i + 1) % allProjects.length];
  const liveHost = host(p.liveUrl || p.browseUrl);
  const shots = p.shots.filter(s => hasShot(p.slug, s.file));
  const gallery = shots.slice(1);
  const phones = (p.mobile || []).filter(m => hasShot(p.slug, m));

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: `${p.name} website`,
      headline: `${p.name} — website case study`,
      description: p.summary,
      url: `${SITE.origin}/portfolio/${p.slug}/`,
      image: `${SITE.origin}/assets/work/${p.slug}/og.jpg`,
      creator: { '@id': businessId },
      ...(p.year ? { dateCreated: p.year } : {}),
      about: { '@type': 'Organization', name: p.name, ...(p.liveUrl ? { url: p.liveUrl } : {}) },
      keywords: [p.type, p.location, ...p.services].join(', '),
    },
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Work', path: '/portfolio/' }, { name: p.name, path: `/portfolio/${p.slug}/` }]),
  ];

  const facts = [
    ['Industry', p.type],
    ['Location', p.location],
    ['What we did', p.services.join(', ')],
    ...(p.year ? [['Year', p.year]] : []),
  ];

  const body = `
<article class="cs" style="--c1:${p.palette[0].hex};--c2:${p.palette[1].hex};--c3:${(p.palette[2] || p.palette[1]).hex}">
  <header class="cs-hero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/portfolio/">Work</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
      <h1 class="cs-hero__title" data-reveal="chars">${esc(p.name)}</h1>
      <p class="cs-hero__lede">${esc(p.summary)}</p>
      <dl class="facts">
        ${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('\n        ')}
      </dl>
      <div class="cs-hero__ctas">
        <a class="btn btn--sun" href="#browse">Browse the live site</a>
        ${p.liveUrl ? `<a class="btn btn--line" href="${p.liveUrl}" target="_blank" rel="noopener">Visit ${esc(liveHost)}</a>` : `<span class="tag">${esc(p.status || 'Launching soon')}</span>`}
      </div>
    </div>
  </header>

  <section class="cs-stage" aria-label="Home page">
    <div class="wrap cs-stage__in">
      <div class="device device--xl">
        <div class="chrome"><span></span><span></span><span></span><em>${esc(liveHost)}</em></div>
        ${shotImg(p, 'hero', { sizes: '(min-width: 1320px) 1240px, 94vw', alt: `${p.name} home page`, lazy: false })}
      </div>
      ${phones[0] ? `<div class="phone phone--stage">${shotImg(p, phones[0], { phone: true, sizes: '(min-width: 900px) 260px, 34vw', alt: `${p.name} home page on a phone`, lazy: false })}</div>` : ''}
    </div>
  </section>

  <section class="cs-story">
    <div class="wrap cs-story__in">
      <div>
        <h2>The brief</h2>
        <p class="cs-story__brief">${esc(p.brief)}</p>
      </div>
      <div>
        <h2>What we built</h2>
        <ul class="ticks">${p.built.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>
    </div>
  </section>

  <section class="browse" id="browse" aria-labelledby="browse-title">
    <div class="wrap">
      <div class="browse__head">
        <h2 id="browse-title" data-reveal="lines">Browse it live</h2>
        <p>This is the real site, running inside this page. Scroll it, open the menus, click through.</p>
      </div>
      <div class="browse__frame" data-browse="${esc(p.browseUrl)}" data-mode="desktop">
        <div class="browse__bar">
          <span class="lb__dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="browse__url">${esc(host(p.browseUrl))}</span>
          <div class="browse__modes" role="group" aria-label="Device">
            <button type="button" data-mode="desktop" aria-pressed="true">Desktop</button>
            <button type="button" data-mode="phone" aria-pressed="false">Phone</button>
          </div>
          <a class="browse__open" href="${esc(p.browseUrl)}" target="_blank" rel="noopener">Open in new tab</a>
        </div>
        <div class="browse__viewport">
          <button class="browse__start" type="button">
            ${shotImg(p, 'hero', { sizes: '(min-width: 1320px) 1240px, 94vw', alt: '' })}
            <span class="browse__play"><span>Load the live site</span></span>
          </button>
        </div>
      </div>
    </div>
  </section>

  ${gallery.length ? `<section class="cs-gallery" aria-label="Screens">
    <div class="wrap">
      <h2 class="sr-only">Screens</h2>
      <div class="shots">
        ${gallery.map((s, k) => `<figure class="shot${k === 0 || k === 3 ? ' shot--wide' : ''}">
          <div class="device"><div class="chrome"><span></span><span></span><span></span></div>${shotImg(p, s.file, { sizes: k === 0 || k === 3 ? '(min-width: 1320px) 1240px, 94vw' : '(min-width: 900px) 46vw, 94vw', alt: `${p.name} — ${s.caption}` })}</div>
          <figcaption>${esc(s.caption)}</figcaption>
        </figure>`).join('\n        ')}
      </div>
    </div>
  </section>` : ''}

  ${phones.length ? `<section class="cs-phones" aria-label="On phones">
    <div class="wrap cs-phones__in">
      <div class="cs-phones__text">
        <h2 data-reveal="lines">Built for the phone first</h2>
        <p>Most visitors find ${esc(p.name)} on a phone. Every layout was designed and tested for small screens before desktop.</p>
      </div>
      <div class="cs-phones__row">
        ${phones.map(m => `<div class="phone">${shotImg(p, m, { phone: true, sizes: '(min-width: 900px) 280px, 44vw', alt: `${p.name} on a phone` })}</div>`).join('\n        ')}
      </div>
    </div>
  </section>` : ''}

  ${p.logo ? `<section class="cs-logo" aria-labelledby="logo-title">
    <div class="wrap cs-logo__in">
      <div class="cs-logo__text">
        <h2 id="logo-title" data-reveal="lines">${p.photos && p.photos.some(ph => ph.file.startsWith('social-')) ? 'The logo &amp; online presence' : 'The logo'}</h2>
        <p>${p.services.includes('Logo design') ? "Designed by Elan's Tech World, then carried through the website, social media, print and signs." : 'The brand, carried through every page of the website we built.'}</p>
      </div>
      <div class="cs-logo__plate${p.logoDark ? ' is-dark' : ''}" data-reveal><img src="/assets/work/${p.slug}/${p.logo}" alt="${esc(p.name)} logo" loading="lazy"></div>
    </div>
    ${(p.photos || []).length ? `<div class="wrap cs-photos" data-reveal="stagger">
      ${p.photos.map(ph => `<figure class="${[ph.wide ? 'is-wide' : '', ph.contain ? 'is-shot' : ''].join(' ').trim()}"><img src="/assets/work/${p.slug}/${ph.file}.webp" alt="${esc(p.name)} — ${esc(ph.caption)}" loading="lazy" width="${ph.w || 1600}" height="${ph.h || 1067}"><figcaption>${esc(ph.caption)}</figcaption></figure>`).join('\n      ')}
    </div>` : ''}
  </section>` : ''}

  <section class="cs-brand" aria-labelledby="brand-title">
    <div class="wrap">
      <h2 id="brand-title" data-reveal="lines">The brand system</h2>
      <div class="cs-brand__grid">
        <ul class="swatches">
          ${p.palette.map(c => `<li style="--sw:${c.hex}"><span class="swatches__chip"></span><span class="swatches__name">${esc(c.name)}</span><code>${c.hex}</code></li>`).join('\n          ')}
        </ul>
        <ul class="specimens">
          ${p.fonts.map(f => `<li><span class="specimens__aa" style="font-family:'${esc(f)}',serif">Aa</span><span class="specimens__name" style="font-family:'${esc(f)}',serif">${esc(f)}</span></li>`).join('\n          ')}
        </ul>
        <div class="stack">
          <h3>Built with</h3>
          <ul class="chips">${p.stack.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  </section>

  <nav class="cs-next" aria-label="Next project">
    <a class="wrap cs-next__in" href="/portfolio/${next.slug}/">
      <span class="cs-next__label">Next project</span>
      <span class="cs-next__name">${esc(next.name)}</span>
      <span class="cs-next__meta">${esc(next.type)}, ${esc(next.location)}</span>
    </a>
  </nav>
</article>`;

  return page({
    meta: {
      title: `${p.name} Website Design | Elan's Tech World`,
      description: clip(`${p.name}: ${p.type.toLowerCase()} in ${p.location}. See how we designed and hand-coded the site, and browse it live.`),
      path: `/portfolio/${p.slug}/`,
      image: `${SITE.origin}/assets/work/${p.slug}/og.jpg`,
      schema,
      preload: [{ href: `/assets/work/${p.slug}/hero-1440.webp`, srcset: `/assets/work/${p.slug}/hero-1440.webp 1440w, /assets/work/${p.slug}/hero.webp 2880w`, sizes: '(min-width: 1320px) 1240px, 94vw' }],
      extraHead: `<link rel="stylesheet" href="${fontSpecimenHref(p.fonts)}">`,
    },
    active: 'work',
    body,
    bodyClass: 'is-case',
  });
}
