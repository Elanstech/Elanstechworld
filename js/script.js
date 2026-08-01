/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ELAN'S TECH WORLD — "MADE TO MEASURE"
 *  js/script.js — ES6 module architecture
 *  ─────────────────────────────────────────────────────────────────────────
 *  MODULES
 *   Utils            helpers, DOM shortcuts, prefers-reduced-motion
 *   TextSplitter     char/word splitting for masked reveals
 *   Preloader        counter + stitch draw + curtain reveal
 *   SmoothScroll     Lenis integration (falls back gracefully)
 *   ScrollProgress   top progress bar
 *   Cursor           custom dot + trailing ring with contextual states
 *   Magnetic         magnetic pull on buttons / badge
 *   Header           glass on scroll, hide-on-scroll-down, mobile menu
 *   HeroScene        canvas particle "threads" + mouse parallax + entrance
 *   Scramble         decoding text effect for the hero eyebrow
 *   Reveals          generic .rv scroll reveals + stitch dividers + titles
 *   Manifesto        word-by-word scroll-scrub illumination
 *   Lab              ★ interactive demo — live brand preview + drag compare
 *   ServicesRail     pinned horizontal scroll w/ velocity skew
 *   Tilt             3D tilt on cards
 *   Counters         animated number counters
 *   Portfolio        projects.json loader with designed fallback tiles
 *   Testimonials     auto-rotating slider
 *   MarqueeVelocity  marquee speed reacts to scroll velocity
 *   ToTop            back-to-top button
 *   App              boot orchestrator
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ─────────────────────────────────────────────
   UTILS
───────────────────────────────────────────── */
const Utils = {
  $:  (sel, parent = document) => parent.querySelector(sel),
  $$: (sel, parent = document) => [...parent.querySelectorAll(sel)],
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  touch:   window.matchMedia('(hover: none)').matches,
  clamp: (v, min, max) => Math.min(Math.max(v, min), max),
  lerp:  (a, b, t) => a + (b - a) * t,
  hasGSAP: () => typeof gsap !== 'undefined',
};

const { $, $$ } = Utils;

if (Utils.hasGSAP() && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}


/* ─────────────────────────────────────────────
   TEXT SPLITTER — masked char reveals
───────────────────────────────────────────── */
class TextSplitter {
  /** Wrap every char of el in .split-line > .split-ch spans */
  static chars(el) {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const line = document.createElement('span');
    line.className = 'split-line';
    line.setAttribute('aria-hidden', 'true');
    [...text].forEach((ch) => {
      const s = document.createElement('span');
      s.className = 'split-ch';
      s.innerHTML = ch === ' ' ? '&nbsp;' : ch;
      line.appendChild(s);
    });
    el.appendChild(line);
    return $$('.split-ch', el);
  }

  /** Split a multi-node title (keeps <em>/<br>) into char spans */
  static rich(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          [...child.textContent].forEach((ch) => {
            const s = document.createElement('span');
            s.className = 'split-ch';
            s.innerHTML = ch === ' ' ? '&nbsp;' : ch;
            frag.appendChild(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    const wrap = document.createElement('span');
    wrap.className = 'split-line';
    while (el.firstChild) wrap.appendChild(el.firstChild);
    el.appendChild(wrap);
    return $$('.split-ch', el);
  }
}


/* ─────────────────────────────────────────────
   PRELOADER
───────────────────────────────────────────── */
class Preloader {
  constructor(onDone) {
    this.el = $('#loader');
    this.onDone = onDone;
  }

  init() {
    if (!this.el || Utils.reduced || !Utils.hasGSAP()) {
      if (this.el) this.el.style.display = 'none';
      this.onDone();
      return;
    }
    document.body.style.overflow = 'hidden';
    this.buildWord();
    this.animate();
  }

  buildWord() {
    const word = $('#loaderWord');
    const text = word.dataset.text || "Elan's Tech World";
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch' + (i > 6 ? ' ch--it' : '');
      s.innerHTML = ch === ' ' ? '&nbsp;' : ch;
      word.appendChild(s);
    });
  }

  animate() {
    const count  = $('#loaderCount');
    const stitch = $('#loaderStitch');
    const len = stitch.getTotalLength();
    stitch.style.strokeDashoffset = len;

    gsap.timeline({
      onComplete: () => {
        this.el.style.display = 'none';
        document.body.style.overflow = '';
        this.onDone();
      },
    })
      .to('#loaderWord .ch', { y: 0, duration: .9, stagger: .028, ease: 'power4.out' }, 0)
      .to(stitch, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, .15)
      .to({ v: 0 }, {
        v: 100, duration: 1.35, ease: 'power2.inOut',
        onUpdate() { count.textContent = String(Math.round(this.targets()[0].v)).padStart(2, '0'); },
      }, .15)
      .to('#loaderWord .ch', { y: '-115%', duration: .6, stagger: .016, ease: 'power3.in' }, '+=.2')
      .to('.loader-logo, .loader-stitch, .loader-count', { opacity: 0, duration: .35 }, '<')
      .to('.loader-panel--top', { yPercent: -101, duration: .9, ease: 'power4.inOut' }, '-=.1')
      .to('.loader-panel--bot', { yPercent: 101,  duration: .9, ease: 'power4.inOut' }, '<');
  }
}


/* ─────────────────────────────────────────────
   SMOOTH SCROLL — Lenis
───────────────────────────────────────────── */
class SmoothScroll {
  init() {
    if (Utils.reduced || Utils.touch || typeof Lenis === 'undefined') return;
    this.lenis = new Lenis({ lerp: .1, wheelMultiplier: 1, smoothWheel: true });
    this.lenis.on('scroll', () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update(); });
    const raf = (t) => { this.lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    // anchor links play nice with Lenis
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = $(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        this.lenis.scrollTo(target, { offset: -60 });
      });
    });
  }
}


