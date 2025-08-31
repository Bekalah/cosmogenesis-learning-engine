"""
✦ Codex 144:99 -- Visionary Palette Engine (Cymatics support)
Generates radiant, symbolic images using a shared palette JSON so JS engines (e.g., Cymatics.js)
and Python renders match even when the repo keeps only a top-level `engines/` directory.

Usage (from repo root or from engines/):
    python engines/visionary_palette.py --width 1400 --height 1400 --symmetry 8 --mode kaleido
    python engines/visionary_palette.py --mode spiral --seed 33 --out assets/cymatics
    python engines/visionary_palette.py --mode flame_like --iters 12

Outputs:
    assets/cymatics/cymatics_<mode>_YYYYMMDD_HHMMSS.png   (default folder auto-created)

Dependencies:
    pip install pillow numpy
"""

import argparse
import json
import math
import os
import random
import sys
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image


# ✦ Codex 144:99 -- preserve original intention
# ------------------------------------------------------------
# Palette loading (shared JSON) with safe fallback
# Looks in these locations (first found wins):
#   ./shared/palettes/visionary.json
#   ./data/palettes/visionary.json
#   ./engines/visionary.json
# If none found, uses a built-in visionary palette.
# ------------------------------------------------------------
def load_palette_json():
    here = Path(__file__).resolve()
    repo_root = here.parents[1]  # assume engines/ is at repo root

    candidates = [
        repo_root / "shared" / "palettes" / "visionary.json",
        repo_root / "data" / "palettes" / "visionary.json",
        here.parent / "visionary.json",
    ]
    for p in candidates:
        if p.exists():
            try:
                data = json.loads(p.read_text())
                # Expected structure:
                # {
                #   "visionary": {
                #     "core": { "indigo":"#280050", "violet":"#460082", ... },
                #     "secondary": { ... }
                #   }
                # }
                core = data["visionary"]["core"]
                hexes = list(core.values())  # preserve declared order
                return [hex_to_rgb01(hx) for hx in hexes]
            except Exception:
                # fall through to built-in palette on any error
                pass

    # Fallback palette (Alex Grey / visionary inspired)
    fallback_hex = [
        "#280050",  # deep indigo
        "#460082",  # electric violet
        "#0080FF",  # luminous blue
        "#00FF80",  # auric green
        "#FFC800",  # golden amber
        "#FFFFFF",  # pure light
    ]
    return [hex_to_rgb01(hx) for hx in fallback_hex]


def hex_to_rgb01(hx: str):
    hx = hx.lstrip("#")
    r = int(hx[0:2], 16)
    g = int(hx[2:4], 16)
    b = int(hx[4:6], 16)
    return (r / 255.0, g / 255.0, b / 255.0)


# ✦ Codex 144:99 -- preserve original intention
# ------------------------------------------------------------
# Color interpolation across a discrete palette
# ------------------------------------------------------------
def lerp(a, b, t):
    return a + (b - a) * t


def palette_map(values01: np.ndarray, palette):
    """
    values01: np.ndarray in [0..1], shape (H, W)
    palette: list of (r,g,b) in [0..1]
    Returns float RGB image array in [0..1], shape (H, W, 3)
    """
    n = len(palette)
    if n < 2:
        out = np.zeros((values01.shape[0], values01.shape[1], 3), dtype=np.float32)
        out[..., 0] = palette[0][0]
        out[..., 1] = palette[0][1]
        out[..., 2] = palette[0][2]
        return out

    idx = values01 * (n - 1)
    i0 = np.floor(idx).astype(np.int32)
    i1 = np.clip(i0 + 1, 0, n - 1)
    t = idx - i0

    # Interpolate channel-wise
    p0 = np.array([palette[i][0] for i in i0.flat], dtype=np.float32).reshape(values01.shape)
    p1 = np.array([palette[i][0] for i in i1.flat], dtype=np.float32).reshape(values01.shape)
    r = lerp(p0, p1, t)

    p0 = np.array([palette[i][1] for i in i0.flat], dtype=np.float32).reshape(values01.shape)
    p1 = np.array([palette[i][1] for i in i1.flat], dtype=np.float32).reshape(values01.shape)
    g = lerp(p0, p1, t)

    p0 = np.array([palette[i][2] for i in i0.flat], dtype=np.float32).reshape(values01.shape)
    p1 = np.array([palette[i][2] for i in i1.flat], dtype=np.float32).reshape(values01.shape)
    b = lerp(p0, p1, t)

    out = np.stack([r, g, b], axis=-1)
    return np.clip(out, 0.0, 1.0)


# ✦ Codex 144:99 -- preserve original intention
# ------------------------------------------------------------
# Pattern generators (ND-safe, deterministic with seed)
# Modes: kaleido (default), spiral, flame_like
# ------------------------------------------------------------
def generate_kaleido(width, height, symmetry, params):
    """
    Symmetric interference pattern (calm, luminous).
    """
    x = np.linspace(-1.0, 1.0, width, dtype=np.float32)
    y = np.linspace(-1.0, 1.0, height, dtype=np.float32)
    xx, yy = np.meshgrid(x, y)

    r = np.sqrt(xx**2 + yy**2) + 1e-6
    theta = np.arctan2(yy, xx)
    period = (2.0 * math.pi) / max(1, symmetry)
    theta = (theta % period) * (max(1, symmetry))

    # Layered waves with gentle nonlinearities
    z = (
        np.sin(9.0 * r + 4.5 * theta)
        + 0.6 * np.cos(7.0 * r - 3.0 * theta)
        + 0.35 * np.sin(12.0 * r + 2.0 * np.sin(theta * 1.5))
    )

    # normalize
    z -= z.min()
    denom = z.max() if z.max() != 0 else 1.0
    z /= denom

    gamma = params.get("gamma", 0.9)
    z = np.power(z, gamma).astype(np.float32)
    return z


