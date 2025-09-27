/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  Rationale: static canvas drawing keeps visual focus and avoids motion
  or autoplay. Soft palette is provided via data/palette.json; if missing,
  index.html falls back to a safe default palette. Geometry constants use
  numerology values to echo the codex alignment.
*/

export const NUM = Object.freeze({
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144,
});

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM: N = NUM } = opts;
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0]);
  const tree = layoutTree(width, height);
  drawTree(ctx, tree, palette.layers[1], palette.layers[2]);
  drawFibonacci(ctx, width / 2, height / 2, Math.min(width, height) / N.TWENTYTWO, palette.layers[3], N.NINETYNINE);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N.THIRTYTHREE, N.SEVEN);
  ctx.restore();
}

// --- Layer 1: Vesica field
function drawVesica(ctx, w, h, color) {
  const r = Math.min(w, h) / 3;
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
  ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// --- Layer 2: Tree-of-Life nodes and paths
function layoutTree(w, h) {
  const X = { L: w * 0.35, C: w * 0.5, R: w * 0.65 };
  const Y = [0.05, 0.18, 0.35, 0.52, 0.67, 0.82, 0.95].map(f => h * f);
  const nodes = [
    { x: X.C, y: Y[0] }, // 1 Kether
    { x: X.R, y: Y[1] }, // 2 Chokmah
    { x: X.L, y: Y[1] }, // 3 Binah
    { x: X.R, y: Y[2] }, // 4 Chesed
    { x: X.L, y: Y[2] }, // 5 Geburah
    { x: X.C, y: Y[3] }, // 6 Tiphereth
    { x: X.R, y: Y[4] }, // 7 Netzach
    { x: X.L, y: Y[4] }, // 8 Hod
    { x: X.C, y: Y[5] }, // 9 Yesod
    { x: X.C, y: Y[6] }  //10 Malkuth
  ];
  // Pairs correspond to 22 traditional paths (Kircher layout)
  const paths = [
    [1,2],[1,3],[1,6],[2,3],[2,4],[2,6],[3,5],[3,6],
    [4,5],[4,6],[4,7],[5,6],[5,8],[6,7],[6,8],[6,9],
    [7,8],[7,9],[7,10],[8,9],[8,10],[9,10]
  ];
  return { nodes, paths };
}

function drawTree(ctx, tree, pathColor, nodeColor) {
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1.5;
  for (const [a, b] of tree.paths) {
    const A = tree.nodes[a - 1];
    const B = tree.nodes[b - 1];
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
  }
  ctx.fillStyle = nodeColor;
  for (const n of tree.nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- Layer 3: Fibonacci curve (log spiral)
function drawFibonacci(ctx, cx, cy, scale, color, steps) {
  const phi = (1 + Math.sqrt(5)) / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < steps; i++) {
    const t = i / 10;
    const r = scale * Math.pow(phi, t / (Math.PI * 2));
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// --- Layer 4: static double-helix lattice
function drawHelix(ctx, w, h, colorA, colorB, segments, cycles) {
  const midY = h / 2;
  const amp = h / 4;
  const step = w / segments;
  const freq = cycles * Math.PI * 2 / w;

  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += step) {
    const y1 = midY + amp * Math.sin(freq * x);
    const y2 = midY + amp * Math.sin(freq * x + Math.PI);
    ctx.strokeStyle = colorB;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 1) {
    const y = midY + amp * Math.sin(freq * x);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 1) {
    const y = midY + amp * Math.sin(freq * x + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}
