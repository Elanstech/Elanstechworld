/**
 * Elan's Tech World - Optimized JavaScript
 * Performance improvements for better mobile and desktop experience
 */

// Global project data storage with throttled and debounced function support
let projectsData = [];
let isScrolling = false;
let isScrollingNav = false;

// Detect touch devices for better interactions
function detectTouchDevice() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
  }
  return isTouchDevice;
}

// Throttle function to limit execution frequency
function throttle(callback, limit) {
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
}

// Debounce function to delay execution until after events stop
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Detect touch devices first for appropriate interactions
  const isTouchDevice = detectTouchDevice();
  
  // Remove preload class after a brief delay to enable animations
  setTimeout(() => {
    document.body.classList.remove('preload');
  }, 300);
  
  // Initialize components with performance considerations
  initPageLoader();
  
  // Only initialize heavy particle effects on desktop
  if (!isTouchDevice) {
    initParticlesJS();
  } else {
    // Hide particles container on mobile for better performance
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
      particlesContainer.style.display = 'none';
    }
  }
  
  // Core functionality with performance optimizations
  initGSAPAnimations();
  initNavigation();
  initMobileMenu();
  
  // Hero section - critical for first impression
  initHeroTyped();
  
  // Only use parallax on non-touch devices
  if (!isTouchDevice) {
    initHeroParallax();
  }
  
  // Initialize interactive elements with device-appropriate behavior
  if (!isTouchDevice) {
    initMagneticElements();
    initVanillaTilt();
  }
  
  initServiceCards(isTouchDevice);
  initProcessTimeline();
  initInteractiveTimeline();
  
  // Optimize 3D scene for desktop only
  if (!isTouchDevice && window.innerWidth > 768) {
    initPortfolio3DScene();
  } else {
    // Add simple background for mobile devices instead of 3D scene
    const scene = document.getElementById('portfolio-3d-scene');
    if (scene) {
      scene.style.background = 'radial-gradient(circle, rgba(0, 122, 255, 0.05), transparent 70%)';
    }
  }
  
  // Load project data - critical for site functionality
  loadProjectsFromJSON();
  
  // Initialize testimonials and stats with optimizations
  initTestimonialsScroll();
  initVideoModal();
  initProgressRings();
  initCounters();
  
  // CTA, Contact and Footer with lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.id === 'cta-canvas') {
          initCTACanvas();
        } else if (entry.target.id === 'contact-map') {
          initContactMap();
        } else if (entry.target.id === 'footer-particles') {
          initFooterParticles();
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe elements for lazy initialization
  ['cta-canvas', 'contact-map', 'footer-particles'].forEach(id => {
    const element = document.getElementById(id);
    if (element) observer.observe(element);
  });
  
  // Global elements - loaded with performance priority
  initRevealTextElements();
  initSplitTextElements();
  initScrollTriggerAnimations();
  initFormInteractions();
  initBackToTop();
  
  // Optimize continuous animations for better performance
  initInfiniteScrolling();
  
  // Add resize handler with debounce for performance
  window.addEventListener('resize', debounce(() => {
    // Update responsive elements that need resizing
    if (window.portfolioScene && !isTouchDevice) {
      updatePortfolio3DScene();
    }
    
    // Update any gallery elements that may be open
    updateGalleryDimensions();
  }, 250));
  
  // Optimize window scroll performance with throttling
  window.addEventListener('scroll', throttle(() => {
    updateOnScroll();
  }, 100));
});

/**
 * Update elements on scroll with performance optimizations
 */
function updateOnScroll() {
  // Update header state
  const header = document.querySelector('.header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Update navigation active state
  updateActiveNavLink();
  
  // Update back to top button visibility
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  }
}

/**
 * Page Loader with Optimized Animation
 */
function initPageLoader() {
  const loader = document.querySelector('.loader-container');
  const progressBar = document.querySelector('.loader-progress-bar');
  const percentage = document.querySelector('.loader-percentage');
  const loaderMessages = [
    'Initializing Interface...',
    'Loading Assets...',
    'Preparing Animations...',
    'Crafting Digital Experience...',
    'Almost Ready...'
  ];
  const loaderMessage = document.querySelector('.loader-message');
  
  if (!loader || !progressBar) return;
  
  // Show message immediately
  loaderMessage.textContent = loaderMessages[0];
  
  let progress = 0;
  let messageIndex = 0;
  
  // Update loader message periodically with reduced frequency
  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % loaderMessages.length;
    
    loaderMessage.style.opacity = 0;
    setTimeout(() => {
      loaderMessage.textContent = loaderMessages[messageIndex];
      loaderMessage.style.opacity = 1;
    }, 200);
  }, 1000); // Increased to 1000ms for better performance
  
  // Progress animation with optimized intervals
  const interval = setInterval(() => {
    // Optimized progress simulation with fewer calculations
    if (progress < 50) {
      progress += 10 + Math.random() * 5;
    } else if (progress < 85) {
      progress += 3 + Math.random() * 2;
    } else {
      progress += 1;
    }
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      clearInterval(messageInterval);
      
      // Final message
      loaderMessage.textContent = 'Welcome to Elan\'s Tech World!';
      
      // Delay to ensure animation completes
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            
            // Trigger entrance animations
            animateHeroElements();
            
            // Enable scroll after loader is hidden
            document.body.style.overflow = 'visible';
          }
        });
      }, 500);
    }
    
    // Update progress bar and percentage
    progressBar.style.width = `${progress}%`;
    percentage.textContent = `${Math.round(progress)}%`;
  }, 80); // Slightly slower for better performance
  
  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
}

/**
 * Initialize Infinite Scrolling with Performance Optimizations
 */
function initInfiniteScrolling() {
  const carouselElements = document.querySelectorAll('.clients-track, .tech-stack-track, .testimonials-track');
  
  carouselElements.forEach(track => {
    // Check if we need to clone items for continuous scrolling
    ensureEnoughItems(track);
    
    // Pause animation on hover for better performance
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    
    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });
  
  // Make sure we have enough items for infinite scrolling
  function ensureEnoughItems(track) {
    const items = track.children;
    if (items.length < 10) { // If we have fewer than 10 items
      // Clone existing items to ensure smooth scrolling
      Array.from(items).forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
    }
  }
}

