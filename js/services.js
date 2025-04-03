/**
 * Elan's Tech World - Services Page JavaScript
 * Enhanced interactive elements for the redesigned services page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Remove preload class to enable animations
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);

    // Initialize core functionality
    initPageLoader();
    initAOS();
    initHeroSection();
    initHeroParticles();
    initValueCards();
    initStatsCounters();
    initServicesShowcase();
    initProcessTimeline();
    initTestimonialsCarousel();
    initClientsCarousel();
    initCtaInteractions();
    initTiltEffects();
    initScrollAnimations();
    
    // Handle window resize for responsive layouts
    window.addEventListener('resize', helpers.debounce(() => {
        handleServiceFilterOverflow();
        updateCarousels();
    }, 250));
    
    // Initialize back to top button
    initBackToTop();
});

/**
 * Helper Functions
 */
const helpers = {
    // Throttle function for performance optimization
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
    
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },
    
    // Random number between min and max
    random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Check if device supports hover
    supportsHover: function() {
        return window.matchMedia('(hover: hover)').matches;
    },
    
    // Is touch device check
    isTouchDevice: function() {
        return (('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0));
    }
};

/**
 * Initialize AOS (Animate on Scroll) Library
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100,
            delay: 100
        });
    }
}

/**
 * Initialize Page Loader
 */
function initPageLoader() {
    const loader = document.querySelector('.loader-container');
    const progressBar = document.querySelector('.loader-progress-bar');
    const percentage = document.querySelector('.loader-percentage');
    
    if (!loader || !progressBar || !percentage) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        
        if (progress >= 100) {
            clearInterval(interval);
            
            setTimeout(() => {
                if (loader) {
                    loader.classList.add('hidden');
                    document.body.style.overflow = 'visible';
                }
            }, 300);
        }
        
        progressBar.style.width = `${progress}%`;
        percentage.textContent = `${progress}%`;
    }, 10);
}

/**
 * Initialize Hero Section
 */
function initHeroSection() {
    // Initialize Parallax effect for hero shapes if parallax.js is available
    const heroShapes = document.querySelector('.services-hero-shapes');
    if (heroShapes && typeof Parallax !== 'undefined') {
        new Parallax(heroShapes);
    }
    
    // Initialize typing animation for hero title
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        animateTypingText(typingText);
    }
    
    // Add scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const servicesGrid = document.getElementById('services-grid');
            if (servicesGrid) {
                servicesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Text reveal animation
    const textReveal = document.querySelectorAll('.text-reveal');
    textReveal.forEach(element => {
        setTimeout(() => {
            element.classList.add('active');
        }, 500);
    });
}

/**
 * Animate Typing Text
 */
function animateTypingText(element) {
    if (!element) return;
    
    const text = element.textContent;
    element.textContent = '';
    let charIndex = 0;
    
    function typeCharacter() {
        if (charIndex < text.length) {
            element.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeCharacter, 100);
        } else {
            // Reset animation after delay
            setTimeout(() => {
                element.textContent = '';
                charIndex = 0;
                typeCharacter();
            }, 3000);
        }
    }
    
    // Start typing animation
    setTimeout(typeCharacter, 1000);
}

/**
 * Initialize Hero Particles
 */
function initHeroParticles() {
    const container = document.querySelector('.hero-particle-container');
    if (!container) return;
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        createParticle(container);
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size
        const size = helpers.random(3, 8);
        
        // Random position
        const posX = helpers.random(1, 99);
        const posY = helpers.random(1, 99);
        
        // Random animation duration and delay
        const duration = helpers.random(8, 15);
        const delay = helpers.random(0, 7);
        
        // Set particle styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Add to container
        container.appendChild(particle);
        
        // Remove and recreate particle after animation completes
        setTimeout(() => {
            particle.remove();
            createParticle(container);
        }, (duration + delay) * 1000);
    }
}

/**
 * Initialize Value Cards
 */
