/*
  helix-renderer.mjs
  Per Texturas Numerorum, Spira Loquitur.
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
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

function drawVesicaField(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / NUM.THREE; // ensures soft overlap
  const step = radius / NUM.SEVEN; // grid density tuned by 7
  for (let y = radius; y <= h - radius; y += step) {
    for (let x = radius; x <= w - radius; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawTreeOfLife(ctx, w, h, nodeColor, pathColor, NUM) {
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  const nodes = [];
  const centerX = w / 2;
  const topY = h / NUM.ELEVEN; // proportioned via 11
  const verticalStep = (h - topY * 2) / NUM.NINE;
  for (let i = 0; i < 10; i++) {
    nodes.push({ x: centerX, y: topY + i * verticalStep });
  }
  // Draw paths (simple straight connections for ND-safety clarity)
  nodes.forEach((a, i) => {
    for (let j = i + 1; j < nodes.length; j++) {
      if ((j - i) % NUM.THREE === 0 || (j - i) === 1) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  });
  // Nodes
  ctx.fillStyle = nodeColor;
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, NUM.NINE / 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const fib = [1, 1];
  while (fib.length < NUM.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR; // golden curve size
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

function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const midY = h / 2;
  const amplitude = h / NUM.NINETYNINE * NUM.ELEVEN; // gentle vertical spread
  const stepX = w / NUM.ONEFORTYFOUR;
  ctx.lineWidth = 2;
  for (let phase = 0; phase < 2; phase++) {
    ctx.strokeStyle = phase === 0 ? colorA : colorB;
    ctx.beginPath();
    for (let x = 0; x <= w; x += stepX) {
      const y = midY + amplitude * Math.sin((x / w) * NUM.THIRTYTHREE * Math.PI + phase * Math.PI);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
