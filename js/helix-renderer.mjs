/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (back to front):
    1) Vesica field — intersecting circles arranged by {3, 7} grid.
    2) Tree-of-Life scaffold — ten sephirot, hidden Daath, and twenty-two paths.
    3) Fibonacci curve — calm logarithmic spiral grown by the golden ratio.
    4) Double-helix lattice — two static strands with alternating rungs.

  Why: encodes layered cosmology with soft contrast, zero motion, and explicit
  numerology constants {3, 7, 9, 11, 22, 33, 99, 144}. All helpers stay small,
  pure, and offline safe.
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

export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.save !== "function") {
    return { summary: "Canvas context unavailable; rendering skipped." };
  }

  const config = prepareConfig(ctx, options);
  ctx.save();
  clearStage(ctx, config);

  const vesica = drawVesicaField(ctx, config);
  const tree = drawTreeOfLife(ctx, config);
  const fib = drawFibonacciCurve(ctx, config);
  const helix = drawHelixLattice(ctx, config);

  if (config.notice) {
    drawCanvasNotice(ctx, config);
  }

  ctx.restore();
  return { summary: summariseLayers(vesica, tree, fib, helix) };
}

function prepareConfig(ctx, options) {
  const width = typeof options.width === "number" ? options.width : ctx.canvas.width;
  const height = typeof options.height === "number" ? options.height : ctx.canvas.height;
  const palette = mergePalette(options.palette || {});
  const numbers = mergeNumbers(options.NUM || {});
  const notice = typeof options.notice === "string" ? options.notice : null;
  return { dims: { width, height }, palette, numbers, notice };
}

