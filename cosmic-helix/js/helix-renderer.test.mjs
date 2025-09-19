import test from 'node:test';
import assert from 'node:assert/strict';

let mod;
/**
 * Dynamically import the module under test. Prefer nearby helix-renderer.mjs if present,
 * otherwise fall back to index.mjs exporting renderHelix.
 */
async function loadModule() {
  if (mod) return mod;
  const candidates = [
    '../js/helix-renderer.mjs',
    './helix-renderer.mjs',
    '../helix-renderer.mjs',
    '../js/index.mjs',
    '../index.mjs',
    '../../js/helix-renderer.mjs',
    '../../helix-renderer.mjs',
  ];
  for (const rel of candidates) {
    try {
      mod = await import(new URL(rel, import.meta.url));
      if (typeof mod.renderHelix === 'function') return mod;
    } catch (_) { /* try next */ }
  }
  throw new Error('Could not locate module exporting renderHelix for tests');
}

function createMockCtx({ width = 800, height = 600 } = {}) {
  const calls = [];
  const ctx = {
    canvas: { width, height },
    // stateful properties captured when set
    set fillStyle(v) { calls.push(['prop','fillStyle', v]); },
    set strokeStyle(v) { calls.push(['prop','strokeStyle', v]); },
    set lineWidth(v) { calls.push(['prop','lineWidth', v]); },
    set lineCap(v) { calls.push(['prop','lineCap', v]); },
    set lineJoin(v) { calls.push(['prop','lineJoin', v]); },
    set font(v) { calls.push(['prop','font', v]); },
    set textAlign(v) { calls.push(['prop','textAlign', v]); },
    set textBaseline(v) { calls.push(['prop','textBaseline', v]); },

    // drawing ops
    save: () => calls.push(['save']),
    restore: () => calls.push(['restore']),
    beginPath: () => calls.push(['beginPath']),
    moveTo: (x, y) => calls.push(['moveTo', x, y]),
    lineTo: (x, y) => calls.push(['lineTo', x, y]),
    arc: (x, y, r, s, e) => calls.push(['arc', x, y, r, s, e]),
    stroke: () => calls.push(['stroke']),
    fill: () => calls.push(['fill']),
    fillRect: (x, y, w, h) => calls.push(['fillRect', x, y, w, h]),
    fillText: (txt, x, y) => calls.push(['fillText', txt, x, y]),
    get _calls() { return calls; },
  };
  return ctx;
}

test('renderHelix returns missing-context when ctx is falsy', async () => {
  const { renderHelix } = await loadModule();
  assert.deepEqual(renderHelix(null), { ok: false, reason: 'missing-context' });
  assert.deepEqual(renderHelix(undefined), { ok: false, reason: 'missing-context' });
  // ctx without canvas should be treated as missing
  // eslint-disable-next-line no-new-object
  assert.deepEqual(renderHelix({}), { ok: false, reason: 'missing-context' });
});

test('renderHelix draws background and returns ok summary with defaults', async () => {
  const { renderHelix } = await loadModule();
  const ctx = createMockCtx({ width: 990, height: 660 });
  const result = renderHelix(ctx, {});
  assert.equal(result.ok, true);
  assert.match(result.summary, /^Layers rendered - \d+ vesica circles; \d+ paths \/ \d+ nodes; \d+ spiral points; \d+ helix rungs\.$/);

  // Verify the stage was cleared to background via fillRect
  const fills = ctx._calls.filter(c => c[0] === 'fillRect');
  assert.ok(fills.length >= 1, 'expected at least one fillRect to clear stage');

  // Basic sanity: balanced save/restore
  const saves = ctx._calls.filter(c => c[0] === 'save').length;
  const restores = ctx._calls.filter(c => c[0] === 'restore').length;
  assert.ok(saves >= 1 && restores >= 1, 'should save/restore context at least once');
});

test('renderHelix applies custom palette, numbers, and geometry overrides', async () => {
  const { renderHelix } = await loadModule();
  const ctx = createMockCtx();
  const options = {
    palette: {
      bg: '#010203',
      ink: '#aabbcc',
      muted: '#112233',
      layers: ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777'],
    },
    NUM: { THIRTYTHREE: 66, ONEFORTYFOUR: 288, ELEVEN: 11, TWENTYTWO: 44, NINETYNINE: 198 },
    geometry: {
      vesica: { rows: 2, columns: 3, radiusFactor: 2, paddingDivisor: 10, strokeDivisor: 80, alpha: 0.5 },
      treeOfLife: { marginDivisor: 10, radiusDivisor: 20, labelOffset: -12, labelFont: '10px monospace' },
      fibonacci: { sampleCount: 12, turns: 2, baseRadiusDivisor: 4, phi: 1.7, alpha: 0.4 },
      helix: { sampleCount: 20, cycles: 2, amplitudeDivisor: 4, phaseOffset: 90, crossTieCount: 5, strandAlpha: 0.7, rungAlpha: 0.3 },
    },
    notice: 'Hello Helix',
  };
  const out = renderHelix(ctx, options);
  assert.equal(out.ok, true);
  assert.match(out.summary, /12 spiral points/);
  assert.match(out.summary, /5 helix rungs/);

  // Notice text should be drawn
  const noticeCalls = ctx._calls.filter(c => c[0] === 'fillText' && c[1] === 'Hello Helix');
  assert.ok(noticeCalls.length === 1, 'notice text should be rendered exactly once');
});

