/*
  helix-renderer.mjs — Atelier edition
  ND-safe static renderer for the Cosmic Helix canvas now hosted under site/publish/.

  Layers render back-to-front:
    1) Vesica field — intersecting circles forming the womb-of-forms lattice.
    2) Tree-of-Life scaffold — ten sephirot nodes joined by twenty-two calm paths.
    3) Fibonacci curve — logarithmic spiral sampling growth ratios without motion.
    4) Double-helix lattice — twin strands with cross ties, entirely static.

  ND-safe rationale:
    - All helpers are pure and synchronous. Rendering happens once to avoid motion.
    - Palette, numerology, and geometry accept offline fallbacks when JSON files are missing.
    - Comments document calm contrasts and layered depth choices for trauma-informed review.
*/

export const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

export const DEFAULT_NUMBERS = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
};

export const DEFAULT_GEOMETRY = {
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
    phaseOffset: 180,
    crossTieCount: 33,
    strandAlpha: 0.85,
    rungAlpha: 0.6
  }
};

/**
 * Render the Cosmic Helix composition onto a 2D canvas context.
 *
 * Given a CanvasRenderingContext2D and an optional input config, validates the
 * context, normalises configuration with sensible defaults, clears the canvas
 * background and deterministically draws four layers back-to-front:
 * vesica field, Tree-of-Life scaffold, Fibonacci curve, and a double-helix
 * lattice. Optionally renders a centered notice string. All drawing is
 * synchronous and deterministic; state is not retained beyond the canvas.
 *
 * @param {Object} [input] - Optional configuration overrides (palette, numbers, geometry, notice).
 * @return {{ok: boolean, summary?: string, reason?: string}} If the context is valid returns
 *   { ok: true, summary } where summary is a short string describing per-layer counts.
 *   If the context is missing or invalid returns { ok: false, reason: "missing-context" }.
 */
export function renderHelix(ctx, input = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    return { ok: false, reason: "missing-context" };
  }

  const config = normaliseConfig(ctx, input);
  const { dims, palette, numbers, geometry, notice } = config;

  ctx.save();
  clearStage(ctx, dims, palette.bg);

  const vesicaStats = drawVesicaField(ctx, dims, palette, numbers, geometry.vesica);
  const treeStats = drawTreeOfLife(ctx, dims, palette, numbers, geometry.treeOfLife);
  const fibonacciStats = drawFibonacciCurve(ctx, dims, palette, numbers, geometry.fibonacci);
  const helixStats = drawHelixLattice(ctx, dims, palette, numbers, geometry.helix);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette.ink, notice);
  }

  ctx.restore();
  return {
    ok: true,
    summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats })
  };
}

/**
 * Normalize and validate renderer configuration derived from user input and canvas context.
 *
 * Produces a fully populated configuration object used by the renderer by:
 * - Resolving width/height from input with fallback to the canvas size (clamped).
 * - Merging provided palette, numeric constants, and per-layer geometry with defaults.
 * - Trimming an optional notice string and returning null when absent or empty.
 *
 * @param {Object} input - Partial configuration supplied by the caller. Recognized fields:
 *   - width, height: desired drawing dimensions (numbers, optional).
 *   - palette: palette override object (optional).
 *   - NUM: numeric overrides (optional).
 *   - geometry: per-layer geometry overrides (optional).
 *   - notice: optional text to render on the canvas; whitespace-only strings are treated as absent.
 * @returns {{ dims: {width: number, height: number}, palette: Object, numbers: Object, geometry: Object, notice: string|null }}
 *   An object containing:
 *   - dims: resolved drawing dimensions.
 *   - palette: merged palette (bg, ink, layers).
 *   - numbers: merged numeric constants.
 *   - geometry: normalized geometry for all layers.
 *   - notice: trimmed notice text or null.
 */
function normaliseConfig(ctx, input) {
  const width = clampDimension(input.width, ctx.canvas.width);
  const height = clampDimension(input.height, ctx.canvas.height);
  const dims = { width, height };
  const palette = mergePalette(input.palette);
  const numbers = mergeNumbers(input.NUM);
  const geometry = mergeGeometry(input.geometry);
  const notice = typeof input.notice === "string" && input.notice.trim().length > 0 ? input.notice.trim() : null;
  return { dims, palette, numbers, geometry, notice };
}

