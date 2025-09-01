export default class SpiralEngine {
  constructor(canvas, art) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.art = art;
    this.tilt = 23.5;
    this.nodeCount = 33;
    this.map = [];
    this.angle = 0;
    this.zoom = 1;
    this.dragging = false;
    canvas.addEventListener('mousedown', e => {
      this.dragging = true;
      this.startX = e.clientX;
    });
    window.addEventListener('mouseup', () => (this.dragging = false));
    canvas.addEventListener('mousemove', e => {
      if (this.dragging) {
        const dx = e.clientX - this.startX;
        this.angle += dx * 0.005 * this.rate();
        this.startX = e.clientX;
        this.draw();
      }
    });
    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      const hit = this.onClick(x, y);
      if (hit) document.dispatchEvent(new CustomEvent('chamber:open', { detail: { id: hit, ts: Date.now() } }));
    });
    window.addEventListener('keydown', e => {
      const r = this.rate();
      if (e.key === 'ArrowLeft') { this.angle -= 0.05 * r; this.draw(); }
      if (e.key === 'ArrowRight') { this.angle += 0.05 * r; this.draw(); }
      if (e.key === '+') { this.zoom *= 1 + 0.1 * r; this.draw(); }
      if (e.key === '-') { this.zoom /= 1 + 0.1 * r; this.draw(); }
    });
  }
  rate() {
    return document.documentElement.dataset.calm === 'true' ? 0.5 : 1;
  }
  init({ tiltDeg, nodeCount, map }) {
    this.tilt = tiltDeg;
    this.nodeCount = nodeCount;
    this.map = map.nodes || [];
    this.draw();
  }
  setTilt(deg) { this.tilt = deg; this.draw(); }
  setNodeCount(n) { this.nodeCount = n; this.draw(); }
  onClick(x, y) {
    let closest = null;
    let min = 20;
    this.nodePositions.forEach(n => {
      const d = Math.hypot(x - n.x, y - n.y);
      if (d < min) { min = d; closest = n.id; }
    });
    return closest;
  }
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate(this.angle);
    ctx.rotate((this.tilt * Math.PI) / 180);
    ctx.beginPath();
    const a = 5;
    const b = 0.20;
    this.nodePositions = [];
    for (let i = 0; i < this.nodeCount; i++) {
      const t = i * 0.3;
      const r = a * Math.exp(b * t);
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      this.nodePositions.push({ id: this.map[i]?.id || `n${i}`, x, y });
    }
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#f00';
    this.nodePositions.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, 3, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
  }
}
