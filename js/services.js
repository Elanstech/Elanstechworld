// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particles
    initParticles();
    
    // Initialize Service Cards
    initServiceCards();
    
    // Initialize Modals
    initModals();
    
    // Initialize Header Scroll Effect
    initHeaderScroll();
    
    // Initialize Typing Animation
    initTypingAnimation();
});

// Particle System
function initParticles() {
    const particlesContainer = document.querySelector('.services-particles');
    if (!particlesContainer) return;

    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }

    // Continuously create particles
    setInterval(() => {
        const particles = document.querySelectorAll('.particle');
        if (particles.length < 50) {
            createParticle(particlesContainer);
        }
    }, 200);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random particle properties
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    
    // Remove particle after animation
    particle.addEventListener('animationend', () => {
        particle.remove();
    });
    
    container.appendChild(particle);
}

// Service Cards Initialization
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        // Add mouse movement effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
                scale(1.02)
            `;
            
            // Add highlight effect
            const highlight = `radial-gradient(
                circle at ${x}px ${y}px,
                rgba(249, 194, 0, 0.2) 0%,
                rgba(249, 194, 0, 0.1) 20%,
                rgba(249, 194, 0, 0) 50%
            )`;
            
            card.style.backgroundImage = highlight;
        });
        
        // Reset card on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
            card.style.backgroundImage = 'none';
        });
        
        // Add click animation
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'none';
            }, 150);
        });
    });
}

// Modal System
function initModals() {
    const previewButtons = document.querySelectorAll('.preview-btn');
    const body = document.body;
    
    previewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const serviceId = button.closest('.service-card').dataset.service;
            const modalContent = getModalContent(serviceId);
            createModal(modalContent);
        });
    });
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.querySelector('.service-modal.active');
        if (modal && !modal.querySelector('.modal-content').contains(e.target)) {
            closeModal(modal);
        }
    });
}

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    // Add close button functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(modal));
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.remove();
    }, 400);
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Typing Animation
function initTypingAnimation() {
    const text = document.querySelector('.services-subtitle');
    if (!text) return;
    
    const content = text.textContent;
    text.textContent = '';
    let index = 0;
    
    function type() {
        if (index < content.length) {
            text.textContent += content.charAt(index);
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
    
    observer.observe(text);
}

// Button Ripple Effect
document.querySelectorAll('.preview-btn, .details-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    });
});

// Helper function to get modal content
function getModalContent(serviceId) {
    const services = {
        'business-setup': {
            title: 'Business Computer Setup',
            features: [
                'Hardware configuration and optimization',
                'Software installation and setup',
                'Network configuration',
                'Security implementation',
                'Data backup solutions'
            ],
            price: 'Starting from $499'
        },
        'web-design': {
            title: 'Web Design Services',
            features: [
                'Custom responsive design',
                'SEO optimization',
                'Content management system',
                'E-commerce integration',
                'Performance optimization'
            ],
            price: 'Starting from $999'
        },
        // Add other services here
    };
    
    const service = services[serviceId] || {
        title: 'Service Details',
        features: ['Details coming soon'],
        price: 'Contact for pricing'
    };
    
    return `
        <h3>${service.title}</h3>
        <div class="modal-features">
            <h4>Features</h4>
            <ul>
                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        <div class="modal-pricing">
            <strong>${service.price}</strong>
        </div>
    `;
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.style.transform = 'none';
        card.style.backgroundImage = 'none';
    });
}, 250));

// Debounce helper function
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
