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
 * Render the full Cosmic Helix composition onto a 2D canvas context.
 *
 * Performs a single, non-animated pass that clears the canvas and draws four
 * back-to-front layers: the vesica field, Tree of Life scaffold, Fibonacci
 * spiral, and double-helix lattice. Layer rendering is driven by merged
 * defaults and any provided overrides; a short human-readable summary of
 * rendered layer statistics is returned.
 *
 * @param {CanvasRenderingContext2D} ctx - The target 2D canvas rendering context.
 * @param {Object} [options] - Optional rendering overrides.
 * @param {Object} [options.palette] - Palette overrides (merged with defaults).
 * @param {Object} [options.NUM] - Numeric constants overrides (merged with defaults).
 * @param {Object} [options.geometry] - Geometry/settings overrides for layers.
 * @param {string} [options.notice] - Optional centered notice text shown near the bottom.
 * @return {{ok: boolean, summary?: string, reason?: string}} If ctx is missing or invalid returns
 *   { ok: false, reason: "missing-context" }. On success returns { ok: true, summary } where
 *   summary is a human-readable summary of per-layer stats (e.g., counts of circles, nodes,
 *   spiral points, and helix rungs).
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
 * Determine rendering width and height, falling back to the canvas size when inputs are missing or invalid.
 *
 * Returns an object with positive numeric `width` and `height` derived from `options.width`/`options.height`
 * when those are finite and > 0; otherwise the corresponding `ctx.canvas` dimensions are used.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context whose `canvas` provides fallback dimensions.
 * @param {Object} options - Optional dimension overrides.
 * @param {number} [options.width] - Desired width; used only if a finite, positive number.
 * @param {number} [options.height] - Desired height; used only if a finite, positive number.
 * @return {{width: number, height: number}} Normalized positive width and height. */
function normaliseDimensions(ctx, options) {
  const width = toPositiveNumber(options.width, ctx.canvas.width);
  const height = toPositiveNumber(options.height, ctx.canvas.height);
  return { width, height };
}

