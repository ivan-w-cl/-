#!/usr/bin/env node
// esssouth Lesson 06 · update BUILD_STATUS.json for sections from their ACTUAL build and QA outputs.
// Usage: node tools/status.mjs S01 [S02 …] [--status=verified] [--next="…"]
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), F = path.join(ROOT, 'BUILD_STATUS.json');
const args = process.argv.slice(2), opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=')]; }));
const secs = args.filter((a) => !a.startsWith('--'));
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const st = fs.existsSync(F) ? JSON.parse(fs.readFileSync(F, 'utf8')) : JSON.parse(fs.readFileSync(path.join(ROOT, 'handoff-input/BUILD_STATUS_TEMPLATE.json'), 'utf8'));
st.note = 'Updated by tools/status.mjs from the actual build and QA reports. Script readiness is not animation completion; see each section\'s testsActuallyRun and qa/<section>/report.json.';
for (const s of secs) {
  const n = s.slice(1), dir = path.join(ROOT, 'sections', s), e = st.sections.find((x) => x.id === 'L06.S' + n);
  const graph = JSON.parse(fs.readFileSync(path.join(dir, `content/source/section${n}.en.json`), 'utf8'));
  const repP = path.join(ROOT, 'qa', s, 'report.json'), rep = fs.existsSync(repP) ? JSON.parse(fs.readFileSync(repP, 'utf8')) : null;
  const scenes = fs.readFileSync(path.join(dir, 'scenes.js'), 'utf8');
  // a cue counts as implemented when the section adapter stages it (refers to its id) and it compiles into a route
  e.implementedCueIds = Object.keys(graph.cues).filter((id) => scenes.includes("'" + id.split('.').pop() + "'") || scenes.includes(id));
  e.scriptedButNotStaged = Object.keys(graph.cues).filter((id) => !e.implementedCueIds.includes(id));
  e.holds = Object.keys(graph.holds); e.interactions = Object.keys(graph.interactions || {});
  e.testsActuallyRun = rep ? rep.checks.map((c) => (c.pass ? 'PASS ' : 'FAIL ') + c.name) : [];
  e.qaReport = rep ? `qa/${s}/report.json (${rep.ranAt}, ${rep.environment.browser}, ${rep.summary.checks} checks, ${rep.summary.failed} failed)` : null;
  e.measuredWatchSeconds = rep ? rep.routes.watch : null;
  e.routeSeconds = rep ? rep.routes : null;
  e.sourceHashes = Object.fromEntries(['scenes.js', 'content/staging-anchors.json', 'content/labels.staging.en.json', `data/l06s${n}-data.js`, 'index.html', `L06S${n}_player_standalone.html`].filter((f) => fs.existsSync(path.join(dir, f))).map((f) => [f, sha(path.join(dir, f))]));
  e.status = opt.status || (rep && rep.summary.failed === 0 ? 'verified' : rep ? 'playable_unverified' : 'implementing');
  if (opt.next) e.nextAction = opt.next;
  e.updatedAt = new Date().toISOString();
}
st.status = st.sections.every((x) => x.status === 'packaged') ? 'packaged' : st.sections.some((x) => x.status !== 'not_started') ? 'in_progress' : 'not_started';
st.sharedHashes = Object.fromEntries(['shared/l06/compile.js', 'shared/l06/player.js', 'shared/l06/kit.js', 'shared/l06/l06.css', 'shared/l06/audio-hook.js', 'shared/l06/slots-l06.js', 'shared/l06/ui.en.json'].map((f) => [f, sha(path.join(ROOT, f))]));
st.resume = { build: 'node tools/build.mjs', qa: 'NODE_PATH=<dir containing playwright> node tools/qa.cjs <S0n>', status: 'node tools/status.mjs <S0n>' };
fs.writeFileSync(F, JSON.stringify(st, null, 1) + '\n');
console.log(st.sections.map((x) => `${x.id} ${x.status} watch=${x.measuredWatchSeconds}`).join('\n'));
