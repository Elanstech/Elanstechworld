import { SITE, esc, page, businessSchema, breadcrumbSchema, faqSchema, faqList, businessId } from '../layout.mjs';

/* ─────────────────────────── WHY US ─────────────────────────── */
const WHY_FAQS = [
  { q: "Who is Elan's Tech World?", a: "Elan's Tech World is a full-service creative and digital studio based in Rego Park, Queens, serving all five boroughs of New York City and Long Island. Elan Cohen leads every project personally." },
  { q: 'What do you actually do?', a: 'Websites, SEO and Google Ads, Google Business Profiles, Instagram filming and management, cinematic video and photo editing, logos and branding, PR, business cards and flyers, circle and glass signs, QR stands and property management systems.' },
  { q: 'What makes you different?', a: 'One team runs your whole presence, and every website is hand-coded from a blank page — no WordPress themes, no Wix, no page builders. You receive the complete source code at handover.' },
  { q: 'What does it cost?', a: 'Business websites start at $2,000 and online stores at $3,500. Everything else is quoted after a free call as a fixed price, with no long-term contract.' },
];

export function whyUsPage() {
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
    <h1 class="page-hero__title" data-reveal="chars">Why us</h1>
    <p class="page-hero__lede">New York businesses hire us instead of a template builder, five separate vendors or a 40-person agency. Here's the honest version of why.</p>
  </div>
</section>

<section class="short-answer">
  <div class="wrap">
    <h2 data-reveal="lines">The short answer</h2>
    <dl class="qa">
      ${WHY_FAQS.map(f => `<div><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('\n      ')}
    </dl>
  </div>
</section>

<section class="reasons">
  <div class="wrap">
    <h2 data-reveal="lines">Six reasons, and how to check each one</h2>
    <ol class="reason-list">
      <li><h3>No templates. Ever.</h3><p>Every site starts as an empty file: no theme bloat, no plugin security holes, and no competitor two neighborhoods over running the same layout.</p><p class="reason-list__proof">Check it: open any project in our <a href="/portfolio/">portfolio</a> and browse it live.</p></li>
      <li><h3>You own it outright.</h3><p>At handover you get the complete source code. Host it anywhere, hire anyone to change it, keep it forever.</p><p class="reason-list__proof">Check it: source-code handover is written into every agreement, not sold as an upgrade.</p></li>
      <li><h3>Built to be found.</h3><p>Structured data, clean markup, fast loads, a sitemap and Search Console are part of the build, not a phase bolted on at the end.</p><p class="reason-list__proof">Check it: run any of our client sites through Google PageSpeed Insights.</p></li>
      <li><h3>You get Elan, not a queue.</h3><p>The person who scopes your project writes the code and answers the phone. No account managers, no ticket numbers, no junior handoff.</p><p class="reason-list__proof">Check it: <a href="tel:${SITE.tel}">${SITE.phone}</a> is a cell phone, not a switchboard.</p></li>
      <li><h3>One team for all of it.</h3><p>Website, SEO, Instagram, video, logo, business cards and signs — one brand standard from the search results to the front door, and one number to call when anything needs changing.</p><p class="reason-list__proof">Check it: every logo in our <a href="/portfolio/">portfolio</a> was designed here, then carried through the site.</p></li>
      <li><h3>Local, and it matters.</h3><p>We're in Rego Park. We know what New Yorkers search for, how local rankings work, and we can meet you in person.</p><p class="reason-list__proof">Check it: most of our clients are a subway or LIRR ride away.</p></li>
    </ol>
  </div>
</section>

<section class="compare-sec">
  <div class="wrap">
    <h2 data-reveal="lines">Your four real options</h2>
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
          <tr><th scope="row">What's included</th><td>A website, if you build it</td><td>One skill per hire</td><td>Everything, across many people</td><td class="is-us">Website, SEO, content, print and signs — one team</td></tr>
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
      <h2 data-reveal="lines">Hi — I'm Elan.</h2>
      <p>I started Elan's Tech World because too many New York business owners were being sold the same template twice and charged rent on it forever. I build the opposite: a site made for one business, handed over completely, and backed by a phone number that reaches me directly.</p>
      <p>I lead every project personally — the discovery call, the design, the code, the shoot and the marketing. That's why the standard doesn't drop between the pitch and the launch.</p>
      <a class="btn btn--sun" href="tel:${SITE.tel}">Call or text ${SITE.phone}</a>
    </div>
  </div>
</section>

<section class="areas">
  <div class="wrap">
    <h2 data-reveal="lines">Where we work</h2>
    <p class="areas__lede">Queens first, everywhere after. We're a subway ride from most clients and a video call from the rest.</p>
    <div class="areas__grid">
      ${areas.map(([b, ns]) => `<div><h3>${b}</h3><ul>${ns.map(n => `<li>${n}</li>`).join('')}</ul></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="commit">
  <div class="wrap">
    <h2 data-reveal="lines">Four things we put in writing</h2>
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
      title: "Why Us — Full-Service Studio in Queens, NYC | Elan's Tech World",
      description: "One team for your website, SEO, Instagram, branding, print and signs — led by Elan in Rego Park, Queens. Hand-coded sites you own, fixed prices, a direct line.",
      path: '/whyus/',
      schema,
    },
    active: 'whyus',
    body,
  });
}

/* ─────────────────────────── CONTACT ─────────────────────────── */
export function contactPage() {
  const needs = ['New website', 'Redesign', 'SEO & Google Ads', 'Google Business Profile', 'Instagram & filming', 'Video & photo', 'Logo & branding', 'Business cards & print', 'Signs & QR stands', 'Property management system', 'Not sure yet'];
  const schema = [
    businessSchema(),
    { '@context': 'https://schema.org', '@type': 'ContactPage', name: "Contact Elan's Tech World", url: `${SITE.origin}/contact/`, about: { '@id': businessId } },
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }]),
  ];
  const body = `
<section class="page-hero page-hero--tight">
  <div class="wrap">
    <h1 class="page-hero__title" data-reveal="chars">Tell us about your business.</h1>
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
      description: "Tell us about your business and book a free 30-minute call. Call or text (929) 417-6819 or email elan@elanstechworld.com. Full-service studio in Rego Park, Queens.",
      path: '/contact/',
      schema,
    },
    active: 'contact',
    body,
  });
}

/* ─────────────────────────── 404 ─────────────────────────── */
export function notFoundPage() {
  const body = `
<section class="page-hero nf">
  <div class="wrap">
    <h1 class="page-hero__title">This page moved or never existed.</h1>
    <p class="page-hero__lede">Try the work, the services, or just call — we'll point you in the right direction.</p>
    <div class="hero__ctas"><a class="btn btn--sun btn--lg" href="/">Go to the home page</a><a class="btn btn--line btn--lg" href="/portfolio/">See the work</a></div>
  </div>
</section>`;
  const html = page({ meta: { title: "Page not found | Elan's Tech World", description: 'This page could not be found.', path: '/404' }, active: '', body});
  return html.replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">');
}
