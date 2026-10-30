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
| `slots.js` | Text slots: nominal and minimum sizes, line limits | Identical. Lesson slots are added separately in `shared/l07/slots-l07.js`, using the same policy. |
| `estimate.js` | Caption segmentation (`segments`) | Only the segmentation is used. Timing comes from the supplied estimates. |
| `core.js` | Audio-envelope helpers for later mouth movement from **real** recordings | Not loaded in this silent build. Kept for the downstream audio pass. |

## What is new for Lesson 07 (`shared/l07/`)

The Lesson 07 runtime is the Lesson 06 runtime (`esssouth-lesson06-animation-en-v1/shared/l06/`), copied and renamed to `L07*` globals. Lessons 03–06 are unchanged. It keeps the Lesson 06 fixes: Noah's bubble tail stays inside his bubble; there is a wide bubble for an unusually long line; the caption speaker names come from the graph.

Changes for Lesson 07:

- **Offstage prompt reader.** The caption bar has a "Prompt reader" name (neutral grey dot). There is no avatar and no bubble; the prompt is shown as a card.
- **Interaction baseline.** The private-rehearsal flags start from the interaction's own `baseline` (`repairSucceeded`, `proposalAdopted`: false) and are restored on every reset or mode switch.
- **Illustrative pauses.** S02 h001 and S06 h100 use the existing resting poses (`neutral`), hide the bubble and show one small hint-style label. They use none of the hold UI.
- **S03 lanes.** These use existing card kinds (`excerpt` fragments with status tags, `colhead` lane names, `ctx frame`, `framehead`) and the existing dashed-line vocabulary for two small brackets. There is no new visual element and no audio meter.

| File | What it adds | Style impact |
|---|---|---|
| `compile.js` | Adapter from the authoring graph to linear routes: Watch, the Practice branches, Practice model, Practice skip; supplied plus staging phrase anchors; retime and audio profiles | None. It only decides when things happen. |
| `kit.js` | Route-bound wrappers around the approved recipes: a speaker-aware `say`, a `line` wrapper, the gate presentation, `clearAll` | None. All motion still uses `MOTION` and cubic in-out. |
| `player.js` | The Watch/Practice state machine, gates, seek rules, mode switching, the DOM interaction panel, DOM caption and case-facts panel, the iframe messages | Page chrome only, outside the stage. |
| `captions.js` | Caption bar with data-driven speaker names | None beyond the names. |
| `l07.css` | Speaker-aware bubble-tail positions, the `wide` bubble, page chrome | Unchanged from Lesson 06. |
| `audio-hook.js` | Future audio binding to the same clock | Inactive while every slot is empty. |

## Semantic use of the existing card kinds

- **Unadopted proposal:** `proposal` (dashed blue), tagged "Proposal, not adopted" where space allows.
- **Unfinished fragment or exact quotation:** `excerpt`.
- **Observed fact:** `fact`.
- **Task aim:** `goal`.
- **Open question or task link:** `question`.
- **Unknown, not established or not supplied:** `step gap`.
- **Premature or leading move:** `step changed`.
- **Optional move:** `step plan`, never numbered.
- **Blank private area:** `note` with no text.
- **Status, excerpt and model labels:** `framehead` pill.
- **Illustration or hypothetical containers:** `ctx frame`.

Status is always shown in words as well as colour, through headings, tags and pills.

## Fonts

Inter (first in the stack) was installed on the build machine, so every frame and test here used Inter. The approved reference frames were rendered with Segoe UI. Expect small differences in line breaks.
