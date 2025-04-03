/**
 * Elan's Tech World - Services Page JavaScript
 * Enhanced with smooth animations and interactive elements
 */

/*======================================
  1. CONFIGURATION AND INITIALIZATION
======================================*/

// Global configuration
const servicesConfig = {
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

// DOM element cache for services page
const servicesDOM = {};

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements
  cacheServicesDOM();
  
  // Initialize components
  initServicesLoader();
  initParticles();
  initServiceNavigation();
  initShowcaseTabs();
  initMobileAppPreview();
  initPOSDemo();
  initServicesAnimations();
  initServicesFAQ();
  
  // Initialize AOS animations if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 50
    });
  }
});

/**
 * Cache DOM elements for services page
 */
function cacheServicesDOM() {
  // Navigation elements
  servicesDOM.serviceNavTrack = document.getElementById('serviceNavTrack');
  servicesDOM.serviceNavItems = document.querySelectorAll('.service-nav-item');
  servicesDOM.serviceNavPrev = document.querySelector('.service-nav-prev');
  servicesDOM.serviceNavNext = document.querySelector('.service-nav-next');
  
  // Showcase tabs
  servicesDOM.showcaseTabs = document.querySelectorAll('.showcase-tab');
  servicesDOM.showcasePanels = document.querySelectorAll('.showcase-panel');
  
  // Mobile app preview
  servicesDOM.appScreens = document.querySelectorAll('.app-screens img');
  servicesDOM.screenNavDots = document.querySelectorAll('.screen-nav-dot');
  
  // POS Demo
  servicesDOM.posItems = document.querySelectorAll('.pos-item');
  servicesDOM.orderItems = document.getElementById('orderItems');
  servicesDOM.orderSubtotal = document.getElementById('orderSubtotal');
  servicesDOM.orderTax = document.getElementById('orderTax');
  servicesDOM.orderTotal = document.getElementById('orderTotal');
  servicesDOM.cancelOrder = document.getElementById('cancelOrder');
  servicesDOM.checkoutOrder = document.getElementById('checkoutOrder');
  servicesDOM.posCategories = document.querySelectorAll('.pos-category');
  
  // FAQ elements
  servicesDOM.faqItems = document.querySelectorAll('.faq-item');
}

/*======================================
  2. PAGE LOADER
======================================*/

/**
 * Initialize Services Page Loader
 */
function initServicesLoader() {
  const loader = document.querySelector('.loader-container');
  const progressBar = document.querySelector('.loader-progress-bar');
  const percentage = document.querySelector('.loader-percentage');
  const loaderMessages = [
    'Loading Digital Services...',
    'Preparing Interactive Elements...',
    'Almost Ready...'
  ];
  const loaderMessage = document.querySelector('.loader-message');
  
  if (!loader || !progressBar) return;
  
  // Show initial message
  loaderMessage.textContent = loaderMessages[0];
  
  let progress = 0;
  let messageIndex = 0;
  
  // Update loader message less frequently
  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % loaderMessages.length;
    loaderMessage.textContent = loaderMessages[messageIndex];
  }, 400);
  
  // Progress animation with optimized intervals
  const interval = setInterval(() => {
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
      loaderMessage.textContent = 'Explore Our Services!';
      
      // Hide loader with fade
      setTimeout(() => {
        loader.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
        loader.classList.add('hidden');
        document.body.style.overflow = 'visible';
        
        // Initialize animations after loader is hidden
        if (window.gsap) {
          animateHeroElements();
        }
      }, 200);
    }
    
    // Update progress bar and percentage
    progressBar.style.width = `${progress}%`;
    percentage.textContent = `${Math.round(progress)}%`;
  }, 30);
  
  // Prevent scroll during loading
  document.body.style.overflow = 'hidden';
}

/*======================================
  3. PARTICLES BACKGROUND
======================================*/

/**
 * Initialize Particles.js Background
 */
function initParticles() {
  if (typeof particlesJS === 'undefined' || !document.getElementById('particles-js')) return;
  
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        }
      },
      "opacity": {
        "value": 0.3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 0.5,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 2,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.2,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 0.5
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
}

/*======================================
  4. SERVICE NAVIGATION
======================================*/

/**
 * Initialize Service Navigation
 */
