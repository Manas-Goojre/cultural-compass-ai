import ConfidenceBadge from "./ConfidenceBadge";

export default function DestinationCard({ destination, onSelect, selected }) {
  const name = `${destination.name}, ${destination.country}`;
  return (
    <button
      type="button"
      onClick={() => onSelect(destination)}
      className={`glass-card rounded-2xl p-6 text-left w-full transition-all hover:scale-[1.02] ${
        selected ? "ring-2 ring-[#c8553d]" : ""
      }`}
    >
      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="font-display text-2xl font-bold text-[#f5ebe0]">{name}</h3>
        <ConfidenceBadge level={destination.confidence} />
      </div>
      <p className="text-[#e9c46a] text-sm mb-3 italic">{destination.tagline}</p>
      <p className="text-[#b8cdd1] text-sm leading-relaxed mb-4">{destination.why_recommended}</p>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="chip chip-active">{destination.best_for}</span>
        <span className="chip">~{destination.estimated_budget_per_day}/day</span>
      </div>
      {destination.grounding_note && (
        <p className="text-xs text-[#7a9499] mt-3 border-t border-[#2a4a52] pt-3">
          ℹ {destination.grounding_note}
        </p>
      )}
    </button>
  );
}
