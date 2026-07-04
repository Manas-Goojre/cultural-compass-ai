# Timeboxing Plan

Official timeline: Main challenge runs 11:30 AM - 2:30 PM (3 hours), but "Lunch & leaderboard freeze" is
1:00-2:00 PM overlapping the tail of it — meaning your work is likely evaluated/frozen around the 1:00 PM
mark for the leaderboard, with the last window used for anyone still finishing. Build a plan that gets you
to "demo-ready" **before 1:00 PM**, and treat anything after as bonus polish, not core-feature time.

Assume roughly a 3-hour budget (adjust down if your city's schedule differs) and front-load ruthlessly.

| Time (elapsed) | Phase | Goal |
|---|---|---|
| 0:00 - 0:10 | Read & decide | Read the problem statement twice. Pick the ONE user flow that most directly answers it. Write it as a single sentence. |
| 0:10 - 0:25 | Plan (Antigravity Planning Mode) | Data model, endpoints, screens, the one Gemini use-case. Review and trim the plan yourself — don't let it grow past 8 steps. |
| 0:25 - 0:35 | Scaffold | Frontend + backend running end-to-end with a blank shell (use the starter template to skip most of this). |
| 0:35 - 1:35 | Core build | Implement features in priority order, one scoped prompt at a time. Checkpoint (commit) after each working feature. |
| 1:35 - 1:50 | Synthetic data + wiring | Load realistic data, make sure the demo doesn't look empty/fake. |
| 1:50 - 2:10 | Verification pass | Browser-agent walkthrough of the full happy path as a judge would see it. Fix only demo-breaking issues. |
| 2:10 - 2:10 | Leaderboard freeze checkpoint | This is your target "done" point. Commit as "demo-ready" and record a 30-sec backup screen capture now. |
| 2:10 - 2:40 | Polish (bonus time) | Remove placeholders/console errors, tighten UI, update DEMO_SCRIPT.md. No new features. |
| 2:40 - 3:00 | Pitch prep | Rehearse the pitch out loud twice using `06_PITCH_TEMPLATE.md`, timed with a stopwatch. |

## Hard rules for yourself

- If a feature isn't done by its checkpoint time, cut it — don't let it eat the next feature's slot.
- Never spend more than ~10 minutes stuck on one bug before reverting to the last checkpoint (see the
  Recovery Prompt in `02_PROMPT_PLAYBOOK.md`).
- The moment the happy path works end-to-end, record the 30-second backup video. Do this early and re-record
  after major changes — don't leave it to the last minute.
