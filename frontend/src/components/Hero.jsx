import { useEffect, useState } from "react";
import AnimatedCounter from "./ui/AnimatedCounter";

const ROTATING = ["hidden gems", "local festivals", "authentic food", "cultural stories", "spiritual journeys"];

const EXAMPLES = ["Heritage in Japan", "Food trails in Vietnam", "Spiritual India", "Coastal Italy", "Markets of Morocco"];

const STATS = [
  { value: 15, suffix: "+", label: "AI travel skills" },
  { value: 8, suffix: "", label: "Deep-dive lenses" },
  { value: 100, suffix: "%", label: "Explained picks" },
];

export default function Hero({ onStart, onExample }) {
  const [word, setWord] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % ROTATING.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="aurora-blob w-[40rem] h-[40rem] bg-primary/25 -top-56 -left-40 animate-aurora" />
      <div className="aurora-blob w-[34rem] h-[34rem] bg-aurora/25 -top-32 right-0 animate-aurora" style={{ animationDelay: "-8s" }} />
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
        <span className="eyebrow mb-6 animate-fade-up justify-center flex">
          <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse-glow" />
          AI-first destination discovery
        </span>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.02] mb-6 animate-fade-up" style={{ animationDelay: "80ms", opacity: 0 }}>
          Discover the world's
          <br />
          <span className="text-gradient">{ROTATING[word]}</span>
        </h1>

        <p className="text-lg text-slate-300/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "160ms", opacity: 0 }}>
          Tell Cultural Compass who you are as a traveler. Get personalized destinations, authentic culture,
          intelligent itineraries and immersive stories — each one explaining <em className="text-sand not-italic font-medium">why</em> it fits you.
        </p>

        {/* AI search-style entry */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onStart?.();
          }}
          className="max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: "240ms", opacity: 0 }}
        >
          <div className="glass-card rounded-2xl p-2 flex items-center gap-2 shadow-glow card-sheen">
            <div className="pl-3 text-xl text-teal">✦</div>
            <div className="flex-1 text-left px-1 py-3 text-slate-400 truncate">
              Plan a <span className="text-sand">{ROTATING[word]}</span> adventure…
            </div>
            <button type="submit" className="btn-primary !px-5 !py-2.5 text-sm">
              Start planning
            </button>
          </div>
        </form>

        {/* Example chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-5 animate-fade-up" style={{ animationDelay: "320ms", opacity: 0 }}>
          {EXAMPLES.map((ex) => (
            <button key={ex} className="chip text-xs" onClick={() => onExample?.(ex)}>
              {ex}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-14 animate-fade-up" style={{ animationDelay: "400ms", opacity: 0 }}>
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-2xl py-5 px-3">
              <div className="font-display text-3xl sm:text-4xl font-bold text-gradient-static">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
