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
  initTestimonials(); // Updated testimonials function
  initBackToTop();
  initSmoothScrolling();
  initFormValidation();
  handleNavLinks();
  initFeaturedProjects(); // Projects section
});

// ===== Preloader =====
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  
  // Helper function to hide preloader
  function hidePreloader() {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      document.body.classList.remove('no-scroll');
    }, 500);
  }

  // Hide preloader when window is loaded
  if (document.readyState === 'complete') {
    // Document already loaded, hide immediately
    hidePreloader();
  } else {
    // Set a maximum wait time (failsafe)
    const maxWaitTime = setTimeout(() => {
      hidePreloader();
    }, 3000);

    // Normal load handler
    window.addEventListener('load', () => {
      clearTimeout(maxWaitTime);
      hidePreloader();
    });
  }
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
    
    // Update ARIA attributes
    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
  });

  // Close mobile menu when clicking on links
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu on window resize (if desktop view)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
      hamburger.setAttribute('aria-expanded', 'false');
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
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('no-scroll');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== Enhanced Hero Video Background =====
function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Ensure video plays on mobile devices
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.muted = true;
  
  // Add a slight delay before playing to ensure proper loading
  setTimeout(() => {
    // For mobile devices, first check if the poster is loaded
    if (isMobile && video.poster) {
      const img = new Image();
      img.src = video.poster;
      img.onload = () => {
        playVideo();
      };
      // Fallback if poster loading fails
      setTimeout(playVideo, 500);
    } else {
      playVideo();
    }
  }, 300);

  function playVideo() {
    video.play().catch(error => {
      console.log('Video play error:', error);
      
      // Only create a fallback image if it doesn't already exist
      if (!document.querySelector('.hero-video.fallback') && video.poster) {
        const fallbackImage = document.createElement('img');
        fallbackImage.src = video.poster;
        fallbackImage.className = 'hero-video fallback';
        fallbackImage.alt = "Hero Background";
        
        if (video.parentElement) {
          video.parentElement.appendChild(fallbackImage);
          video.style.display = 'none';
        }
      }
    });
  }

  // Optimize video playback based on visibility
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  // Use Intersection Observer to detect when hero is in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (video.paused) {
          video.play().catch(err => console.log('Autoplay prevented:', err));
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
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
        video.play().catch(err => console.log('Autoplay prevented:', err));
      }
    }
  });
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

// ===== Mouse Follow Effect =====
function initMouseFollowEffect() {
  const mouseFollowCircle = document.querySelector('.mouse-follow-circle');
  const heroSection = document.querySelector('.hero');
  
  if (!mouseFollowCircle || !heroSection) return;
  
  // Skip on mobile devices
  if (window.innerWidth < 992) return;

  let mouseX = 0;
  let mouseY = 0;
  let circleX = 0;
  let circleY = 0;
  let animationFrameId;
  
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
    
    animationFrameId = requestAnimationFrame(animateCircle);
  }
  
  animateCircle();

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
}

