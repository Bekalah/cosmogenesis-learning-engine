/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (back to front):
    1) Vesica field — intersecting circles establishing the womb-of-forms grid.
    2) Tree-of-Life scaffold — ten sephirot nodes and twenty-two calm paths.
    3) Fibonacci curve — logarithmic spiral sampled over 144 points.
    4) Double-helix lattice — two still strands tied by thirty-three crossbars.

  Why this design: preserves layered depth without animation, honours numerology constants
  (3, 7, 9, 11, 22, 33, 99, 144), and keeps functions pure and well-commented for offline review.
*/

const FALLBACK_PALETTE = Object.freeze({
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
});

const FALLBACK_NUMBERS = Object.freeze({
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
});


/**
 * Render a static, four-layer "Cosmic Helix" composition onto a 2D canvas in a single, non-animated pass.
 *
 * Draws four composited layers in back-to-front order — vesica piscis field, Tree of Life scaffold,
 * Fibonacci spiral, and double-helix lattice — then optionally renders a short notice string near the
 * bottom of the canvas. The function normalizes dimensions, palette, numerology constants, and per-layer
 * geometry by merging supplied options with safe defaults. The canvas context state and transform are
 * preserved (the function saves and restores the context).
 *
 * @param {CanvasRenderingContext2D} ctx - Target 2D canvas context (must have a valid `.canvas`).
 * @param {Object} [options] - Optional overrides.
 * @param {number} [options.width] - Explicit width to render; defaults to `ctx.canvas.width`.
 * @param {number} [options.height] - Explicit height to render; defaults to `ctx.canvas.height`.
 * @param {Object} [options.palette] - Partial palette to merge with defaults (bg, ink, muted, layers).
 * @param {Object} [options.NUM] - Numeric constant overrides merged against default numerology.
 * @param {Object} [options.geometry] - Per-layer geometry overrides (vesica, treeOfLife, fibonacci, helix).
 * @param {string} [options.notice] - Optional short notice text rendered near the bottom of the canvas.
 * @return {{ok: false, reason: string}|{ok: true, numerology: Object}}
 *   - On failure: { ok: false, reason } where reason is "missing-context" (invalid ctx) or "invalid-dimensions".
 *   - On success: { ok: true, numerology } where `numerology` is the numbers/constants object used for layout.
 */
export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas !== "object" || typeof ctx.save !== "function") {
    return { ok: false, reason: "missing-context" };
  }

  const dims = normaliseDimensions(ctx, options);
  if (!dims) {
    return { ok: false, reason: "invalid-dimensions" };
  }

  const numbers = normaliseNumbers(options.NUM);
  const palette = normalisePalette(options.palette);
  const geometry = normaliseGeometry(options.geometry, numbers);
  const notice = typeof options.notice === "string" && options.notice.trim() ? options.notice.trim() : "";

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  fillBackground(ctx, dims, palette.bg);

  const vesicaStats = drawVesicaField(ctx, dims, palette.layers[0], numbers, geometry.vesica);
  const treeStats = drawTreeOfLife(ctx, dims, palette, numbers, geometry.treeOfLife);
  const fibonacciStats = drawFibonacciCurve(ctx, dims, palette.layers[3], numbers, geometry.fibonacci);
  const helixStats = drawHelixLattice(ctx, dims, palette, numbers, geometry.helix);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette.ink, palette.muted, notice);
  }

  ctx.restore();



  return {


  return {

  return { ok: true, numerology };
}

  return {
    

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


  return {
    ok: true,
    summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats })
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
  const width = toPositiveNumber(options.width) || ctx.canvas.width;
  const height = toPositiveNumber(options.height) || ctx.canvas.height;
  if (!toPositiveNumber(width) || !toPositiveNumber(height)) {
    return null;
  }
  if (ctx.canvas.width !== width) {
    ctx.canvas.width = width;
  }
  if (ctx.canvas.height !== height) {
    ctx.canvas.height = height;
  }
  return { width, height };
}

/**
 * Return the input if it's a positive finite number, otherwise null.
 *
 * @param {*} value - Value to validate.
 * @return {number|null} The numeric value when it's > 0 and finite; null for all other inputs.
 */
function toPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}


/**
 * Merge user-provided numeric overrides into the canonical numerology constants.
 *
 * Accepts an optional candidate object and returns a new numbers object based on
 * FALLBACK_NUMBERS where any key present in `candidate` is accepted only if its
 * value is a positive finite number (> 0). Non-object or missing `candidate`
 * returns an unmodified clone of FALLBACK_NUMBERS.
 *
 * @param {Object} [candidate] - Optional map of numeric overrides keyed by the same names as FALLBACK_NUMBERS.
 * @return {Object} A new numbers object with validated overrides applied.
 */
function normaliseNumbers(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return { ...FALLBACK_NUMBERS };
  }
  const merged = { ...FALLBACK_NUMBERS };
  for (const key of Object.keys(FALLBACK_NUMBERS)) {
    if (typeof candidate[key] === "number" && Number.isFinite(candidate[key]) && candidate[key] > 0) {
      merged[key] = candidate[key];
    }
  }
  return merged;

}

function normalisePalette(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return clonePalette(FALLBACK_PALETTE);
  }
  const layers = Array.isArray(candidate.layers)
    ? candidate.layers.slice(0, FALLBACK_PALETTE.layers.length)
    : [];
  while (layers.length < FALLBACK_PALETTE.layers.length) {
    layers.push(FALLBACK_PALETTE.layers[layers.length]);
  }


/**
 * Return a shallow clone of a palette object.
 *
 * Copies the primitive color fields (bg, ink, muted) and produces a new array for `layers`
 * (shallow copy). Modifying the returned palette or its `layers` array will not mutate the source.
 *
 * @param {Object} palette - Source palette (may be partial); missing or invalid fields are replaced with defaults.
 * @return {{bg: string, ink: string, muted: string, layers: string[]}} Shallow-cloned palette.
 */
function clonePalette(palette) {


  return {
    bg: typeof candidate.bg === "string" ? candidate.bg : FALLBACK_PALETTE.bg,
    ink: typeof candidate.ink === "string" ? candidate.ink : FALLBACK_PALETTE.ink,
    muted: typeof candidate.muted === "string" ? candidate.muted : FALLBACK_PALETTE.muted,
    layers
  };
}

/**
 * Create a shallow clone of a palette object.
 *
 * Copies the top-level color fields and returns a new object with a shallow
 * copy of the layers array (so mutating the returned `layers` won't affect
 * the original array, but contained color strings are shared).
 *
 * @param {{bg:string,ink:string,muted:string,layers:string[]}} palette - Palette to clone.
 * @returns {{bg:string,ink:string,muted:string,layers:string[]}} A new palette object with a copied `layers` array.
 */
function clonePalette(palette) {
  return {
    bg: palette.bg,
    ink: palette.ink,
    muted: palette.muted,
    layers: palette.layers.slice()
  };
}

/**
 * Build a complete, validated geometry configuration by merging user-provided overrides into defaults.
 *
 * Takes an optional partial geometry `candidate` and a `numbers` numerology object, returns a fully-populated
 * geometry object with sections for `vesica`, `treeOfLife`, `fibonacci`, and `helix`. Each section is produced
 * by merging validated overrides into layer-specific defaults.
 *
 * @param {Object|undefined|null} candidate - Partial geometry overrides; may contain any of `vesica`, `treeOfLife`, `fibonacci`, or `helix`.
 * @param {Object} numbers - Numerology constants used to build sensible defaults (e.g., spacing/scales).
 * @returns {Object} Complete geometry object with keys: `vesica`, `treeOfLife`, `fibonacci`, and `helix`.
 */
function normaliseGeometry(candidate, numbers) {
  const base = createDefaultGeometry(numbers);
  if (!candidate || typeof candidate !== "object") {
    return base;
  }
  return {
    vesica: mergeVesicaGeometry(base.vesica, candidate.vesica),
    treeOfLife: mergeTreeGeometry(base.treeOfLife, candidate.treeOfLife),
    fibonacci: mergeFibonacciGeometry(base.fibonacci, candidate.fibonacci),
    helix: mergeHelixGeometry(base.helix, candidate.helix)
  };
}

/**
 * Create a complete default geometry configuration for all renderer layers.
 *
 * The returned object contains sensible, unitless layout constants for each
 * visual layer (vesica, treeOfLife, fibonacci, helix) derived from the
 * provided numerology constants. Values are intended to be combined with
 * canvas dimensions elsewhere (e.g., divisors produce sizes relative to the
 * drawing area). This function does not perform validation beyond using the
 * supplied numeric constants.
 *
 * @param {Object} num - Numerology constants used to build defaults (expected keys include NINE, SEVEN, ELEVEN, THIRTYTHREE, NINETYNINE, ONEFORTYFOUR, TWENTYTWO, THREE). Each value should be a finite positive number.
 * @return {Object} Default geometry object with keys:
 *   - vesica: { rows, columns, paddingDivisor, radiusScale, strokeDivisor, alpha }
 *   - treeOfLife: { marginDivisor, radiusDivisor, pathDivisor, nodeAlpha, pathAlpha, labelAlpha, nodes, edges }
 *   - fibonacci: { sampleCount, turns, baseRadiusDivisor, centerXFactor, centerYFactor, phi, markerInterval, alpha }
 *   - helix: { sampleCount, cycles, amplitudeDivisor, strandSeparationDivisor, crossTieCount, strandAlpha, rungAlpha }
 */
function createDefaultGeometry(num) {
  return {
    vesica: {
      rows: num.NINE,
      columns: num.ELEVEN,
      paddingDivisor: num.ELEVEN,
      radiusScale: num.SEVEN / num.THIRTYTHREE,
      strokeDivisor: num.NINETYNINE,
      alpha: 0.55
    },
    treeOfLife: {
      marginDivisor: num.ELEVEN,
      radiusDivisor: num.THIRTYTHREE,
      pathDivisor: num.NINETYNINE,
      nodeAlpha: 0.88,
      pathAlpha: 0.62,
      labelAlpha: 0.7,
      nodes: buildTreeNodes(),
      edges: buildTreeEdges()
    },
    fibonacci: {
      sampleCount: num.ONEFORTYFOUR,
      turns: num.THREE,
      baseRadiusDivisor: num.TWENTYTWO,
      centerXFactor: 0.34,
      centerYFactor: 0.58,
      phi: 1.618033988749895,
      markerInterval: num.ELEVEN,
      alpha: 0.85
    },
    helix: {
      sampleCount: num.ONEFORTYFOUR,
      cycles: num.THREE,
      amplitudeDivisor: num.NINE,
      strandSeparationDivisor: num.THIRTYTHREE,
      crossTieCount: num.THIRTYTHREE,
      strandAlpha: 0.82,
      rungAlpha: 0.6
    }
  };
}

