/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)

    4) Double-helix lattice (two phase-shifted strands with lattice rungs)

  Why: encodes layered cosmology with calm colors, zero animation, and clear
  ordering so each stratum can be visually parsed without overwhelm.
*/

export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    throw new Error("renderHelix requires a 2D canvas context.");
  }

  const dims = normaliseDimensions(ctx, options);
  const palette = normalisePalette(options.palette);
  const numbers = normaliseNumbers(options.NUM);

  ctx.save();
  ctx.clearRect(0, 0, dims.width, dims.height);

  paintBackground(ctx, dims, palette);
  drawVesicaField(ctx, dims, palette, numbers);
  drawTreeOfLife(ctx, dims, palette, numbers);
  drawFibonacciCurve(ctx, dims, palette, numbers);
  drawHelixLattice(ctx, dims, palette, numbers);

  ctx.restore();
}

function normaliseDimensions(ctx, options) {
  const width = typeof options.width === "number" ? options.width : ctx.canvas.width;
  const height = typeof options.height === "number" ? options.height : ctx.canvas.height;
  return { width, height };
}

function normalisePalette(rawPalette) {
  const fallback = {
    bg: "#0b0b12",
    ink: "#e8e8f0",
    layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
  };
  if (!rawPalette) {
    return fallback;
  }
  const layers = Array.isArray(rawPalette.layers) && rawPalette.layers.length > 0
    ? rawPalette.layers.slice()
    : fallback.layers.slice();
  return {
    bg: typeof rawPalette.bg === "string" ? rawPalette.bg : fallback.bg,
    ink: typeof rawPalette.ink === "string" ? rawPalette.ink : fallback.ink,

    4) Double-helix lattice (two phase-shifted sinusoids with cross-braces)

  Geometry is parameterised with numerology constants: 3, 7, 9, 11, 22, 33, 99, 144.
  All routines are pure and side-effect free aside from drawing to the provided context.
*/

const DEFAULT_PALETTE = {
  bg: '#0b0b12',
  ink: '#e8e8f0',
  layers: ['#8fb8ff', '#7ae6ff', '#9df5c8', '#ffd493', '#f4aaff', '#d8d8f6']
};

export function renderHelix(ctx, input) {
  const { width, height, palette, NUM, notice } = normaliseConfig(input);
  const dims = { width, height };

  ctx.save();
  clearStage(ctx, dims, palette.bg);

  const vesicaStats = drawVesicaField(ctx, dims, palette.layers[0], palette.layers[1], NUM);
  const treeStats = drawTreeOfLife(ctx, dims, palette.layers[2], palette.layers[1], palette.ink, NUM);
  const fibonacciStats = drawFibonacciCurve(ctx, dims, palette.layers[3], NUM);
  const helixStats = drawHelixLattice(ctx, dims, palette.layers[4], palette.layers[5], palette.ink, NUM);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette.ink, notice);
  }

  ctx.restore();

  return {
    summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats })
  };
}

function normaliseConfig(input) {
  const width = typeof input.width === 'number' ? input.width : 1440;
  const height = typeof input.height === 'number' ? input.height : 900;
  const palette = mergePalette(input.palette || {});
  const NUM = input.NUM || defaultNumerology();
  return { width, height, palette, NUM, notice: input.notice || null };
}

function mergePalette(candidate) {
  const baseLayers = DEFAULT_PALETTE.layers;
  const candidateLayers = Array.isArray(candidate.layers) ? candidate.layers : [];
  const layers = baseLayers.map((fallback, index) => candidateLayers[index] || fallback);
  return {
    bg: candidate.bg || DEFAULT_PALETTE.bg,
    ink: candidate.ink || DEFAULT_PALETTE.ink,

    layers
  };
}


