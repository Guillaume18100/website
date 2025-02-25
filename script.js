        // Navigation Scroll Effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

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

        // Dynamic Content Loading
        // Skills Section
        const skills = [
            {
                icon: '⚛️',
                title: 'Front-End Development',
                description: 'Creating responsive, intuitive interfaces with React, Vue, and modern JavaScript.'
            },
            {
                icon: '🔧',
                title: 'Back-End Engineering',
                description: 'Building robust APIs and server architectures with Node.js, Python, and AWS.'
            },
            {
                icon: '📱',
                title: 'Mobile Development',
                description: 'Developing cross-platform mobile applications with React Native and Flutter.'
            }
        ];

        // Render skills
        const skillsContainer = document.getElementById('skills-container');
        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.classList.add('skill-card');
            skillCard.innerHTML = `
            <div class="skill-icon">${skill.icon}</div>
            <h3>${skill.title}</h3>
            <p>${skill.description}</p>
        `;
            skillsContainer.appendChild(skillCard);
        });

        // Projects Section - FIXED VERSION
        async function loadProjects() {
            const token = process.env.TOKEN;
            try {
                const projectsGrid = document.getElementById('projects-grid');
                if (!projectsGrid) {
                    console.error("Projects grid element not found!");
                    return;
                }

                // Show loading indicator
                projectsGrid.innerHTML = '<div class="loading">Loading projects...</div>';

                // List to store all projects
                let allProjects = [];
                const username = 'Guillaume18100';

                // 1. Add curated projects you want to highlight
                const curatedProjects = [
                    {
                        name: "x86 Retrogaming",
                        description: "Recreating Pac-Man in Assembly",
                        image: "images/projects/default.jpg",
                        topics: ["assembly", "x86", "retrogaming", "pacman", "dosbox"],
                        html_url: "https://github.com/algosup/2023-2024-project-2-x86-retrogaming-team-5"
                    },
                    {
                        name: "Virtual Processor",
                        description: "Building a virtual processor with assembler and interpreter",
                        image: "images/projects/default.jpg",
                        topics: ["assembler", "interpreter", "virtual-processor", "c", "c++", "cmake"],
                        html_url: "https://github.com/algosup/2023-2024-project-3-virtual-processor-team-2"
                    }
                ];

                // Always start with curated projects
                allProjects = [...curatedProjects];

                try {
                    // 2. Get repositories you own
                    const ownReposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
                        headers: {
                            Authorization: `token ${token}`
                        }
                    });
                    if (ownReposResponse.ok) {
                        const ownRepos = await ownReposResponse.json();
                        allProjects = [...allProjects, ...ownRepos];
                        console.log(`Found ${ownRepos.length} owned repositories`);
                    } else {
                        console.error(`GitHub API error: ${ownReposResponse.status}`);
                    }
                } catch (error) {
                    console.error('Error fetching own repositories:', error);
                }

                try {
                    // 3. Get repositories you've contributed to (via pull requests)
                    const contributedResponse = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr+is:merged&per_page=100`, {
                        headers: {
                            Authorization: `token ${token}`
                        }
                    });
                    if (contributedResponse.ok) {
                        const data = await contributedResponse.json();

                        // Extract unique repositories from pull requests
                        const contributedRepos = [];
                        const repoSet = new Set();

                        for (const item of data.items) {
                            // Extract repo details from the PR URL
                            const repoUrl = item.repository_url;
                            if (!repoSet.has(repoUrl)) {
                                repoSet.add(repoUrl);

                                // Fetch repo details
                                const repoResponse = await fetch(repoUrl);
                                if (repoResponse.ok) {
                                    const repoData = await repoResponse.json();
                                    // Don't add repos you own (already included above)
                                    if (repoData.owner.login !== username) {
                                        contributedRepos.push(repoData);
                                    }
                                }
                            }
                        }

                        console.log(`Found ${contributedRepos.length} contributed repositories`);
                        allProjects = [...allProjects, ...contributedRepos];
                    }
                } catch (error) {
                    console.error('Error fetching contributed repositories:', error);
                }

                // Display projects even if only curated ones are available
                console.log(`Total projects to display: ${allProjects.length}`);
                displayProjects(allProjects);

            } catch (error) {
                console.error('Error in loadProjects:', error);
                const projectsGrid = document.getElementById('projects-grid');
                if (projectsGrid) {
                    projectsGrid.innerHTML = `<p>Failed to load projects. Please try again later.</p>`;
                }
            }
        }

        // Function to display projects with "Show More" button
        function displayProjects(projects) {
            console.log("displayProjects called with", projects.length, "projects");

            const projectsGrid = document.getElementById('projects-grid');
            if (!projectsGrid) {
                console.error("Projects grid element not found in displayProjects!");
                return;
            }

            projectsGrid.innerHTML = ''; // Clear initial content

            // Initially only show 3 projects
            const initialProjectsToShow = 3;

            // Function to render projects
            const renderProjects = (projectsToRender) => {
                projectsToRender.forEach(project => {
                    const description = project.description || 'A personal project';
                    const projectCard = document.createElement('div');
                    projectCard.classList.add('project-card');

                    // Extract topics as tags
                    let tagsHTML = '';
                    if (project.topics && project.topics.length > 0) {
                        project.topics.forEach(tag => {
                            tagsHTML += `<span class="project-tag">${tag}</span>`;
                        });
                    } else {
                        tagsHTML = '<span class="project-tag">Project</span>';
                    }

                    projectCard.innerHTML = `
                    <img src="${project.image || 'images/projects/default.jpg'}" alt="${project.name}" class="project-image">
                    <div class="project-content">
                        <h3>${project.name.replace(/-/g, ' ')}</h3>
                        <p>${description}</p>
                        <div class="project-tags">${tagsHTML}</div>
                        <div class="project-links">
                            ${project.homepage ? `<a href="${project.homepage}" target="_blank" class="btn btn-sm">Live Demo</a>` : ''}
                            <a href="${project.html_url}" target="_blank" class="btn btn-sm btn-outline">View Code</a>
                        </div>
                    </div>
                `;

                    projectsGrid.appendChild(projectCard);

                    // Observe for animation if observer exists
                    if (typeof observer !== 'undefined') {
                        observer.observe(projectCard);
                    }
                });
            };

            // Render initial projects (up to 3)
            const initialProjects = projects.slice(0, initialProjectsToShow);
            renderProjects(initialProjects);

            console.log("Initial projects rendered:", initialProjects.length);

            // Add "Show More" button if there are more projects
            if (projects.length > initialProjectsToShow) {
                const showMoreWrapper = document.createElement('div');
                showMoreWrapper.classList.add('show-more-wrapper');

                const showMoreBtn = document.createElement('button');
                showMoreBtn.classList.add('btn', 'show-more-btn');
                showMoreBtn.textContent = 'Show More Projects';

                showMoreBtn.addEventListener('click', function () {
                    // Get the remaining projects to show
                    const remainingProjects = projects.slice(initialProjectsToShow);

                    // Render remaining projects
                    renderProjects(remainingProjects);

                    // Remove the show more button
                    showMoreWrapper.remove();

                    // Add GitHub link after showing all projects
                    const githubLinkWrapper = document.createElement('div');
                    githubLinkWrapper.classList.add('github-link-wrapper');

                    const githubLink = document.createElement('a');
                    githubLink.href = 'https://github.com/Guillaume18100';
                    githubLink.className = 'github-link btn btn-outline';
                    githubLink.target = '_blank';
                    githubLink.innerHTML = '<i class="fab fa-github"></i> View All Projects on GitHub';

                    githubLinkWrapper.appendChild(githubLink);
                    projectsGrid.parentNode.appendChild(githubLinkWrapper);
                });

                showMoreWrapper.appendChild(showMoreBtn);
                projectsGrid.parentNode.insertBefore(showMoreWrapper, projectsGrid.nextSibling);
            }
        }

        // Scroll Animation with IntersectionObserver for better performance
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);

                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements that need animation
        document.querySelectorAll('.skill-card, #contact-card').forEach(item => {
            observer.observe(item);
        });

        // Fix for iOS vh units
        function setVhUnit() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        // Set on load and resize
        window.addEventListener('resize', setVhUnit);
        window.addEventListener('orientationchange', setVhUnit);
        setVhUnit();

        // Document ready handler - ensure all DOM is loaded
        document.addEventListener('DOMContentLoaded', function () {
            // Load projects
            loadProjects();

            // Check visibility initially
            document.querySelectorAll('.skill-card, #contact-card').forEach(item => {
                observer.observe(item);
            });
        });

        // Ensure page loads at top on refresh
        window.onload = function () {
            if (window.location.hash) {
                history.replaceState("", document.title, window.location.pathname);
                window.scrollTo(0, 0);
            }
        };

        // Initialize EmailJS
        (function() {
            emailjs.init("aN3NQG_4ipvqqgquR"); // Add your EmailJS public key here
        })();

        // Contact Form Submission
        const contactForm = document.getElementById('contact-form');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Send email using EmailJS
            emailjs.send(
                "service_b3nl9bi", 
                "template_ke9hrg9", 
                {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                }
            ).then(
                function(response) {
                    console.log("SUCCESS", response);
                    alert('Message sent successfully!');
                    contactForm.reset();
                },
                function(error) {
                    console.log("FAILED", error);
                    alert('Failed to send message. Please try again.');
                }
            ).finally(() => {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });