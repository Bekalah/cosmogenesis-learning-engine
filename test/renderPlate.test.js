import test from "node:test";
import assert from "node:assert/strict";
import { renderPlate } from "../src/renderPlate.js";

const base = { mode: 4, labels: ["a", "b", "c", "d"] };

["spiral", "twin-cone", "wheel", "grid"].forEach((layout) => {
  test(`renderPlate handles ${layout} layout`, () => {
    const plate = renderPlate({ ...base, layout });
    assert.equal(plate.items.length, base.labels.length);
    assert.ok(plate.exportAsJSON().includes(layout));
    assert.ok(plate.exportAsSVG().startsWith("<svg"));
    assert.ok(Buffer.isBuffer(plate.exportAsPNG()));
  });
});
