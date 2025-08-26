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

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
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
        link.href = './assets/Michael cv.pdf';
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
        link.href = './assets/Michael cv.docx';
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
  // Initialize navigation dropdowns
  initNavigationDropdown();
  
  // Initialize contact button functionality
  initContactButton();
  
  // Initialize mobile menu functionality
  // initMobileMenu removed (hamburger menu is no longer used)
  
  // Smooth scrolling for navigation links (only for internal page links)
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only prevent default for contact dropdown items, not for actual navigation
      if (this.href && this.href.includes('#')) {
      e.preventDefault();
      }
      // Let actual page navigation work normally
    });
  });

  // Header icon interactions
  const searchBtn = document.querySelector('.search-btn');
  const menuBtn = document.querySelector('.menu-btn');

  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      // Search functionality placeholder - can be implemented later
      // TODO: Implement search functionality
    });
  }

  // Social media link interactions with bouncing effect
  const socialLinks = document.querySelectorAll('.social-icon');
  socialLinks.forEach(link => {
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
  socialLinks.forEach(link => {
    link.addEventListener('dblclick', function() {
      this.classList.add('bouncing');
    });
  });

  // Add hover effects for character image
  const characterImage = document.querySelector('.character-image');
  if (characterImage) {
    characterImage.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    characterImage.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }

  // Add parallax effect for character container
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const characterContainer = document.querySelector('.character-container');
    
    if (characterContainer) {
      const rate = scrolled * -0.5;
      characterContainer.style.transform = `translateY(${rate}px)`;
    }
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });

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
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    // Add floating class for enhanced 3D floating
    scrollIndicator.classList.add('floating');
    
    // Interactive 3D rotation on click
    scrollIndicator.addEventListener('click', function() {
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
      scrollIndicator.style.animationPlayState = 'paused';
      
      // Resume animations after scroll stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollIndicator.style.animationPlayState = 'running';
      }, 150);
    }, { passive: true });
    
    // Add mouse movement tracking for dynamic 3D effect
    scrollIndicator.addEventListener('mousemove', function(e) {
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
    scrollIndicator.addEventListener('mouseleave', function() {
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

    // Mobile menu functionality across all pages
    function initMobileMenu() {
      // Hamburger removed; function is now a no-op
      return;
      console.log('=== INITIALIZING MOBILE MENU ===');
      
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      const mobileMenu = document.getElementById('mobileMenu');
      
      console.log('Hamburger button found:', hamburgerBtn);
      console.log('Mobile menu found:', mobileMenu);
      
      if (hamburgerBtn && mobileMenu) {
        console.log('✅ Both elements found, setting up event listeners...');
        
        // Add click event to hamburger button
        hamburgerBtn.addEventListener('click', function(e) {
          console.log('🍔 Hamburger button clicked!');
          e.preventDefault();
          e.stopPropagation();
          
          // Toggle mobile menu
          const isVisible = mobileMenu.classList.contains('show');
          console.log('Menu currently visible:', isVisible);
          
          if (isVisible) {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = 'auto';
            console.log('📱 Menu closed');
          } else {
            mobileMenu.classList.add('show');
            document.body.style.overflow = 'hidden';
            console.log('📱 Menu opened');
          }
          
          console.log('Menu classes after toggle:', mobileMenu.className);
          console.log('Menu display style:', window.getComputedStyle(mobileMenu).display);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
          if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            if (mobileMenu.classList.contains('show')) {
              mobileMenu.classList.remove('show');
              document.body.style.overflow = 'auto';
              console.log('📱 Menu closed by outside click');
            }
          }
        });
        
        // Close mobile menu with Escape key
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = 'auto';
            console.log('📱 Menu closed by Escape key');
          }
        });
        
        console.log('✅ Mobile menu event listeners set up successfully!');
        
      } else {
        console.error('❌ MOBILE MENU ERROR: Elements not found!');
        console.error('Hamburger button:', hamburgerBtn);
        console.error('Mobile menu:', mobileMenu);
      }
    }

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

// Initialize CV Modal with proper event handling
function initCvModal() {
  const cvIframe = document.getElementById('cvIframe');
  
  if (cvIframe) {
    // Add load event listener
    cvIframe.addEventListener('load', function() {
      showCvPreview();
    });
    
    // Add error event listener
    cvIframe.addEventListener('error', function() {
      showCvError();
    });
    
    // Set timeout for loading
    setTimeout(() => {
      const cvLoading = document.getElementById('cvLoading');
      if (cvLoading && cvLoading.style.display !== 'none') {
        showCvError();
      }
    }, 10000);
  }
}

// AI Chat System - Groq AI Assistant (cPanel Version)
class PortfolioAIAssistant {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    // Use Vercel serverless function
    this.apiUrl = '/api/chat';
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
      content: `👋 Hello! I'm RaidBot, your Portfolio AI Assistant powered by Groq! 

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
      // Get AI response from Groq API
      const aiResponse = await this.getAIResponse(userInput);
      this.hideTypingIndicator();
      this.addMessage({ type: 'ai', content: aiResponse });
    } catch (error) {
      // Show error message instead of fallback
      this.hideTypingIndicator();
      console.error('Groq API Error:', error);
      
      let errorMessage = 'Sorry, I encountered an error while processing your request.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the AI service. Please check your internet connection or try again later.';
      } else if (error.message.includes('API key not configured')) {
        errorMessage = 'AI service is not properly configured. Please contact the developer.';
      } else       if (error.message.includes('404')) {
        errorMessage = 'AI service endpoint was not found. Please check if the service is properly deployed.';
      } else if (error.message.includes('500')) {
        errorMessage = 'AI service is temporarily unavailable. Please try again in a moment.';
      }
      
      this.addMessage({ 
        type: 'ai', 
        content: `${errorMessage}\n\n💡 <strong>Note:</strong> The AI chat service is deployed on Vercel. If issues persist, please contact the developer.` 
      });
    }
  }

  async getAIResponse(userInput) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Success
      return data.response;
    } catch (err) {
      console.error('Groq API Error:', err);
      throw err;
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
    
    messageDiv.innerHTML = `
      <div class="ai-message-avatar ${avatarClass}">${avatar}</div>
      <div class="ai-message-content">${message.content}</div>
    `;
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize existing functionality
  initNavigationDropdown();
  initContactButton();
  initMobileMenu();
  
  // Initialize CV Modal
  initCvModal();
  
  // Initialize AI Chat
  new PortfolioAIAssistant();
  
  // Test wiring removed
});
