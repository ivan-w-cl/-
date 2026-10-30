# Style provenance: where each value comes from

This build keeps the accepted esssouth style. It does not redesign it.

Most of the runtime is a **byte-identical copy** of the approved toolkit from the `esssouth-animation-style` skill. That toolkit is the approved Lesson 02 · Section 05 runtime, which descends from the Section 04 reference in this handoff.

## Files reused unchanged (`shared/toolkit/`)

| File | Provides | Notes |
|---|---|---|
| `style.css` | Palette, font stack, card kinds, borders, radii, the active ring, the bubble shadow, caption bar and player chrome | Identical to the skill copy. |
| `engine.js` | Deterministic renderer: a score of keyframe patches, `render(score, t)` as a pure function of `t`, text fitting inside declared slots, overflow reporting | Identical. |
| `beat-kit.js` | Cubic in-out easing (`easeIO`), `F`, `win`, the room panel, the character poser, captions, icons | Identical. |
| `characters.js` | The three-person cast: artwork, poses and arm targets | Byte-identical to `reference-l02-s04/src/characters.js`. |
| `recipes.js` | `MOTION` durations (rise 0.45, cut 0.30, focus 0.25, travel 0.75, enter 0.40, draw 0.60, layout 0.80, morph 0.50, pulse 0.80); the rise, to, hide, txt, head, title, pulseOn, say, hold, roomTo helpers; `GEO`; the cast seats; `speak()` and `neutral()` | Identical. |
| `slots.js` | Text slots: nominal and minimum sizes, line limits | Identical. Lesson slots are added separately in `shared/l08/slots-l08.js`, using the same policy. |
| `estimate.js` | Caption segmentation (`segments`) | Only the segmentation is used. Timing comes from the supplied estimates. |
| `core.js` | Audio-envelope helpers for later mouth movement from **real** recordings | Not loaded in this silent build. Kept for the downstream audio pass. |

## What is new for Lesson 08 (`shared/l08/`)

The Lesson 08 runtime is the Lesson 07 runtime (`esssouth-lesson07-animation-en-v1/shared/l07/`), copied and renamed to `L08*` globals. Lessons 03–07 are unchanged. Changes for Lesson 08:

- **Snapshot-filtered case panel.** The DOM case panel lists F01–F09 in every case section. It adds the S05 proposal-check statements only in a section that declares that snapshot as its source (S06). It is page chrome, outside the stage.
- **Interaction baseline.** The private-rehearsal flags start from the interaction's own `baseline` (`groupAgreementVerified`, `proposalAdopted`: false) and are restored on every reset or mode switch.
- **Reflection-hold hint (fix).** Every reflection hold now resets the shared hint to "Pause if you want longer." before it rises. In Lessons 03–07, a hold that comes after a choice gate kept the gate's hint ("Think first. Watch then shows one authored possibility."). Those lessons were not changed. A QA check now guards this for every hold on every route.
- **Wide bubble for one long line.** S06 d101 uses the existing `wide` bubble at 1090 × 336 px, with text at 30 px. Its tail and style are the same as the standard bubble.

| File | What it adds | Style impact |
|---|---|---|
| `compile.js` | Adapter from the authoring graph to linear routes: Watch, the Practice branches, Practice model, Practice skip; supplied plus staging phrase anchors; retime and audio profiles | None. It only decides when things happen. |
| `kit.js` | Route-bound wrappers around the approved recipes: a speaker-aware `say`, a `line` wrapper, the gate presentation, `clearAll`, `hold` (with the hint fix) | None. All motion still uses `MOTION` and cubic in-out. |
| `player.js` | The Watch/Practice state machine, gates, seek rules, mode switching, the DOM interaction panel, DOM caption and snapshot-filtered case panel, the iframe messages | Page chrome only, outside the stage. |
| `captions.js` | Caption bar with data-driven speaker names | None beyond the names. |
| `l08.css` | Speaker-aware bubble-tail positions, the `wide` bubble, page chrome | Unchanged from Lesson 07. |
| `audio-hook.js` | Future audio binding to the same clock | Inactive while every slot is empty. |

## Semantic use of the existing card kinds

- **Proposed element or candidate:** `proposal` (dashed blue). It is tagged with its owner, or "Not adopted", where space allows.
- **Exact source statement:** `excerpt`, tagged with the speaker's name.
- **Element-level support:** `step`, with its condition on a separate card beside it.
- **Open check, condition or unknown:** `step gap`.
- **Overbroad or unsupported claim:** `step changed`.
- **Task requirement or resource:** `fact`.
- **Aim:** `goal`.
- **Focused question:** `question`.
- **Optional aid:** `step plan`, never numbered.
- **Blank private area:** `note` with no text.
- **Snapshot, status and model labels:** `framehead` pill.
- **Candidate, model and page containers:** `ctx frame`.

Status is always shown in words as well as colour, through headings, tags and pills. No numerical score, tally, leader badge or consensus stamp is used.

## Fonts

Inter (first in the stack) was installed on the build machine, so every frame and test here used Inter. The approved reference frames were rendered with Segoe UI. Expect small differences in line breaks.
