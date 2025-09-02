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
    save();
    console.log("Node unlocked:", id);
  }
  function unlockEdge(edge) {
    const key = edge.from + "->" + edge.to;
    if (unlocked.edges.has(key)) return;
    unlocked.edges.add(key);
    console.log("Edge unlocked:", edge.from, edge.to);
  }
    save();
    console.log("Edge unlocked:", edge.from, edge.to);
  }
  function reset() {
    unlocked.nodes.clear();
    unlocked.edges.clear();
    save();
  }
  document.addEventListener("tesseract:unlockNode", (e) => {
    unlockNode(e.detail.id);
  });
  document.addEventListener("tesseract:unlockEdge", (e) => {
    unlockEdge(e.detail);
  });
  window.tesseractHooks = { unlockNode, unlockEdge };
  window.tesseractHooks = { unlockNode, unlockEdge, unlocked, reset };
})();
