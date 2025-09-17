/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  All helpers are pure drawing routines so offline maintenance stays simple.
*/

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

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

export function renderHelix(ctx, options) {
  if (!ctx) return { ok: false, reason: "missing-context" };

  const width = options.width;
  const height = options.height;
  const palette = options.palette || DEFAULT_PALETTE;
  const numerology = options.NUM || DEFAULT_NUM;
  const notice = options.notice || null;

  const layers = Array.isArray(palette.layers) ? palette.layers : DEFAULT_PALETTE.layers;
  const bg = palette.bg || DEFAULT_PALETTE.bg;
  const ink = palette.ink || DEFAULT_PALETTE.ink;

  ctx.save();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  drawVesicaField(ctx, width, height, pickLayerColor(layers, 0), numerology);
  drawTreeOfLife(
    ctx,
    width,
    height,
    pickLayerColor(layers, 1),
    pickLayerColor(layers, 2),
    numerology
  );
  drawFibonacci(ctx, width, height, pickLayerColor(layers, 3), numerology);
  drawHelix(
    ctx,
    width,
    height,
    pickLayerColor(layers, 4),
    pickLayerColor(layers, 5),
    numerology
  );

  if (notice) drawNotice(ctx, ink, notice, width, height);

  return { ok: true };
}

function pickLayerColor(layers, index) {
  const fallback = DEFAULT_PALETTE.layers[index] || "#ffffff";
  const candidate = layers[index];
  return typeof candidate === "string" ? candidate : fallback;
}

function drawVesicaField(ctx, width, height, color, N) {
  /* Layer 1: vesica grid. Soft transparency keeps the lens pattern calm. */
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = width / (columns + 1);
  const spacingY = height / (rows + 1);
  const radius = Math.min(spacingX, spacingY) / 1.6;
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
        strokeCircle(ctx, cx, lensCy, radius);
      }
    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, N) {
  /* Layer 2: Tree-of-Life scaffold. Thin strokes avoid harsh edges. */
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN;
  ctx.lineCap = "round";

  const nodes = getTreeNodes(width, height);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => strokeLine(ctx, nodes[a], nodes[b]));

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3;
  nodes.forEach((node) => fillCircle(ctx, node.x, node.y, nodeRadius));

  ctx.restore();
}

function drawFibonacci(ctx, width, height, color, N) {
  /* Layer 3: Fibonacci spiral. Drawn once for calm, ND-safe flow. */
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const phi = (1 + Math.sqrt(5)) / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const quarterTurns = N.SEVEN;
  const thetaMax = quarterTurns * (Math.PI / 2);
  const startRadius = Math.min(width, height) / N.THIRTYTHREE;
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

function drawHelix(ctx, width, height, colorA, colorB, N) {
  /* Layer 4: double-helix lattice. Static sine strands with gentle rungs. */
  ctx.save();

  const steps = N.ONEFORTYFOUR;
  const stepX = width / steps;
  const midY = height / 2;
  const amplitude = (height / N.NINETYNINE) * N.ELEVEN;
  const turns = N.THIRTYTHREE / N.ELEVEN;
  const frequency = (Math.PI * 2 * turns) / width;

  const trackA = generateHelixPoints(width, midY, amplitude, stepX, frequency, 0);
  const trackB = generateHelixPoints(width, midY, amplitude, stepX, frequency, Math.PI);

  strokePolyline(ctx, trackA, colorA);
  strokePolyline(ctx, trackB, colorB);
  drawHelixConnectors(ctx, trackA, trackB, colorB, N);

  ctx.restore();
}

function drawNotice(ctx, ink, notice, width, height) {
  ctx.save();
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.8;
  ctx.font = "14px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText(notice, 24, height - 24);
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

function strokeLine(ctx, a, b) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function strokePolyline(ctx, points, color) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function drawHelixConnectors(ctx, trackA, trackB, color, N) {
  const count = Math.min(trackA.length, trackB.length);
  if (!count) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;

  const stride = Math.max(1, Math.floor(count / N.TWENTYTWO));
  for (let i = 0; i < count; i += stride) {
    strokeLine(ctx, trackA[i], trackB[i]);
  }

  ctx.restore();
}

function generateHelixPoints(width, midY, amplitude, stepX, frequency, phase) {
  const points = [];
  for (let x = 0; x <= width; x += stepX) {
    const y = midY + amplitude * Math.sin(frequency * x + phase);
    points.push({ x, y });
  }
  return points;
}

function getTreeNodes(width, height) {
  return [
    { x: width / 2, y: height * 0.06 },
    { x: width * 0.27, y: height * 0.16 },
    { x: width * 0.73, y: height * 0.16 },
    { x: width * 0.27, y: height * 0.36 },
    { x: width * 0.73, y: height * 0.36 },
    { x: width / 2, y: height * 0.46 },
    { x: width * 0.27, y: height * 0.66 },
    { x: width * 0.73, y: height * 0.66 },
    { x: width / 2, y: height * 0.78 },
    { x: width / 2, y: height * 0.92 }
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
