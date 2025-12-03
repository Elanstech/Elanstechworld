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
// FUTURISTIC HEADER
// ==========================================
class FuturisticHeader {
  constructor() {
    this.header = document.querySelector('.header-futuristic');
    this.menuToggle = document.querySelector('.menu-toggle-futuristic');
    this.mobileMenu = document.querySelector('.mobile-menu-futuristic');
    this.backdrop = document.querySelector('.mobile-menu-backdrop-futuristic');
    this.navLinks = document.querySelectorAll('.mobile-nav-link-futuristic');
    this.desktopNavLinks = document.querySelectorAll('.nav-link-futuristic');
  }

  init() {
    if (!this.header) return;
    
    this.handleScroll();
    this.setupEventListeners();
    this.setupScrollSpy();
    
    window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 50));
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  setupEventListeners() {
    // Menu toggle
    this.menuToggle?.addEventListener('click', () => this.toggleMenu());
    this.backdrop?.addEventListener('click', () => this.closeMenu());
    
    // Mobile nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Smooth scroll for all nav links
    [...this.navLinks, ...this.desktopNavLinks].forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  toggleMenu() {
    const isActive = this.mobileMenu.classList.toggle('active');
    this.menuToggle.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  closeMenu() {
    this.mobileMenu.classList.remove('active');
    this.menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    
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
    
    sections.forEach(section => observer.observe(section));
  }

  updateActiveLink(currentSection) {
    [...this.navLinks, ...this.desktopNavLinks].forEach(link => {
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
class WhyUsSlider {
  constructor() {
    // DOM Elements - All with why-us- prefix
    this.sliderTrack = document.querySelector('.why-us-slider-track');
    this.cards = document.querySelectorAll('.why-us-card');
    this.progressBar = document.querySelector('.why-us-progress-bar');
    this.dotsContainer = document.querySelector('.why-us-indicators');
    
    // State
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.autoplayTimer = null;
    this.progressTimer = null;
    
    // Settings
    this.slideInterval = 3000; // 3 seconds per slide
    this.cardsPerView = 3; // Desktop default
    this.totalCards = this.cards.length;
    this.totalSlides = 0;
    this.dots = [];
  }

  init() {
    if (!this.sliderTrack || this.cards.length === 0) return;
    
    this.updateCardsPerView();
    this.createDots();
    this.attachEventListeners();
    this.startAutoplay();
    this.startProgressAnimation();
  }

  /**
   * Update cards per view based on screen size
   */
  updateCardsPerView() {
    const width = window.innerWidth;
    this.cardsPerView = width <= 1024 ? 1 : 3;
    this.totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
    
    // Reset to first slide if current index is out of bounds
    if (this.currentIndex >= this.totalSlides) {
      this.currentIndex = this.totalSlides - 1;
    }
  }

  /**
   * Create navigation dots dynamically
   */
  createDots() {
    if (!this.dotsContainer) return;
    
    // Clear existing dots
    this.dotsContainer.innerHTML = '';
    
    // Create dots based on total slides
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('why-us-dot');
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
    
    this.dots = document.querySelectorAll('.why-us-dot');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const wrapper = document.querySelector('.why-us-slider-wrapper');
    
    // Pause on hover
    wrapper.addEventListener('mouseenter', () => this.pause());
    wrapper.addEventListener('mouseleave', () => this.resume());
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateCardsPerView();
        this.createDots();
        this.goToSlide(0); // Reset to first slide
      }, 250);
    });
  }

  /**
   * Go to specific slide
   */
  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex || index < 0 || index >= this.totalSlides) {
      return;
    }
    
    this.isTransitioning = true;
    this.currentIndex = index;
    
    // Calculate offset
    const cardWidth = this.cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(this.sliderTrack).gap);
    const offset = -(this.currentIndex * this.cardsPerView * (cardWidth + gap));
    
    // Apply transform
    this.sliderTrack.style.transform = `translateX(${offset}px)`;
    
    // Update UI
    this.updateDots();
    this.resetProgress();
    
    // Allow next transition after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }

  /**
   * Slide to next
   */
  slideToNext() {
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  /**
   * Update active dot indicator
   */
  updateDots() {
    if (!this.dots) return;
    
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  /**
   * Start autoplay
   */
  startAutoplay() {
    this.autoplayTimer = setInterval(() => {
      this.slideToNext();
    }, this.slideInterval);
  }

  /**
   * Start progress bar animation
   */
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

  /**
   * Reset progress bar
   */
  resetProgress() {
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  }

  /**
   * Pause autoplay and progress
   */
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

  /**
   * Resume autoplay and progress
   */
  resume() {
    if (!this.autoplayTimer) {
      this.resetProgress();
      this.startAutoplay();
      this.startProgressAnimation();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const whyUsSlider = new WhyUsSlider();
  whyUsSlider.init();
});

// ==========================================
// SERVICES SLIDER
// ==========================================
class ServicesSlider {
  constructor() {
    this.sliderTrack = document.querySelector('.services-slider-track');
    this.cards = document.querySelectorAll('.service-card');
    this.progressBar = document.querySelector('.services-progress-bar');
    this.dotsContainer = document.querySelector('.services-indicators');
    this.prevButton = document.querySelector('.services-arrow-prev');
    this.nextButton = document.querySelector('.services-arrow-next');
    
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.autoplayTimer = null;
    this.progressTimer = null;
    
    this.slideInterval = 5000; // 5 seconds per slide
    this.cardsPerView = 3;
    this.totalCards = this.cards.length;
    this.totalSlides = 0;
    this.dots = [];
  }

  init() {
    if (!this.sliderTrack || this.cards.length === 0) return;
    
    this.updateCardsPerView();
    this.createDots();
    this.attachEventListeners();
    this.updateArrows();
    this.animateVisibleCards();
    this.startAutoplay();
    this.startProgressAnimation();
  }

  updateCardsPerView() {
    const width = window.innerWidth;
    this.cardsPerView = width <= 1024 ? 1 : 3;
    this.totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
    
    if (this.currentIndex >= this.totalSlides) {
      this.currentIndex = this.totalSlides - 1;
    }
  }

  createDots() {
    if (!this.dotsContainer) return;
    
    this.dotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('services-dot');
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
    
    this.dots = document.querySelectorAll('.services-dot');
  }

  attachEventListeners() {
    const wrapper = document.querySelector('.services-slider-wrapper');
    
    // Arrow buttons
    this.prevButton?.addEventListener('click', () => this.slideToPrev());
    this.nextButton?.addEventListener('click', () => this.slideToNext());
    
    // Pause on hover
    wrapper?.addEventListener('mouseenter', () => this.pause());
    wrapper?.addEventListener('mouseleave', () => this.resume());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.slideToPrev();
      if (e.key === 'ArrowRight') this.slideToNext();
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    wrapper?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    wrapper?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
    
    // Window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateCardsPerView();
        this.createDots();
        this.goToSlide(this.currentIndex, false);
        this.updateArrows();
      }, 250);
    });
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.slideToNext();
      } else {
        this.slideToPrev();
      }
    }
  }

  goToSlide(index, animate = true) {
    if (this.isTransitioning || index === this.currentIndex || index < 0 || index >= this.totalSlides) {
      return;
    }
    
    this.isTransitioning = true;
    
    // Animate out current cards
    if (animate) {
      this.animateCardsOut(this.currentIndex);
    }
    
    setTimeout(() => {
      this.currentIndex = index;
      
      // Calculate offset
      const cardWidth = this.cards[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(this.sliderTrack).gap) || 0;
      const offset = -(this.currentIndex * this.cardsPerView * (cardWidth + gap));
      
      // Apply transform
      this.sliderTrack.style.transform = `translateX(${offset}px)`;
      
      // Update UI
      this.updateDots();
      this.updateArrows();
      this.resetProgress();
      
      // Animate in new cards
      if (animate) {
        setTimeout(() => {
          this.animateCardsIn(this.currentIndex);
        }, 100);
      } else {
        this.animateVisibleCards();
      }
      
      setTimeout(() => {
        this.isTransitioning = false;
      }, animate ? 800 : 0);
    }, animate ? 300 : 0);
  }

  animateCardsOut(slideIndex) {
    const startIdx = slideIndex * this.cardsPerView;
    const endIdx = Math.min(startIdx + this.cardsPerView, this.totalCards);
    
    for (let i = startIdx; i < endIdx; i++) {
      this.cards[i]?.classList.remove('animate-in');
      this.cards[i]?.classList.add('animate-out');
    }
  }

  animateCardsIn(slideIndex) {
    const startIdx = slideIndex * this.cardsPerView;
    const endIdx = Math.min(startIdx + this.cardsPerView, this.totalCards);
    
    this.cards.forEach(card => {
      card.classList.remove('animate-in', 'animate-out');
    });
    
    for (let i = startIdx; i < endIdx; i++) {
      setTimeout(() => {
        this.cards[i]?.classList.add('animate-in');
      }, (i - startIdx) * 100);
    }
  }

  animateVisibleCards() {
    const startIdx = this.currentIndex * this.cardsPerView;
    const endIdx = Math.min(startIdx + this.cardsPerView, this.totalCards);
    
    for (let i = startIdx; i < endIdx; i++) {
      this.cards[i]?.classList.add('animate-in');
    }
  }

  slideToNext() {
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  slideToPrev() {
    const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex);
  }

  updateDots() {
    if (!this.dots.length) return;
    
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  updateArrows() {
    if (this.prevButton && this.nextButton) {
      this.prevButton.disabled = false;
      this.nextButton.disabled = false;
    }
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

// Initialize Services Slider
document.addEventListener('DOMContentLoaded', () => {
  const servicesSlider = new ServicesSlider();
  servicesSlider.init();
});

// ==========================================
// TESTIMONIALS CAROUSEL
// ==========================================
class TestimonialsCarousel {
  constructor() {
    this.carouselTrack = document.querySelector('.testimonials-carousel-track');
    this.carouselCards = document.querySelectorAll('.testimonials-carousel-card');
    this.carouselProgressBar = document.querySelector('.testimonials-carousel-progress-bar');
    this.carouselDotsContainer = document.querySelector('.testimonials-carousel-indicators');
    this.carouselPrevButton = document.querySelector('.testimonials-carousel-arrow-prev');
    this.carouselNextButton = document.querySelector('.testimonials-carousel-arrow-next');
    
    this.carouselCurrentIndex = 0;
    this.carouselIsTransitioning = false;
    this.carouselAutoplayTimer = null;
    this.carouselProgressTimer = null;
    
    this.carouselSlideInterval = 5000;
    this.carouselCardsPerView = 3;
    this.carouselTotalCards = this.carouselCards.length;
    this.carouselTotalSlides = 0;
    this.carouselDots = [];
  }

  init() {
    if (!this.carouselTrack || this.carouselCards.length === 0) return;
    
    this.updateCarouselCardsPerView();
    this.createCarouselDots();
    this.attachCarouselEventListeners();
    this.updateCarouselArrows();
    this.animateCarouselVisibleCards();
    this.startCarouselAutoplay();
    this.startCarouselProgressAnimation();
  }

  updateCarouselCardsPerView() {
    const width = window.innerWidth;
    this.carouselCardsPerView = width <= 1024 ? 1 : 3;
    this.carouselTotalSlides = Math.ceil(this.carouselTotalCards / this.carouselCardsPerView);
    
    if (this.carouselCurrentIndex >= this.carouselTotalSlides) {
      this.carouselCurrentIndex = this.carouselTotalSlides - 1;
    }
  }

  createCarouselDots() {
    if (!this.carouselDotsContainer) return;
    
    this.carouselDotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.carouselTotalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('testimonials-carousel-dot');
      if (i === 0) dot.classList.add('testi-active');
      
      dot.addEventListener('click', () => this.goToCarouselSlide(i));
      this.carouselDotsContainer.appendChild(dot);
    }
    
    this.carouselDots = document.querySelectorAll('.testimonials-carousel-dot');
  }

  attachCarouselEventListeners() {
    const wrapper = document.querySelector('.testimonials-carousel-wrapper');
    
    this.carouselPrevButton?.addEventListener('click', () => this.slideCarouselToPrev());
    this.carouselNextButton?.addEventListener('click', () => this.slideCarouselToNext());
    
    wrapper?.addEventListener('mouseenter', () => this.pauseCarousel());
    wrapper?.addEventListener('mouseleave', () => this.resumeCarousel());
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    wrapper?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    wrapper?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleCarouselSwipe(touchStartX, touchEndX);
    });
    
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateCarouselCardsPerView();
        this.createCarouselDots();
        this.goToCarouselSlide(this.carouselCurrentIndex, false);
        this.updateCarouselArrows();
      }, 250);
    });
  }

  handleCarouselSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.slideCarouselToNext();
      } else {
        this.slideCarouselToPrev();
      }
    }
  }

  goToCarouselSlide(index, animate = true) {
    if (this.carouselIsTransitioning || index === this.carouselCurrentIndex || index < 0 || index >= this.carouselTotalSlides) {
      return;
    }
    
    this.carouselIsTransitioning = true;
    
    if (animate) {
      this.animateCarouselCardsOut(this.carouselCurrentIndex);
    }
    
    setTimeout(() => {
      this.carouselCurrentIndex = index;
      
      const cardWidth = this.carouselCards[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(this.carouselTrack).gap) || 0;
      const offset = -(this.carouselCurrentIndex * this.carouselCardsPerView * (cardWidth + gap));
      
      this.carouselTrack.style.transform = `translateX(${offset}px)`;
      
      this.updateCarouselDots();
      this.updateCarouselArrows();
      this.resetCarouselProgress();
      
      if (animate) {
        setTimeout(() => {
          this.animateCarouselCardsIn(this.carouselCurrentIndex);
        }, 100);
      } else {
        this.animateCarouselVisibleCards();
      }
      
      setTimeout(() => {
        this.carouselIsTransitioning = false;
      }, animate ? 800 : 0);
    }, animate ? 300 : 0);
  }

  animateCarouselCardsOut(slideIndex) {
    const startIdx = slideIndex * this.carouselCardsPerView;
    const endIdx = Math.min(startIdx + this.carouselCardsPerView, this.carouselTotalCards);
    
    for (let i = startIdx; i < endIdx; i++) {
      this.carouselCards[i]?.classList.remove('testi-animate-in');
      this.carouselCards[i]?.classList.add('testi-animate-out');
    }
  }

  animateCarouselCardsIn(slideIndex) {
    const startIdx = slideIndex * this.carouselCardsPerView;
    const endIdx = Math.min(startIdx + this.carouselCardsPerView, this.carouselTotalCards);
    
    this.carouselCards.forEach(card => {
      card.classList.remove('testi-animate-in', 'testi-animate-out');
    });
    
    for (let i = startIdx; i < endIdx; i++) {
      setTimeout(() => {
        this.carouselCards[i]?.classList.add('testi-animate-in');
      }, (i - startIdx) * 100);
    }
  }

  animateCarouselVisibleCards() {
    const startIdx = this.carouselCurrentIndex * this.carouselCardsPerView;
    const endIdx = Math.min(startIdx + this.carouselCardsPerView, this.carouselTotalCards);
    
    for (let i = startIdx; i < endIdx; i++) {
      this.carouselCards[i]?.classList.add('testi-animate-in');
    }
  }

  slideCarouselToNext() {
    const nextIndex = (this.carouselCurrentIndex + 1) % this.carouselTotalSlides;
    this.goToCarouselSlide(nextIndex);
  }

  slideCarouselToPrev() {
    const prevIndex = (this.carouselCurrentIndex - 1 + this.carouselTotalSlides) % this.carouselTotalSlides;
    this.goToCarouselSlide(prevIndex);
  }

  updateCarouselDots() {
    if (!this.carouselDots.length) return;
    
    this.carouselDots.forEach((dot, index) => {
      if (index === this.carouselCurrentIndex) {
        dot.classList.add('testi-active');
      } else {
        dot.classList.remove('testi-active');
      }
    });
  }

  updateCarouselArrows() {
    if (this.carouselPrevButton && this.carouselNextButton) {
      this.carouselPrevButton.disabled = false;
      this.carouselNextButton.disabled = false;
    }
  }

  startCarouselAutoplay() {
    this.carouselAutoplayTimer = setInterval(() => {
      this.slideCarouselToNext();
    }, this.carouselSlideInterval);
  }

  startCarouselProgressAnimation() {
    let progress = 0;
    const increment = 100 / (this.carouselSlideInterval / 50);
    
    this.carouselProgressTimer = setInterval(() => {
      progress += increment;
      
      if (progress >= 100) {
        progress = 0;
      }
      
      if (this.carouselProgressBar) {
        this.carouselProgressBar.style.width = `${progress}%`;
      }
    }, 50);
  }

  resetCarouselProgress() {
    if (this.carouselProgressBar) {
      this.carouselProgressBar.style.width = '0%';
    }
  }

  pauseCarousel() {
    if (this.carouselAutoplayTimer) {
      clearInterval(this.carouselAutoplayTimer);
      this.carouselAutoplayTimer = null;
    }
    if (this.carouselProgressTimer) {
      clearInterval(this.carouselProgressTimer);
      this.carouselProgressTimer = null;
    }
  }

  resumeCarousel() {
    if (!this.carouselAutoplayTimer) {
      this.resetCarouselProgress();
      this.startCarouselAutoplay();
      this.startCarouselProgressAnimation();
    }
  }
}

