/*
  helix-renderer.mjs — Atelier edition
  ND-safe static renderer for the Cosmic Helix canvas now hosted under site/publish/.

  Layers render back-to-front:
    1) Vesica field — intersecting circles forming the womb-of-forms lattice.
    2) Tree-of-Life scaffold — ten sephirot nodes joined by twenty-two calm paths.
    3) Fibonacci curve — logarithmic spiral sampling growth ratios without motion.
    4) Double-helix lattice — twin strands with cross ties, entirely static.

  ND-safe rationale:
    - All helpers are pure and synchronous. Rendering happens once to avoid motion.
    - Palette, numerology, and geometry accept offline fallbacks when JSON files are missing.
    - Comments document calm contrasts and layered depth choices for trauma-informed review.
*/

export const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

export const DEFAULT_NUMBERS = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
};

export const DEFAULT_GEOMETRY = {
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

export function renderHelix(ctx, input = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    return { ok: false, reason: "missing-context" };
  }

  const config = normaliseConfig(ctx, input);
  const { dims, palette, numbers, geometry, notice } = config;

  ctx.save();
  clearStage(ctx, dims, palette.bg);

  const vesicaStats = drawVesicaField(ctx, dims, palette, numbers, geometry.vesica);
  const treeStats = drawTreeOfLife(ctx, dims, palette, numbers, geometry.treeOfLife);
  const fibonacciStats = drawFibonacciCurve(ctx, dims, palette, numbers, geometry.fibonacci);
  const helixStats = drawHelixLattice(ctx, dims, palette, numbers, geometry.helix);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette.ink, notice);
  }

  ctx.restore();
  return {
    ok: true,
    summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats })
  };
}

function normaliseConfig(ctx, input) {
  const width = clampDimension(input.width, ctx.canvas.width);
  const height = clampDimension(input.height, ctx.canvas.height);
  const dims = { width, height };
  const palette = mergePalette(input.palette);
  const numbers = mergeNumbers(input.NUM);
  const geometry = mergeGeometry(input.geometry);
  const notice = typeof input.notice === "string" && input.notice.trim().length > 0 ? input.notice.trim() : null;
  return { dims, palette, numbers, geometry, notice };
}

function clampDimension(candidate, fallback) {
  const value = Number(candidate);
  if (Number.isFinite(value) && value > 0) {
    return value;
  }
  return Number(fallback);
}

function mergePalette(candidate) {
  const source = candidate && typeof candidate === "object" ? candidate : {};
  const layers = Array.isArray(source.layers) ? source.layers.slice(0, DEFAULT_PALETTE.layers.length) : [];
  while (layers.length < DEFAULT_PALETTE.layers.length) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }
  return {
    bg: typeof source.bg === "string" ? source.bg : DEFAULT_PALETTE.bg,
    ink: typeof source.ink === "string" ? source.ink : DEFAULT_PALETTE.ink,
    layers
  };
}

function mergeNumbers(candidate) {
  const source = candidate && typeof candidate === "object" ? candidate : {};
  const merged = { ...DEFAULT_NUMBERS };
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    const value = Number(source[key]);
    if (Number.isFinite(value) && value > 0) {
      merged[key] = value;
    }
  }
  return merged;
}

function mergeGeometry(candidate) {
  const source = candidate && typeof candidate === "object" ? candidate : {};
  return {
    vesica: normaliseVesica(source.vesica),
    treeOfLife: normaliseTree(source.treeOfLife),
    fibonacci: normaliseFibonacci(source.fibonacci),
    helix: normaliseHelix(source.helix)
  };
}

function normaliseVesica(candidate) {
  const base = candidate && typeof candidate === "object" ? candidate : {};
  const fallback = DEFAULT_GEOMETRY.vesica;
  return {
    rows: positiveInteger(base.rows, fallback.rows),
    columns: positiveInteger(base.columns, fallback.columns),
    paddingDivisor: positiveNumber(base.paddingDivisor, fallback.paddingDivisor),
    radiusFactor: positiveNumber(base.radiusFactor, fallback.radiusFactor),
    strokeDivisor: positiveNumber(base.strokeDivisor, fallback.strokeDivisor),
    alpha: clampAlpha(base.alpha, fallback.alpha)
  };
}

