/**
 * Elan's Tech World - Complete JavaScript
 * Clean, organized structure - No redundancy
 */

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const Utils = {
  $: (selector, parent = document) => parent.querySelector(selector),
  $$: (selector, parent = document) => [...parent.querySelectorAll(selector)],
  
  throttle(func, delay) {
    let timeoutId = null;
    let lastExecTime = 0;
    
    return (...args) => {
      const currentTime = Date.now();
      const timeSinceLastExec = currentTime - lastExecTime;
      
      clearTimeout(timeoutId);
      
      if (timeSinceLastExec > delay) {
        lastExecTime = currentTime;
        func(...args);
      } else {
        timeoutId = setTimeout(() => {
          lastExecTime = Date.now();
          func(...args);
        }, delay - timeSinceLastExec);
      }
    };
  },
  
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }
};

// ==========================================
// LOADER
// ==========================================
class Loader {
  constructor() {
    this.loader = Utils.$('.loader-container');
  }

  init() {
    if (!this.loader) return;
    setTimeout(() => this.hide(), 1500);
  }

  hide() {
    this.loader.classList.add('hidden');
    document.body.classList.remove('preload');
    setTimeout(() => this.loader.style.display = 'none', 300);
  }
}

// ==========================================
// HEADER
// ==========================================
class Header {
  constructor() {
    this.header = Utils.$('.header');
  }

  init() {
    if (!this.header) return;
    this.handleScroll();
    window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 50));
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }
}

// ==========================================
// MOBILE MENU
// ==========================================
class MobileMenu {
  constructor() {
    this.menuToggle = Utils.$('.menu-toggle');
    this.mobileMenu = Utils.$('.mobile-menu');
    this.menuClose = Utils.$('.mobile-menu-close');
    this.backdrop = Utils.$('.mobile-menu-backdrop');
    this.navLinks = Utils.$$('.mobile-nav-link');
  }

  init() {
    if (!this.menuToggle || !this.mobileMenu) return;
    
    this.menuToggle.addEventListener('click', () => this.toggle());
    this.menuClose?.addEventListener('click', () => this.close());
    this.backdrop?.addEventListener('click', () => this.close());
    
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.close());
    });
  }

  toggle() {
    const isActive = this.mobileMenu.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  close() {
    this.mobileMenu.classList.remove('active');
    this.menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==========================================
// NAVIGATION
// ==========================================
class Navigation {
  constructor() {
    this.navLinks = Utils.$$('.nav-link, .mobile-nav-link');
    this.sections = Utils.$$('section[id]');
  }

  init() {
    if (!this.navLinks.length) return;
    
    this.initSmoothScroll();
    this.initScrollSpy();
  }

  initSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href?.startsWith('#')) {
          e.preventDefault();
          const target = Utils.$(href);
          
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 80,
              behavior: 'smooth'
            });
            
            this.updateActiveLink(href);
          }
        }
      });
    });
  }

  initScrollSpy() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.updateActiveLink(`#${id}`);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-100px 0px -66% 0px'
    });
    
    this.sections.forEach(section => observer.observe(section));
  }

  updateActiveLink(currentSection) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentSection) {
        link.classList.add('active');
      }
    });
  }
}

// ==========================================
// BACK TO TOP
// ==========================================
class BackToTop {
  constructor() {
    this.button = Utils.$('.back-to-top');
  }

  init() {
    if (!this.button) return;
    
    this.handleScroll();
    window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 200));
    this.button.addEventListener('click', (e) => this.scrollToTop(e));
  }

  handleScroll() {
    if (window.scrollY > 500) {
      this.button.classList.add('active');
    } else {
      this.button.classList.remove('active');
    }
  }

  scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ==========================================
// ADVANTAGES SLIDER (WHY US)
// ==========================================
class AdvantagesSlider {
  constructor() {
    this.sliderTrack = Utils.$('.advantages-slider-track');
    this.slideGroups = Utils.$$('.advantages-slide-group');
    this.progressBar = Utils.$('.slider-progress-bar');
    this.dots = Utils.$$('.slider-dot');
    this.currentIndex = 0;
    this.totalSlides = this.slideGroups.length;
    this.isTransitioning = false;
    this.autoplayTimer = null;
    this.progressTimer = null;
    this.slideInterval = 5000;
  }

