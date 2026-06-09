/* ==========================================================================
   CURSOR.JS — Custom cursor with smooth ring follow
   ========================================================================== */

class CustomCursor {
  constructor() {
    this.dot  = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');
    if (!this.dot || !this.ring) return;

    // Current positions
    this.dotX  = 0; this.dotY  = 0;
    this.ringX = 0; this.ringY = 0;

    // Target
    this.targetX = 0; this.targetY = 0;

    // Ring lag factor (lower = more lag)
    this.ease = 0.12;

    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;

      // Dot moves instantly
      this.dotX = e.clientX;
      this.dotY = e.clientY;
      this.dot.style.transform = `translate(${this.dotX}px, ${this.dotY}px) translate(-50%, -50%)`;
    });

    document.addEventListener('mouseleave', () => {
      this.dot.style.opacity  = '0';
      this.ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.dot.style.opacity  = '1';
      this.ring.style.opacity = '1';
    });

    // State: hovered clickable elements
    document.querySelectorAll('a, button, [data-cursor="hover"], .card, .service-card, .team-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Observe dynamic additions
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a:not([data-cursor-bound]), button:not([data-cursor-bound])').forEach(el => {
        el.setAttribute('data-cursor-bound', '');
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    this.animate();
  }

  animate() {
    // Smooth ring follow
    this.ringX += (this.targetX - this.ringX) * this.ease;
    this.ringY += (this.targetY - this.ringY) * this.ease;

    this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(() => this.animate());
  }
}

window.CustomCursor = CustomCursor;