function initValueCards() {
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            if (!helpers.supportsHover()) return;
            
            const iconBg = card.querySelector('.icon-bg');
            if (iconBg && window.gsap) {
                gsap.to(iconBg, {
                    scale: 1.2,
                    rotate: '-10deg',
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!helpers.supportsHover()) return;
            
            const iconBg = card.querySelector('.icon-bg');
            if (iconBg && window.gsap) {
                gsap.to(iconBg, {
                    scale: 1,
                    rotate: '0deg',
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    });
}

/**
 * Initialize Stats Counters
 */
function initStatsCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                
                // Calculate animation speed based on target value
                const duration = 2000; // 2 seconds
                const interval = 10; // Update every 10ms
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
                        
                        // Animate the SVG circle progress
                        const statItem = counter.closest('.stat-item');
                        if (statItem) {
                            const circle = statItem.querySelector('.stat-circle-progress');
                            if (circle) {
                                const radius = circle.getAttribute('r');
                                const circumference = 2 * Math.PI * radius;
                                const percentage = circle.getAttribute('data-percentage');
                                const offset = circumference - (percentage / 100) * circumference;
                                
                                // Set circle dasharray and dashoffset
                                circle.style.strokeDasharray = circumference;
                                circle.style.strokeDashoffset = circumference;
                                
                                // Animate the circle
                                setTimeout(() => {
                                    circle.style.transition = 'stroke-dashoffset 2s ease';
                                    circle.style.strokeDashoffset = offset;
                                }, 100);
                            }
                        }
                    }
                }, interval);
                
                // Unobserve to prevent re-animation
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all counters
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Initialize Services Showcase
 */
function initServicesShowcase() {
    initServiceFilter();
    init3DServiceCards();
    handleServiceFilterOverflow();
}

/**
 * Initialize Service Filter
 */
function initServiceFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card-3d');
    
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
                
                if (filterValue === 'all' || cardCategory.includes(filterValue)) {
                    // Show card with animation
                    if (window.gsap) {
                        gsap.to(card, { 
                            scale: 0.95, 
                            opacity: 0, 
                            y: 20, 
                            duration: 0.3,
                            onComplete: () => {
                                card.style.display = 'block';
                                gsap.to(card, { 
                                    scale: 1, 
                                    opacity: 1, 
                                    y: 0, 
                                    duration: 0.5,
                                    ease: 'power2.out'
                                });
                            }
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95) translateY(20px)';
                        card.style.display = 'block';
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        }, 10);
                    }
                } else {
                    // Hide card with animation
                    if (window.gsap) {
                        gsap.to(card, { 
                            scale: 0.95, 
                            opacity: 0, 
                            y: 20, 
                            duration: 0.3,
                            onComplete: () => {
                                card.style.display = 'none';
                            }
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95) translateY(20px)';
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
            
            // Add button hover effect
            const btnIcon = button.querySelector('.btn-icon');
            if (btnIcon && !helpers.isTouchDevice()) {
                gsap.to(btnIcon, { 
                    rotate: '90deg', 
                    duration: 0.3, 
                    ease: 'power2.out' 
                });
            }
        });
        
        // Add button hover effects
        if (!helpers.isTouchDevice()) {
            button.addEventListener('mouseenter', function() {
                const btnIcon = this.querySelector('.btn-icon');
                if (btnIcon && window.gsap) {
                    gsap.to(btnIcon, { 
                        rotate: '90deg', 
                        duration: 0.3, 
                        ease: 'power2.out' 
                    });
                }
            });
            
            button.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    const btnIcon = this.querySelector('.btn-icon');
                    if (btnIcon && window.gsap) {
                        gsap.to(btnIcon, { 
                            rotate: '0deg', 
                            duration: 0.3, 
                            ease: 'power2.out' 
                        });
                    }
                }
            });
        }
    });
}

/**
 * Initialize 3D Service Cards
 */
