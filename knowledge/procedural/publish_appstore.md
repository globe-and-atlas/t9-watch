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

Use the developer dashboard's **Edit Listing** action to change screenshots without creating a new PBW release. For T9 Time, the emery gallery is a 200×228 looping GIF followed by three 200×228 PNGs. The upload input accepts multiple files and appends a new selection to files already queued, so remove duplicates before saving. Existing screenshots have no reorder control in this editor: remove the old gallery, then queue the full set in display order and save once. Reopen the editor to verify the saved order. The public app store page may continue to show cached screenshots for several minutes.
