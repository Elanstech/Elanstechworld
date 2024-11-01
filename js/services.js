// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTypewriter();
    initializeServiceFilters();
    initializeModals();
    initializeHamburgerMenu();
    initializeScrollEffects();
});

// Typewriter effect for hero section
function initializeTypewriter() {
    const words = ["Technology Solutions", "Innovation", "Excellence"];
    const typingText = document.querySelector('.typing-text');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isWaiting = true;
            setTimeout(() => {
                isDeleting = true;
                isWaiting = false;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        const typingSpeed = isDeleting ? 100 : 200;
        if (!isWaiting) {
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(type, 2000);
        }
    }

    if (typingText) {
        type();
    }
}

// Service category filtering
function initializeServiceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            serviceCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Modal functionality
function initializeModals() {
    const modal = document.getElementById('serviceModal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalClose = modal.querySelector('.modal-close');

    // Service content mapping
    const serviceContent = {
        'business-materials': {
            title: 'Custom Business Materials',
            content: `
                <p>Transform your business identity with our professional design services.</p>
                <h3>Our Services Include:</h3>
                <ul>
                    <li>Professional business card design</li>
                    <li>Eye-catching flyer creation</li>
                    <li>Compelling brochure design</li>
                    <li>Comprehensive marketing materials</li>
                </ul>
                <h3>Why Choose Us?</h3>
                <ul>
                    <li>Expert designers with years of experience</li>
                    <li>Quick turnaround times</li>
                    <li>Unlimited revisions until satisfaction</li>
                    <li>High-quality printing options available</li>
                </ul>
            `
        },
        'apple-products': {
            title: 'Apple Product Setup',
            content: `
                <p>Get the most out of your Apple devices with our professional setup and support services.</p>
                <h3>Services Include:</h3>
                <ul>
                    <li>Complete device configuration</li>
                    <li>Data migration and backup</li>
                    <li>Software installation and updates</li>
                    <li>iCloud and Apple ID setup</li>
                </ul>
                <h3>Additional Benefits:</h3>
                <ul>
                    <li>Post-setup support</li>
                    <li>Performance optimization</li>
                    <li>Security configuration</li>
                    <li>Training sessions available</li>
                </ul>
            `
        },
        'web-design': {
            title: 'Web Design Services',
            content: `
                <p>Create a stunning online presence with our professional web design services.</p>
                <h3>What We Offer:</h3>
                <ul>
                    <li>Custom website design</li>
                    <li>Responsive mobile-first development</li>
                    <li>E-commerce solutions</li>
                    <li>SEO optimization</li>
                </ul>
                <h3>Our Process:</h3>
                <ul>
                    <li>Initial consultation and planning</li>
                    <li>Design mockups and prototypes</li>
                    <li>Development and testing</li>
                    <li>Launch and maintenance support</li>
                </ul>
            `
        },
        'computer-setup': {
            title: 'Computer Setup & Configuration',
            content: `
                <p>Professional computer setup and optimization services for peak performance.</p>
                <h3>Setup Services:</h3>
                <ul>
                    <li>Hardware installation and testing</li>
                    <li>Operating system configuration</li>
                    <li>Software installation and setup</li>
                    <li>Network configuration</li>
                </ul>
                <h3>Optimization Services:</h3>
                <ul>
                    <li>Performance tuning</li>
                    <li>Security software installation</li>
                    <li>Data backup solutions</li>
                    <li>System maintenance plans</li>
                </ul>
            `
        },
        'pos-system': {
            title: 'POS System Setup',
            content: `
                <p>Complete point of sale solutions for your business needs.</p>
                <h3>Implementation Services:</h3>
                <ul>
                    <li>Hardware installation</li>
                    <li>Software configuration</li>
                    <li>Payment processing setup</li>
                    <li>Inventory system integration</li>
                </ul>
                <h3>Training & Support:</h3>
                <ul>
                    <li>Staff training sessions</li>
                    <li>Technical support</li>
                    <li>System updates and maintenance</li>
                    <li>Troubleshooting assistance</li>
                </ul>
            `
        },
        'it-support': {
            title: 'IT Support Services',
            content: `
                <p>Comprehensive technical support for all your IT needs.</p>
                <h3>Support Options:</h3>
                <ul>
                    <li>Remote technical assistance</li>
                    <li>On-site support visits</li>
                    <li>Network troubleshooting</li>
                    <li>Hardware and software support</li>
                </ul>
                <h3>Additional Services:</h3>
                <ul>
                    <li>Preventive maintenance</li>
                    <li>Security updates</li>
                    <li>Data backup and recovery</li>
                    <li>System optimization</li>
                </ul>
            `
        }
    };

    // Handle Quick View button clicks
    document.querySelectorAll('.modal-trigger').forEach(button => {
        button.addEventListener('click', (e) => {
            const serviceId = e.target.dataset.service;
            const service = serviceContent[serviceId];
            
            modalTitle.textContent = service.title;
            modalBody.innerHTML = service.content;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Handle Learn More button clicks
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.service-card');
            const serviceId = card.querySelector('.modal-trigger').dataset.service;
            const service = serviceContent[serviceId];
            
            modalTitle.textContent = service.title;
            modalBody.innerHTML = service.content;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Hamburger menu functionality
function initializeHamburgerMenu() {
    // Create hamburger button if it doesn't exist
    let hamburger = document.querySelector('.hamburger');
    if (!hamburger) {
        hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'Menu');
        hamburger.innerHTML = `
            <div></div>
            <div></div>
            <div></div>
        `;
        document.querySelector('.header-container').appendChild(hamburger);
    }

    const mobileNav = document.querySelector('.mobile-nav');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// Scroll effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Header scroll effect
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;

        // Animate service cards on scroll
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight * 0.8;

            if (cardTop < triggerPoint) {
                card.classList.add('animate');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (window.innerWidth > 768) {
        hamburger?.classList.remove('active');
        mobileNav?.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

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
