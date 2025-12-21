# Business Requirements Document (BRD)
## Obaniwa Michael - Portfolio Website

**Document Version:** 1.0  
**Date:** January 2025  
**Project Owner:** Obaniwa Michael  
**Domain:** kingmaker.infy.uk

---

## 1. Executive Summary

### 1.1 Project Overview
This document outlines the business requirements for the personal portfolio website of Obaniwa Michael, a Full-Stack Developer specializing in React Native and Flutter development. The portfolio serves as a professional showcase of skills, projects, and capabilities for potential clients and employers.

### 1.2 Business Objectives
- Establish a professional online presence
- Showcase technical skills and completed projects
- Provide easy contact mechanisms for potential opportunities
- Demonstrate modern web development capabilities
- Create an engaging user experience that reflects technical expertise

### 1.3 Target Audience
- Potential clients seeking full-stack development services
- Employers and recruiters in the tech industry
- Fellow developers and peers in the development community
- Educational institutions and collaborators

---

## 2. Current System Overview

### 2.1 Technology Stack

#### Frontend
- **Build Tool:** Vite 5.0+
- **Core Technologies:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **3D Graphics:** Three.js 0.180.0
- **PDF Handling:** pdfjs-dist 5.4.54
- **Styling:** Custom CSS with glassmorphism design patterns
- **Deployment:** Vercel (serverless architecture)

#### Backend/API
- **Runtime:** Node.js 18.0.0+
- **API Framework:** Vercel Serverless Functions
- **AI Services:** 
  - Google Gemini 1.5 Flash (primary)
  - Groq Llama 3.1 8B Instant (fallback)
- **API Endpoints:** `/api/ai` (POST/GET)

#### Development Tools
- **Linting:** @axe-core/cli 4.10.2
- **Performance:** @lhci/cli 0.13.0
- **Code Minification:** terser 5.44.0

### 2.2 Architecture

#### Frontend Architecture
- **Entry Point:** `index.html` with modular JavaScript imports
- **Main Script:** `main.js` - Core application logic and event handling
- **3D Background:** `three-background.js` - Three.js particle system
- **Slideshow:** `slideshow.js` - Character image carousel
- **Orrery System:** `orrery.js` - Interactive solar system visualization
- **Component Structure:** Modular vanilla JS with class-based organization

#### Backend Architecture
- **API Structure:** Serverless functions in `/api` directory
- **AI Integration:** Dual-provider system (Gemini primary, Groq fallback)
- **Error Handling:** Comprehensive retry logic with exponential backoff
- **CORS:** Configured for cross-origin requests

### 2.3 Current Features

#### 2.3.1 Core Pages
1. **Home Page (`index.html`)**
   - Hero section with introduction
   - Character showcase with animated slideshow
   - About section
   - Contact and CV download functionality
   - Dynamic theme system (6 color themes rotating every 10 seconds)

2. **Projects Page (`projects.html`)**
   - Scroll-snap project showcase
   - 7 featured projects with:
     - Project descriptions
     - Technology tags
     - Live demo links
     - Project screenshots
   - Filterable by technology stack
   - Deep-linking support via URL parameters

3. **Skills Page (`skills.html`)**
   - Comprehensive skills showcase
   - Organized by categories:
     - Core Development (Mobile, Frontend, Backend)
     - Design & Creative
     - Data & Infrastructure
     - Specialized Platforms
   - Statistics display (20+ technologies, 5 years experience, 10+ projects)

#### 2.3.2 Interactive Features

**AI Chat Assistant (RaidBot)**
- Floating Action Button (FAB) interface
- Modal-based chat interface
- Powered by Gemini/Groq AI
- Context-aware responses about portfolio
- Retry mechanism with exponential backoff
- Error handling with user-friendly messages
- Typing indicators and loading states

**3D Background System**
- Three.js particle system
- Performance-optimized for mobile and desktop
- Theme-aware color changes
- Interactive mouse tracking
- WebGL context loss handling
- Adaptive particle count based on device

