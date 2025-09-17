/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circle lattice)
    2) Tree-of-Life scaffold (ten sephirot with twenty-two paths)
    3) Fibonacci curve (golden spiral polyline)
    4) Double-helix lattice (two still sine strands with cross ties)

  Rationale:
    - No animation or flashing; the scene renders a single time on load.
    - Muted palette and transparent strokes keep contrast gentle (trauma-informed).
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 guide spacing and counts.
*/

export function renderHelix(ctx, opts) {
  if (!ctx || !opts) {
    return { ok: false, reason: "missing-context" };
  }
  Layers draw once in a stable order to honour the no-motion requirement.
  Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) guide proportions.
*/

export function renderHelix(ctx, options) {
  if (!ctx || typeof ctx.moveTo !== "function") {
    return { ok: false, reason: "no-context" };
  }

  const config = options || {};
  const width = Number(config.width) || ctx.canvas.width;
  const height = Number(config.height) || ctx.canvas.height;
  const palette = config.palette || {};
  const NUM = config.NUM || {};
  const notice = typeof config.notice === "string" ? config.notice : "";

  const defaults = normalizeConstants();
  const { width, height } = opts;
  const N = normalizeConstants(opts.NUM);
  const palette = normalizePalette(opts.palette);
  const layers = Array.isArray(palette.layers) ? palette.layers : [];
  const fallbackLayers = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];
  const ink = palette.ink || "#e8e8f0";

  if (typeof width !== "number" || typeof height !== "number") {
    return { ok: false, reason: "invalid-dimensions" };
  }

  const pickLayer = (index) => layers[index] || fallbackLayers[index] || ink;
  const fallbackInk = palette.ink || "#e8e8f0";
  const layerColor = (index) => layers[index] || fallbackLayers[index] || fallbackInk;
  Layers (rendered back-to-front):
    1) Vesica field (intersecting circle lattice)
    2) Tree-of-Life scaffold (ten sephirot with twenty-two paths)
    3) Fibonacci curve (golden spiral polyline)
    4) Double-helix lattice (two calm strands with cross ties)

  Rationale:
    - No motion; every layer renders once to respect ND-safe pacing.
    - Soft contrast palette keeps geometry readable without harsh edges.
    - Numerology constants 3, 7, 9, 11, 22, 33, 99, 144 steer proportions.
*/

export function renderHelix(ctx, options = {}) {
  if (!ctx) {
    return { ok: false, reason: "missing-context" };
  }

  const width = options.width || ctx.canvas.width;
  const height = options.height || ctx.canvas.height;
  const palette = normalisePalette(options.palette);
  const N = normaliseNumerology(options.NUM);

  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesicaField(ctx, width, height, pickLayer(0), N);
  drawTreeOfLife(ctx, width, height, pickLayer(1), pickLayer(2), N);
  drawFibonacci(ctx, width, height, pickLayer(3), N);
  drawHelix(ctx, width, height, pickLayer(4), pickLayer(5), N);
  Layers (rendered back to front):
    1) Vesica field - intersecting circle lenses keep the womb-of-forms visible.
    2) Tree-of-Life scaffold - ten sephirot joined by twenty-two calm paths.
    3) Fibonacci curve - logarithmic spiral polyline tuned to gentle growth.
    4) Double-helix lattice - two static strands with soft cross ties.

  ND-safe rationale:
    - No motion or flashing; everything draws once per load.
    - Muted palette keeps contrast gentle for neurodivergent viewers.
    - Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) steer proportions.
*/

const FALLBACK_LAYERS = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];

export function renderHelix(ctx, opts) {
  if (!ctx) {
    return { ok: false, reason: "missing-context" };
  }

  const { width, height, palette, NUM: N, notice } = opts;
  const cleaned = normalisePalette(palette);

  ctx.save();
  ctx.fillStyle = cleaned.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Layer order from background to foreground keeps depth legible without motion.
  drawVesicaField(ctx, width, height, cleaned.layers[0], N);
  drawTreeOfLife(ctx, width, height, cleaned.layers[1], cleaned.layers[2], N);
  drawFibonacci(ctx, width, height, cleaned.layers[3], N);
  drawHelix(ctx, width, height, cleaned.layers[4], cleaned.layers[5], N);

  if (opts.notice) {
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.75;
    ctx.fillText(opts.notice, 24, height - 24);
    ctx.restore();
  }

  return { ok: true, constants: N, defaults };
}

function drawVesicaField(ctx, w, h, color, N) {
  Layers render once in calm order to honour trauma-informed design.
*/

const FALLBACK_LAYERS = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];

