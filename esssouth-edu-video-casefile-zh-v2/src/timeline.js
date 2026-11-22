// Builds the video timeline from the script and the measured voice clip lengths (src/durations.json).
// Shared by the Remotion composition and tools/render.mjs (SRT, line timeline), so they always agree.
export const FPS = 30;
// GAP：句与句之间的停顿；SCENE_GAP：换段时多停一下，让画面转场和观众换气；EXTRA：给需要看画面的段落留时间
const LEAD = 0.6, GAP = 0.4, SCENE_GAP = 0.35, EXTRA = { tool1: 0.9, finding1: 0.7, exhibitBC: 0.6, jurisdiction: 0.8, calendar: 2.2, tool2: 2.4, verdict: 2.6 };
export const plain = (s) => s.replace(/\[\[|\]\]/g, '');

// Caption segments: keep a whole sentence when it fits two lines (~62 chars), otherwise split at sentence
// or clause punctuation; each segment gets time in proportion to its length.
function segments(text, max = 62) {
  if (plain(text).length <= max) return [text];
  const parts = text.match(/[^.?!:,，。；：？！]+[.?!:,，。；：？！]?\s*/g) || [text], out = [];
  let buf = '';
  for (const p of parts) { if (buf && plain(buf + p).length > max) { out.push(buf.trim()); buf = p; } else buf += p; }
  if (buf.trim()) out.push(buf.trim());
  // keep [[highlight]] marks balanced when a split falls inside one
  for (let i = 0; i < out.length; i++) {
    const open = (out[i].match(/\[\[/g) || []).length, close = (out[i].match(/\]\]/g) || []).length;
    if (open > close && i + 1 < out.length) { out[i] += ']]'; out[i + 1] = '[[' + out[i + 1]; }
  }
  return out;
}

export function buildTimeline(script, durations) {
  let t = LEAD; const scenes = [], lines = [];
  script.scenes.forEach((sc, si) => {
    const start = t, ls = [];
    sc.lines.forEach((ln, li) => {
      const id = `S${String(si + 1).padStart(2, '0')}L${li + 1}`, d = durations[id];
      if (!d) throw new Error('missing voice clip ' + id);
      const segs = segments(ln.t, script.captionMax || 62), tot = segs.reduce((a, s) => a + plain(s).length, 0); let u = t;
      const segT = segs.map((s) => { const sd = d * plain(s).length / tot, o = { text: s, start: u, end: u + sd }; u += sd; return o; });
      const line = { id, scene: sc.id, kind: ln.kind, text: ln.t, start: t, end: t + d, segs: segT };
      ls.push(line); lines.push(line); t += d + GAP;
    });
    t += (EXTRA[sc.id] || 0) + SCENE_GAP;
    scenes.push({ ...sc, si, start, end: t, lines: ls });
  });
  return { scenes, lines, total: t + 0.4, GAP };
}
