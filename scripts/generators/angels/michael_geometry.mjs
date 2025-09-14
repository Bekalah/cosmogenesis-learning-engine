import { loadAtelier } from "../atelier_api.mjs";

export function geometryMichael() {
  const data = loadAtelier("03_geometry_michael");
  return { angel: "Michael", role: "Geometry", ...data };
}
