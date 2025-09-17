/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers render once on load:
    1) Vesica field (intersecting circle lattice)
    2) Tree-of-Life scaffold (ten nodes, twenty-two paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two still strands with gentle cross ties)

  Design contract:
    - No animation or flashing. Everything is synchronous and static.
    - Muted palette keeps contrast calm for ND-safe viewing.
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 guide proportions.
    - Pure functions keep the module easy to audit and extend offline.
*/

export function renderHelix(ctx, opts) {
  if (!ctx) {
    return { ok: false, reason: "missing-context" };
  }

  const { width, height, palette, NUM: N, notice } = opts;
  const fallbackLayers = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];
  const paletteLayers = Array.isArray(palette?.layers) ? palette.layers : fallbackLayers;
  const layerColor = (index) => paletteLayers[index] || fallbackLayers[index];
  const ink = palette?.ink || "#e8e8f0";
  const background = palette?.bg || "#0b0b12";

  ctx.save();
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  drawVesicaField(ctx, width, height, layerColor(0), N);
  drawTreeOfLife(ctx, width, height, layerColor(1), layerColor(2), ink, N);
  drawFibonacci(ctx, width, height, layerColor(3), N);
  drawHelix(ctx, width, height, layerColor(4), layerColor(5), N);

  if (notice) {
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, 'Segoe UI', sans-serif";
    ctx.fillStyle = ink;
    ctx.textBaseline = "bottom";
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }

  return { ok: true };
}

// Layer 1: Vesica field — intersecting circles with gentle transparency.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // transparency keeps the grid calm.

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 1);
  const spacingY = h / (rows + 1);
  const radius = Math.min(spacingX, spacingY) / (N.THREE - N.SEVEN / N.NINE);
  const offset = radius / (N.THREE / N.SEVEN);

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1);
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      if (row < rows - 1 && col % 2 === 0) {
        const cyNext = spacingY * (row + 2);
        const lensCenter = (cy + cyNext) / 2;
        strokeCircle(ctx, cx, lensCenter, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold — thin paths and calm nodes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, ink, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // equals 2, gentle but readable.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.6;

  const nodes = getTreeNodes(w, h);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    const start = nodes[a];
    const end = nodes[b];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  const nodeRadius = Math.min(w, h) / (N.NINETYNINE);

  nodes.forEach((node, index) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    if (index === 0 || index === nodes.length - 1) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });

  ctx.restore();
}

function getTreeNodes(w, h) {
  const verticalPadding = h / 12;
  const heightRange = h - verticalPadding * 2;
  const widthRange = w * 0.5;
  const centerX = w / 2;

  const ratios = [
    0.02,
    0.15,
    0.28,
    0.40,
    0.52,
    0.64,
    0.76,
    0.88
  ];

  return [
    { x: centerX, y: verticalPadding + heightRange * ratios[0] },
    { x: centerX - widthRange * 0.3, y: verticalPadding + heightRange * ratios[1] },
    { x: centerX + widthRange * 0.3, y: verticalPadding + heightRange * ratios[1] },
    { x: centerX, y: verticalPadding + heightRange * ratios[2] },
    { x: centerX - widthRange * 0.48, y: verticalPadding + heightRange * ratios[3] },
    { x: centerX, y: verticalPadding + heightRange * ratios[3] },
    { x: centerX + widthRange * 0.48, y: verticalPadding + heightRange * ratios[3] },
    { x: centerX - widthRange * 0.3, y: verticalPadding + heightRange * ratios[5] },
    { x: centerX + widthRange * 0.3, y: verticalPadding + heightRange * ratios[5] },
    { x: centerX, y: verticalPadding + heightRange * ratios[7] }
  ];
}

function getTreePaths() {
  return [
    [0, 1], [0, 2],
    [1, 3], [2, 3],
    [3, 4], [3, 5], [3, 6],
    [4, 5], [5, 6],
    [4, 7], [5, 7], [5, 8], [6, 8],
    [7, 8],
    [7, 9], [8, 9],
    [1, 4], [2, 6],
    [1, 5], [2, 5],
    [4, 9], [6, 9]
  ];
}

// Layer 3: Fibonacci curve — golden spiral rendered as a single calm polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.75;

  const centerX = w / 2;
  const centerY = h / 2;
  const scale = Math.min(w, h) / N.THREE;
  const phi = (1 + Math.sqrt(5)) / 2;
  const k = Math.log(phi) / (Math.PI / 2);
  const turns = N.THIRTYTHREE / N.ELEVEN; // three turns keeps the spiral legible.
  const steps = N.ONEFORTYFOUR;

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * (Math.PI * 2 * turns / N.THREE * N.SEVEN / N.NINE);
    const radius = scale * Math.exp(k * angle);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

// Layer 4: Double-helix lattice — two sine-based strands plus cross ties.
function drawHelix(ctx, w, h, strandColor, bridgeColor, N) {
  ctx.save();
  const centerY = h / 2;
  const amplitude = h / (N.NINE + N.THREE / N.SEVEN);
  const steps = N.ONEFORTYFOUR;
  const turns = N.THIRTYTHREE / N.ELEVEN; // three cycles across the width.
  const omega = (Math.PI * 2 * turns) / w;

  const strandA = [];
  const strandB = [];

  for (let i = 0; i <= steps; i += 1) {
    const x = (w / steps) * i;
    const phase = omega * x;
    const yA = centerY + Math.sin(phase) * amplitude;
    const yB = centerY + Math.sin(phase + Math.PI) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = strandColor;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  strandA.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  ctx.strokeStyle = strandColor;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  strandB.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  ctx.strokeStyle = bridgeColor;
  ctx.globalAlpha = 0.45;
  const bridgeInterval = Math.max(1, Math.floor(steps / N.TWENTYTWO));
  strandA.forEach((pointA, index) => {
    if (index % bridgeInterval === 0) {
      const pointB = strandB[index];
      if (!pointB) return;
      ctx.beginPath();
      ctx.moveTo(pointA.x, pointA.y);
      ctx.lineTo(pointB.x, pointB.y);
      ctx.stroke();
    }
  });

  ctx.restore();
}

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}
