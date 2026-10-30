# esssouth · Lesson 08 · Bring Contributions Together into a Shared Proposal: silent English animation review

This project contains all seven sections of Lesson 08. Each section can be played and edited on its own, and a combined lesson entry ties them together.

It is built in the accepted esssouth style: the approved Lesson 02 toolkit, reused unchanged, plus the Lesson 07 runtime (see `STYLE_PROVENANCE.md`).

- **Silent.** There is no narration, music, test tone or speech synthesis.
- **Nothing is recorded.** There is no microphone, live AI, scoring, truth verification, saved learner response, purchase or publishing.
- **Fixed cases and snapshots.**
  - S01–S04 use the baseline snapshot of the fictional book-club taster (`handoff-input/case-facts.en.json`, F01–F09).
  - S05 is a visibly labelled later authored proposal check. A status card changes only after that person's exact words.
  - S06 rehearses from that S05 snapshot.
  - S07 is the separate notice-layout case (`handoff-input/transfer-scenario.en.json`).
  - Branch replies never become facts on another path, and nothing is adopted.

## What is here

| Path | Contents |
|---|---|
| `sections/S01`–`S07/` | One folder per section. `content/source/` holds the exact handoff inputs, unchanged. `content/labels.staging.en.json` and `content/staging-anchors.json` are this build's diagram labels and phrase anchors. `scenes.js` is the section adapter (its choreography). `data/` is generated runtime data. `index.html` is the player built from source. `L08S0n_player_standalone.html` is the offline player. The folder also holds `STORYBOARD.md`, `SCENE_MAP.json` and `TEST_REPORT.md`. |
| `shared/toolkit/` | The approved runtime, byte-identical: engine, kit, characters, recipes, style, slots. |
| `shared/l08/` | The Lesson 07 runtime, carried over for Lesson 08: the graph compiler, the Watch/Practice player (with a snapshot-filtered case panel), the scene kit, the caption bar, the future-audio hook, extra slots, interface strings. |
| `lesson/index.html` | Combined lesson entry, development version, with chapter navigation, both modes and rates 1/1.25/1.5/2. It loads `sections/*/index.html`. `chapters.json` holds the compiled durations. |
| `tools/` | `build.mjs`, `lesson.mjs`, `qa.cjs`, `qa-lesson.cjs`, `docs.cjs`, `export-mp4.cjs`, `verify-video.cjs`, `attach-audio.mjs`, `status.mjs`, `package.py` |
| `qa/` | Actual test evidence: `qa/S0n/report.json`, stills, `qa/lesson/`, packaging and export verification. |
| `dist/` | Deliverables: a source ZIP and a playable ZIP per section, the lesson bundle ZIP, `MANIFEST.json`, and silent MP4 + SRT files in `dist/video/`. |
| `BUILD_STATUS.json` | Resumable per-section status: implemented cues, the tests actually run, measured durations and hashes. |
| `handoff-input/` | Copies of the handoff's lesson-level documents, the case facts and the transfer scenario. The historical reference player was used read-only and is not included. |

## Run

1. Open `lesson/index.html` (development) or `index.html` from the lesson bundle. You can also open any `L08S0n_player_standalone.html` directly from disk. No server or network is needed.
2. The player has these controls: Watch / Practice, Play / Pause, Restart section, seek, Captions, Reduced motion, and Speed (1, 1.25, 1.5 or 2×).
3. A collapsible case-facts panel below the stage lists the scenario facts. It follows the active snapshot: the later proposal-check statements appear only in S06, the section that rehearses from them. S01–S05 never list them, and S05 lets its own replies arrive in the scene.
4. Keyboard: Space plays or pauses; the left and right arrows seek 5 s.

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
- **S02 (gate L08.I01, peer Noah) and S03 (gate L08.I02, peer Maya).**
  - Watch shows 8 s of thinking time, then only B (S02) or C (S03), then rejoins c010 automatically.
  - Practice waits with no timer. Each option plays its own authored continuation, labelled before it is spoken, and then waits for Continue or Try again. Retry restores the exact baseline. Skip enters c010 once, as unanswered.
  - At the rejoin, branch cards are cut at once, not faded.
- **S06 (gate L08.I03, private rehearsal).**
  - Watch gives a 35 s private opportunity on a blank board, then the separate model (d101, d102, f101), then c008.
  - Practice waits. Its actions are Show a possible reply, Continue, Skip and Try again.
  - Viewing the model sets only `modelViewed = true`. `responseText` stays null; `speakingObserved`, `completionAssumed`, `groupAgreementVerified` and `proposalAdopted` stay false.

## Results in brief

Full details are in `BUILD_STATUS.json` and `sections/*/TEST_REPORT.md`.

**Built Watch duration (silent estimated timing):**

| Section | Watch |
|---|---|
| S01 | 241.837 s |
| S02 | 291.248 s |
| S03 | 308.823 s |
| S04 | 276.120 s |
| S05 | 283.679 s |
| S06 | 344.044 s |
| S07 | 171.865 s |
| **Lesson** | **1917.616 s (31:58)** |

This equals the supplied reading estimate. It is not a measured narration time, and nothing was padded or sped up.

**Practice routes, excluding unlimited waiting (alternatives are not summed):**

| Section | A | B | C | Model | Skip |
|---|---|---|---|---|---|
| S02 | 281.021 s | 284.448 s | 282.736 s | — | 251.685 s |
| S03 | 290.879 s | 295.594 s | 302.023 s | — | 260.258 s |
| S06 | — | — | — | 310.244 s | 256.051 s |

## Not done or not tested

Each `TEST_REPORT.md` lists these per section.

- **Browsers.** Only Chromium was used. WebKit, Firefox and Safari.app were not available. The phone and tablet checks were emulated viewports, not physical devices.
- **Assistive technology.** Screen readers were not tested.
- **Audio and localization.** There is no audio. Audible playback, narration, lip sync and localization are downstream work. The audio attachment path was run only as a dry-run mapping check.
- **Fonts.** The frames were rendered with Inter. The approved reference frames used Segoe UI.
- **Text expansion.** The ×1.3 and ×1.6 tests produce fitter warnings in some cards. These are listed per section in `TEST_REPORT.md`. The fitter reports them and never clips silently; they need layout work in the localization pass.
- **Out of scope.** No website was edited and nothing was published. Earlier lesson projects and the supplied reference files were not changed.
