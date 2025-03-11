/**
 * Elan's Tech World - Optimized JavaScript file
 * 
 * Includes fixes for:
 * - Faster loading time
 * - Better header visibility
 * - Continuous scrolling for clients, tech stack, and testimonials
 * - Enhanced background visuals
 * - Proper alignment of content
 */

// Store project data globally
let projectsData = [];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Remove preload class to enable animations
  setTimeout(() => {
    document.body.classList.remove('preload');
  }, 300); // Reduced from 500ms
  
  // Initialize all components
  initPageLoader();
  initCustomCursor();
  initParticlesJS();
  initGSAPAnimations();
  initNavigation();
  initMobileMenu();
  
  // Hero section
  initHeroTyped();
  initHeroParallax();
  // We're showing sample featured projects directly in HTML now
  // loadFeaturedProjects();
  
  // Services and Process sections
  initMagneticElements();
  initVanillaTilt();
  initServiceCards();
  initProcessTimeline();
  initInteractiveTimeline();
  
  // Portfolio section
  initPortfolio3DScene();
  initPortfolio();
  
  // Testimonials and Stats
  initTestimonialsScroll();
  initVideoModal();
  initProgressRings();
  initCounters();
  
  // CTA, Contact and Footer
  initCTACanvas();
  initContactMap();
  initBrandsMarquee();
  initFooterParticles();
  
  // Global elements
  initRevealTextElements();
  initSplitTextElements();
  initScrollTriggerAnimations();
  initFormInteractions();
  initBackToTop();
  initPageTransitions();
  
  // Initialize infinite scrolling for clients and tech stack
  initInfiniteScrolling();
});

/**
 * Optimized Page Loader Animation
 * Faster loading and uses logo instead of glitch text
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
  
  // Simulate loading progress faster
  let progress = 0;
  let messageIndex = 0;
  
  // Show message immediately
  loaderMessage.textContent = loaderMessages[0];
  
  // Update loader message periodically but more quickly
  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % loaderMessages.length;
    
    // Add fade effect
    loaderMessage.style.opacity = 0;
    setTimeout(() => {
      loaderMessage.textContent = loaderMessages[messageIndex];
      loaderMessage.style.opacity = 1;
    }, 200);
  }, 800); // Faster message change
  
  // Accelerated progress animation
  const interval = setInterval(() => {
    // Faster progress simulation
    if (progress < 50) {
      progress += Math.random() * 15;
    } else if (progress < 85) {
      progress += Math.random() * 5;
    } else {
      progress += 2;
    }
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      clearInterval(messageInterval);
      
      // Final message
      loaderMessage.textContent = 'Welcome to Elan\'s Tech World!';
      
      // Delay to ensure animation completes, but shorter delay
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.5, // Faster fade-out
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            
            // Trigger entrance animations
            animateHeroElements();
            
            // Enable scroll after loader is hidden
            document.body.style.overflow = 'visible';
          }
        });
      }, 500); // Reduced delay
    }
    
    // Update progress bar and percentage
    progressBar.style.width = `${progress}%`;
    percentage.textContent = `${Math.round(progress)}%`;
  }, 50); // Faster updates
  
  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
}

/**
 * Initialize Custom Cursor
 */
function initCustomCursor() {
  const cursor = document.querySelector('.cursor-follower');
  if (!cursor) return;
  
  // Check if device has touch capabilities
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
    cursor.style.display = 'none';
    return;
  }
  
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show cursor when it enters the viewport
    if (cursor.classList.contains('hidden')) {
      cursor.classList.remove('hidden');
    }
  });
  
  document.addEventListener('mouseout', () => {
    cursor.classList.add('hidden');
  });
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .tilt-element, input, textarea, select, .interactive');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    
    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
    
    element.addEventListener('mousedown', () => {
      cursor.classList.add('active');
    });
    
    element.addEventListener('mouseup', () => {
      cursor.classList.remove('active');
    });
  });
  
  // Animate cursor with smooth follow
  function animateCursor() {
    // Smoothly interpolate cursor position
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    if (cursor) {
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    }
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
}

