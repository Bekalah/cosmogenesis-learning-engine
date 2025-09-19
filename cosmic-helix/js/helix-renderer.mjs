/*
  helix-renderer.mjs

  Offline ND-safe renderer for the Cosmic Helix canvas.

  Layer order (back to front):
    1) Vesica field - intersecting circles grounding the vesica piscis grid.
    2) Tree-of-Life scaffold - ten sephirot nodes with twenty-two calm paths.
    3) Fibonacci curve - static logarithmic spiral sampled from the Fibonacci family.
    4) Double-helix lattice - two phase-shifted strands tied by gentle rungs.

  Why this structure:
    - Zero animation: everything renders in one pass to preserve ND-safe pacing.
    - Layer separation keeps sacred geometry three-dimensional instead of flattened.
    - Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) shape spacing and sampling.
    - Pure helper functions keep the module portable for offline review.
*/

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"],
};

const DEFAULT_NUMBERS = {


  ND-safe static renderer for the four-layer cosmic helix.
  The helpers are pure and sequenced so the canvas paints once without motion.
  Layer order (back to front):
    1) Vesica field - intersecting circles establish the womb-of-forms grid.
    2) Tree-of-Life scaffold - ten sephirot and twenty-two paths anchor lineage.
    3) Fibonacci curve - logarithmic spiral sampling the golden ratio for growth.
    4) Double-helix lattice - static sine strands with calm cross ties.

  Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) parameterise spacing so
  sacred ratios remain readable without animation (why: respects covenant).
*/

const DEFAULT_N
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,

  ONEFORTYFOUR: 144,
};

const DEFAULT_GEOMETRY = {
  vesica: {
    rows: 9,
    columns: 11,
    paddingDivisor: 11,
    radiusFactor: 1.5,
    strokeDivisor: 99,
    alpha: 0.6,

  ONEFORTYFOUR: 144
});

const FALLBACK_PALETTE = Object.freeze({
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
});

const FALLBACK_GEOMETRY = {
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
    labelFont: "12px system-ui, -apple-system, Segoe UI, sans-serif",
    nodes: [
      { id: "kether", title: "Kether", level: 0, xFactor: 0.5 },
      { id: "chokmah", title: "Chokmah", level: 1, xFactor: 0.7 },
      { id: "binah", title: "Binah", level: 1, xFactor: 0.3 },
      { id: "chesed", title: "Chesed", level: 2, xFactor: 0.68 },
      { id: "geburah", title: "Geburah", level: 2, xFactor: 0.32 },
      { id: "tiphareth", title: "Tiphareth", level: 3, xFactor: 0.5 },
      { id: "netzach", title: "Netzach", level: 4, xFactor: 0.66 },
      { id: "hod", title: "Hod", level: 4, xFactor: 0.34 },
      { id: "yesod", title: "Yesod", level: 5, xFactor: 0.5 },
      { id: "malkuth", title: "Malkuth", level: 6, xFactor: 0.5 },

      { id: "kether", title: "Kether", meaning: "Crown", level: 0, xFactor: 0.5 },
      { id: "chokmah", title: "Chokmah", meaning: "Wisdom", level: 1, xFactor: 0.72 },
      { id: "binah", title: "Binah", meaning: "Understanding", level: 1, xFactor: 0.28 },
      { id: "chesed", title: "Chesed", meaning: "Mercy", level: 2, xFactor: 0.68 },
      { id: "geburah", title: "Geburah", meaning: "Severity", level: 2, xFactor: 0.32 },
      { id: "tiphareth", title: "Tiphareth", meaning: "Beauty", level: 3, xFactor: 0.5 },
      { id: "netzach", title: "Netzach", meaning: "Victory", level: 4, xFactor: 0.7 },
      { id: "hod", title: "Hod", meaning: "Glory", level: 4, xFactor: 0.3 },
      { id: "yesod", title: "Yesod", meaning: "Foundation", level: 5, xFactor: 0.5 },
      { id: "malkuth", title: "Malkuth", meaning: "Kingdom", level: 6, xFactor: 0.5 }

    ],
    edges: [
      ["kether", "chokmah"],
      ["kether", "binah"],
      ["kether", "tiphareth"],
      ["chokmah", "binah"],
      ["chokmah", "tiphareth"],
      ["chokmah", "chesed"],
      ["chokmah", "netzach"],
      ["binah", "tiphareth"],
      ["binah", "geburah"],
      ["binah", "hod"],
      ["chesed", "geburah"],
      ["chesed", "tiphareth"],
      ["chesed", "netzach"],
      ["geburah", "tiphareth"],
      ["geburah", "hod"],
      ["tiphareth", "netzach"],
      ["tiphareth", "hod"],
      ["tiphareth", "yesod"],
      ["netzach", "hod"],
      ["netzach", "yesod"],
      ["hod", "yesod"],
      ["yesod", "malkuth"],
    ],
  },
  fibonacci: {
    sampleCount: DEFAULT_NUM.ONEFORTYFOUR,
    turns: DEFAULT_NUM.THREE,
    baseRadiusDivisor: DEFAULT_NUM.THREE,
    phi: 1.618033988749895,

    alpha: 0.85,

    alpha: 0.88

  },
  helix: {
    sampleCount: DEFAULT_NUM.ONEFORTYFOUR,
    cycles: DEFAULT_NUM.THREE,
    amplitudeDivisor: DEFAULT_NUM.THREE,
    phaseOffset: 180,

    crossTieCount: 33,
    strandAlpha: 0.85,
    rungAlpha: 0.6,
  },

    crossTieCount: DEFAULT_NUM.THIRTYTHREE,
    strandAlpha: 0.82,
    rungAlpha: 0.65
  }

};

