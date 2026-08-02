/* ═══════════════════════════════════════════════════════════════════════════
   ELAN'S TECH WORLD — motion & interaction (ES6)
   ─────────────────────────────────────────────────────────────────────────
   Modules:
     Env            — environment flags & shared helpers
     SmoothScroll   — Lenis wiring + anchor handling
     Preloader      — count-up intro, hands off to HeroIntro
     HeroIntro      — headline split, entrance timeline, scramble, orbs
     Cursor         — custom dot + ring
     Magnetic       — magnetic hover on buttons
     Marquees       — infinite loops, velocity-reactive
     Manifesto      — word-by-word scroll reveal
     Stitches       — dashed divider draw-in
     Deck           — sticky stacking service cards
     Counters       — animated numbers
     ProcessRail    — pinned horizontal scroll (all screen sizes)
     FolioPreview   — floating portfolio preview
     Testimonials   — autoplaying quote slider
     Faq            — accordion
     Reveals        — batched scroll reveals
     HeaderCtrl     — hide-on-scroll header, progress bar, to-top
     MobileMenu     — burger overlay
     FooterWord     — wordmark parallax
     App            — boots everything

   CHANGED 2026-08-01 — two guards in HeroIntro so pages without a hero
   section (the portfolio index and client pages) don't throw. Without them,
   HeroIntro tried to animate elements that don't exist, the error killed the
   rest of App's constructor, and Reveals never ran — leaving those pages
   blank. Marked with "GUARD" below. No effect on pages that have a hero.
   ═══════════════════════════════════════════════════════════════════════ */

const Env = {
    RM: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    TOUCH: window.matchMedia('(hover: none), (pointer: coarse)').matches,
    hasGSAP: typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined',
    headH: 96,
};

const q  = (sel, ctx = document) => ctx.querySelector(sel);
const qa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ═══════════════════════════════════════════════════════════════════════
   SMOOTH SCROLL
   ═══════════════════════════════════════════════════════════════════════ */

class SmoothScroll {
    constructor() {
        this.lenis = null;

        if (!Env.RM && typeof Lenis !== 'undefined') {
            this.lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
            this.lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((t) => this.lenis.raf(t * 1000));
            gsap.ticker.lagSmoothing(0);
        }

        this.bindAnchors();
    }

    scrollTo(el) {
        if (this.lenis) {
            this.lenis.scrollTo(el, { offset: -70, duration: 1.4 });
        } else {
            el.scrollIntoView({ behavior: Env.RM ? 'auto' : 'smooth' });
        }
    }

