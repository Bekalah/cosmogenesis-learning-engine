/*
  helix-renderer.mjs
  Offline ND-safe renderer for the Cosmic Helix canvas.

  Layer order (back to front):
    1) Vesica field - intersecting circles grounding the vesica piscis grid.
    2) Tree-of-Life scaffold - ten sephirot nodes with twenty-two calm paths.
    3) Fibonacci curve - static logarithmic spiral sampled from the Fibonacci family.
    4) Double-helix lattice - two phase-shifted strands tied by gentle rungs.

  Why this structure:
    - Zero animation: everything renders in one pass to preserve ND-safe pacing.
    - Layer separation keeps sacred geometry three-dimensional instead of flattened.
    - Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) shape spacing and sampling.
    - Pure helper functions keep the module portable for offline review.
*/

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"],
};

const DEFAULT_NUMBERS = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144,
};

const DEFAULT_GEOMETRY = {
  vesica: {
    rows: 9,
    columns: 11,
    paddingDivisor: 11,
    radiusFactor: 1.5,
    strokeDivisor: 99,
    alpha: 0.6,
  },
  treeOfLife: {
    marginDivisor: 11,
    radiusDivisor: 22,
    labelOffset: -24,
    labelFont: "13px system-ui, -apple-system, Segoe UI, sans-serif",
    nodes: [
      { id: "kether", title: "Kether", level: 0, xFactor: 0.5 },
      { id: "chokmah", title: "Chokmah", level: 1, xFactor: 0.7 },
      { id: "binah", title: "Binah", level: 1, xFactor: 0.3 },
      { id: "chesed", title: "Chesed", level: 2, xFactor: 0.68 },
      { id: "geburah", title: "Geburah", level: 2, xFactor: 0.32 },
      { id: "tiphareth", title: "Tiphareth", level: 3, xFactor: 0.5 },
      { id: "netzach", title: "Netzach", level: 4, xFactor: 0.66 },
      { id: "hod", title: "Hod", level: 4, xFactor: 0.34 },
      { id: "yesod", title: "Yesod", level: 5, xFactor: 0.5 },
      { id: "malkuth", title: "Malkuth", level: 6, xFactor: 0.5 },
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
      ["yesod", "malkuth"],
    ],
  },
  fibonacci: {
    sampleCount: 144,
    turns: 3,
    baseRadiusDivisor: 3,
    phi: 1.618033988749895,
    alpha: 0.85,
  },
  helix: {
    sampleCount: 144,
    cycles: 3,
    amplitudeDivisor: 3,
    phaseOffset: 180,
    crossTieCount: 33,
    strandAlpha: 0.85,
    rungAlpha: 0.6,
  },
};

/**
 * Render the Cosmic Helix composition onto a Canvas 2D context in a single offline pass.
 *
 * Validates the provided drawing context, normalizes dimensions and configuration by
 * merging supplied palettes, numeric constants, and geometry with safe defaults, then
 * renders four layered visuals (vesica field, Tree of Life, Fibonacci curve, helix lattice)
 * back-to-front. Optionally draws a bottom-centered notice string. Returns a short
 * summary of what was rendered.
 *
 * Note: this function draws directly to the provided canvas context.
 *
 * @param {Object} [options] - Optional overrides and metadata.
 * @param {Object} [options.palette] - Partial palette to merge with defaults (bg, ink, muted, layers).
 * @param {Object} [options.NUM] - Numeric overrides merged against default numbers.
 * @param {Object} [options.geometry] - Per-layer geometry overrides (vesica, treeOfLife, fibonacci, helix).
 * @param {string} [options.notice] - Optional notice text to render at the bottom of the canvas.
 * @return {{ok: false, reason: string}|{ok: true, summary: string}} If the drawing context is missing returns
 *         { ok: false, reason: "missing-context" }. On success returns { ok: true, summary } where
 *         summary is a human-readable synopsis of rendered layer statistics.
 */