/**
 * Initialize Infinite Scrolling for marquees
 * Ensures continuous scrolling for clients, tech stack, testimonials
 */
function initInfiniteScrolling() {
  // Make sure there are duplicated elements in the DOM to enable continuous scroll
  
  // Ensure client cards are duplicated for infinite scrolling
  const clientsTrack = document.querySelector('.clients-track');
  if (clientsTrack) {
    // Calculate the width of all client cards together for animation
    const clientCards = clientsTrack.querySelectorAll('.client-card');
    const halfwayPoint = clientCards.length / 2;
    
    if (halfwayPoint > 0) {
      // Apply animation keyframes dynamically
      const totalWidth = Array.from(clientCards).slice(0, halfwayPoint).reduce((width, card) => {
        return width + card.offsetWidth + parseInt(getComputedStyle(card).marginRight, 10);
      }, 0);
      
      // Ensure smooth infinite scrolling
      clientsTrack.style.setProperty('--scroll-width', `${totalWidth}px`);
    }
  }
  
  // Set up tech stack infinite scrolling
  const techStackTrack = document.querySelector('.tech-stack-track');
  if (techStackTrack) {
    const techIcons = techStackTrack.querySelectorAll('.tech-icon');
    const halfwayPoint = techIcons.length / 2;
    
    if (halfwayPoint > 0) {
      // Apply animation keyframes dynamically
      const totalWidth = Array.from(techIcons).slice(0, halfwayPoint).reduce((width, icon) => {
        return width + icon.offsetWidth + parseInt(getComputedStyle(icon).marginRight, 10);
      }, 0);
      
      // Ensure smooth infinite scrolling
      techStackTrack.style.setProperty('--scroll-width', `${totalWidth}px`);
    }
  }
  
  // Set up testimonials infinite scrolling
  const testimonialsTrack = document.querySelector('.testimonials-track');
  if (testimonialsTrack) {
    const testimonialCards = testimonialsTrack.querySelectorAll('.testimonial-card');
    const halfwayPoint = testimonialCards.length / 2;
    
    if (halfwayPoint > 0) {
      // Apply animation keyframes dynamically
      const totalWidth = Array.from(testimonialCards).slice(0, halfwayPoint).reduce((width, card) => {
        return width + card.offsetWidth + parseInt(getComputedStyle(card).marginRight, 10);
      }, 0);
      
      // Ensure smooth infinite scrolling
      testimonialsTrack.style.setProperty('--scroll-width', `${totalWidth}px`);
    }
  }
  
  // Pause animations on hover for better UX
  document.querySelectorAll('.clients-track, .tech-stack-track, .testimonials-track').forEach(track => {
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    
    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });
}

/**
 * Initialize Particles.js for attractive background particles
 */
function initParticlesJS() {
  // Hero particles
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 20, density: { enable: true, value_area: 800 } },
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
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.5 } },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }
  
  // Footer particles
  if (document.getElementById('footer-particles')) {
    particlesJS('footer-particles', {
      particles: {
        number: { value: 15, density: { enable: true, value_area: 800 } },
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
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          bubble: { distance: 140, size: 6, duration: 2, opacity: 0.3, speed: 3 },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }
}

/**
 * Initialize GSAP Animations
 * Sets up ScrollTrigger and animations
 */
function initGSAPAnimations() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
  // Initialize GSAP defaults
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.8
  });
}

/**
 * Animate Hero Elements when page loads
 */
function animateHeroElements() {
  const heroElements = document.querySelectorAll('[data-animation="fade-up"]');
  
  heroElements.forEach((element, index) => {
    const delay = element.dataset.delay || index * 0.1;
    
    gsap.from(element, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: parseFloat(delay),
      ease: 'power3.out'
    });
  });
}

