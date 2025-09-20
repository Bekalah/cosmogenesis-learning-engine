import { strict as assert } from "node:assert";
import test from "node:test";

/* Test framework note:
 * These tests are written using a neutral BDD style (describe/it + expect).
 * They work with Jest or Vitest (global expect), and with Mocha when paired with Chai's expect.
 * If running with Mocha, ensure `global.expect = (await import('chai')).expect` in your setup, or adjust imports accordingly.
 */

const hasJestLike = Boolean(globalThis.jest || globalThis.vi);
const runtimeName = typeof globalThis.vi !== "undefined" ? "vitest" : (typeof globalThis.jest !== "undefined" ? "jest" : "unknown");

let expectFn = globalThis.expect;
async function ensureExpect() {
  if (typeof expectFn === "function") return;
  // Try chai expect as a fallback (for mocha).
  try {
    const { expect } = await import('chai');
    expectFn = expect;
    globalThis.expect = expect;
  } catch {
    throw new Error("No expect() found. Please run tests with Jest/Vitest or Mocha+Chai.");
  }
}
await ensureExpect();
const expect = expectFn;

// Resolve module under test by probing common locations.
async function loadModule() {
  const candidates = [
    './helix-renderer.mjs',
    './helix-renderer.js',
    '../src/helix-renderer.mjs',
    '../src/helix-renderer.js',
    '../lib/helix-renderer.mjs',
    '../lib/helix-renderer.js',
    '../helix-renderer.mjs',
    '../helix-renderer.js'
  ].map(p => new URL(p, import.meta.url).pathname);

  for (const path of candidates) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const mod = await import(path);
      if (mod && (typeof mod.renderHelix === 'function' || mod.default)) {
        return mod;
      }
    } catch (_e) {
      // continue
    }
  }
  throw new Error("Could not find helix renderer module. Ensure one of the common paths exists and exports 'renderHelix'.");
}

function createMockCanvas2D(width = 320, height = 200) {
  const calls = [];
  const record = (name, args) => calls.push({ name, args: Array.from(args) });
  const ctx = {
    canvas: { width, height },
    // state
    globalAlpha: NaN,
    lineCap: '',
    lineJoin: '',
    lineWidth: NaN,
    strokeStyle: '',
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
    // transforms and state
    save: function () { record('save', arguments); },
    restore: function () { record('restore', arguments); },
    setTransform: function() { record('setTransform', arguments); },
    // shapes
    beginPath: function() { record('beginPath', arguments); },
    moveTo: function() { record('moveTo', arguments); },
    lineTo: function() { record('lineTo', arguments); },
    stroke: function() { record('stroke', arguments); },
    fill: function() { record('fill', arguments); },
    arc: function() { record('arc', arguments); },
    fillRect: function() { record('fillRect', arguments); },
    createRadialGradient: function() {
      const stops = [];
      const grad = {
        addColorStop: function() { stops.push(Array.from(arguments)); }
      };
      record('createRadialGradient', arguments);
      grad._stops = stops;
      return grad;
    },
    measureText: function(txt) {
      // Simple deterministic width approximation
      return { width: String(txt).length * 8 };
    },
    fillText: function() { record('fillText', arguments); }
  };
  return { ctx, calls };
}

