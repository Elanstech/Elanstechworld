/**
 * Elan's Tech World - Main JavaScript File
 * Enhanced with better animations and fixed functionality
 */

// Main configuration
const config = {
  animations: {
    enabled: true,     // Master toggle for animations
    duration: 0.6,     // Default animation duration
    staggerDelay: 0.08 // Delay between staggered animations
  },
  
  // Detect touch devices for optimized interactions
  isTouchDevice: 'ontouchstart' in window || 
                navigator.maxTouchPoints > 0 || 
                navigator.msMaxTouchPoints > 0
};

// Store DOM elements for more efficient access
const DOM = {};

// Helper functions
const helpers = {
  // Throttle function for performance optimization
  throttle: function(callback, limit) {
    let waiting = false;
    return function() {
      if (!waiting) {
        callback.apply(this, arguments);
        waiting = true;
        setTimeout(() => {
          waiting = false;
        }, limit);
      }
    };
  },
  
  // Debounce function for performance optimization
  debounce: function(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  },
  
  // Random number between min and max
  random: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  // Add animation class and remove after animation is complete
  animateElement: function(element, animationClass) {
    if (!element) return;
    element.classList.add(animationClass);
    element.addEventListener('animationend', () => {
      element.classList.remove(animationClass);
    }, { once: true });
  }
};

/**
 * Handle Scroll Events
 */
function handleScroll() {
  // Update header state
  if (DOM.header) {
    if (window.scrollY > 50) {
      DOM.header.classList.add('scrolled');
    } else {
      DOM.header.classList.remove('scrolled');
    }
  }
  
  // Update navigation active state
  updateNavigation();
  
  // Update back to top button visibility
  updateBackToTopVisibility();
  
  // Animate elements when they come into view
  animateOnScroll();
}

/**
 * Handle Resize Events
 */
function handleResize() {
  // Update any responsive elements if needed
  if (window.VanillaTilt && !config.isTouchDevice) {
    // Reinitialize tilt for consistent behavior
    reinitializeTilt();
  }
  
  // Update Swiper instances
  updateSwiperInstances();
}

/**
 * Animate Elements on Scroll
 */
function animateOnScroll() {
  const elements = document.querySelectorAll('[data-animation]');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementPosition < windowHeight * 0.8) {
      const animationType = element.dataset.animation;
      element.classList.add(animationType);
      element.style.opacity = '1';
      element.style.visibility = 'visible';
    }
  });
}

/**
 * Load Script Dynamically
 */
function loadScript(url, callback) {
  const script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

/**
 * Load CSS Dynamically
 */
function loadCSS(url, callback) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.onload = callback;
  document.head.appendChild(link);
}

/**
 * Cache DOM elements for more efficient access
 */
function cacheDOM() {
  // Header elements
  DOM.header = document.querySelector('.header');
  DOM.navLinks = document.querySelectorAll('.nav-link');
  DOM.menuToggle = document.querySelector('.menu-toggle');
  DOM.mobileMenu = document.querySelector('.mobile-menu');
  
  // Section elements
  DOM.sections = document.querySelectorAll('section[id]');
  DOM.portfolioGrid = document.getElementById('portfolio-grid');
  DOM.featuredProjects = document.getElementById('featured-projects');
  
  // Interactive elements
  DOM.filterButtons = document.querySelectorAll('.filter-btn');
  DOM.processCards = document.querySelectorAll('.process-card');
  DOM.tiltElements = document.querySelectorAll('.tilt-element');
  DOM.magneticButtons = document.querySelectorAll('.magnetic-button');
  DOM.backToTop = document.querySelector('.back-to-top');
  
  // Forms
  DOM.contactForm = document.getElementById('contact-form');
  DOM.formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
  
  // Carousels and sliders
  DOM.servicesCarousel = document.querySelector('.services-carousel');
  DOM.testimonialsContainer = document.querySelector('.testimonials-slider');
  DOM.caseStudiesContainer = document.querySelector('.case-studies-slider');
  
  // Stats and counters
  DOM.counters = document.querySelectorAll('.counter');
  
  // Interactive elements
  DOM.faqItems = document.querySelectorAll('.faq-item');
  DOM.caseStudyModal = document.getElementById('case-study-modal');
  DOM.projectModal = document.getElementById('project-modal');
}

/**
 * Update Swiper Instances on resize
 */
function updateSwiperInstances() {
  if (window.servicesSwiper) {
    window.servicesSwiper.update();
  }
  
  if (window.testimonialsSwiper) {
    window.testimonialsSwiper.update();
  }
  
  if (window.caseStudiesSwiper) {
    window.caseStudiesSwiper.update();
  }
}

/**
 * Initialize Tilt Elements
 */
function initTiltElements() {
  if (!DOM.tiltElements.length) return;
  
  if (typeof VanillaTilt !== 'undefined') {
    // Initialize if VanillaTilt is already loaded
    initTilt();
  } else {
    // Load VanillaTilt dynamically
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js', initTilt);
  }
  
  function initTilt() {
    VanillaTilt.init(DOM.tiltElements, {
      max: 8,         // Reduced tilt amount for subtlety
      speed: 400,
      glare: true,
      'max-glare': 0.2,
      scale: 1.03,    // Subtle scale effect
      gyroscope: true // Enable gyroscope on mobile
    });
  }
}

/**
 * Reinitialize Tilt Elements (used after DOM changes)
 */
