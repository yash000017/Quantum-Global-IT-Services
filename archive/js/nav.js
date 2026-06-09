/* ==========================================================================
   NAV.JS — Navigation scroll behaviour & mobile menu
   ========================================================================== */

class Navigation {
  constructor() {
    this.nav        = document.getElementById('nav');
    this.burger     = document.getElementById('nav-burger');
    this.mobileNav  = document.getElementById('nav-mobile');
    this.mobileLinks = document.querySelectorAll('#nav-mobile a');
    this.open       = false;
    this.scrollY    = 0;

    if (!this.nav) return;
    this.init();
  }

  init() {
    // Scroll watcher
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Mobile burger
    if (this.burger) {
      this.burger.addEventListener('click', () => this.toggleMobile());
    }

    // Close on link click
    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobile());
    });

    // Close on outside click
    if (this.mobileNav) {
      this.mobileNav.addEventListener('click', (e) => {
        if (e.target === this.mobileNav) this.closeMobile();
      });
    }

    // Active link highlighting
    this.setActiveLink();
  }

  handleScroll() {
    this.scrollY = window.scrollY;
    if (this.scrollY > 60) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }

  toggleMobile() {
    this.open ? this.closeMobile() : this.openMobile();
  }

  openMobile() {
    this.open = true;
    this.burger.classList.add('open');
    this.mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeMobile() {
    this.open = false;
    this.burger?.classList.remove('open');
    this.mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  }

  setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, #nav-mobile a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html') ||
          (path === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
}

window.Navigation = Navigation;
