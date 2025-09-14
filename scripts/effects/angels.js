import angels from "../../liber-arcanae/data/consecration-angels.json" assert { type: "json" };

// Retrieves angel metadata for a given planetary name.
// Returns an object containing the angel's name and attributes or null if not found.
export function angelForPlanet(planet) {
  for (const [name, a] of Object.entries(angels)) {
    if (a.planet === planet) return { name, ...a };
  }
  return null;
}

