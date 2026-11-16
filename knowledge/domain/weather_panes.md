---
generated_by: "OpenAI Codex (GPT-6; exact variant not exposed)"
timestamp: "2026-10-28T12:32:51-05:00"
---

# Time and weather panes

The initial 0.4.0 local candidate was split into T9 Time Labs 0.1.0 on 2026-10-28. Stable T9 Time remains 0.3.3. Labs consumes host `weather/location` directly via PKJS `Pebble.subscribeToSource`; it does not supply a plugin or fetch weather directly. Labs UUID: `25e30e2c-4605-46fd-96be-3bfe5fb7a110`. Location permission and manifestVersion 2 are declared. Guide: https://developer.repebble.com/guides/plugins/preview/ (mobile1.16.x preview). Labs uses an isolated pebble-tool5.1.1/Python3.13 build with SDK4.33.1.


Classic is the default (PaneMode 0); no weather subscription or accelerometer sampling occurs in Classic. Modes 1/2/3 select shake, double-knock, or either. Both drawing branches call the existing keypad renderer. Native pixels y=168–227 match between Time/Weather in Original, Nokia, and RAZR.

Weather uses first returned location, condition-code vocabulary, provider C/F temperatures, explicit permission/unavailable messages, and provider validity capped at 30 minutes. Weather is held only in memory. Late subscription callbacks are generation-guarded. AppMessage transport coalesces readings with one delayed retry. Returning after eight seconds cancels typing and reconstructs current Time. Quiet hours suppress typing on both panes.

## Gesture constraints

The tap service is a significant motion event, not a touchscreen contact. Rapid emu-tap commands failed to establish double-tap support; counting those events alone was abandoned. Shake-only keeps tap-service detection. Double-knock modes use 50 Hz raw accelerometer samples in batches of five. Magnitude hysteresis triggers above 1.8 g and rearms below 1.3 g; vibration disarms detection and clears partial gestures. Two pulses must be 120–650 ms apart on a logical +20 ms/sample clock. Both injected sample timestamps and wall-clock receipt anchors went backward in QEMU; gesture intervals therefore use sample count, while AppTimers control return and cooldown. Combined mode waits 650 ms before accepting a single pulse. Gestures are ignored while charging and for 1.5 seconds after return.

Physical knock sensitivity, accidental motion activation, sampling battery cost, and real mobile-provider delivery remain unverified. Emulator event injection cannot settle those questions. Keep the feature experimental until physical validation.

## Labs store submission

On 2026-10-28, the isolated Labs 0.1.0 PBW was submitted under its own UUID. Server rejected app creation with HTTP 403, `Plugin submissions are not open yet`. No listing was created. Stable T9 Time release ID/version were verified unchanged afterward. Labs remains sideloadable locally.

## 2026-10-28 — Consumer publication route

After the bundled provider was rejected, the user authorized publication as a watchface using plugins, like Just Another Split Flap. Removed provider manifest/script/test and packaging hook. Labs again subscribes directly to `weather/location`; its public package should identify as watchface with plugin=null. No attempt targets the stable UUID.

Consumer watchface0.1.0 was accepted and published at https://apps.repebble.com/2bef419f50404a048f823c0d . Public metadata confirms watchface/plugin=null. Download bytes match the preserved release PBW. Stable remains0.3.3. Provider restrictions and consumer publication therefore differ in the observed store behavior; keep this distinction explicit.

## 2026-10-28 — 0.1.1 physical-feedback repair

Built-in weather `validUntilMs` is null/omitted, not an error. Its `condition_code` uses longText. Accept a live envelope without explicit validity using a30-minute local receipt window, while respecting explicit expiry. Numeric and text-shaped C/F temperatures are accepted. This remains a plugin-only weather path with no HTTP fallback.

The user confirmed the iPhone pane opens and returns but read NO DATA. That distinguishes gesture reveal from the data bug. Mode4 Weather test after Save opens the pane without gestures; Classic still subscribes to neither weather nor accelerometer. High/Normal/Low knock sensitivity uses150/250/450mg gravity-relative impulse thresholds, with quiet rearm and160ms refractory; pairs use160–700ms. Both waveform fixtures and actual physical taps must be distinguished.
