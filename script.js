// Initialize AOS (Animate on Scroll)
AOS.init({ 
    duration: 1000, 
    once: true,
    disable: window.innerWidth < 768 // Disable on mobile for better performance
});

// Header Scroll Effect
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Hero Background Slideshow
document.addEventListener('DOMContentLoaded', function() {
    const heroBackgrounds = document.querySelectorAll('.hero-bg');
    let currentBg = 0;
    
    // Show first background immediately
    heroBackgrounds[0].classList.add('active');
    
    function nextBackground() {
        // Remove active class from current background
        heroBackgrounds[currentBg].classList.remove('active');
        
        // Move to next background
        currentBg = (currentBg + 1) % heroBackgrounds.length;
        
        // Add active class to new background
        heroBackgrounds[currentBg].classList.add('active');
    }
    
    // Change background every 6 seconds
    setInterval(nextBackground, 6000);
});

// Mobile-optimized Particles.js Configuration
particlesJS("particles-js", {
    particles: {
        number: {
            value: window.innerWidth < 768 ? 40 : 80, // Reduce particles on mobile
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: { 
            value: "#ffffff" 
        },
        shape: { 
            type: "circle" 
        },
        opacity: {
            value: 0.3,
            random: false,
            anim: { enable: false }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: false }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: window.innerWidth < 768 ? 2 : 3, // Slower on mobile
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: window.innerWidth > 768, // Disable hover effect on mobile
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        }
    },
    retina_detect: true
});

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const body = document.body;

// Hamburger Menu Click Handler
hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMobileMenu();
});

// Close mobile menu when clicking on a link
const mobileNavLinks = mobileNav.getElementsByTagName('a');
for (const link of mobileNavLinks) {
    link.addEventListener('click', function() {
        closeMobileMenu();
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    if (!hamburger.contains(event.target) && 
        !mobileNav.contains(event.target) && 
        mobileNav.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Prevent menu close when clicking inside mobile nav
mobileNav.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Helper functions for mobile menu
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.classList.toggle('menu-open');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    body.classList.remove('menu-open');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Parallax Effect for Sections
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section-wrapper');
    sections.forEach(section => {
        const speed = 0.5;
        const rect = section.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            const yPos = -(scrolled * speed);
            section.style.transform = `translateY(${yPos}px)`;
        }
    });
});

// Text Scramble Effect for Section Headings
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

// Apply scramble effect to headings when they come into view
document.addEventListener('DOMContentLoaded', function() {
    const headings = document.querySelectorAll('.section-text h3');
    const observers = new Map();
    
    headings.forEach(heading => {
        const fx = new TextScramble(heading);
        const originalText = heading.textContent;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fx.setText(originalText);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(heading);
        observers.set(heading, observer);
    });
});

// Enhanced Particle Effect
const updateParticlesConfig = () => {
    if (window.innerWidth < 768) {
        particlesJS('particles-js', {
            // ... (your existing mobile config)
            particles: {
                number: { value: 40 },
                size: { value: 2 },
                move: { speed: 2 }
            }
        });
    } else {
        particlesJS('particles-js', {
            // ... (your existing desktop config)
            particles: {
                number: { value: 80 },
                size: { value: 3 },
                move: { speed: 3 }
            }
        });
    }
};

// Update particles on resize
window.addEventListener('resize', updateParticlesConfig);

// Tilt effect for section images
document.addEventListener('DOMContentLoaded', function() {
    const sectionImages = document.querySelectorAll('.section-wrapper img');
    
    sectionImages.forEach(image => {
        image.addEventListener('mousemove', handleTilt);
        image.addEventListener('mouseleave', resetTilt);
    });
});

function handleTilt(e) {
    const img = e.currentTarget;
    const imgRect = img.getBoundingClientRect();
    const centerX = imgRect.left + imgRect.width / 2;
    const centerY = imgRect.top + imgRect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateX = (mouseY - centerY) * 0.01;
    const rotateY = (centerX - mouseX) * 0.01;
    
    img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function resetTilt(e) {
    const img = e.currentTarget;
    img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});
    });
});
