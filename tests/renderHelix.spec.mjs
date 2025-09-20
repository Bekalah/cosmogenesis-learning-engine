// Framework: Jest/Vitest-style BDD APIs (describe/it/expect). Adjust imports if needed based on project setup.
// Focus: Thorough unit tests for functions present in the PR diff.
// We import from tests/_mockCanvasContext.mjs because the diff content indicates exported functions there.

import * as Mod from './_mockCanvasContext.mjs';

// Minimal canvas gradient mock
function makeGradient() {
  const stops = [];
  return {
    stops,
    addColorStop(offset, color) { stops.push({ offset, color }); }
  };
}

// Rich mock of 2D canvas context that records calls
function makeMockCtx(width = 300, height = 150) {
  const calls = [];
  const ctx = {
    canvas: { width, height },
    _calls: calls,
    save: () => calls.push(['save']),
    restore: () => calls.push(['restore']),
    setTransform: (...args) => calls.push(['setTransform', ...args]),
    beginPath: () => calls.push(['beginPath']),
    moveTo: (x, y) => calls.push(['moveTo', x, y]),
    lineTo: (x, y) => calls.push(['lineTo', x, y]),
    arc: (x, y, r, s, e) => calls.push(['arc', x, y, r, s, e]),
    stroke: () => calls.push(['stroke']),
    fill: () => calls.push(['fill']),
    fillRect: (x, y, w, h) => calls.push(['fillRect', x, y, w, h]),
    measureText: (t) => ({ width: String(t).length * 10 }),
    createRadialGradient: (...args) => {
      calls.push(['createRadialGradient', ...args]);
      return makeGradient();
    },
    fillText: (t, x, y) => calls.push(['fillText', t, x, y]),
    // writable drawing state
    get globalAlpha() { return ctx._globalAlpha; },
    set globalAlpha(v) { calls.push(['set globalAlpha', v]); ctx._globalAlpha = v; },
    get lineCap() { return ctx._lineCap; },
    set lineCap(v) { calls.push(['set lineCap', v]); ctx._lineCap = v; },
    get lineJoin() { return ctx._lineJoin; },
    set lineJoin(v) { calls.push(['set lineJoin', v]); ctx._lineJoin = v; },
    get lineWidth() { return ctx._lineWidth; },
    set lineWidth(v) { calls.push(['set lineWidth', v]); ctx._lineWidth = v; },
    get strokeStyle() { return ctx._strokeStyle; },
    set strokeStyle(v) { calls.push(['set strokeStyle', v]); ctx._strokeStyle = v; },
    get fillStyle() { return ctx._fillStyle; },
    set fillStyle(v) { calls.push(['set fillStyle', v]); ctx._fillStyle = v; },
    get textAlign() { return ctx._textAlign; },
    set textAlign(v) { calls.push(['set textAlign', v]); ctx._textAlign = v; },
    get textBaseline() { return ctx._textBaseline; },
    set textBaseline(v) { calls.push(['set textBaseline', v]); ctx._textBaseline = v; },
    get font() { return ctx._font; },
    set font(v) { calls.push(['set font', v]); ctx._font = v; },
  };
  return ctx;
}

describe('numeric utilities', () => {
  it('toPositiveNumber returns number for positive finite numbers and null otherwise', () => {
    expect(Mod.__proto__ && typeof Mod.toPositiveNumber === 'function' ? Mod.toPositiveNumber(5) : Mod['toPositiveNumber'](5)).toBe(5);
    expect(Mod['toPositiveNumber'](0)).toBeNull();
    expect(Mod['toPositiveNumber'](-1)).toBeNull();
    expect(Mod['toPositiveNumber'](Infinity)).toBeNull();
    expect(Mod['toPositiveNumber'](NaN)).toBeNull();
    expect(Mod['toPositiveNumber']('3')).toBeNull();
  });

  it('positiveOrDefault returns value when positive finite, else fallback', () => {
    expect(Mod['positiveOrDefault'](2, 9)).toBe(2);
    expect(Mod['positiveOrDefault'](0, 9)).toBe(9);
    expect(Mod['positiveOrDefault'](-4, 9)).toBe(9);
    expect(Mod['positiveOrDefault'](Infinity, 9)).toBe(9);
    expect(Mod['positiveOrDefault'](NaN, 9)).toBe(9);
  });

  it('clamp bounds values inclusively', () => {
    expect(Mod['clamp'](5, 1, 10)).toBe(5);
    expect(Mod['clamp'](-1, 0, 1)).toBe(0);
    expect(Mod['clamp'](2, 0, 1)).toBe(1);
    expect(Mod['clamp'](1, 1, 1)).toBe(1);
  });
});