**Dynamic Theme System**
- 6 predefined color themes:
  1. Purple (Professional and creative)
  2. Blue (Trustworthy and calm)
  3. Green (Growth and success)
  4. Red (Energy and passion)
  5. Orange (Innovation and enthusiasm)
  6. Teal (Balance and sophistication)
- Automatic rotation every 10 seconds
- Smooth transitions between themes
- Theme indicator in UI

**Character Slideshow**
- 7 character images with animations
- Multiple animation types:
  - slideInFromRight
  - slideInFromLeft
  - zoomInRotate
  - bounceIn
  - flipInX
  - fadeInUp
  - slideInFromTop
- Automatic rotation with transitions

**Interactive Elements**
- Cube Game FAB (links to external game)
- Orrery FAB (interactive solar system)
- Scroll progress indicators
- Parallax effects
- Hover animations
- Entrance animations with staggered timing

#### 2.3.3 Contact & CV Features

**Contact Modal**
- Email integration (mailto: links)
- Phone integration (tel: links)
- WhatsApp integration
- Pre-filled message templates

**CV Preview & Download**
- PDF preview in modal iframe
- Download options:
  - PDF format
  - DOCX format
- Error handling for failed loads
- Retry functionality
- Loading states

#### 2.3.4 Navigation & UX

**Header Navigation**
- Logo with animated text effect
- Home link
- Contact Me button
- Search button (placeholder)
- Responsive design

**Footer**
- Copyright information
- Social media links:
  - WhatsApp
  - GitHub
  - Email
- SVG icons for social platforms

**Responsive Design**
- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly interactions
- Optimized performance for mobile devices

#### 2.3.5 SEO & Accessibility

**SEO Features**
- Meta tags (description, keywords, author)
- Open Graph tags for social sharing
- Twitter Card tags
- Semantic HTML structure
- Descriptive alt text for images

**Accessibility**
- Lighthouse CI integration
- Axe-core accessibility testing
- Keyboard navigation support
- ARIA labels where appropriate
- Screen reader considerations

---

## 3. Functional Requirements

### 3.1 User Interface Requirements

#### 3.1.1 Visual Design
- **Design Style:** Glassmorphism with backdrop blur effects
- **Color Scheme:** Dynamic theme system with 6 color variations
- **Typography:** Custom font styling with animated logo text
- **Layout:** Three-column layout on desktop (left content, center character, right content)
- **Responsiveness:** Fully responsive across all device sizes

#### 3.1.2 Animations & Interactions
- Entrance animations for page elements
- Hover effects on interactive elements
- Smooth transitions between states
- Parallax scrolling effects
- 3D transformations on project cards
- Character image animations

### 3.2 Feature Requirements

#### 3.2.1 AI Chat Assistant
- **FR-001:** Users must be able to open AI chat via floating action button
- **FR-002:** AI must respond to questions about the portfolio
- **FR-003:** System must retry failed requests up to 3 times
- **FR-004:** Error messages must be user-friendly and actionable
- **FR-005:** Chat must display typing indicators during processing
- **FR-006:** Chat history must persist during session
- **FR-007:** Users must be able to close chat via overlay or close button
- **FR-008:** Chat must work with keyboard navigation (Enter to send, Escape to close)

#### 3.2.2 Project Showcase
- **FR-009:** Projects must be filterable by technology tags
- **FR-010:** Filter state must be reflected in URL for deep-linking
- **FR-011:** Projects must display in scroll-snap containers
- **FR-012:** Each project must show:
  - Title and description
  - Technology tags
  - Live demo link
  - Project screenshot
- **FR-013:** Project cards must have 3D hover effects

#### 3.2.3 Contact Functionality
- **FR-014:** Users must be able to open contact modal from multiple locations
- **FR-015:** Contact modal must provide email, phone, and WhatsApp options
- **FR-016:** Contact links must open appropriate applications (email client, phone dialer, WhatsApp)
- **FR-017:** Pre-filled message templates must be included

#### 3.2.4 CV Management
- **FR-018:** Users must be able to preview CV in modal
- **FR-019:** Users must be able to download CV in PDF or DOCX format
- **FR-020:** System must handle CV loading errors gracefully
- **FR-021:** Retry functionality must be available for failed loads

