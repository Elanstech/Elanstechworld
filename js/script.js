/**
 * ═══════════════════════════════════════════════════════════════
 *  ELAN'S TECH WORLD — Premium Redesign JS
 *  Clean, modular architecture — no redundancy
 * ═══════════════════════════════════════════════════════════════
 */

// ─── UTILITIES ────────────────────────────────────────────────
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const throttle = (fn, ms) => {
  let last = 0;
  return (...a) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...a); }
  };
};

const debounce = (fn, ms) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

// ─── LOADER ───────────────────────────────────────────────────
class Loader {
  constructor() {
    this.el = $('#loader');
  }

  init() {
    if (!this.el) return;
    // Hide after loading animation completes
    setTimeout(() => {
      this.el.classList.add('hidden');
      document.body.style.overflow = '';
      setTimeout(() => this.el.style.display = 'none', 600);
    }, 1600);
  }
}

// ─── HEADER ───────────────────────────────────────────────────
class Header {
  constructor() {
    this.header = $('#header');
    this.menuToggle = $('#menuToggle');
    this.mobileMenu = $('#mobileMenu');
    this.navLinks = $$('.nav-link');
    this.mobileLinks = $$('.mobile-nav-link');
  }

  init() {
    if (!this.header) return;

    this.onScroll();
    window.addEventListener('scroll', throttle(() => this.onScroll(), 60));

    // Mobile menu
    this.menuToggle?.addEventListener('click', () => this.toggleMobile());
    $('.mobile-menu-overlay')?.addEventListener('click', () => this.closeMobile());
    this.mobileLinks.forEach(l => l.addEventListener('click', () => this.closeMobile()));

    // Smooth scroll for hash links
    [...this.navLinks, ...this.mobileLinks].forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const target = $(href);
          if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
          }
        }
      });
    });

    // Scroll spy
    this.setupScrollSpy();
  }

  onScroll() {
    this.header.classList.toggle('scrolled', window.scrollY > 60);
  }

  toggleMobile() {
    const isActive = this.mobileMenu.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  closeMobile() {
    this.mobileMenu.classList.remove('active');
    this.menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  setupScrollSpy() {
    const sections = $$('section[id]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          [...this.navLinks, ...this.mobileLinks].forEach(l => {
            l.classList.toggle('active', l.getAttribute('href')?.includes(`#${id}`) || false);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });
    sections.forEach(s => obs.observe(s));
  }
}

// ─── BACK TO TOP ──────────────────────────────────────────────
class BackToTop {
  constructor() {
    this.btn = $('#backToTop');
  }

  init() {
    if (!this.btn) return;
    window.addEventListener('scroll', throttle(() => {
      this.btn.classList.toggle('visible', window.scrollY > 500);
    }, 200));

    this.btn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ─── SCROLL ANIMATIONS ───────────────────────────────────────
class ScrollAnimations {
  init() {
    const elements = $$('[data-animate]');
    if (!elements.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0);
          setTimeout(() => entry.target.classList.add('in-view'), delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => obs.observe(el));
  }
}

// ─── HERO VIDEO ──────────────────────────────────────────────
class HeroVideo {
  constructor() {
    this.video = $('.hero-video');
  }

  init() {
    if (!this.video) return;
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.play().catch(() => {
      document.addEventListener('click', () => this.video.play(), { once: true });
    });
  }
}

// ─── PORTFOLIO ────────────────────────────────────────────────
class Portfolio {
  constructor() {
    this.grid = $('#portfolio-grid');
    this.projects = [];
    this.limit = 6;
  }

  async init() {
    if (!this.grid) return;
    await this.load();
    this.shuffle();
    this.render();
  }

  async load() {
    try {
      const res = await fetch('projects.json');
      const data = await res.json();
      this.projects = data.projects.filter(p => !p.comingSoon);
    } catch (e) {
      console.error('Portfolio load error:', e);
      this.projects = [];
    }
  }

  shuffle() {
    for (let i = this.projects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.projects[i], this.projects[j]] = [this.projects[j], this.projects[i]];
    }
    this.projects = this.projects.slice(0, this.limit);
  }

  render() {
    if (!this.projects.length) {
      this.grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:3rem 0;">Portfolio loading&hellip;</p>';
      return;
    }

    this.grid.innerHTML = this.projects.map(p => `
      <div class="portfolio-card" data-animate="fade-up" ${p.website ? `onclick="window.open('${p.website}','_blank')"` : ''}>
        <div class="portfolio-card-image">
          <img src="${p.coverImage}" alt="${p.title}"
               onerror="this.src='https://via.placeholder.com/800x600/F8F5F0/1B2A4A?text=${encodeURIComponent(p.title)}'">
        </div>
        <div class="portfolio-card-overlay">
          <h3>${p.title}</h3>
          <span>${p.serviceType || p.category}</span>
        </div>
      </div>
    `).join('');

    // Trigger scroll animations on newly created cards
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    $$('.portfolio-card', this.grid).forEach(c => obs.observe(c));
  }
}

// ─── TESTIMONIALS SLIDER ──────────────────────────────────────
class Testimonials {
  constructor() {
    this.track = $('#testimonialsTrack');
    this.dotsWrap = $('#testimonialsDots');
    this.prevBtn = $('.testimonials-prev');
    this.nextBtn = $('.testimonials-next');
    this.current = 0;
    this.total = 0;
    this.autoTimer = null;
    this.interval = 6000;
  }

