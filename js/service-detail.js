// complete-service-scripts.js

document.addEventListener('DOMContentLoaded', () => {
    initializeServicePage();
});

function initializeServicePage() {
    initHeader();
    initParticles();
    initHeroAnimations();
    initFeatureCards();
    initServiceCards();
    initTimeline();
    initPricingCards();
    initContactForm();
    initScrollAnimations();
    initMobileMenu();
}

function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class based on scroll position
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

function initParticles() {
    const heroSection = document.querySelector('.hero-particles');
    if (!heroSection) return;

    const particleCount = getParticleCount();
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(heroSection);
    }
}

function getParticleCount() {
    const width = window.innerWidth;
    if (width < 768) return 15;
    if (width < 1200) return 25;
    return 35;
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 8 + 4;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = Math.random() * 2 + 4;
    
    Object.assign(particle.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
    });
    
    container.appendChild(particle);
    
    // Recreate particle after animation
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, duration * 1000);
}

function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    // Add staggered animation to hero content children
    Array.from(heroContent.children).forEach((child, index) => {
        child.style.animationDelay = `${index * 0.2}s`;
    });
}

function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.2
    });

    cards.forEach(card => observer.observe(card));
}

function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 150);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
        
        // Add hover effect for service images
        const image = card.querySelector('.service-image img');
        if (image) {
            card.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.1)';
            });
            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        }
    });
}

function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 200);
            }
        });
    }, {
        threshold: 0.3
    });

    timelineItems.forEach(item => observer.observe(item));
}

function initPricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    const toggleBtn = document.querySelector('.pricing-toggle');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('change', (e) => {
            const isYearly = e.target.checked;
            cards.forEach(card => {
                const monthlyPrice = card.querySelector('.price-monthly');
                const yearlyPrice = card.querySelector('.price-yearly');
                if (monthlyPrice && yearlyPrice) {
                    monthlyPrice.style.display = isYearly ? 'none' : 'block';
                    yearlyPrice.style.display = isYearly ? 'block' : 'none';
                }
            });
        });
    }

    // Add hover animations
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => c.style.transform = 'scale(0.95)');
            card.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', () => {
            cards.forEach(c => c.style.transform = '');
        });
    });
}

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            // Add form validation
            if (!validateForm(form)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Replace with your actual endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showNotification('success', 'Message sent successfully!');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showNotification('error', error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            highlightError(input);
        } else {
            removeError(input);
        }
    });

    return isValid;
}

function highlightError(input) {
    input.classList.add('error');
    const errorMessage = document.createElement('span');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'This field is required';
    input.parentNode.appendChild(errorMessage);
}

function removeError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.2
    });

    animatedElements.forEach(element => observer.observe(element));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

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

// Handle window resize events
window.addEventListener('resize', debounce(() => {
    const heroSection = document.querySelector('.hero-particles');
    if (heroSection) {
        heroSection.innerHTML = '';
        initParticles();
    }
}, 250));

// Utility function for debouncing
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
