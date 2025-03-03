// Constants and configuration
const CONFIG = {
  observerThreshold: 0.1,
  observerRootMargin: '0px 0px -50px 0px',
  initialProjectsToShow: 3,
  emailjsServiceId: "service_b3nl9bi",
  emailjsTemplateId: "template_ke9hrg9",
  emailjsPublicKey: "aN3NQG_4ipvqqgquR",
  imageLazyLoading: true, // Enable lazy loading for images
  metaDescription: {
    en: 'Software & AI Prompt Engineer specializing in building high-performance applications and crafting intelligent AI solutions',
    fr: 'Ingénieur logiciel et prompt IA spécialisé dans la création d\'applications performantes et de solutions IA intelligentes'
  },
  // Performance configurations
  debounceTime: 100, // Ms to wait before executing debounced functions
  batchProcessLimit: 5 // Process elements in batches for smoother animations
};

// Performance utilities
// Debounce function to limit expensive operations
function debounce(func, wait = CONFIG.debounceTime) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Language translations
const TRANSLATIONS = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      contact: 'Contact'
    },
    hero: {
      title: 'Computer Science Student & AI Enthusiast',
      subtitle: 'I\'m a passionate student focusing on software development and AI prompt engineering, building projects that combine technical skills with creative problem-solving.',
      viewProjects: 'View Projects',
      getInTouch: 'Get in Touch'
    },
    about: {
      title: 'About Me',
      subtitle: 'I\'m combining my computer science education with practical projects to develop skills in software engineering and AI.',
      journey: {
        title: 'Education',
        content: 'Currently pursuing my degree in Computer Science, with a focus on software development and artificial intelligence. I\'m passionate about learning new technologies and applying them to real-world problems through hands-on projects.'
      },
      approach: {
        title: 'My Interests',
        content: 'I\'m particularly interested in how AI can enhance software applications and user experiences. My coursework and personal projects focus on creating clean, efficient code while exploring the capabilities of large language models through prompt engineering.'
      },
      toolkit: {
        title: 'Learning Path',
        content: 'I\'m constantly expanding my technical toolkit through coursework and self-study in modern JavaScript frameworks, backend technologies including Node.js and Python, and mobile development. I\'m also developing skills in AI prompt engineering to create more effective AI interactions.',
        frontend: 'Frontend Development',
        backend: 'Backend Engineering',
        ai: 'AI Prompt Engineering'
      },
      skills: 'Core Skills'
    },
    projects: {
      title: 'Academic & Personal Projects',
      subtitle: 'A collection of projects I\'ve developed during my studies and personal exploration, showcasing my technical skills and problem-solving approach.',
      showMore: 'Show More Projects',
      viewAll: 'View All Projects on GitHub',
      liveDemo: 'Live Demo',
      viewRepo: 'View Repository'
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'Let\'s discuss how we can work together on your next project.',
      formTitle: 'Send a Message',
      formSubtitle: 'I\'ll get back to you as soon as possible.',
      name: 'Your Name',
      email: 'Your Email',
      subject: 'Subject',
      message: 'Your Message',
      send: 'Send Message',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.'
    },
    footer: {
      copyright: '© 2025 Guillaume Deramchi. All rights reserved.'
    }
  },
  fr: {
    nav: {
      about: 'À propos',
      projects: 'Projets',
      contact: 'Contact'
    },
    hero: {
      title: 'Étudiant en Informatique & Passionné d\'IA',
      subtitle: 'Je suis un étudiant passionné qui se concentre sur le développement logiciel et l\'ingénierie de prompts IA, créant des projets qui combinent compétences techniques et résolution créative de problèmes.',
      viewProjects: 'Voir les projets',
      getInTouch: 'Me contacter'
    },
    about: {
      title: 'À propos de moi',
      subtitle: 'Je combine mes études en informatique avec des projets pratiques pour développer mes compétences en ingénierie logicielle et en IA.',
      journey: {
        title: 'Formation',
        content: 'Je poursuis actuellement mes études en informatique, avec une spécialisation en développement logiciel et intelligence artificielle. Je suis passionné par l\'apprentissage de nouvelles technologies et leur application à des problèmes concrets à travers des projets pratiques.'
      },
      approach: {
        title: 'Mes intérêts',
        content: 'Je m\'intéresse particulièrement à la façon dont l\'IA peut améliorer les applications logicielles et les expériences utilisateur. Mes cours et projets personnels se concentrent sur la création de code propre et efficace tout en explorant les capacités des grands modèles de langage grâce à l\'ingénierie de prompts.'
      },
      toolkit: {
        title: 'Parcours d\'apprentissage',
        content: 'J\'enrichis constamment mes connaissances techniques à travers mes cours et mon auto-formation sur les frameworks JavaScript modernes, les technologies backend comme Node.js et Python, et le développement mobile. Je développe également mes compétences en ingénierie de prompts IA pour créer des interactions plus efficaces.',
        frontend: 'Développement frontend',
        backend: 'Ingénierie backend',
        ai: 'Prompt engineering'
      },
      skills: 'Compétences principales'
    },
    projects: {
      title: 'Projets académiques & personnels',
      subtitle: 'Une collection de projets que j\'ai développés pendant mes études et explorations personnelles, démontrant mes compétences techniques et mon approche de résolution de problèmes.',
      showMore: 'Voir plus de projets',
      viewAll: 'Voir tous les projets sur GitHub',
      liveDemo: 'Démo en ligne',
      viewRepo: 'Voir le repository'
    },
    contact: {
      title: 'Me contacter',
      subtitle: 'Discutons de comment nous pouvons travailler ensemble sur votre prochain projet.',
      formTitle: 'Envoyer un message',
      formSubtitle: 'Je vous répondrai dès que possible.',
      name: 'Votre nom',
      email: 'Votre email',
      subject: 'Sujet',
      message: 'Votre message',
      send: 'Envoyer le message',
      success: 'Message envoyé avec succès !',
      error: 'Échec de l\'envoi du message. Veuillez réessayer.'
    },
    footer: {
      copyright: '© 2025 Guillaume Deramchi. Tous droits réservés.'
    }
  }
};

