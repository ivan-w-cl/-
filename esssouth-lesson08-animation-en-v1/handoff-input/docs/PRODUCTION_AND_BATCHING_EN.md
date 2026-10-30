# Implementation and handoff organization

## Seven independent units

Use a new esssouth-lesson08-animation-en-v1 folder, with shared/, sections/S01–S07/, dist/ and qa/. Each section must be independently editable, playable and rebuildable from its return archive. Relative shared dependencies may be copied into each source ZIP; no absolute private paths or files outside the archive are allowed.

Build S01 first, then continue through the seven sections. Establish the common card/status grammar before implementing choices and rehearsal. Use BUILD_STATUS.json after each meaningful checkpoint: not_started, implementing, playable_unverified, verified or packaged. Record implemented cue IDs, actual tests, failures, measured duration, dependencies and the next command. Do not equate a script with an implemented scene.

The combined entry hosts or opens one section at a time with chapter selection, mode, Play/Pause, Restart, seek, captions, reduced motion and rates 1/1.25/1.5/2. It offers manual next/previous navigation and derives chapter durations from compiled tracks. Switching sections must remove old state and scheduling, not hide a still-running player.

## Data and retiming

Preserve content/source exactly. Keep cue text, shorter labels, captions, visual instructions, anchors and audio slots separate. Every cue keeps its ID and audioId. Exact dialogue is not shortened to fit a bubble; design an appropriate layout. Do not put the model into the learner's private area.

The historical reference needs a new explicit graph adapter and new scenes. A global replacement of old lesson IDs is not implementation. Review new scene mappings and support-status changes against actual cue boundaries.

The review is silent. Every audio slot is null. Add an explicit future clip attachment/import route with locale and transcript selection; do not call a voice API, reuse old audio or insert test tones. Record absent/undecodable audio honestly if this hook is tested later.

Use supplied estimates for the silent review and report actual built duration. Later measured clips replace durations and supply semantic phrase timing. Extend settled states; do not accelerate drawing, gestures or easing to consume a longer clip. Preserve fixed reflection holds and branch order. Expose measured per-cue caption and anchor profiles rather than assuming all future text uses English word counting.

Exercise each isolated retime-demo.json without mutating production data. Check expected total delta, cue/anchor placement, unchanged holds, unchanged paths/easing, branch end and common rejoin. A different total number alone is not proof that the visuals retime correctly.

## Size and return

Every source/playable ZIP must be below 20,000,000 bytes. Exclude node_modules, browser binaries, cache, intermediate frame folders and credentials. If the combined archive is larger, return self-contained section archives plus a small integration bundle and assembly instructions. Do not split ZIPs into opaque fragments or omit branches to meet the limit. MP4s may be separate with actual size reported.

A production-ready handoff is not yet a final voiced course. The new animation, silent exports, later narration and any website integration each need their own evidence. No website edits or publishing are authorized here.
