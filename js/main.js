/* ==========================================================================
   MAIN.JS — Initialise everything
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Cursor ────────────────────────────────────────────────────────────── */
  new CustomCursor();

  /* ── Navigation ─────────────────────────────────────────────────────────── */
  new Navigation();

  /* ── Scroll Animations ───────────────────────────────────────────────────── */
  window._scrollAnimator = new ScrollAnimator();
  new CounterAnimator();
  new ParallaxEffect();

  /* ── Particles (homepage only) ───────────────────────────────────────────── */
  if (document.getElementById('particle-canvas')) {
    new ParticleSystem('particle-canvas');
  }

  /* ── Custom selects ──────────────────────────────────────────────────────── */
  CustomSelect.initAll();

  /* ── Form validation ───────────────────────────────────────────────────────── */
  FormValidation.init();

  /* ── Contact / Book form handling ────────────────────────────────────────── */
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!FormValidation.validateForm(form)) return;
      handleFormSubmit(form);
    });
  });

  /* ── Smooth anchor links ─────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Magnetic buttons ────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left - rect.width  / 2;
      const y    = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

});

/* ——— Form submission ————————————————————————————————————————————————————— */
function handleFormSubmit(form) {
  const btn        = form.querySelector('[type="submit"]');
  const originalTxt = btn.textContent;

  btn.disabled     = true;
  btn.textContent  = 'Sending…';

  // Simulate network request
  setTimeout(() => {
    showFormSuccess(form);
    btn.disabled    = false;
    btn.textContent = originalTxt;
  }, 1400);
}

function showFormSuccess(form) {
  const success = document.createElement('div');
  success.className   = 'form-success';
  success.style.cssText = `
    position: fixed; inset: 0; z-index: 5000;
    display: flex; align-items: center; justify-content: center;
    background: rgba(2,2,9,0.85);
    backdrop-filter: blur(12px);
    animation: fadeIn 0.3s ease;
  `;

  success.innerHTML = `
    <div style="
      background: var(--bg-overlay);
      border: 1px solid var(--border-b);
      border-radius: 24px;
      padding: 56px 64px;
      text-align: center;
      max-width: 480px;
      animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
    ">
      <div style="
        width: 64px; height: 64px;
        border-radius: 50%;
        background: var(--cyan-dim);
        border: 1px solid rgba(0,212,255,0.3);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 24px;
        font-size: 1.6rem;
      ">✓</div>
      <h3 style="font-family:var(--font-display); font-size:1.6rem; margin-bottom:12px; letter-spacing:-0.02em;">
        Message Received
      </h3>
      <p style="font-size:0.95rem; color:var(--t2); line-height:1.7; margin-bottom:32px;">
        Thank you for reaching out. A member of our team will be in touch within 24 hours.
      </p>
      <button onclick="this.closest('.form-success').remove()" class="btn btn-ghost btn-sm">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(success);
  success.addEventListener('click', (e) => {
    if (e.target === success) success.remove();
  });
  form.reset();
}
