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

## 2026-10-26 — Minute-00 wording and RAZR spacing

Clay now offers O'CLOCK (default) or OH ZERO at minute 00. The choice persists on the watch; minutes 01–09 still read OH plus their minute word. Two-line RAZR minutes use the three-pixel scale, and RAZR T9 sequences use the compact one-pixel scale so the minute words, sequence, lower frame, and keypad have separate space.

## 2026-10-26 — Original default and handset keypad choices

The first-release compact font, square keypad, and text positions return as Original, the default for new installs. Nokia 3310 and RAZR V3 remain separate styles. Persisted values 0=Nokia and 1=RAZR stay unchanged so prior selections do not migrate to another style; Original uses value 2. New Original installs start with the battery icon off to match the first release, while the icon remains an option. The 0.2.3 RAZR treatment used four full-width waves; the user rejected that reading of the handset reference, so the 0.2.4 decision below supersedes its keypad geometry.

## 2026-10-26 — RAZR sculpted rows

Version 0.2.4 gave each of the four RAZR keypad rows three distinct strokes: the left key descends at its inner edge, the center key has a low edge that rises on the right, and the right key has its own upper edge. The active key fills only its local legend area. The renderer also draws `*` and `#`, absent from the earlier compact-font treatment. The user then identified the uneven left/right shapes, so the 0.2.5 symmetry decision below supersedes the 0.2.4 geometry.

## 2026-10-26 — RAZR keypad symmetry and text spacing

Version 0.2.5 mirrors the outer key stroke around the keypad midpoint, uses a self-mirrored low center stroke, centers each legend at x=39, 100, or 161, and gives each active key the same fill dimensions. The RAZR hour word is vertically centered when it shrinks to two-pixel scale. The minute block divides the available space between the hour word and the MINUTE label into equal gaps, with at most one pixel of rounding difference. Original and Nokia keep their established text positions.

## 2026-10-26 — RAZR numeric header alignment

Version 0.2.6 moves only the RAZR numeric clock from y=6 to y=9. Its 21-pixel glyphs end at y=29, leaving rows 30–32 clear before the y=33 divider. The earlier gap made the clock look high in the rounded frame. Original and Nokia retain their existing numeric positions.
