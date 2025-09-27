/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (back to front):
    1) Vesica field - intersecting circles establishing the womb-of-forms grid.
    2) Tree-of-Life scaffold - ten sephirot nodes and twenty-two calm paths.
    3) Fibonacci curve - logarithmic spiral sampled over 144 points.
    4) Double-helix lattice - two still strands tied by thirty-three crossbars.

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
 * Render the full, non-animated cosmic helix composition onto a 2D canvas.
 *
 * Renders four layered elements (Vesica field, Tree-of-Life scaffold, Fibonacci spiral,
 * and double-helix lattice) in a single pass. Validates the provided canvas context and
 * normalizes dimensions, numerology constants, palette, and per-layer geometry from
 * the optional `options` object. Restores the canvas state before returning.
 *
 * @param {CanvasRenderingContext2D} ctx - Target 2D canvas context (must have a valid .canvas).
 * @param {Object} [options] - Rendering options.
 * @param {number} [options.width] - Optional explicit canvas width; if omitted uses ctx.canvas.width.
 * @param {number} [options.height] - Optional explicit canvas height; if omitted uses ctx.canvas.height.
 * @param {Object} [options.palette] - Optional palette overrides (bg, ink, muted, layers).
 * @param {Object} [options.NUM] - Optional numerology overrides; merged with defaults.
 * @param {Object} [options.geometry] - Optional per-layer geometry overrides; merged with defaults.
 * @param {string} [options.notice] - Optional short notice text rendered near the canvas footer.
 * @returns {{ok: true, summary: string}|{ok: false, reason: string}} If successful returns {ok:true, summary}
 *          where summary is a short textual summary of drawn elements; on failure returns {ok:false, reason}
 *          with reason values like "missing-context" or "invalid-dimensions".
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

  const vesicaStats = drawVesicaField(ctx, dims, palette, numbers, geometry.vesica);
  const treeStats = drawTreeOfLife(ctx, dims, palette, numbers, geometry.treeOfLife);
  const fibonacciStats = drawFibonacciCurve(ctx, dims, palette.layers[3], numbers, geometry.fibonacci);
  const helixStats = drawHelixLattice(ctx, dims, palette, numbers, geometry.helix);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette.ink, palette.muted, notice);
  }

  ctx.restore();

  return {
    ok: true,
    summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats })
  };
}

/**
 * Ensure canvas dimensions are positive and apply them to the context's canvas.
 *
 * Normalizes width/height from options (falling back to ctx.canvas dimensions), validates both are positive numbers, updates ctx.canvas.width and ctx.canvas.height when they differ, and returns the resulting { width, height } pair. Returns null if either dimension is invalid.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context whose canvas will be inspected/updated.
 * @param {Object} options - Configuration object that may include width/height.
 * @param {number} [options.width] - Desired canvas width in pixels.
 * @param {number} [options.height] - Desired canvas height in pixels.
 * @return {{width: number, height: number}|null} Normalized dimensions, or null when validation fails.
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
 * Return the input when it is a finite positive number, otherwise null.
 *
 * @param {*} value - Candidate value to validate.
 * @returns {number|null} The original numeric value if > 0 and finite; otherwise `null`.
 */
function toPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Merge a candidate numerology object with the default numerology constants.
 *
 * Returns a new object containing all keys from FALLBACK_NUMBERS where any
 * numeric, finite, positive values from `candidate` override the defaults.
 * If `candidate` is not an object, a shallow copy of FALLBACK_NUMBERS is returned.
 *
 * @param {Object} candidate - Partial numerology values to override defaults.
 * @return {Object} A merged numerology object with the same keys as FALLBACK_NUMBERS.
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

