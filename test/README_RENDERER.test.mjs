/**
 * README_RENDERER.test.mjs
 *
 * Note on testing library/framework:
 * - This suite is runner-agnostic and should execute under Jest, Vitest, or Mocha.
 * - It uses Node's built-in 'assert/strict' for assertions and BDD-style globals (describe/it).
 * - If your runner lacks globals, import/enable them per your framework.
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

/** Escape a string for safe use in RegExp construction. */
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Normalize to LF for consistent assertions. */
function toLF(str) {
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/** Extract a markdown section (content under a "## Heading") up to the next "## " or end. */
function getSection(md, heading) {
  const re = new RegExp('^##\\s+' + escapeRegex(heading) + '\\n([\\s\\S]*?)(?=\\n##\\s+|\\n?$)', 'm');
  const m = md.match(re);
  return m ? m[1] : '';
}

/** Breadth-first search for a file by exact name starting from cwd, skipping heavy dirs. */
function findFileByName(startDir, targetName, maxDepth = 8) {
  const skip = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', 'out', '.next', '.turbo', '.cache', 'tmp', 'vendor']);
  const q = [{ dir: startDir, depth: 0 }];
  while (q.length) {
    const { dir, depth } = q.shift();
    if (depth > maxDepth) continue;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.name === targetName) return path.join(dir, e.name);
      if (e.isDirectory() && !skip.has(e.name)) q.push({ dir: path.join(dir, e.name), depth: depth + 1 });
    }
  }
  return null;
}

const repoRoot = process.cwd();

const readmePath = findFileByName(repoRoot, 'README_RENDERER.md');
assert.ok(readmePath, 'README_RENDERER.md should exist somewhere in the repository root tree');

const raw = fs.readFileSync(readmePath, 'utf8');
const md = toLF(raw);

