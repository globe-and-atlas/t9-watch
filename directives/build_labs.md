---
generated_by: "OpenAI Codex (GPT-6; exact variant not exposed)"
timestamp: "2026-10-28T12:46:05-05:00"
---

# Build and publish T9 Time Labs

## Goal
Build the experimental watchface separately from stable T9 Time.

## Identity
- Labs: T9 Time Labs, UUID `25e30e2c-4605-46fd-96be-3bfe5fb7a110`, version 0.1.1.
- Stable: T9 Time, UUID `afd3d256-e88f-4bf5-b4b1-57952a0d15b7`, version 0.3.3.

## Execution
1. Run `python3 execution/build_labs.py`. Host tests cover the Labs model, settings, and weather bridge.
2. Inspect `dist/t9-time-labs.pbw`: watchface metadata, Labs UUID, manifestVersion 2, Location, and absence of a plugin-provider block.
3. Labs consumes host `weather/location` directly. It contains no provider script or packaging hook.
4. Use `python3 execution/publish_labs.py --dry-run` to inspect listing details.
5. Only with publication authorization, run `python3 execution/publish_labs.py --publish`. It refuses the stable UUID.
6. Verify the returned public listing and its downloaded PBW. Confirm type=watchface and plugin=null. Confirm the stable public release ID remains unchanged.

## Runtime
The isolated tool runner pins pebble-tool 5.1.1 with Python 3.13. Unpinned uv selected Python 3.12 and caused an SRE module mismatch in the SDK waf process. No global tool upgrade is necessary. Clay stays pinned at 1.1.0.

## Product boundaries
This is a watchface consuming the host weather plugin, with Location permission. It uses the first returned weather location and host-selected provider. There is no direct weather HTTP request. The provider-bearing submission was rejected403; that approach was retired. The user authorized publishing the consumer watchface instead. Do not publish through stable T9 Time.
