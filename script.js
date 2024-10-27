// ... (keep your existing code, then add these enhancements)

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
