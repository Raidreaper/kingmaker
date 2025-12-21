// Case Study Data for Portfolio Projects
export const caseStudies = [
  {
    id: "personal-portfolio",
    title: "Personal Portfolio Website",
    client: "Personal Project",
    duration: "4 weeks (December 2024 - January 2025)",
    challenge: "Create a portfolio that stands out in a saturated market while showcasing both technical skills and personality. Needed to balance visual appeal with performance, and demonstrate advanced frontend capabilities without overwhelming visitors.",
    role: [
      "Solo developer - handled all aspects from design to deployment",
      "Designed UI/UX with focus on glassmorphism and modern aesthetics",
      "Implemented complex Three.js particle system for interactive background",
      "Integrated dual AI provider system for portfolio assistant chatbot",
      "Optimized performance for mobile devices and slow connections"
    ],
    technical: [
      "Built with Vite + vanilla JavaScript for optimal performance and minimal bundle size",
      "Implemented Three.js particle system with adaptive performance based on device capabilities",
      "Created serverless API architecture using Vercel Functions with Gemini and Groq AI providers",
      "Developed dynamic theme system with smooth CSS custom property transitions",
      "Achieved 90+ Lighthouse performance score with code splitting and lazy loading",
      "Implemented retry logic with exponential backoff for API resilience"
    ],
    results: [
      "Performance: 90+ Lighthouse score across all categories",
      "Load time: <3 seconds on 3G connections",
      "Mobile-optimized: 60fps animations on mid-range devices",
      "AI chat: 95% successful response rate with fallback system",
      "Achieved 99.9% uptime via Vercel's edge network",
      "Positive feedback: 'Most impressive portfolio I've seen this year' - Senior Developer"
    ],
    images: [
      "/assets/m1.png"
    ],
    liveUrl: "https://kingmaker.infy.uk",
    githubUrl: "https://github.com/Raidreaper"
  },
  {
    id: "lovers-code",
    title: "Lover's Code",
    client: "Client Project",
    duration: "8 weeks (October - November 2024)",
    challenge: "Build a platform for meaningful connections combining AI companionship, matchmaking, and solo journey features. Required seamless integration of multiple complex features while maintaining intuitive user experience and real-time interactions.",
    role: [
      "Full-stack developer on a team of 3",
      "Led frontend architecture using Next.js and TypeScript",
      "Implemented real-time chat features with WebSocket connections",
      "Designed responsive UI components with Tailwind CSS",
      "Integrated AI companionship API endpoints"
    ],
    technical: [
      "Next.js 14 with App Router for optimal performance and SEO",
      "TypeScript for type safety across frontend and API routes",
      "Tailwind CSS for rapid UI development with custom design system",
      "Real-time messaging using Socket.io for instant communication",
      "AI integration with OpenAI API for companionship features",
      "Optimized bundle size with code splitting and dynamic imports"
    ],
    results: [
      "User engagement: 40% increase in daily active users",
      "Performance: 95+ Lighthouse score",
      "Real-time features: <100ms message delivery latency",
      "Mobile experience: 4.5/5 user rating",
      "Successfully launched with 500+ registered users in first month"
    ],
    images: [
      "/assets/m2.png"
    ],
    liveUrl: "https://Lover-livid.vercel.app",
    githubUrl: null
  },
  {
    id: "tifes-gourmet",
    title: "Tife's Gourmet",
    client: "Tife's Gourmet Business",
    duration: "6 weeks (August - September 2024)",
    challenge: "Create a comprehensive food business website covering bakery, smoothie bar, and healthy options with online ordering capabilities. Needed to showcase products effectively while providing seamless ordering experience and mobile-first design.",
    role: [
      "Solo developer - full project lifecycle",
      "Designed and implemented complete e-commerce solution",
      "Built custom ordering system with cart functionality",
      "Created admin dashboard for order management",
      "Optimized for local SEO and mobile users"
    ],
    technical: [
      "React frontend with component-based architecture",
      "Node.js + Express.js RESTful API backend",
      "MongoDB for flexible product and order data storage",
      "Stripe integration for secure payment processing",
      "Image optimization and lazy loading for product galleries",
      "Responsive design with mobile-first approach"
    ],
    results: [
      "Online orders: 60% of total orders within first month",
      "Mobile conversion: 45% higher than desktop",
      "Page load: <2 seconds on mobile networks",
      "Customer satisfaction: 4.8/5 average rating",
      "SEO: Ranked #1 for local food business searches"
    ],
    images: [
      "/assets/m3.png"
    ],
    liveUrl: "https://Tife.lovestoblog.com",
    githubUrl: null
  },
  {
    id: "springbase-management",
    title: "Springbase School Management System",
    client: "Springbase Educational Institution",
    duration: "16 weeks (September - December 2024)",
    challenge: "Build a comprehensive school administration system with three distinct portals (Parent, Admin, Student) for managing academic progress, test administration, student onboarding, and real-time communication. Required seamless integration between portals while maintaining data security and user-friendly interfaces for different user types.",
    role: [
      "Full-stack developer and system architect",
      "Designed multi-portal architecture with role-based access control",
      "Built parent portal for academic progress monitoring and test result tracking",
      "Created admin dashboard for test management, student/teacher/parent administration",
      "Developed student portal for test access and academic information",
      "Implemented secure authentication and authorization system"
    ],
    technical: [
      "PHP backend with object-oriented architecture for maintainability",
      "MySQL database with optimized queries for performance",
      "JavaScript for interactive dashboard features and real-time updates",
      "HTML5/CSS3 for responsive, accessible interfaces across all portals",
      "Session management and secure password hashing",
      "RESTful API design for portal communication"
    ],
    results: [
      "Three fully functional portals: Parent, Admin, and Student",
      "Real-time test result tracking and academic progress monitoring",
      "Admin dashboard with comprehensive statistics and management tools",
      "User satisfaction: 4.7/5 average rating from parents and administrators",
      "Successfully managing 100+ students with seamless portal integration",
      "Reduced administrative workload by 60% through automation"
    ],
    images: [
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fadmin.springbase.com.ng%2F?w=1200",
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fparents.springbase.com.ng%2F?w=1200",
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fstudents.springbase.com.ng%2F?w=1200"
    ],
    liveUrl: "https://www.springbase.com.ng/",
    githubUrl: null
  },
  {
    id: "folashaye-global",
    title: "Folashaye Global",
    client: "Folashaye Global Business",
    duration: "6 weeks (October - November 2024)",
    challenge: "Create a professional business website showcasing multiple services including haulage, vocational services, construction, and exam registration in Badagry, Lagos State. Required modern design that reflects trustworthiness while highlighting diverse service offerings and making it easy for clients to contact and request quotes.",
    role: [
      "Solo developer and designer",
      "Designed modern, professional UI with gradient effects and 3D elements",
      "Implemented service showcase sections with clear call-to-action buttons",
      "Built contact and quote request functionality",
      "Optimized for local SEO targeting Lagos State and Badagry area",
      "Created responsive design for mobile and desktop users"
    ],
    technical: [
      "HTML5 semantic markup for SEO optimization",
      "CSS3 with modern gradients and glassmorphism effects",
      "JavaScript for interactive elements and smooth animations",
      "React components for reusable service sections",
      "Mobile-first responsive design approach",
      "Fast loading times with optimized images and assets"
    ],
    results: [
      "Professional business presence established online",
      "Service inquiries: 40% increase in quote requests",
      "Mobile traffic: 55% of total visitors",
      "SEO: Improved local search rankings for target services",
      "User engagement: 3.5+ minutes average session duration",
      "Client acquisition: Multiple successful service bookings from website"
    ],
    images: [
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Ffolashayeglobal.com%2F?w=1200"
    ],
    liveUrl: "https://folashayeglobal.com/",
    githubUrl: null
  },
  {
    id: "shopmaster",
    title: "ShopMaster",
    client: "Folashaye Global",
    duration: "8 weeks (November - December 2024)",
    challenge: "Develop a modern business directory platform that connects customers with trusted local services and businesses. Required building a searchable directory with business listings, service categories, and user-friendly navigation while maintaining a clean, minimalist design that builds trust.",
    role: [
      "Full-stack developer and UX designer",
      "Designed clean, minimalist interface with focus on usability",
      "Built business directory with search and filtering capabilities",
      "Implemented service categorization and business profile pages",
      "Created responsive design optimized for mobile browsing",
      "Integrated with main Folashaye Global website"
    ],
    technical: [
      "React for component-based frontend architecture",
      "Next.js for server-side rendering and optimal performance",
      "TypeScript for type safety and improved developer experience",
      "Tailwind CSS for rapid UI development and consistency",
      "Responsive design with mobile-first approach",
      "SEO optimization for directory listings"
    ],
    results: [
      "Modern business directory platform successfully launched",
      "Clean, user-friendly interface with high usability scores",
      "Mobile-optimized experience for on-the-go browsing",
      "Integration with Folashaye Global ecosystem",
      "Positive user feedback on design and functionality",
      "Foundation for future business listing expansion"
    ],
    images: [
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fshopmaster.folashayeglobal.com%2F?w=1200"
    ],
    liveUrl: "https://shopmaster.folashayeglobal.com/",
    githubUrl: null
  },
  {
    id: "insightpilot",
    title: "InsightPilot",
    client: "Personal Project",
    duration: "10 weeks (January - March 2025)",
    challenge: "Create a data visualization tool that transforms raw CSV data into beautiful, exportable dashboards without requiring data science expertise. Required automatic field detection, intelligent chart suggestions, and multiple export formats (PNG, PDF, DOCX) while maintaining a modern, glassmorphism design aesthetic.",
    role: [
      "Solo developer and product designer",
      "Designed modern UI with glassmorphism effects and gradients",
      "Built CSV parsing and automatic field type detection",
      "Implemented intelligent chart type suggestions based on data",
      "Created dashboard generation engine with customizable metrics",
      "Developed export functionality for multiple formats (PNG, PDF, DOCX)",
      "Built shareable link system for read-only dashboard access"
    ],
    technical: [
      "React with modern hooks and context API for state management",
      "Next.js 14 with App Router for optimal performance and SEO",
      "TypeScript for type safety across the application",
      "Tailwind CSS for rapid UI development with custom design system",
      "Chart.js or similar library for data visualization",
      "PDF generation libraries for export functionality",
      "Vercel deployment for global edge network performance",
      "Google OAuth integration for user authentication"
    ],
    results: [
      "Zero-setup data visualization tool successfully launched",
      "Automatic analysis and chart suggestions working effectively",
      "Multiple export formats: PNG, PDF, and DOCX",
      "Shareable links enable collaboration without login requirements",
      "Modern, professional design with glassmorphism aesthetic",
      "Fast performance with Vercel edge network deployment",
      "User-friendly interface requiring no data science expertise"
    ],
    images: [
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Finsightpilot-drab.vercel.app%2F?w=1200"
    ],
    liveUrl: "https://insightpilot-drab.vercel.app/",
    githubUrl: null
  },
  {
    id: "mindspace-ai",
    title: "MindSpace AI",
    client: "Mental Wellness Platform",
    duration: "12 weeks (January - March 2024)",
    challenge: "Develop a mental wellness assistant with Google authentication and AI-driven guidance, deployed on Vercel. Required building a secure, empathetic platform that provides personalized mental health support while maintaining user privacy and data security.",
    role: [
      "Lead frontend developer in team of 4",
      "Implemented Google OAuth authentication flow",
      "Designed conversational AI interface",
      "Built mood tracking and journaling features",
      "Ensured HIPAA-compliant data handling"
    ],
    technical: [
      "Next.js 13 with TypeScript for type-safe development",
      "Tailwind CSS for rapid UI iteration and consistency",
      "Google OAuth 2.0 for secure authentication",
      "OpenAI GPT-4 for empathetic AI conversations",
      "Vercel Edge Functions for global performance",
      "Encrypted data storage with client-side encryption"
    ],
    results: [
      "User base: 5,000+ registered users",
      "Daily active users: 1,200+ consistent engagement",
      "User satisfaction: 4.7/5 average rating",
      "Response time: <2 seconds for AI interactions",
      "Privacy: Zero data breaches, 100% compliance"
    ],
    images: [
      "/assets/MindSpace AI - Mental Wellness & Productivity Coach - Google Chrome 8_27_2025 12_13_26 AM.png"
    ],
    liveUrl: "https://mindspace-ai.vercel.app/auth",
    githubUrl: null
  },
  {
    id: "springbase-school",
    title: "Springbase School",
    client: "Springbase Educational Institution",
    duration: "4 weeks (February 2024)",
    challenge: "Create a clean, accessible school website highlighting programs, facilities, admissions and student life. Required balancing information architecture with visual appeal while ensuring accessibility compliance and fast loading times.",
    role: [
      "Solo developer and designer",
      "Designed information architecture and user flows",
      "Implemented responsive design for all devices",
      "Optimized for SEO and local search",
      "Ensured WCAG 2.1 AA accessibility compliance"
    ],
    technical: [
      "Semantic HTML5 for accessibility and SEO",
      "CSS3 with modern layout techniques (Grid, Flexbox)",
      "Vanilla JavaScript for lightweight interactions",
      "Image optimization and lazy loading",
      "Schema.org markup for rich search results",
      "Progressive enhancement approach"
    ],
    results: [
      "Page speed: 95+ Lighthouse performance score",
      "Accessibility: 100% WCAG 2.1 AA compliance",
      "SEO: 40% increase in organic traffic",
      "Mobile usage: 65% of total visitors",
      "Admission inquiries: 50% increase from website"
    ],
    images: [
      "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fwww.springbase.com.ng%2F?w=1200"
    ],
    liveUrl: "https://www.springbase.com.ng/",
    githubUrl: null
  }
];

