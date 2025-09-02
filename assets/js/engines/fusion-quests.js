(()=> {
  "use strict";
  let questsIndex = {};

  function safeFetchJSON(path) {
    return fetch(path, { cache: "no-store" }).then(r => r.json());
  }

  async function loadQuests() {
    const data = await safeFetchJSON("/assets/data/fusion/quests.json");
    questsIndex = Object.fromEntries((data.quests || []).map(q => [q.id, q]));
  }

  function startQuest(id) {
    const q = questsIndex[id];
    if (!q) return alert("Quest not found.");
    alert("Quest started: " + q.title);
  }

  document.addEventListener("DOMContentLoaded", loadQuests);
  window.startQuest = startQuest;
})();