/**
 * Merge user-provided vesica geometry overrides into a validated base geometry object.
 *
 * Merges the fields rows, columns, paddingDivisor, radiusScale, strokeDivisor, and alpha from `patch`
 * into `base`, validating values and falling back to `base` when inputs are invalid. `alpha` is clamped
 * to the [0, 1] range; `radiusScale` is accepted only if a positive number; numeric fields use the base
 * value when the corresponding patch value is not a positive number. If `patch` is falsy or not an object,
 * a shallow copy of `base` is returned.
 *
 * @param {Object} base - Base vesica geometry (should contain rows, columns, paddingDivisor, radiusScale, strokeDivisor, alpha).
 * @param {Object} [patch] - Partial overrides for the vesica geometry.
 * @return {Object} The merged and validated vesica geometry object.
 */
function mergeVesicaGeometry(base, patch) {
  if (!patch || typeof patch !== "object") {
    return { ...base };
  }
  return {
    rows: positiveOrDefault(patch.rows, base.rows),
    columns: positiveOrDefault(patch.columns, base.columns),
    paddingDivisor: positiveOrDefault(patch.paddingDivisor, base.paddingDivisor),
    radiusScale: typeof patch.radiusScale === "number" && patch.radiusScale > 0 ? patch.radiusScale : base.radiusScale,
    strokeDivisor: positiveOrDefault(patch.strokeDivisor, base.strokeDivisor),
    alpha: typeof patch.alpha === "number" ? clamp(patch.alpha, 0, 1) : base.alpha
  };
}

/**
 * Merge user-provided Tree-of-Life geometry overrides into a safe, fully-normalized geometry object.
 *
 * Produces a new geometry object based on `base` with numeric fields validated (positive divisors kept via
 * positiveOrDefault; alphas clamped to [0,1]) and array fields cloned. If `patch` supplies `nodes` or `edges`
 * they are sanitized: `nodes` are mapped through `normaliseTreeNode`, and `edges` are filtered to array entries
 * and truncated to node-pair tuples. If `patch` is absent or invalid the function returns a shallow-cloned
 * copy of `base` (nodes and edges are duplicated to avoid shared references).
 *
 * @param {Object} base - The fallback Tree-of-Life geometry (must contain numeric divisors, alphas, `nodes` and `edges`).
 * @param {Object|undefined|null} patch - Partial overrides; may include marginDivisor, radiusDivisor, pathDivisor,
 *   nodeAlpha, pathAlpha, labelAlpha, nodes, and edges. Invalid or missing properties are ignored in favor of `base`.
 * @return {Object} A merged, sanitized geometry object safe for rendering (contains marginDivisor, radiusDivisor,
 *   pathDivisor, nodeAlpha, pathAlpha, labelAlpha, nodes, and edges).
 */
function mergeTreeGeometry(base, patch) {
  if (!patch || typeof patch !== "object") {
    return {
      ...base,
      nodes: base.nodes.map((node) => ({ ...node })),
      edges: base.edges.map((edge) => edge.slice())
    };
  }
  return {
    marginDivisor: positiveOrDefault(patch.marginDivisor, base.marginDivisor),
    radiusDivisor: positiveOrDefault(patch.radiusDivisor, base.radiusDivisor),
    pathDivisor: positiveOrDefault(patch.pathDivisor, base.pathDivisor),
    nodeAlpha: typeof patch.nodeAlpha === "number" ? clamp(patch.nodeAlpha, 0, 1) : base.nodeAlpha,
    pathAlpha: typeof patch.pathAlpha === "number" ? clamp(patch.pathAlpha, 0, 1) : base.pathAlpha,
    labelAlpha: typeof patch.labelAlpha === "number" ? clamp(patch.labelAlpha, 0, 1) : base.labelAlpha,
    nodes: Array.isArray(patch.nodes) && patch.nodes.length
      ? patch.nodes.map(normaliseTreeNode)
      : base.nodes.map((node) => ({ ...node })),
    edges: Array.isArray(patch.edges) && patch.edges.length
      ? patch.edges.filter(Array.isArray).map((edge) => edge.slice(0, 2))
      : base.edges.map((edge) => edge.slice())
  };
}

/**
 * Normalize a Tree-of-Life node object, coercing fields and applying safe defaults.
 *
 * Returns a node with guaranteed properties: `id` (string), `title` (non-empty string),
 * `level` (number, default 0) and `xFactor` (number in [0,1], default 0.5).
 *
 * @param {Object} node - Partial node object to normalize.
 * @return {{id: string, title: string, level: number, xFactor: number}} The normalized node.
 */
function normaliseTreeNode(node) {
  return {
    id: String(node.id || ""),
    title: typeof node.title === "string" && node.title ? node.title : String(node.id || ""),
    level: typeof node.level === "number" ? node.level : 0,
    xFactor: typeof node.xFactor === "number" ? node.xFactor : 0.5
  };
}

/**
 * Merge Fibonacci geometry overrides into a base configuration and return a validated copy.
 *
 * Fields from `patch` override `base` only when valid; otherwise the base value is kept.
 * - `sampleCount`, `turns`, `baseRadiusDivisor`, `markerInterval` use `positiveOrDefault`.
 * - `centerXFactor` and `centerYFactor` are clamped to [0, 1].
 * - `phi` overrides only if numeric and greater than 1.
 * - `alpha` is clamped to [0, 1].
 *
 * @param {Object} base - Default Fibonacci geometry object.
 * @param {Object} [patch] - Partial overrides (ignored if not an object).
 * @return {Object} A new, sanitized Fibonacci geometry object.
 */
