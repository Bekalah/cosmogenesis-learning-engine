/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Offline-first; no external dependencies.

  Layers:
    1) Vesica field (intersecting circles forming gentle lenses)
    2) Tree-of-Life scaffold (ten sephirot linked by twenty-two paths)
    3) Fibonacci curve (golden spiral polyline traced once)
    4) Double-helix lattice (two sine strands with soft cross ties)

  Rationale:
    - No animation or flashing; everything renders a single time on load.
    - Soft contrast palette supports ND-safe viewing and preserves depth order.
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 guide spacing and sampling.
*/

export function renderHelix(ctx, options) {
  const { width, height, palette, NUM: N, notice } = options;
  if (!ctx) return;

  const fallbackLayers = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  const background = palette.bg || "#0b0b12";
  const ink = palette.ink || "#e8e8f0";

  ctx.save();
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  // Layer order from base to foreground clarifies depth without motion.
  drawVesicaField(ctx, width, height, layerColor(layers, fallbackLayers, 0), N);
  drawTreeOfLife(
    ctx,
    width,
    height,
    layerColor(layers, fallbackLayers, 1),
    layerColor(layers, fallbackLayers, 2),
    N
  );
  drawFibonacci(ctx, width, height, layerColor(layers, fallbackLayers, 3), N);
  drawHelix(
    ctx,
    width,
    height,
    layerColor(layers, fallbackLayers, 4),
    layerColor(layers, fallbackLayers, 5),
    N
  );

  if (notice) {
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.8;
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }

  ctx.restore();
}

function layerColor(layers, fallbackLayers, index) {
  return layers[index] || fallbackLayers[index];
}

// Layer 1: Vesica field builds a calm lens grid using 3/7/9/11 spacing.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // gentle transparency keeps the grid calm.

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 1);
  const spacingY = h / (rows + 1);
  const radius = Math.min(spacingX, spacingY) / (N.THREE / (N.SEVEN / N.NINE));
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1);
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      if (row < rows - 1 && col % 2 === 0) {
        const nextCy = spacingY * (row + 2);
        const lensCy = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, lensCy, radius * (N.NINE / N.ELEVEN));
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life nodes and paths; gentle strokes avoid harsh edges.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // equals 2 for soft yet visible lines.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const nodes = getTreeNodes(w, h);
  const paths = getTreePaths();

  paths.forEach(([startIndex, endIndex]) => {
    const start = nodes[startIndex];
    const end = nodes[endIndex];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / N.THREE; // node size tied to 9 and 3 to stay calm.
  nodes.forEach(node => fillCircle(ctx, node.x, node.y, nodeRadius));

  ctx.restore();
}

function getTreeNodes(w, h) {
  return [
    { x: w / 2, y: h * 0.06 },
    { x: w * 0.27, y: h * 0.16 },
    { x: w * 0.73, y: h * 0.16 },
    { x: w * 0.27, y: h * 0.36 },
    { x: w * 0.73, y: h * 0.36 },
    { x: w / 2, y: h * 0.46 },
    { x: w * 0.27, y: h * 0.66 },
    { x: w * 0.73, y: h * 0.66 },
    { x: w / 2, y: h * 0.78 },
    { x: w / 2, y: h * 0.92 }
  ];
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4],
    [3, 5], [4, 5], [3, 6],
    [4, 7], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8],
    [5, 8], [6, 9], [7, 9], [8, 9]
  ];
}

// Layer 3: Fibonacci curve uses a golden ratio log spiral traced slowly.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const centerX = w / 2;
  const centerY = h / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const quarterTurns = N.SEVEN; // seven quarter-turns keeps the arc contained.
  const thetaMax = quarterTurns * (Math.PI / 2);
  const startRadius = Math.min(w, h) / N.THIRTYTHREE;
  const growth = Math.log(phi) / (Math.PI / 2);

  ctx.beginPath();
  for (let theta = 0; theta <= thetaMax; theta += Math.PI / N.TWENTYTWO) {
    const radius = startRadius * Math.exp(growth * theta);
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    if (theta === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

// Layer 4: Double-helix lattice, two calm sine strands with light rungs.
function drawHelix(ctx, w, h, colorA, colorB, N) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 2;

  const midY = h / 2;
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // echoes twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curves smooth without motion.
  const turns = N.THIRTYTHREE / N.ELEVEN; // about three rotations across the canvas.
  const frequency = (Math.PI * 2 * turns) / w;

  const trackA = [];
  const trackB = [];
  for (let x = 0; x <= w; x += stepX) {
    const angle = frequency * x;
    trackA.push({ x, y: midY + amplitude * Math.sin(angle) });
    trackB.push({ x, y: midY + amplitude * Math.sin(angle + Math.PI) });
  }

  strokePolyline(ctx, trackA, colorA);
  strokePolyline(ctx, trackB, colorB);
  drawHelixRungs(ctx, trackA, trackB, colorB, N);

  ctx.restore();
}

function strokePolyline(ctx, points, color) {
  if (!points.length) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.restore();
}

function drawHelixRungs(ctx, trackA, trackB, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6;
  const limit = Math.min(trackA.length, trackB.length);
  const step = Math.max(1, Math.floor(limit / N.TWENTYTWO));
  for (let index = 0; index < limit; index += step) {
    const left = trackA[index];
    const right = trackB[index];
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }
  ctx.restore();
}

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function fillCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}
