import { readFileSync } from 'node:fs';
import path from 'node:path';

// Load and deep-freeze Codex 144:99 node data so it cannot be overwritten.
const dataPath = path.resolve('codex-144-99/data/codex_nodes_full.json');
const nodes = JSON.parse(readFileSync(dataPath, 'utf8'));

function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      obj[prop] !== null &&
      (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
}

deepFreeze(nodes);

// Retrieve a deep-cloned node by id
export function getNode(nodeId) {
  const n = nodes.find((node) => node.node_id === nodeId);
  return n ? structuredClone(n) : null;
}

// Retrieve all nodes as deep clones
export function getNodes() {
  return nodes.map((n) => structuredClone(n));
}

// Apply a cultural flavor toggle to a node without mutating base data
export function applyFlavor(node, flavor) {
  if (!node || !flavor || flavor === 'default') {
    return node;
  }
  if (node.flavors && node.flavors[flavor]) {
    return { ...node, ...node.flavors[flavor] };
  }
  return node;
}
