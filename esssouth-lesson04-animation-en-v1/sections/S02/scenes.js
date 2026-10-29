/*
 * L04.S02 · Recognise a Reason Without Pretending to Agree. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Recognition is linked to the reason card, agreement to the proposal card: different objects, different commitments.
 * Gate L04.I01: the assigned fictional position is shown as a pill, not a detected belief. Branch A's agreement marker exists
 * only in its own route; branch C's personal label sits in a separate lane and is removed from the claim area. c010 rebuilds
 * the two task considerations from common facts for every path.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    rc: R(150, 380, 760, 110, 32), pc: R(1010, 380, 760, 110, 32),
    frame: R(150, 300, 1620, 540), frameLbl: R(190, 326, 820, 54, 26), ctx: R(190, 404, 820, 80, 28), aim: R(190, 508, 820, 90, 30), tool: R(190, 624, 820, 96, 28),
    prob: [R(1090, 520, 300, 90, 28), R(1420, 520, 300, 90, 28)],
    sLbl: R(1140, 150, 690, 54, 24), sAim: R(1140, 222, 690, 84, 28),
    quote: R(150, 284, 1620, 140, 32), reason: R(150, 470, 800, 96, 30), prop: R(1060, 470, 710, 96, 30), aimR: R(150, 650, 800, 84, 28),
    phrRecog: R(150, 650, 800, 96, 30), phrAgree: R(1060, 650, 710, 96, 30), direct: R(1060, 650, 710, 96, 30),
    tCtx: R(150, 470, 800, 80, 28), tProp: R(150, 580, 800, 96, 30), blank: R(1060, 470, 710, 320, 30),
    pos: R(150, 436, 1000, 54, 24), chNote: R(1180, 436, 590, 54, 24), opts: [R(150, 506, 1620, 100, 30), R(150, 618, 1620, 100, 30), R(150, 730, 1620, 100, 30)],
    sHead: R(1140, 150, 690, 56, 26), sQuote: R(1140, 226, 690, 236, 30), sPos: R(1140, 482, 690, 84, 26),
    fPos: R(150, 470, 800, 96, 28), resp: R(150, 620, 1620, 100, 32), fReason: R(150, 470, 800, 96, 30), fConcern: R(1060, 470, 710, 96, 28),
    bQ: R(560, 750, 800, 76, 28), judge: R(1060, 470, 710, 96, 28), cConcern: R(150, 470, 800, 96, 28),
    crit: [R(150, 470, 800, 96, 32), R(1060, 470, 710, 96, 32)], cTool: R(560, 640, 800, 90, 28),
    recog: R(150, 650, 800, 96, 30), question: R(1060, 650, 710, 96, 30), ack: R(150, 650, 800, 96, 28),
    pAim: R(150, 470, 800, 90, 30), pPos: R(150, 590, 800, 90, 28), pBlank: R(1060, 470, 710, 300, 30), pNote: R(1060, 416, 710, 44, 26), pTime: R(1060, 790, 710, 40, 22),
    next: R(560, 700, 800, 96, 30), endProp: R(560, 470, 800, 96, 30)
  };

  function setup(E, ctx) {
    const K = global.L04Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('frame', G.frame, 'ctx frame', '', 'token.default');
    tok('rc', G.rc, 'idea reason', L('x.reasonCard'), 'token.step'); tok('pc', G.pc, 'proposal', L('x.proposalCard'), 'token.step');
    tok('frameLbl', G.frameLbl, 'framehead', L('x.fictional'), 'token.frame'); tok('ctxC', G.ctx, 'chipcard', L('task.context'), 'token.chip');
    tok('aim', G.aim, 'goal', L('task.aim'), 'token.step'); tok('tool', G.tool, 'step plan', L('tool.state'), 'token.step');
    tok('p1', G.prob[0], 'step', L('x.prob1'), 'token.step'); tok('p2', G.prob[1], 'step', L('x.prob2'), 'token.step');
    tok('quote', G.quote, 'quote speaker', markup(L('quote.maya'), ['can save time', 'as soon as a problem becomes difficult']), 'token.quote', { who: 1, spk: 'maya' });
    tok('reason', G.reason, 'idea reason', L('reason.relevant'), 'token.step'); tok('prop', G.prop, 'proposal', L('proposal.open'), 'token.step');
    tok('phrRecog', G.phrRecog, 'example', L('recognition.phrase'), 'token.step'); tok('phrAgree', G.phrAgree, 'example', L('agreement.phrase'), 'token.step');
    tok('direct', G.direct, 'proposal next', L('x.direct'), 'token.step');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('pos', G.pos, 'framehead', L('choice.position'), 'token.frame'); tok('chNote', G.chNote, 'framehead', L('choice.note'), 'token.frame');
    tok('sHead', G.sHead, 'framehead', L('branch.b.label'), 'token.frame');
    tok('fConcern', G.fConcern, 'concern', L('x.b.concern'), 'token.step'); tok('judge', G.judge, 'step gap', L('x.judge'), 'token.step');
    tok('cConcern', G.cConcern, 'concern', L('x.c.concern'), 'token.step');
    tok('resp', G.resp, 'example', '', 'token.summary'); tok('bQ', G.bQ, 'question', L('x.b.question'), 'token.question');
    tok('crit1', G.crit[0], 'idea reason', L('x.crit.time'), 'token.step'); tok('crit2', G.crit[1], 'goal', L('x.crit.reason'), 'token.step');
    tok('recog', G.recog, 'example', L('x.recog'), 'token.step'); tok('question', G.question, 'example', L('x.question'), 'token.step');
    tok('ack', G.ack, 'chipcard margin', L('acknowledgement.optional'), 'token.chip');
    tok('pNote', G.pNote, 'colhead quiet', L('private.note'), 'token.colhead'); tok('pTime', G.pTime, 'hint', L('private.time'), 'token.hint');
    tok('pBlank', G.pBlank, 'note', L('private.prompt'), 'token.note');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('rp'); Rx.dline(E, l, 'rp.a', 'M 918 435 L 1002 435', '#B9C5D6'); Rx.qmark(E, l, 'rp.q', 960, 408);
    l = ly('task'); E.icon(l, 'task.clock', 'clock', 1090, 392, 64, '#5D6878'); E.path(l, 'task.rail', 'M 1190 424 L 1700 424', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'task.t0', 'M 1190 406 L 1190 442', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'task.t1', 'M 1700 406 L 1700 442', { stroke: '#B9C5D6', 'stroke-width': 4 });
    l = ly('ra'); Rx.dline(E, l, 'ra.a', 'M 550 642 L 550 582', '#9DB6E0'); Rx.head(E, l, 'ra.h', 550, 574, 'up', '#9DB6E0'); Rx.dline(E, l, 'ra.b', 'M 958 518 L 1052 518', '#B9C5D6'); Rx.qmark(E, l, 'ra.q', 1005, 492);
    l = ly('ph'); Rx.dline(E, l, 'ph.a', 'M 550 642 L 550 582', '#356CC8'); Rx.head(E, l, 'ph.ah', 550, 574, 'up', '#356CC8'); Rx.dline(E, l, 'ph.b', 'M 1415 642 L 1415 582', '#356CC8'); Rx.head(E, l, 'ph.bh', 1415, 574, 'up', '#356CC8');
    l = ly('lA'); Rx.dline(E, l, 'lA.a', 'M 550 612 L 550 582', '#B9C5D6'); Rx.qmark(E, l, 'lA.q', 590, 598);
    l = ly('lB'); Rx.dline(E, l, 'lB.a', 'M 550 612 L 550 582', '#9DB6E0'); Rx.head(E, l, 'lB.ah', 550, 574, 'up', '#9DB6E0'); Rx.dline(E, l, 'lB.b', 'M 1415 612 L 1415 582', '#9DB6E0'); Rx.head(E, l, 'lB.bh', 1415, 574, 'up', '#9DB6E0');
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 460 L 1005 590', '#9DB6E0');
    l = ly('cn'); Rx.dline(E, l, 'cn.a', 'M 550 642 L 550 582', '#356CC8'); Rx.head(E, l, 'cn.ah', 550, 574, 'up', '#356CC8'); Rx.dline(E, l, 'cn.b', 'M 1415 642 L 1415 582', '#356CC8'); Rx.head(E, l, 'cn.bh', 1415, 574, 'up', '#356CC8');
    l = ly('nx'); Rx.dline(E, l, 'nx.a', 'M 960 574 L 960 684', '#9DB6E0'); Rx.head(E, l, 'nx.h', 960, 692, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L04.S02.B0' + n, M = X.MOTION, markup = global.EsssouthStyleEngine.markup;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a reason and a proposal, separate; no agreement tick ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('rc', at('s2_recog'), G.rc); S.rise('pc', at('s2_recog') + 0.3, G.pc); S.addLayer('rp', a('c001'));
    S.title(a('c001') - 0.2, 'distinction.note'); S.pulseOn(['rc'], at('s2_honest'), 1.0);
    // ---- c002: task facts restored; modes unselected, plan undecided ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('rp', t); S.title(t, null);
    S.rise('frame', t + 0.2, G.frame); S.rise('frameLbl', at('s2_planning'), G.frameLbl); S.rise('ctxC', at('s2_planning') + 0.4, G.ctx); S.addLayer('task', at('s2_planning') + 0.7, 0.1);
    S.rise('p1', at('s2_planning') + 1.0, G.prob[0]); S.rise('p2', at('s2_planning') + 1.2, G.prob[1]); S.rise('aim', at('s2_aim'), G.aim); S.rise('tool', at('s2_tool'), G.tool);
    S.pulseOn(['tool'], a('c002'), 1.2);
    // ---- d001 · Maya's exact line ----
    t = X0('d001'); S.head(t, null, null); S.hide(['frame', 'ctxC', 'tool', 'p1', 'p2'], t); S.dropLayer('task', t);
    S.to('frameLbl', t + 0.1, G.sLbl); S.to('aim', t + 0.18, G.sAim);
    X.line('d001', 'propose:learner', ['can save time', 'as soon as a problem becomes difficult']);
    // ---- c003: time connects to the aim; the timing stays open ----
    t = X0('c003'); X.roomOut(t); S.hide(['frameLbl'], t); S.head(t + 0.1, B(1), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('reason', at('s2_relevant'), G.reason); S.to('aim', at('s2_relevant') + 0.4, G.aimR);
    S.addLayer('ra', at('s2_relevant') + 0.8, 0.2); S.rise('prop', a('c003'), G.prop); S.pulseOn(['prop'], at('s2_open'), 1.2);
    // ---- B02 · c004: two phrases, two objects, two commitments ----
    t = X0('c004'); S.head(t, B(2), null); S.hide(['aim'], t); S.dropLayer('ra', t);
    S.rise('phrRecog', at('s2_iSee'), G.phrRecog); S.rise('phrAgree', at('s2_iAgree'), G.phrAgree); S.addLayer('ph', at('s2_iAgree') + 0.5, 0.3);
    S.pulseOn(['reason', 'phrRecog'], at('s2_iSee') + 0.5, 1.0); S.pulseOn(['prop', 'phrAgree'], a('c004'), 1.2);
    // ---- c005: recognition optional; a direct objection with equal weight ----
    t = X0('c005'); S.dropLayer('ph', t); S.hide(['phrAgree'], at('s2_disguise'));
    S.put('phrRecog', at('s2_mean'), M.morph, { kind: 'chipcard margin' }); S.rise('direct', at('s2_mean') + 0.3, G.direct); S.addLayer('div', at('s2_mean') + 0.5);
    S.title(a('c005') - 0.2, 'honesty.rule');
    // ---- c006 + h101: the fixed task time, the unresolved proposal, a blank reflection area ----
    t = X0('c006'); S.title(t, null); S.hide(['phrRecog', 'direct', 'reason'], t); S.dropLayer('div', t);
    S.to('prop', t + 0.2, G.tProp); S.rise('ctxC', at('s2_limit'), G.tCtx); S.rise('blank', at('s2_consider') + 0.6, G.blank);
    X.hold('h101');
    // ---- B03 · c007 + c008 + gate L04.I01: an assigned fictional position ----
    t = X0('c007'); S.head(t, B(3), null); S.hide(['blank', 'ctxC', 'prop'], t);
    S.rise('pos', at('s2_position'), G.pos); S.pulseOn(['pos'], a('c007'), 1.0);
    t = X0('c008'); S.rise('chNote', a('c008') - 0.6, G.chNote);
    X.gate({ optRects: G.opts });
    // ---- branches ----
    const branch = (d1, d2, f, label, hl1, hl2, pose2) => {
      if (!X.has(d1)) return null; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'chNote', 'quote', 'pos'], t0); S.head(t0, null, null);
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L(label) }); S.rise('quote', t0 + 0.4, G.sQuote, { hl: 0 });
      X.line(d1, 'explain:maya', hl1, { headFirst: true }); X.line(d2, pose2, hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead'], tf); S.head(tf + 0.1, B(3), null); S.to('quote', tf + 0.1, G.quote, { hl: 1 }); return tf;
    };
    let tf = branch('d101', 'd102', 'f101', 'branch.a.label', ['use it immediately'], ['whenever a step becomes difficult'], 'ask:learner');
    if (tf != null) { S.rise('resp', tf + 0.5, G.resp, { text: L('gate.option.A'), tag: 'x.agreeMark' }); S.rise('pos', at('sA_conceals') - 0.6, G.fPos, { kind: 'concern' });
      S.addLayer('lA', at('sA_conceals')); S.pulseOn(['pos', 'resp'], at('sA_conceals'), 1.2); S.title(a('f101') - 0.2, 'branch.a.note'); }
    tf = branch('d201', 'd202', 'f201', 'branch.b.label', ['Saving time matters', 'could leave too little room'], ['avoid spending the whole session stuck', 'What kind of first attempt do you mean'], 'ask:learner');
    if (tf != null) { S.rise('resp', tf + 0.5, G.resp, { text: markup(L('gate.option.B'), ['could']), hl: 1 }); S.rise('reason', at('sB_recog'), G.fReason); S.rise('fConcern', at('sB_concern'), G.fConcern);
      S.addLayer('lB', at('sB_concern') + 0.3, 0.2); S.rise('bQ', at('sB_asks'), G.bQ); S.title(a('f201') - 0.2, 'branch.b.note'); }
    tf = branch('d301', 'd302', 'f301', 'branch.c.label', ['lazy learners'], ['use the time well', 'when the tool would help'], 'explain:learner');
    if (tf != null) { S.rise('resp', tf + 0.5, G.resp, { text: markup(L('gate.option.C'), ['lazy learners']), hl: 1 }); S.rise('judge', at('sC_labels'), G.judge); S.pulseOn(['judge'], at('sC_labels') + 0.3, 1.0);
      S.put('resp', a('f301'), M.focus, { o: 0.4 }); S.rise('cConcern', at('sC_useful'), G.cConcern); S.title(a('f301') - 0.2, 'branch.c.note'); }
    // ---- B04 · c010: every path rejoins; the two task considerations from common facts ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t); ['lA', 'lB'].forEach((l) => S.dropLayer(l, t)); S.head(t, B(4), null); S.title(t, null);
    S.rise('crit1', at('s2_care'), G.crit[0]); S.rise('crit2', at('s2_examine'), G.crit[1]); S.rise('tool', a('c010') - 0.3, G.cTool);
    S.title(a('c010') - 0.1, 'shared.criteria');
    // ---- c011: recognise and question, both specific, each linked to its object ----
    t = X0('c011'); S.title(t, null); S.hide(['crit1', 'crit2', 'tool'], t);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('reason', t + 0.5, G.reason); S.rise('prop', t + 0.6, G.prop);
    S.rise('recog', at('s2_say'), G.recog); S.rise('question', at('s2_say') + 0.6, G.question); S.addLayer('cn', at('s2_say') + 0.9, 0.3);
    S.title(a('c011') - 0.2, 'response.check');
    // ---- c012: acknowledgement aside as optional; a direct objection stays visible ----
    t = X0('c012'); S.title(t, null); S.dropLayer('cn', t); S.hide(['recog', 'question'], t);
    S.rise('ack', a('c012'), G.ack); S.rise('direct', at('s2_concise'), G.direct); S.addLayer('div', at('s2_concise') + 0.3);
    // ---- B05 · c013 + c014 + h102: the assigned position and a blank reply area ----
    t = X0('c013'); S.head(t, B(5), null); X.clearAll(t); S.dropLayer('div', t);
    S.rise('aim', at('s2_same'), G.pAim); S.rise('pos', at('s2_same') + 0.3, G.pPos, { kind: 'framehead' }); S.rise('pBlank', a('c013') - 0.4, G.pBlank);
    t = X0('c014'); S.rise('pNote', at('s2_think'), G.pNote); S.rise('pTime', a('c014'), G.pTime);
    X.hold('h102');
    // ---- c015: a conditional self-check; the source undecided; next-section title ----
    t = X0('c015'); S.hide(['pNote', 'pTime', 'pBlank', 'aim', 'pos'], t); S.title(at('s2_tried') + 0.4, 'review.question');
    S.rise('prop', at('s2_tried') + 0.6, G.endProp); S.addLayer('nx', at('s2_next') - 0.3); S.rise('next', at('s2_next'), G.next);
  }
  global.L04Scenes = { setup };
})(window);