export function renderHelix(ctx, options) {
  if (!ctx) {
    return { ok: false, reason: "missing-context" };
  }

  const width = options.width;
  const height = options.height;
  const palette = ensurePalette(options.palette);
  const N = options.NUM;
  const notice = options.notice;

  ctx.save();
  clearCanvas(ctx, width, height, palette.background);

  // Layer order moves from foundation to foreground without motion.
  drawVesicaField(ctx, width, height, palette.layer(0), N);
  drawTreeOfLife(ctx, width, height, palette.layer(1), palette.layer(2), N);
  drawFibonacciSpiral(ctx, width, height, palette.layer(3), N);
  drawDoubleHelix(ctx, width, height, palette.layer(4), palette.layer(5), N);

  if (notice) {
    drawNotice(ctx, width, height, notice, palette.ink);
  }

  drawVesicaField(ctx, width, height, layerColor(0), NUM);
  drawTreeOfLife(ctx, width, height, layerColor(1), layerColor(2), NUM);
  drawFibonacci(ctx, width, height, layerColor(3), NUM);
  drawHelix(ctx, width, height, layerColor(4), layerColor(5), NUM);
  drawNotice(ctx, width, height, notice, fallbackInk);
  Static, ND-safe renderer for layered sacred geometry bound to Codex 144:99 (c99).
  Everything renders once on load; no motion, no autoplay, no external state.

  Layer order (background to foreground):
    1) Vesica field — intersecting circles with numerology spacing for calm depth.
    2) Tree-of-Life scaffold — ten sephirot linked by twenty-two paths.
    3) Fibonacci curve — golden spiral polyline sampled across 144 points.
    4) Double-helix lattice — two static strands with gentle cross ties.
*/

export function renderHelix(ctx, options) {
  if (!ctx) return { ok: false, reason: "missing-context" };

  const { width, height, palette, NUM, notice } = options;
  const safePalette = normalisePalette(palette);

  ctx.save();
  fillBackground(ctx, width, height, safePalette.bg);

  // Layered order preserves depth without animation; comments explain why for future caretakers.
  drawVesicaField(ctx, width, height, safePalette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, safePalette.layers[1], safePalette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, safePalette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, safePalette.layers[4], safePalette.layers[5], NUM);

  if (notice) drawNotice(ctx, width, height, safePalette.ink, notice);
  // Layer order from base to foreground keeps depth legible without animation.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, N);

  if (options.notice) {
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = palette.ink;
    ctx.globalAlpha = 0.8;
    ctx.fillText(options.notice, 24, height - 24);
    ctx.restore();
  }

  ctx.restore();
  return { ok: true };
}

function normalisePalette(raw = {}) {
  const fallback = {
    bg: "#0b0b12",
    ink: "#e8e8f0",
    layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
  };

  const layers = Array.isArray(raw.layers) ? raw.layers : [];

  return {
    bg: raw.bg || fallback.bg,
    ink: raw.ink || fallback.ink,
    layers: fallback.layers.map((color, index) => layers[index] || color)
  };
}

function normaliseNumerology(raw = {}) {
  const defaults = {
    THREE: 3,
    SEVEN: 7,
    NINE: 9,
    ELEVEN: 11,
    TWENTYTWO: 22,
    THIRTYTHREE: 33,
    NINETYNINE: 99,
    ONEFORTYFOUR: 144
  };

  return {
    THREE: raw.THREE || defaults.THREE,
    SEVEN: raw.SEVEN || defaults.SEVEN,
    NINE: raw.NINE || defaults.NINE,
    ELEVEN: raw.ELEVEN || defaults.ELEVEN,
    TWENTYTWO: raw.TWENTYTWO || defaults.TWENTYTWO,
    THIRTYTHREE: raw.THIRTYTHREE || defaults.THIRTYTHREE,
    NINETYNINE: raw.NINETYNINE || defaults.NINETYNINE,
    ONEFORTYFOUR: raw.ONEFORTYFOUR || defaults.ONEFORTYFOUR
  };
}

function normalisePalette(palette) {
  const fallback = {
    bg: "#0b0b12",
    ink: "#e8e8f0",
    muted: "#a6a6c1",
    layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
  };

  const source = palette || {};
  const safeLayers = fallback.layers.map((color, index) => {
    if (source.layers && source.layers[index]) return source.layers[index];
    return color;
  });

  return {
    bg: source.bg || fallback.bg,
    ink: source.ink || fallback.ink,
    muted: source.muted || fallback.muted,
    layers: safeLayers
  };
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function ensurePalette(palette) {
  const base = palette || {};
  const layers = Array.isArray(base.layers) ? base.layers : [];
  return {
    background: base.bg || "#0b0b12",
    ink: base.ink || "#e8e8f0",
    layer(index) {
      return layers[index] || FALLBACK_LAYERS[index] || "#ffffff";
    }
  };
}

function clearCanvas(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Layer 1: Vesica field — overlapping circles evoke a womb of forms without motion.
// Layer 1: Vesica field — calm lattice built from overlapping circles.
function drawVesicaField(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;
=====
      ctx.fillStyle = cleaned.notice;
    ctx.textBaseline = "bottom";
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }

  return { ok: true };
}

function normalisePalette(palette) {
  const input = palette || {};
  const layers = Array.isArray(input.layers) ? input.layers : [];
  return {
    bg: input.bg || "#0b0b12",
    notice: input.ink || "#e8e8f0",
    layers: FALLBACK_LAYERS.map((fallbackColor, index) => layers[index] || fallbackColor)
  };
}

// Layer 1: Vesica field builds a calm lens grid using 3/7/9/11 counts.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // gentle transparency keeps the grid quiet.
>>>>>>>+upstream/codex/
 const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 2);
  const spacingY = h / (rows + 2);