/**
 * Initialize Split Text Elements
 */
function initSplitTextElements() {
  const splitElements = document.querySelectorAll('.split-text');
  
  splitElements.forEach(element => {
    const text = element.textContent;
    const characters = text.split('');
    
    element.innerHTML = '';
    characters.forEach(char => {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.style.display = 'inline-block';
      charSpan.style.transform = 'translateY(20px)';
      charSpan.style.opacity = '0';
      charSpan.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(charSpan);
    });
  });
}

/**
 * Initialize Reveal Text Elements
 */
function initRevealTextElements() {
  const revealElements = document.querySelectorAll('.reveal-text');
  
  // Set up intersection observer for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/**
 * Initialize ScrollTrigger Animations
 */
function initScrollTriggerAnimations() {
  // Section headers fade in
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      y: 50,
      opacity: 0,
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        end: 'bottom 60%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  // Staggered fade-up animations
  gsap.utils.toArray('[data-animation="stagger-fade-up"]').forEach(container => {
    const items = container.children;
    
    gsap.from(items, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'bottom 60%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  // Slide up animations
  gsap.utils.toArray('[data-animation="slide-up"]').forEach(element => {
    const delay = element.dataset.delay || 0;
    
    gsap.from(element, {
      y: 100,
      opacity: 0,
      delay: parseFloat(delay),
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'bottom 60%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  // Animate split text characters
  document.querySelectorAll('.split-text').forEach(element => {
    const chars = element.querySelectorAll('.char');
    
    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      end: 'bottom 60%',
      onEnter: () => {
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration: 0.03,
          stagger: 0.02,
          ease: 'power2.out'
        });
      },
      once: true
    });
  });
  
  // Process steps animation
  gsap.utils.toArray('.process-step').forEach(step => {
    gsap.from(step, {
      x: -50,
      opacity: 0,
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
        end: 'bottom 60%',
        toggleActions: 'play none none none'
      }
    });
  });
  
  // Hero grid animation
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) {
    gsap.from(heroGrid, {
      opacity: 0,
      duration: 2,
      ease: 'power2.inOut'
    });
  }
  
  // Services 3D grid animation
  const services3dGrid = document.querySelector('.services-3d-grid');
  if (services3dGrid) {
    gsap.to(services3dGrid, {
      backgroundSize: '100px 100px',
      opacity: 0.15,
      duration: 3,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top 80%',
        end: 'bottom 60%',
        toggleActions: 'play none none reverse'
      }
    });
  }
}

/**
 * Initialize Typed.js for Hero Section
 */
function initHeroTyped() {
  const typedElement = document.getElementById('hero-typed');
  if (!typedElement) return;
  
  const typed = new Typed('#hero-typed', {
    stringsElement: '#hero-typed-strings',
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    startDelay: 1000,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  });
}

/**
 * Hero Parallax Effect
 */
function initHeroParallax() {
  const heroSection = document.querySelector('.hero-section');
  const heroContent = document.querySelector('.hero-content');
  const heroShapes = document.querySelectorAll('.hero-shape');
  
  if (!heroSection || !heroContent) return;
  
  // Add parallax effect on mouse move with GSAP
  heroSection.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    gsap.to(heroContent, {
      x: moveX,
      y: moveY,
      duration: 1,
      ease: 'power2.out'
    });
    
    // Animate hero shapes in opposite direction (parallax effect)
    heroShapes.forEach((shape, index) => {
      const depth = index * 0.2 + 0.4; // Different depth for each shape
      
      gsap.to(shape, {
        x: -moveX * depth * 5,
        y: -moveY * depth * 5,
        duration: 1.2,
        ease: 'power2.out'
      });
    });
  });
  
  // Reset transform when mouse leaves hero section
  heroSection.addEventListener('mouseleave', () => {
    gsap.to([heroContent, ...heroShapes], {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    });
  });
  
  // Parallax effect on scroll
  gsap.to('.hero-background', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/**
 * Initialize Magnetic Elements
 */
function initMagneticElements() {
  const magneticElements = document.querySelectorAll('.magnetic-button, .magnetic-button-sm');
  
  magneticElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const strength = element.classList.contains('magnetic-button-sm') ? 10 : 20;
      
      gsap.to(element, {
        x: x * 0.3,
        y: y * 0.3,
        rotation: x * 0.05,
        duration: 0.6,
        ease: 'power2.out'
      });
      
      if (element.querySelector('span')) {
        gsap.to(element.querySelector('span'), {
          x: x * 0.1,
          y: y * 0.1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });
    
    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
      
      if (element.querySelector('span')) {
        gsap.to(element.querySelector('span'), {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    });
  });
}

/**
 * Initialize VanillaTilt
 */
function initVanillaTilt() {
  const tiltElements = document.querySelectorAll('.tilt-element');
  
  if (!tiltElements.length || !window.VanillaTilt) return;
  
  VanillaTilt.init(tiltElements, {
    max: 10,
    speed: 400,
    glare: true,
    'max-glare': 0.15,
    gyroscope: true
  });
}

/**
 * Navigation Functionality
 */
function initNavigation() {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  if (!header) return;
  
  // Header scroll effect
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        isScrolling = false;
      });
    }
  });
  
  // Initial check for header state
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  }
  
  // Animate navigation items on page load
  gsap.from('.nav-item', {
    y: -20,
    opacity: 0,
    stagger: 0.1,
    delay: 1, // Start after page loader
    duration: 0.5,
    ease: 'power2.out'
  });
  
  // Highlight active nav item based on scroll position
  function updateActiveNavLink() {
    let scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all nav links
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }
  
  // Throttle scroll event for better performance
  let isScrollingNav = false;
  window.addEventListener('scroll', () => {
    if (!isScrollingNav) {
      isScrollingNav = true;
      setTimeout(() => {
        updateActiveNavLink();
        isScrollingNav = false;
      }, 100);
    }
  });
  
  // Update active link on page load
  updateActiveNavLink();
  
  // Smooth scrolling for anchor links
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
          duration: 1,
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
        }
      }
    });
  });
}

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (!menuToggle || !mobileMenu) return;
  
  // Toggle mobile menu with animation
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Animate mobile menu items when menu opens
    if (mobileMenu.classList.contains('active')) {
      gsap.to('.mobile-nav-item', {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.out'
      });
    }
  });
  
  // Close button functionality
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
      
      // Reset mobile menu item animations
      gsap.set('.mobile-nav-item', {
        y: 20,
        opacity: 0
      });
    });
  }
  
  // Close menu when clicking on mobile navigation links
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
      
      // Reset mobile menu item animations
      gsap.set('.mobile-nav-item', {
        y: 20,
        opacity: 0
      });
    });
  });
  
  // Close menu when clicking outside
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
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

