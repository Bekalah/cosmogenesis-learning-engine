# Dependency Workarounds

These tips help run the Cosmogenesis Learning Engine when certain runtimes or libraries are unavailable.

## When Node.js is missing
- Install [Deno](https://deno.com/) and run `npm test`. The script checks for Node.js first and falls back to Deno automatically.
- `npm run check` also detects Deno and uses `deno fmt --check` to verify formatting when Node.js isn't present.

## When Python tooling is missing
- The core engine runs without Python. Any image helpers are optional and can be skipped when a Python runtime isn't available.

Share this document with other repositories to keep cross-platform setups running smoothly.
