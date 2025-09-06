(() => {
  "use strict";
  const unlocked = { nodes: new Set(), edges: new Set() };
  function unlockNode(id) {
    if (unlocked.nodes.has(id)) return;
    unlocked.nodes.add(id);
  const STORAGE_KEY = "tesseractUnlocks";
  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      return {
        nodes: new Set(data.nodes || []),
        edges: new Set(data.edges || []),
      };
    } catch {
      return { nodes: new Set(), edges: new Set() };
    }
  }
  function save(unlocked) {
  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        nodes: Array.from(unlocked.nodes),
        edges: Array.from(unlocked.edges),
      }),
    );
  }
  const unlocked = load();
  function unlockNode(id) {
    if (unlocked.nodes.has(id)) return;
    unlocked.nodes.add(id);
    save(unlocked);
    save();
    console.log("Node unlocked:", id);
  }
  function unlockEdge(edge) {
    const key = edge.from + "->" + edge.to;
    if (unlocked.edges.has(key)) return;
    unlocked.edges.add(key);
    save(unlocked);
    console.log("Edge unlocked:", edge.from, edge.to);
  }
    save();
    console.log("Edge unlocked:", edge.from, edge.to);
  }
  function reset() {
    unlocked.nodes.clear();
    unlocked.edges.clear();
    save(unlocked);
  }
  document.addEventListener("tesseract:unlockNode", e => unlockNode(e.detail.id));
  document.addEventListener("tesseract:unlockEdge", e => unlockEdge(e.detail));
  window.tesseractHooks = { unlockNode, unlockEdge, unlocked, reset };
    save();
  }
    save();
    console.log("Edge unlocked:", edge.from, edge.to);
  }
<<<<<<< codex/create-open-world-learning-engine-features-j3nbmd
    save();
    console.log("Edge unlocked:", edge.from, edge.to);
  }
  document.addEventListener("tesseract:unlockNode", (e) => {
    unlockNode(e.detail.id);
  });
  document.addEventListener("tesseract:unlockEdge", (e) => {
    unlockEdge(e.detail);
  });
  window.tesseractHooks = { unlockNode, unlockEdge };
  window.tesseractHooks = { unlockNode, unlockEdge, unlocked, reset };
  window.tesseractHooks = { unlockNode, unlockEdge, unlocked };
  window.tesseractHooks = { unlockNode, unlockEdge, unlocked, reset };
  window.tesseractHooks = { unlockNode, unlockEdge };
  window.tesseractHooks = { unlockNode, unlockEdge, unlocked, reset };
  window.tesseractHooks = { unlockNode, unlockEdge, unlocked };
})();
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
(() => {
  "use strict";
  const unlocked = { nodes: new Set(), edges: new Set() };
  function unlockNode(id) {
    if (unlocked.nodes.has(id)) return;
    unlocked.nodes.add(id);
    console.log("Node unlocked:", id);
  }
  function unlockEdge(edge) {
    const key = edge.from + "->" + edge.to;
    if (unlocked.edges.has(key)) return;
    unlocked.edges.add(key);
    console.log("Edge unlocked:", edge.from, edge.to);
  }
  document.addEventListener("tesseract:unlockNode", (e) => {
    unlockNode(e.detail.id);
  });
  document.addEventListener("tesseract:unlockEdge", (e) => {
    unlockEdge(e.detail);
  });
  window.tesseractHooks = { unlockNode, unlockEdge };
=======
  window.tesseractHooks = { unlockNode, unlockEdge, unlocked, reset };
>>>>>>> Stashed changes
})();
