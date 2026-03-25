/**
 * ═══════════════════════════════════════════════════════════════
 *  SERVICES HUB PAGE — Full Redesign Interactions
 *  3D card tilt · Chrome mouse-track · Particle field ·
 *  Gradient mesh · Timeline progress · Counter animation ·
 *  Orbit icons · Cursor glow · Card glow follow ·
 *  Magnetic buttons · Smooth scroll · Perf monitor
 * ═══════════════════════════════════════════════════════════════
 */

const sQ = (s, p = document) => p.querySelector(s);
const sQA = (s, p = document) => [...p.querySelectorAll(s)];
const sLerp = (a, b, t) => a + (b - a) * t;
const sClamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
const sMap = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);
const sThrottle = (fn, ms) => { let l = 0; return (...a) => { const n = Date.now(); if (n - l >= ms) { l = n; fn(...a); } }; };

// ─── SCROLL REVEAL ────────────────────────────────────────────
class SrvScrollReveal {
  constructor() { this.els = sQA('[data-srv-reveal]'); this.seen = new Set(); }
  init() {
    if (!this.els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !this.seen.has(e.target)) {
          this.seen.add(e.target);
          const d = parseInt(e.target.dataset.srvDelay || 0);
          setTimeout(() => e.target.classList.add('srv-visible'), d);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    this.els.forEach(el => obs.observe(el));
  }
}

// ─── PARTICLE FIELD ───────────────────────────────────────────
class SrvParticleField {
  constructor() { this.container = sQ('#srvParticles'); this.count = 35; }
  init() {
    if (!this.container) return;
    if (window.innerWidth < 768) this.count = 14;
    else if (window.innerWidth < 1024) this.count = 22;
    for (let i = 0; i < this.count; i++) this.spawn();
  }
  spawn() {
    const el = document.createElement('div');
    el.className = 'srv-particle';
    const x = Math.random() * 100, y = 40 + Math.random() * 60;
    const sz = 1.5 + Math.random() * 3.5, dur = 9 + Math.random() * 18;
    const delay = Math.random() * dur;
    const dx = -60 + Math.random() * 120, dy = -(80 + Math.random() * 280);
    const peak = 0.08 + Math.random() * 0.3;
    const colors = ['rgba(232,101,26,.5)','rgba(244,147,90,.4)','rgba(255,215,0,.25)','rgba(30,58,110,.35)','rgba(248,245,240,.15)'];
    const c = colors[Math.floor(Math.random() * colors.length)];
    el.style.cssText = `left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:${c};--dur:${dur}s;--delay:-${delay}s;--dx:${dx}px;--dy:${dy}px;--peak:${peak};`;
    this.container.appendChild(el);
  }
}

// ─── CHROME TEXT MOUSE-TRACKING ───────────────────────────────
class SrvChromeTrack {
  constructor() { this.el = sQ('#chromeTitle'); this.hero = sQ('.srv-hero'); this.mx = .5; this.my = .5; this.cx = .5; this.cy = .5; }
  init() {
    if (!this.el || !this.hero) return;
    this.hero.addEventListener('mousemove', e => {
      const r = this.hero.getBoundingClientRect();
      this.mx = (e.clientX - r.left) / r.width;
      this.my = (e.clientY - r.top) / r.height;
    });
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', e => {
        if (e.gamma !== null) { this.mx = (e.gamma + 90) / 180; this.my = sClamp((e.beta + 30) / 120, 0, 1); }
      });
    }
    this.animate();
  }
  animate() {
    this.cx += (this.mx - this.cx) * 0.06;
    this.cy += (this.my - this.cy) * 0.06;
    const angle = 90 + this.cx * 180;
    const bgX = this.cx * 100, bgY = this.cy * 100;
    this.el.style.background = `linear-gradient(${angle}deg,#c0c0c0 0%,#fafafa 15%,#909090 28%,#f8f8f8 42%,#a8a8a8 50%,#f0f0f0 58%,#b8b8b8 72%,#fafafa 85%,#a0a0a0 100%)`;
    this.el.style.backgroundSize = '200% 200%';
    this.el.style.backgroundPosition = `${bgX}% ${bgY}%`;
    this.el.style.webkitBackgroundClip = 'text';
    this.el.style.backgroundClip = 'text';
    this.el.style.webkitTextFillColor = 'transparent';
    this.el.style.color = 'transparent';
    requestAnimationFrame(() => this.animate());
  }
}

