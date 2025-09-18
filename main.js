// Particles system
class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
}

// Initialize particles
function initParticles() {
  const particlesContainer = document.getElementById('particles-js');
  if (!particlesContainer) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particlesContainer.appendChild(canvas);

  const particles = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas, ctx));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Theme management
const themes = [
  'theme-1', // Purple
  'theme-2', // Blue
  'theme-3', // Green
  'theme-4', // Red
  'theme-5', // Orange
  'theme-6'  // Teal
];

let currentThemeIndex = 0;

// Function to change theme
function changeTheme() {
  const body = document.body;
  
  // Remove current theme
  body.classList.remove(themes[currentThemeIndex]);
  
  // Move to next theme
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  
  // Add new theme
  body.classList.add(themes[currentThemeIndex]);
  
  // Update Three.js background colors to match theme
  if (window.threeBackground) {
    window.threeBackground.updateTheme(currentThemeIndex);
  }
  
  // Add transition animation
  body.classList.add('theme-transition');
  
  // Remove animation class after animation completes
  setTimeout(() => {
    body.classList.remove('theme-transition');
  }, 1000);
}

// Initialize with first theme
document.body.classList.add(themes[currentThemeIndex]);

// Change theme every 10 seconds
setInterval(changeTheme, 10000);

// Initialize Three.js background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Remove old particle system initialization
  // initParticles(); // Replaced by Three.js
  
  initModals();
  initNavigationDropdown();
  initEntranceAnimations();
});

