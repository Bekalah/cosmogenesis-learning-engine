/**
 * Color palette validation tests
 *
 * Test framework note:
 * - Uses BDD style (describe/it), compatible with Jest and Vitest.
 * - Assertions via Node's built-in 'assert' for compatibility with Mocha as well.
 *
 * Focus: Validate schema and quality of the palette introduced/modified in this PR:
 *   { bg, ink, muted, layers: string[] }
 * - Hex format correctness (#RRGGBB)
 * - Uniqueness across all colors
 * - Accessibility: bg vs ink contrast ratio >= 4.5 (WCAG AA normal text)
 * - Reasonable luminance ordering (bg darker than ink)
 * - Layers integrity (array, non-empty, all valid hex)
 *
 * If no palette JSON is found, tests are marked as skipped to avoid false negatives.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', 'out',
  '.next', '.nuxt', '.cache', 'tmp', 'temp', '.turbo', '.pnpm', '.yarn',
  '.vercel', '.husky', '.vscode', '.idea', '.storybook'
]);

function isHex6(str) {
  return typeof str === 'string' && /^#[0-9a-fA-F]{6}$/.test(str);
}

function hexToRgb01(hex) {
  const h = hex.slice(1);
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b];
}
function srgbToLinear(c) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relLuminance(hex) {
  const [r, g, b] = hexToRgb01(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(a, b) {
  const L1 = relLuminance(a);
  const L2 = relLuminance(b);
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L1, L2];
  return (hi + 0.05) / (lo + 0.05);
}

function looksLikePalette(obj) {
  return obj && typeof obj === 'object'
    && typeof obj.bg === 'string'
    && typeof obj.ink === 'string'
    && typeof obj.muted === 'string'
    && Array.isArray(obj.layers);
}

/**
 * Attempt to locate a palette JSON file without introducing deps.
 * Priority search order favors conventional source locations and filenames.
 */
function findPaletteJson() {
  const candidateRoots = [
    'src', 'app', 'lib', 'packages', 'config', 'assets',
    'styles', 'style', 'theme', 'themes', 'data', '.'
  ];
  const nameHint = /(palette|theme|color)/i;


  const queue = [];
  const seen = new Set();


  for (const root of candidateRoots) {
    const abs = path.resolve(process.cwd(), root);
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      queue.push(abs);
    }
  }


  while (queue.length) {
    const dir = queue.shift();
    if (seen.has(dir)) continue;
    seen.add(dir);


    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {

      continue;
    }

    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      if (IGNORED_DIRS.has(e.name)) continue;
      const full = path.join(dir, e.name);


      if (e.isDirectory()) {
        // avoid scanning test/spec folders
        if (/(^|\/)(__tests__|tests?|specs?)$/.test(full)) continue;
        queue.push(full);
        continue;
      }


      if (!e.isFile()) continue;
      if (!/\.json$/i.test(e.name)) continue;
      if (!nameHint.test(e.name)) continue;


      try {
        const raw = fs.readFileSync(full, 'utf8');
        const obj = JSON.parse(raw);
        if (looksLikePalette(obj)) {

          return { path: full, data: obj };
        }
      } catch {

        // ignore parse errors and keep searching
      }
    }
  }
  return null;
}

const resolved = findPaletteJson();


