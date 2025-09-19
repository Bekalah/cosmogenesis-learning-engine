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
 * Render the full Cosmic Helix composition to a 2D canvas in a single, non-animated pass.
 *
 * Renders four layered visuals in order — vesica field, Tree of Life scaffold, Fibonacci spiral,
 * and double-helix lattice — then optionally draws a notice. Inputs are merged with sane defaults;
 * the function never throws for invalid numeric or color inputs and returns a small summary of what
 * was drawn.
 *
 * @param {CanvasRenderingContext2D} ctx - The rendering context whose `canvas` will be painted. If missing or invalid, the function returns { ok: false, reason: "missing-context" } without modifying any canvas.
 * @param {Object} [options] - Optional render configuration.
 * @param {Object} [options.palette] - Partial palette to merge with defaults (bg, ink, muted, layers[]).
 * @param {Object} [options.NUM] - Optional numerology overrides (positive numeric constants).
 * @param {Object} [options.geometry] - Optional geometry overrides for `vesica`, `treeOfLife`, `fibonacci`, and `helix`.
 * @param {string} [options.notice] - Optional short notice string to draw centered near the bottom of the canvas.
 * @return {{ok: true, summary: string} | {ok: false, reason: string}} Object describing success and a human-readable summary of rendered layer counts, or a failure reason.
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
 * Normalize canvas width and height using provided options with fallbacks to the context's canvas size.
 *
 * If options.width or options.height are provided and are finite positive numbers they are used;
 * otherwise the function returns the canvas dimensions from the rendering context.
 *
 * @param {Object} options - Optional overrides.
 * @param {number} [options.width] - Desired width in pixels; must be a finite positive number to take effect.
 * @param {number} [options.height] - Desired height in pixels; must be a finite positive number to take effect.
 * @return {{width: number, height: number}} Normalized width and height in pixels.
 */
function normaliseDimensions(ctx, options) {
  const width = toPositiveNumber(options.width, ctx.canvas.width);
  const height = toPositiveNumber(options.height, ctx.canvas.height);
  return { width, height };
}

