let particle;
let timeScale = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  particle = {
    x: width / 2,
    y: height / 2,
    vx: 3,
    vy: 2,
    r: 10
  };
}

function draw() {
  background(10, 10, 30, 50);

  // Update position with time scale
  particle.x += particle.vx * timeScale;
  particle.y += particle.vy * timeScale;

  // Bounce off walls
  if (particle.x < 0 || particle.x > width) particle.vx *= -1;
  if (particle.y < 0 || particle.y > height) particle.vy *= -1;

  // Draw particle
  fill(255, 100, 200);
  noStroke();
  ellipse(particle.x, particle.y, particle.r * 2);
}

// Press space to toggle slow motion
function keyPressed() {
  if (key === ' ') {
    timeScale = timeScale === 1 ? 0.1 : 1;
  }
}
