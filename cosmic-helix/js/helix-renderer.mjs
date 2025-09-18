/*
  helix-renderer.mjs
  Static ND-safe renderer for the Cosmic Helix canvas. Draws four calm layers:
    1) Vesica field (foundation grid)
    2) Tree-of-Life scaffold (nodes and paths)
    3) Fibonacci curve (golden spiral polyline)
    4) Double-helix lattice (phase-shifted strands)

  All helpers are pure so a single invocation paints the scene without motion.
  Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) guide proportions.
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
  vesica: {
    rows: 9,
    columns: 11,
    paddingDivisor: 11,
    radiusFactor: 1.5,
    strokeDivisor: 99,
    alpha: 0.55
  },
  treeOfLife: {
    marginDivisor: 11,
    radiusDivisor: 22,
    labelOffset: -24,
    labelFont: "13px system-ui, -apple-system, Segoe UI, sans-serif",
    nodes: [
      { id: "kether", title: "Kether", meaning: "Crown", level: 0, xFactor: 0.5 },
      { id: "chokmah", title: "Chokmah", meaning: "Wisdom", level: 1, xFactor: 0.68 },
      { id: "binah", title: "Binah", meaning: "Understanding", level: 1, xFactor: 0.32 },
      { id: "chesed", title: "Chesed", meaning: "Mercy", level: 2, xFactor: 0.66 },
      { id: "geburah", title: "Geburah", meaning: "Severity", level: 2, xFactor: 0.34 },
      { id: "tiphareth", title: "Tiphareth", meaning: "Beauty", level: 3, xFactor: 0.5 },
      { id: "netzach", title: "Netzach", meaning: "Victory", level: 4, xFactor: 0.64 },
      { id: "hod", title: "Hod", meaning: "Glory", level: 4, xFactor: 0.36 },
      { id: "yesod", title: "Yesod", meaning: "Foundation", level: 5, xFactor: 0.5 },
      { id: "malkuth", title: "Malkuth", meaning: "Kingdom", level: 6, xFactor: 0.5 }
    ],
    edges: [
      ["kether", "chokmah"], ["kether", "binah"], ["kether", "tiphareth"],
      ["chokmah", "binah"], ["chokmah", "tiphareth"], ["chokmah", "chesed"],
      ["chokmah", "netzach"], ["binah", "tiphareth"], ["binah", "geburah"],
      ["binah", "hod"], ["chesed", "geburah"], ["chesed", "tiphareth"],
      ["chesed", "netzach"], ["geburah", "tiphareth"], ["geburah", "hod"],
      ["tiphareth", "netzach"], ["tiphareth", "hod"], ["tiphareth", "yesod"],
      ["netzach", "hod"], ["netzach", "yesod"], ["hod", "yesod"], ["yesod", "malkuth"]
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
    phaseOffset: 180,
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

  // Layer order preserves depth without motion (why: layered sacred geometry, ND-safe pacing).
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
  const spanX = width - padding * 2;
  const spanY = height - padding * 2;
  const stepX = columns > 1 ? spanX / (columns - 1) : spanX;
  const stepY = rows > 1 ? spanY / (rows - 1) : spanY;
  const radius = Math.min(stepX, stepY) * (N.NINE / N.ELEVEN) / settings.radiusFactor;
  const strokeWidth = Math.max(1, Math.min(width, height) / settings.strokeDivisor) * (N.THIRTYTHREE / N.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : stepX / N.THREE;
    const baseY = padding + row * stepY;
    const y = clamp(baseY, padding, height - padding);
    for (let column = 0; column < columns; column += 1) {
      const baseX = padding + column * stepX + offset;
      const x = clamp(baseX, padding, width - padding);
      strokeCircle(ctx, x, y, radius);
    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, labelColor, N, tree) {
  const margin = Math.min(width, height) / tree.marginDivisor;
  const top = margin;
  const bottom = height - margin;
  const horizontalSpan = width - margin * 2;
  const maxLevel = tree.nodes.reduce((acc, node) => Math.max(acc, node.level), 0);
  const levelStep = maxLevel > 0 ? (bottom - top) / Math.max(1, maxLevel) : 0;
  const radius = Math.max(4, Math.min(width, height) / tree.radiusDivisor);
  const pathWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  const positions = new Map();
  for (const node of tree.nodes) {
    const usableLevel = clamp(node.level, 0, maxLevel);
    const rawY = top + usableLevel * levelStep * (N.NINE / N.ELEVEN);
    const y = clamp(rawY, top, bottom);
    const x = margin + clamp01(node.xFactor) * horizontalSpan;
    positions.set(node.id, { x, y, node });
  }

  // Calm connective lines sit behind the node glyphs (why: maintains layered depth).
  ctx.save();
  ctx.strokeStyle = colorWithAlpha(pathColor, 0.66);
  ctx.lineWidth = pathWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (const edge of tree.edges) {
    const start = positions.get(edge[0]);
    const end = positions.get(edge[1]);
    if (!start || !end) {
      continue;
    }
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
  }
  ctx.stroke();
  ctx.restore();

  // Sephirot overlay to keep them legible.
  ctx.save();
  ctx.fillStyle = colorWithAlpha(nodeColor, 0.9);
  ctx.strokeStyle = colorWithAlpha(nodeColor, 0.9);
  ctx.lineWidth = Math.max(1, pathWidth * (N.THREE / N.TWENTYTWO));
  for (const entry of positions.values()) {
    ctx.beginPath();
    ctx.arc(entry.x, entry.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // Labels explain lore without crowding.
  ctx.save();
  ctx.fillStyle = colorWithAlpha(labelColor, 0.88);
  ctx.font = tree.labelFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const entry of positions.values()) {
    const textY = entry.y + tree.labelOffset;
    ctx.fillText(entry.node.title, entry.x, textY);
    ctx.fillText(entry.node.meaning, entry.x, textY + 14);
  }
  ctx.restore();
}

function drawFibonacciCurve(ctx, width, height, color, N, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const turns = Math.max(0, settings.turns);
  const totalAngle = turns * Math.PI * 2;
  const phi = Math.max(1.0001, settings.phi);
  const centerX = width * (N.ELEVEN / N.TWENTYTWO);
  const centerY = height * (N.SEVEN / N.ELEVEN);
  const baseRadius = Math.min(width, height) / settings.baseRadiusDivisor;
  const lineWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let index = 0; index < samples; index += 1) {
    const t = samples > 1 ? index / (samples - 1) : 0;
    const angle = t * totalAngle;
    const radius = baseRadius * Math.pow(phi, t * turns * (N.THREE / N.SEVEN));
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function drawHelixLattice(ctx, width, height, primaryColor, secondaryColor, N, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const cycles = Math.max(0, settings.cycles);
  const amplitude = Math.min(width, height) / settings.amplitudeDivisor;
  const centerX = width / 2;
  const centerY = height / 2;
  const length = width * (N.NINE / N.ELEVEN);
  const strandOffset = settings.phaseOffset * (Math.PI / 180);
  const pathWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < samples; index += 1) {
    const t = samples > 1 ? index / (samples - 1) : 0;
    const angle = t * cycles * Math.PI * 2;
    const x = centerX - length / 2 + t * length;
    const yA = centerY + Math.sin(angle) * amplitude * (N.SEVEN / N.NINE);
    const yB = centerY + Math.sin(angle + strandOffset) * amplitude * (N.SEVEN / N.NINE);
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = colorWithAlpha(primaryColor, settings.strandAlpha);
  ctx.lineWidth = pathWidth;
  ctx.beginPath();
  for (let index = 0; index < strandA.length; index += 1) {
    const point = strandA[index];
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.stroke();

  ctx.strokeStyle = colorWithAlpha(secondaryColor, settings.strandAlpha);
  ctx.beginPath();
  for (let index = 0; index < strandB.length; index += 1) {
    const point = strandB[index];
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.stroke();

  // Cross ties keep strands linked without motion (why: static double helix request).
  ctx.strokeStyle = colorWithAlpha(secondaryColor, settings.rungAlpha);
  const ties = Math.max(1, settings.crossTieCount);
  for (let tie = 0; tie < ties; tie += 1) {
    const t = ties > 1 ? tie / (ties - 1) : 0;
    const indexA = Math.round(t * (strandA.length - 1));
    const indexB = Math.round(t * (strandB.length - 1));
    const pointA = strandA[indexA];
    const pointB = strandB[indexB];
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNotice(ctx, width, height, color, message) {
  const padding = Math.min(width, height) / DEFAULT_NUM.THIRTYTHREE;
  ctx.save();
  ctx.fillStyle = colorWithAlpha(color, 0.85);
  ctx.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(message, padding, height - padding);
  ctx.restore();
}

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  const rounded = Math.round(parsed);
  return Number.isFinite(parsed) && rounded > 0 ? rounded : fallback;
}

function finiteNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  if (parsed < 0) {
    return 0;
  }
  if (parsed > 1) {
    return 1;
  }
  return parsed;
}

function clampAlpha(value, fallback) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return Math.min(1, Math.max(0, parsed));
  }
  return fallback;
}

function colorWithAlpha(hex, alpha) {
  const normalized = typeof hex === "string" ? hex.trim() : "";
  const value = normalized.startsWith("#") ? normalized.slice(1) : normalized;
  if (value.length !== 6) {
    const safeAlpha = clamp01(alpha);
    return `rgba(255,255,255,${safeAlpha})`;
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const safeAlpha = clamp01(alpha);
  return `rgba(${r},${g},${b},${safeAlpha})`;
}
