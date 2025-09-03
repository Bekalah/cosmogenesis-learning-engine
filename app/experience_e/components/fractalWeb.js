export default function mount(el) {
  let threads = 0;
  const btn = document.createElement("button");
  btn.textContent = `Threads of healing: ${threads}`;
  btn.addEventListener("click", () => {
    threads++;
    btn.textContent = `Threads of healing: ${threads}`;
  });
  el.appendChild(btn);
const traditions = [
  {
    name: "Usui Reiki",
    note: "Japanese method founded by Mikao Usui around 1922."
  },
  {
    name: "Tibetan Raku Kei",
    note: "Modern lineage linking Reiki practices with Himalayan symbols."
  },
  {
    name: "Karuna Reiki",
    note: "William Lee Rand's 1990s school centered on compassionate action."
  },
  {
    name: "Seichim / Sekhem",
    note: "Energy work inspired by the Egyptian word for vital force."
  },
  {
    name: "Hypnosis",
    note: "Trance arts traced to Greek and Egyptian dream temples."
  },
  {
    name: "EMDR",
    note: "Eye-movement therapy created by Francine Shapiro in 1987."
  },
  {
    name: "Brainspotting",
    note: "David Grand's gaze-based trauma release technique from 2003."
  }
];

export default function mount(el) {
  let idx = 0;
  const btn = document.createElement("button");
  const note = document.createElement("p");

  function update() {
    const t = traditions[idx];
    btn.textContent = `Explore: ${t.name}`;
    note.textContent = t.note;
  }

  btn.addEventListener("click", () => {
    idx = (idx + 1) % traditions.length;
    update();
  });

  update();
  el.appendChild(btn);
  el.appendChild(note);
}
