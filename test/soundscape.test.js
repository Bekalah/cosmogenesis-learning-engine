import { test } from 'node:test';
import { strict as assert } from 'assert';
import soundscape from '../plugins/soundscape.js';

// Clean window after each test
function cleanup() {
  delete global.window;
  delete global.alert;
}

test('soundscape respects mute', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: true } };
  global.alert = () => {};
  assert.doesNotThrow(() => soundscape('hypatia'));
  cleanup();
});

test('soundscape starts oscillators when not muted', () => {
  let started = 0;
  class FakeOsc {
    constructor() {
      this.frequency = { value: 0 };
    }
    connect() {
      return this;
    }
    start() {
      started++;
    }
    stop() {}
  }
  class FakeGain {
    constructor() {
      this.gain = { value: 0 };
    }
    connect() {}
  }
  class FakeMerger {
    connect() {}
  }
  global.window = {
    COSMO_SETTINGS: { muteAudio: false },
    AudioContext: class {
      constructor() {
        this.currentTime = 0;
        this.destination = {};
      }
      createOscillator() {
        return new FakeOsc();
      }
      createGain() {
        return new FakeGain();
      }
      createChannelMerger() {
        return new FakeMerger();
      }
    },
  };
  assert.doesNotThrow(() => soundscape('tesla'));
  assert.equal(started, 2);
  cleanup();
});
