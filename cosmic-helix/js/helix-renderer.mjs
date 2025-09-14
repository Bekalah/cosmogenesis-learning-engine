/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
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

  // Layer order from base to foreground clarifies depth without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
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
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // Kether
    { x: w * 0.25, y: h * 0.15 }, // Chokmah
    { x: w * 0.75, y: h * 0.15 }, // Binah
    { x: w * 0.25, y: h * 0.35 }, // Chesed
    { x: w * 0.75, y: h * 0.35 }, // Geburah
    { x: w / 2, y: h * 0.45 }, // Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // Netzach
    { x: w * 0.75, y: h * 0.65 }, // Hod
    { x: w / 2, y: h * 0.75 }, // Yesod
    { x: w / 2, y: h * 0.9 }  // Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // size tied to 9 for calm readability
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — golden spiral polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const fib = [1,1];
  while (fib.length < N.NINE) {
    const len = fib.length;
    fib.push(fib[len - 1] + fib[len - 2]);
  }
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  let angle = 0;
  let x = w / 2;
  let y = h / 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  fib.forEach(f => {
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
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  ctx.lineWidth = 2;
  for (let phase = 0; phase < 2; phase++) {
    ctx.strokeStyle = phase === 0 ? colorA : colorB;
    ctx.beginPath();
    for (let x = 0; x <= w; x += stepX) {
      const y = midY + amplitude * Math.sin((x / w) * N.THIRTYTHREE * Math.PI + phase * Math.PI);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
