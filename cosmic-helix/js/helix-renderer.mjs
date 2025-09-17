/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles that form calm lenses)
    2) Tree-of-Life scaffold (10 sephirot joined by 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two still strands with cross ties)

  Rationale:
    - No motion or flashing; everything renders once to honour ND-safe policy.
    - Muted palette keeps contrast gentle while preserving readability.
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 guide spacing choices.
*/

export function renderHelix(ctx, opts) {
  if (!ctx) return { ok: false, reason: "missing-context" };

  const { width, height, palette, NUM: N, notice } = opts;
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  const fallbackColor = palette.ink || "#ffffff";
  const colorFor = (index) => layers[index] || fallbackColor;

  ctx.save();
  ctx.fillStyle = palette.bg || "#0b0b12";
  ctx.fillRect(0, 0, width, height);

  // Layer order stays consistent so depth reads without any animation.
  drawVesicaField(ctx, width, height, colorFor(0), N);
  drawTreeOfLife(ctx, width, height, colorFor(1), colorFor(2), N);
  drawFibonacci(ctx, width, height, colorFor(3), N);
  drawHelix(ctx, width, height, colorFor(4), colorFor(5), N);

  if (notice) {
    ctx.save();
    ctx.fillStyle = fallbackColor;
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }

  ctx.restore();
  return { ok: true };
}

// Layer 1: Vesica field — static circle grid softened by numerology spacing.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // Calm transparency keeps grid from overwhelming.

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 1);
  const spacingY = h / (rows + 1);
  const radius = Math.min(spacingX, spacingY) / 1.6;
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1);
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      // Every other column adds a vertical lens to hint at layered geometry without motion.
      if (row < rows - 1 && col % 2 === 0) {
        const nextCy = spacingY * (row + 2);
        const midCy = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, midCy, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life — slim paths connect ten calm nodes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // equals 2; soft but readable.
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.8;

  const nodes = getTreeNodes(w, h);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // equals 3; small discs avoid harsh dominance.
  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function getTreeNodes(w, h) {
  const top = h * 0.08;
  const verticalStep = (h * 0.82) / 9; // Leaves margins while centring the structure.
  const centerX = w / 2;
  const leftX = w * 0.28;
  const rightX = w * 0.72;

  return [
    { x: centerX, y: top },
    { x: leftX, y: top + verticalStep },
    { x: rightX, y: top + verticalStep },
    { x: leftX, y: top + verticalStep * 3 },
    { x: rightX, y: top + verticalStep * 3 },
    { x: centerX, y: top + verticalStep * 4 },
    { x: leftX, y: top + verticalStep * 6 },
    { x: rightX, y: top + verticalStep * 6 },
    { x: centerX, y: top + verticalStep * 7 },
    { x: centerX, y: top + verticalStep * 9 }
  ];
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4],
    [3, 5], [4, 5],
    [3, 6], [4, 7],
    [5, 6], [5, 7],
    [6, 7],
    [6, 8], [7, 8], [5, 8],
    [6, 9], [7, 9], [8, 9]
  ];
}

// Layer 3: Fibonacci curve — golden spiral computed once.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;

  const cx = w / 2;
  const cy = h / 2;
  const baseRadius = Math.min(w, h) / (N.THREE + N.SEVEN / N.NINE);
  const points = buildFibonacciPolyline(cx, cy, baseRadius, N);

  if (points.length > 1) {
    ctx.beginPath();
    points.forEach((pt, index) => {
      if (index === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
  }

  ctx.restore();
}

function buildFibonacciPolyline(cx, cy, baseRadius, N) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const quarterTurns = N.SEVEN; // seven quarter turns echo the heptad.
  const totalAngle = quarterTurns * (Math.PI / 2);
  const steps = N.ONEFORTYFOUR; // dense sampling keeps the curve smooth without animation.
  const points = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = t * totalAngle;
    const growth = Math.pow(phi, angle / (Math.PI / 2));
    const radius = baseRadius * growth;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    });
  }

  return points;
}

// Layer 4: Double-helix lattice — two still strands plus gentle cross ties.
function drawHelix(ctx, w, h, strandColorA, strandColorB, N) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.85;

  const marginY = h / N.NINE;
  const usableHeight = h - marginY * 2;
  const centerX = w / 2;
  const amplitude = Math.min(w, h) / N.ELEVEN;
  const samples = N.ONEFORTYFOUR;
  const totalPhase = Math.PI * (N.THIRTYTHREE / N.ELEVEN); // equals 3π; triadic wave count.

  const strandA = [];
  const strandB = [];

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const angle = t * totalPhase;
    const y = marginY + t * usableHeight;
    strandA.push({ x: centerX + amplitude * Math.sin(angle), y });
    strandB.push({ x: centerX + amplitude * Math.sin(angle + Math.PI), y });
  }

  drawHelixStrand(ctx, strandA, strandColorA);
  drawHelixStrand(ctx, strandB, strandColorB);
  drawHelixRungs(ctx, strandA, strandB, strandColorA, strandColorB, N);

  ctx.restore();
}

function drawHelixStrand(ctx, points, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  points.forEach((pt, index) => {
    if (index === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();
  ctx.restore();
}

function drawHelixRungs(ctx, strandA, strandB, colorA, colorB, N) {
  const rungCount = N.TWENTYTWO; // echoes the 22 paths of the Tree.
  const step = Math.floor(strandA.length / rungCount);
  ctx.save();
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6;

  for (let i = 0; i < strandA.length; i += step) {
    const a = strandA[i];
    const b = strandB[i];
    if (!a || !b) continue;
    ctx.strokeStyle = i % (step * 2) === 0 ? colorA : colorB;
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
