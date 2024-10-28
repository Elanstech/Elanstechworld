// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('nav-open');

        // Animate hamburger
        const bars = hamburger.querySelectorAll('div');
        if (hamburger.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && 
            !e.target.closest('.mobile-nav') && 
            !e.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });

    // Typing Animation
    const typingText = document.querySelector('.typing-animation');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        typeWriter();
    }



// Particles Effect continued
    const particlesContainer = document.querySelector('.hero-particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Service Cards Hover Effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-10px)';
        });
    });

    // Preview Button Click Handlers
    const previewButtons = document.querySelectorAll('.preview-btn');
    previewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const serviceId = button.getAttribute('data-service');
            showServicePreview(serviceId);
        });
    });

    function showServicePreview(serviceId) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'service-preview-modal';
        
        // Get service content
        const content = getServiceContent(serviceId);
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <h3>${content.title}</h3>
                <div class="preview-content">
                    <div class="preview-features">
                        <h4>Features:</h4>
                        <ul>
                            ${content.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="preview-pricing">
                        <h4>Pricing:</h4>
                        <p>${content.pricing}</p>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);

        // Show modal with animation
        setTimeout(() => modal.classList.add('active'), 10);

        // Close button handler
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    function getServiceContent(serviceId) {
        const content = {
            'business-setup': {
                title: 'Business Computer Setup',
                features: [
                    'Complete hardware configuration',
                    'Software installation and setup',
                    'Network configuration',
                    'Data migration and backup',
                    'Employee training'
                ],
                pricing: 'Starting from $499'
            },
            'web-design': {
                title: 'Custom Web Design',
                features: [
                    'Responsive design',
                    'SEO optimization',
                    'Content management system',
                    'E-commerce integration',
                    'Analytics setup'
                ],
                pricing: 'Starting from $999'
            },
            'pos-system': {
                title: 'POS System Setup',
                features: [
                    'Hardware installation',
                    'Software configuration',
                    'Inventory management setup',
                    'Staff training',
                    'Ongoing support'
                ],
                pricing: 'Starting from $799'
            },
            'apple-sales': {
                title: 'Apple Product Sales',
                features: [
                    'Latest iPhone models',
                    'MacBooks and iPads',
                    'Genuine accessories',
                    'Warranty service',
                    'Setup assistance'
                ],
                pricing: 'Retail pricing with business discounts available'
            }
        };

        return content[serviceId] || {
            title: 'Service Preview',
            features: ['Feature not available'],
            pricing: 'Contact for pricing'
        };
    }

    // Scroll Animation
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Add particle animation styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(249, 194, 0, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float linear infinite;
        }

        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100vh) translateX(100px);
                opacity: 0;
            }
        }

        .service-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(11, 31, 63, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .service-preview-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            position: relative;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }

        .service-preview-modal.active .modal-content {
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);
});
