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
 * Render a static, layered helix composition onto a 2D canvas context.
 *
 * Produces an offline (non-animated) rendering of four layered elements — vesica piscis field,
 * Tree of Life scaffold, Fibonacci spiral, and double-helix lattice — using configurable
 * palette, numeric constants, and geometry. The function clears the canvas, draws each layer
 * in sequence, optionally renders a centered notice, and returns a small summary of rendered
 * layer statistics.
 *
 * @param {CanvasRenderingContext2D} ctx - The 2D drawing context of the target canvas. Must be a valid context with a `.canvas` property.
 * @param {Object} [options] - Rendering options.
 * @param {Object} [options.palette] - Palette overrides (bg, ink, muted, layers array). Missing values are merged with defaults.
 * @param {Object} [options.NUM] - Numeric constants overrides (e.g., THREE, SEVEN, etc.). Non-finite or non-positive values fall back to defaults.
 * @param {Object} [options.geometry] - Geometry overrides for the four layers (vesica, treeOfLife, fibonacci, helix). Each subsection is merged with safe defaults.
 * @param {string} [options.notice] - Optional short message to render centered near the bottom of the canvas; ignored if empty or non-string.
 *
 * @return {{ok: boolean, reason?: string, summary?: string}} If the context is missing or invalid, returns { ok: false, reason: "missing-context" }. On success returns { ok: true, summary } where `summary` is a human-readable summary of per-layer stats.
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
 * Normalize canvas drawing dimensions, using provided overrides or falling back to the canvas size.
 *
 * Options.width and options.height are converted to positive numbers when valid; otherwise the
 * corresponding ctx.canvas dimension is used.
 *
 * @param {CanvasRenderingContext2D} ctx - Rendering context whose canvas provides fallback dimensions.
 * @param {Object} options - Optional dimension overrides.
 * @param {number} [options.width] - Desired width (finite positive number).
 * @param {number} [options.height] - Desired height (finite positive number).
 * @returns {{width: number, height: number}} Normalized positive width and height.
 */
function normaliseDimensions(ctx, options) {
  const width = toPositiveNumber(options.width, ctx.canvas.width);
  const height = toPositiveNumber(options.height, ctx.canvas.height);
  return { width, height };
}

