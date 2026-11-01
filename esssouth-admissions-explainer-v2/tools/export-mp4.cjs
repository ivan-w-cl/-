#!/usr/bin/env node
// Deterministic silent export: every frame is rendered by the page at t = i / FPS (no screen recording) and piped to ffmpeg.
// Captions are burned into the picture; an SRT of the same timeline is written next to the MP4. No audio stream.
// Usage: node tools/export-mp4.cjs <xjtlu|cuhksz|silc> <js|gd|all> [fps=25]
const pw = require('playwright'), path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..'), [SCHOOL, PROV, FPSARG] = process.argv.slice(2), FPS = +(FPSARG || 25);
const NAMES = { xjtlu: '西浦', cuhksz: '港中深', silc: '上悉4+0' }, PN = { js: '江苏', gd: '广东', all: '全国' };
const srtTime = s => { const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, ss = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
(async () => {
  const OUT = path.join(ROOT, 'video'); fs.mkdirSync(OUT, { recursive: true });
  const base = path.join(OUT, `${NAMES[SCHOOL]}-${PN[PROV]}-考情与流程解析`);
  const b = await pw.chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } }), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'index.html') + `?export=1&school=${SCHOOL}&prov=${PROV}`);
  await p.waitForFunction(() => window.__explainer && document.fonts.status === 'loaded');
  const info = await p.evaluate(() => { const T = window.__explainer.timeline(); return { dur: T.duration, cues: T.items.flatMap(it => it.segs.map(g => ({ a: it.start + g.start, b: it.start + g.start + g.dur, who: g.who === 'coach' ? '讲解' : CAST.find(c => c.id === g.who).name, text: g.text }))) }; });
  fs.writeFileSync(base + '.srt', info.cues.map((c, i) => `${i + 1}\n${srtTime(c.a)} --> ${srtTime(c.b)}\n${c.who}：${c.text}\n`).join('\n'));
  const frames = Math.round(info.dur * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', base + '.mp4']);
  const done = new Promise(r => ff.on('close', r)), t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    await p.evaluate(t => window.__explainer.render(t), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 1500 === 0) console.log(`${SCHOOL}-${PROV} frame ${i}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  }
  ff.stdin.end(); const code = await done; await b.close();
  fs.writeFileSync(base + '.export.json', JSON.stringify({ school: SCHOOL, prov: PROV, fps: FPS, frames, seconds: info.dur, ffmpegExit: code, pageErrors: errs, renderSeconds: (Date.now() - t0) / 1000 }, null, 2));
  console.log(SCHOOL, PROV, 'done', code, frames, 'frames', errs.length, 'errors');
})().catch(e => { console.error(e); process.exit(2); });
