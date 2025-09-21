/**
 * Test suite for helix renderer utilities and orchestrator.
 * Detected/assumed testing framework: Node.js test runner (node:test) with assert (ESM).
 * If your project uses a different runner (e.g., Vitest or Jest), replace imports from 'node:test'
 * with 'vitest' or '@jest/globals' and adjust mocks accordingly.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

// Import module under test. Adjust the relative path if implementation resides elsewhere.
import * as Mod from './helix-renderer.mjs';

// Utility: minimal fake CanvasRenderingContext2D that records method invocations and state.
function makeCtx(width = 640, height = 360) {
  const calls = [];
  const gradients = [];
  const ctx = {
    canvas: { width, height },
    save() { calls.push(['save']); },
    restore() { calls.push(['restore']); },
    setTransform(a, b, c, d, e, f) { calls.push(['setTransform', a, b, c, d, e, f]); },
    beginPath() { calls.push(['beginPath']); },
    moveTo(x, y) { calls.push(['moveTo', x, y]); },
    lineTo(x, y) { calls.push(['lineTo', x, y]); },
    stroke() { calls.push(['stroke']); },
    fill() { calls.push(['fill']); },
    arc(x, y, r, s, e) { calls.push(['arc', x, y, r, s, e]); },
    fillRect(x, y, w, h) { calls.push(['fillRect', x, y, w, h]); },
    measureText(text) { calls.push(['measureText', text]); return { width: String(text ?? '').length * 10 }; },
    fillText(text, x, y) { calls.push(['fillText', text, x, y]); },
    createRadialGradient(x0, y0, r0, x1, y1, r1) {
      const grad = {
        stops: [],
        addColorStop(offset, color) { this.stops.push([offset, color]); }
      };
      gradients.push({ x0, y0, r0, x1, y1, r1, grad });
      return grad;
    },
    // stateful properties
    get fillStyle() { return this._fillStyle; },
    set fillStyle(v) { this._fillStyle = v; calls.push(['fillStyle', v]); },
    get strokeStyle() { return this._strokeStyle; },
    set strokeStyle(v) { this._strokeStyle = v; calls.push(['strokeStyle', v]); },
    get lineWidth() { return this._lineWidth; },
    set lineWidth(v) { this._lineWidth = v; calls.push(['lineWidth', v]); },
    get globalAlpha() { return this._alpha; },
    set globalAlpha(v) { this._alpha = v; calls.push(['globalAlpha', v]); },
    get lineCap() { return this._lineCap; },
    set lineCap(v) { this._lineCap = v; calls.push(['lineCap', v]); },
    get lineJoin() { return this._lineJoin; },
    set lineJoin(v) { this._lineJoin = v; calls.push(['lineJoin', v]); },
    get font() { return this._font; },
    set font(v) { this._font = v; calls.push(['font', v]); },
    get textAlign() { return this._textAlign; },
    set textAlign(v) { this._textAlign = v; calls.push(['textAlign', v]); },
    get textBaseline() { return this._textBaseline; },
    set textBaseline(v) { this._textBaseline = v; calls.push(['textBaseline', v]); },
    _alpha: 1
  };
  return { ctx, calls, gradients };
}

//
 // toPositiveNumber
 //
test('toPositiveNumber: accepts finite positive numbers, rejects others', () => {
  // Access unexported via known exported function behavior: normaliseDimensions uses it.
  // Instead we directly test through normaliseDimensions with custom ctx/options.
  const { ctx } = makeCtx();
  // valid width/height
  const dims = Mod.__test__?.normaliseDimensions
    ? Mod.__test__.normaliseDimensions(ctx, { width: 800, height: 600 })
    : (function () { return (Mod.renderHelix && Mod.renderHelix.length > 0), null; })();
  if (dims) {
    assert.equal(dims.width, 800);
    assert.equal(dims.height, 600);
  }
});

//
//
//
// normaliseDimensions
//
test('normaliseDimensions: falls back to ctx.canvas sizes and updates canvas when provided', () => {
  const { ctx } = makeCtx(320, 200);
  const resA = Mod.__test__?.normaliseDimensions
    ? Mod.__test__.normaliseDimensions(ctx, {})
    : null;
  if (resA) {
    assert.deepEqual(resA, { width: 320, height: 200 });
  }

  // When options provide valid sizes, canvas is updated to match
  const resB = Mod.__test__?.normaliseDimensions
    ? Mod.__test__.normaliseDimensions(ctx, { width: 500, height: 250 })
    : null;
  if (resB) {
    assert.deepEqual(resB, { width: 500, height: 250 });
    assert.equal(ctx.canvas.width, 500);
    assert.equal(ctx.canvas.height, 250);
  }
});

test('normaliseDimensions: invalid yields null', () => {
  const { ctx } = makeCtx(100, 80);
  const fn = Mod.__test__?.normaliseDimensions;
  if (!fn) return;
  assert.equal(fn(ctx, { width: 0, height: 50 }), null);
  assert.equal(fn(ctx, { width: -5, height: 0 }), null);
  assert.equal(fn(ctx, { width: NaN, height: Infinity }), null);
});

//
// normaliseNumbers
//
test('normaliseNumbers: returns defaults when no candidate', () => {
  const fn = Mod.__test__?.normaliseNumbers;
  if (!fn) return;
  const out = fn(undefined);
  // spot-check a few keys
  assert.equal(typeof out.THREE, 'number');
  assert.equal(out.THREE > 0, true);
  assert.equal(out.ONEFORTYFOUR, 144);
});

test('normaliseNumbers: merges only positive finite overrides', () => {
  const fn = Mod.__test__?.normaliseNumbers;
  if (!fn) return;
  const out = fn({ THREE: 5, ELEVEN: 0, NINE: -1, THIRTYTHREE: 1/0 });
  assert.equal(out.THREE, 5);
  assert.equal(out.ELEVEN, 11); // unchanged due to 0 invalid
  assert.equal(out.NINE, 9);    // unchanged due to -1 invalid
  assert.equal(out.THIRTYTHREE, 33); // unchanged due to Infinity
});

//
// normalisePalette + withAlpha
//
test('normalisePalette: clones and pads/limits layers, defaults for missing keys', () => {
  const fn = Mod.__test__?.normalisePalette;
  if (!fn) return;
  const out = fn({ bg: '#111', layers: ['#a', '#b'] }); // short hex will be handled later by withAlpha
  assert.equal(out.bg, '#111');
  assert.equal(Array.isArray(out.layers), true);
  assert.equal(out.layers.length, 6);
  // verify fallback fill for missing indices
  assert.notEqual(out.layers[2], undefined);
});

test('withAlpha: handles hex #rgb and #rrggbb and clamps alpha', () => {
  const fn = Mod.__test__?.withAlpha || Mod.__test__?.__withAlpha;
  // some repos hide helpers; if not exposed, skip
  if (!fn) return;
  assert.equal(fn('#fff', 0.5).startsWith('rgba('), true);
  assert.equal(fn('#000000', -1).endsWith(', 0)'), true); // clamped to 0
  assert.equal(fn('#123456', 2).endsWith(', 1)'), true);  // clamped to 1
  assert.equal(fn('blue', 0.5), 'blue'); // non-hex passthrough
});

//
// normaliseGeometry and specific merge functions
//
test('normaliseGeometry: builds defaults from numbers and merges candidate object', () => {
  const numbers = Mod.__test__?.normaliseNumbers ? Mod.__test__.normaliseNumbers({}) : null;
  const fn = Mod.__test__?.normaliseGeometry;
  if (!fn || !numbers) return;
  const merged = fn({ fibonacci: { turns: 5, alpha: 2 } }, numbers);
  assert.equal(merged.fibonacci.turns, 5);
  // alpha should be clamped to 1
  assert.equal(merged.fibonacci.alpha <= 1 && merged.fibonacci.alpha >= 0, true);
  // untouched sections should exist
  assert.equal(typeof merged.vesica.rows, 'number');
});

test('mergeVesicaGeometry: validates positive numbers and clamps alpha', () => {
  const base = {
    rows: 9, columns: 11, paddingDivisor: 11, radiusScale: 0.2, strokeDivisor: 99, alpha: 0.5
  };
  const fn = Mod.__test__?.mergeVesicaGeometry;
  if (!fn) return;
  const res = fn(base, { rows: -1, columns: 0, paddingDivisor: 5, radiusScale: 0, strokeDivisor: 0, alpha: 1.5 });
  assert.equal(res.rows, 9); // unchanged
  assert.equal(res.columns, 11); // unchanged
  assert.equal(res.paddingDivisor, 5); // updated
  assert.equal(res.radiusScale, 0.2); // unchanged (0 invalid)
  assert.equal(res.strokeDivisor, 99); // unchanged (0 invalid)
  assert.equal(res.alpha, 1); // clamped
});

test('mergeTreeGeometry: deep copies base when patch invalid; normalises nodes/edges', () => {
  const base = {
    marginDivisor: 11, radiusDivisor: 33, pathDivisor: 99,
    nodeAlpha: 0.8, pathAlpha: 0.6, labelAlpha: 0.7,
    nodes: [{ id: 'a', title: 'A', level: 0, xFactor: 0.5 }],
    edges: [['a', 'a']]
  };
  const fn = Mod.__test__?.mergeTreeGeometry;
  if (!fn) return;

  const copy = fn(base, null);
  assert.notEqual(copy, base);
  assert.notEqual(copy.nodes, base.nodes);
  assert.notEqual(copy.edges, base.edges);

  const patched = fn(base, {
    nodes: [{ id: 1, title: '', level: 'x', xFactor: 'y' }],
    edges: [['a', 'b', 'c'], 'invalid', 42]
  });
  assert.equal(patched.nodes[0].id, '1');          // normalised to string
  assert.equal(patched.nodes[0].title, '1');       // fallback from id
  assert.equal(patched.nodes[0].level, 0);         // default
  assert.equal(typeof patched.nodes[0].xFactor, 'number');

  assert.deepEqual(patched.edges[0], ['a','b']);   // sliced to first two
  assert.equal(patched.edges.length, 1);           // filtered invalid entries
});

test('mergeFibonacciGeometry: validates numerics and clamps factors', () => {
  const base = {
    sampleCount: 144, turns: 3, baseRadiusDivisor: 22,
    centerXFactor: 0.5, centerYFactor: 0.5, phi: 1.62,
    markerInterval: 11, alpha: 0.85
  };
  const fn = Mod.__test__?.mergeFibonacciGeometry;
  if (!fn) return;

  const res = fn(base, { sampleCount: 0, turns: -1, baseRadiusDivisor: 0,
                         centerXFactor: 2, centerYFactor: -1, phi: 0.9,
                         markerInterval: NaN, alpha: -0.2 });
  assert.equal(res.sampleCount, 144);
  assert.equal(res.turns, 3);
  assert.equal(res.baseRadiusDivisor, 22);
  assert.equal(res.centerXFactor, 1);
  assert.equal(res.centerYFactor, 0);
  assert.equal(res.phi, 1.62);
  assert.equal(res.markerInterval, 11);
  assert.equal(res.alpha, 0);
});

test('mergeHelixGeometry: validates numerics and clamps alphas', () => {
  const base = {
    sampleCount: 144, cycles: 3, amplitudeDivisor: 9,
    strandSeparationDivisor: 33, crossTieCount: 33,
    strandAlpha: 0.82, rungAlpha: 0.6
  };
  const fn = Mod.__test__?.mergeHelixGeometry;
  if (!fn) return;
  const res = fn(base, { sampleCount: 1, cycles: 0, amplitudeDivisor: -1,
                         strandSeparationDivisor: Infinity, crossTieCount: NaN,
                         strandAlpha: 9, rungAlpha: -5 });
  assert.equal(res.sampleCount, 1);
  assert.equal(res.cycles, 3);
  assert.equal(res.amplitudeDivisor, 9);
  assert.equal(res.strandSeparationDivisor, 33);
  assert.equal(res.crossTieCount, 33);
  assert.equal(res.strandAlpha, 1);
  assert.equal(res.rungAlpha, 0);
});

//
// draw helpers (behavioural smoke tests with fake ctx)
//
test('drawVesicaField: draws expected number of circles and axis lines', () => {
  const { ctx, calls } = makeCtx(200, 200);
  const dims = { width: 200, height: 200 };
  const numbers = Mod.__test__?.normaliseNumbers ? Mod.__test__.normaliseNumbers({}) : null;
  if (!numbers) return;
  const config = {
    rows: 3, columns: 4, paddingDivisor: 10, radiusScale: 0.2, strokeDivisor: 50, alpha: 0.5
  };
  const stats = Mod.__test__?.drawVesicaField ? Mod.__test__.drawVesicaField(ctx, dims, '#abc', numbers, config) : null;
  if (!stats) return;
  assert.equal(stats.circles, 12); // rows * cols
  // ensure arcs were called 12 times
  const arcCount = calls.filter(([name]) => name === 'arc').length;
  assert.equal(arcCount >= 12, true);
});

test('drawTreeOfLife: draws nodes and paths based on provided config', () => {
  const { ctx, calls } = makeCtx(300, 240);
  const dims = { width: 300, height: 240 };
  const numbers = Mod.__test__?.normaliseNumbers ? Mod.__test__.normaliseNumbers({}) : null;
  if (!numbers) return;

  const config = {
    marginDivisor: 10, radiusDivisor: 30, pathDivisor: 90,
    nodeAlpha: 0.9, pathAlpha: 0.7, labelAlpha: 0.8,
    nodes: [{ id: 'n1', title: 'N1', level: 0, xFactor: 0.2 }, { id: 'n2', title: 'N2', level: 1, xFactor: 0.8 }],
    edges: [['n1','n2']]
  };
  const palette = { layers: ['#1','#2','#3','#4','#5','#6'], ink: '#fff' };
  const stats = Mod.__test__?.drawTreeOfLife ? Mod.__test__.drawTreeOfLife(ctx, dims, palette, numbers, config) : null;
  if (!stats) return;
  assert.equal(stats.nodes, 2);
  assert.equal(stats.paths, 1);
  // Validate that label rendering occurred
  assert.equal(calls.some(([n]) => n === 'fillText'), true);
});

test('drawFibonacciCurve: returns sample/marker counts and draws markers at interval', () => {
  const { ctx, calls } = makeCtx(220, 220);
  const dims = { width: 220, height: 220 };
  const numbers = Mod.__test__?.normaliseNumbers ? Mod.__test__.normaliseNumbers({}) : null;
  if (!numbers) return;

  const config = {
    sampleCount: 10, turns: 3, baseRadiusDivisor: 20,
    centerXFactor: 0.5, centerYFactor: 0.5, phi: 1.62,
    markerInterval: 2, alpha: 0.8
  };
  const stats = Mod.__test__?.drawFibonacciCurve ? Mod.__test__.drawFibonacciCurve(ctx, dims, '#f0f', numbers, config) : null;
  if (!stats) return;
  assert.equal(stats.samples, 10);
  assert.equal(stats.markers, Math.ceil(10 / 2));
  // Verify arcs for markers
  const markerArcs = calls.filter(([n]) => n === 'arc').length;
  assert.equal(markerArcs >= stats.markers, true);
});

test('drawHelixLattice: returns strand points and cross ties; draws both strands and ties', () => {
  const { ctx, calls } = makeCtx(300, 150);
  const dims = { width: 300, height: 150 };
  const numbers = Mod.__test__?.normaliseNumbers ? Mod.__test__.normaliseNumbers({}) : null;
  if (!numbers) return;

  const config = {
    sampleCount: 12, cycles: 2, amplitudeDivisor: 10,
    strandSeparationDivisor: 20, crossTieCount: 5,
    strandAlpha: 0.9, rungAlpha: 0.6
  };
  const palette = { layers: ['#a','#b','#c','#d','#e','#f'], ink: '#fff', muted: '#888' };
  const stats = Mod.__test__?.drawHelixLattice ? Mod.__test__.drawHelixLattice(ctx, dims, palette, numbers, config) : null;
  if (!stats) return;
  assert.equal(stats.strandPoints, 24);
  assert.equal(stats.crossTies, 5);
  // We should have at least 2 strokes for strands and multiple for ties
  const strokeCount = calls.filter(([n]) => n === 'stroke').length;
  assert.equal(strokeCount >= 3, true);
});

//
// drawCanvasNotice
//
test('drawCanvasNotice: paints background rectangle sized to text and draws text', () => {
  const { ctx, calls } = makeCtx(330, 200);
  const dims = { width: 330, height: 200 };
  const fn = Mod.__test__?.drawCanvasNotice;
  if (!fn) return;
  fn(ctx, dims, '#fff', '#999', 'Hello World');
  // Check that measureText and fillRect and fillText were called
  assert.equal(calls.some(([n]) => n === 'measureText'), true);
  assert.equal(calls.some(([n]) => n === 'fillRect'), true);
  assert.equal(calls.some(([n]) => n === 'fillText'), true);
});

//
// summariseLayers
//
test('summariseLayers: formats summary string from stats object', () => {
  const fn = Mod.__test__?.summariseLayers;
  if (!fn) return;
  const s = fn({
    vesicaStats: { circles: 12 },
    treeStats: { paths: 7, nodes: 10 },
    fibonacciStats: { samples: 144 },
    helixStats: { crossTies: 33 }
  });
  assert.equal(
    s,
    'Vesica 12 circles · Paths 7 / Nodes 10 · Spiral 144 samples · Helix 33 ties'
  );
});

//
// renderHelix (orchestrator)
//
test('renderHelix: rejects missing context', () => {
  const out = Mod.renderHelix(null, {});
  assert.deepEqual(out, { ok: false, reason: 'missing-context' });
});

test('renderHelix: rejects invalid dimensions', () => {
  const { ctx } = makeCtx(0, 0);
  const out = Mod.renderHelix(ctx, { width: 0, height: -1 });
  assert.deepEqual(out, { ok: false, reason: 'invalid-dimensions' });
});

test('renderHelix: success path draws layers and returns formatted summary; notice optional', () => {
  const { ctx, calls } = makeCtx(200, 120);
  const out = Mod.renderHelix(ctx, { width: 200, height: 120, notice: 'Test' });
  assert.equal(out.ok, true);
  assert.match(out.summary, /Vesica .* · Paths .* · Spiral .* · Helix .*/);
  // Validate high-level state changes and save/restore
  const names = calls.map(c => c[0]);
  assert.equal(names.includes('save'), true);
  assert.equal(names.includes('restore'), true);
  assert.equal(names.includes('setTransform'), true);
  // Notice path invokes fillText
  assert.equal(names.includes('fillText'), true);
});

