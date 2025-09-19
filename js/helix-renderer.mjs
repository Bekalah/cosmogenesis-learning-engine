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
  bg: "#0a0c16",
  ink: "#f4e3c6",
  layers: ["#1f3f63", "#265f7f", "#c4974b", "#f6d58b", "#c987d6", "#2c3b5d"]
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
 * Render a static four-layer helix composition onto a canvas.
 *
 * Draws, in sequence, a vesica field, a Tree of Life scaffold, a Fibonacci spiral, and a double-helix lattice,
 * then optionally renders an inline notice. If the provided canvas context is invalid or lacks `save()`,
 * the function returns immediately with a quiet summary object instead of throwing.
 *
 * @param {Object} [input={}] - Optional overrides for rendering (palette, numeric constants, notice text, explicit dimensions).
 * @return {{summary: string}} An object with a human-readable summary of which layers were rendered and basic counts.
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

function mergeNumbers(candidate) {
  const merged = { ...DEFAULT_NUMBERS };
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    if (typeof candidate[key] === "number" && Number.isFinite(candidate[key])) {
      merged[key] = candidate[key];
    }
  }
  return merged;
}

function clearStage(ctx, dims, palette, numbers) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
  applyBackgroundGlow(ctx, dims, palette, numbers);
}

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

function drawVesicaPair(ctx, cell) {
  ctx.beginPath();
  ctx.arc(cell.cx - cell.offset, cell.cy, cell.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cell.cx + cell.offset, cell.cy, cell.radius, 0, Math.PI * 2);
  ctx.stroke();
}

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

 * Compute coordinates for the 12 Tree of Life sephirot laid out on a dual-pillar 144-step grid.
 *
 * The layout maps a 144-step vertical "covenant ladder" onto the available canvas dimensions,
 * placing nodes on a centered spine or on left/right pillars offset by a 33-step horizontal shift.
 * Y coordinates increase downward (canvas coordinate space).
 *
 * @param {{width: number, height: number}} dims - Drawing area dimensions; used to derive margins and scale.
 * @param {Object} numbers - Numeric constants (expects numeric properties such as ONEFORTYFOUR, THIRTYTHREE, TWENTYTWO, SEVEN, NINE, THREE, NINETYNINE). These drive the 144-step vertical scaling and pillar offsets.
 * @return {Object.<string,{x:number,y:number}>} An object mapping sephirot keys (kether, chokmah, binah, daath, chesed, geburah, tiphareth, netzach, hod, yesod, malkuth) to their {x,y} canvas coordinates.

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

  const column = dims.width / numbers.THREE;
  const stepY = (dims.height - marginY * 2) / numbers.ELEVEN;


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
