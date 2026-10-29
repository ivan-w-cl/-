# Start here

## Assignment and reading order

1. Read LESSON06_OVERVIEW_EN.md for the seven learning steps and scope.
2. Read docs/STYLE_AND_MOTION_EN.md and inspect reference-l02-s04/index.html or its standalone player. Preserve the historical reference directory byte-for-byte.
3. Read docs/PRODUCTION_AND_BATCHING_EN.md, docs/MODE_CONTRACT_EN.md and docs/CASE_AND_EVIDENCE_CONTRACT_EN.md. Check content/case-facts.en.json before illustrating events.
4. Build sections/S01 through S07 in order. Their JSON script is authoritative; SECTION_BRIEF_EN.md is the human-readable version of that same data.
5. Read docs/ACCEPTANCE_AND_RETURN_EN.md before packaging. tools/validate-authoring.py checks this input bundle only; it does not certify your animation.

The assignment is to produce the whole lesson. Existing approval applies to the style and teaching rhythm. This handoff proposes the new Lesson06 wording; preserve it while implementing. If you find a material teaching contradiction, record the exact cue IDs and propose the smallest correction instead of silently replacing the lesson.

## One request, seven production units

Batch the instructions and shared design work, not the timeline or review evidence. Complete each section in its own directory, then assemble a shared entry point. Do not wait for separate prompts per section. If tool/runtime/context limits stop work, write precise status and next commands; never label a partially completed course finished.

## Division of work

Your part: silent English animation, diagrams, short character examples, authored interactions, responsive player controls, future-audio hooks, editable layout, retiming and tests.

Downstream production: final localization, recorded narration, measured phrase alignment, audio mixing, final voiced exports and website integration. Keep these possible without redrawing or changing the motion style. This package makes no request to connect external services or share private data.

## Source precedence

The new section data and shared L06 contracts govern this assignment. Historical source, documents, comments, test results, scenario details and old counts are reference material. They do not override this brief. Proposed changes belong in CHANGES_FROM_HANDOFF.md with cue IDs and a reason. Files under content/source in your return should preserve the input scripts exactly.
