/**
 * ═══════════════════════════════════════════════════════════════
 *  WEB DESIGN LANDING PAGE — Premium Interactions Engine
 *  Particle field · Scroll reveals · Animated counters
 *  Browser mockup parallax · Timeline progress · FAQ accordion
 *  SEO score ring · Floating badge orchestration · Mouse tracking
 * ═══════════════════════════════════════════════════════════════
 */

// ─── UTILITIES ────────────────────────────────────────────────
const wdQ = (s, p = document) => p.querySelector(s);
const wdQA = (s, p = document) => [...p.querySelectorAll(s)];

const wdThrottle = (fn, ms) => {
  let last = 0;
  return (...a) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...a); }
  };
};

const wdLerp = (a, b, t) => a + (b - a) * t;

const wdClamp = (val, min, max) => Math.min(Math.max(val, min), max);

const wdMap = (val, inMin, inMax, outMin, outMax) => {
  return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
};

// ─── SCROLL REVEAL ENGINE ─────────────────────────────────────
// All elements with data-wd-reveal get animated into view using
// IntersectionObserver with configurable delays.
class WDScrollReveal {
  constructor() {
    this.elements = wdQA('[data-wd-reveal]');
    this.revealed = new Set();
  }

  init() {
    if (!this.elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.revealed.has(entry.target)) {
          this.revealed.add(entry.target);
          const delay = parseInt(entry.target.dataset.wdDelay || 0);
          setTimeout(() => {
            entry.target.classList.add('wd-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(el => observer.observe(el));
  }
}

// ─── PARTICLE FIELD ───────────────────────────────────────────
// Generates floating particles in the hero background that drift
// upward with randomized size, speed, and opacity for a premium
// ambient effect reminiscent of luxury tech product launches.
class WDParticleField {
  constructor() {
    this.container = wdQ('#heroParticles');
    this.count = 40;
    this.particles = [];
  }

  init() {
    if (!this.container) return;

    // Reduce count on mobile for performance
    if (window.innerWidth < 768) this.count = 18;
    else if (window.innerWidth < 1024) this.count = 28;

    for (let i = 0; i < this.count; i++) {
      this.createParticle(i);
    }
  }

  createParticle(index) {
    const el = document.createElement('div');
    el.className = 'wd-particle';

    // Randomize properties
    const x = Math.random() * 100;
    const y = 50 + Math.random() * 50; // Start in lower half
    const size = 1.5 + Math.random() * 3;
    const dur = 8 + Math.random() * 16;
    const delay = Math.random() * dur;
    const dx = -50 + Math.random() * 100;
    const dy = -(100 + Math.random() * 300);
    const peakOpacity = 0.1 + Math.random() * 0.35;

    // Pick color — mostly orange tones, some blue accents
    const colors = [
      'rgba(232,101,26,0.6)',  // hermes
      'rgba(244,147,90,0.5)',  // hermes-light
      'rgba(255,215,0,0.3)',   // gold accent
      'rgba(30,58,110,0.4)',   // blue accent
      'rgba(248,245,240,0.2)', // cream
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      --dur: ${dur}s;
      --delay: -${delay}s;
      --dx: ${dx}px;
      --dy: ${dy}px;
      --peak-opacity: ${peakOpacity};
    `;

    this.container.appendChild(el);
    this.particles.push(el);
  }
}

// ─── BROWSER MOCKUP PARALLAX ──────────────────────────────────
// The floating browser mockup in the hero section responds to
// mouse movement with subtle 3D rotation, creating a depth
// effect that makes the page feel alive and interactive.
class WDBrowserParallax {
  constructor() {
    this.browser = wdQ('#browserMockup');
    this.hero = wdQ('#wd-hero');
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.currentX = 0.5;
    this.currentY = 0.5;
    this.baseFloat = 0;
    this.active = true;
  }

  init() {
    if (!this.browser || !this.hero) return;

    // Mouse tracking
    this.hero.addEventListener('mousemove', (e) => {
      const rect = this.hero.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) / rect.width;
      this.mouseY = (e.clientY - rect.top) / rect.height;
    });

    // Reset on mouse leave
    this.hero.addEventListener('mouseleave', () => {
      this.mouseX = 0.5;
      this.mouseY = 0.5;
    });

    // Device orientation for mobile
    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          this.mouseX = wdClamp((e.gamma + 45) / 90, 0, 1);
          this.mouseY = wdClamp((e.beta + 20) / 80, 0, 1);
        }
      });
    }

    // Visibility check — pause when hero is off-screen
    const obs = new IntersectionObserver(([entry]) => {
      this.active = entry.isIntersecting;
    }, { threshold: 0.1 });
    obs.observe(this.hero);

    this.animate();
  }

  animate() {
    if (this.active) {
      // Smooth lerp
      this.currentX = wdLerp(this.currentX, this.mouseX, 0.04);
      this.currentY = wdLerp(this.currentY, this.mouseY, 0.04);

      // Map to rotation range
      const rotY = wdMap(this.currentX, 0, 1, 8, -8);
      const rotX = wdMap(this.currentY, 0, 1, -5, 5);

      // Add floating bob
      this.baseFloat += 0.008;
      const floatY = Math.sin(this.baseFloat) * 8;

      this.browser.style.transform = `
        translateY(${floatY}px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
      `;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ─── FLOATING BADGE ORCHESTRATION ─────────────────────────────
// The floating badges around the browser mockup appear sequentially
// after the browser itself animates in, creating a cascade effect.
class WDFloatingBadges {
  constructor() {
    this.badges = [
      { el: wdQ('#floatSpeed'), delay: 800 },
      { el: wdQ('#floatScore'), delay: 1200 },
      { el: wdQ('#floatMobile'), delay: 1600 },
    ];
    this.scoreCircle = wdQ('#scoreCircle');
    this.scoreNum = wdQ('#scoreNum');
  }

  init() {
    // Wait for hero visual to be visible
    const visual = wdQ('.wd-hero-visual');
    if (!visual) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.reveal();
        obs.unobserve(entry.target);
      }
    }, { threshold: 0.3 });

    obs.observe(visual);
  }

  reveal() {
    this.badges.forEach(({ el, delay }) => {
      if (!el) return;
      setTimeout(() => {
        el.classList.add('wd-badge-visible');
      }, delay);
    });

    // Animate SEO score ring
    setTimeout(() => this.animateScore(), 1400);
  }

  animateScore() {
    if (!this.scoreCircle || !this.scoreNum) return;

    const targetScore = 98;
    const circumference = 2 * Math.PI * 20; // r=20
    const targetOffset = circumference - (targetScore / 100) * circumference;
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const currentScore = Math.round(targetScore * eased);
      const currentOffset = circumference - (currentScore / 100) * circumference;

      this.scoreCircle.style.strokeDashoffset = currentOffset;
      this.scoreNum.textContent = currentScore;

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}

// ─── COUNTER ANIMATION ────────────────────────────────────────
// Animates numbers counting up when they scroll into view.
// Handles suffixes like +, %, .0 and static values like <2s.
class WDCounters {
  constructor() {
    this.els = wdQA('[data-count]');
    this.animated = new Set();
  }

  init() {
    if (!this.els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated.has(entry.target)) {
          this.animated.add(entry.target);
          this.count(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.els.forEach(el => observer.observe(el));
  }

  count(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = suffix.includes('.');
    const duration = 2200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo for dramatic fast-then-slow
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * eased;

      if (isDecimal) {
        el.textContent = current.toFixed(1) + suffix.replace('.', '');
      } else {
        el.textContent = Math.round(current) + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}

// ─── TIMELINE PROGRESS ────────────────────────────────────────
// As the user scrolls through the process timeline, a progress
// line fills to match scroll position and steps highlight as
// they enter the viewport.
class WDTimelineProgress {
  constructor() {
    this.timeline = wdQ('#wdTimeline');
    this.progressBar = wdQ('#timelineProgress');
    this.steps = wdQA('.wd-timeline-step');
    this.line = wdQ('.wd-timeline-line');
  }

  init() {
    if (!this.timeline || !this.progressBar || !this.steps.length) return;

    // Step activation via IntersectionObserver
    const stepObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('wd-step-active');
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -20% 0px'
    });

    this.steps.forEach(s => stepObs.observe(s));

    // Progress bar fill on scroll
    window.addEventListener('scroll', wdThrottle(() => this.updateProgress(), 30), { passive: true });
  }

  updateProgress() {
    if (!this.timeline) return;

    const rect = this.timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const timelineTop = rect.top;
    const timelineH = rect.height;

    // Calculate how far through the timeline we've scrolled
    const start = timelineTop - viewportH * 0.7;
    const end = timelineTop + timelineH - viewportH * 0.3;
    const scrollRange = end - start;

    let progress = 0;
    if (start < 0) {
      progress = Math.min(Math.abs(start) / scrollRange, 1);
    }

    this.progressBar.style.height = `${progress * 100}%`;
  }
}

// ─── FAQ ACCORDION ────────────────────────────────────────────
// Single-open accordion with smooth height transitions. Clicking
// an already-open item closes it. Includes keyboard support.
class WDFAQ {
  constructor() {
    this.items = wdQA('.wd-faq-item');
  }

  init() {
    if (!this.items.length) return;

    this.items.forEach(item => {
      const btn = wdQ('.wd-faq-question', item);
      if (!btn) return;

      btn.addEventListener('click', () => this.toggle(item));

      // Keyboard support
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(item);
        }
      });
    });
  }

  toggle(item) {
    const wasOpen = item.classList.contains('wd-faq-open');

    // Close all items first
    this.items.forEach(i => {
      i.classList.remove('wd-faq-open');
      const answer = wdQ('.wd-faq-answer', i);
      if (answer) answer.style.maxHeight = '0';
    });

    // Open clicked item if it wasn't already open
    if (!wasOpen) {
      item.classList.add('wd-faq-open');
      const answer = wdQ('.wd-faq-answer', item);
      if (answer) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    }
  }
}

// ─── HERO TEXT SCRAMBLE ───────────────────────────────────────
// The accent word in the hero title cycles through variations
// using a typewriter/scramble effect that catches the eye and
// reinforces the value proposition.
class WDTextScramble {
  constructor() {
    this.el = wdQ('#heroAccent');
    this.words = ['Convert', 'Impress', 'Perform', 'Dominate', 'Elevate'];
    this.currentIndex = 0;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.isAnimating = false;
    this.cycleInterval = 3500;
    this.frameRate = 30;
  }

  init() {
    if (!this.el) return;

    // Start cycling after initial delay
    setTimeout(() => {
      this.cycle();
    }, 2500);
  }

  cycle() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.words.length;
      this.scrambleTo(this.words[this.currentIndex]);
    }, this.cycleInterval);
  }

  scrambleTo(newWord) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const oldWord = this.el.textContent;
    const maxLen = Math.max(oldWord.length, newWord.length);
    const totalFrames = 20;
    let frame = 0;

    const interval = setInterval(() => {
      let output = '';
      const progress = frame / totalFrames;

      for (let i = 0; i < maxLen; i++) {
        // Characters that have "resolved" to their final value
        if (i < newWord.length && progress > (i / maxLen) * 0.8 + 0.2) {
          output += newWord[i];
        }
        // Characters still scrambling
        else if (i < newWord.length) {
          output += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
      }

      this.el.textContent = output;
      frame++;

      if (frame > totalFrames) {
        this.el.textContent = newWord;
        this.isAnimating = false;
        clearInterval(interval);
      }
    }, 1000 / this.frameRate);
  }
}

// ─── CURSOR GLOW TRAIL ───────────────────────────────────────
// Creates a subtle glow that follows the cursor in the hero
// section, adding a premium interactive touch.
class WDCursorGlow {
  constructor() {
    this.hero = wdQ('#wd-hero');
    this.glow = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.active = false;
  }

  init() {
    if (!this.hero || window.innerWidth < 768) return;

    // Create glow element
    this.glow = document.createElement('div');
    this.glow.style.cssText = `
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(232,101,26,0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 2;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
      will-change: transform;
    `;
    this.hero.style.position = 'relative';
    this.hero.appendChild(this.glow);

    this.hero.addEventListener('mouseenter', () => {
      this.active = true;
      this.glow.style.opacity = '1';
    });

    this.hero.addEventListener('mouseleave', () => {
      this.active = false;
      this.glow.style.opacity = '0';
    });

    this.hero.addEventListener('mousemove', (e) => {
      const rect = this.hero.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.animate();
  }

  animate() {
    if (this.active && this.glow) {
      this.currentX = wdLerp(this.currentX, this.mouseX, 0.08);
      this.currentY = wdLerp(this.currentY, this.mouseY, 0.08);
      this.glow.style.transform = `translate(${this.currentX - 200}px, ${this.currentY - 200}px)`;
    }
    requestAnimationFrame(() => this.animate());
  }
}

// ─── MAGNETIC BUTTONS ─────────────────────────────────────────
// CTA buttons in the hero have a subtle magnetic pull toward
// the cursor when hovering nearby, creating premium interactivity.
class WDMagneticButtons {
  constructor() {
    this.buttons = wdQA('.wd-hero-ctas .btn');
    this.strength = 0.3;
  }

  init() {
    if (!this.buttons.length || window.innerWidth < 768) return;

    this.buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * this.strength;
        const dy = (e.clientY - centerY) * this.strength;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }
}

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────────
class WDSmoothScroll {
  init() {
    wdQA('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = wdQ(href);
        if (target) {
          e.preventDefault();
          const offset = target.offsetTop - 80;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });
  }
}

// ─── FEATURE CARD HOVER EFFECTS ──────────────────────────────
// Adds a subtle gradient follow effect on feature cards where
// the highlight follows the cursor position within the card.
class WDFeatureCardFX {
  constructor() {
    this.cards = wdQA('.wd-feat-card');
  }

  init() {
    if (!this.cards.length || window.innerWidth < 768) return;

    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(232,101,26,0.04) 0%, transparent 50%), var(--cream-light)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.background = '';
      });
    });
  }
}

// ─── TESTIMONIAL CARD TILT ───────────────────────────────────
// Testimonial cards tilt slightly toward the cursor on hover
// for a 3D card effect.
class WDTestimonialTilt {
  constructor() {
    this.cards = wdQA('.wd-test-card');
  }

  init() {
    if (!this.cards.length || window.innerWidth < 768) return;

    this.cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.1s linear, border-color 0.5s ease, box-shadow 0.5s ease';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotX = y * -8;
        const rotY = x * 8;
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.5s ease, box-shadow 0.5s ease';
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
        setTimeout(() => {
          card.style.transition = 'transform 0.1s linear, border-color 0.5s ease, box-shadow 0.5s ease';
        }, 500);
      });
    });
  }
}

// ─── STICKY CTA BAR ──────────────────────────────────────────
// After scrolling past the hero, a compact CTA bar appears at
// the bottom of the screen on mobile for easy conversion access.
class WDStickyCTA {
  constructor() {
    this.hero = wdQ('#wd-hero');
    this.bar = null;
    this.isVisible = false;
  }

  init() {
    if (!this.hero) return;

    // Only show on mobile/tablet
    if (window.innerWidth > 991) return;

    this.createBar();

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !this.isVisible) {
        this.show();
      } else if (entry.isIntersecting && this.isVisible) {
        this.hide();
      }
    }, { threshold: 0 });

    obs.observe(this.hero);
  }

  createBar() {
    this.bar = document.createElement('div');
    this.bar.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 900;
      padding: 12px 20px;
      background: rgba(15, 29, 53, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid rgba(248,245,240,0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      box-shadow: 0 -4px 24px rgba(0,0,0,0.3);
    `;

    this.bar.innerHTML = `
      <div style="flex:1;min-width:0;">
        <div style="font-family:var(--font-body);font-size:0.75rem;color:rgba(248,245,240,0.5);font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Starting at</div>
        <div style="font-family:'Bodoni Moda',serif;font-size:1.5rem;font-weight:700;color:var(--cream);line-height:1;">$2,000</div>
      </div>
      <a href="contact.html" style="
        display:inline-flex;align-items:center;gap:8px;
        padding:12px 24px;background:var(--hermes);color:white;
        border-radius:9999px;font-family:var(--font-body);
        font-size:0.8125rem;font-weight:600;letter-spacing:0.04em;
        text-transform:uppercase;text-decoration:none;white-space:nowrap;
        box-shadow:0 4px 16px rgba(232,101,26,0.3);
      ">Get Quote</a>
      <a href="tel:+19294176819" style="
        display:flex;align-items:center;justify-content:center;
        width:44px;height:44px;border-radius:50%;
        border:1px solid rgba(248,245,240,0.2);color:var(--cream);
        text-decoration:none;font-size:1rem;flex-shrink:0;
      "><i class="fas fa-phone"></i></a>
    `;

    document.body.appendChild(this.bar);
  }

  show() {
    this.isVisible = true;
    this.bar.style.transform = 'translateY(0)';
  }

  hide() {
    this.isVisible = false;
    this.bar.style.transform = 'translateY(100%)';
  }
}

// ─── GRID LINES MOUSE RESPONSE ───────────────────────────────
// The subtle grid in the hero background shifts its perspective
// origin based on mouse position for a depth illusion.
class WDGridResponse {
  constructor() {
    this.grid = wdQ('#heroGridLines');
    this.hero = wdQ('#wd-hero');
    this.mouseX = 0.5;
    this.mouseY = 0.5;
    this.currentX = 0.5;
    this.currentY = 0.5;
  }

  init() {
    if (!this.grid || !this.hero || window.innerWidth < 768) return;

    this.hero.addEventListener('mousemove', (e) => {
      const rect = this.hero.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) / rect.width;
      this.mouseY = (e.clientY - rect.top) / rect.height;
    });

    this.animate();
  }

  animate() {
    this.currentX = wdLerp(this.currentX, this.mouseX, 0.03);
    this.currentY = wdLerp(this.currentY, this.mouseY, 0.03);

    const maskX = this.currentX * 100;
    const maskY = this.currentY * 100;

    this.grid.style.maskImage = `radial-gradient(ellipse 60% 60% at ${maskX}% ${maskY}%, black 10%, transparent 65%)`;
    this.grid.style.webkitMaskImage = `radial-gradient(ellipse 60% 60% at ${maskX}% ${maskY}%, black 10%, transparent 65%)`;

    requestAnimationFrame(() => this.animate());
  }
}

// ─── SECTION DIVIDER ANIMATIONS ──────────────────────────────
// Adds decorative animated dividers between major sections
// that animate as they scroll into view.
class WDSectionDividers {
  init() {
    const sections = wdQA('.wd-problem, .wd-features, .wd-process, .wd-stack, .wd-testimonials, .wd-faq, .wd-final-cta');

    sections.forEach(section => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('wd-section-visible');
          observer.unobserve(section);
        }
      }, { threshold: 0.1 });

      observer.observe(section);
    });
  }
}

// ─── PERFORMANCE MONITOR ─────────────────────────────────────
// Reduces animation intensity if frame rate drops below 30fps
// to ensure smooth experience on lower-end devices.
class WDPerfMonitor {
  constructor() {
    this.frames = [];
    this.isLowPerf = false;
    this.checkInterval = 2000;
  }

  init() {
    this.measure();
    setInterval(() => this.evaluate(), this.checkInterval);
  }

  measure() {
    const now = performance.now();
    this.frames.push(now);

    // Keep only last 60 frames
    if (this.frames.length > 60) this.frames.shift();

    requestAnimationFrame(() => this.measure());
  }

  evaluate() {
    if (this.frames.length < 10) return;

    const recent = this.frames.slice(-30);
    const totalTime = recent[recent.length - 1] - recent[0];
    const avgFPS = (recent.length - 1) / (totalTime / 1000);

    if (avgFPS < 28 && !this.isLowPerf) {
      this.isLowPerf = true;
      document.body.classList.add('wd-low-perf');
      console.log('⚡ Performance mode: reduced animations');
    }
  }
}

// ─── APPLICATION CONTROLLER ──────────────────────────────────
class WDApp {
  constructor() {
    this.modules = {
      reveal:         new WDScrollReveal(),
      particles:      new WDParticleField(),
      browserPx:      new WDBrowserParallax(),
      badges:         new WDFloatingBadges(),
      counters:       new WDCounters(),
      timeline:       new WDTimelineProgress(),
      faq:            new WDFAQ(),
      textScramble:   new WDTextScramble(),
      cursorGlow:     new WDCursorGlow(),
      magnetic:       new WDMagneticButtons(),
      smoothScroll:   new WDSmoothScroll(),
      featureCards:   new WDFeatureCardFX(),
      testimonialTilt:new WDTestimonialTilt(),
      stickyCTA:      new WDStickyCTA(),
      gridResponse:   new WDGridResponse(),
      dividers:       new WDSectionDividers(),
      perfMonitor:    new WDPerfMonitor(),
    };
  }

  init() {
    Object.entries(this.modules).forEach(([name, mod]) => {
      try {
        if (typeof mod.init === 'function') mod.init();
      } catch (err) {
        console.error(`[WD:${name}]`, err);
      }
    });

    console.log('✦ Web Design Landing — Premium Edition loaded');
  }
}

// ─── INIT ─────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WDApp().init());
} else {
  new WDApp().init();
}
