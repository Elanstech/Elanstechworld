// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeServices();
});

function initializeServices() {
    initHeaderScroll();
    initMobileNav();
    initParticles();
    initServicesFilter();
    initScrollAnimations();
    initServiceCards();
    initFeatureCards();
    initPricingToggle();
    initPricingCards();
    initSmoothScroll();
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

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav when clicking links
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
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

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
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
        background: white;
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
    `;
    
    container.appendChild(element);
    return particle;
}

function updateParticle(particle, container) {
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
    
    particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
}

// Services Filter
function initServicesFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            
            // GSAP animation for filtering
            gsap.to(serviceCards, {
                duration: 0.3,
                opacity: 0,
                y: 20,
                stagger: 0.1,
                onComplete: () => {
                    // Filter service cards
                    serviceCards.forEach(card => {
                        if (filter === 'all' || card.dataset.category === filter) {
                            card.style.display = 'block';
                            gsap.to(card, {
                                duration: 0.5,
                                opacity: 1,
                                y: 0,
                                delay: 0.1
                            });
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .feature-card, .pricing-card, .section-title, .section-subtitle'
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
        // Hover effect for card icon
        const icon = card.querySelector('.service-icon');
        card.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                duration: 0.3,
                rotation: 0,
                scale: 1.1,
                ease: "back.out(1.7)"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                duration: 0.3,
                rotation: -15,
                scale: 1,
                ease: "power2.out"
            });
        });

        // Image parallax effect
        const image = card.querySelector('.service-image img');
        if (image) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                gsap.to(image, {
                    duration: 0.5,
                    x: x * 10,
                    y: y * 10,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    duration: 0.5,
                    x: 0,
                    y: 0,
                    ease: "power2.out"
                });
            });
        }
    });
}

// Feature Cards Animation
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const icon = card.querySelector('.feature-icon');
        
        // Hover animations
        card.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                duration: 0.3,
                rotation: 0,
                scale: 1.1,
                ease: "back.out(1.7)"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                duration: 0.3,
                rotation: -15,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
}

// Pricing Toggle
function initPricingToggle() {
    const toggle = document.getElementById('billingToggle');
    const monthlyPrices = document.querySelectorAll('.price.monthly');
    const yearlyPrices = document.querySelectorAll('.price.yearly');
    const periods = document.querySelectorAll('.period');
    const pricingCards = document.querySelectorAll('.pricing-card');

    if (!toggle) return;

    toggle.addEventListener('change', () => {
        const isYearly = toggle.checked;
        
        // Animate price change
        gsap.to(pricingCards, {
            duration: 0.3,
            scale: 0.95,
            opacity: 0.5,
            stagger: 0.1,
            onComplete: () => {
                // Update prices display
                monthlyPrices.forEach(price => {
                    price.style.display = isYearly ? 'none' : 'inline-block';
                });
                
                yearlyPrices.forEach(price => {
                    price.style.display = isYearly ? 'inline-block' : 'none';
                });
                
                // Update period text
                periods.forEach(period => {
                    period.textContent = isYearly ? '/year' : '/month';
                });

                // Animate cards back
                gsap.to(pricingCards, {
                    duration: 0.3,
                    scale: 1,
                    opacity: 1,
                    stagger: 0.1
                });
            }
        });
    });
}

// Pricing Cards Interaction
function initPricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Scale down other cards
            pricingCards.forEach(otherCard => {
                if (otherCard !== card && !otherCard.classList.contains('featured')) {
                    gsap.to(otherCard, {
                        duration: 0.3,
                        scale: 0.95,
                        opacity: 0.7,
                        ease: "power2.out"
                    });
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            // Reset other cards
            pricingCards.forEach(otherCard => {
                if (!otherCard.classList.contains('featured')) {
                    gsap.to(otherCard, {
                        duration: 0.3,
                        scale: 1,
                        opacity: 1,
                        ease: "power2.out"
                    });
                }
            });
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: "power2.inOut"
                });
            }
        });
    });
}

// Handle Window Resize
window.addEventListener('resize', debounce(() => {
    const container = document.querySelector('.particles-container');
    if (container) {
        container.innerHTML = '';
        initParticles();
    }
}, 250));

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
