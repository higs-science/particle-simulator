let scene, camera, renderer, controls;
let particle;

init();
animate();

function init() {
  console.log("✅ Scene initializing...");

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 10);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x111111); // dark background
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Red particle (no lighting required)
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0044 });
  particle = new THREE.Mesh(geometry, material);
  scene.add(particle);

  // Resize listener
  window.addEventListener('resize', onWindowResize);
  onWindowResize();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const t = Date.now() * 0.001;
  particle.position.x = Math.cos(t) * 3;
  particle.position.y = Math.sin(t) * 3;

  controls.update();
  renderer.render(scene, camera);
}
