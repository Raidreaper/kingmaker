// Enhanced Slideshow functionality with image preloading
export class AdvancedSlideshow {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.interval = null;
    this.isTransitioning = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }
  
  init() {
    // Preload all images first
    this.preloadImages().then(() => {
      this.startSlideshow();
      this.setupEventListeners();
    });
  }
  
  preloadImages() {
    const imagePromises = Array.from(this.slides).map(slide => {
      const img = slide.querySelector('img');
      if (img && img.src) {
        return new Promise((resolve, reject) => {
          const tempImg = new Image();
          tempImg.onload = () => resolve();
          tempImg.onerror = () => reject();
          tempImg.src = img.src;
        });
      }
      return Promise.resolve();
    });
    
    return Promise.all(imagePromises);
  }
  
  startSlideshow() {
    this.interval = setInterval(() => {
      if (!this.isTransitioning) {
        this.nextSlide();
      }
    }, 4500);
  }
  
  nextSlide() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // Remove active class from current slide
    this.slides[this.currentSlide].classList.remove('active');
    
    // Move to next slide
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    
    // Add active class to new slide
    this.slides[this.currentSlide].classList.add('active');
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }
  
  setupEventListeners() {
    // Pause slideshow on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
      slideshowContainer.addEventListener('mouseenter', () => {
        if (this.interval) {
          clearInterval(this.interval);
        }
      });
      
      slideshowContainer.addEventListener('mouseleave', () => {
        this.startSlideshow();
      });
    }
    
    // Touch events for mobile
    slideshowContainer.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slideshowContainer.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
    
    // Prevent default touch behaviors that might interfere
    slideshowContainer.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        this.nextSlide();
      } else {
        // Swipe right - previous slide
        this.previousSlide();
      }
    }
  }
  
  previousSlide() {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // Remove active class from current slide
    this.slides[this.currentSlide].classList.remove('active');
    
    // Move to previous slide
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    
    // Add active class to new slide
    this.slides[this.currentSlide].classList.add('active');
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AdvancedSlideshow();
});