/**
 * Coerce a value to a positive finite numeric canvas dimension, otherwise return a fallback.
 *
 * Attempts to convert `candidate` to a Number and returns it if it's finite and > 0.
 * If not, returns Number(fallback).
 *
 * @param {*} candidate - Value to coerce into a positive finite number (e.g., canvas width/height).
 * @param {*} fallback - Fallback value that will be converted to a Number when `candidate` is invalid.
 * @return {number} A positive finite number (from `candidate` when valid, otherwise from `fallback`).
 */
function clampDimension(candidate, fallback) {
  const value = Number(candidate);
  if (Number.isFinite(value) && value > 0) {
    return value;
  }
  return Number(fallback);
}

/**
 * Merge a user-supplied palette with the DEFAULT_PALETTE, returning background, ink, and a fixed-length layers array.
 *
 * If `candidate` is not an object it is treated as empty. Provided `layers` are copied and truncated to the
 * default number of layers; any missing layer entries are filled from DEFAULT_PALETTE. `bg` and `ink` use
 * the candidate values when they are strings, otherwise the defaults.
 *
 * @param {Object} [candidate] Optional palette overrides; may include `bg`, `ink`, and `layers` (array of color strings).
 * @return {{bg: string, ink: string, layers: string[]}} Merged palette ready for rendering.
 */
function mergePalette(candidate) {
  const source = candidate && typeof candidate === "object" ? candidate : {};
  const layers = Array.isArray(source.layers) ? source.layers.slice(0, DEFAULT_PALETTE.layers.length) : [];
  while (layers.length < DEFAULT_PALETTE.layers.length) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }
  return {
    bg: typeof source.bg === "string" ? source.bg : DEFAULT_PALETTE.bg,
    ink: typeof source.ink === "string" ? source.ink : DEFAULT_PALETTE.ink,
    layers
  };
}

/**
 * Merge numeric constants with the module defaults, overriding only with finite, positive numbers.
 *
 * @param {Object} [candidate] - Optional map of numeric overrides; keys matching DEFAULT_NUMBERS will replace defaults when the value is a finite number greater than 0.
 * @return {Object} A new numbers object derived from DEFAULT_NUMBERS with validated overrides applied.
 */
function mergeNumbers(candidate) {
  const source = candidate && typeof candidate === "object" ? candidate : {};
  const merged = { ...DEFAULT_NUMBERS };
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    const value = Number(source[key]);
    if (Number.isFinite(value) && value > 0) {
      merged[key] = value;
    }
  }
  return merged;
}

/**
 * Merge a user-supplied geometry object with defaults by delegating to per-layer normalisers.
 *
 * Accepts a partial geometry candidate and returns a fully normalised geometry object
 * with the four layer configurations: `vesica`, `treeOfLife`, `fibonacci`, and `helix`.
 * Missing or invalid sub-objects in `candidate` are replaced with their respective defaults.
 *
 * @param {object} [candidate] - Partial geometry overrides (may contain any subset of `vesica`, `treeOfLife`, `fibonacci`, `helix`).
 * @return {{vesica: object, treeOfLife: object, fibonacci: object, helix: object}} Normalised geometry ready for rendering.
 */
function mergeGeometry(candidate) {
  const source = candidate && typeof candidate === "object" ? candidate : {};
  return {
    vesica: normaliseVesica(source.vesica),
    treeOfLife: normaliseTree(source.treeOfLife),
    fibonacci: normaliseFibonacci(source.fibonacci),
    helix: normaliseHelix(source.helix)
  };
}

