(()=> {
  "use strict";
  const marks = [
    { id: "mark_correspondences_trine", requires: ["liber_777_crowley", "ars_notoria", "fusion_kink_manifesto"] },
    { id: "mark_memory_awake", requires: ["ars_notoria"] },
    { id: "mark_magdalene_lumen", requires: ["agrippa_nauert", "liber_777_crowley"] },
    { id: "mark_pathbinder", requires: ["liber_777_crowley", "codex_recovery"] },
    { id: "mark_initiate", requires: ["guild_manual"] },
    { id: "mark_color_diviner", requires: ["cosm_sophia_cover"] },
    { id: "mark_cartographer", requires: ["cathedral_dossier", "codex_recovery"] }
  ];

  function checkMarks() {
    const owned = new Set();
    (window._artifacts || []).forEach(a => {
      if (a.unlocked) {
        const g = (window._grimoires || {})[a.primary_text_id];
        if (g) owned.add(g.id);
      }
    });
    const earned = marks
      .filter(m => m.requires.every(req => owned.has(req)))
      .map(m => m.id);
    return earned;
  }

  window.checkMarks = checkMarks;
})();