describe('README_RENDERER.md content and structure', () => {
  it('starts with the correct H1 title', () => {
    assert.match(md, /^# Cosmic Helix Renderer \(Offline, ND-safe\)\n/, 'H1 title is missing or incorrect');
  });

  it('mentions offline, no dependencies, and canvas stage size 1440×900', () => {
    assert.match(md, /no dependencies/i, 'Should mention "no dependencies"');
    assert.match(md, /1440×900/, 'Should mention 1440×900 stage size');
    assert.match(md, /Double-clicking\s+`index\.html`/i, 'Should mention double-clicking index.html');
  });

  it('has a Files section listing the 4 expected entries', () => {
    const files = getSection(md, 'Files');
    assert.ok(files, 'Files section missing');
    const bullets = [...files.matchAll(/^\-\s+/gm)];
    assert.equal(bullets.length, 4, 'Files section should have exactly 4 bullets');
    assert.match(files, /`index\.html`/, 'Files should list index.html');
    assert.match(files, /`js\/helix-renderer\.mjs`/, 'Files should list js/helix-renderer.mjs');
    assert.match(files, /`data\/palette\.json`/, 'Files should list data/palette.json');
    assert.match(files, /`README_RENDERER\.md`/, 'Files should list README_RENDERER.md');
  });

  it('has a Usage (offline) section with expected statuses and file:// notice', () => {
    const usage = getSection(md, 'Usage (offline)');
    assert.ok(usage, 'Usage (offline) section missing');
    // 1..3 steps present
    const steps = [...usage.matchAll(/^\d+\.\s+/gm)];
    assert.ok(steps.length >= 3, 'Usage should include at least 3 numbered steps');
    assert.match(usage, /Preparing canvas…/, 'Should mention "Preparing canvas…"');
    assert.match(usage, /Palette loaded/, 'Should mention "Palette loaded"');
    assert.match(usage, /Fallback palette\s+active/, 'Should mention "Fallback palette active"');
    assert.match(usage, /file:\/\//, 'Should mention file:// sandbox behavior');
    assert.match(usage, /data\/palette\.json/, 'Should reference data/palette.json');
  });

  it('describes the 4 layers in correct order under "Layer order (back to front)"', () => {
    const layers = getSection(md, 'Layer order (back to front)');
    assert.ok(layers, 'Layer order (back to front) section missing');

    // Ensure ordered presence
    const ordered = ['Vesica field', 'Tree-of-Life scaffold', 'Fibonacci curve', 'Double-helix lattice'];
    let lastIdx = -1;
    for (const name of ordered) {
      const idx = layers.indexOf(name);
      assert.ok(idx >= 0, `Missing layer: ${name}`);
      assert.ok(idx > lastIdx, `Layer "${name}" appears out of order`);
      lastIdx = idx;
    }

    // Count top-level enumerations
    const enumerations = [...layers.matchAll(/^\d+\.\s+\*\*/gm)];
    assert.equal(enumerations.length, 4, 'Expected 4 enumerated layer items');

    // Key numerology references inside layer descriptions
    assert.match(layers, /nine-by-eleven/i, 'Vesica field 9×11 lattice should be mentioned (as words)');
    assert.match(layers, /ten sephirot/i, 'Tree-of-Life ten sephirot should be mentioned');
    assert.match(layers, /twenty-two/i, 'Tree-of-Life twenty-two paths should be mentioned');
    assert.match(layers, /144 points/, 'Fibonacci 144 points should be mentioned');
    assert.match(layers, /thirty-three cross ties/i, 'Double-helix 33 cross ties should be mentioned');
  });

  it('contains Numerology anchors with canonical counts', () => {
    const numerology = getSection(md, 'Numerology anchors');
    assert.ok(numerology, 'Numerology anchors section missing');
    assert.match(numerology, /9×11/, 'Should mention 9×11');
    assert.match(numerology, /\b22\b/, 'Should mention 22');
    assert.match(numerology, /\b33\b/, 'Should mention 33');
    assert.match(numerology, /\b144\b/, 'Should mention 144');
    assert.match(numerology, /\{3,\s*7,\s*9,\s*11,\s*22,\s*33,\s*99,\s*144\}/, 'Should list the numeric backbone set {3,7,9,11,22,33,99,144}');
  });

  it('documents ND-safe and trauma-informed choices clearly', () => {
    const nd = getSection(md, 'ND-safe and trauma-informed choices');
    assert.ok(nd, 'ND-safe and trauma-informed choices section missing');
    assert.match(nd, /No animation, timers, or autoplay\./, 'Should commit to no animation');
    assert.match(nd, /Calm palette defaults/i, 'Should mention calm palette defaults');
    assert.match(nd, /Layered drawing order/i, 'Should mention layered drawing order');
    assert.match(nd, /ASCII quotes, UTF-8, LF newlines, and pure helpers/i, 'Should mention ASCII quotes, UTF-8, LF, pure helpers');
  });

  it('explains Customising safely with palette keys and API surface', () => {
    const cust = getSection(md, 'Customising safely');
    assert.ok(cust, 'Customising safely section missing');
    assert.match(cust, /\bbg\b.*\bink\b.*\bmuted\b/si, 'Should mention bg, ink, and muted palette keys');
    assert.match(cust, /\blayers\b/, 'Should mention layers entries');
    assert.match(cust, /renderHelix/, 'Should mention renderHelix API');
    assert.match(cust, /js\/helix-renderer\.mjs/, 'Should reference the helper module path');
  });

  it('uses LF newlines and avoids CRLF', () => {
    assert.equal(raw.indexOf('\r'), -1, 'README should not contain CRLF newlines');
  });

  it('avoids curly quotes to remain ASCII-quote safe', () => {
    const curlyQuoteRegex = /[\u2018\u2019\u201C\u201D]/; // ‘ ’ “ ”
    assert.ok(!curlyQuoteRegex.test(md), 'Curly quotes detected; use ASCII quotes instead');
  });
});