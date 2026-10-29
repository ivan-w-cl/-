/*
 * L04.S04 · Compare Options Against the Same Criteria. Section adapter (tokens, rects, timing by cue starts and anchors).
 * A comparison grid: the same four task-derived questions for both proposals; cells are possibility, cost or question
 * cards (no points, weights, stars or winner colour). Maya's original statement keeps its "original statement" tag; the
 * full-answer option is marked as one possible version. Outcomes stay "not yet observed".
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const ROWS = [416, 506, 596, 686], COLA = 600, COLB = 1200;
  const row = (i) => R(150, ROWS[i], 420, 80, 26), cellA = (i) => R(COLA, ROWS[i], 570, 80, 26), cellB = (i) => R(COLB, ROWS[i], 570, 80, 26);
  const G = {
    space: [R(COLA, 300, 570, 466, 30), R(COLB, 300, 570, 466, 30)],
    frame: R(150, 300, 1620, 540), frameLbl: R(190, 326, 820, 54, 26), time: R(190, 404, 390, 72, 28), probs: R(600, 404, 410, 72, 28), goal: R(190, 500, 820, 90, 30),
    outs: R(190, 612, 820, 80, 28), status: R(190, 712, 820, 64, 26),
    sMaya: R(1140, 236, 690, 90, 28),
    maya: R(150, 300, 800, 96, 30), optA: R(150, 470, 800, 100, 30), optB: R(1060, 470, 710, 100, 30),
    hA: R(COLA, 300, 570, 96, 28), hB: R(COLB, 300, 570, 96, 28),
    sB: R(1140, 160, 690, 96, 28), sBasis: R(1140, 300, 690, 84, 28), sLimit: R(1140, 420, 690, 84, 28),
    fair: R(COLA, ROWS[3], 1170, 80, 26), evid: R(150, 786, 800, 54, 24),
    path: [R(150, 480, 380, 120, 28), R(563, 480, 380, 120, 28), R(976, 480, 380, 120, 28), R(1389, 480, 380, 120, 28)],
    pA: R(150, 300, 800, 96, 28), pB: R(1060, 300, 710, 96, 28), blank: R(150, 440, 1620, 330, 30), priv: R(150, 790, 800, 40, 22),
    sModel: R(1140, 150, 690, 56, 26), model: R(1140, 230, 690, 260, 28),
    endQ: R(560, 470, 800, 100, 32), dec: R(560, 620, 800, 54, 26)
  };

  function setup(E, ctx) {
    const K = global.L04Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('frame', G.frame, 'ctx frame', '', 'token.default');
    tok('sp1', G.space[0], 'note unobserved', L('x.space1'), 'token.note'); tok('sp2', G.space[1], 'note unobserved', L('x.space2'), 'token.note');
    tok('frameLbl', G.frameLbl, 'framehead', L('x.fictional'), 'token.frame'); tok('time', G.time, 'chipcard', L('task.time'), 'token.chip'); tok('probs', G.probs, 'chipcard', L('task.problems'), 'token.chip');
    tok('goal', G.goal, 'goal', L('task.goal'), 'token.step'); tok('outs', G.outs, 'step plan', L('tool.outputs'), 'token.step'); tok('status', G.status, 'framehead', L('tool.status'), 'token.frame');
    tok('maya', G.sMaya, 'proposal', L('proposal.maya'), 'token.step', { tag: 'proposal.status' });
    tok('optA', G.optA, 'proposal', L('option.a'), 'token.step', { tag: 'x.oneVersion' }); tok('optB', G.optB, 'proposal', L('option.b'), 'token.step');
    ['criterion.time', 'criterion.reasoning', 'criterion.start', 'criterion.check'].forEach((k, i) => tok('r' + i, row(i), 'colhead', L(k), 'token.colhead'));
    tok('aTime', cellA(0), 'step plan', L('a.cost'), 'token.step'); tok('aReason', cellA(1), 'question', L('a.question'), 'token.question'); tok('aStart', cellA(2), 'step plan', L('a.possible'), 'token.step');
    tok('bReason', cellB(1), 'step plan', L('b.possible'), 'token.step'); tok('bStart', cellB(2), 'step plan', L('b.limit'), 'token.step'); tok('bCheck', cellB(3), 'step plan', L('b.check'), 'token.step');
    tok('fair', G.fair, 'idea', L('fairness.check'), 'token.idea'); tok('evid', G.evid, 'framehead', L('evidence.status'), 'token.frame');
    tok('basis', G.sBasis, 'idea reason', L('preference.basis'), 'token.step'); tok('limit', G.sLimit, 'question', L('preference.limit'), 'token.question');
    tok('n1', G.path[0], 'proposal', L('x.step'), 'token.step'); tok('n2', G.path[1], 'question', L('check.conditions'), 'token.question'); tok('n3', G.path[2], 'question', L('check.reason'), 'token.question'); tok('n4', G.path[3], 'note', L('check.uncertain'), 'token.note');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note'); tok('priv', G.priv, 'hint', L('reflection.private'), 'token.hint');
    tok('sModel', G.sModel, 'framehead', L('model.label'), 'token.frame'); tok('model', G.model, 'example', E.cueText('L04.S04.d003'), 'token.summary');
    tok('dec', G.dec, 'framehead', L('decision.state'), 'token.frame');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('rail'); E.dashed(l, 'rail.a', 'M 360 416 L 360 766', '#9DB6E0'); ROWS.forEach((y, i) => E.dashed(l, 'rail.t' + i, `M 340 ${y + 40} L 380 ${y + 40}`, '#9DB6E0'));
    l = ly('task'); E.icon(l, 'task.clock', 'clock', 1090, 410, 56, '#5D6878'); E.path(l, 'task.rail', 'M 1170 438 L 1700 438', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'task.t0', 'M 1170 422 L 1170 454', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'task.t1', 'M 1700 422 L 1700 454', { stroke: '#B9C5D6', 'stroke-width': 4 });
    l = ly('sPref'); Rx.dline(E, l, 'sPref.a', 'M 1485 264 L 1485 290', '#9DB6E0'); Rx.dline(E, l, 'sPref.b', 'M 1485 392 L 1485 410', '#B9C5D6');
    l = ly('path'); [538, 951, 1364].forEach((x, i) => { Rx.dline(E, l, 'path.' + i, `M ${x - 4} 540 L ${x + 12} 540`, '#9DB6E0'); Rx.head(E, l, 'path.h' + i, x + 18, 540, 'right', '#9DB6E0'); });
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L04.S04.B0' + n, M = X.MOTION;
    const ROWIDS = ['r0', 'r1', 'r2', 'r3'], CELLS = [['aTime', cellA(0)], ['aReason', cellA(1)], ['aStart', cellA(2)], ['bReason', cellB(1)], ['bStart', cellB(2)]];
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: two empty proposal spaces and a shared criteria rail ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('sp1', at('s4_clear'), G.space[0]); S.rise('sp2', at('s4_clear') + 0.2, G.space[1]);
    S.addLayer('rail', at('s4_each'), 0.1); S.title(a('c001') - 0.2, 'comparison.rule');
    // ---- c002: fixed task facts; one undivided 20-minute boundary; outputs unverified ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('rail', t); S.title(t, null);
    S.rise('frame', t + 0.2, G.frame); S.rise('frameLbl', at('s4_planning'), G.frameLbl); S.rise('time', at('s4_planning') + 0.4, G.time); S.addLayer('task', at('s4_planning') + 0.6, 0.1);
    S.rise('probs', at('s4_two'), G.probs); S.rise('goal', at('s4_aim'), G.goal); S.rise('outs', at('s4_tool'), G.outs); S.rise('status', a('c002'), G.status);
    // ---- d001 · Maya's exact line; a proposal, not adopted ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t); S.dropLayer('task', t);
    X.line('d001', 'propose:learner', ['as soon as a problem becomes difficult']); S.rise('maya', a('d001'), G.sMaya);
    // ---- c003: back to the original statement; one possible version beside another proposal ----
    t = X0('c003'); X.roomOut(t); S.head(t + 0.1, B(1), null);
    S.to('maya', at('s4_return'), G.maya, { tag: 'baseline.original' }); S.pulseOn(['maya'], at('s4_open'), 1.0);
    S.rise('optA', a('c003'), G.optA); S.rise('optB', at('s4_another'), G.optB); S.title(at('s4_another') + 1.5, 'comparison.scope');
    // ---- B02 · c004 + h101: the same four questions for both columns ----
    t = X0('c004'); S.head(t, B(2), null); S.title(t, null); S.hide(['maya'], t);
    S.to('optA', t + 0.2, G.hA, { tag: '' }); S.to('optB', t + 0.3, G.hB);
    S.rise('r0', at('s4_time'), row(0)); S.rise('r1', at('s4_reasoning'), row(1)); S.rise('r2', at('s4_started'), row(2)); S.rise('r3', at('s4_check'), row(3));
    S.title(a('c004') - 0.2, 'comparison.rule');
    X.hold('h101');
    // ---- c005: only the full-answer column; possibilities, a cost, an open question ----
    t = X0('c005'); S.title(t, null); S.pulseOn(['optA'], t + 0.2, 1.0);
    S.rise('aStart', at('s4_entry'), cellA(2)); S.rise('aTime', at('s4_takes'), cellA(0)); S.rise('aReason', a('c005'), cellA(1));
    // ---- c006: the attempt-and-hint column under the same rows ----
    t = X0('c006'); S.pulseOn(['optB'], t + 0.2, 1.0);
    S.rise('bReason', at('s4_gap'), cellB(1)); S.rise('bStart', at('s4_without'), cellB(2)); S.rise('bCheck', at('s4_hint') + 0.4, cellB(3));
    // ---- B03 · d002 · You: a preference with a possible mechanism, and its open question ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t);
    S.rise('optB', t + 0.3, G.sB); X.line('d002', 'explain:maya', ['might show us which step needs help', 'How would we support someone who cannot find a first step']);
    S.addLayer('sPref', at('s4_prefer') - 0.2); S.rise('basis', at('s4_prefer'), G.sBasis); S.rise('limit', at('s4_support'), G.sLimit);
    // ---- c007: back to the board; both options need checking time; outcomes unobserved ----
    t = X0('c007'); X.roomOut(t); S.hide(['basis', 'limit'], t); S.dropLayer('sPref', t); S.head(t + 0.1, B(3), null);
    S.rise('optA', t + 0.2, G.hA); S.to('optB', t + 0.2, G.hB); ROWIDS.forEach((id, i) => S.rise(id, t + 0.3 + i * 0.08, row(i)));
    CELLS.forEach(([id, r], i) => S.rise(id, t + 0.5 + i * 0.08, r)); S.rise('fair', at('s4_counting'), G.fair); S.rise('evid', at('s4_prove'), G.evid);
    S.pulseOn(['fair'], a('c007'), 1.2);
    // ---- c008: a short verification pathway, uncertainty kept visible ----
    t = X0('c008'); X.clearAll(t);
    S.rise('n1', at('s4_testing'), G.path[0]); S.addLayer('path', at('s4_conds') - 0.3, 0.3); S.rise('n2', at('s4_conds'), G.path[1]); S.rise('n3', at('s4_why'), G.path[2]); S.rise('n4', at('s4_cannot'), G.path[3]);
    S.pulseOn(['n4'], a('c008'), 1.2);
    // ---- B04 · c009 + h102: a blank private comparison beneath the two proposals ----
    t = X0('c009'); S.head(t, B(4), null); X.clearAll(t); S.dropLayer('path', t);
    S.rise('optA', at('s4_choose'), G.pA); S.rise('optB', at('s4_choose') + 0.2, G.pB); S.rise('blank', a('c009'), G.blank); S.rise('priv', at('s4_pause'), G.priv);
    X.hold('h102');
    // ---- d003 · You: one possible comparison, in its own card ----
    t = X0('d003'); S.head(t, null, null); X.clearAll(t);
    S.rise('sModel', t + 0.3, G.sModel); X.line('d003', 'explain:maya', ['might help us start', 'still need to check its reasoning', 'might reveal a gap'], { headFirst: true });
    S.rise('model', at('s4_full'), G.model);
    // ---- c010: no winner proved; the starting-help question stays open ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t); S.head(t + 0.1, B(4), null);
    S.rise('limit', at('s4_identifies'), G.endQ); S.rise('dec', a('c010') + 0.4, G.dec); S.title(at('s4_identifies') + 1.0, 'recap'); S.pulseOn(['limit'], at('s4_next'), 1.0);
  }
  global.L04Scenes = { setup };
})(window);
