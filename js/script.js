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
    // Hide all slides first
    slides.forEach(slide => {
      slide.style.display = 'none';
    });

    // Remove active class from all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
      dot.setAttribute('aria-selected', 'false');
    });

    // Show current slide and activate corresponding dot
    if (slides[index]) {
      slides[index].style.display = 'block';
      dots[index].classList.add('active');
      dots[index].setAttribute('aria-selected', 'true');
      currentSlide = index;
    }
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
    
    // Keyboard navigation for accessibility
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        stopAutoSlide();
        showSlide(index);
        startAutoSlide();
      }
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
  const projectsPerPage = 3; // Number of projects to show per page
  const jsonPath = './featured-projects.json'; // Path to JSON file with project data
  
  // DOM Elements
  const projectsGrid = document.getElementById('featured-projects-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const prevButton = document.getElementById('prev-projects');
  const nextButton = document.getElementById('next-projects');
  const paginationContainer = document.getElementById('featured-pagination');
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  
  // If any of these elements don't exist, exit the function
  if (!projectsGrid || !filterButtons.length || !prevButton || !nextButton || !paginationContainer) return;
  
  // Get modal body if modal exists
  const modalBody = projectModal ? projectModal.querySelector('.modal-body') : null;
  
  // Templates
  const projectCardTemplate = document.getElementById('project-card-template');
  const modalContentTemplate = document.getElementById('modal-content-template');
  
  // State variables
  let allProjects = [];
  let filteredProjects = [];
  let currentFilter = 'all';
  let currentPage = 1;
  let totalPages = 1;
  
  // Initialize
  fetchProjects();
  
  // Event Listeners
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      filterProjects(filter);
    });
  });
  
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
  
  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking on backdrop
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeModal();
      }
    });
  }
  
  /* Functions */
  
  // Fetch projects from JSON file
  async function fetchProjects() {
    try {
      const response = await fetch(jsonPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if the data has the expected structure
      if (!data || !Array.isArray(data.featuredProjects)) {
        throw new Error('Invalid JSON structure');
      }
      
      allProjects = data.featuredProjects;
      
      // Initialize with all projects
      filteredProjects = [...allProjects];
      totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
      
      // Update UI
      createPagination();
      renderProjects();
      hideLoader();
      
    } catch (error) {
      console.error('Error loading projects:', error);
      
      // Use fallback data if available (from the HTML)
      const sampleProjects = [
        {
          id: "sample-project-1",
          title: "Sample Project 1",
          subtitle: "Web Design & Development",
          description: "This is a sample project to show when JSON loading fails.",
          image: "https://via.placeholder.com/600x400",
          categories: ["web", "design"],
          tags: ["Web Development", "UI/UX", "Responsive Design"],
          features: [
            "Custom Web Design",
            "Responsive Layout",
            "Content Management System"
          ],
          link: "#"
        },
        {
          id: "sample-project-2",
          title: "Sample Project 2",
          subtitle: "Mobile Application",
          description: "Another sample project to demonstrate the portfolio layout.",
          image: "https://via.placeholder.com/600x400",
          categories: ["mobile", "app"],
          tags: ["Mobile App", "iOS", "Android"],
          features: [
            "Cross-platform Development",
            "User Authentication",
            "Push Notifications"
          ],
          link: "#"
        }
      ];
      
      allProjects = sampleProjects;
      filteredProjects = [...sampleProjects];
      totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
      
      // Show error in grid
      if (projectsGrid) {
        projectsGrid.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>Failed to load projects. Showing sample projects instead.</p>
          </div>
        `;
      }
      
      // Render the sample projects after error message
      setTimeout(() => {
        renderProjects();
        hideLoader();
      }, 1000);
    }
  }
  
  // Filter projects by category
  function filterProjects(filter) {
    currentFilter = filter;
    currentPage = 1; // Reset to first page when filtering
    
    // Update active filter button
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });
    
    // Apply filter
    if (filter === 'all') {
      filteredProjects = [...allProjects];
    } else {
      filteredProjects = allProjects.filter(project => 
        project.categories && project.categories.includes(filter)
      );
    }
    
    // Update pagination and render
    totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    createPagination();
    renderProjects();
  }
  
  // Navigate to a specific page
  function navigateToPage(page) {
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProjects();
    updatePaginationActive();
  }
  
  // Create pagination dots
  function createPagination() {
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
      const dot = document.createElement('div');
      dot.classList.add('page-dot');
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Page ${i}`);
      dot.setAttribute('tabindex', '0');
      
      if (i === currentPage) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'page');
      }
      
      dot.addEventListener('click', () => navigateToPage(i));
      
      // Keyboard navigation
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateToPage(i);
        }
      });
      
      paginationContainer.appendChild(dot);
    }
    
    // Update nav buttons state
    updateNavButtons();
  }
  
  // Update active pagination dot
  function updatePaginationActive() {
    if (!paginationContainer) return;
    
    const dots = paginationContainer.querySelectorAll('.page-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index + 1 === currentPage);
      dot.setAttribute('aria-current', index + 1 === currentPage ? 'page' : 'false');
    });
    
    // Update nav buttons state
    updateNavButtons();
  }
  
  // Update navigation buttons state
  function updateNavButtons() {
    if (!prevButton || !nextButton) return;
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    
    // Update ARIA attributes
    prevButton.setAttribute('aria-disabled', currentPage === 1);
    nextButton.setAttribute('aria-disabled', currentPage === totalPages || totalPages === 0);
  }
  
  // Render projects for current page
  function renderProjects() {
    if (!projectsGrid) return;
    
    // Clear previous projects (except loader)
    const existingProjects = projectsGrid.querySelectorAll('.project-card');
    existingProjects.forEach(project => {
      projectsGrid.removeChild(project);
    });
    
    // Clear any error or no-projects messages
    const messages = projectsGrid.querySelectorAll('.error-message, .no-projects-message');
    messages.forEach(message => {
      projectsGrid.removeChild(message);
    });
    
    // Calculate slice indexes
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = Math.min(startIndex + projectsPerPage, filteredProjects.length);
    const currentPageProjects = filteredProjects.slice(startIndex, endIndex);
    
    // No projects found message
    if (currentPageProjects.length === 0) {
      const noProjectsMessage = document.createElement('div');
      noProjectsMessage.className = 'no-projects-message';
      noProjectsMessage.innerHTML = `
        <i class="fas fa-search"></i>
        <p>No projects found for the selected filter. Try another category.</p>
      `;
      projectsGrid.appendChild(noProjectsMessage);
      return;
    }
    
    // Render projects
    currentPageProjects.forEach((project, index) => {
      const projectCard = createProjectCard(project);
      projectsGrid.appendChild(projectCard);
      
      // Add fade-in animation with delay
      setTimeout(() => {
        projectCard.classList.add('fade-in');
      }, 100 * index);
    });
  }
  
  // Create a project card from template
  function createProjectCard(project) {
    if (!projectCardTemplate) {
      // Fallback if template doesn't exist
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-card-inner">
          <div class="project-card-front">
            <div class="project-image">
              <img src="${project.image || 'https://via.placeholder.com/600x400'}" alt="${project.title}" loading="lazy">
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
        </div>
      `;
      return card;
    }
    
    const template = projectCardTemplate.content.cloneNode(true);
    const card = template.querySelector('.project-card');
    
    // Set data attributes
    card.setAttribute('data-id', project.id);
    if (project.categories) {
      card.setAttribute('data-categories', project.categories.join(' '));
    }
    
    // Front card content
    const image = template.querySelector('.project-image img');
    image.src = project.image || 'https://via.placeholder.com/600x400';
    image.alt = project.title;
    image.setAttribute('loading', 'lazy');
    
    const categoryTag = template.querySelector('.project-category-tag');
    if (project.categories && project.categories.length > 0) {
      categoryTag.textContent = project.categories[0].charAt(0).toUpperCase() + project.categories[0].slice(1);
    } else {
      categoryTag.textContent = 'Project';
    }
    
    template.querySelector('.project-title').textContent = project.title;
    template.querySelector('.project-subtitle').textContent = project.subtitle || '';
    
    // Tags
    const tagsList = template.querySelector('.project-tags');
    if (project.tags) {
      project.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsList.appendChild(span);
      });
    }
    
    // Back card content
    const backTitle = template.querySelector('.project-card-back .project-title');
    backTitle.textContent = project.title;
    
    const descriptionElement = template.querySelector('.project-description');
    if (descriptionElement) {
      descriptionElement.textContent = project.description || '';
    }
    
    // Features
    const featuresContainer = template.querySelector('.project-features');
    if (featuresContainer && project.features) {
      const featuresList = document.createElement('ul');
      project.features.slice(0, 3).forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
      });
      featuresContainer.appendChild(featuresList);
    }
    
    // Links
    const websiteLink = template.querySelector('.project-link');
    if (websiteLink) {
      websiteLink.href = project.link || '#';
      
      // Open in new tab if it's an external link
      if (project.link && !project.link.startsWith('#')) {
        websiteLink.setAttribute('target', '_blank');
        websiteLink.setAttribute('rel', 'noopener');
      }
    }
    
    // Add event listeners
    const detailsBtn = template.querySelector('.project-details-btn');
    if (detailsBtn && projectModal) {
      detailsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent card flip
        openProjectModal(project);
      });
    }
    
    return card;
  }
  
  // Open project details modal
  function openProjectModal(project) {
    if (!modalBody || !modalContentTemplate || !projectModal) return;
    
    // Clone modal content template
    const template = modalContentTemplate.content.cloneNode(true);
    
    // Fill in content
    template.querySelector('.modal-title').textContent = project.title;
    
    const modalSubtitle = template.querySelector('.modal-subtitle');
    if (modalSubtitle) {
      modalSubtitle.textContent = project.subtitle || '';
    }
    
    const modalImage = template.querySelector('.modal-image img');
    if (modalImage) {
      modalImage.src = project.image || 'https://via.placeholder.com/600x400';
      modalImage.alt = project.title;
      modalImage.setAttribute('loading', 'lazy');
    }
    
    const modalDescription = template.querySelector('.modal-description');
    if (modalDescription) {
      modalDescription.textContent = project.description || '';
    }
    
    // Features list
    const featuresList = template.querySelector('.features-list');
    if (featuresList && project.features) {
      project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
      });
    }
    
    // Technology tags
    const tagsList = template.querySelector('.tags-list');
    if (tagsList && project.tags) {
      project.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsList.appendChild(span);
      });
    }
    
    // Set website link
    const modalLink = template.querySelector('.modal-link');
    if (modalLink) {
      modalLink.href = project.link || '#';
      
      // Open in new tab if it's an external link
      if (project.link && !project.link.startsWith('#')) {
        modalLink.setAttribute('target', '_blank');
        modalLink.setAttribute('rel', 'noopener');
      }
    }
    
    // Clear previous content and add new content
    modalBody.innerHTML = '';
    modalBody.appendChild(template);
    
    // Show modal with animation
    projectModal.classList.add('active');
    document.body.classList.add('no-scroll'); // Prevent background scrolling
  }
  
  // Close project modal
  function closeModal() {
    if (!projectModal) return;
    
    projectModal.classList.remove('active');
    document.body.classList.remove('no-scroll'); // Restore scrolling
  }
  
  // Hide loader
  function hideLoader() {
    const loader = document.querySelector('.grid-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }
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

// Function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}