#### 3.2.5 Theme System
- **FR-022:** Themes must rotate automatically every 10 seconds
- **FR-023:** Theme transitions must be smooth (1 second duration)
- **FR-024:** 3D background must update colors to match theme
- **FR-025:** Theme indicator must be visible in UI

### 3.3 Performance Requirements

#### 3.3.1 Load Time
- **PR-001:** Initial page load must complete within 3 seconds on 3G connection
- **PR-002:** 3D background must initialize within 2 seconds
- **PR-003:** Images must use lazy loading where appropriate

#### 3.3.2 Runtime Performance
- **PR-004:** Animation frame rate must maintain 60fps on desktop
- **PR-005:** Mobile devices must maintain 30fps minimum
- **PR-006:** Particle count must adapt based on device capabilities
- **PR-007:** Memory usage must be optimized for mobile devices

#### 3.3.3 API Performance
- **PR-008:** AI API responses must complete within 30 seconds
- **PR-009:** API must implement timeout handling (25 seconds)
- **PR-010:** Retry logic must use exponential backoff

### 3.4 Compatibility Requirements

#### 3.4.1 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

#### 3.4.2 Device Support
- Desktop (1920x1080 and above)
- Laptop (1366x768 and above)
- Tablet (768x1024)
- Mobile (320x568 and above)

#### 3.4.3 Feature Support
- WebGL for 3D background
- ES6+ JavaScript features
- CSS Grid and Flexbox
- CSS Custom Properties (variables)

---

## 4. Non-Functional Requirements

### 4.1 Security Requirements
- **SEC-001:** API keys must be stored as environment variables
- **SEC-002:** CORS must be properly configured
- **SEC-003:** User input must be sanitized before processing
- **SEC-004:** XSS protection must be implemented

### 4.2 Reliability Requirements
- **REL-001:** System must have 99.9% uptime
- **REL-002:** AI service must have fallback provider
- **REL-003:** Error handling must prevent application crashes
- **REL-004:** WebGL context loss must be handled gracefully

### 4.3 Maintainability Requirements
- **MAIN-001:** Code must be modular and well-organized
- **MAIN-002:** Comments must explain complex logic
- **MAIN-003:** Configuration must be externalized
- **MAIN-004:** Dependencies must be kept up to date

### 4.4 Scalability Requirements
- **SCAL-001:** Serverless architecture must handle traffic spikes
- **SCAL-002:** CDN must serve static assets globally
- **SCAL-003:** API must scale automatically with demand

### 4.5 Usability Requirements
- **USE-001:** Interface must be intuitive and easy to navigate
- **USE-002:** Error messages must be clear and actionable
- **USE-003:** Loading states must provide user feedback
- **USE-004:** Mobile experience must be touch-optimized

---

## 5. Technical Specifications

### 5.1 File Structure
```
kingmaker/
├── api/                    # Serverless API functions
│   ├── ai.js              # AI chat endpoint
│   ├── chat.js            # Legacy chat endpoint
│   ├── health.js          # Health check endpoint
│   └── package.json       # API dependencies
├── assets/                # Static assets
│   ├── *.png             # Character images
│   ├── m*.png            # Project screenshots
│   └── *.pdf/docx        # CV files
├── components/            # React components (if used)
│   ├── AIChat.jsx
│   ├── ErrorBoundary.jsx
│   └── LoadingState.jsx
├── config/                # Configuration files
│   └── ai.js
├── hooks/                 # React hooks (if used)
│   └── useAI.js
├── lib/                   # Utility libraries
│   ├── aiService.js
│   ├── errorHandler.js
│   └── retryLogic.js
├── styles/                # Stylesheets
│   └── ai-chat.css
├── tests/                 # Test files
│   └── ai-service.test.js
├── index.html            # Home page
├── projects.html         # Projects page
├── skills.html           # Skills page
├── main.js               # Main application logic
├── three-background.js   # 3D background system
├── slideshow.js          # Character slideshow
├── orrery.js             # Solar system visualization
├── style.css             # Main stylesheet
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
├── vercel.json           # Vercel deployment config
└── lighthouserc.json     # Lighthouse CI config
```

