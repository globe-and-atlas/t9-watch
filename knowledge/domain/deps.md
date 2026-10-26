---
generated_by: "OpenAI Codex (GPT-6; exact variant not exposed)"
timestamp: "2026-10-25T15:00:00-05:00"
---

# Dependencies

- Pebble SDK 4.33.1 on the development host builds the emery app. The SDK supplies the native compiler and bundler.
- `@rebble/clay` 1.1.0 is pinned in `watchface/package.json` for the single time-format setting. `watchface/package-lock.json` records the resolved package.
- Node.js is used by the Pebble build to bundle the Clay configuration code.
- A host C compiler runs `tests/host/test_t9_model.c` before each PBW build.
- The build script uses the Python standard library; it needs no pip package.
- Pillow 12.3.0 is pinned for the offline LCD-font generator and store GIF preparation. The watch build still uses no Python image package at runtime.
- `assets/font/NokjaOriginalSmallBold.ttf` is an MIT-licensed 3310 font recreation by deejayy.hu. Its notice is in `assets/font/LICENSE.md`; `execution/generate_lcd_font.py` turns it into a compact C header, so the PBW does not bundle the TTF.
- Pillow's `ImageFont.getmask2` supplies the glyph offset needed to align punctuation with digits; `getmask` alone loses that vertical bearing in the generated 3310 header.
