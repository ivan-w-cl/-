/*
 * esssouth Lesson 07 · scene kit. Thin Lesson 07 layer over the approved recipes (shared/toolkit/recipes.js): every motion
 * still uses the approved helpers and MOTION durations. What is new here is only bookkeeping for the L07 graph:
 *  - base(E, ctx): chrome tokens first (kicker, title), the section's content tokens, then (finishTokens) the gate option
 *    cards, the hold UI and the speech bubble on top, in the approved stacking order;
 *  - helpers(E, S, tr, ctx): the approved recipe helpers bound to one route, plus cue/anchor lookups by short id,
 *    a speaker-aware bubble (say), a character-line wrapper (line), the gate presentation (gate) and clearAll.
 * Deliberate extension (recorded in STYLE_PROVENANCE.md): the bubble tail points at the speaking seat for Maya and Noah
 * (CSS .spk-maya / .spk-noah); the approved build only had "You" speaking in the side layout.
 */
(function (global) {
  'use strict';
  function base(E, ctx) {
    const Rx = ctx.Rx, R = Rx.R, L = E.label, DEF = { room: { s: Rx.ROOM.full.s, x: Rx.ROOM.full.x, y: Rx.ROOM.full.y, o: 0 } };
    const GG = Object.assign({}, Rx.GEO);
    const T0 = (r, kind, text, slot, extra) => Object.assign({ x: r.x, y: r.y, w: r.w, h: r.h, fs: r.fs, rot: 0, o: 0, act: 0, lt: 0, who: 0, hl: 0, kind, text, slot, tag: '', spk: 'learner' }, extra || {});
    const tok = (id, r, kind, text, slot, extra, letter) => { E.token(id, letter); DEF[id] = T0(r, kind, text, slot, extra); return id; };
    tok('kick', GG.kick, 'kicker', '', 'token.kicker'); tok('ttl', GG.ttl, 'q title', '', 'token.title');
    const K = { DEF, tok, GG, L, R, Rx };
    K.finishTokens = function (opts) {
      opts = opts || {}; const gate = ctx.C.gate;
      if (gate && gate.kind === 'choice') gate.options.forEach((o, i) => tok('opt.' + o.key, (opts.optRects || K.optRects)[i], 'option', L('gate.option.' + o.key), 'token.option', { lt: 1 }, o.key));
      tok('holdTxt', GG.holdTxt, 'hint hold', '', 'token.hold'); tok('holdBar', Object.assign({}, GG.holdBar, { w: 0 }), 'bar', '', 'token.default'); tok('holdHint', GG.holdHint, 'hint', L('ui.pauseMore'), 'token.hint');
      tok('bubL', GG.bubWide, 'bubble', '', 'token.quote', { who: 1, spk: 'learner' });
    };
    K.optRects = [R(150, 470, 1620, 104, 30), R(150, 594, 1620, 104, 30), R(150, 718, 1620, 104, 30)];
    return K;
  }

  function helpers(E, S, tr, ctx) {
    const Rx = ctx.Rx, MOTION = Rx.MOTION, D = ctx.D, L = E.label, markup = global.EsssouthStyleEngine.markup, P = D.sectionId + '.';
    const GG = Object.assign({}, Rx.GEO, ctx.scene.G || {});
    Rx.helpers(E, S, { G: GG, L, Q: E.cueText, markup, FRAMES: ctx.scene.FRAMES, HEAD: ctx.scene.HEAD, IMAGINED: ctx.scene.IMAGINED });
    const X = { S, tr, L, MOTION, R: Rx.R, WAIT: Rx.WAIT, GG, neutral: Rx.neutral, speak: Rx.speak, dline: Rx.dline, head: Rx.head };
    X.id = (s) => (s.indexOf('.') >= 0 && s.startsWith('L07') ? s : P + s);
    X.has = (s) => tr.has(X.id(s));
    X.cue = (s) => tr.cue(X.id(s));
    X.X0 = (s) => X.cue(s).start;
    X.end = (s) => X.cue(s).end;
    X.sp = (s) => X.cue(s).speechEnd;
    X.at = (n) => tr.at(n);
    X.a = (s) => tr.at('a_' + X.id(s).replace(/\./g, '_')); // the supplied semantic anchor of a cue
    X.stepsOf = (block) => tr.steps.filter((s) => s.block === X.id(block));
    // speaker-aware bubble: exact cue text, key phrases blue 0.1 s after it rises (the approved say(), plus the speaker)
    X.say = (c, hls, wait, rectOverride) => { // rectOverride: a taller bubble for an unusually long line (same width, style and tail)
      const spk = c.speakerId;
      // the approved .bubble rule caps the visible bubble at 760 px; Noah's bubble is placed so his seat (stage x 874) lies over
      // it and the tail can reach him (Lesson 07 fix: in L03/L04 the Noah tail could sit beyond the 760 px edge)
      const base = rectOverride || (spk === 'noah' ? Object.assign({}, GG.bubWide, { x: 274, w: 760 }) : GG.bubWide);
      const s = c.start + (wait || 0), rect = base, extra = (rectOverride && rectOverride.cls) ? ' ' + rectOverride.cls : '';
      if (S.vis.has('bubL')) S.put('bubL', c.start - 0.1, MOTION.focus, { o: 0, hl: 0 }); // the previous speaker's words leave as this line starts
      S.set('bubL', s - 0.16, 0, Object.assign({}, rect, { text: markup(E.cueText(c.cueId), hls || []), hl: 0, y: rect.y + 12, o: 0, spk, kind: 'bubble spk-' + spk + extra, slot: (rectOverride && rectOverride.slot) || 'token.quote' }));
      S.put('bubL', s - 0.15, MOTION.rise, { y: rect.y, o: 1 }); S.put('bubL', s + 0.1, MOTION.focus, { hl: 1 });
    };
    // a character line in the side layout: room in (once), speaker pose and listeners, bubble after the room settles
    X.line = (id, pose, hls, opts) => {
      opts = opts || {}; const c = X.cue(id), x0 = c.start; let wait;
      if (S.roomMode !== 'side') { S.roomTo(x0 + 0.2, 'side'); Rx.neutral(S, x0); wait = Rx.WAIT + (opts.headFirst ? 0.2 : 0); } else wait = 0.35;
      X.say(c, hls, wait, opts.bubble); Rx.speak(S, c, pose, c.speakerId); return c;
    };
    X.roomOut = (t) => { S.roomTo(t, 'off'); S.hide(['bubL'], t); };
    X.hold = (id, label) => { const H = X.cue(id); S.hold(H, label || L('hold.' + H.id)); return H; };
    X.clearAll = (t, keep) => { const k = new Set(['kick', 'ttl'].concat(keep || [])); S.hide([...S.vis].filter((id) => !k.has(id) && id !== 'room'), t); };
    // the gate presentation, the same in every route up to the gate end: prompt + hint in the caption band, neutral options
    X.gate = (opts) => {
      opts = opts || {}; const g = tr.gateStep; if (!g) return null; const G = ctx.C.gate, t = g.start, think = g.kind === 'think';
      const hintKey = G.kind === 'choice' ? (think ? 'ui.thinkHint' : 'ui.gateHint') : (think ? 'ui.thinkHint' : 'ui.rehearseHint');
      S.rise('holdTxt', t + 0.05, GG.holdTxt, { text: L('gate.prompt') });
      S.set('holdHint', t + 0.1, 0, { text: L(hintKey) }); S.rise('holdHint', t + 0.2, GG.holdHint);
      if (think) { S.set('holdBar', t + 0.05, 0, Object.assign({}, GG.holdBar, { w: 0, o: 1 })); S.vis.add('holdBar'); S.put('holdBar', t + 0.1, g.dur - 0.4, { w: GG.holdBar.w }); }
      const ids = G.kind === 'choice' ? G.options.map((o) => 'opt.' + o.key) : [];
      ids.forEach((id, i) => S.rise(id, t + 0.25 + i * 0.15, (opts.optRects || ctx.scene.optRects)[i]));
      if (think && G.kind === 'choice') S.put('opt.' + G.watchKey, g.end - 0.9, MOTION.morph, { kind: 'option sel', act: 1 });
      // leaving the gate (watch: after thinking; practice: when the branch or the common route starts)
      S.hide(['holdTxt', 'holdBar', 'holdHint'], g.end, 0.2);
      return { start: t, end: g.end, ids };
    };
    return X;
  }
  global.L07Kit = { base, helpers };
})(window);
