#!/usr/bin/env python3
"""Export subsets of the codex based on element or culture."""
import json, argparse, os

def load_nodes(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save(nodes, out_path):
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(nodes, f, ensure_ascii=False, indent=2)


def filter_by(nodes, element=None, culture=None):
    out = []
    for n in nodes:
        if element and (element not in n.get('element', '')):
            continue
        if culture and not any(g.get('culture') == culture for g in n.get('gods', []) + n.get('goddesses', [])):
            continue
        out.append(n)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--input', required=True)
    ap.add_argument('--output', required=True)
    ap.add_argument('--element')
    ap.add_argument('--culture')
    args = ap.parse_args()

    nodes = load_nodes(args.input)
    sliced = filter_by(nodes, args.element, args.culture)
    save(sliced, args.output)
    print(f"Wrote {len(sliced)} nodes → {args.output}")

if __name__ == '__main__':
    main()
