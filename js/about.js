// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations with custom settings
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        delay: 100,
        easing: 'ease-out'
    });

    // Initialize Particles.js
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
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Stats Counter Animation
    class CounterAnimation {
        constructor(element, targetValue, duration = 2000, prefix = '', suffix = '+') {
            this.element = element;
            this.targetValue = targetValue;
            this.duration = duration;
            this.prefix = prefix;
            this.suffix = suffix;
            this.startTime = null;
            this.currentValue = 0;
        }

        animate(currentTime) {
            if (!this.startTime) this.startTime = currentTime;
            const progress = (currentTime - this.startTime) / this.duration;

            if (progress < 1) {
                this.currentValue = Math.floor(this.targetValue * progress);
                this.element.textContent = this.prefix + this.currentValue + this.suffix;
                requestAnimationFrame(this.animate.bind(this));
            } else {
                this.currentValue = this.targetValue;
                this.element.textContent = this.prefix + this.targetValue + this.suffix;
            }
        }

        start() {
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    // Initialize Counter Animations with Intersection Observer
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetValue = parseInt(entry.target.textContent);
                const counter = new CounterAnimation(entry.target, targetValue);
                counter.start();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));

    // Timeline Animation Enhancement
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-animate');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // Parallax Effect for Hero Section
    let heroSection = document.querySelector('.about-hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroSection) {
            heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });

    // Values Cards Hover Effect Enhancement
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const icon = this.querySelector('.value-icon');
            icon.style.transform = 'rotateY(360deg) scale(1.1)';
        });

        card.addEventListener('mouseleave', function(e) {
            const icon = this.querySelector('.value-icon');
            icon.style.transform = 'rotateY(0) scale(1)';
        });
    });

    // Team Member Card Interaction
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        const image = card.querySelector('.team-image');
        const overlay = card.querySelector('.team-overlay');

        card.addEventListener('mouseenter', function() {
            image.style.transform = 'scale(1.1)';
            if (overlay) overlay.style.opacity = '1';
        });

        card.addEventListener('mouseleave', function() {
            image.style.transform = 'scale(1)';
            if (overlay) overlay.style.opacity = '0';
        });
    });

    // Smooth Scroll Implementation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Scroll Effect with Throttle
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    const header = document.querySelector('header');
    const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    function toggleMobileNav() {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('nav-open');
    }

    hamburger.addEventListener('click', toggleMobileNav);

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });

    // Close mobile nav when clicking links
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('nav-open');
        });
    });

    // Handle window resize
    window.addEventListener('resize', throttle(() => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('nav-open');
        }
    }, 100));
});
