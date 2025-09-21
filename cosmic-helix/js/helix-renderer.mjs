/*
  helix-renderer.mjs

  ND-safe static renderer for the four-layer Cosmic Helix canvas.
  The helpers are pure and sequenced so the canvas paints once without motion.
  Layer order (back to front):
    1) Vesica field — intersecting circles to ground the vesica piscis grid.
    2) Tree-of-Life scaffold — ten sephirot nodes with twenty-two calm paths.
    3) Fibonacci curve — logarithmic spiral sampled with 144 golden-ratio steps.
    4) Double-helix lattice — two still strands with thirty-three cross ties.

  Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) parameterise spacing so
  sacred ratios remain readable without animation (why: honours ND-safe pacing).
*/

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

const FALLBACK_LAYERS = Object.freeze([
  "#b1c7ff",
  "#89f7fe",
  "#a0ffa1",
  "#ffd27f",
  "#f5a3ff",
  "#d0d0e6"
]);

const FALLBACK_PALETTE = Object.freeze({
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: FALLBACK_LAYERS
});

const DEFAULT_GEOMETRY = Object.freeze({
  vesica: Object.freeze({
    rows: DEFAULT_NUM.NINE,
    columns: DEFAULT_NUM.ELEVEN,
    paddingFactor: DEFAULT_NUM.ELEVEN,
    radiusFactor: DEFAULT_NUM.SEVEN / DEFAULT_NUM.THREE,
    strokeDivisor: DEFAULT_NUM.NINETYNINE,
    alpha: 0.55
  }),
  treeOfLife: Object.freeze({
    marginFactor: DEFAULT_NUM.ELEVEN,
    radiusDivisor: DEFAULT_NUM.THIRTYTHREE,
    pathWidthDivisor: DEFAULT_NUM.THIRTYTHREE,
    labelOffset: DEFAULT_NUM.ELEVEN,
    labelFont: "12px system-ui, -apple-system, Segoe UI, sans-serif",
    nodes: Object.freeze([
      { id: "kether", title: "Kether", meaning: "Crown", level: 0, xFactor: 0.5 },
      { id: "chokmah", title: "Chokmah", meaning: "Wisdom", level: 1, xFactor: 0.72 },
      { id: "binah", title: "Binah", meaning: "Understanding", level: 1, xFactor: 0.28 },
      { id: "chesed", title: "Chesed", meaning: "Mercy", level: 2, xFactor: 0.68 },
      { id: "geburah", title: "Geburah", meaning: "Severity", level: 2, xFactor: 0.32 },
      { id: "tiphareth", title: "Tiphareth", meaning: "Beauty", level: 3, xFactor: 0.5 },
      { id: "netzach", title: "Netzach", meaning: "Victory", level: 4, xFactor: 0.64 },
      { id: "hod", title: "Hod", meaning: "Glory", level: 4, xFactor: 0.36 },
      { id: "yesod", title: "Yesod", meaning: "Foundation", level: 5, xFactor: 0.5 },
      { id: "malkuth", title: "Malkuth", meaning: "Kingdom", level: 6, xFactor: 0.5 }
    ]),
    edges: Object.freeze([
      ["kether", "chokmah"], ["kether", "binah"], ["kether", "tiphareth"],
      ["chokmah", "binah"], ["chokmah", "tiphareth"], ["chokmah", "chesed"],
      ["chokmah", "netzach"], ["binah", "tiphareth"], ["binah", "geburah"],
      ["binah", "hod"], ["chesed", "geburah"], ["chesed", "tiphareth"],
      ["chesed", "netzach"], ["geburah", "tiphareth"], ["geburah", "hod"],
      ["tiphareth", "netzach"], ["tiphareth", "hod"], ["tiphareth", "yesod"],
      ["netzach", "hod"], ["netzach", "yesod"], ["hod", "yesod"], ["yesod", "malkuth"]
    ])
  }),
  fibonacci: Object.freeze({
    sampleCount: DEFAULT_NUM.ONEFORTYFOUR,
    turns: DEFAULT_NUM.THREE,
    baseRadiusDivisor: DEFAULT_NUM.NINE,
    phi: 1.618033988749895,
    alpha: 0.85,
    thickness: 2.5,
    centerOffsetX: 0.62,
    centerOffsetY: 0.58
  }),
  helix: Object.freeze({
    strandPoints: DEFAULT_NUM.NINETYNINE,
    rungCount: DEFAULT_NUM.THIRTYTHREE,
    sideMarginDivisor: DEFAULT_NUM.ELEVEN,
    amplitudeDivisor: DEFAULT_NUM.NINE,
    frequencyTurns: DEFAULT_NUM.SEVEN / DEFAULT_NUM.THREE,
    strandThickness: 2.5,
    rungAlpha: 0.6,
    verticalCenterOffset: 0
  })
});