/**
 * Initialize Particles.js with Reduced Particle Count for Better Performance
 */
function initParticlesJS() {
  // Hero particles - with reduced count for performance
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 15, density: { enable: true, value_area: 800 } }, // Reduced from 20
        color: { value: "#007aff" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 5 }
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: { enable: true, speed: 0.2, opacity_min: 0.1, sync: false }
        },
        size: {
          value: 5,
          random: true,
          anim: { enable: true, speed: 2, size_min: 1, sync: false }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#007aff",
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: false }, // Disabled for performance
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.5 } }
        }
      },
      retina_detect: false // Disable for better performance
    });
  }
  
  // Footer particles with minimal settings for performance
  if (document.getElementById('footer-particles')) {
    particlesJS('footer-particles', {
      particles: {
        number: { value: 8, density: { enable: true, value_area: 800 } }, // Reduced from 15
        color: { value: "#007aff" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 5 }
        },
        opacity: {
          value: 0.1,
          random: true,
          anim: { enable: true, speed: 0.2, opacity_min: 0.05, sync: false }
        },
        size: {
          value: 4,
          random: true,
          anim: { enable: true, speed: 2, size_min: 1, sync: false }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#4da3ff",
          opacity: 0.1,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.5,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "bubble" },
          onclick: { enable: false }, // Disabled for performance
          resize: true
        },
        modes: {
          bubble: { distance: 140, size: 6, duration: 2, opacity: 0.3, speed: 3 }
        }
      },
      retina_detect: false // Disable for better performance
    });
  }
}

/**
 * Initialize GSAP Animations with Performance Optimizations
 */
function initGSAPAnimations() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
  // Initialize GSAP defaults with optimized settings
  gsap.defaults({
    ease: 'power2.out', // Slightly less intensive than power3
    duration: 0.6, // Reduced from 0.8
    overwrite: 'auto' // Helps prevent animation conflicts
  });
  
  // Optimize GSAP for mobile
  if (window.innerWidth < 768) {
    // Reduce animation duration on mobile
    gsap.defaults({
      duration: 0.4
    });
  }
}

/**
 * Animate Hero Elements with Progressive Loading
 */
function animateHeroElements() {
  const heroElements = document.querySelectorAll('[data-animation="fade-up"]');
  
  // Use staggered animations for smoother performance
  gsap.set(heroElements, { y: 30, opacity: 0 });
  
  gsap.to(heroElements, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.08, // Stagger instead of individual delays
    ease: 'power2.out',
    clearProps: 'transform' // Free up resources after animation
  });
}

/**
 * Initialize Split Text Elements with Performance Optimizations
 */
function initSplitTextElements() {
  const splitElements = document.querySelectorAll('.split-text');
  
  // Create a batch process to optimize DOM operations
  if (splitElements.length === 0) return;
  
  // Use a document fragment for better performance
  splitElements.forEach(element => {
    const text = element.textContent;
    const fragment = document.createDocumentFragment();
    
    // Process text in batches for better performance
    const characters = text.split('');
    
    characters.forEach(char => {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.style.display = 'inline-block';
      charSpan.style.transform = 'translateY(20px)';
      charSpan.style.opacity = '0';
      charSpan.textContent = char === ' ' ? '\u00A0' : char;
      fragment.appendChild(charSpan);
    });
    
    // Clear and append once to minimize reflows
    element.innerHTML = '';
    element.appendChild(fragment);
  });
}

/**
 * Initialize Reveal Text Elements with Intersection Observer
 */
function initRevealTextElements() {
  const revealElements = document.querySelectorAll('.reveal-text');
  
  if (revealElements.length === 0) return;
  
  // Use Intersection Observer for performance
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.15, // Trigger slightly earlier
    rootMargin: '0px 0px -10% 0px' // Trigger before fully in view
  });
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/**
 * Initialize ScrollTrigger Animations with Optimized Performance
 */
function initScrollTriggerAnimations() {
  // Batch similar animations together for better performance
  
  // Section headers fade in
  const sectionHeaders = document.querySelectorAll('.section-header');
  if (sectionHeaders.length > 0) {
    gsap.from(sectionHeaders, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: sectionHeaders[0].parentElement,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true // Run only once for performance
      }
    });
  }
  
  // Staggered animations with optimized batches
  const staggerContainers = document.querySelectorAll('[data-animation="stagger-fade-up"]');
  staggerContainers.forEach(container => {
    const items = container.children;
    if (items.length === 0) return;
    
    gsap.set(items, { y: 30, opacity: 0 });
    
    ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'transform' // Clean up after animation
        });
      },
      once: true
    });
  });
  
  // Process steps animation with optimized settings
  const processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length > 0) {
    gsap.set(processSteps, { x: -20, opacity: 0 });
    
    ScrollTrigger.create({
      trigger: processSteps[0].parentElement,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(processSteps, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'transform'
        });
      },
      once: true
    });
  }
  
  // Individual elements with their own animations
  document.querySelectorAll('[data-animation="fade-up"]').forEach(element => {
    const delay = element.dataset.delay || 0;
    
    gsap.from(element, {
      y: 30,
      opacity: 0,
      delay: parseFloat(delay),
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      }
    });
  });
  
  // Apply animations to split text characters in batches
  const splitTextElements = document.querySelectorAll('.split-text');
  splitTextElements.forEach(element => {
    const chars = element.querySelectorAll('.char');
    if (chars.length === 0) return;
    
    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration: 0.02,
          stagger: 0.02,
          ease: 'power2.out'
        });
      },
      once: true
    });
  });
}

/**
 * Initialize Typed.js for Hero Section
 */
