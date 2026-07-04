import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { api, getAuthToken, getUser, setAuthToken, setUser } from "./api/client";
import LoginScreen from "./components/LoginScreen";
import Hero from "./components/Hero";
import PopularDestinations from "./components/PopularDestinations";
import TripBuilder from "./components/TripBuilder";
import DestinationCard from "./components/DestinationCard";
import DestinationDetail from "./components/DestinationDetail";
import RefinePanel from "./components/RefinePanel";
import TripPlanner from "./components/TripPlanner";
import Reveal from "./components/ui/Reveal";
import TravelBackdrop from "./components/ui/TravelBackdrop";
import { SkeletonCard, SkeletonLines } from "./components/ui/Skeleton";
import { ToastProvider, useToast } from "./components/ui/Toast";

const TripPlanResult = lazy(() => import("./components/TripPlanResult"));

const DEFAULT_PROFILE = {
  interests: [],
  travel_style: "solo",
  budget_range: "mid",
  duration_days: 5,
  origin_location: "",
  preferred_regions: [],
  travel_dates: "",
  dietary_preferences: [],
  accessibility_needs: [],
  language: "en",
  currency: "USD",
};

const TAB_API = {
  culture: api.culture,
  hidden_gems: api.hiddenGems,
  food: api.food,
  festivals: api.festivals,
  experiences: api.experiences,
  itinerary: api.itinerary,
  story: api.story,
};

const DEFAULT_PLAN = {
  destination: "",
  budget: 2000,
  days: 4,
  travelers: 2,
  travel_style: "adventure",
  interests: ["Food", "Local Culture"],
  transport: "Any",
  hotel_preference: "Mid-range",
  start_date: "",
  currency: "USD",
};