// Create reusable IntersectionObserver with improved performance
function createAnimationObserver(callback, options = {}) {
  // Process entries in batches to avoid layout thrashing
  const batchCallback = (entries, observer) => {
    // Create array of visible entries to process
    const visibleEntries = entries.filter(entry => entry.isIntersecting);
    
    // Process in smaller batches for smoother rendering
    const processEntryBatch = (entries, startIndex) => {
      const endIndex = Math.min(startIndex + CONFIG.batchProcessLimit, entries.length);
      const batch = entries.slice(startIndex, endIndex);
      
      // Process this batch
      callback(batch, observer);
      
      // Schedule next batch if there are more entries to process
      if (endIndex < entries.length) {
        requestAnimationFrame(() => {
          processEntryBatch(entries, endIndex);
        });
      }
    };
    
    // Start processing batches if there are any visible entries
    if (visibleEntries.length > 0) {
      processEntryBatch(visibleEntries, 0);
    }
  };

  return new IntersectionObserver(batchCallback, {
    threshold: options.threshold || CONFIG.observerThreshold,
    rootMargin: options.rootMargin || CONFIG.observerRootMargin
  });
}

// Navigation Scroll Effect - use passive event listener for better performance
const header = document.getElementById('header');
const handleScroll = debounce(() => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
window.addEventListener('scroll', handleScroll, { passive: true });

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when clicking on a link
navLinksItems.forEach(item => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// Standard animation observer for fade-in elements
const observer = createAnimationObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      });
      observer.unobserve(entry.target);
    }
  });
});

