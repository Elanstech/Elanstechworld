// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeWebsite();
});

function initializeWebsite() {
    initHeaderScroll();
    initMobileNav();
    initParticles();
    initHeroTyping();
    initScrollAnimations();
    initServiceCards();
    initTimelineAnimations();
    initPricingCards();
    initContactForm();
    initBackToTop();
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;
    let isOpen = false;

    hamburger?.addEventListener('click', () => {
        isOpen = !isOpen;
        
        if (isOpen) {
            mobileNav.style.transform = 'translateX(0)';
            hamburger.classList.add('active');
            body.style.overflow = 'hidden';
        } else {
            mobileNav.style.transform = 'translateX(100%)';
            hamburger.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close mobile nav when clicking links
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.style.transform = 'translateX(100%)';
            hamburger.classList.remove('active');
            body.style.overflow = '';
            isOpen = false;
        });
    });
}

// Particle System
function initParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(container));
    }

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const angle = Math.atan2(dy, dx);
                const force = (200 - distance) / 200;
                particle.vx += Math.cos(angle) * force * 0.2;
                particle.vy += Math.sin(angle) * force * 0.2;
            }
        });
    });

    function animate() {
        particles.forEach(particle => {
            updateParticle(particle, container);
        });
        requestAnimationFrame(animate);
    }

    animate();
}

function createParticle(container) {
    const element = document.createElement('div');
    element.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const x = Math.random() * container.offsetWidth;
    const y = Math.random() * container.offsetHeight;
    
    const particle = {
        element,
        x,
        y,
        size,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.2
    };
    
    element.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        opacity: ${particle.alpha};
    `;
    
    container.appendChild(element);
    return particle;
}

function updateParticle(particle, container) {
    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Add slight random movement
    particle.vx += (Math.random() - 0.5) * 0.1;
    particle.vy += (Math.random() - 0.5) * 0.1;
    
    // Limit velocity
    const maxVelocity = 2;
    const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (velocity > maxVelocity) {
        particle.vx = (particle.vx / velocity) * maxVelocity;
        particle.vy = (particle.vy / velocity) * maxVelocity;
    }
    
    // Bounce off walls
    if (particle.x < 0 || particle.x > container.offsetWidth) {
        particle.vx *= -1;
    }
    if (particle.y < 0 || particle.y > container.offsetHeight) {
        particle.vy *= -1;
    }
    
    // Apply position
    particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
}

// Typing Effect
function initHeroTyping() {
    const textElement = document.querySelector('.typing-text');
    if (!textElement) return;

    const phrases = [
        'Professional Solutions',
        'Creative Designs',
        'Expert Support',
        'Quality Service'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 1500; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before next phrase
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .timeline-item, .pricing-card, .feature-card'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => observer.observe(element));
}

// Service Cards Interaction
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(-15deg) scale(1)';
            }
        });
    });
}

// Timeline Animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

// Pricing Cards Interaction
function initPricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => {
                if (c !== card) {
                    c.style.transform = 'scale(0.95)';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            cards.forEach(c => {
                c.style.transform = '';
            });
        });
    });
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm(form)) {
            try {
                await submitForm(form);
                showNotification('success', 'Message sent successfully!');
                form.reset();
            } catch (error) {
                showNotification('error', 'Failed to send message. Please try again.');
            }
        }
    });

    // Floating label animation
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentNode.classList.remove('focused');
            }
        });
    });
}

// Form Validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showInputError(input, 'This field is required');
        } else {
            clearInputError(input);
        }
        
        if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            showInputError(input, 'Please enter a valid email address');
        }
    });
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showInputError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorDiv = formGroup.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    input.classList.add('error');
}

function clearInputError(input) {
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.classList.remove('error');
}

// Notification System
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Form Submission (Replace with your actual API endpoint)
function submitForm(form) {
    return new Promise((resolve) => {
        // Simulate API call
        setTimeout(resolve, 1000);
    });
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

// Handle Window Resize
window.addEventListener('resize', debounce(() => {
    const container = document.querySelector('.particles-container');
    if (container) {
        container.innerHTML = '';
        initParticles();
    }
}, 250));

// Initialize on load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
