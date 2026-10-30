/*
 * esssouth Lesson 07 · future-audio attachment hook. This review is SILENT: every slot in content/source/audio-slots.en.json
 * has path = null, so create() returns null and nothing is loaded, decoded or played.
 *
 * When narration exists (downstream pass): fill each slot's path (relative to the section folder), durationSeconds
 * (measured) and lang, e.g. with tools/attach-audio.mjs. Then:
 *  - profile(D) returns { voiceSec: { cueId: measuredSeconds } }: the compiler replaces the reading estimate with the
 *    measured clip; anchors keep their relative place in the line; holds, motion durations and branch order are unchanged.
 *  - create(D, C) returns a binder that starts the clip of the cue under the visual clock at the right offset, follows the
 *    same rate (preservesPitch = true) and is stopped by the player's single cancellation boundary (stop()). Audio never
 *    runs past a waiting gate: start(track, t, rate, limit) only schedules clips that begin before `limit`.
 * Missing or undecodable clips are listed in window.__l07audio.problems; they are never silently counted as attached.
 */
(function (global) {
  'use strict';
  function slotsWithAudio(D) { return Object.values((D.audioSlots && D.audioSlots.slots) || {}).filter((s) => s.path); }
  function profile(D) {
    const s = slotsWithAudio(D); if (!s.length) return null;
    const voiceSec = {}; s.forEach((x) => { if (x.durationSeconds != null) voiceSec[x.audioId] = +x.durationSeconds; });
    return { voiceSec, source: 'measured audio (' + (D.audioSlots.lang || 'en') + ')' };
  }
  function create(D) {
    const slots = slotsWithAudio(D); if (!slots.length) return null;
    const els = {}, problems = []; global.__l07audio = { problems, els };
    slots.forEach((s) => { const a = new Audio(); a.preload = 'auto'; a.src = s.path; a.preservesPitch = true; a.addEventListener('error', () => problems.push({ audioId: s.audioId, path: s.path, error: 'load/decode failed' })); els[s.audioId] = a; });
    let timers = [];
    return {
      start(track, t, rate, limit) {
        this.stop();
        track.lines.forEach((c) => { const a = els[c.cueId]; if (!a || c.start >= limit || c.speechEnd <= t) return;
          const begin = () => { a.playbackRate = rate; a.currentTime = Math.max(0, t - c.start); a.play().catch((e) => problems.push({ audioId: c.cueId, error: String(e) })); };
          if (c.start <= t) begin(); else timers.push(setTimeout(begin, (c.start - t) / rate * 1000)); });
      },
      stop() { timers.forEach(clearTimeout); timers = []; Object.values(els).forEach((a) => { if (!a.paused) a.pause(); }); }
    };
  }
  global.L07Audio = { profile, create };
})(window);
