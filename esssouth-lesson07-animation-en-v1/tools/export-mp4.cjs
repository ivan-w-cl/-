#!/usr/bin/env node
// esssouth Lesson 07 · deterministic silent Watch export: every frame is rendered by the player at t = i / 30 (no screen
// recording) and piped to ffmpeg. No audio stream is written. Also writes the SRT of the same compiled Watch route.
// Usage: node tools/export-mp4.cjs S01 [outDir=dist/video]   (needs Playwright + Chromium and ffmpeg on PATH or FFMPEG)
const pw = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); const path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..'), SEC = process.argv[2], OUT = path.resolve(process.argv[3] || path.join(ROOT, 'dist', 'video')), FPS = 30;
const srtTime = (s) => { const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, ss = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
(async () => {
  fs.mkdirSync(OUT, { recursive: true }); const n = SEC.slice(1), base = path.join(OUT, `esssouth-L07S${n}-watch-SILENT`);
  const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'sections', SEC, 'index.html') + '?export=1'); await p.waitForFunction(() => document.body.dataset.ready);
  const info = await p.evaluate(() => { const tr = window.__l07.C.tracks.watch; const names = { coach: 'Coach', learner: 'You', noah: 'Noah', maya: 'Maya' };
    return { dur: tr.duration, cues: Object.values(tr.captionCues).sort((a, b) => a.start - b.start).flatMap((c) => c.segments.map((s) => ({ a: c.start + s.start, b: c.start + s.end, who: names[c.speakerId], text: s.text, id: c.id }))) }; });
  // SRT from the same compiled Watch route (one entry per caption segment, speaker named)
  fs.writeFileSync(base + '.srt', info.cues.map((c, i) => `${i + 1}\n${srtTime(c.a)} --> ${srtTime(c.b)}\n${c.who}: ${c.text}\n`).join('\n'));
  const frames = Math.round(info.dur * FPS);
  const ff = spawn(process.env.FFMPEG || 'ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', base + '.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((r) => ff.on('close', r)); const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    await p.evaluate((t) => window.__l07.renderAt(t, 'watch'), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 900 === 0) process.stdout.write(`${SEC} frame ${i}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)} s)\n`);
  }
  ff.stdin.end(); const code = await done; await b.close();
  fs.writeFileSync(base + '.export.json', JSON.stringify({ section: SEC, route: 'watch', fps: FPS, frames, compiledSeconds: info.dur, ffmpegExit: code, pageErrors: errs, renderSeconds: (Date.now() - t0) / 1000, method: 'deterministic renderAt(i/30) + Chromium screenshot (JPEG q92) → ffmpeg libx264 crf 20, no audio stream' }, null, 1));
  console.log(SEC, 'done', code, frames, 'frames');
})().catch((e) => { console.error(e); process.exit(2); });
