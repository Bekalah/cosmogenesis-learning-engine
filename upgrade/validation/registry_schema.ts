export const registrySchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  required: ["generatedAt", "records"],
  properties: {
    generatedAt: { type: "string", format: "date-time" },
    records: {
      type: "array",
      items: {
        type: "object",
        required: ["slug", "title", "path", "excerpt", "citations"],
        properties: {
          slug: { type: "string" },
          title: { type: "string" },
          path: { type: "string" },
          excerpt: { type: "string" },
          citations: {
            type: "array",
            minItems: 1,
            items: { type: "string" }
          }
        },
        additionalProperties: true
      }
    }
  },
  additionalProperties: true
} as const;

export type RegistrySchema = typeof registrySchema;
