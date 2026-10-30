/*
 * L08.S04 · Explain a Trade-off against Shared Criteria. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Two candidate columns under one row of task criteria, with no scores. Durations are flexible bands inside one fixed
 * 30-minute container (an illustration, never a timetable). The preference, its purpose, its cost and its checks stay on
 * one editable card marked "Not adopted"; Noah's check is an authored excerpt, not a new case fact.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C3 = [150, 700, 1250];
  const G = {
    crit: R(150, 300, 1620, 44, 26), cr: C3.map((x) => R(x, 356, 520, 76, 26)), cA: R(150, 470, 760, 50, 24), cB: R(1010, 470, 760, 50, 24),
    oL: R(150, 540, 760, 90, 28), oB: R(1010, 540, 760, 90, 28), unset: R(560, 680, 800, 56, 26),
    tot: R(150, 380, 500, 44, 26), b0: [R(150, 440, 350, 84, 26), R(510, 440, 440, 84, 26), R(960, 440, 360, 84, 26), R(1330, 440, 440, 84, 26)],
    b1: [R(150, 440, 650, 84, 26), R(810, 440, 260, 84, 26), R(1080, 440, 240, 84, 26), R(1330, 440, 440, 84, 26)], ct: R(560, 600, 800, 66, 26),
    bH: R(150, 380, 760, 44, 26), bN: R(150, 436, 760, 300, 30), cH: R(1010, 380, 760, 44, 26), cN: R(1010, 436, 760, 300, 30),
    pr: R(150, 330, 760, 100, 28), rl: R(1010, 330, 760, 100, 28), rc: R(1010, 470, 760, 90, 28),
    sTr: R(1140, 150, 690, 50, 24), sBr: R(1140, 214, 690, 84, 26), sChk: R(1140, 314, 690, 90, 26),
    scope: R(150, 480, 760, 66, 26), rOpen: R(1010, 480, 760, 66, 26), chal: R(560, 600, 800, 90, 28),
    ess: R(150, 420, 760, 100, 30), dur: R(1010, 420, 760, 100, 30),
    qm: R(150, 420, 520, 100, 28), sl: R(700, 420, 520, 100, 28), uq: R(1250, 420, 520, 100, 28),
    pm: R(150, 380, 760, 90, 28), rp: R(1010, 380, 760, 90, 28), sr: R(1010, 500, 760, 90, 28),
    exD: R(560, 420, 800, 90, 28),
    pc: C3.map((x) => R(x, 330, 520, 76, 26)), resp: R(150, 440, 1620, 300, 30),
    kF: R(150, 300, 1620, 340), kH: R(190, 316, 760, 50, 24), kO: R(190, 390, 760, 90, 28), kL: R(990, 390, 740, 90, 26), kC: R(190, 520, 760, 90, 26), kK: R(990, 520, 740, 90, 26),
    grp: R(560, 440, 800, 100, 28)
  };

  function setup(E, ctx) {
    const K = global.L08Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('bN', G.bN, 'note', '', 'token.note'); tok('cN', G.cN, 'note', '', 'token.note'); tok('resp', G.resp, 'note', '', 'token.note'); tok('kF', G.kF, 'ctx frame', '', 'token.default'); // containers first
    tok('crit', G.crit, 'colhead', L('x.crit'), 'token.colhead');
    ['criterion.participation', 'criterion.information', 'criterion.fit'].forEach((k, i) => tok('cr' + i, G.cr[i], 'question', L(k), 'token.question'));
    tok('cA', G.cA, 'framehead', L('x.candA'), 'token.frame'); tok('cB', G.cB, 'framehead', L('x.candB'), 'token.frame');
    tok('oL', G.oL, 'proposal', L('option.longer'), 'token.step'); tok('oB', G.oB, 'proposal', L('option.brief'), 'token.step'); tok('unset', G.unset, 'chipcard margin', L('timing.unset'), 'token.chip');
    tok('tot', G.tot, 'colhead', L('x.total'), 'token.colhead');
    ['x.bEx', 'x.bPairs', 'x.bShare', 'x.bQ'].forEach((k, i) => tok('b' + i, G.b0[i], i === 3 ? 'chipcard mark' : 'proposal', L(k), i === 3 ? 'token.chip' : 'token.step'));
    tok('ct', G.ct, 'chipcard margin', L('cost.time'), 'token.chip');
    tok('bH', G.bH, 'colhead dashed', L('x.benefit'), 'token.colhead'); tok('cH', G.cH, 'colhead dashed', L('x.cost'), 'token.colhead');
    tok('rl', G.rl, 'idea', L('reason.link'), 'token.idea'); tok('rc', G.rc, 'question', L('reason.check'), 'token.question');
    tok('trd', G.sTr, 'framehead', L('example.tradeoff'), 'token.frame'); tok('chk', G.sChk, 'question', L('check.reason'), 'token.question');
    tok('scope', G.scope, 'chipcard margin', L('scope.this'), 'token.chip'); tok('rOpen', G.rOpen, 'chipcard margin', L('revision.open'), 'token.chip'); tok('chal', G.chal, 'question', L('x.challenge'), 'token.question');
    tok('ess', G.ess, 'idea', L('essential.reason'), 'token.idea'); tok('dur', G.dur, 'step gap', L('duration.pending'), 'token.step');
    tok('qm', G.qm, 'fact', L('questions.minimum'), 'token.step'); tok('sl', G.sl, 'step gap', L('sheet.limit'), 'token.step'); tok('uq', G.uq, 'question', L('x.unknownQ'), 'token.question');
    tok('pm', G.pm, 'proposal', L('x.purposeM'), 'token.step'); tok('rp', G.rp, 'idea', L('respect.purpose'), 'token.idea'); tok('sr', G.sr, 'step', L('selection.reason'), 'token.step');
    tok('kH', G.kH, 'framehead', L('preference.status'), 'token.frame');
    tok('grp', G.grp, 'question', L('x.toGroup'), 'token.question');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('bar'); E.dashed(l, 'bar.a', 'M 150 434 L 150 428 L 1770 428 L 1770 434', '#9DB6E0');
    l = ly('div'); E.dashed(l, 'div.a', 'M 960 400 L 960 540', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L08.S04.B0' + n, M = X.MOTION;
    const BD = ['b0', 'b1', 'b2', 'b3'];
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: two candidate columns under one shared criterion row; no scores ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('crit', at('s4_when') + 0.6, G.crit);
    S.rise('cr0', at('s4_will'), G.cr[0]); S.rise('cr1', at('s4_how'), G.cr[1]); S.rise('cr2', at('s4_can'), G.cr[2]);
    S.rise('cA', a('c001') + 0.3, G.cA); S.rise('cB', a('c001') + 0.5, G.cB);
    // ---- c002: the two candidates; durations not set ----
    let t = X0('c002'); S.rise('oL', at('s4_one'), G.oL); S.rise('oB', at('s4_another'), G.oB); S.rise('unset', at('s4_neither'), G.unset);
    // ---- c003: one fixed 30-minute container; one band grows and the others contract (illustrative) ----
    t = X0('c003'); X.clearAll(t);
    S.rise('tot', at('s4_longer'), G.tot); S.addLayer('bar', at('s4_longer') + 0.2); BD.forEach((id, i) => S.rise(id, at('s4_longer') + 0.4 + i * 0.12, G.b0[i]));
    BD.forEach((id, i) => S.to(id, at('s4_also') + 0.3, G.b1[i], {}, M.layout)); S.rise('ct', at('s4_also') + 1.4, G.ct); S.title(at('s4_total'), 'total.fixed');
    // ---- h101: blank benefit and cost notes; no winner ----
    const H1 = X.cue('h101'); S.title(H1.start, null); X.clearAll(H1.start); S.dropLayer('bar', H1.start);
    S.rise('bH', H1.start + 0.3, G.bH); S.rise('bN', H1.start + 0.4, G.bN, { text: '' }); S.rise('cH', H1.start + 0.5, G.cH); S.rise('cN', H1.start + 0.6, G.cN, { text: '' });
    X.hold('h101');
    // ---- B02 · c004: a provisional preference with its purpose and check attached ----
    t = X0('c004'); S.head(t, B(2), null); X.clearAll(t);
    S.rise('oB', at('s4_prefer'), G.pr); S.rise('rl', at('s4_prefer') + 0.8, G.rl); S.rise('rc', at('s4_still'), G.rc);
    // ---- d001 · the participant's preference with its limitation ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t); S.rise('trd', t + 0.3, G.sTr); S.rise('oB', t + 0.4, G.sBr);
    X.line('d001', 'explain:noah', ['room to try the discussion in pairs', 'shows the reasoning clearly'], { headFirst: true });
    // ---- c005: the same card stays editable; challenges attach to the reasoning ----
    t = X0('c005'); X.roomOut(t); S.head(t + 0.1, B(2), null); S.hide(['trd'], t);
    S.to('oB', t + 0.2, G.pr); S.rise('rl', t + 0.4, G.rl); S.rise('scope', at('s4_not') + 0.8, G.scope); S.rise('rOpen', at('s4_someone'), G.rOpen); S.rise('chal', at('s4_someone') + 0.8, G.chal);
    // ---- d002 · Noah's authored check ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t); S.rise('oB', t + 0.3, G.sBr);
    X.line('d002', 'ask:learner', ['include a reason'], { headFirst: true }); S.rise('chk', a('d002') + 0.3, G.sChk);
    // ---- c006: essential content separated from the duration decision ----
    t = X0('c006'); X.roomOut(t); S.head(t + 0.1, B(2), null); X.clearAll(t);
    S.rise('ess', at('s4_helps') + 0.6, G.ess); S.addLayer('div', at('s4_keeping') - 0.2); S.rise('dur', at('s4_keeping'), G.dur);
    // ---- B03 · c007: minimum time vs answer coverage; unknown questions stay open ----
    t = X0('c007'); S.head(t, B(3), null); X.clearAll(t); S.dropLayer('div', t);
    S.rise('qm', at('s4_least'), G.qm); S.rise('sl', at('s4_pres'), G.sl); S.rise('uq', at('s4_pres') + 0.6, G.uq);
    // ---- c008: an attributed purpose carried into a revised arrangement ----
    t = X0('c008'); X.clearAll(t);
    S.rise('pm', at('s4_taking'), G.pm, { tag: '' }); S.rise('rp', a('c008'), G.rp); S.rise('sr', at('s4_explain'), G.sr);
    // ---- c009: a willingness/preparation check attached to the example ----
    t = X0('c009'); X.clearAll(t); S.rise('b0', at('s4_here'), G.exD, { tag: 'dependency.person', kind: 'proposal', slot: 'token.step' });
    // ---- h102: criterion headings as optional prompts; a blank response area ----
    const H2 = X.cue('h102'); X.clearAll(H2.start);
    ['cr0', 'cr1', 'cr2'].forEach((id, i) => S.rise(id, H2.start + 0.3 + i * 0.1, G.pc[i])); S.rise('resp', H2.start + 0.6, G.resp, { text: '' });
    X.hold('h102');
    // ---- B04 · c010: one compact candidate card with its conditions; Not adopted ----
    t = X0('c010'); S.head(t, B(4), null); X.clearAll(t);
    S.rise('kF', at('s4_now'), G.kF); S.rise('kH', at('s4_now') + 0.2, G.kH);
    S.rise('oB', at('s4_keep'), G.kO, { tag: 'x.notAdopted' }); S.rise('rl', at('s4_keep') + 0.3, G.kL); S.rise('ct', at('s4_keep') + 0.6, G.kC); S.rise('rc', at('s4_keep') + 0.9, G.kK);
    // ---- c011: a proposed check addressed to the group ----
    t = X0('c011'); X.clearAll(t); S.rise('grp', at('s4_next') + 0.6, G.grp); S.title(a('c011'), 'next.support');
  }
  global.L08Scenes = { setup };
})(window);
