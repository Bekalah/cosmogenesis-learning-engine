/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves)

  Rationale:
    - no motion or flashing; everything rendered once
    - muted palette for calm contrast
    - numerology constants wire geometry to 3/7/9/11/22/33/99/144
*/

const FALLBACK_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

// Normalize palette input so rendering stays stable even with partial data.
export function preparePalette(candidate) {
  const palette = {
    bg: FALLBACK_PALETTE.bg,
    ink: FALLBACK_PALETTE.ink,
    layers: FALLBACK_PALETTE.layers.slice()
  };

  if (!candidate) {
    return palette;
  }

  if (typeof candidate.bg === "string") {
    palette.bg = candidate.bg;
  }

  if (typeof candidate.ink === "string") {
    palette.ink = candidate.ink;
  }

  if (Array.isArray(candidate.layers)) {
    palette.layers = palette.layers.map((fallbackColor, index) => {
      const next = candidate.layers[index];
      return typeof next === "string" ? next : fallbackColor;
    });
  }

  return palette;
}

export function renderHelix(ctx, opts) {
  const { width, height, NUM: N } = opts;
  const palette = preparePalette(opts.palette);

  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  const layers = palette.layers;

  // Layer order from base to foreground clarifies depth without motion.
  drawVesicaField(ctx, width, height, layers[0], N);
  drawTreeOfLife(ctx, width, height, layers[1], layers[2], N);
  drawFibonacci(ctx, width, height, layers[3], N);
  drawHelix(ctx, width, height, layers[4], layers[5], N);

  return palette;
}

// Layer 1: Vesica field — static circle grid with soft alpha.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 1;

  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing

  for (let y = radius; y <= h - radius; y += step) {
    for (let x = radius; x <= w - radius; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life — nodes and paths with rounded strokes.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const centerX = w / 2;
  const innerOffset = w / N.SEVEN; // 7 keeps inner pillars balanced
  const outerOffset = w / N.THREE; // 3 anchors mercy and severity pillars
  const margin = h / N.NINE; // top and bottom breathing room
  const stepY = (h - margin * 2) / N.NINE;

  const rows = [0, 1, 1, 3, 3, 4, 6, 6, 7, 9];
  const nodes = [
    { x: centerX, y: margin + stepY * rows[0] }, // Kether
    { x: centerX - innerOffset, y: margin + stepY * rows[1] }, // Chokmah
    { x: centerX + innerOffset, y: margin + stepY * rows[2] }, // Binah
    { x: centerX - outerOffset, y: margin + stepY * rows[3] }, // Chesed
    { x: centerX + outerOffset, y: margin + stepY * rows[4] }, // Geburah
    { x: centerX, y: margin + stepY * rows[5] }, // Tiphereth
    { x: centerX - outerOffset, y: margin + stepY * rows[6] }, // Netzach
    { x: centerX + outerOffset, y: margin + stepY * rows[7] }, // Hod
    { x: centerX, y: margin + stepY * rows[8] }, // Yesod
    { x: centerX, y: margin + stepY * rows[9] } // Malkuth
  ];

  const paths = [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // size tied to 9 for calm readability
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Layer 3: Fibonacci curve — golden spiral polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const fib = [1, 1];
  while (fib.length < N.ELEVEN) {
    const len = fib.length;
    fib.push(fib[len - 1] + fib[len - 2]);
  }

  const scale = Math.min(w, h) / (N.ONEFORTYFOUR / N.ELEVEN);
  let angle = 0;
  let x = w / 2;
  let y = h / 2;

  ctx.beginPath();
  ctx.moveTo(x, y);

  fib.forEach(length => {
    angle += Math.PI / 2;
    x += Math.cos(angle) * length * scale;
    y += Math.sin(angle) * length * scale;
    ctx.lineTo(x, y);
  });

  ctx.stroke();
  ctx.restore();
}

// Layer 4: Double-helix lattice — two still sine tracks and gentle crossbars.
function drawHelix(ctx, w, h, colorA, colorB, N) {
  ctx.save();
  const midY = h / 2;
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 and 11 echo twin pillars softly
  const turns = N.THIRTYTHREE / N.THREE; // 11 waves across the span
  const tau = Math.PI * 2;
  const stepX = w / N.ONEFORTYFOUR; // keeps curve smooth without motion

  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN;
  ctx.lineCap = "round";

  for (let phase = 0; phase < 2; phase++) {
    ctx.strokeStyle = phase === 0 ? colorA : colorB;
    ctx.beginPath();

    for (let x = 0; x <= w; x += stepX) {
      const offset = (x / w) * turns * tau + phase * Math.PI;
      const y = midY + amplitude * Math.sin(offset);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }

  // Crossbars add lattice depth without animation.
  const rungStep = w / (turns * N.SEVEN);
  ctx.strokeStyle = colorB;
  ctx.globalAlpha = 0.4;

  for (let x = 0; x <= w; x += rungStep) {
    const baseOffset = (x / w) * turns * tau;
    const yA = midY + amplitude * Math.sin(baseOffset);
    const yB = midY + amplitude * Math.sin(baseOffset + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, yA);
    ctx.lineTo(x, yB);
    ctx.stroke();
  }

  ctx.restore();
}