function normaliseTree(candidate) {
  const base = candidate && typeof candidate === "object" ? candidate : {};
  const fallback = DEFAULT_GEOMETRY.treeOfLife;
  const fallbackNodes = fallback.nodes;
  const provided = Array.isArray(base.nodes) && base.nodes.length > 0 ? base.nodes : fallbackNodes;
  const nodes = provided.map((entry, index) => {
    const source = entry && typeof entry === "object" ? entry : {};
    const reference = fallbackNodes.find((node) => node.id === source.id) || fallbackNodes[index % fallbackNodes.length];
    return {
      id: typeof source.id === "string" && source.id ? source.id : reference.id,
      title: typeof source.title === "string" && source.title ? source.title : reference.title,
      meaning: typeof source.meaning === "string" && source.meaning ? source.meaning : reference.meaning,
      level: finiteNumber(source.level, reference.level),
      xFactor: clamp01(finiteNumber(source.xFactor, reference.xFactor))
    };
  });

  const allowedIds = new Set(nodes.map((node) => node.id));
  const sourceEdges = Array.isArray(base.edges) && base.edges.length > 0 ? base.edges : fallback.edges;
  const edges = sourceEdges
    .map((edge) => (Array.isArray(edge) ? edge.slice(0, 2) : []))
    .filter((edge) => edge.length === 2 && allowedIds.has(edge[0]) && allowedIds.has(edge[1]));

  return {
    marginDivisor: positiveNumber(base.marginDivisor, fallback.marginDivisor),
    radiusDivisor: positiveNumber(base.radiusDivisor, fallback.radiusDivisor),
    labelOffset: finiteNumber(base.labelOffset, fallback.labelOffset),
    labelFont: typeof base.labelFont === "string" && base.labelFont ? base.labelFont : fallback.labelFont,
    nodes,
    edges
  };
}

function normaliseFibonacci(candidate) {
  const base = candidate && typeof candidate === "object" ? candidate : {};
  const fallback = DEFAULT_GEOMETRY.fibonacci;
  return {
    sampleCount: positiveInteger(base.sampleCount, fallback.sampleCount),
    turns: positiveNumber(base.turns, fallback.turns),
    baseRadiusDivisor: positiveNumber(base.baseRadiusDivisor, fallback.baseRadiusDivisor),
    phi: positiveNumber(base.phi, fallback.phi),
    alpha: clampAlpha(base.alpha, fallback.alpha)
  };
}

function normaliseHelix(candidate) {
  const base = candidate && typeof candidate === "object" ? candidate : {};
  const fallback = DEFAULT_GEOMETRY.helix;
  return {
    sampleCount: positiveInteger(base.sampleCount, fallback.sampleCount),
    cycles: positiveNumber(base.cycles, fallback.cycles),
    amplitudeDivisor: positiveNumber(base.amplitudeDivisor, fallback.amplitudeDivisor),
    phaseOffset: finiteNumber(base.phaseOffset, fallback.phaseOffset),
    crossTieCount: positiveInteger(base.crossTieCount, fallback.crossTieCount),
    strandAlpha: clampAlpha(base.strandAlpha, fallback.strandAlpha),
    rungAlpha: clampAlpha(base.rungAlpha, fallback.rungAlpha)
  };
}