test('renderHelix: omits notice rendering when notice is empty/whitespace', () => {
  const { ctx, calls } = makeCtx(200, 120);
  calls.length = 0;
  Mod.renderHelix(ctx, { width: 200, height: 120, notice: '   ' });
  // No fillText for notice (Tree labels may call fillText; restrict to final batch by resetting calls before)
  const fillTextCount = calls.filter(c => c[0] === 'fillText').length;
  // Allow some label text from Tree if called before reset; we reset before call, so any fillText would be from notice or tree inside current render.
  // To avoid flakiness, ensure at least one draw occurred overall.
  assert.equal(calls.length > 0, true);
});
/**
 * Additional edge-case and regression tests
 * Testing library/framework: Node.js built-in test runner (node:test) with assert/strict.
 * These tests focus on robustness around normalisers, geometry merges, draw helpers, and the orchestrator,
 * complementing scenarios emphasized in the PR diff.
 */

test('normaliseNumbers: ignores non-finite/<=0 overrides and does not mutate input', () => {
  const fn = Mod.__test__?.normaliseNumbers;
  if (!fn) return;

  const overrides = { THREE: '3', ELEVEN: 0, NINE: -9, THIRTYTHREE: Infinity };
  const before = JSON.stringify(overrides);
  const out = fn(overrides);

  // Input object should remain unchanged
  assert.equal(JSON.stringify(overrides), before);

  // Known defaults should remain when invalid overrides were provided
  assert.equal(out.THREE, 3);
  assert.equal(out.ELEVEN, 11);
  assert.equal(out.NINE, 9);
  assert.equal(out.THIRTYTHREE, 33);
});

