/* ═══════════════════════════════════════════════════════════════════════════
   ELAN'S TECH WORLD — WHY US PAGE (ES6)
   ─────────────────────────────────────────────────────────────────────────
   Loads after ../js/script.js and reuses its globals (Env, q, qa, gsap,
   ScrollTrigger). Wrapped in an IIFE so nothing here collides with the
   shared script's top-level declarations.

   The shared script already handles: preloader, hero intro, cursor,
   magnetic buttons, marquee, stitch, [data-count] counters, .rv reveals,
   FAQ accordion, header, mobile menu and footer wordmark. This file only
   adds what's unique to this page.

   Modules:
     SpecSwitch    — the hero's template-vs-hand-cut comparison (signature)
     TableReveal   — the comparison table's own column animates in last
   ═══════════════════════════════════════════════════════════════════════ */

(() => {
    'use strict';


    /* ═══════════════════════════════════════════════════════════════════
       SPEC SWITCH
       Two states, four cells. Values and bars are declared in the markup
       as data-template / data-elans, so the copy lives in the HTML where
       it belongs and this file just moves between them.
       ═══════════════════════════════════════════════════════════════════ */

    class SpecSwitch {
        constructor() {
            this.panel = q('#wuSpec');
            if (!this.panel) return;

            this.ok = true;
            this.buttons = qa('.wu-spec-btn', this.panel);
            this.values = qa('.wu-cell-value', this.panel);
            this.bars = qa('.wu-cell-bar i', this.panel);
            this.state = this.panel.dataset.state || 'template';
            this.demoed = false;

            this.buttons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.demoed = true;              /* user took over */
                    this.set(btn.dataset.state);
                });
            });

            /* hidden until the intro hands over */
            if (!Env.RM) gsap.set(this.panel, { autoAlpha: 0, y: 26 });

            this.set(this.state, true);
        }

        set(state, silent = false) {
            if (!this.ok || state === this.state && !silent) return;

            this.state = state;
            this.panel.dataset.state = state;
            this.buttons.forEach((b) => b.classList.toggle('is-on', b.dataset.state === state));

            /* bars are pure CSS transitions */
            this.bars.forEach((bar) => {
                bar.style.width = `${bar.dataset[state] || 0}%`;
            });

            this.values.forEach((el, i) => {
                const next = el.dataset[state];
                if (next === undefined) return;

                if (Env.RM || silent) {
                    el.textContent = next;
                    return;
                }

                /* flip the old value out, the new one in */
                gsap.timeline({ delay: i * 0.05 })
                    .to(el, { y: -14, autoAlpha: 0, duration: 0.22, ease: 'power2.in' })
                    .add(() => { el.textContent = next; })
                    .fromTo(el, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'expo.out' });
            });
        }

        /* called once the preloader clears */
        play() {
            if (!this.ok) return;

            if (Env.RM) {
                this.set('elans', true);
                return;
            }

            gsap.to(this.panel, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' });

            /* show the point rather than explaining it — flip to our column
               on its own once, then leave the control to the visitor */
            gsap.delayedCall(1.6, () => {
                if (!this.demoed) this.set('elans');
            });
        }
    }


    /* ═══════════════════════════════════════════════════════════════════
       TABLE REVEAL — the other three columns land, then ours
       ═══════════════════════════════════════════════════════════════════ */

    class TableReveal {
        constructor() {
            this.table = q('.wu-table');
            if (!this.table || Env.RM) return;

            const ours = qa('.wu-col-ours', this.table);
            if (!ours.length) return;

            gsap.set(ours, { opacity: 0 });

            ScrollTrigger.create({
                trigger: this.table,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(ours, {
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.06,
                        ease: 'power2.out',
                        delay: 0.25,
                    });
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

        setTimeout(() => { obs.disconnect(); fire(); }, 6500);
    };


    /* ═══════════════════════════════════════════════════════════════════
       BOOT
       ═══════════════════════════════════════════════════════════════════ */

    const boot = () => {
        /* the shared script bails without GSAP — so do we */
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const spec = new SpecSwitch();
        new TableReveal();

        afterIntro(() => spec.play());
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
