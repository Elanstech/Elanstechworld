/**
 * Elan's Tech World - Services Page JavaScript
 * Handles service-specific functionality and interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all services page functionality
    initServicePage();
});

/**
 * Main initialization function for services page
 */
function initServicePage() {
    // Initialize services filtering
    initServicesFilter();
    
    // Initialize service detail modal with improved design
    initServiceDetailModal();
    
    // Initialize case studies slider
    initCaseStudiesSlider();
    
    // Initialize packages tabs
    initPackageTabs();
    
    // Animate service cards when they come into view
    initServiceCardAnimations();
    
    // Initialize animated background elements
    initBackgroundEffects();
}

/**
 * Services Filtering Functionality
 */
function initServicesFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (!filterButtons.length || !serviceCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter service cards
            serviceCards.forEach(card => {
                if (filterValue === 'all') {
                    // Show all cards
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    // Check if card has the selected category
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        // Hide cards that don't match
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

/**
 * Service Detail Modal Functionality with Improved Design
 */
function initServiceDetailModal() {
    const modal = document.getElementById('service-detail-modal');
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.modal-close-btn');
    const overlay = modal.querySelector('.modal-overlay');
    const modalContent = modal.querySelector('.modal-content');
    const serviceLinks = document.querySelectorAll('.js-service-detail-trigger');
    
    // Service detail content mapping with design attributes
    const serviceDetails = {
        'web-design': {
            title: 'Web Design & Development',
            icon: '<i class="fas fa-laptop-code"></i>',
            color: '#007aff',
            gradient: 'linear-gradient(135deg, #007aff, #00c2ff)',
            description: `Our web design and development services create stunning, responsive websites that captivate your audience and drive conversions. We combine creative design with technical expertise to deliver websites that not only look great but also perform exceptionally well.`,
            features: [
                'Custom responsive website design',
                'User experience (UX) optimization',
                'Content management system implementation',
                'E-commerce functionality',
                'SEO-friendly structure',
                'Website maintenance and support',
                'Performance optimization',
                'Security implementation'
            ],
            process: [
                { title: 'Discovery', description: 'We begin by understanding your business goals, target audience, and specific requirements.' },
                { title: 'Planning', description: 'Creating sitemaps, wireframes, and planning the overall structure and content strategy.' },
                { title: 'Design', description: 'Crafting visual mockups that align with your brand identity and user expectations.' },
                { title: 'Development', description: 'Building your website with clean, efficient code and modern technologies.' },
                { title: 'Testing', description: 'Rigorous quality assurance across devices and browsers to ensure flawless functionality.' },
                { title: 'Launch', description: 'Deploying your website with proper setup and configuration.' },
                { title: 'Support', description: 'Ongoing maintenance and updates to keep your website secure and performing optimally.' }
            ],
            caseStudies: [
                { title: 'Iconic Aesthetics', description: 'Custom website with integrated booking system, increasing online appointments by 40%.' },
                { title: 'East Coast Realty', description: 'Property management portal with custom features, improving client satisfaction by 60%.' }
            ]
        },
        'mobile-app': {
            title: 'Mobile App Development',
            icon: '<i class="fas fa-mobile-alt"></i>',
            color: '#ff7a00',
            gradient: 'linear-gradient(135deg, #ff7a00, #ffc200)',
            description: `We create engaging, high-performance mobile applications for iOS and Android platforms that help businesses connect with customers, streamline operations, and drive growth. Our mobile solutions are built with scalability, security, and user experience in mind.`,
            features: [
                'Native iOS app development',
                'Native Android app development',
                'Cross-platform app development',
                'UI/UX design for mobile',
                'App testing and quality assurance',
                'App store submission',
                'Ongoing maintenance and support',
                'Analytics integration'
            ],
            process: [
                { title: 'Concept', description: 'Defining the app concept, features, and target audience.' },
                { title: 'Wireframing', description: 'Creating the app structure and user flow through detailed wireframes.' },
                { title: 'Design', description: 'Designing intuitive interfaces that provide exceptional user experiences.' },
                { title: 'Development', description: 'Building the app with the appropriate technology stack for your needs.' },
                { title: 'Testing', description: 'Comprehensive testing on multiple devices to ensure quality and performance.' },
                { title: 'Deployment', description: 'Launching your app to the appropriate app stores with optimized listings.' },
                { title: 'Maintenance', description: 'Ongoing updates, feature enhancements, and technical support.' }
            ],
            caseStudies: [
                { title: 'S-Cream', description: 'Mobile ordering app with loyalty program, increasing repeat customers by 30%.' },
                { title: 'Iconic Aesthetics', description: 'Appointment booking and service browsing app, improving customer engagement by 45%.' }
            ]
        },
        'pos': {
            title: 'POS System Implementation',
            icon: '<i class="fas fa-store"></i>',
            color: '#7a00ff',
            gradient: 'linear-gradient(135deg, #7a00ff, #c200ff)',
            description: `Our POS system implementation services help businesses streamline sales, inventory management, and customer interactions. We provide end-to-end solutions from hardware selection to staff training, ensuring a seamless transition to a modern point-of-sale ecosystem.`,
            features: [
                'POS hardware selection and setup',
                'Software configuration and customization',
                'Inventory management integration',
                'Payment processing setup',
                'Staff training and documentation',
                'Customer database implementation',
                'Reporting and analytics',
                'Ongoing technical support'
            ],
            process: [
                { title: 'Assessment', description: 'Evaluating your business needs and current systems.' },
                { title: 'Solution Design', description: 'Designing a POS solution tailored to your specific requirements.' },
                { title: 'Hardware Selection', description: 'Choosing the right hardware components for your business environment.' },
                { title: 'Software Setup', description: 'Installing and configuring POS software with your business settings.' },
                { title: 'Integration', description: 'Connecting your POS system with other business tools and platforms.' },
                { title: 'Training', description: 'Comprehensive training for your staff on using the new system.' },
                { title: 'Launch', description: 'Going live with your new POS system with on-site support.' },
                { title: 'Support', description: 'Ongoing maintenance and technical assistance.' }
            ],
            caseStudies: [
                { title: 'S-Cream', description: 'Complete POS solution reducing checkout times by 40% and enabling detailed inventory tracking.' },
                { title: 'Iconic Aesthetics', description: 'Integrated POS and booking system, resulting in 25% revenue growth and streamlined operations.' }
            ]
        },
        'digital-marketing': {
            title: 'Digital Marketing',
            icon: '<i class="fas fa-bullhorn"></i>',
            color: '#00c27a',
            gradient: 'linear-gradient(135deg, #00c27a, #00e988)',
            description: `Our digital marketing services help businesses increase their online visibility, generate qualified leads, and drive conversions. We create data-driven strategies across multiple channels to reach your target audience effectively and deliver measurable results.`,
            features: [
                'Search Engine Optimization (SEO)',
                'Pay-Per-Click (PPC) advertising',
                'Social media marketing',
                'Email marketing campaigns',
                'Content marketing strategy',
                'Conversion rate optimization',
                'Analytics and reporting',
                'Marketing automation'
            ],
            process: [
                { title: 'Research', description: 'Analyzing your industry, competitors, and target audience.' },
                { title: 'Strategy', description: 'Developing a comprehensive marketing strategy aligned with your goals.' },
                { title: 'Implementation', description: 'Executing marketing campaigns across appropriate channels.' },
                { title: 'Optimization', description: 'Continuously refining campaigns based on performance data.' },
                { title: 'Reporting', description: 'Providing detailed reports and insights on campaign performance.' },
                { title: 'Scaling', description: 'Expanding successful campaigns and exploring new opportunities.' }
            ],
            caseStudies: [
                { title: 'East Coast Realty', description: 'SEO and PPC campaign generating 85% more qualified leads at 20% lower cost-per-lead.' },
                { title: 'S-Cream', description: 'Social media strategy increasing brand awareness by 150% and driving 30% of new customers.' }
            ]
        },
        'google-ads': {
            title: 'Google Ads Management',
            icon: '<i class="fab fa-google"></i>',
            color: '#ea4335',
            gradient: 'linear-gradient(135deg, #ea4335, #fbbc05)',
            description: `Our Google Ads management services help businesses maximize their return on investment through strategic campaign planning, expert optimization, and continuous performance analysis. We create targeted campaigns that drive quality traffic and conversions.`,
            features: [
                'Comprehensive account setup',
                'Keyword research and selection',
                'Ad copywriting and testing',
                'Landing page optimization',
                'Bid management and budget allocation',
                'Performance tracking and reporting',
                'Conversion tracking setup',
                'Remarketing campaign implementation'
            ],
            process: [
                { title: 'Analysis', description: 'Analyzing your business, industry, and competitors.' },
                { title: 'Strategy', description: 'Developing a tailored Google Ads strategy.' },
                { title: 'Setup', description: 'Building optimized campaign structures and ads.' },
                { title: 'Launch', description: 'Launching campaigns with careful monitoring.' },
                { title: 'Optimization', description: 'Continuous refinement based on performance data.' },
                { title: 'Scaling', description: 'Expanding successful campaigns for maximum ROI.' },
                { title: 'Reporting', description: 'Regular detailed reports with actionable insights.' }
            ],
            caseStudies: [
                { title: 'Iconic Aesthetics', description: 'Google Ads campaign increasing bookings by 35% with 25% lower acquisition cost.' },
                { title: 'East Coast Realty', description: 'Targeted PPC strategy driving 45% more property inquiries from qualified leads.' }
            ]
        },
        'property-management': {
            title: 'Property Management Systems',
            icon: '<i class="fas fa-building"></i>',
            color: '#4a6da7',
            gradient: 'linear-gradient(135deg, #4a6da7, #8baaf0)',
            description: `Our property management system solutions help real estate companies streamline operations, improve tenant satisfaction, and maximize property performance. We implement comprehensive digital systems that handle everything from listings to maintenance requests.`,
            features: [
                'Property listing management',
                'Tenant portal implementation',
                'Maintenance request system',
                'Rent collection and accounting',
                'Owner portal and reporting',
                'Document management',
                'Communication tools',
                'Integration with financial systems'
            ],
            process: [
                { title: 'Assessment', description: 'Evaluating your current processes and requirements.' },
                { title: 'Solution Design', description: 'Designing a tailored property management system.' },
                { title: 'Development', description: 'Building custom features and integrations as needed.' },
                { title: 'Data Migration', description: 'Securely transferring existing property and tenant data.' },
                { title: 'Testing', description: 'Comprehensive testing of all system components.' },
                { title: 'Training', description: 'Staff training on the new system.' },
                { title: 'Launch', description: 'System deployment with ongoing support.' },
                { title: 'Optimization', description: 'Continuous improvement based on user feedback.' }
            ],
            caseStudies: [
                { title: 'East Coast Realty', description: 'Comprehensive property management system reducing administrative work by 60%.' },
                { title: 'Century One Management', description: 'Custom tenant portal increasing satisfaction rates by 40% and reducing maintenance costs.' }
            ]
        },
        'print-design': {
            title: 'Print & Graphic Design',
            icon: '<i class="fas fa-paint-brush"></i>',
            color: '#ff5ca8',
            gradient: 'linear-gradient(135deg, #ff5ca8, #ff9bce)',
            description: `Our print and graphic design services help businesses create compelling visual assets that reinforce brand identity and engage audiences. From business cards to signage, we deliver high-quality designs that make a lasting impression.`,
            features: [
                'Logo design and brand identity',
                'Business card and stationery design',
                'Brochure and flyer creation',
                'Poster and banner design',
                'Packaging design',
                'Signage and environmental graphics',
                'Print management',
                'Digital asset creation'
            ],
            process: [
                { title: 'Brief', description: 'Understanding your design needs and brand requirements.' },
                { title: 'Concept', description: 'Developing initial design concepts and ideas.' },
                { title: 'Feedback', description: 'Presenting concepts and gathering your feedback.' },
                { title: 'Refinement', description: 'Refining designs based on your input.' },
                { title: 'Finalization', description: 'Finalizing designs and preparing for production.' },
                { title: 'Production', description: 'Managing the printing process for quality results.' },
                { title: 'Delivery', description: 'Delivering the final printed materials.' }
            ],
            caseStudies: [
                { title: 'S-Cream', description: 'Complete brand identity and packaging design increasing visual appeal and brand recognition.' },
                { title: 'Iconic Aesthetics', description: 'Print materials and signage creating a cohesive brand experience across all touchpoints.' }
            ]
        },
        'tech-consulting': {
            title: 'Technology Consulting',
            icon: '<i class="fas fa-chart-line"></i>',
            color: '#607d8b',
            gradient: 'linear-gradient(135deg, #607d8b, #90a4ae)',
            description: `Our technology consulting services provide strategic guidance to help businesses leverage technology for growth, efficiency, and competitive advantage. We assess your current infrastructure, identify opportunities, and develop roadmaps for digital transformation.`,
            features: [
                'IT infrastructure assessment',
                'Digital transformation strategy',
                'Technology stack selection',
                'Process automation consulting',
                'Cybersecurity assessment',
                'Cloud migration strategy',
                'Vendor selection and management',
                'Technology roadmap development'
            ],
            process: [
                { title: 'Assessment', description: 'Evaluating your current technology landscape.' },
                { title: 'Analysis', description: 'Identifying challenges and opportunities.' },
                { title: 'Strategy', description: 'Developing a tailored technology strategy.' },
                { title: 'Roadmap', description: 'Creating a phased implementation plan.' },
                { title: 'Selection', description: 'Helping select appropriate technologies and vendors.' },
                { title: 'Implementation', description: 'Supporting the execution of your technology roadmap.' },
                { title: 'Evaluation', description: 'Measuring outcomes and refining strategies.' }
            ],
            caseStudies: [
                { title: 'East Coast Realty', description: 'Technology infrastructure overhaul reducing IT issues by 75% and improving staff productivity.' },
                { title: 'Cohen & Associates', description: 'Digital transformation strategy enabling secure remote work and 40% efficiency improvement.' }
            ]
        }
    };
    
    // Add necessary styles for the new modal design
    addModalStyles();
    
    // Open modal when clicking on service links
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const serviceId = this.getAttribute('data-service');
            const serviceData = serviceDetails[serviceId];
            
            if (serviceData) {
                // Populate modal content with improved design
                modalContent.innerHTML = `
                    <div class="service-detail-modern">
                        <!-- Header Section with Gradient Background -->
                        <div class="service-header" style="background: ${serviceData.gradient}">
                            <div class="service-header-content">
                                <div class="service-icon-wrapper">
                                    <div class="service-icon-container">
                                        ${serviceData.icon}
                                    </div>
                                </div>
                                <h2 class="service-title">${serviceData.title}</h2>
                                <div class="service-description">
                                    <p>${serviceData.description}</p>
                                </div>
                            </div>
                            <div class="service-header-shape">
                                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                                    <path d="M0,0 C720,120 1440,120 1440,0 L1440,120 L0,120 Z" fill="white"></path>
                                </svg>
                            </div>
                        </div>
                        
                        <!-- Main Content Section -->
                        <div class="service-content">
                            <!-- Features Section with Modern Cards -->
                            <div class="service-section">
                                <div class="section-header">
                                    <h3 class="section-title">Key Features</h3>
                                    <div class="section-line" style="background: ${serviceData.gradient}"></div>
                                </div>
                                
                                <div class="features-grid">
                                    ${serviceData.features.map(feature => `
                                        <div class="feature-card">
                                            <div class="feature-icon" style="color: ${serviceData.color}">
                                                <i class="fas fa-check-circle"></i>
                                            </div>
                                            <div class="feature-text">${feature}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Process Section with Timeline -->
                            <div class="service-section">
                                <div class="section-header">
                                    <h3 class="section-title">Our Process</h3>
                                    <div class="section-line" style="background: ${serviceData.gradient}"></div>
                                </div>
                                
                                <div class="process-timeline">
                                    ${serviceData.process.map((step, index) => `
                                        <div class="process-item">
                                            <div class="process-number" style="background: ${serviceData.gradient}">${index + 1}</div>
                                            <div class="process-content">
                                                <h4 class="process-title">${step.title}</h4>
                                                <p class="process-description">${step.description}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Case Studies Section with Cards -->
                            <div class="service-section">
                                <div class="section-header">
                                    <h3 class="section-title">Success Stories</h3>
                                    <div class="section-line" style="background: ${serviceData.gradient}"></div>
                                </div>
                                
                                <div class="case-studies-grid">
                                    ${serviceData.caseStudies.map(study => `
                                        <div class="case-study-card">
                                            <div class="case-study-header" style="background: ${serviceData.gradient}">
                                                <h4 class="case-study-title">${study.title}</h4>
                                            </div>
                                            <div class="case-study-body">
                                                <p>${study.description}</p>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- CTA Section -->
                            <div class="service-cta">
                                <a href="../index.html#contact" class="cta-button" style="background: ${serviceData.gradient}">
                                    <span>Start Your Project</span>
                                    <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                
                // Open modal
                modal.classList.add('active');
                document.body.classList.add('no-scroll');
                
                // Animate modal entrance
                setTimeout(() => {
                    modal.querySelector('.modal-container').classList.add('show');
                }, 10);
            }
        });
    });
    
    // Close modal when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeServiceModal);
    }
    
    // Close modal when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', closeServiceModal);
    }
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeServiceModal();
        }
    });
    
    // Close modal function
    function closeServiceModal() {
        modal.querySelector('.modal-container').classList.remove('show');
        
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }, 300);
    }
    
    // Add modal styles function
    function addModalStyles() {
        // Create a style element if it doesn't exist
        let styleEl = document.getElementById('service-modal-styles');
        
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'service-modal-styles';
            document.head.appendChild(styleEl);
        }
        
        // Add modern modal styles
        styleEl.textContent = `
            /* Modal Base Styles */
            .service-detail-modal .modal-container {
                max-width: 900px;
                max-height: 85vh;
                width: 95%;
                background: #fff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transform: scale(0.95);
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .service-detail-modal .modal-container.show {
                opacity: 1;
                transform: scale(1);
            }
            
            .service-detail-modal .modal-content {
                padding: 0;
                overflow: hidden;
            }
            
            /* Modern Service Detail Styles */
            .service-detail-modern {
                display: flex;
                flex-direction: column;
                width: 100%;
                max-height: 85vh;
                overflow: hidden;
            }
            
            /* Header Section */
            .service-header {
                position: relative;
                color: white;
                padding: 3rem 2rem 4rem;
                overflow: hidden;
            }
            
            .service-header-content {
                position: relative;
                z-index: 2;
                text-align: center;
                max-width: 700px;
                margin: 0 auto;
            }
            
            .service-icon-wrapper {
                display: flex;
                justify-content: center;
                margin-bottom: 1.5rem;
            }
            
            .service-icon-container {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(5px);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .service-title {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                font-weight: 700;
            }
            
            .service-description {
                font-size: 1.125rem;
                opacity: 0.9;
                line-height: 1.6;
            }
            
            .service-header-shape {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 120px;
                z-index: 1;
            }
            
            /* Content Section */
            .service-content {
                padding: 2rem;
                overflow-y: auto;
                flex: 1;
            }
            
            .service-section {
                margin-bottom: 3rem;
            }
            
            .section-header {
                margin-bottom: 1.5rem;
                position: relative;
            }
            
            .section-title {
                font-size: 1.75rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .section-line {
                width: 60px;
                height: 4px;
                border-radius: 2px;
            }
            
            /* Features Grid */
            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1.5rem;
            }
            
            .feature-card {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 1.25rem;
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                transition: all 0.3s ease;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            }
            
            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .feature-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }
            
            .feature-text {
                font-size: 1rem;
                line-height: 1.5;
                color: #4a4a4a;
            }
            
            /* Process Timeline */
            .process-timeline {
                position: relative;
                padding-left: 3rem;
            }
            
            .process-timeline::before {
                content: '';
                position: absolute;
                top: 0;
                left: 15px;
                height: 100%;
                width: 2px;
                background: #e9ecef;
            }
            
            .process-item {
                position: relative;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
            }
            
            .process-item:last-child {
                margin-bottom: 0;
            }
            
            .process-number {
                position: absolute;
                left: -3rem;
                top: 0;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                z-index: 2;
            }
            
            .process-content {
                background: white;
                border-radius: 12px;
                padding: 1.25rem;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
            }
            
            .process-item:hover .process-content {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            }
            
            .process-title {
                font-size: 1.25rem;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            
            .process-description {
                color: #6c757d;
                margin: 0;
                line-height: R1.5;
            }
            
            /* Case Studies */
            .case-studies-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 1.5rem;
            }
            
            .case-study-card {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
            }
            
            .case-study-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            }
            
            .case-study-header {
                padding: 1.25rem;
                color: white;
            }
            
            .case-study-title {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }
            
            .case-study-body {
                padding: 1.25rem;
            }
            
            .case-study-body p {
                margin: 0;
                color: #6c757d;
                line-height: 1.5;
            }
            
            /* CTA Section */
            .service-cta {
                text-align: center;
                margin-top: 1rem;
            }
            
            .cta-button {
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 2.5rem;
                border-radius: 50px;
                color: white;
                font-weight: 600;
                font-size: 1.125rem;
                transition: all 0.3s ease;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            }
            
            .cta-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
            }
            
            .cta-button i {
                transition: transform 0.3s ease;
            }
            
            .cta-button:hover i {
                transform: translateX(5px);
            }
            
            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .service-title {
                    font-size: 2rem;
                }
                
                .service-content {
                    padding: 1.5rem;
                }
                
                .features-grid,
                .case-studies-grid {
                    grid-template-columns: 1fr;
                }
                
                .process-timeline {
                    padding-left: 2.5rem;
                }
                
                .process-number {
                    left: -2.5rem;
                    width: 28px;
                    height: 28px;
                    font-size: 0.875rem;
                }
            }
        `;
    }
}

