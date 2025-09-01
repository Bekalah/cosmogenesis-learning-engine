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
})();
