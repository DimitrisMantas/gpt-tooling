"""Install the optional Engineering Partner Codex agent profiles."""

from argparse import ArgumentParser
from pathlib import Path
from shutil import copy2


def main() -> None:
    """Copy the bundled agent profiles into the user's Codex agent directory."""
    parser = ArgumentParser(
        description="Install the optional Engineering Partner Codex agent profiles."
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Replace an existing agent profile with the bundled version.",
    )
    args = parser.parse_args()

    source_dir = Path(__file__).resolve().parents[1] / "codex-agents"
    target_dir = Path.home() / ".codex" / "agents"
    target_dir.mkdir(parents=True, exist_ok=True)

    for source in sorted(source_dir.glob("*.toml")):
        target = target_dir / source.name
        if target.exists() and not args.force:
            print(f"The existing agent profile was not replaced: {target}.")
            continue

        copy2(source, target)
        print(f"The agent profile was installed: {target}.")


if __name__ == "__main__":
    main()
