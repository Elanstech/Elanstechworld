import { SITE, esc, page, businessSchema, breadcrumbSchema, faqSchema, faqList, businessId } from '../layout.mjs';

/* ─────────────────────────── SERVICES ─────────────────────────── */
export function servicesPage(projects) {
  const services = [
    { id: 'websites', name: 'Web design & development', short: 'Websites' },
    { id: 'seo', name: 'SEO, local search & Google Ads', short: 'SEO & Google Ads' },
    { id: 'social', name: 'Social media & marketing', short: 'Social & marketing' },
    { id: 'brand', name: 'Brand identity & print', short: 'Brand & print' },
    { id: 'care', name: 'Website hosting & care', short: 'Hosting & care' },
  ];
  const schema = [
    businessSchema(),
    ...services.map(s => ({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.name,
      serviceType: s.name,
      provider: { '@id': businessId },
      areaServed: ['New York City', 'Queens', 'Brooklyn', 'Manhattan', 'Long Island'],
      url: `${SITE.origin}/services/#${s.id}`,
    })),
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }]),
  ];

  const body = `
<section class="page-hero">
  <div class="wrap">
    <h1 class="page-hero__title">Services</h1>
    <p class="page-hero__lede">The website first — then everything that brings people to it. One studio, one phone number, and no account managers between you and the person doing the work.</p>
    <nav class="jump" aria-label="On this page">
      ${services.map(s => `<a href="#${s.id}">${s.short}</a>`).join('\n      ')}
    </nav>
  </div>
</section>

<section class="svc" id="websites">
  <div class="wrap svc__in">
    <div class="svc__head">
      <h2>Websites</h2>
      <p class="svc__lede">Designed around your business, written by hand from a blank page, and built to turn visitors into calls, bookings and sales.</p>
      <dl class="price">
        <div><dt>Business websites</dt><dd>From $2,000</dd><dd class="price__t">2–4 weeks</dd></div>
        <div><dt>Online stores</dt><dd>From $3,500</dd><dd class="price__t">3–5 weeks</dd></div>
      </dl>
      <a class="btn btn--sun" href="/contact/">Get a fixed quote</a>
    </div>
    <div class="svc__body">
      <h3>Every website includes</h3>
      <ul class="ticks">
        <li>A design you approve before any code is written</li>
        <li>Hand-coded, mobile-first pages, tested on real phones and browsers</li>
        <li>Technical SEO built in: fast loads, structured data, sitemap and Google Search Console</li>
        <li>Contact, booking and intake forms — including HIPAA-compliant options for medical practices</li>
        <li>Analytics and conversion tracking</li>
        <li>30 days of support after launch, directly with Elan</li>
        <li>The full source code, yours to keep</li>
      </ul>
      <h3>Who we build for</h3>
      <ul class="chips chips--lg">
        <li>Medical &amp; wellness practices</li><li>Therapists &amp; psychologists</li><li>Med spas &amp; IV clinics</li><li>Accountants &amp; law firms</li><li>Co-ops &amp; property managers</li><li>Salons &amp; local retail</li>
      </ul>
      <p class="svc__proof">See it in practice: <a href="/portfolio/alpha-vital-elite-iv/">Alpha Vital Elite IV</a>, <a href="/portfolio/cohen-associates/">Cohen &amp; Associates</a>, <a href="/portfolio/park-city-34/">Park City 3 &amp; 4</a>.</p>
    </div>
  </div>
</section>

<section class="svc svc--tint" id="seo">
  <div class="wrap svc__in">
    <div class="svc__head">
      <h2>SEO &amp; Google Ads</h2>
      <p class="svc__lede">Get found by people nearby who are already searching for what you do — first through Google Ads, then through search rankings that compound over time.</p>
      <dl class="price"><div><dt>Monthly management</dt><dd>Month to month</dd><dd class="price__t">No long contracts</dd></div></dl>
      <a class="btn btn--sun" href="/contact/">Ask for a free audit</a>
    </div>
    <div class="svc__body">
      <h3>What we run</h3>
      <ul class="ticks">
        <li>Technical SEO audits and fixes: speed, structure, schema and indexing</li>
        <li>Local SEO and Google Business Profile setup and upkeep</li>
        <li>Service and neighborhood pages written to rank</li>
        <li>Google Ads search campaigns with call and form tracking</li>
        <li>Plain-English monthly reports: spend, leads and cost per lead</li>
        <li>Your ad account always stays in your name</li>
      </ul>
    </div>
  </div>
</section>

<section class="svc" id="social">
  <div class="wrap svc__in">
    <div class="svc__head">
      <h2>Social &amp; marketing</h2>
      <p class="svc__lede">Instagram and marketing that look and sound like your website, so every touchpoint feels like the same business.</p>
      <a class="btn btn--sun" href="/contact/">Talk about marketing</a>
    </div>
    <div class="svc__body">
      <h3>What's included</h3>
      <ul class="ticks">
        <li>Instagram content planning, design and posting</li>
        <li>Graphics and templates in your brand colors and type</li>
        <li>Campaigns coordinated with your website and Google Ads</li>
        <li>Google Business Profile posts and photo updates</li>
      </ul>
    </div>
  </div>
</section>

<section class="svc svc--tint" id="brand">
  <div class="wrap svc__in">
    <div class="svc__head">
      <h2>Brand &amp; print</h2>
      <p class="svc__lede">A logo and identity that carry from the search results page to the business card to the front door.</p>
      <a class="btn btn--sun" href="/contact/">Start a brand project</a>
    </div>
    <div class="svc__body">
      <h3>What we design</h3>
      <ul class="ticks">
        <li>Logos, color palettes and type systems</li>
        <li>Business cards, brochures, menus and flyers</li>
        <li>Storefront, interior and window signage</li>
        <li>Point-of-sale setup on request: Square, Clover and Toast</li>
      </ul>
    </div>
  </div>
</section>

<section class="svc" id="care">
  <div class="wrap svc__in">
    <div class="svc__head">
      <h2>Hosting &amp; care</h2>
      <p class="svc__lede">Your site stays fast, secure and up to date — and when you need a change, you text the person who built it.</p>
      <a class="btn btn--sun" href="/contact/">Ask about care plans</a>
    </div>
    <div class="svc__body">
      <h3>What's covered</h3>
      <ul class="ticks">
        <li>Fast, secure hosting with SSL on a global network</li>
        <li>Content updates, new pages and fixes</li>
        <li>Form and uptime checks</li>
        <li>A direct line to Elan — no ticket queue</li>
      </ul>
    </div>
  </div>
</section>
`;
  return page({
    meta: {
      title: "Web Design, SEO & Google Ads Services in NYC | Elan's Tech World",
      description: 'Custom hand-coded websites from $2,000, SEO, Google Ads, social media, branding and website care for New York businesses. Based in Rego Park, Queens.',
      path: '/services/',
      schema,
    },
    active: 'services',
    body,
    projects,
  });
}