test('helpers: colorWithAlpha clamps/validates hex and alpha', async () => {
  const m = await loadModule();
  assert.equal(m.colorWithAlpha('#ff00aa', 0.5), 'rgba(255,0,170,0.5)');
  assert.equal(m.colorWithAlpha('ff00aa', 2), 'rgba(255,0,170,1)');
  assert.equal(m.colorWithAlpha('ff00aa', -1), 'rgba(255,0,170,0)');
  assert.equal(m.colorWithAlpha('xyz', 0.3), 'rgba(255,255,255,0.3)');
});

test('helpers: clamp01 and clampAlpha behavior', async () => {
  const m = await loadModule();
  assert.equal(m.clamp01(-5), 0);
  assert.equal(m.clamp01(0), 0);
  assert.equal(m.clamp01(0.4), 0.4);
  assert.equal(m.clamp01(2), 1);

  assert.equal(m.clampAlpha(0, 0.9), 0); // preserves zero
  assert.equal(m.clampAlpha(0.25, 0.9), 0.25);
  assert.equal(m.clampAlpha('not-a-number', 0.9), 0.9);
});

test('helpers: toPositiveNumber and toPositiveInteger coercions', async () => {
  const m = await loadModule();
  assert.equal(m.toPositiveNumber('42', 7), 42);
  assert.equal(m.toPositiveNumber(-1, 9), 9);
  assert.equal(m.toPositiveNumber('abc', 5), 5);

  assert.equal(m.toPositiveInteger(7.6, 3), 8);
  assert.equal(m.toPositiveInteger('0', 12), 12);
  assert.equal(m.toPositiveInteger(NaN, 4), 4);
});

test('mergePalette and mergeNumbers apply defaults and ignore invalid values', async () => {
  const m = await loadModule();
  const palette = m.mergePalette({ bg: '#000000', layers: ['#111111'] });
  assert.equal(palette.bg, '#000000');
  assert.equal(palette.layers.length, 6, 'layers should be cloned to default length');
  assert.equal(palette.layers[0], '#111111');

  const nums = m.mergeNumbers({ THREE: 0, SEVEN: 8, ELEVEN: Infinity });
  assert.equal(nums.SEVEN, 8);
  assert.equal(nums.THREE, 3, 'invalid (<=0) should preserve default');
  assert.equal(nums.ELEVEN, 11, 'non-finite ignored; default preserved');
});

test('mergeVesica, mergeFibonacci, mergeHelix sanitize numeric fields', async () => {
  const m = await loadModule();

  const ves = m.mergeVesica({ rows: '5.2', columns: 0, alpha: 2, radiusFactor: -1, paddingDivisor: 'x', strokeDivisor: 10 });
  assert.equal(ves.rows, 5);
  assert.ok(ves.columns > 0);
  assert.equal(ves.alpha, 1); // clamped
  assert.ok(ves.radiusFactor > 0);
  assert.ok(ves.paddingDivisor > 0);
  assert.equal(ves.strokeDivisor, 10);

  const fib = m.mergeFibonacci({ sampleCount: 1, turns: -2, baseRadiusDivisor: 0, phi: 0.5, alpha: -1 });
  assert.equal(fib.sampleCount, 2, 'min samples is 2 after sanitize');
  assert.ok(fib.turns > 0);
  assert.ok(fib.baseRadiusDivisor > 0);
  assert.equal(fib.phi, fib.phi > 1 ? fib.phi : 1.618033988749895);
  assert.equal(fib.alpha, 0);

  const helix = m.mergeHelix({ sampleCount: '3.2', cycles: 0, amplitudeDivisor: -1, phaseOffset: 'not-number', crossTieCount: 0, strandAlpha: 2, rungAlpha: -1 });
  assert.equal(helix.sampleCount, 3);
  assert.ok(helix.cycles > 0);
  assert.ok(helix.amplitudeDivisor > 0);
  assert.equal(helix.crossTieCount, 1); // coerced to positive integer
  assert.equal(helix.strandAlpha, 1);
  assert.equal(helix.rungAlpha, 0);
});

