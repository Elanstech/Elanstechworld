/**
 * Elan's Tech World - About Page JavaScript
 * Extends main script.js with About page specific functionality
 */

/*======================================
  1. TIMELINE ANIMATIONS
======================================*/

/**
 * Animate timeline elements when they come into view
 */
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (!timelineItems.length) return;
  
  // Create intersection observer for animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        
        // Add staggered animation to timeline elements
        setTimeout(() => {
          const card = entry.target.querySelector('.timeline-card');
          const marker = entry.target.querySelector('.timeline-marker');
          const year = entry.target.querySelector('.timeline-year');
          const title = entry.target.querySelector('.timeline-title');
          
          if (window.gsap) {
            if (marker) gsap.to(marker, { scale: 1.2, duration: 0.5, ease: 'back.out(1.7)' });
            if (year) gsap.to(year, { scale: 1.1, duration: 0.5, ease: 'back.out(1.7)' });
            if (title) gsap.to(title, { x: 10, opacity: 1, duration: 0.5, delay: 0.2 });
            
            setTimeout(() => {
              if (marker) gsap.to(marker, { scale: 1, duration: 0.3 });
              if (year) gsap.to(year, { scale: 1, duration: 0.3 });
              if (title) gsap.to(title, { x: 0, duration: 0.3 });
            }, 600);
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
  
  // Observe each timeline item
  timelineItems.forEach(item => {
    observer.observe(item);
  });
}

/*======================================
  2. SKILL BARS ANIMATION
======================================*/

/**
 * Animate skill bars when they come into view
 */
function initSkillBars() {
  const skillsContainer = document.querySelector('.skills-container');
  
  if (!skillsContainer) return;
  
  const skillBars = skillsContainer.querySelectorAll('.skill-progress');
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Initialize skill bar animations
      skillBars.forEach((bar, index) => {
        const percentage = bar.classList.contains('web') ? '95%' : 
                          bar.classList.contains('mobile') ? '90%' : 
                          bar.classList.contains('pos') ? '92%' : 
                          bar.classList.contains('uiux') ? '88%' : 
                          bar.classList.contains('cloud') ? '85%' : '0%';
        
        // Use GSAP if available for smoother animation
        if (window.gsap) {
          gsap.fromTo(bar, 
            { width: '0%' }, 
            { 
              width: percentage, 
              duration: 1.5, 
              delay: index * 0.2,
              ease: 'power2.out'
            }
          );
        } else {
          // Fallback animation
          bar.style.width = '0%';
          
          setTimeout(() => {
            bar.style.width = percentage;
            bar.style.transition = 'width 1.5s ease-in-out';
          }, index * 200);
        }
      });
      
      // Stop observing after animation
      observer.unobserve(skillsContainer);
    }
  }, { threshold: 0.5 });
  
  // Start observing the skills container
  observer.observe(skillsContainer);
}

/*======================================
  3. GALLERY EFFECTS
======================================*/

/**
 * Initialize gallery effects
 */
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (!galleryItems.length) return;
  
  galleryItems.forEach(item => {
    // 3D hover effect
    item.addEventListener('mousemove', function(e) {
      if (window.matchMedia('(hover: hover)').matches) {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate percentage position
        const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
        const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1
        
        // Apply subtle rotation (max 5 degrees)
        if (window.gsap) {
          gsap.to(item, {
            rotationY: xPercent * 5,
            rotationX: yPercent * -5,
            duration: 0.5,
            ease: 'power1.out'
          });
        } else {
          item.style.transform = `perspective(1000px) rotateY(${xPercent * 5}deg) rotateX(${yPercent * -5}deg) translateY(-5px)`;
          item.style.transition = 'transform 0.5s ease';
        }
      }
    });
    
    // Reset on mouse leave
    item.addEventListener('mouseleave', function() {
      if (window.matchMedia('(hover: hover)').matches) {
        if (window.gsap) {
          gsap.to(item, {
            rotationY: 0,
            rotationX: 0,
            y: 0,
            duration: 0.5,
            ease: 'power1.out'
          });
        } else {
          item.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
          item.style.transition = 'transform 0.5s ease';
        }
      }
    });
    
    // Lightbox functionality
    item.addEventListener('click', function() {
      const imgSrc = item.querySelector('img').src;
      const caption = item.querySelector('.gallery-caption')?.textContent || '';
      
      showLightbox(imgSrc, caption);
    });
  });
}

/**
 * Show lightbox with image
 */
