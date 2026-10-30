/*
 * L08.S06 · Rehearse a Faithful Summary and Next Step. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Frozen reference: the S05 proposal_check snapshot (the participant's proposal read verbatim from the graph; Maya's and
 * Noah's replies as attributed quotes). Gate L08.I03 (private rehearsal): the private area is never filled; the model sits
 * in its own "Authored model, not your response" frame with a wide bubble for its long exact line; Noah's model reply
 * repeats only his timing reservation. Flags come from the interaction baseline (groupAgreementVerified and
 * proposalAdopted stay false).
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C4 = [150, 570, 990, 1410], C3 = [150, 700, 1250];
  const G = {
    snap: R(150, 290, 760, 50, 24), sP: R(150, 360, 1620, 120, 26), sM: R(150, 520, 1620, 76, 26), sN: R(150, 640, 1620, 100, 26),
    stg: C4.map((x) => R(x, 330, 360, 84, 26)), res: R(150, 450, 1620, 66, 26), tin: R(150, 540, 760, 66, 26), dur: R(150, 640, 760, 66, 26), lead: R(1010, 640, 760, 66, 26),
    qM: R(150, 330, 1000, 100, 26), qN: R(150, 480, 1000, 130, 26), stM: R(1180, 340, 590, 84, 26), stN: R(1180, 500, 590, 100, 26), dist: R(560, 660, 800, 56, 26),
    hM: R(150, 340, 1000, 100, 26), hN: R(150, 490, 1000, 130, 26), hBl: R(1180, 340, 590, 380, 30),
    prep: C3.map((x) => R(x, 400, 520, 100, 28)), prepN: C3.map((x) => R(x, 520, 520, 220, 30)),
    priv: R(150, 330, 1620, 56, 26), board: R(150, 400, 1620, 300, 30), focus: R(560, 720, 800, 44, 22),
    sep: R(560, 420, 800, 66, 26),
    sFrame: R(1120, 132, 730, 650), sHead: R(1140, 148, 690, 54, 24), sOp: [R(1140, 220, 690, 66, 26), R(1140, 300, 690, 66, 26)], sRep: R(1140, 400, 690, 84, 26),
    mFrame: R(150, 300, 1620, 500), mHead: R(190, 316, 820, 54, 26), mOp: [R(190, 640, 740, 66, 26), R(970, 640, 760, 66, 26)], mRep: R(970, 390, 760, 84, 26),
    an: [R(190, 390, 740, 66, 26), R(190, 470, 740, 66, 26), R(190, 550, 740, 66, 26)], noA: R(970, 520, 760, 66, 26),
    rv: C3.map((x) => R(x, 420, 520, 100, 28)),
    exH: R(150, 330, 1000, 50, 24), broad: R(150, 400, 1000, 80, 30), narrow: R(150, 540, 1000, 120, 28), mineH: R(1200, 330, 570, 44, 26), mine: R(1200, 386, 570, 330, 30),
    fBl: R(150, 400, 1620, 300, 30),
    chk: R(150, 360, 1620, 90, 28), repH: R(150, 490, 1620, 44, 26), rep: R(150, 546, 1620, 200, 30),
    fc: C3.map((x) => R(x, 440, 520, 100, 28))
  };

  function setup(E, ctx) {
    const K = global.L08Kit.base(E, ctx), tok = K.tok, L = E.label, P = (ctx.D.graph.scenario.snapshots || {}).proposal_check || {};
    tok('sFrame', G.sFrame, 'ctx frame', '', 'token.default'); tok('hBl', G.hBl, 'note', '', 'token.note'); tok('board', G.board, 'note', '', 'token.note');
    [0, 1, 2].forEach((i) => tok('pn' + i, G.prepN[i], 'note', '', 'token.note')); tok('mine', G.mine, 'note', '', 'token.note'); tok('rep', G.rep, 'note', '', 'token.note'); // containers first
    tok('snap', G.snap, 'framehead', L('snapshot.current'), 'token.frame');
    tok('sP', G.sP, 'excerpt', P.proposal || '', 'token.step', { tag: 'x.by.part' });
    tok('sM', G.sM, 'excerpt', L('source.maya.reply'), 'token.step', { tag: 'x.by.maya' }); tok('sN', G.sN, 'excerpt', L('source.noah.reply'), 'token.step', { tag: 'x.by.noah' });
    ['x.st.ex', 'x.st.pairs', 'x.st.share', 'x.st.q'].forEach((k, i) => tok('st' + i, G.stg[i], i === 3 ? 'fact' : 'proposal', L(k), 'token.step'));
    tok('res', G.res, 'fact', L('x.res'), 'token.step'); tok('tin', G.tin, 'chipcard', L('time.inside'), 'token.chip');
    tok('dur', G.dur, 'step gap', L('x.dur'), 'token.step'); tok('lead', G.lead, 'step gap', L('x.lead'), 'token.step');
    tok('stM', G.stM, 'step', L('x.ms'), 'token.step'); tok('stN', G.stN, 'step', L('x.ns'), 'token.step'); tok('dist', G.dist, 'chipcard margin', L('support.distinct'), 'token.chip');
    ['prepare.candidate', 'prepare.support', 'prepare.next'].forEach((k, i) => tok('pr' + i, G.prep[i], 'question', L(k), 'token.question'));
    tok('priv', G.priv, 'chipcard margin', L('practice.private'), 'token.chip'); tok('focus', G.focus, 'hint', L('practice.focus'), 'token.hint');
    tok('sep', G.sep, 'chipcard margin', L('model.separate'), 'token.chip');
    tok('mHead', G.sHead, 'framehead', L('model.status'), 'token.frame'); tok('mRep', G.sRep, 'step', L('model.reply'), 'token.step');
    ['x.a1', 'x.a2', 'x.a3'].forEach((k, i) => tok('an' + i, G.an[i], 'idea', L(k), 'token.idea')); tok('noA', G.noA, 'step gap', L('x.noAdopt'), 'token.step');
    ['review.status', 'review.scope', 'review.next'].forEach((k, i) => tok('rv' + i, G.rv[i], 'question', L(k), 'token.question'));
    tok('exH', G.exH, 'framehead', L('x.ex'), 'token.frame'); tok('broad', G.broad, 'step changed', L('x.broad'), 'token.step'); tok('narrow', G.narrow, 'idea', L('x.narrow'), 'token.idea');
    tok('mineH', G.mineH, 'colhead dashed', L('x.mine'), 'token.colhead');
    tok('chk', G.chk, 'question', L('x.check'), 'token.question'); tok('repH', G.repH, 'colhead dashed', L('handover.reply'), 'token.colhead');
    ['focus.condition', 'focus.status', 'focus.check'].forEach((k, i) => tok('fc' + i, G.fc[i], 'step plan', L(k), 'token.step'));
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('seq'); [510, 930, 1350].forEach((x, i) => { Rx.dline(E, l, 'sq.' + i, `M ${x + 6} 372 L ${x + 44} 372`, '#9DB6E0'); Rx.head(E, l, 'sq.h' + i, x + 50, 372, 'right', '#9DB6E0'); });
    l = ly('rv'); Rx.dline(E, l, 'rv.a', 'M 650 486 L 650 532', '#9DB6E0'); Rx.head(E, l, 'rv.h', 650, 536, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L08.S06.B0' + n, M = X.MOTION;
    const ST = ['st0', 'st1', 'st2', 'st3'];
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: the S05 proposal and replies as a frozen source board ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('snap', at('s6_use'), G.snap);
    S.rise('sP', a('c001') + 0.8, G.sP); S.rise('sM', a('c001') + 1.2, G.sM); S.rise('sN', a('c001') + 1.6, G.sN);
    // ---- c002: the candidate with its limits; durations and leader undecided ----
    let t = X0('c002'); X.clearAll(t);
    ST.forEach((id, i) => S.rise(id, at('s6_cand') + i * 0.3, G.stg[i])); S.addLayer('seq', at('s6_cand') + 1.2); S.rise('tin', a('c002') - 4, G.tin);
    S.rise('res', at('s6_res'), G.res); S.rise('dur', at('s6_no'), G.dur); S.rise('lead', at('s6_no') + 0.5, G.lead); S.title(a('c002') - 0.2, 'candidate.scope');
    // ---- c003: two attributed quotes with short status labels; no consensus icon ----
    t = X0('c003'); S.title(t, null); X.clearAll(t); S.dropLayer('seq', t);
    S.rise('sM', at('s6_maya'), G.qM); S.rise('stM', at('s6_maya') + 0.8, G.stM); S.rise('sN', at('s6_noah'), G.qN); S.rise('stN', at('s6_noah') + 1.0, G.stN); S.rise('dist', at('s6_these'), G.dist);
    // ---- h101: the quotes beside a blank note ----
    const H1 = X.cue('h101'); S.hide(['stM', 'stN', 'dist'], H1.start); S.to('sM', H1.start + 0.2, G.hM); S.to('sN', H1.start + 0.3, G.hN); S.rise('hBl', H1.start + 0.5, G.hBl, { text: '' });
    X.hold('h101');
    // ---- B02 · c004: three optional preparation headings over blank notes ----
    t = X0('c004'); S.head(t, B(2), null); X.clearAll(t);
    S.rise('pr0', at('s6_name'), G.prep[0]); S.rise('pr1', at('s6_incl'), G.prep[1]); S.rise('pr2', at('s6_then'), G.prep[2]);
    [0, 1, 2].forEach((i) => S.rise('pn' + i, at('s6_then') + 0.6 + i * 0.1, G.prepN[i], { text: '' }));
    // ---- c005: one privacy note; the private area blank ----
    t = X0('c005'); X.clearAll(t);
    S.rise('priv', at('s6_nothing'), G.priv); S.rise('board', at('s6_may') + 0.4, G.board, { text: '' }); S.rise('focus', at('s6_part'), G.focus);
    // ---- c006: ordinary wording; back to the source board ----
    t = X0('c006'); X.clearAll(t); S.title(at('s6_choose'), 'wording.clear');
    S.rise('snap', t + 0.3, G.snap); S.rise('sP', t + 0.5, G.sP); S.rise('sM', t + 0.7, G.sM); S.rise('sN', t + 0.9, G.sN);
    // ---- c007: the model stays separate ----
    t = X0('c007'); S.title(t, null); X.clearAll(t); S.rise('sep', at('s6_model'), G.sep);
    // ---- gate L08.I03 ----
    X.gate();
    // ---- model route: a separate authored frame; a wide bubble for the long exact line ----
    if (X.has('d101')) {
      t = X0('d101'); S.head(t, null, null); S.title(t, null); X.clearAll(t);
      S.rise('sFrame', t + 0.3, G.sFrame); S.rise('mHead', t + 0.5, G.sHead); S.rise('dur', t + 0.7, G.sOp[0]); S.rise('lead', t + 0.8, G.sOp[1]);
      X.line('d101', 'propose:maya', ['brief example', 'if the example stays brief', 'Noah supports the example and question time', 'Could we check'],
        { headFirst: true, bubble: { x: 30, y: 92, w: 1090, h: 336, fs: 30, slot: 'token.quoteLong', cls: 'wide' } });
      t = X0('d102'); X.line('d102', 'explain:learner', ["haven't agreed to the full sequence"]); S.rise('mRep', a('d102') + 0.3, G.sRep);
      t = X0('f101'); X.roomOut(t); S.head(t + 0.1, B(2), null);
      S.to('sFrame', t + 0.1, G.mFrame); S.to('mHead', t + 0.15, G.mHead); S.to('dur', t + 0.2, G.mOp[0]); S.to('lead', t + 0.25, G.mOp[1]); S.to('mRep', t + 0.3, G.mRep);
      S.rise('an0', at('sM_conn') + 0.5, G.an[0]); S.rise('an1', at('sM_reports') + 0.5, G.an[1]); S.rise('an2', at('sM_offers') + 0.4, G.an[2]); S.rise('noA', at('sM_nothing'), G.noA);
      S.title(a('f101') + 0.4, 'model.review');
    }
    // ---- B03 · c008: the same review for every route ----
    t = X0('c008'); X.roomOut(t); S.hide(['sFrame', 'mHead', 'mRep', 'an0', 'an1', 'an2', 'noA'], t, 0.01); X.clearAll(t, ['sFrame', 'mHead', 'mRep', 'an0', 'an1', 'an2', 'noA']);
    S.head(t, B(3), null); S.title(t, null);
    S.rise('rv0', at('s6_q1'), G.rv[0]); S.rise('rv1', at('s6_q2'), G.rv[1]); S.rise('rv2', at('s6_q3'), G.rv[2]);
    // ---- c009: revise an authored example (outside the blank private area) ----
    t = X0('c009'); X.clearAll(t);
    S.rise('exH', at('s6_broad'), G.exH); S.rise('broad', at('s6_replace'), G.broad); S.addLayer('rv', at('s6_replace') + 1.0); S.rise('narrow', at('s6_replace') + 1.4, G.narrow);
    S.rise('mineH', at('s6_broad') + 0.4, G.mineH); S.rise('mine', at('s6_broad') + 0.6, G.mine, { text: '' }); S.title(a('c009') - 0.2, 'revision.focus');
    // ---- h102: a blank personal focus card ----
    const H2 = X.cue('h102'); S.title(H2.start, null); X.clearAll(H2.start); S.dropLayer('rv', H2.start); S.rise('board', H2.start + 0.4, G.fBl, { text: '' });
    X.hold('h102');
    // ---- B04 · c010: a proposed check and an unfilled reply slot ----
    t = X0('c010'); S.head(t, B(4), null); X.clearAll(t);
    S.rise('chk', at('s6_after'), G.chk); S.rise('repH', at('s6_after') + 0.6, G.repH); S.rise('rep', at('s6_after') + 0.8, G.rep, { text: '' });
    // ---- c011: three optional focus cards, none selected ----
    t = X0('c011'); X.clearAll(t); ['fc0', 'fc1', 'fc2'].forEach((id, i) => S.rise(id, at('s6_small') + 0.6 + i * 0.6, G.fc[i]));
  }
  global.L08Scenes = { setup };
})(window);