function mergeFibonacciGeometry(base, patch) {
  if (!patch || typeof patch !== "object") {
    return { ...base };
  }
  return {
    sampleCount: positiveOrDefault(patch.sampleCount, base.sampleCount),
    turns: positiveOrDefault(patch.turns, base.turns),
    baseRadiusDivisor: positiveOrDefault(patch.baseRadiusDivisor, base.baseRadiusDivisor),
    centerXFactor: typeof patch.centerXFactor === "number" ? clamp(patch.centerXFactor, 0, 1) : base.centerXFactor,
    centerYFactor: typeof patch.centerYFactor === "number" ? clamp(patch.centerYFactor, 0, 1) : base.centerYFactor,
    phi: typeof patch.phi === "number" && patch.phi > 1 ? patch.phi : base.phi,
    markerInterval: positiveOrDefault(patch.markerInterval, base.markerInterval),
    alpha: typeof patch.alpha === "number" ? clamp(patch.alpha, 0, 1) : base.alpha
  };
}

/**
 * Merge helix geometry overrides into a complete helix geometry object.
 *
 * Returns a new object combining `base` with numeric overrides from `patch`.
 * Numeric fields (sampleCount, cycles, amplitudeDivisor, strandSeparationDivisor, crossTieCount)
 * are accepted only if positive; otherwise the base values are preserved. Alpha fields
 * (strandAlpha, rungAlpha) are accepted when numeric and clamped to [0, 1]; otherwise the base
 * alpha values are preserved. If `patch` is falsy or not an object, a shallow clone of `base`
 * is returned.
 *
 * @param {object} base - Base helix geometry providing default numeric and alpha fields.
 * @param {object} [patch] - Partial overrides for helix geometry.
 * @return {object} Merged helix geometry with keys:
 *   `{ sampleCount, cycles, amplitudeDivisor, strandSeparationDivisor, crossTieCount, strandAlpha, rungAlpha }`.
 */
function mergeHelixGeometry(base, patch) {
  if (!patch || typeof patch !== "object") {
    return { ...base };
  }
  return {
    sampleCount: positiveOrDefault(patch.sampleCount, base.sampleCount),
    cycles: positiveOrDefault(patch.cycles, base.cycles),
    amplitudeDivisor: positiveOrDefault(patch.amplitudeDivisor, base.amplitudeDivisor),
    strandSeparationDivisor: positiveOrDefault(patch.strandSeparationDivisor, base.strandSeparationDivisor),
    crossTieCount: positiveOrDefault(patch.crossTieCount, base.crossTieCount),
    strandAlpha: typeof patch.strandAlpha === "number" ? clamp(patch.strandAlpha, 0, 1) : base.strandAlpha,
    rungAlpha: typeof patch.rungAlpha === "number" ? clamp(patch.rungAlpha, 0, 1) : base.rungAlpha
  };
}

/**
 * Return value if it's a positive finite number, otherwise return the fallback.
 *
 * @param {*} value - Candidate value to validate as a positive finite number.
 * @param {number} fallback - Numeric fallback returned when `value` is not a positive finite number.
 * @return {number} The original `value` when valid, otherwise `fallback`.
 */
function positiveOrDefault(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

/**
 * Clamp a numeric value to the inclusive range [min, max].
 *
 * @param {number} value - The value to clamp.
 * @param {number} min - Lower bound of the range.
 * @param {number} max - Upper bound of the range.
 * @return {number} The input constrained to the interval between `min` and `max`.
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Fill the canvas with a flat background color and overlay a soft radial glow.
 *
 * Renders a full-coverage background using bgColor, then adds a subtle radial
 * gradient centered slightly above the vertical center to give depth behind
 * the layered geometry.
 *
 * @param {CanvasRenderingContext2D} ctx - The drawing context (omitted from detailed param docs as a common service).
 * @param {{width: number, height: number}} dims - Canvas dimensions in pixels.
 * @param {string} bgColor - Base background color (any valid CSS color string).
 */
function fillBackground(ctx, dims, bgColor) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, dims.width, dims.height);

  // Soft radial glow keeps depth without animation (why: layered geometry covenant).
  const radius = Math.max(dims.width, dims.height) / 2;
  const gradient = ctx.createRadialGradient(
    dims.width / 2,
    dims.height / 3,
    radius / 9,
    dims.width / 2,
    dims.height / 2,
    radius
  );
  gradient.addColorStop(0, withAlpha("#ffffff", 0.05));
  gradient.addColorStop(1, withAlpha(bgColor, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

/**
 * Render a grid of vesica-style circles across the canvas and draw central axis guides.
 *
 * Draws a rows-by-columns grid of stroked circles (vesica anchors) positioned inside
 * a padded area, using configuration for spacing, radius scaling, stroke width, and alpha.
 * Also draws vertical and horizontal center guides to emphasize symmetry.
 *
 * @param {object} config - Grid and rendering parameters.
 * @param {number} config.columns - Number of columns (minimum 2).
 * @param {number} config.rows - Number of rows (minimum 2).
 * @param {number} config.paddingDivisor - Divisor of the smaller canvas dimension used to compute padding.
 * @param {number} config.radiusScale - Multiplier applied to the grid cell size to compute circle radius.
 * @param {number} config.strokeDivisor - Divisor of the canvas size used to compute stroke width.
 * @param {number} config.alpha - Global alpha applied while drawing this layer (0–1).
 * @return {{circles: number}} Object with the number of circles drawn.
 */
function drawVesicaField(ctx, dims, color, numbers, config) {
  const cols = Math.max(2, Math.round(config.columns));
  const rows = Math.max(2, Math.round(config.rows));
  const padding = Math.min(dims.width, dims.height) / config.paddingDivisor;
  const usableWidth = dims.width - padding * 2;
  const usableHeight = dims.height - padding * 2;
  const stepX = usableWidth / (cols - 1);
  const stepY = usableHeight / (rows - 1);
  const radius = Math.min(stepX, stepY) * config.radiusScale;
  const strokeWidth = Math.max(1, Math.min(dims.width, dims.height) / config.strokeDivisor);

  ctx.save();
  ctx.globalAlpha = config.alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;

  let circles = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = padding + col * stepX;
      const y = padding + row * stepY;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      circles += 1;
    }
  }

  // Axis guides emphasise the vesica symmetry without animation.
  ctx.globalAlpha = config.alpha * 0.8;
  ctx.beginPath();
  ctx.moveTo(dims.width / 2, padding);
  ctx.lineTo(dims.width / 2, dims.height - padding);
  ctx.moveTo(padding, dims.height / 2);
  ctx.lineTo(dims.width - padding, dims.height / 2);
  ctx.stroke();

  ctx.restore();
  return { circles };
}

