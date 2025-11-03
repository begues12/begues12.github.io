// DJ KONIK - Advanced Interactive Effects
// Modern Makina Experience

class DJKonikEffects {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }

    init() {
        this.createNeonParticles();
        this.setupAudioVisualization();
        // Only setup complex hover effects on desktop
        if (!this.isMobile) {
            this.setupInteractiveHovers();
        }
        this.setupScrollEffects();
    }

    // Create floating neon particles
    createNeonParticles() {
        // Detect if it's mobile for performance optimization
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 50 : 150; // Fewer particles on mobile
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        document.body.appendChild(particleContainer);

        // Create particles with mobile optimization
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(particleContainer, isMobile);
        }
    }

    createParticle(container, isMobile = false) {
        const particle = document.createElement('div');
        const colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#8000ff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Optimize particle size and effects for mobile
        const size = isMobile ? '2px' : '4px';
        const blurAmount = isMobile ? '5px' : '10px';
        const animationDuration = isMobile ? (8 + Math.random() * 12) : (5 + Math.random() * 10);
        
        particle.style.cssText = `
            position: absolute;
            width: ${size};
            height: ${size};
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${blurAmount} ${color};
            opacity: ${isMobile ? '0.5' : '0.7'};
            animation: float ${animationDuration}s linear infinite;
            will-change: transform, opacity;
        `;

        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        container.appendChild(particle);

        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.createParticle(container, isMobile);
            }
        }, animationDuration * 1000);
    }

    // Setup audio visualization effect
    setupAudioVisualization() {
        const musicCards = document.querySelectorAll('.music-card');
        
        musicCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createRippleEffect(card);
            });
        });
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(0, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Interactive hover effects
    setupInteractiveHovers() {
        const cards = document.querySelectorAll('.music-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
            });
        });
    }

    // Scroll-based effects
    setupScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe all music cards
        document.querySelectorAll('.music-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Glitch effect for text
    static glitchText(element, duration = 100) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let glitchInterval = setInterval(() => {
            let glitchedText = '';
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            element.textContent = glitchedText;
        }, 50);

        setTimeout(() => {
            clearInterval(glitchInterval);
            element.textContent = originalText;
        }, duration);
    }
}

// Enhanced CSS animations
const additionalStyles = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.7;
        }
        90% {
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }

    /* Mobile optimizations for particles */
    @media (max-width: 768px) {
        .particle-container {
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
        }
        
        @keyframes float {
            0% {
                transform: translateY(120vh);
                opacity: 0;
            }
            15% {
                opacity: 0.4;
            }
            85% {
                opacity: 0.4;
            }
            100% {
                transform: translateY(-120vh);
                opacity: 0;
            }
        }
    }

    @keyframes ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }

    @keyframes animate-in {
        0% {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .animate-in {
        animation: animate-in 0.8s ease-out forwards;
    }

    .music-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    /* Enhanced neon glow for interactive elements */
    .music-card:hover::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #00ffff, #ff00ff, #00ff00, #ffff00);
        border-radius: 17px;
        z-index: -1;
        opacity: 0.7;
        filter: blur(10px);
        animation: rotate-border 2s linear infinite;
    }

    @keyframes rotate-border {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Responsive improvements */
    @media (max-width: 768px) {
        .music-card:hover::before {
            display: none;
        }
    }
`;

// Add enhanced styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DJKonikEffects();
    
    // Add glitch effect to main title on click
    const djName = document.querySelector('.dj-name');
    if (djName) {
        djName.addEventListener('click', () => {
            DJKonikEffects.glitchText(djName, 200);
        });
    }
});