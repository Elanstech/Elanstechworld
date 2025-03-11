/**
 * Elan's Tech World - Modernized JavaScript
 * Streamlined code focusing on essential interactivity
 */

// Main configuration
const config = {
  animations: {
    enabled: true,     // Master toggle for animations
    duration: 0.6,     // Default animation duration
    staggerDelay: 0.08 // Delay between staggered animations
  },
  
  // Detect touch devices for optimized interactions
  isTouchDevice: 'ontouchstart' in window || 
                navigator.maxTouchPoints > 0 || 
                navigator.msMaxTouchPoints > 0
};

// Store DOM elements for more efficient access
const DOM = {};

// Helper functions
const helpers = {
  // Throttle function for performance
  throttle: function(callback, limit) {
    let waiting = false;
    return function() {
      if (!waiting) {
        callback.apply(this, arguments);
        waiting = true;
        setTimeout(() => {
          waiting = false;
        }, limit);
      }
    };
  },
  
  // Debounce function for performance
  debounce: function(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
};

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize DOM selector cache
  cacheDOM();
  
  // Enable animations after small delay to prevent flash of animation
  setTimeout(() => {
    document.body.classList.remove('preload');
  }, 100);
  
  // Initialize components in priority order
  initLoader();
  initNavigation();
  initMobileMenu();
  initHeroTyped();
  
  // Conditional initialization based on device type
  if (!config.isTouchDevice) {
    initMagneticButtons();
    initTiltElements();
  }
  
  // Core interactive elements
  initPortfolioFilter();
  initProcessTimeline();
  initCounters();
  
  // Initialize modals and form interactions
  initProjectModals();
  initFormInteractions();
  
  // Load data and initialize back to top button
  loadProjectsData();
  initBackToTop();
  
  // Add scroll and resize event listeners with performance optimization
  window.addEventListener('scroll', helpers.throttle(handleScroll, 100));
  window.addEventListener('resize', helpers.debounce(handleResize, 250));
});

// Cache DOM elements for more efficient access
function cacheDOM() {
  // Header elements
  DOM.header = document.querySelector('.header');
  DOM.navLinks = document.querySelectorAll('.nav-link');
  DOM.menuToggle = document.querySelector('.menu-toggle');
  DOM.mobileMenu = document.querySelector('.mobile-menu');
  
  // Section elements
  DOM.sections = document.querySelectorAll('section[id]');
  DOM.portfolioGrid = document.getElementById('portfolio-grid');
  DOM.featuredProjects = document.getElementById('featured-projects');
  
  // Interactive elements
  DOM.filterButtons = document.querySelectorAll('.filter-btn');
  DOM.processSteps = document.querySelectorAll('.process-step');
  DOM.tiltElements = document.querySelectorAll('.tilt-element');
  DOM.magneticButtons = document.querySelectorAll('.magnetic-button');
  DOM.backToTop = document.querySelector('.back-to-top');
  
  // Forms
  DOM.contactForm = document.getElementById('contact-form');
  DOM.formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
}

/**
 * Page Loader with Optimized Animation
 */
function initLoader() {
  const loader = document.querySelector('.loader-container');
  const progressBar = document.querySelector('.loader-progress-bar');
  const percentage = document.querySelector('.loader-percentage');
  const loaderMessages = [
    'Initializing Interface...',
    'Loading Assets...',
    'Preparing Animations...',
    'Almost Ready...'
  ];
  const loaderMessage = document.querySelector('.loader-message');
  
  if (!loader || !progressBar) return;
  
  // Show initial message
  loaderMessage.textContent = loaderMessages[0];
  
  let progress = 0;
  let messageIndex = 0;
  
  // Update loader message periodically
  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % loaderMessages.length;
    loaderMessage.textContent = loaderMessages[messageIndex];
  }, 800);
  
  // Progress animation with optimized intervals
  const interval = setInterval(() => {
    // Optimized progress simulation
    if (progress < 50) {
      progress += 5 + Math.random() * 5;
    } else if (progress < 85) {
      progress += 2 + Math.random() * 3;
    } else {
      progress += 0.5;
    }
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      clearInterval(messageInterval);
      
      // Final message
      loaderMessage.textContent = 'Welcome to Elan\'s Tech World!';
      
      // Hide loader
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'visible';
        animateHeroElements();
      }, 500);
    }
    
    // Update progress bar and percentage
    progressBar.style.width = `${progress}%`;
    percentage.textContent = `${Math.round(progress)}%`;
  }, 80);
  
  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
}