function reinitializeTilt() {
  if (!window.VanillaTilt) return;
  
  // Destroy existing instances
  if (DOM.tiltElements) {
    DOM.tiltElements.forEach(element => {
      if (element.vanillaTilt) {
        element.vanillaTilt.destroy();
      }
    });
  }
  
  // Reinitialize
  VanillaTilt.init(document.querySelectorAll('.tilt-element'), {
    max: 8,
    speed: 400,
    glare: true,
    'max-glare': 0.2,
    scale: 1.03
  });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  if (!DOM.backToTop) return;
  
  // Initial check
  updateBackToTopVisibility();
  
  // Click event
  DOM.backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Update Back to Top visibility
 */
function updateBackToTopVisibility() {
  if (!DOM.backToTop) return;
  
  if (window.scrollY > 500) {
    DOM.backToTop.classList.add('active');
  } else {
    DOM.backToTop.classList.remove('active');
  }
}

/**
 * Initialize Magnetic Buttons
 */
function initMagneticButtons() {
  if (!DOM.magneticButtons.length) return;
  
  DOM.magneticButtons.forEach(button => {
    button.addEventListener('mousemove', helpers.throttle((e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Apply subtle movement
      if (window.gsap) {
        gsap.to(button, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // Apply more subtle movement to span inside button
        if (button.querySelector('span')) {
          gsap.to(button.querySelector('span'), {
            x: x * 0.1,
            y: y * 0.1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      } else {
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        if (button.querySelector('span')) {
          button.querySelector('span').style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        }
      }
      
      // Animate bubbles if present
      if (button.querySelector('.btn-bubbles')) {
        button.querySelector('.btn-bubbles').querySelectorAll('.bubble').forEach(bubble => {
          bubble.style.opacity = '1';
        });
      }
    }, 16));
    
    button.addEventListener('mouseleave', () => {
      if (window.gsap) {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
        
        if (button.querySelector('span')) {
          gsap.to(button.querySelector('span'), {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
          });
        }
      } else {
        button.style.transform = 'translate(0, 0)';
        if (button.querySelector('span')) {
          button.querySelector('span').style.transform = 'translate(0, 0)';
        }
      }
      
      // Fade out bubbles if present
      if (button.querySelector('.btn-bubbles')) {
        setTimeout(() => {
          button.querySelector('.btn-bubbles').querySelectorAll('.bubble').forEach(bubble => {
            bubble.style.opacity = '0';
          });
        }, 500);
      }
    });
  });
}

/**
 * Initialize Bubble Animations for buttons
 */
function initBubbleAnimations() {
  const buttonBubbles = document.querySelectorAll('.btn-bubbles');
  
  buttonBubbles.forEach(bubbleContainer => {
    const bubbles = bubbleContainer.querySelectorAll('.bubble');
    
    bubbles.forEach(bubble => {
      bubble.style.animationDuration = `${helpers.random(3, 5)}s`;
      bubble.style.animationDelay = `${helpers.random(0, 2000) / 1000}s`;
    });
    
    const button = bubbleContainer.closest('a, button');
    if (button) {
      button.addEventListener('mouseenter', () => {
        bubbles.forEach(bubble => {
          bubble.style.opacity = '1';
        });
      });
      
      button.addEventListener('mouseleave', () => {
        setTimeout(() => {
          bubbles.forEach(bubble => {
            bubble.style.opacity = '0';
          });
        }, 500);
      });
    }
  });
}

/**
 * Page Loader with Optimized Animation
 */
function initLoader() {
  const loader = document.querySelector('.loader-container');
  const progressBar = document.querySelector('.loader-progress-bar');
  const percentage = document.querySelector('.loader-percentage');
  const loaderMessages = [
    'Initializing Interface...',
    'Loading Assets...',
    'Almost Ready...'
  ];
  const loaderMessage = document.querySelector('.loader-message');
  
  if (!loader || !progressBar) return;
  
  // Show initial message
  loaderMessage.textContent = loaderMessages[0];
  
  let progress = 0;
  let messageIndex = 0;
  
  // Update loader message less frequently
  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % loaderMessages.length;
    loaderMessage.textContent = loaderMessages[messageIndex];
  }, 400); // Faster message updates
  
  // Progress animation with optimized intervals - MUCH FASTER
  const interval = setInterval(() => {
    // Significantly faster progress simulation
    if (progress < 50) {
      progress += 15 + Math.random() * 10; // Much faster initial loading
    } else if (progress < 85) {
      progress += 10 + Math.random() * 5; // Much faster middle loading
    } else {
      progress += 3; // Faster final loading
    }
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      clearInterval(messageInterval);
      
      // Final message
      loaderMessage.textContent = 'Welcome to Elan\'s Tech World!';
      
      // Hide loader with fade - MUCH FASTER
      setTimeout(() => {
        loader.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
        loader.classList.add('hidden');
        document.body.style.overflow = 'visible';
        
        // Initialize GSAP animations if available
        if (window.gsap) {
          animateHeroElements();
        } else {
          // Fallback for when GSAP is not available
          document.querySelectorAll('[data-animation="fade-up"]').forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          });
        }
      }, 200); // Reduced from 800ms to 200ms
    }
    
    // Update progress bar and percentage
    progressBar.style.width = `${progress}%`;
    percentage.textContent = `${Math.round(progress)}%`;
  }, 30); // Reduced from 80ms to 30ms
  
  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
  
  // Initialize loader bubbles with faster animations
  const bubbles = document.querySelectorAll('.loader-bubbles .bubble');
  bubbles.forEach(bubble => {
    const delay = Math.random() * 1; // Reduced delay
    const duration = 2 + Math.random() * 2; // Faster duration
    
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.animationDuration = `${duration}s`;
  });
}

/**
 * Hero Section Animations with GSAP
 */
function animateHeroElements() {
  if (!window.gsap) return;
  
  const heroElements = document.querySelectorAll('[data-animation="fade-up"]');
  
  gsap.set(heroElements, { y: 30, opacity: 0 });
  
  gsap.to(heroElements, {
    y: 0,
    opacity: 1,
    duration: config.animations.duration,
    stagger: config.animations.staggerDelay,
    ease: 'power2.out',
    clearProps: 'transform'
  });
  
  // Animate hero shapes
  const heroShapes = document.querySelectorAll('.hero-shape');
  
  gsap.from(heroShapes, {
    scale: 0.5,
    opacity: 0,
    duration: 1.5,
    stagger: 0.3,
    ease: 'power3.out'
  });
}

/**
 * Navigation Functionality
 */
function initNavigation() {
  if (!DOM.header) return;
  
  // Update navigation state on page load
  updateNavigation();
  
  // Smooth scrolling for anchor links
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get header height for offset
        const headerHeight = DOM.header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        // Smooth scroll to target with native behavior
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without triggering scroll
        history.pushState(null, null, targetId);
        
        // Close mobile menu if open
        if (DOM.mobileMenu && DOM.mobileMenu.classList.contains('active')) {
          DOM.mobileMenu.classList.remove('active');
          DOM.menuToggle.classList.remove('active');
        }
      }
    });
  });
}

/**
 * Update Navigation Active State based on scroll position
 */
function updateNavigation() {
  if (!DOM.sections.length || !DOM.navLinks.length) return;
  
  // Get current scroll position with some offset
  const scrollPosition = window.scrollY + 100;
  
  // Find the current active section
  let currentSection = null;
  
  // Loop through sections from bottom to top
  for (let i = DOM.sections.length - 1; i >= 0; i--) {
    const section = DOM.sections[i];
    if (!section) continue;
    
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section;
      break;
    }
  }
  
  // Update active class
  if (currentSection) {
    const sectionId = currentSection.getAttribute('id');
    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    
    DOM.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
  if (!DOM.menuToggle || !DOM.mobileMenu) return;
  
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  // Toggle mobile menu
  DOM.menuToggle.addEventListener('click', () => {
    DOM.menuToggle.classList.toggle('active');
    DOM.mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Hide header when mobile menu is open
    if (DOM.mobileMenu.classList.contains('active')) {
      DOM.header.style.opacity = '0';
      DOM.header.style.visibility = 'hidden';
      DOM.header.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    } else {
      DOM.header.style.opacity = '1';
      DOM.header.style.visibility = 'visible';
    }
  });
  
  // Close button functionality
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  
  // Close when clicking on backdrop
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }
  
  // Close menu when clicking on mobile navigation links
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  function closeMobileMenu() {
    DOM.menuToggle.classList.remove('active');
    DOM.mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
    
    // Show header when mobile menu is closed
    DOM.header.style.opacity = '1';
    DOM.header.style.visibility = 'visible';
  }
}

/**
 * Initialize Typed.js for Hero Section
 */
