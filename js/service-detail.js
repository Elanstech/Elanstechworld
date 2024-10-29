// service-detail.js

document.addEventListener('DOMContentLoaded', () => {
    initializeServicePage();
});

function initializeServicePage() {
    initAnimations();
    initPricingToggles();
    initContactForm();
    initScrollEffects();
}

function initAnimations() {
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.2 });

    animatedElements.forEach(element => observer.observe(element));
}

function initPricingToggles() {
    const toggles = document.querySelectorAll('.pricing-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const container = toggle.closest('.pricing-section');
            const monthly = container.querySelectorAll('.price-monthly');
            const yearly = container.querySelectorAll('.price-yearly');
            
            if (e.target.checked) {
                monthly.forEach(el => el.style.display = 'none');
                yearly.forEach(el => el.style.display = 'block');
            } else {
                monthly.forEach(el => el.style.display = 'block');
                yearly.forEach(el => el.style.display = 'none');
            }
        });
    });
}

function initContactForm() {
    const forms = document.querySelectorAll('.contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Replace with your actual endpoint
                const response = await fetch('/api/service-inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showNotification('success', 'Message sent successfully!');
                    form.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                showNotification('error', 'Failed to send message. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    });
}

function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        if (currentScroll > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
