# Session Log

## Current Session — 0.3.3 steady typing and save preview

**Goal:** Lock text layout during animation and preview once after settings Save.
**Agent:** OpenAI Codex (gpt-6.1-sol)
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.3.3 publicly verified.

Measure completed words instead of displayed prefixes. Clay Save adds a non-persisted preview marker in the same settings message; Cancel and startup sends omit it. Quiet hours remain the animation gate.


## Current Session — 0.3.2 keypad legend baseline

**Goal:** Lower RAZR keypad legends one pixel with clear borders.
**Agent:** OpenAI Codex (gpt-6.1-sol)
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.3.2 and gallery publicly verified.

Blue, Black, Silver, and highlighted 4 GHI captures inspected. The center underline moves down with the text to retain a blank row. Host build and strict health checks pass. Shared emulator state restored.


## Current Session — 0.3.1 RAZR legend clearance

**Goal:** Clear the RAZR legends from key borders and simplify store copy.
**Agent:** OpenAI Codex (gpt-6.1-sol)
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.3.1 and clean listing publicly verified.

The long outer legends crossed the inward shoulders. Move outer centers to x=32/168, retain center x=100, and raise legends one pixel for underline clearance.


## Current Session — 0.3.0 controls

**Goal:** Add animation speed, wrong guesses, quiet hours, and RAZR Silver.
**Agent:** OpenAI Codex (gpt-6.1-sol)
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.3.0 published and public assets verified.

Defaults: Classic, Occasional, quiet hours off with 22:00–07:00 endpoints, RAZR Blue. Policy logic will be host-tested independently of drawing.


## Current Session — RAZR numeric header alignment

**Goal:** Lower the RAZR numeric clock toward its divider without changing Original or Nokia.
**Agent:** OpenAI Codex
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.2.6 published and publicly verified.

### 2026-10-26 — Start

- The 0.2.5 RAZR screenshot shows a larger gap between the numeric glyphs and the y=33 divider than the header needs.
- Target: move only the RAZR numeric line from y=6 to y=9, leaving three clear pixel rows above the divider.

### 2026-10-26 — Native and release checkpoint

- Moved the RAZR clock to y=9. Native black and blue 200×228 captures place its visible glyph pixels at y=9–29, leaving rows 30–32 clear before the y=33 divider.
- Archived the 0.2.5 gallery and replaced only the two RAZR stills; the Original GIF and Nokia still remain the same.
- `make build`, strict health check, and `git diff --check` passed. The shared emulator's 32 persist files were restored with matching hashes.
- Published 0.2.6 in the developer dashboard. The public detail page still showed 0.2.5 immediately afterward.
- The public detail page later showed 0.2.6. Its PBW matches `dist/t9-watch.pbw` byte for byte; the GIF matches byte for byte; all three PNGs match pixel for pixel after recompression.

### Current handoff — 2026-10-26

- **Published:** 0.2.6 at https://apps.repebble.com/6641551debac4064ab47acba.
- **Verified:** Public PBW SHA-256 `b55734be844b1f524b48732ee01a718f6b3f44acef590a725de32a48b9f2e34d`; public GIF byte match; three public PNG pixel matches.
- **Open verification:** Physical Pebble Time 2 appearance remains unmeasured.

S.D.G.: Brings the RAZR clock into a balanced relationship with its header divider at native watch resolution.
Feynman gap: Native and public rendering pass; the revised header has not been observed on a physical watch.

## Current Session — RAZR symmetry correction

**Goal:** Give the RAZR keypad mirrored outer keys and a balanced center key.
**Agent:** OpenAI Codex
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.2.5 published and public assets verified.

### 2026-10-26 — Start

- The 0.2.4 outer key strokes and active fills are unequal. Label offsets also differ by column.
- Target: mirror the outer outlines around x=100 and center all three legend and highlight regions.
- The user also identified uneven vertical spacing. A one-line minute and a long 24-hour word need their own native checks.

### 2026-10-26 — Native and release checkpoint

