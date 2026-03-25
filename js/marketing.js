/**
 * ═══════════════════════════════════════════════════════════════
 *  DIGITAL MARKETING LANDING PAGE — Premium Interactions Engine
 *  Live dashboard KPI counters · Chart bar animations ·
 *  Funnel fill progress · Particle field · Text strike effect ·
 *  Dashboard parallax · Notification popups · Step activation ·
 *  FAQ accordion · Cursor glow · Magnetic buttons
 * ═══════════════════════════════════════════════════════════════
 */

// ─── UTILITIES ────────────────────────────────────────────────
const mkQ = (s, p = document) => p.querySelector(s);
const mkQA = (s, p = document) => [...p.querySelectorAll(s)];
const mkLerp = (a, b, t) => a + (b - a) * t;
const mkClamp = (v, min, max) => Math.min(Math.max(v, min), max);
const mkMap = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);
const mkThrottle = (fn, ms) => { let l = 0; return (...a) => { const n = Date.now(); if (n - l >= ms) { l = n; fn(...a); } }; };

// ─── SCROLL REVEAL ENGINE ─────────────────────────────────────
class MKScrollReveal {
  constructor() { this.els = mkQA('[data-mk-reveal]'); this.seen = new Set(); }

  init() {
    if (!this.els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !this.seen.has(e.target)) {
          this.seen.add(e.target);
          const d = parseInt(e.target.dataset.mkDelay || 0);
          setTimeout(() => e.target.classList.add('mk-visible'), d);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    this.els.forEach(el => obs.observe(el));
  }
}

// ─── PARTICLE FIELD ───────────────────────────────────────────
class MKParticleField {
  constructor() { this.container = mkQ('#mkParticles'); this.count = 35; }

  init() {
    if (!this.container) return;
    if (window.innerWidth < 768) this.count = 15;
    else if (window.innerWidth < 1024) this.count = 24;

    for (let i = 0; i < this.count; i++) this.spawn();
  }

  spawn() {
    const el = document.createElement('div');
    el.className = 'mk-particle';
    const x = Math.random() * 100;
    const y = 40 + Math.random() * 60;
    const sz = 1.5 + Math.random() * 3.5;
    const dur = 9 + Math.random() * 18;
    const delay = Math.random() * dur;
    const dx = -60 + Math.random() * 120;
    const dy = -(80 + Math.random() * 280);
    const peak = 0.08 + Math.random() * 0.3;
    const colors = [
      'rgba(232,101,26,.5)', 'rgba(244,147,90,.4)', 'rgba(255,215,0,.25)',
      'rgba(30,58,110,.35)', 'rgba(248,245,240,.15)'
    ];
    const c = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:${c};--dur:${dur}s;--delay:-${delay}s;--dx:${dx}px;--dy:${dy}px;--peak:${peak};`;
    this.container.appendChild(el);
  }
}

// ─── DASHBOARD PARALLAX ───────────────────────────────────────
class MKDashboardParallax {
  constructor() {
    this.dash = mkQ('#mkDashboard');
    this.hero = mkQ('#mk-hero');
    this.mx = 0.5; this.my = 0.5;
    this.cx = 0.5; this.cy = 0.5;
    this.bob = 0; this.active = true;
  }

  init() {
    if (!this.dash || !this.hero) return;

    this.hero.addEventListener('mousemove', (e) => {
      const r = this.hero.getBoundingClientRect();
      this.mx = (e.clientX - r.left) / r.width;
      this.my = (e.clientY - r.top) / r.height;
    });
    this.hero.addEventListener('mouseleave', () => { this.mx = 0.5; this.my = 0.5; });

    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null) {
          this.mx = mkClamp((e.gamma + 45) / 90, 0, 1);
          this.my = mkClamp((e.beta + 20) / 80, 0, 1);
        }
      });
    }

    const obs = new IntersectionObserver(([en]) => { this.active = en.isIntersecting; }, { threshold: 0.1 });
    obs.observe(this.hero);
    this.animate();
  }

  animate() {
    if (this.active) {
      this.cx = mkLerp(this.cx, this.mx, 0.04);
      this.cy = mkLerp(this.cy, this.my, 0.04);
      const ry = mkMap(this.cx, 0, 1, 6, -6);
      const rx = mkMap(this.cy, 0, 1, -4, 4);
      this.bob += 0.007;
      const fy = Math.sin(this.bob) * 7;
      this.dash.style.transform = `translateY(${fy}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
    requestAnimationFrame(() => this.animate());
  }
}

// ─── DASHBOARD KPI COUNTERS ──────────────────────────────────
// Animates the KPI numbers inside the dashboard mockup to
// simulate a live campaign dashboard with counting effects.
class MKDashboardKPIs {
  constructor() {
    this.kpis = [
      { el: mkQ('#kpiImpressions'), target: 48720, prefix: '', suffix: '' },
      { el: mkQ('#kpiClicks'), target: 3841, prefix: '', suffix: '' },
      { el: mkQ('#kpiConversions'), target: 312, prefix: '', suffix: '' },
      { el: mkQ('#kpiCPL'), target: 18, prefix: '$', suffix: '' },
    ];
    this.animated = false;
  }

