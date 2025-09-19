import test from 'node:test';
import assert from 'node:assert/strict';

async function importModule() {
  // Adjust path if module is in src/ or root. We try common locations.
  const candidates = [
    './helix-renderer.mjs',
    './src/helix-renderer.mjs',
    '../helix-renderer.mjs',
    '../src/helix-renderer.mjs'
  ];
  let lastErr;
  for (const p of candidates) {
    try {
      return await import(p);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('helix-renderer.mjs not found in expected locations');
}

/**
 * Minimal 2D context mock sufficient for helix renderer.
 * Captures key calls & parameters for assertions.
 */
function makeCtx({ width = 300, height = 150 } = {}) {
  const calls = {
    save: 0,
    restore: 0,
    setTransform: [],
    fillRects: [],
    strokes: 0,
    fills: 0,
    beginPaths: 0,
    arcs: [],
    moves: [],
    lines: [],
    gradients: [],
    colorStops: [],
    texts: [],
    lineWidths: [],
  };
  const gradient = {
    addColorStop: (offset, color) => {
      calls.colorStops.push({ offset, color });
    }
  };
  const ctx = {
    canvas: { width, height },
    // State props that renderer assigns
    globalAlpha: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    strokeStyle: '#000',
    fillStyle: '#000',
    lineWidth: 1,
    font: '',
    textAlign: '',
    textBaseline: '',
    // Methods
    save() { calls.save += 1; },
    restore() { calls.restore += 1; },
    setTransform(a, b, c, d, e, f) { calls.setTransform.push([a, b, c, d, e, f]); },
    fillRect(x, y, w, h) { calls.fillRects.push({ x, y, w, h, fillStyle: this.fillStyle }); },
    beginPath() { calls.beginPaths += 1; },
    arc(x, y, r, s, e) { calls.arcs.push({ x, y, r, s, e }); },
    stroke() { calls.strokes += 1; calls.lineWidths.push(this.lineWidth); },
    fill() { calls.fills += 1; },
    moveTo(x, y) { calls.moves.push({ x, y }); },
    lineTo(x, y) { calls.lines.push({ x, y }); },
    createRadialGradient() { calls.gradients.push('created'); return gradient; },
    measureText(text) { return { width: String(text ?? '').length * 8 }; },
    fillText(text, x, y) { calls.texts.push({ text, x, y, font: this.font, fillStyle: this.fillStyle }); }
  };
  return { ctx, calls };
}

test('renderHelix: returns failure for missing context', async () => {
  const { renderHelix } = await importModule();
  assert.deepEqual(renderHelix(null), { ok: false, reason: 'missing-context' });
  assert.deepEqual(renderHelix({}), { ok: false, reason: 'missing-context' });
  assert.deepEqual(renderHelix({ canvas: {} }), { ok: false, reason: 'missing-context' });
});

test('renderHelix: returns failure for invalid dimensions', async () => {
  const { renderHelix } = await importModule();
  const { ctx } = makeCtx({ width: 300, height: 150 });
  // width/height <= 0 should fail
  const r1 = renderHelix(ctx, { width: 0, height: 100 });
  assert.deepEqual(r1, { ok: false, reason: 'invalid-dimensions' });
  const r2 = renderHelix(ctx, { width: 200, height: -1 });
  assert.deepEqual(r2, { ok: false, reason: 'invalid-dimensions' });
});

test('renderHelix: happy path uses defaults and produces expected summary', async () => {
  const { renderHelix } = await importModule();
  const { ctx, calls } = makeCtx({ width: 660, height: 440 });
  const res = renderHelix(ctx, {});
  assert.equal(res.ok, true);
  // Defaults imply: Vesica 9x11 = 99 circles; Tree edges 22 / nodes 10; Fibonacci 144 samples; Helix 33 ties
  assert.equal(
    res.summary,
    'Vesica 99 circles · Paths 22 / Nodes 10 · Spiral 144 samples · Helix 33 ties'
  );
  // Background fill should be executed twice (solid + gradient)
  assert.equal(calls.fillRects.length >= 2, true, 'expected at least two background fillRects');
  // Gradient color stops reflect withAlpha("#ffffff", 0.05) and withAlpha(bg, 0)
  const c0 = calls.colorStops.find(c => c.offset === 0);
  const c1 = calls.colorStops.find(c => c.offset === 1);
  assert.ok(c0 && c0.color.startsWith('rgba(255, 255, 255,'), 'color stop at 0 uses white with alpha');
  assert.ok(c1 && c1.color.includes('rgba('), 'color stop at 1 uses rgba with bg color/alpha');
});

test('renderHelix: applies explicit width/height overrides to ctx.canvas', async () => {
  const { renderHelix } = await importModule();
  const { ctx } = makeCtx({ width: 100, height: 100 });
  const res = renderHelix(ctx, { width: 320, height: 200 });
  assert.equal(res.ok, true);
  assert.equal(ctx.canvas.width, 320);
  assert.equal(ctx.canvas.height, 200);
});

test('renderHelix: notice triggers footer text rendering', async () => {
  const { renderHelix } = await importModule();
  const { ctx, calls } = makeCtx({ width: 600, height: 400 });
  const res = renderHelix(ctx, { notice: '  Hello Cosmos  ' });
  assert.equal(res.ok, true);
  assert.ok(calls.texts.some(t => t.text === 'Hello Cosmos'), 'notice text trimmed and drawn');
});

test('renderHelix: palette normalization trims/pads layers and respects overrides', async () => {
  const { renderHelix } = await importModule();
  const { ctx, calls } = makeCtx({ width: 400, height: 300 });
  // Provide fewer layer colors than needed; rest should be padded by defaults.
  const palette = { bg: '#010203', ink: '#abcdef', muted: '#123456', layers: ['#111', '#222'] };
  const res = renderHelix(ctx, { palette });
  assert.equal(res.ok, true);
  // Ensure gradient used with provided bg (indirectly by checking final color stop contains rgb for #010203 -> 1,2,3)
  const bgStop = calls.colorStops.find(c => c.offset === 1);
  assert.ok(bgStop, 'has gradient end color stop');
  assert.match(bgStop.color, /rgba\(1,\s*2,\s*3,\s*0\)/);
});

test('renderHelix: geometry patches alter observable counts (vesica circles)', async () => {
  const { renderHelix } = await importModule();
  const { ctx } = makeCtx({ width: 660, height: 440 });
  // Change rows/columns to 4x5 => 20 circles
  const res = renderHelix(ctx, { geometry: { vesica: { rows: 4, columns: 5 } } });
  assert.equal(res.ok, true);
  assert.match(res.summary, /^Vesica 20 circles · /);
});

test('renderHelix: fibonacci markerInterval changes marker count reflected in summary indirectly', async () => {
  const { renderHelix } = await importModule();
  const { ctx } = makeCtx({ width: 660, height: 440 });
  // Keep samples 144; change markerInterval to 12 (indirectly not in summary), but ensure samples count stays.
  const res = renderHelix(ctx, { geometry: { fibonacci: { markerInterval: 12 } } });
  assert.equal(res.ok, true);
  assert.match(res.summary, /Spiral 144 samples/);
});

test('renderHelix: helix crossTieCount reflected in summary', async () => {
  const { renderHelix } = await importModule();
  const { ctx } = makeCtx({ width: 800, height: 400 });
  const res = renderHelix(ctx, { geometry: { helix: { crossTieCount: 7 } } });
  assert.equal(res.ok, true);
  assert.match(res.summary, /Helix 7 ties$/);
});

test('renderHelix: numerology override propagates into defaults (ONEFORTYFOUR -> 50 samples)', async () => {
  const { renderHelix } = await importModule();
  const { ctx } = makeCtx({ width: 500, height: 500 });
  const res = renderHelix(ctx, { NUM: { ONEFORTYFOUR: 50 } });
  assert.equal(res.ok, true);
  assert.match(res.summary, /Spiral 50 samples/);
});

test('renderHelix: handles edge-case geometry values via clamping and positiveOrDefault', async () => {
  const { renderHelix } = await importModule();
  const { ctx } = makeCtx({ width: 500, height: 500 });
  const res = renderHelix(ctx, {
    geometry: {
      vesica: { rows: -10, columns: 0, alpha: 2 }, // rows/cols should fallback to defaults; alpha clamped to 1
      fibonacci: { centerXFactor: -5, centerYFactor: 2, alpha: -1 }, // clamp to [0,1]
      helix: { strandAlpha: 5, rungAlpha: -2 } // clamp to [0,1]
    }
  });
  assert.equal(res.ok, true);
  // We can't access internals, but ensure no crash and summary uses default vesica counts (99) since negatives fall back
  assert.match(res.summary, /^Vesica 99 circles · /);
});