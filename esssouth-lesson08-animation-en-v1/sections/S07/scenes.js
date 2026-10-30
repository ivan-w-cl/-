/*
 * L08.S07 · Transfer the Synthesis to a New Task. Section adapter (tokens, rects, timing by cue starts and anchors).
 * A visible reset to the walking-group notice (L08.TRANSFER01): no book-club card, minute or role carries over. The page
 * is a wireframe with labelled blocks ("Supplied meeting details", "Existing bring-list"); no time, place or item is
 * invented. Support statements are attributed; the readability check stays open; "test proposed" and "no checked
 * layout yet" are separate statuses.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C4 = [150, 570, 990, 1410], C3 = [150, 700, 1250];
  const G = {
    reset: R(150, 290, 620, 50, 24), prompt: R(150, 360, 1620, 200, 30),
    page: R(1190, 300, 580, 470), pH: R(1220, 316, 360, 50, 24), bD: R(1220, 390, 520, 120, 26), bL: R(1220, 530, 520, 200, 26),
    pM: R(150, 380, 960, 90, 28), pN: R(150, 540, 960, 90, 28),
    sM: R(1140, 150, 690, 76, 26), sN: R(1140, 240, 690, 76, 26),
    qM: R(150, 340, 1000, 90, 26), qN: R(150, 480, 1000, 90, 26), n1H: R(1200, 330, 570, 44, 26), n1: R(1200, 386, 570, 150, 30), n2H: R(1200, 560, 570, 44, 26), n2: R(1200, 616, 570, 150, 30),
    cM: R(150, 380, 960, 76, 26), cN: R(150, 520, 960, 76, 26), rd: R(150, 660, 960, 66, 26),
    sMod: R(1140, 330, 690, 84, 26),
    tp: R(150, 420, 760, 100, 30), ru: R(1010, 420, 760, 100, 30),
    hRef: R(150, 300, 1620, 200, 30), hpH: R(150, 520, 1620, 44, 26), hp: R(150, 576, 1620, 200, 30),
    m: C4.map((x) => R(x, 400, 360, 84, 28)), ch: R(560, 540, 800, 66, 26),
    rq: C3.map((x) => R(x, 360, 520, 100, 28)), nxH: R(150, 500, 1620, 44, 26), nx: R(150, 556, 1620, 200, 30)
  };

  function setup(E, ctx) {
    const K = global.L08Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('page', G.page, 'ctx frame', '', 'token.default'); tok('n1', G.n1, 'note', '', 'token.note'); tok('n2', G.n2, 'note', '', 'token.note');
    tok('hp', G.hp, 'note', '', 'token.note'); tok('nx', G.nx, 'note', '', 'token.note'); // containers first
    tok('reset', G.reset, 'framehead', L('transfer.reset'), 'token.frame'); tok('prompt', G.prompt, 'example', L('transfer.prompt'), 'token.quoteLong');
    tok('pH', G.pH, 'framehead', L('notice.limit'), 'token.frame'); tok('bD', G.bD, 'note', L('notice.details'), 'token.note'); tok('bL', G.bL, 'note', L('notice.list'), 'token.note');
    tok('pM', G.pM, 'proposal', L('x.pM'), 'token.step', { tag: 'x.by.maya' }); tok('pN', G.pN, 'proposal', L('x.pN'), 'token.step', { tag: 'x.by.noah' });
    tok('mT', G.sM, 'step', L('maya.transfer'), 'token.step'); tok('nT', G.sN, 'step', L('noah.transfer'), 'token.step');
    tok('qM', G.qM, 'excerpt', E.cueText('L08.S07.d001'), 'token.step', { tag: 'x.by.maya' }); tok('qN', G.qN, 'excerpt', E.cueText('L08.S07.d002'), 'token.step', { tag: 'x.by.noah' });
    tok('n1H', G.n1H, 'colhead dashed', L('x.shared'), 'token.colhead'); tok('n2H', G.n2H, 'colhead dashed', L('x.check'), 'token.colhead');
    tok('rd', G.rd, 'step gap', L('check.readability'), 'token.step');
    tok('mod', G.sMod, 'framehead', L('transfer.model'), 'token.frame');
    tok('tp', G.tp, 'proposal', L('test.proposed'), 'token.step'); tok('ru', G.ru, 'step gap', L('result.unknown'), 'token.step');
    tok('hpH', G.hpH, 'colhead dashed', L('x.priv'), 'token.colhead');
    ['x.m1', 'x.m2', 'x.m3', 'x.m4'].forEach((k, i) => tok('m' + i, G.m[i], 'step plan', L(k), 'token.step')); tok('ch', G.ch, 'chipcard margin', L('transfer.changed'), 'token.chip');
    ['review.truth', 'review.condition', 'review.action'].forEach((k, i) => tok('rq' + i, G.rq[i], 'question', L(k), 'token.question'));
    tok('nxH', G.nxH, 'colhead dashed', L('x.next'), 'token.colhead');
    K.finishTokens();
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L08.S07.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a visible new-case reset; the exact transfer prompt ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('reset', at('s7_here'), G.reset); S.rise('prompt', at('s7_here') + 0.5, G.prompt);
    // ---- c002: two attributed proposals; a one-page wireframe with labelled placeholder blocks ----
    let t = X0('c002'); S.hide(['prompt'], t);
    S.rise('pM', at('s7_maya'), G.pM); S.rise('pN', at('s7_noah'), G.pN);
    S.rise('page', at('s7_details'), G.page); S.rise('pH', at('s7_details') + 0.2, G.pH); S.rise('bD', at('s7_keep'), G.bD); S.rise('bL', at('s7_keep') + 0.3, G.bL);
    // ---- d001 / d002 · Maya's and Noah's exact support in the new case ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t);
    X.line('d001', 'explain:learner', ['keeping the checklist'], { headFirst: true }); S.rise('mT', a('d001') + 0.4, G.sM);
    X.line('d002', 'ask:learner', ['readable on one page']); S.rise('nT', a('d002') + 0.4, G.sN);
    // ---- h101: the two quotes beside a blank two-part note ----
    const H1 = X.cue('h101'); X.roomOut(H1.start); X.clearAll(H1.start);
    S.rise('qM', H1.start + 0.3, G.qM); S.rise('qN', H1.start + 0.4, G.qN);
    S.rise('n1H', H1.start + 0.5, G.n1H); S.rise('n1', H1.start + 0.6, G.n1, { text: '' }); S.rise('n2H', H1.start + 0.7, G.n2H); S.rise('n2', H1.start + 0.8, G.n2, { text: '' });
    X.hold('h101');
    // ---- B02 · c003: both proposals move into the one-page candidate; readability stays open ----
    t = X0('c003'); S.head(t, B(2), null); X.clearAll(t);
    S.rise('pM', at('s7_conn'), G.cM); S.rise('pN', at('s7_conn') + 0.2, G.cN); S.rise('page', at('s7_conn') + 0.4, G.page); S.rise('pH', at('s7_conn') + 0.5, G.pH);
    S.rise('bD', at('s7_conn') + 0.7, G.bD); S.rise('bL', at('s7_conn') + 0.8, G.bL); S.title(at('s7_not') - 0.2, 'connection.purpose'); S.rise('rd', at('s7_exact'), G.rd);
    // ---- d003 · the participant's provisional synthesis (no reply, no result follows) ----
    t = X0('d003'); S.head(t, null, null); S.title(t, null); X.clearAll(t);
    S.rise('mT', t + 0.3, G.sM); S.rise('nT', t + 0.4, G.sN);
    X.line('d003', 'propose:maya', ['before choosing the layout'], { headFirst: true }); S.rise('mod', a('d003') + 0.3, G.sMod);
    // ---- c004: "test proposed" and "no checked layout yet" as separate statuses ----
    t = X0('c004'); X.roomOut(t); S.head(t + 0.1, B(2), null); X.clearAll(t);
    S.rise('tp', at('s7_model') + 0.8, G.tp); S.rise('ru', at('s7_doesnt'), G.ru);
    // ---- h102: a blank private area with the prompt as an optional reference ----
    const H2 = X.cue('h102'); X.clearAll(H2.start); S.rise('prompt', H2.start + 0.3, G.hRef); S.rise('hpH', H2.start + 0.5, G.hpH); S.rise('hp', H2.start + 0.6, G.hp, { text: '' });
    X.hold('h102');
    // ---- B03 · c005: what transferred (method headings); the content and constraint changed ----
    t = X0('c005'); S.head(t, B(3), null); X.clearAll(t);
    ['m0', 'm1', 'm2', 'm3'].forEach((id, i) => S.rise(id, at('s7_notice') + 0.6 + i * 0.6, G.m[i])); S.rise('ch', at('s7_changed'), G.ch);
    // ---- c006: optional self-review questions; an open next-turn space ----
    t = X0('c006'); X.clearAll(t);
    S.rise('rq0', at('s7_q1'), G.rq[0]); S.rise('rq1', at('s7_q2'), G.rq[1]); S.rise('rq2', at('s7_q3'), G.rq[2]);
    S.rise('nxH', a('c006') - 0.2, G.nxH); S.rise('nx', a('c006'), G.nx, { text: '' });
  }
  global.L08Scenes = { setup };
})(window);
