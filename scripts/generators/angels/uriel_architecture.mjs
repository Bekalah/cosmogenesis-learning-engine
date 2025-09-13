import { loadAtelier } from "../atelier_api.mjs";

export function architectureUriel() {
  const data = loadAtelier("05_architecture_uriel");
  return { angel: "Uriel", role: "Architecture", ...data };
}
