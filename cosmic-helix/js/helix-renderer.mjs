/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles that form repeating lenses)
    2) Tree-of-Life scaffold (10 sephirot linked by 22 paths)
    3) Fibonacci curve (log spiral polyline, computed once)
    4) Double-helix lattice (two still sine curves plus cross ties)

  Rationale:
    - No animation or flashing. Everything is rendered a single time.
    - Soft contrast palette supports ND-safe viewing.
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 guide proportions.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM: N, notice } = opts;
  const { width, height, palette, NUM: N } = opts;

  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  const fallback = palette.ink || "#ffffff";
  const layers = Array.isArray(palette.layers) ? palette.layers : [];

  // Layer order from base to foreground clarifies depth without motion.
  drawVesicaField(ctx, width, height, layerColor(layers, fallback, 0), N);
  drawTreeOfLife(
    ctx,
    width,
    height,
    layerColor(layers, fallback, 1),
    layerColor(layers, fallback, 2),
    N
  );
  drawFibonacci(ctx, width, height, layerColor(layers, fallback, 3), N);
  drawHelix(
    ctx,
    width,
    height,
    layerColor(layers, fallback, 4),
    layerColor(layers, fallback, 5),
    N
  );

  if (notice) {
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = fallback;
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }
}

function layerColor(layers, fallback, index) {
  return layers[index] || fallback;
}

// Layer 1: Vesica field - static circle grid.
// Layer 1: Vesica field - repeating lenses suggested by overlapping circles.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // gentle transparency keeps the grid calm.

  const baseRadius = Math.min(w, h) / (N.THREE + N.SEVEN / N.NINE);
  const rows = N.NINE; // nine rows echo the spiral layer.
  const verticalSpacing = baseRadius * (N.SEVEN / N.NINE);
  const horizontalOffsets = [-baseRadius * 0.66, 0, baseRadius * 0.66];

  for (let row = 0; row < rows; row += 1) {
    const y = h / 2 + (row - (rows - 1) / 2) * verticalSpacing;
    horizontalOffsets.forEach((offset, index) => {
      const x = w / 2 + offset * (index === 1 ? 0 : 1);
      ctx.beginPath();
      ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life - fixed nodes and paths; thin strokes avoid harsh contrast.
// Layer 2: Tree-of-Life - slim lines connect ten calm nodes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // equals 2 for soft yet visible lines.
  ctx.lineCap = "round";

  const nodes = getTreeNodes(w, h);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // equals 3 for compact discs.
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Layer 3: Fibonacci curve - golden spiral polyline.
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

// Layer 3: Fibonacci curve - static golden polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const fib = buildFibonacci(N.NINE);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR;
  let angle = 0;
  let x = w / 2;
  let y = h / 2;

  ctx.beginPath();
  ctx.moveTo(x, y);

  fib.forEach(step => {
    angle += Math.PI / 2;
    x += Math.cos(angle) * step * scale;
    y += Math.sin(angle) * step * scale;
    ctx.lineTo(x, y);
  });

  ctx.stroke();
  ctx.restore();
}

function buildFibonacci(length) {
  const fib = [1, 1];
  while (fib.length < length) {
    const next = fib[fib.length - 1] + fib[fib.length - 2];
    fib.push(next);
  }
  return fib;
}

// Layer 4: Double-helix lattice - two still sine tracks; amplitude limited for calm weave.
// Layer 4: Double-helix lattice - twin sine tracks and gentle connectors.
function drawHelix(ctx, w, h, colorA, colorB, N) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const midY = h / 2;
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // equals h / 9 for balanced breathing room.
  const stepX = w / N.ONEFORTYFOUR;
  const frequency = N.THIRTYTHREE * Math.PI;

  const trackA = generateHelixPoints(w, midY, amplitude, stepX, frequency, 0);
  const trackB = generateHelixPoints(w, midY, amplitude, stepX, frequency, Math.PI);

  strokePolyline(ctx, trackA, colorA);
  strokePolyline(ctx, trackB, colorB);
  drawHelixConnectors(ctx, trackA, trackB, colorB, N);

  ctx.restore();
}

function generateHelixPoints(w, midY, amplitude, stepX, frequency, phaseShift) {
  const points = [];
  for (let x = 0; x <= w; x += stepX) {
    const t = (x / w) * frequency;
    const y = midY + amplitude * Math.sin(t + phaseShift);
    points.push({ x, y });
  }
  return points;
}

function strokePolyline(ctx, points, color) {
  ctx.beginPath();
  points.forEach((pt, index) => {
    if (index === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  });
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawHelixConnectors(ctx, trackA, trackB, color, N) {
  const connectorStep = Math.max(1, Math.floor(trackA.length / N.TWENTYTWO));
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < trackA.length && i < trackB.length; i += connectorStep) {
    ctx.beginPath();
    ctx.moveTo(trackA[i].x, trackA[i].y);
    ctx.lineTo(trackB[i].x, trackB[i].y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