function initHeroTyped() {
  const typedElement = document.getElementById('hero-typed');
  const typedStrings = document.getElementById('hero-typed-strings');
  
  if (!typedElement || !typedStrings) return;
  
  if (typeof Typed !== 'undefined') {
    // Initialize if Typed.js is already loaded
    initTyped();
  } else {
    // Load Typed.js dynamically
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.16/typed.umd.js', initTyped);
  }
  
  function initTyped() {
    // Wait a moment to ensure hero section is visible
    setTimeout(() => {
      new Typed('#hero-typed', {
        stringsElement: '#hero-typed-strings',
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    }, 1500);
  }
}

/**
 * Initialize Marquee Effect for tech stack showcase
 */
function initMarquee() {
  // Set random starting positions for ribbons to avoid them all starting at the same point
  const ribbons = document.querySelectorAll('.tech-ribbon-inner');
  ribbons.forEach(ribbon => {
      const randomDelay = Math.random() * -40; // Random delay between 0 and -40s
      ribbon.style.animationDelay = randomDelay + 's';
  });
  
  // Performance optimization: Add intersection observer to pause animations when not in viewport
  if ('IntersectionObserver' in window) {
      const techStackSection = document.querySelector('.tech-stack-showcase');
      
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  // When the section is in view, start animations
                  ribbons.forEach(ribbon => {
                      ribbon.style.animationPlayState = 'running';
                  });
              } else {
                  // When out of view, pause animations
                  ribbons.forEach(ribbon => {
                      ribbon.style.animationPlayState = 'paused';
                  });
              }
          });
      }, {
          rootMargin: '100px 0px', // Start animations slightly before they come into view
          threshold: 0.1 // Trigger when at least 10% of the element is in view
      });
      
      observer.observe(techStackSection);
  }
  
  // Detect touch devices to apply appropriate interactions
  const isTouchDevice = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
  
  // Add touch-specific enhancements for mobile experience
  if (isTouchDevice) {
      const techIcons = document.querySelectorAll('.tech-icon');
      
      techIcons.forEach(icon => {
          // Add tap effect for touch devices
          icon.addEventListener('touchstart', function() {
              this.style.transform = 'scale(0.95)';
          });
          
          icon.addEventListener('touchend', function() {
              this.style.transform = 'scale(1)';
              
              // Flash effect on tap
              this.classList.add('tech-icon-tapped');
              setTimeout(() => {
                  this.classList.remove('tech-icon-tapped');
              }, 300);
          });
      });
      
      // Add some dynamic styles for touch devices
      const style = document.createElement('style');
      style.textContent = `
          .tech-icon-tapped i {
              color: var(--primary-dark) !important;
              transform: scale(1.2);
              transition: transform 0.3s ease, color 0.3s ease;
          }
          
          .tech-icon-tapped span {
              color: var(--primary);
              transition: color 0.3s ease;
          }
          
          .tech-icon-tapped::before {
              opacity: 1;
              transform: scale(1);
              transition: opacity 0.3s ease, transform 0.3s ease;
          }
      `;
      document.head.appendChild(style);
  }
  
  // Optional: Add pulsating effect to icons if GSAP is available
  if (window.gsap) {
      const techIcons = document.querySelectorAll('.tech-icon i');
      
      // Check if the user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (!prefersReducedMotion) {
          techIcons.forEach((icon, index) => {
              // Add subtle pulsating effect with staggered timing
              gsap.to(icon, {
                  scale: 1.1,
                  duration: 1.5,
                  repeat: -1,
                  yoyo: true,
                  ease: "power1.inOut",
                  delay: index * 0.1 % 1.5 // Stagger effect reset every 15 icons
              });
          });
      }
  }
  
  // Optimize animation performance based on device capabilities
  const isLowPowerDevice = () => {
      // Simple heuristic to detect low-power devices
      return (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || 
             (navigator.deviceMemory && navigator.deviceMemory <= 2);
  };
  
  if (isLowPowerDevice()) {
      // Reduce animation complexity for low-power devices
      ribbons.forEach(ribbon => {
          // Slow down the animations
          const currentDuration = parseFloat(getComputedStyle(ribbon).animationDuration);
          ribbon.style.animationDuration = (currentDuration * 1.5) + 's';
      });
      
      // Remove background bubble animations for better performance
      const showcase = document.querySelector('.tech-stack-showcase');
      if (showcase) {
          showcase.classList.add('low-power-mode');
          
          // Add style to disable background effects
          const style = document.createElement('style');
          style.textContent = `
              .tech-stack-showcase.low-power-mode::before,
              .tech-stack-showcase.low-power-mode::after {
                  display: none;
              }
          `;
          document.head.appendChild(style);
      }
  }
  
  // Add resize handler to ensure animations remain smooth
  let resizeTimeout;
  window.addEventListener('resize', function() {
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
          // Restart animations on resize to prevent stuttering
          ribbons.forEach(ribbon => {
              ribbon.style.animationName = 'none';
              
              // Force reflow
              void ribbon.offsetWidth;
              
              // Restart animation
              ribbon.style.animationName = '';
          });
      }, 250);
  });
}

/**
 * Initialize Services Carousel with Swiper
 */
function initServicesCarousel() {
  if (!DOM.servicesCarousel) return;
  
  if (typeof Swiper !== 'undefined') {
    // Initialize if Swiper is already loaded
    initSwiper();
  } else {
    // Load Swiper dynamically
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.css', () => {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.js', initSwiper);
    });
  }
  
  function initSwiper() {
    // Initialize Swiper with advanced configuration
    window.servicesSwiper = new Swiper('.services-carousel', {
      slidesPerView: 1,
      spaceBetween: 30,
      centeredSlides: false,
      loop: false,
      speed: 800,
      grabCursor: true,
      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
      },
      keyboard: {
        enabled: true,
      },
      pagination: {
        el: '.services-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.services-nav-next',
        prevEl: '.services-nav-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        }
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      },
      effect: 'slide',
      on: {
        init: function() {
          animateActiveSlides(this);
        },
        slideChange: function() {
          animateActiveSlides(this);
          
          // Update typed text when slide changes
          const activeIndex = this.activeIndex;
          const activeSlide = this.slides[activeIndex];
          
          if (activeSlide) {
            const typedElement = activeSlide.querySelector('.service-typed');
            if (typedElement && typedElement._typed) {
              typedElement._typed.reset();
            }
          }
        }
      }
    });
    
    // Handle hover effects for service cards
    initServiceCardEffects();
  }
}

/**
 * Service Card Effects
 */
function initServiceCardEffects() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      // Only apply effect if device supports hover
      if (window.matchMedia('(hover: hover)').matches) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate percentage position
        const xPercent = x / rect.width - 0.5;
        const yPercent = y / rect.height - 0.5;
        
        // Apply subtle rotation based on mouse position (max 3deg)
        if (window.gsap) {
          gsap.to(card, {
            rotationX: yPercent * -3,
            rotationY: xPercent * 3,
            z: 10,
            ease: 'power1.out',
            duration: 0.5
          });
          
          // Move icon slightly
          const icon = card.querySelector('.service-icon');
          if (icon) {
            gsap.to(icon, {
              x: xPercent * 5,
              y: yPercent * 5,
              scale: 1.1,
              ease: 'power1.out',
              duration: 0.5
            });
          }
        } else {
          card.style.transform = `perspective(1000px) rotateX(${yPercent * -3}deg) rotateY(${xPercent * 3}deg) translateZ(10px)`;
          
          const icon = card.querySelector('.service-icon');
          if (icon) {
            icon.style.transform = `translate(${xPercent * 5}px, ${yPercent * 5}px) scale(1.1)`;
          }
        }
      }
    });

    card.addEventListener('mouseleave', function() {
      // Reset transformation on mouse leave
      if (window.gsap) {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          z: 0,
          ease: 'power2.out',
          duration: 0.7
        });
        
        // Reset icon position
        const icon = card.querySelector('.service-icon');
        if (icon) {
          gsap.to(icon, {
            x: 0,
            y: 0,
            scale: 1,
            ease: 'power2.out',
            duration: 0.7
          });
        }
      } else {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        
        const icon = card.querySelector('.service-icon');
        if (icon) {
          icon.style.transform = 'translate(0, 0) scale(1)';
        }
      }
    });
  });
}

/**
 * Animate Active Slides in Services Carousel
 */
