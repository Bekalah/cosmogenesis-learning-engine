/* 
Test framework note:
- This repository appears to use a Node-based test runner. These tests are written to be compatible with Jest in ESM mode using the JSDOM environment.
- If using Vitest, they are also compatible with minor adjustments (describe/it/expect are identical).
- No new dependencies are introduced; tests rely on the runner's built-in globals.

Focus: index.html inline module script logic from the PR diff.
*/

const fs = await import('fs/promises');
const path = await import('path');
const { JSDOM } = await import('jsdom').catch(() => ({ JSDOM: null }));

// Minimal assert/expect shim: prefer Jest/Vitest expect if present; else fallback to Node's assert.
let expect;
try {
  ({ expect } = await import('@jest/globals'));
} catch {
  const assert = (await import('node:assert/strict')).default;
  expect = (value) => ({
    toBe: (v) => assert.strictEqual(value, v),
    toEqual: (v) => assert.deepEqual(value, v),
    toBeNull: () => assert.strictEqual(value, null),
    toBeDefined: () => assert.notStrictEqual(value, undefined),
    toContain: (substr) => {
      if (typeof value !== 'string' || !value.includes(substr)) {
        throw new Error(`Expected string "${value}" to contain "${substr}"`);
      }
    },
    toBeUndefined: () => {
      if (value !== undefined) throw new Error(`Expected undefined, got ${value}`);
    },
    toBeTruthy: () => {
      if (!value) throw new Error(`Expected truthy, got ${value}`);
    },
    toBeFalsy: () => {
      if (!value) throw new Error(`Expected falsy, got ${value}`);
    },
  });
}

// Simple BDD wrappers if not using Jest/Vitest
const hasJest = typeof globalThis.describe === 'function' && typeof globalThis.it === 'function';
const tDescribe = hasJest ? globalThis.describe : (name, fn) => fn();
const tIt = hasJest ? globalThis.it : (name, fn) => fn();
const tBeforeEach = hasJest && globalThis.beforeEach ? globalThis.beforeEach : (fn) => { /* no-op */ };
const tAfterEach = hasJest && globalThis.afterEach ? globalThis.afterEach : (fn) => { /* no-op */ };

