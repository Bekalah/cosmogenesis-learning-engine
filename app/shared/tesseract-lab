/*
  Tesseract Lab — Shared 3D Module (ESM)
  Cosmogenesis Learning Engine · ND-safe · zero build · mobile-friendly.

  PURPOSE
  • A reusable 3D “tesseract + spiral nodes” scene that ANY experience can mount.
  • No autoplay audio; motion-respect; small, dependency-light (lazy-loads three.js).
  • One simple API: createTesseractLab(container, options?) → { update, screenshot, destroy, audio }

  DROP-IN
  <script type="module">
    import { createTesseractLab } from "/app/shared/tesseract-lab.js";
    const mount = document.getElementById("stage");
    const lab = await createTesseractLab(mount, {
      layout: "tesseract", // "tesseract" | "helix" | "ring"
      count: 22,
      nodeSize: 0.28,
      labelSize: 14,
      speed: 0.24,
      depth: 1.2,
      labels: ["Siren","Trickster","Healer","Guardian","Archivist","Mirror Witch"]
    });
    // later: lab.update({ speed: 0.1 }); lab.screenshot(); lab.destroy();
  </script>

  ACCESSIBILITY
  • No animation if prefers-reduced-motion is on (or lab.update({ reduce: true })).
  • High-contrast labels; calm-color toggle supported at call site.

  AUDIO (Optional, user-gesture required)
  • lab.audio.start(), lab.audio.stop(), lab.audio.setRate(hz), setDepth(0..1), setWet(0..1)
  • lab.audio.playTone({ hz: 432, gain: 0.14, type: "sine" })
  • lab.audio.playTrack("/assets/sound/ambient_gothic_whispers.mp3")
*/