/**
 * Hero Section Animations
 */
function animateHeroElements() {
  if (!window.gsap) return;
  
  const heroElements = document.querySelectorAll('[data-animation="fade-up"]');
  
  gsap.set(heroElements, { y: 30, opacity: 0 });
  
  gsap.to(heroElements, {
    y: 0,
    opacity: 1,
    duration: config.animations.duration,
    stagger: config.animations.staggerDelay,
    ease: 'power2.out',
    clearProps: 'transform'
  });
}

/**
 * Initialize Typed.js for Hero Section
 */
function initHeroTyped() {
  const typedElement = document.getElementById('hero-typed');
  if (!typedElement || !window.Typed) return;
  
  // Wait until hero section is visible to initialize
  setTimeout(() => {
    new Typed('#hero-typed', {
      stringsElement: '#hero-typed-strings',
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }, 1500); 
}

/**
 * Initialize Magnetic Buttons
 */
function initMagneticButtons() {
  if (!DOM.magneticButtons.length) return;
  
  DOM.magneticButtons.forEach(button => {
    button.addEventListener('mousemove', helpers.throttle((e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Apply subtle movement
      button.style.transform = `translate3d(${x * 0.2}px, ${y * 0.2}px, 0)`;
      
      // Apply more subtle movement to span inside button
      if (button.querySelector('span')) {
        button.querySelector('span').style.transform = `translate3d(${x * 0.05}px, ${y * 0.05}px, 0)`;
      }
    }, 16));
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate3d(0, 0, 0)';
      
      if (button.querySelector('span')) {
        button.querySelector('span').style.transform = 'translate3d(0, 0, 0)';
      }
    });
  });
}

/**
 * Initialize Tilt Effect
 */
function initTiltElements() {
  if (!DOM.tiltElements.length || !window.VanillaTilt) return;
  
  VanillaTilt.init(DOM.tiltElements, {
    max: 5,         // Reduced tilt amount for subtlety
    speed: 400,
    glare: true,
    'max-glare': 0.15,
    scale: 1.03      // Subtle scale effect
  });
}

/**
 * Navigation Functionality
 */
function initNavigation() {
  if (!DOM.header) return;
  
  // Update navigation state on page load
  updateNavigation();
  
  // Smooth scrolling for anchor links
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get header height for offset
        const headerHeight = DOM.header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        // Smooth scroll to target with native behavior
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without triggering scroll
        history.pushState(null, null, targetId);
        
        // Close mobile menu if open
        if (DOM.mobileMenu && DOM.mobileMenu.classList.contains('active')) {
          DOM.mobileMenu.classList.remove('active');
          DOM.menuToggle.classList.remove('active');
        }
      }
    });
  });
}

/**
 * Update Navigation State
 */
