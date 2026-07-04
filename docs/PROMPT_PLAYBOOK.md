# Prompt Playbook

Copy-adapt these on the day. Swap `{...}` placeholders for the actual problem statement details. Keep the
`01_ANTIGRAVITY_RULES.md` content loaded as your global/root rules first — these prompts assume it's active.

## Phase 0 — Warm-up challenge (before the main challenge)

Purpose: this is a low-stakes calibration round. Use it to confirm Antigravity, your GCP auth, and your
Planning Mode workflow all work on the venue Wi-Fi — not to build something impressive. Don't overthink it.

## Phase 1 — Kickoff / Planning (first 10-15 min of main challenge)

```
Switch to Planning Mode.

Problem statement: {paste the exact secret challenge text here, verbatim}

Constraints: {time budget, e.g. "~2.5 hours total build time"}, individual build, must run live for a demo
and a 5-7 minute pitch.

Do the following, in order:
1. Restate the problem in one sentence and name the single highest-value user flow to nail first.
2. Propose a minimal data model (2-4 entities max) and a short list of API endpoints/functions.
3. Propose the UI as a list of screens/states, ordered by what's needed for the happy-path demo first.
4. Call out the ONE place Gemini/Vertex AI adds real value here (not just "an AI feature" — the specific
   reasoning or generation step it should perform).
5. Flag anything ambiguous in the problem statement and state the assumption you'll run with instead of
   asking me, unless it's truly a fork-in-the-road decision.
6. Output this as a short numbered plan. Do not write code yet.
```

Review the plan for 60 seconds. Cut anything that isn't needed for the happy path. Then:

```
Approved. Scaffold the project: {frontend stack} + {backend stack}, wire up the folder structure, health-
check endpoint, and a blank UI shell that calls it. Stop after that's running end-to-end in the browser
preview — don't build features yet.
```

## Phase 2 — Core build (bulk of the time, small scoped prompts)

Use one scoped prompt per feature, not one mega-prompt. Example pattern:

```
Implement {one specific feature/endpoint/screen}, using the data model and API shape from the plan.
Wire it fully end-to-end (backend logic + frontend UI + the call between them).
When done, use the browser to actually exercise this flow and confirm it works, then tell me in one
sentence what you verified.
```

Repeat for each feature, in priority order from the plan. After each one, do a 10-second gut check: "does
this materially improve the live demo?" If not, defer it.

### Wiring in Vertex AI / Gemini

```
Add a `{feature}` step that calls Gemini via Vertex AI (project: {GCP_PROJECT_ID}, region: us-central1,
using Application Default Credentials — already authenticated on this machine, no new login needed).
Keep the prompt sent to Gemini short, structured, and grounded in the actual request data (no hallucinated
context). Return a typed/structured response the frontend can render directly. Handle the API call failing
gracefully with a clear fallback message, don't let it crash the demo.
```

### Synthetic data

```
Generate a synthetic dataset for {domain, e.g. "patient appointment records" / "student quiz attempts"}:
{N} realistic rows as JSON, matching the data model from the plan. Make it varied enough to make the demo
look real (not all identical), but keep it deterministic (seeded) so the demo behaves the same every run.
Load it into {DB/Firestore/in-memory} at startup.
```

## Phase 3 — Verification pass (after core features exist, ~15-20 min)

```
Act as a skeptical QA reviewer. Use the browser to walk through the entire happy path from a fresh page
load, exactly as a judge would when I demo this live. Take screenshots at each step. List anything that's
broken, confusing, or looks unfinished. Fix only the issues that would visibly hurt a live demo — ignore
cosmetic nitpicks if time is short.
```

## Phase 4 — Polish & demo-readiness (final 15-20 min)

```
We're locking scope now — no new features. Do the following:
1. Remove any placeholder text, console errors, or dead code visible in the UI or logs.
2. Make sure the app loads to a good-looking initial state with no setup steps required on stage.
3. Update DEMO_SCRIPT.md: one-sentence pitch, the exact 2-3 things I'll click during the demo in order, and
   one sentence on the technical/architectural decision worth mentioning to judges.
4. Commit the current state as a checkpoint titled "demo-ready".
```

## Recovery prompt (if something breaks with little time left)

```
This is broken and we have limited time. Don't keep debugging deeper — revert to the last "demo-ready" or
last known-good checkpoint, then reapply only the specific change we need in the smallest possible diff.
```