function animateActiveSlides(swiper) {
  // Reset all slides
  swiper.slides.forEach(slide => {
    const card = slide.querySelector('.service-card');
    if (card) {
      if (window.gsap) {
        gsap.to(card, {
          y: 0,
          scale: 0.95,
          opacity: 0.7,
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.05)',
          duration: 0.5
        });
      } else {
        card.style.transform = 'translateY(0) scale(0.95)';
        card.style.opacity = '0.7';
        card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.05)';
      }
    }
  });

  // Animate active slide and adjacent slides
  const activeIndex = swiper.activeIndex;
  
  // Get active slide and adjacent slides
  const activeSlide = swiper.slides[activeIndex];
  const prevSlide = swiper.slides[activeIndex - 1];
  const nextSlide = swiper.slides[activeIndex + 1];
  
  // Animate active slide
  if (activeSlide) {
    const activeCard = activeSlide.querySelector('.service-card');
    if (activeCard) {
      if (window.gsap) {
        gsap.to(activeCard, {
          y: -15,
          scale: 1,
          opacity: 1,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
          duration: 0.5
        });
      } else {
        activeCard.style.transform = 'translateY(-15px) scale(1)';
        activeCard.style.opacity = '1';
        activeCard.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.1)';
      }
    }
  }
  
  // Animate adjacent slides
  if (prevSlide) {
    const prevCard = prevSlide.querySelector('.service-card');
    if (prevCard) {
      if (window.gsap) {
        gsap.to(prevCard, {
          y: -5,
          scale: 0.97,
          opacity: 0.85,
          duration: 0.5
        });
      } else {
        prevCard.style.transform = 'translateY(-5px) scale(0.97)';
        prevCard.style.opacity = '0.85';
      }
    }
  }
  
  if (nextSlide) {
    const nextCard = nextSlide.querySelector('.service-card');
    if (nextCard) {
      if (window.gsap) {
        gsap.to(nextCard, {
          y: -5,
          scale: 0.97,
          opacity: 0.85,
          duration: 0.5
        });
      } else {
        nextCard.style.transform = 'translateY(-5px) scale(0.97)';
        nextCard.style.opacity = '0.85';
      }
    }
  }
}

/**
 * Initialize Typed.js for Service Descriptions
 */
function initServiceTypedText() {
  // Check if there are service typed elements
  const typedElements = document.querySelectorAll('.service-typed');
  if (!typedElements.length) return;
  
  if (typeof Typed !== 'undefined') {
    // Initialize if Typed.js is already loaded
    setupServiceTypedText();
  } else {
    // Load Typed.js dynamically
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.16/typed.umd.js', setupServiceTypedText);
  }
  
  function setupServiceTypedText() {
    // Select all elements with service-typed class
    const typedElements = document.querySelectorAll('.service-typed');
    
    // Initialize Typed.js for each element
    typedElements.forEach(element => {
      // Get items to type from data attribute
      const itemsAttr = element.getAttribute('data-typed-items');
      if (!itemsAttr) return;
      
      const items = itemsAttr.split(',');
      
      // Create Typed instance
      const typed = new Typed(element, {
        strings: items,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 300,
        loop: true,
        cursorChar: '|',
        shuffle: false,
        smartBackspace: true
      });
      
      // Store typed instance on element for later control
      element._typed = typed;
    });
  }
}

/**
 * Process Timeline Animation
 */
function initProcessTimeline() {
  const processCards = document.querySelectorAll('.process-card');
  if (!processCards.length) return;
  
  // Create intersection observer for animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // Add staggered animation to process elements
        setTimeout(() => {
          const card = entry.target.querySelector('.process-card-inner');
          const number = entry.target.querySelector('.process-step-number');
          const content = entry.target.querySelector('.process-card-content');
          const icon = entry.target.querySelector('.process-icon');
          
          if (window.gsap) {
            if (number) gsap.to(number, { scale: 1.2, rotate: '-10deg', duration: 0.5, ease: 'back.out(1.7)' });
            if (content) gsap.to(content, { y: -10, opacity: 1, duration: 0.5 });
            if (icon) gsap.to(icon, { rotate: '0deg', scale: 1.2, opacity: 0.2, duration: 0.5 });
            
            setTimeout(() => {
              if (number) gsap.to(number, { scale: 1, rotate: '0deg', duration: 0.3 });
              if (content) gsap.to(content, { y: 0, duration: 0.3 });
              if (icon) gsap.to(icon, { scale: 1, duration: 0.3 });
            }, 500);
          } else {
            // Fallback for non-GSAP browsers
            if (card) {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }
          }
        }, 200);
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  // Observe each process card
  processCards.forEach(card => {
    observer.observe(card);
  });
}

/**
 * Portfolio Filter Functionality
 */
function initPortfolioFilter() {
  if (!DOM.filterButtons.length) return;
  
  DOM.filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      DOM.filterButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Get all portfolio items
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      
      // Apply filtering with animation
      portfolioItems.forEach(item => {
        const categories = item.getAttribute('data-category');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          // Show item with animation
          if (window.gsap) {
            gsap.to(item, { opacity: 0, y: 20, duration: 0.3, onComplete: () => {
              item.classList.remove('hidden');
              gsap.to(item, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 });
            }});
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.classList.remove('hidden');
            
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
              item.style.transition = 'opacity 0.5s, transform 0.5s';
            }, 10);
          }
        } else {
          // Hide item with animation
          if (window.gsap) {
            gsap.to(item, { opacity: 0, y: 20, duration: 0.3, onComplete: () => {
              item.classList.add('hidden');
            }});
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
              item.classList.add('hidden');
            }, 300);
          }
        }
      });
    });
  });
}

