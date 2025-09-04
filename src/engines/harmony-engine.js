class HarmonyEngine extends EventTarget {
  constructor() {
    super();
    this.enabled = false;
    this.mode = 'art'; // art, pattern, music
    this.scale = [174, 285, 396, 417, 528, 639, 741, 852, 963]; // solfeggio
  }

  toggle(mode = 'art') {
    this.mode = mode;
    this.enabled = mode !== 'art';
    // auto-art, auto-music, art-music, collage
    this.mode = 'off';
    this.scaleSet = 'solfeggio';
    this.scaleSets = {
      solfeggio: [174, 285, 396, 417, 528, 639, 741, 852, 963],
      pentatonic: [261, 293, 329, 392, 440], // East Asian
      raga: [240, 270, 300, 320, 360, 400, 450], // Indian
      maqam: [200, 225, 250, 275, 300, 325, 350], // Arabic
    };
  }

  toggle(mode = 'off') {
    this.mode = mode;
    this.enabled = mode !== 'off';
    this.dispatchEvent(
      new CustomEvent('harmony:mode', { detail: { mode: this.mode } })
    );
  }

  patternToFrequencies(nodes) {
    return nodes.map((n, i) => {
      const freq = this.scale[i % this.scale.length];
      return { node: n, frequency: freq };
    });
  setScaleSet(name) {
    if (this.scaleSets[name]) {
      this.scaleSet = name;
      this.dispatchEvent(
        new CustomEvent('harmony:scale', { detail: { scale: name } })
      );
    }
  }

  get currentScale() {
    return this.scaleSets[this.scaleSet];
  }

  randomScale() {
    const keys = Object.keys(this.scaleSets);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return this.scaleSets[key];
  }

  triggerNode(node, index = 0) {
    const scale = this.mode === 'collage' ? this.randomScale() : this.currentScale;
    const frequency = scale[index % scale.length];
    const detail = { node, frequency, mode: this.mode };

    const artModes = ['auto-art', 'art-music', 'collage'];
    const musicModes = ['auto-music', 'art-music', 'collage'];

    if (artModes.includes(this.mode)) {
      this.dispatchEvent(new CustomEvent('harmony:art', { detail }));
    }
    if (musicModes.includes(this.mode)) {
      this.dispatchEvent(new CustomEvent('harmony:note', { detail }));
    }
    return frequency;
  }

  patternToFrequencies(nodes) {
    return nodes.map((n, i) => ({
      node: n,
      frequency: this.triggerNode(n, i),
    }));
  }

  save(pattern) {
    const harmonics = this.patternToFrequencies(pattern);
    this.dispatchEvent(
      new CustomEvent('harmony:save', { detail: { harmonics } })
    );
    return harmonics;
  }
}

export const harmonyEngine = new HarmonyEngine();
export default harmonyEngine;
