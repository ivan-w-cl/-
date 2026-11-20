// Builds the video timeline from the script and the measured voice clip lengths (src/durations.json).
// Shared by the Remotion composition and tools/render.mjs (SRT, line timeline), so they always agree.
export const FPS = 30;
const LEAD = 0.6, GAP = 0.32, EXTRA = { calc: 0.8, drill: 2.6, end: 2.2 };
export const plain = (s) => s.replace(/\[\[|\]\]/g, '');

// Caption segments: keep a whole sentence when it fits two lines (~62 chars), otherwise split at sentence
// or clause punctuation; each segment gets time in proportion to its length.
function segments(text) {
  if (plain(text).length <= 62) return [text];
  const parts = text.match(/[^.?!:,]+[.?!:,]?\s*/g) || [text], out = [];
  let buf = '';
  for (const p of parts) { if (buf && plain(buf + p).length > 62) { out.push(buf.trim()); buf = p; } else buf += p; }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

export function buildTimeline(script, durations) {
  let t = LEAD; const scenes = [], lines = [];
  script.scenes.forEach((sc, si) => {
    const start = t, ls = [];
    sc.lines.forEach((ln, li) => {
      const id = `S${String(si + 1).padStart(2, '0')}L${li + 1}`, d = durations[id];
      if (!d) throw new Error('missing voice clip ' + id);
      const segs = segments(ln.t), tot = segs.reduce((a, s) => a + plain(s).length, 0); let u = t;
      const segT = segs.map((s) => { const sd = d * plain(s).length / tot, o = { text: s, start: u, end: u + sd }; u += sd; return o; });
      const line = { id, scene: sc.id, kind: ln.kind, text: ln.t, start: t, end: t + d, segs: segT };
      ls.push(line); lines.push(line); t += d + GAP;
    });
    t += EXTRA[sc.id] || 0;
    scenes.push({ ...sc, si, start, end: t, lines: ls });
  });
  return { scenes, lines, total: t + 0.4, GAP };
}