/**
 * Project Modals
 */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = modal?.querySelector('.modal-close');
  const backdrop = modal?.querySelector('.modal-backdrop');
  const modalBody = modal?.querySelector('.modal-body');
  
  if (!modal) return;
  
  // Add click events to portfolio links
  document.addEventListener('click', (e) => {
    const portfolioLink = e.target.closest('.portfolio-link');
    const portfolioItem = e.target.closest('.portfolio-item');
    const featuredProject = e.target.closest('.featured-project');
    
    if (portfolioLink || portfolioItem || featuredProject) {
      e.preventDefault();
      
      const projectId = 
        portfolioLink?.dataset.projectId || 
        portfolioItem?.dataset.projectId || 
        featuredProject?.dataset.projectId;
      
      if (projectId) {
        openProjectModal(projectId);
      }
    }
  });
  
  // Close modal when clicking the close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeProjectModal);
  }
  
  // Close modal when clicking the backdrop
  if (backdrop) {
    backdrop.addEventListener('click', closeProjectModal);
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
  
  /**
   * Open Project Modal
   */
  function openProjectModal(projectId) {
    if (!modal || !modalBody) return;
    
    // Find the project data
    const project = window.projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    // Create modal content
    const modalContent = `
      <div class="modal-project">
        <div class="modal-header" style="background-image: url('${project.mainImage}')">
          <div class="modal-header-overlay"></div>
          <div class="modal-header-content">
            <h2>${project.title}</h2>
            <p>${project.modalContent?.subtitle || project.description}</p>
          </div>
        </div>
        <div class="modal-project-content">
          <div class="modal-project-details">
            ${project.modalContent?.detailedDescription ? `
              <div class="modal-section">
                <h3>Project Overview</h3>
                <p>${project.modalContent.detailedDescription}</p>
              </div>
            ` : ''}
            
            ${project.modalContent?.projectDetails ? `
              <div class="modal-section">
                <h3>Project Details</h3>
                <ul class="modal-list">
                  ${project.modalContent.projectDetails.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            ${project.modalContent?.technologies ? `
              <div class="modal-section">
                <h3>Technologies Used</h3>
                <div class="modal-tags">
                  ${project.modalContent.technologies.map(tech => `<span class="modal-tag">${tech}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${project.modalContent?.results ? `
              <div class="modal-section">
                <h3>Results</h3>
                <p>${project.modalContent.results}</p>
              </div>
            ` : ''}
            
            ${project.website ? `
              <div class="modal-section">
                <a href="${project.website}" class="btn-primary" target="_blank" rel="noopener noreferrer">
                  <span>Visit Website</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    
    // Add content to modal
    modalBody.innerHTML = modalContent;
    
    // Add modal styles
    const style = document.createElement('style');
    style.id = 'modal-dynamic-styles';
    style.textContent = `
      .modal-project {
        overflow: hidden;
      }
      
      .modal-header {
        height: 300px;
        background-size: cover;
        background-position: center;
        position: relative;
        display: flex;
        align-items: flex-end;
      }
      
      .modal-header-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
      }
      
      .modal-header-content {
        padding: 2rem;
        position: relative;
        z-index: 1;
        width: 100%;
        color: #fff;
      }
      
      .modal-header-content h2 {
        color: #fff;
        margin-bottom: 0.5rem;
      }
      
      .modal-project-content {
        padding: 2rem;
      }
      
      .modal-section {
        margin-bottom: 2rem;
      }
      
      .modal-section h3 {
        margin-bottom: 1rem;
        color: var(--primary);
      }
      
      .modal-list {
        list-style: disc;
        padding-left: 1.5rem;
        margin-bottom: 1rem;
      }
      
      .modal-list li {
        margin-bottom: 0.5rem;
      }
      
      .modal-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .modal-tag {
        background: var(--light);
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.875rem;
        font-weight: 600;
      }
    `;
    
    document.head.appendChild(style);
    
    // Show modal with animation
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    modal.classList.add('active');
    
    // Animate modal entrance
    if (window.gsap) {
      gsap.fromTo(
        modal.querySelector('.modal-container'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    } else {
      const container = modal.querySelector('.modal-container');
      container.style.transform = 'translateY(50px)';
      container.style.opacity = '0';
      
      setTimeout(() => {
        container.style.transform = 'translateY(0)';
        container.style.opacity = '1';
        container.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      }, 10);
    }
  }
  
  /**
   * Close Project Modal
   */
  function closeProjectModal() {
    if (!modal) return;
    
    // Animate modal exit
    if (window.gsap) {
      gsap.to(modal.querySelector('.modal-container'), {
        y: 50,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          modal.classList.remove('active');
          document.body.style.overflow = ''; // Re-enable scrolling
          
          // Remove dynamic styles
          const dynamicStyles = document.getElementById('modal-dynamic-styles');
          if (dynamicStyles) dynamicStyles.remove();
        }
      });
    } else {
      const container = modal.querySelector('.modal-container');
      container.style.transform = 'translateY(50px)';
      container.style.opacity = '0';
      container.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      
      setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
        
        // Remove dynamic styles
        const dynamicStyles = document.getElementById('modal-dynamic-styles');
        if (dynamicStyles) dynamicStyles.remove();
      }, 400);
    }
  }
}

/**
 * Load Projects Data from json file
 */
function loadProjectsData() {
  // First try to fetch the data from json file
  fetch('projects.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not load projects.json');
      }
      return response.json();
    })
    .then(data => {
      window.projectsData = data.projects;
      updatePortfolioGrid();
      updateFeaturedProjects();
    })
    .catch(error => {
      console.warn('Using fallback project data:', error);
      // Fallback to sample data if file can't be loaded
      window.projectsData = [
        {
          id: "iconic-aesthetics",
          title: "Iconic Aesthetics",
          description: "Complete business technology solution including custom website with integrated booking system",
          categories: ["web", "pos"],
          mainImage: "./assets/images/iconicwebsiteimage.jpeg",
          tags: ["Web Development", "POS System", "Booking Solution"],
          modalContent: {
            subtitle: "Complete business technology solution for a beauty clinic.",
            detailedDescription: "Iconic Aesthetics needed a comprehensive technology solution to streamline their operations and enhance customer experience."
          }
        },
        {
          id: "east-coast-realty",
          title: "East Coast Realty",
          description: "Comprehensive technology solution for a real estate firm",
          categories: ["web", "tech", "marketing"],
          mainImage: "./assets/images/eastcoastweb.jpeg",
          tags: ["Web Development", "Office Setup", "Business Materials"],
          modalContent: {
            subtitle: "Technology solution for a real estate firm.",
            detailedDescription: "East Coast Realty needed a modern digital presence and comprehensive office technology setup."
          }
        },
        {
          id: "cohen-associates",
          title: "Cohen & Associates",
          description: "Technology solution for a tax accounting firm featuring secure document handling",
          categories: ["web", "tech"],
          mainImage: "./assets/images/cohen.jpeg",
          tags: ["Web Development", "Secure Portal", "Office Technology"],
          modalContent: {
            subtitle: "Secure technology solution for tax and accounting services.",
            detailedDescription: "Cohen & Associates required a secure and professional technology infrastructure for their accounting firm."
          }
        },
        {
          id: "doug-uhlig",
          title: "Doug Uhlig",
          description: "Healthcare technology solution with appointment scheduling",
          categories: ["web", "apple"],
          mainImage: "./assets/images/doug.jpeg",
          tags: ["Web Development", "Apple Product Setup", "HIPAA Compliance"],
          modalContent: {
            subtitle: "HIPAA-compliant technology solution for a psychology practice.",
            detailedDescription: "Doug Uhlig Psychological Services needed a HIPAA-compliant technology solution for their practice."
          }
        },
        {
          id: "s-cream",
          title: "S-Cream",
          description: "Complete technology solution for an ice cream shop",
          categories: ["web", "pos", "marketing"],
          mainImage: "./assets/images/scream.jpeg",
          tags: ["Web Development", "POS System", "Business Materials"],
          modalContent: {
            subtitle: "Comprehensive technology solution for an ice cream shop.",
            detailedDescription: "S-Cream required a complete technology ecosystem for their new ice cream shop."
          }
        },
        {
          id: "century-one",
          title: "Century One",
          description: "Integrated property management technology solution",
          categories: ["web", "tech"],
          mainImage: "./assets/images/centuryone.jpeg",
          tags: ["Web Portal", "Property Management System", "Network Setup"],
          modalContent: {
            subtitle: "Property management technology solution.",
            detailedDescription: "Century One Management Services needed a comprehensive property management technology solution."
          }
        }
      ];
      
      updatePortfolioGrid();
      updateFeaturedProjects();
    });
}

/**
 * Update Portfolio Grid with project data
 */
function updatePortfolioGrid() {
  if (!DOM.portfolioGrid || !window.projectsData) return;
  
  // Clear existing content
  DOM.portfolioGrid.innerHTML = '';
  
  // Create HTML for portfolio items
  const portfolioHTML = window.projectsData.map(project => `
    <div class="portfolio-item tilt-element" data-category="${project.categories.join(' ')}" data-project-id="${project.id}">
      <div class="portfolio-image">
        <img loading="lazy" src="${project.mainImage}" alt="${project.title}">
      </div>
      <div class="portfolio-overlay">
        <div class="portfolio-content">
          <div class="portfolio-tags">
            ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
          </div>
          <h3 class="portfolio-title">${project.title}</h3>
          <a href="#" class="portfolio-link" data-project-id="${project.id}">
            <span>View Details</span>
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');
  
  // Add to DOM
  DOM.portfolioGrid.innerHTML = portfolioHTML;
  
  // Re-initialize tilt effect
  if (window.VanillaTilt && !config.isTouchDevice) {
    VanillaTilt.init(document.querySelectorAll('.portfolio-item.tilt-element'), {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.2,
      scale: 1.03
    });
  }
  
  // Add animations to portfolio items
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      item.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 + index * 100);
  });
}

/**
 * Update Featured Projects section on homepage
 */
