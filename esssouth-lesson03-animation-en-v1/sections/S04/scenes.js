/*
 * L03.S04 · Agree and Add Something Relevant. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Same three card identities as S01 (proposal / reason / concern kinds). Supported point = blue idea card with its own
 * heading; the open concern keeps the concern kind and an "open" heading (words as well as colour). Additions are dashed
 * proposals with a status tag; the separate confirmation case sits in its own labelled frame and never changes the main
 * board. The private area stays blank; the model card sits beside it, never inside.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    contrib: R(560, 320, 800, 100, 32), res3: [R(250, 560, 420, 90, 32), R(750, 560, 420, 90, 32), R(1250, 560, 420, 90, 32)],
    goal: R(150, 300, 800, 96, 32), time: R(150, 420, 390, 72, 28), staff: R(560, 420, 390, 72, 28), stateLbl: R(1060, 300, 710, 54, 26), propArea: R(1060, 372, 710, 240),
    side3: [R(1140, 150, 690, 76, 28), R(1140, 246, 690, 76, 28), R(1140, 342, 690, 76, 28)],
    rTop: R(560, 300, 800, 96, 32), yes: R(150, 520, 520, 100, 34), specific: R(760, 500, 1010, 180, 30),
    sReason: R(1140, 236, 690, 80, 28), agreeQ: R(1140, 350, 690, 90, 28),
    hSup: R(150, 440, 800, 44, 28), rL: R(150, 494, 800, 96, 32), agreeL: R(150, 640, 800, 90, 30), hOpen: R(1060, 440, 710, 44, 28), cR: R(1060, 494, 710, 96, 32),
    cTop: R(560, 300, 800, 100, 32), slot: R(560, 520, 800, 140, 30),
    sConcern: R(1140, 160, 690, 80, 28), sCard: R(1140, 290, 690, 84, 28), sQ: R(1140, 440, 690, 84, 28),
    path3: [R(150, 470, 520, 100, 30), R(700, 470, 520, 100, 30), R(1250, 470, 520, 100, 30)], possible: R(700, 620, 520, 84, 26), poster: R(1250, 690, 520, 80, 28),
    cFrame: R(150, 630, 1620, 210), cHead: R(190, 648, 900, 50, 24), cEnough: R(190, 720, 900, 90, 28), cYes: R(1150, 720, 380, 90, 34),
    sPoint: R(150, 620, 800, 96, 30), sWork: R(1060, 620, 710, 96, 30), ex3: [R(150, 752, 520, 66, 26), R(700, 752, 520, 66, 26), R(1250, 752, 520, 66, 26)],
    left3: [R(150, 330, 800, 84, 30), R(150, 434, 800, 84, 30), R(150, 538, 800, 84, 30)], blank: R(1060, 300, 710, 340, 30),
    sModel: R(1140, 150, 690, 56, 26), blank2: R(1060, 300, 710, 210, 30), model: R(1060, 580, 710, 190, 28),
    endConcern: R(560, 470, 800, 100, 32)
  };

  function setup(E, ctx) {
    const K = global.L03Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('propArea', G.propArea, 'note unobserved', '', 'token.note'); tok('cFrame', G.cFrame, 'ctx frame', '', 'token.default'); // containers first
    tok('contrib', G.contrib, 'idea', L('x.contribution'), 'token.idea');
    tok('rConfirm', G.res3[0], 'chipcard', L('resource.confirm'), 'token.chip'); tok('rAsk', G.res3[1], 'chipcard', L('resource.question'), 'token.chip'); tok('rAdd', G.res3[2], 'chipcard', L('resource.add'), 'token.chip');
    tok('goal', G.goal, 'goal', L('task.goal'), 'token.step'); tok('time', G.time, 'chipcard', L('task.time'), 'token.chip'); tok('staff', G.staff, 'chipcard', L('task.staff'), 'token.chip');
    tok('stateLbl', G.stateLbl, 'framehead', L('task.state'), 'token.frame');
    tok('fV', G.side3[0], 'excerpt proposed', L('view.brief'), 'token.step'); tok('fR', G.side3[1], 'idea reason', L('reason.try'), 'token.step'); tok('fC', G.side3[2], 'concern', L('concern.missed'), 'token.step');
    tok('yes', G.yes, 'chipcard', L('agreement.short'), 'token.chip'); tok('specific', G.specific, 'note', L('agreement.specific'), 'token.note');
    tok('agreeQ', G.agreeQ, 'example', L('agreement.quote'), 'token.step');
    tok('hSup', G.hSup, 'colhead', L('agreement.supported'), 'token.colhead'); tok('hOpen', G.hOpen, 'colhead dashed', L('concern.open'), 'token.colhead');
    tok('slot', G.slot, 'note unobserved', L('addition.check'), 'token.note');
    tok('card', G.sCard, 'proposal', L('addition.card'), 'token.step', { tag: 'proposal.status' }); tok('possible', G.possible, 'note', L('addition.possible'), 'token.note');
    tok('qClear', G.sQ, 'question', L('question.clear'), 'token.question');
    tok('poster', G.poster, 'chipcard margin', L('offtopic.poster'), 'token.chip', { tag: 'offtopic.context' });
    tok('cHead', G.cHead, 'framehead', L('confirmation.frame'), 'token.frame'); tok('cEnough', G.cEnough, 'step', L('confirmation.enough'), 'token.step');
    tok('sPoint', G.sPoint, 'question', L('self.point'), 'token.question'); tok('sWork', G.sWork, 'question', L('self.work'), 'token.question');
    tok('ex1', G.ex3[0], 'chipcard margin', L('x.ex.method'), 'token.chip'); tok('ex2', G.ex3[1], 'chipcard margin', L('x.ex.limit'), 'token.chip'); tok('ex3', G.ex3[2], 'chipcard margin', L('x.ex.ask'), 'token.chip');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('sModel', G.sModel, 'framehead', L('model.label'), 'token.frame'); tok('model', G.model, 'example', E.cueText('L03.S04.d005'), 'token.summary', { tag: 'model.label' });
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('res'); [460, 960, 1460].forEach((x, i) => Rx.dline(E, l, 'res.' + i, `M 960 428 C 960 490, ${x} 490, ${x} 552`, '#B9C5D6'));
    l = ly('sAg'); Rx.dline(E, l, 'sAg.a', 'M 1485 324 L 1485 340', '#356CC8'); Rx.head(E, l, 'sAg.h', 1485, 346, 'down', '#356CC8');
    l = ly('ag'); Rx.dline(E, l, 'ag.a', 'M 550 632 L 550 604', '#356CC8'); Rx.head(E, l, 'ag.h', 550, 598, 'up', '#356CC8');
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 440 L 1005 760', '#9DB6E0');
    l = ly('slotL'); Rx.dline(E, l, 'slotL.a', 'M 960 408 L 960 506', '#B9C5D6'); Rx.qmark(E, l, 'slotL.q', 1000, 458);
    l = ly('sPath'); Rx.dline(E, l, 'sPath.a', 'M 1485 248 L 1485 280', '#9DB6E0'); Rx.head(E, l, 'sPath.h', 1485, 286, 'down', '#9DB6E0');
    l = ly('sPathQ'); Rx.dline(E, l, 'sPathQ.a', 'M 1485 412 L 1485 430', '#9DB6E0'); Rx.head(E, l, 'sPathQ.h', 1485, 436, 'down', '#9DB6E0');
    l = ly('path'); Rx.dline(E, l, 'path.a', 'M 678 520 L 686 520', '#9DB6E0'); Rx.head(E, l, 'path.ah', 694, 520, 'right', '#9DB6E0'); Rx.dline(E, l, 'path.b', 'M 1228 520 L 1236 520', '#9DB6E0'); Rx.head(E, l, 'path.bh', 1244, 520, 'right', '#9DB6E0');
    l = ly('diag'); [410, 960, 1510].forEach((x, i) => Rx.dline(E, l, 'diag.' + i, `M 1415 724 C 1415 736, ${x} 732, ${x} 744`, '#B9C5D6'));
    l = ly('mdl'); Rx.dline(E, l, 'mdl.a', 'M 958 476 C 1010 476, 1000 640, 1052 640', '#9DB6E0'); Rx.dline(E, l, 'mdl.b', 'M 958 580 C 1000 580, 1010 690, 1052 690', '#9DB6E0');
    l = ly('end'); Rx.qmark(E, l, 'end.q', 1400, 520);
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L03.S04.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: one contribution, three possible resources, none selected ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('contrib', X0('c001') + 0.5, G.contrib);
    S.addLayer('res', at('s04_decide'), 0.15); S.rise('rConfirm', at('s04_decide') + 0.2, G.res3[0]); S.rise('rAsk', at('s04_question'), G.res3[1]); S.rise('rAdd', at('s04_useful'), G.res3[2]);
    S.pulseOn(['rConfirm'], a('c001'), 1.0);
    // ---- c002: the task, its constraints and an open proposal area ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('res', t);
    S.rise('goal', at('s04_want'), G.goal); S.rise('time', at('s04_thirty'), G.time); S.rise('staff', at('s04_facil'), G.staff);
    S.rise('propArea', at('s04_return'), G.propArea); S.rise('stateLbl', a('c002'), G.stateLbl); S.pulseOn(['stateLbl'], a('c002') + 0.4, 1.2);
    // ---- d001 · Noah: suggestion, reason and concern as the S01 card identities ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t);
    X.line('d001', 'propose:learner', ['keep the demonstration brief', 'time to try', 'someone who misses a step could get left behind'], { headFirst: false });
    S.rise('fV', at('s04_brief'), G.side3[0]); S.rise('fR', at('s04_try'), G.side3[1]); S.rise('fC', a('d001'), G.side3[2]);
    // ---- B02 · c003: a plain yes beside an empty specific-point space ----
    t = X0('c003'); X.roomOut(t); S.head(t + 0.1, B(2), null); S.hide(['fV', 'fC'], t); S.to('fR', t + 0.2, G.rTop);
    S.rise('yes', at('s04_yes'), G.yes); S.rise('specific', a('c003') - 0.4, G.specific); S.pulseOn(['specific'], a('c003'), 1.2);
    // ---- d002 · You: agreement linked to the reason only ----
    t = X0('d002'); S.head(t, null, null); S.hide(['yes', 'specific'], t); S.to('fR', t + 0.2, G.sReason);
    X.line('d002', 'agree:noah', ['time to try'], {}); S.addLayer('sAg', a('d002') - 0.2); S.rise('agreeQ', a('d002'), G.agreeQ);
    // ---- c004 + h101: supported point vs open concern (headings say it, not only colour) ----
    t = X0('c004'); X.roomOut(t); S.dropLayer('sAg', t); S.head(t + 0.1, B(2), null);
    S.rise('hSup', t + 0.3, G.hSup); S.to('fR', t + 0.3, G.rL, { kind: 'idea' }); S.to('agreeQ', t + 0.4, G.agreeL); S.addLayer('ag', at('s04_supports'));
    S.addLayer('div', at('s04_notEvery')); S.rise('hOpen', at('s04_concernM') - 0.2, G.hOpen); S.rise('fC', at('s04_concernM'), G.cR);
    S.pulseOn(['fC', 'hOpen'], a('c004'), 1.2);
    X.hold('h101');
    // ---- B03 · c005: the concern in the centre, one open proposal slot ----
    t = X0('c005'); S.head(t, B(3), null); S.hide(['hSup', 'hOpen', 'fR', 'agreeQ'], t); S.dropLayer('ag', t); S.dropLayer('div', t);
    S.to('fC', t + 0.2, G.cTop); S.addLayer('slotL', at('s04_another')); S.rise('slot', at('s04_another') + 0.2, G.slot); S.pulseOn(['slot'], a('c005'), 1.2);
    // ---- d003 · You: a step-card suggestion linked to the concern; d004 · Maya's question ----
    t = X0('d003'); S.head(t, null, null); S.hide(['slot'], t); S.dropLayer('slotL', t); S.to('fC', t + 0.2, G.sConcern);
    X.line('d003', 'propose:maya', ['keep a step card visible', 'check where they are'], {}); S.addLayer('sPath', at('s04_stepCard') - 0.2); S.rise('card', at('s04_stepCard'), G.sCard);
    t = X0('d004'); X.line('d004', 'consider:learner', ['That might help', 'clear enough']); S.addLayer('sPathQ', a('d004') - 0.2); S.rise('qClear', a('d004'), G.sQ);
    // ---- c006: back to the board: concern → possible support → open question ----
    t = X0('c006'); X.roomOut(t); S.dropLayer('sPath', t); S.dropLayer('sPathQ', t); S.head(t + 0.1, B(3), null);
    S.to('fC', t + 0.2, G.path3[0]); S.to('card', t + 0.3, G.path3[1]); S.to('qClear', t + 0.4, G.path3[2]); S.addLayer('path', t + 0.9, 0.2);
    S.rise('possible', at('s04_addresses'), G.possible); S.pulseOn(['qClear'], at('s04_precise'), 1.0); S.title(at('s04_connect') - 0.2, 'relation.link');
    S.pulseOn(['possible'], a('c006'), 1.2);
    // ---- c007: same topic, another issue ----
    t = X0('c007'); S.rise('poster', at('s04_poster'), G.poster); S.pulseOn(['card'], at('s04_recover'), 1.0); S.pulseOn(['poster'], a('c007'), 1.0);
    // ---- B04 · c008: a separate, labelled confirmation situation; the main board is unchanged ----
    t = X0('c008'); S.head(t, B(4), null); S.title(t, null); S.hide(['possible', 'poster'], t);
    S.rise('cFrame', at('s04_checked') - 0.3, G.cFrame); S.rise('cHead', at('s04_checked'), G.cHead); S.rise('yes', at('s04_clearYes'), G.cYes); S.rise('cEnough', at('s04_clearYes') + 0.3, G.cEnough);
    S.pulseOn(['cHead'], a('c008'), 1.2);
    // ---- c009: two diagnostic questions; optional examples, no sequence numbers ----
    t = X0('c009'); S.hide(['cEnough', 'yes'], t); S.hide(['cHead'], t + M.cut); S.hide(['cFrame'], t + M.cut);
    S.rise('sPoint', at('s04_whichPt'), G.sPoint); S.rise('sWork', at('s04_work'), G.sWork); S.addLayer('diag', at('s04_method') - 0.3, 0.1);
    S.rise('ex1', at('s04_method'), G.ex3[0]); S.rise('ex2', at('s04_limit'), G.ex3[1]); S.rise('ex3', at('s04_ask'), G.ex3[2]); S.pulseOn(['sWork'], a('c009'), 1.0);
    // ---- B05 · c010 + h102: original cards and a blank private area ----
    t = X0('c010'); S.head(t, B(5), null); X.clearAll(t); S.dropLayer('path', t); S.dropLayer('diag', t); S.title(t, null);
    S.rise('fV', at('s04_keep') + 0.1, G.left3[0], { kind: 'excerpt proposed' }); S.rise('fR', at('s04_keep') + 0.3, G.left3[1], { kind: 'idea reason' }); S.rise('fC', at('s04_keep') + 0.5, G.left3[2]);
    S.rise('blank', at('s04_form'), G.blank); S.pulseOn(['fR', 'fC'], a('c010'), 1.2);
    X.hold('h102');
    // ---- d005 · You: one possible reply (a model, separate from the private area) ----
    t = X0('d005'); S.head(t, null, null); S.hide(['fV', 'fR', 'fC', 'blank'], t);
    S.rise('sModel', t + 0.3, G.sModel); X.line('d005', 'ask:noah', ['I agree that people need time to try', 'Could we check'], { headFirst: true });
    // ---- c011: two exact links; the model beside, never inside, the blank area ----
    t = X0('c011'); X.roomOut(t); S.hide(['sModel'], t); S.head(t + 0.1, B(5), null);
    S.rise('fV', t + 0.2, G.left3[0]); S.rise('fR', t + 0.3, G.left3[1]); S.rise('fC', t + 0.4, G.left3[2]); S.rise('blank', t + 0.5, G.blank2);
    S.rise('model', at('s04_model'), G.model); S.addLayer('mdl', at('s04_model') + 0.3, 0.3);
    S.pulseOn(['fR'], at('s04_model') + 0.3, 1.0); S.pulseOn(['fC'], at('s04_examine'), 1.0); S.title(a('c011') - 0.2, 'review.connection');
    // ---- c012: precise agreement, purposeful addition; the concern stays open ----
    t = X0('c012'); X.clearAll(t); S.dropLayer('mdl', t); S.title(at('s04_precise2'), 'recap');
    S.rise('fC', at('s04_precise2') + 0.4, G.endConcern); S.addLayer('end', at('s04_next')); S.pulseOn(['fC'], a('c012'), 1.2);
  }
  global.L03Scenes = { setup };
})(window);