// Initialize Testimonials Carousel
document.addEventListener('DOMContentLoaded', () => {
  const testimonialsCarousel = new TestimonialsCarousel();
  testimonialsCarousel.init();
});

// ==========================================
// RESULTS SLIDER
// ==========================================
class ResultsSlider {
  constructor() {
    this.sliderTrack = document.querySelector('.results-slider-track');
    this.cards = document.querySelectorAll('.result-card');
    this.progressBar = document.querySelector('.results-progress-bar');
    this.dotsContainer = document.querySelector('.results-indicators');
    this.prevButton = document.querySelector('.results-arrow-prev');
    this.nextButton = document.querySelector('.results-arrow-next');
    
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.autoplayTimer = null;
    this.progressTimer = null;
    
    this.slideInterval = 5000; // 5 seconds per slide
    this.cardsPerView = 3;
    this.totalCards = this.cards.length;
    this.totalSlides = 0;
    this.dots = [];
  }

  init() {
    if (!this.sliderTrack || this.cards.length === 0) return;
    
    this.updateCardsPerView();
    this.createDots();
    this.attachEventListeners();
    this.updateArrows();
    this.animateVisibleCards();
    this.startAutoplay();
    this.startProgressAnimation();
  }

  updateCardsPerView() {
    const width = window.innerWidth;
    this.cardsPerView = width <= 1024 ? 1 : 3;
    this.totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
    
    if (this.currentIndex >= this.totalSlides) {
      this.currentIndex = this.totalSlides - 1;
    }
  }

