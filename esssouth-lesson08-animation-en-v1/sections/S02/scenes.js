/*
 * L08.S02 · Separate Shared Ground from Open Questions. Section adapter (tokens, rects, timing by cue starts and anchors).
 * Baseline snapshot only: F06–F08 as exact attributed cards. Support is shown at element level with its condition
 * attached to its named owner; "No stated view" is its own column and no gesture moves a status card. Gate L08.I01:
 * each authored alternative is labelled before it is spoken; Noah's branch reply stays inside its branch, and every path
 * (and Skip) rejoins c010 on the unchanged source ledger.
 */
(function (global) {
  'use strict';
  const R = (x, y, w, h, fs) => ({ x, y, w, h, fs });
  const C4 = [150, 570, 990, 1410], C3 = [150, 700, 1250], ROW = [340, 476, 612];
  const G = {
    lh: C4.map((x) => R(x, 440, 360, 44, 26)),
    snap: R(150, 290, 620, 46, 22), src: ROW.map((y) => R(150, y, 1620, 90, 26)),
    msup: R(150, 420, 760, 90, 28), nsup: R(1010, 420, 760, 90, 28), notT: R(560, 600, 800, 66, 26),
    hSrc: ROW.map((y) => R(150, y, 1000, 90, 26)), n1: R(1200, 340, 570, 170, 30), n2: R(1200, 530, 570, 170, 30),
    sh: C3.map((x) => R(x, 340, 520, 44, 26)), noR: R(1250, 396, 520, 90, 26), inv: R(560, 560, 800, 66, 26),
    whole: R(560, 320, 800, 76, 28), lvl: R(150, 440, 1620, 44, 26), eM: R(150, 496, 760, 90, 28), eN: R(1010, 496, 760, 90, 28),
    rail: R(150, 640, 1620, 44, 26), req: R(560, 696, 800, 66, 26),
    sF: R(150, 320, 1620, 430), sH: R(190, 336, 620, 50, 24), sS: R(190, 410, 760, 100, 28), sO: R(1010, 410, 720, 100, 28), sBl: R(190, 540, 1540, 180, 30),
    cM: R(150, 300, 520, 76, 26), cN: R(700, 300, 520, 76, 26), cP: R(1250, 300, 520, 76, 26), focus: R(150, 396, 760, 56, 26), scope: R(1010, 396, 760, 56, 26),
    opts: [R(150, 470, 1620, 100, 28), R(150, 580, 1620, 100, 28), R(150, 690, 1620, 100, 28)],
    sM: R(1140, 150, 690, 66, 26), sN: R(1140, 226, 690, 66, 26), sP: R(1140, 302, 690, 66, 26), sHead: R(1140, 384, 690, 56, 26),
    fSrc: ROW.map((y) => R(150, y - 50, 1620, 76, 26)), resp: R(150, 690, 1620, 96, 28),
    rv: R(150, 360, 1620, 110, 28), rvBl: R(150, 520, 1620, 220, 30),
    stc: C3.map((x) => R(x, 440, 520, 100, 30)),
    nF: R(150, 330, 1620, 400), nH: R(190, 346, 560, 50, 24), nM: R(190, 420, 720, 90, 28), nN: R(950, 420, 780, 90, 28), nSlot: R(190, 560, 1540, 100, 28)
  };

  function setup(E, ctx) {
    const K = global.L08Kit.base(E, ctx), tok = K.tok, L = E.label, markup = global.EsssouthStyleEngine.markup;
    tok('n1', G.n1, 'note', '', 'token.note'); tok('n2', G.n2, 'note', '', 'token.note'); tok('sF', G.sF, 'ctx frame', '', 'token.default'); tok('sBl', G.sBl, 'note', '', 'token.note');
    tok('rvBl', G.rvBl, 'note', '', 'token.note'); tok('nF', G.nF, 'ctx frame', '', 'token.default'); // containers first
    ['x.l.person', 'x.l.element', 'x.l.cond', 'x.l.open'].forEach((k, i) => tok('lh' + i, G.lh[i], i === 3 ? 'colhead dashed' : 'colhead', L(k), 'token.colhead'));
    tok('snap', G.snap, 'framehead', L('snapshot.label'), 'token.frame');
    tok('bM', G.src[0], 'excerpt', L('baseline.maya'), 'token.step', { tag: 'x.by.maya' }); tok('bN', G.src[1], 'excerpt', L('baseline.noah'), 'token.step', { tag: 'x.by.noah' });
    tok('bP', G.src[2], 'excerpt', L('baseline.participant'), 'token.step', { tag: 'x.by.part' });
    tok('msup', G.msup, 'step', L('maya.support'), 'token.step', { tag: 'x.by.maya' }); tok('nsup', G.nsup, 'step', L('noah.support'), 'token.step', { tag: 'x.by.noah' });
    tok('notT', G.notT, 'step gap', L('x.notTimed'), 'token.step');
    tok('sh0', G.sh[0], 'colhead', L('x.st.sup'), 'token.colhead'); tok('sh1', G.sh[1], 'colhead', L('x.st.not'), 'token.colhead'); tok('sh2', G.sh[2], 'colhead dashed', L('silence.status'), 'token.colhead');
    tok('noR', G.noR, 'note', L('x.noReply'), 'token.note'); tok('inv', G.inv, 'chipcard margin', L('check.invite'), 'token.chip');
    tok('whole', G.whole, 'step gap', L('whole.open'), 'token.step'); tok('lvl', G.lvl, 'colhead', L('support.level'), 'token.colhead');
    tok('rail', G.rail, 'colhead', L('constraint.notvote'), 'token.colhead'); tok('req', G.req, 'fact', L('time.included'), 'token.step');
    tok('sH', G.sH, 'framehead', L('summary.parts'), 'token.frame'); tok('sS', G.sS, 'idea', L('x.sumSup'), 'token.idea'); tok('sO', G.sO, 'question', L('x.sumOpen'), 'token.question');
    tok('cP', G.cP, 'step', L('x.psup'), 'token.step');
    tok('focus', G.focus, 'framehead', L('choice.focus'), 'token.frame'); tok('scope', G.scope, 'chipcard margin', L('reply.scope'), 'token.chip');
    tok('sHead', G.sHead, 'framehead', L('choice.B.status'), 'token.frame'); tok('resp', G.resp, 'example', '', 'token.summary');
    tok('rv', G.rv, 'step changed', L('gate.option.A'), 'token.step', { tag: 'x.toRevise' });
    tok('st0', G.stc[0], 'proposal', L('status.proposed'), 'token.step'); tok('st1', G.stc[1], 'step', L('status.partial'), 'token.step'); tok('st2', G.stc[2], 'step gap', L('status.open'), 'token.step');
    tok('nH', G.nH, 'framehead', L('next.fit'), 'token.frame'); tok('nSlot', G.nSlot, 'step gap', L('x.slot'), 'token.step');
    K.finishTokens({ optRects: G.opts });
    const Rx = ctx.Rx, ly = (id) => E.overLayer(id);
    let l = ly('con'); Rx.dline(E, l, 'con.a', 'M 918 465 L 1002 465', '#9DB6E0');
    return { DEF: K.DEF, G, optRects: G.opts, lay };
  }

  function lay(S, tr, X) {
    const { L } = X, at = X.at, a = X.a, X0 = X.X0, B = (n) => 'block.L08.S02.B0' + n, M = X.MOTION, markup = global.EsssouthStyleEngine.markup;
    const SRC = ['bM', 'bN', 'bP'];
    X.neutral(S, -1e9); S.roomMode = 'off';
    // ---- B01 · c001: a formal ledger: person, supported element, condition, open question ----
    S.head(X0('c001') + 0.1, B(1), null); ['lh0', 'lh1', 'lh2', 'lh3'].forEach((id, i) => S.rise(id, at('s2_says') + i * 0.3, G.lh[i])); S.title(a('c001') - 0.2, 'support.scope');
    // ---- c002: F06–F08 as exact attributed cards, conditions included ----
    let t = X0('c002'); S.title(t, null); X.clearAll(t);
    S.rise('snap', at('s2_return'), G.snap); SRC.forEach((id, i) => S.rise(id, at('s2_return') + 0.6 + i * 0.4, G.src[i])); S.pulseOn(SRC, a('c002'), 1.2);
    // ---- c003: element-level support, conditions kept with their owners ----
    t = X0('c003'); X.clearAll(t);
    S.rise('msup', at('s2_maya'), G.msup); S.rise('nsup', at('s2_noah'), G.nsup); S.addLayer('con', at('s2_these'), 0.3); S.rise('notT', a('c003') - 0.2, G.notT);
    // ---- h101: the exact statements beside two blank note slots ----
    const H1 = X.cue('h101'); X.clearAll(H1.start); S.dropLayer('con', H1.start);
    SRC.forEach((id, i) => S.rise(id, H1.start + 0.3 + i * 0.1, G.hSrc[i])); S.rise('n1', H1.start + 0.6, G.n1, { text: '' }); S.rise('n2', H1.start + 0.7, G.n2, { text: '' });
    X.hold('h101');
    // ---- B02 · c004: "No stated view" is its own status; nothing moves it ----
    t = X0('c004'); S.head(t, B(2), null); X.clearAll(t);
    ['sh0', 'sh1', 'sh2'].forEach((id, i) => S.rise(id, at('s2_person') + i * 0.2, G.sh[i])); S.rise('noR', at('s2_person') + 0.8, G.noR); S.rise('inv', at('s2_if'), G.inv);
    // ---- c005: from the whole-plan label down to the supported elements ----
    t = X0('c005'); X.clearAll(t);
    S.rise('whole', at('s2_over'), G.whole); S.rise('lvl', at('s2_keep'), G.lvl); S.rise('msup', at('s2_keep') + 0.4, G.eM); S.rise('nsup', at('s2_keep') + 0.6, G.eN); S.pulseOn(['whole'], at('s2_complete'), 1.2);
    // ---- c006: a separate fixed-requirement rail beneath the ledger ----
    t = X0('c006'); S.hide(['whole'], t); S.rise('rail', at('s2_firm'), G.rail); S.rise('req', at('s2_firm') + 0.5, G.req); S.pulseOn(['rail'], at('s2_sep'), 1.0);
    // ---- c007: an accurate summary = supported elements + remaining decision; learner field blank ----
    t = X0('c007'); X.clearAll(t);
    S.rise('sF', at('s2_useful'), G.sF); S.rise('sH', at('s2_useful') + 0.2, G.sH); S.rise('sS', at('s2_saying'), G.sS); S.rise('sO', at('s2_open'), G.sO); S.rise('sBl', a('c007') + 0.3, G.sBl, { text: '' });
    // ---- c008 + c009 + gate: the same compact ledger above three neutral accounts ----
    t = X0('c008'); X.clearAll(t);
    S.rise('msup', at('s2_compare'), G.cM, { tag: '' }); S.rise('nsup', at('s2_compare') + 0.15, G.cN, { tag: '' }); S.rise('cP', at('s2_compare') + 0.3, G.cP); S.rise('focus', a('c008') - 0.4, G.focus);
    S.rise('scope', a('c009') - 0.3, G.scope);
    X.gate({ optRects: G.opts });
    const branch = (k, d1, d2, f, hl1, hl2) => {
      if (!X.has(d1)) return null; const t0 = X0(d1);
      S.hide(['opt.A', 'opt.B', 'opt.C', 'focus', 'scope'], t0); S.head(t0, null, null); S.title(t0, null);
      S.to('msup', t0 + 0.1, G.sM); S.to('nsup', t0 + 0.15, G.sN); S.to('cP', t0 + 0.2, G.sP);
      S.rise('sHead', t0 + 0.3, G.sHead, { text: L('choice.' + k + '.status') }); // labelled before the line begins
      X.line(d1, 'explain:noah', hl1, { headFirst: true }); X.line(d2, 'explain:learner', hl2);
      const tf = X0(f); X.roomOut(tf); S.hide(['sHead', 'msup', 'nsup', 'cP'], tf); S.head(tf + 0.1, B(2), null);
      SRC.forEach((id, i) => S.rise(id, tf + 0.3 + i * 0.1, G.fSrc[i]));
      S.rise('resp', tf + 0.7, G.resp, { text: markup(L('gate.option.' + k), hl1), hl: k === 'B' ? 0 : 1, kind: k === 'B' ? 'example' : 'step changed' }); S.title(a(f) - 0.2, 'feedback.' + k);
      return tf;
    };
    branch('A', 'd101', 'd102', 'f101', ['complete plan'], ['decided']);
    branch('B', 'd201', 'd202', 'f201', ['timing and the whole sequence'], ['how short']);
    branch('C', 'd301', 'd302', 'f301', ['completely new ideas'], ['some pair discussion']);
    // ---- B03 · c010: every path rejoins on the unchanged source ledger ----
    t = X0('c010'); X.roomOut(t); S.hide(['resp'], t, 0.01); X.clearAll(t, ['resp']); S.head(t, B(3), null); S.title(t, null);
    S.rise('snap', at('s2_any'), G.snap); SRC.forEach((id, i) => S.rise(id, at('s2_any') + 0.3 + i * 0.15, G.src[i])); S.title(a('c010') - 0.2, 'check.actions');
    // ---- h102: an overbroad claim to revise beside a blank rewrite area ----
    const H2 = X.cue('h102'); S.title(H2.start, null); X.clearAll(H2.start); S.rise('rv', H2.start + 0.3, G.rv); S.rise('rvBl', H2.start + 0.6, G.rvBl, { text: '' });
    X.hold('h102');
    // ---- B04 · c011: three distinct status cards (words and borders) ----
    t = X0('c011'); S.head(t, B(4), null); X.clearAll(t);
    ['st0', 'st1', 'st2'].forEach((id, i) => S.rise(id, at('s2_words') + 0.6 + i * 0.4, G.stc[i])); S.pulseOn(['st2'], at('s2_job'), 1.2);
    // ---- c012: the accurately scoped cards in an unfinished candidate-sequence frame ----
    t = X0('c012'); X.clearAll(t);
    S.rise('nF', at('s2_once'), G.nF); S.rise('nH', at('s2_once') + 0.2, G.nH); S.rise('msup', at('s2_once') + 0.5, G.nM, { tag: 'x.by.maya' }); S.rise('nsup', at('s2_once') + 0.7, G.nN, { tag: 'x.by.noah' });
    S.rise('nSlot', a('c012'), G.nSlot);
  }
  global.L08Scenes = { setup };
})(window);