  init() {
    const visual = mkQ('.mk-hero-visual');
    if (!visual) return;

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !this.animated) {
        this.animated = true;
        setTimeout(() => this.run(), 600);
        obs.unobserve(e.target);
      }
    }, { threshold: 0.3 });
    obs.observe(visual);
  }

  run() {
    this.kpis.forEach(({ el, target, prefix, suffix }) => {
      if (!el) return;
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        const val = Math.round(target * eased);
        el.textContent = prefix + val.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
}

// ─── CHART BAR ANIMATION ─────────────────────────────────────
// Animates the bar chart inside the dashboard from 0 height to
// their data-height values when the dashboard enters the viewport.
class MKChartBars {
  constructor() {
    this.bars = mkQA('.mk-bar');
    this.animated = false;
  }

  init() {
    const chart = mkQ('#mkChartBars');
    if (!chart || !this.bars.length) return;

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !this.animated) {
        this.animated = true;
        setTimeout(() => this.grow(), 800);
        obs.unobserve(e.target);
      }
    }, { threshold: 0.3 });
    obs.observe(chart);
  }

  grow() {
    this.bars.forEach((bar, i) => {
      const h = bar.dataset.height || 50;
      setTimeout(() => {
        bar.style.height = h + '%';
      }, i * 120);
    });
  }
}

// ─── NOTIFICATION POPUP ──────────────────────────────────────
// Shows a "New Lead!" notification badge on the dashboard mockup
// after a delay, then cycles it for a live-data feel.
class MKNotification {
  constructor() {
    this.el = mkQ('#mkNotif');
    this.messages = [
      { icon: 'fa-bell', title: 'New Lead!', sub: 'Contact form — 2 min ago' },
      { icon: 'fa-phone', title: 'Phone Call!', sub: 'Google Ads click — just now' },
      { icon: 'fa-envelope', title: 'Email Signup!', sub: 'Newsletter — 5 min ago' },
      { icon: 'fa-star', title: 'New Review!', sub: 'Google — 5 stars' },
    ];
    this.index = 0;
    this.interval = null;
  }

  init() {
    if (!this.el) return;

    const visual = mkQ('.mk-hero-visual');
    if (!visual) return;

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => this.show(), 2000);
        obs.unobserve(e.target);
      }
    }, { threshold: 0.3 });
    obs.observe(visual);
  }

  show() {
    this.display(this.messages[0]);
    this.interval = setInterval(() => {
      this.index = (this.index + 1) % this.messages.length;
      this.el.classList.remove('mk-notif-visible');
      setTimeout(() => this.display(this.messages[this.index]), 400);
    }, 4500);
  }

  display(msg) {
    const icon = mkQ('.mk-notif-icon i', this.el);
    const title = mkQ('strong', this.el);
    const sub = mkQ('span', this.el);
    if (icon) icon.className = `fas ${msg.icon}`;
    if (title) title.textContent = msg.title;
    if (sub) sub.textContent = msg.sub;
    this.el.classList.add('mk-notif-visible');
  }
}

// ─── COUNTER ANIMATION (PROOF BAR + HERO) ────────────────────
class MKCounters {
  constructor() { this.els = mkQA('[data-count]'); this.done = new Set(); }

