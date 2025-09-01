(()=> {
  "use strict";
  const selector = "#altar-sophia7";

  function renderAltar() {
    const root = document.querySelector(selector);
    if (!root) return;

    root.innerHTML = `
      <h2>Sophia7 Altar</h2>
      <p>"Every book is a mirror; every mirror is an altar." Choose: explore shelves slowly or invoke gnosis to reveal all artifacts.</p>
      <div>
        <button id="btnSpawn">Invoke Gnosis: Reveal All</button>
        <button id="btnVeil">Veil Again</button>
      </div>
      <details>
        <summary>Angel Console (simulated)</summary>
        <label>Angel name <input id="angelName" placeholder="Michael, Raphael, etc."/></label>
        <button id="btnInvoke">Invoke</button>
        <div id="angelOut" aria-live="polite"></div>
      </details>
    `;

    root.querySelector("#btnSpawn").addEventListener("click", () => {
      localStorage.setItem("sophia7_spawn_all", "true");
      (window._artifacts || []).forEach(a => (a.unlocked = true));
      if (window.renderShelves) window.renderShelves();
    });

    root.querySelector("#btnVeil").addEventListener("click", () => {
      localStorage.removeItem("sophia7_spawn_all");
      (window._artifacts || []).forEach(a => (a.unlocked = false));
      if (window.renderShelves) window.renderShelves();
    });

    root.querySelector("#btnInvoke").addEventListener("click", () => {
      const name = root.querySelector("#angelName").value.trim();
      const out = root.querySelector("#angelOut");
      if (!name) {
        out.textContent = "Enter an angel name.";
        return;
      }
      out.textContent = `Sigil displayed for ${name}. This is a ritual-art simulation; practice ND-safe, mindful engagement.`;
    });
  }

  document.addEventListener("DOMContentLoaded", renderAltar);
})();
