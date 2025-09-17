/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Offline-first; no external dependencies.

  Layers (rendered back to front):
    1) Vesica field - intersecting circle lenses keep the womb-of-forms visible.
    2) Tree-of-Life scaffold - ten sephirot joined by twenty-two calm paths.
    3) Fibonacci curve - logarithmic spiral polyline tuned to gentle growth.
    4) Double-helix lattice - two static strands with soft cross ties.

  ND-safe rationale:
    - No motion or flashing; everything draws once per load.
    - Muted palette keeps contrast gentle for neurodivergent viewers.
    - Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) steer proportions.
*/

const FALLBACK_LAYERS = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];

export function renderHelix(ctx, opts) {
  if (!ctx) {
    return { ok: false, reason: "missing-context" };
  }

  const { width, height, palette, NUM: N, notice } = opts;
  const cleaned = normalisePalette(palette);

  ctx.save();
  ctx.fillStyle = cleaned.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Layer order from background to foreground keeps depth legible without motion.
  drawVesicaField(ctx, width, height, cleaned.layers[0], N);
  drawTreeOfLife(ctx, width, height, cleaned.layers[1], cleaned.layers[2], N);
  drawFibonacci(ctx, width, height, cleaned.layers[3], N);
  drawHelix(ctx, width, height, cleaned.layers[4], cleaned.layers[5], N);

  if (notice) {
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = cleaned.notice;
    ctx.textBaseline = "bottom";
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }

  return { ok: true };
}

function normalisePalette(palette) {
  const input = palette || {};
  const layers = Array.isArray(input.layers) ? input.layers : [];
  return {
    bg: input.bg || "#0b0b12",
    notice: input.ink || "#e8e8f0",
    layers: FALLBACK_LAYERS.map((fallbackColor, index) => layers[index] || fallbackColor)
  };
}

// Layer 1: Vesica field builds a calm lens grid using 3/7/9/11 counts.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // gentle transparency keeps the grid quiet.

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 2);
  const spacingY = h / (rows + 2);
  const baseRadius = Math.min(spacingX, spacingY) / (N.THREE / 2);
  const offset = baseRadius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1.5);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1.5);
      strokeCircle(ctx, cx - offset, cy, baseRadius);
      strokeCircle(ctx, cx + offset, cy, baseRadius);

      if ((row + col) % N.THREE === 0 && row < rows - 1) {
        const nextCy = spacingY * (row + 2.5);
        strokeCircle(ctx, cx, (cy + nextCy) / 2, baseRadius * (N.SEVEN / N.NINE));
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life nodes and paths; gentle strokes avoid harsh edges.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // equals 2 for soft yet readable lines.
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;

  const nodes = getTreeNodes(w, h);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3;
  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function getTreeNodes(w, h) {
  const verticalOffset = h * 0.05;
  return [
    { x: w / 2, y: verticalOffset + h * 0.00 },
    { x: w * 0.28, y: verticalOffset + h * 0.12 },
    { x: w * 0.72, y: verticalOffset + h * 0.12 },
    { x: w * 0.28, y: verticalOffset + h * 0.32 },
    { x: w * 0.72, y: verticalOffset + h * 0.32 },
    { x: w / 2, y: verticalOffset + h * 0.44 },
    { x: w * 0.28, y: verticalOffset + h * 0.64 },
    { x: w * 0.72, y: verticalOffset + h * 0.64 },
    { x: w / 2, y: verticalOffset + h * 0.76 },
    { x: w / 2, y: verticalOffset + h * 0.92 }
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
    [5, 8], [6, 9], [7, 9],
    [8, 9]
  ];
}

// Layer 3: Fibonacci curve - golden spiral polyline anchored at centre.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;

  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = N.ONEFORTYFOUR;
  const turns = N.SEVEN; // seven quarter-turns keeps the spiral gentle.
  const totalAngle = (Math.PI / 2) * turns;
  const baseRadius = Math.min(w, h) / N.THREE;
  const centerX = w * 0.44;
  const centerY = h * 0.58;

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = t * totalAngle;
    const radius = (baseRadius / N.ELEVEN) * Math.pow(phi, angle / (Math.PI / 2));
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.restore();
}

// Layer 4: Double-helix lattice - two strands plus calm cross ties.
function drawHelix(ctx, w, h, strandColor, rungColor, N) {
  ctx.save();
  const centerY = h * 0.55;
  const amplitude = h / N.NINETYNINE * N.ELEVEN;
  const cycles = N.THREE; // three full twists keeps rhythm steady.
  const steps = N.ONEFORTYFOUR;

  const strandA = [];
  const strandB = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = t * w;
    const angle = t * cycles * Math.PI * 2;
    const yA = centerY + Math.sin(angle) * amplitude;
    const yB = centerY + Math.sin(angle + Math.PI) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  drawPolyline(ctx, strandA, strandColor, 2);
  drawPolyline(ctx, strandB, strandColor, 2);

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6;
  const rungCount = N.TWENTYTWO;
  for (let i = 0; i <= rungCount; i += 1) {
    const index = Math.floor((i / rungCount) * steps);
    const a = strandA[index];
    const b = strandB[index];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPolyline(ctx, points, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.restore();
}

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}
