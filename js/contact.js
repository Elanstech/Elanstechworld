/**
 * Contact Page JavaScript
 * Particles animation and interactions
 */

// ==========================================
// PARTICLES ANIMATION
// ==========================================
class ContactParticlesAnimation {
  constructor() {
    this.canvas = document.getElementById('contact-particles-canvas');
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
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
      
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
      
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
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
// FAQ INTERACTIONS
// ==========================================
class ContactFAQ {
  constructor() {
    this.faqItems = document.querySelectorAll('.contact-faq-grid .faq-item');
  }

  init() {
    if (!this.faqItems.length) return;
    
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        // Close other items
        this.faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    });
  }
}

// ==========================================
// CONTACT PAGE INTERACTIONS
// ==========================================
class ContactPageInteractions {
  constructor() {
    this.infoCards = document.querySelectorAll('.contact-info-card');
    this.trustBadges = document.querySelectorAll('.contact-trust-badge');
  }

  init() {
    this.setupCardAnimations();
  }

  setupCardAnimations() {
    const allCards = [...this.infoCards, ...this.trustBadges];
    
    if (!allCards.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    allCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(40px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particles
  const particles = new ContactParticlesAnimation();
  particles.init();
  
  // Initialize FAQ
  const faq = new ContactFAQ();
  faq.init();
  
  // Initialize interactions
  const interactions = new ContactPageInteractions();
  interactions.init();

  // Scroll to top on page load
  window.scrollTo(0, 0);

  console.log('✅ Contact Page - Initialized');
});
