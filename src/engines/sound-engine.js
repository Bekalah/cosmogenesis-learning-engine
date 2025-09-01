class SoundEngine extends EventTarget {
  constructor() {
    super();
    this.enabled = false;
    this.gain = -12;
  }

  enable(presetId) {
    this.enabled = true;
    this.dispatchEvent(new CustomEvent('sound:enable', { detail: presetId }));
  }

  disable() {
    this.enabled = false;
    this.dispatchEvent(new Event('sound:disable'));
  }

  setGain(db) {
    this.gain = db;
    this.dispatchEvent(new CustomEvent('sound:gain', { detail: db }));
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
