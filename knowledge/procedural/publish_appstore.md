---
generated_by: "OpenAI Codex (GPT-6; exact variant not exposed)"
timestamp: "2026-10-25T16:06:55-05:00"
---

# Publish to Pebble app store

1. Run `make build`, the host tests, and `python3 scripts/health_check.py --strict` from the project root.
2. Confirm the PBW metadata in `dist/t9-watch.pbw`: UUID, version, emery target, and watchface type.
3. Keep the source screenshots in `screenshots/`. For CLI upload, copy them to ignored `.tmp/store/` with filenames beginning `emery_` and check each PNG is 200×228.
4. Run `pebble login --status` to confirm the linked developer account.
5. From `watchface/`, run `pebble publish --non-interactive --is-published --no-gif-all-platforms` with name, description, release notes, and the four emery-prefixed `--screenshots` paths. The `--is-published` flag is required for a visible release in this CLI version.
6. Require the explicit `App submitted successfully` or `Release created successfully` output. Record the returned public URL.
7. Open the public listing, check the screenshot count and version, and compare the downloaded store PBW with the local release build.

The first release was published on 2026-10-25 at https://apps.repebble.com/6641551debac4064ab47acba. Store submission is immediately public; there was no review queue in this release flow.

## Screenshot-only listing edits

Use the developer dashboard's **Edit Listing** action to change screenshots without creating a new PBW release. For T9 Time, the emery gallery is a 200×228 looping GIF followed by three 200×228 PNGs. The upload input accepts multiple files and appends a new selection to files already queued, so remove duplicates before saving. The current editor has left/right reorder arrows. For a focused GIF replacement, remove the old GIF, upload its replacement, save, reopen the editor, move the new GIF from the last position to first, and save again. Preserve the four PNG asset IDs. Reopen the editor to verify the saved order. The public app store page may continue to show cached screenshots for several minutes.

For a rollover GIF, inspect the loop seam before upload. Capture tools may include frames from the previous minute. Remove those frames so the first and last frames show the same numeric time, then verify the clock region is identical in every frame. T9 Time's corrected loop starts at 09:13 and ends at 09:13 with THIRTEEN settled.

For 0.2.0 and later, stop the shared emulator before `pebble screenshot --gif-all-platforms` so it boots with the default model; the tool's disk wipe does not reset an already-running QEMU's in-memory settings. Preserve and later restore the shared emery persist directory. Use `python3 execution/prepare_store_gif.py <capture.gif> <store.gif>` to remove old-minute frames and hold the settled frame. Inspect all exported frames and verify the numeric clock crop is identical before uploading. The 0.2.0 gallery includes the new 3310 GIF, blue RAZR still, custom-color 3310 still, and monochrome RAZR still.

The Pebble clean build is not byte-stable: a later rebuild can change the native bin and manifest while source is unchanged. Preserve the PBW used at publish time, compare the public download with that artifact, and keep the verified release copy in ignored `dist/t9-watch.pbw` after optional rebuild checks.

### 2026-10-27 — Slower introduction timing

The superseded five-frame GIF used 1200 ms per typing stage and a 3500 ms settled hold (8300 ms total). The current 15-frame GIF includes each letter of NINE and THIRTEEN at 350 ms per character, two 500 ms blank/cursor pauses, and a 3500 ms settled hold (8700 ms total). Keep the numeric 09:13 crop identical across frames. Inspect public asset timing as well as saved gallery order.

### 2026-10-27 — Capture every letter

Repeated CLI screenshot calls take longer than individual animation steps and skip prefixes. Capture the QEMU monitor framebuffer at 30 fps, deduplicate consecutive identical native states, remove the prior settled pre-roll, then retime those states. Verify N, NI, NIN, NINE and T, TH, THI, THIR, THIRT, THIRTE, THIRTEE, THIRTEEN individually. When another task uses the shared emulator, use a private copy of a known-good flash image with dedicated serial/monitor ports and external-QEMU CLI connections. Shut down only that private instance through its monitor.

## 2026-10-28 — Separate Labs identity

Use `directives/build_labs.md` for Labs. Stable `watchface/` and `execution/build.py` remain on 0.3.3; Labs source lives under `labs/watchface/` with a separate UUID. `execution/publish_labs.py` verifies that identity before using the isolated 5.1.1/Python 3.13 publishing tool. Do not run the regular watchface publish command for Labs. A bundled provider makes the watchface eligible for plugin collection classification; it remains a watchface rather than a plugin-only PBW. Store eligibility is determined by the submission response.

### 2026-10-28 — Consumer-only Labs supersedes provider bundle

The provider-bearing Labs submission returned403 `Plugin submissions are not open yet`. At the user's direction, removed the bundled provider and published Labs as a normal watchface that consumes host weather plugins. Current build contains no provider block or post-build injection hook. Use the guarded Labs publish script; it now requires watchface=true and no plugin. Stable remains independent.
