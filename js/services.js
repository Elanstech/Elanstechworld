     // main.js content directly embedded for simplicity
        document.addEventListener('DOMContentLoaded', () => {
            initHeader();
            initMobileMenu();
            initHeroAnimation();
            initParticles();
        });

        // Header Scroll Effect
        function initHeader() {
            const header = document.querySelector('.header');
            let lastScroll = 0;

            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > lastScroll && currentScroll > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                lastScroll = currentScroll;
            });
        }

        // Mobile Menu
        function initMobileMenu() {
            const hamburger = document.querySelector('.hamburger');
            const mobileNav = document.querySelector('.mobile-nav');
            const mobileLinks = document.querySelectorAll('.mobile-nav a');

            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            });

            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close mobile menu on outside click
            document.addEventListener('click', (e) => {
                if (mobileNav.classList.contains('active') && 
                    !mobileNav.contains(e.target) && 
                    !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Hero Text Animation
        function initHeroAnimation() {
            const text = "Technology Solutions";
            const typingText = document.querySelector('.typing-text');
            let charIndex = 0;

            function type() {
                if (charIndex < text.length) {
                    typingText.textContent += text.charAt(charIndex);
                    charIndex++;
                    setTimeout(type, 100);
                } else {
                    // Wait and then restart
                    setTimeout(() => {
                        typingText.textContent = '';
                        charIndex = 0;
                        type();
                    }, 3000);
                }
            }

            type();

            // Animate hero content using GSAP
            gsap.from('.hero-content', {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }

        // Particle System
        function initParticles() {
            const container = document.querySelector('.particle-container');
            const particleCount = window.innerWidth < 768 ? 30 : 50;

            function createParticle() {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const size = Math.random() * 4 + 2;
                const duration = Math.random() * 3 + 2;
                const delay = Math.random() * 2;
                
                Object.assign(particle.style, {
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.3,
                    animation: `float ${duration}s ease-in-out infinite ${delay}s`
                });
                
                container.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                    if (container.children.length < particleCount) {
                        createParticle();
                    }
                }, duration * 1000);
            }

            for (let i = 0; i < particleCount; i++) {
                createParticle();
            }
        }

        // Smooth Scroll for Navigation Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const hamburger = document.querySelector('.hamburger');
            const mobileNav = document.querySelector('.mobile-nav');
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
