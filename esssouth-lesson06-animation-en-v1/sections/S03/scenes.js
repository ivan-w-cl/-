/*
 * L06.S03 · Explain Why You Made a Decision. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Time order is the core: "Before checking" and "After checking" columns; the confirmed name enters the After column only
 * when the confirmation is spoken (never backfilled). Possible confusion sits in a labelled possibility frame; the one
 * observed visitor stays a separate fact card beside an explicit unknown. Follow-ups happen in a later practice frame.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const LXB = [150, 710, 1270];
  const G = {
    h3: LXB.map((x) => R(x, 420, 500, 44, 28)), s3: LXB.map((x) => R(x, 474, 500, 200, 28)),
    caseB: R(150, 290, 620, 50, 24), roles: R(150, 370, 1620, 70, 26),
    hB: R(150, 470, 800, 44, 28), hA: R(1060, 470, 710, 44, 28), before: R(150, 524, 800, 84, 28), unk: R(150, 624, 800, 84, 28), conf: R(1060, 524, 710, 100, 28), upd: R(1060, 680, 710, 84, 28),
    seq: [R(150, 480, 380, 120, 26), R(560, 480, 380, 120, 26), R(970, 480, 380, 120, 26), R(1380, 480, 390, 120, 26)],
    pF: R(150, 380, 900, 300), pH: R(190, 396, 820, 50, 24), poss: R(190, 480, 820, 100, 30), act: R(1180, 480, 590, 100, 30),
    blank: R(1060, 470, 710, 320, 30),
    sCase: R(1140, 140, 690, 50, 24), sReh: R(1140, 206, 690, 50, 24), sQ: R(1140, 276, 690, 84, 28), sHead: R(1140, 380, 690, 56, 26),
    rFrame: R(150, 350, 1620, 504), rHead: R(190, 366, 560, 50, 24), qWhy: R(190, 426, 1540, 56, 26), chNote: R(790, 366, 940, 50, 22),
    then: R(190, 492, 740, 52, 26), later: R(990, 492, 740, 52, 26),
    opts: [R(190, 552, 1540, 94, 26), R(190, 650, 1540, 94, 26), R(190, 748, 1540, 94, 26)],
    fB: R(150, 370, 800, 84, 28), fU: R(150, 470, 800, 84, 28), fAct: R(1060, 370, 710, 84, 28), resp: R(150, 600, 1620, 110, 30),
    fObs: R(150, 470, 800, 96, 28), fUnk: R(1060, 470, 710, 96, 28),
    cPoss: R(150, 470, 800, 96, 30), cUns: R(1060, 470, 710, 96, 28), cObs: R(150, 640, 800, 96, 28),
    pFic: R(150, 400, 800, 70, 26), pOwn: R(150, 490, 800, 70, 26), pFacts: R(150, 590, 800, 84, 26),
    rem: R(150, 440, 760, 280, 30), notRec: R(1010, 440, 760, 280, 30), pNote: R(150, 776, 500, 48, 24),
    next: R(560, 752, 800, 76, 28)
  };

  function setup(E, ctx) {
    const K = global.L06Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('pF', G.pF, 'ctx frame', '', 'token.default'); tok('rFrame', G.rFrame, 'ctx frame', '', 'token.default'); // containers first
    tok('h0', G.h3[0], 'colhead', L('x.h.info'), 'token.colhead'); tok('h1', G.h3[1], 'colhead', L('x.h.action'), 'token.colhead'); tok('h2', G.h3[2], 'colhead', L('x.h.result'), 'token.colhead');
    tok('s0', G.s3[0], 'note unobserved', '', 'token.note'); tok('s1', G.s3[1], 'note unobserved', '', 'token.note'); tok('s2', G.s3[2], 'note unobserved', '', 'token.note');
    tok('caseL', G.caseB, 'framehead', L('case.label'), 'token.frame'); tok('roles', G.roles, 'chipcard', L('x.roles'), 'token.chip');
    tok('hB', G.hB, 'colhead', L('time.before'), 'token.colhead'); tok('hA', G.hA, 'colhead', L('time.after'), 'token.colhead');
    tok('before', G.before, 'chipcard mark', L('case.before'), 'token.chip'); tok('unk', G.unk, 'question', L('x.unk'), 'token.question');
    tok('ask', G.seq[1], 'idea', L('x.ask'), 'token.idea'); tok('conf', G.conf, 'fact', L('x.conf'), 'token.step', { tag: 'x.summary' }); tok('upd', G.upd, 'idea', L('x.upd'), 'token.idea');
    tok('pH', G.pH, 'framehead', L('x.poss'), 'token.frame'); tok('poss', G.poss, 'note', L('reason.possible'), 'token.note'); tok('act', G.act, 'idea', L('reason.action'), 'token.idea');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('reh', G.sReh, 'framehead', L('rehearsal.frame'), 'token.frame'); tok('qWhy', G.sQ, 'question', L('question.why'), 'token.question');
    tok('chNote', G.chNote, 'framehead', L('choice.note'), 'token.frame'); tok('then', G.then, 'chipcard', L('x.infoThen'), 'token.chip'); tok('later', G.later, 'chipcard margin', L('x.outLater'), 'token.chip');
    tok('sHead', G.sHead, 'framehead', L('branch.c.label'), 'token.frame'); tok('resp', G.resp, 'example', '', 'token.summary');
    tok('obs', G.fObs, 'fact', L('x.obs'), 'token.step'); tok('unkW', G.fUnk, 'step gap', L('x.unknownWide'), 'token.step');
    tok('sPoss', G.cPoss, 'note', L('scope.possible'), 'token.note'); tok('sUns', G.cUns, 'step gap', L('scope.unsupported'), 'token.step');
    tok('pFic', G.pFic, 'chipcard margin', L('x.path.fiction'), 'token.chip'); tok('pOwn', G.pOwn, 'chipcard margin', L('x.path.own'), 'token.chip');
    tok('rem', G.rem, 'note', L('x.remembered'), 'token.note'); tok('notRec', G.notRec, 'note unobserved', L('x.notRecalled'), 'token.note'); tok('pNote', G.pNote, 'hint', L('private.note'), 'token.hint');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('seq'); [538, 948, 1358].forEach((x, i) => { Rx.dline(E, l, 'seq.' + i, `M ${x - 4} 540 L ${x + 6} 540`, '#9DB6E0'); Rx.head(E, l, 'seq.h' + i, x + 14, 540, 'right', '#9DB6E0'); });
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 470 L 1005 760', '#9DB6E0');
    l = ly('pa'); Rx.dline(E, l, 'pa.a', 'M 1018 530 L 1164 530', '#9DB6E0'); Rx.head(E, l, 'pa.h', 1172, 530, 'right', '#9DB6E0');
    l = ly('lA'); Rx.dline(E, l, 'lA.a', 'M 550 592 L 550 562', '#B9C5D6'); Rx.qmark(E, l, 'lA.q', 590, 576);
    l = ly('lC'); Rx.dline(E, l, 'lC.a', 'M 550 592 L 550 562', '#356CC8'); Rx.head(E, l, 'lC.ah', 550, 556, 'up', '#356CC8'); Rx.dline(E, l, 'lC.b', 'M 1415 592 L 1415 462', '#356CC8'); Rx.head(E, l, 'lC.bh', 1415, 456, 'up', '#356CC8');
    l = ly('nx'); Rx.dline(E, l, 'nx.a', 'M 960 714 L 960 738', '#9DB6E0'); Rx.head(E, l, 'nx.h', 960, 746, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L06.S03.B0' + n, M = X.MOTION, markup = global.EsssouthStyleEngine.markup;
    X.neutral(S, -1e9); S.roomMode = 'off';
    const beforeAfter = (t, withConf) => { S.place('hB', t, G.hB); S.place('before', t + 0.1, G.before); S.place('unk', t + 0.2, G.unk); S.place('hA', t + 0.3, G.hA); S.addLayer('div', t + 0.3);
      if (withConf) { S.place('conf', t + 0.5, G.conf); S.place('upd', t + 0.6, G.upd); } };
    // ---- B01 · c001: information / action / result kept in distinct lanes ----
    S.head(X0('c001') + 0.1, B(1), null); ['h0', 'h1', 'h2'].forEach((id, i) => S.rise(id, at('s3_useful') + i * 0.15, G.h3[i])); ['s0', 's1', 's2'].forEach((id, i) => S.rise(id, at('s3_useful') + 0.3 + i * 0.15, G.s3[i]));
    S.title(a('c001') - 0.2, 'decision.focus'); S.pulseOn(['h0'], at('s3_knew'), 1.0); S.pulseOn(['h2'], at('s3_without'), 1.0);
    // ---- c002: fiction label, role facts, the two exact labels before the check ----
    let t = X0('c002'); X.clearAll(t); S.title(t, null);
    S.rise('caseL', at('s3_case'), G.caseB); S.rise('roles', at('s3_case') + 0.5, G.roles); S.rise('hB', at('s3_dayBefore'), G.hB); S.rise('before', at('s3_dayBefore') + 0.3, G.before);
    S.rise('unk', a('c002'), G.unk); S.rise('hA', a('c002') + 0.4, G.hA); S.addLayer('div', a('c002') + 0.4);
    // ---- c003: the supplied order: unknown → ask → reported confirmation → update ----
    t = X0('c003'); S.hide(['roles', 'hB', 'hA', 'before'], t); S.dropLayer('div', t);
    S.to('unk', t + 0.2, G.seq[0]); S.rise('ask', at('s3_asked'), G.seq[1]); S.addLayer('seq', at('s3_asked') + 0.3, 0.2);
    S.rise('conf', at('s3_conf'), G.seq[2]); S.rise('upd', at('s3_changed'), G.seq[3]); S.title(a('c003') + 0.6, 'case.sequence');
    // ---- B02 · c004: a possible concern (framed) connected to the decision to check ----
    t = X0('c004'); S.head(t, B(2), null); S.title(t, null); S.hide(['unk', 'ask', 'conf', 'upd'], t); S.dropLayer('seq', t);
    S.rise('pF', at('s3_stated'), G.pF); S.rise('pH', at('s3_stated') + 0.2, G.pH); S.rise('poss', at('s3_stated') + 0.5, G.poss);
    S.addLayer('pa', at('s3_checking') - 0.2); S.rise('act', at('s3_checking'), G.act); S.pulseOn(['poss'], a('c004'), 1.2);
    // ---- c005: before / after columns; the confirmed name enters only when confirmation is named ----
    t = X0('c005'); S.hide(['poss', 'act'], t); S.hide(['pH', 'pF'], t + M.cut); S.dropLayer('pa', t);
    beforeAfter(at('s3_order'), false); S.rise('conf', at('s3_after'), G.conf); S.pulseOn(['unk'], at('s3_visible'), 1.2);
    // ---- c006 + h101: the two source labels and a blank private reasoning area ----
    t = X0('c006'); S.hide(['hA', 'conf'], t); S.dropLayer('div', t); S.rise('blank', at('s3_priv'), G.blank);
    X.hold('h101');
    // ---- B03 · d001 · Maya, in a later practice conversation ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t, ['caseL']); S.to('caseL', t + 0.1, G.sCase); S.rise('reh', t + 0.3, G.sReh);
    X.line('d001', 'ask:learner', ['rather than choose one of the names yourself'], { headFirst: true }); S.rise('qWhy', a('d001') - 0.6, G.sQ);
    // ---- c007 + c008 + gate L06.I02 ----
    t = X0('c007'); X.roomOut(t); S.head(t + 0.1, B(3), null); S.to('caseL', t + 0.1, G.caseB);
    S.rise('rFrame', t + 0.2, G.rFrame); S.to('reh', t + 0.25, G.rHead); S.to('qWhy', t + 0.3, G.qWhy); S.title(a('c007') - 0.2, 'choice.prompt');
    t = X0('c008'); S.rise('chNote', at('s3_check'), G.chNote); S.rise('then', at('s3_later'), G.then); S.rise('later', at('s3_later') + 0.3, G.later);
    X.gate({ optRects: G.opts });
    const branch = (d1, d2, f, label, hl1, hl2) => {
      if (!X.has(d1)) return null; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'chNote', 'rFrame', 'then', 'later'], t0); S.head(t0, null, null); S.title(t0, null);
      S.to('caseL', t0 + 0.1, G.sCase); S.to('reh', t0 + 0.15, G.sReh); S.to('qWhy', t0 + 0.2, G.sQ);
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L(label), kind: label === 'branch.b.label' ? 'framehead active' : 'framehead' });
      X.line(d1, 'explain:maya', hl1, { headFirst: true }); X.line(d2, 'ask:learner', hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead', 'reh', 'qWhy'], tf); S.head(tf + 0.1, B(3), null); S.to('caseL', tf + 0.1, G.caseB); return tf;
    };
    let tf = branch('d101', 'd102', 'f101', 'branch.a.label', ['checking was important'], ['What needed checking', 'why did that affect your choice']);
    if (tf != null) { S.rise('resp', tf + 0.4, G.resp, { text: L('gate.option.A') }); S.addLayer('lA', at('sA_value') + 0.3);
      S.rise('before', at('sA_next'), G.fB); S.rise('unk', at('sA_next') + 0.3, G.fU); S.title(a('f101') - 0.2, 'branch.a.note'); }
    tf = branch('d201', 'd202', 'f201', 'branch.b.label', ['every visitor'], ['How do you know', 'What did you know when you decided to ask']);
    if (tf != null) { S.rise('resp', tf + 0.4, G.resp, { text: markup(L('gate.option.B'), ['I knew', 'every visitor']), hl: 1, kind: 'step changed', tag: 'branch.b.label' });
      S.put('resp', a('f201'), M.focus, { o: 0.4 }); S.rise('obs', at('sB_one'), G.fObs); S.rise('unkW', a('f201') + 0.3, G.fUnk); S.title(at('sB_explain') - 0.2, 'branch.b.note'); }
    tf = branch('d301', 'd302', 'f301', 'branch.c.label', ['did not know whether they meant the same room', 'so I would not choose a name by guessing'], ['what you changed']);
    if (tf != null) { S.rise('resp', tf + 0.4, G.resp, { text: L('gate.option.C') }); S.rise('before', at('sC_info'), G.fB); S.rise('unk', at('sC_info') + 0.2, G.fU); S.rise('act', at('sC_info') + 0.4, G.fAct);
      S.addLayer('lC', at('sC_info') + 0.7, 0.2); S.title(a('f301') - 0.2, 'branch.c.note'); }
    // ---- B04 · c010: every path rejoins; before / after rebuilt from the case ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t, ['caseL']); ['lA', 'lC'].forEach((l) => S.dropLayer(l, t)); S.head(t, B(4), null); S.title(t, null);
    S.to('caseL', t + 0.1, G.caseB); beforeAfter(at('s3_shared'), false); S.rise('conf', at('s3_laterConf'), G.conf); S.rise('upd', at('s3_laterConf') + 0.5, G.upd);
    S.title(a('c010') - 0.2, 'shared.reason');
    // ---- c011: could confuse (possible) vs were confused (not stated); the observed visitor kept apart ----
    t = X0('c011'); S.title(t, null); S.hide(['hB', 'hA', 'before', 'unk', 'conf', 'upd'], t);
    S.rise('sPoss', at('s3_could'), G.cPoss); S.rise('sUns', at('s3_were'), G.cUns); S.rise('obs', a('c011'), G.cObs);
    // ---- c012 + c013 + h102: optional source facts, private paths, an acknowledged gap ----
    t = X0('c012'); S.title(t, null); X.clearAll(t); S.dropLayer('div', t);
    S.rise('pFic', at('s3_attempt'), G.pFic); S.rise('pOwn', at('s3_truthful'), G.pOwn); S.rise('before', at('s3_truthful') + 0.5, G.pFacts); S.rise('blank', a('c012') - 0.5, G.blank, { text: L('private.prompt') });
    t = X0('c013'); S.hide(['pFic', 'pOwn', 'before', 'blank'], t);
    S.rise('rem', at('s3_cannot'), G.rem); S.rise('notRec', a('c013'), G.notRec); S.rise('pNote', at('s3_another'), G.pNote);
    X.hold('h102');
    // ---- c014: a conditional self-check on time order; next-section title ----
    t = X0('c014'); S.hide(['rem', 'notRec', 'pNote'], t); S.title(at('s3_formed') + 0.4, 'review.question');
    S.rise('caseL', t + 0.3, G.caseB); beforeAfter(t + 0.4, false); S.addLayer('nx', at('s3_next') - 0.3); S.rise('next', at('s3_next'), G.next);
  }
  global.L06Scenes = { setup };
})(window);
