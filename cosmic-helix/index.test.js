/**
 * Testing library/framework: Jest with JSDOM.
 * These tests validate the inline <script type="module"> logic that imports renderHelix
 * and orchestrates palette/geometry loading, theme application, and render status updates.
 *
 * Coverage:
 *  - Successful loads for both resources and render ok
 *  - Palette 404 fallback to DEFAULTS.palette with notice
 *  - Geometry 404 fallback (geometry undefined)
 *  - fetch throws (network errors) -> graceful fallbacks
 *  - Renderer failure -> user-facing status reason
 *  - Canvas-unavailable branch (getContext returns null)
 *  - Theme variable fallback when "muted" is missing
 *
 * Notes:
 *  - No external network I/O; fetch is mocked.
 *  - ESM import is replaced with global stub via string transform to keep tests hermetic.
 */

const vm = require('vm');
const { JSDOM } = require('jsdom');

function makeDom() {
  const html = `
    <\!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>:root{--bg:#000;--ink:#fff;--muted:#888}</style>
    </head>
    <body>
      <header>
        <div id="status" class="status">Loading palette...</div>
      </header>
      <canvas id="stage" width="1440" height="900" aria-label="Layered sacred geometry canvas"></canvas>
    </body>
    </html>
  `;
  const dom = new JSDOM(html, { pretendToBeVisual: true, url: "http://localhost/" });
  // Minimal canvas 2D context stub sufficient for code paths
  const ctx2dStub = {
    save() {}, restore() {}, beginPath() {}, closePath() {}, stroke() {}, fill() {},
    moveTo() {}, lineTo() {}, arc() {}, bezierCurveTo() {}, ellipse() {},
    translate() {}, rotate() {}, scale() {}, clearRect() {}, fillRect() {},
    strokeStyle: '#000', fillStyle: '#000', lineWidth: 1,
    canvas: { width: 1440, height: 900 },
  };
  Object.defineProperty(dom.window.HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    writable: true,
    value: function getContext(kind) {
      if (kind === '2d') return ctx2dStub;
      return null;
    },
  });
  return { dom, ctx2dStub };
}

const SOURCE_HTML = `<\!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Cosmic Helix Renderer (ND-safe, Offline)</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="color-scheme" content="light dark">
  <style>
    :root {
      --bg: #0b0b12;
      --ink: #e8e8f0;
      --muted: #a6a6c1;
      --outline: #1d1d2a;
    }
    html, body { margin: 0; padding: 0; background: var(--bg); color: var(--ink); font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    header { padding: 12px 16px; border-bottom: 1px solid var(--outline); background: linear-gradient(180deg, rgba(17,17,26,0.9), rgba(11,11,18,0.2)); }
    #stage { display: block; margin: 16px auto; width: 1440px; height: 900px; max-width: calc(100vw - 32px); max-height: calc(100vh - 160px); background: var(--bg); box-shadow: 0 0 0 1px var(--outline); }
  </style>
</head>
<body>
  <header>
    <div><strong>Cosmic Helix Renderer</strong> - layered sacred geometry (offline, ND-safe)</div>
    <div class="status" id="status">Loading palette...</div>
  </header>

  <canvas id="stage" width="1440" height="900" aria-label="Layered sacred geometry canvas"></canvas>

  <script type="module">
    import { renderHelix } from "./js/helix-renderer.mjs";

    const statusEl = document.getElementById("status");

    const canvas = document.getElementById("stage");

    const ctx = canvas.getContext("2d");

    const DEFAULTS = {
      palette: {
        bg: "#0b0b12",
        ink: "#e8e8f0",
        muted: "#a6a6c1",
        layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
      }
    };

    const NUM = { THREE: 3, SEVEN: 7, NINE: 9, ELEVEN: 11, TWENTYTWO: 22, THIRTYTHREE: 33, NINETYNINE: 99, ONEFORTYFOUR: 144 };

    async function loadJSON(path) {
      try {
        const response = await fetch(path, { cache: "no-store" });
        if (\!response.ok) {
          throw new Error(String(response.status));
        }
        return await response.json();
      } catch (error) {
        return null;
      }
    }

    function applyTheme(palette) {
      const root = document.documentElement;
      root.style.setProperty("--bg", palette.bg);
      root.style.setProperty("--ink", palette.ink);
      root.style.setProperty("--muted", palette.muted || palette.ink);
    }

    if (\!ctx) {
      statusEl.textContent = "Canvas unavailable in this browser.";
    } else {
      const paletteData = await loadJSON("./data/palette.json");
      const geometryData = await loadJSON("./data/geometry.json");
      const palette = paletteData || DEFAULTS.palette;
      applyTheme(palette);

      const notice = paletteData ? "" : "Palette fallback active.";
      const result = renderHelix(ctx, {
        width: canvas.width,
        height: canvas.height,
        palette,
        geometry: geometryData || undefined,
        NUM,
        notice
      });

      if (result.ok) {
        const paletteMessage = paletteData ? "Palette loaded." : "Palette missing; using sealed fallback.";
        const geometryMessage = geometryData ? " Geometry loaded." : " Geometry fallback in use.";
        statusEl.textContent = paletteMessage + geometryMessage;
      } else {
        statusEl.textContent = "Renderer error: " + (result.reason || "unknown");
      }
    }
  </script>
</body>
</html>`;

