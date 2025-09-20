/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  The renderer paints four calm layers in order: vesica field, Tree-of-Life scaffold,
  Fibonacci spiral, and double-helix lattice. Each helper function stays small and
  explains how the numerology constants keep depth without motion.
*/

const DEFAULT_NUMBERS = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
};

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

const TREE_TEMPLATE = [
  { key: "kether", name: "Kether", column: "centre", level: 9, lab: "Crown" },
  { key: "chokmah", name: "Chokmah", column: "right", level: 20, lab: "Wisdom" },
  { key: "binah", name: "Binah", column: "left", level: 20, lab: "Understanding" },
  { key: "daath", name: "Daath", column: "centre", level: 29, lab: "Hidden" },
  { key: "chesed", name: "Chesed", column: "right", level: 42, lab: "Mercy" },
  { key: "geburah", name: "Geburah", column: "left", level: 42, lab: "Severity" },
  { key: "tiphareth", name: "Tiphareth", column: "centre", level: 55, lab: "Beauty" },
  { key: "netzach", name: "Netzach", column: "right", level: 96, lab: "Victory" },
  { key: "hod", name: "Hod", column: "left", level: 96, lab: "Splendour" },
  { key: "yesod", name: "Yesod", column: "centre", level: 141, lab: "Foundation" },
  { key: "malkuth", name: "Malkuth", column: "centre", level: 144, lab: "Kingdom" }
];

const TREE_CONNECTIONS = [
  ["kether", "chokmah"],
  ["kether", "binah"],
  ["kether", "tiphareth"],
  ["chokmah", "binah"],
  ["chokmah", "chesed"],
  ["chokmah", "tiphareth"],
  ["binah", "geburah"],
  ["binah", "tiphareth"],
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
  ["netzach", "malkuth"],
  ["hod", "yesod"],
  ["hod", "malkuth"],
  ["yesod", "malkuth"]
];

/**
 * Render the complete helix composition onto a 2D canvas context.
 *
 * Renders four layered visual elements (vesica field, Tree of Life scaffold,
 * Fibonacci curve, and double-helix lattice) into the provided canvas context,
 * optionally drawing a notice string. If the context is missing or invalid,
 * rendering is skipped and a skipped-summary is returned.
 *
 * @param {Object} [options] - Rendering options.
 * @param {Object} [options.palette] - Partial palette to merge with defaults (bg, ink, layers).
 * @param {Object} [options.NUM] - Numeric overrides merged with default constants.
 * @param {string} [options.notice] - Optional bottom-centered notice string to render.
 * @returns {{summary: string}} An object containing a single human-readable summary
 * of what was drawn (or a skipped message when the context was unavailable).
 */
export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.save !== "function") {
    return { summary: "Canvas context unavailable; rendering skipped." };
  }

  const dims = resolveDimensions(ctx, options);
  const palette = mergePalette(options.palette);
  const numbers = mergeNumbers(options.NUM);
  const notice = typeof options.notice === "string" ? options.notice : null;

  ctx.save();
  clearStage(ctx, dims, palette, numbers);

  const vesicaStats = drawVesicaField(ctx, dims, palette, numbers);
  const treeStats = drawTreeOfLife(ctx, dims, palette, numbers);
  const fibonacciStats = drawFibonacciCurve(ctx, dims, palette, numbers);
  const helixStats = drawHelixLattice(ctx, dims, palette, numbers);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette, notice);
  }

  ctx.restore();
  return { summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats }) };
}

/**
 * Resolve rendering width and height from provided options or from the canvas.
 *
 * If numeric values are supplied on options.width or options.height those values are used;
 * otherwise the corresponding ctx.canvas dimensions are returned.
 * @param {Object} options - Optional overrides for dimensions.
 * @param {number} [options.width] - Explicit width in pixels; falls back to ctx.canvas.width when absent.
 * @param {number} [options.height] - Explicit height in pixels; falls back to ctx.canvas.height when absent.
 * @returns {{width: number, height: number}} The resolved width and height in pixels.
 */
function resolveDimensions(ctx, options) {
  const width = typeof options.width === "number" ? options.width : ctx.canvas.width;
  const height = typeof options.height === "number" ? options.height : ctx.canvas.height;
  return { width, height };
}

