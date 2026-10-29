# Style provenance: where each value comes from

This build keeps the accepted esssouth style. It does not redesign it.

Most of the runtime is a **byte-identical copy** of the approved toolkit from the `esssouth-animation-style` skill. That toolkit is the approved Lesson 02 · Section 05 runtime, which descends from the Section 04 reference in this handoff.

## Files reused unchanged (`shared/toolkit/`)

| File | Provides | Notes |
|---|---|---|
| `style.css` | Palette, font stack, card kinds, borders, radii, the active ring, the bubble shadow, caption bar and player chrome | Identical to the skill copy. It differs from `reference-l02-s04/src/l02s04.css` only by the S05 additions (claim heading, marked chip, 22 px status tags). |
| `engine.js` | Deterministic renderer: a score of keyframe patches, `render(score, t)` as a pure function of `t`, text fitting inside declared slots, overflow reporting | Identical. It equals the S04 engine plus the `minPx` contract. |
| `beat-kit.js` | Cubic in-out easing (`easeIO`), `F`, `win`, the room panel, the character poser, captions, icons | Identical. |
| `characters.js` | The three-person cast: artwork, poses and arm targets | Byte-identical to `reference-l02-s04/src/characters.js`. |
| `recipes.js` | `MOTION` durations (rise 0.45, cut 0.30, focus 0.25, travel 0.75, enter 0.40, draw 0.60, layout 0.80, morph 0.50, pulse 0.80); the rise, to, hide, txt, head, title, pulseOn, say, hold, roomTo, claimTo and frameTo helpers; `GEO` (kicker, title, wide bubble, hold UI, side column); the cast seats; `speak()` and `neutral()` | Identical. |
| `slots.js` | Text slots: nominal and minimum sizes, line limits | Identical. Two Lesson 04 slots are added separately in `shared/l04/slots-l04.js`, using the same policy. |
| `estimate.js` | Caption segmentation (`segments`) | Only the segmentation is used. Timing comes from the supplied 140 wpm estimates. |
| `core.js` | Audio-envelope helpers for later mouth movement from **real** recordings | Not loaded in this silent build. It is kept for the downstream audio pass. |

## What is new for Lesson 04 (`shared/l04/`)

The Lesson 04 runtime is the Lesson 03 runtime (`esssouth-lesson03-animation-en-v1/shared/l03/`), copied and renamed to `L04*` globals. Lesson 03 itself is unchanged. Two changes were made for Lesson 04:

- **Waiting frame.** The Practice waiting frame now sits 0.005 s before the next step, instead of 0.0005 s. Before this change, in L04 S03, a card that rises at the very start of the rejoin cue vanished from the waiting frame. A QA check now guards this.
- **Optional taller bubble.** `say()` accepts an optional taller bubble rectangle for an unusually long line (L04 S06 d101 and S07 d002). The width, border, radius, shadow and tail stay the same, and the text stays at 30 px or larger.


| File | What it adds | Style impact |
|---|---|---|
| `compile.js` | Adapter from the L03 authoring graph to linear routes: Watch, the Practice branches, Practice skip. Also supplied plus staging phrase anchors and retime and audio profiles. | None. It only decides when things happen. |
| `kit.js` | Route-bound wrappers around the approved recipes: a speaker-aware `say`, a `line` wrapper, the gate presentation, `clearAll` | None. All motion still uses `MOTION` and cubic in-out. |
| `player.js` | The Watch/Practice state machine, gates, seek rules, mode switching, the DOM interaction panel and DOM caption, the iframe messages | Page chrome only, outside the stage. |
| `l04.css` | **One deliberate stage extension**, plus page chrome | See below. |
| `audio-hook.js` | Future audio binding to the same clock | Inactive while every slot is empty. |

### Deliberate extension: the bubble tail points at the speaker

The approved build only had "You" speaking in the side layout, so its bubble tail is centred. In Lesson 04, Maya and Noah also speak.

`l04.css` moves the existing tail to the speaking seat: `.spk-noah` at 792 px and `.spk-maya` at 199 px inside the wide bubble. The seat positions come from the approved side-layout transform (room x 40, scale 0.56). Shape, colour, border, size and the 0.25 s focus timing are unchanged.

## Semantic use of the existing card kinds

- **View or proposal:** `excerpt proposed` or `proposal` (dashed blue: not adopted).
- **Reason:** `idea reason`.
- **Concern:** `concern`.
- **Open question:** `question`.
- **Unknown or blank area:** `note`.
- **Authored model or summary:** `example`.
- **Counterfactual or inaccurate reading:** `step changed`.
- **Not asserted by the speaker:** `step gap`.
- **Task facts:** `fact` or `goal`.
- **Scenario status:** `framehead` pill.
- **Fictional or worked-example containers:** `ctx frame`.

Status is always shown in words as well as colour, through headings, tags and pills.

## Fonts

Inter (first in the stack) was installed on the build machine, so every frame and test here used Inter. The approved reference frames were rendered with Segoe UI. Expect small differences in line breaks.
