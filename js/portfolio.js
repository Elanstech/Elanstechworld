/**
 * Portfolio Page JavaScript
 * Handles filtering, sorting, modals, and lightbox
 */

// ==========================================
// PORTFOLIO PAGE CLASS
// ==========================================
class PortfolioPage {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.currentSort = 'featured';
    this.currentProject = null;
    this.currentLightboxIndex = 0;
    this.lightboxImages = [];
    
    // DOM Elements
    this.grid = document.getElementById('portfolio-full-grid');
    this.filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    this.sortSelect = document.getElementById('portfolio-sort-select');
    this.noResults = document.getElementById('portfolio-no-results');
    this.modal = document.getElementById('project-modal');
    this.modalContent = this.modal?.querySelector('.project-modal-content');
    this.modalClose = this.modal?.querySelector('.project-modal-close');
    this.modalOverlay = this.modal?.querySelector('.project-modal-overlay');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = this.lightbox?.querySelector('.lightbox-content img');
    this.lightboxCaption = this.lightbox?.querySelector('.lightbox-caption');
    this.lightboxCounter = this.lightbox?.querySelector('.lightbox-counter');
    this.lightboxClose = this.lightbox?.querySelector('.lightbox-close');
    this.lightboxPrev = this.lightbox?.querySelector('.lightbox-prev');
    this.lightboxNext = this.lightbox?.querySelector('.lightbox-next');
    this.lightboxOverlay = this.lightbox?.querySelector('.lightbox-overlay');
  }

  async init() {
    await this.loadProjects();
    this.setupEventListeners();
    this.updateFilterCounts();
    this.filterProjects(this.currentFilter);
    this.checkUrlHash();
  }

  async loadProjects() {
    try {
      const response = await fetch('./data/projects.json');
      const data = await response.json();
      this.projects = data.projects;
      this.filteredProjects = [...this.projects];
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = [];
      this.filteredProjects = [];
    }
  }

  setupEventListeners() {
    // Filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.setActiveFilter(button);
        this.filterProjects(filter);
      });
    });

    // Sort select
    this.sortSelect?.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.sortProjects();
      this.renderProjects();
    });

    // Modal close
    this.modalClose?.addEventListener('click', () => this.closeModal());
    this.modalOverlay?.addEventListener('click', () => this.closeModal());

    // Lightbox controls
    this.lightboxClose?.addEventListener('click', () => this.closeLightbox());
    this.lightboxOverlay?.addEventListener('click', () => this.closeLightbox());
    this.lightboxPrev?.addEventListener('click', () => this.navigateLightbox(-1));
    this.lightboxNext?.addEventListener('click', () => this.navigateLightbox(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.modal?.classList.contains('active')) {
        if (e.key === 'Escape') this.closeModal();
      }
      if (this.lightbox?.classList.contains('active')) {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
        if (e.key === 'ArrowRight') this.navigateLightbox(1);
      }
    });

    // Hash change for deep linking
    window.addEventListener('hashchange', () => this.checkUrlHash());
  }

  setActiveFilter(activeButton) {
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  updateFilterCounts() {
    this.filterButtons.forEach(button => {
      const filter = button.dataset.filter;
      const count = filter === 'all' 
        ? this.projects.length 
        : this.projects.filter(p => p.category === filter).length;
      
      const countSpan = button.querySelector('.filter-count');
      if (countSpan) {
        countSpan.textContent = count;
      }
    });
  }

  filterProjects(category) {
    this.currentFilter = category;
    
    if (category === 'all') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(p => p.category === category);
    }

    this.sortProjects();
    this.renderProjects();
  }

  sortProjects() {
    switch (this.currentSort) {
      case 'featured':
        this.filteredProjects.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
      
      case 'newest':
        this.filteredProjects.sort((a, b) => 
          parseInt(b.year) - parseInt(a.year)
        );
        break;
      
      case 'oldest':
        this.filteredProjects.sort((a, b) => 
          parseInt(a.year) - parseInt(b.year)
        );
        break;
      
      case 'alphabetical':
        this.filteredProjects.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
        break;
    }
  }

  renderProjects() {
    if (!this.grid) return;

    // Hide existing cards with animation
    const existingCards = this.grid.querySelectorAll('.portfolio-full-card');
    existingCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('hide');
      }, index * 30);
    });

    // Wait for hide animation, then render new cards
    setTimeout(() => {
      if (this.filteredProjects.length === 0) {
        this.grid.innerHTML = '';
        this.noResults.style.display = 'block';
        return;
      }

      this.noResults.style.display = 'none';

      const html = this.filteredProjects.map(project => `
        <div class="portfolio-full-card" data-project-id="${project.id}">
          ${project.featured ? '<div class="portfolio-featured-badge">Featured</div>' : ''}
          
          <div class="portfolio-full-image">
            <img src="${project.coverImage}" alt="${project.title}" 
                 onerror="this.src='https://via.placeholder.com/800x600/0A0A0A/FF8C42?text=${encodeURIComponent(project.title)}'">
            <div class="portfolio-full-overlay"></div>
            <div class="portfolio-full-category">${project.category}</div>
          </div>
          
          <div class="portfolio-full-content">
            <h3 class="portfolio-full-title">${project.title}</h3>
            <p class="portfolio-full-description">${project.shortDescription}</p>
            
            <div class="portfolio-full-tags">
              ${project.tags.slice(0, 3).map(tag => `<span class="portfolio-full-tag">${tag}</span>`).join('')}
            </div>
            
            <div class="portfolio-full-footer">
              <span class="portfolio-full-client">${project.client}</span>
              <span class="portfolio-full-link">
                <span>View Details</span>
                <i class="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      `).join('');

      this.grid.innerHTML = html;

      // Animate in new cards
      const newCards = this.grid.querySelectorAll('.portfolio-full-card');
      newCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('show');
        }, index * 50);

        // Add click listener
        card.addEventListener('click', () => {
          const projectId = card.dataset.projectId;
          const project = this.projects.find(p => p.id === projectId);
          if (project) {
            this.openModal(project);
          }
        });
      });
    }, existingCards.length * 30 + 200);
  }

  openModal(project) {
    if (!this.modal || !this.modalContent) return;

    this.currentProject = project;
    document.body.style.overflow = 'hidden';

    // Update URL hash
    window.location.hash = project.slug;

    // Render modal content
    this.modalContent.innerHTML = `
      <div class="project-detail-header">
        <span class="project-detail-category">${project.category}</span>
        <h1 class="project-detail-title">${project.title}</h1>
        
        <div class="project-detail-meta">
          <div class="project-detail-meta-item">
            <i class="fas fa-user"></i>
            <span>${project.client}</span>
          </div>
          <div class="project-detail-meta-item">
            <i class="fas fa-calendar"></i>
            <span>${project.year}</span>
          </div>
          ${project.duration ? `
            <div class="project-detail-meta-item">
              <i class="fas fa-clock"></i>
              <span>${project.duration}</span>
            </div>
          ` : ''}
          ${project.livePreview ? `
            <div class="project-detail-meta-item">
              <i class="fas fa-globe"></i>
              <a href="${project.website}" target="_blank" style="color: var(--hermes-orange);">View Live Site</a>
            </div>
          ` : ''}
        </div>
      </div>

      ${project.gallery && project.gallery.length > 0 ? `
        <div class="project-detail-gallery">
          <div class="project-gallery-main" data-image-index="0">
            <img src="${project.gallery[0]}" alt="${project.title}">
          </div>
          ${project.gallery.length > 1 ? `
            <div class="project-gallery-thumbnails">
              ${project.gallery.map((img, index) => `
                <div class="project-gallery-thumb ${index === 0 ? 'active' : ''}" data-image-index="${index}">
                  <img src="${img}" alt="${project.title} ${index + 1}">
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      ` : ''}

      <div class="project-detail-tags">
        ${project.tags.map(tag => `<span class="project-detail-tag">${tag}</span>`).join('')}
      </div>

      <div class="project-detail-section">
        <h3>Project Overview</h3>
        <p>${project.longDescription}</p>
      </div>

      ${project.challenge ? `
        <div class="project-detail-section">
          <h3>The Challenge</h3>
          <p>${project.challenge}</p>
        </div>
      ` : ''}

      ${project.solution ? `
        <div class="project-detail-section">
          <h3>Our Solution</h3>
          <p>${project.solution}</p>
        </div>
      ` : ''}

      ${project.services && project.services.length > 0 ? `
        <div class="project-detail-section">
          <h3>Services Provided</h3>
          <div class="project-services-list">
            ${project.services.map(service => `
              <div class="project-service-item">
                <i class="fas fa-check-circle"></i>
                <span>${service}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${project.technologies && project.technologies.length > 0 ? `
        <div class="project-detail-section">
          <h3>Technologies Used</h3>
          <div class="project-technologies">
            ${project.technologies.map(tech => `
              <span class="project-tech-item">${tech}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${project.results ? `
        <div class="project-detail-section">
          <h3>Results & Impact</h3>
          ${project.impact ? `<p>${project.impact}</p>` : ''}
          <div class="project-results-grid">
            ${Object.values(project.results).map(result => `
              <div class="project-result-card">
                <div class="project-result-icon">
                  <i class="fas ${result.icon}"></i>
                </div>
                <div class="project-result-value">${result.value}</div>
                <div class="project-result-label">${result.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${project.testimonial ? `
        <div class="project-testimonial">
          <div class="project-testimonial-rating">
            ${Array(project.testimonial.rating || 5).fill('<i class="fas fa-star"></i>').join('')}
          </div>
          <p class="project-testimonial-text">"${project.testimonial.text}"</p>
          <div class="project-testimonial-author">
            ${project.testimonial.image ? `
              <div class="project-testimonial-avatar">
                <img src="${project.testimonial.image}" alt="${project.testimonial.author}"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(project.testimonial.author)}&background=FF8C42&color=fff&size=128'">
              </div>
            ` : ''}
            <div class="project-testimonial-info">
              <h4>${project.testimonial.author}</h4>
              <span>${project.testimonial.role}</span>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="project-detail-actions">
        ${project.livePreview ? `
          <a href="${project.website}" target="_blank" class="btn-primary">
            <span>View Live Website</span>
            <i class="fas fa-external-link-alt"></i>
          </a>
        ` : ''}
        <a href="index.html#contact" class="btn-secondary">
          <span>Start Your Project</span>
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `;

    // Setup gallery functionality
    this.setupGalleryListeners();

    // Show modal with animation
    setTimeout(() => {
      this.modal.classList.add('active');
    }, 10);
  }

  setupGalleryListeners() {
    if (!this.currentProject || !this.currentProject.gallery) return;

    const mainImage = this.modalContent.querySelector('.project-gallery-main');
    const thumbnails = this.modalContent.querySelectorAll('.project-gallery-thumb');

    // Main image click - open lightbox
    mainImage?.addEventListener('click', () => {
      const imageIndex = parseInt(mainImage.dataset.imageIndex);
      this.openLightbox(this.currentProject.gallery, imageIndex);
    });

    // Thumbnail clicks
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const imageIndex = parseInt(thumb.dataset.imageIndex);
        
        // Update active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        
        // Update main image
        const mainImg = mainImage.querySelector('img');
        mainImg.src = this.currentProject.gallery[imageIndex];
        mainImage.dataset.imageIndex = imageIndex;
      });
    });
  }

  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear URL hash
    history.pushState('', document.title, window.location.pathname + window.location.search);
    
    this.currentProject = null;
  }

  openLightbox(images, startIndex = 0) {
    if (!this.lightbox) return;

    this.lightboxImages = images;
    this.currentLightboxIndex = startIndex;
    
    this.updateLightboxImage();
    
    document.body.style.overflow = 'hidden';
    this.lightbox.classList.add('active');
  }

  updateLightboxImage() {
    if (!this.lightboxImg || !this.lightboxImages.length) return;

    const currentImage = this.lightboxImages[this.currentLightboxIndex];
    this.lightboxImg.src = currentImage;
    
    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = this.currentProject 
        ? `${this.currentProject.title} - Image ${this.currentLightboxIndex + 1}`
        : `Image ${this.currentLightboxIndex + 1}`;
    }
    
    if (this.lightboxCounter) {
      this.lightboxCounter.textContent = `${this.currentLightboxIndex + 1} / ${this.lightboxImages.length}`;
    }

    // Show/hide navigation arrows
    if (this.lightboxPrev && this.lightboxNext) {
      this.lightboxPrev.style.display = this.lightboxImages.length > 1 ? 'flex' : 'none';
      this.lightboxNext.style.display = this.lightboxImages.length > 1 ? 'flex' : 'none';
    }
  }

  navigateLightbox(direction) {
    if (!this.lightboxImages.length) return;

    this.currentLightboxIndex += direction;

    // Loop around
    if (this.currentLightboxIndex < 0) {
      this.currentLightboxIndex = this.lightboxImages.length - 1;
    } else if (this.currentLightboxIndex >= this.lightboxImages.length) {
      this.currentLightboxIndex = 0;
    }

    this.updateLightboxImage();
  }

  closeLightbox() {
    if (!this.lightbox) return;

    this.lightbox.classList.remove('active');
    document.body.style.overflow = this.modal?.classList.contains('active') ? 'hidden' : '';
    
    this.lightboxImages = [];
    this.currentLightboxIndex = 0;
  }

  checkUrlHash() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const project = this.projects.find(p => p.slug === hash);
    if (project) {
      this.openModal(project);
    }
  }
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const portfolioPage = new PortfolioPage();
  portfolioPage.init();

  // Scroll to top on page load
  window.scrollTo(0, 0);

  console.log('✅ Portfolio Page - Initialized');
});
