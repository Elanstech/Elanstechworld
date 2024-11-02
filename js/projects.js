// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});

function initializeAll() {
    // Initialize components
    new ProjectsFilter();
    new ProjectModal();
    new LoadMoreProjects();
    initParticles();
    initScrollAnimations();
}

// Projects Filter Class
class ProjectsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.searchInput = document.getElementById('project-search');
        this.projects = document.querySelectorAll('.project-card');
        this.activeFilter = 'all';
        this.searchQuery = '';
        
        this.init();
    }

    init() {
        // Set up filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeFilter = btn.dataset.filter;
                this.updateActiveButton(btn);
                this.filterProjects();
            });
        });

        // Set up search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterProjects();
        });

        // Initial filtering
        this.filterProjects();
    }

    updateActiveButton(clickedBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
    }

    filterProjects() {
        this.projects.forEach(project => {
            const category = project.dataset.category;
            const projectTitle = project.querySelector('h3').textContent.toLowerCase();
            const matchesFilter = this.activeFilter === 'all' || category === this.activeFilter;
            const matchesSearch = projectTitle.includes(this.searchQuery);

            if (matchesFilter && matchesSearch) {
                gsap.to(project, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    onStart: () => project.style.display = 'block'
                });
            } else {
                gsap.to(project, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => project.style.display = 'none'
                });
            }
        });
    }
}

// Project Modal Class
class ProjectModal {
    constructor() {
        this.modals = document.querySelectorAll('.project-modal');
        this.previewButtons = document.querySelectorAll('.project-preview');
        
        this.init();
    }

    init() {
        // Set up modal triggers
        this.previewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                this.openModal(modalId);
            });
        });

        // Set up close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal(btn.closest('.project-modal'));
            });
        });

        // Close on outside click
        this.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.project-modal.active');
                if (activeModal) {
                    this.closeModal(activeModal);
                }
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        document.body.style.overflow = 'hidden';
        modal.classList.add('active');

        // Animate modal content
        const content = modal.querySelector('.modal-content');
        gsap.fromTo(content,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
    }

    closeModal(modal) {
        const content = modal.querySelector('.modal-content');
        
        gsap.to(content, {
            y: -50,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Load More Projects Class
class LoadMoreProjects {
    constructor() {
        this.button = document.getElementById('load-more');
        this.projectsContainer = document.querySelector('.projects-wrapper');
        this.page = 1;
        this.loading = false;
        
        this.init();
    }

    init() {
        if (this.button) {
            this.button.addEventListener('click', () => this.loadMore());
        }
    }

    async loadMore() {
        if (this.loading) return;
        
        this.loading = true;
        this.button.textContent = 'Loading...';

        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Add new projects (replace with actual API call)
            const newProjects = this.getMoreProjects();
            if (newProjects.length === 0) {
                this.button.textContent = 'No More Projects';
                this.button.disabled = true;
                return;
            }

            this.appendProjects(newProjects);
            this.page++;
            
        } catch (error) {
            console.error('Error loading more projects:', error);
            this.button.textContent = 'Error Loading Projects';
        } finally {
            this.loading = false;
            if (!this.button.disabled) {
                this.button.textContent = 'Load More Projects';
            }
        }
    }

    appendProjects(projects) {
        projects.forEach(project => {
            const element = this.createProjectElement(project);
            this.projectsContainer.appendChild(element);
            
            // Animate new project
            gsap.from(element, {
                opacity: 0,
                y: 50,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    createProjectElement(project) {
        // Create project card element (implement based on your HTML structure)
        const element = document.createElement('article');
        element.className = 'project-card';
        element.dataset.category = project.category;
        // Add project content...
        return element;
    }

    getMoreProjects() {
        // Replace with actual API call
        return [];
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

    // Animate project cards on scroll
    gsap.utils.toArray('.project-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Animate filter container
    gsap.from('.filter-container', {
        scrollTrigger: {
            trigger: '.filter-container',
            start: 'top bottom-=50'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });
}
