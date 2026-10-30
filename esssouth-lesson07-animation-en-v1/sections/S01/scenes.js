/*
 * L07.S01 · Notice What the Discussion Needs. Section adapter (tokens, rects, timing by cue starts and anchors).
 * "Practice example" comes before any case material. The exact source prompt is read offstage (no avatar) as a card; Maya
 * offers only F04, kept as an unadopted proposal. The drawing-group link stays visibly open: a question points at it but
 * never supplies the programme. Possible reasons for a pause sit outside the known area; private areas stay blank.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C3 = [150, 700, 1250];
  const G = {
    exH: R(150, 380, 620, 50, 24), ex: C3.map((x) => R(x, 470, 520, 120, 30)),
    caseB: R(150, 300, 620, 50, 24), state: R(150, 380, 1620, 76, 28), plan: R(150, 490, 790, 90, 28), selH: R(1010, 490, 760, 44, 26), sel: R(1010, 544, 760, 170, 30),
    promptH: R(150, 380, 620, 50, 24), prompt: R(150, 450, 1620, 280, 32),
    sHead: R(1140, 150, 690, 50, 24), sFresh: R(1140, 214, 690, 50, 22), sProp: R(1140, 278, 690, 110, 28),
    caseT: R(150, 290, 620, 46, 22), prop: R(150, 350, 1620, 84, 28), aimM: R(150, 486, 760, 76, 26), aimF: R(1010, 486, 760, 76, 26),
    poss: R(150, 650, 760, 90, 28), open: R(1010, 650, 760, 90, 28), rep: R(560, 760, 800, 66, 26),
    propL: R(150, 350, 800, 100, 28), aimML: R(150, 500, 800, 76, 26), aimFL: R(150, 596, 800, 76, 26), blank: R(1060, 350, 710, 420, 30),
    pauseC: R(560, 300, 800, 70, 28), knownH: R(150, 410, 760, 44, 26), known: R(150, 466, 760, 110, 28), possH: R(1010, 410, 760, 44, 26),
    p: [0, 1, 2, 3].map((i) => R(1010, 466 + i * 82, 760, 70, 26)), pb: R(150, 640, 760, 100, 28),
    xf: R(150, 300, 1620, 400), xfH: R(190, 316, 620, 50, 24), laneA: R(190, 410, 190, 44, 26), laneB: R(190, 520, 190, 44, 26),
    barA: R(400, 400, 600, 64, 26), barB: R(760, 510, 600, 64, 26), ovl: R(760, 610, 240, 44, 22), tb: R(560, 730, 800, 84, 28),
    o1: R(150, 400, 760, 100, 30), o2: R(1010, 400, 760, 100, 30), r1: R(150, 560, 760, 84, 26), r2: R(1010, 560, 760, 84, 26),
    openC: R(560, 480, 800, 100, 28), pu: [R(150, 330, 760, 76, 26), R(1010, 330, 760, 76, 26), R(150, 646, 760, 76, 26), R(1010, 646, 760, 76, 26)], res: R(560, 756, 800, 66, 26),
    rq: R(150, 400, 760, 100, 28), openR: R(1010, 400, 760, 100, 28), lim: R(150, 560, 760, 90, 26), prog: R(1010, 560, 760, 90, 26),
    propP: R(150, 400, 760, 100, 28), openP: R(150, 546, 760, 100, 28), blankP: R(1010, 400, 760, 380, 30),
    possE: R(150, 586, 760, 90, 28), openE: R(1010, 586, 760, 90, 28), next: R(560, 712, 800, 90, 30)
  };

  function setup(E, ctx) {
    const K = global.L07Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('sel', G.sel, 'note', '', 'token.note'); tok('blank', G.blank, 'note', '', 'token.note'); tok('xf', G.xf, 'ctx frame', '', 'token.default'); // containers first
    tok('exH', G.exH, 'framehead', L('x.examples'), 'token.frame');
    ['x.ex.pause', 'x.ex.link', 'x.ex.lanes'].forEach((k, i) => tok('ex' + i, G.ex[i], 'step', L(k), 'token.step', { tag: 'x.example' }));
    tok('caseL', G.caseB, 'framehead', L('case.label'), 'token.frame'); tok('state', G.state, 'fact', L('case.state'), 'token.step');
    tok('plan', G.plan, 'fact', L('x.plan'), 'token.step'); tok('selH', G.selH, 'colhead', L('x.selected'), 'token.colhead');
    tok('promptH', G.promptH, 'framehead', L('x.prompt'), 'token.frame');
    tok('prompt', G.prompt, 'example', markup(E.cueText('L07.S01.d001'), ['explain how it serves both aims']), 'token.quoteLong');
    tok('fresh', G.sFresh, 'framehead', L('x.fresh'), 'token.frame');
    tok('prop', G.sProp, 'proposal', L('proposal.maya'), 'token.step', { tag: 'x.unadopted' });
    tok('aimM', G.aimM, 'goal', L('x.aim.meet'), 'token.step'); tok('aimF', G.aimF, 'goal', L('x.aim.find'), 'token.step');
    tok('poss', G.poss, 'proposal', L('proposal.possible'), 'token.step'); tok('open', G.open, 'question', L('task.open'), 'token.question');
    tok('rep', G.rep, 'idea', L('repair.target'), 'token.idea');
    tok('pauseC', G.pauseC, 'note unobserved', L('x.pauseCard'), 'token.note');
    tok('knownH', G.knownH, 'colhead', L('x.knownH'), 'token.colhead'); tok('possH', G.possH, 'colhead dashed', L('x.possH'), 'token.colhead');
    ['x.p1', 'x.p2', 'x.p3', 'x.p4'].forEach((k, i) => tok('p' + i, G.p[i], 'step gap', L(k), 'token.step'));
    tok('pb', G.pb, 'chipcard mark', L('pause.boundary'), 'token.chip');
    tok('xfH', G.xfH, 'framehead', L('x.excerpt'), 'token.frame');
    tok('laneA', G.laneA, 'colhead', L('x.laneA'), 'token.colhead'); tok('laneB', G.laneB, 'colhead', L('x.laneB'), 'token.colhead');
    tok('barA', G.barA, 'step', L('x.turn'), 'token.step'); tok('barB', G.barB, 'step', L('x.turn'), 'token.step'); tok('ovl', G.ovl, 'hint', L('x.overlap'), 'token.hint');
    tok('tb', G.tb, 'chipcard mark', L('traits.boundary'), 'token.chip');
    tok('o1', G.o1, 'step plan', L('x.opt.space'), 'token.step'); tok('o2', G.o2, 'step plan', L('x.opt.q'), 'token.step');
    tok('r1', G.r1, 'chipcard margin', L('timing.rule'), 'token.chip'); tok('r2', G.r2, 'chipcard margin', L('role.rule'), 'token.chip');
    ['x.pu.idea', 'x.pu.turn', 'x.pu.link', 'x.pu.view'].forEach((k, i) => tok('pu' + i, G.pu[i], 'step plan', L(k), 'token.step'));
    tok('res', G.res, 'chipcard margin', L('repair.resources'), 'token.chip');
    tok('rq', G.rq, 'question', L('repair.possible'), 'token.question'); tok('lim', G.lim, 'step gap', L('repair.limit'), 'token.step'); tok('prog', G.prog, 'step gap', L('x.prog'), 'token.step');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step', { tag: 'x.fresh' });
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('link'); Rx.dline(E, l, 'link.a', 'M 530 568 L 530 636', '#9DB6E0'); Rx.head(E, l, 'link.h', 530, 642, 'down', '#9DB6E0');
    l = ly('gap'); Rx.dline(E, l, 'gap.a', 'M 1390 568 L 1390 642', '#B9C5D6'); Rx.qmark(E, l, 'gap.q', 1430, 605);
    l = ly('ovl'); E.dashed(l, 'ovl.a', 'M 760 390 L 1000 390 L 1000 584 L 760 584 Z', '#9DB6E0');
    l = ly('ask'); Rx.dline(E, l, 'ask.a', 'M 918 450 L 996 450', '#9DB6E0'); Rx.head(E, l, 'ask.h', 1002, 450, 'right', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L07.S01.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: three separate schematic examples (not one simultaneous event) ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('exH', at('s1_pause') - 0.4, G.exH);
    S.rise('ex0', at('s1_pause'), G.ex[0]); S.rise('ex1', at('s1_unf'), G.ex[1]); S.rise('ex2', at('s1_two'), G.ex[2]); S.title(a('c001') - 0.2, 'observation.focus');
    // ---- c002: Practice example first; a plan condition, not a countdown; the selected activity empty ----
    let t = X0('c002'); X.clearAll(t); S.title(t, null);
    S.rise('caseL', at('s1_use'), G.caseB); S.rise('plan', at('s1_limit'), G.plan); S.rise('selH', at('s1_limit') + 0.4, G.selH); S.rise('sel', at('s1_limit') + 0.6, G.sel);
    S.rise('state', at('s1_none'), G.state);
    // ---- d001 · the exact source prompt, read offstage: a card, no avatar ----
    t = X0('d001'); S.hide(['state', 'plan', 'selH', 'sel'], t);
    S.rise('promptH', t + 0.2, G.promptH); S.rise('prompt', t + 0.4, G.prompt); S.put('prompt', a('d001'), M.focus, { hl: 1 });
    // ---- d002 · a fresh excerpt: Maya offers only F04 ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t, ['caseL']); S.to('caseL', t + 0.1, G.sHead); S.rise('fresh', t + 0.3, G.sFresh);
    X.line('d002', 'propose:learner', ['exchange names and interests'], { headFirst: true }); S.rise('prop', a('d002') + 0.3, G.sProp);
    // ---- B02 · c003: a possible way to meet; the drawing-group link stays open ----
    t = X0('c003'); X.roomOut(t); S.head(t + 0.1, B(2), null); S.hide(['fresh'], t); S.to('caseL', t + 0.1, G.caseT); S.to('prop', t + 0.2, G.prop);
    S.rise('aimM', at('s1_could') - 0.3, G.aimM); S.rise('aimF', at('s1_could'), G.aimF);
    S.addLayer('link', at('s1_could') + 0.8); S.rise('poss', at('s1_could') + 1.1, G.poss);
    S.addLayer('gap', at('s1_notYet') + 0.5); S.rise('open', a('c003') - 0.3, G.open);
    // ---- c004: develop the missing connection; the proposal stays intact ----
    t = X0('c004'); S.pulseOn(['open'], at('s1_develop') + 0.5, 1.2); S.rise('rep', at('s1_explore'), G.rep);
    // ---- c005 + h101: the proposal and both aims beside a blank private note ----
    t = X0('c005'); S.hide(['poss', 'open', 'rep', 'caseL'], t); S.dropLayer('link', t); S.dropLayer('gap', t);
    S.to('prop', t + 0.2, G.propL); S.to('aimM', t + 0.3, G.aimML); S.to('aimF', t + 0.4, G.aimFL); S.rise('blank', at('s1_priv') + 0.4, G.blank, { text: '' });
    S.title(at('s1_what') - 0.2, 'reflection.prompt');
    X.hold('h101');
    // ---- B03 · c006: a pause; possibilities outside the known area ----
    t = X0('c006'); S.head(t, B(3), null); S.title(t, null); X.clearAll(t);
    S.rise('pauseC', t + 0.3, G.pauseC); S.rise('knownH', t + 0.6, G.knownH); S.rise('prop', t + 0.8, G.known);
    S.rise('possH', at('s1_agree') - 0.3, G.possH); [0, 1, 2, 3].forEach((i) => S.rise('p' + i, at('s1_agree') + i * 0.5, G.p[i]));
    S.pulseOn(['possH'], at('s1_poss'), 1.0); S.rise('pb', a('c006'), G.pb);
    // ---- c007: two timing lanes in one bounded excerpt; no intent shown ----
    t = X0('c007'); X.clearAll(t);
    S.rise('xf', at('s1_same') - 0.4, G.xf); S.rise('xfH', at('s1_same') - 0.2, G.xfH); S.rise('laneA', at('s1_same'), G.laneA); S.rise('laneB', at('s1_same') + 0.15, G.laneB);
    S.rise('barA', at('s1_same') + 0.4, G.barA); S.rise('barB', at('s1_same') + 0.7, G.barB); S.addLayer('ovl', at('s1_same') + 1.1); S.rise('ovl', at('s1_same') + 1.3, G.ovl);
    S.rise('tb', a('c007'), G.tb);
    // ---- c008: waiting and a focused question are options; no threshold, no leader ----
    t = X0('c008'); X.clearAll(t); S.dropLayer('ovl', t);
    S.rise('o1', at('s1_space'), G.o1); S.rise('o2', at('s1_focused'), G.o2); S.rise('r1', at('s1_noLen'), G.r1); S.rise('r2', at('s1_leader'), G.r2);
    // ---- B04 · c009: four unnumbered purposes around the open link ----
    t = X0('c009'); S.head(t, B(4), null); X.clearAll(t);
    S.rise('open', at('s1_ask'), G.openC);
    S.rise('pu0', at('s1_understand'), G.pu[0]); S.rise('pu1', at('s1_finish'), G.pu[1]); S.rise('pu2', at('s1_connect'), G.pu[2]); S.rise('pu3', at('s1_hear'), G.pu[3]);
    S.rise('res', a('c009'), G.res);
    // ---- c010: a question points at the link; it supplies no programme ----
    t = X0('c010'); S.hide(['pu0', 'pu1', 'pu2', 'pu3', 'res'], t); S.to('open', t + 0.2, G.openR);
    S.rise('rq', at('s1_how'), G.rq); S.addLayer('ask', at('s1_how') + 0.4); S.rise('lim', a('c010'), G.lim); S.rise('prog', a('c010') + 0.4, G.prog);
    // ---- c011 + h102: the same excerpt and a blank private next-move area ----
    t = X0('c011'); X.clearAll(t); S.dropLayer('ask', t);
    S.rise('prop', at('s1_choose'), G.propP); S.rise('open', at('s1_choose') + 0.2, G.openP); S.rise('blank', at('s1_choose') + 0.5, G.blankP, { text: '' });
    S.title(at('s1_choose') + 0.2, 'private.prompt');
    X.hold('h102');
    // ---- B05 · c012: settle the task-link board; the next section is a fresh excerpt ----
    t = X0('c012'); S.head(t, B(5), null); S.title(t, null); X.clearAll(t);
    S.rise('caseL', t + 0.3, G.caseT); S.rise('prop', t + 0.4, G.prop); S.rise('aimM', t + 0.5, G.aimM); S.rise('aimF', t + 0.6, G.aimF);
    S.rise('poss', t + 0.8, G.possE); S.rise('open', t + 0.9, G.openE); S.rise('next', at('s1_fresh'), G.next);
  }
  global.L07Scenes = { setup };
})(window);
