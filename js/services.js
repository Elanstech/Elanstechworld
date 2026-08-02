/* ═══════════════════════════════════════════════════════════════════════════
   ELAN'S TECH WORLD — SERVICES PAGE (ES6)
   ─────────────────────────────────────────────────────────────────────────
   Full drop-in replacement for js/services.js.

   Loads after ../js/script.js and reuses its globals (Env, q, qa, gsap,
   ScrollTrigger). Wrapped in an IIFE so nothing here collides with the
   shared script's top-level declarations.

   Modules:
     HeroField        — animated dot-field + colour wash behind the hero
     CraftIndex       — the live six-craft index (auto-advances, tints the field)
     KineticType      — headline characters lift toward the cursor
     NycClock         — live New York time in the hero meta strip
     ChapterNav       — sticky sub-nav scrollspy with sliding indicator
     SeoRing          — SEO score ring + number fill (web chapter)
     ChartDraw        — marketing chart line draw-in
     CardTilt         — 3D business-card tilt (print chapter)
     PosPrint         — receipt prints out of the terminal on scroll
     NeonFlicker      — occasional realistic flicker on the neon sign
     DashLive         — property dashboard bars grow on scroll
     WatermarkDrift   — giant chapter numbers parallax
     TimelineDraw     — process rail draws itself as you scroll
   ═══════════════════════════════════════════════════════════════════════ */