export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    return { ok: false, reason: "missing-context" };
  }

  const dims = normaliseDimensions(ctx, options);
  const palette = mergePalette(options.palette);
  const numbers = mergeNumbers(options.NUM);
  const geometry = mergeGeometry(options.geometry);
  const notice =
    typeof options.notice === "string" && options.notice.trim()
      ? options.notice.trim()
      : "";

  ctx.save();
  clearStage(ctx, dims, palette.bg);

  const vesicaStats = drawVesicaField(
    ctx,
    dims,
    palette.layers[0],
    numbers,
    geometry.vesica,
  );
  const treeStats = drawTreeOfLife(
    ctx,
    dims,
    palette,
    numbers,
    geometry.treeOfLife,
  );
  const fibonacciStats = drawFibonacciCurve(
    ctx,
    dims,
    palette.layers[3],
    numbers,
    geometry.fibonacci,
  );
  const helixStats = drawHelixLattice(
    ctx,
    dims,
    palette,
    numbers,
    geometry.helix,
  );

  if (notice) {
    drawCanvasNotice(ctx, dims, palette.ink, notice);
  }

  ctx.restore();

  return {
    ok: true,
    summary: summariseLayers({
      vesicaStats,
      treeStats,
      fibonacciStats,
      helixStats,
    }),
  };
}

/**
 * Return safe, positive drawing dimensions for the canvas.
 *
 * Uses options.width and options.height when they are finite positive numbers;
 * otherwise falls back to ctx.canvas.width and ctx.canvas.height.
 *
 * @param {Object} options - Optional overrides for dimensions.
 * @param {number} [options.width] - Preferred width; ignored if not a finite positive number.
 * @param {number} [options.height] - Preferred height; ignored if not a finite positive number.
 * @return {{width: number, height: number}} Normalized positive width and height suitable for drawing.
 */
function normaliseDimensions(ctx, options) {
  const width = toPositiveNumber(options.width, ctx.canvas.width);
  const height = toPositiveNumber(options.height, ctx.canvas.height);
  return { width, height };
}

/**
 * Merge a partial palette with DEFAULT_PALETTE, producing a complete palette object.
 *
 * If the candidate provides string values for `bg`, `ink`, or `muted`, those are used;
 * otherwise the corresponding DEFAULT_PALETTE values are returned. The `layers` array
 * is cloned up to the default length; missing entries are filled from DEFAULT_PALETTE.
 *
 * @param {Object} [candidate={}] - Partial palette to merge.
 * @param {string} [candidate.bg] - Background color (hex or CSS color string).
 * @param {string} [candidate.ink] - Primary ink color.
 * @param {string} [candidate.muted] - Muted/secondary color.
 * @param {string[]} [candidate.layers] - Array of layer colors; values beyond the default length are ignored.
 * @return {{bg: string, ink: string, muted: string, layers: string[]}} A complete palette object suitable for rendering.
 */
function mergePalette(candidate = {}) {
  const layers = Array.isArray(candidate.layers)
    ? candidate.layers.slice(0, DEFAULT_PALETTE.layers.length)
    : [];
  while (layers.length < DEFAULT_PALETTE.layers.length) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }
  return {
    bg: typeof candidate.bg === "string" ? candidate.bg : DEFAULT_PALETTE.bg,
    ink:
      typeof candidate.ink === "string" ? candidate.ink : DEFAULT_PALETTE.ink,
    muted:
      typeof candidate.muted === "string"
        ? candidate.muted
        : DEFAULT_PALETTE.muted,
    layers,
  };
}

/**
 * Merge a partial numbers config into the default numeric settings.
 *
 * Produces a new object based on DEFAULT_NUMBERS where any keys present in
 * `candidate` replace the defaults only if the provided value is a finite
 * number greater than zero. Non-numeric, non-finite, zero or negative values
 * in `candidate` are ignored and the default is preserved.
 *
 * @param {Object<string, number>} [candidate={}] - Partial numeric overrides.
 * @returns {Object<string, number>} A new numbers object with validated overrides applied.
 */
function mergeNumbers(candidate = {}) {
  const merged = { ...DEFAULT_NUMBERS };
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    const value = candidate[key];
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      merged[key] = value;
    }
  }
  return merged;
}

/**
 * Merge a partial geometry configuration with defaults for all render layers.
 *
 * Accepts an optional partial `candidate` object and returns a fully populated
 * geometry spec containing the four layer configurations: `vesica`, `treeOfLife`,
 * `fibonacci`, and `helix`. Each sub-object is validated and merged by its
 * respective helper (e.g., `mergeVesica`, `mergeTree`, `mergeFibonacci`,
 * `mergeHelix`) so callers receive safe, ready-to-use geometry settings.
 *
 * @param {Object} [candidate={}] - Partial geometry overrides; may include any subset of
 *   `vesica`, `treeOfLife`, `fibonacci`, and `helix` objects. Missing sections are filled
 *   with defaults.
 * @return {Object} A merged geometry object with keys: `vesica`, `treeOfLife`, `fibonacci`, and `helix`.
 */
