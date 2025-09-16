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
    1) Vesica field (intersecting circle lattice)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves)

  Rationale:
    - no motion or flashing; everything renders once on load
    - muted palette keeps contrast gentle for ND-safe viewing
    - numerology constants wire geometry to 3/7/9/11/22/33/99/144
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM: N, notice } = opts;
  const { width, height, palette, NUM: N } = opts;

  ctx.save();
  ctx.fillStyle = palette.bg;
  if (!ctx) return { ok: false, reason: "missing-context" };

  const fallbackLayers = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  const colorFor = (index) => layers[index] || fallbackLayers[index] || "#ffffff";

  ctx.save();
  ctx.fillStyle = palette.bg || "#0b0b12";
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
  // Layer order from background to foreground keeps depth legible without motion.
  drawVesicaField(ctx, width, height, colorFor(0), N);
  drawTreeOfLife(ctx, width, height, colorFor(1), colorFor(2), N);
  drawFibonacci(ctx, width, height, colorFor(3), N);
  drawHelix(ctx, width, height, colorFor(4), colorFor(5), N);

  ctx.restore();
  return { ok: true };
}

// Layer 1: Vesica field builds a calm lens grid using 3/7/9/11 counts.
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

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 1);
  const spacingY = h / (rows + 1);
  const radius = Math.min(spacingX, spacingY) / 1.6;
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row++) {
    const cy = spacingY * (row + 1);
    for (let col = 0; col < columns; col++) {
      const cx = spacingX * (col + 1);
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      // Every other column draws a vertical lens to echo sacred vesica layering.
      if (row < rows - 1 && col % 2 === 0) {
        const nextCy = spacingY * (row + 2);
        const lensCy = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, lensCy, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life - fixed nodes and paths; thin strokes avoid harsh contrast.
// Layer 2: Tree-of-Life - slim lines connect ten calm nodes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // equals 2 for soft yet visible lines.
// Layer 2: Tree-of-Life nodes and paths; gentle strokes avoid harsh edges.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN;
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
  const nodeRadius = N.NINE / 3;
  nodes.forEach((node) => fillCircle(ctx, node.x, node.y, nodeRadius));

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
// Layer 3: Fibonacci curve uses a golden ratio log spiral traced slowly.
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

  const centerX = w / 2;
  const centerY = h / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const quarterTurns = N.SEVEN; // 7 quarter-turns keeps the arc within frame
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
  const midY = h / 2;
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const steps = N.ONEFORTYFOUR;
  const stepX = w / steps;
  const turns = N.THIRTYTHREE / N.ELEVEN; // about three calm rotations across the canvas
  const frequency = (Math.PI * 2 * turns) / w;

  const strands = [
    { phase: 0, color: colorA, points: [] },
    { phase: Math.PI, color: colorB, points: [] }
  ];

  strands.forEach((strand) => {
    ctx.strokeStyle = strand.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += stepX) {
      const y = midY + amplitude * Math.sin(frequency * x + strand.phase);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      strand.points.push({ x, y });
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
  });

  // Draw gentle rungs to hint the lattice without sharp angles.
  ctx.strokeStyle = colorB;
  ctx.lineWidth = 1;
  const rungStep = Math.max(1, Math.floor(strands[0].points.length / N.TWENTYTWO));
  for (let i = 0; i < strands[0].points.length; i += rungStep) {
    const left = strands[0].points[i];
    const right = strands[1].points[i];
    if (!left || !right) continue;
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

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

function getTreeNodes(w, h) {
  return [
    { x: w / 2, y: h * 0.05 },
    { x: w * 0.25, y: h * 0.15 },
    { x: w * 0.75, y: h * 0.15 },
    { x: w * 0.25, y: h * 0.35 },
    { x: w * 0.75, y: h * 0.35 },
    { x: w / 2, y: h * 0.45 },
    { x: w * 0.25, y: h * 0.65 },
    { x: w * 0.75, y: h * 0.65 },
    { x: w / 2, y: h * 0.75 },
    { x: w / 2, y: h * 0.9 }
  ];
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ];
}