describe('withAlpha', () => {
  it('converts 6-hex to rgba with clamped alpha', () => {
    expect(Mod['withAlpha']('#112233', 0.5)).toBe('rgba(17, 34, 51, 0.5)');
    expect(Mod['withAlpha']('#112233', -1)).toBe('rgba(17, 34, 51, 0)');
    expect(Mod['withAlpha']('#112233', 2)).toBe('rgba(17, 34, 51, 1)');
  });
  it('expands 3-hex correctly', () => {
    expect(Mod['withAlpha']('#abc', 0.25)).toBe('rgba(170, 187, 204, 0.25)');
  });
  it('returns input unchanged for non-hex strings', () => {
    expect(Mod['withAlpha']('rgb(0,0,0)', 0.1)).toBe('rgb(0,0,0)');
    expect(Mod['withAlpha']('', 0.1)).toBe('');
    expect(Mod['withAlpha'](null, 0.2)).toBe(null);
  });
});

describe('normaliseNumbers', () => {
  it('returns fallback numbers when candidate missing or invalid', () => {
    const out = Mod['normaliseNumbers'](undefined);
    expect(out).toEqual(expect.objectContaining({
      THREE: expect.any(Number),
      SEVEN: expect.any(Number),
      NINE: expect.any(Number),
      ELEVEN: expect.any(Number),
      TWENTYTWO: expect.any(Number),
      THIRTYTHREE: expect.any(Number),
      NINETYNINE: expect.any(Number),
      ONEFORTYFOUR: expect.any(Number),
    }));
  });

  it('merges only valid positive finite overrides', () => {
    const out = Mod['normaliseNumbers']({
      THREE: 30, // override
      SEVEN: 0, // invalid
      NINE: -9, // invalid
      ELEVEN: Infinity, // invalid
      TWENTYTWO: NaN, // invalid
    });
    expect(out.THREE).toBe(30);
    expect(out.SEVEN).not.toBe(0);
    expect(out.NINE).not.toBe(-9);
    expect(Number.isFinite(out.ELEVEN)).toBe(true);
  });
});

describe('normalisePalette and clonePalette', () => {
  it('returns fallback when candidate invalid', () => {
    const p = Mod['normalisePalette'](null);
    expect(p).toHaveProperty('bg');
    expect(p).toHaveProperty('ink');
    expect(p).toHaveProperty('muted');
    expect(Array.isArray(p.layers)).toBe(true);
  });

  it('pads/truncates layers to fallback length and preserves provided strings', () => {
    const p = Mod['normalisePalette']({
      bg: '#000000',
      ink: '#ffffff',
      muted: '#cccccc',
      layers: ['#1', '#2'] // short
    });
    expect(p.bg).toBe('#000000');
    expect(p.ink).toBe('#ffffff');
    expect(p.muted).toBe('#cccccc');
    expect(p.layers.length).toBe(Mod['FALLBACK_PALETTE'].layers.length);
    expect(p.layers[0]).toBe('#1');
    expect(p.layers[1]).toBe('#2');
    // remaining are filled from fallback
    for (let i = 2; i < p.layers.length; i += 1) {
      expect(p.layers[i]).toBe(Mod['FALLBACK_PALETTE'].layers[i]);
    }
  });

  it('clonePalette returns a deep copy for layers array', () => {
    const src = Mod['normalisePalette'](null);
    const copy = Mod['clonePalette'](src);
    expect(copy).toEqual(src);
    expect(copy).not.toBe(src);
    expect(copy.layers).not.toBe(src.layers);
  });
});

