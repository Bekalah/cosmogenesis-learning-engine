/*
  octagram-tesseract.mjs
  Trauma-informed, ND-safe renderer for the Cosmogenesis Octagram Tesseract system.

  Replaces the legacy helix renderer with a four-layer static composition:
    1. Vesica field foundation (interlocking circles establishing the vesica piscis grid)
    2. Tree-of-Life scaffold (10 sephirot + 22 paths + axial arches)
    3. Fibonacci arc (logarithmic spiral traced with numerology-tuned pearls)
    4. Octagram tesseract lattice (eightfold octagram cage with static double helix bridge)

  The module also validates octagram nodes against the dedicated schema and activates
  ND-safe nodes based on a planetary hour cycle approximated without external dependencies.
  No animation, no autoplay, and every helper remains a small pure function for offline review.
*/

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

const DEFAULT_PALETTE = {
  bg: "#0b0e18",
  ink: "#f6f2de",
  layers: ["#3f5a7c", "#2f7a82", "#8ab6a6", "#f2c27b", "#d7a9e3", "#f7f1c7", "#a0aee0", "#45516d"]
};

const DEFAULT_NUMBERS = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144,
  GOLDEN_RATIO
};

const BRIDGE_CATEGORIES = [
  "art",
  "magic",
  "science",
  "psychology",
  "quantum",
  "psycho-occult",
  "pattern-research"
];

const ARCANA_TO_OCTAGRAM = new Map([
  ["The Hierophant:Moonchild", "OCTA-OCTARINE"],
  ["The Tower", "OCTA-CROWLEY"],
  ["The High Priestess", "OCTA-FORTUNE"],
  ["The Fool", "OCTA-ACHAD"],
  ["The Magician", "OCTA-AGRIPPA"],
  ["Temperance", "OCTA-PFCASE"],
  ["Justice", "OCTA-SKINNER"],
  ["The Star", "OCTA-TARA"]
]);

const PLANETARY_SEQUENCE = [
  "Saturn",
  "Jupiter",
  "Mars",
  "Sun",
  "Venus",
  "Mercury",
  "Moon"
];

const DAY_STARTERS = {
  0: "Sun",
  1: "Moon",
  2: "Mars",
  3: "Mercury",
  4: "Jupiter",
  5: "Venus",
  6: "Saturn"
};

const activatedNodes = new Map();

