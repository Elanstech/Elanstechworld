/**
 * Elan's Tech World - About Page JavaScript
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing effect in hero section
    initHeroTyping();
    
    // Initialize timeline animation
    initTimelineAnimation();
    
    // Initialize skill bars animation
    initSkillBars();
    
    // Initialize workspace gallery
    initWorkspaceGallery();
    
    // Initialize team cards hover effects
    initTeamCards();
    
    // Initialize AOS animation library if available
    initAOS();
});

/**
 * Initialize Hero Typing Effect
 */
function initHeroTyping() {
    const typingElement = document.getElementById('typing-text');
    const typingCursor = document.querySelector('.typing-cursor');
    
    if (!typingElement) return;
    
    // Words to type
    const words = [
        "Innovators", 
        "Designers", 
        "Problem Solvers", 
        "Technology Partners", 
        "Digital Craftsmen"
    ];
    
    // Check if Typed.js is available
    if (typeof Typed !== 'undefined') {
        new Typed('#typing-text', {
            strings: words,
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 1500,
            startDelay: 1000,
            loop: true,
            showCursor: false
        });
    } else {
        // Fallback typing effect if Typed.js is not available
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingDelay = 70;
        
        function type() {
            const currentWord = words[currentWordIndex];
            
            if (isDeleting) {
                // Deleting characters
                typingElement.textContent = currentWord.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingDelay = 40;
            } else {
                // Typing characters
                typingElement.textContent = currentWord.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingDelay = 70;
            }
            
            // Check if word is complete
            if (!isDeleting && currentCharIndex === currentWord.length) {
                // Complete word - pause before deleting
                isDeleting = true;
                typingDelay = 1500;
            } else if (isDeleting && currentCharIndex === 0) {
                // Word deleted - move to next word
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                typingDelay = 500;
            }
            
            // Continue typing loop
            setTimeout(type, typingDelay);
        }
        
        // Start typing
        setTimeout(type, 1000);
    }
}

/**
 * Initialize Timeline Animation
 */
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    
    if (!timelineItems.length) return;
    
    // Set up intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate timeline progress based on visible items
                if (timelineProgress) {
                    const visibleItems = document.querySelectorAll('.timeline-item.animate').length;
                    const progressPercentage = (visibleItems / timelineItems.length) * 100;
                    
                    timelineProgress.style.height = `${progressPercentage}%`;
                }
            }
        });
    }, { threshold: 0.3 });
    
    // Observe each timeline item
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .timeline-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .timeline-progress {
            transition: height 1.5s ease-out;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize Skill Bars Animation
 */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    
    if (!skillBars.length) return;
    
    // Set up intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.width || '0%';
                
                // Add small delay before animation
                setTimeout(() => {
                    bar.style.width = width;
                }, 300);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    
    // Observe each skill bar
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

/**
 * Initialize Workspace Gallery
 */
function initWorkspaceGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!galleryItems.length) return;
    
    galleryItems.forEach(item => {
        // Handle hover effect for touch devices
        item.addEventListener('touchstart', function() {
            this.classList.add('touch-hover');
        }, { passive: true });
        
        // Remove hover effect on touch end
        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-hover');
            }, 500);
        }, { passive: true });
    });
    
    // Add staggered animation for gallery items
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
                
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    galleryItems.forEach(item => {
        galleryObserver.observe(item);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .gallery-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .gallery-item.touch-hover .gallery-overlay {
            opacity: 1;
        }
        
        .gallery-item.touch-hover .gallery-caption {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize Team Cards Animations
 */
function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    if (!teamCards.length) return;
    
    // Set up intersection observer for staggered animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200); // Slightly longer delay for better effect with fewer cards
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observe each team card
    teamCards.forEach(card => {
        observer.observe(card);
    });
    
    // Center the team grid when only 2 members
    if (teamCards.length === 2) {
        const teamGrid = document.querySelector('.team-grid');
        if (teamGrid) {
            teamGrid.classList.add('two-members');
        }
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .team-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .team-card.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Styling for two team members */
        .team-grid.two-members {
            grid-template-columns: repeat(2, minmax(300px, 1fr));
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            gap: 3rem;
        }
        
        @media (max-width: 767px) {
            .team-grid.two-members {
                grid-template-columns: 1fr;
                max-width: 400px;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize Value Cards Animations
 */
function initValueCards() {
    const valueCards = document.querySelectorAll('.value-card');
    
    if (!valueCards.length) return;
    
    // Set up intersection observer for staggered animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observe each value card
    valueCards.forEach(card => {
        observer.observe(card);
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .value-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .value-card.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Call to init value cards
    initValueCards();
}

/**
 * Initialize AOS Animation Library
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 100
        });
    } else {
        // Initialize elements with data-aos attribute manually
        const aosElements = document.querySelectorAll('[data-aos]');
        
        if (!aosElements.length) return;
        
        // Set up intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.getAttribute('data-aos') || 'fade-up';
                    const delay = element.getAttribute('data-aos-delay') || 0;
                    
                    setTimeout(() => {
                        element.classList.add('aos-animate');
                    }, delay);
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });
        
        // Add base styles for AOS animations
        const style = document.createElement('style');
        style.textContent = `
            [data-aos] {
                opacity: 0;
                transition-property: opacity, transform;
                transition-duration: 0.8s;
                transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
            }
            
            [data-aos="fade-up"] {
                transform: translateY(30px);
            }
            
            [data-aos="fade-down"] {
                transform: translateY(-30px);
            }
            
            [data-aos="fade-left"] {
                transform: translateX(30px);
            }
            
            [data-aos="fade-right"] {
                transform: translateX(-30px);
            }
            
            [data-aos="zoom-in"] {
                transform: scale(0.9);
            }
            
            .aos-animate {
                opacity: 1;
                transform: translateY(0) translateX(0) scale(1);
            }
        `;
        document.head.appendChild(style);
        
        // Observe each element
        aosElements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Initialize animated background particles for the hero section
 */
function initParticlesBackground() {
    const particlesContainer = document.getElementById('particles-js');
    
    if (!particlesContainer) return;
    
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 50,
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
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
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
                            "opacity": 1
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
    } else {
        // Fallback for when particles.js is not available
        createFallbackParticles(particlesContainer);
    }
}

/**
 * Create fallback particles when particles.js library is not available
 */
function createFallbackParticles(container) {
    if (!container) return;
    
    // Set container style
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'hidden';
    
    // Generate particles
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 5px
        const size = Math.random() * 3 + 2;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Set particle styles
        particle.style.position = 'absolute';
        particle.style.top = `${posY}%`;
        particle.style.left = `${posX}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = '#ffffff';
        particle.style.borderRadius = '50%';
        particle.style.opacity = opacity;
        
        // Set animation
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.animation = `floatParticle ${duration}s ${delay}s infinite ease-in-out alternate`;
        
        // Add particle to container
        container.appendChild(particle);
    }
    
    // Add keyframes for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0);
            }
            100% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Call to initialize particles
initParticlesBackground();
