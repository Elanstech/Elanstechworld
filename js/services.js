/* ═══════════════════════════════════════════════════════════════════════════
   ELAN'S TECH WORLD — SERVICES PAGE (ES6)
   ─────────────────────────────────────────────────────────────────────────
   Loads after ../js/script.js and reuses its globals (Env, q, qa, gsap,
   ScrollTrigger). Wrapped in an IIFE so nothing here collides with the
   shared script's top-level declarations.

   Modules:
     SmokeFX          — live canvas smoke in the hero (the showpiece)
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


    /* ═══════════════════════════════════════════════════════════════════
       SMOKE FX — soft royal/hermès smoke drifting through the ink hero
       ═══════════════════════════════════════════════════════════════════ */

    class SmokeFX {
        constructor() {
            this.canvas = q('#smokeCanvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.running = true;
            this.pointer = { x: -1, y: -1 };

            /* fewer particles on touch devices, none in reduced motion */
            this.MAX = Env.TOUCH ? 26 : 46;

            if (Env.RM) {
                this.resize();
                this.paintStill();
                return;
            }

            this.sprites = this.makeSprites();
            this.resize();
            this.seed();
            this.bind();
            this.loop();
        }

        /* pre-rendered soft radial sprites — far cheaper than per-frame blur */
        makeSprites() {
            const colors = [
                [43, 75, 223],    /* royal */
                [243, 112, 33],   /* hermès */
                [196, 174, 126],  /* gold */
            ];

            return colors.map(([r, g, b]) => {
                const size = 260;
                const c = document.createElement('canvas');
                c.width = size;
                c.height = size;
                const cx = c.getContext('2d');
                const grad = cx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
                grad.addColorStop(0, `rgba(${r},${g},${b},.55)`);
                grad.addColorStop(.45, `rgba(${r},${g},${b},.18)`);
                grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
                cx.fillStyle = grad;
                cx.fillRect(0, 0, size, size);
                return c;
            });
        }

        resize() {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            /* half-resolution buffer keeps it silky and soft */
            this.w = this.canvas.width = Math.max(1, rect.width * 0.5);
            this.h = this.canvas.height = Math.max(1, rect.height * 0.5);
        }

        spawn(atPointer = false) {
            const sprite = this.sprites[Math.floor(Math.random() * this.sprites.length)];
            return {
                sprite,
                x: atPointer ? this.pointer.x : Math.random() * this.w,
                y: atPointer ? this.pointer.y : this.h * (0.55 + Math.random() * 0.55),
                r: 30 + Math.random() * 60,
                growth: 0.14 + Math.random() * 0.2,
                vx: (Math.random() - 0.5) * 0.22,
                vy: -(0.18 + Math.random() * 0.4),
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.004 + Math.random() * 0.008,
                life: 0,
                maxLife: 420 + Math.random() * 280,
            };
        }

        seed() {
            for (let i = 0; i < this.MAX; i += 1) {
                const p = this.spawn();
                p.life = Math.random() * p.maxLife; /* start mid-life so it never looks empty */
                this.particles.push(p);
            }
        }

        bind() {
            window.addEventListener('resize', () => this.resize());

            /* the cursor stirs the smoke */
            if (!Env.TOUCH) {
                this.canvas.parentElement.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.pointer.x = (e.clientX - rect.left) * (this.w / rect.width);
                    this.pointer.y = (e.clientY - rect.top) * (this.h / rect.height);
                });
            }

            /* stop burning frames once the hero has scrolled away */
            if (typeof IntersectionObserver !== 'undefined') {
                new IntersectionObserver(([entry]) => {
                    this.running = entry.isIntersecting;
                    if (this.running) this.loop();
                }).observe(this.canvas.parentElement);
            }
        }

        loop() {
            if (!this.running) return;

            const { ctx } = this;
            ctx.clearRect(0, 0, this.w, this.h);
            ctx.globalCompositeOperation = 'lighter';

            this.particles.forEach((p, i) => {
                p.life += 1;
                p.wobble += p.wobbleSpeed;
                p.x += p.vx + Math.sin(p.wobble) * 0.35;
                p.y += p.vy;
                p.r += p.growth;

                /* gentle pull toward the cursor */
                if (this.pointer.x > 0) {
                    const dx = this.pointer.x - p.x;
                    const dy = this.pointer.y - p.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 160 && dist > 1) {
                        p.x += (dx / dist) * 0.5;
                        p.y += (dy / dist) * 0.5;
                    }
                }

                /* fade in, hold, fade out */
                const t = p.life / p.maxLife;
                const alpha = t < 0.15 ? t / 0.15
                            : t > 0.7 ? Math.max(0, (1 - t) / 0.3)
                            : 1;

                ctx.globalAlpha = alpha * 0.6;
                ctx.drawImage(p.sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);

                if (p.life >= p.maxLife || p.y < -p.r * 2) {
                    this.particles[i] = this.spawn();
                }
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(() => this.loop());
        }

        /* reduced motion: one calm, static wash of color */
        paintStill() {
            const { ctx } = this;
            ctx.globalCompositeOperation = 'lighter';
            const wash = (x, y, r, rgb) => {
                const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
                grad.addColorStop(0, `rgba(${rgb},.35)`);
                grad.addColorStop(1, `rgba(${rgb},0)`);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, this.w, this.h);
            };
            wash(this.w * 0.75, this.h * 0.35, this.w * 0.5, '43,75,223');
            wash(this.w * 0.2, this.h * 0.8, this.w * 0.45, '243,112,33');
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
            if (!this.line) return;

            const length = this.line.getTotalLength();

            if (Env.RM) return;

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
                /* gentle idle sway when there's no cursor to follow */
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
       NEON FLICKER — the sign hums, then flickers like the real thing
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
       DASH LIVE — property dashboard bars grow when it enters view
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
       WATERMARK DRIFT — giant chapter numbers parallax past the content
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
       TIMELINE DRAW — the process rail draws itself as you scroll
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
       BOOT
       ═══════════════════════════════════════════════════════════════════ */

    const boot = () => {
        /* the shared script bails without GSAP — so do we */
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        new SmokeFX();
        new ChapterNav();
        new SeoRing();
        new ChartDraw();
        new CardTilt();
        new PosPrint();
        new NeonFlicker();
        new DashLive();
        new WatermarkDrift();
        new TimelineDraw();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
