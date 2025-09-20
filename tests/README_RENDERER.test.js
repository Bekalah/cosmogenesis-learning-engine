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
  // Additional diff-focused tests (Jest) — expanding coverage of README_RENDERER.md
  it("contains required H2 sections: Usage, Files, Layer order, Palette override, Accessibility/ND-safe", () => {
    const headings = Array.from(content.matchAll(/^##\s+(.+)$/gm)).map(m => m[1].toLowerCase());
    expect(headings.some(h => /usage/.test(h))).toBe(true);
    expect(headings.some(h => /files/.test(h))).toBe(true);
    expect(headings.some(h => /layer order/.test(h))).toBe(true);
    expect(headings.some(h => /palette override/.test(h))).toBe(true);
    expect(headings.some(h => /(nd-safe|accessibility)/.test(h))).toBe(true);
  });

  it("includes HTML and JS examples with <canvas> and module imports", () => {
    // HTML block with canvas
    expect(content).toMatch(/```html[\s\S]*?<canvas[^>]*>[\s\S]*?```/i);
    // JS/mjs block demonstrating module usage
    expect(content).toMatch(/```(js|javascript|mjs)[\s\S]*?(script\s+type="module"|import\s+.+?from\s+["']?\.?\/?js\/helix-renderer\.mjs["']?)/i);
  });

  it("has balanced code fences and at least one html/js/json block", () => {
    const fences = (content.match(/```/g) || []).length;
    expect(fences % 2).toBe(0);
    expect(/```json/.test(content)).toBe(true);
    expect(/```html/.test(content)).toBe(true);
    expect(/```(js|javascript|mjs)/.test(content)).toBe(true);
  });

  it("examples avoid external http(s) dependencies to remain offline-friendly", () => {
    const blocks = Array.from(content.matchAll(/```(html|js|javascript|mjs)[\s\S]*?```/gi))
      .map(m => m[0])
      .join("\n");
    expect(blocks).not.toMatch(/https?:\/\//i);
  });

  it("Layer order items appear in back-to-front sequence", () => {
    const section = (content.match(/##\s*Layer order[\s\S]*?(?=##\s|$)/i) || [content])[0];
    const names = [
      "Vesica field",
      "Tree-of-Life scaffold",
      "Fibonacci curve",
      "Double-helix lattice",
    ];
    const lower = section.toLowerCase();
    let last = -1;
    for (const n of names) {
      const idx = lower.indexOf(n.toLowerCase());
      expect(idx).toBeGreaterThan(-1);
      expect(idx).toBeGreaterThan(last);
      last = idx;
    }
  });

  it("Palette override section mentions data/palette.json path explicitly", () => {
    const ov = content.match(/##\s*Palette override[\s\S]*?(?=##\s|$)/i);
    expect(ov).toBeTruthy();
    const t = ov ? ov[0] : "";
    expect(t).toMatch(/data\/palette\.json/);
  });

  it("at least one referenced sample file exists alongside README or at repo root", () => {
    const dir = path.dirname(readmePath);
    const root = process.cwd();
    const candidates = ["index.html", "js/helix-renderer.mjs", "data/palette.json"];
    const existing = candidates.filter(rel =>
      fs.existsSync(path.join(dir, rel)) || fs.existsSync(path.join(root, rel))
    );
    expect(existing.length).toBeGreaterThanOrEqual(1);
  });
});