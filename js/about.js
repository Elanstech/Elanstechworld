/* about.js */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        disable: window.innerWidth < 768
    });

    // Initialize all features
    initParticles();
    initStatsCounter();
    initMobileNav();
    initSmoothScroll();
    initHeaderScroll();
    updateCopyrightYear();
    
    // Add resize handler for responsive features
    window.addEventListener('resize', debounce(handleResize, 250));
});

// Particles Animation
function initParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
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

// Update the initMobileNav function in about.js
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
    };

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !hamburger.contains(e.target) && mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = 'auto';
        }
    }, 250));
}

// Add this function to prevent scroll when menu is open
function preventScroll(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Update the handleResize function
function handleResize() {
    if (window.innerWidth >= 768) {
        const mobileNav = document.querySelector('.mobile-nav');
        const hamburger = document.querySelector('.hamburger');
        
        document.body.style.overflow = 'auto';
        mobileNav?.classList.remove('active');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
    }
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

function handleResize() {
    if (window.innerWidth >= 768) {
        document.body.style.overflow = 'auto';
        document.querySelector('.mobile-nav')?.classList.remove('active');
        document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
    }
}

function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
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

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
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

function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    const scrollHandler = () => {
        requestAnimationFrame(() => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
}
