import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import ProfileHeader from '../components/profiles/ProfileHeader';
import ProfileTabs from '../components/profiles/ProfileTabs';
import DJBiography from '../components/profiles/tabs/DJBiography';
import DJEquipment from '../components/profiles/tabs/DJEquipment';
import SessionUploadButton from '../components/profile/SessionUploadButton';
import ProfileCompletionIndicator from '../components/common/ProfileCompletionIndicator';
import CompletionRewardModal from '../components/common/CompletionRewardModal';
import ReferralOnboardingTracker from '../components/referral/ReferralOnboardingTracker';
import ReferralOnboardingModal from '../components/referral/ReferralOnboardingModal';
import ProfileAchievements from '../components/profile/ProfileAchievements';
import DailyAchievementTracker from '../components/profile/DailyAchievementTracker';
import { Profile, UserRole, DJLevel, RaverLevel, ClubMembership } from '../types/profiles';
import { calculateCompletionPercentage, getCompletionReward } from '../utils/profileCompletion';
import { useReferralStore } from '../stores/referralStore';
import { ReferralActionType } from '../types/referral';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, updateProfile, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { completeReferralAction, getReferralStats } = useReferralStore();
  const navigate = useNavigate();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('biography');
  const [isLoading, setIsLoading] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState({ percentage: 0, beatcoinsEarned: 0, earnedBadge: false });
  const [previousCompletion, setPreviousCompletion] = useState(0);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const location = useLocation();
  const isShowcaseMode = location.search.includes('mode=showcase');

  useEffect(() => {
    // Check if this is the user's own profile
    const isOwn = userId === user?.id || userId === 'current';
    setIsOwnProfile(isOwn);
    
    // If userId is 'current', replace with actual user ID
    if (userId === 'current' && user) {
      navigate(`/profile/${user.id}`, { 
        state: location.state,
        replace: true 
      });
    }
  }, [userId, user, navigate, location.state]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate]);
  
  // Check if we should show completion prompt
  useEffect(() => {
    if (location.state?.showCompletionPrompt && isOwnProfile) {
      // Set active tab to biography to encourage profile completion
      setActiveTab('biography');
      
      // If it's a new subscription, show a welcome message
      if (location.state?.newSubscription) {
        // You could show a welcome modal or toast here
        console.log('Welcome to your new subscription! Please complete your profile.');
      }
    }
  }, [location.state, isOwnProfile]);

  useEffect(() => {
    // Create a basic profile structure for the current user
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const basicProfile: Profile = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.userType as UserRole,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
      completionPercentage: 25, // Start with low completion to encourage profile filling
      beatcoins: user.beatcoins || 100,
      level: user.level || 1,
      createdAt: user.createdAt || new Date(),
      lastActive: new Date(),
      isVerified: false,
      missions: [],
      membership: {
        tier: 'Basic',
        isActive: true,
        expiresAt: undefined
      }
    } as Profile;

    // Add role-specific fields based on user type
    if (user.userType === 'dj') {
      (basicProfile as any).djName = user.username;
      (basicProfile as any).level = DJLevel.PIONEER;
      (basicProfile as any).musicStyle = '';
      (basicProfile as any).competitionEnabled = isShowcaseMode ? false : true;
      (basicProfile as any).equipment = { hardware: [], software: [] };
      (basicProfile as any).socialLinks = {};
      (basicProfile as any).planetId = '';
      (basicProfile as any).rankingPosition = undefined;
      (basicProfile as any).sessions = [];
      (basicProfile as any).stats = { totalVotes: 0, clubsVisited: 0, eventsPlayed: 0 };
      (basicProfile as any).biography = '';
      (basicProfile as any).events = [];
    } else if (user.userType === 'partygoer') {
      (basicProfile as any).alias = user.username;
      (basicProfile as any).level = RaverLevel.ROOKIE;
      (basicProfile as any).preferences = {
        musicStyles: [],
        favoriteDrinks: [],
        behaviors: {
          attendance: 'occasional',
          geoVoting: false,
          consumption: 'moderate'
        }
      };
      (basicProfile as any).socialLinks = {};
      (basicProfile as any).activity = {
        recentCheckins: [],
        matches: [],
        taggedPhotos: [],
        followedClubs: []
      };
    } else if (user.userType === 'club') {
      (basicProfile as any).clubName = user.username;
      (basicProfile as any).membership = ClubMembership.RECRUIT;
      (basicProfile as any).location = { address: '', city: '', country: '' };
      (basicProfile as any).capacity = 0;
      (basicProfile as any).dominantStyle = '';
      (basicProfile as any).staff = { djs: [], vjs: [], ljs: [], pr: [], bartenders: [], dancers: [] };
      (basicProfile as any).crowdpartyActive = false;
      (basicProfile as any).qrCode = { current: '', expiresAt: new Date() };
      (basicProfile as any).events = [];
      (basicProfile as any).stats = { attendanceRate: 0, averageRating: 0, totalEvents: 0 };
      (basicProfile as any).gallery = [];
      (basicProfile as any).campaigns = [];
    } else if (user.userType === 'reporter') {
      (basicProfile as any).assignedDJ = '';
      (basicProfile as any).recordings = [];
      (basicProfile as any).guidelines = {
        contentRules: [
          'All content must be approved by the DJ before publishing',
          'No unauthorized backstage footage',
          'Respect privacy and consent of all individuals',
          'No explicit or inappropriate content',
          'Maintain professional standards in all recordings'
        ],
        violations: 0
      };
      (basicProfile as any).contractedClubs = [];
    }

    // Store the previous completion percentage
    if (profile) {
      setPreviousCompletion(profile.completionPercentage);
    }
    
    // Check for URL parameters
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    
    // If showcase mode is specified, update the profile
    if (mode === 'showcase' && basicProfile.role === UserRole.DJ) {
      (basicProfile as any).competitionEnabled = false;
    }

    // Calculate actual completion percentage based on fields
    const calculatedPercentage = calculateCompletionPercentage(basicProfile);
    basicProfile.completionPercentage = calculatedPercentage;
    
    // If in showcase mode, update profile accordingly
    if (isShowcaseMode && basicProfile.role === UserRole.DJ) {
      (basicProfile as any).competitionEnabled = false;
      (basicProfile as any).planetId = undefined;
      (basicProfile as any).rankingPosition = undefined;
    }

    setProfile(basicProfile);
    setIsLoading(false);
  }, [userId, user, isShowcaseMode, location.search]);

  useEffect(() => {
    // Check if completion percentage has increased
    if (profile && isOwnProfile && profile.completionPercentage > previousCompletion) {
      // Only show reward modal if there's a significant change
      if (
        (previousCompletion < 50 && profile.completionPercentage >= 50) ||
        (previousCompletion < 75 && profile.completionPercentage >= 75) ||
        (previousCompletion < 100 && profile.completionPercentage >= 100)
      ) {
        const reward = getCompletionReward(profile.completionPercentage);
        setRewardData({
          percentage: profile.completionPercentage,
          beatcoinsEarned: reward.beatcoins,
          earnedBadge: reward.badge
        });
        setShowRewardModal(true);
        
        // In a real app, you would update the user's beatcoins here
        if (profile && updateProfile) {
          updateProfile({
            beatcoins: profile.beatcoins + reward.beatcoins
          });
        }
      }
    }
  }, [profile?.completionPercentage, previousCompletion, isOwnProfile, profile, updateProfile]);

  const handleProfileUpdate = (data: Partial<Profile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...data };
      
      // Recalculate completion percentage
      const newPercentage = calculateCompletionPercentage(updatedProfile);
      updatedProfile.completionPercentage = newPercentage;
      
      setProfile(updatedProfile);
    }
  };

  const handleCompleteProfile = () => {
    setActiveTab('biography');
  };
  
  // Handle showcase mode for DJs
  useEffect(() => {
    if (isShowcaseMode && profile?.role === UserRole.DJ) {
      // Set active tab to biography for showcase mode
      setActiveTab('biography');
    }
  }, [isShowcaseMode, profile]);

  const handleCompleteMission = async (missionId: string) => {
    // Update completed missions
    setCompletedMissions(prev => [...prev, missionId]);
    
    // In a real app, this would trigger the appropriate action
    // For demo purposes, we'll just simulate completing the mission
    
    // If it's a ReferralActionType mission, complete it through the store
    if (missionId === 'profile_completion') {
      // This would be handled by the profile completion logic
    } else if (missionId === 'vote') {
      // This would be handled when the user votes
    } else if (missionId === 'scan_qr') {
      // This would be handled when the user scans a QR code
    } else if (missionId === 'match') {
      // This would be handled when the user creates a match
    } else if (missionId === 'upload_session') {
      // This would be handled when the user uploads a session
    }
    
    // For non-ReferralActionType missions, just update the UI
    // In a real app, these would be tracked and completed through other means
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The profile you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Profile Completion Indicator (only for own profile) */}
        {isOwnProfile && (
          <>
            <ProfileCompletionIndicator
              completionPercentage={profile.completionPercentage}
              role={profile.role}
              isOwnProfile={isOwnProfile}
              onCompleteProfile={handleCompleteProfile}
            />
            
            {/* Show welcome message for new free tier users */}
            {location.state?.newSubscription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-xl mb-6 border border-indigo-500/30"
              >
                <h3 className="text-xl font-bold mb-2">¡Bienvenido a tu nueva membresía!</h3>
                <p className="text-gray-300 mb-4">
                  Para aprovechar al máximo tu experiencia, te recomendamos completar tu perfil al 100%.
                  Esto te ayudará a conectar mejor con otros usuarios y desbloquear todas las funcionalidades.
                </p>
                <button
                  onClick={handleCompleteProfile}
                  className="glassmorphism-primary-button px-6 py-2.5"
                >
                  Completar mi perfil ahora
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Referral Onboarding Tracker (for referred users) */}
        {isOwnProfile && (
          <ReferralOnboardingTracker />
        )}
        
        {/* Daily Achievement Tracker */}
        {isOwnProfile && (
          <DailyAchievementTracker />
        )}

        {/* Profile Header */}
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={isOwnProfile} 
          onEdit={() => setActiveTab('biography')}
        />
        
        {/* Profile Achievements */}
        <ProfileAchievements userId={profile.id} />

        {/* Profile Tabs */}
        <ProfileTabs 
          profile={profile}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
        
        {/* Session Upload Button for DJs */}
        {profile.role === UserRole.DJ && (
          <SessionUploadButton djId={profile.id} isOwnProfile={isOwnProfile} />
        )}
      </motion.div>

      {/* Completion Reward Modal */}
      <CompletionRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        percentage={rewardData.percentage}
        beatcoinsEarned={rewardData.beatcoinsEarned}
        earnedBadge={rewardData.earnedBadge}
      />

      {/* Referral Onboarding Modal */}
      <ReferralOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        completedMissions={completedMissions}
        onCompleteMission={handleCompleteMission}
      />

    </div>
  );

  function renderTabContent() {
    if (!profile) return null;

    switch (activeTab) {
      case 'biography':
        return (
          <DJBiography 
            profile={profile as any}
            isOwnProfile={isOwnProfile}
            onUpdate={handleProfileUpdate}
          />
        );
      case 'equipment':
        return (
          <DJEquipment 
            profile={profile as any}
            isOwnProfile={isOwnProfile}
            onUpdate={handleProfileUpdate}
          />
        );
      case 'sessions':
        return (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-4">DJ Sessions</h3>
            <p className="text-gray-400">Sessions content coming soon...</p>
          </div>
        );
      case 'stats':
        return (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Statistics</h3>
            <p className="text-gray-400">Statistics content coming soon...</p>
          </div>
        );
      case 'events':
        return (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Events</h3>
            <p className="text-gray-400">Events content coming soon...</p>
          </div>
        );
      case 'reporter':
        return (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Assigned Reporter</h3>
            <p className="text-gray-400">Reporter content coming soon...</p>
          </div>
        );
      case 'missions':
        return (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Missions</h3>
            <p className="text-gray-400">Missions content coming soon...</p>
            
            {/* Button to open onboarding modal (for demo purposes) */}
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors"
            >
              Ver Misiones de Onboarding
            </button>
          </div>
        );
      case 'membership':
        return (
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Membership</h3>
            <p className="text-gray-400">Membership content coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="glass-card p-6 rounded-xl">
            <p className="text-gray-400">Content not available</p>
          </div>
        );
    }
  }
};

export default ProfilePage;