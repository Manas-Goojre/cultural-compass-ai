// Client-side Gemini fallback used ONLY when the FastAPI backend is unreachable
// (e.g. on the static GitHub Pages demo). The backend remains the primary,
// judged architecture. Uses Google AI Studio REST directly.

const KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

export const directEnabled = Boolean(KEY);

const SYSTEM = `You are Cultural Compass, an expert AI travel architect specializing in authentic
destination discovery and cultural experiences. You provide grounded, personalized, explainable
recommendations. When uncertain about dates, prices or event schedules, set confidence to "low"
and explain the uncertainty. Never invent specific festival dates, ticket prices or historical
facts you are not confident about. Respond ONLY with valid minified JSON matching the requested shape.`;

async function gen(userPrompt) {
  if (!KEY) throw new Error("AI is not configured");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    }),
  });
  if (res.status === 429) throw new Error("AI is busy (quota). Please retry shortly.");
  if (!res.ok) throw new Error("AI request failed. Please try again.");
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return JSON.parse(text);
}

function ctx(p) {
  return `Traveler profile:
- Interests: ${(p.interests || []).join(", ") || "general exploration"}
- Travel style: ${p.travel_style}
- Budget: ${p.budget_range}
- Duration: ${p.duration_days} days
- Origin: ${p.origin_location || "not specified"}
- Preferred regions: ${(p.preferred_regions || []).join(", ") || "open worldwide"}
- Travel dates: ${p.travel_dates || "flexible"}
- Dietary: ${(p.dietary_preferences || []).join(", ") || "none"}
- Currency: ${p.currency}
- Language: ${p.language}`;
}

export const direct = {
  discover: (p) =>
    gen(`${ctx(p)}

Recommend 4 destinations. JSON shape:
{"summary":string,"destinations":[{"name":string,"country":string,"tagline":string,"why_recommended":string,"best_for":string,"estimated_budget_per_day":string,"confidence":"high|medium|low","grounding_note":string}],"uncertainty_notes":[string]}`),

  culture: (p, destination) =>
    gen(`${ctx(p)}
Destination: ${destination}

Give cultural insights. JSON shape:
{"destination":string,"cultural_overview":string,"local_etiquette":[string],"must_know_phrases":[{"phrase":string,"meaning":string}],"cultural_dos":[string],"cultural_donts":[string],"confidence":"high|medium|low","uncertainty_notes":[string]}`),

  hiddenGems: (p, destination) =>
    gen(`${ctx(p)}
Destination: ${destination}

Find 5 hidden gems. JSON shape:
{"destination":string,"hidden_gems":[{"name":string,"location":string,"why_hidden_gem":string,"why_for_you":string,"best_time_to_visit":string,"confidence":"high|medium|low","grounding_note":string}]}`),

  food: (p, destination) =>
    gen(`${ctx(p)}
Destination: ${destination}

Recommend local food. JSON shape:
{"destination":string,"food_overview":string,"must_try_dishes":[{"name":string,"description":string,"where_to_find":string,"confidence":"high|medium|low"}],"food_districts":[string],"street_food_tips":[string],"uncertainty_notes":[string]}`),

  festivals: (p, destination) =>
    gen(`${ctx(p)}
Destination: ${destination}

Suggest festivals/events. Never invent exact dates. JSON shape:
{"destination":string,"events":[{"name":string,"description":string,"typical_timing":string,"why_relevant":string,"confidence":"high|medium|low","verify_note":string}],"planning_tips":[string],"uncertainty_notes":[string]}`),

  experiences: (p, destination) =>
    gen(`${ctx(p)}
Destination: ${destination}

Recommend 5 authentic experiences. JSON shape:
{"destination":string,"experiences":[{"title":string,"description":string,"why_authentic":string,"why_for_you":string,"estimated_cost":string,"confidence":"high|medium|low","grounding_note":string}]}`),

  itinerary: (p, destination) =>
    gen(`${ctx(p)}
Destination: ${destination}

Create a ${p.duration_days}-day itinerary. JSON shape:
{"destination":string,"trip_title":string,"overview":string,"days":[{"day_number":number,"theme":string,"morning":string,"afternoon":string,"evening":string,"meals":string,"estimated_daily_cost":string,"tips":[string]}],"total_estimated_cost":string,"budget_tips":[string],"uncertainty_notes":[string]}`),

  story: (p, destination, theme) =>
    gen(`${ctx(p)}
Destination: ${destination}
Theme: ${theme || "cultural immersion"}

Write an immersive 3-4 paragraph travel story (paragraphs separated by blank lines). JSON shape:
{"destination":string,"title":string,"story":string,"cultural_threads":[string],"mood":string,"confidence":"high|medium|low","uncertainty_notes":[string]}`),

  refine: (p, prior_summary, refinement_request) =>
    gen(`${ctx(p)}

Prior recommendations summary:
${prior_summary}

User refinement request: ${refinement_request}

Refine accordingly. JSON shape:
{"refined_summary":string,"key_changes":[string],"updated_recommendations":[{"title":string,"detail":string,"why":string,"confidence":"high|medium|low"}],"uncertainty_notes":[string]}`),
};
