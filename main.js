
/* ── Custom cursor ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animRing);
}
animRing();

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── Particle canvas ── */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, particles;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initParticles() {
  particles = Array.from({ length: 55 }, () => ({
    x:    Math.random() * W,
    y:    Math.random() * H,
    vx:   (Math.random() - 0.5) * 0.3,
    vy:   (Math.random() - 0.5) * 0.3,
    r:    Math.random() * 1.5 + 0.3,
    warm: Math.random() > 0.6,
    alpha: Math.random() * 0.5 + 0.1,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  /* dots */
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W;  if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;  if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.warm
      ? `rgba(255,140,66,${p.alpha})`
      : `rgba(0,200,255,${p.alpha})`;
    ctx.fill();
  });

  /* connections */
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const dx   = a.x - b.x;
      const dy   = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        const alpha = (1 - dist / 130) * 0.07;
        ctx.strokeStyle = `rgba(0,200,255,${alpha})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(drawParticles);
}

resize();
initParticles();
drawParticles();

window.addEventListener('resize', () => {
  resize();
  initParticles();
});