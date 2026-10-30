# Acceptance and return

## Input audit versus output tests

Run tools/validate-authoring.py to audit this handoff. Its checks validate cue/anchor/branch integrity and fingerprints, not rendered animation. Implement tests against the actual new runtime. Historical reference tests do not certify Lesson07.

## Required evidence per section

- Script: all supplied cues, labels, holds and branches implemented once where intended; no stale L02 titles, accessibility names or assumed task facts. Exact spoken words remain distinct from shortened diagram labels.
- Semantic staging: pause versus consent, overlap versus inferred intent, invitation versus pressure, task relevance versus a blanket ban on side topics, unfinished turn versus a fully supplied proposal, authored continuation versus guaranteed repair, episode reset versus a fixed personality, and blank private response versus model speech.
- Visuals: opening/middle/end of every block and every branch; dense text and transition midpoints. Check visible text and all clipping ancestors, including frames around hypothetical scenes. Neither bbox-only false positives nor invisible missing text count as a visual pass.
- Layout: 1920x1080 master; practical desktop viewport; phone 390x844; tablet 820x1180 and landscape. Record whether tests are emulated or physical.
- Interaction: all A/B/C paths, replay, Retry, Skip, repeated Continue, seek across/before gate, branch-local seek, mode switches at common content and gates, restart and each playback rate. Practice waiting must remain open beyond the corresponding Watch hold. S06 model end never becomes completed speaking or successful repair; Watch continues automatically, while Practice waits for Continue.
- Access: keyboard, visible focus, captions toggle, reduced motion, readable DOM alternatives and adequate controls. Check long labels/options and font fallback.
- Retiming: supplied isolated profile plus increased text; actual visible state at semantic anchors and motion transitions. Hold durations and branch order remain fixed.
- Offline: extract delivered playable ZIP in a fresh directory; no remote scripts, fonts, assets or requests required. Rebuild from fresh source with documented dependencies and commands; compare relevant artifact hashes.
- Combined lesson: switch sections repeatedly during play, pause, choice wait and model play. No residual old canvas/clock/audio/listeners, wrong progress, stale choice or false completion. Verify all seven entries are present and point to their actual products.
- Browser: Chromium and available WebKit; Firefox if available. Record OS/browser/version and unrun tests. Playwright WebKit is not Safari.app and an emulated viewport is not a physical device. No audible playback claim from a silent test.

## Video when tools are available

Export deterministic Watch frames at 1920x1080/30fps, not a screen recording assumed to have no dropped frames. The MP4 review is silent; an audio stream must not contain unwanted test tones or inherited narration. Inspect actual decoded frames, encoded duration/fps/resolution, full decode and first/middle/end. Export SRT from the same compiled Watch path. There must be no interactive waiting in the MP4 and no double counting of alternate branches. Record failures/unavailable exports honestly.

## Return per section

1. Source ZIP with exact input source, implemented source/assets, runtime data, editable labels, slots, anchors, timing and future audio attachment instructions.
2. Self-contained playable ZIP and standalone HTML where feasible.
3. Storyboard, meaningful transition examples and actual test report.
4. Measured silent built timeline, file manifest and change log by cue/component.
5. Optional silent MP4 and SRT if exported and verified.

Keep each source/playable ZIP below 20 MB. A small shared integration bundle must include the combined entry, relative paths, assembly instructions and all-seven status. It must not imply missing sections are delivered. Keep original reference files and previous lesson releases intact.

## A valid final report

State exactly what is built, exported, verified and untested. Include actual paths and sizes, all seven section statuses, measured Watch duration, Practice variations, changed wording/visual assumptions and commands to reproduce. Do not call planned content or a scaffold a finished lesson. Do not report real narration, final localization, AI assessment, website integration or publication as part of this silent animation assignment.
