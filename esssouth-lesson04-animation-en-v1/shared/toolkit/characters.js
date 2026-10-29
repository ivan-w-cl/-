/*
 * esssouth v3: simple upper-body vector character rig (from v2; adds the "ask" pose, eyeTurn and a slight head turn).
 * Each character is drawn in two SVG groups that share one body transform:
 *   back  = torso, neck and head (drawn behind the table)
 *   front = arms and hands (drawn in front of the table, so hands can rest on it)
 * A pose is a small set of numbers. The renderer blends them, and the rig only draws them.
 * Local origin is the base of the neck. The table top is at local y ~ 238.
 */
(function (global) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  const f = (v) => (+v).toFixed(2);

  // Arm targets [elbowX, elbowY, handX, handY], written for the arm nearer the person
  // being addressed, as if that person sat to the right (+x). The renderer mirrors them.
  const ARM = {
    rest:      [150, 182, 72, 238],
    restIn:    [138, 196, 58, 236],
    palmOut:   [178, 150, 252, 72],
    palmSmall: [166, 168, 214, 128],
    sweep:     [190, 146, 296, 156],
    chest:     [138, 166, 34, 104],
    chin:      [156, 140, 54, -40],
    offer:     [176, 160, 236, 112],
    raise:     [196, -10, 206, -158],
    clasp:     [140, 192, 26, 218]
  };

  // Pose library. lean: degrees toward the person addressed (negative = back away).
  // tilt: head tilt in degrees. nod/shake: oscillation amplitude in degrees.
  // brow: -1 furrowed .. +1 raised. inner: 0..1 inner brows up (concern).
  // mouth: -1 down .. +1 smile. gazeY: 0 level .. 1 looking down.
  const POSES = {
    neutral:     { lean: 0,  tilt: 0,  nod: 0, shake: 0, brow: 0,    inner: 0,   mouth: 0.15, near: 'rest',      far: 'rest' },
    listen:      { lean: 1.5, tilt: 2, nod: 0, shake: 0, brow: 0.1,  inner: 0,   mouth: 0.2,  near: 'rest',      far: 'rest' },
    wait:        { lean: 1,  tilt: 0,  nod: 0, shake: 0, brow: 0,    inner: 0,   mouth: -0.05, near: 'rest',     far: 'rest' },
    speak:       { lean: 2,  tilt: 1,  nod: 0, shake: 0, brow: 0.3,  inner: 0,   mouth: 0.25, near: 'palmOut',   far: 'rest' },
    abrupt:      { lean: 3,  tilt: -2, nod: 0, shake: 3, brow: -1,   inner: 0,   mouth: -0.55, near: 'sweep',    far: 'rest' },
    stung:       { lean: -2, tilt: -3, nod: 0, shake: 0, brow: 0.8,  inner: 0.6, mouth: -0.2, near: 'rest',      far: 'rest' },
    withdrawn:   { lean: -3, tilt: -6, nod: 0, shake: 0, brow: 0.15, inner: 1,   mouth: -0.4, near: 'clasp',     far: 'clasp', gazeY: 1 },
    glance:      { lean: 0,  tilt: 2,  nod: 0, shake: 0, brow: 0.45, inner: 0.4, mouth: -0.1, near: 'rest',      far: 'rest' },
    disengaged:  { lean: -1, tilt: 5,  nod: 0, shake: 0, brow: 0,    inner: 0.2, mouth: -0.2, near: 'restIn',    far: 'rest', gazeY: 1 },
    think:       { lean: 0,  tilt: 4,  nod: 0, shake: 0, brow: 0.25, inner: 0.2, mouth: 0,    near: 'chin',      far: 'rest' },
    acknowledge: { lean: 3,  tilt: 4,  nod: 3, shake: 0, brow: 0.4,  inner: 0,   mouth: 0.5,  near: 'palmOut',   far: 'rest' },
    warm:        { lean: 2,  tilt: 4,  nod: 0, shake: 0, brow: 0.3,  inner: 0,   mouth: 0.6,  near: 'rest',      far: 'rest' },
    explain:     { lean: 2,  tilt: 0,  nod: 0, shake: 0, brow: 0.2,  inner: 0.35, mouth: 0.15, near: 'chest',    far: 'rest' },
    propose:     { lean: 3,  tilt: 2,  nod: 0, shake: 0, brow: 0.5,  inner: 0,   mouth: 0.4,  near: 'offer',     far: 'offer' },
    consider:    { lean: 1,  tilt: 6,  nod: 0, shake: 0, brow: 0.3,  inner: 0.1, mouth: 0.2,  near: 'chin',      far: 'rest' },
    agree:       { lean: 3,  tilt: 3,  nod: 5, shake: 0, brow: 0.3,  inner: 0,   mouth: 0.7,  near: 'palmSmall', far: 'rest' },
    lean:        { lean: 4,  tilt: 2,  nod: 0, shake: 0, brow: 0.3,  inner: 0,   mouth: 0.3,  near: 'restIn',    far: 'restIn' },
    question:    { lean: 4,  tilt: 4,  nod: 0, shake: 0, brow: 0.8,  inner: 0.2, mouth: 0.2,  near: 'raise',     far: 'rest' },
    ask:         { lean: 3,  tilt: -4, nod: 0, shake: 0, brow: 0.7,  inner: 0.45, mouth: 0,   near: 'palmSmall', far: 'rest' }
  };

  function hairBack(g, r) {
    if (r.hairStyle === 'bob') {
      s('path', { d: 'M -86 -118 C -90 -196 90 -196 86 -118 L 90 -46 C 70 -34 50 -38 44 -50 L -44 -50 C -50 -38 -70 -34 -90 -46 Z', fill: r.hair }, g);
    }
  }
  function hairFront(g, r) {
    if (r.hairStyle === 'bob') {
      s('path', { d: 'M -74 -126 C -84 -176 -40 -202 4 -202 C 52 -202 84 -174 78 -118 C 40 -128 2 -150 -14 -172 C -30 -146 -52 -132 -74 -126 Z', fill: r.hair }, g);
    } else if (r.hairStyle === 'curls') {
      const c = [[-62, -150, 26], [-38, -178, 28], [-6, -190, 30], [28, -184, 28], [56, -162, 26], [70, -136, 20], [-74, -124, 18]];
      c.forEach(([x, y, rr]) => s('circle', { cx: x, cy: y, r: rr, fill: r.hair }, g));
    } else {
      s('path', { d: 'M -74 -118 C -84 -168 -48 -202 2 -202 C 54 -202 86 -168 74 -120 C 58 -146 28 -158 -6 -156 C -38 -154 -60 -140 -74 -118 Z', fill: r.hair }, g);
    }
  }
  function neckline(g, r) {
    if (r.neck === 'vneck') s('path', { d: 'M -44 -12 L 0 44 L 44 -12', fill: 'none', stroke: r.topShade, 'stroke-width': 8, 'stroke-linejoin': 'round' }, g);
    if (r.neck === 'hood') s('path', { d: 'M -92 -4 C -70 40 70 40 92 -4', fill: 'none', stroke: r.topShade, 'stroke-width': 18, 'stroke-linecap': 'round' }, g);
    if (r.neck === 'collar') {
      s('path', { d: 'M -40 -14 L -6 30 L -48 18 Z', fill: '#F4F2EE' }, g);
      s('path', { d: 'M 40 -14 L 6 30 L 48 18 Z', fill: '#F4F2EE' }, g);
    }
  }

  function create(def, backParent, frontParent) {
    const r = def.rig;
    const back = s('g', {}, backParent);
    const front = s('g', {}, frontParent);
    const body = s('g', {}, back);
    s('path', { d: 'M -154 70 C -154 14 -110 -10 -62 -14 L 62 -14 C 110 -10 154 14 154 70 L 168 420 L -168 420 Z', fill: r.top }, body);
    neckline(body, r);
    s('rect', { x: -22, y: -46, width: 44, height: 40, rx: 12, fill: r.skin }, body);
    const head = s('g', {}, body);
    hairBack(head, r);
    const ears = s('g', {}, head);
    const earL = s('ellipse', { cx: -68, cy: -108, rx: 12, ry: 18, fill: r.skin }, ears);
    const earR = s('ellipse', { cx: 68, cy: -108, rx: 12, ry: 18, fill: r.skin }, ears);
    s('ellipse', { cx: 0, cy: -112, rx: 68, ry: 80, fill: r.skin }, head);
    const hairF = s('g', {}, head); hairFront(hairF, r);
    const face = s('g', {}, head);
    const eyes = [-25, 25].map((x) => s('ellipse', { cx: x, cy: -106, rx: 7, ry: 8.5, fill: '#1E2330' }, face));
    const brows = [-1, 1].map(() => s('path', { fill: 'none', stroke: r.hair === '#6B4A2E' ? '#4A3220' : r.hair, 'stroke-width': 6, 'stroke-linecap': 'round' }, face));
    s('path', { d: 'M 2 -96 Q 8 -84 0 -80', fill: 'none', stroke: 'rgba(60,30,20,.35)', 'stroke-width': 4, 'stroke-linecap': 'round' }, face);
    const mouth = s('path', { stroke: '#6B3A30', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, face);
    let glasses = null;
    if (r.glasses) {
      glasses = s('g', { fill: 'none', stroke: '#2E3442', 'stroke-width': 4.5 }, face);
      s('rect', { x: -46, y: -122, width: 40, height: 32, rx: 10 }, glasses);
      s('rect', { x: 6, y: -122, width: 40, height: 32, rx: 10 }, glasses);
      s('path', { d: 'M -6 -108 L 6 -108' }, glasses);
    }
    // arms (front group, same body transform)
    const arms = s('g', {}, front);
    const armPath = [0, 1].map(() => s('path', { fill: 'none', stroke: r.top, 'stroke-width': 50, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, arms));
    const cuff = [0, 1].map(() => s('circle', { r: 25, fill: r.topShade }, arms));
    const hand = [0, 1].map(() => s('circle', { r: 23, fill: r.skin }, arms));

    function update(p) {
      // body: lean toward the person addressed, pivoting at the hips; leaning in also drops it slightly
      const rot = p.lean * p.dir * 0.9;
      const bt = `translate(${f(def.seatX)} ${f(520 + p.lean * 1.6)}) rotate(${f(rot)} 0 420)`;
      back.setAttribute('transform', bt); front.setAttribute('transform', bt);
      // head: tilt + a small yaw-like lean toward the person addressed + nod/shake, pivot at the neck
      const hr = p.tilt * (p.dir || 1) + p.turn * 2.5 + p.shakeNow;
      head.setAttribute('transform', `translate(0 ${f(p.nodNow * 0.8)}) rotate(${f(hr)} 0 -40)`);
      // turning: features slide toward the target; ears and hair counter-shift a little
      const tx = p.turn * 16, gy = p.gazeY * 7 + p.nodNow * 0.6;
      face.setAttribute('transform', `translate(${f(tx)} ${f(gy * 0.6)})`);
      hairF.setAttribute('transform', `translate(${f(p.turn * 6)} 0)`);
      earL.setAttribute('cx', f(-68 + Math.max(0, p.turn) * 8)); earR.setAttribute('cx', f(68 + Math.min(0, p.turn) * 8));
      // eyes: pupils follow gaze (eyeTurn leads the head turn slightly), blink squashes them
      const et = p.eyeTurn != null ? p.eyeTurn : p.turn;
      eyes.forEach((e, i) => {
        e.setAttribute('cx', f((i ? 25 : -25) + p.turn * 2 + et * 4));
        e.setAttribute('cy', f(-106 + p.gazeY * 4));
        e.setAttribute('ry', f(p.blink ? 1.4 : 8.5 - p.gazeY * 2.5));
      });
      // brows: lift with brow; inner ends rise with concern or drop with a furrow
      brows.forEach((b, i) => {
        const sgn = i ? 1 : -1;
        const lift = -p.brow * 7;
        const innerY = -134 + lift - p.inner * 8 + Math.max(0, -p.brow) * 9;
        const outerY = -136 + lift + p.inner * 2;
        b.setAttribute('d', `M ${f(sgn * 14)} ${f(innerY)} Q ${f(sgn * 26)} ${f((innerY + outerY) / 2 - 4)} ${f(sgn * 40)} ${f(outerY)}`);
      });
      // mouth: curve (smile/frown) + openness while speaking
      const my = -74, c = p.mouth * 9, o = p.open * 16, w = 18 + Math.max(0, p.mouth) * 5;
      if (o > 0.6) {
        mouth.setAttribute('d', `M ${-w} ${my} Q 0 ${f(my + c)} ${w} ${my} Q 0 ${f(my + c + o)} ${-w} ${my} Z`);
        mouth.setAttribute('fill', '#6B3A30');
      } else {
        mouth.setAttribute('d', `M ${-w} ${f(my - c * 0.3)} Q 0 ${f(my + c)} ${w} ${f(my - c * 0.3)}`);
        mouth.setAttribute('fill', 'none');
      }
      // arms
      [p.armL, p.armR].forEach((a, i) => {
        const sx = i ? 118 : -118;
        armPath[i].setAttribute('d', `M ${sx} 26 L ${f(a[0])} ${f(a[1])} L ${f(a[2])} ${f(a[3])}`);
        cuff[i].setAttribute('cx', f(a[2] + (a[0] - a[2]) * 0.08)); cuff[i].setAttribute('cy', f(a[3] + (a[1] - a[3]) * 0.08));
        hand[i].setAttribute('cx', f(a[2])); hand[i].setAttribute('cy', f(a[3]));
      });
    }
    return { def, update, back, front };
  }

  global.EsssouthRig = { create, POSES, ARM };
})(window);