/**
 * Initialize Service Cards
 */
function initServiceCards() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (!serviceCards.length) return;
  
  serviceCards.forEach(card => {
    // Mouse move effect on cards
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      // Calculate angle based on mouse position
      const angleX = (e.clientY - cardCenterY) / 15;
      const angleY = -(e.clientX - cardCenterX) / 15;
      
      // Apply subtle rotate transform to create depth effect
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      
      // Move card background for parallax effect
      const cardBg = card.querySelector('.service-card-bg');
      if (cardBg) {
        cardBg.style.transform = `translateX(${angleY * 2}px) translateY(${angleX * 2}px)`;
      }
    });
    
    // Reset transform on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      
      const cardBg = card.querySelector('.service-card-bg');
      if (cardBg) {
        cardBg.style.transform = 'translateX(0) translateY(0)';
      }
    });
  });
}

/**
 * Initialize Process Timeline
 */
function initProcessTimeline() {
  const processSteps = document.querySelectorAll('.process-step');
  if (!processSteps.length) return;
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  // Observe each process step
  processSteps.forEach(step => {
    observer.observe(step);
  });
}

/**
 * Initialize Interactive Timeline
 */
function initInteractiveTimeline() {
  const timelinePoints = document.querySelectorAll('.timeline-point');
  const timelineContents = document.querySelectorAll('.timeline-content');
  const timelineProgressBar = document.querySelector('.timeline-progress-bar');
  
  if (!timelinePoints.length || !timelineContents.length || !timelineProgressBar) return;
  
  // Set initial progress width based on active point
  updateTimelineProgress();
  
  // Initialize Lottie animations
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
    animationContainers.forEach(container => {
      const animationType = container.dataset.animation;
      if (animationType && animationPaths[animationType]) {
        lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: container.closest('.timeline-content').classList.contains('active'),
          path: animationPaths[animationType]
        });
      }
    });
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
      document.querySelector(`.timeline-content[data-step="${step}"]`).classList.add('active');
      
      // Update progress bar
      updateTimelineProgress();
      
      // Pause and play Lottie animations accordingly
      if (window.lottie) {
        document.querySelectorAll('.lottie-animation').forEach(container => {
          const anim = lottie.getRegisteredAnimations().find(a => a.wrapper === container);
          if (anim) {
            if (container.closest('.timeline-content').classList.contains('active')) {
              anim.play();
            } else {
              anim.pause();
            }
          }
        });
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
    
    timelineProgressBar.style.width = `${progressPercentage}%`;
  }
  
  // Auto-progress timeline after a delay
  let currentStep = 1;
  
  function autoProgressTimeline() {
    currentStep = currentStep % timelinePoints.length + 1;
    
    // Trigger click on next point
    const nextPoint = document.querySelector(`.timeline-point[data-step="${currentStep}"]`);
    if (nextPoint) {
      nextPoint.click();
    }
    
    // Schedule next auto-progress
    setTimeout(autoProgressTimeline, 5000);
  }
  
  // Start auto-progress after initial delay
  setTimeout(autoProgressTimeline, 5000);
}