function initServiceNavigation() {
  if (!servicesDOM.serviceNavTrack || !servicesDOM.serviceNavItems.length) return;
  
  // Scroll to active service section on page load
  setTimeout(() => {
    const activeNavItem = document.querySelector('.service-nav-item.active');
    if (activeNavItem) {
      const targetId = activeNavItem.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        scrollToSection(targetElement);
      }
    }
  }, 500);
  
  // Handle navigation item clicks
  servicesDOM.serviceNavItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update active state
      servicesDOM.serviceNavItems.forEach(navItem => {
        navItem.classList.remove('active');
      });
      this.classList.add('active');
      
      // Scroll to target section
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        scrollToSection(targetElement);
      }
    });
  });
  
  // Navigation arrows for mobile scrolling
  if (servicesDOM.serviceNavPrev && servicesDOM.serviceNavNext) {
    servicesDOM.serviceNavPrev.addEventListener('click', () => {
      servicesDOM.serviceNavTrack.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    });
    
    servicesDOM.serviceNavNext.addEventListener('click', () => {
      servicesDOM.serviceNavTrack.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    });
  }
  
  // Update active nav item based on scroll position
  window.addEventListener('scroll', debounce(updateActiveNavItem, 100));
  
  /**
   * Scroll to target section with offset
   */
  function scrollToSection(element) {
    if (!element) return;
    
    const navHeight = document.querySelector('.service-categories-nav').offsetHeight;
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  
  /**
   * Update active navigation item based on scroll position
   */
  function updateActiveNavItem() {
    // Get all service sections
    const serviceSections = document.querySelectorAll('.service-detail-section');
    if (!serviceSections.length) return;
    
    // Get current scroll position with offset for nav height
    const navHeight = document.querySelector('.service-categories-nav').offsetHeight;
    const scrollPosition = window.pageYOffset + navHeight + 50;
    
    // Find the current active section
    let currentSection = null;
    
    // Loop through sections to find which one is in view
    serviceSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section;
      }
    });
    
    // Update active nav item
    if (currentSection) {
      const sectionId = currentSection.getAttribute('id');
      
      servicesDOM.serviceNavItems.forEach(item => {
        item.classList.remove('active');
        
        if (item.getAttribute('href') === `#${sectionId}`) {
          item.classList.add('active');
          
          // Scroll the nav item into view if it's not visible
          const itemRect = item.getBoundingClientRect();
          const trackRect = servicesDOM.serviceNavTrack.getBoundingClientRect();
          
          if (itemRect.left < trackRect.left || itemRect.right > trackRect.right) {
            item.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
            });
          }
        }
      });
    }
  }
}

/*======================================
  5. SHOWCASE TABS
======================================*/

/**
 * Initialize Showcase Tabs
 */
function initShowcaseTabs() {
  if (!servicesDOM.showcaseTabs.length || !servicesDOM.showcasePanels.length) return;
  
  servicesDOM.showcaseTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Get target tab
      const target = this.getAttribute('data-tab');
      
      // Update active tab
      servicesDOM.showcaseTabs.forEach(t => {
        t.classList.remove('active');
      });
      this.classList.add('active');
      
      // Update active panel with smooth transition
      servicesDOM.showcasePanels.forEach(panel => {
        // Start fade out for all panels
        if (panel.classList.contains('active')) {
          panel.style.opacity = '0';
          panel.style.transform = 'translateY(20px)';
          
          // After animation, hide the panel and show the target
          setTimeout(() => {
            panel.classList.remove('active');
            
            // Show target panel
            const targetPanel = document.getElementById(`${target}-panel`);
            if (targetPanel) {
              targetPanel.classList.add('active');
              
              // Force reflow
              void targetPanel.offsetWidth;
              
              // Fade in
              setTimeout(() => {
                targetPanel.style.opacity = '1';
                targetPanel.style.transform = 'translateY(0)';
              }, 10);
            }
          }, 300);
        }
      });
    });
  });
}

/*======================================
  6. MOBILE APP PREVIEW
======================================*/

/**
 * Initialize Mobile App Preview
 */
