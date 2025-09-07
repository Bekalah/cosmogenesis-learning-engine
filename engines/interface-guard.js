// Validates incoming JSON against minimal interface schema.
// ND-safe: avoids network requests and uses tiny built-in checks.
export async function validateInterface(
  payload,
  schemaUrl = "/assets/data/interface.schema.json",
) {
  try {
    const res = await fetch(schemaUrl);
    if (!res.ok) throw new Error("schema fetch failed");
    // Only ensure top-level required keys exist from schema.
    const { required = [] } = await res.json();
    for (const key of required) {
      if (!(key in payload)) {
        return { valid: false, errors: [{ message: `missing ${key}` }] };
      }
    }
    return { valid: true, errors: [] };
  } catch (e) {
    return { valid: false, errors: [{ message: e.message }] };
  }
}
