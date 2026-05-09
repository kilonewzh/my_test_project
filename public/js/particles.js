const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('particles-bg');

container.appendChild(canvas);

let w, h;
let particles = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.r = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.6 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

function create() {
  for (let i=0; i<300; i++) {
    particles.push(new Particle());
  }
}
create();

function loop() {
  requestAnimationFrame(loop);
  ctx.clearRect(0,0,w,h);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
}
loop();