const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

let mouse = {
  x: w / 2,
  y: h / 2,
  vx: 0,
  vy: 0
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
});

// 粒子追踪系统
class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.alpha = 1;
    this.decay = Math.random() * 0.01 + 0.005;
    this.color = `hsl(${180 + Math.random() * 60}, 100%, 70%)`;
  }
  update() {
    this.x += (mouse.x - this.x) * 0.1 + this.speedX;
    this.y += (mouse.y - this.y) * 0.1 + this.speedY;
    this.alpha -= this.decay;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let particles = [];
function createParticles() {
  for (let i = 0; i < 6; i++) {
    particles.push(new Particle());
  }
}

// 3D 树桩（带年轮、纹理、感应区）
function drawStump(mx, my) {
  const cx = w / 2;
  const cy = h / 2;

  ctx.save();
  ctx.translate(cx, cy);

  // 阴影
  ctx.fillStyle = '#0a0c0e';
  ctx.beginPath();
  ctx.ellipse(0, 100, 220, 90, 0, 0, Math.PI * 2);
  ctx.fill();

  // 树干
  const gradient = ctx.createRadialGradient(0, -40, 0, 0, -40, 260);
  gradient.addColorStop(0, '#3a2a1e');
  gradient.addColorStop(0.6, '#2b1f16');
  gradient.addColorStop(1, '#1a130d');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, 200, 80, 0, 0, Math.PI * 2);
  ctx.fill();

  // 年轮
  ctx.strokeStyle = '#554232';
  ctx.lineWidth = 1.2;
  for (let i = 40; i < 180; i += 25) {
    ctx.beginPath();
    ctx.ellipse(0, 0, i, i * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 裂纹
  ctx.strokeStyle = '#15100a';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    const a = Math.random() * Math.PI * 2;
    const l = 40 + Math.random() * 100;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 30, Math.sin(a) * 15);
    ctx.lineTo(Math.cos(a) * l, Math.sin(a) * (l * 0.35));
    ctx.stroke();
  }

  // 鼠标感应 → 生态光
  const dx = mx - cx;
  const dy = my - cy;
  const dist = Math.hypot(dx, dy);
  if (dist < 190) {
    const light = ctx.createRadialGradient(dx, dy * 0.45, 0, dx, dy * 0.45, 60);
    light.addColorStop(0, 'rgba(110,220,255,0.9)');
    light.addColorStop(0.4, 'rgba(80,180,255,0.4)');
    light.addColorStop(1, 'rgba(30,100,255,0)');

    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.arc(dx, dy * 0.45, 60, 0, Math.PI * 2);
    ctx.fill();

    // 生态点（苔藓/荧光菌）
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 120;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.4;
      if (Math.hypot(x - dx, y - dy * 0.45) < 60) {
        ctx.fillStyle = 'rgba(140,255,180,0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

// 主循环
function loop() {
  ctx.fillStyle = 'rgba(6,8,10,0.15)';
  ctx.fillRect(0, 0, w, h);

  drawStump(mouse.x, mouse.y);

  createParticles();
  particles = particles.filter(p => p.alpha > 0.1);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(loop);
}

loop();