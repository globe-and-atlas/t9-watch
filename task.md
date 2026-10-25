# Task: T9 watch face

## Objective

Build a Pebble Time 2 watch face based on the first green LCD render. At each minute change, it types the hour and minute words using the matching T9 keys.

## Contract

- Target directive: `directives/build_watchface.md`.
- Execution script: `execution/build.py`.
- Output artifact: `dist/t9-watch.pbw`.
- Safety: generated files stay outside Git.
- Initial build safety: do not publish or push before release authorization. The later Pebble app store release milestone superseded this for publication.

## Validation Contract

- The face shows the correct numeric time immediately after a minute change.
- The face types the hour words at each minute change.
- The face types the minute words after the hour words.
- Each typed letter highlights its T9 key.
- A completed word with a configured collision briefly displays its alternate candidate.
- The final hour words match the selected time format.
- The final minute words represent values from 00 through 59.
- The settings page offers 12-hour display.
- The settings page offers 24-hour display.
- The watch face contains no date display.
- The settings page contains no date option.
- Host tests pass for time words and T9 mappings.
- The emery PBW builds successfully.
- An emulator screenshot shows legible settled text.
- A fresh verifier reviews the finished feature.

## Checklist

- [x] Create project from the workspace template.
- [x] Implement the word and T9 model.
- [x] Implement the native watch face and animation.
- [x] Implement the time-format setting.
- [x] Run host tests, build, and emulator inspection.
- [x] Record the final handoff.

## Color settings milestone — 2026-10-25

### Validation Contract

- The settings page offers a background color picker.
- The settings page offers a text color picker.
- The default background matches the current green face.
- The default text color matches the current dark face.
- A saved background choice changes the rendered background.
- A saved text choice changes the rendered digits.
- A saved text choice changes the rendered words.
- A saved text choice changes the keypad outlines.
- The watch restores both color choices after relaunch.
- The 12/24-hour setting still works.
- The settings page contains no date option.
- The emery PBW builds successfully.
- Emulator screenshots verify a non-default color pair.
- A fresh verifier reviews the final color behavior.

### Checklist

- [x] Add independent Clay color pickers.
- [x] Persist both colors on the watch.
- [x] Build and inspect an alternate palette.
- [x] Record the verified handoff.

## Screenshot set — 2026-10-25

### Contract

- Target directive: `directives/build_watchface.md`.
- Capture path: Pebble emery CLI.
- Output artifact: `screenshots/` PNG set.
- Safety: capture only the T9 Time emulator face.

### Validation Contract

- A green screenshot shows a word partially typed.
- The typing screenshot shows an active T9 key.
- A second screenshot shows a complete time in a different palette.
- A third screenshot shows a complete time in another different palette.
- Each screenshot is a native 200×228 emery image.
- The emulator settings are restored to green and black after capture.
- A reviewer inspects the final screenshot set.

### Checklist

- [x] Capture an in-progress typing frame.
- [x] Capture two other color options.
- [x] Inspect the exported PNGs.
- [x] Restore the default emulator palette.

## Typing cursor — 2026-10-25

### Validation Contract

- The in-progress cursor is a horizontal underscore.
- The cursor follows the current word fragment.
- The cursor does not overlap the next line of text.
- The green hero screenshot shows a partial minute word with the underscore.
- The green hero screenshot shows an active T9 key.
- The emery PBW builds successfully.
- A fresh verifier inspects the final cursor and screenshot.

### Checklist

- [x] Replace the vertical cursor.
- [x] Rebuild and capture a typing frame.
- [x] Review the exported screenshot.
- [x] Complete independent verification.

## Pebble app store release — 2026-10-25

### Contract

- Target: Pebble app store watchface listing.
- Build artifact: `dist/t9-watch.pbw`.
- Listing copy: `release/store-listing.md`.
- Screenshots: four emery PNGs from `screenshots/`.
- Safety: never upload secrets or temporary files.

### Validation Contract

- The PBW targets emery.
- The PBW identifies as a watchface.
- The PBW version is valid for a first release.
- The lead store screenshot shows partial T9 typing.
- Four submitted screenshots have 200×228 dimensions.
- The store description matches implemented behavior.
- The production PBW builds successfully.
- Host tests pass.
- A fresh verifier reviews the release package.
- The app store returns a public listing URL.
- The submitted release is published.
- The repository records the listing URL.

### Checklist

- [x] Prepare listing text and screenshot upload files.
- [x] Run release verification.
- [x] Submit the Pebble app store listing.
- [x] Verify the public listing.
- [x] Record the release handoff.

## Animated store lead — 2026-10-25

### Contract

- Target: first screenshot on the existing Pebble app store listing.
- Capture tool: Pebble SDK rollover GIF capture.
- Source artifact: `screenshots/t9-time-01-typing-green.gif`.
- Safety: preserve the shared emery emulator state.
- Safety: keep the existing published PBW unchanged.

### Validation Contract

- The GIF has 200×228 frames.
- The GIF is smaller than 4.4 MB.
- The GIF visibly shows the time being typed.
- The GIF visibly shows the underscore cursor.
- The GIF visibly shows an active T9 key.
- The store listing shows the GIF first.
- The store listing retains the three alternate-color screenshots.
- The store still serves the 0.1.0 PBW.
- The shared emulator state is restored after capture.
- A fresh verifier reviews the final GIF and listing.

### Checklist

- [x] Back up the shared emery emulator state.
- [x] Capture and inspect the animated GIF.
- [x] Restore the shared emery emulator state.
- [x] Replace the first store image.
- [x] Verify the public listing.
- [x] Record the listing update.

## Animated loop correction — 2026-10-25

### Validation Contract

- The GIF's numeric time reads 09:13 in every frame.
- The GIF begins with the 09:13 typing sequence.
- The GIF ends with the settled word THIRTEEN.
- The GIF loops continuously.
- The public listing shows the corrected GIF first.
- The three alternate-color screenshots remain on the public listing.
- The published PBW remains version 0.1.0.

### Checklist

- [x] Remove the 09:12 lead frames.
- [x] Inspect the corrected loop.
- [x] Replace the store GIF.
- [x] Verify the public listing.