/**
 * Merge a partial palette candidate with the default palette, producing a complete palette object.
 *
 * Ensures `bg`, `ink`, and `muted` are strings (falling back to defaults) and normalizes `layers` to the default length
 * by truncating an input array or filling missing entries from the defaults.
 *
 * @param {Object} [candidate={}] - Partial palette to merge.
 * @param {string} [candidate.bg] - Optional background color hex/string.
 * @param {string} [candidate.ink] - Optional ink color hex/string.
 * @param {string} [candidate.muted] - Optional muted color hex/string.
 * @param {string[]} [candidate.layers] - Optional array of layer colors; will be truncated or padded to the default length.
 * @return {{bg: string, ink: string, muted: string, layers: string[]}} A palette object with `bg`, `ink`, `muted`, and a `layers` array matching the default length.
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
 * Merge user-provided numeric overrides into the default numerology set.
 *
 * Returns a copy of DEFAULT_NUMBERS with any keys present in `candidate`
 * replaced only when the candidate value is a finite number greater than 0.
 *
 * @param {Object} [candidate={}] - Partial map of numeric constants to override.
 * @return {Object} A new numerology object containing the merged numeric values.
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
 * Merge a partial geometry configuration with safe defaults for all layers.
 *
 * Accepts an optional partial geometry object and returns a complete geometry
 * configuration with validated sub-configs for `vesica`, `treeOfLife`,
 * `fibonacci`, and `helix`. Each sub-configuration is produced by its
 * corresponding merge helper (`mergeVesica`, `mergeTree`, `mergeFibonacci`,
 * `mergeHelix`), ensuring fallback values and type-safety for downstream
 * rendering.
 *
 * @param {Object} [candidate={}] - Partial geometry options; may include any of
 *   the keys `vesica`, `treeOfLife`, `fibonacci`, `helix`.
 * @return {Object} Complete geometry object with keys `vesica`, `treeOfLife`,
 *   `fibonacci`, and `helix`, each containing validated and defaulted settings.
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
 * Merge a partial vesica geometry config with defaults, returning a validated settings object.
 *
 * Accepts an optional config object and produces a complete vesica configuration where each
 * numeric field is coerced to a positive number (or integer) and falls back to DEFAULT_GEOMETRY.vesica.
 *
 * @param {Object} [config] - Partial vesica configuration.
 * @param {number} [config.rows] - Desired number of vesica rows (positive integer).
 * @param {number} [config.columns] - Desired number of vesica columns (positive integer).
 * @param {number} [config.paddingDivisor] - Divisor controlling canvas padding (positive number).
 * @param {number} [config.radiusFactor] - Factor used to compute circle radius (positive number).
 * @param {number} [config.strokeDivisor] - Divisor used to compute stroke width (positive number).
 * @param {number} [config.alpha] - Alpha transparency for vesica strokes; clamped to [0,1] with a fallback.
 * @return {{rows:number,columns:number,paddingDivisor:number,radiusFactor:number,strokeDivisor:number,alpha:number}}
 *   A complete, validated vesica settings object with defaults applied where inputs were missing or invalid.
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
 * Merge and validate a Tree-of-Life geometry configuration with safe defaults.
 *
 * Produces a normalized treeOfLife config by combining values from `config` with
 * DEFAULT_GEOMETRY.treeOfLife. Node entries are normalized (ensuring an `id`,
 * `title`, numeric `level`, and an `xFactor` clamped to [0,1]) using corresponding
 * base nodes as fallbacks. Edges are normalized to 2-element `[from,to]` pairs
 * and filtered so only connections between existing node IDs are returned.
 *
 * @param {Object} [config={}] - Partial tree configuration to merge.
 * @param {Array<Object>} [config.nodes] - Optional array of node overrides; each node may contain
 *   `{ id, title, level, xFactor }`. Missing fields are filled from the default node at the same
 *   index (wrapping if necessary).
 * @param {Array<Array>} [config.edges] - Optional array of edges; entries are coerced to 2-element
 *   arrays and any edge that references unknown node IDs is removed.
 * @param {number} [config.marginDivisor] - Optional override for node margin divisor.
 * @param {number} [config.radiusDivisor] - Optional override for node radius divisor.
 * @param {number} [config.labelOffset] - Optional numeric label offset.
 * @param {string} [config.labelFont] - Optional CSS font string for labels.
 * @return {Object} Normalized tree configuration:
 *   - marginDivisor {number}
 *   - radiusDivisor {number}
 *   - labelOffset {number}
 *   - labelFont {string}
 *   - nodes {Array<{id:string,title:string,level:number,xFactor:number}>} (xFactor in [0,1])
 *   - edges {Array<[string,string]>} (only references existing node ids)
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
 * Build a safe Fibonacci-curve configuration by merging user-supplied values with defaults.
 *
 * Normalizes and validates Fibonacci-specific geometry fields, ensuring numeric fallbacks:
 * - sampleCount: positive integer number of sampled points along the spiral.
 * - turns: number of spiral turns (positive number).
 * - baseRadiusDivisor: divisor used to compute the spiral's base radius (positive number).
 * - phi: growth factor for the logarithmic spiral (positive number).
 * - alpha: stroke opacity in [0,1] (0 allowed).
 *
 * @param {Object} [config={}] - Partial Fibonacci geometry to override defaults.
 * @param {number} [config.sampleCount] - Desired number of sample points; rounded to a positive integer.
 * @param {number} [config.turns] - Number of turns of the spiral.
 * @param {number} [config.baseRadiusDivisor] - Divisor controlling base radius magnitude.
 * @param {number} [config.phi] - Spiral growth factor.
 * @param {number} [config.alpha] - Stroke alpha; 0 is preserved, otherwise clamped to [0,1].
 * @return {Object} Normalized Fibonacci configuration with keys: sampleCount, turns, baseRadiusDivisor, phi, alpha.
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
 * Merge and sanitize helix geometry settings with module defaults.
 *
 * Accepts a partial helix config and returns a fully populated settings object where
 * numeric fields are coerced to positive numbers/integers and alpha fields are clamped.
 * Missing or invalid inputs are replaced with values from DEFAULT_GEOMETRY.helix.
 *
 * @param {Object} [config] - Partial helix configuration. Recognized properties:
 *   `sampleCount`, `cycles`, `amplitudeDivisor`, `phaseOffset`, `crossTieCount`,
 *   `strandAlpha`, `rungAlpha`.
 * @return {{sampleCount:number, cycles:number, amplitudeDivisor:number, phaseOffset:number, crossTieCount:number, strandAlpha:number, rungAlpha:number}} Normalized helix settings.
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
 * Fill the canvas area (as given by dims) with the specified color.
 *
 * The function sets the 2D context's fill style and draws a rectangle covering
 * [0,0] to [dims.width,dims.height], effectively clearing/painting the stage.
 *
 * @param {{width:number,height:number}} dims - Dimensions used to size the fill rectangle.
 * @param {string} color - CSS color string (e.g., `#rrggbb`, `rgba(...)`, or named color).
 */
