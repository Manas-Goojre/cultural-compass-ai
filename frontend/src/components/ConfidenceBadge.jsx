export default function ConfidenceBadge({ level }) {
  const normalized = (level || "medium").toLowerCase();
  const cls =
    normalized === "high"
      ? "confidence-high"
      : normalized === "low"
        ? "confidence-low"
        : "confidence-medium";
  return (
    <span className={`text-xs uppercase tracking-wider font-medium ${cls}`}>
      {normalized} confidence
    </span>
  );
}