/**
 * Normalize vesica-layer geometry, validating and filling missing values from defaults.
 *
 * Merges a partial candidate object with DEFAULT_GEOMETRY.vesica and ensures numeric fields
 * are clamped/validated: rows and columns become positive integers; paddingDivisor,
 * radiusFactor and strokeDivisor become positive finite numbers; alpha is clamped to [0,1].
 *
 * @param {object} [candidate] - Partial vesica settings; may include `rows`, `columns`,
 *   `paddingDivisor`, `radiusFactor`, `strokeDivisor`, and `alpha`. Non-finite or invalid
 *   values are replaced by defaults.
 * @return {{rows:number, columns:number, paddingDivisor:number, radiusFactor:number, strokeDivisor:number, alpha:number}}
 *   Normalized vesica configuration ready for rendering.
 */
function normaliseVesica(candidate) {
  const base = candidate && typeof candidate === "object" ? candidate : {};
  const fallback = DEFAULT_GEOMETRY.vesica;
  return {
    rows: positiveInteger(base.rows, fallback.rows),
    columns: positiveInteger(base.columns, fallback.columns),
    paddingDivisor: positiveNumber(base.paddingDivisor, fallback.paddingDivisor),
    radiusFactor: positiveNumber(base.radiusFactor, fallback.radiusFactor),
    strokeDivisor: positiveNumber(base.strokeDivisor, fallback.strokeDivisor),
    alpha: clampAlpha(base.alpha, fallback.alpha)
  };
}

/**
 * Normalizes a Tree-of-Life geometry configuration, filling missing values from defaults
 * and validating node/edge structures.
 *
 * @param {object} [candidate] - Partial tree configuration supplied by the caller. May contain:
 *   - nodes: an array of node objects (id, title, meaning, level, xFactor)
 *   - edges: an array of 2-item arrays of node ids
 *   - marginDivisor, radiusDivisor, labelOffset, labelFont
 * @return {object} Normalized tree settings:
 *   - marginDivisor {number}
 *   - radiusDivisor {number}
 *   - labelOffset {number}
 *   - labelFont {string}
 *   - nodes {Array.<{id:string,title:string,meaning:string,level:number,xFactor:number}>}:
 *       Each node is populated from the provided entry or a default reference; level is numeric
 *       and xFactor is clamped to [0,1].
 *   - edges {Array.<[string,string]>}: Only retained when both endpoint ids exist in `nodes`.
 */
function normaliseTree(candidate) {
  const base = candidate && typeof candidate === "object" ? candidate : {};
  const fallback = DEFAULT_GEOMETRY.treeOfLife;
  const fallbackNodes = fallback.nodes;
  const provided = Array.isArray(base.nodes) && base.nodes.length > 0 ? base.nodes : fallbackNodes;
  const nodes = provided.map((entry, index) => {
    const source = entry && typeof entry === "object" ? entry : {};
    const reference = fallbackNodes.find((node) => node.id === source.id) || fallbackNodes[index % fallbackNodes.length];
    return {
      id: typeof source.id === "string" && source.id ? source.id : reference.id,
      title: typeof source.title === "string" && source.title ? source.title : reference.title,
      meaning: typeof source.meaning === "string" && source.meaning ? source.meaning : reference.meaning,
      level: finiteNumber(source.level, reference.level),
      xFactor: clamp01(finiteNumber(source.xFactor, reference.xFactor))
    };
  });

  const allowedIds = new Set(nodes.map((node) => node.id));
  const sourceEdges = Array.isArray(base.edges) && base.edges.length > 0 ? base.edges : fallback.edges;
  const edges = sourceEdges
    .map((edge) => (Array.isArray(edge) ? edge.slice(0, 2) : []))
    .filter((edge) => edge.length === 2 && allowedIds.has(edge[0]) && allowedIds.has(edge[1]));

  return {
    marginDivisor: positiveNumber(base.marginDivisor, fallback.marginDivisor),
    radiusDivisor: positiveNumber(base.radiusDivisor, fallback.radiusDivisor),
    labelOffset: finiteNumber(base.labelOffset, fallback.labelOffset),
    labelFont: typeof base.labelFont === "string" && base.labelFont ? base.labelFont : fallback.labelFont,
    nodes,
    edges
  };
}

