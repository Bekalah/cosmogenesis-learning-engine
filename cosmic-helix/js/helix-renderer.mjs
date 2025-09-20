/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (back to front):
    1) Vesica field — intersecting circles hold the womb-of-forms grid.
    2) Tree-of-Life scaffold — ten sephirot and twenty-two calm paths.
    3) Fibonacci curve — logarithmic spiral sampled over 144 points.
    4) Double-helix lattice — two still strands with thirty-three ties.

  Why: the covenant avoids motion, preserves layered depth, and keeps
  numerology constants (3, 7, 9, 11, 22, 33, 99, 144) steering the spacing.
  Every helper is pure so a single call paints the full scene offline.
*/

const DEFAULT_PALETTE = Object.freeze({
  bg: '#0b0b12',
  ink: '#e8e8f0',
  muted: '#a6a6c1',
  layers: ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6']
});

const DEFAULT_NUM = Object.freeze({
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
});

const DEFAULT_GEOMETRY = Object.freeze({
  vesica: {
    rows: DEFAULT_NUM.NINE,
    columns: DEFAULT_NUM.ELEVEN,
    paddingDivisor: DEFAULT_NUM.ELEVEN,
    radiusFactor: DEFAULT_NUM.SEVEN / DEFAULT_NUM.THREE,
    strokeDivisor: DEFAULT_NUM.NINETYNINE,
    alpha: 0.55
  },
  treeOfLife: {
    marginDivisor: DEFAULT_NUM.ELEVEN,
    radiusDivisor: DEFAULT_NUM.THIRTYTHREE,
    labelOffset: -DEFAULT_NUM.TWENTYTWO,
    labelLineHeight: 14,
    labelFont: '12px system-ui, -apple-system, Segoe UI, sans-serif',
    nodes: [
      { id: 'kether', title: 'Kether', meaning: 'Crown', level: 0, xFactor: 0.5 },
      { id: 'chokmah', title: 'Chokmah', meaning: 'Wisdom', level: 1, xFactor: 0.72 },
      { id: 'binah', title: 'Binah', meaning: 'Understanding', level: 1, xFactor: 0.28 },
      { id: 'chesed', title: 'Chesed', meaning: 'Mercy', level: 2, xFactor: 0.68 },
      { id: 'geburah', title: 'Geburah', meaning: 'Severity', level: 2, xFactor: 0.32 },
      { id: 'tiphareth', title: 'Tiphareth', meaning: 'Beauty', level: 3, xFactor: 0.5 },
      { id: 'netzach', title: 'Netzach', meaning: 'Victory', level: 4, xFactor: 0.66 },
      { id: 'hod', title: 'Hod', meaning: 'Glory', level: 4, xFactor: 0.34 },
      { id: 'yesod', title: 'Yesod', meaning: 'Foundation', level: 5, xFactor: 0.5 },
      { id: 'malkuth', title: 'Malkuth', meaning: 'Kingdom', level: 6, xFactor: 0.5 }
    ],
    edges: [
      ['kether', 'chokmah'],
      ['kether', 'binah'],
      ['kether', 'tiphareth'],
      ['chokmah', 'binah'],
      ['chokmah', 'chesed'],
      ['chokmah', 'tiphareth'],
      ['chokmah', 'netzach'],
      ['binah', 'geburah'],
      ['binah', 'tiphareth'],
      ['binah', 'hod'],
      ['chesed', 'geburah'],
      ['chesed', 'tiphareth'],
      ['chesed', 'netzach'],
      ['geburah', 'tiphareth'],
      ['geburah', 'hod'],
      ['tiphareth', 'netzach'],
      ['tiphareth', 'hod'],
      ['tiphareth', 'yesod'],
      ['netzach', 'hod'],
      ['netzach', 'yesod'],
      ['hod', 'yesod'],
      ['yesod', 'malkuth']
    ]
  },
  fibonacci: {
    sampleCount: DEFAULT_NUM.ONEFORTYFOUR,
    turns: DEFAULT_NUM.THREE,
    baseRadiusDivisor: DEFAULT_NUM.THREE,
    phi: 1.618033988749895,
    alpha: 0.88
  },
  helix: {
    sampleCount: DEFAULT_NUM.ONEFORTYFOUR,
    cycles: DEFAULT_NUM.THREE,
    amplitudeDivisor: DEFAULT_NUM.THREE,
    phaseOffset: Math.PI,
    crossTieCount: DEFAULT_NUM.THIRTYTHREE,
    strandAlpha: 0.85,
    rungAlpha: 0.6
  }
});

