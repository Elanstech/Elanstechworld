// Initialize AOS (Animate on Scroll)
AOS.init({ 
    duration: 1000, 
    once: true,
    disable: window.innerWidth < 768 // Disable on mobile for better performance
});

// Header Scroll Effect
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Hero Background Slideshow
document.addEventListener('DOMContentLoaded', function() {
    const heroBackgrounds = document.querySelectorAll('.hero-bg');
    let currentBg = 0;
    
    // Show first background immediately
    heroBackgrounds[0].classList.add('active');
    
    function nextBackground() {
        // Remove active class from current background
        heroBackgrounds[currentBg].classList.remove('active');
        
        // Move to next background
        currentBg = (currentBg + 1) % heroBackgrounds.length;
        
        // Add active class to new background
        heroBackgrounds[currentBg].classList.add('active');
    }
    
    // Change background every 6 seconds
    setInterval(nextBackground, 6000);
});

// Mobile-optimized Particles.js Configuration
particlesJS("particles-js", {
    particles: {
        number: {
            value: window.innerWidth < 768 ? 40 : 80, // Reduce particles on mobile
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: { 
            value: "#ffffff" 
        },
        shape: { 
            type: "circle" 
        },
        opacity: {
            value: 0.3,
            random: false,
            anim: { enable: false }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: false }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: window.innerWidth < 768 ? 2 : 3, // Slower on mobile
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: window.innerWidth > 768, // Disable hover effect on mobile
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        }
    },
    retina_detect: true
});

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const body = document.body;

// Hamburger Menu Click Handler
hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMobileMenu();
});

// Close mobile menu when clicking on a link
const mobileNavLinks = mobileNav.getElementsByTagName('a');
for (const link of mobileNavLinks) {
    link.addEventListener('click', function() {
        closeMobileMenu();
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    if (!hamburger.contains(event.target) && 
        !mobileNav.contains(event.target) && 
        mobileNav.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Prevent menu close when clicking inside mobile nav
mobileNav.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Helper functions for mobile menu
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.classList.toggle('menu-open');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    body.classList.remove('menu-open');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
