// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.classList.add('preloader--hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
            // Animate hero section elements
            animateHeroSection();
        }, 1000);
    });

    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: function() {
            cursorX += (mouseX - cursorX) / 8;
            cursorY += (mouseY - cursorY) / 8;
            followerX += (mouseX - followerX) / 6;
            followerY += (mouseY - followerY) / 6;

            gsap.set(cursor, {
                left: cursorX,
                top: cursorY
            });
            gsap.set(cursorFollower, {
                left: followerX,
                top: followerY
            });
        }
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .hover-effect');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor--active');
            cursorFollower.classList.add('cursor-follower--active');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor--active');
            cursorFollower.classList.remove('cursor-follower--active');
        });
    });

    // Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const header = document.querySelector('.header');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Header Scroll Effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }

        lastScroll = currentScroll;
    });

    // Noise Effect for Hero Background
    const canvas = document.getElementById('noiseCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function generateNoise() {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 15; // Opacity
        }

        ctx.putImageData(imageData, 0, 0);
    }

    let noiseAnimation;
    function animateNoise() {
        generateNoise();
        noiseAnimation = requestAnimationFrame(animateNoise);
    }

    animateNoise();

    // Services Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Filter services
            gsap.to(serviceCards, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                stagger: 0.1,
                onComplete: () => {
                    serviceCards.forEach(card => {
                        if (filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
                            gsap.to(card, {
                                opacity: 1,
                                y: 0,
                                duration: 0.5
                            });
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });

    // Pricing Toggle
    const pricingToggle = document.getElementById('billingToggle');
    const monthlyPrices = document.querySelectorAll('.price.monthly');
    const yearlyPrices = document.querySelectorAll('.price.annual');
    const periodTexts = document.querySelectorAll('.period');

    pricingToggle.addEventListener('change', () => {
        const isYearly = pricingToggle.checked;

        gsap.to([monthlyPrices, yearlyPrices], {
            opacity: 0,
            y: 20,
            duration: 0.3,
            onComplete: () => {
                monthlyPrices.forEach(price => {
                    price.style.display = isYearly ? 'none' : 'block';
                });
                yearlyPrices.forEach(price => {
                    price.style.display = isYearly ? 'block' : 'none';
                });
                periodTexts.forEach(period => {
                    period.textContent = isYearly ? '/year' : '/month';
                });
                gsap.to([monthlyPrices, yearlyPrices], {
                    opacity: 1,
                    y: 0,
                    duration: 0.3
                });
            }
        });
    });

    // Stats Counter Animation
    const statsSection = document.querySelector('.stats');
    const statNumbers = document.querySelectorAll('.stat-card__number .number');

    const animateStats = () => {
        statNumbers.forEach(number => {
            const target = parseInt(number.closest('.stat-card').dataset.value);
            let start = 0;
            const duration = 2000;
            const increment = target / (duration / 16);

            const updateNumber = () => {
                start += increment;
                if (start < target) {
                    number.textContent = Math.floor(start);
                    requestAnimationFrame(updateNumber);
                } else {
                    number.textContent = target;
                }
            };

            updateNumber();
        });
    };

    // Testimonials Slider
    const initTestimonialsSlider = () => {
        new Swiper('.testimonials__slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 3,
                }
            }
        });
    };

    // Scroll Animations
    const initScrollAnimations = () => {
        // Hero Section Parallax
        gsap.to('.hero__background', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: '30%'
        });

        // Fade in animations for sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: 1
                },
                opacity: 0,
                y: 50,
                duration: 1
            });
        });
    };

    // Smooth Scroll
    const initSmoothScroll = () => {
        const pageLinks = document.querySelectorAll('a[href^="#"]');
        
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            y: target,
                            offsetY: 80
                        },
                        ease: 'power2.inOut'
                    });
                }
            });
        });
    };

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });

        backToTop.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: 0
                },
                ease: 'power2.inOut'
            });
        });
    }

    // Initialize all animations and features
    const init = () => {
        initTestimonialsSlider();
        initScrollAnimations();
        initSmoothScroll();
        
        // Trigger stats animation when stats section is in view
        ScrollTrigger.create({
            trigger: statsSection,
            start: 'top 80%',
            onEnter: animateStats,
            once: true
        });

        // Initialize AOS
        AOS.init({
            duration: 800,
            offset: 50,
            once: true
        });
    };

    init();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Update canvas dimensions
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Cookie Consent
const initCookieConsent = () => {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = cookieConsent.querySelector('.cookie-consent__accept');
    
    if (!localStorage.getItem('cookieConsent')) {
        cookieConsent.classList.add('active');
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieConsent.classList.remove('active');
    });
};

initCookieConsent();
