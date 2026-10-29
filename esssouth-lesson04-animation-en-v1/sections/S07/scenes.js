/*
 * L04.S07 · Transfer and Review. Section adapter (tokens, rects, timing by cue starts and anchors).
 * A fresh event-notice task with an unfilled one-page outline. Noah's picture allocation stays a proposal; the readability
 * concern sits in an If frame with "layout not tested". The model reply is framed; Noah's answer is split into a process
 * agreement and a continuing preference. Candidate layouts stay empty: no scores, ratings or winner.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    page: R(1060, 300, 560, 520, 30), att: R(150, 330, 800, 90, 30), det: R(150, 440, 800, 90, 30), state: R(150, 560, 800, 54, 26),
    sImg: R(1140, 236, 690, 84, 28), sEff: R(1140, 340, 690, 84, 28),
    quote: R(150, 284, 1620, 140, 32), eff: R(150, 470, 800, 96, 30), img: R(1060, 470, 710, 96, 30),
    ifF: R(150, 610, 1620, 210), ifH: R(190, 628, 820, 54, 24), unk: R(190, 710, 520, 66, 26),
    res: [R(150, 440, 520, 70, 26), R(700, 440, 520, 70, 26), R(1250, 440, 520, 70, 26)], aAtt: R(150, 540, 800, 90, 30), aDet: R(150, 650, 800, 90, 30),
    blank: R(1060, 540, 710, 230, 30), priv: R(1060, 790, 710, 40, 22),
    sF: R(1120, 132, 730, 600), sH: R(1140, 148, 690, 54, 24), sQ: R(1140, 220, 690, 84, 28), sN: R(1140, 324, 690, 84, 28), sAg: R(1140, 450, 690, 84, 26), sOp: R(1140, 550, 690, 84, 26),
    hA: R(150, 440, 800, 44, 28), hO: R(1060, 440, 710, 44, 28), cA: R(150, 494, 800, 100, 30), cO: R(1060, 494, 710, 100, 30),
    lay: [R(150, 300, 760, 360, 30), R(1010, 300, 760, 360, 30)], pend: R(150, 690, 760, 54, 26), crit: [R(1010, 690, 370, 72, 26), R(1400, 690, 370, 72, 26)],
    rev: [R(150, 494, 520, 90, 28), R(700, 494, 520, 90, 28), R(1250, 494, 520, 90, 28)], fin: R(560, 520, 800, 100, 34)
  };

  function setup(E, ctx) {
    const K = global.L04Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('page', G.page, 'note unobserved', L('task.page'), 'token.note'); tok('ifF', G.ifF, 'ctx frame', '', 'token.default'); tok('sF', G.sF, 'ctx frame', '', 'token.default');
    tok('lay1', G.lay[0], 'note unobserved', L('x.layoutA'), 'token.note'); tok('lay2', G.lay[1], 'note unobserved', L('x.layoutB'), 'token.note'); // containers first
    tok('att', G.att, 'goal', L('task.attention'), 'token.step'); tok('det', G.det, 'goal', L('task.details'), 'token.step'); tok('state', G.state, 'framehead', L('task.state'), 'token.frame');
    tok('img', G.sImg, 'proposal', L('proposal.image'), 'token.step'); tok('eff', G.sEff, 'idea reason', L('proposal.effect'), 'token.step');
    tok('quote', G.quote, 'quote speaker', markup(E.cueText('L04.S07.d001'), ['could catch', 'most of the page']), 'token.quote', { who: 1, spk: 'noah' });
    tok('ifH', G.ifH, 'framehead', L('concern.condition'), 'token.frame'); tok('unk', G.unk, 'chipcard margin', L('scope.unknown'), 'token.chip');
    tok('rv0', G.res[0], 'chipcard margin', L('review.specific'), 'token.chip'); tok('rv1', G.res[1], 'chipcard margin', L('review.reason'), 'token.chip'); tok('rv2', G.res[2], 'chipcard margin', L('review.next'), 'token.chip');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note'); tok('priv', G.priv, 'hint', L('reflection.private'), 'token.hint');
    tok('sH', G.sH, 'framehead', L('model.label'), 'token.frame'); tok('mq', G.sQ, 'proposal', L('model.questioned'), 'token.step'); tok('mn', G.sN, 'proposal next', L('model.next'), 'token.step');
    tok('ag', G.sAg, 'idea reason', L('agreed.process'), 'token.step'); tok('op', G.sOp, 'note', L('open.preference'), 'token.note');
    tok('hA', G.hA, 'colhead', L('record.agreed'), 'token.colhead'); tok('hO', G.hO, 'colhead dashed', L('record.open'), 'token.colhead');
    tok('pend', G.pend, 'framehead', L('comparison.pending'), 'token.frame');
    tok('fin', G.fin, 'question shared', L('recap.final'), 'token.question');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('pg'); E.icon(l, 'pg.cards', 'cards', 1300, 520, 80, '#B9C5D6');
    l = ly('sm'); Rx.dline(E, l, 'sm.a', 'M 1485 312 L 1485 318', '#9DB6E0');
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 440 L 1005 620', '#9DB6E0');
    l = ly('ifq'); Rx.dline(E, l, 'ifq.a', 'M 1415 574 L 1415 620', '#B9C5D6'); Rx.qmark(E, l, 'ifq.q', 1455, 597);
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L04.S07.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: an unfilled one-page outline and the two aims ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('page', at('s7_team'), G.page); S.addLayer('pg', at('s7_team') + 0.4);
    S.rise('att', at('s7_notice'), G.att); S.rise('det', at('s7_find'), G.det); S.rise('state', a('c001'), G.state);
    // ---- d001 · Noah: the picture allocation as a proposal ----
    let t = X0('d001'); S.head(t, null, null); X.clearAll(t); S.dropLayer('pg', t);
    X.line('d001', 'propose:learner', ['could catch people\'s attention', 'most of the page']); S.rise('eff', a('d001'), G.sEff); S.rise('img', at('s7_most'), G.sImg);
    // ---- c002: benefit vs allocation; the readability concern in an If frame; layout untested ----
    t = X0('c002'); X.roomOut(t); S.head(t + 0.1, B(1), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.to('eff', at('s7_recog'), G.eff); S.to('img', at('s7_recog') + 0.2, G.img);
    S.rise('ifF', at('s7_if') - 0.2, G.ifF); S.rise('ifH', at('s7_if'), G.ifH); S.addLayer('ifq', at('s7_if') + 0.4); S.rise('unk', at('s7_tested'), G.unk); S.pulseOn(['ifH'], a('c002'), 1.2);
    // ---- B02 · c003 + h101: optional resources, the aims, a blank private area ----
    t = X0('c003'); S.head(t, B(2), null); S.hide(['eff', 'img', 'ifH', 'unk'], t); S.hide(['ifF'], t + M.cut); S.dropLayer('ifq', t);
    S.rise('rv0', at('s7_which'), G.res[0]); S.rise('rv1', at('s7_why'), G.res[1]); S.rise('rv2', at('s7_next'), G.res[2]);
    S.rise('att', at('s7_form'), G.aAtt); S.rise('det', at('s7_form') + 0.2, G.aDet); S.rise('blank', at('s7_form') + 0.5, G.blank); S.rise('priv', a('c003'), G.priv);
    X.hold('h101');
    // ---- B03 · d002 · You: one possible reply in its frame; d003 · Noah agrees only to comparing ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t);
    S.rise('sF', t + 0.3, G.sF); S.rise('sH', t + 0.5, G.sH);
    X.line('d002', 'explain:noah', ['using most of the page', 'may make the time and place harder to find', 'compare two layouts'], { headFirst: true, bubble: { x: 70, y: 100, w: 1040, h: 280, fs: 30 } });
    S.rise('mq', at('s7_most2'), G.sQ); S.addLayer('sm', at('s7_compare') - 0.2); S.rise('mn', at('s7_compare'), G.sN);
    t = X0('d003'); X.line('d003', 'explain:learner', ['Yes, we can compare them', 'I still think']); S.rise('ag', at('s7_yes') + 0.6, G.sAg); S.rise('op', at('s7_still'), G.sOp);
    // ---- c004: a two-column record of what was agreed and what remains open ----
    t = X0('c004'); X.roomOut(t); S.hide(['sF', 'sH', 'mq', 'mn'], t); S.dropLayer('sm', t); S.head(t + 0.1, B(3), null);
    S.rise('hA', at('s7_agrees') - 0.3, G.hA); S.to('ag', at('s7_agrees'), G.cA); S.addLayer('div', at('s7_agrees') + 0.2); S.rise('hO', at('s7_pref') - 0.3, G.hO); S.to('op', at('s7_pref'), G.cO);
    S.pulseOn(['op'], a('c004'), 1.2);
    // ---- c005: two neutral, empty candidate frames; the same criteria; no ratings ----
    t = X0('c005'); S.hide(['hA', 'hO', 'ag', 'op'], t); S.dropLayer('div', t);
    S.rise('lay1', at('s7_needs'), G.lay[0]); S.rise('lay2', at('s7_needs') + 0.2, G.lay[1]); S.rise('pend', at('s7_needs') + 0.6, G.pend);
    S.rise('att', at('s7_checkAlt') - 0.4, G.crit[0], { kind: 'chipcard' }); S.rise('det', at('s7_checkAlt') - 0.2, G.crit[1], { kind: 'chipcard' }); S.title(a('c005') + 0.4, 'comparison.criteria');
    // ---- B04 · c006 + h102: three optional review resources, unselected ----
    t = X0('c006'); S.head(t, B(4), null); S.title(t, null); X.clearAll(t);
    S.rise('rv0', at('s7_specific'), G.rev[0]); S.rise('rv1', at('s7_reason'), G.rev[1]); S.rise('rv2', at('s7_step'), G.rev[2]);
    X.hold('h102');
    // ---- c007: a neutral finish ----
    t = X0('c007'); X.clearAll(t); S.rise('fin', at('s7_clear'), G.fin); S.pulseOn(['fin'], a('c007'), 1.2);
  }
  global.L04Scenes = { setup };
})(window);
