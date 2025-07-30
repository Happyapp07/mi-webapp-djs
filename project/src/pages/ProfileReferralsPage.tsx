import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Rocket, Star } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import ReferralCard from '../components/referral/ReferralCard';
import ReferralLeaderboard from '../components/referral/ReferralLeaderboard';
import ReferralActionTracker from '../components/referral/ReferralActionTracker';
import ReferralMilestoneTracker from '../components/referral/ReferralMilestoneTracker';
import ReferralBadgeDisplay from '../components/referral/ReferralBadgeDisplay';
import ReferralOnboardingTracker from '../components/referral/ReferralOnboardingTracker';
import { useReferralStore } from '../stores/referralStore';
import { REFERRAL_BADGES } from '../types/referral';

const ProfileReferralsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getReferralStats, getReferralBadges } = useReferralStore();
  const [badges, setBadges] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isReferredUser, setIsReferredUser] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const userStats = await getReferralStats(user.id);
          setStats(userStats);
          
          const userBadges = await getReferralBadges(user.id);
          setBadges(userBadges);
          
          // Check if user was referred
          // In a real app, this would check if the user was referred by someone
          // For demo purposes, we'll use a random condition
          setIsReferredUser(Math.random() > 0.5);
        } catch (error) {
          console.error('Failed to load referral data:', error);
        }
      }
    };
    
    loadData();
  }, [user, getReferralStats, getReferralBadges]);
  
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Restringido</h1>
          <p className="text-gray-400">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            <Rocket size={24} className="text-indigo-400 relative z-10" />
            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
          </div>
          <div>
            <h1 className="text-3xl font-display neon-text">Recluta tu Tripulación</h1>
            <p className="text-gray-400 mt-2">
              Invita a tus amigos a unirse a CosmicBeats y gana recompensas exclusivas
            </p>
          </div>
        </div>
        
        {/* Badges Display */}
        {badges.length > 0 && (
          <div className="mt-4 flex items-center">
            <div className="mr-3">
              <Star size={20} className="text-yellow-400" />
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-3">Insignias desbloqueadas:</span>
              <ReferralBadgeDisplay maxDisplay={5} showLabels={false} size="sm" />
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Onboarding Tracker for referred users */}
      {isReferredUser && (
        <ReferralOnboardingTracker />
      )}
      
      {/* Action Tracker */}
      <ReferralActionTracker />
      
      {/* Milestone Tracker */}
      <ReferralMilestoneTracker />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ReferralCard />
        </div>
        
        <div>
          <ReferralLeaderboard />
        </div>
      </div>
      
      {/* Badges Showcase */}
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-card p-6 rounded-xl relative overflow-hidden"
        >
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Star size={24} className="mr-2 text-yellow-400" />
              Tus Insignias de Reclutamiento
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {badges.map(badgeId => {
                const badge = REFERRAL_BADGES.find(b => b.id === badgeId);
                if (!badge) return null;
                
                return (
                  <motion.div
                    key={badgeId}
                    className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30 flex flex-col items-center"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                      {badge.icon === 'radio' && <Radio size={32} className="text-cyan-400 relative z-10" />}
                      {badge.icon === 'satellite' && <Satellite size={32} className="text-indigo-400 relative z-10" />}
                      {badge.icon === 'compass' && <Compass size={32} className="text-purple-400 relative z-10" />}
                      {badge.icon === 'users' && <Users size={32} className="text-green-400 relative z-10" />}
                      {badge.icon === 'crown' && <Crown size={32} className="text-yellow-400 relative z-10" />}
                      <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                    </div>
                    <h3 className="text-lg font-medium text-center">{badge.name}</h3>
                    <p className="text-sm text-gray-400 text-center mt-1">{badge.description}</p>
                    <div className="mt-2 px-3 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-400">
                      +{badge.reward} Beatcoins
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileReferralsPage;