import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Export the IndraNet engine for external use
export { IndraNet } from "./app/engines/IndraNet.js";

// Load bridge dataset to share core lattice data
import bridge from "./bridge/c99-bridge.json" assert { type: "json" };
export { bridge };

// Helper to load any dataset JSON from the data folder
const __dirname = dirname(fileURLToPath(import.meta.url));
export async function loadDataset(name) {
  const file = join(__dirname, "data", `${name}.json`);
  const text = await readFile(file, "utf8");
  return JSON.parse(text);
}
