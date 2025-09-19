/*
  onArcanaSwitch.js
  Maps tarot arcana selections to octagram tesseract nodes.
  Ensures ND-safe activation using activate(id,{nd_safe:true}).
*/

import { activate } from "../../js/octagram-tesseract.mjs";

const ARCANA_MAP = new Map([
  ["The Hierophant:Moonchild", { node: "C144N-001", key: "OCTA-OCTARINE" }],
  ["The Tower", { node: "C144N-002", key: "OCTA-CROWLEY" }],
  ["The High Priestess", { node: "C144N-003", key: "OCTA-FORTUNE" }],
  ["The Fool", { node: "C144N-004", key: "OCTA-ACHAD" }],
  ["The Magician", { node: "C144N-005", key: "OCTA-AGRIPPA" }],
  ["Temperance", { node: "C144N-006", key: "OCTA-PFCASE" }],
  ["Justice", { node: "C144N-007", key: "OCTA-SKINNER" }],
  ["The Star", { node: "C144N-008", key: "OCTA-TARA" }]
]);

export function onArcanaSwitch(arcana) {
  if (!ARCANA_MAP.has(arcana)) {
    return null;
  }
  const mapping = ARCANA_MAP.get(arcana);
  const activation = activate(mapping.node, { nd_safe: true });
  return {
    arcana,
    octagram: mapping.key,
    node: mapping.node,
    activation
  };
}

export function listArcana() {
  return Array.from(ARCANA_MAP.keys());
}
