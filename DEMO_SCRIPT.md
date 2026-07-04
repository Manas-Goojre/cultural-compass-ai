# Demo Script

## One-sentence pitch

Cultural Compass is an AI travel architect that discovers destinations, reveals authentic local culture, and builds personalized itineraries — with every recommendation explaining *why* it fits you.

## The 3 things I'll click, in order

1. **Sign in with Google** → show authenticated, personalized experience
2. **Plan Your Journey** → select interests (Food, History, Spirituality), style (Heritage), budget → click "Discover Destinations"
3. **Deep dive a destination** → Culture tab → Hidden Gems → Generate Itinerary → Immersive Story → Refine: "Make it more budget-friendly"

## One sentence on the technical/architectural decision worth mentioning

We use a modular prompt pipeline — system prompt, safety layer, context builder, grounding notes, Gemini structured JSON, and response validation — so the AI never concatenates prompts in controllers and always marks uncertainty instead of fabricating facts.

## Backup

Screen recording location: record during verification pass before pitch