const FALLBACK_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "cosmogenesis-learning-engine/schemas/octagram_tesseract.schema.json",
  "title": "Octagram Tesseract Node",
  "type": "object",
  "required": [
    "id",
    "title",
    "arcana",
    "arcana_key",
    "nd_safe",
    "lineages",
    "correspondences",
    "render_profile",
    "lattice",
    "geometry",
    "links",
    "rpg"
  ],
  "properties": {
    "id": { "type": "string", "pattern": "^C144N-[0-9]{3}$" },
    "title": { "type": "string", "minLength": 3 },
    "arcana": { "type": "string", "minLength": 3 },
    "arcana_key": { "type": "string", "minLength": 3 },
    "nd_safe": { "const": true },
    "lineages": {
      "type": "array",
      "items": { "type": "string", "enum": BRIDGE_CATEGORIES },
      "minItems": 1
    },
    "correspondences": {
      "type": "object",
      "required": ["tarot", "angel", "demon", "tara", "planetary_hour"],
      "properties": {
        "tarot": { "type": "string" },
        "angel": { "type": "string" },
        "demon": { "type": "string" },
        "tara": { "type": "string" },
        "planetary_hour": { "type": "string", "enum": PLANETARY_SEQUENCE.concat(["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]) }
      }
    },
    "render_profile": {
      "type": "object",
      "required": ["prefer", "light", "audio"],
      "properties": {
        "prefer": { "type": "string" },
        "light": { "type": "string" },
        "audio": { "type": "string" }
      }
    },
    "filters": {
      "type": "object",
      "properties": {
        "mood": { "type": "string" },
        "light": { "type": "string" },
        "audio": { "type": "string" }
      }
    },
    "story_mood": { "type": "string" },
    "lattice": {
      "type": "object",
      "required": ["pillar", "gate", "intensity"],
      "properties": {
        "pillar": { "type": "integer", "minimum": 1, "maximum": 21 },
        "gate": { "type": "integer", "minimum": 1, "maximum": 99 },
        "intensity": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },
    "geometry": {
      "type": "object",
      "required": ["layer", "angle", "radius"],
      "properties": {
        "layer": { "type": "string" },
        "angle": { "type": "number" },
        "radius": { "type": "number" }
      }
    },
    "links": {
      "type": "object",
      "properties": {
        "archive": { "type": "array", "items": { "type": "string" } },
        "wikidata": { "type": "array", "items": { "type": "string" } },
        "gutenberg": { "type": "array", "items": { "type": "string" } },
        "notes": { "type": "array", "items": { "type": "string" } }
      }
    },
    "rpg": {
      "type": "object",
      "required": ["role", "stats", "skills", "backstory"],
      "properties": {
        "role": { "type": "string" },
        "stats": {
          "type": "object",
          "required": ["mind", "body", "spirit"],
          "properties": {
            "mind": { "type": "integer" },
            "body": { "type": "integer" },
            "spirit": { "type": "integer" }
          }
        },
        "skills": { "type": "array", "items": { "type": "string" } },
        "backstory": { "type": "string" }
      }
    }
  }
};

export async function prepareOctagramSystem(options = {}) {
  const dims = normaliseDims(options.dims);
  const numbers = mergeNumbers(options.NUM || {});

  const paletteResult = await resolvePalette(options.palettePaths || []);
  const schemaResult = await loadJSON(options.schemaPath);
  const schema = schemaResult.data || FALLBACK_SCHEMA;
  const nodesResult = await loadJSON(options.nodesPath);
  const nodes = Array.isArray(nodesResult.data) ? nodesResult.data : [];

  const validation = validateNodes(nodes, schema);
  const activation = determineActiveNodes(validation.validNodes);

  const notices = [];
  if (paletteResult.notice) notices.push(paletteResult.notice);
  if (schemaResult.error) notices.push("schema fallback active");
  if (nodesResult.error) notices.push("node registry missing");
  if (!validation.valid) notices.push("node validation warnings");

  const shellNotice = notices.length > 0 ? notices.join(" · ") : null;
  const activationSummary = activation.summary;

  return {
    dims,
    numbers,
    palette: paletteResult.palette,
    paletteNotice: paletteResult.notice,
    nodes: validation.validNodes,
    validationIssues: validation.issues,
    validationSummary: validation.summary,
    activeNodes: activation.activeNodes,
    activePlanetaryHour: activation.planetaryHour,
    activationSummary,
    shellNotice,
    schemaId: schema["$id"],
    notice: nodesResult.error ? "Octagram nodes missing; fallback geometry only." : null
  };
}

export function renderOctagramTesseract(ctx, config) {
  if (!ctx || typeof ctx.save !== "function" || !config) {
    return { summary: "Rendering skipped; invalid context or config." };
  }

  const dims = config.dims || { width: ctx.canvas.width, height: ctx.canvas.height };
  const palette = mergePalette(config.palette || {});
  const numbers = mergeNumbers(config.numbers || {});

  ctx.save();
  clearStage(ctx, dims, palette, numbers);
  const vesicaStats = drawVesicaField(ctx, dims, palette, numbers);
  const treeStats = drawTreeOfLife(ctx, dims, palette, numbers);
  const fibonacciStats = drawFibonacciArc(ctx, dims, palette, numbers);
  const octaStats = drawOctagramLattice(ctx, dims, palette, numbers);
  const helixStats = drawHelixBridge(ctx, dims, palette, numbers);

  if (Array.isArray(config.activeNodes) && config.activeNodes.length > 0) {
    drawActivatedNodes(ctx, dims, palette, numbers, config.activeNodes);
  }

  if (config.notice) {
    drawCanvasNotice(ctx, dims, palette.ink, config.notice);
  }

  ctx.restore();

  const summaryParts = [
    `${vesicaStats.pairs} vesica pairs`,
    `${treeStats.nodes} sephirot`,
    `${fibonacciStats.points} fibonacci points`,
    `${octaStats.octagrams} octagrams`,
    `${helixStats.rungs} helix rungs`
  ];
  if (config.activeNodes && config.activeNodes.length > 0) {
    summaryParts.push(`${config.activeNodes.length} nodes active`);
  }
  return { summary: summaryParts.join(", ") };
}

export function activate(id, options = {}) {
  if (!options || options.nd_safe !== true) {
    return null;
  }
  const activation = {
    id,
    nd_safe: true,
    activated_at: new Date().toISOString()
  };
  activatedNodes.set(id, activation);
  return activation;
}

export function getActiveNodes() {
  return Array.from(activatedNodes.values());
}

function normaliseDims(candidate) {
  if (!candidate || typeof candidate.width !== "number" || typeof candidate.height !== "number") {
    return { width: 1440, height: 900 };
  }
  return { width: candidate.width, height: candidate.height };
}

async function resolvePalette(paths) {
  for (const path of paths) {
    const { data } = await loadJSON(path);
    if (!data) continue;
    return { palette: mergePalette(ensurePaletteStructure(data)), notice: `palette loaded from ${path}` };
  }
  return { palette: mergePalette(DEFAULT_PALETTE), notice: "palette fallback engaged" };
}

async function loadJSON(path) {
  if (!path) return { data: null, error: new Error("No path provided") };
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

function ensurePaletteStructure(raw) {
  if (!raw) return DEFAULT_PALETTE;
  if (Array.isArray(raw.layers) && raw.layers.length > 0 && typeof raw.layers[0] === "string") {
    return raw;
  }
  if (Array.isArray(raw.layers) && raw.layers.length > 0 && typeof raw.layers[0] === "object") {
    return {
      bg: typeof raw.background === "string" ? raw.background : DEFAULT_PALETTE.bg,
      ink: typeof raw.ink === "string" ? raw.ink : DEFAULT_PALETTE.ink,
      layers: raw.layers.map((layer) => typeof layer.hex === "string" ? layer.hex : DEFAULT_PALETTE.layers[0])
    };
  }
  return DEFAULT_PALETTE;
}

function mergePalette(candidate) {
  if (!candidate) return { ...DEFAULT_PALETTE };
  const merged = {
    bg: typeof candidate.bg === "string" ? candidate.bg : DEFAULT_PALETTE.bg,
    ink: typeof candidate.ink === "string" ? candidate.ink : DEFAULT_PALETTE.ink,
    layers: []
  };
  const sourceLayers = Array.isArray(candidate.layers) && candidate.layers.length > 0
    ? candidate.layers
    : DEFAULT_PALETTE.layers;
  for (let i = 0; i < sourceLayers.length; i += 1) {
    const colour = typeof sourceLayers[i] === "string" ? sourceLayers[i] : DEFAULT_PALETTE.layers[i % DEFAULT_PALETTE.layers.length];
    merged.layers.push(colour);
  }
  return merged;
}

function mergeNumbers(overrides) {
  const numbers = { ...DEFAULT_NUMBERS };
  if (!overrides) return numbers;
  for (const key of Object.keys(DEFAULT_NUMBERS)) {
    if (typeof overrides[key] === "number" && Number.isFinite(overrides[key])) {
      numbers[key] = overrides[key];
    }
  }
  return numbers;
}

function validateNodes(nodes, schema) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return { valid: false, issues: ["no nodes available"], validNodes: [], summary: "no nodes" };
  }
  const issues = [];
  const validNodes = [];
  for (const node of nodes) {
    const nodeIssues = [];
    if (!node || typeof node !== "object") {
      issues.push("node is not an object");
      continue;
    }
    for (const required of schema.required || []) {
      if (typeof node[required] === "undefined") {
        nodeIssues.push(`missing ${required}`);
      }
    }
    if (typeof node.id === "string") {
      if (!/^C144N-[0-9]{3}$/.test(node.id)) {
        nodeIssues.push("id fails C144N pattern");
      }
    } else {
      nodeIssues.push("id missing");
    }
    if (Array.isArray(node.lineages)) {
      const invalid = node.lineages.filter((entry) => !BRIDGE_CATEGORIES.includes(entry));
      if (invalid.length > 0) {
        nodeIssues.push(`invalid lineages: ${invalid.join(",")}`);
      }
    } else {
      nodeIssues.push("lineages missing");
    }
    if (!node.nd_safe) {
      nodeIssues.push("node not ND-safe");
    }
    if (!ARCANA_TO_OCTAGRAM.has(node.arcana)) {
      nodeIssues.push("arcana not mapped to octagram");
    } else if (node.arcana_key !== ARCANA_TO_OCTAGRAM.get(node.arcana)) {
      nodeIssues.push("arcana key mismatch");
    }
    if (!node.correspondences || typeof node.correspondences.planetary_hour !== "string") {
      nodeIssues.push("missing planetary hour");
    }
    if (!node.lattice || typeof node.lattice.pillar !== "number") {
      nodeIssues.push("missing lattice pillar");
    }
    if (nodeIssues.length === 0) {
      validNodes.push(node);
    } else {
      issues.push(`${node.id || "unknown"}: ${nodeIssues.join("; ")}`);
    }
  }
  const valid = issues.length === 0;
  const summary = valid ? `${validNodes.length} nodes validated` : `${validNodes.length} nodes valid; ${issues.length} issues`;
  return { valid, issues, validNodes, summary };
}

function determineActiveNodes(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return { activeNodes: [], planetaryHour: null, summary: "no nodes active" };
  }
  const now = new Date();
  const planetaryHour = computePlanetaryHour(now);
  const activeNodes = [];
  for (const node of nodes) {
    if (node.correspondences && node.correspondences.planetary_hour === planetaryHour) {
      const activation = activate(node.id, { nd_safe: true });
      if (activation) {
        activeNodes.push({ ...node, activation });
      }
    }
  }
  const summary = activeNodes.length > 0
    ? `${activeNodes.length} octagram nodes active for ${planetaryHour}`
    : `no octagram nodes aligned with ${planetaryHour}`;
  return { activeNodes, planetaryHour, summary };
}

function computePlanetaryHour(date) {
  const weekday = date.getDay();
  const dayStarter = DAY_STARTERS[weekday];
  const startIndex = PLANETARY_SEQUENCE.indexOf(dayStarter);
  const hoursSinceMidnight = date.getHours() + date.getMinutes() / 60;
  const index = Math.floor(hoursSinceMidnight) % PLANETARY_SEQUENCE.length;
  const position = (startIndex + index + PLANETARY_SEQUENCE.length) % PLANETARY_SEQUENCE.length;
  return PLANETARY_SEQUENCE[position];
}

function clearStage(ctx, dims, palette, numbers) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
  applyBackgroundGlow(ctx, dims, palette, numbers);
}

