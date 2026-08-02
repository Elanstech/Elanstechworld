/* ═══════════════════════════════════════════════════════════════════════════
   ELAN'S TECH WORLD — PORTFOLIO (cinematic)
   ─────────────────────────────────────────────────────────────────────────
   Loads after js/script.js and reuses its globals (Env, q, qa, gsap).

   Modules:
     Reveals      — this page owns its reveals so nothing upstream can hide it
     Scenes       — entrance per scene, plus the capture panning on scroll
     Rail         — the side index tracks the active client
     PageCapture  — the big capture on a client page pans on hover
   ═══════════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════
     REVEALS
     ═══════════════════════════════════════════════════════════════════ */

  class Reveals {
    constructor() {
      this.items = qa('.rv');
      if (!this.items.length) return;

      const show = (el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      };

      if (Env.RM || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        this.items.forEach(show);
        return;
      }

      ScrollTrigger.batch('.rv', {
        start: 'top 92%',
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, overwrite: true }),
      });

      /* safety net — an unreadable page is worse than a missed animation */
      setTimeout(() => {
        this.items.forEach((el) => {
          if (Number(getComputedStyle(el).opacity) < 0.05) show(el);
        });
        ScrollTrigger.refresh();
      }, 1600);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     SCENES
     Each client sticks while the next rises over it (pure CSS). This adds
     the entrance, the depth as a scene gets covered, and the slow pan of
     the captured site tied to scroll position.
     ═══════════════════════════════════════════════════════════════════ */

  class Scenes {
    constructor() {
      this.scenes = qa('.cine');
      if (!this.scenes.length || Env.RM || typeof ScrollTrigger === 'undefined') return;

      this.scenes.forEach((scene, i) => {
        this.entrance(scene);
        this.pan(scene);
        this.depth(scene, i);
      });
    }

    /* copy and frame arrive as the scene takes the screen */
    entrance(scene) {
      const copy = qa('.cine-copy > *', scene);
      const visual = q('.cine-visual', scene);

      gsap.set(copy, { autoAlpha: 0, y: 30 });
      gsap.set(visual, { autoAlpha: 0, y: 44, scale: 0.97 });

      ScrollTrigger.create({
        trigger: scene,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          gsap.to(copy, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, ease: 'expo.out' });
          gsap.to(visual, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: 'expo.out', delay: 0.15 });
        },
      });
    }

    /* the captured page scrolls itself as you scroll the scene */
    pan(scene) {
      const screen = q('.cine-screen', scene);
      if (!screen) return;

      const img = q('img', screen);
      if (!img) return;

      const build = () => {
        const distance = img.offsetHeight - screen.clientHeight;
        if (distance <= 0) return;

        gsap.fromTo(
          img,
          { y: 0 },
          {
            y: -distance,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      };

      if (img.complete) build();
      else img.addEventListener('load', build, { once: true });
    }

    /* a covered scene recedes rather than simply disappearing */
    depth(scene, i) {
      const next = this.scenes[i + 1];
      if (!next) return;

      gsap.fromTo(
        scene,
        { scale: 1, filter: 'brightness(1)' },
        {
          scale: 0.94,
          filter: 'brightness(.55)',
          transformOrigin: '50% 40%',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 90%', end: 'top top', scrub: true },
        },
      );
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     RAIL
     ═══════════════════════════════════════════════════════════════════ */

  class Rail {
    constructor() {
      this.rail = q('#cineRail');
      this.scenes = qa('.cine');
      if (!this.rail || !this.scenes.length) return;

      this.items = qa('.cine-rail-item', this.rail);

      /* the rail only exists once the scenes begin */
      ScrollTrigger.create({
        trigger: this.scenes[0],
        start: 'top 60%',
        end: () => `bottom bottom`,
        onToggle: (self) => this.rail.classList.toggle('is-live', self.isActive),
      });

      this.scenes.forEach((scene, i) => {
        ScrollTrigger.create({
          trigger: scene,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) this.setActive(i);
          },
        });
      });
    }

    setActive(index) {
      this.items.forEach((item, i) => item.classList.toggle('is-on', i === index));
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     PAGE CAPTURE — client page hero screenshot
     ═══════════════════════════════════════════════════════════════════ */

  class PageCapture {
    constructor() {
      this.screen = q('.cw-capture-screen');
      if (!this.screen || Env.RM) return;

      this.img = q('img', this.screen);
      if (!this.img) return;

      this.screen.addEventListener('mouseenter', () => this.play());
      this.screen.addEventListener('mouseleave', () => this.reset());

      if (Env.TOUCH && typeof IntersectionObserver !== 'undefined') {
        new IntersectionObserver(
          ([entry], obs) => {
            if (!entry.isIntersecting) return;
            this.play();
            obs.disconnect();
          },
          { threshold: 0.5 },
        ).observe(this.screen);
      }
    }

    play() {
      const distance = this.img.offsetHeight - this.screen.clientHeight;
      if (distance <= 0) return;
      gsap.killTweensOf(this.img);
      gsap.to(this.img, { y: -distance, duration: 8, ease: 'none' });
    }

    reset() {
      gsap.killTweensOf(this.img);
      gsap.to(this.img, { y: 0, duration: 0.9, ease: 'power2.out' });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════════════════════════ */

  const boot = () => {
    /* outside the gsap guard — the page must render even if the CDN failed */
    new Reveals();

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    new Scenes();
    new Rail();
    new PageCapture();

    /* captures load lazily and change layout height as they arrive */
    window.addEventListener('load', () => ScrollTrigger.refresh());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
