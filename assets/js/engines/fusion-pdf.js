(()=> {
  "use strict";

  function renderWorkbench(artifact) {
    const viewer = document.getElementById("doc-viewer");
    const prov = document.getElementById("provenance-card");
    if (!artifact) {
      if (viewer) viewer.src = "";
      if (prov) prov.textContent = "";
      return;
    }
    const g = (window.grimoires || {})[artifact.primary_text_id];
    if (!g) {
      if (viewer) viewer.src = "";
      if (prov) prov.innerHTML = "Missing grimoire entry.";
      return;
    }
    if (viewer) viewer.src = g.path;
    const p = (window.provenance || {})[g.provenance_id] || {};
    const safe = s => String(s || "");
    if (prov)
      prov.innerHTML = `
        <h3>${safe(g.title)}</h3>
        <p><strong>Author:</strong> ${safe(g.author)}</p>
        <p><strong>Summary:</strong> ${safe(g.summary)}</p>
        <p><strong>License:</strong> ${safe(p.license)}</p>
        <p><a href="${safe(g.path)}" download>Download Source</a></p>
      `;
  }

  window.renderWorkbench = renderWorkbench;
})();
