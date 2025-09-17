import { promises as fs } from "node:fs";
import path from "node:path";
import { migrateResearchToRegistry } from "../upgrade/migrations/migrate_research_to_registry.js";

const ROOT = path.resolve(path.join(path.dirname(new URL(import.meta.url).pathname), ".."));

async function readJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  const raw = await fs.readFile(fullPath, "utf8");
  return JSON.parse(raw);
}

function ensureCitations(name, records) {
  for (const record of records) {
    if (!record || typeof record !== "object") {
      throw new Error(`Registry ${name} contains a non-object record.`);
    }
    const citations = record.citations;
    if (!Array.isArray(citations) || citations.length === 0) {
      throw new Error(`Registry ${name} record is missing citations.`);
    }
  }
}

async function loadRegistry(relativePath, key, requireCitations, output) {
  const payload = await readJson(relativePath);
  if (requireCitations && payload && Array.isArray(payload.records)) {
    ensureCitations(key, payload.records);
  }
  output[key] = payload;
}

async function loadGeometry(requireCitations, output) {
  const dir = path.join(ROOT, "registry", "geometry");
  const files = await fs.readdir(dir);
  const geometries = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const payload = await readJson(path.join("registry", "geometry", file));
    if (requireCitations) {
      ensureCitations(`geometry:${file}`, [payload]);
    }
    geometries.push(payload);
  }
  output.geometry = geometries;
}

async function buildScrollManifest() {
  const docsRoot = path.join(ROOT, "docs");
  const spineRoot = path.join(ROOT, "spine");
  const outputPath = path.join(ROOT, "site", "scrolls", "scrolls-manifest.json");
  await migrateResearchToRegistry({ docsRoot, spineRoot, outputPath });
  const manifestRaw = await fs.readFile(outputPath, "utf8");
  const manifest = JSON.parse(manifestRaw);
  if (manifest && Array.isArray(manifest.records)) {
    for (const record of manifest.records) {
      if (record && typeof record === "object" && typeof record.path === "string") {
        if (!record.path.startsWith("../")) {
          record.path = path.join("..", "..", record.path).replace(/\\/g, "/");
        }
      }
    }
  }
  await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2));
}

async function main() {
  const toggles = await readJson(path.join("config", "toggles.json"));
  const features = toggles.features ?? {};
  const requireCitations = Boolean(features.strict_provenance);
  const registries = {};
  await loadRegistry("registry/numerology_full.json", "numerology", requireCitations, registries);
  await loadRegistry("registry/angels72.json", "angels", requireCitations, registries);
  await loadRegistry("registry/goetia72.json", "goetia", requireCitations, registries);
  await loadRegistry("registry/taras21.json", "taras", requireCitations, registries);
  await loadRegistry("registry/rays7.json", "rays", requireCitations, registries);
  await loadRegistry("registry/solfeggio.json", "solfeggio", requireCitations, registries);
  await loadRegistry("registry/crystals.json", "crystals", requireCitations, registries);
  await loadRegistry("registry/monad.json", "monad", requireCitations, registries);
  await loadGeometry(requireCitations, registries);
  const projection = {
    generatedAt: new Date().toISOString(),
    features,
    registries,
  };
  const outputPath = path.join(ROOT, "registry", "projection.json");
  await fs.writeFile(outputPath, JSON.stringify(projection, null, 2));
  await buildScrollManifest();
  console.log(`Projection written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
