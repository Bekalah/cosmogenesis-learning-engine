// ===== Auto-generated tests for README_RENDERER content =====
//
// Test framework: Jest-compatible (describe/it/expect). Should also work with Vitest.
// These tests parse the first block comment in this file (the embedded README)
// and validate structure, sections, and key ND-safe guarantees.

const fs = require ? require('fs') : null;
const path = require ? require('path') : null;

function readEmbeddedReadme(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  // Capture the first /* ... */ block
  const m = text.match(/\/\*[\s\S]*?\*\//);
  if (!m) throw new Error('Embedded README block comment not found');
  // Strip /* and */ delimiters
  const block = m[0].replace(/^\/\*/, '').replace(/\*\/$/, '').trim();
  return block;
}

function extractSection(md, heading) {
  // Match "## heading" followed by any text until the next "## " or end
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('^##[ \\t]+' + escaped + '[\\s\\S]*?(?=^##[ \\t]+|\\Z)', 'm');
  const match = md.match(pattern);
  return match ? match[0] : '';
}

describe('README_RENDERER metadata', () => {
  const filePath = __filename;
  const md = readEmbeddedReadme(filePath);

  it('has the correct H1 title', () => {
    expect(md).toMatch(/^#\s+Cosmic Helix Renderer \(Offline, ND-safe\)/m);
  });

  it('uses only LF newlines and ASCII straight quotes', () => {
    expect(md.includes('\r')).toBe(false); // no CR
    // Disallow curly quotes
    const curly = /[“”‘’]/;
    expect(curly.test(md)).toBe(false);
  });

  it('contains all expected top-level sections', () => {
    const expected = [
      'Files',
      'Usage (offline)',
      'Layer order (back to front)',
      'ND-safe and trauma-informed choices',
      'Customising safely'
    ];
    for (const h of expected) {
      const re = new RegExp(`^##[ \\t]+${h}$`, 'm');
      expect(re.test(md)).toBe(true);
    }
  });
});

describe('Files section', () => {
  const md = readEmbeddedReadme(__filename);
  const section = extractSection(md, 'Files');

  it('lists index.html with correct description', () => {
    expect(section).toMatch(/-\s*`index\.html`\s*-\s*offline entry/i);
  });

  it('lists js/helix-renderer.mjs as ES module of pure helpers', () => {
    expect(section).toMatch(/-\s*`js\/helix-renderer\.mjs`\s*-\s*ES module of small pure helpers/i);
  });

  it('lists data/palette.json with sealed fallback behavior', () => {
    expect(section).toMatch(/-\s*`data\/palette\.json`\s*-\s*optional colour overrides\./i);
    expect(section).toMatch(/sealed palette/i);
  });

  it('lists data/geometry.json overrides', () => {
    expect(section).toMatch(/-\s*`data\/geometry\.json`\s*-\s*optional geometry overrides/i);
  });
});

describe('Usage (offline) section', () => {
  const md = readEmbeddedReadme(__filename);
  const section = extractSection(md, 'Usage (offline)');

  it('mentions opening cosmic-helix/index.html directly without server', () => {
    expect(section).toMatch(/Double-click `?cosmic-helix\/index\.html`?/i);
    expect(section).toMatch(/No server, build step, or network connection is required\./i);
  });

  it('confirms status messaging for palette and geometry loading', () => {
    expect(section).toMatch(/header status confirms whether the palette and geometry files loaded/i);
  });

  it('states renderer draws four layers exactly once', () => {
    expect(section).toMatch(/draws the .* four-layer .* exactly once/i);
  });
});

describe('Layer order integrity', () => {
  const md = readEmbeddedReadme(__filename);
  const section = extractSection(md, 'Layer order (back to front)');

  it('lists four layers in correct order', () => {
    const expectedOrder = [
      /1\. \*\*Vesica field\*\*/,
      /2\. \*\*Tree-of-Life scaffold\*\*/,
      /3\. \*\*Fibonacci curve\*\*/,
      /4\. \*\*Double-helix lattice\*\*/
    ];
    let pos = 0;
    for (const re of expectedOrder) {
      const m = section.match(re);
      expect(m).toBeTruthy();
      const idx = section.indexOf(m[0]);
      expect(idx).toBeGreaterThanOrEqual(pos);
      pos = idx;
    }
  });

  it('describes vesica spacing ratios', () => {
    expect(section).toMatch(/3\/7\/9\/11 ratios/);
  });

  it('mentions ten sephirot and twenty-two paths', () => {
    expect(section).toMatch(/ten sephirot/i);
    expect(section).toMatch(/twenty-two calm paths/i);
  });

  it('mentions Fibonacci spiral sampled over 144 points', () => {
    expect(section).toMatch(/144 points/);
  });

  it('mentions thirty-three cross ties for the double-helix', () => {
    expect(section).toMatch(/thirty-three cross ties/i);
  });
});

describe('ND-safe and trauma-informed choices', () => {
  const md = readEmbeddedReadme(__filename);
  const section = extractSection(md, 'ND-safe and trauma-informed choices');

  it('explicitly avoids animation/timers', () => {
    expect(section).toMatch(/No animation, autoplay, or timers/i);
  });

  it('notes calm palette defaults and status messaging', () => {
    expect(section).toMatch(/Calm palette defaults/i);
    expect(section).toMatch(/status messaging/i);
  });

  it('keeps layered geometry 3D', () => {
    expect(section).toMatch(/Layered geometry keeps sacred forms three-dimensional/i);
  });

  it('confirms ASCII quotes, UTF-8, and LF newlines', () => {
    expect(section).toMatch(/ASCII quotes, UTF-8, and LF newlines/i);
  });
});

describe('Customising safely', () => {
  const md = readEmbeddedReadme(__filename);
  const section = extractSection(md, 'Customising safely');

  it('documents palette.json keys including bg, ink, muted, and six-layer array', () => {
    expect(section).toMatch(/`bg`, `ink`, `muted`, and a six colour `layers` array/);
    // Sanity: mention all three keys
    for (const key of ['bg', 'ink', 'muted']) {
      expect(section).toContain('`' + key + '`');
    }
  });

  it('allows geometry overrides via file or renderHelix geometry object with validation', () => {
    expect(section).toMatch(/editing `data\/geometry\.json`/);
    expect(section).toMatch(/passing a `geometry` object to `renderHelix`/);
    expect(section).toMatch(/validates every override/i);
  });

  it('encourages pure helper pattern in js/helix-renderer.mjs', () => {
    expect(section).toMatch(/pure helper pattern inside `js\/helix-renderer\.mjs`/);
  });
});

// Additional quality checks specific to documentation values
describe('Documentation quality checks', () => {
  const md = readEmbeddedReadme(__filename);

  it('does not contain bare HTML tags that would require runtime rendering', () => {
    // Allow inline code and links; disallow <script> as a sanity check
    expect(/<script\b/i.test(md)).toBe(false);
  });

  it('uses dash-style bullets consistently', () => {
    const bullets = md.split('\n').filter(l => /^-\s+/.test(l));
    // Expect at least 8 bullet lines across sections
    expect(bullets.length).toBeGreaterThanOrEqual(8);
  });
});