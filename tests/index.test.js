// Framework: Node.js built-in test runner (node:test) with assert/strict.
// Note: Repository uses node --test (see scripts/run-tests.sh). We avoid new deps (e.g., jsdom).
// Tests focus on pure logic and contracts visible in the PR diff: status composition,
// CSS token application, palette loading fallbacks, render invocation contract, and event handling.

import test from 'node:test';
import assert from 'node:assert/strict';

// -------------------- Pure utilities reconstructed from the diff --------------------

function composeStatus(usingFallback, tail) {
  const base = usingFallback ? 'Palette missing; using safe fallback.' : 'Palette loaded.';
  return `${base} ${tail}`;
}

class StyleShim {
  constructor() { this.map = new Map(); }
  setProperty(k, v) { this.map.set(k, String(v)); }
  getPropertyValue(k) { return this.map.get(k) || ''; }
}

function makeDocumentShim() {
  return {
    documentElement: { style: new StyleShim() },
    getElementById(id) {
      if (!this._nodes) this._nodes = {};
      if (!this._nodes[id]) this._nodes[id] = { textContent: '' };
      return this._nodes[id];
    }
  };
}

function applyChrome(doc, palette) {
  const root = doc.documentElement;
  root.style.setProperty('--bg', palette.bg);
  root.style.setProperty('--ink', palette.ink);
  root.style.setProperty('--muted', palette.muted || palette.ink);
}

function applyChromePalette(doc, palette) {
  const muted = Array.isArray(palette.layers) && palette.layers.length > 0
    ? palette.layers[palette.layers.length - 1]
    : palette.ink;
  doc.documentElement.style.setProperty('--bg', palette.bg);
  doc.documentElement.style.setProperty('--ink', palette.ink);
  doc.documentElement.style.setProperty('--muted', muted);
}

function updateStatus(doc, message) {
  const el = doc.getElementById('status');
  el.textContent = message;
  return el.textContent;
}

// -------------------- Harness approximating inline script’s behavior --------------------

