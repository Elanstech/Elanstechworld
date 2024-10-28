// services.js
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initMobileNav();
    initHeaderScroll();
    initServiceCards();
    initModals();
});

// Enhanced Particle System
function initParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Enhanced random properties
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 3 + 2;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const delay = Math.random() * 2;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}%;
            top: ${startY}%;
            animation: float ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
        `;
        
        particle.addEventListener('animationend', () => particle.remove());
        particlesContainer.appendChild(particle);
    }

    // Create initial particles
    for (let i = 0; i < 50; i++) {
        createParticle();
    }

    // Continuously create new particles
    setInterval(createParticle, 300);
}

// Enhanced Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const body = document.body;
    
    if (!hamburger || !mobileNav) return;

    function toggleNav() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        
        // Animate nav items sequentially
        if (mobileNav.classList.contains('active')) {
            mobileNavLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.parentElement.style.transform = 'translateX(0)';
                    link.parentElement.style.opacity = '1';
                }, 100 * index);
            });
        }
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNav();
    });

    // Close mobile nav when clicking links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleNav();
        });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleNav();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleNav();
        }
    });
}

// Enhanced Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    const heroContent = document.querySelector('.hero-content');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class to header
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax effect for hero content
        if (heroContent) {
            heroContent.style.transform = `translateY(${currentScroll * 0.3}px)`;
        }
        
        lastScroll = currentScroll;
    });
}

// Enhanced Service Cards
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update gradient position
            card.style.setProperty('--mouseX', `${x}px`);
            card.style.setProperty('--mouseY', `${y}px`);
            
            // 3D tilt effect
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

        // Touch device handling
        card.addEventListener('touchstart', () => {
            card.classList.add('touch-active');
        });

        card.addEventListener('touchend', () => {
            card.classList.remove('touch-active');
        });
    });
}

// Enhanced Modal System
function initModals() {
    const previewButtons = document.querySelectorAll('.preview-btn');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
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
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add active class after brief delay for animation
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    // Setup close handlers
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

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.style.transform = 'none';
        });
    }, 250);
});
