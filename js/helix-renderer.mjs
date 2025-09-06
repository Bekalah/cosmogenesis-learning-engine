/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  Why ND-safe: no animation, gentle palette, high contrast, pure functions.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], palette.layers[4], NUM);
}

function drawVesica(ctx, w, h, color, NUM) {
  // Vesica field: simple grid using sacred ratio
  const r = Math.min(w, h) / NUM.ELEVEN; // radius based on 11
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    const cx = w / 2 + i * r;
    const cy = h / 2;
    ctx.beginPath();
    ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawTree(ctx, w, h, color, NUM) {
  // Simplified Tree of Life: 10 nodes, 22 paths
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  const stepY = h / NUM.NINE;
  const stepX = w / NUM.SEVEN;
  const nodes = [
    [3.5, 1], // Keter
    [2, 2], [5, 2], // Chokmah, Binah
    [2, 4], [5, 4], // Chesed, Gevurah
    [3.5, 5], // Tiferet
    [2, 6.5], [5, 6.5], // Netzach, Hod
    [3.5, 8], // Yesod
    [3.5, 9] // Malkuth
  ].map(([x, y]) => [x * stepX, y * stepY]);

  const paths = [
    [0, 1], [0, 2], [1, 2],
    [1, 3], [2, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [6, 5], [7, 5],
    [6, 8], [7, 8], [8, 9],
    [1, 4], [2, 3], [1, 5], [2, 5],
    [0, 5], [6, 7], [6, 9], [7, 9]
  ];

  ctx.lineWidth = 1;
  for (const [a, b] of paths) {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  }

  const rNode = w / NUM.NINETYNINE * NUM.THREE; // small nodes
  for (const [x, y] of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, rNode, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFibonacci(ctx, w, h, color, NUM) {
  // Approximate Fibonacci spiral using logarithmic curve
  const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
  const centerX = w / NUM.THREE; // place spiral at left third
  const centerY = h / NUM.THREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const turns = NUM.THREE; // three turns
  for (let a = 0; a < Math.PI * 2 * turns; a += Math.PI / NUM.TWENTYTWO) {
    const r = Math.pow(phi, a / (Math.PI / 2)) * NUM.THREE;
    const x = centerX + r * Math.cos(a);
    const y = centerY + r * Math.sin(a);
    if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  // Double helix lattice: two sine waves with crossbars
  const amplitude = h / NUM.NINE;
  const step = w / NUM.ONEFORTYFOUR * NUM.THREE; // based on 144 and 3
  ctx.lineWidth = 1;

  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h / 2 + amplitude * Math.sin((x / w) * NUM.THIRTYTHREE);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h / 2 + amplitude * Math.sin((x / w) * NUM.THIRTYTHREE + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorA;
  for (let x = 0; x <= w; x += step * NUM.SEVEN) {
    const y1 = h / 2 + amplitude * Math.sin((x / w) * NUM.THIRTYTHREE);
    const y2 = h / 2 + amplitude * Math.sin((x / w) * NUM.THIRTYTHREE + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
