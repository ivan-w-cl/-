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
| `slots.js` | Text slots: nominal and minimum sizes, line limits | Identical. Lesson 06 slots are added separately in `shared/l06/slots-l06.js`, using the same policy. |
| `estimate.js` | Caption segmentation (`segments`) | Only the segmentation is used. Timing comes from the supplied estimates. |
| `core.js` | Audio-envelope helpers for later mouth movement from **real** recordings | Not loaded in this silent build. Kept for the downstream audio pass. |

## What is new for Lesson 06 (`shared/l06/`)

The Lesson 06 runtime is the Lesson 04 runtime (`esssouth-lesson04-animation-en-v1/shared/l04/`), copied and renamed to `L06*` globals. Lessons 03 and 04 are unchanged. Changes made for Lesson 06:

- **Caption speaker names from the graph (`captions.js`).** The caption bar is the approved beat-kit `captions()` with its sizes, colours and timing unchanged; only the speaker-name table now comes from the graph's `participants`, so the model speaker reads "Case participant" instead of "You". The same names label the characters' seats.
- **Case-facts panel.** For sections with a scenario, a collapsible DOM panel under the stage lists the case label and F01–F09 verbatim. It is page chrome, outside the stage, and hidden in video export.
- **Interaction baseline.** The private-rehearsal flags start from the interaction's own `baseline` (including `experienceVerified: false`) and are restored on every reset or mode switch.
- **Noah's bubble tail stays inside the bubble.** The approved `.bubble` rule caps a visible bubble at 760 px, so the Lesson 04 tail position for Noah (792 px) could sit beyond the bubble's right edge. Lesson 06 places Noah's 760-px bubble so that his seat lies over it (x 274) and moves the tail to 588 px. Shape, colour, border and timing are unchanged. **Lessons 03 and 04 still have the old position**; they were not changed, as the request asked.
- **A wide bubble for one long model line.** S06 d101 uses a 1040 × 330 bubble (`wide` class lifting the 760-px cap, slot `token.quoteLong`, at least 30 px). Width, border, radius, shadow and tail style follow the standard bubble.

| File | What it adds | Style impact |
|---|---|---|
| `compile.js` | Adapter from the authoring graph to linear routes: Watch, the Practice branches, Practice model, Practice skip; supplied plus staging phrase anchors; retime and audio profiles | None. It only decides when things happen. |
| `kit.js` | Route-bound wrappers around the approved recipes: a speaker-aware `say`, a `line` wrapper, the gate presentation, `clearAll` | None. All motion still uses `MOTION` and cubic in-out. |
| `player.js` | The Watch/Practice state machine, gates, seek rules, mode switching, the DOM interaction panel, DOM caption and case-facts panel, the iframe messages | Page chrome only, outside the stage. |
| `captions.js` | Caption bar with data-driven speaker names | None beyond the names. |
| `l06.css` | The bubble-tail positions (speaker-aware, Noah fixed as above), the `wide` bubble, page chrome | See above. |
| `audio-hook.js` | Future audio binding to the same clock | Inactive while every slot is empty. |

## Semantic use of the existing card kinds

- **Case facts and observed events:** `fact`; the participant's own action: `idea`; teammates' work: `step`.
- **Proposed or future change (F09):** `proposal` (dashed blue), always under "Next time / Proposed", "Proposed change" or "What I would try next".
- **Not established / not measured:** `step gap`.
- **Questions and follow-ups:** `question`.
- **Blank private areas:** `note` with no text.
- **Status and fiction labels:** `framehead` pill ("Fictional worked example").
- **Fictional or model containers:** `ctx frame`.

Status is always shown in words as well as colour, through headings, tags and pills.

## Fonts

Inter (first in the stack) was installed on the build machine, so every frame and test here used Inter. The approved reference frames were rendered with Segoe UI. Expect small differences in line breaks.
