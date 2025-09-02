import { test } from 'node:test';
import { strict as assert } from 'assert';
import { writeFileSync, unlinkSync } from 'fs';
import { loadConfig, validatePlateConfig, ConfigError } from '../src/configLoader.js';

// Ensure loadConfig surfaces invalid JSON errors
test('loadConfig throws on invalid JSON', () => {
  const file = 'test/fixtures/bad.json';
  writeFileSync(file, '{');
  assert.throws(() => loadConfig(file), (err) => err instanceof ConfigError && /Invalid JSON/.test(err.message));
  unlinkSync(file);
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
    );
  });
});
