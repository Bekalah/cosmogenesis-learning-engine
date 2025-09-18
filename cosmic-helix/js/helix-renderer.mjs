/*
  helix-renderer.mjs

  Static offline renderer for the Cosmic Helix canvas. All helpers are pure and
  deterministic so the drawing happens once and stays ND-safe (why: avoids
  surprise motion and keeps sensory load gentle).

  Layer order (back to front):
    1) Vesica field - intersecting circles forming the womb-of-forms grid.
    2) Tree-of-Life scaffold - ten sephirot linked by twenty-two calm paths.
    3) Fibonacci curve - logarithmic spiral encoded with golden-ratio pacing.
    4) Double-helix lattice - two static strands stitched with thirty-three rungs.

  Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) shape spacing and
  sampling so the render stays faithful to the declared cosmology.
*/

const FALLBACK_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

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

const FALLBACK_GEOMETRY = {
  // Vesica lattice references 9x11 grid divisions (why: honours 9/11 numerology).
  vesica: {
    rows: 9,
    columns: 11,
    paddingDivisor: 11,
    radiusFactor: 1.5,
    strokeDivisor: 99,
    alpha: 0.55
  },
  // Tree-of-Life scaffold keeps ten nodes with twenty-two connective paths.
  treeOfLife: {
    marginDivisor: 11,
    radiusDivisor: 22,
    labelOffset: -24,
    labelFont: "13px system-ui, -apple-system, Segoe UI, sans-serif",
    nodes: [
      { id: "kether", title: "Kether", meaning: "Crown", level: 0, xFactor: 0.5 },
      { id: "chokmah", title: "Chokmah", meaning: "Wisdom", level: 1, xFactor: 0.7 },
      { id: "binah", title: "Binah", meaning: "Understanding", level: 1, xFactor: 0.3 },
      { id: "chesed", title: "Chesed", meaning: "Mercy", level: 2, xFactor: 0.68 },
      { id: "geburah", title: "Geburah", meaning: "Severity", level: 2, xFactor: 0.32 },
      { id: "tiphareth", title: "Tiphareth", meaning: "Beauty", level: 3, xFactor: 0.5 },
      { id: "netzach", title: "Netzach", meaning: "Victory", level: 4, xFactor: 0.66 },
      { id: "hod", title: "Hod", meaning: "Glory", level: 4, xFactor: 0.34 },
      { id: "yesod", title: "Yesod", meaning: "Foundation", level: 5, xFactor: 0.5 },
      { id: "malkuth", title: "Malkuth", meaning: "Kingdom", level: 6, xFactor: 0.5 }
    ],
    edges: [
      ["kether", "chokmah"],
      ["kether", "binah"],
      ["kether", "tiphareth"],
      ["chokmah", "binah"],
      ["chokmah", "tiphareth"],
      ["chokmah", "chesed"],
      ["chokmah", "netzach"],
      ["binah", "tiphareth"],
      ["binah", "geburah"],
      ["binah", "hod"],
      ["chesed", "geburah"],
      ["chesed", "tiphareth"],
      ["chesed", "netzach"],
      ["geburah", "tiphareth"],
      ["geburah", "hod"],
      ["tiphareth", "netzach"],
      ["tiphareth", "hod"],
      ["tiphareth", "yesod"],
      ["netzach", "hod"],
      ["netzach", "yesod"],
      ["hod", "yesod"],
      ["yesod", "malkuth"]
    ]
  },
  fibonacci: {
    sampleCount: 144,
    turns: 3,
    baseRadiusDivisor: 3,
    phi: 1.618033988749895,
    alpha: 0.85
  },
  helix: {
    sampleCount: 144,
    cycles: 3,
    amplitudeDivisor: 3,
    phaseOffset: Math.PI,
    crossTieCount: 33,
    strandAlpha: 0.85,
    rungAlpha: 0.6
  }
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
  const geometry = normaliseGeometry(options.geometry);
  const notice = typeof options.notice === "string" ? options.notice.trim() : "";

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  fillBackground(ctx, width, height, palette.bg);

  // Layer sequencing preserves depth without motion (why: layered geometry covenant).
  drawVesicaField(ctx, width, height, palette.layers[0], numerology, geometry.vesica);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], palette.ink, numerology, geometry.treeOfLife);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], numerology, geometry.fibonacci);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], numerology, geometry.helix);

  if (notice) {
    drawNotice(ctx, width, height, palette.ink, notice);
  }

  ctx.restore();
  return { ok: true, constants: numerology };
}

