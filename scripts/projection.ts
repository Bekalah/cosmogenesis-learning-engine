import { promises as fs } from "node:fs";
import path from "node:path";
// TypeScript source for projection pipeline; see projection.mjs for runtime copy.
import { migrateResearchToRegistry } from "../upgrade/migrations/migrate_research_to_registry";

interface Projection {
  generatedAt: string;
  features: Record<string, unknown>;
  registries: Record<string, unknown>;
}

const ROOT = path.resolve(path.join(__dirname, ".."));

async function readJson(relativePath: string): Promise<any> {
  const fullPath = path.join(ROOT, relativePath);
  const raw = await fs.readFile(fullPath, "utf8");
  return JSON.parse(raw);
}

function ensureCitations(name: string, records: unknown[]): void {
  for (const record of records) {
    if (!record || typeof record !== "object") {
      throw new Error(`Registry ${name} contains a non-object record.`);
    }
    const citations = (record as { citations?: unknown }).citations;
    if (!Array.isArray(citations) || citations.length === 0) {
      throw new Error(`Registry ${name} record is missing citations.`);
    }
  }
}

async function loadRegistry(relativePath: string, key: string, requireCitations: boolean, output: Record<string, unknown>): Promise<void> {
  const payload = await readJson(relativePath);
  if (requireCitations) {
    const records = (payload && typeof payload === "object" && Array.isArray((payload as any).records)) ? (payload as any).records : [];
    ensureCitations(key, records);
  }
  output[key] = payload;
}

async function loadGeometry(requireCitations: boolean, output: Record<string, unknown>): Promise<void> {
  const dir = path.join(ROOT, "registry", "geometry");
  const files = await fs.readdir(dir);
  const geometries: any[] = [];
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

async function buildScrollManifest(): Promise<void> {
  const docsRoot = path.join(ROOT, "docs");
  const spineRoot = path.join(ROOT, "spine");
  const outputPath = path.join(ROOT, "site", "scrolls", "scrolls-manifest.json");
  await migrateResearchToRegistry({ docsRoot, spineRoot, outputPath });
  // Normalize manifest paths so the static page can open them from /site/scrolls/.
  const manifestRaw = await fs.readFile(outputPath, "utf8");
  const manifest = JSON.parse(manifestRaw);
  if (manifest && Array.isArray(manifest.records)) {
    for (const record of manifest.records) {
      if (record && typeof record === "object") {
        const rel = record.path as string;
        if (typeof rel === "string" && !rel.startsWith("../")) {
          record.path = path.join("..", "..", rel).replace(/\\/g, "/");
        }
      }
    }
  }
  await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2));
}

async function main(): Promise<void> {
  const toggles = await readJson(path.join("config", "toggles.json"));
  const features = toggles.features ?? {};
  const projection: Projection = {
    generatedAt: new Date().toISOString(),
    features,
    registries: {},
  };
  const requireCitations = Boolean(features.strict_provenance);
  await loadRegistry("registry/numerology_full.json", "numerology", requireCitations, projection.registries);
  await loadRegistry("registry/angels72.json", "angels", requireCitations, projection.registries);
  await loadRegistry("registry/goetia72.json", "goetia", requireCitations, projection.registries);
  await loadRegistry("registry/taras21.json", "taras", requireCitations, projection.registries);
  await loadRegistry("registry/rays7.json", "rays", requireCitations, projection.registries);
  await loadRegistry("registry/solfeggio.json", "solfeggio", requireCitations, projection.registries);
  await loadRegistry("registry/crystals.json", "crystals", requireCitations, projection.registries);
  await loadRegistry("registry/monad.json", "monad", requireCitations, projection.registries);
  await loadGeometry(requireCitations, projection.registries);
  const outputPath = path.join(ROOT, "registry", "projection.json");
  await fs.writeFile(outputPath, JSON.stringify(projection, null, 2));
  await buildScrollManifest();
  console.log(`Projection written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
