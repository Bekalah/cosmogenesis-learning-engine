/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (back to front):
    1) Vesica field — intersecting circles establishing the womb-of-forms grid.
    2) Tree-of-Life scaffold — ten sephirot nodes and twenty-two calm paths.
    3) Fibonacci curve — logarithmic spiral sampled over 144 points.
    4) Double-helix lattice — two still strands tied by thirty-three crossbars.

  Why this design: preserves layered depth without animation, honours numerology constants
  (3, 7, 9, 11, 22, 33, 99, 144), and keeps functions pure and well-commented for offline review.
*/

const FALLBACK_PALETTE = Object.freeze({
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
});

const FALLBACK_NUMBERS = Object.freeze({
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
});

/**
 * Render the Cosmic Helix layers in a single, motion-free pass.
 *
 * @param {CanvasRenderingContext2D} ctx - Target 2D canvas context.
 * @param {Object} [options] - Rendering options.
 * @param {number} [options.width] - Explicit width override; defaults to ctx.canvas.width.
 * @param {number} [options.height] - Explicit height override; defaults to ctx.canvas.height.
 * @param {Object} [options.palette] - Optional palette overrides (bg, ink, muted, layers).
 * @param {Object} [options.NUM] - Optional numerology overrides.
 * @param {Object} [options.geometry] - Optional geometry overrides per layer.
 * @param {string} [options.notice] - Optional canvas notice drawn near the footer.
 * @returns {{ok: true, summary: string}|{ok: false, reason: string}} Summary or failure reason.
 */
export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas !== "object" || typeof ctx.save !== "function") {
    return { ok: false, reason: "missing-context" };
  }

  const dims = normaliseDimensions(ctx, options);
  if (!dims) {
    return { ok: false, reason: "invalid-dimensions" };
  }

  const numbers = normaliseNumbers(options.NUM);
  const palette = normalisePalette(options.palette);
  const geometry = normaliseGeometry(options.geometry, numbers);
  const notice = typeof options.notice === "string" && options.notice.trim() ? options.notice.trim() : "";

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  fillBackground(ctx, dims, palette.bg);

  const vesicaStats = drawVesicaField(ctx, dims, palette.layers[0], numbers, geometry.vesica);
  const treeStats = drawTreeOfLife(ctx, dims, palette, numbers, geometry.treeOfLife);
  const fibonacciStats = drawFibonacciCurve(ctx, dims, palette.layers[3], numbers, geometry.fibonacci);
  const helixStats = drawHelixLattice(ctx, dims, palette, numbers, geometry.helix);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette.ink, palette.muted, notice);
  }

  ctx.restore();

  return {
    ok: true,
    summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats })
  };
}

function normaliseDimensions(ctx, options) {
  const width = toPositiveNumber(options.width) || ctx.canvas.width;
  const height = toPositiveNumber(options.height) || ctx.canvas.height;
  if (!toPositiveNumber(width) || !toPositiveNumber(height)) {
    return null;
  }
  if (ctx.canvas.width !== width) {
    ctx.canvas.width = width;
  }
  if (ctx.canvas.height !== height) {
    ctx.canvas.height = height;
  }
  return { width, height };
}

function toPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function normaliseNumbers(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return { ...FALLBACK_NUMBERS };
  }
  const merged = { ...FALLBACK_NUMBERS };
  for (const key of Object.keys(FALLBACK_NUMBERS)) {
    if (typeof candidate[key] === "number" && Number.isFinite(candidate[key]) && candidate[key] > 0) {
      merged[key] = candidate[key];
    }
  }
  return merged;
}

function normalisePalette(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return clonePalette(FALLBACK_PALETTE);
  }
  const layers = Array.isArray(candidate.layers)
    ? candidate.layers.slice(0, FALLBACK_PALETTE.layers.length)
    : [];
  while (layers.length < FALLBACK_PALETTE.layers.length) {
    layers.push(FALLBACK_PALETTE.layers[layers.length]);
  }
  return {
    bg: typeof candidate.bg === "string" ? candidate.bg : FALLBACK_PALETTE.bg,
    ink: typeof candidate.ink === "string" ? candidate.ink : FALLBACK_PALETTE.ink,
    muted: typeof candidate.muted === "string" ? candidate.muted : FALLBACK_PALETTE.muted,
    layers
  };
}