function initMobileAppPreview() {
  if (!servicesDOM.appScreens.length || !servicesDOM.screenNavDots.length) return;
  
  // Set up automatic slideshow
  let currentScreen = 0;
  let screenInterval;
  
  function showScreen(index) {
    // Update screens
    servicesDOM.appScreens.forEach(screen => {
      screen.classList.remove('active');
    });
    servicesDOM.appScreens[index].classList.add('active');
    
    // Update navigation dots
    servicesDOM.screenNavDots.forEach(dot => {
      dot.classList.remove('active');
    });
    servicesDOM.screenNavDots[index].classList.add('active');
  }
  
  function startScreenSlideshow() {
    screenInterval = setInterval(() => {
      currentScreen = (currentScreen + 1) % servicesDOM.appScreens.length;
      showScreen(currentScreen);
    }, 3000);
  }
  
  function stopScreenSlideshow() {
    clearInterval(screenInterval);
  }
  
  // Initialize first screen
  showScreen(0);
  startScreenSlideshow();
  
  // Handle navigation dot clicks
  servicesDOM.screenNavDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopScreenSlideshow();
      currentScreen = index;
      showScreen(currentScreen);
      startScreenSlideshow();
    });
  });
  
  // Pause slideshow on hover
  const deviceMockup = document.querySelector('.mobile-device-mockup');
  if (deviceMockup) {
    deviceMockup.addEventListener('mouseenter', stopScreenSlideshow);
    deviceMockup.addEventListener('mouseleave', startScreenSlideshow);
  }
}

/*======================================
  7. POS DEMO
======================================*/

/**
 * Initialize POS Demo
 */
