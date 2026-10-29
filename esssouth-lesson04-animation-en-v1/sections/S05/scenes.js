/*
 * L04.S05 · Revise a Proposal Without Inventing Agreement. Section adapter (tokens, rects, timing by cue starts and anchors).
 * The concern sits in an "If" frame (no participant shown failing). The revision is a conditional route; only the changed
 * condition is highlighted. Agreement is recorded exactly as spoken, attributed to Maya, on a three-part status board
 * (supported / open / not established); silence is never read as a position. No solved badge or adopted plan.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    prop: R(560, 330, 800, 100, 32), slot: R(560, 520, 800, 100, 30),
    time: R(150, 330, 390, 72, 28), probs: R(560, 330, 390, 72, 28), goal: R(150, 430, 800, 90, 30), propR: R(1060, 330, 710, 100, 30), exLbl: R(1060, 560, 710, 54, 26),
    sLbl: R(1140, 150, 690, 54, 24), sFrame: R(1120, 216, 730, 300), sIf: R(1140, 232, 690, 54, 24), sTime: R(1140, 310, 690, 84, 28),
    quote: R(150, 284, 1620, 140, 32), focus: R(150, 494, 800, 96, 32), not: R(1060, 494, 710, 96, 28), propH: R(150, 640, 800, 96, 30),
    hO: R(150, 440, 800, 44, 28), hR: R(1060, 440, 710, 44, 28), orig: R(150, 494, 800, 96, 30), cond: R(1060, 494, 710, 96, 30), goalC: R(560, 680, 800, 84, 28),
    sCan: R(1140, 160, 690, 90, 26), sCannot: R(1140, 270, 690, 100, 26), sCheck: R(1140, 410, 690, 84, 26),
    three: [R(150, 494, 520, 130, 30), R(700, 494, 520, 130, 30), R(1250, 494, 520, 130, 30)],
    sAgree: R(1140, 160, 690, 90, 28), sQ: R(1140, 290, 690, 90, 28),
    space: R(560, 470, 800, 220, 30),
    sModelS: R(1140, 150, 690, 56, 26), sSum: R(1140, 226, 690, 240, 28), sChip1: R(1140, 486, 690, 66, 26), sChip2: R(1140, 566, 690, 66, 26),
    tFrame: R(150, 300, 1620, 520), tHead: R(190, 318, 820, 54, 26), nA: R(190, 430, 820, 100, 30), nC: R(190, 570, 820, 100, 30),
    uQ: R(150, 470, 800, 100, 30), blank: R(1060, 470, 710, 300, 30),
    sModel: R(1140, 150, 690, 56, 26), model: R(1140, 226, 690, 160, 28)
  };

  function setup(E, ctx) {
    const K = global.L04Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('sFrame', G.sFrame, 'ctx frame', '', 'token.default'); tok('tFrame', G.tFrame, 'ctx frame', '', 'token.default'); // containers first
    tok('prop', G.prop, 'proposal', L('revision.original'), 'token.step'); tok('slot', G.slot, 'step tentative', L('x.condSlot'), 'token.step');
    tok('time', G.time, 'chipcard', L('task.time'), 'token.chip'); tok('probs', G.probs, 'chipcard', L('task.problems'), 'token.chip'); tok('goal', G.goal, 'goal', L('task.goal'), 'token.step');
    tok('exLbl', G.exLbl, 'framehead', L('example.label'), 'token.frame');
    tok('ifHead', G.sIf, 'framehead', L('concern.condition'), 'token.frame'); tok('cTime', G.sTime, 'note', L('concern.time'), 'token.note');
    tok('quote', G.quote, 'quote speaker', markup(E.cueText('L04.S05.d001'), ['cannot find a first step']), 'token.quote', { who: 1, spk: 'maya' });
    tok('focus', G.focus, 'concern', L('concern.focus'), 'token.step'); tok('not', G.not, 'step gap', L('concern.not'), 'token.step');
    tok('hO', G.hO, 'colhead', L('x.hOrig'), 'token.colhead'); tok('hR', G.hR, 'colhead', L('x.hRev'), 'token.colhead'); tok('cond', G.cond, 'idea', L('revision.condition'), 'token.idea');
    tok('can', G.sCan, 'proposal', L('revision.can'), 'token.step'); tok('cannot', G.sCannot, 'proposal', L('revision.cannot'), 'token.step'); tok('check', G.sCheck, 'fact', L('revision.check'), 'token.step');
    tok('changed', G.three[0], 'idea', L('revision.changed'), 'token.idea'); tok('retained', G.three[1], 'fact', L('revision.retained'), 'token.step'); tok('rlimit', G.three[2], 'note', L('revision.limit'), 'token.note');
    tok('agree', G.sAgree, 'idea reason', L('agreement.exact'), 'token.step'); tok('remQ', G.sQ, 'question', L('question.remaining'), 'token.question');
    tok('stSup', G.three[0], 'idea reason', L('status.supported'), 'token.step'); tok('stOpen', G.three[1], 'question', L('status.open'), 'token.question'); tok('stNot', G.three[2], 'step gap', L('status.unestablished'), 'token.step');
    tok('space', G.space, 'note', L('agreement.check'), 'token.note', { tag: 'silence.state' });
    tok('sum', G.sSum, 'example', E.cueText('L04.S05.d004'), 'token.summary'); tok('sum1', G.sChip1, 'chipcard', L('summary.support'), 'token.chip'); tok('sum2', G.sChip2, 'chipcard margin', L('summary.open'), 'token.chip');
    tok('tHead', G.tHead, 'framehead', L('constraint.time'), 'token.frame'); tok('nA', G.nA, 'question', L('next.answer'), 'token.question'); tok('nC', G.nC, 'question', L('next.check'), 'token.question');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('sModel', G.sModel, 'framehead', L('model.label'), 'token.frame'); tok('model', G.model, 'example', E.cueText('L04.S05.d005'), 'token.summary');
    tok('rc1', G.three[0], 'proposal', L('recap.change'), 'token.step'); tok('rc2', G.three[1], 'idea reason', L('recap.support'), 'token.step'); tok('rc3', G.three[2], 'question', L('recap.open'), 'token.question');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('slotL'); Rx.dline(E, l, 'slotL.a', 'M 960 438 L 960 512', '#B9C5D6'); Rx.qmark(E, l, 'slotL.q', 1000, 476);
    l = ly('task'); E.icon(l, 'task.clock', 'clock', 1090, 440, 56, '#5D6878'); E.path(l, 'task.rail', 'M 1170 468 L 1770 468', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'task.t0', 'M 1170 452 L 1170 484', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'task.t1', 'M 1770 452 L 1770 484', { stroke: '#B9C5D6', 'stroke-width': 4 });
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 440 L 1005 620', '#9DB6E0');
    l = ly('goalL'); Rx.dline(E, l, 'goalL.a', 'M 550 598 C 550 640, 760 640, 800 672', '#9DB6E0'); Rx.dline(E, l, 'goalL.b', 'M 1415 598 C 1415 640, 1160 640, 1120 672', '#9DB6E0');
    l = ly('route'); Rx.dline(E, l, 'route.a', 'M 1132 205 C 1112 205, 1112 452, 1126 452', '#9DB6E0'); Rx.dline(E, l, 'route.b', 'M 1132 320 C 1118 320, 1118 452, 1126 452', '#9DB6E0'); Rx.head(E, l, 'route.h', 1134, 452, 'right', '#9DB6E0');
    l = ly('sAQ'); Rx.dline(E, l, 'sAQ.a', 'M 1485 258 L 1485 282', '#B9C5D6');
    l = ly('rail20'); E.icon(l, 'rail20.clock', 'clock', 1060, 440, 56, '#5D6878'); E.path(l, 'rail20.line', 'M 1136 468 L 1730 468', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'rail20.t0', 'M 1136 452 L 1136 484', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'rail20.t1', 'M 1730 452 L 1730 484', { stroke: '#B9C5D6', 'stroke-width': 4 });
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L04.S05.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a proposal and one editable condition ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('prop', at('s5_reveal'), G.prop); S.addLayer('slotL', at('s5_reveal') + 0.6); S.rise('slot', at('s5_reveal') + 0.8, G.slot);
    S.title(a('c001') - 0.2, 'revision.question');
    // ---- c002: fixed facts; the proposal unadopted; "Authored example" before the exchange ----
    let t = X0('c002'); S.title(t, null); S.hide(['slot'], t); S.dropLayer('slotL', t);
    S.rise('time', at('s5_still'), G.time); S.rise('probs', at('s5_still') + 0.3, G.probs); S.rise('goal', at('s5_still') + 0.6, G.goal); S.addLayer('task', at('s5_still') + 0.9, 0.1);
    S.to('prop', t + 0.2, G.propR); S.put('prop', at('s5_under'), M.focus, { tag: 'proposal.status' }); S.rise('exLbl', at('s5_listen'), G.exLbl);
    // ---- d001 · Maya: a conditional difficulty inside an If frame ----
    t = X0('d001'); S.head(t, null, null); S.hide(['time', 'probs', 'goal', 'prop'], t); S.dropLayer('task', t); S.to('exLbl', t + 0.1, G.sLbl);
    X.line('d001', 'ask:learner', ['What if someone cannot find a first step', 'might use up time']);
    S.rise('sFrame', a('d001'), G.sFrame); S.rise('ifHead', a('d001') + 0.2, G.sIf); S.rise('cTime', at('s5_waiting'), G.sTime);
    // ---- c003 + h101: the exact concern; unsupported claims kept out ----
    t = X0('c003'); X.roomOut(t); S.hide(['exLbl', 'sFrame', 'ifHead', 'cTime'], t); S.head(t + 0.1, B(1), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('focus', at('s5_access'), G.focus); S.rise('not', at('s5_unwilling'), G.not); S.addLayer('div', at('s5_unwilling') + 0.2);
    S.rise('prop', at('s5_keep'), G.propH, { tag: 'proposal.status' }); S.pulseOn(['focus'], at('s5_keep') + 0.3, 1.2);
    X.hold('h101');
    // ---- B02 · c004: original proposal vs possible revision, the same goal ----
    t = X0('c004'); S.head(t, B(2), null); S.hide(['quote', 'focus', 'not'], t); S.dropLayer('div', t);
    S.rise('hO', at('s5_one'), G.hO); S.to('prop', at('s5_one') + 0.1, G.orig, { tag: '' }); S.rise('hR', at('s5_one') + 0.4, G.hR); S.rise('cond', a('c004'), G.cond);
    S.rise('goal', at('s5_listenFor'), G.goalC); S.addLayer('goalL', at('s5_listenFor') + 0.3, 0.2);
    // ---- d002 · You: a conditional route; both branches lead to checking ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t); S.dropLayer('goalL', t);
    X.line('d002', 'propose:maya', ['try a first step when we can', 'if we cannot identify one', 'explain and check']);
    S.rise('can', at('s5_try'), G.sCan); S.rise('cannot', a('d002'), G.sCannot); S.addLayer('route', at('s5_explain') - 0.2, 0.15); S.rise('check', at('s5_explain'), G.sCheck);
    // ---- c005: only the changed condition highlighted; limits stay visible ----
    t = X0('c005'); X.roomOut(t); X.clearAll(t); S.dropLayer('route', t); S.head(t + 0.1, B(2), null);
    S.rise('changed', at('s5_changes'), G.three[0], { act: 1 }); S.put('changed', at('s5_changes') + 1.4, M.focus, { act: 0 });
    S.rise('retained', at('s5_keeps'), G.three[1]); S.rise('rlimit', at('s5_could'), G.three[2]); S.title(a('c005') - 0.2, null);
    // ---- B03 · d003 · Maya: one supported feature and one open question, split from her exact words ----
    t = X0('d003'); S.head(t, null, null); X.clearAll(t);
    X.line('d003', 'explain:learner', ['I support allowing a starting hint', 'What would we do if the hint still does not help']);
    S.rise('agree', a('d003') + 1.0, G.sAgree); S.addLayer('sAQ', at('s5_whatIf') - 0.2); S.rise('remQ', at('s5_whatIf'), G.sQ);
    // ---- c006: three-part status board ----
    t = X0('c006'); X.roomOut(t); X.clearAll(t); S.dropLayer('sAQ', t); S.head(t + 0.1, B(3), null);
    S.rise('stSup', at('s5_supports'), G.three[0]); S.rise('stOpen', at('s5_asked'), G.three[1]); S.rise('stNot', at('s5_neither'), G.three[2]); S.pulseOn(['stNot'], a('c006'), 1.2);
    // ---- c007: an open response space; no position inferred from silence ----
    t = X0('c007'); S.hide(['stSup', 'stOpen', 'stNot'], t); S.rise('space', at('s5_silence'), G.space); S.pulseOn(['space'], at('s5_askWhich'), 1.2);
    // ---- d004 · You: an attributed summary of the exact exchange (a model) ----
    t = X0('d004'); S.head(t, null, null); X.clearAll(t);
    X.line('d004', 'explain:maya', ['one point of support', 'hear the other views']); S.rise('sum', t + 1.3, G.sSum); S.rise('sum1', t + 1.8, G.sChip1); S.rise('sum2', at('s5_still2'), G.sChip2);
    // ---- B04 · c008: two open questions inside one undivided 20-minute boundary ----
    t = X0('c008'); X.roomOut(t); X.clearAll(t); S.head(t + 0.1, B(4), null);
    S.rise('tFrame', t + 0.3, G.tFrame); S.rise('tHead', at('s5_within'), G.tHead); S.addLayer('rail20', at('s5_within') + 0.3, 0.1);
    S.rise('nA', at('s5_when'), G.nA); S.rise('nC', at('s5_how'), G.nC); S.pulseOn(['tHead'], a('c008'), 1.2);
    // ---- c009 + h102: one unresolved issue and an empty private area ----
    t = X0('c009'); X.clearAll(t); S.dropLayer('rail20', t);
    S.rise('remQ', at('s5_choose'), G.uQ); S.rise('blank', at('s5_choose') + 0.4, G.blank);
    X.hold('h102');
    // ---- d005 · You: one possible question, in its own model area ----
    t = X0('d005'); S.head(t, null, null); X.clearAll(t);
    S.rise('sModel', t + 0.3, G.sModel); X.line('d005', 'ask:maya', ['useful for understanding the next step'], { headFirst: true }); S.rise('model', a('d005'), G.model);
    // ---- c010: three clearly different status cards ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t); S.head(t + 0.1, B(4), null);
    S.rise('rc1', at('s5_change'), G.three[0]); S.rise('rc2', at('s5_support'), G.three[1]); S.rise('rc3', at('s5_question'), G.three[2]); S.pulseOn(['rc3'], a('c010'), 1.2);
  }
  global.L04Scenes = { setup };
})(window);