/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
class ScrollProgress {
  init() {
    this.bar = $('#scrollProgress');
    if (!this.bar) return;
    const update = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      this.bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }
}


/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
class Cursor {
  init() {
    this.dot = $('#cursorDot');
    this.ring = $('#cursorRing');
    this.label = $('#cursorLabel');
    if (!this.dot || Utils.touch) return;

    this.x = innerWidth / 2; this.y = innerHeight / 2;
    this.rx = this.x; this.ry = this.y;

    addEventListener('mousemove', (e) => {
      this.x = e.clientX; this.y = e.clientY;
      this.dot.style.transform = `translate(${this.x}px, ${this.y}px) translate(-50%, -50%)`;
    });
    this.loop();

    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      if (t.closest('[data-cursor="drag"], .lab-handle, .browser-body')) this.set('is-view', 'Drag');
      else if (t.closest('.folio-card')) this.set('is-view', 'View');
      else if (t.closest('a, button, input')) this.set('is-link');
      else this.set('');
    });
  }

  set(cls, text) {
    this.ring.className = 'cursor-ring' + (cls ? ` ${cls}` : '');
    if (text) this.label.textContent = text;
  }

  loop() {
    this.rx = Utils.lerp(this.rx, this.x, .14);
    this.ry = Utils.lerp(this.ry, this.y, .14);
    this.ring.style.transform = `translate(${this.rx}px, ${this.ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(() => this.loop());
  }
}


/* ─────────────────────────────────────────────
   MAGNETIC ELEMENTS
───────────────────────────────────────────── */
class Magnetic {
  init() {
    if (Utils.reduced || Utils.touch || !Utils.hasGSAP()) return;
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * .28,
          y: (e.clientY - r.top - r.height / 2) * .32,
          duration: .4, ease: 'power2.out',
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .4)' });
      });
    });
  }
}


/* ─────────────────────────────────────────────
   HEADER — glass, hide on scroll down, menu
───────────────────────────────────────────── */
class Header {
  init() {
    this.header = $('#header');
    this.burger = $('#burger');
    this.menu = $('#mmenu');
    if (!this.header) return;

    this.lastY = 0;
    const onScroll = () => {
      const y = scrollY;
      this.header.classList.toggle('scrolled', y > 60);
      // hide on scroll down, show on scroll up (only past the hero)
      if (y > innerHeight * .8 && y > this.lastY + 6) this.header.classList.add('is-hidden');
      else if (y < this.lastY - 6) this.header.classList.remove('is-hidden');
      this.lastY = y;
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    this.burger?.addEventListener('click', () => this.toggle());
    $$('#mmenu a').forEach((a) => a.addEventListener('click', () => this.close()));
  }

  toggle() {
    const open = this.menu.classList.toggle('open');
    this.burger.classList.toggle('open', open);
    this.burger.setAttribute('aria-expanded', open);
    this.menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  close() {
    this.menu.classList.remove('open');
    this.burger.classList.remove('open');
    this.burger.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}


/* ─────────────────────────────────────────────
   HERO SCENE — particles, parallax, entrance
───────────────────────────────────────────── */
class HeroScene {
  init() {
    this.video();
    this.particles();
    this.mouseParallax();
    this.scrollParallax();
  }

  entrance() {
    if (Utils.reduced || !Utils.hasGSAP()) {
      $$('#heroTitle .split-ch').forEach((c) => (c.style.transform = 'none'));
      return;
    }
    const lines = $$('#heroTitle .hero-line');
    const tl = gsap.timeline({ delay: .05 });
    lines.forEach((line, i) => {
      tl.to($$('.split-ch', line), {
        y: 0, duration: 1.1, stagger: .035, ease: 'power4.out',
      }, i * .14);
    });
    tl.to('.hero-eyebrow', { opacity: 1, duration: .8 }, .4)
      .to('#heroRule', { scaleX: 1, duration: .9, ease: 'power3.out' }, .8)
      .to('#heroDesc', { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, .95)
      .to('#heroCta',  { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, 1.1);
  }

  /** Split hero lines into chars ahead of time */
  prepare() {
    $$('#heroTitle [data-split]').forEach((line) => TextSplitter.chars(line));
  }

  video() {
    const v = $('.hero-video');
    if (!v) return;
    v.muted = true; v.playsInline = true;
    const p = v.play();
    if (p) p.catch(() => {
      const once = () => { v.play().catch(() => {}); ['touchstart', 'click'].forEach((e) => removeEventListener(e, once)); };
      ['touchstart', 'click'].forEach((e) => addEventListener(e, once, { once: true, passive: true }));
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && v.paused) v.play().catch(() => {});
    });
  }

  /** Gold thread particles drifting + linking near the mouse */
  particles() {
    const canvas = $('#heroCanvas');
    if (!canvas || Utils.reduced) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    const P = [];
    const COUNT = Utils.touch ? 34 : 64;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      P.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        vx: (Math.random() - .5) * .35,
        vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.6 + .5,
        gold: Math.random() > .55,
      });
    }

    canvas.parentElement.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      P.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? 'rgba(200,164,104,.7)' : 'rgba(244,147,90,.55)';
        ctx.fill();
        // thread to mouse
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(200,164,104,${(1 - dist / 160) * .35})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  mouseParallax() {
    if (Utils.reduced || Utils.touch || !Utils.hasGSAP()) return;
    const content = $('#heroContent');
    const orbs = $$('.hero-orb');
    $('#hero')?.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / innerWidth - .5);
      const ny = (e.clientY / innerHeight - .5);
      gsap.to(content, { x: nx * -18, y: ny * -12, duration: 1, ease: 'power2.out' });
      orbs.forEach((o, i) => gsap.to(o, { x: nx * (i ? 40 : -40), y: ny * (i ? 30 : -30), duration: 1.4, ease: 'power2.out' }));
    });
  }

  scrollParallax() {
    if (Utils.reduced || !Utils.hasGSAP()) return;
    gsap.to('#heroMedia', {
      yPercent: 16, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-content', {
      yPercent: -10, opacity: .25, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}


/* ─────────────────────────────────────────────
   SCRAMBLE — decoding text effect
───────────────────────────────────────────── */
class Scramble {
  static run(el, finalText, duration = 1200) {
    const glyphs = '◆✦—·ELANSTECHWRLD$#%&';
    const start = performance.now();
    const tick = (now) => {
      const p = Utils.clamp((now - start) / duration, 0, 1);
      const settled = Math.floor(finalText.length * p);
      el.textContent = finalText
        .split('')
        .map((ch, i) => (i < settled || ch === ' ' ? ch : glyphs[(Math.random() * glyphs.length) | 0]))
        .join('');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  init() {
    if (Utils.reduced) return;
    $$('.scramble').forEach((el) => {
      const final = el.dataset.scramble || el.textContent;
      setTimeout(() => Scramble.run(el, final), 900);
    });
  }
}


/* ─────────────────────────────────────────────
   REVEALS — .rv, stitch dividers, split titles
───────────────────────────────────────────── */
class Reveals {
  init() {
    if (!Utils.hasGSAP() || Utils.reduced) {
      $$('.rv').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
      $$('[data-split-title] .split-ch').forEach((c) => (c.style.transform = 'none'));
      return;
    }

    $$('.rv').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' },
      });
    });

    // section titles: char cascade
    $$('[data-split-title]').forEach((title) => {
      const chars = $$('.split-ch', title);
      if (!chars.length) return;
      gsap.to(chars, {
        y: 0, duration: .9, stagger: .018, ease: 'power4.out',
        scrollTrigger: { trigger: title, start: 'top 85%' },
      });
    });

    // stitch dividers draw in
    $$('.stitch .stitch-path').forEach((p) => {
      const len = p.getTotalLength();
      gsap.fromTo(p, { strokeDashoffset: len }, {
        strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut',
        scrollTrigger: { trigger: p, start: 'top 92%' },
      });
    });
  }

  static prepareTitles() {
    $$('[data-split-title]').forEach((el) => TextSplitter.rich(el));
  }
}


/* ─────────────────────────────────────────────
   MANIFESTO — word illumination scrub
───────────────────────────────────────────── */
class Manifesto {
  init() {
    const el = $('#manifestoText');
    if (!el) return;
    const accents = (el.dataset.accents || '').split(',');
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => {
      const clean = w.replace(/[^a-zA-Z']/g, '').toLowerCase();
      const acc = accents.some((a) => a && clean.includes(a));
      return `<span class="w${acc ? ' w--accent' : ''}">${w}</span>`;
    }).join(' ');

    const spans = $$('.w', el);
    if (!Utils.hasGSAP() || Utils.reduced) { spans.forEach((s) => s.classList.add('lit')); return; }

    ScrollTrigger.create({
      trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: .4,
      onUpdate(self) {
        const n = Math.floor(self.progress * spans.length);
        spans.forEach((s, i) => s.classList.toggle('lit', i <= n));
      },
    });
  }
}


/* ─────────────────────────────────────────────
   LAB ★ — live brand preview + drag compare
───────────────────────────────────────────── */
class Lab {
  init() {
    this.compare = $('#labCompare');
    if (!this.compare) return;
    this.after  = $('#labAfter');
    this.handle = $('#labHandle');
    this.pos = 50;
    this.bindName();
    this.bindChips();
    this.bindDrag();
    this.intro();
  }

  /* live business-name binding */
  bindName() {
    const input = $('#labName');
    const targets = {
      before:   $('#beforeName'),
      after:    $('#afterName'),
      headline: $('#afterHeadline'),
      url:      $('#labUrl'),
    };
    const apply = (raw) => {
      const name = raw.trim() || 'YourBrand';
      targets.before.textContent = name;
      targets.after.textContent = name;
      targets.headline.textContent = name;
      targets.url.textContent = 'www.' + name.toLowerCase().replace(/[^a-z0-9]+/g, '') .slice(0, 22) + '.com';
      // little pop on the bespoke headline
      if (Utils.hasGSAP() && !Utils.reduced) {
        gsap.fromTo(targets.headline, { scale: .96, opacity: .6 }, { scale: 1, opacity: 1, duration: .35, ease: 'power2.out' });
      }
    };
    input?.addEventListener('input', () => apply(input.value));
    apply('');
  }

  /* accent chips repaint the bespoke side */
  bindChips() {
    const chips = $$('#labChips .lab-chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => { c.classList.remove('active'); c.setAttribute('aria-checked', 'false'); });
        chip.classList.add('active');
        chip.setAttribute('aria-checked', 'true');
        this.after.style.setProperty('--lab-accent', chip.dataset.accent);
        if (Utils.hasGSAP() && !Utils.reduced) {
          gsap.fromTo(this.after, { filter: 'brightness(1.25)' }, { filter: 'brightness(1)', duration: .5 });
        }
      });
    });
  }

  /* draggable gold thread — pointer + keyboard */
  bindDrag() {
    const setPos = (pct, animate = false) => {
      this.pos = Utils.clamp(pct, 4, 96);
      const apply = () => {
        this.after.style.clipPath = `inset(0 0 0 ${this.pos}%)`;
        this.handle.style.left = `${this.pos}%`;
        this.handle.setAttribute('aria-valuenow', Math.round(this.pos));
      };
      if (animate && Utils.hasGSAP() && !Utils.reduced) {
        gsap.to(this, {
          pos: this.pos, duration: .5, ease: 'power3.out',
          onUpdate: () => {
            this.after.style.clipPath = `inset(0 0 0 ${this.pos}%)`;
            this.handle.style.left = `${this.pos}%`;
          },
        });
      } else apply();
    };

    const pctFromEvent = (e) => {
      const rect = this.compare.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    };

    let dragging = false;
    const start = (e) => { dragging = true; setPos(pctFromEvent(e)); };
    const move  = (e) => { if (dragging) { setPos(pctFromEvent(e)); e.preventDefault(); } };
    const end   = () => { dragging = false; };

    this.compare.addEventListener('pointerdown', start);
    addEventListener('pointermove', move, { passive: false });
    addEventListener('pointerup', end);
    this.compare.addEventListener('touchstart', start, { passive: true });
    this.compare.addEventListener('touchmove', move, { passive: false });
    this.compare.addEventListener('touchend', end);

    // keyboard access
    this.handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { setPos(this.pos - 5); e.preventDefault(); }
      if (e.key === 'ArrowRight') { setPos(this.pos + 5); e.preventDefault(); }
    });

    this.setPos = setPos;
  }

  /* attract attention: auto-sweep once when scrolled into view */
  intro() {
    if (!Utils.hasGSAP() || Utils.reduced) return;
    ScrollTrigger.create({
      trigger: '#labStage', start: 'top 70%', once: true,
      onEnter: () => {
        gsap.timeline()
          .add(() => this.setPos(18, true))
          .add(() => this.setPos(78, true), '+=.7')
          .add(() => this.setPos(50, true), '+=.7');
      },
    });
  }
}


/* ─────────────────────────────────────────────
   SERVICES RAIL — pin + scrub + velocity skew
───────────────────────────────────────────── */
class ServicesRail {
  init() {
    const track = $('#servicesTrack');
    const prog  = $('#servicesProgress');
    if (!track) return;
    if (matchMedia('(max-width: 900px)').matches || Utils.reduced || !Utils.hasGSAP()) return;

    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#services',
        start: 'top top',
        end: () => `+=${dist()}`,
        pin: true, scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (prog) prog.style.transform = `scaleX(${self.progress})`;
          // velocity skew — cards lean into the scroll
          const skew = Utils.clamp(self.getVelocity() / -260, -7, 7);
          gsap.to('.svc-card', { skewX: skew, duration: .35, ease: 'power2.out', overwrite: 'auto' });
        },
        onScrubComplete: () => gsap.to('.svc-card', { skewX: 0, duration: .5 }),
      },
    });
    addEventListener('resize', () => ScrollTrigger.refresh());
  }
}


/* ─────────────────────────────────────────────
   TILT — 3D card tilt
───────────────────────────────────────────── */
class Tilt {
  init() {
    if (Utils.reduced || Utils.touch || !Utils.hasGSAP()) return;
    $$('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - .5;
        const ny = (e.clientY - r.top) / r.height - .5;
        gsap.to(card, {
          rotateY: nx * 8, rotateX: ny * -8,
          transformPerspective: 900,
          duration: .5, ease: 'power2.out',
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1, .5)' });
      });
    });
  }
}


/* ─────────────────────────────────────────────
   COUNTERS
───────────────────────────────────────────── */
class Counters {
  init() {
    $$('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const dec = el.dataset.decimal ? 1 : 0;
      const run = () => {
        const dur = 1800, start = performance.now();
        const step = (now) => {
          const p = Utils.clamp((now - start) / dur, 0, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * e).toFixed(dec);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      if (!Utils.hasGSAP() || Utils.reduced) { el.textContent = target.toFixed(dec); return; }
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: run });
    });
  }
}


/* ─────────────────────────────────────────────
   PORTFOLIO — projects.json + designed fallback
───────────────────────────────────────────── */
class Portfolio {
  static FALLBACK = [
    { title: "Laura's Beauty Touch",   serviceType: 'Web Design · Google Ads',      bg: 'linear-gradient(150deg,#1E3A6E,#0D1B36)', mark: 'Lb' },
    { title: 'S-Cream',                serviceType: 'E-Commerce Launch',            bg: 'linear-gradient(150deg,#E8651A,#C4520F)', mark: 'S'  },
    { title: 'Century One Properties', serviceType: 'Property Platform',            bg: 'linear-gradient(150deg,#14264E,#2E55B0)', mark: 'C1' },
    { title: 'The Hardware Counter',   serviceType: 'Retail · Refurbished Apple',   bg: 'linear-gradient(150deg,#0D1B36,#1E3A6E)', mark: 'Hc' },
    { title: 'Park City',              serviceType: 'Web Design',                   bg: 'linear-gradient(150deg,#C8A468,#8A6D3B)', mark: 'Pc' },
    { title: 'Your Brand Next',        serviceType: 'Begin your project',           bg: 'linear-gradient(150deg,#EFE8DA,#D8D2C4)', mark: '✂', dark: true },
  ];

  async init() {
    this.grid = $('#folioGrid');
    if (!this.grid) return;
    let items = [];
    try {
      const res = await fetch('projects.json');
      const data = await res.json();
      items = (data.projects || [])
        .filter((p) => !p.comingSoon)
        .slice(0, 6)
        .map((p) => ({ title: p.title, serviceType: p.serviceType || p.category, img: p.coverImage, website: p.website }));
    } catch { /* fall through to designed tiles */ }
    if (!items.length) items = Portfolio.FALLBACK;
    this.render(items);
    this.animate();
  }

  render(items) {
    this.grid.innerHTML = items.map((p) => `
      <article class="folio-card"${p.website ? ` onclick="window.open('${p.website}','_blank')"` : ''}>
        <div class="folio-media">
          ${p.img
            ? `<img src="${p.img}" alt="${p.title} — project by Elan's Tech World" loading="lazy"
                 onerror="this.parentElement.innerHTML='<div class=folio-ph style=background:linear-gradient(150deg,#1E3A6E,#0D1B36)><i>${(p.title || '?')[0]}</i></div>'">`
            : `<div class="folio-ph" style="background:${p.bg}"><i${p.dark ? ' style="color:#14264E"' : ''}>${p.mark}</i></div>`}
        </div>
        <div class="folio-veil"><h3>${p.title}</h3><span>${p.serviceType || ''}</span></div>
      </article>`).join('');
  }

  animate() {
    if (!Utils.hasGSAP() || Utils.reduced) return;
    $$('.folio-card', this.grid).forEach((card) => {
      gsap.from(card, {
        opacity: 0, y: 60, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%' },
      });
      gsap.to($('.folio-media', card), {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }
}


/* ─────────────────────────────────────────────
   TESTIMONIALS — auto-rotating slider
───────────────────────────────────────────── */
class Testimonials {
  init() {
    this.slides = $$('.testi-slide');
    this.nav = $('#testiNav');
    if (!this.slides.length || !this.nav) return;
    this.current = 0;

    this.slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => this.go(i));
      this.nav.appendChild(dot);
    });
    this.dots = $$('.testi-dot', this.nav);
    this.restart();
  }

  go(i) {
    this.current = i;
    this.slides.forEach((s, j) => s.classList.toggle('active', j === i));
    this.dots.forEach((d, j) => d.classList.toggle('active', j === i));
    this.restart();
  }

  restart() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.go((this.current + 1) % this.slides.length), 6000);
  }
}


/* ─────────────────────────────────────────────
   MARQUEE VELOCITY — speed reacts to scroll
───────────────────────────────────────────── */
class MarqueeVelocity {
  init() {
    if (Utils.reduced) return;
    this.tracks = $$('[data-marquee-speed]');
    if (!this.tracks.length) return;
    let lastY = scrollY, boost = 0;
    addEventListener('scroll', () => {
      boost = Utils.clamp(Math.abs(scrollY - lastY) / 12, 0, 3);
      lastY = scrollY;
    }, { passive: true });
    const loop = () => {
      boost = Utils.lerp(boost, 0, .06);
      this.tracks.forEach((t) => {
        t.style.animationDuration = `${28 / (1 + boost)}s`;
      });
      requestAnimationFrame(loop);
    };
    loop();
  }
}


/* ─────────────────────────────────────────────
   TO TOP
───────────────────────────────────────────── */
class ToTop {
  init() {
    const btn = $('#toTop');
    if (!btn) return;
    addEventListener('scroll', () => btn.classList.toggle('show', scrollY > 600), { passive: true });
  }
}


/* ─────────────────────────────────────────────
   APP — boot
───────────────────────────────────────────── */
class App {
  constructor() {
    this.hero = new HeroScene();
    this.modules = [
      new SmoothScroll(),
      new ScrollProgress(),
      new Cursor(),
      new Magnetic(),
      new Header(),
      new Scramble(),
      new Manifesto(),
      new Lab(),
      new ServicesRail(),
      new Tilt(),
      new Counters(),
      new Portfolio(),
      new Testimonials(),
      new MarqueeVelocity(),
      new ToTop(),
      new Reveals(),
    ];
  }

  init() {
    // split text BEFORE anything animates
    this.hero.prepare();
    Reveals.prepareTitles();

    this.modules.forEach((m) => {
      try { m.init(); } catch (err) { console.error(`[${m.constructor.name}]`, err); }
    });
    this.hero.init();

    new Preloader(() => this.hero.entrance()).init();
    console.log("◆ Elan's Tech World — Made to Measure");
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', () => new App().init())
  : new App().init();
