import { loadAtelier } from "../atelier_api.mjs";

export function pigmentHaniel() {
  const data = loadAtelier("02_pigment_haniel");
  return { angel: "Haniel", role: "Pigment", ...data };
}
