/**
 * LATINBITE - Main JavaScript
 * Venezuelan Tequeños in Iceland
 *
 * This file contains all the interactive functionality for the website.
 * Structured for scalability and future e-commerce integration.
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    scrollOffset: 80,
    animationDuration: 300,
    loaderDelay: 1500,
    counterDuration: 2000,
    testimonialInterval: 5000
};

// ============================================
// DOM ELEMENTS
// ============================================
const DOM = {
    loader: document.getElementById('loader'),
    header: document.getElementById('header'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    backToTop: document.getElementById('backToTop'),
    contactForm: document.getElementById('contactForm'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    galeriaItems: document.querySelectorAll('.galeria-item'),
    statNumbers: document.querySelectorAll('.stat-number'),
    testimoniosTrack: document.querySelector('.testimonios-track'),
    testimonioCards: document.querySelectorAll('.testimonio-card'),
    testimoniosDotsContainer: document.querySelector('.testimonios-dots'),
    prevBtn: document.querySelector('.testimonios-nav .prev'),
    nextBtn: document.querySelector('.testimonios-nav .next')
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const Utils = {
    /**
     * Debounce function to limit execution rate
     */
    debounce(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function to limit execution rate
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= 0
        );
    },

    /**
     * Smooth scroll to element
     */
    scrollToElement(element, offset = CONFIG.scrollOffset) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Animate counter
     */
    animateCounter(element, target, duration = CONFIG.counterDuration) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
};

// ============================================
// LOADER MODULE
// ============================================
const Loader = {
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, CONFIG.loaderDelay);
        });
    },

    hide() {
        if (DOM.loader) {
            DOM.loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }
    },

    show() {
        if (DOM.loader) {
            DOM.loader.classList.remove('hidden');
            document.body.classList.add('no-scroll');
        }
    }
};

// ============================================
// HEADER MODULE
// ============================================
const Header = {
    lastScrollY: 0,
    isScrolled: false,

    init() {
        this.handleScroll();
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 10));
    },

    handleScroll() {
        const currentScrollY = window.pageYOffset;

        if (currentScrollY > 50) {
            if (!this.isScrolled) {
                DOM.header.classList.add('scrolled');
                this.isScrolled = true;
            }
        } else {
            if (this.isScrolled) {
                DOM.header.classList.remove('scrolled');
                this.isScrolled = false;
            }
        }

        this.lastScrollY = currentScrollY;
    }
};

// ============================================
// NAVIGATION MODULE
// ============================================
const Navigation = {
    init() {
        this.setupMobileToggle();
        this.setupSmoothScroll();
        this.setupActiveLinks();
    },

    setupMobileToggle() {
        if (DOM.navToggle && DOM.navMenu) {
            DOM.navToggle.addEventListener('click', () => {
                DOM.navToggle.classList.toggle('active');
                DOM.navMenu.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });

            // Close menu when clicking on a link
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    DOM.navToggle.classList.remove('active');
                    DOM.navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!DOM.navMenu.contains(e.target) && !DOM.navToggle.contains(e.target)) {
                    DOM.navToggle.classList.remove('active');
                    DOM.navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        }
    },

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    Utils.scrollToElement(targetElement);
                }
            });
        });
    },

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', Utils.throttle(() => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (window.pageYOffset >= sectionTop - CONFIG.scrollOffset - 100) {
                    current = section.getAttribute('id');
                }
            });

            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100));
    }
};