/**
 * Normalize a palette object, validating fields and filling missing values from FALLBACK_PALETTE.
 *
 * Accepts a candidate palette and returns a palette with guaranteed properties:
 * - bg, ink, muted: strings (fall back to FALLBACK_PALETTE when missing or not a string)
 * - layers: array with the same length as FALLBACK_PALETTE.layers; items from `candidate.layers`
 *   are used where present, and any missing entries are filled from the fallback. The returned
 *   layers array is a shallow copy.
 *
 * @param {object|undefined|null} candidate - Partial palette provided by the caller.
 * @return {{bg:string,ink:string,muted:string,layers:array}} Normalized palette suitable for rendering.
 */
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
  return {
    bg: typeof candidate.bg === "string" ? candidate.bg : FALLBACK_PALETTE.bg,
    ink: typeof candidate.ink === "string" ? candidate.ink : FALLBACK_PALETTE.ink,
    muted: typeof candidate.muted === "string" ? candidate.muted : FALLBACK_PALETTE.muted,
    layers
  };
}

/**
 * Return a shallow clone of a palette object (duplicates the layers array).
 * @param {Object} palette - Palette with keys `bg`, `ink`, `muted` and `layers` (array of layer colors).
 * @returns {Object} A new palette object with the same scalar fields and a shallow-copied `layers` array.
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
 * Build a complete geometry configuration by merging a user-supplied patch onto the renderer's defaults.
 *
 * If `candidate` is not an object, returns the full default geometry derived from `numbers`.
 *
 * @param {object|null|undefined} candidate - Partial geometry overrides. May contain any of `vesica`, `treeOfLife`, `fibonacci`, or `helix` objects; each provided sub-object will be merged onto the corresponding default.
 * @param {object} numbers - Numerology constants used to generate the default geometry (the same shape produced by normaliseNumbers / FALLBACK_NUMBERS).
 * @return {{vesica: object, treeOfLife: object, fibonacci: object, helix: object}} Complete geometry configuration ready for rendering.
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
 * Create the default geometry configuration for all visual layers based on numerology.
 *
 * Returns an object containing configuration for the four renderer layers: `vesica`, `treeOfLife`,
 * `fibonacci`, and `helix`. Numeric fields are derived from the `num` constants (e.g., `NINE`,
 * `ELEVEN`, `THIRTYTHREE`) and include sensible defaults for counts, divisors, alpha values, and
 * other layout/scaling factors used by the renderer.
 *
 * Note: this function calls `buildTreeNodes()` and `buildTreeEdges()` to populate the default
 * `treeOfLife.nodes` and `treeOfLife.edges`.
 *
 * @param {object} num - Numerology constants used to derive default numeric settings.
 * @return {object} Default geometry object with the following keys: `vesica`, `treeOfLife`,
 *                  `fibonacci`, and `helix`.
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
 * Merge a vesica-layer geometry patch into a base configuration, returning a new merged object.
 *
 * Scalar fields in `patch` override `base` only when they pass simple validation:
 * - `rows`, `columns`, `paddingDivisor`, `strokeDivisor` must be positive numbers.
 * - `radiusScale` must be a number > 0.
 * - `alpha` is accepted if numeric and is clamped to the [0, 1] range.
 *
 * @param {Object} base - The default vesica geometry to merge into (used as fallbacks).
 * @param {Object} [patch] - Partial geometry values to override the base.
 * @return {Object} A new geometry object with merged and validated fields: { rows, columns, paddingDivisor, radiusScale, strokeDivisor, alpha }.
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
 * Merge Tree-of-Life geometry base with an optional patch, producing a validated geometry object.
 *
 * Scalar fields (marginDivisor, radiusDivisor, pathDivisor) prefer positive patch values and fall back to base.
 * Alpha fields (nodeAlpha, pathAlpha, labelAlpha) accept numeric patch values clamped to [0, 1].
 * If `patch.nodes` is a non-empty array the nodes are normalized; otherwise a shallow copy of `base.nodes` is returned.
 * If `patch.edges` is a non-empty array the entries are filtered to array pairs and truncated to two elements;
 * otherwise a shallow copy of `base.edges` is returned.
 *
 * @param {object} base - Source geometry containing default Tree-of-Life configuration (must include `nodes` and `edges` arrays).
 * @param {object} [patch] - Partial overrides; non-object or falsy values cause a deep-ish copy of `base` to be returned.
 * @returns {object} The merged and normalized Tree-of-Life geometry object.
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
 * Normalize a Tree-of-Life node object into the canonical node shape used by the renderer.
 *
 * Converts/validates fields and supplies sensible defaults:
 * - id: coerced to a string (empty string if missing).
 * - title: preserved if a non-empty string, otherwise defaults to the stringified id.
 * - level: preserved if a number, otherwise 0.
 * - xFactor: preserved if a number, otherwise 0.5.
 *
 * @param {object} node - Candidate node object (may be partial or malformed).
 * @return {{id: string, title: string, level: number, xFactor: number}} Normalized node.
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
 * Merge a partial Fibonacci geometry patch into a base Fibonacci geometry.
 *
 * Returns a new geometry object where valid numeric fields from `patch`
 * override `base`. Validation rules:
 * - Positive numeric fields (sampleCount, turns, baseRadiusDivisor, markerInterval)
 *   must be > 0; otherwise the base value is used.
 * - centerXFactor and centerYFactor are constrained to [0, 1].
 * - phi is accepted only if numeric and > 1.
 * - alpha is constrained to [0, 1].
 *
 * @param {Object} base - The base Fibonacci geometry (complete defaults).
 * @param {Object} [patch] - Partial overrides; non-object or missing `patch` returns a shallow copy of `base`.
 * @returns {Object} The merged Fibonacci geometry.
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
 * Merge a partial helix geometry patch onto a base helix geometry, returning a new merged object.
 *
 * Only numeric and sensible values from `patch` are applied:
 * - sampleCount, cycles, amplitudeDivisor, strandSeparationDivisor, crossTieCount:
 *   must be positive numbers (otherwise the base value is used).
 * - strandAlpha, rungAlpha: numeric values clamped to the inclusive [0, 1] range.
 *
 * The function is non-mutating: it does not modify `base` or `patch`.
 *
 * @param {Object} base - Source/default helix geometry object (expected numeric fields).
 * @param {Object} [patch] - Partial geometry overrides; any missing or invalid fields are ignored.
 * @returns {Object} A new helix geometry object with merged and validated values.
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
 * Return a numeric value if it is a finite positive number; otherwise return a fallback.
 *
 * @param {number} value - Candidate numeric value to validate.
 * @param {number} fallback - Value returned when `value` is not a finite number > 0.
 * @return {number} `value` when valid; otherwise `fallback`.
 */