def generate_spiral(width, height, symmetry, params):
    """
    Spiral radial flow, evoking Jacob's Ladder ascent.
    """
    x = np.linspace(-1.2, 1.2, width, dtype=np.float32)
    y = np.linspace(-1.2, 1.2, height, dtype=np.float32)
    xx, yy = np.meshgrid(x, y)

    r = np.sqrt(xx**2 + yy**2) + 1e-6
    theta = np.arctan2(yy, xx)

    # Spiral arms
    arms = max(1, symmetry // 2)
    z = np.sin(arms * theta + 6.0 * r) * np.exp(-2.5 * r)

    # Subtle standing wave
    z += 0.4 * np.cos(10.0 * r - 3.0 * theta)

    # Normalize to [0..1]
    z -= z.min()
    denom = z.max() if z.max() != 0 else 1.0
    z /= denom

    gamma = params.get("gamma", 1.1)
    z = np.power(z, gamma).astype(np.float32)
    return z


def generate_flame_like(width, height, symmetry, params):
    """
    Lightweight "flame-like" field using iterative domain warps (CPU-friendly).
    Not a true fractal flame, but evokes filaments and tendrils.
    """
    x = np.linspace(-1.6, 1.6, width, dtype=np.float32)
    y = np.linspace(-1.6, 1.6, height, dtype=np.float32)
    xx, yy = np.meshgrid(x, y)

    z = np.zeros_like(xx, dtype=np.float32)
    u, v = xx.copy(), yy.copy()
    iters = int(params.get("iters", 8))
    k = 0.9 + 0.2 * math.sin(symmetry)  # mild link to symmetry

    for _ in range(iters):
        # swirl rotation
        u, v = (
            u * math.cos(k) - v * math.sin(k),
            u * math.sin(k) + v * math.cos(k),
        )
        # inversion + gentle sine warps
        inv = 0.7 / (u * u + v * v + 0.05)
        u = u * inv + 0.15 * np.sin(3.0 * v)
        v = v * inv + 0.15 * np.sin(3.0 * u)
        # accumulation
        z += np.exp(-((u * u + v * v) * 2.2))

    # normalize
    z -= z.min()
    denom = z.max() if z.max() != 0 else 1.0
    z /= denom

    gamma = params.get("gamma", 1.0)
    z = np.power(z, gamma).astype(np.float32)
    return z


# ✦ Codex 144:99 -- preserve original intention
# ------------------------------------------------------------
# Main render pipeline
# ------------------------------------------------------------
def render_image(width, height, symmetry, mode, seed, out_dir):
    # Deterministic randomness for reproducibility
    if seed is not None:
        np.random.seed(seed)
        random.seed(seed)

    palette = load_palette_json()

    params = {}
    if mode == "kaleido":
        field = generate_kaleido(width, height, symmetry, params)
    elif mode == "spiral":
        field = generate_spiral(width, height, symmetry, params)
    elif mode == "flame_like":
        params["iters"] = max(1, int(params.get("iters", 10)))
        field = generate_flame_like(width, height, symmetry, params)
    else:
        raise ValueError(f"Unknown mode: {mode}")

    rgb = palette_map(field, palette)  # (H, W, 3) in [0..1]
    img = (rgb * 255.0).astype(np.uint8)
    image = Image.fromarray(img, mode="RGB")

    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    fname = f"cymatics_{mode}_{stamp}.png"
    path = out_dir / fname
    image.save(path)
    return str(path)


# ✦ Codex 144:99 -- preserve original intention
# ------------------------------------------------------------
# CLI
# ------------------------------------------------------------
def parse_args(argv=None):
    p = argparse.ArgumentParser(
        description="Codex 144:99 -- Visionary Palette Generator (Cymatics support)"
    )
    p.add_argument("--width", type=int, default=1024, help="Image width (px)")
    p.add_argument("--height", type=int, default=1024, help="Image height (px)")
    p.add_argument("--symmetry", type=int, default=6, help="Rotational symmetry factor")
    p.add_argument(
        "--mode",
        type=str,
        default="kaleido",
        choices=["kaleido", "spiral", "flame_like"],
        help="Field generator mode",
    )
    p.add_argument("--seed", type=int, default=None, help="Deterministic seed")
    p.add_argument(
        "--out",
        type=str,
        default="assets/cymatics",
        help="Output folder (auto-created)",
    )
    p.add_argument(
        "--iters",
        type=int,
        default=10,
        help="Iteration depth for flame_like mode (ignored otherwise)",
    )
    return p.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)

    # pass iters for flame_like mode
    params_overrides = {}
    if args.mode == "flame_like":
        params_overrides["iters"] = args.iters

    try:
        out_path = render_image(
            width=args.width,
            height=args.height,
            symmetry=args.symmetry,
            mode=args.mode,
            seed=args.seed,
            out_dir=args.out,
        )
        print(f"Saved: {out_path}")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()