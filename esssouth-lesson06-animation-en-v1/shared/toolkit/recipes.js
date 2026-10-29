/*
 * esssouth animation style · reusable motion recipes.
 * Extracted from the approved Lesson 02 · Section 05 choreography (reference-media/approved-s05-source/l02s05-scenes.js,
 * function helpers() and the constants above it). The bodies are kept as they were approved; only the lesson-specific
 * geometry (G, FRAMES, HEAD, IMAGINED) became parameters, and speak() takes the speaker as an argument.
 *
 * Rules these recipes enforce (do not edit them per lesson; see references/MOTION_RECIPES.md):
 *  - every movement lasts a MOTION duration; lessons choose only WHEN (cue starts and named anchors);
 *  - a drawn/faded layer item keeps its FIRST reveal (S.revL), so showing a layer again never hides a connector;
 *  - a labelled frame or quote heading arrives first and leaves last (frameTo/frameOff, claimTo/claimOff);
 *  - the speech bubble waits for the room's layout move (say(..., WAIT)).
 */
(function (global) {
  'use strict';
  const MOTION = { travel: 0.75, cut: 0.3, enter: 0.4, rise: 0.45, focus: 0.25, draw: 0.6, layout: 0.8, morph: 0.5, link: 0.5, pulse: 0.8 };
  const FULL = { s: 0.8, x: 192, y: 150 }, SIDE = { s: 0.56, x: 40, y: 250 }, ROOM = { full: FULL, side: SIDE };
  const R = (x, y, w, h, fs) => (fs == null ? { x, y, w, h } : { x, y, w, h, fs });
  const WAIT = MOTION.travel + 0.15; // a bubble enters after the room has finished sliding to the side layout

  // Style geometry shared by every scene (1920 × 1080 stage). Lesson rects are chosen inside these columns.
  const GEO = {
    kick: R(110, 140, 1500, 36, 24), ttl: Object.assign(R(105, 182, 1715, 72, 52), { slot: 'token.title' }),
    bubWide: R(70, 100, 1040, 256, 32),
    holdTxt: R(260, 892, 1400, 72, 28), holdBar: R(260, 972, 1400, 6, 10), holdHint: R(260, 990, 1400, 34, 22),
    claimHeadR: R(1140, 150, 690, 56, 26),             // a heading in the side column while the room is shown
    sideChips: [R(1140, 236, 690, 70, 30), R(1140, 326, 690, 70, 30), R(1140, 416, 690, 70, 30)],
    cols: { left: { x: 150, w: 800 }, right: { x: 1060, w: 710 }, side: { x: 1140, w: 690 }, wide: { x: 150, w: 1620 }, top: 290, bottom: 850 }
  };

  // The three-person cast (artwork lives in characters.js; seat X is in room coordinates).
  const CAST = [
    { id: 'maya', name: 'Maya', color: '#B5763F', seatX: 430, rig: { skin: '#E8B98F', hair: '#3B2A20', hairStyle: 'bob', top: '#B5763F', topShade: '#9A6233', neck: 'vneck' } },
    { id: 'learner', name: 'You', color: '#202632', seatX: 960, rig: { skin: '#A8754E', hair: '#1F1A17', hairStyle: 'curls', top: '#2E3A52', topShade: '#232D41', neck: 'hood' } },
    { id: 'noah', name: 'Noah', color: '#7A6A9E', seatX: 1490, rig: { skin: '#F1CFB0', hair: '#6B4A2E', hairStyle: 'short', glasses: true, top: '#7A6A9E', topShade: '#65578A', neck: 'collar' } }
  ];

  // opts: { G: lesson geometry merged over GEO, FRAMES: { layerId: [x, y, w, h] }, HEAD: { layerId: headingRect },
  //         IMAGINED: token ids that live inside a frame, L: label lookup, Q: cue text lookup, markup }
  function helpers(E, S, opts) {
    const G = Object.assign({}, GEO, opts.G || {}), FRAMES = opts.FRAMES || {}, HEAD = opts.HEAD || {}, IMAGINED = opts.IMAGINED || [];
    const L = opts.L, Q = opts.Q, markup = opts.markup;
    S.vis = new Set(); S.open = []; S.cur = {}; S.frame = null;
    S.put = (id, t, d, patch) => { if ('o' in patch) { if (patch.o > 0) S.vis.add(id); else S.vis.delete(id); } S.set(id, t, d, patch); };
    S.hide = (ids, t, d) => ids.forEach((id) => { if (S.vis.has(id)) S.put(id, t, d == null ? MOTION.cut : d, { o: 0, act: 0 }); });
    // an item keeps its FIRST reveal (a layer shown again later only fades in; re-revealing would hide it until the later time)
    S.revL = (l, t, gap) => E.layers[l].items.forEach((id, i) => { if (!S.rev[id]) S.r(id, t + i * (gap || 0), E.items[id].type === 'draw' ? MOTION.draw : MOTION.enter); });
    S.addLayer = (l, t, gap) => { if (!S.open.includes(l)) { S.show(l, t, null, MOTION.enter, MOTION.cut); S.open.push(l); S.revL(l, t, gap == null ? 0.1 : gap); } };
    S.dropLayer = (l, t) => { if (S.open.includes(l)) { S.close(l, t); S.open = S.open.filter((x) => x !== l); } };
    S.dropAll = (t, keep) => S.open.filter((l) => !(keep || []).includes(l) && !FRAMES[l]).forEach((l) => S.dropLayer(l, t));
    S.roomTo = (t, mode, d) => { if (mode === 'off') { if (S.roomMode && S.roomMode !== 'off') S.set('room', t, MOTION.cut, { o: 0 }); } else if (S.roomMode === 'off' || S.roomMode == null) { S.set('room', t, 0, Object.assign({}, ROOM[mode], { o: 0 })); S.set('room', t + MOTION.cut, MOTION.enter, { o: 1 }); } else S.set('room', t, d || MOTION.layout, Object.assign({}, ROOM[mode], { o: 1 })); S.roomMode = mode; };
    S.txt = (id, t, text, rect) => { const cur = S.cur[id];
      if (text == null) { if (S.vis.has(id)) S.put(id, t, MOTION.cut, { o: 0 }); S.cur[id] = null; return; }
      if (cur === text && S.vis.has(id)) { if (rect) S.put(id, t, MOTION.travel, Object.assign({}, rect)); return; }
      if (S.vis.has(id)) { S.put(id, t, 0.15, { o: 0 }); S.set(id, t + 0.16, 0, Object.assign({}, rect || {}, { text })); S.put(id, t + 0.2, MOTION.enter, { o: 1 }); }
      else { S.set(id, t - 1e-3, 0, Object.assign({}, rect || {}, { text, o: 0 })); S.put(id, t, MOTION.enter, { o: 1 }); }
      S.cur[id] = text; };
    S.head = (t, k, ti) => { S.txt('kick', t, k ? L(k) : null, G.kick); S.txt('ttl', t, ti ? L(ti) : null, G.ttl); };
    S.title = (t, ti) => S.txt('ttl', t, ti ? L(ti) : null, G.ttl);
    S.rise = (id, t, rect, extra) => { S.set(id, t - 1e-3, 0, Object.assign({}, rect, { y: rect.y + 14, o: 0 }, extra || {})); S.put(id, t, MOTION.rise, { y: rect.y, o: 1 }); };
    S.to = (id, t, rect, extra, d) => S.put(id, t, d || MOTION.travel, Object.assign({}, rect, { o: 1 }, extra || {}));
    S.place = (id, t, rect, extra) => (S.vis.has(id) ? S.to(id, t, rect, extra) : S.rise(id, t + 0.1, rect, extra));
    S.say = (c, hls, wait) => { const s = c.start + (wait || 0), rect = G.bubWide; S.set('bubL', s - 0.16, 0, Object.assign({}, rect, { text: markup(Q(c.cueId), hls || []), hl: 0, y: rect.y + 12, o: 0 })); S.put('bubL', s - 0.15, MOTION.rise, { y: rect.y, o: 1 }); S.put('bubL', s + 0.1, MOTION.focus, { hl: 1 }); };
    S.pulseOn = (ids, t, len) => { S.all(ids, t, MOTION.focus, { act: 1 }); S.all(ids, t + (len || MOTION.pulse), MOTION.focus, { act: 0 }); };
    S.hold = (H, label) => { S.rise('holdTxt', H.start + 0.15, G.holdTxt, { text: label }); S.set('holdBar', H.start + 0.15, 0, Object.assign({}, G.holdBar, { w: 0, o: 1 })); S.vis.add('holdBar');
      S.put('holdBar', H.start + 0.2, H.dur - 0.4, { w: G.holdBar.w }); S.rise('holdHint', H.start + 0.3, G.holdHint); S.hide(['holdTxt', 'holdBar', 'holdHint'], H.end, 0.2); };
    // the imagined thumbnail frame: new frame before the old one leaves; the heading travels with it; contents leave before the heading
    S.frameTo = (t, f) => { const old = S.frame; S.addLayer(f, t); if (S.vis.has('frameLbl')) S.to('frameLbl', t, HEAD[f]); else S.rise('frameLbl', t, HEAD[f]); if (old && old !== f) S.dropLayer(old, t + MOTION.travel + 0.1); S.frame = f; };
    S.frameOff = (t) => { S.hide(IMAGINED, t); S.hide(['frameLbl'], t + MOTION.cut); if (S.frame) S.dropLayer(S.frame, t + MOTION.cut); S.frame = null; };
    // a labelled quote never appears without its heading: the heading comes first and leaves last
    S.claimTo = (t, headRect, quoteRect) => { S.place('claimHead', t, headRect); S.place('claimQ', t + 0.25, quoteRect, { kind: 'excerpt claim' }); };
    S.claimOff = (t) => { S.hide(['claimQ'], t); S.hide(['claimHead'], t + MOTION.cut); };
    return S;
  }
  // a character line: prep 0.38 s before the words, the gesture 0.15 s before, settle 0.2 s after; the others turn to listen
  const speak = (S, c, pose, who) => { who = who || 'learner'; const others = CAST.map((x) => x.id).filter((x) => x !== who);
    S.p(who, c.start - 0.38, pose, 'prep'); S.p(who, c.start - 0.15, pose); S.p(who, c.speechEnd + 0.2, pose, 'settle'); others.forEach((w, i) => S.p(w, c.start + 0.15 + i * 0.12, 'listen:' + who)); };
  const neutral = (S, t) => CAST.forEach((c) => S.p(c.id, t, 'neutral:front'));
  // the frame boxes of the imagined-example layers (drawings never stretch)
  const frames = (E, FRAMES) => Object.entries(FRAMES).forEach(([id, [x, y, w, h]]) => E.box(E.layer(id), id + '.b', x, y, w, h, 'imagframe'));
  // the S05 connector vocabulary
  const dline = (E, Ly, id, d, color) => E.dashed(Ly, id, d, color || '#9DB6E0');
  const head = (E, Ly, id, x, y, dir, color) => E.arrowHead(Ly, id, x, y, dir, color || '#356CC8');
  const qmark = (E, Ly, id, x, y) => { const n = document.createElement('div'); n.className = 'qmark'; n.style.cssText = `left:${x - 20}px;top:${y - 20}px;`; n.textContent = '?'; E.node(Ly, id, n); };

  global.EsssouthStyleRecipes = { MOTION, ROOM, R, WAIT, GEO, CAST, helpers, speak, neutral, frames, dline, head, qmark };
})(window);
