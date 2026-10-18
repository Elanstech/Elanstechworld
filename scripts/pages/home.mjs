import { SITE, esc, page, businessSchema, faqSchema, faqList } from '../layout.mjs';
import { shotImg, host } from '../media.mjs';

export const HOME_FAQS = [
  { q: 'How much does a website cost?', a: 'Business websites start at $2,000 and online stores at $3,500. After a free call you get a fixed quote, agreed before any work starts.' },
  { q: 'How long does it take to build a website?', a: 'Most business sites launch in two to four weeks once we have your content. Online stores usually take three to five weeks.' },
  { q: 'Do I own my website?', a: 'Yes. You receive the complete source code at handover. You can host it anywhere and have anyone work on it — there is no platform holding it hostage.' },
  { q: 'Will my website show up on Google?', a: 'Every build ships with technical SEO: fast load times, clean markup, structured data, a sitemap and Google Search Console setup. For competitive searches we also run ongoing SEO, Google Business Profile and Google Ads.' },
  { q: 'Do you build websites for medical and therapy practices?', a: 'Yes — much of our work is for physicians, psychologists, therapists and wellness practices, including secure intake and screening forms through HIPAA-compliant providers such as Jotform.' },
  { q: 'Do you only work with businesses in Queens?', a: 'No. We are based in Rego Park and work across all five boroughs and Long Island — in person or over video — and remotely with clients outside New York.' },
  { q: 'What happens after my site launches?', a: 'Every project includes 30 days of support. After that, care plans cover hosting, updates and changes, and you still reach Elan directly by phone or text.' },
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
    ink: p.palette[1]?.hex || '#111',
  }));
}