function mergeGeometry(candidate = {}) {
  return {
    vesica: mergeVesica(candidate.vesica),
    treeOfLife: mergeTree(candidate.treeOfLife),
    fibonacci: mergeFibonacci(candidate.fibonacci),
    helix: mergeHelix(candidate.helix),
  };
}

/**
 * Merge and sanitize vesica geometry settings with defaults.
 *
 * Accepts a partial vesica config and returns a fully populated, validated
 * settings object where numeric fields are coerced to positive numbers/integers
 * and alpha is clamped to a valid opacity value.
 *
 * @param {Object} [config={}] - Partial vesica configuration.
 * @param {number} [config.rows] - Number of grid rows (coerced to a positive integer).
 * @param {number} [config.columns] - Number of grid columns (coerced to a positive integer).
 * @param {number} [config.paddingDivisor] - Divisor controlling padding around the grid (positive number).
 * @param {number} [config.radiusFactor] - Multiplier applied to compute vesica circle radius (positive number).
 * @param {number} [config.strokeDivisor] - Divisor used to derive stroke width from radius (positive number).
 * @param {number} [config.alpha] - Opacity for vesica strokes (clamped to [0,1]; 0 preserved).
 * @returns {Object} A sanitized vesica geometry object with keys:
 *  - rows {number}
 *  - columns {number}
 *  - paddingDivisor {number}
 *  - radiusFactor {number}
 *  - strokeDivisor {number}
 *  - alpha {number}
 */
function mergeVesica(config = {}) {
  const base = DEFAULT_GEOMETRY.vesica;
  return {
    rows: toPositiveInteger(config.rows, base.rows),
    columns: toPositiveInteger(config.columns, base.columns),
    paddingDivisor: toPositiveNumber(
      config.paddingDivisor,
      base.paddingDivisor,
    ),
    radiusFactor: toPositiveNumber(config.radiusFactor, base.radiusFactor),
    strokeDivisor: toPositiveNumber(config.strokeDivisor, base.strokeDivisor),
    alpha: clampAlpha(config.alpha, base.alpha),
  };
}

/**
 * Merge and sanitize Tree-of-Life geometry configuration, returning a complete, safe structure.
 *
 * Produces a validated tree-of-life geometry object by applying defaults for missing values,
 * sanitizing node entries (ensuring each node has a stable id, title, numeric level, and an
 * xFactor clamped to [0,1]), and filtering edges so they reference existing node ids. If no
 * nodes or edges are supplied, the defaults are used. Other numeric layout values are coerced
 * to positive numbers or fall back to defaults.
 *
 * @param {Object} [config={}] - Partial geometry overrides.
 * @param {Array<Object>} [config.nodes] - Optional array of node overrides; each node may provide
 *   {id, title, level, xFactor}. Missing or invalid fields are replaced from defaults.
 * @param {Array<Array<string>>} [config.edges] - Optional array of edges as two-element id pairs.
 *   Edges referencing unknown node ids are dropped.
 * @param {number} [config.marginDivisor] - Optional positive number to override margin divisor.
 * @param {number} [config.radiusDivisor] - Optional positive number to override node radius divisor.
 * @param {number} [config.labelOffset] - Optional numeric label offset.
 * @param {string} [config.labelFont] - Optional font string for labels.
 * @return {Object} Sanitized tree geometry with keys:
 *   - marginDivisor {number}
 *   - radiusDivisor {number}
 *   - labelOffset {number}
 *   - labelFont {string}
 *   - nodes {Array<Object>} (each node: {id, title, level, xFactor})
 *   - edges {Array<Array<string>>} (filtered valid id pairs)
 */
