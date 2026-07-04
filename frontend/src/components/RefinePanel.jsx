export default function RefinePanel({ value, onChange, onSubmit, loading, result }) {
  return (
    <div className="glass-card rounded-3xl p-6 fade-up">
      <h3 className="font-display text-2xl font-bold mb-2">Refine with AI</h3>
      <p className="text-sm text-[#9eb4b8] mb-4">
        Ask naturally — e.g. "Make it more budget-friendly" or "Add spiritual sites"
      </p>
      <textarea
        className="w-full bg-[#0f2a30] border border-[#2a4a52] rounded-xl px-4 py-3 text-[#f5ebe0] min-h-[100px] mb-4"
        placeholder="How would you like to refine your recommendations?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button className="btn-primary w-full" onClick={onSubmit} disabled={loading || !value.trim()}>
        {loading ? "Refining..." : "Refine Recommendations"}
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <p className="text-[#c8d6d9] leading-relaxed">{result.refined_summary}</p>
          {(result.updated_recommendations || []).map((rec, i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <h4 className="font-semibold text-[#f5ebe0]">{rec.title}</h4>
              <p className="text-sm text-[#c8d6d9]">{rec.detail}</p>
              <p className="text-xs text-[#e9c46a] mt-2">Why: {rec.why}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
