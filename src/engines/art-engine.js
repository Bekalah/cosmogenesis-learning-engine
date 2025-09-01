export default class ArtEngine {
  constructor(canvas, themes) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.themes = themes;
  }
  drawGeometry(drawFn) {
    this.ctx.save();
    drawFn(this.ctx);
    this.ctx.restore();
  }
  applyShader() {
    const ctx = this.ctx;
    const g = ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width / 2
    );
    g.addColorStop(0, 'rgba(255,255,255,0.1)');
    g.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  compositeOverlays(overlays, alpha = 0.3) {
    overlays.forEach(img => {
      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    });
    this.ctx.globalAlpha = 1;
  }
  toBitmap(width, format) {
    if (width < 3840) throw new Error('width too small');
    const scale = width / this.canvas.width;
    const off = document.createElement('canvas');
    off.width = width;
    off.height = this.canvas.height * scale;
    off.getContext('2d').drawImage(this.canvas, 0, 0, off.width, off.height);
    return new Promise(res => off.toBlob(b => res(b), `image/${format}`));
  }
}
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs/promises';

// Minimal painterly pipeline placeholder using node-canvas
class ArtEngine {
  async render({ geometry = () => {}, shaders = [], overlays = [], out = { width: 4096, format: 'png' } } = {}) {
    const canvas = createCanvas(out.width, out.width);
    const ctx = canvas.getContext('2d');

    // geometry stage
    geometry(ctx);

    // shader stage (placeholder: fill with gradients)
    shaders.forEach((shader) => shader(ctx));

    // provenance overlays
    for (const src of overlays) {
      try {
        const img = await loadImage(src);
        ctx.drawImage(img, 0, 0, out.width, out.width);
      } catch {
        /* ignore missing overlays */
      }
    }

    const buffer = canvas.toBuffer(`image/${out.format}`);
    const filename = `Visionary_Dream.${out.format}`;
    await fs.writeFile(filename, buffer);
    return buffer;
  }
}

export const artEngine = new ArtEngine();
export default artEngine;
