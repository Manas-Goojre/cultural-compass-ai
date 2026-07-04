# GCP / Vertex AI Setup — Do This Tonight, Not At The Venue

Goal: walk in already authenticated, with a GCP project + Vertex AI + a DB ready, so Antigravity can call
Gemini and read/write data from the very first prompt. Venue Wi-Fi is often locked down or slow — OAuth
browser-login flows for `gcloud` are exactly the kind of thing that fails on captive-portal/conference Wi-Fi.
Do the login step at home tonight.

## 1. Install/verify the gcloud CLI

```bash
gcloud --version
```

If not installed: https://cloud.google.com/sdk/docs/install (Windows installer, then restart your terminal).

## 2. Authenticate (do this tonight, on your home network)

```bash
gcloud auth login
gcloud auth application-default login
```

The second command is the important one — it's what lets local code (and Antigravity's agent) call Google
Cloud APIs using your identity without you re-authenticating tomorrow.

## 3. Create or select a project

```bash
gcloud projects create promptwars-build-$(Get-Random) --name="PromptWars Build"
gcloud config set project <YOUR_PROJECT_ID>
```

(You can also just reuse an existing personal GCP project if you have one with billing enabled — Vertex AI
requires billing to be enabled on the project, even within the free-tier/credit allowance.)

## 4. Enable the APIs you'll need

```bash
gcloud services enable aiplatform.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

- `aiplatform.googleapis.com` = Vertex AI (Gemini models, agent tooling)
- `firestore.googleapis.com` = your "GCP db" for structured/document data
- `run.googleapis.com` + `cloudbuild.googleapis.com` = only needed if you want to deploy a live URL during
  the pitch instead of just running locally. Optional but nice if the pitch room has decent Wi-Fi.

## 5. Create a Firestore database

```bash
gcloud firestore databases create --location=us-central1 --type=firestore-native
```

## 6. Set environment variables (add to your shell profile so they persist)

```bash
setx GOOGLE_CLOUD_PROJECT "<YOUR_PROJECT_ID>"
setx GOOGLE_CLOUD_REGION "us-central1"
```

Restart your terminal after `setx` for the variables to take effect.

## 7. Backup auth: service-account key (in case ADC/OAuth misbehaves on venue Wi-Fi)

```bash
gcloud iam service-accounts create promptwars-sa --display-name="PromptWars Build SA"
gcloud projects add-iam-policy-binding <YOUR_PROJECT_ID> \
  --member="serviceAccount:promptwars-sa@<YOUR_PROJECT_ID>.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
gcloud projects add-iam-policy-binding <YOUR_PROJECT_ID> \
  --member="serviceAccount:promptwars-sa@<YOUR_PROJECT_ID>.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=promptwars-sa@<YOUR_PROJECT_ID>.iam.gserviceaccount.com
```

Keep `gcp-key.json` on your laptop (don't commit it to any repo/zip you hand in). If ADC breaks on the day,
point at it directly:

```bash
setx GOOGLE_APPLICATION_CREDENTIALS "C:\path\to\gcp-key.json"
```

## 8. Python client libraries (pre-install so there's no pip install lag tomorrow)

```bash
pip install google-cloud-aiplatform google-cloud-firestore fastapi uvicorn python-dotenv faker
```

## 9. Smoke test — run this tonight to confirm everything actually works end-to-end

```python
import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(project="<YOUR_PROJECT_ID>", location="us-central1")
model = GenerativeModel("gemini-2.0-flash")
response = model.generate_content("Reply with exactly: PromptWars setup OK")
print(response.text)
```

If this prints `PromptWars setup OK` (or similar), you're fully ready. If it fails, fix it tonight — not
during your 2-3 hour build window tomorrow.

## 10. Quota sanity check

Vertex AI free-tier/trial quota can be tight. Check you're not about to hit a hard quota ceiling:

```bash
gcloud alpha services quota list --service=aiplatform.googleapis.com --consumer=projects/<YOUR_PROJECT_ID>
```

If you're on a brand-new free-trial project, consider requesting a quota bump or attaching a real billing
account a day in advance — quota increase requests are not instant.
