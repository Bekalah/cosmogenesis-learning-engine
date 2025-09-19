/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  The renderer paints four calm layers in order: vesica field, Tree-of-Life scaffold,
  Fibonacci spiral, and double-helix lattice. Each helper function stays small and
  explains how the numerology constants keep depth without motion.
*/

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

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

const TREE_TEMPLATE = [
  { key: "kether", name: "Kether", column: "centre", level: 9, lab: "Crown" },
  { key: "chokmah", name: "Chokmah", column: "right", level: 20, lab: "Wisdom" },
  { key: "binah", name: "Binah", column: "left", level: 20, lab: "Understanding" },
  { key: "daath", name: "Daath", column: "centre", level: 29, lab: "Hidden" },
  { key: "chesed", name: "Chesed", column: "right", level: 42, lab: "Mercy" },
  { key: "geburah", name: "Geburah", column: "left", level: 42, lab: "Severity" },
  { key: "tiphareth", name: "Tiphareth", column: "centre", level: 55, lab: "Beauty" },
  { key: "netzach", name: "Netzach", column: "right", level: 96, lab: "Victory" },
  { key: "hod", name: "Hod", column: "left", level: 96, lab: "Splendour" },
  { key: "yesod", name: "Yesod", column: "centre", level: 141, lab: "Foundation" },
  { key: "malkuth", name: "Malkuth", column: "centre", level: 144, lab: "Kingdom" }
];

const TREE_CONNECTIONS = [
  ["kether", "chokmah"],
  ["kether", "binah"],
  ["kether", "tiphareth"],
  ["chokmah", "binah"],
  ["chokmah", "chesed"],
  ["chokmah", "tiphareth"],
  ["binah", "geburah"],
  ["binah", "tiphareth"],
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
  ["netzach", "malkuth"],
  ["hod", "yesod"],
  ["hod", "malkuth"],
  ["yesod", "malkuth"]
];

export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.save !== "function") {
    return { summary: "Canvas context unavailable; rendering skipped." };
  }

  const dims = resolveDimensions(ctx, options);
  const palette = mergePalette(options.palette);
  const numbers = mergeNumbers(options.NUM);
  const notice = typeof options.notice === "string" ? options.notice : null;

  ctx.save();
  clearStage(ctx, dims, palette, numbers);

  const vesicaStats = drawVesicaField(ctx, dims, palette, numbers);
  const treeStats = drawTreeOfLife(ctx, dims, palette, numbers);
  const fibonacciStats = drawFibonacciCurve(ctx, dims, palette, numbers);
  const helixStats = drawHelixLattice(ctx, dims, palette, numbers);

  if (notice) {
    drawCanvasNotice(ctx, dims, palette, notice);
  }

  ctx.restore();
  return { summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats }) };
}

function resolveDimensions(ctx, options) {
  const width = typeof options.width === "number" ? options.width : ctx.canvas.width;
  const height = typeof options.height === "number" ? options.height : ctx.canvas.height;
  return { width, height };
}

function mergePalette(candidate) {
  const fallback = DEFAULT_PALETTE.layers;
  const layers = Array.isArray(candidate?.layers) ? candidate.layers.slice(0, fallback.length) : [];
  while (layers.length < fallback.length) {
    layers.push(fallback[layers.length]);
  }
  return {
    bg: typeof candidate?.bg === "string" ? candidate.bg : DEFAULT_PALETTE.bg,
    ink: typeof candidate?.ink === "string" ? candidate.ink : DEFAULT_PALETTE.ink,
    layers
  };
}

function mergeNumbers(candidate) {
  const merged = { ...DEFAULT_NUMBERS };
  if (!candidate || typeof candidate !== "object") {
    return merged;
  }
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    if (typeof candidate[key] === "number" && Number.isFinite(candidate[key])) {
      merged[key] = candidate[key];
    }
  }
  return merged;
}

function clearStage(ctx, dims, palette, numbers) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
  applyBackgroundGlow(ctx, dims, palette, numbers);
}

