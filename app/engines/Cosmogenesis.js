/**
 * ✦ Codex 144:99 -- Cosmogenesis Engine (browser-native)
 * Museum-grade, data-agnostic renderer for plates: Monad → Spiral → Ring → Border.
 * Works with any labels (STEM, design, poetry, sacred tables) and any palette.
 *
 * No frameworks required. SVG only. Drop-in module.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * API (ES Module)
 *   import { Cosmogenesis } from './engines/Cosmogenesis.js';
 *
 *   const cosmo = new Cosmogenesis({
 *     layout: 'spiral',           // 'spiral' | 'twin_cones' | 'wheel' | 'grid'
 *     mode: 'auto',               // 'auto' or Number (7, 12, 22, 33, 72)
 *     turns: 9,
 *     samples: 1600,
 *     rInner: 60,
 *     rOuter: 440,
 *     nodeSize: 28,
 *     borderWidth: 3,
 *     palette: {                  // optional -- falls back to visionary defaults
 *       bg: '#f8f5ef',
 *       ink: '#141414',
 *       monad: '#0b0b0b',
 *       spiral: '#b8860b',
 *       border: '#2a2a2a',
 *       nodes: ['#b7410e','#c56a1a','#d7a21a','#2e7d32','#1f6feb','#4338ca','#6d28d9']
 *     },
 *     labels: []                  // optional: array of strings; auto 1..N if empty
 *   });
 *
 *   cosmo.mount(document.getElementById('viz')); // container element
 *   cosmo.render();                               // draw plate
 *
 *   // Update config later
 *   cosmo.setConfig({ layout: 'twin_cones', mode: 33 }).render();
 *
 *   // Randomize visual phase (pleasant variety)
 *   cosmo.randomizePhase().render();
 *
 *   // Export
 *   const svgBlob = cosmo.toSVGBlob();
 *   const pngBlob = await cosmo.toPNGBlob(2048);
 *
 * ✦ Notes
 * - This file is stand-alone and safe. It does NOT overwrite anything.
 * - If your repo has a palette JSON, you can call cosmo.loadPaletteJSON(url).
 *
 * // ✦ Codex 144:99 -- preserve original intention
 */

