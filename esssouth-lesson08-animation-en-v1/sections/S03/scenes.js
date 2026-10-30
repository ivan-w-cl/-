/*
 * L08.S03 · Combine Compatible Contributions. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Baseline snapshot. Stages are proposal cards linked by dotted connectors (a candidate, never a schedule). The 30-minute
 * outline keeps "at least 5" for questions inside it and "at most 25, including transitions" for the rest. The example
 * leader stays an open tag. Gate L08.I02: Maya's branch reply stays inside its branch; the A-branch sum is arithmetic on
 * the supplied numbers only; every path rejoins c010 on the source goals and open checks.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C3 = [150, 700, 1250];
  const G = {
    loose: [R(150, 340, 480, 76, 28), R(720, 380, 480, 76, 28), R(1290, 330, 480, 76, 28)], chain: C3.map((x) => R(x, 470, 520, 84, 28)),
    aT: R(150, 330, 760, 66, 26), aC: R(1010, 330, 760, 66, 26), noClub: R(1010, 600, 760, 76, 26),
    res: R(150, 420, 760, 100, 28), resL: R(1010, 420, 760, 66, 26), unsup: R(560, 580, 800, 90, 26),
    hA: R(150, 380, 760, 84, 28), hB: R(1010, 380, 760, 84, 28), hLine: R(150, 528, 1620, 180, 30),
    tW: R(150, 420, 500, 44, 26), rest: R(150, 476, 1170, 70, 26), qMin: R(1330, 476, 440, 70, 26),
    exD: R(560, 420, 800, 90, 28), depS: R(560, 580, 800, 56, 26),
    cand: R(150, 330, 620, 50, 24), cChecks: R(560, 640, 800, 66, 26),
    over: [R(150, 420, 520, 84, 28), R(690, 420, 520, 84, 28), R(1230, 420, 520, 84, 28)], clash: R(150, 600, 760, 90, 26), rev: R(1010, 600, 760, 90, 26),
    crit: R(150, 290, 760, 50, 24), gT: R(150, 356, 520, 60, 26), gC: R(700, 356, 520, 60, 26), tg: [R(1250, 300, 520, 50, 26), R(1250, 360, 520, 50, 26)],
    opts: [R(150, 440, 1620, 110, 28), R(150, 560, 1620, 110, 28), R(150, 680, 1620, 110, 28)],
    sT: R(1140, 150, 690, 60, 26), sC: R(1140, 220, 690, 60, 26), sHead: R(1140, 296, 690, 56, 26),
    fT: R(150, 300, 760, 66, 26), fC: R(1010, 300, 760, 66, 26), resp: R(150, 400, 1620, 110, 28), fNote: R(560, 560, 800, 84, 28), fTags: [R(150, 680, 760, 56, 26), R(1010, 680, 760, 56, 26)],
    rv: C3.map((x) => R(x, 440, 520, 100, 28)),
    n1: R(150, 420, 760, 300, 30), n2: R(1010, 420, 760, 300, 30),
    illus: R(150, 330, 760, 50, 24), seg: [R(150, 440, 520, 84, 28), R(700, 440, 520, 84, 28), R(1250, 440, 520, 84, 28)],
    seg2: [R(150, 440, 760, 84, 28), R(940, 440, 400, 84, 28), R(1370, 440, 400, 84, 28)],
    kC: R(150, 360, 1620, 84, 28), kR: R(150, 480, 760, 100, 28), kCost: R(1010, 480, 760, 100, 28)
  };

  function setup(E, ctx) {
    const K = global.L08Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('hLine', G.hLine, 'note', '', 'token.note'); tok('n1', G.n1, 'note', '', 'token.note'); tok('n2', G.n2, 'note', '', 'token.note'); // containers first
    ['x.st.ex', 'x.st.pairs', 'x.st.share'].forEach((k, i) => tok('st' + i, G.loose[i], 'proposal', L(k), 'token.step'));
    tok('aT', G.aT, 'goal', L('aim.text'), 'token.step'); tok('aC', G.aC, 'goal', L('aim.club'), 'token.step'); tok('noClub', G.noClub, 'step gap', L('x.noClub'), 'token.step');
    tok('res', G.res, 'fact', L('resources.available'), 'token.step'); tok('resL', G.resL, 'chipcard margin', L('resources.limit'), 'token.chip'); tok('unsup', G.unsup, 'step gap', L('x.unsup'), 'token.step');
    tok('hLab', R(150, 480, 1620, 40, 22), 'hint', L('x.reasonLine'), 'token.hint');
    tok('tW', G.tW, 'colhead', L('time.whole'), 'token.colhead'); tok('rest', G.rest, 'step', L('time.remaining'), 'token.step'); tok('qMin', G.qMin, 'chipcard mark', L('time.minimum'), 'token.chip');
    tok('depS', G.depS, 'chipcard margin', L('dependency.status'), 'token.chip');
    tok('cand', G.cand, 'framehead', L('candidate.status'), 'token.frame'); tok('cChecks', G.cChecks, 'step gap', L('candidate.checks'), 'token.step');
    tok('clash', G.clash, 'step gap', L('clash.source'), 'token.step'); tok('rev', G.rev, 'chipcard margin', L('revision.options'), 'token.chip');
    tok('crit', G.crit, 'framehead', L('choice.criteria'), 'token.frame');
    tok('tg0', G.tg[0], 'step gap', L('x.tag.timing'), 'token.step'); tok('tg1', G.tg[1], 'step gap', L('x.tag.leader'), 'token.step');
    tok('sHead', G.sHead, 'framehead', L('candidate.C.status'), 'token.frame'); tok('resp', G.resp, 'example', '', 'token.summary'); tok('fNote', G.fNote, 'step changed', '', 'token.step');
    ['review.connection', 'review.constraint', 'review.open'].forEach((k, i) => tok('rv' + i, G.rv[i], i === 2 ? 'step gap' : 'idea', L(k), 'token.step'));
    tok('illus', G.illus, 'framehead', L('x.illus'), 'token.frame');
    tok('kR', G.kR, 'proposal', L('x.reason'), 'token.step'); tok('kCost', G.kCost, 'step gap', L('x.cost'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('chain'); [670, 1220].forEach((x, i) => { Rx.dline(E, l, 'ch.' + i, `M ${x + 4} 512 L ${x + 22} 512`, '#9DB6E0'); Rx.head(E, l, 'ch.h' + i, x + 28, 512, 'right', '#9DB6E0'); });
    l = ly('bar'); E.dashed(l, 'bar.a', 'M 150 470 L 150 462 L 1770 462 L 1770 470', '#9DB6E0');
    l = ly('bound'); E.dashed(l, 'bound.a', 'M 1500 400 L 1500 530', '#B0563F');
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L08.S03.B0' + n, M = X.MOTION, markup = global.EsssouthStyleEngine.markup;
    const ST = ['st0', 'st1', 'st2'];
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: three unrelated cards become a dotted candidate chain ----
    S.head(X0('c001') + 0.1, B(1), null); ST.forEach((id, i) => S.rise(id, at('s3_comb') + 0.5 + i * 0.2, G.loose[i]));
    ST.forEach((id, i) => S.to(id, at('s3_look') + 0.3 + i * 0.15, G.chain[i])); S.addLayer('chain', at('s3_ex')); S.title(a('c001') - 0.2, 'combine.focus');
    // ---- c002: two goal rails above the chain; an empty link stays empty ----
    let t = X0('c002'); S.title(t, null);
    S.rise('aT', at('s3_aims'), G.aT); S.rise('aC', at('s3_aims') + 0.3, G.aC); S.rise('noClub', at('s3_neat'), G.noClub);
    // ---- c003: the supplied resource bank; unsupplied extras only as "not supplied" ----
    t = X0('c003'); X.clearAll(t); S.dropLayer('chain', t);
    S.rise('res', at('s3_group'), G.res); S.rise('resL', at('s3_group') + 0.5, G.resL); S.rise('unsup', at('s3_dont'), G.unsup);
    // ---- h101: two cards with a blank reason line beneath ----
    const H1 = X.cue('h101'); X.clearAll(H1.start);
    S.rise('st0', H1.start + 0.3, G.hA); S.rise('st1', H1.start + 0.4, G.hB); S.rise('hLine', H1.start + 0.6, G.hLine, { text: '' }); S.rise('hLab', H1.start + 0.7, R(150, 480, 1620, 40, 22));
    X.hold('h101');
    // ---- B02 · c004: one 30-minute outline: questions at least 5 inside; the rest at most 25 ----
    t = X0('c004'); S.head(t, B(2), null); X.clearAll(t);
    S.rise('tW', at('s3_thirty'), G.tW); S.addLayer('bar', at('s3_thirty') + 0.3); S.rise('qMin', at('s3_five'), G.qMin); S.rise('rest', at('s3_leaves'), G.rest); S.pulseOn(['rest'], at('s3_limit'), 1.2);
    // ---- c005: "Who would give the example?" stays attached to the example stage ----
    t = X0('c005'); X.clearAll(t); S.dropLayer('bar', t);
    S.rise('st0', at('s3_someone'), G.exD, { tag: 'example.dependency' }); S.rise('depS', at('s3_notEst'), G.depS);
    // ---- c006: a candidate to develop, with open timing/person checks ----
    t = X0('c006'); X.clearAll(t);
    S.rise('cand', at('s3_propose'), G.cand); ST.forEach((id, i) => S.rise(id, at('s3_propose') + 0.3 + i * 0.15, G.chain[i], { tag: i === 0 ? 'example.dependency' : '' }));
    S.addLayer('chain', at('s3_propose') + 0.8); S.rise('cChecks', at('s3_diff'), G.cChecks);
    // ---- c007: cards clash at a time-boundary rail; optional revisions ----
    t = X0('c007'); X.clearAll(t); S.dropLayer('chain', t);
    ST.forEach((id, i) => S.rise(id, at('s3_compete') + i * 0.2, G.over[i], { tag: '' })); S.addLayer('bound', at('s3_compete') + 0.8);
    S.rise('clash', at('s3_explain'), G.clash); S.rise('rev', at('s3_elem'), G.rev);
    // ---- c008 + c009 + gate: one criterion header; aims and open tags beside every candidate ----
    t = X0('c008'); X.clearAll(t); S.dropLayer('bound', t);
    S.rise('crit', at('s3_compare') + 0.5, G.crit); S.rise('aT', a('c008'), G.gT); S.rise('aC', a('c008') + 0.2, G.gC);
    S.rise('tg0', at('s3_lookC'), G.tg[0]); S.rise('tg1', at('s3_lookC') + 0.2, G.tg[1]);
    X.gate({ optRects: G.opts });
    const branch = (k, d1, d2, f, hl1, hl2) => {
      if (!X.has(d1)) return null; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'crit', 'tg0', 'tg1'], t0); S.head(t0, null, null); S.title(t0, null);
      S.to('aT', t0 + 0.1, G.sT); S.to('aC', t0 + 0.15, G.sC);
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L('candidate.' + k + '.status') }); // labelled before the line begins
      X.line(d1, 'propose:maya', hl1, { headFirst: true }); X.line(d2, 'explain:learner', hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead'], tf); S.head(tf + 0.1, B(2), null); S.to('aT', tf + 0.15, G.fT); S.to('aC', tf + 0.2, G.fC);
      S.rise('resp', tf + 0.4, G.resp, { text: L('gate.option.' + k) }); S.title(a(f) - 0.2, 'candidate.' + k + '.review');
      return tf;
    };
    let tf = branch('A', 'd101', 'd102', 'f101', ['add five minutes'], ['thirty']);
    if (tf != null) S.rise('fNote', at('sA_ten'), G.fNote, { text: L('x.sum') });
    tf = branch('B', 'd201', 'd202', 'f201', ['whole thirty minutes'], ['pair discussion']);
    if (tf != null) { S.rise('fNote', tf + 0.8, G.fNote, { text: L('x.noPairs'), kind: 'step gap' }); S.pulseOn(['aT'], a('f201') - 0.5, 1.2); }
    tf = branch('C', 'd301', 'd302', 'f301', ['check the timing'], ['support that connection']);
    if (tf != null) { S.rise('fNote', at('sC_maya'), G.fNote, { text: L('x.condMaya'), kind: 'step' }); S.rise('tg0', at('sC_dur'), G.fTags[0]); S.rise('tg1', at('sC_dur') + 0.2, G.fTags[1]); }
    // ---- B03 · c010: every path rejoins on the source goals and open checks only ----
    t = X0('c010'); X.roomOut(t); S.hide(['resp', 'fNote'], t, 0.01); X.clearAll(t, ['resp', 'fNote']); S.head(t, B(3), null); S.title(t, null);
    S.rise('aT', at('s3_whatever'), G.aT); S.rise('aC', at('s3_whatever') + 0.2, G.aC);
    S.rise('rv0', at('s3_parts'), G.rv[0]); S.rise('rv1', at('s3_whole'), G.rv[1]); S.rise('rv2', at('s3_unres'), G.rv[2]);
    // ---- h102: two blank private notes beside the task aims ----
    const H2 = X.cue('h102'); S.hide(['rv0', 'rv1', 'rv2'], H2.start); S.rise('n1', H2.start + 0.4, G.n1, { text: '' }); S.rise('n2', H2.start + 0.5, G.n2, { text: '' });
    X.hold('h102');
    // ---- B04 · c011: one stage grows inside a fixed total; the others contract (illustrative) ----
    t = X0('c011'); S.head(t, B(4), null); X.clearAll(t);
    S.rise('illus', at('s3_work'), G.illus); ST.forEach((id, i) => S.rise(id, at('s3_work') + 0.3 + i * 0.15, G.seg[i], { tag: '' }));
    ST.forEach((id, i) => S.to(id, at('s3_grows') + 0.3, G.seg2[i], {}, M.layout)); S.title(a('c011') - 0.2, 'tradeoff.visible');
    // ---- c012: a candidate with provisional reason and cost cards ----
    t = X0('c012'); S.title(t, null); X.clearAll(t);
    S.rise('cand', at('s3_next'), G.cand); S.rise('kR', at('s3_next') + 0.6, G.kR); S.rise('kCost', at('s3_gives'), G.kCost); S.title(a('c012') + 0.6, 'next.tradeoff');
  }
  global.L08Scenes = { setup };
})(window);
