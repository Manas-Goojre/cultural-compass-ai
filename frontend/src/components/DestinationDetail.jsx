import { SkeletonLines } from "./ui/Skeleton";

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
    <div className="mb-7">
      <h4 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-gradient-to-b from-primary to-gold" />
        {title}
      </h4>
      {children}
    </div>
  );
}

function ListItems({ items }) {
  if (!items?.length) return <p className="text-slate-500 text-sm">No items returned.</p>;
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="text-slate-300/85 text-sm leading-relaxed pl-4 border-l-2 border-primary/40">
          {typeof item === "string" ? item : JSON.stringify(item)}
        </li>
      ))}
    </ul>
  );
}

export default function DestinationDetail({
  destination,
  activeTab,
  setActiveTab,
  tabData,
  loadingTab,
  onGenerateItinerary,
  onGenerateStory,
}) {
  const destName = `${destination.name}, ${destination.country}`;
  const data = tabData[activeTab];
  const activeLabel = TABS.find((t) => t.id === activeTab)?.label;

  const renderContent = () => {
    if (loadingTab) {
      return (
        <div className="py-4">
          <div className="flex items-center gap-3 mb-6 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
              <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
            </div>
            <span className="text-sm">Gemini is crafting your {activeLabel}…</span>
          </div>
          <SkeletonLines count={6} />
        </div>
      );
    }
    if (!data) {
      return (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 animate-float">🧭</div>
          <p className="text-slate-400">Explore {activeLabel?.toLowerCase()} for {destName}</p>
        </div>
      );
    }

    switch (activeTab) {
      case "culture":
        return (
          <div className="animate-fade-in">
            <Section title="Cultural Overview"><p className="text-slate-300/85 leading-relaxed">{data.cultural_overview}</p></Section>
            <Section title="Local Etiquette"><ListItems items={data.local_etiquette} /></Section>
            <Section title="Must-Know Phrases">
              <div className="grid sm:grid-cols-2 gap-2">
                {(data.must_know_phrases || []).map((p, i) => (
                  <div key={i} className="glass rounded-xl p-3 text-sm">
                    <span className="text-gold font-medium">{p.phrase}</span>
                    <span className="text-slate-400"> — {p.meaning}</span>
                  </div>
                ))}
              </div>
            </Section>
            <div className="grid sm:grid-cols-2 gap-6">
              <Section title="✓ Do"><ListItems items={data.cultural_dos} /></Section>
              <Section title="✕ Don't"><ListItems items={data.cultural_donts} /></Section>
            </div>
          </div>
        );
      case "hidden_gems":
        return (
          <div className="grid gap-4 animate-fade-in">
            {(data.hidden_gems || []).map((gem, i) => (
              <div key={i} className="glass-card glass-hover rounded-2xl p-5">
                <h4 className="font-display text-xl font-bold">{gem.name}</h4>
                <p className="text-xs text-teal mb-2">📍 {gem.location}</p>
                <p className="text-sm text-slate-300/85 mb-2">{gem.why_hidden_gem}</p>
                <p className="text-sm text-gold">✦ Why for you: {gem.why_for_you}</p>
                {gem.best_time_to_visit && <p className="text-xs text-slate-500 mt-2">🗓 {gem.best_time_to_visit}</p>}
              </div>
            ))}
          </div>
        );
      case "food":
        return (
          <div className="animate-fade-in">
            <Section title="Food Culture"><p className="text-slate-300/85">{data.food_overview}</p></Section>
            <Section title="Must-Try Dishes">
              <div className="grid sm:grid-cols-2 gap-3">
                {(data.must_try_dishes || []).map((d, i) => (
                  <div key={i} className="glass-card rounded-xl p-4">
                    <h5 className="font-semibold text-sand">{d.name}</h5>
                    <p className="text-sm text-slate-300/80 mt-1">{d.description}</p>
                    <p className="text-xs text-slate-500 mt-2">📍 {d.where_to_find}</p>
                  </div>
                ))}
              </div>
            </Section>
            {data.food_districts?.length > 0 && <Section title="Food Districts"><ListItems items={data.food_districts} /></Section>}
          </div>
        );
      case "festivals":
        return (
          <div className="grid gap-4 animate-fade-in">
            {(data.events || []).map((ev, i) => (
              <div key={i} className="glass-card glass-hover rounded-2xl p-5">
                <h4 className="font-display text-xl font-bold">{ev.name}</h4>
                <p className="text-sm text-slate-300/85 my-2">{ev.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="chip !py-1">🗓 {ev.typical_timing}</span>
                  {ev.why_relevant && <span className="chip chip-active !py-1">{ev.why_relevant}</span>}
                </div>
                {ev.verify_note && <p className="text-xs text-gold/90 mt-3">⚠ {ev.verify_note}</p>}
              </div>
            ))}
          </div>
        );
      case "experiences":
        return (
          <div className="grid gap-4 animate-fade-in">
            {(data.experiences || []).map((ex, i) => (
              <div key={i} className="glass-card glass-hover rounded-2xl p-5">
                <h4 className="font-display text-xl font-bold">{ex.title}</h4>
                <p className="text-sm text-slate-300/85 my-2">{ex.description}</p>
                <p className="text-sm text-gold">✦ {ex.why_authentic}</p>
                {ex.estimated_cost && <span className="chip !py-1 !text-xs mt-3 inline-flex">💰 {ex.estimated_cost}</span>}
              </div>
            ))}
          </div>
        );
      case "itinerary":
        return (
          <div className="animate-fade-in">
            <Section title={data.trip_title}><p className="text-slate-300/85">{data.overview}</p></Section>
            <div className="space-y-4">
              {(data.days || []).map((day) => (
                <div key={day.day_number} className="glass-card rounded-2xl p-5 border-l-4 border-primary">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <h4 className="font-display text-xl font-bold">
                      <span className="text-gradient-static">Day {day.day_number}</span> · {day.theme}
                    </h4>
                    <span className="chip !py-1 !text-xs">💰 ~{day.estimated_daily_cost}</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm text-slate-300/85">
                    <div className="glass rounded-xl p-3"><span className="text-teal block text-xs mb-1">☀ Morning</span>{day.morning}</div>
                    <div className="glass rounded-xl p-3"><span className="text-gold block text-xs mb-1">🌤 Afternoon</span>{day.afternoon}</div>
                    <div className="glass rounded-xl p-3"><span className="text-primary-soft block text-xs mb-1">🌙 Evening</span>{day.evening}</div>
                  </div>
                  {day.meals && <p className="text-xs text-slate-500 mt-3">🍽 {day.meals}</p>}
                </div>
              ))}
            </div>
            {data.total_estimated_cost && (
              <div className="glass-card rounded-2xl p-4 mt-4 flex items-center justify-between">
                <span className="text-slate-400 text-sm">Total estimated cost</span>
                <span className="text-gold font-display text-xl font-bold">{data.total_estimated_cost}</span>
              </div>
            )}
          </div>
        );
      case "story":
        return (
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-gold/20 animate-fade-in relative overflow-hidden">
            <div className="aurora-blob w-64 h-64 bg-gold/10 -top-20 -right-20" />
            <h3 className="font-display text-3xl font-bold mb-2 relative">{data.title}</h3>
            <p className="text-xs text-teal mb-6 uppercase tracking-[0.2em] relative">{data.mood}</p>
            <div className="relative">
              {(data.story || "").split("\n\n").map((para, i) => (
                <p key={i} className="text-slate-200/90 leading-loose mb-4 font-serif text-lg">{para}</p>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-6 relative">
              {(data.cultural_threads || []).map((t, i) => (
                <span key={i} className="chip chip-active !text-xs">{t}</span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/5 relative overflow-hidden">
        <div className="aurora-blob w-56 h-56 bg-primary/20 -top-24 -left-10" />
        <div className="relative">
          <span className="eyebrow mb-2 flex"><span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse-glow" /> Step 2 · Deep dive</span>
          <h2 className="font-display text-3xl font-bold">{destName}</h2>
          <p className="text-slate-400 text-sm mt-1 font-serif italic">{destination.tagline}</p>
        </div>
      </div>

      <div className="flex overflow-x-auto scrollbar-thin border-b border-white/5 px-3 gap-1" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`px-4 py-3.5 text-sm whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-sand"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span aria-hidden>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 max-h-[620px] overflow-y-auto scrollbar-thin">
        {activeTab === "itinerary" && !data && !loadingTab && (
          <button className="btn-primary mb-5" onClick={onGenerateItinerary}>📅 Generate Itinerary</button>
        )}
        {activeTab === "story" && !data && !loadingTab && (
          <button className="btn-primary mb-5" onClick={onGenerateStory}>📖 Generate Immersive Story</button>
        )}
        {renderContent()}
        {data?.uncertainty_notes?.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-gold/5 border border-gold/25">
            <p className="text-xs text-gold font-semibold mb-2 flex items-center gap-2">
              <span>⚠</span> Uncertainty notes — verify before relying on these
            </p>
            <ListItems items={data.uncertainty_notes} />
          </div>
        )}
      </div>
    </div>
  );
}

export { TABS };
