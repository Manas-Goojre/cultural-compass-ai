# Judging Cheat Sheet

Official criteria (from Hack2Skill FAQ): winners are picked on **(1) how well the solution solves the
problem, (2) the quality of your AI prompts / architectural elegance, (3) your live pitch.**

## 1. "How well the solution solves the problem"

- Re-read the exact problem statement out loud before you start building. Underline the verbs (the actions
  the judges will expect to see working).
- One deep, complete flow beats five shallow ones. Judges remember the thing that actually worked when
  clicked live.
- Map your solution explicitly back to the stated problem in the pitch — don't make the judges infer it.

## 2. "Quality of your AI prompts (architectural elegance)"

This is the one most people underweight — they think it's just "did the code work." It's actually being
judged on how you *directed* the AI, not just the output.

- Keep your Planning Mode plan clean, numbered, and legible — assume a judge might actually look at it or
  you might reference it on stage.
- Be ready to briefly narrate your prompting strategy in the pitch: "I planned the data model first, built
  the happy path end-to-end, then used the agent's browser to self-verify before polishing" reads as
  disciplined engineering, not luck.
- Small, scoped prompts that each accomplish one clear thing > one giant vague prompt. If asked how you
  worked, this decomposition IS your answer.
- Mention the one deliberate choice of where Gemini/Vertex AI adds real reasoning value (not "we used AI
  everywhere" — one sharp, well-justified use beats a scattershot one).

## 3. "Live pitch" (5-7 minutes)

- Judges are pattern-matching for confidence + clarity, not comprehensiveness. Practice the pitch out loud
  at least twice tonight using the generic template in `06_PITCH_TEMPLATE.md`, even without knowing the
  problem yet — the structure and timing rehearsal transfers regardless of the actual challenge.
- Demo first, explain second. Open on the working product, not a slide of text.
- Have a fallback: if live Wi-Fi/demo fails on stage, have a 30-second screen recording of the working flow
  ready as backup (record one during your verification pass in Phase 3 of the build).
- End with impact, not features: who does this help and why does it matter, in one sentence.

## Also worth remembering

- It's individual-only — don't reference "we," reference your own decisions and reasoning.
- Leaderboard freezes at lunch and top 10 are announced before pitching — so front-load your best,
  most-complete work before the freeze rather than saving polish for "later."
- Unfair-means disqualifiers are explicit: plagiarism, cheating, multiple accounts. Don't touch those.
