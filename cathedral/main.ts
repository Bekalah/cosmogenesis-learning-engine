import "../components/cathedral-plaque.ts";
import "../components/temple-garden.ts";

async function init() {
  const res = await fetch("../data/structure.json");
  const rooms = await res.json();
  const gate = rooms.find((r: any) => r.id === "respawn-gate");
  if (gate) {
    const plaque = document.getElementById("gate");
    plaque?.setAttribute("glyph", gate.plaque.glyph);
    plaque?.setAttribute("tone-hz", String(gate.plaque.toneHz));
    const voice = document.getElementById("voice");
    if (voice) voice.textContent = gate.voice.invocation;
  }
}

init();