/**
 * Merge a partial palette with the renderer's defaults, producing a complete palette object.
 *
 * If `candidate.bg` or `candidate.ink` are strings they override the defaults; otherwise the default
 * background and ink colors are used. `candidate.layers`, if an array, is truncated to the default
 * number of layer colors and any missing entries are filled with the corresponding default layer
 * colors.
 *
 * @param {object} [candidate] - Partial palette to merge. May include `bg`, `ink`, and `layers`.
 * @return {{bg: string, ink: string, layers: string[]}} A palette object with keys `bg`, `ink`,
 *   and `layers` (an array whose length equals the default layer count).
 */
function mergePalette(candidate) {
  const fallback = DEFAULT_PALETTE.layers;
  const layers = Array.isArray(candidate?.layers) ? candidate.layers.slice(0, fallback.length) : [];
  while (layers.length < fallback.length) {
    layers.push(fallback[layers.length]);
  }
  return {
    bg: typeof candidate?.bg === "string" ? candidate.bg : DEFAULT_PALETTE.bg,
    ink: typeof candidate?.ink === "string" ? candidate.ink : DEFAULT_PALETTE.ink,
    layers
  };
}

/**
 * Merge a candidate numeric overrides object into the DEFAULT_NUMBERS set.
 *
 * Returns a new numbers object that starts with DEFAULT_NUMBERS and replaces
 * any keys present in DEFAULT_NUMBERS with finite numeric values from
 * `candidate`. Non-object or missing `candidate` returns a shallow copy of the
 * defaults.
 *
 * @param {Object|null|undefined} candidate - Partial mapping of numeric constants; only finite numbers for keys that exist in DEFAULT_NUMBERS are applied.
 * @returns {Object} A merged numbers object containing the resolved numeric constants.
 */
function mergeNumbers(candidate) {
  const merged = { ...DEFAULT_NUMBERS };
  if (!candidate || typeof candidate !== "object") {
    return merged;
  }
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    if (typeof candidate[key] === "number" && Number.isFinite(candidate[key])) {
      merged[key] = candidate[key];
    }
  }
  return merged;
}

/**
 * Paints the canvas background using the provided palette and applies the background glow.
 *
 * Fills the entire drawing area with palette.bg and then delegates to applyBackgroundGlow
 * to render layered halo/floor gradients.
 *
 * @param {Object} dims - Drawing dimensions.
 * @param {number} dims.width - Canvas width in pixels.
 * @param {number} dims.height - Canvas height in pixels.
 * @param {Object} palette - Color palette (must include `bg`); used for the fill and glow.
 * @param {Object} numbers - Numeric layout constants used by the glow routine.
 */
function clearStage(ctx, dims, palette, numbers) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
  applyBackgroundGlow(ctx, dims, palette, numbers);
}

/**
 * Paints a soft background glow composed of a central radial halo and a bottom floor gradient.
 *
 * Renders a radial gradient centered near the top-third of the canvas and a subtle vertical
 * linear gradient across the bottom, then fills the entire canvas with those gradients.
 *
 * @param {{width:number,height:number}} dims - Canvas dimensions.
 * @param {{bg:string,ink?:string,layers:string[]}} palette - Color palette; uses layered colors and `bg`.
 * @param {Object} numbers - Numeric constants object (expects `THREE` and `SEVEN` to compute radii/positions).
 */