function normaliseNumbers(raw) {
  const fallback = {

function defaultNumerology() {
  return {

    THREE: 3,
    SEVEN: 7,
    NINE: 9,
    ELEVEN: 11,
    TWENTYTWO: 22,
    THIRTYTHREE: 33,
    NINETYNINE: 99,
    ONEFORTYFOUR: 144
  };

  if (!raw) {
    return fallback;
  }
  const result = { ...fallback };
  for (const key of Object.keys(fallback)) {
    if (typeof raw[key] === "number" && Number.isFinite(raw[key])) {
      result[key] = raw[key];
    }
  }
  return result;
}

function paintBackground(ctx, dims, palette) {
  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
  ctx.restore();
}

function drawVesicaField(ctx, dims, palette, NUM) {
  ctx.save();
  ctx.globalAlpha = 0.65; // ND-safe softness keeps layer readable without glare.
  ctx.strokeStyle = getLayerColor(palette, 0, "#b1c7ff");
  ctx.lineWidth = Math.max(1, dims.width / (NUM.ONEFORTYFOUR * 1.8));

  const rows = NUM.SEVEN;
  const cols = NUM.THREE;
  const margin = dims.width / NUM.THIRTYTHREE;
  const innerWidth = dims.width - margin * 2;
  const innerHeight = dims.height - margin * 2;
  const horizontalStep = cols > 1 ? innerWidth / (cols - 1) : 0;
  const verticalStep = rows > 1 ? innerHeight / (rows - 1) : 0;
  const radius = Math.min(horizontalStep, verticalStep) * (NUM.NINE / NUM.TWENTYTWO);
  const offset = radius * (NUM.ELEVEN / NUM.TWENTYTWO);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = margin + col * horizontalStep;
      const cy = margin + row * verticalStep;
      drawVesica(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
}

function drawVesica(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTreeOfLife(ctx, dims, palette, NUM) {
  const nodes = buildTreeNodes(dims, NUM);
  const paths = buildTreePaths();
  const nodeRadius = Math.max(6, dims.width / NUM.NINETYNINE);

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = getLayerColor(palette, 1, "#89f7fe");
  ctx.lineWidth = Math.max(1.2, dims.width / (NUM.ONEFORTYFOUR * 2.5));
  ctx.lineJoin = "round";

  for (const [fromKey, toKey] of paths) {
    const from = nodes[fromKey];
    const to = nodes[toKey];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.fillStyle = getLayerColor(palette, 2, "#a0ffa1");
  for (const key of Object.keys(nodes)) {
    const node = nodes[key];
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function buildTreeNodes(dims, NUM) {
  const top = dims.height / NUM.NINE;
  const span = dims.height * (NUM.SEVEN / NUM.NINE);
  const verticalStep = span / NUM.NINE;
  const centerX = dims.width / 2;
  const columnOffset = dims.width * (NUM.ELEVEN / (NUM.TWENTYTWO * NUM.THREE));
  const two = NUM.TWENTYTWO / NUM.ELEVEN;
  const step = NUM.THREE / two; // 3/2 keeps Tree-of-Life tiers distinct without harsh jumps.
  const three = NUM.THREE;
  const six = two * NUM.THREE;
  const nine = NUM.NINE;
  const y = (multiplier) => top + multiplier * verticalStep;
  return {
    keter: { x: centerX, y: y(0) },
    chokmah: { x: centerX + columnOffset, y: y(step) },
    binah: { x: centerX - columnOffset, y: y(step) },
    chesed: { x: centerX + columnOffset, y: y(three) },
    geburah: { x: centerX - columnOffset, y: y(three) },
    tiferet: { x: centerX, y: y(three + step) },
    netzach: { x: centerX + columnOffset, y: y(six) },
    hod: { x: centerX - columnOffset, y: y(six) },
    yesod: { x: centerX, y: y(six + step) },
    malkuth: { x: centerX, y: y(nine) }
  };
}

function buildTreePaths() {
  // 22 paths echo the Hebrew-letter correspondences in a simplified lattice.
  return [
    ["keter", "chokmah"],
    ["keter", "binah"],
    ["keter", "tiferet"],
    ["chokmah", "binah"],
    ["chokmah", "tiferet"],
    ["chokmah", "chesed"],
    ["binah", "tiferet"],
    ["binah", "geburah"],
    ["chesed", "geburah"],
    ["chesed", "tiferet"],
    ["chesed", "netzach"],
    ["geburah", "tiferet"],
    ["geburah", "hod"],
    ["tiferet", "netzach"],
    ["tiferet", "hod"],
    ["tiferet", "yesod"],
    ["netzach", "hod"],
    ["netzach", "yesod"],
    ["hod", "yesod"],
    ["netzach", "malkuth"],
    ["hod", "malkuth"],
    ["yesod", "malkuth"]
  ];
}

function drawFibonacciCurve(ctx, dims, palette, NUM) {
  const fibNumbers = buildFibonacciSequence(NUM.ONEFORTYFOUR);
  const centerX = dims.width * (NUM.ELEVEN / NUM.TWENTYTWO);
  const centerY = dims.height * (NUM.SEVEN / NUM.ELEVEN);
  const scale = Math.min(dims.width, dims.height) / (NUM.ONEFORTYFOUR * NUM.THREE);
  const startAngle = -Math.PI / 2;

  const points = fibNumbers.map((value, index) => {
    const theta = startAngle + index * (Math.PI / NUM.ELEVEN);
    const radius = value * scale;
    return {
      x: centerX + Math.cos(theta) * radius,
      y: centerY + Math.sin(theta) * radius
    };
  });

  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = getLayerColor(palette, 3, "#ffd27f");
  ctx.lineWidth = Math.max(1.4, dims.width / (NUM.ONEFORTYFOUR * 2.2));
  drawPolyline(ctx, points);
  ctx.restore();
}

function buildFibonacciSequence(limit) {
  const sequence = [1, 1];
  while (sequence[sequence.length - 1] < limit) {
    const next = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    if (next > limit) {
      break;
    }
    sequence.push(next);
  }
  return sequence;
}

function drawHelixLattice(ctx, dims, palette, NUM) {
  // 99 segments yield a smooth helix without requiring animation.
  const segments = NUM.NINETYNINE;
  const centerX = dims.width / 2;
  const top = dims.height * (NUM.THREE / NUM.THIRTYTHREE);
  const bottom = dims.height - top;
  const height = bottom - top;
  const amplitude = dims.width / NUM.SEVEN;
  const phaseShift = Math.PI / NUM.THREE;
  const leftStrand = [];
  const rightStrand = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const y = top + t * height;
    const angle = t * Math.PI * NUM.THREE;
    const offsetPrimary = Math.sin(angle) * amplitude;
    const offsetSecondary = Math.sin(angle + phaseShift) * amplitude * (NUM.NINE / NUM.ELEVEN);
    leftStrand.push({ x: centerX - offsetPrimary, y });
    rightStrand.push({ x: centerX + offsetSecondary, y });
  }

  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = getLayerColor(palette, 4, "#f5a3ff");
  ctx.lineWidth = Math.max(1.2, dims.width / (NUM.ONEFORTYFOUR * 2.8));
  drawPolyline(ctx, leftStrand);

  ctx.strokeStyle = getLayerColor(palette, 5, "#d0d0e6");
  drawPolyline(ctx, rightStrand);

  const rungInterval = Math.max(3, Math.floor(segments / NUM.ELEVEN));
  ctx.strokeStyle = getLayerColor(palette, 2, "#a0ffa1");
  ctx.lineWidth = Math.max(1, dims.width / (NUM.ONEFORTYFOUR * 3));
  for (let i = 0; i <= segments; i += rungInterval) {
    const left = leftStrand[i];
    const right = rightStrand[i];
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPolyline(ctx, points) {
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

function getLayerColor(palette, index, fallback) {
  const layers = palette.layers;
  if (!layers || layers.length === 0) {
    return fallback;
  }
  return layers[index % layers.length] || fallback;

}

function clearStage(ctx, dims, background) {
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

function drawVesicaField(ctx, dims, primary, accent, NUM) {
  // Layer 1: vesica piscis grid with soft strokes to keep ND-safe focus.
  const centerX = dims.width / 2;
  const centerY = dims.height / 2;
  const radius = Math.min(dims.width, dims.height) / NUM.THREE;
  const offset = radius * 0.72;

  withContext(ctx, (context) => {
    context.lineWidth = 2.2;
    context.strokeStyle = applyAlpha(primary, 0.65);
    context.beginPath();
    context.arc(centerX - offset, centerY, radius, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(centerX + offset, centerY, radius, 0, Math.PI * 2);
    context.stroke();
  });

  const rings = NUM.NINE;
  for (let i = 1; i <= rings; i += 1) {
    const scale = 1 - i / (rings + NUM.ELEVEN / NUM.THIRTYTHREE);
    const ringRadius = radius * scale;
    const alpha = 0.12 + (0.6 * (rings - i)) / rings;
    withContext(ctx, (context) => {
      context.lineWidth = 1.2;
      context.strokeStyle = applyAlpha(accent, alpha);
      context.beginPath();
      context.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      context.stroke();
    });
  }

  // Use 22 petals to echo the tarot paths while keeping geometry static.
  const petals = NUM.TWENTYTWO;
  for (let i = 0; i < petals; i += 1) {
    const angle = (Math.PI * 2 * i) / petals;
    const x = centerX + Math.cos(angle) * offset;
    const y = centerY + Math.sin(angle) * (offset * 0.6);
    withContext(ctx, (context) => {
      context.fillStyle = applyAlpha(primary, 0.08);
      context.beginPath();
      context.ellipse(x, y, radius * 0.32, radius * 0.12, angle, 0, Math.PI * 2);
      context.fill();
    });
  }

  return { circles: rings + 2, petals };
}

function drawTreeOfLife(ctx, dims, nodeColor, pathColor, inkColor, NUM) {
  // Layer 2: simplified Tree-of-Life using 10 nodes and 22 luminous paths.
  const nodes = createTreeNodes(dims, NUM);
  const paths = createTreePaths();

  withContext(ctx, (context) => {
    context.strokeStyle = applyAlpha(pathColor, 0.45);
    context.lineWidth = 2;
    context.lineCap = 'round';
    paths.forEach(([from, to]) => {
      const a = nodes[from];
      const b = nodes[to];
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
    });
  });

  withContext(ctx, (context) => {
    context.fillStyle = applyAlpha(nodeColor, 0.78);
    context.strokeStyle = applyAlpha(inkColor, 0.6);
    context.lineWidth = 1.5;
    nodes.forEach((node) => {
      context.beginPath();
      context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    });
  });

  return { nodes: nodes.length, paths: paths.length };
}

function createTreeNodes(dims, NUM) {
  // Geometry uses numerology spacing to keep ratios gentle yet precise.
  const marginTop = dims.height / NUM.NINE;
  const marginBottom = dims.height / NUM.ELEVEN;
  const usableHeight = dims.height - marginTop - marginBottom;
  const stepY = usableHeight / NUM.NINE;
  const xPositions = {
    farLeft: dims.width * 0.32,
    midLeft: dims.width * 0.42,
    center: dims.width * 0.5,
    midRight: dims.width * 0.58,
    farRight: dims.width * 0.68
  };
  const radius = Math.min(dims.width, dims.height) / NUM.ONEFORTYFOUR * NUM.THREE;

  return [
    { name: 'Kether', x: xPositions.center, y: marginTop, radius },
    { name: 'Chokhmah', x: xPositions.farRight, y: marginTop + stepY, radius },
    { name: 'Binah', x: xPositions.farLeft, y: marginTop + stepY, radius },
    { name: 'Chesed', x: xPositions.midRight, y: marginTop + stepY * 3, radius },
    { name: 'Geburah', x: xPositions.midLeft, y: marginTop + stepY * 3, radius },
    { name: 'Tiphareth', x: xPositions.center, y: marginTop + stepY * 4.5, radius },
    { name: 'Netzach', x: xPositions.midRight, y: marginTop + stepY * 6, radius },
    { name: 'Hod', x: xPositions.midLeft, y: marginTop + stepY * 6, radius },
    { name: 'Yesod', x: xPositions.center, y: marginTop + stepY * 7.5, radius },
    { name: 'Malkuth', x: xPositions.center, y: marginTop + stepY * 9, radius }
  ];
}

function createTreePaths() {
  return [
    [0, 1], [0, 2], [1, 2], [1, 3], [2, 4],
    [3, 5], [4, 5], [3, 6], [4, 7], [5, 6],
    [5, 7], [6, 8], [7, 8], [8, 9], [3, 4],
    [1, 4], [2, 3], [0, 5], [1, 5], [2, 5],
    [6, 9], [7, 9]
  ];
}

function drawFibonacciCurve(ctx, dims, color, NUM) {
  // Layer 3: static Fibonacci-inspired curve following a log-spiral trace.
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.TWENTYTWO;
  const baseRadius = Math.min(dims.width, dims.height) / NUM.THIRTYTHREE;
  const center = { x: dims.width * 0.24, y: dims.height * 0.6 };
  const points = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = -Math.PI / NUM.THREE + t * Math.PI * NUM.THREE;
    const radius = Math.min(baseRadius * Math.pow(phi, t * NUM.SEVEN), dims.width / NUM.THREE);
    points.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    });
  }

  withContext(ctx, (context) => {
    context.strokeStyle = applyAlpha(color, 0.75);
    context.lineWidth = 2.4;
    context.lineCap = 'round';
    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();
  });

  // Place three markers to honour the trinity without adding motion.
  const markers = NUM.THREE;
  for (let i = 0; i < markers; i += 1) {
    const idx = Math.floor((points.length - 1) * ((i + 1) / (markers + 1)));
    const point = points[idx];
    withContext(ctx, (context) => {
      context.fillStyle = applyAlpha(color, 0.35);
      context.beginPath();
      context.arc(point.x, point.y, Math.max(4, dims.width / NUM.ONEFORTYFOUR), 0, Math.PI * 2);
      context.fill();
    });
  }

  return { points: points.length };
}

function drawHelixLattice(ctx, dims, colorA, colorB, inkColor, NUM) {
  // Layer 4: double helix rendered as paired sinusoids with cross-braces.
  const segments = NUM.ONEFORTYFOUR;
  const amplitude = dims.height / NUM.THREE * 0.28;
  const baseY = dims.height / 2;
  const turns = NUM.THREE;

  const railA = [];
  const railB = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const angle = t * Math.PI * turns;
    const x = t * dims.width;
    railA.push({ x, y: baseY + Math.sin(angle) * amplitude });
    railB.push({ x, y: baseY + Math.sin(angle + Math.PI) * amplitude });
  }

  drawRail(ctx, railA, colorA);
  drawRail(ctx, railB, colorB);

  // Cross braces reference the 22 paths; lattice stays static for ND safety.
  const braces = NUM.TWENTYTWO;
  for (let i = 0; i <= braces; i += 1) {
    const idx = Math.floor((railA.length - 1) * (i / braces));
    const a = railA[idx];
    const b = railB[idx];
    withContext(ctx, (context) => {
      context.strokeStyle = applyAlpha(inkColor, 0.25);
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
    });
  }

  return { rails: 2, braces: braces + 1 };
}

function drawRail(ctx, points, color) {
  withContext(ctx, (context) => {
    context.strokeStyle = applyAlpha(color, 0.65);
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();
  });
}

function drawCanvasNotice(ctx, dims, color, message) {
  withContext(ctx, (context) => {
    context.fillStyle = applyAlpha(color, 0.75);
    context.font = `${Math.max(12, dims.width / 90)}px/1.4 system-ui, sans-serif`;
    context.textAlign = 'right';
    context.textBaseline = 'bottom';
    const padding = 24;
    context.fillText(message, dims.width - padding, dims.height - padding);
  });
}

function summariseLayers(stats) {
  const parts = [
    `Vesica field ${stats.vesicaStats.circles} rings`,
    `Tree paths ${stats.treeStats.paths}`,
    `Fibonacci points ${stats.fibonacciStats.points}`,
    `Helix braces ${stats.helixStats.braces}`
  ];
  return `Layers rendered: ${parts.join(', ')}.`;
}

function withContext(ctx, fn) {
  ctx.save();
  try {
    fn(ctx);
  } finally {
    ctx.restore();
  }
}

function applyAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;
  const intValue = parseInt(value, 16);
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255
  };

}
