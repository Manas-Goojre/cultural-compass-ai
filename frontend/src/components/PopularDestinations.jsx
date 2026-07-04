import { useState } from "react";
import Reveal from "./ui/Reveal";

const PLACES = [
  { name: "Jaipur", country: "India", flag: "🇮🇳", tag: "Pink City heritage", size: "big" },
  { name: "Kyoto", country: "Japan", flag: "🇯🇵", tag: "Temples & tradition", size: "big" },
  { name: "Santorini", country: "Greece", flag: "🇬🇷", tag: "Aegean sunsets", size: "sm" },
  { name: "Bali", country: "Indonesia", flag: "🇮🇩", tag: "Island culture", size: "sm" },
  { name: "Marrakech", country: "Morocco", flag: "🇲🇦", tag: "Souks & spice", size: "sm" },
];

function img(place, lock) {
  const q = encodeURIComponent(`${place.name},${place.country},landmark,travel`);
  return `https://loremflickr.com/800/500/${q}?lock=${lock}`;
}

function Tile({ place, lock, onPick, className = "" }) {
  const [ok, setOk] = useState(true);
  return (
    <button
      type="button"
      onClick={() => onPick(`${place.name}, ${place.country}`)}
      className={`group relative overflow-hidden rounded-2xl glass-card ${className}`}
      aria-label={`Explore ${place.name} with AI`}
    >
      {ok ? (
        <img
          src={img(place, lock)}
          alt={`${place.name}, ${place.country}`}
          loading="lazy"
          onError={() => setOk(false)}
          className="img-cover absolute inset-0 transition-transform duration-[900ms] group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-aurora/25 to-ink-900" />
      )}
      <div className="absolute inset-0 photo-overlay" />
      <div className="relative h-full w-full flex flex-col justify-end p-4 text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display text-xl sm:text-2xl font-bold drop-shadow-lg">{place.name}</span>
          <span className="text-lg">{place.flag}</span>
        </div>
        <span className="text-xs text-slate-300/90">{place.tag}</span>
        <span className="mt-2 text-xs text-primary-soft font-semibold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
          Explore with AI →
        </span>
      </div>
    </button>
  );
}

export default function PopularDestinations({ onPick }) {
  const big = PLACES.filter((p) => p.size === "big");
  const small = PLACES.filter((p) => p.size === "sm");

  return (
    <section>
      <Reveal>
        <span className="eyebrow mb-2 flex">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" /> Popular starting points
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-1">Trending destinations</h2>
        <p className="text-slate-400 mb-6">Tap any place to explore it with AI — culture, food, itineraries &amp; more.</p>
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {big.map((p, i) => (
          <Reveal key={p.name} delay={i * 90}>
            <Tile place={p} lock={11 + i} onPick={onPick} className="h-56 w-full" />
          </Reveal>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {small.map((p, i) => (
          <Reveal key={p.name} delay={i * 90}>
            <Tile place={p} lock={21 + i} onPick={onPick} className="h-44 w-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
