import { promises as fs } from "node:fs";
import path from "node:path";
import { loadLegacyScrolls } from "../adapters/legacy_research_adapter.js";

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

function normalisePath(root, filePath) {
  const relative = path.relative(root, filePath).replace(/\\/g, "/");
  return relative.startsWith(".") ? relative : relative;
}

function toRegistryRecord(scroll, baseRoot) {
  const citations = scroll.citations.length ? scroll.citations : [
    `Source manuscript: ${scroll.relativePath}`,
  ];
  return {
    slug: scroll.slug,
    title: scroll.title,
    excerpt: scroll.excerpt,
    path: normalisePath(baseRoot, scroll.absolutePath),
    citations,
  };
}

export async function migrateResearchToRegistry(options) {
  const docs = (await pathExists(options.docsRoot)) ? await loadLegacyScrolls(options.docsRoot) : [];
  const spine = (await pathExists(options.spineRoot)) ? await loadLegacyScrolls(options.spineRoot) : [];
  const combined = [
    ...docs.map((scroll) => toRegistryRecord(scroll, options.docsRoot)),
    ...spine.map((scroll) => toRegistryRecord(scroll, options.spineRoot)),
  ];
  const payload = {
    generatedAt: new Date().toISOString(),
    records: combined,
  };
  await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
  await fs.writeFile(options.outputPath, JSON.stringify(payload, null, 2));
}
