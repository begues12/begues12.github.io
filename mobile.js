// DJ KONIK - Mobile Optimization System
class DJKonikMobile {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }

    init() {
        this.setupViewportFixes();
        this.setupMobileMenu();
        this.setupMobileOptimizations();
        this.setupTouchOptimizations();
        this.setupResponsiveImages();
        this.handleOrientationChange();
    }

    setupViewportFixes() {
        // Fix viewport height for mobile browsers
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', () => {
            setTimeout(setVH, 100);
        });
        
        // Fix iOS Safari viewport issues
        if (this.isIOS()) {
            if (window.visualViewport) {
                const updateViewport = () => {
                    const vh = window.visualViewport.height * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                };
                window.visualViewport.addEventListener('resize', updateViewport);
            }
        }
    }

    setupMobileMenu() {
        // Create mobile menu button if it doesn't exist
        const nav = document.querySelector('.nav-container');
        if (nav && !document.querySelector('.mobile-menu-toggle')) {
            const menuButton = document.createElement('button');
            menuButton.className = 'mobile-menu-toggle';
            menuButton.setAttribute('aria-label', 'Toggle Menu');
            menuButton.innerHTML = `
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            `;
            nav.appendChild(menuButton);
        }

        // Mobile menu functionality
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });

            // Close menu when clicking nav links
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            const isActive = menuToggle.classList.contains('active');
            
            if (isActive) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    openMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const header = document.querySelector('.header');
        
        if (menuToggle && navMenu) {
            menuToggle.classList.add('active');
            navMenu.classList.add('active');
            document.body.classList.add('menu-open');
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            
            // Keep header visible when menu is open
            if (header) {
                header.style.transform = 'translateY(0)';
            }
            
            // Haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }
    }

    closeMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Restore scrolling
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            
            // Haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(25);
            }
        }
    }

    setupMobileOptimizations() {
        if (this.isMobile) {
            // Add mobile class to body
            document.body.classList.add('mobile-device');
            
            // Enable smooth scrolling on iOS
            document.body.style.webkitOverflowScrolling = 'touch';
            
            // Prevent horizontal scroll
            document.body.style.overflowX = 'hidden';
            
            // Force single column layout
            const musicGrid = document.querySelector('.music-grid');
            if (musicGrid) {
                musicGrid.style.gridTemplateColumns = '1fr';
                musicGrid.style.maxWidth = '500px';
                musicGrid.style.margin = '0 auto';
            }
            
            // Optimize touch actions
            const interactiveElements = document.querySelectorAll('button, a, .music-card, .filter-btn');
            interactiveElements.forEach(element => {
                element.style.touchAction = 'manipulation';
                element.style.webkitTapHighlightColor = 'transparent';
            });
            
            // Setup header scroll behavior
            this.setupScrollHeader();
            
            // Disable zoom on input focus
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.setAttribute('content', 
                            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    }
                });
                
                input.addEventListener('blur', () => {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.setAttribute('content', 
                            'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
                    }
                });
            });
        }
    }

    setupScrollHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let isScrolling = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Add scrolled class when scrolling down
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                // Scrolling down - hide header unless menu is open
                if (!document.body.classList.contains('menu-open')) {
                    header.style.transform = 'translateY(-100%)';
                }
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
            isScrolling = false;
        };

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                requestAnimationFrame(handleScroll);
                isScrolling = true;
            }
        }, { passive: true });
    }

    setupTouchOptimizations() {
        // Add enhanced touch feedback to cards
        const musicCards = document.querySelectorAll('.music-card');
        musicCards.forEach(card => {
            let touchTimeout;
            let touchStartTime;
            
            card.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                card.classList.add('touch-active');
                
                // Haptic feedback
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
                
                touchTimeout = setTimeout(() => {
                    card.classList.add('touch-hold');
                    if ('vibrate' in navigator) {
                        navigator.vibrate(25);
                    }
                }, 200);
            }, { passive: true });
            
            card.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                clearTimeout(touchTimeout);
                
                // Add haptic class based on touch duration
                if (touchDuration < 100) {
                    card.classList.add('haptic-light');
                } else if (touchDuration < 300) {
                    card.classList.add('haptic-medium');
                } else {
                    card.classList.add('haptic-heavy');
                }
                
                setTimeout(() => {
                    card.classList.remove('touch-active', 'touch-hold', 'haptic-light', 'haptic-medium', 'haptic-heavy');
                }, 150);
            }, { passive: true });
            
            card.addEventListener('touchcancel', () => {
                clearTimeout(touchTimeout);
                card.classList.remove('touch-active', 'touch-hold');
            }, { passive: true });
        });

        // Enhanced scroll behavior with momentum
        let lastScrollY = window.scrollY;
        let scrollDirection = 'up';
        let isScrolling = false;
        const header = document.querySelector('.header');
        
        if (header) {
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                const scrollDifference = Math.abs(currentScrollY - lastScrollY);
                
                // Only act on significant scroll movements
                if (scrollDifference > 5) {
                    scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
                    
                    if (scrollDirection === 'down' && currentScrollY > 100) {
                        header.style.transform = 'translateY(-100%)';
                    } else if (scrollDirection === 'up') {
                        header.style.transform = 'translateY(0)';
                    }
                    
                    lastScrollY = currentScrollY;
                }
                
                // Throttle scroll events
                if (!isScrolling) {
                    window.requestAnimationFrame(() => {
                        this.updateScrollProgress();
                        isScrolling = false;
                    });
                    isScrolling = true;
                }
            }, { passive: true });
        }

        // Add pull-to-refresh functionality
        this.setupPullToRefresh();
    }

    updateScrollProgress() {
        const scrollProgress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
    }

    setupPullToRefresh() {
        let startY = 0;
        let pullDistance = 0;
        const refreshThreshold = 100;
        let isRefreshing = false;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && !isRefreshing) {
                pullDistance = e.touches[0].clientY - startY;
                
                if (pullDistance > 0) {
                    e.preventDefault();
                    const pullPercentage = Math.min(pullDistance / refreshThreshold, 1);
                    
                    // Show pull indicator
                    this.showPullIndicator(pullPercentage);
                }
            }
        });

        document.addEventListener('touchend', () => {
            if (pullDistance > refreshThreshold && !isRefreshing) {
                this.triggerRefresh();
            } else {
                this.hidePullIndicator();
            }
            pullDistance = 0;
        }, { passive: true });
    }

    showPullIndicator(percentage) {
        let indicator = document.querySelector('.pull-to-refresh');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'pull-to-refresh';
            indicator.innerHTML = percentage >= 1 ? '↻ Release to refresh' : '↓ Pull to refresh';
            document.body.appendChild(indicator);
        }
        
        indicator.style.opacity = Math.min(percentage, 1);
        indicator.classList.toggle('visible', percentage > 0.3);
    }

    hidePullIndicator() {
        const indicator = document.querySelector('.pull-to-refresh');
        if (indicator) {
            indicator.classList.remove('visible');
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }

    triggerRefresh() {
        // Simulate refresh action
        const indicator = document.querySelector('.pull-to-refresh');
        if (indicator) {
            indicator.innerHTML = '↻ Refreshing...';
            indicator.style.opacity = 1;
            
            setTimeout(() => {
                this.hidePullIndicator();
                // Here you would typically reload content
                console.log('Content refreshed!');
            }, 1500);
        }
    }

    setupResponsiveImages() {
        // Lazy load images for better mobile performance
        const images = document.querySelectorAll('img[loading="lazy"]');
        
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
                rootMargin: '50px 0px'
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // Error handling for images
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            img.addEventListener('error', () => {
                img.style.display = 'none';
            });
        });
    }

    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Force layout recalculation after orientation change
            setTimeout(() => {
                this.setupViewportFixes();
                
                // Trigger resize event
                window.dispatchEvent(new Event('resize'));
                
                // Close mobile menu if open
                this.closeMobileMenu();
            }, 100);
        });
    }

    // Utility methods
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
}

