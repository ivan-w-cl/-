# Changes from the handoff (by cue and component)

## Spoken wording: unchanged

The build changes no cue text, hold, branch, cue ID or audio ID.

- The supplied input files sit byte-identical under `sections/S0n/content/source/`; their hashes match `handoff-input/HANDOFF_MANIFEST.json`.
- QA checks on every route that the caption segments join back into the exact cue text, and that every character line shows its exact words in the bubble.
- Quote cards show the exact supplied labels (`quote.noah`, `quote.unclear`) or the exact cue text.

## Added on-screen diagram labels

Some visual directions need short words on screen that `labels.en.json` does not contain. These are kept in a separate editable file per section: `sections/S0n/content/labels.staging.en.json`, with ids prefixed `x.`. The build refuses any collision with a supplied label.

| Section | Cue | Labels added | Why |
|---|---|---|---|
| S01 | c001 | `x.contribution` "A contribution", `x.reply` "A reply", `x.topic` "Same topic" | The direction asks for "two idea cards using the same topic". |
| S01 | c002, c005, c013 | `x.aim` "Aim: chances to try and ask questions" | The stated task aim must be visible, and c005 links the reason to it. |
| S01 | c004 | `x.noDemo` "No demonstration", `x.notSaid` "Not said by Noah" | The direction asks for "a separate unasserted no-demonstration token, without attributing that token to Noah". |
| S02 | c001 | `x.source`, `x.reading` | The direction asks for "source meaning and a tentative interpretation card". |
| S02 | c003… | `x.view`, `x.reason`, `x.concern` (exact substrings of `quote.noah`); `x.h.view` "Proposal", `x.h.reason` "Purpose", `x.h.concern` "Possible concern" | S02 supplies only the full quote, but the direction asks for "three meaning cards". The headings use the cue's own words. |
| S02 | c002 | `x.aim` | The same as S01. |
| S02 | c004 | `x.examine` "An interpretation to examine" | The direction says "the stronger wording is an interpretation to examine". |
| S02 | c011 | `x.ctx.clear`, `x.ctx.detail`, `x.ctx.whole` | The direction asks for "three contexts". The wording comes from the cue. |
| S02 | c012 | `x.dir.confirm`, `x.dir.narrow`, `x.dir.change` | The direction asks for "three neutral response directions". The wording comes from the cue. |
| S02 | c015 | `x.rev1`–`x.rev3` | The direction asks for "neutral self-review questions". The wording comes from the cue. |
| S03 | c001 | `x.contribution`, `x.reply`, `x.missing` | The direction asks for a "contribution, possible reply, missing-information card". |
| S03 | c002 | `x.aim` | The same as S01. |
| S03 | c003 | `x.ref.seq`, `x.ref.pace`, `x.ref.other` | The direction asks for "possible referents". The cue names the sequence, the pace and another feature. |
| S03 | c005 | `x.shorten` | The direction asks for "a possible shortening proposal". |
| S03 | f201, f301 | `x.b.answer`, `x.c.answer` (exact substrings of d202 and d302) | These are Noah's clarification in that branch only. |
| S04 | c001 | `x.contribution` | The direction asks for "one incoming contribution card". |
| S04 | c009 | `x.ex.method`, `x.ex.limit`, `x.ex.ask` | The direction asks for "optional examples underneath". The wording comes from the cue. |
| S05 | c001, c002 | `x.stepCard` "Keep a step card visible" | This is the proposed step card from S04 (`addition.card`), restated for this section. |
| S05 | c008 | `x.cfLane` "Not the actual plan", `x.cf.staff`, `x.cf.demo` | The direction asks to "place these counterfactual changes in a separate comparison lane". |
| S05 | c012 | `x.revise` "Understanding can be revised" | The direction names this label. |
| S06 | d001 | `x.ifFrame` (the exact conditional clause of d001) | The direction asks for "a clearly labelled If frame". |

Other text added by the runtime:

- **Block titles as kickers.** Each block title from the graph is used as the kicker.
- **Header chips.** S01–S06 show `scenario.conditions` as chips. S07 has a fresh scenario and no conditions, so it shows no chips.
- **Hold prompts.** These show the hold's `purpose`.
- **Gate prompt, options and skip note.** These come from the interaction.
- **Interface strings.** They are listed in `shared/l03/ui.en.json` (for example "Pause if you want longer.", "Choose below, or skip. There is no timer.").

## Timing

- **Voice length.** Each cue's voice length is the supplied estimate minus the 0.35 s tail, which reproduces `timing.en.json` exactly. Supplied anchors are reproduced to within 0.002 s; the build validates this.
- **Watch totals.** Each section's Watch total equals the supplied `estimatedWatchSeconds`. The lesson total is 1756.295 s.
- **New: a 1.2 s gate presentation in Practice.** Before Practice waits at S02, S03 and S06, the prompt and the neutral cards rise for 1.2 s. As a result, the Practice common duration is the supplied `practiceCommonSeconds…` plus 1.2 s. Watch uses the supplied thinking time (8 s, 8 s, 35 s), and the cards rise within it.
- **Staging anchors.** These are phrase positions in the exact cue text, found by the same word-rate formula. They live in `content/staging-anchors.json` and scale with the clip under a retime or audio profile.

## Observations; no blocking contradictions found

- **IDs.** S02 and S03 have no `c009`; numbering goes from c008 to the gate to c010. The IDs are kept as supplied.
- **Two prompts in S02 and S03.** The gate `prompt` and the `choice.prompt` label are worded differently. Both are shown: the label as the stage title, the prompt in the caption band and the DOM panel.
- **No next-section title label in S04–S06.** S04 and S05 end on their `recap` label, and S06 ends on `review.focus`. No next-title text was invented.
- **S06 model text overlap.** `model.update` and `concern.help` have the same wording, so the model frame shows the update card on its own.
