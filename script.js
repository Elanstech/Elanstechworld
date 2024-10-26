<script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
    <script>
        AOS.init({ duration: 1000, once: true });

        // JavaScript for Dynamic Slide Transitions
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        const exploreButton = document.querySelector('.explore-btn');

        const slideData = [
            {
                image: "https://github.com/Elanstech/Elanstechworld/blob/main/parallexbackround3.0.jpg?raw=true",
                title: "Welcome To Elan's Tech World",
                description: "Empowering your people with cutting-edge technology solutions.",
                buttonLink: "#services",
                buttonText: "View Our Services →"
            },
            {
                image: "https://github.com/Elanstech/Elanstechworld/blob/main/backround33.jpeg?raw=true",
                title: "Innovative Tech Solutions",
                description: "Delivering personalized technology strategies for your business.",
                buttonLink: "#about",
                buttonText: "Learn About Us →"
            }
        ];

        function showNextSlide() {
            // Update the slide background image
            slides[0].style.backgroundImage = `url(${slideData[currentSlide].image})`;

            // Update the overlay content
            heroTitle.textContent = slideData[currentSlide].title;
            heroDescription.textContent = slideData[currentSlide].description;
            exploreButton.setAttribute('href', slideData[currentSlide].buttonLink);
            exploreButton.textContent = slideData[currentSlide].buttonText;

            // Increment the slide index or reset to zero if at the end
            currentSlide = (currentSlide + 1) % slideData.length;
        }

        // Set an interval to change the slides every 5 seconds
        setInterval(showNextSlide, 5000);

        // Initial call to set up the first slide
        showNextSlide();

        // Hamburger Menu Script
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');

        hamburger.addEventListener('click', function () {
            mobileNav.classList.toggle('active');
            const links = mobileNav.querySelectorAll('li');
            links.forEach((link, index) => {
                if (mobileNav.classList.contains('active')) {
                    link.style.transitionDelay = `${index * 100}ms`;
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                } else {
                    link.style.opacity = '0';
                    link.style.transform = 'translateY(-10px)';
                }
            });
        });

        // Particles.js Initialization
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 100,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5 },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 6 }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "repulse" },
                    "onclick": { "enable": true, "mode": "push" }
                }
            },
            "retina_detect": true
        });
    </script>
</body>
