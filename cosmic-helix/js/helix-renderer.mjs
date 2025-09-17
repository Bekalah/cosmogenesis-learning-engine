/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Offline-first; no external dependencies or motion.

  Layer order (background to foreground):
    1) Vesica field - intersecting circle grid for the womb of forms.
    2) Tree-of-Life scaffold - ten sephirot linked by twenty-two paths.
    3) Fibonacci curve - golden spiral polyline anchored to centre.
    4) Double-helix lattice - two phase-shifted strands with gentle cross ties.

  Numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 shape spacing, counts,
  and sampling so the cosmology stays aligned with Codex 144:99.
*/

export function renderHelix(ctx, opts) {
  if (!ctx) {
    return { ok: false, reason: "missing-context" };
  }

  const { width, height, palette, NUM: N, notice } = opts;
  const colors = normalizePalette(palette);

  ctx.save();
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height); // ND-safe: single render pass, no motion.

  drawVesicaField(ctx, width, height, colors.layers[0], N);
  drawTreeOfLife(ctx, width, height, colors.layers[1], colors.layers[2], N);
  drawFibonacci(ctx, width, height, colors.layers[3], N);
  drawHelix(ctx, width, height, colors.layers[4], colors.layers[5], N);

  if (notice) {
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = colors.ink;
    ctx.globalAlpha = 0.8;
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }

  ctx.restore();
  return { ok: true };
}

function normalizePalette(palette) {
  const fallback = {
    bg: "#0b0b12",
    ink: "#e8e8f0",
    layers: ["#4a90e2", "#7bb3f0", "#7ed321", "#b8e986", "#9013fe", "#af52de"]
  };

  const safePalette = typeof palette === "object" && palette ? palette : {};
  const sourceLayers = Array.isArray(safePalette.layers) ? safePalette.layers : [];

  return {
    bg: typeof safePalette.bg === "string" ? safePalette.bg : fallback.bg,
    ink: typeof safePalette.ink === "string" ? safePalette.ink : fallback.ink,
    layers: fallback.layers.map((color, index) => sourceLayers[index] || color)
  };
}

// Layer 1: Vesica field - intersecting lenses rendered once for calm depth.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // Soft transparency keeps the grid from overwhelming.

  const columns = N.ELEVEN; // 11 columns honour the Sephirot pillars.
  const rows = N.NINE; // 9 rows nod to the lunar spheres.
  const spacingX = w / (columns + 1);
  const spacingY = h / (rows + 1);
  const radius = Math.min(spacingX, spacingY) / (N.THREE / 2);
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1);
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      if (row % 2 === 0) {
        strokeCircle(ctx, cx, cy - offset, radius);
      } else {
        strokeCircle(ctx, cx, cy + offset, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold - slim lines, rounded joins, static nodes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // Equals 2; gentle visibility.
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.75;

  const nodes = getTreeNodes(w, h, N);
  const paths = getTreePaths();

  paths.forEach(([fromIndex, toIndex]) => {
    const a = nodes[fromIndex];
    const b = nodes[toIndex];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  const nodeRadius = Math.min(w, h) / N.NINETYNINE; // 99 keeps nodes compact.

  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function getTreeNodes(w, h, N) {
  const centerX = w / 2;
  const pillar = w / N.THREE; // Pillars spaced by the triad constant.
  const inner = pillar / N.SEVEN; // 7 offers gentle offsets for middle pillar rungs.
  const topMargin = h / N.ELEVEN;
  const verticalStep = (h - topMargin * 2) / N.ONEFORTYFOUR; // 144 aligns to the master constant.

  return [
    { x: centerX, y: topMargin + verticalStep * 6 }, // Kether
    { x: centerX - pillar / 2, y: topMargin + verticalStep * 22 }, // Chokmah
    { x: centerX + pillar / 2, y: topMargin + verticalStep * 22 }, // Binah
    { x: centerX - pillar / 2, y: topMargin + verticalStep * 48 }, // Chesed
    { x: centerX + pillar / 2, y: topMargin + verticalStep * 48 }, // Geburah
    { x: centerX, y: topMargin + verticalStep * 66 }, // Tiphereth
    { x: centerX - pillar / 2 + inner, y: topMargin + verticalStep * 96 }, // Netzach
    { x: centerX + pillar / 2 - inner, y: topMargin + verticalStep * 96 }, // Hod
    { x: centerX, y: topMargin + verticalStep * 118 }, // Yesod
    { x: centerX, y: topMargin + verticalStep * 136 } // Malkuth
  ];
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4],
    [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8],
    [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 total paths honour the Hebrew letters.
}

// Layer 3: Fibonacci curve - static golden spiral polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85; // Higher alpha to read above the grid.

  const centerX = w / 2;
  const centerY = h / 2;
  const golden = (1 + Math.sqrt(5)) / 2;
  const turns = N.SEVEN; // Seven quarter turns keep the curve gentle.
  const segments = N.TWENTYTWO; // 22 samples echo the path count.
  const baseRadius = Math.min(w, h) / N.NINE;

  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const progress = i / segments;
    const angle = progress * turns * (Math.PI / 2);
    const radius = baseRadius * Math.pow(golden, progress);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push({ x, y });
  }

  drawPolyline(ctx, points);
  ctx.restore();
}

// Layer 4: Double-helix lattice - two static strands with calm cross ties.
function drawHelix(ctx, w, h, primaryColor, secondaryColor, N) {
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const marginX = w / N.NINE;
  const marginY = h / N.SEVEN;
  const heightSpan = h - marginY * 2;
  const centerX = w / 2;
  const amplitude = Math.min(w / N.THREE, marginX * (N.THREE / 2));
  const samples = N.ONEFORTYFOUR; // Dense sampling keeps the strands smooth.
  const rotations = N.THIRTYTHREE / N.ELEVEN; // Equals 3; stable triad of twists.

  const strandA = [];
  const strandB = [];

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const angle = t * rotations * Math.PI * 2;
    const y = marginY + heightSpan * t;
    const offset = Math.sin(angle) * amplitude;

    strandA.push({ x: centerX + offset, y });
    strandB.push({ x: centerX + Math.sin(angle + Math.PI) * amplitude, y });
  }

  ctx.strokeStyle = primaryColor;
  ctx.globalAlpha = 0.9;
  drawPolyline(ctx, strandA);

  ctx.strokeStyle = secondaryColor;
  ctx.globalAlpha = 0.9;
  drawPolyline(ctx, strandB);

  ctx.strokeStyle = secondaryColor;
  ctx.globalAlpha = 0.35; // Cross ties stay subtle to avoid visual noise.
  const rungStep = Math.floor(samples / N.TWENTYTWO);
  for (let i = 0; i <= samples; i += rungStep) {
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

function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPolyline(ctx, points) {
  if (!points.length) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    const point = points[i];
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
}
