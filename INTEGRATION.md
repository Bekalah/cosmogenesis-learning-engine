# Integration Guide

This repository can now be consumed as a module in other applications. It exposes the core IndraNet engine, the shared `bridge` dataset, and a helper for loading any of the JSON datasets.

## Install

```bash
npm install cosmogenesis-learning-engine
```

## Usage

```javascript
import { IndraNet, bridge, loadDataset } from "cosmogenesis-learning-engine";

const net = new IndraNet();
await net.load(
  "./node_modules/cosmogenesis-learning-engine/bridge/c99-bridge.json",
);
net.mount(document.getElementById("viz")).render();

const palette = await loadDataset("palette");
console.log(palette[0]);
```

All data and example artworks reference open-source or CC0 assets, allowing remixing and reuse across apps.
