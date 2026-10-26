---
generated_by: "OpenAI Codex (GPT-6; exact variant not exposed)"
timestamp: "2026-10-25T15:00:00-05:00"
---

# Build the T9 watch face

## Goal

Produce an emery PBW that types the hour and minute words on each minute change.

## Inputs

- Native source: `watchface/src/c/`
- Clay settings: `watchface/src/pkjs/index.js`
- Host checks: `tests/host/test_t9_model.c`

## Execution

1. Install JavaScript dependencies with `npm install --prefix watchface` when missing.
2. Run `python3 execution/build.py` from the project root.
   If the bundled LCD font changes, run `python3 execution/generate_lcd_font.py` first;
   `python3 execution/generate_lcd_font.py --dry-run` checks that the header is current.
3. Inspect `.tmp/runlog.md` for errors when the build fails.
4. Install `dist/t9-watch.pbw` in the emery emulator for visual inspection.
5. For a store GIF, capture the emery rollover and run `python3 execution/prepare_store_gif.py <source.gif> <output.gif>`.
   Its `--dry-run` mode reports the frame trim without writing a file.

## Output

- `dist/t9-watch.pbw` is the local build artifact.
- `.tmp/runlog.md` records build commands and diagnostics.

## Edges

- The default is 12-hour time; the phone settings can select 24-hour time.
- The default colors are green background (`AAFFAA`) and black foreground (`000000`).
- The phone settings can select background and foreground colors independently.
- The watch persists both color values across app restarts.
- The face intentionally has no date setting or date display.
- The numeric clock updates before the typing animation.
- Hour alternate candidates appear only when the hour changes or on launch.
- Minute alternate candidates appear when their word has a known collision.
- Do not publish or push without a later user request.