function mergeTree(config = {}) {
  const base = DEFAULT_GEOMETRY.treeOfLife;
  const nodes =
    Array.isArray(config.nodes) && config.nodes.length > 0
      ? config.nodes
      : base.nodes;
  const safeNodes = nodes.map((node, index) => {
    const reference = base.nodes[index % base.nodes.length];
    const data = typeof node === "object" && node !== null ? node : {};
    return {
      id: typeof data.id === "string" && data.id ? data.id : reference.id,
      title:
        typeof data.title === "string" && data.title
          ? data.title
          : reference.title,
      level: Number.isFinite(data.level) ? data.level : reference.level,
      xFactor: clamp01(
        Number.isFinite(data.xFactor) ? data.xFactor : reference.xFactor,
      ),
    };
  });

  const nodeIds = new Set(safeNodes.map((node) => node.id));
  const edges =
    Array.isArray(config.edges) && config.edges.length > 0
      ? config.edges
      : base.edges;
  const safeEdges = edges
    .map((edge) => (Array.isArray(edge) ? edge.slice(0, 2) : []))
    .filter(
      (edge) =>
        edge.length === 2 && nodeIds.has(edge[0]) && nodeIds.has(edge[1]),
    );

  return {
    marginDivisor: toPositiveNumber(config.marginDivisor, base.marginDivisor),
    radiusDivisor: toPositiveNumber(config.radiusDivisor, base.radiusDivisor),
    labelOffset: Number.isFinite(config.labelOffset)
      ? config.labelOffset
      : base.labelOffset,
    labelFont:
      typeof config.labelFont === "string" && config.labelFont
        ? config.labelFont
        : base.labelFont,
    nodes: safeNodes,
    edges: safeEdges,
  };
}

/**
 * Merge and validate Fibonacci-curve geometry settings, filling missing values from DEFAULT_GEOMETRY.fibonacci.
 *
 * Accepts a partial config object and returns a fully populated, sanitized geometry object used to draw
 * the static Fibonacci/logarithmic spiral.
 *
 * @param {Object} [config] - Partial geometry overrides.
 * @param {number} [config.sampleCount] - Number of sample points along the curve; coerced to a positive integer.
 * @param {number} [config.turns] - Number of turns of the spiral; coerced to a positive number.
 * @param {number} [config.baseRadiusDivisor] - Divisor controlling the spiral's base radius; coerced to a positive number.
 * @param {number} [config.phi] - Growth constant (phi) for the logarithmic spiral; coerced to a positive number.
 * @param {number} [config.alpha] - Stroke alpha for the spiral; clamped to [0, 1] (zero preserved).
 * @return {{sampleCount: number, turns: number, baseRadiusDivisor: number, phi: number, alpha: number}} Sanitized Fibonacci geometry.
 */
function mergeFibonacci(config = {}) {
  const base = DEFAULT_GEOMETRY.fibonacci;
  return {
    sampleCount: toPositiveInteger(config.sampleCount, base.sampleCount),
    turns: toPositiveNumber(config.turns, base.turns),
    baseRadiusDivisor: toPositiveNumber(
      config.baseRadiusDivisor,
      base.baseRadiusDivisor,
    ),
    phi: toPositiveNumber(config.phi, base.phi),
    alpha: clampAlpha(config.alpha, base.alpha),
  };
}

/**
 * Merge user-supplied helix geometry settings with defaults, validating and clamping values.
 *
 * Produces a fully-populated helix geometry object suitable for rendering by applying
 * numeric validation and fallbacks to DEFAULT_GEOMETRY.helix.
 *
 * @param {Object} [config] - Partial helix configuration overrides.
 * @param {number} [config.sampleCount] - Number of samples per strand; coerced to a positive integer.
 * @param {number} [config.cycles] - Number of helix cycles; coerced to a positive number.
 * @param {number} [config.amplitudeDivisor] - Divisor controlling helix amplitude; coerced to a positive number.
 * @param {number} [config.phaseOffset] - Phase offset (radians); used only if finite, otherwise default is kept.
 * @param {number} [config.crossTieCount] - Number of cross-ties (rungs) between strands; coerced to a positive integer.
 * @param {number} [config.strandAlpha] - Alpha for strand strokes; clamped to [0,1] (0 preserved) with a default fallback.
 * @param {number} [config.rungAlpha] - Alpha for rung strokes; clamped to [0,1] (0 preserved) with a default fallback.
 * @return {Object} Merged helix geometry with keys: sampleCount, cycles, amplitudeDivisor, phaseOffset, crossTieCount, strandAlpha, rungAlpha.
 */
function mergeHelix(config = {}) {
  const base = DEFAULT_GEOMETRY.helix;
  return {
    sampleCount: toPositiveInteger(config.sampleCount, base.sampleCount),
    cycles: toPositiveNumber(config.cycles, base.cycles),
    amplitudeDivisor: toPositiveNumber(
      config.amplitudeDivisor,
      base.amplitudeDivisor,
    ),
    phaseOffset: Number.isFinite(config.phaseOffset)
      ? config.phaseOffset
      : base.phaseOffset,
    crossTieCount: toPositiveInteger(config.crossTieCount, base.crossTieCount),
    strandAlpha: clampAlpha(config.strandAlpha, base.strandAlpha),
    rungAlpha: clampAlpha(config.rungAlpha, base.rungAlpha),
  };
}

