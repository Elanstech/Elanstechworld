import { SITE, DATA, esc, page, businessSchema, breadcrumbSchema, faqSchema, faqList, businessId } from '../layout.mjs';

const AREAS = ['New York City', 'Queens', 'Brooklyn', 'Manhattan', 'The Bronx', 'Staten Island', 'Long Island'];

const BUNDLES = [
  { name: 'Launch', for: 'New businesses and rebrands', items: ['Logo & brand identity', 'Website', 'Google Business Profile', 'Business cards'] },
  { name: 'Grow', for: 'Businesses that want more calls', items: ['SEO & Google Ads', 'Instagram management', 'Monthly content shoot', 'Review QR stands'] },
  { name: 'Open the doors', for: 'New locations and renovations', items: ['Circle & glass signs', 'Opening flyers & banners', 'Website update', 'Opening-week posts'] },
];

const projectCard = p => `<a class="mini-case" href="/portfolio/${p.slug}/">
  <span class="mini-case__logo"><img src="/assets/work/${p.slug}/logo.webp" alt="${esc(p.name)} logo" loading="lazy"></span>
  <span class="mini-case__name">${esc(p.name)}</span>
  <span class="mini-case__meta">${esc(p.type)}, ${esc(p.location)}</span>
</a>`;

export function servicesIndex() {
  const { services, groups } = DATA;
  const faqs = [
    { q: 'What does a full-service studio mean for my business?', a: 'One team handles your website, SEO, Google Business Profile, Instagram, video, branding, print and signs — so everything looks like the same brand and you have one number to call instead of five vendors.' },
    { q: 'Can I hire you for just one service?', a: 'Yes. Many clients start with a website or a logo and add SEO, social media or signs later. Outdoor signs are the one exception — they are only available as part of a bundle.' },
    { q: 'Where do you work?', a: 'We are based in Rego Park, Queens, and work across all five boroughs and Long Island, in person or over video.' },
  ];
  const schema = [
    businessSchema(),
    { '@context': 'https://schema.org', '@type': 'ItemList', name: "Services by Elan's Tech World", itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.origin}/services/${s.slug}/`, name: s.name })) },
    faqSchema(faqs),
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }]),
  ];
  const body = `
<section class="page-hero">
  <div class="wrap">
    <h1 class="page-hero__title" data-reveal="chars">Services</h1>
    <p class="page-hero__lede">Everything your business needs to be found and chosen, from one studio: websites, search, content, brand, print, signs and the systems behind them.</p>
    <nav class="jump" aria-label="Service groups">
      ${groups.map(g => `<a href="#g-${g.toLowerCase().replace(/[^a-z]+/g, '-')}">${esc(g)}</a>`).join('\n      ')}
    </nav>
  </div>
</section>

${groups.map((g, gi) => `<section class="svc-group${gi % 2 ? ' svc-group--tint' : ''}" id="g-${g.toLowerCase().replace(/[^a-z]+/g, '-')}">
  <div class="wrap">
    <h2 class="svc-group__title" data-reveal="lines">${esc(g)}</h2>
    <ul class="svc-cards" data-reveal="stagger">
      ${services.filter(s => s.group === g).map(s => `<li><a class="svc-card" href="/services/${s.slug}/">
        <span class="svc-card__name">${esc(s.name)}</span>
        <span class="svc-card__blurb">${esc(s.blurb)}</span>
        <span class="svc-card__list">${s.includes.slice(0, 3).map(i => `<span>${esc(i.split(/ — |: /)[0])}</span>`).join('')}</span>
        <span class="svc-card__go">Explore ${esc(s.menu.toLowerCase())}</span>
      </a></li>`).join('\n      ')}
    </ul>
  </div>
</section>`).join('\n')}

<section class="bundles">
  <div class="wrap">
    <div class="split-head">
      <h2 data-reveal="lines">Most clients start with a bundle</h2>
      <p>Pick a starting point and we'll tailor it. Every bundle is quoted as a fixed price after a free call.</p>
    </div>
    <ol class="bundle-list" data-reveal="stagger">
      ${BUNDLES.map(b => `<li class="bundle"><h3>${esc(b.name)}</h3><p class="bundle__for">${esc(b.for)}</p><ul>${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul><a class="link-arrow" href="/contact/">Ask about ${esc(b.name)}</a></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="home-faq">
  <div class="wrap split-head split-head--top">
    <h2 data-reveal="lines">Questions about services</h2>
    ${faqList(faqs)}
  </div>
</section>`;
  return page({
    meta: {
      title: "Services — Web Design, SEO, Social, Branding & Signs | Elan's Tech World",
      description: 'Website design, SEO, Google Business Profile, Instagram filming, video, logo design, business cards, signs and property systems — one studio in Queens, NYC.',
      path: '/services/',
      schema,
    },
    active: 'services',
    body,
  });
}

export function servicePage(s) {
  const { services, allProjects } = DATA;
  const work = (s.work || []).map(slug => allProjects.find(p => p.slug === slug)).filter(Boolean);
  const related = services.filter(x => x.slug !== s.slug && x.group === s.group).concat(services.filter(x => x.group !== s.group)).slice(0, 3);
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.name,
      serviceType: s.name,
      description: s.description,
      url: `${SITE.origin}/services/${s.slug}/`,
      provider: { '@id': businessId, '@type': 'ProfessionalService', name: SITE.name },
      areaServed: AREAS.map(a => ({ '@type': 'Place', name: a })),
      hasOfferCatalog: { '@type': 'OfferCatalog', name: s.name, itemListElement: s.includes.map(i => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: i } })) },
    },
    faqSchema(s.faqs),
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }, { name: s.name, path: `/services/${s.slug}/` }]),
  ];
  const body = `
<section class="page-hero svc-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/services/">Services</a><span aria-hidden="true">/</span><span aria-current="page">${esc(s.menu)}</span></nav>
    <h1 class="page-hero__title page-hero__title--svc" data-reveal="chars">${esc(s.h1)}</h1>
    <p class="page-hero__lede">${esc(s.lede)}</p>
    <div class="svc-hero__row">
      <dl class="price price--row">
        ${s.price.map(([k, v, t]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd><dd class="price__t">${esc(t)}</dd></div>`).join('\n        ')}
      </dl>
      <div class="hero__ctas"><a class="btn btn--sun btn--lg" href="/contact/">Book a free call</a><a class="btn btn--line btn--lg" href="tel:${SITE.tel}">${SITE.phone}</a></div>
    </div>
  </div>
