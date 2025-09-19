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

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};


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

 * Render the four layered "Cosmic Helix" composition onto a 2D canvas.
 *
 * Renders (back-to-front) the Vesica field, Tree-of-Life scaffold, Fibonacci spiral,
 * and double-helix lattice in a single, static pass. Validates inputs and returns
 * an explicit status object rather than throwing.
 *
 * @param {Object} [options] - Rendering options.
 * @param {number} [options.width] - Optional explicit canvas width (overrides ctx.canvas.width).
 * @param {number} [options.height] - Optional explicit canvas height (overrides ctx.canvas.height).
 * @param {Object} [options.palette] - Palette overrides; merged with defaults (bg, ink, muted, layers).
 * @param {Object} [options.NUM] - Numerology overrides; merged with default numeric constants.
 * @param {Object} [options.geometry] - Per-layer geometry overrides (vesica, treeOfLife, fibonacci, helix).
 * @param {string} [options.notice] - Optional footer notice string to draw on the canvas.
 * @returns {{ok: true, summary: string}|{ok: false, reason: string}} If successful returns { ok: true, summary } where summary is a one-line description of rendered layer statistics. On failure returns { ok: false, reason } with reason one of: "missing-context" (invalid ctx) or "invalid-dimensions" (invalid width/height).
 */
export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas !== "object" || typeof ctx.save !== "function") {
    return { ok: false, reason: "missing-context" };
  }

  const dims = normaliseDimensions(ctx, options);
  if (!dims) {
    return { ok: false, reason: "invalid-dimensions" };

 * Render a static, four-layer sacred-geometry helix composition onto a 2D canvas.
 *
 * Draws, in sequence, a vesica field, a Tree of Life scaffold, a Fibonacci spiral, and a
 * double-helix lattice. The renderer saves/restores the canvas state, applies an optional
 * inline notice when fallbacks are active, and summarises the geometry counts for the
 * caller.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context to draw into.
 * @param {Object} [input={}] - Optional configuration overrides (palette, NUM values, dims, notice).
 * @returns {{summary: string}} A calm human-readable description of the rendered layers.
 */
export function renderHelix(ctx, input = {}) {
  if (!ctx || typeof ctx.canvas === "undefined" || typeof ctx.save !== "function") {
    // Calm skip keeps the offline shell quiet when contexts are denied (rare on hardened browsers).
    return { summary: "Canvas context unavailable; rendering skipped." };

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
    ok: true,
    summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats })
  };
}

/**
 * Resolve positive width and height from the provided options (falling back to the canvas)
 * and apply them to the canvas if they differ.
 *
 * If either resolved dimension is not a positive finite number, the function returns null.
 * This function mutates ctx.canvas.width and/or ctx.canvas.height when a change is needed.
 *
 * @param {Object} options - Optional dimension overrides.
 * @param {number} [options.width] - Desired canvas width in pixels; used only if a positive finite number.
 * @param {number} [options.height] - Desired canvas height in pixels; used only if a positive finite number.
 * @returns {{width: number, height: number} | null} The applied dimensions, or null if validation failed.
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
 * Return the input if it is a finite positive number, otherwise null.
 *
 * Accepts only number values; non-number, non-finite, zero, or negative inputs yield null.
 * @param {any} value - Value to validate as a positive finite number.
 * @returns {number|null} The original number when > 0 and finite, or null otherwise.
 */
function toPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Merge a candidate numerology object with the default FALLBACK_NUMBERS.
 *
 * If `candidate` is missing or not an object, returns a copy of FALLBACK_NUMBERS.
 * For each key present in FALLBACK_NUMBERS, a numeric, finite, positive value in
 * `candidate` overrides the default; all other keys keep their fallback values.
 *
 * @param {Object} [candidate] - Partial numerology overrides (numeric values expected).
 * @return {Object} A complete numerology object with defaults filled in and valid overrides applied.
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
 * Produce a complete palette by merging a partial candidate with the FALLBACK_PALETTE.
 *
 * If `candidate` is missing or not an object, returns a shallow clone of FALLBACK_PALETTE.
 * When `candidate.layers` is provided, extra entries are truncated to the default length
 * and missing entries are filled from the fallback. Top-level `bg`, `ink`, and `muted`
 * are accepted when they are strings; otherwise fallback values are used.
 *
 * @param {Object|null|undefined} candidate - Partial palette to merge; may contain `bg`, `ink`, `muted`, and `layers` (array of colors).
 * @return {{bg: string, ink: string, muted: string, layers: string[]}} A normalized palette object with `layers` length matching the fallback.
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
 * Return a shallow clone of a palette, copying the layers array.
 *
 * The returned object reuses the same string values for bg, ink, and muted,
 * but provides a new array instance for `layers` (shallow-copied).
 *
 * @param {{bg: string, ink: string, muted: string, layers: string[]}} palette - Palette to clone.
 * @return {{bg: string, ink: string, muted: string, layers: string[]}} A new palette object with a copied layers array.
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
 * Build a complete geometry configuration by merging a user-supplied patch onto the default geometry.
 *
 * If `candidate` is missing or not an object, the function returns a fresh default geometry produced
 * by `createDefaultGeometry(numbers)`. When `candidate` is an object, each layer's geometry is
 * produced by merging the corresponding patch (if any) into the layer defaults via the layer-specific
 * merge helpers (`mergeVesicaGeometry`, `mergeTreeGeometry`, `mergeFibonacciGeometry`, `mergeHelixGeometry`).
 *
 * @param {Object|undefined|null} candidate - Optional partial geometry overrides; may contain
 *   `vesica`, `treeOfLife`, `fibonacci`, and/or `helix` sub-objects.
 * @param {Object} numbers - Numerology constants used to produce the base default geometry.
 * @return {Object} A complete geometry object with `vesica`, `treeOfLife`, `fibonacci`, and `helix`
 *   properties, each guaranteed to be populated (either from defaults or merged overrides).
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
 * Create the default per-layer geometry used by the renderer.
 *
 * Returns a geometry configuration object for the four layers (vesica, treeOfLife,
 * fibonacci, helix). Numeric fields are derived from the provided numerology set
 * and are suitable as sensible defaults for rendering; tree node and edge lists
 * are populated via buildTreeNodes() and buildTreeEdges().
 *
 * @param {Object} num - Numerology constants (e.g., THREE, SEVEN, NINE, ELEVEN, etc.).
 * @return {Object} Geometry defaults with the following top-level keys:
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
 * Merge a partial vesica geometry patch into a base vesica geometry, returning a new validated geometry object.
 *
 * The function copies the base when the patch is missing or not an object. For each numeric field in the patch
 * a validated override is used when appropriate: positive numbers replace base values for rows, columns,
 * paddingDivisor, and strokeDivisor; radiusScale must be a positive number; alpha is clamped to [0, 1].
 *
 * @param {Object} base - The base vesica geometry to merge into (unchanged).
 * @param {Object} [patch] - Partial geometry overrides; fields may include rows, columns, paddingDivisor,
 *   radiusScale, strokeDivisor, and alpha. Invalid or missing fields are ignored in favor of base values.
 * @return {Object} A new vesica geometry object with merged and validated fields.
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
 * Merge a Tree-of-Life geometry patch into a base configuration, producing a normalized geometry object.
 *
 * Returns a new geometry object where numeric fields are validated and replaced only when the patch provides
 * valid values; alpha fields are clamped to [0,1]. Node and edge lists are cloned from the base unless the
 * patch supplies its own arrays — supplied nodes are normalized via normaliseTreeNode and supplied edges are
 * filtered to two-element arrays. If patch is null/invalid, returns a shallow copy of base with cloned node
 * and edge arrays.
 *
 * @param {Object} base - The base tree geometry (must include numeric divisors, alpha values, `nodes` array and `edges` array).
 * @param {Object|null|undefined} patch - Partial geometry to merge; may contain numeric overrides, alpha overrides,
 *                                        `nodes` (array of node-like objects) and `edges` (array of 2-item arrays).
 * @return {Object} A merged, validated, and safe-to-use tree geometry object.
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
 * Normalize a Tree-of-Life node object into the renderer's canonical node shape.
 *
 * Converts and fills missing fields to predictable defaults:
 * - `id` is coerced to a string (empty string if missing).
 * - `title` is used if a non-empty string; otherwise falls back to the stringified `id`.
 * - `level` is kept if a number, otherwise defaults to 0.
 * - `xFactor` is kept if a number, otherwise defaults to 0.5.
 *
 * @param {Object} node - Partial node object. May contain `id`, `title`, `level`, and `xFactor`.
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

 * Merge a Fibonacci-layer geometry patch into a base geometry, validating and clamping fields.
 *
 * Returns a new geometry object where numeric overrides from `patch` replace `base` values only if
 * they pass validation: positive numbers use `positiveOrDefault`, `centerXFactor`/`centerYFactor`
 * are clamped to [0,1], `alpha` is clamped to [0,1], and `phi` is accepted only when > 1.
 *
 * @param {Object} base - The baseline Fibonacci geometry to use as defaults.
 * @param {number} base.sampleCount
 * @param {number} base.turns
 * @param {number} base.baseRadiusDivisor
 * @param {number} base.centerXFactor
 * @param {number} base.centerYFactor
 * @param {number} base.phi
 * @param {number} base.markerInterval
 * @param {number} base.alpha
 * @param {Object|null|undefined} patch - Partial geometry overrides; invalid or missing fields are ignored.
 * @return {Object} A new geometry object with merged and validated fields.
