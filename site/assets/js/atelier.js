// atelier.js — minimal calm mode toggle, no animation.
const calmToggle = document.getElementById("calmToggle");
const body = document.body;

function setCalmMode(state) {
  body.classList.toggle("is-calm", state);
  calmToggle.setAttribute("aria-pressed", String(state));
  calmToggle.textContent = state ? "Calm Mode: On" : "Calm Mode";
}

function loadPreference() {
  try {
    const stored = localStorage.getItem("cosmogenesis:calm-mode");
    return stored === "true";
  } catch (err) {
    return false;
  }
}

function savePreference(state) {
  try {
    localStorage.setItem("cosmogenesis:calm-mode", String(state));
  } catch (err) {
    // storage may be disabled; ignore to remain offline-safe
  }
}

if (calmToggle) {
  const initial = loadPreference();
  setCalmMode(initial);
  calmToggle.addEventListener("click", () => {
    const next = !body.classList.contains("is-calm");
    setCalmMode(next);
    savePreference(next);
  });
}
