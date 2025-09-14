import { loadAtelier } from "../atelier_api.mjs";

export function scribalRaphael() {
  const data = loadAtelier("01_scribal_raphael");
  return { angel: "Raphael", role: "Scribe", ...data };
}