/**
 * Merge a partial palette with the default palette, returning a complete palette object.
 *
 * Missing or invalid color fields fall back to defaults. The returned `layers` array
 * is trimmed to the default layer count if the candidate provides too many entries,
 * and is padded with default layer colors if too few are provided.
 *
 * @param {object} [candidate={}] - Partial palette overrides.
 * @param {string} [candidate.bg] - Background color (hex or CSS color string). Used only if a string.
 * @param {string} [candidate.ink] - Primary ink color. Used only if a string.
 * @param {string} [candidate.muted] - Muted color. Used only if a string.
 * @param {string[]} [candidate.layers] - Array of layer colors; entries must be strings. Excess entries are discarded; missing entries are filled from defaults.
 * @returns {{bg: string, ink: string, muted: string, layers: string[]}} A palette object with guaranteed keys and a layers array matching the default layer count.
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
 * Merge a candidate numeric map into the default numeric constants.
 *
 * Accepts an object of numeric overrides and returns a new object containing
 * all keys from DEFAULT_NUMBERS where any provided value is used only if it is
 * a finite number greater than 0. Non-numeric, non-finite, or non-positive
 * values in the candidate are ignored and the default for that key is kept.
 *
 * @param {Object<string, number>} [candidate={}] - Partial mapping of numeric overrides keyed by the same names as DEFAULT_NUMBERS.
 * @return {Object<string, number>} A new object containing the merged numeric constants.
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
 * Merge user-provided geometry overrides into the renderer's default geometry.
 *
 * Accepts a partial geometry object and returns a fully merged, validated geometry
 * set with the four sections used by the renderer: `vesica`, `treeOfLife`,
 * `fibonacci`, and `helix`. Each section is produced by its respective merge helper
 * (which applies defaults and clamps/validates values).
 *
 * @param {Object} [candidate={}] - Partial geometry overrides; may include any of `vesica`, `treeOfLife`, `fibonacci`, and `helix`.
 * @return {{vesica: Object, treeOfLife: Object, fibonacci: Object, helix: Object}} Normalized geometry ready for rendering.
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
 * Merge and validate a vesica-field configuration, falling back to DEFAULT_GEOMETRY.vesica.
 *
 * Accepts a partial config and returns a fully populated, validated vesica settings object
 * with positive integer/number coercion and alpha clamping.
 *
 * @param {Object} [config] - Partial vesica configuration overrides.
 * @param {number} [config.rows] - Number of grid rows.
 * @param {number} [config.columns] - Number of grid columns.
 * @param {number} [config.paddingDivisor] - Divisor controlling padding relative to canvas size.
 * @param {number} [config.radiusFactor] - Factor that determines circle radius from cell size.
 * @param {number} [config.strokeDivisor] - Divisor controlling stroke width relative to radius.
 * @param {number} [config.alpha] - Opacity for vesica elements (0–1).
 * @return {{rows:number,columns:number,paddingDivisor:number,radiusFactor:number,strokeDivisor:number,alpha:number}}
 *   A normalized vesica configuration with defaults applied and values coerced/clamped.
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
 * Merge and sanitize a Tree-of-Life configuration, filling defaults and validating node/edge data.
 *
 * Accepts a partial config and returns a normalized tree configuration suitable for rendering.
 * - Nodes provided in config.nodes are normalized: missing fields fall back to the corresponding
 *   default node (cycled if there are more provided nodes than defaults). Each node is ensured to
 *   have an `id` (string), `title` (string), `level` (number), and `xFactor` (clamped to [0,1]).
 * - Edges provided in config.edges are normalized to 2-element arrays and filtered so both endpoints
 *   reference existing node ids; invalid or out-of-range edges are dropped.
 * - Numeric layout parameters fall back to defaults when missing or invalid.
 *
 * @param {Object} [config={}] - Partial Tree-of-Life configuration to merge.
 * @param {Array<Object>} [config.nodes] - Optional list of node objects; each may include `{ id, title, level, xFactor }`.
 * @param {Array<Array<string>>} [config.edges] - Optional list of edges as 2-item id pairs.
 * @param {number} [config.marginDivisor] - Optional margin divisor for layout; must be positive.
 * @param {number} [config.radiusDivisor] - Optional divisor controlling node radius; must be positive.
 * @param {number} [config.labelOffset] - Optional label offset in canvas units.
 * @param {string} [config.labelFont] - Optional CSS-like font string for node labels.
 * @returns {Object} Normalized tree configuration with properties:
 *   - {number} marginDivisor
 *   - {number} radiusDivisor
 *   - {number} labelOffset
 *   - {string} labelFont
 *   - {Array<Object>} nodes — each node has `{ id, title, level, xFactor }`
 *   - {Array<Array<string>>} edges — validated 2-item id pairs
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
 * Merge and validate a Fibonacci-curve configuration with defaults.
 *
 * Returns a safe configuration object for the Fibonacci (logarithmic spiral) layer by
 * taking user-supplied values from `config`, validating/clamping them, and substituting
 * defaults from DEFAULT_GEOMETRY.fibonacci when values are missing or invalid.
 *
 * @param {Object} [config={}] - Partial Fibonacci configuration.
 * @param {number} [config.sampleCount] - Number of sample points along the spiral (positive integer).
 * @param {number} [config.turns] - Number of spiral turns (positive number).
 * @param {number} [config.baseRadiusDivisor] - Divisor controlling the spiral's base radius (positive number).
 * @param {number} [config.phi] - Growth factor (phi) used in the logarithmic spiral (positive number).
 * @param {number} [config.alpha] - Stroke alpha/transparency for the curve (0–1).
 * @return {{sampleCount:number, turns:number, baseRadiusDivisor:number, phi:number, alpha:number}} A normalized, validated Fibonacci configuration.
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
 * Merge and validate helix geometry settings with defaults.
 *
 * Returns a fully populated helix configuration where each numeric property is validated/coerced and clamped as needed.
 * Fields in the returned object:
 * - sampleCount: positive integer number of sample points along each strand
 * - cycles: positive number of helical cycles
 * - amplitudeDivisor: positive number controlling strand amplitude relative to canvas
 * - phaseOffset: numeric phase offset (radians)
 * - crossTieCount: positive integer number of cross-rungs between strands
 * - strandAlpha: alpha value in [0,1] used for strand rendering
 * - rungAlpha: alpha value in [0,1] used for rung rendering
 *
 * @param {Object} [config] - Partial helix configuration to merge.
 * @return {Object} Normalized helix configuration with validated numeric fields.
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
 * Fill the entire drawing area with the given color.
 *
 * Clears the canvas by filling a rectangle from (0,0) to (dims.width, dims.height).
 *
 * @param {{width: number, height: number}} dims - Canvas dimensions to clear.
 * @param {string} color - CSS color string used to fill the background.
 */
