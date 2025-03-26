/**
 * Elan's Tech World - Services Page JavaScript File
 * Enhanced with sleek animations and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animation library if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
      mirror: false,
      offset: 120
    });
  } else {
    console.warn('AOS is not loaded. Some animations may not work.');
  }
  
  // Check for GSAP availability
  if (typeof gsap === 'undefined') {
    console.warn('GSAP is not loaded. Some animations may not work properly.');
  }
  
  // Initialize components
  initCounters();
  initServicesFilter();
  initCardTilt();
  initEnhancedServicesGrid();
  addScrollAnimations();
  
  // Initialize Magnetic Buttons from main script
  if (typeof initMagneticButtons === 'function') {
    initMagneticButtons();
  }
});

/**
 * Initialize Services Filter
 */
function initServicesFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (!filterButtons.length || !serviceCards.length) {
    console.warn('Filter buttons or service cards not found.');
    return;
  }
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter service cards
      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          // Show card with animation
          showCard(card);
        } else {
          // Hide card with animation
          hideCard(card);
        }
      });
    });
  });
  
  function showCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.display = 'block';
    
    // Force reflow
    void card.offsetWidth;
    
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  }
  
  function hideCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      card.style.display = 'none';
    }, 300);
  }
}

/**
 * Initialize Card Tilt Effect
 */
function initCardTilt() {
  // Check if VanillaTilt is available
  if (typeof VanillaTilt !== 'undefined') {
    // Get all card elements that should have tilt effect
    const tiltElements = document.querySelectorAll('.featured-service-showcase, .services-intro-image');
    
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }
    
    if (tiltElements.length) {
      // Initialize tilt effect
      VanillaTilt.init(tiltElements, {
        max: 10,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
        gyroscope: false
      });
    }
  } else {
    console.warn('VanillaTilt is not loaded. Tilt effects will not work.');
  }
}

/**
 * Enhanced Services Grid Functionality
 */
