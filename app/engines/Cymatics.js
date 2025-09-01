// ✦ Codex 144:99 — Cymatics Engine (sound ↔ spiral)
// Loads a CC0 audio track, analyzes it with the Web Audio API,
// and maps frequency energy onto a 33‑node Jacob's Ladder spiral using Three.js.

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { createCymaticsBridge } from '../shared/cymatics-bridge.js';

// ✦ applySound — main entry
// url: public‑domain/CC0 audio file
// mount: DOM element to attach renderer (defaults to document.body)
export async function applySound(url, mount = document.body) {
  // ⚑ Create analysis bridge
  const bridge = await createCymaticsBridge();
  await bridge.loadTrack(url);

  // ⚑ Three.js scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 25;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(512, 512);
  mount.appendChild(renderer.domElement);

  // ⚑ Build 33‑node spiral
  const nodes = [];
  const nodeCount = 33;
  for (let i = 0; i < nodeCount; i++) {
    const angle = i * 0.4; // spiral step
    const radius = 0.5 * i;
    const geo = new THREE.SphereGeometry(0.5, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    scene.add(mesh);
    nodes.push(mesh);
  }

  // ⚑ Map spectrum to nodes each frame
  bridge.onFrame(({ spectrum }) => {
    const step = Math.floor(spectrum.length / nodeCount);
    nodes.forEach((n, i) => {
      const amp = spectrum[i * step];
      n.scale.setScalar(0.5 + amp * 2);
      n.material.color.setHSL(0.7 - amp * 0.7, 1, 0.5);
    });
  });

  // ⚑ Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();

  // ⚑ Start audio playback & analysis
  await bridge.play();
  bridge.start();

  return { scene, bridge };
}
