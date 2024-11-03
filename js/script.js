// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Initialize all components after assets are loaded
    window.addEventListener('load', () => {
        initializeAll();
        // Hide loading screen with fade effect
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
            }
        });
    });
});

function initializeAll() {
    // Initialize all components
    initializeGSAP();
    new MobileNav();
    new Slideshow();
    new SmoothScroll();
    new AnimationObserver();
    new ParallaxEffect();
    initParticles();
    setupScrollHandler();
    setupCursorEffect();
    initAOS();
    setupServiceHovers();
}

// Initialize GSAP and ScrollTrigger
function initializeGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });
    heroTl.from(".hero-title", { y: 50, opacity: 0, duration: 1 })
          .from(".hero-description", { y: 30, opacity: 0, duration: 1 }, "-=0.5")
          .from(".hero-buttons", { y: 30, opacity: 0, duration: 1 }, "-=0.5");

    // Scroll-triggered animations for sections
    gsap.utils.toArray('.section-wrapper').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1
        });
    });
}

// Custom Cursor Effect
function setupCursorEffect() {
    const cursor = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorElements = document.querySelectorAll('[data-cursor="pointer"]');

    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        cursorInner.style.display = 'none';
        return;
    }

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(cursorInner, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3
        });
    });

    cursorElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorInner.classList.add('cursor-hover');
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorInner.classList.remove('cursor-hover');
        });
    });
}

// Enhanced Mobile Navigation
class MobileNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.body = document.body;
        this.isOpen = false;
        this.links = this.mobileNav.querySelectorAll('a');
        
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.setupLinks();
        this.setupClickOutside();
        this.setupKeyboardEvents();
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        // Toggle active states
        this.hamburger.classList.toggle('active');
        this.mobileNav.classList.toggle('active');
        this.body.classList.toggle('nav-open');
        
        // Update ARIA attributes
        this.hamburger.setAttribute('aria-expanded', this.isOpen);
        this.mobileNav.setAttribute('aria-hidden', !this.isOpen);

        // Animate menu items
        if (this.isOpen) {
            gsap.fromTo(this.links, 
                { opacity: 0, y: 20 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.3,
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );
        }
    }

    setupLinks() {
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMenu();
            });
        });
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.mobileNav.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.toggleMenu();
            }
        });
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggleMenu();
            }
        });
    }
}

// Enhanced Slideshow
class Slideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentIndex = 0;
        this.timeout = null;
        this.duration = 5000; // 5 seconds per slide
        this.isTransitioning = false;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        // Show first slide
        this.showSlide(0);
        
        // Start autoplay
        this.startAutoPlay();
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
    }

    showSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Current slide animation out
        gsap.to(this.slides[this.currentIndex], {
            opacity: 0,
            scale: 1.1,
            duration: 1,
            ease: "power2.inOut"
        });

        // Update current index
        this.currentIndex = index;

        // New slide animation in
        gsap.to(this.slides[this.currentIndex], {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                this.isTransitioning = false;
            }
        });
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    startAutoPlay() {
        this.timeout = setInterval(() => this.nextSlide(), this.duration);
    }

    pauseAutoPlay() {
        if (this.timeout) {
            clearInterval(this.timeout);
            this.timeout = null;
        }
    }
}

// Smooth Scroll Implementation
class SmoothScroll {
    constructor() {
        this.initSmoothScroll();
    }

    initSmoothScroll() {
        const scroll = new SmoothScroll('a[href*="#"]', {
            speed: 800,
            speedAsDuration: true,
            easing: 'easeInOutCubic',
            offset: function (anchor, toggle) {
                return 80; // Header height offset
            }
        });
    }
}

// Animation Observer
class AnimationObserver {
    constructor() {
        this.sections = document.querySelectorAll('.section-wrapper');
        this.init();
    }

    init() {
        const options = {
            threshold: 0.2,
            rootMargin: "0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.animateSection(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    animateSection(section) {
        const elements = {
            title: section.querySelector('h2'),
            text: section.querySelectorAll('p'),
            buttons: section.querySelectorAll('.btn'),
            images: section.querySelectorAll('.image-container'),
            serviceItems: section.querySelectorAll('.service-item')
        };

        const tl = gsap.timeline({
            defaults: { duration: 0.8, ease: "power3.out" }
        });

        tl.from(elements.title, { y: 30, opacity: 0 })
          .from(elements.text, { y: 30, opacity: 0, stagger: 0.2 }, "-=0.4")
          .from(elements.buttons, { y: 30, opacity: 0, stagger: 0.2 }, "-=0.4")
          .from(elements.images, { 
              x: 30, 
              opacity: 0, 
              stagger: 0.2,
              duration: 1 
          }, "-=0.6");

        if (elements.serviceItems.length) {
            tl.from(elements.serviceItems, {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.5
            }, "-=0.8");
        }
    }
}

// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.init();
    }

    init() {
        gsap.utils.toArray('[data-parallax="scroll"]').forEach(section => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                y: (i, target) => target.offsetHeight * 0.1,
                ease: "none"
            });
        });
    }
}