/**
 * Initialize 3D Scene for Portfolio
 */
function initPortfolio3DScene() {
  const scene = document.getElementById('portfolio-3d-scene');
  if (!scene || !window.THREE) return;
  
  // Create Three.js scene
  const threeScene = new THREE.Scene();
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(75, scene.clientWidth / scene.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(scene.clientWidth, scene.clientHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  scene.appendChild(renderer.domElement);
  
  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  // Create material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x007aff,
    transparent: true,
    opacity: 0.5
  });
  
  // Create mesh
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  threeScene.add(particlesMesh);
  
  // Animation function
  function animate() {
    requestAnimationFrame(animate);
    
    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.0005;
    
    renderer.render(threeScene, camera);
  }
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = scene.clientWidth / scene.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(scene.clientWidth, scene.clientHeight);
  });
  
  // Start animation
  animate();
  
  // Animate particles on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY / window.innerHeight;
    particlesMesh.rotation.x = scrollY * 0.5;
    particlesMesh.rotation.y = scrollY * 0.8;
  });
}

/**
 * Initialize Portfolio Features
 */
function initPortfolio() {
  // Sample projects data - we're showing samples directly in HTML now
  projectsData = [
    {
      id: "project1",
      title: "Doug Psychological",
      categories: ["web"],
      tags: ["Web Design", "Healthcare"],
      mainImage: "./assets/images/doug.png",
      website: "#",
      modalContent: {
        subtitle: "Healthcare Web Platform",
        detailedDescription: "A comprehensive web platform for psychological services",
        projectDetails: ["Custom appointment scheduling", "Patient portal"],
        technologies: ["HTML5", "CSS3", "JavaScript", "PHP"],
        results: "Increased patient engagement by 40% and streamlined scheduling process.",
        galleryImages: ["./assets/images/doug.png"]
      }
    },
    {
      id: "project2",
      title: "Cohen & Associates",
      categories: ["web", "marketing"],
      tags: ["Web Design", "Legal"],
      mainImage: "./assets/images/logocohen.jpeg",
      website: "#",
      modalContent: {
        subtitle: "Legal Services Website",
        detailedDescription: "Professional website for a law firm with secure document handling",
        projectDetails: ["Document management system", "Client portal"],
        technologies: ["JavaScript", "PHP", "MySQL"],
        results: "Streamlined client communication and document sharing.",
        galleryImages: ["./assets/images/logocohen.jpeg"]
      }
    },
    {
      id: "project3",
      title: "Iconic Aesthetics",
      categories: ["web", "pos"],
      tags: ["Web Design", "POS System"],
      mainImage: "./assets/images/iconic.jpeg",
      website: "#",
      modalContent: {
        subtitle: "Beauty Clinic Technology Solution",
        detailedDescription: "Integrated web and POS system for a beauty clinic",
        projectDetails: ["Appointment scheduling", "Inventory management"],
        technologies: ["React", "Node.js", "MongoDB"],
        results: "Increased bookings by 35% and improved inventory tracking.",
        galleryImages: ["./assets/images/iconic.jpeg"]
      }
    }
  ];
  
  // Initialize portfolio filter
  initPortfolioFilter();
  
  // Initialize project modals
  initProjectModals();
}

