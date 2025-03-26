/**
 * Elan's Tech World - Services Page JavaScript File
 * Enhanced with sleek animations and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animation library
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: false,
    mirror: false,
    offset: 120
  });
  
  // Counter Animation
  initCounters();
  
  // Initialize Services Filter
  initServicesFilter();
  
  // Initialize Card Tilt Effect
  initCardTilt();
  
  // Handle Service Card Hover Effects
  initServiceCardEffects();
  
  // Add Scroll Animations
  addScrollAnimations();
  
  // Initialize Magnetic Buttons from main script
  if (typeof initMagneticButtons === 'function') {
    initMagneticButtons();
  }
});

/**
 * Initialize Services Filter
 */
function initServicesFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (!filterButtons.length || !serviceCards.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter service cards
      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          // Show card with animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            card.style.display = 'block';
            
            // Force reflow
            void card.offsetWidth;
            
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          }, 50);
        } else {
          // Hide card with animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Initialize Card Tilt Effect
 */
function initCardTilt() {
  // Check if VanillaTilt is available
  if (typeof VanillaTilt !== 'undefined') {
    // Get all card elements that should have tilt effect
    const tiltElements = document.querySelectorAll('.service-card-inner, .featured-service-showcase, .services-intro-image');
    
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }
    
    // Initialize tilt effect
    VanillaTilt.init(tiltElements, {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.3,
      gyroscope: false
    });
  }
}

/**
 * Handle Service Card Hover Effects
 */
function initServiceCardEffects() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const front = this.querySelector('.service-card-front');
      const back = this.querySelector('.service-card-back');
      
      if (front && back) {
        front.style.transform = 'rotateY(180deg)';
        back.style.transform = 'rotateY(0)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const front = this.querySelector('.service-card-front');
      const back = this.querySelector('.service-card-back');
      
      if (front && back) {
        front.style.transform = 'rotateY(0)';
        back.style.transform = 'rotateY(180deg)';
      }
    });
  });
}

/**
 * Counter Animation for Statistics
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
        const duration = 2000; // 2 seconds
        const interval = 20; // 20ms between updates
        const increment = Math.ceil(target / (duration / interval));
        
        const updateCount = () => {
          if (count < target) {
            count = Math.min(count + increment, target);
            counter.textContent = count;
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCount();
        
        // Add pulse animation to parent element if found
        const statBox = counter.closest('.stat-box');
        if (statBox) {
          statBox.classList.add('pulse-animation');
          
          // Remove pulse after animation completes
          setTimeout(() => {
            statBox.classList.remove('pulse-animation');
          }, 1500);
        }
        
        // Unobserve after animating
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
 * Add Scroll Animations
 */
function addScrollAnimations() {
  // Parallax effect for hero section
  const heroSection = document.querySelector('.services-hero');
  const heroContent = document.querySelector('.services-hero-content');
  
  if (heroSection && heroContent) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      // Parallax effect - content moves slower than background
      if (scrollY <= heroSection.offsetHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    });
  }
  
  // Process steps animation
  const processSteps = document.querySelectorAll('.process-step');
  
  if (processSteps.length) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const step = entry.target;
          const number = step.querySelector('.process-step-number');
          
          // Animate number
          if (number) {
            number.style.transform = 'scale(1.2) rotate(-10deg)';
            setTimeout(() => {
              number.style.transform = 'scale(1) rotate(0)';
              number.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, 400);
          }
          
          // Add highlight effect to content
          const content = step.querySelector('.process-step-content');
          if (content) {
            content.style.boxShadow = 'var(--shadow-md)';
            content.style.transform = 'translateY(-5px)';
            content.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            // Reset after animation
            setTimeout(() => {
              content.style.boxShadow = 'var(--shadow-sm)';
              content.style.transform = 'translateY(0)';
            }, 2000);
          }
          
          // Unobserve after animation
          processObserver.unobserve(step);
        }
      });
    }, { threshold: 0.3 });
    
    // Observe each process step
    processSteps.forEach(step => {
      processObserver.observe(step);
    });
  }
  
  // Animate testimonial spotlight
  const testimonialSection = document.querySelector('.testimonial-spotlight');
  const testimonialQuote = document.querySelector('.testimonial-spotlight-quote');
  
  if (testimonialSection && testimonialQuote) {
    const testimonialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Text reveal animation
          testimonialQuote.style.opacity = '0';
          testimonialQuote.style.transform = 'translateY(30px)';
          
          setTimeout(() => {
            testimonialQuote.style.opacity = '1';
            testimonialQuote.style.transform = 'translateY(0)';
            testimonialQuote.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
          }, 300);
          
          // Add subtle background animation
          testimonialSection.classList.add('animate-bg');
          
          // Unobserve after animation
          testimonialObserver.unobserve(testimonialSection);
        }
      });
    }, { threshold: 0.3 });
    
    // Observe testimonial section
    testimonialObserver.observe(testimonialSection);
  }
}

/**
 * Handle Service Card Flip Animation for Mobile
 * (Touch-specific interaction)
 */
function initMobileCardFlip() {
  // Only run on touch devices
  if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return;
  }
  
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('click', function() {
      const cardInner = this.querySelector('.service-card-inner');
      
      // Toggle flipped state
      if (cardInner.style.transform === 'rotateY(180deg)') {
        cardInner.style.transform = 'rotateY(0deg)';
      } else {
        cardInner.style.transform = 'rotateY(180deg)';
      }
    });
  });
}

// Call mobile card flip initialization
initMobileCardFlip();

/**
 * Add CSS class for animation when elements enter viewport
 */
window.addEventListener('scroll', function() {
  const animatedElements = document.querySelectorAll('.service-card, .stat-box, .process-step');
  
  animatedElements.forEach(element => {
    const position = element.getBoundingClientRect();
    
    // Check if element is in viewport
    if (position.top < window.innerHeight * 0.8 && position.bottom >= 0) {
      element.classList.add('in-view');
    }
  });
});

/**
 * Add pulse animation keyframes dynamically if they don't exist
 */
function addPulseAnimation() {
  if (!document.getElementById('pulse-animation-keyframes')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation-keyframes';
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .pulse-animation {
        animation: pulse 1.5s ease;
      }
      
      /* Add background animation for testimonial section */
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .animate-bg .testimonial-spotlight-overlay {
        background: linear-gradient(270deg, rgba(0, 122, 255, 0.9), rgba(0, 82, 255, 0.9), rgba(122, 0, 255, 0.9));
        background-size: 200% 200%;
        animation: gradientShift 10s ease infinite;
      }
      
      /* Animation for in-view elements */
      .service-card.in-view .service-card-inner {
        box-shadow: var(--shadow-lg);
      }
      
      .stat-box.in-view {
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);
        border-color: var(--primary-light);
      }
    `;
    document.head.appendChild(style);
  }
}

// Add animations on load
addPulseAnimation();
