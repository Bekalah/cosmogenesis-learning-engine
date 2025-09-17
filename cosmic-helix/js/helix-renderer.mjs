/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Layers render once in calm order to honour trauma-informed design.
*/

const FALLBACK_LAYERS = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];

export function renderHelix(ctx, options) {
  if (!ctx) {
    return { ok: false, reason: "missing-context" };
  }

  const width = options.width;
  const height = options.height;
  const palette = ensurePalette(options.palette);
  const N = options.NUM;
  const notice = options.notice;

  ctx.save();
  clearCanvas(ctx, width, height, palette.background);

  // Layer order moves from foundation to foreground without motion.
  drawVesicaField(ctx, width, height, palette.layer(0), N);
  drawTreeOfLife(ctx, width, height, palette.layer(1), palette.layer(2), N);
  drawFibonacciSpiral(ctx, width, height, palette.layer(3), N);
  drawDoubleHelix(ctx, width, height, palette.layer(4), palette.layer(5), N);

  if (notice) {
    drawNotice(ctx, width, height, notice, palette.ink);
  }

  ctx.restore();
  return { ok: true };
}

function ensurePalette(palette) {
  const base = palette || {};
  const layers = Array.isArray(base.layers) ? base.layers : [];
  return {
    background: base.bg || "#0b0b12",
    ink: base.ink || "#e8e8f0",
    layer(index) {
      return layers[index] || FALLBACK_LAYERS[index] || "#ffffff";
    }
  };
}

function clearCanvas(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Layer 1: Vesica field — overlapping circles evoke a womb of forms without motion.
function drawVesicaField(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;
  ctx.lineCap = "round";

  const columns = N.ELEVEN; // Eleven pillars weave 3/7/11 numerology.
  const rows = N.NINE;
  const stepX = width / (columns + 1);
  const stepY = height / (rows + 1);
  const radius = Math.min(stepX, stepY) / 1.8;
  const horizontalOffset = radius / N.THREE;
  const verticalOffset = stepY / N.SEVEN;

  for (let row = 0; row < rows; row += 1) {
    const cy = stepY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = stepX * (col + 1);
      strokeCircle(ctx, cx - horizontalOffset, cy, radius);
      strokeCircle(ctx, cx + horizontalOffset, cy, radius);

      if (row < rows - 1) {
        const lensY = cy + verticalOffset;
        strokeCircle(ctx, cx, lensY, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life — ten sephirot with twenty-two gentle paths.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, N) {
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1, N.TWENTYTWO / N.ELEVEN); // 22 paths softened by pillar 11.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const nodes = getTreeNodes(width, height);
  const paths = getTreePaths();

  paths.forEach(pair => {
    const a = nodes[pair[0]];
    const b = nodes[pair[1]];
    if (!a || !b) return;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 0.9;
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = nodeColor;
  const nodeRadius = Math.min(width, height) / N.NINETYNINE;

  nodes.forEach(node => {
    strokeCircle(ctx, node.x, node.y, nodeRadius);
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Layer 3: Fibonacci spiral — golden curve drawn once for calm movement suggestion.
function drawFibonacciSpiral(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.THREE / 2; // Equals 1.5px, subtle yet visible.
  ctx.globalAlpha = 0.8;
  ctx.lineCap = "round";

  const phi = (1 + Math.sqrt(5)) / 2;
  const maxRadius = Math.hypot(width, height);
  const baseRadius = Math.min(width, height) / N.SEVEN;
  const originX = width * 0.36;
  const originY = height * 0.58;
  const points = [];

  for (let i = 0; i <= N.THIRTYTHREE; i += 1) {
    const angle = i * (Math.PI / N.NINE) * 1.5; // Gentle turn increments align with ninefold rhythm.
    const radius = baseRadius * Math.pow(phi, i / N.SEVEN);
    if (radius > maxRadius) break;
    const x = originX + radius * Math.cos(angle);
    const y = originY + radius * Math.sin(angle);
    points.push({ x, y });
  }

  drawPolyline(ctx, points);
  ctx.restore();
}

// Layer 4: Double helix lattice — static sine strands with cross ties.
function drawDoubleHelix(ctx, width, height, strandColor, rungColor, N) {
  ctx.save();
  const steps = N.ONEFORTYFOUR; // Sample density ties to 144 for lattice stability.
  const centerX = width * 0.68;
  const amplitude = width / N.TWENTYTWO;
  const verticalStep = height / steps;
  const curveA = [];
  const curveB = [];

  for (let i = 0; i <= steps; i += 1) {
    const y = i * verticalStep;
    const angle = (i / N.THIRTYTHREE) * Math.PI * 2; // 33 harmonics through the strand.
    const offset = Math.sin(angle) * amplitude;
    curveA.push({ x: centerX - offset, y });
    curveB.push({ x: centerX + offset, y });
  }

  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = strandColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  drawPolyline(ctx, curveA);

  ctx.globalAlpha = 0.45;
  drawPolyline(ctx, curveB);

  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.5;
  const rungCount = N.TWENTYTWO;
  const rungInterval = Math.max(1, Math.floor(steps / rungCount));

  for (let i = 0; i <= steps; i += rungInterval) {
    const a = curveA[i];
    const b = curveB[i];
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNotice(ctx, width, height, text, color) {
  if (!text) return;
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = color;
  ctx.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textBaseline = "bottom";
  ctx.fillText(text, 24, height - 24);
  ctx.restore();
}

function getTreeNodes(width, height) {
  const layout = [
    { x: 0.5, y: 0.08 },
    { x: 0.28, y: 0.2 },
    { x: 0.72, y: 0.2 },
    { x: 0.28, y: 0.38 },
    { x: 0.72, y: 0.38 },
    { x: 0.5, y: 0.52 },
    { x: 0.28, y: 0.68 },
    { x: 0.72, y: 0.68 },
    { x: 0.5, y: 0.82 },
    { x: 0.5, y: 0.94 }
  ];
  return layout.map(point => ({ x: point.x * width, y: point.y * height }));
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ];
}

function drawPolyline(ctx, points) {
  if (!points || points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}