- Replaced the asymmetric RAZR outlines with outer strokes mirrored around x=100 and a self-mirrored center bowl. All three legends now center on x=39, 100, and 161; the active fills share a 44×8 shape.
- Balanced the RAZR one-line minute and the three gaps around two-line minutes between the hour word and MINUTE label. Long hour words now sit lower in their reserved band. The cursor uses the same computed line positions.
- Native 200×228 captures cover the revised black and blue RAZR keypad, one-line O'CLOCK, two-line FIFTY SIX, and long TWENTY TWO; Original and Nokia captures preserve their layouts.
- `make build`, strict health check, and `git diff --check` passed. The shared emery persist state was restored from backup with 32 matching file hashes.
- Published 0.2.5 in the developer dashboard with four gallery assets. The public listing still showed 0.2.4 and an UPDATING state immediately afterward.
- Reopened the saved gallery and downloaded its four assets. The GIF matches byte for byte; the PNGs match the local stills pixel for pixel after store recompression.
- The public detail page later showed version 0.2.5. Its PBW matches `dist/t9-watch.pbw` byte for byte; its GIF matches byte for byte; all three PNGs match pixel for pixel.

### Current handoff — 2026-10-26

- **Published:** 0.2.5 at https://apps.repebble.com/6641551debac4064ab47acba.
- **Verified:** Public PBW SHA-256 `2f84ee506cb6ea5f4fc62dd432aa8043f1bfd774062fcfe580458537f977cfc8`; public GIF byte match; three public PNG pixel matches.
- **Open verification:** Physical Pebble Time 2 appearance remains unmeasured.

S.D.G.: Makes RAZR key shapes and time text feel balanced at a glance on a 200×228 watch display.
Feynman gap: Native captures and public release assets pass; physical-watch appearance remains unverified.

## Current Session — 0.2.4 RAZR correction

**Goal:** Replace the rejected RAZR wave stripes with sculpted key rows from the user's second diagram.
**Agent:** OpenAI Codex
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.2.4 published.

### 2026-10-26 — Redesign checkpoint

- The user rejected the 0.2.3 full-width wave. An enlarged crop of the new diagram showed separate left descending, center rising, and right upper strokes in each key row.
- Replaced the continuous wave function with four repeated sculpted rows. Added missing `*` and `#` RAZR glyphs.
- Native 200×228 black and blue RAZR captures show the new key shapes; a rollover capture shows a distinct active key. Original and Nokia captures still show their prior keypads.
- `make build`, host tests, strict health check, LCD font dry-run, and `git diff --check` passed. The shared emulator's 32 persist files were restored with matching hashes after capture.
- Recorded the prior misread in `knowledge/FAILURES/2026-10-26_razr-wave/context.md` and superseded the stale keypad decision.
- A fresh read-only verifier passed the source and native screenshot review, including all twelve legends and the active-key treatment.
- Published 0.2.4. The public PBW matches `dist/t9-watch.pbw` byte for byte; the public GIF and three PNGs also match the local release files byte for byte. The public listing shows version 0.2.4.
- Saved revised store copy in the developer dashboard and reopened the editor to verify persistence. The public page still showed cached old wording immediately afterward.

### Current handoff — 2026-10-26

- **Published:** 0.2.4 at https://apps.repebble.com/6641551debac4064ab47acba.
- **Open verification:** Physical Pebble Time 2 appearance and public description cache refresh remain unmeasured.

S.D.G.: Makes the RAZR option recognisable as a keypad of physical keys while keeping T9 input legible.
Feynman gap: The build and public assets match; physical-watch appearance and the public description cache refresh remain unverified.

## Current Session — 0.2.3 candidate

**Goal:** Give RAZR its sweeping keypad and restore the first-release Original look as the default style.
**Agent:** OpenAI Codex
**Handoff-from:** OpenAI Codex
**Handoff-type:** continuation
**Status:** Complete; 0.2.3 published.

### 2026-10-26 — Design checkpoint

- The user supplied a RAZR keypad reference with four sweeping row lines. A native preview shows the new wave geometry without vertical grid dividers.
- Inspected first-release commit `57d1b53`: the Original face used the compact 5×7 font, square 58×13 keys, no RAZR frame, hour y51, numeric y7, and two-line minute scale 4.
- Preserve existing persisted model values 0=Nokia and 1=RAZR; assign Original value 2 and use it only when no model choice is stored.
- Integrated Original with model value 2. New installs start with the compact v1 font, square keys, green palette, and battery off; persisted 0/1 values still select Nokia/RAZR.
- Native 200×228 screenshots cover fresh Original, Nokia, RAZR blue, RAZR black, and a highlighted RAZR key. RAZR and Original stayed selected after reinstall; a reinstalled Nokia capture still showed its oval keypad.
- Reused the corrected first-release Original GIF with a single 09:13 numeric clock across all frames. Replaced the two RAZR gallery stills and archived the 0.2.2 media.
- `make build`, host tests, strict health check, LCD font dry-run, and `git diff --check` pass. The candidate PBW reports 0.2.3, emery, and watchface type.
- Restored all 32 shared emery persist files from the pre-test backup with matching hashes.
- A fresh read-only verifier passed the three-style mapping, first-release Original fidelity, RAZR wave geometry, active highlight, native captures, host checks, and PBW metadata.
- Published 0.2.3. The public Pebble Time 2 page shows version 0.2.3 and four current gallery assets. The public PBW matches the publish build and `dist/t9-watch.pbw` byte for byte, the GIF is byte-identical, and all three PNGs are pixel-identical.
- The developer dashboard saved the updated three-style description. The public description still showed cached older copy immediately after publication.

