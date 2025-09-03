#!/usr/bin/env python3
"""Validate lock hashes for expanded codex nodes."""
import json, hashlib, argparse

def compute_hash(node):
    lock_str = json.dumps(node, sort_keys=True, ensure_ascii=False).encode('utf-8')
    return hashlib.sha256(lock_str).hexdigest()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--input', required=True)
    args = ap.parse_args()

    with open(args.input, 'r', encoding='utf-8') as f:
        nodes = json.load(f)

    bad = []
    for n in nodes:
        expected = n.get('lock_hash')
        calc = compute_hash({k: v for k, v in n.items() if k != 'lock_hash'})
        if expected != calc:
            bad.append(n['node_id'])
    if bad:
        print('Hash mismatch for nodes:', bad)
        raise SystemExit(1)
    print(f"All {len(nodes)} nodes validated")

if __name__ == '__main__':
    main()
