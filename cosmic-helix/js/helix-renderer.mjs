/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry requested for Codex 144:99.


  Layer order (back to front):
    1) Vesica field — intersecting circle lattice referencing numerology spacing.
    2) Tree-of-Life scaffold — ten sephirot linked by twenty-two calm paths.
    3) Fibonacci curve — golden spiral polyline sampled across 144 points.
    4) Double-helix lattice — two static strands with gentle cross ties.

  Every helper below is a small pure function. The renderer draws once per load,
  avoiding motion or flashing to respect the ND-safe covenant.
*/

const FALLBACK_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};


  Layers (rendered back to front):
    1) Vesica field - intersecting circle lattice for the womb-of-forms motif.
    2) Tree-of-Life scaffold - ten sephirot joined by twenty-two calm paths.
    3) Fibonacci curve - logarithmic spiral polyline with golden-ratio pacing.
    4) Double-helix lattice - two still strands with gentle cross ties.

  Rationale:
    - No animation: everything draws once on load to respect ND-safe pacing.
    - Calm palette: soft contrast keeps lines readable without sensory spikes.
    - Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) guide proportions.
*/


const DEFAULT_NUM = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
};


const FALLBACK_GEOMETRY = {
  vesica: {
    rows: 9,
    columns: 11,
    paddingDivisor: 11,
    radiusFactor: 1.5,
    strokeDivisor: 99,
    alpha: 0.55
  },
  treeOfLife: {
    marginDivisor: 11,
    radiusDivisor: 22,
    labelOffset: -24,
    labelFont: "13px system-ui, -apple-system, Segoe UI, sans-serif",
    nodes: [
      { id: "kether", title: "Kether", meaning: "Crown", level: 0, xFactor: 0.5 },
      { id: "chokmah", title: "Chokmah", meaning: "Wisdom", level: 1, xFactor: 0.7 },
      { id: "binah", title: "Binah", meaning: "Understanding", level: 1, xFactor: 0.3 },
      { id: "chesed", title: "Chesed", meaning: "Mercy", level: 2, xFactor: 0.68 },
      { id: "geburah", title: "Geburah", meaning: "Severity", level: 2, xFactor: 0.32 },
      { id: "tiphareth", title: "Tiphareth", meaning: "Beauty", level: 3, xFactor: 0.5 },
      { id: "netzach", title: "Netzach", meaning: "Victory", level: 4, xFactor: 0.66 },
      { id: "hod", title: "Hod", meaning: "Glory", level: 4, xFactor: 0.34 },
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
      ["yesod", "malkuth"]
    ]
  },
  fibonacci: {
    sampleCount: 144,
    turns: 3,
    baseRadiusDivisor: 3,
    phi: 1.618033988749895,
    alpha: 0.85
  },
  helix: {
    sampleCount: 144,
    cycles: 3,
    amplitudeDivisor: 3,
    phaseOffset: 180,
    crossTieCount: 33,
    strandAlpha: 0.85,
    rungAlpha: 0.6
  }
};

export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.moveTo !== "function") {
    return { ok: false, reason: "missing-context" };
  }

  const width = typeof options.width === "number" ? options.width : ctx.canvas.width;
  const height = typeof options.height === "number" ? options.height : ctx.canvas.height;
  if (!width || !height) {

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    return { ok: false, reason: "missing-context" };
  }

  const width = toNumber(options.width, ctx.canvas.width);
  const height = toNumber(options.height, ctx.canvas.height);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {

    return { ok: false, reason: "invalid-dimensions" };
  }

  const palette = normalisePalette(options.palette);
  const numerology = normaliseNumerology(options.NUM);

  const geometry = normaliseGeometry(options.geometry);

  const notice = typeof options.notice === "string" ? options.notice.trim() : "";

  ctx.save();
  fillBackground(ctx, width, height, palette.bg);

  // Layer order preserves depth without motion (why: ND-safe, trauma-informed viewing).
  drawVesicaField(ctx, width, height, palette.layers[0], numerology, geometry.vesica);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], palette.ink, numerology, geometry.treeOfLife);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], numerology, geometry.fibonacci);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], numerology, geometry.helix);

  if (notice) {
    drawNotice(ctx, width, height, palette.ink, notice);
  }

  ctx.restore();
  return { ok: true, constants: numerology };
}

