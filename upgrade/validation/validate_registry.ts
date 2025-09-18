import { promises as fs } from "node:fs";
import Ajv from "ajv";
import { registrySchema } from "./registry_schema";

const ajv = new Ajv({
  strict: false,
  validateFormats: false,
});

const validateFn = ajv.compile(registrySchema);

export function validateRegistryPayload(payload: unknown): void {
  const valid = validateFn(payload);
  if (!valid) {
    const message = (validateFn.errors || [])
      .map((err) => `${err.instancePath || "/"} ${err.message}`.trim())
      .join("; ");
    throw new Error(`Registry validation failed: ${message}`);
  }
}

export async function validateRegistryFile(filePath: string): Promise<void> {
  const raw = await fs.readFile(filePath, "utf8");
  const payload = JSON.parse(raw);
  validateRegistryPayload(payload);
}