describe('helix-renderer module', () => {
  let mod = null;

  beforeAll(async () => {
    mod = await loadModule();
  });

  describe('helpers', () => {
    it('toPositiveNumber returns null for invalid, positive number for valid', () => {
      const { toPositiveNumber } = mod;
      expect(toPositiveNumber(-1)).toBeNull?.() ?? expect(toPositiveNumber(-1)).to.equal(null);
      expect(toPositiveNumber(0)).toBeNull?.() ?? expect(toPositiveNumber(0)).to.equal(null);
      expect(toPositiveNumber(NaN)).toBeNull?.() ?? expect(toPositiveNumber(NaN)).to.equal(null);
      const ok = toPositiveNumber(42);
      if (expect(ok).toBeDefined) {
        expect(ok).toBe(42);
      } else {
        expect(ok).to.equal(42);
      }
    });

    it('clamp limits within [min,max]', () => {
      const { clamp } = mod;
      const assertions = [
        {v:-1,min:0,max:1, out:0},
        {v:0.5,min:0,max:1, out:0.5},
        {v:2,min:0,max:1, out:1}
      ];
      for (const a of assertions) {
        const got = clamp(a.v, a.min, a.max);
        if (expect(got).toBeDefined) expect(got).toBe(a.out); else expect(got).to.equal(a.out);
      }
    });

    it('withAlpha handles hex and non-hex inputs', () => {
      const { withAlpha } = mod;
      const rgba = withAlpha('#abc', 0.5);
      const expectStr = typeof expect('').toMatch === 'function' ? (s, r) => expect(s).toMatch(r) : (s, r) => expect(s).to.match(r);
      expectStr(rgba, /^rgba\(\d+,\s*\d+,\s*\d+,\s*0\.5\)$/);

      const passthrough = withAlpha('rgb(1,2,3)', 0.5);
      if (expect(passthrough).toBeDefined) expect(passthrough).toBe('rgb(1,2,3)'); else expect(passthrough).to.equal('rgb(1,2,3)');
    });

    it('positiveOrDefault returns fallback for non-positive', () => {
      const { positiveOrDefault } = mod;
      const out1 = positiveOrDefault(-2, 10);
      const out2 = positiveOrDefault(NaN, 10);
      const out3 = positiveOrDefault(5, 10);
      if (expect(out1).toBeDefined) {
        expect(out1).toBe(10);
        expect(out2).toBe(10);
        expect(out3).toBe(5);
      } else {
        expect(out1).to.equal(10);
        expect(out2).to.equal(10);
        expect(out3).to.equal(5);
      }
    });
  });

  describe('palette and numbers normalization', () => {
    it('normaliseNumbers merges only valid positive finite overrides', () => {
      const { normaliseNumbers, FALLBACK_NUMBERS } = mod;
      const override = { THREE: 4, ELEVEN: 0, NINE: Infinity, THIRTYTHREE: 33 };
      const got = normaliseNumbers(override);
      if (expect(got.THREE).toBeDefined) {
        expect(got.THREE).toBe(4);
        expect(got.ELEVEN).toBe(FALLBACK_NUMBERS.ELEVEN);
        expect(got.NINE).toBe(FALLBACK_NUMBERS.NINE);
        expect(got.THIRTYTHREE).toBe(33);
      } else {
        expect(got.THREE).to.equal(4);
        expect(got.ELEVEN).to.equal(FALLBACK_NUMBERS.ELEVEN);
        expect(got.NINE).to.equal(FALLBACK_NUMBERS.NINE);
        expect(got.THIRTYTHREE).to.equal(33);
      }
    });

    it('normalisePalette fills missing fields and pads/truncates layers', () => {
      const { normalisePalette, FALLBACK_PALETTE } = mod;
      const partial = { bg: '#101010', layers: ['#111', '#222', '#333'] };
      const got = normalisePalette(partial);
      if (expect(got.bg).toBeDefined) {
        expect(got.bg).toBe('#101010');
        expect(got.ink).toBe(FALLBACK_PALETTE.ink);
        expect(Array.isArray(got.layers)).toBe(true);
        expect(got.layers.length).toBe(FALLBACK_PALETTE.layers.length);
        expect(got.layers[0]).toBe('#111');
        expect(got.layers[1]).toBe('#222');
        expect(got.layers[2]).toBe('#333');
        expect(got.layers[got.layers.length-1]).toBe(FALLBACK_PALETTE.layers[FALLBACK_PALETTE.layers.length-1]);
      } else {
        expect(got.bg).to.equal('#101010');
        expect(got.ink).to.equal(FALLBACK_PALETTE.ink);
        expect(got.layers).to.be.an('array');
        expect(got.layers.length).to.equal(FALLBACK_PALETTE.layers.length);
        expect(got.layers[0]).to.equal('#111');
        expect(got.layers[1]).to.equal('#222');
        expect(got.layers[2]).to.equal('#333');
        expect(got.layers[got.layers.length-1]).to.equal(FALLBACK_PALETTE.layers[FALLBACK_PALETTE.layers.length-1]);
      }
    });

    it('clonePalette returns deep copy of layers', () => {
      const { clonePalette, FALLBACK_PALETTE } = mod;
      const cp = clonePalette(FALLBACK_PALETTE);
      if (expect(cp).toBeDefined) {
        expect(cp).not.toBe(FALLBACK_PALETTE);
        expect(cp.layers).not.toBe(FALLBACK_PALETTE.layers);
      } else {
        expect(cp).to.not.equal(FALLBACK_PALETTE);
        expect(cp.layers).to.not.equal(FALLBACK_PALETTE.layers);
      }
    });
  });

  describe('dimensions normalization', () => {
    it('normaliseDimensions validates and mutates ctx.canvas size as needed', () => {
      const { normaliseDimensions } = mod;
      const { ctx } = createMockCanvas2D(100, 50);
      const out = normaliseDimensions(ctx, { width: 120, height: 80 });
      if (expect(out).toBeDefined) {
        expect(out.width).toBe(120);
        expect(out.height).toBe(80);
        expect(ctx.canvas.width).toBe(120);
        expect(ctx.canvas.height).toBe(80);
      } else {
        expect(out).to.include({ width: 120, height: 80 });
        expect(ctx.canvas.width).to.equal(120);
        expect(ctx.canvas.height).to.equal(80);
      }
    });

    it('returns null on invalid sizes', () => {
      const { normaliseDimensions } = mod;
      const { ctx } = createMockCanvas2D(100, 50);
      const out = normaliseDimensions(ctx, { width: -1, height: 0 });
      if (expect(out).toBeNull) expect(out).toBeNull(); else expect(out).to.equal(null);
    });
  });

  describe('renderHelix', () => {
    it('returns calm summary when context is unavailable (per PR diff)', () => {
      const { renderHelix } = mod;
      const result = renderHelix(null, {});
      const hasSummary = result && typeof result.summary === 'string';
      if (expect(hasSummary).toBeDefined) {
        expect(hasSummary).toBe(true);
        expect(result.summary.toLowerCase()).toContain?.('canvas context') ?? expect(result.summary.toLowerCase()).to.contain('canvas context');
      } else {
        expect(hasSummary).to.equal(true);
        expect(result.summary.toLowerCase()).to.contain('canvas context');
      }
    });

    it('handles minimal valid context without throwing and returns ok/summary', () => {
      const { renderHelix } = mod;
      const { ctx } = createMockCanvas2D(200, 120);
      // The diff shows parameter named `input` but code uses `options` inside.
      // This test asserts that implementation does NOT throw ReferenceError
      // and returns a structured result with either ok:true or a summary string.
      let result;
      expect(() => { result = renderHelix(ctx, {}); }).not.toThrow?.() ?? expect(() => { result = renderHelix(ctx, {}); }).to.not.throw();
      const structured = result && (result.ok === true || typeof result.summary === 'string');
      if (expect(structured).toBeDefined) {
        expect(structured).toBe(true);
      } else {
        expect(structured).to.equal(true);
      }
    });
  });

  describe('drawing primitives return stats and use canvas APIs', () => {
    it('fillBackground paints full canvas and adds radial gradient', () => {
      const { fillBackground } = mod;
      const { ctx, calls } = createMockCanvas2D(90, 70);
      fillBackground(ctx, { width: 90, height: 70 }, '#000000');
      const fillCount = calls.filter(c => c.name === 'fillRect').length;
      if (expect(fillCount).toBeDefined) {
        expect(fillCount).toBeGreaterThanOrEqual(2);
      } else {
        expect(fillCount).to.be.at.least(2);
      }
    });

    it('drawVesicaField counts circles and draws axes', () => {
      const { drawVesicaField } = mod;
      const { ctx } = createMockCanvas2D(100, 100);
      const stats = drawVesicaField(ctx, { width: 100, height: 100 }, '#123', { NINETYNINE: 99 }, {
        columns: 4, rows: 3, paddingDivisor: 10, radiusScale: 0.5, strokeDivisor: 50, alpha: 0.6
      });
      if (expect(stats.circles).toBeDefined) {
        expect(stats.circles).toBe(12);
      } else {
        expect(stats.circles).to.equal(12);
      }
    });

    it('drawTreeOfLife respects node/edge stats', () => {
      const { drawTreeOfLife } = mod;
      const { ctx } = createMockCanvas2D(240, 180);

      const palette = { layers: ['#0', '#1', '#2', '#3', '#4', '#5'], ink: '#fff' };
      const numbers = { THREE: 3, SEVEN: 7, NINETYNINE: 99 };
      const nodes = [
        { id: 'a', title: 'A', level: 0, xFactor: 0.1 },
        { id: 'b', title: 'B', level: 1, xFactor: 0.9 }
      ];
      const edges = [['a', 'b']];
      const cfg = {
        marginDivisor: 11,
        radiusDivisor: 33,
        pathDivisor: 99,
        nodeAlpha: 0.8,
        pathAlpha: 0.6,
        labelAlpha: 0.7,
        nodes, edges
      };
      const stats = drawTreeOfLife(ctx, { width: 240, height: 180 }, palette, numbers, cfg);
      if (expect(stats.nodes).toBeDefined) {
        expect(stats.nodes).toBe(2);
        expect(stats.paths).toBe(1);
      } else {
        expect(stats.nodes).to.equal(2);
        expect(stats.paths).to.equal(1);
      }
    });

    it('drawFibonacciCurve returns expected sample and marker counts', () => {
      const { drawFibonacciCurve } = mod;
      const { ctx } = createMockCanvas2D(200, 200);
      const stats = drawFibonacciCurve(ctx, { width: 200, height: 200 }, '#abc', {
        NINETYNINE: 99, THREE: 3, ONEFORTYFOUR: 144
      }, {
        sampleCount: 10,
        turns: 3,
        baseRadiusDivisor: 10,
        centerXFactor: 0.4,
        centerYFactor: 0.5,
        phi: 1.62,
        markerInterval: 3,
        alpha: 0.9
      });
      if (expect(stats.samples).toBeDefined) {
        expect(stats.samples).toBe(10);
        expect(stats.markers).toBeGreaterThanOrEqual(3);
      } else {
        expect(stats.samples).to.equal(10);
        expect(stats.markers).to.be.at.least(3);
      }
    });

    it('drawHelixLattice returns expected counts based on config', () => {
      const { drawHelixLattice } = mod;
      const { ctx } = createMockCanvas2D(300, 150);
      const stats = drawHelixLattice(ctx, { width: 300, height: 150 },
        { layers: ['#0','#1','#2','#3','#4','#5'], ink: '#fff', muted: '#777' },
        { NINETYNINE: 99, THREE: 3 }, {
          sampleCount: 20,
          cycles: 3,
          amplitudeDivisor: 10,
          strandSeparationDivisor: 20,
          crossTieCount: 7,
          strandAlpha: 0.8,
          rungAlpha: 0.6
        }
      );
      if (expect(stats.strandPoints).toBeDefined) {
        expect(stats.strandPoints).toBe(40);
        expect(stats.crossTies).toBe(7);
      } else {
        expect(stats.strandPoints).to.equal(40);
        expect(stats.crossTies).to.equal(7);
      }
    });
  });

  describe('geometry merging', () => {
    it('mergeVesicaGeometry applies positive-only overrides and clamps alpha', () => {
      const { mergeVesicaGeometry } = mod;
      const base = { rows: 9, columns: 11, paddingDivisor: 11, radiusScale: 0.2, strokeDivisor: 99, alpha: 0.55 };
      const patch = { rows: 10, columns: -5, paddingDivisor: 0, radiusScale: 0.7, strokeDivisor: 30, alpha: 2 };
      const out = mergeVesicaGeometry(base, patch);
      if (expect(out.rows).toBeDefined) {
        expect(out.rows).toBe(10);
        expect(out.columns).toBe(11);
        expect(out.paddingDivisor).toBe(11);
        expect(out.radiusScale).toBe(0.7);
        expect(out.strokeDivisor).toBe(30);
        expect(out.alpha).toBe(1);
      } else {
        expect(out.rows).to.equal(10);
        expect(out.columns).to.equal(11);
        expect(out.paddingDivisor).to.equal(11);
        expect(out.radiusScale).to.equal(0.7);
        expect(out.strokeDivisor).to.equal(30);
        expect(out.alpha).to.equal(1);
      }
    });

    it('mergeTreeGeometry preserves deep arrays when patch not provided', () => {
      const { mergeTreeGeometry } = mod;
      const base = {
        marginDivisor: 11, radiusDivisor: 33, pathDivisor: 99,
        nodeAlpha: 0.8, pathAlpha: 0.6, labelAlpha: 0.7,
        nodes: [{ id:'a', title:'A', level:0, xFactor:0.5 }],
        edges: [['a','a']]
      };
      const out = mergeTreeGeometry(base, null);
      if (expect(out.nodes).toBeDefined) {
        expect(Array.isArray(out.nodes)).toBe(true);
        expect(out.nodes).not.toBe(base.nodes);
        expect(out.edges).not.toBe(base.edges);
        expect(out.nodeAlpha).toBe(0.8);
      } else {
        expect(out.nodes).to.be.an('array');
        expect(out.nodes).to.not.equal(base.nodes);
        expect(out.edges).to.not.equal(base.edges);
        expect(out.nodeAlpha).to.equal(0.8);
      }
    });

    it('normaliseTreeNode fills defaults and stringifies id', () => {
      const { normaliseTreeNode } = mod;
      const out = normaliseTreeNode({ id: 7 });
      if (expect(out.id).toBeDefined) {
        expect(out.id).toBe('7');
        expect(out.title).toBe('7');
        expect(out.level).toBe(0);
        expect(out.xFactor).toBe(0.5);
      } else {
        expect(out.id).to.equal('7');
        expect(out.title).to.equal('7');
        expect(out.level).to.equal(0);
        expect(out.xFactor).to.equal(0.5);
      }
    });

    it('mergeFibonacciGeometry applies positive-only and clamps/floors as per rules', () => {
      const { mergeFibonacciGeometry } = mod;
      const base = {
        sampleCount: 144, turns: 3, baseRadiusDivisor: 22, centerXFactor: 0.34, centerYFactor: 0.58, phi: 1.618, markerInterval: 11, alpha: 0.85
      };
      const patch = {
        sampleCount: 200, turns: 0, baseRadiusDivisor: -5, centerXFactor: -1, centerYFactor: 2, phi: 0.9, markerInterval: 5, alpha: -0.1
      };
      const out = mergeFibonacciGeometry(base, patch);
      if (expect(out.sampleCount).toBeDefined) {
        expect(out.sampleCount).toBe(200);
        expect(out.turns).toBe(3);
        expect(out.baseRadiusDivisor).toBe(22);
        expect(out.centerXFactor).toBe(0);
        expect(out.centerYFactor).toBe(1);
        expect(out.phi).toBe(1.618);
        expect(out.markerInterval).toBe(5);
        expect(out.alpha).toBe(0);
      } else {
        expect(out.sampleCount).to.equal(200);
        expect(out.turns).to.equal(3);
        expect(out.baseRadiusDivisor).to.equal(22);
        expect(out.centerXFactor).to.equal(0);
        expect(out.centerYFactor).to.equal(1);
        expect(out.phi).to.equal(1.618);
        expect(out.markerInterval).to.equal(5);
        expect(out.alpha).to.equal(0);
      }
    });

    it('mergeHelixGeometry applies positive-only overrides and clamps alphas', () => {
      const { mergeHelixGeometry } = mod;
      const base = {
        sampleCount: 144, cycles: 3, amplitudeDivisor: 9, strandSeparationDivisor: 33, crossTieCount: 33, strandAlpha: 0.82, rungAlpha: 0.6
      };
      const patch = {
        sampleCount: 10, cycles: 0, amplitudeDivisor: 0, strandSeparationDivisor: -1, crossTieCount: 7, strandAlpha: 9, rungAlpha: -2
      };
      const out = mergeHelixGeometry(base, patch);
      if (expect(out.sampleCount).toBeDefined) {
        expect(out.sampleCount).toBe(10);
        expect(out.cycles).toBe(3);
        expect(out.amplitudeDivisor).toBe(9);
        expect(out.strandSeparationDivisor).toBe(33);
        expect(out.crossTieCount).toBe(7);
        expect(out.strandAlpha).toBe(1);
        expect(out.rungAlpha).toBe(0);
      } else {
        expect(out.sampleCount).to.equal(10);
        expect(out.cycles).to.equal(3);
        expect(out.amplitudeDivisor).to.equal(9);
        expect(out.strandSeparationDivisor).to.equal(33);
        expect(out.crossTieCount).to.equal(7);
        expect(out.strandAlpha).to.equal(1);
        expect(out.rungAlpha).to.equal(0);
      }
    });
  });

  describe('summary formatting', () => {
    it('summariseLayers composes expected message', () => {
      const { summariseLayers } = mod;
      const summary = summariseLayers({
        vesicaStats: { circles: 12 },
        treeStats: { paths: 5, nodes: 10 },
        fibonacciStats: { samples: 100 },
        helixStats: { crossTies: 7 }
      });
      const s = String(summary);
      const contains = (sub) => s.includes(sub);
      if (expect(contains('Vesica 12 circles')).toBeDefined) {
        expect(contains('Vesica 12 circles')).toBe(true);
        expect(contains('Paths 5 / Nodes 10')).toBe(true);
        expect(contains('Spiral 100 samples')).toBe(true);
        expect(contains('Helix 7 ties')).toBe(true);
      } else {
        expect(contains('Vesica 12 circles')).to.equal(true);
        expect(contains('Paths 5 / Nodes 10')).to.equal(true);
        expect(contains('Spiral 100 samples')).to.equal(true);
        expect(contains('Helix 7 ties')).to.equal(true);
      }
    });
  });

  describe('canvas notice', () => {
    it('drawCanvasNotice paints background strip and text', () => {
      const { drawCanvasNotice } = mod;
      const { ctx, calls } = createMockCanvas2D(200, 100);
      drawCanvasNotice(ctx, { width: 200, height: 100 }, '#fff', '#888', 'hello');
      const fillRects = calls.filter(c => c.name === 'fillRect').length;
      const textCalls = calls.filter(c => c.name === 'fillText').length;
      if (expect(fillRects).toBeDefined) {
        expect(fillRects).toBeGreaterThanOrEqual(1);
        expect(textCalls).toBe(1);
      } else {
        expect(fillRects).to.be.at.least(1);
        expect(textCalls).to.equal(1);
      }
    });
  });
});

