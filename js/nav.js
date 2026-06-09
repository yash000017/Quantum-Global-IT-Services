/* ==========================================================================
   NAV.JS — Navigation scroll behaviour & mobile menu
   ========================================================================== */

class Navigation {
  constructor() {
    this.nav         = document.getElementById('nav');
    this.burger      = document.getElementById('nav-burger');
    this.mobileNav   = document.getElementById('nav-mobile');
    this.closeBtn    = document.getElementById('nav-mobile-close');
    this.backdrop    = this.mobileNav?.querySelector('[data-nav-close]');
    this.mobileLinks = document.querySelectorAll('.nav-mobile__links a');
    this.open        = false;
    this.scrollY     = 0;

    if (!this.nav) return;
    this.init();
  }

  init() {
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    this.burger?.addEventListener('click', () => this.toggleMobile());
    this.closeBtn?.addEventListener('click', () => this.closeMobile());
    this.backdrop?.addEventListener('click', () => this.closeMobile());

    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobile());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.open) this.closeMobile();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && this.open) this.closeMobile();
    });

    this.setActiveLink();
  }

  handleScroll() {
    this.scrollY = window.scrollY;
    this.nav.classList.toggle('scrolled', this.scrollY > 60);
  }

  toggleMobile() {
    this.open ? this.closeMobile() : this.openMobile();
  }

  openMobile() {
    this.open = true;
    this.nav.classList.add('nav-mobile-open');
    this.burger?.classList.add('open');
    this.mobileNav?.classList.add('open');
    this.burger?.setAttribute('aria-expanded', 'true');
    this.burger?.setAttribute('aria-label', 'Close menu');
    this.mobileNav?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.closeBtn?.focus();
  }

  closeMobile() {
    this.open = false;
    this.nav.classList.remove('nav-mobile-open');
    this.burger?.classList.remove('open');
    this.mobileNav?.classList.remove('open');
    this.burger?.setAttribute('aria-expanded', 'false');
    this.burger?.setAttribute('aria-label', 'Open menu');
    this.mobileNav?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile__links a').forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === path ||
        (path === '' && href === 'index.html') ||
        (path === 'index.html' && href === 'index.html');
      link.classList.toggle('active', isActive);
    });
  }
}

window.Navigation = Navigation;
