// Tests for helix-renderer.mjs
// Framework: Node.js built-in test runner (node:test) + node:assert/strict
// If your project uses Jest/Vitest/Mocha, adapt imports (describe/it) accordingly.

import test from 'node:test';
import assert from 'node:assert/strict';

// Try common relative locations for the module; adjust if needed.
let mod;
const candidatePaths = [
  '../src/helix-renderer.mjs',
  '../helix-renderer.mjs',
  '../../src/helix-renderer.mjs',
  '../../helix-renderer.mjs',
];
let lastErr;
for (const p of candidatePaths) {
  try {
    // eslint-disable-next-line no-await-in-loop
    mod = await import(new URL(p, import.meta.url));
    break;
  } catch (e) {
    lastErr = e;
  }
}
if (!mod) {
  throw new Error(`Failed to import helix-renderer.mjs from candidates: ${candidatePaths.join(', ')}. Last error: ${lastErr && lastErr.message}`);
}

const {
  renderHelix,
  // helpers
  colorWithAlpha,
  toPositiveNumber,
  toPositiveInteger,
  clamp01,
  clampAlpha,
} = mod;

// Minimal mock for CanvasRenderingContext2D
class Mock2D {
  constructor(width = 800, height = 600) {
    this.canvas = { width, height };
    this.ops = [];
    // drawing state
    this.fillStyle = '';
    this.strokeStyle = '';
    this.lineWidth = 0;
    this.lineCap = '';
    this.lineJoin = '';
    this.font = '';
    this.textAlign = '';
    this.textBaseline = '';
  }
  // state ops
  save() { this.ops.push(['save']); }
  restore() { this.ops.push(['restore']); }
  // rect
  fillRect(x, y, w, h) { this.ops.push(['fillRect', x, y, w, h]); }
  // paths
  beginPath() { this.ops.push(['beginPath']); }
  moveTo(x, y) { this.ops.push(['moveTo', x, y]); }
  lineTo(x, y) { this.ops.push(['lineTo', x, y]); }
  stroke() { this.ops.push(['stroke']); }
  fill() { this.ops.push(['fill']); }
  arc(x, y, r, sa, ea) { this.ops.push(['arc', x, y, r, sa, ea]); }
  // text
  fillText(txt, x, y) { this.ops.push(['fillText', txt, x, y]); }
}

function countOps(ctx, name) {
  return ctx.ops.filter(op => op[0] === name).length;
}

// ---------- Pure helpers ----------

test('clamp01 clamps to [0,1] and handles non-finite', () => {
  assert.equal(clamp01(-5), 0);
  assert.equal(clamp01(0), 0);
  assert.equal(clamp01(0.25), 0.25);
  assert.equal(clamp01(1), 1);
  assert.equal(clamp01(5), 1);
  assert.equal(clamp01(NaN), 0);
  assert.equal(clamp01(Infinity), 0);
});

test('toPositiveNumber returns positive finite else fallback', () => {
  assert.equal(toPositiveNumber(10, 2), 10);
  assert.equal(toPositiveNumber('5', 2), 5);
  assert.equal(toPositiveNumber(0, 2), 2);
  assert.equal(toPositiveNumber(-3, 2), 2);
  assert.equal(toPositiveNumber('foo', 7), 7);
});

test('toPositiveInteger returns rounded positive integer else fallback', () => {
  assert.equal(toPositiveInteger(10.4, 2), 10);
  assert.equal(toPositiveInteger('6.6', 2), 7);
  assert.equal(toPositiveInteger(0, 2), 2);
  assert.equal(toPositiveInteger(-1, 2), 2);
  assert.equal(toPositiveInteger('bar', 9), 9);
});

test('clampAlpha respects explicit 0, otherwise clamps or falls back', () => {
  assert.equal(clampAlpha(0, 0.5), 0);
  assert.equal(clampAlpha(1.2, 0.5), 1);
  assert.equal(clampAlpha(-0.2, 0.5), 0);
  assert.equal(clampAlpha(0.4, 0.5), 0.4);
  assert.equal(clampAlpha('nope', 0.5), 0.5);
});