// -----------------------------------------------------------------------------
// Additional tests appended by CI assistant (v2)
// Detected testing style: runner-agnostic expect() (Jest/Vitest or Mocha+Chai).
// Repo also uses node:test + assert elsewhere; we keep BDD style here.
// Lazy module loader to avoid relying on beforeAll/before across runners.
// -----------------------------------------------------------------------------

let __modCache;
async function __getHelixMod() {
  if (__modCache) return __modCache;
  __modCache = await loadModule();
  return __modCache;
}

describe('renderHelix – additional scenarios', () => {
  it('succeeds with defaults when only ctx provided (uses fallback geometry and palette)', async () => {
    const { renderHelix } = await __getHelixMod();
    const { ctx } = createMockCanvas2D(160, 120);
    const result = renderHelix(ctx); // no options
    const ok = !!(result && result.ok === true && typeof result.summary === "string");
    if (expect(ok).toBeDefined) {
      expect(ok).toBe(true);
    } else {
      expect(ok).to.equal(true);
    }
  });

  it('does not draw notice text when notice is empty/whitespace', async () => {
    const { renderHelix } = await __getHelixMod();
    const { ctx, calls } = createMockCanvas2D(200, 100);
    const res = renderHelix(ctx, {
      notice: '   ',
      palette: { bg: '#000', ink: '#fff', muted: '#777', layers: ['#1','#2','#3','#4','#5','#6'] },
      geometry: {
        vesica: { rows: 2, columns: 2, paddingDivisor: 10, radiusScale: 0.2, strokeDivisor: 20, alpha: 0.5 },
        treeOfLife: { marginDivisor: 8, radiusDivisor: 16, pathDivisor: 24, nodeAlpha: 0.8, pathAlpha: 0.6, labelAlpha: 0.7, nodes: [{ id: "x", title: "X", level: 0, xFactor: 0.5 }], edges: [] },
        fibonacci: { sampleCount: 2, turns: 1, baseRadiusDivisor: 10, centerXFactor: 0.4, centerYFactor: 0.6, phi: 1.5, markerInterval: 5, alpha: 0.9 },
        helix: { sampleCount: 2, cycles: 1, amplitudeDivisor: 9, strandSeparationDivisor: 11, crossTieCount: 1, strandAlpha: 0.8, rungAlpha: 0.6 }
      }
    });
    if (expect(res.ok).toBeDefined) expect(res.ok).toBe(true); else expect(res.ok).to.equal(true);
    const textCalls = calls.filter(c => c.name === 'fillText');
    if (expect(textCalls.length).toBeDefined) {
      expect(textCalls.length).toBe(0);
    } else {
      expect(textCalls.length).to.equal(0);
    }
  });

  it('gracefully handles extremely large canvas sizes by mutating ctx.canvas and returning summary', async () => {
    const { renderHelix } = await __getHelixMod();
    const { ctx } = createMockCanvas2D(1, 1);
    const result = renderHelix(ctx, { width: 4096, height: 2160 });
    const ok = !!(result && result.ok === true && typeof result.summary === "string");
    if (expect(ok).toBeDefined) {
      expect(ok).toBe(true);
      expect(ctx.canvas.width).toBe(4096);
      expect(ctx.canvas.height).toBe(2160);
    } else {
      expect(ok).to.equal(true);
      expect(ctx.canvas.width).to.equal(4096);
      expect(ctx.canvas.height).to.equal(2160);
    }
  });
});

