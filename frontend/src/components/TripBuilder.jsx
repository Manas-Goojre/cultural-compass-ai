const INTERESTS = [
  { label: "History", icon: "🏺" },
  { label: "Art", icon: "🎨" },
  { label: "Food", icon: "🍜" },
  { label: "Nature", icon: "🌿" },
  { label: "Architecture", icon: "🏛️" },
  { label: "Music", icon: "🎵" },
  { label: "Spirituality", icon: "🕉️" },
  { label: "Adventure", icon: "⛰️" },
  { label: "Markets", icon: "🛍️" },
  { label: "Photography", icon: "📷" },
  { label: "Wildlife", icon: "🦁" },
  { label: "Nightlife", icon: "🌙" },
];

const STYLES = [
  { id: "solo", label: "Solo", icon: "🎒" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧" },
  { id: "adventure", label: "Adventure", icon: "⛰️" },
  { id: "spiritual", label: "Spiritual", icon: "🕉️" },
  { id: "heritage", label: "Heritage", icon: "🏛️" },
];

const BUDGETS = [
  { id: "budget", label: "Budget" },
  { id: "mid", label: "Mid-range" },
  { id: "luxury", label: "Luxury" },
];

export default function TripBuilder({ profile, setProfile, onSubmit, loading }) {
  const toggleInterest = (item) => {
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(item)
        ? p.interests.filter((i) => i !== item)
        : [...p.interests, item],
    }));
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <span className="eyebrow mb-3 flex"><span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" /> Step 1 · Your travel DNA</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Plan Your Journey</h2>
          <p className="text-slate-400 mt-1">Tell us who you are — we'll find destinations that fit.</p>
        </div>
        <div className="glass rounded-full px-4 py-2 text-sm text-slate-300 hidden sm:flex items-center gap-2">
          <span className="text-teal">✦</span> {profile.interests.length} interests selected
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="text-sm font-semibold text-slate-200 mb-3 block">Travel Style</label>
          <div className="flex flex-wrap gap-2.5">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={profile.travel_style === s.id}
                className={`chip ${profile.travel_style === s.id ? "chip-active" : ""}`}
                onClick={() => setProfile((p) => ({ ...p, travel_style: s.id }))}
              >
                <span aria-hidden>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-200 mb-3 block">
            Interests <span className="text-slate-500 font-normal">· pick a few</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {INTERESTS.map((item) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={profile.interests.includes(item.label)}
                className={`chip ${profile.interests.includes(item.label) ? "chip-active" : ""}`}
                onClick={() => toggleInterest(item.label)}
              >
                <span aria-hidden>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-200 mb-2 block">Budget</label>
            <select
              className="field"
              value={profile.budget_range}
              onChange={(e) => setProfile((p) => ({ ...p, budget_range: e.target.value }))}
            >
              {BUDGETS.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200 mb-2 block">Duration (days)</label>
            <input
              type="number"
              min={1}
              max={30}
              className="field"
              value={profile.duration_days}
              onChange={(e) => setProfile((p) => ({ ...p, duration_days: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200 mb-2 block">Currency</label>
            <input
              className="field"
              value={profile.currency}
              onChange={(e) => setProfile((p) => ({ ...p, currency: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-200 mb-2 block">Origin (optional)</label>
            <input
              placeholder="e.g. Mumbai, India"
              className="field"
              value={profile.origin_location || ""}
              onChange={(e) => setProfile((p) => ({ ...p, origin_location: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200 mb-2 block">Preferred Regions (optional)</label>
            <input
              placeholder="e.g. Southeast Asia, Mediterranean"
              className="field"
              value={(profile.preferred_regions || []).join(", ")}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  preferred_regions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                }))
              }
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-200 mb-2 block">Travel Dates (optional)</label>
          <input
            placeholder="e.g. March 2026, monsoon season"
            className="field"
            value={profile.travel_dates || ""}
            onChange={(e) => setProfile((p) => ({ ...p, travel_dates: e.target.value }))}
          />
        </div>

        <button
          className="btn-primary w-full text-lg !py-4"
          onClick={onSubmit}
          disabled={loading || profile.interests.length === 0}
        >
          {loading ? (
            <>
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
              <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
              <span className="ml-2">Discovering destinations…</span>
            </>
          ) : (
            <>Discover Destinations ✦</>
          )}
        </button>
        {profile.interests.length === 0 && (
          <p className="text-center text-xs text-slate-500 -mt-4">Select at least one interest to continue</p>
        )}
      </div>
    </div>
  );
}
