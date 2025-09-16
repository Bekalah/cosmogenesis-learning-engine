/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Offline-first; no external dependencies.

  Layers:
    1) Vesica field (intersecting circle lattice)
    2) Tree-of-Life scaffold (ten sephirot linked by twenty-two paths)
    3) Fibonacci curve (golden spiral polyline)
    4) Double-helix lattice (two phase-shifted sine tracks)

  Rationale:
    - No motion or flashing; everything renders once on load.
    - Gentle contrast palette for ND-safe viewing.
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 steer proportions.
*/

export function renderHelix(ctx, options) {
  if (!ctx) return { ok: false, reason: "missing-context" };

  const { width, height, palette, NUM: N, notice } = options;
  const background = palette.bg || "#0b0b12";
  const ink = palette.ink || "#e8e8f0";
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  const fallbackLayers = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];
  const colorFor = (index) => layers[index] || fallbackLayers[index] || ink;

  ctx.save();
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Layer order builds depth without motion.
  drawVesicaField(ctx, width, height, colorFor(0), N);
  drawTreeOfLife(ctx, width, height, colorFor(1), colorFor(2), N);
  drawFibonacci(ctx, width, height, colorFor(3), N);
  drawHelix(ctx, width, height, colorFor(4), colorFor(5), N);

  if (notice) {
    drawNotice(ctx, width, height, ink, notice);
  }

  return { ok: true };
}

// Layer 1: Vesica field — repeating lenses built from overlapping circles.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.35; // ND-safe translucency keeps the grid calm.
  ctx.lineWidth = 1;

  const columns = N.ELEVEN; // 11 columns (pillar count)
  const rows = N.NINE; // 9 rows (spiral echo)
  const spacingX = w / (columns + 1);
  const spacingY = h / (rows + 1);
  const radius = Math.min(spacingX, spacingY) / (N.THREE / 1.5);
  const lensOffset = radius / (N.SEVEN / N.THREE);

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1);
      strokeCircle(ctx, cx - lensOffset, cy, radius);
      strokeCircle(ctx, cx + lensOffset, cy, radius);

      // Every third column adds a vertical lens to hint at layered depth.
      if (col % N.THREE === 0 && row < rows - 1) {
        const nextCy = spacingY * (row + 2);
        strokeCircle(ctx, cx, (cy + nextCy) / 2, radius * (N.NINE / N.ELEVEN));
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold — slim lines, calm nodes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 22 paths softened by pillar 11 => width 2.
  ctx.lineCap = "round";

  const nodes = getTreeNodes(w, h, N);
  const paths = getTreePaths();

  paths.forEach(([start, end]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[start].x, nodes[start].y);
    ctx.lineTo(nodes[end].x, nodes[end].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = Math.min(w, h) / N.THIRTYTHREE; // ties to 33 for gentle scale.
  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function getTreeNodes(w, h, N) {
  const verticalMargin = h / N.NINE;
  const columnOffset = w / (N.THREE * 2);
  const centerX = w / 2;

  return [
    { x: centerX, y: verticalMargin * 0.5 },
    { x: centerX - columnOffset, y: verticalMargin * 1.5 },
    { x: centerX + columnOffset, y: verticalMargin * 1.5 },
    { x: centerX - columnOffset, y: verticalMargin * 3.3 },
    { x: centerX + columnOffset, y: verticalMargin * 3.3 },
    { x: centerX, y: verticalMargin * 4.2 },
    { x: centerX - columnOffset, y: verticalMargin * 6 },
    { x: centerX + columnOffset, y: verticalMargin * 6 },
    { x: centerX, y: verticalMargin * 7.2 },
    { x: centerX, y: verticalMargin * 8.4 }
  ];
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths.
}

// Layer 3: Fibonacci curve — static golden spiral polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const centerX = w / 2;
  const centerY = h / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = N.SEVEN / N.THREE; // about 2.33 turns keeps the spiral calm.
  const samples = N.ONEFORTYFOUR; // 144 sample points for smoothness.
  const baseRadius = Math.min(w, h) / N.NINETYNINE * N.THIRTYTHREE;
  const growth = Math.log(phi) / (Math.PI / 2);

  ctx.beginPath();
  for (let step = 0; step <= samples; step += 1) {
    const theta = (step / samples) * turns * Math.PI * 2;
    const radius = baseRadius * Math.exp(growth * theta);
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    if (step === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

// Layer 4: Double-helix lattice — two sine waves plus calm cross ties.
function drawHelix(ctx, w, h, strandColor, rungColor, N) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const centerY = h / 2;
  const amplitude = Math.min(h / (N.THREE), h / (N.SEVEN));
  const startX = w / N.NINE;
  const endX = w - startX;
  const samples = N.ONEFORTYFOUR;
  const rotations = N.THIRTYTHREE / N.ELEVEN; // three gentle rotations.
  const stepX = (endX - startX) / samples;

  const strandA = [];
  const strandB = [];

  for (let step = 0; step <= samples; step += 1) {
    const x = startX + step * stepX;
    const angle = (step / samples) * rotations * Math.PI * 2;
    const yA = centerY + Math.sin(angle) * amplitude;
    const yB = centerY + Math.sin(angle + Math.PI) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.strokeStyle = strandColor;
  drawPolyline(ctx, strandA);
  drawPolyline(ctx, strandB);

  ctx.strokeStyle = rungColor;
  for (let step = 0; step <= samples; step += N.ELEVEN) {
    const a = strandA[step];
    const b = strandB[step];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPolyline(ctx, points) {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
}

function drawNotice(ctx, w, h, color, message) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textBaseline = "bottom";
  ctx.fillText(message, 24, h - 24);
  ctx.restore();
}

function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}
