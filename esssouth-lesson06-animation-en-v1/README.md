# esssouth · Lesson 06 · Explain Your Experience and Respond to Follow-Up Questions: silent English animation review

This project contains all seven sections of Lesson 06. Each section can be played and edited on its own, and a combined lesson entry ties them together.

It is built in the accepted esssouth style: the approved Lesson 02 toolkit, reused unchanged, plus the Lesson 04 runtime (see `STYLE_PROVENANCE.md`).

- **Silent.** There is no narration, music, test tone or speech synthesis.
- **Nothing is recorded.** There is no microphone access, recording, AI, scoring, truth checking, purchase or storage of answers.
- **Fictional case.** Every case or model scene carries the label "Fictional worked example". The case facts (F01–F09) come from `handoff-input/case-facts.en.json` and are never changed, extended or placed into a learner's private area.

## What is here

| Path | Contents |
|---|---|
| `sections/S01`–`S07/` | One folder per section. `content/source/` holds the exact handoff inputs, unchanged. `content/labels.staging.en.json` and `content/staging-anchors.json` are this build's diagram labels and phrase anchors. `scenes.js` is the section adapter (its choreography). `data/` is generated runtime data. `index.html` is the player built from source. `L06S0n_player_standalone.html` is the offline player. The folder also holds `STORYBOARD.md`, `SCENE_MAP.json` and `TEST_REPORT.md`. |
| `shared/toolkit/` | The approved runtime, byte-identical: engine, kit, characters, recipes, style, slots. |
| `shared/l06/` | The Lesson 04 runtime, carried over for Lesson 06: the graph compiler, the Watch/Practice player, the scene kit, the caption bar with speaker names from the graph, the future-audio hook, extra slots, interface strings. |
| `lesson/index.html` | Combined lesson entry, development version, with chapter navigation and both modes. It loads `sections/*/index.html`. `chapters.json` holds the compiled durations. |
| `tools/` | `build.mjs`, `lesson.mjs`, `qa.cjs`, `qa-lesson.cjs`, `docs.cjs`, `export-mp4.cjs`, `verify-video.cjs`, `attach-audio.mjs`, `status.mjs`, `package.py` |
| `qa/` | Actual test evidence: `qa/S0n/report.json`, stills, `qa/lesson/`, packaging and export verification. |
| `dist/` | Deliverables: a source ZIP and a playable ZIP per section, the lesson bundle ZIP, `MANIFEST.json`, and silent MP4 + SRT files in `dist/video/`. |
| `BUILD_STATUS.json` | Resumable per-section status: implemented cues, the tests actually run, measured durations and hashes. |
| `handoff-input/` | Copies of the handoff's lesson-level documents and the case ledger. The historical reference player was used read-only and is not included. |

## Run

1. Open `lesson/index.html` (development) or `index.html` from the lesson bundle. You can also open any `L06S0n_player_standalone.html` directly from disk. No server or network is needed.
2. The player has these controls: Watch / Practice, Play / Pause, Restart section, seek, Captions, Reduced motion, and Speed (1, 1.25, 1.5 or 2×). A collapsible "Fictional worked example: case facts" panel below the stage lists F01–F09 for sections that use the case.
3. Keyboard: Space plays or pauses; the left and right arrows seek 5 s.

## Rebuild and check (Node 18+; Playwright with Chromium for QA; ffmpeg for MP4; Python 3 for packaging)

```
node tools/build.mjs                    # validate inputs → data/, index.html, standalone players
node tools/lesson.mjs                   # combined entry (development); add --bundle for the integration bundle
NODE_PATH=<dir with playwright> node tools/qa.cjs S01          # per section → qa/S01/report.json
NODE_PATH=<dir with playwright> node tools/qa-lesson.cjs       # combined entry → qa/lesson/report.json
NODE_PATH=<dir with playwright> node tools/docs.cjs            # STORYBOARD.md, SCENE_MAP.json, TEST_REPORT.md
NODE_PATH=<dir with playwright> node tools/export-mp4.cjs S01  # deterministic silent 1920×1080/30 fps MP4 + SRT
node tools/verify-video.cjs             # probes every MP4 (size, rate, frames, no audio) against the build
node tools/status.mjs S01               # BUILD_STATUS.json from the actual outputs
python3 tools/package.py                # dist/*.zip + MANIFEST.json
```

## Watch and Practice

- **S01, S04, S05, S07.** Both modes use the same route and the same fixed reflection holds.
- **S02 (gate L06.I01) and S03 (gate L06.I02).**
  - Watch shows 8 s of thinking time, then only the declared path (B in S02, C in S03), then the common continuation.
  - Practice waits with no timer. Each option plays as its own authored continuation and then waits for Continue or Try again. Deliberately flawed options are labelled as such before they are spoken. Skip enters the common content once, recorded as unanswered.
- **S06 (gate L06.I03, private rehearsal).**
  - Watch gives a 35 s private opportunity on a blank board, then the fictional model (d101, d102 with Maya as a later rehearsal partner, f101), then c008.
  - Practice waits. Its actions are Show a possible reply, Continue, Skip and Try again.
  - Watching the model sets only `modelViewed = true`. `responseText` stays null; `speakingObserved`, `completionAssumed` and `experienceVerified` stay false.

## Results in brief

Full details are in `BUILD_STATUS.json` and `sections/*/TEST_REPORT.md`.

**Built Watch duration (silent estimated timing):**

| Section | Watch |
|---|---|
| S01 | 236.902 s |
| S02 | 259.741 s |
| S03 | 269.092 s |
| S04 | 237.629 s |
| S05 | 261.823 s |
| S06 | 315.330 s |
| S07 | 172.150 s |
| **Lesson** | **1752.667 s (29:13)** |

This equals the supplied reading estimate. It is not a measured narration time.

**Practice routes, excluding unlimited waiting:**

| Section | A | B | C | Model | Skip |
|---|---|---|---|---|---|
| S02 | 240.513 s | 252.941 s | 246.941 s | — | 218.891 s |
| S03 | 253.722 s | 262.292 s | 262.292 s | — | 230.814 s |
| S06 | — | — | — | 281.530 s | 219.194 s |

## Not done or not tested

Each `TEST_REPORT.md` lists these per section.

- **Browsers.** Only Chromium was used. WebKit, Firefox and Safari.app were not available. The phone and tablet checks were emulated viewports, not physical devices.
- **Assistive technology.** Screen readers were not tested.
- **Audio and localization.** There is no audio; audible playback, narration, lip sync and localization are downstream work. The audio attachment path was run only as a dry-run mapping check.
- **Fonts.** The frames were rendered with Inter. The approved reference frames used Segoe UI.
- **Text expansion.** The ×1.3 and ×1.6 tests produce fitter warnings in some cards. These are listed per section in `TEST_REPORT.md`. The fitter reports them and never clips silently; they need layout work in the localization pass.
- **Out of scope.** No website was edited and nothing was published. Earlier lesson projects and the supplied reference files were not changed.