function applyBackgroundGlow(ctx, dims, palette, numbers) {
  const centreX = dims.width / 2;
  const crownY = dims.height / numbers.NINE;
  const outerRadius = Math.max(dims.width, dims.height) / (numbers.THREE * 0.9);
  const halo = ctx.createRadialGradient(centreX, crownY * 1.4, outerRadius / numbers.SEVEN, centreX, dims.height / 2, outerRadius);
  halo.addColorStop(0, withAlpha(palette.ink, 0.18));
  halo.addColorStop(0.5, withAlpha(palette.layers[3 % palette.layers.length], 0.12));
  halo.addColorStop(1, withAlpha(palette.bg, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, dims.width, dims.height);

  const floorGradient = ctx.createLinearGradient(0, dims.height * 0.65, 0, dims.height);
  floorGradient.addColorStop(0, withAlpha(palette.layers[5 % palette.layers.length], 0.04));
  floorGradient.addColorStop(0.5, withAlpha(palette.layers[2 % palette.layers.length], 0.1));
  floorGradient.addColorStop(1, withAlpha(palette.bg, 0.9));
  ctx.fillStyle = floorGradient;
  ctx.fillRect(0, 0, dims.width, dims.height);
}

function drawVesicaField(ctx, dims, palette, numbers) {
  const cols = numbers.SEVEN;
  const rows = numbers.THREE;
  const radius = Math.min(dims.width / (cols * 1.8), dims.height / (rows * 2.4));
  const centerY = dims.height / 2;
  const centreX = dims.width / 2;
  const startX = centreX - ((cols - 1) * radius);
  const startY = centerY - ((rows - 1) * radius * 1.15);

  ctx.save();
  ctx.globalAlpha = 0.68;
  ctx.strokeStyle = palette.layers[0 % palette.layers.length];
  ctx.lineWidth = Math.max(1.1, dims.width / (numbers.ONEFORTYFOUR * 1.6));

  let pairs = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = startX + col * radius * 2;
      const cy = startY + row * radius * 1.35;
      drawVesicaPair(ctx, cx, cy, radius);
      pairs += 1;
    }
  }

  ctx.strokeStyle = palette.layers[5 % palette.layers.length];
  ctx.setLineDash([numbers.TWENTYTWO / 2, numbers.TWENTYTWO / 2]);
  ctx.lineWidth = Math.max(1.2, dims.width / numbers.ONEFORTYFOUR);
  ctx.beginPath();
  ctx.moveTo(centreX, startY - radius * 1.5);
  ctx.lineTo(centreX, startY + rows * radius * 1.6);
  ctx.stroke();
  ctx.restore();

  return { pairs, radius };
}