export function homePage(projects) {
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
            <h3><a href="/portfolio/${p.slug}/">${esc(p.name)}</a></h3>
            <p class="hs__meta"><span>${esc(p.type)}</span><span>${esc(p.location)}</span></p>
            <p>${esc(p.summary)}</p>
            <a class="link-arrow" href="/portfolio/${p.slug}/">See the case study</a>
          </div>
        </article>`).join('');

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero__in">
    <div class="seal" aria-hidden="true">
      <svg viewBox="0 0 200 200" width="200" height="200"><defs><path id="sealPath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/></defs><circle cx="100" cy="100" r="97" class="seal__ring"/><circle cx="100" cy="100" r="62" class="seal__ring"/><text class="seal__text"><textPath href="#sealPath" textLength="500" lengthAdjust="spacing">Hand-coded in New York · Rego Park, Queens ·&#160;</textPath></text></svg>
      <span class="seal__mark">ETW</span>
    </div>
    <h1 class="hero__title" id="hero-title">
      <span class="line"><span>We hand-code websites</span></span>
      <span class="line"><span>that make New York</span></span>
      <span class="line"><span>pick up the phone<span class="dot">.</span></span></span>
    </h1>
    <div class="hero__row">
      <p class="hero__lede">Elan's Tech World is a web studio in Rego Park, Queens. We design and write every site from a blank page — no templates, no page builders — then get it found on Google. Websites start at ${SITE.priceFrom}.</p>
      <div class="hero__ctas">
        <a class="btn btn--sun btn--lg" href="/contact/">Book a free call</a>
        <a class="btn btn--line btn--lg" href="/portfolio/">See the work</a>
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
    <p class="lb-note">Real client sites. The code on the left is each brand's actual color and type system, typed out the way we build: by hand.</p>
  </div>
  <script type="application/json" id="lbData">${JSON.stringify(liveBuildData(projects)).replace(/</g, '\\u003c')}</script>
</section>

<section class="work-hs" aria-labelledby="work-title">
  <div class="wrap work-hs__head">
    <h2 id="work-title">Recent work</h2>
    <p>Six live sites for medical practices, therapists, an accounting firm and a six-building co-op — across Queens, Long Island and Manhattan. Open any of them and click around.</p>
    <a class="link-arrow" href="/portfolio/">All projects</a>
  </div>
  <div class="hs" id="workScroll">
    <div class="hs__track">${panels}
      <article class="hs__panel hs__panel--end">
        <div class="hs__end">
          <p class="hs__end-big">Yours could be next.</p>
          <p>Tell us what your business does and who you want to reach. We'll show you what we'd build.</p>
          <a class="btn btn--sun btn--lg" href="/contact/">Start a project</a>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="services-list" aria-labelledby="svc-title">
  <div class="wrap">
    <div class="split-head">
      <h2 id="svc-title">What we do</h2>
      <p>One studio for the website and everything that brings people to it. You work with the person who builds it.</p>
    </div>
    <ul class="svc-rows">
      <li><a href="/services/#websites"><span class="svc-rows__t">Websites</span><span class="svc-rows__d">Custom design and hand-written code. Fast, mobile-first, and yours to keep.</span><span class="svc-rows__p">From $2,000</span></a></li>
      <li><a href="/services/#seo"><span class="svc-rows__t">SEO &amp; Google Ads</span><span class="svc-rows__d">Technical SEO, Google Business Profile and ad campaigns, so people nearby find you first.</span><span class="svc-rows__p">Monthly</span></a></li>
      <li><a href="/services/#social"><span class="svc-rows__t">Social &amp; marketing</span><span class="svc-rows__d">Instagram content and management that matches your website and your brand.</span><span class="svc-rows__p">Monthly</span></a></li>
      <li><a href="/services/#care"><span class="svc-rows__t">Hosting &amp; care</span><span class="svc-rows__d">Fast hosting, updates and changes after launch, handled by the person who built it.</span><span class="svc-rows__p">Monthly</span></a></li>
    </ul>
  </div>
</section>

<section class="process" aria-labelledby="process-title">
  <div class="wrap">
    <h2 id="process-title">How a project runs</h2>
    <ol class="steps">
      <li><span class="steps__n">1</span><h3>Free call</h3><p>Thirty minutes on your goals, your customers, your budget and your timeline.</p></li>
      <li><span class="steps__n">2</span><h3>Plan &amp; design</h3><p>A fixed quote, a page plan and a design you approve before any code is written.</p></li>
      <li><span class="steps__n">3</span><h3>Build</h3><p>Every page hand-coded, then tested on real phones, tablets and browsers.</p></li>
      <li><span class="steps__n">4</span><h3>Launch &amp; grow</h3><p>Search Console, sitemap and analytics on day one, then SEO, ads and care if you want them.</p></li>
    </ol>
  </div>
</section>

<section class="handmade" aria-labelledby="hand-title">
  <div class="wrap handmade__in">
    <h2 id="hand-title">Why hand-coded matters to your business</h2>
    <div class="handmade__grid">
      <div><h3>It loads fast</h3><p>No theme or plugin bloat. Pages ship only the code they need, and Google rewards fast sites in search.</p></div>
      <div><h3>It's only yours</h3><p>Template sites share a layout with thousands of others. Yours is designed around your business and nobody else's.</p></div>
      <div><h3>You own it</h3><p>Full source code at handover. Host it anywhere, change anything, never pay a platform to keep it online.</p></div>
    </div>
    <a class="btn btn--line" href="/whyus/">Why businesses choose us</a>
  </div>
</section>

<section class="home-faq" aria-labelledby="faq-title">
  <div class="wrap split-head split-head--top">
    <h2 id="faq-title">Questions we get asked</h2>
    ${faqList(HOME_FAQS)}
  </div>
</section>
`;

  return page({
    meta: {
      title: "Web Design NYC — Custom Hand-Coded Websites | Elan's Tech World",
      description: "Web design studio in Rego Park, Queens. Custom hand-coded websites, SEO and Google Ads for NYC businesses and practices. From $2,000. Call (929) 417-6819.",
      path: '/',
      schema,
      preload: [{ href: `/assets/work/${first.slug}/hero-1440.webp`, srcset: `/assets/work/${first.slug}/hero-1440.webp 1440w, /assets/work/${first.slug}/hero.webp 2880w`, sizes: '(min-width: 900px) 60vw, 92vw' }],
    },
    active: 'home',
    body,
    projects,
    bodyClass: 'is-home',
  });
}
