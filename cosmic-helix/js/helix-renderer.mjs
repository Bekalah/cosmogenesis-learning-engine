/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry aligned with Codex 144:99.

  Layer order (back to front):
    1) Vesica field – intersecting circle lenses to ground the field.
    2) Tree-of-Life scaffold – ten sephirot nodes linked by twenty-two calm paths.
    3) Fibonacci curve – golden spiral polyline that harmonises the lattice.
    4) Double-helix lattice – two static sine strands with soft rungs.

  Safety notes:
    - No animation or flashing; renderHelix draws once per call.
    - Gentle palette and alpha values keep contrast readable for ND-safe viewing.
    - Geometry constants reference 3, 7, 9, 11, 22, 33, 99, 144 as requested.
*/

const DEFAULT_LAYERS = ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6'];
const DEFAULT_NUM = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
};

const TREE_PATHS = [
  [0, 1], [0, 2], [1, 2], [1, 3], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5],
  [3, 6], [4, 7], [5, 6], [5, 7], [6, 7], [6, 8], [7, 8], [6, 9], [7, 9], [8, 9],
  [5, 8], [5, 9]
];

export function renderHelix(ctx, opts = {}) {
  if (!ctx) return { ok: false, reason: 'missing-context' };

  const { width, height, palette = {}, NUM = {}, notice } = opts;
  const safeWidth = typeof width === 'number' ? width : ctx.canvas ? ctx.canvas.width : 0;
  const safeHeight = typeof height === 'number' ? height : ctx.canvas ? ctx.canvas.height : 0;
  if (!safeWidth || !safeHeight) return { ok: false, reason: 'missing-dimensions' };

  const N = { ...DEFAULT_NUM, ...NUM };
  const colors = normalisePalette(palette);

  ctx.save();
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, safeWidth, safeHeight);
  ctx.restore();

  drawVesicaField(ctx, safeWidth, safeHeight, colors.layers[0], N);
  drawTreeOfLife(ctx, safeWidth, safeHeight, colors.layers[1], colors.layers[2], N);
  drawFibonacci(ctx, safeWidth, safeHeight, colors.layers[3], N);
  drawHelixLattice(ctx, safeWidth, safeHeight, colors.layers[4], colors.layers[5], N);

  if (notice) {
    drawNotice(ctx, notice, colors.ink, safeWidth, safeHeight);
  }

  return { ok: true };
}

function normalisePalette(palette) {
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  return {
    background: palette.bg || '#0b0b12',
    ink: palette.ink || '#e8e8f0',
    layers: DEFAULT_LAYERS.map((fallback, index) => layers[index] || fallback)
  };
}

function drawNotice(ctx, text, color, width, height) {
  ctx.save();
  ctx.font = '14px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.fillText(text, 24, height - 24);
  ctx.restore();
}

// Layer 1: Vesica field builds calm intersecting lenses with numerology spacing.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const marginX = w / (N.THIRTYTHREE + 0.5);
  const marginY = h / (N.THIRTYTHREE + 0.5);
  const gridWidth = w - marginX * 2;
  const gridHeight = h - marginY * 2;
  const spacingX = gridWidth / (columns - 1);
  const spacingY = gridHeight / (rows - 1);
  const radius = Math.min(spacingX, spacingY) / (2 - 1 / N.ELEVEN);
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = marginY + row * spacingY;
    for (let col = 0; col < columns; col += 1) {
      const cx = marginX + col * spacingX;
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      if (row < rows - 1) {
        const midY = cy + spacingY / 2;
        strokeCircle(ctx, cx, midY, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life nodes and paths keep the Kabbalistic scaffold legible.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1.5, N.TWENTYTWO / N.ELEVEN);
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.85;

  const nodes = buildTreeNodes(w, h);

  for (const [aIndex, bIndex] of TREE_PATHS) {
    const a = nodes[aIndex];
    const b = nodes[bIndex];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  const nodeRadius = Math.min(w, h) / (N.NINETYNINE / 2.5);

  for (const node of nodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function buildTreeNodes(w, h) {
  const layout = [
    { x: 0.5, y: 0.08 },
    { x: 0.72, y: 0.18 },
    { x: 0.28, y: 0.18 },
    { x: 0.72, y: 0.34 },
    { x: 0.28, y: 0.34 },
    { x: 0.5, y: 0.48 },
    { x: 0.72, y: 0.64 },
    { x: 0.28, y: 0.64 },
    { x: 0.5, y: 0.8 },
    { x: 0.5, y: 0.92 }
  ];

  return layout.map((node) => ({ x: node.x * w, y: node.y * h }));
}

// Layer 3: Fibonacci spiral as a static polyline keeps the golden rhythm without motion.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.9;

  const cx = w / 2;
  const cy = h / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const quarterTurns = N.SEVEN;
  const maxTheta = (Math.PI / 2) * quarterTurns;
  const steps = N.ONEFORTYFOUR;
  const maxRadius = Math.min(w, h) / N.THREE;
  const base = maxRadius / Math.pow(phi, maxTheta / (Math.PI / 2));

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const theta = t * maxTheta;
    const radius = base * Math.pow(phi, theta / (Math.PI / 2));
    const x = cx + radius * Math.cos(theta);
    const y = cy + radius * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

// Layer 4: Double-helix lattice uses two sine strands and gentle rungs for depth.
function drawHelixLattice(ctx, w, h, strandColor, rungColor, N) {
  ctx.save();
  const steps = N.ONEFORTYFOUR;
  const cycles = N.THIRTYTHREE / N.ELEVEN; // three calm rotations across the canvas.
  const amplitude = h / (N.THREE + N.SEVEN / N.NINE);
  const centerY = h / 2;
  const strandWidth = Math.max(1.2, N.ELEVEN / N.TWENTYTWO);
  const rungInterval = Math.max(2, Math.floor(steps / N.TWENTYTWO));

  const strandA = [];
  const strandB = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = t * w;
    const theta = t * cycles * Math.PI * 2;
    const yA = centerY + Math.sin(theta) * amplitude;
    const yB = centerY + Math.sin(theta + Math.PI) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.strokeStyle = strandColor;
  ctx.lineWidth = strandWidth;
  ctx.globalAlpha = 0.85;
  drawPolyline(ctx, strandA);
  drawPolyline(ctx, strandB);

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < strandA.length; i += rungInterval) {
    const a = strandA[i];
    const b = strandB[i];
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPolyline(ctx, points) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}
