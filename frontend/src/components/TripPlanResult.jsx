import { useMemo } from "react";
import MapView from "./MapView";
import { useToast } from "./ui/Toast";

const SLOTS = [
  { key: "morning", label: "Morning", icon: "☀️", color: "text-teal" },
  { key: "afternoon", label: "Afternoon", icon: "🌤️", color: "text-gold" },
  { key: "evening", label: "Evening", icon: "🌇", color: "text-primary-soft" },
  { key: "night", label: "Night", icon: "🌙", color: "text-aurora" },
];

const BUDGET_ICONS = {
  accommodation: "🏨",
  food: "🍽️",
  transport: "🚕",
  entry_fees: "🎟️",
  miscellaneous: "🧾",
  total: "💰",
};

function valid(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
}

function buildMap(data) {
  const points = [];
  const routes = [];

  (data.map_points || []).forEach((p) => {
    if (valid(p.lat, p.lng)) points.push(p);
  });

  (data.itinerary || []).forEach((day) => {
    const dayLine = [];
    SLOTS.forEach(({ key }) => {
      const s = day[key];
      if (s && valid(s.lat, s.lng)) {
        if (!data.map_points?.length) {
          points.push({ name: s.location || s.activity, type: "stop", lat: s.lat, lng: s.lng, day: day.day });
        }
        dayLine.push([s.lat, s.lng]);
      }
    });
    if (dayLine.length > 1) routes.push(dayLine);
  });

  if (!data.map_points?.length) {
    (data.hotels || []).forEach((h) => valid(h.lat, h.lng) && points.push({ name: h.name, type: "hotel", lat: h.lat, lng: h.lng }));
    (data.restaurants || []).forEach((r) => valid(r.lat, r.lng) && points.push({ name: r.name, type: "restaurant", lat: r.lat, lng: r.lng }));
    (data.hidden_gems || []).forEach((g) => valid(g.lat, g.lng) && points.push({ name: g.name, type: "gem", lat: g.lat, lng: g.lng }));
  }

  return { points, routes };
}

function toText(data) {
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

function Card({ children, className = "" }) {
  return <div className={`glass-card rounded-2xl p-5 ${className}`}>{children}</div>;
}

function List({ title, icon, items }) {
  if (!items?.length) return null;
  return (
    <Card>
      <h4 className="font-display text-lg font-bold mb-3">{icon} {title}</h4>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-slate-300/85 leading-relaxed pl-4 border-l-2 border-primary/40">{it}</li>
        ))}
      </ul>
    </Card>
  );
}

