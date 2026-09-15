/**
 * Task 4 Client-Side Routing Implementation
 * Handles seamless navigation between routes without full-page reloads.
 */

document.addEventListener('DOMContentLoaded', () => {
  const routes = {
    '/': { sections: ['section-hero', 'section-register', 'section-users', 'section-external', 'section-about'] },
    '/register': { sections: ['section-register'] },
    '/users': { sections: ['section-users'] },
    '/external': { sections: ['section-external'] },
    '/about': { sections: ['section-about'] }
  };

  function navigateTo(path, pushState = true) {
    const routeKey = routes[path] ? path : '/';
    const activeSections = routes[routeKey].sections;

    // Show/hide section containers
    document.querySelectorAll('.page-section').forEach(sec => {
      if (activeSections.includes(sec.id)) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });

    // Update Nav Link Active States
    document.querySelectorAll('.nav-link-custom').forEach(link => {
      const linkPath = link.getAttribute('data-link') || link.getAttribute('href');
      if (linkPath === path || (path === '/' && linkPath === '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Push State to Browser History if needed
    if (pushState && window.location.pathname !== path) {
      window.history.pushState({ path }, '', path);
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Intercept Navigation Link Clicks
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link-custom');
    if (link) {
      const targetPath = link.getAttribute('data-link') || link.getAttribute('href');
      if (targetPath && targetPath.startsWith('/')) {
        e.preventDefault();
        navigateTo(targetPath);
      }
    }
  });

  // Handle Browser Back / Forward Buttons
  window.addEventListener('popstate', (e) => {
    const path = e.state ? e.state.path : window.location.pathname;
    navigateTo(path, false);
  });

  // Initialize Route based on current URL path
  navigateTo(window.location.pathname, false);
});
