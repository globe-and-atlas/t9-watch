---
generated_by: "OpenAI Codex (GPT-6; exact variant not exposed)"
timestamp: "2026-11-06T18:37:57-06:00"
---
# T9 Time — round compatibility

Goal: support original Time Round and Round2 while preserving the Time2 layout and settings identity.
Agent: OpenAI Codex
Handoff-from: OpenAI Codex
Handoff-type: continuation
Status: held from publication after user reported T9 does not work

## Result
- Local version0.3.4: Emery200×228, Chalk180×180, Gabbro260×260 in one production PBW.
- Dedicated automatic round layouts preserve each face's identity. Original UUID and settings mappings remain unchanged.
- No store upload, Git commit, or push was performed by this compatibility task. Prior checkpoints are archived in [round compatibility checkpoints](sessions/2026-11-06-round-compatibility-checkpoints.md).

- T9 stable watchface only. Labs source, version, and released bundle are untouched.

## Evidence
- 15 native Chalk cases pass foreground proof and checked circle geometry.
- 15 native Gabbro cases pass foreground proof and checked circle geometry.
- Emery: The unchanged keypad matches prior native pixels exactly; the dynamic words TEN/OH/EIGHT were inspected against the10:08 fixture.
- Existing host/Python/JavaScript suites pass. Native matrix covers time formats, edge times, dates, seconds, palettes, and applicable font/layout/complication choices.
- Clean production build passes; three packaged platform binaries match the current build exactly. Embedded UUID/version/targets verify. Symbol inspection excludes fixture control variables and the proof toggle.
- Fresh independent source, native visual, identity, and final production artifact review passed.

## Artifacts and continuation
- `dist/t9-watch.pbw`
- `media/round/`: native previews. `.tmp/round-qa/`: tests and per-platform case evidence.
- `execution/build_round_fixture.py`, `execution/capture_round.py`, case/fixture JSON: self-contained native QA workflow. See [round QA](procedural/round_compatibility.md).
- Rectangular store media and public releases were not changed. Physical-device acceptance remains separate.

## User report and publication hold
User reported that T9 does not work and explicitly instructed leaving its store version and screenshots unchanged. The15otherfaces were published; T9publicPBW/gallery hashes match the preflight baseline. Specific failure is undiagnosed. Do not publish local0.3.4 until this report is investigated. No T9source or release assets changed.

S.D.G.: Gives original Time Round and Round2 wearers a readable T9 Time layout while keeping Time2's established design.
Feynman gap: The user's reported T9 failure remains undiagnosed; local0.3.4 is held from publication.