function updateFeaturedProjects() {
  if (!DOM.featuredProjects || !window.projectsData) return;
  
  // Clear existing content
  DOM.featuredProjects.innerHTML = '';
  
  // Take first 3 projects
  const featuredProjects = window.projectsData.slice(0, 3);
  
  // Create HTML for featured projects
  const featuredHTML = featuredProjects.map(project => `
    <div class="featured-project" data-project-id="${project.id}">
      <img src="${project.mainImage}" alt="${project.title}" class="featured-project-image">
      <div class="featured-project-title">${project.title}</div>
    </div>
  `).join('');
  
  // Add to DOM
  DOM.featuredProjects.innerHTML = featuredHTML;
  
  // Initialize tilt effect if appropriate
  if (window.VanillaTilt && !config.isTouchDevice) {
    VanillaTilt.init(document.querySelectorAll('.featured-project'), {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.3,
      scale: 1.05
    });
  }
}

/**
 * Counter Animation - FIXED
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  // Set up intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        
        const updateCount = () => {
          const increment = target / 40; // Divide by number of frames
          
          if (count < target) {
            count += increment;
            counter.textContent = Math.round(count);
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCount();
        
        // Add pulse animation
        if (window.gsap) {
          gsap.to(counter.closest('.stat-item'), {
            scale: 1.05,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(counter.closest('.stat-item'), {
                scale: 1,
                duration: 0.3,
                ease: 'power2.in'
              });
            }
          });
        } else {
          const statItem = counter.closest('.stat-item');
          statItem.style.transform = 'scale(1.05)';
          statItem.style.transition = 'transform 0.5s ease';
          
          setTimeout(() => {
            statItem.style.transform = 'scale(1)';
            statItem.style.transition = 'transform 0.3s ease';
          }, 500);
        }
        
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.3 });
  
  // Observe each counter
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

/**
 * Initialize Testimonials Carousel
 */
function initTestimonialsCarousel() {
  if (!DOM.testimonialsContainer) return;
  
  if (typeof Swiper !== 'undefined') {
    // Initialize if Swiper is already loaded
    initTestimonialsSwiper();
  } else {
    // Load Swiper dynamically
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.css', () => {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.js', initTestimonialsSwiper);
    });
  }
  
  function initTestimonialsSwiper() {
    window.testimonialsSwiper = new Swiper('.testimonials-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      speed: 800,
      grabCursor: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.testimonials-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.testimonials-nav-next',
        prevEl: '.testimonials-nav-prev'
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40
        }
      },
      effect: 'slide'
    });
  }
}

/**
 * Initialize Case Studies Slider - FIXED
 */
function initCaseStudiesSlider() {
  if (!DOM.caseStudiesContainer) return;
  
  if (typeof Swiper !== 'undefined') {
    // Initialize if Swiper is already loaded
    initCaseStudiesSwiper();
  } else {
    // Load Swiper dynamically
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.css', () => {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.js', initCaseStudiesSwiper);
    });
  }
  
  function initCaseStudiesSwiper() {
    window.caseStudiesSwiper = new Swiper('.case-studies-slider', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: false,
      speed: 800,
      grabCursor: true,
      pagination: {
        el: '.case-studies-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.case-studies-nav-next',
        prevEl: '.case-studies-nav-prev'
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      },
      on: {
        init: function() {
          // Initialize tilt effect for case study cards
          if (window.VanillaTilt && !config.isTouchDevice) {
            VanillaTilt.init(document.querySelectorAll('.case-study-card.tilt-element'), {
              max: 8,
              speed: 400,
              glare: true,
              'max-glare': 0.2,
              scale: 1.02
            });
          }
        }
      }
    });
    
    // Add animation when slider becomes visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const caseStudyCards = document.querySelectorAll('.case-study-card');
          caseStudyCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
              card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100 + index * 150);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(DOM.caseStudiesContainer);
  }
}

/**
 * Initialize FAQ Accordion - FIXED
 */
function initFaqAccordion() {
  if (!DOM.faqItems.length) return;
  
  DOM.faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        // Check if item is already active
        const isActive = item.classList.contains('active');
        
        // Close all items
        DOM.faqItems.forEach(faqItem => {
          if (window.gsap) {
            gsap.to(faqItem.querySelector('.faq-answer'), {
              maxHeight: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
            
            // Reset transform and box shadow
            gsap.to(faqItem, {
              y: 0,
              boxShadow: 'var(--shadow-sm)',
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                faqItem.classList.remove('active');
              }
            });
          } else {
            // Fallback without GSAP
            const answer = faqItem.querySelector('.faq-answer');
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
            answer.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            
            faqItem.style.transform = 'translateY(0)';
            faqItem.style.boxShadow = 'var(--shadow-sm)';
            faqItem.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            
            setTimeout(() => {
              faqItem.classList.remove('active');
            }, 300);
          }
        });
        
        // Open clicked item if it wasn't already active
        if (!isActive) {
          if (window.gsap) {
            // Get the content height
            const answer = item.querySelector('.faq-answer');
            answer.style.opacity = '0';
            answer.style.maxHeight = 'none';
            const height = answer.offsetHeight;
            answer.style.maxHeight = '0';
            
            // Animate opening
            item.classList.add('active');
            gsap.to(answer, {
              maxHeight: height,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out'
            });
            
            // Animate item
            gsap.to(item, {
              y: -3,
              scale: 1.01,
              boxShadow: 'var(--shadow-md)',
              duration: 0.4,
              ease: 'power2.out'
            });
          } else {
            // Fallback without GSAP
            item.classList.add('active');
            const answer = item.querySelector('.faq-answer');
            
            // Temporarily set maxHeight to none to get content height
            answer.style.maxHeight = 'none';
            answer.style.opacity = '0';
            const height = answer.offsetHeight;
            answer.style.maxHeight = '0';
            
            // Trigger reflow
            void answer.offsetHeight;
            
            // Animate opening
            answer.style.maxHeight = height + 'px';
            answer.style.opacity = '1';
            answer.style.transition = 'max-height 0.5s ease, opacity 0.5s ease';
            
            item.style.transform = 'translateY(-3px) scale(1.01)';
            item.style.boxShadow = 'var(--shadow-md)';
            item.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
          }
        }
      });
    }
  });
  
  // Open first FAQ item by default
  if (DOM.faqItems.length > 0) {
    setTimeout(() => {
      DOM.faqItems[0].querySelector('.faq-question').click();
    }, 500);
  }
}

/**
 * Initialize Case Study Modal
 */
