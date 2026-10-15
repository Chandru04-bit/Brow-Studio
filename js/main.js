/**
 * Lash & Brow Studio — Main Application Script
 * Shared interface interactions, navigation, theme switching (Light/Dark),
 * direction switching (LTR/RTL), smooth scrolling, and mobile menu management.
 */

// Immediate execution to prevent theme/direction flash before DOM ready
(function applyInitialSettings() {
  const currentTheme = localStorage.getItem('studio-theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  const currentDir = localStorage.getItem('studio-direction') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);
  document.documentElement.dir = currentDir;
})();

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDirectionToggle();
  initStickyNavbar();
  initActiveNavLink();
  initMobileNavbar();
  initModalFocusCleanup();
  initSmoothScrollWithOffset();
  initBackToTop();
  initSocialLinks();
});

/**
 * --------------------------------------------------------------------------
 * 1. Theme Toggle (Light Mode / Dark Mode)
 * --------------------------------------------------------------------------
 */
function initThemeToggle() {
  const lightBtn = document.getElementById('themeLightBtn');
  const darkBtn = document.getElementById('themeDarkBtn');

  function updateThemeUI(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studio-theme', theme);

    if (lightBtn && darkBtn) {
      if (theme === 'dark') {
        darkBtn.classList.add('active');
        darkBtn.setAttribute('aria-pressed', 'true');
        lightBtn.classList.remove('active');
        lightBtn.setAttribute('aria-pressed', 'false');
      } else {
        lightBtn.classList.add('active');
        lightBtn.setAttribute('aria-pressed', 'true');
        darkBtn.classList.remove('active');
        darkBtn.setAttribute('aria-pressed', 'false');
      }
    }
  }

  // Restore current theme from localStorage
  const savedTheme = localStorage.getItem('studio-theme') || 'light';
  updateThemeUI(savedTheme);

  if (lightBtn) {
    lightBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateThemeUI('light');
    });
  }

  if (darkBtn) {
    darkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateThemeUI('dark');
    });
  }
}

/**
 * --------------------------------------------------------------------------
 * 2. Layout Direction Toggle (LTR / RTL)
 * --------------------------------------------------------------------------
 */
function initDirectionToggle() {
  const ltrBtn = document.getElementById('dirLtrBtn');
  const rtlBtn = document.getElementById('dirRtlBtn');

  function updateDirectionUI(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.dir = dir;
    localStorage.setItem('studio-direction', dir);

    if (ltrBtn && rtlBtn) {
      if (dir === 'rtl') {
        rtlBtn.classList.add('active');
        rtlBtn.setAttribute('aria-pressed', 'true');
        ltrBtn.classList.remove('active');
        ltrBtn.setAttribute('aria-pressed', 'false');
      } else {
        ltrBtn.classList.add('active');
        ltrBtn.setAttribute('aria-pressed', 'true');
        rtlBtn.classList.remove('active');
        rtlBtn.setAttribute('aria-pressed', 'false');
      }
    }
  }

  // Restore current direction from localStorage
  const savedDir = localStorage.getItem('studio-direction') || 'ltr';
  updateDirectionUI(savedDir);

  if (ltrBtn) {
    ltrBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateDirectionUI('ltr');
    });
  }

  if (rtlBtn) {
    rtlBtn.addEventListener('click', (e) => {
      e.preventDefault();
      updateDirectionUI('rtl');
    });
  }
}

/**
 * --------------------------------------------------------------------------
 * 3. Mobile Hamburger Menu Toggle & Auto-Close
 * --------------------------------------------------------------------------
 */
function initMobileNavbar() {
  const toggler = document.getElementById('navbarLuxuryToggler') || document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbarLuxuryCollapse') || document.querySelector('.navbar-collapse');
  if (!toggler || !navbarCollapse) return;

  const hasBootstrapCollapse = typeof bootstrap !== 'undefined' && bootstrap.Collapse;
  const updateTogglerState = (isExpanded) => {
    toggler.setAttribute('aria-expanded', String(isExpanded));
    toggler.classList.toggle('collapsed', !isExpanded);
  };

  updateTogglerState(navbarCollapse.classList.contains('show'));

  function closeMobileMenu() {
    if (navbarCollapse.classList.contains('show')) {
      if (hasBootstrapCollapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
        bsCollapse.hide();
      } else {
        navbarCollapse.classList.remove('show');
      }
      updateTogglerState(false);
    }
  }

  function openMobileMenu() {
    if (!navbarCollapse.classList.contains('show')) {
      if (hasBootstrapCollapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
        bsCollapse.show();
      } else {
        navbarCollapse.classList.add('show');
      }
      updateTogglerState(true);
    }
  }

  if (hasBootstrapCollapse) {
    navbarCollapse.addEventListener('shown.bs.collapse', () => updateTogglerState(true));
    navbarCollapse.addEventListener('hidden.bs.collapse', () => updateTogglerState(false));
  } else {
    toggler.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close when clicking any navigation link or CTA button inside drawer
  const navLinks = navbarCollapse.querySelectorAll('.navbar-nav .nav-link, .navbar-nav-cta .btn-luxury');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close when clicking outside of the navbar
  document.addEventListener('click', (e) => {
    if (navbarCollapse.classList.contains('show')) {
      const isClickInside = navbarCollapse.contains(e.target) || toggler.contains(e.target);
      if (!isClickInside) {
        closeMobileMenu();
      }
    }
  });

  // Close when pressing the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
      closeMobileMenu();
    }
  });
}

function initModalFocusCleanup() {
  document.addEventListener('hide.bs.modal', (event) => {
    const modal = event.target;
    const activeElement = document.activeElement;

    if (modal instanceof HTMLElement && activeElement instanceof HTMLElement && modal.contains(activeElement)) {
      activeElement.blur();
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * 4. Sticky Navbar styling on scroll
 * --------------------------------------------------------------------------
 */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar-luxury');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger once on page load
}

/**
 * --------------------------------------------------------------------------
 * 5. Highlight active page in navigation bar
 * --------------------------------------------------------------------------
 */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.navbar-luxury .nav-link');
  if (!navLinks.length) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (currentHash && href.includes(currentHash)) {
      link.classList.add('active');
    } else if (!currentHash && href === currentPath) {
      link.classList.add('active');
    } else if (!currentHash && (currentPath === '' || currentPath === 'index.html') && href === 'index.html') {
      link.classList.add('active');
    } else {
      if (!href.startsWith('#')) {
        link.classList.remove('active');
      }
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * 6. Smooth scrolling for internal anchor links with sticky navbar offset
 * --------------------------------------------------------------------------
 */
function initSmoothScrollWithOffset() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"]):not([data-bs-toggle])');
  const navbar = document.querySelector('.navbar-luxury');
  const navHeight = navbar ? navbar.offsetHeight : 84;

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight - 15;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * 7. Back to Top Floating Button
 * --------------------------------------------------------------------------
 */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggleBtn = () => {
    if (window.scrollY > 400) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  };

  window.addEventListener('scroll', toggleBtn, { passive: true });
  toggleBtn();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * 8. Reliable Social Media Navigation (Instagram, Facebook, etc.)
 * --------------------------------------------------------------------------
 */
function initSocialLinks() {
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const url = this.getAttribute('href');
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        e.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });
}