function init3DServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card-3d');
    
    serviceCards.forEach(card => {
        const cardInner = card.querySelector('.card-3d-inner');
        
        // Add 3D hover effect on desktop
        if (!helpers.isTouchDevice()) {
            card.addEventListener('mouseenter', function() {
                // Scale up the card
                if (window.gsap) {
                    gsap.to(card, {
                        scale: 1.03,
                        y: -10,
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
                
                // 3D mouse movement effect
                card.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Calculate rotation based on mouse position
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateY = (x - centerX) / 20;
                    const rotateX = (centerY - y) / 20;
                    
                    if (cardInner && window.gsap) {
                        gsap.to(cardInner, {
                            rotateY: rotateY,
                            rotateX: rotateX,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    } else if (cardInner) {
                        cardInner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                        cardInner.style.transition = 'transform 0.5s ease';
                    }
                });
            });
            
            card.addEventListener('mouseleave', function() {
                // Reset card scale and position
                if (window.gsap) {
                    gsap.to(card, {
                        scale: 1,
                        y: 0,
                        boxShadow: 'var(--shadow-md)',
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
                
                // Reset card rotation
                if (cardInner && window.gsap) {
                    gsap.to(cardInner, {
                        rotateY: 0,
                        rotateX: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                } else if (cardInner) {
                    cardInner.style.transform = 'rotateY(0) rotateX(0)';
                    cardInner.style.transition = 'transform 0.5s ease';
                }
            });
        } else {
            // For touch devices, implement click to flip
            card.addEventListener('click', function() {
                if (cardInner) {
                    if (cardInner.style.transform === 'rotateY(180deg)') {
                        cardInner.style.transform = 'rotateY(0deg)';
                    } else {
                        cardInner.style.transform = 'rotateY(180deg)';
                    }
                }
            });
        }
    });
}

/**
 * Handle Service Filter Overflow
 */
function handleServiceFilterOverflow() {
    const filterContainer = document.querySelector('.services-filter');
    if (!filterContainer) return;
    
    // Check if filter buttons overflow
    const buttons = filterContainer.querySelectorAll('.filter-btn');
    let totalWidth = 0;
    
    buttons.forEach(button => {
        totalWidth += button.offsetWidth + parseInt(window.getComputedStyle(button).marginLeft) + 
                      parseInt(window.getComputedStyle(button).marginRight);
    });
    
    if (totalWidth > filterContainer.offsetWidth) {
        // Add horizontal scrolling indicators
        filterContainer.classList.add('scrollable');
        
        // Add scroll event listener
        filterContainer.addEventListener('scroll', function() {
            const maxScroll = this.scrollWidth - this.clientWidth;
            const currentScroll = this.scrollLeft;
            
            // Show/hide scroll indicators
            if (currentScroll <= 10) {
                this.classList.remove('scroll-left');
            } else {
                this.classList.add('scroll-left');
            }
            
            if (maxScroll - currentScroll <= 10) {
                this.classList.remove('scroll-right');
            } else {
                this.classList.add('scroll-right');
            }
        });
        
        // Trigger initial scroll event
        filterContainer.dispatchEvent(new Event('scroll'));
    } else {
        filterContainer.classList.remove('scrollable', 'scroll-left', 'scroll-right');
    }
}

/**
 * Initialize Process Timeline
 */
function initProcessTimeline() {
    const timelineNavItems = document.querySelectorAll('.timeline-nav-item');
    const timelinePanels = document.querySelectorAll('.timeline-panel');
    const progressBar = document.querySelector('.timeline-progress-bar');
    
    if (!timelineNavItems.length || !timelinePanels.length) return;
    
    timelineNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const step = this.getAttribute('data-step');
            
            // Update active nav item
            timelineNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update active panel
            timelinePanels.forEach(panel => {
                if (panel.getAttribute('data-step') === step) {
                    // Hide current active panel
                    const activePanel = document.querySelector('.timeline-panel.active');
                    if (activePanel) {
                        if (window.gsap) {
                            gsap.to(activePanel, {
                                opacity: 0,
                                y: 20,
                                duration: 0.3,
                                ease: 'power2.out',
                                onComplete: () => {
                                    activePanel.classList.remove('active');
                                    
                                    // Show new panel
                                    panel.classList.add('active');
                                    gsap.fromTo(panel, 
                                        { opacity: 0, y: 20 },
                                        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                                    );
                                }
                            });
                        } else {
                            activePanel.style.opacity = '0';
                            activePanel.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                activePanel.classList.remove('active');
                                panel.classList.add('active');
                                
                                // Trigger reflow
                                void panel.offsetHeight;
                                
                                panel.style.opacity = '1';
                                panel.style.transform = 'translateY(0)';
                                panel.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            }, 300);
                        }
                    } else {
                        panel.classList.add('active');
                    }
                }
            });
            
            // Update progress bar
            const stepNumber = parseInt(step);
            const progressPercentage = ((stepNumber - 1) / (timelineNavItems.length - 1)) * 100;
            
            if (progressBar) {
                progressBar.style.width = `${progressPercentage}%`;
            }
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                const stepNumber = this.querySelector('.step-number');
                if (stepNumber && window.gsap) {
                    gsap.to(stepNumber, {
                        scale: 1.2,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                const stepNumber = this.querySelector('.step-number');
                if (stepNumber && window.gsap) {
                    gsap.to(stepNumber, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            }
        });
    });
    
    // Initialize with first step active
    if (timelineNavItems.length > 0) {
        timelineNavItems[0].click();
    }
}

/**
 * Initialize Testimonials Carousel
 */
function initTestimonialsCarousel() {
    const testimonialContainer = document.querySelector('.testimonial-carousel');
    if (!testimonialContainer) return;
    
    if (typeof Swiper !== 'undefined') {
        new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 40
                }
            },
            effect: 'slide',
            on: {
                init: function() {
                    initTiltEffects();
                }
            }
        });
    }
}

/**
 * Initialize Clients Carousel
 */
function initClientsCarousel() {
    const clientsTrack = document.querySelector('.clients-track');
    if (!clientsTrack) return;
    
    // Calculate animation duration based on content width
    const clientItems = clientsTrack.querySelectorAll('.client-item');
    if (!clientItems.length) return;
    
    // Add client item hover effects
    clientItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (window.gsap) {
                gsap.to(this, {
                    y: -5,
                    scale: 1.05,
                    boxShadow: 'var(--shadow-md)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                const img = this.querySelector('img');
                if (img) {
                    gsap.to(img, {
                        filter: 'grayscale(0)',
                        opacity: 1,
                        duration: 0.3
                    });
                }
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (window.gsap) {
                gsap.to(this, {
                    y: 0,
                    scale: 1,
                    boxShadow: 'var(--shadow-sm)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                const img = this.querySelector('img');
                if (img) {
                    gsap.to(img, {
                        filter: 'grayscale(100%)',
                        opacity: 0.7,
                        duration: 0.3
                    });
                }
            }
        });
    });
}

/**
 * Initialize CTA Section Interactions
 */
function initCtaInteractions() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const iconContainer = this.querySelector('.btn-icon-container');
            if (iconContainer && window.gsap) {
                gsap.to(iconContainer, {
                    scale: 1.2,
                    rotate: '10deg',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        button.addEventListener('mouseleave', function() {
            const iconContainer = this.querySelector('.btn-icon-container');
            if (iconContainer && window.gsap) {
                gsap.to(iconContainer, {
                    scale: 1,
                    rotate: '0deg',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
    
    // Create particles for CTA section
    createCtaParticles();
}

/**
 * Create particles for CTA section
 */
function createCtaParticles() {
    const container = document.querySelector('.cta-particles');
    if (!container) return;
    
    // Create particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.classList.add('bubble');
        
        // Random size
        const size = helpers.random(5, 20);
        
        // Random position
        const posX = helpers.random(10, 90);
        const posY = helpers.random(10, 90);
        
        // Random animation duration
        const duration = helpers.random(8, 15);
        const delay = helpers.random(0, 8);
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.bottom = '-20px';
        particle.style.opacity = '0';
        
        // Add animation
        particle.style.animation = `bubbleFloat ${duration}s linear infinite ${delay}s`;
        
        // Add to container
        container.appendChild(particle);
    }
    
    // Add keyframes dynamically if they don't exist
    if (!document.getElementById('bubbleAnimationKeyframes')) {
        const style = document.createElement('style');
        style.id = 'bubbleAnimationKeyframes';
        style.textContent = `
            @keyframes bubbleFloat {
                0% {
                    transform: translateY(0) scale(0);
                    opacity: 0;
                }
                10% {
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(-100px) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initialize Tilt Effects
 */
function initTiltEffects() {
    if (typeof VanillaTilt !== 'undefined' && !helpers.isTouchDevice()) {
        VanillaTilt.init(document.querySelectorAll('.tilt-element:not(.swiper-slide-duplicate) .testimonial-card'), {
            max: 8,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
            scale: 1.03
        });
        
        VanillaTilt.init(document.querySelectorAll('.value-card'), {
            max: 8,
            speed: 400,
            glare: false,
            scale: 1.05
        });
    }
}

/**
 * Initialize Scroll Animations
 */
function initScrollAnimations() {
    // Add scroll event listener
    window.addEventListener('scroll', helpers.throttle(handleScroll, 100));
    
    // Initialize scroll animations
    function handleScroll() {
        // Animate header on scroll
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Update back to top button visibility
        updateBackToTopVisibility();
    }
}

/**
 * Initialize Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    
    // Add click event
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Initial visibility check
    updateBackToTopVisibility();
}

/**
 * Update Back to Top Button Visibility
 */
function updateBackToTopVisibility() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    
    if (window.scrollY > 500) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }
}

/**
 * Update carousels on resize
 */
function updateCarousels() {
    // Reinitialize swiper instances if needed
    if (typeof Swiper !== 'undefined') {
        const swipers = document.querySelectorAll('.swiper-container');
        swipers.forEach(element => {
            if (element.swiper) {
                element.swiper.update();
            }
        });
    }
}
