/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine curves)

  Rationale:
    - no motion or flashing; everything rendered once
    - muted palette for calm contrast
    - numerology constants wire geometry to 3/7/9/11/22/33/99/144
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM: N } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE; // gentle radius softens intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  for (let y = radius; y <= h - radius; y += step) {
    for (let x = radius; x <= w - radius; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Layer 2: Tree-of-Life — fixed nodes and paths; thin strokes avoid harsh contrast.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, N) {
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2; // keeps edges soft for ND safety

  const nodes = [
    { x: w / 2, y: h * 0.05 }, // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 } // 9 Malkuth
  ];

  const paths = [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ];

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  let angle = 0;
  let x = w / 2;
  let y = h / 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  fib.forEach((f) => {
    angle += Math.PI / 2;
    x += Math.cos(angle) * f * scale;
    y += Math.sin(angle) * f * scale;
    ctx.lineTo(x, y);
  });
  ctx.stroke();
}

// Layer 4: Double-helix lattice — two still sine tracks; amplitude limited for calm weave.
function drawHelix(ctx, w, h, colorA, colorB, N) {
  const midY = h / 2;
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  ctx.lineWidth = 2;
  for (let phase = 0; phase < 2; phase++) {
    ctx.strokeStyle = phase === 0 ? colorA : colorB;
    ctx.beginPath();
    for (let x = 0; x <= w; x += stepX) {
      const y =
        midY +
        amplitude * Math.sin((x / w) * N.THIRTYTHREE * Math.PI + phase * Math.PI);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

