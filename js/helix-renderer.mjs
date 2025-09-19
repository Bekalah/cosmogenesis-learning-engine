/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry tuned to the luminous cathedral style.

  Layers:
    1) Vesica field (intersecting circles and mandorla halos)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths + architectural vault)
    3) Fibonacci curve (logarithmic halo traced with calm markers)
    4) Double-helix lattice (two phase-shifted strands with static pedestals)

  Why: encodes layered cosmology with calm colours, zero animation, and
  comments explaining numerology-driven choices for offline review.
*/

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

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

/**
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

  const config = normaliseConfig(ctx, input);
  ctx.save();
  clearStage(ctx, config.dims, config.palette, config.numbers);

  const vesicaStats = drawVesicaField(ctx, config.dims, config.palette, config.numbers);
  const treeStats = drawTreeOfLife(ctx, config.dims, config.palette, config.numbers);
  const fibonacciStats = drawFibonacciCurve(ctx, config.dims, config.palette, config.numbers);
  const helixStats = drawHelixLattice(ctx, config.dims, config.palette, config.numbers);

  if (config.notice) {
    // Inline notice reassures offline viewers that a safe fallback palette is active.
    drawCanvasNotice(ctx, config.dims, config.palette.ink, config.notice);
  }

  ctx.restore();

  return {
    summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats })
  };
}

function normaliseConfig(ctx, input) {
  const width = typeof input.width === "number" ? input.width : ctx.canvas.width;
  const height = typeof input.height === "number" ? input.height : ctx.canvas.height;
  const dims = { width, height };
  const palette = mergePalette(input.palette || {});
  const numbers = mergeNumbers(input.NUM || {});
  const notice = typeof input.notice === "string" ? input.notice : null;
  return { dims, palette, numbers, notice };
}

function mergePalette(candidate) {
  const layers = Array.isArray(candidate.layers) && candidate.layers.length > 0
    ? candidate.layers.slice(0, DEFAULT_PALETTE.layers.length)
    : DEFAULT_PALETTE.layers.slice();
  while (layers.length < DEFAULT_PALETTE.layers.length) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }
  return {
    bg: typeof candidate.bg === "string" ? candidate.bg : DEFAULT_PALETTE.bg,
    ink: typeof candidate.ink === "string" ? candidate.ink : DEFAULT_PALETTE.ink,
    layers
  };
}

/**
 * Merge user-provided numeric overrides into the default numeric constants.
 *
 * Returns a shallow copy of DEFAULT_NUMBERS where any key present in the
 * input `candidate` that is a finite number replaces the corresponding default.
 *
 * @param {Object} candidate - Object whose numeric properties override defaults.
 * @return {Object} A new numbers object combining DEFAULT_NUMBERS with valid overrides.
 */
function mergeNumbers(candidate) {
  const merged = { ...DEFAULT_NUMBERS };
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    if (typeof candidate[key] === "number" && Number.isFinite(candidate[key])) {
      merged[key] = candidate[key];
    }
  }
  return merged;
}

/**
 * Clear the canvas to the configured background and apply the layered background glow.
 *
 * Clears the entire drawing surface with palette.bg then delegates to applyBackgroundGlow
 * to paint the central radial halo and floor wash based on dims and numbers.
 * @param {CanvasRenderingContext2D} ctx - 2D canvas context to draw into.
 * @param {{width: number, height: number, cx?: number, cy?: number}} dims - Rendering dimensions and optional center coordinates.
 * @param {{bg: string, ink?: string, layers?: string[]}} palette - Palette object; bg is used as the fill color.
 * @param {Object} numbers - Numeric configuration (spacing/scales) used by the glow routine.
 */
function clearStage(ctx, dims, palette, numbers) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
  applyBackgroundGlow(ctx, dims, palette, numbers);
}

/**
 * Draws layered background glow: a central radial halo and a floor wash to add depth.
 *
 * Paints a radial halo near the top-center and a vertical floor gradient using colors
 * from the provided palette and sizing from the numeric constants. This mutates the
 * supplied 2D canvas context by filling the full canvas area.
 *
 * @param {Object} dims - Rendering dimensions; must include `width` and `height`.
 * @param {Object} palette - Color palette containing `bg`, `ink`, and a `layers` array used for gradients.
 * @param {Object} numbers - Numeric constants (e.g. THREE, NINE, SEVEN) that control radii and positions.
 */
