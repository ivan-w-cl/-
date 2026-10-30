/*
 * L08.S05 · Present a Combined Proposal and Check Its Status. Section adapter (tokens, rects, timing by cue starts and anchors).
 * A visibly labelled later authored proposal check (snapshot proposal_check). The baseline ledger stays separate and
 * unchanged. A status cell changes only right after that person's exact words: Maya → conditional support (both
 * conditions attached); Noah → two supported elements plus the whole sequence still open. The example leader and the
 * timing never change. The offered next check stays "Offered" (no reply, no assignment, no leader, no vote).
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C4 = [150, 570, 990, 1410];
  const G = {
    stg: C4.map((x) => R(x, 440, 360, 90, 26)), tags: [R(150, 590, 760, 56, 26), R(1010, 590, 760, 56, 26)],
    snap: R(150, 300, 620, 50, 24), rule: R(800, 300, 970, 50, 26), bH: R(150, 600, 1620, 44, 26), bM: R(150, 656, 760, 76, 26), bN: R(1010, 656, 760, 76, 26),
    sSnap: R(1140, 150, 690, 50, 22), sStat: R(1140, 214, 690, 50, 22), sCand: C4.map((x, i) => R(1140, 280 + i * 70, 690, 60, 26)),
    txt: R(150, 360, 760, 56, 26), cStg: C4.map((x) => R(x, 440, 360, 90, 26)), rem: R(560, 590, 800, 66, 26),
    fixH: R(150, 370, 1620, 44, 26), candH: R(150, 490, 1620, 44, 26), hStg: C4.map((x) => R(x, 546, 360, 84, 26)), hBl: R(150, 650, 1620, 130, 30),
    lP: R(150, 370, 300, 44, 26), lS: R(480, 370, 1290, 44, 26), nm: [R(150, 426, 300, 96, 28), R(150, 534, 300, 96, 28)], cell: [R(480, 426, 1290, 96, 26), R(480, 534, 1290, 96, 26)],
    scope: R(150, 650, 1000, 76, 26), open: R(1180, 660, 590, 56, 26),
    cellM: [R(480, 426, 620, 96, 26), R(1130, 426, 640, 96, 26)], cellN: [R(480, 534, 620, 96, 26), R(1130, 534, 640, 96, 26)], lead: R(480, 642, 1290, 60, 26),
    sM: R(1140, 150, 690, 66, 26), sMn: R(1140, 226, 690, 84, 26), sN: R(1140, 326, 690, 66, 26), sNn: R(1140, 402, 690, 84, 26),
    nT: R(150, 714, 760, 66, 26), nP: R(1010, 714, 760, 66, 26),
    offerC: R(560, 420, 800, 66, 26), sOffer: R(1140, 150, 690, 84, 26),
    col: [R(150, 330, 520, 44, 26), R(700, 330, 520, 44, 26), R(1250, 330, 520, 44, 26)], oCard: R(150, 390, 520, 120, 26),
    rowH: [330, 470, 610].map((y) => R(150, y, 880, 40, 26)), rowB: [370, 510, 650].map((y) => R(150, y, 880, 84, 30)), refM: R(1070, 330, 700, 150, 26), refN: R(1070, 520, 700, 230, 26),
    hF: R(150, 300, 1620, 470), hH: R(190, 316, 760, 50, 24), h: [390, 480, 570, 660].map((y) => R(190, y, 1540, 76, 26)),
    fin: [R(150, 330, 760, 66, 26), R(1010, 330, 760, 66, 26)], rH: R(150, 430, 1620, 44, 26), rBl: R(150, 486, 1620, 260, 30)
  };

  function setup(E, ctx) {
    const K = global.L08Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('hBl', G.hBl, 'note', '', 'token.note'); tok('hF', G.hF, 'ctx frame', '', 'token.default'); tok('rBl', G.rBl, 'note', '', 'token.note');
    [0, 1, 2].forEach((i) => tok('rb' + i, G.rowB[i], 'note', '', 'token.note')); // containers first
    ['x.st.ex', 'x.st.pairs', 'x.st.share', 'x.st.q'].forEach((k, i) => tok('st' + i, G.stg[i], i === 3 ? 'fact' : 'proposal', L(k), 'token.step'));
    tok('tg0', G.tags[0], 'step gap', L('checks.remaining'), 'token.step');
    tok('snap', G.snap, 'framehead', L('snapshot.current'), 'token.frame'); tok('rule', G.rule, 'chipcard margin', L('snapshot.rule'), 'token.chip');
    tok('bH', G.bH, 'colhead', L('x.base'), 'token.colhead'); tok('bM', G.bM, 'step', L('x.base.m'), 'token.step'); tok('bN', G.bN, 'step', L('x.base.n'), 'token.step');
    tok('pst', G.sStat, 'framehead', L('proposal.status'), 'token.frame');
    tok('txt', G.txt, 'fact', L('x.text'), 'token.step');
    tok('fixH', G.fixH, 'colhead', L('x.fixed'), 'token.colhead'); tok('candH', G.candH, 'colhead dashed', L('x.candRail'), 'token.colhead');
    tok('lP', G.lP, 'colhead', L('x.l.person'), 'token.colhead'); tok('lS', G.lS, 'colhead', L('x.l.status'), 'token.colhead');
    tok('nmM', G.nm[0], 'framehead', L('x.maya'), 'token.frame'); tok('nmN', G.nm[1], 'framehead', L('x.noah'), 'token.frame');
    tok('cM', G.cell[0], 'note', L('x.none'), 'token.note'); tok('cN', G.cell[1], 'note', L('x.none'), 'token.note');
    tok('scope', G.scope, 'question', L('check.scope'), 'token.question'); tok('open', G.open, 'chipcard margin', L('check.open'), 'token.chip');
    tok('mNew', G.cellM[0], 'step', L('maya.new'), 'token.step'); tok('mCond', G.cellM[1], 'step gap', L('maya.condition'), 'token.step');
    tok('nNew', G.cellN[0], 'step', L('noah.elements'), 'token.step'); tok('nCond', G.cellN[1], 'step gap', L('noah.condition'), 'token.step');
    tok('lead', G.lead, 'step gap', L('leader.unanswered'), 'token.step');
    tok('nT', G.nT, 'question', L('next.timing'), 'token.question'); tok('nP', G.nP, 'question', L('next.person'), 'token.question');
    tok('offerC', G.offerC, 'chipcard margin', L('next.offer'), 'token.chip'); tok('offer', G.sOffer, 'proposal', L('offer.exact'), 'token.step');
    ['x.col.offered', 'x.col.assigned', 'x.col.done'].forEach((k, i) => tok('col' + i, G.col[i], i === 0 ? 'colhead' : 'colhead dashed', L(k), 'token.colhead'));
    ['x.r1', 'x.r2', 'x.r3'].forEach((k, i) => tok('rh' + i, G.rowH[i], 'colhead dashed', L(k), 'token.colhead'));
    const P = (ctx.D.graph.scenario.snapshots || {}).proposal_check || {};
    tok('refM', G.refM, 'excerpt', P.mayaReply || '', 'token.step', { tag: 'x.maya' }); tok('refN', G.refN, 'excerpt', P.noahReply || '', 'token.step', { tag: 'x.noah' });
    tok('hH', G.hH, 'framehead', L('handover.items'), 'token.frame'); ['x.h1', 'x.h2', 'x.h3', 'x.h4'].forEach((k, i) => tok('h' + i, G.h[i], i === 3 ? 'step gap' : 'step', L(k), 'token.step'));
    tok('fin0', G.fin[0], 'step', L('x.partial'), 'token.step'); tok('fin1', G.fin[1], 'step gap', L('x.wholeOpen'), 'token.step'); tok('rH', G.rH, 'colhead dashed', L('x.reh'), 'token.colhead');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('seq'); [510, 930, 1350].forEach((x, i) => { Rx.dline(E, l, 'sq.' + i, `M ${x + 6} 485 L ${x + 44} 485`, '#9DB6E0'); Rx.head(E, l, 'sq.h' + i, x + 50, 485, 'right', '#9DB6E0'); });
    l = ly('txt'); [330, 750].forEach((x, i) => Rx.dline(E, l, 'tx.' + i, `M ${x} 418 L ${x} 436`, '#9DB6E0'));
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L08.S05.B0' + n, M = X.MOTION;
    const ST = ['st0', 'st1', 'st2', 'st3'];
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a candidate sequence with purpose links and open checks; no "agreed" stamp ----
    S.head(X0('c001') + 0.1, B(1), null); ST.forEach((id, i) => S.rise(id, at('s5_show') + i * 0.3, G.stg[i])); S.addLayer('seq', at('s5_show') + 1.2);
    S.rise('tg0', at('s5_giving'), G.tags[0]); S.title(a('c001') - 0.2, 'candidate.inspect');
    // ---- c002: a visible snapshot change; the baseline ledger kept separately ----
    let t = X0('c002'); S.title(t, null); X.clearAll(t); S.dropLayer('seq', t);
    S.rise('snap', at('s5_later'), G.snap); S.rise('bH', at('s5_earlier'), G.bH); S.rise('bM', at('s5_earlier') + 0.3, G.bM); S.rise('bN', at('s5_earlier') + 0.5, G.bN);
    S.rise('rule', a('c002') - 0.2, G.rule);
    // ---- d001 · the participant proposes the candidate and asks for checks ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t, ['snap']); S.to('snap', t + 0.1, G.sSnap); S.rise('pst', t + 0.3, G.sStat);
    X.line('d001', 'propose:maya', ['brief example', 'at least five minutes', 'before we decide'], { headFirst: true });
    ST.forEach((id, i) => S.rise(id, a('d001') - 2.0 + i * 0.2, G.sCand[i]));
    // ---- c003: one text across connected stages; timing and leader tags stay attached ----
    t = X0('c003'); X.roomOut(t); S.head(t + 0.1, B(1), null); S.hide(['pst'], t); S.to('snap', t + 0.1, G.snap);
    ST.forEach((id, i) => S.to(id, t + 0.2 + i * 0.08, G.cStg[i])); S.rise('txt', at('s5_same') + 0.5, G.txt); S.addLayer('txt', at('s5_same') + 0.8); S.rise('tg0', at('s5_still'), G.rem);
    // ---- h101: fixed requirement rail vs candidate rail; blank response ----
    const H1 = X.cue('h101'); X.clearAll(H1.start, ['snap']); S.dropLayer('txt', H1.start);
    S.rise('fixH', H1.start + 0.3, G.fixH); S.rise('candH', H1.start + 0.4, G.candH); ST.forEach((id, i) => S.rise(id, H1.start + 0.5 + i * 0.08, G.hStg[i])); S.rise('hBl', H1.start + 0.8, G.hBl, { text: '' });
    X.hold('h101');
    // ---- B02 · c004: the support ledger with open status cells (no default) ----
    t = X0('c004'); S.head(t, B(2), null); X.clearAll(t, ['snap']);
    S.rise('lP', at('s5_focused'), G.lP); S.rise('lS', at('s5_focused') + 0.15, G.lS); S.rise('nmM', at('s5_focused') + 0.4, G.nm[0]); S.rise('nmN', at('s5_focused') + 0.5, G.nm[1]);
    S.rise('cM', at('s5_focused') + 0.7, G.cell[0]); S.rise('cN', at('s5_focused') + 0.8, G.cell[1]); S.rise('scope', at('s5_do'), G.scope); S.rise('open', at('s5_leave'), G.open);
    // ---- d002 · Maya's exact conditional support: only Maya's card moves ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t); S.rise('nmM', t + 0.3, G.sM);
    X.line('d002', 'explain:learner', ['if the demonstration stays brief'], { headFirst: true }); S.rise('mNew', a('d002') + 0.4, G.sMn, { tag: '' });
    // ---- c005: Maya's row → conditional support with both conditions; timing and leader unchanged ----
    t = X0('c005'); X.roomOut(t); S.head(t + 0.1, B(2), null);
    S.rise('snap', t + 0.2, G.snap); S.rise('lP', t + 0.3, G.lP); S.rise('lS', t + 0.35, G.lS); S.to('nmM', t + 0.2, G.nm[0]); S.rise('nmN', t + 0.4, G.nm[1]); S.rise('cN', t + 0.5, G.cell[1]);
    S.to('mNew', t + 0.3, G.cellM[0]); S.rise('mCond', at('s5_record'), G.cellM[1]); S.rise('lead', at('s5_dont'), G.lead);
    // ---- d003 · Noah's exact words: two elements supported; full sequence pending timing ----
    t = X0('d003'); S.head(t, null, null); X.clearAll(t); S.rise('nmN', t + 0.3, G.sN);
    X.line('d003', 'explain:learner', ['not ready to agree on the full sequence'], { headFirst: true }); S.rise('nNew', a('d003') + 0.4, G.sNn);
    // ---- c006: Noah's row holds the mixed position in words, not yes/no colour ----
    t = X0('c006'); X.roomOut(t); S.head(t + 0.1, B(2), null);
    S.rise('snap', t + 0.2, G.snap); S.rise('lP', t + 0.3, G.lP); S.rise('lS', t + 0.35, G.lS); S.rise('nmM', t + 0.4, G.nm[0]); S.rise('mNew', t + 0.45, G.cellM[0]); S.rise('mCond', t + 0.5, G.cellM[1]);
    S.to('nmN', t + 0.2, G.nm[1]); S.to('nNew', t + 0.3, G.cellN[0]); S.rise('nCond', at('s5_pres') + 0.6, G.cellN[1]); S.rise('lead', t + 0.6, G.lead);
    // ---- B03 · c007: the updated ledger beside two unresolved next checks (neither assigned) ----
    t = X0('c007'); S.head(t, B(3), null); S.hide(['lead'], t); S.rise('nT', at('s5_useful'), G.nT); S.rise('nP', at('s5_someone'), G.nP); S.title(a('c007') - 0.2, null);
    // ---- c008: an optional offer, no leader badge or tally ----
    t = X0('c008'); X.clearAll(t); S.rise('offerC', at('s5_offer') + 0.6, G.offerC);
    // ---- d004 · the participant offers a next check; no reply follows ----
    t = X0('d004'); S.head(t, null, null); X.clearAll(t);
    X.line('d004', 'ask:maya', ['including transitions'], { headFirst: true }); S.rise('offer', a('d004') + 0.4, G.sOffer);
    // ---- c009: the next-step card stays in "Offered" ----
    t = X0('c009'); X.roomOut(t); S.head(t + 0.1, B(3), null);
    ['col0', 'col1', 'col2'].forEach((id, i) => S.rise(id, t + 0.2 + i * 0.1, G.col[i])); S.to('offer', t + 0.3, G.oCard, { tag: 'offer.status' }); S.pulseOn(['col0'], at('s5_without') + 0.6, 1.2);
    // ---- h102: three blank rows; the exact replies as references ----
    const H2 = X.cue('h102'); X.clearAll(H2.start);
    ['rh0', 'rh1', 'rh2'].forEach((id, i) => { S.rise(id, H2.start + 0.3 + i * 0.1, G.rowH[i]); S.rise('rb' + i, H2.start + 0.4 + i * 0.1, G.rowB[i], { text: '' }); });
    S.rise('refM', H2.start + 0.8, G.refM); S.rise('refN', H2.start + 0.9, G.refN);
    X.hold('h102');
    // ---- B04 · c010: a four-line handover with every condition kept ----
    t = X0('c010'); S.head(t, B(4), null); X.clearAll(t);
    S.rise('hF', at('s5_helpful'), G.hF); S.rise('hH', at('s5_helpful') + 0.2, G.hH); ['h0', 'h1', 'h2', 'h3'].forEach((id, i) => S.rise(id, at('s5_helpful') + 0.8 + i * 0.6, G.h[i]));
    // ---- c011: clear partial/open status; a blank rehearsal card ----
    t = X0('c011'); X.clearAll(t);
    S.rise('fin0', at('s5_point'), G.fin[0]); S.rise('fin1', at('s5_point') + 0.3, G.fin[1]); S.rise('rH', at('s5_inNext'), G.rH); S.rise('rBl', at('s5_inNext') + 0.2, G.rBl, { text: '' });
  }
  global.L08Scenes = { setup };
})(window);