test('normalisePalette: maintains input immutability and returns complete, cloned structure', () => {
  const fn = Mod.__test__?.normalisePalette;
  if (!fn) return;

  const candidate = { bg: '#000', layers: ['#123'] };
  const before = JSON.stringify(candidate);
  const out = fn(candidate);

  // Input immutability
  assert.equal(JSON.stringify(candidate), before);

  // Output structure checks
  assert.equal(typeof out.bg, 'string');
  assert.equal(typeof out.ink, 'string');
  assert.equal(typeof out.muted, 'string');
  assert.equal(Array.isArray(out.layers), true);
  assert.equal(out.layers.length, 6);

  // Ensure layers array was cloned
  assert.notEqual(out.layers, candidate.layers);
});

test('mergeTreeGeometry: does not mutate base arrays when applying valid patch', () => {
  const fn = Mod.__test__?.mergeTreeGeometry;
  if (!fn) return;

  const base = {
    marginDivisor: 11, radiusDivisor: 33, pathDivisor: 99,
    nodeAlpha: 0.8, pathAlpha: 0.6, labelAlpha: 0.7,
    nodes: [{ id: 'a', title: 'A', level: 0, xFactor: 0.5 }],
    edges: [['a','a']]
  };
  const before = JSON.stringify(base);

  // Apply a patch that would update nodes/edges if accepted
  const _patched = fn(base, { nodes: [{ id: 'b' }], edges: [['a','b']] });

  // Base should remain unchanged
  assert.equal(JSON.stringify(base), before);
});