// ===== Scroll Animations for Hero =====
function initScrollAnimations() {
  const heroTitle = document.querySelector('.hero-title');
  const heroContent = document.querySelector('.hero-content');
  
  if (!heroTitle || !heroContent) return;
  
  // Throttle the scroll function
  let ticking = false;
  
  // Dynamic effects based on scroll position
  function updateOnScroll() {
    const scrollPosition = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    const scrollPercentage = Math.min(scrollPosition / (heroHeight * 0.5), 1);
    
    // Subtle parallax effect
    if (heroTitle) {
      heroTitle.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }
    
    // Fade out content based on scroll
    if (heroContent) {
      heroContent.style.opacity = 1 - scrollPercentage * 0.7;
    }
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ===== Number Counter Animation =====
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  const counterOptions = {
    threshold: 0.5,
    rootMargin: "0px"
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
  // Check if VanillaTilt is available
  if (typeof VanillaTilt === 'undefined') {
    console.log('VanillaTilt library not loaded');
    return;
  }
  
  const tiltElements = document.querySelectorAll('[data-tilt]');
  
  if (tiltElements.length) {
    // Only initialize on desktop, skips mobile
    if (window.innerWidth > 992) {
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
  if (typeof AOS === 'undefined') {
    console.log('AOS library not loaded');
    return;
  }
  
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true,
    offset: 100,
    disable: window.innerWidth < 768 ? true : false
  });

  // Refresh AOS on window resize
  window.addEventListener('resize', () => {
    AOS.refresh();
  });
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
    const carousels = document.querySelectorAll('.clients-carousel');
    
    carouselContainer.addEventListener('touchstart', () => {
      carousels.forEach(carousel => {
        carousel.style.animationPlayState = 'paused';
      });
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', () => {
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

// ===== Testimonials Section =====
function initTestimonials() {
  // Elements
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const indicators = document.querySelectorAll('.testimonial-indicator');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  
  // Skip if elements don't exist
  if (!testimonialCards.length || !indicators.length) return;
  
  // Variables
  let currentIndex = 0;
  let testimonialInterval;
  const autoPlayDelay = 5000; // 5 seconds
  
  // Initialize
  updateTestimonials();
  startAutoPlay();
  
  // Add event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showPrevTestimonial();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showNextTestimonial();
    });
  }
  
  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const index = parseInt(indicator.getAttribute('data-index'));
      goToTestimonial(index);
    });
    
    // Add keyboard accessibility
    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const index = parseInt(indicator.getAttribute('data-index'));
        goToTestimonial(index);
      }
    });
  });
  
  // Stop autoplay on hover
  const testimonialsContainer = document.querySelector('.testimonials-container');
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener('mouseenter', stopAutoPlay);
    testimonialsContainer.addEventListener('mouseleave', startAutoPlay);
  }
  
  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;
  
  testimonialCards.forEach(card => {
    card.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    card.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  });
  
  function handleSwipe() {
    const minSwipeDistance = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (swipeDistance > minSwipeDistance) {
      // Swiped right
      showPrevTestimonial();
    } else if (swipeDistance < -minSwipeDistance) {
      // Swiped left
      showNextTestimonial();
    }
  }
  
  // Control visibility when tab is not active
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });
  
  // Functions
  function updateTestimonials() {
    // Update testimonial cards
    testimonialCards.forEach((card, index) => {
      // Remove all classes first
      card.classList.remove('active', 'prev', 'next');
      
      if (index === currentIndex) {
        card.classList.add('active');
        card.setAttribute('aria-hidden', 'false');
      } else {
        if (index < currentIndex || (currentIndex === 0 && index === testimonialCards.length - 1)) {
          card.classList.add('prev');
        } else {
          card.classList.add('next');
        }
        card.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('active');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('active');
        indicator.setAttribute('aria-current', 'false');
      }
    });
    
    // Update button states
    if (prevBtn && nextBtn) {
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    }
  }
  
  function showNextTestimonial() {
    stopAutoPlay();
    currentIndex = (currentIndex + 1) % testimonialCards.length;
    updateTestimonials();
    startAutoPlay();
  }
  
  function showPrevTestimonial() {
    stopAutoPlay();
    currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
    updateTestimonials();
    startAutoPlay();
  }
  
  function goToTestimonial(index) {
    if (index < 0 || index >= testimonialCards.length) return;
    stopAutoPlay();
    currentIndex = index;
    updateTestimonials();
    startAutoPlay();
  }
  
  function startAutoPlay() {
    stopAutoPlay(); // Clear any existing interval
    testimonialInterval = setInterval(showNextTestimonial, autoPlayDelay);
  }
  
  function stopAutoPlay() {
    clearInterval(testimonialInterval);
  }
}

// ===== Back to Top Button =====
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;
  
  function toggleBackToTopBtn() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  }
  
  // Throttled scroll event
  window.addEventListener('scroll', throttle(toggleBackToTopBtn, 200));
  
  // Initial check
  toggleBackToTopBtn();
  
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
      
      // Simulate successful form submission
      setTimeout(() => {
        // Success message
        contactForm.innerHTML = `
          <div class="form-success">
            <i class="fas fa-check-circle"></i>
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
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.classList.add('error');
  }
  
  function removeError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      formGroup.removeChild(errorElement);
    }
    
    input.classList.remove('error');
  }
  
  function isValidEmail(email) {
    // RFC 5322 compliant email regex
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

/* ===== Featured Projects Section ===== */
function initFeaturedProjects() {
  // Configuration
  const projectsPerPage = 6; // Number of projects per page
  const jsonPath = './featured-projects.json'; // Path to JSON file
  
  // DOM Elements
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) {
    // Try with the old ID structure - fallback
    const projectsGrid = document.getElementById('featured-projects-grid');
    if (!projectsGrid) return; // Exit if neither exists
  }
  
  const filterButtons = document.querySelectorAll('.filter-btn');
  const prevButton = document.getElementById('prev-page') || document.getElementById('prev-projects');
  const nextButton = document.getElementById('next-page') || document.getElementById('next-projects');
  const paginationDots = document.getElementById('pagination-dots') || document.getElementById('featured-pagination');
  const projectModal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  
  // Templates
  const projectCardTemplate = document.getElementById('project-card-template');
  const modalTemplate = document.getElementById('modal-template') || document.getElementById('modal-content-template');
  
  // State variables
  let allProjects = [];
  let filteredProjects = [];
  let currentPage = 1;
  let totalPages = 1;
  let currentFilter = 'all';
  
  // Initialize
  fetchProjects();
  
  // Function to handle image loading with fallback
  function loadProjectImage(imageUrl, fallbackUrl) {
    return new Promise((resolve) => {
      // If no image URL is provided, use fallback immediately
      if (!imageUrl) {
        resolve(fallbackUrl || 'https://picsum.photos/800/600?random=' + Math.random());
        return;
      }
      
      // Create a test image to check if the original URL loads
      const testImg = new Image();
      
      // If original image loads successfully, use it
      testImg.onload = function() {
        resolve(imageUrl);
      };
      
      // If original image fails, use fallback
      testImg.onerror = function() {
        console.log(`Image failed to load: ${imageUrl}, using fallback`);
        resolve(fallbackUrl || 'https://picsum.photos/800/600?random=' + Math.random());
      };
      
      // Set a timeout to prevent hanging if image is very slow
      setTimeout(() => {
        if (!testImg.complete) {
          testImg.src = ''; // Cancel the current image request
          resolve(fallbackUrl || 'https://picsum.photos/800/600?random=' + Math.random());
        }
      }, 5000); // 5 second timeout
      
      // Start loading the image
      testImg.src = imageUrl;
    });
  }
  
  // Fetch projects data
  async function fetchProjects() {
    showLoader();
    
    try {
      const response = await fetch(jsonPath);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects (${response.status})`);
      }
      
      const data = await response.json();
      
      if (!data || !data.featuredProjects || !Array.isArray(data.featuredProjects)) {
        throw new Error('Invalid project data format');
      }
      
      allProjects = data.featuredProjects;
      
      // Process images to ensure they load correctly
      allProjects = await Promise.all(allProjects.map(async (project) => {
        // Fix image paths if they start with ./ or if they're relative
        if (project.image && project.image.startsWith('./')) {
          project.image = project.image.substring(2); // Remove leading ./
        }
        
        // Add fallback image if not present
        if (!project.fallbackImage) {
          project.fallbackImage = `https://picsum.photos/800/600?random=${Math.random()}`;
        }
        
        return project;
      }));
      
      filteredProjects = [...allProjects];
      
      // Calculate total pages
      totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
      
      // Initialize UI
      createPagination();
      renderProjects();
      hideLoader();
      
    } catch (error) {
      console.error('Error loading projects:', error);
      
      // Fallback projects data when API fails
      const fallbackProjects = [
        {
          "id": "iconic-aesthetics",
          "title": "Iconic Aesthetics",
          "subtitle": "Web & POS Solution",
          "description": "Complete business technology solution including custom website with integrated booking system and Point of Sale implementation.",
          "image": "https://picsum.photos/id/20/800/600",
          "categories": ["web", "pos"],
          "tags": ["Web Development", "POS System", "Booking Solution"],
          "features": [
            "Custom Web Design",
            "Appointment Booking System",
            "Square POS Integration",
            "Business Card & Brochure Design"
          ],
          "link": "#"
        },
        {
          "id": "east-coast-realty",
          "title": "East Coast Realty",
          "subtitle": "Real Estate Tech Solution",
          "description": "Comprehensive technology solution including modern website, office setup with network configuration, and business material design.",
          "image": "https://picsum.photos/id/25/800/600",
          "categories": ["web", "tech", "marketing"],
          "tags": ["Web Development", "Office Setup", "Business Materials"],
          "features": [
            "Real Estate Website with MLS Integration",
            "Computer Network Installation",
            "Office Technology Setup",
            "Marketing Materials Design"
          ],
          "link": "#"
        },
        {
          "id": "cohen-associates",
          "title": "Cohen & Associates",
          "subtitle": "Secure Financial Platform",
          "description": "Technology solution for a tax accounting firm featuring secure document handling, client portal, and network security implementation.",
          "image": "https://picsum.photos/id/28/800/600",
          "categories": ["web", "tech"],
          "tags": ["Web Development", "Secure Portal", "Office Technology"],
          "features": [
            "Professional Website with Client Portal",
            "Secure Document Handling System",
            "Office Network & Security Setup",
            "Business Software Implementation"
          ],
          "link": "#"
        },
        {
          "id": "s-cream",
          "title": "S-Cream",
          "subtitle": "E-Commerce & POS",
          "description": "Complete technology solution featuring online ordering, menu management, POS system implementation, and branded materials design.",
          "image": "https://picsum.photos/id/24/800/600",
          "categories": ["web", "pos", "marketing"],
          "tags": ["Web Development", "POS System", "Business Materials"],
          "features": [
            "E-Commerce Website",
            "Digital Menu & Online Ordering",
            "POS System with Inventory",
            "Brand Identity Package"
          ],
          "link": "#"
        },
        {
          "id": "doug-uhlig",
          "title": "Doug Uhlig Psychological Services",
          "subtitle": "Healthcare Technology",
          "description": "Healthcare technology solution with appointment scheduling, HIPAA-compliant systems, and electronic record integration.",
          "image": "https://picsum.photos/id/26/800/600",
          "categories": ["web", "apple"],
          "tags": ["Web Development", "HIPAA Compliance", "Apple Services"],
          "features": [
            "Healthcare Web Platform",
            "HIPAA-Compliant Systems Setup",
            "Apple Device Management",
            "Electronic Health Records Integration"
          ],
          "link": "#"
        },
        {
          "id": "century-one",
          "title": "Century One Management",
          "subtitle": "Property Management System",
          "description": "Integrated property management solution with tenant portal, maintenance request system, and office network implementation.",
          "image": "https://picsum.photos/id/42/800/600",
          "categories": ["web", "tech"],
          "tags": ["Web Portal", "Property Management", "Network Setup"],
          "features": [
            "Property Management Portal",
            "Tenant & Maintenance System",
            "Office Network Infrastructure",
            "Security Camera Installation"
          ],
          "link": "#"
        }
      ];
      
      allProjects = fallbackProjects;
      filteredProjects = [...fallbackProjects];
      
      // Calculate total pages
      totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
      
      // Initialize UI with fallback data
      createPagination();
      renderProjects();
      hideLoader();
      
      // Show error message
      console.warn('Using fallback project data due to loading error');
    }
  }
  
  // Event Listeners
  if (filterButtons.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filterProjects(filter);
      });
    });
  }
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        navigateToPage(currentPage - 1);
      }
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        navigateToPage(currentPage + 1);
      }
    });
  }
  
  if (modalClose && projectModal) {
    // Close modal when clicking the close button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking on backdrop
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (projectModal.classList.contains('open') || projectModal.classList.contains('active'))) {
        closeModal();
      }
    });
  }
  
  // Filter projects
  function filterProjects(filter) {
    // Update UI state
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });
    
    // Update filter state
    currentFilter = filter;
    currentPage = 1; // Reset to first page
    
    showLoader();
    
    // Apply filter
    if (filter === 'all') {
      filteredProjects = [...allProjects];
    } else {
      filteredProjects = allProjects.filter(project => 
        project.categories && project.categories.includes(filter)
      );
    }
    
    // Handle no results
    if (filteredProjects.length === 0) {
      showMessage('No projects found', `No projects match the "${filter}" filter. Please try another category.`);
      hideLoader();
      totalPages = 0;
      createPagination();
      return;
    }
    
    // Update totalPages based on filtered results
    totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    
    // Update pagination and render projects
    createPagination();
    renderProjects();
    hideLoader();
  }
  
  // Render projects for current page
  async function renderProjects() {
    // Clear grid (except loader)
    while (projectsGrid.firstChild) {
      if (!projectsGrid.firstChild.classList || !projectsGrid.firstChild.classList.contains('loader-container')) {
        projectsGrid.removeChild(projectsGrid.firstChild);
      }
    }
    
    // Get projects for current page
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = Math.min(startIndex + projectsPerPage, filteredProjects.length);
    const currentProjects = filteredProjects.slice(startIndex, endIndex);
    
    // Add projects with staggered animation
    for (let i = 0; i < currentProjects.length; i++) {
      const project = currentProjects[i];
      const card = await createProjectCard(project);
      projectsGrid.appendChild(card);
      
      // Stagger animation
      setTimeout(() => {
        card.classList.add('fade-in');
      }, i * 100);
    }
  }
  
  // Create project card
  async function createProjectCard(project) {
    // Determine which template structure we're using (old or new)
    const isNewDesign = document.querySelector('.projects-wrapper') !== null;

    // Return a basic card if no template exists
    if (!projectCardTemplate) {
      const card = document.createElement('div');
      card.className = 'project-card';
      
      // Try to load image with fallback
      const finalImageUrl = await loadProjectImage(
        project.image,
        project.fallbackImage || 'https://picsum.photos/800/600?random=' + Math.random()
      );
      
      if (isNewDesign) {
        // New design structure
        card.innerHTML = `
          <div class="project-image">
            <img src="${finalImageUrl}" alt="${project.title}" loading="lazy">
            <div class="project-overlay">
              <div class="project-buttons">
                <button class="project-details-btn">View Details</button>
                <a href="${project.link || '#'}" class="project-link" target="_blank">Visit Website</a>
              </div>
            </div>
            <div class="project-category">${project.categories ? project.categories[0].charAt(0).toUpperCase() + project.categories[0].slice(1) : 'Project'}</div>
          </div>
          <div class="project-info">
            <h4 class="project-title">${project.title}</h4>
            <p class="project-subtitle">${project.subtitle || ''}</p>
            <div class="project-tags">
              ${project.tags ? project.tags.map(tag => `<span>${tag}</span>`).join('') : ''}
            </div>
          </div>
        `;
      } else {
        // Old design structure (flip card)
        card.innerHTML = `
          <div class="project-card-inner">
            <div class="project-card-front">
              <div class="project-image">
                <img src="${finalImageUrl}" alt="${project.title}" loading="lazy">
                <div class="project-category-tag">${project.categories ? project.categories[0].charAt(0).toUpperCase() + project.categories[0].slice(1) : 'Project'}</div>
              </div>
              <div class="project-content">
                <h4 class="project-title">${project.title}</h4>
                <p class="project-subtitle">${project.subtitle || ''}</p>
                <div class="project-tags">
                  ${project.tags ? project.tags.map(tag => `<span>${tag}</span>`).join('') : ''}
                </div>
              </div>
            </div>
            <div class="project-card-back">
              <div class="project-back-content">
                <h4 class="project-title">${project.title}</h4>
                <p class="project-description">${project.description || ''}</p>
                <div class="project-actions">
                  <button class="project-details-btn">View Details</button>
                  <a href="${project.link || '#'}" class="project-link" target="_blank">Visit Website</a>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      
      // Add click handler for details button
      setTimeout(() => {
        const detailsBtn = card.querySelector('.project-details-btn');
        if (detailsBtn && projectModal) {
          detailsBtn.addEventListener('click', () => openModal(project));
        }
      }, 100);
      
      return card;
    }
    
    // Use template
    const template = projectCardTemplate.content.cloneNode(true);
    const card = template.querySelector('.project-card');
    
    // Set project image with fallback
    const projectImage = card.querySelector('.project-image img');
    if (projectImage) {
      // Set a loading placeholder
      projectImage.src = 'https://via.placeholder.com/800x400?text=Loading...';
      
      // Try to load the actual image
      try {
        const finalImageUrl = await loadProjectImage(
          project.image,
          project.fallbackImage || 'https://picsum.photos/800/600?random=' + Math.random()
        );
        
        projectImage.src = finalImageUrl;
        projectImage.alt = project.title;
        projectImage.setAttribute('loading', 'lazy');
      } catch (error) {
        console.error('Image loading error:', error);
        projectImage.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
      }
    }
    
    // Set category
    if (isNewDesign) {
      const categoryEl = card.querySelector('.project-category');
      if (categoryEl && project.categories && project.categories.length > 0) {
        categoryEl.textContent = project.categories[0].charAt(0).toUpperCase() + project.categories[0].slice(1);
      }
    } else {
      const categoryTag = card.querySelector('.project-category-tag');
      if (categoryTag && project.categories && project.categories.length > 0) {
        categoryTag.textContent = project.categories[0].charAt(0).toUpperCase() + project.categories[0].slice(1);
      }
    }
    
    // Set title and subtitle
    const titleElements = card.querySelectorAll('.project-title');
    titleElements.forEach(el => {
      el.textContent = project.title;
    });
    
    const subtitleEl = card.querySelector('.project-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = project.subtitle || '';
    }
    
    // Add tags
    const tagsContainer = card.querySelector('.project-tags');
    if (tagsContainer && project.tags) {
      project.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });
    }
    
    // Set description if it exists (in the back of card)
    const descriptionEl = card.querySelector('.project-description');
    if (descriptionEl) {
      descriptionEl.textContent = project.description || '';
    }
    
    // Add features if they exist (in the back of card)
    const featuresContainer = card.querySelector('.project-features');
    if (featuresContainer && project.features) {
      // Check if there's already a ul element
      let featuresList = featuresContainer.querySelector('ul');
      if (!featuresList) {
        featuresList = document.createElement('ul');
        featuresContainer.appendChild(featuresList);
      }
      
      project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
      });
    }
    
    // Set up links
    const websiteLinks = card.querySelectorAll('.project-link');
    websiteLinks.forEach(link => {
      link.href = project.link || '#';
      if (project.link && !project.link.startsWith('#')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    // Add click event for details button
    const detailsBtn = card.querySelector('.project-details-btn');
    if (detailsBtn && projectModal) {
      detailsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.stopPropagation) e.stopPropagation(); // Prevent card flip if applicable
        openModal(project);
      });
    }
    
    return card;
  }
  
  // Create pagination
  function createPagination() {
    if (!paginationDots) return;
    
    // Clear previous dots
    paginationDots.innerHTML = '';
    
    // Create a dot for each page
    for (let i = 1; i <= totalPages; i++) {
      const dot = document.createElement('div');
      
      // Set appropriate class based on which pagination system we're using
      if (paginationDots.id === 'pagination-dots') {
        dot.className = 'pagination-dot';
      } else {
        dot.className = 'page-dot';
      }
      
      if (i === currentPage) dot.classList.add('active');
      
      dot.setAttribute('data-page', i);
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Go to page ${i}`);
      dot.setAttribute('tabindex', '0');
      
      dot.addEventListener('click', () => navigateToPage(i));
      
      paginationDots.appendChild(dot);
    }
    
    // Update button states
    if (prevButton) prevButton.disabled = currentPage <= 1 || totalPages === 0;
    if (nextButton) nextButton.disabled = currentPage >= totalPages || totalPages === 0;
  }
  
  // Navigate to specific page
  function navigateToPage(page) {
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    showLoader();
    
    // Update pagination dots
    if (paginationDots) {
      const dots = paginationDots.querySelectorAll('.pagination-dot, .page-dot');
      dots.forEach(dot => {
        dot.classList.toggle('active', parseInt(dot.getAttribute('data-page')) === page);
      });
    }
    
    // Update button states
    if (prevButton) prevButton.disabled = page <= 1;
    if (nextButton) nextButton.disabled = page >= totalPages;
    
    // Render projects for this page
    renderProjects();
    
    // Hide loader after a short delay
    setTimeout(hideLoader, 300);
  }
  
  // Open project modal
  async function openModal(project) {
    if (!projectModal) return;
    
    const modalBody = projectModal.querySelector('.modal-body');
    if (!modalBody) return;
    
    // Clear previous content
    modalBody.innerHTML = '';
    
    // Create content from template or a simple fallback
    if (modalTemplate) {
      const content = modalTemplate.content.cloneNode(true);
      
      // Set title and subtitle
      content.querySelector('.modal-title').textContent = project.title;
      
      const subtitleEl = content.querySelector('.modal-subtitle');
      if (subtitleEl) {
        subtitleEl.textContent = project.subtitle || '';
      }
      
      // Load and set main image with fallback
      const mainImage = content.querySelector('.modal-main-image img, .modal-image img');
      if (mainImage) {
        mainImage.src = 'https://via.placeholder.com/800x400?text=Loading...';
        
        try {
          const finalImageUrl = await loadProjectImage(
            project.image,
            project.fallbackImage || 'https://picsum.photos/800/600?random=' + Math.random()
          );
          
          mainImage.src = finalImageUrl;
          mainImage.alt = project.title;
          mainImage.setAttribute('loading', 'lazy');
        } catch (error) {
          console.error('Modal image loading error:', error);
          mainImage.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
        }
      }
      
      // Set description
      const descriptionEl = content.querySelector('.modal-description');
      if (descriptionEl) {
        descriptionEl.textContent = project.description || '';
      }
      
      // Set features
      const featuresList = content.querySelector('.features-list');
      if (featuresList && project.features) {
        project.features.forEach(feature => {
          const li = document.createElement('li');
          li.textContent = feature;
          featuresList.appendChild(li);
        });
      }
      
      // Set tags
      const tagsList = content.querySelector('.tags-list');
      if (tagsList && project.tags) {
        project.tags.forEach(tag => {
          const span = document.createElement('span');
          span.textContent = tag;
          tagsList.appendChild(span);
        });
      }
      
      // Set website link
      const modalLink = content.querySelector('.modal-link');
      if (modalLink) {
        modalLink.href = project.link || '#';
        if (project.link && !project.link.startsWith('#')) {
          modalLink.setAttribute('target', '_blank');
          modalLink.setAttribute('rel', 'noopener noreferrer');
        }
      }
      
      // Add content to modal
      modalBody.appendChild(content);
    } else {
      // Create a simple fallback if no template exists
      const finalImageUrl = await loadProjectImage(
        project.image,
        project.fallbackImage || 'https://picsum.photos/800/600?random=' + Math.random()
      );
      
      // Simple fallback content
      modalBody.innerHTML = `
        <div style="padding: 2rem;">
          <h3 style="margin-bottom: 1rem;">${project.title}</h3>
          <p style="margin-bottom: 1rem; color: #6C63FF;">${project.subtitle || ''}</p>
          <div style="margin-bottom: 2rem;">
            <img src="${finalImageUrl}" alt="${project.title}" style="width: 100%; height: auto; border-radius: 8px;">
          </div>
          <p style="margin-bottom: 2rem; line-height: 1.6;">${project.description || ''}</p>
          <div style="display: flex; justify-content: center; gap: 1rem;">
            <a href="${project.link || '#'}" target="_blank" rel="noopener" 
              style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #6C63FF, #8C63FF); 
              color: white; border-radius: 9999px; text-decoration: none; font-weight: 600;">
              Visit Website
            </a>
            <button 
              style="padding: 0.75rem 1.5rem; background: transparent; border: 1px solid #6C63FF; 
              color: #6C63FF; border-radius: 9999px; cursor: pointer; font-weight: 600;"
              onclick="document.getElementById('project-modal').classList.remove('active'); document.getElementById('project-modal').classList.remove('open'); document.body.classList.remove('no-scroll');">
              Close
            </button>
          </div>
        </div>
      `;
    }
    
    // Show modal
    projectModal.classList.add('active'); // Support for old class name
    projectModal.classList.add('open');   // Support for new class name
    document.body.classList.add('no-scroll');
    
    // Focus the close button for accessibility
    if (modalClose) {
      setTimeout(() => {
        modalClose.focus();
      }, 100);
    }
  }
  
  // Close modal
  function closeModal() {
    if (!projectModal) return;
    
    projectModal.classList.remove('active');
    projectModal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  
  // Show loader
  function showLoader() {
    // Try to find the loader using different possible class names
    let loader = projectsGrid.querySelector('.loader-container, .grid-loader');
    
    if (!loader) {
      // Create a new loader if one doesn't exist
      const loaderContainer = document.createElement('div');
      loaderContainer.className = 'loader-container';
      loaderContainer.innerHTML = `
        <div class="loader-circle"></div>
        <p>Loading projects...</p>
      `;
      projectsGrid.appendChild(loaderContainer);
      loader = loaderContainer;
    }
    
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    loader.style.visibility = 'visible';
  }
  
  // Hide loader
  function hideLoader() {
    // Try to find the loader using different possible class names
    const loader = projectsGrid.querySelector('.loader-container, .grid-loader');
    
    if (loader) {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }
  }
  
  // Show message (for empty states or errors)
  function showMessage(title, message, type = 'info') {
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    
    // Set icon based on type
    let icon = 'fa-info-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'empty') icon = 'fa-search';
    
    // Create message content
    messageContainer.innerHTML = `
      <i class="fas ${icon}"></i>
      <h4>${title}</h4>
      <p>${message}</p>
    `;
    
    // Add to grid
    projectsGrid.appendChild(messageContainer);
  }
}

// ===== Utility Functions =====
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

// Function to detect user's device type
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || window.innerWidth < 768;
}
