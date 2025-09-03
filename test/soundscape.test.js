import test from 'node:test';
import assert from 'node:assert/strict';
import soundscape from '../plugins/soundscape.js';

function cleanup() {
  delete global.window;
}

test('soundscape respects mute', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: true } };
  assert.doesNotThrow(() => soundscape.activate(null, 'hypatia'));
  cleanup();
});

test('soundscape starts single oscillator by default', () => {
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

  class FakeCtx {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
  }

  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeCtx };
  assert.doesNotThrow(() => soundscape.activate(null, { theme: 'tesla' }));
  assert.equal(started, 1);
  soundscape.deactivate();
  cleanup();
});

test('soundscape enables binaural beats when requested', () => {
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

  class FakeCtx {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
  }

  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeCtx };
  assert.doesNotThrow(() => soundscape.activate(null, { theme: 'tesla', binaural: true }));
  assert.equal(started, 2);
  soundscape.deactivate();
  cleanup();
});
