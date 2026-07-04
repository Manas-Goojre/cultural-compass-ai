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

export const api = {
  health: () => apiFetch("/health"),
  authGoogle: (credential) => apiFetch("/api/auth/google", { method: "POST", body: JSON.stringify({ credential }) }),
  discover: (profile) => apiFetch("/api/travel/destinations/discover", { method: "POST", body: JSON.stringify({ profile }) }),
  culture: (profile, destination) => apiFetch("/api/travel/culture/insights", { method: "POST", body: JSON.stringify({ profile, destination }) }),
  hiddenGems: (profile, destination) => apiFetch("/api/travel/destinations/hidden-gems", { method: "POST", body: JSON.stringify({ profile, destination }) }),
  food: (profile, destination) => apiFetch("/api/travel/food/recommend", { method: "POST", body: JSON.stringify({ profile, destination }) }),
  festivals: (profile, destination) => apiFetch("/api/travel/festivals/suggest", { method: "POST", body: JSON.stringify({ profile, destination }) }),
  experiences: (profile, destination) => apiFetch("/api/travel/experiences/recommend", { method: "POST", body: JSON.stringify({ profile, destination }) }),
  itinerary: (profile, destination) => apiFetch("/api/travel/itinerary/generate", { method: "POST", body: JSON.stringify({ profile, destination }) }),
  story: (profile, destination, theme) => apiFetch("/api/travel/story/generate", { method: "POST", body: JSON.stringify({ profile, destination, theme }) }),
  refine: (profile, prior_summary, refinement_request) => apiFetch("/api/travel/refine", { method: "POST", body: JSON.stringify({ profile, prior_summary, refinement_request }) }),
};
