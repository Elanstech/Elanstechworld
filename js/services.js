/**
 * Elan's Tech World - Services Page JavaScript
 * Enhanced with modernized service showcase section and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Remove preload class to enable animations
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);

    // Initialize core functionality
    initAnimations();
    initServicesSection(); // Initialize the new services showcase
    createServiceParticles(); // Create particles effect for background
    initServicesFilter();
    initCardFlip();
    initCounters();
    initParallaxEffects();
    initScrollAnimations();
    initIntersectionObserver(); // Initialize observer for animation on scroll
    
    // Handle window resize for responsive layouts
    window.addEventListener('resize', helpers.debounce(() => {
        handleServiceTabsOverflow();
    }, 250));
});

/**
 * Initialize animations for elements with data-animation attribute
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    animatedElements.forEach(element => {
        // Skip elements that will be handled by other animation functions
        if (element.closest('.services-showcase')) return;
        
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Get animation delay if specified
        const delay = element.getAttribute('data-animation-delay') || 0;
        
        // Create observer
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, delay);
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe element
        observer.observe(element);
    });
}

/**
 * Initialize the services section functionality
 */
function initServicesSection() {
    const serviceNavItems = document.querySelectorAll('.service-nav-item');
    const serviceContents = document.querySelectorAll('.service-content');
    
    if (!serviceNavItems.length || !serviceContents.length) return;
    
    // Add click event to each service navigation item
    serviceNavItems.forEach(navItem => {
        navItem.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            
            // Update active state for nav items
            serviceNavItems.forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            // Display the corresponding service content with animation
            showServiceContent(serviceType);
            
            // Add hover effect to service cards
            initServiceCardEffects();
            
            // Track click for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'service_tab_click', {
                    'event_category': 'service_navigation',
                    'event_label': serviceType
                });
            }
        });
        
        // Add subtle hover effect to nav items
        navItem.addEventListener('mouseenter', function() {
            if (window.gsap) {
                gsap.to(this, {
                    y: -5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                this.style.transform = 'translateY(-5px)';
                this.style.transition = 'transform 0.3s ease';
            }
        });
        
        navItem.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                if (window.gsap) {
                    gsap.to(this, {
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    this.style.transform = 'translateY(0)';
                    this.style.transition = 'transform 0.3s ease';
                }
            }
        });
    });
    
    /**
     * Display the selected service content with animation
     */
    function showServiceContent(serviceType) {
        const targetContent = document.getElementById(`${serviceType}-content`);
        
        if (!targetContent) return;
        
        // Hide all service contents with fade out animation
        serviceContents.forEach(content => {
            if (content.classList.contains('active')) {
                // Using GSAP if available, otherwise fallback to CSS
                if (window.gsap) {
                    gsap.to(content, {
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        onComplete: () => {
                            content.classList.remove('active');
                            
                            // Show target content with animation
                            targetContent.classList.add('active');
                            gsap.fromTo(
                                targetContent,
                                { opacity: 0, y: 20 },
                                { 
                                    opacity: 1, 
                                    y: 0, 
                                    duration: 0.5, 
                                    ease: 'power2.out',
                                    onComplete: () => {
                                        // Animate service cards with staggered animation
                                        animateServiceCards(targetContent);
                                    }
                                }
                            );
                        }
                    });
                } else {
                    // CSS fallback
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        content.classList.remove('active');
                        
                        // Show target content with animation
                        targetContent.classList.add('active');
                        
                        setTimeout(() => {
                            animateServiceCards(targetContent);
                        }, 100);
                    }, 300);
                }
            }
        });
        
        // If no active content, show target immediately
        if (!document.querySelector('.service-content.active')) {
            targetContent.classList.add('active');
            
            if (window.gsap) {
                gsap.fromTo(
                    targetContent,
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5, 
                        ease: 'power2.out',
                        onComplete: () => {
                            animateServiceCards(targetContent);
                        }
                    }
                );
            } else {
                setTimeout(() => {
                    animateServiceCards(targetContent);
                }, 100);
            }
        }
    }
    
    /**
     * Animate service cards with staggered animation
     */
    function animateServiceCards(container) {
        const cards = container.querySelectorAll('.service-card');
        
        if (!cards.length) return;
        
        if (window.gsap) {
            // Staggered animation with GSAP
            gsap.fromTo(
                cards,
                { 
                    opacity: 0, 
                    y: 30,
                    scale: 0.95
                },
                { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    duration: 0.6, 
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        } else {
            // CSS fallback with setTimeout
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px) scale(0.95)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, 100 + (index * 100));
            });
        }
    }
    
    // Activate first tab by default
    if (serviceNavItems.length > 0) {
        serviceNavItems[0].click();
    }
}

