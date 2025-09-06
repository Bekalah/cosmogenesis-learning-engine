/**
 * ✦ Codex 144:99 — IndraNet Engine (holographic web)
 * Simple SVG renderer that maps the Codex lattice as Indra's net.
 * Works stand-alone in any app; load bridge.json for shared data.
 */

export class IndraNet {
  constructor(config = {}) {
    this.config = Object.assign(this.defaults(), config);
    this.network = null;
    this.svg = null;
    this._container = null;
  }

  // default configuration
  defaults() {
    return {
      radius: 420,
      nodeSize: 8,
      showLinks: true,
      palette: { bg: '#000000', node: '#ffffff', link: '#888888' },
      layers: {
        soyga: true,
        tarot: true,
        iching: true,
        tree: true,
        planets: true,
        numerology: true
      }
      palette: { bg: '#000000', node: '#ffffff', link: '#888888' }
        numerology: true,
        angels: true
      }
      palette: { bg: '#000000', node: '#ffffff', link: '#888888' }
        numerology: true,
        angels: true
      }
      palette: { bg: '#000000', node: '#ffffff', link: '#888888' }
    };
  }

  // load indraNet data from bridge.json
  async load(url, { path = 'indraNet' } = {}) {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    this.network = data[path] || data.indraNet || null;
    return this;
  }

  // mount to a DOM container
  mount(container) {
    if (!container) throw new Error('IndraNet.mount: container is required');
    this._container = container;
    container.innerHTML = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '-512 -512 1024 1024');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';
    svg.style.background = this.config.palette.bg;
    this.svg = svg;
    container.appendChild(svg);
    return this;
  }

  // render nodes and links
  render() {
    if (!this.svg) throw new Error('IndraNet.render: call mount() first');
    while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
    const cfg = this.config;
    const lattice = this.network?.lattice || { rings: 12, nodes_per_ring: 12 };
    const rings = lattice.rings;
    const perRing = lattice.nodes_per_ring;
    const stepR = cfg.radius / rings;
    const nodes = [];
    for (let r = 0; r < rings; r++) {
      const rad = stepR * (r + 1);
      for (let i = 0; i < perRing; i++) {
        const angle = (2 * Math.PI * i) / perRing;
        const x = Math.cos(angle) * rad;
        const y = Math.sin(angle) * rad;
        const node = this._circle(x, y, cfg.nodeSize, { fill: cfg.palette.node });
        let fill = cfg.palette.node;
        let label;
        if (cfg.layers.angels && this.network?.angels) {
          const a = this.network.angels[r * perRing + i];
          if (a) {
            fill = a.color || fill;
            label = a.name;
          }
        }
        const node = this._circle(x, y, cfg.nodeSize, { fill }, label);
        this.svg.appendChild(node);
        nodes.push({ x, y, ring: r, index: i });
      }
    }
    if (cfg.showLinks) {
      nodes.forEach(n => {
        const ni = (n.index + 1) % perRing;
        const neighbor = nodes.find(o => o.ring === n.ring && o.index === ni);
        if (neighbor) this._link(n, neighbor, cfg.palette.link);
        if (n.ring + 1 < rings) {
          const radial = nodes.find(o => o.ring === n.ring + 1 && o.index === n.index);
          if (radial) this._link(n, radial, cfg.palette.link);
        }
      });
    }
    if (this.network?.harmony) this._renderHarmony();
    return this;
  }

  // helper to draw a circle
  _circle(cx, cy, r, attrs = {}) {
  _circle(cx, cy, r, attrs = {}, label) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx);
    c.setAttribute('cy', cy);
    c.setAttribute('r', r);
    for (const k in attrs) c.setAttribute(k, attrs[k]);
    if (label) {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      t.textContent = label;
      c.appendChild(t);
    }
    return c;
  }

  // render correspondence layers
  _renderHarmony() {
    const h = this.network.harmony;
    const cfg = this.config;
    const categories = ['soyga','tarot','iching','tree','planets','numerology'];
    const count = h.solfeggio?.length || 0;
    const step = 40;
    categories.forEach((cat, idx) => {
      if (!cfg.layers[cat] || !h[cat]) return;
      const radius = cfg.radius + (idx + 1) * step;
      const items = h[cat];
      for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i) / count;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const label = items[i % items.length];
        const freq = h.solfeggio[i % count];
        const color = this._solfeggioColor(freq);
        const dot = this._circle(x, y, 4, { fill: color });
        this.svg.appendChild(dot);
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', x);
        t.setAttribute('y', y - 6);
        t.setAttribute('fill', color);
        t.setAttribute('font-size', '10');
        t.setAttribute('text-anchor', 'middle');
        t.textContent = label;
        this.svg.appendChild(t);
      }
    });
  }

  // map solfeggio frequency to color
  _solfeggioColor(freq) {
    const map = {
      396: '#ff0000',
      417: '#ff7f00',
      528: '#ffff00',
      639: '#00ff00',
      741: '#0000ff',
      852: '#4b0082',
      963: '#ee82ee'
    };
    return map[freq] || '#ffffff';
  }

    return c;
  }

  // helper to draw a link
  _link(a, b, color) {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', a.x);
    l.setAttribute('y1', a.y);
    l.setAttribute('x2', b.x);
    l.setAttribute('y2', b.y);
    l.setAttribute('stroke', color);
    l.setAttribute('stroke-width', '1');
    this.svg.appendChild(l);
  }

  // merge configuration changes
  setConfig(next = {}) {
    this.config = Object.assign({}, this.config, next);
    return this;
  }
}