/**
 * Fill the canvas drawing area with a solid color.
 *
 * Uses the provided CanvasRenderingContext2D to fill a rectangle from (0,0)
 * to (dims.width, dims.height) with the given CSS color.
 *
 * @param {Object} dims - Object with numeric `width` and `height` (drawing area size).
 * @param {string} color - CSS color string to use as the fill style (e.g. '#000', 'rgba(0,0,0,0.5)').
 */
function clearStage(ctx, dims, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

/**
 * Render a grid of overlapping "vesica" circle pairs across the padded drawable area.
 *
 * Computes per-cell positions from dims and settings, derives a radius, horizontal pair offset,
 * and stroke width, then strokes two circles per grid cell. Returns the number of circles drawn
 * and the computed radius in pixels.
 *
 * @param {Object} dims - Normalized drawable dimensions: { width, height }.
 * @param {string} color - Base stroke color (hex or any canvas-acceptable color); alpha applied from settings.
 * @param {Object} numbers - Numeric constants used for layout (used to compute the pair offset).
 * @param {Object} settings - Vesica layout options:
 *   - rows {number} number of grid rows (>=1)
 *   - columns {number} number of grid columns (>=1)
 *   - paddingDivisor {number} divisor to compute outer padding from min(width,height)
 *   - radiusFactor {number} divisor applied to cell step to compute circle radius
 *   - strokeDivisor {number} divisor to compute stroke width from min(width,height)
 *   - alpha {number} stroke alpha (0–1)
 * @return {{circles: number, radius: number}} Total circles stroked and the radius (px) used for each circle.
 */
function drawVesicaField(ctx, dims, color, numbers, settings) {
  const rows = Math.max(1, settings.rows);
  const columns = Math.max(1, settings.columns);
  const padding = Math.min(dims.width, dims.height) / settings.paddingDivisor;
  const availableWidth = dims.width - padding * 2;
  const availableHeight = dims.height - padding * 2;
  const stepX = columns > 1 ? availableWidth / (columns - 1) : 0;
  const stepY = rows > 1 ? availableHeight / (rows - 1) : 0;
  const radius = Math.min(stepX, stepY) / settings.radiusFactor;
  const offset = radius * (numbers.ELEVEN / numbers.TWENTYTWO);
  const strokeWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / settings.strokeDivisor,
  );

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";

  let circles = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const cx = padding + column * stepX;
      const cy = padding + row * stepY;
      strokeVesicaPair(ctx, cx, cy, radius, offset);
      circles += 2;
    }
  }

  ctx.restore();
  return { circles, radius };
}

/**
 * Stroke two horizontally offset circles (a vesica pair) about a central anchor.
 *
 * Renders two full-circle arcs centered at (cx - offset, cy) and (cx + offset, cy)
 * and strokes them using the canvas context's current stroke style and line width.
 *
 * @param {number} cx - X coordinate of the pair's central anchor point.
 * @param {number} cy - Y coordinate of the pair's central anchor point.
 * @param {number} radius - Radius of each circle (expected > 0).
 * @param {number} offset - Horizontal distance from the anchor to each circle's center.
 */
function strokeVesicaPair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Render the Tree of Life scaffold (edges, node discs, and optional centered labels) onto a 2D canvas.
 *
 * Layout:
 * - Positions nodes inside an inner margin computed from dims and settings.marginDivisor.
 * - Node x-positions are determined by each node's `xFactor` (clamped to [0,1]); y-positions are derived from node `level`.
 * - Edges are stroked between sanitized node positions using a path width scaled by `numbers.NINETYNINE`.
 * - Nodes are drawn as filled circles with stroked outlines sized by settings.radiusDivisor.
 * - If settings.labelOffset and settings.labelFont are provided, node titles are drawn centered at a vertical offset.
 *
 * @param {Object} dims - Canvas dimensions with numeric `width` and `height`.
 * @param {Object} palette - Color palette (expects at least `layers` array and `ink`) used for strokes/fills.
 * @param {Object} numbers - Numeric constants (uses `numbers.NINETYNINE` to compute edge path width).
 * @param {Object} settings - Tree geometry and rendering options:
 *   - {Array<Object>} nodes - Array of nodes: each must include `id`, `title`, `level`, and `xFactor`.
 *   - {Array<[string,string]>} edges - Array of [fromId, toId] pairs; non-matching ids are skipped.
 *   - {number} marginDivisor - Divisor of the smaller canvas dimension to compute outer margin.
 *   - {number} radiusDivisor - Divisor of the smaller canvas dimension to compute node radius.
 *   - {number} labelOffset - Vertical offset for labels (0 disables labels).
 *   - {string} labelFont - CSS font string used when rendering labels.
 *
 * @returns {{nodes: number, paths: number}} Counts: number of positioned nodes and number of declared edges.
 */
