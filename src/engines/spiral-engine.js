// Simple EventTarget shim for environments without window.EventTarget
class ET extends EventTarget {}

class SpiralEngine extends ET {
  constructor() {
    super();
    this.nodes = [];
    this.visited = [];
    this.calmMode = false;
  }

  async init({ tiltDeg = 23.5, nodeCount = 72, container } = {}) {
    this.tiltDeg = tiltDeg;
    this.nodeCount = nodeCount;
    this.container = container || null;
    try {
      const res = await fetch('/data/spiral_map.json');
      this.nodes = await res.json();
    } catch (err) {
      console.warn('spiralEngine: failed to load spiral_map.json', err);
      this.nodes = [];
    }
    this._bindControls();
    return this;
  }

  _bindControls() {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.dispatchEvent(new Event('orbit:left'));
      if (e.key === 'ArrowRight') this.dispatchEvent(new Event('orbit:right'));
      if (e.key === '+') this.dispatchEvent(new Event('zoom:in'));
      if (e.key === '-') this.dispatchEvent(new Event('zoom:out'));
    });
  }

  openChamber(id) {
    this.visited.push({ id, ts: Date.now() });
    this.dispatchEvent(new CustomEvent('chamber:open', { detail: id }));
  }

  snapshot() {
    return { visited: this.visited };
  }

  setCalmMode(flag) {
    this.calmMode = !!flag;
    this.dispatchEvent(new CustomEvent('calm:mode', { detail: this.calmMode }));
  }
}

export const spiralEngine = new SpiralEngine();
export default spiralEngine;