// Fix for iOS vh units - use debounced version
const setVhUnit = debounce(() => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.addEventListener('resize', setVhUnit, { passive: true });
window.addEventListener('orientationchange', setVhUnit, { passive: true });
setVhUnit();

// Skills data
const skills = [
  {
    icon: '⚛️',
    title: {
      en: 'Front-End Development',
      fr: 'Développement Front-End'
    },
    description: {
      en: 'Crafting responsive, intuitive interfaces using modern frameworks like React and Vue.',
      fr: 'Création d\'interfaces réactives et intuitives à l\'aide de frameworks modernes comme React et Vue.'
    }
  },
  {
    icon: '🔧',
    title: {
      en: 'Back-End Engineering',
      fr: 'Back-End'
    },
    description: {
      en: 'Designing scalable APIs and robust server architectures with Node.js, Python, and cloud services.',
      fr: 'Conception d\'API évolutives et d\'architectures serveur robustes avec Node.js, Python et les services cloud.'
    }
  },
  {
    icon: '📱',
    title: {
      en: 'Mobile Development',
      fr: 'Développement Mobile'
    },
    description: {
      en: 'Developing cross-platform mobile applications with React Native and Flutter for seamless user experiences.',
      fr: 'Développement d\'applications mobiles multiplateformes avec React Native et Flutter pour des expériences utilisateur fluides.'
    }
  },
  {
    icon: '🤖',
    title: {
      en: 'Prompt Engineering',
      fr: 'Prompt Engineering'
    },
    description: {
      en: 'Creating effective AI prompts and fine-tuning language models to generate intelligent, context-aware responses.',
      fr: 'Création de prompts d\'IA efficaces et ajustement de modèles de langage pour générer des réponses intelligentes et contextuelles.'
    }
  }
];

// Projects data - static implementation with multilingual support
const projects = [
  {
    name: "Doctolib AI Hackathon",
    description: {
      en: "AI chatbot which helps general health practitioners with prevention strategies",
      fr: "Chatbot IA qui aide les médecins généralistes avec des stratégies de prévention"
    },
    image: "images/projects/default.webp",
    topics: ["AI", "Healthcare", "Python", "Chatbot"],
    html_url: "https://github.com/Guillaume18100/hackathon_doctolib"
  },
  {
    name: "Adopte un Candidat",
    description: {
      en: "Flutter mobile/web application connecting job candidates with companies",
      fr: "Application mobile/web Flutter connectant les candidats aux entreprises"
    },
    image: "images/projects/default.webp",
    topics: ["Flutter", "Dart", "Job Matching", "Mobile Development"],
    html_url: "https://github.com/algosup/2023-2024-project-5-flutter-team-1"
  },
  {
    name: "Sia GenAI Hackathon",
    description: {
      en: "Generative AI hackathon project",
      fr: "Projet de hackathon sur l'IA générative"
    },
    image: "images/projects/default.webp",
    topics: ["AI", "Hackathon", "Python"],
    html_url: "https://github.com/GuillotSamuel/GenAI_hackaton"
  },
  {
    name: "Blockchain Hackathon",
    description: {
      en: "Blockchain hackathon Vierzon 2024",
      fr: "Hackathon Blockchain Vierzon 2024"
    },
    image: "images/projects/default.webp",
    topics: ["Blockchain", "JavaScript", "Hackathon"],
    html_url: "https://github.com/0xBelnadris/hackaton-blockchain-vierzon-2024"
  },
  {
    name: "Virtual Processor",
    description: {
      en: "Building a virtual processor with assembler and interpreter",
      fr: "Création d'un processeur virtuel avec assembleur et interpréteur"
    },
    image: "images/projects/default.webp",
    topics: ["assembler", "interpreter", "virtual-processor", "c", "c++", "cmake"],
    html_url: "https://github.com/algosup/2023-2024-project-3-virtual-processor-team-2"
  },
  {
    name: "x86 Retrogaming",
    description: {
      en: "Recreating Pac-Man in Assembly",
      fr: "Recréation de Pac-Man en Assembly"
    },
    image: "images/projects/default.webp",
    topics: ["assembly", "x86", "retrogaming", "pacman", "dosbox"],
    html_url: "https://github.com/algosup/2023-2024-project-2-x86-retrogaming-team-5"
  }
];

// Function to render skills in the DOM with performance optimizations
function loadSkills() {
  const currentLang = localStorage.getItem('language') || 'en';
  const skillsContainer = document.getElementById('skills-container');
  if (!skillsContainer) return;
  
  // Create document fragment to batch DOM operations
  const fragment = document.createDocumentFragment();
  
  skills.forEach(skill => {
    const skillCard = document.createElement('div');
    skillCard.classList.add('skill-card');
    skillCard.innerHTML = `
      <div class="skill-icon">${skill.icon}</div>
      <h3>${skill.title[currentLang]}</h3>
      <p>${skill.description[currentLang]}</p>
    `;
    fragment.appendChild(skillCard);
  });
  
  // Single DOM update
  skillsContainer.appendChild(fragment);
  
  // Observe all skill cards after appending
  skillsContainer.querySelectorAll('.skill-card').forEach(card => {
    observer.observe(card);
  });
}

// Function to create a project card element with better performance
function createProjectCard(project) {
  const currentLang = localStorage.getItem('language') || 'en';
  const projectCard = document.createElement('div');
  projectCard.classList.add('project-card');
  projectCard.dataset.projectId = project.name.replace(/\s+/g, '-').toLowerCase();

  // Extract topics as tags
  const tagsHTML = project.topics && project.topics.length > 0 
    ? project.topics.map(tag => `<span class="project-tag">${tag}</span>`).join('')
    : '<span class="project-tag">Project</span>';

  // Get description in current language or fallback to English
  const description = project.description && project.description[currentLang] ? 
    project.description[currentLang] : 
    (project.description && project.description.en ? project.description.en : 'A student project');

  const buttonTexts = {
    liveDemo: TRANSLATIONS[currentLang].projects.liveDemo,
    viewRepo: TRANSLATIONS[currentLang].projects.viewRepo
  };

  // Always use the default image path
  projectCard.innerHTML = `
    <img src="images/projects/default.webp" alt="${project.name} project screenshot" class="project-image" loading="lazy">
    <div class="project-content">
      <h3>${project.name.replace(/-/g, ' ')}</h3>
      <p>${description}</p>
      <div class="project-tags">${tagsHTML}</div>
    </div>
    <div class="project-links">
      ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener" class="btn btn-sm" aria-label="View live demo of ${project.name}">${buttonTexts.liveDemo}</a>` : ''}
      <a href="${project.html_url}" target="_blank" rel="noopener" class="btn btn-sm btn-outline" aria-label="View repository for ${project.name}">${buttonTexts.viewRepo}</a>
    </div>
  `;

  return projectCard;
}

// Function to display projects with "Show More" button - performance optimized
function displayProjects(projects) {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) {
    console.error("Projects grid element not found in displayProjects!");
    return;
  }

  projectsGrid.innerHTML = '';
  
  const initialProjects = projects.slice(0, CONFIG.initialProjectsToShow);
  const remainingProjects = projects.slice(CONFIG.initialProjectsToShow);

  // Create a document fragment to batch DOM operations
  const fragment = document.createDocumentFragment();

  // Render initial projects
  initialProjects.forEach(project => {
    const projectCard = createProjectCard(project);
    fragment.appendChild(projectCard);
  });
  
  // Single DOM update
  projectsGrid.appendChild(fragment);
  
  // Observe all project cards after appending
  projectsGrid.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
  });

  // Add "Show More" button if there are more projects
  if (remainingProjects.length > 0) {
    addShowMoreButton(projectsGrid, remainingProjects);
  }
}

// Function to add the "Show More" button
function addShowMoreButton(projectsGrid, remainingProjects) {
  const showMoreWrapper = document.createElement('div');
  showMoreWrapper.classList.add('show-more-wrapper');

  const showMoreBtn = document.createElement('button');
  showMoreBtn.classList.add('btn', 'show-more-btn');
  showMoreBtn.textContent = 'Show More Projects';

  showMoreBtn.addEventListener('click', function() {
    // Render remaining projects
    remainingProjects.forEach(project => {
      const projectCard = createProjectCard(project);
      projectsGrid.appendChild(projectCard);
      observer.observe(projectCard);
    });
    
    // Remove the show more button
    showMoreWrapper.remove();
    
    // Add GitHub link after showing all projects
    addGitHubLink(projectsGrid.parentNode);
  });

  showMoreWrapper.appendChild(showMoreBtn);
  projectsGrid.parentNode.insertBefore(showMoreWrapper, projectsGrid.nextSibling);
}

// Function to add GitHub link
function addGitHubLink(container) {
  const githubLinkWrapper = document.createElement('div');
  githubLinkWrapper.classList.add('github-link-wrapper');

  const githubLink = document.createElement('a');
  githubLink.href = 'https://github.com/Guillaume18100';
  githubLink.className = 'github-link btn btn-outline';
  githubLink.target = '_blank';
  githubLink.innerHTML = '<i class="fab fa-github"></i> View All Projects on GitHub';

  githubLinkWrapper.appendChild(githubLink);
  container.appendChild(githubLinkWrapper);
}

// Load projects from the static data
function loadProjects() {
  try {
    displayProjects(projects);
  } catch (error) {
    console.error('Error loading projects:', error);
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      projectsGrid.innerHTML = `<p>Failed to load projects. Please try again later.</p>`;
    }
  }
}

// Initialize EmailJS - with more robust checks
function initEmailJS() {
  // Check if EmailJS is available now
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init(CONFIG.emailjsPublicKey);
      setupContactForm();
    } catch (error) {
      console.error('Error initializing EmailJS:', error);
    }
  } else {
    // EmailJS not loaded yet, set up a check for when it becomes available
    console.log('EmailJS not loaded yet, waiting for script to load...');
    
    // Check every 200ms if EmailJS has loaded (with a timeout)
    let attempts = 0;
    const maxAttempts = 20; // 4 seconds max wait time
    
    const checkEmailJSLoaded = setInterval(() => {
      attempts++;
      
      if (typeof emailjs !== 'undefined') {
        clearInterval(checkEmailJSLoaded);
        console.log('EmailJS now available, initializing...');
        try {
          emailjs.init(CONFIG.emailjsPublicKey);
          setupContactForm();
        } catch (error) {
          console.error('Error initializing EmailJS after wait:', error);
          showContactFormError('Service initialization failed. Please try again later.');
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(checkEmailJSLoaded);
        console.error('EmailJS failed to load after multiple attempts');
        showContactFormError('Contact service unavailable. Please try again later or reach out directly via email.');
      }
    }, 200);
  }
}

// Setup contact form submission with improved feedback
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';
    submitButton.disabled = true;
    
    // Hide any previous messages
    hideFormMessages();

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    // Send email using EmailJS
    emailjs.send(
      CONFIG.emailjsServiceId,
      CONFIG.emailjsTemplateId,
      formData
    ).then(
      function(response) {
        console.log("SUCCESS", response);
        showFormSuccess('Message sent successfully! I\'ll get back to you soon.');
        contactForm.reset();
      },
      function(error) {
        console.log("FAILED", error);
        showFormError('Failed to send message. Please try again or contact me directly.');
      }
    ).finally(() => {
      // Reset button state
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    });
  });
}

// Helper functions for improved form feedback
function hideFormMessages() {
  // Remove any existing message elements
  const existingMessages = document.querySelectorAll('.form-message');
  existingMessages.forEach(msg => msg.remove());
}

function showFormSuccess(message) {
  const contactContent = document.querySelector('.contact-content');
  const formMessage = document.createElement('div');
  formMessage.className = 'form-message success-message';
  formMessage.innerHTML = `
    <div class="message-icon">✓</div>
    <div class="message-content">${message}</div>
  `;
  contactContent.appendChild(formMessage);
  
  // Animate the message
  setTimeout(() => formMessage.classList.add('visible'), 10);
  
  // Automatically remove after a delay
  setTimeout(() => {
    formMessage.classList.remove('visible');
    setTimeout(() => formMessage.remove(), 300);
  }, 5000);
}

function showFormError(message) {
  const contactContent = document.querySelector('.contact-content');
  const formMessage = document.createElement('div');
  formMessage.className = 'form-message error-message';
  formMessage.innerHTML = `
    <div class="message-icon">!</div>
    <div class="message-content">${message}</div>
    <button class="message-close" aria-label="Dismiss message">×</button>
  `;
  contactContent.appendChild(formMessage);
  
  // Animate the message
  setTimeout(() => formMessage.classList.add('visible'), 10);
  
  // Add event listener to close button
  formMessage.querySelector('.message-close').addEventListener('click', () => {
    formMessage.classList.remove('visible');
    setTimeout(() => formMessage.remove(), 300);
  });
}

// Display a persistent error for contact form when EmailJS fails to initialize
function showContactFormError(message) {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  const errorNotice = document.createElement('div');
  errorNotice.className = 'form-service-error';
  errorNotice.innerHTML = `
    <div class="error-icon">⚠️</div>
    <div class="error-message">${message}</div>
  `;
  
  contactForm.innerHTML = '';
  contactForm.appendChild(errorNotice);
}

// Animation for About Section - optimized for performance
function initAboutAnimations() {
  // Elements to animate
  const animatedElements = document.querySelectorAll('.reveal-text, .slide-in, .fade-in');

  // Expertise bars
  const expertiseBars = document.querySelectorAll('.expertise-progress');

  // Intersection Observer for text animations - with optimized batch processing
  const elementObserver = createAnimationObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
          entry.target.classList.add('visible');
        });
        elementObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // Intersection Observer for expertise bars - with optimized batch processing
  const barObserver = createAnimationObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
          entry.target.classList.add('animate');
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Observe all animated elements - in smaller batches for better performance
  const observeElementsInBatches = (elements, observer, batchSize = 10) => {
    for (let i = 0; i < elements.length; i += batchSize) {
      setTimeout(() => {
        const batch = Array.from(elements).slice(i, i + batchSize);
        batch.forEach(element => observer.observe(element));
      }, 0);
    }
  };

  observeElementsInBatches(animatedElements, elementObserver);
  observeElementsInBatches(expertiseBars, barObserver);
}

// Section Divider Animations - optimized for performance
function initSectionDividers() {
  const dividerObserver = createAnimationObserver((entries) => {
    entries.forEach(entry => {
      // Only run animation if element is intersecting AND hasn't been animated yet
      if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
        // Mark this divider as already animated
        entry.target.setAttribute('data-animated', 'true');
        
        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
          // Animate the left line
          const leftLine = entry.target.querySelector('.divider-line-left');
          if (leftLine) leftLine.classList.add('animate');
          
          // Animate the right line
          const rightLine = entry.target.querySelector('.divider-line-right');
          if (rightLine) rightLine.classList.add('animate');
        });
        
        // Animate the circle with a slight delay using requestAnimationFrame for better performance
        const circle = entry.target.querySelector('.divider-circle');
        if (circle) {
          setTimeout(() => {
            requestAnimationFrame(() => {
              circle.classList.add('animate');
            });
          }, 300);
        }
      }
    });
  }, { threshold: 0.5 });
  
  // Observe all dividers
  document.querySelectorAll('.section-divider').forEach(divider => {
    dividerObserver.observe(divider);
  });
}

// Cache DOM references
const domCache = {};

// Performance-optimized function to get and cache DOM elements
function getElement(id) {
  if (!domCache[id]) {
    domCache[id] = document.getElementById(id);
  }
  return domCache[id];
}

// Initialize dark mode - with performance optimizations
function initDarkMode() {
  const themeToggle = getElement('theme-toggle');
  if (!themeToggle) return;
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Toggle dark/light mode
  themeToggle.addEventListener('click', function() {
    // Use requestAnimationFrame for smoother class updates
    requestAnimationFrame(() => {
      document.body.classList.toggle('dark-mode');

      // Save user preference
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  });
}

// Observe contact card for animation
function initContactCard() {
  const contactCard = document.getElementById('contact-card');
  if (contactCard) {
    observer.observe(contactCard);
  }
}

// Initialize page scroll position on refresh
function initScrollPosition() {
  if (window.location.hash) {
    history.replaceState("", document.title, window.location.pathname);
    window.scrollTo(0, 0);
  }
}

// Main initialization function - with performance optimizations
function init() {
  // Initialize preloader
  handlePreloader();  
  
  // Initialize immediate UI requirements
  initScrollPosition();
  
  // Initialize scroll to top button
  initScrollToTop();
  
  // Core functionality   
  setTimeout(() => {
    loadSkills();
    loadProjects();
    initDarkMode();
  }, 0);
  
  // Non-critical animations with slight delay
  setTimeout(() => {
    initAboutAnimations();
    initSectionDividers();
    initContactCard();
    enhanceImageLoading();
  }, 10);
  
  // Remaining functionality with longer delay
  setTimeout(() => {
    initEmailJS();
    initLanguageSwitcher();
    initMobileNav();
  }, 20);
  
  // Add event listener for skip to content link
  const skipLink = document.querySelector('.skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.tabIndex = -1;
        mainContent.focus();
      }
    });
  }
}

// Initialize intersection observer for lazy loading images
function initLazyImages() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px' // Start loading images when they are 200px from viewport
  });
  
  // Find all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Detect when page is visible and prioritize work accordingly
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    // Prioritize any pending work when page becomes visible
  } else {
    // Deprioritize work when page is not visible
  }
});

// Initialize when DOM is ready - use JavaScript module pattern for better performance
document.addEventListener('DOMContentLoaded', function() {
  // Initialize critical functionality immediately
  init();
  
  // Initialize lazy loading after a slight delay
  setTimeout(initLazyImages, 100);
});

// Language switching functionality
function initLanguageSwitcher() {
  const languageToggle = document.getElementById('language-toggle');
  const langOptions = document.querySelectorAll('.lang-option');
  
  if (!languageToggle) return;
  
  // Get saved language preference
  let currentLang = localStorage.getItem('language') || 'en';
  
  // Set initial active state
  langOptions.forEach(option => {
    if (option.dataset.lang === currentLang) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
  
  // Apply translations on page load
  applyTranslations(currentLang);
  
  // Set up click handlers for language options
  langOptions.forEach(option => {
    option.addEventListener('click', function() {
      const newLang = this.dataset.lang;
      
      // Only proceed if this is a different language
      if (newLang !== currentLang) {
        // Update active states
        langOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        // Save preference
        localStorage.setItem('language', newLang);
        currentLang = newLang;
        
        // Apply translations
        applyTranslations(newLang);
      }
    });
  });
}

// Apply translations to the page
function applyTranslations(lang) {
  const translations = TRANSLATIONS[lang];
  if (!translations) return;
  
  // Update navigation
  document.querySelector('.nav-links li:nth-child(1) a').textContent = translations.nav.about;
  document.querySelector('.nav-links li:nth-child(2) a').textContent = translations.nav.projects;
  document.querySelector('.nav-links li:nth-child(3) a').textContent = translations.nav.contact;
  
  // Update hero section
  document.querySelector('.hero-title').textContent = translations.hero.title;
  document.querySelector('.hero-subtitle').textContent = translations.hero.subtitle;
  document.querySelector('.hero-buttons .btn:first-child').textContent = translations.hero.viewProjects;
  document.querySelector('.hero-buttons .btn-outline').textContent = translations.hero.getInTouch;
  
  // Update about section
  document.querySelector('#about .section-title').textContent = translations.about.title;
  document.querySelector('#about .section-subtitle').textContent = translations.about.subtitle;
  
  document.querySelector('#about .about-section:nth-child(1) h3').textContent = translations.about.journey.title;
  document.querySelector('#about .about-section:nth-child(1) p').textContent = translations.about.journey.content;
  
  document.querySelector('#about .about-section:nth-child(2) h3').textContent = translations.about.approach.title;
  document.querySelector('#about .about-section:nth-child(2) p').textContent = translations.about.approach.content;
  
  document.querySelector('#about .about-section:nth-child(3) h3').textContent = translations.about.toolkit.title;
  document.querySelector('#about .about-section:nth-child(3) p').textContent = translations.about.toolkit.content;
  
  // Update expertise labels
  document.querySelectorAll('.expertise-area .expertise-label')[0].textContent = translations.about.toolkit.frontend;
  document.querySelectorAll('.expertise-area .expertise-label')[1].textContent = translations.about.toolkit.backend;
  document.querySelectorAll('.expertise-area .expertise-label')[2].textContent = translations.about.toolkit.ai;
  
  document.querySelector('.skills-title').textContent = translations.about.skills;
  
  // Update projects section
  document.querySelector('#projects .section-title').textContent = translations.projects.title;
  document.querySelector('#projects .section-subtitle').textContent = translations.projects.subtitle;
  
  // Update buttons (if they exist)
  const showMoreBtn = document.querySelector('.show-more-btn');
  if (showMoreBtn) showMoreBtn.textContent = translations.projects.showMore;
  
  const githubLink = document.querySelector('.github-link');
  if (githubLink) githubLink.innerHTML = `<i class="fab fa-github"></i> ${translations.projects.viewAll}`;
  
  // Update project card buttons
  document.querySelectorAll('.project-links .btn').forEach(btn => {
    if (btn.classList.contains('btn-outline')) {
      btn.textContent = translations.projects.viewRepo;
    } else {
      btn.textContent = translations.projects.liveDemo;
    }
  });
  
  // Update contact section
  document.querySelector('#contact .section-title').textContent = translations.contact.title;
  document.querySelector('#contact .section-subtitle').textContent = translations.contact.subtitle;
  document.querySelector('.contact-title').textContent = translations.contact.formTitle;
  document.querySelector('.contact-header p').textContent = translations.contact.formSubtitle;
  
  // Update form placeholders
  document.getElementById('name').placeholder = translations.contact.name;
  document.getElementById('email').placeholder = translations.contact.email;
  document.getElementById('subject').placeholder = translations.contact.subject;
  document.getElementById('message').placeholder = translations.contact.message;
  document.querySelector('.contact-form button').textContent = translations.contact.send;
  
  // Update footer copyright
  document.querySelector('.copyright').textContent = translations.footer.copyright;
  
  // Update skill cards with translations
  updateSkillsWithCurrentLanguage(lang);
  
  // Update project card content
  updateProjectsWithCurrentLanguage(lang);
  
  // Update meta description for SEO
  updateMetaDescription(lang);
  
  // Update html lang attribute for accessibility and SEO
  document.documentElement.setAttribute('lang', lang);
}

// Update skill cards with current language
function updateSkillsWithCurrentLanguage(lang) {
  const skillCards = document.querySelectorAll('.skill-card');
  if (!skillCards.length) return;
  
  skillCards.forEach((card, index) => {
    if (index >= skills.length) return;
      
    const skill = skills[index];
    const titleElement = card.querySelector('h3');
    const descriptionElement = card.querySelector('p');
    
    if (titleElement && skill.title && skill.title[lang]) {
      titleElement.textContent = skill.title[lang];
    }
    
    if (descriptionElement && skill.description && skill.description[lang]) {
      descriptionElement.textContent = skill.description[lang];
    }
  });
}

// Update project cards with current language
function updateProjectsWithCurrentLanguage(lang) {
  const projectCards = document.querySelectorAll('.project-card');
  if (!projectCards.length) return;
  
  projectCards.forEach(card => {
    const projectId = card.dataset.projectId;
    if (!projectId) return;
    
    // Find matching project
    const project = projects.find(p => p.name.replace(/\s+/g, '-').toLowerCase() === projectId);
    if (!project) return;
    
    // Update description
    const descriptionEl = card.querySelector('.project-content p');
    if (descriptionEl && project.description) {
      descriptionEl.textContent = project.description[lang] || project.description.en;
    }
    
    // Update button texts
    const liveDemo = card.querySelector('.project-links .btn:not(.btn-outline)');
    const viewRepo = card.querySelector('.project-links .btn.btn-outline');
    
    if (liveDemo) {
      liveDemo.textContent = TRANSLATIONS[lang].projects.liveDemo;
    }
    
    if (viewRepo) {
      viewRepo.textContent = TRANSLATIONS[lang].projects.viewRepo;
    }
  });
}

// Function to update meta description based on language
function updateMetaDescription(lang) {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && CONFIG.metaDescription[lang]) {
    metaDescription.setAttribute('content', CONFIG.metaDescription[lang]);
  }
  
  // Also update Open Graph and Twitter descriptions
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  
  if (ogDescription && CONFIG.metaDescription[lang]) {
    ogDescription.setAttribute('content', CONFIG.metaDescription[lang]);
  }
  
  if (twitterDescription && CONFIG.metaDescription[lang]) {
    twitterDescription.setAttribute('content', CONFIG.metaDescription[lang]);
  }
}

// Improve mobile navigation for accessibility
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener('click', () => {
    const isExpanded = navLinks.classList.contains('active');
    navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', !isExpanded);
  });
}

// Add preloader functionality
function handlePreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  
  // Hide preloader after content has loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 500);
  });
}

// Add scroll-to-top button functionality
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-to-top');
  if (!scrollTopBtn) return;
  
  // Show/hide button based on scroll position
  const toggleScrollTopBtn = debounce(() => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, 100);
  
  // Scroll to top when button clicked
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });
}

// Enhanced image loading with placeholder
function enhanceImageLoading() {
  const projectImages = document.querySelectorAll('.project-image');
  
  projectImages.forEach(image => {
    // Add class for fade-in animation
    image.classList.add('lazy-load');
    
    // Create a simple image loading observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px'  // Start loading when 100px away from viewport
    });
    
    imageObserver.observe(image);
  });
}