
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadFirstDemo, validatePlateConfig } from "../src/configLoader.js";

test("loadFirstDemo returns a validated config with resources", () => {
  const config = loadFirstDemo();
  validatePlateConfig(config);
  assert.ok(Array.isArray(config.labels));
  assert.ok(Array.isArray(config.resources));
  assert.strictEqual(config.resources[0].title, "Color Theory");

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, unlinkSync } from 'node:fs';
import { loadConfig, validatePlateConfig, loadFirstDemo, ConfigError } from '../src/configLoader.js';

test('loadConfig throws on invalid JSON', () => {
  const file = 'temp-bad.json';
  writeFileSync(file, '{');
  assert.throws(() => loadConfig(file), (err) => err instanceof ConfigError && /Invalid JSON/.test(err.message));
  unlinkSync(file);
});

test('loadConfig throws on missing file', () => {
  assert.throws(() => loadConfig('nope.json'), ConfigError);
});

test('validatePlateConfig enforces label count', () => {
  const good = { layout: 'spiral', mode: 1, labels: ['x'] };
  assert.equal(validatePlateConfig(good), true);
  const bad = { ...good, labels: [] };
  assert.throws(() => validatePlateConfig(bad), (err) => err instanceof ConfigError && /label count/.test(err.message));
});

test('loadFirstDemo returns valid config', () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, 'string');
  assert.equal(config.labels.length, config.mode);

});