/**
 * Case Studies Slider Initialization
 */
function initCaseStudiesSlider() {
    const slider = document.querySelector('.case-studies-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.case-study-card');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideWidth = slides[0].offsetWidth;
    let slideMargin = parseInt(window.getComputedStyle(slides[0]).marginRight);
    let slidesToShow = getVisibleSlideCount();
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    // Create dots based on slide count
    if (dotsContainer) {
        for (let i = 0; i < slides.length - slidesToShow + 1; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Set initial position
    updateSliderPosition();
    
    // Navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
    
    // Add touch/mouse events for dragging
    slider.addEventListener('mousedown', dragStart);
    slider.addEventListener('touchstart', dragStart);
    slider.addEventListener('mouseup', dragEnd);
    slider.addEventListener('mouseleave', dragEnd);
    slider.addEventListener('touchend', dragEnd);
    slider.addEventListener('mousemove', drag);
    slider.addEventListener('touchmove', drag);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        slideWidth = slides[0].offsetWidth;
        slideMargin = parseInt(window.getComputedStyle(slides[0]).marginRight);
        slidesToShow = getVisibleSlideCount();
        updateSliderPosition();
        updateDots();
    });
    
    // Get number of visible slides based on screen width
    function getVisibleSlideCount() {
        if (window.innerWidth >= 1024) {
            return 3;
        } else if (window.innerWidth >= 768) {
            return 2;
        } else {
            return 1;
        }
    }
    
    // Go to specific slide
    function goToSlide(index) {
        // Handle boundaries
        if (index < 0) {
            index = 0;
        } else if (index > slides.length - slidesToShow) {
            index = slides.length - slidesToShow;
        }
        
        currentSlide = index;
        updateSliderPosition();
        updateDots();
    }
    
    // Update slider position
    function updateSliderPosition() {
        const translateValue = -currentSlide * (slideWidth + slideMargin);
        slider.style.transform = `translateX(${translateValue}px)`;
        slider.style.transition = 'transform 0.5s ease';
        prevTranslate = translateValue;
        currentTranslate = translateValue;
    }
    
    // Update active dot
    function updateDots() {
        if (!dotsContainer) return;
        
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Drag functionality
    function dragStart(e) {
        isDragging = true;
        startPos = getPositionX(e);
        slider.style.transition = 'none';
        slider.style.cursor = 'grabbing';
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startPos;
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    function dragEnd() {
        isDragging = false;
        slider.style.cursor = 'grab';
        
        // Calculate how much was dragged
        const movedBy = currentTranslate - prevTranslate;
        
        // If dragged more than 100px, change slide
        if (movedBy < -100 && currentSlide < slides.length - slidesToShow) {
            goToSlide(currentSlide + 1);
        } else if (movedBy > 100 && currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else {
            // Go back to current slide
            goToSlide(currentSlide);
        }
    }
    
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
}

/**
 * Package Tabs Functionality
 */
function initPackageTabs() {
    const tabButtons = document.querySelectorAll('.package-tab');
    const packageGroups = document.querySelectorAll('.package-group');
    
    if (!tabButtons.length || !packageGroups.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get package group to show
            const packageType = this.getAttribute('data-package');
            
            // Hide all package groups with animation
            packageGroups.forEach(group => {
                if (group.classList.contains('active')) {
                    group.style.opacity = '0';
                    
                    setTimeout(() => {
                        group.classList.remove('active');
                        
                        // Show selected package group
                        const activeGroup = document.querySelector(`.package-group[data-group="${packageType}"]`);
                        if (activeGroup) {
                            activeGroup.classList.add('active');
                            
                            // Force reflow
                            void activeGroup.offsetWidth;
                            
                            // Fade in animation
                            activeGroup.style.opacity = '1';
                        }
                    }, 300);
                }
            });
        });
    });
    
    // Initialize package card hover effects
    initPackageCardEffects();
}