</section>

<section class="svc-detail">
  <div class="wrap svc-detail__in">
    <div class="svc-detail__body" data-reveal>
      ${s.body.map(p => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
    <div>
      <h2 class="svc-detail__h">What's included</h2>
      <ul class="ticks" data-reveal="stagger">${s.includes.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>
  </div>
</section>

${(s.photos || []).length ? `<section class="svc-photo">
  <div class="wrap svc-photo__grid${s.photos.length > 1 ? ' is-multi' : ''}" data-reveal="stagger">
    ${s.photos.map((ph, k) => `<figure class="svc-photo__fig${ph.contain ? ' is-shot' : ''}${k === 0 ? ' is-lead' : ''}">
      <img src="${ph.src}" alt="${esc(ph.alt)}" width="${ph.w || 1600}" height="${ph.h || 1066}" loading="lazy" decoding="async">
      <figcaption><span>${esc(ph.caption)}</span>${ph.project ? `<a class="link-arrow" href="/portfolio/${ph.project}/">See the project</a>` : ''}</figcaption>
    </figure>`).join('\n    ')}
  </div>
</section>` : ''}

${work.length ? `<section class="svc-work">
  <div class="wrap">
    <h2 data-reveal="lines">See it in our work</h2>
    <div class="mini-cases" data-reveal="stagger">
      ${work.map(projectCard).join('\n      ')}
    </div>
  </div>
</section>` : ''}

<section class="home-faq svc-faq">
  <div class="wrap split-head split-head--top">
    <h2 data-reveal="lines">${esc(s.menu)} questions</h2>
    ${faqList(s.faqs)}
  </div>
</section>

<section class="svc-related">
  <div class="wrap">
    <h2 data-reveal="lines">Pairs well with</h2>
    <ul class="svc-cards svc-cards--3" data-reveal="stagger">
      ${related.map(r => `<li><a class="svc-card" href="/services/${r.slug}/"><span class="svc-card__name">${esc(r.name)}</span><span class="svc-card__blurb">${esc(r.blurb)}</span><span class="svc-card__go">Explore ${esc(r.menu.toLowerCase())}</span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>`;
  return page({
    meta: { title: s.title, description: s.description, path: `/services/${s.slug}/`, schema },
    active: 'services',
    body,
    bodyClass: 'is-service',
  });
}
