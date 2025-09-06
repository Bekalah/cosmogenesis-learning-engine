import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadConfig, loadFirstDemo } from '../src/configLoader.js';
import { renderPlate } from '../src/renderPlate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('basic arithmetic works', () => {
  assert.equal(1 + 1, 2);
});

test('renderPlate renders first demo plate without throwing', () => {
  const demos = loadConfig(join(__dirname, '..', 'data', 'demos.json'));
  const config = demos[0].config;
  const plate = renderPlate(config);
  assert.equal(plate.layout, config.layout);
  assert.equal(plate.items.length, config.mode);
});

test('smoke: renderPlate yields points', () => {
  const cfg = loadFirstDemo();
  const { points } = renderPlate(cfg);
  assert.ok(Array.isArray(points) && points.length > 0);
});
