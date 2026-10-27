"""Build and verify the T9 Pebble watch face."""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WATCHFACE = ROOT / "watchface"
TEMP = ROOT / ".tmp"
OUTPUT = ROOT / "dist" / "t9-watch.pbw"


def run(command: list[str], cwd: Path) -> None:
    environment = {key: value for key, value in os.environ.items() if not key.startswith("T9_FIXTURE_")}
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True, env=environment)
    TEMP.mkdir(parents=True, exist_ok=True)
    with (TEMP / "runlog.md").open("a", encoding="utf-8") as log:
        log.write(f"\n### {' '.join(command)}\n\n```text\n{result.stdout}{result.stderr}\n```\n")
    if result.returncode:
        raise RuntimeError(f"Command failed: {' '.join(command)}; see .tmp/runlog.md")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host-only", action="store_true", help="run C model checks only")
    args = parser.parse_args()
    TEMP.mkdir(parents=True, exist_ok=True)
    binary = TEMP / "test_t9_model"
    run([
        "cc", "-std=c11", "-Wall", "-Wextra", "-Werror",
        "-I", str(WATCHFACE / "src/c"),
        str(ROOT / "tests/host/test_t9_model.c"),
        str(WATCHFACE / "src/c/t9_model.c"),
        "-o", str(binary),
    ], ROOT)
    run([str(binary)], ROOT)
    run(["node", str(ROOT / "tests/test_settings.js")], ROOT)
    if args.host_only:
        print("T9 model tests passed")
        return
    run(["pebble", "clean"], WATCHFACE)
    run(["pebble", "build"], WATCHFACE)
    source = WATCHFACE / "build" / "watchface.pbw"
    if not source.is_file():
        raise FileNotFoundError(source)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, OUTPUT)
    print(OUTPUT)


if __name__ == "__main__":
    main()
