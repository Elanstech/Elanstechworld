/**
 * Elan's Tech World - Services Page JavaScript
 * Custom scripts for enhancing the services page interactivity
 */

/**
 * Main initialization function that runs when the DOM is fully loaded
 * This organizes all component initializations in one place
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initServiceTabs();
    initServicesFAQ();
    initServiceAnimations();
    initServiceImageEffects();
    initSmoothScrolling();
});

/**
 * Service Tab Navigation
 * Handles filtering service sections based on the selected tab
 */
function initServiceTabs() {
    const tabs = document.querySelectorAll('.service-tab');
    const serviceSections = document.querySelectorAll('.service-detail-section');
    
    if (!tabs.length) return;
    
    // Handle tab click events
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Get filter value
            const filterValue = tab.getAttribute('data-service');
            
            // Filter service sections
            serviceSections.forEach(section => {
                if (filterValue === 'all') {
                    animateServiceSection(section, true);
                } else if (section.getAttribute('data-service') === filterValue) {
                    animateServiceSection(section, true);
                } else {
                    animateServiceSection(section, false);
                }
            });
            
            // Smooth scroll to the first visible section
            if (filterValue !== 'all') {
                const firstVisibleSection = document.querySelector(`.service-detail-section[data-service="${filterValue}"]`);
                if (firstVisibleSection) {
                    setTimeout(() => {
                        const navHeight = document.querySelector('.services-nav-section').offsetHeight;
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = firstVisibleSection.offsetTop - (navHeight + headerHeight);
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        });
    });
    
    /**
     * Helper function to animate service sections in and out
     * @param {Element} section - The section to animate
     * @param {boolean} isVisible - Whether to show or hide the section
     */
    function animateServiceSection(section, isVisible) {
        if (isVisible) {
            section.style.display = 'block';
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            // Force reflow
            void section.offsetWidth;
            
            // Animate in
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        } else {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            // Hide after animation
            setTimeout(() => {
                section.style.display = 'none';
            }, 300);
        }
    }
    
    // Check URL parameters for direct link to a service category
    function checkUrlForService() {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        
        if (serviceParam) {
            // Find the matching tab
            const matchingTab = document.querySelector(`.service-tab[data-service="${serviceParam}"]`);
            if (matchingTab) {
                // Trigger click on the matching tab
                matchingTab.click();
            }
        }
    }
    
    // Initialize by checking URL params
    checkUrlForService();
}

/**
 * Services FAQ Accordion
 * Manages the expandable FAQ items
 */
function initServicesFAQ() {
    const faqItems = document.querySelectorAll('.services-faq-section .faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
                const faqAnswer = faqItem.querySelector('.faq-answer');
                if (faqAnswer) {
                    faqAnswer.style.maxHeight = '0';
                    faqAnswer.style.opacity = '0';
                }
            });
            
            // If the clicked item wasn't already active, open it
            if (!isActive) {
                item.classList.add('active');
                
                // Get the scrollHeight to properly animate the max-height
                const scrollHeight = answer.scrollHeight;
                answer.style.maxHeight = scrollHeight + 'px';
                answer.style.opacity = '1';
            }
        });
    });
    
    // Open the first FAQ item by default (after a delay)
    setTimeout(() => {
        if (faqItems.length > 0) {
            const firstQuestion = faqItems[0].querySelector('.faq-question');
            if (firstQuestion) {
                firstQuestion.click();
            }
        }
    }, 500);
}

/**
 * Service Animations on Scroll
 * Adds animation effects when elements come into view
 */
function initServiceAnimations() {
    // Get all elements with animation attributes
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    if (!animatedElements.length) return;
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation class
                element.classList.add('animated');
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.2,  // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -10% 0px'  // Adjust the trigger area
    });
    
    // Observe each animated element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Special animations for process steps
    const processSteps = document.querySelectorAll('.process-step');
    if (processSteps.length) {
        processSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            step.style.transitionDelay = `${index * 0.15}s`;  // Staggered delay
        });
        
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    processObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });
        
        processSteps.forEach(step => {
            processObserver.observe(step);
        });
    }
}

/**
 * Service Image Effects
 * Adds interactive effects to the service images
 */
