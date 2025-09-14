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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
>>>>>>>+codex/add-batch
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
  const radius = Math.min(w, h) / N.THREE; // gentle radius softens intersections
  const step = radius / N.SEVEN; // density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses
  // 7 so the grid remains gentle and non-distracting.
  const radius = Math.min(w, h) / N.THREE;           // large gentle circles
  const step = radius / N.SEVEN;                    // grid density from 7
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
    { x: w / 2, y: h * 0.05 }, // Kether
    { x: w * 0.25, y: h * 0.15 }, // Chokmah
    { x: w * 0.75, y: h * 0.15 }, // Binah
    { x: w * 0.25, y: h * 0.35 }, // Chesed
    { x: w * 0.75, y: h * 0.35 }, // Geburah
    { x: w / 2, y: h * 0.45 }, // Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // Netzach
    { x: w * 0.75, y: h * 0.65 }, // Hod
    { x: w / 2, y: h * 0.75 }, // Yesod
    { x: w / 2, y: h * 0.9 } // Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for calm readability
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — golden spiral polyline.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
>>>>>>>+codex/add-batch
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR;
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

// Layer 4: Double-helix lattice — two still sine tracks.
function drawHelix(ctx, w, h, colorA, colorB, N) {
  const midY = h / 2;
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // keeps curve smooth without motion
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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
>>>>>>>+codex/add-batch
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  const stepX = w / N.ONEFORTYFOUR;                 // small step for smoothness
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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
>>>>>>>+codex/add-batch
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so the
  // grid remains gentle and non-distracting.
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    // Node size tied to 9 echoes lunar cycles and keeps nodes readable.
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  // Amplitude governed by 99 and 11 echoes twin pillars softly.
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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE; // radius tied to 3 for broad calm circles
  const step = radius / N.SEVEN; // 7 softens grid density for ND safety
  // Radii derived from 3 keep shapes roomy; step uses 7 so the grid stays gentle.
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
>>>>>>> main
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9 for readable harmony
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
>>>>>>> main
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // step uses 144 for smooth static curve
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> main
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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE; // radius tied to 3 for broad calm circles
  const step = radius / N.SEVEN; // 7 softens grid density for ND safety
  // Radii derived from 3 keep shapes roomy; step uses 7 so the grid stays gentle.
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
>>>>>>> origin/main
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9 for readable harmony
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
>>>>>>> origin/main
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // step uses 144 for smooth static curve
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> main
>>>>>>> origin/main
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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE; // large circles leave breathing room
  const step = radius / N.SEVEN; // 7 sets gentle overlap
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
  const radius = Math.min(w, h) / N.THREE; // gentle radius softens intersections
  const step = radius / N.SEVEN; // density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses
  // 7 so the grid remains gentle and non-distracting.
>>>>>>> codex/create-json-schema-for-number-symbolism
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = N.NINE / 3; // node size tied to 9 for lunar resonance
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for calm readability
>>>>>>> codex/create-json-schema-for-number-symbolism
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> main
>>>>>>> origin/main
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // keeps curve smooth without motion
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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
>>>>>>>+codex/add-batch
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> codex/create-json-schema-for-number-symbolism
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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> upstream/main
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> upstream/main
>>>>>>> codex/create-json-schema-for-number-symbolism
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

  // Layer order from base to foreground keeps depth readable without motion.
  drawVesicaField(ctx, width, height, palette.layers[0], N);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], N);
  drawFibonacci(ctx, width, height, palette.layers[3], N);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], N);
}

