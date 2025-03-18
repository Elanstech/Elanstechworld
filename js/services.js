/**
 * Elan's Tech World - Services Page JavaScript
 * Enhances the services page with interactive features and animations
 */

/*======================================
  1. CONFIGURATION AND INITIALIZATION
======================================*/

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles for hero section
    initServicesHeroParticles();
    
    // Initialize typed text effect for services hero
    initServicesTypedText();
    
    // Initialize animations
    initServicesSectionAnimations();
    
    // Initialize services carousel
    initServicesCarousel();
    
    // Initialize FAQ accordion functionality
    initServicesFaqAccordion();
    
    // Initialize tilt effect for elements
    initServicesTiltElements();
});

/*======================================
  2. SERVICES HERO SECTION
======================================*/

/**
 * Initialize particles.js for hero background
 */
function initServicesHeroParticles() {
    if (!document.getElementById('particles-js')) return;
    
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
                value: '#ffffff'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
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
                color: '#ffffff',
                opacity: 0.3,
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
}

/**
 * Initialize typed.js for hero section
 */
function initServicesTypedText() {
    const typedElement = document.getElementById('services-typed');
    if (!typedElement) return;
    
    new Typed('#services-typed', {
        strings: [
            'Web Design & Development',
            'Mobile App Development',
            'POS System Implementation',
            'Digital Marketing Strategies',
            'Property Management Systems',
            'Google Ads Management'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

/*======================================
  3. SERVICES CAROUSEL SECTION
======================================*/

/**
 * Services Carousel Initialization
 */
function initServicesCarousel() {
  // Check if services carousel element exists
  const servicesCarousel = document.querySelector('.services-carousel');
  if (!servicesCarousel) return;
  
  // Initialize Swiper for services carousel
  window.servicesSwiper = new Swiper('.services-carousel', {
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: true,
    grabCursor: true,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
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
      // When window width is >= 640px
      640: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      // When window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      // When window width is >= 1024px
      1024: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      // When window width is >= 1280px
      1280: {
        slidesPerView: 3,
        spaceBetween: 50,
      }
    },
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
    on: {
      init: function() {
        animateActiveServices(this);
        initServiceCardEffects();
      },
      slideChange: function() {
        animateActiveServices(this);
      },
      resize: function() {
        // Update swiper on resize
        this.update();
      }
    }
  });
}

/**
 * Animate Active Service Slides
 * @param {Object} swiper - Swiper instance
 */
function animateActiveServices(swiper) {
  // Apply special effects to active and adjacent slides
  const slides = swiper.slides;
  const activeIndex = swiper.activeIndex;
  
  // Reset all slides
  slides.forEach(slide => {
    slide.style.transform = 'scale(0.85)';
    slide.style.opacity = '0.7';
    slide.style.transition = 'all 0.5s ease';
    
    const card = slide.querySelector('.service-card');
    if (card) {
      card.style.boxShadow = 'var(--shadow-md)';
      card.style.transform = 'translateY(0)';
    }
  });
  
  // Animate active slide
  const activeSlide = slides[activeIndex];
  if (activeSlide) {
    activeSlide.style.transform = 'scale(1)';
    activeSlide.style.opacity = '1';
    
    const activeCard = activeSlide.querySelector('.service-card');
    if (activeCard) {
      activeCard.style.boxShadow = 'var(--shadow-lg)';
    }
  }
  
  // Apply subtle effect to adjacent slides
  const prevSlide = slides[swiper.realIndex - 1 < 0 ? slides.length - 1 : swiper.realIndex - 1];
  const nextSlide = slides[swiper.realIndex + 1 >= slides.length ? 0 : swiper.realIndex + 1];
  
  if (prevSlide) {
    prevSlide.style.transform = 'scale(0.9)';
    prevSlide.style.opacity = '0.85';
  }
  
  if (nextSlide) {
    nextSlide.style.transform = 'scale(0.9)';
    nextSlide.style.opacity = '0.85';
  }
}

/**
 * Initialize Service Card Effects
 */
function initServiceCardEffects() {
  const serviceCards = document.querySelectorAll('.services-carousel .service-card');
  
  serviceCards.forEach(card => {
    // 3D tilt effect for cards
    card.addEventListener('mousemove', function(e) {
      // Only apply effect on devices that support hover
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

/*======================================
  4. SECTION ANIMATIONS
======================================*/

/**
 * Initialize animations for various sections
 */
function initServicesSectionAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observe each animated element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Hero section animations
    animateServicesHero();
}

/**
 * Animate services hero section elements
 */
function animateServicesHero() {
    const heroElements = document.querySelectorAll('.services-hero [data-animation="fade-up"]');
    
    if (heroElements.length && window.gsap) {
        gsap.to(heroElements, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.5
        });
    } else {
        // Fallback for when GSAP is not available
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            }, 500 + (index * 100));
        });
    }
}

/*======================================
  5. FAQ SECTIONS
======================================*/

/**
 * Initialize FAQ accordion functionality
 */
function initServicesFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (!question || !answer || !toggle) return;
        
        question.addEventListener('click', () => {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const faqAnswer = faqItem.querySelector('.faq-answer');
                if (faqAnswer) {
                    faqAnswer.style.maxHeight = '0';
                }
                
                const faqToggle = faqItem.querySelector('.faq-toggle');
                if (faqToggle) {
                    faqToggle.innerHTML = '<i class="fas fa-plus"></i>';
                }
            });
            
            // If clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.innerHTML = '<i class="fas fa-minus"></i>';
            }
        });
    });
    
    // Open first FAQ item by default
    if (faqItems.length > 0) {
        setTimeout(() => {
            const firstItem = faqItems[0];
            const firstQuestion = firstItem.querySelector('.faq-question');
            if (firstQuestion) {
                firstQuestion.click();
            }
        }, 1000);
    }
}

/*======================================
  6. TILT EFFECT
======================================*/

/**
 * Initialize tilt effect for elements
 */
function initServicesTiltElements() {
    const tiltElements = document.querySelectorAll('.tilt-element');
    
    if (tiltElements.length && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(tiltElements, {
            max: 8,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
            scale: 1.03,
            gyroscope: true
        });
    }
}
