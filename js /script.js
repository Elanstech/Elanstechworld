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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Slideshow functionality
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Debug: Log all slide background images
    slides.forEach((slide, index) => {
        console.log(`Slide ${index + 1} background:`, slide.style.backgroundImage);
        
        // Ensure slide has proper styling
        slide.style.opacity = index === 0 ? '1' : '0';
        
        // Test image loading
        const bgImage = slide.style.backgroundImage;
        const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
        
        const img = new Image();
        img.onload = () => {
            console.log(`✓ Slide ${index + 1} image loaded:`, imageUrl);
        };
        img.onerror = () => {
            console.error(`✗ Slide ${index + 1} image failed:`, imageUrl);
        };
        img.src = imageUrl;
    });

    function nextSlide() {
        // Fade out current slide
        slides[currentSlide].style.opacity = '0';
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Fade in next slide
        slides[currentSlide].style.opacity = '1';
        
        console.log(`Transitioning to slide ${currentSlide + 1}`);
    }
    
    if (slides.length > 1) {
        // Start the slideshow
        setInterval(nextSlide, 5000);
    }

    // Initialize particles.js
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

    // Image path testing function
    function testImagePaths() {
        const testPaths = [
            '/assets/images/Mainbackround.jpg',
            '/assets/images/backroundcity.jpeg',
            '/assets/images/backround3.jpeg'
        ];

        testPaths.forEach(path => {
            const img = new Image();
            img.onload = () => console.log('✓ Image exists:', path);
            img.onerror = () => console.log('✗ Image missing:', path);
            img.src = path;
        });
    }

    // Run image path test
    testImagePaths();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
