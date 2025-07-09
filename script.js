let scene, camera, renderer, controls;
let particle;

init();
animate();

function init() {
  console.log("✅ Scene initializing...");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x111111);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Create red particle
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0044 });
  particle = new THREE.Mesh(geometry, material);
  scene.add(particle);

  window.addEventListener("resize", onWindowResize);
  onWindowResize();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Make the particle orbit
  const time = Date.now() * 0.001;
  particle.position.x = Math.cos(time) * 3;
  particle.position.y = Math.sin(time) * 3;

  controls.update();
  renderer.render(scene, camera);
}
