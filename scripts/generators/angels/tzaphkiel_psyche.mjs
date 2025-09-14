import { loadAtelier } from "../atelier_api.mjs";

export function psycheTzaphkiel() {
  const data = loadAtelier("06_psyche_tzaphkiel");
  return { angel: "Tzaphkiel", role: "Psyche", ...data };
}
