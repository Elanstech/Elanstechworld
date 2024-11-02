// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});

function initializeAll() {
    initParticles();
    new ProjectsFilter();
    new ProjectModal();
    initScrollAnimations();
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
            
            const tl = gsap.timeline();
            
            if (filter === 'all' || filter === category) {
                tl.to(project, {
                    duration: 0.5,
                    opacity: 0,
                    y: 20,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        project.style.display = 'block';
                    }
                }).to(project, {
                    duration: 0.5,
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out'
                });
            } else {
                tl.to(project, {
                    duration: 0.5,
                    opacity: 0,
                    y: 20,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        project.style.display = 'none';
                    }
                });
            }
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

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(projectId) {
        const projectData = this.getProjectData(projectId);
        this.modalContent.innerHTML = this.generateModalContent(projectData);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        gsap.from('.modal-gallery', {
            opacity: 0,
            y: 30,
            duration: 0.5,
            delay: 0.2
        });
        
        gsap.from('.modal-details', {
            opacity: 0,
            y: 30,
            duration: 0.5,
            delay: 0.4
        });
    }

    closeModal() {
        gsap.to(this.modal, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                this.modal.classList.remove('active');
                document.body.style.overflow = '';
                this.modal.style.opacity = '';
            }
        });
    }

    getProjectData(projectId) {
        const projectsData = {
            ecommerce: {
                title: 'Iconic Aesthetics Website',
                description: 'Custom Website Where Customers Can Book Appointments Directly From The Website, Explore Services, View Customer Reviews, and More. Fully responsive design with integrated Square payment system.',
                images: ['iconicwebsiteimage.jpeg', 'iconiclogo.jpeg'],
                client: 'Iconic Aesthetics',
                duration: '2 weeks',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Square Integration', 'Responsive Design']
            },
            realestate: {
                title: 'Real Estate Website',
                description: 'Modern Real Estate Website featuring property listings, agent profiles, and an intuitive property search system. Includes automated property updates and lead generation capabilities.',
                images: ['zarinaswebsite.jpeg', 'zarinasoffice2.jpeg'],
                client: 'East Coast Realty By Zarina',
                duration: '3 weeks',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Property Management System']
            },
            accounting: {
                title: 'Tax Accounting Firm Website',
                description: 'Professional website for a tax accounting firm showcasing services, team members, and client resources. Features secure document upload and client portal integration.',
                images: ['cohenlogo.jpg', 'cohenlogo.jpg'],
                client: 'Cohen Tax & Accounting',
                duration: '2 weeks',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Secure Portal Integration']
            },
            officesetup: {
                title: 'Office Infrastructure Setup',
                description: 'Complete office computer and network infrastructure implementation including security systems, data backup, and employee workstations.',
                images: ['zarinasoffice2.jpeg'],
                client: 'East Coast Realty By Zarina',
                duration: '1 week',
                technologies: ['Network Configuration', 'Security Implementation', 'Hardware Setup']
            },
            appleservice: {
                title: 'Apple Device Management',
                description: 'Enterprise-level Apple device deployment and management system for business environments. Includes MDM setup and security protocols.',
                images: ['project-apple1.jpg'],
                client: 'Various Clients',
                duration: 'Ongoing',
                technologies: ['MDM Solutions', 'iOS Management', 'macOS Configuration']
            },
            brochure: {
                title: 'Business Brochure Design',
                description: 'Professional brochure design showcasing company services, values, and brand identity. Includes print and digital versions.',
                images: ['Brochure.jpeg'],
                client: 'Multiple Clients',
                duration: 'Various',
                technologies: ['Adobe Creative Suite', 'Print Design', 'Digital Publishing']
            },
            businesscard: {
                title: 'Business Card Design',
                description: 'Custom business card designs that reflect brand identity and professional image. Includes both digital and print-ready formats.',
                images: ['aboutsection.jpeg'],
                client: 'Multiple Clients',
                duration: 'Various',
                technologies: ['Adobe Illustrator', 'Print Design', 'Brand Identity']
            },
            googleads: {
                title: 'Google Ads Management',
                description: 'Complete Google Ads campaign setup and management, including keyword research, ad creation, and performance optimization.',
                images: ['googleadsimage.jpeg'],
                client: 'Various Businesses',
                duration: 'Ongoing',
                technologies: ['Google Ads', 'Analytics', 'SEO']
            },
            pos: {
                title: 'POS System Implementation',
                description: 'Modern retail POS system implementation with inventory management, analytics, and reporting features.',
                images: ['../assets/images/Pos.jpeg'],
                client: 'Retail Businesses',
                duration: 'Various',
                technologies: ['POS Software', 'Inventory Management', 'Payment Processing']
            }
        };

        return projectsData[projectId];
    }

    generateModalContent(project) {
        if (!project) return '<div class="error">Project details not found</div>';
        
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

    gsap.utils.toArray('.project-item').forEach(project => {
        gsap.from(project, {
            scrollTrigger: {
                trigger: project,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

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
}
