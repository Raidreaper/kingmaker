// Scrollytelling effects for About page using GSAP ScrollTrigger
// Since @bsmnt/scrollytelling requires React, we'll use GSAP directly (which it uses under the hood)
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function initAboutScrollytelling() {
  // Check if we're on the about page
  if (!document.body.classList.contains('about-page')) {
    return;
  }

  // Respect reduced motion preference and optimize for mobile
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 720;
  
  if (prefersReducedMotion) {
    return;
  }

  // Hero section fade-in animation
  const heroSection = document.querySelector('.about-hero');
  if (heroSection) {
    gsap.from(heroSection, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none none',
        once: true
      }
    });
  }

  // Philosophy section header animation
  const philosophyHeader = document.querySelector('.philosophy-section .section-header');
  if (philosophyHeader) {
    gsap.from(philosophyHeader, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: philosophyHeader,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none none',
        once: true
      }
    });
  }

  // Philosophy section parallax (subtle depth effect - disabled on mobile)
  const philosophySection = document.querySelector('.philosophy-section');
  if (philosophySection && !isMobile) {
    gsap.to(philosophySection, {
      y: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: philosophySection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  // Staggered animation for philosophy cards (like Stagger component)
  const philosophyCards = document.querySelectorAll('.philosophy-card');
  if (philosophyCards.length > 0) {
    gsap.from(philosophyCards, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.7,
      ease: 'back.out(1.1)',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.philosophy-grid',
        start: 'top 80%',
        end: 'top 40%',
        toggleActions: 'play none none none',
        once: true
      }
    });
  }

  // Personal section header animation
  const personalHeader = document.querySelector('.personal-section .section-header');
  if (personalHeader) {
    gsap.from(personalHeader, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: personalHeader,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none none',
        once: true
      }
    });
  }

  // Personal section parallax (subtle depth effect - disabled on mobile)
  const personalSection = document.querySelector('.personal-section');
  if (personalSection && !isMobile) {
    gsap.to(personalSection, {
      y: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: personalSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  // Personal content card animation
  const personalCard = document.querySelector('.personal-text');
  if (personalCard) {
    gsap.from(personalCard, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: personalCard,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none none',
        once: true
      }
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

  // Refresh on window resize (debounced)
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(refreshScrollTrigger, 300);
  };
  window.addEventListener('resize', handleResize, { passive: true });

  // Refresh after images load
  const images = document.querySelectorAll('img');
  if (images.length > 0) {
    let loadedImages = 0;
    images.forEach(img => {
      if (img.complete && img.naturalHeight !== 0) {
        loadedImages++;
      } else {
        img.addEventListener('load', () => {
          loadedImages++;
          if (loadedImages === images.length) {
            refreshScrollTrigger();
          }
        }, { once: true });
        
        img.addEventListener('error', () => {
          loadedImages++;
          if (loadedImages === images.length) {
            refreshScrollTrigger();
          }
        }, { once: true });
      }
    });
    if (loadedImages === images.length) {
      refreshScrollTrigger();
    }
  } else {
    refreshScrollTrigger();
  }

  // Cleanup function
  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    window.removeEventListener('resize', handleResize);
  };
}

