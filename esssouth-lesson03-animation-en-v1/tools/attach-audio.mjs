#!/usr/bin/env node
// esssouth Lesson 03 · attach recorded narration later (downstream pass). NOT used in this silent review.
// Usage: node tools/attach-audio.mjs S01 <mapping.json> [--dry-run]
//   mapping.json = { "lang": "en", "scriptSource": "content/source/section01.en.json", "clips": { "L03.S01.c001": "audio/en/L03.S01.c001.m4a", … } }
// For each clip: checks the cue exists in the authoritative graph, the file exists, and measures its duration with ffprobe.
// Writes content/audio-slots.<lang>.json (a NEW file; the supplied source slots stay unchanged) and reports missing /
// undecodable clips explicitly. Rebuild with: node tools/build.mjs S01 --audio=<lang>   (the player then uses measured
// voice lengths; holds, motion durations and branch order are unchanged; anchors keep their relative place).
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [sec, mapFile] = process.argv.slice(2).filter((a) => !a.startsWith('--')), dry = process.argv.includes('--dry-run');
if (!sec || !mapFile) { console.error('usage: node tools/attach-audio.mjs S01 mapping.json [--dry-run]'); process.exit(1); }
const dir = path.join(ROOT, 'sections', sec), n = sec.slice(1), graph = JSON.parse(fs.readFileSync(path.join(dir, `content/source/section${n}.en.json`), 'utf8'));
const map = JSON.parse(fs.readFileSync(mapFile, 'utf8')), lang = map.lang; if (!lang) throw new Error('mapping needs an explicit "lang"');
const slots = JSON.parse(fs.readFileSync(path.join(dir, 'content/source/audio-slots.en.json'), 'utf8')); const out = { sectionId: graph.sectionId, lang, scriptSource: map.scriptSource || null, status: 'Attached by tools/attach-audio.mjs', slots: {} }, problems = [];
Object.keys(graph.cues).forEach((id) => { const rel = map.clips[id], s = Object.assign({}, slots.slots[id], { lang, path: rel || null, durationSeconds: null });
  if (!rel) problems.push({ id, problem: 'no clip mapped' });
  else { const abs = path.join(dir, rel); if (!fs.existsSync(abs)) problems.push({ id, problem: 'file missing', rel });
    else if (!dry) { try { s.durationSeconds = +execFileSync(process.env.FFPROBE || 'ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', abs]).toString().trim(); } catch (e) { problems.push({ id, problem: 'undecodable', rel }); } } }
  out.slots[id] = s; });
Object.keys(map.clips).filter((id) => !graph.cues[id]).forEach((id) => problems.push({ id, problem: 'not a cue of this section' }));
console.log(JSON.stringify({ section: sec, lang, mapped: Object.keys(map.clips).length, cues: Object.keys(graph.cues).length, problems }, null, 1));
if (!dry) fs.writeFileSync(path.join(dir, `content/audio-slots.${lang}.json`), JSON.stringify(out, null, 1) + '\n');
