/*
 * L07.S02 · Restart After a Pause. Section adapter (tokens, rects, timing by cue starts and anchors).
 * A fresh excerpt: Maya offers only F04, then h001 shows the chosen 4-second pause as a resting room with no bubble and an
 * "illustration interval" label (no timer, alarm or waiting state). Known facts and unknown causes stay in separate areas.
 * Gate L07.I01: each branch is labelled before it is spoken; Noah's F05 appears only inside branch B and never in the
 * common rejoin; nothing is adopted. Private areas stay blank.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const G = {
    caseB: R(150, 290, 620, 50, 24), aims: R(150, 370, 1620, 76, 28), prop: R(150, 476, 1620, 84, 28), openB: R(150, 610, 1620, 84, 28),
    sCase: R(1140, 150, 690, 50, 24), sProp: R(1140, 214, 690, 110, 28), sInt: R(1140, 384, 690, 44, 22), sHead: R(1140, 384, 690, 56, 26), sN: R(1140, 460, 690, 130, 26),
    obs: R(150, 400, 760, 90, 30), lim: R(150, 530, 760, 66, 26), unk: [R(1010, 400, 760, 90, 28), R(1010, 510, 760, 90, 28)],
    o1: R(150, 400, 760, 100, 30), o2: R(1010, 400, 760, 100, 30), openC: R(150, 560, 1620, 84, 28), qp: R(560, 680, 800, 90, 28),
    kH: R(150, 360, 760, 44, 26), kProp: R(150, 416, 760, 110, 28), kAims: R(150, 580, 760, 90, 26), uH: R(1010, 360, 760, 44, 26),
    uF: [R(1010, 416, 760, 150, 26), R(1010, 586, 760, 150, 26)],
    eCase: R(150, 290, 620, 46, 22), eProp: R(150, 346, 1000, 76, 26), ePause: R(1190, 346, 580, 76, 26), chNote: R(150, 438, 760, 56, 26), scope: R(1010, 438, 760, 56, 26),
    opts: [R(150, 510, 1620, 92, 28), R(150, 612, 1620, 92, 28), R(150, 714, 1620, 92, 28)],
    fProp: R(150, 400, 760, 110, 28), fUnk: R(1010, 400, 760, 110, 28), fN: R(1010, 400, 760, 130, 26), fOpen: R(150, 600, 1620, 84, 28),
    fOpt: [R(150, 560, 520, 84, 28), R(700, 560, 520, 84, 28), R(1250, 560, 520, 84, 28)],
    jProp: R(150, 350, 1000, 84, 28), jPause: R(1190, 350, 580, 84, 26), jOpen: R(150, 470, 1620, 84, 28),
    need: [R(150, 420, 520, 100, 28), R(700, 420, 520, 100, 28), R(1250, 420, 520, 100, 28)], rule: R(560, 580, 800, 66, 26),
    pProp: R(150, 400, 760, 110, 28), pPause: R(150, 550, 760, 84, 26), pBlank: R(1010, 400, 760, 380, 30), next: R(560, 690, 800, 96, 30)
  };

  function setup(E, ctx) {
    const K = global.L07Kit.base(E, ctx), tok = K.tok, L = E.label;
    tok('f0', G.uF[0], 'note', '', 'token.note'); tok('f1', G.uF[1], 'note', '', 'token.note'); tok('pBlank', G.pBlank, 'note', '', 'token.note'); // containers first
    tok('caseL', G.caseB, 'framehead', L('case.label'), 'token.frame'); tok('aims', G.aims, 'goal', L('task.aims'), 'token.step');
    tok('prop', G.sProp, 'proposal', L('proposal.maya'), 'token.step', { tag: 'x.unadopted' });
    tok('open', G.openB, 'question', L('x.openLink'), 'token.question');
    tok('int', G.sInt, 'hint', L('x.interval'), 'token.hint');
    tok('obs', G.obs, 'fact', L('pause.observed'), 'token.step'); tok('lim', G.lim, 'chipcard margin', L('pause.limit'), 'token.chip');
    tok('u0', G.unk[0], 'step gap', L('x.unk.cause'), 'token.step'); tok('u1', G.unk[1], 'step gap', L('x.unk.view'), 'token.step');
    tok('o1', G.o1, 'step plan', L('x.opt.space'), 'token.step'); tok('o2', G.o2, 'step plan', L('x.opt.speak'), 'token.step');
    tok('qp', G.qp, 'idea', L('question.purpose'), 'token.idea');
    tok('kH', G.kH, 'colhead', L('x.knownH'), 'token.colhead'); tok('uH', G.uH, 'colhead dashed', L('x.unknownH'), 'token.colhead');
    tok('pause', G.ePause, 'note unobserved', L('x.paused'), 'token.note');
    tok('chNote', G.chNote, 'chipcard margin', L('choice.note'), 'token.chip'); tok('scope', G.scope, 'chipcard margin', L('repair.scope'), 'token.chip');
    tok('sHead', G.sHead, 'framehead', L('branch.b.label'), 'token.frame');
    tok('nProp', G.sN, 'proposal', L('branch.b.noah'), 'token.step', { tag: 'x.unadopted' });
    ['x.opt.think', 'x.opt.pass', 'x.opt.later'].forEach((k, i) => tok('fo' + i, G.fOpt[i], 'step plan', L(k), 'token.step'));
    ['x.need.cmp', 'x.need.clar', 'x.need.space'].forEach((k, i) => tok('nd' + i, G.need[i], 'step plan', L(k), 'token.step'));
    tok('rule', G.rule, 'chipcard margin', L('followup.rule'), 'token.chip');
    tok('next', G.next, 'proposal next', L('next.title'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('div'); E.dashed(l, 'div.a', 'M 960 360 L 960 760', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L07.S02.B0' + n, M = X.MOTION;
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a fresh excerpt; the task and both aims; nothing selected ----
    S.head(X0('c001') + 0.1, B(1), null); S.rise('caseL', a('c001'), G.caseB); S.rise('aims', at('s2_help'), G.aims);
    // ---- d001 · Maya offers F04 only ----
    let t = X0('d001'); S.head(t, null, null); X.clearAll(t, ['caseL']); S.to('caseL', t + 0.1, G.sCase);
    X.line('d001', 'propose:learner', ['exchange names and interests'], { headFirst: true }); S.rise('prop', a('d001') + 0.3, G.sProp);
    // ---- h001 · the chosen 4-second pause: no bubble, everyone at rest, a plain label (no timer or alarm) ----
    const P = X.cue('h001'); S.hide(['bubL'], P.start); X.neutral(S, P.start + 0.1); S.rise('int', P.start + 0.2, G.sInt);
    // ---- c002: what the excerpt establishes, and what it does not ----
    t = X0('c002'); X.roomOut(t); S.head(t + 0.1, B(1), null); S.hide(['int', 'caseL'], t); S.to('prop', t + 0.1, G.prop);
    S.hide(['prop'], at('s2_notReplied') - 0.2);
    S.rise('obs', at('s2_notReplied'), G.obs); S.addLayer('div', a('c002') - 0.2); S.rise('u0', a('c002'), G.unk[0]); S.rise('u1', a('c002') + 0.3, G.unk[1]);
    S.rise('lim', at('s2_four'), G.lim);
    // ---- B02 · c003: two neutral alternatives; the open task link ----
    t = X0('c003'); S.head(t, B(2), null); X.clearAll(t); S.dropLayer('div', t);
    S.rise('o1', at('s2_allow'), G.o1); S.rise('o2', at('s2_speak'), G.o2); S.rise('open', at('s2_conn'), G.openC); S.title(a('c003') - 0.2, 'pause.options');
    // ---- c004: a group-directed question as one possible move ----
    t = X0('c004'); S.title(t, null); S.pulseOn(['open'], at('s2_open'), 1.2); S.rise('qp', at('s2_open') + 0.6, G.qp);
    // ---- c005 + h101: known proposal and task beside an unfilled "not known" area ----
    t = X0('c005'); X.clearAll(t);
    S.rise('kH', at('s2_priv'), G.kH); S.rise('uH', at('s2_priv') + 0.2, G.uH);
    S.rise('prop', at('s2_know'), G.kProp); S.rise('aims', at('s2_know') + 0.3, G.kAims);
    S.rise('f0', at('s2_dont'), G.uF[0], { text: L('x.f.reason') }); S.rise('f1', a('c005'), G.uF[1], { text: L('x.f.accept') });
    S.title(a('c005') + 0.6, 'reflection.prompt');
    X.hold('h101');
    // ---- B03 · c006–c008: the exact excerpt restored; equal neutral choices ----
    t = X0('c006'); S.head(t, B(3), null); S.title(t, null); X.clearAll(t);
    S.rise('caseL', t + 0.2, G.eCase); S.rise('prop', t + 0.3, G.eProp, { tag: '' }); S.rise('pause', t + 0.5, G.ePause); S.title(a('c006') - 0.2, 'choice.prompt');
    S.rise('chNote', at('s2_repl'), G.chNote); S.rise('scope', at('s2_small'), G.scope);
    X.gate({ optRects: G.opts });
    const branch = (d1, d2, f, label, p1, p2, hl1, hl2) => {
      if (!X.has(d1)) return null; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'chNote', 'scope', 'pause'], t0); S.head(t0, null, null); S.title(t0, null);
      S.to('caseL', t0 + 0.1, G.sCase); S.to('prop', t0 + 0.2, G.sProp, { tag: 'x.unadopted' });
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L(label), kind: label === 'branch.b.label' ? 'framehead' : 'framehead active' }); // labelled before the line begins
      X.line(d1, p1, hl1, { headFirst: true }); X.line(d2, p2, hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead'], tf); S.head(tf + 0.1, B(3), null); S.to('caseL', tf + 0.1, G.caseB); S.to('prop', tf + 0.2, G.fProp);
      return tf;
    };
    let tf = branch('d101', 'd102', 'f101', 'branch.a.label', 'propose:maya', 'explain:learner', ['No one has objected'], ["I haven't said whether I agree"]);
    if (tf != null) { S.rise('u1', tf + 0.4, G.fUnk); S.pulseOn(['u1'], at('sA_silence'), 1.2); S.rise('open', at('sA_silence') + 0.8, G.fOpen); S.title(a('f101') - 0.2, 'branch.a.note'); }
    tf = branch('d201', 'd202', 'f201', 'branch.b.label', 'ask:noah', 'propose:learner', ['find out about the weekly drawing group'], ['draw or write one thing']);
    if (tf != null) { S.rise('nProp', a('d202') + 0.3, G.sN); S.to('nProp', tf + 0.25, G.fN);
      S.rise('open', at('sB_neither'), G.fOpen); S.pulseOn(['open'], a('f201'), 1.2); S.title(at('sB_neither') - 0.2, 'branch.b.note'); }
    tf = branch('d301', 'd302', 'f301', 'branch.c.label', 'ask:noah', 'ask:learner', ['Tell us what you think now'], ['a moment to think']);
    if (tf != null) { S.rise('u0', tf + 0.4, G.fUnk); ['fo0', 'fo1', 'fo2'].forEach((id, i) => S.rise(id, at('sC_room') + 0.4 + i * 0.4, G.fOpt[i])); S.title(a('f301') - 0.2, 'branch.c.note'); }
    // ---- B04 · c010: every path rejoins on the common pause, proposal and open task point only ----
    t = X0('c010'); X.roomOut(t); X.clearAll(t); S.head(t, B(4), null); S.title(t, null);
    S.rise('caseL', t + 0.2, G.eCase); S.rise('prop', at('s2_alone'), G.jProp, { tag: '' }); S.rise('pause', at('s2_alone') + 0.3, G.jPause); S.rise('open', at('s2_combine'), G.jOpen);
    S.title(a('c010') - 0.2, 'shared.check');
    // ---- c011: three possible subsequent needs (not one enacted conversation) ----
    t = X0('c011'); S.title(t, null); S.hide(['prop', 'pause', 'open'], t);
    S.rise('nd0', at('s2_another'), G.need[0]); S.rise('nd1', at('s2_q'), G.need[1]); S.rise('nd2', at('s2_cont'), G.need[2]); S.rise('rule', a('c011'), G.rule);
    // ---- c012 + h102: the original excerpt only, beside a blank private area ----
    t = X0('c012'); X.clearAll(t, ['caseL']);
    S.rise('prop', at('s2_form'), G.pProp, { tag: '' }); S.rise('pause', at('s2_form') + 0.2, G.pPause); S.rise('pBlank', at('s2_form') + 0.5, G.pBlank, { text: '' }); S.title(a('c012') - 0.2, 'private.prompt');
    X.hold('h102');
    // ---- c013: a conditional self-check; fresh-excerpt bridge ----
    t = X0('c013'); S.title(at('s2_formed'), 'review.question'); S.hide(['pBlank'], t); S.rise('next', at('s2_next'), G.next);
  }
  global.L07Scenes = { setup };
})(window);
