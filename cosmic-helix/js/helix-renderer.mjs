/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (rendered back to front):
    1) Vesica field - intersecting circle lattice for the womb-of-forms motif.
    2) Tree-of-Life scaffold - ten sephirot joined by twenty-two calm paths.
    3) Fibonacci curve - logarithmic spiral polyline with golden-ratio pacing.
    4) Double-helix lattice - two still strands with gentle cross ties.

  Rationale:
    - No animation: everything draws once on load to respect ND-safe pacing.
    - Calm palette: soft contrast keeps lines readable without sensory spikes.
    - Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) guide proportions.
*/

const DEFAULT_NUM = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
};

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    return { ok: false, reason: "missing-context" };
  }

  const width = toNumber(options.width, ctx.canvas.width);
  const height = toNumber(options.height, ctx.canvas.height);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { ok: false, reason: "invalid-dimensions" };
  }

  const palette = normalisePalette(options.palette);
  const numerology = normaliseNumerology(options.NUM);
  const notice = typeof options.notice === "string" ? options.notice.trim() : "";

  ctx.save();
  fillBackground(ctx, width, height, palette.bg);

  drawVesicaField(ctx, width, height, palette.layers[0], numerology);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], numerology, palette.ink);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], numerology);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], numerology);

  if (notice) {
    drawNotice(ctx, width, height, palette.ink, notice, numerology);
  }

  ctx.restore();
  return { ok: true, palette, numerology };
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalisePalette(input) {
  const source = input && typeof input === "object" ? input : {};
  const candidateLayers = Array.isArray(source.layers) ? source.layers : [];
  const layers = DEFAULT_PALETTE.layers.map((color, index) => {
    const candidate = candidateLayers[index];
    return typeof candidate === "string" && candidate.trim() ? candidate : color;
  });

  return {
    bg: pickColor(source.bg, DEFAULT_PALETTE.bg),
    ink: pickColor(source.ink, DEFAULT_PALETTE.ink),
    muted: pickColor(source.muted, DEFAULT_PALETTE.muted),
    layers
  };
}

function pickColor(candidate, fallback) {
  return typeof candidate === "string" && candidate.trim() ? candidate : fallback;
}

function normaliseNumerology(source) {
  const data = source && typeof source === "object" ? source : {};
  const result = {};
  for (const key of Object.keys(DEFAULT_NUM)) {
    const value = Number(data[key]);
    result[key] = Number.isFinite(value) ? value : DEFAULT_NUM[key];
  }
  return result;
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawVesicaField(ctx, width, height, color, N) {
  const columns = Math.max(3, Math.round(N.NINE));
  const rows = Math.max(3, Math.round(N.SEVEN));
  const xGap = width / (columns + 1);
  const yGap = height / (rows + 1);
  const radius = Math.min(xGap, yGap) * 0.66;
  const lineWidth = Math.max(1, radius / (N.THIRTYTHREE || DEFAULT_NUM.THIRTYTHREE));

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = 0.35;
  // Gentle alpha keeps overlapping vesica forms soft for ND-safe viewing.

  for (let row = 0; row < rows; row += 1) {
    const cy = yGap + row * yGap;
    for (let col = 0; col < columns; col += 1) {
      const cx = xGap + col * xGap;
      strokeCircle(ctx, cx, cy, radius);
      strokeCircle(ctx, cx + xGap / 2, cy, radius);
      strokeCircle(ctx, cx, cy + yGap / 2, radius);
    }
  }

  ctx.restore();
}

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, N, ink) {
  const topMargin = height / (N.ELEVEN || DEFAULT_NUM.ELEVEN);
  const usableHeight = height - topMargin * 2;
  const levelGap = usableHeight / (N.NINE || DEFAULT_NUM.NINE);
  const centerX = width / 2;
  const columnSpread = width / (N.THREE + N.SEVEN / 10);
  const nodeRadius = Math.max(4, Math.min(width, height) / (N.NINETYNINE || DEFAULT_NUM.NINETYNINE));

  const layout = [
    { level: 0, shift: 0 },
    { level: 1, shift: 1 },
    { level: 1, shift: -1 },
    { level: 3, shift: 0.9 },
    { level: 3, shift: -0.9 },
    { level: 4.5, shift: 0 },
    { level: 6, shift: 0.85 },
    { level: 6, shift: -0.85 },
    { level: 7.4, shift: 0 },
    { level: 9, shift: 0 }
  ];

  const nodes = layout.map((item) => ({
    x: centerX + item.shift * columnSpread,
    y: topMargin + item.level * levelGap
  }));

  const paths = [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [1, 3], [2, 5], [2, 4], [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 7], [5, 6], [5, 7], [6, 7], [6, 8], [7, 8], [5, 8], [8, 9], [6, 9], [7, 9]
  ];

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1, nodeRadius / (N.TWENTYTWO || DEFAULT_NUM.TWENTYTWO));
  ctx.globalAlpha = 0.6;
  // Calm line weight highlights twenty-two paths without overpowering the nodes.

  for (const [fromIndex, toIndex] of paths) {
    const from = nodes[fromIndex];
    const to = nodes[toIndex];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.9;
  // Nodes stay opaque to anchor focus while paths remain translucent.
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1, nodeRadius / (N.THIRTYTHREE || DEFAULT_NUM.THIRTYTHREE));

  for (const node of nodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawFibonacciCurve(ctx, width, height, color, N) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = Math.max(12, Math.round(N.ONEFORTYFOUR || DEFAULT_NUM.ONEFORTYFOUR));
  const rotations = (N.THIRTYTHREE || DEFAULT_NUM.THIRTYTHREE) / (N.ELEVEN || DEFAULT_NUM.ELEVEN);
  const thetaMax = rotations * Math.PI * 2;

  const rawPoints = [];
  for (let index = 0; index < steps; index += 1) {
    const t = steps <= 1 ? 0 : index / (steps - 1);
    const theta = t * thetaMax;
    const radius = Math.pow(phi, theta / Math.PI);
    const rotatedTheta = theta - Math.PI / 2;
    rawPoints.push({
      x: radius * Math.cos(rotatedTheta),
      y: radius * Math.sin(rotatedTheta)
    });
  }

  const bounds = measureBounds(rawPoints);
  const rangeX = bounds.maxX - bounds.minX || 1;
  const rangeY = bounds.maxY - bounds.minY || 1;
  const scale = 0.4 * Math.min(width / rangeX, height / rangeY);
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;

  const points = rawPoints.map((point) => ({
    x: width / 2 + (point.x - centerX) * scale,
    y: height / 2 + (point.y - centerY) * scale
  }));

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / (N.ONEFORTYFOUR || DEFAULT_NUM.ONEFORTYFOUR));
  ctx.globalAlpha = 0.85;
  // Polyline sampling is static, keeping the Fibonacci growth readable without motion.
  drawPolyline(ctx, points);

  const markerInterval = Math.max(6, Math.floor(points.length / (N.TWENTYTWO || DEFAULT_NUM.TWENTYTWO)));
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.75;
  for (let index = 0; index < points.length; index += markerInterval) {
    const point = points[index];
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(2, ctx.lineWidth * 0.9), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function measureBounds(points) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }
  if (!points.length) {
    minX = minY = maxX = maxY = 0;
  }
  return { minX, minY, maxX, maxY };
}

