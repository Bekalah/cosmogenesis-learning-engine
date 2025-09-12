/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine tracks)

  Rationale:
    - no motion or autoplay; single render call for calm focus
    - muted palette for gentle contrast
    - geometry uses numerology constants (3, 7, 9, 11, 22, 33, 99, 144)
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, { width, height, color: palette.layers[0], NUM });
  drawTreeOfLife(ctx, {
    width,
    height,
    pathColor: palette.layers[1],
    nodeColor: palette.layers[2],
    NUM,
  });
  drawFibonacci(ctx, { width, height, color: palette.layers[3], NUM });
  drawHelix(ctx, {
    width,
    height,
    colors: [palette.layers[4], palette.layers[5]],
    NUM,
  });
}

// Layer 1: Vesica grid (11 x 9 -> 99 circles)
function drawVesica(ctx, { width, height, color, NUM }) {
  const cols = NUM.ELEVEN;
  const rows = NUM.NINE;
  const total = NUM.NINETYNINE; // explicit 99 count
  const stepX = width / cols;
  const stepY = height / rows;
  const r = Math.min(stepX, stepY) * 0.6; // 60% overlap for womb effect
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < total; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = stepX / 2 + col * stepX;
    const y = stepY / 2 + row * stepY;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// Layer 2: Tree-of-Life scaffold (10 nodes, 22 paths)
function drawTreeOfLife(ctx, { width, height, pathColor, nodeColor, NUM }) {
  const centerX = width / 2;
  const yUnit = height / (NUM.SEVEN + 1); // seven vertical tiers
  const xUnit = yUnit * 0.8;

  const nodes = [
    [0, 0],
    [-1, 1],
    [1, 1],
    [-1.5, 2],
    [1.5, 2],
    [0, 3],
    [-1.5, 4],
    [1.5, 4],
    [0, 5],
    [0, 6],
  ].map(([x, y]) => [centerX + x * xUnit, yUnit + y * yUnit]);

  const paths = [
    [0, 1], [0, 2], [1, 2],
    [1, 3], [1, 5], [2, 4], [2, 5],
    [3, 4], [3, 5], [4, 5],
    [3, 6], [3, 8], [4, 7], [4, 8],
    [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [6, 9], [7, 9], [8, 9],
  ].slice(0, NUM.TWENTYTWO); // enforce 22 paths

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = yUnit / 4;
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve (static log spiral)
function drawFibonacci(ctx, { width, height, color, NUM }) {
  const cx = width / 2;
  const cy = height / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.ONEFORTYFOUR; // 144 segments for smoothness
  const thetaMax = 4 * Math.PI; // two turns
  const scale = Math.min(width, height) / NUM.THIRTYTHREE;

  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * thetaMax;
    const r = scale * Math.pow(phi, t / (2 * Math.PI));
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Layer 4: Double-helix lattice (two sine curves with rungs)
function drawHelix(ctx, { width, height, colors, NUM }) {
  const steps = NUM.ONEFORTYFOUR;
  const amplitude = width / NUM.NINE;
  const freq = (2 * Math.PI * NUM.THREE) / height; // three turns
  const rungStep = Math.floor(steps / NUM.THIRTYTHREE); // 33 rungs

  const curve = (phase) => {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const y = (i / steps) * height;
      const x = width / 2 + amplitude * Math.sin(freq * y + phase);
      pts.push([x, y]);
    }
    return pts;
  };

  const a = curve(0);
  const b = curve(Math.PI);

  ctx.lineWidth = 2;
  ctx.strokeStyle = colors[0];
  ctx.beginPath();
  a.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();

  ctx.strokeStyle = colors[1];
  ctx.beginPath();
  b.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();

  ctx.strokeStyle = colors[0];
  for (let i = 0; i <= steps; i += rungStep) {
    const y = (i / steps) * height;
    const x1 = a[i][0];
    const x2 = b[i][0];
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}
