async function loadNodes() {
  const res = await fetch("../data/codex_nodes_full.json");
  const nodes = await res.json();
  render(nodes);
  document
    .getElementById("culture")
    .addEventListener("change", () => render(nodes));
  document
    .getElementById("element")
    .addEventListener("change", () => render(nodes));
  document
    .getElementById("safety")
    .addEventListener("change", () => render(nodes));
}

function render(nodes) {
  const c = document.getElementById("culture").value;
  const e = document.getElementById("element").value;
  const s = document.getElementById("safety").value;
  const root = document.getElementById("nodes");
  root.innerHTML = "";
  nodes
    .filter((n) => {
      const cultureOK =
        c === "all" || n.gods.concat(n.goddesses).some((g) => g.culture === c);
      const elementOK =
        e === "all" ||
        (typeof n.element === "string"
          ? n.element.includes(e)
          : n.element.includes(e));
      const sOK =
        s === "all" ||
        (s === "ptsd_true"
          ? n.healing_profile.ptsd_safe === true
          : n.healing_profile.ptsd_safe !== "with care");
      return cultureOK && elementOK && sOK;
    })
    .forEach((n) => {
      const card = document.createElement("div");
      card.className = "card";
      const safety =
        n.healing_profile.ptsd_safe === true
          ? '<span class="badge safe">PTSD-Safe</span>'
          : n.healing_profile.ptsd_safe === "with care"
            ? '<span class="badge care">Use With Care</span>'
            : "";
      card.innerHTML = `
      <div class="title">#${n.node_id} — ${n.name}</div>
      <div class="kv">Angel: ${n.shem_angel} • Daemon: ${n.goetic_demon}</div>
      <div class="kv">Element: ${n.element} • Planet: ${n.planet} • Zodiac: ${n.zodiac}</div>
      <div class="kv">Gods: ${n.gods.map((g) => g.name).join(", ")} • Goddesses: ${n.goddesses.map((g) => g.name).join(", ")}</div>
      <div>${safety}</div>
      <div class="kv">Fusion: ${n.fusion_tags.join(", ")}</div>
    `;
      root.appendChild(card);
    });
  document.getElementById('culture').addEventListener('change', () => render(nodes));
  document.getElementById('element').addEventListener('change', () => render(nodes));
  document.getElementById('safety').addEventListener('change', () => render(nodes));
}

function render(nodes) {
  const c = document.getElementById('culture').value;
  const e = document.getElementById('element').value;
  const s = document.getElementById('safety').value;
  const root = document.getElementById('nodes');
  root.innerHTML = '';
  nodes.filter(n => {
    const cultureOK = c==='all' || n.gods.concat(n.goddesses).some(g => g.culture===c);
    const elementOK = e==='all' || (typeof n.element==='string' ? n.element.includes(e) : n.element.includes(e));
    const sOK = s==='all' || (s==='ptsd_true' ? n.healing_profile.ptsd_safe===true : n.healing_profile.ptsd_safe!=="with care");
    return cultureOK && elementOK && sOK;
  }).forEach(n => {
    const card = document.createElement('div'); card.className = 'card';
    const safety = n.healing_profile.ptsd_safe===true ? '<span class="badge safe">PTSD-Safe</span>' :
                   n.healing_profile.ptsd_safe==="with care" ? '<span class="badge care">Use With Care</span>' : '';
    card.innerHTML = `
      <div class="title">#${n.node_id} — ${n.name}</div>
      <div class="kv">Angel: ${n.shem_angel} • Daemon: ${n.goetic_demon}</div>
      <div class="kv">Element: ${n.element} • Planet: ${n.planet} • Zodiac: ${n.zodiac}</div>
      <div class="kv">Gods: ${n.gods.map(g=>g.name).join(', ')} • Goddesses: ${n.goddesses.map(g=>g.name).join(', ')}</div>
      <div>${safety}</div>
      <div class="kv">Fusion: ${n.fusion_tags.join(', ')}</div>
    `;
    root.appendChild(card);
  });
}

loadNodes();
