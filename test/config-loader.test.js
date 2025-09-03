import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, unlinkSync } from "node:fs";
import {
  loadConfig,
  validatePlateConfig,
  loadFirstDemo,
} from "../src/configLoader.js";

// Ensure loadConfig surfaces invalid JSON errors
test("loadConfig throws on invalid JSON", () => {
  const file = "test/fixtures/bad.json";
  writeFileSync(file, "{");
  assert.throws(() => loadConfig(file), /Invalid JSON/);
  unlinkSync(file);
});

// Validate schema enforcement
test("validatePlateConfig enforces label count", () => {
  const good = { layout: "spiral", mode: 1, labels: ["x"] };
  validatePlateConfig(good);
  const bad = { ...good, labels: [] };
  assert.throws(() => validatePlateConfig(bad), /Label count/);
});

// Smoke test for loadFirstDemo

test("loadFirstDemo returns valid config", () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, "string");
  assert.equal(config.labels.length, config.mode);
});
