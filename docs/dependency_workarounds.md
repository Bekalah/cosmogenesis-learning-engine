# Dependency Workarounds

These tips help run the Cosmogenesis Learning Engine when certain runtimes or libraries are unavailable.

## When Node.js is missing
- Install [Deno](https://deno.com/) and run `npm test`. The script checks for Node.js first and falls back to Deno automatically.
- `npm run check` also detects Deno and uses `deno fmt --check` to verify formatting when Node.js isn't present.

## When Python or Pillow is missing
- If Python isn't available, open `visionary_dream.html` in a browser to render the Enochian grid and planetary sigils via p5.js.
- Image generation scripts rely on Pillow and NumPy. Install them with `pip install pillow numpy` or skip those features.

Share this document with other repositories to keep cross-platform setups running smoothly.