describe('Color palette schema and quality', () => {
  if (!resolved) {
    it.skip('palette JSON with {bg, ink, muted, layers[]} should exist in the repo', () => {});
    return;
  }


  const { path: palettePath, data: palette } = resolved;


  it(`loads palette JSON from ${palettePath}`, () => {
    assert.ok(looksLikePalette(palette), 'Palette must have bg, ink, muted (strings) and layers (array)');
  });


  it('has valid hex color strings for bg, ink, and muted', () => {
    assert.ok(isHex6(palette.bg), `bg must be #RRGGBB; got ${palette.bg}`);
    assert.ok(isHex6(palette.ink), `ink must be #RRGGBB; got ${palette.ink}`);
    assert.ok(isHex6(palette.muted), `muted must be #RRGGBB; got ${palette.muted}`);
  });


  it('layers is a non-empty array of valid hex colors', () => {
    assert.ok(Array.isArray(palette.layers), 'layers must be an array');
    assert.ok(palette.layers.length >= 1, 'layers must contain at least one color');
    for (let i = 0; i < palette.layers.length; i++) {
      const c = palette.layers[i];
      assert.ok(isHex6(c), `layers[${i}] must be #RRGGBB; got ${c}`);
    }
  });


  it('all colors are unique across bg, ink, muted, and layers (case-insensitive)', () => {
    const all = [palette.bg, palette.ink, palette.muted, ...palette.layers];

    const norm = all.map(c => c.toLowerCase());
    const unique = new Set(norm);
    assert.strictEqual(unique.size, norm.length, `Found duplicate colors in palette: ${JSON.stringify(all)}`);
  });


  it('bg is darker than ink and contrast ratio >= 4.5 (WCAG AA)', () => {
    const Lbg = relLuminance(palette.bg);
    const Link = relLuminance(palette.ink);
    assert.ok(Lbg < Link, `Expected bg (${palette.bg}) to be darker than ink (${palette.ink})`);
    const ratio = contrastRatio(palette.bg, palette.ink);
    assert.ok(ratio >= 4.5, `Contrast ratio must be >= 4.5; got ${ratio.toFixed(2)} for bg ${palette.bg} vs ink ${palette.ink}`);
  });


  it('muted color is distinct and its luminance lies between bg and ink', () => {
    const Lbg = relLuminance(palette.bg);
    const Link = relLuminance(palette.ink);
    const Lm = relLuminance(palette.muted);
    const min = Math.min(Lbg, Link);
    const max = Math.max(Lbg, Link);
    assert.ok(palette.muted.toLowerCase() !== palette.bg.toLowerCase(), 'muted should not equal bg');
    assert.ok(palette.muted.toLowerCase() !== palette.ink.toLowerCase(), 'muted should not equal ink');
    assert.ok(Lm > min && Lm < max, `muted luminance should lie between bg and ink; got L(bg)=${Lbg.toFixed(4)}, L(muted)=${Lm.toFixed(4)}, L(ink)=${Link.toFixed(4)}`);
  });


  it('layers contain no duplicates and avoid using bg/ink/muted', () => {
    const base = new Set([palette.bg, palette.ink, palette.muted].map(c => c.toLowerCase()));
    const seen = new Set();
    for (let i = 0; i < palette.layers.length; i++) {

      const c = palette.layers[i].toLowerCase();
      assert.ok(!base.has(c), `layers[${i}] should not reuse bg/ink/muted: ${palette.layers[i]}`);
      assert.ok(!seen.has(c), `layers[${i}] duplicates a previous layer: ${palette.layers[i]}`);
      seen.add(c);
    }
  });
});
/**
 * Additional unit tests for palette utilities and discovery.
 * Framework: BDD (describe/it) with Node 'assert' — compatible with Jest, Vitest, and Mocha.
 *
 * These tests:
 * - Validate helper functions (isHex6, hexToRgb01, srgbToLinear, looksLikePalette)
 * - Exercise findPaletteJson in an isolated temporary workspace
 * They do not depend on an existing repo palette and won’t interfere with existing tests.
 */

describe('palette utility helpers', () => {
  it('isHex6 accepts valid #RRGGBB and rejects others', () => {
    assert.strictEqual(isHex6('#000000'), true);
    assert.strictEqual(isHex6('#FFFFFF'), true);
    assert.strictEqual(isHex6('#AaBbCc'), true);

    const invalid = ['#FFF', '000000', '#GGGGGG', '#12345G', '#1234567', '', null, undefined, 123, {}, []];
    for (const v of invalid) {
      assert.strictEqual(isHex6(v), false, `Expected invalid hex: ${String(v)}`);
    }
  });

  it('hexToRgb01 converts hex color to normalized RGB tuple', () => {
    const eps = 1e-6;

    let [r, g, b] = hexToRgb01('#000000');
    assert.ok(Math.abs(r - 0) <= eps && Math.abs(g - 0) <= eps && Math.abs(b - 0) <= eps, 'black → (0,0,0)');

    ;([r, g, b] = hexToRgb01('#FFFFFF'));
    assert.ok(Math.abs(r - 1) <= eps && Math.abs(g - 1) <= eps && Math.abs(b - 1) <= eps, 'white → (1,1,1)');

    ;([r, g, b] = hexToRgb01('#80FF00'));
    assert.ok(
      Math.abs(r - (128 / 255)) <= eps && Math.abs(g - 1) <= eps && Math.abs(b - 0) <= eps,
      '#80FF00 → (128/255,1,0)'
    );
  });

  it('srgbToLinear behaves piecewise at the 0.03928 boundary and is monotonic', () => {
    const eps = 1e-6;
    const cBoundary = 0.03928;
    const cAbove = 0.03929;

    const lBoundary = srgbToLinear(cBoundary);
    const lAbove = srgbToLinear(cAbove);

    // lower branch exact formula
    assert.ok(Math.abs(lBoundary - cBoundary / 12.92) <= eps, 'lower branch formula');

    // monotonicity across boundary
    assert.ok(lBoundary <= lAbove + 1e-9, 'monotonic across boundary');

    // mid value uses power branch
    const mid = 0.5;
    const lMid = srgbToLinear(mid);
    assert.ok(lMid > mid / 12.92, 'upper branch > naive linearization');
  });

  it('relLuminance orders common anchors as expected', () => {
    const Lblack = relLuminance('#000000');
    const Lwhite = relLuminance('#FFFFFF');
    assert.ok(Lblack < Lwhite, 'black should be darker than white');
  });

  it('looksLikePalette validates only the shape, not the color semantics', () => {
    assert.strictEqual(
      looksLikePalette({ bg: '#000', ink: '#fff', muted: '#777', layers: [] }),
      true,
      'shape is sufficient even if hex values are not validated here'
    );
    assert.strictEqual(looksLikePalette({ bg: '#000000', ink: '#ffffff', muted: '#777777', layers: ['#111111'] }), true);
    assert.strictEqual(looksLikePalette(null), false);
    assert.strictEqual(looksLikePalette({}), false);
    assert.strictEqual(looksLikePalette({ bg: '#000000', ink: '#ffffff', muted: '#777777' }), false, 'missing layers');
    assert.strictEqual(looksLikePalette({ bg: '#000000', ink: '#ffffff', muted: '#777777', layers: 'nope' }), false, 'layers not array');
  });
});

