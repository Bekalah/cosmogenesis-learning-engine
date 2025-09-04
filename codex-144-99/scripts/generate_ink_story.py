#!/usr/bin/env python3
import json
from pathlib import Path

base = Path(__file__).resolve().parents[1]
nodes_path = base / 'data' / 'codex_nodes_full.json'
links_path = base / 'data' / 'cross_links.json'
output_path = base.parent / 'circuitum99' / 'story.ink'

with nodes_path.open() as f:
    nodes = json.load(f)

# Map nodes by id
nodes_map = {n['node_id']: n for n in nodes}

# Load wormholes
with links_path.open() as f:
    links = json.load(f)['wormholes']

# Build adjacency and create placeholders for missing nodes
adj = {}
for link in links:
    a, b = link['nodes']
    adj.setdefault(a, []).append(b)
    adj.setdefault(b, []).append(a)
    for node_id in (a, b):
        if node_id not in nodes_map:
            nodes_map[node_id] = {
                'node_id': node_id,
                'name': f'Unknown Node {node_id}',
                'egregore_id': f'node_{node_id}'
            }

# Generate Ink content
lines = ["VAR wormhole_3_111 = true\n\n"]
for node_id in sorted(nodes_map):
    node = nodes_map[node_id]
    eid = node['egregore_id']
    lines.append(f"== {eid} ==\n")
    lines.append(f"{node['name']}\n")
    for target_id in adj.get(node_id, []):
        target_eid = nodes_map[target_id]['egregore_id']
        if {node_id, target_id} == {3, 111}:
            lines.append("{ wormhole_3_111:\n")
            lines.append(f"* Enter wormhole -> {target_eid}\n")
            lines.append("}\n")
        else:
            lines.append(f"* Travel to {target_eid} -> {target_eid}\n")
    lines.append("-> END\n\n")

with output_path.open('w') as f:
    f.writelines(lines)

print(f'Wrote Ink story to {output_path}')
