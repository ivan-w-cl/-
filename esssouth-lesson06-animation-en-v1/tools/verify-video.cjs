#!/usr/bin/env node
// esssouth Lesson 06 · verify the exported silent Watch MP4s: stream list (no audio), codec, 1920×1080, 30 fps, frame count
// and duration vs the compiled route, a full decode, and first / middle / end frames compared with a direct player render.
// Usage: node tools/verify-video.cjs [S01 …]   → qa/video/verify.json + qa/video/*.jpg
const pw = require(process.env.PLAYWRIGHT_MODULE || 'playwright'); const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..'), V = path.join(ROOT, 'dist/video'), OUT = path.join(ROOT, 'qa/video'); fs.mkdirSync(OUT, { recursive: true });
const secs = process.argv.slice(2).length ? process.argv.slice(2) : ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07'];
const FF = process.env.FFMPEG || 'ffmpeg', FP = process.env.FFPROBE || 'ffprobe';
(async () => {
  const b = await pw.chromium.launch(); const res = { ranAt: new Date().toISOString(), method: 'ffprobe streams + full decode (ffmpeg -f null) + PSNR of decoded frames vs a direct 1920×1080 player render at the same t', sections: {} };
  for (const S of secs) {
    const n = S.slice(1), f = path.join(V, `esssouth-L06S${n}-watch-SILENT.mp4`), r = { file: path.relative(ROOT, f) };
    if (!fs.existsSync(f)) { r.status = 'not exported'; res.sections[S] = r; continue; }
    const probe = JSON.parse(execFileSync(FP, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', f]).toString());
    r.streams = probe.streams.map((s) => ({ type: s.codec_type, codec: s.codec_name, w: s.width, h: s.height, fps: s.r_frame_rate, frames: +s.nb_frames }));
    r.durationSeconds = +probe.format.duration; r.bytes = +probe.format.size;
    try { execFileSync(FF, ['-v', 'error', '-i', f, '-f', 'null', '-']); r.fullDecode = 'ok'; } catch (e) { r.fullDecode = 'FAILED ' + e.message; }
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); await p.goto('file://' + path.join(ROOT, 'sections', S, 'index.html') + '?export=1'); await p.waitForFunction(() => document.body.dataset.ready);
    const dur = await p.evaluate(() => window.__l06.C.tracks.watch.duration); r.compiledSeconds = dur;
    const frames = r.streams[0].frames; r.samples = [];
    for (const [name, i] of [['first', 0], ['middle', Math.floor(frames / 2)], ['end', frames - 1]]) {
      const t = i / 30, vid = path.join(OUT, `${S}_${name}_video.png`), ref = path.join(OUT, `${S}_${name}_render.png`);
      execFileSync(FF, ['-v', 'error', '-y', '-i', f, '-vf', `select=eq(n\\,${i})`, '-vsync', '0', '-frames:v', '1', vid]);
      await p.evaluate((t) => window.__l06.renderAt(t, 'watch'), t); await p.screenshot({ path: ref });
      let psnr = null; try { const o = execFileSync(FF, ['-v', 'info', '-i', vid, '-i', ref, '-lavfi', 'psnr', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) {}
      const log = require('child_process').spawnSync(FF, ['-i', vid, '-i', ref, '-lavfi', 'psnr', '-f', 'null', '-']).stderr.toString(); const m = log.match(/average:([\d.inf]+)/); psnr = m ? m[1] : null;
      r.samples.push({ name, frame: i, t: +t.toFixed(3), psnrVsRender: psnr });
      // keep small JPEG copies for review, drop the large PNGs
      execFileSync(FF, ['-v', 'error', '-y', '-i', vid, '-vf', 'scale=960:-1', path.join(OUT, `${S}_${name}_video.jpg`)]); fs.unlinkSync(vid); fs.unlinkSync(ref);
    }
    await p.close();
    const v = r.streams.find((s) => s.type === 'video');
    r.pass = r.streams.length === 1 && !r.streams.some((s) => s.type === 'audio') && v.codec === 'h264' && v.w === 1920 && v.h === 1080 && v.fps === '30/1' && Math.abs(v.frames - Math.round(dur * 30)) <= 1 && r.fullDecode === 'ok' && r.samples.every((s) => s.psnrVsRender === 'inf' || +s.psnrVsRender > 30);
    res.sections[S] = r; console.log(S, r.pass ? 'PASS' : 'CHECK', JSON.stringify({ frames: v.frames, dur: r.durationSeconds, compiled: dur, psnr: r.samples.map((s) => s.psnrVsRender) }));
  }
  await b.close(); fs.writeFileSync(path.join(OUT, 'verify.json'), JSON.stringify(res, null, 1));
})().catch((e) => { console.error(e); process.exit(2); });