/**
 * Merge a partial palette with DEFAULT_PALETTE, returning a complete palette object.
 *
 * Missing or invalid string fields (bg, ink, muted) are replaced by defaults.
 * The returned `layers` array is taken from `candidate.layers` if an array,
 * truncated or padded to match DEFAULT_PALETTE.layers length using default layer colors.
 *
 * @param {Object} [candidate={}] - Partial palette to merge.
 * @param {string} [candidate.bg] - Background color (hex or CSS color string).
 * @param {string} [candidate.ink] - Primary ink color.
 * @param {string} [candidate.muted] - Muted/secondary color.
 * @param {string[]} [candidate.layers] - Array of layer colors; will be truncated or padded to the default length.
 * @returns {{bg: string, ink: string, muted: string, layers: string[]}} A palette with guaranteed bg, ink, muted, and a layers array of the default length.
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
 * Merge a partial numerology candidate into the default numeric constants.
 *
 * Only finite positive numeric properties from `candidate` override the corresponding
 * entries in DEFAULT_NUMBERS; invalid, non-numeric, non-finite, or non-positive values
 * are ignored and the default retained.
 *
 * @param {Object} [candidate={}] - Partial mapping of numeric constants to override.
 * @return {Object} A new object containing the same keys as DEFAULT_NUMBERS with
 *   validated overrides applied.
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
 * Merge a partial geometry configuration with the module defaults.
 *
 * Accepts an object that may contain any subset of geometry sections and returns
 * a fully populated geometry object with the sections: `vesica`, `treeOfLife`,
 * `fibonacci`, and `helix`. Missing or invalid fields are replaced by sensible
 * defaults via the section-specific merge helpers.
 *
 * @param {Object} [candidate] - Partial geometry overrides for one or more sections.
 * @return {{vesica: Object, treeOfLife: Object, fibonacci: Object, helix: Object}} The merged geometry configuration.
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
 * Merge and validate vesica grid geometry with defaults.
 *
 * Produces a normalized vesica configuration by taking numeric values from
 * `config` when they are finite and positive, otherwise falling back to the
 * vesica defaults from DEFAULT_GEOMETRY.
 *
 * @param {Object} [config] - Partial vesica configuration.
 * @param {number} [config.rows] - Number of grid rows.
 * @param {number} [config.columns] - Number of grid columns.
 * @param {number} [config.paddingDivisor] - Divisor used to compute grid padding.
 * @param {number} [config.radiusFactor] - Factor controlling circle radius relative to cell size.
 * @param {number} [config.strokeDivisor] - Divisor used to derive stroke width from radius.
 * @param {number} [config.alpha] - Alpha transparency for vesica strokes (0–1). A value of 0 is preserved; non-finite values fall back to default.
 * @return {Object} Normalized vesica settings containing validated numeric fields:
 *  - rows, columns, paddingDivisor, radiusFactor, strokeDivisor, alpha
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
 * Normalize and validate Tree-of-Life layout configuration, returning a safe geometry object.
 *
 * Takes an optional partial configuration for the Tree-of-Life layer and merges it with
 * defaults, producing validated node and edge lists and numeric layout parameters.
 * - Nodes: accepts an array of node objects; each resulting node will have `id` (string),
 *   `title` (string), `level` (number), and `xFactor` (clamped to [0,1]). Missing or
 *   invalid fields fall back to the default node at the same index (wrapping as needed).
 * - Edges: accepts an array of 2-item edge tuples; edges referencing unknown node ids
 *   are removed.
 * - Numeric layout fields (`marginDivisor`, `radiusDivisor`, `labelOffset`) are validated
 *   to be finite positive numbers (or fall back to defaults). `labelFont` falls back to
 *   the default string when not provided.
 *
 * @param {Object} [config={}] Partial Tree-of-Life configuration.
 * @param {Array<Object>} [config.nodes] Optional node definitions; each may include
 *   `id`, `title`, `level`, and `xFactor`. Invalid or missing properties are replaced
 *   with defaults.
 * @param {Array<Array>} [config.edges] Optional edge list as arrays of two node ids.
 * @param {number} [config.marginDivisor] Optional positive number controlling layout margin.
 * @param {number} [config.radiusDivisor] Optional positive number controlling node radius scaling.
 * @param {number} [config.labelOffset] Optional numeric offset for label placement.
 * @param {string} [config.labelFont] Optional font string for node labels.
 * @return {Object} Normalized Tree-of-Life settings:
 *   - marginDivisor {number}
 *   - radiusDivisor {number}
 *   - labelOffset {number}
 *   - labelFont {string}
 *   - nodes {Array<{id:string,title:string,level:number,xFactor:number}>}
 *   - edges {Array<[string,string]>}
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
 * Merge and validate a Fibonacci geometry configuration with defaults.
 *
 * Accepts a partial config and returns a fully populated fibonacci settings object where numeric fields
 * are coerced to positive numbers/integers and alpha is clamped. Invalid or missing inputs fall back
 * to DEFAULT_GEOMETRY.fibonacci.
 *
 * @param {Object} [config={}] - Partial fibonacci configuration.
 * @param {number} [config.sampleCount] - Desired number of sample points (coerced to a positive integer).
 * @param {number} [config.turns] - Turn count for the spiral (coerced to a positive number).
 * @param {number} [config.baseRadiusDivisor] - Divisor controlling base radius (coerced to a positive number).
 * @param {number} [config.phi] - Growth factor / golden-ratio variant (coerced to a positive number).
 * @param {number} [config.alpha] - Stroke alpha; clamped to [0,1] (exact 0 preserved).
 * @returns {Object} Merged fibonacci settings: { sampleCount, turns, baseRadiusDivisor, phi, alpha }.
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
 * Returns a helix configuration object where numeric inputs from `config`
 * are validated/clamped (positive integers or numbers, alpha clamped) and
 * missing or invalid fields fall back to DEFAULT_GEOMETRY.helix.
 *
 * @param {Object} [config] - Partial helix settings to merge.
 * @param {number} [config.sampleCount] - Number of sample points per strand (positive integer).
 * @param {number} [config.cycles] - Number of helix cycles across the canvas (positive number).
 * @param {number} [config.amplitudeDivisor] - Divisor controlling vertical amplitude (positive number).
 * @param {number} [config.phaseOffset] - Phase offset (radians); used as-is when finite.
 * @param {number} [config.crossTieCount] - Number of cross-ties (rungs) to draw (positive integer).
 * @param {number} [config.strandAlpha] - Alpha for strand strokes (clamped to [0,1], 0 allowed).
 * @param {number} [config.rungAlpha] - Alpha for rung strokes (clamped to [0,1], 0 allowed).
 * @return {Object} Merged helix settings with the following properties:
 *   - sampleCount {number}
 *   - cycles {number}
 *   - amplitudeDivisor {number}
 *   - phaseOffset {number}
 *   - crossTieCount {number}
 *   - strandAlpha {number}
 *   - rungAlpha {number}
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
 * Fill the entire canvas area with a solid color.
 *
 * @param {{width:number,height:number}} dims - Canvas dimensions used to determine the fill rectangle.
 * @param {string} color - Any valid CanvasRenderingContext2D fillStyle (e.g., hex, rgb, rgba, named color).
 */