function drawTreeOfLife(ctx, dims, palette, numbers, settings) {
  const margin = Math.min(dims.width, dims.height) / settings.marginDivisor;
  const usableWidth = dims.width - margin * 2;
  const usableHeight = dims.height - margin * 2;
  const radius = Math.max(
    4,
    Math.min(dims.width, dims.height) / settings.radiusDivisor,
  );
  const pathWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / numbers.NINETYNINE,
  );

  const maxLevel = settings.nodes.reduce(
    (acc, node) => Math.max(acc, node.level),
    0,
  );
  const levelStep = maxLevel > 0 ? usableHeight / maxLevel : 0;

  const positions = new Map();
  for (const node of settings.nodes) {
    const x = margin + clamp01(node.xFactor) * usableWidth;
    const y = margin + node.level * levelStep;
    positions.set(node.id, { x, y, node });
  }

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(palette.layers[1], 0.7);
  ctx.lineWidth = pathWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const [fromId, toId] of settings.edges) {
    const from = positions.get(fromId);
    const to = positions.get(toId);
    if (!from || !to) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, pathWidth * 0.75);
  for (const point of positions.values()) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  if (settings.labelOffset !== 0 && settings.labelFont) {
    ctx.save();
    ctx.fillStyle = palette.ink;
    ctx.font = settings.labelFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const point of positions.values()) {
      const labelY = point.y + settings.labelOffset;
      ctx.fillText(point.node.title, point.x, labelY);
    }
    ctx.restore();
  }

  return { nodes: positions.size, paths: settings.edges.length };
}

/**
 * Draws a static Fibonacci/logarithmic spiral as a stroked polyline on a 2D canvas.
 *
 * The spiral is sampled at `settings.sampleCount` points, centered at a fixed
 * offset (72% width, 28% height) and stroked using `color` combined with
 * `settings.alpha`. The growth per turn is controlled by `settings.phi`.
 *
 * @param {Object} dims - Canvas dimensions containing numeric `width` and `height`.
 * @param {string} color - Base hex color (e.g. "#rrggbb") used for the stroke; alpha is applied from `settings.alpha`.
 * @param {Object} numbers - Numeric constants used for scaling (e.g. line width divisor like NINETYNINE).
 * @param {Object} settings - Spiral settings:
 *   - {number} sampleCount - Number of sampled points along the spiral (minimum 2).
 *   - {number} turns - Number of full rotations.
 *   - {number} phi - Growth factor per turn (values < 1.0001 are clamped to 1.0001).
 *   - {number} baseRadiusDivisor - Divisor of min(width,height) to compute base radius.
 *   - {number} alpha - Stroke alpha in [0,1].
 * @return {{points: number}} Object with `points` equal to the number of sampled points drawn.
 */
function drawFibonacciCurve(ctx, dims, color, numbers, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const turns = settings.turns;
  const phi = Math.max(1.0001, settings.phi);
  const totalAngle = turns * Math.PI * 2;
  const baseRadius =
    Math.min(dims.width, dims.height) / settings.baseRadiusDivisor;
  const lineWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / numbers.NINETYNINE,
  );
  const centerX = dims.width * 0.72;
  const centerY = dims.height * 0.28;

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  for (let index = 0; index < samples; index += 1) {
    const t = samples > 1 ? index / (samples - 1) : 0;
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

  return { points: samples };
}