function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const closeBtn = modal?.querySelector('.modal-close');
  const backdrop = modal?.querySelector('.modal-backdrop');
  const modalBody = modal?.querySelector('.modal-body');
  
  if (!modal) return;
  
  // Add click events to case study links
  document.addEventListener('click', (e) => {
    const caseStudyLink = e.target.closest('.case-study-link');
    
    if (caseStudyLink) {
      e.preventDefault();
      
      const caseStudyId = caseStudyLink.dataset.caseStudy;
      
      if (caseStudyId) {
        openCaseStudyModal(caseStudyId);
      }
    }
  });
  
  // Close modal when clicking the close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCaseStudyModal);
  }
  
  // Close modal when clicking the backdrop
  if (backdrop) {
    backdrop.addEventListener('click', closeCaseStudyModal);
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeCaseStudyModal();
    }
  });
  
  /**
   * Open Case Study Modal
   */
  function openCaseStudyModal(caseStudyId) {
    if (!modal || !modalBody) return;
    
    // Case study data - This would ideally come from your API or a JSON file
    const caseStudies = {
      'iconic-aesthetics': {
        title: 'Beauty Clinic Digital Transformation',
        client: 'Iconic Aesthetics',
        clientLogo: './assets/images/iconic.jpeg',
        industry: 'Beauty & Wellness',
        heroImage: './assets/images/iconicwebsiteimage.jpeg',
        overview: 'Iconic Aesthetics needed a comprehensive technology solution to streamline their operations and enhance customer experience. We identified several pain points in their workflow and customer journey that could be improved through digital transformation.',
        challenge: 'The clinic was struggling with a manual booking system that led to scheduling errors, double bookings, and significant administrative overhead. Their customer management was fragmented, with client information spread across different systems, making it difficult to provide personalized service and effective follow-ups.',
        solution: [
          'Custom website with integrated appointment scheduling system',
          'Square POS implementation with inventory management',
          'Customer database with CRM functionality',
          'Staff training and workflow optimization',
          'Digital marketing strategy with social media integration'
        ],
        results: [
          '40% increase in online bookings',
          '25% improvement in revenue',
          '60% reduction in scheduling errors',
          '35% increase in repeat customers',
          'Staff time savings of 15 hours per week'
        ],
        testimonial: {
          quote: "Elan's Tech World transformed our business operations completely. The integrated booking system alone has saved us countless hours and significantly improved our customer experience. The entire digital ecosystem they built works seamlessly together.",
          author: "Maria Johnson",
          position: "Owner, Iconic Aesthetics"
        },
        images: [
          './assets/images/iconicwebsiteimage.jpeg'
        ]
      },
      'east-coast-realty': {
        title: 'Property Management System Overhaul',
        client: 'East Coast Realty',
        clientLogo: './assets/images/east.png',
        industry: 'Real Estate',
        heroImage: './assets/images/eastcoastweb.jpeg',
        overview: 'East Coast Realty needed a modern digital presence and comprehensive technology infrastructure to manage their growing portfolio of properties and improve client services.',
        challenge: 'The real estate firm was using outdated systems that couldn\'t scale with their growth. Property listings were managed manually, tenant communications were inefficient, and the maintenance request system was paper-based, causing delays and frustration.',
        solution: [
          'Modern responsive website with MLS integration',
          'Custom property management portal for staff and clients',
          'Automated maintenance request system with tracking',
          'Secure document management system for leases and contracts',
          'Comprehensive office technology setup with network infrastructure'
        ],
        results: [
          '60% reduction in administrative time',
          '3x faster client onboarding process',
          '45% improvement in maintenance response time',
          '28% increase in leads from the new website',
          'Enhanced security for sensitive client documents'
        ],
        testimonial: {
          quote: "The technology solutions implemented by Elan's Tech World have completely transformed how we operate. Our property management is now streamlined, our team is more productive, and our clients are happier with the improved communication and service.",
          author: "Robert Smith",
          position: "Managing Director, East Coast Realty"
        },
        images: [
          './assets/images/eastcoastweb.jpeg'
        ]
      },
      's-cream': {
        title: 'Retail Tech Stack Implementation',
        client: 'S-Cream',
        clientLogo: './assets/images/scream.png',
        industry: 'Food & Beverage',
        heroImage: './assets/images/scream.jpeg',
        overview: 'S-Cream needed a complete technology ecosystem for their new ice cream shop, from online ordering to in-store point of sale system and inventory management.',
        challenge: 'As a new business, S-Cream was starting from scratch and needed a comprehensive technology solution that would provide a seamless customer experience both online and in-store, while also efficiently managing inventory and operations.',
        solution: [
          'E-commerce website with online ordering functionality',
          'POS system integration with inventory management',
          'Customer loyalty program implementation',
          'Mobile app for order ahead and rewards',
          'Staff training and operational workflow design'
        ],
        results: [
          '30% of sales now come from online ordering',
          '15-minute reduction in average wait times',
          '20% increase in repeat customers through loyalty program',
          'Real-time inventory tracking reducing waste by 25%',
          'Seamless integration between online and in-store systems'
        ],
        testimonial: {
          quote: "Working with Elan's Tech World from our pre-launch phase was one of the best decisions we made. They built a technology foundation that has allowed us to operate efficiently from day one and provide an exceptional customer experience across all touchpoints.",
          author: "Jennifer Lee",
          position: "Co-founder, S-Cream"
        },
        images: [
          './assets/images/scream.jpeg'
        ]
      }
    };
    
    // Get case study data
    const caseStudy = caseStudies[caseStudyId];
    if (!caseStudy) return;
    
    // Create modal content
    const modalContent = `
      <div class="case-study-detail">
        <div class="case-study-hero" style="background-image: url('${caseStudy.heroImage}')">
          <div class="case-study-hero-overlay"></div>
          <div class="case-study-hero-content">
            <div class="case-study-client-badge">
              <img src="${caseStudy.clientLogo}" alt="${caseStudy.client}">
              <div>
                <h4>${caseStudy.client}</h4>
                <p>${caseStudy.industry}</p>
              </div>
            </div>
            <h2>${caseStudy.title}</h2>
          </div>
        </div>
        
        <div class="case-study-sections">
          <div class="case-study-section">
            <h3>Overview</h3>
            <p>${caseStudy.overview}</p>
          </div>
          
          <div class="case-study-section">
            <h3>Challenge</h3>
            <p>${caseStudy.challenge}</p>
          </div>
          
          <div class="case-study-section">
            <h3>Solution</h3>
            <ul class="case-study-list">
              ${caseStudy.solution.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          
          <div class="case-study-section">
            <h3>Results</h3>
            <div class="case-study-results-grid">
              ${caseStudy.results.map(result => `
                <div class="case-study-result-box">
                  <div class="result-icon"><i class="fas fa-chart-line"></i></div>
                  <p>${result}</p>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="case-study-section">
            <h3>Client Testimonial</h3>
            <div class="case-study-testimonial">
              <div class="testimonial-quote">
                <i class="fas fa-quote-left"></i>
                <p>${caseStudy.testimonial.quote}</p>
              </div>
              <div class="testimonial-author">
                <p><strong>${caseStudy.testimonial.author}</strong></p>
                <p>${caseStudy.testimonial.position}</p>
              </div>
            </div>
          </div>
          
          <div class="case-study-cta">
            <a href="#contact" class="btn-primary magnetic-button" onclick="closeCaseStudyModal()">
              <span>Start Your Project</span>
              <div class="btn-bubbles">
                <div class="bubble"></div>
                <div class="bubble"></div>
                <div class="bubble"></div>
              </div>
            </a>
          </div>
        </div>
      </div>
    `;
    
    // Add content to modal
    modalBody.innerHTML = modalContent;
    
    // Add modal styles
    const style = document.createElement('style');
    style.id = 'case-study-modal-styles';
    style.textContent = `
      .case-study-detail {
        overflow: hidden;
      }
      
      .case-study-hero {
        height: 350px;
        background-size: cover;
        background-position: center;
        position: relative;
        display: flex;
        align-items: flex-end;
      }
      
      .case-study-hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
      }
      
      .case-study-hero-content {
        padding: 2rem;
        position: relative;
        z-index: 1;
        width: 100%;
        color: #fff;
      }
      
      .case-study-hero-content h2 {
        color: #fff;
        margin-bottom: 0;
        font-size: 2rem;
      }
      
      .case-study-client-badge {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      
      .case-study-client-badge img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid #fff;
        background: #fff;
        object-fit: contain;
      }
      
      .case-study-client-badge h4 {
        color: #fff;
        margin: 0;
        font-size: 1rem;
      }
      
      .case-study-client-badge p {
        color: rgba(255,255,255,0.8);
        margin: 0;
        font-size: 0.875rem;
      }
      
      .case-study-sections {
        padding: 2rem;
      }
      
      .case-study-section {
        margin-bottom: 2rem;
      }
      
      .case-study-section h3 {
        color: var(--primary);
        margin-bottom: 1rem;
        position: relative;
        display: inline-block;
      }
      
      .case-study-section h3::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 40px;
        height: 2px;
        background: var(--primary-gradient);
      }
      
      .case-study-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .case-study-list li {
        position: relative;
        padding-left: 1.5rem;
        margin-bottom: 0.75rem;
      }
      
      .case-study-list li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--primary);
        font-weight: bold;
      }
      
      .case-study-results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
      
      .case-study-result-box {
        background: var(--light);
        padding: 1.25rem;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all var(--transition-normal);
      }
      
      .case-study-result-box:hover {
        background: rgba(0, 122, 255, 0.05);
        transform: translateY(-3px);
      }
      
      .result-icon {
        color: var(--primary);
        font-size: 1.25rem;
      }
      
      .case-study-result-box p {
        margin: 0;
      }
      
      .case-study-testimonial {
        background: var(--light);
        padding: 1.5rem;
        border-radius: var(--radius-md);
        position: relative;
      }
      
      .testimonial-quote {
        position: relative;
        padding-left: 2rem;
      }
      
      .testimonial-quote i {
        position: absolute;
        left: 0;
        top: 0;
        color: var(--primary);
        font-size: 1.5rem;
        opacity: 0.5;
      }
      
      .testimonial-quote p {
        font-style: italic;
        margin-bottom: 1rem;
      }
      
      .testimonial-author {
        text-align: right;
      }
      
      .testimonial-author p {
        margin: 0;
      }
      
      .case-study-cta {
        text-align: center;
        margin-top: 3rem;
      }
      
      @media (max-width: 768px) {
        .case-study-hero {
          height: 250px;
        }
        
        .case-study-hero-content h2 {
          font-size: 1.5rem;
        }
        
        .case-study-sections {
          padding: 1.5rem;
        }
        
        .case-study-results-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    // Show modal with animation
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    modal.classList.add('active');
    
    // Animate modal entrance
    if (window.gsap) {
      gsap.fromTo(
        modal.querySelector('.modal-container'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    } else {
      const container = modal.querySelector('.modal-container');
      container.style.transform = 'translateY(50px)';
      container.style.opacity = '0';
      
      setTimeout(() => {
        container.style.transform = 'translateY(0)';
        container.style.opacity = '1';
        container.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      }, 10);
    }
  }
  
  /**
   * Close Case Study Modal
   */
  function closeCaseStudyModal() {
    if (!modal) return;
    
    // Animate modal exit
    if (window.gsap) {
      gsap.to(modal.querySelector('.modal-container'), {
        y: 50,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          modal.classList.remove('active');
          document.body.style.overflow = ''; // Re-enable scrolling
          
          // Remove dynamic styles
          const dynamicStyles = document.getElementById('case-study-modal-styles');
          if (dynamicStyles) dynamicStyles.remove();
        }
      });
    } else {
      const container = modal.querySelector('.modal-container');
      container.style.transform = 'translateY(50px)';
      container.style.opacity = '0';
      container.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      
      setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
        
        // Remove dynamic styles
        const dynamicStyles = document.getElementById('case-study-modal-styles');
        if (dynamicStyles) dynamicStyles.remove();
      }, 400);
    }
  }
}

