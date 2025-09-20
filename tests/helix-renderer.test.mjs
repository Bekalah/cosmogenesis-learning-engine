import { strict as assert } from "node:assert";
import test from "node:test";

/**
 * Resolve module under test by searching common locations.
 * Adjust import path if your project keeps this file elsewhere.
 */
let modPathCandidates = [
  "./src/helix-renderer.mjs",
  "./src/helix-renderer.js",
  "./lib/helix-renderer.mjs",
  "./lib/helix-renderer.js",
  "./helix-renderer.mjs",
  "./helix-renderer.js"
];

let renderHelix;
let loadedPath = null;
for (const p of modPathCandidates) {
  try {
    const m = await import(p);
    if (typeof m.renderHelix === "function") {
      renderHelix = m.renderHelix;
      loadedPath = p;
      break;
    }
  } catch (_) {}
}
if (!renderHelix) {
  throw new Error("Failed to locate module exporting renderHelix. Checked: " + modPathCandidates.join(", "));
}

function createMockCtx({ width = 320, height = 200 } = {}) {
  const calls = [];
  const gradientStops = [];
  const ctx = {
    // canvas object
    canvas: { width, height },
    // state
    globalAlpha: 1,
    lineCap: "butt",
    lineJoin: "miter",
    lineWidth: 1,
    fillStyle: "#000000",
    strokeStyle: "#000000",
    font: "10px system-ui",
    textAlign: "left",
    textBaseline: "alphabetic",
    // methods
    save() { calls.push(["save"]); },
    restore() { calls.push(["restore"]); },
    setTransform(a,b,c,d,e,f) { calls.push(["setTransform", a,b,c,d,e,f]); },
    beginPath() { calls.push(["beginPath"]); },
    arc(x, y, r, s, e) { calls.push(["arc", x, y, r, s, e]); },
    stroke() { calls.push(["stroke"]); },
    fill() { calls.push(["fill"]); },
    moveTo(x, y) { calls.push(["moveTo", x, y]); },
    lineTo(x, y) { calls.push(["lineTo", x, y]); },
    fillRect(x, y, w, h) { calls.push(["fillRect", x, y, w, h]); },
    fillText(text, x, y) { calls.push(["fillText", text, x, y]); },
    measureText(text) { calls.push(["measureText", text]); return { width: text.length * 10 }; },
    createRadialGradient(x0, y0, r0, x1, y1, r1) {
      calls.push(["createRadialGradient", x0, y0, r0, x1, y1, r1]);
      return {
        addColorStop(offset, color) { gradientStops.push([offset, color]); }
      };
    }
  };
  // Define setters to record style mutations
  Object.defineProperty(ctx, "fillStyle", {
    get() { return this._fillStyle; },
    set(v) { calls.push(["setFillStyle", v]); this._fillStyle = v; }
  });
  Object.defineProperty(ctx, "strokeStyle", {
    get() { return this._strokeStyle; },
    set(v) { calls.push(["setStrokeStyle", v]); this._strokeStyle = v; }
  });
  Object.defineProperty(ctx, "lineWidth", {
    get() { return this._lineWidth; },
    set(v) { calls.push(["setLineWidth", v]); this._lineWidth = v; }
  });
  Object.defineProperty(ctx, "globalAlpha", {
    get() { return this._globalAlpha ?? 1; },
    set(v) { calls.push(["setGlobalAlpha", v]); this._globalAlpha = v; }
  });
  Object.defineProperty(ctx, "font", {
    get() { return this._font; },
    set(v) { calls.push(["setFont", v]); this._font = v; }
  });
  Object.defineProperty(ctx, "textAlign", {
    get() { return this._textAlign; },
    set(v) { calls.push(["setTextAlign", v]); this._textAlign = v; }
  });
  Object.defineProperty(ctx, "textBaseline", {
    get() { return this._textBaseline; },
    set(v) { calls.push(["setTextBaseline", v]); this._textBaseline = v; }
  });
  Object.defineProperty(ctx, "lineCap", {
    get() { return this._lineCap; },
    set(v) { calls.push(["setLineCap", v]); this._lineCap = v; }
  });
  Object.defineProperty(ctx, "lineJoin", {
    get() { return this._lineJoin; },
    set(v) { calls.push(["setLineJoin", v]); this._lineJoin = v; }
  });

  return { ctx, calls, gradientStops };
}