function clearStage(ctx, dims, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

/**
 * Render a grid of paired "vesica" circles across the canvas.
 *
 * Draws rows × columns pairs of overlapped circles (vesica pairs) evenly spaced
 * within the padded canvas area using the provided color and layer settings.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context to draw into.
 * @param {{width:number,height:number}} dims - Normalized drawing dimensions.
 * @param {string} color - Hex color used for the stroked vesica pairs (alpha applied via settings).
 * @param {Object} numbers - Numeric constants object (used to compute offsets).
 * @param {Object} settings - Vesica configuration: expects numeric properties
 *   rows, columns, paddingDivisor, radiusFactor, strokeDivisor, and alpha.
 * @return {{circles:number, radius:number}} An object with the total number of circles drawn
 *   (each pair counts as two) and the computed circle radius used for rendering.
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
 * Stroke a paired "vesica" of two identical circles horizontally offset from a center point.
 *
 * Draws two stroked circles on the provided canvas context at (cx - offset, cy) and (cx + offset, cy).
 *
 * @param {number} cx - X coordinate of the central reference point between the two circles.
 * @param {number} cy - Y coordinate for both circle centers.
 * @param {number} radius - Radius of each circle.
 * @param {number} offset - Horizontal distance from the central reference point to each circle center.
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
 * Render the Tree-of-Life scaffold: draw edges between positioned nodes, render node disks, and optional labels.
 *
 * Positions are computed from settings.nodes (each with id, level, xFactor, title) using the canvas margins and level spacing;
 * edges in settings.edges referencing missing nodes are skipped. Node circle radius, edge stroke width, and label placement
 * derive from dims, numbers, and settings to remain stable across canvas sizes.
 *
 * @param {Object} dims - Normalized drawing dimensions { width, height }.
 * @param {Object} palette - Palette object with a `layers` array and `ink` color used for fills and strokes.
 * @param {Object} numbers - Numeric constants used for sizing (e.g., NINETYNINE).
 * @param {Object} settings - Tree configuration:
 *   - nodes: array of node objects { id, level, xFactor, title }.
 *   - edges: array of [fromId, toId] pairs.
 *   - marginDivisor: divisor to compute outer margins.
 *   - radiusDivisor: divisor to compute node circle radius.
 *   - labelOffset: vertical offset for labels (0 to disable).
 *   - labelFont: CSS font string used when labels are drawn.
 * @return {{nodes: number, paths: number}} Counts of node positions and edges considered (paths equals settings.edges.length).
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
 * Draws a sampled logarithmic (Fibonacci-style) spiral onto the canvas and returns the number of sampled points.
 *
 * The spiral is rendered as a stroked polyline centered at (0.72*width, 0.28*height). Stroke color is derived
 * from `color` with the configured alpha; stroke width scales with canvas size. Sampling, number of turns,
 * growth factor (phi), and base radius divisor are controlled by `settings`.
 *
 * @param {Object} dims - Canvas dimensions object; must include numeric `width` and `height`.
 * @param {string} color - Base stroke color (hex or any CSS color string); alpha is applied from `settings.alpha`.
 * @param {Object} settings - Spiral rendering options:
 *   - {number} sampleCount: number of sampled points along the spiral (minimum 2).
 *   - {number} turns: number of full turns of the spiral.
 *   - {number} phi: exponential growth factor (clamped to > 1).
 *   - {number} baseRadiusDivisor: divisor applied to min(width,height) to compute the base radius.
 *   - {number} alpha: stroke opacity in [0,1].
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
 * Draws a double-helix lattice (two sinusoidal strands plus cross-tie rungs) onto the provided canvas context.
 *
 * The function computes two phase-shifted strands across the horizontal span and:
 * - strokes each strand as a polyline using palette layer colors and `settings.strandAlpha`;
 * - draws a series of rungs (straight lines) connecting the strands at regular intervals using `palette.ink` and `settings.rungAlpha`.
 * It clamps and defaults key inputs (minimum 2 samples, minimum 1 rung) to ensure stable output.
 *
 * Parameters of `settings` used:
 * - `sampleCount` (number): number of sample points per strand (min 2).
 * - `cycles` (number): how many full sine cycles to fit across the span.
 * - `amplitudeDivisor` (number): divides canvas height to produce the waveform amplitude.
 * - `phaseOffset` (number): phase offset between strands in degrees.
 * - `crossTieCount` (number): target number of rungs to draw (at least 1).
 * - `strandAlpha` (number): alpha for strand stroke colors (0–1).
 * - `rungAlpha` (number): alpha for rung stroke color (0–1).
 *
 * @param {Object} dims - Rendering dimensions; must include `width` and `height`.
 * @param {Object} palette - Palette object; expects `palette.layers` (array) and `palette.ink`.
 * @param {Object} numbers - Numeric constants used for spacing/line-width computations (e.g., ONEFORTYFOUR, THIRTYTHREE).
 * @param {Object} settings - Helix configuration (see description above for expected fields).
 * @return {{rungs: number}} An object with `rungs` set to the number of rungs actually drawn.
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
 * Draws a stroked polyline connecting an ordered list of points.
 *
 * If `points` is empty, the function returns without drawing. The path is stroked
 * using the canvas context's current stroke style and line width.
 *
 * @param {Array<{x: number, y: number}>} points - Ordered array of coordinate objects to connect.
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
 * Draws a centered notice message near the bottom of the canvas.
 *
 * The text size scales with canvas width and a small padding is computed
 * from the smaller canvas dimension. The provided color is combined with
 * an alpha of 0.9 before rendering.
 *
 * @param {{width:number,height:number}} dims - Canvas dimensions used to position and size the text.
 * @param {string} color - CSS color (e.g. hex or named color); will be converted to an RGBA string with alpha 0.9.
 * @param {string} message - The text to draw, centered horizontally and placed just above the bottom edge.
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
 * Build a human-readable summary of per-layer rendering statistics.
 *
 * @param {Object} stats - Container of per-layer stats.
 * @param {Object} stats.vesicaStats - Vesica layer stats; must include numeric `circles`.
 * @param {Object} stats.treeStats - Tree-of-life stats; must include numeric `paths` and `nodes`.
 * @param {Object} stats.fibonacciStats - Fibonacci layer stats; must include numeric `points`.
 * @param {Object} stats.helixStats - Helix layer stats; must include numeric `rungs`.
 * @return {string} Single-line summary describing counts for each rendered layer.
 */
function summariseLayers(stats) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const tree = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  const helix = `${stats.helixStats.rungs} helix rungs`;
  return `Layers rendered - ${vesica}; ${tree}; ${fibonacci}; ${helix}.`;
}

