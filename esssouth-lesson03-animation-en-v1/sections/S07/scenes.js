/*
 * L03.S07 · Transfer and Review. Section adapter (tokens, rects, timing by cue starts and anchors).
 * A fresh club-guide task (blank guide, no version chosen). Scope words "some" and "may" are highlighted in the exact
 * quote; the unrequested "longer guide" sits outside the evidence area as a gap card. New information appears only when
 * Maya provides it, inside the framed authored continuation. Resources are equal, unnumbered tools; the private area
 * stays blank; the ending is neutral with user-controlled navigation.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    tNew: R(150, 330, 800, 96, 32), tGoal: R(150, 450, 800, 96, 30), page: R(1060, 370, 710, 420), state: R(1060, 300, 710, 54, 26),
    side3: [R(1140, 150, 690, 76, 28), R(1140, 246, 690, 76, 28), R(1140, 342, 690, 96, 26)],
    quote: R(150, 284, 1620, 140, 32), ev3: [R(150, 470, 800, 80, 30), R(150, 566, 800, 80, 30), R(150, 662, 800, 100, 30)],
    some: R(1060, 470, 340, 80, 30), may: R(1430, 470, 340, 80, 30), unsaid: R(1060, 662, 710, 100, 28),
    res4: [R(150, 460, 380, 84, 28), R(563, 460, 380, 84, 28), R(976, 460, 380, 84, 28), R(1389, 460, 380, 84, 28)], blank: R(150, 590, 1620, 230, 30),
    mFrameS: R(1120, 132, 730, 440), mHeadS: R(1140, 148, 690, 54, 24), mNewS: R(1140, 430, 690, 84, 28),
    mFrame: R(150, 300, 1620, 520), mHead: R(190, 318, 820, 54, 26), mQ: R(190, 400, 820, 110, 28), mNew: R(1060, 400, 670, 110, 28), rNext: R(190, 600, 820, 90, 28), rOpen: R(1060, 600, 670, 90, 28),
    rvMean: R(150, 400, 800, 100, 30), rvConn: R(1060, 400, 710, 100, 30), rvChoice: R(560, 600, 800, 160, 30),
    grid4: [R(250, 420, 620, 100, 30), R(1050, 420, 620, 100, 30), R(250, 600, 620, 100, 30), R(1050, 600, 620, 100, 30)],
    final: R(560, 520, 800, 110, 34)
  };

  function setup(E, ctx) {
    const K = global.L03Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('page', G.page, 'note unobserved', '', 'token.note'); tok('mFrame', G.mFrameS, 'ctx frame', '', 'token.default'); // containers first
    tok('tNew', G.tNew, 'goal', L('task.new'), 'token.step'); tok('tGoal', G.tGoal, 'fact', L('task.goal'), 'token.step'); tok('state', G.state, 'framehead', L('task.state'), 'token.frame');
    tok('fV', G.side3[0], 'proposal', L('view.short'), 'token.step'); tok('fR', G.side3[1], 'idea reason', L('reason.read'), 'token.step');
    tok('fC', G.side3[2], 'concern', markup(L('concern.terms'), ['Some', 'may']), 'token.step');
    tok('quote', G.quote, 'quote speaker', markup(E.cueText('L03.S07.d001'), ['some new members', 'may']), 'token.quote', { who: 1, spk: 'maya' });
    tok('some', G.some, 'chipcard mark', L('scope.some'), 'token.chip'); tok('may', G.may, 'chipcard mark', L('scope.may'), 'token.chip');
    tok('unsaid', G.unsaid, 'step gap', L('scope.unsaid'), 'token.step');
    tok('r1', G.res4[0], 'chipcard', L('resource.understand'), 'token.chip'); tok('r2', G.res4[1], 'chipcard', L('resource.clarify'), 'token.chip');
    tok('r3', G.res4[2], 'chipcard', L('resource.support'), 'token.chip'); tok('r4', G.res4[3], 'chipcard', L('resource.add'), 'token.chip');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('mHead', G.mHeadS, 'framehead', L('model.label'), 'token.frame'); tok('mQ', G.mQ, 'example', E.cueText('L03.S07.d002'), 'token.summary');
    tok('mNew', G.mNewS, 'fact', L('new.information'), 'token.step');
    tok('rNext', G.rNext, 'idea', L('result.next'), 'token.idea'); tok('rOpen', G.rOpen, 'note', L('result.open'), 'token.note');
    tok('rvMean', G.rvMean, 'question', L('review.meaning'), 'token.question'); tok('rvConn', G.rvConn, 'question', L('review.connection'), 'token.question');
    tok('rvChoice', G.rvChoice, 'note', L('review.choice'), 'token.note');
    tok('final', G.final, 'question shared', L('recap.final'), 'token.question');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('page'); E.icon(l, 'page.icon', 'cards', 1380, 520, 72, '#B9C5D6');
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 470 L 1005 770', '#9DB6E0');
    l = ly('scope'); Rx.dline(E, l, 'scope.a', 'M 958 712 C 1000 712, 1000 510, 1052 510', '#9DB6E0');
    l = ly('mq'); Rx.dline(E, l, 'mq.a', 'M 1018 455 L 1044 455', '#9DB6E0'); Rx.head(E, l, 'mq.h', 1052, 455, 'right', '#9DB6E0');
    Rx.dline(E, l, 'mq.b', 'M 600 518 L 600 584', '#9DB6E0'); Rx.head(E, l, 'mq.bh', 600, 592, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L03.S07.B0' + n;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a fresh task and a blank guide; no version chosen ----
    S.head(X0('c001') + 0.1, B(1), null);
    S.rise('tNew', at('s07_guide'), G.tNew); S.rise('page', at('s07_guide') + 0.4, G.page); S.addLayer('page', at('s07_guide') + 0.7);
    S.rise('tGoal', at('s07_easy'), G.tGoal); S.rise('state', a('c001'), G.state); S.pulseOn(['state'], a('c001') + 0.5, 1.2);
    // ---- d001 · Maya: benefit and concern, the full statement in view ----
    let t = X0('d001'); S.head(t, null, null); X.clearAll(t); S.dropLayer('page', t);
    X.line('d001', 'explain:learner', ['A shorter guide', 'quicker to read', 'some new members may not know the terms']);
    S.rise('fV', at('s07_shorter'), G.side3[0]); S.rise('fR', at('s07_quicker'), G.side3[1]); S.rise('fC', a('d001'), G.side3[2], { hl: 0 });
    // ---- c002: scope words highlighted; "longer guide" outside the evidence area ----
    t = X0('c002'); X.roomOut(t); S.head(t + 0.1, B(1), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 0 }); ['fV', 'fR', 'fC'].forEach((id, i) => S.to(id, t + 0.4 + i * 0.08, G.ev3[i]));
    S.put('quote', at('s07_possib'), X.MOTION.focus, { hl: 1 }); S.put('fC', at('s07_possib') + 0.1, X.MOTION.focus, { hl: 1 });
    S.addLayer('scope', at('s07_possib') + 0.3); S.rise('some', at('s07_possib') + 0.5, G.some); S.rise('may', at('s07_possib') + 0.7, G.may);
    S.addLayer('div', at('s07_longer') - 0.3); S.rise('unsaid', at('s07_longer'), G.unsaid); S.pulseOn(['unsaid'], a('c002'), 1.0);
    // ---- B02 · c003 + h101: equal resources, nothing selected; a blank response area ----
    t = X0('c003'); S.head(t, B(2), null); S.hide(['fV', 'fR', 'fC', 'some', 'may', 'unsaid'], t); S.dropLayer('scope', t); S.dropLayer('div', t);
    S.rise('r1', at('s07_check'), G.res4[0]); S.rise('r2', at('s07_clarify'), G.res4[1]); S.rise('r3', at('s07_support'), G.res4[2]); S.rise('r4', at('s07_add'), G.res4[3]);
    S.rise('blank', a('c003'), G.blank);
    X.hold('h101');
    // ---- B03 · d002 + d003: one possible continuation in its own frame; new information only when Maya gives it ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t);
    S.rise('mFrame', t + 0.3, G.mFrameS); S.rise('mHead', t + 0.5, G.mHeadS);
    X.line('d002', 'ask:maya', ['Which terms'], { headFirst: true });
    t = X0('d003'); X.line('d003', 'explain:learner', ['The names of our activity groups', 'might not know']); S.rise('mNew', a('d003'), G.mNewS);
    // ---- c004: question → new information; length and design visibly open ----
    t = X0('c004'); X.roomOut(t); S.head(t + 0.1, B(3), null);
    S.to('mFrame', t + 0.1, G.mFrame); S.to('mHead', t + 0.15, G.mHead); S.rise('mQ', t + 0.3, G.mQ); S.to('mNew', t + 0.3, G.mNew);
    S.addLayer('mq', at('s07_specific'), 0.3); S.rise('rNext', at('s07_discuss'), G.rNext); S.rise('rOpen', a('c004'), G.rOpen); S.pulseOn(['rOpen'], a('c004') + 0.3, 1.2);
    // ---- B04 · c005 + h102: a review board; the next focus is the viewer's own ----
    t = X0('c005'); S.head(t, B(4), null); X.clearAll(t); S.dropLayer('mq', t);
    S.rise('rvMean', at('s07_intact'), G.rvMean); S.rise('rvConn', at('s07_connect'), G.rvConn); S.rise('rvChoice', at('s07_pick'), G.rvChoice);
    X.hold('h102');
    // ---- c006: four optional tools, not steps ----
    t = X0('c006'); S.hide(['rvMean', 'rvConn', 'rvChoice'], t); S.title(a('c006') - 0.2, 'recap.resources');
    ['r1', 'r2', 'r3', 'r4'].forEach((id, i) => S.rise(id, t + 0.4 + i * 0.12, G.grid4[i]));
    S.pulseOn(['r2'], at('s07_precise'), 0.8); S.pulseOn(['r1'], at('s07_confirm'), 0.8); S.pulseOn(['r4'], at('s07_contrib'), 0.8);
    // ---- c007: a neutral ending; one check to carry ----
    t = X0('c007'); S.hide(['r1', 'r2', 'r3', 'r4'], t); S.title(t, null);
    S.rise('final', at('s07_carry'), G.final); S.pulseOn(['final'], a('c007'), 1.2);
  }
  global.L03Scenes = { setup };
})(window);