  init() {
    if (!this.els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !this.done.has(e.target)) {
          this.done.add(e.target);
          this.count(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    this.els.forEach(el => obs.observe(el));
  }

  count(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 2200;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const cur = target * eased;

      if (suffix.includes('M')) {
        el.textContent = '$' + cur.toFixed(cur < 1 ? 1 : 0) + suffix;
      } else if (suffix.includes('x')) {
        el.textContent = cur.toFixed(1) + suffix;
      } else {
        el.textContent = Math.round(cur) + suffix;
      }

      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

// ─── TITLE STRIKE-THROUGH ANIMATION ─────────────────────────
// Animates a red strikethrough line through "Work" in the hero
// title to reinforce "marketing that doesn't work" messaging.
class MKTitleStrike {
  constructor() { this.el = mkQ('#mkStrike'); }

  init() {
    if (!this.el) return;
    setTimeout(() => this.el.classList.add('mk-struck'), 1800);
  }
}

// ─── FUNNEL BAR FILL ANIMATION ───────────────────────────────
// Animates the funnel bars filling to their target widths as each
// stage scrolls into view, creating a cascading funnel effect.
class MKFunnelFill {
  constructor() { this.fills = mkQA('.mk-funnel-fill'); }

  init() {
    if (!this.fills.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const fill = e.target;
          const target = fill.dataset.fill || 100;
          setTimeout(() => {
            fill.style.width = target + '%';
          }, 200);
          obs.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    this.fills.forEach(f => obs.observe(f));
  }
}

// ─── PROCESS STEP ACTIVATION ─────────────────────────────────
class MKStepActivation {
  constructor() { this.steps = mkQA('.mk-step'); }

  init() {
    if (!this.steps.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('mk-step-active');
        }
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -15% 0px' });

    this.steps.forEach(s => obs.observe(s));
  }
}

// ─── FAQ ACCORDION ────────────────────────────────────────────
class MKFAQ {
  constructor() { this.items = mkQA('.mk-faq-item'); }

  init() {
    if (!this.items.length) return;
    this.items.forEach(item => {
      const btn = mkQ('.mk-faq-question', item);
      if (!btn) return;
      btn.addEventListener('click', () => this.toggle(item));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(item); }
      });
    });
  }

  toggle(item) {
    const wasOpen = item.classList.contains('mk-faq-open');
    this.items.forEach(i => {
      i.classList.remove('mk-faq-open');
      const ans = mkQ('.mk-faq-answer', i);
      if (ans) ans.style.maxHeight = '0';
    });
    if (!wasOpen) {
      item.classList.add('mk-faq-open');
      const ans = mkQ('.mk-faq-answer', item);
      if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
    }
  }
}

// ─── CURSOR GLOW ──────────────────────────────────────────────
class MKCursorGlow {
  constructor() { this.hero = mkQ('#mk-hero'); this.glow = null; this.mx = 0; this.my = 0; this.cx = 0; this.cy = 0; this.active = false; }

  init() {
    if (!this.hero || window.innerWidth < 768) return;

    this.glow = document.createElement('div');
    this.glow.style.cssText = `position:absolute;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,rgba(232,101,26,.07) 0%,transparent 65%);pointer-events:none;z-index:2;transform:translate(-50%,-50%);transition:opacity .3s ease;opacity:0;will-change:transform;`;
    this.hero.appendChild(this.glow);

    this.hero.addEventListener('mouseenter', () => { this.active = true; this.glow.style.opacity = '1'; });
    this.hero.addEventListener('mouseleave', () => { this.active = false; this.glow.style.opacity = '0'; });
    this.hero.addEventListener('mousemove', (e) => {
      const r = this.hero.getBoundingClientRect();
      this.mx = e.clientX - r.left;
      this.my = e.clientY - r.top;
    });
    this.animate();
  }

  animate() {
    if (this.active && this.glow) {
      this.cx = mkLerp(this.cx, this.mx, 0.07);
      this.cy = mkLerp(this.cy, this.my, 0.07);
      this.glow.style.transform = `translate(${this.cx - 225}px, ${this.cy - 225}px)`;
    }
    requestAnimationFrame(() => this.animate());
  }
}

// ─── MAGNETIC BUTTONS ─────────────────────────────────────────
class MKMagneticButtons {
  constructor() { this.btns = mkQA('.mk-hero-ctas .btn'); this.str = 0.28; }

  init() {
    if (!this.btns.length || window.innerWidth < 768) return;
    this.btns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * this.str;
        const dy = (e.clientY - r.top - r.height / 2) * this.str;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
        btn.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }
}

// ─── GRADIENT MESH MOUSE RESPONSE ────────────────────────────
// The gradient mesh in the hero background subtly shifts based
// on cursor position for an organic, living feel.
class MKMeshResponse {
  constructor() { this.mesh = mkQ('#heroMesh'); this.hero = mkQ('#mk-hero'); this.mx = 0.5; this.my = 0.5; this.cx = 0.5; this.cy = 0.5; }

  init() {
    if (!this.mesh || !this.hero || window.innerWidth < 768) return;

    this.hero.addEventListener('mousemove', (e) => {
      const r = this.hero.getBoundingClientRect();
      this.mx = (e.clientX - r.left) / r.width;
      this.my = (e.clientY - r.top) / r.height;
    });
    this.animate();
  }

  animate() {
    this.cx = mkLerp(this.cx, this.mx, 0.02);
    this.cy = mkLerp(this.cy, this.my, 0.02);
    const x = 15 + this.cx * 30;
    const y = 25 + this.cy * 30;
    this.mesh.style.background = `conic-gradient(from ${this.cx * 360}deg at ${x}% ${y}%, rgba(232,101,26,.15), rgba(30,58,110,.2), rgba(244,147,90,.1), rgba(27,42,74,.15), rgba(232,101,26,.15))`;
    requestAnimationFrame(() => this.animate());
  }
}

// ─── SERVICE CARD HOVER FX ───────────────────────────────────
// Cursor-following gradient highlight on service cards.
class MKServiceCardFX {
  constructor() { this.cards = mkQA('.mk-srv-card'); }

  init() {
    if (!this.cards.length || window.innerWidth < 768) return;
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(232,101,26,.04) 0%, transparent 50%), var(--cream-light)`;
      });
      card.addEventListener('mouseleave', () => { card.style.background = ''; });
    });
  }
}

// ─── DIFFERENCE CARD TILT ────────────────────────────────────
class MKDiffCardTilt {
  constructor() { this.cards = mkQA('.mk-diff-card'); }

  init() {
    if (!this.cards.length || window.innerWidth < 768) return;
    this.cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform .1s linear, border-color .5s ease, box-shadow .5s ease';

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(600px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94), border-color .5s ease, box-shadow .5s ease';
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
        setTimeout(() => { card.style.transition = 'transform .1s linear, border-color .5s ease, box-shadow .5s ease'; }, 500);
      });
    });
  }
}

// ─── TESTIMONIAL HOVER GLOW ──────────────────────────────────
class MKTestHover {
  constructor() { this.cards = mkQA('.mk-test-card'); }

  init() {
    if (!this.cards.length || window.innerWidth < 768) return;
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        card.style.boxShadow = `0 16px 48px rgba(232,101,26,.08), inset 0 0 80px rgba(232,101,26,.02)`;
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(232,101,26,.03) 0%, transparent 50%), var(--white)`;
      });
      card.addEventListener('mouseleave', () => { card.style.boxShadow = ''; card.style.background = ''; });
    });
  }
}

