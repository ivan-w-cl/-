/*
 * esssouth animation style · timing estimate for a SILENT build (browser and Node).
 * The caption segmentation below is copied unchanged from the approved build's tools/text-segments.mjs.
 * estimate(script) applies the approved reading profile: voiceSec = max(3, words × 60 / 145), captions and sentence spans
 * spread by word weight over [lead 0.2 s, voiceSec − settle 0.15 s], 0.25 s tail after every line, no gap before a line,
 * holds fixed in seconds. Everything it produces is an ESTIMATE until real narration replaces voiceSec.
 *
 * script = { blocks: [{ id, steps: [{ id, speaker, text } | { id, hold: seconds }] }] }
 * returns { content, timing } in the formats timeline.js compiles.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EsssouthStyleEstimate = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // Caption segmentation shared by tools/estimate-timing.mjs (English) and tools/build.mjs --locale (any language).
  // Captions are clause segments of the cue text: sentences; a sentence over 80 characters splits after a comma near the
  // middle, else before a joining word (English list below; other languages fall back to commas, then to the word middle).
  // Segment times are spread by word (or, for unspaced scripts, character) weight over [lead, voiceSec − settle].
  // This is a starting point for a localized build, not a substitute for timing captions against the real recording.
  const words = (s) => { const w = s.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []; return /\s/.test(s.trim()) ? w.length : Math.max(1, Math.round(s.length / 2)); };
  const sentences = (s) => (s.match(/[^.?!:;。？！：；]+(?:[.?!:;。？！：；]+["'”’」]?|$)\s*/g) || [s]).map((x) => x.trim()).filter(Boolean);
  const JOIN = /^(because|and|or|but|so|than|while|without)$/;
  function segments(text) {
    const out = [];
    sentences(text).forEach((s) => {
      const prev = out[out.length - 1];
      if (prev && (words(prev) <= 2 || /[:;]$/.test(prev)) && words(prev) + words(s) <= 14 && (prev + ' ' + s).length <= 80) { out[out.length - 1] += ' ' + s; return; }
      if (s.length > 80) {
        const ws = s.split(' '), mid = ws.length / 2, near = (a, b) => a < 0 || Math.abs(b - mid) < Math.abs(a - mid);
        let best = -1; ws.forEach((w, i) => { if (/[,，、]$/.test(w) && i >= 3 && i < ws.length - 4 && near(best, i)) best = i; });
        if (best < 0) ws.forEach((w, i) => { if (i > 2 && i < ws.length - 2 && JOIN.test(ws[i + 1] || '') && near(best, i)) best = i; });
        if (best < 0 && s.length <= 110) { out.push(s); return; } // fits two caption lines; no clean clause boundary
        if (ws.length < 2) { out.push(s); return; } // unspaced script: keep the sentence; the caption bar wraps it
        if (best < 0) best = Math.floor(mid);
        out.push(ws.slice(0, best + 1).join(' ')); out.push(ws.slice(best + 1).join(' '));
      } else out.push(s);
    });
    return out;
  }
  function spread(parts, a, b) { const w = parts.map(words), tot = w.reduce((x, y) => x + y, 0); let t = a; return parts.map((p, i) => { const s = t, e = t + (b - a) * (w[i] / tot); t = e; return { text: p, start: +s.toFixed(3), end: +e.toFixed(3) }; }); }

  const PROFILE = { wordsPerMinute: 145, minSec: 3, leadSec: 0.2, settleSec: 0.15, tailSec: 0.25 };
  function estimate(script, profile) {
    const P = Object.assign({}, PROFILE, profile || {}), cues = [], tcues = {}, holds = {}, blocks = [];
    script.blocks.forEach((b) => { const steps = [];
      b.steps.forEach((s) => {
        if (s.hold != null) { holds[s.id] = { seconds: s.hold, source: 'authored fixed hold' }; steps.push({ id: s.id, kind: 'hold' }); return; }
        const n = words(s.text), voiceSec = +Math.max(P.minSec, n * 60 / P.wordsPerMinute).toFixed(3);
        cues.push({ id: s.id, speaker: s.speaker, text: s.text, audioId: s.id });
        tcues[s.id] = { speaker: s.speaker, words: n, voiceSec, source: 'estimated reading profile (' + P.wordsPerMinute + ' wpm, minimum ' + P.minSec + ' s)', readHoldSec: 0,
          sentences: spread(sentences(s.text), P.leadSec, voiceSec - P.settleSec).map(({ start, end }) => ({ start, end })), captions: spread(segments(s.text), P.leadSec, voiceSec - P.settleSec) };
        steps.push({ id: s.id, kind: 'line' }); });
      blocks.push({ id: b.id, steps }); });
    const timing = { model: { wordsPerMinute: P.wordsPerMinute, leadSec: P.leadSec, settleSec: P.settleSec, tailSec: P.tailSec }, gaps: { default: 0, hold: 0, byCue: {} }, holds, cues: tcues };
    return { content: { cues, sections: [{ blocks }] }, timing };
  }
  return { estimate, words, sentences, segments, spread, PROFILE };
});