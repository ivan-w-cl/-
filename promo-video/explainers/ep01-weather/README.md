# Episode 01 · Liverpool weather (English)

Editable project for the 113-second explainer with a ~22-second product insert.

| File | What it is |
|---|---|
| `script.json` | Narration, line by line, grouped by scene. Voice, speed and language are set here |
| `tts.py` | Generates `audio/voice.wav`, `audio/timing.json` and `audio/narration.srt` from `script.json` (Kokoro) |
| `scenes.js` | All visuals. On-screen wording is in the `TXT` table at the top; scenes are SVG drawn from the current time; the product insert drives the real web app |
| `build.py` | Combines timings + `scenes.js` into `../../stage/timeline-ep01.js`, splits long captions, writes `audio/captions.srt` |
| `audio/timing.json` | Start / end time of every narration line and scene |
| `SOURCES.md` | Facts, material and music sources |

## Rebuild

```
python3 tts.py <kokoro-v1.0.onnx> <voices-v1.0.bin> script.json audio     # voice + timings
python3 -I build.py                                                        # timeline + captions
WEB_ROOT=<offline web package> PORT=8781 node ../../server.cjs &
PORT=8781 PORTRAIT=1 DK=1 DKSTART=phone TL=timeline-ep01 PRE=300 DATE=2026-11-03T12:00:00Z SFX_LOG=sfx.json node ../../record.cjs frames 30 0 112.85 1
# add EXTRA='&nocap=1' for the clean picture without burnt-in captions
```

## Making the Chinese version

1. Translate `script.json` lines and switch the voice; run `tts.py` (or supply your own recording and edit `audio/timing.json`).
2. Translate the `TXT` table in `scenes.js`.
3. Run `build.py` and record again. Scene lengths follow the new voice timings automatically.