  init() {
    if (!this.track) return;

    this.cards = $$('.testimonial-card', this.track);
    this.total = this.cards.length;
    if (this.total <= 1) return;

    this.createDots();
    this.prevBtn?.addEventListener('click', () => this.go((this.current - 1 + this.total) % this.total));
    this.nextBtn?.addEventListener('click', () => this.go((this.current + 1) % this.total));

    // Auto-play
    this.startAuto();
    const slider = $('#testimonialsSlider');
    slider?.addEventListener('mouseenter', () => this.stopAuto());
    slider?.addEventListener('mouseleave', () => this.startAuto());

    // Touch support
    let startX = 0;
    this.track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    this.track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.go((this.current + 1) % this.total) : this.go((this.current - 1 + this.total) % this.total);
      }
    });
  }

  createDots() {
    if (!this.dotsWrap) return;
    this.dotsWrap.innerHTML = '';
    for (let i = 0; i < this.total; i++) {
      const dot = document.createElement('span');
      dot.className = `testimonials-dot${i === 0 ? ' active' : ''}`;
      dot.addEventListener('click', () => this.go(i));
      this.dotsWrap.appendChild(dot);
    }
    this.dots = $$('.testimonials-dot', this.dotsWrap);
  }

  go(index) {
    this.current = index;
    this.track.style.transform = `translateX(-${this.current * 100}%)`;
    this.dots?.forEach((d, i) => d.classList.toggle('active', i === this.current));
    this.stopAuto();
    this.startAuto();
  }

  startAuto() {
    this.stopAuto();
    this.autoTimer = setInterval(() => this.go((this.current + 1) % this.total), this.interval);
  }

  stopAuto() {
    if (this.autoTimer) { clearInterval(this.autoTimer); this.autoTimer = null; }
  }
}

// ─── STATS COUNTER (for Why Us page) ─────────────────────────
class StatsCounter {
  init() {
    const stats = $$('[data-count]');
    if (!stats.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(el => obs.observe(el));
  }

  animate(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}

// ─── FAQ ACCORDION ────────────────────────────────────────────
class FAQ {
  init() {
    $$('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasActive = item.classList.contains('active');

        // Close all
        $$('.faq-item').forEach(i => i.classList.remove('active'));

        // Toggle current
        if (!wasActive) item.classList.add('active');
      });
    });
  }
}

// ─── NEWSLETTER ───────────────────────────────────────────────
class Newsletter {
  constructor() {
    this.form = $('.footer-newsletter-form');
    this.input = this.form?.querySelector('input');
  }

  init() {
    if (!this.form) return;
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const email = this.input?.value.trim();
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.toast('Thank you for subscribing!');
        this.input.value = '';
      } else {
        this.toast('Please enter a valid email.', true);
      }
    });
  }

  toast(msg, isError = false) {
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '14px 24px',
      background: isError ? '#c0392b' : 'var(--hermes)',
      color: '#fff',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '0.875rem',
      zIndex: '9999',
      opacity: '0',
      transform: 'translateY(8px)',
      transition: '0.3s ease',
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  }
}

// ─── SERVICES SLIDER (for index homepage) ─────────────────────
class ServicesSlider {
  constructor() {
    this.track = $('.services-slider-track');
    this.cards = $$('.service-card');
    this.prevBtn = $('.services-arrow-prev');
    this.nextBtn = $('.services-arrow-next');
    this.progressBar = $('.services-progress-bar');
    this.currentIndex = 0;
    this.autoTimer = null;
    this.slideInterval = 4000;
    this.cardsPerView = 3;
    this.totalSlides = 0;
  }

  init() {
    if (!this.track || this.cards.length === 0) return;
    this.updateLayout();
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    window.addEventListener('resize', debounce(() => this.updateLayout(), 200));
  }