// ─── STICKY MOBILE CTA ───────────────────────────────────────
class MKStickyCTA {
  constructor() { this.hero = mkQ('#mk-hero'); this.bar = null; this.vis = false; }

  init() {
    if (!this.hero || window.innerWidth > 991) return;
    this.createBar();
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && !this.vis) this.show();
      else if (e.isIntersecting && this.vis) this.hide();
    }, { threshold: 0 });
    obs.observe(this.hero);
  }

  createBar() {
    this.bar = document.createElement('div');
    this.bar.style.cssText = `position:fixed;bottom:0;left:0;right:0;z-index:900;padding:12px 20px;background:rgba(15,29,53,.95);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid rgba(248,245,240,.08);display:flex;align-items:center;justify-content:space-between;gap:12px;transform:translateY(100%);transition:transform .4s cubic-bezier(.25,.46,.45,.94);box-shadow:0 -4px 24px rgba(0,0,0,.3);`;
    this.bar.innerHTML = `
      <div style="flex:1;min-width:0;"><div style="font-size:.7rem;color:rgba(248,245,240,.5);font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Free Strategy Call</div><div style="font-family:'Bodoni Moda',serif;font-size:1.25rem;font-weight:700;color:var(--cream);line-height:1;">No Obligation</div></div>
      <a href="contact.html" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:var(--hermes);color:white;border-radius:9999px;font-size:.8125rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;white-space:nowrap;box-shadow:0 4px 16px rgba(232,101,26,.3);">Get Quote</a>
      <a href="tel:+19294176819" style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;border:1px solid rgba(248,245,240,.2);color:var(--cream);text-decoration:none;font-size:1rem;flex-shrink:0;"><i class="fas fa-phone"></i></a>`;
    document.body.appendChild(this.bar);
  }

  show() { this.vis = true; this.bar.style.transform = 'translateY(0)'; }
  hide() { this.vis = false; this.bar.style.transform = 'translateY(100%)'; }
}

// ─── SMOOTH SCROLL ────────────────────────────────────────────
class MKSmoothScroll {
  init() {
    mkQA('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const t = mkQ(href);
        if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
      });
    });
  }
}