/**
 * Draws a static double-helix lattice: two phase-offset sinusoidal strands across the canvas with optional cross-ties.
 *
 * Samples two sinusoidal polylines horizontally across dims, strokes each strand using palette layer colors with
 * the provided strandAlpha, and draws a series of cross-ties (rungs) between corresponding sample points using
 * palette.ink with rungAlpha. Returns the actual number of rungs drawn.
 *
 * @param {{width:number,height:number}} dims - Normalized drawing dimensions.
 * @param {Object} palette - Color palette; expects palette.layers (array) and palette.ink.
 * @param {Object} numbers - Numeric constants used for sizing (e.g., ONEFORTYFOUR, THIRTYTHREE).
 * @param {Object} settings - Helix configuration:
 *   - {number} sampleCount - Number of sample points along each strand (minimum 2).
 *   - {number} cycles - Number of sinusoidal cycles across the horizontal span.
 *   - {number} amplitudeDivisor - Divisor of dims.height used to compute strand amplitude.
 *   - {number} phaseOffset - Phase offset between strands in degrees.
 *   - {number} crossTieCount - Desired number of cross-ties; actual rungs are clamped and computed from samples.
 *   - {number} strandAlpha - Alpha applied to strand stroke colors (0–1).
 *   - {number} rungAlpha - Alpha applied to cross-tie stroke color (0–1).
 * @return {{rungs:number}} The number of cross-ties actually drawn.
 */
function drawHelixLattice(ctx, dims, palette, numbers, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const cycles = settings.cycles;
  const amplitude = dims.height / settings.amplitudeDivisor;
  const phase = (settings.phaseOffset * Math.PI) / 180;
  const centerY = dims.height * 0.7;
  const marginX = dims.width / numbers.THIRTYTHREE;
  const spanX = dims.width - marginX * 2;
  const stepX = samples > 1 ? spanX / (samples - 1) : 0;
  const angleStep =
    cycles > 0 ? (Math.PI * 2 * cycles) / Math.max(1, samples - 1) : 0;

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < samples; index += 1) {
    const x = marginX + stepX * index;
    const angle = angleStep * index;
    const yA = centerY + Math.sin(angle) * amplitude;
    const yB = centerY + Math.sin(angle + phase) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.save();
  ctx.lineWidth = Math.max(
    1.2,
    Math.min(dims.width, dims.height) / numbers.ONEFORTYFOUR,
  );

  ctx.strokeStyle = colorWithAlpha(palette.layers[4], settings.strandAlpha);
  drawPolyline(ctx, strandA);

  ctx.strokeStyle = colorWithAlpha(palette.layers[5], settings.strandAlpha);
  drawPolyline(ctx, strandB);

  const rungCount = Math.max(1, settings.crossTieCount);
  const rungStep = Math.max(1, Math.floor(samples / rungCount));
  ctx.strokeStyle = colorWithAlpha(palette.ink, settings.rungAlpha);
  ctx.lineWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / numbers.ONEFORTYFOUR,
  );
  let drawn = 0;
  for (let index = 0; index < samples; index += rungStep) {
    const a = strandA[index];
    const b = strandB[index];
    if (!a || !b) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    drawn += 1;
  }

  ctx.restore();
  return { rungs: drawn };
}

/**
 * Stroke a polyline connecting an ordered sequence of 2D points.
 *
 * Draws straight segments between consecutive points in `points` on the provided 2D canvas context.
 * If `points` contains fewer than two coordinates the function is a no-op.
 *
 * @param {{x: number, y: number}[]} points - Ordered array of points defining the polyline.
 */
