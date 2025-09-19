import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

// Utility: load index.html from project root
function readIndexHtml() {
  const root = process.cwd();
  const candidates = [
    path.join(root, 'index.html'),
    path.join(root, 'public', 'index.html'),
    path.join(root, 'static', 'index.html')
  ];
  for (const p of candidates) {
    try {
      return { html: readFileSync(p, 'utf8'), filePath: p };
    } catch {}
  }
  throw new Error('index.html not found at repo root or common locations (index.html, public/index.html, static/index.html).');
}

// Utility: get inline module script content
function extractModuleScript(html) {
  // Simple, robust extraction of the first <script type="module">...</script>
  const scriptOpen = /<script\s+type=["']module["'][^>]*>/i;
  const scriptClose = /<\/script>/i;
  const openMatch = html.match(scriptOpen);
  if (!openMatch) throw new Error('No <script type="module"> found in index.html');
  const start = html.indexOf(openMatch[0]) + openMatch[0].length;
  const end = html.indexOf('</script>', start);
  if (end === -1) throw new Error('Closing </script> not found for module script in index.html');
  return html.slice(start, end).trim();
}

// Transform: replace ESM import with test stub, and expose internals (NUM) after declaration.
// We do not alter behavior except import replacement and exposure for tests.
function prepareExecutableSource(rawJs, { exposeInternals = true } = {}) {
  let src = rawJs;
  // Replace `import { renderHelix } from "./js/helix-renderer.mjs";` with test stub
  src = src.replace(
    /import\s*\{\s*renderHelix\s*\}\s*from\s*["']\.\/js\/helix-renderer\.mjs["'];?/,
    'const renderHelix = globalThis.__TEST__.renderHelix;'
  );
  if (exposeInternals) {
    // After the NUM declaration, export it to tests
    src = src.replace(
      /(const\s+NUM\s*=\s*Object\.freeze\([^;]+\);)/,
      '$1\n;globalThis.__TEST__ = globalThis.__TEST__ || {};\n;globalThis.__TEST__.NUM = NUM;'
    );
  }
  return src;
}

// Minimal DOM stubs
class StyleDecl {
  constructor() { this._map = new Map(); }
  setProperty(name, val) { this._map.set(name, val); }
  getPropertyValue(name) { return this._map.get(name); }
  toJSON() {
    return Array.from(this._map.entries()).reduce((o,[k,v]) => (o[k]=v, o), {});
  }
}

function makeDom({ with2DContext = true } = {}) {
  const style = new StyleDecl();
  const statusEl = { textContent: '' };

  const canvas = {
    width: 1440,
    height: 900,
    _ctx: with2DContext ? {} : null,
    getContext(kind) { return kind === '2d' ? this._ctx : null; },
  };

  const documentElement = { style };
  const document = {
    documentElement,
    getElementById(id) {
      if (id === 'status') return statusEl;
      if (id === 'stage') return canvas;
      return null;
    }
  };
  return { document, statusEl, canvas, style };
}

// Execute the (transformed) inline module script in a VM with provided stubs
async function runInlineModule({ source, stubs }) {
  const context = {
    // Provide minimal globals
    console,
    setTimeout,
    clearTimeout,
    __TEST__: {},
    ...stubs
  };
  const vmContext = vm.createContext(context, { name: 'index.html-inline-module' });
  // Run as ESM-like script in the VM; wrap in async IIFE to allow await inside without import/export.
  const wrapped = `
    (async () => {
      ${source}
    })();
  `;
  await vm.runInContext(wrapped, vmContext, { timeout: 5000 });
  return vmContext;
}

describe('index.html inline renderer module', () => {
  let html, filePath;

  beforeEach(() => {
    const res = readIndexHtml();
    html = res.html;
    filePath = res.filePath;
  });

  test('structural HTML contains expected head/meta/canvas/script elements', () => {
    assert.match(html, /<meta\s+name=["']viewport["'][^>]*>/i);
    assert.match(html, /<meta\s+name=["']color-scheme["'][^>]*>/i);
    assert.match(html, /<canvas[^>]*id=["']stage["'][^>]*width=["']?1440["']?[^>]*height=["']?900["']?[^>]*>/i);
    assert.match(html, /<script\s+type=["']module["'][^>]*>/i);
    assert.match(html, /Cosmic Helix Renderer/);
  });

  test('NUM constants are defined with canonical keys and values', async () => {
    const raw = extractModuleScript(html);
    const src = prepareExecutableSource(raw);
    const { document, statusEl } = makeDom({ with2DContext: false });

    const ctx = await runInlineModule({
      source: src,
      stubs: {
        document,
        fetch: undefined, // not used here
        // renderHelix stub not exercised in this test
        __TEST__: {}
      }
    });

    const NUM = ctx.__TEST__.NUM;
    assert.ok(NUM, 'NUM should be exposed');
    const expected = {
      THREE: 3, SEVEN: 7, NINE: 9, ELEVEN: 11,
      TWENTYTWO: 22, THIRTYTHREE: 33, NINETYNINE: 99, ONEFORTYFOUR: 144
    };
    assert.deepEqual(NUM, expected);
  });

  test('Fallback palette path applies CSS variables and updates status when fetch fails', async () => {
    const raw = extractModuleScript(html);
    const src = prepareExecutableSource(raw);
    const { document, statusEl, style } = makeDom({ with2DContext: true });

    // fetch stub: simulate missing palette (no data / !ok)
    async function fetchStub(url, opts) {
      return { ok: false, json: async () => ({}) };
    }

    // renderHelix stub: simulate successful render summary
    function renderHelixStub(ctx, opts) {
      return { ok: true, summary: 'Rendered calm layers: 4' };
    }

    await runInlineModule({
      source: src,
      stubs: {
        document,
        fetch: fetchStub,
        __TEST__: { renderHelix: renderHelixStub }
      }
    });

    // CSS variables applied (fallback palette bg/ink/muted)
    const styleMap = style.toJSON();
    assert.equal(styleMap['--bg'], '#0b0b12');
    assert.equal(styleMap['--ink'], '#e8e8f0');
    assert.equal(styleMap['--muted'], '#a6a6c1' /* muted || ink */);

    // Status uses fallback prefix
    assert.match(statusEl.textContent, /^Fallback palette active\./);
    assert.match(statusEl.textContent, /Rendered calm layers: 4/);
  });

  test('Loaded palette path uses palette values and shows "Palette loaded."', async () => {
    const raw = extractModuleScript(html);
    const src = prepareExecutableSource(raw);
    const { document, statusEl, style } = makeDom({ with2DContext: true });

    // Custom palette returned by fetch
    const palettePayload = {
      palette: {
        bg: '#101015',
        ink: '#ffffff',
        muted: '#cccccc',
        layers: ['#111', '#222', '#333']
      }
    };

    async function fetchStub(url, opts) {
      return {
        ok: true,
        async json() { return palettePayload; }
      };
    }

    function renderHelixStub(ctx, opts) {
      // Validate that palette passed through to renderer
      assert.deepEqual(opts.palette, palettePayload);
      return { ok: true, summary: 'All good' };
    }

    await runInlineModule({
      source: src,
      stubs: {
        document,
        fetch: fetchStub,
        __TEST__: { renderHelix: renderHelixStub }
      }
    });

    const styleMap = style.toJSON();
    assert.equal(styleMap['--bg'], '#101015');
    assert.equal(styleMap['--ink'], '#ffffff');
    assert.equal(styleMap['--muted'], '#cccccc');

    assert.match(statusEl.textContent, /^Palette loaded\./);
    assert.match(statusEl.textContent, /All good$/);
  });

  test('When Canvas 2D context is unavailable, status shows informative message and does not call renderer', async () => {
    const raw = extractModuleScript(html);
    const src = prepareExecutableSource(raw);
    const { document, statusEl } = makeDom({ with2DContext: false });

    let called = 0;
    function renderHelixStub() { called += 1; return { ok: true, summary: 'should not be called' }; }

    await runInlineModule({
      source: src,
      stubs: {
        document,
        // fetch irrelevant, but provide a no-op to avoid accidental use
        fetch: async () => { throw new Error('should not fetch when no context'); },
        __TEST__: { renderHelix: renderHelixStub }
      }
    });

    assert.equal(called, 0, 'renderHelix must not be called without 2D context');
    assert.equal(
      statusEl.textContent,
      'Canvas 2D context unavailable in this browser.'
    );
  });

  test('loadPalette returns null gracefully when global fetch is not a function', async () => {
    // Extract just the loadPalette function by executing with fetch undefined and exposing functions
    const raw = extractModuleScript(html);
    // Expose internals; the function loadPalette is referenced inside the module; we invoke by evaluating a wrapper
    // Since the module references loadPalette inside an IIFE, we simulate an environment where getContext returns null
    // so that only the early branch executes (no IIFE execution after that branch for palette).
    const src = prepareExecutableSource(raw) + '\n;globalThis.__TEST__.exports = { /* no direct function refs */ };';

    const { document } = makeDom({ with2DContext: false });

    // We will re-extract the function source via regex and run it independently for a pure unit test
    const loadMatch = raw.match(/async\s+function\s+loadPalette\s*\([^)]*\)\s*\{[\s\S]*?\n\s*\}/);
    assert.ok(loadMatch, 'Could not locate loadPalette function in inline script.');
    const loadFnSrc = '(' + loadMatch[0] + ')';

    const ctx = vm.createContext({ console, document });
    const loadPalette = vm.runInContext(loadFnSrc, ctx);
    const result = await loadPalette('./data/palette.json');
    assert.equal(result, null);
  });
});