# Changes from the handoff (by cue and component)

## Spoken wording: unchanged

This build changes no cue text, hold, branch, cue ID or audio ID.

- **Inputs kept exact.** The supplied files sit byte-identical under `sections/S0n/content/source/`. All 56 hashes match `handoff-input/HANDOFF_MANIFEST.json`.
- **Words checked by QA.** On every route, QA checks that the caption segments join back into the exact cue text. It also checks that every character line shows its exact words in the bubble.
- **Original-statement scenes.** S04 c003 and S06 c002 return to Maya's original wording, as their scripts say. On screen, the supplied labels `baseline.original` (S04, S06) mark this, and the tool mode is shown as unselected again.

## Added on-screen diagram labels

Some cues need on-screen words that the supplied labels do not contain. These live in a separate editable file per section, `sections/S0n/content/labels.staging.en.json`. Their IDs are prefixed `x.`, and the build refuses any collision with a supplied label. All wording comes from the cue or its visual direction.

| Section | Labels added (cue) |
|---|---|
| S01 | `x.proposal`, `x.feat.when/kind/why` (c001 "one proposal card and several distinct features"); `x.fictional`, `x.prob1/2` (c002 "fictional planning frame … two problem cards"); `x.hint`, `x.full` (c005 "hint and full answer as two unselected alternatives"); `x.stated` (c007 "Label the timing as stated"); `x.lane.proposal/person` (c008 "proposal-focused lane … personal judgements"); `x.firstTry` (d002 "the first-attempt alternative"); `x.possFrame`, `x.path1/2` (c011 "possibility frame containing two unresolved paths"); `x.f.timing/kind/reason` (c013 "optional focus labels") |
| S02 | `x.reasonCard`, `x.proposalCard` (c001); `x.fictional`, `x.prob1/2` (c002); `x.direct` (c005, c012 "direct objection route"); `x.recog`, `x.question` (c011 "two meaningful connections"); `x.agreeMark` (d101 "proposal-level agreement marker inside this branch only"); `x.b.concern`, `x.b.question` (f201); `x.judge` (d301 "separate interpretation lane"); `x.c.concern` (f301); `x.crit.time/reason` (c010, split from `shared.criteria`) |
| S03 | `x.node.action/consequence/aim` (c001); `x.fictional`, `x.prob1/2`, `x.hint`, `x.full` (c002 "both help modes"); `x.path.open/reduce` (c004 "hypothetical pathway"); `x.a.missing` (f101 "missing connection"); `x.b.narrow` (f201 "conditional boundary"); `x.c.help` (f301, from d302); `x.firstTry`, `x.crit.time` (c013 "first-attempt proposal … time and reasoning criteria") |
| S04 | `x.space1/2` (c001 "two empty proposal spaces"); `x.fictional` (c002); `x.oneVersion` (c003 "One possible version"); `x.step` (c008 "proposed step") |
| S05 | `x.condSlot` (c001 "one editable condition"); `x.hOrig`, `x.hRev` (c004 "Original proposal and Possible revision") |
| S06 | `x.lane.method/person` (c004, c010 "Person judgement … Concern about the method"); `x.c.time/start/verify` (c005 "fixed criteria", from the cue) |
| S07 | `x.layoutA/B` (c005 "two neutral empty candidate frames") |

Other text added by the runtime:

- **Kickers.** Each block title from the graph is shown as a kicker.
- **Header chips.** Scenario conditions of 40 characters or fewer are shown as header chips. S01–S06 show "20 minutes total" and "Two sample problems". S07 shows both of its conditions. The longer tool conditions are already staged on the board by the cues themselves.
- **Hold prompts.** These are each hold's `purpose`.
- **Gate prompt, options and skip note.** These come from the interaction.
- **Interface strings.** These are in `shared/l04/ui.en.json`.

## Timing

- **Watch totals.** The Watch total equals the supplied estimate for every section: 1746.806 s for the lesson.
- **Anchors.** Supplied anchors are reproduced within 0.002 s.
- **New: Practice gate presentation.** Before Practice waits at S02, S03 and S06, the prompt and the neutral cards rise for 1.2 s. As in Lesson 03, the Practice common routes are therefore 1.2 s longer than the supplied `practiceCommonSeconds…`.
- **Staging anchors.** These are phrase positions in the exact cue text, kept in `content/staging-anchors.json`.

## Observations; no blocking contradictions found

- **S02, S03: gate prompt vs choice label.** The gate `prompt` and the `choice.position` / `choice.target` label are worded differently. Both are shown: the label as a pill on the stage, the prompt in the caption band and the DOM panel.
- **S03 d002.** Maya's clarification changes the tool mode only from d002 onwards. S04 and S06 explicitly restore the original statement, so S03's d002 information does not carry into them.
- **S04 grid.** The full-answer column has no "checking accuracy" cell until c007. Its checking cost is stated in its time row ("Reading and checking take time"). At c007, `fairness.check` spans both columns of the checking row, which follows the direction "Align the two checking-time entries".
- **No next-section title in S04–S07.** S04 ends on its `recap`, S05 on its three `recap.*` cards, S06 on `review.focus` and S07 on `recap.final`. No next-section text was invented.