// ============================================
// BACK TO TOP MODULE
// ============================================
const BackToTop = {
    init() {
        if (DOM.backToTop) {
            window.addEventListener('scroll', Utils.throttle(() => this.toggleVisibility(), 100));
            DOM.backToTop.addEventListener('click', () => this.scrollToTop());
        }
    },

    toggleVisibility() {
        if (window.pageYOffset > 500) {
            DOM.backToTop.classList.add('visible');
        } else {
            DOM.backToTop.classList.remove('visible');
        }
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// ============================================
// COUNTER ANIMATION MODULE
// ============================================
const CounterAnimation = {
    animated: false,

    init() {
        window.addEventListener('scroll', Utils.throttle(() => this.checkAndAnimate(), 100));
    },

    checkAndAnimate() {
        if (this.animated) return;

        const statsSection = document.querySelector('.hero-stats');
        if (statsSection && Utils.isInViewport(statsSection, 100)) {
            this.animate();
            this.animated = true;
        }
    },

    animate() {
        DOM.statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            Utils.animateCounter(stat, target);
        });
    }
};

// ============================================
// GALLERY FILTER MODULE
// ============================================
const GalleryFilter = {
    init() {
        if (DOM.filterButtons.length > 0) {
            DOM.filterButtons.forEach(btn => {
                btn.addEventListener('click', () => this.filter(btn));
            });
        }
    },

    filter(clickedBtn) {
        // Update active button
        DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');

        const filterValue = clickedBtn.dataset.filter;

        // Filter items
        DOM.galeriaItems.forEach(item => {
            const category = item.dataset.category;

            if (filterValue === 'all' || category === filterValue) {
                item.style.display = '';
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
    }
};

// ============================================
// TESTIMONIALS SLIDER MODULE
// ============================================
const TestimonialsSlider = {
    currentIndex: 0,
    totalSlides: 0,
    autoplayInterval: null,
    itemsPerView: 3,

    init() {
        if (!DOM.testimoniosTrack || DOM.testimonioCards.length === 0) return;

        this.totalSlides = DOM.testimonioCards.length;
        this.updateItemsPerView();
        this.createDots();
        this.setupNavigation();
        this.startAutoplay();

        window.addEventListener('resize', Utils.debounce(() => {
            this.updateItemsPerView();
            this.goToSlide(this.currentIndex);
        }, 200));
    },

    updateItemsPerView() {
        if (window.innerWidth <= 640) {
            this.itemsPerView = 1;
        } else if (window.innerWidth <= 991) {
            this.itemsPerView = 2;
        } else {
            this.itemsPerView = 3;
        }
    },

    createDots() {
        if (!DOM.testimoniosDotsContainer) return;

        DOM.testimoniosDotsContainer.innerHTML = '';
        const dotsCount = Math.ceil(this.totalSlides / this.itemsPerView);

        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            DOM.testimoniosDotsContainer.appendChild(dot);
        }
    },

    setupNavigation() {
        if (DOM.prevBtn) {
            DOM.prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoplay();
            });
        }

        if (DOM.nextBtn) {
            DOM.nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoplay();
            });
        }
    },

    goToSlide(index) {
        const maxIndex = Math.ceil(this.totalSlides / this.itemsPerView) - 1;
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));

        const cardWidth = DOM.testimonioCards[0].offsetWidth;
        const gap = 24; // Gap from CSS
        const offset = this.currentIndex * (cardWidth + gap) * this.itemsPerView;

        DOM.testimoniosTrack.style.transform = `translateX(-${offset}px)`;
        this.updateDots();
    },

    next() {
        const maxIndex = Math.ceil(this.totalSlides / this.itemsPerView) - 1;
        this.goToSlide(this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1);
    },

    prev() {
        const maxIndex = Math.ceil(this.totalSlides / this.itemsPerView) - 1;
        this.goToSlide(this.currentIndex <= 0 ? maxIndex : this.currentIndex - 1);
    },

    updateDots() {
        const dots = DOM.testimoniosDotsContainer?.querySelectorAll('.dot');
        if (dots) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    },

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.next(), CONFIG.testimonialInterval);
    },

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    },

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
};

