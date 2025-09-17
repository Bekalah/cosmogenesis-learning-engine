import { promises as fs } from "node:fs";
import path from "node:path";
import { loadLegacyScrolls, LegacyScroll } from "../adapters/legacy_research_adapter";

interface MigrationOptions {
  docsRoot: string;
  spineRoot: string;
  outputPath: string;
}

interface RegistryRecord {
  slug: string;
  title: string;
  excerpt: string;
  path: string;
  citations: string[];
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

function normalisePath(root: string, filePath: string): string {
  const relative = path.relative(root, filePath).replace(/\\/g, "/");
  return relative.startsWith(".") ? relative : relative;
}

function toRegistryRecord(scroll: LegacyScroll, baseRoot: string): RegistryRecord {
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

export async function migrateResearchToRegistry(options: MigrationOptions): Promise<void> {
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
