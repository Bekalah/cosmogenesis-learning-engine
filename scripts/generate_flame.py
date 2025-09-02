#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cosmogenesis Learning Engine -- Flame & Atlas Foundry (Codex 144:99)
Museum-grade asset generator for visionary plates:
- Fractal "flame" backgrounds (IFS + nonlinear variations)
- Palette-aware color grading aligned with app stylepacks
- PNG optimization (palette quantization + optional dithering)
- Batch rendering, sprite atlas packing, gallery thumbnails
- Manifest JSON for the front-end to auto-discover assets

Dependencies:
  pip install pillow numpy

Usage (single):
  python3 scripts/generate_flame.py flame --out assets/flame/flame.png

Batch (N variants):
  python3 scripts/generate_flame.py batch --out assets/flame --count 6 --width 1920 --height 1920

Atlas from a folder:
  python3 scripts/generate_flame.py atlas --inp assets/flame --out assets/flame/atlas.png

Thumbnails for gallery:
  python3 scripts/generate_flame.py thumbs --inp exports --out exports/thumbs --size 512

Write a manifest.json describing assets:
  python3 scripts/generate_flame.py manifest --root assets/flame --out assets/flame/manifest.json

All-in one sample (batch → atlas → thumbs → manifest):
  python3 scripts/generate_flame.py all --root assets/flame --count 6

Notes:
- This file intentionally bundles multiple utilities to save repo space and reduce script sprawl.
- Output images are palettized PNGs to keep the repo lightweight without sacrificing visual quality.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import random
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Dict, Iterable, List, Sequence, Tuple

import numpy as np
from PIL import Image, ImageOps


# ----------------------------- Stylepacks (match app) ----------------------------- #

STYLEPACKS: Dict[str, Dict] = {
    "hilma_spiral": {
        "nodes": ["#b7410e", "#c56a1a", "#d7a21a", "#2e7d32", "#1f6feb", "#4338ca", "#6d28d9"],
        "bg": "#f8f5ef",
    },
    "rosicrucian_black": {
        "nodes": ["#f5f5f5", "#d32f2f", "#fbc02d", "#9e9e9e", "#9c27b0", "#26a69a", "#64b5f6"],
        "bg": "#111111",
    },
    "alchemical_bloom": {
        "nodes": ["#7f5539", "#b08968", "#e6ccb2", "#a3b18a", "#669bbc", "#7d8597", "#9a8c98"],
        "bg": "#fff9f4",
    },
    "angelic_chorus": {
        "nodes": ["#ffd6e7", "#d5e8ff", "#e5ffdf", "#fff4c2", "#e6e1ff", "#dff9ff", "#ffe6d1"],
        "bg": "#ffffff",
    },
    "venus_net": {
        "nodes": ["#2ecc71", "#a3e635", "#86efac", "#bbf7d0", "#34d399", "#65a30d", "#16a34a"],
        "bg": "#f1fff5",
    },
    "rilke_slate": {
        "nodes": ["#94a3b8", "#64748b", "#475569", "#334155", "#a1a1aa", "#71717a", "#52525b"],
        "bg": "#f4f5f7",
    },
}


def hex_to_rgb(h: str) -> Tuple[int, int, int]:
    h = h.strip().lstrip("#")
    if len(h) == 3:
        h = "".join([c * 2 for c in h])
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def make_gradient(stops: Sequence[str], steps: int) -> np.ndarray:
    """Return an Nx3 uint8 gradient table interpolated across hex color 'stops'."""
    if steps < 2:
        steps = 2
    cols = np.array([hex_to_rgb(s) for s in stops], dtype=np.float32)
    # Evenly spaced interpolation along stops
    out = np.zeros((steps, 3), dtype=np.float32)
    for i in range(steps):
        t = i / (steps - 1)
        pos = t * (len(cols) - 1)
        i0 = int(math.floor(pos))
        i1 = min(i0 + 1, len(cols) - 1)
        u = pos - i0
        out[i] = cols[i0] * (1.0 - u) + cols[i1] * u
    return np.clip(out, 0, 255).astype(np.uint8)


# ----------------------------- Fractal Flame (IFS-ish) ----------------------------- #

@dataclass
class Affine:
    a: float
    b: float
    c: float
    d: float
    e: float
    f: float
    p: float  # probability weight
    hue: float  # 0..1 preferred color index

    def apply(self, x: float, y: float) -> Tuple[float, float]:
        return self.a * x + self.b * y + self.c, self.d * x + self.e * y + self.f


def spherical(x: float, y: float) -> Tuple[float, float]:
    r2 = x * x + y * y + 1e-8
    return x / r2, y / r2


def swirl(x: float, y: float) -> Tuple[float, float]:
    r2 = x * x + y * y
    s = math.sin(r2)
    c = math.cos(r2)
    return x * s - y * c, x * c + y * s


