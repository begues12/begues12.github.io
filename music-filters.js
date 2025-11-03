/**
 * Premium Music Gallery Filters
 * Ultra-professional filtering system for DJ Konik's discography
 */

class PremiumMusicFilters {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.musicCards = document.querySelectorAll('.music-card[data-category]');
    this.activeFilter = 'all';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupObserver();
    this.animateOnLoad();
  }

  setupEventListeners() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = button.getAttribute('data-filter');
        this.filterMusic(filter);
        this.updateActiveButton(button);
      });
    });
  }

  filterMusic(category) {
    this.activeFilter = category;

    this.musicCards.forEach((card, index) => {
      const cardCategory = card.getAttribute('data-category');
      const shouldShow = category === 'all' || cardCategory === category;

      if (shouldShow) {
        // Mostrar con animación escalonada
        setTimeout(() => {
          card.classList.remove('hidden');
          card.style.animationDelay = `${index * 0.1}s`;
        }, index * 50);
      } else {
        // Ocultar inmediatamente
        card.classList.add('hidden');
      }
    });

    // Actualizar contador si existe
    this.updateCounter(category);
  }

  updateActiveButton(activeButton) {
    // Remover clase activa de todos los botones
    this.filterButtons.forEach(btn => {
      btn.classList.remove('filter-btn--active');
      btn.setAttribute('aria-pressed', 'false');
    });

    // Agregar clase activa al botón seleccionado
    activeButton.classList.add('filter-btn--active');
    activeButton.setAttribute('aria-pressed', 'true');

    // Efectos de sonido si está disponible
    this.playFilterSound();
  }

  updateCounter(category) {
    const visibleCards = category === 'all' 
      ? this.musicCards.length 
      : document.querySelectorAll(`.music-card[data-category="${category}"]`).length;

    // Actualizar contador en la UI si existe
    const counter = document.querySelector('.music-counter');
    if (counter) {
      counter.textContent = `${visibleCards} tracks`;
      counter.style.animation = 'counterUpdate 0.3s ease';
    }
  }

  animateOnLoad() {
    // Animación de entrada para las tarjetas
    this.musicCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.9)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
    });
  }

  setupObserver() {
    // Intersection Observer para animaciones al scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    this.musicCards.forEach(card => {
      observer.observe(card);
    });
  }

  playFilterSound() {
    // Efecto de sonido sutil si está habilitado
    if (window.AudioContext && this.shouldPlaySounds()) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }

  shouldPlaySounds() {
    // Verificar preferencias del usuario
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Método público para cambiar filtro programáticamente
  setFilter(category) {
    const button = document.querySelector(`[data-filter="${category}"]`);
    if (button) {
      this.filterMusic(category);
      this.updateActiveButton(button);
    }
  }

  // Método para obtener estadísticas
  getStats() {
    const stats = {};
    this.musicCards.forEach(card => {
      const category = card.getAttribute('data-category');
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Verificar que existan los elementos necesarios
  if (document.querySelector('.music-filters') && document.querySelector('.music-grid')) {
    window.musicFilters = new PremiumMusicFilters();
  }
});

// Agregar estilos CSS dinámicos
const style = document.createElement('style');
style.textContent = `
  .music-card.animate-in {
    animation: cardSlideIn 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  @keyframes cardSlideIn {
    0% {
      opacity: 0;
      transform: translateY(50px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes counterUpdate {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .music-card.hidden {
    opacity: 0 !important;
    transform: scale(0.8) translateY(20px) !important;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  }

  .filter-btn {
    position: relative;
    overflow: hidden;
  }

  .filter-btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease;
  }

  .filter-btn:active::after {
    width: 300px;
    height: 300px;
  }
`;

if (document.head) {
  document.head.appendChild(style);
} else {
  document.addEventListener('DOMContentLoaded', () => {
    document.head.appendChild(style);
  });
}

// Exportar para uso externo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PremiumMusicFilters;
}