function updateNavigation() {
  if (!DOM.sections.length || !DOM.navLinks.length) return;
  
  // Get current scroll position
  const scrollPosition = window.scrollY + 100;
  
  // Find the current active section
  let currentSection = null;
  
  // Loop through sections from bottom to top
  for (let i = DOM.sections.length - 1; i >= 0; i--) {
    const section = DOM.sections[i];
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section;
      break;
    }
  }
  
  // Update active class
  if (currentSection) {
    const sectionId = currentSection.getAttribute('id');
    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    
    DOM.navLinks.forEach(link => {
      if (link === activeLink) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
  if (!DOM.menuToggle || !DOM.mobileMenu) return;
  
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  // Toggle mobile menu
  DOM.menuToggle.addEventListener('click', () => {
    DOM.menuToggle.classList.toggle('active');
    DOM.mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  // Close button functionality
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  
  // Close when clicking on backdrop
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }
  
  // Close menu when clicking on mobile navigation links
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  function closeMobileMenu() {
    DOM.menuToggle.classList.remove('active');
    DOM.mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
}

/**
 * Process Timeline Animation
 */
function initProcessTimeline() {
  if (!DOM.processSteps.length) return;
  
  // Create intersection observer for animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  // Observe each process step
  DOM.processSteps.forEach(step => {
    observer.observe(step);
  });
}

/**
 * Portfolio Filter Functionality
 */
function initPortfolioFilter() {
  if (!DOM.filterButtons.length) return;
  
  DOM.filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      DOM.filterButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Get all portfolio items
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      
      // Filter items
      portfolioItems.forEach(item => {
        const categories = item.getAttribute('data-category');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Project Modals
 */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = modal?.querySelector('.modal-close');
  const backdrop = modal?.querySelector('.modal-backdrop');
  
  if (!modal) return;
  
  // Add click events to portfolio links
  document.addEventListener('click', (e) => {
    const portfolioLink = e.target.closest('.portfolio-link');
    const portfolioItem = e.target.closest('.portfolio-item');
    
    if (portfolioLink || (portfolioItem && !e.target.closest('.filter-btn'))) {
      e.preventDefault();
      
      const projectId = 
        portfolioLink?.dataset.projectId || 
        portfolioItem?.dataset.projectId || 
        portfolioLink?.closest('[data-project-id]')?.dataset.projectId ||
        portfolioItem?.closest('[data-project-id]')?.dataset.projectId;
      
      if (projectId) {
        openProjectModal(projectId);
      }
    }
  });
  
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
 * Open Project Modal
 */
function openProjectModal(projectId) {
  const modal = document.getElementById('project-modal');
  const modalBody = modal?.querySelector('.modal-body');
  const modalTemplate = document.getElementById('project-modal-template');
  
  if (!modal || !modalBody) return;
  
  // Find the project data
  const project = window.projectsData.find(p => p.id === projectId);
  if (!project) return;
  
  // Build modal content based on project data
  // For simplicity in this example, we'll just show a loading state
  modalBody.innerHTML = `
    <div style="padding: 40px; text-align: center;">
      <h2>Loading project details...</h2>
      <p>Project: ${project.title}</p>
    </div>
  `;
  
  // Show modal
  document.body.style.overflow = 'hidden'; // Prevent scrolling
  modal.classList.add('active');
}

/**
 * Close Project Modal
 */
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Re-enable scrolling
}

/**
 * Counter Animation
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
        
        const updateCount = () => {
          const increment = target / 30; // Divide by number of frames
          
          if (count < target) {
            count += increment;
            counter.textContent = Math.round(count);
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCount();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.3 });
  
  // Observe each counter
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

/**
 * Form Interactions
 */
function initFormInteractions() {
  if (!DOM.contactForm || !DOM.formInputs.length) return;
  
  // Add focus effects
  DOM.formInputs.forEach(input => {
    // Check if input has value on load
    if (input.value) {
      input.classList.add('has-value');
    }
    
    // Update state when value changes
    input.addEventListener('input', () => {
      input.classList.toggle('has-value', input.value.length > 0);
    });
  });
  
  // Form validation
  DOM.contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Basic validation
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    
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
    
    // Validate message
    if (!message.value.trim()) {
      showError(message, 'Please enter your message');
      isValid = false;
    }
    
    if (isValid) {
      // Form is valid, simulate form submission
      const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = '<span>Sending</span> <i class="fas fa-spinner fa-spin"></i>';
      submitButton.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // Show success message
        DOM.contactForm.innerHTML = `
          <div class="form-success">
            <i class="fas fa-check-circle form-success-icon" style="font-size: 48px; color: var(--primary); margin-bottom: 1rem;"></i>
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
    error.style.color = 'var(--primary)';
    error.style.fontSize = '0.8125rem';
    error.style.marginTop = '0.25rem';
    formGroup.appendChild(error);
    
    // Highlight the input
    input.style.borderColor = 'var(--primary)';
    
    // Remove highlight on input
    input.addEventListener('input', function() {
      input.style.borderColor = '';
      const errorElement = formGroup.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    }, { once: true });
  }
  
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

/**
 * Load Projects Data
 */
function loadProjectsData() {
  // Sample project data
  window.projectsData = [
    {
      id: "iconic-aesthetics",
      title: "Iconic Aesthetics",
      description: "Complete business technology solution including custom website with integrated booking system",
      categories: ["web", "pos"],
      mainImage: "./assets/images/iconicwebsiteimage.jpeg",
      tags: ["Web Development", "POS System", "Booking Solution"]
    },
    {
      id: "east-coast-realty",
      title: "East Coast Realty",
      description: "Comprehensive technology solution for a real estate firm",
      categories: ["web", "tech", "marketing"],
      mainImage: "./assets/images/eastcoastweb.jpeg",
      tags: ["Web Development", "Office Setup", "Business Materials"]
    },
    {
      id: "cohen-associates",
      title: "Cohen & Associates",
      description: "Technology solution for a tax accounting firm featuring secure document handling",
      categories: ["web", "tech"],
      mainImage: "./assets/images/cohen.jpeg",
      tags: ["Web Development", "Secure Portal", "Office Technology"]
    },
    {
      id: "doug-uhlig",
      title: "Doug Uhlig",
      description: "Healthcare technology solution with appointment scheduling",
      categories: ["web", "apple"],
      mainImage: "./assets/images/doug.jpeg",
      tags: ["Web Development", "Apple Product Setup", "HIPAA Compliance"]
    },
    {
      id: "s-cream",
      title: "S-Cream",
      description: "Complete technology solution for an ice cream shop",
      categories: ["web", "pos", "marketing"],
      mainImage: "./assets/images/scream.jpeg",
      tags: ["Web Development", "POS System", "Business Materials"]
    },
    {
      id: "century-one",
      title: "Century One",
      description: "Integrated property management technology solution",
      categories: ["web", "tech"],
      mainImage: "./assets/images/centuryone.jpeg",
      tags: ["Web Portal", "Property Management System", "Network Setup"]
    }
  ];
  
  // Update featured projects
  updateFeaturedProjects();
  
  // Update portfolio grid
  updatePortfolioGrid();
}

/**
 * Update Featured Projects
 */
function updateFeaturedProjects() {
  if (!DOM.featuredProjects || !window.projectsData) return;
  
  // Clear existing content
  DOM.featuredProjects.innerHTML = '';
  
  // Take first 3 projects
  const featuredProjects = window.projectsData.slice(0, 3);
  
  // Create HTML for featured projects
  const featuredHTML = featuredProjects.map(project => `
    <div class="featured-project" data-project-id="${project.id}">
      <img src="${project.mainImage}" alt="${project.title}" class="featured-project-image">
      <div class="featured-project-title">${project.title}</div>
    </div>
  `).join('');
  
  // Add to DOM
  DOM.featuredProjects.innerHTML = featuredHTML;
  
  // Initialize tilt effect if appropriate
  if (window.VanillaTilt && !config.isTouchDevice) {
    VanillaTilt.init(document.querySelectorAll('.featured-project'), {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.15
    });
  }
}

/**
 * Update Portfolio Grid
 */
function updatePortfolioGrid() {
  if (!DOM.portfolioGrid || !window.projectsData) return;
  
  // Clear existing content
  DOM.portfolioGrid.innerHTML = '';
  
  // Create HTML for portfolio items
  const portfolioHTML = window.projectsData.map(project => `
    <div class="portfolio-item tilt-element" data-category="${project.categories.join(' ')}" data-project-id="${project.id}">
      <div class="portfolio-image">
        <img loading="lazy" src="${project.mainImage}" alt="${project.title}">
      </div>
      <div class="portfolio-overlay">
        <div class="portfolio-content">
          <div class="portfolio-tags">
            ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
          </div>
          <h3 class="portfolio-title">${project.title}</h3>
          <a href="#" class="portfolio-link" data-project-id="${project.id}">
            <span>View Details</span>
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');
  
  // Add to DOM
  DOM.portfolioGrid.innerHTML = portfolioHTML;
  
  // Re-initialize tilt effect
  if (window.VanillaTilt && !config.isTouchDevice) {
    VanillaTilt.init(document.querySelectorAll('.portfolio-item.tilt-element'), {
      max: 5,
      speed: 400,
      glare: true,
      'max-glare': 0.15
    });
  }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  if (!DOM.backToTop) return;
  
  // Initial check
  updateBackToTopVisibility();
  
  // Click event
  DOM.backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Update Back to Top visibility
 */
function updateBackToTopVisibility() {
  if (!DOM.backToTop) return;
  
  if (window.scrollY > 500) {
    DOM.backToTop.classList.add('active');
  } else {
    DOM.backToTop.classList.remove('active');
  }
}

/**
 * Handle Scroll Events
 */
function handleScroll() {
  // Update header state
  if (DOM.header) {
    if (window.scrollY > 50) {
      DOM.header.classList.add('scrolled');
    } else {
      DOM.header.classList.remove('scrolled');
    }
  }
  
  // Update navigation active state
  updateNavigation();
  
  // Update back to top button visibility
  updateBackToTopVisibility();
}

/**
 * Handle Resize Events
 */
function handleResize() {
  // Update any responsive elements if needed
  if (window.VanillaTilt && !config.isTouchDevice) {
    // Reinitialize tilt for consistent behavior
    VanillaTilt.init(DOM.tiltElements, {
      max: 5,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      scale: 1.03
    });
  }
}
