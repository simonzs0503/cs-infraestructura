/* ============================================
   CS INFRAESTRUCTURA - Main JavaScript
   Premium Buttery Smooth Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================
    
    // Throttle function for scroll events
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
        }
    }
    
    // RAF-based debounce for smoother animations
    function rafDebounce(func) {
        let rafId = null;
        return function() {
            const args = arguments;
            const context = this;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                func.apply(context, args);
            });
        }
    }
    
    // Add js-ready class to enable animations
    // Small delay to ensure CSS is loaded
    requestAnimationFrame(function() {
        document.body.classList.add('js-ready');
        
        // Trigger animations for elements already in view
        requestAnimationFrame(triggerVisibleAnimations);
    });
    
    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    function triggerVisibleAnimations() {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
            if (isVisible) {
                // Use RAF for smooth class addition
                requestAnimationFrame(() => {
                    el.classList.add('animated');
                });
            }
        });
    }
    
    // IntersectionObserver with optimized settings for smooth animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use RAF to batch DOM updates
                requestAnimationFrame(() => {
                    entry.target.classList.add('animated');
                });
            }
        });
    }, {
        threshold: 0.05,  // Lower threshold for earlier trigger
        rootMargin: '0px 0px -30px 0px'  // Smaller margin for smoother reveal
    });
    
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
    
    // ============================================
    // FALLBACK: Scroll-based animation trigger
    // ============================================
    let scrollTimeout;
    function handleScroll() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            animatedElements.forEach(el => {
                if (!el.classList.contains('animated')) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
                        el.classList.add('animated');
                    }
                }
            });
        }, 50);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Trigger on load and after delays
    setTimeout(triggerVisibleAnimations, 100);
    setTimeout(triggerVisibleAnimations, 500);
    setTimeout(triggerVisibleAnimations, 1000);
    
    // ============================================
    // NAVIGATION
    // ============================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Smooth scroll behavior for nav with RAF
    if (nav) {
        let lastScrollY = window.pageYOffset;
        let ticking = false;
        
        function updateNav() {
            if (lastScrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            lastScrollY = window.pageYOffset;
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });
        
        // Check on load
        if (window.pageYOffset > 100) {
            nav.classList.add('scrolled');
        }
    }
    
    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // COUNTER ANIMATION - Simplified for reliability
    // ============================================
    const counters = document.querySelectorAll('.proof-number[data-count]');
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        if (isNaN(target) || target === 0) {
            counter.textContent = target;
            return;
        }
        
        // Simple animation with setInterval (more reliable than rAF in some contexts)
        let current = 0;
        const increment = target / 50; // 50 steps
        const interval = 40; // 40ms per step = 2 seconds total
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, interval);
    }
    
    // Just animate all counters after a short delay
    // No visibility checking - simpler and more reliable
    function startCounterAnimations() {
        counters.forEach(counter => {
            if (!counter.classList.contains('counted')) {
                counter.classList.add('counted');
                animateCounter(counter);
            }
        });
    }
    
    // Start after page is fully loaded
    if (document.readyState === 'complete') {
        setTimeout(startCounterAnimations, 500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(startCounterAnimations, 500);
        });
    }
    
    // Backup: also start on scroll
    let scrollStarted = false;
    window.addEventListener('scroll', () => {
        if (!scrollStarted) {
            scrollStarted = true;
            startCounterAnimations();
        }
    }, { passive: true });
    
    // ============================================
    // PROJECT FILTER
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // ============================================
    // CONTACT FORM - GHL Webhook Integration
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const descriptionField = document.getElementById('descripcion');
    const charCount = document.getElementById('charCount');
    
    // ⚠️ GHL WEBHOOK URL - CS Infraestructura
    const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/CKxAEP7tblWnBnWC2ONS/webhook-trigger/8717c5ab-ead1-425d-8604-4382dbe080a7';
    
    // Character counter
    if (descriptionField && charCount) {
        descriptionField.addEventListener('input', () => {
            charCount.textContent = descriptionField.value.length;
        });
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = `
                <span>Enviando...</span>
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20">
                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                    </circle>
                </svg>
            `;
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(contactForm);
            
            // Build payload for GHL
            const payload = {
                // Standard GHL contact fields
                firstName: formData.get('nombre')?.split(' ')[0] || '',
                lastName: formData.get('nombre')?.split(' ').slice(1).join(' ') || '',
                name: formData.get('nombre') || '',
                email: formData.get('email') || '',
                phone: formData.get('telefono') || '',
                companyName: formData.get('empresa') || '',
                
                // Custom fields - these will appear in GHL as custom values
                source: 'Website - CS Infraestructura',
                servicio: formData.get('servicio') || '',
                presupuesto: formData.get('presupuesto') || '',
                mensaje: formData.get('descripcion') || '',
                
                // Tags for segmentation
                tags: ['Website Lead', 'Cotización']
            };
            
            try {
                const response = await fetch(GHL_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok || response.status === 200 || response.status === 201) {
                    // Success
                    submitBtn.innerHTML = `
                        <span>¡Enviado!</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    `;
                    submitBtn.style.background = '#2E7D32';
                    
                    // Reset form after delay
                    setTimeout(() => {
                        contactForm.reset();
                        if (charCount) charCount.textContent = '0';
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Error en el servidor');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show error state
                submitBtn.innerHTML = `
                    <span>Error - Intente de nuevo</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                `;
                submitBtn.style.background = '#C62828';
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
        });
    }
    
    // ============================================
    // PAGE TRANSITIONS
    // ============================================
    const pageTransition = document.querySelector('.page-transition');
    const internalLinks = document.querySelectorAll('a[href^="./"], a[href^="../"], a[href$=".html"]');
    
    // Handle page transitions for internal links
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's the current page or an anchor link
            if (href.startsWith('#') || href === window.location.pathname) return;
            
            e.preventDefault();
            
            if (pageTransition) {
                pageTransition.classList.add('active');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            } else {
                window.location.href = href;
            }
        });
    });
    
    // ============================================
    // PARALLAX EFFECTS (subtle)
    // ============================================
    const geoShapes = document.querySelectorAll('.geo-shape');
    
    if (geoShapes.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            geoShapes.forEach((shape, index) => {
                const speed = 0.03 * (index + 1);
                const baseTransform = index === 0 ? 'rotate(45deg)' : '';
                shape.style.transform = `translateY(${scrolled * speed}px) ${baseTransform}`;
            });
        });
    }
    
    // ============================================
    // IMAGE LAZY LOADING WITH FADE
    // ============================================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });
    
    // ============================================
    // BUTTON RIPPLE EFFECT
    // ============================================
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: ${x - 50}px;
                top: ${y - 50}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation styles if not already present
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================================
    // NAVBAR ACTIVE STATE
    // ============================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === 'index.html' && href === './index.html') ||
            (currentPage.includes('servicios') && href.includes('servicios')) ||
            (currentPage.includes('proyectos') && href.includes('proyectos'))) {
            link.classList.add('active');
        }
    });
    
    // ============================================
    // STAGGER CHILDREN ANIMATION
    // ============================================
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });
    
    // ============================================
    // SCROLL PROGRESS INDICATOR (optional)
    // ============================================
    const progressBar = document.querySelector('.scroll-progress');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }
    
    // ============================================
    // REVEAL ON SCROLL - SECTIONS
    // ============================================
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.05 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});

// ============================================
// CONSOLE BRANDING
// ============================================
console.log('%c CS Infraestructura ', 'background: #D32F2F; color: white; font-size: 20px; padding: 10px;');
console.log('%c Especialistas en Infraestructura Industrial ', 'color: #424242; font-size: 12px;');
console.log('%c ¿Interesado en trabajar con nosotros? Contáctenos: +56 9 4227 6621 ', 'color: #757575; font-size: 10px;');
