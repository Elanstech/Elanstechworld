// Services Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
    initParticles();
    initTypingEffect();
    initFilterButtons();
    initServiceCards();
});

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-links a');
    let isOpen = false;

    menuBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';

        // Animate menu links
        menuLinks.forEach((link, index) => {
            if (isOpen) {
                link.style.transitionDelay = `${index * 0.1}s`;
            } else {
                link.style.transitionDelay = '0s';
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Particle System
function initParticles() {
    const container = document.querySelector('.particle-container');
    const particleCount = window.innerWidth < 768 ? 30 : 50;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        particle.style.animation = `float ${duration}s ease-in-out infinite ${delay}s`;
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
            if (container.children.length < particleCount) {
                createParticle();
            }
        }, duration * 1000);
    }

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

// Typing Effect
function initTypingEffect() {
    const text = "Professional Technology Solutions";
    const typingText = document.querySelector('.typing-text');
    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            typingText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        }
    }

    type();
}

// Filter Buttons
function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            const filter = btn.dataset.filter;
            
            serviceCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    gsap.to(card, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(card, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    });
}

// Service Cards Animation
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.from(entry.target, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => observer.observe(card));
}
