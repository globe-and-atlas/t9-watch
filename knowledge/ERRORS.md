# Errors

## 2026-10-25 — Emulator time jumped after a test-time change

The face initially showed the requested emulator time but jumped to another time after a minute callback. `on_tick` received Pebble's `struct tm`, while `update_time` discarded it and called `time(NULL)` again. The minute callback now passes the supplied tick value through to the model. A settled 09:24 fixture and 09:24→09:25 rollover then passed. Verify with `pebble emu-set-time` followed by a settled screenshot. Graduated to: `knowledge/procedural/build_and_capture.md`.

## 2026-10-25 — Emery stopped answering after rapid screenshots

During a rapid sequence of emulator screenshots, `pebble ping` timed out and the phone-side emulator process had exited. `pebble kill` shut down QEMU cleanly; a fresh install followed by a second install restored capture. The exact cause of that emulator failure is unconfirmed. Use spaced, single-driver captures. Graduated to: `knowledge/procedural/build_and_capture.md`.

## 2026-10-25 — Store GIF flashed the previous minute at the loop seam

The GIF began with five 09:12 frames captured before the 09:13 rollover. On each loop, those frames appeared after THIRTEEN and made the face seem to jump back to 12. Removed the lead frames, leaving only 09:13 frames in the loop. Inspect the first and last frames together and compare the clock region across every frame before uploading a looping time animation. Graduated to: `knowledge/procedural/publish_appstore.md`.