function clearStage(ctx, dims, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

/**
 * Draws a grid of vesica piscis pairs (two overlapping circles) onto a 2D canvas context.
 *
 * Renders `rows × columns` pairs evenly distributed inside the provided dimensions, using
 * settings to derive padding, circle radius, horizontal offset between paired circles,
 * stroke width, and alpha. The function mutates the supplied canvas context by stroking
 * each vesica pair and returns summary metrics.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context to draw into.
 * @param {{width:number,height:number}} dims - Drawing area dimensions in pixels.
 * @param {string} color - Hex color used for strokes (converted with alpha).
 * @param {{ELEVEN:number,TWENTYTWO:number}} numbers - Numeric constants used to compute offsets (expects typical constants like ELEVEN and TWENTYTWO).
 * @param {Object} settings - Vesica field settings:
 *   - rows {number}: number of grid rows (min 1).
 *   - columns {number}: number of grid columns (min 1).
 *   - paddingDivisor {number}: divisor of the smaller canvas dimension to compute outer padding.
 *   - radiusFactor {number}: divisor applied to cell size to compute circle radius.
 *   - strokeDivisor {number}: divisor of canvas size to compute stroke width.
 *   - alpha {number}: stroke opacity in [0,1].
 *
 * @returns {{circles:number, radius:number}} Summary with the total number of circles drawn and the computed circle radius in pixels.
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
 * Stroke a pair of equal circles (a vesica pair) horizontally offset from a center point.
 *
 * Draws two stroked circles centered at (cx - offset, cy) and (cx + offset, cy) with the given radius.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context to draw onto.
 * @param {number} cx - X coordinate of the pair's central anchor point.
 * @param {number} cy - Y coordinate of the pair's central anchor point.
 * @param {number} radius - Radius of each circle.
 * @param {number} offset - Horizontal offset from the central anchor to each circle's center.
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
 * Render a Tree-of-Life scaffold (edges and nodes) onto the provided 2D canvas context.
 *
 * Draws straight edges between configured node pairs, fills and strokes node circles,
 * and optionally renders centered node labels. Node positions are laid out vertically
 * by `level` and horizontally by `xFactor`, all constrained inside an inner margin
 * computed from `settings.marginDivisor`.
 *
 * settings: an object that must include:
 * - nodes: array of node objects with { id, title, level, xFactor } used to compute positions.
 * - edges: array of [fromId, toId] pairs referencing node ids.
 * - marginDivisor: number dividing the smaller canvas dimension to compute outer margin.
 * - radiusDivisor: number dividing the smaller canvas dimension to compute node radius.
 * - labelOffset: vertical offset (pixels) applied when drawing labels (0 to disable).
 * - labelFont: CSS font string used when drawing labels.
 *
 * Returns an object with counts of rendered elements: { nodes, paths }.
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
 * Render a logarithmic (Fibonacci) spiral as a stroked polyline and return sampling info.
 *
 * Draws a logarithmic spiral centered at (72% width, 28% height) of the canvas. The spiral is sampled
 * uniformly in angle over `turns` full rotations; radius increases multiplicatively by `phi` per turn.
 *
 * @param {Object} dims - Canvas dimensions object with numeric `width` and `height`.
 * @param {string} color - Stroke color (hex or any valid CSS color string).
 * @param {Object} numbers - Numeric constants; used to compute stroke width (expects `numbers.NINETYNINE`).
 * @param {Object} settings - Spiral configuration:
 *   - {number} sampleCount: number of sample points along the spiral (minimum 2).
 *   - {number} turns: number of full rotations to draw.
 *   - {number} phi: growth factor per turn (clamped to at least 1.0001).
 *   - {number} baseRadiusDivisor: divisor of the smaller canvas dimension to derive the base radius.
 *   - {number} alpha: stroke alpha in [0,1].
 * @returns {{points: number}} Object containing `points`, the number of samples drawn.
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
 * Render a double-helix lattice (two phase-shifted strands with cross-rungs) onto the canvas.
 *
 * Draws two sinusoidal strands across the horizontal span and connects them with
 * regularly spaced rungs. Strand amplitudes, phase offset, sampling, number of
 * cycles, and alpha values are taken from `settings`; palette and numeric
 * constants control colors and stroke sizing. Returns a simple summary object
 * with the number of drawn rungs.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context to draw into.
 * @param {{width: number, height: number}} dims - Normalized drawing dimensions.
 * @param {{ink: string, layers: string[]}} palette - Palette containing `ink` and `layers` colors; strands use layers[4] and layers[5].
 * @param {{ONEFORTYFOUR: number, THIRTYTHREE: number}} numbers - Numeric constants used for sizing and margins.
 * @param {Object} settings - Helix layout options. Expected properties:
 *   - sampleCount {number} number of sample points per strand (min 2),
 *   - cycles {number} number of full sinusoidal cycles across the span,
 *   - amplitudeDivisor {number} divisor applied to canvas height to compute strand amplitude,
 *   - phaseOffset {number} phase offset in degrees applied to the second strand,
 *   - crossTieCount {number} requested count of cross-rungs,
 *   - strandAlpha {number} alpha for strand strokes (0..1),
 *   - rungAlpha {number} alpha for rung strokes (0..1).
 * @returns {{rungs: number}} Number of cross-rungs actually drawn.
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
 * Draws a stroked polyline through a sequence of points on the provided 2D canvas context.
 *
 * If `points` is empty the function does nothing. Each point must be an object with numeric `x` and `y`.
 *
 * @param {Array<{x: number, y: number}>} points - Ordered vertices of the polyline.
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
 * Draws a centered, bottom-aligned notice on the canvas.
 *
 * The function renders `message` centered horizontally near the bottom edge of the drawing area
 * and preserves the canvas context state (saves and restores). Font size is computed as
 * max(14, width/72) pixels. A vertical padding of min(width, height) / 33 is used to offset the text
 * from the bottom edge. The rendered text is drawn with the provided `color` at 90% opacity.
 *
 * @param {Object} dims - Drawing area dimensions.
 * @param {number} dims.width - Width in pixels.
 * @param {number} dims.height - Height in pixels.
 * @param {string} color - CSS color (hex, rgb, etc.) used for the notice text.
 * @param {string} message - The text to render.
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
 * Build a concise human-readable summary of rendered layer statistics.
 *
 * @param {Object} stats - Aggregated per-layer statistics returned by rendering functions.
 * @param {Object} stats.vesicaStats - Vesica field stats containing numeric `circles`.
 * @param {Object} stats.treeStats - Tree-of-Life stats containing numeric `paths` and `nodes`.
 * @param {Object} stats.fibonacciStats - Fibonacci stats containing numeric `points`.
 * @param {Object} stats.helixStats - Helix stats containing numeric `rungs`.
 * @returns {string} A single-line summary describing counts for each rendered layer.
 */
function summariseLayers(stats) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const tree = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  const helix = `${stats.helixStats.rungs} helix rungs`;
  return `Layers rendered - ${vesica}; ${tree}; ${fibonacci}; ${helix}.`;
}

