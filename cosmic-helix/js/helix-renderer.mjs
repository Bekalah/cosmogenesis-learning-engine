/*
  helix-renderer.mjs — cosmic-helix module
  ND-safe static renderer for layered sacred geometry. Renders four ordered layers:
    1) Vesica field lattice (womb-of-forms grid)
    2) Tree-of-Life scaffold (10 sephirot, 22 paths)
    3) Fibonacci curve (static logarithmic spiral)
    4) Double-helix lattice (phase-shifted strands + cross ties)
  All helpers are pure functions and reference numerology constants {3, 7, 9, 11, 22, 33, 99, 144}.
*/

const FALLBACK_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

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
    radiusDivisor: 33,
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
      ["chokmah", "chesed"],
      ["chokmah", "tiphareth"],
      ["chokmah", "netzach"],
      ["binah", "geburah"],
      ["binah", "tiphareth"],
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
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  fillBackground(ctx, width, height, palette.bg);

  // Layer sequencing preserves depth without motion (ND-safe rationale).
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
    return clonePalette(FALLBACK_PALETTE);
  }

  const palette = {
    bg: typeof input.bg === "string" ? input.bg : FALLBACK_PALETTE.bg,
    ink: typeof input.ink === "string" ? input.ink : FALLBACK_PALETTE.ink,
    muted: typeof input.muted === "string" ? input.muted : FALLBACK_PALETTE.muted,
    layers: []
  };

  const sourceLayers = Array.isArray(input.layers) ? input.layers : [];
  for (let index = 0; index < FALLBACK_PALETTE.layers.length; index += 1) {
    const candidate = sourceLayers[index];
    palette.layers.push(typeof candidate === "string" ? candidate : FALLBACK_PALETTE.layers[index]);
  }

  return palette;
}

