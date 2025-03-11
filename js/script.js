/**
 * Elan's Tech World - Main JavaScript file
 * 
 * Contains all interactive functionality for the website:
 * - Page loader animation
 * - Navigation interactions
 * - Scroll animations
 * - Portfolio functionality with JSON data
 * - Testimonial slider
 * - Counter animations
 * - Form validation
 */

// Store project data globally
let projectsData = [];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initPageLoader();
  initNavigation();
  initMobileMenu();
  initScrollReveal();
  initPortfolio(); // New portfolio functionality that loads JSON data
  initTestimonialSlider();
  initCounters();
  initContactForm();
  initBackToTop();
  
  // Additional features
  initHeroAnimation();
  initServiceCards();
  initProcessSteps();
});

/**
 * Page Loader animation
 * Shows a stylish loading animation before revealing the page content
 */
function initPageLoader() {
  const loader = document.querySelector('.loader-container');
  const progressBar = document.querySelector('.loader-progress-bar');
  
  if (!loader || !progressBar) return;
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Delay to ensure animation completes
      setTimeout(() => {
        loader.classList.add('hidden');
        
        // Enable scroll after loader is hidden
        document.body.style.overflow = 'visible';
        
        // Remove loader from DOM after animation
        setTimeout(() => {
          loader.remove();
        }, 500);
      }, 400);
    }
    progressBar.style.width = `${progress}%`;
  }, 150);
  
  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
}

/**
 * Navigation Functionality
 * Handles header behavior on scroll and active link highlighting
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
        
        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
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
 * Handles opening/closing of mobile navigation menu
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (!menuToggle || !mobileMenu) return;
  
  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  // Close button functionality
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }
  
  // Close menu when clicking on mobile navigation links
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
  
  // Close menu when clicking outside
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
  
  // Close menu on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && mobileMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
}

/**
 * Scroll Reveal Animation
 * Animates elements as they enter the viewport during scrolling
 */
function initScrollReveal() {
  const animatedElements = document.querySelectorAll('.animate');
  
  if (!animatedElements.length) return;
  
  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150; // px from bottom of viewport
    
    animatedElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('visible');
      }
    });
  }
  
  // Initial check
  revealOnScroll();
  
  // Throttle scroll event
  let isScrollingReveal = false;
  window.addEventListener('scroll', () => {
    if (!isScrollingReveal) {
      isScrollingReveal = true;
      setTimeout(() => {
        revealOnScroll();
        isScrollingReveal = false;
      }, 100);
    }
  });
  
  // Check for any elements already in view on load
  window.addEventListener('load', revealOnScroll);
}

/**
 * Portfolio Functionality
 * Loads projects from JSON and manages display and filtering
 */
function initPortfolio() {
  const portfolioGrid = document.getElementById('portfolio-grid');
  const loader = document.querySelector('.portfolio-loader');
  
  if (!portfolioGrid) return;
  
  // Fetch project data from the JSON file
  fetch('projects.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      projectsData = data.projects;
      
      // Remove loader
      if (loader) {
        loader.style.display = 'none';
      }
      
      // Render the projects
      renderProjects(projectsData);
      
      // Initialize filter buttons
      initPortfolioFilter();
      
      // Initialize project modals
      initProjectModals();
    })
    .catch(error => {
      console.error('Error loading projects:', error);
      
      // Show error message in grid
      if (portfolioGrid) {
        portfolioGrid.innerHTML = `
          <div class="portfolio-error">
            <p>Sorry, we couldn't load the projects. Please try again later.</p>
          </div>
        `;
      }
    });
}

/**
 * Render projects in the portfolio grid
 * @param {Array} projects - Array of project objects to render
 */
function renderProjects(projects) {
  const portfolioGrid = document.getElementById('portfolio-grid');
  const template = document.getElementById('project-card-template');
  
  if (!portfolioGrid || !template) return;
  
  // Clear existing content
  portfolioGrid.innerHTML = '';
  
  // Limit to 6 projects for the main page
  const displayProjects = projects.slice(0, 6);
  
  // Add each project to the grid
  displayProjects.forEach(project => {
    const clone = document.importNode(template.content, true);
    const item = clone.querySelector('.portfolio-item');
    const image = clone.querySelector('.portfolio-image img');
    const title = clone.querySelector('.portfolio-title');
    const tagsContainer = clone.querySelector('.portfolio-tags');
    const link = clone.querySelector('.portfolio-link');
    
    // Set project data
    item.setAttribute('data-project-id', project.id);
    item.setAttribute('data-category', project.categories.join(' '));
    
    image.src = project.mainImage;
    image.alt = project.title;
    
    title.textContent = project.title;
    
    // Add tags
    project.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });
    
    // Set link behavior to open the modal
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal(project.id);
    });
    
    portfolioGrid.appendChild(clone);
  });
  
  // Add fade-in animation to the grid items
  const items = portfolioGrid.querySelectorAll('.portfolio-item');
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('fade-in');
    }, index * 100);
  });
}

