"""Remove the prior minute from an emulator rollover GIF and hold the final frame."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CLOCK_REGION = (90, 2, 192, 32)


def prepare(source: Path, output: Path, dry_run: bool = False) -> tuple[int, int]:
    with Image.open(source) as gif:
        frames = []
        durations = []
        for index in range(gif.n_frames):
            gif.seek(index)
            frames.append(gif.convert("RGBA").copy())
            durations.append(gif.info.get("duration", 80))
    if not frames or frames[-1].size != (200, 228):
        raise ValueError("Expected a 200x228 emery rollover GIF")
    final_clock = frames[-1].crop(CLOCK_REGION).tobytes()
    first_current = next(
        (index for index, frame in enumerate(frames)
         if frame.crop(CLOCK_REGION).tobytes() == final_clock), None
    )
    if first_current is None or first_current == len(frames) - 1:
        raise ValueError("No usable current-minute typing sequence")
    frames = frames[first_current:]
    durations = durations[first_current:]
    durations[-1] = max(durations[-1], 900)
    if dry_run:
        return first_current, len(frames)
    output.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(output, save_all=True, append_images=frames[1:],
                   duration=durations, loop=0, optimize=True, disposal=2)
    with Image.open(output) as saved:
        if saved.n_frames < 2:
            raise ValueError("Saved GIF lost the typing sequence")
        for index in range(saved.n_frames):
            saved.seek(index)
            if saved.convert("RGBA").crop(CLOCK_REGION).tobytes() != final_clock:
                raise ValueError(f"Frame {index} shows another minute")
        return first_current, saved.n_frames


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--dry-run", action="store_true", help="inspect the source without writing a GIF")
    args = parser.parse_args()
    first, count = prepare(args.source, args.output, args.dry_run)
    action = "would save" if args.dry_run else "saved"
    print(f"Removed {first} prior-minute frame(s); {action} {count} frames to {args.output}")


if __name__ == "__main__":
    main()
