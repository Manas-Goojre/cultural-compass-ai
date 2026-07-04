# Project Notes (for humans / cross-tool readers like Cursor)

Antigravity itself reads `.agents/AGENTS.md` (persona/rules, auto-loaded) and
`.agents/skills/fresh-profile-bootstrap/SKILL.md` (interactive setup) automatically — this file is just a
plain-English pointer for anyone browsing the repo, or for other AGENTS.md-aware tools.

## Stack scaffolded here

- `backend/main.py` — FastAPI app: `/health`, `/api/generate` (Vertex AI/Gemini stub), `/api/sample-data`
  (Faker synthetic data).
- `backend/vertex_ai.py` — thin Vertex AI SDK wrapper.
- `backend/synthetic_data.py` — reusable synthetic data generator.
- `frontend/` — Vite + React + Tailwind blank shell wired to the backend `/health` endpoint.

Run backend: `cd backend && uvicorn main:app --reload --port 8000`
Run frontend: `cd frontend && npm run dev`

## First time this is opened on a new machine/profile

Antigravity should proactively offer to run the `fresh-profile-bootstrap` skill (git identity, GitHub
auth, gcloud/Vertex AI auth). If it doesn't trigger automatically, just ask it directly: "run the
fresh-profile-bootstrap skill."