<<  const radius = Math.min(spacingX, spacingY) * (N.SEVEN / N.TWENTYTWO);
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1.5);
    const rowShift = (row % 2 === 0) ? 0 : spacingX / N.ELEVEN;

    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1.5) + rowShift;
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      if (row < rows - 1 && col % 2 === 0) {
        const nextCy = spacingY * (row + 2.5);
        const midY = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, midY, radius * (N.SEVEN / N.NINE));
  ctx.lineCap = "round";

  const columns = N.ELEVEN; // Eleven pillars weave 3/7/11 numerology.
  const rows = N.NINE;
  const stepX = width / (columns + 1);
  const stepY = height / (rows + 1);
  const radius = Math.min(stepX, stepY) / 1.8;
  const horizontalOffset = radius / N.THREE;
  const verticalOffset = stepY / N.SEVEN;

  for (let row = 0; row < rows; row += 1) {
    const cy = stepY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = stepX * (col + 1);
      strokeCircle(ctx, cx - horizontalOffset, cy, radius);
      strokeCircle(ctx, cx + horizontalOffset, cy, radius);

      if (row < rows - 1) {
        const lensY = cy + verticalOffset;
        strokeCircle(ctx, cx, lensY, radius);
/* Layer 1 — Vesica field. Calm overlapping circles form a lens grid without motion. */
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // Soft opacity keeps the background from overpowering other layers.

  const rows = clampPositive(N.NINE, 9);
  const columns = clampPositive(N.ELEVEN, 11);
  const marginX = w / clampPositive(N.TWENTYTWO, 22);
  const marginY = h / clampPositive(N.THIRTYTHREE, 33);
  const usableW = w - marginX * 2;
  const usableH = h - marginY * 2;
  const spacingX = usableW / Math.max(columns - 1, 1);
  const spacingY = usableH / Math.max(rows - 1, 1);
  const baseRadius = Math.min(spacingX, spacingY) / (clampPositive(N.THREE, 3) / 1.5);
  const offset = baseRadius * (clampPositive(N.THREE, 3) / clampPositive(N.SEVEN, 7));

  for (let row = 0; row < rows; row += 1) {
    const cy = marginY + spacingY * row;
    for (let col = 0; col < columns; col += 1) {
      const cx = marginX + spacingX * col;
      strokeCircle(ctx, cx - offset, cy, baseRadius);
      strokeCircle(ctx, cx + offset, cy, baseRadius);

      if (row < rows - 1 && col % 2 === 0) {
        const nextCy = marginY + spacingY * (row + 1);
// Layer 1: Vesica field builds a calm lattice using numerology counts.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // ND-safe: softened grid to avoid visual overload.

  const columns = Math.max(3, N.ELEVEN);
  const rows = Math.max(3, N.NINE);
  const marginX = w / N.THIRTYTHREE;
  const marginY = h / N.THIRTYTHREE;
  const gridWidth = w - marginX * 2;
  const gridHeight = h - marginY * 2;
  const spacingX = gridWidth / (columns - 1);
  const spacingY = gridHeight / (rows - 1);
  const radius = Math.min(spacingX, spacingY) * (N.THIRTYTHREE / (N.NINETYNINE / 2));
  const offset = radius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = marginY + row * spacingY;
    for (let col = 0; col < columns; col += 1) {
      const cx = marginX + col * spacingX;
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      if (row < rows - 1) {
        const nextCy = marginY + (row + 1) * spacingY;
        const lensCy = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, lensCy, baseRadius);
>>>>>>>+main
===
  co  const baseRadius = Math.min(spacingX, spacingY) / (N.THREE / 2);
  const offset = baseRadius / N.THREE;

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1.5);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1.5);
      strokeCircle(ctx, cx - offset, cy, baseRadius);
      strokeCircle(ctx, cx + offset, cy, baseRadius);

      if ((row + col) % N.THREE === 0 && row < rows - 1) {
        const nextCy = spacingY * (row + 2.5);
        strokeCircle(ctx, cx, (cy + nextCy) / 2, baseRadius * (N.SEVEN / N.NINE));
>>>>>>>+upstream/codex/
  }
  ctx.globalAlpha = 0.35; // Soft transparency keeps the grid gentle for ND-safe viewing.

  const columns = N.ELEVEN; // 11 columns honour the sephirotic pillars.
  const rows = N.NINE; // 9 rows echo the spiral layer.
  const paddingX = width / N.THIRTYTHREE;
  const paddingY = height / N.TWENTYTWO;
  const spanX = width - paddingX * 2;
  const spanY = height - paddingY * 2;
  const spacingX = spanX / (columns - 1);
  const spacingY = spanY / (rows - 1);
  const radius = Math.min(spacingX, spacingY) / (1 + 1 / N.THREE);
  const offset = radius / N.THREE; // 3 divides the vesica lens.

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = paddingX + col * spacingX;
      const cy = paddingY + row * spacingY;
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      // Every third row adds a vertical lens to deepen the geometry without motion.
      if (row < rows - 1 && col % N.THREE === 0) {
        const nextCy = paddingY + (row + 1) * spacingY;
        const midCy = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, midCy, radius);
      }
    }
  }

  ctx.restore();
}

