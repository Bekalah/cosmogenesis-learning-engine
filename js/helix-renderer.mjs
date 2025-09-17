/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
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