function initHeroTyped() {
  const typedElement = document.getElementById('hero-typed');
  if (!typedElement) return;
  
  // Wait until hero section is visible to initialize
  setTimeout(() => {
    new Typed('#hero-typed', {
      stringsElement: '#hero-typed-strings',
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 1000,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }, 1500); // Delay start to improve initial page load performance
}

/**
 * Hero Parallax Effect with Optimized Performance
 */
function initHeroParallax() {
  const heroSection = document.querySelector('.hero-section');
  const heroContent = document.querySelector('.hero-content');
  const heroShapes = document.querySelectorAll('.hero-shape');
  
  if (!heroSection || !heroContent) return;
  
  // Use throttled mousemove for better performance
  heroSection.addEventListener('mousemove', throttle((e) => {
    // Calculate movement once for efficiency
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    // Apply to content
    heroContent.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    
    // Apply to shapes with varying intensity
    heroShapes.forEach((shape, index) => {
      const depth = index * 0.2 + 0.4;
      shape.style.transform = `translate3d(${-moveX * depth * 5}px, ${-moveY * depth * 5}px, 0)`;
    });
  }, 16)); // Throttle to roughly 60fps
  
  // Reset transform when mouse leaves hero section
  heroSection.addEventListener('mouseleave', () => {
    heroContent.style.transform = 'translate3d(0, 0, 0)';
    heroShapes.forEach(shape => {
      shape.style.transform = 'translate3d(0, 0, 0)';
    });
  });
  
  // Lightweight scroll parallax
  window.addEventListener('scroll', throttle(() => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const yPercent = scrollY * 0.2;
      const heroBackground = document.querySelector('.hero-background');
      if (heroBackground) {
        heroBackground.style.transform = `translate3d(0, ${yPercent}px, 0)`;
      }
    }
  }, 16));
}

/**
 * Initialize Magnetic Elements with Performance Optimizations
 */