export default function TripPlanResult({ data }) {
  const notify = useToast();
  const { points, routes } = useMemo(() => buildMap(data), [data]);

  const download = () => {
    const blob = new Blob([toText(data)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trip-plan-${(data.destination || "cultural-compass").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Itinerary downloaded", "success");
  };

  const share = async () => {
    const text = `My AI trip plan for ${data.destination || "an amazing journey"} — built with Cultural Compass.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Cultural Compass Trip Plan", text });
      } else {
        await navigator.clipboard.writeText(`${text}\n\n${toText(data)}`);
        notify("Trip plan copied to clipboard", "success");
      }
    } catch {
      /* user cancelled share */
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header + actions */}
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="aurora-blob w-56 h-56 bg-aurora/20 -top-24 -right-10" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="eyebrow mb-2 flex"><span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse-glow" /> Your AI itinerary</span>
            <h2 className="font-display text-3xl font-bold">{data.destination || "Your Trip"}</h2>
            {data.summary && <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">{data.summary}</p>}
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost text-sm" onClick={share}>🔗 Share</button>
            <button className="btn-primary !py-2.5 text-sm" onClick={download}>⬇ Download</button>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapView points={points} routes={routes} height={420} />

      {/* Budget summary */}
      {data.budget && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {["accommodation", "food", "transport", "entry_fees", "miscellaneous", "total"].map((k) =>
            data.budget[k] ? (
              <Card key={k} className={`!p-4 text-center ${k === "total" ? "ring-1 ring-gold/40" : ""}`}>
                <div className="text-xl mb-1">{BUDGET_ICONS[k]}</div>
                <div className={`font-display font-bold ${k === "total" ? "text-gold text-lg" : "text-sand"}`}>{data.budget[k]}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{k.replace("_", " ")}</div>
              </Card>
            ) : null
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {(data.itinerary || []).map((day) => (
          <div key={day.day} className="glass-card rounded-2xl p-5 border-l-4 border-primary">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h3 className="font-display text-xl font-bold">
                <span className="text-gradient-static">Day {day.day}</span>
                {day.title ? ` · ${day.title}` : ""}
                {day.date ? <span className="text-slate-500 text-sm font-normal"> · {day.date}</span> : ""}
              </h3>
              {day.estimated_cost && <span className="chip !py-1 !text-xs">💰 {day.estimated_cost}</span>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SLOTS.map(({ key, label, icon, color }) => {
                const s = day[key];
                if (!s?.activity) return null;
                return (
                  <div key={key} className="glass rounded-xl p-3">
                    <div className={`text-xs mb-1 ${color}`}>{icon} {label}</div>
                    <div className="text-sm text-slate-200/90">{s.activity}</div>
                    {s.location && <div className="text-xs text-slate-500 mt-1">📍 {s.location}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hotels & Restaurants */}
      <div className="grid lg:grid-cols-2 gap-6">
        {data.hotels?.length > 0 && (
          <Card>
            <h4 className="font-display text-lg font-bold mb-3">🏨 Recommended Hotels</h4>
            <div className="space-y-3">
              {data.hotels.map((h, i) => (
                <div key={i} className="glass rounded-xl p-3">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-sand">{h.name}</span>
                    <span className="text-xs text-gold">{h.price_range}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{h.type} · {h.why}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
        {data.restaurants?.length > 0 && (
          <Card>
            <h4 className="font-display text-lg font-bold mb-3">🍽️ Local Restaurants</h4>
            <div className="space-y-3">
              {data.restaurants.map((r, i) => (
                <div key={i} className="glass rounded-xl p-3">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-sand">{r.name}</span>
                    <span className="text-xs text-gold">{r.price_range}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{r.cuisine} · Try: {r.must_try}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Hidden gems */}
      {data.hidden_gems?.length > 0 && (
        <Card>
          <h4 className="font-display text-lg font-bold mb-3">💎 Hidden Gems</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.hidden_gems.map((g, i) => (
              <div key={i} className="glass rounded-xl p-3">
                <span className="font-semibold text-sand">{g.name}</span>
                <p className="text-xs text-slate-400 mt-1">{g.description}</p>
                <p className="text-xs text-gold mt-1">✦ {g.why}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Festivals + best time */}
      <div className="grid lg:grid-cols-2 gap-6">
        {data.festivals?.length > 0 && (
          <Card>
            <h4 className="font-display text-lg font-bold mb-3">🎪 Local Festivals</h4>
            <div className="space-y-3">
              {data.festivals.map((f, i) => (
                <div key={i} className="glass rounded-xl p-3">
                  <div className="flex justify-between gap-2">
                    <span className="font-semibold text-sand">{f.name}</span>
                    <span className="text-xs text-teal">{f.timing}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{f.description}</p>
                  {f.verify_note && <p className="text-xs text-gold/80 mt-1">⚠ {f.verify_note}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}
        {data.best_time_to_visit?.length > 0 && (
          <Card>
            <h4 className="font-display text-lg font-bold mb-3">🕐 Best Time to Visit</h4>
            <div className="space-y-2">
              {data.best_time_to_visit.map((b, i) => (
                <div key={i} className="flex justify-between text-sm gap-3">
                  <span className="text-slate-300">{b.attraction}</span>
                  <span className="text-gold text-right">{b.best_time}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Weather */}
      {data.weather && (data.weather.overview || data.weather.suggestions?.length) && (
        <Card>
          <h4 className="font-display text-lg font-bold mb-2">🌦️ Weather</h4>
          {data.weather.overview && <p className="text-sm text-slate-300/85 mb-2">{data.weather.overview}</p>}
          {data.weather.suggestions?.length > 0 && (
            <ul className="space-y-1">
              {data.weather.suggestions.map((s, i) => <li key={i} className="text-sm text-slate-400 pl-4 border-l-2 border-teal/40">{s}</li>)}
            </ul>
          )}
        </Card>
      )}

      {/* Tips grids */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <List title="Travel Tips" icon="💡" items={data.travel_tips} />
        <List title="Cultural Etiquette" icon="🙏" items={data.cultural_etiquette} />
        <List title="Packing List" icon="🎒" items={data.packing_list} />
        <List title="Safety Tips" icon="🛡️" items={data.safety_tips} />
        {data.estimated_travel_time && (
          <Card>
            <h4 className="font-display text-lg font-bold mb-2">🕒 Estimated Travel Time</h4>
            <p className="text-sm text-slate-300/85">{data.estimated_travel_time}</p>
          </Card>
        )}
      </div>

      {/* Uncertainty */}
      {data.uncertainty_notes?.length > 0 && (
        <div className="p-4 rounded-xl bg-gold/5 border border-gold/25">
          <p className="text-xs text-gold font-semibold mb-2">⚠ Good to know — verify before booking</p>
          <ul className="space-y-1">
            {data.uncertainty_notes.map((n, i) => <li key={i} className="text-sm text-slate-300/80">{n}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
