---
name: fresh-profile-bootstrap
description: Use this at the start of the very first conversation in this workspace, before anything else, and whenever the user asks to set up / configure / bootstrap their environment for the PromptWars competition (git identity, GitHub auth, gcloud auth, Vertex AI access, missing CLI tools).
---

# Fresh Profile Bootstrap

Goal: take a brand-new OS user profile from zero to "ready to build" through a short interactive
back-and-forth — never a silent wall of commands, and never re-asking about something already confirmed
working.

## Step 0 — Read the snapshot, don't re-derive it

A task auto-runs `scripts/check_environment.ps1` when this folder is opened and writes the result to
`scripts/last_check.txt`. On your very first turn in this workspace, read that file if it exists. If it
doesn't exist (task didn't run, or the user disallowed automatic tasks), run the script yourself now.
Never ask the user a question you can answer by reading this file.

Summarize the snapshot back to the user in one short paragraph — what's already fine, what needs attention
— before touching anything. Then go section by section below, **only for the items that actually need
attention**, one at a time: state the single next action in plain language, wait for confirmation, verify,
move on.

## Section 1 — Missing CLI tools

For anything reported `installed=False` (git, gh, gcloud, node, python), install via winget rather than
sending the user to a browser to download installers manually:

```powershell
winget install --id Git.Git -e --silent
winget install --id GitHub.cli -e --silent
winget install --id Google.CloudSDK -e --silent
winget install --id OpenJS.NodeJS.LTS -e --silent
winget install --id Python.Python.3.13 -e --silent
```

Tell the user a terminal restart may be required after installing for PATH changes to take effect — if a
command isn't found right after install, that's why; ask them to reopen the terminal/Antigravity once.

## Section 2 — Git identity

If `user.name`/`user.email` are NOT SET, or belong to someone other than the person now using this
profile, ask for their name and personal email, then run:

```bash
git config --global user.name "<name>"
git config --global user.email "<email>"
```

## Section 3 — GitHub CLI auth (personal account)

If not authenticated (or authenticated as the wrong account), tell the user to run `gh auth login`
themselves — interactive browser login, don't script around the OAuth flow — choosing: GitHub.com → HTTPS
→ Login with a web browser. Wait for confirmation, then re-verify with `gh auth status`.

## Section 4 — GCP / gcloud auth

If not authenticated (or authenticated as the wrong account):

```bash
gcloud auth login
gcloud auth application-default login
```

Both require an interactive browser login — tell the user to run them and complete the browser flow, then
confirm back.

If no project is set (or the wrong one), ask whether to reuse an existing project or create a new one:

```bash
gcloud projects create promptwars-<random-suffix> --name="PromptWars Build"
gcloud config set project <PROJECT_ID>
```

Remind them billing must be enabled on the project for Vertex AI to work.

## Section 5 — Enable required APIs + Firestore

```bash
gcloud services enable aiplatform.googleapis.com firestore.googleapis.com run.googleapis.com cloudbuild.googleapis.com
gcloud firestore databases create --location=us-central1 --type=firestore-native
```

Skip Firestore creation if `gcloud firestore databases list` already shows one.

## Section 6 — Local env vars + smoke test

```powershell
setx GOOGLE_CLOUD_PROJECT "<PROJECT_ID>"
setx GOOGLE_CLOUD_REGION "us-central1"
```

Tell the user to restart the terminal once for `setx` to take effect, then:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -c "import vertex_ai; print(vertex_ai.generate('Reply with exactly: setup OK'))"
```

Confirm it prints `setup OK` (or close to it) before declaring the environment ready.

## Step 7 — Wrap-up

State plainly: "Environment is ready — git, GitHub, and GCP/Vertex AI are all authenticated on this
profile." Do not start building any feature code as part of this skill — that only starts once the actual
challenge is revealed tomorrow.
