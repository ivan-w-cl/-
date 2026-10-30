/*
 * esssouth Lesson 08 · caption bar with speaker names from the section graph (participants). The bar, its sizes, colours
 * and timing rule are the approved beat-kit captions() unchanged; only the speaker-name table is now data, because
 * Lesson 08 names the learner-side speaker "Participant" (an offstage "Prompt reader" name is kept for compatibility).
 */
(function (global) {
  'use strict';
  const K = global.EsssouthKit, { el, op } = K;
  function captions(stage, names) {
    const cap = el('div', 'capbar', stage), cw = el('div', 'who', cap), dot = el('i', '', cw), name = el('span', '', cw), text = el('div', 'ctext', cap);
    let key = null;
    const fit = () => { text.style.fontSize = '42px'; let fs = 42; while (text.scrollHeight > 107 && fs > 32) { fs -= 2; text.style.fontSize = fs + 'px'; } return text.scrollHeight <= 107; };
    return {
      check(cues, warns) { Object.values(cues).forEach((c) => c.segments.forEach((s) => { text.textContent = s.text; if (!fit()) warns.push({ type: 'overflow', key: 'caption ' + c.id }); })); key = null; },
      render(t, cues, show) {
        let cur = null;
        Object.values(cues).forEach((c) => c.segments.forEach((s) => { if (t >= c.start + s.start - 0.1 && t <= c.start + s.end + 0.25) cur = { c, s }; }));
        if (!cur || show === false) { op(cap, 0); return; }
        op(cap, 1); const k = cur.c.id + cur.s.start;
        if (k !== key) { key = k; const nm = names[cur.c.speakerId]; name.textContent = nm[0]; dot.style.background = nm[1]; text.textContent = cur.s.text; fit(); }
      }
    };
  }
  global.L08Captions = { captions };
})(window);