function drawVesicaField(ctx, dims, palette, numbers, settings) {
  const rows = Math.max(2, settings.rows);
  const columns = Math.max(2, settings.columns);
  const padding = Math.min(dims.width, dims.height) / settings.paddingDivisor;
  const innerWidth = dims.width - padding * 2;
  const innerHeight = dims.height - padding * 2;
  const stepX = columns > 1 ? innerWidth / (columns - 1) : 0;
  const stepY = rows > 1 ? innerHeight / (rows - 1) : 0;
  const radius = Math.min(stepX, stepY) / settings.radiusFactor;
  const offset = radius * (numbers.NINE / numbers.TWENTYTWO);
  const strokeWidth = Math.max(1, Math.min(dims.width, dims.height) / settings.strokeDivisor);

  ctx.save();
  ctx.globalAlpha = clampAlpha(settings.alpha, 0.6);
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = padding + col * stepX;
      const cy = padding + row * stepY;
      drawVesicaPair(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
  return { circles: rows * columns * 2, radius };
}

function drawVesicaPair(ctx, cx, cy, radius, offset) {
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
  const maxLevel = settings.nodes.reduce((acc, node) => Math.max(acc, node.level), 0);
  const levelStep = maxLevel > 0 ? usableHeight / maxLevel : 0;
  const radius = Math.max(4, Math.min(dims.width, dims.height) / settings.radiusDivisor);
  const edgeWidth = Math.max(1, Math.min(dims.width, dims.height) / numbers.NINETYNINE);

  const positions = new Map();
  settings.nodes.forEach((node) => {
    const x = margin + clamp01(node.xFactor) * usableWidth;
    const y = margin + node.level * levelStep;
    positions.set(node.id, { x, y, node });
  });

  ctx.save();
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = palette.layers[1];
  ctx.lineWidth = edgeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  settings.edges.forEach((edge) => {
    const from = positions.get(edge[0]);
    const to = positions.get(edge[1]);
    if (!from || !to) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, edgeWidth * 0.75);
  positions.forEach((pos) => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.restore();
  return { nodes: positions.size, paths: settings.edges.length };
}

function drawFibonacciCurve(ctx, dims, palette, numbers, settings) {
  const count = Math.max(2, settings.sampleCount);
  const turns = settings.turns;
  const totalAngle = turns * Math.PI * 2;
  const centerX = dims.width * 0.72;
  const centerY = dims.height * 0.32;
  const baseRadius = Math.min(dims.width, dims.height) / settings.baseRadiusDivisor;
  const phi = Math.max(1.0001, settings.phi);
  const strokeWidth = Math.max(1, Math.min(dims.width, dims.height) / numbers.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = palette.layers[3];
  ctx.globalAlpha = clampAlpha(settings.alpha, 0.85);
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  for (let index = 0; index < count; index += 1) {
    const t = count > 1 ? index / (count - 1) : 0;
    const angle = t * totalAngle;
    const radius = baseRadius * Math.pow(phi, t * turns);
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
  return { points: count };
}

function drawHelixLattice(ctx, dims, palette, numbers, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const amplitude = Math.min(dims.height / settings.amplitudeDivisor, dims.height / 3);
  const phase = (settings.phaseOffset * Math.PI) / 180;
  const strokeWidth = Math.max(1, Math.min(dims.width, dims.height) / numbers.NINETYNINE);
  const startY = dims.height / numbers.NINE;
  const endY = dims.height - startY;
  const usableHeight = endY - startY;

  const strandA = [];
  const strandB = [];
  for (let index = 0; index < samples; index += 1) {
    const t = samples > 1 ? index / (samples - 1) : 0;
    const angle = t * settings.cycles * Math.PI * 2;
    const y = startY + t * usableHeight;
    const centerX = dims.width / 2;
    const xA = centerX + Math.sin(angle) * amplitude;
    const xB = centerX + Math.sin(angle + phase) * amplitude;
    strandA.push({ x: xA, y });
    strandB.push({ x: xB, y });
  }

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(palette.layers[4], settings.strandAlpha);
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  drawPolyline(ctx, strandA);

  ctx.strokeStyle = colorWithAlpha(palette.layers[5], settings.strandAlpha);
  drawPolyline(ctx, strandB);

  ctx.strokeStyle = colorWithAlpha(palette.ink, settings.rungAlpha);
  ctx.lineWidth = Math.max(1, strokeWidth * 0.85);
  const rungCount = Math.max(1, settings.crossTieCount);
  for (let rung = 0; rung < rungCount; rung += 1) {
    const t = rungCount > 1 ? rung / (rungCount - 1) : 0;
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
  return { rungs: rungCount };
}

function drawPolyline(ctx, points) {
  if (!points || points.length === 0) {
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

function drawCanvasNotice(ctx, dims, color, message) {
  ctx.save();
  ctx.fillStyle = colorWithAlpha(color, 0.9);
  ctx.font = `${Math.max(14, dims.width / 72)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(message, dims.width / 2, dims.height - dims.height / DEFAULT_NUMBERS.THIRTYTHREE);
  ctx.restore();
}

function summariseLayers(stats) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const tree = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  const helix = `${stats.helixStats.rungs} helix rungs`;
  return `Layers rendered — ${vesica}; ${tree}; ${fibonacci}; ${helix}.`;
}

function clearStage(ctx, dims, bg) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

function colorWithAlpha(hex, alpha) {
  const value = typeof hex === "string" ? hex.trim() : "";
  const stripped = value.startsWith("#") ? value.slice(1) : value;
  if (stripped.length !== 6) {
    return `rgba(255,255,255,${clampAlpha(alpha, 1)})`;
  }
  const r = parseInt(stripped.slice(0, 2), 16);
  const g = parseInt(stripped.slice(2, 4), 16);
  const b = parseInt(stripped.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${clampAlpha(alpha, 1)})`;
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  if (Number.isInteger(number) && number > 0) {
    return number;
  }
  return fallback;
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  if (Number.isFinite(number) && number > 0) {
    return number;
  }
  return fallback;
}

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp01(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }
  if (number < 0) {
    return 0;
  }
  if (number > 1) {
    return 1;
  }
  return number;
}

function clampAlpha(value, fallback) {
  const number = Number(value);
  if (Number.isFinite(number)) {
    if (number < 0) {
      return 0;
    }
    if (number > 1) {
      return 1;
    }
    return number;
  }
  return fallback;
}
