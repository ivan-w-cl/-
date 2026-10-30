/*
 * L08.S01 · Map the Contributions before Combining Them. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Baseline snapshot only (F01–F09). Each proposal keeps its exact source card and its speaker's name (tag), beside a
 * shorter note; a possible reason or link is drawn as provisional (dashed, question mark), never as a quote or a result.
 * The 30-minute bar holds the 5-minute minimum inside it. Fixed constraints and proposed stages sit on different rails.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C4 = [150, 570, 990, 1410], C3 = [150, 700, 1250], ROW = [340, 476, 612];
  const G = {
    three: C3.map((x) => R(x, 340, 520, 76, 28)), mapH: C4.map((x) => R(x, 470, 360, 44, 26)), inProp: [530, 616, 702].map((y) => R(150, y, 360, 76, 26)),
    prompt: R(150, 290, 1620, 240, 30), gD: R(150, 556, 760, 66, 26), gC: R(1010, 556, 760, 66, 26), tTot: R(150, 650, 500, 44, 26),
    rest: R(150, 706, 1170, 60, 26), qSeg: R(1330, 706, 440, 60, 26),
    status: R(150, 290, 620, 46, 22), src: ROW.map((y) => R(150, y, 1000, 90, 26)), note: ROW.map((y) => R(1200, y + 7, 570, 76, 26)),
    sSrc: R(1140, 160, 690, 130, 26), sNote: R(1140, 330, 690, 66, 26),
    mM: R(150, 430, 760, 100, 28), rs: R(1010, 430, 760, 100, 28), srcTop: R(150, 290, 1620, 90, 26),
    pairs: R(150, 400, 700, 90, 28), ex: R(1070, 400, 700, 90, 28), link: R(560, 560, 800, 70, 26),
    hSrc: ROW.map((y) => R(150, y - 10, 1000, 90, 26)), blank: R(1200, 330, 570, 380, 30),
    fH: R(150, 320, 1620, 44, 26), req: R(150, 376, 760, 76, 26), tq: R(1010, 376, 760, 76, 26), pH: R(150, 500, 1620, 44, 26),
    st: C3.map((x) => R(x, 556, 520, 76, 28)), seqO: R(560, 670, 800, 56, 26),
    sheet: R(150, 420, 520, 100, 28), lim: R(700, 420, 520, 100, 28), unans: R(1250, 420, 520, 100, 28),
    exC: R(560, 330, 800, 90, 28), fav: [R(150, 520, 760, 100, 26), R(1010, 520, 760, 100, 26)], keep: R(560, 680, 800, 56, 26),
    qsH: R(150, 330, 1620, 44, 26), qs: R(150, 386, 1620, 200, 30), ph: C3.map((x) => R(x, 620, 520, 76, 26)),
    cF: R(560, 300, 800, 410), cH: R(600, 316, 560, 50, 24), cRow: [386, 456, 526, 596].map((y) => R(600, y, 720, 56, 26)), fmt: R(560, 730, 800, 56, 26),
    dF: R(150, 330, 1620, 300), dH: R(190, 346, 560, 50, 24), dNext: R(190, 430, 1540, 90, 30)
  };

  function setup(E, ctx) {
    const K = global.L08Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('blank', G.blank, 'note', '', 'token.note'); tok('qs', G.qs, 'note', '', 'token.note'); tok('cF', G.cF, 'ctx frame', '', 'token.default'); tok('dF', G.dF, 'ctx frame', '', 'token.default'); // containers first
    ['x.c.maya', 'x.c.noah', 'x.c.part'].forEach((k, i) => tok('c' + i, G.three[i], 'proposal', L(k), 'token.step'));
    ['map.proposal', 'map.reason', 'map.constraint', 'map.open'].forEach((k, i) => tok('mh' + i, G.mapH[i], i === 3 ? 'colhead dashed' : 'colhead', L(k), 'token.colhead'));
    tok('prompt', G.prompt, 'example', L('prompt.exact'), 'token.quoteLong');
    tok('gD', G.gD, 'goal', L('goal.discuss'), 'token.step'); tok('gC', G.gC, 'goal', L('goal.club'), 'token.step');
    tok('tTot', G.tTot, 'colhead', L('time.total'), 'token.colhead'); tok('rest', G.rest, 'step', L('x.rest'), 'token.step'); tok('qSeg', G.qSeg, 'chipcard mark', L('time.questions'), 'token.chip');
    tok('status', G.status, 'framehead', L('source.status'), 'token.frame');
    tok('sM', G.src[0], 'excerpt', L('source.maya'), 'token.step', { tag: 'x.by.maya' }); tok('sN', G.src[1], 'excerpt', L('source.noah'), 'token.step', { tag: 'x.by.noah' });
    tok('sP', G.src[2], 'excerpt', L('source.participant'), 'token.step', { tag: 'x.by.part' });
    tok('nM', G.note[0], 'step', L('note.pairs'), 'token.step'); tok('nN', G.note[1], 'step', L('x.note.demo'), 'token.step'); tok('nP', G.note[2], 'step', L('x.note.q'), 'token.step');
    tok('mM', G.mM, 'proposal', L('map.maya'), 'token.step', { tag: 'x.by.maya' }); tok('rs', G.rs, 'step gap', L('reason.status'), 'token.step');
    tok('link', G.link, 'proposal', L('link.example'), 'token.step', { tag: 'link.status' });
    tok('only', G.sNote, 'step gap', L('x.sheetOnly'), 'token.step');
    tok('fH', G.fH, 'colhead', L('x.rail.fixed'), 'token.colhead'); tok('req', G.req, 'fact', L('constraint.required'), 'token.step');
    tok('pH', G.pH, 'colhead dashed', L('x.rail.prop'), 'token.colhead'); ['x.st.ex', 'x.st.pairs', 'x.st.share'].forEach((k, i) => tok('st' + i, G.st[i], 'proposal', L(k), 'token.step'));
    tok('seqO', G.seqO, 'chipcard margin', L('sequence.open'), 'token.chip');
    tok('sheet', G.sheet, 'fact', L('resource.sheet'), 'token.step'); tok('lim', G.lim, 'step gap', L('resource.limit'), 'token.step'); tok('unans', G.unans, 'question', L('x.unans'), 'token.question');
    tok('fav0', G.fav[0], 'step', L('x.fav.maya'), 'token.step'); tok('fav1', G.fav[1], 'step', L('x.fav.noah'), 'token.step');
    tok('qsH', G.qsH, 'colhead dashed', L('x.qspace'), 'token.colhead'); ['x.ph.timing', 'x.ph.leader', 'x.ph.support'].forEach((k, i) => tok('ph' + i, G.ph[i], 'step gap', L(k), 'token.step'));
    tok('cH', G.cH, 'framehead', L('map.check'), 'token.frame'); ['map.proposal', 'map.reason', 'map.constraint', 'map.open'].forEach((k, i) => tok('cr' + i, G.cRow[i], 'step', L(k), 'token.step'));
    tok('fmt', G.fmt, 'chipcard margin', L('format.optional'), 'token.chip'); tok('keep', G.keep, 'chipcard margin', L('map.keep'), 'token.chip');
    tok('dH', G.dH, 'framehead', L('plan.status'), 'token.frame'); tok('dNext', G.dNext, 'question', L('next.check'), 'token.question');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('bar'); E.dashed(l, 'bar.a', 'M 150 700 L 150 690 L 1770 690 L 1770 700', '#9DB6E0');
    l = ly('rq'); Rx.dline(E, l, 'rq.a', 'M 918 480 L 1002 480', '#B9C5D6'); Rx.qmark(E, l, 'rq.q', 960, 452);
    l = ly('ln'); Rx.dline(E, l, 'ln.a', 'M 1066 445 L 858 445', '#9DB6E0'); Rx.qmark(E, l, 'ln.q', 960, 418);
    l = ly('fav'); Rx.dline(E, l, 'fav.a', 'M 530 516 C 530 470, 860 470, 860 426', '#9DB6E0'); Rx.head(E, l, 'fav.ha', 860, 422, 'up', '#9DB6E0');
    Rx.dline(E, l, 'fav.b', 'M 1390 516 C 1390 470, 1060 470, 1060 426', '#9DB6E0'); Rx.head(E, l, 'fav.hb', 1060, 422, 'up', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L08.S01.B0' + n, M = X.MOTION;
    const SRC = ['sM', 'sN', 'sP'], NOTE = ['nM', 'nN', 'nP'];
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: three attributed cards move into a four-part board ----
    S.head(X0('c001') + 0.1, B(1), null); ['c0', 'c1', 'c2'].forEach((id, i) => S.rise(id, at('s1_several') + 0.4 + i * 0.2, G.three[i]));
    ['mh0', 'mh1', 'mh2', 'mh3'].forEach((id, i) => S.rise(id, at('s1_first') + i * 0.15, G.mapH[i]));
    ['c0', 'c1', 'c2'].forEach((id, i) => S.to(id, a('c001') + 0.3 + i * 0.15, G.inProp[i]));
    // ---- c002: the exact prompt; two aims; the 30-minute bar with at least 5 inside it ----
    let t = X0('c002'); X.clearAll(t);
    S.rise('prompt', at('s1_group'), G.prompt); S.rise('gD', at('s1_newcomers'), G.gD); S.rise('gC', at('s1_newcomers') + 0.4, G.gC);
    S.rise('tTot', at('s1_atleast') - 0.6, G.tTot); S.addLayer('bar', at('s1_atleast') - 0.4); S.rise('rest', at('s1_atleast') - 0.3, G.rest); S.rise('qSeg', at('s1_atleast'), G.qSeg);
    S.pulseOn(['qSeg'], a('c002'), 1.2);
    // ---- c003: three attributed source cards beside shorter notes ----
    t = X0('c003'); X.clearAll(t); S.dropLayer('bar', t);
    S.rise('status', at('s1_three'), G.status); SRC.forEach((id, i) => S.rise(id, at('s1_three') + 0.4 + i * 0.3, G.src[i]));
    NOTE.forEach((id, i) => S.rise(id, a('c003') + i * 0.3, G.note[i])); S.pulseOn(['sM', 'nM'], at('s1_label'), 1.4);
    // ---- B02 · d001 · Maya's proposal over her own card ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t); S.rise('sM', t + 0.3, G.sSrc);
    X.line('d001', 'propose:learner', ['compare one line'], { headFirst: true });
    // ---- c004: an offered action vs a possible reason (not a quote) ----
    t = X0('c004'); X.roomOut(t); S.head(t + 0.1, B(2), null); S.to('sM', t + 0.2, G.srcTop);
    S.rise('mM', at('s1_that'), G.mM); S.addLayer('rq', at('s1_ask') + 0.3); S.rise('rs', at('s1_ask') + 0.6, G.rs);
    // ---- d002 · Noah's proposal; no agreement gestures ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t); S.dropLayer('rq', t); S.rise('sN', t + 0.3, G.sSrc);
    X.line('d002', 'propose:learner', ['an interpretation and a reason'], { headFirst: true });
    // ---- c005: the example moves towards the pairs card with a dotted, possible link ----
    t = X0('c005'); X.roomOut(t); S.head(t + 0.1, B(2), null); S.hide(['sN'], t);
    S.rise('nM', t + 0.3, G.pairs, { tag: 'x.by.maya' }); S.rise('nN', at('s1_noah'), G.ex, { tag: 'x.by.noah' }); S.addLayer('ln', at('s1_purpose') + 0.3); S.rise('link', a('c005') - 0.2, G.link);
    // ---- d003 · the participant's proposal, with the sheet limit visible ----
    t = X0('d003'); S.head(t, null, null); X.clearAll(t); S.dropLayer('ln', t); S.rise('sP', t + 0.3, G.sSrc);
    X.line('d003', 'propose:maya', ['anything it actually answers'], { headFirst: true }); S.rise('only', a('d003') + 0.3, G.sNote);
    // ---- h101: three attributed source cards beside a blank private area ----
    const H1 = X.cue('h101'); X.roomOut(H1.start); X.clearAll(H1.start); SRC.forEach((id, i) => S.rise(id, H1.start + 0.3 + i * 0.12, G.hSrc[i])); S.rise('blank', H1.start + 0.6, G.blank, { text: '' });
    X.hold('h101');
    // ---- B03 · c006: a fixed constraint rail and a proposed-sequence rail ----
    t = X0('c006'); S.head(t, B(3), null); X.clearAll(t);
    S.rise('fH', at('s1_req') - 0.3, G.fH); S.rise('req', at('s1_req'), G.req); S.rise('qSeg', at('s1_req') + 0.4, G.tq);
    S.rise('pH', at('s1_contrast'), G.pH); ['st0', 'st1', 'st2'].forEach((id, i) => S.rise(id, at('s1_contrast') + 0.4 + i * 0.25, G.st[i])); S.rise('seqO', at('s1_rows'), G.seqO);
    // ---- c007: the sheet as an existing resource with unknown coverage; an open question ----
    t = X0('c007'); X.clearAll(t);
    S.rise('sheet', at('s1_sheet'), G.sheet); S.rise('lim', at('s1_full'), G.lim); S.rise('unans', at('s1_note'), G.unans);
    // ---- c008: two people favour the same element for different reasons; keep both qualifiers ----
    t = X0('c008'); X.clearAll(t);
    S.rise('nN', at('s1_remove'), G.exC, { tag: '' }); S.rise('fav0', at('s1_two'), G.fav[0]); S.rise('fav1', at('s1_two') + 0.4, G.fav[1]); S.addLayer('fav', at('s1_two') + 0.8);
    S.rise('keep', a('c008') - 0.2, G.keep);
    // ---- h102: a blank question space beside open placeholders ----
    const H2 = X.cue('h102'); X.clearAll(H2.start); S.dropLayer('fav', H2.start);
    S.rise('qsH', H2.start + 0.3, G.qsH); S.rise('qs', H2.start + 0.4, G.qs, { text: '' }); ['ph0', 'ph1', 'ph2'].forEach((id, i) => S.rise(id, H2.start + 0.6 + i * 0.1, G.ph[i]));
    X.hold('h102');
    // ---- B04 · c009: a compact inspection card; the four categories are optional aids ----
    t = X0('c009'); S.head(t, B(4), null); X.clearAll(t);
    S.rise('cF', at('s1_before'), G.cF); S.rise('cH', at('s1_before') + 0.2, G.cH); ['cr0', 'cr1', 'cr2', 'cr3'].forEach((id, i) => S.rise(id, at('s1_have') + i * 0.5, G.cRow[i]));
    S.rise('fmt', a('c009') - 0.3, G.fmt);
    // ---- c010: an editable draft summary, ready to check (not an agreed plan) ----
    t = X0('c010'); X.clearAll(t);
    S.rise('dF', at('s1_ask2'), G.dF); S.rise('dH', at('s1_ask2') + 0.2, G.dH); S.rise('dNext', at('s1_ask2') + 0.6, G.dNext);
  }
  global.L08Scenes = { setup };
})(window);
