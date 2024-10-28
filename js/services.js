// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initServiceCards();
    initModals();
    initHeaderScroll();
    initMobileNav();
    initTypingAnimation();
});

// Particle System
function initParticles() {
    const particlesContainer = document.querySelector('.services-particles');
    if (!particlesContainer) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 3 + 2;
        const startPos = Math.random() * 100;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startPos}%;
            animation-duration: ${duration}s;
            animation-delay: ${Math.random()}s;
        `;
        
        particle.addEventListener('animationend', () => particle.remove());
        particlesContainer.appendChild(particle);
    }

    // Initial particles
    for (let i = 0; i < 50; i++) {
        createParticle();
    }

    // Continuously create particles
    setInterval(createParticle, 200);
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile nav when clicking links
        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !hamburger.contains(e.target)) {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Service Cards Initialization
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update CSS variables for gradient
            card.style.setProperty('--mouseX', `${x}px`);
            card.style.setProperty('--mouseY', `${y}px`);
            
            // 3D rotation effect
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
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
        });
    });
}

// Modal System
function initModals() {
    const previewButtons = document.querySelectorAll('.preview-btn');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const serviceId = button.closest('.service-card').dataset.service;
            const modalContent = getModalContent(serviceId);
            createModal(modalContent);
        });
    });
}

function createModal(content) {
    const existingModal = document.querySelector('.service-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Activate modal after brief delay for animation
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Close button functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal(modal);
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Typing Animation
function initTypingAnimation() {
    const subtitle = document.querySelector('.services-subtitle');
    if (!subtitle) return;
    
    subtitle.style.width = '0';
    subtitle.style.whiteSpace = 'nowrap';
    subtitle.style.overflow = 'hidden';
    
    setTimeout(() => {
        subtitle.style.width = '100%';
    }, 500);
}

// Service Modal Content
function getModalContent(serviceId) {
    const services = {
        'business-setup': {
            title: 'Business Computer Setup',
            features: [
                'Custom hardware configuration and optimization',
                'Enterprise software installation and setup',
                'Secure network configuration',
                'Advanced security implementation',
                'Automated backup solutions',
                'Employee training sessions',
                'Remote support capabilities',
                '24/7 technical assistance'
            ],
            price: 'Starting from $499'
        },
        'web-design': {
            title: 'Web Design Services',
            features: [
                'Custom responsive design',
                'Mobile-first approach',
                'SEO optimization',
                'Content management system',
                'E-commerce integration',
                'Performance optimization',
                'Security features',
                'Analytics integration'
            ],
            price: 'Starting from $999'
        },
        'pos-system': {
            title: 'POS System Setup',
            features: [
                'Hardware installation',
                'Software configuration',
                'Inventory management setup',
                'Staff training',
                'Payment processing integration',
                'Real-time reporting',
                'Cloud backup',
                'Technical support'
            ],
            price: 'Starting from $799'
        },
        'apple-sales': {
            title: 'Apple Product Sales',
            features: [
                'Latest Apple devices',
                'Professional setup',
                'Data migration',
                'AppleCare+ registration',
                'Business integration',
                'Custom configurations',
                'Warranty support',
                'Trade-in options'
            ],
            price: 'Contact for current prices'
        },
        'it-support': {
            title: 'IT Support & Maintenance',
            features: [
                '24/7 technical support',
                'Remote troubleshooting',
                'System monitoring',
                'Regular maintenance',
                'Security updates',
                'Data backup',
                'Network management',
                'Emergency response'
            ],
            price: 'Starting from $199/month'
        },
        'network-solutions': {
            title: 'Network Solutions',
            features: [
                'Network design and setup',
                'Wi-Fi optimization',
                'Security implementation',
                'VPN configuration',
                'Firewall setup',
                'Performance monitoring',
                'Scalable solutions',
                'Regular maintenance'
            ],
            price: 'Starting from $699'
        }
    };
    
    const service = services[serviceId] || {
        title: 'Service Details',
        features: ['Details coming soon'],
        price: 'Contact for pricing'
    };
    
    return `
        <h3>${service.title}</h3>
        <div class="modal-features">
            <h4>Features & Benefits</h4>
            <ul>
                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        <div class="modal-pricing">
            <strong>${service.price}</strong>
        </div>
        <button class="contact-btn" onclick="window.location.href='contact.html'">
            Get Started
        </button>
    `;
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.style.transform = 'none';
    });
}, 250));

// Utility: Debounce Function
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
