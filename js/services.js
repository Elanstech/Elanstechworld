/**
 * Elan's Tech World - Enhanced Services Page JavaScript
 * Mobile-optimized functionality with improved animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a brief delay to ensure DOM is fully rendered
    setTimeout(() => {
        initServicesPage();
    }, 300);
});

/**
 * Initialize all services page functionality
 */
function initServicesPage() {
    // First make sure all service sections are visible initially
    document.querySelectorAll('.service-detail-section').forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });
    
    // Initialize components
    initServicesTabs();
    initScrollAnimations();
    initFloatingImages();
    updateActiveTabIndicator();
    initServicesStickyNav();
    
    // Add event listener for window load to ensure all elements load correctly
    window.addEventListener('load', () => {
        // Force display of all sections after complete page load
        document.querySelectorAll('.service-detail-section').forEach(section => {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        });
        
        // Reinitialize animations
        document.querySelectorAll('[data-animation]').forEach(element => {
            element.classList.add('animated');
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
                    
                    // Use setTimeout to ensure display block takes effect before animating
                    setTimeout(() => {
                        section.style.visibility = 'visible';
                        section.style.opacity = '1';
                        
                        // Reset animations
                        resetSectionAnimations(section);
                    }, 50);
                });
            } else {
                serviceDetailSections.forEach(section => {
                    const sectionType = section.getAttribute('data-service');
                    
                    if (sectionType === serviceType) {
                        section.style.display = 'block';
                        
                        // Use setTimeout to ensure display block takes effect before animating
                        setTimeout(() => {
                            section.style.visibility = 'visible';
                            section.style.opacity = '1';
                            
                            // Reset animations
                            resetSectionAnimations(section);
                        }, 50);
                    } else {
                        // Fade out then hide
                        section.style.opacity = '0';
                        section.style.visibility = 'hidden';
                        
                        // Use setTimeout to let fade out animation complete before hiding
                        setTimeout(() => {
                            section.style.display = 'none';
                        }, 300);
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
        
        // Force reflow to restart animation
        void element.offsetWidth;
        
        // Re-add animation class
        setTimeout(() => {
            element.classList.add('animated');
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
 * Services Navigation - Sticky and Scroll Behavior
 */
function initServicesStickyNav() {
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
    const tabsContainer = document.querySelector('.services-tabs-container');
    const tabs = document.querySelector('.services-tabs');
    
    if (tabsContainer && tabs) {
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
 * Initialize Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    // Initialize Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation classes
                element.classList.add('animated');
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: "0px 0px 50px 0px" // Trigger before element comes into view
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // GSAP animations if available
    if (window.gsap) {
        initGsapAnimations();
    }
}

/**
 * Initialize GSAP Animations if GSAP is available
 */
function initGsapAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
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
}

/**
 * Initialize Floating Images with 3D Effects
 */
function initFloatingImages() {
    // Add 3D tilt effect if VanillaTilt is available
    if (window.VanillaTilt) {
        initTiltEffect();
    }
    
    // Add parallax effect to floating images
    const floatImages = document.querySelectorAll('.float-image');
    
    floatImages.forEach(image => {
        // Add random starting delay to create more natural effect
        const randomDelay = Math.random() * 2;
        image.style.animationDelay = `${randomDelay}s`;
    });
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
        perspective: 1000,
        gyroscope: true
    });
}

/**
 * Smooth scroll to anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Adjust offset for header height
                const headerHeight = document.querySelector('.header').offsetHeight;
                const navHeight = document.querySelector('.services-nav-section')?.offsetHeight || 0;
                const offset = headerHeight + navHeight;
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', initSmoothScroll);

// Show/hide floating action button based on scroll position
window.addEventListener('scroll', () => {
    const floatingButton = document.querySelector('.floating-action-button');
    if (floatingButton) {
        if (window.scrollY > 500) {
            floatingButton.style.display = 'block';
            // Add fade-in animation
            setTimeout(() => {
                floatingButton.style.opacity = '1';
                floatingButton.style.transform = 'translateY(0)';
            }, 50);
        } else {
            floatingButton.style.opacity = '0';
            floatingButton.style.transform = 'translateY(20px)';
            // Remove from DOM after fade-out
            setTimeout(() => {
                floatingButton.style.display = 'none';
            }, 300);
        }
    }
});/**
 * Elan's Tech World - Enhanced Services Page JavaScript
 * Mobile-optimized functionality with improved animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a brief delay to ensure DOM is fully rendered
    setTimeout(() => {
        initServicesPage();
    }, 300);
});

/**
 * Initialize all services page functionality
 */
function initServicesPage() {
    // First make sure all service sections are visible initially
    document.querySelectorAll('.service-detail-section').forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });
    
    // Initialize components
    initServicesTabs();
    initScrollAnimations();
    initFloatingImages();
    updateActiveTabIndicator();
    initServicesStickyNav();
    
    // Add event listener for window load to ensure all elements load correctly
    window.addEventListener('load', () => {
        // Force display of all sections after complete page load
        document.querySelectorAll('.service-detail-section').forEach(section => {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        });
        
        // Reinitialize animations
        document.querySelectorAll('[data-animation]').forEach(element => {
            element.classList.add('animated');
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
                    
                    // Use setTimeout to ensure display block takes effect before animating
                    setTimeout(() => {
                        section.style.visibility = 'visible';
                        section.style.opacity = '1';
                        
                        // Reset animations
                        resetSectionAnimations(section);
                    }, 50);
                });
            } else {
                serviceDetailSections.forEach(section => {
                    const sectionType = section.getAttribute('data-service');
                    
                    if (sectionType === serviceType) {
                        section.style.display = 'block';
                        
                        // Use setTimeout to ensure display block takes effect before animating
                        setTimeout(() => {
                            section.style.visibility = 'visible';
                            section.style.opacity = '1';
                            
                            // Reset animations
                            resetSectionAnimations(section);
                        }, 50);
                    } else {
                        // Fade out then hide
                        section.style.opacity = '0';
                        section.style.visibility = 'hidden';
                        
                        // Use setTimeout to let fade out animation complete before hiding
                        setTimeout(() => {
                            section.style.display = 'none';
                        }, 300);
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
        
        // Force reflow to restart animation
        void element.offsetWidth;
        
        // Re-add animation class
        setTimeout(() => {
            element.classList.add('animated');
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
 * Services Navigation - Sticky and Scroll Behavior
 */
function initServicesStickyNav() {
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
    const tabsContainer = document.querySelector('.services-tabs-container');
    const tabs = document.querySelector('.services-tabs');
    
    if (tabsContainer && tabs) {
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
 * Initialize Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    // Initialize Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animation classes
                element.classList.add('animated');
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: "0px 0px 50px 0px" // Trigger before element comes into view
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // GSAP animations if available
    if (window.gsap) {
        initGsapAnimations();
    }
}

/**
 * Initialize GSAP Animations if GSAP is available
 */
function initGsapAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
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
}

/**
 * Initialize Floating Images with 3D Effects
 */
function initFloatingImages() {
    // Add 3D tilt effect if VanillaTilt is available
    if (window.VanillaTilt) {
        initTiltEffect();
    }
    
    // Add parallax effect to floating images
    const floatImages = document.querySelectorAll('.float-image');
    
    floatImages.forEach(image => {
        // Add random starting delay to create more natural effect
        const randomDelay = Math.random() * 2;
        image.style.animationDelay = `${randomDelay}s`;
    });
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
        perspective: 1000,
        gyroscope: true
    });
}

/**
 * Smooth scroll to anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Adjust offset for header height
                const headerHeight = document.querySelector('.header').offsetHeight;
                const navHeight = document.querySelector('.services-nav-section')?.offsetHeight || 0;
                const offset = headerHeight + navHeight;
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', initSmoothScroll);

// Show/hide floating action button based on scroll position
window.addEventListener('scroll', () => {
    const floatingButton = document.querySelector('.floating-action-button');
    if (floatingButton) {
        if (window.scrollY > 500) {
            floatingButton.style.display = 'block';
            // Add fade-in animation
            setTimeout(() => {
                floatingButton.style.opacity = '1';
                floatingButton.style.transform = 'translateY(0)';
            }, 50);
        } else {
            floatingButton.style.opacity = '0';
            floatingButton.style.transform = 'translateY(20px)';
            // Remove from DOM after fade-out
            setTimeout(() => {
                floatingButton.style.display = 'none';
            }, 300);
        }
    }
});