/**
 * Render the cosmic helix composition once. Keeps ND-safe guarantees:
 * calm palette, layered depth, and zero animation.
 *
 * @param {CanvasRenderingContext2D} ctx Canvas 2D context.
 * @param {object} [options] Rendering options.
 * @param {number} [options.width] Optional width override.
 * @param {number} [options.height] Optional height override.
 * @param {object} [options.palette] Palette overrides.
 * @param {object} [options.NUM] Numerology overrides.
 * @param {object} [options.geometry] Geometry overrides.
 * @param {string} [options.notice] Optional notice to draw.
 * @returns {{ok: true, numerology: object}|{ok: false, reason: string}}
 */
export function renderHelix(ctx, options = {}) {
  if (!ctx || !ctx.canvas) {
    return { ok: false, reason: 'missing-context' };
  }

  const dims = normaliseDimensions(ctx, options);
  if (!dims) {
    return { ok: false, reason: 'invalid-dimensions' };
  }

  const palette = mergePalette(options.palette);
  const numerology = mergeNumerology(options.NUM);
  const geometry = mergeGeometry(options.geometry);
  const notice = typeof options.notice === 'string' ? options.notice.trim() : '';

  ctx.save();
  clearStage(ctx, dims, palette.bg);

  drawVesicaField(ctx, dims, palette.layers[0], numerology, geometry.vesica);
  drawTreeOfLife(ctx, dims, palette, numerology, geometry.treeOfLife);
  drawFibonacciCurve(ctx, dims, palette.layers[3], numerology, geometry.fibonacci);
  drawHelixLattice(ctx, dims, palette, numerology, geometry.helix);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette, notice);
  }

  ctx.restore();
  return { ok: true, numerology };
}

function normaliseDimensions(ctx, options) {
  const fallbackWidth = Number(ctx.canvas.width);
  const fallbackHeight = Number(ctx.canvas.height);
  const width = toPositiveNumber(options.width, fallbackWidth);
  const height = toPositiveNumber(options.height, fallbackHeight);
  if (!(width > 0 && height > 0)) {
    return null;
  }
  return { width, height };
}

function mergePalette(candidate = {}) {
  const sourceLayers = Array.isArray(candidate.layers) ? candidate.layers : [];
  const layers = DEFAULT_PALETTE.layers.map((color, index) => {
    return typeof sourceLayers[index] === 'string' ? sourceLayers[index] : color;
  });
  return {
    bg: typeof candidate.bg === 'string' ? candidate.bg : DEFAULT_PALETTE.bg,
    ink: typeof candidate.ink === 'string' ? candidate.ink : DEFAULT_PALETTE.ink,
    muted: typeof candidate.muted === 'string' ? candidate.muted : DEFAULT_PALETTE.muted,
    layers
  };
}

function mergeNumerology(candidate = {}) {
  const merged = {};
  for (const key of Object.keys(DEFAULT_NUM)) {
    const value = toPositiveNumber(candidate[key], DEFAULT_NUM[key]);
    merged[key] = value;
  }
  return merged;
}

function mergeGeometry(candidate = {}) {
  return {
    vesica: mergeVesica(candidate.vesica),
    treeOfLife: mergeTree(candidate.treeOfLife),
    fibonacci: mergeFibonacci(candidate.fibonacci),
    helix: mergeHelix(candidate.helix)
  };
}

function mergeVesica(input = {}) {
  const base = DEFAULT_GEOMETRY.vesica;
  return {
    rows: toPositiveInteger(input.rows, base.rows),
    columns: toPositiveInteger(input.columns, base.columns),
    paddingDivisor: toPositiveNumber(input.paddingDivisor, base.paddingDivisor),
    radiusFactor: toPositiveNumber(input.radiusFactor, base.radiusFactor),
    strokeDivisor: toPositiveNumber(input.strokeDivisor, base.strokeDivisor),
    alpha: clampAlpha(input.alpha, base.alpha)
  };
}

