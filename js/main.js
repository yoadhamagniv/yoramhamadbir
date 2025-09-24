// Main JavaScript for Yoram Hamadbir Website
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Business hours (24-hour format)
        businessHours: {
            sunday: { open: '08:00', close: '20:00' },
            monday: { open: '08:00', close: '20:00' },
            tuesday: { open: '08:00', close: '20:00' },
            wednesday: { open: '08:00', close: '20:00' },
            thursday: { open: '08:00', close: '20:00' },
            friday: { open: '08:00', close: '15:00' },
            saturday: null // Closed on Saturday
        },

        // Google Sheets Integration
        googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbygehkj2P0KofTPBG47DYnaLzsQLW8DtjtfVcQFVF_35hNOiKD8O1Djd0_yAOa0XRTf/exec', // יש להחליף ב-URL האמיתי

        // WhatsApp Configuration
        whatsappNumber: '972528665270',
        whatsappMessage: 'שלום, הגעתי מהאתר ואשמח לקבל מידע על שירותי הדברה'
    };

    // Generate unique session ID
    function generateSessionId() {
        return Math.random().toString().slice(2, 12); // 10-digit random number
    }

    // State Management
    let state = {
        cookiesAccepted: localStorage.getItem('cookiesAccepted') === 'true',
        trackingEnabled: false,
        currentPage: window.location.pathname,
        sessionId: sessionStorage.getItem('sessionId') || generateSessionId()
    };

    // Save session ID
    sessionStorage.setItem('sessionId', state.sessionId);

    // DOM Elements
    const elements = {
        // Navigation
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        navLinks: document.querySelectorAll('.nav__link'),

        // Business Hours
        statusIndicator: document.getElementById('status-indicator'),
        statusText: document.getElementById('status-text'),

        // Forms
        contactForm: document.getElementById('contact-form'),

        // Cookie Banner
        cookieBanner: document.getElementById('cookie-banner'),
        acceptCookiesBtn: document.getElementById('accept-cookies'),

        // Modal
        successModal: document.getElementById('success-modal'),
        modalClose: document.querySelector('.modal__close'),

        // Trackable elements
        trackableElements: document.querySelectorAll('[data-track]')
    };

    // Initialize application
    function init() {
        console.log('Yoram Hamadbir Website initialized');

        setupNavigation();
        setupBusinessHours();
        setupFormHandling();
        setupCookieBanner();
        setupModal();
        setupTracking();
        setupAdvancedTracking();
        setupAccessibility();

        // Check if GTM should be loaded
        if (state.cookiesAccepted) {
            enableTracking();
        }
    }

    // Navigation Functions
    function setupNavigation() {
        if (elements.navToggle && elements.navMenu) {
            elements.navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking on links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (elements.navMenu.classList.contains('show')) {
                    toggleMobileMenu();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (elements.navMenu &&
                elements.navMenu.classList.contains('show') &&
                !elements.navMenu.contains(e.target) &&
                !elements.navToggle.contains(e.target)) {
                toggleMobileMenu();
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    function toggleMobileMenu() {
        elements.navMenu.classList.toggle('show');
        elements.navToggle.classList.toggle('active');
    }

    // Business Hours Functions
    function setupBusinessHours() {
        updateBusinessHoursStatus();

        // Update status every minute
        setInterval(updateBusinessHoursStatus, 60000);
    }

    function updateBusinessHoursStatus() {
        const now = new Date();
        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

        const todayHours = CONFIG.businessHours[currentDay];

        if (!todayHours) {
            // Closed today (Saturday)
            setBusinessStatus(false, 'סגור היום - נחזור במחר');
            return;
        }

        const isOpen = currentTime >= todayHours.open && currentTime <= todayHours.close;

        if (isOpen) {
            setBusinessStatus(true, `פתוח עד ${todayHours.close}`);
        } else {
            const nextOpenDay = getNextOpenDay();
            setBusinessStatus(false, `סגור - ${nextOpenDay}`);
        }
    }

    function setBusinessStatus(isOpen, message) {
        if (elements.statusIndicator && elements.statusText) {
            elements.statusIndicator.className = `status-indicator ${isOpen ? 'open' : 'closed'}`;
            elements.statusText.textContent = message;
        }
    }

    function getNextOpenDay() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dayName = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][tomorrow.getDay()];
        const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][tomorrow.getDay()];

        const tomorrowHours = CONFIG.businessHours[dayKey];

        if (tomorrowHours) {
            return `נפתח מחר (יום ${dayName}) בשעה ${tomorrowHours.open}`;
        } else {
            return 'נפתח יום ראשון בשעה 08:00';
        }
    }

    // Form Handling
    function setupFormHandling() {
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', handleFormSubmission);
        }

        // Add floating labels functionality
        document.querySelectorAll('.form__input').forEach(input => {
            // Set placeholder to empty to enable CSS floating label
            input.placeholder = '';

            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    async function handleFormSubmission(e) {
        e.preventDefault();

        const formData = new FormData(elements.contactForm);
        const data = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email') || '',
            serviceType: formData.get('serviceType'),
            consent: formData.get('consent'),
            timestamp: new Date().toLocaleString('he-IL'),
            source: 'website',
            page: window.location.pathname
        };

        // Validate required fields
        if (!data.fullName || !data.phone || !data.serviceType || !data.consent) {
            showError('אנא מלא את כל השדות הנדרשים');
            trackEvent('form_error', { error: 'missing_required_fields' });
            return;
        }

        // Validate phone number (basic Israeli phone validation)
        const phoneRegex = /^0\d{1,2}-?\d{7}$/;
        if (!phoneRegex.test(data.phone)) {
            showError('אנא הזן מספר טלפון תקין');
            trackEvent('form_error', { error: 'invalid_phone' });
            return;
        }

        // Show loading state
        const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'שולח...';
        submitBtn.disabled = true;

        try {
            // Submit to Google Sheets using JSONP to avoid CORS
            console.log('Using JSONP submission method');
            await submitToGoogleSheets(data);

            // Success
            trackEvent('form_submit', { service: data.serviceType });
            showSuccessModal();
            elements.contactForm.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            showError('אירעה שגיאה בשליחת הטופס. אנא נסה שוב או צור קשר טלפונית.');
            trackEvent('form_error', { error: 'submission_failed' });
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Submit to Google Sheets using JSONP to avoid CORS
    function submitToGoogleSheets(data) {
        console.log('🚀 JSONP FUNCTION CALLED - NO MORE FETCH!', data);
        return new Promise((resolve, reject) => {
            // Create a unique callback name
            const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

            // Create the callback function
            window[callbackName] = function(response) {
                console.log('📥 JSONP Response received:', response);
                delete window[callbackName];
                document.body.removeChild(script);
                if (response && response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response?.error || 'Unknown error'));
                }
            };

            // Create script element for JSONP
            const script = document.createElement('script');
            const params = new URLSearchParams({
                callback: callbackName,
                sessionId: state.sessionId,
                fullName: data.fullName,
                phone: data.phone,
                email: data.email,
                serviceType: data.serviceType,
                consent: data.consent,
                timestamp: data.timestamp,
                source: data.source,
                page: data.page
            });

            script.src = CONFIG.googleSheetsUrl + '?' + params.toString();
            console.log('📤 JSONP Request URL:', script.src);

            script.onerror = function() {
                console.log('❌ Script loading failed');
                delete window[callbackName];
                document.body.removeChild(script);
                reject(new Error('Script loading failed'));
            };

            document.body.appendChild(script);

            // Timeout after 10 seconds
            setTimeout(() => {
                if (window[callbackName]) {
                    delete window[callbackName];
                    document.body.removeChild(script);
                    reject(new Error('Request timeout'));
                }
            }, 10000);
        });
    }

    function showError(message) {
        // Simple error display - could be enhanced with a proper notification system
        alert(message);
    }

    // Cookie Banner Functions
    function setupCookieBanner() {
        if (!state.cookiesAccepted && elements.cookieBanner) {
            // Show banner after a short delay
            setTimeout(() => {
                elements.cookieBanner.classList.add('show');
            }, 1000);
        }

        if (elements.acceptCookiesBtn) {
            elements.acceptCookiesBtn.addEventListener('click', acceptCookies);
        }

        const declineCookiesBtn = document.getElementById('decline-cookies');
        if (declineCookiesBtn) {
            declineCookiesBtn.addEventListener('click', declineCookies);
        }
    }

    function acceptCookies() {
        state.cookiesAccepted = true;
        localStorage.setItem('cookiesAccepted', 'true');

        if (elements.cookieBanner) {
            elements.cookieBanner.classList.remove('show');
        }

        enableTracking();
    }

    function declineCookies() {
        if (elements.cookieBanner) {
            elements.cookieBanner.classList.remove('show');
        }
        // Don't enable tracking, don't store consent
    }

    // Modal Functions
    function setupModal() {
        if (elements.modalClose) {
            elements.modalClose.addEventListener('click', hideModal);
        }

        if (elements.successModal) {
            elements.successModal.addEventListener('click', (e) => {
                if (e.target === elements.successModal) {
                    hideModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.successModal && elements.successModal.classList.contains('show')) {
                hideModal();
            }
        });
    }

    function showSuccessModal() {
        if (elements.successModal) {
            elements.successModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function hideModal() {
        if (elements.successModal) {
            elements.successModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Tracking Functions
    function setupTracking() {
        // Add click event listeners to all trackable elements
        elements.trackableElements.forEach(element => {
            element.addEventListener('click', handleTrackableClick);
        });

        // Track page view
        trackEvent('page_view', {
            page: state.currentPage,
            timestamp: new Date().toISOString()
        });
    }

    function handleTrackableClick(e) {
        const element = e.currentTarget;
        const eventType = element.getAttribute('data-track');
        const eventData = {};

        // Collect additional data attributes
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-') && attr.name !== 'data-track') {
                const key = attr.name.replace('data-', '');
                eventData[key] = attr.value;
            }
        });

        trackEvent(eventType, eventData);
    }

    function trackEvent(eventType, data = {}) {
        if (!state.trackingEnabled) return;

        // Track to console for development
        console.log('Track Event:', eventType, data);

        // Track to Google Analytics / GTM if available
        if (typeof gtag !== 'undefined') {
            gtag('event', eventType, data);
        }

        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: eventType,
                ...data
            });
        }

        // Track to Google Sheets
        sendTrackingToSheets(eventType, data);
    }

    function sendTrackingToSheets(eventType, data) {
        // Create a simple GET request with tracking data
        const params = new URLSearchParams({
            event: eventType,
            sessionId: state.sessionId,
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            data: JSON.stringify(data),
            userAgent: navigator.userAgent
        });

        // Use image pixel technique to avoid CORS issues
        const img = new Image();
        img.src = CONFIG.googleSheetsUrl + '?' + params.toString();

        // Optional: Remove image after 5 seconds to clean up
        setTimeout(() => {
            if (img && img.parentNode) {
                img.parentNode.removeChild(img);
            }
        }, 5000);
    }

    function enableTracking() {
        state.trackingEnabled = true;

        // GTM will be loaded when you have a real container ID
        // For now, tracking events will only go to console and custom analytics
    }

    // Accessibility Functions
    function setupAccessibility() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Handle Enter key on buttons and links
            if (e.key === 'Enter' && (e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) {
                e.target.click();
            }
        });

        // Announce content changes to screen readers
        const announceToScreenReader = (message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;

            document.body.appendChild(announcement);

            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        };

        // Make business hours status accessible
        if (elements.statusText) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        announceToScreenReader(`סטטוס עסק: ${elements.statusText.textContent}`);
                    }
                });
            });

            observer.observe(elements.statusText, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance optimizations
    function setupPerformanceOptimizations() {
        // Lazy loading for images (if any are added later)
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Optimize scroll events
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Add scroll-based functionality here if needed
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Error Handling
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        trackEvent('js_error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno
        });
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Initialize performance optimizations
    setupPerformanceOptimizations();

    // Advanced User Behavior Tracking
    function setupAdvancedTracking() {
        let sessionData = {
            startTime: Date.now(),
            pageViews: 0,
            scrollDepth: 0,
            timeOnPage: {},
            clickHeatmap: [],
            formInteractions: {}
        };

        // Track time spent on each page
        trackTimeOnPage();

        // Track scroll depth
        trackScrollBehavior();

        // Track mouse movement patterns
        trackMouseBehavior();

        // Track form interaction patterns
        trackFormBehavior();

        // Track reading behavior
        trackReadingBehavior();

        // Track device and browser info
        trackDeviceInfo();

        // Track business hours interest
        trackBusinessHoursInteraction();

        // Track pricing interest patterns
        trackPricingBehavior();

        function trackTimeOnPage() {
            const pageName = window.location.pathname;
            const startTime = Date.now();

            window.addEventListener('beforeunload', () => {
                const timeSpent = Math.round((Date.now() - startTime) / 1000);
                trackEvent('time_on_page', {
                    page: pageName,
                    seconds: timeSpent,
                    engagement_level: timeSpent > 60 ? 'high' : timeSpent > 30 ? 'medium' : 'low'
                });
            });
        }

        function trackScrollBehavior() {
            let maxScrollDepth = 0;
            let scrollCheckpoints = [25, 50, 75, 90, 100];
            let triggeredCheckpoints = [];

            const throttledScroll = throttle(() => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );

                maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);

                scrollCheckpoints.forEach(checkpoint => {
                    if (scrollPercent >= checkpoint && !triggeredCheckpoints.includes(checkpoint)) {
                        triggeredCheckpoints.push(checkpoint);
                        trackEvent('scroll_depth', {
                            depth: checkpoint,
                            page: window.location.pathname
                        });
                    }
                });
            }, 1000);

            window.addEventListener('scroll', throttledScroll, { passive: true });
        }

        function trackMouseBehavior() {
            let mouseData = {
                clicks: 0,
                movements: 0,
                hovers: {}
            };

            // Track clicks with coordinates
            document.addEventListener('click', (e) => {
                mouseData.clicks++;
                trackEvent('mouse_click', {
                    x: e.clientX,
                    y: e.clientY,
                    element: e.target.tagName,
                    className: e.target.className,
                    page: window.location.pathname
                });
            });

            // Track hover on important elements
            document.querySelectorAll('.service-card, .pricing-card, .contact-method').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    const elementType = el.className.split(' ')[0];
                    trackEvent('element_hover', {
                        element: elementType,
                        content: el.textContent.slice(0, 50),
                        page: window.location.pathname
                    });
                });
            });
        }

        function trackFormBehavior() {
            const formElements = document.querySelectorAll('input, select, textarea');

            formElements.forEach(element => {
                const fieldName = element.name || element.id;

                // Track field focus
                element.addEventListener('focus', () => {
                    trackEvent('form_field_focus', {
                        field: fieldName,
                        page: window.location.pathname
                    });
                });

                // Track field completion
                element.addEventListener('blur', () => {
                    if (element.value.trim()) {
                        trackEvent('form_field_complete', {
                            field: fieldName,
                            hasValue: true,
                            valueLength: element.value.length,
                            page: window.location.pathname
                        });
                    }
                });

                // Track form abandonment
                element.addEventListener('input', debounce(() => {
                    trackEvent('form_interaction', {
                        field: fieldName,
                        progress: calculateFormProgress(),
                        page: window.location.pathname
                    });
                }, 2000));
            });

            function calculateFormProgress() {
                const requiredFields = document.querySelectorAll('input[required], select[required]');
                const completedFields = Array.from(requiredFields).filter(field => field.value.trim());
                return Math.round((completedFields.length / requiredFields.length) * 100);
            }
        }

        function trackReadingBehavior() {
            // Track which sections users actually read
            const sections = document.querySelectorAll('section, .service-card, .pricing-card');

            if ('IntersectionObserver' in window) {
                const readingObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                            const sectionName = entry.target.id || entry.target.className.split(' ')[0];
                            trackEvent('section_viewed', {
                                section: sectionName,
                                viewTime: Date.now(),
                                page: window.location.pathname
                            });
                        }
                    });
                }, { threshold: 0.5 });

                sections.forEach(section => readingObserver.observe(section));
            }
        }

        function trackDeviceInfo() {
            const deviceInfo = {
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                viewportWidth: window.innerWidth,
                viewportHeight: window.innerHeight,
                pixelRatio: window.devicePixelRatio,
                platform: navigator.platform,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                isMobile: window.innerWidth < 768,
                isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
                connectionType: navigator.connection?.effectiveType || 'unknown'
            };

            trackEvent('device_info', deviceInfo);
        }

        function trackBusinessHoursInteraction() {
            const statusElement = document.getElementById('status-text');
            if (statusElement) {
                // Track when users see business hours
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        trackEvent('business_hours_viewed', {
                            status: statusElement.textContent,
                            currentTime: new Date().toTimeString().slice(0, 5),
                            page: window.location.pathname
                        });
                    }
                });
                observer.observe(statusElement);
            }
        }

        function trackPricingBehavior() {
            // Track pricing page specific behavior
            if (window.location.pathname.includes('pricing')) {
                document.querySelectorAll('.pricing-card').forEach((card, index) => {
                    card.addEventListener('click', () => {
                        const serviceName = card.querySelector('h3')?.textContent || `service-${index}`;
                        trackEvent('pricing_card_interest', {
                            service: serviceName,
                            position: index,
                            page: window.location.pathname
                        });
                    });
                });

                // Track how long users spend looking at prices
                let pricingStartTime = Date.now();
                window.addEventListener('beforeunload', () => {
                    const timeOnPricing = Math.round((Date.now() - pricingStartTime) / 1000);
                    trackEvent('pricing_page_engagement', {
                        timeSpent: timeOnPricing,
                        engagementLevel: timeOnPricing > 120 ? 'high' : timeOnPricing > 60 ? 'medium' : 'low'
                    });
                });
            }
        }
    }

    // Export functions for testing or external use
    window.YoramHamadbir = {
        trackEvent,
        showSuccessModal,
        hideModal,
        updateBusinessHoursStatus
    };

})();