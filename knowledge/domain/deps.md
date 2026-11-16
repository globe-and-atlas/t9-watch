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

## 2026-10-28 — Isolated Labs publishing runtime

Labs uses `uv tool run --python 3.13 --from pebble-tool==5.1.1 pebble …`. The existing global pebble-tool 5.0.40 and active SDK 4.33.1 stay unchanged. Pinning Python avoids the SDK waf SRE mismatch observed when uv selected Python 3.12. Labs Clay remains pinned at 1.1.0. The rejected provider prototype needed a plugin-file packaging hook under SDK4.33. The current consumer-only Labs build has no provider script or hook.

## Round native QA — 2026-11-06
Pillow12.3.0 is pinned for deterministic screenshot decoding, palette normalization, and contact sheets. This is development tooling only; Pebble runtime dependencies are unchanged. It provides `Image.get_flattened_data()` used by the capture audit. No SDK upgrade was installed.

## 2026-11-06 — Round SDK targets
Installed SDK4.33.1/tool5.0.40 built Emery, Chalk, and Gabbro without an SDK upgrade. Clay1.1.0 recognizes both round platforms. Pillow12.3.0 is native QA tooling only.
