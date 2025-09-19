/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands with lattice rungs)

  Why: encodes layered cosmology with calm colors, zero animation, and
  comments explaining numerology-driven choices for offline review.
*/

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

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

const DEFAULT_REGISTRY = {
  arcana: [],
  sephirot: [
    { id: null, name: "Kether", type: "sephirah", numerology: 1, lore: "Crown unity", lab: null },
    { id: null, name: "Chokmah", type: "sephirah", numerology: 2, lore: "Wisdom force", lab: null },
    { id: null, name: "Binah", type: "sephirah", numerology: 3, lore: "Understanding form", lab: null },
    { id: null, name: "Daath", type: "sephirah", numerology: null, lore: "Hidden knowledge", lab: null },
    { id: null, name: "Chesed", type: "sephirah", numerology: 4, lore: "Mercy pillar", lab: null },
    { id: null, name: "Geburah", type: "sephirah", numerology: 5, lore: "Severity pillar", lab: null },
    { id: null, name: "Tiphareth", type: "sephirah", numerology: 6, lore: "Solar heart", lab: null },
    { id: null, name: "Netzach", type: "sephirah", numerology: 7, lore: "Victory", lab: null },
    { id: null, name: "Hod", type: "sephirah", numerology: 8, lore: "Splendour", lab: null },
    { id: null, name: "Yesod", type: "sephirah", numerology: 9, lore: "Foundation", lab: null },
    { id: null, name: "Malkuth", type: "sephirah", numerology: 10, lore: "Kingdom", lab: null }
  ],
  paths: []
};

export function renderHelix(ctx, input = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    throw new Error("renderHelix requires a 2D canvas context.");
  }

  const config = normaliseConfig(ctx, input);
  ctx.save();
  clearStage(ctx, config.dims, config.palette.bg);

  const vesicaStats = drawVesicaField(ctx, config.dims, config.palette, config.numbers);
  const treeStats = drawTreeOfLife(ctx, config.dims, config.palette, config.numbers, config.registry);
  const fibonacciStats = drawFibonacciCurve(ctx, config.dims, config.palette, config.numbers);
  const helixStats = drawHelixLattice(ctx, config.dims, config.palette, config.numbers, config.registry);

  if (config.notice) {
    // Inline notice reassures offline viewers that a safe fallback palette is active.
    drawCanvasNotice(ctx, config.dims, config.palette.ink, config.notice);
  }

  ctx.restore();

  return {
    summary: summariseLayers({ vesicaStats, treeStats, fibonacciStats, helixStats }, config.registry)
  };
}

function normaliseConfig(ctx, input) {
  const width = typeof input.width === "number" ? input.width : ctx.canvas.width;
  const height = typeof input.height === "number" ? input.height : ctx.canvas.height;
  const dims = { width, height };
  const palette = mergePalette(input.palette || {});
  const numbers = mergeNumbers(input.NUM || {});
  const notice = typeof input.notice === "string" ? input.notice : null;
  const registry = normaliseRegistry(input.registry);
  return { dims, palette, numbers, notice, registry };
}

function mergePalette(candidate) {
  const layers = Array.isArray(candidate.layers) && candidate.layers.length > 0
    ? candidate.layers.slice(0, DEFAULT_PALETTE.layers.length)
    : DEFAULT_PALETTE.layers.slice();
  while (layers.length < DEFAULT_PALETTE.layers.length) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }
  return {
    bg: typeof candidate.bg === "string" ? candidate.bg : DEFAULT_PALETTE.bg,
    ink: typeof candidate.ink === "string" ? candidate.ink : DEFAULT_PALETTE.ink,
    layers
  };
}

function mergeNumbers(candidate) {
  const merged = { ...DEFAULT_NUMBERS };
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    if (typeof candidate[key] === "number" && Number.isFinite(candidate[key])) {
      merged[key] = candidate[key];
    }
  }
  return merged;
}