describe('geometry defaults and merging', () => {
  const NUM = Mod['normaliseNumbers']();

  it('createDefaultGeometry uses provided numbers mapping', () => {
    const g = Mod['createDefaultGeometry'](NUM);
    expect(g.fibonacci.sampleCount).toBe(NUM.ONEFORTYFOUR);
    expect(g.helix.cycles).toBe(NUM.THREE);
    expect(g.vesica.rows).toBe(NUM.NINE);
  });

  it('normaliseGeometry returns base when candidate invalid', () => {
    const g = Mod['normaliseGeometry'](null, NUM);
    expect(g.vesica).toBeDefined();
    expect(g.treeOfLife.nodes.length).toBeGreaterThan(0);
    expect(g.treeOfLife.edges.length).toBeGreaterThan(0);
  });

  it('mergeVesicaGeometry respects positive overrides and clamps alpha and radiusScale', () => {
    const base = Mod['createDefaultGeometry'](NUM).vesica;
    const merged = Mod['mergeVesicaGeometry'](base, {
      rows: 20, columns: 5, paddingDivisor: 2, radiusScale: 99, strokeDivisor: 50, alpha: 5
    });
    expect(merged.rows).toBe(20);
    expect(merged.columns).toBe(5);
    expect(merged.paddingDivisor).toBe(2);
    expect(merged.radiusScale).toBe(99);
    expect(merged.strokeDivisor).toBe(50);
    expect(merged.alpha).toBeLessThanOrEqual(1);
  });

  it('mergeTreeGeometry deep-copies nodes/edges when patch absent; normalises when provided', () => {
    const base = Mod['createDefaultGeometry'](NUM).treeOfLife;
    const noPatch = Mod['mergeTreeGeometry'](base, null);
    expect(noPatch.nodes).not.toBe(base.nodes);
    expect(noPatch.edges).not.toBe(base.edges);

    const patched = Mod['mergeTreeGeometry'](base, {
      nodes: [{ id: 1, title: '', level: 2, xFactor: 0.1 }],
      edges: [['a','b'], ['x','y','z']], // extra value to be trimmed
      labelAlpha: 2
    });
    expect(patched.nodes[0]).toEqual({ id: '1', title: '1', level: 2, xFactor: 0.1 });
    expect(patched.edges[0]).toEqual(['a','b']);
    expect(patched.edges[1]).toEqual(['x','y']);
    expect(patched.labelAlpha).toBeLessThanOrEqual(1);
  });

  it('normaliseTreeNode converts id to string, defaulting title, and sets numeric defaults', () => {
    expect(Mod['normaliseTreeNode']({ id: 0 })).toEqual({
      id: '0', title: '0', level: 0, xFactor: 0.5
    });
    expect(Mod['normaliseTreeNode']({ id: 'n1', title: 'Name', level: 3, xFactor: 0.7 })).toEqual({
      id: 'n1', title: 'Name', level: 3, xFactor: 0.7
    });
  });

  it('mergeFibonacciGeometry merges numeric and clamps factors', () => {
    const base = Mod['createDefaultGeometry'](NUM).fibonacci;
    const merged = Mod['mergeFibonacciGeometry'](base, {
      sampleCount: 10, turns: 4, baseRadiusDivisor: 50, centerXFactor: -1, centerYFactor: 2, phi: 0.5, markerInterval: 3, alpha: -5
    });
    expect(merged.sampleCount).toBe(10);
    expect(merged.turns).toBe(4);
    expect(merged.baseRadiusDivisor).toBe(50);
    expect(merged.centerXFactor).toBeGreaterThanOrEqual(0);
    expect(merged.centerYFactor).toBeLessThanOrEqual(1);
    expect(merged.phi).toBe(base.phi); // invalid < 1 reverts
    expect(merged.markerInterval).toBe(3);
    expect(merged.alpha).toBeGreaterThanOrEqual(0);
  });

  it('mergeHelixGeometry merges values and clamps alphas', () => {
    const base = Mod['createDefaultGeometry'](NUM).helix;
    const merged = Mod['mergeHelixGeometry'](base, {
      sampleCount: 50, cycles: 6, amplitudeDivisor: 8, strandSeparationDivisor: 20, crossTieCount: 13,
      strandAlpha: 5, rungAlpha: -2
    });
    expect(merged.sampleCount).toBe(50);
    expect(merged.cycles).toBe(6);
    expect(merged.amplitudeDivisor).toBe(8);
    expect(merged.strandSeparationDivisor).toBe(20);
    expect(merged.crossTieCount).toBe(13);
    expect(merged.strandAlpha).toBeLessThanOrEqual(1);
    expect(merged.rungAlpha).toBeGreaterThanOrEqual(0);
  });
});

describe('render pipeline', () => {
  it('renderHelix returns missing-context when ctx invalid', () => {
    const r1 = Mod['renderHelix'](null, {});
    expect(r1).toEqual({ ok: false, reason: 'missing-context' });

    const r2 = Mod['renderHelix']({}, {});
    expect(r2).toEqual({ ok: false, reason: 'missing-context' });
  });

  it('renderHelix returns invalid-dimensions when dims invalid', () => {
    const ctx = makeMockCtx();
    // options width/height invalid -> normaliseDimensions returns null
    const r = Mod['renderHelix'](ctx, { width: 0, height: -1 });
    expect(r).toEqual({ ok: false, reason: 'invalid-dimensions' });
  });

  it('renderHelix draws layers and returns summary with counts; notice optional', () => {
    const ctx = makeMockCtx(400, 300);
    const res = Mod['renderHelix'](ctx, { notice: 'Hello' });
    expect(res.ok).toBe(true);
    expect(res.summary).toMatch(/Vesica .* circles · Paths .* \/ Nodes .* · Spiral .* samples · Helix .* ties/);
    // verify some key calls occurred
    const calls = ctx._calls.map(c => c[0]);
    expect(calls).toContain('save');
    expect(calls).toContain('restore');
    expect(calls).toContain('fillRect'); // background + gradient overlay + notice background
    expect(calls).toContain('arc'); // vesica circles, fibonacci, markers
    expect(calls).toContain('stroke'); // multiple strokes
    expect(calls).toContain('fillText'); // notice text
  });

  it('renderHelix omits notice draw when empty/whitespace', () => {
    const ctx = makeMockCtx(400, 300);
    const res = Mod['renderHelix'](ctx, { notice: '   ' });
    expect(res.ok).toBe(true);
    const calls = ctx._calls.map(c => c[0]);
    // Ensure no fillText when notice empty
    const hasFillText = ctx._calls.some(c => c[0] === 'fillText');
    expect(hasFillText).toBe(false);
  });
});

