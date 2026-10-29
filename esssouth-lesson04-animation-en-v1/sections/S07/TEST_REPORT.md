# L04.S07 · test report (actual run)

Run: 2026-10-29T22:32:02.065Z · Chromium 153.0.8010.12 via Playwright 1.63.0 · linux 6.18.44-fc-v185 · Node v22.22.0

Fonts: Inter installed (first in the stack); the approved reference frames were rendered with Segoe UI. Viewports are emulated, not physical devices. Command: `node tools/qa.cjs S07` (raw: `qa/S07/report.json`).

**39 checks, 0 failed, 33 stills.**

Compiled routes (s): `watch` 163.643 · `practice:main` 163.643

| Result | Check |
|---|---|
| PASS | page loads without errors |
| PASS | no layout / overflow warnings from the engine (all routes, settled states) |
| PASS | no remote requests (offline) |
| PASS | silent: no media elements, no microphone request |
| PASS | stage accessible name names Lesson 04 and this section |
| PASS | captions reproduce exact cue words (every route) |
| PASS | every supplied cue is reachable in some route |
| PASS | route watch: each step once |
| PASS | route watch: L04.S07.h101 lasts 12 s |
| PASS | route watch: L04.S07.h102 lasts 8 s |
| PASS | route practice:main: each step once |
| PASS | route practice:main: L04.S07.h101 lasts 12 s |
| PASS | route practice:main: L04.S07.h102 lasts 8 s |
| PASS | every character line shows its exact words in a visible bubble near its end |
| PASS | route watch: visible text inside the stage, clear of the caption band, no clipping or overlaps (sampled every 0.25 s + transition midpoints) |
| PASS | route practice:main: visible text inside the stage, clear of the caption band, no clipping or overlaps (sampled every 0.25 s + transition midpoints) |
| PASS | deterministic: same frame after different seek histories |
| PASS | reduced motion: no partially faded tokens mid-transition (motions cut at their start) |
| PASS | rate 1×: clock advances at 1× (measured 0.998) |
| PASS | rate 1.25×: clock advances at 1.25× (measured 1.240) |
| PASS | rate 1.5×: clock advances at 1.5× (measured 1.484) |
| PASS | rate 2×: clock advances at 2× (measured 2.008) |
| PASS | mode switch at common content keeps cue and offset (watch → practice → watch) |
| PASS | restart returns to the section start and plays |
| PASS | keyboard: Space plays and pauses |
| PASS | keyboard: Tab reaches mode and playback controls with a visible focus outline |
| PASS | captions toggle hides the stage caption; DOM caption carries the current words |
| PASS | no runtime errors during transport tests |
| PASS | practice: shared reflection route identical to Watch (no gate in this section) |
| PASS | retime: Watch duration changes by the expected clip delta (7.800 s) |
| PASS | retime: step order unchanged in every route |
| PASS | retime: holds keep their fixture length; think holds unchanged |
| PASS | retime: anchors in a lengthened cue keep their relative place (local time × multiplier; phrase-initial anchors stay at 0) |
| PASS | retime: board state 0.7 s after each anchor of a retimed cue equals production (semantic placement kept) |
| PASS | retime: no layout warnings |
| PASS | phone 390x844 (emulated): no horizontal scroll, controls ≥ 44 px, readable DOM caption/prompt |
| PASS | tablet 820x1180 (emulated): no horizontal scroll, controls ≥ 44 px, readable DOM caption/prompt |
| PASS | tablet landscape 1180x820 (emulated): no horizontal scroll, controls ≥ 44 px, readable DOM caption/prompt |
| PASS | desktop 1366x768 (emulated): no horizontal scroll, controls ≥ 44 px, readable DOM caption/prompt |

## Text expansion (stress report, not a pass/fail gate)

| Mode | Fitter warnings |
|---|---|
| x1.3 | 2 (e.g. det: text-overflow; op: text-overflow) |
| x1.6 | 5 (e.g. att: text-overflow; det: text-overflow; bubL: text-overflow) |
| long | 16 (e.g. header.section: text-overflow; page: text-overflow; att: text-overflow) |

## Notes

- Text expansion is a stress report, not a pass/fail gate: overflow at ×1.3/×1.6 is reported by the fitter (never clipped silently) and needs layout work in the localization pass where it occurs.

## Not tested here

- WebKit, Firefox and Safari.app (not installed in the build environment); physical phones/tablets; screen readers.
- Audible playback, recorded narration, lip sync (silent review; mouths stay closed).
- Segoe UI rendering (Inter was installed and used; the approved reference frames used Segoe UI).
