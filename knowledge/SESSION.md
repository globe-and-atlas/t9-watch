# Session Log

## Current Session — 0.2.2

**Goal:** Offer O'CLOCK or OH ZERO at minute 00 and clear the crowded RAZR minute layout.
**Agent:** OpenAI Codex
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.2.2 published.

### 2026-10-26 — Implementation checkpoint

- Added a persistent Clay wording choice for minute 00. The default stays O'CLOCK; OH ZERO uses two minute lines. Host checks cover both formats and the unchanged 01–09 behavior.
- Reduced two-line RAZR minute words to scale 3 and its T9 sequence to scale 1. Native 200×228 captures at 01:56 show the words, sequence, frame, and keypad separated.
- Captured OH ZERO at 09:00, reinstalled the same PBW, and captured it again with the setting retained.
- Replaced the blue and monochrome RAZR gallery stills locally; archived the 0.2.1 media. The emulator's 32 persist files were hash-restored after capture.
- `make build`, strict health check, and `git diff --check` passed. PBW metadata reports version 0.2.2, emery, and watchface type.
- A fresh read-only verifier passed the model, setting persistence, native spacing, metadata, and gallery stills.
- Published 0.2.2. The public page shows version 0.2.2 and four current gallery assets. The public PBW is byte-identical to the publish build and `dist/t9-watch.pbw`; the GIF is byte-identical. The store compressed 24 edge pixels differently in the blue PNG; the other PNGs are pixel-identical.
- The developer dashboard saved the updated description, while the public description was still showing cached 0.2.1 copy immediately afterward.

### Current handoff — 2026-10-26

- **Candidate:** 0.2.2 PBW at `dist/t9-watch.pbw`.
- **Media:** four upload files at `.tmp/store/0.2.2/`.
- **Next:** Check the physical Pebble Time 2 settings flow and on-wrist spacing; recheck public description after cache refresh.
- **Open verification:** Physical Pebble Time 2 settings and on-wrist spacing remain unmeasured.

S.D.G.: Lets wearers choose the on-the-hour phrasing while keeping the T9 reading clear on the RAZR face.
Feynman gap: Native captures and host checks pass; physical-watch display remains unverified.

## Current Session

**Goal:** Correct the Nokia header and refine its keypad for T9 Time 0.2.1.
**Agent:** OpenAI Codex
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.2.1 published with the corrected gallery.

### 2026-10-26 — 0.2.1 correction checkpoint

- Preserved the Nokja colon's vertical bearing in the generated bitmap, lowering it to align with numeric digits.
- Removed connection bars and the disconnected mark. The optional upper-left battery icon still reads watch charge.
- Restored the v1 compact alphabet for utility labels, keypad legends, and the T9 digit line so it clears the keypad.
- Drew individual tapered oval Nokia keys with mirrored outer-column angles at the v1 row positions.
- Native emery captures showed the corrected header and keypad, RAZR without signal bars, battery off, and battery fill at 20% versus 100% after callback settling.
- Captured a current-minute 200×228 typing GIF and three new theme/color stills; backed up and hash-restored the shared emery emulator state.
- A fresh read-only verifier passed the final font, spacing, keypad geometry, optional battery, GIF, host checks, and PBW metadata.
- Published 0.2.1. The public Pebble Time 2 listing shows the corrected GIF first and the updated description. The public GIF matches the local file byte for byte, the PNGs are pixel-identical, and the public PBW matches the publish build and `dist/t9-watch.pbw` byte for byte.

### Current handoff — 2026-10-26

- **Candidate:** 0.2.1 PBW at `dist/t9-watch.pbw`.
- **Media:** `screenshots/t9-time-01-typing-nokia.gif` plus three current PNGs.
- **Next:** Check the physical Pebble Time 2 settings flow and on-wrist contrast.
- **Open verification:** Physical Pebble Time 2 settings, on-wrist contrast, and animation battery impact remain unmeasured.

S.D.G.: Keeps a familiar handset keypad readable while making the clock header accurate at a glance.
Feynman gap: The public release and native captures were verified; physical-watch behavior remains unmeasured.

## Previous Session — 0.2.0

**Goal:** Release selectable Nokia 3310 and RAZR V3 treatments for T9 Time.
**Agent:** OpenAI Codex
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.2.0 published with the new gallery.

### 2026-10-26 — Theme implementation checkpoint

- Added a licensed 3310 bitmap-font source and reproducible C-header generator.
- Added rounded 3310 keys and a separate blue RAZR treatment with a thin keypad grid.
- Added Clay settings for phone model, battery icon, and model versus custom colors; previous non-default color choices migrate to custom mode.
- The battery indicator reads watch charge and can be hidden. The connection bars read the Pebble app connection state.
- Host C tests and the emery PBW build passed. Native captures showed 3310 and RAZR settled text, RAZR 24-hour words, battery-off state, custom colors, and settings persistence after reinstall.
- Generated an 18-frame 200×228 3310 store GIF with one numeric minute in every frame, plus three new theme/color stills.
- Strict project health check and font/GIF dry-run checks passed. Shared emery persist state was restored from a matching 32-file backup.
- First GIF capture inherited in-memory RAZR settings from running QEMU; a clean second capture produced the intended default 3310 palette.
- A fresh read-only verifier checked both native themes, word fit across 12/24-hour values, the one-minute GIF loop, host checks, and settings persistence evidence.
- The developer dashboard accepted 0.2.0 as Published. The public Pebble Time 2 page shows version 0.2.0, the 3310 GIF first, and the RAZR gallery. The public PBW SHA-256 matches the local build; the GIF is byte-identical and the three PNGs are pixel-identical to local media.
- The dashboard saved the updated description. The public page still served the older description immediately afterward, consistent with listing cache delay.
- A post-release clean build produced different native bin/manifest bytes with unchanged source. Restored the byte-verified public PBW to ignored `dist/t9-watch.pbw` as the release artifact.