/**
 * Portfolio Filter With Animation
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
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button styles
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
      
      // Filter portfolio items with GSAP
      portfolioItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        const shouldShow = filterValue === 'all' || categories.includes(filterValue);
        
        if (shouldShow) {
          // Show item with animation
          gsap.to(item, {
            opacity: 0,
            y: 20,
            scale: 0.9,
            duration: 0.3,
            onComplete: () => {
              item.style.display = 'block';
              gsap.to(item, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                delay: 0.1
              });
            }
          });
        } else {
          // Hide item with animation
          gsap.to(item, {
            opacity: 0,
            y: 20,
            scale: 0.9,
            duration: 0.3,
            onComplete: () => {
              item.style.display = 'none';
            }
          });
        }
      });
    });
  });
}

/**
 * Initialize project modal functionality
 */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = modal?.querySelector('.modal-close');
  const backdrop = modal?.querySelector('.modal-backdrop');
  
  if (!modal) return;
  
  // Add click events to all portfolio links
  document.querySelectorAll('.portfolio-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // Find closest portfolio item to get project ID
      const portfolioItem = link.closest('.portfolio-item');
      if (portfolioItem) {
        // Use data-category as a fallback if no project ID
        // In a real implementation, you would use proper project IDs
        openProjectModal(portfolioItem.dataset.category.split(' ')[0]);
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
 * Open project modal with the specified project data
 */
function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const modalBody = modal?.querySelector('.modal-body');
  const modalTemplate = document.getElementById('project-modal-template');
  
  if (!modal || !modalBody || !modalTemplate) return;
  
  // Find the project data - use first project as fallback
  const project = projectsData.find(p => p.id === projectId) || projectsData[0];
  
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
    // Create gallery images
    project.modalContent.galleryImages.forEach((image, index) => {
      const galleryImage = document.createElement('div');
      galleryImage.className = 'gallery-image';
      galleryImage.innerHTML = `<img src="${image}" alt="${project.title} - Image ${index + 1}">`;
      galleryTrack.appendChild(galleryImage);
      
      // Create gallery dot
      const dot = document.createElement('span');
      dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('data-index', index);
      galleryDots.appendChild(dot);
    });
  }
  
  // Set description and other details
  clone.querySelector('.modal-description').textContent = project.modalContent.detailedDescription;
  
  // Set project details
  const detailsList = clone.querySelector('.details-list');
  project.modalContent.projectDetails.forEach(detail => {
    const li = document.createElement('li');
    li.textContent = detail;
    detailsList.appendChild(li);
  });
  
  // Set technologies
  const techTags = clone.querySelector('.tech-tags');
  project.modalContent.technologies.forEach(tech => {
    const span = document.createElement('span');
    span.textContent = tech;
    techTags.appendChild(span);
  });
  
  // Set results
  clone.querySelector('.results-text').textContent = project.modalContent.results;
  
  // Set website link
  const websiteLink = clone.querySelector('.modal-website-link');
  websiteLink.href = project.website;
  
  // Add content to modal
  modalBody.appendChild(clone);
  
  // Initialize gallery navigation
  initGallerySlider();
  
  // Activate modal with animation
  document.body.style.overflow = 'hidden'; // Prevent scrolling
  modal.classList.add('active');
  
  // Animate modal container
  gsap.fromTo('.modal-container',
    { 
      y: 50, 
      opacity: 0 
    },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.6, 
      delay: 0.2, 
      ease: 'power2.out' 
    }
  );
  
  // Animate modal title with revealing effect
  gsap.to('.modal-title .reveal-text::after', {
    x: '100%',
    duration: 0.8,
    delay: 0.4,
    ease: 'power2.inOut'
  });
  
  // Reveal text animations in modal
  const revealElements = modal.querySelectorAll('.reveal-text');
  revealElements.forEach(element => {
    element.classList.add('animated');
  });
}