### 5.2 API Endpoints

#### POST /api/ai
**Purpose:** Process AI chat messages

**Request:**
```json
{
  "message": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "response": "string",
  "model": "gemini-1.5-flash" | "groq:llama-3.1-8b-instant",
  "timestamp": "ISO 8601 string"
}
```

**Response (Error):**
```json
{
  "error": "string",
  "message": "string"
}
```

#### GET /api/ai
**Purpose:** Health check and configuration status

**Response:**
```json
{
  "status": "healthy",
  "providers": {
    "gemini": { "status": "configured" | "not configured" },
    "groq": { "status": "configured" | "not configured" }
  },
  "timestamp": "ISO 8601 string"
}
```

### 5.3 Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key
- `GROQ_API_KEY` - Groq API key
- `NODE_ENV` - Environment (development/production)

### 5.4 Build & Deployment

#### Build Process
1. Install dependencies: `npm install`
2. Build for production: `npm run build`
3. Output directory: `dist/`

#### Deployment
- **Platform:** Vercel
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite
- **Node Version:** 18.0.0+

#### CI/CD
- Automatic deployments on git push
- Lighthouse CI for performance monitoring
- Axe-core for accessibility testing

---

## 6. Project Showcase Details

### 6.1 Featured Projects

1. **Personal Portfolio**
   - Technologies: HTML5, CSS3, JavaScript, Three.js
   - Live Demo: https://kingmaker.infy.uk

2. **Lover's Code**
   - Technologies: React, Next.js, TypeScript, Tailwind
   - Live Demo: https://Lover-livid.vercel.app

3. **Tife's Gourmet**
   - Technologies: React, Node.js, Express, MongoDB
   - Live Demo: https://Tife.lovestoblog.com

4. **Blogly**
   - Technologies: React, Python, Django, PostgreSQL
   - Live Demo: https://mi1.figureswork.com

5. **King of CMS Consulting**
   - Technologies: React, Node.js, MongoDB, Express
   - Live Demo: https://kingofcms.net

6. **MindSpace AI**
   - Technologies: Next.js, TypeScript, Tailwind, Vercel
   - Live Demo: https://mindspace-ai.vercel.app/auth

7. **Springbase School**
   - Technologies: HTML5, CSS3, JavaScript, SEO
   - Live Site: https://www.springbase.com.ng/

---

## 7. Skills & Expertise Categories

### 7.1 Core Development
- Mobile Development (React Native, Flutter, Dart, Kotlin, PWA)
- Frontend Development (React, HTML5/CSS3, JavaScript, TypeScript, Vue.js, Next.js)
- Backend Development (Node.js, Express.js, PHP, REST APIs, GraphQL, Microservices)

### 7.2 Design & Creative
- Design Tools (Figma, Photoshop, Graphics Design, UI/UX)
- Styling & CSS (Tailwind CSS, Sass/SCSS, Bootstrap, CSS Grid, Flexbox, Animations)
- LMS Development (Learning Management, E-learning, Course Creation, Student Management)

### 7.3 Data & Infrastructure
- Databases (MySQL, MongoDB, Redis, SQLite, Supabase, Firebase)
- AI & Machine Learning (OpenAI API, Hugging Face, NLP Models, TensorFlow, PyTorch, Computer Vision)
- Tools & Technologies (Git, Docker, Agile/Scrum, CI/CD, AWS, Testing)

### 7.4 Specialized Platforms
- WordPress (Theme Development, Plugin Development, Custom Solutions, E-commerce)
- Real-time & Communication (Socket.io, WebRTC, WebSockets, Push Notifications)
- Performance & Optimization (Performance Tuning, SEO Optimization, Accessibility, Security)

---

## 8. User Stories

### 8.1 Visitor User Stories
- **US-001:** As a visitor, I want to view the developer's projects so I can assess their capabilities
- **US-002:** As a visitor, I want to see the developer's skills so I can understand their expertise
- **US-003:** As a visitor, I want to contact the developer easily so I can discuss opportunities
- **US-004:** As a visitor, I want to download the CV so I can review qualifications
- **US-005:** As a visitor, I want to ask questions via AI chat so I can learn more about the portfolio
- **US-006:** As a visitor, I want to filter projects by technology so I can find relevant examples
- **US-007:** As a visitor, I want the site to work on my mobile device so I can access it anywhere

