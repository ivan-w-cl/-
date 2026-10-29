/*
 * L03.S01 · Hear the View, Reason, and Concern. Section adapter: token list, rects inside the approved columns and WHEN
 * things happen (cue starts, supplied semantic anchors a_*, staging anchors s01_*). Durations, easing, colours, kinds,
 * the room and the cast come from the shared toolkit and are not re-tuned here.
 * Semantic staging: view = proposal kind (dashed, not adopted); reason = reason kind; concern = concern kind with a
 * "possibility" status tag; interpretations stay outside a dashed boundary; summaries are authored example cards.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    topic: R(760, 330, 400, 72, 30), contrib: R(150, 560, 700, 110, 32), reply: R(1070, 560, 700, 110, 32),
    frame: R(150, 300, 1620, 540), frameLbl: R(190, 326, 820, 54, 26), task: R(190, 410, 820, 100, 32), aim: R(190, 534, 820, 100, 30), res: R(190, 658, 820, 76, 28),
    sLbl: R(1140, 150, 690, 54, 24), sTask: R(1140, 222, 690, 84, 28), sRes: R(1140, 322, 690, 66, 26),
    quote: R(150, 284, 1620, 140, 32),
    row: [R(150, 470, 520, 120, 30), R(700, 470, 520, 120, 30), R(1250, 470, 520, 120, 30)],
    hV: R(150, 440, 800, 44, 28), fV: R(150, 494, 800, 92, 32), hR: R(150, 612, 800, 44, 28), fR: R(150, 666, 800, 92, 32),
    limit: R(1060, 494, 710, 92, 28), noDemo: R(1060, 640, 710, 76, 28), aimR: R(1060, 666, 710, 92, 28),
    rq1: R(1060, 494, 710, 92, 30), rq2: R(1060, 666, 710, 92, 30),
    h3: [R(150, 440, 520, 44, 28), R(700, 440, 520, 44, 28), R(1250, 440, 520, 44, 28)],
    c3: [R(150, 494, 520, 130, 30), R(700, 494, 520, 130, 30), R(1250, 494, 520, 130, 30)],
    openQ: R(150, 700, 1620, 100, 30),
    bSaid: R(150, 440, 800, 44, 28), bInf: R(1060, 440, 710, 44, 28), infArea: R(1060, 494, 710, 300, 28),
    s3: [R(150, 494, 800, 84, 30), R(150, 594, 800, 84, 30), R(150, 694, 800, 100, 30)],
    sHead: R(1140, 150, 690, 56, 26), sQuote: R(1140, 226, 690, 236, 30), sChips: [R(1140, 482, 690, 74, 28), R(1140, 572, 690, 74, 28), R(1140, 662, 690, 100, 28)],
    sum1: R(150, 660, 1620, 100, 32), hSum: R(1060, 440, 710, 44, 28), sum2: R(1060, 494, 710, 300, 30),
    cLbl: R(150, 300, 800, 54, 24), cTask: R(150, 374, 800, 90, 30), cRes: R(150, 484, 800, 70, 28), cAim: R(150, 574, 800, 90, 28),
    blank: R(1060, 300, 710, 364, 30), next: R(560, 700, 800, 96, 30)
  };

  function setup(E, ctx) {
    const K = global.L03Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    // content tokens (creation order = stacking order)
    tok('frame', G.frame, 'ctx frame', '', 'token.default');
    tok('topic', G.topic, 'chipcard', L('x.topic'), 'token.chip'); tok('contrib', G.contrib, 'idea', L('x.contribution'), 'token.idea'); tok('reply', G.reply, 'idea', L('x.reply'), 'token.idea');
    tok('frameLbl', G.frameLbl, 'framehead', L('task.status'), 'token.frame'); tok('task', G.task, 'goal', L('task.title'), 'token.step');
    tok('aim', G.aim, 'fact', L('x.aim'), 'token.step'); tok('res', G.res, 'chipcard', L('task.resources'), 'token.chip');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('quote', G.quote, 'quote speaker', markup(L('quote.noah'), [L('view.quote'), L('reason.quote'), L('concern.quote')]), 'token.quote', { who: 1, spk: 'noah' });
    tok('hV', G.hV, 'colhead', L('view.label'), 'token.colhead'); tok('hR', G.hR, 'colhead', L('reason.label'), 'token.colhead'); tok('hC', G.h3[2], 'colhead', L('concern.label'), 'token.colhead');
    tok('fV', G.row[0], 'step', L('view.quote'), 'token.step'); tok('fR', G.row[1], 'step', L('reason.quote'), 'token.step');
    tok('fC', G.row[2], 'step', markup(L('concern.quote'), ['someone', 'could']), 'token.step');
    tok('limit', G.limit, 'note', L('view.limit'), 'token.note'); tok('noDemo', G.noDemo, 'step gap', L('x.noDemo'), 'token.step', { tag: 'x.notSaid' });
    tok('aimR', G.aimR, 'fact', L('x.aim'), 'token.step');
    tok('rq1', G.rq1, 'question', L('reflection.first'), 'token.question'); tok('rq2', G.rq2, 'question', L('reflection.second'), 'token.question');
    tok('openQ', G.openQ, 'question', L('concern.open'), 'token.question');
    tok('bSaid', G.bSaid, 'colhead', L('boundary.said'), 'token.colhead'); tok('bInf', G.bInf, 'colhead dashed', L('boundary.inferred'), 'token.colhead'); tok('infArea', G.infArea, 'note unobserved', '', 'token.note');
    tok('sHead', G.sHead, 'framehead', L('summary.label'), 'token.frame');
    tok('sum1', G.sum1, 'example', E.cueText('L03.S01.d002'), 'token.summary', { tag: 'summary.label' });
    tok('hSum', G.hSum, 'colhead', L('summary.full'), 'token.colhead'); tok('sum2', G.sum2, 'example', E.cueText('L03.S01.d003'), 'token.summary', { tag: 'summary.label' });
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens();
    // connector layers (all text lives in tokens)
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('open'); Rx.dline(E, l, 'open.a', 'M 900 410 C 900 480, 500 470, 500 548', '#B9C5D6'); Rx.dline(E, l, 'open.b', 'M 1020 410 C 1020 480, 1420 470, 1420 548', '#B9C5D6');
    Rx.dline(E, l, 'open.c', 'M 862 615 L 1058 615', '#B9C5D6'); Rx.qmark(E, l, 'open.q', 960, 586);
    l = ly('task'); E.icon(l, 'task.clock', 'clock', 1090, 412, 64, '#5D6878'); E.path(l, 'task.rail', 'M 1190 444 L 1700 444', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'task.t0', 'M 1190 426 L 1190 462', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'task.t1', 'M 1700 426 L 1700 462', { stroke: '#B9C5D6', 'stroke-width': 4 });
    E.icon(l, 'task.staff', 'staff', 1090, 540, 64, '#5D6878'); E.icon(l, 'task.paper', 'cards', 1090, 660, 64, '#5D6878');
    l = ly('vrA'); Rx.dline(E, l, 'vrA.a', 'M 142 540 C 104 540, 104 712, 136 712', '#9DB6E0'); Rx.head(E, l, 'vrA.h', 142, 712, 'right', '#9DB6E0');
    l = ly('vrB'); Rx.dline(E, l, 'vrB.a', 'M 958 712 L 1042 712', '#9DB6E0'); Rx.head(E, l, 'vrB.h', 1050, 712, 'right', '#9DB6E0');
    l = ly('q'); Rx.dline(E, l, 'q.a', 'M 410 632 L 410 682', '#9DB6E0'); Rx.head(E, l, 'q.ah', 410, 690, 'down', '#9DB6E0'); Rx.dline(E, l, 'q.b', 'M 1510 632 L 1510 682', '#9DB6E0'); Rx.head(E, l, 'q.bh', 1510, 690, 'down', '#9DB6E0');
    l = E.layer('div'); E.dashed(l, 'div.a', 'M 1005 440 L 1005 800', '#9DB6E0');
    l = ly('s1'); Rx.dline(E, l, 's1.a', 'M 410 652 L 410 604', '#9DB6E0'); Rx.head(E, l, 's1.h', 410, 596, 'up', '#9DB6E0');
    l = ly('s2'); [536, 636, 744].forEach((y, i) => Rx.dline(E, l, 's2.' + i, `M 958 ${y} C 1000 ${y}, 1010 644, 1052 644`, '#9DB6E0'));
    l = ly('nx'); Rx.dline(E, l, 'nx.a', 'M 960 632 L 960 684', '#9DB6E0'); Rx.head(E, l, 'nx.h', 960, 692, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L03.S01.B0' + n;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: same topic, unresolved relationship ----
    S.head(X0('c001') + 0.1, B(1), null);
    S.rise('topic', at('s01_sameTopic'), G.topic); S.rise('contrib', at('s01_sameTopic') + 0.2, G.contrib); S.rise('reply', at('s01_sameTopic') + 0.4, G.reply);
    S.addLayer('open', at('s01_sameTopic') + 0.6, 0.2);
    S.title(at('s01_missPoint') - 0.2, 'opening.note');
    S.pulseOn(['contrib'], a('c001'), 1.2);
    // ---- c002: the fictional planning frame ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('open', t); S.title(t, null);
    S.rise('frame', t + 0.2, G.frame); S.rise('frameLbl', at('s01_group'), G.frameLbl);
    S.rise('task', at('s01_thirty'), G.task); S.addLayer('task', at('s01_thirty') + 0.3, 0.1);
    S.rise('res', at('s01_facil'), G.res); S.rise('aim', a('c002'), G.aim);
    S.pulseOn(['frameLbl'], at('s01_noWorkshop'), 1.2);
    // ---- d001 · Noah (side layout): the task heading stays beside the room; no beginner is shown falling behind ----
    t = X0('d001'); S.head(t, null, null); S.hide(['frame', 'aim'], t); S.dropLayer('task', t);
    S.to('frameLbl', t + 0.1, G.sLbl); S.to('task', t + 0.18, G.sTask); S.to('res', t + 0.26, G.sRes);
    X.line('d001', 'propose:learner', ['keep the demonstration brief', 'time to try', 'someone who misses a step could get left behind'], { headFirst: true });
    // ---- c003: back to the board; three neutral fragments, not a rubric ----
    t = X0('c003'); X.roomOut(t); S.hide(['frameLbl', 'task', 'res'], t); S.head(t + 0.1, B(1), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 0 }); S.put('quote', a('c003'), X.MOTION.focus, { hl: 1 });
    S.rise('fV', at('s01_prop'), G.row[0]); S.rise('fR', at('s01_purpose'), G.row[1]); S.rise('fC', at('s01_concern'), G.row[2]);
    S.title(a('c003') - 0.2, 'listening.resources');
    // ---- B02 · c004: the view, and what "brief" does not mean ----
    t = X0('c004'); S.head(t, B(2), null); S.hide(['fR', 'fC'], t);
    S.rise('hV', t + 0.15, G.hV); S.to('fV', t + 0.2, G.fV, { kind: 'excerpt proposed' }); S.pulseOn(['fV'], at('s01_hisProposal'), 1.0);
    S.rise('noDemo', a('c004'), G.noDemo); S.rise('limit', at('s01_wordBrief'), G.limit); S.pulseOn(['limit'], at('s01_exact'), 1.0);
    // ---- c005: the reason, linked conditionally to the task aim ----
    t = X0('c005'); S.hide(['noDemo'], t);
    S.rise('hR', t + 0.15, G.hR); S.rise('fR', at('s01_hisReason'), G.fR, { kind: 'idea reason' }); S.addLayer('vrA', a('c005') + 0.4);
    S.rise('aimR', at('s01_aim'), G.aimR); S.addLayer('vrB', at('s01_aim') + 0.3);
    S.pulseOn(['fR'], at('s01_notWork'), 1.0);
    // ---- c006 + h101: two fragments, two private questions, no cursor ----
    t = X0('c006'); S.hide(['limit', 'aimR'], t); S.dropLayer('vrA', t); S.dropLayer('vrB', t);
    S.rise('rq1', a('c006'), G.rq1); S.rise('rq2', at('s01_whyHe'), G.rq2);
    X.hold('h101');
    // ---- c007: the shared explanation after the hold ----
    t = X0('c007'); S.hide(['rq1', 'rq2'], t); S.addLayer('vrA', t + 0.2);
    S.pulseOn(['hV', 'fV'], at('s01_action'), 1.2); S.pulseOn(['hR', 'fR'], at('s01_itsReason'), 1.2);
    S.title(at('s01_action') - 0.2, 'view.reason.link');
    // ---- B03 · c008: the concern as a separate card; "someone" and "could" kept ----
    t = X0('c008'); S.head(t, B(3), null); S.dropLayer('vrA', t);
    S.to('hV', t + 0.1, G.h3[0]); S.to('fV', t + 0.15, G.c3[0]); S.to('hR', t + 0.23, G.h3[1]); S.to('fR', t + 0.31, G.c3[1]);
    S.rise('hC', t + 0.5, G.h3[2]); S.rise('fC', at('s01_cDifferent') + 0.3, G.c3[2], { kind: 'concern', tag: 'concern.scope', hl: 0 });
    S.put('fC', a('c008') - 0.1, X.MOTION.focus, { hl: 1 }); S.pulseOn(['fC'], a('c008'), 1.4);
    // ---- c009: an open support question beside the proposal; nothing prefilled ----
    t = X0('c009'); S.pulseOn(['fV'], at('s01_notCancel'), 1.0);
    S.addLayer('q', at('s01_question') - 0.2, 0.1); S.rise('openQ', at('s01_question'), G.openQ); S.pulseOn(['openQ'], a('c009'), 1.2);
    // ---- c010: what he said vs. interpretations he did not offer ----
    t = X0('c010'); S.hide(['openQ', 'hV', 'hR', 'hC'], t); S.dropLayer('q', t); S.title(t, null);
    S.rise('bSaid', t + 0.15, G.bSaid); ['fV', 'fR', 'fC'].forEach((id, i) => S.to(id, t + 0.2 + i * 0.08, G.s3[i]));
    S.addLayer('div', at('s01_notKnow')); S.rise('bInf', at('s01_notKnow') + 0.2, G.bInf); S.rise('infArea', at('s01_notKnow') + 0.4, G.infArea);
    S.pulseOn(['bInf'], at('s01_motive'), 1.0); S.pulseOn(['bSaid'], a('c010'), 1.2);
    // ---- B04 · d002: an authored short summary; the full source line stays in view ----
    t = X0('d002'); S.head(t, null, null); S.hide(['bSaid', 'bInf', 'infArea', 'fV', 'fR', 'fC'], t); S.dropLayer('div', t);
    S.rise('sHead', t + 0.3, G.sHead); S.to('quote', t + 0.2, G.sQuote, { hl: 0 });
    X.line('d002', 'explain:noah', ['a short demonstration'], { headFirst: true });
    // ---- c011: what that summary keeps; reason and concern dimmed, not deleted ----
    t = X0('c011'); X.roomOut(t); S.hide(['sHead'], t); S.head(t + 0.1, B(4), null); S.to('quote', t + 0.1, G.quote);
    ['fV', 'fR', 'fC'].forEach((id, i) => S.rise(id, t + 0.3 + i * 0.2, G.row[i], { act: 0 }));
    S.rise('sum1', t + 0.9, G.sum1); S.addLayer('s1', at('s01_keepsProp')); S.pulseOn(['fV', 'sum1'], at('s01_keepsProp'), 1.2);
    S.put('fR', at('s01_leavesOut'), X.MOTION.focus, { o: 0.4 }); S.put('fC', at('s01_leavesOut') + 0.1, X.MOTION.focus, { o: 0.4 });
    S.title(a('c011') - 0.2, 'summary.context');
    // ---- d003: a fuller authored summary, linked back to the three source fragments ----
    t = X0('d003'); S.head(t, null, null); S.hide(['sum1', 'fV', 'fR', 'fC'], t); S.dropLayer('s1', t);
    S.rise('sHead', t + 0.3, G.sHead, { text: L('summary.full') }); S.to('quote', t + 0.2, G.sQuote, { hl: 0 });
    X.line('d003', 'explain:noah', ['a brief demonstration', 'people have time to try', 'might fall behind'], { headFirst: true });
    S.rise('fV', at('s01_d3brief'), G.sChips[0]); S.rise('fR', at('s01_d3try'), G.sChips[1]); S.rise('fC', a('d003'), G.sChips[2]);
    // ---- c012: meaning mapped between source and summary, not word matching ----
    t = X0('c012'); X.roomOut(t); S.hide(['sHead'], t); S.head(t + 0.1, B(4), null); S.to('quote', t + 0.1, G.quote);
    ['fV', 'fR', 'fC'].forEach((id, i) => S.to(id, t + 0.15 + i * 0.08, G.s3[i]));
    S.rise('hSum', t + 0.4, G.hSum); S.rise('sum2', t + 0.6, G.sum2); S.addLayer('s2', at('s01_moreMeaning'), 0.2);
    S.pulseOn(['fV', 'fR', 'fC', 'sum2'], at('s01_moreMeaning') + 0.2, 1.2);
    S.title(a('c012') - 0.2, 'summary.flexible');
    // ---- B05 · c013 + h102: the task stays, the reflection area stays blank ----
    t = X0('c013'); S.head(t, B(5), null); X.clearAll(t); S.title(t, null); S.dropLayer('s2', t);
    S.rise('frameLbl', t + 0.3, G.cLbl); S.rise('task', t + 0.4, G.cTask); S.rise('res', t + 0.5, G.cRes); S.rise('aim', t + 0.6, G.cAim);
    S.rise('blank', a('c013'), G.blank); S.pulseOn(['aim'], at('s01_purposeOr'), 1.0);
    X.hold('h102');
    // ---- c014: settled view, reason and concern with their source wording; next-section title, no navigation ----
    t = X0('c014'); X.clearAll(t);
    ['hV', 'hR', 'hC'].forEach((id, i) => S.rise(id, t + 0.3 + i * 0.12, G.h3[i]));
    S.rise('fV', t + 0.4, G.c3[0], { kind: 'excerpt proposed' }); S.rise('fR', t + 0.52, G.c3[1], { kind: 'idea reason' }); S.rise('fC', t + 0.64, G.c3[2], { kind: 'concern', tag: 'concern.scope', hl: 1 });
    S.pulseOn(['fV', 'fR', 'fC'], at('s01_preserves'), 1.2);
    S.addLayer('nx', at('s01_next') - 0.3); S.rise('next', at('s01_next'), G.next);
  }
  global.L03Scenes = { setup };
})(window);