/**
 * Portfolio Filter
 * Enables filtering of portfolio items by category
 */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (!filterButtons.length || !portfolioItems.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter portfolio items
      portfolioItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        
        // Animate the transition
        if (filterValue === 'all' || categories.includes(filterValue)) {
          // Show item
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          // Using setTimeout to create animation effect
          setTimeout(() => {
            item.style.display = 'block';
            
            // Force browser reflow
            void item.offsetWidth;
            
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 300);
        } else {
          // Hide item
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
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
 * @param {string} projectId - ID of the project to display
 */
function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const modalBody = modal?.querySelector('.modal-body');
  const modalTemplate = document.getElementById('project-modal-template');
  
  if (!modal || !modalBody || !modalTemplate || !projectsData.length) return;
  
  // Find the project data
  const project = projectsData.find(p => p.id === projectId);
  
  if (!project) {
    console.error(`Project with ID "${projectId}" not found.`);
    return;
  }
  
  // Clear previous content
  modalBody.innerHTML = '';
  
  // Clone the template
  const clone = document.importNode(modalTemplate.content, true);
  
  // Populate modal content
  clone.querySelector('.modal-title').textContent = project.title;
  clone.querySelector('.modal-subtitle').textContent = project.modalContent.subtitle;
  
  // Set gallery image
  const galleryImage = clone.querySelector('.gallery-image img');
  galleryImage.src = project.modalContent.galleryImages[0];
  galleryImage.alt = project.title;
  
  // Set description
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
  
  // Activate modal
  document.body.style.overflow = 'hidden'; // Prevent scrolling
  modal.classList.add('active');
}

/**
 * Close the project modal
 */
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Re-enable scrolling
}

/**
 * Testimonial Slider
 * Creates a slider interface for testimonials
 */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-nav-prev');
  const nextBtn = document.querySelector('.testimonial-nav-next');
  
  if (!slider || !slides.length) return;
  
  let currentSlide = 0;
  let slidesToShow = 3;
  let slideWidth = 0;
  
  // Update slider configuration based on window width
  function updateSliderConfig() {
    if (window.innerWidth < 768) {
      slidesToShow = 1;
    } else if (window.innerWidth < 992) {
      slidesToShow = 2;
    } else {
      slidesToShow = 3;
    }
    
    // Calculate slide width based on container and gaps
    const sliderWidth = slider.parentElement.offsetWidth;
    const gap = 16; // Gap between slides (match CSS)
    
    slideWidth = (sliderWidth - (gap * (slidesToShow - 1))) / slidesToShow;
    
    // Update slide widths
    slides.forEach(slide => {
      slide.style.width = `${slideWidth}px`;
      slide.style.flex = `0 0 ${slideWidth}px`;
    });
    
    // Move to current slide without animation
    goToSlide(currentSlide, false);
  }
  
  // Initialize slider
  updateSliderConfig();
  
  // Go to specific slide with or without animation
  function goToSlide(index, animate = true) {
    if (index < 0) {
      index = 0;
    } else if (index > slides.length - slidesToShow) {
      index = slides.length - slidesToShow;
    }
    
    currentSlide = index;
    
    // Calculate translation distance
    const translateX = -currentSlide * (slideWidth + 16); // 16 is the gap between slides
    
    // Apply transform with or without transition
    if (animate) {
      slider.style.transition = 'transform 0.4s ease';
    } else {
      slider.style.transition = 'none';
    }
    
    slider.style.transform = `translateX(${translateX}px)`;
    
    // Update dots
    updateDots();
    
    // Re-enable transition
    if (!animate) {
      setTimeout(() => {
        slider.style.transition = 'transform 0.4s ease';
      }, 50);
    }
  }
  
  // Update active dot
  function updateDots() {
    if (!dots.length) return;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }
  
  // Event listeners for navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
    });
  }
  
  // Event listeners for dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
    });
  });
  
  // Auto-advance slider every 5 seconds
  let autoplayInterval;
  
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      let nextIndex = currentSlide + 1;
      if (nextIndex > slides.length - slidesToShow) {
        nextIndex = 0;
      }
      goToSlide(nextIndex);
    }, 5000);
  }
  
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }
  
  // Start autoplay
  startAutoplay();
  
  // Pause autoplay on hover
  slider.parentElement.addEventListener('mouseenter', stopAutoplay);
  slider.parentElement.addEventListener('mouseleave', startAutoplay);
  
  // Update slider on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSliderConfig();
    }, 200);
  });
  
  // Handle touch events for mobile swipe
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  
  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
    startAutoplay();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe left, go to next slide
      goToSlide(currentSlide + 1);
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe right, go to previous slide
      goToSlide(currentSlide - 1);
    }
  }
}

