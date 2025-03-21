/**
 * Elan's Tech World - Services Page JavaScript
 * Handles services-specific functionality including tabs, animations, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for main script to load and remove preload class
    setTimeout(() => {
        initServicesPage();
    }, 300);
});

/**
 * Initialize all services page functionality
 */
function initServicesPage() {
    // First ensure all service sections are visible
    document.querySelectorAll('.service-detail-section').forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });
    
    // Initialize components
    initServicesTabs();
    initServicesNavigation();
    initFaqAccordion();
    initAnimations();
    initFloatingImages();
    updateActiveTabIndicator();
    
    // Add event listener for window load to ensure all elements are properly displayed
    window.addEventListener('load', () => {
        // Force display of all sections after complete page load
        document.querySelectorAll('.service-detail-section').forEach(section => {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        });
        
        // Reinitialize animations
        document.querySelectorAll('[data-animation]').forEach(element => {
            const animation = element.getAttribute('data-animation');
            element.classList.add('animated');
            element.classList.add(animation);
        });
    });
}

/**
 * Services Tabs Functionality
 * Manages tab switching and content filtering
 */
function initServicesTabs() {
    const serviceTabs = document.querySelectorAll('.service-tab');
    const serviceDetailSections = document.querySelectorAll('.service-detail-section');
    
    // First make sure all service sections are visible initially
    serviceDetailSections.forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });
    
    serviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            serviceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const serviceType = tab.getAttribute('data-service');
            
            // Filter sections based on service type
            if (serviceType === 'all') {
                serviceDetailSections.forEach(section => {
                    section.style.display = 'block';
                    section.style.visibility = 'visible';
                    section.style.opacity = '1';
                    // Reset animations
                    resetSectionAnimations(section);
                });
            } else {
                serviceDetailSections.forEach(section => {
                    const sectionType = section.getAttribute('data-service');
                    if (sectionType === serviceType) {
                        section.style.display = 'block';
                        section.style.visibility = 'visible';
                        section.style.opacity = '1';
                        // Reset animations
                        resetSectionAnimations(section);
                    } else {
                        section.style.display = 'none';
                    }
                });
            }
            
            // Update tab indicator position
            updateActiveTabIndicator();
            
            // Smooth scroll to services-nav
            const servicesNavOffset = document.getElementById('services-nav').offsetTop;
            window.scrollTo({
                top: servicesNavOffset - 80, // Adjust for header height
                behavior: 'smooth'
            });
        });
    });
    
    // Ensure "all" tab is active on load
    const allTab = document.querySelector('.service-tab[data-service="all"]');
    if (allTab) {
        allTab.classList.add('active');
        updateActiveTabIndicator();
    }
}

/**
 * Reset animations for service section
 */
function resetSectionAnimations(section) {
    // Find elements with data-animation
    const animatedElements = section.querySelectorAll('[data-animation]');
    
    animatedElements.forEach(element => {
        const animation = element.getAttribute('data-animation');
        
        // Reset animation by removing and re-adding the class
        element.classList.remove('animated');
        element.classList.remove(animation);
        
        // Force reflow to restart animation
        void element.offsetWidth;
        
        // Re-add animation class
        setTimeout(() => {
            element.classList.add('animated');
            element.classList.add(animation);
        }, 50);
    });
}

/**
 * Update Tab Indicator Position
 * Positions the indicator under the active tab
 */
function updateActiveTabIndicator() {
    const activeTab = document.querySelector('.service-tab.active');
    const tabIndicator = document.querySelector('.tab-indicator');
    
    if (activeTab && tabIndicator) {
        const tabWidth = activeTab.offsetWidth;
        const tabLeft = activeTab.offsetLeft;
        
        tabIndicator.style.width = `${tabWidth}px`;
        tabIndicator.style.left = `${tabLeft}px`;
    }
}

/**
 * Services Navigation
 * Handles sticky behavior and scroll hiding
 */
