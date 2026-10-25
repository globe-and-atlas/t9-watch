# Project Context

## Identity

T9 Time is a Pebble Time 2 (emery) watch face. Its visual reference is the green LCD concept render with a numeric time at top, an hour word, large minute words, their key sequence, and a compact telephone keypad.

## Behavior

- At every minute change, the numeric time updates first.
- The hour words type before the minute words, even when the hour is unchanged.
- Each letter highlights its telephone key.
- The final words remain visible between animations.
- Collisions are deterministic, not a full predictive dictionary.
- A phone setting selects 12-hour or 24-hour words and numeric time.
- Phone settings independently select background and foreground colors.
- The default palette is green background with dark digits, words, and keypad.
- No date is displayed or configured.

## Boundaries

- The first release targets emery only.
- Local PBW build and emulator validation do not establish physical-device performance.
- Publication requires a separate decision.
