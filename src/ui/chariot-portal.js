import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';

export function initChariotPortal() {
  // create renderer and attach full-screen canvas
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.zIndex = '-1';
  document.body.appendChild(renderer.domElement);

  // set up scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // portal geometry (wireframe torus knot evokes chariot/portal)
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x845ec2, wireframe: true });
  const portal = new THREE.Mesh(geometry, material);
  scene.add(portal);

  // starfield backdrop
  const stars = new THREE.BufferGeometry();
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 200;
  }
  stars.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
  const starMesh = new THREE.Points(stars, starMat);
  scene.add(starMesh);

  // animation loop
  function animate() {
    requestAnimationFrame(animate);
    portal.rotation.x += 0.01;
    portal.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animate();

  // handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