/**
 * Initialize Gallery Slider
 */
function initGallerySlider() {
  const galleryTrack = document.querySelector('.gallery-track');
  const galleryPrev = document.querySelector('.gallery-prev');
  const galleryNext = document.querySelector('.gallery-next');
  const galleryDots = document.querySelectorAll('.gallery-dot');
  
  if (!galleryTrack || !galleryPrev || !galleryNext || !galleryDots.length) return;
  
  let currentSlide = 0;
  const slideWidth = galleryTrack.querySelector('.gallery-image').offsetWidth;
  const slidesCount = galleryTrack.querySelectorAll('.gallery-image').length;
  
  // Update gallery position
  function updateGallery() {
    galleryTrack.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
    
    // Update dots
    galleryDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  // Previous slide button
  galleryPrev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
    updateGallery();
  });
  
  // Next slide button
  galleryNext.addEventListener('click', () => {
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
}

/**
 * Close the project modal with animations
 */
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  
  if (!modal) return;
  
  // Animate modal closing
  gsap.to('.modal-container', {
    y: 50,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
    }
  });
}

/**
 * Initialize Testimonials Scroll Animation
 */
function initTestimonialsScroll() {
  const slider = document.querySelector('.testimonials-track');
  if (!slider) return;
  
  // Make sure we have duplicated testimonials for infinite scrolling
  const originalCards = slider.querySelectorAll('.testimonial-card');
  
  // Apply tilt effect to all testimonial cards
  if (window.VanillaTilt) {
    VanillaTilt.init(originalCards, {
      max: 5,
      speed: 400,
      glare: false,
      'max-glare': 0.2,
      scale: 1.03
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
 * Initialize Video Modal
 */
function initVideoModal() {
  const videoThumbnail = document.querySelector('.testimonial-video-wrapper');
  const videoPlay = document.querySelector('.testimonial-video-play');
  
  if (!videoThumbnail || !videoPlay) return;
  
  videoPlay.addEventListener('click', () => {
    // In a real implementation, this would show a video player
    // For this example, we'll animate the button
    gsap.to(videoPlay, {
      scale: 1.5,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        // Reset
        gsap.to(videoPlay, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 0.2
        });
        
        // Show message for demo
        alert('Video playback would start here in a real implementation.');
      }
    });
  });
}

/**
 * Initialize Progress Rings
 */
function initProgressRings() {
  const progressRings = document.querySelectorAll('.progress-ring-circle');
  
  if (!progressRings.length) return;
  
  // Set up SVG gradient for progress rings
  const svgNS = "http://www.w3.org/2000/svg";
  
  // Create gradient definition
  const progressGradient = document.createElementNS(svgNS, "defs");
  progressGradient.innerHTML = `
    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#007aff" />
      <stop offset="100%" stop-color="#00c2ff" />
    </linearGradient>
  `;
  
  // Add gradient to first SVG
  const firstSVG = progressRings[0].closest('svg');
  if (firstSVG) {
    firstSVG.insertBefore(progressGradient, firstSVG.firstChild);
  }
  
  // Set initial state for all rings
  progressRings.forEach(ring => {
    const radius = ring.getAttribute('r');
    const circumference = 2 * Math.PI * radius;
    
    // Set initial state (full circle)
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;
    
    // Set gradient fill
    ring.style.stroke = 'url(#progress-gradient)';
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
        
        // Animate the progress ring
        gsap.to(ring, {
          strokeDashoffset: offset,
          duration: 2,
          ease: 'power2.out'
        });
        
        // Stop observing once animation has played
        observer.unobserve(ring);
      }
    });
  }, { threshold: 0.5 });
  
  // Observe each progress ring
  progressRings.forEach(ring => {
    observer.observe(ring);
  });
}