export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    return { ok: false, reason: "missing-context" };
  }

  const dims = normaliseDimensions(ctx, options);
  const palette = mergePalette(options.palette);
  const numbers = mergeNumbers(options.NUM);
  const geometry = mergeGeometry(options.geometry);
  const notice =
    typeof options.notice === "string" && options.notice.trim()
      ? options.notice.trim()
      : "";

  ctx.save();

  clearStage(ctx, dims, palette.bg);

  const vesicaStats = drawVesicaField(
    ctx,
    dims,
    palette.layers[0],
    numbers,
    geometry.vesica,
  );
  const treeStats = drawTreeOfLife(
    ctx,
    dims,
    palette,
    numbers,
    geometry.treeOfLife,
  );
  const fibonacciStats = drawFibonacciCurve(
    ctx,
    dims,
    palette.layers[3],
    numbers,
    geometry.fibonacci,
  );
  const helixStats = drawHelixLattice(
    ctx,
    dims,
    palette,
    numbers,
    geometry.helix,
  );

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  fillBackground(ctx, width, height, palette.bg);

  // Layered sequencing preserves depth without motion (why: ND-safe covenant).
  drawVesicaField(ctx, width, height, palette.layers[0], numerology, geometry.vesica);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], palette.ink, numerology, geometry.treeOfLife);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], numerology, geometry.fibonacci);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], numerology, geometry.helix);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette.ink, notice);
  }

  ctx.restore();

  return { ok: true, numerology };
}

  return {
    
    ok: true,
    summary: summariseLayers({
      vesicaStats,
      treeStats,
      fibonacciStats,
      helixStats,
    }),
  };
}

function normaliseDimensions(ctx, options) {
  const width = toPositiveNumber(options.width, ctx.canvas.width);
  const height = toPositiveNumber(options.height, ctx.canvas.height);
  return { width, height };
}

