/**
 * Elan's Tech World - About Page JavaScript
 * Modern animations and interactions
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all sections and animations
  initAnimations();
  initParticles();
  initTypingEffect();
  initSkillsAnimation();
  handleScrollEvents();
});

/**
 * Initialize animations with AOS-like scroll animations
 */
function initAnimations() {
  // Create a custom AOS (Animate on Scroll) functionality
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    rootMargin: '0px',
    threshold: 0.15 // 15% of the element must be visible
  });
  
  // Observe all elements with data-aos attribute
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Initialize particles background
 */
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#007aff'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          },
          polygon: {
            nb_sides: 5
          }
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#007aff',
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.8
            }
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  } else {
    console.warn('particles.js is not loaded');
  }
}

/**
 * Initialize typing effect in the hero section
 */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  
  if (!typingElement) return;
  
  // Words to type
  const words = ['Innovators', 'Problem Solvers', 'Tech Enthusiasts', 'Digital Creators'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentWord = '';
  
  function typeEffect() {
    // Current word
    currentWord = words[wordIndex];
    
    // Set typing speed based on action (typing or deleting)
    const typingSpeed = isDeleting ? 80 : 120;
    
    // Update text
    if (!isDeleting) {
      // Typing
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      
      // If word is complete
      if (charIndex === currentWord.length) {
        // Pause at end of word
        isDeleting = true;
        setTimeout(typeEffect, 1500);
        return;
      }
    } else {
      // Deleting
      typingElement.textContent = currentWord.substring(0, charIndex);
      charIndex--;
      
      // If deletion is complete
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    
    // Schedule next iteration
    setTimeout(typeEffect, typingSpeed);
  }
  
  // Start typing effect
  setTimeout(typeEffect, 1000);
}

/**
 * Animate skills progress bars when they come into view
 */
function initSkillsAnimation() {
  const progressBars = document.querySelectorAll('.skill-progress-bar');
  
  if (!progressBars.length) return;
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const width = progressBar.dataset.width || '0%';
        
        // Animate the progress bar width
        setTimeout(() => {
          progressBar.style.width = width;
        }, 300);
        
        // Stop observing once animated
        observer.unobserve(progressBar);
      }
    });
  }, {
    threshold: 0.2
  });
  
  // Observe each progress bar
  progressBars.forEach(bar => {
    observer.observe(bar);
  });
}

/**
 * Handle scroll events for parallax and other effects
 */
function handleScrollEvents() {
  const header = document.querySelector('.header');
  const heroSection = document.querySelector('.about-hero-section');
  const floatingShapes = document.querySelectorAll('.floating-shape');
  
  // Update on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Header transformation
    if (header && scrollY > 50) {
      header.classList.add('scrolled');
    } else if (header) {
      header.classList.remove('scrolled');
    }
    
    // Parallax effect for hero section
    if (heroSection) {
      const parallaxIntensity = 0.5;
      heroSection.style.backgroundPositionY = `${scrollY * parallaxIntensity}px`;
    }
    
    // Floating shapes parallax
    if (floatingShapes.length) {
      floatingShapes.forEach((shape, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const speed = 0.05 + (index * 0.01);
        shape.style.transform = `translateY(${scrollY * speed * direction}px)`;
      });
    }
  });
  
  // Initialize tilt effect for cards
  initTiltEffect();
}

/**
 * Initialize tilt effect for cards
 */
function initTiltEffect() {
  // Check if VanillaTilt is available
  if (typeof VanillaTilt !== 'undefined') {
    // Apply tilt effect to cards
    VanillaTilt.init(document.querySelectorAll('.mission-card, .value-card, .benefit-card'), {
      max: 5,
      speed: 400,
      glare: true,
      'max-glare': 0.1,
      gyroscope: true
    });
  } else {
    console.warn('VanillaTilt.js is not loaded');
  }
}

/**
 * Modern timeline animations
 */
function animateTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineProgress = document.querySelector('.timeline-progress');
  
  // Set initial state
  gsap.set(timelineItems, { opacity: 0, y: 50 });
  
  // Create scroll trigger for each item
  timelineItems.forEach((item, index) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'bottom 60%',
        toggleActions: 'play none none reverse'
      },
      delay: index * 0.2
    });
  });
  
  // Animate timeline progress line
  if (timelineProgress) {
    gsap.to(timelineProgress, {
      height: '100%',
      duration: 2,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.modern-timeline',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      }
    });
  }
}

// Initialize GSAP animations if available
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Execute after initial load
  window.addEventListener('load', () => {
    animateTimeline();
  });
} else {
  console.warn('GSAP or ScrollTrigger is not loaded');
}
