import { SITE, DATA, esc, page, businessSchema, faqSchema, faqList } from '../layout.mjs';
import { shotImg, host } from '../media.mjs';

export const HOME_FAQS = [
  { q: 'What does Elan\'s Tech World do?', a: 'We are a full-service studio in Rego Park, Queens. We design and build websites, run SEO, Google Ads and Google Business Profiles, film and manage Instagram, edit video and photos, design logos and brands, print business cards and flyers, make indoor signs and QR stands, and build property management systems.' },
  { q: 'How much does a website cost?', a: 'Business websites start at $2,000 and online stores at $3,500. Other services are quoted after a free call, and every quote is a fixed price agreed before work starts.' },
  { q: 'Can you manage our whole online presence?', a: 'Yes. Many clients hand us everything — website, Google Business Profile, SEO, Instagram and print — so it all stays consistent and they have one person to call.' },
  { q: 'Do you come to us to film for Instagram?', a: 'Yes. We write the scripts and shot lists, film on-site across New York City and Long Island, edit the reels and post them.' },
  { q: 'Do you design and print business cards and signs?', a: 'Yes — business cards, flyers, banners, circle logo signs, glass signs and QR stands are designed here and produced for you. Outdoor signs are available as part of a bundle.' },
  { q: 'Will my website show up on Google?', a: 'Every build ships with technical SEO: fast load times, clean markup, structured data, a sitemap and Google Search Console setup. For competitive searches we also run ongoing SEO, Google Business Profile and Google Ads.' },
  { q: 'Do I own my website and content?', a: 'Yes. You receive the complete source code of your website, and every video, photo and design we make for you is yours.' },
];

const varName = n => '--' + n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function liveBuildData(projects) {
  return projects.map(p => ({
    name: p.name,
    slug: p.slug,
    domain: host(p.liveUrl || p.browseUrl),
    where: `${p.type}, ${p.location}`,
    palette: p.palette.map(c => ({ v: varName(c.name), hex: c.hex })),
    display: p.fonts[0],
    body: p.bodyFont || p.fonts[p.fonts.length - 1],
    accent: p.fonts.find(f => f !== p.fonts[0] && f !== (p.bodyFont || p.fonts[p.fonts.length - 1])) || '',
    img: `/assets/work/${p.slug}/hero-1440.webp`,
    img2x: `/assets/work/${p.slug}/hero.webp`,
  }));
}

const ROTATE = ['websites', 'reels', 'brands', 'logos', 'flyers', 'signs'];

const TICKER = ['Websites', 'SEO', 'Google Business Profile', 'Instagram filming', 'Reel scripts', 'Cinematic video', 'Photo editing', 'Logo design', 'Branding', 'PR', 'Business cards', 'Flyers', 'Circle signs', 'Glass signs', 'QR stands', 'Property management systems'];

/* The journey: every place a customer meets the business, each drawn in CSS. */
const STAGES = [
  { t: 'They search', d: 'Someone nearby types what you do into Google. Your profile and your site are what they find.', s: [['seo', 'SEO & Google Ads'], ['google-business-profile', 'Google Business Profile']], v: 'search' },
  { t: 'They scroll', d: 'They check your Instagram. Scripted, filmed and edited reels show the real space and the real people.', s: [['social-media', 'Instagram & social'], ['video-production', 'Cinematic video']], v: 'insta' },
  { t: 'They click', d: 'Your website answers every question and makes booking, calling or buying one tap away.', s: [['web-design', 'Website design']], v: 'site' },
  { t: 'They remember', d: 'A logo they recognize, a business card they keep, a flyer on the fridge.', s: [['branding', 'Logo & branding'], ['print', 'Business cards & print']], v: 'card' },
  { t: 'They walk in', d: 'The circle sign on the door and the glass logo behind the desk confirm everything the website promised.', s: [['signage', 'Signs & QR stands']], v: 'sign' },
  { t: 'They come back', d: 'A QR stand turns a good visit into a Google review, and a steady profile keeps you at the top of the map.', s: [['google-business-profile', 'Reviews & profile'], ['property-management-systems', 'Systems & onboarding']], v: 'review' },
];