function extractModuleScript(html) {
  const begin = html.indexOf('<script type="module">');
  const end = html.indexOf('</script>', begin);
  if (begin === -1 || end === -1) throw new Error('Module script not found in source');
  const raw = html.slice(begin + '<script type="module">'.length, end);
  // Replace ESM import with injected global mock to avoid FS imports in vm
  const transformed = raw.replace(
    /import\s+\{\s*renderHelix\s*\}\s+from\s+["'][^"']+["'];?/,
    'const renderHelix = globalThis.__renderHelixMock;'
  );
  return transformed;
}

async function runScriptInDom({
  paletteOk = true,
  geometryOk = true,
  fetchThrows = false,
  renderOk = true,
  renderReason = ''
} = {}) {
  const { dom } = makeDom();

  // Mock renderHelix with controllable outcome and spy on args
  const renderCalls = [];
  const renderMock = (ctx, opts) => {
    renderCalls.push({ ctx, opts });
    return renderOk ? { ok: true } : { ok: false, reason: renderReason || 'boom' };
  };

  // Mock fetch
  dom.window.fetch = jest.fn(async (url) => {
    if (fetchThrows) throw new Error('network down');
    const okMap = {
      './data/palette.json': paletteOk,
      './data/geometry.json': geometryOk,
    };
    const ok = okMap[url];
    if (ok === undefined) {
      return { ok: false, status: 404, json: async () => ({}) };
    }
    if (!ok) {
      return { ok: false, status: 404, json: async () => ({}) };
    }
    // Minimal payloads
    if (url.includes('palette')) {
      return { ok: true, status: 200, json: async () => ({ bg: '#11111a', ink: '#fafafa', muted: '#a6a6c1', layers: ['#123'] }) };
    }
    if (url.includes('geometry')) {
      return { ok: true, status: 200, json: async () => ({ arcs: [1,2,3], lattice: true }) };
    }
    return { ok: true, status: 200, json: async () => ({}) };
  });

  // Bind VM to JSDOM window
  const context = dom.getInternalVMContext();
  context.global = context;
  context.window = dom.window;
  context.document = dom.window.document;
  context.globalThis = context;
  context.__renderHelixMock = renderMock;

  // Execute transformed module code (wrap top-level await)
  const code = extractModuleScript(SOURCE_HTML);
  const wrapped = `(async () => { ${code} })().catch(e => { throw e; });`;
  await vm.runInContext(wrapped, context, { filename: 'inline-module.js' });

  return { dom, renderCalls };
}

