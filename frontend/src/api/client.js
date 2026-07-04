import { direct, directEnabled } from "./geminiDirect";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export function getAuthToken() {
  return localStorage.getItem("cc_auth_token");
}

export function setAuthToken(token) {
  if (token) localStorage.setItem("cc_auth_token", token);
  else localStorage.removeItem("cc_auth_token");
}

export function getUser() {
  const raw = localStorage.getItem("cc_user");
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user) {
  if (user) localStorage.setItem("cc_user", JSON.stringify(user));
  else localStorage.removeItem("cc_user");
}

async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || "Request failed");
  return data;
}

// Try the backend first; if it is unreachable (e.g. static demo), fall back to
// the client-side Gemini path when available.
async function withFallback(backendCall, directCall) {
  try {
    return await backendCall();
  } catch (err) {
    const networkFailure = err instanceof TypeError; // fetch could not reach backend
    if (directEnabled && (networkFailure || !import.meta.env.VITE_API_BASE)) {
      return await directCall();
    }
    throw err;
  }
}

export const api = {
  health: async () => {
    try {
      return await apiFetch("/health");
    } catch {
      return {
        status: directEnabled ? "ok" : "error",
        gemini_configured: directEnabled,
        google_auth_configured: false,
      };
    }
  },
  authGoogle: (credential) =>
    apiFetch("/api/auth/google", { method: "POST", body: JSON.stringify({ credential }) }),
  discover: (profile) =>
    withFallback(
      () => apiFetch("/api/travel/destinations/discover", { method: "POST", body: JSON.stringify({ profile }) }),
      () => direct.discover(profile)
    ),
  culture: (profile, destination) =>
    withFallback(
      () => apiFetch("/api/travel/culture/insights", { method: "POST", body: JSON.stringify({ profile, destination }) }),
      () => direct.culture(profile, destination)
    ),
  hiddenGems: (profile, destination) =>
    withFallback(
      () => apiFetch("/api/travel/destinations/hidden-gems", { method: "POST", body: JSON.stringify({ profile, destination }) }),
      () => direct.hiddenGems(profile, destination)
    ),
  food: (profile, destination) =>
    withFallback(
      () => apiFetch("/api/travel/food/recommend", { method: "POST", body: JSON.stringify({ profile, destination }) }),
      () => direct.food(profile, destination)
    ),
  festivals: (profile, destination) =>
    withFallback(
      () => apiFetch("/api/travel/festivals/suggest", { method: "POST", body: JSON.stringify({ profile, destination }) }),
      () => direct.festivals(profile, destination)
    ),
  experiences: (profile, destination) =>
    withFallback(
      () => apiFetch("/api/travel/experiences/recommend", { method: "POST", body: JSON.stringify({ profile, destination }) }),
      () => direct.experiences(profile, destination)
    ),
  itinerary: (profile, destination) =>
    withFallback(
      () => apiFetch("/api/travel/itinerary/generate", { method: "POST", body: JSON.stringify({ profile, destination }) }),
      () => direct.itinerary(profile, destination)
    ),
  story: (profile, destination, theme) =>
    withFallback(
      () => apiFetch("/api/travel/story/generate", { method: "POST", body: JSON.stringify({ profile, destination, theme }) }),
      () => direct.story(profile, destination, theme)
    ),
  refine: (profile, prior_summary, refinement_request) =>
    withFallback(
      () => apiFetch("/api/travel/refine", { method: "POST", body: JSON.stringify({ profile, prior_summary, refinement_request }) }),
      () => direct.refine(profile, prior_summary, refinement_request)
    ),
  planTrip: (req) =>
    withFallback(
      () => apiFetch("/api/travel/plan", { method: "POST", body: JSON.stringify(req) }),
      () => direct.planTrip(req)
    ),
};
