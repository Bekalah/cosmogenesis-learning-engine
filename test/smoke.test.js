import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFirstDemo } from '../src/configLoader.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';
import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { loadConfig, loadFirstDemo } from "../src/configLoader.js";
import { renderPlate } from "../src/renderPlate.js";

test('renderPlate renders first demo without error', () => {
  const cfg = loadFirstDemo();
  const plate = renderPlate(cfg);
  assert.equal(plate.layout, cfg.layout);
  assert.equal(plate.items.length, cfg.mode);
import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { loadConfig, loadFirstDemo } from "../src/configLoader.js";
import { renderPlate } from "../src/renderPlate.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("basic arithmetic works", () => {
  assert.equal(1 + 1, 2);
});

test("renderPlate renders first demo plate without throwing", () => {
  const demos = loadConfig(join(__dirname, "..", "data", "demos.json"));
  const config = demos[0].config;
  const plate = renderPlate(config);
  assert.equal(plate.layout, config.layout);
  assert.equal(plate.labels.length, config.mode);
});
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

test("loadFirstDemo returns valid config", () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, "string");
test('loadConfig returns valid plate config', () => {
  const config = loadConfig('test/fixtures/wheel.json');
  validatePlateConfig(config);
  assert.equal(config.labels.length, config.mode);
});

test("renderPlate creates items for basic wheel", () => {
  const plate = renderPlate({
    layout: "wheel",
    mode: 3,
    labels: ["a", "b", "c"],
  });
  assert.equal(plate.items.length, 3);
});