// Modal functionality
function initModals() {
  // CV Modal
  const cvBtn = document.getElementById('cvBtn');
  const cvModal = document.getElementById('cvModal');
  const closeCvModal = document.getElementById('closeCvModal');
  const closeCvModalBtn = document.getElementById('closeCvModalBtn');
  const downloadCvBtn = document.getElementById('downloadCvBtn');

  // Contact Modal
  const contactBtn = document.getElementById('contactBtn');
  const contactModal = document.getElementById('contactModal');
  const closeContactModal = document.getElementById('closeContactModal');
  const emailBtn = document.getElementById('emailBtn');
  const phoneBtn = document.getElementById('phoneBtn');

  // CV Modal Event Listeners
  if (cvBtn && cvModal) {
    cvBtn.addEventListener('click', () => {
      cvModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      // Initialize CV modal when opened
      initCvModal();
    });
  }

  if (closeCvModal && cvModal) {
    closeCvModal.addEventListener('click', () => {
      cvModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  if (closeCvModalBtn && cvModal) {
    closeCvModalBtn.addEventListener('click', () => {
      cvModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // CV Download Buttons
  const downloadCvPdfBtn = document.getElementById('downloadCvPdfBtn');
  const downloadCvDocxBtn = document.getElementById('downloadCvDocxBtn');

  if (downloadCvPdfBtn) {
    downloadCvPdfBtn.addEventListener('click', () => {
      try {
        // Download PDF version
        const link = document.createElement('a');
        link.href = '/assets/Michael%20cv.pdf';
        link.download = 'Michael cv.pdf';
        link.click();
      } catch (error) {
        console.error('Error downloading CV PDF:', error);
        alert('Unable to download CV PDF. Please contact me directly for my CV.');
      }
    });
  }

  if (downloadCvDocxBtn) {
    downloadCvDocxBtn.addEventListener('click', () => {
      try {
        // Download DOCX version
        const link = document.createElement('a');
        link.href = '/assets/Michael%20cv.docx';
        link.download = 'Michael cv.docx';
        link.click();
      } catch (error) {
        console.error('Error downloading CV DOCX:', error);
        alert('Unable to download CV DOCX. Please contact me directly for my CV.');
      }
    });
  }

  // Contact Modal Event Listeners
  if (contactBtn && contactModal) {
  contactBtn.addEventListener('click', () => {
    contactModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
  }

  if (closeContactModal && contactModal) {
  closeContactModal.addEventListener('click', () => {
    contactModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  }

  // Email functionality
  if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    const email = 'Obaniwamichael17@gmail.com';
    const subject = 'Portfolio Inquiry';
    const body = 'Hello Obaniwa Michael,\n\nI would like to discuss a potential opportunity with you.\n\nBest regards,';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  });
  }

  // Phone functionality
  if (phoneBtn) {
  phoneBtn.addEventListener('click', () => {
    const phoneNumber = '08071897468';
    window.open(`tel:${phoneNumber}`);
  });
  }

  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    if (cvModal && event.target === cvModal) {
      cvModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    if (contactModal && event.target === contactModal) {
      contactModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Close modals with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (cvModal) {
      cvModal.style.display = 'none';
      }
      if (contactModal) {
      contactModal.style.display = 'none';
      }
      document.body.style.overflow = 'auto';
    }
  });
}

// Navigation dropdown functionality
function initNavigationDropdown() {
  // Handle header contact button
  const headerContactBtn = document.getElementById('headerContactBtn');
  const contactModal = document.getElementById('contactModal');
  
  if (headerContactBtn && contactModal) {
    headerContactBtn.addEventListener('click', () => {
      contactModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  }
  
  // Find all dropdown toggles and menus (for mobile menu)
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');
  const navItems = document.querySelectorAll('.nav-item.dropdown');
  
  if (dropdownToggles.length === 0) return;
  
  // Initialize each dropdown (mobile menu)
  dropdownToggles.forEach((dropdownToggle, index) => {
    const dropdownMenu = dropdownMenus[index];
    const navItem = navItems[index];
    
    if (!dropdownToggle || !dropdownMenu || !navItem) return;
  
  // Toggle dropdown on click
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
      e.stopPropagation();
      
      // Close all other dropdowns
      navItems.forEach(item => item.classList.remove('active'));
      
      // Toggle current dropdown
    navItem.classList.toggle('active');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    navItems.forEach(navItem => {
    if (!navItem.contains(e.target)) {
      navItem.classList.remove('active');
    }
  });
  });
}

// Interactive functionality
document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM selectors for better performance
  const cachedElements = {
    navLinks: document.querySelectorAll('.nav-link'),
    searchBtn: document.querySelector('.search-btn'),
    menuBtn: document.querySelector('.menu-btn'),
    socialLinks: document.querySelectorAll('.social-icon'),
    characterImage: document.querySelector('.character-image'),
    scrollIndicator: document.querySelector('.scroll-indicator'),
    characterContainer: document.querySelector('.character-container'),
    leftSection: document.querySelector('.left-section'),
    rightSection: document.querySelector('.right-section')
  };
  
  // Initialize navigation dropdowns
  initNavigationDropdown();
  
  // Initialize contact button functionality
  initContactButton();
  
  // Smooth scrolling for navigation links (only for internal page links)
  cachedElements.navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only prevent default for contact dropdown items, not for actual navigation
      if (this.href && this.href.includes('#')) {
      e.preventDefault();
      }
      // Let actual page navigation work normally
    });
  });

  // Header icon interactions
  if (cachedElements.searchBtn) {
    cachedElements.searchBtn.addEventListener('click', function() {
      // Search functionality placeholder - can be implemented later
    });
  }

  // Social media link interactions with bouncing effect
  cachedElements.socialLinks.forEach(link => {
    // Add bouncing class by default
    link.classList.add('bouncing');
    
    // Handle click to stop bouncing
    link.addEventListener('click', function(e) {
      // Stop the bouncing animation
      this.classList.remove('bouncing');
      
      // Add a small click effect
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // Prevent default only for internal links that need it
      if (this.href.includes('mailto:') || this.href.includes('tel:') || this.href.includes('wa.me')) {
        // Let these links work normally
        return;
      }
      
      // For other links, prevent default and handle manually if needed
      e.preventDefault();
    });
  });
  
  // Add double-click to restart bouncing (optional feature)
  cachedElements.socialLinks.forEach(link => {
    link.addEventListener('dblclick', function() {
      this.classList.add('bouncing');
    });
  });

  // Add hover effects for character image
  if (cachedElements.characterImage) {
    cachedElements.characterImage.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    cachedElements.characterImage.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }

  // Add parallax effect for character container with throttling
  let ticking = false;
  let scrollTimeout;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    if (cachedElements.characterContainer) {
      const rate = scrolled * -0.5;
      cachedElements.characterContainer.style.transform = `translateY(${rate}px)`;
    }
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Throttled scroll event for better performance
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(requestTick, 16); // 60fps throttling
  }, { passive: true });

  // Add typing effect for section titles
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }

  // Apply typing effect to titles after a delay
  setTimeout(() => {
    const titles = document.querySelectorAll('.section-title');
    titles.forEach((title, index) => {
      const originalText = title.textContent;
      setTimeout(() => {
        typeWriter(title, originalText, 50);
      }, index * 500);
    });
  }, 1000);

  // Enhanced 3D scroll indicator with interactive controls
  if (cachedElements.scrollIndicator) {
    // Add floating class for enhanced 3D floating
    cachedElements.scrollIndicator.classList.add('floating');
    
    // Interactive 3D rotation on click
    cachedElements.scrollIndicator.addEventListener('click', function() {
      // Toggle between floating and rotating animations
      if (this.classList.contains('rotating')) {
        this.classList.remove('rotating');
        this.classList.add('floating');
      } else {
        this.classList.remove('floating');
        this.classList.add('rotating');
      }
    });
    
    // Add scroll-responsive behavior
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      // Pause animations during scroll for better performance
      cachedElements.scrollIndicator.style.animationPlayState = 'paused';
      
      // Resume animations after scroll stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        cachedElements.scrollIndicator.style.animationPlayState = 'running';
      }, 150);
    }, { passive: true });
    
    // Add mouse movement tracking for dynamic 3D effect
    cachedElements.scrollIndicator.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (x - centerX) / 10;
      
      if (!this.classList.contains('rotating')) {
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      }
    });
    
    // Reset transform on mouse leave
    cachedElements.scrollIndicator.addEventListener('mouseleave', function() {
      if (!this.classList.contains('rotating')) {
        this.style.transform = '';
      }
    });
  }
});