function applyBackgroundGlow(ctx, dims, palette, numbers) {
  const cx = dims.width / 2;
  const cy = dims.height / numbers.THREE;
  const radius = Math.max(dims.width, dims.height) / (numbers.THREE * 0.9);
  const halo = ctx.createRadialGradient(cx, cy, radius / numbers.SEVEN, cx, cy, radius);
  halo.addColorStop(0, withAlpha(palette.layers[3], 0.2));
  halo.addColorStop(0.6, withAlpha(palette.layers[0], 0.08));
  halo.addColorStop(1, withAlpha(palette.bg, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, dims.width, dims.height);

  const floor = ctx.createLinearGradient(0, dims.height * 0.65, 0, dims.height);
  floor.addColorStop(0, withAlpha(palette.layers[5], 0.05));
  floor.addColorStop(1, withAlpha(palette.bg, 0.8));
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

/**
 * Paints the vesica layer onto the provided 2D canvas context.
 *
 * Draws a grid of overlapping vesica pairs, a central halo ring, and a dashed vertical axis using the supplied palette and layout numbers. Returns simple statistics about the rendered field.
 *
 * @returns {{pairs: number, radius: number}} counts of vesica pairs drawn and the shared cell radius used for the grid.
function drawVesicaField(ctx, dims, palette, numbers) {
  const grid = buildVesicaGrid(dims, numbers);
  ctx.save();
  ctx.globalAlpha = 0.68;
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = Math.max(1.5, dims.width / (numbers.ONEFORTYFOUR * 1.2));
  grid.cells.forEach(cell => drawVesicaPair(ctx, cell));

  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = palette.layers[5];
  ctx.lineWidth = Math.max(1.2, dims.width / numbers.ONEFORTYFOUR);
  drawVesicaHalo(ctx, dims, numbers);

  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = palette.layers[2];
  ctx.setLineDash([numbers.TWENTYTWO, numbers.TWENTYTWO]);
  drawVesicaAxis(ctx, dims);
  ctx.restore();
  return { pairs: grid.cells.length, radius: grid.radius };
}

/**
 * Build a grid of vesica cell positions and sizing used to draw paired circles.
 *
 * The function computes a rectangular grid anchored by an outer margin and subdivided
 * into rows and columns determined by numeric constants. Each cell includes a center
 * point and precomputed radii used by vesica drawing routines.
 *
 * @param {{width:number,height:number}} dims - Canvas dimensions used to calculate margin and spacing.
 * @param {Object} numbers - Numeric constants object (expects keys like SEVEN, THREE, NINE, ELEVEN, TWENTYTWO, THIRTYTHREE) used to derive rows, columns, scaling, and offsets.
 * @return {{cells:Array<{cx:number,cy:number,radius:number,offset:number}>, radius:number}} An object containing:
 *   - cells: an array of cell descriptors with center coordinates (cx, cy), computed radius, and horizontal offset for paired circles.
 *   - radius: the shared cell radius (useful for summary/metrics).
 */
function buildVesicaGrid(dims, numbers) {
  const rows = numbers.SEVEN;
  const cols = numbers.THREE;
  const margin = dims.width / numbers.THIRTYTHREE;
  const innerWidth = dims.width - margin * 2;
  const innerHeight = dims.height - margin * 2;
  const xStep = cols > 1 ? innerWidth / (cols - 1) : innerWidth;
  const yStep = rows > 1 ? innerHeight / (rows - 1) : innerHeight;
  const radius = Math.min(xStep, yStep) * (numbers.NINE / numbers.TWENTYTWO);
  const offset = radius * (numbers.ELEVEN / numbers.TWENTYTWO);

  const cells = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = margin + col * xStep;
      const cy = margin + row * yStep;
      cells.push({ cx, cy, radius, offset });
    }
  }
  return { cells, radius };
}

/**
 * Draw two stroked circles side-by-side (a vesica pair) centered around a cell.
 *
 * The circles are horizontally offset from the cell center by `cell.offset`, share
 * the same `cell.radius`, and are stroked using the canvas context's current stroke style.
 *
 * @param {{cx:number, cy:number, radius:number, offset:number}} cell - Cell geometry:
 *   cx, cy: center coordinates; radius: circle radius; offset: horizontal offset from cx.
 */
