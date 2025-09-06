import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { loadConfig, validatePlateConfig, ConfigError } from '../src/configLoader.js';

const fixturesDir = 'test/fixtures';
mkdirSync(fixturesDir, { recursive: true });

test('loadConfig throws on invalid JSON', () => {
  const file = `${fixturesDir}/bad.json`;
  writeFileSync(file, '{');
  assert.throws(
    () => loadConfig(file),
    (err) => err instanceof ConfigError && /Invalid JSON/.test(err.message)
  );
  unlinkSync(file);
});

test('loadConfig throws on missing file', () => {
  assert.throws(() => loadConfig('nope.json'), ConfigError);
});

test('validatePlateConfig enforces rules', () => {
  const good = { layout: 'spiral', mode: 1, labels: ['x'] };
  assert.ok(validatePlateConfig(good));
  const bad = { layout: 'unknown', mode: 0, labels: [] };
  assert.throws(() => validatePlateConfig(bad), ConfigError);
});
