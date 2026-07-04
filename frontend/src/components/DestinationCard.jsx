import { useState } from "react";
import ConfidenceBadge from "./ConfidenceBadge";

const GRADIENTS = [
  "from-[#ff6a4d]/50 via-[#f4c56a]/25 to-[#0c1322]",
  "from-[#8b7bff]/50 via-[#22d3c5]/25 to-[#0c1322]",
  "from-[#22d3c5]/50 via-[#8b7bff]/25 to-[#0c1322]",
  "from-[#f4c56a]/50 via-[#ff6a4d]/25 to-[#0c1322]",
];

function hashIndex(str, len) {
  let h = 0;
  for (let i = 0; i < (str || "").length; i++) h = (h * 31 + str.charCodeAt(i)) % 997;
  return h % len;
}

export default function DestinationCard({ destination, onSelect, selected }) {
  const [saved, setSaved] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const name = `${destination.name}, ${destination.country}`;
  const gradient = GRADIENTS[hashIndex(destination.name, GRADIENTS.length)];
  const query = encodeURIComponent(`${destination.name},${destination.country},landmark,travel`);
  const imgUrl = `https://loremflickr.com/640/400/${query}?lock=${hashIndex(name, 500) + 1}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(destination)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(destination))}
      className={`glass-card glass-hover card-sheen rounded-2xl overflow-hidden text-left w-full cursor-pointer group ${
        selected ? "ring-2 ring-primary shadow-glow" : ""
      }`}
    >
      {/* Photo cover */}
      <div className="relative h-44 overflow-hidden">
        {imgOk ? (
          <img
            src={imgUrl}
            alt={name}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="img-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        <div className="absolute inset-0 photo-overlay" />

        <div className="absolute top-3 left-3">
          <span className="glass rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-teal">
            ✦ AI pick
          </span>
        </div>
        <button
          type="button"
          aria-label={saved ? "Saved" : "Save destination"}
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full glass flex items-center justify-center text-sm transition-transform hover:scale-110"
        >
          {saved ? "❤️" : "🤍"}
        </button>

        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
          <h3 className="font-display text-2xl font-bold leading-tight drop-shadow-lg">{name}</h3>
          <ConfidenceBadge level={destination.confidence} />
        </div>
      </div>

      <div className="p-5">
        <p className="text-gold text-sm mb-3 italic font-serif">{destination.tagline}</p>
        <p className="text-slate-300/80 text-sm leading-relaxed mb-4 line-clamp-3">{destination.why_recommended}</p>

        <div className="flex flex-wrap gap-2 text-xs mb-2">
          <span className="chip chip-active !py-1 !text-xs">{destination.best_for}</span>
          <span className="chip !py-1 !text-xs">💰 ~{destination.estimated_budget_per_day}/day</span>
        </div>

        {destination.grounding_note && (
          <p className="text-xs text-slate-500 mt-3 border-t border-white/5 pt-3 line-clamp-2">ℹ {destination.grounding_note}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">Tap to explore culture, food &amp; more</span>
          <span className="text-primary-soft text-sm font-semibold group-hover:translate-x-1 transition-transform">Explore →</span>
        </div>
      </div>
    </div>
  );
}
