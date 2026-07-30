/* ==========================================================================
   FX.JS — Subtle parallax + interactive motion polish
   ========================================================================== */

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = window.matchMedia('(pointer: coarse)').matches;

class HeroFxParallax {
  constructor() {
    this.layer = document.querySelector('.hero-float') || document.querySelector('.hero-fx');
    if (!this.layer || REDUCE) return;
    this.targetX = 0;
    this.targetY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.onMove = this.onMove.bind(this);
    this.tick = this.tick.bind(this);
    window.addEventListener('mousemove', this.onMove, { passive: true });
    this.tick();
  }

  onMove(e) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    this.targetX = (e.clientX - cx) / cx;
    this.targetY = (e.clientY - cy) / cy;
  }

  tick() {
    this.currentX += (this.targetX - this.currentX) * 0.06;
    this.currentY += (this.targetY - this.currentY) * 0.06;
    this.layer.style.setProperty('--fx-x', `${this.currentX * 18}px`);
    this.layer.style.setProperty('--fx-y', `${this.currentY * 12}px`);
    requestAnimationFrame(this.tick);
  }
}

class CardTilt {
  constructor() {
    if (REDUCE || COARSE) return;

    document.querySelectorAll('.card, .cta-box').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -6;
        const ry = ((x / r.width) - 0.5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

class ScrollProgress {
  constructor() {
    if (REDUCE) return;
    this.bar = document.createElement('div');
    this.bar.className = 'site-progress';
    this.bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(this.bar);
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    this.bar.style.width = `${pct}%`;
  }
}

class LineDrawers {
  constructor() {
    if (REDUCE) return;
    const targets = [
      ...document.querySelectorAll('.timeline'),
      ...document.querySelectorAll('.process-steps'),
    ];
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    targets.forEach(t => io.observe(t));
  }
}

class AmbientDots {
  constructor() {
    if (REDUCE) return;
    const sections = document.querySelectorAll(
      '#services-preview, #why-us, #tech, #home-cta, .about-values, .about-journey, .about-team, .services-full, .services-process, .contact-section, .book-section'
    );

    sections.forEach((section, i) => {
      if (getComputedStyle(section).position === 'static') {
        section.style.position = 'relative';
      }
      const layer = document.createElement('div');
      layer.className = 'ambient-dots';
      layer.setAttribute('aria-hidden', 'true');
      for (let n = 0; n < 4; n++) {
        const dot = document.createElement('span');
        dot.style.left = `${12 + ((n * 23 + i * 7) % 76)}%`;
        dot.style.top = `${18 + ((n * 19 + i * 11) % 64)}%`;
        dot.style.animationDelay = `${n * 0.55}s`;
        dot.style.width = `${5 + (n % 3)}px`;
        dot.style.height = dot.style.width;
        layer.appendChild(dot);
      }
      section.prepend(layer);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HeroFxParallax();
  new CardTilt();
  new ScrollProgress();
  new LineDrawers();
  new AmbientDots();
});
