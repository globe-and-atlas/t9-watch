---
generated_by: "OpenAI Codex (GPT-6; exact variant not exposed)"
timestamp: "2026-10-25T15:00:00-05:00"
---

# Dependencies

- Pebble SDK 4.33.1 on the development host builds the emery app. The SDK supplies the native compiler and bundler.
- `@rebble/clay` 1.1.0 is pinned in `watchface/package.json` for the single time-format setting. `watchface/package-lock.json` records the resolved package.
- Node.js is used by the Pebble build to bundle the Clay configuration code.
- A host C compiler runs `tests/host/test_t9_model.c` before each PBW build.
- The build script uses the Python standard library; it needs no pip package.