function initMagneticElements() {
  // Skip on touch devices for better performance
  if (document.body.classList.contains('touch-device')) return;
  
  const magneticElements = document.querySelectorAll('.magnetic-button, .magnetic-button-sm');
  
  magneticElements.forEach(element => {
    element.addEventListener('mousemove', throttle((e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      element.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0) rotate(${x * 0.05}deg)`;
      
      if (element.querySelector('span')) {
        element.querySelector('span').style.transform = `translate3d(${x * 0.1}px, ${y * 0.1}px, 0)`;
      }
    }, 16));
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate3d(0, 0, 0) rotate(0)';
      
      if (element.querySelector('span')) {
        element.querySelector('span').style.transform = 'translate3d(0, 0, 0)';
      }
    });
  });
}

/**
 * Initialize VanillaTilt with Performance Optimizations
 */
function initVanillaTilt() {
  // Skip on touch devices for better performance
  if (document.body.classList.contains('touch-device')) return;
  
  const tiltElements = document.querySelectorAll('.tilt-element');
  
  if (!tiltElements.length || !window.VanillaTilt) return;
  
  // Optimized tilt settings
  VanillaTilt.init(tiltElements, {
    max: 8, // Reduced from 10
    speed: 400,
    glare: true,
    'max-glare': 0.15,
    gyroscope: false, // Disabled for better performance
    scale: 1.02 // Subtle scale effect
  });
}

/**
 * Navigation Functionality with Performance Optimizations
 */
function initNavigation() {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  if (!header) return;
  
  // Initial check for header state - avoid unnecessary reflow
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  }
  
  // Animate navigation items once on page load
  gsap.from('.nav-item', {
    y: -20,
    opacity: 0,
    stagger: 0.06, // Reduced stagger time
    delay: 1,
    duration: 0.4,
    ease: 'power2.out',
    clearProps: 'transform'
  });
  
  // Update active nav link with optimized performance
  function updateActiveNavLink() {
    if (isScrollingNav) return;
    isScrollingNav = true;
    
    requestAnimationFrame(() => {
      let scrollPosition = window.scrollY + 100;
      let activeSection = null;
      
      // Find current section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          activeSection = section;
          break;
        }
      }
      
      // Update active class if needed
      if (activeSection) {
        const sectionId = activeSection.getAttribute('id');
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        navLinks.forEach(link => {
          if (link === activeLink) {
            if (!link.classList.contains('active')) {
              link.classList.add('active');
            }
          } else {
            link.classList.remove('active');
          }
        });
      }
      
      isScrollingNav = false;
    });
  }
  
  // Make function available globally for scroll events
  window.updateActiveNavLink = updateActiveNavLink;
  
  // Update active link on page load
  updateActiveNavLink();
  
  // Smooth scrolling for anchor links with optimized GSAP
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get header height for offset
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        // Smooth scroll to target with GSAP
        gsap.to(window, {
          duration: 0.8,
          scrollTo: {
            y: targetPosition,
            autoKill: false
          },
          ease: 'power2.inOut'
        });
        
        // Update URL hash without triggering scroll
        history.pushState(null, null, targetId);
        
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          menuToggle.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      }
    });
  });
}

/**
 * Mobile Menu Functionality with Optimized Animations
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
  
  if (!menuToggle || !mobileMenu) return;
  
  // Toggle mobile menu with optimized animation
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Animate mobile menu items when menu opens
    if (mobileMenu.classList.contains('active')) {
      // Animate container first
      gsap.set('.mobile-menu-container', { x: '100%' });
      gsap.to('.mobile-menu-container', {
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Then animate menu items
      gsap.set('.mobile-nav-item', { y: 20, opacity: 0 });
      gsap.to('.mobile-nav-item', {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.4,
        delay: 0.2,
        ease: 'power2.out'
      });
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
    // Animate mobile menu container out
    gsap.to('.mobile-menu-container', {
      x: '100%',
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        // Reset mobile menu item animations
        gsap.set('.mobile-nav-item', {
          y: 20,
          opacity: 0
        });
      }
    });
  }
}

/**
 * Initialize Service Cards with Optimized Interactions
 */
function initServiceCards(isTouchDevice) {
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (!serviceCards.length) return;
  
  // Skip 3D effects on touch devices
  if (isTouchDevice) return;
  
  serviceCards.forEach(card => {
    // Use throttled mousemove for better performance
    card.addEventListener('mousemove', throttle((e) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      // Calculate angle based on mouse position
      const angleX = (e.clientY - cardCenterY) / 15;
      const angleY = -(e.clientX - cardCenterX) / 15;
      
      // Apply transform with 3D hardware acceleration
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      
      // Move card background for parallax effect
      const cardBg = card.querySelector('.service-card-bg');
      if (cardBg) {
        cardBg.style.transform = `translate3d(${angleY * 2}px, ${angleX * 2}px, 0)`;
      }
    }, 16));
    
    // Reset transform on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      
      const cardBg = card.querySelector('.service-card-bg');
      if (cardBg) {
        cardBg.style.transform = 'translate3d(0, 0, 0)';
      }
    });
  });
}

/**
 * Initialize Process Timeline with Intersection Observer
 */
function initProcessTimeline() {
  const processSteps = document.querySelectorAll('.process-step');
  if (!processSteps.length) return;
  
  // Create intersection observer for efficient animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
  
  // Observe each process step
  processSteps.forEach(step => {
    observer.observe(step);
  });
}

/**
 * Initialize Interactive Timeline with Performance Optimizations
 */
function initInteractiveTimeline() {
  const timelinePoints = document.querySelectorAll('.timeline-point');
  const timelineContents = document.querySelectorAll('.timeline-content');
  const timelineProgressBar = document.querySelector('.timeline-progress-bar');
  
  if (!timelinePoints.length || !timelineContents.length || !timelineProgressBar) return;
  
  // Set initial progress width based on active point
  updateTimelineProgress();
  
  // Initialize Lottie animations with optimized settings
  const animationContainers = document.querySelectorAll('.lottie-animation');
  const animationPaths = {
    discovery: 'https://assets4.lottiefiles.com/packages/lf20_4xgdlh.json',
    planning: 'https://assets3.lottiefiles.com/packages/lf20_m6ozkhi4.json',
    design: 'https://assets7.lottiefiles.com/packages/lf20_Ceu8QK.json',
    development: 'https://assets2.lottiefiles.com/packages/lf20_w4e7b1hi.json',
    testing: 'https://assets10.lottiefiles.com/packages/lf20_syqnfe7c.json',
    launch: 'https://assets5.lottiefiles.com/packages/lf20_xyadoh9h.json'
  };
  
  if (window.lottie) {
    // Only load visible animations initially
    const activeContent = document.querySelector('.timeline-content.active');
    if (activeContent) {
      const activeAnimation = activeContent.querySelector('.lottie-animation');
      if (activeAnimation) {
        const animationType = activeAnimation.dataset.animation;
        if (animationType && animationPaths[animationType]) {
          lottie.loadAnimation({
            container: activeAnimation,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: animationPaths[animationType],
            rendererSettings: {
              progressiveLoad: true, // Load parts of animation as needed
              preserveAspectRatio: 'xMidYMid slice'
            }
          });
        }
      }
    }
  }
  
  // Add click event to timeline points
  timelinePoints.forEach(point => {
    point.addEventListener('click', () => {
      const step = point.dataset.step;
      
      // Remove active class from all points and contents
      timelinePoints.forEach(p => p.classList.remove('active'));
      timelineContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked point and corresponding content
      point.classList.add('active');
      const activeContent = document.querySelector(`.timeline-content[data-step="${step}"]`);
      activeContent.classList.add('active');
      
      // Update progress bar
      updateTimelineProgress();
      
      // Load Lottie animation for newly active content if not already loaded
      if (window.lottie) {
        const animContainer = activeContent.querySelector('.lottie-animation');
        if (animContainer) {
          const animationType = animContainer.dataset.animation;
          if (animationType && animationPaths[animationType] && !animContainer.querySelector('svg')) {
            lottie.loadAnimation({
              container: animContainer,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: animationPaths[animationType],
              rendererSettings: {
                progressiveLoad: true,
                preserveAspectRatio: 'xMidYMid slice'
              }
            });
          }
        }
      }
    });
  });
  
  // Update timeline progress bar based on active point
  function updateTimelineProgress() {
    const activePoint = document.querySelector('.timeline-point.active');
    if (!activePoint) return;
    
    const step = parseInt(activePoint.dataset.step);
    const totalSteps = timelinePoints.length;
    const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;
    
    // Use transform instead of width for better performance
    timelineProgressBar.style.transform = `scaleX(${progressPercentage / 100})`;
    timelineProgressBar.style.transformOrigin = 'left center';
  }
  
  // Auto-progress timeline with reduced frequency
  let currentStep = 1;
  let autoProgressInterval;
  
  function startAutoProgress() {
    autoProgressInterval = setInterval(() => {
      currentStep = currentStep % timelinePoints.length + 1;
      
      // Find and trigger click on next point
      const nextPoint = document.querySelector(`.timeline-point[data-step="${currentStep}"]`);
      if (nextPoint) {
        nextPoint.click();
      }
    }, 6000); // Increased to 6 seconds for better performance
  }
  
  // Start auto-progress after initial delay
  setTimeout(startAutoProgress, 6000);
  
  // Pause auto-progress when user interacts with timeline
  timelinePoints.forEach(point => {
    point.addEventListener('click', () => {
      clearInterval(autoProgressInterval);
      currentStep = parseInt(point.dataset.step);
      
      // Restart auto-progress after user interaction
      setTimeout(startAutoProgress, 10000);
    });
  });
}

/**
 * Initialize 3D Scene for Portfolio with Optimized Performance
 */
function initPortfolio3DScene() {
  // Skip on touch devices and smaller screens for better performance
  if (document.body.classList.contains('touch-device') || window.innerWidth < 768) return;
  
  const scene = document.getElementById('portfolio-3d-scene');
  if (!scene || !window.THREE) return;
  
  // Create Three.js scene with performance optimizations
  const threeScene = new THREE.Scene();
  
  // Create camera with optimized settings
  const camera = new THREE.PerspectiveCamera(75, scene.clientWidth / scene.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Create renderer with performance optimizations
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: false, // Disable for better performance
    powerPreference: 'high-performance',
    precision: 'mediump' // Use medium precision for better performance
  });
  
  renderer.setSize(scene.clientWidth, scene.clientHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1); // Limit pixel ratio
  scene.appendChild(renderer.domElement);
  
  // Create particles with reduced count
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 500; // Reduced from 1000
  
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  // Create material with optimized settings
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x007aff,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true
  });
  
  // Create mesh
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  threeScene.add(particlesMesh);
  
  // Store the scene in the window for resize handling
  window.portfolioScene = {
    scene: threeScene,
    camera: camera,
    renderer: renderer,
    particlesMesh: particlesMesh
  };
  
  // Animation function with throttled rendering
  let lastFrame = 0;
  function animate(timestamp) {
    // Limit to ~30fps for better performance
    if (timestamp - lastFrame < 33) {
      requestAnimationFrame(animate);
      return;
    }
    
    lastFrame = timestamp;
    
    particlesMesh.rotation.x += 0.0003;
    particlesMesh.rotation.y += 0.0003;
    
    renderer.render(threeScene, camera);
    requestAnimationFrame(animate);
  }
  
  // Start animation
  animate(0);
  
  // Update function for resize events
  window.updatePortfolio3DScene = function() {
    if (!window.portfolioScene) return;
    
    const { camera, renderer } = window.portfolioScene;
    
    camera.aspect = scene.clientWidth / scene.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(scene.clientWidth, scene.clientHeight);
  };
  
  // Optimize particles on scroll
  window.addEventListener('scroll', throttle(() => {
    if (!window.portfolioScene) return;
    
    const { particlesMesh } = window.portfolioScene;
    const scrollY = window.scrollY / window.innerHeight;
    
    // Update rotation based on scroll position
    particlesMesh.rotation.x = scrollY * 0.3;
    particlesMesh.rotation.y = scrollY * 0.4;
  }, 100));
}

/**
 * Fetch Projects from JSON with Optimized Caching and Error Handling
 */
function loadProjectsFromJSON() {
  // Check if we have cached data and use it first
  const cachedData = sessionStorage.getItem('projectsData');
  if (cachedData) {
    try {
      projectsData = JSON.parse(cachedData);
      updateFeaturedProjects(projectsData);
      updatePortfolioProjects(projectsData);
      initPortfolioFilter();
      initProjectModals();
      return;
    } catch (e) {
      console.warn('Error parsing cached data, fetching fresh data');
    }
  }
  
  // Fetch fresh data with timeout and error handling
  const fetchTimeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Fetch timeout')), 5000)
  );
  
  Promise.race([
    fetch('projects.json'),
    fetchTimeout
  ])
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      projectsData = data.projects;
      
      // Cache the data for future use
      try {
        sessionStorage.setItem('projectsData', JSON.stringify(projectsData));
      } catch (e) {
        console.warn('Could not cache project data');
      }
      
      // Update featured projects in hero section
      updateFeaturedProjects(projectsData);
      
      // Update portfolio grid
      updatePortfolioProjects(projectsData);
      
      // Initialize portfolio filter
      initPortfolioFilter();
      
      // Initialize project modals
      initProjectModals();
    })
    .catch(error => {
      console.error('Error loading projects:', error);
      
      // Use default fallback data in case of error
      projectsData = getFallbackProjectData();
      updateFeaturedProjects(projectsData);
      updatePortfolioProjects(projectsData);
      initPortfolioFilter();
      initProjectModals();
    });
}

/**
 * Fallback project data in case of network errors
 */
function getFallbackProjectData() {
  // Simple fallback data to ensure the site still works
  return [
    {
      id: "project-1",
      title: "Web Development",
      description: "Custom website development with responsive design",
      categories: ["web"],
      mainImage: "./assets/images/placeholder-1.jpg",
      tags: ["Web Development", "Responsive"],
      website: "#",
      modalContent: {
        subtitle: "Modern web development solutions",
        galleryImages: ["./assets/images/placeholder-1.jpg"],
        detailedDescription: "Custom website development with responsive design for all devices",
        projectDetails: ["Responsive Design", "Modern Technologies"],
        technologies: ["HTML", "CSS", "JavaScript"],
        results: "Successfully launched website with improved performance"
      }
    },
    {
      id: "project-2",
      title: "POS System",
      description: "Point of sale system implementation",
      categories: ["pos"],
      mainImage: "./assets/images/placeholder-2.jpg",
      tags: ["POS", "Retail"],
      website: "#",
      modalContent: {
        subtitle: "Retail POS solution",
        galleryImages: ["./assets/images/placeholder-2.jpg"],
        detailedDescription: "Point of sale system implementation for retail businesses",
        projectDetails: ["Inventory Management", "Sales Tracking"],
        technologies: ["Square", "Cloud Technology"],
        results: "Improved sales processing and inventory management"
      }
    },
    {
      id: "project-3",
      title: "Office Technology",
      description: "Complete office technology setup",
      categories: ["tech"],
      mainImage: "./assets/images/placeholder-3.jpg",
      tags: ["Office", "IT Setup"],
      website: "#",
      modalContent: {
        subtitle: "Office technology solutions",
        galleryImages: ["./assets/images/placeholder-3.jpg"],
        detailedDescription: "Complete office technology setup for businesses",
        projectDetails: ["Network Setup", "Hardware Installation"],
        technologies: ["Networking", "Cloud Services"],
        results: "Enhanced productivity and technology infrastructure"
      }
    }
  ];
}

/**
 * Update Featured Projects in Hero Section
 */
function updateFeaturedProjects(projects) {
  const featuredContainer = document.getElementById('featured-projects');
  if (!featuredContainer) return;
  
  // Clear existing content
  featuredContainer.innerHTML = '';
  
  // Take first 3 projects
  const featuredProjects = projects.slice(0, 3);
  
  // Create document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  featuredProjects.forEach(project => {
    const projectElement = document.createElement('div');
    projectElement.className = 'featured-project';
    projectElement.setAttribute('data-tilt', '');
    projectElement.setAttribute('data-tilt-max', '10');
    
    projectElement.innerHTML = `
      <img src="${project.mainImage}" alt="${project.title}" class="featured-project-image">
      <div class="featured-project-title">${project.title}</div>
    `;
    
    fragment.appendChild(projectElement);
  });
  
  // Single DOM update
  featuredContainer.appendChild(fragment);
  
  // Initialize tilt effect if appropriate
  if (window.VanillaTilt && !document.body.classList.contains('touch-device')) {
    VanillaTilt.init(document.querySelectorAll('.featured-project'), {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.15
    });
  }
}

/**
 * Update Portfolio Projects with Performance Optimizations
 */
function updatePortfolioProjects(projects) {
  const portfolioGrid = document.getElementById('portfolio-grid');
  if (!portfolioGrid) return;
  
  // Clear existing projects
  portfolioGrid.innerHTML = '';
  
  // Create document fragment for batched DOM updates
  const fragment = document.createDocumentFragment();
  
  projects.forEach(project => {
    const projectElement = document.createElement('div');
    projectElement.className = 'portfolio-item tilt-element';
    projectElement.setAttribute('data-category', project.categories.join(' '));
    projectElement.setAttribute('data-project-id', project.id);
    
    // Only add tilt attributes on non-touch devices
    if (!document.body.classList.contains('touch-device')) {
      projectElement.setAttribute('data-tilt', '');
      projectElement.setAttribute('data-tilt-max', '10');
      projectElement.setAttribute('data-tilt-perspective', '1000');
    }
    
    projectElement.innerHTML = `
      <div class="portfolio-item-inner">
        <div class="portfolio-image">
          <img loading="lazy" src="${project.mainImage}" alt="${project.title}">
        </div>
        <div class="portfolio-overlay">
          <div class="portfolio-content">
            <div class="portfolio-tags">
              ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <h3 class="portfolio-title">${project.title}</h3>
            <a href="#" class="portfolio-link magnetic-button-sm" data-project-id="${project.id}">
              <span>View Details</span>
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    
    fragment.appendChild(projectElement);
  });
  
  // Single DOM update
  portfolioGrid.appendChild(fragment);
  
  // Initialize tilt and magnetic effects
  if (!document.body.classList.contains('touch-device')) {
    if (window.VanillaTilt) {
      VanillaTilt.init(document.querySelectorAll('.portfolio-item'), {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.15
      });
    }
    
    initMagneticElements();
  }
}

/**
 * Portfolio Filter With Optimized Animations
 */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (!filterButtons.length || !portfolioItems.length) return;
  
  // Active filter button effect
  gsap.set(filterButtons[0], { 
    color: '#fff',
    background: 'linear-gradient(135deg, #007aff, #00c2ff)'
  });
  
  // Group items by category for faster filtering
  const itemsByCategory = {};
  portfolioItems.forEach(item => {
    const categories = item.getAttribute('data-category').split(' ');
    categories.forEach(category => {
      if (!itemsByCategory[category]) {
        itemsByCategory[category] = [];
      }
      itemsByCategory[category].push(item);
    });
  });
  
  // Pre-compute which items match each filter
  const precomputedMatches = {};
  filterButtons.forEach(button => {
    const filterValue = button.getAttribute('data-filter');
    if (filterValue === 'all') {
      precomputedMatches[filterValue] = Array.from(portfolioItems);
    } else {
      precomputedMatches[filterValue] = itemsByCategory[filterValue] || [];
    }
  });
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button styles
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      gsap.to(filterButtons, {
        color: '#8e8e93',
        background: '#ffffff',
        boxShadow: 'none',
        y: 0,
        duration: 0.3
      });
      
      gsap.to(button, {
        color: '#ffffff',
        background: 'linear-gradient(135deg, #007aff, #00c2ff)',
        boxShadow: '0 10px 30px rgba(0, 122, 255, 0.25)',
        y: -3,
        duration: 0.3
      });
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Get matching items from precomputed matches
      const matchingItems = precomputedMatches[filterValue] || [];
      const nonMatchingItems = Array.from(portfolioItems).filter(item => !matchingItems.includes(item));
      
      // Hide non-matching items first for better perceived performance
      gsap.to(nonMatchingItems, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.2,
        stagger: 0.02,
        onComplete: () => {
          nonMatchingItems.forEach(item => {
            item.style.display = 'none';
          });
          
          // Show matching items
          matchingItems.forEach(item => {
            item.style.display = 'block';
          });
          
          gsap.to(matchingItems, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            stagger: 0.03,
            delay: 0.05
          });
        }
      });
    });
  });
}

