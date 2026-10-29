/*
 * L04.S06 · Rehearse a Constructive Disagreement. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Rehearsal starts from Maya's original statement (labelled), the tool mode unspecified; the full answer is only "an
 * alternative to examine". Gate L04.I03 (private rehearsal): the blank rehearsal area is never filled; the model plays in its
 * own "One possible reply" frame with its If condition shown before any full-answer card. c008 is identical after the model,
 * a skip or a Continue without the model.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    prop: R(560, 470, 800, 100, 32), res: [R(150, 300, 620, 96, 30), R(1150, 300, 620, 96, 30), R(560, 680, 800, 90, 30)],
    time: R(150, 330, 390, 72, 28), probs: R(560, 330, 390, 72, 28), goal: R(150, 430, 800, 90, 30), tool: R(150, 550, 800, 54, 26), propC: R(1060, 330, 710, 100, 30), base: R(1060, 560, 710, 54, 26),
    sBase: R(1140, 150, 690, 54, 24), sProp: R(1140, 226, 690, 90, 28),
    quote: R(150, 284, 1620, 140, 32), exact: R(150, 494, 800, 100, 30), open: R(1060, 494, 710, 90, 30), option: R(1060, 640, 710, 90, 28),
    hM: R(150, 440, 800, 44, 28), hP: R(1060, 440, 710, 44, 28), method: R(150, 494, 800, 100, 30), person: R(1060, 494, 710, 100, 28),
    crit: [R(150, 494, 800, 72, 28), R(150, 584, 800, 72, 28), R(150, 674, 800, 72, 28)], blank: R(1060, 494, 710, 300, 30), evid: R(1060, 806, 710, 40, 22),
    resChip: R(150, 440, 1620, 70, 28), mW: R(150, 530, 800, 70, 26), mP: R(1060, 530, 710, 70, 26), rBlank: R(150, 620, 1620, 200, 30), mStat: R(150, 440, 800, 54, 24),
    sFrame: R(1120, 132, 730, 620), sHead: R(1140, 148, 690, 54, 24), sCond: R(1140, 216, 690, 80, 26), sConc: R(1140, 310, 690, 84, 26), sMProp: R(1140, 408, 690, 100, 26), sRem: R(1140, 530, 690, 84, 26),
    mFrame: R(150, 300, 1620, 520), mHead: R(190, 316, 820, 54, 26), mCond: R(190, 390, 760, 80, 28), mConc: R(190, 486, 760, 84, 28), mProp: R(190, 586, 760, 100, 28), mRem: R(1000, 486, 730, 84, 28), mSt: R(1000, 620, 730, 54, 24),
    rev: [R(150, 494, 520, 130, 30), R(700, 494, 520, 130, 30), R(1250, 494, 520, 130, 30)], over: R(560, 494, 800, 110, 30),
    end: R(150, 470, 1620, 70, 28)
  };

  function setup(E, ctx) {
    const K = global.L04Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('sFrame', G.sFrame, 'ctx frame', '', 'token.default'); // container first
    tok('prop', G.prop, 'proposal', L('proposal.quote'), 'token.step');
    tok('rI', G.res[0], 'question', L('resource.idea'), 'token.question'); tok('rR', G.res[1], 'question', L('resource.reason'), 'token.question'); tok('rN', G.res[2], 'question', L('resource.next'), 'token.question');
    tok('time', G.time, 'chipcard', L('task.time'), 'token.chip'); tok('probs', G.probs, 'chipcard', L('task.problems'), 'token.chip'); tok('goal', G.goal, 'goal', L('task.goal'), 'token.step');
    tok('tool', G.tool, 'framehead', L('tool.status'), 'token.frame'); tok('base', G.base, 'framehead', L('baseline.original'), 'token.frame');
    tok('quote', G.quote, 'quote speaker', markup(E.cueText('L04.S06.d001'), ['as soon as a problem becomes difficult']), 'token.quote', { who: 1, spk: 'maya' });
    tok('exact', G.exact, 'excerpt proposed', L('meaning.exact'), 'token.step'); tok('open', G.open, 'question', L('meaning.open'), 'token.question'); tok('option', G.option, 'step plan', L('meaning.option'), 'token.step');
    tok('hM', G.hM, 'colhead', L('x.lane.method'), 'token.colhead'); tok('hP', G.hP, 'colhead dashed', L('x.lane.person'), 'token.colhead');
    tok('method', G.method, 'concern', L('contrast.method'), 'token.step'); tok('person', G.person, 'step gap', L('contrast.person'), 'token.step');
    tok('c1', G.crit[0], 'chipcard', L('x.c.time'), 'token.chip'); tok('c2', G.crit[1], 'chipcard', L('x.c.start'), 'token.chip'); tok('c3', G.crit[2], 'chipcard', L('x.c.verify'), 'token.chip');
    tok('blank', G.blank, 'note', L('reflection.reason'), 'token.note'); tok('evid', G.evid, 'hint', L('reflection.evidence'), 'token.hint');
    tok('resChip', G.resChip, 'chipcard margin', L('rehearsal.resources'), 'token.chip');
    tok('mW', G.mW, 'step plan', L('mode.watch'), 'token.step'); tok('mP', G.mP, 'step plan', L('mode.practice'), 'token.step');
    tok('rBlank', G.rBlank, 'note', L('rehearsal.private'), 'token.note'); tok('mStat', G.mStat, 'framehead', L('mode.status'), 'token.frame');
    tok('mHead', G.sHead, 'framehead', L('model.label'), 'token.frame'); tok('mCond', G.sCond, 'step tentative', L('model.condition'), 'token.step');
    tok('mConc', G.sConc, 'concern', L('model.concern'), 'token.step'); tok('mProp', G.sMProp, 'proposal', L('model.proposal'), 'token.step');
    tok('mRem', G.sRem, 'question', L('model.remaining'), 'token.question'); tok('mSt', G.mSt, 'framehead', L('model.status'), 'token.frame');
    ['review.actual', 'review.relevant', 'review.next'].forEach((k, i) => tok('rv' + i, G.rev[i], 'question', L(k), 'token.question'));
    tok('over', G.over, 'step changed', L('review.overclaim'), 'token.step', { tag: 'review.boundary' });
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('res'); Rx.dline(E, l, 'res.a', 'M 700 404 C 720 440, 760 450, 790 462', '#B9C5D6'); Rx.dline(E, l, 'res.b', 'M 1220 404 C 1200 440, 1160 450, 1130 462', '#B9C5D6'); Rx.dline(E, l, 'res.c', 'M 960 578 L 960 672', '#B9C5D6');
    l = ly('task'); E.icon(l, 'task.clock', 'clock', 1060, 650, 56, '#5D6878'); E.path(l, 'task.rail', 'M 1136 678 L 1770 678', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'task.t0', 'M 1136 662 L 1136 694', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'task.t1', 'M 1770 662 L 1770 694', { stroke: '#B9C5D6', 'stroke-width': 4 });
    l = ly('opt'); Rx.dline(E, l, 'opt.a', 'M 1415 592 L 1415 632', '#B9C5D6'); Rx.qmark(E, l, 'opt.q', 1455, 612);
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 440 L 1005 620', '#9DB6E0');
    l = ly('mdl'); Rx.dline(E, l, 'mdl.a', 'M 958 528 L 992 528', '#9DB6E0'); Rx.head(E, l, 'mdl.h', 998, 528, 'right', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L04.S06.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: optional resources around one central proposal (not numbered) ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('prop', at('s6_bring'), G.prop); S.addLayer('res', at('s6_which') - 0.3, 0.2);
    S.rise('rI', at('s6_which'), G.res[0]); S.rise('rR', at('s6_why'), G.res[1]); S.rise('rN', at('s6_next'), G.res[2]);
    // ---- c002: the unchanged task; rehearsal from the original statement; mode unspecified again ----
    let t = X0('c002'); S.hide(['rI', 'rR', 'rN'], t); S.dropLayer('res', t); S.to('prop', t + 0.2, G.propC);
    S.rise('time', at('s6_return'), G.time); S.rise('probs', at('s6_return') + 0.3, G.probs); S.addLayer('task', at('s6_return') + 0.6, 0.1);
    S.rise('goal', at('s6_goal'), G.goal); S.rise('tool', at('s6_tool'), G.tool); S.put('prop', a('c002') - 0.4, M.focus, { tag: 'plan.status' });
    S.rise('base', a('c002'), G.base); S.pulseOn(['base'], a('c002') + 0.5, 1.2);
    // ---- d001 · Maya's exact words; no character labels ----
    t = X0('d001'); S.head(t, null, null); S.hide(['time', 'probs', 'goal', 'tool'], t); S.dropLayer('task', t);
    S.to('base', t + 0.1, G.sBase); S.to('prop', t + 0.2, G.sProp, { tag: '' });
    X.line('d001', 'propose:learner', ['as soon as a problem becomes difficult']);
    // ---- c003: exact wording vs possible interpretations; full answer = an alternative to examine ----
    t = X0('c003'); X.roomOut(t); S.hide(['base', 'prop'], t); S.head(t + 0.1, B(1), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('exact', at('s6_choose'), G.exact); S.rise('open', a('c003'), G.open);
    S.addLayer('opt', at('s6_risk') - 0.2); S.rise('option', at('s6_risk'), G.option); S.pulseOn(['exact'], at('s6_risk') + 2.0, 1.0);
    // ---- B02 · c004: the method, not the person ----
    t = X0('c004'); S.head(t, B(2), null); S.hide(['exact', 'open', 'option'], t); S.dropLayer('opt', t);
    S.rise('hM', at('s6_method'), G.hM); S.addLayer('div', at('s6_lazy') - 0.3); S.rise('hP', at('s6_lazy'), G.hP); S.rise('person', at('s6_lazy') + 0.3, G.person);
    S.rise('method', at('s6_hide'), G.method); S.pulseOn(['method'], a('c004'), 1.2);
    // ---- c005 + h101: criteria visible; a blank private planning space ----
    t = X0('c005'); S.hide(['hM', 'hP', 'method', 'person'], t); S.dropLayer('div', t);
    S.rise('blank', at('s6_identify'), G.blank); S.rise('evid', at('s6_know'), G.evid);
    S.rise('c1', at('s6_still'), G.crit[0]); S.rise('c2', at('s6_still') + 0.3, G.crit[1]); S.rise('c3', at('s6_still') + 0.6, G.crit[2]);
    X.hold('h101');
    // ---- B03 · c006 + c007: exact quote, optional resources, a blank rehearsal area, the mode note ----
    t = X0('c006'); S.head(t, B(3), null); S.hide(['blank', 'evid', 'c1', 'c2', 'c3'], t);
    S.title(at('s6_try') - 0.2, 'rehearsal.prompt'); S.rise('resChip', at('s6_options'), G.resChip); S.rise('rBlank', at('s6_nothing'), G.rBlank);
    t = X0('c007'); S.rise('mW', at('s6_watch'), G.mW); S.rise('mP', at('s6_practice'), G.mP); S.rise('mStat', a('c007'), G.mStat); S.hide(['resChip'], at('s6_watch') - 0.3);
    // ---- gate L04.I03 ----
    X.gate();
    // ---- model route: One possible reply in its own frame; the If condition first ----
    if (X.has('d101')) {
      t = X0('d101'); S.head(t, null, null); S.title(t, null); X.clearAll(t);
      S.rise('sFrame', t + 0.3, G.sFrame); S.rise('mHead', t + 0.5, G.sHead);
      X.line('d101', 'propose:maya', ['If using the tool means opening a full answer immediately', 'might follow its steps without understanding them', 'try a step when we can', 'check what it suggests'], { headFirst: true, bubble: { x: 70, y: 100, w: 1040, h: 300, fs: 30 } });
      S.rise('mCond', a('d101') + 0.4, G.sCond); S.rise('mConc', at('s6_follow'), G.sConc); S.rise('mProp', at('s6_could'), G.sMProp);
      t = X0('d102'); X.line('d102', 'ask:learner', ['A starting hint could help', 'still do not understand the next step']); S.rise('mRem', a('d102'), G.sRem);
      t = X0('f101'); X.roomOut(t); S.head(t + 0.1, B(3), null);
      S.to('sFrame', t + 0.1, G.mFrame); S.to('mHead', t + 0.15, G.mHead); S.to('mCond', t + 0.2, G.mCond); S.to('mConc', t + 0.25, G.mConc); S.to('mProp', t + 0.3, G.mProp); S.to('mRem', t + 0.35, G.mRem, { tag: 'model.scope' });
      S.title(a('f101') + 0.6, 'model.analysis'); S.pulseOn(['mConc'], at('s6_fRisk'), 1.0); S.addLayer('mdl', at('s6_fQ') - 0.2); S.pulseOn(['mRem'], at('s6_fQ'), 1.2); S.rise('mSt', at('s6_fNot'), G.mSt);
    }
    // ---- B04 · c008: the same continuation after the model, a skip or a continue ----
    t = X0('c008'); X.roomOut(t); X.clearAll(t); S.dropLayer('mdl', t); S.head(t, B(4), null); S.title(t, null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('rv0', at('s6_actual'), G.rev[0]); S.rise('rv1', at('s6_conn'), G.rev[1]); S.rise('rv2', at('s6_examine'), G.rev[2]);
    // ---- c009: unsupported claims, separate from the main case ----
    t = X0('c009'); S.hide(['rv0', 'rv1', 'rv2'], t); S.rise('over', at('s6_claim'), G.over); S.pulseOn(['over'], a('c009'), 1.2);
    // ---- c010 + h102: the action and the person kept separate ----
    t = X0('c010'); S.hide(['over'], t); S.title(at('s6_resp') + 0.3, 'review.direct');
    S.rise('hM', at('s6_direct'), G.hM); S.rise('method', at('s6_direct') + 0.3, G.method); S.addLayer('div', at('s6_direct') + 0.5); S.rise('hP', at('s6_direct') + 0.7, G.hP); S.rise('person', at('s6_direct') + 0.9, G.person);
    S.title(a('c010') - 0.2, 'review.target');
    X.hold('h102');
    // ---- c011: optional review resources; no forced retry, no automatic advance ----
    t = X0('c011'); S.hide(['hM', 'hP', 'method', 'person'], t); S.dropLayer('div', t); S.title(at('s6_another') + 0.4, 'review.focus'); S.rise('resChip', a('c011'), G.end);
  }
  global.L04Scenes = { setup };
})(window);