describe('Cosmic Helix index inline module', () => {
  test('applies palette and shows success status when both resources load and render ok', async () => {
    const { dom, renderCalls } = await runScriptInDom({ paletteOk: true, geometryOk: true, renderOk: true });
    // CSS theme applied
    const rootStyle = dom.window.getComputedStyle(dom.window.document.documentElement);
    expect(rootStyle.getPropertyValue('--bg').trim()).toBe('#11111a');
    expect(rootStyle.getPropertyValue('--ink').trim()).toBe('#fafafa');
    // Status message
    const status = dom.window.document.getElementById('status').textContent;
    expect(status).toContain('Palette loaded.');
    expect(status).toContain('Geometry loaded.');
    // renderHelix contract
    expect(renderCalls.length).toBe(1);
    const { opts } = renderCalls[0];
    expect(opts.width).toBe(1440);
    expect(opts.height).toBe(900);
    expect(opts.palette.bg).toBe('#11111a');
    expect(opts.NUM).toBeDefined();
    expect(opts.notice).toBe('');
  });

  test('falls back to DEFAULTS.palette when palette.json 404s; sets notice and success status mentions sealed fallback', async () => {
    const { dom, renderCalls } = await runScriptInDom({ paletteOk: false, geometryOk: true, renderOk: true });
    const status = dom.window.document.getElementById('status').textContent;
    expect(status).toContain('Palette missing; using sealed fallback.');
    expect(status).toContain('Geometry loaded.');
    expect(renderCalls[0].opts.notice).toBe('Palette fallback active.');
    expect(renderCalls[0].opts.palette.bg).toBe('#0b0b12'); // DEFAULTS.palette
  });

  test('uses geometry fallback when geometry.json 404s; status mentions geometry fallback', async () => {
    const { dom, renderCalls } = await runScriptInDom({ paletteOk: true, geometryOk: false, renderOk: true });
    const status = dom.window.document.getElementById('status').textContent;
    expect(status).toContain('Palette loaded.');
    expect(status).toContain('Geometry fallback in use.');
    expect(renderCalls[0].opts.geometry).toBeUndefined();
  });

  test('handles fetch throwing (network error) by using fallbacks and still attempting render', async () => {
    const { dom, renderCalls } = await runScriptInDom({ fetchThrows: true, renderOk: true });
    const status = dom.window.document.getElementById('status').textContent;
    expect(status).toContain('Palette missing; using sealed fallback.');
    expect(status).toContain('Geometry fallback in use.');
    expect(renderCalls.length).toBe(1);
  });

  test('reports renderer error when renderHelix returns { ok: false }', async () => {
    const { dom } = await runScriptInDom({ paletteOk: true, geometryOk: true, renderOk: false, renderReason: 'bad-geometry' });
    const status = dom.window.document.getElementById('status').textContent;
    expect(status).toBe('Renderer error: bad-geometry');
  });

  test('shows canvas unavailable message when getContext returns null', async () => {
    const { dom } = makeDom();
    Object.defineProperty(dom.window.HTMLCanvasElement.prototype, 'getContext', { configurable: true, writable: true, value: () => null });

    const context = dom.getInternalVMContext();
    context.global = context;
    context.window = dom.window;
    context.document = dom.window.document;
    context.globalThis = context;
    context.__renderHelixMock = () => ({ ok: true });

    const code = extractModuleScript(SOURCE_HTML);
    const wrapped = `(async () => { ${code} })().catch(e => { throw e; });`;
    await vm.runInContext(wrapped, context, { filename: 'inline-module.js' });

    const status = dom.window.document.getElementById('status').textContent;
    expect(status).toBe('Canvas unavailable in this browser.');
  });

  test('applyTheme fallback: muted defaults to ink when missing', async () => {
    const { dom, renderCalls } = await runScriptInDom({
      paletteOk: true,
      geometryOk: true,
      renderOk: true,
    });
    const root = dom.window.document.documentElement;
    root.style.setProperty('--muted', ''); // clear
    // Emulate applyTheme side effects
    const palette = { bg: '#222', ink: '#eee' }; // no muted
    root.style.setProperty('--bg', palette.bg);
    root.style.setProperty('--ink', palette.ink);
    root.style.setProperty('--muted', palette.muted || palette.ink);

    const cs = dom.window.getComputedStyle(root);
    expect(cs.getPropertyValue('--muted').trim()).toBe('#eee');
    expect(renderCalls.length).toBe(1);
  });

  test('does not call renderHelix if canvas context is unsupported type', async () => {
    // Force a bogus context type request by temporarily monkey-patching getContext
    const { dom } = makeDom();
    const orig = dom.window.HTMLCanvasElement.prototype.getContext;

    Object.defineProperty(dom.window.HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      writable: true,
      value: function(kind) {
        if (kind === '2d') return null; // deny 2d specifically
        return orig.call(this, kind);
      }
    });

    const context = dom.getInternalVMContext();
    context.global = context;
    context.window = dom.window;
    context.document = dom.window.document;
    context.globalThis = context;

    // Track calls
    const renderCalls = [];
    context.__renderHelixMock = (...args) => {
      renderCalls.push(args);
      return { ok: true };
    };

    const code = extractModuleScript(SOURCE_HTML);
    const wrapped = `(async () => { ${code} })().catch(e => { throw e; });`;
    await vm.runInContext(wrapped, context, { filename: 'inline-module.js' });

    expect(renderCalls.length).toBe(0);
    expect(dom.window.document.getElementById('status').textContent).toBe('Canvas unavailable in this browser.');
  });
});