/**
 * Initialize Project Modals with Performance Optimizations
 */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = modal?.querySelector('.modal-close');
  const backdrop = modal?.querySelector('.modal-backdrop');
  
  if (!modal) return;
  
  // Add click events to all portfolio links
  document.querySelectorAll('.portfolio-link, .portfolio-item').forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Find project ID
      const projectId = element.dataset.projectId || 
                      element.closest('.portfolio-item')?.dataset.projectId || 
                      element.querySelector('[data-project-id]')?.dataset.projectId;
      
      if (projectId) {
        openProjectModal(projectId);
      }
    });
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
}

/**
 * Open Project Modal with Optimized Content Loading
 */
function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const modalBody = modal?.querySelector('.modal-body');
  const modalTemplate = document.getElementById('project-modal-template');
  
  if (!modal || !modalBody || !modalTemplate || !projectsData.length) return;
  
  // Find the project data
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;
  
  // Clear previous content
  modalBody.innerHTML = '';
  
  // Clone the template
  const clone = document.importNode(modalTemplate.content, true);
  
  // Populate modal content with project data
  clone.querySelector('.modal-title').textContent = project.title;
  clone.querySelector('.modal-subtitle').textContent = project.modalContent.subtitle;
  
  // Set up gallery slider
  const galleryTrack = clone.querySelector('.gallery-track');
  const galleryDots = clone.querySelector('.gallery-dots');
  
  if (galleryTrack && project.modalContent.galleryImages.length) {
    // Create document fragment for gallery images
    const galleryFragment = document.createDocumentFragment();
    const dotsFragment = document.createDocumentFragment();
    
    // Create gallery images
    project.modalContent.galleryImages.forEach((image, index) => {
      // Create gallery image
      const galleryImage = document.createElement('div');
      galleryImage.className = 'gallery-image';
      galleryImage.innerHTML = `<img loading="lazy" src="${image}" alt="${project.title} - Image ${index + 1}">`;
      galleryFragment.appendChild(galleryImage);
      
      // Create gallery dot
      const dot = document.createElement('span');
      dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('data-index', index);
      dotsFragment.appendChild(dot);
    });
    
    galleryTrack.appendChild(galleryFragment);
    galleryDots.appendChild(dotsFragment);
  }
  
  // Set description and other details
  clone.querySelector('.modal-description').textContent = project.modalContent.detailedDescription;
  
  // Set project details with fragment
  const detailsList = clone.querySelector('.details-list');
  const detailsFragment = document.createDocumentFragment();
  
  project.modalContent.projectDetails.forEach(detail => {
    const li = document.createElement('li');
    li.textContent = detail;
    detailsFragment.appendChild(li);
  });
  
  detailsList.appendChild(detailsFragment);
  
  // Set technologies with fragment
  const techTags = clone.querySelector('.tech-tags');
  const techFragment = document.createDocumentFragment();
  
  project.modalContent.technologies.forEach(tech => {
    const span = document.createElement('span');
    span.textContent = tech;
    techFragment.appendChild(span);
  });
  
  techTags.appendChild(techFragment);
  
  // Set results
  clone.querySelector('.results-text').textContent = project.modalContent.results;
  
  // Set website link
  const websiteLink = clone.querySelector('.modal-website-link');
  websiteLink.href = project.website;
  
  // Add content to modal
  modalBody.appendChild(clone);
  
  // Initialize gallery slider after a short delay to ensure DOM is ready
  setTimeout(() => {
    initGallerySlider();
  }, 100);
  
  // Activate modal with animation
  document.body.style.overflow = 'hidden'; // Prevent scrolling
  modal.classList.add('active');
  
  // Animate modal container
  gsap.fromTo('.modal-container',
    { 
      y: 30, 
      opacity: 0,
      scale: 0.98
    },
    { 
      y: 0, 
      opacity: 1,
      scale: 1,
      duration: 0.4, 
      delay: 0.1, 
      ease: 'power2.out' 
    }
  );
}

