// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initPreloader();
  initHeaderScroll();
  initMobileMenu();
  initHeroVideo();
  initMouseFollowEffect();
  initScrollAnimations();
  initCounterAnimation();
  initTiltEffect();
  initAOS();
  initClientCarousel();
  initTestimonialSlider();
  initWorkFilter();
  initBackToTop();
  initSmoothScrolling();
  initFormValidation();
  handleNavLinks();
});

// ===== Preloader =====
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  });
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  function toggleScrollClass() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Check on initial load
  toggleScrollClass();

  // Throttle the scroll event
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        toggleScrollClass();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;
  
  if (!hamburger || !mobileMenu) return;

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.classList.toggle('no-scroll');
  });

  // Close mobile menu when clicking on links
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
    });
  });

  // Close mobile menu on window resize (if desktop view)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('active') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
    }
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
    }
  });
}

// ===== Enhanced Hero Video Background =====
function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  // Ensure video plays on mobile
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.muted = true;
  
  // Add a slight delay before playing to ensure proper loading
  setTimeout(() => {
    video.play().catch(error => {
      console.error('Video play error:', error);
      
      // Fallback to image if video fails to play
      if (video.parentElement) {
        const fallbackImage = document.createElement('img');
        fallbackImage.src = video.getAttribute('poster');
        fallbackImage.className = 'hero-video fallback';
        fallbackImage.alt = "Hero Background";
        video.parentElement.appendChild(fallbackImage);
      }
    });
  }, 300);

  // Optimize video playback based on visibility
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(err => console.log(err));
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(heroSection);

  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      video.pause();
    } else {
      if (isElementInViewport(heroSection)) {
        video.play().catch(err => console.log(err));
      }
    }
  });

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
}

// ===== Mouse Follow Effect =====
function initMouseFollowEffect() {
  const mouseFollowCircle = document.querySelector('.mouse-follow-circle');
  const heroSection = document.querySelector('.hero');
  
  if (!mouseFollowCircle || !heroSection) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let circleX = 0;
  let circleY = 0;
  
  // Only activate in hero section
  heroSection.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Show the effect when mouse moves in hero section
    mouseFollowCircle.style.opacity = '1';
  });
  
  heroSection.addEventListener('mouseleave', () => {
    // Hide the effect when mouse leaves hero section
    mouseFollowCircle.style.opacity = '0';
  });
  
  // Smooth animation using requestAnimationFrame
  function animateCircle() {
    // Ease animation - follow mouse with delay
    circleX += (mouseX - circleX) * 0.1;
    circleY += (mouseY - circleY) * 0.1;
    
    if (mouseFollowCircle) {
      mouseFollowCircle.style.left = `${circleX}px`;
      mouseFollowCircle.style.top = `${circleY}px`;
    }
    
    requestAnimationFrame(animateCircle);
  }
  
  animateCircle();
}

// ===== Scroll Animations for Hero =====
function initScrollAnimations() {
  const heroTitle = document.querySelector('.hero-title');
  const titleEmphasis = document.querySelector('.title-emphasis');
  
  if (!heroTitle) return;
  
  // Dynamic effects based on scroll position
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    const scrollPercentage = Math.min(scrollPosition / (heroHeight * 0.5), 1);
    
    // Subtle parallax effect
    if (heroTitle) {
      heroTitle.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }
    
    // Fade out content based on scroll
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = 1 - scrollPercentage * 0.7;
    }
  });
}

// ===== Number Counter Animation =====
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  const counterOptions = {
    threshold: 0.5
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = Math.ceil(target / (duration / 30)); // Update roughly every 30ms
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(interval);
          } else {
            counter.textContent = current;
          }
        };
        
        const interval = setInterval(updateCounter, 30);
        
        // Unobserve after animation starts
        counterObserver.unobserve(counter);
      }
    });
  }, counterOptions);
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// ===== Tilt Effect for Stat Cards =====
function initTiltEffect() {
  // Check if VanillaTilt is already available
  if (typeof VanillaTilt !== 'undefined') {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (tiltElements.length) {
      VanillaTilt.init(tiltElements, {
        max: 10,
        speed: 300,
        glare: true,
        "max-glare": 0.3
      });
    }
  }
}

// ===== AOS Animations =====
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100,
      disable: 'mobile'
    });

    // Refresh AOS on window resize
    window.addEventListener('resize', () => {
      AOS.refresh();
    });
  }
}