const visual = v => {
  switch (v) {
    case 'search': return `<div class="vz vz--search"><div class="vz-search__bar"><i></i><span>dentist near me</span></div><div class="vz-search__map"><span class="pin"></span><span class="pin pin--b"></span><span class="pin pin--c"></span></div><div class="vz-search__res"><b>Your Business</b><span class="stars">★★★★★</span><em>Open now · Rego Park</em><span class="vz-btns"><u>Website</u><u>Directions</u><u>Call</u></span></div></div>`;
    case 'insta': return `<div class="vz vz--insta"><div class="vz-phone"><div class="vz-insta__head"><span class="av">YB</span><span class="ln"></span></div><div class="vz-insta__grid">${Array.from({ length: 9 }, (_, i) => `<span class="t t${i % 5}">${i === 1 || i === 6 ? '<i class="play"></i>' : ''}</span>`).join('')}</div></div></div>`;
    case 'site': return `<div class="vz vz--site"><div class="vz-browser"><div class="vz-browser__bar"><i></i><i></i><i></i><span>yourbusiness.com</span></div><div class="vz-browser__hero"><span class="h1"></span><span class="h1 h1--b"></span><span class="p"></span><span class="cta">Book now</span></div><div class="vz-browser__cols"><span></span><span></span><span></span></div></div></div>`;
    case 'card': return `<div class="vz vz--card"><div class="vz-card vz-card--back"><span>YB</span></div><div class="vz-card vz-card--front"><b>Your Name</b><em>Founder</em><span class="mono">YB</span><small>yourbusiness.com</small></div></div>`;
    case 'sign': return `<div class="vz vz--sign"><div class="vz-wall"><div class="vz-circle"><i></i><i></i><i></i><i></i><span>YB</span><small>Your Business</small></div></div></div>`;
    default: return `<div class="vz vz--review"><div class="vz-stand"><div class="vz-qr">${Array.from({ length: 49 }, (_, i) => `<i${[0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 44, 45, 46, 47, 48, 9, 17, 24, 31, 37, 11, 19, 25].includes(i) ? ' class="on"' : ''}></i>`).join('')}</div><b>Scan to review</b><span class="stars">★★★★★</span></div></div>`;
  }
};

