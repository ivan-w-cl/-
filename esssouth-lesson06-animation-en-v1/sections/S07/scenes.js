/*
 * L06.S07 · Adapt the Same Experience to a New Question. Section adapter (tokens, rects, timing by cue starts and anchors).
 * One fixed fact bank (case-ledger IDs kept on every card) answers three different questions: cards move between lanes,
 * their words never change. Maya's and Noah's cards stay beside their own work; F09 stays in "What I would try next";
 * the impact lane holds one observed visitor and two explicit limits. The close is an unfilled private planning surface.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const COL = [150, 700, 1250], BX = [150, 558, 966, 1374];
  const G = {
    caseB: R(150, 500, 620, 46, 22), tab: COL.map((x) => R(x, 300, 520, 76, 26)), lane: COL.map((x) => R(x, 400, 520, 44, 26)),
    bank: [0, 1].flatMap((r) => BX.map((x) => R(x, 560 + r * 132, 396, 120, 26))),
    q1: R(150, 290, 800, 76, 26), caseT: R(1060, 300, 620, 46, 22), hOwn: R(150, 390, 800, 44, 28), hTeam: R(1060, 390, 710, 44, 28),
    own: [R(150, 446, 800, 84, 26), R(150, 542, 800, 84, 26), R(150, 638, 800, 84, 26)], team: [R(1060, 446, 710, 84, 26), R(1060, 542, 710, 84, 26)],
    sHead: R(1140, 150, 690, 50, 22), sQ: R(1140, 214, 690, 84, 26), sA: R(1140, 312, 690, 100, 26), sB: R(1140, 426, 690, 84, 26),
    hPast: R(150, 300, 800, 44, 28), past: [R(150, 360, 800, 84, 26), R(150, 456, 800, 84, 26), R(150, 552, 800, 84, 26)],
    hNext: R(1060, 300, 710, 44, 28), next: R(1060, 360, 710, 110, 26), caseC4: R(1060, 600, 620, 46, 22),
    obs: R(150, 400, 760, 110, 30), cause: R(1010, 400, 760, 110, 30), lim: R(560, 570, 800, 84, 28), caseC5: R(150, 320, 620, 46, 22),
    eqHead: COL.map((x) => R(x, 300, 520, 44, 26)), eqA: [360, 456, 552].map((y) => R(150, y, 520, 84, 26)),
    eqF: R(700, 360, 520, 130, 26), eqI: R(1250, 360, 520, 110, 26), eqL: R(1250, 486, 520, 84, 26), caseEq: R(150, 690, 620, 46, 22),
    pHead: R(150, 300, 1100, 56, 26), pBoard: R(150, 372, 1100, 330, 30), pBlank: R(150, 718, 1100, 66, 26), caseP: R(1310, 300, 460, 46, 22),
    endHead: COL.map((x) => R(x, 330, 520, 44, 26)), endBox: COL.map((x) => R(x, 390, 520, 240, 30)), endLim: R(560, 680, 800, 66, 26)
  };
  const BANK = ['f02p', 'f02m', 'f02n', 'f04', 'f06', 'f07', 'f08', 'f09'];

  function setup(E, ctx) {
    const K = global.L06Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('pBoard', G.pBoard, 'note', '', 'token.note'); ['e0', 'e1', 'e2'].forEach((id, i) => tok(id, G.endBox[i], 'note', '', 'token.note')); // containers first
    tok('caseL', G.caseB, 'framehead', L('s07.case'), 'token.frame');
    tok('q1', G.tab[0], 'question', L('s07.q1'), 'token.question'); tok('q2', G.tab[1], 'question', L('s07.q2'), 'token.question'); tok('q3', G.tab[2], 'question', L('s07.q3'), 'token.question');
    tok('lA', G.lane[0], 'colhead', L('s07.action'), 'token.colhead'); tok('lF', G.lane[1], 'colhead dashed', L('s07.future'), 'token.colhead'); tok('lI', G.lane[2], 'colhead', L('s07.impact'), 'token.colhead');
    BANK.forEach((id, i) => tok(id, G.bank[i], id === 'f09' ? 'proposal' : id === 'f08' ? 'step gap' : id === 'f02m' || id === 'f02n' ? 'step' : 'fact', L('x.' + id), 'token.step'));
    tok('hOwn', G.hOwn, 'colhead', L('s07.own'), 'token.colhead'); tok('hTeam', G.hTeam, 'colhead', L('s07.team'), 'token.colhead');
    tok('mFut', G.sA, 'proposal', L('s07.model.future'), 'token.step', { tag: 's07.proposed' });
    tok('hPast', G.hPast, 'colhead', L('s07.past'), 'token.colhead'); tok('hNext', G.hNext, 'colhead dashed', L('s07.next'), 'token.colhead');
    tok('obs', G.sA, 'fact', L('s07.observed'), 'token.step'); tok('lim', G.sB, 'step gap', L('s07.limit'), 'token.step');
    tok('cause', G.cause, 'step gap', L('s07.cause'), 'token.step');
    tok('pHead', G.pHead, 'framehead', L('s07.private'), 'token.frame'); tok('pBlank', G.pBlank, 'chipcard margin', L('s07.blank'), 'token.chip');
    tok('cQ', G.endHead[0], 'colhead', L('x.col.q'), 'token.colhead'); tok('cF', G.endHead[1], 'colhead', L('x.col.f'), 'token.colhead'); tok('cL', G.endHead[2], 'colhead dashed', L('x.col.l'), 'token.colhead');
    tok('endLim', G.endLim, 'chipcard margin', L('s07.limits'), 'token.chip');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('bnd'); E.dashed(l, 'bnd.a', 'M 1005 300 L 1005 660', '#9DB6E0');
    l = ly('ghost'); Rx.dline(E, l, 'ghost.a', 'M 1052 415 L 1022 415', '#9DB6E0'); E.dashed(l, 'ghost.stop', 'M 1018 395 L 1018 435', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L06.S07.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: the labelled fact bank and three (still empty) question tabs ----
    let t = X0('c001'); S.head(t + 0.1, B(1), null); S.title(a('c001') - 0.2, 's07.title');
    S.rise('caseL', a('c001') + 0.4, G.caseB); BANK.forEach((id, i) => S.rise(id, a('c001') + 0.7 + i * 0.12, G.bank[i]));
    S.pulseOn(BANK, at('s7_select'), 1.2);
    // ---- c002: three questions, three different requests; the facts stay where they are ----
    t = X0('c002'); S.title(t, null);
    S.rise('q1', at('s7_q1'), G.tab[0]); S.rise('q2', at('s7_q2'), G.tab[1]); S.rise('q3', at('s7_q3'), G.tab[2]);
    S.rise('lA', at('s7_action'), G.lane[0]); S.rise('lF', at('s7_prop'), G.lane[1]); S.rise('lI', at('s7_impact'), G.lane[2]);
    S.pulseOn(['q1', 'q2', 'q3'], a('c002'), 1.2);
    X.hold('h101');
    // ---- B02 · c003: contribution — my cards move, teammates' cards stay beside their own work ----
    t = X0('c003'); S.head(t, B(2), null); S.hide(['q2', 'q3', 'lA', 'lF', 'lI', 'f07', 'f08', 'f09'], t);
    S.to('q1', t + 0.2, G.q1); S.to('caseL', t + 0.3, G.caseT);
    S.rise('hTeam', t + 0.3, G.hTeam); S.to('f02m', t + 0.4, G.team[0]); // Maya's card first leaves the lane the participant's cards will use
    S.rise('hOwn', at('s7_bring') - 0.3, G.hOwn); S.to('f02p', at('s7_bring'), G.own[0]); S.to('f04', at('s7_check'), G.own[1]); S.to('f06', at('s7_label'), G.own[2]);
    S.to('f02n', at('s7_keepMN'), G.team[1]); S.pulseOn(['f02m', 'f02n'], at('s7_keepMN') + 0.4, 1.2);
    // ---- d001 · a fictional model answer about next time, as a dashed proposal card ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t);
    S.rise('caseL', t + 0.3, G.sHead); S.rise('q2', t + 0.4, G.sQ);
    X.line('d001', 'explain:maya', ['Next time, I would', 'could help'], { headFirst: true }); S.rise('mFut', a('d001') + 0.4, G.sA);
    // ---- c004: the proposal stays right of the future boundary ----
    t = X0('c004'); X.roomOut(t); X.clearAll(t); S.head(t + 0.1, B(2), null);
    S.rise('hPast', t + 0.3, G.hPast); ['f02p', 'f04', 'f06'].forEach((id, i) => S.rise(id, t + 0.5 + i * 0.12, G.past[i]));
    S.addLayer('bnd', a('c004') - 0.2); S.rise('hNext', a('c004'), G.hNext); S.rise('f09', a('c004') + 0.3, G.next, { tag: 's07.proposed' });
    S.rise('caseL', t + 0.4, G.caseC4); S.addLayer('ghost', at('s7_quietly')); S.pulseOn(['f09'], at('s7_quietly') + 0.3, 1.2);
    // ---- B03 · d002 · the impact answer: one observation and a stated limit ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t); S.dropLayer('bnd', t); S.dropLayer('ghost', t);
    S.rise('caseL', t + 0.3, G.sHead); S.rise('q3', t + 0.4, G.sQ);
    X.line('d002', 'explain:maya', ['one visitor', 'cannot say'], { headFirst: true });
    S.rise('obs', at('s7_saw') + 0.4, G.sA); S.rise('lim', a('d002'), G.sB);
    // ---- c005: observation and causal inference on separate cards ----
    t = X0('c005'); X.roomOut(t); X.clearAll(t); S.head(t + 0.1, B(3), null); // the B03 kicker waits until the side view has gone
    S.rise('caseL', t + 0.3, G.caseC5); S.rise('obs', t + 0.4, G.obs); S.rise('cause', a('c005'), G.cause); S.rise('lim', at('s7_precise'), G.lim);
    // ---- h102: three lanes with equal weight, the same fact cards ----
    t = X0('h102'); X.clearAll(t);
    S.rise('lA', t + 0.3, G.eqHead[0]); S.rise('lF', t + 0.35, G.eqHead[1]); S.rise('lI', t + 0.4, G.eqHead[2]);
    ['f02p', 'f04', 'f06'].forEach((id, i) => S.rise(id, t + 0.5 + i * 0.1, G.eqA[i]));
    S.rise('f09', t + 0.5, G.eqF, { tag: 's07.proposed' }); S.rise('f07', t + 0.5, G.eqI); S.rise('lim', t + 0.6, G.eqL); S.rise('caseL', t + 0.7, G.caseEq);
    X.hold('h102');
    // ---- B04 · c006: an unfilled private planning surface; the model bank stays apart and collapsed ----
    t = X0('c006'); S.head(t, B(4), null); X.clearAll(t);
    S.rise('pHead', at('s7_try'), G.pHead); S.rise('pBoard', at('s7_try') + 0.3, G.pBoard); S.rise('caseL', at('s7_fiction'), G.caseP); S.rise('pBlank', at('s7_fiction') + 0.4, G.pBlank);
    // ---- c007: final calm board ----
    t = X0('c007'); X.clearAll(t);
    S.rise('cQ', at('s7_notice'), G.endHead[0]); S.rise('e0', at('s7_notice') + 0.2, G.endBox[0]);
    S.rise('cF', at('s7_make'), G.endHead[1]); S.rise('e1', at('s7_make') + 0.2, G.endBox[1]);
    S.rise('cL', at('s7_make') + 0.6, G.endHead[2]); S.rise('e2', at('s7_make') + 0.8, G.endBox[2]);
    S.rise('endLim', at('s7_pause'), G.endLim); S.title(at('s7_aim'), 's07.end');
  }
  global.L06Scenes = { setup };
})(window);
