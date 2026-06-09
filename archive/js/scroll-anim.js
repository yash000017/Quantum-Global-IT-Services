/* ==========================================================================
   SCROLL-ANIM.JS — Scroll-reveal with IntersectionObserver
   ========================================================================== */

class ScrollAnimator {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Optionally unobserve after first reveal
          if (!entry.target.dataset.repeat) {
            this.observer.unobserve(entry.target);
          }
        } else if (entry.target.dataset.repeat) {
          entry.target.classList.remove('is-visible');
        }
      });
    }, {
      threshold:   0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      this.observer.observe(el);
    });
  }

  // Call after dynamic content is added
  refresh() {
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => {
      this.observer.observe(el);
    });
  }
}

/* ——— Counter animation ————————————————————————————————————————————————— */
class CounterAnimator {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => this.observer.observe(el));
  }

  animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1800;
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const start    = performance.now();

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const value  = eased * target;

      el.textContent = prefix + value.toFixed(decimals) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }
}

/* ——— Parallax ————————————————————————————————————————————————————————— */
class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    if (!this.elements.length) return;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.update(), { passive: true });
    this.update();
  }

  update() {
    const scrollY = window.scrollY;
    this.elements.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.3;
      const rect   = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * speed}px)`;
    });
  }
}

/* ——— Text split reveal ————————————————————————————————————————————————— */
class TextReveal {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('[data-text-reveal]').forEach(el => {
      const words = el.textContent.trim().split(' ');
      el.innerHTML = words
        .map((w, i) =>
          `<span style="display:inline-block;overflow:hidden">
             <span data-reveal="up" data-delay="${(i % 8) * 80}" style="display:inline-block">${w}&nbsp;</span>
           </span>`
        )
        .join('');

      // Re-observe new elements
      document.querySelectorAll('[data-reveal]').forEach(r => {
        if (!r.classList.contains('is-visible')) {
          window._scrollAnimator?.observer.observe(r);
        }
      });
    });
  }
}

window.ScrollAnimator   = ScrollAnimator;
window.CounterAnimator  = CounterAnimator;
window.ParallaxEffect   = ParallaxEffect;
window.TextReveal       = TextReveal;
