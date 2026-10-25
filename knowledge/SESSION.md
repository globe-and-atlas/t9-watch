# Session Log

## Current Session

**Goal:** Replace the first store image with an animated typing GIF.
**Agent:** OpenAI Codex
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; public gallery shows the animated GIF first

### 2026-10-25 — Shared emulator checkpoint

- Stopped the emery emulator cleanly.
- Backed up its 4.33.1 persist directory to ignored `.tmp/emery-persist-backup/` and verified the copied file hashes.
- Captured the 09:12→09:13 rollover, then restored all 32 saved files with matching hashes.
- Final GIF is 200×228, 40 frames, 3.2 seconds, 10,883 bytes, and loops continuously.

### 2026-10-25 — Listing screenshot update

- Replaced the old screenshot gallery through the developer dashboard: animated green GIF first, followed by black/white, midnight/yellow, and cream/burgundy PNGs.
- Reopened Edit Listing and confirmed the saved first asset has a `.gif` URL and the remaining three have `.png` URLs.
- Downloaded the uploaded GIF from the Pebble asset API; its SHA-256 matches the local GIF.
- Downloaded the published 0.1.0 PBW; its SHA-256 still matches `dist/t9-watch.pbw`.
- After the cache refreshed, the public app store page showed the GIF first and the three alternate-color PNGs in order. Saved the public-page proof under ignored `.tmp/store/public-gif-proof.png`.
- A fresh read-only verifier inspected the GIF frames, dashboard order, uploaded asset, and unchanged PBW; all passed.

## Current handoff — 2026-10-25

- **Published:** T9 Time 0.1.0 is live at https://apps.repebble.com/6641551debac4064ab47acba for emery (Pebble Time 2).
- **Store assets:** The first native 200×228 image is a looping 3.2-second GIF of the hour and minute typing; three alternate-color PNGs follow it.
- **Verification:** The public gallery lists the GIF first. The uploaded GIF matches the local file byte for byte. The 0.1.0 store PBW remains byte-identical to `dist/t9-watch.pbw`. A fresh verifier inspected the final gallery and animation.
- **Source:** No Git remote is configured. The source remains local.
- **Open verification:** Physical-watch Clay Save, on-wrist contrast, and animation battery impact have not been measured.
- **Next:** Test on a Pebble Time 2 and issue an update if the physical settings or readability need changes.

S.D.G.: Lets Pebble Time 2 shoppers see the hour and minute type themselves before installing T9 Time.
Feynman gap: The public GIF and binary were verified; physical-watch settings, readability, and animation battery impact remain unmeasured.

## Checkpoint Log

- 2026-10-25 16:07 — commit: Release T9 Time 0.1.0 to Pebble app store | DEPLOY.md,Makefile,README.md,directives/bootstrap_project.md,directives/build_watchface.md