  init() {
    if (!this.sliderTrack || this.slideGroups.length === 0) return;
    
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    this.startAutoplay();
    this.startProgressAnimation();
    
    const wrapper = Utils.$('.advantages-slider-wrapper');
    wrapper.addEventListener('mouseenter', () => this.pause());
    wrapper.addEventListener('mouseleave', () => this.resume());
    
    this.animateCards();
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    
    this.isTransitioning = true;
    this.currentIndex = index;
    
    const offset = -this.currentIndex * 100;
    this.sliderTrack.style.transform = `translateX(${offset}%)`;
    
    this.updateDots();
    
    setTimeout(() => {
      this.animateCards();
    }, 100);
    
    this.resetProgress();
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1000);
  }

  slideToNext() {
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  animateCards() {
    const currentGroup = this.slideGroups[this.currentIndex];
    const cards = Utils.$$('.advantage-card', currentGroup);
    
    cards.forEach((card, index) => {
      card.style.animation = 'none';
      card.offsetHeight;
      card.style.animation = `fadeInCard 0.6s ease-out ${index * 0.1}s forwards`;
    });
  }

  startAutoplay() {
    this.autoplayTimer = setInterval(() => {
      this.slideToNext();
    }, this.slideInterval);
  }

  startProgressAnimation() {
    let progress = 0;
    const increment = 100 / (this.slideInterval / 50);
    
    this.progressTimer = setInterval(() => {
      progress += increment;
      
      if (progress >= 100) {
        progress = 0;
      }
      
      if (this.progressBar) {
        this.progressBar.style.width = `${progress}%`;
      }
    }, 50);
  }

  resetProgress() {
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }

  pause() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  resume() {
    if (!this.autoplayTimer) {
      this.resetProgress();
      this.startAutoplay();
      this.startProgressAnimation();
    }
  }
}

// ==========================================
// PORTFOLIO
// ==========================================
class Portfolio {
  constructor() {
    this.grid = Utils.$('#portfolio-grid');
    this.projects = [
      {
        id: 1,
        title: 'Iconic Aesthetics',
        image: './assets/images/iconicwebsiteimage.jpeg',
        tags: ['Web Development', 'POS System', 'Booking'],
        category: 'web'
      },
      {
        id: 2,
        title: 'East Coast Realty',
        image: './assets/images/eastcoastweb.jpeg',
        tags: ['Web Development', 'Real Estate', 'Marketing'],
        category: 'web'
      },
      {
        id: 3,
        title: 'Cohen & Associates',
        image: './assets/images/cohen.jpeg',
        tags: ['Web Development', 'Legal', 'Security'],
        category: 'web'
      },
      {
        id: 4,
        title: 'Doug Uhlig Psychological Services',
        image: './assets/images/doug.jpeg',
        tags: ['Healthcare', 'HIPAA', 'Patient Portal'],
        category: 'web'
      },
      {
        id: 5,
        title: 'S-Cream',
        image: './assets/images/scream.jpeg',
        tags: ['E-commerce', 'Product Launch', 'Marketing'],
        category: 'web'
      },
      {
        id: 6,
        title: 'Century One Properties',
        image: './assets/images/centuryone.jpeg',
        tags: ['Property Management', 'Tenant Portal'],
        category: 'web'
      }
    ];
  }

  init() {
    if (!this.grid) return;
    
    this.render();
    this.animateItems();
  }

  render() {
    const html = this.projects.map(project => `
      <div class="portfolio-item" data-category="${project.category}">
        <img src="${project.image}" alt="${project.title}" 
             onerror="this.src='https://via.placeholder.com/400x500/0A0A0A/FF8C42?text=${encodeURIComponent(project.title)}'">
        <div class="portfolio-content">
          <div class="portfolio-tags">
            ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
          </div>
          <h3 class="portfolio-title">${project.title}</h3>
          <a href="#contact" class="portfolio-link">
            <span>View Details</span>
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `).join('');
    
    this.grid.innerHTML = html;
  }

  animateItems() {
    const items = Utils.$$('.portfolio-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    });
    
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(item);
    });
  }
}

// ==========================================
// FAQ
// ==========================================
class FAQ {
  constructor() {
    this.faqItems = Utils.$$('.faq-item');
  }

