/*
 * esssouth Lesson 08 · graph compiler (UMD: browser and Node). NEW for Lesson 08: it is the explicit adapter from the
 * supplied authoring graph (sections/SXX/content/source/sectionXX.en.json + timing.en.json + anchors.en.json) to the
 * linear tracks the accepted engine renders. The historical Lesson 02 compilers are not used.
 *
 *  - One authoritative graph drives both modes. Blocks are flattened in authored order; cue ids are never sorted.
 *  - A cue lasts voiceSec + tailSec. voiceSec comes from the supplied estimate (seconds − 0.35 s tail) unless a profile
 *    replaces it (retime fixture multipliers, or measured audio durations later). Holds are fixed seconds.
 *  - Anchors are phrase positions inside a cue: localSec = wordsBefore(phrase) / words(cue) × voiceSec. With the
 *    production profile this reproduces the supplied estimatedSeconds exactly; when a clip is longer, the anchor keeps
 *    its relative place in the sentence (semantic placement), while motion durations stay absolute (the engine's MOTION).
 *  - Routes: 'watch' (declared path: think hold + one branch), and in a section with a gate, one Practice route per
 *    option ('practice:A' …, or 'practice:model'), plus 'practice:skip'. Before the gate all routes are identical, so the
 *    player can move between them at the gate without a visual jump. Sections without a gate have 'practice:main' = the
 *    same steps as 'watch'.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.L08Compile = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const WORD = /[\p{L}\p{N}_]+(?:['’][\p{L}\p{N}_]+)*/gu;
  const words = (s) => (String(s).match(WORD) || []).length;
  const TAIL = 0.35, GATE_PRESENT = 1.2; // GATE_PRESENT: the choice prompt and neutral options rise before Practice waits

  // caption segments: the approved segmentation (shared/toolkit/estimate.js), spread by word weight over the voiced span
  function captionSegments(text, voiceSec, seg) {
    const parts = seg(text), w = parts.map((p) => Math.max(1, words(p))), tot = w.reduce((a, b) => a + b, 0); let t = 0;
    return parts.map((p, i) => { const s = t, e = t + voiceSec * (w[i] / tot); t = e; return { text: p, start: +s.toFixed(3), end: +e.toFixed(3) }; });
  }

  function cueTiming(graph, timing, profile) {
    const out = {}, P = profile || {}, mult = P.durationMultipliers || {}, measured = P.voiceSec || {};
    Object.keys(graph.cues).forEach((id) => {
      const est = timing.cues[id]; if (!est) throw new Error('timing: no estimate for ' + id);
      let v = +(est.seconds - TAIL).toFixed(3), source = 'estimated reading (' + timing.wordsPerMinute + ' wpm + ' + TAIL + ' s tail)';
      if (mult[id] != null) { v = +(v * mult[id]).toFixed(3); source = 'retime profile ×' + mult[id]; }
      if (measured[id] != null) { v = +measured[id]; source = 'measured clip'; }
      out[id] = { voiceSec: v, tailSec: TAIL, source };
    });
    return out;
  }

  // flatten the graph into route step lists ({ kind, id, branch })
  function routeSteps(graph) {
    const flat = []; graph.blocks.forEach((b) => b.steps.forEach((s) => flat.push(Object.assign({ block: b.id }, s))));
    const ints = flat.filter((s) => s.kind === 'interaction');
    if (ints.length > 1) throw new Error(graph.sectionId + ': more than one gate is not supported by this adapter');
    const I = ints.length ? graph.interactions[ints[0].id] : null;
    const R = {};
    if (!I) { R.watch = flat.map((s) => ({ kind: s.kind, id: s.id, block: s.block })); R['practice:main'] = R.watch; return { routes: R, gate: null }; }
    const gi = flat.findIndex((s) => s.kind === 'interaction'), pre = flat.slice(0, gi), post = flat.slice(gi + 1);
    if (!post.length || post[0].id !== I.rejoinCue) throw new Error(graph.sectionId + ': rejoin cue ' + I.rejoinCue + ' is not the step after the gate');
    const blk = flat[gi].block, P = (a) => a.map((s) => ({ kind: s.kind, id: s.id, block: s.block }));
    const options = I.kind === 'choice' ? I.options.map((o) => ({ key: o.id, label: o.label, events: o.events })) : [{ key: 'model', label: null, events: I.model }];
    const watchKey = I.kind === 'choice' ? I.watchChoice : 'model';
    const ev = (o) => o.events.map((e) => ({ kind: e.kind, id: e.id, block: blk, branch: o.key }));
    const wo = options.find((o) => o.key === watchKey);
    R.watch = [].concat(P(pre), [{ kind: 'think', id: I.id + '.watchThink', block: blk, seconds: I.watchThinkSeconds, gate: I.id }], ev(wo), P(post));
    options.forEach((o) => { R['practice:' + o.key] = [].concat(P(pre), [{ kind: 'gate', id: I.id + '.gate', block: blk, gate: I.id }], ev(o), [{ kind: 'ready', id: I.id + '.ready', block: blk, gate: I.id, branch: o.key }], P(post)); });
    R['practice:skip'] = [].concat(P(pre), [{ kind: 'gate', id: I.id + '.gate', block: blk, gate: I.id }, { kind: 'skip', id: I.id + '.skip', block: blk, gate: I.id }], P(post));
    return { routes: R, gate: { id: I.id, kind: I.kind, interaction: I, options, watchKey } };
  }

  function compile(input, opts) {
    opts = opts || {};
    const graph = input.graph, seg = opts.segments, profile = opts.profile || null;
    const ct = cueTiming(graph, input.timing, profile);
    const holdSec = (id) => { const h = graph.holds[id]; if (!h) throw new Error('unknown hold ' + id); return profile && profile.fixedHolds && profile.fixedHolds[id] != null ? profile.fixedHolds[id] : h.seconds; };
    const text = (id) => (opts.cueText ? opts.cueText(id) : graph.cues[id].text);
    // anchors: supplied semantic anchors (one per cue) + section staging anchors, both phrase-based
    const A = {};
    Object.entries(input.anchors.anchors).forEach(([n, a]) => (A[n] = { cue: a.cueId, phrase: a.phrase, supplied: a.estimatedSeconds, source: 'supplied semantic anchor' }));
    Object.entries((input.staging && input.staging.anchors) || {}).forEach(([n, a]) => { if (A[n]) throw new Error('duplicate anchor ' + n); A[n] = Object.assign({ source: 'staging anchor' }, a); });
    const localOf = (name) => {
      const a = A[name]; if (!a) throw new Error('unknown anchor ' + name); const c = graph.cues[a.cue]; if (!c) throw new Error('anchor ' + name + ': unknown cue ' + a.cue);
      const v = ct[a.cue].voiceSec, src = graph.cues[a.cue].text; // anchors are placed in the authoritative English line
      if (a.frac != null) return a.frac * v;
      const i = src.indexOf(a.phrase); if (i < 0) throw new Error('anchor ' + name + ': phrase not in ' + a.cue);
      const before = words(src.slice(0, i)) + (a.end ? words(a.phrase) : 0), est = input.timing.cues[a.cue];
      // the supplied reading rate (wordsBefore × 60 / wpm, as in anchors.en.json), scaled with the clip when a profile
      // lengthens it; capped inside the voiced span
      return Math.min(v, before * 60 / input.timing.wordsPerMinute * (v / (est.seconds - TAIL)));
    };
    const { routes, gate } = routeSteps(graph);
    const tracks = {};
    Object.entries(routes).forEach(([key, list]) => {
      if (tracks[key]) return; let t = 0; const byId = {}, lines = [], captionCues = {}, steps = [];
      list.forEach((st) => {
        let dur, voice = null, speakerId = null;
        if (st.kind === 'line') { const c = graph.cues[st.id]; if (!c) throw new Error(key + ': unknown cue ' + st.id); voice = ct[st.id].voiceSec; dur = voice + ct[st.id].tailSec; speakerId = c.speaker; }
        else if (st.kind === 'hold') dur = holdSec(st.id);
        else if (st.kind === 'think') dur = st.seconds;
        else if (st.kind === 'gate') dur = GATE_PRESENT;
        else dur = 0; // ready / skip markers
        const s = Object.assign({}, st, { cueId: st.id, start: t, end: t + dur, dur, gapBefore: 0, speechEnd: voice != null ? t + voice : t + dur, voiceSec: voice, speakerId, common: !st.branch && !['think', 'gate', 'ready', 'skip'].includes(st.kind) });
        if (byId[st.id]) throw new Error(key + ': step ' + st.id + ' occurs twice');
        byId[st.id] = s; steps.push(s); t = s.end;
        if (st.kind === 'line') { lines.push(s); captionCues[st.id] = { id: st.id, start: s.start, speakerId, segments: captionSegments(text(st.id), voice, seg) }; }
      });
      const tr = { key, steps, byId, lines, captionCues, duration: t, gate };
      tr.cue = (id) => { if (!byId[id]) throw new Error(key + ': ' + id + ' not in this route'); return byId[id]; };
      tr.has = (id) => !!byId[id];
      tr.local = localOf;
      tr.at = (name) => { const a = A[name]; if (!a) throw new Error('unknown anchor ' + name); return tr.cue(a.cue).start + localOf(name); };
      tr.hasAnchor = (name) => !!A[name] && !!byId[A[name].cue];
      tr.stepAt = (x) => { for (let i = steps.length - 1; i >= 0; i--) if (x >= steps[i].start && (x < steps[i].end || i === steps.length - 1 || steps[i].dur === 0 && x === steps[i].start)) return steps[i]; return steps[0]; };
      if (gate) { const g = steps.find((s) => s.kind === 'gate' || s.kind === 'think'); tr.gateStep = g; const br = steps.filter((s) => s.branch); tr.branchStart = br.length ? br[0].start : null; tr.branchEnd = br.length ? br[br.length - 1].end : null; tr.readyStep = steps.find((s) => s.kind === 'ready') || null; }
      tracks[key] = tr;
    });
    const anchorList = Object.entries(A).map(([name, a]) => ({ name, cue: a.cue, phrase: a.phrase, localSec: +localOf(name).toFixed(3), suppliedSec: a.supplied != null ? a.supplied : null, source: a.source }));
    return { tracks, gate, cueTiming: ct, anchors: anchorList, holdSec, words };
  }

  // the common section position of route time x (the skip/main route is the common timeline: no branch, gate as a point)
  function commonTime(C, route, x) {
    const common = C.tracks[C.gate ? 'practice:skip' : 'practice:main'], s = route.stepAt(x);
    if (common.has(s.id) && s.common) return common.cue(s.id).start + Math.min(x - s.start, s.dur);
    if (C.gate) return common.gateStep.end; // inside the gate, a branch or the think hold: the gate's common position
    return x;
  }
  return { compile, commonTime, words, TAIL, GATE_PRESENT };
});