// Add some additional visual effects
function addGlowEffect() {
  const character = document.querySelector('.character');
  if (character) {
    character.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))';
    
    setTimeout(() => {
      character.style.filter = 'none';
    }, 2000);
  }
}

// Trigger glow effect periodically
setInterval(addGlowEffect, 15000);

// Add theme indicator
function createThemeIndicator() {
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--accent-color);
    z-index: 1000;
    transition: all 0.3s ease;
    opacity: 0.7;
  `;
  
  document.body.appendChild(indicator);
  
  // Update indicator color when theme changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        indicator.style.background = getComputedStyle(document.body).getPropertyValue('--accent-color');
      }
    });
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
}

// Initialize theme indicator
setTimeout(createThemeIndicator, 1000);

// Entrance animations for containers
function initEntranceAnimations() {
  // Add staggered entrance animations for content inside containers
  const leftSection = document.querySelector('.left-section');
  const rightSection = document.querySelector('.right-section');
  const characterContainer = document.querySelector('.character-container');
  
  // Animate content inside left section
  if (leftSection) {
    const leftContent = leftSection.querySelectorAll('.section-title, .section-text, .cta-buttons');
    leftContent.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 1200 + (index * 200)); // Start after left section slides in
    });
  }
  
  // Animate content inside right section
  if (rightSection) {
    const rightContent = rightSection.querySelectorAll('.section-title, .section-text, .cta-buttons');
    rightContent.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 1500 + (index * 200)); // Start after right section slides in
    });
  }
  
  // Animate character image and scroll indicator
  if (characterContainer) {
    const characterImage = characterContainer.querySelector('.character-image');
    const scrollIndicator = characterContainer.querySelector('.scroll-indicator');
    
    if (characterImage) {
      characterImage.style.opacity = '0';
      characterImage.style.transform = 'scale(0.8)';
      characterImage.style.transition = 'all 0.8s ease';
      
      setTimeout(() => {
        characterImage.style.opacity = '1';
        characterImage.style.transform = 'scale(1)';
      }, 1800); // Start after character container rises up
    }
    
    if (scrollIndicator) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.transform = 'translateY(20px)';
      scrollIndicator.style.transition = 'all 0.6s ease';
      
      setTimeout(() => {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.transform = 'translateY(0)';
      }, 2200); // Start after character image appears
    }
  }
}

// Contact button functionality across all pages
function initContactButton() {
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function() {
      // Open contact modal if it exists, otherwise use dropdown
      const contactModal = document.getElementById('contactModal');
      if (contactModal) {
        contactModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      } else {
        // Fallback: trigger the contact dropdown
        const contactDropdown = document.querySelector('.nav-item.dropdown');
        if (contactDropdown) {
          contactDropdown.classList.add('active');
        }
      }
    });
  }
}

    // Mobile menu functionality removed - no longer needed

// CV Modal Helper Functions
function showCvPreview() {
  const cvLoading = document.getElementById('cvLoading');
  const cvIframe = document.getElementById('cvIframe');
  const cvError = document.getElementById('cvError');
  
  if (cvLoading) cvLoading.style.display = 'none';
  if (cvIframe) cvIframe.style.display = 'block';
  if (cvError) cvError.style.display = 'none';
}

function showCvError() {
  const cvLoading = document.getElementById('cvLoading');
  const cvIframe = document.getElementById('cvIframe');
  const cvError = document.getElementById('cvError');
  
  if (cvLoading) cvLoading.style.display = 'none';
  if (cvIframe) cvIframe.style.display = 'none';
  if (cvError) cvError.style.display = 'block';
}

// Retry CV loading function
function retryCvLoad() {
  const cvLoading = document.getElementById('cvLoading');
  const cvIframe = document.getElementById('cvIframe');
  const cvError = document.getElementById('cvError');
  
  if (cvLoading) cvLoading.style.display = 'block';
  if (cvIframe) cvIframe.style.display = 'none';
  if (cvError) cvError.style.display = 'none';
  
  // Reload the iframe
  if (cvIframe) {
    cvIframe.src = cvIframe.src;
  }
}

// Initialize CV Modal with proper event handling
function initCvModal() {
  const cvIframe = document.getElementById('cvIframe');
  const cvLoading = document.getElementById('cvLoading');
  const cvError = document.getElementById('cvError');
  
  if (cvIframe) {
    // Reset states
    if (cvLoading) cvLoading.style.display = 'block';
    if (cvIframe) cvIframe.style.display = 'none';
    if (cvError) cvError.style.display = 'none';
    
    // Set the correct path for the CV
    cvIframe.src = '/assets/Michael%20cv.pdf';
    
    // Add load event listener
    cvIframe.addEventListener('load', function() {
      // Check if iframe actually loaded the PDF content
      setTimeout(() => {
        try {
          // Try to access iframe content to verify PDF loaded
          if (cvIframe.contentDocument || cvIframe.contentWindow) {
            showCvPreview();
          } else {
            showCvError();
          }
        } catch (e) {
          // Cross-origin or other error, but PDF might still be loading
          showCvPreview();
        }
      }, 1500); // Increased timeout for PDF loading
    });
    
    // Add error event listener
    cvIframe.addEventListener('error', function() {
      showCvError();
    });
    
    // Set timeout for loading
    setTimeout(() => {
      if (cvLoading && cvLoading.style.display !== 'none') {
        showCvError();
      }
    }, 10000); // Increased timeout
  }
}

  // AI Chat System - Gemini AI Assistant (Vercel Version)
class PortfolioAIAssistant {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    // Use robust AI API endpoint
    this.apiUrl = '/api/ai';
    this.retryCount = 0;
    this.maxRetries = 3;
    this.isRetrying = false;
    this.init();
  }

  init() {
    this.fab = document.getElementById('aiChatFab');
    this.modal = document.getElementById('aiChatModal');
    this.overlay = document.getElementById('aiChatOverlay');
    this.messagesContainer = document.getElementById('aiChatMessages');
    this.input = document.getElementById('aiChatInput');
    this.sendBtn = document.getElementById('aiChatSend');
    this.closeBtn = document.getElementById('aiChatClose');

    this.bindEvents();
    this.addWelcomeMessage();
  }

  bindEvents() {
    // Open chat
    this.fab.addEventListener('click', () => this.openChat());
    
    // Close chat
    this.closeBtn.addEventListener('click', () => this.closeChat());
    this.overlay.addEventListener('click', () => this.closeChat());
    
    // Send message
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.closeChat();
    });
  }

  openChat() {
    this.isOpen = true;
    this.modal.classList.add('show');
    this.overlay.classList.add('show');
    this.input.focus();
    document.body.style.overflow = 'hidden';
  }

  closeChat() {
    this.isOpen = false;
    this.modal.classList.remove('show');
    this.overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
  }

  addWelcomeMessage() {
    const welcomeMessage = {
      type: 'ai',
      content: `👋 Hello! I'm RaidBot, your Portfolio AI Assistant powered by Gemini! 