/**
 * Convert a 6‑digit hex color and an alpha value to an `rgba(...)` CSS string.
 *
 * Returns an `rgba(r,g,b,a)` string where `r`, `g`, and `b` are parsed from the
 * provided 6‑character hex (with or without a leading `#`) and `a` is the input
 * alpha clamped to [0, 1]. If the hex is not a valid 6‑hex string, the
 * function falls back to opaque white (255,255,255) with the clamped alpha.
 *
 * @param {string} hex - A 6‑digit hex color string (e.g. `"#ff00aa"` or `"ff00aa"`).
 * @param {number} alpha - Alpha value; will be clamped to the [0, 1] range.
 * @return {string} An `rgba(...)` CSS color string.
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
 * Coerce a value to a positive finite number, using a fallback when invalid.
 *
 * Converts `value` with `Number(value)` and returns it if it is finite and greater than 0.
 * Otherwise returns `Number(fallback)`.
 *
 * @param {*} value - Input to coerce to a positive finite number.
 * @param {*} fallback - Fallback used when `value` is not a positive finite number; also converted with `Number()`.
 * @returns {number} A positive finite number (result of `Number(value)` or `Number(fallback)`).
 */
function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : Number(fallback);
}

/**
 * Convert a value to a positive integer, falling back when conversion fails.
 *
 * Attempts to coerce `value` to a number, rounds it to the nearest integer,
 * and returns it if finite and greater than zero. If the input is not a
 * finite positive integer after rounding, returns Number(fallback).
 *
 * @param {*} value - The value to convert to a positive integer.
 * @param {*} fallback - Value to return (via `Number(fallback)`) when conversion fails.
 * @return {number} A positive integer or the numeric conversion of `fallback`.
 */
function toPositiveInteger(value, fallback) {
  const number = Number(value);
  const rounded = Math.round(number);
  return Number.isFinite(number) && rounded > 0 ? rounded : Number(fallback);
}

/**
 * Convert a value to a finite number clamped into the inclusive range [0, 1].
 *
 * Non-numeric or non-finite inputs (NaN, Infinity, -Infinity) and values < 0 return 0.
 * Values > 1 return 1. Valid finite numbers between 0 and 1 are returned unchanged.
 *
 * @param {*} value - Input to coerce to a number and clamp.
 * @return {number} A number in the range [0, 1].
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
 * Clamp an input to the [0, 1] range, with special handling for exact zero and a fallback.
 *
 * Converts `value` to a Number and returns it clamped to [0, 1]. If `value === 0` the function
 * returns 0 exactly (preserving zero distinct from other falsy or invalid inputs). If `value`
 * is not a finite number, the provided `fallback` is returned unchanged.
 *
 * @param {*} value - The candidate value to clamp; may be any type that can be converted to Number.
 * @param {*} fallback - Value to return when `value` is not a finite number.
 * @return {number|*} A number in [0,1] when `value` is finite (or 0 when exactly zero); otherwise `fallback`.
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
