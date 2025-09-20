/**
 * Helix renderer tests (node:test + assert).
 * Framework: Node's built-in test runner (node:test) with ESM; assertions via node:assert/strict.
 * These tests focus on the PR diff for normalization utilities and summary composition.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as mod from '../js/helix-renderer.mjs';

// Minimal context helper if absent
function makeCtx(width = 320, height = 200) {
  const calls = { fillRects: [], strokeStyles: [], fillStyles: [], globalAlphas: [], lineWidths: [], texts: [], colorStops: [] };
  const gradient = () => ({ _stops: [], addColorStop(offset, color){ calls.colorStops.push({ offset, color }); this._stops.push({ offset, color }); } });
  const ctx = {
    canvas: { width, height },
    _fillStyle: null, _strokeStyle: null,
    set fillStyle(v){ this._fillStyle=v; calls.fillStyles.push(v); }, get fillStyle(){ return this._fillStyle; },
    set strokeStyle(v){ this._strokeStyle=v; calls.strokeStyles.push(v); }, get strokeStyle(){ return this._strokeStyle; },
    set globalAlpha(v){ calls.globalAlphas.push(v); this._globalAlpha=v; }, get globalAlpha(){ return this._globalAlpha; },
    set lineWidth(v){ calls.lineWidths.push(v); this._lineWidth=v; }, get lineWidth(){ return this._lineWidth; },
    set font(v){ this._font=v; }, get font(){ return this._font; },
    set textAlign(v){ this._textAlign=v; }, get textAlign(){ return this._textAlign; },
    set textBaseline(v){ this._textBaseline=v; }, get textBaseline(){ return this._textBaseline; },
    save() {}, restore() {}, setTransform() {}, beginPath() {}, moveTo() {}, lineTo() {}, arc() {}, stroke() {}, fill() {},
    fillRect(x,y,w,h){ calls.fillRects.push({x,y,w,h,style:this._fillStyle}); },
    fillText(text,x,y){ calls.texts.push({ text, x, y }); },
    measureText(text){ return { width: String(text).length * 10 }; },
    createRadialGradient(){ return gradient(); },
    _calls: calls
  };
  return ctx;
}

// ----- Additional normalisation and rendering checks (PR diff focus) -----
describe('Vesica rows/columns override influences circle count', () => {
  test('rows=4, columns=5 -> 20 circles in summary', () => {
    const ctx = typeof makeCtx === 'function' ? makeCtx() : (globalThis.makeCtx?.() ?? (()=>{throw new Error('makeCtx missing');})());
    const res = mod.renderHelix(ctx, { geometry: { vesica: { rows: 4, columns: 5 } } });
    assert.equal(res.ok, true);
    assert.match(res.summary, /^Vesica 20 circles/);
  });
});

describe('normaliseNumbers: invalid NUM overrides are ignored', () => {
  test('non-positive/NaN values fall back to defaults', () => {
    const ctx = makeCtx();
    const res = mod.renderHelix(ctx, { NUM: { ONEFORTYFOUR: -10, THIRTYTHREE: 0, ELEVEN: Number.NaN } });
    assert.equal(res.ok, true);
    assert.equal(
      res.summary,
      'Vesica 99 circles · Paths 22 / Nodes 10 · Spiral 144 samples · Helix 33 ties'
    );
  });
});

describe('normalisePalette: background and layers padding', () => {
  test('default background fill uses fallback bg (#0b0b12)', () => {
    const ctx = makeCtx(320, 200);
    mod.renderHelix(ctx, {});
    assert.ok(ctx._calls.fillRects.length >= 1);
    const first = ctx._calls.fillRects[0];
    assert.equal(first.style, '#0b0b12');
  });

  test('palette.bg non-string falls back to default bg', () => {
    const ctx = makeCtx(320, 200);
    mod.renderHelix(ctx, { palette: { bg: 42 } });
    const first = ctx._calls.fillRects[0];
    assert.equal(first.style, '#0b0b12');
  });

  test('3-digit hex muted expands via withAlpha for notice background', () => {
    const ctx = makeCtx();
    mod.renderHelix(ctx, { notice: 'X', palette: { muted: '#abc' } });
    assert.ok(ctx._calls.fillStyles.includes('rgba(170, 187, 204, 0.35)'));
  });

  test('whitespace-only notice is ignored (no notice rgba fillStyle)', () => {
    const ctx = makeCtx();
    mod.renderHelix(ctx, { notice: '   ' });
    // Default muted -> rgba(166, 166, 193, 0.35) would be used if drawn
    assert.equal(ctx._calls.fillStyles.includes('rgba(166, 166, 193, 0.35)'), false);
  });
});

describe('fillBackground gradient color stops (withAlpha)', () => {
  test('gradient adds expected color stops for default palette', () => {
    const ctx = makeCtx(300, 200);
    mod.renderHelix(ctx, {});
    const stops = ctx._calls.colorStops;
    assert.ok(stops.some(s => s.offset === 0 && s.color === 'rgba(255, 255, 255, 0.05)'));
    assert.ok(stops.some(s => s.offset === 1 && s.color === 'rgba(11, 11, 18, 0)'));
  });
});

describe('mergeTreeGeometry: node/edge normalization', () => {
  test('extra items in edge tuples are truncated to [from,to]', () => {
    const ctx = makeCtx();
    const nodes = [
      { id: 'a', title: 'A', level: 0, xFactor: 0.5 },
      { id: 'b', title: 'B', level: 1, xFactor: 0.5 }
    ];
    const edges = [['a','b','EXTRA']];
    const res = mod.renderHelix(ctx, { geometry: { treeOfLife: { nodes, edges } } });
    assert.equal(res.ok, true);
    assert.match(res.summary, /Paths 1 \/ Nodes 2/);
  });

  test('normaliseTreeNode uses id as title fallback', () => {
    const ctx = makeCtx();
    const nodes = [{ id: 'only' }]; // title missing -> should fall back to 'only'
    const edges = [];
    mod.renderHelix(ctx, { geometry: { treeOfLife: { nodes, edges } } });
    assert.ok(ctx._calls.texts.some(t => t.text === 'only'));
  });
});