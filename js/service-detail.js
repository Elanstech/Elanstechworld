// DOM Elements
const header = document.querySelector('header');
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const billingToggle = document.getElementById('billingToggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card');
const featureCards = document.querySelectorAll('.feature-card');
const pricingCards = document.querySelectorAll('.pricing-card');

// Header Scroll Effect
const handleScroll = () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleScroll);

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

// Close mobile nav when clicking a link
mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Pricing Toggle
if (billingToggle) {
    billingToggle.addEventListener('change', () => {
        document.body.classList.toggle('yearly-billing');
        
        // Update pricing display
        document.querySelectorAll('.price').forEach(price => {
            price.style.display = 'none';
        });
        
        const priceElements = document.querySelectorAll(
            billingToggle.checked ? '.price.yearly' : '.price.monthly'
        );
        priceElements.forEach(price => {
            price.style.display = 'block';
        });

        // Update period text
        document.querySelectorAll('.period').forEach(period => {
            period.textContent = billingToggle.checked ? '/year' : '/month';
        });
    });
}

// Services Filter
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filter service cards with animation
        serviceCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            // Reset animation
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.8s forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards, feature cards, and pricing cards
[...serviceCards, ...featureCards, ...pricingCards].forEach(card => {
    observer.observe(card);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: 'power2.inOut'
            });
        }
    });
});

// Particles Animation for Hero Background
const createParticles = () => {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positions and sizes
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        
        // Random animation duration and delay
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * -20;
        
        gsap.to(particle, {
            y: '-100vh',
            repeat: -1,
            duration: duration,
            delay: delay,
            ease: 'none'
        });
        
        particlesContainer.appendChild(particle);
    }
};

// Initialize particles on load
window.addEventListener('load', createParticles);

// Add CSS for particles
const style = document.createElement('style');
style.textContent = `
    .particle {
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        pointer-events: none;
    }
`;
document.head.appendChild(style);