function applyBackgroundGlow(ctx, dims, palette, numbers) {
  const cx = dims.width / 2;
  const cy = dims.height / numbers.THREE;
  const radius = Math.max(dims.width, dims.height) / (numbers.THREE * 0.9);
  const halo = ctx.createRadialGradient(cx, cy, radius / numbers.SEVEN, cx, cy, radius);
  halo.addColorStop(0, withAlpha(palette.layers[3], 0.2));
  halo.addColorStop(0.6, withAlpha(palette.layers[0], 0.08));
  halo.addColorStop(1, withAlpha(palette.bg, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, dims.width, dims.height);

  const floor = ctx.createLinearGradient(0, dims.height * 0.65, 0, dims.height);
  floor.addColorStop(0, withAlpha(palette.layers[5], 0.05));
  floor.addColorStop(1, withAlpha(palette.bg, 0.8));
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

function drawVesicaField(ctx, dims, palette, numbers) {
  const grid = buildVesicaGrid(dims, numbers);
  ctx.save();
  ctx.globalAlpha = 0.68;
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = Math.max(1.5, dims.width / (numbers.ONEFORTYFOUR * 1.2));
  grid.cells.forEach(cell => drawVesicaPair(ctx, cell));

  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = palette.layers[5];
  ctx.lineWidth = Math.max(1.2, dims.width / numbers.ONEFORTYFOUR);
  drawVesicaHalo(ctx, dims, numbers);

  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = palette.layers[2];
  ctx.setLineDash([numbers.TWENTYTWO, numbers.TWENTYTWO]);
  drawVesicaAxis(ctx, dims);
  ctx.restore();
  return { pairs: grid.cells.length, radius: grid.radius };
}

function buildVesicaGrid(dims, numbers) {
  const rows = numbers.SEVEN;
  const cols = numbers.THREE;
  const margin = dims.width / numbers.THIRTYTHREE;
  const innerWidth = dims.width - margin * 2;
  const innerHeight = dims.height - margin * 2;
  const xStep = cols > 1 ? innerWidth / (cols - 1) : innerWidth;
  const yStep = rows > 1 ? innerHeight / (rows - 1) : innerHeight;
  const radius = Math.min(xStep, yStep) * (numbers.NINE / numbers.TWENTYTWO);
  const offset = radius * (numbers.ELEVEN / numbers.TWENTYTWO);

  const cells = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = margin + col * xStep;
      const cy = margin + row * yStep;
      cells.push({ cx, cy, radius, offset });
    }
  }
  return { cells, radius };
}

