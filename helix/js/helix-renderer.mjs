/*
  helix-renderer.mjs
  Motto: Per Texturas Numerorum, Spira Loquitur.
  ND-safe static renderer for layered sacred geometry.
  No animation, no external deps. Called by index.html.
  Geometry scales parameterized by numerology constants 3,7,9,11,22,33,99,144.
*/

export const NUM = Object.freeze({
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144,
});

// Draw vesica field (intersecting circles forming gentle grid)

  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  // horizontal pair
  ctx.beginPath();
  ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
  ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  // vertical mirrors to hint at layered depth (no fill to avoid flashing)
  ctx.beginPath();
  ctx.arc(cx - r / 2, cy - r, r, 0, Math.PI * 2);
  ctx.arc(cx + r / 2, cy - r, r, 0, Math.PI * 2);
  ctx.arc(cx - r / 2, cy + r, r, 0, Math.PI * 2);
  ctx.arc(cx + r / 2, cy + r, r, 0, Math.PI * 2);
  ctx.stroke();
}

// Draw Tree-of-Life nodes and connecting paths

  const nodes = [
    { x: 0.5, y: 0.06 }, // Kether
    { x: 0.35, y: 0.18 },
    { x: 0.65, y: 0.18 }, // Chokmah, Binah
    { x: 0.25, y: 0.38 },
    { x: 0.75, y: 0.38 }, // Chesed, Gevurah
    { x: 0.5, y: 0.5 }, // Tipheret
    { x: 0.35, y: 0.68 },
    { x: 0.65, y: 0.68 }, // Netzach, Hod
    { x: 0.5, y: 0.82 }, // Yesod
    { x: 0.5, y: 0.94 }, // Malkuth
  ].map((p) => ({ x: p.x * w, y: p.y * h }));
  const paths = [
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
    [1, 5],
    [2, 4],
    [2, 5],
    [3, 5],
    [4, 5],
    [3, 6],
    [4, 7],
    [5, 6],
    [5, 7],
    [6, 7],
    [6, 8],
    [7, 8],
    [8, 9],
  ];
  ctx.strokeStyle = colorPath;
  ctx.lineWidth = 2;
  for (const [a, b] of paths) {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  }
  // nodes
  ctx.fillStyle = colorNode;
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.SEVEN / 2, 0, Math.PI * 2); // node size tuned by 7
    ctx.fill();
  }
}

// Draw static Fibonacci spiral as polyline

  const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
  const c = Math.min(w, h) / N.ONEFORTYFOUR; // base radius tied to 144
  const center = { x: w * 0.8, y: h * 0.2 };
  const pts = [];
  for (let t = 0; t <= N.THIRTYTHREE; t += 0.1) {
    // 0..33 radians
    const r = c * Math.pow(phi, t / (Math.PI / 2));
    const x = center.x + r * Math.cos(t);
    const y = center.y + r * Math.sin(t);
    pts.push([x, y]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach(([x, y], i) => {
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
}

// Draw static double helix lattice

  ctx.lineWidth = 1.5;
  for (let i = 0; i < 2; i++) {
    const phase = i * Math.PI;
    ctx.strokeStyle = colors[i] || colors[0];
    ctx.beginPath();
    for (let y = 0; y <= h; y += 1) {
      const x = w / 2 + amp * Math.sin(freq * y + phase);
      y === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // lattice rungs every 18 (9*2) pixels to maintain calm rhythm
  ctx.strokeStyle = colors[2] || colors[0];
  for (let y = 0; y <= h; y += N.NINE * 2) {
    const x1 = w / 2 + amp * Math.sin(freq * y);
    const x2 = w / 2 + amp * Math.sin(freq * y + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}

export function renderHelix(ctx, opts) {
  const { width: w, height: h, palette, NUM: N = NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);
  // Layer order ensures depth without motion
  drawVesica(ctx, w, h, palette.layers[0], N); // L1
  drawTree(ctx, w, h, palette.layers[1], palette.layers[2], N); // L2
  drawFibonacci(ctx, w, h, palette.layers[3], N); // L3
  drawHelix(ctx, w, h, palette.layers.slice(4), N); // L4
}