// Layer 1: Vesica field — static circle grid, no blending or motion.
function drawVesicaField(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  const radius = Math.min(w, h) / N.THREE;       // large circles keep calm rhythm
  const step = radius / N.SEVEN;                  // grid density tuned by 7 for soft spacing
  const radius = Math.min(w, h) / N.THREE; // large circles keep intersections soft
  const step = radius / N.SEVEN; // spacing tuned by 7 for gentle density
  const radius = Math.min(w, h) / N.THREE; // large enough to breathe
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
<<  const radius = Math.min(w, h) / N.THREE; // large circles keep space calm
  const step = radius / N.SEVEN; // grid density tuned by 7 for gentle spacing
  const radius = Math.min(w, h) / N.THREE; // large circles, gentle intersections
  const step = radius / N.SEVEN; // grid density tuned by 7 for calm spacing
  // Radii derived from 3 keep shapes large enough to breathe; step uses 7 so
  // the grid remains gentle and non-distracting.
  // Radii derived from 3 keeps shapes large enough to breathe; step uses 7 so the grid remains gentle.
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
>>>>>>> Stashed changes
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, nodeR, 0, Math.PI * 2);
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
===
>>>>>>> codex/create-json-schema-for-number-symbolism
>>>>>>> Stashed changes
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>> codex/create-json-schema-for-number-symbolism
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
>>>>>>> upstream/main
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
>>>>>>> Stashed changes
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
>>>>>>> codex/create-json-schema-for-number-symbolism
>>>>>>> Stashed changes
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
>>>>>>> upstream/main
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> upstream/main
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
>>>>>>> codex/create-json-schema-for-number-symbolism
>>>>>>> Stashed changes
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
>>>>>>> upstream/main
=====
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
  ctx.lineWidth = 2; // soft edges for ND safety
  ctx.lineWidth = N.TWENTYTWO / N.ELEVEN; // 2: gentle stroke width

  const nodes = [
    { x: w / 2, y: h * 0.05 },  // 0 Kether
    { x: w * 0.25, y: h * 0.15 }, // 1 Chokmah
    { x: w * 0.75, y: h * 0.15 }, // 2 Binah
    { x: w * 0.25, y: h * 0.35 }, // 3 Chesed
    { x: w * 0.75, y: h * 0.35 }, // 4 Geburah
    { x: w / 2, y: h * 0.45 }, // 5 Tiphereth
    { x: w * 0.25, y: h * 0.65 }, // 6 Netzach
    { x: w * 0.75, y: h * 0.65 }, // 7 Hod
    { x: w / 2, y: h * 0.75 }, // 8 Yesod
    { x: w / 2, y: h * 0.9 }  // 9 Malkuth
  ];

  const paths = [
    [0,1],[0,2],[0,5],[1,2],[1,5],[2,5],
    [1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],[6,9],[7,9],[8,9]
  ];
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [2, 5],
    [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7], [6, 7],
    [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9]
  ]; // 22 paths (N.TWENTYTWO)

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = N.NINE / 3; // node size tied to 9 for lunar echo
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9 for balance
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius ties to 9; calm presence
  const nodeRadius = N.NINE / 3; // echo lunar cycles, keep small
  nodes.forEach(n => {
    ctx.beginPath();
    // Node size tied to 9 echoes lunar cycles and stays readable.
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // small node radius for gentle presence
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node size tied to 9
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // radius tied to 9 echoes lunar cycles
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // size tied to 9 for lunar echo
    // Node size tied to 9 to echo lunar cycles and stay readable.
<<<<    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.arc(n.x, n.y, N.NINE / 3, 0, Math.PI * 2); // node radius tied to 9
>>>>>>>+codex/add-batch
===
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static golden spiral polyline, no animation.
function drawFibonacci(ctx, w, h, color, N) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2; // consistent stroke width for calm reading
  const fib = [1, 1];
  const fib = [1,1];
  // Only first 9 numbers used; spiral stays modest and deterministic.
  while (fib.length < N.NINE) fib.push(fib[fib.length-1] + fib[fib.length-2]);
  const scale = Math.min(w, h) / N.ONEFORTYFOUR; // golden curve size
  while (fib.length < N.NINE) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const scale = Math.min(w,h) / N.ONEFORTYFOUR; // golden curve size
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
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // gentle vertical spread
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // 99 & 11 echo twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without motion
  const amplitude = (h / N.NINETYNINE) * N.ELEVEN; // twin pillars softly
  const stepX = w / N.ONEFORTYFOUR; // smooth curve without motion
  // Amplitude governed by 99 and 11 to echo twin pillars softly.
<<<<<<<   const amplitude = (h / N.NINETYNINE) * N.ELEVEN;
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth without animation
  const stepX = w / N.ONEFORTYFOUR; // small step keeps curve smooth
>>>>>>>+codex/add-batch
>>>>>>> origin/codex/add-symbolic-correspondences-for-numbers
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
>>>>>>> upstream/main
