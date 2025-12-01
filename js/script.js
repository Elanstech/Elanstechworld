/**
 * Elan's Tech World - Luxury Complete JavaScript
 * ES6+ Class-Based Architecture with AOS Integration
 */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
  scrollThreshold: 50,
  animationDelay: 100,
  counterDuration: 2000,
  loaderDuration: 2000,
  throttleDelay: 100,
  debounceDelay: 250,
  intersectionThreshold: 0.1,
  headerHeight: 80
};

// ==========================================
// UTILITY CLASS
// ==========================================
class Utils {
  static throttle(func, delay) {
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
  }

  static debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  static $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  static $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  }

  static createElement(tag, className, content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  }

  static animateElement(element, delay = 0) {
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);
  }
}

// ==========================================
// LOADER CLASS
// ==========================================
class Loader {
  constructor() {
    this.loader = Utils.$('.loader-container');
  }

  init() {
    if (!this.loader) return;
    
    setTimeout(() => this.hide(), CONFIG.loaderDuration);
  }

  hide() {
    this.loader.classList.add('hidden');
    document.body.classList.remove('preload');
    
    setTimeout(() => {
      this.loader.style.display = 'none';
    }, 500);
  }
}

// ==========================================
// HEADER CLASS
// ==========================================
class Header {
  constructor() {
    this.header = Utils.$('.header');
    this.lastScroll = 0;
  }

  init() {
    if (!this.header) return;
    
    this.handleScroll();
    window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), CONFIG.throttleDelay));
  }

  handleScroll() {
    const currentScroll = window.scrollY;
    
    if (currentScroll > CONFIG.scrollThreshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    this.lastScroll = currentScroll;
  }
}

// ==========================================
// MOBILE MENU CLASS
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
    
    this.bindEvents();
  }

  bindEvents() {
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
// NAVIGATION CLASS
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
            const targetPosition = target.offsetTop - CONFIG.headerHeight;
            
            window.scrollTo({
              top: targetPosition,
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
// BACK TO TOP CLASS
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// ==========================================
// COUNTER CLASS
// ==========================================
class Counter {
  constructor() {
    this.counters = Utils.$$('.counter');
    this.animated = new Set();
  }

  init() {
    if (!this.counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated.has(entry.target)) {
          this.animateCounter(entry.target);
          this.animated.add(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    this.counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    let current = 0;
    const increment = target / 50;
    const stepTime = CONFIG.counterDuration / 50;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, stepTime);
  }
}

// ==========================================
// PORTFOLIO CLASS
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
          }, index * CONFIG.animationDelay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: CONFIG.intersectionThreshold });
    
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(item);
    });
  }
}

// ==========================================
// FAQ CLASS
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
        // Close other items
        this.faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    });
  }
}

// ==========================================
// PARALLAX CLASS
// ==========================================
class Parallax {
  constructor() {
    this.heroVideo = Utils.$('.hero-video');
  }

  init() {
    if (!this.heroVideo) return;
    
    window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 10));
  }

  handleScroll() {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    
    if (this.heroVideo) {
      this.heroVideo.style.transform = `translateY(${rate}px)`;
    }
  }
}

// ==========================================
// VIDEO HANDLER CLASS
// ==========================================
class VideoHandler {
  constructor() {
    this.heroVideo = Utils.$('.hero-video');
  }

  init() {
    if (!this.heroVideo) return;
    
    // Ensure video plays on mobile
    this.heroVideo.setAttribute('playsinline', '');
    this.heroVideo.setAttribute('muted', '');
    this.heroVideo.muted = true;
    
    // Handle video load
    this.heroVideo.addEventListener('loadeddata', () => {
      this.heroVideo.play().catch(err => {
        console.log('Video autoplay prevented:', err);
      });
    });
    
    // Pause video when out of view for performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.heroVideo.play().catch(() => {});
        } else {
          this.heroVideo.pause();
        }
      });
    });
    
    observer.observe(this.heroVideo);
  }
}

// ==========================================
// AOS INTEGRATION CLASS
// ==========================================
class AOSIntegration {
  init() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        delay: 0
      });
      
      // Refresh AOS on window resize
      window.addEventListener('resize', Utils.debounce(() => {
        AOS.refresh();
      }, 200));
    }
  }
}

// ==========================================
// SCROLL ANIMATIONS CLASS
// ==========================================
class ScrollAnimations {
  constructor() {
    this.elements = Utils.$$('.advantage-card, .service-card, .result-card, .testimonial-card, .industry-card, .tech-item');
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
    }, { threshold: CONFIG.intersectionThreshold });
    
    this.elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
      observer.observe(element);
    });
  }
}

// ==========================================
// FORM ENHANCEMENT CLASS
// ==========================================
class FormEnhancement {
  constructor() {
    this.forms = Utils.$$('form');
  }

  init() {
    if (!this.forms.length) return;
    
    this.forms.forEach(form => {
      const inputs = Utils.$$('input, textarea', form);
      
      inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', () => {
          input.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
          if (!input.value) {
            input.parentElement?.classList.remove('focused');
          }
        });
        
        // Check if already has value on load
        if (input.value) {
          input.parentElement?.classList.add('focused');
        }
      });
    });
  }
}

// ==========================================
// STATS ANIMATION CLASS
// ==========================================
class StatsAnimation {
  constructor() {
    this.statNumbers = Utils.$$('.stat-number, .metric-value');
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
    }, { threshold: 0.5 });
    
    this.statNumbers.forEach(stat => observer.observe(stat));
  }

  animateStat(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasX = text.includes('x');
    const hasDollar = text.includes('$');
    const hasPlus = text.includes('+');
    
    // Extract number
    const number = parseFloat(text.replace(/[^0-9.]/g, ''));
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 50;
    const stepTime = 30;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        let finalText = Math.round(number * 10) / 10;
        if (hasDollar) finalText = '$' + finalText + 'K';
        if (hasPercent) finalText = finalText + '%';
        if (hasX) finalText = finalText + 'x';
        if (hasPlus) finalText = finalText + '+';
        element.textContent = finalText;
        clearInterval(timer);
      } else {
        let displayText = Math.floor(current);
        if (hasDollar) displayText = '$' + displayText + 'K';
        if (hasPercent) displayText = displayText + '%';
        if (hasX) displayText = displayText + 'x';
        if (hasPlus) displayText = displayText + '+';
        element.textContent = displayText;
      }
    }, stepTime);
  }
}

// ==========================================
// APPLICATION CLASS
// ==========================================
class App {
  constructor() {
    this.modules = {
      loader: new Loader(),
      header: new Header(),
      mobileMenu: new MobileMenu(),
      navigation: new Navigation(),
      backToTop: new BackToTop(),
      counter: new Counter(),
      portfolio: new Portfolio(),
      faq: new FAQ(),
      parallax: new Parallax(),
      videoHandler: new VideoHandler(),
      aosIntegration: new AOSIntegration(),
      scrollAnimations: new ScrollAnimations(),
      formEnhancement: new FormEnhancement(),
      statsAnimation: new StatsAnimation()
    };
  }

  init() {
    // Remove preload class after a brief delay
    setTimeout(() => {
      document.body.classList.remove('preload');
    }, 100);
    
    // Initialize all modules
    Object.values(this.modules).forEach(module => {
      if (module && typeof module.init === 'function') {
        module.init();
      }
    });
    
    // Add loaded class to body
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
    });
  }
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================
const initApp = () => {
  const app = new App();
  app.init();
};

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, Utils, CONFIG };
}
