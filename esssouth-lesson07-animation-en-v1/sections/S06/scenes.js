/*
 * L07.S06 · Rehearse a Small Repair. Section adapter (tokens, rects, timing by cue starts and anchors).
 * A fresh excerpt: Maya offers F04, then h100 shows the chosen 3-second pause as a resting room with no bubble (no timer,
 * warning or threshold). Gate L07.I03 (private rehearsal): the private board is never filled; the model sits in its own
 * "One possible next move" frame; Noah's reply stays a proposal with no information source; f101 keeps writing a question
 * apart from getting answers. Interaction flags come from the baseline (repairSucceeded / proposalAdopted stay false).
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C3 = [150, 700, 1250];
  const G = {
    res: C3.map((x) => R(x, 440, 520, 100, 28)), resC: R(560, 600, 800, 56, 26),
    caseB: R(150, 290, 460, 50, 24), reset: R(630, 290, 620, 50, 24), prompt: R(150, 370, 1620, 190, 30), tM: R(150, 610, 760, 76, 26), tG: R(1010, 610, 760, 76, 26), status: R(560, 716, 800, 56, 26),
    sCase: R(1140, 150, 690, 50, 24), sQuote: R(1140, 214, 690, 100, 28), sM: R(1140, 350, 690, 60, 26), sG: R(1140, 420, 690, 60, 26), sInt: R(1140, 496, 690, 44, 22),
    quoteC: R(560, 300, 800, 90, 28), pauseC: R(560, 404, 800, 78, 26), aM: R(150, 560, 760, 76, 26), aG: R(1010, 560, 760, 76, 26), gap: R(1010, 680, 760, 76, 26),
    ask: R(150, 420, 760, 100, 30), wait: R(1010, 420, 760, 100, 30), lim: R(560, 580, 800, 56, 26),
    pQuote: R(150, 370, 760, 90, 28), pM: R(150, 490, 760, 76, 26), pG: R(150, 586, 760, 76, 26), blank: R(1010, 370, 760, 400, 30), pScope: R(150, 700, 760, 56, 26),
    priv: R(150, 330, 1620, 56, 26), board: R(150, 400, 1620, 300, 30), space: R(560, 716, 800, 56, 26),
    modes: [R(150, 420, 520, 90, 26), R(700, 420, 520, 90, 26), R(1250, 420, 520, 90, 26)],
    sFrame: R(1120, 132, 730, 650), sHead: R(1140, 148, 690, 54, 24), sFirst: R(1140, 216, 690, 76, 26), sQ: R(1140, 306, 690, 84, 26),
    sProp: R(1140, 406, 690, 76, 26), sOpen: R(1140, 532, 690, 76, 26),
    mFrame: R(150, 300, 1620, 520), mHead: R(190, 316, 820, 54, 26), mFirst: R(190, 390, 760, 76, 26), mQ: R(190, 486, 760, 84, 26), mProp: R(1010, 390, 720, 76, 26), mOpen: R(1010, 520, 720, 76, 26),
    mAn: R(190, 640, 760, 76, 26), mLim: R(1010, 620, 720, 66, 26), mRem: R(1010, 700, 720, 66, 26),
    rv: [R(150, 470, 760, 110, 30), R(1010, 470, 760, 110, 30)],
    rsp: C3.map((x) => R(x, 420, 520, 90, 28)), rLim: R(560, 580, 800, 56, 26),
    revO: R(150, 330, 1620, 66, 26), blank2: R(150, 420, 1620, 300, 30), revOpen: R(560, 740, 800, 56, 26),
    dOpen: R(560, 600, 800, 84, 28), eM: R(150, 440, 760, 76, 26), eG: R(1010, 440, 760, 76, 26)
  };

  function setup(E, ctx) {
    const K = global.L07Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('sFrame', G.sFrame, 'ctx frame', '', 'token.default'); tok('blank', G.blank, 'note', '', 'token.note'); // containers first
    ['x.r.gap', 'x.r.ask', 'x.r.room'].forEach((k, i) => tok('r' + i, G.res[i], 'step plan', L(k), 'token.step'));
    tok('resC', G.resC, 'chipcard margin', L('repair.resources'), 'token.chip');
    tok('caseL', G.caseB, 'framehead', L('x.caseLabel'), 'token.frame'); tok('reset', G.reset, 'framehead', L('excerpt.reset'), 'token.frame');
    tok('prompt', G.prompt, 'example', L('prompt.exact'), 'token.quoteLong', { tag: 'x.ref' });
    tok('tM', G.tM, 'goal', L('task.meet'), 'token.step'); tok('tG', G.tG, 'goal', L('task.group'), 'token.step'); tok('status', G.status, 'chipcard margin', L('task.status'), 'token.chip');
    tok('quote', G.sQuote, 'proposal', L('baseline.quote'), 'token.step'); tok('int', G.sInt, 'hint', L('x.interval'), 'token.hint');
    tok('pause', G.pauseC, 'note unobserved', L('baseline.pause'), 'token.note'); tok('gap', G.gap, 'question', L('baseline.gap'), 'token.question');
    tok('ask', G.ask, 'step plan', L('preparation.ask'), 'token.step'); tok('wait', G.wait, 'step plan', L('preparation.wait'), 'token.step'); tok('lim', G.lim, 'chipcard margin', L('preparation.limit'), 'token.chip');
    tok('pScope', G.pScope, 'chipcard margin', L('planning.scope'), 'token.chip');
    tok('priv', G.priv, 'chipcard margin', L('rehearsal.private'), 'token.chip'); tok('board', G.board, 'note', '', 'token.note'); tok('space', G.space, 'hint', L('rehearsal.space'), 'token.hint');
    tok('m0', G.modes[0], 'step plan', L('mode.watch'), 'token.step'); tok('m1', G.modes[1], 'step plan', L('mode.practice'), 'token.step'); tok('m2', G.modes[2], 'step plan', L('mode.model'), 'token.step');
    tok('mHead', G.sHead, 'framehead', L('model.label'), 'token.frame');
    tok('mFirst', G.sFirst, 'proposal', L('model.first'), 'token.step'); tok('mQ', G.sQ, 'question', L('model.question'), 'token.question');
    tok('mProp', G.sProp, 'proposal', L('model.proposal'), 'token.step', { tag: 'model.status' }); tok('mOpen', G.sOpen, 'question', L('model.open'), 'token.question');
    tok('mAn', G.mAn, 'idea', L('model.analysis'), 'token.idea'); tok('mLim', G.mLim, 'step gap', L('model.limit'), 'token.step'); tok('mRem', G.mRem, 'step gap', L('model.remaining'), 'token.step');
    tok('rv0', G.rv[0], 'question', L('review.connection'), 'token.question'); tok('rv1', G.rv[1], 'question', L('review.question'), 'token.question');
    ['x.resp1', 'x.resp2', 'x.resp3'].forEach((k, i) => tok('rs' + i, G.rsp[i], 'step plan', L(k), 'token.step'));
    tok('rLim', G.rLim, 'chipcard margin', L('response.limit'), 'token.chip');
    tok('revO', G.revO, 'chipcard margin', L('revision.options'), 'token.chip'); tok('revOpen', G.revOpen, 'hint', L('revision.open'), 'token.hint');
    tok('dOpen', G.dOpen, 'proposal', L('decision.open'), 'token.step');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('rel'); Rx.dline(E, l, 'rel.a', 'M 900 486 C 900 520, 530 520, 530 552', '#9DB6E0'); Rx.head(E, l, 'rel.h', 530, 556, 'down', '#9DB6E0');
    Rx.dline(E, l, 'rel.b', 'M 1020 486 C 1020 520, 1390 520, 1390 552', '#B9C5D6'); Rx.qmark(E, l, 'rel.q', 1230, 506);
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L07.S06.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: optional repair resources (not a sequence) ----
    S.head(X0('c001') + 0.1, B(1), null); S.title(at('s6_whole') + 0.6, 'repair.scope');
    S.rise('r0', at('s6_gap'), G.res[0]); S.rise('r1', at('s6_ask'), G.res[1]); S.rise('r2', at('s6_room'), G.res[2]); S.rise('resC', a('c001'), G.resC);
    // ---- c002: explicit reset; exact prompt as reference; two aims; nothing adopted ----
    let t = X0('c002'); S.title(t, null); X.clearAll(t);
    S.rise('caseL', at('s6_fresh'), G.caseB); S.rise('reset', at('s6_fresh') + 0.2, G.reset); S.rise('prompt', at('s6_considering'), G.prompt);
    S.rise('tM', a('c002') + 0.3, G.tM); S.rise('tG', a('c002') + 0.6, G.tG); S.rise('status', at('s6_none'), G.status);
    // ---- d001 · Maya offers F04 ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t, ['caseL']); S.to('caseL', t + 0.1, G.sCase);
    X.line('d001', 'propose:learner', ['exchange names and interests'], { headFirst: true }); S.rise('quote', a('d001') + 0.3, G.sQuote);
    // ---- h100 · the chosen 3-second pause: no bubble, at rest; proposal and aims visible ----
    const P = X.cue('h100'); S.hide(['bubL'], P.start); X.neutral(S, P.start + 0.1);
    S.rise('tM', P.start + 0.1, G.sM); S.rise('tG', P.start + 0.2, G.sG); S.rise('int', P.start + 0.3, G.sInt);
    // ---- c003: a neutral pause marker; the possible first-aim link and the missing second-aim link ----
    t = X0('c003'); X.roomOut(t); S.head(t + 0.1, B(1), null); S.hide(['int', 'caseL'], t);
    S.to('quote', t + 0.2, G.quoteC); S.rise('pause', at('s6_brief'), G.pauseC, { text: L('baseline.pause') }); S.to('tM', t + 0.3, G.aM); S.to('tG', t + 0.4, G.aG);
    S.addLayer('rel', at('s6_nobody')); S.rise('gap', a('c003'), G.gap);
    // ---- B02 · c004: ask about the link, or leave space; no threshold ----
    t = X0('c004'); S.head(t, B(2), null); X.clearAll(t); S.dropLayer('rel', t);
    S.rise('ask', at('s6_build'), G.ask); S.rise('wait', at('s6_leave'), G.wait); S.rise('lim', at('s6_noRule'), G.lim);
    // ---- c005 + h101: F04 and the two aims beside a blank private area ----
    t = X0('c005'); X.clearAll(t);
    S.rise('quote', at('s6_prepare'), G.pQuote); S.rise('tM', at('s6_prepare') + 0.2, G.pM); S.rise('tG', at('s6_prepare') + 0.3, G.pG);
    S.rise('blank', at('s6_prepare') + 0.5, G.blank, { text: '' }); S.title(at('s6_prepare') + 0.3, 'planning.prompt'); S.rise('pScope', at('s6_notChoosing'), G.pScope);
    X.hold('h101');
    // ---- B03 · c006 + c007: one privacy note, a blank workspace; how Watch and Practice differ ----
    t = X0('c006'); S.head(t, B(3), null); S.title(t, null); X.clearAll(t);
    S.title(at('s6_try') - 0.2, 'rehearsal.prompt'); S.rise('priv', at('s6_private'), G.priv); S.rise('board', at('s6_try') + 0.5, G.board, { text: '' }); S.rise('space', at('s6_aim'), G.space);
    t = X0('c007'); S.hide(['priv', 'board', 'space'], t);
    S.rise('m0', at('s6_watch'), G.modes[0]); S.rise('m1', at('s6_practice'), G.modes[1]); S.rise('m2', at('s6_example'), G.modes[2]);
    // ---- gate L07.I03 ----
    X.gate();
    // ---- model route: one possible next move in its own frame ----
    if (X.has('d101')) {
      t = X0('d101'); S.head(t, null, null); S.title(t, null); X.clearAll(t);
      S.rise('sFrame', t + 0.3, G.sFrame); S.rise('mHead', t + 0.5, G.sHead);
      X.line('d101', 'ask:maya', ['could help people meet', 'How could they also help'], { headFirst: true });
      S.rise('mFirst', at('s6_could') + 0.4, G.sFirst); S.rise('mQ', a('d101') + 0.4, G.sQ);
      t = X0('d102'); X.line('d102', 'propose:learner', ['Pairs could write one question', 'where the answers would come from']); S.rise('mProp', at('s6_pairs') + 0.5, G.sProp); S.rise('mOpen', a('d102') + 0.3, G.sOpen);
      t = X0('f101'); X.roomOut(t); S.head(t + 0.1, B(3), null);
      S.to('sFrame', t + 0.1, G.mFrame); S.to('mHead', t + 0.15, G.mHead); S.to('mFirst', t + 0.2, G.mFirst); S.to('mQ', t + 0.25, G.mQ); S.to('mProp', t + 0.3, G.mProp); S.to('mOpen', t + 0.35, G.mOpen);
      S.rise('mAn', at('sM_picks') + 0.6, G.mAn); S.rise('mLim', at('sM_writing'), G.mLim); S.rise('mRem', a('f101'), G.mRem);
    }
    // ---- B04 · c008: the same review for every route ----
    t = X0('c008'); X.roomOut(t); X.clearAll(t); S.head(t, B(4), null); S.title(t, null);
    S.rise('rv0', at('s6_check'), G.rv[0]); S.rise('rv1', at('s6_check') + 1.2, G.rv[1]);
    // ---- c009: possible next responses as conditional options ----
    t = X0('c009'); S.hide(['rv0', 'rv1'], t); S.title(t + 0.3, 'response.listen');
    S.rise('rs0', at('s6_suggest'), G.rsp[0]); S.rise('rs1', at('s6_clar'), G.rsp[1]); S.rise('rs2', at('s6_time'), G.rsp[2]); S.rise('rLim', a('c009') + 0.4, G.rLim);
    // ---- c010 + h102: optional revision cues; a blank private area ----
    t = X0('c010'); S.title(t, null); X.clearAll(t);
    S.rise('revO', at('s6_another'), G.revO); S.rise('board', at('s6_another') + 0.4, G.blank2, { text: '' }); S.rise('revOpen', at('s6_keep'), G.revOpen);
    X.hold('h102');
    // ---- c011: close with the shared task and both aims still open ----
    t = X0('c011'); X.clearAll(t); S.title(at('s6_small') + 0.4, 'recap');
    S.rise('tM', at('s6_eventual'), G.eM); S.rise('tG', at('s6_eventual') + 0.2, G.eG); S.rise('dOpen', a('c011'), G.dOpen);
  }
  global.L07Scenes = { setup };
})(window);