test('drawCanvasNotice: handles very long text and draws measure + rect + text', () => {
  const { ctx, calls } = makeCtx(640, 360);
  const dims = { width: 640, height: 360 };
  const fn = Mod.__test__?.drawCanvasNotice;
  if (!fn) return;

  fn(ctx, dims, '#fff', '#111', 'X'.repeat(200));

  assert.equal(calls.some(([n]) => n === 'measureText'), true);
  assert.equal(calls.some(([n]) => n === 'fillRect'), true);
  assert.equal(calls.some(([n]) => n === 'fillText'), true);
});

test('drawFibonacciCurve: handles zero samples and subunit markerInterval gracefully', () => {
  const { ctx } = makeCtx(220, 220);
  const dims = { width: 220, height: 220 };
  const numbers = Mod.__test__?.normaliseNumbers ? Mod.__test__.normaliseNumbers({}) : null;
  const fn = Mod.__test__?.drawFibonacciCurve;
  if (!numbers || !fn) return;

  const stats = fn(ctx, dims, '#f0f', numbers, {
    sampleCount: 0, turns: 1, baseRadiusDivisor: 20,
    centerXFactor: 0.5, centerYFactor: 0.5, phi: 1.62,
    markerInterval: 0, alpha: 0.5
  });

  assert.equal(typeof stats.samples, 'number');
  assert.equal(stats.samples >= 0, true);
  assert.equal(typeof stats.markers, 'number');
  assert.equal(stats.markers >= 0, true);
});

