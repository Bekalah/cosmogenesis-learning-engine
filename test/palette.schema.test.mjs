/* Auto-generated tests: palette schema validation
   Detected testing framework: node
   Generated on: 2025-09-19T15:04:08Z
   These tests:
     - Validate the palette sample from the PR diff (happy path)
     - Cover edge/failure cases (missing keys, invalid hex, wrong lengths, duplicates)
     - Validate any repository palette*.json files if present
*/
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const palSchemaHexRE = /^#(?:[0-9a-fA-F]{6})$/;

function palSchemaValidate(p) {
  const errors = [];
  if (typeof p !== "object" || p === null || Array.isArray(p)) {
    errors.push("Root must be a non-null object.");
    return errors;
  }
  const required = ["bg", "ink", "muted", "layers"];
  for (const k of required) {
    if (!(k in p)) errors.push(`Missing required key: '${k}'.`);
  }
  if (typeof p.bg !== "string" || !palSchemaHexRE.test(p.bg || "")) {
    errors.push("bg must be a hex color in form #RRGGBB.");
  }
  if (typeof p.ink !== "string" || !palSchemaHexRE.test(p.ink || "")) {
    errors.push("ink must be a hex color in form #RRGGBB.");
  }
  if (typeof p.muted !== "string" || !palSchemaHexRE.test(p.muted || "")) {
    errors.push("muted must be a hex color in form #RRGGBB.");
  }
  if (!Array.isArray(p.layers)) {
    errors.push("layers must be an array.");
  } else {
    if (p.layers.length !== 6) {
      errors.push("layers must contain exactly 6 colors.");
    }
    const layerHexIssues = p.layers
      .map((c, i) => (typeof c !== "string" || !palSchemaHexRE.test(c) ? i : -1))
      .filter(i => i >= 0);
    if (layerHexIssues.length) {
      errors.push(`layers contains invalid hex at indices: ${layerHexIssues.join(", ")}.`);
    }
    const normalizedLayers = (p.layers || []).map(c => String(c).toLowerCase());
    const uniqueCount = new Set(normalizedLayers).size;
    if (uniqueCount !== normalizedLayers.length) {
      errors.push("layers must contain unique colors.");
    }
    const base = [p.bg, p.ink, p.muted].map(c => String(c || "").toLowerCase());
    const overlap = normalizedLayers.filter(c => base.includes(c));
    if (overlap.length) {
      errors.push("Base colors (bg, ink, muted) must not duplicate layer colors.");
    }
  }
  return errors;
}

async function palSchemaFindPaletteFiles(startDir = process.cwd()) {
  const IGNORE = new Set(["node_modules", ".git", "dist", "build", "coverage", "out", ".next", ".nuxt", ".cache"]);
  const matches = [];
  async function walk(dir) {
    let entries = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (IGNORE.has(ent.name)) continue;
        await walk(full);
      } else if (ent.isFile()) {
        if (/palette.*\.json$/i.test(ent.name)) matches.push(full);
      }
    }
  }
  await walk(startDir);
  return matches;
}

// Sample from PR diff
const palSchemaSample = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  muted: "#a6a6c1",
  layers: ["#b1c7ff","#89f7fe","#a0ffa1","#ffd27f","#f5a3ff","#d0d0e6"]
};

test("palette.schema: validates sample from diff (happy path)", () => {
  assert.deepStrictEqual(palSchemaValidate(palSchemaSample), []);
});

test("palette.schema: accepts uppercase hex values as valid", () => {
  const upper = {
    bg: "#0B0B12",
    ink: "#E8E8F0",
    muted: "#A6A6C1",
    layers: ["#B1C7FF","#89F7FE","#A0FFA1","#FFD27F","#F5A3FF","#D0D0E6"]
  };
  assert.deepStrictEqual(palSchemaValidate(upper), []);
});

test("palette.schema: rejects invalid hex values", () => {
  const bad = { ...palSchemaSample, bg: "#ZZZZZZ" };
  const errs = palSchemaValidate(bad);
  assert.ok(errs.some(e => e.toLowerCase().includes("bg")));
});

test("palette.schema: rejects when required keys are missing", () => {
  const { ink, ...partial } = palSchemaSample;
  const errs = palSchemaValidate(partial);
  assert.ok(errs.some(e => e.includes("Missing required key")));
});

test("palette.schema: enforces exactly 6 unique layer colors", () => {
  const wrongLen = { ...palSchemaSample, layers: palSchemaSample.layers.slice(0, 5) };
  assert.ok(palSchemaValidate(wrongLen).some(e => e.includes("exactly 6")));

  const dup = { ...palSchemaSample, layers: ["#b1c7ff","#b1c7ff","#a0ffa1","#ffd27f","#f5a3ff","#d0d0e6"] };
  assert.ok(palSchemaValidate(dup).some(e => e.includes("unique")));
});

test("palette.schema: rejects overlap between base colors and layers", () => {
  const overlap = { ...palSchemaSample, layers: ["#0b0b12","#89f7fe","#a0ffa1","#ffd27f","#f5a3ff","#d0d0e6"] };
  assert.ok(palSchemaValidate(overlap).some(e => e.toLowerCase().includes("must not duplicate")));
});

test("palette.schema: validates repository palette*.json files if present", async () => {
  const files = await palSchemaFindPaletteFiles();
  const failures = [];
  for (const f of files) {
    try {
      const content = await fs.readFile(f, "utf8");
      const json = JSON.parse(content);
      const errs = palSchemaValidate(json);
      if (errs.length) failures.push({ file: f, errs });
    } catch (e) {
      failures.push({ file: f, errs: [String(e?.message || e)] });
    }
  }
  assert.deepStrictEqual(failures, []);
});