/**
 * Form Interactions
 */
function initFormInteractions() {
  if (!DOM.contactForm || !DOM.formInputs.length) return;
  
  // Add focus effects
  DOM.formInputs.forEach(input => {
    // Check if input has value on load
    if (input.value) {
      input.classList.add('has-value');
    }
    
    // Update state when value changes
    input.addEventListener('input', () => {
      input.classList.toggle('has-value', input.value.length > 0);
    });
  });
  
  // Form validation
  DOM.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Basic validation
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    
    // Validate name
    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
      showError(email, 'Please enter your email address');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
      showError(message, 'Please enter your message');
      isValid = false;
    }
    
    if (isValid) {
      // Form is valid, simulate form submission
      const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
      const originalButtonContent = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = '<span>Sending</span> <i class="fas fa-spinner fa-spin"></i>';
      submitButton.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // Create success animation with GSAP
        if (window.gsap) {
          gsap.to(DOM.contactForm, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: () => {
              // Show success message
              DOM.contactForm.innerHTML = `
                <div class="form-success">
                  <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                  </div>
                  <h3>Thank You!</h3>
                  <p>Your message has been sent successfully. We'll get back to you shortly.</p>
                </div>
              `;
              
              // Animate success message
              gsap.fromTo(
                DOM.contactForm.querySelector('.form-success'),
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
              );
            }
          });
        } else {
          // Fallback without GSAP
          DOM.contactForm.style.opacity = '0';
          DOM.contactForm.style.transform = 'translateY(-20px)';
          DOM.contactForm.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          
          setTimeout(() => {
            // Show success message
            DOM.contactForm.innerHTML = `
              <div class="form-success">
                <div class="success-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you shortly.</p>
              </div>
            `;
            
            DOM.contactForm.style.opacity = '1';
            DOM.contactForm.style.transform = 'translateY(0)';
          }, 500);
        }
        
        // Add success styles
        const style = document.createElement('style');
        style.textContent = `
          .form-success {
            text-align: center;
            padding: 2rem;
          }
          
          .success-icon {
            font-size: 3rem;
            color: var(--primary);
            margin-bottom: 1rem;
            animation: successPulse 2s infinite;
          }
          
          @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `;
        document.head.appendChild(style);
      }, 1500);
    }
  });
  
  // Helper functions
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = 'var(--primary)';
    error.style.fontSize = '0.8125rem';
    error.style.marginTop = '0.25rem';
    formGroup.appendChild(error);
    
    // Highlight the input
    input.style.borderColor = 'var(--primary)';
    
    // Shake animation
    if (window.gsap) {
      gsap.fromTo(
        input,
        { x: -5 },
        { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' }
      );
    } else {
      input.style.transform = 'translateX(-5px)';
      setTimeout(() => {
        input.style.transform = 'translateX(0)';
        input.style.transition = 'transform 0.3s ease';
      }, 10);
    }
    
    // Remove highlight on input
    input.addEventListener('input', function() {
      input.style.borderColor = '';
      const errorElement = formGroup.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    }, { once: true });
  }
  
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

// Expose the closeCaseStudyModal function globally for the CTA button
window.closeCaseStudyModal = function() {
  const modal = document.getElementById('case-study-modal');
  if (modal && modal.classList.contains('active')) {
    // Close the modal
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
    
    // Remove dynamic styles
    const dynamicStyles = document.getElementById('case-study-modal-styles');
    if (dynamicStyles) dynamicStyles.remove();
    
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = contactSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
};

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize DOM selector cache
  cacheDOM();
  
  // Enable animations after small delay to prevent flash of animation
  setTimeout(() => {
    document.body.classList.remove('preload');
  }, 100);
  
  // Initialize components in priority order
  initLoader();
  initNavigation();
  initMobileMenu();
  
  // Conditional initialization based on device type
  if (!config.isTouchDevice) {
    initMagneticButtons();
    initTiltElements();
  }
  
  // Initialize bubble animations
  initBubbleAnimations();
  
  // Initialize core sections
  initHeroTyped();
  initMarquee();
  initServicesCarousel();
  initServiceTypedText();
  initProcessTimeline();
  initPortfolioFilter();
  initProjectModals();
  loadProjectsData();
  
  // Initialize testimonials and case studies
  initTestimonialsCarousel();
  initCaseStudiesSlider(); // FIXED
  initCaseStudyModal();
  
  // Initialize FAQ accordion
  initFaqAccordion(); // FIXED
  
  // Initialize form and counters
  initFormInteractions();
  initCounters(); // FIXED
  
  // Initialize back to top button
  initBackToTop();
  
  // Add scroll and resize event listeners with performance optimization
  window.addEventListener('scroll', helpers.throttle(handleScroll, 100));
  window.addEventListener('resize', helpers.debounce(handleResize, 250));
});