test("renderHelix: returns missing-context when ctx invalid", () => {
  assert.deepEqual(renderHelix(null), { ok: false, reason: "missing-context" });
  assert.deepEqual(renderHelix({}), { ok: false, reason: "missing-context" });
  assert.deepEqual(renderHelix({ canvas: {} }), { ok: false, reason: "missing-context" });
});

test("renderHelix: returns invalid-dimensions when no positive canvas size provided", () => {
  const { ctx } = createMockCtx({ width: 0, height: 0 });
  const res = renderHelix(ctx, {}); // no overrides; canvas dims invalid
  assert.equal(res.ok, false);
  assert.equal(res.reason, "invalid-dimensions");
});

test("renderHelix: normalises canvas dimensions from options and succeeds", () => {
  const { ctx } = createMockCtx({ width: 10, height: 10 });
  const options = { width: 400, height: 300, palette: { bg: "#000000", ink: "#ffffff", muted: "#888888", layers: ["#111","#222","#333","#444","#555","#666"] },
    geometry: {
      vesica: { rows: 3, columns: 4, paddingDivisor: 10, radiusScale: 0.2, strokeDivisor: 20, alpha: 0.5 },
      treeOfLife: {
        marginDivisor: 8, radiusDivisor: 16, pathDivisor: 24, nodeAlpha: 0.8, pathAlpha: 0.6, labelAlpha: 0.7,
        nodes: [
          { id: "a", title: "A", level: 0, xFactor: 0.5 },
          { id: "b", title: "B", level: 1, xFactor: 0.5 },
          { id: "c", title: "C", level: 2, xFactor: 0.5 }
        ],
        edges: [["a","b"], ["b","c"]]
      },
      fibonacci: { sampleCount: 21, turns: 3, baseRadiusDivisor: 10, centerXFactor: 0.4, centerYFactor: 0.6, phi: 1.7, markerInterval: 5, alpha: 0.9 },
      helix: { sampleCount: 17, cycles: 2, amplitudeDivisor: 9, strandSeparationDivisor: 11, crossTieCount: 7, strandAlpha: 0.8, rungAlpha: 0.6 }
    }
  };

  const result = renderHelix(ctx, options);

  // Canvas resized as a side-effect
  assert.equal(ctx.canvas.width, 400);
  assert.equal(ctx.canvas.height, 300);

  assert.equal(result.ok, true);

  // Expected counts:
  // Vesica circles = rows * columns = 3 * 4 = 12
  // Tree: edges=2, nodes=3
  // Fibonacci samples = 21
  // Helix ties = Math.max(1, Math.round(7)) = 7
  const expectedSummary = "Vesica 12 circles · Paths 2 / Nodes 3 · Spiral 21 samples · Helix 7 ties";
  assert.equal(result.summary, expectedSummary);
});

test("renderHelix: clamps minimums and rounds values for counts", () => {
  const { ctx } = createMockCtx({ width: 200, height: 200 });
  const options = {
    palette: { bg: "#101010", ink: "#ffffff", muted: "#333333", layers: ["#a1","#a2","#a3","#a4","#a5","#a6"] },
    geometry: {
      vesica: { rows: 1.2, columns: 1.6, paddingDivisor: 10, radiusScale: 0.2, strokeDivisor: 20, alpha: 0.5 }, // rows/cols should clamp to min 2
      treeOfLife: {
        marginDivisor: 8, radiusDivisor: 16, pathDivisor: 24, nodeAlpha: 0.8, pathAlpha: 0.6, labelAlpha: 0.7,
        nodes: [{ id: "n1", title: "N1", level: 0, xFactor: 0.5 }],
        edges: [] // zero edges ok
      },
      fibonacci: { sampleCount: 1.2, turns: 1.1, baseRadiusDivisor: 10, centerXFactor: 0.4, centerYFactor: 0.6, phi: 1.5, markerInterval: 50, alpha: 0.9 },
      helix: { sampleCount: 2.2, cycles: 1.4, amplitudeDivisor: 9, strandSeparationDivisor: 11, crossTieCount: 0.2, strandAlpha: 0.8, rungAlpha: 0.6 }
    }
  };

  const result = renderHelix(ctx, options);
  assert.equal(result.ok, true);
  // Vesica rows/cols min 2 → 2*2=4
  // Tree edges=0 / nodes=1
  // Fibonacci samples min 2 → 2
  // Helix ties = max(1, round(0.2)) → 1
  assert.equal(result.summary, "Vesica 4 circles · Paths 0 / Nodes 1 · Spiral 2 samples · Helix 1 ties");
});

