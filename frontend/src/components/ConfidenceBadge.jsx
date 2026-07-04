export default function ConfidenceBadge({ level }) {
  const normalized = (level || "medium").toLowerCase();
  const cls =
    normalized === "high"
      ? "confidence-high"
      : normalized === "low"
        ? "confidence-low"
        : "confidence-medium";
  const dot =
    normalized === "high" ? "bg-green-400" : normalized === "low" ? "bg-primary-soft" : "bg-gold";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
      title={`AI ${normalized} confidence`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot} animate-pulse-glow`} />
      <span className={cls}>{normalized}</span>
    </span>
  );
}
