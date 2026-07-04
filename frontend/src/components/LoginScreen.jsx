import { GoogleLogin } from "@react-oauth/google";

const HIGHLIGHTS = [
  { icon: "🧭", title: "Personalized discovery", desc: "Destinations matched to your soul, not a top-10 list." },
  { icon: "🎭", title: "Authentic culture", desc: "Local etiquette, hidden gems & real traditions." },
  { icon: "📖", title: "Immersive stories", desc: "AI-crafted narratives that make places come alive." },
];

export default function LoginScreen({ onSuccess, authRequired, onSkip }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="app-bg min-h-screen relative flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="aurora-blob w-[36rem] h-[36rem] bg-primary/30 -top-40 -left-40 animate-aurora" />
      <div className="aurora-blob w-[32rem] h-[32rem] bg-aurora/30 top-20 -right-32 animate-aurora" style={{ animationDelay: "-6s" }} />
      <div className="aurora-blob w-[28rem] h-[28rem] bg-teal/20 -bottom-40 left-1/3 animate-aurora" style={{ animationDelay: "-12s" }} />
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center max-w-6xl w-full">
        {/* Left — brand story */}
        <div className="hidden lg:block animate-fade-up">
          <span className="eyebrow mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse-glow" /> Powered by Google Gemini
          </span>
          <h1 className="font-display text-6xl font-bold leading-[1.05] mb-6">
            Travel that
            <br />
            <span className="text-gradient">understands you.</span>
          </h1>
          <p className="text-lg text-slate-300/80 max-w-md mb-10 leading-relaxed">
            Cultural Compass is your AI travel architect — discovering destinations, revealing authentic culture,
            and crafting itineraries with every recommendation explained.
          </p>
          <div className="space-y-4">
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={h.title}
                className="flex items-start gap-4 animate-fade-up"
                style={{ animationDelay: `${150 + i * 120}ms`, opacity: 0 }}
              >
                <div className="glass rounded-xl h-11 w-11 flex items-center justify-center text-xl shrink-0">{h.icon}</div>
                <div>
                  <p className="font-semibold text-sand">{h.title}</p>
                  <p className="text-sm text-slate-400">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — auth card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center animate-fade-up max-w-md w-full mx-auto" style={{ animationDelay: "120ms", opacity: 0 }}>
          <div className="mx-auto mb-6 h-20 w-20 rounded-2xl glass flex items-center justify-center text-5xl float-anim animate-float">
            🧭
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">Cultural Compass</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Sign in to start your intelligent, culturally-rich journey.
          </p>

          {clientId ? (
            <div className="flex justify-center mb-4">
              <GoogleLogin
                onSuccess={onSuccess}
                onError={() => onSkip && onSkip()}
                theme="filled_black"
                shape="pill"
                size="large"
                text="continue_with"
              />
            </div>
          ) : (
            <button className="btn-primary w-full text-base mb-3" onClick={onSkip}>
              Enter Demo Mode ✦
            </button>
          )}

          {!authRequired && (
            <button className="btn-ghost w-full text-sm mt-2" onClick={onSkip}>
              Continue as guest
            </button>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse-glow" />
            Grounded responses · Transparent uncertainty · No fabricated facts
          </div>
        </div>
      </div>
    </div>
  );
}
