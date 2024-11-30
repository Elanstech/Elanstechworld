// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});

function initializeAll() {
    initParticles();
    initProjectsFilter();
    initProjectModal();
    initStats();
    initMobileNav();
}

// Initialize Particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
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
                    value: '#f9c200'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('nav-open');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger?.contains(e.target) && !mobileNav?.contains(e.target)) {
            hamburger?.classList.remove('active');
            mobileNav?.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });
}

// Projects Filter
function initProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            filterProjects(projects, filter);
        });
    });
}
function filterProjects(projects, filter) {
    projects.forEach(project => {
        const category = project.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
            project.style.display = 'block';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'scale(1)';
            }, 10);
        } else {
            project.style.opacity = '0';
            project.style.transform = 'scale(0.95)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// Project Modal
function initProjectModal() {
    const modal = document.querySelector('.project-modal');
    const modalContent = document.querySelector('.modal-body');
    const closeBtn = document.querySelector('.modal-close');
    const viewButtons = document.querySelectorAll('.view-project');

    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.getAttribute('data-project');
            openModal(projectId, modal, modalContent);
        });
    });

    closeBtn?.addEventListener('click', () => closeModal(modal));
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal(modal);
        }
    });
}

function openModal(projectId, modal, modalContent) {
    const projectData = getProjectData(projectId);
    if (!projectData) return;

    modalContent.innerHTML = generateModalContent(projectData);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Stats Animation
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.getAttribute('data-value'));
                animateValue(target, 0, value, 2000);
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
Createsmedia.jpeg

// Project Data
function getProjectData(projectId) {
    const projectsData = {
        ecommerce: {
            title: 'Iconic Aesthetics Website',
            description: 'Custom Website with integrated booking system and service management. Features include online appointments, service catalog, and customer reviews. Built with modern web technologies to ensure a seamless user experience.',
            images: ['iconicwebsiteimage.jpeg'],
            client: 'Iconic Aesthetics',
            duration: '2 weeks',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Square Integration', 'Responsive Design']
        },
        realestate: {
            title: 'Real Estate Website',
            description: 'Modern real estate website featuring property listings, agent profiles, and intuitive property search system. Includes advanced filtering and sorting capabilities for optimal user experience.',
            images: ['zarinaswebsite.jpeg'],
            client: 'East Coast Realty By Zarina',
            duration: '3 weeks',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Property Management System', 'IDX Integration']
        },
        accounting: {
            title: 'Tax Accounting Firm Website',
            description: 'Professional website for tax and accounting services with secure document handling and client portal integration. Features include tax resource library and secure file sharing.',
            images: ['cohenlogo.jpg'],
            client: 'Cohen Tax & Accounting',
            duration: '2 weeks',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Secure Portal Integration', 'Document Management']
        },
        createsmedia: {
            title: 'Creates Media Website',
            description: 'Modern Photo Block Website with Booking & Design Viewing System',
            images: ['Createsmedia.jpeg'],
            client: 'Creates Media',
            duration: '2 weeks',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Secure Integration', 'Document Management']
        },
        officesetup: {
            title: 'Office Infrastructure Setup',
            description: 'Complete office computer and network infrastructure implementation including security systems, data management, and backup solutions. Comprehensive setup for modern business needs.',
            images: ['zarinasoffice2.jpeg'],
            client: 'East Coast Realty By Zarina',
            duration: '1 week',
            technologies: ['Network Setup', 'Security Implementation', 'Hardware Configuration', 'Cloud Integration']
        },
        appleservice: {
            title: 'Apple Device Management',
            description: 'Enterprise-level Apple device deployment and management system for business environments. Includes MDM setup, security protocols, and automated deployment solutions.',
            images: ['Applemanagemnt.jpeg'],
            client: 'Various Enterprise Clients',
            duration: 'Ongoing',
            technologies: ['MDM Solutions', 'iOS Management', 'macOS Configuration', 'Security Protocols']
        },
        brochure: {
            title: 'Business Brochure Design',
            description: 'Professional marketing materials design including digital and print formats. Custom layouts and brand integration for maximum impact and engagement.',
            images: ['Brochure.jpeg'],
            client: 'Multiple Business Clients',
            duration: 'Ongoing',
            technologies: ['Adobe Creative Suite', 'Print Design', 'Digital Publishing', 'Brand Strategy']
        },
        businesscard: {
            title: 'Business Card Design',
            description: 'Custom business card designs reflecting brand identity and professional image. Both digital and print formats available with premium finishing options.',
            images: ['aboutsection.jpeg'],
            client: 'Various Professional Clients',
            duration: 'Various',
            technologies: ['Adobe Illustrator', 'Print Design', 'Brand Identity', 'Digital Design']
        },
        googleads: {
            title: 'Google Ads Management',
            description: 'Complete Google Ads campaign management including setup, optimization, and reporting. Focus on ROI and conversion tracking with detailed analytics.',
            images: ['googleadsimage.jpeg'],
            client: 'Various Businesses',
            duration: 'Ongoing',
            technologies: ['Google Ads', 'Analytics', 'SEO', 'Conversion Tracking', 'Campaign Optimization']
        },
        pos: {
            title: 'POS System Implementation',
            description: 'Modern retail POS system implementation with inventory management, analytics, and comprehensive reporting features. Complete solution for retail operations.',
            images: ['Pos.jpeg'],
            client: 'Retail Businesses',
            duration: 'Various',
            technologies: ['POS Software', 'Inventory Management', 'Payment Processing', 'Analytics Integration']
        }
    };

    return projectsData[projectId];
}

function generateModalContent(project) {
    return `
        <div class="modal-gallery">
            <img src="../assets/images/${project.images[0]}" alt="${project.title}" class="gallery-image">
        </div>
        <div class="modal-details">
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <div class="project-info">
                <div class="info-item">
                    <h4>Client</h4>
                    <p>${project.client}</p>
                </div>
                <div class="info-item">
                    <h4>Duration</h4>
                    <p>${project.duration}</p>
                </div>
                <div class="info-item">
                    <h4>Technologies</h4>
                    <p>${project.technologies.join(', ')}</p>
                </div>
            </div>
        </div>
    `;
}