/**
 * Normalize a Fibonacci geometry configuration by merging user input with defaults and sanitizing values.
 *
 * Ensures:
 * - sampleCount is a positive integer,
 * - turns, baseRadiusDivisor, and phi are positive finite numbers,
 * - alpha is clamped to the inclusive range [0, 1].
 *
 * @param {Object|undefined} candidate - Partial fibonacci settings to normalize.
 * @returns {{sampleCount:number, turns:number, baseRadiusDivisor:number, phi:number, alpha:number}} Normalized fibonacci settings.
 */
function normaliseFibonacci(candidate) {
  const base = candidate && typeof candidate === "object" ? candidate : {};
  const fallback = DEFAULT_GEOMETRY.fibonacci;
  return {
    sampleCount: positiveInteger(base.sampleCount, fallback.sampleCount),
    turns: positiveNumber(base.turns, fallback.turns),
    baseRadiusDivisor: positiveNumber(base.baseRadiusDivisor, fallback.baseRadiusDivisor),
    phi: positiveNumber(base.phi, fallback.phi),
    alpha: clampAlpha(base.alpha, fallback.alpha)
  };
}

/**
 * Normalize helix geometry settings by validating and falling back to defaults.
 *
 * Accepts a candidate settings object and returns a sanitized helix configuration.
 * Numeric fields are coerced and validated (positive integers or numbers where required,
 * finite numbers for offsets, and clamped alpha values). Missing or invalid entries
 * fall back to DEFAULT_GEOMETRY.helix.
 *
 * @param {Object} [candidate] - Partial helix settings to normalize.
 * @return {{sampleCount:number, cycles:number, amplitudeDivisor:number, phaseOffset:number, crossTieCount:number, strandAlpha:number, rungAlpha:number}}
 *   A normalized helix configuration:
 *   - sampleCount: number of sample points per strand (positive integer).
 *   - cycles: vertical cycles of the helix (positive number).
 *   - amplitudeDivisor: divisor controlling horizontal amplitude (positive number).
 *   - phaseOffset: phase offset applied to the strand sine (finite number).
 *   - crossTieCount: number of cross ties (rungs) to draw between strands (positive integer).
 *   - strandAlpha: alpha (0–1) for strand stroke rendering.
 *   - rungAlpha: alpha (0–1) for rung stroke rendering.
 */
function normaliseHelix(candidate) {
  const base = candidate && typeof candidate === "object" ? candidate : {};
  const fallback = DEFAULT_GEOMETRY.helix;
  return {
    sampleCount: positiveInteger(base.sampleCount, fallback.sampleCount),
    cycles: positiveNumber(base.cycles, fallback.cycles),
    amplitudeDivisor: positiveNumber(base.amplitudeDivisor, fallback.amplitudeDivisor),
    phaseOffset: finiteNumber(base.phaseOffset, fallback.phaseOffset),
    crossTieCount: positiveInteger(base.crossTieCount, fallback.crossTieCount),
    strandAlpha: clampAlpha(base.strandAlpha, fallback.strandAlpha),
    rungAlpha: clampAlpha(base.rungAlpha, fallback.rungAlpha)
  };
}

/**
 * Render a grid of vesica pairs (two overlapping circles) across the canvas.
 *
 * The grid is laid out inside the drawable area defined by `dims` (width/height),
 * with padding computed from `settings.paddingDivisor`. Rows and columns are
 * treated as integers with a minimum of 2. Circle radius, pair offset, and
 * stroke width are derived from the computed grid step sizes, `settings` and
 * numeric constants from `numbers`. Drawing uses the first palette layer for stroke.
 *
 * The function saves and restores the canvas context state before/after drawing.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context (saved/restored by the function).
 * @param {{width:number,height:number}} dims - Drawable dimensions used to compute padding and layout.
 * @param {{layers:string[]}} palette - Palette object; the function uses `palette.layers[0]` as the stroke color.
 * @param {{NINE:number,TWENTYTWO:number}} numbers - Numeric constants used to compute pair offset.
 * @param {Object} settings - Vesica layout settings. Meaningful fields:
 *   - rows {number}: number of grid rows (minimum 2).
 *   - columns {number}: number of grid columns (minimum 2).
 *   - paddingDivisor {number}: divisor to compute padding from the smallest canvas dimension.
 *   - radiusFactor {number}: divisor applied to grid step to compute circle radius.
 *   - strokeDivisor {number}: divisor applied to smallest canvas dimension to compute stroke width.
 *   - alpha {number}: opacity for vesica strokes (0–1); clamped if out of range.
 *
 * @return {{circles:number, radius:number}} Object with the total number of circles drawn
 *   (rows * columns * 2) and the computed circle radius in pixels.
 */
