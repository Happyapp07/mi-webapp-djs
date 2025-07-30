import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LaunchCountdownPage from './pages/LaunchCountdownPage';
import WelcomeScreen from './pages/WelcomeScreen';
import RegisterPage from './pages/RegisterPage';
import CompleteProfile from './pages/CompleteProfile';
import GalaxyView from './pages/GalaxyView';
import PlanetView from './pages/PlanetView';
import ProfilePage from './pages/ProfilePage';
import DjRankings from './pages/DjRankings';
import ClubPage from './pages/ClubPage';
import ScanQrPage from './pages/ScanQrPage';
import CrowdpartyPage from './pages/CrowdpartyPage';
import MissionsPage from './pages/MissionsPage';
import MatchingPage from './pages/MatchingPage';
import GlobalClubsPage from './pages/GlobalClubsPage';
import AlliesProfilesPage from './pages/RaverProfilesPage';
import ReporterProfilesPage from './pages/ReporterProfilesPage';
import AccountSettings from './pages/AccountSettings';
import ConnectedAccounts from './pages/ConnectedAccounts';
import EntitiesPage from './pages/EntitiesPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SubscriptionSelectionPage from './pages/SubscriptionSelectionPage';
import ProfileReferralsPage from './pages/ProfileReferralsPage';
import ReferralPolicyPage from './pages/ReferralPolicyPage';
import AchievementsPage from './pages/AchievementsPage';
import StorePage from './pages/StorePage';
import StoreDropDetail from './components/store/StoreDropDetail';
import WorkWithUsPage from './pages/WorkWithUsPage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuthStore } from './stores/authStore';
import Footer from './components/layout/Footer';
import CookieBanner from './components/common/CookieBanner';
import FallbackErrorPage from './components/common/FallbackErrorPage';
import ReferralBanner from './components/referral/ReferralBanner';
import ReferralWelcomeModal from './components/referral/ReferralWelcomeModal';

function App() {
  const { initializeAuth, isAuthenticated } = useAuthStore();
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showReferralBanner, setShowReferralBanner] = useState(false);
  const [showReferralWelcomeModal, setShowReferralWelcomeModal] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [userActivity, setUserActivity] = useState(Date.now());

  useEffect(() => {
    initializeAuth();
    
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookie-consent');
    if (!hasAcceptedCookies) {
      setShowCookieBanner(true);
    }
    
    // Show referral banner after a delay for authenticated users
    if (isAuthenticated) {
      const hasSeenReferralBanner = localStorage.getItem('referral-banner-seen');
      const lastBannerTime = localStorage.getItem('referral-banner-last-shown');
      const currentTime = Date.now();
      
      // Show banner if user hasn't seen it or it's been more than 30 minutes since last shown
      if (!hasSeenReferralBanner || 
          (lastBannerTime && (currentTime - parseInt(lastBannerTime)) > 30 * 60 * 1000)) {
        const timer = setTimeout(() => {
          setShowReferralBanner(true);
          localStorage.setItem('referral-banner-last-shown', currentTime.toString());
        }, 30000); // Show after 30 seconds
        
        return () => clearTimeout(timer);
      }
    }
    
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferralCode(ref);
      setShowReferralWelcomeModal(true);
    }
  }, [initializeAuth, isAuthenticated]);
  
  const handleCloseReferralBanner = () => {
    setShowReferralBanner(false);
    
    // Mark as seen but don't permanently disable
    const currentTime = Date.now();
    localStorage.setItem('referral-banner-seen', 'true');
    localStorage.setItem('referral-banner-last-shown', currentTime.toString());
  };
  
  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      setUserActivity(Date.now());
    };
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  return (
    <Router>
      <>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<LaunchCountdownPage />} />
            <Route path="/welcome" element={<WelcomeScreen />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/subscription-selection" element={<SubscriptionSelectionPage />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/connected-accounts" element={<ConnectedAccounts />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/referral-policy" element={<ReferralPolicyPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/drops/:dropId" element={<StoreDropDetail />} />
            <Route path="/work-with-us" element={<WorkWithUsPage />} />
            <Route element={<Layout />}>
              <Route path="/galaxy" element={<GalaxyView />} />
              <Route path="/clubs" element={<GlobalClubsPage />} />
              <Route path="/allies" element={<AlliesProfilesPage />} />
              <Route path="/reporters" element={<ReporterProfilesPage />} />
              <Route path="/entities" element={<EntitiesPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/planet/:galaxyId/:planetId" element={<PlanetView />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/profile/referrals" element={<ProfileReferralsPage />} />
                <Route path="/rankings/:planetId?" element={<DjRankings />} />
                <Route path="/club/:clubId" element={<ClubPage />} />
                <Route path="/scan" element={<ScanQrPage />} />
                <Route path="/crowdparty" element={<CrowdpartyPage />} />
                <Route path="/missions" element={<MissionsPage />} />
                <Route path="/matching" element={<MatchingPage />} />
              </Route>
            </Route>
          </Routes>
          
          {/* Error fallback route */}
          <Routes>
            <Route path="/error" element={<FallbackErrorPage showCompleteProfileButton={true} />} />
          </Routes>
          
          <Footer />
        </div>
        {showCookieBanner && <CookieBanner />}
        {showReferralBanner && (
          <ReferralBanner onClose={handleCloseReferralBanner} />
        )}
        <ReferralWelcomeModal 
          isOpen={showReferralWelcomeModal} 
          onClose={() => setShowReferralWelcomeModal(false)}
          referralCode={referralCode || undefined}
        />
      </>
    </Router>
  );
}

export default App;