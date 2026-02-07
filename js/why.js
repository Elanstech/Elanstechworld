/**
 * ═══════════════════════════════════════════════════════════════
 * WHY US PAGE — Page-Specific Enhancements
 *
 * NOTE: The following are already handled by script.js (App class):
 *   • Loader           → Loader class
 *   • Header scroll    → Header class
 *   • Mobile menu      → Header class
 *   • Back to top      → BackToTop class
 *   • [data-animate]   → ScrollAnimations class  (adds .in-view)
 *   • [data-count]     → StatsCounter class       (counter animation)
 *   • Newsletter       → Newsletter class
 *
 * This file ONLY adds behaviour unique to the Why Us page:
 *   1. Process timeline animated connector line
 *   2. Advantage card subtle tilt (desktop)
 *   3. Testimonial card staggered entrance
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ── Helpers (tiny — avoid pulling in script.js's $ / $$ globally) ──
    const qs  = (s, p = document) => p.querySelector(s);
    const qsa = (s, p = document) => [...p.querySelectorAll(s)];


    // ═══════════════════════════════════════════════════════════
    // 1. PROCESS TIMELINE — animated connector line
    //    ScrollAnimations adds .in-view via [data-animate],
    //    but the CSS line animation also needs .animated class.
    // ═══════════════════════════════════════════════════════════
    function initProcessTimeline() {
        const timeline = qs('.process-timeline');
        if (!timeline) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small delay so the .in-view card reveals start first
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(timeline);
    }


    // ═══════════════════════════════════════════════════════════
    // 2. ADVANTAGE CARDS — subtle parallax tilt (desktop only)
    // ═══════════════════════════════════════════════════════════
    function initCardTilt() {
        if (window.innerWidth < 1024) return;        // skip on touch devices
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const cards = qsa('.advantage-luxe-card');
        if (!cards.length) return;

        const MAX_TILT = 2.5; // degrees — intentionally subtle

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 → 0.5
                const y = (e.clientY - rect.top)  / rect.height - 0.5;

                card.style.transform =
                    `translateY(-8px) perspective(800px) rotateX(${y * -MAX_TILT}deg) rotateY(${x * MAX_TILT}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                // Reset to the hover-only translateY (CSS handles the rest)
                card.style.transform = '';
            });
        });
    }


    // ═══════════════════════════════════════════════════════════
    // 3. TESTIMONIAL CARDS — staggered reveal on scroll
    //    (The grid wrapper gets [data-animate] → .in-view from
    //     ScrollAnimations, but individual cards need stagger.)
    // ═══════════════════════════════════════════════════════════
    function initTestimonialReveal() {
        const grid = qs('.testimonials-luxe-grid');
        if (!grid) return;

        const cards = qsa('.testimonial-luxe-card', grid);
        if (!cards.length) return;

        // Set initial hidden state
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(32px)';
            card.style.transition = 'opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cards.forEach((card, i) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, i * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        observer.observe(grid);
    }


    // ═══════════════════════════════════════════════════════════
    // INIT — wait for DOM, then fire page-specific modules
    // ═══════════════════════════════════════════════════════════
    function init() {
        initProcessTimeline();
        initCardTilt();
        initTestimonialReveal();

        console.log('✦ Why Us — page enhancements loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
