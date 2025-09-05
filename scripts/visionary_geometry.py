"""Visionary geometry rendered with pure Python.

Produces a museum-quality mandala using an Alex Grey-inspired palette.
"""

import argparse
import math
import struct
import zlib
from typing import Tuple

# Canvas dimensions for a gallery-grade piece
WIDTH, HEIGHT = 1920, 1080

# Alex Grey-inspired color palette
PALETTE = [
    "#1a237e",  # deep indigo
    "#d500f9",  # electric violet
    "#ff6d00",  # luminous orange
    "#00e5ff",  # neon aqua
    "#76ff03",  # vibrant lime
]


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convert a hex color string to an RGB tuple."""
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4))


PALETTE_RGB = [hex_to_rgb(c) for c in PALETTE]


def interpolate(c1: Tuple[int, int, int], c2: Tuple[int, int, int], t: float) -> Tuple[int, int, int]:
    """Linearly interpolate between two RGB colors."""
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def palette_color(v: float) -> Tuple[int, int, int]:
    """Map a 0-1 value to the Alex Grey-inspired palette."""
    seg = v * (len(PALETTE_RGB) - 1)
    i = int(seg)
    t = seg - i
    c1 = PALETTE_RGB[i]
    c2 = PALETTE_RGB[min(i + 1, len(PALETTE_RGB) - 1)]
    return interpolate(c1, c2, t)


def generate_pixels(width: int, height: int) -> bytearray:
    """Generate pixel data for the visionary mandala."""
    pixels = bytearray(width * height * 4)
    cx, cy = width / 2, height / 2
    for y in range(height):
        for x in range(width):
            nx = (x - cx) / cx
            ny = (y - cy) / cy
            r = math.hypot(nx, ny)
            angle = math.atan2(ny, nx)
            v = (math.sin(10 * r + 5 * angle) + 1) / 2
            r_g_b = palette_color(v)
            idx = 4 * (y * width + x)
            pixels[idx:idx + 4] = bytes([r_g_b[0], r_g_b[1], r_g_b[2], 255])
    return pixels


def save_png(filename: str, width: int, height: int, pixels: bytearray) -> None:
    """Write pixel data to a PNG file using the PNG specification."""

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack("!I", len(data))
            + tag
            + data
            + struct.pack("!I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    png_sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack("!IIBBBBB", width, height, 8, 6, 0, 0, 0)
    raw = b"".join(b"\x00" + pixels[y * width * 4:(y + 1) * width * 4] for y in range(height))
    idat = zlib.compress(raw)

    with open(filename, "wb") as f:
        f.write(png_sig)
        f.write(chunk(b"IHDR", ihdr))
        f.write(chunk(b"IDAT", idat))
        f.write(chunk(b"IEND", b""))


def main() -> None:
    """Parse CLI arguments and render the artwork."""
    parser = argparse.ArgumentParser(
        description="Render visionary geometry without Pillow or NumPy."
    )
    parser.add_argument("--width", type=int, default=WIDTH, help="Image width in pixels")
    parser.add_argument(
        "--height", type=int, default=HEIGHT, help="Image height in pixels"
    )
    args = parser.parse_args()

    pixels = generate_pixels(args.width, args.height)
    save_png("Visionary_Dream.png", args.width, args.height, pixels)


if __name__ == "__main__":
    main()
