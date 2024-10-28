// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    initMobileNav();
    initStatsCounter();
    initJourneyCards();
    initScrollEffects();
});

// Journey Cards Touch/Click Handling
function initJourneyCards() {
    const journeyCards = document.querySelectorAll('.journey-card');
    
    journeyCards.forEach(card => {
        // Handle both click and touch events
        card.addEventListener('click', function() {
            // Remove active class from all other cards
            journeyCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.querySelector('.journey-card-inner').classList.remove('flipped');
                }
            });
            
            // Toggle flipped class on clicked card
            const cardInner = this.querySelector('.journey-card-inner');
            cardInner.classList.toggle('flipped');
        });
    });
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const circles = document.querySelectorAll('.circle-progress path.progress');
    
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.dataset.target);
                const circle = circles[index];
                
                animateValue(target, 0, finalValue, 2000);
                if (circle) {
                    animateCircle(circle, 0, parseInt(circle.getAttribute('stroke-dasharray')), 2000);
                }
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function animateCircle(circle, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        circle.style.strokeDasharray = `${value}, 100`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
        });

        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Header background effect
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    // Add any resize-specific logic here
    AOS.refresh();
});