export class Cosmogenesis {
  constructor(config = {}) {
    this.config = Object.assign(this.defaults(), config);
    this.phase = config.phase ?? Math.random() * Math.PI * 2;
    this.svg = null;
    this._rootGroup = null;
    this._mounted = false;
    this._container = null;

    // Apply initial palette to document root (optional cosmetic)
    this._applyThemeToDocument();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Defaults & Theme
  // ───────────────────────────────────────────────────────────────────────────
  defaults() {
    return {
      layout: 'spiral',       // 'spiral' | 'twin_cones' | 'wheel' | 'grid'
      mode: 'auto',           // 'auto' or integer (7, 12, 22, 33, 72)
      turns: 9,
      samples: 1600,
      rInner: 60,
      rOuter: 440,
      nodeSize: 28,
      borderWidth: 3,
      labels: [],
      palette: {
        // Visionary default (warm paper + deep ink)
        bg: '#f8f5ef',
        ink: '#141414',
        monad: '#0b0b0b',
        spiral: '#b8860b',
        border: '#2a2a2a',
        nodes: ['#b7410e','#c56a1a','#d7a21a','#2e7d32','#1f6feb','#4338ca','#6d28d9']
      }
    };
  }

  _applyThemeToDocument() {
    const pal = this.config.palette || {};
    const root = document.documentElement;
    if (!root) return;
    root.style.setProperty('--paper', pal.bg || '#ffffff');
    root.style.setProperty('--ink', pal.ink || '#111111');
  }

  setConfig(next = {}) {
    if ('phase' in next) this.phase = next.phase;
    const prevPalette = this.config.palette;
    this.config = Object.assign({}, this.config, next);
    // if palette changed, refresh document variables
    if (next.palette && next.palette !== prevPalette) {
      this._applyThemeToDocument();
    }
    return this;
  }

  randomizePhase() {
    this.phase = Math.random() * Math.PI * 2;
    return this;
  }

  // Optionally load a JSON palette at runtime (shared between JS/Python)
  // JSON shape:
  // { "visionary": { "core": { "indigo":"#280050", ... }, "secondary": { ... } } }
  async loadPaletteJSON(url, { use = 'visionary.core' } = {}) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      // Resolve nested path like 'visionary.core'
      const parts = String(use).split('.');
      let node = data;
      for (const p of parts) node = node?.[p];
      if (!node) throw new Error('Palette path not found: ' + use);

      const coreList = Array.isArray(node) ? node : Object.values(node);
      const nodes = coreList.filter(Boolean);
      const pal = Object.assign({}, this.config.palette, { nodes });

      this.setConfig({ palette: pal });
      return pal;
    } catch (err) {
      console.warn('Palette load failed:', err);
      return this.config.palette;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Mount & Render
  // ───────────────────────────────────────────────────────────────────────────
  mount(container) {
    if (!container) throw new Error('Cosmogenesis.mount: container is required');
    this._container = container;
    // Clean previous
    container.innerHTML = '';
    // Create SVG viewport
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox', '-512 -512 1024 1024');
    svg.setAttribute('role','img');
    svg.setAttribute('aria-label','Cosmogenesis Plate');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';
    svg.style.background = this.config.palette?.bg || '#ffffff';

    this.svg = svg;
    this._rootGroup = this._group('root');
    container.appendChild(svg);
    this._mounted = true;
    return this;
  }

  render() {
    if (!this._mounted) throw new Error('Cosmogenesis.render: call mount(container) first');
    // Clear
    while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
    this._rootGroup = this._group('root');

    const cfg = this.config;
    this._drawBorder(this._rootGroup);
    switch (cfg.layout) {
      case 'twin_cones': this._drawTwinCones(this._rootGroup); break;
      case 'wheel':      this._drawNodeRing(this._rootGroup);  break;
      case 'grid':       this._drawGrid(this._rootGroup);      break;
      default:           this._drawSpiral(this._rootGroup); this._drawNodeRing(this._rootGroup); break;
    }
    this._drawInnerGuide(this._rootGroup);
    this._drawMonad(this._rootGroup);
    return this;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Geometry helpers
  // ───────────────────────────────────────────────────────────────────────────
  _group(cls) {
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    if (cls) g.setAttribute('class', cls);
    if (this.svg) this.svg.appendChild(g);
    return g;
  }
  _circle(cx, cy, r, attrs = {}) {
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    for (const k in attrs) c.setAttribute(k, attrs[k]);
    return c;
  }
  _path(d, attrs = {}) {
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d', d);
    for (const k in attrs) p.setAttribute(k, attrs[k]);
    return p;
  }
  _text(x, y, str, attrs = {}) {
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.textContent = str;
    for (const k in attrs) t.setAttribute(k, attrs[k]);
    return t;
  }

  _clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  _effectiveCount() {
    const { mode, labels } = this.config;
    if (mode === 'auto') return (labels && labels.length) ? labels.length : 7;
    const n = Number(mode); return (n > 0 ? n : 7);
  }

  _labels() {
    const n = this._effectiveCount();
    const labels = Array.isArray(this.config.labels) && this.config.labels.length
      ? this.config.labels
      : Array.from({length:n}, (_, i) => String(i + 1));
    return labels.slice(0, n);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Layers
  // ───────────────────────────────────────────────────────────────────────────
  _drawMonad(root) {
    const r = this._clamp(this.config.rInner * 0.32, 10, 120);
    root.appendChild(this._circle(0, 0, r, {
      fill: this.config.palette.monad || '#0b0b0b',
      'aria-label': 'Monad'
    }));
  }

  _drawBorder(root) {
    const { rOuter, borderWidth } = this.config;
    root.appendChild(this._circle(0, 0, rOuter + this._clamp(borderWidth * 1.2, 1, 16), {
      fill: 'none',
      stroke: this.config.palette.border || '#2a2a2a',
      'stroke-width': borderWidth,
      'aria-label': 'Border'
    }));
  }

  _drawInnerGuide(root) {
    root.appendChild(this._circle(0, 0, this.config.rInner * 1.12, {
      fill: 'none',
      stroke: this.config.palette.border || '#2a2a2a',
      'stroke-opacity': '0.25',
      'stroke-dasharray': '2 6',
      'stroke-width': '1'
    }));
  }

  _drawSpiral(root) {
    const { samples, rInner, rOuter, turns } = this.config;
    const thetaMax = turns * 2 * Math.PI;
    let d = '';
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const theta = t * thetaMax;
      const r = rInner + (rOuter - rInner) * t;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      d += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    }
    root.appendChild(this._path(d, {
      fill: 'none',
      stroke: this.config.palette.spiral || '#b8860b',
      'stroke-width': 2,
      'stroke-linecap': 'round',
      'aria-label': 'Spiral'
    }));
  }

  _drawNodeRing(root) {
    const n = this._effectiveCount();
    const ringR = this.config.rOuter * 0.88;
    const labels = this._labels();
    const colors = this._ensureNodeColors();
    const g = this._group('node-ring');

    for (let i = 0; i < n; i++) {
      const angle = this.phase + i * (2 * Math.PI / n);
      const x = ringR * Math.cos(angle);
      const y = ringR * Math.sin(angle);
      const fill = colors[i % colors.length];

      g.appendChild(this._circle(x, y, this.config.nodeSize, {
        fill,
        stroke: '#000',
        'stroke-opacity': '0.25',
        'stroke-width': '1'
      }));
      g.appendChild(this._text(x, y + 4, String(labels[i] ?? i + 1), {
        class: 'node-label',
        'text-anchor': 'middle',
        style: 'font:600 12px/1 system-ui,Segoe UI,Roboto;fill:#fff;paint-order:stroke;stroke:#000;stroke-width:.6;letter-spacing:.2px'
      }));
    }
  }

  _drawTwinCones(root) {
    const { rInner, rOuter, samples } = this.config;
    const g = this._group('twin-cones');

    const arms = (phaseShift) => {
      let d = '';
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const r = rInner + (rOuter - rInner) * Math.pow(t, 1.1);
        const theta = (t * Math.PI) + phaseShift + this.phase;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        d += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
      }
      return d;
    };

    g.appendChild(this._path(arms(0), {
      fill: 'none',
      stroke: this.config.palette.spiral || '#b8860b',
      'stroke-width': 2
    }));
    g.appendChild(this._path(arms(Math.PI), {
      fill: 'none',
      stroke: this.config.palette.spiral || '#b8860b',
      'stroke-width': 2
    }));

    // Split nodes across two arcs
    const n = this._effectiveCount();
    const labels = this._labels();
    const colors = this._ensureNodeColors();
    const arcR = rOuter * 0.82;

    for (let i = 0; i < n; i++) {
      const side = (i % 2 === 0) ? 1 : -1;
      const k = Math.floor(i / 2);
      const steps = Math.ceil(n / 2);
      const a = (k / Math.max(1, steps - 1)) * Math.PI;
      const angle = (side > 0 ? a : a + Math.PI) + this.phase;
      const x = arcR * Math.cos(angle);
      const y = arcR * Math.sin(angle);
      const fill = colors[i % colors.length];

      g.appendChild(this._circle(x, y, this.config.nodeSize, {
        fill,
        stroke: '#000',
        'stroke-opacity': '0.25',
        'stroke-width': '1'
      }));
      g.appendChild(this._text(x, y + 4, String(labels[i] ?? i + 1), {
        class: 'node-label',
        'text-anchor': 'middle',
        style: 'font:600 12px/1 system-ui,Segoe UI,Roboto;fill:#fff;paint-order:stroke;stroke:#000;stroke-width:.6;letter-spacing:.2px'
      }));
    }
  }

  _drawGrid(root) {
    const n = this._effectiveCount();
    const labels = this._labels();
    const colors = this._ensureNodeColors();

    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const size = (this.config.rOuter * 1.6) / Math.max(cols, rows);
    const startX = - (cols - 1) * size * 0.6;
    const startY = - (rows - 1) * size * 0.6;

    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const x = startX + c * size * 1.2;
      const y = startY + r * size * 1.2;
      const fill = colors[i % colors.length];

      root.appendChild(this._circle(x, y, this.config.nodeSize, {
        fill,
        stroke: '#000',
        'stroke-opacity': '0.2',
        'stroke-width': '1'
      }));
      root.appendChild(this._text(x, y + 4, String(labels[i] ?? i + 1), {
        class: 'node-label',
        'text-anchor': 'middle',
        style: 'font:600 12px/1 system-ui,Segoe UI,Roboto;fill:#fff;paint-order:stroke;stroke:#000;stroke-width:.6;letter-spacing:.2px'
      }));
    }
  }

