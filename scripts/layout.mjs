// Shared page shell: <head>, header (with services mega menu), footer. Used by every generated page.
import fs from 'node:fs';
import crypto from 'node:crypto';

export const SITE = {
  origin: 'https://www.elanstechworld.com',
  name: "Elan's Tech World",
  founder: 'Elan Cohen',
  phone: '(929) 417-6819',
  tel: '+19294176819',
  email: 'elan@elanstechworld.com',
  instagram: 'https://www.instagram.com/elan_tech_world/',
  instagramHandle: '@elan_tech_world',
  area: 'Rego Park, Queens, NY',
  priceFrom: '$2,000',
};

// Filled in by build.mjs so the header/footer can list every service and project.
export const DATA = { projects: [], services: [], groups: [] };

// Content hash per asset so browsers fetch fresh CSS/JS after every deploy.
const ver = rel => { try { return crypto.createHash('sha1').update(fs.readFileSync(new URL(`../${rel}`, import.meta.url))).digest('hex').slice(0, 8); } catch { return '1'; } };
const CSS_V = ver('css/site.css');
const JS_V = ver('js/site.js');

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const businessId = `${SITE.origin}/#business`;

export const businessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': businessId,
  name: SITE.name,
  description:
    "Full-service creative and digital agency in Rego Park, Queens: website design, SEO, Google Business Profile, Instagram filming and management, cinematic video, logo design and branding, business card and flyer printing, signs and property management systems.",
  url: `${SITE.origin}/`,
  logo: `${SITE.origin}/assets/images/Elanslogo.jpeg`,
  image: `${SITE.origin}/assets/images/og-image.jpg`,
  telephone: '+1-929-417-6819',
  email: SITE.email,
  founder: { '@type': 'Person', name: SITE.founder },
  address: { '@type': 'PostalAddress', addressLocality: 'Rego Park', addressRegion: 'NY', postalCode: '11374', addressCountry: 'US' },
  geo: { '@type': 'GeoCoordinates', latitude: 40.7264, longitude: -73.8616 },
  areaServed: [
    { '@type': 'City', name: 'New York City' },
    { '@type': 'AdministrativeArea', name: 'Queens' },
    { '@type': 'AdministrativeArea', name: 'Brooklyn' },
    { '@type': 'AdministrativeArea', name: 'Manhattan' },
    { '@type': 'AdministrativeArea', name: 'The Bronx' },
    { '@type': 'AdministrativeArea', name: 'Staten Island' },
    { '@type': 'AdministrativeArea', name: 'Long Island' },
  ],
  knowsAbout: ['Web design', 'Web development', 'Search engine optimization', 'Local SEO', 'Google Ads', 'Google Business Profile', 'Instagram marketing', 'Social media management', 'Video production', 'Photo editing', 'Logo design', 'Branding', 'Public relations', 'Business card printing', 'Flyer design', 'Signage', 'QR code stands', 'Property management systems'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: DATA.services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: `${SITE.origin}/services/${s.slug}/` } })),
  },
  priceRange: '$$',
  sameAs: [SITE.instagram],
});

const NAV = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/portfolio/', label: 'Work', key: 'work' },
  { href: '/services/', label: 'Services', key: 'services', mega: true },
  { href: '/whyus/', label: 'Why us', key: 'whyus' },
  { href: '/contact/', label: 'Contact', key: 'contact' },
];