function clearStage(ctx, dims, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

/**
 * Draws a grid of vesica pairs (two overlapping circles) across the canvas.
 *
 * Renders `rows × columns` pairs of offset circles using the provided color and
 * geometry settings. Returns the total number of circles drawn (pairs count × 2)
 * and the computed circle radius.
 *
 * @param {Object} dims - Canvas dimensions with numeric `width` and `height`.
 * @param {string} color - Base hex color used for the stroke (alpha applied from settings).
 * @param {Object} numbers - Numerology constants object; this function uses `ELEVEN` and `TWENTYTWO`.
 * @param {Object} settings - Vesica layout and style settings. Expected fields:
 *   - rows {number}
 *   - columns {number}
 *   - paddingDivisor {number}
 *   - radiusFactor {number}
 *   - strokeDivisor {number}
 *   - alpha {number}
 * @return {{ circles: number, radius: number }} Object with `circles` (total circles drawn)
 *         and the computed `radius` for each circle.
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
 * Stroke a paired "vesica" of two equal circles horizontally offset from a center point.
 *
 * Draws two stroked circles on the provided CanvasRenderingContext2D centered at
 * (cx - offset, cy) and (cx + offset, cy) with the given radius. Both circles use
 * the context's current path/style state.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context to draw into.
 * @param {number} cx - X coordinate of the pair's central axis (pixels).
 * @param {number} cy - Y coordinate for both circle centers (pixels).
 * @param {number} radius - Radius of each circle (pixels). Expected to be non-negative.
 * @param {number} offset - Horizontal offset from cx to each circle center (pixels).
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
 * Draws the Tree of Life layer: edges between sephirot and circular node markers, with optional labels.
 *
 * The function computes on-canvas positions from the provided node list (using `level` to space rows
 * vertically and `xFactor` to place nodes across the usable width), strokes connecting edges, fills
 * and outlines node circles, and optionally draws centered labels beneath each node.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context.
 * @param {{width:number,height:number}} dims - Canvas dimensions used to compute margins and scaling.
 * @param {Object} palette - Color palette; uses palette.layers[1] for edge stroke, palette.layers[2] for node fill, and palette.ink for outlines/labels.
 * @param {Object} numbers - Numerology constants; uses numbers.NINETYNINE to compute an edge stroke width fallback.
 * @param {Object} settings - Tree layout and drawing settings:
 *   - {Array<{id:string,title:string,level:number,xFactor:number}>} nodes - Node definitions; `level` must be a non-negative integer, `xFactor` is treated as [0,1].
 *   - {Array<[string,string]>} edges - Pairs of node ids [fromId, toId] defining connections; invalid ids are ignored.
 *   - {number} marginDivisor - Divisor to compute outer margin from the smaller canvas dimension.
 *   - {number} radiusDivisor - Divisor to compute node circle radius from the smaller canvas dimension.
 *   - {number} labelOffset - Vertical offset applied to label baseline (0 disables labels).
 *   - {string} labelFont - CSS font string used when rendering labels.
 *
 * @return {{nodes:number, paths:number}} Counts of rendered items: `nodes` is the number of node positions computed, `paths` is the number of edges attempted (length of `settings.edges`).
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
 * Render a static logarithmic "Fibonacci" spiral onto the provided canvas context.
 *
 * The spiral is sampled as a polyline and stroked using the given color and
 * per-layer alpha. Coordinates and scale are derived from the canvas dimensions
 * and the provided settings; line width is scaled using the numerology constants.
 *
 * @param {{width:number,height:number}} dims - Canvas dimensions used for layout and scaling.
 * @param {string} color - Stroke color (hex or any CSS color); combined with `settings.alpha`.
 * @param {{sampleCount:number,turns:number,phi:number,baseRadiusDivisor:number,alpha:number}} settings - Rendering controls:
 *   - sampleCount: number of points to sample along the spiral (minimum 2).
 *   - turns: number of full rotations of the spiral.
 *   - phi: exponential growth base for the radius (recommended > 1).
 *   - baseRadiusDivisor: divisor of the smaller canvas dimension to compute base radius.
 *   - alpha: stroke opacity in [0,1].
 * @returns {{points:number}} An object containing `points`, the number of sampled points drawn.
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
 * Draws a double‑helix lattice (two sinusoidal strands with cross‑ties) onto the canvas.
 *
 * Renders two phase‑shifted strands across the horizontal span and draws a set of regular
 * cross‑ties (rungs) between corresponding strand points. Stroke colours and opacities are
 * taken from the provided palette and settings; geometry is computed from dims and numerology
 * constants.
 *
 * @param {Object} dims - Canvas dimensions ({ width, height }).
 * @param {Object} palette - Colour palette; uses palette.layers[4], palette.layers[5], and palette.ink.
 * @param {Object} numbers - Numerology constants (expects ONEFORTYFOUR and THIRTYTHREE).
 * @param {Object} settings - Helix configuration:
 *   - {number} sampleCount: number of sample points along each strand (minimum 2).
 *   - {number} cycles: number of full sinusoidal cycles across the span.
 *   - {number} amplitudeDivisor: divisor of canvas height to compute strand amplitude.
 *   - {number} phaseOffset: phase shift between strands, in degrees.
 *   - {number} crossTieCount: desired number of rungs (cross‑ties).
 *   - {number} strandAlpha: opacity applied to strand strokes (0–1).
 *   - {number} rungAlpha: opacity applied to rung strokes (0–1).
 * @returns {{ rungs: number }} Number of drawn cross‑ties as the `rungs` property.
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
 * Stroke a connected polyline through an ordered list of points on the provided 2D canvas context.
 *
 * Does nothing if `points` is empty. Uses the context's current path and stroke settings
 * (strokeStyle, lineWidth, lineJoin, etc.).
 *
 * @param {Array<{x:number,y:number}>} points - Ordered array of 2D points to connect with straight segments.
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
 * Draws a centered notice string near the bottom of the canvas.
 *
 * The notice is horizontally centered and positioned above the bottom edge using
 * padding derived from DEFAULT_NUMBERS.THIRTYTHREE. Font size is computed as
 * max(14, dims.width / 72). The provided color is rendered with 0.9 alpha.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context.
 * @param {{width: number, height: number}} dims - Canvas dimensions ({ width, height }).
 * @param {string} color - Base color (hex or any canvas-acceptable color) used for the text; alpha is applied internally.
 * @param {string} message - The notice text to render.
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
 * Build a concise, human-readable summary of counts for each rendered layer.
 *
 * @param {Object} stats - Aggregated per-layer statistics.
 * @param {Object} stats.vesicaStats - Vesica layer stats; required property: `circles` (number).
 * @param {Object} stats.treeStats - Tree-of-Life stats; required properties: `paths` (number) and `nodes` (number).
 * @param {Object} stats.fibonacciStats - Fibonacci spiral stats; required property: `points` (number).
 * @param {Object} stats.helixStats - Helix lattice stats; required property: `rungs` (number).
 * @returns {string} One-line summary, e.g. "Layers rendered - 42 vesica circles; 11 paths / 10 nodes; 100 spiral points; 20 helix rungs."
 */
function summariseLayers(stats) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const tree = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  const helix = `${stats.helixStats.rungs} helix rungs`;
  return `Layers rendered - ${vesica}; ${tree}; ${fibonacci}; ${helix}.`;
}

