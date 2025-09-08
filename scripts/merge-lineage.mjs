import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Merge structure with lineage map to produce enriched structure.
// Keeps input untouched and writes data/structure.enriched.json.

const root = process.cwd();
const structurePath = resolve(root, "data/structure.json");
const lineagePath = resolve(root, "data/tree-of-fusion-artists.json");
const outPath = resolve(root, "data/structure.enriched.json");

const structure = JSON.parse(readFileSync(structurePath, "utf8"));
const lineage = JSON.parse(readFileSync(lineagePath, "utf8"));

const enriched = { rooms: structure, lineage };

writeFileSync(outPath, JSON.stringify(enriched, null, 2));
console.log("Enriched structure written to", outPath);
