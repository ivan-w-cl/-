#!/usr/bin/env node
// Deterministic export: every frame is rendered at t = i / 30 and piped to ffmpeg (1080×1920, 30 fps).
// Writes out/…-无配乐.mp4 (no audio track content: silence) and out/…-配乐.mp4 (with assets/bgm.wav), plus SRT and the line timeline.
// Usage: node tools/export.cjs   (Playwright + Chromium, ffmpeg)
const pw = require('playwright'), path = require('path'), fs = require('fs'), { spawn, execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'out'), FPS = 30, NAME = '综评到底多给了考生什么机会';
const srtT = s => { const ms = Math.round(s * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await pw.chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } }), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'video.html') + '?export=1'); await p.waitForTimeout(1200); await p.evaluate(() => document.fonts.ready);
  const info = await p.evaluate(() => ({ total: window.__video.TOTAL, srt: window.__video.srt(), lines: window.__video.lines() }));
  fs.writeFileSync(path.join(OUT, NAME + '.srt'), info.srt.map((c, i) => `${i + 1}\n${srtT(c.start)} --> ${srtT(c.end)}\n${c.text}\n`).join('\n'));
  fs.writeFileSync(path.join(OUT, '配音时间轴.json'), JSON.stringify({ note: '每行旁白的起止时间（秒）。录好配音后，把每行音频按行号命名（如 S01L1.wav）放进 voice/，运行 node tools/set-voice.cjs，再运行 node tools/export.cjs 重新对齐。', total: +info.total.toFixed(3), lines: info.lines }, null, 2));
  const frames = Math.round(info.total * FPS), silent = path.join(OUT, NAME + '-无配乐.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', silent]);
  const done = new Promise(r => ff.on('close', r)), t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    await p.evaluate(t => window.__video.render(t), i / FPS);
    if (i % 30 === 0) await p.waitForFunction(() => [...document.images].every(im => im.complete));
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 600 === 0) console.log(`frame ${i}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  }
  ff.stdin.end(); const code = await done; await b.close();
  const music = path.join(OUT, NAME + '-配乐.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', path.join(ROOT, 'assets', 'bgm.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', `afade=t=in:d=1.5,afade=t=out:st=${(info.total - 3).toFixed(2)}:d=3`, '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', music]);
  fs.writeFileSync(path.join(OUT, 'export.json'), JSON.stringify({ fps: FPS, frames, seconds: info.total, ffmpegExit: code, pageErrors: errs, renderSeconds: (Date.now() - t0) / 1000 }, null, 2));
  console.log('done', code, frames, 'frames', errs.length, 'errors');
})().catch(e => { console.error(e); process.exit(2); });
