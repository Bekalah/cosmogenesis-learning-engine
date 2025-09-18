import { promises as fs } from "node:fs";
import path from "node:path";

export async function loadLegacyScrolls(root) {
  const entries = [];
  async function readMarkdown(filePath) {
    const buffer = await fs.readFile(filePath);
    return buffer.toString("utf8");
  }
  function extractTitle(markdown, fallback) {
    const lines = markdown.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#")) {
        const title = trimmed.replace(/^#+\s*/, "").trim();
        if (title) {
          return title;
        }
      }
    }
    return fallback;
  }
  function extractExcerpt(markdown) {
    const lines = markdown.split(/\r?\n/);
    const paragraphs = [];
    let current = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (current.length) {
          paragraphs.push(current.join(" ").trim());
          current = [];
        }
      } else if (!trimmed.startsWith("#")) {
        current.push(trimmed);
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
  async function walk(currentDir) {
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
        entries.push({
          slug,
          title,
          excerpt,
          citations: [],
          absolutePath: absolute,
          relativePath: slug,
        });
      }
    }
  }
  await walk(root);
  return entries;
}