function normalisePalette(input) {
  if (!input || typeof input !== "object") {
    return clonePalette(FALLBACK_PALETTE);
  }

  const result = {
    bg: typeof input.bg === "string" ? input.bg : FALLBACK_PALETTE.bg,
    ink: typeof input.ink === "string" ? input.ink : FALLBACK_PALETTE.ink,
    muted: typeof input.muted === "string" ? input.muted : FALLBACK_PALETTE.muted,
    layers: []
  };

  const sourceLayers = Array.isArray(input.layers) ? input.layers : [];
  for (let index = 0; index < FALLBACK_PALETTE.layers.length; index += 1) {
    const candidate = sourceLayers[index];
    result.layers.push(typeof candidate === "string" ? candidate : FALLBACK_PALETTE.layers[index]);
  }

  return result;
}

function clonePalette(palette) {
  return {
    bg: palette.bg,
    ink: palette.ink,
    muted: palette.muted,
    layers: [...palette.layers]
  };
}

function normaliseNumerology(input) {
  const source = input && typeof input === "object" ? input : {};
  const result = {};
  for (const key of Object.keys(DEFAULT_NUM)) {
    const value = Number(source[key]);
    result[key] = Number.isFinite(value) && value > 0 ? value : DEFAULT_NUM[key];
  }
  return result;
}

function normaliseGeometry(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    vesica: normaliseVesica(source.vesica),
    treeOfLife: normaliseTree(source.treeOfLife),
    fibonacci: normaliseFibonacci(source.fibonacci),
    helix: normaliseHelix(source.helix)
  };
}

function normaliseVesica(data) {
  const fallback = FALLBACK_GEOMETRY.vesica;
  const safe = data && typeof data === "object" ? data : {};
  return {
    rows: positiveInteger(safe.rows, fallback.rows),
    columns: positiveInteger(safe.columns, fallback.columns),
    paddingDivisor: positiveNumber(safe.paddingDivisor, fallback.paddingDivisor),
    radiusFactor: positiveNumber(safe.radiusFactor, fallback.radiusFactor),
    strokeDivisor: positiveNumber(safe.strokeDivisor, fallback.strokeDivisor),
    alpha: clampAlpha(safe.alpha, fallback.alpha)
  };
}

function normaliseTree(data) {
  const fallback = FALLBACK_GEOMETRY.treeOfLife;
  const safe = data && typeof data === "object" ? data : {};
  const fallbackNodes = fallback.nodes;
  const providedNodes = Array.isArray(safe.nodes) && safe.nodes.length > 0 ? safe.nodes : fallbackNodes;
  const nodes = providedNodes.map((node, index) => {
    const base = typeof node === "object" && node !== null ? node : {};
    const reference = fallbackNodes.find((item) => item.id === base.id) || fallbackNodes[index % fallbackNodes.length];
    return {
      id: typeof base.id === "string" && base.id ? base.id : reference.id,
      title: typeof base.title === "string" && base.title ? base.title : reference.title,
      meaning: typeof base.meaning === "string" && base.meaning ? base.meaning : reference.meaning,
      level: finiteNumber(base.level, reference.level),
      xFactor: clamp01(finiteNumber(base.xFactor, reference.xFactor))
    };
  });

  const nodeIds = new Set(nodes.map((node) => node.id));
  const sourceEdges = Array.isArray(safe.edges) && safe.edges.length > 0 ? safe.edges : fallback.edges;
  const edges = sourceEdges
    .map((edge) => (Array.isArray(edge) ? edge.slice(0, 2) : []))
    .filter((edge) => edge.length === 2 && nodeIds.has(edge[0]) && nodeIds.has(edge[1]));

  return {
    marginDivisor: positiveNumber(safe.marginDivisor, fallback.marginDivisor),
    radiusDivisor: positiveNumber(safe.radiusDivisor, fallback.radiusDivisor),
    labelOffset: finiteNumber(safe.labelOffset, fallback.labelOffset),
    labelFont: typeof safe.labelFont === "string" && safe.labelFont ? safe.labelFont : fallback.labelFont,
    nodes,
    edges
  };
}

