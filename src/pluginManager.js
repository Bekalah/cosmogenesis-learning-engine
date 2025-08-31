// Simple plugin manager storing plugin objects by ID
const registry = new Map();

export function registerPlugin(plugin) {
  if (!plugin || !plugin.id) {
    throw new Error('Plugin must have an id');
  }
  registry.set(plugin.id, { plugin, active: false });
}

export async function activate(id, engine, ...args) {
  const entry = registry.get(id);
  if (!entry) throw new Error(`Plugin not registered: ${id}`);
  if (entry.active) return;
  if (typeof entry.plugin.activate === 'function') {
    await entry.plugin.activate(engine, ...args);
  }
  entry.active = true;
}

export async function deactivate(id, engine) {
  const entry = registry.get(id);
  if (!entry || !entry.active) return;
  if (typeof entry.plugin.deactivate === 'function') {
    await entry.plugin.deactivate(engine);
  }
  entry.active = false;
}

export function list() {
  return Array.from(registry.keys());
}