// ─── PERFORMANCE MONITOR ─────────────────────────────────────
class MKPerfMonitor {
  constructor() { this.frames = []; this.low = false; }
  init() { this.measure(); setInterval(() => this.check(), 2500); }
  measure() { this.frames.push(performance.now()); if (this.frames.length > 60) this.frames.shift(); requestAnimationFrame(() => this.measure()); }
  check() {
    if (this.frames.length < 10) return;
    const r = this.frames.slice(-30);
    const fps = (r.length - 1) / ((r[r.length - 1] - r[0]) / 1000);
    if (fps < 28 && !this.low) { this.low = true; document.body.classList.add('mk-low-perf'); console.log('⚡ Marketing page: reduced animations'); }
  }
}

// ─── CHANNEL TAG CYCLING ─────────────────────────────────────
// Cycles the "active" state across channel tags in the dashboard
// to simulate switching between data views.
class MKChannelCycle {
  constructor() { this.tags = mkQA('.mk-channel'); this.idx = 0; this.interval = null; }

  init() {
    if (this.tags.length < 2) return;
    const visual = mkQ('.mk-hero-visual');
    if (!visual) return;

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        this.start();
        obs.unobserve(e.target);
      }
    }, { threshold: 0.3 });
    obs.observe(visual);
  }

  start() {
    this.interval = setInterval(() => {
      this.tags.forEach(t => t.classList.remove('mk-channel-active'));
      this.idx = (this.idx + 1) % this.tags.length;
      this.tags[this.idx].classList.add('mk-channel-active');
    }, 3000);
  }
}

// ─── LIVE COUNTER TICKER ─────────────────────────────────────
// After initial KPI count-up, simulates live data by occasionally
// incrementing the values slightly to feel alive.
class MKLiveTicker {
  constructor() {
    this.kpis = {
      impressions: { el: mkQ('#kpiImpressions'), base: 48720, current: 48720 },
      clicks: { el: mkQ('#kpiClicks'), base: 3841, current: 3841 },
      conversions: { el: mkQ('#kpiConversions'), base: 312, current: 312 },
    };
    this.interval = null;
  }

  init() {
    // Start ticking after KPI animation would complete (~3s after visible)
    setTimeout(() => {
      this.interval = setInterval(() => this.tick(), 3500);
    }, 4000);
  }

  tick() {
    // Occasionally bump impressions
    if (Math.random() > 0.3 && this.kpis.impressions.el) {
      this.kpis.impressions.current += Math.floor(Math.random() * 15) + 3;
      this.kpis.impressions.el.textContent = this.kpis.impressions.current.toLocaleString();
    }
    // Less often bump clicks
    if (Math.random() > 0.6 && this.kpis.clicks.el) {
      this.kpis.clicks.current += Math.floor(Math.random() * 3) + 1;
      this.kpis.clicks.el.textContent = this.kpis.clicks.current.toLocaleString();
    }
    // Rarely bump conversions
    if (Math.random() > 0.85 && this.kpis.conversions.el) {
      this.kpis.conversions.current += 1;
      this.kpis.conversions.el.textContent = this.kpis.conversions.current.toLocaleString();
    }
  }
}

// ─── APPLICATION ──────────────────────────────────────────────
class MKApp {
  constructor() {
    this.modules = {
      reveal:       new MKScrollReveal(),
      particles:    new MKParticleField(),
      dashPx:       new MKDashboardParallax(),
      dashKPIs:     new MKDashboardKPIs(),
      chartBars:    new MKChartBars(),
      notif:        new MKNotification(),
      counters:     new MKCounters(),
      strike:       new MKTitleStrike(),
      funnelFill:   new MKFunnelFill(),
      stepActivate: new MKStepActivation(),
      faq:          new MKFAQ(),
      cursorGlow:   new MKCursorGlow(),
      magnetic:     new MKMagneticButtons(),
      meshResponse: new MKMeshResponse(),
      srvCards:     new MKServiceCardFX(),
      diffTilt:     new MKDiffCardTilt(),
      testHover:    new MKTestHover(),
      stickyCTA:    new MKStickyCTA(),
      smoothScroll: new MKSmoothScroll(),
      perfMonitor:  new MKPerfMonitor(),
      channelCycle: new MKChannelCycle(),
      liveTicker:   new MKLiveTicker(),
    };
  }

  init() {
    Object.entries(this.modules).forEach(([name, mod]) => {
      try { if (typeof mod.init === 'function') mod.init(); }
      catch (err) { console.error(`[MK:${name}]`, err); }
    });
    console.log('✦ Marketing Landing — Premium Edition loaded');
  }
}

// ─── INIT ─────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new MKApp().init());
} else {
  new MKApp().init();
}
