/*
 * L03.S02 · Check Your Understanding. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Gate L03.I01 (choice): the prompt and three equal neutral cards rise only as the gate arrives (shared kit). Each branch
 * is its own authored continuation (room for the two lines, then an analysis on the board); c010 rebuilds the essential
 * meaning from the original line for every path (A, B, C or Skip) without assuming which was seen.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    src: R(150, 360, 700, 120, 32), read: R(1070, 360, 700, 120, 32),
    frame: R(150, 300, 1620, 540), frameLbl: R(190, 326, 820, 54, 26), task: R(190, 410, 820, 100, 32), aim: R(190, 534, 820, 100, 30), res: R(190, 658, 820, 76, 28),
    sLbl: R(1140, 150, 690, 54, 24), sTask: R(1140, 222, 690, 84, 28), sRes: R(1140, 322, 690, 66, 26),
    quote: R(150, 284, 1620, 140, 32),
    h3: [R(150, 440, 520, 44, 28), R(700, 440, 520, 44, 28), R(1250, 440, 520, 44, 28)],
    row: [R(150, 494, 520, 120, 30), R(700, 494, 520, 120, 30), R(1250, 494, 520, 120, 30)],
    target: R(150, 680, 1620, 90, 30),
    could: R(150, 494, 800, 100, 32), will: R(150, 660, 800, 100, 32), narrow: R(1060, 494, 710, 100, 28), targetR: R(1060, 660, 710, 100, 28),
    s3: [R(150, 494, 800, 84, 30), R(150, 594, 800, 84, 30), R(150, 694, 800, 100, 30)], blank: R(1060, 494, 710, 300, 30),
    chNote: R(150, 440, 760, 54, 26),
    opts: [R(150, 512, 1620, 100, 30), R(150, 626, 1620, 100, 30), R(150, 740, 1620, 100, 30)],
    sHead: R(1140, 150, 690, 56, 26), sQuote: R(1140, 226, 690, 236, 30),
    resp: R(150, 660, 1620, 110, 32),
    ctx3: [R(150, 494, 520, 150, 30), R(700, 494, 520, 150, 30), R(1250, 494, 520, 150, 30)],
    reading: R(560, 470, 800, 96, 32), dir3: [R(150, 680, 520, 90, 30), R(700, 680, 520, 90, 30), R(1250, 680, 520, 90, 30)],
    rPriv: R(1060, 806, 710, 0, 22), hint: R(1060, 806, 710, 40, 22), privTag: R(1060, 440, 710, 44, 26),
    rev3: [R(1060, 494, 710, 90, 30), R(1060, 604, 710, 90, 30), R(1060, 714, 710, 90, 30)],
    bCheck: R(150, 494, 760, 120, 32), bAsk: R(1010, 494, 760, 120, 32), next: R(560, 700, 800, 96, 30)
  };

  function setup(E, ctx) {
    const K = global.L03Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup, Q = (id) => E.cueText('L03.S02.' + id);
    tok('frame', G.frame, 'ctx frame', '', 'token.default');
    tok('src', G.src, 'idea', L('x.source'), 'token.idea'); tok('read', G.read, 'step tentative', L('x.reading'), 'token.idea');
    tok('frameLbl', G.frameLbl, 'framehead', L('task.status'), 'token.frame'); tok('task', G.task, 'goal', L('task.title'), 'token.step');
    tok('aim', G.aim, 'fact', L('x.aim'), 'token.step'); tok('res', G.res, 'chipcard', L('task.resources'), 'token.chip');
    tok('quote', G.quote, 'quote speaker', markup(L('quote.noah'), [L('x.view'), L('x.reason'), L('x.concern')]), 'token.quote', { who: 1, spk: 'noah' });
    tok('hV', G.h3[0], 'colhead', L('x.h.view'), 'token.colhead'); tok('hR', G.h3[1], 'colhead', L('x.h.reason'), 'token.colhead'); tok('hC', G.h3[2], 'colhead', L('x.h.concern'), 'token.colhead');
    tok('fV', G.row[0], 'excerpt proposed', L('x.view'), 'token.step'); tok('fR', G.row[1], 'idea reason', L('x.reason'), 'token.step');
    tok('fC', G.row[2], 'concern', markup(L('x.concern'), ['someone', 'could']), 'token.step');
    tok('target', G.target, 'goal focus', L('check.target'), 'token.step');
    tok('could', G.could, 'concern', L('modal.possible'), 'token.step'); tok('will', G.will, 'step changed', L('modal.certain'), 'token.step', { tag: 'x.examine' });
    tok('narrow', G.narrow, 'note', L('check.context'), 'token.note');
    tok('blank', G.blank, 'note', L('reflection.prompt'), 'token.note');
    tok('chNote', G.chNote, 'framehead', L('choice.note'), 'token.frame');
    tok('sHead', G.sHead, 'framehead', L('branch.b.label'), 'token.frame');
    tok('resp', G.resp, 'example', '', 'token.summary');
    tok('ctx1', G.ctx3[0], 'idea', L('x.ctx.clear'), 'token.question'); tok('ctx2', G.ctx3[1], 'idea', L('x.ctx.detail'), 'token.question'); tok('ctx3', G.ctx3[2], 'idea', L('x.ctx.whole'), 'token.question');
    tok('reading', G.reading, 'step tentative', L('x.reading'), 'token.idea');
    tok('dir1', G.dir3[0], 'chipcard', L('x.dir.confirm'), 'token.chip'); tok('dir2', G.dir3[1], 'chipcard', L('x.dir.narrow'), 'token.chip'); tok('dir3', G.dir3[2], 'chipcard', L('x.dir.change'), 'token.chip');
    tok('privTag', G.privTag, 'colhead quiet', L('rehearsal.private'), 'token.colhead'); tok('hint', G.hint, 'hint', L('rehearsal.time'), 'token.hint');
    tok('rev1', G.rev3[0], 'question', L('x.rev1'), 'token.question'); tok('rev2', G.rev3[1], 'question', L('x.rev2'), 'token.question'); tok('rev3', G.rev3[2], 'question', L('x.rev3'), 'token.question');
    tok('bCheck', G.bCheck, 'step tentative', L('bridge.check'), 'token.idea'); tok('bAsk', G.bAsk, 'question', L('bridge.ask'), 'token.question');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('chk'); Rx.dline(E, l, 'chk.a', 'M 1062 420 C 960 470, 960 470, 862 420', '#9DB6E0'); Rx.head(E, l, 'chk.h', 856, 416, 'left', '#9DB6E0'); Rx.qmark(E, l, 'chk.q', 960, 500);
    l = ly('task'); E.icon(l, 'task.clock', 'clock', 1090, 412, 64, '#5D6878'); E.path(l, 'task.rail', 'M 1190 444 L 1700 444', { stroke: '#B9C5D6', 'stroke-width': 6 });
    E.path(l, 'task.t0', 'M 1190 426 L 1190 462', { stroke: '#B9C5D6', 'stroke-width': 4 }); E.path(l, 'task.t1', 'M 1700 426 L 1700 462', { stroke: '#B9C5D6', 'stroke-width': 4 });
    E.icon(l, 'task.staff', 'staff', 1090, 540, 64, '#5D6878'); E.icon(l, 'task.paper', 'cards', 1090, 660, 64, '#5D6878');
    l = ly('mod'); Rx.dline(E, l, 'mod.a', 'M 550 602 L 550 644', '#B9C5D6'); Rx.head(E, l, 'mod.h', 550, 652, 'down', '#B9C5D6'); Rx.qmark(E, l, 'mod.q', 590, 624);
    l = ly('lA'); Rx.dline(E, l, 'lA.a', 'M 960 652 L 960 628', '#9DB6E0'); Rx.head(E, l, 'lA.h', 960, 620, 'up', '#9DB6E0');
    l = ly('lB'); [410, 960, 1510].forEach((x, i) => { Rx.dline(E, l, 'lB.' + i, `M ${x} 652 L ${x} 628`, '#9DB6E0'); Rx.head(E, l, 'lB.h' + i, x, 620, 'up', '#9DB6E0'); });
    l = ly('lC'); Rx.dline(E, l, 'lC.a', 'M 1510 652 L 1510 628', '#B9C5D6'); Rx.head(E, l, 'lC.h', 1510, 620, 'up', '#B9C5D6'); Rx.qmark(E, l, 'lC.q', 1550, 638);
    l = ly('dirs'); [410, 960, 1510].forEach((x, i) => Rx.dline(E, l, 'dirs.' + i, `M 960 574 C 960 620, ${x} 620, ${x} 672`, '#B9C5D6'));
    l = ly('br'); Rx.dline(E, l, 'br.a', 'M 918 554 L 994 554', '#9DB6E0'); Rx.head(E, l, 'br.h', 1002, 554, 'right', '#9DB6E0');
    l = ly('nx'); Rx.dline(E, l, 'nx.a', 'M 960 622 L 960 684', '#9DB6E0'); Rx.head(E, l, 'nx.h', 960, 692, 'down', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L03.S02.B0' + n, M = X.MOTION, markup = global.EsssouthStyleEngine.markup;
    X.neutral(S, -1e9); S.roomMode = 'off';
    const frags = (t, gap, extra) => { ['hV', 'hR', 'hC'].forEach((id, i) => S.rise(id, t + i * gap, G.h3[i])); ['fV', 'fR', 'fC'].forEach((id, i) => S.rise(id, t + 0.1 + i * gap, G.row[i], extra)); };
    // ---- B01 · c001: a reading made available for confirmation or correction ----
    S.head(X0('c001') + 0.1, B(1), null);
    S.rise('src', X0('c001') + 0.5, G.src); S.rise('read', at('s02_interp'), G.read); S.addLayer('chk', at('s02_interp') + 0.5);
    S.title(a('c001') - 0.2, 'check.purpose'); S.pulseOn(['read'], a('c001'), 1.2);
    // ---- c002: the planning task restored for standalone viewing ----
    let t = X0('c002'); X.clearAll(t); S.dropLayer('chk', t); S.title(t, null);
    S.rise('frame', t + 0.2, G.frame); S.rise('frameLbl', at('s02_group'), G.frameLbl); S.rise('task', at('s02_group') + 0.4, G.task); S.addLayer('task', at('s02_group') + 0.7, 0.1);
    S.rise('res', at('s02_facil'), G.res); S.rise('aim', a('c002'), G.aim); S.pulseOn(['frameLbl'], at('s02_notAdopt'), 1.2);
    // ---- d001 · Noah's exact baseline line, once ----
    t = X0('d001'); S.head(t, null, null); S.hide(['frame', 'aim'], t); S.dropLayer('task', t);
    S.to('frameLbl', t + 0.1, G.sLbl); S.to('task', t + 0.18, G.sTask); S.to('res', t + 0.26, G.sRes);
    X.line('d001', 'propose:learner', ['keep the demonstration brief', 'time to try', 'someone who misses a step could get left behind'], { headFirst: true });
    // ---- c003: three meaning cards, preserving brief / time to try / could ----
    t = X0('c003'); X.roomOut(t); S.hide(['frameLbl', 'task', 'res'], t); S.head(t + 0.1, B(1), null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 });
    S.rise('hV', at('s02_keepBrief') - 0.1, G.h3[0]); S.rise('fV', at('s02_keepBrief'), G.row[0]); S.rise('hR', at('s02_reasonFor') - 0.1, G.h3[1]); S.rise('fR', at('s02_reasonFor'), G.row[1]);
    S.rise('hC', at('s02_difficulty') - 0.1, G.h3[2]); S.rise('fC', at('s02_difficulty'), G.row[2], { hl: 1 });
    S.rise('target', a('c003'), G.target); S.title(a('c003') - 0.2, null);
    // ---- B02 · c004: different words, same strength; could ≠ will ----
    t = X0('c004'); S.head(t, B(2), null); S.hide(['hV', 'hR', 'hC', 'fV', 'fR', 'target'], t); S.to('fC', t + 0.1, G.row[2]);
    S.title(at('s02_diffWords') - 0.2, 'paraphrase.rule');
    S.hide(['fC'], at('s02_couldWill') - 0.4); S.rise('could', at('s02_couldWill'), G.could); S.addLayer('mod', at('s02_couldWill') + 0.5); S.rise('will', at('s02_couldWill') + 0.7, G.will);
    S.pulseOn(['will'], a('c004'), 1.2);
    // ---- c005: omission is a different issue; a narrow check vs this whole-contribution check ----
    t = X0('c005'); S.rise('narrow', at('s02_shortCheck'), G.narrow); S.rise('target', at('s02_shortCheck') + 1.2, G.targetR, { kind: 'goal focus' }); S.pulseOn(['target'], a('c005'), 1.2);
    // ---- c006 + h101: recall the original point; a blank recall area; no choices yet ----
    t = X0('c006'); S.hide(['could', 'will', 'narrow', 'target'], t); S.dropLayer('mod', t); S.title(t, null);
    S.rise('fV', at('s02_wantKeep'), G.s3[0]); S.rise('fR', at('s02_whyBrief'), G.s3[1]); S.rise('fC', a('c006'), G.s3[2]);
    S.rise('blank', at('s02_recall'), G.blank);
    X.hold('h101');
    // ---- B03 · c007 + c008: compare preserved / omitted / strengthened; authored continuations ----
    t = X0('c007'); S.head(t, B(3), null); S.hide(['blank'], t);
    ['fV', 'fR', 'fC'].forEach((id, i) => S.to(id, t + 0.1 + i * 0.08, G.row[i])); ['hV', 'hR', 'hC'].forEach((id, i) => S.rise(id, t + 0.2 + i * 0.08, G.h3[i]));
    S.pulseOn(['fV', 'fR', 'fC'], at('s02_preserves'), 1.0); S.pulseOn(['fC'], a('c007'), 1.2);
    S.title(at('s02_choose') - 0.2, 'choice.prompt');
    t = X0('c008'); S.hide(['hV', 'hR', 'hC', 'fV', 'fR', 'fC'], t); S.rise('chNote', a('c008'), G.chNote);
    // ---- gate L03.I01 ----
    const g = X.gate({ optRects: G.opts });
    // ---- branches (each a separate authored possibility; only one exists on any route) ----
    const branch = (k, d1, d2, f, hl1, hl2, label, note) => {
      if (!X.has(d1)) return; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'chNote', 'quote'], t0); S.head(t0, null, null); S.title(t0, null);
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L(label) }); S.rise('quote', t0 + 0.4, G.sQuote, { hl: 0 });
      X.line(d1, 'explain:noah', hl1, { headFirst: true }); X.line(d2, k === 'C' ? 'explain:learner' : 'agree:learner', hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead'], tf); S.head(tf + 0.1, B(3), null); S.to('quote', tf + 0.1, G.quote, { hl: 1 }); frags(tf + 0.3, 0.12, { act: 0 });
      return tf;
    };
    let tf = branch('A', 'd101', 'd102', 'f101', ['more time to practise'], ['brief demonstration', 'someone who misses a step'], 'branch.a.label', 'branch.a.note');
    if (tf != null) { S.rise('resp', tf + 0.8, G.resp, { text: X.L('gate.option.A') }); S.addLayer('lA', at('sA_purpose'));
      S.pulseOn(['fR', 'resp'], at('sA_purpose'), 1.2); S.put('fV', at('sA_leaves'), M.focus, { o: 0.4 }); S.put('fC', at('sA_leaves') + 0.1, M.focus, { o: 0.4 });
      S.title(a('f101') - 0.2, 'branch.a.note'); S.pulseOn(['fV', 'fC'], at('sA_present'), 1.0); }
    tf = branch('B', 'd201', 'd202', 'f201', ['brief demonstration', 'time to try', 'might fall behind'], ['time for people to try', 'keeping a demonstration', 'a way to help if someone misses a step'], 'branch.b.label', 'branch.b.note');
    if (tf != null) { S.rise('resp', tf + 0.8, G.resp, { text: markup(X.L('gate.option.B'), ['might']), hl: 1 }); S.addLayer('lB', at('sB_keeps'), 0.15);
      S.pulseOn(['fV', 'fR', 'fC', 'resp'], at('sB_keeps'), 1.4); S.title(a('f201') - 0.2, 'branch.b.note'); }
    tf = branch('C', 'd301', 'd302', 'f301', ['anyone', 'will get left behind'], ['could get left behind', 'not certain'], 'branch.c.label', 'branch.c.note');
    if (tf != null) { S.rise('resp', tf + 0.8, G.resp, { text: markup(X.L('gate.option.C'), ['anyone', 'will get left behind']), hl: 1 }); S.addLayer('lC', at('sC_certainty') - 0.2);
      S.pulseOn(['fV', 'fR'], at('sC_recog'), 1.0); S.pulseOn(['fC', 'resp'], at('sC_certainty'), 1.4); S.title(a('f301') - 0.2, 'branch.c.note'); S.pulseOn(['fC'], at('sC_restore'), 1.2); }
    // ---- B04 · c010: every path enters here once; essential meaning rebuilt from the original line ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t); ['lA', 'lB', 'lC'].forEach((l) => S.dropLayer(l, t)); S.head(t, B(4), null); S.title(t, null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); frags(t + 0.5, 0.15, { act: 0 });
    S.title(at('s02_brief') - 0.2, 'shared.check'); S.pulseOn(['fV', 'fR', 'fC'], a('c010'), 1.2);
    // ---- c011: check only what needs checking; three contexts, not a ritual ----
    t = X0('c011'); S.hide(['hV', 'hR', 'hC', 'fV', 'fR', 'fC'], t);
    S.rise('ctx1', at('s02_clear'), G.ctx3[0]); S.rise('ctx2', at('s02_small'), G.ctx3[1]); S.rise('ctx3', at('s02_repeating'), G.ctx3[2]);
    S.title(a('c011') - 0.2, 'check.selective'); S.pulseOn(['ctx2'], a('c011'), 1.2);
    // ---- c012: a reading left open to correction; three possible replies ----
    t = X0('c012'); S.hide(['ctx1', 'ctx2', 'ctx3'], t);
    S.rise('reading', t + 0.4, G.reading); S.title(at('s02_room') - 0.2, 'check.open');
    S.addLayer('dirs', at('s02_confirm') - 0.3, 0.2); S.rise('dir1', at('s02_confirm'), G.dir3[0]); S.rise('dir2', at('s02_narrow'), G.dir3[1]); S.rise('dir3', at('s02_change'), G.dir3[2]);
    S.pulseOn(['reading'], a('c012'), 1.2);
    // ---- B05 · c013 + c014 + h102: private rehearsal, blank area, no recording ----
    t = X0('c013'); S.head(t, B(5), null); X.clearAll(t); S.dropLayer('dirs', t); S.title(t, null);
    S.rise('quote', t + 0.3, G.quote, { hl: 1 }); S.rise('fV', at('s02_try'), G.s3[0]); S.rise('fR', at('s02_try') + 0.2, G.s3[1]); S.rise('fC', at('s02_try') + 0.4, G.s3[2]);
    S.rise('blank', at('s02_try') + 0.8, G.blank, { text: L('rehearsal.prompt') }); S.pulseOn(['fC'], a('c013'), 1.2);
    t = X0('c014'); S.rise('privTag', at('s02_think'), G.privTag); S.rise('hint', a('c014'), G.hint); S.pulseOn(['privTag'], a('c014'), 1.0);
    X.hold('h102');
    // ---- c015: neutral self-review questions beside the source; no transcript, no grade ----
    t = X0('c015'); S.hide(['blank', 'privTag', 'hint'], t); S.title(a('c015') - 0.2, 'review.prompt');
    S.rise('rev1', at('s02_certainty'), G.rev3[0]); S.rise('rev2', at('s02_lose'), G.rev3[1]); S.rise('rev3', at('s02_unclear'), G.rev3[2]);
    // ---- B06 · c016 + c017: from checking a reading to asking for missing information; next title ----
    t = X0('c016'); S.head(t, B(6), null); X.clearAll(t); S.title(t, null);
    S.rise('bCheck', at('s02_reading'), G.bCheck); S.addLayer('br', at('s02_unspec')); S.rise('bAsk', at('s02_unspec') + 0.3, G.bAsk); S.pulseOn(['bAsk'], a('c016'), 1.2);
    t = X0('c017'); S.addLayer('nx', a('c017') - 0.3); S.rise('next', a('c017'), G.next); S.pulseOn(['bCheck'], at('s02_leaving'), 1.0);
  }
  global.L03Scenes = { setup };
})(window);
