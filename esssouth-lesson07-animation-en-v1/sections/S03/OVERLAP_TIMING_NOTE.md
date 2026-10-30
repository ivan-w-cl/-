# L07.S03 · Overlap illustration: shot and cue timing note (silent build)

This note records how the current **silent** build stages the overlapping turns, so that the later voice pass can plan a
real overlap without guessing. Nothing here was measured from audio: there is no audio. Times are seconds on the built
routes (silent estimated timing, 140 wpm + 0.35 s tail), from `data/l07s03-data.js` via the running player.

## What the stage shows

- A labelled frame, **"Illustrated overlap"**, with the hint *"Silent illustration: drawn order, not recorded speech"*, and
  two turn lanes: **Participant** and **Noah** (names from the graph's participants). No avatars, bubbles, audio meters,
  microphone icons or intent labels appear in the lanes.
- **First start (d001).** The learner fragment card *"After exchanging names, pairs could—"* rises in the Participant
  lane 0.05 s after d001 starts. It carries the tag **"Unfinished turn"** and stays visible.
- **Second start (d002).** Noah's fragment card *"We could each draw or write—"* rises in the Noah lane 0.05 s after
  d002 starts, also tagged **"Unfinished turn"**. It is offset to the right, so its left part lies under the right end of
  the still-unfinished learner card. Two small dashed brackets (above and below the lanes, x 1000–1140) and the hint
  **"Overlap"** mark that shared moment. No line crosses the words. The learner card pulses once as Noah's lane begins.
- **Unfinished point.** Both fragments stay unfinished through c003, which adds two empty continuation places.
- **Reveal point.** Noah's complete F05 appears **only** in branch C, at d302 (*"We could each draw or write one thing
  we'd like to try, then use that to introduce ourselves."*). His fragment card is removed when d302 starts, and the full
  proposal card (tagged "Proposal, not adopted") rises 0.6 s later. It is never shown as a second simultaneous paragraph.
- **Reset.** At the common rejoin (c010) every branch card is cleared. The full F05 card is cut in 0.01 s, not faded,
  and only the two fragments return. c014 restores the original two fragments for private rehearsal. The learner's
  complete point (d003) appears only after c012, inside a frame labelled "Separate worked example".

QA guards this on every route: Noah's full F05 text is never visible outside branch C's own steps (check
"branch-only reveal (C) is visible only inside its own branch, on every route").

## Cue timing (seconds)

The authoring graph is sequential: d002 starts exactly when d001's tail ends. The drawn overlap is visual evidence in
the illustration, not simultaneous audio.

| Route | d001 start | d002 start | reveal: d302 start | rejoin reset: c010 start | c014 start |
|---|---|---|---|---|---|
| Watch (C) | 32.843 | 35.693 | 153.493 | 178.193 | 242.514 |
| Practice A | 32.843 | 35.693 | — | 160.607 | 224.928 |
| Practice B | 32.843 | 35.693 | — | 161.107 | 225.428 |
| Practice C | 32.843 | 35.693 | 146.693 | 171.393 | 235.714 |
| Practice Skip | 32.843 | 35.693 | — | 138.200 | 202.521 |

Practice times exclude the unlimited wait at the gate. Estimated speech ends: d001 35.343, d002 38.264.

## For the later voice pass (not done here)

- **Overlap.** Either record a brief, deliberately authored overlap or use a clearly announced sequential replay of the
  two starts. Measure the real clips and document any overlap offset; do not take one from this note.
- **Keep the cue IDs separate.** d001 and d002 stay separate cue IDs with separate audio slots
  (`content/source/audio-slots.en.json`). Never concatenate the two speeches into one file.
- **Intelligibility.** Check that the learner can still follow the task.
- **Controls.** Check that pause, seek, rate (1, 1.25, 1.5, 2) and mode or section switches stop both voices. This silent
  build has no audio, so none of this has been tested.
- **Re-alignment.** After measurement, extend settled states and re-align the anchors. Keep the hold durations, the
  branch order and the reveal rule above unchanged.