export function homePage() {
  const { projects, services } = DATA;
  const first = projects[0];
  const schema = [
    businessSchema(),
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE.origin}/#website`, name: SITE.name, url: `${SITE.origin}/`, publisher: { '@id': `${SITE.origin}/#business` } },
    faqSchema(HOME_FAQS),
  ];

  const tabs = projects.map((p, i) => `<button class="lb__tab" type="button" role="tab" aria-selected="${i === 0}" data-i="${i}">${esc(p.name)}</button>`).join('');

  const panels = projects.map((p, i) => `
        <article class="hs__panel">
          <a class="hs__media" href="/portfolio/${p.slug}/" aria-label="${esc(p.name)} case study">
            <div class="chrome"><span></span><span></span><span></span><em>${esc(host(p.liveUrl || p.browseUrl))}</em></div>
            ${shotImg(p, 'hero', { sizes: '(min-width: 900px) 62vw, 92vw', alt: `${p.name} website home page designed by Elan's Tech World`, lazy: i > 1 })}
          </a>
          <div class="hs__text">
            <p class="hs__count">${String(i + 1).padStart(2, '0')} of ${String(projects.length).padStart(2, '0')}</p>
            <img class="hs__logo" src="/assets/work/${p.slug}/logo.webp" alt="${esc(p.name)} logo" loading="lazy">
            <h3><a href="/portfolio/${p.slug}/">${esc(p.name)}</a></h3>
            <p class="hs__meta"><span>${esc(p.type)}</span><span>${esc(p.location)}</span></p>
            <p>${esc(p.summary)}</p>
            <a class="link-arrow" href="/portfolio/${p.slug}/">See the case study</a>
          </div>
        </article>`).join('');

  const tickerRow = TICKER.map(t => `<span>${esc(t)}</span><i aria-hidden="true">✦</i>`).join('');

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero__in">
    <div class="seal" aria-hidden="true">
      <svg viewBox="0 0 200 200" width="200" height="200"><defs><path id="sealPath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/></defs><circle cx="100" cy="100" r="97" class="seal__ring"/><circle cx="100" cy="100" r="62" class="seal__ring"/><text class="seal__text"><textPath href="#sealPath" textLength="500" lengthAdjust="spacing">Full-service studio · Rego Park, Queens ·&#160;</textPath></text></svg>
      <span class="seal__mark">ETW</span>
    </div>
    <h1 class="hero__title" id="hero-title">
      <span class="sr-only">We create the websites, reels, brands, logos, flyers and signs that make New York pick up the phone.</span>
      <span aria-hidden="true">
        <span class="line"><span>We create the <span class="rot" data-words='${JSON.stringify(ROTATE)}'><span class="rot__word">${ROTATE[0]}</span><span class="rot__caret"></span></span></span></span>
        <span class="line"><span>that make New York</span></span>
        <span class="line"><span>pick up the phone<span class="dot">.</span></span></span>
      </span>
    </h1>
    <div class="hero__row">
      <p class="hero__lede">Elan's Tech World is a full-service studio in Rego Park, Queens. Websites, SEO, Instagram filming, branding, print and signs — your whole online presence, run by one team, so you never juggle five vendors again.</p>
      <div class="hero__ctas">
        <a class="btn btn--sun btn--lg" href="/contact/">Book a free call</a>
        <a class="btn btn--line btn--lg" href="/services/">See all services</a>
      </div>
    </div>
  </div>

  <div class="lb-stage wrap" aria-label="Live build: real client sites and the code behind them">
    <div class="lb" id="liveBuild">
      <div class="lb__bar">
        <span class="lb__dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <div class="lb__tabs" role="tablist" aria-label="Client sites">${tabs}</div>
      </div>
      <div class="lb__body">
        <div class="lb__code" aria-hidden="true">
          <div class="lb__file"><span class="lb__file-name">brand.css</span><span class="lb__status"><i></i><span class="lb__status-t">writing</span></span></div>
          <pre><code id="lbCode"></code></pre>
        </div>
        <div class="lb__preview">
          <div class="lb__url"><span class="lb__lock" aria-hidden="true"></span><span id="lbUrl">${esc(host(first.liveUrl || first.browseUrl))}</span></div>
          <a class="lb__screen" id="lbLink" href="/portfolio/${first.slug}/">
            <img id="lbImgA" class="is-on" src="/assets/work/${first.slug}/hero-1440.webp" srcset="/assets/work/${first.slug}/hero-1440.webp 1440w, /assets/work/${first.slug}/hero.webp 2880w" sizes="(min-width: 900px) 60vw, 92vw" width="1440" height="900" alt="${esc(first.name)} website" fetchpriority="high">
            <img id="lbImgB" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="1440" height="900" alt="">
            <span class="lb__scan" aria-hidden="true"></span>
          </a>
        </div>
      </div>
    </div>
    <p class="lb-note">Real client sites. The code on the left is each brand's actual color and type system — every logo, site and system you see here was designed by us.</p>
  </div>
  <script type="application/json" id="lbData">${JSON.stringify(liveBuildData(projects)).replace(/</g, '\\u003c')}</script>
</section>

<div class="ticker" aria-hidden="true">
  <div class="ticker__row"><div class="ticker__track">${tickerRow}${tickerRow}</div></div>
  <div class="ticker__row ticker__row--rev"><div class="ticker__track">${tickerRow}${tickerRow}</div></div>
</div>

<section class="journey" aria-labelledby="journey-title">
  <div class="wrap">
    <div class="split-head">
      <h2 id="journey-title" data-reveal="lines">From the first search to the front door</h2>
      <p>Customers meet your business in six places before they become regulars. We design every one of them, so they all feel like the same brand.</p>
    </div>
    <div class="journey__grid">
      <div class="journey__stage" aria-hidden="true">
        <div class="journey__frame">
          ${STAGES.map((st, i) => `<div class="journey__vis${i === 0 ? ' is-on' : ''}" data-i="${i}">${visual(st.v)}</div>`).join('\n          ')}
        </div>
        <div class="journey__bar"><span></span></div>
      </div>
      <ol class="journey__steps">
        ${STAGES.map((st, i) => `<li class="journey__step${i === 0 ? ' is-on' : ''}" data-i="${i}">
          <div class="journey__mvis" aria-hidden="true">${visual(st.v)}</div>
          <span class="journey__n">${String(i + 1).padStart(2, '0')}</span>
          <h3>${esc(st.t)}</h3>
          <p>${esc(st.d)}</p>
          <p class="journey__svc">${st.s.map(([slug, label]) => `<a href="/services/${slug}/">${esc(label)}</a>`).join('')}</p>
        </li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>

<section class="work-hs" aria-labelledby="work-title">
  <div class="wrap work-hs__head">
    <h2 id="work-title" data-reveal="lines">Recent work</h2>
    <p>Six brands we built end to end — logo, website and more — for medical practices, therapists, an accounting firm and a six-building co-op across Queens, Long Island and Manhattan. Open any of them and click around.</p>
    <a class="link-arrow" href="/portfolio/">All projects</a>
  </div>
  <div class="hs" id="workScroll">
    <div class="hs__track">${panels}
      <article class="hs__panel hs__panel--end">
        <div class="hs__end">
          <p class="hs__end-big">Yours could be next.</p>
          <p>Tell us what your business does and who you want to reach. We'll show you what we'd build — from the logo to the sign on the door.</p>
          <a class="btn btn--sun btn--lg" href="/contact/">Start a project</a>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="logo-wall" aria-labelledby="logos-title">
  <div class="wrap">
    <div class="split-head">
      <h2 id="logos-title" data-reveal="lines">Logos we've designed</h2>
      <p>Every brand in our portfolio started here — then carried onto the website, Instagram, print and the front door.</p>
    </div>
    <ul class="logo-grid" data-reveal="stagger">
      ${projects.map(p => `<li><a href="/portfolio/${p.slug}/"><span class="logo-grid__tile"><img src="/assets/work/${p.slug}/logo.webp" alt="${esc(p.name)} logo designed by Elan's Tech World" loading="lazy"></span><span class="logo-grid__name">${esc(p.name)}</span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="services-list" aria-labelledby="svc-title">
  <div class="wrap">
    <div class="split-head">
      <h2 id="svc-title" data-reveal="lines">Everything, under one roof</h2>
      <p>One studio for the website and everything that brings people to it — and through your door. You work with the person who builds it.</p>
    </div>
    <ul class="svc-rows" data-reveal="stagger">
      ${services.map(s => `<li><a href="/services/${s.slug}/"><span class="svc-rows__t">${esc(s.menu)}</span><span class="svc-rows__d">${esc(s.blurb)}</span><span class="svc-rows__p">${esc(s.group)}</span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="process" aria-labelledby="process-title">
  <div class="wrap">
    <h2 id="process-title" data-reveal="lines">How a project runs</h2>
    <ol class="steps" data-reveal="steps">
      <li><span class="steps__n">1</span><h3>Free call</h3><p>Thirty minutes on your goals, your customers, your budget and your timeline.</p></li>
      <li><span class="steps__n">2</span><h3>Plan &amp; design</h3><p>A fixed quote, a plan, and designs you approve — logo, site, posts or signs — before anything is built or printed.</p></li>
      <li><span class="steps__n">3</span><h3>Build &amp; shoot</h3><p>Every page hand-coded and tested on real phones. Filming, editing and print proofs run alongside.</p></li>
      <li><span class="steps__n">4</span><h3>Launch &amp; grow</h3><p>Go live with Search Console, analytics and your profiles set up — then SEO, posts and care each month.</p></li>
    </ol>
  </div>
</section>

<section class="handmade" aria-labelledby="hand-title">
  <div class="wrap handmade__in">
    <h2 id="hand-title" data-reveal="lines">Why one studio beats five vendors</h2>
    <div class="handmade__grid" data-reveal="stagger">
      <div><h3>One brand, everywhere</h3><p>The same colors, type and voice on your website, Instagram, business cards and signs — because the same people made all of them.</p></div>
      <div><h3>One number to call</h3><p>A website change, a new flyer, a sign proof, a reel idea: you text Elan. No ticket queue, no finger-pointing between vendors.</p></div>
      <div><h3>It all works together</h3><p>QR stands bring in the reviews your Google profile needs. Reels point to the website. The website is hand-coded to rank. Every piece feeds the next.</p></div>
    </div>
    <a class="btn btn--line" href="/whyus/">Why businesses choose us</a>
  </div>
</section>

<section class="home-faq" aria-labelledby="faq-title">
  <div class="wrap split-head split-head--top">
    <h2 id="faq-title" data-reveal="lines">Questions we get asked</h2>
    ${faqList(HOME_FAQS)}
  </div>
</section>
`;

  return page({
    meta: {
      title: "Web Design, SEO & Social Media Agency in Queens | Elan's Tech World",
      description: 'Full-service studio in Queens, NYC: website design, SEO, Instagram filming, branding, business cards and signs for New York businesses. Call (929) 417-6819.',
      path: '/',
      schema,
      preload: [{ href: `/assets/work/${first.slug}/hero-1440.webp`, srcset: `/assets/work/${first.slug}/hero-1440.webp 1440w, /assets/work/${first.slug}/hero.webp 2880w`, sizes: '(min-width: 900px) 60vw, 92vw' }],
    },
    active: 'home',
    body,
    bodyClass: 'is-home',
  });
}
