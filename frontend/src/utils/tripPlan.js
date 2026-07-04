export const SLOTS = [
  { key: "morning", label: "Morning", icon: "☀️", color: "text-teal" },
  { key: "afternoon", label: "Afternoon", icon: "🌤️", color: "text-gold" },
  { key: "evening", label: "Evening", icon: "🌇", color: "text-primary-soft" },
  { key: "night", label: "Night", icon: "🌙", color: "text-aurora" },
];

export const BUDGET_ICONS = {
  accommodation: "🏨",
  food: "🍽️",
  transport: "🚕",
  entry_fees: "🎟️",
  miscellaneous: "🧾",
  total: "💰",
};

export function validCoord(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
}

// Build map markers + per-day route polylines from an itinerary payload.
export function buildMap(data = {}) {
  const points = [];
  const routes = [];
  const hasExplicitPoints = Array.isArray(data.map_points) && data.map_points.length > 0;

  (data.map_points || []).forEach((p) => {
    if (validCoord(p.lat, p.lng)) points.push(p);
  });

  (data.itinerary || []).forEach((day) => {
    const dayLine = [];
    SLOTS.forEach(({ key }) => {
      const s = day[key];
      if (s && validCoord(s.lat, s.lng)) {
        if (!hasExplicitPoints) {
          points.push({ name: s.location || s.activity, type: "stop", lat: s.lat, lng: s.lng, day: day.day });
        }
        dayLine.push([s.lat, s.lng]);
      }
    });
    if (dayLine.length > 1) routes.push(dayLine);
  });

  if (!hasExplicitPoints) {
    (data.hotels || []).forEach((h) => validCoord(h.lat, h.lng) && points.push({ name: h.name, type: "hotel", lat: h.lat, lng: h.lng }));
    (data.restaurants || []).forEach((r) => validCoord(r.lat, r.lng) && points.push({ name: r.name, type: "restaurant", lat: r.lat, lng: r.lng }));
    (data.hidden_gems || []).forEach((g) => validCoord(g.lat, g.lng) && points.push({ name: g.name, type: "gem", lat: g.lat, lng: g.lng }));
  }

  return { points, routes };
}

// Serialize an itinerary payload to a downloadable / shareable plain-text plan.
export function toText(data = {}) {
  const lines = [`CULTURAL COMPASS — TRIP PLAN`, `Destination: ${data.destination || "-"}`, ""];
  if (data.summary) lines.push(data.summary, "");
  (data.itinerary || []).forEach((d) => {
    lines.push(`DAY ${d.day}${d.date ? ` (${d.date})` : ""}: ${d.title || ""}`);
    SLOTS.forEach(({ key, label }) => {
      const s = d[key];
      if (s?.activity) lines.push(`  ${label}: ${s.activity}${s.location ? ` @ ${s.location}` : ""}`);
    });
    if (d.estimated_cost) lines.push(`  Est. cost: ${d.estimated_cost}`);
    lines.push("");
  });
  if (data.budget) {
    lines.push("BUDGET:");
    Object.entries(data.budget).forEach(([k, v]) => k !== "currency" && lines.push(`  ${k}: ${v}`));
    lines.push("");
  }
  const list = (title, arr) => arr?.length && lines.push(`${title}:`, ...arr.map((x) => `  - ${x}`), "");
  list("TRAVEL TIPS", data.travel_tips);
  list("PACKING LIST", data.packing_list);
  list("SAFETY TIPS", data.safety_tips);
  return lines.join("\n");
}