function normaliseFibonacci(data) {
  const fallback = FALLBACK_GEOMETRY.fibonacci;
  const safe = data && typeof data === "object" ? data : {};
  return {
    sampleCount: positiveInteger(safe.sampleCount, fallback.sampleCount),
    turns: positiveNumber(safe.turns, fallback.turns),
    baseRadiusDivisor: positiveNumber(safe.baseRadiusDivisor, fallback.baseRadiusDivisor),
    phi: positiveNumber(safe.phi, fallback.phi),
    alpha: clampAlpha(safe.alpha, fallback.alpha)
  };
}

function normaliseHelix(data) {
  const fallback = FALLBACK_GEOMETRY.helix;
  const safe = data && typeof data === "object" ? data : {};
  return {
    sampleCount: positiveInteger(safe.sampleCount, fallback.sampleCount),
    cycles: positiveNumber(safe.cycles, fallback.cycles),
    amplitudeDivisor: positiveNumber(safe.amplitudeDivisor, fallback.amplitudeDivisor),
    phaseOffset: finiteNumber(safe.phaseOffset, fallback.phaseOffset),
    crossTieCount: positiveInteger(safe.crossTieCount, fallback.crossTieCount),
    strandAlpha: clampAlpha(safe.strandAlpha, fallback.strandAlpha),
    rungAlpha: clampAlpha(safe.rungAlpha, fallback.rungAlpha)
  };
}

