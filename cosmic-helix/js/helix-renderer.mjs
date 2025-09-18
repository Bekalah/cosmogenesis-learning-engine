/*
  helix-renderer.mjs

  ND-safe static renderer for the four-layer cosmic helix.
  The helpers are pure and sequenced so the canvas paints once without motion.
  Layer order (back to front):
    1) Vesica field - intersecting circles establish the womb-of-forms grid.
    2) Tree-of-Life scaffold - ten sephirot and twenty-two paths anchor lineage.
    3) Fibonacci curve - logarithmic spiral sampling the golden ratio for growth.
    4) Double-helix lattice - static sine strands with calm cross ties.

  Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) parameterise spacing so
  sacred ratios remain readable without animation (why: respects covenant).
*/

const DEFAULT_NUM = Object.freeze({
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
});

const FALLBACK_PALETTE = Object.freeze({
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
});

const FALLBACK_GEOMETRY = {
  vesica: {
    rows: DEFAULT_NUM.NINE,
    columns: DEFAULT_NUM.ELEVEN,
    paddingDivisor: DEFAULT_NUM.ELEVEN,
    radiusFactor: DEFAULT_NUM.SEVEN / DEFAULT_NUM.THREE,
    strokeDivisor: DEFAULT_NUM.NINETYNINE,
    alpha: 0.55
  },
  treeOfLife: {
    marginDivisor: DEFAULT_NUM.ELEVEN,
    radiusDivisor: DEFAULT_NUM.THIRTYTHREE,
    labelOffset: -DEFAULT_NUM.TWENTYTWO,
    labelLineHeight: 14,
    labelFont: "12px system-ui, -apple-system, Segoe UI, sans-serif",
    nodes: [
      { id: "kether", title: "Kether", meaning: "Crown", level: 0, xFactor: 0.5 },
      { id: "chokmah", title: "Chokmah", meaning: "Wisdom", level: 1, xFactor: 0.72 },
      { id: "binah", title: "Binah", meaning: "Understanding", level: 1, xFactor: 0.28 },
      { id: "chesed", title: "Chesed", meaning: "Mercy", level: 2, xFactor: 0.68 },
      { id: "geburah", title: "Geburah", meaning: "Severity", level: 2, xFactor: 0.32 },
      { id: "tiphareth", title: "Tiphareth", meaning: "Beauty", level: 3, xFactor: 0.5 },
      { id: "netzach", title: "Netzach", meaning: "Victory", level: 4, xFactor: 0.7 },
      { id: "hod", title: "Hod", meaning: "Glory", level: 4, xFactor: 0.3 },
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
    sampleCount: DEFAULT_NUM.ONEFORTYFOUR,
    turns: DEFAULT_NUM.THREE,
    baseRadiusDivisor: DEFAULT_NUM.THREE,
    phi: 1.618033988749895,
    alpha: 0.88
  },
  helix: {
    sampleCount: DEFAULT_NUM.ONEFORTYFOUR,
    cycles: DEFAULT_NUM.THREE,
    amplitudeDivisor: DEFAULT_NUM.THREE,
    phaseOffset: 180,
    crossTieCount: DEFAULT_NUM.THIRTYTHREE,
    strandAlpha: 0.82,
    rungAlpha: 0.65
  }
};

/**
 * Render a four-layer static "cosmic helix" onto a 2D canvas context.
 *
 * Validates the provided drawing context and dimensions, normalizes palette,
 * numerology, and geometry options, then paints four layers (vesica field,
 * Tree-of-Life scaffold, Fibonacci curve, and double-helix lattice) in back-to-front
 * order. Optionally renders a short notice string. The function does not mutate
 * the provided canvas transform or state (it saves/restores the context).
 *
 * @param {CanvasRenderingContext2D} ctx - A 2D canvas rendering context (must have a `.canvas`).
 * @param {Object} [options] - Rendering options.
 * @param {number} [options.width] - Width to render; defaults to `ctx.canvas.width`.
 * @param {number} [options.height] - Height to render; defaults to `ctx.canvas.height`.
 * @param {Object} [options.palette] - Optional palette object (normalized internally).
 * @param {Object} [options.NUM] - Optional numerology constants (normalized internally).
 * @param {Object} [options.geometry] - Optional geometry overrides (normalized internally).
 * @param {string} [options.notice] - Optional short notice string to draw near the bottom-left.
 * @return {{ok: true, numerology: Object}|{ok: false, reason: string}} Returns `{ ok: true, numerology }` on success.
 * On failure returns `{ ok: false, reason }` where `reason` is `"missing-context"` when `ctx` is invalid
 * or `"invalid-dimensions"` when width/height are not positive finite numbers.
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

  // Layered sequencing preserves depth without motion (why: ND-safe covenant).
  drawVesicaField(ctx, width, height, palette.layers[0], numerology, geometry.vesica);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], palette.ink, numerology, geometry.treeOfLife);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], numerology, geometry.fibonacci);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], numerology, geometry.helix);

  if (notice) {
    drawNotice(ctx, width, height, palette.ink, notice);
  }

  ctx.restore();
  return { ok: true, numerology };
}

/**
 * Normalize a candidate palette into a safe palette object suitable for rendering.
 *
 * If `input` is not an object, returns a shallow clone of FALLBACK_PALETTE.
 * Otherwise returns an object with string properties `bg`, `ink`, `muted`
 * and a `layers` array whose length matches FALLBACK_PALETTE.layers. For each
 * layer index, a string value from `input.layers` is used when valid; otherwise
 * the corresponding fallback layer color is substituted.
 *
 * @param {Object} [input] - Candidate palette (may contain `bg`, `ink`, `muted`, `layers`).
 * @return {{bg: string, ink: string, muted: string, layers: string[]}} Normalized palette.
 */
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

/**
 * Create a shallow clone of a palette object, copying the layers array.
 *
 * Returns a new object with the same bg, ink, and muted values and a new
 * layers array (shallow copy) so the returned palette can be modified
 * without mutating the original's layers array.
 *
 * @param {Object} palette - Source palette with properties `bg`, `ink`, `muted`, and `layers`.
 * @return {{bg: string, ink: string, muted: string, layers: Array<string>}} The cloned palette.
 */
function clonePalette(palette) {
  return {
    bg: palette.bg,
    ink: palette.ink,
    muted: palette.muted,
    layers: palette.layers.slice()
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

/**
 * Normalize and sanitize a Tree-of-Life geometry object for rendering.
 *
 * Accepts a possibly partial or invalid `data` object and returns a safe, well-typed
 * tree configuration using FALLBACK_GEOMETRY.treeOfLife values where inputs are missing
 * or invalid. Node templates are merged with fallback templates (preserving node order),
 * numeric fields are coerced/validated (levels -> finiteNumber, xFactor -> clamped [0,1]),
 * and edges are filtered to include only two-item pairs that reference existing node IDs.
 *
 * @param {Object} data - Candidate tree configuration (may be partial or malformed).
 * @return {Object} A normalized tree object with properties:
 *   - marginDivisor {number}
 *   - radiusDivisor {number}
 *   - labelOffset {number}
 *   - labelLineHeight {number}
 *   - labelFont {string}
 *   - nodes {Array<Object>} Array of sanitized node objects { id, title, meaning, level, xFactor }
 *   - edges {Array<[string,string]>} Array of valid edges referencing node ids
 */
function normaliseTree(data) {
  const fallback = FALLBACK_GEOMETRY.treeOfLife;
  const safe = data && typeof data === "object" ? data : {};
  const fallbackNodes = fallback.nodes;
  const providedNodes = Array.isArray(safe.nodes) && safe.nodes.length > 0 ? safe.nodes : fallbackNodes;
  const nodes = fallbackNodes.map((template, index) => {
    const candidate = typeof providedNodes[index] === "object" && providedNodes[index] !== null ? providedNodes[index] : {};
    const base = fallbackNodes[index % fallbackNodes.length];
    return {
      id: typeof candidate.id === "string" && candidate.id ? candidate.id : base.id,
      title: typeof candidate.title === "string" && candidate.title ? candidate.title : base.title,
      meaning: typeof candidate.meaning === "string" ? candidate.meaning : base.meaning,
      level: finiteNumber(candidate.level, base.level),
      xFactor: clamp01(finiteNumber(candidate.xFactor, base.xFactor))
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
    labelLineHeight: positiveNumber(safe.labelLineHeight, fallback.labelLineHeight),
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
 * Render a staggered grid of stroked circles ("vesica" field) across the canvas.
 *
 * Draws a padded, rectangular lattice of evenly spaced stroked circles. Rows can be horizontally offset
 * (every other row is shifted by half a column) to produce a staggered pattern. Vertical placement is
 * slightly compressed by a numerology-derived ratio (uses N.NINE and N.SEVEN). Circles whose centers
 * fall outside the padded drawing area (considering radius) are skipped.
 *
 * The function saves and restores the canvas context state; it does not return a value.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context to draw into.
 * @param {number} width - Full drawing width (pixels).
 * @param {number} height - Full drawing height (pixels).
 * @param {string} color - Base stroke color (hex string accepted); alpha from settings is applied.
 * @param {Object} N - Numerology constants object (expects numeric properties like NINE and SEVEN).
 * @param {Object} settings - Geometry settings:
 *   - rows {number} number of rows (min 2)
 *   - columns {number} number of columns (min 2)
 *   - paddingDivisor {number} divisor to compute padding from min(width,height)
 *   - radiusFactor {number} factor to derive circle radius from grid step
 *   - strokeDivisor {number} divisor to compute stroke width from min(width,height)
 *   - alpha {number} stroke alpha (0..1)
 */
function drawVesicaField(ctx, width, height, color, N, settings) {
  const rows = Math.max(2, settings.rows);
  const columns = Math.max(2, settings.columns);
  const padding = Math.min(width, height) / settings.paddingDivisor;
  const horizontalSpan = width - padding * 2;
  const verticalSpan = height - padding * 2;
  const stepX = columns > 1 ? horizontalSpan / (columns - 1) : 0;
  const stepY = rows > 1 ? verticalSpan / (rows - 1) : 0;
  const radius = Math.min(stepX, stepY) / settings.radiusFactor;
  const strokeWidth = Math.max(1, Math.min(width, height) / settings.strokeDivisor);

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let row = 0; row < rows; row += 1) {
    const ratioY = rows > 1 ? row / (rows - 1) : 0;
    const y = padding + Math.min(1, ratioY * (N.NINE / N.SEVEN)) * verticalSpan;
    const offset = row % 2 === 0 ? 0 : stepX / 2;

    for (let column = 0; column < columns; column += 1) {
      const ratioX = columns > 1 ? column / (columns - 1) : 0;
      const x = padding + offset + ratioX * horizontalSpan;
      if (x < padding - radius || x > width - padding + radius) {
        continue;
      }
      strokeCircle(ctx, x, y, radius);
    }
  }

  ctx.restore();
}

/**
 * Render the Tree-of-Life layer: connective edges, nodes, and labels onto the canvas context.
 *
 * Draws edges first (semi-transparent stroked lines), then node discs with outlines, then centered labels
 * (title and optional meaning) below each node. Positions are computed from `tree` layout parameters:
 * margins, node `level` (vertical spacing), and node `xFactor` (horizontal position as a 0..1 factor).
 *
 * `tree` shape (required): an object with the following properties used by this renderer:
 * - marginDivisor: number — divisor of min(width,height) to compute outer margin.
 * - radiusDivisor: number — divisor of min(width,height) to compute node radius.
 * - labelOffset: number — vertical offset in pixels from node center to first label line.
 * - labelLineHeight: number — vertical spacing between label lines.
 * - labelFont: string — CSS font used for label text.
 * - nodes: array of node objects, each with:
 *     - id: string — unique identifier.
 *     - title: string — primary label text.
 *     - meaning?: string — optional second-line label.
 *     - level: number — integer level (0..N) used to compute vertical placement.
 *     - xFactor: number — horizontal placement factor clamped to [0,1].
 * - edges: array of [fromId, toId] pairs. Edges referencing missing node ids are ignored.
 *
 * Side effects: issues drawing commands on the provided 2D canvas rendering context. No return value.
 */
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, labelColor, N, tree) {
  const margin = Math.min(width, height) / tree.marginDivisor;
  const top = margin;
  const bottom = height - margin;
  const verticalSpan = bottom - top;
  const maxLevel = tree.nodes.reduce((acc, node) => Math.max(acc, node.level), 0);
  const levelStep = maxLevel > 0 ? verticalSpan / maxLevel : 0;
  const radius = Math.max(4, Math.min(width, height) / tree.radiusDivisor);
  const lineWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  const positions = new Map();
  tree.nodes.forEach((node) => {
    const x = margin + clamp01(node.xFactor) * (width - margin * 2);
    const y = top + node.level * levelStep;
    positions.set(node.id, { x, y, node });
  });

  // Calm connective lines first so nodes remain readable (why: layered depth).
  ctx.save();
  ctx.strokeStyle = colorWithAlpha(pathColor, 0.75);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  tree.edges.forEach((edge) => {
    const start = positions.get(edge[0]);
    const end = positions.get(edge[1]);
    if (!start || !end) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });
  ctx.restore();

  ctx.save();
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = colorWithAlpha(nodeColor, 0.9);
  ctx.lineWidth = Math.max(1, lineWidth * 0.75);
  positions.forEach((entry) => {
    ctx.beginPath();
    ctx.arc(entry.x, entry.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();

  ctx.save();
  ctx.fillStyle = labelColor;
  ctx.font = tree.labelFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const lineHeight = tree.labelLineHeight;
  positions.forEach((entry) => {
    const baseY = entry.y + tree.labelOffset;
    ctx.fillText(entry.node.title, entry.x, baseY);
    if (entry.node.meaning) {
      ctx.fillText(entry.node.meaning, entry.x, baseY + lineHeight);
    }
  });
  ctx.restore();
}

/**
 * Draws a Fibonacci-style spiral curve onto the canvas context.
 *
 * The function samples points along an exponential (phi-based) polar spiral and renders
 * a stroked polyline using the provided color and settings. If `settings.turns` is zero
 * the function exits without drawing.
 *
 * @param {object} N - Numerology constants (object with numeric keys such as TWENTYTWO, ELEVEN, NINETYNINE) used for positioning and scale offsets.
 * @param {object} settings - Geometry and sampling controls:
 *   - {number} sampleCount: number of points to sample along the curve (minimum 2).
 *   - {number} turns: number of full revolutions; if 0 the function does nothing.
 *   - {number} baseRadiusDivisor: divisor used to compute maximum radius from canvas size.
 *   - {number} phi: growth base (golden-ratio-like factor) controlling exponential radius growth.
 *   - {number} alpha: stroke alpha applied to the provided color.
 */
function drawFibonacciCurve(ctx, width, height, color, N, settings) {
  const sampleCount = Math.max(2, settings.sampleCount);
  const turns = Math.max(0, settings.turns);
  if (turns === 0) {
    return;
  }
  const phi = Math.max(1.0001, settings.phi);
  const totalAngle = turns * Math.PI * 2;
  const maxRadius = Math.min(width, height) / settings.baseRadiusDivisor;
  const growth = Math.pow(phi, turns);
  const baseRadius = maxRadius / growth;
  const centerX = width / 2 + width / N.TWENTYTWO;
  const centerY = height / 2 - height / N.ELEVEN;
  const lineWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  for (let index = 0; index < sampleCount; index += 1) {
    const t = sampleCount > 1 ? index / (sampleCount - 1) : 0;
    const angle = t * totalAngle;
    const radius = baseRadius * Math.pow(phi, t * turns);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
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
 * Draws a double-helix lattice: two sinusoidal strands across the canvas and cross-ties between them.
 *
 * The function computes two x-monotone polylines (strands) sampled from left to right using
 * `settings.sampleCount`, `settings.cycles` and `settings.phaseOffset`. Strand geometry is scaled
 * by `settings.amplitudeDivisor` and constrained to the canvas height; strands are stroked using
 * `strandColor` with `settings.strandAlpha`. A configurable number of cross-ties (`settings.crossTieCount`)
 * are drawn between corresponding sample points using `rungColor` and `settings.rungAlpha`.
 *
 * @param {string} strandColor - CSS color for the helix strands (hex or any valid canvas color string).
 * @param {string} rungColor - CSS color for the cross-ties between strands.
 * @param {object} settings - Helix drawing parameters:
 *   - {number} sampleCount: number of samples per strand (min 2).
 *   - {number} cycles: number of full sine cycles across the span.
 *   - {number} amplitudeDivisor: divisor used to compute vertical amplitude from canvas height.
 *   - {number} phaseOffset: phase offset between the two strands in degrees.
 *   - {number} crossTieCount: number of cross-ties (rungs) to draw.
 *   - {number} strandAlpha: stroke alpha for the strands (0..1).
 *   - {number} rungAlpha: stroke alpha for the rungs (0..1).
 */
function drawHelixLattice(ctx, width, height, strandColor, rungColor, N, settings) {
  const sampleCount = Math.max(2, settings.sampleCount);
  const cycles = Math.max(0, settings.cycles);
  const marginX = width / N.ELEVEN;
  const startX = marginX;
  const endX = width - marginX;
  const amplitude = Math.min(height / settings.amplitudeDivisor, height / N.THREE);
  const baseline = height / 2;
  const totalAngle = cycles * Math.PI * 2;
  const phase = (settings.phaseOffset * Math.PI) / 180;
  const strandWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < sampleCount; index += 1) {
    const t = sampleCount > 1 ? index / (sampleCount - 1) : 0;
    const x = startX + t * (endX - startX);
    const angle = t * totalAngle;
    const yA = baseline + Math.sin(angle) * amplitude;
    const yB = baseline + Math.sin(angle + phase) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(strandColor, settings.strandAlpha);
  ctx.lineWidth = strandWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  drawPolyline(ctx, strandA);
  drawPolyline(ctx, strandB);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(rungColor, settings.rungAlpha);
  ctx.lineWidth = Math.max(1, strandWidth * 0.85);
  ctx.lineCap = "round";
  const rungCount = Math.max(1, settings.crossTieCount);
  for (let rung = 0; rung < rungCount; rung += 1) {
    const t = rungCount > 1 ? rung / (rungCount - 1) : 0;
    const index = Math.floor(t * (strandA.length - 1));
    const start = strandA[index];
    const end = strandB[index];
    if (!start || !end) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
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

/**
 * Stroke a circle at the given center using the current stroke style.
 *
 * Uses the canvas context's current strokeStyle, lineWidth, and lineJoin settings.
 *
 * @param {CanvasRenderingContext2D} ctx - Rendering context with a valid canvas.
 * @param {number} cx - X coordinate of the circle center.
 * @param {number} cy - Y coordinate of the circle center.
 * @param {number} radius - Circle radius (expected non-negative).
 */
function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Stroke a polyline connecting an ordered list of points on the given 2D canvas context.
 *
 * Does nothing when `points` is not a non-empty array. The function issues a single
 * stroked path (beginPath/moveTo/lineTo/stroke) — the context's current stroke style,
 * lineWidth, lineJoin, and lineCap are used.
 *
 * @param {Array<{x: number, y: number}>} points - Ordered vertices of the polyline; each item must have numeric `x` and `y`.
 */
function drawPolyline(ctx, points) {
  if (!Array.isArray(points) || points.length === 0) {
    return;
  }
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
}

/**
 * Coerce a value to a finite Number, falling back to a provided alternative.
 *
 * Converts `value` using `Number(value)` and returns it if it's finite; otherwise
 * returns `Number(fallback)`. Note that the fallback is coerced with `Number`
 * as well (so if `fallback` is not a finite numeric representation, the result
 * may be `NaN`).
 *
 * @param {*} value - Candidate to convert to a number.
 * @param {*} fallback - Returned (after `Number(...)` coercion) when `value` is not finite.
 * @returns {number} A finite numeric conversion of `value`, or the numeric coercion of `fallback`.
 */
function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number(fallback);
}

/**
 * Convert a value to a finite positive number, or return a fallback.
 *
 * Attempts to coerce `value` to a Number and returns it if it is finite and greater than 0;
 * otherwise returns `fallback`.
 *
 * @param {*} value - The value to coerce to a number.
 * @param {number} fallback - The value to return when `value` is not a finite positive number.
 * @return {number} The coerced positive number or the provided fallback.
 */
function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Coerce a value to a positive integer by numeric conversion and rounding; if the result is not a positive integer, return the provided fallback.
 * @param {*} value - Input to convert (will be Number(value) then Math.round).
 * @param {number} fallback - Returned when conversion fails to produce an integer > 0.
 * @return {number} The rounded positive integer or the fallback.
 */
function positiveInteger(value, fallback) {
  const parsed = Number(value);
  const rounded = Math.round(parsed);
  return Number.isInteger(rounded) && rounded > 0 ? rounded : fallback;
}

/**
 * Convert a value to a finite number, falling back when conversion yields non-finite.
 *
 * Attempts to coerce `value` with `Number(value)` and returns the result if it's finite;
 * otherwise returns `fallback` unchanged.
 *
 * @param {*} value - The input to convert to a number.
 * @param {number} fallback - Value returned when `value` cannot be converted to a finite number.
 * @return {number} The finite numeric conversion of `value`, or `fallback` if conversion is not finite.
 */
function finiteNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Clamp a numeric input to the range [0, 1]; non-finite inputs become 0.
 * @param {*} value - Value to coerce to a number and clamp. Non-finite or non-numeric inputs evaluate to 0.
 * @returns {number} A number in the closed interval [0, 1].
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
 * Clamp a numeric value to the [0,1] range, returning a fallback when the input cannot be parsed as a finite number.
 *
 * @param {*} value - Value to coerce to a Number and clamp.
 * @param {number} fallback - Value returned when `value` is not a finite number.
 * @return {number} The parsed value clamped to [0, 1], or `fallback` if parsing produced a non-finite number.
 */
function clampAlpha(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
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
 * Convert a 6-digit hex color to an `rgba(...)` string with the specified alpha.
 *
 * Accepts a hex string with or without a leading `#`. If the input is not a valid
 * 6-hex-digit string, returns white with the clamped alpha as a safe fallback.
 *
 * @param {string} hex - A 6-digit hex color (e.g. "#ff7700" or "ff7700").
 * @param {number} alpha - Alpha value; will be clamped to the range [0, 1].
 * @return {string} An `rgba(r,g,b,a)` CSS color string.
 */
function colorWithAlpha(hex, alpha) {
  const value = typeof hex === "string" ? hex.trim() : "";
  const stripped = value.startsWith("#") ? value.slice(1) : value;
  if (stripped.length !== 6) {
    const safeAlpha = clamp01(alpha);
    return `rgba(255,255,255,${safeAlpha})`;
  }
  const r = parseInt(stripped.slice(0, 2), 16);
  const g = parseInt(stripped.slice(2, 4), 16);
  const b = parseInt(stripped.slice(4, 6), 16);
  const safeAlpha = clamp01(alpha);
  return `rgba(${r},${g},${b},${safeAlpha})`;
}
