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
                // Remove active class from all buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                this.filterProjects(filter);
            });
        });
    }

    filterProjects(filter) {
        this.projects.forEach(project => {
            const category = project.getAttribute('data-category');
            
            // Create GSAP timeline for smooth transitions
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
        // Setup event listeners for project buttons
        this.projectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.getAttribute('data-project');
                this.openModal(projectId);
            });
        });

        // Close modal on click outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal on close button click
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(projectId) {
        // Get project data
        const projectData = this.getProjectData(projectId);
        
        // Populate modal content
        this.modalContent.innerHTML = this.generateModalContent(projectData);
        
        // Show modal with animation
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate content
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
        // Project data object - replace with your actual project data
        const projectsData = {
            Iconic Aesthetics Website: {
                title: 'Iconic Aesthetics Website',
                description: 'Custom Website Where Customers Can Book Appotiments Directly From The Website, Explore Services, View Customer Reviews, and More',
                images: ['../assets/images/iconiclogo.jpeg', '../assets/images/iconicwebsiteimage.jpeg'],
                client: 'Iconic Aesthetics',
                duration: '2 weeks',
                technologies: ['Html', 'CSS', 'JavaScript','Square']
            },
            Real Estate: {
                title: 'Real Estate Website',
                description: 'Modern Real Estate State Website with Online Property View System',
                images: ['../assets/images/zarinaswebsite.jpeg', 'project2-detail.jpg'],
                client: 'East Coast Realty By Zarina',
                duration: '3 weeks',
                technologies: ['Html', 'CSS', 'JavaScript']
            },
            // Add more project data...
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

    // Animate project items on scroll
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
}
