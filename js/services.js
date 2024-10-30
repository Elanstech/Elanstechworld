// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initHeroAnimation();
    initParticles();
    initFilters();
    initServiceCards();
    initModals();
});

// Header Scroll Effect
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Hero Text Animation
function initHeroAnimation() {
    const text = "Technology Solutions";
    const typingText = document.querySelector('.typing-text');
    let charIndex = 0;

    function type() {
        if (charIndex < text.length) {
            typingText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            // Wait and then restart
            setTimeout(() => {
                typingText.textContent = '';
                charIndex = 0;
                type();
            }, 3000);
        }
    }

    type();

    // Animate hero content
    gsap.from('.hero-content', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
}

// Particle System
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            }
        },
        retina_detect: true
    });
}

// Category Filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Animate cards
            gsap.to(serviceCards, {
                duration: 0.3,
                opacity: 0,
                y: 20,
                stagger: 0.1,
                ease: "power2.out",
                onComplete: () => {
                    serviceCards.forEach(card => {
                        if (filter === 'all' || card.dataset.category === filter) {
                            card.style.display = '';
                            gsap.to(card, {
                                duration: 0.3,
                                opacity: 1,
                                y: 0,
                                delay: 0.1,
                                ease: "power2.out"
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

// Service Cards Animation
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach((card, index) => {
        // Initial fade in
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            },
            duration: 0.8,
            y: 50,
            opacity: 0,
            delay: index * 0.1,
            ease: "power3.out"
        });

        // Mobile card click handler
        if (window.innerWidth <= 768) {
            card.addEventListener('click', () => {
                cards.forEach(c => {
                    if (c !== card) c.classList.remove('active');
                });
                card.classList.toggle('active');
            });
        }
    });
}

// Modal System
function initModals() {
    const modal = document.querySelector('.service-modal');
    const modalContent = modal.querySelector('.modal-content');
    const triggers = document.querySelectorAll('.modal-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const serviceId = trigger.dataset.service;
            openModal(serviceId);
        });
    });

    function openModal(serviceId) {
        const service = getServiceDetails(serviceId);
        
        modalContent.innerHTML = `
            <button class="modal-close">&times;</button>
            <h2>${service.title}</h2>
            <div class="modal-description">
                <p>${service.description}</p>
                <ul class="service-features">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            <div class="modal-actions">
                <a href="#" class="btn-primary">Learn More</a>
                <button class="btn-secondary" onclick="closeModal()">Close</button>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add close button functionality
        const closeButton = modalContent.querySelector('.modal-close');
        closeButton.addEventListener('click', closeModal);
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Service Details Data
function getServiceDetails(serviceId) {
    const services = {
        'business-materials': {
            title: 'Custom Business Materials',
            description: 'Professional design services for your business identity and marketing materials.',
            features: [
                'Custom business card design',
                'Professional flyer creation',
                'Brochure and marketing material design',
                'Brand identity development'
            ]
        },
        'apple-products': {
            title: 'Apple Product Setup',
            description: 'Expert setup and configuration of Apple devices for optimal performance.',
            features: [
                'Device configuration',
                'Software installation',
                'Data transfer',
                'Technical support'
            ]
        },
        'web-design': {
            title: 'Web Design',
            description: 'Custom website design and development solutions.',
            features: [
                'Custom website creation',
                'Mobile-responsive design',
                'E-commerce solutions',
                'SEO optimization'
            ]
        },
        'computer-setup': {
            title: 'Computer Setup',
            description: 'Professional computer configuration and optimization services.',
            features: [
                'Hardware installation',
                'Software configuration',
                'Performance optimization',
                'Security setup'
            ]
        },
        'pos-system': {
            title: 'POS System Setup',
            description: 'Complete point of sale solutions for your business.',
            features: [
                'System installation',
                'Staff training',
                'Custom configuration',
                'Ongoing support'
            ]
        },
        'it-support': {
            title: 'IT Support',
            description: 'Comprehensive technical support services.',
            features: [
                'Remote assistance',
                'On-site support',
                'Network setup',
                'Troubleshooting'
            ]
        }
    };

    return services[serviceId] || {
        title: 'Service Information',
        description: 'Please contact us for more information about this service.',
        features: ['Custom solutions available']
    };
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Window Resize Handler
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
});
