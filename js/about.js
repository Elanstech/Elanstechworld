// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    initParallax();
    initScrollEffects();
    initMobileMenu();
    initTypingEffect();
    initStatCounters();
    initSectionAnimations();
    initParticles();
});

// Parallax Effect for Hero Section
function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        parallaxLayers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.2;
            const moveX = (x * 100 * speed);
            const moveY = (y * 100 * speed);
            layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// Scroll Effects for Header and Sections
function initScrollEffects() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScroll = window.pageYOffset;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll(lastScroll);
                ticking = false;
            });

            ticking = true;
        }
    }, { passive: true });

    function handleScroll(scrollPos) {
        // Header effect
        if (scrollPos > 50) {
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
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu when pressing escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        body.style.overflow = '';
    }
}

// Typing Effect for Hero Section
function initTypingEffect() {
    const texts = [
        "Your Partner in Technology Solutions",
        "Innovative Tech Services",
        "Expert Support & Guidance",
        "Quality That Exceeds Expectations"
    ];
    
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingDelay = 100;
    const deletingDelay = 50;
    const newTextDelay = 2000;

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
        
        const nextDelay = isDeleting ? deletingDelay : typingDelay;
        setTimeout(type, nextDelay);
    }
    
    type();
}

// Stats Counter Animation
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                if (!isNaN(target)) {
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        stat.textContent = '0';
        observer.observe(stat);
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;
    let current = 0;
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.round(current);
        }
    }, stepDuration);
}

// Section Animations
function initSectionAnimations() {
    const animatedElements = document.querySelectorAll('.timeline, .value-card, .team-card');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });

    animatedElements.forEach(element => observer.observe(element));
}

// Particles.js Initialization
function initParticles() {
    if (typeof particlesJS === 'undefined') {
        console.warn('particles.js not loaded');
        return;
    }

    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#f9c200'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false
                }
            },
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
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Error Handling for Image Loading
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Failed to load image:', e.target.src);
        // Optionally add a class to handle failed image loads
        e.target.classList.add('image-load-error');
    }
}, true);
