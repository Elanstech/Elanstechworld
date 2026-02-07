/**
 * ═══════════════════════════════════════════════════════════════
 * WHY US PAGE — Page-Specific Enhancements
 * Elan's Tech World — Premium Digital Atelier
 *
 * NOTE: The following are already handled by script.js (App class):
 *   • Loader           → Loader class
 *   • Header scroll    → Header class
 *   • Mobile menu      → Header class
 *   • Back to top      → BackToTop class
 *   • [data-animate]   → ScrollAnimations class  (adds .in-view)
 *   • [data-count]     → StatsCounter class       (counter animation)
 *   • FAQ accordion    → FAQ class
 *   • Newsletter       → Newsletter class
 *
 * This file ONLY adds behaviour unique to the Why Us page:
 *   1. Process timeline animated connector line
 *   2. Advantage card subtle tilt (desktop)
 *   3. Testimonial card staggered entrance
 *   4. Hero parallax background drift
 *   5. Philosophy strip staggered reveal
 *   6. Promise section badge spin-in
 *   7. Stats editorial number shimmer effect
 *   8. Smooth section anchor scrolling
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ── Helpers ───────────────────────────────────────────────
  const qs  = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => [...p.querySelectorAll(s)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  // ═══════════════════════════════════════════════════════════
  // 1. PROCESS TIMELINE — animated connector line
  //    ScrollAnimations adds .in-view via [data-animate],
  //    but the CSS line animation needs .animated class.
  //    Also staggers each step marker entrance.
  // ═══════════════════════════════════════════════════════════
  function initProcessTimeline() {
    const timeline = qs('.process-timeline');
    if (!timeline) return;

    const steps = qsa('.process-step', timeline);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger the CSS line fill animation
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, 300);

          // Stagger each step marker pop-in
          steps.forEach((step, i) => {
            setTimeout(() => {
              step.classList.add('step-visible');
            }, 500 + i * 200);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(timeline);
  }


  // ═══════════════════════════════════════════════════════════
  // 2. ADVANTAGE CARDS — subtle 3D tilt on hover (desktop)
  //    Creates a luxe micro-interaction where cards gently
  //    rotate toward the cursor, like holding a fine card.
  // ═══════════════════════════════════════════════════════════
  function initAdvantageCardTilt() {
    if (prefersReduced || window.innerWidth < 1024) return;

    const cards = qsa('.advantage-luxe-card');
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Max ±3° rotation — subtle, not gimmicky
        const rotateX = (0.5 - y) * 6;
        const rotateY = (x - 0.5) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.transition = 'transform 0.1s ease-out';

        // Move the accent line highlight
        const accent = card.querySelector('.advantage-luxe-accent');
        if (accent) {
          accent.style.background = `linear-gradient(90deg, transparent ${x * 40}%, var(--hermes) ${x * 100}%, transparent ${x * 100 + 40}%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s var(--ease-out)';

        const accent = card.querySelector('.advantage-luxe-accent');
        if (accent) accent.style.background = '';
      });
    });
  }


  // ═══════════════════════════════════════════════════════════
  // 3. TESTIMONIAL CARDS — staggered entrance + hover lift
  //    Cards enter with a waterfall effect, then float on hover.
  // ═══════════════════════════════════════════════════════════
  function initTestimonialCards() {
    const grid = qs('.testimonials-luxe-grid');
    if (!grid) return;

    const cards = qsa('.testimonial-luxe-card', grid);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('card-visible');
            }, i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(grid);

    // Subtle hover float effect
    if (!prefersReduced && window.innerWidth >= 768) {
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-8px)';
          card.style.boxShadow = '0 20px 60px rgba(27, 42, 74, 0.12)';
          card.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.boxShadow = '';
          card.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });
      });
    }
  }


  // ═══════════════════════════════════════════════════════════
  // 4. HERO PARALLAX — subtle background drift on scroll
  //    Matches the Apple-style parallax from the index page.
  // ═══════════════════════════════════════════════════════════
  function initHeroParallax() {
    const hero = qs('.why-hero');
    const bg = qs('.why-hero-bg');
    if (!hero || !bg || prefersReduced) return;

    let currentY = 0;
    let targetY = 0;
    const speed = 0.3;
    const smoothing = 0.08;
    let rafId = null;

    function onScroll() {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0) {
        targetY = window.scrollY * speed;
      }
    }

    function animate() {
      currentY += (targetY - currentY) * smoothing;
      bg.style.transform = `translate3d(0, ${currentY}px, 0) scale(1.15)`;
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId = requestAnimationFrame(animate);

    // Cleanup if navigated away
    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(rafId);
    });
  }


  // ═══════════════════════════════════════════════════════════
  // 5. PHILOSOPHY STRIP — staggered item reveal
  //    Each philosophy pillar (01, 02, 03) slides in with
  //    a cascading delay for an editorial presentation feel.
  // ═══════════════════════════════════════════════════════════
  function initPhilosophyReveal() {
    const grid = qs('.philosophy-grid');
    if (!grid) return;

    const items = qsa('.philosophy-item', grid);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add('philosophy-visible');
            }, i * 180);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(grid);
  }


  // ═══════════════════════════════════════════════════════════
  // 6. PROMISE SECTION — badge spin-in & features stagger
  //    The checkmark badge rotates in from 0° opacity when
  //    the section enters view, followed by cascading features.
  // ═══════════════════════════════════════════════════════════
  function initPromiseSection() {
    const section = qs('.why-promise');
    if (!section) return;

    const badge = qs('.promise-badge', section);
    const features = qsa('.promise-feature', section);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Spin in the badge
          if (badge) {
            badge.classList.add('badge-visible');
          }

          // Cascade the promise features
          features.forEach((feat, i) => {
            setTimeout(() => {
              feat.classList.add('feature-visible');
            }, 400 + i * 120);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(section);
  }


  // ═══════════════════════════════════════════════════════════
  // 7. STATS — number shimmer effect after count finishes
  //    After StatsCounter (script.js) finishes the count-up,
  //    we add a brief shimmer/glow to the numbers.
  // ═══════════════════════════════════════════════════════════
  function initStatsShimmer() {
    const statNumbers = qsa('.stat-editorial-number[data-count]');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Wait for the counter animation to finish (~2s from StatsCounter)
          setTimeout(() => {
            entry.target.classList.add('stat-shimmer');
          }, 2200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  }


  // ═══════════════════════════════════════════════════════════
  // 8. STATS DECIMAL HANDLER
  //    The StatsCounter in script.js handles integers.
  //    For "5.0" (client rating), we need a custom handler
  //    that animates to a decimal value.
  // ═══════════════════════════════════════════════════════════
  function initDecimalStats() {
    const decimalStats = qsa('[data-decimal="true"]');
    if (!decimalStats.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateDecimal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    decimalStats.forEach(el => observer.observe(el));

    function animateDecimal(el) {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = (target * eased).toFixed(1);
        el.textContent = current + suffix.replace('.0', '');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(1);
      };

      requestAnimationFrame(step);
    }
  }


  // ═══════════════════════════════════════════════════════════
  // 9. ADVANTAGE CARD NUMBER COUNTER
  //    Adds a subtle count-up to the advantage card numbers
  //    (01 → 06) as they enter the viewport.
  // ═══════════════════════════════════════════════════════════
  function initAdvantageNumbers() {
    const numbers = qsa('.advantage-luxe-number');
    if (!numbers.length) return;

    numbers.forEach(num => {
      const original = num.textContent;
      num.style.opacity = '0';
      num.style.transform = 'translateY(10px)';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              num.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
              num.style.opacity = '';
              num.style.transform = '';
              num.textContent = original;
            }, parseInt(entry.target.closest('[data-delay]')?.dataset.delay || 0));
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(num);
    });
  }


  // ═══════════════════════════════════════════════════════════
  // 10. CTA SECTION — gradient pulse animation
  //     Adds a subtle animated radial glow that pulses
  //     behind the CTA card when it enters the viewport.
  // ═══════════════════════════════════════════════════════════
  function initCtaPulse() {
    const ctaCard = qs('.cta-card');
    if (!ctaCard || prefersReduced) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ctaCard.classList.add('cta-pulsing');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(ctaCard);
  }


  // ═══════════════════════════════════════════════════════════
  // 11. HERO CONTENT — text reveal with character stagger
  //     The hero headline words fade-in sequentially for
  //     an editorial "typewriter" presentation.
  // ═══════════════════════════════════════════════════════════
  function initHeroTextReveal() {
    const heroInner = qs('.why-hero-inner');
    if (!heroInner || prefersReduced) return;

    const eyebrow = qs('.why-hero-eyebrow', heroInner);
    const title = qs('.why-hero-title', heroInner);
    const divider = qs('.why-hero-divider', heroInner);
    const desc = qs('.why-hero-description', heroInner);

    const elements = [eyebrow, title, divider, desc].filter(Boolean);

    // Set initial state
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
    });

    // After loader completes (~1.8s), begin staggered reveal
    const loaderDelay = 1800;

    elements.forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, loaderDelay + i * 200);
    });

    // Divider width animation
    if (divider) {
      divider.style.width = '0';
      setTimeout(() => {
        divider.style.transition = 'width 1s cubic-bezier(0.23, 1, 0.32, 1)';
        divider.style.width = '';
      }, loaderDelay + 400);
    }
  }


  // ═══════════════════════════════════════════════════════════
  // 12. SMOOTH ANCHOR SCROLL
  //     For any in-page anchor links specific to the Why Us page.
  // ═══════════════════════════════════════════════════════════
  function initSmoothAnchors() {
    qsa('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = qs(targetId);
        if (target) {
          e.preventDefault();
          const offset = 80; // Header height
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }


  // ═══════════════════════════════════════════════════════════
  // INIT — Wait for DOM + script.js to finish loading
  // ═══════════════════════════════════════════════════════════
  function init() {
    initHeroTextReveal();
    initHeroParallax();
    initPhilosophyReveal();
    initDecimalStats();
    initStatsShimmer();
    initAdvantageCardTilt();
    initAdvantageNumbers();
    initTestimonialCards();
    initProcessTimeline();
    initPromiseSection();
    initCtaPulse();
    initSmoothAnchors();

    console.log('✦ Why Us — Page enhancements loaded');
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
