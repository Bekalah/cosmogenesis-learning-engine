// Tesseract Hooks: unlock nodes and edges
let graph = null;
const unlocked = new Set();

async function loadGraph() {
  graph = await fetch('/data/tesseract-nodes.json', { cache: 'no-store' }).then(r => r.json());
}

document.addEventListener('DOMContentLoaded', loadGraph);

document.addEventListener('tesseract:unlock', ev => {
  const nodeId = ev.detail?.nodeId;
  if (!nodeId || unlocked.has(nodeId)) return;
  unlocked.add(nodeId);
  update();
});

function update() {
  if (!graph) return;
  const edges = (graph.edges || []).filter(e => unlocked.has(e.from) && unlocked.has(e.to));
  document.dispatchEvent(new CustomEvent('tesseract:nodesUpdated', {
    detail: { unlocked: Array.from(unlocked), edges }
  }));
}
