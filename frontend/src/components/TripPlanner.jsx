const STYLES = [
  { id: "adventure", label: "Adventure", icon: "⛰️" },
  { id: "luxury", label: "Luxury", icon: "💎" },
  { id: "backpacking", label: "Backpacking", icon: "🎒" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧" },
  { id: "couple", label: "Couple", icon: "💞" },
  { id: "solo", label: "Solo", icon: "🧍" },
  { id: "spiritual", label: "Spiritual", icon: "🕉️" },
  { id: "food", label: "Food", icon: "🍜" },
  { id: "history", label: "History", icon: "🏛️" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "photography", label: "Photography", icon: "📷" },
  { id: "festival", label: "Festival", icon: "🎪" },
];

const INTERESTS = [
  "History", "Museums", "Food", "Nightlife", "Architecture", "Wildlife",
  "Local Culture", "Temples", "Mountains", "Beaches", "Shopping", "Photography",
];

const TRANSPORT = ["Any", "Flight", "Train", "Car / Road trip", "Public transport", "Bike"];
const HOTELS = ["No preference", "Budget / Hostel", "Mid-range", "Boutique", "Luxury", "Homestay"];

export default function TripPlanner({ plan, setPlan, onSubmit, loading }) {
  const toggleInterest = (item) => {
    setPlan((p) => ({
      ...p,
      interests: p.interests.includes(item)
        ? p.interests.filter((i) => i !== item)
        : [...p.interests, item],
    }));
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <span className="eyebrow mb-3 flex"><span className="h-1.5 w-1.5 rounded-full bg-aurora animate-pulse-glow" /> AI Travel Consultant</span>
      <h2 className="font-display text-3xl sm:text-4xl font-bold">Plan my perfect trip</h2>
      <p className="text-slate-400 mt-1 mb-8">Give me the essentials — I'll design a complete day-by-day itinerary, budget &amp; map.</p>

      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tp-destination" className="text-sm font-semibold text-slate-200 mb-2 block">Destination <span className="text-slate-500 font-normal">(optional)</span></label>
            <input
              id="tp-destination"
              className="field"
              placeholder="e.g. Kyoto, Japan — or leave blank for a suggestion"
              value={plan.destination}
              onChange={(e) => setPlan((p) => ({ ...p, destination: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="tp-start-date" className="text-sm font-semibold text-slate-200 mb-2 block">Start date <span className="text-slate-500 font-normal">(optional)</span></label>
            <input
              id="tp-start-date"
              type="date"
              className="field"
              value={plan.start_date}
              onChange={(e) => setPlan((p) => ({ ...p, start_date: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="tp-budget" className="text-sm font-semibold text-slate-200">Total budget</label>
            <span className="text-gold font-display font-bold">{Number(plan.budget).toLocaleString()} {plan.currency}</span>
          </div>
          <input
            id="tp-budget"
            type="range"
            min={100}
            max={20000}
            step={100}
            value={plan.budget}
            onChange={(e) => setPlan((p) => ({ ...p, budget: Number(e.target.value) }))}
            aria-valuetext={`${Number(plan.budget).toLocaleString()} ${plan.currency}`}
            className="w-full accent-[#ff6a4d]"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Shoestring</span><span>Comfortable</span><span>Luxury</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="tp-days" className="text-sm font-semibold text-slate-200 mb-2 block">Days</label>
            <input id="tp-days" type="number" min={1} max={30} className="field" value={plan.days} onChange={(e) => setPlan((p) => ({ ...p, days: Number(e.target.value) }))} />
          </div>
          <div>
            <label htmlFor="tp-travelers" className="text-sm font-semibold text-slate-200 mb-2 block">Travelers</label>
            <input id="tp-travelers" type="number" min={1} max={30} className="field" value={plan.travelers} onChange={(e) => setPlan((p) => ({ ...p, travelers: Number(e.target.value) }))} />
          </div>
          <div>
            <label htmlFor="tp-transport" className="text-sm font-semibold text-slate-200 mb-2 block">Transport</label>
            <select id="tp-transport" className="field" value={plan.transport} onChange={(e) => setPlan((p) => ({ ...p, transport: e.target.value }))}>
              {TRANSPORT.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="tp-hotel" className="text-sm font-semibold text-slate-200 mb-2 block">Hotel</label>
            <select id="tp-hotel" className="field" value={plan.hotel_preference} onChange={(e) => setPlan((p) => ({ ...p, hotel_preference: e.target.value }))}>
              {HOTELS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label id="tp-style-label" className="text-sm font-semibold text-slate-200 mb-3 block">Travel style</label>
          <div role="group" aria-labelledby="tp-style-label" className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={plan.travel_style === s.id}
                onClick={() => setPlan((p) => ({ ...p, travel_style: s.id }))}
                className={`glass-card rounded-xl py-3 px-2 text-center transition-all hover:-translate-y-0.5 ${
                  plan.travel_style === s.id ? "ring-2 ring-primary shadow-glow" : ""
                }`}
              >
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-xs text-slate-300">{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label id="tp-interests-label" className="text-sm font-semibold text-slate-200 mb-3 block">Interests <span className="text-slate-500 font-normal">· multi-select</span></label>
          <div role="group" aria-labelledby="tp-interests-label" className="flex flex-wrap gap-2.5">
            {INTERESTS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={plan.interests.includes(item)}
                className={`chip ${plan.interests.includes(item) ? "chip-active" : ""}`}
                onClick={() => toggleInterest(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary w-full text-lg !py-4" onClick={onSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
              <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
              <span className="ml-2">Designing your itinerary…</span>
            </>
          ) : (
            <>Generate AI Itinerary ✦</>
          )}
        </button>
      </div>
    </div>
  );
}
