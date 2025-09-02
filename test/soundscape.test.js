import { test } from 'node:test';
import assert from 'node:assert/strict';
import soundscape from '../plugins/soundscape.js';

function cleanup() {
  delete global.window;
}

test('soundscape respects mute', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: true }, AudioContext: class {} };
  assert.doesNotThrow(() => soundscape.activate(null, 'hypatia'));
  cleanup();
});

test('soundscape starts oscillators when not muted', () => {
  let started = 0;
  class FakeOsc {
    constructor() { this.frequency = { value: 0 }; }
    connect() { return this; }
    start() { started++; }
    stop() {}
  }
  class FakeGain {
    constructor() { this.gain = { value: 0 }; }
    connect() { return this; }
  }
  class FakeAudioCtx {
    constructor() { this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
    close() {}
  }
  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeAudioCtx };
  assert.doesNotThrow(() => soundscape.activate(null, 'tesla'));
  assert.equal(started, 2);
  soundscape.deactivate();
  cleanup();
});
