// GSAP initialization and ScrollTrigger registration
gsap.registerPlugin(ScrollTrigger);

// Page Loader
window.addEventListener('load', () => {
    gsap.to('.page-loader', {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            document.querySelector('.page-loader').style.display = 'none';
            animateHeroContent();
        }
    });
});

// Hero Content Animation
function animateHeroContent() {
    const tl = gsap.timeline();
    tl.from('.hero-title .title-line', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out'
    })
    .from('.hero-description', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.explore-btn', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5');
}

// Header Scroll Effect with GSAP
ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
        const header = document.querySelector('header');
        if (self.direction === 1) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Parallax Background Effect
document.querySelectorAll('.hero-bg').forEach(layer => {
    gsap.to(layer, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
});

// Section Animations
const sections = gsap.utils.toArray('.section-wrapper');
sections.forEach(section => {
    gsap.from(section, {
        y: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
        }
    });
});

// Service Cards Animation
const serviceCards = gsap.utils.toArray('.service-card');
serviceCards.forEach((card, i) => {
    gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 65%',
            scrub: 1
        }
    });
});

// Project Cards Hover Effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        gsap.to(card.querySelector('.project-overlay'), {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', (e) => {
        gsap.to(card.querySelector('.project-overlay'), {
            opacity: 0,
            y: 50,
            duration: 0.4,
            ease: 'power2.in'
        });
    });
});

// Form Input Animation
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        gsap.to(input.nextElementSibling, {
            y: -25,
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            gsap.to(input.nextElementSibling, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.in'
            });
        }
    });
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: offsetPosition,
                    autoKill: false
                },
                ease: 'power2.inOut'
            });

            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        gsap.to(scrollTopBtn, {
            opacity: 1,
            duration: 0.3,
            display: 'flex'
        });
    } else {
        gsap.to(scrollTopBtn, {
            opacity: 0,
            duration: 0.3,
            display: 'none'
        });
    }
});

scrollTopBtn.addEventListener('click', () => {
    gsap.to(window, {
        duration: 1,
        scrollTo: {
            y: 0,
            autoKill: false
        },
        ease: 'power2.inOut'
    });
});

// Text Scramble Effect (Enhanced)
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#_____';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="text-scramble">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize Text Scramble Effect
document.querySelectorAll('.section-header h2').forEach(heading => {
    const fx = new TextScramble(heading);
    const originalText = heading.textContent;
    
    ScrollTrigger.create({
        trigger: heading,
        start: 'top 80%',
        onEnter: () => fx.setText(originalText)
    });
});