function mergePalette(candidate = {}) {
  const layers = Array.isArray(candidate.layers)
    ? candidate.layers.slice(0, DEFAULT_PALETTE.layers.length)
    : [];
  while (layers.length < DEFAULT_PALETTE.layers.length) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }
  return {

    bg: typeof candidate.bg === "string" ? candidate.bg : DEFAULT_PALETTE.bg,
    ink:
      typeof candidate.ink === "string" ? candidate.ink : DEFAULT_PALETTE.ink,
    muted:
      typeof candidate.muted === "string"
        ? candidate.muted
        : DEFAULT_PALETTE.muted,
    layers,

    bg: palette.bg,
    ink: palette.ink,
    muted: palette.muted,
    layers: palette.layers.slice()

  };
}

function mergeNumbers(candidate = {}) {
  const merged = { ...DEFAULT_NUMBERS };
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    const value = candidate[key];
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      merged[key] = value;
    }
  }
  return merged;
}

function mergeGeometry(candidate = {}) {
  return {
    vesica: mergeVesica(candidate.vesica),
    treeOfLife: mergeTree(candidate.treeOfLife),
    fibonacci: mergeFibonacci(candidate.fibonacci),
    helix: mergeHelix(candidate.helix),
  };
}

function mergeVesica(config = {}) {
  const base = DEFAULT_GEOMETRY.vesica;
  return {
    rows: toPositiveInteger(config.rows, base.rows),
    columns: toPositiveInteger(config.columns, base.columns),
    paddingDivisor: toPositiveNumber(
      config.paddingDivisor,
      base.paddingDivisor,
    ),
    radiusFactor: toPositiveNumber(config.radiusFactor, base.radiusFactor),
    strokeDivisor: toPositiveNumber(config.strokeDivisor, base.strokeDivisor),
    alpha: clampAlpha(config.alpha, base.alpha),
  };
}


