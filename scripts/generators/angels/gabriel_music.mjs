import { loadAtelier } from "../atelier_api.mjs";

export function musicGabriel() {
  const data = loadAtelier("04_music_gabriel");
  return { angel: "Gabriel", role: "Music", ...data };
}