function drawVesicaPair(ctx, cell) {
  ctx.beginPath();
  ctx.arc(cell.cx - cell.offset, cell.cy, cell.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cell.cx + cell.offset, cell.cy, cell.radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Draws a single halo circle (vesica halo) near the top-center of the canvas.
 *
 * The halo is stroked, centered at (width/2, height/NINE) and sized so its radius
 * is the smaller of width/height divided by (THREE * 0.9).
 *
 * @param {Object} dims - Canvas dimensions; expects {width, height}.
 * @param {Object} numbers - Numeric constants; this function reads `NINE` and `THREE`.
 */
function drawVesicaHalo(ctx, dims, numbers) {
  const cx = dims.width / 2;
  const cy = dims.height / numbers.NINE;
  const radius = Math.min(dims.width, dims.height) / (numbers.THREE * 0.9);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Draws a vertical center axis across the canvas.
 *
 * Renders a single stroked line at x = width/2 spanning y=0 to y=height using the current canvas stroke style.
 *
 * @param {{width:number, height:number}} dims - Canvas dimensions; requires numeric `width` and `height`.
 */
function drawVesicaAxis(ctx, dims) {
  const cx = dims.width / 2;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, dims.height);
  ctx.stroke();
}

/**
 * Draws the Tree of Life layer: lays out template nodes, renders straight-line connections between them, then draws each node.
 *
 * @returns {{nodes:number,paths:number}} Counts of rendered nodes and the number of connection paths considered.
 */
function drawTreeOfLife(ctx, dims, palette, numbers) {
  const layout = buildTreeLayout(dims, numbers);
  ctx.save();
  ctx.strokeStyle = palette.layers[3];
  ctx.lineWidth = Math.max(1.4, dims.width / numbers.ONEFORTYFOUR);
  TREE_CONNECTIONS.forEach(([fromKey, toKey]) => {
    const from = layout.get(fromKey);
    const to = layout.get(toKey);
    if (!from || !to) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  ctx.fillStyle = palette.layers[4];
  layout.forEach(node => drawTreeNode(ctx, node, palette));
  ctx.restore();
  return { nodes: layout.size, paths: TREE_CONNECTIONS.length };
}

/**
 * Build a layout map for the Tree of Life nodes, mapping each node key to its screen position and metadata.
 *
 * The layout centers columns on the canvas horizontal center; nodes with `column` "left" or "right"
 * are offset by width / numbers.THREE, and the vertical spacing is numbers.ONEFORTYFOUR per level.
 *
 * @param {{width: number, height: number}} dims - Canvas dimensions used to compute positions.
 * @param {object} numbers - Numeric constants object; must provide `THREE` and `ONEFORTYFOUR`.
 * @return {Map<string, {key: string, name: string, label: string|undefined, x: number, y: number}>}
 *   Map keyed by node key; each value contains the node's key, display name, optional label, and computed x/y.
 */
function buildTreeLayout(dims, numbers) {
  const map = new Map();
  const centreX = dims.width / 2;
  const columnOffset = dims.width / numbers.THREE;
  const unit = dims.height / numbers.ONEFORTYFOUR;

  TREE_TEMPLATE.forEach(template => {
    const x = template.column === "left"
      ? centreX - columnOffset
      : template.column === "right"
        ? centreX + columnOffset
        : centreX;
    const y = template.level * unit;
    map.set(template.key, {
      key: template.key,
      name: template.name,
      label: template.lab,
      x,
      y
    });
  });
  return map;
}

/**
 * Draws a Tree-of-Life node (filled circle) with its name above and an optional label below.
 *
 * Renders a circular node centered at node.x,node.y using a fixed visual radius, strokes the outline
 * with palette.ink, writes the node.name above the circle, and — if node.label is present — writes
 * the label below using a semi-transparent ink color.
 *
 * @param {{x: number, y: number, name: string, label?: string}} node - Position and text for the node.
 * @param {{ink: string}} palette - Color palette; `palette.ink` is used for strokes and text.
 */
function drawTreeNode(ctx, node, palette) {
  const radius = 14;
  ctx.beginPath();
  ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = palette.ink;
  ctx.font = "12px/1.4 system-ui";
  ctx.textAlign = "center";
  ctx.fillText(node.name, node.x, node.y - radius - 8);
  if (node.label) {
    ctx.fillStyle = withAlpha(palette.ink, 0.7);
    ctx.font = "10px/1.4 system-ui";
    ctx.fillText(node.label, node.x, node.y + radius + 14);
    ctx.fillStyle = palette.ink;
  }
}

/**
 * Render a Fibonacci curve and its point markers onto the canvas.
 *
 * Constructs a Fibonacci sequence up to `numbers.ONEFORTYFOUR`, maps the sequence to screen points, draws a stroked polyline through those points using `palette.layers[1]`, and then draws small filled circular markers at each point.
 *
 * @returns {{points: number}} An object with `points` equal to the number of markers/points drawn.
 */
function drawFibonacciCurve(ctx, dims, palette, numbers) {
  const sequence = buildFibonacciSequence(numbers.ONEFORTYFOUR);
  const points = buildFibonacciPoints(sequence, dims, numbers);

  ctx.save();
  ctx.strokeStyle = palette.layers[1];
  ctx.lineWidth = Math.max(1.5, dims.width / numbers.ONEFORTYFOUR);
  ctx.lineJoin = "round";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.fillStyle = palette.layers[1];
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
  return { points: points.length };
}

/**
 * Build a Fibonacci sequence starting from 1, 1 up to the provided limit.
 *
 * The returned array begins with [1, 1] and appends successive Fibonacci numbers.
 * The sequence stops before exceeding `limit`; if a generated value equals `limit`
 * it is included.
 *
 * @param {number} limit - Maximum allowed value for sequence elements.
 * @returns {number[]} An array of Fibonacci numbers (each <= limit, unless `limit` < 1 in which case the initial seeds are returned).
 */
function buildFibonacciSequence(limit) {
  const seq = [1, 1];
  while (seq[seq.length - 1] < limit) {
    const next = seq[seq.length - 1] + seq[seq.length - 2];
    seq.push(next);
    if (next === limit) {
      break;
    }
    if (next > limit) {
      seq.pop();
      break;
    }
  }
  return seq;
}

/**
 * Convert a numeric sequence into screen coordinates arranged in a radial Fibonacci layout.
 *
 * Each sequence value is mapped to a point around the canvas center using polar coordinates:
 * - angle = index * (π / numbers.THREE)
 * - radius = (value * base) / numbers.ONEFORTYFOUR, where base = min(width,height) / (numbers.ONEFORTYFOUR / numbers.NINE)
 * - final coordinate scaled by numbers.THIRTYTHREE and offset from the canvas centre.
 *
 * @param {number[]} sequence - Numeric sequence (e.g., Fibonacci numbers) to convert to points.
 * @param {{width: number, height: number}} dims - Canvas dimensions used to compute center and scaling.
 * @param {Object} numbers - Numeric constants object (expects at least ONEFORTYFOUR, NINE, THREE, THIRTYTHREE).
 * @return {{x: number, y: number}[]} Array of point objects with pixel coordinates relative to the canvas.
 */
function buildFibonacciPoints(sequence, dims, numbers) {
  const centreX = dims.width / 2;
  const centreY = dims.height / 2;
  const base = Math.min(dims.width, dims.height) / (numbers.ONEFORTYFOUR / numbers.NINE);
  return sequence.map((value, index) => {
    const angle = index * (Math.PI / numbers.THREE);
    const radius = value * base / numbers.ONEFORTYFOUR;
    return {
      x: centreX + Math.cos(angle) * radius * numbers.THIRTYTHREE,
      y: centreY + Math.sin(angle) * radius * numbers.THIRTYTHREE
    };
  });
}

/**
 * Draws a double-helix lattice onto the provided 2D canvas context.
 *
 * Renders the left and right helical strands as stroked polylines and draws horizontal rungs
 * connecting the strands. The function preserves and restores the canvas state and scales
 * stroke widths relative to the canvas dimensions and numeric constants.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context to draw into.
 * @param {Object} dims - Rendering dimensions { width, height }.
 * @param {Object} palette - Color palette (uses palette.layers for strand and rung colors).
 * @param {Object} numbers - Numeric constants used for sizing and spacing.
 * @returns {{stations: number}} An object with `stations` equal to the number of drawn rungs.
 */
function drawHelixLattice(ctx, dims, palette, numbers) {
  const rails = buildHelixRails(dims, numbers);
  ctx.save();
  ctx.strokeStyle = palette.layers[5];
  ctx.lineWidth = Math.max(1.4, dims.width / numbers.ONEFORTYFOUR);
  ctx.beginPath();
  rails.left.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.beginPath();
  rails.right.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.strokeStyle = withAlpha(palette.layers[5], 0.6);
  ctx.lineWidth = Math.max(1, dims.width / numbers.ONEFORTYFOUR);
  rails.rungs.forEach(rung => drawHelixRung(ctx, rung));

  ctx.restore();
  return { stations: rails.rungs.length };
}

/**
 * Build coordinates for a 2D double-helix lattice.
 *
 * Produces three arrays describing the left and right strand rails and the horizontal rungs
 * that connect them. The helix is computed over `numbers.THIRTYTHREE` steps, vertically
 * distributed across dims.height and horizontally centered on dims.width. A sinusoidal
 * horizontal offset creates the helix crossover; every `numbers.THREE`-th step yields a rung.
 *
 * @param {{width:number, height:number}} dims - Canvas dimensions used to scale and center the rails.
 * @param {{THIRTYTHREE:number, THREE:number}} numbers - Numeric constants: `THIRTYTHREE` is the total step count, `THREE` is the rung frequency.
 * @return {{left: Array<{x:number,y:number}>, right: Array<{x:number,y:number}>, rungs: Array<{leftX:number,rightX:number,y:number}>}} 
 *         An object with:
 *         - `left`: ordered points for the left strand,
 *         - `right`: ordered points for the right strand,
 *         - `rungs`: horizontal connections containing leftX, rightX and y coordinates.
 */
function buildHelixRails(dims, numbers) {
  const steps = numbers.THIRTYTHREE;
  const centreX = dims.width / 2;
  const amplitude = dims.width / numbers.THIRTYTHREE;
  const strandOffset = dims.width / numbers.THREE;
  const stepY = dims.height / (steps - 1);

  const left = [];
  const right = [];
  const rungs = [];

  for (let i = 0; i < steps; i += 1) {
    const y = i * stepY;
    const phase = (i / (steps - 1)) * Math.PI * 2;
    const sinShift = Math.sin(phase) * amplitude;
    const leftX = centreX - strandOffset + sinShift;
    const rightX = centreX + strandOffset - sinShift;
    left.push({ x: leftX, y });
    right.push({ x: rightX, y });

    if (i % numbers.THREE === 0) {
      rungs.push({ leftX, rightX, y });
    }
  }

  return { left, right, rungs };
}

/**
 * Draws a horizontal helix rung (a single connector) between two strand points.
 *
 * The function issues a stroked line from `rung.leftX` to `rung.rightX` at vertical position `rung.y`
 * using the canvas context's current stroke style and line width.
 *
 * @param {Object} rung - Rung geometry.
 * @param {number} rung.leftX - X coordinate of the left strand connection.
 * @param {number} rung.rightX - X coordinate of the right strand connection.
 * @param {number} rung.y - Y coordinate where the rung is drawn.
 */
function drawHelixRung(ctx, rung) {
  ctx.beginPath();
  ctx.moveTo(rung.leftX, rung.y);
  ctx.lineTo(rung.rightX, rung.y);
  ctx.stroke();
}

/**
 * Draws a centered, semi-opaque notice near the bottom of the canvas.
 *
 * Renders `text` in a 12px system UI font, horizontally centered at half the canvas width
 * and positioned 16px above the bottom edge. The ink color from `palette.ink` is used
 * with 70% opacity.
 * @param {{width: number, height: number}} dims - Canvas dimensions.
 * @param {{ink: string}} palette - Palette object; `ink` is the base color used for the text.
 * @param {string} text - The notice text to draw.
 */
function drawCanvasNotice(ctx, dims, palette, text) {
  ctx.save();
  ctx.fillStyle = withAlpha(palette.ink, 0.7);
  ctx.font = "12px/1.4 system-ui";
  ctx.textAlign = "center";
  ctx.fillText(text, dims.width / 2, dims.height - 16);
  ctx.restore();
}

/**
 * Build a compact human-readable summary string describing counts for each rendered layer.
 *
 * The function reads numeric counters from the provided `stats` object (safely handling missing
 * or non-finite values) and returns a single string like:
 * "Vesica 21 pairs | Tree 10 nodes/9 paths | Fibonacci 13 markers | Helix 7 rungs".
 *
 * @param {Object} stats - Layer statistics produced by the renderer.
 *   Expected shape (fields are optional): {
 *     vesicaStats: { pairs: number },
 *     treeStats: { nodes: number, paths: number },
 *     fibonacciStats: { points: number },
 *     helixStats: { stations: number }
 *   }
 * @return {string} A joined summary of counts for Vesica, Tree, Fibonacci, and Helix layers.
 */
function summariseLayers(stats) {
  return [
    `Vesica ${formatCount(stats.vesicaStats?.pairs)} pairs`,
    `Tree ${formatCount(stats.treeStats?.nodes)} nodes/${formatCount(stats.treeStats?.paths)} paths`,
    `Fibonacci ${formatCount(stats.fibonacciStats?.points)} markers`,
    `Helix ${formatCount(stats.helixStats?.stations)} rungs`
  ].join(" | ");
}

/**
 * Return the given numeric value if it's a finite number; otherwise return 0.
 * @param {*} value - Value to validate as a finite number.
 * @returns {number} The original value when finite, otherwise 0.
 */
function formatCount(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * Convert a 6‑digit hex color to an rgba() CSS string with the given alpha.
 *
 * If `hex` is not a valid 6‑character hex string (optionally prefixed with `#`), the original `hex` value is returned unchanged.
 *
 * @param {string} hex - A 6-digit hexadecimal color string (e.g. `"#ff8800"` or `"ff8800"`).
 * @param {number} alpha - Alpha value between 0 and 1.
 * @return {string} An `rgba(r, g, b, a)` string when input is valid, otherwise the original `hex` value.
 */
function withAlpha(hex, alpha) {
  const value = String(hex || "").replace(/^#/, "");
  if (value.length !== 6) {
    return hex;
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