function showLightbox(imgSrc, caption) {
  // Create lightbox element if it doesn't exist
  let lightbox = document.getElementById('gallery-lightbox');
  
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">
          <i class="fas fa-times"></i>
        </button>
        <img src="" alt="" class="lightbox-image">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .gallery-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      
      .gallery-lightbox.active {
        opacity: 1;
        visibility: visible;
      }
      
      .lightbox-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
      }
      
      .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: scale(0.9);
        transition: transform 0.3s ease;
      }
      
      .gallery-lightbox.active .lightbox-content {
        transform: scale(1);
      }
      
      .lightbox-image {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 4px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      }
      
      .lightbox-caption {
        margin-top: 1rem;
        color: white;
        font-size: 1rem;
        font-weight: 500;
      }
      
      .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .lightbox-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
      }
    `;
    document.head.appendChild(style);
    
    // Add event listeners
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
  
  // Update lightbox content
  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  
  lightboxImg.src = imgSrc;
  lightboxCaption.textContent = caption;
  
  // Show lightbox
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/*======================================
  4. POSITION CARDS EFFECTS
======================================*/

/**
 * Initialize position cards effects
 */
function initPositionCards() {
  const positionCards = document.querySelectorAll('.position-card');
  
  if (!positionCards.length) return;
  
  positionCards.forEach(card => {
    // 3D hover effect
    card.addEventListener('mousemove', function(e) {
      if (window.matchMedia('(hover: hover)').matches) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate percentage position
        const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
        const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1
        
        // Apply subtle rotation (max 2 degrees)
        if (window.gsap) {
          gsap.to(card, {
            rotationY: xPercent * 2,
            rotationX: yPercent * -2,
            duration: 0.3,
            ease: 'power1.out'
          });
        } else {
          card.style.transform = `perspective(1000px) rotateY(${xPercent * 2}deg) rotateX(${yPercent * -2}deg) translateY(-5px)`;
          card.style.transition = 'transform 0.3s ease';
        }
        
        // Move arrow
        const arrow = card.querySelector('.position-arrow');
        if (arrow) {
          if (window.gsap) {
            gsap.to(arrow, {
              x: xPercent * 5,
              y: yPercent * 5,
              duration: 0.3,
              ease: 'power1.out'
            });
          } else {
            arrow.style.transform = `translate(${xPercent * 5}px, ${yPercent * 5}px)`;
            arrow.style.transition = 'transform 0.3s ease';
          }
        }
      }
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', function() {
      if (window.matchMedia('(hover: hover)').matches) {
        if (window.gsap) {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.3,
            ease: 'power1.out'
          });
          
          const arrow = card.querySelector('.position-arrow');
          if (arrow) {
            gsap.to(arrow, {
              x: 0,
              y: 0,
              duration: 0.3,
              ease: 'power1.out'
            });
          }
        } else {
          card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(-5px)';
          
          const arrow = card.querySelector('.position-arrow');
          if (arrow) {
            arrow.style.transform = 'translate(0, 0)';
          }
        }
      }
    });
  });
}

/*======================================
  5. PARALLAX EFFECTS FOR ABOUT HERO
======================================*/

/**
 * Initialize parallax effects for the hero section
 */
function initParallax() {
  const heroShapes = document.querySelectorAll('.about-hero-shape');
  
  if (!heroShapes.length || !window.gsap || !window.ScrollTrigger) return;
  
  gsap.to('.about-hero-shape.shape-1', {
    y: 100,
    scrollTrigger: {
      trigger: '.about-hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  gsap.to('.about-hero-shape.shape-2', {
    y: 150,
    scrollTrigger: {
      trigger: '.about-hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  gsap.to('.about-hero-shape.shape-3', {
    y: 80,
    scrollTrigger: {
      trigger: '.about-hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/*======================================
  6. SCROLL ANIMATIONS AND EFFECTS
======================================*/

/**
 * Initialize scroll-based animations for various sections
 */
function initScrollAnimations() {
  // Timeline section animation
  animateOnScroll('.timeline-item', 'fade-up');
  
  // Mission & Values section animation
  animateOnScroll('.mission-card', 'fade-up');
  animateOnScroll('.value-card', 'fade-up', 0.1);
  
  // Team section animation
  animateOnScroll('.team-member', 'fade-up', 0.1);
  
  // Expertise section animation
  animateOnScroll('.expertise-item', 'fade-up', 0.1);
  
  // Gallery section animation
  animateOnScroll('.gallery-item', 'fade-up', 0.1);
  
  // Join Team section animation
  animateOnScroll('.benefit-item', 'fade-up', 0.1);
  animateOnScroll('.position-card', 'fade-up', 0.1);
}

/**
 * Helper function for scroll-based animations
 */
function animateOnScroll(selector, animationType, staggerDelay = 0) {
  const elements = document.querySelectorAll(selector);
  
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add animation with staggered delay
        setTimeout(() => {
          if (window.gsap) {
            switch (animationType) {
              case 'fade-up':
                gsap.to(entry.target, {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: 'power2.out'
                });
                break;
              case 'fade-in':
                gsap.to(entry.target, {
                  opacity: 1,
                  duration: 0.6,
                  ease: 'power2.out'
                });
                break;
              default:
                entry.target.classList.add('animated');
            }
          } else {
            // Fallback for non-GSAP browsers
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          }
        }, index * (staggerDelay * 1000));
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Set initial styles and observe elements
  elements.forEach(element => {
    if (window.gsap) {
      switch (animationType) {
        case 'fade-up':
          gsap.set(element, { opacity: 0, y: 30 });
          break;
        case 'fade-in':
          gsap.set(element, { opacity: 0 });
          break;
      }
    } else {
      // Fallback for non-GSAP browsers
      element.style.opacity = '0';
      
      if (animationType === 'fade-up') {
        element.style.transform = 'translateY(30px)';
      }
    }
    
    observer.observe(element);
  });
}

/*======================================
  7. INITIALIZATION
======================================*/

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize animation effects
  initTimelineAnimations();
  initSkillBars();
  initGallery();
  initPositionCards();
  initParallax();
  initScrollAnimations();
  
  // Set up pre-animation styles for elements
  const animatedElements = document.querySelectorAll('.mission-card, .value-card, .team-member, .expertise-item, .gallery-item, .benefit-item, .position-card');
  
  if (window.gsap) {
    gsap.set(animatedElements, { opacity: 0, y: 30 });
  } else {
    animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
    });
  }
});

// When window is fully loaded
window.addEventListener('load', function() {
  // Reinitialize animations after page is fully loaded
  initTimelineAnimations();
  initSkillBars();
});
