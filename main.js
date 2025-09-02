const STYLEPACKS = {
  hilma_spiral: {
    bg: '#f8f5ef',
    ink: '#141414',
    monad: '#0b0b0b',
    spiral: '#b8860b',
    border: '#2a2a2a',
    nodes: ['#b7410e', '#c56a1a', '#d7a21a', '#2e7d32', '#1f6feb', '#4338ca', '#6d28d9']
  },
  dark_void: {
    bg: '#0d0d0d',
    ink: '#e0e0e0',
    monad: '#ffffff',
    spiral: '#3f51b5',
    border: '#e0e0e0',
    nodes: ['#ff5722', '#ff9800', '#ffeb3b', '#4caf50', '#03a9f4', '#3f51b5', '#9c27b0']
  },
  zen_garden: {
    bg: '#f0f5f1',
    ink: '#334e68',
    monad: '#284b63',
    spiral: '#86b300',
    border: '#334e68',
    nodes: ['#e4e3d3', '#c5dca0', '#9fcd4a', '#6ba368', '#4d908e', '#577590', '#8d6a9f']
  }
};

let currentStyle = STYLEPACKS.hilma_spiral;

function applyStylepack(name) {
  const pack = STYLEPACKS[name];
  if (!pack) return;
  const root = document.documentElement;
  root.style.setProperty('--bg', pack.bg);
  root.style.setProperty('--ink', pack.ink);
  root.style.setProperty('--monad', pack.monad);
  root.style.setProperty('--spiral', pack.spiral);
  root.style.setProperty('--border', pack.border);
  currentStyle = pack;
}

async function loadJSON(path) {
  const res = await fetch(path);
  let text = await res.text();
  text = text.replace(/^\s*\+/gm, '');
  return JSON.parse(text);
}

async function loadDataset(name) {
  try {
    return await loadJSON(`data/${name}.json`);
  } catch (e) {
    console.error('Failed to load dataset', e);
    return [];
  }
}

function extractLabels(data) {
  if (!Array.isArray(data) || !data.length) return [];
  if (typeof data[0] === 'string') return data;
  if (data[0].label) return data.map(d => d.label);
  if (data[0].config && Array.isArray(data[0].config.labels)) {
    return data[0].config.labels;
  }
  return data.map(d => JSON.stringify(d));
}

function drawNode(ctx, x, y, label, idx) {
  const radius = 12;
  const color = currentStyle.nodes[idx % currentStyle.nodes.length];
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = currentStyle.ink;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y - 15);
}

function drawSpiral(ctx, labels, center, rInner, rOuter, turns) {
  ctx.strokeStyle = currentStyle.spiral;
  ctx.lineWidth = 2;
  ctx.beginPath();
  const samples = 200;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const angle = t * turns * 2 * Math.PI;
    const radius = rInner + (rOuter - rInner) * t;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const rRing = rOuter * 0.88;
  labels.forEach((label, idx) => {
    const phi = idx * (2 * Math.PI / labels.length);
    const x = center.x + rRing * Math.cos(phi);
    const y = center.y + rRing * Math.sin(phi);
    drawNode(ctx, x, y, label, idx);
  });
}

function drawWheel(ctx, labels, center, rOuter) {
  ctx.strokeStyle = currentStyle.spiral;
  ctx.lineWidth = 2;
  ctx.beginPath();
  const rRing = rOuter * 0.9;
  ctx.arc(center.x, center.y, rRing, 0, Math.PI * 2);
  ctx.stroke();

  labels.forEach((label, idx) => {
    const phi = idx * (2 * Math.PI / labels.length);
    const x = center.x + rRing * Math.cos(phi);
    const y = center.y + rRing * Math.sin(phi);
    drawNode(ctx, x, y, label, idx);
  });
}

function drawGrid(ctx, labels, width, height) {
  const cols = Math.ceil(Math.sqrt(labels.length));
  const rows = Math.ceil(labels.length / cols);
  const cellW = (width - 40) / cols;
  const cellH = (height - 40) / rows;
  labels.forEach((label, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = 20 + col * cellW + cellW / 2;
    const y = 20 + row * cellH + cellH / 2;
    drawNode(ctx, x, y, label, idx);
  });
}

function render(labels, layout, canvas) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = currentStyle.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const center = { x: canvas.width / 2, y: canvas.height / 2 };

  ctx.fillStyle = currentStyle.monad;
  ctx.beginPath();
  ctx.arc(center.x, center.y, 10, 0, Math.PI * 2);
  ctx.fill();

  const rOuter = Math.min(canvas.width, canvas.height) / 2 - 20;
  const rInner = 40;
  const turns = 3;

  if (layout === 'spiral') {
    drawSpiral(ctx, labels, center, rInner, rOuter, turns);
  } else if (layout === 'wheel') {
    drawWheel(ctx, labels, center, rOuter);
  } else {
    drawGrid(ctx, labels, canvas.width, canvas.height);
  }
}

async function init() {
  const datasetSel = document.getElementById('dataset-selector');
  const layoutSel = document.getElementById('layout-selector');
  const styleSel = document.getElementById('style-selector');
  const canvas = document.getElementById('engine-canvas');

  async function update() {
    const data = await loadDataset(datasetSel.value);
    const labels = extractLabels(data);
    render(labels, layoutSel.value, canvas);
  }

  datasetSel.addEventListener('change', update);
  layoutSel.addEventListener('change', update);
  styleSel.addEventListener('change', () => {
    applyStylepack(styleSel.value);
    update();
  });

  applyStylepack(styleSel.value);
  update();
}

document.addEventListener('DOMContentLoaded', init);