function drawPolyline(ctx, points) {
  if (points.length === 0) {
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

/**
 * Draw a short bottom-centered notice text on the canvas.
 *
 * Renders `message` centered along the bottom edge of the drawing area using a responsive
 * font size and a semi-opaque version of `color` (alpha = 0.9). The vertical inset (padding)
 * is computed from `dims` using DEFAULT_NUMBERS.THIRTYTHREE to keep spacing proportional to
 * canvas size. The function saves and restores the canvas state around the draw operation.
 *
 * @param {{width:number, height:number}} dims - Canvas drawable dimensions; must contain numeric `width` and `height`.
 * @param {string} color - Base CSS color (hex or other); rendered with alpha = 0.9.
 * @param {string} message - The text to draw, centered at the bottom of the canvas.
 */
function drawCanvasNotice(ctx, dims, color, message) {
  const padding =
    Math.min(dims.width, dims.height) / DEFAULT_NUMBERS.THIRTYTHREE;
  ctx.save();
  ctx.fillStyle = colorWithAlpha(color, 0.9);
  ctx.font = `${Math.max(14, dims.width / 72)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(message, dims.width / 2, dims.height - padding);
  ctx.restore();
}

/**
 * Build a concise, human-readable one-line summary of per-layer render counts.
 *
 * Returns a sentence describing vesica circles, Tree-of-Life paths/nodes,
 * Fibonacci spiral points, and helix rungs based on the provided stats.
 *
 * @param {Object} stats - Aggregated render statistics.
 * @param {Object} stats.vesicaStats - Vesica layer stats (expects `circles`).
 * @param {number} stats.vesicaStats.circles - Number of vesica circles drawn.
 * @param {Object} stats.treeStats - Tree-of-Life layer stats (expects `paths` and `nodes`).
 * @param {number} stats.treeStats.paths - Number of edges/paths drawn.
 * @param {number} stats.treeStats.nodes - Number of nodes drawn.
 * @param {Object} stats.fibonacciStats - Fibonacci/spiral layer stats (expects `points`).
 * @param {number} stats.fibonacciStats.points - Number of sampled spiral points drawn.
 * @param {Object} stats.helixStats - Helix lattice layer stats (expects `rungs`).
 * @param {number} stats.helixStats.rungs - Number of cross-tie rungs drawn.
 * @returns {string} One-line summary, e.g. "Layers rendered - 72 vesica circles; 9 paths / 10 nodes; 128 spiral points; 24 helix rungs."
 */
function summariseLayers(stats) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const tree = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  const helix = `${stats.helixStats.rungs} helix rungs`;
  return `Layers rendered - ${vesica}; ${tree}; ${fibonacci}; ${helix}.`;
}

/**
 * Convert a 6-digit hex color (with or without leading '#') to an `rgba(...)` CSS string, clamping alpha to [0,1].
 *
 * If `hex` is not a valid 6-hex-digit string, the function falls back to semi-transparent white (`rgba(255,255,255,alpha)`).
 *
 * @param {string} hex - Color in 6-digit hexadecimal form, e.g. `"#ff00aa"` or `"ff00aa"`.
 * @param {number} alpha - Desired alpha value; will be clamped to the [0,1] range.
 * @returns {string} An `rgba(r,g,b,a)` CSS color string.
 */
function colorWithAlpha(hex, alpha) {
  const normalized = typeof hex === "string" ? hex.trim() : "";
  const value = normalized.startsWith("#") ? normalized.slice(1) : normalized;
  const safeAlpha = clamp01(alpha);
  if (value.length !== 6) {
    return `rgba(255,255,255,${safeAlpha})`;
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${safeAlpha})`;
}

/**
 * Coerce a value to a finite positive number; otherwise return the numeric coercion of a fallback.
 * @param {*} value - Candidate to convert; accepted only if Number(value) is finite and > 0.
 * @param {*} fallback - Returned when `value` is invalid; converted with `Number(fallback)`.
 * @return {number} A finite positive number parsed from `value` or the result of `Number(fallback)` (may be NaN if `fallback` is not numeric).
 */
function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : Number(fallback);
}

/**
 * Convert a value to a finite positive integer (rounded); otherwise return the fallback.
 *
 * Attempts to coerce `value` to a Number, rounds it to the nearest integer, and returns it if finite and > 0.
 *
 * @param {*} value - The input to convert; any value coercible to a Number may be provided.
 * @param {number} fallback - Numeric fallback returned when `value` is non-finite or not a positive integer after rounding.
 * @return {number} A finite positive integer (rounded from `value`) or the numeric `fallback`.
 */
function toPositiveInteger(value, fallback) {
  const number = Number(value);
  const rounded = Math.round(number);
  return Number.isFinite(number) && rounded > 0 ? rounded : Number(fallback);
}

/**
 * Coerce a value to a Number and clamp it to the range [0, 1].
 *
 * Non-finite inputs (NaN, Infinity, -Infinity) and negatives return 0; values greater
 * than 1 return 1. Finite numbers within [0,1] are returned unchanged.
 *
 * @param {*} value - Input to convert and clamp.
 * @returns {number} A finite number between 0 and 1 inclusive.
 */
function clamp01(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }
  if (number < 0) {
    return 0;
  }
  if (number > 1) {
    return 1;
  }
  return number;
}

/**
 * Normalize an alpha-like value to the [0,1] range while preserving an explicit zero.
 *
 * Converts the input to a Number and returns it clamped to [0,1] when finite. If the
 * input is exactly 0, returns 0 (preserves intentional zero). If the input is not a
 * finite number, returns the provided fallback value.
 *
 * @param {*} value - Value to normalize; can be any type coercible to Number.
 * @param {number} fallback - Value returned when `value` is not a finite number.
 * @return {number} A number in [0,1] (or 0) when `value` is finite, otherwise `fallback`.
 */
function clampAlpha(value, fallback) {
  if (value === 0) {
    return 0;
  }
  const number = Number(value);
  if (Number.isFinite(number)) {
    return clamp01(number);
  }
  return fallback;
}
