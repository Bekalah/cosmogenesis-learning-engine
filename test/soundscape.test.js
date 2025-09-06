import test from 'node:test';
import assert from 'node:assert/strict';
import soundscape, { playSoundscape } from '../plugins/soundscape.js';

function cleanup() {
  delete global.window;
  delete global.alert;
}

test('soundscape respects mute', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: true }, AudioContext: class {} };
  assert.doesNotThrow(() => soundscape.activate(null, 'tesla'));
  cleanup();
});

test('soundscape starts single oscillator by default', () => {
  let started = 0;
  class FakeOsc { connect() { return this; } start() { started++; } stop() {} }
  class FakeCtx { constructor() { this.destination = {}; this.currentTime = 0; } createOscillator() { return new FakeOsc(); } }
  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeCtx };
  assert.doesNotThrow(() => soundscape.activate(null, 'tesla'));
  assert.equal(started, 1);
  cleanup();
});

test('playSoundscape uses provided theme', () => {
  let started = 0;
  class FakeOsc { connect() { return this; } start() { started++; } stop() {} }
  class FakeCtx { constructor() { this.destination = {}; this.currentTime = 0; } createOscillator() { return new FakeOsc(); } }
  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeCtx };
  assert.doesNotThrow(() => playSoundscape('hypatia'));
  assert.equal(started, 1);
  cleanup();
});
