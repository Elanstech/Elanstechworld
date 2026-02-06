/**
 * ═══════════════════════════════════════════════════════════════
 *  SERVICES PAGE — Premium Interactions
 *  Apple-style scroll reveals · Chrome mouse-tracking · Counters
 * ═══════════════════════════════════════════════════════════════
 */

// ─── SCROLL REVEAL — APPLE MACBOOK PRO STYLE ─────────────────
// Elements rise smoothly into view as you scroll, with staggered
// feature pills and icon pop animations triggered via CSS classes.
class ServiceScrollReveal {
  constructor() {
    this.cards = document.querySelectorAll('[data-scroll-reveal]');
  }

  init() {
    if (!this.cards.length) return;

    // Use IntersectionObserver with a generous threshold
    // so reveal starts as soon as the card enters the lower viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    this.cards.forEach(card => observer.observe(card));
  }
}

// ─── CHROME TEXT MOUSE-TRACKING ───────────────────────────────
// The mirror "Services" title shifts its gradient angle based on
// cursor position — like light reflecting off polished metal.
class ChromeMouseTrack {
  constructor() {
    this.el = document.getElementById('chromeTitle');
    this.hero = document.querySelector('.srv-hero');
    this.rafId = null;
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.currentX = 0.5;
    this.currentY = 0.5;
  }

  init() {
    if (!this.el || !this.hero) return;

    // Track mouse inside the hero section
    this.hero.addEventListener('mousemove', (e) => {
      const rect = this.hero.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) / rect.width;
      this.mouseY = (e.clientY - rect.top) / rect.height;
    });

    // Also respond to device orientation on mobile
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          // gamma: -90 to 90 (left/right tilt)
          // beta: -180 to 180 (front/back tilt)
          this.mouseX = (e.gamma + 90) / 180;
          this.mouseY = Math.min(Math.max((e.beta + 30) / 120, 0), 1);
        }
      });
    }

    this.animate();
  }

  animate() {
    // Lerp for smooth tracking
    this.currentX += (this.mouseX - this.currentX) * 0.06;
    this.currentY += (this.mouseY - this.currentY) * 0.06;

    // Map position to gradient angle (90–270 deg range)
    const angle = 90 + this.currentX * 180;

    // Map position to background-position for the shimmer
    const bgX = this.currentX * 100;
    const bgY = this.currentY * 100;

    this.el.style.background = `linear-gradient(
      ${angle}deg,
      #c0c0c0 0%,
      #fafafa 15%,
      #909090 28%,
      #f8f8f8 42%,
      #a8a8a8 50%,
      #f0f0f0 58%,
      #b8b8b8 72%,
      #fafafa 85%,
      #a0a0a0 100%
    )`;
    this.el.style.backgroundSize = '200% 200%';
    this.el.style.backgroundPosition = `${bgX}% ${bgY}%`;
    this.el.style.webkitBackgroundClip = 'text';
    this.el.style.backgroundClip = 'text';
    this.el.style.webkitTextFillColor = 'transparent';
    this.el.style.color = 'transparent';

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

// ─── COUNTER ANIMATION ────────────────────────────────────────
// Counts up numbers when they scroll into view (hero stats)
class ServiceCounters {
  constructor() {
    this.els = document.querySelectorAll('[data-count]');
  }

  init() {
    if (!this.els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.count(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.els.forEach(el => observer.observe(el));
  }

  count(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo for dramatic fast-then-slow
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}

// ─── PARALLAX ELEMENTS ────────────────────────────────────────
// Subtle parallax on service card icons as you scroll
class ServiceParallax {
  constructor() {
    this.icons = document.querySelectorAll('.srv-card-icon-wrap');
    this.ticking = false;
  }

  init() {
    if (!this.icons.length) return;
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => this.update());
        this.ticking = true;
      }
    }, { passive: true });
  }

  update() {
    const scrollY = window.scrollY;

    this.icons.forEach(icon => {
      const rect = icon.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = (centerY - viewportCenter) / window.innerHeight;

      // Subtle float effect (-10px to +10px)
      const offset = distance * -15;
      icon.style.transform = `translateY(${offset}px)`;
    });

    this.ticking = false;
  }
}

// ─── HORIZONTAL SCROLL HINT ──────────────────────────────────
// Auto-scroll the process track slightly to hint at more content
class ProcessScrollHint {
  constructor() {
    this.track = document.querySelector('.srv-process-track');
  }

  init() {
    if (!this.track) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.hint();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(this.track);
  }

  hint() {
    // Scroll right slightly then back to hint there's more
    setTimeout(() => {
      this.track.scrollTo({ left: 80, behavior: 'smooth' });
      setTimeout(() => {
        this.track.scrollTo({ left: 0, behavior: 'smooth' });
      }, 600);
    }, 400);
  }
}

// ─── FEATURE HOVER RIPPLE ────────────────────────────────────
// Adds a subtle ripple to feature items on hover
class FeatureHoverEffect {
  init() {
    document.querySelectorAll('.srv-feature').forEach(feature => {
      feature.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: 0; height: 0;
          left: ${x}px; top: ${y}px;
          background: rgba(232, 101, 26, 0.06);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: featureRipple 0.6s ease-out forwards;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple keyframe if not already added
    if (!document.getElementById('feature-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'feature-ripple-style';
      style.textContent = `
        @keyframes featureRipple {
          to { width: 300px; height: 300px; opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  new ServiceScrollReveal().init();
  new ChromeMouseTrack().init();
  new ServiceCounters().init();
  new ServiceParallax().init();
  new ProcessScrollHint().init();
  new FeatureHoverEffect().init();

  console.log('✦ Services — Premium Edition loaded');
});