function drawTreeOfLife(ctx, dims, palette, numbers, config) {
  const margin = Math.min(dims.width, dims.height) / config.marginDivisor;
  const maxLevel = Math.max(...config.nodes.map((node) => node.level));
  const verticalSpan = dims.height - margin * 2;
  const levelStep = maxLevel > 0 ? verticalSpan / maxLevel : 0;
  const radius = Math.min(dims.width, dims.height) / config.radiusDivisor;
  const pathWidth = Math.max(1.2, Math.min(dims.width, dims.height) / config.pathDivisor * numbers.THREE);


  const positions = new Map();
  for (const node of config.nodes) {
    const x = margin + clamp(node.xFactor, 0, 1) * (dims.width - margin * 2);
    const y = margin + node.level * levelStep;
    positions.set(node.id, { x, y, title: node.title });


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

    marginDivisor: positiveNumber(safe.marginDivisor, fallback.marginDivisor),
    radiusDivisor: positiveNumber(safe.radiusDivisor, fallback.radiusDivisor),
    labelOffset: finiteNumber(safe.labelOffset, fallback.labelOffset),
    labelLineHeight: positiveNumber(safe.labelLineHeight, fallback.labelLineHeight),
    labelFont: typeof safe.labelFont === "string" && safe.labelFont ? safe.labelFont : fallback.labelFont,
    nodes,
    edges

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
 * Fill the entire drawing area with the given color.
 *
 * Clears the canvas by filling a rectangle from (0,0) to (dims.width, dims.height).
 *
 * @param {{width: number, height: number}} dims - Canvas dimensions to clear.
 * @param {string} color - CSS color string used to fill the background.
 */



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


  const radius = Math.min(stepX, stepY) / settings.radiusFactor;
  const offset = radius * (numbers.ELEVEN / numbers.TWENTYTWO);
  const strokeWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / settings.strokeDivisor,
  );

  const radius = Math.min(stepX, stepY) / settings.radiusFactor;
  const offset = radius * (numbers.ELEVEN / numbers.TWENTYTWO);
  const strokeWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / settings.strokeDivisor,
  );

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

  const spanX = width - padding * 2;
  const spanY = height - padding * 2;
  const stepX = columns > 1 ? spanX / (columns - 1) : spanX;
  const stepY = rows > 1 ? spanY / (rows - 1) : spanY;
  const radius = Math.min(stepX, stepY) * (N.NINE / N.ELEVEN) / settings.radiusFactor;
  const strokeWidth = Math.max(1, Math.min(width, height) / settings.strokeDivisor) * (N.THIRTYTHREE / N.NINETYNINE);

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



  let circles = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const cx = padding + column * stepX;
      const cy = padding + row * stepY;
      strokeVesicaPair(ctx, cx, cy, radius, offset);
      circles += 2;



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



  let circles = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const cx = padding + column * stepX;
      const cy = padding + row * stepY;
      strokeVesicaPair(ctx, cx, cy, radius, offset);
      circles += 2;

  ctx.lineJoin = "round";


  let circles = 0;
  for (let row = 0; row < rows; row += 1) {

    const offset = row % 2 === 0 ? 0 : stepX / N.THREE;
    const baseY = padding + row * stepY;
    const y = clamp(baseY, padding, height - padding);
    for (let column = 0; column < columns; column += 1) {
      const baseX = padding + column * stepX + offset;
      const x = clamp(baseX, padding, width - padding);
      strokeCircle(ctx, x, y, radius);


    for (let column = 0; column < columns; column += 1) {
      const cx = padding + column * stepX;
      const cy = padding + row * stepY;
      strokeVesicaPair(ctx, cx, cy, radius, offset);
      circles += 2;

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
  return { circles, radius };

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

function strokeVesicaPair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
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



  const positions = new Map();
  for (const node of settings.nodes) {
    const x = margin + clamp01(node.xFactor) * usableWidth;
    const y = margin + node.level * levelStep;


  const positions = new Map();
  for (const node of settings.nodes) {
    const x = margin + clamp01(node.xFactor) * usableWidth;
    const y = margin + node.level * levelStep;
    positions.set(node.id, { x, y, node });

  }

  ctx.save();
  ctx.lineWidth = pathWidth;

  ctx.strokeStyle = palette.layers[1];
  ctx.globalAlpha = config.pathAlpha;
  ctx.beginPath();
  for (const [from, to] of config.edges) {
    const start = positions.get(from);
    const end = positions.get(to);

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


  // Calm connective lines sit behind the node glyphs (why: maintains layered depth).
  ctx.save();

  // Calm connective lines first so nodes remain readable (why: layered depth).


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

  ctx.stroke();
  ctx.restore();

  // Sephirot overlay to keep them legible.
  ctx.save();
  ctx.fillStyle = colorWithAlpha(nodeColor, 0.9);
  ctx.strokeStyle = colorWithAlpha(nodeColor, 0.9);
  ctx.lineWidth = Math.max(1, pathWidth * (N.THREE / N.TWENTYTWO));
  for (const entry of positions.values()) {

  ctx.restore();

  ctx.save();
  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, pathWidth * 0.75);
  for (const point of positions.values()) {
d

  ctx.strokeStyle = colorWithAlpha(pathColor, 0.75);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  tree.edges.forEach((edge) => {
    const start = positions.get(edge[0]);
    const end = positions.get(edge[1]);

    if (!start || !end) {
      continue;
    }
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
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
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

}

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

  const samples = Math.max(2, settings.sampleCount);
  const turns = Math.max(0, settings.turns);
  const totalAngle = turns * Math.PI * 2;
  const phi = Math.max(1.0001, settings.phi);
  const centerX = width * (N.ELEVEN / N.TWENTYTWO);
  const centerY = height * (N.SEVEN / N.ELEVEN);
  const baseRadius = Math.min(width, height) / settings.baseRadiusDivisor;
  const lineWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

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


  for (let index = 0; index < samples; index += 1) {
    const t = samples > 1 ? index / (samples - 1) : 0;

  for (let index = 0; index < samples; index += 1) {
    const t = samples > 1 ? index / (samples - 1) : 0;


  for (let index = 0; index < samples; index += 1) {
    const t = samples > 1 ? index / (samples - 1) : 0;

    const angle = t * totalAngle;
    const radius = baseRadius * Math.pow(phi, t * turns * (N.THREE / N.SEVEN));
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);


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


  return { points: samples };
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


  return { points: samples };
}




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
  ctx.stroke();

  ctx.globalAlpha = config.nodeAlpha;
  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, radius / numbers.SEVEN);
  for (const node of config.nodes) {
    const pos = positions.get(node.id);
    if (!pos) {
      continue;
    }
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.globalAlpha = config.labelAlpha;
  ctx.fillStyle = palette.ink;
  ctx.font = `${Math.max(10, radius * 1.5)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const node of config.nodes) {
    const pos = positions.get(node.id);
    if (!pos) {
      continue;
    }
    ctx.fillText(node.title, pos.x, pos.y + radius * 1.1);
  }

  ctx.restore();
  return { nodes: config.nodes.length, paths: config.edges.length };
}

function drawFibonacciCurve(ctx, dims, color, numbers, config) {
  const samples = Math.max(2, Math.round(config.sampleCount));
  const maxTheta = config.turns * Math.PI;
  const step = maxTheta / (samples - 1);
  const minDim = Math.min(dims.width, dims.height);
  const baseRadius = minDim / config.baseRadiusDivisor;
  const centerX = dims.width * clamp(config.centerXFactor, 0, 1);
  const centerY = dims.height * clamp(config.centerYFactor, 0, 1);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = config.alpha;
  ctx.lineWidth = Math.max(1.2, minDim / numbers.NINETYNINE * numbers.THREE);
  ctx.beginPath();

  const points = [];
  for (let i = 0; i < samples; i += 1) {
    const theta = i * step;
    const radius = baseRadius * Math.pow(config.phi, theta / Math.PI);
    const x = centerX + Math.cos(theta) * radius;
    const y = centerY + Math.sin(theta) * radius;
    points.push({ x, y });
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.fillStyle = color;
  const markerRadius = Math.max(2, minDim / numbers.ONEFORTYFOUR);
  let markers = 0;
  for (let i = 0; i < points.length; i += config.markerInterval) {
    const point = points[i];
    ctx.beginPath();
    ctx.arc(point.x, point.y, markerRadius, 0, Math.PI * 2);
    ctx.fill();
    markers += 1;
  }

  ctx.restore();
  return { samples, markers };
}

function drawHelixLattice(ctx, dims, palette, numbers, config) {
  const samples = Math.max(2, Math.round(config.sampleCount));
  const minDim = Math.min(dims.width, dims.height);
  const amplitude = minDim / config.amplitudeDivisor;
  const separation = minDim / config.strandSeparationDivisor;
  const baseY = dims.height / 2;
  const stepX = dims.width / (samples - 1);

  ctx.save();
  ctx.lineWidth = Math.max(1.4, minDim / numbers.NINETYNINE * numbers.THREE);

  const strandA = [];
  const strandB = [];
  for (let i = 0; i < samples; i += 1) {
    const t = i / (samples - 1);
    const angle = t * config.cycles * Math.PI * 2;
    const x = i * stepX;
    const yA = baseY - separation / 2 + Math.sin(angle) * amplitude;
    const yB = baseY + separation / 2 + Math.sin(angle + Math.PI) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.globalAlpha = config.strandAlpha;
  ctx.strokeStyle = palette.layers[4];
  ctx.beginPath();
  for (let i = 0; i < strandA.length; i += 1) {
    const point = strandA[i];
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.stroke();

  ctx.strokeStyle = palette.layers[5];
  ctx.beginPath();
  for (let i = 0; i < strandB.length; i += 1) {
    const point = strandB[i];
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }2q`
  ctx.stroke();

  ctx.globalAlpha = config.rungAlpha;
  ctx.strokeStyle = palette.muted || palette.ink;
  const ties = Math.max(1, Math.round(config.crossTieCount));
  for (let i = 0; i < ties; i += 1) {
    const index = Math.round((i / (ties - 1 || 1)) * (samples - 1));
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
  return { strandPoints: samples * 2, crossTies: ties };
}

function drawCanvasNotice(ctx, dims, ink, muted, text) {
  ctx.save();
  ctx.globalAlpha = 1;
  const padding = Math.min(dims.width, dims.height) / 33;
  const x = padding;
  const y = dims.height - padding * 1.4;
  const background = withAlpha(muted || ink, 0.35);
  const fontSize = Math.max(12, Math.min(dims.width, dims.height) / 48);

  ctx.font = `${fontSize}px system-ui`;
  const width = ctx.measureText(text).width + padding;

/**

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


  ctx.fillStyle = background;
  ctx.fillRect(x - padding / 4, y - fontSize, width, fontSize * 1.8);

  ctx.fillStyle = ink;
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y - fontSize * 0.2);
  ctx.restore();
}


/**
 * Build a concise one-line summary of rendered layer statistics.
 *
 * Produces a human-readable summary string like:
 * "Vesica 24 circles · Paths 10 / Nodes 10 · Spiral 128 samples · Helix 32 ties"
 *
 * @param {Object} stats - Per-layer statistics produced by the renderer.
 *   Expected shape:
 *     - stats.vesicaStats.circles {number}  — number of circles drawn in the Vesica field.
 *     - stats.treeStats.paths {number}     — number of Tree-of-Life edges drawn.
 *     - stats.treeStats.nodes {number}     — number of Tree-of-Life nodes placed.
 *     - stats.fibonacciStats.samples {number} — number of sampled points on the spiral.
 *     - stats.helixStats.crossTies {number} — number of cross-ties (rungs) drawn on the helix.
 * @return {string} A single-line summary combining the above counts.
 */
function summariseLayers(stats) {
  const vesicaPart = `Vesica ${stats.vesicaStats.circles} circles`;
  const treePart = `Paths ${stats.treeStats.paths} / Nodes ${stats.treeStats.nodes}`;
  const fibPart = `Spiral ${stats.fibonacciStats.samples} samples`;
  const helixPart = `Helix ${stats.helixStats.crossTies} ties`;
  return `${vesicaPart} · ${treePart} · ${fibPart} · ${helixPart}`;
}

/**
 * Return an RGBA color string by applying an alpha value to a hex color, or pass-through non-hex inputs.
 *
 * If `color` is a hex string (e.g. "#abc" or "#aabbcc"), converts it to `"rgba(r, g, b, a)"` using the provided
 * `alpha` (clamped to [0,1]). If `color` is not a leading-`#` hex string, the original `color` value is returned unchanged.
 *
 * @param {string} color - Hex color string with a leading `#` (3- or 6-digit). Any non-hex input is returned as-is.
 * @param {number} alpha - Opacity in the range [0, 1]; values outside the range are clamped.
 * @returns {string} An `rgba(r, g, b, a)` string for hex inputs, or the original `color` for non-hex inputs.
 */
function withAlpha(color, alpha) {
  const value = typeof color === "string" ? color.trim() : "";
  if (!value.startsWith("#")) {
    return color;
  }
  const hex = value.slice(1);
  const bigint = hex.length === 3
    ? parseInt(hex.split("").map((ch) => ch + ch).join(""), 16)
    : parseInt(hex.padEnd(6, "0"), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

/**
 * Return the canonical Tree of Life node templates used for positioning and labeling.
 *
 * Each returned element is a node descriptor with:
 * - id: unique string key,
 * - title: human-readable label,
 * - level: integer vertical level (0 = top/root, larger = lower),
 * - xFactor: horizontal placement as a 0..1 fraction of available width.
 *
 * @return {Array<{id:string,title:string,level:number,xFactor:number}>} Array of node descriptors in canonical order.
 */
function buildTreeNodes() {
  return [
    { id: "kether", title: "Kether", level: 0, xFactor: 0.5 },
    { id: "chokmah", title: "Chokmah", level: 1, xFactor: 0.72 },
    { id: "binah", title: "Binah", level: 1, xFactor: 0.28 },
    { id: "chesed", title: "Chesed", level: 2, xFactor: 0.68 },
    { id: "geburah", title: "Geburah", level: 2, xFactor: 0.32 },
    { id: "tiphareth", title: "Tiphareth", level: 3, xFactor: 0.5 },
    { id: "netzach", title: "Netzach", level: 4, xFactor: 0.66 },
    { id: "hod", title: "Hod", level: 4, xFactor: 0.34 },
    { id: "yesod", title: "Yesod", level: 5, xFactor: 0.5 },
    { id: "malkuth", title: "Malkuth", level: 6, xFactor: 0.5 }
  ];
}

function buildTreeEdges() {
  return [
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
  ];
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
 * Stroke a polyline connecting an ordered list of points on the given 2D canvas context.
 *
 * Does nothing when `points` is not a non-empty array. The function issues a single
 * stroked path (beginPath/moveTo/lineTo/stroke) — the context's current stroke style,
 * lineWidth, lineJoin, and lineCap are used.
 *
 * @param {Array<{x: number, y: number}>} points - Ordered vertices of the polyline; each item must have numeric `x` and `y`.
 */



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
 * Coerce a value to a positive finite number, using a fallback when invalid.
 *
 * Converts `value` with `Number(value)` and returns it if it is finite and greater than 0.
 * Otherwise returns `Number(fallback)`.
 *
 * @param {*} value - Input to coerce to a positive finite number.
 * @param {*} fallback - Fallback used when `value` is not a positive finite number; also converted with `Number()`.
 * @returns {number} A positive finite number (result of `Number(value)` or `Number(fallback)`).
 */


function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;



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

 * Convert a value to a finite number clamped into the inclusive range [0, 1].
 *
 * Non-numeric or non-finite inputs (NaN, Infinity, -Infinity) and values < 0 return 0.
 * Values > 1 return 1. Valid finite numbers between 0 and 1 are returned unchanged.
 *
 * @param {*} value - Input to coerce to a number and clamp.
 * @return {number} A number in the range [0, 1].
 */
function clamp01(value) {

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

function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : Number(fallback);
}

function toPositiveInteger(value, fallback) {
  const number = Number(value);
  const rounded = Math.round(number);
  return Number.isFinite(number) && rounded > 0 ? rounded : Number(fallback);

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
 * Convert the input to a positive finite number; return the provided fallback if conversion fails or the result is not > 0.
 * @param {*} value - Value to convert to a positive finite number.
 * @param {number} fallback - Value returned when conversion is not a positive finite number.
 * @returns {number} The parsed positive finite number or the provided fallback.
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
 * Convert an input to a positive integer by rounding; returns the fallback when conversion fails or yields a non-positive value.
 *
 * The function attempts to coerce `value` to a Number, rounds it with `Math.round`, and returns the rounded value only if the
 * original numeric coercion produced a finite number and the rounded result is > 0. Otherwise the provided `fallback` is returned.
 *
 * @param {*} value - The value to convert to a positive integer.
 * @param {number} fallback - The value to return when `value` cannot be converted into a positive integer.
 * @returns {number} A positive integer (rounded result) or the provided `fallback`.
 * Coerce a value to a positive integer by numeric conversion and rounding; if the result is not a positive integer, return the provided fallback.
 * @param {*} value - Input to convert (will be Number(value) then Math.round).
 * @param {number} fallback - Returned when conversion fails to produce an integer > 0.
 * @return {number} The rounded positive integer or the fallback.
 */
function positiveInteger(value, fallback) {
  const parsed = Number(value);
  const rounded = Math.round(parsed);

  return Number.isFinite(parsed) && rounded > 0 ? rounded : fallback;

  return Number.isInteger(rounded) && rounded > 0 ? rounded : fallback;

}

/**
 * Convert a value to a finite number, returning a fallback if conversion fails.
 *
 * Attempts to coerce `value` with `Number(value)` and returns the result if it's a finite number;
 * otherwise returns `fallback`.
 *
 * @param {*} value - Value to convert to a number.
 * @param {number} fallback - Value to return when `value` does not produce a finite number.
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
 * Convert a value to a finite alpha in the [0, 1] range, or return a fallback.
 *
 * If `value` can be parsed to a finite number it is clamped to the inclusive range [0, 1].
 * Otherwise the provided `fallback` is returned unchanged.
 *
 * @param {*} value - The input to convert to an alpha value.
 * @param {number} fallback - Value to return when `value` is not a finite number.
 * @return {number} A number in [0, 1] (from the clamped input) or `fallback` when input is invalid.

 * Clamp an input to the [0, 1] range, with special handling for exact zero and a fallback.
 *
 * Converts `value` to a Number and returns it clamped to [0, 1]. If `value === 0` the function
 * returns 0 exactly (preserving zero distinct from other falsy or invalid inputs). If `value`
 * is not a finite number, the provided `fallback` is returned unchanged.
 *
 * @param {*} value - The candidate value to clamp; may be any type that can be converted to Number.
 * @param {*} fallback - Value to return when `value` is not a finite number.
 * @return {number|*} A number in [0,1] when `value` is finite (or 0 when exactly zero); otherwise `fallback`.


 * Clamp a numeric value to the [0,1] range, returning a fallback when the input cannot be parsed as a finite number.
 *
 * @param {*} value - Value to coerce to a Number and clamp.
 * @param {number} fallback - Value returned when `value` is not a finite number.
 * @return {number} The parsed value clamped to [0, 1], or `fallback` if parsing produced a non-finite number.

 * Normalize an alpha-like value to the [0,1] range while preserving an explicit zero.
 *
 * Converts the input to a Number and returns it clamped to [0,1] when finite. If the
 * input is exactly 0, returns 0 (preserves intentional zero). If the input is not a
 * finite number, returns the provided fallback value.
 *
 * @param {*} value - Value to normalize; can be any type coercible to Number.
 * @param {number} fallback - Value returned when `value` is not a finite number.
 * @return {number} A number in [0,1] (or 0) when `value` is finite, otherwise `fallback`.
 * Clamp a numeric value to the [0,1] range, returning a fallback when the input cannot be parsed as a finite number.
 *
 * @param {*} value - Value to coerce to a Number and clamp.
 * @param {number} fallback - Value returned when `value` is not a finite number.
 * @return {number} The parsed value clamped to [0, 1], or `fallback` if parsing produced a non-finite number.
 */
function clampAlpha(value, fallback) {



 */
function clampAlpha(value, fallback) {

  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return Math.min(1, Math.max(0, parsed));


  if (value === 0) {
    return 0;
  }
  const number = Number(value);
  if (Number.isFinite(number)) {
    return clamp01(number);

  }
  return fallback;



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
 * Convert a 6‑digit hex color to an `rgba(...)` string, with alpha clamped to [0,1].
 *
 * If `hex` is not a valid 6‑character hex (optionally prefixed with `#`), returns white with the provided alpha.
 *
 * @param {string} hex - Hex color string (e.g. `"#ff8800"` or `"ff8800"`). Only 6‑digit hex is supported.
 * @param {number} alpha - Desired alpha; values are clamped into the [0, 1] range.
 * @returns {string} An `rgba(r,g,b,a)` CSS color string.
 */

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

