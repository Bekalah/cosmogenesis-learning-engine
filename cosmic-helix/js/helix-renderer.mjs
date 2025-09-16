/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Why: the layered order keeps the cosmology intact while remaining gentle for neurodivergent viewers.

  Layers rendered (background to foreground):
    1) Vesica field – repeating circle lattice to seed the space (3 / 7 rhythm).
    2) Tree-of-Life scaffold – ten sephirot and twenty-two links (why: honours the canonical paths).
    3) Fibonacci curve – static golden spiral polyline (why: evokes growth without motion).
    4) Double-helix lattice – two calm sine tracks with cross ties (why: invokes the living codex).

  Implementation notes:
    - No animation or flashing; everything draws once.
    - Colours and spacing reference numerology constants 3, 7, 9, 11, 22, 33, 99, 144.
    - Small, pure helper functions keep the code readable and offline-friendly.
*/

export function renderHelix(ctx, options) {
  if (!ctx) return { ok: false, reason: "missing-context" };
  if (!options || !options.NUM) return { ok: false, reason: "missing-parameters" };

  const fallback = {
    bg: "#0b0b12",
    ink: "#e8e8f0",
    layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
  };

  const { width, height, palette = {}, NUM, notice } = options;
  if (typeof width !== "number" || typeof height !== "number") {
    return { ok: false, reason: "invalid-dimensions" };
  }
  const safePalette = {
    bg: palette.bg || fallback.bg,
    ink: palette.ink || fallback.ink,
    layers: normaliseLayers(palette.layers, fallback.layers)
  };

  ctx.save();
  ctx.fillStyle = safePalette.bg;
  ctx.fillRect(0, 0, width, height);

  const fieldColor = safePalette.layers[0];
  const treePathColor = safePalette.layers[1];
  const treeNodeColor = safePalette.layers[2];
  const spiralColor = safePalette.layers[3];
  const helixPrimary = safePalette.layers[4];
  const helixSecondary = safePalette.layers[5];

  drawVesicaField(ctx, width, height, fieldColor, NUM);
  drawTreeOfLife(ctx, width, height, treePathColor, treeNodeColor, NUM);
  drawFibonacci(ctx, width, height, spiralColor, NUM);
  drawHelix(ctx, width, height, helixPrimary, helixSecondary, NUM);

  if (notice) {
    drawNotice(ctx, width, height, safePalette.ink, notice);
  }

  ctx.restore();
  return { ok: true };
}

function normaliseLayers(candidate, fallbackLayers) {
  if (!Array.isArray(candidate)) return fallbackLayers.slice();
  const layers = fallbackLayers.slice();
  for (let i = 0; i < layers.length; i += 1) {
    if (candidate[i]) layers[i] = candidate[i];
  }
  return layers;
}

// Layer 1: Vesica field – intersecting circles laid out with gentle transparency.
function drawVesicaField(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35; // ND-safe: softness keeps the grid from overpowering.

  const columns = N.ELEVEN; // 11 columns echo Tree-of-Life pillars.
  const rows = N.NINE; // 9 rows nod to the spiral segments.
  const horizontalSpacing = width / (columns + 1);
  const verticalSpacing = height / (rows + 1);
  const radius = Math.min(horizontalSpacing, verticalSpacing) / (N.THREE / 2);
  const offset = radius / N.THREE; // 3 guides the vesica overlap.

  for (let row = 0; row < rows; row += 1) {
    const cy = verticalSpacing * (row + 1);
    for (let col = 0; col < columns; col += 1) {
      const cx = horizontalSpacing * (col + 1);
      strokeCircle(ctx, cx - offset, cy, radius);
      strokeCircle(ctx, cx + offset, cy, radius);

      // Every seventh lens adds a vertical connector (why: 7 resonates with the vesica rhythm).
      if (row < rows - 1 && (row + col) % N.SEVEN === 0) {
        const nextCy = verticalSpacing * (row + 2);
        const midCy = (cy + nextCy) / 2;
        strokeCircle(ctx, cx, midCy, radius);
      }
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold – ten nodes and twenty-two calm paths.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, N) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // Equals 2, gentle yet visible.
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.85;

  const nodes = getTreeNodes(width, height, N);
  const paths = getTreePaths();

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  ctx.globalAlpha = 1;
  const nodeRadius = N.NINE / 3; // equals 3; compact discs keep the layer quiet.

  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function getTreeNodes(width, height, N) {
  const midX = width / 2;
  const pillarSpread = width / N.SEVEN; // 7 sets pillar distance.
  const innerSpread = pillarSpread / N.THREE; // 3 balances the supernal triad.

  const topMargin = height / N.THIRTYTHREE; // 33 keeps breathing space.
  const usableHeight = height - topMargin * 2;
  const step = usableHeight / (N.THIRTYTHREE / N.THREE); // 33 / 3 = 11 tiers.

  const level = index => topMargin + index * step;

  return [
    { x: midX, y: level(0) },                // 0 Kether
    { x: midX - innerSpread, y: level(2) },  // 1 Chokmah
    { x: midX + innerSpread, y: level(2) },  // 2 Binah
    { x: midX - pillarSpread, y: level(4) }, // 3 Chesed
    { x: midX + pillarSpread, y: level(4) }, // 4 Geburah
    { x: midX, y: level(6) },                // 5 Tiphereth
    { x: midX - pillarSpread, y: level(8) }, // 6 Netzach
    { x: midX + pillarSpread, y: level(8) }, // 7 Hod
    { x: midX, y: level(9.5) },              // 8 Yesod
    { x: midX, y: level(11) }                // 9 Malkuth
  ];
}

function getTreePaths() {
  return [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 3], [1, 5],
    [2, 4], [2, 5], [3, 4],
    [3, 5], [4, 5], [3, 6],
    [4, 7], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8],
    [5, 8], [6, 9], [7, 9],
    [8, 9]
  ]; // 22 total paths honour the arcana count.
}

