/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

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
        strokeCircle(ctx, cx, lensCy, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold — thin lines and soft nodes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 22 paths softened by pillar 11.
  ctx.lineCap = "round";

  const nodes = getTreeNodes(w, h);
  const paths = getTreePaths();

  paths.forEach(([from, to]) => {
    const a = nodes[from];
    const b = nodes[to];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = Math.max(3, Math.min(w, h) / N.NINETYNINE * (N.NINE / N.TWENTYTWO));

  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

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
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 5], [2, 5],
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

  ctx.restore();
}

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

  ctx.restore();
}

function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}
