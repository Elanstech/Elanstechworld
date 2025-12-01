/**
 * Elan's Tech World - Luxury Portfolio JavaScript
 * ES6+ Class-Based Architecture
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
  }

  init() {
    if (!this.counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
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
        tags: ['Web Development', 'POS System'],
        category: 'web'
      },
      {
        id: 2,
        title: 'East Coast Realty',
        image: './assets/images/eastcoastweb.jpeg',
        tags: ['Web Development', 'Marketing'],
        category: 'web'
      },
      {
        id: 3,
        title: 'Cohen & Associates',
        image: './assets/images/cohen.jpeg',
        tags: ['Web Development', 'Security'],
        category: 'web'
      },
      {
        id: 4,
        title: 'Doug Uhlig',
        image: './assets/images/doug.jpeg',
        tags: ['Healthcare', 'HIPAA'],
        category: 'web'
      },
      {
        id: 5,
        title: 'S-Cream',
        image: './assets/images/scream.jpeg',
        tags: ['E-commerce', 'POS'],
        category: 'web'
      },
      {
        id: 6,
        title: 'Century One',
        image: './assets/images/centuryone.jpeg',
        tags: ['Property Management'],
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
            <span>View Project</span>
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
          Utils.animateElement(entry.target, index * CONFIG.animationDelay);
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
// CONTACT FORM CLASS
// ==========================================
class ContactForm {
  constructor() {
    this.form = Utils.$('#contact-form');
  }

  init() {
    if (!this.form) return;
    
    this.bindEvents();
    this.initFloatingLabels();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    const submitBtn = Utils.$('button[type="submit"]', this.form);
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      this.showSuccess();
    }, 1500);
  }

  showSuccess() {
    this.form.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; color: var(--hermes-orange); margin-bottom: 1rem;">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="margin-bottom: 0.5rem;">Thank You!</h3>
        <p style="margin: 0; color: var(--gray-lighter);">
          Your message has been sent successfully. We'll get back to you soon.
        </p>
      </div>
    `;
  }

  initFloatingLabels() {
    const inputs = Utils.$$('input, textarea', this.form);
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.value) {
          input.classList.add('has-value');
        } else {
          input.classList.remove('has-value');
        }
      });
    });
  }
}

// ==========================================
// SCROLL ANIMATIONS CLASS
// ==========================================
class ScrollAnimations {
  constructor() {
    this.elements = Utils.$$('.service-card, .process-step, .stat-item');
  }

  init() {
    if (!this.elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          Utils.animateElement(entry.target, index * CONFIG.animationDelay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: CONFIG.intersectionThreshold });
    
    this.elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }
}

// ==========================================
// PARALLAX CLASS
// ==========================================
class Parallax {
  constructor() {
    this.heroGradient = Utils.$('.hero-gradient');
  }

  init() {
    if (!this.heroGradient) return;
    
    window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 10));
  }

  handleScroll() {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.5;
    
    this.heroGradient.style.transform = `translateY(${rate}px)`;
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
      contactForm: new ContactForm(),
      scrollAnimations: new ScrollAnimations(),
      parallax: new Parallax()
    };
  }

  init() {
    // Remove preload class
    setTimeout(() => {
      document.body.classList.remove('preload');
    }, 100);
    
    // Initialize all modules
    Object.values(this.modules).forEach(module => module.init());
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
