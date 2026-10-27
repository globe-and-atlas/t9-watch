# Errors

## 2026-10-25 — Emulator time jumped after a test-time change

The face initially showed the requested emulator time but jumped to another time after a minute callback. `on_tick` received Pebble's `struct tm`, while `update_time` discarded it and called `time(NULL)` again. The minute callback now passes the supplied tick value through to the model. A settled 09:24 fixture and 09:24→09:25 rollover then passed. Verify with `pebble emu-set-time` followed by a settled screenshot. Graduated to: `knowledge/procedural/build_and_capture.md`.

## 2026-10-25 — Emery stopped answering after rapid screenshots

During a rapid sequence of emulator screenshots, `pebble ping` timed out and the phone-side emulator process had exited. `pebble kill` shut down QEMU cleanly; a fresh install followed by a second install restored capture. The exact cause of that emulator failure is unconfirmed. Use spaced, single-driver captures. Graduated to: `knowledge/procedural/build_and_capture.md`.

## 2026-10-25 — Store GIF flashed the previous minute at the loop seam

The GIF began with five 09:12 frames captured before the 09:13 rollover. On each loop, those frames appeared after THIRTEEN and made the face seem to jump back to 12. Removed the lead frames, leaving only 09:13 frames in the loop. Inspect the first and last frames together and compare the clock region across every frame before uploading a looping time animation. Graduated to: `knowledge/procedural/publish_appstore.md`.

## 2026-10-26 — GIF capture inherited an in-memory emulator theme

The first 0.2.0 rollover capture showed the previous black/white RAZR setting even though the SDK had removed its persist directory. QEMU was already running and retained the watch settings in memory. The capture command stopped QEMU on completion; the next capture booted fresh and showed the default green 3310 treatment. Stop the shared emulator cleanly before a default-theme rollover capture, and inspect the resulting frames before using them. Graduated to: `knowledge/procedural/publish_appstore.md`.

## 2026-10-26 — Clean rebuild changed the PBW bytes

After 0.2.0 publication, a clean `execution/build.py` run produced a different PBW SHA-256 despite unchanged source. Zip entry comparison showed identical appinfo, JavaScript, and resources, but different native `pebble-app.bin` and manifest bytes. The publish-time download matched the original local PBW byte for byte. Restored that verified public PBW to ignored `dist/t9-watch.pbw` as the release artifact. Future rebuilds need functional verification rather than an expectation of identical package bytes. Graduated to: `knowledge/procedural/publish_appstore.md`.

## 2026-10-26 — Nokia colon and T9 key line lost their v1 alignment

The first Nokja bitmap generator used `getmask`, which omits a glyph's vertical bearing. The colon's natural top offset is three pixels lower than the digits, so top-aligning all glyph masks placed it too high. Switched to `getmask2` and kept that offset in the generated rows. The same font was too tall for the small T9 digit line above the keypad; rendering utility text with the original compact font restored the v1 gap. Graduated to: `execution/generate_lcd_font.py` and `watchface/src/c/main.c`.

## 2026-10-27 — Emulator clock interrupts a typography capture

`emu-set-time 23:16:59` briefly showed 23:17 before subsequent host-clock ticks replaced it during animation. This prevents comparisons across a long 24-hour phrase. Use explicit default-off T9_FIXTURE_HOUR/MINUTE build flags for native comparison; production execution/build.py strips these environment variables before invoking Pebble. Graduated to procedural/build_and_capture.md.

## 2026-10-27 — Listing GIF skips letters

Sparse CLI screenshots missed intermediate glyph states; increasing frame durations only slowed the jumps. Re-captured native monitor frames at 30 fps in a private QEMU, retained all prefix states, and retimed per-letter. Graduated to procedural/publish_appstore.md.
