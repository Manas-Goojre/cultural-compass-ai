import { GoogleLogin } from "@react-oauth/google";

export default function LoginScreen({ onSuccess, authRequired, onSkip }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center px-4">
      <div className="glass-card rounded-3xl p-10 max-w-lg w-full text-center fade-up">
        <div className="text-6xl mb-4 float-anim">🧭</div>
        <h1 className="font-display text-5xl font-bold mb-3 text-[#f5ebe0]">Cultural Compass</h1>
        <p className="text-[#c8d6d9] mb-8 leading-relaxed">
          AI-powered destination discovery, authentic cultural experiences, and intelligent itineraries —
          crafted for curious travelers.
        </p>

        {clientId ? (
          <div className="flex justify-center mb-4">
            <GoogleLogin
              onSuccess={onSuccess}
              onError={() => alert("Google sign-in failed. Please try again.")}
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
            />
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-amber-300/90 mb-4">
              Google Client ID not configured. Using demo mode for local development.
            </p>
            <button className="btn-primary w-full" onClick={onSkip}>
              Enter Demo Mode
            </button>
          </div>
        )}

        {!authRequired && clientId && (
          <button className="btn-ghost w-full mt-3 text-sm" onClick={onSkip}>
            Continue without sign-in (demo)
          </button>
        )}

        <p className="text-xs text-[#7a9499] mt-6">
          Powered by Google Gemini · Grounded recommendations with uncertainty transparency
        </p>
      </div>
    </div>
  );
}