  init() {
    if (!this.faqItems.length) return;
    
    this.faqItems.forEach(item => {
      const question = Utils.$('.faq-question', item);
      
      question.addEventListener('click', () => {
        this.faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        item.classList.toggle('active');
      });
    });
  }
}

// ==========================================
// VIDEO HANDLER
// ==========================================
class VideoHandler {
  constructor() {
    this.heroVideo = Utils.$('.hero-video');
  }

  init() {
    if (!this.heroVideo) return;
    
    this.heroVideo.muted = true;
    this.heroVideo.playsInline = true;
    this.heroVideo.autoplay = true;
    this.heroVideo.loop = true;
    
    this.heroVideo.play().catch(() => {
      document.addEventListener('click', () => {
        this.heroVideo.play();
      }, { once: true });
    });
  }
}

// ==========================================
// AOS INTEGRATION
// ==========================================
class AOSIntegration {
  init() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-out',
        once: true,
        offset: 50,
        delay: 0,
        disable: false,
        startEvent: 'DOMContentLoaded'
      });
      
      window.addEventListener('resize', Utils.debounce(() => {
        AOS.refresh();
      }, 150));
      
      window.addEventListener('load', () => {
        AOS.refresh();
      });
    }
  }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
class ScrollAnimations {
  constructor() {
    this.elements = Utils.$$('.service-card, .result-card, .testimonial-card, .industry-card, .tech-item');
  }

  init() {
    if (!this.elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity 0.5s ease ${index * 0.03}s, transform 0.5s ease ${index * 0.03}s`;
      observer.observe(element);
    });
  }
}

// ==========================================
// STATS ANIMATION
// ==========================================
class StatsAnimation {
  constructor() {
    this.statNumbers = Utils.$$('.metric-value');
    this.animated = new Set();
  }

  init() {
    if (!this.statNumbers.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated.has(entry.target)) {
          this.animateStat(entry.target);
          this.animated.add(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    this.statNumbers.forEach(stat => observer.observe(stat));
  }

  animateStat(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasX = text.includes('x');
    const hasDollar = text.includes('$');
    const hasPlus = text.includes('+');
    const hasK = text.includes('K');
    
    let number = parseFloat(text.replace(/[^0-9.]/g, ''));
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 40;
    const stepTime = 30;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        let finalText = number;
        
        if (number % 1 !== 0) {
          finalText = (Math.round(number * 10) / 10).toString();
        } else {
          finalText = Math.round(number).toString();
        }
        
        if (hasDollar) finalText = '$' + finalText;
        if (hasK) finalText = finalText + 'K';
        if (hasPercent) finalText = finalText + '%';
        if (hasX) finalText = finalText + 'x';
        if (hasPlus) finalText = finalText + '+';
        
        element.textContent = finalText;
        clearInterval(timer);
      } else {
        let displayText = Math.floor(current);
        
        if (hasDollar) displayText = '$' + displayText;
        if (hasK) displayText = displayText + 'K';
        if (hasPercent) displayText = displayText + '%';
        if (hasX) displayText = displayText + 'x';
        if (hasPlus) displayText = displayText + '+';
        
        element.textContent = displayText;
      }
    }, stepTime);
  }
}

// ==========================================
// APPLICATION
// ==========================================
class App {
  constructor() {
    this.modules = {
      loader: new Loader(),
      header: new Header(),
      mobileMenu: new MobileMenu(),
      navigation: new Navigation(),
      backToTop: new BackToTop(),
      advantagesSlider: new AdvantagesSlider(),
      portfolio: new Portfolio(),
      faq: new FAQ(),
      videoHandler: new VideoHandler(),
      aosIntegration: new AOSIntegration(),
      scrollAnimations: new ScrollAnimations(),
      statsAnimation: new StatsAnimation()
    };
  }

  init() {
    document.body.classList.remove('preload');
    
    Object.entries(this.modules).forEach(([name, module]) => {
      if (module && typeof module.init === 'function') {
        try {
          module.init();
        } catch (error) {
          console.error(`Error initializing ${name}:`, error);
        }
      }
    });
    
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      
      if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
      }
    });
    
    console.log('✅ Elan\'s Tech World - Initialized');
  }
}

// ==========================================
// INITIALIZE
// ==========================================
const initApp = () => {
  const app = new App();
  app.init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
