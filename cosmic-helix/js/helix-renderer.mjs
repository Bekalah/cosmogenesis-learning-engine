/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Offline-only: no dependencies, no animation, calm palette.

  Layers (rendered back-to-front):
    1) Vesica field — intersecting circles (lenses) to anchor the womb of forms.
    2) Tree-of-Life scaffold — ten sephirot nodes linked by twenty-two paths.
    3) Fibonacci curve — golden spiral polyline using phi growth.
    4) Double-helix lattice — two phase-shifted strands with gentle cross ties.

  All geometry leans on the requested numerology constants 3, 7, 9, 11, 22, 33, 99, 144.
  Comments explain ND-safe choices so future stewards know why motion was avoided.
*/

export function renderHelix(ctx, opts) {
  if (!ctx) return { ok: false, reason: "missing-context" };

  const { width, height, palette, NUM: N, notice } = opts;
  const fallbackLayers = ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"];
  const layers = Array.isArray(palette.layers) && palette.layers.length >= 6 ? palette.layers : fallbackLayers;
  const baseInk = palette.ink || "#e8e8f0";

  // Calm background keeps the render ND-safe; fill before drawing layers.
  ctx.save();
  ctx.fillStyle = palette.bg || "#0b0b12";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Layer order from background to foreground keeps depth readable with zero motion.
  drawVesicaField(ctx, width, height, pickLayerColor(layers, fallbackLayers, 0), N);
  drawTreeOfLife(
    ctx,
    width,
    height,
    pickLayerColor(layers, fallbackLayers, 1),
    pickLayerColor(layers, fallbackLayers, 2),
    N
  );
  drawFibonacci(ctx, width, height, pickLayerColor(layers, fallbackLayers, 3), N);
  drawHelix(ctx, width, height, pickLayerColor(layers, fallbackLayers, 4), pickLayerColor(layers, fallbackLayers, 5), N);

  if (notice) {
    // Inline notice reassures the viewer when palette data is missing.
    ctx.save();
    ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillStyle = baseInk;
    ctx.fillText(notice, 24, height - 24);
    ctx.restore();
  }

  return { ok: true };
}

function pickLayerColor(layers, fallbackLayers, index) {
  return layers[index] || fallbackLayers[index] || "#ffffff";
}

// Layer 1: Vesica field builds a calm lens grid using 11x9 circles (99 lenses).
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // Gentle transparency keeps the lattice soft.

  const columns = N.ELEVEN;
  const rows = N.NINE;
  const spacingX = w / (columns + 1);
  const spacingY = h / (rows + 1);
  const radius = Math.min(spacingX, spacingY) * (N.SEVEN / (N.THREE * N.ELEVEN));
  const offset = radius / (N.THREE / N.SEVEN);

  for (let row = 0; row < rows; row += 1) {
    const cy = spacingY * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = spacingX * (col + 1);
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      // Every third row gets an extra vertical lens to honour 3 / 9 rhythm.
      if ((row + col) % N.THREE === 0 && row < rows - 1) {
        const nextCy = spacingY * (row + 2);
        strokeCircle(ctx, cx, (cy + nextCy) / 2, radius * (N.NINE / N.ELEVEN));
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold with softened lines and discs.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // Equals 2; twenty-two paths stay legible without harshness.
  ctx.lineCap = "round";

  const nodes = getTreeNodes(w, h, N);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // Disc radius anchored to 9 keeps size gentle (value 3).

  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
}

function getTreeNodes(w, h, N) {
  const centerX = w / 2;
  const pillarSpread = w / (N.THREE + N.SEVEN / N.NINE);
  const leftX = centerX - pillarSpread;
  const rightX = centerX + pillarSpread;
  const midLeft = centerX - pillarSpread / (N.THREE / N.SEVEN);
  const midRight = centerX + pillarSpread / (N.THREE / N.SEVEN);

  const topMargin = h / N.NINE;
  const bottomMargin = h - topMargin;
  const step = (bottomMargin - topMargin) / (N.SEVEN + N.THREE - 1); // Nine intervals using 7+3.

  const y = index => topMargin + step * index;

  return [
    { x: centerX, y: y(0) }, // Kether
    { x: rightX, y: y(1) },  // Chokmah
    { x: leftX, y: y(1) },   // Binah
    { x: rightX, y: y(3) },  // Chesed
    { x: leftX, y: y(3) },   // Geburah
    { x: centerX, y: y(4) }, // Tiphereth
    { x: midRight, y: y(6) },// Netzach
    { x: midLeft, y: y(6) }, // Hod
    { x: centerX, y: y(7.5) }, // Yesod (slight drop honours foundation)
    { x: centerX, y: y(9) }  // Malkuth
  ];
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // Exactly twenty-two paths.
}

// Layer 3: Fibonacci curve rendered as a single calm polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.ELEVEN / N.TWENTYTWO; // Equals 0.5; delicate trace keeps it gentle.
  ctx.globalAlpha = 0.9;

  const phi = (1 + Math.sqrt(5)) / 2;
  const centreX = w / 2;
  const centreY = h / 2;
  const startRadius = Math.min(w, h) / N.THIRTYTHREE;
  const turns = N.SEVEN / N.THREE; // About 2.33 rotations keeps the spiral grounded.
  const segments = N.ONEFORTYFOUR;
  const angleStep = (Math.PI * 2 * turns) / segments;
  const quarterTurn = Math.PI / 2;

  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const angle = angleStep * i;
    const radiusGrowth = Math.pow(phi, angle / quarterTurn);
    const radius = startRadius * radiusGrowth;
    const x = centreX + Math.cos(angle) * radius;
    const y = centreY + Math.sin(angle) * radius;
    points.push({ x, y });
  }

  drawPolyline(ctx, points);
  ctx.restore();
}

// Layer 4: Double-helix lattice — two calm strands with cross ties.
function drawHelix(ctx, w, h, colorA, colorB, N) {
  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";

  const samples = N.ONEFORTYFOUR;
  const margin = w / N.ELEVEN;
  const usableWidth = w - margin * 2;
  const midY = h * (N.NINETYNINE / N.ONEFORTYFOUR);
  const amplitude = h / N.ELEVEN;
  const rotations = N.THREE + N.SEVEN / N.ELEVEN;
  const angleFactor = Math.PI * rotations;

  const strandA = [];
  const strandB = [];

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const x = margin + usableWidth * t;
    const angle = angleFactor * t;
    const yA = midY + Math.sin(angle) * amplitude;
    const yB = midY + Math.sin(angle + Math.PI) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.strokeStyle = colorA;
  drawPolyline(ctx, strandA);

  ctx.strokeStyle = colorB;
  drawPolyline(ctx, strandB);

  // Cross ties every ninth sample echo the 9 constant and create the lattice feel.
  ctx.strokeStyle = blendColors(colorA, colorB);
  strandA.forEach((point, index) => {
    if (index % N.NINE === 0 && index < strandB.length) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(strandB[index].x, strandB[index].y);
      ctx.stroke();
    }
  });

  ctx.restore();
}

function drawPolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
}

function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function blendColors(colorA, colorB) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  if (!a || !b) return "#bbbbbb";
  const mix = {
    r: Math.round((a.r + b.r) / 2),
    g: Math.round((a.g + b.g) / 2),
    b: Math.round((a.b + b.b) / 2)
  };
  return rgbToHex(mix);
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const value = parseInt(clean, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function rgbToHex(rgb) {
  const toHex = value => value.toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}
