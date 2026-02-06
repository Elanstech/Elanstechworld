/**
 * ═══════════════════════════════════════════════════════════════
 *  SERVICES PAGE — Premium Redesign JavaScript
 *  Replaces AOS + Particles with IntersectionObserver animations
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // ─── SCROLL ANIMATIONS ────────────────────────────────────────
  // Replaces AOS library — observes [data-aos] elements and adds
  // the .in-view class when they enter the viewport.
  class ScrollAnimator {
    constructor() {
      this.items = $$('[data-aos]');
    }

    init() {
      if (!this.items.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = parseInt(entry.target.getAttribute('data-aos-delay') || '0', 10);
              setTimeout(() => {
                entry.target.classList.add('aos-animate', 'in-view');
              }, delay);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      this.items.forEach((el) => observer.observe(el));
    }
  }

  // ─── PROCESS TIMELINE ANIMATION ───────────────────────────────
  // Animates the "How We Work" steps sequentially as they scroll in
  class ProcessAnimator {
    constructor() {
      this.steps = $$('.process-step');
    }

    init() {
      if (!this.steps.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
      );

      // Set initial hidden state with staggered delays
      this.steps.forEach((step, i) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(24px)';
        step.style.transition = `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s`;
        observer.observe(step);
      });
    }
  }

  // ─── SERVICE CARDS HOVER ENHANCEMENT ──────────────────────────
  // Adds a subtle tilt/parallax effect on hover for service cards
  class CardHover {
    constructor() {
      this.cards = $$('.service-detailed-card');
    }

    init() {
      if (!this.cards.length || window.innerWidth < 1024) return;

      this.cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease, box-shadow 0.4s ease';
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }
  }

  // ─── SMOOTH ANCHOR SCROLLING ──────────────────────────────────
  class SmoothScroll {
    init() {
      $$('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          const target = $(a.getAttribute('href'));
          if (target) {
            e.preventDefault();
            const headerH = $('.header')?.offsetHeight || $('.header-futuristic')?.offsetHeight || 80;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      });
    }
  }

  // ─── COUNTER ANIMATION (for any stats) ────────────────────────
  class CounterAnimator {
    init() {
      const counters = $$('[data-count]');
      if (!counters.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((el) => observer.observe(el));
    }

    animate(el) {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }
  }

  // ─── INIT ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimator().init();
    new ProcessAnimator().init();
    new CardHover().init();
    new SmoothScroll().init();
    new CounterAnimator().init();
  });
})();