function normalisePalette(input) {
  if (!input || typeof input !== "object") {
    return { ...FALLBACK_PALETTE, layers: [...FALLBACK_PALETTE.layers] };
  }

  const result = {
    bg: typeof input.bg === "string" ? input.bg : FALLBACK_PALETTE.bg,
    ink: typeof input.ink === "string" ? input.ink : FALLBACK_PALETTE.ink,
    muted: typeof input.muted === "string" ? input.muted : FALLBACK_PALETTE.muted,
    layers: []
  };

  const requestedLayers = Array.isArray(input.layers) ? input.layers : [];
  for (let index = 0; index < FALLBACK_PALETTE.layers.length; index += 1) {
    const candidate = requestedLayers[index];
    result.layers.push(typeof candidate === "string" ? candidate : FALLBACK_PALETTE.layers[index]);
  }

  return result;
}

function normaliseNumerology(input) {
  const source = input && typeof input === "object" ? input : {};
  const result = {};
  for (const key of Object.keys(DEFAULT_NUM)) {
    const value = Number(source[key]);
    result[key] = Number.isFinite(value) && value > 0 ? value : DEFAULT_NUM[key];
  }
  return result;
}

function normaliseGeometry(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    vesica: normaliseVesica(source.vesica),
    treeOfLife: normaliseTree(source.treeOfLife),
    fibonacci: normaliseFibonacci(source.fibonacci),
    helix: normaliseHelix(source.helix)
  };
}

function normaliseVesica(data) {
  const fallback = FALLBACK_GEOMETRY.vesica;
  const safe = data && typeof data === "object" ? data : {};
  return {
    rows: positiveInteger(safe.rows, fallback.rows),
    columns: positiveInteger(safe.columns, fallback.columns),
    paddingDivisor: positiveNumber(safe.paddingDivisor, fallback.paddingDivisor),
    radiusFactor: positiveNumber(safe.radiusFactor, fallback.radiusFactor),
    strokeDivisor: positiveNumber(safe.strokeDivisor, fallback.strokeDivisor),
    alpha: clampAlpha(safe.alpha, fallback.alpha)
  };
}

function normaliseTree(data) {
  const fallback = FALLBACK_GEOMETRY.treeOfLife;
  const safe = data && typeof data === "object" ? data : {};
  const fallbackNodes = fallback.nodes;
  const providedNodes = Array.isArray(safe.nodes) && safe.nodes.length > 0 ? safe.nodes : fallbackNodes;
  const normalisedNodes = providedNodes.map((node, index) => {
    const base = typeof node === "object" && node !== null ? node : {};
    const reference = fallbackNodes.find((fallbackNode) => fallbackNode.id === base.id) || fallbackNodes[index % fallbackNodes.length];
    return {
      id: typeof base.id === "string" && base.id ? base.id : reference.id,
      title: typeof base.title === "string" && base.title ? base.title : reference.title,
      meaning: typeof base.meaning === "string" && base.meaning ? base.meaning : reference.meaning,
      level: finiteNumber(base.level, reference.level),
      xFactor: clamp01(finiteNumber(base.xFactor, reference.xFactor))
    };
  });

  const nodeIds = new Set(normalisedNodes.map((node) => node.id));
  const edgesSource = Array.isArray(safe.edges) && safe.edges.length > 0 ? safe.edges : fallback.edges;
  const normalisedEdges = edgesSource
    .map((edge) => Array.isArray(edge) ? edge.slice(0, 2) : [])
    .filter((edge) => edge.length === 2 && nodeIds.has(edge[0]) && nodeIds.has(edge[1]));

  return {
    marginDivisor: positiveNumber(safe.marginDivisor, fallback.marginDivisor),
    radiusDivisor: positiveNumber(safe.radiusDivisor, fallback.radiusDivisor),
    labelOffset: finiteNumber(safe.labelOffset, fallback.labelOffset),
    labelFont: typeof safe.labelFont === "string" && safe.labelFont ? safe.labelFont : fallback.labelFont,
    nodes: normalisedNodes,
    edges: normalisedEdges
  };
}

