# Preserve the accepted animation style

This is an implementation brief, not a redesign assignment. The reference is working source for the accepted visual language. Reuse the original character rig and drawing components where compatible; do not replace them with newly invented characters or a generic animation library's default assets.

## Concrete identity

| Item | Established value / use |
|---|---|
| Master stage | 1920 x 1080, fixed camera, 16:9 |
| Export | 30 fps |
| Background | #F6F7F9 |
| Surfaces | #FFFFFF |
| Main / secondary text | #202632 / #5D6878 |
| Blue / teal | #356CC8 / #30766D |
| Connectors | #B9C5D6 |
| Soft fills | #E8EFFA / #E6F2EF |
| Reference safe side margin | approximately 96 stage pixels |
| Reference caption area | y=884 to 1024; use measured actual slots |
| Reference type | approximately 58px title, 40px dialogue, 42px captions; inspect the supplied source for actual component values |

Extract and reuse actual radii, borders, shadows, fonts, easing curves, gesture amplitudes, and movement durations from the source. Document which component provides each value. Do not invent a uniform easing or movement duration and call it the original style. Preserve compatible original drawings and geometry byte-for-byte; record deliberate extensions separately.

## Teaching surfaces, not a continuous skit

Full-screen explanation and precise diagrams carry the teaching. Maya, Noah and the learner appear for brief spoken examples and leave when the visual evidence moves to the board. Do not animate idle characters behind every lecture. A cue's visualEn explains its specific teaching job; it is not permission to show a slide of its entire paragraph.

Carry shared idea cards between explanation, dialogue and analysis. Preserve identity through the move. In this lesson, separate an observed pause, unfinished turn, available proposal, open invitation and later reply. Keep any agreed outcome distinct; none is implied by silence or a polite response. Each new excerpt has a visible reset. Use words and card structure as well as colour. A two-lane overlap illustration must remain readable without actual sound, and the full proposal cannot leak into a branch where it has not been offered.

No cinematic camera moves, constant bobbing, spinning titles, reward effects, points or generic transitions between every sentence. Use small anticipations, offset listener reactions and settled poses. Without actual narration, mouths stay closed; generic rhythmic mouth motion is not lip sync.

## New layouts and text

Text must remain editable rather than being outlined into images. Provide slot bounds, preferred/minimum font size, wrapping and line limits, and live overflow checks. Preserve the feel of the accepted typography while allowing longer future text. Critical meaning may not be cropped, silently ellipsized or hidden behind another object.

Test long real strings and 1.3x/1.6x expansion, a long unbroken token, and fallback fonts. Test both settled layouts and movement frames against all clipping ancestors. Reduced motion preserves the same meaning, order, branches and reading opportunities.

On phones the 16:9 scene is a visual illustration, not the only place for readable text. Provide normal-size DOM captions and stacked choices/controls. Aim for 44 CSS-pixel touch controls. Check tablet portrait/landscape without claiming physical-device tests from viewport emulation.
