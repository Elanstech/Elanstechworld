document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initHero();
    initParticles();
    initFilters();
    initServiceCards();
    initModals();
    initMobileMenu();
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

// Hero Section Animation
function initHero() {
    const text = "Professional Technology Solutions";
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
    const container = document.querySelector('.particle-container');
    if (!container) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3,
            animation: `float ${duration}s ease-in-out infinite ${delay}s`
        });
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
            if (container.children.length < particleCount) {
                createParticle();
            }
        }, duration * 1000);
    }

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
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
                <a href="/services/${serviceId}" class="btn-primary">Learn More</a>
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
            title: 'Apple Product Resell',
            description: 'Quality Apple devices with professional setup and ongoing support.',
            features: [
                'Certified Apple products',
                'Professional configuration',
                'Warranty services',
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
            title: 'Expert Computer Setup',
            description: 'Professional computer configuration and optimization services.',
            features: [
                'Hardware installation',
                'Software configuration',
                'Performance optimization',
                'Security setup'
            ]
        },
        'pos-system': {
            title: 'Custom POS System',
            description: 'Tailored point of sale solutions for your business.',
            features: [
                'Custom POS setup',
                'Hardware installation',
                'Staff training',
                'Technical support'
            ]
        },
        'website-maintenance': {
            title: 'Website Maintenance',
            description: 'Regular updates and maintenance for your website.',
            features: [
                'Regular updates',
                'Security patches',
                'Content updates',
                'Performance monitoring'
            ]
        },
        'data-backup': {
            title: 'Data Backup & Recovery',
            description: 'Secure data protection and recovery solutions.',
            features: [
                'Data backup setup',
                'Recovery services',
                'Cloud storage',
                'Disaster recovery'
            ]
        }
    };

    return services[serviceId] || {
        title: 'Service Information',
        description: 'Please contact us for more information about this service.',
        features: ['Custom solutions available']
    };
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuLinks = document.querySelectorAll('.mobile-nav a');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';

        // Animate menu items
        menuLinks.forEach((link, index) => {
            if (mobileNav.classList.contains('active')) {
                link.style.transitionDelay = `${index * 0.1}s`;
            } else {
                link.style.transitionDelay = '0s';
            }
        });
    });

    // Close menu on link click
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}