function drawVesicaPair(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx - radius / 2, cy, radius, Math.PI / 2, Math.PI * 1.5);
  ctx.arc(cx + radius / 2, cy, radius, Math.PI * 1.5, Math.PI / 2);
  ctx.closePath();
  ctx.stroke();
}

function drawTreeOfLife(ctx, dims, palette, numbers) {
  const nodes = buildTreeNodes(dims, numbers);
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.strokeStyle = palette.layers[1 % palette.layers.length];
  ctx.lineWidth = Math.max(1.25, dims.width / numbers.ONEFORTYFOUR);
  for (const path of nodes.paths) {
    ctx.beginPath();
    ctx.moveTo(path.from.x, path.from.y);
    ctx.lineTo(path.to.x, path.to.y);
    ctx.stroke();
  }
  ctx.strokeStyle = palette.layers[6 % palette.layers.length];
  ctx.lineWidth = Math.max(1.4, dims.width / numbers.ONEFORTYFOUR * 1.2);
  ctx.beginPath();
  ctx.moveTo(dims.width / 2, nodes.levels[0].y);
  ctx.lineTo(dims.width / 2, nodes.levels[nodes.levels.length - 1].y);
  ctx.stroke();

  ctx.fillStyle = palette.layers[4 % palette.layers.length];
  for (const node of nodes.points) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = withAlpha(palette.ink, 0.3);
    ctx.stroke();
  }
  ctx.restore();
  return { nodes: nodes.points.length, paths: nodes.paths.length };
}

