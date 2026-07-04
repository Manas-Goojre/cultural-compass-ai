import { SkeletonLines } from "./ui/Skeleton";

const SUGGESTIONS = [
  "Make it more budget-friendly",
  "Add spiritual sites",
  "More off-the-beaten-path",
  "Family-friendly options",
];

export default function RefinePanel({ value, onChange, onSubmit, loading, result }) {
  return (
    <div className="glass-card rounded-3xl p-6 lg:sticky lg:top-24 self-start">
      <span className="eyebrow mb-3 flex"><span className="h-1.5 w-1.5 rounded-full bg-aurora animate-pulse-glow" /> AI Refine</span>
      <h3 className="font-display text-2xl font-bold mb-1">Chat to refine</h3>
      <p className="text-sm text-slate-400 mb-4">Ask naturally — the AI reshapes your recommendations.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="chip !text-xs" onClick={() => onChange(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          className="field min-h-[110px] resize-none pr-4"
          placeholder="How would you like to refine your trip?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <button className="btn-primary w-full mt-4" onClick={onSubmit} disabled={loading || !value.trim()}>
        {loading ? (
          <>
            <span className="typing-dot" />
            <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
            <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
            <span className="ml-2">Refining…</span>
          </>
        ) : (
          <>Refine ✦</>
        )}
      </button>

      {loading && (
        <div className="mt-6">
          <SkeletonLines count={4} />
        </div>
      )}

      {result && !loading && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="glass rounded-xl p-4">
            <p className="text-slate-200/90 leading-relaxed text-sm">{result.refined_summary}</p>
          </div>
          {(result.key_changes || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {result.key_changes.map((c, i) => (
                <span key={i} className="chip chip-active !text-xs">✎ {c}</span>
              ))}
            </div>
          )}
          {(result.updated_recommendations || []).map((rec, i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <h4 className="font-semibold text-sand">{rec.title}</h4>
              <p className="text-sm text-slate-300/80 mt-1">{rec.detail}</p>
              <p className="text-xs text-gold mt-2">✦ {rec.why}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