// ─── GRADIENT MESH MOUSE RESPONSE ─────────────────────────────
class SrvMeshResponse {
  constructor() { this.mesh = sQ('#srvMesh'); this.hero = sQ('#srv-hero'); this.mx = .5; this.my = .5; this.cx = .5; this.cy = .5; }
  init() {
    if (!this.mesh || !this.hero || window.innerWidth < 768) return;
    this.hero.addEventListener('mousemove', e => {
      const r = this.hero.getBoundingClientRect();
      this.mx = (e.clientX - r.left) / r.width;
      this.my = (e.clientY - r.top) / r.height;
    });
    this.animate();
  }
  animate() {
    this.cx = sLerp(this.cx, this.mx, 0.02);
    this.cy = sLerp(this.cy, this.my, 0.02);
    const x = 20 + this.cx * 30, y = 30 + this.cy * 30;
    this.mesh.style.background = `conic-gradient(from ${this.cx * 360}deg at ${x}% ${y}%,rgba(232,101,26,.12),rgba(30,58,110,.18),rgba(244,147,90,.08),rgba(27,42,74,.12),rgba(232,101,26,.12))`;
    requestAnimationFrame(() => this.animate());
  }
}

// ─── COUNTER ANIMATION ────────────────────────────────────────
class SrvCounters {
  constructor() { this.els = sQA('[data-count]'); this.done = new Set(); }
  init() {
    if (!this.els.length) return;
    const obs = new IntersectionObserver(entries => {
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
    const target = parseInt(el.dataset.count), suffix = el.dataset.suffix || '';
    const dur = 2200, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

// ─── 3D CARD TILT ─────────────────────────────────────────────
// Service showcase cards tilt toward the cursor on hover with
// a perspective effect and the glow layer follows the mouse.
class SrvCardTilt {
  constructor() { this.cards = sQA('[data-tilt]'); }
  init() {
    if (!this.cards.length || window.innerWidth < 768) return;
    this.cards.forEach(card => {
      const glow = sQ('.srv-card-glow', card);

      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        const rotX = y * -8, rotY = x * 8;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        card.style.transition = 'transform .08s linear, border-color .5s ease, box-shadow .5s ease';

        // Move glow to cursor
        if (glow) {
          const px = ((e.clientX - r.left) / r.width) * 100;
          const py = ((e.clientY - r.top) / r.height) * 100;
          glow.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(232,101,26,.08) 0%, transparent 55%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94), border-color .5s ease, box-shadow .5s ease';
        if (glow) glow.style.background = '';
      });
    });
  }
}

// ─── TIMELINE PROGRESS ────────────────────────────────────────
class SrvTimelineProgress {
  constructor() { this.timeline = sQ('#srvTimeline'); this.bar = sQ('#timelineProgress'); this.steps = sQA('.srv-timeline-step'); }
  init() {
    if (!this.timeline || !this.bar) return;

    const stepObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('srv-step-active'); });
    }, { threshold: 0.5, rootMargin: '0px 0px -20% 0px' });
    this.steps.forEach(s => stepObs.observe(s));

    window.addEventListener('scroll', sThrottle(() => this.update(), 30), { passive: true });
  }
  update() {
    const r = this.timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = r.top - vh * 0.7;
    const end = r.top + r.height - vh * 0.3;
    const range = end - start;
    let p = 0;
    if (start < 0) p = Math.min(Math.abs(start) / range, 1);
    this.bar.style.height = `${p * 100}%`;
  }
}

// ─── CURSOR GLOW ──────────────────────────────────────────────
class SrvCursorGlow {
  constructor() { this.hero = sQ('#srv-hero'); this.glow = null; this.mx = 0; this.my = 0; this.cx = 0; this.cy = 0; this.active = false; }
  init() {
    if (!this.hero || window.innerWidth < 768) return;
    this.glow = document.createElement('div');
    this.glow.style.cssText = `position:absolute;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,rgba(232,101,26,.07) 0%,transparent 65%);pointer-events:none;z-index:2;transform:translate(-50%,-50%);transition:opacity .3s ease;opacity:0;will-change:transform;`;
    this.hero.appendChild(this.glow);
    this.hero.addEventListener('mouseenter', () => { this.active = true; this.glow.style.opacity = '1'; });
    this.hero.addEventListener('mouseleave', () => { this.active = false; this.glow.style.opacity = '0'; });
    this.hero.addEventListener('mousemove', e => {
      const r = this.hero.getBoundingClientRect();
      this.mx = e.clientX - r.left; this.my = e.clientY - r.top;
    });
    this.animate();
  }
  animate() {
    if (this.active && this.glow) {
      this.cx = sLerp(this.cx, this.mx, 0.07);
      this.cy = sLerp(this.cy, this.my, 0.07);
      this.glow.style.transform = `translate(${this.cx - 225}px, ${this.cy - 225}px)`;
    }
    requestAnimationFrame(() => this.animate());
  }
}