function normaliseFibonacci(data) {
  const fallback = FALLBACK_GEOMETRY.fibonacci;
  const safe = data && typeof data === "object" ? data : {};
  return {
    sampleCount: positiveInteger(safe.sampleCount, fallback.sampleCount),
    turns: positiveNumber(safe.turns, fallback.turns),
    baseRadiusDivisor: positiveNumber(safe.baseRadiusDivisor, fallback.baseRadiusDivisor),
    phi: positiveNumber(safe.phi, fallback.phi),
    alpha: clampAlpha(safe.alpha, fallback.alpha)
  };
}

function normaliseHelix(data) {
  const fallback = FALLBACK_GEOMETRY.helix;
  const safe = data && typeof data === "object" ? data : {};
  return {
    sampleCount: positiveInteger(safe.sampleCount, fallback.sampleCount),
    cycles: positiveNumber(safe.cycles, fallback.cycles),
    amplitudeDivisor: positiveNumber(safe.amplitudeDivisor, fallback.amplitudeDivisor),
    phaseOffset: finiteNumber(safe.phaseOffset, fallback.phaseOffset),
    crossTieCount: positiveInteger(safe.crossTieCount, fallback.crossTieCount),
    strandAlpha: clampAlpha(safe.strandAlpha, fallback.strandAlpha),
    rungAlpha: clampAlpha(safe.rungAlpha, fallback.rungAlpha)
  };
}

function fillBackground(ctx, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

function drawVesicaField(ctx, width, height, color, N, settings) {
  const rows = Math.max(2, settings.rows);
  const columns = Math.max(2, settings.columns);
  const padding = Math.min(width, height) / settings.paddingDivisor;
  const stepX = columns > 1 ? (width - padding * 2) / (columns - 1) : 0;
  const stepY = rows > 1 ? (height - padding * 2) / (rows - 1) : 0;
  const radius = Math.min(stepX, stepY) / settings.radiusFactor;
  const strokeWidth = Math.max(1, Math.min(width, height) / settings.strokeDivisor);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.globalAlpha = settings.alpha;

  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : stepX / 2;
    for (let col = 0; col < columns; col += 1) {
      const x = padding + offset + col * stepX;
      if (x < padding || x > width - padding) {
        continue;
      }
      const y = padding + row * stepY;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();

  drawVesicaField(ctx, width, height, palette.layers[0], numerology);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], numerology, palette.ink);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], numerology);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], numerology);

  if (notice) {
    drawNotice(ctx, width, height, palette.ink, notice, numerology);
  }

  ctx.restore();
  return { ok: true, palette, numerology };
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalisePalette(input) {
  const source = input && typeof input === "object" ? input : {};
  const candidateLayers = Array.isArray(source.layers) ? source.layers : [];
  const layers = DEFAULT_PALETTE.layers.map((color, index) => {
    const candidate = candidateLayers[index];
    return typeof candidate === "string" && candidate.trim() ? candidate : color;
  });

  return {
    bg: pickColor(source.bg, DEFAULT_PALETTE.bg),
    ink: pickColor(source.ink, DEFAULT_PALETTE.ink),
    muted: pickColor(source.muted, DEFAULT_PALETTE.muted),
    layers
  };
}

function pickColor(candidate, fallback) {
  return typeof candidate === "string" && candidate.trim() ? candidate : fallback;
}