describe('fillBackground', () => {
  it('sets fillStyle, paints full rect, and applies radial gradient overlay', () => {
    const ctx = makeMockCtx(200, 100);
    Mod['fillBackground'](ctx, { width: 200, height: 100 }, '#123456');
    const calls = ctx._calls;
    // first fillRect uses solid color
    const firstFillStyleIdx = calls.findIndex(c => c[0] === 'set fillStyle');
    expect(firstFillStyleIdx).toBeGreaterThanOrEqual(0);
    expect(calls[firstFillStyleIdx][1]).toBe('#123456');

    // gradient creation and second fillRect
    const gradCall = calls.find(c => c[0] === 'createRadialGradient');
    expect(gradCall).toBeTruthy();
    const secondFillIdx = calls.findIndex((c, i) => i > firstFillStyleIdx && c[0] === 'set fillStyle');
    expect(secondFillIdx).toBeGreaterThan(firstFillStyleIdx);
    const secondRectIdx = calls.findIndex((c, i) => i > secondFillIdx && c[0] === 'fillRect');
    expect(secondRectIdx).toBeGreaterThan(secondFillIdx);
  });
});

describe('draw helpers computational returns', () => {
  const NUM = Mod['normaliseNumbers']();
  const palette = Mod['normalisePalette'](null);
  const dims = { width: 300, height: 200 };

  it('drawVesicaField returns circle count consistent with rows*cols', () => {
    const ctx = makeMockCtx(300, 200);
    const cfg = { rows: 3, columns: 4, paddingDivisor: 10, radiusScale: 0.25, strokeDivisor: 50, alpha: 0.5 };
    const stats = Mod['drawVesicaField'](ctx, dims, palette.layers[0], NUM, cfg);
    expect(stats.circles).toBe(3 * 4);
  });

  it('drawTreeOfLife returns node and path counts', () => {
    const ctx = makeMockCtx(300, 300);
    const base = Mod['createDefaultGeometry'](NUM).treeOfLife;
    const stats = Mod['drawTreeOfLife'](ctx, dims, palette, NUM, base);
    expect(stats.nodes).toBe(base.nodes.length);
    expect(stats.paths).toBe(base.edges.length);
  });

  it('drawFibonacciCurve returns samples and marker count computed via interval', () => {
    const ctx = makeMockCtx(300, 200);
    const cfg = { ...Mod['createDefaultGeometry'](NUM).fibonacci, sampleCount: 12, markerInterval: 5 };
    const stats = Mod['drawFibonacciCurve'](ctx, dims, palette.layers[3], NUM, cfg);
    expect(stats.samples).toBe(12);
    // markers placed at indices 0,5,10 -> 3 markers (<= samples-1)
    expect(stats.markers).toBe(3);
  });

  it('drawHelixLattice returns 2*samples strandPoints and ties count', () => {
    const ctx = makeMockCtx(200, 200);
    const cfg = { ...Mod['createDefaultGeometry'](NUM).helix, sampleCount: 11, crossTieCount: 6 };
    const stats = Mod['drawHelixLattice'](ctx, dims, palette, NUM, cfg);
    expect(stats.strandPoints).toBe(22);
    expect(stats.crossTies).toBe(6);
  });
});

describe('summariseLayers', () => {
  it('formats readable summary string from layer stats', () => {
    const s = Mod['summariseLayers']({
      vesicaStats: { circles: 10 },
      treeStats: { paths: 5, nodes: 7 },
      fibonacciStats: { samples: 42 },
      helixStats: { crossTies: 9 }
    });
    expect(s).toBe('Vesica 10 circles · Paths 5 / Nodes 7 · Spiral 42 samples · Helix 9 ties');
  });
});