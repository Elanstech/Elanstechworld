/* about.js */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and effects
    initializeAnimations();
    initializeParallax();
    initializeTypingEffect();
    initializeScrollEffects();
    initializeStatCounters();
    initializeTimelineAnimation();
});

function initializeAnimations() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Animate hero content
    gsap.from('.about-hero-content', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: 'power3.out'
    });
}

function initializeParallax() {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.about-hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
    });
}

function initializeTypingEffect() {
    const words = [
        "Innovative Solutions.",
        "Expert Support.",
        "Quality Service.",
        "Your Tech Partner."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const current = words[wordIndex];
        const typingText = document.querySelector('.typing-text');

        if (isDeleting) {
            typingText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            typingSpeed = 50;
            setTimeout(type, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 100;
            setTimeout(type, 500);
        } else {
            setTimeout(type, typingSpeed);
        }
    }

    type();
}

function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Header effect
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Timeline items reveal
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < window.innerHeight * 0.8) {
                item.classList.add('visible');
            }
        });

        lastScroll = currentScroll;
    });
}

function initializeStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16); // 60fps

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

function initializeTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    gsap.from(timelineItems, {
        opacity: 0,
        x: -100,
        stagger: 0.3,
        duration: 1,
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top center',
            toggleActions: 'play none none reverse'
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // ... (keep existing initialization code)

    // Mobile Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    let overlay;

    // Create and append overlay
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);
    }
    createOverlay();

    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Toggle body scroll
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        }, 250);
    });
});