function mergeTree(config = {}) {
  const base = DEFAULT_GEOMETRY.treeOfLife;
  const nodes =
    Array.isArray(config.nodes) && config.nodes.length > 0
      ? config.nodes
      : base.nodes;
  const safeNodes = nodes.map((node, index) => {
    const reference = base.nodes[index % base.nodes.length];
    const data = typeof node === "object" && node !== null ? node : {};
    return {
      id: typeof data.id === "string" && data.id ? data.id : reference.id,
      title:
        typeof data.title === "string" && data.title
          ? data.title
          : reference.title,
      level: Number.isFinite(data.level) ? data.level : reference.level,
      xFactor: clamp01(
        Number.isFinite(data.xFactor) ? data.xFactor : reference.xFactor,
      ),

function normaliseTree(data) {
  const fallback = FALLBACK_GEOMETRY.treeOfLife;
  const safe = data && typeof data === "object" ? data : {};
  const fallbackNodes = fallback.nodes;
  const providedNodes = Array.isArray(safe.nodes) && safe.nodes.length > 0 ? safe.nodes : fallbackNodes;
  const nodes = fallbackNodes.map((template, index) => {
    const candidate = typeof providedNodes[index] === "object" && providedNodes[index] !== null ? providedNodes[index] : {};
    const base = fallbackNodes[index % fallbackNodes.length];
    return {
      id: typeof candidate.id === "string" && candidate.id ? candidate.id : base.id,
      title: typeof candidate.title === "string" && candidate.title ? candidate.title : base.title,
      meaning: typeof candidate.meaning === "string" ? candidate.meaning : base.meaning,
      level: finiteNumber(candidate.level, base.level),
      xFactor: clamp01(finiteNumber(candidate.xFactor, base.xFactor))

    };
  });

  const nodeIds = new Set(safeNodes.map((node) => node.id));
  const edges =
    Array.isArray(config.edges) && config.edges.length > 0
      ? config.edges
      : base.edges;
  const safeEdges = edges
    .map((edge) => (Array.isArray(edge) ? edge.slice(0, 2) : []))
    .filter(
      (edge) =>
        edge.length === 2 && nodeIds.has(edge[0]) && nodeIds.has(edge[1]),
    );

  return {

    marginDivisor: toPositiveNumber(config.marginDivisor, base.marginDivisor),
    radiusDivisor: toPositiveNumber(config.radiusDivisor, base.radiusDivisor),
    labelOffset: Number.isFinite(config.labelOffset)
      ? config.labelOffset
      : base.labelOffset,
    labelFont:
      typeof config.labelFont === "string" && config.labelFont
        ? config.labelFont
        : base.labelFont,
    nodes: safeNodes,
    edges: safeEdges,

    marginDivisor: positiveNumber(safe.marginDivisor, fallback.marginDivisor),
    radiusDivisor: positiveNumber(safe.radiusDivisor, fallback.radiusDivisor),
    labelOffset: finiteNumber(safe.labelOffset, fallback.labelOffset),
    labelLineHeight: positiveNumber(safe.labelLineHeight, fallback.labelLineHeight),
    labelFont: typeof safe.labelFont === "string" && safe.labelFont ? safe.labelFont : fallback.labelFont,
    nodes,
    edges

  };
}

function mergeFibonacci(config = {}) {
  const base = DEFAULT_GEOMETRY.fibonacci;
  return {
    sampleCount: toPositiveInteger(config.sampleCount, base.sampleCount),
    turns: toPositiveNumber(config.turns, base.turns),
    baseRadiusDivisor: toPositiveNumber(
      config.baseRadiusDivisor,
      base.baseRadiusDivisor,
    ),
    phi: toPositiveNumber(config.phi, base.phi),
    alpha: clampAlpha(config.alpha, base.alpha),
  };
}

function mergeHelix(config = {}) {
  const base = DEFAULT_GEOMETRY.helix;
  return {
    sampleCount: toPositiveInteger(config.sampleCount, base.sampleCount),
    cycles: toPositiveNumber(config.cycles, base.cycles),
    amplitudeDivisor: toPositiveNumber(
      config.amplitudeDivisor,
      base.amplitudeDivisor,
    ),
    phaseOffset: Number.isFinite(config.phaseOffset)
      ? config.phaseOffset
      : base.phaseOffset,
    crossTieCount: toPositiveInteger(config.crossTieCount, base.crossTieCount),
    strandAlpha: clampAlpha(config.strandAlpha, base.strandAlpha),
    rungAlpha: clampAlpha(config.rungAlpha, base.rungAlpha),
  };
}

function clearStage(ctx, dims, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, dims.width, dims.height);
}


function drawVesicaField(ctx, dims, color, numbers, settings) {
  const rows = Math.max(1, settings.rows);
  const columns = Math.max(1, settings.columns);
  const padding = Math.min(dims.width, dims.height) / settings.paddingDivisor;
  const availableWidth = dims.width - padding * 2;
  const availableHeight = dims.height - padding * 2;
  const stepX = columns > 1 ? availableWidth / (columns - 1) : 0;
  const stepY = rows > 1 ? availableHeight / (rows - 1) : 0;
  const radius = Math.min(stepX, stepY) / settings.radiusFactor;
  const offset = radius * (numbers.ELEVEN / numbers.TWENTYTWO);
  const strokeWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / settings.strokeDivisor,
  );

function drawVesicaField(ctx, width, height, color, N, settings) {
  const rows = Math.max(2, settings.rows);
  const columns = Math.max(2, settings.columns);
  const padding = Math.min(width, height) / settings.paddingDivisor;
  const horizontalSpan = width - padding * 2;
  const verticalSpan = height - padding * 2;
  const stepX = columns > 1 ? horizontalSpan / (columns - 1) : 0;
  const stepY = rows > 1 ? verticalSpan / (rows - 1) : 0;
  const radius = Math.min(stepX, stepY) / settings.radiusFactor;
  const strokeWidth = Math.max(1, Math.min(width, height) / settings.strokeDivisor);


  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";

  ctx.lineJoin = "round";


  let circles = 0;
  for (let row = 0; row < rows; row += 1) {

    for (let column = 0; column < columns; column += 1) {
      const cx = padding + column * stepX;
      const cy = padding + row * stepY;
      strokeVesicaPair(ctx, cx, cy, radius, offset);
      circles += 2;

    const ratioY = rows > 1 ? row / (rows - 1) : 0;
    const y = padding + Math.min(1, ratioY * (N.NINE / N.SEVEN)) * verticalSpan;
    const offset = row % 2 === 0 ? 0 : stepX / 2;

    for (let column = 0; column < columns; column += 1) {
      const ratioX = columns > 1 ? column / (columns - 1) : 0;
      const x = padding + offset + ratioX * horizontalSpan;
      if (x < padding - radius || x > width - padding + radius) {
        continue;
      }
      strokeCircle(ctx, x, y, radius);

    }
  }

  ctx.restore();
  return { circles, radius };
}


function strokeVesicaPair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTreeOfLife(ctx, dims, palette, numbers, settings) {
  const margin = Math.min(dims.width, dims.height) / settings.marginDivisor;
  const usableWidth = dims.width - margin * 2;
  const usableHeight = dims.height - margin * 2;
  const radius = Math.max(
    4,
    Math.min(dims.width, dims.height) / settings.radiusDivisor,
  );
  const pathWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / numbers.NINETYNINE,
  );

  const maxLevel = settings.nodes.reduce(
    (acc, node) => Math.max(acc, node.level),
    0,
  );
  const levelStep = maxLevel > 0 ? usableHeight / maxLevel : 0;

  const positions = new Map();
  for (const node of settings.nodes) {
    const x = margin + clamp01(node.xFactor) * usableWidth;
    const y = margin + node.level * levelStep;
    positions.set(node.id, { x, y, node });
  }

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(palette.layers[1], 0.7);
  ctx.lineWidth = pathWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const [fromId, toId] of settings.edges) {
    const from = positions.get(fromId);
    const to = positions.get(toId);
    if (!from || !to) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, pathWidth * 0.75);
  for (const point of positions.values()) {

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, labelColor, N, tree) {
  const margin = Math.min(width, height) / tree.marginDivisor;
  const top = margin;
  const bottom = height - margin;
  const verticalSpan = bottom - top;
  const maxLevel = tree.nodes.reduce((acc, node) => Math.max(acc, node.level), 0);
  const levelStep = maxLevel > 0 ? verticalSpan / maxLevel : 0;
  const radius = Math.max(4, Math.min(width, height) / tree.radiusDivisor);
  const lineWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  const positions = new Map();
  tree.nodes.forEach((node) => {
    const x = margin + clamp01(node.xFactor) * (width - margin * 2);
    const y = top + node.level * levelStep;
    positions.set(node.id, { x, y, node });
  });

  // Calm connective lines first so nodes remain readable (why: layered depth).
  ctx.save();
  ctx.strokeStyle = colorWithAlpha(pathColor, 0.75);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  tree.edges.forEach((edge) => {
    const start = positions.get(edge[0]);
    const end = positions.get(edge[1]);
    if (!start || !end) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });
  ctx.restore();

  ctx.save();
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = colorWithAlpha(nodeColor, 0.9);
  ctx.lineWidth = Math.max(1, lineWidth * 0.75);
  positions.forEach((entry) => {

    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  }
  ctx.restore();

  if (settings.labelOffset !== 0 && settings.labelFont) {
    ctx.save();
    ctx.fillStyle = palette.ink;
    ctx.font = settings.labelFont;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const point of positions.values()) {
      const labelY = point.y + settings.labelOffset;
      ctx.fillText(point.node.title, point.x, labelY);
    }
    ctx.restore();
  }

  return { nodes: positions.size, paths: settings.edges.length };
}

function drawFibonacciCurve(ctx, dims, color, numbers, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const turns = settings.turns;
  const phi = Math.max(1.0001, settings.phi);
  const totalAngle = turns * Math.PI * 2;
  const baseRadius =
    Math.min(dims.width, dims.height) / settings.baseRadiusDivisor;
  const lineWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / numbers.NINETYNINE,
  );
  const centerX = dims.width * 0.72;
  const centerY = dims.height * 0.28;

  });
  ctx.restore();

  ctx.save();
  ctx.fillStyle = labelColor;
  ctx.font = tree.labelFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const lineHeight = tree.labelLineHeight;
  positions.forEach((entry) => {
    const baseY = entry.y + tree.labelOffset;
    ctx.fillText(entry.node.title, entry.x, baseY);
    if (entry.node.meaning) {
      ctx.fillText(entry.node.meaning, entry.x, baseY + lineHeight);
    }
  });
  ctx.restore();
}

