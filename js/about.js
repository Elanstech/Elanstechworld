// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeAll();
});

function initializeAll() {
    initMobileNav();
    initServiceCards();
    initScrollEffects();
    initParticles();
    initModalHandling();
    initTouchEffects();
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (!hamburger || !mobileNav) return;

    const toggleNav = () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    // Hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNav();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleNav();
        }
    });

    // Close on mobile nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleNav);
    });

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            toggleNav();
        }
    }, 250));
}

// Service Cards Functionality
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        // Mouse move effect
        card.addEventListener('mousemove', handleCardMouseMove);
        card.addEventListener('mouseleave', handleCardMouseLeave);

        // Preview button functionality
        const previewBtn = card.querySelector('.preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceId = card.dataset.service;
                showServicePreview(serviceId);
            });
        }
    });
}

function handleCardMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouseX', `${x}px`);
    card.style.setProperty('--mouseY', `${y}px`);
}

function handleCardMouseLeave(e) {
    const card = e.currentTarget;
    card.style.setProperty('--mouseX', 'center');
    card.style.setProperty('--mouseY', 'center');
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    // Header scroll effect
    window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.pageYOffset;
        
        // Header visibility
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        // Header background
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 50));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Particles Background
function initParticles() {
    const particlesContainer = document.querySelector('.services-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random positioning and animation
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    particle.addEventListener('animationend', () => {
        particle.remove();
        createParticle(container);
    });
}

// Modal Handling
function initModalHandling() {
    // Create modal container if it doesn't exist
    let modalContainer = document.querySelector('.modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        document.body.appendChild(modalContainer);
    }
}

function showServicePreview(serviceId) {
    // Implement your modal content based on serviceId
    const modalContent = createModalContent(serviceId);
    showModal(modalContent);
}

function createModalContent(serviceId) {
    // Create and return modal content based on serviceId
    const content = document.createElement('div');
    content.className = 'modal-content';
    // Add your modal content here
    return content;
}

function showModal(content) {
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.innerHTML = '';
    modalContainer.appendChild(content);
    modalContainer.classList.add('active');

    // Close button functionality
    const closeBtn = content.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modalContainer.classList.remove('active');
        });
    }
}

// Touch Effects
function initTouchEffects() {
    const interactiveElements = document.querySelectorAll('.service-card, button, a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });
    });
}

function handleTouchStart(e) {
    this.classList.add('touch-active');
}

function handleTouchEnd(e) {
    this.classList.remove('touch-active');
}

// Utility Functions
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

// Window Resize Handler
window.addEventListener('resize', debounce(() => {
    // Add any resize-specific logic here
}, 250));

// Load Event Handler
window.addEventListener('load', () => {
    // Add any load-specific logic here
    document.body.classList.add('loaded');
});