def sinusoidal(x: float, y: float) -> Tuple[float, float]:
    return math.sin(x), math.sin(y)


def horseshoe(x: float, y: float) -> Tuple[float, float]:
    r = math.hypot(x, y) + 1e-8
    return (x - y) * (x + y) / r, 2 * x * y / r


VARIATIONS: Sequence[Callable[[float, float], Tuple[float, float]]] = (
    spherical,
    swirl,
    sinusoidal,
    horseshoe,
)


def random_affines(k: int, rng: random.Random) -> List[Affine]:
    aff: List[Affine] = []
    for i in range(k):
        # gentle transformations
        a = rng.uniform(-1.0, 1.0)
        b = rng.uniform(-1.0, 1.0)
        d = rng.uniform(-1.0, 1.0)
        e = rng.uniform(-1.0, 1.0)
        # bias toward small translations for coherence
        c = rng.uniform(-0.3, 0.3)
        f = rng.uniform(-0.3, 0.3)
        p = abs(rng.gauss(0.5, 0.3)) + 0.05
        hue = i / max(1, k - 1)
        aff.append(Affine(a, b, c, d, e, f, p, hue))
    # normalize probabilities
    s = sum(a.p for a in aff)
    for a in aff:
        a.p /= s
    return aff


def flame(
    width: int = 1920,
    height: int = 1920,
    samples: int = 2_000_000,
    seed: int | None = None,
    palette_key: str = "hilma_spiral",
    gamma: float = 2.2,
    burn_in: int = 50,
    transforms: int = 5,
) -> Image.Image:
    """
    Render a flame-like fractal using a simple IFS + nonlinear variations approach.
    Returns a Pillow Image (RGB).
    """
    rng = random.Random(seed or random.randrange(2**30))
    # choose/set palette
    style = STYLEPACKS.get(palette_key, STYLEPACKS["hilma_spiral"])
    grad = make_gradient(style["nodes"], 1024)  # 1024-step gradient

    # transforms + choose variations per transform
    aff = random_affines(transforms, rng)
    var_idx = [rng.randrange(len(VARIATIONS)) for _ in aff]

    # density and color index buffers
    dens = np.zeros((height, width), dtype=np.float32)
    colr = np.zeros((height, width), dtype=np.float32)

    # map coordinates to image pixels
    def to_px(x: float, y: float) -> Tuple[int, int]:
        ix = int((x * 0.45 + 0.5) * (width - 1))
        iy = int((y * 0.45 + 0.5) * (height - 1))
        return ix, iy

    x, y = rng.uniform(-0.1, 0.1), rng.uniform(-0.1, 0.1)

    # create cumulative probability array for fast selection
    cdf: List[float] = []
    cum = 0.0
    for a in aff:
        cum += a.p
        cdf.append(cum)

    def choose_aff(u: float) -> int:
        # binary search could be used; linear is fine for small K
        for i, v in enumerate(cdf):
            if u <= v:
                return i
        return len(cdf) - 1

    # iterate
    total = burn_in + samples
    for i in range(total):
        k = choose_aff(rng.random())
        a = aff[k]
        x, y = a.apply(x, y)
        # nonlinear warp
        vx, vy = VARIATIONS[var_idx[k]](x, y)
        # gentle blend to keep coherence
        x = (x + 0.7 * vx) * 0.8
        y = (y + 0.7 * vy) * 0.8

        if i < burn_in:
            continue

        ix, iy = to_px(x, y)
        if 0 <= ix < width and 0 <= iy < height:
            dens[iy, ix] += 1.0
            # accumulate hue preference toward this transform's hue
            colr[iy, ix] = (colr[iy, ix] * 0.9) + (a.hue * 0.1)

    # tone map: log density, gamma correct
    if dens.max() > 0:
        dens = np.log1p(dens) / math.log1p(dens.max())
    dens = np.clip(dens, 0.0, 1.0)
    if gamma and gamma > 0:
        dens = np.power(dens, 1.0 / gamma)

    # index into gradient via blended hue with density as weight
    idx = (colr * 0.65 + dens * 0.35) * (len(grad) - 1)
    idx = np.clip(idx, 0, len(grad) - 1).astype(np.int32)
    rgb = grad[idx]  # (H,W,3) uint8

    # apply density as brightness multiplier
    rgb = (rgb.astype(np.float32) * dens[..., None]).astype(np.uint8)

    img = Image.fromarray(rgb, mode="RGB")
    return img


# ----------------------------- PNG optimization & IO ----------------------------- #