  updateLayout() {
    const w = window.innerWidth;
    this.cardsPerView = w <= 768 ? 1 : w <= 1024 ? 2 : 3;
    this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
    if (this.currentIndex >= this.totalSlides) this.currentIndex = this.totalSlides - 1;
    this.goTo(this.currentIndex);
  }

  goTo(idx) {
    this.currentIndex = idx;
    const offset = -(idx * (100 / this.cardsPerView)) * this.cardsPerView;
    if (this.track) {
      this.track.style.transform = `translateX(${offset}%)`;
    }
  }

  next() { this.goTo((this.currentIndex + 1) % this.totalSlides); }
  prev() { this.goTo((this.currentIndex - 1 + this.totalSlides) % this.totalSlides); }
}

// ─── RESULTS SLIDER (for index homepage) ──────────────────────
class ResultsSlider {
  constructor() {
    this.track = $('.results-slider-track');
    this.cards = $$('.result-card');
    this.prevBtn = $('.results-arrow-prev');
    this.nextBtn = $('.results-arrow-next');
    this.currentIndex = 0;
    this.totalSlides = 0;
    this.cardsPerView = 3;
  }

  init() {
    if (!this.track || this.cards.length === 0) return;
    this.updateLayout();
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
    window.addEventListener('resize', debounce(() => this.updateLayout(), 200));
  }

  updateLayout() {
    const w = window.innerWidth;
    this.cardsPerView = w <= 768 ? 1 : w <= 1024 ? 2 : 3;
    this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
    if (this.currentIndex >= this.totalSlides) this.currentIndex = this.totalSlides - 1;
    this.goTo(this.currentIndex);
  }

  goTo(idx) {
    this.currentIndex = idx;
    const offset = -(idx * (100 / this.cardsPerView)) * this.cardsPerView;
    if (this.track) this.track.style.transform = `translateX(${offset}%)`;
  }

  next() { this.goTo((this.currentIndex + 1) % this.totalSlides); }
  prev() { this.goTo((this.currentIndex - 1 + this.totalSlides) % this.totalSlides); }
}

// ─── WHY US SLIDER (for index homepage) ───────────────────────
class WhyUsSlider {
  constructor() {
    this.track = $('.why-us-slider-track');
    this.cards = $$('.why-us-card');
    this.progressBar = $('.why-us-progress-bar');
    this.dotsContainer = $('.why-us-indicators');
    this.currentIndex = 0;
    this.autoTimer = null;
    this.slideInterval = 3000;
    this.cardsPerView = 3;
    this.totalSlides = 0;
  }

  init() {
    if (!this.track || this.cards.length === 0) return;
    this.updateLayout();
    window.addEventListener('resize', debounce(() => this.updateLayout(), 200));
    this.startAuto();
  }

  updateLayout() {
    const w = window.innerWidth;
    this.cardsPerView = w <= 1024 ? 1 : 3;
    this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
  }

  goTo(idx) {
    this.currentIndex = idx;
    const pct = (100 / this.cardsPerView) * this.cardsPerView;
    this.track.style.transform = `translateX(-${idx * pct}%)`;
  }

  startAuto() {
    this.autoTimer = setInterval(() => {
      this.goTo((this.currentIndex + 1) % this.totalSlides);
    }, this.slideInterval);
  }
}

// ─── TESTIMONIALS CAROUSEL (legacy support) ───────────────────
class TestimonialsCarousel {
  constructor() {
    this.track = $('.testimonials-carousel-track');
    this.cards = $$('.testimonials-carousel-card');
  }

  init() {
    // Only used on sub-pages; skips if not present
    if (!this.track || this.cards.length === 0) return;
  }
}

// ─── APPLICATION ──────────────────────────────────────────────
class App {
  constructor() {
    this.modules = {
      loader: new Loader(),
      header: new Header(),
      backToTop: new BackToTop(),
      scrollAnimations: new ScrollAnimations(),
      heroVideo: new HeroVideo(),
      portfolio: new Portfolio(),
      testimonials: new Testimonials(),
      statsCounter: new StatsCounter(),
      faq: new FAQ(),
      newsletter: new Newsletter(),
      // Legacy slider support for existing sub-pages
      servicesSlider: new ServicesSlider(),
      resultsSlider: new ResultsSlider(),
      whyUsSlider: new WhyUsSlider(),
      testimonialsCarousel: new TestimonialsCarousel(),
    };
  }

  init() {
    Object.entries(this.modules).forEach(([name, mod]) => {
      try {
        if (typeof mod.init === 'function') mod.init();
      } catch (err) {
        console.error(`[${name}]`, err);
      }
    });
    console.log('✦ Elan\'s Tech World — Premium Edition loaded');
  }
}

// ─── INIT ─────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App().init());
} else {
  new App().init();
}