### Current handoff — 2026-10-26

- **Candidate:** 0.2.0 PBW at `dist/t9-watch.pbw`.
- **Media:** `screenshots/t9-time-01-typing-nokia.gif` plus the three current 0.2.0 PNGs.
- **Next:** Check the physical Pebble Time 2 settings flow and on-wrist contrast; recheck public description after the listing cache refreshes.
- **Open verification:** Physical Pebble Time 2 behavior, on-wrist contrast, and animation battery impact remain unmeasured.

S.D.G.: Gives Pebble Time 2 wearers a familiar phone design they can choose without losing a readable time or their color choices.
Feynman gap: The public binary and gallery were verified; physical-watch settings and the timing of public description cache refresh remain unverified.

## Previous Session

**Goal:** Remove the 09:12 flash from the looping store GIF.
**Agent:** OpenAI Codex
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; public loop stays at 09:13

### 2026-10-25 — Loop correction

- User observed that the loop briefly flashes 09:12 after typing THIRTEEN.
- Frame inspection confirmed the existing GIF begins with five 09:12 frames before switching to 09:13.
- Removed the five old-time frames. The corrected GIF has 15 frames after optimization, loops in 2.91 seconds, and shows an identical 09:13 clock region in every frame.
- Replaced the lead asset through the developer dashboard; the corrected uploaded GIF is byte-identical to the local file.
- The other three color screenshots remain in the saved gallery. The 0.1.0 PBW still matches the local release build byte for byte.
- After cache refresh, the public listing served the corrected `.gif` first with three PNGs after it. Saved proof to ignored `.tmp/store/public-loop-corrected-proof.png`.
- A fresh read-only verifier confirmed the 09:13 clock in every frame, the complete typing sequence, the infinite loop, and a byte-identical uploaded asset.

### 2026-10-25 — Shared emulator checkpoint

- Stopped the emery emulator cleanly.
- Backed up its 4.33.1 persist directory to ignored `.tmp/emery-persist-backup/` and verified the copied file hashes.
- Captured the 09:12→09:13 rollover, then restored all 32 saved files with matching hashes.
- The original GIF was 200×228, 40 frames, 3.2 seconds, 10,883 bytes, and looped continuously; the later correction removed its five 09:12 lead frames.

### 2026-10-25 — Listing screenshot update

- Replaced the old screenshot gallery through the developer dashboard: animated green GIF first, followed by black/white, midnight/yellow, and cream/burgundy PNGs.
- Reopened Edit Listing and confirmed the saved first asset has a `.gif` URL and the remaining three have `.png` URLs.
- Downloaded the uploaded GIF from the Pebble asset API; its SHA-256 matches the local GIF.
- Downloaded the published 0.1.0 PBW; its SHA-256 still matches `dist/t9-watch.pbw`.
- After the cache refreshed, the public app store page showed the GIF first and the three alternate-color PNGs in order. Saved the public-page proof under ignored `.tmp/store/public-gif-proof.png`.
- A fresh read-only verifier inspected the GIF frames, dashboard order, uploaded asset, and unchanged PBW; all passed.

## Current handoff — 2026-10-25

- **Published:** T9 Time 0.1.0 is live at https://apps.repebble.com/6641551debac4064ab47acba for emery (Pebble Time 2).
- **Store assets:** The first native 200×228 image is a corrected looping 2.91-second GIF of the hour and minute typing at 09:13; three alternate-color PNGs follow it.
- **Verification:** The public gallery lists the corrected GIF first. Every GIF frame shows 09:13, and the uploaded GIF matches the local file byte for byte. The 0.1.0 store PBW remains byte-identical to `dist/t9-watch.pbw`. A fresh verifier inspected the animation.
- **Source:** No Git remote is configured. The source remains local.
- **Open verification:** Physical-watch Clay Save, on-wrist contrast, and animation battery impact have not been measured.
- **Next:** Test on a Pebble Time 2 and issue an update if the physical settings or readability need changes.

S.D.G.: Lets Pebble Time 2 shoppers watch THIRTEEN finish without the loop implying the time went backward.
Feynman gap: The public GIF and binary were verified; physical-watch settings, readability, and animation battery impact remain unmeasured.

## Checkpoint Log

- 2026-10-25 16:07 — commit: Release T9 Time 0.1.0 to Pebble app store | DEPLOY.md,Makefile,README.md,directives/bootstrap_project.md,directives/build_watchface.md
- 2026-10-25 16:21 — commit: Add animated T9 store screenshot | DEPLOY.md,README.md,knowledge/INDEX.md,knowledge/REFLECTIONS.jsonl,knowledge/SESSION.md
- 2026-10-25 16:29 — commit: Remove prior minute from store GIF loop | DEPLOY.md,knowledge/ERRORS.md,knowledge/INDEX.md,knowledge/REFLECTIONS.jsonl,knowledge/SESSION.md
- 2026-10-26 13:45 — commit: Add 3310 and RAZR themes to T9 Time 0.2.0 | DEPLOY.md,README.md,assets/font/LICENSE.md,assets/font/NokjaOriginalSmallBold.ttf,directives/build_watchface.md
- 2026-10-26 14:03 — commit: Refine T9 Time 3310 header and keypad for 0.2.1 | DEPLOY.md,execution/generate_lcd_font.py,knowledge/DECISIONS.md,knowledge/ERRORS.md,knowledge/INDEX.md