function initServiceImageEffects() {
    // Get all service image containers
    const imageContainers = document.querySelectorAll('.floating-image-container');
    
    if (!imageContainers.length) return;
    
    // Add parallax effect on mouse movement
    imageContainers.forEach(container => {
        const mainImage = container.querySelector('.main-image');
        const floatImages = container.querySelectorAll('.float-image');
        
        container.addEventListener('mousemove', (e) => {
            // Only apply effect if window width is larger than 768px
            if (window.innerWidth > 768) {
                const containerRect = container.getBoundingClientRect();
                
                // Calculate mouse position relative to container
                const mouseX = e.clientX - containerRect.left;
                const mouseY = e.clientY - containerRect.top;
                
                // Calculate percentage position (-0.5 to 0.5 range)
                const xPercent = (mouseX / containerRect.width - 0.5) * 2;
                const yPercent = (mouseY / containerRect.height - 0.5) * 2;
                
                // Apply subtle movement to main image
                if (mainImage) {
                    mainImage.style.transform = `scale(1.03) translate(${xPercent * -5}px, ${yPercent * -5}px)`;
                }
                
                // Apply more pronounced movement to floating images
                floatImages.forEach((img, index) => {
                    const multiplier = index === 0 ? 1 : -1;
                    img.style.transform = `translate(${xPercent * 10 * multiplier}px, ${yPercent * 10 * multiplier}px) rotate(${xPercent * 5 * multiplier}deg)`;
                });
            }
        });
        
        // Reset on mouse leave
        container.addEventListener('mouseleave', () => {
            if (mainImage) {
                mainImage.style.transform = 'scale(1)';
            }
            
            floatImages.forEach(img => {
                img.style.transform = '';
            });
        });
    });
    
    // Add reveal animation when image containers come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const mainImage = container.querySelector('.main-image');
                const floatImages = container.querySelectorAll('.float-image');
                
                // Animate main image
                if (mainImage) {
                    mainImage.style.opacity = '0';
                    mainImage.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        mainImage.style.opacity = '1';
                        mainImage.style.transform = 'scale(1)';
                        mainImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    }, 100);
                }
                
                // Animate floating images with staggered delay
                floatImages.forEach((img, index) => {
                    img.style.opacity = '0';
                    img.style.transform = 'scale(0.8) translateY(20px)';
                    
                    setTimeout(() => {
                        img.style.opacity = '1';
                        img.style.transform = '';
                        img.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    }, 400 + (index * 200));
                });
                
                observer.unobserve(container);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });
    
    imageContainers.forEach(container => {
        observer.observe(container);
    });
}

/**
 * Smooth Scroll for Service Links
 * Ensures smooth scrolling for all internal links
 */
function initSmoothScrolling() {
    document.addEventListener('click', function(e) {
        // Find closest link or button element
        const target = e.target.closest('a, button');
        
        if (target && target.getAttribute('href') && target.getAttribute('href').startsWith('#')) {
            // Get the target element
            const targetId = target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset (accounting for sticky header and nav)
                const headerHeight = document.querySelector('.header').offsetHeight;
                const navHeight = document.querySelector('.services-nav-section')?.offsetHeight || 0;
                const offset = headerHeight + navHeight;
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        }
    });
}

/**
 * Enhanced Animations with GSAP (if available)
 * Uses GSAP for more advanced animations if the library is loaded
 */
window.addEventListener('load', function() {
    if (window.gsap && window.ScrollTrigger) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Enhance service content animations with GSAP
        document.querySelectorAll('.service-detail-content').forEach(content => {
            gsap.from(content, {
                opacity: 0,
                x: content.closest('.reverse') ? 50 : -50,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: content,
                    start: "top 75%",
                    toggleActions: "play none none none"
                }
            });
        });
        
        // Enhance service image animations with GSAP
        document.querySelectorAll('.service-detail-image').forEach(image => {
            gsap.from(image, {
                opacity: 0,
                x: image.closest('.reverse') ? -50 : 50,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: image,
                    start: "top 75%",
                    toggleActions: "play none none none"
                }
            });
        });
        
        // Process steps animation
        gsap.from('.process-step', {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.process-timeline',
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });
        
        // Hero section parallax effect
        gsap.to('.services-hero-shape', {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: '.services-hero',
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }
});
