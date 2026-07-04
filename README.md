# Cultural Compass AI

AI-first travel platform for **PromptWars — Destination Discovery & Cultural Experiences**.

Discover destinations, explore authentic culture, generate itineraries, and experience immersive AI storytelling — powered by Google Gemini.

**🌐 Live demo:** https://manas-goojre.github.io/cultural-compass-ai/

## Features

- Personalized destination discovery with explainable recommendations
- Cultural insights, hidden gems, local food, festivals & experiences
- Multi-day AI itinerary generation
- Immersive travel storytelling
- Natural-language refinement chat
- Google Sign-In authentication
- Modular prompt architecture with structured JSON responses
- Uncertainty transparency (no fabricated facts)

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Google OAuth
- **Backend:** FastAPI, Pydantic, modular prompt pipeline
- **AI:** Google AI Studio (Gemini 2.5 Flash)

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env     # configure GEMINI_API_KEY and GOOGLE_CLIENT_ID
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env     # set VITE_GOOGLE_CLIENT_ID and VITE_API_BASE
npm run dev
```

Open http://localhost:5173

## Google OAuth Setup

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials?project=promptwars-381948)
2. Create **OAuth 2.0 Client ID** (Web application)
3. Authorized JavaScript origins: `http://localhost:5173` + your deployed URL
4. Copy Client ID to `backend/.env` (`GOOGLE_CLIENT_ID`) and `frontend/.env` (`VITE_GOOGLE_CLIENT_ID`)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/google` | Verify Google credential |
| POST | `/api/travel/destinations/discover` | Discover destinations |
| POST | `/api/travel/culture/insights` | Cultural insights |
| POST | `/api/travel/destinations/hidden-gems` | Hidden gems |
| POST | `/api/travel/food/recommend` | Food recommendations |
| POST | `/api/travel/festivals/suggest` | Festival suggestions |
| POST | `/api/travel/experiences/recommend` | Local experiences |
| POST | `/api/travel/itinerary/generate` | Itinerary generation |
| POST | `/api/travel/story/generate` | Immersive storytelling |
| POST | `/api/travel/refine` | Refine recommendations |

## Submission (PromptWars)

See [SUBMISSION.md](./SUBMISSION.md) for Hack2Skill submission checklist.

## License

Built for PromptWars Challenge promptwars-381948.