/**
 * Convert a 6-digit hex color (with or without a leading '#') to an `rgba(...)` string using the provided alpha.
 *
 * If `hex` is not a valid 6-hex-digit string, returns white with the clamped alpha. `alpha` is clamped to [0,1].
 * @param {string} hex - Hex color like "#RRGGBB" or "RRGGBB".
 * @param {number} alpha - Desired opacity; non-finite values are treated as 0 and values outside [0,1] are clamped.
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
 * Coerce a value to a finite positive number; if the coercion does not produce a number > 0, return Number(fallback).
 * @param {*} value - Value to coerce to a number.
 * @param {number|string} fallback - Fallback used when `value` is not a finite positive number; coerced with `Number()`.
 * @return {number} A finite positive number (either the coerced `value` or `Number(fallback)`).
 */
function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : Number(fallback);
}

/**
 * Convert a value to a finite positive integer, falling back when not possible.
 *
 * Attempts to coerce `value` to a Number and rounds it to the nearest integer.
 * If the result is a finite number greater than 0, that rounded integer is returned;
 * otherwise `fallback` is coerced to a Number and returned.
 *
 * @param {*} value - Input to convert (will be Number(value) then rounded).
 * @param {*} fallback - Returned (as Number(fallback)) when `value` is not a finite positive integer.
 * @return {number} A positive integer parsed from `value`, or Number(fallback) if conversion fails.
 */
function toPositiveInteger(value, fallback) {
  const number = Number(value);
  const rounded = Math.round(number);
  return Number.isFinite(number) && rounded > 0 ? rounded : Number(fallback);
}

/**
 * Convert a value to a finite number and clamp it to the range [0, 1].
 *
 * Non-finite inputs (NaN, Infinity, -Infinity) and negative values return 0;
 * values greater than 1 return 1; otherwise the numeric value is returned.
 *
 * @param {*} value - The input to convert and clamp.
 * @returns {number} A finite number in the range 0 to 1.
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
 * Clamp a value to the [0, 1] alpha range, treating an exact `0` as a preserved zero.
 *
 * If `value` is exactly `0` the function returns `0`. If `value` coerces to a finite number
 * the result is clamped to the inclusive range [0, 1]. If `value` is not a finite number,
 * the provided `fallback` is returned unchanged.
 *
 * @param {*} value - The candidate alpha value to clamp; may be any type.
 * @param {number} fallback - Value to return when `value` is not a finite number.
 * @returns {number} A number in [0,1] (or `0`), or the original `fallback` when `value` is non-finite.
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
