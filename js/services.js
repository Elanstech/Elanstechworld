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
          statBox.classList.add('pulse-animation