### 8.2 Owner User Stories
- **US-008:** As the owner, I want to showcase my work professionally so I can attract clients
- **US-009:** As the owner, I want the site to be fast and responsive so visitors have a good experience
- **US-010:** As the owner, I want the site to be easily maintainable so I can update it regularly
- **US-011:** As the owner, I want analytics on site usage so I can understand visitor behavior

---

## 9. Success Metrics

### 9.1 Performance Metrics
- Page load time < 3 seconds
- First Contentful Paint < 1.5 seconds
- Time to Interactive < 3.5 seconds
- Lighthouse Performance Score > 90

### 9.2 User Engagement Metrics
- Average session duration
- Pages per session
- Bounce rate
- AI chat usage rate
- CV download rate
- Contact form submissions

### 9.3 Technical Metrics
- Uptime > 99.9%
- API response time < 30 seconds
- Error rate < 1%
- Mobile performance score > 85

---

## 10. Future Enhancements (Out of Scope)

### 10.1 Potential Features
- Blog section for technical articles
- Case study deep-dives for projects
- Testimonials section
- Multi-language support
- Dark/light mode toggle (manual)
- Analytics dashboard
- Contact form with backend processing
- Newsletter subscription
- Project filtering by category (not just technology)
- Search functionality across all content

### 10.2 Technical Improvements
- Progressive Web App (PWA) capabilities
- Service worker for offline functionality
- Advanced analytics integration
- A/B testing framework
- Content Management System (CMS) integration
- Automated testing suite expansion

---

## 11. Dependencies & Constraints

### 11.1 External Dependencies
- Vercel hosting platform
- Google Gemini API
- Groq API
- Three.js library
- PDF.js library

### 11.2 Constraints
- API rate limits from AI providers
- Vercel serverless function execution limits
- Browser WebGL support requirements
- Mobile device performance limitations
- Network connectivity requirements for AI features

### 11.3 Assumptions
- Users have modern browsers with JavaScript enabled
- Users have internet connectivity for AI features
- API keys are properly configured in production
- Content updates are performed manually by owner

---

## 12. Risk Assessment

### 12.1 Technical Risks
- **Risk:** AI API service outages
  - **Mitigation:** Dual-provider system with fallback
  - **Impact:** Medium

- **Risk:** WebGL not supported on older devices
  - **Mitigation:** Graceful degradation to static background
  - **Impact:** Low

- **Risk:** High traffic causing performance issues
  - **Mitigation:** Serverless architecture with auto-scaling
  - **Impact:** Low

### 12.2 Business Risks
- **Risk:** Outdated project information
  - **Mitigation:** Regular content review schedule
  - **Impact:** Medium

- **Risk:** API key exposure
  - **Mitigation:** Environment variables, no client-side exposure
  - **Impact:** High

---

## 13. Glossary

- **BRD:** Business Requirements Document
- **FAB:** Floating Action Button
- **API:** Application Programming Interface
- **CORS:** Cross-Origin Resource Sharing
- **SEO:** Search Engine Optimization
- **PWA:** Progressive Web App
- **CMS:** Content Management System
- **CI/CD:** Continuous Integration/Continuous Deployment
- **XSS:** Cross-Site Scripting
- **WebGL:** Web Graphics Library
- **LMS:** Learning Management System
- **NLP:** Natural Language Processing

---

## 14. Document Control

**Version History:**
- v1.0 - Initial BRD creation (January 2025)

**Approval:**
- Document Owner: Obaniwa Michael
- Status: Draft

**Review Schedule:**
- Quarterly review recommended
- Update upon major feature additions
- Update upon architecture changes

---

## Appendix A: Contact Information

**Owner:** Obaniwa Michael  
**Email:** Obaniwamichael17@gmail.com  
**Phone:** 08071897468  
**GitHub:** https://github.com/Raidreaper  
**Domain:** https://kingmaker.infy.uk

---

**End of Document**

