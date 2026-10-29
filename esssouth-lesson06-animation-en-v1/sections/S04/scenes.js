/*
 * L06.S04 · Describe Results Without Overclaiming. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Three evidence lanes (what changed / what was observed / what remains unestablished). Exactly one schematic visitor icon
 * stands for the single observation: no crowd, totals, bars or percentages. The unsupported "everyone" wording sits in its
 * own labelled example frame; the counterfactual is an empty question space, never an alternate event or causal arrow.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const LXB = [150, 710, 1270];
  const G = {
    eH: LXB.map((x) => R(x, 420, 500, 44, 28)), eS: LXB.map((x) => R(x, 474, 500, 220, 28)),
    caseB: R(150, 290, 620, 50, 24), rH: LXB.map((x) => R(x, 380, 500, 44, 28)), rC: LXB.map((x) => R(x, 434, 500, 90, 28)),
    obs: R(150, 600, 1000, 96, 30),
    sCase: R(1140, 140, 690, 50, 24), sModel: R(1140, 206, 690, 56, 26), sRes: R(1140, 286, 690, 84, 28),
    cObs: R(150, 400, 800, 100, 30), uF: R(1040, 380, 730, 260), uH: R(1070, 396, 670, 50, 24), uns: R(1070, 470, 670, 110, 28),
    miss: [R(150, 680, 800, 84, 28), R(1040, 680, 730, 84, 28)],
    nUpd: R(150, 420, 500, 100, 30), nUse: R(760, 420, 500, 100, 30), cf: R(1340, 380, 430, 300, 28),
    rAllow: R(150, 420, 800, 100, 30), rAct: R(150, 580, 800, 100, 30), rObs: R(1060, 420, 710, 100, 28),
    sInt: R(1140, 286, 690, 84, 28), sObs: R(1140, 390, 690, 84, 28), sUnc: R(1140, 494, 690, 84, 28),
    sObs8: R(150, 620, 800, 96, 28), ach: R(1060, 620, 710, 96, 28),
    pObs: R(150, 380, 800, 96, 26), pOwn: R(150, 510, 800, 70, 26), pFic: R(150, 600, 800, 70, 26), blank: R(1060, 380, 710, 400, 30), pHint: R(150, 790, 800, 40, 22)
  };

  function setup(E, ctx) {
    const K = global.L06Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('uF', G.uF, 'ctx frame', '', 'token.default'); // container first
    ['result.action', 'result.observation', 'result.inference'].forEach((k, i) => tok('e' + i, G.eH[i], 'colhead', L(k), 'token.colhead'));
    ['es0', 'es1', 'es2'].forEach((id, i) => tok(id, G.eS[i], 'note unobserved', '', 'token.note'));
    tok('caseL', G.caseB, 'framehead', L('case.label'), 'token.frame');
    ['x.lane.p', 'x.lane.m', 'x.lane.n'].forEach((k, i) => tok('lh' + i, G.rH[i], 'colhead', L(k), 'token.colhead'));
    tok('ap', G.rC[0], 'idea', L('action.participant'), 'token.idea'); tok('am', G.rC[1], 'step', L('action.maya'), 'token.step'); tok('an', G.rC[2], 'step', L('action.noah'), 'token.step');
    tok('obs', G.obs, 'fact', L('observation.exact'), 'token.step', { tag: 'observation.scope' });
    tok('sModel', G.sModel, 'framehead', L('model.label'), 'token.frame'); tok('mRes', G.sRes, 'example', L('model.result'), 'token.step');
    tok('cObs', G.cObs, 'example', markup(L('comparison.observed'), ['I saw']), 'token.step', { hl: 1 });
    tok('uH', G.uH, 'framehead', L('x.unsupFrame'), 'token.frame'); tok('uns', G.uns, 'step gap', L('comparison.unsupported'), 'token.step');
    tok('miss', G.miss[0], 'step gap', L('evidence.missing'), 'token.step'); tok('lim', G.miss[1], 'step gap', L('evidence.limit'), 'token.step');
    tok('nUpd', G.nUpd, 'idea', L('x.node.update'), 'token.idea'); tok('nUse', G.nUse, 'fact', L('x.node.use'), 'token.step'); tok('cf', G.cf, 'note unobserved', L('causality.unknown'), 'token.note');
    tok('rAllow', G.rAllow, 'note', L('reason.allowed'), 'token.note'); tok('rAct', G.rAct, 'idea', L('reason.action'), 'token.idea', { tag: 'reason.boundary' });
    tok('mInt', G.sInt, 'idea', L('model.intention'), 'token.idea'); tok('mUnc', G.sUnc, 'note', L('model.uncertainty'), 'token.note');
    tok('ach', G.ach, 'step gap', L('scope.achievement'), 'token.step');
    tok('pOwn', G.pOwn, 'chipcard margin', L('x.path.own'), 'token.chip'); tok('pFic', G.pFic, 'chipcard margin', L('x.path.fiction'), 'token.chip');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note'); tok('pHint', G.pHint, 'hint', L('reflection.private'), 'token.hint');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('one'); E.icon(l, 'one.person', 'person', 1220, 610, 76, '#5D6878');
    l = ly('seq'); Rx.dline(E, l, 'seq.a', 'M 658 470 L 742 470', '#B9C5D6'); Rx.head(E, l, 'seq.h', 750, 470, 'right', '#B9C5D6'); Rx.qmark(E, l, 'seq.q', 1300, 470);
    l = ly('ra'); Rx.dline(E, l, 'ra.a', 'M 550 528 L 550 568', '#9DB6E0'); Rx.head(E, l, 'ra.h', 550, 574, 'down', '#9DB6E0');
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 400 L 1005 720', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L06.S04.B0' + n, M = X.MOTION;
    const LH = ['lh0', 'lh1', 'lh2'], AC = ['ap', 'am', 'an'];
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: three evidence lanes, no characters ----
    S.head(X0('c001') + 0.1, B(1), null);
    S.rise('e0', at('s4_change'), G.eH[0]); S.rise('es0', at('s4_change') + 0.2, G.eS[0]); S.rise('e1', at('s4_observed'), G.eH[1]); S.rise('es1', at('s4_observed') + 0.2, G.eS[1]);
    S.rise('e2', at('s4_concl'), G.eH[2]); S.rise('es2', at('s4_concl') + 0.2, G.eS[2]);
    // ---- c002: the completed actions as a role map ----
    let t = X0('c002'); X.clearAll(t);
    S.rise('caseL', at('s4_return'), G.caseB); LH.forEach((id, i) => S.rise(id, at('s4_return') + 0.5 + i * 0.12, G.rH[i]));
    S.rise('ap', at('s4_changed'), G.rC[0]); S.rise('am', at('s4_maya'), G.rC[1]); S.rise('an', at('s4_noah'), G.rC[2]);
    // ---- c003 + h101: the single observation, one visitor icon, scope tag ----
    t = X0('c003'); S.rise('obs', at('s4_one'), G.obs); S.addLayer('one', at('s4_one') + 0.4); S.pulseOn(['obs'], at('s4_notTotal'), 1.2);
    X.hold('h101');
    // ---- B02 · d001 · a fictional account ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t, ['caseL']); S.dropLayer('one', t); S.to('caseL', t + 0.1, G.sCase);
    S.rise('sModel', t + 0.3, G.sModel); X.line('d001', 'explain:maya', ['I saw one visitor'], { headFirst: true }); S.rise('mRes', a('d001'), G.sRes);
    // ---- c004: I saw (observation) vs everyone could (an unsupported example, framed) ----
    t = X0('c004'); X.roomOut(t); S.hide(['sModel', 'mRes'], t); S.head(t + 0.1, B(2), null); S.to('caseL', t + 0.1, G.caseB);
    S.rise('cObs', at('s4_saw'), G.cObs); S.rise('uF', at('s4_everyone') - 0.3, G.uF); S.rise('uH', at('s4_everyone') - 0.1, G.uH); S.rise('uns', a('c004'), G.uns);
    S.title(at('s4_limits') - 0.2, 'comparison.scope');
    // ---- c005: what the case does not contain ----
    t = X0('c005'); S.title(t, null); S.rise('miss', at('s4_survey'), G.miss[0]); S.rise('lim', at('s4_avoid'), G.miss[1]); S.pulseOn(['miss', 'lim'], a('c005'), 1.2);
    // ---- B03 · c006: a factual sequence; the counterfactual stays an empty question ----
    t = X0('c006'); S.head(t, B(3), null); X.clearAll(t, ['caseL']);
    S.rise('nUpd', at('s4_before'), G.nUpd); S.addLayer('seq', at('s4_before') + 0.5); S.rise('nUse', at('s4_before') + 0.8, G.nUse);
    S.rise('cf', at('s4_without'), G.cf); S.pulseOn(['cf'], at('s4_anyway'), 1.2); S.title(a('c006') - 0.2, 'sequence.known');
    // ---- c007: stated reasoning, separate from the observed result ----
    t = X0('c007'); S.title(t, null); S.hide(['nUpd', 'nUse', 'cf'], t); S.dropLayer('seq', t);
    S.rise('rAllow', at('s4_conflict'), G.rAllow); S.addLayer('ra', at('s4_checked') - 0.2); S.rise('rAct', at('s4_checked'), G.rAct);
    S.addLayer('div', at('s4_notEst') - 0.3); S.rise('nUse', at('s4_notEst'), G.rObs);
    // ---- d002 · intention, observation and uncertainty as distinct cards ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t, ['caseL']); S.dropLayer('ra', t); S.dropLayer('div', t); S.to('caseL', t + 0.1, G.sCase);
    S.rise('sModel', t + 0.3, G.sModel); X.line('d002', 'explain:maya', ['match the door sign', 'I saw one visitor', 'cannot say what would have happened'], { headFirst: true });
    S.rise('mInt', at('s4_wanted') + 0.4, G.sInt); S.rise('nUse', at('s4_saw2'), G.sObs); S.rise('mUnc', a('d002'), G.sUnc);
    // ---- c008: a specific contribution within shared work; no wider achievement ----
    t = X0('c008'); X.roomOut(t); X.clearAll(t, ['caseL']); S.head(t + 0.1, B(3), null); S.to('caseL', t + 0.1, G.caseB);
    LH.forEach((id, i) => S.rise(id, t + 0.3 + i * 0.1, G.rH[i])); AC.forEach((id, i) => S.rise(id, t + 0.5 + i * 0.1, G.rC[i]));
    S.rise('obs', at('s4_preserves') + 1.0, G.sObs8, { tag: '' }); S.rise('ach', at('s4_noNeed'), G.ach); S.title(a('c008') - 0.2, 'scope.contribution');
    // ---- B04 · c009 + h102: the fact reference, two paths, a blank private area ----
    t = X0('c009'); S.head(t, B(4), null); S.title(t, null); X.clearAll(t, ['caseL']);
    S.rise('obs', at('s4_priv'), G.pObs, { tag: '' }); S.rise('pOwn', at('s4_real'), G.pOwn); S.rise('pFic', at('s4_real') + 0.3, G.pFic); S.rise('blank', at('s4_priv') + 0.5, G.blank); S.rise('pHint', a('c009'), G.pHint);
    X.hold('h102');
    // ---- c010: optional evidence checks; no numbered formula ----
    t = X0('c010'); X.clearAll(t); S.title(at('s4_modest') + 0.5, 'recap');
    S.rise('e0', at('s4_stateWhat'), G.eH[0]); S.rise('e1', at('s4_giveObs'), G.eH[1]); S.rise('e2', at('s4_dist'), G.eH[2]);
  }
  global.L06Scenes = { setup };
})(window);