  createDots() {
    if (!this.dotsContainer) return;
    
    this.dotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('results-dot');
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
    
    this.dots = document.querySelectorAll('.results-dot');
  }

  attachEventListeners() {
    const wrapper = document.querySelector('.results-slider-wrapper');
    
    // Arrow buttons
    this.prevButton?.addEventListener('click', () => this.slideToPrev());
    this.nextButton?.addEventListener('click', () => this.slideToNext());
    
    // Pause on hover
    wrapper?.addEventListener('mouseenter', () => this.pause());
    wrapper?.addEventListener('mouseleave', () => this.resume());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.slideToPrev();
      if (e.key === 'ArrowRight') this.slideToNext();
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    wrapper?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    wrapper?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
    
    // Window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateCardsPerView();
        this.createDots();
        this.goToSlide(this.currentIndex, false);
        this.updateArrows();
      }, 250);
    });
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.slideToNext();
      } else {
        this.slideToPrev();
      }
    }
  }

  goToSlide(index, animate = true) {
    if (this.isTransitioning || index === this.currentIndex || index < 0 || index >= this.totalSlides) {
      return;
    }
    
    this.isTransitioning = true;
    
    // Animate out current cards
    if (animate) {
      this.animateCardsOut(this.currentIndex);
    }
    
    setTimeout(() => {
      this.currentIndex = index;
      
      // Calculate offset
      const cardWidth = this.cards[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(this.sliderTrack).gap) || 0;
      const offset = -(this.currentIndex * this.cardsPerView * (cardWidth + gap));
      
      // Apply transform
      this.sliderTrack.style.transform = `translateX(${offset}px)`;
      
      // Update UI
      this.updateDots();
      this.updateArrows();
      this.resetProgress();
      
      // Animate in new cards
      if (animate) {
        setTimeout(() => {
          this.animateCardsIn(this.currentIndex);
        }, 100);
      } else {
        this.animateVisibleCards();
      }
      
      setTimeout(() => {
        this.isTransitioning = false;
      }, animate ? 800 : 0);
    }, animate ? 300 : 0);
  }

  animateCardsOut(slideIndex) {
    const startIdx = slideIndex * this.cardsPerView;
    const endIdx = Math.min(startIdx + this.cardsPerView, this.totalCards);
    
    for (let i = startIdx; i < endIdx; i++) {
      this.cards[i]?.classList.remove('animate-in');
      this.cards[i]?.classList.add('animate-out');
    }
  }

  animateCardsIn(slideIndex) {
    const startIdx = slideIndex * this.cardsPerView;
    const endIdx = Math.min(startIdx + this.cardsPerView, this.totalCards);
    
    this.cards.forEach(card => {
      card.classList.remove('animate-in', 'animate-out');
    });
    
    for (let i = startIdx; i < endIdx; i++) {
      setTimeout(() => {
        this.cards[i]?.classList.add('animate-in');
      }, (i - startIdx) * 100);
    }
  }

  animateVisibleCards() {
    const startIdx = this.currentIndex * this.cardsPerView;
    const endIdx = Math.min(startIdx + this.cardsPerView, this.totalCards);
    
    for (let i = startIdx; i < endIdx; i++) {
      this.cards[i]?.classList.add('animate-in');
    }
  }

  slideToNext() {
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  slideToPrev() {
    const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex);
  }

  updateDots() {
    if (!this.dots.length) return;
    
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  updateArrows() {
    if (this.prevButton && this.nextButton) {
      this.prevButton.disabled = false;
      this.nextButton.disabled = false;
    }
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

// Initialize Results Slider
document.addEventListener('DOMContentLoaded', () => {
  const resultsSlider = new ResultsSlider();
  resultsSlider.init();
});

// ==========================================
// PORTFOLIO - WITH PROJECT ROTATION
// ==========================================
class Portfolio {
  constructor() {
    this.grid = Utils.$('#portfolio-modern-grid');
    this.projects = [];
    this.limit = 6;
  }

  async init() {
    if (!this.grid) return;
    
    await this.loadProjects();
    this.shuffleProjects(); // Rotate projects on each page load
    this.render();
    this.animateItems();
    this.attachEventListeners();
  }

  async loadProjects() {
    try {
      const response = await fetch('../projects.json');
      const data = await response.json();
      this.projects = data.projects;
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = [];
    }
  }

  shuffleProjects() {
    // Fisher-Yates shuffle algorithm
    for (let i = this.projects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.projects[i], this.projects[j]] = [this.projects[j], this.projects[i]];
    }
    
    // Limit to specified number
    this.projects = this.projects.slice(0, this.limit);
  }

  render() {
    if (this.projects.length === 0) {
      this.grid.innerHTML = '<p style="text-align: center; color: var(--gray-lighter); padding: 3rem 0;">Projects loading...</p>';
      return;
    }

    const html = this.projects.map(project => `
      <div class="portfolio-modern-card" data-project-id="${project.id}">
        ${project.featured ? '<div class="portfolio-featured-badge">Featured</div>' : ''}
        
        <div class="portfolio-modern-image">
          <img src="${project.coverImage}" alt="${project.title}" 
               onerror="this.src='https://via.placeholder.com/800x600/0A0A0A/FF8C42?text=${encodeURIComponent(project.title)}'">
          <div class="portfolio-modern-overlay"></div>
          <div class="portfolio-modern-category">${project.category}</div>
        </div>
        
        <div class="portfolio-modern-content">
          <h3 class="portfolio-modern-title">${project.title}</h3>
          <p class="portfolio-modern-description">${project.shortDescription}</p>
          
          <div class="portfolio-modern-tags">
            ${project.tags.slice(0, 3).map(tag => `<span class="portfolio-modern-tag">${tag}</span>`).join('')}
          </div>
          
          <div class="portfolio-modern-footer">
            <span class="portfolio-modern-client">${project.client}</span>
            <a href="portfolio.html#${project.slug}" class="portfolio-modern-link">
              <span>View Details</span>
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `).join('');
    
    this.grid.innerHTML = html;
  }

  attachEventListeners() {
    const cards = Utils.$$('.portfolio-modern-card');
    
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on the link directly
        if (e.target.closest('.portfolio-modern-link')) return;
        
        const projectId = card.dataset.projectId;
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
          window.location.href = `portfolio.html#${project.slug}`;
        }
      });
    });
  }

  animateItems() {
    const items = Utils.$$('.portfolio-modern-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(40px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
// FOOTER NEWSLETTER
// ==========================================
class FooterNewsletter {
  constructor() {
    this.form = document.querySelector('.footer-newsletter-form');
    this.input = this.form?.querySelector('input[type="email"]');
  }

  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  handleSubmit() {
    const email = this.input.value.trim();
    
    if (!email) {
      this.showMessage('Please enter your email address', 'error');
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return;
    }

    // Here you would typically send to your email service
    // For now, just show success message
    this.showMessage('Thank you for subscribing!', 'success');
    this.input.value = '';
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showMessage(message, type) {
    // Create temporary message element
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? 'linear-gradient(135deg, #007aff, #FF8C42)' : '#e74c3c'};
      color: white;
      border-radius: 12px;
      font-weight: 600;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }
}

// ==========================================
// APPLICATION
// ==========================================
class App {
  constructor() {
    this.modules = {
      loader: new Loader(),
      futuristicHeader: new FuturisticHeader(),
      backToTop: new BackToTop(),
      whyusSlider: new WhyUsSlider(),
      servicesSlider: new ServicesSlider(),
      resultsSlider: new ResultsSlider(),
      testimonialsCarousel: new TestimonialsCarousel(),
      portfolio: new Portfolio(),
      faq: new FAQ(),
      videoHandler: new VideoHandler(),
      aosIntegration: new AOSIntegration(),
      scrollAnimations: new ScrollAnimations(),
      statsAnimation: new StatsAnimation(),
      footerNewsletter: new FooterNewsletter() // ADD THIS LINE
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
