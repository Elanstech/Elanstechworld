// modern-service-scripts.js

document.addEventListener('DOMContentLoaded', () => {
    initializeServicePage();
});

function initializeServicePage() {
    initParticles();
    initHeroTyping();
    initScrollAnimations();
    initServices();
    initTimeline();
    initPricingCards();
    initContactForm();
}

// Particle System
function initParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;

    const particleCount = calculateParticleCount();
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(container));
    }

    // Add mouse interaction
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

function calculateParticleCount() {
    return window.innerWidth < 768 ? 30 : 50;
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

// Hero Typing Effect
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

        // Speed control
        let typeSpeed = isDeleting ? 50 : 100;
        
        // Handle phrase completion
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
    const elements = document.querySelectorAll('.service-card, .timeline-item, .pricing-card, .feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
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

    elements.forEach(element => observer.observe(element));
}

// Service Cards Interaction
function initServices() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', (e) => {
            const icon = card.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(-15deg) scale(1)';
            }
        });
    });
}

// Timeline Animation
function initTimeline() {
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

    // Add floating label animation
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

// Utility Functions
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

function validateForm(form) {
    // Add your form validation logic here
    return true;
}

function submitForm(form) {
    // Add your form submission logic here
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
}

// Initialize on load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    const container = document.querySelector('.particles-container');
    if (container) {
        container.innerHTML = '';
        initParticles();
    }
}, 250));

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
