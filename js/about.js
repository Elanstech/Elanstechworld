// about.js
export function initAboutPage() {
    // Initialize all features
    initIntersectionObserver();
    initMobileNav();
    initScrollEffects();
    initTypingAnimation();
    initStatsAnimation();
    initJourneyCards();
    initLazyLoading();
    initSmoothScroll();
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.dataset.aosDelay) {
                    entry.target.style.transitionDelay = `${entry.target.dataset.aosDelay}ms`;
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

// Enhanced Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            body.style.overflow = isExpanded ? 'auto' : 'hidden';
        });

        // Close mobile nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                hamburger.click();
            }
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.click();
            }
        });
    }
}

// Improved Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('header');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    let lastScroll = 0;
    let scrollTimeout;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Header effects
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide scroll indicator after scrolling starts
        if (scrollIndicator) {
            scrollIndicator.style.opacity = currentScroll > 100 ? '0' : '1';
        }

        // Parallax effect for hero section
        const hero = document.querySelector('.about-hero');
        if (hero) {
            requestAnimationFrame(() => {
                hero.style.backgroundPositionY = `${currentScroll * 0.5}px`;
            });
        }

        lastScroll = currentScroll;

        // Clear and set scroll timeout for performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Cleanup or additional actions after scroll stops
        }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Enhanced Typing Animation
function initTypingAnimation() {
    const elements = document.querySelectorAll('.typing-animation');
    
    elements.forEach(element => {
        const text = element.dataset.text || element.textContent;
        element.textContent = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50);
            }
        }

        // Start typing when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(element);
    });
}

// Improved Stats Animation
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue(stat);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(stat);
    });
}

function animateValue(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16); // For 60fps

    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Journey Cards Interaction
function initJourneyCards() {
    const cards = document.querySelectorAll('.journey-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardInner = this.querySelector('.journey-card-inner');
            
            // Remove active class from all other cards
            cards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.querySelector('.journey-card-inner').classList.remove('flipped');
                }
            });
            
            cardInner.classList.toggle('flipped');
        });

        // Keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Lazy Loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
