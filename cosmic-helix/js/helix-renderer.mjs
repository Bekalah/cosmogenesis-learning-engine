/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Pure ES module; render once on load, zero animation.

  Layer order honours depth without flattening:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (nodes + paths)
    3) Fibonacci curve (calm logarithmic spiral)
    4) Double-helix lattice (two phase-shifted strands)
*/

export function renderHelix(ctx, opts) {
  if (!ctx) return { ok: false, reason: "missing-context" };

  const { width, height, palette, NUM: N, notice } = opts;
  const layers = Array.isArray(palette?.layers) ? palette.layers : [];
  const fallbackColor = palette?.ink || "#e8e8f0";
  const pick = (index) => pickLayerColor(layers, fallbackColor, index);

  ctx.save();
  ctx.fillStyle = palette?.bg || "#0b0b12";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Layer progression preserves depth without motion.
  drawVesicaField(ctx, width, height, pick(0), N);
  drawTreeOfLife(ctx, width, height, pick(1), pick(2), N);
  drawFibonacci(ctx, width, height, pick(3), N);
  drawHelix(ctx, width, height, pick(4), pick(5), N);

  if (notice) drawNotice(ctx, notice, fallbackColor, width, height);

  return { ok: true };
}

function pickLayerColor(layers, fallback, index) {
  return layers[index] || fallback;
}

// Layer 1: Vesica field — calm intersecting circle lattice guided by numerology counts.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // Soft transparency reduces visual strain.

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 1);
  const spacingY = h / (rows + 1);
  const radius = Math.min(spacingX, spacingY) * (N.ELEVEN / N.ONEFORTYFOUR);
  const offset = radius * (N.THREE / N.SEVEN);

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1);
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      if (row < rows - 1 && col % N.THREE === 0) {
        const nextCy = spacingY * (row + (N.THREE - 1));
        const lensCy = (cy + nextCy) / (N.THREE - 1);
        strokeCircle(ctx, cx, lensCy, radius * (N.NINE / N.ELEVEN));
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life — ten sephirot, twenty-two paths, calm rounded strokes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  const nodes = getTreeNodes(w, h, N);
  const paths = getTreePaths();

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // equals 2; gentle yet readable.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.75;

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  const radius = Math.max(N.NINE / N.TWENTYTWO, 2);
  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function getTreeNodes(w, h, N) {
  const verticalUnit = h / N.ONEFORTYFOUR;
  const centerX = w / 2;
  const pillarSpread = w / (N.THREE + N.SEVEN / N.NINE);
  const leftX = centerX - pillarSpread;
  const rightX = centerX + pillarSpread;

  return [
    { x: centerX, y: verticalUnit * N.ELEVEN },
    { x: rightX, y: verticalUnit * (N.TWENTYTWO + N.THREE) },
    { x: leftX, y: verticalUnit * (N.TWENTYTWO + N.THREE) },
    { x: rightX, y: verticalUnit * (N.THIRTYTHREE + N.SEVEN) },
    { x: leftX, y: verticalUnit * (N.THIRTYTHREE + N.SEVEN) },
    { x: centerX, y: verticalUnit * (N.THIRTYTHREE + N.THIRTYTHREE + N.NINE - N.THREE) },
    { x: rightX, y: verticalUnit * (N.ONEFORTYFOUR - (N.THIRTYTHREE + N.NINE)) },
    { x: leftX, y: verticalUnit * (N.ONEFORTYFOUR - (N.THIRTYTHREE + N.NINE)) },
    { x: centerX, y: verticalUnit * (N.ONEFORTYFOUR - N.TWENTYTWO) },
    { x: centerX, y: verticalUnit * (N.ONEFORTYFOUR - N.THREE) }
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

// Layer 3: Fibonacci curve — static logarithmic spiral referencing golden proportion.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.ELEVEN / N.SEVEN;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.9;

  const centerX = w / 2;
  const centerY = h / 2 + h / N.THIRTYTHREE;
  const baseRadius = Math.min(w, h) / N.NINE;
  const maxAngle = (N.SEVEN / N.THREE) * Math.PI;
  const steps = N.ONEFORTYFOUR;
  const phi = (1 + Math.sqrt(5)) / 2;

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * maxAngle;
    const growth = Math.pow(phi, t / (Math.PI * (N.THREE - 1)));
    const radius = baseRadius * growth;
    const x = centerX + radius * Math.cos(t);
    const y = centerY + radius * Math.sin(t);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

// Layer 4: Double-helix lattice — twin calm strands with gentle cross ties.
function drawHelix(ctx, w, h, colorA, colorB, N) {
  const baseline = h / 2;
  const amplitude = h / (N.THREE + N.NINE);
  const steps = N.ONEFORTYFOUR;
  const rotations = N.THREE + N.SEVEN / N.NINE;
  const strandWidth = N.ELEVEN / N.NINE;

  const strandA = [];
  const strandB = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = t * w;
    const angle = rotations * Math.PI * t;
    const yA = baseline + amplitude * Math.sin(angle);
    const yB = baseline + amplitude * Math.sin(angle + Math.PI);
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  drawPolyline(ctx, strandA, colorA, strandWidth, 0.8);
  drawPolyline(ctx, strandB, colorB, strandWidth, 0.8);
  drawHelixRungs(ctx, strandA, strandB, colorB, N);
}

function drawPolyline(ctx, points, color, width, alpha) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = alpha;
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

function drawHelixRungs(ctx, strandA, strandB, color, N) {
  const step = Math.max(4, Math.floor(strandA.length / N.THIRTYTHREE));
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.ELEVEN / N.TWENTYTWO;
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < strandA.length && i < strandB.length; i += step) {
    ctx.beginPath();
    ctx.moveTo(strandA[i].x, strandA[i].y);
    ctx.lineTo(strandB[i].x, strandB[i].y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawNotice(ctx, text, color, width, height) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.globalAlpha = 0.75;
  ctx.fillText(text, 24, height - 24);
  ctx.restore();
}

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}