function normaliseRegistry(candidate) {
  const registry = cloneRegistry(DEFAULT_REGISTRY);
  const partitions = partitionRegistry(candidate);

  const arcana = partitions.arcana
    .map(record => sanitiseRecord(record, "arcana"))
    .filter(Boolean);
  const paths = partitions.paths
    .map(record => sanitiseRecord(record, "path"))
    .filter(Boolean);
  const sephirot = partitions.sephirot
    .map(record => sanitiseRecord(record, "sephirah"))
    .filter(Boolean);

  if (arcana.length > 0) {
    registry.arcana = arcana;
  }

  if (paths.length > 0) {
    registry.paths = paths;
  }

  if (sephirot.length > 0) {
    const index = new Map();
    registry.sephirot.forEach(entry => {
      index.set(canonicalKey(entry.name), entry);
    });
    sephirot.forEach(entry => {
      const key = canonicalKey(entry.name);
      if (!key) return;
      if (index.has(key)) {
        mergeSephirotEntry(index.get(key), entry);
      } else {
        registry.sephirot.push(entry);
        index.set(key, entry);
      }
    });
  }

  ensureDaathEntry(registry.sephirot);
  return registry;
}

function cloneRegistry(template) {
  return {
    arcana: Array.isArray(template.arcana) ? template.arcana.map(entry => ({ ...entry })) : [],
    sephirot: Array.isArray(template.sephirot) ? template.sephirot.map(entry => ({ ...entry })) : [],
    paths: Array.isArray(template.paths) ? template.paths.map(entry => ({ ...entry })) : []
  };
}

function partitionRegistry(candidate) {
  const result = { arcana: [], sephirot: [], paths: [] };
  if (!candidate) return result;

  if (Array.isArray(candidate)) {
    candidate.forEach(item => distributeRecord(result, item));
    return result;
  }

  if (typeof candidate === "object") {
    distributeCollection(result.arcana, candidate.arcana, "arcana");
    distributeCollection(result.sephirot, candidate.sephirot, "sephirah");
    distributeCollection(result.paths, candidate.paths, "path");
  }

  return result;
}

function distributeRecord(result, item) {
  if (!item || typeof item !== "object") return;
  const type = typeof item.type === "string" ? item.type.toLowerCase() : "";
  if (type === "arcana") {
    result.arcana.push({ ...item });
  } else if (type === "sephirah") {
    result.sephirot.push({ ...item });
  } else if (type === "path") {
    result.paths.push({ ...item });
  }
}

function distributeCollection(target, source, fallbackType) {
  if (!Array.isArray(source)) return;
  source.forEach(item => {
    if (!item || typeof item !== "object") return;
    const record = { ...item };
    if (!record.type && fallbackType) {
      record.type = fallbackType;
    }
    target.push(record);
  });
}

function sanitiseRecord(record, forcedType) {
  if (!record || typeof record !== "object") return null;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  if (!name) return null;
  const id = typeof record.id === "number" && Number.isFinite(record.id) ? record.id : null;
  const type = forcedType || (typeof record.type === "string" ? record.type : "");
  const numerology = typeof record.numerology === "number" && Number.isFinite(record.numerology)
    ? record.numerology
    : null;
  const lore = typeof record.lore === "string" ? record.lore.trim() : "";
  const labRaw = typeof record.lab === "string" ? record.lab.trim() : "";
  const lab = labRaw.length > 0 ? labRaw : null;
  return { id, name, type, numerology, lore, lab };
}

function mergeSephirotEntry(target, source) {
  if (!target || !source) return;
  target.id = source.id !== null ? source.id : target.id;
  target.name = source.name || target.name;
  if (source.numerology !== null) {
    target.numerology = source.numerology;
  }
  if (source.lore) {
    target.lore = source.lore;
  }
  if (source.lab) {
    target.lab = source.lab;
  }
}