function drawPolyline(ctx, points) {
  if (points.length < 2) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
}

function drawHelixLattice(ctx, width, height, colorA, colorB, N) {
  const samples = Math.max(12, Math.round(N.ONEFORTYFOUR || DEFAULT_NUM.ONEFORTYFOUR));
  const marginX = width / (N.ELEVEN || DEFAULT_NUM.ELEVEN);
  const usableWidth = width - marginX * 2;
  const centerY = height * 0.62;
  const amplitude = height / (N.THREE + N.NINE / 9);
  const angleScale = (N.THIRTYTHREE || DEFAULT_NUM.THIRTYTHREE) / (N.ELEVEN || DEFAULT_NUM.ELEVEN) * Math.PI;

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < samples; index += 1) {
    const t = samples <= 1 ? 0 : index / (samples - 1);
    const x = marginX + t * usableWidth;
    const angle = t * angleScale;
    const yA = centerY + Math.sin(angle) * amplitude * 0.3;
    const yB = centerY + Math.sin(angle + Math.PI) * amplitude * 0.3;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.save();
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / (N.NINETYNINE || DEFAULT_NUM.NINETYNINE));
  ctx.globalAlpha = 0.75;
  // Twin strands use small amplitude so the lattice reads clearly without overstimulation.
  ctx.strokeStyle = colorA;
  drawPolyline(ctx, strandA);
  ctx.strokeStyle = colorB;
  drawPolyline(ctx, strandB);

  const rungSpacing = Math.max(2, Math.floor(samples / (N.TWENTYTWO || DEFAULT_NUM.TWENTYTWO)));
  ctx.globalAlpha = 0.55;
  // Rungs bind the helix at a slow cadence (22 segments) to mirror the requested numerology.
  ctx.strokeStyle = colorB;
  for (let index = 0; index < samples; index += rungSpacing) {
    const a = strandA[index];
    const b = strandB[index];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNotice(ctx, width, height, ink, text, N) {
  const margin = width / (N.TWENTYTWO || DEFAULT_NUM.TWENTYTWO);
  const lineHeight = 16;
  const lines = wrapNotice(text, 44);

  ctx.save();
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.75;
  // Notice text offers gentle feedback if external data is missing.
  ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textBaseline = "alphabetic";

  lines.forEach((line, index) => {
    const y = height - margin - (lines.length - 1 - index) * lineHeight;
    ctx.fillText(line, margin, y);
  });

  ctx.restore();
}

function wrapNotice(text, maxChars) {
  const safeText = text.trim();
  if (!safeText) {
    return [];
  }
  const words = safeText.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}