function initEnhancedServicesGrid() {
    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceModal = document.getElementById('service-modal');
    
    if (!serviceCards.length) {
        console.warn('Service cards not found.');
        return;
    }
    
    if (!serviceModal) {
        console.warn('Service modal not found. Make sure to add it to your HTML.');
        return;
    }
    
    const serviceModalContent = serviceModal.querySelector('.service-modal-content');
    const serviceModalClose = serviceModal.querySelector('.service-modal-close');
    const serviceModalBackdrop = serviceModal.querySelector('.service-modal-backdrop');
    
    if (!serviceModalContent || !serviceModalClose || !serviceModalBackdrop) {
        console.warn('Service modal elements missing. Check your HTML structure.');
        return;
    }
    
    // Service data for modal content
    const serviceData = {
        'web-design': {
            title: 'Web Design & Development',
            badge: 'Digital Presence',
            subtitle: 'Custom, responsive websites that captivate your audience and drive conversions.',
            description: 'Our web design and development services go beyond aesthetics to create powerful online experiences that engage visitors and convert them into customers. We combine stunning visuals with intuitive user interfaces and robust functionality.',
            features: [
                'Custom, responsive design that works on all devices',
                'User-centric UI/UX design focused on conversions',
                'Content management systems (WordPress, Shopify, custom solutions)',
                'E-commerce functionality with secure payment gateways',
                'SEO optimization for better search visibility',
                'Performance optimization for fast loading times',
                'Accessibility compliance for all users',
                'Ongoing support and maintenance packages'
            ],
            process: 'Our web development process begins with understanding your business goals and target audience. We then create wireframes and prototypes to visualize the user journey before designing and developing your custom website. After thorough testing, we launch your site and provide training on content management.',
            technologies: 'We work with modern web technologies including HTML5, CSS3, JavaScript, React, WordPress, Shopify, WooCommerce, PHP, Node.js, and more depending on your specific needs.',
            imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1080&auto=format&fit=crop'
        },
        'mobile-app': {
            title: 'Mobile App Development',
            badge: 'Mobile Innovation',
            subtitle: 'Native and cross-platform applications that deliver exceptional user experiences.',
            description: 'Our mobile app development services help businesses connect with customers on their most personal devices. We create intuitive, powerful applications that solve real problems and delight users while driving business goals.',
            features: [
                'Native iOS app development (Swift/Objective-C)',
                'Native Android app development (Kotlin/Java)',
                'Cross-platform development (React Native, Flutter)',
                'User-centric UI/UX design optimized for mobile',
                'App Store and Google Play deployment assistance',
                'Push notification implementation',
                'API integration and backend development',
                'Ongoing maintenance and version updates'
            ],
            process: 'Our mobile app development process begins with ideation and concept validation, followed by UI/UX design specifically for mobile interfaces. We then develop, test, and deploy your app to the appropriate stores, providing ongoing support and updates.',
            technologies: 'We work with technologies like Swift, Kotlin, Java, Objective-C, React Native, Flutter, Firebase, and various APIs depending on your project requirements.',
            imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1080&auto=format&fit=crop'
        },
        'pos-system': {
            title: 'POS System Implementation',
            badge: 'Retail Technology',
            subtitle: 'Modern point-of-sale solutions that streamline operations and enhance customer experience.',
            description: 'Our POS system implementation services help retail and service businesses optimize their operations with integrated payment processing, inventory management, and customer relationship tools that improve efficiency and enhance the customer experience.',
            features: [
                'Custom POS setup tailored to your business needs',
                'Hardware selection and configuration',
                'Software integration with your existing systems',
                'Square and Clover specialization',
                'Inventory management setup',
                'Customer database integration',
                'Employee training and documentation',
                'Ongoing technical support'
            ],
            process: 'Our POS implementation begins with a thorough assessment of your business needs and existing systems. We then design a solution, procure and configure hardware, install and customize software, integrate with your existing systems, train your staff, and provide ongoing support.',
            technologies: 'We work with leading POS platforms including Square, Clover, Shopify POS, Lightspeed, Toast, and custom solutions based on your specific requirements.',
            imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1080&auto=format&fit=crop'
        },
        'digital-marketing': {
            title: 'Digital Marketing',
            badge: 'Growth Strategy',
            subtitle: 'Targeted campaigns and strategies that drive traffic, engagement, and conversions.',
            description: 'Our digital marketing services help businesses increase their online visibility, connect with their target audience, and drive meaningful conversions. We create data-driven strategies across multiple channels to maximize your marketing ROI.',
            features: [
                'Comprehensive digital marketing strategy',
                'Search Engine Optimization (SEO)',
                'Pay-Per-Click (PPC) advertising',
                'Social media marketing and management',
                'Content marketing and creation',
                'Email marketing campaigns',
                'Analytics and performance reporting',
                'Conversion rate optimization'
            ],
            process: 'Our digital marketing process starts with research and strategy development tailored to your business goals. We then implement campaigns across appropriate channels, continuously monitor performance, and optimize based on data to ensure maximum ROI.',
            technologies: 'We utilize tools like Google Analytics, Google Ads, Facebook Business Manager, HubSpot, Mailchimp, SEMrush, Ahrefs, and various content management and social media platforms.',
            imageUrl: 'https://images.unsplash.com/photo-1571677246347-5040e8214bd1?q=80&w=1080&auto=format&fit=crop'
        },
        'google-ads': {
            title: 'Google Ads Management',
            badge: 'Paid Advertising',
            subtitle: 'Strategic PPC campaigns that maximize ROI and drive qualified traffic to your business.',
            description: 'Our Google Ads management services help businesses reach potential customers at the exact moment they're searching for your products or services. We create and optimize targeted campaigns that deliver real, measurable results for your business.',
            features: [
                'Custom campaign strategy and setup',
                'Comprehensive keyword research',
                'Ad copy creation and optimization',
                'Landing page recommendations',
                'Audience targeting and remarketing',
                'Conversion tracking setup',
                'A/B testing for continuous improvement',
                'Regular performance reporting'
            ],
            process: 'Our Google Ads management process includes in-depth research, campaign structure planning, compelling ad creation, precise targeting setup, and continuous optimization through regular monitoring and analysis to maximize your return on ad spend.',
            technologies: 'We utilize the full suite of Google Ads tools including Search, Display, Shopping, Video, and App campaigns, along with Google Analytics, Google Tag Manager, and conversion tracking systems.',
            imageUrl: 'https://images.unsplash.com/photo-1573152958734-1922c188fba3?q=80&w=1080&auto=format&fit=crop'
        },
        'property-management': {
            title: 'Property Management Systems',
            badge: 'Real Estate Technology',
            subtitle: 'Comprehensive property management solutions to streamline operations and enhance tenant satisfaction.',
            description: 'Our property management systems help real estate businesses and property managers automate and optimize their operations, from listing and tenant management to maintenance tracking and financial reporting.',
            features: [
                'Custom property management portals',
                'Tenant and owner portals',
                'Online application and screening systems',
                'Rent collection and financial tracking',
                'Maintenance request management',
                'Document management and e-signing',
                'Property listing management',
                'Reporting and analytics tools'
            ],
            process: 'Our property management system implementation begins with analyzing your specific needs and workflows, followed by custom solution design, development, data migration, system integration, staff training, and ongoing support and optimization.',
            technologies: 'We work with various property management platforms and can develop custom solutions using technologies like PHP, MySQL, React, and Node.js integrated with payment processors and document management systems.',
            imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1080&auto=format&fit=crop'
        },
        'print-design': {
            title: 'Print & Graphic Design',
            badge: 'Visual Identity',
            subtitle: 'Professional print materials and brand assets that elevate your business image.',
            description: 'Our print and graphic design services help businesses establish a strong, consistent visual identity across all touchpoints. We create professional marketing materials that communicate your brand values and message effectively.',
            features: [
                'Brand identity development',
                'Logo design and refinement',
                'Business cards, letterheads, and stationery',
                'Brochures, flyers, and catalogs',
                'Signage and banner design',
                'Packaging design',
                'Trade show and event materials',
                'Digital assets for social media and web'
            ],
            process: 'Our design process starts with understanding your brand and objectives, followed by concept development, design creation, revisions based on your feedback, and finally preparation of files for printing or digital use.',
            technologies: 'We utilize industry-standard creative software including Adobe Creative Suite (Photoshop, Illustrator, InDesign) and work with trusted print partners to ensure high-quality production of physical materials.',
            imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1080&auto=format&fit=crop'
        },
        'tech-consulting': {
            title: 'Technology Consulting',
            badge: 'Strategic Guidance',
            subtitle: 'Strategic guidance to optimize your technology infrastructure and drive innovation.',
            description: 'Our technology consulting services help businesses make informed decisions about their technology investments and strategies. We provide expert guidance on digital transformation, IT infrastructure, security, and business process automation.',
            features: [
                'Technology needs assessment',
                'Digital transformation strategy',
                'IT infrastructure planning',
                'Software selection and implementation',
                'Cybersecurity assessment and planning',
                'Business process automation',
                'Cloud migration strategy',
                'Technology roadmap development'
            ],
            process: 'Our technology consulting process includes a comprehensive assessment of your current state, identification of opportunities and challenges, strategic recommendations, implementation planning, and ongoing guidance to ensure successful outcomes.',
            technologies: 'We have expertise across a wide range of technologies including cloud platforms (AWS, Azure, Google Cloud), cybersecurity solutions, business intelligence tools, and enterprise software systems.',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1080&auto=format&fit=crop'
        }
    };
    
    // Add click event to service cards to open modal
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            if (serviceId && serviceData[serviceId]) {
                openServiceModal(serviceId);
            }
        });
        
        // Add hover effects - 3D tilt effect
        card.addEventListener('mousemove', function(e) {
            if (window.matchMedia('(hover: hover)').matches && typeof gsap !== 'undefined') {
                const cardInner = this.querySelector('.service-card-inner');
                const serviceIcon = this.querySelector('.service-icon');
                
                if (!cardInner || !serviceIcon) return;
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate percentage position
                const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
                const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1
                
                try {
                    // Apply subtle rotation (max 3 degrees)
                    gsap.to(cardInner, {
                        rotationY: xPercent * 3,
                        rotationX: yPercent * -3,
                        duration: 0.4,
                        ease: 'power1.out',
                        transformPerspective: 1000
                    });
                    
                    // Move icon slightly
                    gsap.to(serviceIcon, {
                        x: xPercent * 5,
                        y: yPercent * 5,
                        duration: 0.4,
                        ease: 'power1.out'
                    });
                } catch (error) {
                    console.warn('GSAP animation error:', error);
                }
            }
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', function() {
            if (window.matchMedia('(hover: hover)').matches && typeof gsap !== 'undefined') {
                const cardInner = this.querySelector('.service-card-inner');
                const serviceIcon = this.querySelector('.service-icon');
                
                if (!cardInner || !serviceIcon) return;
                
                try {
                    gsap.to(cardInner, {
                        rotationY: 0,
                        rotationX: 0,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.5)'
                    });
                    
                    gsap.to(serviceIcon, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.5)'
                    });
                } catch (error) {
                    console.warn('GSAP animation error:', error);
                }
            }
        });
    });
    
    // Close modal when clicking close button
    if (serviceModalClose) {
        serviceModalClose.addEventListener('click', closeServiceModal);
    }
    
    // Close modal when clicking backdrop
    if (serviceModalBackdrop) {
        serviceModalBackdrop.addEventListener('click', closeServiceModal);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
            closeServiceModal();
        }
    });
    
    /**
     * Open Service Modal
     */
    function openServiceModal(serviceId) {
        if (!serviceModal || !serviceModalContent) return;
        
        // Get service data
        const service = serviceData[serviceId];
        if (!service) return;
        
        // Create modal content
        const modalContent = `
            <div class="service-detail">
                <div class="service-detail-header">
                    <div class="service-detail-badge">${service.badge}</div>
                    <h2 class="service-detail-title">${service.title}</h2>
                    <p class="service-detail-subtitle">${service.subtitle}</p>
                </div>
                <div class="service-detail-body">
                    <div class="service-detail-section">
                        <h3>Overview</h3>
                        <p class="service-detail-text">${service.description}</p>
                    </div>
                    
                    <div class="service-detail-section">
                        <h3>What We Offer</h3>
                        <ul class="service-detail-list">
                            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="service-detail-section">
                        <h3>Our Process</h3>
                        <p class="service-detail-text">${service.process}</p>
                    </div>
                    
                    <div class="service-detail-section">
                        <h3>Technologies</h3>
                        <p class="service-detail-text">${service.technologies}</p>
                    </div>
                    
                    <div class="service-detail-cta">
                        <a href="#contact" class="btn-primary magnetic-button" onclick="closeServiceModal()">
                            <span>Discuss Your Project</span>
                            <div class="btn-bubbles">
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                                <div class="bubble"></div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Add content to modal
        serviceModalContent.innerHTML = modalContent;
        
        // Show modal with animation
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        serviceModal.classList.add('active');
        
        // Initialize magnetic button in modal
        if (typeof initMagneticButtons === 'function') {
            setTimeout(() => {
                initMagneticButtons();
            }, 300);
        }
    }
    
    /**
     * Close Service Modal
     */
    function closeServiceModal() {
        if (!serviceModal) return;
        
        // Hide modal with animation
        serviceModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
        
        // Clear modal content after animation
        setTimeout(() => {
            if (serviceModalContent) {
                serviceModalContent.innerHTML = '';
            }
        }, 400);
    }
    
    // Export the closeServiceModal function to make it globally accessible
    window.closeServiceModal = closeServiceModal;
}

/**
 * Counter Animation for Statistics
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  // Set up intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target') || '0');
        let count = 0;
        const duration = 2000; // 2 seconds
        const interval = 20; // 20ms between updates
        const increment = Math.ceil(target / (duration / interval));
        
        const updateCount = () => {
          if (count < target) {
            count = Math.min(count + increment, target);
            counter.textContent = count.toString();
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target.toString();
          }
        };
        
        updateCount();
        
        // Add pulse animation to parent element if found
        const statBox = counter.closest('.stat-box');
        if (statBox) {
          statBox.classList.add('pulse-animation');
          
          // Remove pulse after animation completes
          setTimeout(() => {
            statBox.classList.remove('pulse-animation');
          }, 1500);
        }
        
        // Unobserve after animating
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  // Observe each counter
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

/**
 * Add Scroll Animations
 */
function addScrollAnimations() {
  // Parallax effect for hero section
  const heroSection = document.querySelector('.services-hero');
  const heroContent = document.querySelector('.services-hero-content');
  
  if (heroSection && heroContent) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      // Parallax effect - content moves slower than background
      if (scrollY <= heroSection.offsetHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    });
  }
  
  // Process steps animation
  const processSteps = document.querySelectorAll('.process-step');
  
  if (processSteps.length) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const step = entry.target;
          const number = step.querySelector('.process-step-number');
          
          // Animate number
          if (number) {
            number.style.transform = 'scale(1.2) rotate(-10deg)';
            setTimeout(() => {
              number.style.transform = 'scale(1) rotate(0)';
              number.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, 400);
          }
          
          // Add highlight effect to content
          const content = step.querySelector('.process-step-content');
          if (content) {
            content.style.boxShadow = 'var(--shadow-md)';
            content.style.transform = 'translateY(-5px)';
            content.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            // Reset after animation
            setTimeout(() => {
              content.style.boxShadow = 'var(--shadow-sm)';
              content.style.transform = 'translateY(0)';
            }, 2000);
          }
          
          // Unobserve after animation
          processObserver.unobserve(step);
        }
      });
    }, { threshold: 0.3 });
    
    // Observe each process step
    processSteps.forEach(step => {
      processObserver.observe(step);
    });
  }
  
  // Animate testimonial spotlight
  const testimonialSection = document.querySelector('.testimonial-spotlight');
  const testimonialQuote = document.querySelector('.testimonial-spotlight-quote');
  
  if (testimonialSection && testimonialQuote) {
    const testimonialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Text reveal animation
          testimonialQuote.style.opacity = '0';
          testimonialQuote.style.transform = 'translateY(30px)';
          
          setTimeout(() => {
            testimonialQuote.style.opacity = '1';
            testimonialQuote.style.transform = 'translateY(0)';
            testimonialQuote.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
          }, 300);
          
          // Add subtle background animation
          testimonialSection.classList.add('animate-bg');
          
          // Unobserve after animation
          testimonialObserver.unobserve(testimonialSection);
        }
      });
    }, { threshold: 0.3 });
    
    // Observe testimonial section
    testimonialObserver.observe(testimonialSection);
  }
}

/**
 * Add CSS class for animation when elements enter viewport
 */
window.addEventListener('scroll', function() {
  const animatedElements = document.querySelectorAll('.service-card, .stat-box, .process-step');
  
  animatedElements.forEach(element => {
    const position = element.getBoundingClientRect();
    
    // Check if element is in viewport
    if (position.top < window.innerHeight * 0.8 && position.bottom >= 0) {
      element.classList.add('in-view');
    }
  });
});

/**
 * Add pulse animation keyframes dynamically if they don't exist
 */
function addPulseAnimation() {
  if (!document.getElementById('pulse-animation-keyframes')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation-keyframes';
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .pulse-animation {
        animation: pulse 1.5s ease;
      }
      
      /* Add background animation for testimonial section */
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .animate-bg .testimonial-spotlight-overlay {
        background: linear-gradient(270deg, rgba(0, 122, 255, 0.9), rgba(0, 82, 255, 0.9), rgba(122, 0, 255, 0.9));
        background-size: 200% 200%;
        animation: gradientShift 10s ease infinite;
      }
      
      /* Animation for in-view elements */
      .service-card.in-view .service-card-inner {
        box-shadow: var(--shadow-lg);
      }
      
      .stat-box.in-view {
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);
        border-color: var(--primary-light);
      }
    `;
    document.head.appendChild(style);
  }
}

// Add animations on load
addPulseAnimation();
