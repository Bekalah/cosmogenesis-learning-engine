// Render Visionary_Dream fractal artwork using p5.js
export default async function fractalArt() {
  // Load p5 library if not already present
  if (!window.p5) {
    try {
      await import('../vendor/p5.min.js');
    } catch {
      await import('https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js');
export default {
  id: 'fractalArt',
  async activate() {
    if (!window.p5) {
      try {
        await import('../vendor/p5.min.js');
      } catch {
        await import('https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js');
      }
    }

    const res = await fetch('data/real_world_examples.json');
    const cases = await res.json();

    const PALETTE = ['#0d3b66', '#845ec2', '#ff6f91', '#ff9671', '#ffc75f', '#f9f871'];
    const WIDTH = 1920;
    const HEIGHT = 1080;
    const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

  // Canvas resolution
  const WIDTH = 1920;
  const HEIGHT = 1080;
  const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

  new p5(p => {
    // Prepare prompts
    const prompts = cases.map(c => c.prompt);
    // Simple shuffle
    for (let i = prompts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [prompts[i], prompts[j]] = [prompts[j], prompts[i]];
    }

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.noLoop();
      p.angleMode(p.RADIANS);
      p.textFont('sans-serif');
    };

    // Draw layered gradient background
    function drawBackground() {
      for (let i = PALETTE.length - 1; i >= 0; i--) {
        p.noStroke();
        p.fill(PALETTE[i]);
        const r = Math.max(WIDTH, HEIGHT) * (i + 1) / PALETTE.length;
        p.ellipse(CENTER.x, CENTER.y, r, r);
    new p5(p => {
      const prompts = cases.map(c => c.prompt);
      for (let i = prompts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [prompts[i], prompts[j]] = [prompts[j], prompts[i]];
      }

      p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        p.noLoop();
        p.angleMode(p.RADIANS);
        p.textFont('sans-serif');
      };

      function drawBackground() {
        for (let i = PALETTE.length - 1; i >= 0; i--) {
          p.noStroke();
          p.fill(PALETTE[i]);
          const r = Math.max(WIDTH, HEIGHT) * (i + 1) / PALETTE.length;
          p.ellipse(CENTER.x, CENTER.y, r, r);
        }
      }

    new p5(p => {
      const prompts = cases.map(c => c.prompt);
      for (let i = prompts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [prompts[i], prompts[j]] = [prompts[j], prompts[i]];
      }

      p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        p.noLoop();
        p.angleMode(p.RADIANS);
        p.textFont('sans-serif');
      };

      function drawBackground() {
        for (let i = PALETTE.length - 1; i >= 0; i--) {
          p.noStroke();
          p.fill(PALETTE[i]);
          const r = Math.max(WIDTH, HEIGHT) * (i + 1) / PALETTE.length;
          p.ellipse(CENTER.x, CENTER.y, r, r);
        }
      }

      function drawSpiral() {
        const turns = 3.5;
        const points = 500;
        const maxR = Math.min(WIDTH, HEIGHT) * 0.45;
        p.stroke(PALETTE[PALETTE.length - 1]);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < points; i++) {
          const t = i / points;
          const angle = turns * 2 * Math.PI * t;
          const r = maxR * t;
          const x = CENTER.x + r * Math.cos(angle);
          const y = CENTER.y + r * Math.sin(angle);
          p.vertex(x, y);
        }
        p.endShape();
        return maxR;
      }

    // Draw spiral path
    function drawSpiral() {
      const turns = 3.5;
      const points = 500;
      const maxR = Math.min(WIDTH, HEIGHT) * 0.45;
      p.stroke(PALETTE[PALETTE.length - 1]);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < points; i++) {
        const t = i / points;
        const angle = turns * 2 * Math.PI * t;
        const r = maxR * t;
        const x = CENTER.x + r * Math.cos(angle);
        const y = CENTER.y + r * Math.sin(angle);
        p.vertex(x, y);
      function drawNodes(maxR) {
        const r = maxR * 0.9;
        cases.forEach((c, idx) => {
          const phi = idx * (2 * Math.PI / cases.length);
          const x = CENTER.x + r * Math.cos(phi);
          const y = CENTER.y + r * Math.sin(phi);
          p.fill(PALETTE[idx % PALETTE.length]);
          p.noStroke();
          p.circle(x, y, 36);
          p.fill(255);
          p.textAlign(p.CENTER, p.BOTTOM);
          p.text(c.title, x, y - 24);
        });
      }

    // Draw case study nodes around outer ring
    function drawNodes(maxR) {
      const r = maxR * 0.9;
      cases.forEach((c, idx) => {
        const phi = idx * (2 * Math.PI / cases.length);
        const x = CENTER.x + r * Math.cos(phi);
        const y = CENTER.y + r * Math.sin(phi);
        p.fill(PALETTE[idx % PALETTE.length]);
        p.noStroke();
        p.circle(x, y, 36);
        p.fill(255);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(c.title, x, y - 24);
      });
    }

    // Draw shuffled prompts near center
    function drawPrompts(maxR) {
      const r = maxR * 0.3;
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      prompts.forEach((txt, i) => {
        const angle = i * (2 * Math.PI / prompts.length);
        const x = CENTER.x + r * Math.cos(angle);
        const y = CENTER.y + r * Math.sin(angle);
        p.text(txt, x, y);
      });
    }

    p.draw = () => {
      drawBackground();
      const maxR = drawSpiral();
      drawNodes(maxR);
      drawPrompts(maxR);
      // Save final artwork
      p.saveCanvas('Visionary_Dream', 'png');
    };
  });
}
      function drawPrompts(maxR) {
        const r = maxR * 0.3;
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        prompts.forEach((txt, i) => {
          const angle = i * (2 * Math.PI / prompts.length);
          const x = CENTER.x + r * Math.cos(angle);
          const y = CENTER.y + r * Math.sin(angle);
          p.text(txt, x, y);
        });
      }

      function drawPrompts(maxR) {
        const r = maxR * 0.3;
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        prompts.forEach((txt, i) => {
          const angle = i * (2 * Math.PI / prompts.length);
          const x = CENTER.x + r * Math.cos(angle);
          const y = CENTER.y + r * Math.sin(angle);
          p.text(txt, x, y);
        });
      }

      p.draw = () => {
        drawBackground();
        const maxR = drawSpiral();
        drawNodes(maxR);
        drawPrompts(maxR);
        p.saveCanvas('Visionary_Dream', 'png');
      };
    });
  },
  deactivate() {
    document.querySelectorAll('canvas').forEach(c => c.remove());
  }
};
