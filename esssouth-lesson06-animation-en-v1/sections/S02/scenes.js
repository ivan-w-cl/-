/*
 * L06.S02 · Make Your Own Contribution Clear. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Three role lanes keep the participant's work (blue idea cards) apart from Maya's and Noah's (grey step cards); the lanes
 * never change. The follow-up questions happen in a separate "Later practice conversation" frame, not on the event day.
 * Gate L06.I01: the flawed account C is labelled before it is spoken, drawn as a changed card, and its unsupported
 * ownership links are removed when the facts are restored. c010 rebuilds the unchanged roles for every path.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const LXB = [150, 710, 1270];
  const G = {
    out: R(560, 300, 800, 84, 30), cH: LXB.map((x) => R(x, 480, 500, 44, 28)), cC: LXB.map((x) => R(x, 534, 500, 80, 28)),
    caseB: R(150, 290, 620, 50, 24), rp: R(150, 420, 760, 100, 30), ro: R(1010, 420, 760, 100, 30),
    chipB: R(150, 420, 760, 84, 30), chipR: R(1010, 420, 760, 84, 30), check: R(560, 560, 800, 100, 30),
    conf: R(560, 360, 800, 84, 28),
    lH: LXB.map((x) => R(x, 500, 500, 44, 28)), lC: LXB.map((x) => R(x, 554, 500, 90, 28)),
    out5: R(150, 356, 1000, 72, 30), we: R(1190, 356, 580, 72, 30), lH5: LXB.map((x) => R(x, 446, 500, 44, 28)), lC5: LXB.map((x) => R(x, 500, 500, 90, 28)), iC: R(150, 650, 500, 90, 30),
    stack: [R(150, 400, 800, 84, 28), R(150, 496, 800, 84, 28), R(150, 592, 800, 84, 28)], n1: R(1060, 400, 710, 170, 30), n2: R(1060, 590, 710, 170, 30),
    sCase: R(1140, 140, 690, 50, 24), sReh: R(1140, 206, 690, 50, 24), sQ: R(1140, 276, 690, 84, 28),
    rFrame: R(150, 350, 1620, 480), rHead: R(190, 366, 560, 50, 24), qPart: R(190, 430, 1540, 64, 28), chNote: R(790, 366, 940, 50, 22),
    opts: [R(190, 510, 1540, 92, 28), R(190, 612, 1540, 92, 28), R(190, 714, 1540, 92, 28)],
    sHead: R(1140, 380, 690, 56, 26),
    fH: LXB.map((x) => R(x, 360, 500, 44, 28)), fC: LXB.map((x) => R(x, 414, 500, 90, 28)), resp: R(150, 580, 1620, 110, 30),
    pWe: R(150, 420, 500, 70, 28), pI: R(150, 510, 500, 70, 28), pBlank: R(710, 400, 1060, 380, 30), pNote: R(150, 776, 500, 48, 24),
    next: R(560, 690, 800, 96, 30)
  };

  function setup(E, ctx) {
    const K = global.L06Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('rFrame', G.rFrame, 'ctx frame', '', 'token.default'); // container first
    tok('out', G.out, 'goal', L('x.output'), 'token.step');
    ['lh0', 'lh1', 'lh2'].forEach((id, i) => tok(id, G.cH[i], 'colhead', L(['x.lane.p', 'x.lane.m', 'x.lane.n'][i]), 'token.colhead'));
    tok('k0', G.cC[0], 'step plan', L('x.contrib'), 'token.step'); tok('k1', G.cC[1], 'step plan', L('x.contrib'), 'token.step'); tok('k2', G.cC[2], 'step plan', L('x.contrib'), 'token.step');
    tok('caseL', G.caseB, 'framehead', L('case.label'), 'token.frame');
    tok('rp', G.rp, 'idea', L('role.participant'), 'token.idea'); tok('ro', G.ro, 'step', L('role.others'), 'token.step');
    tok('sb', G.chipB, 'chipcard mark', L('x.studioB'), 'token.chip'); tok('sr', G.chipR, 'chipcard mark', L('x.blueRoom'), 'token.chip'); tok('check', G.check, 'question', L('case.check'), 'token.question');
    tok('conf', G.conf, 'fact', L('x.confirmed'), 'token.step', { tag: 'x.summary' });
    tok('ap', G.lC[0], 'idea', L('x.act.p'), 'token.idea'); tok('am', G.lC[1], 'step', L('x.act.m'), 'token.step'); tok('an', G.lC[2], 'step', L('x.act.n'), 'token.step');
    tok('we', G.we, 'example', L('pronoun.we'), 'token.step'); tok('iC', G.iC, 'example', L('pronoun.i'), 'token.step');
    tok('n1', G.n1, 'note', L('x.note.mine'), 'token.note'); tok('n2', G.n2, 'note', L('x.note.other'), 'token.note');
    tok('reh', G.sReh, 'framehead', L('rehearsal.frame'), 'token.frame'); tok('qPart', G.sQ, 'question', L('question.part'), 'token.question');
    tok('chNote', G.chNote, 'framehead', L('choice.note'), 'token.frame');
    tok('sHead', G.sHead, 'framehead', L('branch.b.label'), 'token.frame'); tok('resp', G.resp, 'example', '', 'token.summary');
    tok('pBlank', G.pBlank, 'note', L('private.prompt'), 'token.note'); tok('pNote', G.pNote, 'hint', L('private.note'), 'token.hint');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('out'); [400, 960, 1520].forEach((x, i) => Rx.dline(E, l, 'out.' + i, `M 960 392 C 960 440, ${x} 430, ${x} 472`, '#B9C5D6'));
    l = ly('mm'); Rx.dline(E, l, 'mm.a', 'M 918 462 L 1002 462', '#B9C5D6'); Rx.qmark(E, l, 'mm.q', 960, 436); Rx.dline(E, l, 'mm.b', 'M 960 512 L 960 552', '#9DB6E0'); Rx.head(E, l, 'mm.h', 960, 558, 'down', '#9DB6E0');
    l = ly('upd'); Rx.dline(E, l, 'upd.a', 'M 960 452 L 960 492', '#9DB6E0'); Rx.head(E, l, 'upd.h', 960, 498, 'down', '#9DB6E0');
    l = ly('pron'); Rx.dline(E, l, 'pron.a', 'M 1182 392 L 1162 392', '#356CC8'); Rx.head(E, l, 'pron.ah', 1156, 392, 'left', '#356CC8'); Rx.dline(E, l, 'pron.b', 'M 400 642 L 400 604', '#356CC8'); Rx.head(E, l, 'pron.bh', 400, 598, 'up', '#356CC8');
    l = ly('lA'); [400, 960, 1520].forEach((x, i) => Rx.dline(E, l, 'lA.' + i, `M ${x} 572 L ${x} 512`, '#B9C5D6')); Rx.qmark(E, l, 'lA.q', 440, 540);
    l = ly('lB'); Rx.dline(E, l, 'lB.a', 'M 400 572 L 400 518', '#356CC8'); Rx.head(E, l, 'lB.h', 400, 512, 'up', '#356CC8');
    l = ly('lC'); [960, 1520].forEach((x, i) => Rx.dline(E, l, 'lC.' + i, `M ${x} 572 L ${x} 512`, '#B0563F'));
    l = ly('nx'); Rx.dline(E, l, 'nx.a', 'M 960 600 L 960 682', '#9DB6E0'); Rx.head(E, l, 'nx.h', 960, 690, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L06.S02.B0' + n, M = X.MOTION, markup = global.EsssouthStyleEngine.markup;
    const LH = ['lh0', 'lh1', 'lh2'], AC = ['ap', 'am', 'an'];
    const lanes = (t, H, C, gap) => { LH.forEach((id, i) => S.place(id, t + i * (gap || 0.1), H[i])); AC.forEach((id, i) => S.place(id, t + 0.15 + i * (gap || 0.1), C[i])); };
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: one shared output, three separate contribution lanes (no ranking) ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('out', at('s2_team'), G.out); S.addLayer('out', at('s2_team') + 0.5, 0.15);
    LH.forEach((id, i) => S.rise(id, at('s2_team') + 0.7 + i * 0.12, G.cH[i])); ['k0', 'k1', 'k2'].forEach((id, i) => S.rise(id, at('s2_visible') + i * 0.15, G.cC[i]));
    S.title(a('c001') - 0.2, 'ownership.focus');
    // ---- c002: fiction label first; the fixed role facts ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('out', t); S.title(t, null);
    S.rise('caseL', at('s2_fiction'), G.caseB); S.rise('rp', at('s2_drew'), G.rp); S.rise('ro', at('s2_maya'), G.ro); S.pulseOn(['rp', 'ro'], a('c002'), 1.0);
    // ---- c003: the two written labels and the participant's question (reported) ----
    t = X0('c003'); S.hide(['rp', 'ro'], t);
    S.rise('sb', at('s2_dayBefore'), G.chipB); S.rise('sr', at('s2_blue'), G.chipR); S.addLayer('mm', at('s2_asked') - 0.3, 0.2); S.rise('check', at('s2_asked'), G.check);
    // ---- c004: precise confirmation; three separately attributed actions ----
    t = X0('c004'); S.hide(['sb', 'sr', 'check'], t); S.dropLayer('mm', t);
    S.rise('conf', at('s2_after'), G.conf); S.addLayer('upd', at('s2_after') + 0.6);
    LH.forEach((id, i) => S.rise(id, at('s2_after') + 0.8 + i * 0.1, G.lH[i]));
    S.rise('ap', at('s2_changed'), G.lC[0]); S.rise('am', at('s2_mayaC'), G.lC[1]); S.rise('an', at('s2_noahA'), G.lC[2]); S.title(a('c004') - 0.2, 'updated.roles');
    // ---- B02 · c005: we → the shared task; I → the participant's action ----
    t = X0('c005'); S.head(t, B(2), null); S.title(t, null); S.hide(['conf'], t); S.dropLayer('upd', t);
    S.rise('out', t + 0.3, G.out5); lanes(t + 0.4, G.lH5, G.lC5, 0.08);
    S.rise('we', at('s2_we'), G.we); S.rise('iC', at('s2_i'), G.iC); S.addLayer('pron', at('s2_i') + 0.4, 0.4); S.pulseOn(['ap', 'iC'], a('c005'), 1.2);
    // ---- c006 + h101: role facts beside a blank two-column private note ----
    t = X0('c006'); S.hide(['out', 'we', 'iC'].concat(LH), t); S.dropLayer('pron', t);
    AC.forEach((id, i) => S.to(id, t + 0.2 + i * 0.08, G.stack[i])); S.rise('n1', at('s2_priv'), G.n1); S.rise('n2', at('s2_priv') + 0.3, G.n2);
    X.hold('h101');
    // ---- B03 · d001 · Maya, in a later practice conversation ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t, ['caseL']); S.to('caseL', t + 0.1, G.sCase); S.rise('reh', t + 0.3, G.sReh);
    X.line('d001', 'ask:learner', ['your own part'], { headFirst: true }); S.rise('qPart', a('d001'), G.sQ);
    // ---- c007 + c008 + gate: alternatives inside the rehearsal frame, all under an examination label ----
    t = X0('c007'); X.roomOut(t); S.head(t + 0.1, B(3), null); S.to('caseL', t + 0.1, G.caseB);
    S.rise('rFrame', t + 0.2, G.rFrame); S.to('reh', t + 0.25, G.rHead); S.to('qPart', t + 0.3, G.qPart); S.title(a('c007') - 0.2, 'choice.prompt');
    t = X0('c008'); S.rise('chNote', at('s2_deliber'), G.chNote);
    X.gate({ optRects: G.opts });
    const branch = (d1, d2, f, label, hl1, hl2) => {
      if (!X.has(d1)) return null; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'chNote', 'rFrame'], t0); S.head(t0, null, null); S.title(t0, null);
      S.to('caseL', t0 + 0.1, G.sCase); S.to('reh', t0 + 0.15, G.sReh); S.to('qPart', t0 + 0.2, G.sQ);
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L(label), kind: label === 'branch.c.label' ? 'framehead active' : 'framehead' }); // labelled before the line begins
      X.line(d1, 'explain:maya', hl1, { headFirst: true }); X.line(d2, 'ask:learner', hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead', 'reh', 'qPart'], tf); S.head(tf + 0.1, B(3), null); S.to('caseL', tf + 0.1, G.caseB);
      LH.forEach((id, i) => S.rise(id, tf + 0.3 + i * 0.08, G.fH[i])); AC.forEach((id, i) => S.rise(id, tf + 0.45 + i * 0.08, G.fC[i])); return tf;
    };
    let tf = branch('d101', 'd102', 'f101', 'branch.a.label', ['updated it together'], ['Which actions were yours']);
    if (tf != null) { S.rise('resp', tf + 0.8, G.resp, { text: L('gate.option.A') }); S.addLayer('lA', at('sA_shared'), 0.1); S.pulseOn(['ap'], at('sA_unclear'), 1.2);
      S.title(a('f101') - 0.2, 'branch.a.note'); S.pulseOn(['ap'], at('sA_add'), 1.0); }
    tf = branch('d201', 'd202', 'f201', 'branch.b.label', ['checked the conflicting names with the coordinator', 'changed its label to Blue Room'], ['the schedule and the assembled guide']);
    if (tf != null) { S.rise('resp', tf + 0.8, G.resp, { text: L('gate.option.B') }); S.addLayer('lB', at('sB_names')); S.pulseOn(['ap', 'resp'], at('sB_names') + 0.3, 1.2);
      S.pulseOn(['am', 'an'], at('sB_add'), 1.2); S.title(a('f201') - 0.2, 'branch.b.note'); }
    tf = branch('d301', 'd302', 'f301', 'branch.c.label', ['the schedule and the finished guide myself'], ['I listed the session times', 'Noah assembled the guide']);
    if (tf != null) { S.rise('resp', tf + 0.8, G.resp, { text: markup(L('gate.option.C'), ['the schedule and the finished guide myself']), hl: 1, kind: 'step changed', tag: 'branch.c.label' });
      S.addLayer('lC', at('sC_attrib'), 0.1); S.dropLayer('lC', a('f301') + 0.2); S.put('resp', a('f301') + 0.2, M.focus, { o: 0.4 });
      S.pulseOn(['am', 'an'], a('f301') + 0.4, 1.2); S.title(a('f301') - 0.2, 'branch.c.note'); S.pulseOn(['ap'], at('sC_return'), 1.2); }
    // ---- B04 · c010: every path rejoins; the unchanged three-role board ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t, ['caseL']); ['lA', 'lB', 'lC'].forEach((l) => S.dropLayer(l, t)); S.head(t, B(4), null); S.title(t, null);
    S.to('caseL', t + 0.1, G.caseB); LH.forEach((id, i) => S.rise(id, at('s2_handled') + i * 0.1, G.fH[i])); AC.forEach((id, i) => S.rise(id, at('s2_handled') + 0.3 + i * 0.3, G.fC[i]));
    S.title(a('c010') - 0.2, 'shared.roles');
    // ---- c011: answer the question while keeping the team context ----
    t = X0('c011'); S.title(t, null); S.put('am', at('s2_enough'), M.focus, { o: 0.4 }); S.put('an', at('s2_enough') + 0.1, M.focus, { o: 0.4 });
    S.pulseOn(['ap'], at('s2_enough') + 0.6, 1.2); S.put('am', a('c011'), M.focus, { o: 1 }); S.put('an', a('c011') + 0.1, M.focus, { o: 1 }); S.title(a('c011') + 0.3, 'answer.focus');
    // ---- c012 + h102: We / I labels beside a blank private area ----
    t = X0('c012'); S.title(t, null); X.clearAll(t);
    S.rise('we', at('s2_whereWe'), G.pWe); S.rise('iC', at('s2_whereI'), G.pI); S.rise('pBlank', at('s2_explain'), G.pBlank); S.rise('pNote', a('c012'), G.pNote);
    X.hold('h102');
    // ---- c013: a conditional self-check against the known roles; next-section title ----
    t = X0('c013'); S.hide(['we', 'iC', 'pBlank', 'pNote'], t); S.title(at('s2_formed') + 0.4, 'review.question');
    S.rise('caseL', t + 0.3, G.caseB); LH.forEach((id, i) => S.rise(id, t + 0.4 + i * 0.1, G.fH[i])); AC.forEach((id, i) => S.rise(id, t + 0.6 + i * 0.1, G.fC[i]));
    S.addLayer('nx', at('s2_next') - 0.3); S.rise('next', at('s2_next'), G.next);
  }
  global.L06Scenes = { setup };
})(window);
