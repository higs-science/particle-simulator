// Basic 3D Particle Simulator with Three.js

let scene, camera, renderer, controls;
let particle;
let timeScale = 1;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 10);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls (mouse orbit)
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // Particle (sphere)
  const geometry = new THREE.SphereGeometry(0.3, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff6699 });
  particle = new THREE.Mesh(geometry, material);
  scene.add(particle);

  // Particle velocity
  particle.userData = { velocity: new THREE.Vector3(0.05, 0.03, 0.04) };

  // Resize handler
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Move particle based on velocity and timeScale
  particle.position.addScaledVector(particle.userData.velocity, timeScale);

  // Bounce particle inside a cube of size 10
  ['x', 'y', 'z'].forEach(axis => {
    if (particle.position[axis] > 5 || particle.position[axis] < -5) {
      particle.userData.velocity[axis] *= -1;
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

// Spacebar toggles slow motion (timeScale)
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    timeScale = timeScale === 1 ? 0.1 : 1;
  }
});
