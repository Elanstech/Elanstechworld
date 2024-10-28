// Main JavaScript for Services Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });

    // Header Scroll Effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('nav-open');

        if (hamburger.classList.contains('active')) {
            // Animate hamburger to X
            hamburger.children[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            hamburger.children[1].style.opacity = '0';
            hamburger.children[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            // Reset hamburger animation
            hamburger.children[0].style.transform = 'none';
            hamburger.children[1].style.opacity = '1';
            hamburger.children[2].style.transform = 'none';
        }
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !e.target.closest('.mobile-nav') && 
            !e.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });

    // Service Cards Interaction
    const serviceButtons = document.querySelectorAll('.service-btn');
    const serviceDetails = document.querySelectorAll('.service-details');
    let currentOpenService = null;

    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const serviceId = this.getAttribute('data-service');
            const details = document.getElementById(serviceId);
            
            // If clicking the same service that's open
            if (currentOpenService === details) {
                closeServiceDetails(details, this);
                currentOpenService = null;
                return;
            }

            // Close any open service details
            if (currentOpenService) {
                const currentButton = document.querySelector(`[data-service="${currentOpenService.id}"]`);
                closeServiceDetails(currentOpenService, currentButton);
            }

            // Open clicked service details
            openServiceDetails(details, this);
            currentOpenService = details;
        });
    });

    function openServiceDetails(details, button) {
        details.classList.add('active');
        button.textContent = 'Close';
        button.classList.add('active');
        
        // Animate steps
        const steps = details.querySelectorAll('.step');
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    function closeServiceDetails(details, button) {
        details.classList.remove('active');
        button.textContent = 'Learn More';
        button.classList.remove('active');
    }

    // Close service details when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.service-card') && currentOpenService) {
            const currentButton = document.querySelector(`[data-service="${currentOpenService.id}"]`);
            closeServiceDetails(currentOpenService, currentButton);
            currentOpenService = null;
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Particles Animation
    initParticles();

    // Service Card Hover Effects
    initServiceCardEffects();
});

// Particles Animation Function
function initParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
            particlesContainer.appendChild(particle);
        }
    }
}

// Service Card Hover Effects
function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS variables for the glow effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Tilt effect
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(10px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
        });
    });
}

// Debounce function for performance
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

// Resize handler
const handleResize = debounce(() => {
    // Reset any necessary dimensions or positions
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.transform = 'none';
    });
}, 250);

window.addEventListener('resize', handleResize);

// Typing animation function
function initTypingAnimation() {
    const typingTexts = document.querySelectorAll('.typing-animation');
    
    typingTexts.forEach(text => {
        const content = text.textContent;
        text.textContent = '';
        let i = 0;

        function type() {
            if (i < content.length) {
                text.textContent += content.charAt(i);
                i++;
                setTimeout(type, 100);
            }
        }

        type();
    });
}

// Initialize typing animation when in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initTypingAnimation();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.typing-animation').forEach(text => {
    observer.observe(text);
});

// Service icon hover animation
const serviceIcons = document.querySelectorAll('.service-icon');
serviceIcons.forEach(icon => {
    icon.addEventListener('mouseover', () => {
        icon.style.transform = 'scale(1.2) rotate(360deg)';
    });
    
    icon.addEventListener('mouseout', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});
