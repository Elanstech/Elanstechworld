/**
 * Portfolio Page — Premium Editorial JavaScript
 * ES6 Class Architecture
 * Handles: reveal animations, project loading, card rendering,
 *          modal panel, lightbox, category navigation
 */

// ==========================================
// REVEAL OBSERVER
// ==========================================
class RevealObserver {
  constructor() {
    this.observer = null;
  }

  init() {
    const els = document.querySelectorAll('[data-pf-reveal]');
    if (!els.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => this.observer.observe(el));
  }
}

// ==========================================
// CATEGORY NAVIGATION
// ==========================================
class CategoryNav {
  constructor() {
    this.pills = document.querySelectorAll('.pf-cat-pill');
    this.sections = document.querySelectorAll('.pf-section');
  }

  init() {
    if (!this.pills.length) return;

    // Smooth scroll on click
    this.pills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(pill.getAttribute('href'));
        if (target) {
          const offset = 100;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }

        // Update active state
        this.pills.forEach((p) => p.classList.remove('pf-cat-pill--active'));
        pill.classList.add('pf-cat-pill--active');
      });
    });

    // Update active pill on scroll
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  }

  onScroll() {
    const scrollY = window.scrollY + 200;

    this.sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.id;

      if (scrollY >= top && scrollY < bottom) {
        this.pills.forEach((p) => {
          p.classList.toggle(
            'pf-cat-pill--active',
            p.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }
}

// ==========================================
// PORTFOLIO PAGE — MAIN CLASS
// ==========================================
class PortfolioPage {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.currentLightboxIndex = 0;
    this.lightboxImages = [];

    // Grids
    this.websitesGrid = document.getElementById('websites-grid');
    this.logosGrid = document.getElementById('logos-grid');
    this.materialsGrid = document.getElementById('materials-grid');
    this.signsGrid = document.getElementById('signs-grid');

    // Modal
    this.modal = document.getElementById('project-modal');
    this.modalBody = this.modal?.querySelector('.pf-modal-body');
    this.modalClose = this.modal?.querySelector('.pf-modal-close');
    this.modalOverlay = this.modal?.querySelector('.pf-modal-overlay');

    // Lightbox
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = this.lightbox?.querySelector('.pf-lightbox-stage img');
    this.lightboxCaption = this.lightbox?.querySelector('.pf-lightbox-caption');
    this.lightboxCounter = this.lightbox?.querySelector('.pf-lightbox-counter');
    this.lightboxClose = this.lightbox?.querySelector('.pf-lightbox-close');
    this.lightboxPrev = this.lightbox?.querySelector('.pf-lightbox-prev');
    this.lightboxNext = this.lightbox?.querySelector('.pf-lightbox-next');
    this.lightboxOverlay = this.lightbox?.querySelector('.pf-lightbox-overlay');
  }

  async init() {
    await this.loadProjects();
    this.renderAll();
    this.setupEvents();
    this.checkUrlHash();
  }

  // ————— Data Loading —————
  async loadProjects() {
    try {
      const [websites, logos, materials, signs] = await Promise.all([
        fetch('../projects.json').then((r) => r.json()),
        fetch('../logos.json').then((r) => r.json()),
        fetch('../materials.json').then((r) => r.json()),
        fetch('../signs.json').then((r) => r.json()),
      ]);

      this.projects = [
        ...websites.projects,
        ...logos.projects,
        ...materials.projects,
        ...signs.projects,
      ];

      console.log(`✅ Loaded ${this.projects.length} projects`);
    } catch (err) {
      console.error('Error loading projects:', err);
      this.projects = [];
    }
  }

  // ————— Rendering —————
  renderAll() {
    const byCategory = (cat) => this.projects.filter((p) => p.category === cat);

    this.renderSection(this.websitesGrid, byCategory('websites'), 'websites');
    this.renderSection(this.logosGrid, byCategory('logos'), 'logos');
    this.renderSection(this.materialsGrid, byCategory('materials'), 'materials');
    this.renderSection(this.signsGrid, byCategory('signs'), 'signs');
  }

  renderSection(grid, projects, categoryName) {
    if (!grid) return;

    if (!projects.length) {
      const icons = { websites: 'fa-laptop-code', logos: 'fa-paint-brush', materials: 'fa-file-invoice', signs: 'fa-sign' };
      const titles = { websites: 'Website Portfolio', logos: 'Logo Portfolio', materials: 'Business Materials', signs: 'Signage Portfolio' };
      grid.innerHTML = `
        <div class="pf-coming-soon">
          <i class="fas ${icons[categoryName]}"></i>
          <h3>${titles[categoryName]} Coming Soon</h3>
          <p>We're curating our best ${categoryName} work for you.</p>
        </div>`;
      return;
    }

    grid.innerHTML = projects
      .map(
        (p) => `
      <div class="pf-card ${p.comingSoon ? 'pf-card--soon' : ''}"
           data-project-id="${p.id}" data-coming-soon="${!!p.comingSoon}"
           style="opacity:0;transform:translateY(30px)">
        ${p.featured ? '<div class="pf-card-featured">Featured</div>' : ''}
        <div class="pf-card-img">
          <img src="${p.coverImage}" alt="${p.title}"
               loading="lazy"
               onerror="this.src='https://via.placeholder.com/800x600/FAF6F1/E8621A?text=${encodeURIComponent(p.title)}'">
          <div class="pf-card-badge">${p.serviceType || p.category}</div>
        </div>
        <div class="pf-card-body">
          <h3 class="pf-card-title">${p.title}</h3>
          <p class="pf-card-desc">${p.shortDescription}</p>
          <div class="pf-card-foot">
            <span class="pf-card-client">${p.client}</span>
            <span class="pf-card-link">
              <span>${p.comingSoon ? 'Coming Soon' : 'View Details'}</span>
              <i class="fas fa-arrow-right"></i>
            </span>
          </div>
        </div>
      </div>`
      )
      .join('');

    // Click listeners
    grid.querySelectorAll('.pf-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset.projectId;
        const soon = card.dataset.comingSoon === 'true';
        if (soon) return this.showComingSoon(id);
        const project = this.projects.find((p) => p.id === id);
        if (project) this.openModal(project);
      });
    });

    // Stagger entrance
    this.animateCards(grid.querySelectorAll('.pf-card'));
  }

  animateCards(cards) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(cards).indexOf(entry.target);
            setTimeout(() => {
              entry.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, idx * 120);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((c) => observer.observe(c));
  }

  showComingSoon(id) {
    const project = this.projects.find((p) => p.id === id);
    if (!project) return;

    const toast = document.createElement('div');
    Object.assign(toast.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(0.9)',
      background: 'linear-gradient(135deg, #1B2A4A, #2C3E6B)',
      padding: '2.5rem 3.5rem',
      borderRadius: '20px',
      color: '#fff',
      textAlign: 'center',
      zIndex: '10001',
      boxShadow: '0 24px 64px rgba(27,42,74,0.4)',
      opacity: '0',
      transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      fontFamily: "'Outfit', sans-serif",
    });
    toast.innerHTML = `
      <i class="fas fa-clock" style="font-size:2.5rem;margin-bottom:1rem;color:#C5A467;display:block"></i>
      <h3 style="font-size:1.5rem;margin-bottom:0.5rem;font-family:'DM Serif Display',serif">Coming Soon</h3>
      <p style="margin:0;opacity:0.8;font-weight:300">This project showcase is under construction.</p>`;

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => toast.remove(), 400);
    }, 2200);
  }

  // ————— Events —————
  setupEvents() {
    this.modalClose?.addEventListener('click', () => this.closeModal());
    this.modalOverlay?.addEventListener('click', () => this.closeModal());
    this.lightboxClose?.addEventListener('click', () => this.closeLightbox());
    this.lightboxOverlay?.addEventListener('click', () => this.closeLightbox());
    this.lightboxPrev?.addEventListener('click', () => this.navLightbox(-1));
    this.lightboxNext?.addEventListener('click', () => this.navLightbox(1));

    document.addEventListener('keydown', (e) => {
      if (this.modal?.classList.contains('active') && e.key === 'Escape') this.closeModal();
      if (this.lightbox?.classList.contains('active')) {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.navLightbox(-1);
        if (e.key === 'ArrowRight') this.navLightbox(1);
      }
    });

    window.addEventListener('hashchange', () => this.checkUrlHash());
  }

  // ————— Modal —————
  openModal(project) {
    if (!this.modal || !this.modalBody || project.comingSoon) return;
    this.currentProject = project;
    document.body.style.overflow = 'hidden';
    window.location.hash = project.slug;

    this.modalBody.innerHTML = `
      <div class="pf-detail-header">
        <span class="pf-detail-cat">${project.serviceType || project.category}</span>
        <h1 class="pf-detail-title">${project.title}</h1>
        <div class="pf-detail-meta">
          <div class="pf-detail-meta-item"><i class="fas fa-user"></i><span>${project.client}</span></div>
          <div class="pf-detail-meta-item"><i class="fas fa-calendar"></i><span>${project.year}</span></div>
          ${project.duration ? `<div class="pf-detail-meta-item"><i class="fas fa-clock"></i><span>${project.duration}</span></div>` : ''}
          ${project.livePreview ? `<div class="pf-detail-meta-item"><i class="fas fa-globe"></i><a href="${project.website}" target="_blank">View Live Site</a></div>` : ''}
        </div>
      </div>

      ${project.gallery?.length ? `
        <div class="pf-detail-gallery">
          <div class="pf-gallery-main" data-image-index="0">
            <img src="${project.gallery[0]}" alt="${project.title}">
          </div>
          ${project.gallery.length > 1 ? `
            <div class="pf-gallery-thumbs">
              ${project.gallery.map((img, i) => `
                <div class="pf-gallery-thumb ${i === 0 ? 'active' : ''}" data-image-index="${i}">
                  <img src="${img}" alt="${project.title} ${i + 1}">
                </div>`).join('')}
            </div>` : ''}
        </div>` : ''}

      <div class="pf-detail-section">
        <h3>Project Overview</h3>
        <p>${project.longDescription}</p>
      </div>

      ${project.challenge ? `<div class="pf-detail-section"><h3>The Challenge</h3><p>${project.challenge}</p></div>` : ''}
      ${project.solution ? `<div class="pf-detail-section"><h3>Our Solution</h3><p>${project.solution}</p></div>` : ''}

      ${project.services?.length ? `
        <div class="pf-detail-section">
          <h3>Services Provided</h3>
          <div class="pf-services-list">
            ${project.services.map((s) => `<div class="pf-service-item"><i class="fas fa-check-circle"></i><span>${s}</span></div>`).join('')}
          </div>
        </div>` : ''}

      ${project.technologies?.length ? `
        <div class="pf-detail-section">
          <h3>Technologies Used</h3>
          <div class="pf-techs">
            ${project.technologies.map((t) => `<span class="pf-tech-tag">${t}</span>`).join('')}
          </div>
        </div>` : ''}

      ${project.results ? `
        <div class="pf-detail-section">
          <h3>Results &amp; Impact</h3>
          ${project.impact ? `<p>${project.impact}</p>` : ''}
          <div class="pf-results-grid">
            ${Object.values(project.results).map((r) => `
              <div class="pf-result-card">
                <div class="pf-result-icon"><i class="fas ${r.icon}"></i></div>
                <div class="pf-result-value">${r.value}</div>
                <div class="pf-result-label">${r.label}</div>
              </div>`).join('')}
          </div>
        </div>` : ''}

      ${project.testimonial ? `
        <div class="pf-testimonial">
          <div class="pf-testimonial-stars">
            ${Array(project.testimonial.rating || 5).fill('<i class="fas fa-star"></i>').join('')}
          </div>
          <p class="pf-testimonial-text">"${project.testimonial.text}"</p>
          <div class="pf-testimonial-author">
            ${project.testimonial.image ? `
              <div class="pf-testimonial-avatar">
                <img src="${project.testimonial.image}" alt="${project.testimonial.author}"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(project.testimonial.author)}&background=E8621A&color=fff&size=128'">
              </div>` : ''}
            <div class="pf-testimonial-info">
              <h4>${project.testimonial.author}</h4>
              <span>${project.testimonial.role}</span>
            </div>
          </div>
        </div>` : ''}

      <div class="pf-detail-actions">
        ${project.livePreview ? `
          <a href="${project.website}" target="_blank" class="pf-btn-primary">
            <span>View Live Website</span><i class="fas fa-external-link-alt"></i>
          </a>` : ''}
        <a href="../index.html#contact" class="pf-btn-secondary">
          <span>Start Your Project</span><i class="fas fa-arrow-right"></i>
        </a>
      </div>`;

    this.setupGallery();
    setTimeout(() => this.modal.classList.add('active'), 10);
  }

  setupGallery() {
    if (!this.currentProject?.gallery) return;

    const mainImg = this.modalBody.querySelector('.pf-gallery-main');
    const thumbs = this.modalBody.querySelectorAll('.pf-gallery-thumb');

    mainImg?.addEventListener('click', () => {
      const idx = parseInt(mainImg.dataset.imageIndex);
      this.openLightbox(this.currentProject.gallery, idx);
    });

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.imageIndex);
        thumbs.forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
        const img = mainImg.querySelector('img');
        img.src = this.currentProject.gallery[idx];
        mainImg.dataset.imageIndex = idx;
      });
    });
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    history.pushState('', document.title, window.location.pathname + window.location.search);
    this.currentProject = null;
  }

  // ————— Lightbox —————
  openLightbox(images, startIndex = 0) {
    if (!this.lightbox) return;
    this.lightboxImages = images;
    this.currentLightboxIndex = startIndex;
    this.updateLightbox();
    document.body.style.overflow = 'hidden';
    this.lightbox.classList.add('active');
  }

  updateLightbox() {
    if (!this.lightboxImg || !this.lightboxImages.length) return;
    this.lightboxImg.src = this.lightboxImages[this.currentLightboxIndex];

    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = this.currentProject
        ? `${this.currentProject.title} — Image ${this.currentLightboxIndex + 1}`
        : `Image ${this.currentLightboxIndex + 1}`;
    }
    if (this.lightboxCounter) {
      this.lightboxCounter.textContent = `${this.currentLightboxIndex + 1} / ${this.lightboxImages.length}`;
    }
    const show = this.lightboxImages.length > 1 ? 'flex' : 'none';
    if (this.lightboxPrev) this.lightboxPrev.style.display = show;
    if (this.lightboxNext) this.lightboxNext.style.display = show;
  }

  navLightbox(dir) {
    if (!this.lightboxImages.length) return;
    this.currentLightboxIndex += dir;
    if (this.currentLightboxIndex < 0) this.currentLightboxIndex = this.lightboxImages.length - 1;
    if (this.currentLightboxIndex >= this.lightboxImages.length) this.currentLightboxIndex = 0;
    this.updateLightbox();
  }

  closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('active');
    document.body.style.overflow = this.modal?.classList.contains('active') ? 'hidden' : '';
    this.lightboxImages = [];
    this.currentLightboxIndex = 0;
  }

  // ————— Deep Linking —————
  checkUrlHash() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;
    const project = this.projects.find((p) => p.slug === hash);
    if (project && !project.comingSoon) this.openModal(project);
  }
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Reveal animations
  const reveals = new RevealObserver();
  reveals.init();

  // Category nav
  const catNav = new CategoryNav();
  catNav.init();

  // Portfolio
  const portfolio = new PortfolioPage();
  portfolio.init();

  // Scroll to top on fresh load
  if (!window.location.hash) window.scrollTo(0, 0);

  console.log('✅ Portfolio Page — Premium Edition Initialized');
});