// Initialize mobile optimization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const mobileOptimizer = new DJKonikMobile();
    
    // Update mobile status on resize
    window.addEventListener('resize', () => {
        const wasMobile = mobileOptimizer.isMobile;
        mobileOptimizer.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== mobileOptimizer.isMobile) {
            // Re-initialize if mobile status changed
            mobileOptimizer.setupMobileOptimizations();
        }
    });
});

// Add CSS for mobile menu toggle
const mobileCSS = `
.mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3px;
    z-index: 1001;
}

.hamburger-line {
    width: 25px;
    height: 2px;
    background: var(--neon-cyan, #00ffff);
    transition: all 0.3s ease;
    transform-origin: center;
    box-shadow: 0 0 5px currentColor;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
    opacity: 0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}

@media (max-width: 768px) {
    .mobile-menu-toggle {
        display: flex;
    }
    
    .nav-menu {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(10, 10, 10, 0.98);
        backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 2rem 1rem;
        transform: translateY(-100%);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .nav-menu.active {
        transform: translateY(0);
        opacity: 1;
    }
    
    .nav-menu li {
        margin: 0.5rem 0;
    }
    
    .nav-menu a {
        font-size: 1.1rem;
        padding: 1rem 0;
        display: block;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .music-card.touch-active {
        transform: scale(0.98);
        opacity: 0.8;
    }
    
    .music-card.touch-hold {
        transform: scale(0.95);
    }
}
`;

// Inject mobile CSS
const styleElement = document.createElement('style');
styleElement.textContent = mobileCSS;
document.head.appendChild(styleElement);