function clonePalette(palette) {
  return {
    bg: palette.bg,
    ink: palette.ink,
    muted: palette.muted,
    layers: palette.layers.slice()
  };
}

function normaliseGeometry(candidate, numbers) {
  const base = createDefaultGeometry(numbers);
  if (!candidate || typeof candidate !== "object") {
    return base;
  }
  return {
    vesica: mergeVesicaGeometry(base.vesica, candidate.vesica),
    treeOfLife: mergeTreeGeometry(base.treeOfLife, candidate.treeOfLife),
    fibonacci: mergeFibonacciGeometry(base.fibonacci, candidate.fibonacci),
    helix: mergeHelixGeometry(base.helix, candidate.helix)
  };
}

function createDefaultGeometry(num) {
  return {
    vesica: {
      rows: num.NINE,
      columns: num.ELEVEN,
      paddingDivisor: num.ELEVEN,
      radiusScale: num.SEVEN / num.THIRTYTHREE,
      strokeDivisor: num.NINETYNINE,
      alpha: 0.55
    },
    treeOfLife: {
      marginDivisor: num.ELEVEN,
      radiusDivisor: num.THIRTYTHREE,
      pathDivisor: num.NINETYNINE,
      nodeAlpha: 0.88,
      pathAlpha: 0.62,
      labelAlpha: 0.7,
      nodes: buildTreeNodes(),
      edges: buildTreeEdges()
    },
    fibonacci: {
      sampleCount: num.ONEFORTYFOUR,
      turns: num.THREE,
      baseRadiusDivisor: num.TWENTYTWO,
      centerXFactor: 0.34,
      centerYFactor: 0.58,
      phi: 1.618033988749895,
      markerInterval: num.ELEVEN,
      alpha: 0.85
    },
    helix: {
      sampleCount: num.ONEFORTYFOUR,
      cycles: num.THREE,
      amplitudeDivisor: num.NINE,
      strandSeparationDivisor: num.THIRTYTHREE,
      crossTieCount: num.THIRTYTHREE,
      strandAlpha: 0.82,
      rungAlpha: 0.6
    }
  };
}

function mergeVesicaGeometry(base, patch) {
  if (!patch || typeof patch !== "object") {
    return { ...base };
  }
  return {
    rows: positiveOrDefault(patch.rows, base.rows),
    columns: positiveOrDefault(patch.columns, base.columns),
    paddingDivisor: positiveOrDefault(patch.paddingDivisor, base.paddingDivisor),
    radiusScale: typeof patch.radiusScale === "number" && patch.radiusScale > 0 ? patch.radiusScale : base.radiusScale,
    strokeDivisor: positiveOrDefault(patch.strokeDivisor, base.strokeDivisor),
    alpha: typeof patch.alpha === "number" ? clamp(patch.alpha, 0, 1) : base.alpha
  };
}

function mergeTreeGeometry(base, patch) {
  if (!patch || typeof patch !== "object") {
    return {
      ...base,
      nodes: base.nodes.map((node) => ({ ...node })),
      edges: base.edges.map((edge) => edge.slice())
    };
  }
  return {
    marginDivisor: positiveOrDefault(patch.marginDivisor, base.marginDivisor),
    radiusDivisor: positiveOrDefault(patch.radiusDivisor, base.radiusDivisor),
    pathDivisor: positiveOrDefault(patch.pathDivisor, base.pathDivisor),
    nodeAlpha: typeof patch.nodeAlpha === "number" ? clamp(patch.nodeAlpha, 0, 1) : base.nodeAlpha,
    pathAlpha: typeof patch.pathAlpha === "number" ? clamp(patch.pathAlpha, 0, 1) : base.pathAlpha,
    labelAlpha: typeof patch.labelAlpha === "number" ? clamp(patch.labelAlpha, 0, 1) : base.labelAlpha,
    nodes: Array.isArray(patch.nodes) && patch.nodes.length
      ? patch.nodes.map(normaliseTreeNode)
      : base.nodes.map((node) => ({ ...node })),
    edges: Array.isArray(patch.edges) && patch.edges.length
      ? patch.edges.filter(Array.isArray).map((edge) => edge.slice(0, 2))
      : base.edges.map((edge) => edge.slice())
  };
}

