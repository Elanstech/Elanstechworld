// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

// Close mobile menu when clicking links
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});

// Slideshow functionality with debug
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Debug: Log number of slides found
    console.log(`Found ${slides.length} slides`);
    
    // Verify image loading for each slide
    slides.forEach((slide, index) => {
        const bgImage = slide.style.backgroundImage;
        const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
        
        // Create a temporary image to test loading
        const img = new Image();
        img.onload = () => {
            console.log(`Slide ${index + 1} image loaded successfully:`, imageUrl);
        };
        img.onerror = () => {
            console.error(`Failed to load slide ${index + 1} image:`, imageUrl);
            // Fallback background color if image fails to load
            slide.style.backgroundColor = '#0b1f3f';
        };
        img.src = imageUrl;
    });

    // Ensure first slide is active on page load
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
    
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
        
        // Debug: Log slide change
        console.log(`Switched to slide ${currentSlide + 1}`);
    }
    
    // Change slide every 5 seconds
    const slideInterval = setInterval(nextSlide, 5000);
    
    // Clear interval if slides are not found
    if (slides.length === 0) {
        console.error('No slides found in the slideshow');
        clearInterval(slideInterval);
    }
});

// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: {
                value: 0.3,
                random: false
            },
            size: {
                value: 3,
                random: true
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
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
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
});
