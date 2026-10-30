/*
 * L07.S07 · Choose the Next Move in a New Discussion. Section adapter (tokens, rects, timing by cue starts and anchors).
 * A new transfer task (L07.TRANSFER01) under "New practice example": no welcome-activity material is carried over. The
 * exact transfer prompt is taken from the graph's scenario. Noah's cleaning question stays open (question mark, no
 * answer card); Maya's request for time is the only evidence about her; the learner's reply parks the question under
 * "Question to check". No option is selected, nothing is scored, and the close is a flexible reminder, not a recipe.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C3 = [150, 700, 1250];
  const G = {
    newB: R(150, 290, 620, 50, 24), prompt: R(150, 360, 1620, 150, 30), oP: R(150, 560, 760, 90, 30), oS: R(1010, 560, 760, 90, 30), task: R(560, 690, 800, 66, 26),
    sNew: R(1140, 150, 690, 50, 24), sP: R(1140, 214, 690, 70, 26), sS: R(1140, 294, 690, 70, 26), sQ: R(1140, 384, 690, 76, 26), sReq: R(1140, 476, 690, 70, 26),
    sPos: R(1140, 476, 690, 50, 22), sPark: R(1140, 540, 690, 44, 26), sQp: R(1140, 594, 690, 76, 26),
    bP: R(150, 330, 760, 90, 30), bS: R(1010, 330, 760, 90, 30), bQ: R(1010, 490, 760, 84, 28), rel: R(150, 490, 760, 84, 26), open: R(560, 640, 800, 66, 26),
    obs: R(150, 420, 760, 100, 30), space: R(1010, 420, 760, 100, 30), qSide: R(560, 600, 800, 84, 28),
    park: R(1010, 330, 760, 44, 26), pQ: R(1010, 386, 760, 84, 28), unres: R(1010, 500, 760, 66, 26), nextC: R(150, 600, 760, 90, 28),
    cP: R(150, 330, 760, 76, 26), cS: R(150, 420, 760, 76, 26),
    o3: C3.map((x) => R(x, 360, 520, 90, 30)), waitC: R(560, 480, 800, 56, 26), nmH: R(150, 570, 1620, 44, 26), nm: R(150, 626, 1620, 170, 30),
    f3: C3.map((x) => R(x, 440, 520, 100, 30))
  };

  function setup(E, ctx) {
    const K = global.L07Kit.base(E, ctx), tok = K.tok, L = E.label, sc = ctx.D.graph.scenario || {};
    tok('nm', G.nm, 'note', '', 'token.note'); // container first
    tok('newL', G.newB, 'framehead', L('s07.new'), 'token.frame');
    tok('prompt', G.prompt, 'example', sc.sourcePrompt || '', 'token.quoteLong', { tag: 'x.ref' });
    tok('oP', G.oP, 'step', L('s07.personal'), 'token.step'); tok('oS', G.oS, 'step', L('s07.shared'), 'token.step'); tok('task', G.task, 'chipcard', L('s07.task'), 'token.chip');
    tok('q', G.sQ, 'question', L('s07.question'), 'token.question');
    tok('rel', G.rel, 'chipcard', L('s07.relevant'), 'token.chip'); tok('open', G.open, 'step gap', L('s07.open'), 'token.step');
    tok('req', G.sReq, 'fact', L('s07.request'), 'token.step');
    tok('obs', G.obs, 'fact', L('s07.observed'), 'token.step'); tok('space', G.space, 'idea', L('s07.space'), 'token.idea');
    tok('pos', G.sPos, 'framehead', L('s07.possible'), 'token.frame'); tok('park', G.sPark, 'colhead dashed', L('s07.park'), 'token.colhead');
    tok('unres', G.unres, 'step gap', L('s07.unresolved'), 'token.step'); tok('nextC', G.nextC, 'idea', L('s07.next'), 'token.idea');
    ['x.o1', 'x.o2', 'x.o3'].forEach((k, i) => tok('o' + i, G.o3[i], 'fact', L(k), 'token.step'));
    tok('waitC', G.waitC, 'chipcard margin', L('s07.wait'), 'token.chip'); tok('nmH', G.nmH, 'colhead', L('x.nextMove'), 'token.colhead');
    ['x.f1', 'x.f2', 'x.f3'].forEach((k, i) => tok('f' + i, G.f3[i], 'step plan', L(k), 'token.step'));
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('cl'); Rx.dline(E, l, 'cl.a', 'M 1390 482 L 1390 428', '#9DB6E0'); Rx.head(E, l, 'cl.h', 1390, 424, 'up', '#9DB6E0');
    l = ly('os'); Rx.dline(E, l, 'os.a', 'M 918 470 L 996 470', '#9DB6E0'); Rx.head(E, l, 'os.h', 1002, 470, 'right', '#9DB6E0');
    l = ly('flow'); [670, 1220].forEach((x, i) => { Rx.dline(E, l, 'fl.' + i, `M ${x + 4} 490 L ${x + 22} 490`, '#9DB6E0'); Rx.head(E, l, 'fl.h' + i, x + 28, 490, 'right', '#9DB6E0'); });
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L07.S07.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a new practice example; two unselected options; the exact prompt ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('newL', at('s7_try') + 0.4, G.newB); S.rise('prompt', at('s7_team'), G.prompt);
    S.rise('oP', at('s7_team') + 1.0, G.oP); S.rise('oS', at('s7_team') + 1.3, G.oS); S.rise('task', at('s7_need'), G.task);
    // ---- d001 · Noah's open practical question ----
    let t = X0('d001'); S.head(t, null, null); X.clearAll(t, ['newL']); S.to('newL', t + 0.1, G.sNew);
    S.rise('oP', t + 0.3, G.sP); S.rise('oS', t + 0.4, G.sS);
    X.line('d001', 'ask:learner', ['wash the shared mugs'], { headFirst: true }); S.rise('q', a('d001') + 0.4, G.sQ);
    // ---- c002: the question affects the shared-mug option; its answer still missing ----
    t = X0('c002'); X.roomOut(t); S.head(t + 0.1, B(1), null); S.hide(['newL'], t);
    S.to('oP', t + 0.2, G.bP); S.to('oS', t + 0.25, G.bS); S.to('q', t + 0.3, G.bQ);
    S.addLayer('cl', at('s7_clean') + 0.8); S.rise('rel', at('s7_here'), G.rel); S.rise('open', a('c002'), G.open);
    // ---- B02 · d002 · Maya's explicit request ----
    // the B02 kicker waits until the side view has gone (c003)
    t = X0('d002'); S.head(t, null, null); X.clearAll(t); S.dropLayer('cl', t);
    S.rise('newL', t + 0.3, G.sNew); S.rise('oP', t + 0.35, G.sP); S.rise('oS', t + 0.4, G.sS); S.rise('q', t + 0.45, G.sQ);
    X.line('d002', 'explain:learner', ['a moment to think'], { headFirst: true }); S.rise('req', a('d002') + 0.3, G.sReq);
    // ---- c003 + h101: observable request → leave room; the cleaning question unanswered ----
    t = X0('c003'); X.roomOut(t); S.head(t + 0.1, B(2), null); S.hide(['newL', 'oP', 'oS', 'req'], t);
    S.rise('obs', at('s7_asked'), G.obs); S.addLayer('os', a('c003') - 0.2); S.rise('space', at('s7_consider'), G.space); S.to('q', t + 0.3, G.qSide);
    X.hold('h101');
    // ---- d003 · one possible response: the question moves to "Question to check" ----
    t = X0('d003'); S.head(t, null, null); X.clearAll(t); S.dropLayer('os', t);
    S.rise('newL', t + 0.3, G.sNew); S.rise('oP', t + 0.35, G.sP); S.rise('oS', t + 0.4, G.sS); S.rise('q', t + 0.45, G.sQ); S.rise('pos', t + 0.5, G.sPos);
    X.line('d003', 'explain:maya', ['Take your time', 'before we decide'], { headFirst: true });
    S.rise('park', a('d003') - 0.4, G.sPark); S.to('q', a('d003') + 0.2, G.sQp);
    // ---- c004: all outcome fields open; listen to what follows ----
    t = X0('c004'); X.roomOut(t); S.head(t + 0.1, B(2), null); S.hide(['newL', 'pos'], t);
    S.to('oP', t + 0.2, G.cP); S.to('oS', t + 0.25, G.cS); S.to('park', t + 0.3, G.park); S.to('q', t + 0.35, G.pQ);
    S.rise('unres', at('s7_stays') + 0.8, G.unres); S.rise('nextC', a('c004'), G.nextC);
    // ---- B03 · c005 + h102: three observation cards; waiting can be useful; a blank Next move area ----
    t = X0('c005'); S.head(t, B(3), null); X.clearAll(t); S.title(a('c005'), 's07.observe');
    S.rise('o0', at('s7_fin'), G.o3[0]); S.rise('o1', at('s7_time'), G.o3[1]); S.rise('o2', at('s7_rel'), G.o3[2]); S.rise('waitC', at('s7_wait'), G.waitC);
    S.rise('nmH', at('s7_wait') + 0.8, G.nmH); S.rise('nm', at('s7_wait') + 1.0, G.nm, { text: '' });
    X.hold('h102');
    // ---- c006: Observe → make a small move → listen (a flexible reminder) ----
    t = X0('c006'); S.title(t, null); X.clearAll(t);
    S.rise('f0', at('s7_tryOne'), G.f3[0]); S.addLayer('flow', at('s7_tryOne') + 0.4); S.rise('f1', at('s7_tryOne') + 0.6, G.f3[1]); S.rise('f2', a('c006'), G.f3[2]);
    S.title(a('c006') + 0.6, 's07.end');
  }
  global.L07Scenes = { setup };
})(window);