def save_png_optimized(img: Image.Image, out: Path, palette: int = 256, dither: bool = True) -> None:
    """
    Save as palettized PNG (smaller) while preserving quality.
    """
    out.parent.mkdir(parents=True, exist_ok=True)
    # Quantize to palette size using median cut (fast, good), dither optional
    method = Image.MEDIANCUT
    dither_flag = Image.FLOYDSTEINBERG if dither else Image.NONE
    q = img.convert("RGB").quantize(colors=palette, method=method, dither=dither_flag)
    q.save(out, format="PNG", optimize=True)
    print(f"💾 wrote {out} ({out.stat().st_size/1024:.1f} KiB)")


def write_manifest(root: Path, out: Path) -> None:
    items = []
    for p in sorted(root.rglob("*.png")):
        if p.name.lower().endswith((".png",)):
            try:
                with Image.open(p) as im:
                    w, h = im.size
            except Exception:
                w = h = None
            items.append(
                {
                    "path": str(p.relative_to(root)),
                    "width": w,
                    "height": h,
                    "bytes": p.stat().st_size,
                }
            )
    manifest = {
        "root": str(root),
        "count": len(items),
        "items": items,
    }
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(manifest, indent=2))
    print(f"📜 manifest → {out}")


# ----------------------------- Atlas & Thumbnails ----------------------------- #

def pack_grid(images: List[Image.Image], names: List[str], cols: int | None = None) -> Tuple[Image.Image, Dict]:
    n = len(images)
    if n == 0:
        raise ValueError("No images to pack")
    if cols is None:
        cols = int(math.ceil(math.sqrt(n)))
    rows = int(math.ceil(n / cols))
    # use max size for cell
    w = max(im.width for im in images)
    h = max(im.height for im in images)
    atlas = Image.new("RGBA", (cols * w, rows * h), (0, 0, 0, 0))
    mapdata = {}
    for i, (im, name) in enumerate(zip(images, names)):
        r = i // cols
        c = i % cols
        x, y = c * w, r * h
        if im.mode != "RGBA":
            im = im.convert("RGBA")
        atlas.paste(im, (x, y))
        mapdata[name] = {"x": x, "y": y, "w": im.width, "h": im.height, "row": r, "col": c}
    return atlas, mapdata


def make_thumbs(inp: Path, out: Path, size: int = 512) -> None:
    out.mkdir(parents=True, exist_ok=True)
    for p in sorted(inp.rglob("*.png")):
        rel = p.relative_to(inp)
        dest = out / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(p) as im:
            thumb = ImageOps.contain(im.convert("RGB"), (size, size), Image.LANCZOS)
            save_png_optimized(thumb, dest, palette=256, dither=False)


# ----------------------------- CLI Commands ----------------------------- #

def cmd_flame(args: argparse.Namespace) -> None:
    img = flame(
        width=args.width,
        height=args.height,
        samples=args.samples,
        seed=args.seed,
        palette_key=args.palette,
        gamma=args.gamma,
        burn_in=args.burn_in,
        transforms=args.transforms,
    )
    save_png_optimized(img, Path(args.out), palette=args.palette_size, dither=not args.no_dither)


def cmd_batch(args: argparse.Namespace) -> None:
    outdir = Path(args.out or args.root or "assets/flame")
    outdir.mkdir(parents=True, exist_ok=True)
    for i in range(args.count):
        seed = (args.seed + i) if args.seed is not None else random.randrange(2**30)
        pk = args.palette if args.palette != "auto" else random.choice(list(STYLEPACKS.keys()))
        img = flame(
            width=args.width,
            height=args.height,
            samples=args.samples,
            seed=seed,
            palette_key=pk,
            gamma=args.gamma,
            burn_in=args.burn_in,
            transforms=args.transforms,
        )
        name = f"flame_{i:02d}_{pk}_s{seed}.png"
        save_png_optimized(img, outdir / name, palette=args.palette_size, dither=not args.no_dither)


def cmd_atlas(args: argparse.Namespace) -> None:
    inp = Path(args.inp)
    out = Path(args.out)
    imgs: List[Image.Image] = []
    names: List[str] = []
    for p in sorted(inp.glob("*.png")):
        try:
            im = Image.open(p)
        except Exception:
            continue
        imgs.append(im)
        names.append(p.name)
    if not imgs:
        print(f"No PNGs in {inp}")
        return
    atlas, mapdata = pack_grid(imgs, names, cols=args.cols)
    out.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(out, "PNG", optimize=True)
    map_path = out.with_suffix(".json")
    map_path.write_text(json.dumps({"image": str(out), "map": mapdata}, indent=2))
    print(f"🧩 atlas → {out} and {map_path}")
    for im in imgs:
        im.close()


def cmd_thumbs(args: argparse.Namespace) -> None:
    make_thumbs(Path(args.inp), Path(args.out), size=args.size)


def cmd_manifest(args: argparse.Namespace) -> None:
    write_manifest(Path(args.root), Path(args.out))