// Layer 3: Fibonacci curve – log spiral polyline, static and centred.
function drawFibonacci(ctx, width, height, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;

  const centreX = width / 2;
  const centreY = height / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const startRadius = Math.min(width, height) / N.ELEVEN;
  const totalSteps = N.NINETYNINE; // 99 segments keep the curve smooth.
  const turns = N.THREE + N.SEVEN / N.TWENTYTWO; // ~3.318 turns: calm growth.
  const maxRadius = Math.min(width, height) / (N.THREE / 2);

  const points = [];
  for (let i = 0; i <= totalSteps; i += 1) {
    const angle = (turns * Math.PI * 2 * i) / totalSteps;
    const radius = Math.min(startRadius * Math.pow(phi, angle / (Math.PI / 2)), maxRadius);
    points.push({
      x: centreX + Math.cos(angle) * radius,
      y: centreY + Math.sin(angle) * radius
    });
  }

  drawPolyline(ctx, points);
  ctx.restore();
}

// Layer 4: Double-helix lattice – two sine tracks plus calm cross ties.
function drawHelix(ctx, width, height, primaryColor, secondaryColor, N) {
  ctx.save();
  const centreY = height / 2;
  const amplitude = height / N.SEVEN; // 7 keeps the helix gentle.
  const cycles = N.THREE; // three twists across the canvas.

  drawSineTrack(ctx, width, centreY, amplitude, cycles, 0, primaryColor, 0.85, N);
  drawSineTrack(ctx, width, centreY, amplitude, cycles, Math.PI, secondaryColor, 0.75, N);
  drawHelixTies(ctx, width, centreY, amplitude, cycles, secondaryColor, N);
  ctx.restore();
}

function drawSineTrack(ctx, width, centreY, amplitude, cycles, phase, color, alpha, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = N.TWENTYTWO / N.THIRTYTHREE; // about 0.66, keeps the track delicate.
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  for (let step = 0; step <= N.NINETYNINE; step += 1) {
    const t = step / N.NINETYNINE;
    const x = t * width;
    const angle = cycles * Math.PI * 2 * t + phase;
    const y = centreY + Math.sin(angle) * amplitude;
    if (step === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawHelixTies(ctx, width, centreY, amplitude, cycles, color, N) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;

  const ties = N.TWENTYTWO; // 22 cross ties echo the path count.
  for (let i = 0; i <= ties; i += 1) {
    const t = i / ties;
    const x = t * width;
    const angle = cycles * Math.PI * 2 * t;
    const y1 = centreY + Math.sin(angle) * amplitude;
    const y2 = centreY + Math.sin(angle + Math.PI) * amplitude;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNotice(ctx, width, height, color, message) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.75;
  ctx.font = "14px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText(message, 24, height - 24);
  ctx.restore();
}

function drawPolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
}

function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}