### Current handoff — 2026-10-26

- **Published:** 0.2.3 at https://apps.repebble.com/6641551debac4064ab47acba.
- **Release artifact:** `dist/t9-watch.pbw` with SHA-256 `259a082f66a524cc47deda51bd3ebeef8fdd7f6bbc674efbeaedf2d32be5ccd7`.
- **Media:** Original GIF plus Nokia cream, RAZR blue, and RAZR monochrome stills in `screenshots/`.
- **Next:** Check the physical Pebble Time 2 settings page, on-wrist contrast, and public description after cache refresh.
- **Open verification:** Physical-watch behavior and on-wrist contrast remain unmeasured.

S.D.G.: Gives wearers the first T9 face alongside two recognisable handset treatments without changing their saved style.
Feynman gap: Native captures and public assets are verified; the physical watch is untested.

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
- 2026-10-26 14:14 — commit: Add minute-zero wording and clear RAZR layout for 0.2.2 | DEPLOY.md,README.md,knowledge/DECISIONS.md,knowledge/INDEX.md,knowledge/REFLECTIONS.jsonl
- 2026-10-26 14:27 — commit: Restore Original and add RAZR wave keypad in 0.2.3 | DEPLOY.md,README.md,knowledge/DECISIONS.md,knowledge/INDEX.md,knowledge/REFLECTIONS.jsonl
- 2026-10-26 14:47 — commit: Refine RAZR keypad sculpture for T9 Time 0.2.4 | DEPLOY.md,README.md,knowledge/DECISIONS.md,knowledge/FAILURES/2026-10-26_razr-wave/context.md,knowledge/INDEX.md
- 2026-10-26 22:21 — commit: Balance RAZR keypad and time spacing in T9 Time 0.2.5 | DEPLOY.md,README.md,knowledge/DECISIONS.md,knowledge/INDEX.md,knowledge/REFLECTIONS.jsonl
- 2026-10-26 22:24 — commit: Verify public T9 Time 0.2.5 release | DEPLOY.md,knowledge/SESSION.md,release/store-listing.md,task.md
- 2026-10-26 22:29 — commit: Lower RAZR header clock in T9 Time 0.2.6 | DEPLOY.md,knowledge/DECISIONS.md,knowledge/INDEX.md,knowledge/SESSION.md,pyproject.toml
- 2026-10-26 22:30 — commit: Verify public T9 Time 0.2.6 release | DEPLOY.md,knowledge/SESSION.md,release/store-listing.md,task.md

### 2026-10-27 — 0.3.0 checkpoint

Host policy tests cover speed, guess modes, and daytime/overnight/all-day quiet ranges. JavaScript tests cover settings defaults, serialization, combinations, and invalid values. Native Silver remained after reinstall; all-day quiet rollover showed settled TWO THIRTEEN. The shared emulator state was restored. Fresh verifier passed source, settings tests, and Silver rendering. Physical-watch settings delivery remains unverified.

### 2026-10-27 — Release closeout

Public 0.3.0, revised description, and five gallery assets verified. PBW and GIF byte matches; four PNG pixel matches. No physical-watch settings-save test was performed.

S.D.G.: Gives T9 Time wearers control over animation pace and nighttime stillness, plus a readable Silver RAZR option.
Feynman gap: Host policy/settings tests, native Silver/quiet capture, fresh review, and public assets pass; physical-watch delivery remains unverified.
- 2026-10-27 14:15 — commit: Add T9 Time animation controls quiet hours and Silver in 0.3.0 | DEPLOY.md,README.md,execution/build.py,knowledge/DECISIONS.md,knowledge/INDEX.md

### 2026-10-27 — 0.3.1 checkpoint

