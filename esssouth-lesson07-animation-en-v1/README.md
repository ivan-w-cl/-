# esssouth · Lesson 07 · Keep the Discussion Moving When It Gets Stuck: silent English animation review

This project contains all seven sections of Lesson 07. Each section can be played and edited on its own, and a combined lesson entry ties them together.

It is built in the accepted esssouth style: the approved Lesson 02 toolkit, reused unchanged, plus the Lesson 06 runtime (see `STYLE_PROVENANCE.md`).

- **Silent.** There is no narration, music, test tone, speech synthesis or simulated overlap audio.
- **Nothing is recorded.** There is no microphone, speech capture, live AI, emotion detection, scoring, inferred repair success, saved answer or purchase flow.
- **Practice examples.** S01–S06 use the fictional welcome-activity discussion (`handoff-input/case-facts.en.json`); every section starts from its own declared excerpt baseline, and no branch outcome is carried into another excerpt. S07 uses the separate reusable-mug task (`handoff-input/transfer-scenario.en.json`). No proposal is ever adopted.

## What is here

| Path | Contents |
|---|---|
| `sections/S01`–`S07/` | One folder per section. `content/source/` holds the exact handoff inputs, unchanged. `content/labels.staging.en.json` and `content/staging-anchors.json` are this build's diagram labels and phrase anchors. `scenes.js` is the section adapter (its choreography). `data/` is generated runtime data. `index.html` is the player built from source. `L07S0n_player_standalone.html` is the offline player. The folder also holds `STORYBOARD.md`, `SCENE_MAP.json` and `TEST_REPORT.md`. S03 also has `OVERLAP_TIMING_NOTE.md` (the two starts, the unfinished point, the reveal point and the reset, plus the plan for the later voice pass). |
| `shared/toolkit/` | The approved runtime, byte-identical: engine, kit, characters, recipes, style, slots. |
| `shared/l07/` | The Lesson 06 runtime, carried over for Lesson 07: the graph compiler, the Watch/Practice player, the scene kit, the caption bar with speaker names from the graph, the future-audio hook, extra slots, interface strings. |
| `lesson/index.html` | Combined lesson entry, development version, with chapter navigation and both modes. It loads `sections/*/index.html`. `chapters.json` holds the compiled durations. |
| `tools/` | `build.mjs`, `lesson.mjs`, `qa.cjs`, `qa-lesson.cjs`, `docs.cjs`, `export-mp4.cjs`, `verify-video.cjs`, `attach-audio.mjs`, `status.mjs`, `package.py` |
| `qa/` | Actual test evidence: `qa/S0n/report.json`, stills, `qa/lesson/`, packaging and export verification. |
| `dist/` | Deliverables: a source ZIP and a playable ZIP per section, the lesson bundle ZIP, `MANIFEST.json`, and silent MP4 + SRT files in `dist/video/`. |
| `BUILD_STATUS.json` | Resumable per-section status: implemented cues, the tests actually run, measured durations and hashes. |
| `handoff-input/` | Copies of the handoff's lesson-level documents, the case facts and the transfer scenario. The historical reference player was used read-only and is not included. |

## Run

1. Open `lesson/index.html` (development) or `index.html` from the lesson bundle. You can also open any `L07S0n_player_standalone.html` directly from disk. No server or network is needed.
2. The player has these controls: Watch / Practice, Play / Pause, Restart section, seek, Captions, Reduced motion, and Speed (1, 1.25, 1.5 or 2×). A collapsible "Practice example: case facts" panel below the stage lists the scenario facts (T01–T04 in S07).
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
- **Illustrative pauses.** S02 h001 (4 s) and S06 h100 (3 s) are shared scene content in both modes. They show a resting room with no bubble and a plain "Chosen illustration interval" label. There is no timer, alarm or waiting-for-input state, and they are separate from the Watch thinking hold at the gate.
- **S02 (gate L07.I01) and S03 (gate L07.I02).**
  - Watch shows 8 s of thinking time, then only the declared path (B in S02, C in S03), then rejoins automatically.
  - Practice waits with no timer. Each option plays as its own authored continuation and then waits for Continue or Try again. Each branch is labelled before it is spoken. Skip enters the common content once, as unanswered.
  - Noah's complete F05 appears only inside S02 branch B and S03 branch C. QA checks on every route that it is never visible anywhere else.
- **S03 overlap.** The baseline is a labelled, silent two-lane illustration. Only the two source fragments are ever on the baseline stage. See `sections/S03/OVERLAP_TIMING_NOTE.md`.
- **S06 (gate L07.I03, private rehearsal).**
  - Watch gives a 35 s private opportunity on a blank board, then the model (d101, d102, f101), then c008.
  - Practice waits. Its actions are Show a possible reply, Continue, Skip and Try again.
  - Watching the model sets only `modelViewed = true`. `responseText` stays null; `speakingObserved`, `completionAssumed`, `repairSucceeded` and `proposalAdopted` stay false.

## Results in brief

Full details are in `BUILD_STATUS.json` and `sections/*/TEST_REPORT.md`.

**Built Watch duration (silent estimated timing):**

| Section | Watch |
|---|---|
| S01 | 230.900 s |
| S02 | 247.459 s |
| S03 | 281.643 s |
| S04 | 224.123 s |
| S05 | 234.122 s |
| S06 | 316.537 s |
| S07 | 146.007 s |
| **Lesson** | **1680.791 s (28:01)** |

This equals the supplied reading estimate. It is not a measured narration time, and nothing was padded or sped up to reach the 30-minute editorial target.

**Practice routes, excluding unlimited waiting:**

| Section | A | B | C | Model | Skip |
|---|---|---|---|---|---|
| S02 | 233.802 s | 240.659 s | 234.659 s | — | 208.752 s |
| S03 | 264.057 s | 264.557 s | 274.843 s | — | 241.650 s |
| S06 | — | — | — | 282.737 s | 243.116 s |

## Not done or not tested

Each `TEST_REPORT.md` lists these per section.

- **Browsers.** Only Chromium was used. WebKit, Firefox and Safari.app were not available. The phone and tablet checks were emulated viewports, not physical devices.
- **Assistive technology.** Screen readers were not tested.
- **Audio, overlap and localization.** There is no audio, so the overlap is not acoustically tested. Audible playback, narration, any deliberately authored overlap, lip sync and localization are downstream work. The audio attachment path was run only as a dry-run mapping check.
- **Fonts.** The frames were rendered with Inter. The approved reference frames used Segoe UI.
- **Text expansion.** The ×1.3 and ×1.6 tests produce fitter warnings in some cards. These are listed per section in `TEST_REPORT.md`. The fitter reports them and never clips silently; they need layout work in the localization pass.
- **Out of scope.** No website was edited and nothing was published. Earlier lesson projects and the supplied reference files were not changed.
