# Deploy to Google Cloud Run (requires billing enabled on promptwars-381948)
# Run from PromptWars-Workspace root

$GCLOUD = "$PSScriptRoot\google-cloud-sdk\google-cloud-sdk\bin\gcloud.cmd"
$PROJECT = "promptwars-381948"
$REGION = "us-central1"

Write-Host "=== Deploying Backend ===" -ForegroundColor Cyan
Push-Location "$PSScriptRoot\backend"
& $GCLOUD run deploy cultural-compass-api `
  --source . `
  --project $PROJECT `
  --region $REGION `
  --allow-unauthenticated `
  --set-env-vars "GEMINI_MODEL=gemini-2.5-flash,GOOGLE_CLOUD_PROJECT=$PROJECT,GOOGLE_CLOUD_REGION=$REGION,AUTH_REQUIRED=false,CORS_ORIGINS=*" `
  --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest"
Pop-Location

$BACKEND_URL = & $GCLOUD run services describe cultural-compass-api --project $PROJECT --region $REGION --format="value(status.url)"
Write-Host "Backend URL: $BACKEND_URL" -ForegroundColor Green

Write-Host "=== Deploying Frontend ===" -ForegroundColor Cyan
Push-Location "$PSScriptRoot\frontend"
& $GCLOUD run deploy cultural-compass-web `
  --source . `
  --project $PROJECT `
  --region $REGION `
  --allow-unauthenticated `
  --build-env-vars "VITE_API_BASE=$BACKEND_URL"
Pop-Location

$FRONTEND_URL = & $GCLOUD run services describe cultural-compass-web --project $PROJECT --region $REGION --format="value(status.url)"
Write-Host "Frontend URL: $FRONTEND_URL" -ForegroundColor Green
Write-Host "Update Google OAuth authorized origins with: $FRONTEND_URL" -ForegroundColor Yellow
