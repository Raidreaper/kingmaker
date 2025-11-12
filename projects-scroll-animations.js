// Optimized scroll-trigger animations for Projects page using GSAP ScrollTrigger
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function initProjectsScrollAnimations() {
  // Check if we're on the projects page
  if (!document.body.classList.contains('projects-page')) {
    return;
  }

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  const panels = document.querySelectorAll('.project-panel');
  if (!panels.length) return;

  // Optimize: Batch DOM reads and handle resize
  let isMobile = window.innerWidth <= 960;
  
  // Update mobile state on resize
  const updateMobileState = () => {
    isMobile = window.innerWidth <= 960;
  };
  window.addEventListener('resize', updateMobileState, { passive: true });
  
  // Use IntersectionObserver for initial visibility check (faster than ScrollTrigger for initial setup)
  const observerOptions = {
    rootMargin: '50px',
    threshold: 0.1
  };

  panels.forEach((panel, index) => {
    const isOdd = index % 2 === 0;
    const projectInfo = panel.querySelector('.project-info');
    const projectMedia = panel.querySelector('.project-media');
    const projectCard = panel.querySelector('.project-card');
    const title = panel.querySelector('h2');
    const description = panel.querySelector('.project-info p');
    const tags = panel.querySelectorAll('.tech-tags .tag');
    const links = panel.querySelectorAll('.project-links a, .project-links button');
    const accent = panel.querySelector('.panel-accent');

    // Set initial hidden states (batch for performance)
    if (projectInfo) gsap.set(projectInfo, { opacity: 0 });
    if (projectMedia) gsap.set(projectMedia, { opacity: 0 });
    if (title) gsap.set(title, { opacity: 0, y: 30 });
    if (description) gsap.set(description, { opacity: 0, y: 20 });
    if (tags.length) gsap.set(tags, { opacity: 0, scale: 0.9 });
    if (links.length) gsap.set(links, { opacity: 0, y: 15 });
    
    if (projectCard && !isMobile) {
      // Simplified initial transforms
      gsap.set(projectCard, { 
        opacity: 0, 
        x: isOdd ? 60 : -60,
        scale: 0.9
      });
    } else if (projectCard) {
      gsap.set(projectCard, { opacity: 0, y: 30 });
    }

    if (accent) {
      gsap.set(accent, { opacity: 0 });
    }

    // Create single optimized timeline per panel
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none none',
        once: true, // Only animate once for better performance
        markers: false,
      }
    });

    // Animate elements in sequence (optimized timing)
    if (projectInfo) {
      tl.to(projectInfo, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0);
    }

    if (title) {
      tl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.1);
    }

    if (description) {
      tl.to(description, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.2);
    }

    if (tags.length) {
      tl.to(tags, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.1)',
        stagger: 0.05
      }, 0.3);
    }

    if (links.length) {
      tl.to(links, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.08
      }, 0.4);
    }

    // Project card animation (simplified for performance)
    if (projectCard) {
      if (!isMobile) {
        tl.to(projectCard, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        }, 0.2);
      } else {
        tl.to(projectCard, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, 0.2);
      }
    }

    if (accent) {
      tl.to(accent, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.3);
    }

    // Simplified parallax (only on desktop, single ScrollTrigger per panel)
    if (projectCard && !isMobile) {
      gsap.to(projectCard, {
        y: isOdd ? -20 : 20,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2, // Smoother scrub value
        }
      });
    }
  });

  // Simplified scroll indicator animation
  const snapIndicator = document.querySelector('.snap-indicator');
  if (snapIndicator) {
    gsap.to(snapIndicator, {
      opacity: 0.4,
      y: 8,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }

  // Optimized refresh - only refresh once after all images load
  let refreshTimeout;
  const refreshScrollTrigger = () => {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(refreshScrollTrigger, 300);
  }, { passive: true });

  // Check if images are already loaded
  const images = document.querySelectorAll('.project-card img');
  let loadedCount = 0;
  const totalImages = images.length;

  if (totalImages === 0) {
    refreshScrollTrigger();
  } else {
    images.forEach(img => {
      if (img.complete && img.naturalHeight !== 0) {
        loadedCount++;
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            refreshScrollTrigger();
          }
        }, { once: true });
        
        img.addEventListener('error', () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            refreshScrollTrigger();
          }
        }, { once: true });
      }
    });

    if (loadedCount === totalImages) {
      refreshScrollTrigger();
    }
  }
}

// Initialize after a small delay to ensure DOM is ready and other scripts have loaded
function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to let other scripts initialize first
      requestAnimationFrame(() => {
        setTimeout(initProjectsScrollAnimations, 100);
      });
    });
  } else {
    requestAnimationFrame(() => {
      setTimeout(initProjectsScrollAnimations, 100);
    });
  }
}

init();