function mergeTree(input = {}) {
  const base = DEFAULT_GEOMETRY.treeOfLife;
  const nodes = Array.isArray(input.nodes) && input.nodes.length > 0 ? input.nodes : base.nodes;
  const mergedNodes = nodes.map((node, index) => {
    const template = base.nodes[index % base.nodes.length];
    return {
      id: typeof node.id === 'string' && node.id.trim() ? node.id.trim() : template.id,
      title: typeof node.title === 'string' && node.title.trim() ? node.title.trim() : template.title,
      meaning: typeof node.meaning === 'string' && node.meaning.trim() ? node.meaning.trim() : template.meaning,
      level: toFiniteNumber(node.level, template.level),
      xFactor: clamp01(typeof node.xFactor === 'number' ? node.xFactor : template.xFactor)
    };
  });

  const nodeIds = new Set(mergedNodes.map(node => node.id));
  const edges = Array.isArray(input.edges) && input.edges.length > 0 ? input.edges : base.edges;
  const mergedEdges = edges
    .filter(edge => Array.isArray(edge) && edge.length === 2)
    .map(edge => [String(edge[0]), String(edge[1])])
    .filter(edge => nodeIds.has(edge[0]) && nodeIds.has(edge[1]));

  return {
    marginDivisor: toPositiveNumber(input.marginDivisor, base.marginDivisor),
    radiusDivisor: toPositiveNumber(input.radiusDivisor, base.radiusDivisor),
    labelOffset: toFiniteNumber(input.labelOffset, base.labelOffset),
    labelLineHeight: toPositiveNumber(input.labelLineHeight, base.labelLineHeight),
    labelFont: typeof input.labelFont === 'string' && input.labelFont.trim() ? input.labelFont.trim() : base.labelFont,
    nodes: mergedNodes,
    edges: mergedEdges
  };
}

function mergeFibonacci(input = {}) {
  const base = DEFAULT_GEOMETRY.fibonacci;
  return {
    sampleCount: toPositiveInteger(input.sampleCount, base.sampleCount),
    turns: toPositiveNumber(input.turns, base.turns),
    baseRadiusDivisor: toPositiveNumber(input.baseRadiusDivisor, base.baseRadiusDivisor),
    phi: toPositiveNumber(input.phi, base.phi),
    alpha: clampAlpha(input.alpha, base.alpha)
  };
}

function mergeHelix(input = {}) {
  const base = DEFAULT_GEOMETRY.helix;
  return {
    sampleCount: toPositiveInteger(input.sampleCount, base.sampleCount),
    cycles: toPositiveNumber(input.cycles, base.cycles),
    amplitudeDivisor: toPositiveNumber(input.amplitudeDivisor, base.amplitudeDivisor),
    phaseOffset: typeof input.phaseOffset === 'number' ? input.phaseOffset : base.phaseOffset,
    crossTieCount: toPositiveInteger(input.crossTieCount, base.crossTieCount),
    strandAlpha: clampAlpha(input.strandAlpha, base.strandAlpha),
    rungAlpha: clampAlpha(input.rungAlpha, base.rungAlpha)
  };
}

function clearStage(ctx, dims, color) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