function buildTreeNodes(dims, numbers) {
  const width = dims.width;
  const height = dims.height;
  const pillarSpacing = width / numbers.THREE;
  const centreX = width / 2;
  const radius = Math.max(8, width / numbers.ONEFORTYFOUR * 4);
  const unit = height / numbers.ONEFORTYFOUR;

  const levelHeights = {
    kether: unit * numbers.ELEVEN,
    supernal: unit * (numbers.ELEVEN + numbers.SEVEN),
    daath: unit * (numbers.TWENTYTWO + numbers.SEVEN),
    chesed: unit * (numbers.THIRTYTHREE + numbers.NINE),
    tiphareth: unit * (numbers.THIRTYTHREE + numbers.TWENTYTWO + numbers.NINE),
    netzach: unit * (numbers.NINETYNINE - numbers.THREE),
    yesod: unit * (numbers.ONEFORTYFOUR - numbers.NINE),
    malkuth: unit * numbers.ONEFORTYFOUR
  };

  const points = [
    { key: "kether", x: centreX, y: levelHeights.kether, radius },
    { key: "chokmah", x: centreX + pillarSpacing / 2, y: levelHeights.supernal, radius },
    { key: "binah", x: centreX - pillarSpacing / 2, y: levelHeights.supernal, radius },
    { key: "daath", x: centreX, y: levelHeights.daath, radius: radius * 0.85 },
    { key: "chesed", x: centreX + pillarSpacing / 2.2, y: levelHeights.chesed, radius },
    { key: "geburah", x: centreX - pillarSpacing / 2.2, y: levelHeights.chesed, radius },
    { key: "tiphareth", x: centreX, y: levelHeights.tiphareth, radius },
    { key: "netzach", x: centreX + pillarSpacing / 2.4, y: levelHeights.netzach, radius },
    { key: "hod", x: centreX - pillarSpacing / 2.4, y: levelHeights.netzach, radius },
    { key: "yesod", x: centreX, y: levelHeights.yesod, radius },
    { key: "malkuth", x: centreX, y: levelHeights.malkuth, radius }
  ];

  const paths = [];
  const connect = (fromKey, toKey) => {
    const from = points.find((node) => node.key === fromKey);
    const to = points.find((node) => node.key === toKey);
    if (from && to) {
      paths.push({ from, to });
    }
  };

  connect("kether", "chokmah");
  connect("kether", "binah");
  connect("chokmah", "binah");
  connect("chokmah", "chesed");
  connect("binah", "geburah");
  connect("chesed", "geburah");
  connect("chesed", "tiphareth");
  connect("geburah", "tiphareth");
  connect("tiphareth", "netzach");
  connect("tiphareth", "hod");
  connect("netzach", "hod");
  connect("netzach", "yesod");
  connect("hod", "yesod");
  connect("yesod", "malkuth");

  const levels = [
    { name: "kether", y: levelHeights.kether },
    { name: "supernal", y: levelHeights.supernal },
    { name: "daath", y: levelHeights.daath },
    { name: "chesed", y: levelHeights.chesed },
    { name: "tiphareth", y: levelHeights.tiphareth },
    { name: "netzach", y: levelHeights.netzach },
    { name: "yesod", y: levelHeights.yesod },
    { name: "malkuth", y: levelHeights.malkuth }
  ];

  return { points, paths, levels };
}

