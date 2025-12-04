/**
 * Why Us Page JavaScript
 * Particles animation and stat counters
 */

// ==========================================
// PARTICLES ANIMATION
// ==========================================
class WhyParticlesAnimation {
  constructor() {
    this.canvas = document.getElementById('why-particles-canvas');
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
// STAT COUNTERS
// ==========================================
class WhyStatCounters {
  constructor() {
    this.statValues = document.querySelectorAll('.why-stat-value');
    this.animated = new Set();
  }

  init() {
    if (!this.statValues.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated.has(entry.target)) {
          this.animateStat(entry.target);
          this.animated.add(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    this.statValues.forEach(stat => observer.observe(stat));
  }

  animateStat(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasDot = text.includes('.');
    
    let number = parseFloat(text.replace(/[^0-9.]/g, ''));
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 50;
    const stepTime = 30;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        let finalText = hasDot ? number.toFixed(1) : Math.round(number).toString();
        if (hasPlus) finalText += '+';
        element.textContent = finalText;
        clearInterval(timer);
      } else {
        let displayText = hasDot ? current.toFixed(1) : Math.round(current).toString();
        if (hasPlus) displayText += '+';
        element.textContent = displayText;
      }
    }, stepTime);
  }
}

// ==========================================
// PAGE INTERACTIONS
// ==========================================
class WhyPageInteractions {
  constructor() {
    this.advantageCards = document.querySelectorAll('.why-advantage-card');
    this.testimonialCards = document.querySelectorAll('.why-testimonial-card');
  }

  init() {
    this.setupCardAnimations();
  }

  setupCardAnimations() {
    const allCards = [...this.advantageCards, ...this.testimonialCards];
    
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
  const particles = new WhyParticlesAnimation();
  particles.init();
  
  // Initialize stat counters
  const statCounters = new WhyStatCounters();
  statCounters.init();
  
  // Initialize interactions
  const interactions = new WhyPageInteractions();
  interactions.init();

  // Scroll to top on page load
  window.scrollTo(0, 0);

  console.log('✅ Why Us Page - Initialized');
});
