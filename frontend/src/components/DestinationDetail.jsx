const TABS = [
  { id: "culture", label: "Culture", icon: "🎭" },
  { id: "hidden_gems", label: "Hidden Gems", icon: "💎" },
  { id: "food", label: "Food", icon: "🍜" },
  { id: "festivals", label: "Festivals", icon: "🎪" },
  { id: "experiences", label: "Experiences", icon: "✨" },
  { id: "itinerary", label: "Itinerary", icon: "📅" },
  { id: "story", label: "Story", icon: "📖" },
];

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h4 className="font-display text-xl font-bold mb-3 text-[#e9c46a]">{title}</h4>
      {children}
    </div>
  );
}

function ListItems({ items }) {
  if (!items?.length) return <p className="text-[#7a9499] text-sm">No items returned.</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-[#c8d6d9] text-sm leading-relaxed pl-4 border-l-2 border-[#c8553d]/40">
          {typeof item === "string" ? item : JSON.stringify(item)}
        </li>
      ))}
    </ul>
  );
}

export default function DestinationDetail({ destination, activeTab, setActiveTab, tabData, loadingTab, onGenerateItinerary, onGenerateStory }) {
  const destName = `${destination.name}, ${destination.country}`;
  const data = tabData[activeTab];

  const renderContent = () => {
    if (loadingTab) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🧭</div>
            <p className="text-[#9eb4b8]">Gemini is crafting your {TABS.find((t) => t.id === activeTab)?.label}...</p>
          </div>
        </div>
      );
    }
    if (!data) {
      return (
        <div className="text-center py-16">
          <p className="text-[#9eb4b8] mb-4">Select a tab to explore {destName}</p>
        </div>
      );
    }

    switch (activeTab) {
      case "culture":
        return (
          <>
            <Section title="Cultural Overview"><p className="text-[#c8d6d9] leading-relaxed">{data.cultural_overview}</p></Section>
            <Section title="Local Etiquette"><ListItems items={data.local_etiquette} /></Section>
            <Section title="Must-Know Phrases">
              <div className="grid gap-2">
                {(data.must_know_phrases || []).map((p, i) => (
                  <div key={i} className="glass-card rounded-xl p-3 text-sm">
                    <span className="text-[#e9c46a]">{p.phrase}</span> — {p.meaning}
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Do"><ListItems items={data.cultural_dos} /></Section>
            <Section title="Don't"><ListItems items={data.cultural_donts} /></Section>
          </>
        );
      case "hidden_gems":
        return (
          <div className="grid gap-4">
            {(data.hidden_gems || []).map((gem, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <h4 className="font-display text-xl font-bold">{gem.name}</h4>
                <p className="text-xs text-[#7a9499] mb-2">{gem.location}</p>
                <p className="text-sm text-[#c8d6d9] mb-2">{gem.why_hidden_gem}</p>
                <p className="text-sm text-[#e9c46a]">Why for you: {gem.why_for_you}</p>
              </div>
            ))}
          </div>
        );
      case "food":
        return (
          <>
            <Section title="Food Culture"><p className="text-[#c8d6d9]">{data.food_overview}</p></Section>
            <Section title="Must-Try Dishes">
              <div className="grid gap-3">
                {(data.must_try_dishes || []).map((d, i) => (
                  <div key={i} className="glass-card rounded-xl p-4">
                    <h5 className="font-semibold text-[#f5ebe0]">{d.name}</h5>
                    <p className="text-sm text-[#c8d6d9]">{d.description}</p>
                    <p className="text-xs text-[#7a9499] mt-1">Find at: {d.where_to_find}</p>
                  </div>
                ))}
              </div>
            </Section>
          </>
        );
      case "festivals":
        return (
          <div className="grid gap-4">
            {(data.events || []).map((ev, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <h4 className="font-display text-xl font-bold">{ev.name}</h4>
                <p className="text-sm text-[#c8d6d9] mb-2">{ev.description}</p>
                <p className="text-xs text-[#e9c46a]">Timing: {ev.typical_timing}</p>
                {ev.verify_note && <p className="text-xs text-amber-300/80 mt-2">⚠ {ev.verify_note}</p>}
              </div>
            ))}
          </div>
        );
      case "experiences":
        return (
          <div className="grid gap-4">
            {(data.experiences || []).map((ex, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <h4 className="font-display text-xl font-bold">{ex.title}</h4>
                <p className="text-sm text-[#c8d6d9] mb-2">{ex.description}</p>
                <p className="text-sm text-[#e9c46a]">Why authentic: {ex.why_authentic}</p>
              </div>
            ))}
          </div>
        );
      case "itinerary":
        return (
          <>
            <Section title={data.trip_title}><p className="text-[#c8d6d9]">{data.overview}</p></Section>
            <div className="space-y-4">
              {(data.days || []).map((day) => (
                <div key={day.day_number} className="glass-card rounded-2xl p-5 border-l-4 border-[#c8553d]">
                  <h4 className="font-display text-xl font-bold mb-1">Day {day.day_number}: {day.theme}</h4>
                  <p className="text-xs text-[#e9c46a] mb-3">~{day.estimated_daily_cost}</p>
                  <div className="grid md:grid-cols-3 gap-3 text-sm text-[#c8d6d9]">
                    <div><span className="text-[#7a9499] block text-xs">Morning</span>{day.morning}</div>
                    <div><span className="text-[#7a9499] block text-xs">Afternoon</span>{day.afternoon}</div>
                    <div><span className="text-[#7a9499] block text-xs">Evening</span>{day.evening}</div>
                  </div>
                  <p className="text-xs text-[#7a9499] mt-3">Meals: {day.meals}</p>
                </div>
              ))}
            </div>
            <p className="text-[#e9c46a] font-semibold mt-4">Total: {data.total_estimated_cost}</p>
          </>
        );
      case "story":
        return (
          <div className="glass-card rounded-2xl p-8 border border-[#e9c46a]/20">
            <h3 className="font-display text-3xl font-bold mb-2 text-[#f5ebe0]">{data.title}</h3>
            <p className="text-xs text-[#e9c46a] mb-6 uppercase tracking-widest">{data.mood}</p>
            {(data.story || "").split("\n\n").map((para, i) => (
              <p key={i} className="text-[#d4e4e7] leading-loose mb-4 font-display text-lg italic">{para}</p>
            ))}
            <div className="flex flex-wrap gap-2 mt-4">
              {(data.cultural_threads || []).map((t, i) => (
                <span key={i} className="chip chip-active text-xs">{t}</span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden fade-up">
      <div className="p-6 border-b border-[#2a4a52] bg-gradient-to-r from-[#1a535c]/40 to-transparent">
        <h2 className="font-display text-3xl font-bold">{destName}</h2>
        <p className="text-[#9eb4b8] text-sm mt-1">{destination.tagline}</p>
      </div>

      <div className="flex overflow-x-auto scrollbar-thin border-b border-[#2a4a52] px-4 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`px-4 py-3 text-sm whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-[#c8553d] text-[#f5ebe0]"
                : "border-transparent text-[#7a9499] hover:text-[#c8d6d9]"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 max-h-[600px] overflow-y-auto scrollbar-thin">
        {activeTab === "itinerary" && !data && !loadingTab && (
          <button className="btn-primary mb-4" onClick={onGenerateItinerary}>Generate Itinerary</button>
        )}
        {activeTab === "story" && !data && !loadingTab && (
          <button className="btn-primary mb-4" onClick={onGenerateStory}>Generate Immersive Story</button>
        )}
        {renderContent()}
        {data?.uncertainty_notes?.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-amber-900/20 border border-amber-500/30">
            <p className="text-xs text-amber-200 font-medium mb-2">Uncertainty notes</p>
            <ListItems items={data.uncertainty_notes} />
          </div>
        )}
      </div>
    </div>
  );
}

export { TABS };
