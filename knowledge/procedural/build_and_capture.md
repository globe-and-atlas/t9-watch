---
generated_by: "OpenAI Codex (GPT-6; exact variant not exposed)"
timestamp: "2026-10-25T15:00:00-05:00"
---

# Build and capture

1. Run `make build` to execute the host model checks and create `dist/t9-watch.pbw`.
2. Check for another Pebble emulator driver before installing; the emery emulator is shared across projects.
3. Install with `pebble install --emulator emery dist/t9-watch.pbw`. If this booted QEMU, wait roughly 20 seconds and install again before trusting a screenshot.
4. Set a fixture time with `pebble emu-set-time --emulator emery 09:24:30`.
5. Capture an animation frame and a later settled frame with `pebble screenshot --emulator emery --no-open --no-correction .tmp/name.png`.
6. Check that the settled time still matches the fixture; a momentary matching frame is insufficient.
7. Avoid back-to-back screenshot commands. If `pebble ping --emulator emery` times out after capture, use `pebble kill` and restart without a hard QEMU kill.

## Color fixture

After building the current PBW, use the generated message key numbers from `watchface/build/js/message_keys.json` when sending emulator settings. A black background and white foreground make a high contrast fixture. Capture a settled screenshot, reinstall the same PBW, and capture again to check persistence. Restore `AAFFAA` background and `000000` foreground when done.

## Typing screenshot

For the 09:25 typing frame, set `09:24:59`, wait about 1.5 seconds, then capture one screenshot. The exact frame varies with CLI and emulator timing; inspect it for a partial word, underscore cursor, and highlighted key before exporting. The emulator can jump back to its host clock soon after a fixture, so capture promptly. Space captures rather than launching several screenshot commands at once. `pebble ping` can put the built-in Ping screen in front of the face, so reinstall T9 Time before capture if Ping appears.
