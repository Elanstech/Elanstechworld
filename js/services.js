/**
 * Elan's Tech World - Services Page JavaScript
 * Enhanced interactions and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Remove preload class to enable animations
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);

    // Initialize core functionality
    initAnimations();
    initServicesFilter();
    initCardFlip();
    initCounters();
    initParallaxEffects();
    initScrollAnimations();
});

/**
 * Initialize animations for elements with data-animation attribute
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    animatedElements.forEach(element => {
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
 * Initialize Services Filter
 */
function initServicesFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
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
    
    if (isTouchDevice) {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                const cardInner = this.querySelector('.service-card-inner');
                
                // Toggle flipped state
                if (cardInner.style.transform === 'rotateY(180deg)') {
                    cardInner.style.transform = 'rotateY(0deg)';
                } else {
                    cardInner.style.transform = 'rotateY(180deg)';
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
    
    // Observe elements to animate on scroll
    const animateOnScroll = document.querySelectorAll('.service-card, .stat-box, .process-step');
    
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
