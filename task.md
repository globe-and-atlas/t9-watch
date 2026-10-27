# Task: T9 watch face

## RAZR keypad symmetry — 2026-10-26

### Validation Contract

- Each RAZR row has a left key outline.
- Each RAZR row has a center key outline.
- Each RAZR row has a right key outline.
- The right outline mirrors the left outline around the keypad center.
- The center outline mirrors itself around the keypad center.
- The left and right active fills have equal dimensions.
- The left and right labels are centered at equal distances from the keypad center.
- All twelve RAZR legends are legible at 200×228.
- The Original keypad remains unchanged.
- The Nokia keypad remains unchanged.
- The emery PBW builds successfully.
- Host T9 tests pass.
- The RAZR one-line minute has at most one pixel of difference between its upper and lower gaps.
- The RAZR two-line minute has at most one pixel of difference among its three vertical gaps.
- A long RAZR hour remains clear of the first minute line.
- The typing cursor follows the adjusted minute line.

### Checklist

- [x] Mirror the RAZR key outlines.
- [x] Center the labels and active fills.
- [x] Balance the RAZR hour and minute text spacing.
- [x] Inspect native RAZR and other-style captures.
- [x] Build and run host tests.
- [x] Publish the 0.2.5 release in the developer dashboard.
- [x] Verify the saved gallery assets.
- [ ] Verify the public page serves the 0.2.5 PBW.

## RAZR sculpted key correction — 2026-10-26

### Validation Contract

- The RAZR keypad has four separate sculpted rows.
- Each RAZR row has a descending left-key shoulder.
- Each RAZR row has a rising center-key shoulder.
- Each RAZR row has a distinct right-key top stroke.
- No separator runs continuously across the RAZR keypad.
- All twelve RAZR legends remain readable at 200×228.
- An active RAZR key remains distinct from adjacent keys.
- The Original square keypad remains unchanged.
- The Nokia oval keypad remains unchanged.
- The RAZR minute words remain clear of the keypad.
- The emery PBW builds successfully.
- Host T9 tests pass.
- A fresh verifier reviews the native rendering.

### Checklist

- [x] Replace the continuous wave geometry.
- [x] Capture black RAZR at native resolution.
- [x] Capture an active RAZR key.
- [x] Check Original and Nokia for regressions.
- [x] Complete independent verification.
- [x] Publish and verify 0.2.4.


## RAZR swooping keypad — 2026-10-26

The 0.2.3 full-width wave interpretation was rejected and replaced by the sculpted-key contract above.

### Validation Contract

- The RAZR keypad shows four sweeping horizontal lines.
- The RAZR keypad has no straight vertical dividers.
- Each RAZR key label remains legible at 200×228.
- The active RAZR key remains visibly distinct.
- The Nokia keypad retains its oval keys.
- The RAZR minute text remains clear of the keypad.
- The emery PBW builds successfully.
- Host T9 tests pass.
- A native 200×228 screenshot shows the RAZR keypad.
- A fresh verifier reviews the final watchface.

### Original style extension

- The settings page offers Original.
- The settings page offers Nokia 3310.
- The settings page offers Motorola RAZR V3.
- A new install starts with Original selected.
- Original uses the first-release compact font.
- Original uses the first-release square keypad.
- Original uses the first-release text positions.
- Original omits the RAZR frame.
- Existing saved Nokia selection remains Nokia.
- Existing saved RAZR selection remains RAZR.
- A saved Original selection persists after relaunch.
- The battery indicator remains optional in Original.
- Native screenshots show all three styles.

### Checklist

- [x] Draw the RAZR sweeping separators.
- [x] Restore the first-release Original style.
- [x] Add a three-style setting without remapping saved choices.
- [x] Check settled RAZR palettes on emery.
- [x] Check Original on emery.
- [x] Check an active RAZR key on emery.
- [x] Complete independent verification.
- [x] Publish and verify 0.2.3.


