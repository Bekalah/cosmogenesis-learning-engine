/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands with lattice rungs)

  Why: encodes layered cosmology with calm colors, zero animation, and clear
  ordering so each stratum can be visually parsed without overwhelm.
*/

export function renderHelix(ctx, options = {}) {
  if (!ctx || typeof ctx.canvas === "undefined") {
    throw new Error("renderHelix requires a 2D canvas context.");
  }

  const dims = normaliseDimensions(ctx, options);
  const palette = normalisePalette(options.palette);
  const numbers = normaliseNumbers(options.NUM);

  ctx.save();
  ctx.clearRect(0, 0, dims.width, dims.height);

  paintBackground(ctx, dims, palette);
  drawVesicaField(ctx, dims, palette, numbers);
  drawTreeOfLife(ctx, dims, palette, numbers);
  drawFibonacciCurve(ctx, dims, palette, numbers);
  drawHelixLattice(ctx, dims, palette, numbers);

  ctx.restore();
}

function normaliseDimensions(ctx, options) {
  const width = typeof options.width === "number" ? options.width : ctx.canvas.width;
  const height = typeof options.height === "number" ? options.height : ctx.canvas.height;
  return { width, height };
}

function normalisePalette(rawPalette) {
  const fallback = {
    bg: "#0b0b12",
    ink: "#e8e8f0",
    layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
  };
  if (!rawPalette) {
    return fallback;
  }
  const layers = Array.isArray(rawPalette.layers) && rawPalette.layers.length > 0
    ? rawPalette.layers.slice()
    : fallback.layers.slice();
  return {
    bg: typeof rawPalette.bg === "string" ? rawPalette.bg : fallback.bg,
    ink: typeof rawPalette.ink === "string" ? rawPalette.ink : fallback.ink,
    layers
  };
}

function normaliseNumbers(raw) {
  const fallback = {
    THREE: 3,
    SEVEN: 7,
    NINE: 9,
    ELEVEN: 11,
    TWENTYTWO: 22,
    THIRTYTHREE: 33,
    NINETYNINE: 99,
    ONEFORTYFOUR: 144
  };
  if (!raw) {
    return fallback;
  }
  const result = { ...fallback };
  for (const key of Object.keys(fallback)) {
    if (typeof raw[key] === "number" && Number.isFinite(raw[key])) {
      result[key] = raw[key];
    }
  }
  return result;
}

function paintBackground(ctx, dims, palette) {
  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, dims.width, dims.height);
  ctx.restore();
}

