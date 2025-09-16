/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Offline-first; no external dependencies.

  Layers:
    1) Vesica field (intersecting circle lattice)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (golden spiral polyline)
    4) Double-helix lattice (two phase-shifted strands)

  Rationale:
    - No motion or flashing; everything renders once.
    - Muted palette maintains gentle contrast.
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 guide proportions.
*/

export function renderHelix(ctx, opts) {
  if (!ctx) return { ok: false, reason: "missing-context" };

  const { width, height, palette, NUM: N, notice } = opts;
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  const fallback = palette.ink || "#ffffff";

  ctx.save();
  ctx.fillStyle = palette.bg || "#0b0b12";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Layer order from background to foreground keeps depth legible without motion.
  drawVesicaField(ctx, width, height, pickLayer(layers, fallback, 0), N);
  drawTreeOfLife(ctx, width, height, pickLayer(layers, fallback, 1), pickLayer(layers, fallback, 2), N);
  drawFibonacci(ctx, width, height, pickLayer(layers, fallback, 3), N);
  drawHelix(ctx, width, height, pickLayer(layers, fallback, 4), pickLayer(layers, fallback, 5), N);

  if (notice) {
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = fallback;
    ctx.globalAlpha = 0.7;
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }

  return { ok: true };
}

function pickLayer(layers, fallback, index) {
  return layers[index] || fallback;
}

// Layer 1: Vesica field - static circle grid softened by numerology spacing.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // gentle transparency keeps the grid calm.

  const margin = Math.min(w, h) / N.THREE;
  const columns = N.ELEVEN; // honours the 11 pillar motif.
  const rows = N.NINE; // nine rows echo the spiral cadence.
  const usableWidth = w - margin * 2;
  const usableHeight = h - margin * 2;
  const spacingX = usableWidth / (columns - 1);
  const spacingY = usableHeight / (rows - 1);
  const radius = Math.min(spacingX, spacingY) / (N.THREE / (N.SEVEN / N.NINE));
  const horizontalShift = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = margin + col * spacingX;
      const cy = margin + row * spacingY;
      strokeCircle(ctx, cx - horizontalShift, cy, radius);
      strokeCircle(ctx, cx + horizontalShift, cy, radius);

      // Every third row draws a vertical lens to preserve layered depth without motion.
      if (row < rows - 1 && row % N.THREE === 0) {
        const cyNext = margin + (row + 1) * spacingY;
        const lensCy = (cy + cyNext) / 2;
        strokeCircle(ctx, cx, lensCy, radius * 0.85);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life nodes and paths; gentle strokes avoid harsh edges.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // equals 2, nodding to the 22 paths and 11 pillars.
  ctx.lineCap = "round";

  const nodes = getTreeNodes(w, h, N);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    const from = nodes[a];
    const to = nodes[b];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for calm readability.

  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Small labels stay optional yet readable; muted alpha keeps them subtle.
    ctx.save();
    ctx.font = "11px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = nodeColor;
    ctx.globalAlpha = 0.7;
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y - nodeRadius - 6);
    ctx.restore();
  });

  ctx.restore();
}

function getTreeNodes(w, h, N) {
  const centerX = w / 2;
  const pillarOffset = w / N.THREE / 1.5;
  const deepOffset = pillarOffset * 0.75;
  const topMargin = h / N.TWENTYTWO * 3;
  const bottomMargin = h - h / N.TWENTYTWO * 3;
  const rows = N.SEVEN; // seven vertical tiers anchor the sephirot.
  const stepY = (bottomMargin - topMargin) / (rows - 1);

  return [
    { x: centerX, y: topMargin, label: "Kether" },
    { x: centerX - pillarOffset, y: topMargin + stepY, label: "Chokmah" },
    { x: centerX + pillarOffset, y: topMargin + stepY, label: "Binah" },
    { x: centerX - deepOffset, y: topMargin + stepY * 2, label: "Chesed" },
    { x: centerX + deepOffset, y: topMargin + stepY * 2, label: "Geburah" },
    { x: centerX, y: topMargin + stepY * 3, label: "Tiphereth" },
    { x: centerX - pillarOffset, y: topMargin + stepY * 4, label: "Netzach" },
    { x: centerX + pillarOffset, y: topMargin + stepY * 4, label: "Hod" },
    { x: centerX, y: topMargin + stepY * 5.2, label: "Yesod" },
    { x: centerX, y: topMargin + stepY * 6.2, label: "Malkuth" }
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
  ]; // 22 total paths.
}

// Layer 3: Fibonacci curve - static golden spiral polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.85;

  const centerX = w / 2;
  const centerY = h / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = N.SEVEN / N.THREE; // roughly 2.33 turns keeps the spiral gentle.
  const segments = N.ONEFORTYFOUR; // dense sampling keeps the line smooth.
  const startRadius = Math.min(w, h) / N.THIRTYTHREE;
  const maxRadius = Math.min(w, h) / N.THREE;

  ctx.beginPath();
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const angle = t * turns * Math.PI * 2;
    const growth = Math.pow(phi, t * (N.ELEVEN / N.SEVEN));
    const radius = clamp(startRadius * growth, startRadius, maxRadius);
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

// Layer 4: Double-helix lattice - two sine strands with calm cross ties.
function drawHelix(ctx, w, h, strandColor, rungColor, N) {
  ctx.save();
  const marginX = w / N.ELEVEN;
  const usableWidth = w - marginX * 2;
  const centerY = h / 2;
  const amplitude = h / N.THREE / 1.5; // keeps motion subtle while hinting at depth.
  const steps = N.ONEFORTYFOUR;
  const frequency = N.THIRTYTHREE / N.ELEVEN; // three gentle waves across the width.
  const phaseShift = Math.PI;
  const rungInterval = Math.floor(steps / N.TWENTYTWO);

  const strandA = [];
  const strandB = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = marginX + t * usableWidth;
    const angle = t * frequency * Math.PI * 2 / N.THREE;
    strandA.push({ x, y: centerY + Math.sin(angle) * amplitude });
    strandB.push({ x, y: centerY + Math.sin(angle + phaseShift) * amplitude });
  }

  // Draw strands.
  ctx.strokeStyle = strandColor;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  drawPolyline(ctx, strandA);
  drawPolyline(ctx, strandB);

  // Draw rungs for lattice stability.
  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < strandA.length; i += rungInterval) {
    const a = strandA[i];
    const b = strandB[i];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

// Helper: draw circle stroke.
function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Helper: draw polyline from points.
function drawPolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  points.forEach((pt, index) => {
    if (index === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  });
  ctx.stroke();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