/**
 * Initialize Gallery Slider with Optimized Performance
 */
function initGallerySlider() {
  const galleryTrack = document.querySelector('.gallery-track');
  const galleryPrev = document.querySelector('.gallery-prev');
  const galleryNext = document.querySelector('.gallery-next');
  const galleryDots = document.querySelectorAll('.gallery-dot');
  
  if (!galleryTrack || !galleryPrev || !galleryNext || !galleryDots.length) return;
  
  let currentSlide = 0;
  
  // Update gallery position - more efficient version
  function updateGallery() {
    const slideWidth = galleryTrack.clientWidth;
    galleryTrack.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
    
    // Update dots
    galleryDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  // Function to update gallery dimensions on window resize
  window.updateGalleryDimensions = updateGallery;
  
  // Previous slide button
  galleryPrev.addEventListener('click', () => {
    const slidesCount = galleryTrack.querySelectorAll('.gallery-image').length;
    currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
    updateGallery();
  });
  
  // Next slide button
  galleryNext.addEventListener('click', () => {
    const slidesCount = galleryTrack.querySelectorAll('.gallery-image').length;
    currentSlide = (currentSlide + 1) % slidesCount;
    updateGallery();
  });
  
  // Dot navigation
  galleryDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateGallery();
    });
  });
  
  // Initial update
  updateGallery();
  
  // Add swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  galleryTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, false);
  
  galleryTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    const minSwipeDistance = 50;
    if (touchEndX < touchStartX - minSwipeDistance) {
      // Swipe left, go to next slide
      galleryNext.click();
    } else if (touchEndX > touchStartX + minSwipeDistance) {
      // Swipe right, go to previous slide
      galleryPrev.click();
    }
  }
}