test('colorWithAlpha parses #RRGGBB else returns white rgba', () => {
  assert.equal(colorWithAlpha('#ff0000', 0.5), 'rgba(255,0,0,0.5)');
  assert.equal(colorWithAlpha('00ff00', 1), 'rgba(0,255,0,1)');
  assert.equal(colorWithAlpha('#abc', 0.3), 'rgba(255,255,255,0.3)'); // invalid short form → white
  assert.equal(colorWithAlpha('', 0.7), 'rgba(255,255,255,0.7)');
});

// ---------- renderHelix integration with mock context ----------

test('renderHelix returns ok=false with missing context', () => {
  assert.deepEqual(renderHelix(null), { ok: false, reason: 'missing-context' });
  assert.deepEqual(renderHelix({}), { ok: false, reason: 'missing-context' });
});

test('renderHelix basic happy path draws layers and returns summary', () => {
  const ctx = new Mock2D(900, 600);
  const result = renderHelix(ctx, { notice: 'Hello' });

  assert.equal(result.ok, true);
  assert.match(result.summary, /Layers rendered - .*vesica circles; .*paths .*nodes; .*spiral points; .*helix rungs\./);

  // stage cleared
  assert.equal(countOps(ctx, 'fillRect') >= 1, true, 'should clear stage with fillRect');

  // vesica draws arcs in pairs across grid (multiple beginPath + arc + stroke)
  assert.equal(countOps(ctx, 'arc') > 0, true, 'should draw arcs');

  // helix draws polylines and rungs (multiple moveTo/lineTo/stroke)
  assert.equal(countOps(ctx, 'moveTo') > 0, true, 'should moveTo for polylines');
  assert.equal(countOps(ctx, 'lineTo') > 0, true, 'should lineTo for polylines and rungs');

  // notice text drawn
  const textOps = ctx.ops.filter(op => op[0] === 'fillText');
  assert.equal(textOps.length >= 1, true, 'should draw notice text');
  assert.equal(textOps[textOps.length - 1][1], 'Hello');
});

test('renderHelix honors provided width/height overrides', () => {
  const ctx = new Mock2D(800, 600);
  const result = renderHelix(ctx, { width: 1000, height: 700 });
  assert.equal(result.ok, true);

  // Validate via operations depending on dimensions:
  // Background fillRect should use provided width/height
  const rects = ctx.ops.filter(op => op[0] === 'fillRect');
  assert.notEqual(rects.length, 0);
  const lastRect = rects[rects.length - 1];
  assert.equal(lastRect[3], 1000); // w
  assert.equal(lastRect[4], 700);  // h
});

test('renderHelix handles extreme geometry inputs gracefully', () => {
  const ctx = new Mock2D(500, 500);
  const options = {
    geometry: {
      vesica: { rows: 1, columns: 1, paddingDivisor: 1e9, radiusFactor: 1e9, strokeDivisor: 1e9, alpha: 2 },
      treeOfLife: { marginDivisor: 1e9, radiusDivisor: 1e9, labelOffset: 0, labelFont: '12px sans-serif', nodes: [], edges: [] },
      fibonacci: { sampleCount: 2, turns: 0, baseRadiusDivisor: 1e9, phi: 1, alpha: -1 },
      helix: { sampleCount: 2, cycles: 0, amplitudeDivisor: 1e9, phaseOffset: 3600, crossTieCount: 0, strandAlpha: -1, rungAlpha: 2 },
    },
  };
  const res = renderHelix(ctx, options);
  assert.equal(res.ok, true);
  // Should not throw; minimal operations still present
  assert.ok(countOps(ctx, 'stroke') >= 1 || countOps(ctx, 'fill') >= 1);
});

test('renderHelix with empty/whitespace notice does not draw text', () => {
  const ctx = new Mock2D(800, 600);
  renderHelix(ctx, { notice: '   ' });
  assert.equal(countOps(ctx, 'fillText'), 0);
});

// ---------- Edge cases specific to helpers used by render ----------

test('colorWithAlpha clamps alpha via clamp01', () => {
  assert.equal(colorWithAlpha('#0000ff', -10), 'rgba(0,0,255,0)');
  assert.equal(colorWithAlpha('#0000ff', 10), 'rgba(0,0,255,1)');
});

test('toPositiveInteger rounds .49 down and .5 up when finite and positive', () => {
  assert.equal(toPositiveInteger(4.49, 1), 4);
  assert.equal(toPositiveInteger(4.5, 1), 5);
});