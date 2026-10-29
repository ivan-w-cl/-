/*
 * L04.S03 · Explain the Concern Precisely. Section adapter (tokens, rects, timing by cue starts and anchors).
 * The hint / full-answer modes stay unselected until Maya's explicit authored continuation (d002) moves the full answer into
 * her proposal. The risk is a labelled hypothetical pathway. Gate L04.I02: each branch is its own authored continuation;
 * c010 rebuilds the concern from the common explicit proposal for every path.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    node: [R(150, 500, 520, 110, 30), R(700, 500, 520, 110, 30), R(1250, 500, 520, 110, 30)],
    frame: R(150, 300, 1620, 540), frameLbl: R(190, 326, 820, 54, 26), ctx: R(190, 404, 820, 80, 28), aim: R(190, 508, 820, 90, 30), tool: R(190, 624, 820, 96, 28),
    prob: [R(1090, 440, 300, 80, 28), R(1420, 440, 300, 80, 28)], mode: [R(1090, 560, 300, 100, 28), R(1420, 560, 300, 100, 28)],
    sLbl: R(1140, 150, 690, 54, 24), sAim: R(1140, 222, 690, 84, 28),
    quote: R(150, 284, 1620, 140, 32), bMode: [R(150, 494, 760, 96, 30), R(1010, 494, 760, 96, 30)], cont: R(150, 640, 820, 54, 26),
    sCont: R(1140, 150, 690, 56, 26), sProp: R(1140, 236, 690, 100, 28), sHint: R(1140, 400, 690, 76, 28),
    propTop: R(150, 300, 800, 100, 30), rFrame: R(150, 440, 1620, 380), rHead: R(190, 456, 820, 54, 26), pOpen: R(190, 550, 740, 110, 30), pRed: R(1000, 550, 730, 110, 30),
    aimTop: R(1060, 300, 710, 100, 30), link: R(150, 494, 800, 120, 30), limit: R(1060, 494, 710, 120, 28),
    pL: R(150, 494, 800, 100, 30), blank: R(1060, 494, 710, 300, 30),
    gProp: R(150, 300, 1620, 100, 30), target: R(150, 424, 1000, 54, 24), chNote: R(1180, 424, 590, 54, 24),
    opts: [R(150, 500, 1620, 100, 30), R(150, 612, 1620, 100, 30), R(150, 724, 1620, 100, 30)],
    sHead: R(1140, 150, 690, 56, 26), sbProp: R(1140, 236, 690, 100, 28),
    fProp: R(150, 300, 800, 100, 30), fAim: R(1060, 300, 710, 100, 30), resp: R(150, 450, 1620, 100, 32), fCard: R(560, 620, 800, 96, 30),
    cProp: R(150, 494, 760, 110, 30), cRed: R(1010, 494, 760, 110, 30),
    m3: [R(150, 470, 620, 110, 30), R(1150, 470, 620, 110, 30), R(650, 680, 620, 100, 30)],
    sepA: R(150, 494, 800, 100, 30), sepT: R(1060, 494, 710, 100, 30), sepTool: R(150, 640, 800, 84, 28),
    first: R(560, 470, 800, 100, 30), crit: [R(150, 650, 800, 84, 28), R(1060, 650, 710, 84, 28)],
    pvProp: R(150, 494, 800, 100, 30), pvCtx: R(150, 620, 800, 80, 28), pvBlank: R(1060, 494, 710, 300, 30), pvNote: R(1060, 440, 710, 44, 26),
    e2: [R(150, 470, 800, 100, 30), R(1060, 470, 710, 100, 30)], next: R(560, 690, 800, 96, 30)
  };

  function setup(E, ctx) {
    const K = global.L04Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('frame', G.frame, 'ctx frame', '', 'token.default'); tok('rFrame', G.rFrame, 'ctx frame', '', 'token.default'); // containers first
    tok('n1', G.node[0], 'proposal', L('x.node.action'), 'token.step'); tok('n2', G.node[1], 'note', L('x.node.consequence'), 'token.note'); tok('n3', G.node[2], 'goal', L('x.node.aim'), 'token.step');
    tok('frameLbl', G.frameLbl, 'framehead', L('x.fictional'), 'token.frame'); tok('ctxC', G.ctx, 'chipcard', L('task.context'), 'token.chip');
    tok('aim', G.aim, 'goal', L('task.aim'), 'token.step'); tok('tool', G.tool, 'step plan', L('tool.state'), 'token.step');
    tok('p1', G.prob[0], 'step', L('x.prob1'), 'token.step'); tok('p2', G.prob[1], 'step', L('x.prob2'), 'token.step');
    tok('hint', G.mode[0], 'step plan', L('x.hint'), 'token.step'); tok('full', G.mode[1], 'step plan', L('x.full'), 'token.step');
    tok('quote', G.quote, 'quote speaker', markup(L('quote.maya'), ['as soon as a problem becomes difficult']), 'token.quote', { who: 1, spk: 'maya' });
    tok('cont', G.cont, 'framehead', L('continuation.label'), 'token.frame');
    tok('rHead', G.rHead, 'framehead', L('risk.label'), 'token.frame'); tok('pOpen', G.pOpen, 'note', L('x.path.open'), 'token.note'); tok('pRed', G.pRed, 'note', L('x.path.reduce'), 'token.note');
    tok('link', G.link, 'idea', L('task.link'), 'token.idea'); tok('limit', G.limit, 'step gap', L('scope.limit'), 'token.step');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('target', G.target, 'framehead', L('choice.target'), 'token.frame'); tok('chNote', G.chNote, 'framehead', L('choice.note'), 'token.frame');
    tok('sHead', G.sHead, 'framehead', L('branch.c.label'), 'token.frame');
    tok('resp', G.resp, 'example', '', 'token.summary'); tok('fCard', G.fCard, 'note', '', 'token.note');
    tok('sepA', G.sepA, 'question', L('separate.accuracy'), 'token.question'); tok('sepT', G.sepT, 'question', L('separate.timing'), 'token.question');
    tok('first', G.first, 'proposal', L('x.firstTry'), 'token.step'); tok('critT', G.crit[0], 'idea reason', L('x.crit.time'), 'token.step');
    tok('pvNote', G.pvNote, 'colhead quiet', L('private.note'), 'token.colhead'); tok('pvBlank', G.pvBlank, 'note', L('private.prompt'), 'token.note');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('nodes'); Rx.dline(E, l, 'nodes.a', 'M 678 555 L 686 555', '#9DB6E0'); Rx.head(E, l, 'nodes.ah', 694, 555, 'right', '#9DB6E0'); Rx.dline(E, l, 'nodes.b', 'M 1228 555 L 1236 555', '#9DB6E0'); Rx.head(E, l, 'nodes.bh', 1244, 555, 'right', '#9DB6E0');
    l = ly('task'); E.icon(l, 'task.clock', 'clock', 1090, 352, 56, '#5D6878'); E.path(l, 'task.rail', 'M 1170 380 L 1700 380', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'task.t0', 'M 1170 364 L 1170 396', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'task.t1', 'M 1700 364 L 1700 396', { stroke: '#B9C5D6', 'stroke-width': 4 });
    l = ly('path'); Rx.dline(E, l, 'path.a', 'M 938 605 L 986 605', '#9DB6E0'); Rx.head(E, l, 'path.h', 994, 605, 'right', '#9DB6E0'); Rx.qmark(E, l, 'path.q', 966, 578);
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 480 L 1005 620', '#9DB6E0');
    l = ly('lA'); Rx.dline(E, l, 'lA.a', 'M 960 558 L 960 612', '#B9C5D6'); Rx.qmark(E, l, 'lA.q', 1000, 584);
    l = ly('lC'); Rx.dline(E, l, 'lC.a', 'M 550 442 L 550 408', '#9DB6E0'); Rx.head(E, l, 'lC.ah', 550, 402, 'up', '#9DB6E0'); Rx.dline(E, l, 'lC.b', 'M 1415 442 L 1415 408', '#9DB6E0'); Rx.head(E, l, 'lC.bh', 1415, 402, 'up', '#9DB6E0');
    l = ly('cRel'); Rx.dline(E, l, 'cRel.a', 'M 918 549 L 994 549', '#9DB6E0'); Rx.head(E, l, 'cRel.h', 1002, 549, 'right', '#9DB6E0'); Rx.qmark(E, l, 'cRel.q', 960, 520);
    l = ly('map'); Rx.dline(E, l, 'map.a', 'M 778 525 L 1134 525', '#9DB6E0'); Rx.head(E, l, 'map.ah', 1142, 525, 'right', '#9DB6E0'); Rx.dline(E, l, 'map.b', 'M 1300 588 C 1300 640, 1200 690, 1280 720', '#9DB6E0'); Rx.dline(E, l, 'map.c', 'M 600 588 C 600 640, 700 690, 642 720', '#9DB6E0');
    l = ly('crit'); [550, 1415].forEach((x, i) => Rx.dline(E, l, 'crit.' + i, `M 960 578 C 960 610, ${x} 610, ${x} 642`, '#B9C5D6'));
    l = ly('nx'); Rx.dline(E, l, 'nx.a', 'M 960 578 L 960 684', '#9DB6E0'); Rx.head(E, l, 'nx.h', 960, 692, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L04.S03.B0' + n, M = X.MOTION, markup = global.EsssouthStyleEngine.markup;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: action, possible consequence, task aim — linked resources ----
    S.head(X0('c001') + 0.1, B(1), null);
    S.rise('n1', at('s3_action'), G.node[0]); S.rise('n2', at('s3_conseq'), G.node[1]); S.addLayer('nodes', at('s3_conseq') + 0.3, 0.3); S.rise('n3', a('c001'), G.node[2]);
    S.title(a('c001') + 0.4, 'concern.resources'); S.pulseOn(['n2'], at('s3_feels'), 1.0);
    // ---- c002: task facts, both modes unselected, unverified output ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('nodes', t); S.title(t, null);
    S.rise('frame', t + 0.2, G.frame); S.rise('frameLbl', at('s3_planning'), G.frameLbl); S.rise('ctxC', at('s3_planning') + 0.4, G.ctx); S.addLayer('task', at('s3_planning') + 0.6, 0.1);
    S.rise('p1', at('s3_planning') + 0.8, G.prob[0]); S.rise('p2', at('s3_planning') + 1.0, G.prob[1]); S.rise('aim', a('c002'), G.aim);
    S.rise('hint', at('s3_offers'), G.mode[0]); S.rise('full', at('s3_offers') + 0.3, G.mode[1]); S.rise('tool', at('s3_offers') + 0.8, G.tool);
    // ---- d001 · Maya's baseline line; mode unselected ----
    t = X0('d001'); S.head(t, null, null); S.hide(['frame', 'ctxC', 'tool', 'p1', 'p2', 'hint', 'full'], t); S.dropLayer('task', t);
    S.to('frameLbl', t + 0.1, G.sLbl); S.to('aim', t + 0.18, G.sAim); X.line('d001', 'propose:learner', ['as soon as a problem becomes difficult']);
    // ---- c003: a new authored continuation is marked before the new line ----
    t = X0('c003'); X.roomOut(t); S.hide(['frameLbl', 'aim'], t); S.head(t + 0.1, B(1), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('hint', t + 0.5, G.bMode[0]); S.rise('full', t + 0.6, G.bMode[1]); S.rise('cont', at('s3_specifies'), G.cont);
    S.pulseOn(['cont'], a('c003'), 1.2);
    // ---- d002 · Maya specifies: the full worked answer moves into her proposal; the hint stays another mode ----
    t = X0('d002'); S.head(t, null, null); S.hide(['quote'], t);
    S.to('cont', t + 0.1, G.sCont); S.to('hint', t + 0.2, G.sHint);
    X.line('d002', 'explain:learner', ['the full worked answer', 'as soon as we reach a difficult step'], { headFirst: false });
    S.to('full', a('d002'), G.sProp, { kind: 'proposal', text: L('proposal.mode'), tag: 'tool.state' });
    // ---- B02 · c004: a clearly framed hypothetical pathway ----
    t = X0('c004'); X.roomOut(t); S.hide(['cont', 'hint'], t); S.head(t + 0.1, B(2), null);
    S.to('full', t + 0.2, G.propTop, { tag: '' }); S.rise('rFrame', at('s3_now') + 0.4, G.rFrame); S.rise('rHead', at('s3_now') + 0.6, G.rHead);
    S.rise('pOpen', a('c004'), G.pOpen); S.addLayer('path', at('s3_reduce'), 0.2); S.rise('pRed', at('s3_reduce') + 0.3, G.pRed); S.pulseOn(['rHead'], at('s3_possible'), 1.2);
    // ---- c005: completion vs demonstrated explanation; neither outcome established ----
    t = X0('c005'); S.hide(['pOpen', 'pRed'], t); S.hide(['rHead', 'rFrame'], t + M.cut); S.dropLayer('path', t);
    S.rise('aim', at('s3_link'), G.aimTop); S.rise('link', at('s3_completed'), G.link); S.rise('limit', a('c005'), G.limit);
    // ---- c006 + h101: the explicit proposal and a blank private concern area ----
    t = X0('c006'); S.hide(['aim', 'link', 'limit'], t); S.to('full', t + 0.2, G.pL); S.rise('blank', at('s3_identify'), G.blank);
    X.hold('h101');
    // ---- B03 · c007 + c008 + gate L04.I02 ----
    t = X0('c007'); S.head(t, B(3), null); S.hide(['blank'], t); S.to('full', t + 0.2, G.gProp);
    S.rise('target', at('s3_consider'), G.target); S.title(a('c007') - 0.2, null);
    t = X0('c008'); S.rise('chNote', a('c008') - 0.6, G.chNote);
    X.gate({ optRects: G.opts });
    const branch = (d1, d2, f, label, hl1, hl2) => {
      if (!X.has(d1)) return null; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'chNote', 'target'], t0); S.head(t0, null, null);
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L(label) }); S.to('full', t0 + 0.2, G.sbProp);
      X.line(d1, 'explain:maya', hl1, { headFirst: true }); X.line(d2, 'ask:learner', hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead'], tf); S.head(tf + 0.1, B(3), null); S.to('full', tf + 0.1, G.fProp); S.rise('aim', tf + 0.3, G.fAim); return tf;
    };
    let tf = branch('d101', 'd102', 'f101', 'branch.a.label', ['do not really agree'], ['Which part concerns you', 'what do you think could happen']);
    if (tf != null) { S.rise('resp', tf + 0.5, G.resp, { text: L('gate.option.A') }); S.addLayer('lA', at('sA_missing') - 0.2); S.rise('fCard', at('sA_missing'), G.fCard, { text: L('x.a.missing') });
      S.title(a('f101') - 0.2, 'branch.a.note'); }
    tf = branch('d201', 'd202', 'f201', 'branch.b.label', ['Answer tools always stop people from learning'], ['the timing here, or to every use']);
    if (tf != null) { S.rise('resp', tf + 0.5, G.resp, { text: markup(L('gate.option.B'), ['always', 'Answer tools']), hl: 1 }); S.pulseOn(['resp'], at('sB_always'), 1.0);
      S.rise('fCard', at('sB_narrow'), G.fCard, { text: L('x.b.narrow'), kind: 'idea' }); S.pulseOn(['full'], at('sB_narrow') + 0.4, 1.0); S.title(a('f201') - 0.2, 'branch.b.note'); }
    tf = branch('d301', 'd302', 'f301', 'branch.c.label', ['If we open the full answer before trying a step', 'may'], ['losing a chance to reason through a step', 'We still need a way to get help']);
    if (tf != null) { S.rise('resp', tf + 0.5, G.resp, { text: markup(L('gate.option.C'), ['If', 'may']), hl: 1 }); S.addLayer('lC', at('sC_risk') + 0.3, 0.2);
      S.rise('fCard', at('sC_keeps'), G.fCard, { text: L('x.c.help'), kind: 'fact' }); S.title(a('f301') - 0.2, 'branch.c.note'); }
    // ---- B04 · c010: every path rejoins; the concern rebuilt from the common explicit proposal ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t); ['lA', 'lC'].forEach((l) => S.dropLayer(l, t)); S.head(t, B(4), null); S.title(t, null);
    S.rise('full', at('s3_ask'), G.cProp, { tag: '' }); S.addLayer('cRel', at('s3_opp'), 0.2); S.rise('pRed', at('s3_opp') + 0.3, G.cRed);
    S.title(a('c010') - 0.2, 'shared.connection');
    // ---- c011: a relationship map (action → possible consequence; both tied to the aim) ----
    t = X0('c011'); S.title(t, null); S.dropLayer('cRel', t);
    S.to('full', t + 0.2, G.m3[0]); S.to('pRed', t + 0.3, G.m3[1]); S.rise('aim', at('s3_directly'), G.m3[2]); S.addLayer('map', at('s3_directly') + 0.4, 0.2);
    S.title(a('c011') - 0.2, 'precision.note'); S.pulseOn(['full', 'pRed', 'aim'], at('s3_precision'), 1.2);
    // ---- c012: accuracy of output vs timing — kept separate ----
    t = X0('c012'); S.title(t, null); S.dropLayer('map', t); S.hide(['full', 'pRed', 'aim'], t);
    S.rise('sepA', at('s3_unverified'), G.sepA); S.rise('tool', at('s3_unverified') + 0.4, G.sepTool); S.addLayer('div', a('c012') - 0.3); S.rise('sepT', at('s3_when'), G.sepT);
    // ---- c013: a first-attempt proposal stays conditional beside the criteria ----
    t = X0('c013'); S.hide(['sepA', 'sepT', 'tool'], t); S.dropLayer('div', t);
    S.rise('first', at('s3_firstAtt'), G.first); S.addLayer('crit', at('s3_firstAtt') + 0.5, 0.2); S.rise('critT', at('s3_firstAtt') + 0.7, G.crit[0]); S.rise('aim', at('s3_firstAtt') + 0.9, G.crit[1]);
    S.title(a('c013') - 0.2, 'scope.choice');
    // ---- B05 · c014 + h102 + c015: one precise concern, privately ----
    t = X0('c014'); S.head(t, B(5), null); X.clearAll(t); S.dropLayer('crit', t); S.title(t, null);
    S.rise('full', at('s3_put'), G.pvProp); S.rise('ctxC', at('s3_put') + 0.3, G.pvCtx); S.rise('pvBlank', at('s3_put') + 0.6, G.pvBlank); S.rise('pvNote', a('c014'), G.pvNote);
    X.hold('h102');
    t = X0('c015'); S.hide(['pvBlank', 'pvNote', 'ctxC'], t); S.title(at('s3_scope') + 0.3, 'review.scope');
    // ---- c016: criteria and unresolved proposals settle; next-section title ----
    t = X0('c016'); S.title(t, null); S.to('full', t + 0.2, G.e2[0]); S.rise('first', t + 0.4, G.e2[1]);
    S.addLayer('nx', at('s3_next') + 1.0); S.rise('next', at('s3_next') + 1.3, G.next); S.pulseOn(['full', 'first'], a('c016'), 1.2);
  }
  global.L04Scenes = { setup };
})(window);
