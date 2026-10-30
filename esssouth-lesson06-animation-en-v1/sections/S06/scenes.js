/*
 * L06.S06 · Rehearse a Truthful Account. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Two private routes (own truthful experience / labelled fiction) stay separate; the fictional case is a reference panel,
 * never copied into the private area. Gate L06.I03 (private rehearsal): the blank rehearsal board is never filled; the
 * model is a "Fictional model account" in its own frame, Maya appears only as a later rehearsal partner, and the future
 * naming list stays in "Next time / Proposed". Private flags come from the interaction baseline (experienceVerified false).
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    rT: R(150, 420, 760, 300, 30), rF: R(1010, 420, 760, 300, 30),
    pSpace: R(150, 400, 760, 300, 30), pPriv: R(150, 720, 760, 66, 26), caseR: R(1010, 400, 760, 50, 24), ref: R(1010, 470, 760, 84, 28),
    plan: R(150, 470, 1620, 84, 28),
    own: [R(150, 400, 800, 84, 28), R(150, 496, 800, 84, 28), R(150, 592, 800, 84, 28)], pSp: R(1060, 400, 710, 300, 30),
    known: R(150, 400, 760, 260, 30), bnd: R(1010, 400, 760, 260, 30), vis: R(560, 690, 800, 84, 28),
    chipP: R(150, 400, 760, 60, 26), chipF: R(1010, 400, 760, 60, 26), board: R(150, 500, 1620, 310, 30),
    modes: [R(150, 396, 520, 90, 26), R(700, 396, 520, 90, 26), R(1250, 396, 520, 90, 26)],
    sFrame: R(1120, 132, 730, 650), sHead: R(1140, 148, 690, 54, 24), sOwn: R(1140, 216, 690, 84, 26), sObs: R(1140, 314, 690, 84, 26), sLim: R(1140, 412, 690, 76, 26),
    sMaya: R(1140, 512, 690, 50, 22), sFU: R(1140, 576, 690, 84, 26),
    mFrame: R(150, 300, 1620, 520), mHead: R(190, 316, 820, 54, 26), mOwn: R(190, 390, 760, 84, 26), mObs: R(190, 490, 760, 84, 26), mLim: R(190, 590, 760, 76, 26),
    hFut: R(1010, 390, 720, 44, 28), mRef: R(1010, 444, 720, 100, 28), mBnd: R(1010, 640, 720, 54, 22),
    rv: [R(150, 470, 760, 110, 30), R(1010, 470, 760, 110, 30)],
    revO: R(150, 420, 1620, 70, 28), blank2: R(150, 520, 1620, 270, 30)
  };

  function setup(E, ctx) {
    const K = global.L06Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('sFrame', G.sFrame, 'ctx frame', '', 'token.default'); // container first
    tok('rT', G.rT, 'note', L('choice.true'), 'token.note'); tok('rF', G.rF, 'note', L('choice.fiction'), 'token.note', { tag: 'x.caseLabel' });
    tok('pPriv', G.pPriv, 'chipcard margin', L('privacy.choice'), 'token.chip');
    tok('caseL', G.caseR, 'framehead', L('x.caseLabel'), 'token.frame'); tok('ref', G.ref, 'step plan', L('case.reference'), 'token.step');
    tok('plan', G.plan, 'chipcard margin', L('planning.options'), 'token.chip');
    tok('o0', G.own[0], 'idea', L('ownership.participant'), 'token.idea'); tok('o1', G.own[1], 'step', L('ownership.maya'), 'token.step'); tok('o2', G.own[2], 'step', L('ownership.noah'), 'token.step');
    tok('pSp', G.pSp, 'note', L('personal.space'), 'token.note');
    tok('known', G.known, 'note', L('preparation.known'), 'token.note'); tok('bnd', G.bnd, 'note', L('preparation.boundary'), 'token.note');
    tok('vis', G.vis, 'fact', L('model.observed'), 'token.step', { tag: 'x.caseLabel' });
    tok('chipP', G.chipP, 'chipcard margin', L('rehearsal.private'), 'token.chip'); tok('chipF', G.chipF, 'chipcard margin', L('rehearsal.fiction'), 'token.chip');
    tok('board', G.board, 'note', '', 'token.note');
    tok('m0', G.modes[0], 'step plan', L('mode.watch'), 'token.step'); tok('m1', G.modes[1], 'step plan', L('mode.practice'), 'token.step'); tok('m2', G.modes[2], 'step plan', L('mode.limit'), 'token.step');
    tok('mHead', G.sHead, 'framehead', L('model.label'), 'token.frame'); tok('mOwn', G.sOwn, 'idea', L('model.own'), 'token.idea');
    tok('mObs', G.sObs, 'fact', L('model.observed'), 'token.step'); tok('mLim', G.sLim, 'step gap', L('model.limit'), 'token.step');
    tok('mMaya', G.sMaya, 'framehead', L('model.maya'), 'token.frame'); tok('mFU', G.sFU, 'question', L('model.followup'), 'token.question');
    tok('hFut', G.hFut, 'colhead dashed', L('x.future'), 'token.colhead'); tok('mRef', G.mRef, 'proposal', L('model.reflection'), 'token.step', { tag: 'model.notdone' });
    tok('mBnd', G.mBnd, 'framehead', L('model.boundary'), 'token.frame');
    tok('rv0', G.rv[0], 'question', L('review.own'), 'token.question'); tok('rv1', G.rv[1], 'question', L('review.evidence'), 'token.question');
    tok('fu0', G.rv[0], 'question', L('followup.future'), 'token.question'); tok('fu1', G.rv[1], 'question', L('followup.evidence'), 'token.question');
    tok('revO', G.revO, 'chipcard margin', L('revision.options'), 'token.chip');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('div'); E.dashed(l, 'div.a', 'M 960 400 L 960 790', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L06.S06.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: two separate private routes ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('rT', at('s6_truthful'), G.rT); S.addLayer('div', at('s6_fiction') - 0.2); S.rise('rF', at('s6_fiction'), G.rF);
    // ---- c002: privacy, the fictional case as a separate reference, the private space ----
    let t = X0('c002'); S.hide(['rT', 'rF'], t);
    S.rise('board', t + 0.3, G.pSpace, { text: L('personal.space') }); S.rise('pPriv', at('s6_omit'), G.pPriv); S.rise('caseL', at('s6_ref'), G.caseR); S.rise('ref', at('s6_ref') + 0.3, G.ref);
    // ---- c003: optional planning resources (not numbered) ----
    t = X0('c003'); S.hide(['board', 'pPriv', 'caseL', 'ref'], t); S.dropLayer('div', t);
    S.rise('plan', at('s6_which'), G.plan); S.title(at('s6_plan') - 0.2, 'planning.rule');
    // ---- B02 · c004: the established role map, separate from the personal area ----
    t = X0('c004'); S.head(t, B(2), null); S.title(t, null); S.hide(['plan'], t);
    S.rise('caseL', at('s6_separate'), R(150, 330, 620, 50, 24)); S.rise('o0', at('s6_drawing'), G.own[0]); S.rise('o1', at('s6_listing'), G.own[1]); S.rise('o2', at('s6_listing') + 0.3, G.own[2]);
    S.addLayer('div', at('s6_separate') + 0.3); S.rise('pSp', at('s6_separate') + 0.5, G.pSp);
    // ---- c005 + h101: known and boundary regions unfilled; the one-visitor card is a reference ----
    t = X0('c005'); S.hide(['o0', 'o1', 'o2', 'pSp', 'caseL'], t); S.dropLayer('div', t);
    S.rise('known', at('s6_identify'), G.known); S.rise('bnd', at('s6_identify') + 0.4, G.bnd); S.rise('vis', at('s6_visitor'), G.vis);
    X.hold('h101');
    // ---- B03 · c006 + c007: private rehearsal board, fiction and private routes kept apart ----
    t = X0('c006'); S.head(t, B(3), null); S.hide(['known', 'bnd', 'vis'], t);
    S.title(at('s6_rehearse') - 0.2, 'rehearsal.prompt'); S.rise('board', at('s6_rehearse') + 0.5, G.board, { text: '' });
    S.rise('chipP', at('s6_notRec'), G.chipP); S.rise('chipF', at('s6_fictionL'), G.chipF);
    t = X0('c007'); S.hide(['chipP', 'chipF'], t);
    S.rise('m0', at('s6_watch'), G.modes[0]); S.rise('m1', at('s6_practice'), G.modes[1]); S.rise('m2', at('s6_return'), G.modes[2]);
    // ---- gate L06.I03 ----
    X.gate();
    // ---- model route: a fictional model account in its own frame; Maya as a later rehearsal partner ----
    if (X.has('d101')) {
      t = X0('d101'); S.head(t, null, null); S.title(t, null); X.clearAll(t);
      S.rise('sFrame', t + 0.3, G.sFrame); S.rise('mHead', t + 0.5, G.sHead);
      X.line('d101', 'explain:maya', ['I drew the map', 'I checked with the coordinator', 'I changed my map and told the others', 'one visitor', 'I cannot say how much the guide helped overall'],
        { headFirst: true, bubble: { x: 70, y: 92, w: 1040, h: 330, fs: 30, slot: 'token.quoteLong', cls: 'wide' } });
      S.rise('mOwn', at('s6_changed'), G.sOwn); S.rise('mObs', at('s6_later'), G.sObs); S.rise('mLim', at('s6_survey'), G.sLim);
      t = X0('d102'); X.line('d102', 'ask:learner', ['do differently']); S.rise('mMaya', t + 0.2, G.sMaya); S.rise('mFU', a('d102'), G.sFU);
      t = X0('f101'); X.roomOut(t); S.head(t + 0.1, B(3), null); S.hide(['mMaya', 'mFU'], t);
      S.to('sFrame', t + 0.1, G.mFrame); S.to('mHead', t + 0.15, G.mHead); S.to('mOwn', t + 0.2, G.mOwn); S.to('mObs', t + 0.25, G.mObs); S.to('mLim', t + 0.3, G.mLim);
      S.rise('hFut', at('s6_propose'), G.hFut); S.rise('mRef', at('s6_propose') + 0.3, G.mRef); S.pulseOn(['mRef'], at('s6_keep'), 1.2); S.rise('mBnd', at('s6_study'), G.mBnd);
    }
    // ---- B04 · c008: the same review for every route ----
    t = X0('c008'); X.roomOut(t); X.clearAll(t); S.head(t, B(4), null); S.title(t, null);
    S.rise('rv0', at('s6_clear'), G.rv[0]); S.rise('rv1', at('s6_match'), G.rv[1]);
    // ---- c009: two follow-up categories, introduced afresh ----
    t = X0('c009'); S.hide(['rv0', 'rv1'], t); S.rise('fu0', at('s6_future'), G.rv[0]); S.rise('fu1', at('s6_evidence'), G.rv[1]);
    // ---- c010 + h102: optional revision resources and a blank private area ----
    t = X0('c010'); S.hide(['fu0', 'fu1'], t); S.rise('revO', at('s6_choose'), G.revO); S.rise('board', at('s6_choose') + 0.4, G.blank2, { text: '' }); S.title(at('s6_decide') - 0.2, 'revision.choice');
    X.hold('h102');
    // ---- c011: neutral close ----
    t = X0('c011'); S.title(t, null); S.hide(['revO', 'board'], t); S.title(at('s6_relevant') + 0.6, 'recap');
  }
  global.L06Scenes = { setup };
})(window);
