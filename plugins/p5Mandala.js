export default {
  id: 'p5Mandala',
  async activate() {
    if (!window.p5) {
      try {
        await import('../vendor/p5.min.js');
      } catch {
        await import('https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js');
      }
    }
    new p5(p => {
      p.setup = () => { p.createCanvas(320, 320); p.angleMode(p.DEGREES); p.noFill(); };
      p.draw = () => {
        p.background(0, 0, 0, 10);
        p.translate(p.width / 2, p.height / 2);
        for (let i = 0; i < 12; i++) {
          p.push();
          p.rotate((p.frameCount / 2) + i * 30);
          p.stroke(255, 150);
          p.ellipse(0, 40, 20, 20);
          p.pop();
        }
      };
    });
  },
  deactivate() {
    document.querySelectorAll('canvas').forEach(c => c.remove());
  }
};