function ensureDaathEntry(sephirot) {
  if (!Array.isArray(sephirot)) return;
  const hasDaath = sephirot.some(entry => canonicalKey(entry.name) === "daath");
  if (!hasDaath) {
    const insertIndex = Math.min(3, sephirot.length);
    sephirot.splice(insertIndex, 0, { id: null, name: "Daath", type: "sephirah", numerology: null, lore: "Hidden knowledge", lab: null });
  }
}

function canonicalKey(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function capitaliseKey(key) {
  const text = String(key || "");
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function clearStage(ctx, dims, bg) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

function drawVesicaField(ctx, dims, palette, numbers) {
  ctx.save();
  ctx.globalAlpha = 0.65; // ND-safe softness keeps layer readable without glare.
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = Math.max(1, dims.width / (numbers.ONEFORTYFOUR * 1.8));

  const rows = numbers.SEVEN;
  const cols = numbers.THREE;
  const margin = dims.width / numbers.THIRTYTHREE;
  const innerWidth = dims.width - margin * 2;
  const innerHeight = dims.height - margin * 2;
  const horizontalStep = cols > 1 ? innerWidth / (cols - 1) : 0;
  const verticalStep = rows > 1 ? innerHeight / (rows - 1) : 0;
  const radius = Math.min(horizontalStep, verticalStep) * (numbers.NINE / numbers.TWENTYTWO);
  const offset = radius * (numbers.ELEVEN / numbers.TWENTYTWO);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = margin + col * horizontalStep;
      const cy = margin + row * verticalStep;
      drawVesica(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
  return { circles: rows * cols * 2, radius };
}

function drawVesica(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTreeOfLife(ctx, dims, palette, numbers, registry) {
  const nodes = buildTreeNodes(dims, numbers);
  const paths = buildTreePaths();
  const nodeRadius = Math.max(6, dims.width / numbers.NINETYNINE);

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = palette.layers[1];
  ctx.lineWidth = Math.max(1.2, dims.width / (numbers.ONEFORTYFOUR * 2.5));
  ctx.lineJoin = "round";

  for (const [fromKey, toKey] of paths) {
    const from = nodes[fromKey];
    const to = nodes[toKey];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1;
  for (const key of Object.keys(nodes)) {
    const node = nodes[key];
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
  const sephirotRecords = registry && Array.isArray(registry.sephirot) ? registry.sephirot : [];
  const labelStats = drawSephirahLabels(ctx, nodes, dims, palette, numbers, nodeRadius, sephirotRecords);
  return {
    nodes: Object.keys(nodes).length,
    paths: paths.length,
    labels: labelStats.labels,
    labs: labelStats.labs
  };
}

/**
 * Compute canvas coordinates for the 11 Tree of Life sephirot.
 *
 * Uses the canvas dimensions and numerology constants to produce a vertically distributed,
 * numerology-anchored layout for the sephirot (kether, chokmah, binah, daath, chesed,
 * geburah, tiphareth, netzach, hod, yesod, malkuth). Positions are in canvas pixels.
 *
 * The vertical placement is computed from a top/bottom margin and an inner height divided
 * into eleven steps; several level multipliers are derived from the provided numeric
 * constants so the geometry remains consistent with the module's numerology rules.
 *
 * @param {{width:number, height:number}} dims - Canvas dimensions in pixels.
 * @param {Object<string, number>} numbers - Numerology constants (expects keys like THREE, SEVEN, ELEVEN, TWENTYTWO, THIRTYTHREE, NINE, ONEFORTYFOUR). These values are used to compute vertical levels and column spacing.
 * @return {Object<string, {x:number,y:number}>} Mapping of sephirot names to their {x,y} canvas coordinates.
 */
function buildTreeNodes(dims, numbers) {
  const marginY = dims.height / numbers.THIRTYTHREE;
  const centerX = dims.width / 2;
  const column = dims.width / numbers.THREE;
  const innerHeight = dims.height - marginY * 2;
  const stepY = innerHeight / numbers.ELEVEN;
  const level = multiplier => marginY + stepY * multiplier;

  // Multipliers derive from combinations of the covenant numbers to keep the geometry numerologically anchored.
  const chokmahBinahLevel = numbers.THIRTYTHREE / numbers.TWENTYTWO; // 33/22 = 1.5 -> gentle descent from Kether.
  const daathLevel = (numbers.TWENTYTWO + numbers.SEVEN) / numbers.ELEVEN; // (22+7)/11 ≈ 2.636 keeps Daath between the upper triad and Chesed/Geburah.
  const chesedGeburahLevel = (numbers.THIRTYTHREE + numbers.NINE) / numbers.ELEVEN; // 42/11 ≈ 3.818 maintains balance on both pillars.
  const tipharethLevel = (numbers.THIRTYTHREE + numbers.TWENTYTWO) / numbers.ELEVEN; // 55/11 = 5 holds the heart centre.
  const netzachHodLevel = (numbers.ONEFORTYFOUR - numbers.TWENTYTWO) / numbers.TWENTYTWO; // 122/22 ≈ 5.545 descends smoothly from Tiphareth.
  const yesodLevel = (numbers.ONEFORTYFOUR - numbers.THREE) / numbers.TWENTYTWO; // 141/22 ≈ 6.409 anchors the foundation before Malkuth.

  return {
    kether: { x: centerX, y: marginY },
    chokmah: { x: centerX + column / 2, y: level(chokmahBinahLevel) },
    binah: { x: centerX - column / 2, y: level(chokmahBinahLevel) },
    daath: { x: centerX, y: level(daathLevel) },
    chesed: { x: centerX + column / 2, y: level(chesedGeburahLevel) },
    geburah: { x: centerX - column / 2, y: level(chesedGeburahLevel) },
    tiphareth: { x: centerX, y: level(tipharethLevel) },
    netzach: { x: centerX + column / 2, y: level(netzachHodLevel) },
    hod: { x: centerX - column / 2, y: level(netzachHodLevel) },
    yesod: { x: centerX, y: level(yesodLevel) },
    malkuth: { x: centerX, y: dims.height - marginY }
  };
}

function buildTreePaths() {
  return [
    ["kether", "chokmah"],
    ["kether", "binah"],
    ["chokmah", "binah"],
    ["chokmah", "chesed"],
    ["binah", "geburah"],
    ["chesed", "geburah"],
    ["chesed", "tiphareth"],
    ["geburah", "tiphareth"],
    ["tiphareth", "netzach"],
    ["tiphareth", "hod"],
    ["netzach", "hod"],
    ["netzach", "yesod"],
    ["hod", "yesod"],
    ["yesod", "malkuth"],
    ["kether", "daath"],
    ["daath", "tiphareth"],
    ["daath", "chesed"],
    ["daath", "geburah"],
    ["chesed", "netzach"],
    ["geburah", "hod"],
    ["netzach", "malkuth"],
    ["hod", "malkuth"]
  ];
}

function drawSephirahLabels(ctx, nodes, dims, palette, numbers, nodeRadius, sephirotRecords) {
  if (!nodes || typeof nodes !== "object") {
    return { labels: 0, labs: 0 };
  }

  const records = Array.isArray(sephirotRecords) ? sephirotRecords : [];
  if (records.length === 0) {
    return { labels: 0, labs: 0 };
  }

  const map = new Map();
  records.forEach(record => {
    const key = canonicalKey(record.name);
    if (key) {
      map.set(key, record);
    }
  });

  const centerX = dims.width / 2;
  const fontSize = Math.max(16, dims.width / (numbers.ONEFORTYFOUR * 0.85));
  const labSize = Math.max(11, fontSize * 0.68);
  const offset = nodeRadius * (numbers.THIRTYTHREE / numbers.TWENTYTWO);
  let labels = 0;
  let labs = 0;

  ctx.save();
  ctx.textBaseline = "middle";

  for (const key of Object.keys(nodes)) {
    const node = nodes[key];
    if (!node) continue;
    const canonical = canonicalKey(key);
    const record = map.get(canonical);
    const baseName = record ? record.name : capitaliseKey(key);
    const numeral = record && record.numerology !== null ? ` · ${record.numerology}` : "";
    const labelText = `${baseName}${numeral}`;
    const align = node.x >= centerX ? "left" : "right";
    const labelX = align === "left" ? node.x + nodeRadius + offset : node.x - nodeRadius - offset;
    const labelY = node.y;

    ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.textAlign = align;
    ctx.fillStyle = palette.ink;
    ctx.fillText(labelText, labelX, labelY);
    labels += 1;

    if (record && record.lab) {
      ctx.font = `${labSize}px system-ui, -apple-system, Segoe UI, sans-serif`;
      ctx.textBaseline = "top";
      ctx.fillStyle = palette.layers[5] || palette.ink;
      const labLabel = record.lab.replace(/[-_]/g, " ");
      ctx.fillText(labLabel, labelX, labelY + fontSize * 0.55);
      ctx.textBaseline = "middle";
      labs += 1;
    }
  }

  ctx.restore();
  return { labels, labs };
}

function drawFibonacciCurve(ctx, dims, palette, numbers) {
  const sequence = buildFibonacciSequence(numbers.ONEFORTYFOUR);
  const points = buildSpiralPoints(sequence, dims, numbers);

  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = palette.layers[3];
  ctx.lineWidth = Math.max(1.2, dims.width / numbers.NINETYNINE);
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

  return { points: points.length };
}

function buildFibonacciSequence(limit) {
  const seq = [1, 1];
  while (true) {
    const next = seq[seq.length - 1] + seq[seq.length - 2];
    if (next > limit) break;
    seq.push(next);
  }
  return seq;
}

function buildSpiralPoints(sequence, dims, numbers) {
  const centerX = dims.width * 0.72;
  const centerY = dims.height * 0.28;
  const scale = Math.min(dims.width, dims.height) / (numbers.ONEFORTYFOUR * 0.9);
  const goldenAngle = Math.PI * 2 / numbers.ELEVEN; // gentle rotation anchored to numerology

  const points = sequence.map((value, index) => {
    const angle = goldenAngle * index;
    const radius = Math.sqrt(value) * scale;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });

  // Always include centre to anchor the spiral visually
  return [{ x: centerX, y: centerY }, ...points];
}

function drawHelixLattice(ctx, dims, palette, numbers, registry) {
  const rails = buildHelixRails(dims, numbers);

  ctx.save();
  ctx.strokeStyle = palette.layers[4];
  ctx.lineWidth = Math.max(1.2, dims.width / numbers.ONEFORTYFOUR);

  // Draw first rail
  ctx.beginPath();
  rails.a.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  // Draw second rail
  ctx.strokeStyle = palette.layers[5];
  ctx.beginPath();
  rails.b.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  // Draw lattice rungs
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(1, dims.width / numbers.ONEFORTYFOUR);
  rails.rungs.forEach(rung => {
    ctx.beginPath();
    ctx.moveTo(rung.a.x, rung.a.y);
    ctx.lineTo(rung.b.x, rung.b.y);
    ctx.stroke();
  });

  const arcanaRecords = registry && Array.isArray(registry.arcana) ? registry.arcana : [];
  const markerStats = drawArcanaMarkers(ctx, rails, dims, palette, numbers, arcanaRecords);

  ctx.restore();
  return {
    rungs: rails.rungs.length,
    markers: markerStats.markers,
    labs: markerStats.labs
  };
}

function drawArcanaMarkers(ctx, rails, dims, palette, numbers, arcanaRecords) {
  const records = Array.isArray(arcanaRecords) ? arcanaRecords : [];
  if (records.length === 0) {
    return { markers: 0, labs: 0 };
  }

  const radius = Math.max(8, dims.width / (numbers.ONEFORTYFOUR * 1.1));
  const fontSize = Math.max(11, radius * 1.35);
  let markers = 0;
  let labs = 0;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, sans-serif`;

  const limit = Math.min(records.length, rails.a.length);
  for (let i = 0; i < limit; i += 1) {
    const record = records[i];
    if (!record || typeof record !== "object") continue;
    const rail = i % 2 === 0 ? rails.a : rails.b;
    const point = rail[i];
    if (!point) continue;

    const fill = i % 2 === 0 ? palette.layers[4] : palette.layers[5];
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = Math.max(0.8, radius / 3);
    ctx.stroke();

    const numeral = typeof record.numerology === "number" && Number.isFinite(record.numerology)
      ? record.numerology
      : i;
    ctx.fillStyle = palette.ink;
    ctx.fillText(String(numeral), point.x, point.y);

    if (record.lab) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius * 1.35, 0, Math.PI * 2);
      ctx.strokeStyle = palette.layers[2];
      ctx.lineWidth = Math.max(0.6, radius / 4);
      ctx.stroke();
      labs += 1;
    }

    markers += 1;
  }

  ctx.restore();
  return { markers, labs };
}

function buildHelixRails(dims, numbers) {
  const length = numbers.TWENTYTWO;
  const startX = dims.width * 0.12;
  const endX = dims.width * 0.88;
  const amplitude = dims.height / numbers.ELEVEN;
  const centreY = dims.height * 0.72;
  const phaseShift = Math.PI / numbers.THREE;
  const step = (endX - startX) / (length - 1);

  const a = [];
  const b = [];
  const rungs = [];

  for (let i = 0; i < length; i += 1) {
    const x = startX + step * i;
    const angle = (Math.PI * 2 * i) / numbers.ELEVEN;
    const yA = centreY + Math.sin(angle) * amplitude;
    const yB = centreY + Math.sin(angle + phaseShift) * amplitude;
    const pointA = { x, y: yA };
    const pointB = { x, y: yB };
    a.push(pointA);
    b.push(pointB);
    if (i % 2 === 0) {
      rungs.push({ a: pointA, b: pointB });
    }
  }

  return { a, b, rungs };
}

function drawCanvasNotice(ctx, dims, color, message) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${Math.max(14, dims.width / 72)}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(message, dims.width / 2, dims.height - dims.height / 40);
  ctx.restore();
}

function summariseLayers(stats, registry) {
  const vesica = `${stats.vesicaStats.circles} vesica circles`;
  const treeBase = `${stats.treeStats.paths} paths / ${stats.treeStats.nodes} nodes`;
  const treeLabels = stats.treeStats.labels > 0 ? ` / ${stats.treeStats.labels} labels` : "";
  const treeLabs = stats.treeStats.labs > 0 ? ` (${stats.treeStats.labs} labs)` : "";
  const tree = `${treeBase}${treeLabels}${treeLabs}`;
  const fibonacci = `${stats.fibonacciStats.points} spiral points`;
  let helix = `${stats.helixStats.rungs} helix rungs`;
  if (stats.helixStats.markers > 0) {
    helix += ` / ${stats.helixStats.markers} arcana markers`;
  }
  if (stats.helixStats.labs > 0) {
    helix += ` (${stats.helixStats.labs} lab rings)`;
  }
  const arcanaCount = registry && Array.isArray(registry.arcana) ? registry.arcana.length : 0;
  const sephirotCount = registry && Array.isArray(registry.sephirot) ? registry.sephirot.length : 0;
  const registryNote = `registry ${arcanaCount} arcana, ${sephirotCount} sephirot`;
  return `Layers rendered - ${vesica}; ${tree}; ${fibonacci}; ${helix}; ${registryNote}.`;
}
