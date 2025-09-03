import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

// Simple sanity check
import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadConfig } from '../src/configLoader.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadConfig, loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

// Simple sanity check
test('basic arithmetic works', () => {
  assert.equal(1 + 1, 2);
});
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadConfig, loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

// Simple sanity check
test('basic arithmetic works', () => {
  assert.equal(1 + 1, 2);
});

test('renderPlate renders first demo plate without throwing', () => {
  const demos = loadConfig(join(__dirname, '..', 'data', 'demos.json'));
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

test('renderPlate renders first demo plate without throwing', () => {
  const demos = loadConfig(join(__dirname, '..', 'data', 'demos.json'));
  const config = demos[0].config;
  const plate = renderPlate(config);
  assert.equal(plate.layout, config.layout);
  assert.equal(plate.labels.length, config.mode);
test('loadFirstDemo returns valid config', () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, 'string');
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

test('loadConfig returns valid plate config', () => {
  const config = loadConfig('test/fixtures/wheel.json');
  validatePlateConfig(config);
test("loadFirstDemo returns valid config", () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, "string");
  assert.equal(config.labels.length, config.mode);
});

test("renderPlate creates items for basic wheel", () => {
  const plate = renderPlate({
    layout: "wheel",
    mode: 3,
    labels: ["a", "b", "c"],
  });
  assert.equal(plate.items.length, 3);
test('smoke: renderPlate yields points', () => {
  const cfg = loadFirstDemo();
  const { points } = renderPlate(cfg);
  assert.ok(Array.isArray(points) && points.length > 0, 'points generated');
});
test('renderPlate renders first demo plate without throwing', () => {
  const demos = loadConfig(join(__dirname, '..', 'data', 'demos.json'));
  const config = demos[0].config;
  const plate = renderPlate(config);
  assert.equal(plate.layout, config.layout);
  assert.equal(plate.labels.length, config.mode);
});
