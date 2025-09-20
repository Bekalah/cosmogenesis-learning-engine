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
 * Additional unit tests for internal helpers in this file.
 *
 * Test runner note:
 * - Uses describe/it style with Node's assert.
 * - Compatible with Jest and Vitest; also runnable under Mocha.
 */

describe('Helper utilities - unit tests', () => {
  const approx = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
  const approxArr = (arr, exp, eps = 1e-6) => {
    assert.strictEqual(arr.length, exp.length, 'array length mismatch');
    for (let i = 0; i < arr.length; i++) {
      assert.ok(approx(arr[i], exp[i], eps), `index ${i}: got ${arr[i]}, expected ${exp[i]}`);
    }
  };

  describe('isHex6', () => {
    it('accepts valid #RRGGBB values (case-insensitive)', () => {
      assert.ok(isHex6('#000000'));
      assert.ok(isHex6('#FFFFFF'));
      assert.ok(isHex6('#a1B2c3'));
    });
    it('rejects invalid formats and types', () => {
      const bad = ['#abc', 'abc', '#12345G', '#1234567', '#12', '#FFFFF', '', ' #FFFFFF', '#FFFFFF ', null, undefined, 123];
      for (const v of bad) {
        assert.strictEqual(isHex6(v), false, `expected false for ${String(v)}`);
      }
    });
  });

  describe('hexToRgb01', () => {
    it('maps black and white correctly', () => {
      approxArr(hexToRgb01('#000000'), [0, 0, 0]);
      approxArr(hexToRgb01('#FFFFFF'), [1, 1, 1]);
    });
    it('maps mid-gray approximately to 0.502 on each channel', () => {
      const [r, g, b] = hexToRgb01('#808080');
      assert.ok(approx(r, 128/255, 1e-6));
      assert.ok(approx(g, 128/255, 1e-6));
      assert.ok(approx(b, 128/255, 1e-6));
    });
    it('is case-insensitive', () => {
      approxArr(hexToRgb01('#FF00Aa'), hexToRgb01('#ff00aa'));
    });
  });

  describe('srgbToLinear', () => {
    it('handles boundary conditions', () => {
      assert.ok(approx(srgbToLinear(0), 0));
      assert.ok(approx(srgbToLinear(1), 1));
    });
    it('uses piecewise transformation (below/above threshold)', () => {
      const below = 0.02;
      const expectedBelow = below / 12.92;
      assert.ok(approx(srgbToLinear(below), expectedBelow, 1e-9));

      const above = 0.5;
      const expectedAbove = Math.pow((above + 0.055) / 1.055, 2.4);
      assert.ok(approx(srgbToLinear(above), expectedAbove, 1e-12));
    });
  });

  describe('relLuminance', () => {
    it('produces 0 for black and ~1 for white', () => {
      assert.ok(approx(relLuminance('#000000'), 0, 1e-12));
      assert.ok(approx(relLuminance('#FFFFFF'), 1, 1e-12));
    });
    it('matches primary color weights for fully-saturated primaries', () => {
      assert.ok(approx(relLuminance('#FF0000'), 0.2126, 1e-4));
      assert.ok(approx(relLuminance('#00FF00'), 0.7152, 1e-4));
      assert.ok(approx(relLuminance('#0000FF'), 0.0722, 1e-4));
    });
  });

  describe('contrastRatio', () => {
    it('returns ~21 for black vs white (white on black)', () => {
      const ratio = contrastRatio('#FFFFFF', '#000000');
      assert.ok(approx(ratio, 21, 1e-10), `expected ~21, got ${ratio}`);
    });
    it('returns ~21 for black vs white (black on white)', () => {
      // This test will catch ordering bugs where hi/lo are not selected correctly.
      const ratio = contrastRatio('#000000', '#FFFFFF');
      assert.ok(approx(ratio, 21, 1e-10), `expected ~21, got ${ratio}`);
    });
    it('returns 1 for identical colors', () => {
      const ratio = contrastRatio('#777777', '#777777');
      assert.ok(approx(ratio, 1, 1e-12), `expected 1, got ${ratio}`);
    });
    it('is symmetric regardless of argument order', () => {
      const a = '#123456';
      const b = '#abcdef';
      const r1 = contrastRatio(a, b);
      const r2 = contrastRatio(b, a);
      assert.ok(approx(r1, r2, 1e-12), `expected symmetry, got r1=${r1}, r2=${r2}`);
    });
  });

  describe('looksLikePalette', () => {
    it('accepts a valid palette object', () => {
      const ok = { bg: '#111111', ink: '#ffffff', muted: '#777777', layers: ['#222222', '#333333'] };
      assert.strictEqual(looksLikePalette(ok), true);
    });
    it('rejects objects with missing or invalid fields', () => {
      const cases = [
        {},
        { bg: '#000000', ink: '#ffffff', muted: '#777777' },                // no layers
        { bg: '#000000', ink: '#ffffff', muted: '#777777', layers: 'x' },   // layers not array
        { bg: 123, ink: '#ffffff', muted: '#777777', layers: [] },          // non-string bg
        { bg: '#000000', ink: null, muted: '#777777', layers: [] },         // non-string ink
      ];
      for (const c of cases) {
        assert.strictEqual(looksLikePalette(c), false, `should reject: ${JSON.stringify(c)}`);
      }
    });
  });

  describe('findPaletteJson (controlled temporary workspace)', () => {
    it('locates a valid palette JSON in a conventional root (theme/)', () => {
      const fs = require('fs');
      const path = require('path');
      const os = require('os');

      const cwd0 = process.cwd();
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'palette-test-'));
      try {
        const themeDir = path.join(tmp, 'theme');
        fs.mkdirSync(themeDir, { recursive: true });

        const paletteObj = {
          bg: '#0a0a0a',
          ink: '#fefefe',
          muted: '#777777',
          layers: ['#111111', '#222222', '#333333']
        };
        const filePath = path.join(themeDir, 'palette.json');
        fs.writeFileSync(filePath, JSON.stringify(paletteObj), 'utf8');

        process.chdir(tmp);
        const result = findPaletteJson();
        assert.ok(result && result.path && result.data, 'expected a result with path and data');
        assert.ok(result.path.endsWith(path.join('theme', 'palette.json')), `unexpected path: ${result.path}`);
        assert.strictEqual(result.data.bg, paletteObj.bg);
        assert.strictEqual(result.data.ink, paletteObj.ink);
        assert.strictEqual(result.data.muted, paletteObj.muted);
        assert.strictEqual(Array.isArray(result.data.layers), true);
        assert.strictEqual(result.data.layers.length, paletteObj.layers.length);
      } finally {
        process.chdir(cwd0);
        try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
      }
    });

    it('returns null when no matching palette file exists', () => {
      const fs = require('fs');
      const path = require('path');
      const os = require('os');

      const cwd0 = process.cwd();
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'palette-test-empty-'));
      try {
        // Create unrelated structure without JSON matches
        fs.mkdirSync(path.join(tmp, 'src'), { recursive: true });
        fs.writeFileSync(path.join(tmp, 'src', 'index.js'), 'console.log("noop")', 'utf8');

        process.chdir(tmp);
        const res = findPaletteJson();
        assert.strictEqual(res, null);
      } finally {
        process.chdir(cwd0);
        try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
      }
    });
  });
});