function drawVesicaPair(ctx, cell) {
  ctx.beginPath();
  ctx.arc(cell.cx - cell.offset, cell.cy, cell.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cell.cx + cell.offset, cell.cy, cell.radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawVesicaHalo(ctx, dims, numbers) {
  const cx = dims.width / 2;
  const cy = dims.height / numbers.NINE;
  const radius = Math.min(dims.width, dims.height) / (numbers.THREE * 0.9);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawVesicaAxis(ctx, dims) {
  const cx = dims.width / 2;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, dims.height);
  ctx.stroke();
}

function drawTreeOfLife(ctx, dims, palette, numbers) {
  const layout = buildTreeLayout(dims, numbers);
  ctx.save();
  ctx.strokeStyle = palette.layers[3];
  ctx.lineWidth = Math.max(1.4, dims.width / numbers.ONEFORTYFOUR);
  TREE_CONNECTIONS.forEach(([fromKey, toKey]) => {
    const from = layout.get(fromKey);
    const to = layout.get(toKey);
    if (!from || !to) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  ctx.fillStyle = palette.layers[4];
  layout.forEach(node => drawTreeNode(ctx, node, palette));
  ctx.restore();
  return { nodes: layout.size, paths: TREE_CONNECTIONS.length };
}

function buildTreeLayout(dims, numbers) {
  const map = new Map();
  const centreX = dims.width / 2;
  const columnOffset = dims.width / numbers.THREE;
  const unit = dims.height / numbers.ONEFORTYFOUR;

  TREE_TEMPLATE.forEach(template => {
    const x = template.column === "left"
      ? centreX - columnOffset
      : template.column === "right"
        ? centreX + columnOffset
        : centreX;
    const y = template.level * unit;
    map.set(template.key, {
      key: template.key,
      name: template.name,
      label: template.lab,
      x,
      y
    });
  });
  return map;
}

function drawTreeNode(ctx, node, palette) {
  const radius = 14;
  ctx.beginPath();
  ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = palette.ink;
  ctx.font = "12px/1.4 system-ui";
  ctx.textAlign = "center";
  ctx.fillText(node.name, node.x, node.y - radius - 8);
  if (node.label) {
    ctx.fillStyle = withAlpha(palette.ink, 0.7);
    ctx.font = "10px/1.4 system-ui";
    ctx.fillText(node.label, node.x, node.y + radius + 14);
    ctx.fillStyle = palette.ink;
  }
}

function drawFibonacciCurve(ctx, dims, palette, numbers) {
  const sequence = buildFibonacciSequence(numbers.ONEFORTYFOUR);
  const points = buildFibonacciPoints(sequence, dims, numbers);

  ctx.save();
  ctx.strokeStyle = palette.layers[1];
  ctx.lineWidth = Math.max(1.5, dims.width / numbers.ONEFORTYFOUR);
  ctx.lineJoin = "round";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.fillStyle = palette.layers[1];
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
  return { points: points.length };
}

function buildFibonacciSequence(limit) {
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

function buildFibonacciPoints(sequence, dims, numbers) {
  const centreX = dims.width / 2;
  const centreY = dims.height / 2;
  const base = Math.min(dims.width, dims.height) / (numbers.ONEFORTYFOUR / numbers.NINE);
  return sequence.map((value, index) => {
    const angle = index * (Math.PI / numbers.THREE);
    const radius = value * base / numbers.ONEFORTYFOUR;
    return {
      x: centreX + Math.cos(angle) * radius * numbers.THIRTYTHREE,
      y: centreY + Math.sin(angle) * radius * numbers.THIRTYTHREE
    };
  });
}

function drawHelixLattice(ctx, dims, palette, numbers) {
  const rails = buildHelixRails(dims, numbers);
  ctx.save();
  ctx.strokeStyle = palette.layers[5];
  ctx.lineWidth = Math.max(1.4, dims.width / numbers.ONEFORTYFOUR);
  ctx.beginPath();
  rails.left.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.beginPath();
  rails.right.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.strokeStyle = withAlpha(palette.layers[5], 0.6);
  ctx.lineWidth = Math.max(1, dims.width / numbers.ONEFORTYFOUR);
  rails.rungs.forEach(rung => drawHelixRung(ctx, rung));

  ctx.restore();
  return { stations: rails.rungs.length };
}

function buildHelixRails(dims, numbers) {
  const steps = numbers.THIRTYTHREE;
  const centreX = dims.width / 2;
  const amplitude = dims.width / numbers.THIRTYTHREE;
  const strandOffset = dims.width / numbers.THREE;
  const stepY = dims.height / (steps - 1);

  const left = [];
  const right = [];
  const rungs = [];

  for (let i = 0; i < steps; i += 1) {
    const y = i * stepY;
    const phase = (i / (steps - 1)) * Math.PI * 2;
    const sinShift = Math.sin(phase) * amplitude;
    const leftX = centreX - strandOffset + sinShift;
    const rightX = centreX + strandOffset - sinShift;
    left.push({ x: leftX, y });
    right.push({ x: rightX, y });

    if (i % numbers.THREE === 0) {
      rungs.push({ leftX, rightX, y });
    }
  }

  return { left, right, rungs };
}

function drawHelixRung(ctx, rung) {
  ctx.beginPath();
  ctx.moveTo(rung.leftX, rung.y);
  ctx.lineTo(rung.rightX, rung.y);
  ctx.stroke();
}

function drawCanvasNotice(ctx, dims, palette, text) {
  ctx.save();
  ctx.fillStyle = withAlpha(palette.ink, 0.7);
  ctx.font = "12px/1.4 system-ui";
  ctx.textAlign = "center";
  ctx.fillText(text, dims.width / 2, dims.height - 16);
  ctx.restore();
}

function summariseLayers(stats) {
  return [
    `Vesica ${formatCount(stats.vesicaStats?.pairs)} pairs`,
    `Tree ${formatCount(stats.treeStats?.nodes)} nodes/${formatCount(stats.treeStats?.paths)} paths`,
    `Fibonacci ${formatCount(stats.fibonacciStats?.points)} markers`,
    `Helix ${formatCount(stats.helixStats?.stations)} rungs`
  ].join(" | ");
}

function formatCount(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function withAlpha(hex, alpha) {
  const value = String(hex || "").replace(/^#/, "");
  if (value.length !== 6) {
    return hex;
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
