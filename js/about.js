/* about.js */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initParallax();
    initScrollEffects();
    initMobileMenu();
    initTypingEffect();
    initStatCounters();
    initSectionAnimations();
    initParticles();
});

function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            const moveX = (x * 100 * speed);
            const moveY = (y * 100 * speed);
            layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

function initScrollEffects() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Header effect
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Parallax effect for sections
        document.querySelectorAll('.section-wrapper').forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.3;
                const yPos = -(rect.top * speed);
                section.style.backgroundPositionY = `${yPos}px`;
            }
        });

        lastScroll = currentScroll;
    }, { passive: true });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
        if (!hamburger?.contains(e.target) && !mobileNav?.contains(e.target)) {
            hamburger?.classList.remove('active');
            mobileNav?.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

function initTypingEffect() {
    const texts = [
        "Your Partner in Technology Solutions",
        "Innovative Tech Services",
        "Expert Support & Guidance",
        "Quality That Exceeds Expectations"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 100;
    const deletingDelay = 50;
    const newTextDelay = 2000;

    const typingElement = document.querySelector('.typing-text');
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, newTextDelay);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(type, isDeleting ? deletingDelay : typingDelay);
    }
    
    type();
}

function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-value'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = parseInt(element.textContent) || 0;
    const range = target - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const value = Math.floor(start + (range * progress));
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function initSectionAnimations() {
    const sections = document.querySelectorAll('.timeline, .value-card, .team-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
}

function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#f9c200' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#f9c200',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}
