/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands with lattice rungs)

  Why: encodes layered cosmology with calm colors, zero animation, and
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

export function renderHelix(ctx, input = {}) {
  if (!ctx || typeof ctx.canvas === "undefined" || typeof ctx.save !== "function") {
    // Calm skip keeps the offline shell quiet when contexts are denied (rare on hardened browsers).
    return { summary: "Canvas context unavailable; rendering skipped." };
  }

  const config = normaliseConfig(ctx, input);
  ctx.save();
  clearStage(ctx, config.dims, config.palette.bg);

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

function mergeNumbers(candidate) {
  const merged = { ...DEFAULT_NUMBERS };
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    if (typeof candidate[key] === "number" && Number.isFinite(candidate[key])) {
      merged[key] = candidate[key];
    }
  }
  return merged;
}

function clearStage(ctx, dims, bg) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

function drawVesicaField(ctx, dims, palette, numbers) {
  ctx.save();
  ctx.globalAlpha = 0.65; // ND-safe softness keeps layer readable without glare.
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = Math.max(1, dims.width / (numbers.ONEFORTYFOUR * 1.8));

  const rows = numbers.SEVEN;
  const cols = numbers.THREE;
  const margin = dims.width / numbers.THIRTYTHREE;
  const innerWidth = dims.width - margin * 2;
  const innerHeight = dims.height - margin * 2;
  const horizontalStep = cols > 1 ? innerWidth / (cols - 1) : 0;
  const verticalStep = rows > 1 ? innerHeight / (rows - 1) : 0;
  const radius = Math.min(horizontalStep, verticalStep) * (numbers.NINE / numbers.TWENTYTWO);
  const offset = radius * (numbers.ELEVEN / numbers.TWENTYTWO);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = margin + col * horizontalStep;
      const cy = margin + row * verticalStep;
      drawVesica(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
  return { circles: rows * cols * 2, radius };
}

function drawVesica(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTreeOfLife(ctx, dims, palette, numbers) {
  const nodes = buildTreeNodes(dims, numbers);
  const paths = buildTreePaths();
  const nodeRadius = Math.max(6, dims.width / numbers.NINETYNINE);

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = palette.layers[1];
  ctx.lineWidth = Math.max(1.2, dims.width / (numbers.ONEFORTYFOUR * 2.5));
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
  ctx.lineWidth = 1;
  for (const key of Object.keys(nodes)) {
    const node = nodes[key];
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
  return { nodes: Object.keys(nodes).length, paths: paths.length };
}

/**
 * Compute canvas coordinates for the 11 Tree of Life sephirot.
 *
 * Uses the canvas dimensions and numerology constants to produce a vertically distributed,
 * numerology-anchored layout for the sephirot (kether, chokmah, binah, daath, chesed,
 * geburah, tiphareth, netzach, hod, yesod, malkuth). Positions are in canvas pixels.
 *
 * The vertical placement is computed from a top/bottom margin and an inner height divided
 * into eleven steps; several level multipliers are derived from the provided numeric
 * constants so the geometry remains consistent with the module's numerology rules.
 *
 * @param {{width:number, height:number}} dims - Canvas dimensions in pixels.
 * @param {Object<string, number>} numbers - Numerology constants (expects keys like THREE, SEVEN, ELEVEN, TWENTYTWO, THIRTYTHREE, NINE, ONEFORTYFOUR). These values are used to compute vertical levels and column spacing.
 * @return {Object<string, {x:number,y:number}>} Mapping of sephirot names to their {x,y} canvas coordinates.
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

function drawFibonacciCurve(ctx, dims, palette, numbers) {
  const sequence = buildFibonacciSequence(numbers.ONEFORTYFOUR);
  const points = buildSpiralPoints(sequence, dims, numbers);

  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = palette.layers[3];
  ctx.lineWidth = Math.max(1.2, dims.width / numbers.NINETYNINE);
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
  ctx.restore();

  return { points: points.length };
}

function buildFibonacciSequence(limit) {
  const seq = [1, 1];
  while (true) {
    const next = seq[seq.length - 1] + seq[seq.length - 2];
    if (next > limit) break;
    seq.push(next);
  }
  return seq;
}

function buildSpiralPoints(sequence, dims, numbers) {
  const centerX = dims.width * 0.72;
  const centerY = dims.height * 0.28;
  const scale = Math.min(dims.width, dims.height) / (numbers.ONEFORTYFOUR * 0.9);
  const goldenAngle = Math.PI * 2 / numbers.ELEVEN; // gentle rotation anchored to numerology

  const points = sequence.map((value, index) => {
    const angle = goldenAngle * index;
    const radius = Math.sqrt(value) * scale;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  // Always include centre to anchor the spiral visually
  return [{ x: centerX, y: centerY }, ...points];
}

function drawHelixLattice(ctx, dims, palette, numbers) {
  const rails = buildHelixRails(dims, numbers);

  ctx.save();
  ctx.strokeStyle = palette.layers[4];
  ctx.lineWidth = Math.max(1.2, dims.width / numbers.ONEFORTYFOUR);

  // Draw first rail
  ctx.beginPath();
  rails.a.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  // Draw second rail
  ctx.strokeStyle = palette.layers[5];
  ctx.beginPath();
  rails.b.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  // Draw lattice rungs
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, dims.width / numbers.ONEFORTYFOUR);
  rails.rungs.forEach(rung => {
    ctx.beginPath();
    ctx.moveTo(rung.a.x, rung.a.y);
    ctx.lineTo(rung.b.x, rung.b.y);
    ctx.stroke();
  });

  ctx.restore();
  return { rungs: rails.rungs.length };
}

function buildHelixRails(dims, numbers) {
  const length = numbers.TWENTYTWO;
  const startX = dims.width * 0.12;
  const endX = dims.width * 0.88;
  const amplitude = dims.height / numbers.ELEVEN;
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

function drawCanvasNotice(ctx, dims, color, message) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${Math.max(14, dims.width / 72)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(message, dims.width / 2, dims.height - dims.height / 40);
  ctx.restore();
}

function summariseLayers(stats) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const tree = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  const helix = `${stats.helixStats.rungs} helix rungs`;
  return `Layers rendered - ${vesica}; ${tree}; ${fibonacci}; ${helix}.`;
}