/**
 * Convert a 6-digit hex color (with or without a leading '#') to a CSS `rgba(r,g,b,a)` string.
 *
 * The alpha argument is clamped to [0,1]. If `hex` is not a valid 6-hex-digit string the function
 * falls back to white (`rgba(255,255,255,a)`) with the clamped alpha.
 *
 * @param {string} hex - Hex color like `'#ff00aa'` or `'ff00aa'`.
 * @param {number} alpha - Alpha value; non-finite values treated as 0 and other values clamped to [0,1].
 * @return {string} CSS `rgba(...)` string.
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
 * Return a finite positive number from the given value or the numeric fallback.
 *
 * Converts `value` to a Number and returns it only if it's finite and strictly greater than 0.
 * Otherwise converts and returns `fallback` (may be NaN if `fallback` is not numeric).
 *
 * @param {*} value - Candidate value to coerce to a positive number.
 * @param {*} fallback - Value to use when `value` is not a finite positive number.
 * @return {number} A finite positive number derived from `value`, or Number(fallback) if `value` is invalid.
 */
function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : Number(fallback);
}

/**
 * Convert a value to a finite positive integer by rounding; otherwise return the numeric fallback.
 *
 * Attempts to coerce `value` to a Number and uses Math.round to produce an integer. If the result
 * is a finite number greater than zero that rounded value is returned; otherwise `fallback` is
 * coerced to a Number and returned.
 *
 * @param {*} value - The input to coerce and round.
 * @param {*} fallback - Returned (as Number) when `value` is not a finite positive integer.
 * @return {number} A finite positive integer derived from `value`, or Number(fallback) if not possible.
 */
function toPositiveInteger(value, fallback) {
  const number = Number(value);
  const rounded = Math.round(number);
  return Number.isFinite(number) && rounded > 0 ? rounded : Number(fallback);
}

/**
 * Clamp a value to the inclusive range [0, 1].
 *
 * Converts the input to a Number and returns 0 for non-finite values. Values
 * less than 0 return 0, values greater than 1 return 1, otherwise the numeric
 * value is returned unchanged.
 *
 * @param {*} value - Value to convert and clamp (will be coerced with Number()).
 * @returns {number} A finite number in the range [0, 1].
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
 * Normalize an alpha-like value to the [0,1] range, with a fallback for non-finite input.
 *
 * If value is exactly 0, returns 0 (preserves explicit zero). If value is finite, clamps it to [0,1].
 * Otherwise returns the provided fallback.
 *
 * @param {*} value - Candidate alpha value (may be any type); finite numbers are clamped to [0,1].
 * @param {number} fallback - Numeric value to return when `value` is not a finite number.
 * @return {number} A value in [0,1] or the provided fallback.
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
