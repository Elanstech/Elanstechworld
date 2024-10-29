// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        disable: window.innerWidth < 768
    });

    // Initialize all features
    initParallax(); // Add parallax initialization
    initParticles();
    initStatsCounter();
    initMobileNav();
    initSmoothScroll();
    initHeaderScroll();
    updateCopyrightYear();
    
    // Add resize handler for responsive features
    window.addEventListener('resize', debounce(handleResize, 250));
});

// Add the Parallax initialization function
function initParallax() {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (!parallaxBg) return;

    // Check if device is mobile or has reduced motion preference
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || prefersReducedMotion) {
        parallaxBg.style.transform = 'none';
        return;
    }

    let lastScrollY = 0;
    let ticking = false;

    const updateParallax = () => {
        const scrolled = window.scrollY;
        if (lastScrollY === scrolled) {
            requestAnimationFrame(updateParallax);
            return;
        }

        const translateY = scrolled * 0.5; // Adjust speed here
        parallaxBg.style.transform = `translate3d(0, ${translateY}px, 0)`;
        
        lastScrollY = scrolled;
        ticking = false;
    };

    // Throttled scroll handler
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

// Update the handleResize function to include parallax handling
function handleResize() {
    if (window.innerWidth >= 768) {
        const mobileNav = document.querySelector('.mobile-nav');
        const hamburger = document.querySelector('.hamburger');
        const parallaxBg = document.querySelector('.parallax-bg');
        
        // Reset mobile menu states
        document.body.style.overflow = 'auto';
        mobileNav?.classList.remove('active');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
        
        // Reinitialize parallax
        if (parallaxBg) {
            initParallax();
        }
        
        // Reinitialize AOS for larger screens
        AOS.refresh();
        
        // Reinitialize particles
        initParticles();
    } else {
        // Mobile-specific adjustments
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            parallaxBg.style.transform = 'none';
        }
        
        AOS.init({
            disable: true
        });
    }
}


// Particles Animation
function initParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;
    particlesContainer.innerHTML = ''; // Clear existing particles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const circles = document.querySelectorAll('.circle-progress path.progress');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.dataset.target);
                const circle = circles[index];
                
                animateValue(target, 0, finalValue, 2000);
                animateCircle(circle, 0, parseInt(circle.getAttribute('stroke-dasharray')), 2000);
                
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;
    
    if (!hamburger || !mobileNav) return;

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        body.style.overflow = isExpanded ? 'hidden' : 'auto';

        // Ensure proper focus management
        if (isExpanded) {
            mobileNav.querySelector('a')?.focus();
        } else {
            hamburger.focus();
        }
    };

    // Hamburger click handler
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && 
            !hamburger.contains(e.target) && 
            mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    const scrollHandler = () => {
        requestAnimationFrame(() => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // Initial check
}

// Resize Handler
function handleResize() {
    if (window.innerWidth >= 768) {
        const mobileNav = document.querySelector('.mobile-nav');
        const hamburger = document.querySelector('.hamburger');
        
        // Reset mobile menu states
        document.body.style.overflow = 'auto';
        mobileNav?.classList.remove('active');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
        
        // Reinitialize AOS for larger screens
        AOS.refresh();
        
        // Reinitialize particles
        initParticles();
    } else {
        // Mobile-specific adjustments
        AOS.init({
            disable: true
        });
    }
}

// Animation Helper Functions
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const animate = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start) + '+';
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    requestAnimationFrame(animate);
}

function animateCircle(circle, start, end, duration) {
    let startTimestamp = null;
    const animate = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        circle.setAttribute('stroke-dasharray', `${value}, 100`);
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    requestAnimationFrame(animate);
}

// Utility Functions
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

function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Prevent scroll when menu is open (utility function)
function preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();
}
