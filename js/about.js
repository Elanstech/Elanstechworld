// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initStatsCounter();
    initScrollEffects();
    initTextAnimations();
    initJourneyCards();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close mobile nav when clicking a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                body.style.overflow = 'auto';
            });
        });
    }
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const circles = document.querySelectorAll('.circle-progress path.progress');
    
    // Intersection Observer options
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    // Create observer for stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const targetValue = parseInt(stat.getAttribute('data-target'));
                const circle = circles[index];

                // Animate number
                animateNumber(stat, targetValue);
                
                // Animate circle if exists
                if (circle) {
                    animateCircle(circle);
                }

                // Unobserve after animation
                statsObserver.unobserve(stat);
            }
        });
    }, options);

    // Observe each stat element
    stats.forEach(stat => statsObserver.observe(stat));
}

// Animate individual number
function animateNumber(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const step = (target / duration) * 16.67; // For 60fps

    const update = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.round(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(update);
}

// Animate circle progress
function animateCircle(circle) {
    const length = circle.getTotalLength();
    const dashArray = circle.getAttribute('stroke-dasharray').split(',');
    const targetDash = parseFloat(dashArray[0]);

    circle.style.strokeDasharray = `0, ${length}`;

    // Animate the dash
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentDash = targetDash * progress;
        circle.style.strokeDasharray = `${currentDash}, ${length}`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('header');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Header effects
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show scroll indicator
        if (scrollIndicator) {
            scrollIndicator.style.opacity = currentScroll > 100 ? '0' : '1';
        }

        // Parallax effect for hero section
        const hero = document.querySelector('.about-hero');
        if (hero) {
            hero.style.backgroundPositionY = `${currentScroll * 0.5}px`;
        }

        lastScroll = currentScroll;
    });
}

// Text Animations
function initTextAnimations() {
    const typingText = document.querySelector('.typing-animation');
    if (!typingText) return;

    const text = typingText.textContent;
    typingText.textContent = '';
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing animation when element is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(typingText);
}

// Journey Cards Interaction
function initJourneyCards() {
    const cards = document.querySelectorAll('.journey-card');
    
    cards.forEach(card => {
        const cardInner = card.querySelector('.journey-card-inner');
        
        // Handle both click and touch events
        card.addEventListener('click', () => {
            // Remove flipped class from all other cards
            cards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.querySelector('.journey-card-inner').classList.remove('flipped');
                }
            });
            
            // Toggle current card
            cardInner.classList.toggle('flipped');
        });

        // Handle hover effects for desktop
        if (window.matchMedia('(min-width: 768px)').matches) {
            card.addEventListener('mouseenter', () => {
                cardInner.classList.add('hover');
            });

            card.addEventListener('mouseleave', () => {
                cardInner.classList.remove('hover');
            });
        }
    });
}

// Handle resize events
window.addEventListener('resize', debounce(() => {
    // Reinitialize components that need resize handling
    initJourneyCards();
}, 250));

// Utility function for debouncing
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

// Smooth scroll for anchor links
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

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or heavy operations when page is not visible
        document.querySelectorAll('.animated').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        document.querySelectorAll('.animated').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Add loading state for dynamic content
function setLoadingState(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.setAttribute('aria-busy', 'true');
    } else {
        element.classList.remove('loading');
        element.setAttribute('aria-busy', 'false');
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove loading states
    document.querySelectorAll('.loading').forEach(el => {
        setLoadingState(el, false);
    });
});