function initPOSDemo() {
  if (!servicesDOM.posItems.length || !servicesDOM.orderItems) return;
  
  // Order data
  let orderData = {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0
  };
  
  // Format currency
  function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
  }
  
  // Update order display
  function updateOrderDisplay() {
    // Update order items
    if (orderData.items.length === 0) {
      servicesDOM.orderItems.innerHTML = `
        <div class="pos-empty-order">
          <i class="fas fa-shopping-basket"></i>
          <p>No items yet.<br>Click items to add them.</p>
        </div>
      `;
    } else {
      let itemsHTML = '';
      orderData.items.forEach((item, index) => {
        itemsHTML += `
          <div class="pos-order-item">
            <div class="pos-order-item-info">
              <div class="pos-order-item-name">${item.name}</div>
              <div class="pos-order-item-price">${formatCurrency(item.price)}</div>
            </div>
            <div class="pos-item-actions">
              <button class="remove-item" data-index="${index}">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        `;
      });
      servicesDOM.orderItems.innerHTML = itemsHTML;
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          removeOrderItem(index);
        });
      });
    }
    
    // Update totals
    if (servicesDOM.orderSubtotal) servicesDOM.orderSubtotal.textContent = formatCurrency(orderData.subtotal);
    if (servicesDOM.orderTax) servicesDOM.orderTax.textContent = formatCurrency(orderData.tax);
    if (servicesDOM.orderTotal) servicesDOM.orderTotal.textContent = formatCurrency(orderData.total);
  }
  
  // Calculate order totals
  function calculateTotals() {
    orderData.subtotal = orderData.items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    orderData.tax = orderData.subtotal * 0.08; // 8% tax
    orderData.total = orderData.subtotal + orderData.tax;
  }
  
  // Add item to order
  function addOrderItem(item) {
    orderData.items.push(item);
    calculateTotals();
    updateOrderDisplay();
    
    // Animate the added item
    if (window.gsap) {
      gsap.from('.pos-order-item:last-child', {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
  
  // Remove item from order
  function removeOrderItem(index) {
    orderData.items.splice(index, 1);
    calculateTotals();
    updateOrderDisplay();
  }
  
  // Handle POS item clicks
  servicesDOM.posItems.forEach(item => {
    item.addEventListener('click', function() {
      const name = this.querySelector('.pos-item-name').textContent;
      const price = parseFloat(this.getAttribute('data-price'));
      
      addOrderItem({ name, price });
      
      // Animate the clicked item
      if (window.gsap) {
        gsap.to(this, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut'
        });
      }
    });
  });
  
  // Handle category clicks
  servicesDOM.posCategories.forEach(category => {
    category.addEventListener('click', function() {
      // Update active category
      servicesDOM.posCategories.forEach(cat => {
        cat.classList.remove('active');
      });
      this.classList.add('active');
      
      // In a real app, we would filter items based on category
      // For demo purposes, we'll just animate the items
      if (window.gsap) {
        gsap.from('.pos-item', {
          y: 10,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out'
        });
      }
    });
  });
  
  // Handle cancel order button
  if (servicesDOM.cancelOrder) {
    servicesDOM.cancelOrder.addEventListener('click', function() {
      if (orderData.items.length === 0) return;
      
      // Confirm cancel
      if (confirm('Are you sure you want to cancel this order?')) {
        orderData.items = [];
        calculateTotals();
        updateOrderDisplay();
      }
    });
  }
  
  // Handle checkout button
  if (servicesDOM.checkoutOrder) {
    servicesDOM.checkoutOrder.addEventListener('click', function() {
      if (orderData.items.length === 0) {
        alert('Please add items to your order before checking out.');
        return;
      }
      
      // In a real app, this would process the payment
      // For demo purposes, we'll just show a success message
      alert(`Order processed successfully!\nTotal: ${formatCurrency(orderData.total)}`);
      
      // Reset order
      orderData.items = [];
      calculateTotals();
      updateOrderDisplay();
    });
  }
  
  // Initialize order display
  updateOrderDisplay();
}

/*======================================
  8. ANIMATIONS
======================================*/

/**
 * Animate Hero Elements
 */
function animateHeroElements() {
  if (!window.gsap) return;
  
  const heroElements = [
    '.services-hero-badge',
    '.services-hero-title',
    '.services-hero-description',
    '.services-nav-scroll'
  ];
  
  gsap.set(heroElements, { y: 30, opacity: 0 });
  
  gsap.to(heroElements, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    delay: 0.2
  });
  
  // Animate hero shapes
  gsap.from('.services-hero-shape', {
    scale: 0.5,
    opacity: 0,
    duration: 1.5,
    stagger: 0.3,
    ease: 'power3.out'
  });
}

/**
 * Initialize Service Page Animations
 */
function initServicesAnimations() {
  // Use Intersection Observer for scroll-based animations if AOS is not available
  if (typeof AOS === 'undefined') {
    const animatedElements = document.querySelectorAll('.feature-card, .service-testimonial, .service-cta');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Apply tilt effect to feature cards if VanillaTilt is available
  if (typeof VanillaTilt !== 'undefined' && !servicesConfig.isTouchDevice) {
    VanillaTilt.init(document.querySelectorAll('.feature-card'), {
      max: 5,
      speed: 400,
      glare: true,
      'max-glare': 0.2,
      scale: 1.02
    });
  }
}

/*======================================
  9. FAQ SECTION
======================================*/

/**
 * Initialize Services FAQ Accordion
 */
function initServicesFAQ() {
  if (!servicesDOM.faqItems.length) return;
  
  servicesDOM.faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        // Check if item is already active
        const isActive = item.classList.contains('active');
        
        // Close all items
        servicesDOM.faqItems.forEach(faqItem => {
          const answer = faqItem.querySelector('.faq-answer');
          if (!answer) return;
          
          if (window.gsap) {
            gsap.to(answer, {
              maxHeight: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out',
              onComplete: () => {
                faqItem.classList.remove('active');
              }
            });
          } else {
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
            answer.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
            
            setTimeout(() => {
              faqItem.classList.remove('active');
            }, 300);
          }
        });
        
        // Open clicked item if it wasn't already active
        if (!isActive) {
          const answer = item.querySelector('.faq-answer');
          if (!answer) return;
          
          if (window.gsap) {
            // Get the content height
            item.classList.add('active');
            answer.style.opacity = '0';
            answer.style.maxHeight = 'none';
            const height = answer.offsetHeight;
            answer.style.maxHeight = '0';
            
            // Animate opening
            gsap.to(answer, {
              maxHeight: height,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out'
            });
          } else {
            // Fallback without GSAP
            item.classList.add('active');
            
            // Temporarily set maxHeight to none to get content height
            answer.style.maxHeight = 'none';
            answer.style.opacity = '0';
            const height = answer.offsetHeight;
            answer.style.maxHeight = '0';
            
            // Trigger reflow
            void answer.offsetHeight;
            
            // Animate opening
            answer.style.maxHeight = height + 'px';
            answer.style.opacity = '1';
            answer.style.transition = 'max-height 0.5s ease, opacity 0.5s ease';
          }
        }
      });
    }
  });
  
  // Open first FAQ item by default with a slight delay
  setTimeout(() => {
    if (servicesDOM.faqItems.length > 0) {
      const firstQuestion = servicesDOM.faqItems[0].querySelector('.faq-question');
      if (firstQuestion) {
        firstQuestion.click();
      }
    }
  }, 500);
}

/*======================================
  10. UTILITY FUNCTIONS
======================================*/

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Throttle function to limit how often a function can be called
 */
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

/**
 * Generate random number between min and max
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
