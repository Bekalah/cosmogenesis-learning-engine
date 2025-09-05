#!/usr/bin/env python3
"""Simple read-only API for serving Codex nodes."""
from flask import Flask, jsonify
import json, os

app = Flask(__name__)

with open(os.path.join(os.path.dirname(__file__), '../data/codex_nodes_full.json'), 'r', encoding='utf-8') as f:
    NODES = json.load(f)

@app.route('/nodes')
def get_nodes():
    return jsonify(NODES)

@app.route('/nodes/<int:node_id>')
def get_node(node_id):
    for n in NODES:
        if n['node_id'] == node_id:
            return jsonify(n)
    return jsonify({'error': 'not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