function initServicesNavigation() {
    const servicesNav = document.querySelector('.services-nav-section');
    let lastScrollTop = 0;
    
    if (!servicesNav) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        // Add or remove sticky class based on position
        if (scrollTop > 300) {
            // Hide nav when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop) {
                servicesNav.classList.add('services-nav-hidden');
            } else {
                servicesNav.classList.remove('services-nav-hidden');
            }
        } else {
            servicesNav.classList.remove('services-nav-hidden');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Handle horizontal scrolling for tabs on mobile
    const tabsWrapper = document.querySelector('.services-tabs-wrapper');
    const tabs = document.querySelector('.services-tabs');
    
    if (tabsWrapper && tabs) {
        tabs.addEventListener('scroll', () => {
            updateActiveTabIndicator();
        });
        
        // Update indicator on resize
        window.addEventListener('resize', () => {
            updateActiveTabIndicator();
        });
    }
}

/**
 * FAQ Accordion Functionality
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Toggle active class
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Open first FAQ item by default
    if (faqItems.length > 0) {
        setTimeout(() => {
            faqItems[0].classList.add('active');
        }, 500);
    }
}

/**
 * Initialize Animations
 * Manages on-scroll and general animations
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    // Make sure all service sections are visible first
    document.querySelectorAll('.service-detail-section').forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });
    
    // Initialize Intersection Observer for animations with more sensitive threshold
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.getAttribute('data-animation');
                
                // Make sure element is visible
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                
                // Add animation classes
                element.classList.add('animated');
                element.classList.add(animation);
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, { 
        threshold: 0.01, // More sensitive threshold
        rootMargin: "0px 0px 100px 0px" // Trigger before element comes into view
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        // First ensure the element is visible
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        
        // Then observe for animation
        observer.observe(element);
    });
    
    // GSAP animations if available
    if (window.gsap) {
        initGsapAnimations();
    }
    
    // Fallback in case observer fails
    setTimeout(() => {
        document.querySelectorAll('[data-animation]').forEach(element => {
            if (!element.classList.contains('animated')) {
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                
                const animation = element.getAttribute('data-animation');
                element.classList.add('animated');
                element.classList.add(animation);
            }
        });
    }, 1000);
}

/**
 * Initialize GSAP Animations
 * Enhanced animations using GSAP if available
 */
function initGsapAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    // Hero section animations
    gsap.from('.services-hero-badge', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.services-hero-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    gsap.from('.services-hero-description', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out'
    });
    
    gsap.from('.services-hero-cta', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
    });
    
    // Service detail sections
    document.querySelectorAll('.service-detail-section').forEach((section) => {
        // Content animations
        gsap.from(section.querySelector('.service-detail-content'), {
            opacity: 0,
            x: section.querySelector('.service-detail-layout').classList.contains('reverse') ? 50 : -50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
        
        // Image animations
        gsap.from(section.querySelector('.service-detail-image'), {
            opacity: 0,
            x: section.querySelector('.service-detail-layout').classList.contains('reverse') ? -50 : 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    // Process steps
    gsap.utils.toArray('.process-step').forEach((step, i) => {
        gsap.from(step, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
}

/**
 * Initialize Floating Images
 * Handles the floating animation effects for service images
 */
function initFloatingImages() {
    const floatImages = document.querySelectorAll('.float-image');
    
    floatImages.forEach(image => {
        // Add random starting delay to create more natural effect
        const randomDelay = Math.random() * 2;
        image.style.animationDelay = `${randomDelay}s`;
    });
    
    // Add 3D tilt effect if VanillaTilt is available
    if (window.VanillaTilt) {
        initTiltEffect();
    }
}

/**
 * Initialize Tilt Effect
 * Adds subtle 3D tilt to image containers
 */
function initTiltEffect() {
    const imageContainers = document.querySelectorAll('.floating-image-container');
    
    VanillaTilt.init(imageContainers, {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
        scale: 1.05,
        perspective: 1000
    });
}

/**
 * Check for section in view and update navigation
 */
function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop - 200 && window.scrollY < sectionTop + sectionHeight - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Global handlers for the floating action button
window.addEventListener('scroll', () => {
    const floatingButton = document.querySelector('.floating-action-button');
    if (floatingButton) {
        if (window.scrollY > 500) {
            floatingButton.style.display = 'block';
        } else {
            floatingButton.style.display = 'none';
        }
    }
});
