/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Layers draw once in a stable order to honour the no-motion requirement.
  Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) guide proportions.
*/

export function renderHelix(ctx, options) {
  if (!ctx || typeof ctx.moveTo !== "function") {
    return { ok: false, reason: "no-context" };
  }

  const config = options || {};
  const width = Number(config.width) || ctx.canvas.width;
  const height = Number(config.height) || ctx.canvas.height;
  const palette = config.palette || {};
  const NUM = config.NUM || {};
  const notice = typeof config.notice === "string" ? config.notice : "";

  const fallbackLayers = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  const fallbackInk = palette.ink || "#e8e8f0";
  const layerColor = (index) => layers[index] || fallbackLayers[index] || fallbackInk;

  ctx.save();
  ctx.fillStyle = palette.bg || "#0b0b12";
  ctx.fillRect(0, 0, width, height);

  drawVesicaField(ctx, width, height, layerColor(0), NUM);
  drawTreeOfLife(ctx, width, height, layerColor(1), layerColor(2), NUM);
  drawFibonacci(ctx, width, height, layerColor(3), NUM);
  drawHelix(ctx, width, height, layerColor(4), layerColor(5), NUM);
  drawNotice(ctx, width, height, notice, fallbackInk);

  ctx.restore();
  return { ok: true };
}

/* Layer 1 — Vesica field. Calm overlapping circles form a lens grid without motion. */
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // Soft opacity keeps the background from overpowering other layers.

  const rows = clampPositive(N.NINE, 9);
  const columns = clampPositive(N.ELEVEN, 11);
  const marginX = w / clampPositive(N.TWENTYTWO, 22);
  const marginY = h / clampPositive(N.THIRTYTHREE, 33);
  const usableW = w - marginX * 2;
  const usableH = h - marginY * 2;
  const spacingX = usableW / Math.max(columns - 1, 1);
  const spacingY = usableH / Math.max(rows - 1, 1);
  const baseRadius = Math.min(spacingX, spacingY) / (clampPositive(N.THREE, 3) / 1.5);
  const offset = baseRadius * (clampPositive(N.THREE, 3) / clampPositive(N.SEVEN, 7));

  for (let row = 0; row < rows; row += 1) {
    const cy = marginY + spacingY * row;
    for (let col = 0; col < columns; col += 1) {
      const cx = marginX + spacingX * col;
      strokeCircle(ctx, cx - offset, cy, baseRadius);
      strokeCircle(ctx, cx + offset, cy, baseRadius);

      if (row < rows - 1 && col % 2 === 0) {
        const nextCy = marginY + spacingY * (row + 1);
        const lensCy = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, lensCy, baseRadius);
      }
    }
  }

  ctx.restore();
}