function normaliseNumerology(source) {
  const data = source && typeof source === "object" ? source : {};
  const result = {};
  for (const key of Object.keys(DEFAULT_NUM)) {
    const value = Number(data[key]);
    result[key] = Number.isFinite(value) ? value : DEFAULT_NUM[key];
  }
  return result;
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawVesicaField(ctx, width, height, color, N) {
  const columns = Math.max(3, Math.round(N.NINE));
  const rows = Math.max(3, Math.round(N.SEVEN));
  const xGap = width / (columns + 1);
  const yGap = height / (rows + 1);
  const radius = Math.min(xGap, yGap) * 0.66;
  const lineWidth = Math.max(1, radius / (N.THIRTYTHREE || DEFAULT_NUM.THIRTYTHREE));

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = 0.35;
  // Gentle alpha keeps overlapping vesica forms soft for ND-safe viewing.

  for (let row = 0; row < rows; row += 1) {
    const cy = yGap + row * yGap;
    for (let col = 0; col < columns; col += 1) {
      const cx = xGap + col * xGap;
      strokeCircle(ctx, cx, cy, radius);
      strokeCircle(ctx, cx + xGap / 2, cy, radius);
      strokeCircle(ctx, cx, cy + yGap / 2, radius);

    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, labelColor, N, tree) {
  const marginY = height / tree.marginDivisor;
  const radius = Math.min(width, height) / tree.radiusDivisor;

  const uniqueLevels = Array.from(new Set(tree.nodes.map((node) => node.level))).sort((a, b) => a - b);
  const levelCount = uniqueLevels.length;
  const usableHeight = height - marginY * 2;
  const levelPositions = new Map();
  uniqueLevels.forEach((level, index) => {
    const ratio = levelCount > 1 ? index / (levelCount - 1) : 0;
    levelPositions.set(level, marginY + usableHeight * ratio);
  });

  const positionedNodes = tree.nodes.map((node) => {
    const y = levelPositions.get(node.level) ?? (height / 2);
    const x = clamp01(node.xFactor) * width;
    return { ...node, x, y };
  });

  const nodeMap = new Map(positionedNodes.map((node) => [node.id, node]));

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / N.NINETYNINE * 1.5);
  ctx.globalAlpha = 0.75;

  for (const [fromId, toId] of tree.edges) {
    const fromNode = nodeMap.get(fromId);
    const toNode = nodeMap.get(toId);
    if (!fromNode || !toNode) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.stroke();
  }

  ctx.fillStyle = nodeColor;
  ctx.globalAlpha = 1;
  for (const node of positionedNodes) {
=======
function strokeCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, N, ink) {
  const topMargin = height / (N.ELEVEN || DEFAULT_NUM.ELEVEN);
  const usableHeight = height - topMargin * 2;
  const levelGap = usableHeight / (N.NINE || DEFAULT_NUM.NINE);
  const centerX = width / 2;
  const columnSpread = width / (N.THREE + N.SEVEN / 10);
  const nodeRadius = Math.max(4, Math.min(width, height) / (N.NINETYNINE || DEFAULT_NUM.NINETYNINE));

  const layout = [
    { level: 0, shift: 0 },
    { level: 1, shift: 1 },
    { level: 1, shift: -1 },
    { level: 3, shift: 0.9 },
    { level: 3, shift: -0.9 },
    { level: 4.5, shift: 0 },
    { level: 6, shift: 0.85 },
    { level: 6, shift: -0.85 },
    { level: 7.4, shift: 0 },
    { level: 9, shift: 0 }
  ];

  const nodes = layout.map((item) => ({
    x: centerX + item.shift * columnSpread,
    y: topMargin + item.level * levelGap
  }));

  const paths = [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [1, 3], [2, 5], [2, 4], [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 7], [5, 6], [5, 7], [6, 7], [6, 8], [7, 8], [5, 8], [8, 9], [6, 9], [7, 9]
  ];

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1, nodeRadius / (N.TWENTYTWO || DEFAULT_NUM.TWENTYTWO));
  ctx.globalAlpha = 0.6;
  // Calm line weight highlights twenty-two paths without overpowering the nodes.

  for (const [fromIndex, toIndex] of paths) {
    const from = nodes[fromIndex];
    const to = nodes[toIndex];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.9;
  // Nodes stay opaque to anchor focus while paths remain translucent.
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1, nodeRadius / (N.THIRTYTHREE || DEFAULT_NUM.THIRTYTHREE));

  for (const node of nodes) {

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();

  }

  ctx.fillStyle = labelColor;
  ctx.globalAlpha = 0.85;
  ctx.font = tree.labelFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const node of positionedNodes) {
    const label = node.meaning || node.title;
    const labelY = node.y + tree.labelOffset;
    ctx.fillText(label, node.x, labelY);

    ctx.stroke();

  }

  ctx.restore();
}


function drawFibonacciCurve(ctx, width, height, color, N, settings) {
  const sampleCount = Math.max(2, settings.sampleCount);
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(width, height) / settings.baseRadiusDivisor;
  const turns = settings.turns;
  const phi = settings.phi;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / N.NINETYNINE * 1.2);
  ctx.globalAlpha = settings.alpha;
  ctx.beginPath();

  for (let index = 0; index < sampleCount; index += 1) {
    const t = index / (sampleCount - 1);
    const angle = t * turns * Math.PI * 2;
    const radius = baseRadius * Math.pow(phi, angle / (Math.PI * 2));
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();
}

function drawHelixLattice(ctx, width, height, strandColor, rungColor, N, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const marginX = width / DEFAULT_NUM.ELEVEN;
  const usableWidth = width - marginX * 2;
  const centerY = height / 2;
  const amplitude = height / settings.amplitudeDivisor;
  const cycles = settings.cycles;
  const strandThickness = Math.max(1.5, Math.min(width, height) / N.NINETYNINE * 1.4);
  const rungStep = Math.max(2, Math.floor(samples / Math.max(1, settings.crossTieCount)));
  const phaseRadians = (settings.phaseOffset * Math.PI) / 180;

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < samples; index += 1) {
    const t = index / (samples - 1);
    const x = marginX + t * usableWidth;
    const angle = t * cycles * Math.PI * 2;
    const yA = centerY + Math.sin(angle) * amplitude * 0.4;
    const yB = centerY + Math.sin(angle + phaseRadians) * amplitude * 0.4;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.save();
  ctx.lineWidth = strandThickness;
  ctx.strokeStyle = strandColor;
  ctx.globalAlpha = settings.strandAlpha;
  strokePolyline(ctx, strandA);
  strokePolyline(ctx, strandB);

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = Math.max(1, strandThickness * 0.6);
  ctx.globalAlpha = settings.rungAlpha;
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

function drawFibonacciCurve(ctx, width, height, color, N) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = Math.max(12, Math.round(N.ONEFORTYFOUR || DEFAULT_NUM.ONEFORTYFOUR));
  const rotations = (N.THIRTYTHREE || DEFAULT_NUM.THIRTYTHREE) / (N.ELEVEN || DEFAULT_NUM.ELEVEN);
  const thetaMax = rotations * Math.PI * 2;

  const rawPoints = [];
  for (let index = 0; index < steps; index += 1) {
    const t = steps <= 1 ? 0 : index / (steps - 1);
    const theta = t * thetaMax;
    const radius = Math.pow(phi, theta / Math.PI);
    const rotatedTheta = theta - Math.PI / 2;
    rawPoints.push({
      x: radius * Math.cos(rotatedTheta),
      y: radius * Math.sin(rotatedTheta)
    });
  }

  const bounds = measureBounds(rawPoints);
  const rangeX = bounds.maxX - bounds.minX || 1;
  const rangeY = bounds.maxY - bounds.minY || 1;
  const scale = 0.4 * Math.min(width / rangeX, height / rangeY);
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;

  const points = rawPoints.map((point) => ({
    x: width / 2 + (point.x - centerX) * scale,
    y: height / 2 + (point.y - centerY) * scale
  }));

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / (N.ONEFORTYFOUR || DEFAULT_NUM.ONEFORTYFOUR));
  ctx.globalAlpha = 0.85;
  // Polyline sampling is static, keeping the Fibonacci growth readable without motion.
  drawPolyline(ctx, points);

  const markerInterval = Math.max(6, Math.floor(points.length / (N.TWENTYTWO || DEFAULT_NUM.TWENTYTWO)));
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.75;
  for (let index = 0; index < points.length; index += markerInterval) {
    const point = points[index];
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(2, ctx.lineWidth * 0.9), 0, Math.PI * 2);
    ctx.fill();

  }

  ctx.restore();
}