/* ─────────────────────────── WHY US ─────────────────────────── */
const WHY_FAQS = [
  { q: "Who is Elan's Tech World?", a: "Elan's Tech World is a web design and digital marketing studio based in Rego Park, Queens, serving all five boroughs of New York City and Long Island. Elan Cohen designs and builds the work himself." },
  { q: 'What makes you different?', a: 'Every website is hand-coded from a blank page — no WordPress themes, no Wix, no Squarespace, no page builders — and every client receives the complete source code at handover.' },
  { q: 'What does a website cost?', a: 'Business websites start at $2,000 and online stores at $3,500. You get a fixed quote before work starts, and no long-term contract is required.' },
  { q: 'What happens after launch?', a: "Every project includes 30 days of post-launch support and Elan's direct number. Hosting and care plans, SEO and Google Ads management are available month to month." },
];

export function whyUsPage(projects) {
  const schema = [businessSchema(), faqSchema(WHY_FAQS), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Why us', path: '/whyus/' }])];
  const areas = [
    ['Queens', ['Rego Park', 'Forest Hills', 'Kew Gardens', 'Middle Village', 'Jackson Heights', 'Astoria', 'Flushing', 'Bayside', 'Long Island City']],
    ['Manhattan', ['Midtown', 'Financial District', 'Upper East Side', 'Upper West Side', 'Chelsea', 'Harlem']],
    ['Brooklyn', ['Williamsburg', 'Park Slope', 'Bay Ridge', 'Brighton Beach', 'Downtown Brooklyn']],
    ['Long Island', ['Great Neck', 'Mineola', 'Hauppauge', 'Patchogue', 'Hempstead']],
  ];
  const body = `
<section class="page-hero">
  <div class="wrap">
    <h1 class="page-hero__title">Why us</h1>
    <p class="page-hero__lede">New York businesses hire us instead of a template builder, a marketplace freelancer or a 40-person agency. Here's the honest version of why.</p>
  </div>
</section>

<section class="short-answer">
  <div class="wrap">
    <h2>The short answer</h2>
    <dl class="qa">
      ${WHY_FAQS.map(f => `<div><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('\n      ')}
    </dl>
  </div>
</section>

<section class="reasons">
  <div class="wrap">
    <h2>Five reasons, and how to check each one</h2>
    <ol class="reason-list">
      <li><h3>No templates. Ever.</h3><p>Every site starts as an empty file: no theme bloat, no plugin security holes, and no competitor two neighborhoods over running the same layout.</p><p class="reason-list__proof">Check it: open any project in our <a href="/portfolio/">portfolio</a> and browse it live.</p></li>
      <li><h3>You own it outright.</h3><p>At handover you get the complete source code. Host it anywhere, hire anyone to change it, keep it forever.</p><p class="reason-list__proof">Check it: source-code handover is written into every agreement, not sold as an upgrade.</p></li>
      <li><h3>Built to be found.</h3><p>Structured data, clean markup, fast loads, a sitemap and Search Console are part of the build, not a phase bolted on at the end.</p><p class="reason-list__proof">Check it: run any of our client sites through Google PageSpeed Insights.</p></li>
      <li><h3>You get Elan, not a queue.</h3><p>The person who scopes your project writes the code and answers the phone. No account managers, no ticket numbers, no junior handoff.</p><p class="reason-list__proof">Check it: <a href="tel:${SITE.tel}">${SITE.phone}</a> is a cell phone, not a switchboard.</p></li>
      <li><h3>Local, and it matters.</h3><p>We're in Rego Park. We know what New Yorkers search for, how local rankings work, and we can meet you in person.</p><p class="reason-list__proof">Check it: most of our clients are a subway or LIRR ride away.</p></li>
    </ol>
  </div>
</section>

<section class="compare-sec">
  <div class="wrap">
    <h2>Your four real options</h2>
    <p class="compare-sec__lede">Each one is right for somebody. Here's how to tell which one is you.</p>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Comparison of website options">
      <table class="compare">
        <thead><tr><th scope="col"><span class="sr-only">Compared</span></th><th scope="col">DIY builder<small>Wix, Squarespace</small></th><th scope="col">Marketplace freelancer<small>Fiverr, Upwork</small></th><th scope="col">Large agency<small>20–100 staff</small></th><th scope="col" class="is-us">Elan's Tech World<small>Rego Park, NYC</small></th></tr></thead>
        <tbody>
          <tr><th scope="row">Typical cost</th><td>A monthly fee, forever</td><td>$300–$1,500</td><td>$15,000–$60,000</td><td class="is-us">From $2,000, one time</td></tr>
          <tr><th scope="row">Built from</th><td>A template</td><td>Usually a template</td><td>Custom</td><td class="is-us">A blank page</td></tr>
          <tr><th scope="row">Who you talk to</th><td>A help center</td><td>Chat, often another time zone</td><td>An account manager</td><td class="is-us">The developer, by cell</td></tr>
          <tr><th scope="row">Source code</th><td>Not yours</td><td>Sometimes</td><td>Negotiated</td><td class="is-us">Yours, always</td></tr>
          <tr><th scope="row">SEO</th><td>Basic settings</td><td>Rarely</td><td>Yes, billed separately</td><td class="is-us">Built in from the first line</td></tr>
          <tr><th scope="row">Timeline</th><td>Your weekends</td><td>1–3 weeks</td><td>3–6 months</td><td class="is-us">2–4 weeks</td></tr>
        </tbody>
      </table>
    </div>
    <p class="fine">Ranges reflect typical New York market pricing in 2026.</p>
  </div>
</section>

<section class="founder">
  <div class="wrap founder__in">
    <div class="founder__mark"><img src="/assets/images/Elanslogo.jpeg" alt="Elan's Tech World logo" width="220" height="220" loading="lazy"></div>
    <div>
      <h2>Hi — I'm Elan.</h2>
      <p>I started Elan's Tech World because too many New York business owners were being sold the same template twice and charged rent on it forever. I build the opposite: a site made for one business, handed over completely, and backed by a phone number that reaches me directly.</p>
      <p>I do the discovery call, the design, the code and the marketing. That's why the standard doesn't drop between the pitch and the launch — there's nobody to hand it off to.</p>
      <a class="btn btn--sun" href="tel:${SITE.tel}">Call or text ${SITE.phone}</a>
    </div>
  </div>
</section>

<section class="areas">
  <div class="wrap">
    <h2>Where we work</h2>
    <p class="areas__lede">Queens first, everywhere after. We're a subway ride from most clients and a video call from the rest.</p>
    <div class="areas__grid">
      ${areas.map(([b, ns]) => `<div><h3>${b}</h3><ul>${ns.map(n => `<li>${n}</li>`).join('')}</ul></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="commit">
  <div class="wrap">
    <h2>Four things we put in writing</h2>
    <ul class="commit__list">
      <li><h3>You own everything</h3><p>Complete source code at handover. No lock-in, no exceptions.</p></li>
      <li><h3>A fixed price, agreed first</h3><p>The number in the proposal is the number on the invoice. Changes are quoted before work starts.</p></li>
      <li><h3>Nothing ships half-built</h3><p>Tested across phones, tablets and desktop browsers, speed-checked and secured before launch.</p></li>
      <li><h3>Thirty days, then a real answer</h3><p>A month of support after launch, and after that you still reach the person who built it.</p></li>
    </ul>
  </div>
</section>
`;
  return page({
    meta: {
      title: "Why Us — Hand-Coded Web Design in Queens | Elan's Tech World",
      description: "Hand-coded websites you own outright, built by Elan in Rego Park, Queens. No templates, fixed prices from $2,000, SEO built in, a direct line to the developer.",
      path: '/whyus/',
      schema,
    },
    active: 'whyus',
    body,
    projects,
  });
}

/* ─────────────────────────── CONTACT ─────────────────────────── */
export function contactPage(projects) {
  const needs = ['New website', 'Redesign', 'Online store', 'SEO', 'Google Ads', 'Social media', 'Branding & print', 'Not sure yet'];
  const schema = [
    businessSchema(),
    { '@context': 'https://schema.org', '@type': 'ContactPage', name: "Contact Elan's Tech World", url: `${SITE.origin}/contact/`, about: { '@id': businessId } },
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }]),
  ];
  const body = `
<section class="page-hero page-hero--tight">
  <div class="wrap">
    <h1 class="page-hero__title">Tell us about your business.</h1>
    <p class="page-hero__lede">A few lines is plenty. Elan replies personally, usually the same day.</p>
  </div>
</section>

<section class="contact">
  <div class="wrap contact__in">
    <form class="form" id="contactForm" novalidate>
      <div class="form__row">
        <label class="field"><span>Your name</span><input name="name" autocomplete="name" required></label>
        <label class="field"><span>Business name</span><input name="business" autocomplete="organization"></label>
      </div>
      <div class="form__row">
        <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
        <label class="field"><span>Phone <em>(optional)</em></span><input name="phone" type="tel" autocomplete="tel"></label>
      </div>
      <fieldset class="field">
        <legend>What do you need?</legend>
        <div class="pick">
          ${needs.map(n => `<label><input type="checkbox" name="needs" value="${esc(n)}"><span>${esc(n)}</span></label>`).join('\n          ')}
        </div>
      </fieldset>
      <div class="form__row">
        <label class="field"><span>Current website <em>(optional)</em></span><input name="website" type="url" inputmode="url" placeholder="https://"></label>
        <label class="field"><span>Budget</span>
          <select name="budget"><option value="">Choose one</option><option>Under $2,000</option><option>$2,000–$5,000</option><option>$5,000–$10,000</option><option>$10,000+</option><option>Not sure yet</option></select>
        </label>
      </div>
      <label class="field"><span>Tell us a little about the project</span><textarea name="message" rows="5" required></textarea></label>
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="form__foot">
        <button class="btn btn--sun btn--lg" type="submit">Send message</button>
        <p class="form__note">No spam, no mailing list, no reselling your details.</p>
      </div>
      <p class="form__status" role="status" aria-live="polite"></p>
    </form>

    <aside class="contact__side">
      <div class="contact__card">
        <h2>Rather talk?</h2>
        <a class="contact__big" href="tel:${SITE.tel}">${SITE.phone}</a>
        <p>Call or text — it's Elan's cell.</p>
        <ul>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram ${SITE.instagramHandle}</a></li>
          <li>Rego Park, Queens, NY</li>
        </ul>
      </div>
      <div class="contact__next">
        <h2>What happens next</h2>
        <ol class="steps steps--compact">
          <li><span class="steps__n">1</span><p>Elan reads your message and replies, usually the same day.</p></li>
          <li><span class="steps__n">2</span><p>A free 30-minute call about your goals and budget.</p></li>
          <li><span class="steps__n">3</span><p>A fixed quote and plan — no obligation.</p></li>
        </ol>
      </div>
    </aside>
  </div>
</section>
`;
  return page({
    meta: {
      title: "Contact — Book a Free Website Consultation | Elan's Tech World",
      description: "Tell us about your business and book a free 30-minute call. Call or text (929) 417-6819 or email elan@elanstechworld.com. Web design studio in Rego Park, Queens.",
      path: '/contact/',
      schema,
    },
    active: 'contact',
    body,
    projects,
  });
}

/* ─────────────────────────── 404 ─────────────────────────── */
export function notFoundPage(projects) {
  const body = `
<section class="page-hero nf">
  <div class="wrap">
    <h1 class="page-hero__title">This page moved or never existed.</h1>
    <p class="page-hero__lede">Try the work, the services, or just call — we'll point you in the right direction.</p>
    <div class="hero__ctas"><a class="btn btn--sun btn--lg" href="/">Go to the home page</a><a class="btn btn--line btn--lg" href="/portfolio/">See the work</a></div>
  </div>
</section>`;
  const html = page({ meta: { title: "Page not found | Elan's Tech World", description: 'This page could not be found.', path: '/404' }, active: '', body, projects });
  return html.replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">');
}
