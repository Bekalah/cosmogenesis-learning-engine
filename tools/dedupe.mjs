import { promises as fs } from "fs";
import { execSync } from "child_process";

/*
  dedupe.mjs
  ND-safe guard against duplicate lines.
  Usage:
    node tools/dedupe.mjs        # report duplicates
    node tools/dedupe.mjs --write # fix files in place
*/

// Pure function: remove consecutive duplicate lines
export function dedupeLines(text) {
  const lines = text.split("\n");
  const out = [];
  const dups = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === lines[i - 1]) {
      dups.push(i + 1); // 1-indexed line number
      continue; // skip duplicate
    }
    out.push(lines[i]);
  }
  return { text: out.join("\n"), dups };
}

// Process a single file; write only when requested
async function scanFile(file, write) {
  const data = await fs.readFile(file, "utf8");
  if (data.includes("\0")) return; // skip binary files
  const { text, dups } = dedupeLines(data);
  if (dups.length) {
    console.log(`${file}: duplicate lines at ${dups.join(", ")}`);
    if (write) {
      await fs.writeFile(file, text, "utf8");
    }
  }
}

// Discover tracked files and scan each one
async function main() {
  const write = process.argv.includes("--write");
  const files = execSync("git ls-files", { encoding: "utf8" })
    .trim()
    .split("\n");
  for (const file of files) {
    if (file.startsWith("node_modules/") || file.startsWith(".git/")) continue;
    await scanFile(file, write);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
