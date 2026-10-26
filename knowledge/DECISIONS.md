# Decisions

## 2026-10-25 — Native watch face with a host-tested text model

The project uses a Pebble C watch app for drawing and timing. `t9_model.c` owns hour/minute phrasing and key mappings so its full input range can be tested on the host. The Python build script orchestrates host checks and the Pebble SDK. This retains the scaffold's `workflow-python` profile while the user-facing runtime is native Pebble.

## 2026-10-25 — Time format and date scope

The default is 12-hour time. Clay offers 12-hour and 24-hour choices, persisted on the watch. The face omits date text and date settings, as requested. Alternatives considered: inheriting the phone's format without an explicit option, and including the date formats used by other watch faces. An explicit time-format choice meets this face's narrower brief.

## 2026-10-25 — T9 collision behavior

The app retypes the full hour/minute message every minute. Hour collisions appear on launch or when the hour changes so a repeated hour does not produce the same wrong guess every minute. Minute collisions appear when their word occurs. The numeric time is always visible during typing.

## 2026-10-25 — Independent foreground and background colors

Clay offers two Pebble palette pickers. The background choice fills the screen and unlit keypad keys; the foreground choice colors digits, words, outlines, and the active key. Both 24-bit RGB choices are saved separately on the watch. The existing green and dark palette remains the default. A small contrast reminder appears in settings because very similar choices can make the face unreadable.

## 2026-10-26 — Selectable phone treatments

Nokia 3310 is the default visual treatment, with a licensed bitmap-font recreation and rounded keys. RAZR V3 uses the earlier compact alphabet, a thin divided keypad plate, and a blue default palette. A model-colors switch selects each treatment's default colors; turning it off applies the existing independent color pickers. Existing non-default saved colors migrate to custom-color mode. The upper-left battery indicator is optional and reads the watch's actual battery percentage. Version 0.2.0's connection indicator read Pebble app connection state; version 0.2.1 removes it.

## 2026-10-26 — Header and keypad refinement

The connection bars were removed because the prior display represented only a connected/disconnected Pebble app state, not Wi-Fi signal strength. The battery icon remains optional and moves to the upper-left corner. The Nokia style uses individual tapered oval key outlines with mirrored outer-column angles; its utility labels and T9 digit line retain the original compact 5×7 alphabet so the pre-keypad spacing matches v1.
