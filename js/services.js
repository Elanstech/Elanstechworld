// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initServiceFilters();
    initScrollAnimations();
    initServiceModals();
    initHoverEffects();
    observeServices();
});

// Particle Animation System
function initParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;
    const particles = [];

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${initialX}%;
            top: ${initialY}%;
            background: rgba(249, 194, 0, ${Math.random() * 0.5 + 0.3});
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            transition: transform 1s ease;
        `;
        
        particles.push(particle);
        particlesContainer.appendChild(particle);
        
        // Animate particle
        animateParticle(particle);
    }

    function animateParticle(particle) {
        const newX = Math.random() * 100;
        const newY = Math.random() * 100;
        
        particle.style.transform = `translate(${newX - parseFloat(particle.style.left)}%, ${newY - parseFloat(particle.style.top)}%)`;
        
        setTimeout(() => {
            if (particle.parentElement) {
                particle.remove();
                particles.splice(particles.indexOf(particle), 1);
                createParticle();
            }
        }, 5000);
    }

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

// Service Filtering System
function initServiceFilters() {
    const filterButtons = document.querySelectorAll('.nav-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            // Animate cards
            serviceCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    gsap.to(card, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.out",
                        clearProps: "transform"
                    });
                } else {
                    gsap.to(card, {
                        scale: 0.95,
                        opacity: 0.5,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            });
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const servicesNav = document.querySelector('.services-nav');
    
    // Hero parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrolled / 500);
        }
        
        // Sticky nav effect
        if (servicesNav) {
            if (scrolled > 100) {
                servicesNav.classList.add('sticky');
            } else {
                servicesNav.classList.remove('sticky');
            }
        }
    });
}

// Service Modal System
function initServiceModals() {
    const previewButtons = document.querySelectorAll('.preview-btn');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceCard = button.closest('.service-card');
            const serviceName = serviceCard.querySelector('h3').textContent;
            const serviceDetails = serviceCard.querySelector('.service-details').innerHTML;
            
            createModal(serviceName, serviceDetails);
        });
    });
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>${title}</h3>
            ${content}
            <div class="modal-cta">
                <a href="contact.html" class="action-btn primary">Get Started</a>
                <button class="action-btn secondary">Contact Us</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    // Close handlers
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Card Hover Effects
function initHoverEffects() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        const cardContent = card.querySelector('.card-content');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.02)
            `;
            
            cardContent.style.transform = `translateZ(50px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
            cardContent.style.transform = 'none';
        });
    });
}

// Intersection Observer for scroll-based animations
function observeServices() {
    const options = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                gsap.from(entry.target, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
}

// Utility function to handle window resize
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Reinitialize particles on window resize
    const particlesContainer = document.querySelector('.hero-particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        initParticles();
    }
}, 250));