    bindAnchors() {
        qa('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', (e) => {
                const id = a.getAttribute('href');
                if (id.length < 2) return;
                const target = q(id);
                if (!target) return;
                e.preventDefault();
                this.scrollTo(target);
            });
        });
    }

    get y() {
        return this.lenis ? this.lenis.scroll : (window.scrollY || 0);
    }

    stop()  { this.lenis?.stop(); }
    start() { this.lenis?.start(); }

    onScroll(fn) {
        this.lenis?.on('scroll', fn);
        window.addEventListener('scroll', fn, { passive: true });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   HERO INTRO
   ═══════════════════════════════════════════════════════════════════════ */

class HeroIntro {
    constructor() {
        this.word = q('#heroWord');
        this.chars = [];
        this.bits = ['#heroSmall', '#heroStandard', '#heroDesc', '#heroCta', '.hero-eyebrow', '.hero-meta-inner', '#heroBadge']
            .map((s) => q(s))
            .filter(Boolean);

        this.splitWord();
        this.setInitialStates();
        this.bindOrbs();
        this.bindParallax();
    }

    splitWord() {
        if (!this.word) return;
        const text = this.word.textContent.trim();
        this.word.textContent = '';
        text.split('').forEach((ch, i) => {
            const span = document.createElement('span');
            span.className = `ch${i % 3 === 1 ? ' ch--outline' : ''}`;
            span.textContent = ch;
            this.word.appendChild(span);
        });
        this.chars = qa('.ch', this.word);
    }

    setInitialStates() {
        if (Env.RM) return;
        gsap.set(this.chars, { yPercent: 130, rotate: 6 });
        gsap.set(this.bits, { autoAlpha: 0, y: 26 });
        gsap.set(this.word, { overflow: 'hidden', display: 'block' });
    }

    play() {
        /* GUARD — no split headline on this page, so there is nothing to
           animate. Without this the timeline below targets null and throws,
           which stops App's constructor before Reveals ever runs. */
        if (!this.chars.length) return;

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        tl.to(this.chars, { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.045 })
          .to(q('.hero-eyebrow'), { autoAlpha: 1, y: 0, duration: 0.8 }, '-=1.0')
          .to([q('#heroSmall'), q('#heroStandard')], { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, '-=0.9')
          .to([q('#heroDesc'), q('#heroCta')], { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
          .to([q('.hero-meta-inner'), q('#heroBadge')], { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.5');

        this.scramble();
    }

    scramble() {
        const el = q('.scramble');
        if (!el || Env.RM) return;

        const target = el.dataset.scramble || el.textContent;
        const glyphs = '◆◇#/\\_—·ELANTECH';
        const totalFrames = 34;
        let frame = 0;

        const interval = setInterval(() => {
            frame += 1;
            const reveal = Math.floor((frame / totalFrames) * target.length);
            el.textContent = target
                .split('')
                .map((c, i) => (i < reveal ? c : c === ' ' ? ' ' : glyphs[Math.floor(Math.random() * glyphs.length)]))
                .join('');
            if (frame >= totalFrames) {
                el.textContent = target;
                clearInterval(interval);
            }
        }, 32);
    }

    bindOrbs() {
        if (Env.RM || Env.TOUCH) return;
        const orbs = qa('[data-orb]');
        window.addEventListener('mousemove', (e) => {
            const nx = e.clientX / innerWidth - 0.5;
            const ny = e.clientY / innerHeight - 0.5;
            orbs.forEach((orb) => {
                const force = parseFloat(orb.dataset.orb) * 1000;
                gsap.to(orb, { x: nx * force, y: ny * force, duration: 1.6, ease: 'power2.out' });
            });
        });
    }

    bindParallax() {
        /* GUARD — only build the scroll parallax when both the trigger and
           the target actually exist on this page. */
        if (Env.RM || !q('#hero') || !q('.hero-content')) return;

        gsap.to('.hero-content', {
            yPercent: -12,
            autoAlpha: 0.25,
            ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   PRELOADER
   ═══════════════════════════════════════════════════════════════════════ */

class Preloader {
    constructor(onDone) {
        this.el = q('#loader');
        this.onDone = onDone;

        if (!this.el || Env.RM) {
            if (this.el) this.el.style.display = 'none';
            if (!Env.RM) onDone();
            return;
        }

        this.splitWord();
        this.play();
    }

    splitWord() {
        const word = q('#loaderWord');
        if (!word) return;
        const text = word.textContent.trim();
        word.innerHTML = text
            .split('')
            .map((c) => `<span>${c === ' ' ? '&nbsp;' : c}</span>`)
            .join('');
    }

    play() {
        const counter = { v: 0 };
        const countEl = q('#loaderCount');
        const spans = qa('#loaderWord span');

        const tl = gsap.timeline({
            onComplete: () => {
                this.el.style.display = 'none';
                this.onDone();
            },
        });

        tl.fromTo(spans,
              { yPercent: 110, display: 'inline-block' },
              { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.03 })
          .to(counter, {
              v: 100,
              duration: 1.4,
              ease: 'power2.inOut',
              onUpdate: () => {
                  if (countEl) countEl.textContent = String(Math.round(counter.v)).padStart(2, '0');
              },
          }, '<')
          .to(q('#loaderLine'), { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, '<')
          .to(q('.loader-inner'), { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '+=0.15')
          .to(q('.loader-panel--top'), { yPercent: -101, duration: 0.9, ease: 'expo.inOut' }, '-=0.1')
          .to(q('.loader-panel--bot'), { yPercent: 101, duration: 0.9, ease: 'expo.inOut' }, '<');
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   CURSOR
   ═══════════════════════════════════════════════════════════════════════ */

class Cursor {
    constructor() {
        if (Env.TOUCH || Env.RM) return;

        this.dot = q('#cursorDot');
        this.ring = q('#cursorRing');
        this.label = q('#cursorLabel');
        if (!this.dot || !this.ring) return;

        this.dx = gsap.quickTo(this.dot, 'x', { duration: 0.12, ease: 'power3' });
        this.dy = gsap.quickTo(this.dot, 'y', { duration: 0.12, ease: 'power3' });
        this.rx = gsap.quickTo(this.ring, 'x', { duration: 0.45, ease: 'power3' });
        this.ry = gsap.quickTo(this.ring, 'y', { duration: 0.45, ease: 'power3' });

        gsap.set([this.dot, this.ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
        this.bind();
    }

    bind() {
        window.addEventListener('mousemove', (e) => {
            this.dx(e.clientX);
            this.dy(e.clientY);
            this.rx(e.clientX);
            this.ry(e.clientY);
        });

        const hoverables = 'a, button, .faq-q, [data-cursor]';
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest(hoverables);
            if (!target) {
                this.ring.classList.remove('is-hover');
                return;
            }
            this.label.textContent = target.closest('.folio-item') ? 'View'
                                   : target.closest('.deck-card') ? 'More'
                                   : 'Go';
            this.ring.classList.add('is-hover');
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   MAGNETIC BUTTONS
   ═══════════════════════════════════════════════════════════════════════ */

class Magnetic {
    constructor() {
        if (Env.TOUCH || Env.RM) return;

        qa('.magnetic').forEach((el) => {
            const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1,.4)' });
            const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1,.4)' });

            el.addEventListener('mousemove', (e) => {
                const r = el.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
            });

            el.addEventListener('mouseleave', () => {
                xTo(0);
                yTo(0);
            });
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   MARQUEES  (velocity-reactive infinite loops)
   ═══════════════════════════════════════════════════════════════════════ */

class Marquees {
    constructor() {
        if (Env.RM) return;
        this.loop(q('#marqueeTrack'), 1);
        qa('.shop-mq-track').forEach((track) => this.loop(track, parseFloat(track.dataset.mqDir || '1')));
    }

    loop(track, dir) {
        if (!track) return;

        const tween = dir > 0
            ? gsap.fromTo(track, { xPercent: 0 },   { xPercent: -50, ease: 'none', duration: 24, repeat: -1 })
            : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0,   ease: 'none', duration: 24, repeat: -1 });

        ScrollTrigger.create({
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity() / 260);
                gsap.to(tween, { timeScale: gsap.utils.clamp(1, 4, velocity), duration: 0.5, overwrite: true });
            },
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   MANIFESTO  (word-by-word scrub)
   ═══════════════════════════════════════════════════════════════════════ */

class Manifesto {
    constructor() {
        this.el = q('#manifestoText');
        if (!this.el) return;

        this.splitWords();
        this.animate();
    }

    splitWords() {
        const accents = (this.el.dataset.accents || '').split(',').map((s) => s.trim());
        const words = this.el.textContent.trim().split(/\s+/);

        this.el.innerHTML = words
            .map((word) => {
                const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
                const isAccent = accents.some((a) => a && clean.includes(a));
                return `<span class="w${isAccent ? ' w--accent' : ''}">${word}</span>`;
            })
            .join(' ');
    }

    animate() {
        if (Env.RM) return;
        gsap.to(qa('.w', this.el), {
            opacity: 1,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: { trigger: this.el, start: 'top 80%', end: 'bottom 55%', scrub: true },
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   STITCH DIVIDERS
   ═══════════════════════════════════════════════════════════════════════ */

class Stitches {
    constructor() {
        if (Env.RM) return;

        qa('.stitch-path').forEach((path) => {
            const length = path.getTotalLength ? path.getTotalLength() : 400;
            gsap.fromTo(path,
                { strokeDashoffset: length, strokeDasharray: '7 7', opacity: 0.4 },
                {
                    strokeDashoffset: 0,
                    opacity: 1,
                    duration: 1.4,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: path.closest('.stitch'), start: 'top 88%' },
                });
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   SERVICES DECK  (sticky stack — cards stay readable while stacking)
   ═══════════════════════════════════════════════════════════════════════ */

class Deck {
    constructor() {
        this.cards = qa('.deck-card');
        if (!this.cards.length) return;

        this.layout();
        this.animate();
    }

    layout() {
        this.cards.forEach((card, i) => {
            card.style.top = `${Env.headH + i * 14}px`;
            card.style.zIndex = i + 1;
        });
    }

    animate() {
        if (Env.RM) return;

        this.cards.forEach((card, i) => {
            const next = this.cards[i + 1];
            if (!next) return;

            /* gentle recede: the covered card only starts to settle once the
               next card is genuinely arriving, and it never goes dark —
               a light scale + soft brightness keeps every word readable.
               NOTE: fromTo with an explicit brightness(1) start is required;
               tweening from `filter: none` makes GSAP start at brightness(0). */
            gsap.fromTo(card,
                { scale: 1, filter: 'brightness(1)' },
                {
                    scale: 0.95,
                    filter: 'brightness(.9)',
                    transformOrigin: '50% 0%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: next,
                        start: 'top 92%',
                        end: `top ${Env.headH + i * 14 + 30}px`,
                        scrub: true,
                    },
                });
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   COUNTERS
   ═══════════════════════════════════════════════════════════════════════ */

class Counters {
    constructor() {
        qa('[data-count]').forEach((el) => {
            const end = parseFloat(el.dataset.count);
            const decimals = parseInt(el.dataset.decimal || '0', 10);

            if (Env.RM) {
                el.textContent = end.toFixed(decimals);
                return;
            }

            const obj = { v: 0 };
            ScrollTrigger.create({
                trigger: el,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    gsap.to(obj, {
                        v: end,
                        duration: 1.8,
                        ease: 'power3.out',
                        onUpdate: () => { el.textContent = obj.v.toFixed(decimals); },
                        onComplete: () => { el.textContent = end.toFixed(decimals); },
                    });
                },
            });
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   PROCESS RAIL  (pinned horizontal scroll — desktop AND mobile)
   ═══════════════════════════════════════════════════════════════════════ */

class ProcessRail {
    constructor() {
        this.pin = q('#processPin');
        this.track = q('#processTrack');
        if (!this.pin || !this.track || Env.RM) return;

        this.build();
    }

    distance() {
        return this.track.scrollWidth - document.documentElement.clientWidth + parseFloat(getComputedStyle(this.track).paddingLeft);
    }

    build() {
        gsap.to(this.track, {
            x: () => -this.distance(),
            ease: 'none',
            scrollTrigger: {
                trigger: this.pin,
                start: 'top top',
                end: () => `+=${this.distance()}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => this.progress(self.progress),
            },
        });
    }

    progress(p) {
        gsap.set('#processProgress i', { scaleX: p });

        const bars = qa('.pstep-bar i');
        bars.forEach((bar, i) => {
            const per = 1 / bars.length;
            gsap.set(bar, { scaleX: gsap.utils.clamp(0, 1, (p - i * per) / per) });
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   PORTFOLIO PREVIEW  (floats with the cursor)
   ═══════════════════════════════════════════════════════════════════════ */

class FolioPreview {
    constructor() {
        if (Env.TOUCH || Env.RM) return;

        this.el = q('#folioPreview');
        if (!this.el) return;

        this.active = false;
        this.px = gsap.quickTo(this.el, 'x', { duration: 0.6, ease: 'power3' });
        this.py = gsap.quickTo(this.el, 'y', { duration: 0.6, ease: 'power3' });

        gsap.set(this.el, { xPercent: -50, yPercent: -50 });
        this.bind();
    }

    bind() {
        window.addEventListener('mousemove', (e) => {
            if (this.active) {
                this.px(e.clientX);
                this.py(e.clientY);
            }
        });

        qa('.folio-item').forEach((item) => {
            item.addEventListener('mouseenter', (e) => {
                this.active = true;
                this.px(e.clientX);
                this.py(e.clientY);
                qa('.fp-pane', this.el).forEach((pane) => {
                    pane.classList.toggle('active', pane.dataset.pane === item.dataset.preview);
                });
                gsap.to(this.el, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'expo.out', overwrite: true });
            });

            item.addEventListener('mouseleave', () => {
                this.active = false;
                gsap.to(this.el, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: 'power2.in', overwrite: true });
            });
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════════════════════════ */

class Testimonials {
    constructor() {
        this.slides = qa('.testi-slide');
        this.nav = q('#testiNav');
        if (!this.slides.length || !this.nav) return;

        this.idx = 0;
        this.timer = null;
        this.DURATION = 6000;

        this.buildDots();
        this.go(0);
    }

    buildDots() {
        this.slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'testi-dot';
            dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
            dot.innerHTML = '<i></i>';
            dot.addEventListener('click', () => this.go(i));
            this.nav.appendChild(dot);
        });
        this.dots = qa('.testi-dot i', this.nav);
    }

    go(i) {
        this.slides[this.idx].classList.remove('active');
        this.idx = i % this.slides.length;
        this.slides[this.idx].classList.add('active');

        this.dots.forEach((dot, j) => {
            gsap.killTweensOf(dot);
            gsap.set(dot, { scaleX: j < this.idx ? 1 : 0 });
        });

        if (!Env.RM) {
            gsap.fromTo(this.dots[this.idx], { scaleX: 0 }, { scaleX: 1, duration: this.DURATION / 1000, ease: 'none' });
        } else {
            gsap.set(this.dots[this.idx], { scaleX: 1 });
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.go(this.idx + 1), this.DURATION);
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════════════════════════════ */

class Faq {
    constructor() {
        qa('.faq-item').forEach((item) => {
            const question = q('.faq-q', item);
            const answer = q('.faq-a', item);

            question.addEventListener('click', () => this.toggle(item, question, answer));
        });
    }

    toggle(item, question, answer) {
        const isOpen = item.classList.contains('open');

        qa('.faq-item.open').forEach((other) => {
            if (other === item) return;
            other.classList.remove('open');
            q('.faq-q', other).setAttribute('aria-expanded', 'false');
            gsap.to(q('.faq-a', other), { height: 0, duration: 0.5, ease: 'expo.out' });
        });

        item.classList.toggle('open', !isOpen);
        question.setAttribute('aria-expanded', String(!isOpen));
        gsap.to(answer, { height: isOpen ? 0 : 'auto', duration: 0.55, ease: 'expo.out' });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   REVEALS
   ═══════════════════════════════════════════════════════════════════════ */

class Reveals {
    constructor() {
        if (Env.RM) {
            qa('.rv').forEach((el) => {
                el.style.opacity = 1;
                el.style.transform = 'none';
            });
            return;
        }

        ScrollTrigger.batch('.rv', {
            start: 'top 88%',
            onEnter: (batch) => gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'expo.out',
                stagger: 0.08,
                overwrite: true,
            }),
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   HEADER / PROGRESS / TO-TOP
   ═══════════════════════════════════════════════════════════════════════ */

class HeaderCtrl {
    constructor(smooth) {
        this.smooth = smooth;
        this.header = q('#header');
        this.progress = q('#scrollProgress');
        this.toTop = q('#toTop');
        this.mmenu = q('#mmenu');
        this.lastY = 0;

        this.smooth.onScroll(() => this.update());
        this.update();
    }

    update() {
        const y = this.smooth.y;
        const menuOpen = this.mmenu?.classList.contains('is-open');

        this.header.classList.toggle('is-scrolled', y > 40);
        this.header.classList.toggle('is-hidden', y > 500 && y > this.lastY && !menuOpen);
        this.toTop.classList.toggle('show', y > 900);

        const max = document.documentElement.scrollHeight - innerHeight;
        if (this.progress) {
            this.progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        }

        this.lastY = y;
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════════════════════════ */

class MobileMenu {
    constructor(smooth) {
        this.smooth = smooth;
        this.burger = q('#burger');
        this.menu = q('#mmenu');
        if (!this.burger || !this.menu) return;

        this.burger.addEventListener('click', () => this.toggle());
        qa('a', this.menu).forEach((a) => a.addEventListener('click', () => this.burger.click()));
    }

    toggle() {
        const open = this.menu.classList.toggle('is-open');
        this.burger.setAttribute('aria-expanded', String(open));
        this.menu.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
        open ? this.smooth.stop() : this.smooth.start();
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   FOOTER WORDMARK
   ═══════════════════════════════════════════════════════════════════════ */

class FooterWord {
    constructor() {
        if (Env.RM) return;

        gsap.fromTo('#footerWord',
            { yPercent: 46 },
            {
                yPercent: 6,
                ease: 'none',
                scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
            });
    }
}


/* ═══════════════════════════════════════════════════════════════════════
   APP BOOT
   ═══════════════════════════════════════════════════════════════════════ */

class App {
    constructor() {
        const doc = document.documentElement;

        if (Env.RM || !Env.hasGSAP) doc.classList.add('no-motion');

        /* graceful static page if the CDN failed */
        if (!Env.hasGSAP) {
            const loader = q('#loader');
            if (loader) loader.style.display = 'none';
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        this.smooth = new SmoothScroll();
        this.hero = new HeroIntro();

        new Preloader(() => this.hero.play());
        new Cursor();
        new Magnetic();
        new Marquees();
        new Manifesto();
        new Stitches();
        new Deck();
        new Counters();
        new ProcessRail();
        new FolioPreview();
        new Testimonials();
        new Faq();
        new Reveals();
        new HeaderCtrl(this.smooth);
        new MobileMenu(this.smooth);
        new FooterWord();

        /* re-measure once webfonts and embeds settle */
        window.addEventListener('load', () => ScrollTrigger.refresh());
        setTimeout(() => ScrollTrigger.refresh(), 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
