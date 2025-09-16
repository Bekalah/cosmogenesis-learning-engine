/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Offline-first; no external dependencies; renders once on load.

  Layers (draw order = depth order):
    1) Vesica field (intersecting circle lattice)
    2) Tree-of-Life scaffold (10 sephirot linked by 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted sine strands with rungs)

  Each helper is a small pure function so maintainers can trace symbolism.
*/

export function renderHelix(ctx, opts) {
  if (!ctx) {
    return { ok: false, reason: "missing-context" };
  }

  const { width, height, palette, NUM: N, notice } = opts;
  const bg = palette.bg || "#0b0b12";
  const fallback = palette.ink || "#e8e8f0";
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  const colorFor = (index) => layers[index] || fallback;

  ctx.save();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order follows the requested geometry pipeline (base to foreground).
  drawVesicaField(ctx, width, height, colorFor(0), N);
  drawTreeOfLife(ctx, width, height, colorFor(1), colorFor(2), N);
  drawFibonacci(ctx, width, height, colorFor(3), N);
  drawHelix(ctx, width, height, colorFor(4), colorFor(5), N);

  if (notice) {
    ctx.save();
    ctx.font = "14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
    ctx.fillStyle = fallback;
    ctx.globalAlpha = 0.8;
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }

  ctx.restore();
  return { ok: true };
}

// Layer 1: Vesica field - calm lattice of overlapping circles (no motion).
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // Soft transparency keeps the grid gentle for ND viewers.

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 1);
  const spacingY = h / (rows + 1);
  const radius = Math.min(spacingX, spacingY) / (N.THREE / 1.5);
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1);
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      // Every other column adds a vertical lens to keep the grid layered without clutter.
      if (row < rows - 1 && col % 2 === 0) {
        const nextCy = spacingY * (row + 2);
        const midY = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, midY, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold - thin lines + calm nodes, respects ND contrast.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // Uses 22 paths softened by pillar 11.
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
  const nodeRadius = N.NINE; // Node size tied to the calming nine principle.
  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Layer 3: Fibonacci curve - single log spiral, drawn once, no shimmer.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;

  const phi = (1 + Math.sqrt(5)) / 2;
  const centerX = w * 0.38; // Slight left bias keeps spiral in dialogue with the helix.
  const centerY = h * 0.58;
  const totalAngle = (Math.PI / 2) * N.SEVEN; // Seven quarter turns anchor the requested numerology.
  const samples = N.ONEFORTYFOUR; // High sample count keeps the curve smooth without animation.
  const startRadius = Math.min(w, h) / (N.THREE * phi);

  ctx.beginPath();
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const angle = t * totalAngle;
    const radius = startRadius * Math.pow(phi, angle / (Math.PI / 2));
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

// Layer 4: Double-helix lattice - static sine strands (no motion) with gentle rungs.
function drawHelix(ctx, w, h, colorA, colorB, N) {
  ctx.save();
  const centerY = h / 2;
  const amplitude = h / N.SEVEN; // Amplitude tuned by 7 to keep waves calm.
  const cycles = N.THREE; // Three rotations across the canvas.
  const steps = N.ONEFORTYFOUR;

  drawHelixStrand(ctx, w, centerY, amplitude, cycles, steps, colorA, 0);
  drawHelixStrand(ctx, w, centerY, amplitude, cycles, steps, colorB, Math.PI);

  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = colorB;
  ctx.lineWidth = 1.5;
  const rungCount = N.TWENTYTWO; // Twenty-two rungs echo the tree paths.
  for (let i = 0; i <= rungCount; i += 1) {
    const t = i / rungCount;
    const angle = t * cycles * Math.PI * 2;
    const x = t * w;
    const y1 = centerY + amplitude * Math.sin(angle);
    const y2 = centerY + amplitude * Math.sin(angle + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawHelixStrand(ctx, w, centerY, amplitude, cycles, steps, color, phase) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.75;

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = t * cycles * Math.PI * 2 + phase;
    const x = t * w;
    const y = centerY + amplitude * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.restore();
}

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function getTreeNodes(w, h) {
  // Layout balances 3 pillars while keeping nodes legible at 1440x900.
  return [
    { x: w / 2, y: h * 0.06 },
    { x: w * 0.32, y: h * 0.16 },
    { x: w * 0.68, y: h * 0.16 },
    { x: w * 0.28, y: h * 0.36 },
    { x: w * 0.72, y: h * 0.36 },
    { x: w / 2, y: h * 0.48 },
    { x: w * 0.28, y: h * 0.66 },
    { x: w * 0.72, y: h * 0.66 },
    { x: w / 2, y: h * 0.78 },
    { x: w / 2, y: h * 0.92 }
  ];
}

function getTreePaths() {
  // Exactly 22 connections, matching the requested numerology.
  return [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ];
}