describe('helpers – added edge cases', () => {
  it('toPositiveNumber returns null for Infinity and non-finite strings', async () => {
    const { toPositiveNumber } = await __getHelixMod();
    const vals = [Infinity, -Infinity, '42', 'abc'];
    const outs = vals.map(v => toPositiveNumber(v));
    for (const o of outs) {
      if (expect(o).toBeNull) expect(o).toBeNull(); else expect(o).to.equal(null);
    }
  });

  it('withAlpha handles 6-digit hex and clamps alpha at [0,1]', async () => {
    const { withAlpha } = await __getHelixMod();
    const asserter = typeof expect('').toMatch === 'function'
      ? (s, r) => expect(s).toMatch(r)
      : (s, r) => expect(s).to.match(r);

    const low = withAlpha('#AABBCC', -1);
    asserter(low, /^rgba\(\d+,\s*\d+,\s*\d+,\s*0(\.0+)?\)$/);

    const high = withAlpha('#aabbcc', 2);
    asserter(high, /^rgba\(\d+,\s*\d+,\s*\d+,\s*1(\.0+)?\)$/);

    const zero = withAlpha('#aabbcc', 0);
    const one = withAlpha('#aabbcc', 1);
    asserter(zero, /^rgba\(\d+,\s*\d+,\s*\d+,\s*0(\.0+)?\)$/);
    asserter(one, /^rgba\(\d+,\s*\d+,\s*\d+,\s*1(\.0+)?\)$/);
  });

  it('normaliseNumbers ignores NaN/negative/zero overrides', async () => {
    const { normaliseNumbers, FALLBACK_NUMBERS } = await __getHelixMod();
    const override = { THREE: NaN, SEVEN: -7, ELEVEN: 0 };
    const got = normaliseNumbers(override);
    if (expect(got.SEVEN).toBeDefined) {
      expect(got.SEVEN).toBe(FALLBACK_NUMBERS.SEVEN);
      expect(got.THREE).toBe(FALLBACK_NUMBERS.THREE);
      expect(got.ELEVEN).toBe(FALLBACK_NUMBERS.ELEVEN);
    } else {
      expect(got.SEVEN).to.equal(FALLBACK_NUMBERS.SEVEN);
      expect(got.THREE).to.equal(FALLBACK_NUMBERS.THREE);
      expect(got.ELEVEN).to.equal(FALLBACK_NUMBERS.ELEVEN);
    }
  });
});