function drawFibonacciCurve(ctx, width, height, color, N, settings) {
  const sampleCount = Math.max(2, settings.sampleCount);
  const turns = Math.max(0, settings.turns);
  if (turns === 0) {
    return;
  }
  const phi = Math.max(1.0001, settings.phi);
  const totalAngle = turns * Math.PI * 2;
  const maxRadius = Math.min(width, height) / settings.baseRadiusDivisor;
  const growth = Math.pow(phi, turns);
  const baseRadius = maxRadius / growth;
  const centerX = width / 2 + width / N.TWENTYTWO;
  const centerY = height / 2 - height / N.ELEVEN;
  const lineWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);


  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();


  for (let index = 0; index < samples; index += 1) {
    const t = samples > 1 ? index / (samples - 1) : 0;

  for (let index = 0; index < sampleCount; index += 1) {
    const t = sampleCount > 1 ? index / (sampleCount - 1) : 0;

    const angle = t * totalAngle;
    const radius = baseRadius * Math.pow(phi, t * turns);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();


  return { points: samples };
}

function drawHelixLattice(ctx, dims, palette, numbers, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const cycles = settings.cycles;
  const amplitude = dims.height / settings.amplitudeDivisor;
  const phase = (settings.phaseOffset * Math.PI) / 180;
  const centerY = dims.height * 0.7;
  const marginX = dims.width / numbers.THIRTYTHREE;
  const spanX = dims.width - marginX * 2;
  const stepX = samples > 1 ? spanX / (samples - 1) : 0;
  const angleStep =
    cycles > 0 ? (Math.PI * 2 * cycles) / Math.max(1, samples - 1) : 0;

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < samples; index += 1) {
    const x = marginX + stepX * index;
    const angle = angleStep * index;
    const yA = centerY + Math.sin(angle) * amplitude;
    const yB = centerY + Math.sin(angle + phase) * amplitude;

function drawHelixLattice(ctx, width, height, strandColor, rungColor, N, settings) {
  const sampleCount = Math.max(2, settings.sampleCount);
  const cycles = Math.max(0, settings.cycles);
  const marginX = width / N.ELEVEN;
  const startX = marginX;
  const endX = width - marginX;
  const amplitude = Math.min(height / settings.amplitudeDivisor, height / N.THREE);
  const baseline = height / 2;
  const totalAngle = cycles * Math.PI * 2;
  const phase = (settings.phaseOffset * Math.PI) / 180;
  const strandWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < sampleCount; index += 1) {
    const t = sampleCount > 1 ? index / (sampleCount - 1) : 0;
    const x = startX + t * (endX - startX);
    const angle = t * totalAngle;
    const yA = baseline + Math.sin(angle) * amplitude;
    const yB = baseline + Math.sin(angle + phase) * amplitude;

    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.save();

  ctx.lineWidth = Math.max(
    1.2,
    Math.min(dims.width, dims.height) / numbers.ONEFORTYFOUR,
  );

  ctx.strokeStyle = colorWithAlpha(palette.layers[4], settings.strandAlpha);
  drawPolyline(ctx, strandA);

  ctx.strokeStyle = colorWithAlpha(palette.layers[5], settings.strandAlpha);
  drawPolyline(ctx, strandB);

  const rungCount = Math.max(1, settings.crossTieCount);
  const rungStep = Math.max(1, Math.floor(samples / rungCount));
  ctx.strokeStyle = colorWithAlpha(palette.ink, settings.rungAlpha);
  ctx.lineWidth = Math.max(
    1,
    Math.min(dims.width, dims.height) / numbers.ONEFORTYFOUR,
  );
  let drawn = 0;
  for (let index = 0; index < samples; index += rungStep) {
    const a = strandA[index];
    const b = strandB[index];
    if (!a || !b) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    drawn += 1;
  }

  ctx.restore();
  return { rungs: drawn };
}

function drawPolyline(ctx, points) {
  if (points.length === 0) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorWithAlpha(strandColor, settings.strandAlpha);
  ctx.lineWidth = strandWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  drawPolyline(ctx, strandA);
  drawPolyline(ctx, strandB);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(rungColor, settings.rungAlpha);
  ctx.lineWidth = Math.max(1, strandWidth * 0.85);
  ctx.lineCap = "round";
  const rungCount = Math.max(1, settings.crossTieCount);
  for (let rung = 0; rung < rungCount; rung += 1) {
    const t = rungCount > 1 ? rung / (rungCount - 1) : 0;
    const index = Math.floor(t * (strandA.length - 1));
    const start = strandA[index];
    const end = strandB[index];
    if (!start || !end) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  ctx.restore();

}

function drawCanvasNotice(ctx, dims, color, message) {
  const padding =
    Math.min(dims.width, dims.height) / DEFAULT_NUMBERS.THIRTYTHREE;
  ctx.save();
  ctx.fillStyle = colorWithAlpha(color, 0.9);
  ctx.font = `${Math.max(14, dims.width / 72)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(message, dims.width / 2, dims.height - padding);
  ctx.restore();
}

function summariseLayers(stats) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const tree = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  const helix = `${stats.helixStats.rungs} helix rungs`;
  return `Layers rendered - ${vesica}; ${tree}; ${fibonacci}; ${helix}.`;
}


function colorWithAlpha(hex, alpha) {
  const normalized = typeof hex === "string" ? hex.trim() : "";
  const value = normalized.startsWith("#") ? normalized.slice(1) : normalized;
  const safeAlpha = clamp01(alpha);
  if (value.length !== 6) {
    return `rgba(255,255,255,${safeAlpha})`;
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${safeAlpha})`;
}

function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : Number(fallback);
}

function toPositiveInteger(value, fallback) {
  const number = Number(value);
  const rounded = Math.round(number);
  return Number.isFinite(number) && rounded > 0 ? rounded : Number(fallback);

function drawPolyline(ctx, points) {
  if (!Array.isArray(points) || points.length === 0) {
    return;
  }
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number(fallback);
}

function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  const rounded = Math.round(parsed);
  return Number.isInteger(rounded) && rounded > 0 ? rounded : fallback;
}

function finiteNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;

}

function clamp01(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  if (parsed < 0) {
    return 0;
  }
  if (parsed > 1) {
    return 1;
  }
  return parsed;
}

function clampAlpha(value, fallback) {

  if (value === 0) {
    return 0;
  }
  const number = Number(value);
  if (Number.isFinite(number)) {
    return clamp01(number);
  }
  return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  if (parsed < 0) {
    return 0;
  }
  if (parsed > 1) {
    return 1;
  }
  return parsed;
}

function colorWithAlpha(hex, alpha) {
  const value = typeof hex === "string" ? hex.trim() : "";
  const stripped = value.startsWith("#") ? value.slice(1) : value;
  if (stripped.length !== 6) {
    const safeAlpha = clamp01(alpha);
    return `rgba(255,255,255,${safeAlpha})`;
  }
  const r = parseInt(stripped.slice(0, 2), 16);
  const g = parseInt(stripped.slice(2, 4), 16);
  const b = parseInt(stripped.slice(4, 6), 16);
  const safeAlpha = clamp01(alpha);
  return `rgba(${r},${g},${b},${safeAlpha})`;

}