function applyBackgroundGlow(ctx, dims, palette, numbers) {
  // Layered glow: central halo and floor wash keep depth without motion.
  const centreX = dims.width / 2;
  const crownY = dims.height / numbers.NINE;
  const outerRadius = Math.max(dims.width, dims.height) / (numbers.THREE * 0.9);
  const glow = ctx.createRadialGradient(centreX, crownY * 1.4, outerRadius / numbers.SEVEN, centreX, dims.height / 2, outerRadius);
  glow.addColorStop(0, withAlpha(palette.ink, 0.22));
  glow.addColorStop(0.45, withAlpha(palette.layers[3], 0.16));
  glow.addColorStop(1, withAlpha(palette.bg, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, dims.width, dims.height);

  const floorGradient = ctx.createLinearGradient(0, dims.height * 0.68, 0, dims.height);
  floorGradient.addColorStop(0, withAlpha(palette.layers[5], 0.02));
  floorGradient.addColorStop(0.4, withAlpha(palette.layers[2], 0.09));
  floorGradient.addColorStop(1, withAlpha(palette.bg, 0.85));
  ctx.fillStyle = floorGradient;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

/**
 * Render the Vesica field layer: a grid of paired vesica circles, a central halo, and a vertical axis.
 *
 * Renders positioned vesica pairs for each grid cell, a concentric halo near the canvas center,
 * and a dashed central axis. Returns lightweight statistics used by the caller to summarize the
 * rendered layer.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D canvas drawing context to render into.
 * @param {{width: number, height: number}} dims - Canvas dimensions and derived layout bounds.
 * @param {{layers: string[]}} palette - Color palette object; uses palette.layers indices for strokes.
 * @param {{ONEFORTYFOUR: number, TWENTYTWO: number}} numbers - Numeric constants used for sizing and dashing.
 * @return {{circles: number, radius: number}} Statistics: total circle count (pairs + halo) and the grid radius.
 */
function drawVesicaField(ctx, dims, palette, numbers) {
  const grid = buildVesicaGrid(dims, numbers);

  ctx.save();
  ctx.globalAlpha = 0.66; // ND-safe softness keeps layer readable without glare.
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = Math.max(1.1, dims.width / (numbers.ONEFORTYFOUR * 1.6));
  for (const cell of grid.cells) {
    drawVesicaPair(ctx, cell);
  }

  ctx.globalAlpha = 0.82;
  ctx.strokeStyle = palette.layers[5];
  ctx.lineWidth = Math.max(1.2, dims.width / numbers.ONEFORTYFOUR);
  drawVesicaHalo(ctx, dims, numbers);

  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = palette.layers[2];
  ctx.setLineDash([numbers.TWENTYTWO, numbers.TWENTYTWO]);
  drawVesicaAxis(ctx, dims, numbers);
  ctx.setLineDash([]);

  ctx.restore();
  return { circles: grid.cells.length * 2 + 2, radius: grid.radius };
}

/**
 * Build a rectangular grid of vesica cell descriptors for the canvas.
 *
 * Produces a rows x cols grid (rows and cols taken from `numbers`) of cell objects
 * positioned inside a uniform margin derived from `dims.width`. Each cell contains
 * the computed center coordinates and sizing used by vesica pair rendering.
 *
 * @param {Object} dims - Rendering dimensions; expects numeric `width` and `height`.
 * @param {Object} numbers - Numeric constants used for layout (expects `SEVEN`, `THREE`, `THIRTYTHREE`, `NINE`, `TWENTYTWO`, `ELEVEN`).
 * @return {{cells: Array<{cx:number, cy:number, radius:number, offset:number}>, radius: number}}
 *   An object with:
 *   - cells: Array of cell descriptors ({cx, cy, radius, offset}) for each grid position.
 *   - radius: the computed base radius applied to every cell.
 */
function buildVesicaGrid(dims, numbers) {
  const rows = numbers.SEVEN;
  const cols = numbers.THREE;
  const margin = dims.width / numbers.THIRTYTHREE;
  const innerWidth = dims.width - margin * 2;
  const innerHeight = dims.height - margin * 2;
  const horizontalStep = cols > 1 ? innerWidth / (cols - 1) : 0;
  const verticalStep = rows > 1 ? innerHeight / (rows - 1) : 0;
  const radius = Math.min(horizontalStep, verticalStep) * (numbers.NINE / numbers.TWENTYTWO);
  const offset = radius * (numbers.ELEVEN / numbers.TWENTYTWO);

  const cells = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = margin + col * horizontalStep;
      const cy = margin + row * verticalStep;
      cells.push({ cx, cy, radius, offset });
    }
  }
  return { cells, radius };
}

