(()=>{ "use strict";
const q="#altar-sophia7";
function renderAltar(){
  const root=document.querySelector(q);
  if(!root) return;
  root.innerHTML=`<h2>Sophia7 Altar</h2>
  <p>"Every book is a mirror; every mirror is an altar."</p>
  <p>"Call them forth, or let them arrive in their season."</p>
  <p>"Notae awaken memory; memory awakens mercy; mercy awakens wisdom."</p>
  <p>"You are the librarian and the library."</p>
  <p class="safety" aria-live="polite">This is a contemplative art-ritual simulation. No promises of supernatural outcomes. Practice grounding, consent, and care. ND-safe defaults are active.</p>
  <div><button id="btnSpawn">Invoke Gnosis: Reveal All</button><button id="btnVeil">Veil Again</button></div>
  <details><summary>Angel Console (simulated)</summary>
    <label>Angel name <input id="angelName" aria-label="Angel name" placeholder="Michael, Raphael, etc."/></label>
    <button id="btnInvoke">Invoke</button>
    <div id="angelOut" aria-live="polite"></div>
  </details>`;
  root.querySelector("#btnSpawn").addEventListener("click",()=>{
    localStorage.setItem("sophia7_spawn_all","true");
    (window._artifacts||[]).forEach(a=>a.unlocked=true);
    if(window.renderShelves) window.renderShelves();
  });
  root.querySelector("#btnVeil").addEventListener("click",()=>{
    localStorage.removeItem("sophia7_spawn_all");
    (window._artifacts||[]).forEach(a=>a.unlocked=false);
    if(window.renderShelves) window.renderShelves();
  });
  root.querySelector("#btnInvoke").addEventListener("click",()=>{
    const name=root.querySelector("#angelName").value.trim();
    const out=root.querySelector("#angelOut");
    if(!name){ out.textContent="Enter an angel name."; return; }
    out.textContent=`Sigil displayed for ${name}. This is a ritual-art simulation; practice ND-safe, mindful engagement.`;
  });
}
document.addEventListener("DOMContentLoaded",renderAltar);
})();
