document.addEventListener('DOMContentLoaded', function() {
    // Initialize stat counters
    initStatCounters();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate hero content
    gsap.from('.about-hero-content', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: 'power3.out'
    });
    
    // Initialize journey cards
    initJourneyCards();
});

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
    const duration = 2000;
    const steps = 60; // 60fps
    const increment = target / steps;
    const stepTime = duration / steps;
    
    const counter = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.round(current);
        }
    }, stepTime);
}

function initScrollEffects() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Header effect
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax effect
        const hero = document.querySelector('.about-hero');
        if (hero) {
            requestAnimationFrame(() => {
                hero.style.backgroundPositionY = `${currentScroll * 0.5}px`;
            });
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

function initJourneyCards() {
    const cards = document.querySelectorAll('.journey-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.journey-card-inner').style.transform = 'rotateY(180deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.journey-card-inner').style.transform = 'rotateY(0)';
        });
    });
}