// ===== Client Logo Carousel =====
function initClientCarousel() {
  const carouselContainer = document.querySelector('.clients-carousel-container');
  if (!carouselContainer) return;

  // Function to adjust animation speed based on screen width and logo count
  function adjustCarouselSpeed() {
    const carousels = document.querySelectorAll('.clients-carousel');
    const screenWidth = window.innerWidth;
    const logoCount = document.querySelectorAll('.clients-carousel:first-child .client-logo').length;
    
    // Adjust speed based on both screen width and number of logos
    let baseDuration = logoCount * 4; // 4 seconds per logo as base duration
    
    let duration;
    if (screenWidth < 480) {
      duration = `${baseDuration * 0.7}s`; // Faster on smallest screens
    } else if (screenWidth < 768) {
      duration = `${baseDuration * 0.85}s`; // Medium speed on tablets
    } else {
      duration = `${baseDuration}s`; // Normal speed on desktops
    }
    
    carousels.forEach(carousel => {
      carousel.style.animationDuration = duration;
    });
  }

  // Pause animation when not in viewport to save resources
  function handleVisibility() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const carousels = entry.target.querySelectorAll('.clients-carousel');
        
        if (entry.isIntersecting) {
          carousels.forEach(carousel => {
            carousel.style.animationPlayState = 'running';
          });
        } else {
          carousels.forEach(carousel => {
            carousel.style.animationPlayState = 'paused';
          });
        }
      });
    }, { threshold: 0.1 });

    observer.observe(carouselContainer);
  }

  // Add touch events for mobile to pause/play on touch
  function addTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    const carousels = document.querySelectorAll('.clients-carousel');
    
    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      carousels.forEach(carousel => {
        carousel.style.animationPlayState = 'paused';
      });
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      
      // Resume animation after touch
      carousels.forEach(carousel => {
        carousel.style.animationPlayState = 'running';
      });
    });
  }

  // Initialize all carousel functionality
  adjustCarouselSpeed();
  handleVisibility();
  addTouchEvents();

  // Update on window resize
  window.addEventListener('resize', adjustCarouselSpeed);
}

// ===== Testimonial Slider =====
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-nav-prev');
  const nextBtn = document.querySelector('.testimonial-nav-next');
  
  if (!slides.length || !dots.length) return;

  let currentSlide = 0;
  let slideInterval;
  const autoSlideTime = 5000; // 5 seconds

  // Show current slide and update dots
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
      slide.style.display = 'none';
    });

    // Remove active class from all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });

    // Show current slide and activate corresponding dot
    slides[index].style.display = 'block';
    dots[index].classList.add('active');
    currentSlide = index;
  }

  // Initialize slider
  showSlide(currentSlide);

  // Start auto-sliding
  function startAutoSlide() {
    slideInterval = setInterval(() => {
      nextSlide();
    }, autoSlideTime);
  }

  // Stop auto-sliding
  function stopAutoSlide() {
    clearInterval(slideInterval);
  }

  // Next slide function
  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) {
      next = 0;
    }
    showSlide(next);
  }

  // Previous slide function
  function prevSlide() {
    let prev = currentSlide - 1;
    if (prev < 0) {
      prev = slides.length - 1;
    }
    showSlide(prev);
  }

  // Add event listeners to navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });
  }

  // Add event listeners to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      showSlide(index);
      startAutoSlide();
    });
  });

  // Start auto-sliding
  startAutoSlide();

  // Pause auto-slide on hover
  const testimonialSection = document.querySelector('.testimonials-section');
  if (testimonialSection) {
    testimonialSection.addEventListener('mouseenter', stopAutoSlide);
    testimonialSection.addEventListener('mouseleave', startAutoSlide);
  }

  // Pause when page is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
  });

  // Handle touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slides.forEach(slide => {
    slide.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slide.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    });
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe left
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe right
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    }
  }
}

// ===== Work/Portfolio Filtering =====
function initWorkFilter() {
  const filterButtons = document.querySelectorAll('.work-filter');
  const workItems = document.querySelectorAll('.work-item');
  
  if (!filterButtons.length || !workItems.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter work items
      workItems.forEach(item => {
        if (filterValue === 'all') {
          item.style.display = 'block';
        } else {
          if (item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        }
      });
    });
  });
}

// ===== Back to Top Button =====
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });
  
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== Smooth Scrolling =====
function initSmoothScrolling() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate header height for offset
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: targetPosition - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== Contact Form Validation =====
function initFormValidation() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Simple validation
    let isValid = true;
    
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name');
      isValid = false;
    } else {
      removeError(nameInput);
    }
    
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Please enter your email');
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email');
      isValid = false;
    } else {
      removeError(emailInput);
    }
    
    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please enter your message');
      isValid = false;
    } else {
      removeError(messageInput);
    }
    
    if (isValid) {
      // Submit form or perform AJAX request here
      // For demo, just show success message
      const formSubmitBtn = contactForm.querySelector('.form-submit');
      const originalText = formSubmitBtn.textContent;
      
      formSubmitBtn.disabled = true;
      formSubmitBtn.textContent = 'Sending...';
      
      // Simulate AJAX request
      setTimeout(() => {
        // Success message
        contactForm.innerHTML = `
          <div class="form-success">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you soon.</p>
          </div>
        `;
      }, 1500);
    }
  });
  
  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    if (!formGroup.querySelector('.error-message')) {
      errorElement.className = 'error-message';
      errorElement.style.color = 'red';
      errorElement.style.fontSize = '0.875rem';
      errorElement.style.marginTop = '0.25rem';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.style.borderColor = 'red';
  }
  
  function removeError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      formGroup.removeChild(errorElement);
    }
    
    input.style.borderColor = '';
  }
  
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

// ===== Handle active nav links based on scroll position =====
function handleNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  if (!sections.length || !navLinks.length) return;
  
  // Throttle scroll event
  window.addEventListener('scroll', throttle(() => {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, 100));
}

// ===== Utility Functions =====

// Throttle function to limit function calls
function throttle(callback, delay = 200) {
  let isThrottled = false;
  
  return function(...args) {
    if (isThrottled) return;
    
    isThrottled = true;
    callback.apply(this, args);
    
    setTimeout(() => {
      isThrottled = false;
    }, delay);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}
