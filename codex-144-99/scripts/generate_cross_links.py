#!/usr/bin/env python3
import json
from pathlib import Path

output_path = Path(__file__).resolve().parents[1] / 'data' / 'cross_links.json'

wormholes = []
# Pair 1-36 with 109-144 (offset 108) for numerological inversion
for i in range(1, 37):
    wormholes.append({
        'id': i,
        'nodes': [i, i + 108],
        'method': 'numerological_inversion'
    })

# Pair 37-99 with nodes 82-144 (offset 45) emphasizing culture contrasts
for idx, source in enumerate(range(37, 100), start=37):
    wormholes.append({
        'id': idx,
        'nodes': [source, source + 45],
        'method': 'culture_contrast'
    })

with output_path.open('w') as f:
    json.dump({'wormholes': wormholes}, f, indent=2)

print(f'Generated {len(wormholes)} wormholes to {output_path}')
