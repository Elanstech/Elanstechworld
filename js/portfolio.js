/**
 * Portfolio Page JavaScript - Updated
 * Service-based sections with coming soon handling
 */

// ==========================================
// PARTICLES ANIMATION
// ==========================================
class ParticlesAnimation {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.particles = [];
    this.particleCount = 80;
    this.mouse = { x: null, y: null, radius: 150 };
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    
    this.resizeCanvas();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: Math.random() > 0.5 ? 'rgba(0, 122, 255, 0.5)' : 'rgba(255, 140, 66, 0.5)'
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
      
      // Mouse interaction
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.x -= dx * force * 0.02;
          particle.y -= dy * force * 0.02;
        }
      }
      
      // Draw particle
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Connect nearby particles
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.strokeStyle = `rgba(255, 140, 66, ${0.2 - distance / 500})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================
// PORTFOLIO PAGE CLASS
// ==========================================
class PortfolioPage {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.currentLightboxIndex = 0;
    this.lightboxImages = [];
    
    // DOM Elements
    this.websitesGrid = document.getElementById('websites-grid');
    this.logosGrid = document.getElementById('logos-grid');
    this.materialsGrid = document.getElementById('materials-grid');
    this.signsGrid = document.getElementById('signs-grid');
    
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
    this.renderProjectsByService();
    this.setupEventListeners();
    this.checkUrlHash();
  }

  async loadProjects() {
    try {
      const response = await fetch('../projects.json');
      const data = await response.json();
      this.projects = data.projects;
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = [];
    }
  }

  renderProjectsByService() {
    // Group projects by category
    const websiteProjects = this.projects.filter(p => p.category === 'websites');
    const logoProjects = this.projects.filter(p => p.category === 'logos');
    const materialProjects = this.projects.filter(p => p.category === 'materials');
    const signProjects = this.projects.filter(p => p.category === 'signs');
    
    // Render each section
    this.renderSection(this.websitesGrid, websiteProjects);
    this.renderSection(this.logosGrid, logoProjects);
    this.renderSection(this.materialsGrid, materialProjects);
    this.renderSection(this.signsGrid, signProjects);
  }

  renderSection(gridElement, projects) {
    if (!gridElement) return;
    
    // Skip if already has coming soon message
    if (gridElement.querySelector('.coming-soon-message')) return;
    
    if (projects.length === 0) return;
    
    const html = projects.map(project => `
      <div class="portfolio-full-card ${project.comingSoon ? 'coming-soon' : ''}" 
           data-project-id="${project.id}"
           data-coming-soon="${project.comingSoon}">
        ${project.featured ? '<div class="portfolio-featured-badge">Featured</div>' : ''}
        
        <div class="portfolio-full-image">
          <img src="${project.coverImage}" alt="${project.title}" 
               onerror="this.src='https://via.placeholder.com/800x600/0A0A0A/FF8C42?text=${encodeURIComponent(project.title)}'">
          <div class="portfolio-full-overlay"></div>
          <div class="portfolio-full-category">${project.serviceType || project.category}</div>
        </div>
        
        <div class="portfolio-full-content">
          <h3 class="portfolio-full-title">${project.title}</h3>
          <p class="portfolio-full-description">${project.shortDescription}</p>
          
          <div class="portfolio-full-footer">
            <span class="portfolio-full-client">${project.client}</span>
            <span class="portfolio-full-link">
              <span>${project.comingSoon ? 'Coming Soon' : 'View Details'}</span>
              <i class="fas fa-arrow-right"></i>
            </span>
          </div>
        </div>
      </div>
    `).join('');
    
    gridElement.innerHTML = html;
    
    // Add click listeners
    const cards = gridElement.querySelectorAll('.portfolio-full-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.dataset.projectId;
        const isComingSoon = card.dataset.comingSoon === 'true';
        
        if (isComingSoon) {
          this.showComingSoonMessage(projectId);
          return;
        }
        
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
          this.openModal(project);
        }
      });
    });
    
    // Animate cards in
    this.animateCardsIn(cards);
  }

  animateCardsIn(cards) {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  showComingSoonMessage(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    
    // Create temporary message
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #007aff, #FF8C42);
      padding: 2rem 3rem;
      border-radius: 20px;
      color: white;
      text-align: center;
      z-index: 10000;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: fadeIn 0.3s ease;
    `;
    
    message.innerHTML = `
      <i class="fas fa-clock" style="font-size: 3rem; margin-bottom: 1rem;"></i>
      <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Coming Soon</h3>
      <p style="margin: 0; opacity: 0.9;">This project showcase is under construction</p>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => message.remove(), 300);
    }, 2000);
  }

  setupEventListeners() {
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

  openModal(project) {
    if (!this.modal || !this.modalContent || project.comingSoon) return;

    this.currentProject = project;
    document.body.style.overflow = 'hidden';

    // Update URL hash
    window.location.hash = project.slug;

    // Render modal content
    this.modalContent.innerHTML = `
      <div class="project-detail-header">
        <span class="project-detail-category">${project.serviceType || project.category}</span>
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
        <a href="../index.html#contact" class="btn-secondary">
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
    if (project && !project.comingSoon) {
      this.openModal(project);
    }
  }
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particles
  const particles = new ParticlesAnimation();
  particles.init();
  
  // Initialize portfolio
  const portfolioPage = new PortfolioPage();
  portfolioPage.init();

  // Scroll to top on page load
  window.scrollTo(0, 0);

  console.log('✅ Portfolio Page - Initialized');
});
