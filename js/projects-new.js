/**
 * Elan's Tech World - Projects Page JavaScript
 * This script handles the dynamic functionality of the projects page
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeAll();
});

/**
 * Initialize all functionality
 */
function initializeAll() {
    initHeroParticles();
    initFilterTabs();
    initProjectDetails();
    initStatsCounter();
    initServicesCarousel();
    initMobileNav();
    initLoadMore();
}

/**
 * Initialize hero section particles
 */
function initHeroParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;

    // Create particles
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random positioning and styling
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.6 + 0.2;
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        heroParticles.appendChild(particle);
    }

    // Add custom styles for particles
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            background-color: #f9c200;
            border-radius: 50%;
            animation: float linear infinite;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
            }
            25% {
                transform: translateY(-${window.innerHeight * 0.2}px) translateX(${window.innerWidth * 0.1}px);
            }
            50% {
                transform: translateY(-${window.innerHeight * 0.1}px) translateX(${window.innerWidth * 0.2}px);
            }
            75% {
                transform: translateY(-${window.innerHeight * 0.3}px) translateX(${window.innerWidth * 0.05}px);
            }
            100% {
                transform: translateY(0) translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize project filtering tabs
 */
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active class
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.filter;
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.dataset.category?.split(' ') || [];
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Initialize project details modal
 */
function initProjectDetails() {
    const detailButtons = document.querySelectorAll('.project-details');
    const modal = document.querySelector('.project-modal');
    const modalBody = document.querySelector('.modal-body');
    const modalClose = document.querySelector('.modal-close');
    
    if (!modal || !modalBody) return;
    
    // Project data for modal
    const projectData = {
        'iconic-aesthetics': {
            title: 'Iconic Aesthetics',
            description: 'Complete business technology solution for a beauty clinic.',
            fullDescription: `
                <p>Iconic Aesthetics needed a comprehensive technology solution to streamline their operations and enhance customer experience. We delivered a custom-designed website with an integrated booking system, implemented a Square Point of Sale system, created branded business materials, and set up their office technology infrastructure.</p>
                
                <h3>Project Details</h3>
                <ul>
                    <li>Custom website design with mobile-first approach</li>
                    <li>Online booking and appointment management system</li>
                    <li>Square POS system implementation with inventory management</li>
                    <li>Customer database and loyalty program setup</li>
                    <li>Business card and marketing material design</li>
                    <li>Social media integration and branding</li>
                    <li>Staff training and ongoing technical support</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    <span>HTML5/CSS3</span>
                    <span>JavaScript</span>
                    <span>Square APIs</span>
                    <span>Payment Processing</span>
                    <span>Responsive Design</span>
                </div>
                
                <h3>Results</h3>
                <p>Since implementing our technology solutions, Iconic Aesthetics has seen a 40% increase in online bookings and significantly improved their customer management process. The integrated POS system has streamlined their payment processing and inventory management.</p>
            `,
            images: ['iconicwebsiteimage.jpeg'],
            link: 'https://iconic-aesthetics.com'
        },
        'east-coast-realty': {
            title: 'East Coast Realty by Zarina',
            description: 'Technology solution for a real estate firm.',
            fullDescription: `
                <p>East Coast Realty needed a modern digital presence and comprehensive office technology setup. We delivered a complete solution that included a professional website with property listings, office network infrastructure, and custom marketing materials.</p>
                
                <h3>Project Details</h3>
                <ul>
                    <li>Real estate website with property search functionality</li>
                    <li>MLS integration for automatic property listings</li>
                    <li>Agent profile management system</li>
                    <li>Complete office computer network installation</li>
                    <li>Security system implementation</li>
                    <li>Custom business cards and marketing materials</li>
                    <li>Staff training on all systems</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    <span>WordPress</span>
                    <span>MLS Integration</span>
                    <span>Network Infrastructure</span>
                    <span>Security Systems</span>
                    <span>Responsive Design</span>
                </div>
                
                <h3>Results</h3>
                <p>The technology solutions have helped East Coast Realty establish a strong online presence and streamline their operations. Their new systems have improved property management efficiency and enhanced the client experience.</p>
            `,
            images: ['zarinaswebsite.jpeg', 'zarinasoffice2.jpeg'],
            link: 'https://eastcoastrealtyusa.com'
        },
        'cohen-associates': {
            title: 'Cohen & Associates',
            description: 'Secure technology solution for tax and accounting services.',
            fullDescription: `
                <p>Cohen & Associates required a secure and professional technology infrastructure for their accounting firm. We implemented a comprehensive solution that includes a secure website with client portal, document management system, and office network with enhanced security measures.</p>
                
                <h3>Project Details</h3>
                <ul>
                    <li>Professional website with secure client portal</li>
                    <li>Encrypted document sharing system</li>
                    <li>Appointment scheduling functionality</li>
                    <li>Secure office network implementation</li>
                    <li>Data backup and disaster recovery systems</li>
                    <li>Tax resource library and client education section</li>
                    <li>Business software integration</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    <span>Secure Web Development</span>
                    <span>Encryption Protocols</span>
                    <span>Network Security</span>
                    <span>Cloud Backup Solutions</span>
                    <span>SSL/TLS Implementation</span>
                </div>
                
                <h3>Results</h3>
                <p>The implemented solutions have significantly enhanced client data security while improving operational efficiency. Clients now benefit from secure document sharing and a streamlined experience when working with the firm.</p>
            `,
            images: ['cohenlogo.jpg'],
            link: 'https://cohentaxaccounting.com'
        },
        'doug-uhlig': {
            title: 'Doug Uhlig Psychological Services',
            description: 'HIPAA-compliant technology solution for a psychology practice.',
            fullDescription: `
                <p>Doug Uhlig Psychological Services needed a HIPAA-compliant technology solution for their practice. We delivered a secure website with appointment scheduling, integrated Apple devices for practice management, and implemented secure systems for patient records.</p>
                
                <h3>Project Details</h3>
                <ul>
                    <li>HIPAA-compliant website with secure appointment scheduling</li>
                    <li>Patient portal for secure communication</li>
                    <li>Apple device setup and management</li>
                    <li>Electronic health record system integration</li>
                    <li>Secure backup and disaster recovery solutions</li>
                    <li>Staff training on security protocols</li>
                    <li>Ongoing technical support and maintenance</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    <span>HIPAA Compliance</span>
                    <span>Apple Integration</span>
                    <span>Secure Communications</span>
                    <span>EHR Systems</span>
                    <span>Data Encryption</span>
                </div>
                
                <h3>Results</h3>
                <p>The practice now benefits from streamlined operations while maintaining the highest levels of patient data security and confidentiality, allowing them to focus more on patient care and less on administrative tasks.</p>
            `,
            images: ['psychology.jpg'],
            link: 'https://douguligpsychology.com'
        },
        's-cream': {
            title: 'S-Cream',
            description: 'Comprehensive technology solution for an ice cream shop.',
            fullDescription: `
                <p>S-Cream required a complete technology ecosystem for their new ice cream shop. We implemented a solution that included an e-commerce website with online ordering, digital menu system, POS integration, and branded materials design.</p>
                
                <h3>Project Details</h3>
                <ul>
                    <li>E-commerce website with online ordering functionality</li>
                    <li>Digital menu system with real-time updates</li>
                    <li>Point of Sale system with inventory management</li>
                    <li>Customer loyalty program implementation</li>
                    <li>Brand identity package including logo and marketing materials</li>
                    <li>Social media integration and management tools</li>
                    <li>Staff training and technical support</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    <span>E-Commerce</span>
                    <span>Payment Processing</span>
                    <span>POS Integration</span>
                    <span>Inventory Management</span>
                    <span>Brand Design</span>
                </div>
                
                <h3>Results</h3>
                <p>The technology solutions have helped S-Cream establish a strong market presence with 30% of their sales now coming through online orders. Their integrated systems have improved efficiency and customer satisfaction.</p>
            `,
            images: ['scream.jpg'],
            link: 'https://s-cream.com'
        },
        'century-one': {
            title: 'Century One Management Services',
            description: 'Property management technology solution.',
            fullDescription: `
                <p>Century One Management Services needed a comprehensive property management technology solution. We delivered a complete system including a tenant portal, maintenance request tracking, office network implementation, and security infrastructure.</p>
                
                <h3>Project Details</h3>
                <ul>
                    <li>Property management portal with tenant accounts</li>
                    <li>Online rent payment processing</li>
                    <li>Maintenance request system with tracking</li>
                    <li>Property listing and availability management</li>
                    <li>Office network infrastructure implementation</li>
                    <li>Security camera system installation</li>
                    <li>Data management and reporting tools</li>
                </ul>
                
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    <span>Web Portal Development</span>
                    <span>Payment Processing</span>
                    <span>Network Infrastructure</span>
                    <span>Security Systems</span>
                    <span>Data Management</span>
                </div>
                
                <h3>Results</h3>
                <p>The implemented solution has significantly improved tenant satisfaction with easier communication and payment processing. Management efficiency has increased with automated maintenance tracking and reporting.</p>
            `,
            images: ['centuryone.jpg'],
            link: 'https://centuryonemanagement.com'
        }
    };
    
    // Open modal with project details
    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.dataset.project;
            const project = projectData[projectId];
            
            if (project) {
                // Create modal content
                let modalContent = `
                    <div class="modal-header">
                        <h2>${project.title}</h2>
                        <p class="modal-subtitle">${project.description}</p>
                    </div>
                    
                    <div class="modal-gallery">
                `;
                
                // Add images
                project.images.forEach(image => {
                    modalContent += `<img src="../assets/images/${image}" alt="${project.title}" class="modal-image">`;
                });
                
                // Add project details
                modalContent += `
                    </div>
                    
                    <div class="modal-description">
                        ${project.fullDescription}
                    </div>
                    
                    <div class="modal-footer">
                        <a href="${project.link}" target="_blank" class="modal-link">Visit Website <i class="fas fa-external-link-alt"></i></a>
                    </div>
                `;
                
                modalBody.innerHTML = modalContent;
                
                // Open modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Add modal styles
                const modalStyle = document.createElement('style');
                modalStyle.id = 'modal-dynamic-styles';
                modalStyle.textContent = `
                    .modal-header {
                        margin-bottom: 30px;
                    }
                    
                    .modal-subtitle {
                        color: var(--text-muted);
                        font-size: 1.1rem;
                    }
                    
                    .modal-gallery {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    
                    .modal-image {
                        width: 100%;
                        border-radius: 10px;
                        height: auto;
                        object-fit: cover;
                        aspect-ratio: 16/9;
                    }
                    
                    .modal-description {
                        color: var(--text-muted);
                        line-height: 1.7;
                    }
                    
                    .modal-description h3 {
                        color: var(--primary);
                        margin: 30px 0 15px;
                        font-size: 1.4rem;
                    }
                    
                    .modal-description ul {
                        padding-left: 20px;
                        margin-bottom: 20px;
                    }
                    
                    .modal-description li {
                        margin-bottom: 10px;
                    }
                    
                    .tech-tags {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        margin: 20px 0;
                    }
                    
                    .tech-tags span {
                        background: rgba(249, 194, 0, 0.1);
                        color: var(--primary);
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 0.9rem;
                    }
                    
                    .modal-footer {
                        margin-top: 40px;
                        text-align: center;
                    }
                    
                    .modal-link {
                        display: inline-block;
                        padding: 15px 40px;
                        background: var(--primary-gradient);
                        color: var(--dark-bg);
                        text-decoration: none;
                        border-radius: 30px;
                        font-weight: 600;
                        transition: var(--transition);
                    }
                    
                    .modal-link:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(249, 194, 0, 0.3);
                    }
                `;
                
                const oldStyle = document.getElementById('modal-dynamic-styles');
                if (oldStyle) {
                    oldStyle.remove();
                }
                
                document.head.appendChild(modalStyle);
            }
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
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Initialize stats counter animation
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    // Create observer for stat elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.dataset.value);
                
                // Animate counter
                animateCounter(target, value);
                
                // Unobserve after animation starts
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });
    
    // Observe all stat elements
    stats.forEach(stat => observer.observe(stat));
    
    // Counter animation function
    function animateCounter(element, finalValue) {
        let startTime;
        const duration = 2000; // 2 seconds
        
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuad = t => t * (2 - t);
            
            // Calculate current value
            const currentValue = Math.floor(easeOutQuad(progress) * finalValue);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = finalValue;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
}