export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    return { ok: false, reason: "Invalid 2D context" };
  }

  const width = toPositiveNumber(options.width, ctx.canvas.width);
  const height = toPositiveNumber(options.height, ctx.canvas.height);
  const numbers = normaliseNumbers(options.NUM);
  const palette = normalisePalette(options.palette);
  const geometry = normaliseGeometry(options.geometry);
  const notice = typeof options.notice === "string" && options.notice.trim() ? options.notice.trim() : null;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  const dims = { width, height };
  drawVesicaField(ctx, dims, palette, geometry.vesica, numbers);
  drawTreeOfLife(ctx, dims, palette, geometry.treeOfLife, numbers);
  drawFibonacciCurve(ctx, dims, palette, geometry.fibonacci, numbers);
  drawDoubleHelix(ctx, dims, palette, geometry.helix, numbers);

  if (notice) {
    drawNotice(ctx, dims, palette, notice);
  }

  return { ok: true, notice };
}

function drawVesicaField(ctx, dims, palette, geo, numbers) {
  const columns = Math.max(2, Math.floor(toPositiveNumber(geo.columns, DEFAULT_GEOMETRY.vesica.columns)));
  const rows = Math.max(2, Math.floor(toPositiveNumber(geo.rows, DEFAULT_GEOMETRY.vesica.rows)));
  const margin = Math.min(dims.width, dims.height) / toPositiveNumber(geo.paddingFactor, DEFAULT_GEOMETRY.vesica.paddingFactor);
  const gridWidth = dims.width - margin * 2;
  const gridHeight = dims.height - margin * 2;
  const stepX = gridWidth / (columns - 1);
  const stepY = gridHeight / (rows - 1);
  const baseRadius = Math.min(stepX, stepY) / toPositiveNumber(geo.radiusFactor, DEFAULT_GEOMETRY.vesica.radiusFactor);
  const strokeDivisor = toPositiveNumber(geo.strokeDivisor, DEFAULT_GEOMETRY.vesica.strokeDivisor);
  const strokeWidth = Math.max(0.75, Math.min(stepX, stepY) / strokeDivisor * numbers.THREE);

  ctx.save();
  ctx.strokeStyle = applyAlpha(getLayerColor(palette, 0), clamp01(geo.alpha));
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const x = margin + col * stepX;
      const y = margin + row * stepY;
      ctx.beginPath();
      ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Highlight central vesica pair (why: keeps womb-of-forms emphasis without motion).
  const centerRadius = Math.min(gridWidth, gridHeight) / numbers.THREE;
  const centerX = dims.width / 2;
  const centerY = dims.height / 2;
  ctx.strokeStyle = applyAlpha(getLayerColor(palette, 1), clamp01(geo.alpha * 0.75));
  ctx.beginPath();
  ctx.arc(centerX - centerRadius / 2, centerY, centerRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(centerX + centerRadius / 2, centerY, centerRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawTreeOfLife(ctx, dims, palette, geo, numbers) {
  const margin = Math.min(dims.width, dims.height) / toPositiveNumber(geo.marginFactor, DEFAULT_GEOMETRY.treeOfLife.marginFactor);
  const verticalSpace = dims.height - margin * 2;
  const levels = geo.nodes.map(node => node.level);
  const maxLevel = levels.length ? Math.max(...levels) : 1;
  const levelStep = maxLevel > 0 ? verticalSpace / maxLevel : verticalSpace;
  const usableWidth = dims.width - margin * 2;
  const nodeRadius = Math.max(6, Math.min(dims.width, dims.height) / toPositiveNumber(geo.radiusDivisor, DEFAULT_GEOMETRY.treeOfLife.radiusDivisor));
  const pathWidth = Math.max(1.5, nodeRadius / toPositiveNumber(geo.pathWidthDivisor, DEFAULT_GEOMETRY.treeOfLife.pathWidthDivisor) * numbers.SEVEN);

  const positions = new Map();
  geo.nodes.forEach(node => {
    const x = margin + clamp01(node.xFactor) * usableWidth;
    const y = margin + node.level * levelStep;
    positions.set(node.id, { x, y, data: node });
  });

  ctx.save();
  ctx.strokeStyle = applyAlpha(getLayerColor(palette, 1), 0.7);
  ctx.lineWidth = pathWidth;
  ctx.lineCap = "round";

  geo.edges.forEach(edge => {
    const a = positions.get(edge[0]);
    const b = positions.get(edge[1]);
    if (!a || !b) return;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.restore();

  ctx.save();
  ctx.fillStyle = getLayerColor(palette, 2);
  ctx.strokeStyle = applyAlpha(palette.ink, 0.4);
  ctx.lineWidth = Math.max(1, nodeRadius / numbers.THIRTYTHREE * numbers.THREE);

  geo.nodes.forEach(node => {
    const position = positions.get(node.id);
    if (!position) return;
    ctx.beginPath();
    ctx.arc(position.x, position.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.fillStyle = palette.ink;
  ctx.font = geo.labelFont || DEFAULT_GEOMETRY.treeOfLife.labelFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const labelOffset = typeof geo.labelOffset === "number"
    ? geo.labelOffset
    : DEFAULT_GEOMETRY.treeOfLife.labelOffset;

  geo.nodes.forEach(node => {
    const position = positions.get(node.id);
    if (!position) return;
    const labelY = position.y + nodeRadius + labelOffset;
    const text = `${node.title}`;
    ctx.fillText(text, position.x, labelY);
  });

  ctx.restore();
}

function drawFibonacciCurve(ctx, dims, palette, geo, numbers) {
  const samples = Math.max(8, Math.floor(toPositiveNumber(geo.sampleCount, DEFAULT_GEOMETRY.fibonacci.sampleCount)));
  const turns = toPositiveNumber(geo.turns, DEFAULT_GEOMETRY.fibonacci.turns);
  const phi = toPositiveNumber(geo.phi, DEFAULT_GEOMETRY.fibonacci.phi);
  const baseRadius = Math.min(dims.width, dims.height) / toPositiveNumber(geo.baseRadiusDivisor, DEFAULT_GEOMETRY.fibonacci.baseRadiusDivisor);
  const totalAngle = turns * Math.PI * 2;
  const centerX = dims.width * clamp01(geo.centerOffsetX);
  const centerY = dims.height * clamp01(geo.centerOffsetY);

  const points = [];
  for (let i = 0; i < samples; i += 1) {
    const t = i / (samples - 1);
    const angle = t * totalAngle;
    const radius = baseRadius * Math.pow(phi, angle / Math.PI);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push({ x, y });
  }

  ctx.save();
  ctx.lineWidth = toPositiveNumber(geo.thickness, DEFAULT_GEOMETRY.fibonacci.thickness);
  ctx.strokeStyle = applyAlpha(getLayerColor(palette, 3), clamp01(geo.alpha));
  ctx.lineCap = "round";
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
}

function drawDoubleHelix(ctx, dims, palette, geo, numbers) {
  const pointsCount = Math.max(2, Math.floor(toPositiveNumber(geo.strandPoints, DEFAULT_GEOMETRY.helix.strandPoints)));
  const rungCount = Math.max(2, Math.floor(toPositiveNumber(geo.rungCount, DEFAULT_GEOMETRY.helix.rungCount)));
  const sideMargin = dims.width / toPositiveNumber(geo.sideMarginDivisor, DEFAULT_GEOMETRY.helix.sideMarginDivisor);
  const amplitude = Math.min(dims.width, dims.height) / toPositiveNumber(geo.amplitudeDivisor, DEFAULT_GEOMETRY.helix.amplitudeDivisor);
  const frequency = Math.PI * 2 * toPositiveNumber(geo.frequencyTurns, DEFAULT_GEOMETRY.helix.frequencyTurns);
  const strandThickness = toPositiveNumber(geo.strandThickness, DEFAULT_GEOMETRY.helix.strandThickness);
  const centerY = dims.height / 2 + (geo.verticalCenterOffset || 0);
  const startX = sideMargin;
  const endX = dims.width - sideMargin;
  const length = endX - startX;

  const strandA = [];
  const strandB = [];
  for (let i = 0; i < pointsCount; i += 1) {
    const t = i / (pointsCount - 1);
    const angle = t * frequency;
    const x = startX + t * length;
    const yA = centerY + Math.sin(angle) * amplitude;
    const yB = centerY + Math.sin(angle + Math.PI) * amplitude;
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = strandThickness;
  ctx.strokeStyle = applyAlpha(getLayerColor(palette, 4), 0.9);
  drawPolyline(ctx, strandA);
  ctx.strokeStyle = applyAlpha(getLayerColor(palette, 5), 0.85);
  drawPolyline(ctx, strandB);

  ctx.lineWidth = Math.max(1, strandThickness * 0.75);
  ctx.strokeStyle = applyAlpha(getLayerColor(palette, 5), clamp01(geo.rungAlpha));
  for (let i = 0; i < rungCount; i += 1) {
    const t = rungCount === 1 ? 0 : i / (rungCount - 1);
    const pointA = sampleAt(strandA, t);
    const pointB = sampleAt(strandB, t);
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPolyline(ctx, points) {
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

function sampleAt(points, t) {
  if (!points.length) {
    return { x: 0, y: 0 };
  }
  if (points.length === 1) {
    return points[0];
  }
  const clamped = clamp01(t);
  const index = clamped * (points.length - 1);
  const lower = Math.floor(index);
  const upper = Math.min(points.length - 1, lower + 1);
  const ratio = index - lower;
  const a = points[lower];
  const b = points[upper];
  return {
    x: a.x + (b.x - a.x) * ratio,
    y: a.y + (b.y - a.y) * ratio
  };
}

function drawNotice(ctx, dims, palette, notice) {
  const lines = notice.split(/\n+/).map(line => line.trim()).filter(Boolean);
  if (!lines.length) {
    return;
  }

  ctx.save();
  const fontSize = 12;
  const lineHeight = fontSize * 1.4;
  ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.textBaseline = "top";

  let maxWidth = 0;
  lines.forEach(line => {
    const metrics = ctx.measureText ? ctx.measureText(line) : { width: line.length * fontSize * 0.6 };
    if (metrics.width > maxWidth) {
      maxWidth = metrics.width;
    }
  });

  const padding = 8;
  const boxWidth = maxWidth + padding * 2;
  const boxHeight = lines.length * lineHeight + padding * 2;
  const x = padding;
  const y = dims.height - boxHeight - padding;

  const accent = getLayerColor(palette, 5);
  const fillStyle = applyAlpha(accent, 0.15);
  const strokeStyle = applyAlpha(accent, 0.45);

  if (typeof ctx.roundRect === "function") {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, boxWidth, boxHeight, 6);
    ctx.fill();
    ctx.stroke();
  } else {
    drawRoundedRect(ctx, x, y, boxWidth, boxHeight, 6, fillStyle, strokeStyle);
  }

  ctx.fillStyle = palette.ink;
  lines.forEach((line, index) => {
    ctx.fillText(line, x + padding, y + padding + index * lineHeight);
  });

  ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle) {
  const r = Math.max(0, radius);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();
}

function normaliseNumbers(custom) {
  const merged = { ...DEFAULT_NUM };
  if (custom && typeof custom === "object") {
    Object.keys(DEFAULT_NUM).forEach(key => {
      if (hasFiniteNumber(custom[key])) {
        merged[key] = Math.max(1, Number(custom[key]));
      }
    });
  }
  return merged;
}

function normalisePalette(custom) {
  const palette = {
    bg: FALLBACK_PALETTE.bg,
    ink: FALLBACK_PALETTE.ink,
    muted: FALLBACK_PALETTE.muted,
    layers: [...FALLBACK_LAYERS]
  };

  if (!custom || typeof custom !== "object") {
    return palette;
  }

  if (isHex(custom.bg)) {
    palette.bg = custom.bg;
  }
  if (isHex(custom.ink)) {
    palette.ink = custom.ink;
  }
  if (isHex(custom.muted)) {
    palette.muted = custom.muted;
  }
  if (Array.isArray(custom.layers)) {
    custom.layers.forEach((value, index) => {
      if (isHex(value) && index < palette.layers.length) {
        palette.layers[index] = value;
      }
    });
  }

  return palette;
}

function normaliseGeometry(custom) {
  const geometry = cloneDefaultGeometry();
  if (!custom || typeof custom !== "object") {
    return geometry;
  }

  if (custom.vesica) {
    geometry.vesica = {
      ...geometry.vesica,
      ...pickPositive(custom.vesica, ["rows", "columns", "paddingFactor", "radiusFactor", "strokeDivisor", "alpha"])
    };
  }

  if (custom.treeOfLife) {
    const source = custom.treeOfLife;
    geometry.treeOfLife = {
      ...geometry.treeOfLife,
      ...pickPositive(source, ["marginFactor", "radiusDivisor", "pathWidthDivisor"])
    };
    if (typeof source.labelFont === "string") {
      geometry.treeOfLife.labelFont = source.labelFont;
    }
    if (hasFiniteNumber(source.labelOffset)) {
      geometry.treeOfLife.labelOffset = source.labelOffset;
    }
    if (Array.isArray(source.nodes) && source.nodes.length) {
      geometry.treeOfLife.nodes = source.nodes.map(node => ({
        id: node.id,
        title: node.title,
        meaning: node.meaning,
        level: hasFiniteNumber(node.level) ? node.level : 0,
        xFactor: hasFiniteNumber(node.xFactor) ? node.xFactor : 0.5
      }));
    }
    if (Array.isArray(source.edges) && source.edges.length) {
      geometry.treeOfLife.edges = source.edges
        .filter(edge => Array.isArray(edge) && edge.length === 2)
        .map(edge => [String(edge[0]), String(edge[1])]);
    }
  }

  if (custom.fibonacci) {
    geometry.fibonacci = {
      ...geometry.fibonacci,
      ...pickPositive(custom.fibonacci, ["sampleCount", "turns", "baseRadiusDivisor", "phi", "alpha", "thickness", "centerOffsetX", "centerOffsetY"])
    };
  }

  if (custom.helix) {
    geometry.helix = {
      ...geometry.helix,
      ...pickPositive(custom.helix, ["strandPoints", "rungCount", "sideMarginDivisor", "amplitudeDivisor", "frequencyTurns", "strandThickness", "rungAlpha", "verticalCenterOffset"])
    };
  }

  return geometry;
}

function cloneDefaultGeometry() {
  return {
    vesica: { ...DEFAULT_GEOMETRY.vesica },
    treeOfLife: {
      ...DEFAULT_GEOMETRY.treeOfLife,
      nodes: DEFAULT_GEOMETRY.treeOfLife.nodes.map(node => ({ ...node })),
      edges: DEFAULT_GEOMETRY.treeOfLife.edges.map(edge => [...edge])
    },
    fibonacci: { ...DEFAULT_GEOMETRY.fibonacci },
    helix: { ...DEFAULT_GEOMETRY.helix }
  };
}

function pickPositive(source, keys) {
  const result = {};
  keys.forEach(key => {
    if (hasFiniteNumber(source[key])) {
      result[key] = Number(source[key]);
    }
  });
  return result;
}

function toPositiveNumber(value, fallback) {
  if (hasFiniteNumber(value)) {
    const numeric = Number(value);
    return numeric > 0 ? numeric : fallback;
  }
  return fallback;
}

function hasFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp01(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  if (numeric < 0) {
    return 0;
  }
  if (numeric > 1) {
    return 1;
  }
  return numeric;
}

function getLayerColor(palette, index) {
  const layers = Array.isArray(palette.layers) ? palette.layers : FALLBACK_LAYERS;
  if (index >= 0 && index < layers.length && isHex(layers[index])) {
    return layers[index];
  }
  return FALLBACK_LAYERS[Math.min(index, FALLBACK_LAYERS.length - 1)];
}

function isHex(value) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function applyAlpha(hex, alpha) {
  const rgb = hexToRgb(isHex(hex) ? hex : "#ffffff");
  const safeAlpha = clamp01(alpha);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${safeAlpha})`;
}

function hexToRgb(hex) {
  const normalised = hex.replace("#", "");
  return {
    r: parseInt(normalised.slice(0, 2), 16),
    g: parseInt(normalised.slice(2, 4), 16),
    b: parseInt(normalised.slice(4, 6), 16)
  };
}
