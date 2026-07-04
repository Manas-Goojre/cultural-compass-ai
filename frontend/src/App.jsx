import { useCallback, useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { api, getAuthToken, getUser, setAuthToken, setUser } from "./api/client";
import LoginScreen from "./components/LoginScreen";
import TripBuilder from "./components/TripBuilder";
import DestinationCard from "./components/DestinationCard";
import DestinationDetail, { TABS } from "./components/DestinationDetail";
import RefinePanel from "./components/RefinePanel";

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

function AppContent() {
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

  useEffect(() => {
    api.health().then(setHealth).catch(() => setHealth({ status: "error" }));
  }, []);

  const handleGoogleSuccess = useCallback(async (response) => {
    try {
      const credential = response.credential;
      setAuthToken(credential);
      const authRes = await api.authGoogle(credential);
      setUser(authRes.user);
      setUserState(authRes.user);
      setView("app");
    } catch (err) {
      alert(err.message);
    }
  }, []);

  const handleSkipLogin = () => {
    setAuthToken("demo");
    setUser({ name: "Demo Traveler", email: "demo@local" });
    setUserState({ name: "Demo Traveler", email: "demo@local" });
    setView("app");
  };

  const handleDiscover = async () => {
    setLoading(true);
    setDiscoverResult(null);
    setSelectedDest(null);
    setTabData({});
    try {
      const result = await api.discover(profile);
      setDiscoverResult(result);
    } catch (err) {
      alert(err.message);
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
        alert(err.message);
      } finally {
        setLoadingTab(false);
      }
    },
    [profile, tabData]
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
  };

  const handleGenerateItinerary = async () => {
    if (!selectedDest) return;
    setLoadingTab(true);
    try {
      const result = await api.itinerary(profile, `${selectedDest.name}, ${selectedDest.country}`);
      setTabData((prev) => ({ ...prev, itinerary: result }));
    } catch (err) {
      alert(err.message);
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
      alert(err.message);
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
    } catch (err) {
      alert(err.message);
    } finally {
      setRefineLoading(false);
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
    <div className="min-h-screen aurora-bg">
      <header className="border-b border-[#2a4a52]/60 backdrop-blur-md sticky top-0 z-50 bg-[#0b1f24]/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧭</span>
            <div>
              <h1 className="font-display text-2xl font-bold leading-none">Cultural Compass</h1>
              <p className="text-xs text-[#7a9499]">Destination Discovery & Cultural Experiences</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {health?.status === "ok" && (
              <span className="text-xs text-emerald-400 hidden sm:inline">● Gemini connected</span>
            )}
            {user && (
              <div className="flex items-center gap-2">
                {user.picture && <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />}
                <span className="text-sm text-[#c8d6d9] hidden sm:inline">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <TripBuilder profile={profile} setProfile={setProfile} onSubmit={handleDiscover} loading={loading} />

        {discoverResult && (
          <section className="fade-up">
            <h2 className="font-display text-3xl font-bold mb-2">Recommended Destinations</h2>
            <p className="text-[#9eb4b8] mb-6">{discoverResult.summary}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {(discoverResult.destinations || []).map((dest, i) => (
                <DestinationCard
                  key={i}
                  destination={dest}
                  onSelect={handleSelectDest}
                  selected={selectedDest?.name === dest.name}
                />
              ))}
            </div>
          </section>
        )}

        {selectedDest && (
          <section className="grid lg:grid-cols-3 gap-6">
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
        )}
      </main>

      <footer className="text-center py-8 text-xs text-[#5a757a]">
        Cultural Compass AI · PromptWars · Powered by Google Gemini
      </footer>
    </div>
  );
}

export default function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}
