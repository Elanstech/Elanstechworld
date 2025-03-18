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
  5. ADVANCED HERO SECTION EFFECTS
======================================*/

/*------ 5.1 Particle Background ------*/
class ParticleBackground {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 50 : 80;
    this.mousePosition = { x: null, y: null };
    this.radius = window.innerWidth < 768 ? 1 : 1.5;
    this.isAnimating = true;
    
    this.init();
  }
  
  init() {
    // Set canvas to full width and height
    this.setCanvasDimensions();
    
    // Create particles
    this.createParticles();
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
    
    // Start animation
    this.animate();
  }
  
  setCanvasDimensions() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.particleCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const directionX = (Math.random() - 0.5) * 0.5;
      const directionY = (Math.random() - 0.5) * 0.5;
      const size = Math.random() * 3 + 1;
      const color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
      
      this.particles.push({
        x, y, directionX, directionY, size, color
      });
    }
  }
  
  handleResize() {
    this.setCanvasDimensions();
    this.createParticles();
  }
  
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition.x = e.clientX - rect.left;
    this.mousePosition.y = e.clientY - rect.top;
  }
  
  handleMouseOut() {
    this.mousePosition.x = null;
    this.mousePosition.y = null;
  }
  
  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
      
      // Update particle position
      particle.x += particle.directionX;
      particle.y += particle.directionY;
      
      // Bounce off walls
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.directionX = -particle.directionX;
      }
      
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.directionY = -particle.directionY;
      }
      
      // Mouse interaction
      if (this.mousePosition.x !== null && this.mousePosition.y !== null) {
        const dx = this.mousePosition.x - particle.x;
        const dy = this.mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const pushForce = (100 - distance) / 1500;
          
          particle.x -= Math.cos(angle) * pushForce;
          particle.y -= Math.sin(angle) * pushForce;
        }
      }
    }
    
    this.connectParticles();
  }
  
  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${(150 - distance) / 750})`;
          this.ctx.lineWidth = this.radius / 3;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  animate() {
    if (this.isAnimating) {
      this.drawParticles();
      requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  stop() {
    this.isAnimating = false;
  }
}

/*------ 5.2 3D Parallax Effects ------*/
class ParallaxEffect {
  constructor() {
    this.shapes = document.querySelectorAll('.about-hero-shape');
    this.heroSection = document.querySelector('.about-hero-section');
    
    if (!this.shapes.length || !this.heroSection) return;
    
    this.init();
  }
  
  init() {
    // Add parallax effect on mouse move
    this.heroSection.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Add scroll effect
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }
  
  handleMouseMove(e) {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate mouse position relative to center
    const posX = (clientX - centerX) / centerX;
    const posY = (clientY - centerY) / centerY;
    
    // Apply transform to shapes
    this.shapes.forEach((shape, index) => {
      const depth = (index + 1) * 50; // Different depth for each shape
      const translateX = posX * depth;
      const translateY = posY * depth;
      
      // Apply transform with transitions
      if (window.gsap) {
        gsap.to(shape, {
          x: translateX,
          y: translateY,
          rotation: posX * posY * 10,
          duration: 1,
          ease: "power2.out"
        });
      } else {
        shape.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${posX * posY * 10}deg)`;
        shape.style.transition = 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)';
      }
    });
  }
  
  handleScroll() {
    const scrollTop = window.scrollY;
    
    this.shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.1;
      const yPos = scrollTop * speed;
      
      // Add scroll-based parallax
      if (window.gsap) {
        gsap.to(shape, {
          y: yPos,
          duration: 0.5,
          ease: "power1.out"
        });
      } else {
        const currentTransform = shape.style.transform || '';
        // Extract existing translate values or set to 0
        const translateX = currentTransform.includes('translate3d') 
          ? parseFloat(currentTransform.split('translate3d(')[1].split('px')[0]) 
          : 0;
        
        shape.style.transform = `translate3d(${translateX}px, ${yPos}px, 0)`;
      }
    });
  }
}