/**
 * Counter Animation
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
        
        // Animate counter with GSAP
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 }, // Ensure integers only
          onUpdate: () => {
            counter.textContent = Math.round(counter.innerText);
          }
        });
        
        // Stop observing once animation has played
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  // Observe each counter
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

/**
 * Initialize CTA Canvas Background
 */
function initCTACanvas() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  
  // Call resize initially and on window resize
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Define particles
  const particles = [];
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      color: `rgba(${Math.round(Math.random() * 100 + 155)}, ${Math.round(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.5 + 0.1})`,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1
    });
  }
  
  // Draw particles
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw each particle
    particles.forEach(particle => {
      // Move particle
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around if offscreen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
    
    // Draw connections between particles
    ctx.strokeStyle = 'rgba(0, 122, 255, 0.05)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(drawParticles);
  }
  
  // Start animation
  drawParticles();
}

/**
 * Initialize Contact Map
 */
function initContactMap() {
  const mapContainer = document.getElementById('contact-map');
  if (!mapContainer) return;
  
  // For demonstration, we'll just add a static map image
  // In a real implementation, this would integrate with a mapping API
  mapContainer.style.backgroundImage = "url('https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=12&size=1200x400&style=feature:road|color:0x007aff|weight:1&style=feature:water|color:0x4da3ff|lightness:50&style=feature:landscape|color:0xf2f2f7&style=feature:poi|color:0xcccccc&key=YOUR_API_KEY')";
  mapContainer.style.backgroundSize = 'cover';
  mapContainer.style.backgroundPosition = 'center';
}

/**
 * Initialize Brands Marquee
 */
function initBrandsMarquee() {
  // Already set up with the autoprefixer for continuous scroll
}

/**
 * Initialize Footer Particles
 */
function initFooterParticles() {
  // Implementation included in initParticlesJS function
}

/**
 * Form Interactions
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
          duration: 0.5,
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
 * Back to Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });
  
  // Scroll to top when clicking the button
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Scroll to top with animation
    gsap.to(window, {
      duration: 1.5,
      scrollTo: {
        y: 0,
        autoKill: false
      },
      ease: 'power2.inOut'
    });
  });
}

/**
 * Page Transitions
 */
function initPageTransitions() {
  const transitionElement = document.querySelector('.page-transition');
  if (!transitionElement) return;
  
  // Hijack internal links for page transitions
  document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target])').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Don't transition for links to the current page
      if (href === window.location.pathname) return;
      
      e.preventDefault();
      
      // Start transition animation
      transitionElement.classList.add('active');
      
      // Navigate to the new page after animation completes
      setTimeout(() => {
        window.location.href = href;
      }, 600); // Half of the animation duration
    });
  });
}