def cmd_all(args: argparse.Namespace) -> None:
    root = Path(args.root or "assets/flame")
    root.mkdir(parents=True, exist_ok=True)
    # 1) batch
    bargs = argparse.Namespace(
        out=str(root),
        root=str(root),
        count=args.count,
        width=args.width,
        height=args.height,
        samples=args.samples,
        seed=args.seed,
        palette=args.palette,
        palette_size=args.palette_size,
        gamma=args.gamma,
        burn_in=args.burn_in,
        transforms=args.transforms,
        no_dither=args.no_dither,
    )
    cmd_batch(bargs)
    # 2) atlas
    a_png = root / "atlas.png"
    aargs = argparse.Namespace(inp=str(root), out=str(a_png), cols=args.cols)
    cmd_atlas(aargs)
    # 3) thumbs
    thumbs_dir = root / "thumbs"
    targs = argparse.Namespace(inp=str(root), out=str(thumbs_dir), size=args.thumb_size)
    cmd_thumbs(targs)
    # 4) manifest
    margs = argparse.Namespace(root=str(root), out=str(root / "manifest.json"))
    cmd_manifest(margs)
    print("✅ all: batch → atlas → thumbs → manifest complete.")


# ----------------------------- Argument Parser ----------------------------- #

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="generate_flame.py",
        description="Cosmogenesis Flame & Atlas Foundry (Pillow + NumPy)",
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    def add_common(sp: argparse.ArgumentParser):
        sp.add_argument("--width", type=int, default=1920, help="image width")
        sp.add_argument("--height", type=int, default=1920, help="image height")
        sp.add_argument("--samples", type=int, default=2_000_000, help="iteration samples")
        sp.add_argument("--seed", type=int, default=None, help="random seed")
        sp.add_argument("--palette", type=str, default="hilma_spiral", choices=list(STYLEPACKS.keys()) + ["auto"], help="stylepack palette")
        sp.add_argument("--palette-size", type=int, default=256, help="PNG palette size (colors)")
        sp.add_argument("--gamma", type=float, default=2.2, help="gamma for tone mapping (>=1)")
        sp.add_argument("--burn-in", type=int, default=50, help="discard first N iterations")
        sp.add_argument("--transforms", type=int, default=5, help="number of affine transforms")
        sp.add_argument("--no-dither", action="store_true", help="disable Floyd–Steinberg dithering (smaller files)")
        return sp

    # flame
    sp = add_common(sub.add_parser("flame", help="render a single flame"))
    sp.add_argument("--out", required=True, help="output PNG path")
    sp.set_defaults(func=cmd_flame)

    # batch
    sp = add_common(sub.add_parser("batch", help="render N flames into a folder"))
    sp.add_argument("--out", help="output directory (default = --root)")
    sp.add_argument("--root", help="alias of out directory (compat)", default="assets/flame")
    sp.add_argument("--count", type=int, default=6, help="number of variants")
    sp.set_defaults(func=cmd_batch)

    # atlas
    sp = sub.add_parser("atlas", help="pack PNGs from a folder into an atlas.png + .json")
    sp.add_argument("--inp", required=True, help="input folder of PNGs")
    sp.add_argument("--out", required=True, help="output atlas .png")
    sp.add_argument("--cols", type=int, default=None, help="fixed columns (default sqrt(n))")
    sp.set_defaults(func=cmd_atlas)

    # thumbs
    sp = sub.add_parser("thumbs", help="make thumbnails from a folder of PNGs")
    sp.add_argument("--inp", required=True, help="input folder")
    sp.add_argument("--out", required=True, help="output folder")
    sp.add_argument("--size", type=int, default=512, help="thumbnail size")
    sp.set_defaults(func=cmd_thumbs)

    # manifest
    sp = sub.add_parser("manifest", help="write a simple manifest.json for a folder")
    sp.add_argument("--root", required=True, help="root folder to index")
    sp.add_argument("--out", required=True, help="output manifest.json")
    sp.set_defaults(func=cmd_manifest)

    # all
    sp = add_common(sub.add_parser("all", help="batch → atlas → thumbs → manifest"))
    sp.add_argument("--root", default="assets/flame", help="root/output folder")
    sp.add_argument("--count", type=int, default=6, help="batch count")
    sp.add_argument("--cols", type=int, default=None, help="atlas columns")
    sp.add_argument("--thumb-size", type=int, default=512, help="gallery thumb size")
    sp.set_defaults(func=cmd_all)

    return p


def main(argv: Sequence[str] | None = None) -> int:
    try:
        parser = build_parser()
        args = parser.parse_args(argv)
        args.func(args)
        return 0
    except KeyboardInterrupt:
        print("Interrupted.", file=sys.stderr)
        return 130
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())