## Minute wording and RAZR spacing — 2026-10-26

### Validation Contract

- The settings page offers O'CLOCK for minute 00.
- The settings page offers OH ZERO for minute 00.
- O'CLOCK remains the default for minute 00.
- The OH ZERO choice persists after relaunch.
- Minute values 01 through 09 still use OH plus the minute word.
- The black RAZR minute words remain above the MINUTE label.
- The black RAZR T9 sequence remains above the lower frame line.
- The black RAZR T9 sequence remains above the keypad.
- The emery PBW builds successfully.
- Host T9 tests pass.
- A native 200×228 black RAZR screenshot shows clear spacing.
- A fresh verifier reviews the final watchface.

### Checklist

- [x] Add the minute-00 wording setting.
- [x] Correct the RAZR minute layout.
- [x] Build and inspect the native face.
- [x] Complete independent verification.
- [x] Publish and verify 0.2.2.


## 0.2.1 clock header correction — 2026-10-26

### Validation Contract

- The Nokia numeric colon aligns vertically with its digits.
- The Nokia keypad uses individual oval-shaped keys.
- The Nokia outer key columns have mirrored angles.
- The Nokia keypad legends fit inside their keys.
- The T9 digit line retains the v1 gap above the keypad.
- The watchface shows no signal bars.
- The watchface shows no disconnected-signal mark.
- The battery icon appears at the upper left when enabled.
- The battery icon is absent when disabled.
- The battery icon fill reflects Pebble battery percentage.
- The RAZR numeric clock remains legible.
- The emery PBW builds successfully.
- Host T9 tests pass.
- A native 200×228 screenshot shows the corrected Nokia header.
- The published 0.2.1 gallery shows the corrected header.
- The published 0.2.1 PBW matches the release artifact.
- A fresh verifier reviews the update.

### Checklist

- [x] Preserve the font colon's vertical offset.
- [x] Restore v1 spacing for the T9 digit line.
- [x] Shape the 3310-inspired keypad.
- [x] Remove the connection indicator.
- [x] Rebuild and inspect both themes.
- [x] Update the store media.
- [x] Publish and verify 0.2.1.

## Nokia 3310 visual update — 2026-10-26

The requested update now includes a selectable RAZR V3 treatment and a battery-icon option.

### Validation Contract

- The hour words use the new LCD bitmap lettering.
- The minute words use the new LCD bitmap lettering.
- The numeric time uses the new LCD bitmap lettering.
- The keypad has twelve rounded keys.
- The settings page offers Nokia 3310.
- The settings page offers Motorola RAZR V3.
- The RAZR selection changes the display lettering.
- The RAZR selection changes the keypad geometry.
- The RAZR selection uses a blue default palette.
- The Nokia selection uses a green default palette.
- The settings page offers a battery-icon switch.
- The battery-icon switch hides the icon when disabled.
- The battery-icon switch shows the icon when enabled.
- A phone-model choice persists after relaunch.
- A battery-icon choice persists after relaunch.
- Existing custom colors remain usable.
- An active T9 key remains visibly distinct.
- The 12-hour setting still displays the correct hour words.
- The 24-hour setting still displays the correct hour words.
- The face contains no date display.
- The settings contain no date option.
- The emery PBW builds successfully.
- Host time and T9 tests pass.
- A native 200×228 screenshot shows legible settled time.
- A native 200×228 screenshot shows legible typing.
- A fresh verifier reviews the final watchface.
- The public Pebble listing offers version 0.2.0.
- The public Pebble listing shows the new 3310 GIF first.
- The public PBW matches the local release build.

### Checklist

- [x] Add the licensed bitmap lettering source and generation path.
- [x] Draw the rounded 3310-style keypad.
- [x] Draw the etched RAZR-style keypad.
- [x] Add phone-model and battery settings.
- [x] Build and inspect the native face.
- [x] Complete independent verification.
- [x] Publish the store update.

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