function normaliseTreeNode(node) {
  return {
    id: String(node.id || ""),
    title: typeof node.title === "string" && node.title ? node.title : String(node.id || ""),
    level: typeof node.level === "number" ? node.level : 0,
    xFactor: typeof node.xFactor === "number" ? node.xFactor : 0.5
  };
}

function mergeFibonacciGeometry(base, patch) {
  if (!patch || typeof patch !== "object") {
    return { ...base };
  }
  return {
    sampleCount: positiveOrDefault(patch.sampleCount, base.sampleCount),
    turns: positiveOrDefault(patch.turns, base.turns),
    baseRadiusDivisor: positiveOrDefault(patch.baseRadiusDivisor, base.baseRadiusDivisor),
    centerXFactor: typeof patch.centerXFactor === "number" ? clamp(patch.centerXFactor, 0, 1) : base.centerXFactor,
    centerYFactor: typeof patch.centerYFactor === "number" ? clamp(patch.centerYFactor, 0, 1) : base.centerYFactor,
    phi: typeof patch.phi === "number" && patch.phi > 1 ? patch.phi : base.phi,
    markerInterval: positiveOrDefault(patch.markerInterval, base.markerInterval),
    alpha: typeof patch.alpha === "number" ? clamp(patch.alpha, 0, 1) : base.alpha
  };
}

function mergeHelixGeometry(base, patch) {
  if (!patch || typeof patch !== "object") {
    return { ...base };
  }
  return {
    sampleCount: positiveOrDefault(patch.sampleCount, base.sampleCount),
    cycles: positiveOrDefault(patch.cycles, base.cycles),
    amplitudeDivisor: positiveOrDefault(patch.amplitudeDivisor, base.amplitudeDivisor),
    strandSeparationDivisor: positiveOrDefault(patch.strandSeparationDivisor, base.strandSeparationDivisor),
    crossTieCount: positiveOrDefault(patch.crossTieCount, base.crossTieCount),
    strandAlpha: typeof patch.strandAlpha === "number" ? clamp(patch.strandAlpha, 0, 1) : base.strandAlpha,
    rungAlpha: typeof patch.rungAlpha === "number" ? clamp(patch.rungAlpha, 0, 1) : base.rungAlpha
  };
}