export async function createTesseractLab(container, options = {}) {
  // ----------- Lazy-load THREE if missing (ESM via CDN) -----------
  const THREE = await ensureThree();

  // ----------- DOM / Canvas -----------
  const canvas = document.createElement("canvas");
  canvas.className = "tesseract-viz";
  canvas.setAttribute("aria-label", "Tesseract learning canvas");
  Object.assign(canvas.style, {
    display: "block",
    width: "100%",
    height: "min(82vh, 1000px)"
  });
  container.appendChild(canvas);

  // ----------- State / Defaults -----------
  const state = {
    layout: "tesseract",
    count: 22,
    speed: 0.24,
    depth: 1.2,
    nodeSize: 0.28,
    labelSize: 14,
    labels: [],
    reduce: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };
  Object.assign(state, options || {});
  let phase = Math.random() * Math.PI * 2;
  const spriteCache = new Map();

  // ----------- THREE Scene -----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  const scene = new THREE.Scene();
  const fogColor = isDarkMode() ? 0x0b0e13 : 0xf7f5ef;
  scene.fog = new THREE.FogExp2(fogColor, isDarkMode() ? 0.14 : 0.06);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.01, 200);
  camera.position.set(0, 0, 4.4);

  const lightA = new THREE.DirectionalLight(0xffffff, 0.85); lightA.position.set(3, 4, 5);
  const lightB = new THREE.AmbientLight(0x8899aa, 0.6);
  scene.add(lightA, lightB);

  const matEdge = new THREE.LineBasicMaterial({ color: isDarkMode() ? 0x65a3ff : 0x1f6feb, transparent: true, opacity: 0.65 });
  const matNode = new THREE.MeshStandardMaterial({ color: isDarkMode() ? 0xb48cff : 0x7b61ff, roughness: 0.5, metalness: 0.2 });

  const root = new THREE.Group();
  const nodesGroup = new THREE.Group();
  const labelsGroup = new THREE.Group();
  scene.add(root);
  root.add(nodesGroup, labelsGroup);

  // ----------- Build tesseract wireframe -----------
  let tesseract = buildTesseract(THREE, matEdge);
  root.add(tesseract);

  // ----------- Helpers -----------
  function parseLabels(arrOrString) {
    if (Array.isArray(arrOrString)) return arrOrString;
    const raw = String(arrOrString || "").trim();
    if (!raw) return [];
    try {
      const j = JSON.parse(raw);
      if (Array.isArray(j)) return j.map(x => (x && (x.name || x.title || x.label)) || String(x));
    } catch {}
    if (raw.includes(",")) return raw.split(",").map(s => s.trim()).filter(Boolean);
    return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }

  function effectiveLabels() {
    const n = state.count | 0;
    const arr = Array.isArray(state.labels) && state.labels.length
      ? state.labels
      : Array.from({ length: n }, (_, i) => String(i + 1));
    return arr.slice(0, n);
  }

  function labelSprite(text, size) {
    const key = text + "@" + size + (isDarkMode() ? ":dark" : ":light");
    if (spriteCache.has(key)) return spriteCache.get(key).clone();
    const pad = 8;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    ctx.font = `${size}px system-ui, -apple-system, Segoe UI, Roboto`;
    const w = Math.ceil(ctx.measureText(text).width) + pad * 2, h = size + pad * 2;
    c.width = w * 2; c.height = h * 2; // HiDPI
    ctx.scale(2, 2);
    const bg = isDarkMode() ? "rgba(0,0,0,0.42)" : "rgba(255,255,255,0.72)";
    const fg = isDarkMode() ? "#ffffff" : "#0d0f14";
    ctx.fillStyle = bg; ctx.fillRect(6, 6, w - 12, h - 12);
    ctx.fillStyle = fg; ctx.fillText(text, pad, h - pad * 1.2);
    const tex = new THREE.CanvasTexture(c); tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(w / 200, h / 200, 1);
    spriteCache.set(key, sprite);
    return sprite.clone();
  }

  function buildNodes() {
    nodesGroup.clear();
    labelsGroup.clear();
    const n = state.count | 0;
    const r1 = 0.7, r2 = 1.6 * state.depth;
    const labels = effectiveLabels();
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1 || 1);
      let x, y, z;
      if (state.layout === "helix") {
        const a = phase + t * 8 * Math.PI;
        x = Math.cos(a) * r1; y = (t - 0.5) * 2.2; z = Math.sin(a) * r1 * state.depth;
      } else if (state.layout === "ring") {
        const a = phase + i * (2 * Math.PI / n);
        x = Math.cos(a) * r2; y = 0; z = Math.sin(a) * r2 * 0.6;
      } else { // tesseract spiral
        const a = phase + t * 10 * Math.PI;
        const s = lerp(0.4, r2, t);
        x = Math.cos(a) * s; y = Math.sin(a) * s * 0.6; z = (t - 0.5) * 2.6 * state.depth;
      }
      const geo = new THREE.SphereGeometry(state.nodeSize, 24, 16);
      const mesh = new THREE.Mesh(geo, matNode.clone());
      mesh.position.set(x, y, z);
      mesh.material.color.setHSL((i / n + 0.65) % 1, 0.5, isDarkMode() ? 0.6 : 0.45);
      nodesGroup.add(mesh);

      const spr = labelSprite(String(labels[i] ?? i + 1), state.labelSize);
      spr.position.set(x, y + state.nodeSize * 0.9, z);
      labelsGroup.add(spr);
    }
  }

  // ----------- Render / Resize -----------
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = container.clientWidth || canvas.clientWidth || 640;
    const h = Math.min(window.innerHeight * 0.82, 1000) | 0 || 480;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();
  buildNodes();

  let raf = 0, last = 0;
  function loop(ts) {
    const dt = (ts - last) * 0.001; last = ts;
    const speed = state.reduce ? 0 : state.speed;
    root.rotation.y += speed * dt;
    root.rotation.x += (speed * 0.5) * dt;
    tesseract.rotation.x -= (speed * 0.4) * dt;
    tesseract.rotation.y += (speed * 0.6) * dt;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  // ----------- Public API -----------
  function update(next = {}) {
    const prevReduce = state.reduce;
    Object.assign(state, next || {});
    if (typeof next.labels !== "undefined") state.labels = parseLabels(next.labels);
    if (typeof next.phase !== "undefined") phase = Number(next.phase) || phase;
    if (prevReduce !== state.reduce && state.reduce) {
      // instantly stop motion if reduce toggled on
      root.rotation.set(0, 0, 0);
      tesseract.rotation.set(0, 0, 0);
    }
    buildNodes();
  }

  function screenshot(filename = "tesseract-lab.png") {
    try {
      const data = renderer.domElement.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = data; a.download = filename; a.click();
      return true;
    } catch {
      return false;
    }
  }

  function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose?.();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose?.());
        else obj.material.dispose?.();
      }
      if (obj.texture) obj.texture.dispose?.();
    });
    renderer.dispose();
    container.removeChild(canvas);
  }

  // ----------- Optional Audio (Bilateral) -----------
  const audio = createBilateralAudio();

  return { update, screenshot, destroy, audio };

  // ======== internals ========
  function buildTesseract(THREE, mat) {
    const verts4 = [];
    for (let a of [-1, 1]) for (let b of [-1, 1]) for (let c of [-1, 1]) for (let d of [-1, 1]) {
      verts4.push([a, b, c, d]);
    }
    const verts3 = verts4.map(([x, y, z, w]) => {
      const k = 1 / (1 + 0.4 * w);
      return new THREE.Vector3(x * k, y * k, z * k);
    });
    const edges = [];
    for (let i = 0; i < verts4.length; i++) {
      for (let j = i + 1; j < verts4.length; j++) {
        const diff = verts4[i].filter((v, idx) => v !== verts4[j][idx]).length;
        if (diff === 1) edges.push([i, j]);
      }
    }
    const geo = new THREE.BufferGeometry();
    const pts = [];
    edges.forEach(([i, j]) => {
      pts.push(
        verts3[i].x, verts3[i].y, verts3[i].z,
        verts3[j].x, verts3[j].y, verts3[j].z
      );
    });
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const lines = new THREE.LineSegments(geo, mat);
    lines.name = "tesseract";
    return lines;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function isDarkMode() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
}

