/*
 * L04.S01 · Locate the Point of Disagreement. Section adapter (tokens, rects, timing by cue starts and anchors).
 * The reason (possible time saving) and the proposed timing stay separate cards; the timing is the point in question and the
 * reason is never erased. The kind of help stays unselected; interpretations sit outside a stated-content boundary;
 * possibilities sit in a labelled frame. Proposals keep their "not adopted or tested" tag.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    prop: R(560, 320, 800, 100, 32), feat: [R(150, 540, 520, 100, 30), R(700, 540, 520, 100, 30), R(1250, 540, 520, 100, 30)],
    frame: R(150, 300, 1620, 540), frameLbl: R(190, 326, 820, 54, 26), ctx: R(190, 404, 820, 80, 28), aim: R(190, 508, 820, 90, 30), tool: R(190, 624, 820, 96, 28),
    prob: [R(1090, 520, 300, 90, 28), R(1420, 520, 300, 90, 28)],
    sLbl: R(1140, 150, 690, 54, 24), sAim: R(1140, 222, 690, 84, 28), sTiming: R(1140, 330, 690, 90, 28),
    quote: R(150, 284, 1620, 140, 32), reason: R(150, 494, 800, 96, 32), timing: R(1060, 494, 710, 96, 30),
    modeQ: R(150, 660, 800, 84, 30), alt: [R(1060, 650, 340, 84, 28), R(1430, 650, 340, 84, 28)],
    tL: R(150, 494, 800, 96, 30), blank: R(1060, 494, 710, 300, 30), stated: R(150, 436, 300, 52, 26),
    laneP: R(150, 440, 800, 44, 28), laneX: R(1060, 440, 710, 44, 28), laneArea: R(1060, 494, 710, 240),
    sModel: R(1140, 150, 690, 56, 26), sTimingD: R(1140, 236, 690, 90, 28), sFirst: R(1140, 386, 690, 90, 28),
    pA: R(150, 494, 760, 110, 30), pB: R(1010, 494, 760, 110, 30),
    bSaid: R(150, 440, 800, 44, 28), bReason: R(150, 494, 800, 96, 32), unsaid: R(1060, 494, 710, 110, 28),
    possF: R(150, 440, 1620, 380), possH: R(190, 458, 820, 54, 26), path: [R(190, 560, 760, 110, 30), R(1000, 560, 730, 110, 30)],
    cAim: R(150, 330, 800, 90, 30), cTool: R(150, 560, 800, 96, 28), cA: R(1060, 330, 710, 96, 30), cB: R(1060, 476, 710, 96, 30),
    focus: [R(150, 460, 520, 76, 28), R(700, 460, 520, 76, 28), R(1250, 460, 520, 76, 28)], pblank: R(150, 580, 1620, 240, 30),
    end2: [R(150, 470, 800, 100, 32), R(1060, 470, 710, 100, 30)], next: R(560, 690, 800, 96, 30), timingC: R(560, 470, 800, 100, 32)
  };

  function setup(E, ctx) {
    const K = global.L04Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('frame', G.frame, 'ctx frame', '', 'token.default'); tok('possF', G.possF, 'ctx frame', '', 'token.default'); tok('laneArea', G.laneArea, 'note unobserved', '', 'token.note'); // containers first
    tok('prop', G.prop, 'proposal', L('x.proposal'), 'token.step');
    tok('f1', G.feat[0], 'step', L('x.feat.when'), 'token.step'); tok('f2', G.feat[1], 'step', L('x.feat.kind'), 'token.step'); tok('f3', G.feat[2], 'step', L('x.feat.why'), 'token.step');
    tok('frameLbl', G.frameLbl, 'framehead', L('x.fictional'), 'token.frame'); tok('ctxC', G.ctx, 'chipcard', L('task.context'), 'token.chip');
    tok('aim', G.aim, 'goal', L('task.aim'), 'token.step'); tok('tool', G.tool, 'step plan', L('tool.state'), 'token.step');
    tok('p1', G.prob[0], 'step', L('x.prob1'), 'token.step'); tok('p2', G.prob[1], 'step', L('x.prob2'), 'token.step');
    tok('quote', G.quote, 'quote speaker', markup(L('quote.maya'), ['can save time', 'as soon as a problem becomes difficult']), 'token.quote', { who: 1, spk: 'maya' });
    tok('reason', G.reason, 'idea reason', L('reason.time'), 'token.step'); tok('timing', G.sTiming, 'proposal', L('proposal.timing'), 'token.step', { tag: 'plan.state' });
    tok('modeQ', G.modeQ, 'question', L('mode.question'), 'token.question', { tag: 'mode.state' });
    tok('hint', G.alt[0], 'step plan', L('x.hint'), 'token.step'); tok('full', G.alt[1], 'step plan', L('x.full'), 'token.step');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note'); tok('stated', G.stated, 'chipcard mark', L('x.stated'), 'token.chip');
    tok('laneP', G.laneP, 'colhead', L('x.lane.proposal'), 'token.colhead'); tok('laneX', G.laneX, 'colhead dashed', L('x.lane.person'), 'token.colhead');
    tok('sModel', G.sModel, 'framehead', L('model.label'), 'token.frame'); tok('first', G.sFirst, 'proposal', L('x.firstTry'), 'token.step', { tag: 'plan.state' });
    tok('bSaid', G.bSaid, 'colhead', L('boundary.said'), 'token.colhead'); tok('unsaid', G.unsaid, 'step gap', L('boundary.unsaid'), 'token.step');
    tok('possH', G.possH, 'framehead', L('x.possFrame'), 'token.frame'); tok('path1', G.path[0], 'note', L('x.path1'), 'token.note'); tok('path2', G.path[1], 'note', L('x.path2'), 'token.note');
    tok('fo1', G.focus[0], 'chipcard margin', L('x.f.timing'), 'token.chip'); tok('fo2', G.focus[1], 'chipcard margin', L('x.f.kind'), 'token.chip'); tok('fo3', G.focus[2], 'chipcard margin', L('x.f.reason'), 'token.chip');
    tok('pblank', G.pblank, 'note', L('private.prompt'), 'token.note');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('feat'); [410, 960, 1510].forEach((x, i) => Rx.dline(E, l, 'feat.' + i, `M 960 428 C 960 480, ${x} 480, ${x} 532`, '#B9C5D6')); Rx.qmark(E, l, 'feat.q', 640, 470);
    l = ly('task'); E.icon(l, 'task.clock', 'clock', 1090, 392, 64, '#5D6878'); E.path(l, 'task.rail', 'M 1190 424 L 1700 424', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'task.t0', 'M 1190 406 L 1190 442', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'task.t1', 'M 1700 406 L 1700 442', { stroke: '#B9C5D6', 'stroke-width': 4 });
    l = ly('rt'); Rx.dline(E, l, 'rt.a', 'M 958 542 L 1052 542', '#B9C5D6');
    l = ly('mode'); Rx.dline(E, l, 'mode.a', 'M 958 690 L 1052 690', '#B9C5D6'); Rx.qmark(E, l, 'mode.q', 1005, 664);
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 440 L 1005 800', '#9DB6E0');
    l = ly('sF'); Rx.dline(E, l, 'sF.a', 'M 1485 334 L 1485 378', '#B9C5D6'); Rx.qmark(E, l, 'sF.q', 1525, 356);
    l = ly('cmp'); Rx.dline(E, l, 'cmp.a', 'M 918 549 L 1002 549', '#B9C5D6'); Rx.qmark(E, l, 'cmp.q', 960, 520);
    l = ly('pq'); Rx.qmark(E, l, 'pq.q', 975, 615);
    l = ly('rail2'); E.icon(l, 'rail2.clock', 'clock', 150, 446, 56, '#5D6878'); E.path(l, 'rail2.line', 'M 226 474 L 950 474', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'rail2.t0', 'M 226 458 L 226 490', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'rail2.t1', 'M 950 458 L 950 490', { stroke: '#B9C5D6', 'stroke-width': 4 });
    l = ly('nx'); Rx.dline(E, l, 'nx.a', 'M 960 600 L 960 682', '#9DB6E0'); Rx.head(E, l, 'nx.h', 960, 690, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L04.S01.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: one proposal, several features; one difference unresolved ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('prop', at('s1_help'), G.prop);
    S.addLayer('feat', at('s1_help') + 0.5, 0.15); ['f1', 'f2', 'f3'].forEach((id, i) => S.rise(id, at('s1_help') + 0.7 + i * 0.2, G.feat[i]));
    S.title(a('c001') - 0.2, 'opening.focus'); S.pulseOn(['f1'], a('c001'), 1.2);
    // ---- c002: the fictional planning frame before the tool ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('feat', t); S.title(t, null);
    S.rise('frame', t + 0.2, G.frame); S.rise('frameLbl', at('s1_imagine'), G.frameLbl); S.rise('ctxC', at('s1_imagine') + 0.4, G.ctx); S.addLayer('task', at('s1_imagine') + 0.7, 0.1);
    S.rise('p1', at('s1_twoProb'), G.prob[0]); S.rise('p2', at('s1_twoProb') + 0.2, G.prob[1]); S.rise('aim', a('c002'), G.aim);
    S.rise('tool', at('s1_tool'), G.tool); S.pulseOn(['tool'], at('s1_unverified'), 1.2);
    // ---- d001 · Maya: her proposal, visibly unadopted ----
    t = X0('d001'); S.head(t, null, null); S.hide(['frame', 'ctxC', 'tool', 'p1', 'p2'], t); S.dropLayer('task', t);
    S.to('frameLbl', t + 0.1, G.sLbl); S.to('aim', t + 0.18, G.sAim);
    X.line('d001', 'propose:learner', ['can save time', 'as soon as a problem becomes difficult']); S.rise('timing', a('d001'), G.sTiming);
    // ---- c003: reason vs proposed timing; planning only ----
    t = X0('c003'); X.roomOut(t); S.hide(['frameLbl', 'aim'], t); S.head(t + 0.1, B(1), null);
    S.to('timing', t + 0.1, G.timing); S.rise('quote', t + 0.6, G.quote, { hl: 1 }); S.rise('reason', at('s1_benefit'), G.reason); S.pulseOn(['timing'], a('c003'), 1.0);
    S.pulseOn(['timing'], at('s1_noSession'), 1.2);
    // ---- B02 · c004: value the reason, question the timing (the reason stays) ----
    t = X0('c004'); S.head(t, B(2), null); S.addLayer('rt', at('s1_value')); S.pulseOn(['reason'], at('s1_value'), 1.0); S.pulseOn(['timing'], a('c004'), 1.2);
    S.title(a('c004') - 0.2, 'difference.note');
    // ---- c005: the kind of help is unspecified; two unselected alternatives ----
    t = X0('c005'); S.title(t, null); S.rise('modeQ', at('s1_notSpec'), G.modeQ); S.addLayer('mode', at('s1_either') - 0.2);
    S.rise('hint', at('s1_either'), G.alt[0]); S.rise('full', at('s1_either') + 0.2, G.alt[1]); S.pulseOn(['modeQ'], a('c005'), 1.2);
    // ---- c006 + h101: source, timing, open mode question and a blank private note ----
    t = X0('c006'); S.hide(['reason', 'hint', 'full'], t); S.dropLayer('rt', t); S.dropLayer('mode', t);
    S.to('timing', t + 0.2, G.tL); S.rise('blank', at('s1_privately'), G.blank);
    X.hold('h101');
    // ---- c007: stated vs open; two context-dependent options ----
    t = X0('c007'); S.hide(['blank'], t); S.rise('stated', at('s1_explicit'), G.stated); S.pulseOn(['timing'], at('s1_explicit'), 1.0); S.pulseOn(['modeQ'], at('s1_kindNot'), 1.0);
    S.title(at('s1_directly') - 0.2, 'response.options');
    // ---- B03 · c008: about the proposal vs about the person (no identities assigned) ----
    t = X0('c008'); S.head(t, B(3), null); S.title(t, null); S.hide(['stated', 'modeQ', 'quote'], t);
    S.rise('laneP', at('s1_respectful'), G.laneP); S.to('timing', at('s1_respectful') + 0.2, G.tL); S.addLayer('div', at('s1_judging') - 0.3);
    S.rise('laneX', at('s1_judging'), G.laneX); S.rise('laneArea', at('s1_judging') + 0.2, G.laneArea); S.title(a('c008') - 0.2, 'direct.note');
    // ---- d002 · You: one possible direct disagreement; the alternative is another unadopted proposal ----
    t = X0('d002'); S.head(t, null, null); S.title(t, null); S.hide(['laneP', 'laneX', 'laneArea'], t); S.dropLayer('div', t);
    S.rise('sModel', t + 0.3, G.sModel); S.to('timing', t + 0.2, G.sTimingD);
    X.line('d002', 'explain:maya', ['difficulty alone the trigger', 'try a step ourselves first'], { headFirst: true });
    S.addLayer('sF', at('s1_tryStep') - 0.2); S.rise('first', at('s1_tryStep'), G.sFirst);
    // ---- c009: two timing proposals, comparison still needed ----
    t = X0('c009'); X.roomOut(t); S.hide(['sModel'], t); S.dropLayer('sF', t); S.head(t + 0.1, B(3), null);
    S.to('timing', t + 0.2, G.pA); S.to('first', t + 0.3, G.pB); S.addLayer('cmp', t + 0.9);
    S.title(a('c009') - 0.2, 'model.scope'); S.pulseOn(['first'], at('s1_firstAtt'), 1.2);
    // ---- B04 · c010: stated reason inside the boundary; a hidden motive outside, unestablished ----
    t = X0('c010'); S.head(t, B(4), null); S.title(t, null); S.hide(['timing', 'first'], t); S.dropLayer('cmp', t);
    S.rise('bSaid', t + 0.3, G.bSaid); S.rise('reason', at('s1_concerns') - 0.6, G.bReason); S.addLayer('div', at('s1_cannot'));
    S.rise('unsaid', at('s1_cannot') + 0.3, G.unsaid); S.pulseOn(['reason'], at('s1_concerns'), 1.0); S.pulseOn(['unsaid'], a('c010'), 1.0);
    // ---- c011: a labelled possibility frame with two unresolved paths ----
    t = X0('c011'); S.hide(['bSaid', 'reason', 'unsaid'], t); S.dropLayer('div', t);
    S.rise('possF', t + 0.3, G.possF); S.rise('possH', t + 0.5, G.possH); S.rise('path1', at('s1_support'), G.path[0]); S.rise('path2', at('s1_lessRoom'), G.path[1]); S.addLayer('pq', at('s1_lessRoom') + 0.4);
    S.title(a('c011') - 0.2, 'scope.learning');
    // ---- c012: the aim and the time rail beside the two proposals; verification unresolved ----
    t = X0('c012'); S.title(t, null); S.hide(['path1', 'path2'], t); S.hide(['possH'], t + M.cut); S.hide(['possF'], t + M.cut); S.dropLayer('pq', t);
    S.rise('aim', at('s1_task'), G.cAim); S.addLayer('rail2', at('s1_task') + 0.4, 0.1); S.rise('tool', at('s1_limited'), G.cTool);
    S.rise('timing', at('s1_task') + 0.6, G.cA); S.rise('first', at('s1_task') + 0.8, G.cB); S.title(a('c012') - 0.2, 'task.check');
    // ---- B05 · c013 + h102 + c014: optional focus labels, a blank private area ----
    t = X0('c013'); S.head(t, B(5), null); X.clearAll(t); S.dropLayer('rail2', t); S.title(t, null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('fo1', at('s1_timing'), G.focus[0]); S.rise('fo2', at('s1_kind'), G.focus[1]); S.rise('fo3', at('s1_reason'), G.focus[2]);
    S.rise('pblank', at('s1_form'), G.pblank);
    X.hold('h102');
    t = X0('c014'); S.hide(['pblank', 'fo1', 'fo2', 'fo3'], t); S.rise('timing', at('s1_tried'), G.timingC); S.title(a('c014') - 0.2, 'review.question');
    // ---- B06 · c015: reason and timing settle as distinct cards; next-section title, no navigation ----
    t = X0('c015'); S.head(t, B(6), null); X.clearAll(t); S.title(t, null);
    S.rise('reason', t + 0.3, G.end2[0]); S.place('timing', t + 0.35, G.end2[1]); S.pulseOn(['reason'], at('s1_seriously'), 1.0);
    S.addLayer('nx', a('c015') - 0.3); S.rise('next', a('c015'), G.next);
  }
  global.L04Scenes = { setup };
})(window);
