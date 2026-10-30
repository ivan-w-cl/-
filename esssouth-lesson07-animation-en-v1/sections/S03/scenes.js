/*
 * L07.S03 · Handle Overlapping Turns. Section adapter (tokens, rects, timing by cue starts and anchors).
 * The baseline is a labelled, silent two-lane illustration: the learner's fragment (d001) stays visibly unfinished when
 * Noah's opening fragment (d002) starts in the second lane; a small drawn overlap zone marks the shared moment. Only the
 * two fragments are ever on the baseline stage. Noah's complete F05 is revealed only in branch C (d302) and replaces his
 * fragment; nothing from a branch reaches the common rejoin (c010). The learner's complete point appears only in the
 * separately labelled worked example (c012/d003). No audio meter, microphone, intent or agreement is shown.
 * Shot/cue timing for later voice production: OVERLAP_TIMING_NOTE.md.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    caseB: R(150, 290, 620, 50, 24), aims: R(150, 370, 1620, 76, 28),
    frame: R(150, 300, 1620, 450), fHead: R(190, 316, 520, 50, 24), silent: R(730, 322, 1000, 40, 22),
    lhP: R(190, 400, 220, 44, 26), lhN: R(190, 540, 220, 44, 26), fragL: R(440, 390, 700, 84, 28), fragN: R(1000, 530, 500, 84, 28),
    zone: R(1000, 674, 240, 40, 22), bound: R(560, 680, 800, 56, 26), contL: R(1160, 390, 560, 84, 28), contN: R(1520, 530, 200, 84, 28),
    t1: R(150, 400, 760, 100, 30), t2: R(1010, 400, 760, 100, 30), tb: R(560, 560, 800, 66, 26),
    pL: R(150, 400, 760, 84, 28), pPark: R(150, 536, 760, 66, 26), pN: R(1010, 400, 760, 84, 28), pNc: R(1010, 520, 760, 150, 30),
    rL: R(150, 380, 760, 84, 28), rN: R(150, 524, 760, 84, 28), blank: R(1010, 380, 760, 400, 30),
    eCase: R(150, 290, 620, 46, 22), eL: R(150, 350, 790, 76, 26), eN: R(980, 350, 790, 76, 26), chNote: R(150, 440, 1620, 56, 26),
    opts: [R(150, 510, 1620, 92, 28), R(150, 612, 1620, 92, 28), R(150, 714, 1620, 92, 28)],
    sCase: R(1140, 150, 690, 50, 24), sL: R(1140, 214, 690, 76, 26), sN: R(1140, 300, 690, 76, 26), sHead: R(1140, 416, 690, 56, 26),
    sFull: R(1140, 486, 690, 130, 26), sPark: R(1140, 660, 690, 70, 26),
    fL: R(150, 380, 760, 84, 28), fN: R(1010, 380, 760, 84, 28), fNfull: R(1010, 380, 760, 130, 28), fTurn: R(560, 560, 800, 66, 26), fMerge: R(560, 560, 800, 84, 28),
    fPark: R(150, 516, 760, 70, 26),
    jL: R(150, 400, 760, 84, 28), jN: R(1010, 400, 760, 84, 28),
    st: [R(150, 420, 520, 90, 28), R(700, 420, 520, 90, 28), R(1250, 420, 520, 90, 28)], rr: R(560, 580, 800, 66, 26),
    sEx: R(1140, 150, 690, 50, 24), sPend: R(1140, 214, 690, 130, 26), sLim: R(1140, 392, 690, 90, 26),
    kPend: R(150, 400, 760, 130, 28), kLim: R(1010, 400, 760, 130, 28), kAims: R(150, 600, 1620, 76, 26), kEx: R(150, 320, 620, 50, 24),
    next: R(560, 680, 800, 96, 30)
  };

  function setup(E, ctx) {
    const K = global.L07Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('frame', G.frame, 'ctx frame', '', 'token.default'); tok('contL', G.contL, 'note', '', 'token.note'); tok('contN', G.contN, 'note', '', 'token.note');
    tok('pNc', G.pNc, 'note', '', 'token.note'); tok('blank', G.blank, 'note', '', 'token.note'); // containers first
    tok('caseL', G.caseB, 'framehead', L('case.label'), 'token.frame'); tok('aims', G.aims, 'goal', L('task.aims'), 'token.step');
    tok('fHead', G.fHead, 'framehead', L('overlap.label'), 'token.frame'); tok('silent', G.silent, 'hint', L('x.silent'), 'token.hint');
    tok('lhP', G.lhP, 'colhead', L('x.lane.p'), 'token.colhead'); tok('lhN', G.lhN, 'colhead', L('x.lane.n'), 'token.colhead');
    tok('fragL', G.fragL, 'excerpt', L('overlap.learner'), 'token.step', { tag: 'x.unfinished' });
    tok('fragN', G.fragN, 'excerpt', L('overlap.noah'), 'token.step', { tag: 'x.unfinished' });
    tok('zone', G.zone, 'hint', L('x.overlapZone'), 'token.hint'); tok('bound', G.bound, 'chipcard margin', L('overlap.boundary'), 'token.chip');
    tok('t1', G.t1, 'step plan', L('x.t.offer'), 'token.step'); tok('t2', G.t2, 'step plan', L('x.t.ask'), 'token.step'); tok('tb', G.tb, 'chipcard margin', L('turn.boundary'), 'token.chip');
    tok('park', G.pPark, 'chipcard', L('x.park'), 'token.chip');
    tok('chNote', G.chNote, 'chipcard margin', L('choice.note'), 'token.chip');
    tok('sHead', G.sHead, 'framehead', L('branch.c.label'), 'token.frame');
    tok('nFull', G.sFull, 'proposal', L('branch.c.noah'), 'token.step', { tag: 'x.unadopted' });
    tok('turn', G.fTurn, 'chipcard', L('x.turnNext'), 'token.chip'); tok('merge', G.fMerge, 'step changed', L('x.merge'), 'token.step');
    ['x.s.offer', 'x.s.listen', 'x.s.return'].forEach((k, i) => tok('st' + i, G.st[i], 'step plan', L(k), 'token.step'));
    tok('rr', G.rr, 'chipcard margin', L('return.rule'), 'token.chip');
    tok('ex', G.sEx, 'framehead', L('common.example'), 'token.frame');
    tok('pend', G.sPend, 'proposal', L('pending.full'), 'token.step', { tag: 'x.unadopted' }); tok('plim', G.sLim, 'step gap', L('pending.limit'), 'token.step');
    tok('tlim', G.kLim, 'question', L('task.limit'), 'token.question');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('zone'); E.dashed(l, 'zone.a', 'M 1000 370 L 1000 380 L 1140 380 L 1140 370', '#9DB6E0'); E.dashed(l, 'zone.b', 'M 1000 660 L 1000 668 L 1140 668 L 1140 660', '#9DB6E0'); // brackets only: no line crosses the words
    l = ly('cont'); E.dashed(l, 'cont.a', 'M 1144 432 L 1156 432', '#B9C5D6'); E.dashed(l, 'cont.b', 'M 1504 572 L 1516 572', '#B9C5D6');
    l = ly('steps'); [670, 1220].forEach((x, i) => { Rx.dline(E, l, 'st.' + i, `M ${x + 4} 465 L ${x + 22} 465`, '#9DB6E0'); Rx.head(E, l, 'st.h' + i, x + 28, 465, 'right', '#9DB6E0'); });
    l = ly('src'); Rx.dline(E, l, 'src.a', 'M 918 465 L 996 465', '#9DB6E0'); Rx.head(E, l, 'src.h', 1002, 465, 'right', '#9DB6E0'); Rx.qmark(E, l, 'src.q', 960, 438);
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L07.S03.B0' + n, M = X.MOTION;
    const lanesIn = (t) => { S.rise('frame', t, G.frame); S.rise('fHead', t + 0.2, G.fHead); S.rise('silent', t + 0.35, G.silent); S.rise('lhP', t + 0.5, G.lhP); S.rise('lhN', t + 0.6, G.lhN); };
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a fresh excerpt; the task; nothing adopted ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('caseL', a('c001'), G.caseB); S.rise('aims', at('s3_aims'), G.aims);
    // ---- c002: the labelled silent two-lane illustration (empty lanes first) ----
    let t = X0('c002'); S.hide(['aims'], t); S.hide(['caseL'], t + 0.1);
    lanesIn(at('s3_begins')); S.rise('bound', a('c002'), G.bound);
    // ---- d001 / d002 · the two fragments: the learner's stays unfinished when Noah's lane starts ----
    t = X0('d001'); S.hide(['bound'], t); S.rise('fragL', t + 0.05, G.fragL);
    t = X0('d002'); S.addLayer('zone', t - 0.1); S.rise('fragN', t + 0.05, G.fragN); S.rise('zone', t + 0.3, G.zone); S.pulseOn(['fragL'], t + 0.2, 1.0);
    // ---- c003: freeze both fragments beside two neutral continuation places ----
    t = X0('c003'); S.addLayer('cont', at('s3_two') + 0.3); S.rise('contL', at('s3_two') + 0.4, G.contL); S.rise('contN', at('s3_two') + 0.6, G.contN);
    S.title(a('c003') - 0.2, 'repair.purpose');
    // ---- B02 · c004: two legitimate turn-order moves, equal weight ----
    t = X0('c004'); S.head(t, B(2), null); S.title(t, null); X.clearAll(t); S.dropLayer('zone', t); S.dropLayer('cont', t);
    S.rise('t1', at('s3_offer'), G.t1); S.rise('t2', at('s3_ask'), G.t2); S.title(at('s3_ask') + 1.0, 'turn.choice'); S.rise('tb', at('s3_giving'), G.tb);
    // ---- c005: a short reminder parked beside the learner's fragment; Noah's continuation left empty ----
    t = X0('c005'); S.title(t, null); X.clearAll(t);
    S.rise('fragL', at('s3_let'), G.pL); S.rise('fragN', at('s3_let') + 0.2, G.pN); S.rise('pNc', at('s3_let') + 0.5, G.pNc);
    S.rise('park', a('c005'), G.pPark); S.title(a('c005') + 0.8, 'park.rule');
    // ---- c006 + h101: the two fragments beside a blank private planning area ----
    t = X0('c006'); S.title(t, null); X.clearAll(t);
    S.rise('fragL', at('s3_priv'), G.rL); S.rise('fragN', at('s3_priv') + 0.2, G.rN); S.rise('blank', at('s3_priv') + 0.5, G.blank, { text: '' }); S.title(a('c006') - 0.2, 'reflection.prompt');
    X.hold('h101');
    // ---- c007 + c008 + gate: the source fragments, then equal neutral alternatives ----
    t = X0('c007'); S.title(t, null); X.clearAll(t);
    S.rise('caseL', t + 0.2, G.eCase); S.rise('fragL', t + 0.3, G.eL, { tag: '' }); S.rise('fragN', t + 0.45, G.eN, { tag: '' }); S.title(a('c007') - 0.2, 'choice.prompt');
    S.rise('chNote', a('c008'), G.chNote);
    X.gate({ optRects: G.opts });
    const branch = (d1, d2, f, label, p1, p2, hl1, hl2) => {
      if (!X.has(d1)) return null; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'chNote'], t0); S.head(t0, null, null); S.title(t0, null);
      S.to('caseL', t0 + 0.1, G.sCase); S.to('fragL', t0 + 0.15, G.sL); S.to('fragN', t0 + 0.2, G.sN);
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L(label), kind: label === 'branch.b.label' ? 'framehead active' : 'framehead' }); // labelled before the line begins
      X.line(d1, p1, hl1, { headFirst: true }); X.line(d2, p2, hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead'], tf); S.head(tf + 0.1, B(2), null); S.to('caseL', tf + 0.1, G.caseB);
      return tf;
    };
    let tf = branch('d101', 'd102', 'f101', 'branch.a.label', 'ask:noah', 'explain:learner', ['finish this point first'], ['finish your point']);
    if (tf != null) { S.to('fragL', tf + 0.2, G.fL, { tag: 'x.unfinished' }); S.to('fragN', tf + 0.25, G.fN, { tag: 'x.unfinished' }); S.rise('turn', at('sA_yes') - 0.3, G.fTurn);
      S.pulseOn(['fragN'], a('f101') - 2.0, 1.2); S.title(a('f101') + 0.4, 'branch.a.note'); }
    tf = branch('d201', 'd202', 'f201', 'branch.b.label', 'propose:noah', 'explain:learner', ["let's do both activities"], ["haven't finished explaining"]);
    if (tf != null) { S.to('fragL', tf + 0.2, G.fL, { tag: 'x.unfinished' }); S.to('fragN', tf + 0.25, G.fN, { tag: 'x.unfinished' }); S.rise('merge', at('sB_here'), G.fMerge);
      S.pulseOn(['fragL', 'fragN'], at('sB_here') + 0.5, 1.2); S.title(a('f201') - 0.2, 'branch.b.note'); }
    tf = branch('d301', 'd302', 'f301', 'branch.c.label', 'ask:noah', 'propose:learner', ["I'd like to finish my point"], ['then use that to introduce ourselves']);
    if (tf != null) { const tR = X0('d302'); S.rise('park', a('d301') + 0.3, G.sPark); S.hide(['fragN'], tR); S.rise('nFull', tR + 0.6, G.sFull); // the full F05 replaces the fragment
      S.to('fragL', tf + 0.2, G.fL, { tag: 'x.unfinished' }); S.to('park', tf + 0.25, G.fPark); S.to('nFull', tf + 0.3, G.fNfull);
      S.pulseOn(['park'], at('sC_still'), 1.2); S.title(a('f301') - 0.2, 'branch.c.note'); }
    // ---- B03 · c010: every path rejoins on the two common fragments only ----
    t = X0('c010'); X.roomOut(t); S.hide(['nFull'], t, 0.01); X.clearAll(t, ['nFull']); S.head(t, B(3), null); // the branch-only F05 card leaves at once (no fade into the common rejoin) S.title(t, null);
    S.rise('fragL', at('s3_shared'), G.jL, { tag: 'x.unfinished' }); S.rise('fragN', at('s3_shared') + 0.2, G.jN, { tag: 'x.unfinished' }); S.title(a('c010') - 0.2, 'shared.principle');
    // ---- c011: offer → listen → return (no branch content) ----
    t = X0('c011'); S.title(t, null); S.hide(['fragL', 'fragN'], t);
    S.rise('st0', at('s3_offerT'), G.st[0]); S.addLayer('steps', at('s3_listen') - 0.3); S.rise('st1', at('s3_listen'), G.st[1]); S.rise('st2', at('s3_then'), G.st[2]); S.rise('rr', a('c011'), G.rr);
    // ---- c012 + d003 · a separately labelled worked example: the learner's complete point ----
    t = X0('c012'); X.clearAll(t); S.dropLayer('steps', t); S.rise('ex', at('s3_sep'), G.kEx); S.pulseOn(['ex'], at('s3_sep') + 0.5, 1.0);
    t = X0('d003'); S.head(t, null, null); S.to('ex', t + 0.1, G.sEx);
    X.line('d003', 'explain:maya', ['one question about the weekly drawing group'], { headFirst: true }); S.rise('pend', a('d003') + 0.3, G.sPend); S.rise('plim', a('d003') + 0.9, G.sLim);
    // ---- c013: a question-forming step → an unresolved answer source ----
    t = X0('c013'); X.roomOut(t); S.head(t + 0.1, B(3), null); S.hide(['plim'], t); S.to('ex', t + 0.1, G.kEx); S.to('pend', t + 0.2, G.kPend);
    S.addLayer('src', at('s3_notYet') - 0.2); S.rise('tlim', at('s3_notYet'), G.kLim); S.rise('aims', a('c013') - 0.3, G.kAims);
    // ---- B04 · c014 + h102: the original two fragments only, beside a blank private area ----
    t = X0('c014'); S.head(t, B(4), null); X.clearAll(t); S.dropLayer('src', t);
    S.rise('fragL', at('s3_return'), G.rL, { tag: 'x.unfinished' }); S.rise('fragN', at('s3_return') + 0.2, G.rN, { tag: 'x.unfinished' }); S.rise('blank', at('s3_return') + 0.5, G.blank, { text: '' });
    S.title(a('c014') - 0.2, 'private.prompt');
    X.hold('h102');
    // ---- c015: neutral self-check; next-section title ----
    t = X0('c015'); S.title(at('s3_check'), 'review.question'); S.hide(['blank'], t); S.rise('next', at('s3_next'), G.next);
  }
  global.L07Scenes = { setup };
})(window);
