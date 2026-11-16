---
generated_by: "OpenAI Codex (GPT-6; exact variant not exposed)"
timestamp: "2026-10-28T13:52:20-05:00"
---

# Plugin Peek

Labs0.2.0 consumes an installed plugin selected through `Pebble.enumeratePlugins` and `Pebble.subscribeToSource`. No service-specific API, network fallback, or action invocation is added. A Clay custom function uses native `configmessage`/`Pebble.sendMessage` for catalogue, temporary inspection, staging, and clearing. Save commits `t9-peek-reading` in phone storage; Cancel discards the staged choice. Stable T9 Time is unchanged.

## Selection contract

The stored selection identifies plugin UUID, category, item, property and instanceId. Catalogue filters text/numeric/boolean/timestamp shapes, excluding images and series. Inspections and active packets reject host fallback to a different provider. Missing selected instances never silently choose the first alternative. Permission denial, removed plugin, missing item and stale data are explicit. Null/omitted validity is a streaming reading with a30-minute local receipt window, as established for built-in weather. Temporary inspections unsubscribe on Save/Cancel/source change and time out in5s. AppMessage sends coalesce with one retry; generation guards ignore old subscriptions.

## Gesture and display

Peek requires PeekEnabled plus PaneMode2 or3. Classic has no active runtime reading subscriptions. With Peek enabled, a two-knock sequence waits700ms for a third; a third opens Peek, otherwise Weather opens. Single motion in combined mode still reveals Weather. Raw input retains the0.1.1 gravity-relative detector, ringing/vibration exclusion, sensitivity and charging suppression. Both panes return after8s.

Weather and Peek use separate data caches but share auxiliary animation/display and the exact keypad renderer. Generic readings retain meaningful punctuation (dollar/decimal/minus/percent/slash/parentheses); Unicode minus is normalized and common currency symbols become codes. Truncated titles/values fit fixed watch buffers. Original/Nokia/RAZR keypad crops match Time pixel for pixel, with complete twelve-key legends.

## Real Clay Save constraint

Clay1.1 dropdowns default to string serialization. Native C setting readers require integer tuples. Labs calls `clay.getSettings` to persist phone preferences, then rebuilds a normalized typed Save payload through `sendSaved(true)`, including Preview in the same message. The real-Clay integration test derives message keys from package metadata so it also runs before a clean SDK build.

## Verification boundaries

Browser QA uses actual Clay and actual Peek controller with fixture plugin sources. Native scheduler fixtures exercise double/triple routing without claiming physical tap sensitivity. `T9_FIXTURE_GESTURE` defaults0, is validated by Labs wscript, and is stripped by the production build/publish workflow. Fixtures are never copied to dist. Live iPhone settings bridge/provider permissions, physical triple-knock reliability and raw-sampling battery impact remain device checks.
