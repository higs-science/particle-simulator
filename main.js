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

let zoomLevel = 1; // 1 = normal zoom
let zoomCenter = { x: canvas.width / 2, y: canvas.height / 2 };

// Setup zoom slider and label
const zoomSlider = document.getElementById('zoomSlider');
const zoomLabel = document.getElementById('zoomLabel');

if (zoomSlider && zoomLabel) {
  zoomLabel.textContent = zoomSlider.value + '%';
  zoomSlider.addEventListener('input', () => {
    const val = parseInt(zoomSlider.value, 10);
    zoomLabel.textContent = val + '%';
    // Invert slider so 100% = zoomLevel 1, 1% = zoomLevel 100
    zoomLevel = 101 - val;
    if (zoomLevel < 1) zoomLevel = 1;
    if (zoomLevel > 100) zoomLevel = 100;
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update zoom center based on zoom level and particles
  if (zoomLevel > 10 && particles.length >= 2) {
    // Zoomed in: center between first two particles
    const p1 = particles[0].position;
    const p2 = particles[1].position;
    zoomCenter.x = (p1.x + p2.x) / 2;
    zoomCenter.y = (p1.y + p2.y) / 2;
  } else {
    // Zoomed out: center on canvas center
    zoomCenter.x = canvas.width / 2;
    zoomCenter.y = canvas.height / 2;
  }

  ctx.save();

  // Move origin to canvas center
  ctx.translate(canvas.width / 2, canvas.height / 2);
  // Scale (zoom)
  ctx.scale(zoomLevel, zoomLevel);
  // Translate to zoom center
  ctx.translate(-zoomCenter.x, -zoomCenter.y);

  // Draw and update all particles
  for (const particle of particles) {
    particle.update();
    particle.draw(ctx);
  }

  ctx.restore();

  requestAnimationFrame(animate);
}

animate();