function fillBackground(ctx, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

function drawVesicaField(ctx, width, height, color, N, settings) {
  const rows = Math.max(2, settings.rows);
  const columns = Math.max(2, settings.columns);
  const padding = Math.min(width, height) / settings.paddingDivisor;
  const horizontalSpan = width - padding * 2;
  const verticalSpan = height - padding * 2;
  const stepX = columns > 1 ? horizontalSpan / (columns - 1) : 0;
  const verticalStep = rows > 1 ? verticalSpan / (rows - 1) : 0;
  const radius = Math.min(stepX, verticalStep) * (N.NINE / N.ELEVEN) / settings.radiusFactor;
  const strokeWidth = Math.max(1, Math.min(width, height) / settings.strokeDivisor) * (N.THIRTYTHREE / N.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = strokeWidth;
  ctx.globalAlpha = 1;

  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : stepX / 2;
    const y = padding + row * verticalStep;
    for (let column = 0; column < columns; column += 1) {
      const x = padding + offset + column * stepX;
      if (x < padding - radius || x > width - padding + radius) {
        continue;
      }
      strokeCircle(ctx, x, y, radius);
      const mirroredY = y + verticalStep * (N.SEVEN / N.NINE);
      if (mirroredY <= height - padding + radius) {
        strokeCircle(ctx, x, mirroredY, radius);
      }
    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, labelColor, N, tree) {
  const margin = Math.min(width, height) / tree.marginDivisor;
  const top = margin;
  const bottom = height - margin;
  const usableWidth = width - margin * 2;
  const maxLevel = tree.nodes.reduce((acc, node) => Math.max(acc, node.level), 0);
  const levelStep = maxLevel > 0 ? (bottom - top) / maxLevel : 0;
  const radius = Math.max(4, Math.min(width, height) / tree.radiusDivisor);
  const pathWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  const positions = new Map();
  for (const node of tree.nodes) {
    const clampedLevel = Math.max(0, Math.min(maxLevel, node.level));
    const x = margin + clamp01(node.xFactor) * usableWidth;
    const y = top + clampedLevel * levelStep;
    positions.set(node.id, { x, y, node });
  }

  // Calm connective lines drawn first (why: keeps lattice behind node glyphs).
  ctx.save();
  ctx.strokeStyle = colorWithAlpha(pathColor, 0.72);
  ctx.lineWidth = pathWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const edge of tree.edges) {
    const start = positions.get(edge[0]);
    const end = positions.get(edge[1]);
    if (!start || !end) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // Nodes rendered after paths to preserve layered depth.
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = colorWithAlpha(nodeColor, 0.4);
  ctx.lineWidth = pathWidth / 2;
  for (const { x, y, node } of positions.values()) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Labels stay minimal to avoid clutter while remaining readable.
  ctx.fillStyle = labelColor;
  ctx.font = tree.labelFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const { x, y, node } of positions.values()) {
    ctx.fillText(node.title, x, y + tree.labelOffset * (1 / N.THREE));
  }

  ctx.restore();
}

function drawFibonacciCurve(ctx, width, height, color, N, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const maxTheta = settings.turns * Math.PI * 2;
  const baseRadius = Math.min(width, height) / settings.baseRadiusDivisor;
  const centerX = width / 2;
  const centerY = height / 2;
  const path = [];

  for (let index = 0; index < samples; index += 1) {
    const t = index / (samples - 1);
    const theta = t * maxTheta;
    const growth = Math.pow(settings.phi, theta / (Math.PI * 2));
    const radius = baseRadius * growth * (N.THREE / N.ELEVEN);
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    path.push({ x, y });
  }

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let index = 1; index < path.length; index += 1) {
    ctx.lineTo(path[index].x, path[index].y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawHelixLattice(ctx, width, height, strandColor, rungColor, N, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const centerX = width / 2;
  const top = Math.min(width, height) / settings.amplitudeDivisor;
  const amplitude = top * (N.SEVEN / N.ELEVEN);
  const verticalStep = height / (samples - 1);
  const angularFrequency = settings.cycles * Math.PI * 2;

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < samples; index += 1) {
    const y = index * verticalStep;
    const phase = (angularFrequency * index) / (samples - 1);
    const offset = Math.sin(phase) * amplitude;
    const offsetB = Math.sin(phase + settings.phaseOffset) * amplitude;
    strandA.push({ x: centerX - offset, y });
    strandB.push({ x: centerX - offsetB, y });
  }

  ctx.save();
  ctx.lineWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = colorWithAlpha(strandColor, settings.strandAlpha);
  ctx.beginPath();
  ctx.moveTo(strandA[0].x, strandA[0].y);
  for (let index = 1; index < strandA.length; index += 1) {
    ctx.lineTo(strandA[index].x, strandA[index].y);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(strandB[0].x, strandB[0].y);
  for (let index = 1; index < strandB.length; index += 1) {
    ctx.lineTo(strandB[index].x, strandB[index].y);
  }
  ctx.stroke();

  // Cross ties keep the double helix bonded without motion.
  ctx.strokeStyle = colorWithAlpha(rungColor, settings.rungAlpha);
  const rungCount = Math.min(settings.crossTieCount, samples);
  for (let rung = 0; rung < rungCount; rung += 1) {
    const t = rungCount > 1 ? rung / (rungCount - 1) : 0;
    const index = Math.round(t * (samples - 1));
    const a = strandA[index];
    const b = strandB[index];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNotice(ctx, width, height, color, message) {
  ctx.save();
  ctx.fillStyle = colorWithAlpha(color, 0.8);
  ctx.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  const padding = 16;
  ctx.fillText(message, padding, height - padding);
  ctx.restore();
}

function colorWithAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function hexToRgb(hex) {
  const cleaned = typeof hex === "string" ? hex.replace(/[^0-9a-fA-F]/g, "") : "";
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r, g, b };
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return { r, g, b };
  }
  return { r: 255, g: 255, b: 255 };
}

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function positiveNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

function positiveInteger(value, fallback) {
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : fallback;
}

function finiteNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clampAlpha(value, fallback) {
  const num = Number(value);
  if (Number.isFinite(num)) {
    if (num < 0) return 0;
    if (num > 1) return 1;
    return num;
  }
  return fallback;
}

function clamp01(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return 0;
  }
  if (num < 0) return 0;
  if (num > 1) return 1;
  return num;
}

export default renderHelix;
