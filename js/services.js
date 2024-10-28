// Complete standalone JavaScript for services page
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initMobileNav();
    initHeaderScroll();
    initServiceCards();
    initModals();
    initScrollAnimations();
    initIntersectionObserver();
});

// Particle System
function initParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 30 : 50;
    let particles = [];

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}%;
            top: ${startY}%;
            animation: float ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            opacity: ${Math.random() * 0.5 + 0.3};
        `;
        
        particles.push(particle);
        particlesContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentElement) {
                particle.parentElement.removeChild(particle);
                particles = particles.filter(p => p !== particle);
            }
        }, duration * 1000);
    }

    // Initial particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    // Continuously create new particles
    setInterval(() => {
        if (particles.length < particleCount) {
            createParticle();
        }
    }, 300);

    // Clean up on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            particles.forEach(particle => particle.remove());
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                createParticle();
            }
        }, 250);
    });
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav ul li a');
    const body = document.body;

    if (!hamburger || !mobileNav) return;

    let isAnimating = false;

    function toggleNav(force = null) {
        if (isAnimating) return;
        isAnimating = true;

        const shouldOpen = force !== null ? force : !mobileNav.classList.contains('active');
        
        if (shouldOpen) {
            mobileNav.style.display = 'block';
            body.style.overflow = 'hidden';
            
            requestAnimationFrame(() => {
                hamburger.classList.add('active');
                mobileNav.classList.add('active');
                
                // Animate nav items sequentially
                mobileNavLinks.forEach((link, index) => {
                    setTimeout(() => {
                        link.parentElement.style.opacity = '1';
                        link.parentElement.style.transform = 'translateX(0)';
                    }, 100 * (index + 1));
                });
            });
        } else {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
            
            // Reset nav items
            mobileNavLinks.forEach(link => {
                link.parentElement.style.opacity = '0';
                link.parentElement.style.transform = 'translateX(50px)';
            });

            setTimeout(() => {
                mobileNav.style.display = 'none';
            }, 300);
        }

        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }

    // Hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNav();
    });

    // Close nav when clicking links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleNav(false);
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleNav(false);
        }
    });

    // Close nav on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleNav(false);
        }
    });

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                toggleNav(false);
            }
        }, 250);
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    const heroContent = document.querySelector('.hero-content');
    let lastScroll = 0;
    let scrollTimeout;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class to header
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax effect for hero content
        if (heroContent && currentScroll < window.innerHeight) {
            heroContent.style.transform = `translateY(${currentScroll * 0.3}px)`;
            heroContent.style.opacity = 1 - (currentScroll / window.innerHeight);
        }
        
        lastScroll = currentScroll;
    }

    // Throttled scroll handler
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = requestAnimationFrame(() => {
                handleScroll();
                scrollTimeout = null;
            });
        }
    });
}

// Service Cards
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        let isTouch = false;

        // Mouse move effect
        card.addEventListener('mousemove', (e) => {
            if (isTouch) return;
            
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

        // Reset card on mouse leave
        card.addEventListener('mouseleave', () => {
            if (isTouch) return;
            card.style.transform = 'none';
        });

        // Touch handling
        card.addEventListener('touchstart', () => {
            isTouch = true;
            card.classList.add('touch-active');
        }, { passive: true });

        card.addEventListener('touchend', () => {
            card.classList.remove('touch-active');
        });
    });
}

// Modal System
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
            <button class="modal-close" aria-label="Close modal">&times;</button>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
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

// Modal Content Generator
function getModalContent(serviceId) {
    const services = {
        'business-setup': {
            title: 'Business Computer Setup',
            description: 'Professional computer setup and optimization services tailored for businesses of all sizes.',
            features: [
                'Custom hardware configuration and optimization',
                'Enterprise software installation and setup',
                'Secure network configuration',
                'Advanced security implementation',
                'Automated backup solutions',
                'Employee training sessions',
                'Remote support capabilities',
                '24/7 technical assistance',
                'System performance monitoring',
                'Regular maintenance scheduling'
            ],
            benefits: [
                'Increased productivity through optimized systems',
                'Enhanced data security and protection',
                'Reduced downtime and technical issues',
                'Professional staff training and support'
            ],
            price: 'Starting from $499',
            packages: [
                {
                    name: 'Basic Setup',
                    price: '$499',
                    includes: '5 workstations'
                },
                {
                    name: 'Business Pro',
                    price: '$999',
                    includes: '10 workstations + server'
                },
                {
                    name: 'Enterprise',
                    price: 'Custom',
                    includes: 'Unlimited workstations'
                }
            ]
        },
        'web-design': {
            title: 'Web Design Services',
            description: 'Custom website design and development solutions that drive results.',
            features: [
                'Custom responsive design',
                'Mobile-first approach',
                'SEO optimization',
                'Content management system',
                'E-commerce integration',
                'Performance optimization',
                'Security features',
                'Analytics integration',
                'Social media integration',
                'Contact form setup'
            ],
            benefits: [
                'Increased online visibility',
                'Better user engagement',
                'Higher conversion rates',
                'Professional brand representation'
            ],
            price: 'Starting from $999',
            packages: [
                {
                    name: 'Basic Website',
                    price: '$999',
                    includes: '5 pages + basic SEO'
                },
                {
                    name: 'E-commerce',
                    price: '$2499',
                    includes: 'Online store + payment integration'
                },
                {
                    name: 'Custom Solution',
                    price: 'Custom',
                    includes: 'Advanced features and integrations'
                }
            ]
        },
        'pos-system': {
            title: 'POS System Setup',
            description: 'Complete point-of-sale solutions for retail and restaurant businesses.',
            features: [
                'Hardware installation and configuration',
                'Software setup and customization',
                'Inventory management system',
                'Staff training and support',
                'Payment processing integration',
                'Real-time reporting setup',
                'Cloud backup configuration',
                'Technical support',
                'Mobile POS options',
                'Customer loyalty program integration'
            ],
            benefits: [
                'Streamlined checkout process',
                'Accurate inventory tracking',
                'Detailed sales reporting',
                'Enhanced customer service'
            ],
            price: 'Starting from $799',
            packages: [
                {
                    name: 'Starter POS',
                    price: '$799',
                    includes: 'Single terminal setup'
                },
                {
                    name: 'Business POS',
                    price: '$1499',
                    includes: 'Multi-terminal + inventory'
                },
                {
                    name: 'Enterprise POS',
                    price: 'Custom',
                    includes: 'Full system integration'
                }
            ]
        },
        'apple-sales': {
            title: 'Apple Product Sales',
            description: 'Authorized Apple product reseller with professional setup and support.',
            features: [
                'Latest Apple devices available',
                'Professional setup and configuration',
                'Data migration assistance',
                'AppleCare+ registration',
                'Business integration services',
                'Custom configurations available',
                'Warranty support handling',
                'Trade-in options',
                'Business financing options',
                'Volume purchase programs'
            ],
            benefits: [
                'Guaranteed authentic products',
                'Professional setup included',
                'Ongoing support available',
                'Special business pricing'
            ],
            price: 'Contact for current prices',
            packages: [
                {
                    name: 'Individual',
                    price: 'Retail Price',
                    includes: 'Single device + setup'
                },
                {
                    name: 'Business',
                    price: 'Volume Discount',
                    includes: 'Multiple devices + support'
                },
                {
                    name: 'Enterprise',
                    price: 'Custom',
                    includes: 'Full deployment service'
                }
            ]
        },
        'it-support': {
            title: 'IT Support & Maintenance',
            description: 'Comprehensive IT support services for businesses with 24/7 availability.',
            features: [
                '24/7 technical support',
                'Remote troubleshooting',
                'System monitoring and alerts',
                'Regular maintenance service',
                'Security updates and patches',
                'Data backup management',
                'Network administration',
                'Emergency response',
                'Preventive maintenance',
                'IT consultation services'
            ],
            benefits: [
                'Reduced system downtime',
                'Proactive issue prevention',
                'Expert technical support',
                'Peace of mind'
            ],
            price: 'Starting from $199/month',
            packages: [
                {
                    name: 'Basic Support',
                    price: '$199/month',
                    includes: 'Essential support'
                },
                {
                    name: 'Premium Support',
                    price: '$399/month',
                    includes: '24/7 priority support'
                },
                {
                    name: 'Enterprise',
                    price: 'Custom',
                    includes: 'Full IT management'
                }
            ]
        },
        'network-solutions': {
            title: 'Network Solutions',
            description: 'Professional network design, implementation, and management services.',
            features: [
                'Network design and setup',
                'Wi-Fi optimization',
                'Security implementation',
                'VPN configuration',
                'Firewall setup and management',
                'Performance monitoring',
                'Scalable solutions',
                'Regular maintenance',
                'Network security audits',
                'Bandwidth optimization'
            ],
            benefits: [
                'Secure and reliable network',
                'Optimized performance',
                'Scalable infrastructure',
                'Professional management'
            ],
            price: 'Starting from $699',
            packages: [
                {
                    name: 'Small Business',
                    price: '$699',
                    includes: 'Basic network setup'
                },
                {
                    name: 'Professional',
                    price: '$1499',
                    includes: 'Advanced security + VPN'
                },
                {
                    name: 'Enterprise',
                    price: 'Custom',
                    includes: 'Custom network solution'
                }
            ]
        }
    };
    
    const service = services[serviceId] || {
        title: 'Service Details',
        description: 'Please contact us for more information about this service.',
        features: ['Custom solutions available'],
        benefits: ['Tailored to your needs'],
        price: 'Contact for pricing',
        packages: [{
            name: 'Custom Package',
            price: 'Custom',
            includes: 'Based on requirements'
        }]
    };
    
    return `
        <div class="modal-header">
            <h3>${service.title}</h3>
            <p class="modal-description">${service.description}</p>
        </div>

        <div class="modal-features">
            <h4>Features</h4>
            <ul>
                ${service.features.map(feature => `
                    <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
            </ul>
        </div>

        <div class="modal-benefits">
            <h4>Key Benefits</h4>
            <ul>
                ${service.benefits.map(benefit => `
                    <li><i class="fas fa-star"></i> ${benefit}</li>
                `).join('')}
            </ul>
        </div>

        <div class="modal-packages">
            <h4>Available Packages</h4>
            <div class="package-grid">
                ${service.packages.map(package => `
                    <div class="package-card">
                        <h5>${package.name}</h5>
                        <div class="package-price">${package.price}</div>
                        <div class="package-includes">
                            <p>Includes:</p>
                            <p>${package.includes}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="modal-pricing">
            <strong>${service.price}</strong>
        </div>

        <div class="modal-actions">
            <button class="contact-btn primary" onclick="window.location.href='contact.html'">
                <i class="fas fa-paper-plane"></i>
                Get Started
            </button>
            <button class="contact-btn secondary" onclick="window.location.href='tel:+1234567890'">
                <i class="fas fa-phone"></i>
                Call Now
            </button>
        </div>

        <div class="modal-footer">
            <p class="modal-note">
                * Prices may vary based on specific requirements and customizations.
                Contact us for a detailed quote.
            </p>
        </div>
    `;
}

// Scroll Animations
function initScrollAnimations() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled > 100) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
    }
}

// Intersection Observer for animation triggers
function initIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
}

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
