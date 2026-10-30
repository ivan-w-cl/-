/*
 * L06.S05 · Reflect and Answer the Question Asked. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Past case actions ("Already happened") and the reflection ("Next time / Proposed") sit in separate labelled regions;
 * the future list is never shown being made, adopted or tested. All follow-up questions belong to a separate "Later
 * practice conversation" frame, with the remembered facts in a reference panel. Blame stays in an unsupported area.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    nD: R(150, 470, 760, 110, 30), nF: R(1010, 470, 760, 110, 30),
    caseB: R(150, 290, 620, 50, 24), hP: R(150, 380, 800, 44, 28), diff: R(150, 434, 800, 84, 28), conf: R(150, 534, 800, 90, 26), done: R(150, 676, 800, 84, 28),
    hF: R(1060, 380, 710, 44, 28), fut: R(1060, 434, 710, 100, 28),
    ref: [R(150, 380, 760, 76, 26), R(150, 470, 760, 84, 24), R(150, 568, 760, 76, 26)],
    cF: R(960, 360, 810, 400), cH: R(990, 376, 560, 50, 24), role: R(990, 450, 750, 66, 26), bound: R(990, 536, 750, 66, 26),
    sConv: R(1140, 140, 690, 50, 24), sRole: R(1140, 204, 690, 54, 26), sQ: R(1140, 274, 690, 84, 28), sA: R(1140, 378, 690, 100, 26),
    sB: [R(1140, 378, 690, 84, 26), R(1140, 478, 690, 84, 26), R(1140, 578, 690, 76, 26)],
    qL: R(150, 420, 800, 90, 30), aL: R(150, 540, 1620, 110, 30),
    bL: R(150, 470, 760, 110, 30), pR: R(1010, 470, 760, 110, 30),
    fact: R(150, 470, 800, 100, 30), uF: R(1040, 400, 730, 300), uH: R(1070, 416, 560, 50, 24), uns: R(1070, 490, 670, 100, 28),
    futC: R(150, 440, 800, 100, 28), reason: R(1060, 440, 710, 100, 28), ev: R(560, 640, 800, 84, 28),
    rq: R(150, 400, 800, 100, 30), rD: R(150, 540, 800, 76, 26), rF: R(150, 636, 800, 90, 26), blank: R(1060, 400, 710, 380, 30),
    sModel: R(1140, 140, 690, 56, 26), sMF: R(1140, 220, 690, 90, 28), sML: R(1140, 330, 690, 90, 28),
    endQ: R(560, 470, 800, 100, 30)
  };

  function setup(E, ctx) {
    const K = global.L06Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('cF', G.cF, 'ctx frame', '', 'token.default'); tok('uF', G.uF, 'ctx frame', '', 'token.default'); // containers first
    tok('nD', G.nD, 'fact', L('x.node.diff'), 'token.step'); tok('nF', G.nF, 'proposal', L('x.node.future'), 'token.step');
    tok('caseL', G.caseB, 'framehead', L('case.label'), 'token.frame');
    tok('hP', G.hP, 'colhead', L('x.past'), 'token.colhead'); tok('hF', G.hF, 'colhead dashed', L('x.future'), 'token.colhead');
    tok('diff', G.diff, 'chipcard mark', L('case.difficulty'), 'token.chip'); tok('conf', G.conf, 'fact', L('case.confirmed'), 'token.step', { tag: 'x.summary' }); tok('done', G.done, 'idea', L('case.completed'), 'token.idea');
    tok('fut', G.fut, 'proposal', L('future.idea'), 'token.step', { tag: 'future.status' });
    tok('cH', G.cH, 'framehead', L('conversation.label'), 'token.frame'); tok('role', G.role, 'chipcard', L('maya.role'), 'token.chip'); tok('bound', G.bound, 'chipcard margin', L('conversation.boundary'), 'token.chip');
    tok('qF', G.sQ, 'question', L('question.focus'), 'token.question'); tok('aF', G.sA, 'proposal', L('answer.future'), 'token.step', { tag: 'answer.status' });
    tok('ansAll', G.aL, 'example', E.cueText('L06.S05.d002'), 'token.summary', { tag: 'analysis.time' });
    tok('qR', G.sQ, 'question', L('question.reason'), 'token.question');
    tok('aB', G.sB[0], 'fact', L('answer.basis'), 'token.step'); tok('aP', G.sB[1], 'proposal', L('answer.proposal'), 'token.step'); tok('aL', G.sB[2], 'step gap', L('answer.limit'), 'token.step');
    tok('rFact', G.fact, 'fact', L('reflection.fact'), 'token.step'); tok('uH', G.uH, 'framehead', L('x.unsupArea'), 'token.frame'); tok('uns', G.uns, 'step gap', L('reflection.unsupported'), 'token.step');
    tok('fReason', G.reason, 'note', L('future.reason'), 'token.note'); tok('fEv', G.ev, 'step gap', L('future.evidence'), 'token.step');
    tok('rq', G.rq, 'question', L('reflection.question'), 'token.question'); tok('blank', G.blank, 'note', '', 'token.note');
    tok('sModel', G.sModel, 'framehead', L('model.label'), 'token.frame'); tok('mF', G.sMF, 'proposal', L('model.future'), 'token.step'); tok('mL', G.sML, 'step gap', L('model.limit'), 'token.step');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('link'); Rx.dline(E, l, 'link.a', 'M 918 525 L 1002 525', '#9DB6E0'); Rx.head(E, l, 'link.h', 1008, 525, 'right', '#9DB6E0');
    l = ly('pf'); Rx.dline(E, l, 'pf.a', 'M 958 476 C 1000 476, 1010 484, 1052 484', '#9DB6E0'); Rx.qmark(E, l, 'pf.q', 1005, 452);
    l = ly('rel'); Rx.dline(E, l, 'rel.a', 'M 918 525 L 1002 525', '#9DB6E0'); Rx.head(E, l, 'rel.h', 1008, 525, 'right', '#9DB6E0');
    l = ly('cond'); Rx.dline(E, l, 'cond.a', 'M 958 490 L 1052 490', '#9DB6E0'); Rx.qmark(E, l, 'cond.q', 1005, 464);
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 380 L 1005 760', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L06.S05.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: an established difficulty linked to a possible future change ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('nD', at('s5_useful'), G.nD); S.addLayer('link', at('s5_keep') - 0.2); S.rise('nF', at('s5_keep'), G.nF);
    S.title(a('c001') - 0.2, 'reflection.link');
    // ---- c002: what already happened (F03–F06), confirmation as indirect narration ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('link', t); S.title(t, null);
    S.rise('caseL', at('s5_case'), G.caseB); S.rise('hP', at('s5_case') + 0.4, G.hP); S.rise('diff', at('s5_case') + 0.7, G.diff);
    S.rise('conf', at('s5_conf'), G.conf); S.rise('done', at('s5_changed'), G.done); S.pulseOn(['hP'], a('c002'), 1.0);
    // ---- c003 + h101: the reflection in a separate "Next time / Proposed" region ----
    t = X0('c003'); S.rise('hF', at('s5_forward'), G.hF); S.addLayer('div', at('s5_forward') + 0.2); S.rise('fut', at('s5_forward') + 0.5, G.fut);
    S.pulseOn(['fut'], a('c003'), 1.2);
    X.hold('h101');
    // ---- B02 · c004: the later practice conversation, facts in a reference panel ----
    t = X0('c004'); S.head(t, B(2), null); S.hide(['hP', 'hF', 'conf', 'fut'], t); S.dropLayer('div', t);
    S.to('diff', t + 0.2, G.ref[0]); S.to('done', t + 0.3, G.ref[2]);
    S.rise('cF', at('s5_later'), G.cF); S.rise('cH', at('s5_later') + 0.2, G.cH); S.rise('role', at('s5_later') + 0.6, G.role); S.rise('bound', at('s5_setting'), G.bound);
    // ---- d001 + d002 · Maya asks; the case participant answers with a future proposal ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t); S.rise('cH', t + 0.3, G.sConv); S.rise('role', t + 0.4, G.sRole);
    X.line('d001', 'ask:learner', ['next time'], { headFirst: true }); S.rise('qF', a('d001') - 0.3, G.sQ);
    t = X0('d002'); X.line('d002', 'propose:maya', ['Next time, I would', 'shared list of room names earlier']); S.rise('aF', a('d002') + 0.6, G.sA);
    // ---- c005: the answer addresses the current question; future, not achievement ----
    t = X0('c005'); X.roomOut(t); X.clearAll(t); S.head(t + 0.1, B(2), null);
    S.rise('qF', t + 0.3, G.qL); S.rise('ansAll', at('s5_direct'), G.aL); S.title(at('s5_direct') + 0.6, 'analysis.focus'); S.pulseOn(['ansAll'], at('s5_locates'), 1.2);
    // ---- B03 · d003 + d004 · why this change: basis, proposal, limit ----
    t = X0('d003'); S.head(t, null, null); S.title(t, null); X.clearAll(t); S.rise('cH', t + 0.3, G.sConv); S.rise('role', t + 0.4, G.sRole);
    X.line('d003', 'ask:learner', ['in this experience'], { headFirst: true }); S.rise('qR', a('d003') - 0.3, G.sQ);
    t = X0('d004'); X.line('d004', 'explain:maya', ['different names for the same room', 'agreeing the names', 'We have not put that change into practice']);
    S.rise('aB', at('s5_mapSched') + 0.5, G.sB[0]); S.rise('aP', at('s5_propose') + 0.5, G.sB[1]); S.rise('aL', a('d004'), G.sB[2]);
    // ---- c006: the established mismatch → a reason to consider the proposal (not proof) ----
    t = X0('c006'); X.roomOut(t); X.clearAll(t); S.head(t + 0.1, B(3), null);
    S.rise('aB', at('s5_starts'), G.bL); S.addLayer('rel', at('s5_starts') + 0.5); S.rise('aP', at('s5_starts') + 0.8, G.pR, { tag: 'focus.limit' });
    S.title(a('c006') - 0.2, 'focus.connection');
    // ---- c007: the fact vs an unsupported judgement about a person ----
    t = X0('c007'); S.title(t, null); S.hide(['aB', 'aP'], t); S.dropLayer('rel', t);
    S.rise('rFact', at('s5_differed'), G.fact); S.rise('uF', at('s5_notShow') - 0.3, G.uF); S.rise('uH', at('s5_notShow') - 0.1, G.uH); S.rise('uns', a('c007'), G.uns);
    // ---- c008: a conditional possible benefit; effectiveness unknown ----
    t = X0('c008'); S.hide(['rFact', 'uns'], t); S.hide(['uH', 'uF'], t + M.cut);
    S.rise('fut', at('s5_might'), G.futC); S.addLayer('cond', at('s5_might') + 0.4); S.rise('fReason', at('s5_might') + 0.7, G.reason); S.rise('fEv', at('s5_noLater'), G.ev);
    // ---- B04 · c009 + h102: the original question; optional reference; blank private area ----
    t = X0('c009'); S.head(t, B(4), null); X.clearAll(t); S.dropLayer('cond', t);
    S.rise('rq', at('s5_try'), G.rq); S.rise('caseL', at('s5_fiction'), G.caseB, { text: L('case.label') }); S.rise('diff', at('s5_fiction') + 0.3, G.rD); S.rise('fut', at('s5_fiction') + 0.5, G.rF, { tag: 'future.status' });
    S.rise('blank', at('s5_try') + 0.6, G.blank);
    X.hold('h102');
    // ---- d005 · one fictional model answer, in its own area ----
    t = X0('d005'); S.head(t, null, null); X.clearAll(t);
    S.rise('sModel', t + 0.3, G.sModel); X.line('d005', 'explain:maya', ['I would agree the room names earlier', 'I have not tried that change yet'], { headFirst: true });
    S.rise('mF', at('s5_agree') + 0.6, G.sMF); S.rise('mL', a('d005'), G.sML);
    // ---- c010: answer the focus; keep the evidence boundary ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t); S.head(t + 0.1, B(4), null); S.rise('rq', at('s5_shorter'), G.endQ); S.title(a('c010') - 0.2, 'recap');
  }
  global.L06Scenes = { setup };
})(window);