function drawVesicaField(ctx, dims, palette, numbers, settings) {
  const rows = Math.max(2, settings.rows);
  const columns = Math.max(2, settings.columns);
  const padding = Math.min(dims.width, dims.height) / settings.paddingDivisor;
  const innerWidth = dims.width - padding * 2;
  const innerHeight = dims.height - padding * 2;
  const stepX = columns > 1 ? innerWidth / (columns - 1) : 0;
  const stepY = rows > 1 ? innerHeight / (rows - 1) : 0;
  const radius = Math.min(stepX, stepY) / settings.radiusFactor;
  const offset = radius * (numbers.NINE / numbers.TWENTYTWO);
  const strokeWidth = Math.max(1, Math.min(dims.width, dims.height) / settings.strokeDivisor);

  ctx.save();
  ctx.globalAlpha = clampAlpha(settings.alpha, 0.6);
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = padding + col * stepX;
      const cy = padding + row * stepY;
      drawVesicaPair(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
  return { circles: rows * columns * 2, radius };
}

/**
 * Draws a pair of stroked circles (a vesica-like overlap) centered on a horizontal axis.
 *
 * The two circles are centered at (cx - offset, cy) and (cx + offset, cy), each with the given radius,
 * and are stroked using the provided canvas rendering context's current stroke style and lineWidth.
 *
 * @param {number} cx - X coordinate of the midpoint between the two circle centers.
 * @param {number} cy - Y coordinate for both circle centers.
 * @param {number} radius - Radius of each circle.
 * @param {number} offset - Horizontal distance from the midpoint to each circle center.
 */
function drawVesicaPair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Render the Tree-of-Life scaffold: draw nodes (sephirot) and connecting edges.
 *
 * Given canvas dimensions and style settings, computes node positions from each
 * node's xFactor and level, draws semi-transparent edges first, then filled
 * circular nodes with an ink outline. Positions are clamped into the drawable
 * area using the configured margin and level spacing.
 *
 * @param {object} dims - Canvas dimensions { width, height }.
 * @param {object} palette - Color palette with at least `layers` (array) and `ink`.
 * @param {object} numbers - Numeric constants used for sizing (e.g., NINETYNINE).
 * @param {object} settings - Tree layout and rendering settings. Required fields:
 *   - marginDivisor {number}: divisor for computing outer margin from min(width,height).
 *   - radiusDivisor {number}: divisor used to derive node circle radius.
 *   - nodes {Array<object>}: array of node descriptors; each node must include:
 *       - id {string}: unique node identifier used by edges.
 *       - level {number}: integer level (vertical placement).
 *       - xFactor {number}: horizontal placement factor in [0,1] (clamped).
 *     Other node fields (title, meaning) are ignored by this renderer.
 *   - edges {Array<[string, string]>}: array of 2-item arrays specifying connections
 *     as [fromId, toId]. Any edge referencing a missing node is skipped.
 * @return {{nodes: number, paths: number}} Counts of rendered nodes and total edges
 *   considered (edges referencing missing nodes are not drawn but counted in `paths`).
 */
function drawTreeOfLife(ctx, dims, palette, numbers, settings) {
  const margin = Math.min(dims.width, dims.height) / settings.marginDivisor;
  const usableWidth = dims.width - margin * 2;
  const usableHeight = dims.height - margin * 2;
  const maxLevel = settings.nodes.reduce((acc, node) => Math.max(acc, node.level), 0);
  const levelStep = maxLevel > 0 ? usableHeight / maxLevel : 0;
  const radius = Math.max(4, Math.min(dims.width, dims.height) / settings.radiusDivisor);
  const edgeWidth = Math.max(1, Math.min(dims.width, dims.height) / numbers.NINETYNINE);

  const positions = new Map();
  settings.nodes.forEach((node) => {
    const x = margin + clamp01(node.xFactor) * usableWidth;
    const y = margin + node.level * levelStep;
    positions.set(node.id, { x, y, node });
  });

  ctx.save();
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = palette.layers[1];
  ctx.lineWidth = edgeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  settings.edges.forEach((edge) => {
    const from = positions.get(edge[0]);
    const to = positions.get(edge[1]);
    if (!from || !to) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, edgeWidth * 0.75);
  positions.forEach((pos) => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
  return { nodes: positions.size, paths: settings.edges.length };
}

/**
 * Draws a logarithmic (Fibonacci-like) spiral on the provided canvas context.
 *
 * Renders a continuous stroked curve sampled evenly along `turns` revolutions,
 * using an exponential radius growth controlled by `phi`. The curve is centered
 * at a fixed fractional position of the drawing area and uses palette layer 4
 * for stroke color with configurable alpha and line width derived from canvas size.
 *
 * @param {object} settings - Configuration for the spiral. Keys used:
 *   - {number} sampleCount — number of sampled points along the curve (minimum 2).
 *   - {number} turns — how many revolutions the spiral makes.
 *   - {number} baseRadiusDivisor — divisor applied to the smaller canvas dimension to form the base radius.
 *   - {number} phi — radial growth factor per turn (values < 1.0001 are clamped to 1.0001).
 *   - {number} alpha — stroke alpha (clamped to [0,1]; fallback 0.85 if invalid).
 * @return {{points: number}} Object with the number of points sampled (`points`).
 */
function drawFibonacciCurve(ctx, dims, palette, numbers, settings) {
  const count = Math.max(2, settings.sampleCount);
  const turns = settings.turns;
  const totalAngle = turns * Math.PI * 2;
  const centerX = dims.width * 0.72;
  const centerY = dims.height * 0.32;
  const baseRadius = Math.min(dims.width, dims.height) / settings.baseRadiusDivisor;
  const phi = Math.max(1.0001, settings.phi);
  const strokeWidth = Math.max(1, Math.min(dims.width, dims.height) / numbers.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = palette.layers[3];
  ctx.globalAlpha = clampAlpha(settings.alpha, 0.85);
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  for (let index = 0; index < count; index += 1) {
    const t = count > 1 ? index / (count - 1) : 0;
    const angle = t * totalAngle;
    const radius = baseRadius * Math.pow(phi, t * turns);
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
  return { points: count };
}

/**
 * Draws a static double-helix lattice (two sinusoidal strands and cross-ties) onto the provided 2D canvas context.
 *
 * The function computes two vertical strands displaced horizontally by a sinusoid (configurable sample count, cycles,
 * amplitude, and phase) and renders them back-to-front with configurable stroke alpha. It then draws a configurable
 * number of cross-ties ("rungs") connecting corresponding sample points between the strands. All drawing is immediate
 * on the supplied canvas context; the function returns a simple summary of how many rungs were drawn.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context whose canvas will be painted.
 * @param {{width:number,height:number}} dims - Canvas dimensions used to scale positions and sizing.
 * @param {{ink:string,layers:string[]}} palette - Color palette (uses layers[4], layers[5] for strands and ink for rungs).
 * @param {{NINE:number,NINETYNINE:number}} numbers - Numeric constants used for layout and stroke sizing.
 * @param {Object} settings - Helix rendering settings.
 * @param {number} settings.sampleCount - Number of sample points per strand (minimum 2).
 * @param {number} settings.amplitudeDivisor - Divides canvas height to compute strand amplitude.
 * @param {number} settings.phaseOffset - Phase offset in degrees applied to the second strand.
 * @param {number} settings.cycles - Number of full sinusoidal cycles along the vertical span.
 * @param {number} settings.strandAlpha - Alpha applied to strand strokes (0–1).
 * @param {number} settings.rungAlpha - Alpha applied to rung strokes (0–1).
 * @param {number} settings.crossTieCount - Number of cross-ties (rungs) to draw between strands (minimum 1).
 * @returns {{rungs:number}} Object reporting the number of rungs drawn.
 */
function drawHelixLattice(ctx, dims, palette, numbers, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const amplitude = Math.min(dims.height / settings.amplitudeDivisor, dims.height / 3);
  const phase = (settings.phaseOffset * Math.PI) / 180;
  const strokeWidth = Math.max(1, Math.min(dims.width, dims.height) / numbers.NINETYNINE);
  const startY = dims.height / numbers.NINE;
  const endY = dims.height - startY;
  const usableHeight = endY - startY;

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < samples; index += 1) {
    const t = samples > 1 ? index / (samples - 1) : 0;
    const angle = t * settings.cycles * Math.PI * 2;
    const y = startY + t * usableHeight;
    const centerX = dims.width / 2;
    const xA = centerX + Math.sin(angle) * amplitude;
    const xB = centerX + Math.sin(angle + phase) * amplitude;
    strandA.push({ x: xA, y });
    strandB.push({ x: xB, y });
  }

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(palette.layers[4], settings.strandAlpha);
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  drawPolyline(ctx, strandA);

  ctx.strokeStyle = colorWithAlpha(palette.layers[5], settings.strandAlpha);
  drawPolyline(ctx, strandB);

  ctx.strokeStyle = colorWithAlpha(palette.ink, settings.rungAlpha);
  ctx.lineWidth = Math.max(1, strokeWidth * 0.85);
  const rungCount = Math.max(1, settings.crossTieCount);
  for (let rung = 0; rung < rungCount; rung += 1) {
    const t = rungCount > 1 ? rung / (rungCount - 1) : 0;
    const index = Math.min(strandA.length - 1, Math.round(t * (strandA.length - 1)));
    const a = strandA[index];
    const b = strandB[index];
    if (!a || !b) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
  return { rungs: rungCount };
}

/**
 * Stroke a continuous polyline through an ordered list of points on the provided 2D canvas context.
 *
 * Starts a new path, moves to the first point and creates line segments to each subsequent point,
 * then strokes the path. If `points` is empty or falsy the function is a no-op.
 *
 * @param {Array<{x: number, y: number}>} points - Ordered array of points with numeric `x` and `y` coordinates.
 */
function drawPolyline(ctx, points) {
  if (!points || points.length === 0) {
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
 * Draws a centered notice string near the bottom of the canvas.
 *
 * The function sets a semi-opaque fill color, computes a responsive font size
 * based on canvas width, centers the text horizontally and aligns it to the
 * bottom, then paints `message` at a fixed offset above the bottom edge.
 *
 * @param {Object} dims - Canvas drawing dimensions.
 * @param {number} dims.width - Canvas width in pixels.
 * @param {number} dims.height - Canvas height in pixels.
 * @param {string} color - Base hex color (e.g. "#rrggbb") used for the text; an alpha of 0.9 is applied.
 * @param {string} message - The notice text to render.
 */
function drawCanvasNotice(ctx, dims, color, message) {
  ctx.save();
  ctx.fillStyle = colorWithAlpha(color, 0.9);
  ctx.font = `${Math.max(14, dims.width / 72)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(message, dims.width / 2, dims.height - dims.height / DEFAULT_NUMBERS.THIRTYTHREE);
  ctx.restore();
}

/**
 * Produce a concise human-readable summary of per-layer render statistics.
 *
 * @param {Object} stats - Aggregated statistics produced by the layer renderers.
 * @param {Object} stats.vesicaStats - Vesica field stats; must include `circles` (number).
 * @param {Object} stats.treeStats - Tree-of-Life stats; must include `paths` (number) and `nodes` (number).
 * @param {Object} stats.fibonacciStats - Fibonacci curve stats; must include `points` (number).
 * @param {Object} stats.helixStats - Helix lattice stats; must include `rungs` (number).
 * @return {string} A single-line summary describing counts for vesica circles, tree paths/nodes, spiral points, and helix rungs.
 */
function summariseLayers(stats) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const tree = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  const helix = `${stats.helixStats.rungs} helix rungs`;
  return `Layers rendered — ${vesica}; ${tree}; ${fibonacci}; ${helix}.`;
}

/**
 * Fill the drawing area with a background color.
 *
 * Clears the rectangle defined by dims (from 0,0 to width×height) by filling it with bg.
 *
 * @param {{width:number,height:number}} dims - Canvas area size in pixels.
 * @param {string} bg - CSS color string used to fill the stage (e.g., `#rrggbb`, `rgba(...)`, or color name).
 */
function clearStage(ctx, dims, bg) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

/**
 * Convert a 6‑digit hex color string to an `rgba(...)` CSS string with the given alpha.
 *
 * Accepts hex strings in the forms `"#rrggbb"` or `"rrggbb"`. If `hex` is invalid or not a 6‑digit hex, returns white (`#ffffff`) with the provided alpha. Alpha is clamped to the [0,1] range.
 *
 * @param {string} hex - Hex color string, e.g. `"#ff8800"` or `"ff8800"`.
 * @param {number} alpha - Desired alpha transparency; will be clamped to [0,1].
 * @return {string} A CSS `rgba(r,g,b,a)` string.
 */
function colorWithAlpha(hex, alpha) {
  const value = typeof hex === "string" ? hex.trim() : "";
  const stripped = value.startsWith("#") ? value.slice(1) : value;
  if (stripped.length !== 6) {
    return `rgba(255,255,255,${clampAlpha(alpha, 1)})`;
  }
  const r = parseInt(stripped.slice(0, 2), 16);
  const g = parseInt(stripped.slice(2, 4), 16);
  const b = parseInt(stripped.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${clampAlpha(alpha, 1)})`;
}

/**
 * Return value as a positive integer, or the provided fallback if invalid.
 *
 * Converts the input to a Number and returns it only when it is an integer greater than 0.
 *
 * @param {*} value - Value to convert and validate as a positive integer.
 * @param {number} fallback - Value returned when `value` is not a positive integer.
 * @return {number} The positive integer derived from `value`, or `fallback` if validation fails.
 */
function positiveInteger(value, fallback) {
  const number = Number(value);
  if (Number.isInteger(number) && number > 0) {
    return number;
  }
  return fallback;
}

/**
 * Return a positive finite numeric value or a fallback.
 *
 * Converts the input to a Number and returns it if it's finite and > 0; otherwise returns the provided fallback.
 *
 * @param {*} value - Value to coerce to a number.
 * @param {number} fallback - Value returned when `value` is not a finite positive number.
 * @returns {number} The validated positive number or the fallback.
 */
function positiveNumber(value, fallback) {
  const number = Number(value);
  if (Number.isFinite(number) && number > 0) {
    return number;
  }
  return fallback;
}

/**
 * Convert a value to a finite number, or return a fallback when conversion fails.
 *
 * Attempts Number(value) and returns the numeric result if finite; otherwise returns the provided fallback.
 *
 * @param {*} value - Value to convert to a number (may be string, number, etc.).
 * @param {number} fallback - Value returned when the conversion is NaN, Infinity, or -Infinity.
 * @return {number} A finite number (either the converted value or the fallback).
 */
function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

/**
 * Clamp a value to the inclusive range [0, 1].
 *
 * Converts the input to Number; non-finite values (NaN, Infinity, -Infinity) and values < 0 return 0,
 * values > 1 return 1, otherwise the numeric value is returned.
 *
 * @param {*} value - Value to coerce and clamp.
 * @return {number} The input converted to a finite number within [0,1].
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
 * Clamp a numeric input to the inclusive range [0, 1], returning a fallback for non-finite values.
 *
 * Converts `value` to a Number. If the result is finite, returns 0 for negative numbers, 1 for numbers > 1,
 * or the numeric value itself when it's already within [0, 1]. If the converted value is not finite, returns
 * `fallback`.
 *
 * @param {*} value - Value to convert and clamp to [0, 1].
 * @param {number} fallback - Value to return when `value` cannot be converted to a finite number.
 * @return {number} The clamped number or the provided fallback.
 */
function clampAlpha(value, fallback) {
  const number = Number(value);
  if (Number.isFinite(number)) {
    if (number < 0) {
      return 0;
    }
    if (number > 1) {
      return 1;
    }
    return number;
  }
  return fallback;
}