=======
 * Render the Tree of Life layer onto the provided 2D canvas context.
 *
 * Draws a vaulted arch and central column, renders canonical Tree of Life connections,
 * paints each sephirot as a filled circle with an outline, and adds a decorative star at
 * the kether position. Colors are taken from the provided palette; sizing uses numeric
 * constants.
 *
 * @param {Object} dims - Normalized drawing dimensions; must include at least { width, height, cx, cy }.
 * @param {Object} palette - Color palette (expects usable values at palette.layers[1], palette.layers[2], and palette.ink).
 * @param {Object} numbers - Numeric constants used for layout (e.g., NINETYNINE, ONEFORTYFOUR) that influence node radius and stroke widths.
 * @return {{nodes: number, paths: number}} Counts of sephirot nodes drawn and connecting paths stroked.

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

 * Merge a helix geometry patch onto a base geometry, validating and clamping values.
 *
 * Returns a new geometry object where numeric fields from `patch` override `base`
 * only when they are positive finite numbers; alpha fields are accepted only when
 * numeric and are clamped to [0, 1]. If `patch` is missing or not an object, a
 * shallow copy of `base` is returned.
 *
 * @param {object} base - The base helix geometry to merge into. Expected shape includes
 *   { sampleCount, cycles, amplitudeDivisor, strandSeparationDivisor, crossTieCount, strandAlpha, rungAlpha }.
 * @param {object} [patch] - Partial geometry overrides. Only valid positive numeric fields
 *   replace corresponding base values; `strandAlpha` and `rungAlpha` (if numeric) are clamped to [0,1].
 * @return {object} The merged helix geometry object.
 */