// Initialize Particles.js
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
    let lastScroll = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        header.classList.toggle('scrolled', currentScroll > 50);

        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 100) {
            gsap.to(header, {
                yPercent: -100,
                duration: 0.3,
                ease: "power3.inOut"
            });
        } else {
            gsap.to(header, {
                yPercent: 0,
                duration: 0.3,
                ease: "power3.inOut"
            });
        }

        // Update active nav section
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveNavSection();
        }, 100);

        lastScroll = currentScroll;
    });
}

// Update active navigation section
function updateActiveNavSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const scroll = window.pageYOffset;

        if (scroll >= sectionTop && scroll < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Initialize AOS (Animate On Scroll)
function initAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        disable: window.innerWidth < 768
    });
}

// Setup Service Hover Effects
function setupServiceHovers() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                duration: 0.3,
                ease: "power2.out"
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
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
    // Reinitialize particles
    if (window.pJSDom && window.pJSDom[0]) {
        try {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
            window.pJSDom = [];
            initParticles();
        } catch (error) {
            console.error('Error reinitializing particles:', error);
        }
    }
    
    // Reinitialize AOS
    AOS.refresh();
    
    // Check cursor visibility
    const cursor = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        cursorInner.style.display = 'none';
    } else {
        cursor.style.display = 'block';
        cursorInner.style.display = 'block';
    }
}, 250);

// Handle Window Load
window.addEventListener('load', () => {
    // Remove loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);

    // Show cursor elements
    document.querySelector('.cursor-outer').classList.add('cursor-visible');
    document.querySelector('.cursor-inner').classList.add('cursor-visible');
});

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

// Setup image hover effects
function setupImageHoverEffects() {
    const images = document.querySelectorAll('.image-container');
    
    images.forEach(container => {
        const image = container.querySelector('img');
        const overlay = container.querySelector('.image-overlay');
        
        container.addEventListener('mouseenter', () => {
            gsap.to(image, {
                scale: 1.1,
                duration: 0.5,
                ease: "power2.out"
            });
            
            gsap.to(overlay, {
                opacity: 0.5,
                duration: 0.5
            });
        });
        
        container.addEventListener('mouseleave', () => {
            gsap.to(image, {
                scale: 1,
                duration: 0.5,
                ease: "power2.out"
            });
            
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5
            });
        });
    });
}

// Initialize image hover effects
setupImageHoverEffects();

// Add scroll-to-top functionality
function setupScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-to-top');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, 100));

    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll-to-top
setupScrollToTop();

// Add performance optimization for animations
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        document.body.classList.add('animations-ready');
    });
} else {
    setTimeout(() => {
        document.body.classList.add('animations-ready');
    }, 1000);
}

// Setup hover effect for gradient text
function setupGradientTextEffect() {
    const gradientTexts = document.querySelectorAll('.gradient-text');
    
    gradientTexts.forEach(text => {
        text.addEventListener('mouseenter', () => {
            gsap.to(text, {
                backgroundSize: '200% auto',
                duration: 0.3
            });
        });
        
        text.addEventListener('mouseleave', () => {
            gsap.to(text, {
                backgroundSize: '100% auto',
                duration: 0.3
            });
        });
    });
}

// Initialize gradient text effect
setupGradientTextEffect();

// Add smooth scrolling for iOS
function enableSmoothScrolling() {
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        document.documentElement.style.cssText = 'scroll-behavior: auto;';
    }
}

// Initialize smooth scrolling
enableSmoothScrolling();

// Add preloading for images
function preloadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
        script.async = true;
        script.onload = () => {
            const observer = lozad();
            observer.observe();
        };
        document.body.appendChild(script);
    }
}

// Initialize image preloading
preloadImages();

// Export necessary functions and classes for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileNav,
        Slideshow,
        SmoothScroll,
        AnimationObserver,
        ParallaxEffect,
        setupCursorEffect,
        initParticles,
        setupScrollHandler,
        initAOS,
        setupServiceHovers
    };
}
