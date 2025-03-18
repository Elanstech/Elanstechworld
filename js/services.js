/**
 * Elan's Tech World - Services Page JavaScript
 * A comprehensive script for animations, interactions, and functionality
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. PAGE LOADER
    // ============================================
    const loaderContainer = document.querySelector('.loader-container');
    const loaderProgressBar = document.querySelector('.loader-progress-bar');
    const loaderPercentage = document.querySelector('.loader-percentage');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide loader and enable animations after a short delay
            setTimeout(() => {
                loaderContainer.classList.add('hidden');
                document.body.classList.remove('preload');
                
                // Initialize particles
                initParticles();
                
                // Trigger initial animations
                triggerHeroAnimations();
                
                // Initialize observers and other functionality
                initScrollObserver();
                initStatCounter();
                initTiltElements();
                initTyped();
            }, 500);
        }
        
        // Update loader visuals
        loaderProgressBar.style.width = `${progress}%`;
        loaderPercentage.textContent = `${Math.round(progress)}%`;
    }, 150);
    
    // ============================================
    // 2. HERO SECTION ANIMATIONS
    // ============================================
    function triggerHeroAnimations() {
        const heroElements = document.querySelectorAll('[data-animation="fade-up"]');
        
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animated');
            }, 200 * index);
        });
    }
    
    // Initialize particles.js for hero background
    function initParticles() {
        if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.3,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": "#ffffff",
                        "opacity": 0.2,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 0.5
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        }
    }
    
    // Initialize typed.js for hero section
    function initTyped() {
        if (typeof Typed !== 'undefined' && document.getElementById('services-typed')) {
            new Typed('#services-typed', {
                strings: [
                    'Web Development', 
                    'Mobile Applications', 
                    'POS Systems', 
                    'Digital Marketing', 
                    'Technology Solutions'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                startDelay: 500,
                loop: true,
                smartBackspace: true
            });
        }
    }
    
    // ============================================
    // 3. SCROLL ANIMATIONS
    // ============================================
    function initScrollObserver() {
        // Create an intersection observer for fade-in animations
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe all elements with fade-up animation
        document.querySelectorAll('[data-animation="fade-up"]:not(.animated)').forEach(element => {
            fadeObserver.observe(element);
        });
        
        // Create observer for animated elements
        const elementsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    elementsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe all animated elements
        document.querySelectorAll('.animated-element').forEach(element => {
            elementsObserver.observe(element);
        });
        
        // Handle sticky header
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Show/hide back to top button
            if (scrollTop > 300) {
                document.querySelector('.back-to-top').classList.add('active');
            } else {
                document.querySelector('.back-to-top').classList.remove('active');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ============================================
    // 4. STATISTICS COUNTER
    // ============================================
    function initStatCounter() {
        const counters = document.querySelectorAll('.counter');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    let count = 0;
                    const interval = setInterval(() => {
                        count += Math.ceil(target / 30);
                        if (count >= target) {
                            counter.textContent = target;
                            clearInterval(interval);
                        } else {
                            counter.textContent = count;
                        }
                    }, 50);
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // ============================================
    // 5. TILT EFFECT
    // ============================================
    function initTiltElements() {
        const tiltElements = document.querySelectorAll('.tilt-element');
        
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(tiltElements, {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
                scale: 1.05
            });
        } else {
            tiltElements.forEach(element => {
                element.addEventListener('mousemove', e => {
                    const rect = element.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    
                    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    element.style.transition = 'transform 0.1s ease';
                });
                
                element.addEventListener('mouseleave', () => {
                    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                    element.style.transition = 'transform 0.5s ease';
                });
            });
        }
    }
    
    // ============================================
    // 6. MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        mobileMenuClose.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
    
    // ============================================
    // 7. FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
    
    // ============================================
    // 8. TESTIMONIALS SLIDER
    // ============================================
    let testimonialsSwiper;
    
    // Initialize Swiper if the element exists
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider && typeof Swiper !== 'undefined') {
        testimonialsSwiper = new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.testimonials-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.testimonials-nav-next',
                prevEl: '.testimonials-nav-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
    }
    
    // ============================================
    // 9. FORM VALIDATION
    // ============================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && !validateEmail(emailField.value.trim())) {
                isValid = false;
                emailField.classList.add('error');
            }
            
            if (isValid) {
                // Show success message (in real implementation, you'd submit the form)
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual AJAX submission)
                setTimeout(() => {
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Your message has been sent successfully!';
                    
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successMessage);
                }, 2000);
            }
        });
        
        // Add input event listeners to remove error class when user types
        contactForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
    
    // Email validation helper
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    // ============================================
    // 10. SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // 11. MAGNETIC BUTTONS
    // ============================================
    const magneticButtons = document.querySelectorAll('.magnetic-button');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', e => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) * 0.3;
            const deltaY = (y - centerY) * 0.3;
            
            button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
    
    // ============================================
    // 12. BUBBLE ANIMATIONS
    // ============================================
    function createBubbles() {
        document.querySelectorAll('.btn-bubbles').forEach(container => {
            const bubbles = container.querySelectorAll('.bubble');
            
            bubbles.forEach((bubble, index) => {
                const randomDelay = Math.random() * 4 + 1;
                const randomDuration = Math.random() * 4 + 3;
                
                bubble.style.animationDelay = `${randomDelay}s`;
                bubble.style.animationDuration = `${randomDuration}s`;
                bubble.style.left = `${Math.random() * 100}%`;
                bubble.style.opacity = '0';
                
                // Start animation
                setTimeout(() => {
                    bubble.style.opacity = '0.8';
                }, 100);
            });
        });
    }
    
    // Initially create bubbles
    createBubbles();
    
    // Periodically refresh bubbles
    setInterval(createBubbles, 8000);
    
    // ============================================
    // 13. PORTFOLIO IMAGES LIGHTBOX
    // ============================================
    const portfolioImages = document.querySelectorAll('.portfolio-image');
    
    if (portfolioImages.length > 0) {
        portfolioImages.forEach(image => {
            image.addEventListener('click', () => {
                const imgSrc = image.querySelector('img').getAttribute('src');
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-backdrop"></div>
                    <div class="lightbox-content">
                        <img src="${imgSrc}" alt="Lightbox Image">
                        <button class="lightbox-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                
                document.body.appendChild(lightbox);
                document.body.classList.add('no-scroll');
                
                // Add animation class after a small delay
                setTimeout(() => {
                    lightbox.classList.add('active');
                }, 10);
                
                // Close lightbox
                lightbox.addEventListener('click', (e) => {
                    if (e.target.classList.contains('lightbox-backdrop') || 
                        e.target.classList.contains('lightbox-close') || 
                        e.target.closest('.lightbox-close')) {
                        lightbox.classList.remove('active');
                        
                        setTimeout(() => {
                            document.body.removeChild(lightbox);
                            document.body.classList.remove('no-scroll');
                        }, 300);
                    }
                });
            });
        });
    }
});