function drawVesicaField(ctx, dims, color, NUM, config) {
  const padding = Math.min(dims.width, dims.height) / config.paddingDivisor;
  const gridWidth = dims.width - padding * 2;
  const gridHeight = dims.height - padding * 2;
  const columns = Math.max(1, config.columns);
  const rows = Math.max(1, config.rows);
  const colSpacing = columns > 1 ? gridWidth / (columns - 1) : gridWidth;
  const rowSpacing = rows > 1 ? gridHeight / (rows - 1) : gridHeight;
  const radius = Math.min(colSpacing, rowSpacing) / config.radiusFactor;
  const strokeWidth = Math.max(radius / config.strokeDivisor, radius / NUM.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.globalAlpha = config.alpha;

  for (let row = 0; row < rows; row += 1) {
    const y = padding + row * rowSpacing;
    const offset = row % 2 === 0 ? 0 : colSpacing / 2;
    for (let col = 0; col < columns; col += 1) {
      const x = padding + col * colSpacing + offset;
      if (x < padding - radius || x > dims.width - padding + radius) {
        continue;
      }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, dims, palette, NUM, config) {
  const margin = Math.min(dims.width, dims.height) / config.marginDivisor;
  const usableWidth = dims.width - margin * 2;
  const usableHeight = dims.height - margin * 2;
  const maxLevel = Math.max(...config.nodes.map(node => node.level));
  const levelSpacing = maxLevel > 0 ? usableHeight / maxLevel : 0;
  const radius = Math.max(Math.min(usableWidth, usableHeight) / config.radiusDivisor, 1);

  const positions = new Map();
  for (const node of config.nodes) {
    const x = margin + clamp01(node.xFactor) * usableWidth;
    const y = margin + node.level * levelSpacing;
    positions.set(node.id, { x, y, node });
  }

  ctx.save();
  ctx.lineCap = 'round';

  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = palette.layers[1] || palette.ink;
  ctx.lineWidth = Math.max(radius / NUM.THREE, 1);
  for (const edge of config.edges) {
    const from = positions.get(edge[0]);
    const to = positions.get(edge[1]);
    if (!from || !to) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = palette.layers[2] || palette.ink;
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(radius / NUM.SEVEN, 1);
  for (const { x, y, node } of positions.values()) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = palette.muted || palette.ink;
  ctx.font = config.labelFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (const { x, y, node } of positions.values()) {
    const labelY = y + config.labelOffset;
    ctx.fillText(node.title, x, labelY);
    if (node.meaning) {
      ctx.fillText(node.meaning, x, labelY + config.labelLineHeight);
    }
  }

  ctx.restore();
}

function drawFibonacciCurve(ctx, dims, color, NUM, config) {
  const samples = Math.max(2, config.sampleCount);
  const turns = Math.max(0.1, config.turns);
  const centerX = dims.width / 2;
  const centerY = dims.height / 2;
  const baseRadius = Math.min(dims.width, dims.height) / config.baseRadiusDivisor;
  const maxRadius = Math.min(dims.width, dims.height) / 2.2;
  const phiSpan = Math.pow(config.phi, turns);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(baseRadius / NUM.NINETYNINE, 1);
  ctx.globalAlpha = config.alpha;
  ctx.beginPath();

  for (let i = 0; i < samples; i += 1) {
    const t = i / (samples - 1);
    const angle = t * turns * Math.PI * 2;
    const golden = Math.pow(config.phi, t * turns);
    const ratio = phiSpan > 1 ? (golden - 1) / (phiSpan - 1) : t;
    const radius = baseRadius + (maxRadius - baseRadius) * ratio;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();
}

function drawHelixLattice(ctx, dims, palette, NUM, config) {
  const samples = Math.max(2, config.sampleCount);
  const width = dims.width;
  const height = dims.height;
  const amplitude = Math.min(width, height) / config.amplitudeDivisor;
  const centerY = height / 2;
  const strandColorA = palette.layers[4] || palette.ink;
  const strandColorB = palette.layers[5] || palette.ink;

  const strandA = [];
  const strandB = [];
  for (let i = 0; i < samples; i += 1) {
    const t = i / (samples - 1);
    const x = t * width;
    const angle = t * config.cycles * Math.PI * 2;
    const yA = centerY + Math.sin(angle) * amplitude * 0.5;
    const yB = centerY + Math.sin(angle + config.phaseOffset) * amplitude * 0.5;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.save();
  ctx.globalAlpha = config.strandAlpha;
  ctx.lineWidth = Math.max(amplitude / NUM.NINETYNINE * 2, 1);
  traceStrand(ctx, strandA, strandColorA);
  traceStrand(ctx, strandB, strandColorB);

  ctx.globalAlpha = config.rungAlpha;
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(amplitude / NUM.TWENTYTWO, 1);
  const ties = Math.max(1, config.crossTieCount);
  for (let i = 0; i < ties; i += 1) {
    const t = ties === 1 ? 0.5 : i / (ties - 1);
    const index = Math.min(strandA.length - 1, Math.round(t * (strandA.length - 1)));
    const a = strandA[index];
    const b = strandB[index];
    if (!a || !b) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function traceStrand(ctx, points, color) {
  if (points.length === 0) {
    return;
  }
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function drawCanvasNotice(ctx, dims, palette, notice) {
  ctx.save();
  ctx.fillStyle = palette.muted || palette.ink;
  ctx.globalAlpha = 0.9;
  ctx.font = '13px system-ui, -apple-system, Segoe UI, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText(notice, dims.width * 0.04, dims.height - dims.height / DEFAULT_NUM.THIRTYTHREE);
  ctx.restore();
}

function toPositiveNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

function toPositiveInteger(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.round(num) : fallback;
}

function toFiniteNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clampAlpha(value, fallback) {
  if (typeof value === 'number' && value >= 0 && value <= 1) {
    return value;
  }
  return fallback;
}

function clamp01(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}
