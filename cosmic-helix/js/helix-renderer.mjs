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

/**
 * Render a static, layered sacred-geometry scene onto a 2D canvas context.
 *
 * Draws four composited layers in fixed order — vesica field, Tree of Life scaffold,
 * Fibonacci curve, and double-helix lattice — then optionally renders a short notice.
 *
 * @param {CanvasRenderingContext2D} ctx - A 2D canvas rendering context (must have a valid `canvas`).
 * @param {Object} [options] - Rendering options.
 * @param {number} [options.width] - Canvas width to use for rendering; falls back to `ctx.canvas.width`.
 * @param {number} [options.height] - Canvas height to use for rendering; falls back to `ctx.canvas.height`.
 * @param {Object} [options.palette] - Optional palette overrides (bg, ink, muted, layers[]). Invalid/missing fields fall back to defaults.
 * @param {Object} [options.NUM] - Optional numerology constants to override numeric defaults used for layout/scaling.
 * @param {Object} [options.geometry] - Optional geometry overrides for vesica, treeOfLife, fibonacci, and helix components.
 * @param {string} [options.notice] - Optional short message rendered near the bottom-left when provided.
 *
 * @return {{ok: boolean, reason?: string, constants?: Object}} Result object.
 *   - On success: { ok: true, constants } where `constants` is the numerology object used.
 *   - On failure: { ok: false, reason } where `reason` is "missing-context" (invalid ctx) or "invalid-dimensions" (non-finite or non-positive width/height).
 */
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

/**
 * Draws a rectangular grid of vesica-like circular strokes onto the canvas.
 *
 * The grid is inset by a padding computed from the smaller canvas dimension and
 * settings.paddingDivisor. Circles are arranged in `rows` × `columns`, with
 * alternating-row horizontal offsets (checker-like lattice). Circle radius and
 * stroke width are derived from the grid step sizes and numerology constants;
 * stroke color is the provided `color` combined with `settings.alpha`.
 *
 * @param {number} width - Canvas drawing width in pixels.
 * @param {number} height - Canvas drawing height in pixels.
 * @param {string} color - Hex color string used for circle strokes.
 * @param {Object} N - Numerology constants object (keys like NINE, ELEVEN, THREE, THIRTYTHREE, NINETYNINE) used to scale radii and stroke widths.
 * @param {Object} settings - Vesica geometry controls:
 *   - rows {number}: number of rows (minimum 2).
 *   - columns {number}: number of columns (minimum 2).
 *   - paddingDivisor {number}: divisor applied to the smaller canvas dimension to compute padding.
 *   - radiusFactor {number}: divisor applied to step size to compute circle radius.
 *   - strokeDivisor {number}: divisor applied to canvas size to compute stroke width.
 *   - alpha {number}: stroke alpha in [0,1].
 */
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

/**
 * Render the "Tree of Life" layer: connective lines, filled node glyphs, and textual labels.
 *
 * Draws edges behind nodes, renders each node as a filled/stroked circle, and draws two-line
 * labels beneath each node. Coordinates are computed from the provided geometry (levels and
 * xFactor) and are clamped to the canvas bounds; edges referencing missing node ids are ignored.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context to draw into.
 * @param {number} width - Canvas drawing width in pixels.
 * @param {number} height - Canvas drawing height in pixels.
 * @param {string} pathColor - Base color for connective lines (hex or CSS color).
 * @param {string} nodeColor - Base color for node fills and strokes (hex or CSS color).
 * @param {string} labelColor - Color used for node labels (hex or CSS color).
 * @param {object} N - Numerology constants (expects numeric keys used for sizing/scaling).
 * @param {object} tree - Normalized tree geometry and content:
 *   - marginDivisor {number} controls outer margin as min(width,height)/marginDivisor.
 *   - radiusDivisor {number} controls node radius as min(width,height)/radiusDivisor.
 *   - labelOffset {number} vertical offset for label placement below each node.
 *   - labelFont {string} CSS font used for labels.
 *   - nodes {Array} array of node objects with at least: id (string), level (number), xFactor (0–1),
 *     title (string), meaning (string).
 *   - edges {Array} array of two-element id arrays [fromId, toId]; edges with unknown ids are skipped.
 */
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

/**
 * Draws a golden-spiral-like Fibonacci curve onto the provided 2D canvas context.
 *
 * The curve is rendered as a stroked polyline centered proportionally within the canvas
 * using numerology constants for placement and the provided settings for sampling and scale.
 *
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {string} color - Base hex color used for the stroke.
 * @param {Object} N - Numerology constants used for proportional placement and sizing.
 * @param {Object} settings - Curve parameters.
 * @param {number} settings.sampleCount - Number of points sampled along the curve (minimum 2).
 * @param {number} settings.turns - Number of full revolutions the spiral makes (>= 0).
 * @param {number} settings.phi - Growth factor for radius (clamped to >= 1.0001).
 * @param {number} settings.baseRadiusDivisor - Divisor of min(width,height) to compute base radius.
 * @param {number} settings.alpha - Stroke alpha applied to the color (0–1).
 */
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