/*------ 5.3 Text Typing Animation ------*/
class TypingAnimation {
  constructor() {
    this.typingTextElement = document.getElementById('typing-text');
    if (!this.typingTextElement) return;
    
    this.words = ['Designers', 'Developers', 'Innovators', 'Problem Solvers', 'Tech Experts'];
    this.currentWordIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.typingSpeed = 100; // base typing speed
    
    this.init();
  }
  
  init() {
    this.type();
  }
  
  type() {
    // Current word being processed
    const currentWord = this.words[this.currentWordIndex];
    
    // Set typing speed based on state
    let speed = this.typingSpeed;
    
    if (this.isDeleting) {
      // Faster when deleting
      speed = this.typingSpeed / 2;
    } else if (this.currentCharIndex === currentWord.length) {
      // Pause at end of word
      speed = this.typingSpeed * 3;
    }
    
    // Add or remove characters
    if (this.isDeleting) {
      // Remove character
      this.typingTextElement.textContent = currentWord.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      // Add character
      this.typingTextElement.textContent = currentWord.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }
    
    // If completed typing current word
    if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
      // Start deleting after pause
      this.isDeleting = true;
      speed = this.typingSpeed * 3; // Pause before deleting
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      // Move to next word after deleting
      this.isDeleting = false;
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
    }
    
    // Continue the animation
    setTimeout(() => this.type(), speed);
  }
}

/*------ 5.4 Interactive Tech Icons ------*/
class TechIcons {
  constructor() {
    this.techIconsWrapper = document.querySelector('.tech-icons-wrapper');
    this.techIcons = document.querySelectorAll('.tech-icon');
    if (!this.techIconsWrapper || !this.techIcons.length) return;
    
    this.isSpinning = true;
    this.rotationSpeed = 20; // seconds for full rotation
    
    this.init();
  }
  
  init() {
    // Set rotation for each icon
    this.techIcons.forEach((icon, index) => {
      const rotation = (360 / this.techIcons.length) * index;
      icon.style.setProperty('--rotation', `${rotation}deg`);
    });
    
    // Pause rotation on hover
    this.techIconsWrapper.addEventListener('mouseenter', this.pauseAnimation.bind(this));
    this.techIconsWrapper.addEventListener('mouseleave', this.resumeAnimation.bind(this));
    
    // Add click handlers for icons
    this.techIcons.forEach(icon => {
      icon.addEventListener('click', this.handleIconClick.bind(this));
    });
  }
  
  pauseAnimation() {
    this.techIconsWrapper.style.animationPlayState = 'paused';
  }
  
  resumeAnimation() {
    this.techIconsWrapper.style.animationPlayState = 'running';
  }
  
  handleIconClick(e) {
    const icon = e.currentTarget;
    // Add pulse animation on click
    icon.classList.add('icon-pulse');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      icon.classList.remove('icon-pulse');
    }, 500);
  }
}

/**
 * Initialize advanced hero section effects
 */
function initHeroEffects() {
  // Initialize particle background
  const particleBackground = new ParticleBackground();
  
  // Initialize parallax effects
  const parallaxEffect = new ParallaxEffect();
  
  // Initialize typing animation
  const typingAnimation = new TypingAnimation();
  
  // Initialize tech icons
  const techIcons = new TechIcons();
  
  // Add dynamic class to body for Hero section
  document.body.classList.add('has-advanced-hero');
  
  // Optimize performance on scroll
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        // Use page scroll % to adjust hero elements
        const scrollPercent = Math.min(window.scrollY / window.innerHeight, 1);
        const heroContent = document.querySelector('.about-hero-content');
        
        if (heroContent) {
          // Fade out content as user scrolls
          heroContent.style.opacity = Math.max(1 - scrollPercent * 1.5, 0);
          heroContent.style.transform = `translateY(${scrollPercent * 50}px)`;
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

/*======================================
  6. ORIGINAL PARALLAX EFFECTS FOR ABOUT HERO
======================================*/
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
  7. SCROLL ANIMATIONS AND EFFECTS
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
  8. INITIALIZATION
======================================*/

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize advanced hero section effects
  initHeroEffects();
  
  // Initialize other animation effects
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