/**
 * Counter Animation
 * Animates number counters when they scroll into view
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  let counted = false;
  
  function startCounting() {
    if (counted) return;
    
    const windowHeight = window.innerHeight;
    const statsSection = document.querySelector('.stats-section');
    
    if (!statsSection) return;
    
    const sectionTop = statsSection.getBoundingClientRect().top;
    
    if (sectionTop < windowHeight * 0.8) {
      counted = true;
      
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let count = 0;
        const increment = Math.ceil(target / 60); // 60 frames over 1.5s
        
        function updateCount() {
          if (count < target) {
            count += increment;
            if (count > target) count = target;
            counter.textContent = count;
            requestAnimationFrame(updateCount);
          }
        }
        
        updateCount();
      });
    }
  }
  
  // Initial check
  startCounting();
  
  // Check on scroll
  window.addEventListener('scroll', startCounting);
}

/**
 * Contact Form Validation
 * Validates form inputs before submission
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Basic validation
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const message = document.getElementById('message');
    
    // Clear previous error messages
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(error => error.remove());
    
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
      const originalText = submitButton.textContent;
      
      // Show loading state
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // Show success message
        form.innerHTML = `
          <div class="form-success">
            <div class="form-success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. We'll get back to you shortly.</p>
          </div>
        `;
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
    
    // Remove highlight on input
    input.addEventListener('input', function() {
      input.style.borderColor = '';
      const errorElement = formGroup.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
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
 * Shows/hides the back to top button and handles scroll functionality
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Hero Section Animation
 * Adds dynamic effects to the hero section
 */
function initHeroAnimation() {
  const heroSection = document.querySelector('.hero-section');
  const heroContent = document.querySelector('.hero-content');
  
  if (!heroSection || !heroContent) return;
  
  // Subtle parallax effect on scroll
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const translateY = scrollPosition * 0.3; // Adjust speed
    
    if (scrollPosition <= heroSection.offsetHeight) {
      heroContent.style.transform = `translateY(${translateY}px)`;
      
      // Fade out content as user scrolls
      const opacity = 1 - (scrollPosition / (heroSection.offsetHeight * 0.7));
      heroContent.style.opacity = Math.max(opacity, 0);
    }
  });
  
  // Create spotlight effect that follows mouse in hero section
  if (window.matchMedia('(min-width: 992px)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const spotlight = document.createElement('div');
      spotlight.classList.add('hero-spotlight');
      spotlight.style.left = `${mouseX}px`;
      spotlight.style.top = `${mouseY}px`;
      
      heroSection.appendChild(spotlight);
      
      // Remove spotlight after animation
      setTimeout(() => {
        spotlight.remove();
      }, 1000);
    });
  }
}

/**
 * Service Cards Animation
 * Adds hover effects and animations to service cards
 */
function initServiceCards() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (!serviceCards.length) return;
  
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = 'var(--shadow-lg)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow-md)';
    });
  });
}

/**
 * Process Steps Animation
 * Adds animation effects to process steps
 */
function initProcessSteps() {
  const processSteps = document.querySelectorAll('.process-step');
  
  if (!processSteps.length) return;
  
  processSteps.forEach((step, index) => {
    // Add delay to stagger animation
    step.style.transitionDelay = `${index * 0.1}s`;
    
    // Animate on scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          step.classList.add('animate-step');
          observer.unobserve(step);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(step);
  });
}
