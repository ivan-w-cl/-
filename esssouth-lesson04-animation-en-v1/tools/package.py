#!/usr/bin/env python3
"""esssouth Lesson 04 · package deliverables into dist/ (deterministic ZIPs: fixed timestamps, sorted entries).

  dist/esssouth-L04S0n-source.zip    exact inputs + implemented source + runtime data + docs + this section's QA evidence
  dist/esssouth-L04S0n-playable.zip  self-contained standalone player + storyboard + test report
  dist/esssouth-L04-lesson-bundle.zip combined entry + all seven standalone players + assembly instructions
  dist/MANIFEST.json                 sizes and SHA-256 of every deliverable (and of the separate MP4/SRT files)
Run after: node tools/build.mjs && node tools/lesson.mjs --bundle && node tools/docs.cjs
Usage: python3 tools/package.py
"""
import hashlib, json, os, zipfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist'); os.makedirs(DIST, exist_ok=True)
LIMIT = 20_000_000
STAMP = (2026, 10, 29, 0, 0, 0)

def rel_files(base, sub):
    out = []
    for d, _, fs in os.walk(os.path.join(base, sub)):
        for f in fs: out.append(os.path.relpath(os.path.join(d, f), base))
    return sorted(out)

def write_zip(name, root_dir, entries):
    """entries: list of (archive path, source absolute path or bytes)"""
    p = os.path.join(DIST, name)
    with zipfile.ZipFile(p, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for arc, src in sorted(entries, key=lambda e: e[0]):
            info = zipfile.ZipInfo(root_dir + '/' + arc, STAMP); info.compress_type = zipfile.ZIP_DEFLATED; info.external_attr = 0o644 << 16
            z.writestr(info, src if isinstance(src, bytes) else open(src, 'rb').read())
    size = os.path.getsize(p)
    if size >= LIMIT: raise SystemExit(f'{name} is {size} bytes, over the 20 MB limit')
    return p

status = json.load(open(os.path.join(ROOT, 'BUILD_STATUS.json')))
chapters = json.load(open(os.path.join(ROOT, 'lesson/chapters.json')))['chapters']
COMMON = ['README.md', 'CHANGES_FROM_HANDOFF.md', 'STYLE_PROVENANCE.md', 'BUILD_STATUS.json', '.gitignore']
manifest = {'note': 'Sizes and SHA-256 of the delivered files. Every ZIP is below 20,000,000 bytes.', 'files': {}}

for n in range(1, 8):
    S = f'S0{n}'; sid = f'L04.S0{n}'; sec = next(s for s in status['sections'] if s['id'] == sid); ch = chapters[n - 1]
    gate = ch['gate']
    readme = f"""# esssouth · Lesson 04 · {ch['num']} {ch['title']} · silent English review

Status: **{sec['status']}** (from BUILD_STATUS.json). QA: {sec.get('qaReport')}.

## Open
- `sections/{S}/L04S0{n}_player_standalone.html`: self-contained offline player (open from disk; no server, no network).
- `sections/{S}/index.html`: the same player from editable source (`../../shared/`, `data/`, `scenes.js`).
- URL options: `?mode=practice`, `?t=<s>`, `?rm=1`, `?nocap=1`, `?rate=1.5`, `?timing=retime-demo`, `?text=x1.3|x1.6|long`, `?debug=slots`, `?export=1`.

## Built duration (silent, estimated timing)
- Watch: **{ch['watchSeconds']} s**.
- Practice: {', '.join(f'`{k}` {v} s' for k, v in ch['practice'].items())}; waiting at the gate is unlimited and not counted.
{('- Interaction ' + gate['id'] + ' (' + gate['kind'] + '): Watch shows its thinking time and one declared path; Practice waits for a choice, Try again, Skip or Continue.') if gate else '- No interaction gate: Watch and Practice share the same route and holds.'}

## Edit and rebuild (Node 18+)
- Words, labels, anchors, timing and audio slots: `sections/{S}/content/source/` (exact inputs; keep unchanged unless the script changes), diagram labels `content/labels.staging.en.json`, staging anchors `content/staging-anchors.json`, choreography `scenes.js`.
- `node tools/build.mjs {S}`: validate, then write `data/`, `index.html` and the standalone player.
- QA (Playwright + Chromium): `NODE_PATH=<dir containing playwright> node tools/qa.cjs {S}`. Results: `qa/{S}/report.json`, `TEST_REPORT.md`.
- Docs: `node tools/docs.cjs {S}` (STORYBOARD.md, SCENE_MAP.json, TEST_REPORT.md).
- Future audio: `node tools/attach-audio.mjs {S} mapping.json [--dry-run]`, then `node tools/build.mjs {S} --audio=<lang>` (see shared/l04/audio-hook.js).
- Silent MP4 + SRT: `node tools/export-mp4.cjs {S}` (needs ffmpeg).

See STORYBOARD.md (scene map with stills), TEST_REPORT.md (actual results and what was not tested), CHANGES_FROM_HANDOFF.md and STYLE_PROVENANCE.md.
"""
    src_entries = [(f, os.path.join(ROOT, f)) for f in COMMON if os.path.exists(os.path.join(ROOT, f)) and f != 'README.md']
    src_entries.append(('README.md', readme.encode()))
    for sub in ['shared', 'tools', f'sections/{S}', f'qa/{S}', 'handoff-input']:
        src_entries += [(f, os.path.join(ROOT, f)) for f in rel_files(ROOT, sub)]
    sz = write_zip(f'esssouth-L04S0{n}-source.zip', f'esssouth-L04S0{n}-source', src_entries)
    play_readme = f"""# {ch['num']} {ch['title']} · playable silent review

Open `L04S0{n}_player_standalone.html` in a current desktop browser (from disk; no server or network needed).
Watch {ch['watchSeconds']} s · {'interaction ' + gate['id'] if gate else 'no interaction gate'}. Add `?mode=practice` for Practice.
The Next section button needs the next section's standalone player beside this file (the lesson bundle has all seven).
Silent: no narration, music or test tones. Nothing is recorded or stored. Tested in Chromium only (see TEST_REPORT.md).
"""
    play_entries = [(f'L04S0{n}_player_standalone.html', os.path.join(ROOT, f'sections/{S}/L04S0{n}_player_standalone.html')), ('README.md', play_readme.encode()),
                    ('STORYBOARD.md', os.path.join(ROOT, f'sections/{S}/STORYBOARD.md')), ('TEST_REPORT.md', os.path.join(ROOT, f'sections/{S}/TEST_REPORT.md'))]
    pz = write_zip(f'esssouth-L04S0{n}-playable.zip', f'esssouth-L04S0{n}-playable', play_entries)

assembly = """# Lesson 04 · combined entry (integration bundle)

Open `index.html`. It hosts one section player at a time (`players/L04S0n_player_standalone.html`). Switching sections removes
the previous player completely (its clock, listeners and any later audio), then opens the new section at its start.

- Mode (Watch / Practice) in the top bar is forwarded to the live section; section controls (play, restart, seek, captions,
  reduced motion, speed 1 / 1.25 / 1.5 / 2) are in each player.
- A section never advances by itself; at its end the player offers an explicit Next section action.
- chapters.json: chapter order, compiled Watch durations, Watch start offsets for a concatenated export, Practice route lengths.

## Assembly into another site (not done here; no website was edited)
1. Copy `index.html`, `chapters.json` and `players/` together; keep the relative paths.
2. Or link each `players/L04S0n_player_standalone.html` directly; each is self-contained (inline CSS, JS and data; no remote requests).
3. Per-section source and playable ZIPs are delivered separately (`esssouth-L04S0n-source.zip`, `-playable.zip`).

All seven sections are present in this bundle. Status per section: see BUILD_STATUS.json.
"""
b_entries = [('index.html', os.path.join(ROOT, 'dist/_bundle/index.html')), ('chapters.json', os.path.join(ROOT, 'dist/_bundle/chapters.json')),
             ('ASSEMBLY.md', assembly.encode()), ('BUILD_STATUS.json', os.path.join(ROOT, 'BUILD_STATUS.json'))]
b_entries += [(f'players/L04S0{n}_player_standalone.html', os.path.join(ROOT, f'sections/S0{n}/L04S0{n}_player_standalone.html')) for n in range(1, 8)]
write_zip('esssouth-L04-lesson-bundle.zip', 'esssouth-L04-lesson-bundle', b_entries)

for d, _, fs in os.walk(DIST):
    for f in sorted(fs):
        if f == 'MANIFEST.json' or '_bundle' in d: continue
        p = os.path.join(d, f); manifest['files'][os.path.relpath(p, DIST)] = {'bytes': os.path.getsize(p), 'sha256': hashlib.sha256(open(p, 'rb').read()).hexdigest()}
json.dump(manifest, open(os.path.join(DIST, 'MANIFEST.json'), 'w'), indent=1)
for k, v in manifest['files'].items(): print(f"{v['bytes']:>10}  {k}")
