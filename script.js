let scene, camera, renderer, controls;
let particle;

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 10);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x222222);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  particle = new THREE.Mesh(geometry, material);
  scene.add(particle);

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

  // Simple animation: move particle in circle
  const time = Date.now() * 0.001;
  particle.position.x = Math.cos(time) * 3;
  particle.position.y = Math.sin(time) * 3;

  controls.update();
  renderer.render(scene, camera);
}
