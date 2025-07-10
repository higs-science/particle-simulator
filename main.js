const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle class, easily extendable to 3D later
class Particle {
  constructor(x, y, vx, vy, radius = 5, color = '#ff0044') {
    this.position = { x, y };
    this.velocity = { x: vx, y: vy };
    this.radius = radius;
    this.color = color;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Bounce off walls
    if (this.position.x < this.radius || this.position.x > canvas.width - this.radius) {
      this.velocity.x *= -1;
    }
    if (this.position.y < this.radius || this.position.y > canvas.height - this.radius) {
      this.velocity.y *= -1;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const particles = [];

// Add a few particles to start with
for (let i = 0; i < 10; i++) {
  particles.push(new Particle(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4
  ));
}
let zoomLevel = 1;        // 1 = normal size, >1 = zoomed in
let zoomCenter = { x: canvas.width / 2, y: canvas.height / 2 };  // zoom center point

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save(); // Save current transform

  // Translate to zoom center, scale, then translate back
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(zoomLevel, zoomLevel);
  ctx.translate(-zoomCenter.x, -zoomCenter.y);

  for (const particle of particles) {
    particle.update();
    particle.draw(ctx);
  }

  ctx.restore(); // Restore to original state

  requestAnimationFrame(animate);
}


animate();