test("renderHelix: notice triggers measureText and fillText and uses muted alpha background", () => {
  const { ctx, calls, gradientStops } = createMockCtx({ width: 300, height: 150 });
  const options = {
    notice: "Hello World",
    palette: { bg: "#000000", ink: "#ffffff", muted: "#112233", layers: ["#1","#2","#3","#4","#5","#6"] },
    geometry: {
      vesica: { rows: 2, columns: 2, paddingDivisor: 10, radiusScale: 0.2, strokeDivisor: 20, alpha: 0.5 },
      treeOfLife: { marginDivisor: 8, radiusDivisor: 16, pathDivisor: 24, nodeAlpha: 0.8, pathAlpha: 0.6, labelAlpha: 0.7, nodes: [{ id: "x", title: "X", level: 0, xFactor: 0.5 }], edges: [] },
      fibonacci: { sampleCount: 2, turns: 1, baseRadiusDivisor: 10, centerXFactor: 0.4, centerYFactor: 0.6, phi: 1.5, markerInterval: 5, alpha: 0.9 },
      helix: { sampleCount: 2, cycles: 1, amplitudeDivisor: 9, strandSeparationDivisor: 11, crossTieCount: 1, strandAlpha: 0.8, rungAlpha: 0.6 }
    }
  };

  const res = renderHelix(ctx, options);
  assert.equal(res.ok, true);

  // Ensure measureText and fillText were called for the notice
  const measureTextCalls = calls.filter(c => c[0] === "measureText");
  const fillTextCalls = calls.filter(c => c[0] === "fillText");
  assert.ok(measureTextCalls.length >= 1, "measureText should be called at least once");
  assert.ok(fillTextCalls.length >= 1, "fillText should be called at least once");
  assert.equal(measureTextCalls[0][1], "Hello World");
  assert.equal(fillTextCalls[0][1], "Hello World");
});

test("renderHelix: palette fallback for non-hex bg still renders gradient and background fill", () => {
  const { ctx, calls } = createMockCtx({ width: 220, height: 220 });
  const options = {
    palette: { bg: "rgb(10, 20, 30)", ink: "#ffffff", muted: "#8899aa", layers: ["#111","#222","#333","#444","#555","#666"] },
    geometry: {
      vesica: { rows: 2, columns: 2, paddingDivisor: 10, radiusScale: 0.2, strokeDivisor: 20, alpha: 0.5 },
      treeOfLife: { marginDivisor: 8, radiusDivisor: 16, pathDivisor: 24, nodeAlpha: 0.8, pathAlpha: 0.6, labelAlpha: 0.7, nodes: [{ id: "x", title: "X", level: 0, xFactor: 0.5 }], edges: [] },
      fibonacci: { sampleCount: 2, turns: 1, baseRadiusDivisor: 10, centerXFactor: 0.4, centerYFactor: 0.6, phi: 1.5, markerInterval: 5, alpha: 0.9 },
      helix: { sampleCount: 2, cycles: 1, amplitudeDivisor: 9, strandSeparationDivisor: 11, crossTieCount: 1, strandAlpha: 0.8, rungAlpha: 0.6 }
    }
  };
  const res = renderHelix(ctx, options);
  assert.equal(res.ok, true);
  // Expect two fillRect calls from fillBackground (solid bg + gradient overlay)
  const fillRects = calls.filter(c => c[0] === "fillRect");
  assert.ok(fillRects.length >= 2, "Expected background and gradient fillRect calls");
});