/**
 * Test suite for README_RENDERER.md
 *
 * Framework: Jest (describe/it/expect).
 * Purpose: Validate structure and key content introduced in the diff for the Cosmic Helix Renderer docs.
 */
describe("README_RENDERER.md structure and content (diff-focused)", () => {
  const fs = require("fs");
  const path = require("path");

  // Locate README_RENDERER.md robustly
  function findReadme() {
    const candidates = [
      path.resolve(process.cwd(), "README_RENDERER.md"),
      path.resolve(process.cwd(), "docs/README_RENDERER.md"),
      path.resolve(__dirname, "../README_RENDERER.md"),
      path.resolve(__dirname, "../docs/README_RENDERER.md"),
    ];
    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) return p;
      } catch (_) {}
    }
    // Fallback: shallow scan of repo root for README*RENDERER*.md
    const root = process.cwd();
    try {
      const entries = fs.readdirSync(root, { withFileTypes: true });
      for (const e of entries) {
        if (e.isFile() && /^README.*RENDERER.*\.md$/i.test(e.name)) {
          return path.join(root, e.name);
        }
      }
    } catch (e) {}
    throw new Error("README_RENDERER.md not found. Ensure the file exists at repo root or docs/.");
  }

  let content;
  let readmePath;

  beforeAll(() => {
    readmePath = findReadme();
    content = fs.readFileSync(readmePath, "utf8");
    expect(typeof content).toBe("string");
    expect(content.length).toBeGreaterThan(200);
  });

  it("starts with the correct H1 title (Offline, ND-safe)", () => {
    const firstLine = content.split(/\r?\n/, 1)[0];
    expect(firstLine.trim()).toMatch(/^#\s+Cosmic Helix Renderer\s+\(Offline,\s*ND-safe\)/);
  });

  it("lists the expected Files entries including index.html, js/helix-renderer.mjs, data/palette.json, README_RENDERER.md", () => {
    const filesSection = content.match(/##\s*Files[\s\S]*?(?=##\s|\Z)/g);
    expect(filesSection).toBeTruthy();
    const sectionText = filesSection.join("\n");
    expect(sectionText).toMatch(/`index\.html`/);
    expect(sectionText).toMatch(/`js\/helix-renderer\.mjs`/);
    expect(sectionText).toMatch(/`data\/palette\.json`/);
    expect(sectionText).toMatch(/`README_RENDERER\.md`/);
  });

  it("mentions offline usage and clear status messaging including 'Preparing canvas…' and palette fallback text", () => {
    const usageBlocks = content.match(/##\s*Usage[^\n]*[\s\S]*?(?=##\s|\Z)/g);
    expect(usageBlocks).toBeTruthy();
    const text = usageBlocks.join("\n");
    expect(text).toMatch(/Preparing canvas…/);
    expect(text).toMatch(/Palette loaded|Fallback palette\s+active/i);
    expect(text).toMatch(/file:\/\//);
  });

  it("documents the Layer order with the four expected layers", () => {
    const layerBlocks = content.match(/##\s*Layer order\s*\(back to front\)[\s\S]*?(?=##\s|\Z)/g);
    expect(layerBlocks).toBeTruthy();
    const t = layerBlocks.join("\n");
    for (const name of [
      "Vesica field",
      "Tree-of-Life scaffold",
      "Fibonacci curve",
      "Double-helix lattice",
    ]) {
      expect(t).toMatch(new RegExp(`\\*\\*${name}\\*\\*`, "i"));
    }
  });

  it("includes numerology anchors and grounding with canonical numbers {3, 7, 9, 11, 22, 33, 99, 144}", () => {
    expect(content).toMatch(/\{?\s*3,\s*7,\s*9,\s*11,\s*22,\s*33,\s*99,\s*144\s*\}?/);
    // Specific mentions introduced/retained by diff
    expect(content).toMatch(/9×11|nine[- ]by[- ]eleven/i);
    expect(content).toMatch(/\b22\b/);
    expect(content).toMatch(/\b33\b/);
    expect(content).toMatch(/\b144\b/);
  });

  it("explicitly states ND-safe choices with no animation and calm palette", () => {
    const ndBlocks = content.match(/##\s*(ND-safe and trauma-informed choices|Accessibility\s*&\s*ND-safe rationale)[\s\S]*?(?=##\s|\Z)/g);
    expect(ndBlocks).toBeTruthy();
    const t = ndBlocks.join("\n");
    expect(t).toMatch(/No animation/i);
    expect(t).toMatch(/Calm palette/i);
    expect(t).toMatch(/Layered drawing order/i);
    expect(t).toMatch(/ASCII quotes|UTF-8|LF newlines/i);
  });

  it("contains a valid JSON example under 'Palette override' with required keys", () => {
    const match = content.match(/```json[\s\S]*?```/);
    expect(match).toBeTruthy();
    const jsonBlock = match[0].replace(/```json|```/g, "").trim();
    let parsed;
    expect(() => { parsed = JSON.parse(jsonBlock); }).not.toThrow();
    expect(parsed).toHaveProperty("bg");
    expect(parsed).toHaveProperty("ink");
    expect(parsed).toHaveProperty("layers");
    expect(Array.isArray(parsed.layers)).toBe(true);
    // The example shows exactly six layer entries
    expect(parsed.layers.length).toBe(6);
    for (const v of [parsed.bg, parsed.ink, ...parsed.layers]) {
      expect(typeof v).toBe("string");
      expect(v).toMatch(/^#?[0-9a-f]{3,8}$/i);
    }
  });

  it("mentions palette fallback behavior clearly", () => {
    expect(content).toMatch(/fallback palette/i);
    expect(content).toMatch(/calm notice|header notice|canvas/i);
  });

  it("is deterministic/offline: mentions offline, no server/build, no animation", () => {
    expect(content).toMatch(/offline/i);
    expect(content).toMatch(/No server|No build step/i);
    expect(content).toMatch(/No animation/i);
  });
});
/**
 * Extended tests for README_RENDERER.md (diff-focused, robustness + optional artifacts)
 *
 * Framework: Jest (describe/it/expect)
 * This block complements existing tests by:
 *  - Verifying HTML snippet structure (canvas + module script to js/helix-renderer.mjs)
 *  - Ensuring fenced code blocks are balanced
 *  - Enforcing documented layer order sequencing
 *  - Tightening the JSON example keys
 *  - Optionally validating on-disk artifacts referenced by the docs (index.html, data/palette.json)
 */

describe("README_RENDERER.md extended checks (diff-focused)", () => {
  const fs = require("fs");
  const path = require("path");

  // Robustly locate README_RENDERER.md (duplicate helper for local scope)
  function findReadmeExt() {
    const candidates = [
      path.resolve(process.cwd(), "README_RENDERER.md"),
      path.resolve(process.cwd(), "docs/README_RENDERER.md"),
      path.resolve(__dirname, "../README_RENDERER.md"),
      path.resolve(__dirname, "../docs/README_RENDERER.md"),
    ];
    for (const p of candidates) {
      try { if (fs.existsSync(p)) return p; } catch (_) {}
    }
    // Fallback: shallow scan of repo root for README*RENDERER*.md
    try {
      const root = process.cwd();
      const entries = fs.readdirSync(root, { withFileTypes: true });
      for (const e of entries) {
        if (e.isFile() && /^README.*RENDERER.*\.md$/i.test(e.name)) {
          return path.join(root, e.name);
        }
      }
    } catch (_) {}
    throw new Error("README_RENDERER.md not found for extended tests.");
  }

  // Utility: return first existing absolute path from relative path candidates
  function findFirstExisting(relPaths) {
    const bases = [process.cwd(), path.resolve(__dirname, "..")];
    for (const rel of relPaths) {
      for (const base of bases) {
        const p = path.resolve(base, rel);
        try { if (fs.existsSync(p)) return p; } catch (_) {}
      }
    }
    return null;
  }

  let content;
  let readmePath;
  let indexHtmlPath;
  let palettePath;

  beforeAll(() => {
    readmePath = findReadmeExt();
    content = fs.readFileSync(readmePath, "utf8");
    indexHtmlPath = findFirstExisting([
      "index.html",
      "docs/index.html",
      "public/index.html",
      "site/index.html",
    ]);
    palettePath = findFirstExisting([
      "data/palette.json",
      "docs/data/palette.json",
      "public/data/palette.json",
      "assets/data/palette.json",
      "assets/palette.json",
    ]);
  });

  it("has a Table of Contents-style structure with multiple H2 sections", () => {
    const h2s = content.match(/^\s*##\s+/gm) || [];
    expect(h2s.length).toBeGreaterThanOrEqual(4);
    expect(content).toMatch(/##\s*(Usage|Files)/i);
  });

  it("contains an HTML snippet with a canvas and module script to js/helix-renderer.mjs", () => {
    const htmlFence = content.match(/```html[\s\S]*?```/i);
    expect(htmlFence).toBeTruthy();
    const html = htmlFence[0];
    expect(html).toMatch(/<canvas[^>]*>/i);
    expect(html).toMatch(/<\/canvas>/i);
    expect(html).toMatch(/<script[^>]+type=["']module["'][^>]+src=["']\.?\/?js\/helix-renderer\.mjs["'][^>]*><\/script>/i);
  });

  it("has balanced fenced code blocks (triple backticks)", () => {
    const backticks = (content.match(/```/g) || []).length;
    expect(backticks % 2).toBe(0);
  });

  it("documents layer sequence in correct back-to-front order", () => {
    const m = content.match(/##\s*Layer order[^\n]*\n([\s\S]*?)(?=\n##\s|$)/i);
    expect(m).toBeTruthy();
    const section = (m && m[1]) || "";
    const order = [
      "Vesica field",
      "Tree-of-Life scaffold",
      "Fibonacci curve",
      "Double-helix lattice",
    ];
    const indices = order.map(label => section.toLowerCase().indexOf(label.toLowerCase()));
    indices.forEach(i => expect(i).toBeGreaterThanOrEqual(0));
    for (let i = 1; i < indices.length; i++) {
      expect(indices[i]).toBeGreaterThan(indices[i - 1]);
    }
  });

  it("locks JSON example keys under 'Palette override' to exactly {bg, ink, layers}", () => {
    const match = content.match(/```json[\s\S]*?```/i);
    expect(match).toBeTruthy();
    const jsonBlock = match[0].replace(/```json|```/gi, "").trim();
    const parsed = JSON.parse(jsonBlock);
    const keys = Object.keys(parsed).sort();
    expect(keys).toEqual(["bg", "ink", "layers"].sort());
  });

  // Conditionally validate index.html if present
  const itIf = (cond) => (cond ? it : it.skip);

  itIf(!!indexHtmlPath)("index.html (if present) references module script and a canvas; avoids external HTTP(S) for offline safety", () => {
    const html = fs.readFileSync(indexHtmlPath, "utf8");
    expect(html).toMatch(/<script[^>]+type=["']module["'][^>]+src=["']\.?\/?js\/helix-renderer\.mjs["'][^>]*><\/script>/i);
    expect(html).toMatch(/<canvas[^>]+id=["'][^"']+["'][^>]*>/i);
    // Encourage offline: no external CDN references
    const externals = html.match(/https?:\/\//gi) || [];
    expect(externals.length).toBe(0);
  });

  // Conditionally validate data/palette.json if present
  itIf(!!palettePath)("palette.json (if present) has valid shape and hex colors", () => {
    const palette = JSON.parse(fs.readFileSync(palettePath, "utf8"));
    expect(palette).toHaveProperty("bg");
    expect(palette).toHaveProperty("ink");
    expect(palette).toHaveProperty("layers");
    expect(Array.isArray(palette.layers)).toBe(true);
    expect(palette.layers.length).toBeGreaterThanOrEqual(4);
    expect(palette.layers.length).toBeLessThanOrEqual(12);
    for (const v of [palette.bg, palette.ink, ...palette.layers]) {
      expect(typeof v).toBe("string");
      expect(v).toMatch(/^#?[0-9a-f]{3,8}$/i);
    }
  });
});