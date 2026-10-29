/*
 * L03.S06 · Rehearse, Hear a Correction, and Adjust. Section adapter (tokens, rects, timing by cue starts and anchors).
 * "Authored example" is on screen before any cast appears. The misreading sits in a separate material-supply lane; the
 * provisional understanding card travels to the support lane (identity kept). Gate L03.I03 (private rehearsal): the blank
 * rehearsal area is never filled; the model plays in its own framed "One possible reply" and is analysed on a model board.
 * c008 is identical after the model, a skip or a Continue without the model.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    und: R(560, 420, 800, 110, 32),
    scen: R(150, 300, 800, 54, 26), time: R(150, 380, 390, 72, 28), staff: R(560, 380, 390, 72, 28),
    sScen: R(1140, 140, 690, 50, 24), sFrame: R(1120, 206, 730, 360), sIf: R(1140, 220, 690, 54, 24), sHelp: R(1140, 476, 690, 72, 26),
    sPaper: R(1140, 596, 690, 76, 26), sNot: R(1140, 686, 690, 66, 26),
    quote: R(150, 284, 1620, 110, 32), hBefore: R(150, 440, 800, 44, 28), hAfter: R(1060, 440, 710, 44, 28),
    undL: R(150, 494, 800, 100, 30), undR: R(1060, 494, 710, 100, 30), paperL: R(150, 630, 800, 80, 28), helpR: R(1060, 630, 710, 80, 28), repair: R(1060, 760, 420, 64, 26),
    tTime: R(150, 470, 390, 72, 28), tStaff: R(560, 470, 390, 72, 28), blank: R(1060, 440, 710, 330, 30),
    resources: R(150, 436, 1620, 70, 28), mWatch: R(150, 528, 800, 70, 26), mPract: R(1060, 528, 710, 70, 26), rBlank: R(150, 620, 1620, 200, 30),
    mFrameS: R(1120, 132, 730, 610), mHeadS: R(1140, 148, 690, 54, 24), mUpdS: R(1140, 220, 690, 84, 26), mNextS: R(1140, 320, 690, 110, 26), mRemS: R(1140, 520, 690, 84, 26),
    mFrame: R(150, 300, 1620, 520), mHead: R(190, 318, 820, 54, 26), mUpd: R(190, 400, 760, 96, 28), mNext: R(190, 530, 760, 120, 28), mRem: R(1000, 400, 730, 96, 28),
    actual: R(560, 470, 800, 110, 32), corr: R(150, 470, 800, 96, 30), mis: R(1060, 470, 710, 90, 28), add: R(1060, 600, 710, 90, 28),
    rMean: R(150, 500, 800, 120, 32), rMove: R(1060, 500, 710, 120, 32), endRes: R(150, 700, 1620, 70, 28)
  };

  function setup(E, ctx) {
    const K = global.L03Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('sFrame', G.sFrame, 'ctx frame', '', 'token.default'); tok('mFrame', G.mFrameS, 'ctx frame', '', 'token.default'); // containers first
    tok('und', G.und, 'step tentative', L('understanding.state'), 'token.step');
    tok('scen', G.scen, 'framehead', L('scenario.label'), 'token.frame'); tok('time', G.time, 'chipcard', L('task.time'), 'token.chip'); tok('staff', G.staff, 'chipcard', L('task.staff'), 'token.chip');
    tok('ifHead', G.sIf, 'framehead', L('x.ifFrame'), 'token.frame'); tok('help', G.sHelp, 'idea', L('concern.help'), 'token.idea');
    tok('paper', G.sPaper, 'proposal pending', L('misread.paper'), 'token.step'); tok('notPaper', G.sNot, 'chipcard margin', L('correction.not'), 'token.chip');
    tok('quote', G.quote, 'quote speaker', markup(E.cueText('L03.S06.d003'), ['help with the steps', 'not a shortage of paper']), 'token.quote', { who: 1, spk: 'noah' });
    tok('hBefore', G.hBefore, 'colhead quiet', L('understanding.before'), 'token.colhead'); tok('hAfter', G.hAfter, 'colhead', L('understanding.after'), 'token.colhead');
    tok('repair', G.repair, 'chipcard margin', L('repair.phrase'), 'token.chip');
    tok('blank', G.blank, 'note', L('reflection.meaning'), 'token.note');
    tok('resources', G.resources, 'chipcard margin', L('rehearsal.resources'), 'token.chip');
    tok('mWatch', G.mWatch, 'step plan', L('mode.watch'), 'token.step'); tok('mPract', G.mPract, 'step plan', L('mode.practice'), 'token.step');
    tok('rBlank', G.rBlank, 'note', L('rehearsal.private'), 'token.note');
    tok('mHead', G.mHeadS, 'framehead', L('model.label'), 'token.frame'); tok('mUpd', G.mUpdS, 'idea', L('model.update'), 'token.idea');
    tok('mNext', G.mNextS, 'proposal', L('model.next'), 'token.step'); tok('mRem', G.mRemS, 'question', L('model.remaining'), 'token.question');
    tok('actual', G.actual, 'question', L('review.actual'), 'token.question'); tok('corr', G.corr, 'idea', L('correction.help'), 'token.idea');
    tok('mis', G.mis, 'step changed', L('review.misread'), 'token.step'); tok('add', G.add, 'step changed', L('review.added'), 'token.step');
    tok('rMean', G.rMean, 'question', L('review.meaning'), 'token.question'); tok('rMove', G.rMove, 'question', L('review.move'), 'token.question');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('reqs'); [1240, 1480, 1720].forEach((x, i) => { E.icon(l, 'reqs.p' + i, 'people', x - 40, 290, 72, '#5D6878'); Rx.qmark(E, l, 'reqs.q' + i, x + 44, 290); });
    E.icon(l, 'reqs.staff', 'staff', 1448, 388, 64, '#5D6878');
    l = ly('lane'); E.dashed(l, 'lane.a', 'M 1130 580 L 1840 580', '#B9C5D6');
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 440 L 1005 820', '#9DB6E0');
    l = ly('rp'); Rx.dline(E, l, 'rp.a', 'M 1270 754 L 1270 602', '#B9C5D6');
    l = ly('mdl'); Rx.dline(E, l, 'mdl.a', 'M 958 448 L 992 448', '#9DB6E0'); Rx.head(E, l, 'mdl.h', 998, 448, 'right', '#9DB6E0');
    l = ly('cor'); Rx.dline(E, l, 'cor.a', 'M 958 518 L 1052 518', '#B9C5D6'); Rx.qmark(E, l, 'cor.q', 1005, 494); Rx.dline(E, l, 'cor.b', 'M 958 540 C 1000 540, 1010 646, 1052 646', '#B9C5D6');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L03.S06.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a provisional understanding that can change ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('und', at('s06_wrong'), G.und); S.pulseOn(['und'], a('c001'), 1.2);
    // ---- c002: "Authored example" and the task before any cast ----
    let t = X0('c002'); S.hide(['und'], t);
    S.rise('scen', at('s06_authored'), G.scen); S.rise('time', at('s06_thirty'), G.time); S.rise('staff', at('s06_facil'), G.staff); S.pulseOn(['scen'], at('s06_belongs'), 1.4);
    // ---- d001 · Noah: a conditional support concern inside a labelled If frame ----
    t = X0('d001'); S.head(t, null, null); S.hide(['time', 'staff'], t); S.to('scen', t + 0.1, G.sScen);
    X.line('d001', 'explain:learner', ['If several pairs lose their place at once', 'one facilitator']);
    S.rise('sFrame', at('s06_lose') + 0.6, G.sFrame); S.rise('ifHead', at('s06_lose') + 0.8, G.sIf); S.addLayer('reqs', at('s06_lose') + 1.1, 0.12); S.rise('help', a('d001'), G.sHelp);
    // ---- d002 · You (authored example): a reply in a separate material-supply lane ----
    t = X0('d002'); X.line('d002', 'ask:noah', ['more paper']); S.addLayer('lane', t + 0.4); S.rise('paper', a('d002'), G.sPaper);
    // ---- d003 · Noah points back to the help lane, calmly ----
    t = X0('d003'); X.line('d003', 'explain:learner', ['help with the steps', 'not a shortage of paper']);
    S.pulseOn(['ifHead', 'help'], at('s06_steps'), 1.2); S.put('paper', at('s06_notPaper'), M.focus, { o: 0.4 }); S.rise('notPaper', at('s06_notPaper') + 0.2, G.sNot);
    // ---- B02 · c003: the understanding card moves from the materials lane to the support lane ----
    t = X0('c003'); X.roomOut(t); X.clearAll(t); S.dropLayer('reqs', t); S.dropLayer('lane', t); S.head(t + 0.1, B(2), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('hBefore', t + 0.5, G.hBefore); S.rise('hAfter', t + 0.6, G.hAfter); S.addLayer('div', t + 0.6);
    S.rise('und', at('s06_first'), G.undL); S.rise('paper', at('s06_first') + 0.3, G.paperL, { o: 0 });
    S.to('und', at('s06_clearer'), G.undR); S.rise('help', a('c003') - 0.3, G.helpR); S.pulseOn(['und', 'help'], a('c003'), 1.2);
    S.put('paper', at('s06_morePaper'), M.focus, { o: 0.4 });
    // ---- c004: an optional acknowledgement attached to the updated meaning ----
    t = X0('c004'); S.addLayer('rp', at('s06_thanks') - 0.2); S.rise('repair', at('s06_thanks'), G.repair); S.title(a('c004') - 0.2, 'repair.rule');
    S.pulseOn(['und'], a('c004'), 1.0);
    // ---- c005 + h101: task, corrected quote and a blank thought area ----
    t = X0('c005'); S.title(t, null); S.hide(['hBefore', 'hAfter', 'und', 'paper', 'help', 'repair'], t); S.dropLayer('div', t); S.dropLayer('rp', t);
    S.rise('time', at('s06_before'), G.tTime); S.rise('staff', at('s06_before') + 0.2, G.tStaff); S.rise('blank', at('s06_before') + 0.5, G.blank);
    S.pulseOn(['staff'], a('c005'), 1.2);
    X.hold('h101');
    // ---- B03 · c006 + c007: exact correction, optional resources, a blank rehearsal area, the mode note ----
    t = X0('c006'); S.head(t, B(3), null); S.hide(['time', 'staff', 'blank'], t);
    S.title(at('s06_form') - 0.2, 'rehearsal.prompt'); S.rise('resources', at('s06_acknow'), G.resources); S.rise('rBlank', at('s06_private'), G.rBlank);
    S.pulseOn(['resources'], a('c006'), 1.0);
    t = X0('c007'); S.rise('mWatch', at('s06_watchMode'), G.mWatch); S.rise('mPract', at('s06_practMode'), G.mPract);
    // ---- gate L03.I03 (35 s private opportunity in Watch; Practice waits) ----
    X.gate();
    // ---- model route: one possible reply in its own frame (never in the blank area) ----
    if (X.has('d101')) {
      t = X0('d101'); S.head(t, null, null); S.title(t, null); X.clearAll(t);
      S.rise('mFrame', t + 0.3, G.mFrameS); S.rise('mHead', t + 0.5, G.mHeadS);
      X.line('d101', 'propose:noah', ['Thanks for clarifying', 'several pairs may need help', 'keep a step card visible', 'ask which steps people need help with'], { headFirst: true });
      S.rise('mUpd', a('d101'), G.mUpdS); S.rise('mNext', at('s06_stepCard'), G.mNextS);
      t = X0('d102'); X.line('d102', 'ask:learner', ['A card might help', 'still cannot follow it']); S.rise('mRem', a('d102'), G.mRemS);
      t = X0('f101'); X.roomOut(t); S.head(t + 0.1, B(3), null);
      S.to('mFrame', t + 0.1, G.mFrame); S.to('mHead', t + 0.15, G.mHead); S.to('mUpd', t + 0.2, G.mUpd); S.to('mNext', t + 0.25, G.mNext); S.to('mRem', t + 0.3, G.mRem);
      S.addLayer('mdl', at('s06_mStill')); S.pulseOn(['mUpd'], at('s06_mAck'), 1.2); S.pulseOn(['mRem'], at('s06_mStill'), 1.2); S.title(a('f101') - 0.2, 'model.scope');
    }
    // ---- B04 · c008: the same continuation after model, skip or continue ----
    t = X0('c008'); X.roomOut(t); X.clearAll(t); S.dropLayer('mdl', t); S.head(t, B(4), null); S.title(t, null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('actual', at('s06_same'), G.actual); S.pulseOn(['actual'], a('c008'), 1.0);
    // ---- c009: two labelled inaccurate interpretations next to the exact correction ----
    t = X0('c009'); S.hide(['actual'], t); S.rise('corr', at('s06_adds'), G.corr); S.addLayer('cor', at('s06_materials') - 0.2);
    S.rise('mis', at('s06_materials'), G.mis); S.rise('add', at('s06_cancel'), G.add); S.pulseOn(['add'], a('c009'), 1.0);
    // ---- c010 + h102: understanding and next move kept separate ----
    t = X0('c010'); S.hide(['corr', 'mis', 'add'], t); S.dropLayer('cor', t);
    S.rise('rMean', at('s06_mean'), G.rMean); S.addLayer('div', at('s06_mean') + 0.3); S.rise('rMove', at('s06_help'), G.rMove); S.pulseOn(['rMean'], a('c010'), 1.0);
    X.hold('h102');
    // ---- c011: optional review resources; no forced retry, no automatic advance ----
    t = X0('c011'); S.dropLayer('div', t); S.title(at('s06_another') + 0.4, 'review.focus'); S.rise('resources', at('s06_choose'), G.endRes);
  }
  global.L03Scenes = { setup };
})(window);