/**
 * Initialize service card hover effects
 */
function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Skip if already initialized
        if (card.dataset.initialized === 'true') return;
        
        // Mark as initialized
        card.dataset.initialized = 'true';
        
        // Add mousemove effect for 3D hover
        card.addEventListener('mousemove', function(e) {
            if (!window.matchMedia('(hover: hover)').matches) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate percentage position
            const xPercent = x / rect.width - 0.5;
            const yPercent = y / rect.height - 0.5;
            
            // Apply subtle rotation based on mouse position
            if (window.gsap) {
                gsap.to(card, {
                    rotateY: xPercent * 5,
                    rotateX: yPercent * -5,
                    transformPerspective: 1000,
                    duration: 0.5,
                    ease: 'power1.out'
                });
                
                // Animate icon
                const icon = card.querySelector('.service-card-icon');
                if (icon) {
                    gsap.to(icon, {
                        x: xPercent * 10,
                        y: yPercent * 10,
                        duration: 0.5,
                        ease: 'power1.out'
                    });
                }
                
                // Move tech tags slightly
                const techTags = card.querySelectorAll('.tech-tag');
                if (techTags.length) {
                    gsap.to(techTags, {
                        x: xPercent * 5,
                        y: yPercent * 5,
                        duration: 0.5,
                        ease: 'power1.out',
                        stagger: 0.02
                    });
                }
            } else {
                // CSS fallback
                card.style.transform = `perspective(1000px) rotateY(${xPercent * 5}deg) rotateX(${yPercent * -5}deg)`;
                
                const icon = card.querySelector('.service-card-icon');
                if (icon) {
                    icon.style.transform = `translate(${xPercent * 10}px, ${yPercent * 10}px)`;
                }
            }
        });
        
        // Reset on mouseleave
        card.addEventListener('mouseleave', function() {
            if (window.gsap) {
                gsap.to(card, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.7,
                    ease: 'power2.out'
                });
                
                // Reset icon position
                const icon = card.querySelector('.service-card-icon');
                if (icon) {
                    gsap.to(icon, {
                        x: 0,
                        y: 0,
                        duration: 0.7,
                        ease: 'power2.out'
                    });
                }
                
                // Reset tech tags
                const techTags = card.querySelectorAll('.tech-tag');
                if (techTags.length) {
                    gsap.to(techTags, {
                        x: 0,
                        y: 0,
                        duration: 0.7,
                        ease: 'power2.out',
                        stagger: 0
                    });
                }
            } else {
                // CSS fallback
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
                
                const icon = card.querySelector('.service-card-icon');
                if (icon) {
                    icon.style.transform = 'translate(0, 0)';
                }
            }
        });
        
        // Button hover effect
        const button = card.querySelector('.service-card-btn');
        if (button) {
            button.addEventListener('mouseenter', function() {
                const buttonIcon = button.querySelector('i');
                if (buttonIcon && window.gsap) {
                    gsap.to(buttonIcon, {
                        x: 5,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else if (buttonIcon) {
                    buttonIcon.style.transform = 'translateX(5px)';
                    buttonIcon.style.transition = 'transform 0.3s ease';
                }
            });
            
            button.addEventListener('mouseleave', function() {
                const buttonIcon = button.querySelector('i');
                if (buttonIcon && window.gsap) {
                    gsap.to(buttonIcon, {
                        x: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else if (buttonIcon) {
                    buttonIcon.style.transform = 'translateX(0)';
                    buttonIcon.style.transition = 'transform 0.3s ease';
                }
            });
        }
    });
}

/**
 * Create animated particles in the background
 */
function createServiceParticles() {
    const particlesContainer = document.querySelector('.services-particles');
    if (!particlesContainer) return;
    
    // Create particles
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        
        // Random size
        const size = Math.random() * 4 + 2;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random opacity
        const opacity = Math.random() * 0.4 + 0.1;
        
        // Random color
        const colors = [
            `rgba(0, 122, 255, ${opacity})`,
            `rgba(255, 122, 0, ${opacity})`,
            `rgba(122, 0, 255, ${opacity})`
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation duration and delay
        const duration = Math.random() * 60 + 20;
        const delay = Math.random() * 10;
        
        // Set styles
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = color;
        particle.style.top = `${posY}%`;
        particle.style.left = `${posX}%`;
        particle.style.opacity = opacity;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        particle.style.zIndex = '-1';
        
        // Set animation
        particle.style.animation = `floatParticle ${duration}s infinite alternate-reverse ease-in-out ${delay}s`;
        
        // Add to container
        container.appendChild(particle);
        
        // Add animation keyframes if not already added
        if (!document.getElementById('particleAnimation')) {
            const style = document.createElement('style');
            style.id = 'particleAnimation';
            style.textContent = `
                @keyframes floatParticle {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    100% {
                        transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${Math.random() * 0.5 + 0.8});
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove and re-create particle after a while to keep the animation fresh
        setTimeout(() => {
            particle.remove();
            createParticle(container);
        }, duration * 1000 + delay * 1000);
    }
}

/**
 * Handle service tabs overflow for mobile view
 */
function handleServiceTabsOverflow() {
    const tabsTrack = document.querySelector('.services-nav-track');
    if (!tabsTrack) return;
    
    // Add scroll indicators if tabs overflow
    if (tabsTrack.scrollWidth > tabsTrack.clientWidth) {
        tabsTrack.classList.add('has-overflow');
        
        // Add scroll event to show/hide indicators
        tabsTrack.addEventListener('scroll', function() {
            const isAtStart = tabsTrack.scrollLeft <= 10;
            const isAtEnd = tabsTrack.scrollLeft + tabsTrack.clientWidth >= tabsTrack.scrollWidth - 10;
            
            if (isAtStart) {
                tabsTrack.classList.remove('show-left-indicator');
            } else {
                tabsTrack.classList.add('show-left-indicator');
            }
            
            if (isAtEnd) {
                tabsTrack.classList.remove('show-right-indicator');
            } else {
                tabsTrack.classList.add('show-right-indicator');
            }
        });
        
        // Initial check
        tabsTrack.dispatchEvent(new Event('scroll'));
    } else {
        tabsTrack.classList.remove('has-overflow', 'show-left-indicator', 'show-right-indicator');
    }
}

/**
 * Initialize legacy Services Filter for compatibility
 */
function initServicesFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card:not(.services-showcase .service-card)');
    
    if (!filterButtons.length || !serviceCards.length) return;
    
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
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'block';
                        
                        // Force reflow
                        void card.offsetWidth;
                        
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
 * Initialize Card Flip for mobile devices
 */
function initCardFlip() {
    // Check if we're on a touch device
    const isTouchDevice = 'ontouchstart' in window || 
                        navigator.maxTouchPoints > 0 || 
                        navigator.msMaxTouchPoints > 0;
    
    // Legacy card flip functionality
    if (isTouchDevice) {
        const legacyServiceCards = document.querySelectorAll('.service-card-inner');
        
        legacyServiceCards.forEach(card => {
            card.addEventListener('click', function() {
                // Toggle flipped state
                if (this.style.transform === 'rotateY(180deg)') {
                    this.style.transform = 'rotateY(0deg)';
                } else {
                    this.style.transform = 'rotateY(180deg)';
                }
            });
        });
    }
    
    // Initialize tilt effect for desktop if vanilla-tilt is available
    if (typeof VanillaTilt !== 'undefined' && !isTouchDevice) {
        // Get all card elements that should have tilt effect
        const tiltElements = document.querySelectorAll('.tilt-element');
        
        // Initialize tilt effect
        VanillaTilt.init(tiltElements, {
            max: 10,
            speed: 400,
            glare: true,
            'max-glare': 0.3,
            scale: 1.05
        });
    }
}

/**
 * Initialize counter animation
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (!counters.length) return;
    
    // Create observer for counters
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                
                // Calculate animation speed based on target value
                const duration = 2000; // 2 seconds
                const interval = 20; // Update every 20ms
                const steps = duration / interval;
                const increment = target / steps;
                
                // Start counter animation
                const updateCounter = setInterval(() => {
                    count += increment;
                    
                    // Set counter value as integer
                    counter.textContent = Math.min(Math.floor(count), target);
                    
                    // Check if target reached
                    if (count >= target) {
                        counter.textContent = target;
                        clearInterval(updateCounter);
                        
                        // Add pulse effect
                        const statBox = counter.closest('.stat-box');
                        if (statBox) {
                            statBox.classList.add('pulse-animation');
                            
                            setTimeout(() => {
                                statBox.classList.remove('pulse-animation');
                            }, 1000);
                        }
                    }
                }, interval);
                
                // Unobserve to prevent re-animation
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all counters
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Initialize parallax effects
 */
function initParallaxEffects() {
    // Hero shapes parallax
    const shapes = document.querySelectorAll('.services-hero-shape');
    
    if (shapes.length > 0) {
        window.addEventListener('mousemove', e => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            shapes.forEach(shape => {
                const speed = shape.getAttribute('data-speed') || 0.05;
                const x = (mouseX - 0.5) * speed * 100;
                const y = (mouseY - 0.5) * speed * 100;
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    // Process steps hover effect
    const processSteps = document.querySelectorAll('.process-step');
    
    processSteps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            const number = step.querySelector('.process-step-number');
            
            if (number) {
                number.style.transform = 'scale(1.1) rotate(-10deg)';
                
                // Reset on mouseleave
                step.addEventListener('mouseleave', () => {
                    number.style.transform = 'scale(1) rotate(0)';
                });
            }
        });
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    // Create intersection observer for scroll animations
    const scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    
    // Observe elements to animate on scroll (excluding new services section)
    const animateOnScroll = document.querySelectorAll('.service-card:not(.services-showcase .service-card), .stat-box, .process-step');
    
    animateOnScroll.forEach(element => {
        scrollObserver.observe(element);
    });
    
    // Add animation for hero section on scroll
    const heroContent = document.querySelector('.services-hero-content');
    
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const heroSection = document.querySelector('.services-hero');
            
            if (heroSection && scrollPosition <= heroSection.offsetHeight) {
                const translateY = scrollPosition * 0.3;
                heroContent.style.transform = `translateY(${translateY}px)`;
            }
        });
    }
    
    // Add pulse animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .pulse-animation {
            animation: pulse 1s ease;
        }
        
        .service-card.in-view .service-card-inner {
            box-shadow: var(--shadow-lg);
        }
        
        .stat-box.in-view {
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
            border-color: var(--primary-light);
        }
        
        .process-step.in-view .process-step-number {
            transform: scale(1.1) rotate(-5deg);
        }
        
        .process-step.in-view .process-step-content {
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Handle intersection observer for animation on scroll
 */
function initIntersectionObserver() {
    const elements = document.querySelectorAll('[data-animation]');
    
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation;
                const delay = element.dataset.animationDelay || 0;
                
                setTimeout(() => {
                    element.classList.add(animationType);
                    element.style.opacity = '1';
                    element.style.visibility = 'visible';
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.2 });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}
