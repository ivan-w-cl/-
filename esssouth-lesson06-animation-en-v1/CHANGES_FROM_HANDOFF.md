# Changes from the handoff (by cue and component)

## Spoken wording: unchanged

This build changes no cue text, hold, branch, cue ID, audio ID or case fact.

- **Inputs kept exact.** The supplied section files sit byte-identical under `sections/S0n/content/source/`, and the lesson-level documents and case ledger under `handoff-input/`. All 69 copied files match their SHA-256 in `handoff-input/HANDOFF_MANIFEST.json`. The other 36 manifest entries (the historical reference player, its README, the authoring validator and review notes) were read only and are not copied.
- **Words checked by QA.** On every route, QA checks that the caption segments join back into the exact cue text, and that every character line shows its exact words in the bubble.
- **Case facts checked by QA.** The DOM case-facts panel lists F01–F09 exactly as the graph's `scenario.facts`, and the caption speaker label comes from the graph's `participants` ("Case participant", not "You").

## Added on-screen diagram labels

Some cues need on-screen words that the supplied labels do not contain. These live in a separate editable file per section, `sections/S0n/content/labels.staging.en.json`. Their IDs are prefixed `x.`, and the build refuses any collision with a supplied label. The wording comes from the cue, its visual direction or the case ledger (`content/case-facts.en.json`); nothing adds a new event, outcome or quotation.

| Section | Labels added |
|---|---|
| S01 | `x.broad`, `x.event`, `x.action`, `x.question` (narrowing a broad experience to one answerable question); `x.lane.p/m/n` and `x.role.map/times/assembly` (separate participant, Maya and Noah lanes, from F02); `x.studioB`, `x.blueRoom`, `x.asked`, `x.summary`, `x.maya.check`, `x.noah.assemble` (F03–F06); `x.day`, `x.decision`; `x.cat.prep/help/notice`, `x.oneEpisode`, `x.path.own/fiction`, `x.slot.setting/part` (private planning) |
| S02 | `x.output`, `x.contrib`, `x.lane.p/m/n`, `x.act.p/m/n` (F02, F06); `x.studioB`, `x.blueRoom`, `x.confirmed`, `x.summary` (F03, F05); `x.note.mine`, `x.note.other` |
| S03 | `x.h.info/action/result`; `x.roles` (F02); `x.unk`, `x.ask`, `x.conf`, `x.summary`, `x.upd` (F03–F06); `x.poss`, `x.infoThen`, `x.outLater`, `x.obs` (F07), `x.unknownWide` (F08); `x.path.fiction/own`, `x.remembered`, `x.notRecalled` |
| S04 | `x.lane.p/m/n`; `x.unsupFrame`; `x.node.update`, `x.node.use` (F06, F07); `x.path.own/fiction` |
| S05 | `x.node.diff`, `x.node.future`; `x.past` ("Already happened"), `x.future` ("Next time / Proposed"); `x.summary`; `x.unsupArea` |
| S06 | `x.future` ("Next time / Proposed"); `x.caseLabel` ("Fictional worked example": the case ledger's `caseLabel`, which S06's labels do not include) |
| S07 | `x.f02p/m/n`, `x.f04`, `x.f06`, `x.f07`, `x.f08`, `x.f09` (fact-bank cards that keep their ledger IDs; F02 is shown as three role cards so each person stays beside their own work); `x.col.q/f/l` (c007 "Question / Relevant facts / Honest limits") |

Other text added by the runtime:

- **"Summary, not the coordinator's exact words".** Shown wherever the coordinator's confirmation (F05) appears, because the case gives no exact quotation.
- **Kickers.** Each block title from the graph is shown as a kicker.
- **Header chips.** Scenario conditions of 40 characters or fewer, at most three.
- **Hold prompts.** These are each hold's `purpose`.
- **Gate prompt, options and skip note.** These come from the interaction.
- **Interface strings.** These are in `shared/l06/ui.en.json` (new: `ui.caseFacts`).

## Timing

- **Watch totals.** The Watch total equals the supplied estimate for every section: 1752.667 s for the lesson.
- **Anchors.** Supplied anchors are reproduced within 0.002 s.
- **Practice gate presentation.** Before Practice waits at S02, S03 and S06, the prompt and the neutral cards rise for 1.2 s, as in Lessons 03 and 04. The Practice common routes are therefore 1.2 s longer than the supplied `practiceCommonSeconds…`.
- **Staging anchors.** These are phrase positions in the exact cue text, kept in `content/staging-anchors.json`.

## Observations; no blocking contradictions found

- **S06 labels and the case label.** S06's visual directions ask for the "Fictional worked example" label on the model, but `labels.en.json` for S06 does not contain it. The build adds it as the staging label `x.caseLabel`, taken verbatim from the case ledger.
- **S06 d101 length.** The fictional model account is long for the standard bubble. It uses a wider, taller bubble (`token.quoteLong`) with the same style and tail and text at 30 px; see `STYLE_PROVENANCE.md`.
- **S07 d001 and d002.** "Characters may remain offstage" is allowed, not required. The build shows the side room so that the model line has a visible speaker and bubble, as in the other sections, with a "Fictional worked example" pill above the question card.
- **No next-section text.** S07 ends on `s07.end` and `s07.limits`. No future-course preview, badge or completion state was invented.