function positiveOrDefault(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

/**
 * Clamp a numeric value to the inclusive [min, max] range.
 * @param {number} value - The number to clamp.
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (inclusive).
 * @return {number} The clamped value.
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Paints the canvas background and overlays a soft radial glow.
 *
 * Fills the entire drawing surface with the provided background color, then applies
 * a subtle radial gradient centered slightly above the vertical midpoint to add depth.
 *
 * @param {{width:number,height:number}} dims - Canvas dimensions used to size fills and gradient.
 * @param {string} bgColor - Background color (any CSS color string, typically a hex value).
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
 * Draws a grid of vesica-style circles and architectural guides onto the canvas context.
 *
 * Renders a rows x columns lattice of stroked circles sized and spaced to fit within the given
 * dimensions, using palette-driven colours. Adds orthogonal and diagonal guides plus a mandorla
 * glow and eight-point star to echo the cathedral imagery supplied by the user brief.
 *
 * @param {Object} dims - Canvas dimensions in pixels: { width, height }.
 * @param {Object} palette - Palette providing layered colours (`layers`, `ink`).
 * @param {Object} numbers - Numerology constants object.
 * @param {Object} config - Geometry options (rows, columns, paddingDivisor, radiusScale, strokeDivisor, alpha).
 * @return {{ circles: number }} An object with the total number of grid circles drawn.
 */
function drawVesicaField(ctx, dims, palette, numbers, config) {
  const primary = palette.layers[0];
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
  ctx.strokeStyle = primary;
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

  const accent = palette.layers[3] || primary;
  const halo = palette.layers[2] || accent;

  // Axis guides emphasise the vesica symmetry without motion.
  ctx.globalAlpha = config.alpha * 0.8;
  ctx.strokeStyle = withAlpha(primary, 0.8);
  ctx.beginPath();
  ctx.moveTo(dims.width / 2, padding);
  ctx.lineTo(dims.width / 2, dims.height - padding);
  ctx.moveTo(padding, dims.height / 2);
  ctx.lineTo(dims.width - padding, dims.height / 2);
  ctx.stroke();

  // Diagonal guides create the "portal" diamond without animation or harsh contrast.
  ctx.globalAlpha = config.alpha * 0.6;
  ctx.strokeStyle = withAlpha(primary, 0.5);
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(dims.width - padding, dims.height - padding);
  ctx.moveTo(dims.width - padding, padding);
  ctx.lineTo(padding, dims.height - padding);
  ctx.stroke();

  ctx.restore();

  drawMandorlaGlow(ctx, dims, {
    core: accent,
    rim: halo,
    ink: palette.ink,
    alpha: clamp(config.alpha * 1.1, 0, 1)
  }, numbers);
  drawPortalRing(ctx, dims, accent, palette.ink, numbers);
  drawPortalStar(ctx, dims, palette, numbers);

  return { circles };
}

/**
 * Paint a central mandorla glow reinforcing the vesica womb-of-forms without animation.
 *
 * @param {CanvasRenderingContext2D} ctx - Target context.
 * @param {{width:number,height:number}} dims - Canvas dimensions.
 * @param {{core:string,rim:string,ink:string,alpha:number}} colors - Palette slice.
 * @param {Object} numbers - Numerology constants for scale ratios.
 */
function drawMandorlaGlow(ctx, dims, colors, numbers) {
  ctx.save();
  const centerX = dims.width / 2;
  const centerY = dims.height * 0.52;
  const minDim = Math.min(dims.width, dims.height);
  const lensRadiusX = minDim / numbers.THREE * 0.78;
  const lensRadiusY = lensRadiusX * 0.62;

  ctx.globalAlpha = clamp(colors.alpha, 0, 1);
  const gradient = ctx.createRadialGradient(centerX, centerY, lensRadiusY / numbers.SEVEN, centerX, centerY, lensRadiusX);
  gradient.addColorStop(0, withAlpha(colors.core, 0.38));
  gradient.addColorStop(1, withAlpha(colors.core, 0));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, lensRadiusX, lensRadiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.lineWidth = Math.max(1.4, minDim / numbers.NINETYNINE * numbers.SEVEN);
  ctx.strokeStyle = withAlpha(colors.rim, 0.75);
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, lensRadiusX, lensRadiusY, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Vertical spine suggests cathedral nave without motion.
  ctx.strokeStyle = withAlpha(colors.ink, 0.28);
  ctx.lineWidth = Math.max(1, minDim / numbers.ONEFORTYFOUR * numbers.THREE);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - lensRadiusY * 1.6);
  ctx.lineTo(centerX, centerY + lensRadiusY * 1.6);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw concentric portal rings anchoring the vesica to the cathedral floorplan.
 * @param {CanvasRenderingContext2D} ctx - Target context.
 * @param {{width:number,height:number}} dims - Canvas dimensions.
 * @param {string} accent - Main accent colour for the ring.
 * @param {string} ink - Ink colour for secondary ring.
 * @param {Object} numbers - Numerology constants for ratio control.
 */
function drawPortalRing(ctx, dims, accent, ink, numbers) {
  ctx.save();
  const centerX = dims.width / 2;
  const centerY = dims.height * 0.52;
  const minDim = Math.min(dims.width, dims.height);
  const outerRadius = minDim / (numbers.NINETYNINE / numbers.NINE);

  ctx.lineWidth = Math.max(1.2, minDim / numbers.THIRTYTHREE);
  ctx.strokeStyle = withAlpha(accent, 0.45);
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = Math.max(1, ctx.lineWidth / 2);
  ctx.strokeStyle = withAlpha(ink, 0.24);
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius * 0.72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw the static eight-pointed star referencing cathedral rose windows.
 * @param {CanvasRenderingContext2D} ctx - Target context.
 * @param {{width:number,height:number}} dims - Canvas dimensions.
 * @param {Object} palette - Palette (uses layers + ink).
 * @param {Object} numbers - Numerology constants.
 */
function drawPortalStar(ctx, dims, palette, numbers) {
  const centerX = dims.width / 2;
  const centerY = dims.height * 0.52;
  const minDim = Math.min(dims.width, dims.height);
  const outerRadius = minDim / numbers.THREE * 0.68;
  const innerRadius = outerRadius / (numbers.ELEVEN / numbers.SEVEN);
  const strokeColor = withAlpha(palette.ink, 0.82);
  const fillColor = withAlpha(palette.layers[5] || palette.layers[1], 0.18);
  const lineWidth = Math.max(1.2, outerRadius / numbers.THIRTYTHREE * numbers.THREE);

  drawStarPolygon(ctx, {
    centerX,
    centerY,
    outerRadius,
    innerRadius,
    points: numbers.ELEVEN - numbers.THREE, // yields 8-point star
    rotation: Math.PI / numbers.NINE,
    stroke: strokeColor,
    fill: fillColor,
    lineWidth
  });
}

/**
 * Render the Tree-of-Life scaffold onto the provided canvas context.
 *
 * Draws edges between configured nodes, renders nodes as filled circles with strokes,
 * and labels each node. Uses sizing and opacity from `config` and numeric constants
 * from `numbers`.
 *
 * @param {Object} dims - Canvas dimensions; must include numeric `width` and `height`.
 * @param {Object} palette - Color palette; expects `layers` array and `ink` property.
 * @param {Object} numbers - Numerology constants used for sizing (e.g. `THREE`, `SEVEN`).
 * @param {Object} config - Tree geometry and styling:
 *   - nodes: Array of node objects { id, title, level, xFactor } (xFactor in [0,1]).
 *   - edges: Array of `[fromId, toId]` pairs describing connections.
 *   - marginDivisor, radiusDivisor, pathDivisor: numeric layout scalars.
 *   - nodeAlpha, pathAlpha, labelAlpha: numeric opacities in [0,1].
 *
 * @return {{nodes: number, paths: number}} Counts of nodes and edges processed.
 */
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
  }

  drawTreeVault(ctx, dims, palette, margin, radius, numbers, positions);

  ctx.save();
  ctx.lineWidth = pathWidth;
  ctx.strokeStyle = palette.layers[1];
  ctx.globalAlpha = config.pathAlpha;
  ctx.beginPath();
  for (const [from, to] of config.edges) {
    const start = positions.get(from);
    const end = positions.get(to);
    if (!start || !end) {
      continue;
    }
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
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

/**
 * Draw vaulted arches, pillars, and dais rings behind the Tree-of-Life scaffold.
 *
 * Mirrors cathedral cues from the user reference images while staying motionless and ND-safe.
 */
function drawTreeVault(ctx, dims, palette, margin, radius, numbers, positions) {
  ctx.save();
  const baseNode = positions.get("malkuth") || { x: dims.width / 2, y: dims.height - margin };
  const crownNode = positions.get("kether") || { x: dims.width / 2, y: margin };
  const baseY = baseNode.y + radius * 1.1;
  const topY = Math.max(margin, crownNode.y - radius * 1.6);
  const centerX = dims.width / 2;
  const vaultRadius = Math.max((baseY - topY) * 1.12, dims.width / numbers.THREE);

  ctx.globalAlpha = 1;
  ctx.lineWidth = Math.max(1.2, radius / numbers.ELEVEN);
  ctx.strokeStyle = withAlpha(palette.layers[1], 0.4);
  ctx.beginPath();
  ctx.arc(centerX, baseY, vaultRadius, Math.PI, Math.PI * 2, false);
  ctx.stroke();

  const sideOffset = (dims.width - margin * 2) / numbers.THIRTYTHREE * numbers.SEVEN;
  ctx.beginPath();
  ctx.arc(centerX - sideOffset, baseY, vaultRadius * 0.88, Math.PI * 1.04, Math.PI * 1.96, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(centerX + sideOffset, baseY, vaultRadius * 0.88, Math.PI * 1.04, Math.PI * 1.96, false);
  ctx.stroke();

  ctx.strokeStyle = withAlpha(palette.layers[0], 0.55);
  ctx.lineWidth = Math.max(1, radius / numbers.NINE);
  const pillarFactors = [0.28, 0.5, 0.72];
  for (const factor of pillarFactors) {
    const x = margin + clamp(factor, 0, 1) * (dims.width - margin * 2);
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, topY + radius * 1.6);
    ctx.stroke();
  }

  ctx.strokeStyle = withAlpha(palette.layers[2], 0.45);
  ctx.lineWidth = Math.max(1, radius / numbers.ELEVEN);
  ctx.beginPath();
  ctx.arc(centerX, baseY - radius * 0.2, radius * numbers.SEVEN / 1.8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws a logarithmic (Fibonacci-like) spiral and optional markers onto the canvas.
 *
 * The spiral origin, scale, curvature, visual alpha, and marker spacing are driven by
 * values in `config`. The function strokes a continuous spiral path and fills circular
 * markers at regular intervals along the sampled points.
 *
 * @param {Object} dims - Canvas dimensions { width, height } used to position and scale the spiral.
 * @param {string} color - Stroke/fill color for the spiral and markers (any valid CSS color).
 * @param {Object} numbers - Numerology constants used to scale line width and marker size.
 * @param {Object} config - Spiral configuration:
 *   - sampleCount: number of samples along the spiral (minimum 2)
 *   - turns: angular extent in half-pi units (multiplied by Math.PI)
 *   - baseRadiusDivisor: divisor applied to the smaller canvas dimension to compute base radius
 *   - centerXFactor, centerYFactor: 0..1 factors locating the spiral center within the canvas
 *   - phi: radial growth factor (>1)
 *   - markerInterval: integer step between markers placed on the sampled points
 *   - alpha: global opacity applied while drawing the spiral
 *
 * @returns {{ samples: number, markers: number }} An object with:
 *   - samples: total number of sampled points used to draw the spiral (>= 2)
 *   - markers: number of circular markers drawn
 */
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

  drawSpiralChambers(ctx, points, {
    color,
    centerX,
    centerY,
    baseRadius,
    minDim
  }, numbers);

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

/**
 * Lay concentric research chambers and connective chords across the Fibonacci spiral.
 * @param {CanvasRenderingContext2D} ctx - Target context.
 * @param {Array<{x:number,y:number}>} points - Sampled spiral points.
 * @param {{color:string,centerX:number,centerY:number,baseRadius:number,minDim:number}} settings - Layout data.
 * @param {Object} numbers - Numerology constants guiding ratios.
 */
function drawSpiralChambers(ctx, points, settings, numbers) {
  if (!points.length) {
    return;
  }
  ctx.save();
  const ratios = [numbers.ELEVEN / numbers.NINE, numbers.TWENTYTWO / numbers.ELEVEN, numbers.THIRTYTHREE / numbers.ELEVEN];
  ctx.strokeStyle = withAlpha(settings.color, 0.34);
  ctx.lineWidth = Math.max(1, settings.baseRadius / numbers.THIRTYTHREE);
  for (const ratio of ratios) {
    const radiusX = settings.baseRadius * ratio;
    const radiusY = radiusX * 0.72;
    ctx.beginPath();
    ctx.ellipse(settings.centerX, settings.centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const anchorIndices = [numbers.SEVEN, numbers.ELEVEN, numbers.TWENTYTWO, numbers.THIRTYTHREE, numbers.NINETYNINE];
  ctx.strokeStyle = withAlpha(settings.color, 0.52);
  ctx.lineWidth = Math.max(1, settings.minDim / numbers.ONEFORTYFOUR * numbers.THREE);
  ctx.beginPath();
  let hasMove = false;
  for (const index of anchorIndices) {
    const clampedIndex = Math.min(points.length - 1, Math.max(0, Math.round(index)));
    const point = points[clampedIndex];
    if (!point) {
      continue;
    }
    if (!hasMove) {
      ctx.moveTo(point.x, point.y);
      hasMove = true;
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  if (hasMove) {
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws a double-helix lattice (two sinusoidal strands with cross-tie rungs) onto the provided canvas context.
 *
 * The function computes two opposing sinusoidal strands across the canvas width and renders them using
 * colors from the palette. It also draws a configurable number of straight cross-ties between corresponding
 * strand points. The canvas context is saved and restored; drawing parameters (line width, globalAlpha,
 * strokeStyle) are applied during rendering.
 *
 * @param {Object} dims - Canvas dimensions: { width: number, height: number }.
 * @param {Object} palette - Palette object containing at least .layers (array), .muted, and .ink used for strokes.
 * @param {Object} numbers - Numerology constants used to scale line width (e.g., NINETYNINE, THREE).
 * @param {Object} config - Helix configuration:
 *   - sampleCount: number of samples per strand (minimum 2)
 *   - cycles: number of full sinusoidal cycles across the width
 *   - amplitudeDivisor: divisor applied to the smaller canvas dimension to compute amplitude
 *   - strandSeparationDivisor: divisor applied to the smaller canvas dimension to compute vertical separation
 *   - strandAlpha: global alpha for strand strokes
 *   - crossTieCount: requested number of cross-tie rungs (at least 1)
 *   - rungAlpha: global alpha for cross-tie strokes
 *
 * @return {{ strandPoints: number, crossTies: number }} Summary counts: total strand points drawn (samples * 2) and cross-ties drawn.
 */
function drawHelixLattice(ctx, dims, palette, numbers, config) {
  const samples = Math.max(2, Math.round(config.sampleCount));
  const minDim = Math.min(dims.width, dims.height);
  const amplitude = minDim / config.amplitudeDivisor;
  const separation = minDim / config.strandSeparationDivisor;
  const baseY = dims.height / 2;
  const stepX = dims.width / (samples - 1);

  drawHelixColumn(ctx, dims, palette, numbers);

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
  }
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

/**
 * Render a central luminous column and base dais that the helix strands wrap around.
 * @param {CanvasRenderingContext2D} ctx - Target context.
 * @param {{width:number,height:number}} dims - Canvas dimensions.
 * @param {Object} palette - Palette providing colour accents.
 * @param {Object} numbers - Numerology constants for ratio control.
 */
function drawHelixColumn(ctx, dims, palette, numbers) {
  ctx.save();
  const centerX = dims.width / 2;
  const topY = dims.height / numbers.THREE;
  const baseY = dims.height - dims.height / numbers.THIRTYTHREE;
  const minDim = Math.min(dims.width, dims.height);
  const columnWidth = Math.max(2, minDim / numbers.TWENTYTWO);

  const gradient = ctx.createLinearGradient(centerX, topY, centerX, baseY);
  gradient.addColorStop(0, withAlpha(palette.layers[5] || palette.layers[1], 0.65));
  gradient.addColorStop(1, withAlpha(palette.layers[4] || palette.layers[0], 0.3));
  ctx.strokeStyle = gradient;
  ctx.lineWidth = columnWidth;
  ctx.globalAlpha = 0.92;
  ctx.beginPath();
  ctx.moveTo(centerX, topY);
  ctx.lineTo(centerX, baseY);
  ctx.stroke();

  ctx.lineWidth = columnWidth / 2;
  ctx.strokeStyle = withAlpha(palette.layers[3] || palette.ink, 0.45);
  const baseRadius = minDim / numbers.THREE;
  ctx.beginPath();
  ctx.arc(centerX, baseY, baseRadius, Math.PI, Math.PI * 2, false);
  ctx.stroke();

  ctx.strokeStyle = withAlpha(palette.ink, 0.35);
  ctx.lineWidth = Math.max(1, columnWidth / numbers.SEVEN);
  ctx.beginPath();
  ctx.arc(centerX, topY, columnWidth * numbers.SEVEN, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws a small notice banner near the bottom of the canvas.
 *
 * Renders a semi-opaque rounded-rectangle-like background and draws the provided
 * text in the foreground. Sizing, padding, and font scale relative to the
 * canvas dimensions so the notice remains legible on different canvas sizes.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context.
 * @param {{width: number, height: number}} dims - Canvas dimensions (pixels).
 * @param {string} ink - Foreground color for the notice text (CSS color string).
 * @param {string} muted - Optional background color; falls back to `ink` when absent.
 * @param {string} text - The notice text to render.
 */
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

  ctx.fillStyle = background;
  ctx.fillRect(x - padding / 4, y - fontSize, width, fontSize * 1.8);

  ctx.fillStyle = ink;
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y - fontSize * 0.2);
  ctx.restore();
}

/**
 * Build a compact human-readable summary string from per-layer drawing statistics.
 *
 * @param {Object} stats - Aggregated statistics returned by the layer draw functions.
 * @param {Object} stats.vesicaStats - Vesica field stats; expects numeric `circles`.
 * @param {Object} stats.treeStats - Tree-of-Life stats; expects numeric `paths` and `nodes`.
 * @param {Object} stats.fibonacciStats - Fibonacci spiral stats; expects numeric `samples`.
 * @param {Object} stats.helixStats - Helix lattice stats; expects numeric `crossTies`.
 * @return {string} A single-line summary like "Vesica 42 circles | Paths 11 / Nodes 10 | Spiral 360 samples | Helix 20 ties".
 */
function summariseLayers(stats) {
  const vesicaPart = `Vesica ${stats.vesicaStats.circles} circles`;
  const treePart = `Paths ${stats.treeStats.paths} / Nodes ${stats.treeStats.nodes}`;
  const fibPart = `Spiral ${stats.fibonacciStats.samples} samples`;
  const helixPart = `Helix ${stats.helixStats.crossTies} ties (144:99)`;
  return `${vesicaPart} | ${treePart} | ${fibPart} | ${helixPart}`;
}

/**
 * Convert a hex color string to an rgba() string with the given alpha.
 *
 * Accepts 3- or 6-digit hex formats (leading '#'). If `color` is not a hex
 * string (doesn't start with '#'), the original `color` value is returned
 * unchanged. The `alpha` value is clamped to the inclusive [0, 1] range.
 *
 * @param {string} color - A hex color string like `#abc` or `#aabbcc`. Other formats are returned as-is.
 * @param {number} alpha - Desired opacity; values outside [0,1] are clamped.
 * @returns {string} An `rgba(r, g, b, a)` string when input is a hex color, otherwise the original `color`.
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
 * Draw a filled and stroked star polygon using alternating outer/inner radii.
 * @param {CanvasRenderingContext2D} ctx - Target context.
 * @param {{centerX:number,centerY:number,outerRadius:number,innerRadius:number,points:number,rotation:number,stroke?:string,fill?:string,lineWidth?:number}} options
 *        Star definition.
 */
function drawStarPolygon(ctx, options) {
  const {
    centerX,
    centerY,
    outerRadius,
    innerRadius,
    points,
    rotation = 0,
    stroke,
    fill,
    lineWidth = 1.5
  } = options;
  if (!points || points < 2) {
    return;
  }
  ctx.save();
  ctx.beginPath();
  const totalVertices = points * 2;
  for (let i = 0; i < totalVertices; i += 1) {
    const angle = rotation + (Math.PI * i) / points;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Return the canonical Tree-of-Life node definitions used for layout.
 *
 * Each node is an object with properties:
 * - id: stable string identifier
 * - title: display name
 * - level: integer radial level (0 = top/root)
 * - xFactor: horizontal placement factor in [0,1] relative to available width
 *
 * @return {Array<{id: string, title: string, level: number, xFactor: number}>} Array of node definitions in drawing order.
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

/**
 * Return the canonical Tree-of-Life edges as an ordered list of node-id pairs.
 *
 * Each entry is a two-element array [fromId, toId] describing a connection between nodes.
 * The list defines the fixed topology used by the Tree-of-Life rendering layer.
 * @return {Array<Array<string>>} Ordered array of edge pairs (node id strings).
 */
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
