/**
 * Elan's Tech World - Projects Page JavaScript
 * This script handles the dynamic functionality of the projects page
 * with data pulled directly from HTML
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
 * This function pulls data directly from the HTML structure
 */
function initProjectDetails() {
    const detailButtons = document.querySelectorAll('.project-details');
    const modal = document.querySelector('.project-modal');
    const modalBody = document.querySelector('.modal-body');
    const modalClose = document.querySelector('.modal-close');
    
    if (!modal || !modalBody) return;
    
    // Open modal with project details
    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find parent project card
            const projectCard = button.closest('.project-card');
            
            if (projectCard) {
                // Get modal data div
                const modalData = projectCard.querySelector('.project-modal-data');
                
                if (modalData) {
                    // Create a deep clone to preserve the original
                    const modalContent = modalData.cloneNode(true);
                    modalContent.removeAttribute('hidden');
                    
                    // Set modal content
                    modalBody.innerHTML = '';
                    modalBody.appendChild(modalContent);
                    
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
            }
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
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
 * Fixed to ensure proper animation of counters
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    // Start animation immediately if elements are in viewport
    stats.forEach(stat => {
        const value = parseInt(stat.getAttribute('data-value'));
        if (isElementInViewport(stat)) {
            animateCounter(stat, value);
        }
    });
    
    // Create observer for stats that aren't yet in viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.getAttribute('data-value'));
                
                // Animate counter
                animateCounter(target, value);
                
                // Unobserve after animation starts
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px'
    });
    
    // Observe all stat elements
    stats.forEach(stat => {
        // Only observe if not already in viewport
        if (!isElementInViewport(stat)) {
            observer.observe(stat);
        }
    });
    
    // Counter animation function
    function animateCounter(element, finalValue) {
        // Reset the counter to ensure it starts from 0
        element.textContent = '0';
        
        let startValue = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function updateCounter(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuad = progress => progress * (2 - progress);
            
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
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
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
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    let cardWidth = 0;
    let visibleCards = 0;
    
    // Initialize carousel
    function initCarousel() {
        // Calculate card width including gap
        const cardStyle = window.getComputedStyle(cards[0]);
        const marginRight = parseInt(cardStyle.marginRight) || 0;
        const gapSize = parseInt(window.getComputedStyle(carousel).gap) || 0;
        
        cardWidth = cards[0].offsetWidth + (marginRight || gapSize);
        visibleCards = Math.max(1, Math.floor(carousel.offsetWidth / cardWidth));
        
        // Make sure carousel is positioned properly
        carousel.style.transition = 'none';
        updateCarousel();
        
        // Generate dots
        createDots();
        
        // Restore transition
        setTimeout(() => {
            carousel.style.transition = 'transform 0.5s ease';
        }, 50);
    }
    
    // Create navigation dots
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        const dotsCount = Math.ceil(cards.length / visibleCards);
        
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            
            if (i === Math.floor(currentIndex / visibleCards)) {
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
            prevBtn.setAttribute('aria-disabled', currentIndex === 0);
        }
        
        if (nextBtn) {
            const isLast = currentIndex >= cards.length - visibleCards;
            nextBtn.disabled = isLast;
            nextBtn.setAttribute('aria-disabled', isLast);
        }
    }
    
    // Add event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - visibleCards);
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(cards.length - visibleCards, currentIndex + visibleCards);
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
            projectCards[i].style.opacity = '0';
            projectCards[i].style.transform = 'translateY(20px)';
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
 * Function to easily add a new project to the page
 * @param {Object} projectData - Project data object
 */
function addNewProject(projectData) {
    const template = document.getElementById('project-template');
    if (!template) return;
    
    // Clone template
    const newProject = template.content.cloneNode(true);
    const projectCard = newProject.querySelector('.project-card');
    
    // Set project data
    projectCard.dataset.category = projectData.categories.join(' ');
    projectCard.dataset.projectId = projectData.id;
    
    // Set image
    const img = newProject.querySelector('.project-image img');
    img.src = projectData.image;
    img.alt = projectData.title;
    
    // Set tags
    const tagContainer = newProject.querySelector('.project-tags');
    projectData.tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagContainer.appendChild(span);
    });
    
    // Set content
    newProject.querySelector('.project-title').textContent = projectData.title;
    newProject.querySelector('.project-description').textContent = projectData.description;
    
    // Set features
    const featuresContainer = newProject.querySelector('.project-features');
    projectData.features.forEach(feature => {
        const span = document.createElement('span');
        span.innerHTML = `<i class="fas fa-check-circle"></i> ${feature}`;
        featuresContainer.appendChild(span);
    });
    
    // Set links
    newProject.querySelector('.project-visit').href = projectData.websiteUrl;
    
    // Set modal data
    const modalData = newProject.querySelector('.project-modal-data');
    modalData.innerHTML = `
        <h2>${projectData.title}</h2>
        <p class="modal-subtitle">${projectData.subtitle}</p>
        <div class="modal-gallery">
            ${projectData.galleryImages.map(img => `<img src="${img.src}" alt="${img.alt}">`).join('')}
        </div>
        <div class="modal-description">
            ${projectData.fullDescription}
            
            <h3>Project Details</h3>
            <ul>
                ${projectData.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
            
            <h3>Technologies Used</h3>
            <div class="tech-tags">
                ${projectData.technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
            
            <h3>Results</h3>
            <p>${projectData.results}</p>
        </div>
        <div class="modal-footer">
            <a href="${projectData.websiteUrl}" target="_blank" class="modal-link">Visit Website <i class="fas fa-external-link-alt"></i></a>
        </div>
    `;
    
    // Add to grid
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.appendChild(newProject);
    
    // Reinitialize details
    initProjectDetails();
    
    // Update load more button
    initLoadMore();
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
