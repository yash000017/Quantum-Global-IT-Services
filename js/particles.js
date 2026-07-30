/* ==========================================================================
   PARTICLES.JS — Quantum particle network animation
   ========================================================================== */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas  = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx     = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse   = { x: null, y: null, radius: 140 };
    this.RAF     = null;

    this.config = {
      count: 110,
      speed:       0.4,
      minRadius:   1.2,
      maxRadius:   2.8,
      lineDistance:130,
      lineOpacity: 0.16,
      colors: ['#0096c7', '#0277a0', '#38bdf8', '#0b3d5c'],
    };

    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    const color = this.config.colors[
      Math.floor(Math.random() * this.config.colors.length)
    ];
    return {
      x:    Math.random() * this.canvas.width,
      y:    Math.random() * this.canvas.height,
      vx:   (Math.random() - 0.5) * this.config.speed,
      vy:   (Math.random() - 0.5) * this.config.speed,
      r:    Math.random() * (this.config.maxRadius - this.config.minRadius) + this.config.minRadius,
      color,
      alpha: Math.random() * 0.5 + 0.3,
      pulse: Math.random() * Math.PI * 2, // phase offset
    };
  }

  init() {
    this.resize();
    this.particles = Array.from({ length: this.config.count }, () => this.createParticle());
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `${r},${g},${b}`;
  }

  drawParticle(p) {
    const ctx = this.ctx;
    p.pulse += 0.02;
    const pulseFactor = Math.sin(p.pulse) * 0.2 + 0.8;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * pulseFactor, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.hexToRgb(p.color)}, ${p.alpha})`;
    ctx.fill();

    // Soft glow
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
    grad.addColorStop(0, `rgba(${this.hexToRgb(p.color)}, 0.08)`);
    grad.addColorStop(1, `rgba(${this.hexToRgb(p.color)}, 0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  drawLines(p, i) {
    const ctx = this.ctx;
    for (let j = i + 1; j < this.particles.length; j++) {
      const q  = this.particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.config.lineDistance) {
        const opacity = (1 - dist / this.config.lineDistance) * this.config.lineOpacity;
        const rgb     = this.hexToRgb(p.color);

        const grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
        grad.addColorStop(0, `rgba(${rgb}, ${opacity})`);
        grad.addColorStop(1, `rgba(${this.hexToRgb(q.color)}, ${opacity})`);

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }
  }

  updateParticle(p) {
    // Mouse repulsion
    if (this.mouse.x !== null) {
      const dx   = p.x - this.mouse.x;
      const dy   = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.vx += (dx / dist) * force * 0.3;
        p.vy += (dy / dist) * force * 0.3;
      }
    }

    // Speed damping
    p.vx *= 0.99;
    p.vy *= 0.99;

    // Clamp speed
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > this.config.speed * 3) {
      p.vx = (p.vx / speed) * this.config.speed * 3;
      p.vy = (p.vy / speed) * this.config.speed * 3;
    }
    if (speed < this.config.speed * 0.1) {
      p.vx += (Math.random() - 0.5) * 0.05;
      p.vy += (Math.random() - 0.5) * 0.05;
    }

    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    if (p.x < -10) p.x = this.canvas.width  + 10;
    if (p.x > this.canvas.width  + 10) p.x = -10;
    if (p.y < -10) p.y = this.canvas.height + 10;
    if (p.y > this.canvas.height + 10) p.y = -10;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.updateParticle(p);
      this.drawLines(p, i);
      this.drawParticle(p);
    }

    this.RAF = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.RAF) cancelAnimationFrame(this.RAF);
  }
}

// Export / init
window.ParticleSystem = ParticleSystem;
