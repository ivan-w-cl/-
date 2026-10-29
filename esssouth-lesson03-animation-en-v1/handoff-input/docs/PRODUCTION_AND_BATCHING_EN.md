# Production organization and retiming

## Directory contract

Use a new esssouth-lesson03-animation-en-v1 project with shared/ for reused components, sections/S01 through S07 for individual content/adapters, dist/ for deliverables, and qa/ for actual evidence. Each section must have an independently usable source/playable return; it must not depend on absolute machine paths, files outside its archive or an unavailable previous conversation.

A combined index links or hosts all seven sections and exposes Watch/Practice, chapter selection, Play/Pause, Restart, seek, captions, reduced motion and rates 1, 1.25, 1.5 and 2. Common code can be reused, but switching sections must cancel the old clock, stop audio when later added, destroy stale handlers, close the old branch and show the new section's actual initial state.

At the end of a section, offer an explicit Next section action. Do not automatically leave a Practice gate or force the next chapter while a model/retry is active. A whole-course continuous Watch export can concatenate section Watch tracks. Chapter metadata must be derived from compiled durations rather than estimated budgets.

## Work order and resumability

Build S01 first to verify that the accepted visual components support the new task/meaning layouts. Existing style approval is sufficient to proceed; do not stop for approval of an unchanged palette or rig. Next build S02's choice contract, then S03, S04, S05, S06 and S07. Reuse tested components after verifying their assumptions.

After each section: save a version, run its required checks, record source hashes, actual duration and unfinished items in BUILD_STATUS.json. Suggested states: not_started, implementing, playable_unverified, verified, packaged. A cue can be scripted without being implemented; list the difference. If a session stops, leave exact resume commands and files. Do not claim the full lesson is complete from an outline or scaffold.

## Content and localization contract

Stable IDs survive every build, retime, branch and later language pass. Preserve the supplied exact scripts under content/source. Runtime data must keep narration, dialogue, shorter on-screen labels, captions, visual instructions, semantic anchors and audio slots separate. Branch cue text is not merged into common text. Models must not populate blank private-answer areas.

Every cue has audioId=cueId, one future clip slot and an estimated duration. The review is silent: no reused speech, music, test tones or synthesis calls. Implement the later attachment/import path with explicit locale and script source, not an English-only validation hardcoded in the runtime. Record missing or undecodable clips explicitly when future audio is attached; do not silently claim audio support from a silent test.

Current timings are transparent reading estimates. Once real clips arrive, use their measured durations and phrase alignment, extend settled states and preserve meaningful holds. Do not speed up drawing paths, gestures, easing or captions just to fill a new clip. Keep absolute duration for a gesture and relative semantic placement for its trigger.

Each section includes an isolated retime-demo.json. Exercise it without overwriting the production profile. Verify the expected timeline delta, correct cue/anchor placement, preserved hold durations, transitions and branch rejoins with sampled frames. A different total number alone is not a retiming test.

Supply an explicit adapter/compiler for the new authoring graph. The historical renderer contains section-specific IDs and staging. Renaming L02 to L03 throughout that source is not an implementation.

## Length and package size

Thirty minutes is an editorial allocation, not a padding target. Report the full Watch runtime and each Practice branch runtime excluding unlimited wait. Do not sum all alternative branches into one course runtime. Do not trim teaching content or remove reflection to fit an estimated budget.

Keep source and playable ZIPs individually below 20,000,000 bytes. Exclude dependencies, browser binaries, build caches and intermediate video frames. If a combined archive exceeds the limit, deliver self-contained section archives and a small integration bundle. Do not split a ZIP into opaque binary fragments, omit branches or lower source quality to hide the limit. MP4s can be delivered separately, with actual size reported.