/**
 * Package Card Hover Effects
 */
function initPackageCardEffects() {
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!window.matchMedia('(hover: hover)').matches) return;
            
            // Apply hover effects
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = 'var(--shadow-lg)';
            
            // Animate featured badge if present
            const badge = card.querySelector('.package-badge');
            if (badge) {
                badge.style.transform = 'rotate(45deg) scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!window.matchMedia('(hover: hover)').matches) return;
            
            // Reset hover effects
            card.style.transform = '';
            card.style.boxShadow = '';
            
            // Reset badge animation
            const badge = card.querySelector('.package-badge');
            if (badge) {
                badge.style.transform = 'rotate(45deg)';
            }
        });
    });
}

/**
 * Service Card Animations on Scroll
 */
function initServiceCardAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;
    
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Create observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateServiceCard(entry.target, entries.indexOf(entry));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe each service card
    serviceCards.forEach(card => {
        observer.observe(card);
    });
    
    // Animate service card function
    function animateServiceCard(card, index) {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    }
    
    // Initialize hover effects for service cards
    initServiceCardHoverEffects();
}

/**
 * Service Card Hover Effects
 */
function initServiceCardHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!window.matchMedia('(hover: hover)').matches) return;
            
            // Apply hover effects
            const cardBg = this.querySelector('.service-card-bg');
            const serviceIcon = this.querySelector('.service-icon');
            const serviceLink = this.querySelector('.service-link');
            
            if (cardBg) {
                cardBg.style.opacity = '1';
            }
            
            if (serviceIcon) {
                serviceIcon.style.transform = 'scale(1.1) rotate(-10deg)';
            }
            
            if (serviceLink) {
                const icon = serviceLink.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(5px)';
                }
            }
            
            // Animate features list items with staggered delay
            const featureItems = this.querySelectorAll('.service-features li');
            featureItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateX(5px)';
                    
                    const featureIcon = item.querySelector('i');
                    if (featureIcon) {
                        featureIcon.style.transform = 'scale(1.2)';
                    }
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            if (!window.matchMedia('(hover: hover)').matches) return;
            
            // Reset hover effects
            const cardBg = this.querySelector('.service-card-bg');
            const serviceIcon = this.querySelector('.service-icon');
            const serviceLink = this.querySelector('.service-link');
            
            if (cardBg) {
                cardBg.style.opacity = '0.5';
            }
            
            if (serviceIcon) {
                serviceIcon.style.transform = 'scale(1) rotate(0)';
            }
            
            if (serviceLink) {
                const icon = serviceLink.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(0)';
                }
            }
            
            // Reset features list animations
            const featureItems = this.querySelectorAll('.service-features li');
            featureItems.forEach(item => {
                item.style.transform = 'translateX(0)';
                
                const featureIcon = item.querySelector('i');
                if (featureIcon) {
                    featureIcon.style.transform = 'scale(1)';
                }
            });
        });
    });
}

/**
 * Background Animation Effects
 */
function initBackgroundEffects() {
    // Create particles for hero section
    createHeroParticles();
    
    // Create particles for CTA section
    createCtaParticles();
}

/**
 * Create Hero Section Particles
 */
function createHeroParticles() {
    const particlesContainer = document.querySelector('.services-particles-container .particles');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size
        const size = Math.random() * 6 + 1;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Random animation duration
        const duration = Math.random() * 30 + 20;
        
        // Set styles
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = posX + '%';
        particle.style.top = posY + '%';
        particle.style.opacity = opacity;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = (Math.random() * 5) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * Create CTA Section Particles
 */
function createCtaParticles() {
    const ctaParticles = document.querySelector('.cta-particles');
    if (!ctaParticles) return;
    
    // Clear existing particles
    ctaParticles.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('cta-particle');
        
        // Random size
        const size = Math.random() * 20 + 5;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random opacity
        const opacity = Math.random() * 0.15 + 0.05;
        
        // Random animation duration
        const duration = Math.random() * 40 + 20;
        
        // Set styles
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = posX + '%';
        particle.style.top = posY + '%';
        particle.style.opacity = opacity;
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = (Math.random() * 5) + 's';
        
        ctaParticles.appendChild(particle);
    }
}