function strokePolyline(ctx, points) {
  if (!Array.isArray(points) || points.length === 0) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(points[index].x, points[index].y);

function measureBounds(points) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }
  if (!points.length) {
    minX = minY = maxX = maxY = 0;
  }
  return { minX, minY, maxX, maxY };
}

function drawPolyline(ctx, points) {
  if (points.length < 2) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    ctx.lineTo(point.x, point.y);

  }
  ctx.stroke();
}


function drawNotice(ctx, width, height, ink, message) {
  ctx.save();
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.75;
  ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(message, width / 33, height - height / 22);
  ctx.restore();
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function positiveInteger(value, fallback) {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampAlpha(value, fallback) {
  const number = Number(value);
  if (Number.isFinite(number)) {
    return clamp(number, 0, 1);
  }
  return clamp(fallback, 0, 1);
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function clamp(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;

function drawHelixLattice(ctx, width, height, colorA, colorB, N) {
  const samples = Math.max(12, Math.round(N.ONEFORTYFOUR || DEFAULT_NUM.ONEFORTYFOUR));
  const marginX = width / (N.ELEVEN || DEFAULT_NUM.ELEVEN);
  const usableWidth = width - marginX * 2;
  const centerY = height * 0.62;
  const amplitude = height / (N.THREE + N.NINE / 9);
  const angleScale = (N.THIRTYTHREE || DEFAULT_NUM.THIRTYTHREE) / (N.ELEVEN || DEFAULT_NUM.ELEVEN) * Math.PI;

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < samples; index += 1) {
    const t = samples <= 1 ? 0 : index / (samples - 1);
    const x = marginX + t * usableWidth;
    const angle = t * angleScale;
    const yA = centerY + Math.sin(angle) * amplitude * 0.3;
    const yB = centerY + Math.sin(angle + Math.PI) * amplitude * 0.3;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.save();
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / (N.NINETYNINE || DEFAULT_NUM.NINETYNINE));
  ctx.globalAlpha = 0.75;
  // Twin strands use small amplitude so the lattice reads clearly without overstimulation.
  ctx.strokeStyle = colorA;
  drawPolyline(ctx, strandA);
  ctx.strokeStyle = colorB;
  drawPolyline(ctx, strandB);

  const rungSpacing = Math.max(2, Math.floor(samples / (N.TWENTYTWO || DEFAULT_NUM.TWENTYTWO)));
  ctx.globalAlpha = 0.55;
  // Rungs bind the helix at a slow cadence (22 segments) to mirror the requested numerology.
  ctx.strokeStyle = colorB;
  for (let index = 0; index < samples; index += rungSpacing) {
    const a = strandA[index];
    const b = strandB[index];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNotice(ctx, width, height, ink, text, N) {
  const margin = width / (N.TWENTYTWO || DEFAULT_NUM.TWENTYTWO);
  const lineHeight = 16;
  const lines = wrapNotice(text, 44);

  ctx.save();
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.75;
  // Notice text offers gentle feedback if external data is missing.
  ctx.font = "14px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textBaseline = "alphabetic";

  lines.forEach((line, index) => {
    const y = height - margin - (lines.length - 1 - index) * lineHeight;
    ctx.fillText(line, margin, y);
  });

  ctx.restore();
}

function wrapNotice(text, maxChars) {
  const safeText = text.trim();
  if (!safeText) {
    return [];
  }
  const words = safeText.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;

}