(() => {
    'use strict';

    /* how long each craft stays lit in the hero index */
    const DWELL = 3600;


    /* ═══════════════════════════════════════════════════════════════════
       HERO FIELD — a slow colour wash under a reactive dot matrix
       ═══════════════════════════════════════════════════════════════════ */

    class HeroField {
        constructor() {
            this.canvas = q('#srvField');
            if (!this.canvas) return;

            this.ok = true;
            this.ctx = this.canvas.getContext('2d');
            this.host = this.canvas.parentElement;
            this.pointer = { x: 0, y: 0, on: false };
            this.tint = [43, 75, 223];
            this.target = [43, 75, 223];
            this.t = 0;
            this.running = true;

            this.resize();
            window.addEventListener('resize', () => this.resize());

            if (Env.RM) {
                this.paint(true);
                return;
            }

            this.bind();
            this.loop();
        }

        /* called by CraftIndex — "43,75,223" */
        setAccent(rgb) {
            if (!this.ok) return;
            const parts = String(rgb).split(',').map(Number);
            if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) this.target = parts;
        }

        resize() {
            const rect = this.host.getBoundingClientRect();
            this.w = Math.max(1, rect.width);
            this.h = Math.max(1, rect.height);

            /* capped DPR keeps big screens cheap */
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            this.canvas.width = this.w * dpr;
            this.canvas.height = this.h * dpr;
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (Env.RM) this.paint(true);
        }

        bind() {
            if (!Env.TOUCH) {
                this.host.addEventListener('mousemove', (e) => {
                    const r = this.host.getBoundingClientRect();
                    this.pointer.x = e.clientX - r.left;
                    this.pointer.y = e.clientY - r.top;
                    this.pointer.on = true;
                });
                this.host.addEventListener('mouseleave', () => { this.pointer.on = false; });
            }

            /* stop burning frames once the hero has scrolled away */
            if (typeof IntersectionObserver !== 'undefined') {
                new IntersectionObserver(([entry]) => {
                    const was = this.running;
                    this.running = entry.isIntersecting;
                    if (this.running && !was) this.loop();
                }).observe(this.host);
            }
        }

        loop() {
            if (!this.running) return;
            this.t += 1;
            this.paint();
            requestAnimationFrame(() => this.loop());
        }

        paint(still = false) {
            const { ctx, w, h } = this;
            const t = still ? 0 : this.t;

            /* ease the wash toward the active craft's colour */
            for (let i = 0; i < 3; i += 1) {
                this.tint[i] += (this.target[i] - this.tint[i]) * 0.03;
            }
            const tint = this.tint.map((v) => Math.round(v));

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#070C1E';
            ctx.fillRect(0, 0, w, h);

            /* ── three drifting washes ── */
            ctx.globalCompositeOperation = 'lighter';

            const blobs = [
                { x: 0.74 + Math.sin(t * 0.0016) * 0.05, y: 0.30 + Math.cos(t * 0.0013) * 0.07, r: 0.58, c: tint, a: 0.30 },
                { x: 0.16 + Math.cos(t * 0.0011) * 0.06, y: 0.74 + Math.sin(t * 0.0015) * 0.05, r: 0.50, c: [243, 112, 33], a: 0.18 },
                { x: 0.48 + Math.sin(t * 0.0009) * 0.10, y: 0.52 + Math.cos(t * 0.0012) * 0.09, r: 0.34, c: [196, 174, 126], a: 0.10 },
            ];

            blobs.forEach((b) => {
                const cx = b.x * w;
                const cy = b.y * h;
                const rad = b.r * Math.max(w, h);
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
                grad.addColorStop(0, `rgba(${b.c},${b.a})`);
                grad.addColorStop(0.5, `rgba(${b.c},${b.a * 0.3})`);
                grad.addColorStop(1, `rgba(${b.c},0)`);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            });

            ctx.globalCompositeOperation = 'source-over';

            /* ── dot matrix: a slow wave, plus a lift around the cursor ── */
            const step = 30;
            const reach = 190;
            const reach2 = reach * reach;
            const LEVELS = 5;
            const buckets = Array.from({ length: LEVELS }, () => []);

            for (let y = step; y < h; y += step) {
                for (let x = step; x < w; x += step) {
                    const wave = 0.5 + 0.5 * Math.sin(x * 0.011 + y * 0.013 + t * 0.012);
                    let v = 0.10 + wave * 0.16;
                    let size = 1.7;

                    if (this.pointer.on) {
                        const dx = x - this.pointer.x;
                        const dy = y - this.pointer.y;
                        const d2 = dx * dx + dy * dy;
                        if (d2 < reach2) {
                            const f = 1 - Math.sqrt(d2) / reach;
                            v += f * 0.75;
                            size += f * 2.6;
                        }
                    }

                    const li = Math.min(LEVELS - 1, Math.max(0, Math.floor((v / 1.0) * LEVELS)));
                    buckets[li].push(x, y, size);
                }
            }

            /* one fillStyle change per brightness level, not per dot */
            for (let i = 0; i < LEVELS; i += 1) {
                const arr = buckets[i];
                if (!arr.length) continue;
                const alpha = 0.07 + (i / (LEVELS - 1)) * 0.48;
                ctx.fillStyle = `rgba(244,238,223,${alpha.toFixed(3)})`;
                ctx.beginPath();
                for (let k = 0; k < arr.length; k += 3) {
                    const s = arr[k + 2];
                    ctx.rect(arr[k] - s / 2, arr[k + 1] - s / 2, s, s);
                }
                ctx.fill();
            }
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       CRAFT INDEX — auto-advancing hero index, tints the field, jumps to
       the matching chapter (anchors are smooth-scrolled by script.js)
       ═══════════════════════════════════════════════════════════════════ */

    class CraftIndex {
        constructor(field) {
            this.panel = q('#srvIndex');
            if (!this.panel) return;

            this.rows = qa('.srv-row', this.panel);
            if (!this.rows.length) return;

            this.ok = true;
            this.field = field;
            this.idx = 0;
            this.timer = null;
            this.held = false;

            this.rows.forEach((row, i) => {
                row.style.setProperty('--row-accent', row.dataset.accent || '243,112,33');

                const link = q('.sr-link', row);
                if (!link) return;

                const hold = () => { this.held = true; clearTimeout(this.timer); this.go(i, false); };
                const release = () => { if (!this.held) return; this.held = false; this.go(this.idx, true); };

                link.addEventListener('mouseenter', hold);
                link.addEventListener('focus', hold);
                link.addEventListener('mouseleave', release);
                link.addEventListener('blur', release);
            });

            /* hidden until the intro hands over */
            if (!Env.RM) {
                gsap.set(this.panel, { autoAlpha: 0, y: 28 });
                gsap.set(this.rows, { autoAlpha: 0, x: 18 });
            } else {
                this.go(0, false);
            }
        }

        play() {
            if (!this.ok || Env.RM) return;

            gsap.to(this.panel, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' });
            gsap.to(this.rows, { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out' });
            gsap.delayedCall(0.55, () => this.go(0, true));
        }

        go(i, autoplay = true) {
            if (!this.ok) return;

            this.idx = (i + this.rows.length) % this.rows.length;
            const row = this.rows[this.idx];
            const accent = row.dataset.accent || '243,112,33';

            this.rows.forEach((r, j) => r.classList.toggle('is-active', j === this.idx));
            this.panel.style.setProperty('--accent', accent);
            if (this.field) this.field.setAccent(accent);

            /* reset every bar, then run the active one */
            this.rows.forEach((r) => {
                const bar = q('.sr-bar i', r);
                if (!bar) return;
                gsap.killTweensOf(bar);
                gsap.set(bar, { scaleX: 0 });
            });

            const bar = q('.sr-bar i', row);
            clearTimeout(this.timer);

            if (autoplay && !Env.RM) {
                if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DWELL / 1000, ease: 'none' });
                this.timer = setTimeout(() => this.go(this.idx + 1, true), DWELL);
            } else if (bar) {
                gsap.set(bar, { scaleX: 1 });
            }
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       KINETIC TYPE — the headline reacts to the cursor after the intro
       ═══════════════════════════════════════════════════════════════════ */

    class KineticType {
        constructor() {
            this.word = q('.srv-hero .hero-word');
            this.hero = q('#hero');
            if (!this.word || !this.hero || Env.RM || Env.TOUCH) return;

            this.chars = qa('.ch', this.word);
            if (!this.chars.length) return;

            /* script.js clips the word during the intro reveal — release it
               so characters can lift above the line */
            gsap.set(this.word, { overflow: 'visible' });

            this.setters = this.chars.map((ch) => ({
                y: gsap.quickTo(ch, 'y', { duration: 0.55, ease: 'power3' }),
                s: gsap.quickTo(ch, 'scaleY', { duration: 0.55, ease: 'power3' }),
            }));

            this.cache();
            window.addEventListener('resize', () => this.cache());

            this.hero.addEventListener('mousemove', (e) => this.react(e.clientX));
            this.hero.addEventListener('mouseleave', () => this.reset());
        }

        cache() {
            this.centers = this.chars.map((ch) => {
                const r = ch.getBoundingClientRect();
                return r.left + r.width / 2;
            });
        }

        react(mouseX) {
            this.centers.forEach((cx, i) => {
                const f = Math.max(0, 1 - Math.abs(mouseX - cx) / 260);
                this.setters[i].y(-f * 16);
                this.setters[i].s(1 + f * 0.12);
            });
        }

        reset() {
            this.setters.forEach((s) => { s.y(0); s.s(1); });
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       NYC CLOCK
       ═══════════════════════════════════════════════════════════════════ */

    class NycClock {
        constructor() {
            this.el = q('#srvClock');
            if (!this.el) return;

            this.tick();
            setInterval(() => this.tick(), 20000);
        }

        tick() {
            const now = new Date();
            try {
                this.el.textContent = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'America/New_York',
                    hour: 'numeric',
                    minute: '2-digit',
                }).format(now);
            } catch (err) {
                this.el.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            }
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       CHAPTER NAV — scrollspy + sliding indicator
       ═══════════════════════════════════════════════════════════════════ */

    class ChapterNav {
        constructor() {
            this.nav = q('#chapnav');
            this.track = q('#chapnavTrack');
            this.indicator = q('#chapnavInd');
            if (!this.nav || !this.track || !this.indicator) return;

            this.links = qa('.chapnav-link', this.track);
            this.bindSpy();
            window.addEventListener('resize', () => this.moveTo(q('.chapnav-link.active', this.track)));
        }

        bindSpy() {
            this.links.forEach((link) => {
                const section = q(`#${link.dataset.chap}`);
                if (!section) return;

                ScrollTrigger.create({
                    trigger: section,
                    start: 'top 45%',
                    end: 'bottom 45%',
                    onToggle: (self) => {
                        if (self.isActive) this.activate(link);
                    },
                });
            });
        }

        activate(link) {
            this.links.forEach((l) => l.classList.toggle('active', l === link));
            this.moveTo(link);

            /* keep the active pill in view on narrow screens */
            link.scrollIntoView({ block: 'nearest', inline: 'center', behavior: Env.RM ? 'auto' : 'smooth' });
        }

        moveTo(link) {
            if (!link) {
                this.indicator.style.width = '0px';
                return;
            }
            const trackRect = this.track.getBoundingClientRect();
            const rect = link.getBoundingClientRect();
            this.indicator.style.width = `${rect.width}px`;
            this.indicator.style.transform = `translateX(${rect.left - trackRect.left + this.track.scrollLeft}px)`;
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       SEO RING — the score dial in the web chapter
       ═══════════════════════════════════════════════════════════════════ */

    class SeoRing {
        constructor() {
            this.fill = q('#wdRingFill');
            this.num = q('#wdRingNum');
            if (!this.fill || !this.num) return;

            const SCORE = 98;
            const CIRCUMFERENCE = 125.6;

            if (Env.RM) {
                this.fill.style.strokeDashoffset = CIRCUMFERENCE * (1 - SCORE / 100);
                this.num.textContent = SCORE;
                return;
            }

            const obj = { v: 0 };
            ScrollTrigger.create({
                trigger: this.fill,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    gsap.to(obj, {
                        v: SCORE,
                        duration: 1.8,
                        ease: 'power3.out',
                        onUpdate: () => {
                            this.num.textContent = Math.round(obj.v);
                            this.fill.style.strokeDashoffset = CIRCUMFERENCE * (1 - obj.v / 100);
                        },
                    });
                },
            });
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       CHART DRAW — the marketing growth line draws itself in
       ═══════════════════════════════════════════════════════════════════ */

    class ChartDraw {
        constructor() {
            this.line = q('#mkLine');
            this.area = q('#mkArea');
            if (!this.line || Env.RM) return;

            const length = this.line.getTotalLength();

            gsap.set(this.line, { strokeDasharray: length, strokeDashoffset: length });
            gsap.set(this.area, { opacity: 0 });

            ScrollTrigger.create({
                trigger: this.line,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(this.line, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' });
                    gsap.to(this.area, { opacity: 1, duration: 1.2, delay: 0.8 });
                },
            });
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       CARD TILT — the foil business card follows the cursor in 3D
       ═══════════════════════════════════════════════════════════════════ */

    class CardTilt {
        constructor() {
            this.stage = q('#bcStage');
            this.card = q('#bcCard');
            if (!this.stage || !this.card || Env.RM) return;

            if (Env.TOUCH) {
                gsap.to(this.card, {
                    rotateY: 10,
                    rotateX: -6,
                    duration: 3,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut',
                });
                return;
            }

            this.stage.addEventListener('mousemove', (e) => {
                const rect = this.stage.getBoundingClientRect();
                const nx = (e.clientX - rect.left) / rect.width - 0.5;
                const ny = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(this.card, {
                    rotateY: nx * 26,
                    rotateX: -ny * 20,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            });

            this.stage.addEventListener('mouseleave', () => {
                gsap.to(this.card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1,.5)' });
            });
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       POS PRINT — the receipt slides out of the terminal on scroll
       ═══════════════════════════════════════════════════════════════════ */

    class PosPrint {
        constructor() {
            this.stage = q('#posStage');
            if (!this.stage) return;

            if (Env.RM) {
                this.stage.classList.add('is-printed');
                return;
            }

            ScrollTrigger.create({
                trigger: this.stage,
                start: 'top 78%',
                once: true,
                onEnter: () => this.stage.classList.add('is-printed'),
            });
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       NEON FLICKER
       ═══════════════════════════════════════════════════════════════════ */

    class NeonFlicker {
        constructor() {
            this.sign = q('#neonSign');
            if (!this.sign || Env.RM) return;

            this.schedule();
        }

        schedule() {
            const delay = 3500 + Math.random() * 4500;
            setTimeout(() => {
                this.sign.classList.add('is-flicker');
                setTimeout(() => this.sign.classList.remove('is-flicker'), 1100);
                this.schedule();
            }, delay);
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       DASH LIVE
       ═══════════════════════════════════════════════════════════════════ */

    class DashLive {
        constructor() {
            this.dash = q('#ppDash');
            if (!this.dash) return;

            if (Env.RM) {
                this.dash.classList.add('is-live');
                return;
            }

            ScrollTrigger.create({
                trigger: this.dash,
                start: 'top 80%',
                once: true,
                onEnter: () => this.dash.classList.add('is-live'),
            });
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       WATERMARK DRIFT
       ═══════════════════════════════════════════════════════════════════ */

    class WatermarkDrift {
        constructor() {
            if (Env.RM) return;

            qa('.chapter-wm').forEach((wm) => {
                gsap.fromTo(wm,
                    { yPercent: 18 },
                    {
                        yPercent: -18,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: wm.closest('.chapter'),
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        },
                    });
            });
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       TIMELINE DRAW
       ═══════════════════════════════════════════════════════════════════ */

    class TimelineDraw {
        constructor() {
            this.progress = q('#tlineProgress');
            this.wrap = q('#tline');
            if (!this.progress || !this.wrap || Env.RM) return;

            gsap.to(this.progress, {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: this.wrap,
                    start: 'top 70%',
                    end: 'bottom 65%',
                    scrub: true,
                },
            });
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       INTRO HAND-OFF — run a callback once the preloader has cleared
       ═══════════════════════════════════════════════════════════════════ */

    const afterIntro = (cb) => {
        let done = false;
        const fire = () => {
            if (done) return;
            done = true;
            cb();
        };

        const loader = q('#loader');
        if (!loader || Env.RM || getComputedStyle(loader).display === 'none') {
            fire();
            return;
        }

        const obs = new MutationObserver(() => {
            if (loader.style.display === 'none') {
                obs.disconnect();
                fire();
            }
        });
        obs.observe(loader, { attributes: true, attributeFilter: ['style'] });

        /* safety net if the preloader never reports back */
        setTimeout(() => { obs.disconnect(); fire(); }, 6500);
    };


    /* ═══════════════════════════════════════════════════════════════════
       BOOT
       ═══════════════════════════════════════════════════════════════════ */

    const boot = () => {
        /* the shared script bails without GSAP — so do we */
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const field = new HeroField();
        const index = new CraftIndex(field);

        new NycClock();
        new ChapterNav();
        new SeoRing();
        new ChartDraw();
        new CardTilt();
        new PosPrint();
        new NeonFlicker();
        new DashLive();
        new WatermarkDrift();
        new TimelineDraw();

        afterIntro(() => {
            index.play();
            new KineticType();
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
