// Renders the English explainer with Remotion: out/…-music.mp4 (voice + music), out/…-no-music.mp4 (voice only),
// the SRT and the line timeline. Optional: `node tools/render.mjs stills` renders check frames only.
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler'; import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { buildTimeline, FPS, plain } from '../src/timeline.js';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), OUT = path.join(ROOT, 'out');
const BROWSER = process.env.BROWSER || '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const NAME = 'Case-File-does-the-interview-change-anything';
fs.mkdirSync(OUT, { recursive: true });
const script = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/script.json'), 'utf8'));
const durations = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/durations.json'), 'utf8'));
const TL = buildTimeline(script, durations);
const srtT = (s) => { const ms = Math.round(s * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
fs.writeFileSync(path.join(OUT, NAME + '.srt'), TL.lines.flatMap((l) => l.segs).map((s, i) => `${i + 1}\n${srtT(s.start)} --> ${srtT(s.end)}\n${plain(s.text)}\n`).join('\n'));
fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify({ total: +TL.total.toFixed(3), lines: TL.lines.map((l) => ({ id: l.id, scene: l.scene, kind: l.kind, start: +l.start.toFixed(3), end: +l.end.toFixed(3), text: plain(l.text) })) }, null, 2));
const serveUrl = await bundle({ entryPoint: path.join(ROOT, 'src/index.ts') });
const common = { serveUrl, browserExecutable: BROWSER, chromiumOptions: { gl: 'swangle' } };
if (process.argv[2] === 'stills') {
  const comp = await selectComposition({ ...common, id: 'CaseFileEN', inputProps: { music: true, voice: true } });
  fs.mkdirSync(path.join(OUT, 'stills'), { recursive: true });
  for (const sc of TL.scenes) {
    const t = sc.lines[sc.lines.length - 1].end - 0.2;
    await renderStill({ ...common, composition: comp, frame: Math.round(t * FPS), output: path.join(OUT, 'stills', `${String(sc.si + 1).padStart(2, '0')}-${sc.id}.png`), inputProps: { music: true, voice: true } });
  }
  console.log('stills done', TL.scenes.length); process.exit(0);
}
for (const [suffix, props] of [['music', { music: true, voice: true }], ['no-music', { music: false, voice: true }]]) {
  const comp = await selectComposition({ ...common, id: 'CaseFileEN', inputProps: props });
  let last = 0;
  await renderMedia({ ...common, composition: comp, codec: 'h264', crf: 19, audioCodec: 'aac', inputProps: props, outputLocation: path.join(OUT, `${NAME}-${suffix}.mp4`), concurrency: 3,
    onProgress: ({ progress }) => { if (progress - last > 0.1) { last = progress; console.log(suffix, Math.round(progress * 100) + '%'); } } });
  console.log('rendered', suffix);
}
