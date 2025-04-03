/**
 * Elan's Tech World - Services Page JavaScript
 * Modern, interactive features for the services page
 */

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Config object for page settings
  const config = {
    animations: {
      enabled: true,
      duration: 0.6,
      staggerDelay: 0.08
    },
    
    isTouchDevice: 'ontouchstart' in window || 
                  navigator.maxTouchPoints > 0 || 
                  navigator.msMaxTouchPoints > 0
  };
  
  // Initialize all components
  initLoader();
  initNavigation();
  initCategoryNavigation();
  initProcessTimeline();
  initComparisonTabs();
  initCaseStudiesFilter();
  initFaqAccordion();
  initContactForm();
  initScrollAnimations();
  
  // Initialize interactive components for desktop devices
  if (!config.isTouchDevice) {
    initMagneticButtons();
    initTiltElements();
  }
  
  /**
   * Page Loader Animation
   * Displays loading animation on page load
   */
  function initLoader() {
    const loader = document.querySelector('.loader-container');
    const progressBar = document.querySelector('.loader-progress-bar');
    const percentage = document.querySelector('.loader-percentage');
    const loaderMessages = [
      'Initializing Interface...',
      'Loading Services...',
      'Preparing Solutions...'
    ];
    const loaderMessage = document.querySelector('.loader-message');
    
    if (!loader || !progressBar) return;
    
    // Show initial message
    loaderMessage.textContent = loaderMessages[0];
    
    let progress = 0;
    let messageIndex = 0;
    
    // Update loader message
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loaderMessages.length;
      loaderMessage.textContent = loaderMessages[messageIndex];
    }, 400);
    
    // Progress animation with optimized intervals
    const interval = setInterval(() => {
      // Faster progress simulation
      if (progress < 50) {
        progress += 15 + Math.random() * 10;
      } else if (progress < 85) {
        progress += 10 + Math.random() * 5;
      } else {
        progress += 3;
      }
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        clearInterval(messageInterval);
        
        // Final message
        loaderMessage.textContent = 'Welcome to Our Services!';
        
        // Hide loader with fade
        setTimeout(() => {
          loader.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
          loader.classList.add('hidden');
          document.body.style.overflow = 'visible';
          
          // Start animations when content is visible
          animateElements();
        }, 200);
      }
      
      // Update progress bar and percentage
      progressBar.style.width = `${progress}%`;
      percentage.textContent = `${Math.round(progress)}%`;
    }, 30);
    
    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
    
    // Initialize loader bubbles
    const bubbles = document.querySelectorAll('.loader-bubbles .bubble');
    bubbles.forEach(bubble => {
      const delay = Math.random() * 1;
      const duration = 2 + Math.random() * 2;
      
      bubble.style.animationDelay = `${delay}s`;
      bubble.style.animationDuration = `${duration}s`;
    });
  }
  
  /**
   * Navigation Functionality
   * Handles active state for navigation links
   */
  function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!header) return;
    
    // Update header on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Update active navigation link based on scroll position
      updateActiveNavLink();
    });
    
    // Update navigation state on page load
    updateActiveNavLink();
    
    // Toggle mobile menu
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        // Hide header when mobile menu is open
        if (mobileMenu.classList.contains('active')) {
          header.style.opacity = '0';
          header.style.visibility = 'hidden';
        } else {
          header.style.opacity = '1';
          header.style.visibility = 'visible';
        }
      });
    }
    
    // Close mobile menu
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close when clicking on backdrop
    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', closeMobileMenu);
    }
    
    // Handle mobile navigation links
    mobileLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Close mobile menu
        closeMobileMenu();
      });
    });
    
    // Function to close mobile menu
    function closeMobileMenu() {
      if (menuToggle) menuToggle.classList.remove('active');
      if (mobileMenu) mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
      
      // Show header
      header.style.opacity = '1';
      header.style.visibility = 'visible';
    }
    
    // Smooth scrolling for anchor links
    const allLinks = [...navLinks, ...mobileLinks];
    allLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Check if this is an anchor link
        if (targetId.startsWith('#') && targetId !== '#') {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            // Close mobile menu
            closeMobileMenu();
            
            // Get header height for offset
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            // Smooth scroll to target
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Update URL hash
            history.pushState(null, null, targetId);
          }
        }
      });
    });
    
    // Function to update active navigation link based on scroll position
    function updateActiveNavLink() {
      const sections = document.querySelectorAll('section[id]');
      if (!sections.length || !navLinks.length) return;
      
      // Get current scroll position with some offset
      const scrollPosition = window.scrollY + 100;
      
      // Find the current active section
      let currentSection = null;
      
      // Loop through sections from bottom to top
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section) continue;
        
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section;
          break;
        }
      }
      
      // Update active link
      if (currentSection) {
        const sectionId = currentSection.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          const linkHref = link.getAttribute('href');
          
          if (linkHref === `#${sectionId}` || linkHref === `#`) {
            link.classList.add('active');
          }
        });
      }
    }
  }
  
  /**
   * Service Categories Navigation
   * Handles the horizontal scrolling navigation for service categories
   */
  function initCategoryNavigation() {
    const categoriesNav = document.querySelector('.categories-nav-wrapper');
    const prevButton = document.querySelector('.nav-control.prev');
    const nextButton = document.querySelector('.nav-control.next');
    const categoryItems = document.querySelectorAll('.category-nav-item');
    
    if (!categoriesNav || !categoryItems.length) return;
    
    // Initialize the active category
    let activeCategory = categoryItems[0].getAttribute('data-target');
    categoryItems[0].classList.add('active');
    
    // Set up navigation controls
    if (prevButton && nextButton) {
      // Previous button click
      prevButton.addEventListener('click', () => {
        categoriesNav.scrollBy({
          left: -300,
          behavior: 'smooth'
        });
      });
      
      // Next button click
      nextButton.addEventListener('click', () => {
        categoriesNav.scrollBy({
          left: 300,
          behavior: 'smooth'
        });
      });
    }
    
    // Handle category item clicks
    categoryItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get target section ID
        const targetId = this.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          // Update active class
          categoryItems.forEach(cat => cat.classList.remove('active'));
          this.classList.add('active');
          
          // Update active category
          activeCategory = targetId;
          
          // Scroll to target section
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Update active category based on scroll position
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('.service-detail-section');
      if (!sections.length) return;
      
      // Get current scroll position with some offset
      const scrollPosition = window.scrollY + 200;
      
      // Find the current active section
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) continue;
        
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const sectionId = section.getAttribute('id');
          
          if (sectionId !== activeCategory) {
            // Update active category
            activeCategory = sectionId;
            
            // Update active class
            categoryItems.forEach(item => {
              item.classList.remove('active');
              
              if (item.getAttribute('data-target') === sectionId) {
                item.classList.add('active');
                
                // Scroll category into view if needed
                const navRect = categoriesNav.getBoundingClientRect();
                const itemRect = item.getBoundingClientRect();
                
                if (itemRect.left < navRect.left || itemRect.right > navRect.right) {
                  item.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                  });
                }
              }
            });
          }
          
          break;
        }
      }
    });
  }
  
  /**
   * Process Timeline Navigation
   * Handles the interactive timeline process steps
   */
  function initProcessTimeline() {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const timelineProgress = document.querySelector('.timeline-progress');
    const prevButton = document.querySelector('.timeline-control.prev');
    const nextButton = document.querySelector('.timeline-control.next');
    
    if (!timelineSteps.length || !timelineProgress) return;
    
    // Initialize with the first step active
    let activeStepIndex = 0;
    timelineSteps[activeStepIndex].classList.add('active');
    updateTimelineProgress();
    
    // Set up step click functionality
    timelineSteps.forEach((step, index) => {
      step.addEventListener('click', () => {
        activateStep(index);
      });
    });
    
    // Set up navigation controls
    if (prevButton && nextButton) {
      // Previous button
      prevButton.addEventListener('click', () => {
        if (activeStepIndex > 0) {
          activateStep(activeStepIndex - 1);
        }
      });
      
      // Next button
      nextButton.addEventListener('click', () => {
        if (activeStepIndex < timelineSteps.length - 1) {
          activateStep(activeStepIndex + 1);
        }
      });
      
      // Initial button state
      updateButtonState();
    }
    
    // Function to activate a specific step
    function activateStep(index) {
      // Update active step
      timelineSteps.forEach(step => step.classList.remove('active'));
      timelineSteps[index].classList.add('active');
      
      // Update active index
      activeStepIndex = index;
      
      // Update progress bar
      updateTimelineProgress();
      
      // Update button state
      updateButtonState();
      
      // Scroll into view for mobile
      if (window.innerWidth <= 768) {
        timelineSteps[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
    
    // Function to update timeline progress bar
    function updateTimelineProgress() {
      const progressPercentage = ((activeStepIndex + 1) / timelineSteps.length) * 100;
      timelineProgress.style.width = `${progressPercentage}%`;
    }
    
    // Function to update button state
    function updateButtonState() {
      if (prevButton && nextButton) {
        prevButton.disabled = activeStepIndex === 0;
        nextButton.disabled = activeStepIndex === timelineSteps.length - 1;
      }
    }
  }
  
  /**
   * Comparison Tabs
   * Handles switching between comparison tables
   */
  function initComparisonTabs() {
    const tabButtons = document.querySelectorAll('.comparison-tab');
    const comparisonTables = document.querySelectorAll('.comparison-table');
    
    if (!tabButtons.length || !comparisonTables.length) return;
    
    // Initialize with the first tab active
    let activeCategory = tabButtons[0].getAttribute('data-category');
    
    // Set up tab button click functionality
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Get target category
        const category = this.getAttribute('data-category');
        
        // No need to switch if already active
        if (category === activeCategory) return;
        
        // Update active tab
        tabButtons.forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        
        // Update active category
        activeCategory = category;
        
        // Hide all tables with fade out
        comparisonTables.forEach(table => {
          if (table.classList.contains('active')) {
            // Fade out active table
            table.style.opacity = '0';
            table.style.transform = 'translateY(20px)';
            
            // After animation completes, hide table
            setTimeout(() => {
              table.classList.remove('active');
              
              // Show the selected table with fade in
              const activeTable = document.getElementById(`${category}-comparison`);
              if (activeTable) {
                activeTable.classList.add('active');
                
                // Force reflow to ensure animation works
                void activeTable.offsetWidth;
                
                // Fade in animation
                setTimeout(() => {
                  activeTable.style.opacity = '1';
                  activeTable.style.transform = 'translateY(0)';
                }, 10);
              }
            }, 300);
          }
        });
      });
    });
  }
  
  /**
   * Case Studies Filter
   * Handles filtering the case studies grid
   */
  function initCaseStudiesFilter() {
    const filterButtons = document.querySelectorAll('.case-studies-filter .filter-btn');
    const caseStudyCards = document.querySelectorAll('.case-study-card');
    
    if (!filterButtons.length || !caseStudyCards.length) return;
    
    // Initialize with the "all" filter active
    let activeFilter = 'all';
    
    // Set up filter button click functionality
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Get filter value
        const filterValue = this.getAttribute('data-filter');
        
        // No need to filter if already active
        if (filterValue === activeFilter) return;
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Update active filter
        activeFilter = filterValue;
        
        // Apply filtering with animation
        caseStudyCards.forEach(card => {
          const categories = card.getAttribute('data-category');
          
          if (filterValue === 'all' || categories.includes(filterValue)) {
            // Show card with animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.display = 'flex';
            
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
              card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
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
   * FAQ Accordion
   * Handles expanding and collapsing FAQ items
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqSearch = document.getElementById('faq-search');
    
    if (!faqItems.length) return;
    
    // Initialize with first item open
    if (faqItems.length > 0) {
      setTimeout(() => {
        toggleFaqItem(faqItems[0]);
      }, 500);
    }
    
    // Set up FAQ item click functionality
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      if (question) {
        question.addEventListener('click', () => {
          toggleFaqItem(item);
        });
      }
    });
    
    // Set up FAQ category filtering
    if (faqCategories.length) {
      faqCategories.forEach(category => {
        category.addEventListener('click', function() {
          // Get category value
          const categoryValue = this.getAttribute('data-category');
          
          // Update active category
          faqCategories.forEach(cat => cat.classList.remove('active'));
          this.classList.add('active');
          
          // Filter FAQ items
          filterFaqItems(categoryValue);
        });
      });
    }
    
    // Set up FAQ search
    if (faqSearch) {
      faqSearch.addEventListener('input', function() {
        const searchText = this.value.toLowerCase().trim();
        
        if (searchText.length >= 2) {
          searchFaqItems(searchText);
        } else if (searchText.length === 0) {
          // Reset to show all items
          const activeCategory = document.querySelector('.faq-category.active');
          if (activeCategory) {
            filterFaqItems(activeCategory.getAttribute('data-category'));
          } else {
            filterFaqItems('all');
          }
        }
      });
    }
    
    // Function to toggle FAQ item
    function toggleFaqItem(item) {
      // Check if item is already active
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(faqItem => {
        const answer = faqItem.querySelector('.faq-answer');
        
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        
        faqItem.classList.remove('active');
      });
      
      // Open clicked item if it wasn't already active
      if (!isActive) {
        const answer = item.querySelector('.faq-answer');
        
        // Temporarily set maxHeight to none to get content height
        answer.style.maxHeight = 'none';
        answer.style.opacity = '0';
        const height = answer.offsetHeight;
        answer.style.maxHeight = '0';
        
        // Trigger reflow
        void answer.offsetHeight;
        
        // Add active class and animate opening
        item.classList.add('active');
        answer.style.maxHeight = height + 'px';
        answer.style.opacity = '1';
      }
    }
    
    // Function to filter FAQ items by category
    function filterFaqItems(category) {
      faqItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || category === itemCategory) {
          item.style.display = 'block';
          
          // Animate entrance
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 10);
        } else {
          // Animate exit
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    }
    
    // Function to search FAQ items
    function searchFaqItems(query) {
      let hasResults = false;
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
          item.style.display = 'block';
          
          // Highlight search term
          highlightSearchTerm(item, query);
          
          // Animate entrance
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 10);
          
          hasResults = true;
        } else {
          // Animate exit
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
      
      // Show message if no results
      const noResultsMessage = document.querySelector('.faq-no-results');
      if (noResultsMessage) {
        if (!hasResults) {
          noResultsMessage.style.display = 'block';
        } else {
          noResultsMessage.style.display = 'none';
        }
      }
    }
    
    // Function to highlight search term in FAQ text
    function highlightSearchTerm(item, query) {
      // Reset highlighted text first
      const question = item.querySelector('.faq-question h3');
      const answer = item.querySelector('.faq-answer p');
      
      // Store original text if not already stored
      if (!question.dataset.original) {
        question.dataset.original = question.innerHTML;
      }
      
      if (!answer.dataset.original) {
        answer.dataset.original = answer.innerHTML;
      }
      
      // Restore original text
      question.innerHTML = question.dataset.original;
      answer.innerHTML = answer.dataset.original;
      
      // Highlight the search term
      if (query.length >= 2) {
        const regex = new RegExp(`(${query})`, 'gi');
        question.innerHTML = question.innerHTML.replace(regex, '<mark>$1</mark>');
        answer.innerHTML = answer.innerHTML.replace(regex, '<mark>$1</mark>');
      }
    }
  }
  
  /**
   * Contact Form
   * Handles contact form validation and submission
   */
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      
      // Clear previous error messages
      document.querySelectorAll('.error-message').forEach(error => error.remove());
      
      // Validate required fields
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          showError(field, `Please enter your ${field.getAttribute('name')}`);
          isValid = false;
        }
      });
      
      // Validate email format
      const emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
        showError(emailField, 'Please enter a valid email address');
        isValid = false;
      }
      
      if (isValid) {
        // Form is valid, simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonContent = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<span>Sending</span> <i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
          // Show success animation
          contactForm.style.opacity = '0';
          contactForm.style.transform = 'translateY(-20px)';
          contactForm.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          
          setTimeout(() => {
            // Show success message
            contactForm.innerHTML = `
              <div class="form-success">
                <div class="success-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you shortly.</p>
              </div>
            `;
            
            contactForm.style.opacity = '1';
            contactForm.style.transform = 'translateY(0)';
          }, 500);
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
      
      // Shake animation
      input.style.transform = 'translateX(-5px)';
      setTimeout(() => {
        input.style.transform = 'translateX(0)';
        input.style.transition = 'transform 0.3s ease';
      }, 10);
      
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
   * Tilt Elements
   * Adds 3D tilt effect to elements with tilt-element class
   */
  function initTiltElements() {
    const tiltElements = document.querySelectorAll('.tilt-element');
    
    if (!tiltElements.length) return;
    
    if (typeof VanillaTilt !== 'undefined') {
      // Initialize VanillaTilt
      VanillaTilt.init(tiltElements, {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
        scale: 1.03,
        gyroscope: true
      });
    } else {
      // Load VanillaTilt dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js';
      script.onload = () => {
        VanillaTilt.init(tiltElements, {
          max: 8,
          speed: 400,
          glare: true,
          'max-glare': 0.2,
          scale: 1.03,
          gyroscope: true
        });
      };
      document.head.appendChild(script);
    }
  }
  
  /**
   * Magnetic Buttons
   * Adds magnetic hover effect to buttons
   */
  function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-button');
    
    if (!magneticButtons.length) return;
    
    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', throttle((e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Apply subtle movement
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        
        // Apply more subtle movement to span inside button
        if (button.querySelector('span')) {
          button.querySelector('span').style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        }
        
        // Animate bubbles if present
        if (button.querySelector('.btn-bubbles')) {
          button.querySelector('.btn-bubbles').querySelectorAll('.bubble').forEach(bubble => {
            bubble.style.opacity = '1';
          });
        }
      }, 16));
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
        
        if (button.querySelector('span')) {
          button.querySelector('span').style.transform = 'translate(0, 0)';
        }
        
        // Fade out bubbles if present
        if (button.querySelector('.btn-bubbles')) {
          setTimeout(() => {
            button.querySelector('.btn-bubbles').querySelectorAll('.bubble').forEach(bubble => {
              bubble.style.opacity = '0';
            });
          }, 500);
        }
      });
    });
    
    // Helper throttle function
    function throttle(callback, limit) {
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
    }
  }
  
  /**
   * Scroll Animations
   * Animates elements when they enter the viewport
   */
  function initScrollAnimations() {
    // Only initialize if IntersectionObserver is available
    if (!('IntersectionObserver' in window)) return;
    
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.service-detail-section, .timeline-container, .comparison-tables, .case-studies-grid, .faq-container');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add class to start animation
          entry.target.classList.add('animated');
          
          // Animate children elements with stagger
          const children = entry.target.querySelectorAll('.service-feature-card, .tech-tag, .example-card');
          if (children.length) {
            children.forEach((child, index) => {
              setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
              }, 100 + (index * 50));
            });
          }
          
          // Unobserve after animating
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    // Observe elements
    animatedElements.forEach(element => {
      element.classList.add('to-animate');
      observer.observe(element);
    });
    
    // Add CSS for animations
    addAnimationStyles();
  }
  
  /**
   * Add Animation Styles
   * Dynamically adds CSS for animations
   */
  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .to-animate {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      
      .to-animate.animated {
        opacity: 1;
        transform: translateY(0);
      }
      
      .service-feature-card, .tech-tag, .example-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Animate Elements
   * Animates page elements after loader completes
   */
  function animateElements() {
    // Get elements to animate
    const heroElements = document.querySelectorAll('[data-animation]');
    
    // Animate hero elements
    heroElements.forEach(element => {
      const animationType = element.dataset.animation;
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.visibility = 'visible';
        element.classList.add(animationType);
      }, 100);
    });
    
    // Initialize back to top button
    initBackToTop();
  }
  
  /**
   * Initialize Back to Top button
   */
  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
