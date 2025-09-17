#!/usr/bin/env node
// Enforce ND-safe covenant rules for datasets and static pages.
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.join(path.dirname(new URL(import.meta.url).pathname), ".."));
const PROVENANCE_TEXT = "© Rebecca Respawn · Codex 144:99 · CC-BY-SA-4.0 · Provenance";
const REGISTRY_FILES = [
  "registry/numerology_full.json",
  "registry/angels72.json",
  "registry/goetia72.json",
  "registry/taras21.json",
  "registry/rays7.json",
  "registry/solfeggio.json",
  "registry/crystals.json",
  "registry/monad.json"
];

function addIssue(issues, message) {
  issues.push(message);
}

async function loadJson(relativePath) {
  const full = path.join(ROOT, relativePath);
  const raw = await fs.readFile(full, "utf8");
  return JSON.parse(raw);
}

function ensureCitations(records, label, issues) {
  for (const record of records) {
    if (!record || typeof record !== "object") {
      addIssue(issues, `${label} contains a malformed record.`);
      continue;
    }
    if (!Array.isArray(record.citations) || record.citations.length === 0) {
      addIssue(issues, `${label} has a record without citations.`);
    }
  }
}

async function checkRegistries(issues) {
  for (const file of REGISTRY_FILES) {
    try {
      const payload = await loadJson(file);
      if (payload && Array.isArray(payload.records)) {
        ensureCitations(payload.records, file, issues);
      } else {
        addIssue(issues, `${file} is missing a records array.`);
      }
    } catch (error) {
      addIssue(issues, `Failed to read ${file}: ${error.message}`);
    }
  }
  // geometry files
  const geometryDir = path.join(ROOT, "registry", "geometry");
  const geometryFiles = await fs.readdir(geometryDir);
  for (const file of geometryFiles) {
    if (!file.endsWith(".json")) continue;
    const payload = await loadJson(path.join("registry", "geometry", file));
    ensureCitations([payload], `registry/geometry/${file}`, issues);
  }
}

async function checkHtmlFiles(issues) {
  const siteDir = path.join(ROOT, "site");
  async function walk(current) {
    const items = await fs.readdir(current, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(current, item.name);
      if (item.isDirectory()) {
        await walk(full);
      } else if (item.isFile() && item.name.endsWith(".html")) {
        const html = await fs.readFile(full, "utf8");
        const relative = path.relative(ROOT, full);
        if (!html.includes(PROVENANCE_TEXT)) {
          addIssue(issues, `${relative} is missing provenance chip text.`);
        }
        if (/<[^>]*autoplay/i.test(html)) {
          addIssue(issues, `${relative} references autoplay.`);
        }
        const imgMatches = html.match(/<img[^>]*>/gi) || [];
        for (const tag of imgMatches) {
          if (!/alt="[^"]+"/i.test(tag)) {
            addIssue(issues, `${relative} has an <img> without alt text.`);
          }
          const srcMatch = tag.match(/src="([^"]+)"/i);
          if (srcMatch) {
            const src = srcMatch[1];
            if (!/\.(png|webp|avif)$/i.test(src)) {
              addIssue(issues, `${relative} uses a disallowed image format: ${src}`);
            }
          }
        }
      }
    }
  }
  await walk(siteDir);
}

async function checkNetlify(issues) {
  const netlifyPath = path.join(ROOT, "netlify.toml");
  try {
    const content = await fs.readFile(netlifyPath, "utf8");
    if (!content.includes("Content-Security-Policy")) {
      addIssue(issues, "netlify.toml is missing Content-Security-Policy header.");
    }
  } catch (error) {
    addIssue(issues, `Unable to read netlify.toml: ${error.message}`);
  }
}

async function main() {
  const issues = [];
  await checkRegistries(issues);
  await checkHtmlFiles(issues);
  await checkNetlify(issues);
  if (issues.length) {
    console.error("Covenant check failed:");
    for (const issue of issues) {
      console.error(` - ${issue}`);
    }
    process.exit(1);
  } else {
    console.log("Covenant check passed.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