describe('drawing – alpha clamping observable via instrumented ctx', () => {
  it('drawVesicaField clamps globalAlpha within [0,1]', async () => {
    const { drawVesicaField } = await __getHelixMod();
    const { ctx, calls } = createMockCtx({ width: 120, height: 100 });
    drawVesicaField(ctx, { width: 120, height: 100 }, '#123', { NINETYNINE: 99 }, {
      columns: 3, rows: 3, paddingDivisor: 10, radiusScale: 0.5, strokeDivisor: 50, alpha: 2
    });
    const alphas = calls.filter(c => c[0] === 'setGlobalAlpha').map(c => c[1]);
    const allClamped = alphas.every(a => typeof a === 'number' && a >= 0 && a <= 1);
    if (expect(allClamped).toBeDefined) expect(allClamped).toBe(true); else expect(allClamped).to.equal(true);
  });

  it('drawHelixLattice with minimal sampleCount yields strandPoints = sampleCount * 2', async () => {
    const { drawHelixLattice } = await __getHelixMod();
    const { ctx } = createMockCanvas2D(100, 80);
    const stats = drawHelixLattice(
      ctx,
      { width: 100, height: 80 },
      { layers: ['#0','#1','#2','#3','#4','#5'], ink: '#fff', muted: '#777' },
      { NINETYNINE: 99, THREE: 3 },
      { sampleCount: 1, cycles: 1, amplitudeDivisor: 10, strandSeparationDivisor: 10, crossTieCount: 1, strandAlpha: 0.8, rungAlpha: 0.6 }
    );
    if (expect(stats.strandPoints).toBeDefined) {
      expect(stats.strandPoints).toBe(2);
      expect(stats.crossTies).toBeGreaterThanOrEqual?.(1) ?? expect(stats.crossTies).to.be.at.least(1);
    } else {
      expect(stats.strandPoints).to.equal(2);
      expect(stats.crossTies).to.be.at.least(1);
    }
  });
});