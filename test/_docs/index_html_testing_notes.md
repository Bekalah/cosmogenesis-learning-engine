These tests use Node's built-in `node:test` runner and `node:assert/strict` to validate index.html's inline module logic without external dependencies:

- We read index.html and extract the first `<script type="module">` block.
- We replace the ESM import of `./js/helix-renderer.mjs` with a test stub exposed on `globalThis.__TEST__.renderHelix`.
- We execute the transformed script in a `vm` context with a minimal DOM stub (document, canvas, style).
- We assert behavior for:
  - Fallback palette when fetch fails.
  - Loaded palette when fetch returns a JSON payload.
  - No 2D context (graceful status message, renderer not invoked).
- We also verify NUM constants and basic HTML structure.

If your project uses Vitest/Jest/Mocha, you can adapt imports accordingly.