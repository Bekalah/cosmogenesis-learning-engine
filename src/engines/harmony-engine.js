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
    this.dispatchEvent(
      new CustomEvent('harmony:mode', { detail: { mode: this.mode } })
    );
  }

  patternToFrequencies(nodes) {
    return nodes.map((n, i) => {
      const freq = this.scale[i % this.scale.length];
      return { node: n, frequency: freq };
    });
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
