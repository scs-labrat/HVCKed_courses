
document.addEventListener('DOMContentLoaded', () => {
    const tabsNav = document.querySelector('.course-tabs-nav');
    const mainContentColumn = document.querySelector('.main-content-column');
    const sidebarColumn = document.querySelector('.sidebar-column');
    const courseBodyGrid = document.querySelector('.course-body-grid');
    const courseContentTabLink = tabsNav ? tabsNav.querySelector('[data-view="course-content-toggle"]') : null; // Select the "Course Content" tab link
    let moduleDropdownElement = null; // Variable to hold the active dropdown element

    const fragmentsScriptTag = document.getElementById('course-fragments');

    if (!tabsNav || !mainContentColumn || !sidebarColumn || !courseBodyGrid || !fragmentsScriptTag) {
        // Not on a course detail page with dynamic content, or elements are missing
        // console.warn('Missing elements for dynamic content loading.'); // Optional logging
        return; // Stop script execution if elements can't be found
    }

    // Parse content fragments and raw data from the embedded JSON script tag
    let fragments = {};
    try {
        fragments = JSON.parse(fragmentsScriptTag.textContent);
        fragmentsScriptTag.remove(); // Clean up the script tag after parsing
    } catch (error) {
        console.error('Failed to parse course fragments JSON:', error);
        mainContentColumn.innerHTML = '<p style="color: var(--destructive);">Error loading course content.</p>';
        return; // Stop script execution if fragments can't be loaded
    }

    // Ensure fragments.rawModules exists and is an array
    const rawModules = Array.isArray(fragments.rawModules) ? fragments.rawModules : [];
    delete fragments.rawModules; // Remove rawModules from fragments as it's handled separately


    // --- Dropdown Logic ---

    // Function to build the dropdown HTML from raw module data
    function buildModuleDropdownHtml(modules) {
        if (!modules || modules.length === 0) {
            return '<div class="dropdown-message">No modules available.</div>';
        }
        const moduleListItems = modules.map(module => {
            // Use simple links for the dropdown
            return `
            <li class="dropdown-module-item">
                <a href="#module-${module.order}" data-view="module-${module.order}" data-module-order="${module.order}">
                    Module ${module.order}: ${module.title}
                </a>
            </li>
            `;
        }).join('');
        return `<ul class="dropdown-module-list">${moduleListItems}</ul>`;
    }

    // Function to open the dropdown
    function openDropdown() {
        if (moduleDropdownElement) {
            closeDropdown(); // Close any existing dropdown
        }

        // Create the dropdown element
        moduleDropdownElement = document.createElement('div');
        moduleDropdownElement.classList.add('module-dropdown');
        moduleDropdownElement.innerHTML = buildModuleDropdownHtml(rawModules); // Build content

        // Position the dropdown relative to the "Course Content" tab link
        // Append to body to avoid clipping issues within smaller containers
        document.body.appendChild(moduleDropdownElement);

        // Calculate position
        const rect = courseContentTabLink.getBoundingClientRect();
        const containerRect = tabsNav.getBoundingClientRect(); // Use tabsNav as relative container

        // Position below the tab, aligned with the left edge of the tabs container
        moduleDropdownElement.style.position = 'absolute'; // Use absolute positioning
        moduleDropdownElement.style.top = `${rect.bottom + window.scrollY}px`; // Position below the link + scroll offset
        moduleDropdownElement.style.left = `${containerRect.left + window.scrollX}px`; // Align with the left edge of tabs container
        moduleDropdownElement.style.zIndex = '1000'; // Ensure it's on top

        // Add click listener to the dropdown for delegation
        moduleDropdownElement.addEventListener('click', handleDropdownClick);

        // Add a listener to close the dropdown when clicking outside
        document.addEventListener('click', handleGlobalClick);

         // Set aria-expanded for accessibility
         if(courseContentTabLink) {
             courseContentTabLink.setAttribute('aria-expanded', 'true');
         }
    }

    // Function to close the dropdown
    function closeDropdown() {
        if (moduleDropdownElement) {
            moduleDropdownElement.removeEventListener('click', handleDropdownClick);
            document.removeEventListener('click', handleGlobalClick);
            moduleDropdownElement.remove();
            moduleDropdownElement = null;
             // Set aria-expanded for accessibility
             if(courseContentTabLink) {
                 courseContentTabLink.setAttribute('aria-expanded', 'false');
             }
        }
    }

     // Handle clicks inside the dropdown (delegated)
     function handleDropdownClick(event) {
         const moduleLink = event.target.closest('.dropdown-module-item a[data-view]');
         if (moduleLink) {
             event.preventDefault();
             const view = moduleLink.dataset.view; // e.g., 'module-1'
             if (view && view.startsWith('module-')) {
                 renderView(view); // Render the module content
                 history.pushState(null, '', '#' + view); // Update URL hash
                 closeDropdown(); // Close the dropdown after selection
             }
         }
         // Prevent clicks inside the dropdown from triggering the global click listener immediately
         event.stopPropagation();
     }


    // Handle clicks outside the dropdown or the toggle link
    function handleGlobalClick(event) {
        // Check if the click target is outside the dropdown and outside the toggle link
        if (moduleDropdownElement && !moduleDropdownElement.contains(event.target) && !courseContentTabLink.contains(event.target)) {
            closeDropdown();
        }
    }

    // Add event listener to the "Course Content" tab link to toggle the dropdown
    if (courseContentTabLink) {
         // Add aria-haspopup for accessibility
        courseContentTabLink.setAttribute('aria-haspopup', 'true');
        courseContentTabLink.setAttribute('aria-expanded', 'false'); // Default state

        courseContentTabLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior
            if (moduleDropdownElement) {
                closeDropdown(); // Close if already open
            } else {
                openDropdown(); // Open if closed
            }
             // Update URL hash to #course-content only if dropdown is opened
             // history.pushState(null, '', '#course-content'); // Optional: keep hash simple
        });
    }


    // --- Main Content Rendering Logic (Existing but Modified) ---

    // Determine current view based on URL hash or default to overview
    // If the hash is '#course-content', we don't render content, just open dropdown (handled above)
    const initialHash = window.location.hash.substring(1) || 'overview';

    // Add event listeners to *other* tab links (Overview, Discussion)
    tabsNav.querySelectorAll('.tab-link').forEach(link => {
        // Skip the "Course Content" toggle link
        if (link.dataset.view !== 'course-content-toggle' && !link.classList.contains('disabled')) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const view = event.target.dataset.view; // 'overview' or 'discussion'
                if (view) {
                    renderView(view);
                    // Update URL hash
                    history.pushState(null, '', '#' + view);
                }
            });
        }
    });

    // Add event listeners for clicks within the main content column
    // This is used to handle clicks on module links in the *Overview* list
    mainContentColumn.addEventListener('click', (event) => {
        // Find the closest ancestor <a> tag that has a [data-view] attribute and is inside a .module-item
        const moduleLink = event.target.closest('.module-item a[data-view]');
        if (moduleLink) {
            event.preventDefault(); // Prevent the default link navigation
            const view = moduleLink.dataset.view; // e.g., 'module-1'
            if (view && view.startsWith('module-')) {
                renderView(view);
                // Update URL hash
                history.pushState(null, '', '#' + view);
            }
        }
    });


    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const view = window.location.hash.substring(1) || 'overview';
        renderView(view);
    });

    // Initial render based on hash or default
    // If the hash is #course-content, render overview and let the user click the tab for the dropdown
    // Or, optionally, you could automatically open the dropdown if hash is #course-content
    // For simplicity, we'll just render overview if hash is #course-content
    const viewToRender = (initialHash === 'course-content') ? 'overview' : initialHash;
    renderView(viewToRender);


    function renderView(view) {
        closeDropdown(); // Always close dropdown when rendering new content

        let mainHtml = '';
        let sidebarHtml = ''; // Content for the sidebar column
        let activeLink = null; // The tab link to mark as active
        let showSidebar = false; // Flag to control sidebar visibility

        // Find the correct content fragment
        if (view === 'overview') {
            mainHtml = fragments.overview;
            sidebarHtml = fragments.sidebarOverview; // Get sidebar content specific to overview
            activeLink = tabsNav.querySelector('[data-view="overview"]'); // Activate Overview tab
            showSidebar = true; // Show sidebar for overview
        } else if (view.startsWith('module-')) {
             // Check if the module fragment exists
             if (fragments.modules && fragments.modules[view]) {
                 mainHtml = fragments.modules[view];
             } else {
                 mainHtml = '<p style="color: var(--text-muted-foreground);">Module content not found.</p>';
             }
             sidebarHtml = ''; // Empty sidebar for this view
             // No tab link is specifically 'active' when viewing a module.
             // The context is that you came from the content section.
             activeLink = null; // No tab link active for module view
             showSidebar = false; // Hide sidebar for module content
        }
        // Removed the 'course-content' case as it's no longer a rendered view.

        // If the requested view wasn't found (e.g., invalid module hash)
        if (!mainHtml) {
             console.warn('Content fragment not found for view:', view, 'Defaulting to overview.');
             mainHtml = fragments.overview;
             sidebarHtml = fragments.sidebarOverview;
             activeLink = tabsNav.querySelector('[data-view="overview"]');
             showSidebar = true;
             // Do NOT change history hash here, let popstate handle it or let user re-navigate
        }


        // Update the DOM for main content and sidebar
        mainContentColumn.innerHTML = mainHtml;
        sidebarColumn.innerHTML = sidebarHtml; // This will set content or empty the sidebar

        // Control sidebar visibility based on the flag by adding/removing class from grid
        if (showSidebar) {
            courseBodyGrid.classList.remove('hide-sidebar');
        } else {
            courseBodyGrid.classList.add('hide-sidebar');
        }

        // Update active tab styling
        tabsNav.querySelectorAll('.tab-link').forEach(link => {
             // Don't remove 'active' from the course-content-toggle link if it somehow got it (it shouldn't)
             if (link.dataset.view !== 'course-content-toggle') {
                link.classList.remove('active');
             }
        });
        if (activeLink) {
            activeLink.classList.add('active');
        }

         // Scroll to top of the main content area for better UX
         // Use a small timeout to ensure DOM update finishes
         setTimeout(() => {
             mainContentColumn.scrollIntoView({ behavior: 'smooth' });
         }, 50); // Adjust timeout if needed
    }
});
