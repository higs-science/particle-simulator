let scene, camera, renderer, controls;
let particle;
let timeScale = 1;

init();
animate();

function init() {
  console.log("Initializing scene...");
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 7, 15);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x0b0b0b); // dark background
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);  // Append ONCE here

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff3399, emissive: 0x880022, emissiveIntensity: 0.6 });
  particle = new THREE.Mesh(geometry, material);
  scene.add(particle);

  particle.userData = { velocity: new THREE.Vector3(0.07, 0.05, 0.04) };

  const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  const edges = new THREE.EdgesGeometry(boxGeometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });
  const boxWireframe = new THREE.LineSegments(edges, lineMaterial);
  scene.add(boxWireframe);

  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
  scene.add(gridHelper);

  window.addEventListener('resize', onWindowResize);

  // Force initial resize adjustment
  onWindowResize();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  // Don't append renderer.domElement here again!
}

function animate() {
  requestAnimationFrame(animate);

  particle.position.addScaledVector(particle.userData.velocity, timeScale);

  ['x', 'y', 'z'].forEach(axis => {
    if (particle.position[axis] > 5) {
      particle.position[axis] = 5;
      particle.userData.velocity[axis] *= -1;
    }
    if (particle.position[axis] < -5) {
      particle.position[axis] = -5;
      particle.userData.velocity[axis] *= -1;
    }
  });

  controls.update();

  renderer.clear();
  renderer.render(scene, camera);
}

// Spacebar toggles slow motion (timeScale)
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    timeScale = timeScale === 1 ? 0.1 : 1;
  }
});
