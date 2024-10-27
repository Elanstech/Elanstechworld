// Performance-optimized JavaScript with modern features
'use strict';

// Utility functions
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

// DOM Elements
const header = select('header');
const hamburger = select('.hamburger');
const mobileNav = select('.mobile-nav');
const heroSection = select('.hero');
const sections = selectAll('.section-wrapper');

// Configuration
const CONFIG = {
    scrollThreshold: 50,
    mobileBreakpoint: 768,
    intersectionThreshold: 0.2,
    animationDuration: 1000
};

// Page Load Handler
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeImageLazyLoading();
    initializeAnimations();
    
    // Remove loading screen
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Particles.js Configuration
const initializeParticles = () => {
    const particlesConfig = {
        particles: {
            number: {
                value: window.innerWidth < CONFIG.mobileBreakpoint ? 40 : 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.3,
                random: false
            },
            size: {
                value: 3,
                random: true
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
                speed: window.innerWidth < CONFIG.mobileBreakpoint ? 2 : 3,
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
                    enable: window.innerWidth > CONFIG.mobileBreakpoint,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            }
        },
        retina_detect: true
    };

    if (select('#particles-js')) {
        particlesJS('particles-js', particlesConfig);
    }
};

// Scroll Effects
const initializeScrollEffects = () => {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Header scroll effect
        if (currentScroll > CONFIG.scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax effect for sections
        sections.forEach(section => {
            if (isElementInViewport(section)) {
                const scrolled = window.pageYOffset;
                const speed = 0.3;
                const yPos = -(scrolled * speed);
                section.style.transform = `translateY(${yPos}px)`;
            }
        });
        
        lastScroll = currentScroll;
    }, { passive: true });
};

// Mobile Menu
const initializeMobileMenu = () => {
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Update ARIA attributes
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    };

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && 
            !mobileNav.contains(e.target) && 
            mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu on link click
    selectAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
};

// Lazy Loading Images
const initializeImageLazyLoading = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    selectAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
};

// Scroll Animations
const initializeAnimations = () => {
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: CONFIG.intersectionThreshold
    });

    selectAll('[data-aos]').forEach(element => {
        animationObserver.observe(element);
    });
};

// Utility: Check if element is in viewport
const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
};

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance Monitoring
const reportWebVitals = () => {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', timing.loadEventEnd - timing.navigationStart);
            }, 0);
        });
    }
};

// Initialize performance monitoring
reportWebVitals();