// Utility to prepare DOM from the real index.html and run its (modified) inline module in a sandboxed window.
async function loadAndRunIndex({ fetchImpl, canvasCtx, renderOk = true, renderReason = '', paletteJSON, geometryJSON }) {
  if (!JSDOM) {
    throw new Error('JSDOM is required by these tests. Ensure the test runner uses the jsdom environment (e.g., Jest testEnvironment: "jsdom").');
  }

  const repoRoot = process.cwd();
  const indexPathCandidates = [
    'index.html',
    'cosmic-helix/index.html',
    'public/index.html',
    'cosmic-helix/public/index.html',
  ].map((p) => path.join(repoRoot, p));
  let indexPath = null;
  for (const p of indexPathCandidates) {
    try {
      await fs.access(p);
      indexPath = p;
      break;
    } catch {}
  }
  if (!indexPath) {
    throw new Error('Could not locate index.html containing the Cosmic Helix Renderer. If the path differs, update candidates in the test helper.');
  }

  const html = await fs.readFile(indexPath, 'utf8');

  // Extract the inline <script type="module"> content
  const scriptStart = html.indexOf('<script type="module">');
  const scriptEnd = html.indexOf('</script>', scriptStart + 1);
  if (scriptStart === -1 || scriptEnd === -1) {
    throw new Error('index.html missing inline <script type="module"> block expected by tests.');
  }
  const scriptContent = html
    .slice(scriptStart + '<script type="module">'.length, scriptEnd)
    .trim();

  // Replace the ESM import with a global stub wired from test
  const replacedImport = scriptContent.replace(
    /^\s*import\s+\{\s*renderHelix\s*\}\s+from\s+["']\.\/js\/helix-renderer\.mjs["'];?/m,
    'const renderHelix = globalThis.__renderHelixMock;'
  );

  // Expose helpers & wrap top-level await into async function
  const wrapped = `
    (async function __runIndexModule(){
      ${replacedImport}
      // After definitions, export helpers to global for direct unit tests
      const __exports = {};
      const __set = (k,v)=> __exports[k]=v;

      // Monkeypatch document.getElementById to use existing DOM
      // (JSDOM will provide document/window)

      // Begin original code
      ${''}
      // Inject after function declarations to capture them:
      // We'll do this by redefining Object.defineProperty on globalThis to collect names, but simpler: explicitly assign after we define them.

      // To insert export captures, we hook after function & const declarations using markers.
    }).call(window);
  `;

  // To capture helper declarations without complex parsing, we append code to expose them after execution:
  const exposeAppendix = `
    ;(function(){
      try {
        if (typeof loadJSON === 'function') globalThis.__exports_loadJSON = loadJSON;
        if (typeof applyTheme === 'function') globalThis.__exports_applyTheme = applyTheme;
        if (typeof DEFAULTS !== 'undefined') globalThis.__exports_DEFAULTS = DEFAULTS;
        if (typeof NUM !== 'undefined') globalThis.__exports_NUM = NUM;
      } catch {}
    })();
  `;

  // Build executable string: inject exposure appendix just before the tail where logic begins to use them.
  // We will place appendix at the very end of module before any execution that relies on them has side effects – but since the script runs top-level,
  // we instead will evaluate in two phases: (1) define helpers; (2) run main. To avoid brittle parsing, we transform the control flow:
  // - We replace the "if (!ctx) { ... } else { ... }" block to be inside a function __main() that we call explicitly after setting up mocks and globals.

  // Transform main block to callable function:
  let transformed = replacedImport;

  // 1) Wrap everything after const ctx = ... up to end of script into an async function __main()
  // We'll locate "const ctx = canvas.getContext("2d");" line and wrap the subsequent code.
  const ctxLineRe = /const\s+ctx\s*=\s*canvas\.getContext\("2d"\);\s*/m;
  const match = transformed.match(ctxLineRe);
  if (!match) {
    throw new Error('Unable to locate canvas.getContext("2d") line in script.');
  }
  const idxAfterCtx = match.index + match[0].length;
  const before = transformed.slice(0, idxAfterCtx);
  const after = transformed.slice(idxAfterCtx);

  transformed = `
    ${before}
    async function __main(){
      ${after}
    }
    // Expose helpers:
    ${exposeAppendix}
  `;

  // 2) Establish a DOM with required elements and CSS variables
  const dom = new JSDOM(html, {
    url: 'http://localhost/',
    runScripts: 'outside-only',
    resources: 'usable',
    pretendToBeVisual: true,
  });

  const { window } = dom;
  const { document } = window;

  // Mock fetch with the provided behavior
  window.fetch = async (url, opts) => {
    if (typeof fetchImpl === 'function') {
      return await fetchImpl(url, opts);
    }
    // Default behavior: serve palette and geometry based on provided JSON
    const toResp = (obj, ok = true, status = 200) => ({
      ok,
      status,
      async json() {
        if (obj === '__INVALID_JSON__') {
          throw new Error('Invalid JSON');
        }
        return obj;
      },
    });

    if (String(url).includes('palette.json')) {
      if (paletteJSON === '__404__') return toResp(null, false, 404);
      if (paletteJSON === '__THROW__') throw new Error('Network error');
      if (paletteJSON === '__INVALID__') return toResp('__INVALID_JSON__', true, 200);
      return toResp(paletteJSON ?? null, paletteJSON != null, paletteJSON != null ? 200 : 404);
    }
    if (String(url).includes('geometry.json')) {
      if (geometryJSON === '__404__') return toResp(null, false, 404);
      if (geometryJSON === '__THROW__') throw new Error('Network error');
      if (geometryJSON === '__INVALID__') return toResp('__INVALID_JSON__', true, 200);
      return toResp(geometryJSON ?? null, geometryJSON != null, geometryJSON != null ? 200 : 404);
    }
    return toResp(null, false, 404);
  };

  // Provide a mock renderHelix that captures args and returns configured result
  const calls = [];
  window.__renderHelixMock = function(ctx, opts) {
    calls.push({ ctxPresent: !!ctx, opts });
    return renderOk ? { ok: true } : { ok: false, reason: renderReason || 'boom' };
  };

  // Stub canvas.getContext as requested
  const canvas = document.getElementById('stage');
  if (!canvas) throw new Error('index.html missing #stage canvas');
  canvas.getContext = () => canvasCtx || null;

  // Evaluate helper declarations and __main function in the JSDOM window
  window.eval(transformed);

  // Return handles for assertions; caller must invoke __main explicitly to run rendering phase
  return {
    window,
    document,
    calls,
    runMain: async () => {
      if (typeof window.__main !== 'function') {
        // __main is not globally exported by name; however, it's defined in the transformed scope.
        // Evaluate a call if available:
        try {
          await window.eval(`__main();`);
        } catch (e) {
          throw e;
        }
      } else {
        await window.__main();
      }
      return { calls, statusText: document.getElementById('status')?.textContent || '' };
    },
    helpers: {
      loadJSON: window.__exports_loadJSON,
      applyTheme: window.__exports_applyTheme,
      DEFAULTS: window.__exports_DEFAULTS,
      NUM: window.__exports_NUM,
    },
  };
}

tDescribe('Cosmic Helix index.html module', () => {
  tIt('exposes DEFAULTS and NUM with expected structure', async () => {
    const h = await loadAndRunIndex({});
    expect(typeof h.helpers.DEFAULTS).toBe('object');
    expect(typeof h.helpers.NUM).toBe('object');
    // Spot-check NUM values from diff
    expect(h.helpers.NUM.THREE).toBe(3);
    expect(h.helpers.NUM.SEVEN).toBe(7);
    expect(h.helpers.NUM.NINETYNINE).toBe(99);
    expect(h.helpers.NUM.ONEFORTYFOUR).toBe(144);
  });

  tIt('applyTheme sets CSS vars and falls back for muted', async () => {
    const { document, helpers } = await loadAndRunIndex({});
    const rootStyle = document.documentElement.style;

    // With muted provided
    helpers.applyTheme({ bg: '#111', ink: '#eee', muted: '#abc' });
    expect(rootStyle.getPropertyValue('--bg').trim()).toBe('#111');
    expect(rootStyle.getPropertyValue('--ink').trim()).toBe('#eee');
    expect(rootStyle.getPropertyValue('--muted').trim()).toBe('#abc');

    // Without muted -> fallback to ink
    helpers.applyTheme({ bg: '#222', ink: '#ddd' });
    expect(rootStyle.getPropertyValue('--bg').trim()).toBe('#222');
    expect(rootStyle.getPropertyValue('--ink').trim()).toBe('#ddd');
    expect(rootStyle.getPropertyValue('--muted').trim()).toBe('#ddd');
  });

  tIt('loadJSON returns JSON on 200/ok', async () => {
    const { helpers } = await loadAndRunIndex({
      fetchImpl: async () => ({
        ok: true,
        status: 200,
        async json() { return { a: 1 }; },
      }),
    });
    const data = await helpers.loadJSON('/anything.json');
    expect(data).toEqual({ a: 1 });
  });

  tIt('loadJSON returns null on non-OK status and on thrown error', async () => {
    // non-OK
    const h1 = await loadAndRunIndex({
      fetchImpl: async () => ({ ok: false, status: 404, async json(){ return {}; } }),
    });
    const d1 = await h1.helpers.loadJSON('/404.json');
    expect(d1).toBeNull();

    // thrown
    const h2 = await loadAndRunIndex({
      fetchImpl: async () => { throw new Error('network'); },
    });
    const d2 = await h2.helpers.loadJSON('/boom.json');
    expect(d2).toBeNull();
  });

  tIt('loadJSON returns null when response.json() throws (invalid JSON)', async () => {
    const h = await loadAndRunIndex({
      fetchImpl: async () => ({
        ok: true, status: 200,
        async json(){ throw new Error('bad json'); }
      }),
    });
    const d = await h.helpers.loadJSON('/invalid.json');
    expect(d).toBeNull();
  });

  tIt('when canvas context is unavailable, shows browser warning', async () => {
    const { document, runMain } = await loadAndRunIndex({ canvasCtx: null });
    const { statusText } = await runMain();
    expect(statusText).toBe('Canvas unavailable in this browser.');
  });

  tIt('happy path: palette and geometry loaded; status reflects both', async () => {
    const paletteJSON = { bg: '#000', ink: '#fff', muted: '#999', layers: ['#123'] };
    const geometryJSON = { nodes: [1,2,3] };
    const { document, calls, runMain } = await loadAndRunIndex({
      canvasCtx: {}, renderOk: true, paletteJSON, geometryJSON
    });
    const { statusText } = await runMain();

    expect(calls.length).toBe(1);
    const call = calls[0];
    expect(call.opts.width).toBeDefined();
    expect(call.opts.height).toBeDefined();
    expect(call.opts.palette).toEqual(paletteJSON);
    expect(call.opts.geometry).toEqual(geometryJSON);
    expect(call.opts.notice).toBe('');
    expect(statusText).toBe('Palette loaded. Geometry loaded.');
  });

  tIt('fallbacks: missing palette uses DEFAULTS and sets notice; missing geometry passes undefined; status reflects both', async () => {
    const { helpers, runMain, calls } = await loadAndRunIndex({
      canvasCtx: {}, renderOk: true,
      paletteJSON: null,          // simulate 404/missing
      geometryJSON: null
    });
    const { statusText } = await runMain();

    const call = calls[0];
    // palette fell back to DEFAULTS
    expect(call.opts.palette).toEqual(helpers.DEFAULTS.palette);
    // geometry becomes undefined, not null
    expect(typeof call.opts.geometry).toBe('undefined');
    // notice propagated
    expect(call.opts.notice).toBe('Palette fallback active.');
    expect(statusText).toBe('Palette missing; using sealed fallback. Geometry fallback in use.');
  });

  tIt('renderer error path: shows status with reason', async () => {
    const { runMain } = await loadAndRunIndex({
      canvasCtx: {}, renderOk: false, renderReason: 'unit-fail',
      paletteJSON: { bg:'#000', ink:'#fff', layers:[] }, geometryJSON: {}
    });
    const { statusText } = await runMain();
    expect(statusText).toBe('Renderer error: unit-fail');
  });

  tIt('geometry present but palette missing: mixed status message and notice propagation', async () => {
    const geometryJSON = { g: true };
    const { runMain, calls } = await loadAndRunIndex({
      canvasCtx: {}, renderOk: true, paletteJSON: null, geometryJSON
    });
    const { statusText } = await runMain();
    expect(statusText).toBe('Palette missing; using sealed fallback. Geometry loaded.');
    expect(calls[0].opts.notice).toBe('Palette fallback active.');
  });
});