/**
 * Close Project Modal with Optimized Animation
 */
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  
  if (!modal) return;
  
  // Animate modal closing
  gsap.to('.modal-container', {
    y: 30,
    opacity: 0,
    scale: 0.98,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
      
      // Clear modal content after animation completes to free up memory
      setTimeout(() => {
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) modalBody.innerHTML = '';
      }, 300);
    }
  });
}

/**
 * Initialize Testimonials Scroll with Performance Optimizations
 */
function initTestimonialsScroll() {
  const slider = document.querySelector('.testimonials-track');
  if (!slider) return;
  
  // Apply tilt effect to testimonial cards only on non-touch devices
  if (window.VanillaTilt && !document.body.classList.contains('touch-device')) {
    VanillaTilt.init(document.querySelectorAll('.testimonial-card'), {
      max: 5,
      speed: 400,
      glare: false,
      'max-glare': 0.2,
      scale: 1.03,
      gyroscope: false // Disable for better performance
    });
  }
  
  // Pause animation on hover
  slider.addEventListener('mouseenter', () => {
    slider.style.animationPlayState = 'paused';
  });
  
  slider.addEventListener('mouseleave', () => {
    slider.style.animationPlayState = 'running';
  });
}

/**
 * Initialize Video Modal with Performance Optimizations
 */
function initVideoModal() {
  const videoThumbnail = document.querySelector('.testimonial-video-wrapper');
  const videoPlay = document.querySelector('.testimonial-video-play');
  
  if (!videoThumbnail || !videoPlay) return;
  
  videoPlay.addEventListener('click', () => {
    // In a real implementation, this would show a video player
    // For this example, we'll animate the button with optimized animation
    gsap.to(videoPlay, {
      scale: 1.5,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        // Reset
        gsap.to(videoPlay, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          delay: 0.2
        });
        
        // Show message for demo
        alert('Video playback would start here in a real implementation.');
      }
    });
  });
}

/**
 * Initialize Progress Rings with Optimized Performance
 */
function initProgressRings() {
  const progressRings = document.querySelectorAll('.progress-ring-circle');
  
  if (!progressRings.length) return;
  
  // Set initial state for all rings
  progressRings.forEach(ring => {
    const radius = ring.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    
    // Set initial state (full circle)
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;
  });
  
  // Animate progress rings when they become visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ring = entry.target;
        const radius = ring.getAttribute('r');
        const circumference = 2 * Math.PI * radius;
        const value = ring.getAttribute('data-value');
        const scale = ring.getAttribute('data-scale') || 1;
        const scaledValue = value * scale;
        
        // Calculate offset based on percentage
        const percentage = scaledValue / 100;
        const offset = circumference - (circumference * percentage);
        
        // Animate the progress ring with GSAP
        gsap.to(ring, {
          strokeDashoffset: offset,
          duration: 1.5, // Reduced from 2s
          ease: 'power2.out'
        });
        
        // Stop observing once animation has played
        observer.unobserve(ring);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });
  
  // Observe each progress ring
  progressRings.forEach(ring => {
    observer.observe(ring);
  });
}

