/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circle lattice)
    2) Tree-of-Life scaffold (ten sephirot with twenty-two paths)
    3) Fibonacci curve (golden spiral polyline)
    4) Double-helix lattice (two still sine strands with cross ties)

  Rationale:
    - No animation or flashing; the scene renders a single time on load.
    - Muted palette and transparent strokes keep contrast gentle (trauma-informed).
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 guide spacing and counts.
*/

export function renderHelix(ctx, opts) {
  if (!ctx || !opts) {
    return { ok: false, reason: "missing-context" };
  }

  const defaults = normalizeConstants();
  const { width, height } = opts;
  const N = normalizeConstants(opts.NUM);
  const palette = normalizePalette(opts.palette);
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  const fallbackLayers = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];
  const ink = palette.ink || "#e8e8f0";

  if (typeof width !== "number" || typeof height !== "number") {
    return { ok: false, reason: "invalid-dimensions" };
  }

  const pickLayer = (index) => layers[index] || fallbackLayers[index] || ink;

  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  drawVesicaField(ctx, width, height, pickLayer(0), N);
  drawTreeOfLife(ctx, width, height, pickLayer(1), pickLayer(2), N);
  drawFibonacci(ctx, width, height, pickLayer(3), N);
  drawHelix(ctx, width, height, pickLayer(4), pickLayer(5), N);

  if (opts.notice) {
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.75;
    ctx.fillText(opts.notice, 24, height - 24);
    ctx.restore();
  }

  return { ok: true, constants: N, defaults };
}

function drawVesicaField(ctx, w, h, color, N) {
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

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 2);
  const spacingY = h / (rows + 2);
  const radius = Math.min(spacingX, spacingY) * (N.SEVEN / N.TWENTYTWO);
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1.5);
    const rowShift = (row % 2 === 0) ? 0 : spacingX / N.ELEVEN;

    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1.5) + rowShift;
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      if (row < rows - 1 && col % 2 === 0) {
        const nextCy = spacingY * (row + 2.5);
        const midY = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, midY, radius * (N.SEVEN / N.NINE));
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

function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
// Layer 2: Tree-of-Life — ten sephirot with twenty-two gentle paths.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, N) {
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1, N.TWENTYTWO / N.ELEVEN); // 22 paths softened by pillar 11.
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;

  const nodes = getTreeNodes(w, h, N);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
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
  const nodeRadius = (Math.min(w, h) / N.ONEFORTYFOUR) * (N.SEVEN / N.ELEVEN);

  nodes.forEach((node) => {
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

function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.THREE / N.THIRTYTHREE;

  ctx.restore();
}

// Layer 3: Fibonacci spiral — golden curve drawn once for calm movement suggestion.
function drawFibonacciSpiral(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.THREE / 2; // Equals 1.5px, subtle yet visible.
  ctx.globalAlpha = 0.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.85;

  const steps = N.ONEFORTYFOUR;
  const quarterTurns = N.SEVEN;
  const totalAngle = quarterTurns * (Math.PI / 2);
  const phi = (1 + Math.sqrt(5)) / 2;
  const radiusBase = Math.min(w, h) / (N.THREE + N.SEVEN / N.NINE);
  const centerX = w / 2;
  const centerY = h / 2;

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = totalAngle * t;
    const radius = radiusBase * Math.pow(phi, angle / (Math.PI / 2));
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

function drawHelix(ctx, w, h, strandColor, rungColor, N) {
  ctx.save();
  const segments = N.ONEFORTYFOUR;
  const amplitude = Math.min(w, h) / (N.SEVEN + N.NINE);
  const baseline = h / 2;
  const frequency = N.THIRTYTHREE / N.ELEVEN;
  const phase = Math.PI / N.THREE;

  ctx.lineWidth = N.THREE / N.ELEVEN;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = strandColor;

  ctx.beginPath();
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = w * t;
    const y = baseline + amplitude * Math.sin(frequency * Math.PI * t);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = w * t;
    const y = baseline + amplitude * Math.sin(frequency * Math.PI * t + phase);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.strokeStyle = rungColor;
  ctx.globalAlpha = 0.65;
  const rungCount = N.TWENTYTWO + N.ELEVEN;
  for (let i = 0; i <= rungCount; i += 1) {
    const t = i / rungCount;
    const x = w * t;
    const y1 = baseline + amplitude * Math.sin(frequency * Math.PI * t);
    const y2 = baseline + amplitude * Math.sin(frequency * Math.PI * t + phase);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
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

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function getTreeNodes(w, h, N) {
  const topMargin = h / N.ELEVEN;
  const bottomMargin = h - topMargin;
  const verticalSpan = bottomMargin - topMargin;
  const verticalStep = verticalSpan / N.NINE;
  const centerX = w / 2;
  const pillarOffset = w / (N.THREE + N.SEVEN / N.NINE);
  const innerOffset = pillarOffset / (N.TWENTYTWO / N.ELEVEN);
  const outerOffset = pillarOffset;

  return [
    { x: centerX, y: topMargin },
    { x: centerX - innerOffset, y: topMargin + verticalStep },
    { x: centerX + innerOffset, y: topMargin + verticalStep },
    { x: centerX - outerOffset, y: topMargin + verticalStep * 3 },
    { x: centerX + outerOffset, y: topMargin + verticalStep * 3 },
    { x: centerX, y: topMargin + verticalStep * (N.NINE / 2) },
    { x: centerX - outerOffset, y: topMargin + verticalStep * 6 },
    { x: centerX + outerOffset, y: topMargin + verticalStep * 6 },
    { x: centerX, y: topMargin + verticalStep * 7 },
    { x: centerX, y: bottomMargin }
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

function normalizePalette(raw) {
  if (!raw || typeof raw !== "object") {
    return { bg: "#0b0b12", ink: "#e8e8f0", layers: [] };
  }
  return {
    bg: typeof raw.bg === "string" ? raw.bg : "#0b0b12",
    ink: typeof raw.ink === "string" ? raw.ink : "#e8e8f0",
    layers: Array.isArray(raw.layers) ? raw.layers : []
  };
}

function normalizeConstants(values) {
  const defaults = {
    THREE: 3,
    SEVEN: 7,
    NINE: 9,
    ELEVEN: 11,
    TWENTYTWO: 22,
    THIRTYTHREE: 33,
    NINETYNINE: 99,
    ONEFORTYFOUR: 144
  };
  if (!values || typeof values !== "object") {
    return defaults;
  }
  const result = { ...defaults };
  Object.keys(defaults).forEach((key) => {
    if (typeof values[key] === "number") {
      result[key] = values[key];
    }
  });
  return result;
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