function AppContent() {
  const notify = useToast();
  const [view, setView] = useState(getAuthToken() || !import.meta.env.VITE_GOOGLE_CLIENT_ID ? "app" : "login");
  const [user, setUserState] = useState(getUser());
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [discoverResult, setDiscoverResult] = useState(null);
  const [selectedDest, setSelectedDest] = useState(null);
  const [activeTab, setActiveTab] = useState("culture");
  const [tabData, setTabData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingTab, setLoadingTab] = useState(false);
  const [refineText, setRefineText] = useState("");
  const [refineResult, setRefineResult] = useState(null);
  const [refineLoading, setRefineLoading] = useState(false);
  const [health, setHealth] = useState(null);

  const [mode, setMode] = useState("discover");
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [planResult, setPlanResult] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  const builderRef = useRef(null);
  const resultsRef = useRef(null);
  const detailRef = useRef(null);
  const planRef = useRef(null);

  useEffect(() => {
    api.health().then(setHealth).catch(() => setHealth({ status: "error" }));
  }, []);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleGoogleSuccess = useCallback(
    async (response) => {
      try {
        const credential = response.credential;
        setAuthToken(credential);
        const authRes = await api.authGoogle(credential);
        setUser(authRes.user);
        setUserState(authRes.user);
        setView("app");
      } catch (err) {
        notify(err.message);
      }
    },
    [notify]
  );

  const handleSkipLogin = () => {
    setAuthToken("demo");
    setUser({ name: "Demo Traveler", email: "demo@local" });
    setUserState({ name: "Demo Traveler", email: "demo@local" });
    setView("app");
  };

  const handleExample = (text) => {
    setProfile((p) => ({ ...p, preferred_regions: [text] }));
    scrollTo(builderRef);
  };

  const handlePopular = (place) => {
    setProfile((p) => ({
      ...p,
      preferred_regions: [place],
      interests: p.interests.length ? p.interests : ["History", "Food"],
    }));
    scrollTo(builderRef);
    notify(`${place} loaded — review and hit Discover ✦`, "success");
  };

  const handleDiscover = async () => {
    setLoading(true);
    setDiscoverResult(null);
    setSelectedDest(null);
    setTabData({});
    setTimeout(() => scrollTo(resultsRef), 100);
    try {
      const result = await api.discover(profile);
      setDiscoverResult(result);
    } catch (err) {
      notify(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTab = useCallback(
    async (tabId, dest) => {
      if (tabData[tabId] || tabId === "itinerary" || tabId === "story") return;
      setLoadingTab(true);
      try {
        const destName = `${dest.name}, ${dest.country}`;
        const fn = TAB_API[tabId];
        const result = await fn(profile, destName);
        setTabData((prev) => ({ ...prev, [tabId]: result }));
      } catch (err) {
        notify(err.message);
      } finally {
        setLoadingTab(false);
      }
    },
    [profile, tabData, notify]
  );

  useEffect(() => {
    if (selectedDest && activeTab && !["itinerary", "story"].includes(activeTab)) {
      loadTab(activeTab, selectedDest);
    }
  }, [selectedDest, activeTab, loadTab]);

  const handleSelectDest = (dest) => {
    setSelectedDest(dest);
    setActiveTab("culture");
    setTabData({});
    setRefineResult(null);
    setTimeout(() => scrollTo(detailRef), 100);
  };

  const handleGenerateItinerary = async () => {
    if (!selectedDest) return;
    setLoadingTab(true);
    try {
      const result = await api.itinerary(profile, `${selectedDest.name}, ${selectedDest.country}`);
      setTabData((prev) => ({ ...prev, itinerary: result }));
    } catch (err) {
      notify(err.message);
    } finally {
      setLoadingTab(false);
    }
  };

  const handleGenerateStory = async () => {
    if (!selectedDest) return;
    setLoadingTab(true);
    try {
      const result = await api.story(profile, `${selectedDest.name}, ${selectedDest.country}`, "cultural immersion");
      setTabData((prev) => ({ ...prev, story: result }));
    } catch (err) {
      notify(err.message);
    } finally {
      setLoadingTab(false);
    }
  };

  const handleRefine = async () => {
    setRefineLoading(true);
    try {
      const summary = discoverResult?.summary || JSON.stringify(selectedDest);
      const result = await api.refine(profile, summary, refineText);
      setRefineResult(result);
      notify("Recommendations refined", "success");
    } catch (err) {
      notify(err.message);
    } finally {
      setRefineLoading(false);
    }
  };

  const handlePlanTrip = async () => {
    setPlanLoading(true);
    setPlanResult(null);
    setTimeout(() => scrollTo(planRef), 100);
    try {
      const result = await api.planTrip({ ...plan, budget: String(plan.budget) });
      setPlanResult(result);
      notify("Itinerary ready", "success");
    } catch (err) {
      notify(err.message);
    } finally {
      setPlanLoading(false);
    }
  };

  if (view === "login") {
    return (
      <LoginScreen
        onSuccess={handleGoogleSuccess}
        authRequired={health?.google_auth_configured}
        onSkip={handleSkipLogin}
      />
    );
  }

  return (
    <div className="app-bg min-h-screen relative">
      <TravelBackdrop />
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-ink-950/70">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl glass flex items-center justify-center text-xl shadow-glow">🧭</div>
            <div>
              <h1 className="font-display text-xl font-bold leading-none">Cultural Compass</h1>
              <p className="text-[11px] text-slate-500">Destination Discovery &amp; Cultural Experiences</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full glass ${
                health?.status === "ok" ? "text-green-400" : "text-slate-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${health?.status === "ok" ? "bg-green-400 animate-pulse-glow" : "bg-slate-500"}`} />
              {health?.status === "ok" ? "Agent connected" : "Connecting…"}
            </span>
            {user && (
              <div className="flex items-center gap-2 glass rounded-full pl-1 pr-3 py-1">
                {user.picture ? (
                  <img src={user.picture} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-xs font-bold text-white">
                    {(user.name || "T")[0]}
                  </span>
                )}
                <span className="text-sm text-slate-300 hidden sm:inline">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <Hero onStart={() => scrollTo(builderRef)} onExample={handleExample} />

      <main className="max-w-7xl mx-auto px-4 pb-16 space-y-12 relative z-10">
        <div className="flex justify-center">
          <div className="glass rounded-full p-1 inline-flex gap-1" role="tablist" aria-label="App mode">
            <button
              role="tab"
              aria-selected={mode === "discover"}
              onClick={() => setMode("discover")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                mode === "discover" ? "bg-gradient-to-r from-primary to-primary-deep text-white shadow-glow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🧭 Discover
            </button>
            <button
              role="tab"
              aria-selected={mode === "planner"}
              onClick={() => setMode("planner")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                mode === "planner" ? "bg-gradient-to-r from-aurora to-teal-deep text-white shadow-glow-teal" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🗺️ AI Trip Planner
            </button>
          </div>
        </div>

        {mode === "planner" && (
          <div ref={planRef} className="scroll-mt-24 space-y-8">
            <Reveal>
              <TripPlanner plan={plan} setPlan={setPlan} onSubmit={handlePlanTrip} loading={planLoading} />
            </Reveal>
            {planLoading && (
              <div className="glass-card rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="typing-dot" />
                    <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
                    <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <span className="text-sm">Your AI travel consultant is designing the perfect itinerary…</span>
                </div>
                <SkeletonLines count={8} />
              </div>
            )}
            {!planLoading && planResult && (
              <Suspense fallback={<div className="glass-card rounded-3xl p-8"><SkeletonLines count={6} /></div>}>
                <TripPlanResult data={planResult} />
              </Suspense>
            )}
          </div>
        )}

        {mode === "discover" && (
          <>
        <PopularDestinations onPick={handlePopular} />

        <div ref={builderRef} className="scroll-mt-24">
          <Reveal>
            <TripBuilder profile={profile} setProfile={setProfile} onSubmit={handleDiscover} loading={loading} />
          </Reveal>
        </div>

        <div ref={resultsRef} className="scroll-mt-24">
          {loading && (
            <section>
              <div className="h-8 w-64 skeleton rounded-lg mb-6" />
              <div className="grid md:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </section>
          )}

          {!loading && discoverResult && (
            <section>
              <Reveal>
                <span className="eyebrow mb-2 flex"><span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" /> Curated for you</span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">Recommended Destinations</h2>
                <p className="text-slate-400 mb-6 max-w-3xl">{discoverResult.summary}</p>
              </Reveal>
              <div className="grid md:grid-cols-2 gap-5">
                {(discoverResult.destinations || []).map((dest, i) => (
                  <Reveal key={i} delay={i * 90}>
                    <DestinationCard
                      destination={dest}
                      onSelect={handleSelectDest}
                      selected={selectedDest?.name === dest.name}
                    />
                  </Reveal>
                ))}
              </div>
              {discoverResult.uncertainty_notes?.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-gold/5 border border-gold/25 text-sm text-slate-300/80">
                  <p className="text-xs text-gold font-semibold mb-2">⚠ Good to know</p>
                  <ul className="list-disc list-inside space-y-1">
                    {discoverResult.uncertainty_notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        {selectedDest && (
          <div ref={detailRef} className="scroll-mt-24">
            <section className="grid lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <DestinationDetail
                  destination={selectedDest}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  tabData={tabData}
                  loadingTab={loadingTab}
                  onGenerateItinerary={handleGenerateItinerary}
                  onGenerateStory={handleGenerateStory}
                />
              </div>
              <RefinePanel
                value={refineText}
                onChange={setRefineText}
                onSubmit={handleRefine}
                loading={refineLoading}
                result={refineResult}
              />
            </section>
          </div>
        )}
          </>
        )}
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Cultural Compass AI · PromptWars</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse-glow" />
            Powered by Google Gemini · Grounded &amp; explainable
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}
