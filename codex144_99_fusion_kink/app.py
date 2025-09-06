"""Command-line interface for generating archetypal fusion narratives."""
from pathlib import Path
import argparse

from scripts.fusion_engine import fuse_nodes


BASE_PATH = Path(__file__).parent


def main() -> None:
    """Parse command-line arguments and print a fusion story."""
    parser = argparse.ArgumentParser(description="Fuse two codex nodes")
    parser.add_argument("node_a", help="ID of the first node")
    parser.add_argument("node_b", help="ID of the second node")
    args = parser.parse_args()

    story = fuse_nodes(args.node_a, args.node_b, BASE_PATH)
    print(story)


if __name__ == "__main__":
    main()