/**
 * Initialize services carousel
 */
function initServicesCarousel() {
    const carousel = document.querySelector('.services-carousel');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.service-card');
    let currentIndex = 0;
    let cardWidth = 0;
    let visibleCards = 0;
    
    // Initialize carousel
    function initCarousel() {
        cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginRight);
        visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
        
        // Generate dots
        createDots();
        
        // Update carousel
        updateCarousel();
    }
    
    // Create navigation dots
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        const dotsCount = Math.ceil(cards.length / visibleCards);
        
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            
            if (i === 0) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                currentIndex = i * visibleCards;
                updateCarousel();
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update carousel position and state
    function updateCarousel() {
        // Adjust index if needed
        if (currentIndex > cards.length - visibleCards) {
            currentIndex = cards.length - visibleCards;
        }
        
        if (currentIndex < 0) {
            currentIndex = 0;
        }
        
        // Update carousel position
        carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update dots
        const dots = dotsContainer?.querySelectorAll('.carousel-dot');
        if (dots) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', Math.floor(currentIndex / visibleCards) === i);
            });
        }
        
        // Update buttons state
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentIndex >= cards.length - visibleCards;
        }
    }
    
    // Add event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex -= visibleCards;
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex += visibleCards;
            updateCarousel();
        });
    }
    
    // Initialize carousel on load
    initCarousel();
    
    // Update on resize
    window.addEventListener('resize', debounce(initCarousel, 250));
}

/**
 * Initialize mobile navigation
 */
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;
    
    if (!hamburger || !mobileNav) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        body.style.overflow = isExpanded ? 'hidden' : '';
    });
    
    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        });
    });
    
    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
    });
    
    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
    });
}

/**
 * Initialize load more functionality
 */
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    // Set initial state
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = projectsGrid.querySelectorAll('.project-card');
    const initialCount = 6;
    let visibleCount = initialCount;
    
    // Hide extra cards initially
    if (projectCards.length > initialCount) {
        for (let i = initialCount; i < projectCards.length; i++) {
            projectCards[i].style.display = 'none';
        }
        
        loadMoreBtn.style.display = 'inline-block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
    
    // Add event listener
    loadMoreBtn.addEventListener('click', () => {
        // Show next batch of projects
        for (let i = visibleCount; i < visibleCount + 3 && i < projectCards.length; i++) {
            projectCards[i].style.display = 'flex';
            
            // Animate appearance
            setTimeout(() => {
                projectCards[i].style.opacity = '1';
                projectCards[i].style.transform = 'translateY(0)';
            }, 50 * (i - visibleCount));
        }
        
        visibleCount += 3;
        
        // Hide button if all projects are shown
        if (visibleCount >= projectCards.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

/**
 * Utility function: Debounce
 */
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
