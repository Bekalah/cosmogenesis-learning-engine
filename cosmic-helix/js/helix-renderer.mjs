/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Offline-first; no external dependencies.

  Layers:
    1) Vesica field (intersecting circle lenses)
    2) Tree-of-Life scaffold (10 sephirot linked by 22 paths)
    3) Fibonacci curve (log spiral polyline, drawn once)
    4) Double-helix lattice (two phase-shifted sine strands)

  Rationale:
    - No animation or flashing. Everything renders a single time.
    - Soft contrast palette supports ND-safe viewing.
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 guide proportions.
*/

const FALLBACK_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

export function renderHelix(ctx, opts) {
  if (!ctx || !opts) {
    return { ok: false, reason: "missing-context" };
  }

  const { width, height, palette = {}, NUM: N, notice } = opts;
  const resolvedPalette = {
    bg: palette.bg || FALLBACK_PALETTE.bg,
    ink: palette.ink || FALLBACK_PALETTE.ink,
    layers: Array.isArray(palette.layers) ? palette.layers : []
  };

  ctx.save();
  ctx.fillStyle = resolvedPalette.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  const layerColor = (index) => {
    return resolvedPalette.layers[index] || FALLBACK_PALETTE.layers[index];
  };

  drawVesicaField(ctx, width, height, layerColor(0), N);
  drawTreeOfLife(ctx, width, height, layerColor(1), layerColor(2), N);
  drawFibonacci(ctx, width, height, layerColor(3), N);
  drawHelix(ctx, width, height, layerColor(4), layerColor(5), resolvedPalette.ink, N);

  if (notice) {
    drawNotice(ctx, notice, resolvedPalette.ink, width, height);
  }

  return { ok: true };
}

// Layer 1: Vesica field builds a calm lens grid using 3, 7, 9, and 11 counts.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // Gentle transparency keeps the grid calm.

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const radius = Math.min(w, h) / (N.THREE * 2.2);
  const horizontalStep = radius * (N.SEVEN / N.NINE);
  const verticalStep = radius * (N.NINE / N.ELEVEN);
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const y = h / 2 + (row - (rows - 1) / 2) * verticalStep;
    for (let col = 0; col < columns; col += 1) {
      const xCenter = w / 2 + (col - (columns - 1) / 2) * horizontalStep;
      strokeCircle(ctx, xCenter - offset, y, radius);
      strokeCircle(ctx, xCenter + offset, y, radius);

      if (row < rows - 1 && (col + row) % 2 === 0) {
        const lensY = y + verticalStep / 2;
        strokeCircle(ctx, xCenter, lensY, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life nodes and paths; gentle strokes avoid harsh edges.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  const nodes = buildTreeNodes(w, h, N);
  const paths = buildTreePaths();

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // Equals 2, echoing the 22 paths over 11 pillars idea.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = 0; i < paths.length; i += 1) {
    const path = paths[i];
    const start = nodes[path[0]];
    const end = nodes[path[1]];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / N.THREE; // Equals 3 for compact discs.
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function buildTreeNodes(w, h, N) {
  const centerX = w / 2;
  const horizontalOffset = w / N.THREE; // 3 pillars form the scaffold.
  const leftX = centerX - horizontalOffset;
  const rightX = centerX + horizontalOffset;
  const top = h / N.THIRTYTHREE * 2; // Keeps breathing room above the crown.
  const step = h / N.SEVEN; // Seven intervals echo the lower sephirot tiers.

  return [
    { x: centerX, y: top },
    { x: leftX, y: top + step },
    { x: rightX, y: top + step },
    { x: leftX, y: top + step * 2 },
    { x: rightX, y: top + step * 2 },
    { x: centerX, y: top + step * 3 },
    { x: leftX, y: top + step * 4 },
    { x: rightX, y: top + step * 4 },
    { x: centerX, y: top + step * 5 },
    { x: centerX, y: top + step * 6 }
  ];
}

function buildTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ];
}

// Layer 3: Fibonacci curve draws a single calm spiral using 99 samples.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.TWENTYTWO / N.THIRTYTHREE; // Soft stroke < 1 to keep the spiral subtle.
  ctx.globalAlpha = 0.85;

  const centerX = w / 2;
  const centerY = h / 2;
  const steps = N.NINETYNINE;
  const rotations = N.SEVEN / N.THREE; // Two and one-third turns keep the spiral present but not overwhelming.
  const thetaMax = Math.PI * 2 * rotations;
  const startRadius = Math.min(w, h) / N.NINETYNINE;
  const endRadius = Math.min(w, h) / N.THREE;
  const growth = Math.log(endRadius / startRadius) / thetaMax;

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const theta = thetaMax * (i / steps);
    const radius = startRadius * Math.exp(growth * theta);
    const x = centerX + Math.cos(theta) * radius;
    const y = centerY + Math.sin(theta) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.restore();
}

// Layer 4: Double-helix lattice draws two strands and rungs with 144 samples.
function drawHelix(ctx, w, h, primaryColor, secondaryColor, accentColor, N) {
  ctx.save();

  const steps = N.ONEFORTYFOUR;
  const left = w / N.THIRTYTHREE * 2;
  const right = w - left;
  const width = right - left;
  const baseY = h / 2;
  const amplitude = h / N.NINE; // Keeps waves gentle.
  const cycles = N.THREE; // Three coils symbolise balance without motion.

  const strandA = buildHelixPoints(steps, left, width, baseY, amplitude, cycles, 0);
  const strandB = buildHelixPoints(steps, left, width, baseY, amplitude, cycles, Math.PI);

  drawHelixStrand(ctx, strandA, primaryColor, N);
  drawHelixStrand(ctx, strandB, secondaryColor, N);
  drawHelixRungs(ctx, strandA, strandB, accentColor, N);

  ctx.restore();
}

function buildHelixPoints(steps, left, width, baseY, amplitude, cycles, phase) {
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = left + width * t;
    const angle = cycles * Math.PI * 2 * t + phase;
    const y = baseY + Math.sin(angle) * amplitude;
    points.push({ x, y });
  }
  return points;
}

function drawHelixStrand(ctx, points, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.TWENTYTWO / N.NINETYNINE; // Thin, calm line weight.
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  for (let i = 0; i < points.length; i += 1) {
    const point = points[i];
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function drawHelixRungs(ctx, strandA, strandB, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.ELEVEN / N.NINETYNINE; // Even lighter than strands for a soft lattice.
  ctx.globalAlpha = 0.6;

  const spacing = Math.max(1, Math.floor(strandA.length / N.THIRTYTHREE));
  for (let i = 0; i < strandA.length; i += spacing) {
    const a = strandA[i];
    const b = strandB[i];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNotice(ctx, text, color, width, height) {
  ctx.save();
  ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  ctx.fillText(text, 24, height - 24);
  ctx.restore();
}

function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}
