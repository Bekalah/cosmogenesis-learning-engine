
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
import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, unlinkSync } from 'node:fs';
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';

// Ensure loadConfig surfaces invalid JSON errors
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strict as assert } from 'node:assert';
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';
import { strict as assert } from 'assert';
import { writeFileSync, unlinkSync } from 'fs';
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';
import { strict as assert } from 'assert';
import { writeFileSync, unlinkSync } from 'fs';
import { loadConfig, validatePlateConfig, ConfigError } from '../src/configLoader.js';

// Ensure loadConfig surfaces invalid JSON errors

import { strict as assert } from 'assert';
import { writeFileSync, unlinkSync } from 'fs';
import { loadConfig, validatePlateConfig, ConfigError } from '../src/configLoader.js';

// Ensure loadConfig surfaces invalid JSON errors
import { test } from 'node:test';
import { strict as assert } from 'assert';
import { writeFileSync, unlinkSync } from 'fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, unlinkSync } from 'node:fs';
import { test } from 'node:test';
import { strict as assert } from 'assert';
import { writeFileSync, unlinkSync } from 'fs';
import { loadConfig, validatePlateConfig } from '../src/configLoader.js';

// Ensure loadConfig surfaces invalid JSON errors
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

test('validatePlateConfig enforces label count', () => {
  const good = { layout: 'spiral', mode: 1, labels: ['x'] };
test("validatePlateConfig enforces label count", () => {
  const good = { layout: "spiral", mode: 1, labels: ["x"] };
  validatePlateConfig(good);
  const bad = { ...good, labels: [] };
  assert.throws(() => validatePlateConfig(bad), /Label count/);
// Ensure loadConfig surfaces missing file errors
test('loadConfig throws on missing file', () => {
  assert.throws(() => loadConfig('nope.json'), ConfigError);
});
// Ensure loadConfig surfaces missing file errors
test('loadConfig throws on missing file', () => {
  assert.throws(() => loadConfig('nope.json'), ConfigError);
});

// Validate schema enforcement
test('validatePlateConfig aggregates errors', () => {
  const bad = { layout: 'unknown', mode: -1, labels: [] };
  assert.throws(() => validatePlateConfig(bad), (err) => {
    return (
      err instanceof ConfigError &&
      err.messages.includes('layout must be one of: spiral, twin-cone, wheel, grid') &&
      err.messages.includes('mode must be a positive integer') &&
      err.messages.includes('label count must match mode')
  const bad = { layout: 'unknown', mode: 0, labels: [] };
  assert.throws(() => validatePlateConfig(bad), (err) => {
    return (
      err instanceof ConfigError &&
      err.messages.some((m) => m.includes('layout')) &&
      err.messages.some((m) => m.includes('mode')) &&
      err.messages.some((m) => m.includes('labels'))
    );
  });
// Smoke test for loadFirstDemo

test("loadFirstDemo returns valid config", () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, "string");
  assert.equal(config.labels.length, config.mode);
});
