# Watch and Practice

## Shared rules

One authoritative graph drives both modes. The combined lesson does not maintain a second set of content. No interaction observes real speech, makes AI decisions or awards grades. Branch consequences are authored examples, not predictions of a person's feelings or proof that a response always works.

S01/S04/S05/S07 contain shared reflection and explanation. Watch and Practice use the same route in those sections. Where a model appears, keep it separate from the private response. Do not add a model after every hold unless the section script calls for one. Keep private areas blank and say neither that the learner answered nor that they improved.

## Choice gates: L03.I01 in S02; L03.I02 in S03

The JSON declares exact prompt, choices, branch cues, Watch choice and common rejoin. Watch shows a thinking opportunity then only its declared path: I01=B; I02=C. Other paths remain available in Practice; do not concatenate them as one conversation.

Practice state flow: awaiting_choice -> branch_playing -> branch_ready -> common continuation. Awaiting_choice has no timeout. Play, Space, rate change or background elapsed time cannot select a choice. First valid selection wins while branch playback is active. Repeated taps cannot create parallel loops or duplicate spoken cues. Branch end waits for Continue. Retry restores exactly the same task, quote, options and proposal state; no earlier branch outcome survives. Skip stores an unanswered state and enters common content once without correctness or praise.

Seek forward across an unvisited gate stops at that gate. Seek before it resets the attempt. While inside a branch, seek is branch-local and cannot accidentally play another branch or common audio. A mode switch in a gate resets to that mode's declared entry. Outside a gate, map the common cue and offset where possible. Restart resets the section, not the entire course silently.

## Private rehearsal: L03.I03 in S06

Watch: 35-second private opportunity, then d101, d102, f101, then common c008. Practice: wait indefinitely. Actions are Show a possible reply, Skip, Try again and Continue. Model playback is a separate track; reaching its end sets only modelViewed=true. It does not set speakingObserved, completionAssumed or proposalAdopted. Continue rejoins c008 once; Skip does the same without model playback. Try again restores the blank private baseline.

The corrected exchange before the gate is explicitly an authored example. The model's Noah follow-up is authored too; it is not a response to real learner speech. Common continuation must be accurate after trying, model viewing or skipping.

Initial flags include responseText=null, modelViewed=false, speakingObserved=false, completionAssumed=false and proposalAdopted=false. No local storage of answers, recording, microphone prompt, transcript, upload or score. Merely opening this section must not request audio capture permission.

## Transport and future audio

Every mode and branch must use one active playback clock. Pause/seek/restart/mode/section changes cancel old scheduling. Future audio may not cross a waiting gate ahead of the visual clock. Apply 1/1.25/1.5/2 rates consistently; caption and visual timings follow media time. Preserve pitch when real recorded audio is later used. A silent review only establishes timing and transport, not audible quality.

The progress display reflects the common section position, with separate branch/model progress when needed. Unlimited waiting is not fabricated elapsed lesson time. There is no automatic next-section navigation or purchase gate.