function positiveOrDefault(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function fillBackground(ctx, dims, bgColor) {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, dims.width, dims.height);

  // Soft radial glow keeps depth without animation (why: layered geometry covenant).
  const radius = Math.max(dims.width, dims.height) / 2;
  const gradient = ctx.createRadialGradient(
    dims.width / 2,
    dims.height / 3,
    radius / 9,
    dims.width / 2,
    dims.height / 2,
    radius
  );
  gradient.addColorStop(0, withAlpha("#ffffff", 0.05));
  gradient.addColorStop(1, withAlpha(bgColor, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

function drawVesicaField(ctx, dims, color, numbers, config) {
  const cols = Math.max(2, Math.round(config.columns));
  const rows = Math.max(2, Math.round(config.rows));
  const padding = Math.min(dims.width, dims.height) / config.paddingDivisor;
  const usableWidth = dims.width - padding * 2;
  const usableHeight = dims.height - padding * 2;
  const stepX = usableWidth / (cols - 1);
  const stepY = usableHeight / (rows - 1);
  const radius = Math.min(stepX, stepY) * config.radiusScale;
  const strokeWidth = Math.max(1, Math.min(dims.width, dims.height) / config.strokeDivisor);

  ctx.save();
  ctx.globalAlpha = config.alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;

  let circles = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = padding + col * stepX;
      const y = padding + row * stepY;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      circles += 1;
    }
  }

  // Axis guides emphasise the vesica symmetry without animation.
  ctx.globalAlpha = config.alpha * 0.8;
  ctx.beginPath();
  ctx.moveTo(dims.width / 2, padding);
  ctx.lineTo(dims.width / 2, dims.height - padding);
  ctx.moveTo(padding, dims.height / 2);
  ctx.lineTo(dims.width - padding, dims.height / 2);
  ctx.stroke();

  ctx.restore();
  return { circles };
}

function drawTreeOfLife(ctx, dims, palette, numbers, config) {
  const margin = Math.min(dims.width, dims.height) / config.marginDivisor;
  const maxLevel = Math.max(...config.nodes.map((node) => node.level));
  const verticalSpan = dims.height - margin * 2;
  const levelStep = maxLevel > 0 ? verticalSpan / maxLevel : 0;
  const radius = Math.min(dims.width, dims.height) / config.radiusDivisor;
  const pathWidth = Math.max(1.2, Math.min(dims.width, dims.height) / config.pathDivisor * numbers.THREE);

  const positions = new Map();
  for (const node of config.nodes) {
    const x = margin + clamp(node.xFactor, 0, 1) * (dims.width - margin * 2);
    const y = margin + node.level * levelStep;
    positions.set(node.id, { x, y, title: node.title });
  }

  ctx.save();
  ctx.lineWidth = pathWidth;
  ctx.strokeStyle = palette.layers[1];
  ctx.globalAlpha = config.pathAlpha;
  ctx.beginPath();
  for (const [from, to] of config.edges) {
    const start = positions.get(from);
    const end = positions.get(to);
    if (!start || !end) {
      continue;
    }
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
  }
  ctx.stroke();

  ctx.globalAlpha = config.nodeAlpha;
  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, radius / numbers.SEVEN);
  for (const node of config.nodes) {
    const pos = positions.get(node.id);
    if (!pos) {
      continue;
    }
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.globalAlpha = config.labelAlpha;
  ctx.fillStyle = palette.ink;
  ctx.font = `${Math.max(10, radius * 1.5)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const node of config.nodes) {
    const pos = positions.get(node.id);
    if (!pos) {
      continue;
    }
    ctx.fillText(node.title, pos.x, pos.y + radius * 1.1);
  }

  ctx.restore();
  return { nodes: config.nodes.length, paths: config.edges.length };
}

function drawFibonacciCurve(ctx, dims, color, numbers, config) {
  const samples = Math.max(2, Math.round(config.sampleCount));
  const maxTheta = config.turns * Math.PI;
  const step = maxTheta / (samples - 1);
  const minDim = Math.min(dims.width, dims.height);
  const baseRadius = minDim / config.baseRadiusDivisor;
  const centerX = dims.width * clamp(config.centerXFactor, 0, 1);
  const centerY = dims.height * clamp(config.centerYFactor, 0, 1);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = config.alpha;
  ctx.lineWidth = Math.max(1.2, minDim / numbers.NINETYNINE * numbers.THREE);
  ctx.beginPath();

  const points = [];
  for (let i = 0; i < samples; i += 1) {
    const theta = i * step;
    const radius = baseRadius * Math.pow(config.phi, theta / Math.PI);
    const x = centerX + Math.cos(theta) * radius;
    const y = centerY + Math.sin(theta) * radius;
    points.push({ x, y });
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.fillStyle = color;
  const markerRadius = Math.max(2, minDim / numbers.ONEFORTYFOUR);
  let markers = 0;
  for (let i = 0; i < points.length; i += config.markerInterval) {
    const point = points[i];
    ctx.beginPath();
    ctx.arc(point.x, point.y, markerRadius, 0, Math.PI * 2);
    ctx.fill();
    markers += 1;
  }

  ctx.restore();
  return { samples, markers };
}

function drawHelixLattice(ctx, dims, palette, numbers, config) {
  const samples = Math.max(2, Math.round(config.sampleCount));
  const minDim = Math.min(dims.width, dims.height);
  const amplitude = minDim / config.amplitudeDivisor;
  const separation = minDim / config.strandSeparationDivisor;
  const baseY = dims.height / 2;
  const stepX = dims.width / (samples - 1);

  ctx.save();
  ctx.lineWidth = Math.max(1.4, minDim / numbers.NINETYNINE * numbers.THREE);

  const strandA = [];
  const strandB = [];
  for (let i = 0; i < samples; i += 1) {
    const t = i / (samples - 1);
    const angle = t * config.cycles * Math.PI * 2;
    const x = i * stepX;
    const yA = baseY - separation / 2 + Math.sin(angle) * amplitude;
    const yB = baseY + separation / 2 + Math.sin(angle + Math.PI) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.globalAlpha = config.strandAlpha;
  ctx.strokeStyle = palette.layers[4];
  ctx.beginPath();
  for (let i = 0; i < strandA.length; i += 1) {
    const point = strandA[i];
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.stroke();

  ctx.strokeStyle = palette.layers[5];
  ctx.beginPath();
  for (let i = 0; i < strandB.length; i += 1) {
    const point = strandB[i];
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.stroke();

  ctx.globalAlpha = config.rungAlpha;
  ctx.strokeStyle = palette.muted || palette.ink;
  const ties = Math.max(1, Math.round(config.crossTieCount));
  for (let i = 0; i < ties; i += 1) {
    const index = Math.round((i / (ties - 1 || 1)) * (samples - 1));
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
  return { strandPoints: samples * 2, crossTies: ties };
}

function drawCanvasNotice(ctx, dims, ink, muted, text) {
  ctx.save();
  ctx.globalAlpha = 1;
  const padding = Math.min(dims.width, dims.height) / 33;
  const x = padding;
  const y = dims.height - padding * 1.4;
  const background = withAlpha(muted || ink, 0.35);
  const fontSize = Math.max(12, Math.min(dims.width, dims.height) / 48);

  ctx.font = `${fontSize}px system-ui`;
  const width = ctx.measureText(text).width + padding;

  ctx.fillStyle = background;
  ctx.fillRect(x - padding / 4, y - fontSize, width, fontSize * 1.8);

  ctx.fillStyle = ink;
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y - fontSize * 0.2);
  ctx.restore();
}

function summariseLayers(stats) {
  const vesicaPart = `Vesica ${stats.vesicaStats.circles} circles`;
  const treePart = `Paths ${stats.treeStats.paths} / Nodes ${stats.treeStats.nodes}`;
  const fibPart = `Spiral ${stats.fibonacciStats.samples} samples`;
  const helixPart = `Helix ${stats.helixStats.crossTies} ties`;
  return `${vesicaPart} · ${treePart} · ${fibPart} · ${helixPart}`;
}

function withAlpha(color, alpha) {
  const value = typeof color === "string" ? color.trim() : "";
  if (!value.startsWith("#")) {
    return color;
  }
  const hex = value.slice(1);
  const bigint = hex.length === 3
    ? parseInt(hex.split("").map((ch) => ch + ch).join(""), 16)
    : parseInt(hex.padEnd(6, "0"), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

function buildTreeNodes() {
  return [
    { id: "kether", title: "Kether", level: 0, xFactor: 0.5 },
    { id: "chokmah", title: "Chokmah", level: 1, xFactor: 0.72 },
    { id: "binah", title: "Binah", level: 1, xFactor: 0.28 },
    { id: "chesed", title: "Chesed", level: 2, xFactor: 0.68 },
    { id: "geburah", title: "Geburah", level: 2, xFactor: 0.32 },
    { id: "tiphareth", title: "Tiphareth", level: 3, xFactor: 0.5 },
    { id: "netzach", title: "Netzach", level: 4, xFactor: 0.66 },
    { id: "hod", title: "Hod", level: 4, xFactor: 0.34 },
    { id: "yesod", title: "Yesod", level: 5, xFactor: 0.5 },
    { id: "malkuth", title: "Malkuth", level: 6, xFactor: 0.5 }
  ];
}

function buildTreeEdges() {
  return [
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
  ];
}