  _ensureNodeColors() {
    const pal = this.config.palette || {};
    let arr = Array.isArray(pal.nodes) && pal.nodes.length ? pal.nodes.slice() : [
      '#b7410e','#c56a1a','#d7a21a','#2e7d32','#1f6feb','#4338ca','#6d28d9'
    ];
    return arr;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Export
  // ───────────────────────────────────────────────────────────────────────────
  toSVGString() {
    if (!this.svg) return '';
    // Clone and inject solid background for safe export
    const clone = this.svg.cloneNode(true);
    const fullBg = document.createElementNS('http://www.w3.org/2000/svg','rect');
    fullBg.setAttribute('x', -512);
    fullBg.setAttribute('y', -512);
    fullBg.setAttribute('width', 1024);
    fullBg.setAttribute('height', 1024);
    fullBg.setAttribute('fill', this.config.palette?.bg || '#ffffff');
    clone.insertBefore(fullBg, clone.firstChild);

    const xml = new XMLSerializer().serializeToString(clone);
    return xml;
  }

  toSVGBlob() {
    const xml = this.toSVGString();
    return new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  }

  async toPNGBlob(size = 2048) {
    const svgBlob = this.toSVGBlob();
    const url = URL.createObjectURL(svgBlob);
    try {
      const img = new Image();
      const done = new Promise((res, rej) => {
        img.onload = () => res();
        img.onerror = rej;
      });
      img.src = url;
      await done;

      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = this.config.palette?.bg || '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      return await new Promise((res) => {
        canvas.toBlob((b) => res(b), 'image/png');
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tiny helper for convenience: quickMount
// Usage:
//   quickMount('#viz', { layout:'spiral', mode:33 }).then(engine => { ... });
// ─────────────────────────────────────────────────────────────────────────────
export async function quickMount(selectorOrEl, config = {}) {
  const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
  const engine = new Cosmogenesis(config);
  engine.mount(el).render();
  return engine;
}