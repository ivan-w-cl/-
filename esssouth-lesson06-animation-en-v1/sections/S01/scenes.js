/*
 * L06.S01 · Choose One Specific Experience. Section adapter (tokens, rects, timing by cue starts and anchors).
 * The "Fictional worked example" label is on screen whenever case material or model speech is shown. Case content follows
 * the fact ledger F01–F09 only: the participant's lane (blue idea cards) is kept apart from Maya's and Noah's work (grey
 * step cards); the coordinator's confirmation is a labelled summary; the one observed visitor is a fact card set apart
 * from the unknown wider impact. Private areas stay blank.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const LX = [190, 710, 1230], LXB = [150, 710, 1270];
  const G = {
    broad: R(560, 300, 800, 96, 32), three: [R(150, 520, 520, 100, 30), R(700, 520, 520, 100, 30), R(1250, 520, 520, 100, 30)],
    frame: R(150, 300, 1620, 540), caseF: R(190, 316, 820, 54, 24), task: R(190, 390, 1540, 76, 30),
    laneH: LX.map((x) => R(x, 500, 500, 44, 28)), laneC: LX.map((x) => R(x, 554, 500, 90, 28)),
    caseS: R(1140, 150, 690, 50, 24), sB: R(1140, 220, 690, 76, 28), sR: R(1140, 316, 690, 76, 28),
    caseB: R(150, 290, 620, 50, 24), chipB: R(150, 480, 760, 96, 30), chipR: R(1010, 480, 760, 96, 30),
    seq: [R(150, 480, 500, 120, 28), R(710, 480, 500, 120, 28), R(1270, 480, 500, 120, 28)],
    lH: LXB.map((x) => R(x, 400, 500, 44, 28)), lC: LXB.map((x) => R(x, 454, 500, 100, 28)), team: R(710, 590, 1060, 54, 24),
    epi: R(150, 400, 800, 96, 30), act: R(150, 520, 800, 100, 28), blank: R(1060, 400, 710, 360, 30),
    day: R(150, 360, 1620, 460), dayH: R(190, 376, 820, 54, 26), epiC: R(560, 530, 800, 110, 32),
    obs: R(150, 470, 800, 100, 30), unk: R(1060, 470, 710, 100, 28), dec: R(560, 340, 800, 96, 30),
    cat: [R(150, 420, 520, 84, 28), R(700, 420, 520, 84, 28), R(1250, 420, 520, 84, 28)], one: R(560, 600, 800, 160, 30),
    own: R(150, 470, 760, 260, 30), fic: R(1010, 470, 760, 260, 30),
    set: R(150, 420, 760, 320, 30), part: R(1010, 420, 760, 320, 30), pnote: R(150, 776, 500, 48, 24),
    eH: LXB.map((x) => R(x, 420, 500, 44, 28)), eC: LXB.map((x) => R(x, 474, 500, 90, 28)), next: R(560, 690, 800, 96, 30)
  };

  function setup(E, ctx) {
    const K = global.L06Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('frame', G.frame, 'ctx frame', '', 'token.default'); tok('day', G.day, 'ctx frame', '', 'token.default'); // containers first
    tok('broad', G.broad, 'idea vague', L('x.broad'), 'token.idea');
    tok('t1', G.three[0], 'step', L('x.event'), 'token.step'); tok('t2', G.three[1], 'step', L('x.action'), 'token.step'); tok('t3', G.three[2], 'step', L('x.question'), 'token.step');
    tok('caseL', G.caseF, 'framehead', L('case.label'), 'token.frame'); tok('task', G.task, 'goal', L('case.task'), 'token.step');
    ['x.lane.p', 'x.lane.m', 'x.lane.n'].forEach((k, i) => tok('lh' + i, G.laneH[i], 'colhead', L(k), 'token.colhead'));
    tok('r0', G.laneC[0], 'idea', L('x.role.map'), 'token.idea'); tok('r1', G.laneC[1], 'step', L('x.role.times'), 'token.step'); tok('r2', G.laneC[2], 'step', L('x.role.assembly'), 'token.step');
    tok('sb', G.sB, 'chipcard mark', L('x.studioB'), 'token.chip'); tok('sr', G.sR, 'chipcard mark', L('x.blueRoom'), 'token.chip');
    tok('unc', G.seq[0], 'question', L('case.uncertainty'), 'token.question'); tok('ask', G.seq[1], 'idea', L('x.asked'), 'token.idea');
    tok('conf', G.seq[2], 'fact', L('case.confirmed'), 'token.step', { tag: 'x.summary' });
    tok('act', G.lC[0], 'idea', L('case.action'), 'token.idea'); tok('mc', G.lC[1], 'step', L('x.maya.check'), 'token.step'); tok('na', G.lC[2], 'step', L('x.noah.assemble'), 'token.step');
    tok('team', G.team, 'framehead', L('case.team'), 'token.frame');
    tok('epi', G.epi, 'idea', L('episode.focus'), 'token.idea'); tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('dayH', G.dayH, 'framehead', L('x.day'), 'token.frame');
    tok('obs', G.obs, 'fact', L('result.observed'), 'token.step'); tok('unk', G.unk, 'step gap', L('result.unknown'), 'token.step'); tok('dec', G.dec, 'idea', L('x.decision'), 'token.idea');
    tok('c0', G.cat[0], 'step plan', L('x.cat.prep'), 'token.step'); tok('c1', G.cat[1], 'step plan', L('x.cat.help'), 'token.step'); tok('c2', G.cat[2], 'step plan', L('x.cat.notice'), 'token.step');
    tok('one', G.one, 'note unobserved', L('x.oneEpisode'), 'token.note');
    tok('own', G.own, 'note', L('x.path.own'), 'token.note'); tok('fic', G.fic, 'note', L('x.path.fiction'), 'token.note', { tag: 'case.label' });
    tok('set', G.set, 'note', L('x.slot.setting'), 'token.note'); tok('part', G.part, 'note', L('x.slot.part'), 'token.note'); tok('pnote', G.pnote, 'hint', L('private.note'), 'token.hint');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens();
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('narrow'); [410, 960, 1510].forEach((x, i) => Rx.dline(E, l, 'narrow.' + i, `M 960 404 C 960 460, ${x} 460, ${x} 512`, '#B9C5D6'));
    l = ly('guide'); E.icon(l, 'guide.page', 'cards', 1620, 640, 72, '#B9C5D6');
    l = ly('mm'); Rx.dline(E, l, 'mm.a', 'M 918 528 L 1002 528', '#B9C5D6'); Rx.qmark(E, l, 'mm.q', 960, 500);
    l = ly('seq'); [658, 1218].forEach((x, i) => { Rx.dline(E, l, 'seq.' + i, `M ${x} 540 L ${x + 30} 540`, '#9DB6E0'); Rx.head(E, l, 'seq.h' + i, x + 40, 540, 'right', '#9DB6E0'); });
    l = ly('div'); E.dashed(l, 'div.a', 'M 1005 460 L 1005 590', '#9DB6E0');
    l = ly('sel'); [410, 960, 1510].forEach((x, i) => Rx.dline(E, l, 'sel.' + i, `M ${x} 512 C ${x} 560, 960 556, 960 592`, '#B9C5D6'));
    l = ly('nx'); Rx.dline(E, l, 'nx.a', 'M 960 572 L 960 682', '#9DB6E0'); Rx.head(E, l, 'nx.h', 960, 690, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: K.optRects, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L06.S01.B0' + n, M = X.MOTION;
    const lanes = (t, H, C, cards) => { ['lh0', 'lh1', 'lh2'].forEach((id, i) => S.rise(id, t + i * 0.12, H[i])); cards.forEach((id, i) => S.rise(id, t + 0.2 + i * 0.12, C[i])); };
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a broad topic narrows to one event, action and question ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('broad', at('s1_asked'), G.broad); S.addLayer('narrow', a('c001') + 0.3, 0.15);
    S.rise('t1', at('s1_what'), G.three[0]); S.rise('t2', at('s1_did'), G.three[1]); S.rise('t3', at('s1_honest'), G.three[2]); S.title(a('c001') - 0.2, 'selection.focus');
    // ---- c002: the fiction label first, then the task and the three role lanes ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('narrow', t); S.title(t, null);
    S.rise('frame', at('s1_fiction'), G.frame); S.rise('caseL', at('s1_fiction') + 0.2, G.caseF); S.pulseOn(['caseL'], at('s1_fiction') + 0.8, 1.2);
    S.rise('task', at('s1_three'), G.task); S.addLayer('guide', at('s1_three') + 0.4);
    ['lh0', 'lh1', 'lh2'].forEach((id, i) => S.rise(id, at('s1_three') + 0.8 + i * 0.12, G.laneH[i]));
    S.rise('r0', a('c002'), G.laneC[0]); S.rise('r1', at('s1_maya'), G.laneC[1]); S.rise('r2', at('s1_noah'), G.laneC[2]);
    // ---- d001 · the case participant's authored account, in a labelled frame ----
    t = X0('d001'); S.head(t, null, null); X.clearAll(t, ['caseL']); S.dropLayer('guide', t); S.to('caseL', t + 0.1, G.caseS);
    X.line('d001', 'explain:maya', ['Studio B', 'Blue Room']); S.rise('sb', at('s1_studio') + 0.3, G.sB); S.rise('sr', a('d001') + 0.6, G.sR);
    // ---- c003: the two exact source labels, the contradiction unresolved ----
    t = X0('c003'); X.roomOut(t); S.head(t + 0.1, B(1), null); S.to('caseL', t + 0.1, G.caseB);
    S.to('sb', t + 0.2, G.chipB); S.to('sr', t + 0.3, G.chipR); S.addLayer('mm', t + 1.0); S.title(a('c003') - 0.2, 'episode.focus');
    // ---- B02 · c004: uncertainty → asking → confirmation (a labelled summary) ----
    t = X0('c004'); S.head(t, B(2), null); S.title(t, null); S.hide(['sb', 'sr'], t); S.dropLayer('mm', t);
    S.rise('unc', at('s1_notKnow'), G.seq[0]); S.addLayer('seq', a('c004') - 0.2, 0.4); S.rise('ask', at('s1_askedC'), G.seq[1]); S.rise('conf', at('s1_confirmed'), G.seq[2]);
    // ---- c005: shared work in three lanes; no single person completed everything ----
    t = X0('c005'); S.hide(['unc', 'ask', 'conf'], t); S.dropLayer('seq', t);
    ['lh0', 'lh1', 'lh2'].forEach((id, i) => S.rise(id, t + 0.2 + i * 0.12, G.lH[i]));
    S.rise('act', at('s1_changed'), G.lC[0]); S.rise('mc', at('s1_mayaC'), G.lC[1]); S.rise('na', at('s1_noahA'), G.lC[2]); S.rise('team', a('c005') - 0.3, G.team);
    // ---- c006 + h101: labelled source facts beside a blank private area ----
    t = X0('c006'); X.clearAll(t, ['caseL']);
    S.rise('epi', at('s1_priv'), G.epi); S.rise('act', at('s1_priv') + 0.2, G.act); S.rise('blank', at('s1_priv') + 0.5, G.blank);
    X.hold('h101');
    // ---- B03 · c007: a compact episode within the larger event ----
    t = X0('c007'); S.head(t, B(3), null); S.hide(['epi', 'act', 'blank'], t);
    S.rise('day', at('s1_every'), G.day); S.rise('dayH', at('s1_every') + 0.2, G.dayH); S.rise('epi', at('s1_enough'), G.epiC); S.title(a('c007') - 0.2, 'detail.rule');
    // ---- c008: one observed visitor, set apart from what is unknown ----
    t = X0('c008'); S.title(t, null); S.hide(['epi', 'dayH'], t); S.hide(['day'], t + M.cut);
    S.rise('obs', at('s1_limits') + 0.6, G.obs); S.addLayer('div', at('s1_noSurvey') - 0.3); S.rise('unk', at('s1_noSurvey'), G.unk); S.pulseOn(['obs'], a('c008'), 1.0);
    // ---- c009: the concrete decision stays visible beside the limited observation ----
    t = X0('c009'); S.rise('dec', at('s1_labelCheck'), G.dec); S.title(a('c009') - 0.2, 'truthfulness.note'); S.pulseOn(['unk'], at('s1_unusable') + 0.5, 1.0);
    // ---- B04 · c010: ordinary categories narrowing to one episode (no case material) ----
    t = X0('c010'); S.head(t, B(4), null); S.title(t, null); X.clearAll(t); S.dropLayer('div', t);
    S.rise('c0', at('s1_prep'), G.cat[0]); S.rise('c1', at('s1_help'), G.cat[1]); S.rise('c2', at('s1_notice'), G.cat[2]);
    S.addLayer('sel', at('s1_choose') - 0.3, 0.1); S.rise('one', at('s1_choose'), G.one); S.title(a('c010') + 0.4, 'private.options');
    // ---- c011: two labelled blank paths ----
    t = X0('c011'); S.title(t, null); S.hide(['c0', 'c1', 'c2', 'one'], t); S.dropLayer('sel', t);
    S.rise('own', at('s1_personal'), G.own); S.rise('fic', at('s1_fictionP'), G.fic); S.title(at('s1_fictionP') + 1.0, 'practice.alternative');
    // ---- c012 + h102: empty Setting and My part slots ----
    t = X0('c012'); S.title(t, null); S.hide(['own', 'fic'], t);
    S.title(at('s1_choose2') + 0.4, 'private.prompt'); S.rise('set', at('s1_happening'), G.set); S.rise('part', at('s1_where'), G.part); S.rise('pnote', a('c012') + 0.6, G.pnote);
    X.hold('h102');
    // ---- B05 · c013: the episode and the role lanes settle; next-section title ----
    t = X0('c013'); S.head(t, B(5), null); S.title(t, null); X.clearAll(t);
    S.rise('caseL', t + 0.3, G.caseB); lanes(t + 0.4, G.eH, G.eC, ['act', 'mc', 'na']); S.title(at('s1_useful') + 1.2, 'recap.focus');
    S.addLayer('nx', at('s1_next') - 0.3); S.rise('next', at('s1_next'), G.next);
  }
  global.L06Scenes = { setup };
})(window);
