// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});

function initializeAll() {
    // Initialize all components
    new MobileNav();
    new Slideshow('.slide');
    new SmoothScroll();
    new AnimationObserver();
    initParticles();
    setupScrollHandler();
}

// Mobile Navigation Class
class MobileNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.body = document.body;
        this.isOpen = false;
        
        if (this.hamburger && this.mobileNav) {
            this.init();
        } else {
            console.warn('Mobile nav elements not found');
            return;
        }
    }

    init() {
        // Remove any initial inline styles that might interfere
        this.mobileNav.removeAttribute('style');
        
        // Add ARIA attributes
        this.hamburger.setAttribute('aria-label', 'Toggle menu');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.mobileNav.setAttribute('aria-hidden', 'true');

        // Add event listeners
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        this.setupCloseHandlers();
        this.setupKeyboardNavigation();
        this.setupLinkHandlers();
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        // Toggle classes
        this.hamburger.classList.toggle('active');
        this.mobileNav.classList.toggle('active');
        
        // Toggle body scroll
        this.body.style.overflow = this.isOpen ? 'hidden' : '';
        this.body.classList.toggle('nav-open');
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', String(this.isOpen));
        this.mobileNav.setAttribute('aria-hidden', String(!this.isOpen));
    }

    setupCloseHandlers() {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.mobileNav.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.toggleMenu();
            }
        });

        // Close on resize if mobile nav is open
        window.addEventListener('resize', () => {
            if (this.isOpen && window.innerWidth > 768) {
                this.toggleMenu();
            }
        });
    }

    setupKeyboardNavigation() {
        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleMenu();
            }
        });

        // Trap focus within mobile nav when open
        const focusableElements = this.mobileNav.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            this.mobileNav.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        }
    }

    setupLinkHandlers() {
        // Close menu when clicking links
        this.mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) {
                    this.toggleMenu();
                }
            });
        });
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileNav();
});

// Slideshow Class
class Slideshow {
    constructor(selector) {
        this.slides = document.querySelectorAll(selector);
        this.currentIndex = 0;
        this.interval = null;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        // Show first slide
        this.slides[0].style.opacity = '1';
        
        // Start slideshow
        this.start();
        
        // Pause on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    start() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    nextSlide() {
        // Fade out current slide
        this.slides[this.currentIndex].style.opacity = '0';
        
        // Update index
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        
        // Fade in next slide
        this.slides[this.currentIndex].style.opacity = '1';
    }
}

// Smooth Scroll Implementation
class SmoothScroll {
    constructor() {
        this.setupSmoothScroll();
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Animation Observer for Section Animations
class AnimationObserver {
    constructor() {
        this.setupObserver();
    }

    setupObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.section-wrapper').forEach(section => {
            observer.observe(section);
        });
    }
}

// Initialize Particles
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: true,
                        value_area: 1000
                    }
                },
                color: {
                    value: ["#f9c200", "#ff6a00", "#ffffff"]
                },
                shape: {
                    type: "circle"
                },
                opacity: {
                    value: 0.6,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "bubble"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    bubble: {
                        distance: 200,
                        size: 6,
                        duration: 0.2,
                        opacity: 0.8,
                        speed: 3
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Header Scroll Effect
function setupScrollHandler() {
    const header = document.querySelector('header');
    if (!header) return;

    const scrollHandler = () => {
        requestAnimationFrame(() => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    };

    window.addEventListener('scroll', debounce(scrollHandler, 10));
    scrollHandler(); // Initial check
}

// Utility: Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle Window Resize
const handleResize = debounce(() => {
    if (window.pJSDom && window.pJSDom[0]) {
        try {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
            window.pJSDom = [];
            initParticles();
        } catch (error) {
            console.error('Error reinitializing particles on resize:', error);
        }
    }
}, 250);

// Add resize event listener
window.addEventListener('resize', handleResize);

// Handle Page Visibility
document.addEventListener('visibilitychange', () => {
    if (window.pJSDom && window.pJSDom[0]) {
        try {
            window.pJSDom[0].pJS.particles.move.enable = !document.hidden;
        } catch (error) {
            console.error('Error handling visibility change:', error);
        }
    }
});
