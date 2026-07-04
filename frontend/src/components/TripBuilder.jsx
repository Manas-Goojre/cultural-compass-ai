const INTERESTS = [
  "History", "Art", "Food", "Nature", "Architecture", "Music",
  "Spirituality", "Adventure", "Markets", "Photography", "Wildlife", "Nightlife",
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
    <div className="glass-card rounded-3xl p-8 fade-up">
      <h2 className="font-display text-3xl font-bold mb-2">Plan Your Journey</h2>
      <p className="text-[#9eb4b8] mb-8">Tell us who you are as a traveler — we'll find destinations that fit.</p>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-[#c8d6d9] mb-3 block">Travel Style</label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`chip ${profile.travel_style === s.id ? "chip-active" : ""}`}
                onClick={() => setProfile((p) => ({ ...p, travel_style: s.id }))}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#c8d6d9] mb-3 block">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip ${profile.interests.includes(item) ? "chip-active" : ""}`}
                onClick={() => toggleInterest(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-[#c8d6d9] mb-2 block">Budget</label>
            <select
              className="w-full bg-[#0f2a30] border border-[#2a4a52] rounded-xl px-4 py-3 text-[#f5ebe0]"
              value={profile.budget_range}
              onChange={(e) => setProfile((p) => ({ ...p, budget_range: e.target.value }))}
            >
              {BUDGETS.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[#c8d6d9] mb-2 block">Duration (days)</label>
            <input
              type="number"
              min={1}
              max={30}
              className="w-full bg-[#0f2a30] border border-[#2a4a52] rounded-xl px-4 py-3 text-[#f5ebe0]"
              value={profile.duration_days}
              onChange={(e) => setProfile((p) => ({ ...p, duration_days: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#c8d6d9] mb-2 block">Currency</label>
            <input
              className="w-full bg-[#0f2a30] border border-[#2a4a52] rounded-xl px-4 py-3 text-[#f5ebe0]"
              value={profile.currency}
              onChange={(e) => setProfile((p) => ({ ...p, currency: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[#c8d6d9] mb-2 block">Origin (optional)</label>
            <input
              placeholder="e.g. Mumbai, India"
              className="w-full bg-[#0f2a30] border border-[#2a4a52] rounded-xl px-4 py-3 text-[#f5ebe0] placeholder-[#5a757a]"
              value={profile.origin_location || ""}
              onChange={(e) => setProfile((p) => ({ ...p, origin_location: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#c8d6d9] mb-2 block">Preferred Regions (optional)</label>
            <input
              placeholder="e.g. Southeast Asia, Mediterranean"
              className="w-full bg-[#0f2a30] border border-[#2a4a52] rounded-xl px-4 py-3 text-[#f5ebe0] placeholder-[#5a757a]"
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
          <label className="text-sm font-medium text-[#c8d6d9] mb-2 block">Travel Dates (optional)</label>
          <input
            placeholder="e.g. March 2026, monsoon season"
            className="w-full bg-[#0f2a30] border border-[#2a4a52] rounded-xl px-4 py-3 text-[#f5ebe0] placeholder-[#5a757a]"
            value={profile.travel_dates || ""}
            onChange={(e) => setProfile((p) => ({ ...p, travel_dates: e.target.value }))}
          />
        </div>

        <button className="btn-primary w-full text-lg" onClick={onSubmit} disabled={loading || profile.interests.length === 0}>
          {loading ? "Discovering destinations..." : "Discover Destinations ✦"}
        </button>
      </div>
    </div>
  );
}