Native captures show clear long labels in Silver, Blue, and Black. Final 37×8 highlight was checked with the right outer 3 DEF key; the earlier center 8 TUV capture also remains legible. Host build and strict health checks pass. Shared emulator state was restored. Uploaded five gallery assets, replacing three RAZR stills. Saved the short introduction and two bulleted feature groups in the listing editor.

### 2026-10-27 — 0.3.1 closeout

Public 0.3.1, bulleted description, and five gallery assets verified. Public PBW and GIF match byte for byte; four PNGs match pixel for pixel.

S.D.G.: Keeps the RAZR keypad readable and makes the store features easier to scan.
Feynman gap: Native static/highlight captures and public assets pass; physical-watch appearance remains unverified.
- 2026-10-27 14:23 — commit: Clear RAZR legends and simplify T9 Time listing in 0.3.1 | DEPLOY.md,knowledge/DECISIONS.md,knowledge/INDEX.md,knowledge/SESSION.md,pyproject.toml

### 2026-10-27 — 0.3.2 release closeout

Public PBW and GIF match byte for byte; four PNGs match pixel for pixel. Public version is 0.3.2 and the clean bullet description remains.

S.D.G.: Gives the RAZR keypad legends a little more breathing room above the glyphs.
Feynman gap: Native static/highlight captures and public assets pass; physical-watch appearance remains unverified.
- 2026-10-27 14:32 — commit: Lower RAZR keypad legends one pixel in T9 Time 0.3.2 | DEPLOY.md,knowledge/DECISIONS.md,knowledge/INDEX.md,knowledge/SESSION.md,pyproject.toml

### 2026-10-27 — 0.3.3 native checkpoint

- Fixed layout confirmed through 23:17 prefixes and settled TWENTY THREE / SEVENTEEN using a default-off time fixture. Quiet preview remained settled.
- Save event tests cover successful Save, Cancel, malformed response, and startup sync. Native Preview message replayed immediately using new settings.
- User supplied a clearer RAZR photo and requested larger, vertically aligned digits. Native Blue, Black, Silver, and highlighted 6 MNO capture pass with connected rows and separate 5×8 / 3×5 hierarchy. Fresh verifier passed source, tests, and final visuals.
- Refreshed the Original typing GIF at fixed 09:13 with steady final word scale; regenerated three RAZR stills. Shared emulator state restored by hash. Production PBW rebuilt without fixture flags.

### 2026-10-27 — 0.3.3 release closeout

Public 0.3.3, revised bullet description, and five gallery assets verified. Public PBW and refreshed GIF match byte for byte; four PNGs match pixel for pixel. Final publish rebuilt with time fixture flags explicitly unset.

S.D.G.: Gives T9 Time wearers stable text, immediate feedback after Save, and a more faithful readable RAZR keypad.
Feynman gap: Settings event tests, native fixture/production captures, fresh review, and public assets pass; physical-watch Save and appearance remain unverified.
- 2026-10-27 14:48 — commit: Stabilize typing preview settings and refine RAZR keypad in 0.3.3 | DEPLOY.md,README.md,execution/build.py,knowledge/DECISIONS.md,knowledge/ERRORS.md

### 2026-10-27 — Slower store GIF

Retimed only the Original intro to 1200 ms per typing stage and 3500 ms settled (8.3 seconds total). Public GIF matches byte for byte. Replaced its gallery entry and moved it back to first; public order verified with the new GIF first. Four PNG asset IDs and 0.3.3 PBW preserved.
- 2026-10-27 17:42 — commit: Slow T9 Time listing animation and extend settled hold | DEPLOY.md,knowledge/INDEX.md,knowledge/SESSION.md,knowledge/procedural/publish_appstore.md,release/store-listing.md

### 2026-10-27 — Individual-letter listing GIF

Replaced sparse screenshot sequence with 30-fps native framebuffer capture in an isolated QEMU using a copied flash and dedicated ports because the shared emulator was in use. Retained 15 unique native frames covering blank cursors, 12 typed characters, and settled text. Timing: 350 ms per letter, 500 ms inter-word/initial pauses, 3500 ms final hold; 8.7 seconds total. The numeric 09:13 region stays identical. Private QEMU shut down; production build restored and published dist PBW preserved. Uploaded replacement GIF; public file matches byte for byte with 15 frames and 8.7-second timing. GIF is first in the public gallery; four PNG asset IDs unchanged.
- 2026-10-27 17:50 — commit: Capture every typed letter in T9 Time listing animation | DEPLOY.md,knowledge/ERRORS.md,knowledge/INDEX.md,knowledge/SESSION.md,knowledge/procedural/publish_appstore.md