I can help you understand this portfolio and answer questions about:
• The developer's skills and technologies
• Projects showcased here
• How to navigate the site
• Contact information
• And much more!

What would you like to know? 😊`
    };
    this.addMessage(welcomeMessage);
  }

  async sendMessage() {
    const userInput = this.input.value.trim();
    if (!userInput) return;

    // Add user message
    this.addMessage({ type: 'user', content: userInput });
    this.input.value = '';

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Get AI response from Gemini API
      const aiResponse = await this.getAIResponse(userInput);
      this.hideTypingIndicator();
      this.addMessage({ type: 'ai', content: aiResponse });
    } catch (error) {
      this.hideTypingIndicator();
      this.showErrorMessage(error);
    }
  }

  async getAIResponse(userInput) {
    return await this.executeWithRetry(async () => {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || `HTTP ${response.status}`);
        error.statusCode = response.status;
        error.type = this.classifyErrorType(response.status);
        throw error;
      }

      const data = await response.json();
      
      if (!data.success) {
        const error = new Error(data.error || 'AI service error');
        error.type = data.type || 'UNKNOWN';
        error.correlationId = data.correlationId;
        throw error;
      }

      return data.response;
    });
  }

  async executeWithRetry(operation) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        this.retryCount = attempt;
        this.isRetrying = attempt > 0;
        
        if (attempt > 0) {
          console.log(`Retrying AI request (attempt ${attempt + 1}/${this.maxRetries + 1})`);
          await this.sleep(this.calculateDelay(attempt));
        }
        
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (!this.shouldRetry(error, attempt)) {
          throw error;
        }
        
        if (attempt === this.maxRetries) {
          throw error;
        }
      }
    }
    
    throw lastError;
  }

  shouldRetry(error, attempt) {
    if (attempt >= this.maxRetries) return false;
    if (error.type === 'API_KEY') return false;
    if (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) return false;
    return true;
  }

  calculateDelay(attempt) {
    const baseDelay = 1000;
    const maxDelay = 10000;
    const multiplier = 2;
    
    let delay = baseDelay * Math.pow(multiplier, attempt);
    delay = Math.min(delay, maxDelay);
    return delay * (0.5 + Math.random() * 0.5); // Add jitter
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  classifyErrorType(statusCode) {
    switch (statusCode) {
      case 400:
      case 422:
        return 'CLIENT_ERROR';
      case 401:
      case 403:
        return 'API_KEY_ERROR';
      case 429:
        return 'RATE_LIMIT';
      case 408:
        return 'TIMEOUT';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'SERVER_ERROR';
      default:
        return 'UNKNOWN';
    }
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message ai';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="ai-message-avatar">🤖</div>
      <div class="ai-message-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  addMessage(message) {
    this.messages.push(message);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${message.type}`;
    
    const avatar = message.type === 'user' ? '👤' : '🤖';
    const avatarClass = message.type === 'user' ? 'user' : 'ai';
    
    const safeContent = (message.content || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `
      <div class="ai-message-avatar ${avatarClass}">${avatar}</div>
      <div class="ai-message-content">${safeContent}</div>
    `;
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  showErrorMessage(error) {
    let errorMessage = this.getUserFriendlyErrorMessage(error);
    let canRetry = this.canRetry(error);
    
    let retryButton = '';
    if (canRetry && this.retryCount < this.maxRetries) {
      retryButton = `<br><br><button onclick="aiAssistant.retryLastMessage()" class="ai-retry-button">Retry (${this.retryCount}/${this.maxRetries})</button>`;
    }
    
    this.addMessage({ 
      type: 'ai', 
      content: `⚠️ ${errorMessage}${retryButton}` 
    });
  }

  getUserFriendlyErrorMessage(error) {
    switch (error.type) {
      case 'CLIENT_ERROR':
        return 'Invalid request. Please check your message and try again.';
      case 'API_KEY_ERROR':
        return 'AI service is not properly configured. Please contact support.';
      case 'RATE_LIMIT':
        return 'AI service is busy. Please wait a moment and try again.';
      case 'TIMEOUT':
        return 'Request timed out. Please try again.';
      case 'SERVER_ERROR':
        return 'AI service is temporarily unavailable. Please try again in a moment.';
      case 'NETWORK':
        return 'Unable to connect to AI service. Please check your internet connection.';
      default:
        if (error.message.includes('Failed to fetch')) {
          return 'Unable to connect to the AI service. Please check your internet connection or try again later.';
        } else if (error.message.includes('timeout')) {
          return 'Request timed out. Please try again.';
        } else if (error.message.includes('500')) {
          return 'AI service is experiencing issues. Please try again later.';
        }
        return 'Something went wrong. Please try again or contact support if the issue persists.';
    }
  }

  canRetry(error) {
    if (this.retryCount >= this.maxRetries) return false;
    if (error.type === 'API_KEY_ERROR') return false;
    if (error.type === 'CLIENT_ERROR') return false;
    return true;
  }

  async retryLastMessage() {
    if (this.messages.length === 0) return;
    
    const lastUserMessage = [...this.messages].reverse().find(msg => msg.type === 'user');
    if (!lastUserMessage) return;
    
    try {
      this.isRetrying = true;
      this.showTypingIndicator();
      
      const aiResponse = await this.getAIResponse(lastUserMessage.content);
      this.hideTypingIndicator();
      this.addMessage({ type: 'ai', content: aiResponse });
    } catch (error) {
      this.hideTypingIndicator();
      this.showErrorMessage(error);
    } finally {
      this.isRetrying = false;
    }
  }
}

