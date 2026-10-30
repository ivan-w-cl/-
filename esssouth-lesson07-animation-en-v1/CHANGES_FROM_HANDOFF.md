# Changes from the handoff (by cue and component)

## Spoken wording: unchanged

This build changes no cue text, hold, branch, cue ID, audio ID, case fact or transfer fact.

- **Inputs kept exact.** The supplied section files sit byte-identical under `sections/S0n/content/source/`. The lesson-level documents, the case facts and the transfer scenario are under `handoff-input/`. All 72 copied files match their SHA-256 in `handoff-input/HANDOFF_MANIFEST.json`. The other 34 manifest entries (the historical reference player, the authoring validator and review notes) were read only and are not copied.
- **Words checked by QA.** On every route, QA checks that the caption segments join back into the exact cue text, and that every character line shows its exact words in the bubble. The two S03 overlap fragments may instead show on an exact lane card (see below).
- **Prompt reader.** S01 d001 is spoken by the offstage `prompt_reader`. It has no avatar or bubble: the exact prompt is shown as a card, and the caption names "Prompt reader". QA checks that the exact text is visible on a card and that no bubble shows.
- **Branch-only reveals.** QA checks that Noah's full F05 (`branch.b.noah` in S02, `branch.c.noah` in S03) is never visible outside its own branch's steps, on any route.

## Added on-screen diagram labels

Some cues need on-screen words that the supplied labels do not contain. These live in a separate editable file per section, `sections/S0n/content/labels.staging.en.json`. Their IDs are prefixed `x.`, and the build refuses any collision with a supplied label. The wording comes from the cue, its visual direction, the interaction baseline or the scenario files. No label invents a motive, an outcome, an adopted plan or programme information.

| Section | Labels added |
|---|---|
| S01 | `x.examples`, `x.example`, `x.ex.pause/link/lanes` (c001 "three separate schematic excerpts … examples"); `x.plan`, `x.selected` (c002 "planning-time card … leave the selected activity empty"); `x.prompt`; `x.fresh`, `x.unadopted` (d002); `x.aim.meet/find` (F03); `x.pauseCard`, `x.knownH`, `x.possH`, `x.p1`–`x.p4` (c006 "possible explanations outside the known-facts area"); `x.excerpt`, `x.laneA/B`, `x.turn`, `x.overlap` (c007 "separate timing lanes and a bounded excerpt frame"); `x.opt.space/q` (c008); `x.pu.idea/turn/link/view` (c009 "four optional repair purposes", from the cue); `x.prog` (c010 "programme information … unknown") |
| S02 | `x.unadopted`; `x.openLink`; `x.interval` (h001 "Chosen illustration interval"); `x.unk.cause/view` (c002); `x.opt.space/speak` (c003); `x.knownH`, `x.unknownH`, `x.f.reason/accept` (c005 "blank private distinction … do not fill the acceptance field"); `x.paused`; `x.opt.think/pass/later` (f301); `x.need.cmp/clar/space` (c011) |
| S03 | `x.lane.p/n`, `x.silent`, `x.unfinished`, `x.overlapZone` (c002/d001/d002 "explicitly labelled two-lane timing illustration … unfinished turn"); `x.t.offer/ask` (c004); `x.park` (c005 "small parked-point marker"); `x.unadopted`; `x.turnNext` (f101 "turn-order marker"); `x.merge` (f201 "proposed merge as unconfirmed wording"); `x.s.offer/listen/return` (c011) |
| S04 | `x.caseLabel`; `x.prior` (c002 "prior proposal cards"); `x.curQ`, `x.obs1/2` (c001); `x.ref`; `x.open`, `x.named` (c004); `x.c.contrib/pass/later` (c004, from `invitation.choice`); `x.illus`, `x.want`, `x.room` (c006); `x.later` (c007); `x.brief`, `x.longer` (c008) |
| S05 | `x.caseLabel`; `x.ref`; `x.newTopic` (c001); `x.aim.meet/find`; `x.noLink` (c004); `x.paperPens` (c005 "use only existing paper and pens"); `x.activity`, `x.discussion` (c008) |
| S06 | `x.caseLabel`; `x.ref`; `x.unadopted`; `x.interval` (h100); `x.r.gap/ask/room` (c001, from the cue); `x.resp1`–`x.resp3` (c009, from the cue) |
| S07 | `x.ref`; `x.o1`–`x.o3` (c005 "Unfinished point / Requested time / Task relevance"); `x.nextMove` (h102 "blank Next move area"); `x.f1`–`x.f3` (c006 "Observe → Make a small move → Listen") |

Other text added by the runtime:

- **S07 transfer prompt.** Taken verbatim from the graph's `scenario.sourcePrompt`, not restated as a label.
- **Kickers.** Each block title from the graph is shown as a kicker.
- **Hold prompts.** These are each hold's `purpose`, for the reflection holds only. The two illustrative scene pauses (S02 h001, S06 h100) show no hold prompt or progress bar.
- **Gate prompt, options and skip note.** These come from the interaction.
- **Interface strings.** These are in `shared/l07/ui.en.json`.

## Timing

- **Watch totals.** The Watch total equals the supplied estimate for every section: 1680.791 s for the lesson. Nothing was padded or sped up to reach the 30-minute editorial target.
- **Anchors.** Supplied anchors are reproduced within 0.002 s.
- **Practice gate presentation.** Before Practice waits at S02, S03 and S06, the prompt and the neutral cards rise for 1.2 s, as in Lessons 03–06.
- **Staging anchors.** These are phrase positions in the exact cue text, kept in `content/staging-anchors.json`.

## Visual assumptions and observations (no blocking contradictions found)

- **S03 overlap fragments as lane cards.** d001 and d002 are staged as cards in two labelled lanes with no avatars, so that the learner's turn stays visibly unfinished while Noah's starts. Their bubbles are therefore not shown. The QA bubble check accepts an exact visible lane card for these two lines.
- **S03 sequential graph.** In the graph, d002 starts when d001 ends. The overlap is drawn: Noah's card rises while the learner's card is still on stage and marked unfinished, and a small bracketed zone marks the shared moment. The shot timing and the voice-pass plan are in `sections/S03/OVERLAP_TIMING_NOTE.md`.
- **S04 case label.** S04 and S05 labels contain no `case.label`. The build adds `x.caseLabel` ("Practice example", the case file's `caseLabel`), because S04–S06 show the case material.
- **Pose for Maya's "moment to think" (S07 d002).** The approved cast has no dedicated thinking pose. The build uses the existing neutral explaining pose with no added expression.
