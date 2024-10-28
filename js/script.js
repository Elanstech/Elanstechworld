// Enhanced Slideshow Class
class Slideshow {
    constructor(selector, options = {}) {
        this.slides = document.querySelectorAll(selector);
        this.currentSlide = 0;
        this.isTransitioning = false;
        this.options = {
            duration: options.duration || 5000,
            fadeTime: options.fadeTime || 1000,
            autoplay: options.autoplay !== false,
            pauseOnHover: options.pauseOnHover !== false
        };
        
        this.init();
    }

    init() {
        if (this.slides.length <= 1) return;
        
        // Initialize first slide
        this.slides[0].style.opacity = '1';
        this.slides[0].style.zIndex = '1';
        
        // Add event listeners for hover pause
        if (this.options.pauseOnHover) {
            const container = this.slides[0].parentElement;
            container.addEventListener('mouseenter', () => this.pause());
            container.addEventListener('mouseleave', () => this.play());
        }
        
        // Start slideshow
        if (this.options.autoplay) {
            this.play();
        }
        
        // Add progress indicator
        this.addProgressIndicator();
    }

    addProgressIndicator() {
        const container = this.slides[0].parentElement;
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'slideshow-progress';
        this.progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 0%;
            background: linear-gradient(45deg, #f9c200, #ff6a00);
            transition: width ${this.options.duration}ms linear;
            z-index: 2;
        `;
        container.appendChild(this.progressBar);
    }

    async transition() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Reset progress bar
        this.progressBar.style.width = '0%';

        // Fade out current slide
        this.slides[this.currentSlide].style.opacity = '0';
        this.slides[this.currentSlide].style.zIndex = '0';
        
        // Update current slide index
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        
        // Fade in next slide
        this.slides[this.currentSlide].style.opacity = '1';
        this.slides[this.currentSlide].style.zIndex = '1';
        
        // Animate progress bar
        requestAnimationFrame(() => {
            this.progressBar.style.width = '100%';
        });

        // Wait for transition to complete
        await new Promise(resolve => setTimeout(resolve, this.options.fadeTime));
        this.isTransitioning = false;
    }

    play() {
        if (this.interval) return;
        this.interval = setInterval(() => this.transition(), this.options.duration);
        // Start progress bar
        this.progressBar.style.width = '100%';
    }

    pause() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            // Pause progress bar
            const width = getComputedStyle(this.progressBar).width;
            this.progressBar.style.transition = 'none';
            this.progressBar.style.width = width;
            requestAnimationFrame(() => {
                this.progressBar.style.transition = '';
            });
        }
    }
}

// Header Scroll Effect with throttle
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

const handleScroll = throttle(() => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
}, 100);

window.addEventListener('scroll', handleScroll);

// Mobile Navigation with improved accessibility
class MobileNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.isOpen = false;
        
        this.init();
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
        this.hamburger.classList.toggle('active');
        this.mobileNav.classList.toggle('active');
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', this.isOpen);
        this.mobileNav.setAttribute('aria-hidden', !this.isOpen);
        
        // Handle body scroll
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    setupCloseHandlers() {
        // Close menu when clicking links
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                this.isOpen = false;
                this.hamburger.classList.remove('active');
                this.mobileNav.classList.remove('active');
                this.hamburger.setAttribute('aria-expanded', 'false');
                this.mobileNav.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
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

// Smooth scrolling with improved behavior
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Slideshow
    const slideshow = new Slideshow('.slide', {
        duration: 5000,
        fadeTime: 1000,
        pauseOnHover: true
    });
    
    // Initialize Mobile Navigation
    const mobileNav = new MobileNav();
    
    // Initialize Smooth Scroll
    const smoothScroll = new SmoothScroll();

    // Initialize particles.js with optimized config
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: {
                value: 0.3,
                random: false,
                anim: {
                    enable: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false
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
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Performance monitoring
    if (window.performance && window.performance.mark) {
        window.performance.mark('afterInitialize');
        console.log('Site initialized successfully');
    }
});

// Add resize handler with debounce
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

const handleResize = debounce(() => {
    // Adjust particles.js canvas
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
        particlesJS('particles-js');
    }
}, 250);

window.addEventListener('resize', handleResize);

// Add page visibility handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations and heavy calculations when page is not visible
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.particles.move.enable = false;
        }
    } else {
        // Resume animations when page becomes visible
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.particles.move.enable = true;
        }
    }
});