function mergeHelixGeometry(base, patch) {
  if (!patch || typeof patch !== "object") {
    return { ...base };
  }

 * Compute pixel coordinates for the Tree-of-Life sephiroth using a covenant-ladder projection.
 *
 * Projects a 144-step vertical scale with a 33-step horizontal pillar offset to position
 * the 11 canonical sephiroth (including Daath as a centered, "hidden" node) across the canvas.
 * Positions are returned in pixels and are anchored so the two side pillars are offset from
 * center by 33 steps of a 144-step grid (keeps relative layout consistent across sizes).
 *
 * @param {{width:number,height:number}} dims - Canvas dimensions in pixels.
 * @param {Object<string,number>} numbers - Numeric constants (expects keys like ONEFORTYFOUR, THIRTYTHREE, THREE, etc.)
 * @return {Object<string,{x:number,y:number}>} Map of sephirah names to {x, y} pixel coordinates.
 */
function buildTreeNodes(dims, numbers) {
  const marginY = dims.height / numbers.THIRTYTHREE;
  const innerHeight = dims.height - marginY * 2;
  const verticalUnit = innerHeight / numbers.ONEFORTYFOUR; // 144-step descent honours the covenant ladder.
  const centerX = dims.width / 2;

  const horizontalUnit = dims.width / numbers.ONEFORTYFOUR;
  const pillarShift = horizontalUnit * numbers.THIRTYTHREE; // 33-step shift keeps the side pillars tethered to 144.
  const rightPillarX = centerX + pillarShift;
  const leftPillarX = centerX - pillarShift;

  const level = multiplier => marginY + verticalUnit * multiplier;

  const levels = {
    kether: 0,
    chokmahBinah: numbers.THIRTYTHREE / numbers.THREE, // 33/3 = 11 -> supernal step anchored by 3 and 33.
    daath: numbers.TWENTYTWO + numbers.SEVEN, // 22+7 = 29 holds the hidden gate between triads.
    chesedGeburah: numbers.THIRTYTHREE + numbers.NINE, // 33+9 = 42 -> balanced mercy and strength.
    tiphareth: numbers.THIRTYTHREE + numbers.TWENTYTWO, // 55 -> heart of the tree sits on 33 and 22 combined.
    netzachHod: numbers.NINETYNINE - numbers.THREE, // 99-3 = 96 -> harmonics of 3 underpin the lower intellect/emotion pair.
    yesod: numbers.ONEFORTYFOUR - numbers.THREE, // 144-3 = 141 anchors the foundation just above the base.
    malkuth: numbers.ONEFORTYFOUR // full descent touches earth at 144.
  };


 
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
 * Return `value` if it is a positive finite number; otherwise return `fallback`.
 * @param {number} value - Candidate number to validate.
 * @param {number} fallback - Value returned when `value` is not a positive finite number.
 * @return {number} The original `value` when valid, or `fallback` otherwise.
 */
function positiveOrDefault(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

/**
 * Constrain a number to the inclusive range [min, max].
 * @param {number} value - The number to clamp.
 * @param {number} min - Lower bound (inclusive).
 * @param {number} max - Upper bound (inclusive).
 * @return {number} The input limited to the specified range.
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Paints the canvas background with a solid color and a subtle radial glow.
 *
 * Fills the full drawing area defined by dims with bgColor, then overlays a
 * soft radial gradient (lighter center fading to transparent) to add depth.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D canvas rendering context to draw into.
 * @param {{width: number, height: number}} dims - Drawing dimensions; both must be positive numbers.
 * @param {string} bgColor - CSS color string used as the base background color.
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
 * Render a vesica (grid of overlapping circles) across the canvas and return the count of circles drawn.
 *
 * Renders a rectangular grid of stroked circles centered inside the provided dimensions, then draws
 * light axis guides through the geometric center. Circle spacing, radius, stroke width and opacity
 * are derived from the passed `config`. The function preserves and restores the canvas state.
 *
 * @param {{width:number, height:number}} dims - Canvas drawing area dimensions.
 * @param {string} color - Stroke color for the circles and guides (any valid CSS color).
 * @param {object} numbers - Numerology/config numbers used elsewhere in the renderer (not modified here).
 * @param {object} config - Vesica geometry and style controls. Expected numeric fields:
 *   - columns: desired number of columns (will be rounded and clamped to >= 2)
 *   - rows: desired number of rows (will be rounded and clamped to >= 2)
 *   - paddingDivisor: divisor of the smallest dimension to compute outer padding
 *   - radiusScale: multiplier applied to the computed step to get circle radius
 *   - strokeDivisor: divisor of the smallest dimension to compute stroke width
 *   - alpha: global opacity for these shapes (0..1)
 * @return {{circles:number}} Object with `circles` equal to the total number of circles stroked.
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

/**
 * Render the Tree-of-Life layer onto a 2D canvas context.
 *
 * Draws connecting edges, circular nodes, and node labels according to the supplied geometry and palette.
 * The canvas context state is saved and restored; drawing uses pixel units from dims and scales node size and font from dims and numerology.
 *
 * @param {Object} dims - Dimension object with numeric `width` and `height` in pixels.
 * @param {Object} palette - Palette object (expects a `layers` array and `ink` color); layer indices are used for path and node colors.
 * @param {Object} numbers - Numerology constants object (e.g., provides SEVEN, THREE) used for sizing heuristics.
 * @param {Object} config - Tree geometry and rendering options. Expected fields used here:
 *   - nodes: Array of node objects ({ id, title, level, xFactor }) positioned by level and xFactor.
 *   - edges: Array of [fromId, toId] pairs describing connections between nodes.
 *   - marginDivisor, radiusDivisor, pathDivisor: numeric divisors controlling margin, node radius, and path stroke sizing.
 *   - pathAlpha, nodeAlpha, labelAlpha: numeric alpha values in [0,1] for path, node, and label inks.
 *
 * @return {{nodes: number, paths: number}} Counts of nodes and edges processed (lengths of config.nodes and config.edges).
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
 * Draws a logarithmic (Fibonacci-style) spiral on the given canvas and marks points along it.
 *
 * Renders a spiral sampled across `config.sampleCount` points spanning `config.turns` π radians,
 * using an exponential radius growth controlled by `config.phi`. The curve is stroked with
 * `color` and filled circular markers are drawn at every `config.markerInterval` sample.
 *
 * Parameters of `config` that affect rendering:
 * - `sampleCount` (number): number of samples along the spiral (minimum 2).
 * - `turns` (number): number of half-turns (multiplied by π to compute theta range).
 * - `baseRadiusDivisor` (number): divisor applied to the smallest canvas dimension to compute base radius.
 * - `centerXFactor`, `centerYFactor` (number): normalized [0..1] center position for the spiral.
 * - `phi` (number): base of the exponential radius growth per π radians.
 * - `alpha` (number): global alpha applied to the spiral stroke.
 * - `markerInterval` (number): step between samples at which markers are drawn.
 *
 * `numbers` provides numeric constants used for line width and marker sizing (e.g. NINETYNINE, THREE, ONEFORTYFOUR).
 *
 * @param {Object} dims - Canvas dimensions { width, height } used to compute scale and center.
 * @param {string} color - Stroke/fill color for the spiral and markers (CSS color string).
 * @param {Object} numbers - Numerology constants used for scale calculations.
 * @param {Object} config - Per-curve configuration (see description for fields).
 * @return {{samples: number, markers: number}} Counts of sampled points and markers drawn.
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
 * Draws a double-helix lattice (two sinusoidal strands with cross-ties) onto a canvas.
 *
 * The function samples two sinusoidal strands across the width of the canvas using geometry
 * derived from dims, numbers, and config, strokes each strand with colors from the palette,
 * and draws cross-ties between strands at configured intervals.
 *
 * @param {Object} dims - Normalized canvas dimensions { width, height }.
 * @param {Object} palette - Color palette; this function reads layer colors at indexes 4 and 5 and uses muted/ink for ties.
 * @param {Object} numbers - Numerology constants used to scale stroke width.
 * @param {Object} config - Helix geometry and style configuration:
 *   - {number} sampleCount: number of sample points per strand (clamped to >=2).
 *   - {number} amplitudeDivisor: divisor applied to the smaller canvas dimension to compute sine amplitude.
 *   - {number} strandSeparationDivisor: divisor applied to the smaller canvas dimension to compute vertical strand separation.
 *   - {number} cycles: number of full sine cycles across the canvas width.
 *   - {number} strandAlpha: global alpha used when stroking the strands.
 *   - {number} rungAlpha: global alpha used when stroking cross-ties.
 *   - {number} crossTieCount: number of cross-ties to draw (clamped to >=1).
 *
 * @return {{ strandPoints: number, crossTies: number }} Counts of rendered geometry:
 *   - strandPoints: total sample points drawn across both strands (sampleCount * 2).
 *   - crossTies: number of cross-ties actually attempted (at least 1).
 */
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
 * Draws a small footer notice box with translucent background and text in the lower-left corner of the canvas.
 *
 * The box size, padding, and font scale with the canvas dimensions. If `muted` is falsy the `ink` color is used
 * (semi-opaque) for the box background. The function does not return a value and restores the canvas state before exit.
 *
 * @param {CanvasRenderingContext2D} ctx - Rendering context to draw into.
 * @param {{width: number, height: number}} dims - Canvas dimensions used to compute padding and font size.
 * @param {string} ink - Primary text color (CSS color string).
 * @param {string|null|undefined} muted - Optional background color for the notice; falls back to `ink` when not provided.
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
 * Produce a one-line human-readable summary of per-layer rendering statistics.
 *
 * @param {Object} stats - Aggregated statistics from each rendered layer.
 * @param {Object} stats.vesicaStats - Vesica field statistics.
 * @param {number} stats.vesicaStats.circles - Number of circles drawn in the Vesica field.
 * @param {Object} stats.treeStats - Tree-of-Life statistics.
 * @param {number} stats.treeStats.paths - Number of connecting paths drawn.
 * @param {number} stats.treeStats.nodes - Number of nodes drawn.
 * @param {Object} stats.fibonacciStats - Fibonacci spiral statistics.
 * @param {number} stats.fibonacciStats.samples - Number of samples (points) along the spiral.
 * @param {Object} stats.helixStats - Helix lattice statistics.
 * @param {number} stats.helixStats.crossTies - Number of cross-ties drawn between helix strands.
 * @return {string} A concise summary string like "Vesica X circles · Paths Y / Nodes Z · Spiral S samples · Helix T ties".
 */
function summariseLayers(stats) {
  const vesicaPart = `Vesica ${stats.vesicaStats.circles} circles`;
  const treePart = `Paths ${stats.treeStats.paths} / Nodes ${stats.treeStats.nodes}`;
  const fibPart = `Spiral ${stats.fibonacciStats.samples} samples`;
  const helixPart = `Helix ${stats.helixStats.crossTies} ties`;
  return `${vesicaPart} · ${treePart} · ${fibPart} · ${helixPart}`;
}

/**
 * Convert a hex color string to an RGBA CSS color with the given alpha.
 *
 * Accepts `#rgb` and `#rrggbb` hex formats (case-insensitive). If `color` is not
 * a hex string beginning with `#`, the original `color` value is returned
 * unchanged. The returned alpha is clamped to the [0, 1] range.
 *
 * @param {string} color - A CSS color, expected as `#rgb` or `#rrggbb`. Non-hex inputs are returned as-is.
 * @param {number} alpha - Desired alpha opacity (will be clamped between 0 and 1).
 * @return {string} An `rgba(r, g, b, a)` CSS color string, or the original `color` if it wasn't a hex string.
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
 * Return the default set of Tree-of-Life nodes used by the renderer.
 *
 * Each entry is an object with the following properties:
 *   - id: unique string key for the node
 *   - title: human-readable label
 *   - level: integer layer index (0 = top)
 *   - xFactor: horizontal placement factor (0.0–1.0) relative to level width
 *
 * @return {Array<{id: string, title: string, level: number, xFactor: number}>} The canonical list of 10 nodes in drawing order.
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
 * Return the canonical list of Tree-of-Life edges.
 *
 * Each entry is a two-element array [fromId, toId] of node id strings representing
 * a connection between nodes in the Tree-of-Life scaffold. The list contains the
 * default 22 edges used by the renderer and preserves a stable ordering.
 *
 * @return {Array.<[string,string]>} Array of 2-element string tuples (source, target).
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