// ============================================
// CONTACT FORM MODULE
// ============================================
const ContactForm = {
    init() {
        if (DOM.contactForm) {
            DOM.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupValidation();
        }
    },

    setupValidation() {
        const inputs = DOM.contactForm.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es requerido';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un email válido';
            }
        }

        // Phone validation (basic)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s+()-]{6,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un teléfono válido';
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    },

    showError(field, message) {
        this.clearError(field);
        field.style.borderColor = '#C41E3A';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = 'color: #C41E3A; font-size: 0.875rem; margin-top: 0.25rem;';
        errorDiv.textContent = message;

        field.parentNode.appendChild(errorDiv);
    },

    clearError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    },

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = DOM.contactForm.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            return;
        }

        // Get form data
        const formData = new FormData(DOM.contactForm);
        const data = Object.fromEntries(formData.entries());

        // Show loading state
        const submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        try {
            await this.simulateSubmission(data);
            this.showSuccess();
            DOM.contactForm.reset();
        } catch (error) {
            this.showFormError('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    },

    simulateSubmission(data) {
        return new Promise((resolve) => {
            console.log('Form data:', data);
            setTimeout(resolve, 1500);
        });
    },

    showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = `
            background: #D4EDDA;
            color: #155724;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
        `;
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>¡Mensaje enviado!</strong>
            <p>Nos pondremos en contacto contigo pronto.</p>
        `;

        DOM.contactForm.insertBefore(successDiv, DOM.contactForm.firstChild);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    },

    showFormError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-submit-error';
        errorDiv.style.cssText = `
            background: #F8D7DA;
            color: #721C24;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        `;

        DOM.contactForm.insertBefore(errorDiv, DOM.contactForm.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
};

// ============================================
// SCROLL ANIMATIONS MODULE
// ============================================
const ScrollAnimations = {
    init() {
        this.observeElements();
    },

    observeElements() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.section-header, .producto-card, .servicio-card, .value, .galeria-item, .testimonio-card'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
};

// ============================================
// ECOMMERCE READY STRUCTURE
// ============================================
/**
 * Cart Module (Placeholder for future e-commerce integration)
 * This structure is ready to be expanded when converting to e-commerce
 */
const Cart = {
    items: [],

    init() {
        this.loadFromStorage();
    },

    add(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                ...product,
                quantity: product.quantity || 1
            });
        }

        this.saveToStorage();
        this.updateUI();
    },

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateUI();
    },

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.remove(productId);
            } else {
                this.saveToStorage();
                this.updateUI();
            }
        }
    },

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },

    saveToStorage() {
        localStorage.setItem('latinbite_cart', JSON.stringify(this.items));
    },

    loadFromStorage() {
        const stored = localStorage.getItem('latinbite_cart');
        if (stored) {
            this.items = JSON.parse(stored);
        }
    },

    updateUI() {
        // Update cart badge/count in UI when implemented
        const event = new CustomEvent('cartUpdated', { detail: { count: this.getItemCount() } });
        document.dispatchEvent(event);
    },

    clear() {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
    }
};

/**
 * Products Module (Placeholder for future e-commerce integration)
 */
const Products = {
    items: [
        {
            id: 'tequenos-clasicos-12',
            name: 'Tequeños Clásicos',
            description: 'Auténticos tequeños venezolanos rellenos de queso gouda',
            price: 1990,
            currency: 'ISK',
            sizes: ['12 uds', '24 uds', '48 uds'],
            image: null,
            category: 'tequeños',
            available: true
        }
    ],

    getAll() {
        return this.items;
    },

    getById(id) {
        return this.items.find(item => item.id === id);
    },

    getByCategory(category) {
        return this.items.filter(item => item.category === category);
    }
};

// ============================================
// APP INITIALIZATION
// ============================================
const App = {
    init() {
        // Initialize all modules
        Loader.init();
        Header.init();
        Navigation.init();
        BackToTop.init();
        CounterAnimation.init();
        GalleryFilter.init();
        TestimonialsSlider.init();
        ContactForm.init();
        ScrollAnimations.init();

        // E-commerce ready modules
        Cart.init();

        console.log('🧀 Latinbite website initialized successfully!');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

// Export modules for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, Cart, Products, Utils };
}
