# esssouth · Lesson 03 · Listen Closely, Respond to the Point: silent English animation review

This project contains all seven sections of Lesson 03. Each section can be played and edited on its own, and a combined lesson entry ties them together.

It is built in the accepted esssouth style: the approved Lesson 02 toolkit, reused unchanged (see `STYLE_PROVENANCE.md`).

- **Silent.** There is no narration, music, test tone or speech synthesis.
- **Nothing is recorded.** There is no microphone access, AI, scoring or storage of answers.

## What is here

| Path | Contents |
|---|---|
| `sections/S01`–`S07/` | One folder per section. `content/source/` holds the exact handoff inputs, unchanged. `content/labels.staging.en.json` and `content/staging-anchors.json` are this build's diagram labels and phrase anchors. `scenes.js` is the section adapter (its choreography). `data/` is generated runtime data. `index.html` is the player built from source. `L03S0n_player_standalone.html` is the offline player. The folder also holds `STORYBOARD.md`, `SCENE_MAP.json` and `TEST_REPORT.md`. |
| `shared/toolkit/` | The approved runtime, byte-identical: engine, kit, characters, recipes, style, slots. |
| `shared/l03/` | New for Lesson 03: the graph compiler, the Watch/Practice player, the scene kit, the future-audio hook, extra slots, interface strings. |
| `lesson/index.html` | Combined lesson entry, development version. It loads `sections/*/index.html`. `chapters.json` holds the compiled durations. |
| `tools/` | `build.mjs`, `lesson.mjs`, `qa.cjs`, `qa-lesson.cjs`, `docs.cjs`, `export-mp4.cjs`, `attach-audio.mjs`, `status.mjs`, `package.py` |
| `qa/` | Actual test evidence: `qa/S0n/report.json`, stills, `qa/lesson/`, and export verification. |
| `dist/` | Deliverables: a source ZIP and a playable ZIP per section, the lesson bundle ZIP, `MANIFEST.json`, and silent MP4 + SRT files in `dist/video/`. |
| `BUILD_STATUS.json` | Resumable per-section status: implemented cues, the tests actually run, measured durations and hashes. |
| `handoff-input/` | Copies of the handoff's lesson-level documents. The historical reference player is not included, because it was used read-only. |

## Run

1. Open `lesson/index.html` (development) or `index.html` from the lesson bundle. You can also open any `L03S0n_player_standalone.html` directly from disk. No server or network is needed.
2. The player has these controls: Watch / Practice, Play / Pause, Restart section, seek, Captions, Reduced motion, and Speed (1, 1.25, 1.5 or 2×).
3. Keyboard: Space plays or pauses; the left and right arrows seek 5 s.

## Rebuild and check (Node 18+; Playwright with Chromium for QA; ffmpeg for MP4; Python 3 for packaging)

```
node tools/build.mjs                    # validate inputs → data/, index.html, standalone players
node tools/lesson.mjs                   # combined entry (development); add --bundle for the integration bundle
NODE_PATH=<dir with playwright> node tools/qa.cjs S01          # per section → qa/S01/report.json
NODE_PATH=<dir with playwright> node tools/qa-lesson.cjs       # combined entry → qa/lesson/report.json
NODE_PATH=<dir with playwright> node tools/docs.cjs            # STORYBOARD.md, SCENE_MAP.json, TEST_REPORT.md
NODE_PATH=<dir with playwright> node tools/export-mp4.cjs S01  # deterministic silent 1920×1080/30 fps MP4 + SRT
node tools/status.mjs S01               # BUILD_STATUS.json from the actual outputs
python3 tools/package.py                # dist/*.zip + MANIFEST.json
```

## Watch and Practice

- **S01, S04, S05, S07.** Both modes use the same route and the same fixed reflection holds.
- **S02 (gate L03.I01) and S03 (gate L03.I02).**
  - Watch shows 8 s of thinking time, then only the declared path (B in S02, C in S03), then the common continuation.
  - Practice waits with no timer. Each option plays as its own authored continuation and then waits for Continue or Try again. Skip enters the common content once, recorded as unanswered.
- **S06 (gate L03.I03).**
  - Watch gives a 35 s private opportunity, then the model (d101, d102, f101), then c008.
  - Practice waits. Its actions are Show a possible reply, Continue, Skip and Try again.
  - Watching the model sets only `modelViewed = true`. `speakingObserved`, `completionAssumed` and `proposalAdopted` stay false.

## Results in brief

Full details are in `BUILD_STATUS.json` and `sections/*/TEST_REPORT.md`.

**Built Watch duration (silent estimated timing):**

| Section | Watch |
|---|---|
| S01 | 224.593 s |
| S02 | 280.000 s |
| S03 | 281.130 s |
| S04 | 254.951 s |
| S05 | 250.029 s |
| S06 | 300.664 s |
| S07 | 164.928 s |
| **Lesson** | **1756.295 s (29:16)** |

This equals the supplied reading estimate. It is not a measured narration time.

**Practice routes, excluding unlimited waiting:**

| Section | A | B | C | Model | Skip |
|---|---|---|---|---|---|
| S02 | 265.056 s | 273.200 s | 270.199 s | — | 238.721 s |
| S03 | 268.258 s | 274.759 s | 274.330 s | — | 246.280 s |
| S06 | — | — | — | 266.864 s | 230.671 s |

## Not done or not tested

Each `TEST_REPORT.md` lists these per section.

- **Browsers.** Only Chromium was used. WebKit, Firefox and Safari.app were not available. The phone and tablet checks were emulated viewports, not physical devices.
- **Assistive technology.** Screen readers were not tested.
- **Audio and localization.** There is no audio; audible playback, narration, lip sync and localization are downstream work. The audio attachment path was run only as a dry-run mapping check.
- **Fonts.** The frames were rendered with Inter. The approved reference frames used Segoe UI.
- **Text expansion.** The ×1.3 and ×1.6 tests produce fitter warnings in a few cards and in the S06 header. The fitter reports these and never clips silently; they need layout work in the localization pass.
- **Out of scope.** No website was edited and nothing was published.
