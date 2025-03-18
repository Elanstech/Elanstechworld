/**
 * Elan's Tech World - Services Page JavaScript
 * A comprehensive and organized script for all interactions and animations
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
                
                // Trigger initial animations
                triggerHeroAnimations();
                
                // Initialize observers and other functionality
                initScrollObserver();
                initStatCounter();
                initTiltElements();
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
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe all elements with fade-up animation
        document.querySelectorAll('[data-animation="fade-up"]:not(.animated)').forEach(element => {
            fadeObserver.observe(element);
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
    // 7. CATEGORIES TABS & SERVICE FILTERING
    // ============================================
    const categoryTabs = document.querySelectorAll('.category-tab');
    const serviceDetailSections = document.querySelectorAll('.service-detail-section');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            
            // Show/hide service sections based on category
            serviceDetailSections.forEach(section => {
                section.classList.remove('active');
                
                if (category === 'all' || section.getAttribute('data-category') === category) {
                    setTimeout(() => {
                        section.classList.add('active');
                    }, 300);
                }
            });
            
            // Also filter quick link cards
            const quickLinkCards = document.querySelectorAll('.quick-link-card');
            quickLinkCards.forEach(card => {
                card.style.display = 'flex';
                
                if (category !== 'all' && card.getAttribute('data-category') !== category) {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // ============================================
    // 8. FAQ ACCORDION
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
    // 9. TESTIMONIALS SLIDER
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
    // 10. FORM VALIDATION
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
    // 11. SMOOTH SCROLL
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
    // 12. PACKAGE PRICING TABS
    // ============================================
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingPeriods = document.querySelectorAll('.pricing-period');
    
    if (pricingTabs.length > 0 && pricingPeriods.length > 0) {
        pricingTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const period = tab.getAttribute('data-period');
                
                // Update active tab
                pricingTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding pricing
                pricingPeriods.forEach(p => {
                    p.style.display = 'none';
                    if (p.getAttribute('data-period') === period) {
                        p.style.display = 'block';
                    }
                });
            });
        });
    }
    
    // ============================================
    // 13. MAGNETIC BUTTONS
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
    // 14. BUBBLE ANIMATIONS
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
    // 15. IMAGE LIGHTBOX
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

// Additional Swiper initialization for service sliders if needed
window.addEventListener('load', function() {
    if (typeof Swiper !== 'undefined') {
        // Services Carousel
        const servicesSwiper = new Swiper('.services-carousel', {
            slidesPerView: 1,
            spaceBetween: 30,
            centeredSlides: true,
            loop: true,
            pagination: {
                el: '.services-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.services-nav-next',
                prevEl: '.services-nav-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
        
        // Case Studies Slider
        const caseStudiesSwiper = new Swiper('.case-studies-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.case-studies-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.case-studies-nav-next',
                prevEl: '.case-studies-nav-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
    }
});
