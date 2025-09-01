/**
 * codex.ext.js -- Codex EXT init (Cosmogenesis)
 *
 * Purpose:
 * - Load ONE source of truth for instructions (CODEX_INSTRUCTIONS.md)
 * - Expose science + style references
 * - Provide provenance & safety schemas (validation-friendly)
 * - Offer gentle ND-safe defaults (no autoplay, no strobe)
 * - Register top-level build tasks (Milestone Spiral)
 *
 * Use:
 *   import { codexEXT } from "./codex.ext.js";
 *   const codex = await codexEXT.init();
 *   // codex.instructions, codex.schemas, codex.safety, codex.tasks, codex.paths
 *
 * Notes:
 * - This file is intentionally framework-agnostic (vanilla ESM).
 * - Works in browser (fetch) and Node (fs) via an adapter.
 * - Never overwrites source files; read-only by design.
 */

/* --------------------------- Adapters (Browser/Node) --------------------------- */

const env = (() => {
  const isBrowser = typeof window !== "undefined" && typeof window.fetch === "function";
  const isNode = typeof process !== "undefined" && process.versions?.node;
  return { isBrowser, isNode };
})();

async function readText(path) {
  // Try fetch first (browser/Vite/Next static public), then fs (Node)
  if (env.isBrowser) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Fetch failed for ${path}: ${res.status}`);
    return await res.text();
  } else if (env.isNode) {
    const { readFile } = await import("node:fs/promises");
    return await readFile(path, "utf8");
  }
  throw new Error("Unknown runtime: cannot read files");
}

async function readJSON(path) {
  const txt = await readText(path);
  return JSON.parse(txt);
}

/* ------------------------------ Canonical Paths ------------------------------- */
/* Adjust these to match your repo layout. They point to the single source of truth. */

const paths = {
  // Cosmogenesis (Spirit)
  codexInstructions: "/docs/CODEX_INSTRUCTIONS.md",
  scienceReferences: "/docs/SCIENCE_REFERENCES.md",
  styleGuide: "/docs/STYLE_GUIDE.md",
  cornerstoneCharter: "/docs/CORNERSTONE_CHARTER.md",
  milestones: "/docs/CODEX_MILESTONES.md", // optional
  // Shared data contracts
  spiralMap: "/data/spiral_map.json",
  angels: "/data/angels.json",
  stylepacks: "/data/stylepacks/stylepacks.json",
  provenanceSchema: "/schemas/provenance.json", // can be generated from below
  // Trinity links (relative, if you serve all three repos under one root)
  stoneGrimoireNotes: "/stone-grimoire/docs/CODEX_NOTES.md",
  circuitumNotes: "/circuitum99/docs/CODEX_NOTES.md",
};

/* --------------------------- Minimal Markdown Helper --------------------------- */

function extractHeadings(md) {
  // returns [{level, text}] for quick indexing
  return md
    .split("\n")
    .map((line) => {
      const m = /^(#{1,6})\s+(.+)$/.exec(line.trim());
      return m ? { level: m[1].length, text: m[2].replace(/\*|_/g, "") } : null;
    })
    .filter(Boolean);
}

/* --------------------------------- Schemas ------------------------------------ */
/* JSON Schemas are designed to be used with any validator (Ajv, Valibot, Zod-to-json). */

const schemas = {
  provenance: {
    $id: "https://cosmogenesis/schemas/provenance.json",
    type: "object",
    additionalProperties: false,
    required: ["title", "creator", "year", "license", "source"],
    properties: {
      id: { type: "string", description: "Stable internal id or slug" },
      title: { type: "string" },
      creator: { type: "string", description: "Author/Artist or corporate name" },
      year: { type: "string" },
      edition: { type: "string" },
      license: {
        type: "string",
        enum: ["CC0", "CC-BY", "CC-BY-SA", "CC-BY-NC", "Public Domain", "Open Access", "Custom-Sponsor"],
      },
      source: { type: "string", description: "URL or archive id" },
      notes: { type: "string" },
      tags: { type: "array", items: { type: "string" } },
      // Safety flags (for ND-safe rendering)
      safety: {
        type: "object",
        additionalProperties: false,
        properties: {
          motionSensitive: { type: "boolean", default: false },
          highContrast: { type: "boolean", default: false },
          audioReactive: { type: "boolean", default: false },
        },
      },
    },
  },

  stylepack: {
    $id: "https://cosmogenesis/schemas/stylepack.json",
    type: "object",
    required: ["id", "name", "palette", "motifs"],
    additionalProperties: true,
    properties: {
      id: { type: "string" },
      name: { type: "string" }, // e.g. "Visionary Perm", "Business Cathedral", "Agrippa"
      palette: {
        type: "object",
        required: ["gold", "obsidian", "roseQuartz", "tealGlow, violet".split(", ")[4] ? "violet" : "violet"],
        properties: {
          gold: { type: "string", pattern: "^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$" },
          obsidian: { type: "string" },
          roseQuartz: { type: "string" },
          tealGlow: { type: "string" },
          violet: { type: "string" },
        },
      },
      type: { type: "string", enum: ["Perm", "Business", "Visionary", "Lineage", "Custom"] },
      motifs: { type: "array", items: { type: "string" } }, // Rosslyn pillar, vesica, 33 orbs, guardian cat, etc.
      textures: { type: "array", items: { type: "string" } }, // URLs or asset ids for vellum, stained glass, obsidian, gold leaf
      shaders: { type: "array", items: { type: "string" } }, // shader preset ids (nebula, marble, stained-glass)
    },
  },

  chamberNode: {
    $id: "https://cosmogenesis/schemas/chamberNode.json",
    type: "object",
    required: ["id", "title", "skin", "guardian", "payload"],
    additionalProperties: false,
    properties: {
      id: { type: "string" }, // e.g. "n002"
      title: { type: "string" },
      skin: { type: "string" }, // matches stylepack id
      guardian: {
        type: "string",
        enum: ["Alignment", "Integration", "Fusion", "Spiral", "Gate", "Voice"],
      },
      position: {
        type: "object",
        properties: {
          theta: { type: "number" },
          radius: { type: "number" },
          elevation: { type: "number" },
        },
      },
      payload: {
        type: "object",
        properties: {
          visuals: { type: "array", items: { type: "string" } }, // asset ids
          text: { type: "string" },
          audioPreset: { type: "string" }, // Tone.js preset id
          provenanceRefs: { type: "array", items: { type: "string" } }, // links to provenance items
        },
      },
      safety: {
        type: "object",
        properties: {
          reducedMotionOK: { type: "boolean", default: true },
          allowAudio: { type: "boolean", default: false },
        },
      },
    },
  },
};

/* ---------------------------- ND-Safe UX Defaults ----------------------------- */

const safety = {
  motion: { reduced: true, transitions: "smooth", noStrobe: true },
  audio: { autoplay: false, fadeMs: 1200, gainDb: -12, limiter: true },
  contrast: { calmMode: true, preferDark: true },
  // Render guidelines
  render: {
    neverSVGOnly: true, // enforce painterly pipeline
    preferPainterly: true,
    minExportPx: 3840, // 4K minimum width
  },
};

/* ----------------------------- Milestone Registry ----------------------------- */

const tasks = [
  {
    id: "phase-1-foundation",
    title: "Foundation",
    done: false,
    items: [
      "Add CORNERSTONE_CHARTER.md & SCIENCE_REFERENCES.md",
      "Cross-link Trinity repos",
    ],
  },
  {
    id: "phase-2-spiral-engine",
    title: "Spiral Engine",
    done: false,
    items: [
      "Build 23.5° tilted logarithmic spiral (spiral-engine.js)",
      "Map nodes in data/spiral_map.json",
      "Angel glyph hover + invocation overlay",
    ],
  },
  {
    id: "phase-3-chamber-skins",
    title: "Chamber Skins (Tesseract)",
    done: false,
    items: [
      "Implement skins: Agrippa, Tesla, Hypatia, Business, Visionary",
      "Store definitions in /data/stylepacks/",
      "Ensure smooth ND-safe morphs",
    ],
  },
  {
    id: "phase-4-visionary-art",
    title: "Visionary Art Engine",
    done: false,
    items: [
      "Replace SVG with painterly pipeline (Paper.js + Three.js/WebGL)",
      "Overlay: af Klint, Kunz, Splendor Solis (provenance intact)",
      "Export 4K+ Vision Plates (PNG/WEBP)",
    ],
  },
  {
    id: "phase-5-harmonics",
    title: "Harmonics",
    done: false,
    items: [
      "Add sound-engine.js (Tone.js)",
      "Planetary tones, cathedral IR, Solfeggio glides",
      "Toggle only, smooth fades",
    ],
  },
  {
    id: "phase-6-provenance-safety",
    title: "Provenance & Safety",
    done: false,
    items: [
      "Implement provenance.json schema + validation",
      "Add Calm Mode + reduced-motion compliance",
      "Export JSON journey + Vision Plate",
    ],
  },
  {
    id: "phase-7-business",
    title: "Business Integration",
    done: false,
    items: [
      "Add readme_fusion.md (sponsor-facing)",
      "Business Cathedral deck skin",
      "Package avatar packs (Perm Style) & present folios",
    ],
  },
];

/* ---------------------------- Instruction Loader ------------------------------ */

async function loadInstructions() {
  const [inst, sci, style, charter, miles] = await Promise.allSettled([
    readText(paths.codexInstructions),
    readText(paths.scienceReferences),
    readText(paths.styleGuide),
    readText(paths.cornerstoneCharter),
    readText(paths.milestones).catch(() => ""), // optional
  ]);

  const instructions = inst.status === "fulfilled" ? inst.value : "# Missing CODEX_INSTRUCTIONS.md";
  const science = sci.status === "fulfilled" ? sci.value : "";
  const styleGuide = style.status === "fulfilled" ? style.value : "";
  const cornerstone = charter.status === "fulfilled" ? charter.value : "";
  const milestones = miles.status === "fulfilled" ? miles.value : "";

  const headings = {
    instructions: extractHeadings(instructions),
    science: extractHeadings(science),
    styleGuide: extractHeadings(styleGuide),
    cornerstone: extractHeadings(cornerstone),
    milestones: extractHeadings(milestones),
  };

  return { instructions, science, styleGuide, cornerstone, milestones, headings };
}

/* --------------------------------- Guards ------------------------------------ */

function assertNeverOverwrite() {
  // Soft guard: engines should never write to docs by default.
  // If you add editor features later, gate them behind explicit user consent.
  return Object.freeze({
    canWriteDocs: false,
    note: "Codex EXT is read-only for docs. Expand, refine via PRs--do not overwrite.",
  });
}

/* ---------------------------------- API -------------------------------------- */

export const codexEXT = {
  paths,
  schemas,
  safety,
  tasks,

  async init() {
    const instructions = await loadInstructions();

    // Try loading shared data contracts (optional in first boot)
    const [spiralMap, angels, stylepacks] = await Promise.allSettled([
      readJSON(paths.spiralMap).catch(() => ({})),
      readJSON(paths.angels).catch(() => ({})),
      readJSON(paths.stylepacks).catch(() => ({})),
    ]);

    const data = {
      spiralMap: spiralMap.status === "fulfilled" ? spiralMap.value : {},
      angels: angels.status === "fulfilled" ? angels.value : {},
      stylepacks: stylepacks.status === "fulfilled" ? stylepacks.value : {},
    };

    const guards = assertNeverOverwrite();

    // Provide tiny helpers every engine can use.
    const helpers = Object.freeze({
      getHeadingIndex: () => instructions.headings,
      hasCalmMode: () => safety.contrast.calmMode === true,
      painterlyRequired: () => safety.render.neverSVGOnly === true,
      defaultPalette() {
        return {
          gold: "#C9A227",
          obsidian: "#0B0B0B",
          roseQuartz: "#FFB6C1",
          tealGlow: "#00CED1",
          violet: "#8A2BE2",
        };
      },
    });

    return Object.freeze({
      instructions, // {instructions, science, styleGuide, cornerstone, milestones, headings}
      data,         // {spiralMap, angels, stylepacks}
      schemas,      // JSON Schemas
      safety,       // ND-safe defaults
      tasks,        // milestone registry
      guards,       // never overwrite docs
      paths,        // canonical paths
      helpers,      // tiny helper set
    });
  },
};

/* ------------------------------ Inline Sanity -------------------------------- */
/* This allows quick one-liner checks in dev consoles:
   (async () => console.log(await codexEXT.init()))();
*/