// ─── MAGNETIC BUTTONS ─────────────────────────────────────────
class SrvMagneticButtons {
  constructor() { this.btns = sQA('.srv-hero-ctas .btn'); this.str = 0.28; }
  init() {
    if (!this.btns.length || window.innerWidth < 768) return;
    this.btns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
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

// ─── SMOOTH SCROLL ────────────────────────────────────────────
class SrvSmoothScroll {
  init() {
    sQA('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const t = sQ(href);
        if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
      });
    });
  }
}

// ─── ORBIT PARALLAX ───────────────────────────────────────────
// The orbit icons slow down / speed up slightly based on scroll
// for a parallax depth effect.
class SrvOrbitParallax {
  constructor() { this.orbit = sQ('#srvOrbit'); this.icons = sQA('.srv-orbit-icon'); }
  init() {
    if (!this.orbit || !this.icons.length || window.innerWidth < 768) return;
    window.addEventListener('scroll', sThrottle(() => {
      const scrollY = window.scrollY;
      const speed = 0.015;
      this.icons.forEach((icon, i) => {
        const offset = scrollY * speed * (i % 2 === 0 ? 1 : -1);
        icon.style.marginTop = `${offset}px`;
      });
    }, 30), { passive: true });
  }
}

// ─── CARD RIPPLE EFFECT ───────────────────────────────────────
// Click ripple on service cards for satisfying feedback.
class SrvCardRipple {
  init() {
    sQA('.srv-showcase-card').forEach(card => {
      card.addEventListener('click', function(e) {
        const r = this.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const ripple = document.createElement('span');
        ripple.style.cssText = `position:absolute;width:0;height:0;left:${x}px;top:${y}px;background:rgba(232,101,26,.1);border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:10;animation:srvRipple .6s ease-out forwards;`;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
    if (!document.getElementById('srv-ripple-style')) {
      const s = document.createElement('style');
      s.id = 'srv-ripple-style';
      s.textContent = `@keyframes srvRipple{to{width:400px;height:400px;opacity:0;}}`;
      document.head.appendChild(s);
    }
  }
}

// ─── PERFORMANCE MONITOR ──────────────────────────────────────
class SrvPerfMonitor {
  constructor() { this.frames = []; this.low = false; }
  init() { this.measure(); setInterval(() => this.check(), 2500); }
  measure() { this.frames.push(performance.now()); if (this.frames.length > 60) this.frames.shift(); requestAnimationFrame(() => this.measure()); }
  check() {
    if (this.frames.length < 10) return;
    const r = this.frames.slice(-30);
    const fps = (r.length - 1) / ((r[r.length - 1] - r[0]) / 1000);
    if (fps < 28 && !this.low) { this.low = true; document.body.classList.add('srv-low-perf'); console.log('⚡ Services: reduced animations'); }
  }
}

// ─── APPLICATION ──────────────────────────────────────────────
class SrvApp {
  constructor() {
    this.modules = {
      reveal:       new SrvScrollReveal(),
      particles:    new SrvParticleField(),
      chrome:       new SrvChromeTrack(),
      mesh:         new SrvMeshResponse(),
      counters:     new SrvCounters(),
      cardTilt:     new SrvCardTilt(),
      timeline:     new SrvTimelineProgress(),
      cursorGlow:   new SrvCursorGlow(),
      magnetic:     new SrvMagneticButtons(),
      smoothScroll: new SrvSmoothScroll(),
      orbitPx:      new SrvOrbitParallax(),
      cardRipple:   new SrvCardRipple(),
      perfMonitor:  new SrvPerfMonitor(),
    };
  }
  init() {
    Object.entries(this.modules).forEach(([name, mod]) => {
      try { if (typeof mod.init === 'function') mod.init(); }
      catch (err) { console.error(`[SRV:${name}]`, err); }
    });
    console.log('✦ Services Hub — Premium Edition loaded');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SrvApp().init());
} else {
  new SrvApp().init();
}