/**
 * Initialize Counters with Optimized Performance
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  // Set up intersection observer with optimized settings
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = window.innerWidth < 768 ? 1 : 1.5; // Shorter duration on mobile
        
        // Animate counter with GSAP
        gsap.to(counter, {
          textContent: target,
          duration: duration,
          ease: 'power1.inOut',
          snap: { textContent: 1 }, // Ensure integers only
          onUpdate: () => {
            counter.textContent = Math.round(gsap.getProperty(counter, 'textContent'));
          }
        });
        
        // Stop observing once animation has played
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });
  
  // Observe each counter
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

/**
 * Initialize CTA Canvas Background with Performance Optimizations
 */
function initCTACanvas() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas) return;
  
  // Skip heavy animations on mobile
  if (document.body.classList.contains('touch-device') || window.innerWidth < 768) {
    // Add simple background gradient instead
    const ctaSection = canvas.closest('.cta-section');
    if (ctaSection) {
      ctaSection.style.background = 'radial-gradient(circle at center, rgba(0, 122, 255, 0.8), rgba(0, 50, 150, 0.9))';
    }
    return;
  }
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions with pixel ratio consideration
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    
    // Reset canvas styling
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
  }
  
  // Call resize initially and on window resize
  resizeCanvas();
  window.addEventListener('resize', debounce(resizeCanvas, 250));
  
  // Define particles with reduced count
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 20 : 40; // Reduce count for mobile
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1, // Smaller radius
      color: `rgba(${Math.round(Math.random() * 100 + 155)}, ${Math.round(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.4 + 0.1})`,
      speedX: Math.random() * 1 - 0.5, // Slower speed
      speedY: Math.random() * 1 - 0.5  // Slower speed
    });
  }
  
  // Draw particles with optimized rendering
  let animationFrameId;
  let lastTimestamp = 0;
  const fpsInterval = 1000 / 30; // Target 30fps to save power
  
  function drawParticles(timestamp) {
    animationFrameId = requestAnimationFrame(drawParticles);
    
    // Throttle frame rate
    if (timestamp - lastTimestamp < fpsInterval) return;
    lastTimestamp = timestamp;
    
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    // Update and draw each particle
    particles.forEach(particle => {
      // Move particle
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around if offscreen
      if (particle.x < 0) particle.x = canvas.offsetWidth;
      if (particle.x > canvas.offsetWidth) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.offsetHeight;
      if (particle.y > canvas.offsetHeight) particle.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
    
    // Draw connections between nearby particles only
    ctx.strokeStyle = 'rgba(0, 122, 255, 0.05)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) { // Reduced connection distance
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Start animation
  drawParticles(0);
  
  // Clean up animation when section is not visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      } else if (entry.isIntersecting && !animationFrameId) {
        drawParticles(0);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(canvas.closest('.cta-section'));
}

/**
 * Initialize Contact Map with Optimized Performance
 */
function initContactMap() {
  const mapContainer = document.getElementById('contact-map');
  if (!mapContainer) return;
  
  // For demonstration, use a static map image with optimized loading
  const mapImage = new Image();
  mapImage.onload = function() {
    mapContainer.style.backgroundImage = `url(${mapImage.src})`;
    mapContainer.style.backgroundSize = 'cover';
    mapContainer.style.backgroundPosition = 'center';
  };
  
  // Set src after defining onload to ensure the event fires correctly
  mapImage.src = "https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=12&size=640x300&scale=2&style=feature:road|color:0x007aff|weight:1&style=feature:water|color:0x4da3ff|lightness:50&style=feature:landscape|color:0xf2f2f7&style=feature:poi|color:0xcccccc&key=YOUR_API_KEY";
  
  // Set a background color while the image loads
  mapContainer.style.backgroundColor = 'var(--light-200)';
}

/**
 * Initialize Form Interactions with Performance Optimizations
 */
function initFormInteractions() {
  const form = document.getElementById('contact-form');
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
  
  if (!form || !formInputs.length) return;
  
  // Add focus effects
  formInputs.forEach(input => {
    // Focus and blur effects
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
      
      // Animate focus line
      const focusLine = input.parentElement.querySelector('.form-focus-line');
      if (focusLine) {
        gsap.to(focusLine, {
          width: 'calc(100% - 2px)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      
      // Animate focus line
      const focusLine = input.parentElement.querySelector('.form-focus-line');
      if (focusLine) {
        gsap.to(focusLine, {
          width: input.value ? 'calc(100% - 2px)' : '0%',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    
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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Basic validation
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
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
    
    // Validate service selection
    if (service && service.value === '') {
      showError(service, 'Please select a service');
      isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
      showError(message, 'Please enter your message');
      isValid = false;
    }
    
    if (isValid) {
      // Form is valid, simulate form submission
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = '<span>Sending</span> <i class="fas fa-spinner fa-spin"></i>';
      submitButton.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // Show success message with animation
        gsap.to(form, {
          opacity: 0,
          y: 20,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            form.innerHTML = `
              <div class="form-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="form-success-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you shortly.</p>
              </div>
            `;
            
            gsap.from('.form-success', {
              opacity: 0,
              y: 20,
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        });
      }, 1500);
    }
  });
  
  // Helper functions
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = 'var(--accent)';
    error.style.fontSize = '0.8125rem';
    error.style.marginTop = '0.25rem';
    formGroup.appendChild(error);
    
    // Highlight the input
    input.style.borderColor = 'var(--accent)';
    gsap.from(error, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    // Remove highlight on input
    input.addEventListener('input', function() {
      input.style.borderColor = '';
      const errorElement = formGroup.querySelector('.error-message');
      if (errorElement) {
        gsap.to(errorElement, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            errorElement.remove();
          }
        });
      }
    });
  }
  
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

/**
 * Back to Top Button with Optimized Performance
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;
  
  // Function to update button visibility (called by updateOnScroll)
  window.updateBackToTopVisibility = function() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  };
  
  // Scroll to top when clicking the button
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Scroll to top with animation
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: 0,
        autoKill: false
      },
      ease: 'power2.inOut'
    });
  });
}
      