/* Layer 2 — Tree-of-Life. Thin paths and calm nodes respect ND-safe contrast. */
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  const nodes = createTreeNodes(w, h);
  const paths = createTreePaths();
  const strokeWidth = clampPositive(N.TWENTYTWO, 22) / clampPositive(N.ELEVEN, 11);
  const nodeRadius = Math.min(w, h) / (clampPositive(N.THIRTYTHREE, 33) * 2);

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = strokeWidth;
  ctx.globalAlpha = 0.8;
  paths.forEach(([a, b]) => {
    const start = nodes[a];
    const end = nodes[b];
    if (!start || !end) return;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  nodes.forEach((node) => {
    strokeCircle(ctx, node.x, node.y, nodeRadius, true);
  });

  ctx.restore();
}

/* Layer 3 — Fibonacci spiral approximated as a polyline to avoid flashing arcs. */
function drawFibonacci(ctx, w, h, color, N) {
  const cx = w / 2;
  const cy = h / 2;
  const points = createFibonacciPoints(cx, cy, w, h, N);

  if (!points.length) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  points.forEach((pt, index) => {
    if (index === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  });
  ctx.stroke();
  ctx.restore();
}

/* Layer 4 — Double helix lattice. Two sine strands with static cross ties. */
function drawHelix(ctx, w, h, primaryColor, secondaryColor, N) {
  const sampleCount = clampPositive(N.ONEFORTYFOUR, 144);
  const cycles = clampPositive(N.THREE, 3);
  const baseline = h / 2;
  const amplitude = h / clampPositive(N.SEVEN, 7);
  const pointsA = [];
  const pointsB = [];

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / (sampleCount - 1 || 1);
    const x = t * w;
    const theta = cycles * 2 * Math.PI * t;
    const yA = baseline + amplitude * Math.sin(theta);
    const yB = baseline + amplitude * Math.sin(theta + Math.PI);
    pointsA.push({ x, y: yA });
    pointsB.push({ x, y: yB });
  }

  ctx.save();
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;
  strokePolyline(ctx, pointsA, primaryColor);
  strokePolyline(ctx, pointsB, secondaryColor);

  const tieStep = Math.max(1, Math.floor(sampleCount / clampPositive(N.TWENTYTWO, 22)));
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = secondaryColor;
  for (let i = 0; i < sampleCount; i += tieStep) {
    const a = pointsA[i];
    const b = pointsB[i];
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNotice(ctx, w, h, message, color) {
  if (!message) return;
  ctx.save();
  ctx.font = "14px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  ctx.fillText(message, 24, h - 24);
  ctx.restore();
}

function strokeCircle(ctx, x, y, radius, filled) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(radius, 0), 0, Math.PI * 2);
  if (filled) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

function strokePolyline(ctx, points, color) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  points.forEach((pt, index) => {
    if (index === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  });
  ctx.stroke();
}

function clampPositive(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return num;
}

function createTreeNodes(w, h) {
  const positions = [
    { x: 0.5, y: 0.08 }, // Keter
    { x: 0.72, y: 0.18 }, // Chokmah
    { x: 0.28, y: 0.18 }, // Binah
    { x: 0.76, y: 0.36 }, // Chesed
    { x: 0.24, y: 0.36 }, // Geburah
    { x: 0.5, y: 0.5 },  // Tiphareth
    { x: 0.74, y: 0.68 }, // Netzach
    { x: 0.26, y: 0.68 }, // Hod
    { x: 0.5, y: 0.84 },  // Yesod
    { x: 0.5, y: 0.94 }   // Malkuth
  ];

  return positions.map((pos) => ({ x: pos.x * w, y: pos.y * h }));
}

function createTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 3], [1, 5],
    [2, 3], [2, 4], [2, 5],
    [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 7],
    [5, 6], [5, 7], [6, 7],
    [6, 8], [6, 9], [7, 8], [7, 9],
    [8, 9]
  ];
}

function createFibonacciPoints(cx, cy, w, h, N) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const samples = clampPositive(N.NINETYNINE, 99);
  const turns = clampPositive(N.THREE, 3);
  const maxTheta = turns * Math.PI;
  const baseRadius = Math.min(w, h) / clampPositive(N.ELEVEN, 11);

  const rawPoints = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = (maxTheta * i) / samples;
    const growth = Math.pow(phi, t / (Math.PI / 2));
    rawPoints.push({
      x: cx + baseRadius * growth * Math.cos(t),
      y: cy + baseRadius * growth * Math.sin(t)
    });
  }

  const maxDistance = rawPoints.reduce((acc, pt) => {
    const distance = Math.hypot(pt.x - cx, pt.y - cy);
    return Math.max(acc, distance);
  }, 0) || 1;

  const limit = Math.min(w, h) / (clampPositive(N.THREE, 3) - 1 / clampPositive(N.THIRTYTHREE, 33));
  const scale = limit / maxDistance;

  return rawPoints.map((pt) => ({
    x: cx + (pt.x - cx) * scale,
    y: cy + (pt.y - cy) * scale
  }));
}
