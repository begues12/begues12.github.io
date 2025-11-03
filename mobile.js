// Mobile Utilities for DJ Konik Website
// Enhanced mobile experience with touch optimizations

class MobileOptimizer {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTouch = 'ontouchstart' in window;
        this.userHasInteracted = false;
        this.vibrationSupported = false;
        this.init();
    }

    init() {
        this.setupUserInteractionDetection();
        if (this.isMobile) {
            this.setupMobileOptimizations();
            this.setupTouchGestures();
            this.setupPerformanceOptimizations();
            this.setupMobileNavigation();
        }
    }

    setupUserInteractionDetection() {
        const handleFirstInteraction = () => {
            this.userHasInteracted = true;
            // Test vibration capability after first interaction
            this.testVibrationSupport();
            
            // Remove all listeners after first interaction
            ['touchstart', 'touchend', 'mousedown', 'click', 'keydown'].forEach(event => {
                document.removeEventListener(event, handleFirstInteraction);
            });
        };

        // Listen for various types of user interaction
        ['touchstart', 'touchend', 'mousedown', 'click', 'keydown'].forEach(event => {
            document.addEventListener(event, handleFirstInteraction, { 
                once: true, 
                passive: true 
            });
        });
    }

    testVibrationSupport() {
        if ('vibrate' in navigator && this.userHasInteracted) {
            try {
                // Test with a very short vibration
                const result = navigator.vibrate(1);
                this.vibrationSupported = result !== false;
            } catch (error) {
                this.vibrationSupported = false;
            }
        } else {
            this.vibrationSupported = false;
        }
    }

    setupMobileOptimizations() {
        // Add mobile class to body
        document.body.classList.add('mobile-device');

        // Optimize animations for mobile
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                *, *::before, *::after {
                    animation-duration: 0.3s !important;
                    transition-duration: 0.3s !important;
                }
                
                /* Ensure particles work on mobile */
                .particle-container {
                    transform: translateZ(0) !important;
                    -webkit-transform: translateZ(0) !important;
                    will-change: transform;
                }
            }
        `;
        document.head.appendChild(style);

        // Prevent zoom on form inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.fontSize = '16px';
        });

        // Optimize particle performance on mobile
        this.optimizeParticlesForMobile();
    }

    optimizeParticlesForMobile() {
        // Wait for particles to be created, then optimize them
        setTimeout(() => {
            const particleContainer = document.querySelector('.particle-container');
            if (particleContainer) {
                // Force hardware acceleration
                particleContainer.style.transform = 'translateZ(0)';
                particleContainer.style.willChange = 'transform';
                
                // Reduce particle update frequency on mobile
                const particles = particleContainer.querySelectorAll('div');
                particles.forEach(particle => {
                    particle.style.willChange = 'transform, opacity';
                });
            }
        }, 1000);
    }

    setupTouchGestures() {
        let startY = 0;
        let startX = 0;

        // Music cards swipe interaction
        document.querySelectorAll('.music-card').forEach(card => {
            card.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
                card.style.transform = 'scale(0.98)';
                
                // Provide haptic feedback on touch start
                if (this.userHasInteracted) {
                    this.safeVibrate(5); // Very light vibration
                }
            }, { passive: true });

            card.addEventListener('touchmove', (e) => {
                // Only prevent default if it's a horizontal swipe
                const currentX = e.touches[0].clientX;
                const diffX = Math.abs(startX - currentX);
                if (diffX > 10) {
                    e.preventDefault(); // Prevent scrolling while swiping horizontally
                }
            }, { passive: false });

            card.addEventListener('touchend', (e) => {
                const endY = e.changedTouches[0].clientY;
                const endX = e.changedTouches[0].clientX;
                const diffY = startY - endY;
                const diffX = startX - endX;

                // Reset scale
                card.style.transform = '';

                // Simple swipe detection (optional feature)
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    // Horizontal swipe detected
                    this.showSwipeEffect(card, diffX > 0 ? 'left' : 'right');
                    // Stronger vibration for successful swipe
                    if (this.userHasInteracted) {
                        this.safeVibrate(15);
                    }
                }
            }, { passive: true });
        });
    }

    showSwipeEffect(element, direction) {
        element.style.transform = `translateX(${direction === 'left' ? '-20px' : '20px'})`;
        element.style.opacity = '0.7';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.opacity = '';
        }, 200);
    }

    setupPerformanceOptimizations() {
        // Lazy load images with intersection observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Debounce scroll events
        let scrollTimer = null;
        window.addEventListener('scroll', () => {
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(() => {
                this.handleScroll();
            }, 100);
        }, { passive: true });
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        const header = document.querySelector('.main-header');
        
        // Add/remove sticky header effects
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    setupMobileNavigation() {
        // Enhanced smooth scrolling for mobile
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add haptic feedback for supported devices
        this.addHapticFeedback();
    }

    addHapticFeedback() {
        if (!('vibrate' in navigator)) return;
        
        document.querySelectorAll('.cta-button, .music-card').forEach(element => {
            element.addEventListener('touchstart', () => {
                // Only vibrate if user has already interacted with the page
                if (this.userHasInteracted) {
                    this.safeVibrate(10);
                }
            }, { passive: true });
        });
    }

    safeVibrate(duration) {
        // Only attempt vibration if all conditions are met
        if (this.vibrationSupported && this.userHasInteracted && 'vibrate' in navigator) {
            try {
                navigator.vibrate(duration);
            } catch (error) {
                // Disable future vibration attempts if they fail
                this.vibrationSupported = false;
            }
        }
    }

    // Public method to update mobile status on resize
    updateMobileStatus() {
        this.isMobile = window.innerWidth <= 768;
        if (this.isMobile && !document.body.classList.contains('mobile-device')) {
            this.init();
        } else if (!this.isMobile && document.body.classList.contains('mobile-device')) {
            document.body.classList.remove('mobile-device');
        }
    }
}

// Enhanced CSS for mobile-specific improvements
const mobileStyles = `
    .mobile-device .main-header.scrolled {
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        transition: all 0.3s ease;
    }

    .mobile-device .music-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .mobile-device .music-card:active {
        transform: scale(0.98);
    }

    /* Improved touch targets */
    @media (max-width: 768px) {
        .cta-button {
            min-height: 48px;
            min-width: 48px;
        }

        .contact-info a {
            display: inline-block;
            padding: 8px;
            margin: -8px;
        }

        /* Better visual feedback */
        .music-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1));
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            border-radius: inherit;
        }

        .music-card:active::after {
            opacity: 1;
        }

        /* Optimize for one-handed use */
        .footer-section .cta-button {
            width: 100%;
            margin-bottom: 1rem;
        }
    }

    /* Landscape orientation improvements */
    @media (max-width: 768px) and (orientation: landscape) {
        .hero-banner {
            height: 80vh;
        }

        .header-content {
            padding: 0.5rem 1rem;
        }

        .dj-name-img {
            max-width: 150px;
        }

        .dj-subtitle {
            font-size: 1rem;
        }
    }
`;

// Add mobile styles to document
const mobileStyleSheet = document.createElement('style');
mobileStyleSheet.textContent = mobileStyles;
document.head.appendChild(mobileStyleSheet);

// Initialize mobile optimizer
let mobileOptimizer;
document.addEventListener('DOMContentLoaded', () => {
    mobileOptimizer = new MobileOptimizer();
});

// Handle resize and orientation changes
window.addEventListener('resize', () => {
    if (mobileOptimizer) {
        mobileOptimizer.updateMobileStatus();
    }
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (mobileOptimizer) {
            mobileOptimizer.updateMobileStatus();
        }
        // Fix viewport height after orientation change
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100);
});