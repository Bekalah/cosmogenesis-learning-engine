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
      }
    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;

  const nodes = getTreeNodes(w, h, N);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = (Math.min(w, h) / N.ONEFORTYFOUR) * (N.SEVEN / N.ELEVEN);

  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.THREE / N.THIRTYTHREE;
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
  ];
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
}