// ========== Lazy loader for three.js ==========
async function ensureThree() {
  // Already loaded?
  // @ts-ignore
  if (globalThis.THREE?.REVISION) return globalThis.THREE;

  // Try ESM import map host page set
  try {
    const mod = await import("three");
    // @ts-ignore
    globalThis.THREE = mod;
    return mod;
  } catch {}

  // Fallback to CDN ESM
  const url = "https://unpkg.com/three@0.160.0/build/three.module.js";
  const mod = await import(/* @vite-ignore */ url);
  // @ts-ignore
  globalThis.THREE = mod;
  return mod;
}

// ========== Bilateral Audio helper ==========
function createBilateralAudio() {
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  const ctx = AC ? new AC() : null;
  if (!ctx) return stub();

  const master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
  const convolver = ctx.createConvolver();
  const wet = ctx.createGain(); wet.gain.value = 0.0; convolver.connect(wet); wet.connect(master);
  const dry = ctx.createGain(); dry.gain.value = 1.0; dry.connect(master);

  const panner = ctx.createStereoPanner(); panner.connect(dry); panner.connect(convolver);
  const lfo = ctx.createOscillator(); lfo.frequency.value = 1.0;
  const lfoGain = ctx.createGain(); lfoGain.gain.value = 1.0; lfo.connect(lfoGain); lfoGain.connect(panner.pan); lfo.start();

  const toneGain = ctx.createGain(); toneGain.gain.value = 0.0; toneGain.connect(panner);
  const trackGain = ctx.createGain(); trackGain.gain.value = 0.0; trackGain.connect(panner);
  let tone = null, track = null;

  // user-gesture resume
  const resume = () => { if (ctx.state === "suspended") ctx.resume(); window.removeEventListener("pointerdown", resume); window.removeEventListener("keydown", resume); };
  window.addEventListener("pointerdown", resume, { passive: true });
  window.addEventListener("keydown", resume);

  return {
    async start() { if (ctx.state === "suspended") await ctx.resume(); },
    async stop()  { stopTone(); stopTrack(); },
    async loadIR(url) {
      const buf = await fetch(url, { cache: "force-cache" }).then(r => r.arrayBuffer());
      convolver.buffer = await ctx.decodeAudioData(buf);
    },
    setRate(hz = 1.0) { lfo.frequency.value = clamp(hz, 0.1, 4); },
    setDepth(d = 1.0) { lfoGain.gain.value = clamp(d, 0, 1); },
    setWet(w = 0.25) { wet.gain.value = clamp(w, 0, 1); dry.gain.value = 1 - wet.gain.value; },
    async playTone({ hz = 432, gain = 0.14, type = "sine" } = {}) {
      await this.start(); stopTone();
      tone = ctx.createOscillator(); tone.type = type; tone.frequency.value = clamp(hz, 40, 2000);
      tone.connect(toneGain); toneGain.gain.setTargetAtTime(clamp(gain, 0, 1), ctx.currentTime, 0.05);
      tone.start();
    },
    stopTone: () => stopTone(),
    async playTrack(url, { gain = 0.35, loop = true } = {}) {
      await this.start(); await stopTrack();
      const buf = await fetch(url, { cache: "force-cache" }).then(r => r.arrayBuffer());
      const audio = await ctx.decodeAudioData(buf);
      const src = ctx.createBufferSource(); src.buffer = audio; src.loop = loop;
      src.connect(trackGain); trackGain.gain.setTargetAtTime(clamp(gain, 0, 1), ctx.currentTime, 0.05);
      src.start(); track = src;
    },
    stopTrack: () => stopTrack()
  };

  function stopTone() {
    if (tone) { try { tone.stop(); } catch {} tone.disconnect(); tone = null; toneGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05); }
  }
  async function stopTrack() {
    if (track) { try { track.stop(); } catch {} track.disconnect(); track = null; trackGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05); }
  }
}

function stub() {
  // graceful no-audio fallback
  const noop = async () => {};
  return {
    start: noop, stop: noop, loadIR: noop,
    setRate: () => {}, setDepth: () => {}, setWet: () => {},
    playTone: noop, stopTone: () => {}, playTrack: noop, stopTrack: () => {}
  };
}

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }