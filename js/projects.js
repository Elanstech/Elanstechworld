// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});

function initializeAll() {
    initParticles();
    new ProjectsFilter();
    new ProjectModal();
    initScrollAnimations();
    initStats();
    initMobileNav();
    initHeroAnimations();
}

// Hero Animations
function initHeroAnimations() {
    // Animate hero content on load
    gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    // Animate stats when they come into view
    gsap.from('.hero-stats .stat-item', {
        scrollTrigger: {
            trigger: '.hero-stats',
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Animate scroll indicator
    gsap.to('.scroll-indicator', {
        y: 20,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });

    // Glitch effect for title
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            glitchText.classList.add('active');
            setTimeout(() => {
                glitchText.classList.remove('active');
            }, 200);
        }, 3000);
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

// Stats Counter Animation
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
                const targetValue = parseInt(target.getAttribute('data-value'));
                animateValue(target, 0, targetValue, 2000);
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

// Projects Filter Class
class ProjectsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projects = document.querySelectorAll('.project-item');
        this.init();
    }

    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                this.filterProjects(filter);
            });
        });
    }

    filterProjects(filter) {
        this.projects.forEach(project => {
            const category = project.getAttribute('data-category');
            
            gsap.to(project, {
                duration: 0.3,
                opacity: 0,
                scale: 0.95,
                ease: 'power2.out',
                onComplete: () => {
                    project.style.display = 
                        filter === 'all' || category === filter ? 'block' : 'none';
                    
                    if (filter === 'all' || category === filter) {
                        gsap.to(project, {
                            duration: 0.3,
                            opacity: 1,
                            scale: 1,
                            ease: 'power2.out'
                        });
                    }
                }
            });
        });
    }
}

// Project Modal Class
class ProjectModal {
    constructor() {
        this.modal = document.querySelector('.project-modal');
        this.modalContent = document.querySelector('.modal-body');
        this.projectButtons = document.querySelectorAll('.view-project');
        this.init();
    }

    init() {
        this.projectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.getAttribute('data-project');
                this.openModal(projectId);
            });
        });

        document.querySelector('.modal-close')?.addEventListener('click', () => {
            this.closeModal();
        });

        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(projectId) {
        const projectData = this.getProjectData(projectId);
        if (!projectData) return;

        this.modalContent.innerHTML = this.generateModalContent(projectData);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        gsap.fromTo(this.modal, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.fromTo('.modal-content',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
    }

    closeModal() {
        gsap.to('.modal-content', {
            y: 50,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });

        gsap.to(this.modal, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                this.modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    getProjectData(projectId) {
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
                description: 'Modern real estate website featuring property listings, agent profiles, and intuitive property search system. Includes advanced filtering and sorting capabilities.',
                images: ['zarinaswebsite.jpeg'],
                client: 'East Coast Realty By Zarina',
                duration: '3 weeks',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Property Management System']
            },
            accounting: {
                title: 'Tax Accounting Firm Website',
                description: 'Professional website for tax and accounting services with secure document handling and client portal integration.',
                images: ['cohenlogo.jpg'],
                client: 'Cohen Tax & Accounting',
                duration: '2 weeks',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Secure Portal Integration']
            },
            officesetup: {
                title: 'Office Infrastructure Setup',
                description: 'Complete office computer and network infrastructure implementation including security systems and data management.',
                images: ['zarinasoffice2.jpeg'],
                client: 'East Coast Realty By Zarina',
                duration: '1 week',
                technologies: ['Network Setup', 'Security Implementation', 'Hardware Configuration']
            },
            appleservice: {
                title: 'Apple Device Management',
                description: 'Enterprise-level Apple device deployment and management system for business environments. Includes MDM setup and security protocols.',
                images: ['Applemanagemnt.jpeg'],
                client: 'Various Clients',
                duration: 'Ongoing',
                technologies: ['MDM Solutions', 'iOS Management', 'macOS Configuration']
            },
            brochure: {
                title: 'Business Brochure Design',
                description: 'Professional marketing materials design including digital and print formats. Custom layouts and brand integration.',
                images: ['Brochure.jpeg'],
                client: 'Various Clients',
                duration: 'Ongoing',
                technologies: ['Adobe Creative Suite', 'Print Design', 'Digital Publishing']
            },
            businesscard: {
                title: 'Business Card Design',
                description: 'Custom business card designs reflecting brand identity and professional image. Both digital and print formats available.',
                images: ['aboutsection.jpeg'],
                client: 'Multiple Clients',
                duration: 'Various',
                technologies: ['Adobe Illustrator', 'Print Design', 'Brand Identity']
            },
            googleads: {
                title: 'Google Ads Management',
                description: 'Complete Google Ads campaign management including setup, optimization, and reporting. Focus on ROI and conversion tracking.',
                images: ['googleadsimage.jpeg'],
                client: 'Various Businesses',
                duration: 'Ongoing',
                technologies: ['Google Ads', 'Analytics', 'SEO', 'Conversion Tracking']
            },
            pos: {
                title: 'POS System Implementation',
                description: 'Modern retail POS system implementation with inventory management, analytics, and comprehensive reporting features.',
                images: ['Pos.jpeg'],
                client: 'Retail Businesses',
                duration: 'Various',
                technologies: ['POS Software', 'Inventory Management', 'Payment Processing']
            }
        };

        return projectsData[projectId];
    }

    generateModalContent(project) {
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
}

// Initialize Particles
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80 },
                color: { value: '#f9c200' },
                shape: { type: 'circle' },
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
                    speed: 2
                }
            },
            interactivity: {
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    }
                }
            }
        });
    }
}

// Initialize Scroll Animations
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Animate project items
    gsap.utils.toArray('.project-item').forEach((project, index) => {
        gsap.from(project, {
            scrollTrigger: {
                trigger: project,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });

    // Animate filter bar
    gsap.from('.filter-bar', {
        scrollTrigger: {
            trigger: '.filter-bar',
            start: 'top bottom-=50'
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out'
    });

    // Animate hero elements on scroll
    gsap.to('.hero-background', {
        scrollTrigger: {
            trigger: '.projects-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: '30%',
        ease: 'none'
    });
}