function drawVesicaField(ctx, dims, palette, NUM) {
  ctx.save();
  ctx.globalAlpha = 0.65; // ND-safe softness keeps layer readable without glare.
  ctx.strokeStyle = getLayerColor(palette, 0, "#b1c7ff");
  ctx.lineWidth = Math.max(1, dims.width / (NUM.ONEFORTYFOUR * 1.8));

  const rows = NUM.SEVEN;
  const cols = NUM.THREE;
  const margin = dims.width / NUM.THIRTYTHREE;
  const innerWidth = dims.width - margin * 2;
  const innerHeight = dims.height - margin * 2;
  const horizontalStep = cols > 1 ? innerWidth / (cols - 1) : 0;
  const verticalStep = rows > 1 ? innerHeight / (rows - 1) : 0;
  const radius = Math.min(horizontalStep, verticalStep) * (NUM.NINE / NUM.TWENTYTWO);
  const offset = radius * (NUM.ELEVEN / NUM.TWENTYTWO);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = margin + col * horizontalStep;
      const cy = margin + row * verticalStep;
      drawVesica(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
}

function drawVesica(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTreeOfLife(ctx, dims, palette, NUM) {
  const nodes = buildTreeNodes(dims, NUM);
  const paths = buildTreePaths();
  const nodeRadius = Math.max(6, dims.width / NUM.NINETYNINE);

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = getLayerColor(palette, 1, "#89f7fe");
  ctx.lineWidth = Math.max(1.2, dims.width / (NUM.ONEFORTYFOUR * 2.5));
  ctx.lineJoin = "round";

  for (const [fromKey, toKey] of paths) {
    const from = nodes[fromKey];
    const to = nodes[toKey];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.fillStyle = getLayerColor(palette, 2, "#a0ffa1");
  for (const key of Object.keys(nodes)) {
    const node = nodes[key];
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function buildTreeNodes(dims, NUM) {
  const top = dims.height / NUM.NINE;
  const span = dims.height * (NUM.SEVEN / NUM.NINE);
  const verticalStep = span / NUM.NINE;
  const centerX = dims.width / 2;
  const columnOffset = dims.width * (NUM.ELEVEN / (NUM.TWENTYTWO * NUM.THREE));
  const two = NUM.TWENTYTWO / NUM.ELEVEN;
  const step = NUM.THREE / two; // 3/2 keeps Tree-of-Life tiers distinct without harsh jumps.
  const three = NUM.THREE;
  const six = two * NUM.THREE;
  const nine = NUM.NINE;
  const y = (multiplier) => top + multiplier * verticalStep;
  return {
    keter: { x: centerX, y: y(0) },
    chokmah: { x: centerX + columnOffset, y: y(step) },
    binah: { x: centerX - columnOffset, y: y(step) },
    chesed: { x: centerX + columnOffset, y: y(three) },
    geburah: { x: centerX - columnOffset, y: y(three) },
    tiferet: { x: centerX, y: y(three + step) },
    netzach: { x: centerX + columnOffset, y: y(six) },
    hod: { x: centerX - columnOffset, y: y(six) },
    yesod: { x: centerX, y: y(six + step) },
    malkuth: { x: centerX, y: y(nine) }
  };
}

function buildTreePaths() {
  // 22 paths echo the Hebrew-letter correspondences in a simplified lattice.
  return [
    ["keter", "chokmah"],
    ["keter", "binah"],
    ["keter", "tiferet"],
    ["chokmah", "binah"],
    ["chokmah", "tiferet"],
    ["chokmah", "chesed"],
    ["binah", "tiferet"],
    ["binah", "geburah"],
    ["chesed", "geburah"],
    ["chesed", "tiferet"],
    ["chesed", "netzach"],
    ["geburah", "tiferet"],
    ["geburah", "hod"],
    ["tiferet", "netzach"],
    ["tiferet", "hod"],
    ["tiferet", "yesod"],
    ["netzach", "hod"],
    ["netzach", "yesod"],
    ["hod", "yesod"],
    ["netzach", "malkuth"],
    ["hod", "malkuth"],
    ["yesod", "malkuth"]
  ];
}

function drawFibonacciCurve(ctx, dims, palette, NUM) {
  const fibNumbers = buildFibonacciSequence(NUM.ONEFORTYFOUR);
  const centerX = dims.width * (NUM.ELEVEN / NUM.TWENTYTWO);
  const centerY = dims.height * (NUM.SEVEN / NUM.ELEVEN);
  const scale = Math.min(dims.width, dims.height) / (NUM.ONEFORTYFOUR * NUM.THREE);
  const startAngle = -Math.PI / 2;

  const points = fibNumbers.map((value, index) => {
    const theta = startAngle + index * (Math.PI / NUM.ELEVEN);
    const radius = value * scale;
    return {
      x: centerX + Math.cos(theta) * radius,
      y: centerY + Math.sin(theta) * radius
    };
  });

  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = getLayerColor(palette, 3, "#ffd27f");
  ctx.lineWidth = Math.max(1.4, dims.width / (NUM.ONEFORTYFOUR * 2.2));
  drawPolyline(ctx, points);
  ctx.restore();
}

function buildFibonacciSequence(limit) {
  const sequence = [1, 1];
  while (sequence[sequence.length - 1] < limit) {
    const next = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    if (next > limit) {
      break;
    }
    sequence.push(next);
  }
  return sequence;
}

function drawHelixLattice(ctx, dims, palette, NUM) {
  // 99 segments yield a smooth helix without requiring animation.
  const segments = NUM.NINETYNINE;
  const centerX = dims.width / 2;
  const top = dims.height * (NUM.THREE / NUM.THIRTYTHREE);
  const bottom = dims.height - top;
  const height = bottom - top;
  const amplitude = dims.width / NUM.SEVEN;
  const phaseShift = Math.PI / NUM.THREE;
  const leftStrand = [];
  const rightStrand = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const y = top + t * height;
    const angle = t * Math.PI * NUM.THREE;
    const offsetPrimary = Math.sin(angle) * amplitude;
    const offsetSecondary = Math.sin(angle + phaseShift) * amplitude * (NUM.NINE / NUM.ELEVEN);
    leftStrand.push({ x: centerX - offsetPrimary, y });
    rightStrand.push({ x: centerX + offsetSecondary, y });
  }

  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = getLayerColor(palette, 4, "#f5a3ff");
  ctx.lineWidth = Math.max(1.2, dims.width / (NUM.ONEFORTYFOUR * 2.8));
  drawPolyline(ctx, leftStrand);

  ctx.strokeStyle = getLayerColor(palette, 5, "#d0d0e6");
  drawPolyline(ctx, rightStrand);

  const rungInterval = Math.max(3, Math.floor(segments / NUM.ELEVEN));
  ctx.strokeStyle = getLayerColor(palette, 2, "#a0ffa1");
  ctx.lineWidth = Math.max(1, dims.width / (NUM.ONEFORTYFOUR * 3));
  for (let i = 0; i <= segments; i += rungInterval) {
    const left = leftStrand[i];
    const right = rightStrand[i];
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPolyline(ctx, points) {
  if (points.length === 0) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function getLayerColor(palette, index, fallback) {
  const layers = palette.layers;
  if (!layers || layers.length === 0) {
    return fallback;
  }
  return layers[index % layers.length] || fallback;
}
