/ Enhanced Slideshow Class
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
    }

    start() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }

    nextSlide() {
        // Fade out current slide
        this.slides[this.currentIndex].style.opacity = '0';
        
        // Update index
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        
        // Fade in next slide
        this.slides[this.currentIndex].style.opacity = '1';
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Mobile Navigation Class
class MobileNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.isOpen = false;
        
        if (this.hamburger && this.mobileNav) {
            this.init();
        }
    }

    init() {
        // Add ARIA attributes
        this.hamburger.setAttribute('aria-label', 'Toggle menu');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.mobileNav.setAttribute('aria-hidden', 'true');

        // Event listeners
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.setupCloseHandlers();
        this.setupKeyboardNavigation();
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        // Toggle hamburger animation
        const bars = this.hamburger.querySelectorAll('div');
        if (this.isOpen) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }

        // Toggle mobile nav
        this.mobileNav.style.transform = this.isOpen ? 'translateX(0)' : 'translateX(100%)';
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', this.isOpen);
        this.mobileNav.setAttribute('aria-hidden', !this.isOpen);
        
        // Handle body scroll
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    setupCloseHandlers() {
        // Close menu when clicking links
        this.mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.isOpen = false;
                this.toggleMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.mobileNav.contains(e.target) && !this.hamburger.contains(e.target)) {
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

// Header Scroll Effect
function handleScroll() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
}

// Particles Configuration
const particlesConfig = {
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
};

// Initialize Particles
function initParticles() {
    try {
        if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
            particlesJS('particles-js', particlesConfig);
            console.log('Particles.js initialized successfully');
        } else {
            console.warn('Particles.js not loaded or container not found');
        }
    } catch (error) {
        console.error('Error initializing particles:', error);
    }
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

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Slideshow
    new Slideshow('.slide');
    
    // Initialize Mobile Navigation
    new MobileNav();
    
    // Initialize Smooth Scroll
    new SmoothScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', debounce(handleScroll, 10));
    
    // Initialize Particles
    initParticles();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
});

// Handle Page Visibility
document.addEventListener('visibilitychange', () => {
    if (window.pJSDom && window.pJSDom[0]) {
        try {
            if (document.hidden) {
                window.pJSDom[0].pJS.particles.move.enable = false;
            } else {
                window.pJSDom[0].pJS.particles.move.enable = true;
            }
        } catch (error) {
            console.error('Error handling visibility change:', error);
        }
    }
});