// Cube Game Button Functionality
function initCubeGameButton() {
  const cubeGameFab = document.getElementById('cubeGameFab');
  
  if (cubeGameFab) {
    cubeGameFab.addEventListener('click', () => {
      // Open the cube game in a new tab
      window.open('https://bsehovac.github.io/the-cube/', '_blank');
    });
    
    // Add hover effect
    cubeGameFab.addEventListener('mouseenter', () => {
      cubeGameFab.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    cubeGameFab.addEventListener('mouseleave', () => {
      cubeGameFab.style.transform = 'translateY(0) scale(1)';
    });
  }
}

// Orrery Button Functionality
function initOrreryButton() {
  const orreryFab = document.getElementById('orreryFab');
  
  if (orreryFab) {
    orreryFab.addEventListener('click', () => {
      if (window.orrerySystem) {
        if (window.orrerySystem.isOrreryActive && window.orrerySystem.isOrreryMode) {
          // Currently in interactive mode, exit to background mode
          window.orrerySystem.exitOrreryMode();
        } else if (window.orrerySystem.isOrreryActive && !window.orrerySystem.isOrreryMode) {
          // Currently in background mode, enter interactive mode
          window.orrerySystem.enterOrreryMode();
        } else {
          // Orrery not active, start it
          window.orrerySystem.enterOrreryMode();
        }
      }
    });
    
    // Add hover effect
    orreryFab.addEventListener('mouseenter', () => {
      orreryFab.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    orreryFab.addEventListener('mouseleave', () => {
      orreryFab.style.transform = 'translateY(0) scale(1)';
    });
  }
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize existing functionality
  initNavigationDropdown();
  initContactButton();
  
  // CV Modal will be initialized when the button is clicked
  
  // Initialize AI Chat
  new PortfolioAIAssistant();
  
  // Initialize Cube Game Button
  initCubeGameButton();
  
  // Initialize Orrery Button
  initOrreryButton();
  
  // Initialize Scroll Progress Bar
  initScrollProgress();
  
  // Make retry function globally available
  window.retryCvLoad = retryCvLoad;
  
  // Initialize Orrery System after Three.js background is ready
  setTimeout(() => {
    if (window.threeBackground) {
      import('./orrery.js').then(({ createOrrery }) => {
        window.orrerySystem = createOrrery(window.threeBackground);
      }).catch(error => {
        console.error('Failed to load orrery system:', error);
      });
    }
  }, 2000); // Wait for Three.js background to initialize
});

// Scroll Progress Bar Functionality
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
  });
}
