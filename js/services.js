document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initParticles();
    initTypingEffect();
    initFilterSystem();
    initScrollAnimations();
    initModalSystem();
});

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuLinks = document.querySelectorAll('.mobile-nav li');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        
        // Animate menu items
        menuLinks.forEach((link, index) => {
            if (mobileNav.classList.contains('active')) {
                link.style.transitionDelay = `${index * 0.1}s`;
            } else {
                link.style.transitionDelay = '0s';
            }
        });
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
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3,
            animation: `float ${duration}s ease-in-out infinite ${delay}s`
        });
        
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
        } else {
            setTimeout(() => {
                typingText.textContent = '';
                charIndex = 0;
                type();
            }, 3000);
        }
    }
    
    type();
}

// Filter System
function initFilterSystem() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            const filter = btn.dataset.filter;
            
            gsap.to(serviceCards, {
                duration: 0.3,
                opacity: 0,
                y: 20,
                stagger: 0.1,
                ease: "power2.out",
                onComplete: () => {
                    serviceCards.forEach(card => {
                        if (filter === 'all' || card.dataset.category === filter) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    gsap.to(serviceCards, {
                        duration: 0.3,
                        opacity: 1,
                        y: 0,
                        stagger: 0.1,
                        ease: "power2.out"
                    });
                }
            });
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    gsap.from('.hero-content', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    });
    
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            delay: index * 0.1,
            ease: "power3.out"
        });
    });
}

// Modal System
function initModalSystem() {
    const modal = document.querySelector('.service-modal');
    const modalContent = modal.querySelector('.modal-content');
    const closeBtn = modal.querySelector('.modal-close');
    const triggers = document.querySelectorAll('.modal-trigger');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const serviceId = trigger.dataset.service;
            openModal(serviceId);
        });
    });
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    function openModal(serviceId) {
        // Populate modal content based on service ID
        const content = getServiceContent(serviceId);
        modalContent.innerHTML = content;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function getServiceContent(serviceId) {
        // Return modal content based on service ID
        // This would be replaced with actual service content
        return `
            <h3>Service Details</h3>
            <p>Details for ${serviceId}</p>
        `;
    }
}