function mergePalette(candidate) {
  const layers = DEFAULT_PALETTE.layers.slice();
  if (Array.isArray(candidate.layers)) {
    for (let i = 0; i < candidate.layers.length && i < layers.length; i += 1) {
      if (typeof candidate.layers[i] === "string") {
        layers[i] = candidate.layers[i];
      }
    }
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

function clearStage(ctx, config) {
  const { width, height } = config.dims;
  ctx.fillStyle = config.palette.bg;
  ctx.fillRect(0, 0, width, height);
  applyBackgroundGlow(ctx, config);
}

function applyBackgroundGlow(ctx, config) {
  const { width, height } = config.dims;
  const { palette, numbers } = config;
  ctx.save();
  const centreX = width / 2;
  const crownY = height / numbers.NINE;
  const outerRadius = Math.max(width, height) / (numbers.THREE * 0.9);
  const halo = ctx.createRadialGradient(centreX, crownY * 1.4, outerRadius / numbers.SEVEN, centreX, height / 2, outerRadius);
  halo.addColorStop(0, withAlpha(palette.ink, 0.18));
  halo.addColorStop(0.4, withAlpha(palette.layers[3], 0.16));
  halo.addColorStop(1, withAlpha(palette.bg, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  const floor = ctx.createLinearGradient(0, height * 0.68, 0, height);
  floor.addColorStop(0, withAlpha(palette.layers[5], 0.04));
  floor.addColorStop(0.6, withAlpha(palette.layers[2], 0.1));
  floor.addColorStop(1, withAlpha(palette.bg, 0.82));
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawVesicaField(ctx, config) {
  const { width, height } = config.dims;
  const { palette, numbers } = config;
  const columns = numbers.THREE;
  const rows = numbers.SEVEN;
  const centreX = width / 2;
  const topMargin = height / numbers.NINE;
  const rowSpacing = (height - topMargin * 1.8) / rows;
  const columnSpacing = width / (columns + 1);
  const radius = Math.min(columnSpacing, rowSpacing) / 1.6;

  ctx.save();
  ctx.strokeStyle = withAlpha(palette.layers[0], 0.52);
  ctx.lineWidth = Math.max(radius / numbers.TWENTYTWO, 1.4);
  for (let row = 0; row < rows; row += 1) {
    const y = topMargin + rowSpacing * (row + 0.5);
    for (let col = 0; col < columns; col += 1) {
      const centreOffset = col - (columns - 1) / 2;
      const x = centreX + centreOffset * columnSpacing;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + radius / numbers.THREE, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 0.2;
  ctx.fillStyle = palette.layers[1];
  ctx.beginPath();
  ctx.ellipse(centreX, height / numbers.THREE, radius * numbers.THREE, radius * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.lineWidth = Math.max(radius / numbers.THIRTYTHREE, 1);
  ctx.strokeStyle = withAlpha(palette.layers[0], 0.35);
  ctx.beginPath();
  ctx.moveTo(centreX, topMargin * 0.6);
  ctx.lineTo(centreX, height - topMargin * 0.4);
  ctx.stroke();
  ctx.restore();

  return { circles: columns * rows * 2 };
}

function drawTreeOfLife(ctx, config) {
  const nodes = computeTreeNodes(config.dims, config.numbers);
  const { palette, numbers } = config;
  const edges = buildTreeEdges();
  ctx.save();

  ctx.strokeStyle = withAlpha(palette.layers[2], 0.75);
  ctx.lineWidth = Math.max(config.dims.width / numbers.ONEFORTYFOUR * 1.6, 2);
  ctx.lineCap = "round";
  edges.forEach(([fromKey, toKey]) => {
    const from = nodes[fromKey];
    const to = nodes[toKey];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  // Vault arch connecting supernal triad, keeps layered depth without motion.
  ctx.strokeStyle = withAlpha(palette.layers[2], 0.4);
  ctx.lineWidth = Math.max(config.dims.width / numbers.ONEFORTYFOUR, 1.5);
  ctx.beginPath();
  const archRadius = Math.abs(nodes.binah.x - nodes.kether.x);
  ctx.arc(nodes.kether.x, nodes.kether.y + archRadius * 0.6, archRadius * 1.12, Math.PI * 1.05, Math.PI * -0.05, true);
  ctx.stroke();

  const nodeRadius = Math.max(config.dims.width / numbers.THIRTYTHREE / 2.8, 8);
  ctx.fillStyle = withAlpha(palette.layers[3], 0.85);
  ctx.strokeStyle = withAlpha(palette.ink, 0.9);
  Object.keys(nodes).forEach(key => {
    const point = nodes[key];
    const radius = key === "daath" ? nodeRadius * 0.6 : nodeRadius;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
  return { nodes: Object.keys(nodes).length, paths: edges.length };
}

function computeTreeNodes(dims, numbers) {
  const marginY = dims.height / numbers.NINE;
  const usableHeight = dims.height - marginY * 2;
  const unitY = usableHeight / numbers.ONEFORTYFOUR;
  const centreX = dims.width / 2;
  const pillarShift = dims.width / numbers.THREE / 1.4;
  return {
    kether: { x: centreX, y: marginY + unitY * 0 },
    chokmah: { x: centreX + pillarShift, y: marginY + unitY * numbers.ELEVEN },
    binah: { x: centreX - pillarShift, y: marginY + unitY * numbers.ELEVEN },
    daath: { x: centreX, y: marginY + unitY * (numbers.TWENTYTWO + numbers.SEVEN) },
    chesed: { x: centreX + pillarShift, y: marginY + unitY * (numbers.THIRTYTHREE + numbers.NINE) },
    geburah: { x: centreX - pillarShift, y: marginY + unitY * (numbers.THIRTYTHREE + numbers.NINE) },
    tiphareth: { x: centreX, y: marginY + unitY * (numbers.THIRTYTHREE + numbers.TWENTYTWO) },
    netzach: { x: centreX + pillarShift, y: marginY + unitY * (numbers.NINETYNINE - numbers.THREE) },
    hod: { x: centreX - pillarShift, y: marginY + unitY * (numbers.NINETYNINE - numbers.THREE) },
    yesod: { x: centreX, y: marginY + unitY * (numbers.ONEFORTYFOUR - numbers.THREE) },
    malkuth: { x: centreX, y: marginY + unitY * numbers.ONEFORTYFOUR }
  };
}

function buildTreeEdges() {
  return [
    ["kether", "chokmah"],
    ["kether", "binah"],
    ["kether", "daath"],
    ["chokmah", "binah"],
    ["chokmah", "daath"],
    ["chokmah", "chesed"],
    ["binah", "daath"],
    ["binah", "geburah"],
    ["daath", "chesed"],
    ["daath", "geburah"],
    ["chesed", "geburah"],
    ["chesed", "tiphareth"],
    ["geburah", "tiphareth"],
    ["chesed", "netzach"],
    ["geburah", "hod"],
    ["netzach", "hod"],
    ["netzach", "yesod"],
    ["hod", "yesod"],
    ["tiphareth", "netzach"],
    ["tiphareth", "hod"],
    ["tiphareth", "yesod"],
    ["yesod", "malkuth"]
  ];
}

function drawFibonacciCurve(ctx, config) {
  const { dims, palette, numbers } = config;
  const fibSeq = buildFibonacci(numbers.ONEFORTYFOUR);
  const phi = (1 + Math.sqrt(5)) / 2;
  const centreX = dims.width * (numbers.TWENTYTWO / numbers.THIRTYTHREE);
  const centreY = dims.height * (numbers.NINE / numbers.TWENTYTWO);
  const targetRadius = Math.min(dims.width, dims.height) / numbers.THREE;
  const growthPerQuarterTurn = Math.log(phi);
  const baseRadius = targetRadius / Math.pow(phi, fibSeq.length - 1);
  const growthPerRadian = growthPerQuarterTurn / (Math.PI / 2);
  const thetaMax = (fibSeq.length - 1) * (Math.PI / 2);
  const steps = numbers.THIRTYTHREE;

  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = thetaMax * (i / steps);
    const radius = baseRadius * Math.exp(growthPerRadian * t);
    points.push({
      x: centreX + Math.cos(t) * radius,
      y: centreY + Math.sin(t) * radius
    });
  }

  ctx.save();
  ctx.strokeStyle = withAlpha(palette.layers[4], 0.85);
  ctx.lineWidth = Math.max(targetRadius / numbers.NINETYNINE, 2);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (points.length > 0) {
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const current = points[i];
      const midX = (prev.x + current.x) / 2;
      const midY = (prev.y + current.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
    }
  }
  ctx.stroke();

  ctx.fillStyle = withAlpha(palette.layers[5], 0.9);
  const markerRadius = Math.max(targetRadius / numbers.THIRTYTHREE, 3);
  fibSeq.forEach((_, index) => {
    const angle = index * (Math.PI / 2);
    const radius = baseRadius * Math.exp(growthPerRadian * angle);
    const px = centreX + Math.cos(angle) * radius;
    const py = centreY + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(px, py, markerRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
  return { fibonacci: fibSeq.length };
}

function buildFibonacci(limit) {
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

function drawHelixLattice(ctx, config) {
  const { dims, palette, numbers } = config;
  const centreX = dims.width / 2;
  const top = dims.height / numbers.NINE;
  const bottom = dims.height - dims.height / numbers.NINE;
  const railSpread = dims.width / numbers.SEVEN;
  const amplitude = railSpread / numbers.ELEVEN;
  const steps = numbers.TWENTYTWO;

  const leftPoints = [];
  const rightPoints = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const y = top + (bottom - top) * t;
    const angle = Math.PI * numbers.THREE * t;
    const offset = Math.sin(angle) * amplitude;
    leftPoints.push({ x: centreX - railSpread / 2 + offset, y });
    rightPoints.push({ x: centreX + railSpread / 2 - offset, y });
  }

  ctx.save();
  ctx.strokeStyle = withAlpha(palette.layers[0], 0.65);
  ctx.lineWidth = Math.max(dims.width / numbers.ONEFORTYFOUR, 2);
  ctx.lineCap = "round";
  tracePolyline(ctx, leftPoints);
  tracePolyline(ctx, rightPoints);

  ctx.strokeStyle = withAlpha(palette.layers[3], 0.55);
  ctx.lineWidth = Math.max(dims.width / numbers.ONEFORTYFOUR, 1.5);
  for (let i = 0; i <= steps; i += 1) {
    if (i % 2 === 0) {
      const left = leftPoints[i];
      const right = rightPoints[i];
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.stroke();
    }
  }

  ctx.fillStyle = withAlpha(palette.layers[5], 0.8);
  const nodeRadius = Math.max(dims.width / numbers.NINETYNINE, 4);
  for (let i = 0; i <= steps; i += 1) {
    const target = i % 2 === 0 ? leftPoints[i] : rightPoints[i];
    ctx.beginPath();
    ctx.arc(target.x, target.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = withAlpha(palette.ink, 0.35);
  ctx.lineWidth = Math.max(dims.width / numbers.ONEFORTYFOUR, 1.2);
  ctx.beginPath();
  ctx.moveTo(centreX - railSpread / 1.8, bottom + nodeRadius * 1.8);
  ctx.lineTo(centreX + railSpread / 1.8, bottom + nodeRadius * 1.8);
  ctx.stroke();

  ctx.restore();
  return { strands: 2, rungs: Math.floor(steps / 2) + 1 };
}

function tracePolyline(ctx, points) {
  if (points.length === 0) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function drawCanvasNotice(ctx, config) {
  const { width, height } = config.dims;
  ctx.save();
  ctx.fillStyle = withAlpha(config.palette.ink, 0.72);
  ctx.font = `${Math.max(width / config.numbers.ONEFORTYFOUR * 3.2, 12)}px/1.2 "Georgia", serif`;
  ctx.textAlign = "center";
  ctx.fillText(config.notice, width / 2, height - height / config.numbers.ELEVEN);
  ctx.restore();
}

function summariseLayers(vesica, tree, fib, helix) {
  return [
    `vesica ${vesica.circles} arcs`,
    `tree ${tree.nodes} nodes/${tree.paths} paths`,
    `fibonacci ${fib.fibonacci} markers`,
    `helix ${helix.rungs} rungs`
  ].join(" · ");
}

function withAlpha(hex, alpha) {
  if (!/^#?[0-9a-fA-F]{6}$/.test(hex)) {
    return hex;
  }
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
