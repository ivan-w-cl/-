/*
 * L03.S05 · Respond to the Concern Within the Task. Section adapter (tokens, rects, timing by cue starts and anchors).
 * The help requests appear only as a schematic inside an "If" frame (icons, no participants waiting). Proposals stay dashed
 * and untried; the counterfactual changes sit in a separate lane headed "Not the actual plan"; the private area is blank
 * and the model question sits beside it, linked to the unresolved case by a neutral line (no solved badge).
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    stepC: R(560, 320, 800, 100, 32), partial: R(250, 560, 620, 90, 30), open: R(1050, 560, 620, 90, 30),
    time: R(150, 494, 390, 72, 28), staff: R(560, 494, 390, 72, 28), stepR: R(1060, 494, 710, 96, 30),
    sFrame: R(1120, 132, 730, 450), sIfHead: R(1140, 148, 690, 54, 24), sLimit: R(1140, 476, 690, 70, 26),
    quote: R(150, 284, 1620, 140, 32), support: R(150, 494, 800, 96, 32), remaining: R(1060, 494, 710, 96, 32),
    helpQ: R(560, 470, 800, 100, 32), cand: [R(150, 660, 620, 84, 28), R(1150, 660, 620, 84, 28)],
    remL: R(150, 494, 800, 96, 32), nextSlot: R(1060, 494, 710, 96, 30),
    sCheck: R(1140, 160, 690, 84, 28), sTime: R(1140, 260, 690, 70, 26), sEarly: R(1140, 470, 690, 84, 28),
    pCheck: R(150, 320, 800, 90, 30), scShared: R(150, 494, 800, 96, 30), scEarly: R(1060, 494, 710, 96, 30), qWait: R(1060, 624, 710, 90, 28), qSignal: R(1060, 734, 710, 90, 28),
    cPeople: R(150, 330, 800, 90, 30), cTry: R(150, 440, 800, 90, 30), cfFrame: R(1040, 300, 750, 330), cfHead: R(1070, 318, 690, 54, 24), cf1: R(1070, 400, 690, 90, 28), cf2: R(1070, 510, 690, 90, 28), cChange: R(1060, 680, 710, 100, 28),
    uCase: R(150, 380, 800, 96, 30), uQ: R(150, 500, 800, 96, 30), blank: R(1060, 300, 710, 380, 30),
    sModel: R(1140, 150, 690, 56, 26), blank2: R(1060, 300, 710, 210, 30), model: R(1060, 580, 710, 170, 30),
    endCase: R(560, 470, 800, 96, 32), revise: R(1250, 690, 520, 72, 26)
  };

  function setup(E, ctx) {
    const K = global.L03Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('sFrame', G.sFrame, 'ctx frame', '', 'token.default'); tok('cfFrame', G.cfFrame, 'ctx frame', '', 'token.default'); // containers first
    tok('step', G.stepC, 'proposal', L('x.stepCard'), 'token.step', { tag: '' });
    tok('partial', G.partial, 'idea', L('status.partial'), 'token.idea'); tok('open', G.open, 'note', L('status.open'), 'token.note');
    tok('time', G.time, 'chipcard', L('task.time'), 'token.chip'); tok('staff', G.staff, 'chipcard', L('task.staff'), 'token.chip');
    tok('ifHead', G.sIfHead, 'framehead', L('concern.if'), 'token.frame'); tok('limit', G.sLimit, 'chipcard', L('concern.limit'), 'token.chip');
    tok('quote', G.quote, 'quote speaker', markup(E.cueText('L03.S05.d001'), ['might help', 'if several pairs need help at once']), 'token.quote', { who: 1, spk: 'noah' });
    tok('support', G.support, 'idea reason', L('meaning.support'), 'token.step'); tok('remaining', G.remaining, 'concern', L('meaning.remaining'), 'token.step');
    tok('helpQ', G.helpQ, 'question', L('question.help'), 'token.question');
    tok('cand1', G.cand[0], 'step plan', L('response.clear'), 'token.step'); tok('cand2', G.cand[1], 'step plan', L('response.practice'), 'token.step');
    tok('nextSlot', G.nextSlot, 'proposal next', L('next.label'), 'token.step');
    tok('check', G.sCheck, 'proposal', L('proposal.check'), 'token.step'); tok('ptime', G.sTime, 'note', L('proposal.time'), 'token.note');
    tok('early', G.sEarly, 'question', L('question.early'), 'token.question');
    tok('scShared', G.scShared, 'idea', L('scope.shared'), 'token.idea'); tok('scEarly', G.scEarly, 'concern', L('scope.early'), 'token.step');
    tok('qWait', G.qWait, 'question', L('question.wait'), 'token.question'); tok('qSignal', G.qSignal, 'question', L('question.signal'), 'token.question');
    tok('cPeople', G.cPeople, 'fact', L('constraint.people'), 'token.step'); tok('cTry', G.cTry, 'goal', L('constraint.try'), 'token.step');
    tok('cfHead', G.cfHead, 'framehead', L('x.cfLane'), 'token.frame'); tok('cf1', G.cf1, 'step changed', L('x.cf.staff'), 'token.step'); tok('cf2', G.cf2, 'step changed', L('x.cf.demo'), 'token.step');
    tok('cChange', G.cChange, 'note', L('constraint.change'), 'token.note');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('sModel', G.sModel, 'framehead', L('model.label'), 'token.frame'); tok('model', G.model, 'example', E.cueText('L03.S05.d004'), 'token.summary', { tag: 'model.label' });
    tok('revise', G.revise, 'chipcard margin', L('x.revise'), 'token.chip');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('st'); Rx.dline(E, l, 'st.a', 'M 860 428 C 860 490, 560 490, 560 552', '#9DB6E0'); Rx.dline(E, l, 'st.b', 'M 1060 428 C 1060 490, 1360 490, 1360 552', '#B9C5D6'); Rx.qmark(E, l, 'st.q', 1260, 500);
    l = ly('rail'); E.icon(l, 'rail.clock', 'clock', 150, 610, 56, '#5D6878'); E.path(l, 'rail.line', 'M 230 638 L 950 638', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'rail.t0', 'M 230 622 L 230 654', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'rail.t1', 'M 950 622 L 950 654', { stroke: '#B9C5D6', 'stroke-width': 4 });
    l = ly('reqs'); [1220, 1440, 1660].forEach((x, i) => { E.icon(l, 'reqs.p' + i, 'people', x - 40, 236, 80, '#5D6878'); Rx.qmark(E, l, 'reqs.q' + i, x + 50, 236); });
    E.icon(l, 'reqs.staff', 'staff', 1445, 360, 72, '#5D6878'); [1220, 1660].forEach((x, i) => Rx.dline(E, l, 'reqs.l' + i, `M ${x} 330 L ${x < 1480 ? 1440 : 1520} 392`, '#B9C5D6'));
    l = ly('cand'); Rx.qmark(E, l, 'cand.q', 960, 620);
    l = ly('nxt'); Rx.dline(E, l, 'nxt.a', 'M 958 542 L 1042 542', '#9DB6E0'); Rx.head(E, l, 'nxt.h', 1050, 542, 'right', '#9DB6E0');
    l = ly('sRail'); E.icon(l, 'sRail.clock', 'clock', 1140, 350, 56, '#5D6878'); E.path(l, 'sRail.line', 'M 1214 378 L 1820 378', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'sRail.t0', 'M 1214 362 L 1214 394', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'sRail.t1', 'M 1820 362 L 1820 394', { stroke: '#B9C5D6', 'stroke-width': 4 });
    E.dashed(l, 'sRail.pause', 'M 1500 352 L 1500 404', '#356CC8');
    l = ly('split'); Rx.dline(E, l, 'split.a', 'M 550 418 L 550 482', '#9DB6E0'); Rx.head(E, l, 'split.h', 550, 488, 'down', '#9DB6E0');
    l = ly('mq'); Rx.dline(E, l, 'mq.a', 'M 958 548 C 1010 548, 1000 660, 1052 660', '#B9C5D6');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L03.S05.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: the proposed step card, possible support vs still to examine ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('step', X0('c001') + 0.5, G.stepC);
    S.addLayer('st', at('s05_connect') + 0.3, 0.2); S.rise('partial', at('s05_connect') + 0.5, G.partial); S.rise('open', at('s05_leave'), G.open);
    S.pulseOn(['open'], a('c001'), 1.2);
    // ---- c002: constraints around the same proposal; untried, unadopted ----
    let t = X0('c002'); S.hide(['partial', 'open'], t); S.dropLayer('st', t);
    S.to('step', t + 0.2, G.stepR); S.rise('time', at('s05_thirty'), G.time); S.rise('staff', at('s05_facil'), G.staff); S.addLayer('rail', at('s05_thirty') + 0.3, 0.1);
    S.put('step', a('c002') - 0.3, M.focus, { tag: 'proposal.status' }); S.pulseOn(['step'], a('c002'), 1.2);
    // ---- d001 · Noah: a conditional concern, as a schematic inside an "If" frame ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t); S.dropLayer('rail', t);
    X.line('d001', 'explain:learner', ['might help', 'if several pairs need help at once', 'may not reach everyone']);
    S.rise('sFrame', at('s05_mightHelp') + 0.6, G.sFrame); S.rise('ifHead', a('d001') - 0.3, G.sIfHead); S.addLayer('reqs', a('d001'), 0.12);
    S.rise('limit', at('s05_reach'), G.sLimit);
    // ---- B02 · c003: "might help" kept with the conditional limit ----
    t = X0('c003'); X.roomOut(t); S.hide(['sFrame', 'ifHead', 'limit'], t); S.dropLayer('reqs', t); S.head(t + 0.1, B(2), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 0 }); S.put('quote', t + 0.9, M.focus, { hl: 1 });
    S.rise('support', at('s05_useless') + 0.3, G.support); S.rise('remaining', at('s05_situation'), G.remaining); S.pulseOn(['remaining'], a('c003'), 1.2);
    // ---- c004 + h101: two background points near, not connected to, the access-to-help question ----
    t = X0('c004'); S.hide(['support'], t); S.hide(['remaining'], t + 0.1);
    S.rise('helpQ', a('c004') - 0.4, G.helpQ); S.rise('cand1', at('s05_veryClear'), G.cand[0]); S.rise('cand2', at('s05_repeating'), G.cand[1]); S.addLayer('cand', at('s05_repeating') + 0.5);
    S.pulseOn(['helpQ'], a('c004'), 1.2);
    X.hold('h101');
    // ---- B03 · c005: a possible next step beside the concern ----
    t = X0('c005'); S.head(t, B(3), null); X.clearAll(t); S.dropLayer('cand', t);
    S.rise('remaining', t + 0.3, G.remL); S.addLayer('nxt', at('s05_targeted')); S.rise('nextSlot', at('s05_targeted') + 0.3, G.nextSlot); S.pulseOn(['nextSlot'], a('c005'), 1.2);
    // ---- d002 · You: a shared check after the first try, inside the 30-minute rail (no length invented); d003 · Maya ----
    t = X0('d002'); S.head(t, null, null); X.clearAll(t); S.dropLayer('nxt', t);
    X.line('d002', 'propose:maya', ['pause after the first try', 'collect questions'], {}); S.rise('check', at('s05_pause'), G.sCheck); S.rise('ptime', a('d002'), G.sTime); S.addLayer('sRail', a('d002') + 0.3, 0.1);
    t = X0('d003'); X.line('d003', 'ask:learner', ['That could help with a shared question', 'before the pause']); S.rise('early', a('d003'), G.sEarly);
    // ---- c006: split: shared difficulty (linked to the proposal) vs earlier individual difficulty ----
    t = X0('c006'); X.roomOut(t); S.hide(['ptime', 'early'], t); S.dropLayer('sRail', t); S.head(t + 0.1, B(3), null);
    S.to('check', t + 0.2, G.pCheck); S.rise('scShared', at('s05_common'), G.scShared); S.addLayer('split', at('s05_common') + 0.4);
    S.rise('scEarly', at('s05_different'), G.scEarly); S.pulseOn(['scShared', 'scEarly'], a('c006'), 1.2);
    // ---- c007: the open questions under the earlier-help case ----
    t = X0('c007'); S.pulseOn(['scEarly'], at('s05_precisely'), 1.0); S.rise('qWait', at('s05_waiting'), G.qWait); S.rise('qSignal', at('s05_signal'), G.qSignal);
    // ---- B04 · c008: the actual task vs a separate counterfactual lane ----
    t = X0('c008'); S.head(t, B(4), null); X.clearAll(t); S.dropLayer('split', t);
    S.rise('cPeople', at('s05_visible'), G.cPeople); S.rise('cTry', at('s05_visible') + 0.3, G.cTry); S.addLayer('rail', at('s05_visible') + 0.6, 0.1);
    S.rise('cfFrame', at('s05_another') - 0.3, G.cfFrame); S.rise('cfHead', at('s05_another') - 0.1, G.cfHead); S.rise('cf1', at('s05_another'), G.cf1); S.rise('cf2', at('s05_fill'), G.cf2);
    S.pulseOn(['cPeople', 'cTry'], a('c008'), 1.2);
    // ---- c009: a conditional "check explicitly" note, separate from the unchanged task ----
    t = X0('c009'); S.rise('cChange', at('s05_allowed'), G.cChange); S.pulseOn(['cChange'], at('s05_allowed') + 0.5, 1.0); S.pulseOn(['cPeople'], a('c009'), 1.0);
    // ---- B05 · c010 + h102: the exact unresolved case and a blank question area ----
    t = X0('c010'); S.head(t, B(5), null); X.clearAll(t); S.dropLayer('rail', t);
    S.rise('scEarly', at('s05_lookAgain'), G.uCase); S.rise('early', at('s05_lookAgain') + 0.3, G.uQ); S.rise('blank', at('s05_privately'), G.blank);
    X.hold('h102');
    // ---- d004 · You: one possible question (a model, separate from the blank area) ----
    t = X0('d004'); S.head(t, null, null); X.clearAll(t);
    S.rise('sModel', t + 0.3, G.sModel); X.line('d004', 'ask:noah', ['before we stop for questions'], { headFirst: true });
    // ---- c011: the model beside the blank area, linked to the case by a neutral line ----
    t = X0('c011'); X.roomOut(t); S.hide(['sModel'], t); S.head(t + 0.1, B(5), null);
    S.rise('scEarly', t + 0.2, G.uCase); S.rise('early', t + 0.3, G.uQ); S.rise('blank', t + 0.4, G.blank2); S.rise('model', t + 0.6, G.model);
    S.addLayer('mq', at('s05_stays')); S.pulseOn(['early', 'model'], at('s05_stays'), 1.2); S.title(a('c011') - 0.2, 'review.check');
    // ---- c012: the unresolved issue settles; understanding can be revised ----
    t = X0('c012'); X.clearAll(t, ['scEarly']); S.dropLayer('mq', t); S.title(t + 0.1, 'recap');
    S.to('scEarly', t + 0.3, G.endCase); S.rise('revise', at('s05_updating'), G.revise); S.pulseOn(['scEarly'], at('s05_limits'), 1.0);
  }
  global.L03Scenes = { setup };
})(window);