describe('findPaletteJson (isolated filesystem scenarios)', () => {
  const rmrf = (p) => {
    try { fs.rmSync(p, { recursive: true, force: true }); }
    catch { try { fs.rmdirSync(p, { recursive: true }); } catch (_) {} }
  };

  function withTempCwd(fn) {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'palette-test-'));
    const orig = process.cwd();
    process.chdir(tmpRoot);
    try {
      return fn(tmpRoot);
    } finally {
      process.chdir(orig);
      rmrf(tmpRoot);
    }
  }

  it('returns null when none of the candidate roots exist', () => {
    withTempCwd(() => {
      const res = findPaletteJson();
      assert.strictEqual(res, null, 'Expected null when no roots or files exist');
    });
  });

  it('finds a valid palette under a conventional root (styles/palette.json)', () => {
    withTempCwd((root) => {
      const stylesDir = path.join(root, 'styles');
      fs.mkdirSync(stylesDir, { recursive: true });

      const valid = {
        bg: '#0a0a0a',
        ink: '#fafafa',
        muted: '#777777',
        layers: ['#111111', '#222222']
      };
      fs.writeFileSync(path.join(stylesDir, 'palette.json'), JSON.stringify(valid), 'utf8');

      const res = findPaletteJson();
      assert.ok(res && res.path && res.data, 'Expected discovery result');
      assert.ok(/(^|[\\/])styles[\\/]/.test(res.path), `Expected path within styles/, got: ${res.path}`);
      assert.strictEqual(looksLikePalette(res.data), true, 'shape check');
      assert.ok([valid.bg, valid.ink, valid.muted].every(isHex6), 'top-level colors are hex6');
    });
  });

  it('skips test directories and prefers non-test locations', () => {
    withTempCwd((root) => {
      // Create src/tests/palette.json (should be ignored)
      const ignored = {
        bg: '#111111', ink: '#eeeeee', muted: '#777777', layers: ['#222222']
      };
      const testsDir = path.join(root, 'src', 'tests');
      fs.mkdirSync(testsDir, { recursive: true });
      fs.writeFileSync(path.join(testsDir, 'palette.json'), JSON.stringify(ignored), 'utf8');

      // Create src/styles/palette.json (should be discovered)
      const preferred = {
        bg: '#121212', ink: '#f5f5f5', muted: '#7a7a7a', layers: ['#1a1a1a', '#2a2a2a']
      };
      const stylesDir = path.join(root, 'src', 'styles');
      fs.mkdirSync(stylesDir, { recursive: true });
      fs.writeFileSync(path.join(stylesDir, 'palette.json'), JSON.stringify(preferred), 'utf8');

      const res = findPaletteJson();
      assert.ok(res && res.path && res.data, 'Expected discovery result');
      assert.ok(\!/([\\/])tests([\\/])/.test(res.path), `Should not select a file inside tests/: ${res.path}`);
      assert.ok(/([\\/])styles([\\/])/.test(res.path), `Expected a file inside styles/: ${res.path}`);
      assert.deepStrictEqual(Object.keys(res.data).sort(), ['bg', 'ink', 'layers', 'muted'].sort(), 'shape equality');
    });
  });

  it('ignores invalid JSON and continues searching', () => {
    withTempCwd((root) => {
      const stylesDir = path.join(root, 'styles');
      fs.mkdirSync(stylesDir, { recursive: true });

      // Invalid JSON file that matches the name hint
      fs.writeFileSync(path.join(stylesDir, 'theme-colors.json'), '{ invalid json', 'utf8');

      // Valid but wrong shape (should be skipped)
      fs.writeFileSync(path.join(stylesDir, 'color-scheme.json'), JSON.stringify({ a: 1 }), 'utf8');

      // Valid and correct shape
      const valid = { bg: '#0b0b0b', ink: '#fafafa', muted: '#808080', layers: ['#101010'] };
      fs.writeFileSync(path.join(stylesDir, 'site-palette.json'), JSON.stringify(valid), 'utf8');

      const res = findPaletteJson();
      assert.ok(res && res.path && res.data, 'Expected discovery result');
      assert.strictEqual(looksLikePalette(res.data), true, 'found valid shape after encountering invalid files');
    });
  });
});