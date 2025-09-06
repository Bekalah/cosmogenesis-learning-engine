import { test } from "node:test";
import assert from "node:assert/strict";
import { loadFirstDemo, validatePlateConfig } from "../src/configLoader.js";

test("loadFirstDemo returns a validated config with resources", () => {
  const config = loadFirstDemo();
  validatePlateConfig(config);
  assert.ok(Array.isArray(config.labels));
  assert.ok(Array.isArray(config.resources));
  assert.strictEqual(config.resources[0].title, "Color Theory");
});
