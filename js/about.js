document.addEventListener('DOMContentLoaded', function() {
    // Initialize stat counters
    initStatCounters();
    
    // Initialize scroll effects
    initScrollEffects();
});

// Counter Animation
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, options);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // For 60fps
    
    function update() {
        current += step;
        if (current < target) {
            element.textContent = Math.round(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
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

        // Parallax effect for background
        const hero = document.querySelector('.about-hero');
        if (hero) {
            hero.style.backgroundPositionY = `${currentScroll * 0.5}px`;
        }

        lastScroll = currentScroll;
    }, { passive: true });
}
