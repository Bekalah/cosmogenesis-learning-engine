import { promises as fs } from "node:fs";
import path from "node:path";

export interface LegacyScroll {
  slug: string;
  title: string;
  excerpt: string;
  citations: string[];
  absolutePath: string;
  relativePath: string;
}

async function readMarkdown(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return buffer.toString("utf8");
}

function extractTitle(markdown: string, fallback: string): string {
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) {
      return trimmed.replace(/^#+\s*/, "").trim() || fallback;
    }
  }
  return fallback;
}

function extractExcerpt(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (!line.trim()) {
      if (current.length) {
        paragraphs.push(current.join(" ").trim());
        current = [];
      }
    } else if (!line.trim().startsWith("#")) {
      current.push(line.trim());
    }
    if (paragraphs.length) {
      break;
    }
  }
  if (current.length && !paragraphs.length) {
    paragraphs.push(current.join(" ").trim());
  }
  const first = paragraphs[0] || "Provenance excerpt unavailable.";
  return first.slice(0, 320);
}

export async function loadLegacyScrolls(root: string): Promise<LegacyScroll[]> {
  const entries: LegacyScroll[] = [];
  async function walk(currentDir: string) {
    const listing = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of listing) {
      const absolute = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        const markdown = await readMarkdown(absolute);
        const slug = absolute
          .replace(root, "")
          .replace(/\\/g, "/")
          .replace(/^\/+/, "");
        const title = extractTitle(markdown, slug);
        const excerpt = extractExcerpt(markdown);
        const citations = [] as string[];
        entries.push({
          slug,
          title,
          excerpt,
          citations,
          absolutePath: absolute,
          relativePath: slug,
        });
      }
    }
  }
  await walk(root);
  return entries;
}
