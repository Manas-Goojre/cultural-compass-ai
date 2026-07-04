# PromptWars Submission Checklist

Based on the official submission guide.

## Prerequisites (before submitting)

- [x] AI platform set up (Cultural Compass AI)
- [x] Git installed and configured
- [x] GitHub account active (`Manas-Goojre`)

## Important Rules

- **Maximum 3 submission attempts** — double-check before submitting
- **Repository size must be < 10 MB** — `node_modules`, `.venv`, `google-cloud-sdk` are gitignored
- **Repository must be public**
- **Single branch only** — all work on `main`

## Steps to Submit

1. **Push code** to public GitHub repository
2. **Copy** the public repository URL
3. **Log in** to [Hack2Skill Portal](https://hack2skill.com)
4. Navigate to **Prompt Wars Dashboard**
5. Go to **Submissions Tab**
6. Paste the **public GitHub repository link**
7. Click **Submit**

## Repository URL

**https://github.com/Manas-Goojre/cultural-compass-ai**

## Live Demo URLs

- **🌐 Live app (GitHub Pages):** https://manas-goojre.github.io/cultural-compass-ai/
- **Local backend:** http://localhost:8000
- **Local frontend:** http://localhost:5173
- **Cloud Run (optional, full backend):** Requires GCP billing on `promptwars-381948` — run `.\deploy.ps1` after enabling billing

> The live site is a static build that calls Gemini directly (API key stored as an encrypted
> GitHub Actions secret, never committed). The FastAPI backend in `/backend` remains the primary
> architecture and runs locally or on Cloud Run.

## Before Submitting on Hack2Skill

1. Verify repo is public and under 10 MB
2. Confirm single branch (`main` only)
3. Copy repo URL: `https://github.com/Manas-Goojre/cultural-compass-ai`
4. Log in to Hack2Skill → Prompt Wars Dashboard → Submissions Tab
5. Paste the GitHub link and submit

## Demo Script

See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for live pitch walkthrough.