function drawFibonacciArc(ctx, dims, palette, numbers) {
  const centreX = dims.width / 2;
  const centreY = dims.height / 2.2;
  const maxRadius = Math.min(dims.width, dims.height) / 2.1;
  const fibonacci = buildFibonacciSequence(numbers.ONEFORTYFOUR);
  const points = [];
  ctx.save();
  ctx.strokeStyle = palette.layers[2 % palette.layers.length];
  ctx.lineWidth = Math.max(1.1, dims.width / numbers.ONEFORTYFOUR * 0.8);
  ctx.beginPath();
  for (let i = 0; i < fibonacci.length; i += 1) {
    const ratio = fibonacci[i] / fibonacci[fibonacci.length - 1];
    const radius = maxRadius * ratio;
    const angle = i / fibonacci.length * Math.PI * 2 * (1 / numbers.GOLDEN_RATIO);
    const x = centreX + Math.cos(angle) * radius;
    const y = centreY + Math.sin(angle) * radius;
    points.push({ x, y });
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = palette.layers[3 % palette.layers.length];
  for (const point of points) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(2.5, dims.width / numbers.ONEFORTYFOUR * 0.9), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  return { points: points.length };
}

function buildFibonacciSequence(limit) {
  const sequence = [1, 1];
  while (sequence[sequence.length - 1] < limit) {
    const next = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    sequence.push(next);
  }
  return sequence;
}

function drawOctagramLattice(ctx, dims, palette, numbers) {
  const centreX = dims.width / 2;
  const centreY = dims.height / 2.3;
  const baseRadius = Math.min(dims.width, dims.height) / 3.2;
  const octagrams = [
    { radius: baseRadius * 0.9, alpha: 0.18 },
    { radius: baseRadius * 1.15, alpha: 0.12 },
    { radius: baseRadius * 1.32, alpha: 0.08 }
  ];
  ctx.save();
  ctx.strokeStyle = palette.layers[6 % palette.layers.length];
  ctx.lineWidth = Math.max(1.2, dims.width / numbers.ONEFORTYFOUR);
  let count = 0;
  for (const frame of octagrams) {
    ctx.globalAlpha = frame.alpha;
    drawOctagram(ctx, centreX, centreY, frame.radius);
    count += 1;
  }
  ctx.restore();
  return { octagrams: count };
}

function drawOctagram(ctx, cx, cy, radius) {
  const step = Math.PI / 4;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const angle = step * i;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const angle = step * i + step / 2;
    const x = cx + Math.cos(angle) * radius * 0.6;
    const y = cy + Math.sin(angle) * radius * 0.6;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
}

function drawHelixBridge(ctx, dims, palette, numbers) {
  const centreX = dims.width / 2;
  const top = dims.height / numbers.THREE;
  const bottom = dims.height - dims.height / numbers.ELEVEN;
  const strands = 2;
  const steps = numbers.TWENTYTWO;
  const horizontalSpread = dims.width / numbers.THREE;
  const rungSpacing = (bottom - top) / steps;
  ctx.save();
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = palette.layers[7 % palette.layers.length];
  ctx.lineWidth = Math.max(1, dims.width / numbers.ONEFORTYFOUR * 0.9);
  let rungs = 0;
  for (let strand = 0; strand < strands; strand += 1) {
    ctx.beginPath();
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps;
      const angle = (Math.PI * 2 * t) + (strand * Math.PI);
      const radius = Math.sin(t * Math.PI) * horizontalSpread / 2;
      const x = centreX + Math.cos(angle) * radius;
      const y = top + step * rungSpacing;
      if (step === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = palette.layers[4 % palette.layers.length];
  for (let step = 0; step <= steps; step += 1) {
    const t = step / steps;
    const angle = Math.PI * 2 * t;
    const radius = Math.sin(t * Math.PI) * horizontalSpread / 2;
    const y = top + step * rungSpacing;
    const x1 = centreX + Math.cos(angle) * radius;
    const x2 = centreX - Math.cos(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    rungs += 1;
  }
  ctx.restore();
  return { rungs };
}

function drawActivatedNodes(ctx, dims, palette, numbers, nodes) {
  const radius = Math.max(6, dims.width / numbers.ONEFORTYFOUR * 3);
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = palette.layers[3 % palette.layers.length];
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = 1.2;
  for (const node of nodes) {
    const position = mapNodeToCanvas(dims, node);
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function mapNodeToCanvas(dims, node) {
  const centreX = dims.width / 2;
  const centreY = dims.height / 2.2;
  const baseRadius = Math.min(dims.width, dims.height) / 3;
  const angle = typeof node.geometry?.angle === "number" ? node.geometry.angle : 0;
  const radiusRatio = typeof node.geometry?.radius === "number" ? node.geometry.radius : 0.6;
  return {
    x: centreX + Math.cos(angle) * baseRadius * radiusRatio,
    y: centreY + Math.sin(angle) * baseRadius * radiusRatio
  };
}

function drawCanvasNotice(ctx, dims, colour, message) {
  ctx.save();
  ctx.fillStyle = withAlpha(colour, 0.86);
  ctx.font = `14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(message, dims.width / 2, dims.height - 24);
  ctx.restore();
}

function withAlpha(hex, alpha) {
  const normalised = hex.replace(/[^0-9a-fA-F]/g, "");
  if (normalised.length !== 6) {
    return hex;
  }
  const r = parseInt(normalised.slice(0, 2), 16);
  const g = parseInt(normalised.slice(2, 4), 16);
  const b = parseInt(normalised.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
