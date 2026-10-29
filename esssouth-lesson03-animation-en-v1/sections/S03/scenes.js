/*
 * L03.S03 · Ask the Question That Matters. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Known facts (fact kind) and the unknown referent (open question kind) stay visually distinct; possible referents carry a
 * shared "unconfirmed" heading; proposals stay dashed. Gate L03.I02: each branch is a separate authored continuation.
 * c010 rebuilds the known/unknown map for every path; c011 opens a framed "Shared worked example" that states its own
 * premise, so it is valid after A, B, C or Skip.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    contrib: R(150, 400, 700, 110, 32), reply: R(1070, 400, 700, 110, 32), missing: R(560, 620, 800, 96, 30),
    frame: R(150, 300, 1620, 540), frameLbl: R(190, 326, 820, 54, 26), task: R(190, 410, 820, 100, 32), aim: R(190, 534, 820, 100, 30), res: R(190, 658, 820, 76, 28),
    sLbl: R(1140, 150, 690, 54, 24), sTask: R(1140, 222, 690, 84, 28), sSeq: R(1140, 330, 690, 84, 28), sQuote: R(1140, 448, 690, 130, 30),
    quote: R(150, 284, 1620, 110, 32),
    seq: R(150, 470, 800, 100, 30), ambHead: R(1060, 440, 710, 44, 28), refs: [R(1060, 494, 710, 76, 28), R(1060, 584, 710, 76, 28), R(1060, 674, 710, 76, 28)],
    kTask: R(150, 470, 800, 84, 30), kRes: R(150, 572, 800, 66, 28), known: R(150, 656, 800, 84, 30), unknown: R(1060, 470, 710, 100, 30),
    dPropH: R(150, 440, 800, 44, 28), shorten: R(150, 494, 800, 92, 30), dQH: R(1060, 440, 710, 44, 28), unknown2: R(1060, 494, 710, 92, 30),
    blank: R(1060, 470, 710, 300, 30),
    chNote: R(150, 414, 900, 54, 26), opts: [R(150, 496, 1620, 96, 30), R(150, 608, 1620, 96, 30), R(150, 720, 1620, 96, 30)],
    sHead: R(1140, 150, 690, 56, 26), bQuote: R(1140, 226, 690, 130, 30),
    fKnown: R(150, 420, 800, 84, 30), fUnknown: R(1060, 420, 710, 84, 30), resp: R(150, 540, 1620, 96, 32), answer: R(560, 690, 800, 100, 30),
    xFrame: R(150, 300, 1620, 520), xHead: R(190, 326, 820, 54, 26), xConcern: R(190, 410, 820, 100, 30),
    sFrame: R(1120, 132, 730, 420), sxHead: R(1140, 148, 690, 54, 24), sxConcern: R(1140, 216, 690, 100, 28), sxReply: R(1140, 404, 690, 120, 26),
    arr: R(190, 590, 820, 140, 30), xKnown: R(1060, 410, 670, 84, 28), xRes: R(1060, 520, 670, 66, 26),
    privTag: R(1060, 416, 710, 44, 26), hint: R(1060, 790, 710, 40, 22),
    cKnown: R(150, 470, 800, 84, 30), cConcern: R(1060, 470, 710, 100, 30), next: R(560, 700, 800, 96, 30)
  };

  function setup(E, ctx) {
    const K = global.L03Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('frame', G.frame, 'ctx frame', '', 'token.default'); tok('xFrame', G.xFrame, 'ctx frame', '', 'token.default'); // containers first (stacking)
    tok('contrib', G.contrib, 'idea', L('x.contribution'), 'token.idea'); tok('reply', G.reply, 'idea vague', L('x.reply'), 'token.idea'); tok('missing', G.missing, 'note', L('x.missing'), 'token.note');
    tok('frameLbl', G.frameLbl, 'framehead', L('task.status'), 'token.frame'); tok('task', G.task, 'goal', L('task.title'), 'token.step');
    tok('aim', G.aim, 'fact', L('x.aim'), 'token.step'); tok('res', G.res, 'chipcard', L('task.resources'), 'token.chip');
    tok('seq', G.sSeq, 'proposal', L('proposal.sequence'), 'token.step');
    tok('quote', G.sQuote, 'quote speaker', markup(L('quote.unclear'), ['that way', 'difficult']), 'token.quote', { who: 1, spk: 'noah' });
    tok('ambHead', G.ambHead, 'colhead dashed', L('ambiguity.note'), 'token.colhead');
    tok('ref1', G.refs[0], 'note', L('x.ref.seq'), 'token.note'); tok('ref2', G.refs[1], 'note', L('x.ref.pace'), 'token.note'); tok('ref3', G.refs[2], 'note', L('x.ref.other'), 'token.note');
    tok('known', G.known, 'fact', L('known.label'), 'token.step'); tok('unknown', G.unknown, 'question', L('unknown.label'), 'token.question');
    tok('dPropH', G.dPropH, 'colhead', L('distinction.proposal'), 'token.colhead'); tok('dQH', G.dQH, 'colhead', L('distinction.question'), 'token.colhead');
    tok('shorten', G.shorten, 'proposal', L('x.shorten'), 'token.step');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('chNote', G.chNote, 'framehead', L('choice.note'), 'token.frame');
    tok('sHead', G.sHead, 'framehead', L('branch.c.label'), 'token.frame');
    tok('resp', G.resp, 'example', '', 'token.summary'); tok('answer', G.answer, 'concern', '', 'token.step');
    tok('xHead', G.xHead, 'framehead', L('common.example'), 'token.frame');
    tok('xConcern', G.xConcern, 'concern', L('shared.concern'), 'token.step', { tag: 'shared.status' });
    tok('xReply', G.sxReply, 'proposal', L('reply.label'), 'token.step');
    tok('arr', G.arr, 'proposal', E.cueText('L03.S03.d003'), 'token.step', { tag: 'reply.scope' });
    tok('privTag', G.privTag, 'colhead quiet', L('rehearsal.private'), 'token.colhead'); tok('hint', G.hint, 'hint', L('rehearsal.time'), 'token.hint');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('open'); Rx.dline(E, l, 'open.a', 'M 862 455 L 1058 455', '#B9C5D6'); Rx.qmark(E, l, 'open.q', 960, 426);
    l = ly('task'); E.icon(l, 'task.clock', 'clock', 1090, 412, 64, '#5D6878'); E.path(l, 'task.rail', 'M 1190 444 L 1700 444', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'task.t0', 'M 1190 426 L 1190 462', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'task.t1', 'M 1700 426 L 1700 462', { stroke: '#B9C5D6', 'stroke-width': 4 });
    E.icon(l, 'task.staff', 'staff', 1090, 540, 64, '#5D6878'); E.icon(l, 'task.paper', 'cards', 1090, 660, 64, '#5D6878');
    l = ly('sideQ'); Rx.dline(E, l, 'sideQ.a', 'M 1485 440 L 1485 422', '#B9C5D6'); Rx.qmark(E, l, 'sideQ.q', 1525, 431);
    l = ly('refs'); [532, 622, 712].forEach((y, i) => Rx.dline(E, l, 'refs.' + i, `M 958 520 C 1000 520, 1010 ${y}, 1052 ${y}`, '#B9C5D6')); Rx.qmark(E, l, 'refs.q', 1004, 476);
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 440 L 1005 800', '#9DB6E0');
    l = ly('lA'); Rx.dline(E, l, 'lA.a', 'M 550 532 L 550 512', '#B9C5D6'); Rx.head(E, l, 'lA.h', 550, 506, 'up', '#B9C5D6');
    l = ly('lC'); Rx.dline(E, l, 'lC.a', 'M 1415 532 L 1415 512', '#9DB6E0'); Rx.head(E, l, 'lC.h', 1415, 506, 'up', '#9DB6E0'); Rx.dline(E, l, 'lC.b', 'M 960 644 L 960 676', '#9DB6E0'); Rx.head(E, l, 'lC.bh', 960, 684, 'down', '#9DB6E0');
    l = ly('lB'); Rx.dline(E, l, 'lB.b', 'M 960 644 L 960 676', '#B9C5D6'); Rx.head(E, l, 'lB.bh', 960, 684, 'down', '#B9C5D6'); Rx.qmark(E, l, 'lB.q', 1000, 660);
    l = ly('xa'); Rx.dline(E, l, 'xa.a', 'M 900 518 L 900 578', '#9DB6E0'); Rx.head(E, l, 'xa.h', 900, 586, 'down', '#9DB6E0');
    Rx.dline(E, l, 'xa.b', 'M 1018 660 C 1040 660, 1040 552, 1052 552', '#B9C5D6'); Rx.qmark(E, l, 'xa.q', 1072, 610);
    l = ly('nx'); Rx.dline(E, l, 'nx.a', 'M 960 578 L 960 684', '#9DB6E0'); Rx.head(E, l, 'nx.h', 960, 692, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L03.S03.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: an unresolved link; missing information is not failure ----
    S.head(X0('c001') + 0.1, B(1), null);
    S.rise('contrib', X0('c001') + 0.5, G.contrib); S.rise('reply', at('s03_decide'), G.reply); S.addLayer('open', at('s03_decide') + 0.4);
    S.rise('missing', a('c001'), G.missing); S.title(a('c001') - 0.2, 'question.purpose');
    // ---- c002: the shared task restored; proposals only ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('open', t); S.title(t, null);
    S.rise('frame', t + 0.2, G.frame); S.rise('frameLbl', at('s03_return'), G.frameLbl); S.rise('task', at('s03_return') + 0.4, G.task); S.addLayer('task', at('s03_return') + 0.7, 0.1);
    S.rise('res', at('s03_facil'), G.res); S.rise('aim', at('s03_facil') + 1.2, G.aim); S.pulseOn(['frameLbl'], at('s03_tried'), 1.2);
    // ---- d001 · Maya proposes a sequence; d002 · Noah: "that way" stays unresolved ----
    t = X0('d001'); S.head(t, null, null); S.hide(['frame', 'aim', 'res'], t); S.dropLayer('task', t);
    S.to('frameLbl', t + 0.1, G.sLbl); S.to('task', t + 0.18, G.sTask);
    X.line('d001', 'propose:learner', ['could demonstrate several steps', 'then everyone could try them'], { headFirst: true });
    S.rise('seq', a('d001'), G.sSeq);
    t = X0('d002'); X.line('d002', 'explain:maya', ['that way', 'could be difficult for beginners']);
    S.rise('quote', at('s03_difficult'), G.sQuote, { hl: 1 }); S.addLayer('sideQ', at('s03_difficult') + 0.3);
    // ---- c003: possible referents beside the source wording, none selected ----
    t = X0('c003'); X.roomOut(t); S.hide(['frameLbl', 'task'], t); S.dropLayer('sideQ', t); S.head(t + 0.1, B(1), null);
    S.to('quote', t + 0.1, G.quote); S.to('seq', t + 0.2, G.seq);
    S.rise('ambHead', a('c003'), G.ambHead); S.addLayer('refs', at('s03_sequence') - 0.3, 0.1);
    S.rise('ref1', at('s03_sequence'), G.refs[0]); S.rise('ref2', at('s03_pace'), G.refs[1]); S.rise('ref3', at('s03_another'), G.refs[2]);
    S.title(at('s03_possib') - 0.2, 'ambiguity.note'); S.pulseOn(['ambHead'], at('s03_possib'), 1.2);
    // ---- B02 · c004: known facts vs the missing link ----
    t = X0('c004'); S.head(t, B(2), null); S.title(t, null); S.hide(['seq', 'ambHead', 'ref1', 'ref2', 'ref3'], t); S.dropLayer('refs', t);
    S.rise('task', at('s03_length') - 0.2, G.kTask); S.rise('res', at('s03_length'), G.kRes); S.rise('known', at('s03_length') + 0.4, G.known);
    S.pulseOn(['known'], at('s03_again'), 1.0); S.rise('unknown', at('s03_missing'), G.unknown); S.pulseOn(['unknown'], a('c004'), 1.2);
    // ---- c005: a plausible solution is not a clarification ----
    t = X0('c005'); S.hide(['task', 'res', 'known'], t);
    S.rise('dPropH', at('s03_early'), G.dPropH); S.rise('shorten', at('s03_shorten'), G.shorten); S.addLayer('div', at('s03_shorten') + 0.3);
    S.rise('dQH', at('s03_which') - 0.3, G.dQH); S.to('unknown', at('s03_which'), G.unknown2); S.pulseOn(['dQH', 'unknown'], a('c005'), 1.2);
    // ---- c006 + h101: task facts kept; an empty question-planning area ----
    t = X0('c006'); S.hide(['dPropH', 'dQH', 'shorten', 'unknown'], t); S.dropLayer('div', t);
    S.rise('task', at('s03_facts') - 0.4, G.kTask); S.rise('res', at('s03_facts') - 0.2, G.kRes); S.rise('known', at('s03_facts'), G.known);
    S.rise('blank', at('s03_gap'), G.blank);
    X.hold('h101');
    // ---- B03 · c007 + c008 + gate L03.I02 ----
    t = X0('c007'); S.head(t, B(3), null); S.hide(['blank', 'task', 'res', 'known'], t); S.title(a('c007') - 0.2, 'choice.prompt');
    S.pulseOn(['quote'], a('c007'), 1.0);
    t = X0('c008'); S.rise('chNote', a('c008') - 0.6, G.chNote);
    X.gate({ optRects: G.opts });
    // ---- branches ----
    const branch = (d1, d2, f, label, hl1, hl2) => {
      if (!X.has(d1)) return null; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'chNote', 'quote'], t0); S.head(t0, null, null); S.title(t0, null);
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L(label) }); S.rise('quote', t0 + 0.4, G.bQuote, { hl: 1 });
      X.line(d1, 'ask:noah', hl1, { headFirst: true }); X.line(d2, 'explain:learner', hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead'], tf); S.head(tf + 0.1, B(3), null); S.to('quote', tf + 0.1, G.quote);
      S.rise('known', tf + 0.3, G.fKnown); S.rise('unknown', tf + 0.45, G.fUnknown); return tf;
    };
    let tf = branch('d101', 'd102', 'f101', 'branch.a.label', ['How long'], ['Thirty minutes', 'how the demonstration is arranged']);
    if (tf != null) { S.rise('resp', tf + 0.8, G.resp, { text: L('gate.option.A') }); S.addLayer('lA', tf + 1.1);
      S.pulseOn(['known'], at('sA_clear'), 1.2); S.pulseOn(['unknown'], a('f101'), 1.4); S.title(a('f101') - 0.2, 'branch.a.note'); }
    tf = branch('d201', 'd202', 'f201', 'branch.b.label', ['make the demonstration shorter'], ['keeping track of several steps before trying them']);
    if (tf != null) { S.rise('resp', tf + 0.8, G.resp, { text: L('gate.option.B'), kind: 'proposal' }); S.pulseOn(['resp'], at('sB_reason'), 1.0);
      S.pulseOn(['unknown'], a('f201'), 1.2); S.addLayer('lB', at('sB_supplies') - 0.3); S.rise('answer', at('sB_supplies'), G.answer, { text: L('x.b.answer') }); S.title(at('sB_notQ') - 0.2, 'branch.b.note'); }
    tf = branch('d301', 'd302', 'f301', 'branch.c.label', ['Which part'], ['remembering several steps before they get a chance to try', 'could']);
    if (tf != null) { S.rise('resp', tf + 0.8, G.resp, { text: L('gate.option.C'), kind: 'question shared' }); S.addLayer('lC', at('sC_direct') + 0.3);
      S.pulseOn(['resp', 'unknown'], at('sC_direct') + 0.3, 1.2); S.rise('answer', at('sC_specific'), G.answer, { text: L('x.c.answer') }); S.title(a('f301') - 0.2, 'branch.c.note'); S.pulseOn(['answer'], at('sC_possible'), 1.0); }
    // ---- B04 · c010: every path rejoins; the known/unknown map is rebuilt without assuming a branch ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t); ['lA', 'lB', 'lC'].forEach((l) => S.dropLayer(l, t)); S.head(t, B(4), null); S.title(t, null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('known', at('s03_duration'), G.cKnown); S.rise('unknown', at('s03_key'), G.cConcern);
    S.title(at('s03_key') + 0.6, 'shared.question'); S.pulseOn(['unknown'], at('s03_key') + 0.3, 1.2); S.pulseOn(['known'], at('s03_duration'), 1.0);
    // ---- c011: a framed shared worked example states its own premise ----
    t = X0('c011'); X.clearAll(t); S.title(t, null);
    S.rise('xFrame', at('s03_worked') + 0.1, G.xFrame); S.rise('xHead', at('s03_worked') + 0.3, G.xHead); S.rise('xConcern', a('c011'), G.xConcern);
    S.pulseOn(['xHead'], at('s03_authored'), 1.2);
    // ---- d003 · a possible learner response, not adopted; the frame and its concern stay with it ----
    t = X0('d003'); S.head(t, null, null);
    S.to('xFrame', t + 0.1, G.sFrame); S.to('xHead', t + 0.15, G.sxHead); S.to('xConcern', t + 0.2, G.sxConcern);
    X.line('d003', 'propose:noah', ['show one step', 'pause while people try it'], { headFirst: true }); S.rise('xReply', a('d003'), G.sxReply);
    // ---- c012: the arrangement beside the 30-minute and resource constraints; effects untested ----
    t = X0('c012'); X.roomOut(t); S.head(t + 0.1, B(4), null); S.hide(['xReply'], t);
    S.to('xFrame', t + 0.1, G.xFrame); S.to('xHead', t + 0.15, G.xHead); S.to('xConcern', t + 0.2, G.xConcern);
    S.rise('arr', t + 0.6, G.arr); S.addLayer('xa', at('s03_gapSee')); S.pulseOn(['arr', 'xConcern'], at('s03_gapSee'), 1.2);
    S.rise('known', at('s03_timeRes') - 0.2, G.xKnown); S.rise('res', at('s03_timeRes'), G.xRes); S.title(a('c012') - 0.2, 'reply.scope');
    // ---- B05 · c013 + c014 + h102: private question rehearsal; nothing recorded ----
    t = X0('c013'); S.head(t, B(5), null); X.clearAll(t); S.dropLayer('xa', t); S.title(t, null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('task', t + 0.5, G.kTask); S.rise('res', t + 0.6, G.kRes);
    S.rise('blank', at('s03_ownWords'), G.blank, { text: L('rehearsal.prompt') });
    t = X0('c014'); S.rise('privTag', at('s03_think'), G.privTag); S.rise('hint', at('s03_think') + 1.0, G.hint); S.pulseOn(['blank'], a('c014'), 1.0);
    X.hold('h102');
    t = X0('c015'); S.hide(['privTag', 'hint'], t); S.title(a('c015') - 0.2, 'review.prompt'); S.pulseOn(['quote'], at('s03_help'), 1.2);
    // ---- B06 · c016 + c017: a compact reference; next-section title ----
    t = X0('c016'); S.head(t, B(6), null); X.clearAll(t); S.title(t, null);
    S.rise('known', t + 0.4, G.cKnown); S.rise('xConcern', at('s03_open'), G.cConcern); S.title(a('c016') + 0.6, 'recap.title');
    S.pulseOn(['known'], at('s03_repeated'), 1.0);
    t = X0('c017'); S.addLayer('nx', at('s03_agree') - 0.3); S.rise('next', at('s03_agree'), G.next); S.pulseOn(['xConcern'], a('c017'), 1.0);
  }
  global.L03Scenes = { setup };
})(window);
