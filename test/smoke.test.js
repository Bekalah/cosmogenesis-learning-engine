import { test } from 'node:test';
import { strict as assert } from 'assert';
import { loadFirstDemo } from '../src/configLoader.js';

test('loadFirstDemo returns valid config', () => {
  const config = loadFirstDemo();
  assert.equal(typeof config.layout, 'string');
  assert.equal(config.labels.length, config.mode);
});
