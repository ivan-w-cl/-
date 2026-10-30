# Changes from the handoff (by cue and component)

## Spoken wording: unchanged

This build changes no cue text, hold, branch, cue ID, audio ID, case fact, snapshot or transfer fact.

- **Inputs kept exact.** The supplied section files sit byte-identical under `sections/S0n/content/source/`. The lesson-level documents, the case facts and the transfer scenario are under `handoff-input/`. All 73 copied files match their SHA-256 in `handoff-input/HANDOFF_MANIFEST.json`. The other 32 manifest entries (the historical reference player, the authoring validator and its report) were read only and are not copied.
- **Words checked by QA.** On every route, QA checks that the caption segments join back into the exact cue text, and that every character line shows its exact words in the bubble.
- **Exact quotations from the snapshot data.** S05's reference replies and S06's source board read the S05 proposal and replies verbatim from the graph's `scenario.snapshots.proposal_check`. S07's quote cards use the exact d001/d002 cue text.

## Added on-screen diagram labels

Some cues need on-screen words that the supplied labels do not contain. These live in a separate editable file per section, `sections/S0n/content/labels.staging.en.json`. Their IDs are prefixed `x.`, and the build refuses any collision with a supplied label. The wording comes from the cue, its visual direction, the support statements F06–F08, the S05 snapshot or the transfer facts. No label invents a duration, leader, vote, outcome or notice content.

| Section | Labels added |
|---|---|
| S01 | `x.c.maya/noah/part`, `x.by.*` (attribution tags, c001/c003 "every card stays visibly attributed"); `x.note.demo`, `x.note.q` (c003 "compact notes"); `x.rest` (c002 bar: "at most 25", from the case boundary); `x.sheetOnly` (d003 "information-sheet limit visible"); `x.rail.fixed/prop`, `x.st.*` (c006 "fixed-constraint rail … proposed sequence rail"); `x.unans` (c007); `x.fav.maya/noah` (c008, from F04/F06); `x.ph.*`, `x.qspace` (h102 "timing, example-leader and support placeholders") |
| S02 | `x.l.*` (c001 "person, supported element, condition, open question"); `x.by.*`; `x.notTimed` (c003); `x.st.sup/not`, `x.noReply` (c004 "No stated view separately from Supports and Does not support"); `x.psup` (F08); `x.sumSup`, `x.sumOpen` (c007); `x.toRevise` (h102); `x.slot` (c012) |
| S03 | `x.st.*`; `x.noClub` (c002 "empty connections remain empty"); `x.unsup` (c003); `x.reasonLine` (h101); `x.tag.timing/leader` (c009 "timing and example-leader open tags"); `x.sum` (f101: only arithmetic on the supplied numbers, which the visual direction allows); `x.noPairs` (f201); `x.condMaya` (f301, from d302); `x.illus` (c011 "Illustrative allocation, not chosen schedule"); `x.reason`, `x.cost` (c012 "reason and cost cards"); `x.boundary` |
| S04 | `x.candA/B`, `x.crit` (c001); `x.total`, `x.b*` (c003 "one fixed 30-minute container; optional bands"); `x.benefit`, `x.cost` (h101); `x.unknownQ` (c007); `x.purposeM` (c008, from F03); `x.notAdopted` (c010); `x.toGroup` (c011); `x.challenge` (c005) |
| S05 | `x.st.*` (d001 stages); `x.base*` (c002 "Preserve the baseline ledger separately"); `x.text` (c003 "same text card across stages"); `x.fixed`, `x.candRail` (h101); `x.l.*`, `x.maya`, `x.noah`, `x.none` (c004 "editable status cells … without default selection"); `x.col.*` (c009 "do not move it into Assigned or Done"); `x.r1`–`x.r3` (h102); `x.h1`–`x.h4` (c010 "four-line draft summary"); `x.partial`, `x.wholeOpen`, `x.reh` (c011) |
| S06 | `x.by.*`; `x.st.*`, `x.res`, `x.dur`, `x.lead` (c002); `x.ms`, `x.ns` (c003 "short status labels"); `x.a1`–`x.a3`, `x.noAdopt` (f101); `x.broad`, `x.narrow`, `x.ex`, `x.mine` (c009, from the cue's own example); `x.check` (c010) |
| S07 | `x.pM`, `x.pN` (c002, from T02/T03); `x.by.*`; `x.shared`, `x.check` (h101 "two-part private note"); `x.m1`–`x.m4` (c005, from `transfer.method`); `x.next` (c006 "open next-turn space"); `x.priv` (h102) |

Other text added by the runtime:

- **Kickers.** Each block title from the graph is shown as a kicker.
- **Hold prompts.** These are each hold's `purpose`.
- **Gate prompt, options and skip note.** These come from the interaction.
- **Interface strings.** These are in `shared/l08/ui.en.json`.

## Timing

- **Watch totals.** The Watch total equals the supplied estimate for every section: 1917.616 s for the lesson.
- **Anchors.** Supplied anchors are reproduced within 0.002 s.
- **Practice gate presentation.** Before Practice waits at S02, S03 and S06, the prompt and the neutral cards rise for 1.2 s, as in Lessons 03–07.
- **Staging anchors.** These are phrase positions in the exact cue text, kept in `content/staging-anchors.json`.

## Visual assumptions and observations (no blocking contradictions found)

- **Case panel and snapshots.** The case data in each section's graph includes every snapshot. On screen, the case panel lists the later proposal-check statements only in S06. QA checks this in every section.
- **S05 timing reservation.** Noah's row shows two separate cards: "Example and question time supported" and "Check timings before full-sequence agreement". There is no yes/no colouring.
- **S06 d101.** The model line is about 420 characters. It uses the wide bubble (1090 × 336 px, text at 30 px) so that it fits without covering the characters or the header.
- **Retime fixture.** The S02 fixture lengthens a branch cue (d101). The board-state check runs only on cues that are on the Watch route. The fixture is applied as supplied.
