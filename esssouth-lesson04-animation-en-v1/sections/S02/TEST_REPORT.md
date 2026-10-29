# L04.S02 · test report (actual run)

Run: 2026-10-29T22:26:33.021Z · Chromium 153.0.8010.12 via Playwright 1.63.0 · linux 6.18.44-fc-v185 · Node v22.22.0

Fonts: Inter installed (first in the stack); the approved reference frames were rendered with Segoe UI. Viewports are emulated, not physical devices. Command: `node tools/qa.cjs S02` (raw: `qa/S02/report.json`).

**90 checks, 0 failed, 85 stills.**

Compiled routes (s): `watch` 265.588 · `practice:A` 251.073 · `practice:B` 258.788 · `practice:C` 250.644 · `practice:skip` 225.166

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
| PASS | route watch: L04.S02.h101 lasts 8 s |
| PASS | route watch: L04.S02.h102 lasts 8 s |
| PASS | route practice:A: each step once |
| PASS | route practice:A: L04.S02.h101 lasts 8 s |
| PASS | route practice:A: L04.S02.h102 lasts 8 s |
| PASS | route practice:B: each step once |
| PASS | route practice:B: L04.S02.h101 lasts 8 s |
| PASS | route practice:B: L04.S02.h102 lasts 8 s |
| PASS | route practice:C: each step once |
| PASS | route practice:C: L04.S02.h101 lasts 8 s |
| PASS | route practice:C: L04.S02.h102 lasts 8 s |
| PASS | route practice:skip: each step once |
| PASS | route practice:skip: L04.S02.h101 lasts 8 s |
| PASS | route practice:skip: L04.S02.h102 lasts 8 s |
| PASS | every character line shows its exact words in a visible bubble near its end |
| PASS | route watch: visible text inside the stage, clear of the caption band, no clipping or overlaps (sampled every 0.25 s + transition midpoints) |
| PASS | route practice:A: visible text inside the stage, clear of the caption band, no clipping or overlaps (sampled every 0.25 s + transition midpoints) |
| PASS | route practice:B: visible text inside the stage, clear of the caption band, no clipping or overlaps (sampled every 0.25 s + transition midpoints) |
| PASS | route practice:C: visible text inside the stage, clear of the caption band, no clipping or overlaps (sampled every 0.25 s + transition midpoints) |
| PASS | route practice:skip: visible text inside the stage, clear of the caption band, no clipping or overlaps (sampled every 0.25 s + transition midpoints) |
| PASS | deterministic: same frame after different seek histories |
| PASS | reduced motion: no partially faded tokens mid-transition (motions cut at their start) |
| PASS | rate 1×: clock advances at 1× (measured 0.993) |
| PASS | rate 1.25×: clock advances at 1.25× (measured 1.241) |
| PASS | rate 1.5×: clock advances at 1.5× (measured 1.491) |
| PASS | rate 2×: clock advances at 2× (measured 1.990) |
| PASS | mode switch at common content keeps cue and offset (watch → practice → watch) |
| PASS | restart returns to the section start and plays |
| PASS | keyboard: Space plays and pauses |
| PASS | keyboard: Tab reaches mode and playback controls with a visible focus outline |
| PASS | captions toggle hides the stage caption; DOM caption carries the current words |
| PASS | no runtime errors during transport tests |
| PASS | practice: while waiting, no caption from the next cue; the DOM line shows the prompt |
| PASS | practice: playback stops and waits at the gate (awaiting_choice) |
| PASS | practice: the waiting frame keeps everything that was settled just before it (nothing from the next step leaks in or out) |
| PASS | practice: Play, Space, a rate change and 9.5 s of wall time do not choose (still waiting beyond the 8 s Watch hold) |
| PASS | practice: DOM choice buttons list every option |
| PASS | practice A: first selection wins; branch plays on its own route |
| PASS | practice A: scrubber is branch-local |
| PASS | practice A: seek beyond the branch stays inside it (branch_ready, no common cue) |
| PASS | practice A: branch end waits for Continue |
| PASS | practice A: Try again restores the gate baseline (state + identical stage) |
| PASS | practice A: Continue rejoins L04.S02.c010 once |
| PASS | practice A: no branch words in the common continuation caption |
| PASS | practice A: seek before the gate resets the attempt |
| PASS | practice A: seek to the gate stops there |
| PASS | practice B: first selection wins; branch plays on its own route |
| PASS | practice B: scrubber is branch-local |
| PASS | practice B: seek beyond the branch stays inside it (branch_ready, no common cue) |
| PASS | practice B: branch end waits for Continue |
| PASS | practice B: Try again restores the gate baseline (state + identical stage) |
| PASS | practice B: Continue rejoins L04.S02.c010 once |
| PASS | practice B: no branch words in the common continuation caption |
| PASS | practice B: seek before the gate resets the attempt |
| PASS | practice B: seek to the gate stops there |
| PASS | practice C: first selection wins; branch plays on its own route |
| PASS | practice C: scrubber is branch-local |
| PASS | practice C: seek beyond the branch stays inside it (branch_ready, no common cue) |
| PASS | practice C: branch end waits for Continue |
| PASS | practice C: Try again restores the gate baseline (state + identical stage) |
| PASS | practice C: Continue rejoins L04.S02.c010 once |
| PASS | practice C: no branch words in the common continuation caption |
| PASS | practice C: seek before the gate resets the attempt |
| PASS | practice C: seek to the gate stops there |
| PASS | practice: Skip enters the common continuation once, unanswered, no assessment |
| PASS | practice: seek forward across an unvisited gate stops at the gate |
| PASS | practice: after Skip, seeking within the continuation is allowed |
| PASS | mode switch at the gate: Watch restarts at its thinking hold |
| PASS | mode switch at the gate: Practice returns to awaiting_choice |
| PASS | mode switch inside a branch: Watch restarts at its thinking hold (no branch carried over) |
| PASS | watch: no waiting at the gate; the declared path (B) follows the 8 s thinking hold |
| PASS | practice: no runtime errors |
| PASS | retime: Watch duration changes by the expected clip delta (8.100 s) |
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
| x1.3 | 1 (e.g. ack: text-overflow) |
| x1.6 | 5 (e.g. header.section: text-overflow; blank: text-overflow; ack: text-overflow) |
| long | 19 (e.g. header.section: text-overflow; ttl: text-overflow; ttl: text-overflow) |

## Notes

- Text expansion is a stress report, not a pass/fail gate: overflow at ×1.3/×1.6 is reported by the fitter (never clipped silently) and needs layout work in the localization pass where it occurs.

## Not tested here

- WebKit, Firefox and Safari.app (not installed in the build environment); physical phones/tablets; screen readers.
- Audible playback, recorded narration, lip sync (silent review; mouths stay closed).
- Segoe UI rendering (Inter was installed and used; the approved reference frames used Segoe UI).
