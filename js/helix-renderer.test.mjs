
async function loadRenderer() {
  const candidates = [
    "./helix-renderer.mjs",
    "./helix-renderer.js",
    "../js/helix-renderer.mjs",
    "../src/helix-renderer.mjs",
    "../lib/helix-renderer.mjs",
  ];
  let lastErr;
  for (const p of candidates) {
    try {
      return await import(p);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("helix-renderer module not found in expected paths.");
}

// Simple canvas context spy to capture operations invoked by renderer.
function createCtxSpy({ width = 800, height = 600 } = {}) {
  const calls = [];
  const record = (name, ...args) => calls.push({ name, args });
  const gradients = [];

  const makeGradient = (kind, ...args) => {
    const stops = [];
    const obj = {
      kind,
      args,
      stops,
      addColorStop: (offset, color) => {
        stops.push({ offset, color });
      }
    };
    gradients.push(obj);
    return obj;
  };

  const ctx = {
    canvas: { width, height },
    calls,
    gradients,
    save: () => record("save"),
    restore: () => record("restore"),
    beginPath: () => record("beginPath"),
    arc: (...a) => record("arc", ...a),
    moveTo: (...a) => record("moveTo", ...a),
    lineTo: (...a) => record("lineTo", ...a),
    stroke: () => record("stroke"),
    fill: () => record("fill"),
    fillRect: (...a) => record("fillRect", ...a),
    setLineDash: (...a) => record("setLineDash", ...a),
    fillText: (...a) => record("fillText", ...a),
    createRadialGradient: (...a) => makeGradient("radial", ...a),
    createLinearGradient: (...a) => makeGradient("linear", ...a),
    // properties we expect to be set
    set fillStyle(v) { record("set:fillStyle", v); },
    set strokeStyle(v) { record("set:strokeStyle", v); },
    set lineWidth(v) { record("set:lineWidth", v); },
    set globalAlpha(v) { record("set:globalAlpha", v); },
    set font(v) { record("set:font", v); },
    set textAlign(v) { record("set:textAlign", v); },
  };
  return ctx;
}

function findCall(calls, name) {
  return calls.find(c => c.name === name);
}
function getAllCalls(calls, name) {
  return calls.filter(c => c.name === name);
}

test("renderHelix: handles missing/invalid context gracefully", async () => {
  const { renderHelix } = await loadRenderer();
  const result1 = renderHelix(null);
  assert.equal(result1.summary, "Canvas context unavailable; rendering skipped.");

  const result2 = renderHelix({}); // missing save()
  assert.equal(result2.summary, "Canvas context unavailable; rendering skipped.");
});

test("renderHelix: returns deterministic summary with defaults", async () => {
  const { renderHelix } = await loadRenderer();
  const ctx = createCtxSpy();
  const { summary } = renderHelix(ctx, {});
  assert.equal(
    summary,
    "Vesica 21 pairs | Tree 11 nodes/22 paths | Fibonacci 12 markers | Helix 11 rungs"
  );

  // basic structural expectations
  assert.ok(findCall(ctx.calls, "save"), "ctx.save() should be called");
  assert.ok(findCall(ctx.calls, "restore"), "ctx.restore() should be called");
  // stage cleared to full canvas size
  const fillRect = findCall(ctx.calls, "fillRect");
  assert.deepEqual(fillRect.args, [0, 0, 800, 600]);
});

test("renderHelix: respects explicit width/height options in dimension resolver", async () => {
  const { renderHelix } = await loadRenderer();
  const ctx = createCtxSpy({ width: 300, height: 200 });
  renderHelix(ctx, { width: 640, height: 480 });
  // first fillRect should use provided options
  const firstFillRect = getAllCalls(ctx.calls, "fillRect")[0];
  assert.deepEqual(firstFillRect.args, [0, 0, 640, 480]);
});

test("palette merging: pads layers to fallback length and uses bg/ink defaults", async () => {
  const { renderHelix } = await loadRenderer();
  const ctx = createCtxSpy();
  // Provide only two layer colors; others must fall back to defaults.
  const palette = { bg: "#101010", layers: ["#111111", "#222222"] };
  renderHelix(ctx, { palette });

  // Inspect radial gradient color stops: index 0 uses layers[3] with alpha 0.2.
  // Default layers[3] is #ffd27f -> rgba(255, 210, 127, 0.2)
  const radial = ctx.gradients.find(g => g.kind === "radial");
  assert.ok(radial, "background radial gradient should be created");
  const stop0 = radial.stops.find(s => s.offset === 0);
  assert.equal(stop0.color, "rgba(255, 210, 127, 0.2)");
});

test("palette merging: invalid bg propagates to gradient without alpha transform", async () => {
  const { renderHelix } = await loadRenderer();
  const ctx = createCtxSpy();
  renderHelix(ctx, { palette: { bg: "#zzz" } });
  const radial = ctx.gradients.find(g => g.kind === "radial");
  assert.ok(radial);
  const lastStop = radial.stops.find(s => s.offset === 1);
  assert.equal(lastStop.color, "#zzz"); // withAlpha returns original when not 6-hex
});

test("numbers merging: ignores non-finite, applies valid overrides to affect summary", async () => {
  const { renderHelix } = await loadRenderer();
  const ctx1 = createCtxSpy();
  // Override ONEFORTYFOUR to reduce Fibonacci markers; ignore bad fields.
  const NUM = {
    ONEFORTYFOUR: 21, // valid
    THREE: Infinity,  // ignored
    SEVEN: NaN,       // ignored
    ELEVEN: "11",     // ignored (string)
  };
  const { summary: s1 } = renderHelix(ctx1, { NUM });
  assert.equal(
    s1,
    "Vesica 21 pairs | Tree 11 nodes/22 paths | Fibonacci 8 markers | Helix 11 rungs"
  );

  // Now change THREE to 2 (valid) to affect vesica pairs (rows*cols) and helix rungs (every THREE steps)
  const ctx2 = createCtxSpy();
  const { summary: s2 } = renderHelix(ctx2, { NUM: { THREE: 2 } });
  // rows = 7, cols = 2 => 14 pairs; rungs at even indices from 0..32 => 17
  assert.equal(
    s2,
    "Vesica 14 pairs | Tree 11 nodes/22 paths | Fibonacci 12 markers | Helix 17 rungs"
  );
});

test("drawVesicaField: sets dash pattern using TWENTYTWO and draws axis", async () => {
  const { renderHelix } = await loadRenderer();
  const ctx = createCtxSpy();
  renderHelix(ctx, {});
  const dashes = findCall(ctx.calls, "setLineDash");
  assert.ok(dashes, "should set line dash for vesica axis");
  assert.deepEqual(dashes.args, [[22, 22]]);
  // We expect at least one vertical axis line via moveTo/lineTo
  assert.ok(getAllCalls(ctx.calls, "moveTo").length > 0);
  assert.ok(getAllCalls(ctx.calls, "lineTo").length > 0);
});

test("notice: draws footer text centered at bottom when provided", async () => {
  const { renderHelix } = await loadRenderer();
  const ctx = createCtxSpy({ width: 500, height: 400 });
  const notice = "Serene geometry";
  renderHelix(ctx, { notice });
  const call = findCall(ctx.calls, "fillText");
  assert.ok(call, "fillText should be invoked for notice");
  // x = width/2, y = height - 16
  assert.deepEqual(call.args, [notice, 250, 384]);
});