<<<<function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
// Layer 2: Tree-of-Life — ten sephirot with twenty-two gentle paths.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, N) {
/* Layer 2 — Tree-of-Life. Thin paths and calm nodes respect ND-safe contrast. */
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  const nodes = createTreeNodes(w, h);
  const paths = createTreePaths();
  const strokeWidth = clampPositive(N.TWENTYTWO, 22) / clampPositive(N.ELEVEN, 11);
  const nodeRadius = Math.min(w, h) / (clampPositive(N.THIRTYTHREE, 33) * 2);

  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1, N.TWENTYTWO / N.ELEVEN); // 22 paths softened by pillar 11.
>>>>>>>+main
// Layer// Layer 2: Tree-of-Life nodes and paths; gentle strokes avoid harsh edges.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // equals 2 for soft yet readable lines.
>>>>>>>+upstream/codex/
neCap = "round";
  ctx.globalAlpha = 0.85;

  const nodes = getTreeNodes(w, h, N);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
  ctx.lineJoin = "round";

  const nodes = getTreeNodes(width, height);
  const paths = getTreePaths();

  paths.forEach(pair => {
    const a = nodes[pair[0]];
    const b = nodes[pair[1]];
    if (!a || !b) return;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
// Layer 2: Tree-of-Life — slim paths and calm nodes keep focus without harsh edges.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
// Layer 2: Tree-of-Life scaffold — thin lines and soft nodes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 22 paths softened by pillar 11.
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const nodes = getTreeNodes(width, height);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    const start = nodes[a];
    const end = nodes[b];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
  paths.forEach(([from, to]) => {
    const a = nodes[from];
    const b = nodes[to];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 0.9;
  ctx.fillStyle = nodeColor;
<<<<<<<   const nodeRadius = (Math.min(w, h) / N.ONEFORTYFOUR) * (N.SEVEN / N.ELEVEN);

  nodes.forEach((node) => {
  ctx.strokeStyle = nodeColor;
  const nodeRadius = Math.min(width, height) / N.NINETYNINE;

  nodes.forEach(node => {
    strokeCircle(ctx, node.x, node.y, nodeRadius);
>>>>>>>+main
  const   const nodeRadius = N.NINE / 3;
  nodes.forEach((node) => {
>>>>>>>+upstream/codex/
beginPath();
    ctx.arc(node.x, node.y, nodeRadius * 0.6, 0, Math.PI * 2);
  ctx.globalAlpha = 0.95;
  const nodeRadius = Math.min(width, height) / (N.THIRTYTHREE + N.NINE); // 33+9 = 42 keeps discs modest.
  const nodeRadius = Math.max(3, Math.min(w, h) / N.NINETYNINE * (N.NINE / N.TWENTYTWO));

  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  ctx.lineWidth = strokeWidth;
  ctx.globalAlpha = 0.8;
  paths.forEach(([a, b]) => {
    const start = nodes[a];
    const end = nodes[b];
    if (!start || !end) return;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  nodes.forEach((node) => {
    strokeCircle(ctx, node.x, node.y, nodeRadius, true);
  });

  ctx.restore();
}

<<<<<<< codex/add-canonical-alias-validation-check
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.THREE / N.THIRTYTHREE;

  ctx.restore();
}

// Layer 3: Fibonacci spiral — golden curve drawn once for calm movement suggestion.
function drawFibonacciSpiral(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.THREE / 2; // Equals 1.5px, subtle yet visible.
  ctx.globalAlpha = 0.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = 0.85;

  const steps = N.ONEFORTYFOUR;
  const quarterTurns = N.SEVEN;
  const totalAngle = quarterTurns * (Math.PI / 2);
  const phi = (1 + Math.sqrt(5)) / 2;
  const radiusBase = Math.min(w, h) / (N.THREE + N.SEVEN / N.NINE);
  const centerX = w / 2;
  const centerY = h / 2;
>>>>>>>+main
 ctx.res
  ctx.restore();
}

function getTreeNodes(w, h) {
  const verticalOffset = h * 0.05;
  return [
    { x: w / 2, y: verticalOffset + h * 0.00 },
    { x: w * 0.28, y: verticalOffset + h * 0.12 },
    { x: w * 0.72, y: verticalOffset + h * 0.12 },
    { x: w * 0.28, y: verticalOffset + h * 0.32 },
    { x: w * 0.72, y: verticalOffset + h * 0.32 },
    { x: w / 2, y: verticalOffset + h * 0.44 },
    { x: w * 0.28, y: verticalOffset + h * 0.64 },
    { x: w * 0.72, y: verticalOffset + h * 0.64 },
    { x: w / 2, y: verticalOffset + h * 0.76 },
    { x: w / 2, y: verticalOffset + h * 0.92 }
function getTreeNodes(width, height) {
  // Ratios preserve the classic sephirotic arrangement while scaling to the canvas.
  const anchors = [
    { x: 0.5, y: 0.06 },  // Kether
    { x: 0.28, y: 0.16 }, // Chokmah
    { x: 0.72, y: 0.16 }, // Binah
    { x: 0.28, y: 0.36 }, // Chesed
    { x: 0.72, y: 0.36 }, // Geburah
    { x: 0.5, y: 0.48 },  // Tiphereth
    { x: 0.32, y: 0.66 }, // Netzach
    { x: 0.68, y: 0.66 }, // Hod
    { x: 0.5, y: 0.78 },  // Yesod
    { x: 0.5, y: 0.92 }   // Malkuth
function getTreeNodes(w, h) {
  // Layout stays faithful to the ten sephirot while keeping generous spacing.
  return [
    { x: w / 2, y: h * 0.05 },   // Kether
    { x: w * 0.3, y: h * 0.16 }, // Chokmah
    { x: w * 0.7, y: h * 0.16 }, // Binah
    { x: w * 0.3, y: h * 0.33 }, // Chesed
    { x: w * 0.7, y: h * 0.33 }, // Geburah
    { x: w / 2, y: h * 0.45 },   // Tiphereth
    { x: w * 0.3, y: h * 0.63 }, // Netzach
    { x: w * 0.7, y: h * 0.63 }, // Hod
    { x: w / 2, y: h * 0.78 },   // Yesod
    { x: w / 2, y: h * 0.92 }    // Malkuth
  ];

  return anchors.map(point => ({
    x: point.x * width,
    y: point.y * height
  }));
}

function getTreePaths() {
  // 22 paths: classic arrangement linking the ten nodes.
  return [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4],
    [3, 5], [4, 5], [3, 6],
    [4, 7], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8],
    [5, 8], [6, 9], [7, 9],
    [8, 9]
  ];
}

// Layer 3: Fibonacci curve - golden spiral polyline anchored at centre.
function drawFibonacci(ctx, w, h, color, N) {
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 3], [2, 4],
    [3, 4], [3, 5], [4, 5], [1, 5], [2, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ];
}

// Layer 3: Fibonacci curve — golden spiral drawn as a calm polyline.
function drawFibonacciCurve(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;

  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = N.ONEFORTYFOUR;
  const turns = N.SEVEN; // seven quarter-turns keeps the spiral gentle.
  const totalAngle = (Math.PI / 2) * turns;
  const baseRadius = Math.min(w, h) / N.THREE;
  const centerX = w * 0.44;
  const centerY = h * 0.58;
>>>>>>>+upstream/codex/
inPath();
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
<<<<<<< ma    const angle = totalAngle * t;
    const radius = radiusBase * Math.pow(phi, angle / (Math.PI / 2));
>>>>>>>+main
  const     const angle = t * totalAngle;
    const radius = (baseRadius / N.ELEVEN) * Math.pow(phi, angle / (Math.PI / 2));
>>>>>>>+upstream/codex/
x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
<<<<<<< ma/* Layer 3 — Fibonacci spiral approximated as a polyline to avoid flashing arcs. */
function drawFibonacci(ctx, w, h, color, N) {
  const cx = w / 2;
  const cy = h / 2;
  const points = createFibonacciPoints(cx, cy, w, h, N);

  if (!points.length) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  points.forEach((pt, index) => {
    if (index === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  });
>>>>>>>+main
>>> upstream/codex/add-weaving_symbols-documentation
  ctx.stroke();
  ctx.restore();
}

<<<<<<< mainfunction drawHelix(ctx, w, h, strandColor, rungColor, N) {
  ctx.save();
  const segments = N.ONEFORTYFOUR;
  const amplitude = Math.min(w, h) / (N.SEVEN + N.NINE);
  const baseline = h / 2;
  const frequency = N.THIRTYTHREE / N.ELEVEN;
  const phase = Math.PI / N.THREE;

  ctx.lineWidth = N.THREE / N.ELEVEN;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = strandColor;

  ctx.beginPath();
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = w * t;
    const y = baseline + amplitude * Math.sin(frequency * Math.PI * t);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
>>>>>>>+main
ayer 4: // Layer 4: Double-helix lattice - two strands plus calm cross ties.
function drawHelix(ctx, w, h, strandColor, rungColor, N) {
  ctx.save();
  const centerY = h * 0.55;
  const amplitude = h / N.NINETYNINE * N.ELEVEN;
  const cycles = N.THREE; // three full twists keeps rhythm steady.
  const steps = N.ONEFORTYFOUR;

  const strandA = [];
  const strandB = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = t * w;
    const angle = t * cycles * Math.PI * 2;
    const yA = centerY + Math.sin(angle) * amplitude;
    const yB = centerY + Math.sin(angle + Math.PI) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  drawPolyline(ctx, strandA, strandColor, 2);
  drawPolyline(ctx, strandB, strandColor, 2);
  ctx.lineJoin = "round";

  const center = { x: width / 2, y: height / 2 };
  const points = buildSpiralPoints(center, Math.min(width, height), N);
  drawPolyline(ctx, points);

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6;
  const rungCount = N.TWENTYTWO;
  for (let i = 0; i <= rungCount; i += 1) {
    const index = Math.floor((i / rungCount) * steps);
    const a = strandA[index];
    const b = strandB[index];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
>>>>>>>+upstream/codex/
eginPath();
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = w * t;
    const y = baseline + amplitude * Math.sin(frequency * Math.PI * t + phase);
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ];
}

// Layer 3: Fibonacci curve — static golden spiral polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;

  const centerX = w / 2;
  const centerY = h / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const maxTheta = Math.PI * (N.NINE / N.THREE); // 3 full turns for calm pacing.
  const steps = Math.max(N.ONEFORTYFOUR, 90);
  const scale = Math.min(w, h) / 2.2;
  const radiusFactor = Math.pow(phi, maxTheta / (Math.PI / 2));
  const a = scale / radiusFactor;

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * maxTheta;
    const r = a * Math.pow(phi, t / (Math.PI / 2));
    const x = centerX + r * Math.cos(t);
    const y = centerY + r * Math.sin(t);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.strokeStyle = rungColor;
  ctx.globalAlpha = 0.65;
  const rungCount = N.TWENTYTWO + N.ELEVEN;
  for (let i = 0; i <= rungCount; i += 1) {
    const t = i / rungCount;
    const x = w * t;
    const y1 = baseline + amplitude * Math.sin(frequency * Math.PI * t);
    const y2 = baseline + amplitude * Math.sin(frequency * Math.PI * t + phase);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
  const phi = (1 + Math.sqrt(5)) / 2;
  const maxRadius = Math.hypot(width, height);
  const baseRadius = Math.min(width, height) / N.SEVEN;
  const originX = width * 0.36;
  const originY = height * 0.58;
  const points = [];

  for (let i = 0; i <= N.THIRTYTHREE; i += 1) {
    const angle = i * (Math.PI / N.NINE) * 1.5; // Gentle turn increments align with ninefold rhythm.
    const radius = baseRadius * Math.pow(phi, i / N.SEVEN);
    if (radius > maxRadius) break;
    const x = originX + radius * Math.cos(angle);
    const y = originY + radius * Math.sin(angle);
    points.push({ x, y });
  }

  drawPolyline(ctx, points);
  ctx.restore();
}

<<<<<<< main// Layer 4: Double helix lattice — static sine strands with cross ties.
function drawDoubleHelix(ctx, width, height, strandColor, rungColor, N) {
  ctx.save();
  const steps = N.ONEFORTYFOUR; // Sample density ties to 144 for lattice stability.
  const centerX = width * 0.68;
  const amplitude = width / N.TWENTYTWO;
  const verticalStep = height / steps;
  const curveA = [];
  const curveB = [];

  for (let i = 0; i <= steps; i += 1) {
    const y = i * verticalStep;
    const angle = (i / N.THIRTYTHREE) * Math.PI * 2; // 33 harmonics through the strand.
    const offset = Math.sin(angle) * amplitude;
    curveA.push({ x: centerX - offset, y });
    curveB.push({ x: centerX + offset, y });
  }

  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = strandColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  drawPolyline(ctx, curveA);

  ctx.globalAlpha = 0.45;
  drawPolyline(ctx, curveB);

  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.5;
  const rungCount = N.TWENTYTWO;
  const rungInterval = Math.max(1, Math.floor(steps / rungCount));

  for (let i = 0; i <= steps; i += rungInterval) {
    const a = curveA[i];
    const b = curveB[i];
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
/* Layer 4 — Double helix lattice. Two sine strands with static cross ties. */
function drawHelix(ctx, w, h, primaryColor, secondaryColor, N) {
  const sampleCount = clampPositive(N.ONEFORTYFOUR, 144);
  const cycles = clampPositive(N.THREE, 3);
  const baseline = h / 2;
  const amplitude = h / clampPositive(N.SEVEN, 7);
  const pointsA = [];
  const pointsB = [];

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / (sampleCount - 1 || 1);
    const x = t * w;
    const theta = cycles * 2 * Math.PI * t;
    const yA = baseline + amplitude * Math.sin(theta);
    const yB = baseline + amplitude * Math.sin(theta + Math.PI);
    pointsA.push({ x, y: yA });
    pointsB.push({ x, y: yB });
  }

  ctx.save();
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;
  strokePolyline(ctx, pointsA, primaryColor);
  strokePolyline(ctx, pointsB, secondaryColor);

  const tieStep = Math.max(1, Math.floor(sampleCount / clampPositive(N.TWENTYTWO, 22)));
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = secondaryColor;
  for (let i = 0; i < sampleCount; i += tieStep) {
    const a = pointsA[i];
    const b = pointsB[i];
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
>>>>>>>+main
 drawPolyline(ctx, points, color, width) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
>>>>>>> upstream/codex/add-weaving_symbols-documentation

  ctx.restore();
}

function drawNotice(ctx, w, h, message, color) {
  if (!message) return;
  ctx.save();
  ctx.font = "14px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  ctx.fillText(message, 24, h - 24);
  ctx.restore();
}

function strokeCircle(ctx, x, y, radius, filled) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(radius, 0), 0, Math.PI * 2);
  if (filled) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}
<<<<<<< main

function strokePolyline(ctx, points, color) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  points.forEach((pt, index) => {
    if (index === 0) {
      ctx.moveTo(pt.x, pt.y);
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  });
  ctx.stroke();
}

function clampPositive(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return num;
}

function createTreeNodes(w, h) {
  const positions = [
    { x: 0.5, y: 0.08 }, // Keter
    { x: 0.72, y: 0.18 }, // Chokmah
    { x: 0.28, y: 0.18 }, // Binah
    { x: 0.76, y: 0.36 }, // Chesed
    { x: 0.24, y: 0.36 }, // Geburah
    { x: 0.5, y: 0.5 },  // Tiphareth
    { x: 0.74, y: 0.68 }, // Netzach
    { x: 0.26, y: 0.68 }, // Hod
    { x: 0.5, y: 0.84 },  // Yesod
    { x: 0.5, y: 0.94 }   // Malkuth
  ];

function getTreeNodes(w, h, N) {
  const topMargin = h / N.ELEVEN;
  const bottomMargin = h - topMargin;
  const verticalSpan = bottomMargin - topMargin;
  const verticalStep = verticalSpan / N.NINE;
  const centerX = w / 2;
  const pillarOffset = w / (N.THREE + N.SEVEN / N.NINE);
  const innerOffset = pillarOffset / (N.TWENTYTWO / N.ELEVEN);
  const outerOffset = pillarOffset;
function buildSpiralPoints(center, span, N) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = N.SEVEN / N.THREE; // ~2.33 turns keep the spiral calm yet present.
  const steps = N.ONEFORTYFOUR; // 144 samples for smoothness tied to Codex 144:99.
  const startRadius = span / (N.SEVEN + N.NINE); // 16 slices cradle the opening arc.
  const growth = Math.pow(phi, N.ELEVEN / N.NINE); // 11 and 9 pace the outward bloom.
  const points = [];

  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1);
    const angle = -Math.PI / 2 + turns * 2 * Math.PI * t;
    const radius = startRadius * Math.pow(growth, t);
    points.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    });
  }

  return points;
}

function drawPolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    const point = points[i];
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice — two steady strands with measured cross ties.
function drawHelixLattice(ctx, width, height, strandColor, rungColor, N) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const left = width / N.ELEVEN;
  const right = width - left;
  const steps = N.ONEFORTYFOUR; // 144 sample points across the lattice.
  const amplitude = height / N.SEVEN; // Calm wave height from the number 7.
  const frequency = N.THIRTYTHREE / N.ELEVEN; // 33/11 = 3 full waves across the span.
  const phaseShift = Math.PI / N.THREE; // Staggered strands honour the vesica triad.
  const baseline = height / 2;
  const strandA = [];
  const strandB = [];

  for (let i = 0; i < steps; i += 1) {
    const t = i / (steps - 1);
    const x = left + (right - left) * t;
    const angle = frequency * 2 * Math.PI * t;
    const yA = baseline + Math.sin(angle) * amplitude;
    const yB = baseline + Math.sin(angle + phaseShift) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.strokeStyle = strandColor;
  ctx.lineWidth = 2;
  drawPolyline(ctx, strandA);
  drawPolyline(ctx, strandB);

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.5;

  const rungEvery = Math.max(2, Math.floor(steps / N.THIRTYTHREE)); // 33 ties across the width.
  for (let i = 0; i < steps; i += rungEvery) {
    const a = strandA[i];
    const b = strandB[i];
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
// Layer 4: Double-helix lattice — static strands with gentle cross ties.
function drawHelix(ctx, w, h, strandA, strandB, tieColor, N) {
  ctx.save();
  const centerY = h * 0.62;
  const amplitude = h / (N.ELEVEN * 1.2);
  const cycles = N.THREE;
  const steps = N.ONEFORTYFOUR;

  ctx.lineWidth = 2;
  ctx.strokeStyle = strandA;
  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const progress = i / steps;
    const theta = progress * cycles * Math.PI * 2;
    const x = progress * w;
    const y = centerY - amplitude * Math.sin(theta);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.strokeStyle = strandB;
  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const progress = i / steps;
    const theta = progress * cycles * Math.PI * 2 + Math.PI;
    const x = progress * w;
    const y = centerY + amplitude * Math.sin(theta);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;
  ctx.strokeStyle = tieColor;
  const rungInterval = Math.max(4, Math.floor(steps / N.TWENTYTWO));

  for (let i = 0; i <= steps; i += rungInterval) {
    const progress = i / steps;
    const theta = progress * cycles * Math.PI * 2;
    const x = progress * w;
    const yTop = centerY - amplitude * Math.sin(theta);
    const yBottom = centerY + amplitude * Math.sin(theta);
    ctx.beginPath();
    ctx.moveTo(x, yTop);
    ctx.lineTo(x, yBottom);
    ctx.stroke();
  }

  return [
    { x: centerX, y: topMargin },
    { x: centerX - innerOffset, y: topMargin + verticalStep },
    { x: centerX + innerOffset, y: topMargin + verticalStep },
    { x: centerX - outerOffset, y: topMargin + verticalStep * 3 },
    { x: centerX + outerOffset, y: topMargin + verticalStep * 3 },
    { x: centerX, y: topMargin + verticalStep * (N.NINE / 2) },
    { x: centerX - outerOffset, y: topMargin + verticalStep * 6 },
    { x: centerX + outerOffset, y: topMargin + verticalStep * 6 },
    { x: centerX, y: topMargin + verticalStep * 7 },
    { x: centerX, y: bottomMargin }
function drawNotice(ctx, width, height, text, color) {
  if (!text) return;
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = color;
  ctx.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textBaseline = "bottom";
  ctx.fillText(text, 24, height - 24);
  ctx.restore();
}

function getTreeNodes(width, height) {
  const layout = [
    { x: 0.5, y: 0.08 },
    { x: 0.28, y: 0.2 },
    { x: 0.72, y: 0.2 },
    { x: 0.28, y: 0.38 },
    { x: 0.72, y: 0.38 },
    { x: 0.5, y: 0.52 },
    { x: 0.28, y: 0.68 },
    { x: 0.72, y: 0.68 },
    { x: 0.5, y: 0.82 },
    { x: 0.5, y: 0.94 }
  return positions.map((pos) => ({ x: pos.x * w, y: pos.y * h }));
}

function createTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 3], [1, 5],
    [2, 3], [2, 4], [2, 5],
    [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 7],
    [5, 6], [5, 7], [6, 7],
    [6, 8], [6, 9], [7, 8], [7, 9],
    [8, 9]
  ];
  return layout.map(point => ({ x: point.x * width, y: point.y * height }));
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ];
}

function normalizePalette(raw) {
  if (!raw || typeof raw !== "object") {
    return { bg: "#0b0b12", ink: "#e8e8f0", layers: [] };
  }
  return {
    bg: typeof raw.bg === "string" ? raw.bg : "#0b0b12",
    ink: typeof raw.ink === "string" ? raw.ink : "#e8e8f0",
    layers: Array.isArray(raw.layers) ? raw.layers : []
  };
}

function normalizeConstants(values) {
  const defaults = {
    THREE: 3,
    SEVEN: 7,
    NINE: 9,
    ELEVEN: 11,
    TWENTYTWO: 22,
    THIRTYTHREE: 33,
    NINETYNINE: 99,
    ONEFORTYFOUR: 144
  };
  if (!values || typeof values !== "object") {
    return defaults;
  }
  const result = { ...defaults };
  Object.keys(defaults).forEach((key) => {
    if (typeof values[key] === "number") {
      result[key] = values[key];
    }
  });
  return result;
function drawPolyline(ctx, points) {
  if (!points || points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
function createFibonacciPoints(cx, cy, w, h, N) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const samples = clampPositive(N.NINETYNINE, 99);
  const turns = clampPositive(N.THREE, 3);
  const maxTheta = turns * Math.PI;
  const baseRadius = Math.min(w, h) / clampPositive(N.ELEVEN, 11);

  const rawPoints = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = (maxTheta * i) / samples;
    const growth = Math.pow(phi, t / (Math.PI / 2));
    rawPoints.push({
      x: cx + baseRadius * growth * Math.cos(t),
      y: cy + baseRadius * growth * Math.sin(t)
    });
  }

  const maxDistance = rawPoints.reduce((acc, pt) => {
    const distance = Math.hypot(pt.x - cx, pt.y - cy);
    return Math.max(acc, distance);
  }, 0) || 1;

  const limit = Math.min(w, h) / (clampPositive(N.THREE, 3) - 1 / clampPositive(N.THIRTYTHREE, 33));
  const scale = limit / maxDistance;

  return rawPoints.map((pt) => ({
    x: cx + (pt.x - cx) * scale,
    y: cy + (pt.y - cy) * scale
  }));
}

function drawNotice(ctx, width, height, color, text) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.fillText(text, 24, height - 32);
  ctx.restore();
}
function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}