/**
 * Render a static double-helix lattice onto a 2D canvas context.
 *
 * Draws two sinusoidal strands and a configurable number of static cross-ties (rungs)
 * between them. Strand and rung colors are derived from the provided primary and
 * secondary colors with per-element alpha from settings. Scaling and placement are
 * influenced by the numerology object N.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context to draw into.
 * @param {number} width - Canvas drawing width in pixels.
 * @param {number} height - Canvas drawing height in pixels.
 * @param {string} primaryColor - Hex color used for the first strand.
 * @param {string} secondaryColor - Hex color used for the second strand and rungs.
 * @param {object} N - Numerology constants (e.g., N.SEVEN, N.NINE, N.ELEVEN, N.NINETYNINE) used for scale factors.
 * @param {object} settings - Helix geometry and styling:
 *   - sampleCount: number of sample points per strand (minimum 2).
 *   - cycles: number of full sine cycles along the strand length.
 *   - amplitudeDivisor: divisor to compute vertical amplitude from min(width,height).
 *   - phaseOffset: phase offset in degrees applied to the second strand.
 *   - strandAlpha: alpha applied to strand stroke colors.
 *   - rungAlpha: alpha applied to rung (cross-tie) stroke color.
 *   - crossTieCount: number of static cross-ties to draw (minimum 1).
 */
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

/**
 * Convert a value to a finite number, returning a fallback if conversion fails.
 *
 * Attempts to coerce `value` with `Number(value)` and returns the result if it is a finite number;
 * otherwise returns `fallback`. Treats `NaN`, `Infinity`, and `-Infinity` as invalid.
 *
 * @param {*} value - The value to convert to a number.
 * @param {number} fallback - The number to return when `value` cannot be converted to a finite number.
 * @returns {number} The finite numeric conversion of `value`, or `fallback` if conversion is not finite.
 */
function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Convert the input to a positive finite number; return the provided fallback if conversion fails or the result is not > 0.
 * @param {*} value - Value to convert to a positive finite number.
 * @param {number} fallback - Value returned when conversion is not a positive finite number.
 * @returns {number} The parsed positive finite number or the provided fallback.
 */
function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Convert an input to a positive integer by rounding; returns the fallback when conversion fails or yields a non-positive value.
 *
 * The function attempts to coerce `value` to a Number, rounds it with `Math.round`, and returns the rounded value only if the
 * original numeric coercion produced a finite number and the rounded result is > 0. Otherwise the provided `fallback` is returned.
 *
 * @param {*} value - The value to convert to a positive integer.
 * @param {number} fallback - The value to return when `value` cannot be converted into a positive integer.
 * @returns {number} A positive integer (rounded result) or the provided `fallback`.
 */
function positiveInteger(value, fallback) {
  const parsed = Number(value);
  const rounded = Math.round(parsed);
  return Number.isFinite(parsed) && rounded > 0 ? rounded : fallback;
}

/**
 * Convert a value to a finite number, returning a fallback if conversion fails.
 *
 * Attempts to coerce `value` with `Number(value)` and returns the result if it's a finite number;
 * otherwise returns `fallback`.
 *
 * @param {*} value - Value to convert to a number.
 * @param {number} fallback - Value to return when `value` does not produce a finite number.
 * @return {number} The finite numeric conversion of `value`, or `fallback` if conversion is not finite.
 */
function finiteNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Constrains a number to the inclusive range [min, max].
 * @param {number} value - The value to clamp.
 * @param {number} min - Lower bound of the range.
 * @param {number} max - Upper bound of the range.
 * @return {number} The clamped value (min if value < min, max if value > max, otherwise value).
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Convert a value to a finite number and clamp it into the inclusive range [0, 1].
 *
 * Non-finite inputs (NaN, Infinity, etc.) return 0. Values less than 0 return 0;
 * values greater than 1 return 1. Finite numbers within [0,1] are returned unchanged.
 *
 * @param {*} value - Value to convert and clamp.
 * @return {number} A finite number between 0 and 1 (inclusive).
 */
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

/**
 * Convert a value to a finite alpha in the [0, 1] range, or return a fallback.
 *
 * If `value` can be parsed to a finite number it is clamped to the inclusive range [0, 1].
 * Otherwise the provided `fallback` is returned unchanged.
 *
 * @param {*} value - The input to convert to an alpha value.
 * @param {number} fallback - Value to return when `value` is not a finite number.
 * @return {number} A number in [0, 1] (from the clamped input) or `fallback` when input is invalid.
 */
function clampAlpha(value, fallback) {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return Math.min(1, Math.max(0, parsed));
  }
  return fallback;
}

/**
 * Convert a 6‑digit hex color to an `rgba(...)` string, with alpha clamped to [0,1].
 *
 * If `hex` is not a valid 6‑character hex (optionally prefixed with `#`), returns white with the provided alpha.
 *
 * @param {string} hex - Hex color string (e.g. `"#ff8800"` or `"ff8800"`). Only 6‑digit hex is supported.
 * @param {number} alpha - Desired alpha; values are clamped into the [0, 1] range.
 * @returns {string} An `rgba(r,g,b,a)` CSS color string.
 */
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
