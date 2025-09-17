/*
  helix-renderer.mjs
  Static, ND-safe renderer for layered sacred geometry bound to Codex 144:99 (c99).
  Everything renders once on load; no motion, no autoplay, no external state.

  Layer order (background to foreground):
    1) Vesica field — intersecting circles with numerology spacing for calm depth.
    2) Tree-of-Life scaffold — ten sephirot linked by twenty-two paths.
    3) Fibonacci curve — golden spiral polyline sampled across 144 points.
    4) Double-helix lattice — two static strands with gentle cross ties.
*/

export function renderHelix(ctx, options) {
  if (!ctx) return { ok: false, reason: "missing-context" };

  const { width, height, palette, NUM, notice } = options;
  const safePalette = normalisePalette(palette);

  ctx.save();
  fillBackground(ctx, width, height, safePalette.bg);

  // Layered order preserves depth without animation; comments explain why for future caretakers.
  drawVesicaField(ctx, width, height, safePalette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, safePalette.layers[1], safePalette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, safePalette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, safePalette.layers[4], safePalette.layers[5], NUM);

  if (notice) drawNotice(ctx, width, height, safePalette.ink, notice);

  ctx.restore();
  return { ok: true };
}

function normalisePalette(palette) {
  const fallback = {
    bg: "#0b0b12",
    ink: "#e8e8f0",
    muted: "#a6a6c1",
    layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
  };

  const source = palette || {};
  const safeLayers = fallback.layers.map((color, index) => {
    if (source.layers && source.layers[index]) return source.layers[index];
    return color;
  });

  return {
    bg: source.bg || fallback.bg,
    ink: source.ink || fallback.ink,
    muted: source.muted || fallback.muted,
    layers: safeLayers
  };
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Layer 1: Vesica field — calm lattice built from overlapping circles.
function drawVesicaField(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // Soft transparency keeps the grid gentle for ND-safe viewing.

  const columns = N.ELEVEN; // 11 columns honour the sephirotic pillars.
  const rows = N.NINE; // 9 rows echo the spiral layer.
  const paddingX = width / N.THIRTYTHREE;
  const paddingY = height / N.TWENTYTWO;
  const spanX = width - paddingX * 2;
  const spanY = height - paddingY * 2;
  const spacingX = spanX / (columns - 1);
  const spacingY = spanY / (rows - 1);
  const radius = Math.min(spacingX, spacingY) / (1 + 1 / N.THREE);
  const offset = radius / N.THREE; // 3 divides the vesica lens.

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = paddingX + col * spacingX;
      const cy = paddingY + row * spacingY;
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      // Every third row adds a vertical lens to deepen the geometry without motion.
      if (row < rows - 1 && col % N.THREE === 0) {
        const nextCy = paddingY + (row + 1) * spacingY;
        const midCy = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, midCy, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life — slim paths and calm nodes keep focus without harsh edges.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 22 paths softened by pillar 11.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const nodes = getTreeNodes(width, height);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    const start = nodes[a];
    const end = nodes[b];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  ctx.globalAlpha = 0.95;
  const nodeRadius = Math.min(width, height) / (N.THIRTYTHREE + N.NINE); // 33+9 = 42 keeps discs modest.

  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function getTreeNodes(width, height) {
  // Ratios preserve the classic sephirotic arrangement while scaling to the canvas.
  const anchors = [
    { x: 0.5, y: 0.06 },  // Kether
    { x: 0.28, y: 0.16 }, // Chokmah
    { x: 0.72, y: 0.16 }, // Binah
    { x: 0.28, y: 0.36 }, // Chesed
    { x: 0.72, y: 0.36 }, // Geburah
    { x: 0.5, y: 0.48 },  // Tiphereth
    { x: 0.32, y: 0.66 }, // Netzach
    { x: 0.68, y: 0.66 }, // Hod
    { x: 0.5, y: 0.78 },  // Yesod
    { x: 0.5, y: 0.92 }   // Malkuth
  ];

  return anchors.map(point => ({
    x: point.x * width,
    y: point.y * height
  }));
}

function getTreePaths() {
  // 22 paths: classic arrangement linking the ten nodes.
  return [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 3], [2, 4],
    [3, 4], [3, 5], [4, 5], [1, 5], [2, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ];
}

// Layer 3: Fibonacci curve — golden spiral drawn as a calm polyline.
function drawFibonacciCurve(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const center = { x: width / 2, y: height / 2 };
  const points = buildSpiralPoints(center, Math.min(width, height), N);
  drawPolyline(ctx, points);

  ctx.restore();
}

function buildSpiralPoints(center, span, N) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = N.SEVEN / N.THREE; // ~2.33 turns keep the spiral calm yet present.
  const steps = N.ONEFORTYFOUR; // 144 samples for smoothness tied to Codex 144:99.
  const startRadius = span / (N.SEVEN + N.NINE); // 16 slices cradle the opening arc.
  const growth = Math.pow(phi, N.ELEVEN / N.NINE); // 11 and 9 pace the outward bloom.
  const points = [];

  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1);
    const angle = -Math.PI / 2 + turns * 2 * Math.PI * t;
    const radius = startRadius * Math.pow(growth, t);
    points.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    });
  }

  return points;
}

function drawPolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    const point = points[i];
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice — two steady strands with measured cross ties.
function drawHelixLattice(ctx, width, height, strandColor, rungColor, N) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const left = width / N.ELEVEN;
  const right = width - left;
  const steps = N.ONEFORTYFOUR; // 144 sample points across the lattice.
  const amplitude = height / N.SEVEN; // Calm wave height from the number 7.
  const frequency = N.THIRTYTHREE / N.ELEVEN; // 33/11 = 3 full waves across the span.
  const phaseShift = Math.PI / N.THREE; // Staggered strands honour the vesica triad.
  const baseline = height / 2;
  const strandA = [];
  const strandB = [];

  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1);
    const x = left + (right - left) * t;
    const angle = frequency * 2 * Math.PI * t;
    const yA = baseline + Math.sin(angle) * amplitude;
    const yB = baseline + Math.sin(angle + phaseShift) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.strokeStyle = strandColor;
  ctx.lineWidth = 2;
  drawPolyline(ctx, strandA);
  drawPolyline(ctx, strandB);

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.5;

  const rungEvery = Math.max(2, Math.floor(steps / N.THIRTYTHREE)); // 33 ties across the width.
  for (let i = 0; i < steps; i += rungEvery) {
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

function drawNotice(ctx, width, height, color, text) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(text, 24, height - 32);
  ctx.restore();
}
