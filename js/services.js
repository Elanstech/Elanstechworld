document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initServiceModals();
    initScrollAnimations();
});

// Particle System
function initParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random starting position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation properties
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        particle.style.animation = `float ${duration}s ease-in-out infinite ${delay}s`;
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentElement) {
                particle.parentElement.removeChild(particle);
            }
        }, duration * 1000);
    }
    
    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    // Continuously create new particles
    setInterval(() => {
        if (particlesContainer.children.length < particleCount) {
            createParticle();
        }
    }, 300);
}

// Service Modals
function initServiceModals() {
    const previewButtons = document.querySelectorAll('.preview-btn');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = button.closest('.service-item').dataset.service;
            createModal(getModalContent(serviceId));
        });
    });
}

function createModal(content) {
    // Remove any existing modals
    const existingModal = document.querySelector('.service-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            ${content}
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
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function getModalContent(serviceId) {
    const services = {
        'business-setup': {
            title: 'Business Computer Setup',
            description: 'Complete IT infrastructure setup tailored for your business needs.',
            features: [
                'Hardware procurement and installation',
                'Network configuration and security',
                'Software deployment and updates',
                'Data backup solutions',
                'Employee training and support',
                'Performance monitoring'
            ]
        },
        // Add other services here with their details
    };
    
    const service = services[serviceId] || {
        title: 'Service Details',
        description: 'Contact us for more information about this service.',
        features: ['Custom solutions available']
    };
    
    return `
        <div class="modal-header">
            <h3>${service.title}</h3>
            <p class="modal-description">${service.description}</p>
        </div>
        <div class="modal-features">
            <h4>Key Features</h4>
            <ul>
                ${service.features.map(feature => `
                    <li>${feature}</li>
                `).join('')}
            </ul>
        </div>
        <div class="modal-cta">
            <a href="contact.html" class="btn-primary">Get Started</a>
            <button class="btn-secondary" onclick="window.location.href='tel:+1234567890'">
                Call Now
            </button>
        </div>
    `;
}

// Scroll Animations
function initScrollAnimations() {
    const services = document.querySelectorAll('.service-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    services.forEach(service => {
        service.style.opacity = '0';
        service.style.transform = 'translateY(20px)';
        service.style.transition = 'all 0.6s ease';
        observer.observe(service);
    });
}