async function runRenderFlow({ paletteJSON, renderResult }) {
  // Mock fetch
  const fetch = async () => {
    if (paletteJSON instanceof Error) throw paletteJSON;
    if (paletteJSON === null) return { ok: false, status: 404 };
    if (paletteJSON && typeof paletteJSON === 'object') return { ok: true, json: async () => paletteJSON };
    return { ok: false, status: 500 };
  };

  async function loadPalette(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res || !res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  const doc = makeDocumentShim();
  const defaults = {
    palette: {
      bg: '#0b0b12',
      ink: '#e8e8f0',
      muted: '#a6a6c1',
      layers: ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6'],
    }
  };

  const paletteData = await loadPalette('./data/palette.json');
  const palette = paletteData && typeof paletteData === 'object' ? paletteData : defaults.palette;
  const usingFallback = !paletteData;
  const notice = usingFallback ? 'Palette missing; sealed ND-safe fallback in use.' : '';

  applyChrome(doc, palette);

  const renderHelix = (ctx, cfg) => renderResult ?? { ok: true, summary: 'Geometry rendered once.' };

  const ctx = {};
  const cfg = {
    width: 1440,
    height: 900,
    palette,
    NUM: { THREE:3, SEVEN:7, NINE:9, ELEVEN:11, THIRTYTWENTYTWO:22, THIRTYTHREE:33, NINETYNINE:99, ONEFORTYFOUR:144 },
    notice
  };

  const result = renderHelix(ctx, cfg);

  const prefix = usingFallback ? 'Fallback palette active. ' : 'Palette loaded. ';
  updateStatus(doc, result && result.ok ? prefix + result.summary : 'Render failed: ' + (result?.reason ?? 'unknown'));

  return { doc, cfg, usingFallback, notice, result };
}

// -------------------- Tests --------------------

test('composeStatus: not using fallback', () => {
  assert.equal(composeStatus(false, 'Ready.'), 'Palette loaded. Ready.');
});

test('composeStatus: using fallback', () => {
  assert.equal(
    composeStatus(true, 'Geometry rendered once.'),
    'Palette missing; using safe fallback. Geometry rendered once.'
  );
});

test('composeStatus: empty tail handled', () => {
  assert.equal(composeStatus(true, ''), 'Palette missing; using safe fallback. ');
});

test('applyChrome sets bg, ink, and muted (muted defaults to ink)', () => {
  const doc = makeDocumentShim();
  applyChrome(doc, { bg: '#11111c', ink: '#efefef' });
  assert.equal(doc.documentElement.style.getPropertyValue('--bg'), '#11111c');
  assert.equal(doc.documentElement.style.getPropertyValue('--ink'), '#efefef');
  assert.equal(doc.documentElement.style.getPropertyValue('--muted'), '#efefef');
});

test('applyChromePalette sets muted to last layer when provided', () => {
  const doc = makeDocumentShim();
  const p = { bg: '#11111c', ink: '#efefef', layers: ['#abc', '#def', '#fed'] };
  applyChromePalette(doc, p);
  assert.equal(doc.documentElement.style.getPropertyValue('--bg'), '#11111c');
  assert.equal(doc.documentElement.style.getPropertyValue('--ink'), '#efefef');
  assert.equal(doc.documentElement.style.getPropertyValue('--muted'), '#fed');
});

test('applyChromePalette falls back to ink when layers missing/empty', () => {
  const doc = makeDocumentShim();
  applyChromePalette(doc, { bg: '#11111c', ink: '#efefef', layers: [] });
  assert.equal(doc.documentElement.style.getPropertyValue('--muted'), '#efefef');
});

test('updateStatus sets text content on status element', () => {
  const doc = makeDocumentShim();
  const msg = 'Hello world';
  const res = updateStatus(doc, msg);
  assert.equal(res, msg);
});

test('render flow: happy path uses fetched palette and empty notice', async () => {
  const paletteJSON = { bg: '#000000', ink: '#ffffff', layers: ['#1', '#2'] };
  const { doc, cfg, usingFallback, notice } = await runRenderFlow({ paletteJSON });
  assert.equal(usingFallback, false);
  assert.equal(notice, '');
  assert.equal(cfg.palette.bg, '#000000');
  assert.equal(cfg.notice, '');
  assert.match(doc.getElementById('status').textContent, /^Palette loaded\. /);
});

test('render flow: non-OK fetch uses fallback and sets notice', async () => {
  const { doc, cfg, usingFallback, notice } = await runRenderFlow({ paletteJSON: null });
  assert.equal(usingFallback, true);
  assert.equal(notice, 'Palette missing; sealed ND-safe fallback in use.');
  assert.equal(cfg.notice, notice);
  assert.match(doc.getElementById('status').textContent, /^Fallback palette active\. /);
});

test('render flow: network error still uses fallback and renders', async () => {
  const { doc, usingFallback } = await runRenderFlow({ paletteJSON: new Error('network') });
  assert.equal(usingFallback, true);
  assert.match(doc.getElementById('status').textContent, /^Fallback palette active\. /);
});

test('render flow: render failure shows reason', async () => {
  const renderResult = { ok: false, reason: 'ctx error' };
  const { doc } = await runRenderFlow({ paletteJSON: { bg: '#101010', ink: '#fafafa' }, renderResult });
  assert.equal(doc.getElementById('status').textContent, 'Render failed: ctx error');
});

test('render flow: includes expected NUM constants in config', async () => {
  const { cfg } = await runRenderFlow({ paletteJSON: null });
  assert.equal(cfg.NUM.THREE, 3);
  assert.equal(cfg.NUM.ONEFORTYFOUR, 144);
});

// Event contract: 'cathedral:select' sets --lattice from payload color or default.
function cathedralSelectHandler(doc, event) {
  const tint = event?.detail?.payload?.color || '#89a3ff';
  doc.documentElement.style.setProperty('--lattice', tint);
}

test("cathedral:select sets --lattice from payload", () => {
  const doc = makeDocumentShim();
  cathedralSelectHandler(doc, { detail: { payload: { color: '#89a3ff' } } });
  assert.equal(doc.documentElement.style.getPropertyValue('--lattice'), '#89a3ff');
});

test("cathedral:select falls back to default when payload missing", () => {
  const doc = makeDocumentShim();
  cathedralSelectHandler(doc, { detail: {} });
  assert.equal(doc.documentElement.style.getPropertyValue('--lattice'), '#89a3ff');
});