/**
 * Draws a pair of stroked circles (a vesica pair) centered horizontally around a cell.
 *
 * The function issues two stroked arcs on the provided 2D canvas context: one centered at
 * (cell.cx - cell.offset, cell.cy) and the other at (cell.cx + cell.offset, cell.cy),
 * both using cell.radius.
 *
 * @param {Object} cell - Geometry describing the vesica pair.
 * @param {number} cell.cx - X coordinate of the cell center.
 * @param {number} cell.cy - Y coordinate of the cell center.
 * @param {number} cell.radius - Radius of each circle.
 * @param {number} cell.offset - Horizontal offset from the center to each circle.
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
 * Draws a two-ring vesica halo: an outer and a scaled inner circle centered above the canvas midpoint.
 *
 * The outer radius is computed from the smaller canvas dimension divided by (THREE * 0.82).
 * The inner radius is a scaled proportion of the outer radius using the numeric ratio SEVEN / ELEVEN.
 * Uses the current canvas stroke style and line width; does not modify canvas state stack.
 *
 * @param {{width:number,height:number}} dims - Canvas dimensions; used to compute the halo center and radii.
 * @param {{THREE:number,SEVEN:number,ELEVEN:number}} numbers - Numeric constants referenced to compute radii.
 */
function drawVesicaHalo(ctx, dims, numbers) {
  const centreX = dims.width / 2;
  const centreY = dims.height / 2.2;
  const outerRadius = Math.min(dims.width, dims.height) / (numbers.THREE * 0.82);
  const innerRadius = outerRadius * (numbers.SEVEN / numbers.ELEVEN);

  ctx.beginPath();
  ctx.arc(centreX, centreY, outerRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centreX, centreY, innerRadius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Draws the central vertical axis and an elliptical base for the vesica field.
 *
 * The vertical axis runs from a top offset (1/NINE of the canvas height) down to 90% of the canvas height.
 * An elliptical "base" is drawn near the lower area to anchor the composition.
 *
 * @param {Object} dims - Rendering dimensions; expected to include `width` and `height` (pixels).
 * @param {Object} numbers - Numeric constants used for layout; must provide `NINE`, `THREE`, and `TWENTYTWO`.
 */
function drawVesicaAxis(ctx, dims, numbers) {
  const centreX = dims.width / 2;
  const startY = dims.height / numbers.NINE;
  const endY = dims.height * 0.9;
  ctx.beginPath();
  ctx.moveTo(centreX, startY);
  ctx.lineTo(centreX, endY);
  ctx.stroke();

  const baseRadiusX = dims.width / numbers.THREE;
  const baseRadiusY = dims.height / numbers.TWENTYTWO;
  ctx.beginPath();
  ctx.ellipse(centreX, dims.height * 0.87, baseRadiusX, baseRadiusY, 0, 0, Math.PI * 2);
  ctx.stroke();
}

/**
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
function drawTreeOfLife(ctx, dims, palette, numbers) {
  const nodes = buildTreeNodes(dims, numbers);
  const paths = buildTreePaths();
  const nodeRadius = Math.max(6, dims.width / numbers.NINETYNINE);

  ctx.save();
  drawTreeVault(ctx, dims, palette, numbers, nodes);
  drawTreeColumn(ctx, dims, palette, numbers, nodes);

  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = palette.layers[1];
  ctx.lineWidth = Math.max(1.4, dims.width / (numbers.ONEFORTYFOUR * 2));
  ctx.lineJoin = "round";
  for (const [fromKey, toKey] of paths) {
    const from = nodes[fromKey];
    const to = nodes[toKey];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.globalAlpha = 0.96;
  ctx.lineWidth = 1;
  for (const key of Object.keys(nodes)) {
    const node = nodes[key];
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawTreeStar(ctx, dims, palette, numbers, nodes.kether);
  ctx.restore();
  return { nodes: Object.keys(nodes).length, paths: paths.length };
}

/**
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
    kether: { x: centerX, y: level(levels.kether) },
    chokmah: { x: rightPillarX, y: level(levels.chokmahBinah) },
    binah: { x: leftPillarX, y: level(levels.chokmahBinah) },
    daath: { x: centerX, y: level(levels.daath) },
    chesed: { x: rightPillarX, y: level(levels.chesedGeburah) },
    geburah: { x: leftPillarX, y: level(levels.chesedGeburah) },
    tiphareth: { x: centerX, y: level(levels.tiphareth) },
    netzach: { x: rightPillarX, y: level(levels.netzachHod) },
    hod: { x: leftPillarX, y: level(levels.netzachHod) },
    yesod: { x: centerX, y: level(levels.yesod) },
    malkuth: { x: centerX, y: level(levels.malkuth) }
  };
}

/**
 * Returns the canonical Tree-of-Life connectivity as an array of node-pair paths.
 *
 * Each element is a 2-element array [from, to] of sephirot names describing a connection.
 * The list encodes the standard pathways between kether, chokmah, binah, chesed, geburah,
 * tiphareth, netzach, hod, yesod, malkuth and includes daath-related links where present.
 *
 * @return {string[][]} Array of 2-string arrays representing edges between named nodes.
 */
function buildTreePaths() {
  return [
    ["kether", "chokmah"],
    ["kether", "binah"],
    ["chokmah", "binah"],
    ["chokmah", "chesed"],
    ["binah", "geburah"],
    ["chesed", "geburah"],
    ["chesed", "tiphareth"],
    ["geburah", "tiphareth"],
    ["tiphareth", "netzach"],
    ["tiphareth", "hod"],
    ["netzach", "hod"],
    ["netzach", "yesod"],
    ["hod", "yesod"],
    ["yesod", "malkuth"],
    ["kether", "daath"],
    ["daath", "tiphareth"],
    ["daath", "chesed"],
    ["daath", "geburah"],
    ["chesed", "netzach"],
    ["geburah", "hod"],
    ["netzach", "malkuth"],
    ["hod", "malkuth"]
  ];
}

/**
 * Draws an architectural vaulted arch and inner arc behind the Tree of Life.
 *
 * Renders a two-tiered vault (outer arch with base pillars and a smaller inner arch)
 * centered horizontally and positioned relative to the canvas height and the
 * `kether` node's y coordinate. The function temporarily adjusts canvas state,
 * stroke style, line width, and global alpha, then restores the context.
 *
 * @param {Object} dims - Rendering dimensions; must include numeric `width` and `height`.
 * @param {Object} nodes - Tree node coordinates; expects `nodes.kether.y` to position the arch vertically.
 */
function drawTreeVault(ctx, dims, palette, numbers, nodes) {
  ctx.save();
  ctx.globalAlpha = 0.42;
  ctx.strokeStyle = withAlpha(palette.layers[0], 0.7);
  ctx.lineWidth = Math.max(1, dims.width / (numbers.ONEFORTYFOUR * 1.2));

  const baseY = dims.height * 0.88;
  const innerBase = dims.height * 0.82;
  const leftX = dims.width * 0.18;
  const rightX = dims.width * 0.82;
  const archRadius = (rightX - leftX) / 2;
  const archCenterY = nodes.kether.y + archRadius * 0.65;

  ctx.beginPath();
  ctx.moveTo(leftX, baseY);
  ctx.lineTo(leftX, archCenterY);
  ctx.arc(dims.width / 2, archCenterY, archRadius, Math.PI, 0, false);
  ctx.lineTo(rightX, baseY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(leftX + archRadius / numbers.SEVEN, innerBase);
  ctx.lineTo(leftX + archRadius / numbers.SEVEN, archCenterY + archRadius / numbers.ELEVEN);
  ctx.arc(dims.width / 2, archCenterY + archRadius / numbers.ELEVEN, archRadius * 0.78, Math.PI, 0, false);
  ctx.lineTo(rightX - archRadius / numbers.SEVEN, innerBase);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws a vertical decorative column between the Tree-of-Life top (Kether) and bottom (Malkuth).
 *
 * Renders a filled column using a vertical gradient derived from the palette and paints a central stroked seam from `nodes.kether` down to `nodes.malkuth`.
 *
 * @param {Object} nodes - Coordinates used to position the column.
 * @param {{x: number, y: number}} nodes.kether - Top coordinate (Kether).
 * @param {{x: number, y: number}} nodes.malkuth - Bottom coordinate (Malkuth).
 */
function drawTreeColumn(ctx, dims, palette, numbers, nodes) {
  ctx.save();
  const columnWidth = Math.max(dims.width / numbers.NINETYNINE, 6);
  const gradient = ctx.createLinearGradient(nodes.kether.x, nodes.kether.y, nodes.malkuth.x, nodes.malkuth.y);
  gradient.addColorStop(0, withAlpha(palette.layers[3], 0.36));
  gradient.addColorStop(0.5, withAlpha(palette.layers[2], 0.18));
  gradient.addColorStop(1, withAlpha(palette.layers[1], 0.05));
  ctx.fillStyle = gradient;
  ctx.fillRect(nodes.kether.x - columnWidth / 2, nodes.kether.y, columnWidth, nodes.malkuth.y - nodes.kether.y);

  ctx.strokeStyle = withAlpha(palette.ink, 0.5);
  ctx.lineWidth = Math.max(1, columnWidth / numbers.THREE);
  ctx.beginPath();
  ctx.moveTo(nodes.kether.x, nodes.kether.y);
  ctx.lineTo(nodes.malkuth.x, nodes.malkuth.y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws a decorative star motif centered on the provided `kether` coordinates and a vertical emphasis line.
 *
 * If `kether` is falsy the function returns without drawing.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D canvas context to draw on.
 * @param {Object} dims - Canvas dimensions (expects a numeric `width`) used to scale the star.
 * @param {Object} palette - Color palette (expects `layers` array and `ink`) used for fill and stroke colors.
 * @param {Object} numbers - Numeric constants used for sizing (expects `ONEFORTYFOUR`, `THREE`, `NINE`).
 * @param {{x:number,y:number}} kether - Position where the star is centered.
 */
function drawTreeStar(ctx, dims, palette, numbers, kether) {
  if (!kether) {
    return;
  }
  ctx.save();
  const outer = Math.max(dims.width / numbers.ONEFORTYFOUR * numbers.THREE, 14);
  const inner = outer / numbers.THREE;
  const rays = numbers.NINE;
  ctx.beginPath();
  for (let i = 0; i < rays; i += 1) {
    const angle = (Math.PI * 2 * i) / rays - Math.PI / 2;
    const radius = i % 2 === 0 ? outer : inner;
    const x = kether.x + Math.cos(angle) * radius;
    const y = kether.y + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = withAlpha(palette.layers[3], 0.32);
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = withAlpha(palette.layers[4], 0.7);
  ctx.beginPath();
  ctx.moveTo(kether.x, kether.y - outer * 1.5);
  ctx.lineTo(kether.x, kether.y + outer * numbers.THREE);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws a smooth Fibonacci-based spiral on the provided 2D canvas context and renders periodic markers along it.
 *
 * The function generates a Fibonacci sequence, maps it to 2D spiral coordinates, renders a smoothed path
 * through those points using quadratic segments, and then draws small markers along the spiral. Stroke
 * thickness and opacity are scaled relative to the canvas dimensions and numeric constants.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D drawing context (canvas rendering surface).
 * @param {Object} dims - Rendering dimensions and derived layout values (expects at least width/height).
 * @param {Object} palette - Palette object providing layer colors; the spiral uses palette.layers[3].
 * @param {Object} numbers - Numeric constants used for sizing and limits (e.g., ONEFORTYFOUR, NINETYNINE).
 * @returns {{points: number}} An object containing the number of spiral points rendered (property `points`).
 */
function drawFibonacciCurve(ctx, dims, palette, numbers) {
  const sequence = buildFibonacciSequence(numbers.ONEFORTYFOUR);
  const points = buildSpiralPoints(sequence, dims, numbers);

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.strokeStyle = palette.layers[3];
  ctx.lineWidth = Math.max(1.4, dims.width / numbers.NINETYNINE);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const current = points[i];
    const midX = (prev.x + current.x) / 2;
    const midY = (prev.y + current.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
  }
  ctx.stroke();

  drawSpiralMarkers(ctx, points, palette, numbers);
  ctx.restore();

  return { points: points.length };
}

/**
 * Build a Fibonacci sequence starting with [1, 1], including values up to and including the largest value that does not exceed `limit`.
 * @param {number} limit - Maximum allowed value in the sequence (inclusive). Should be a finite number.
 * @returns {number[]} Fibonacci sequence beginning with [1, 1] where each element is <= `limit`.
 * If `limit` is less than 1 the function still returns the initial [1, 1].
 */
function buildFibonacciSequence(limit) {
  const seq = [1, 1];
  while (true) {
    const next = seq[seq.length - 1] + seq[seq.length - 2];
    if (next > limit) {
      break;
    }
    seq.push(next);
  }
  return seq;
}

/**
 * Convert a numeric sequence into 2D spiral coordinates centered on the canvas.
 *
 * Maps each value in `sequence` to a point by using a radius proportional to the square root
 * of the value and an angular progression based on a golden-angle-like step. The spiral is
 * centered horizontally at canvas midpoint and vertically at one-third from the top.
 *
 * @param {number[]} sequence - Ordered numeric sequence (e.g., Fibonacci numbers); should be non-empty and increasing so scale computation is meaningful.
 * @param {{width: number, height: number}} dims - Canvas dimensions; used to compute center and scaling.
 * @param {Object} numbers - Numeric constants object (expects properties like THREE, SEVEN, NINE, ELEVEN, TWENTYTWO) used to control scaling and angular increments.
 * @return {{x: number, y: number}[]} Array of 2D points for the spiral; the first element is the computed spiral center followed by points for each sequence value.
 */
function buildSpiralPoints(sequence, dims, numbers) {
  const centerX = dims.width / 2;
  const centerY = dims.height / numbers.THREE;
  const maxValue = sequence[sequence.length - 1];
  const scale = Math.min(dims.width, dims.height) / (Math.sqrt(maxValue) * numbers.TWENTYTWO / numbers.ELEVEN);
  const goldenAngle = Math.PI * 2 * (numbers.SEVEN / numbers.TWENTYTWO);
  const rotation = Math.PI / numbers.NINE;

  const points = sequence.map((value, index) => {
    const angle = rotation + goldenAngle * index;
    const radius = Math.sqrt(value) * scale;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  return [{ x: centerX, y: centerY }, ...points];
}

/**
 * Draws small filled markers at regular intervals along a list of spiral points.
 *
 * The function samples the provided points array using a step of
 * `max(1, floor(points.length / numbers.TWENTYTWO))`, draws filled circles
 * at those sampled coordinates using `palette.ink`, and sizes each marker
 * with a canvas-width–relative radius of `max(2, ctx.canvas.width / numbers.ONEFORTYFOUR / 1.8)`.
 *
 * @param {Array<{x: number, y: number}>} points - Ordered 2D points defining the spiral; markers are placed at sampled indices.
 */
function drawSpiralMarkers(ctx, points, palette, numbers) {
  ctx.save();
  ctx.fillStyle = palette.ink;
  const step = Math.max(1, Math.floor(points.length / numbers.TWENTYTWO));
  const dotRadius = Math.max(2, ctx.canvas.width / numbers.ONEFORTYFOUR / 1.8);
  for (let i = 0; i < points.length; i += step) {
    const point = points[i];
    ctx.beginPath();
    ctx.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Render the double-helix lattice (two sinusoidal rails, connecting rungs, and endpoint anchors).
 *
 * Draws both helix rails with distinct layer colors, strokes the rung connections using the ink color,
 * renders a subtle guide and decorative anchors, and returns simple statistics about the lattice.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D drawing context to render into.
 * @param {{width:number,height:number}} dims - Canvas dimensions used to scale line widths and geometry.
 * @param {{ink:string,layers:string[]}} palette - Color palette; expects `layers[4]` and `layers[5]` for the two rails and `ink` for rungs.
 * @param {Object} numbers - Numeric constants used for layout and stroke scaling (e.g., ONEFORTYFOUR).
 * @return {{rungs:number}} Object with the number of rung segments drawn.
 */
function drawHelixLattice(ctx, dims, palette, numbers) {
  const rails = buildHelixRails(dims, numbers);

  ctx.save();
  drawHelixGuide(ctx, dims, palette, numbers);

  ctx.strokeStyle = palette.layers[4];
  ctx.lineWidth = Math.max(1.4, dims.width / numbers.ONEFORTYFOUR);
  ctx.lineJoin = "round";
  ctx.beginPath();
  rails.a.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.strokeStyle = palette.layers[5];
  ctx.beginPath();
  rails.b.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, dims.width / numbers.ONEFORTYFOUR);
  rails.rungs.forEach(rung => {
    ctx.beginPath();
    ctx.moveTo(rung.a.x, rung.a.y);
    ctx.lineTo(rung.b.x, rung.b.y);
    ctx.stroke();
  });

  drawHelixAnchors(ctx, rails, palette, numbers);
  ctx.restore();
  return { rungs: rails.rungs.length };
}

/**
 * Build two sinusoidal helix rails across the horizontal span and a list of evenly spaced rungs connecting them.
 *
 * @param {Object} dims - Rendering dimensions; must include numeric `width` and `height`.
 * @param {Object} numbers - Numeric constants used for layout; this function reads `TWENTYTWO`, `SEVEN`, `THREE`, and `ELEVEN`.
 * @return {{a: Array<{x:number,y:number}>, b: Array<{x:number,y:number}>, rungs: Array<{a:{x:number,y:number}, b:{x:number,y:number}}>} }
 * An object containing:
 * - `a`: points for rail A (array of {x,y}).
 * - `b`: points for rail B (array of {x,y}, phase-shifted from A).
 * - `rungs`: array of connections (every second index) each with `{a, b}` referencing the corresponding rail points.
 */
function buildHelixRails(dims, numbers) {
  const length = numbers.TWENTYTWO;
  const startX = dims.width * 0.18;
  const endX = dims.width * 0.82;
  const amplitude = dims.height / numbers.SEVEN;
  const centreY = dims.height * 0.72;
  const phaseShift = Math.PI / numbers.THREE;
  const step = (endX - startX) / (length - 1);

  const a = [];
  const b = [];
  const rungs = [];
  for (let i = 0; i < length; i += 1) {
    const x = startX + step * i;
    const angle = (Math.PI * 2 * i) / numbers.ELEVEN;
    const yA = centreY + Math.sin(angle) * amplitude;
    const yB = centreY + Math.sin(angle + phaseShift) * amplitude;
    const pointA = { x, y: yA };
    const pointB = { x, y: yB };
    a.push(pointA);
    b.push(pointB);
    if (i % 2 === 0) {
      rungs.push({ a: pointA, b: pointB });
    }
  }
  return { a, b, rungs };
}

/**
 * Draws a subtle guide ellipse and an inner "walkway" band near the bottom-center to suggest the helix region.
 *
 * Renders a faint filled ellipse with an outline and a narrow rectangular walkway inside it. Uses
 * colors from palette.layers and sizing from numbers to compute the ellipse radii, stroke widths,
 * and walkway dimensions. Saves and restores the canvas state so calling code's context transforms
 * and styles are preserved.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D canvas context to draw into.
 * @param {{width:number,height:number}} dims - Rendering dimensions; used to position and scale the guide.
 * @param {object} palette - Palette object; expects a layers array where specific indices provide fill/ink colors.
 * @param {object} numbers - Numeric constants (e.g. THREE, TWENTYTWO, ELEVEN, ONEFORTYFOUR) used for layout math.
 */
function drawHelixGuide(ctx, dims, palette, numbers) {
  ctx.save();
  const centreX = dims.width / 2;
  const baseY = dims.height * 0.86;
  const radiusX = dims.width / numbers.THREE;
  const radiusY = dims.height / numbers.TWENTYTWO;

  ctx.fillStyle = withAlpha(palette.layers[1], 0.08);
  ctx.beginPath();
  ctx.ellipse(centreX, baseY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = withAlpha(palette.layers[0], 0.5);
  ctx.lineWidth = Math.max(1, dims.width / numbers.ONEFORTYFOUR);
  ctx.beginPath();
  ctx.ellipse(centreX, baseY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();

  const walkwayWidth = radiusX * (numbers.TWENTYTWO / numbers.ELEVEN);
  const walkwayHeight = dims.height / numbers.TWENTYTWO;
  ctx.fillStyle = withAlpha(palette.layers[4], 0.08);
  ctx.fillRect(centreX - walkwayWidth / 2, baseY - walkwayHeight, walkwayWidth, walkwayHeight);
  ctx.strokeStyle = withAlpha(palette.layers[0], 0.35);
  ctx.lineWidth = Math.max(1, dims.width / numbers.ONEFORTYFOUR);
  ctx.strokeRect(centreX - walkwayWidth / 2, baseY - walkwayHeight, walkwayWidth, walkwayHeight);
  ctx.restore();
}

/**
 * Draws decorative diamond anchors at the start and end points of the two helix rails.
 *
 * Uses the first and last points of rails.a and rails.b (if present) to render small
 * filled-and-stroked diamond markers. Marker size scales with canvas width and
 * falls back to a minimum radius. Stroke uses `palette.ink` at 70% alpha; fill uses
 * the helix layer color (palette.layers[3]) at 18% alpha.
 *
 * @param {{a: Array<{x:number,y:number}>, b: Array<{x:number,y:number}>}} rails - Rail point arrays; anchors are taken from the first and last elements of each array.
 * @param {{ink:string, layers:string[]}} palette - Colour palette; expects an `ink` string and a `layers` array containing the helix layer at index 3.
 * @param {{ONEFORTYFOUR:number}} numbers - Numeric constants object; used to compute a responsive marker radius.
 */
function drawHelixAnchors(ctx, rails, palette, numbers) {
  ctx.save();
  const anchors = [rails.a[0], rails.a[rails.a.length - 1], rails.b[0], rails.b[rails.b.length - 1]];
  const radius = Math.max(4, ctx.canvas.width / numbers.ONEFORTYFOUR);
  ctx.strokeStyle = withAlpha(palette.ink, 0.7);
  ctx.fillStyle = withAlpha(palette.layers[3], 0.18);
  anchors.forEach(point => {
    if (!point) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(point.x, point.y - radius);
    ctx.lineTo(point.x + radius, point.y);
    ctx.lineTo(point.x, point.y + radius);
    ctx.lineTo(point.x - radius, point.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}

/**
 * Draws a centered notice line near the bottom of the canvas.
 *
 * Renders `message` horizontally centered and positioned just above the bottom edge using a responsive font size derived from `dims.width`. The function saves and restores the canvas context so it does not leave side effects on drawing state.
 *
 * @param {{width: number, height: number}} dims - Canvas dimensions used to compute position and font size.
 * @param {string} color - CSS color string for the text fill.
 * @param {string} message - The text to render.
 */
function drawCanvasNotice(ctx, dims, color, message) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${Math.max(14, dims.width / 72)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(message, dims.width / 2, dims.height - dims.height / 40);
  ctx.restore();
}

/**
 * Create a human-readable summary of rendered layer statistics.
 *
 * Builds a single-line summary describing counts returned by each layer renderer:
 * vesica circle count, tree paths/nodes, fibonacci spiral points, and helix rungs.
 *
 * @param {Object} stats - Aggregated layer statistics.
 * @param {Object} stats.vesicaStats - Vesica layer stats.
 * @param {number} stats.vesicaStats.circles - Number of vesica circles drawn.
 * @param {Object} stats.treeStats - Tree-of-life layer stats.
 * @param {number} stats.treeStats.paths - Number of tree paths drawn.
 * @param {number} stats.treeStats.nodes - Number of tree nodes drawn.
 * @param {Object} stats.fibonacciStats - Fibonacci/spiral layer stats.
 * @param {number} stats.fibonacciStats.points - Number of spiral points drawn.
 * @param {Object} stats.helixStats - Helix layer stats.
 * @param {number} stats.helixStats.rungs - Number of helix rungs drawn.
 * @return {string} A single-line summary suitable for logs or UI.
 */
function summariseLayers(stats) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const tree = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  const helix = `${stats.helixStats.rungs} helix rungs`;
  return `Layers rendered - ${vesica}; ${tree}; ${fibonacci}; ${helix}.`;
}

/**
 * Convert a 6-digit hex color to an `rgba(...)` string with the given alpha.
 *
 * Accepts a hex string with or without a leading `#`. If `hex` is not a valid
 * 6-character hex code the function returns `rgba(0,0,0,alpha)`.
 *
 * @param {string} hex - A 6-digit hex color (e.g. `"#ffddaa"` or `"ffddaa"`).
 * @param {number} alpha - Alpha transparency between 0 and 1.
 * @return {string} An `rgba(r,g,b,a)` CSS color string.
 */
function withAlpha(hex, alpha) {
  const normalized = typeof hex === "string" ? hex.replace(/^#/, "") : "";
  if (normalized.length !== 6) {
    return `rgba(0,0,0,${alpha})`;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