function clonePalette(palette) {
  return {
    bg: palette.bg,
    ink: palette.ink,
    muted: palette.muted,
    layers: [...palette.layers]
  };
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
  const safe = input && typeof input === "object" ? input : {};
  return {
    vesica: normaliseVesica(safe.vesica),
    treeOfLife: normaliseTree(safe.treeOfLife),
    fibonacci: normaliseFibonacci(safe.fibonacci),
    helix: normaliseHelix(safe.helix)
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
  const nodes = providedNodes.map((node, index) => {
    const base = typeof node === "object" && node !== null ? node : {};
    const reference = fallbackNodes.find((item) => item.id === base.id) || fallbackNodes[index % fallbackNodes.length];
    return {
      id: typeof base.id === "string" && base.id ? base.id : reference.id,
      title: typeof base.title === "string" && base.title ? base.title : reference.title,
      meaning: typeof base.meaning === "string" && base.meaning ? base.meaning : reference.meaning,
      level: finiteNumber(base.level, reference.level),
      xFactor: clamp01(finiteNumber(base.xFactor, reference.xFactor))
    };
  });

  const nodeIds = new Set(nodes.map((node) => node.id));
  const sourceEdges = Array.isArray(safe.edges) && safe.edges.length > 0 ? safe.edges : fallback.edges;
  const edges = sourceEdges
    .map((edge) => (Array.isArray(edge) ? edge.slice(0, 2) : []))
    .filter((edge) => edge.length === 2 && nodeIds.has(edge[0]) && nodeIds.has(edge[1]));

  return {
    marginDivisor: positiveNumber(safe.marginDivisor, fallback.marginDivisor),
    radiusDivisor: positiveNumber(safe.radiusDivisor, fallback.radiusDivisor),
    labelOffset: finiteNumber(safe.labelOffset, fallback.labelOffset),
    labelFont: typeof safe.labelFont === "string" && safe.labelFont ? safe.labelFont : fallback.labelFont,
    nodes,
    edges
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
  const usableWidth = Math.max(0, width - padding * 2);
  const usableHeight = Math.max(0, height - padding * 2);
  const stepX = columns > 1 ? usableWidth / (columns - 1) : 0;
  const stepY = rows > 1 ? usableHeight / (rows - 1) : 0;
  const radius = Math.min(stepX, stepY) * (N.NINE / N.ELEVEN) / settings.radiusFactor;
  const lineWidth = Math.max(1, Math.min(width, height) / settings.strokeDivisor) * (N.THIRTYTHREE / N.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let row = 0; row < rows; row += 1) {
    const offset = row % 2 === 0 ? 0 : stepX / 2;
    for (let column = 0; column < columns; column += 1) {
      const x = padding + offset + column * stepX;
      const y = padding + row * stepY * (N.SEVEN / N.NINE);
      if (x < padding - radius || x > width - padding + radius || y < padding - radius || y > height - padding + radius) {
        continue;
      }
      strokeCircle(ctx, x, y, radius);
    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, labelColor, N, tree) {
  const margin = Math.min(width, height) / tree.marginDivisor;
  const verticalSpan = Math.max(0, height - margin * 2);
  const horizontalSpan = Math.max(0, width - margin * 2);
  const radius = Math.max(4, Math.min(width, height) / tree.radiusDivisor);
  const pathWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  const maxLevel = tree.nodes.reduce((acc, node) => Math.max(acc, node.level), 0);
  const levelStep = maxLevel > 0 ? verticalSpan / maxLevel : 0;

  const positions = new Map();
  tree.nodes.forEach((node) => {
    const x = margin + clamp01(node.xFactor) * horizontalSpan;
    const y = margin + Math.max(0, node.level) * levelStep;
    positions.set(node.id, { x, y, node });
  });

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(pathColor, 0.75);
  ctx.lineWidth = pathWidth;
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

  ctx.fillStyle = colorWithAlpha(nodeColor, 0.9);
  ctx.strokeStyle = colorWithAlpha(nodeColor, 0.4);
  ctx.lineWidth = Math.max(1, radius / N.THIRTYTHREE);
  positions.forEach((pos) => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.fillStyle = colorWithAlpha(labelColor, 0.85);
  ctx.font = tree.labelFont;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  positions.forEach((pos) => {
    const labelY = pos.y + tree.labelOffset;
    ctx.fillText(pos.node.title, pos.x, labelY);
  });

  ctx.restore();
}

function drawFibonacciCurve(ctx, width, height, color, N, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const turns = settings.turns;
  const phi = settings.phi;
  const baseRadius = Math.min(width, height) / settings.baseRadiusDivisor;
  const centerX = width * (N.THIRTYTHREE / N.NINETYNINE);
  const centerY = height * (N.SEVEN / N.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(color, settings.alpha);
  ctx.lineWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);
  ctx.lineCap = "round";

  ctx.beginPath();
  for (let index = 0; index < samples; index += 1) {
    const t = (index / (samples - 1)) * (Math.PI * 2 * turns);
    const radius = baseRadius * Math.pow(phi, t / (Math.PI * 2));
    const x = centerX + radius * Math.cos(t);
    const y = centerY + radius * Math.sin(t);
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function drawHelixLattice(ctx, width, height, strandColor, accentColor, N, settings) {
  const samples = Math.max(2, settings.sampleCount);
  const amplitude = width / settings.amplitudeDivisor;
  const cycles = settings.cycles;
  const phaseOffset = (settings.phaseOffset * Math.PI) / 180;
  const strandWidth = Math.max(1, Math.min(width, height) / N.NINETYNINE);

  ctx.save();
  ctx.lineWidth = strandWidth;
  ctx.lineCap = "round";

  drawHelixStrand(ctx, width, height, amplitude, cycles, 0, strandColor, settings.strandAlpha, samples);
  drawHelixStrand(ctx, width, height, amplitude, cycles, phaseOffset, accentColor, settings.strandAlpha, samples);
  drawCrossTies(ctx, width, height, amplitude, cycles, strandColor, accentColor, settings);

  ctx.restore();
}

function drawHelixStrand(ctx, width, height, amplitude, cycles, phase, color, alpha, samples) {
  const sampleCount = Math.max(2, samples);
  const totalAngle = Math.PI * 2 * cycles;
  const stepY = sampleCount > 1 ? height / (sampleCount - 1) : 0;
  ctx.beginPath();
  ctx.strokeStyle = colorWithAlpha(color, alpha);
  for (let index = 0; index < sampleCount; index += 1) {
    const y = sampleCount > 1 ? index * stepY : 0;
    const progress = sampleCount > 1 ? index / (sampleCount - 1) : 0;
    const angle = progress * totalAngle + phase;
    const x = width / 2 + amplitude * Math.sin(angle);
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawCrossTies(ctx, width, height, amplitude, cycles, colorA, colorB, settings) {
  const count = Math.max(1, settings.crossTieCount);
  const interval = height / count;
  const totalAngle = Math.PI * 2 * cycles;

  for (let index = 0; index <= count; index += 1) {
    const y = Math.min(height, index * interval);
    const progress = y / height;
    const angle = progress * totalAngle;
    const x1 = width / 2 + amplitude * Math.sin(angle);
    const x2 = width / 2 + amplitude * Math.sin(angle + (settings.phaseOffset * Math.PI) / 180);
    ctx.beginPath();
    ctx.strokeStyle = colorWithAlpha(index % 2 === 0 ? colorA : colorB, settings.rungAlpha);
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}

function drawNotice(ctx, width, height, color, message) {
  ctx.save();
  ctx.fillStyle = colorWithAlpha(color, 0.8);
  ctx.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  const padding = 16;
  const lines = message.split(/\s+/).reduce((acc, word) => {
    const currentLine = acc[acc.length - 1];
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(candidate).width > width / 3) {
      acc.push(word);
    } else {
      acc[acc.length - 1] = candidate;
    }
    return acc;
  }, [""]);
  lines.reverse().forEach((line, index) => {
    ctx.fillText(line.trim(), width - padding, height - padding - index * 16);
  });
  ctx.restore();
}

function strokeCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function positiveNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

function positiveInteger(value, fallback) {
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : fallback;
}

function finiteNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clampAlpha(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  if (num < 0) {
    return 0;
  }
  if (num > 1) {
    return 1;
  }
  return num;
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

function colorWithAlpha(color, alpha) {
  const value = typeof color === "string" ? color.trim() : "";
  const safeAlpha = clampAlpha(alpha, 1);
  const hexMatch = /^#([0-9a-f]{3}){1,2}$/i;
  if (!hexMatch.test(value)) {
    return value || `rgba(255,255,255,${safeAlpha})`;
  }

  const hex = value.slice(1);
  const normalized = hex.length === 3 ? hex.split("").map((ch) => ch + ch).join("") : hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}