export function head({ title, description, path, image, schema = [], preload = [], extraHead = '' }) {
  const url = `${SITE.origin}${path}`;
  const og = image || `${SITE.origin}/assets/images/og-image.jpg`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#fbf8f2">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${og}">
<meta name="geo.region" content="US-NY">
<meta name="geo.placename" content="Rego Park, Queens, New York">
<link rel="icon" href="/assets/favicon/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon/favicon-96x96.png" sizes="96x96" type="image/png">
<link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png">
<link rel="manifest" href="/assets/favicon/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/css/site.css?v=${CSS_V}">
<script>(function(d){d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');setTimeout(function(){if(!window.__motionOK)d.classList.remove('motion')},3000)}})(document.documentElement)</script>
${preload.map(p => `<link rel="preload" as="image" href="${p.href}"${p.srcset ? ` imagesrcset="${p.srcset}" imagesizes="${p.sizes || '100vw'}"` : ''} fetchpriority="high">`).join('\n')}
${schema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n')}
${extraHead}
</head>`;
}

function megaMenu() {
  const { services, groups, projects } = DATA;
  const feat = projects[0];
  return `<div class="mega" id="megaMenu" hidden>
    <div class="wrap mega__in">
      ${groups.map(g => `<div class="mega__col">
        <p class="mega__group">${esc(g)}</p>
        <ul>
          ${services.filter(s => s.group === g).map(s => `<li><a href="/services/${s.slug}/"><span class="mega__name">${esc(s.menu)}</span><span class="mega__blurb">${esc(s.blurb)}</span></a></li>`).join('\n          ')}
        </ul>
      </div>`).join('\n      ')}
      <a class="mega__feature" href="/portfolio/${feat.slug}/">
        <span class="mega__feature-logo"><img src="/assets/work/${feat.slug}/logo.webp" alt="" loading="lazy" width="120" height="120"></span>
        <span class="mega__feature-k">Latest project</span>
        <span class="mega__feature-t">${esc(feat.name)}</span>
        <span class="mega__feature-d">Logo, website, screening flow and Instagram — one studio.</span>
      </a>
    </div>
    <div class="wrap mega__foot"><a href="/services/">All services</a><span>One studio for your whole online presence — from the first Google search to the sign on your door.</span></div>
  </div>`;
}

export function header(active) {
  const { services, groups } = DATA;
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header" id="top">
  <div class="wrap site-header__in">
    <a class="brand" href="/" aria-label="${esc(SITE.name)} home">
      <img src="/assets/images/etw-logo.webp" alt="" width="53" height="54">
      <span class="brand__name">Elan's Tech World<small>Full-service studio, Queens NYC</small></span>
    </a>
    <nav class="nav" aria-label="Main">
      <ul>
        ${NAV.map(n => n.mega
          ? `<li class="nav__mega"><a href="${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a><button class="nav__toggle" type="button" aria-expanded="false" aria-controls="megaMenu" aria-label="Show all services"><i aria-hidden="true"></i></button></li>`
          : `<li><a href="${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <div class="site-header__actions">
      <a class="site-header__phone" href="tel:${SITE.tel}">${SITE.phone}</a>
      <a class="btn btn--sun btn--sm" href="/contact/">Book a free call</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Open menu"><span></span><span></span></button>
    </div>
  </div>
  <span class="site-header__progress" aria-hidden="true"></span>
  ${megaMenu()}
</header>
  <div class="mobile-nav" id="mobileNav" hidden>
    <ul class="mobile-nav__main">
      ${NAV.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('\n      ')}
    </ul>
    <div class="mobile-nav__services">
      ${groups.map(g => `<div><p>${esc(g)}</p><ul>${services.filter(s => s.group === g).map(s => `<li><a href="/services/${s.slug}/">${esc(s.menu)}</a></li>`).join('')}</ul></div>`).join('\n      ')}
    </div>
    <div class="mobile-nav__contact">
      <a class="btn btn--sun" href="/contact/">Book a free call</a>
      <a href="tel:${SITE.tel}">Call or text ${SITE.phone}</a>
    </div>
  </div>`;
}

export function footer() {
  const { projects, services } = DATA;
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="site-footer__cta">
      <h2 data-reveal="lines">Let's build the presence your business deserves.</h2>
      <div class="site-footer__actions">
        <a class="btn btn--sun btn--lg" href="/contact/">Book a free call</a>
        <a class="btn btn--line btn--lg" href="tel:${SITE.tel}">${SITE.phone}</a>
      </div>
    </div>
    <div class="site-footer__grid">
      <div>
        <p class="site-footer__about">A full-service studio in Rego Park, Queens: websites, SEO, Instagram, video, branding, print and signs — your whole online presence, managed by one team across the five boroughs and Long Island.</p>
      </div>
      <nav aria-label="Footer: services">
        <h3>Services</h3>
        <ul>
          ${services.map(s => `<li><a href="/services/${s.slug}/">${esc(s.menu)}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <nav aria-label="Footer: recent work">
        <h3>Recent work</h3>
        <ul>
          ${projects.map(p => `<li><a href="/portfolio/${p.slug}/">${esc(p.name)}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <div>
        <h3>Studio</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/whyus/">Why us</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/shop/">Shop</a></li>
          <li><a href="tel:${SITE.tel}">${SITE.phone}</a></li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li><a href="${SITE.instagram}" rel="noopener" target="_blank">Instagram ${SITE.instagramHandle}</a></li>
          <li>Rego Park, Queens, NY</li>
        </ul>
      </div>
    </div>
    <p class="site-footer__word" aria-hidden="true">${"Elan's Tech World".split('').map(c => `<span>${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')}</p>
    <div class="site-footer__base">
      <p>© ${year} Elan's Tech World. Every page of this site was written by hand.</p>
      <a href="#top">Back to top</a>
    </div>
  </div>
</footer>`;
}

export function scripts({ extra = '' } = {}) {
  return `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js" defer></script>
<script src="/js/site.js?v=${JS_V}" defer></script>
${extra}`;
}

export function page({ meta, active, body, bodyClass = '', extraScripts = '' }) {
  return `${head(meta)}
<body class="${bodyClass}">
${header(active)}
<main id="main">
${body}
</main>
${footer()}
${scripts({ extra: extraScripts })}
</body>
</html>
`;
}

export const breadcrumbSchema = items => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE.origin}${it.path}` })),
});

export const faqSchema = faqs => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const faqList = faqs => `<div class="faq" data-reveal="stagger">
${faqs.map(f => `  <details class="faq__item">
    <summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary>
    <div class="faq__a"><p>${esc(f.a)}</p></div>
  </details>`).join('\n')}
</div>`;
