// Projects Page Specific JavaScript

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Make sure projects data is available
    if (typeof projects === 'undefined') {
      console.error('Project data not loaded! Make sure projects-data.js is included before this script.');
      return;
    }
    
    // Initialize projects page
    initProjectsPage();
  } catch (error) {
    console.error('Error initializing projects page:', error);
    // Show error message to user if projects can't be loaded
    const projectsGrid = document.getElementById('projects-full-grid');
    if (projectsGrid) {
      projectsGrid.innerHTML = `<div class="projects-error">
        <p>Sorry, we couldn't load the projects. Please try refreshing the page.</p>
      </div>`;
    }
  }
});

// Initialize the projects page
function initProjectsPage() {
  // Load all projects
  loadAllProjects();
  
  // Set up filters
  initProjectFilters();
  
  // Set up project modal
  setupProjectModal();
  
  // Apply the user's theme preference
  applyThemePreference();
  
  // Initialize language switcher
  initLanguageSwitcherForProjectsPage();
}

// Function to open project modal with detailed view
function openProjectModal(project) {
  const currentLang = localStorage.getItem('language') || 'en';
  
  // Get full description
  const description = project.description && project.description[currentLang] ? 
    project.description[currentLang] : 
    (project.description && project.description.en ? project.description.en : 'A student project');

  // Get all tags
  const tagsHTML = project.topics && project.topics.length > 0 
    ? project.topics.map(tag => `<span class="project-tag">${tag}</span>`).join('')
    : '<span class="project-tag">Project</span>';

  // Determine button texts based on language
  const buttonTexts = {
    liveDemo: currentLang === 'fr' ? 'Démo en ligne' : 'Live Demo',
    viewRepo: currentLang === 'fr' ? 'Voir le repository' : 'View Repository'
  };

  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  
  if (!modal || !modalContent) return;
  
  // Create detailed project view
  modalContent.innerHTML = `
    <div class="project-detail-header">
      <img src="images/projects/default.webp" alt="${project.name} project screenshot" class="project-detail-image">
      <div class="project-detail-info">
        <h3>${project.name.replace(/-/g, ' ')}</h3>
        <p>${description}</p>
        <div class="project-detail-tags">
          ${tagsHTML}
        </div>
        <div class="project-detail-actions">
          ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener" class="btn btn-sm" aria-label="View live demo of ${project.name}">${buttonTexts.liveDemo}</a>` : ''}
          <a href="${project.html_url}" target="_blank" rel="noopener" class="btn btn-sm btn-outline" aria-label="View repository for ${project.name}">${buttonTexts.viewRepo}</a>
        </div>
      </div>
    </div>
    <div class="project-detail-content">
      <div class="project-feature">
        <h4>${currentLang === 'fr' ? 'Technologies utilisées' : 'Technologies Used'}</h4>
        <p>${project.topics ? project.topics.join(', ') : 'N/A'}</p>
      </div>
      <!-- Additional project content can be added here as needed -->
    </div>
  `;
  
  // Show modal with animation
  document.body.style.overflow = 'hidden';
  modal.style.display = 'block';
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

// Function to set up project modal functionality
function setupProjectModal() {
  const modal = document.getElementById('project-modal');
  const closeBtn = modal.querySelector('.close-modal');
  
  if (!modal || !closeBtn) return;
  
  // Close modal when clicking the close button
  closeBtn.addEventListener('click', () => {
    closeProjectModal();
  });
  
  // Close modal when clicking outside the content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });
  
  // Close modal when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

// Function to close project modal
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset focus to previously focused element
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

// Load all projects for the projects page
function loadAllProjects() {
  const projectsGrid = document.getElementById('projects-full-grid');
  if (!projectsGrid) return;
  
  // Remove loading indicator
  const loadingElement = projectsGrid.querySelector('.projects-loading');
  if (loadingElement) {
    loadingElement.remove();
  }
  
  // Create and append project cards
  const fragment = document.createDocumentFragment();
  
  projects.forEach((project, index) => {
    const card = createProjectCardFull(project);
    fragment.appendChild(card);
  });
  
  projectsGrid.appendChild(fragment);
  
  // Make the grid visible with animation
  setTimeout(() => {
    projectsGrid.classList.add('visible');
    
    // Animate in each card with staggered delay
    const cards = projectsGrid.querySelectorAll('.project-card-full');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, 100 * index);
    });
  }, 300);
}

// Create full project card for the projects page
function createProjectCardFull(project) {
  const currentLang = localStorage.getItem('language') || 'en';
  
  // Get description in current language or fallback to English
  const description = project.description && project.description[currentLang] ? 
    project.description[currentLang] : 
    (project.description && project.description.en ? project.description.en : 'A student project');
  
  // Extract topics as tags
  const tagsHTML = project.topics && project.topics.length > 0 
    ? project.topics.slice(0, 5).map(tag => `<span class="project-tag-full">${tag}</span>`).join('')
    : '<span class="project-tag-full">Project</span>';
  
  // Create data attributes for filtering
  let filterClasses = '';
  if (project.topics) {
    if (project.topics.some(topic => ['ai', 'artificial-intelligence', 'machine-learning'].includes(topic.toLowerCase()))) {
      filterClasses += ' filter-ai';
    }
    if (project.topics.some(topic => ['web', 'website', 'frontend', 'backend', 'fullstack'].includes(topic.toLowerCase()))) {
      filterClasses += ' filter-web';
    }
    if (project.topics.some(topic => ['mobile', 'android', 'ios', 'app', 'flutter', 'react-native'].includes(topic.toLowerCase()))) {
      filterClasses += ' filter-mobile';
    }
    if (project.topics.some(topic => ['hackathon'].includes(topic.toLowerCase()))) {
      filterClasses += ' filter-hackathon';
    }
  }
  
  const card = document.createElement('div');
  card.classList.add('project-card-full');
  card.classList.add(...filterClasses.split(' ').filter(c => c));
  card.dataset.projectId = project.name.replace(/\s+/g, '-').toLowerCase();
  
  // Determine project date (placeholder - you might want to add actual dates to your project data)
  const projectDate = project.date || '2024';
  
  card.innerHTML = `
    <img src="images/projects/default.webp" alt="${project.name} project screenshot" class="project-image-full">
    <div class="project-content-full">
      <h3>${project.name.replace(/-/g, ' ')}</h3>
      <p>${description}</p>
      <div class="project-tags-full">${tagsHTML}</div>
      <div class="project-footer">
        <span class="project-date">${projectDate}</span>
        <button class="view-project-btn" data-project-id="${project.name.replace(/\s+/g, '-').toLowerCase()}">
          ${currentLang === 'fr' ? 'Voir détails' : 'View details'} <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
  
  // Add click event to open modal with project details
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.view-project-btn')) {
      openProjectModal(project);
    }
  });
  
  const detailsBtn = card.querySelector('.view-project-btn');
  if (detailsBtn) {
    detailsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProjectModal(project);
    });
  }
  
  return card;
}

// Initialize project filters
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!filterButtons.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Apply filter
      const filter = button.dataset.filter;
      applyProjectFilter(filter);
    });
  });
}

// Apply project filter
function applyProjectFilter(filter) {
  const projects = document.querySelectorAll('.project-card-full');
  
  projects.forEach(project => {
    if (filter === 'all') {
      project.style.display = '';
    } else {
      if (project.classList.contains(`filter-${filter}`)) {
        project.style.display = '';
      } else {
        project.style.display = 'none';
      }
    }
  });
}

// Apply theme preference
function applyThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  // Set up theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      
      // Save preference
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

// Initialize language switcher for the projects page
function initLanguageSwitcherForProjectsPage() {
  const langOptions = document.querySelectorAll('.lang-option');
  if (!langOptions.length) return;
  
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
        
        // Reload projects with new language
        const projectsGrid = document.getElementById('projects-full-grid');
        if (projectsGrid) {
          projectsGrid.innerHTML = '<div class="projects-loading"><div class="spinner-large"></div><span>Loading projects...</span></div>';
          setTimeout(() => {
            loadAllProjects();
          }, 300);
        }
      }
    });
  });
}
