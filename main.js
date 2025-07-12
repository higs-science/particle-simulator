const canvas = document.getElementById('sim');
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

const leftParticleBtn = document.getElementById('leftParticleBtn');
const rightParticleBtn = document.getElementById('rightParticleBtn');
const particleModal = document.getElementById('particleModal');
const beamSideLabel = document.getElementById('beamSideLabel');
const normalParticlesContainer = document.getElementById('normalParticles');
const antiParticlesContainer = document.getElementById('antiParticles');
const closeModalBtn = document.getElementById('closeParticleModal');

let selectingSide = 'left';

let selectedParticles = {
  left: { name: 'Electron', color: '#00f' },
  right: { name: 'Anti-Electron', color: '#0f0' }
};

const standardModelParticles = [
  { name: 'Electron', color: '#00f' },
  { name: 'Muon', color: '#0ff' },
  { name: 'Tau', color: '#08f' },
  { name: 'Up Quark', color: '#f00' },
  { name: 'Down Quark', color: '#fa0' },
  { name: 'Strange Quark', color: '#ff0' },
  { name: 'Charm Quark', color: '#0f0' },
  { name: 'Bottom Quark', color: '#0a0' },
  { name: 'Top Quark', color: '#800' },
  { name: 'Photon', color: '#fff' },
  { name: 'Z Boson', color: '#ccc' },
  { name: 'W Boson', color: '#999' }
];

function populateParticleGrid(grid, particles) {
  grid.innerHTML = '';
  particles.forEach(p => {
    const btn = document.createElement('div');
    btn.className = 'particle-button';
    btn.textContent = p.name;
    btn.style.backgroundColor = p.color;
    btn.addEventListener('click', () => {
      selectedParticles[selectingSide] = p;
      particleModal.classList.remove('show');
    });
    grid.appendChild(btn);
  });
}

leftParticleBtn.addEventListener('click', () => {
  selectingSide = 'left';
  beamSideLabel.textContent = 'left';
  particleModal.classList.remove('hidden');
  particleModal.classList.add('show');
});

rightParticleBtn.addEventListener('click', () => {
  selectingSide = 'right';
  beamSideLabel.textContent = 'right';
  particleModal.classList.remove('hidden');
  particleModal.classList.add('show');
});

closeModalBtn.addEventListener('click', () => {
  particleModal.classList.remove('show');
  particleModal.classList.add('hidden');
});


populateParticleGrid(normalParticlesContainer, standardModelParticles);
populateParticleGrid(antiParticlesContainer, standardModelParticles.map(p => ({
  name: 'Anti-' + p.name,
  color: p.color.replace(/f/g, 'c') // simple tweak: 'f' → 'c' for anti colors
})));



