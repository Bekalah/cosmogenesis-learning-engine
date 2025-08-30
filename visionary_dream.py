"""Visionary Dream Generator.

Render a spiral artwork using real-world case studies. The script offers
multiple color palettes (vivid, calm, contrast) inspired by Alex Grey,
surrealism, and accessible design. Output is saved as "Visionary_Dream.png".
"""

import argparse
import json
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw  
