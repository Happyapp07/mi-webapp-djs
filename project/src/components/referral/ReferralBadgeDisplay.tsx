import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Radio, Compass, Users, Crown, Satellite } from 'lucide-react';
import { useReferralStore } from '../../stores/referralStore';
import { useAuthStore } from '../../stores/authStore';
import { REFERRAL_BADGES } from '../../types/referral';

interface ReferralBadgeDisplayProps {
  userId?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  maxDisplay?: number;
}

const ReferralBadgeDisplay: React.FC<ReferralBadgeDisplayProps> = ({
  userId,
  size = 'md',
  showLabels = true,
  maxDisplay
}) => {
  const { user } = useAuthStore();
  const { getReferralBadges } = useReferralStore();
  const [badges, setBadges] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadBadges = async () => {
      try {
        setIsLoading(true);
        const targetUserId = userId || user?.id;
        if (!targetUserId) return;
        
        const userBadges = await getReferralBadges(targetUserId);
        setBadges(userBadges);
      } catch (error) {
        console.error('Failed to load badges:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBadges();
  }, [userId, user, getReferralBadges]);
  
  const getBadgeIcon = (badgeId: string) => {
    const badge = REFERRAL_BADGES.find(b => b.id === badgeId);
    if (!badge) return <Award size={getIconSize()} />;
    
    switch (badge.icon) {
      case 'radio':
        return <Radio size={getIconSize()} className="text-cyan-400" />;
      case 'satellite':
        return <Satellite size={getIconSize()} className="text-indigo-400" />;
      case 'compass':
        return <Compass size={getIconSize()} className="text-purple-400" />;
      case 'users':
        return <Users size={getIconSize()} className="text-green-400" />;
      case 'crown':
        return <Crown size={getIconSize()} className="text-yellow-400" />;
      default:
        return <Award size={getIconSize()} className="text-indigo-400" />;
    }
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 24;
      default: return 20;
    }
  };
  
  const getBadgeSize = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-14 h-14';
      default: return 'w-10 h-10';
    }
  };
  
  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-sm';
      default: return 'text-xs';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-10">
        <div className="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (badges.length === 0) {
    return null;
  }
  
  // Limit the number of badges to display if maxDisplay is provided
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  
  return (
    <div className="flex flex-wrap gap-2">
      {displayBadges.map((badgeId) => {
        const badge = REFERRAL_BADGES.find(b => b.id === badgeId);
        if (!badge) return null;
        
        return (
          <motion.div
            key={badgeId}
            className={`${getBadgeSize()} rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex flex-col items-center justify-center relative overflow-hidden group`}
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            <div className="relative z-10">
              {getBadgeIcon(badgeId)}
            </div>
            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            
            {/* Tooltip */}
            {showLabels && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900/90 text-white px-2 py-1 rounded whitespace-nowrap text-center">
                  <div className={`font-medium ${getTextSize()}`}>{badge.name}</div>
                  {size !== 'sm' && (
                    <div className="text-xs text-gray-300">{badge.description}</div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
      
      {/* More indicator */}
      {maxDisplay && badges.length > maxDisplay && (
        <motion.div
          className={`${getBadgeSize()} rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700`}
          whileHover={{ scale: 1.1 }}
        >
          <span className={`${getTextSize()} text-gray-400`}>+{badges.length - maxDisplay}</span>
        </motion.div>
      )}
    </div>
  );
};

export default ReferralBadgeDisplay;