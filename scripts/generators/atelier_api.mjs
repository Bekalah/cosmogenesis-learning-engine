import { readFileSync } from "node:fs";
import { join } from "node:path";

// Small helper to load parameters and procedures for a given atelier.
export function loadAtelier(id) {
  const base = join("docs", "ateliers", id);
  const params = JSON.parse(readFileSync(join(base, "params.json"), "utf8"));
  const steps = readFileSync(join(base, "procedures.md"), "utf8")
    .trim()
    .split("\n");
  return { params, steps };
}

// Returns mapping of angels to ateliers.
export function getAngels() {
  const path = join("data", "angels_ateliers.json");
  return JSON.parse(readFileSync(path, "utf8"));
}