test('mergeTree sanitizes nodes and filters invalid edges', async () => {
  const m = await loadModule();
  const cfg = {
    nodes: [
      { id: '', title: '', level: '2', xFactor: 1.5 }, // will fallback id/title; clamp xFactor
      { id: 'custom', title: 'Custom', level: 3, xFactor: -0.2 }, // clamp xFactor
    ],
    edges: [['custom', 'missing'], ['custom', 'custom']],
    marginDivisor: 'x',
    radiusDivisor: 0,
    labelOffset: '7',
    labelFont: '',
  };
  const mt = m.mergeTree(cfg);
  assert.ok(mt.nodes.length >= 2);
  const custom = mt.nodes.find(n => n.id === 'custom');
  assert.ok(custom, 'custom node should exist');
  assert.equal(custom.xFactor, 0, 'xFactor clamped to [0,1]');
  assert.equal(mt.edges.length, 1, 'invalid edge referencing missing node filtered');
  assert.equal(mt.labelFont, m.DEFAULT_GEOMETRY.treeOfLife.labelFont);
  assert.ok(mt.marginDivisor > 0 && mt.radiusDivisor > 0);
  assert.equal(mt.labelOffset, 7);
});

test('drawFibonacciCurve honors sampleCount and produces expected stroke calls', async () => {
  const m = await loadModule();
  const ctx = createMockCtx();
  const dims = { width: 600, height: 400 };
  const out = m.drawFibonacciCurve(ctx, dims, '#ff0000', m.DEFAULT_NUMBERS, { sampleCount: 4, turns: 1, baseRadiusDivisor: 3, phi: 1.6, alpha: 0.5 });
  assert.equal(out.points, 4);
  // One beginPath + one stroke expected for the polyline
  const beginCount = ctx._calls.filter(c => c[0] === 'beginPath').length;
  const strokeCount = ctx._calls.filter(c => c[0] === 'stroke').length;
  assert.ok(beginCount >= 1 && strokeCount >= 1);
});

test('drawHelixLattice clamps rung count and draws polylines and rungs', async () => {
  const m = await loadModule();
  const ctx = createMockCtx({ width: 330, height: 330 });
  const dims = { width: 330, height: 330 };
  const settings = { sampleCount: 10, cycles: 1, amplitudeDivisor: 3, phaseOffset: 180, crossTieCount: 0, strandAlpha: 0.8, rungAlpha: 0.6 };
  const out = m.drawHelixLattice(ctx, dims, m.DEFAULT_PALETTE, m.DEFAULT_NUMBERS, settings);
  assert.equal(out.rungs >= 1, true, 'at least one rung should be drawn when crossTieCount <= 0');
  // Expect multiple strokes: two polylines + several rungs
  const strokeCount = ctx._calls.filter(c => c[0] === 'stroke').length;
  assert.ok(strokeCount >= 3);
});

test('drawTreeOfLife renders edges, nodes, and optional labels', async () => {
  const m = await loadModule();
  const ctx = createMockCtx({ width: 440, height: 440 });
  const dims = { width: 440, height: 440 };
  const settings = {
    ...m.DEFAULT_GEOMETRY.treeOfLife,
    labelOffset: -16,
    labelFont: '12px system-ui',
  };
  const out = m.drawTreeOfLife(ctx, dims, m.DEFAULT_PALETTE, m.DEFAULT_NUMBERS, settings);
  assert.ok(out.nodes > 0 && out.paths > 0);
  const textCalls = ctx._calls.filter(c => c[0] === 'fillText');
  assert.ok(textCalls.length > 0, 'labels should be drawn when labelOffset \\!= 0 and labelFont provided');

  // If labels disabled, no fillText calls
  const ctx2 = createMockCtx({ width: 440, height: 440 });
  const out2 = m.drawTreeOfLife(ctx2, dims, m.DEFAULT_PALETTE, m.DEFAULT_NUMBERS, { ...settings, labelOffset: 0 });
  assert.ok(out2.nodes > 0);
  const textCalls2 = ctx2._calls.filter(c => c[0] === 'fillText');
  assert.equal(textCalls2.length, 0);
});

test('drawVesicaField computes circle count and radius and invokes arc strokes', async () => {
  const m = await loadModule();
  const ctx = createMockCtx({ width: 220, height: 220 });
  const dims = { width: 220, height: 220 };
  const settings = { rows: 2, columns: 3, paddingDivisor: 11, radiusFactor: 2, strokeDivisor: 99, alpha: 0.6 };
  const out = m.drawVesicaField(ctx, dims, '#00ff00', m.DEFAULT_NUMBERS, settings);
  assert.equal(out.circles, 2 * 2 * 3);
  const arcCalls = ctx._calls.filter(c => c[0] === 'arc');
  assert.equal(arcCalls.length, out.circles);
  assert.ok(out.radius > 0);
});

test('drawCanvasNotice renders bottom-centered message with responsive font', async () => {
  const m = await loadModule();
  const ctx = createMockCtx({ width: 330, height: 200 });
  const dims = { width: 330, height: 200 };
  m.drawCanvasNotice(ctx, dims, '#ffffff', 'Notice');
  const fillText = ctx._calls.find(c => c[0] === 'fillText');
  assert.ok(fillText, 'fillText should be called once');
  assert.equal(fillText[1], 'Notice');
});