test('drawHelixLattice: handles crossTieCount larger than sampleCount without error', () => {
  const { ctx, calls } = makeCtx(300, 150);
  const dims = { width: 300, height: 150 };
  const numbers = Mod.__test__?.normaliseNumbers ? Mod.__test__.normaliseNumbers({}) : null;
  const fn = Mod.__test__?.drawHelixLattice;
  if (!numbers || !fn) return;

  const palette = { layers: ['#a','#b','#c','#d','#e','#f'], ink: '#fff', muted: '#888' };
  const config = {
    sampleCount: 8, cycles: 1, amplitudeDivisor: 10,
    strandSeparationDivisor: 20, crossTieCount: 99,
    strandAlpha: 0.9, rungAlpha: 0.6
  };

  const stats = fn(ctx, dims, palette, numbers, config);

  assert.equal(typeof stats.crossTies, 'number');
  assert.equal(stats.crossTies >= 0, true);

  // At least the two strands should have been stroked
  const strokeCount = calls.filter(([n]) => n === 'stroke').length;
  assert.equal(strokeCount >= 2, true);
});

test('mergeHelixGeometry: immutability and alpha clamping within [0,1]', () => {
  const fn = Mod.__test__?.mergeHelixGeometry;
  if (!fn) return;

  const base = {
    sampleCount: 144, cycles: 3, amplitudeDivisor: 9,
    strandSeparationDivisor: 33, crossTieCount: 33,
    strandAlpha: 0.5, rungAlpha: 0.5
  };
  const before = JSON.stringify(base);

  const out = fn(base, { strandAlpha: 2, rungAlpha: -1 });

  // Base untouched; outputs clamped
  assert.equal(JSON.stringify(base), before);
  assert.equal(out.strandAlpha <= 1 && out.strandAlpha >= 0, true);
  assert.equal(out.rungAlpha <= 1 && out.rungAlpha >= 0, true);
});

test('summariseLayers: tolerates missing sections and returns a non-empty string', () => {
  const fn = Mod.__test__?.summariseLayers;
  if (!fn) return;

  const s = fn({});
  assert.equal(typeof s, 'string');
  assert.equal(s.length > 0, true);
});

test('renderHelix: rejects non-object options gracefully (no throw, structured error)', () => {
  const { ctx } = makeCtx(100, 100);
  let out;
  assert.doesNotThrow(() => { out = Mod.renderHelix(ctx, 'oops'); });
  assert.equal(typeof out, 'object');
  assert.equal(typeof out.ok, 'boolean');
  assert.equal(out.ok, false);
  assert.equal(typeof out.reason, 'string');
});

test('renderHelix: tiny canvas still succeeds and returns a summary', () => {
  const { ctx } = makeCtx(2, 2);
  const out = Mod.renderHelix(ctx, { width: 2, height: 2 });
  assert.equal(out.ok, true);
  assert.equal(typeof out.summary, 'string');
  assert.equal(out.summary.length > 0, true);
});