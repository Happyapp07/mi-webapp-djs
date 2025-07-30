import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAchievementStore } from '../../stores/achievementStore';
import { useAuthStore } from '../../stores/authStore';
import { Achievement, AchievementLevel } from '../../types/achievement';
import AchievementBadge from '../achievements/AchievementBadge';
import GalacticInfluencerBadge from '../achievements/GalacticInfluencerBadge';

interface ProfileAchievementsProps {
  userId: string;
  maxDisplay?: number;
}

const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({
  userId,
  maxDisplay = 5
}) => {
  const { fetchUserAchievements, isLoading } = useAchievementStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [hasGalacticInfluencer, setHasGalacticInfluencer] = useState(false);
  
  useEffect(() => {
    const loadAchievements = async () => {
      const userAchievements = await fetchUserAchievements(userId);
      
      // Sort by level and then by unlock date
      const sorted = [...userAchievements]
        .filter(a => a.unlockedLevel) // Only show unlocked achievements
        .sort((a, b) => {
          // First sort by level (platinum first)
          const levelA = getLevelValue(a.unlockedLevel);
          const levelB = getLevelValue(b.unlockedLevel);
          
          if (levelB !== levelA) return levelB - levelA;
          
          // Then sort by unlock date (most recent first)
          if (a.unlockedAt && b.unlockedAt) {
            return b.unlockedAt.getTime() - a.unlockedAt.getTime();
          }
          
          return 0;
        });
      
      // Check for Galactic Influencer
      const hasGI = userAchievements.some(a => a.id === 'galactic_influencer' && a.unlockedLevel === AchievementLevel.PLATINUM);
      setHasGalacticInfluencer(hasGI);
      
      // Limit to maxDisplay
      setAchievements(sorted.slice(0, maxDisplay));
    };
    
    loadAchievements();
  }, [userId, fetchUserAchievements, maxDisplay]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (achievements.length === 0 && !hasGalacticInfluencer) {
    return null;
  }
  
  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium flex items-center">
            <Award size={20} className="mr-2 text-indigo-400" />
            Logros Desbloqueados
          </h3>
          
          <Link 
            to={`/achievements?user=${userId}`}
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
          >
            Ver todos
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {/* Galactic Influencer Badge */}
        {hasGalacticInfluencer && (
          <div className="mb-6">
            <GalacticInfluencerBadge />
          </div>
        )}
        
        {/* Achievement Badges */}
        {achievements.length > 0 && (
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            {achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                size="md"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to convert achievement level to numeric value for comparison
function getLevelValue(level?: AchievementLevel): number {
  if (!level) return 0;
  
  switch (level) {
    case AchievementLevel.BRONZE:
      return 1;
    case AchievementLevel.SILVER:
      return 2;
    case AchievementLevel.GOLD:
      return 3;
    case AchievementLevel.PLATINUM:
      return 4;
    default:
      return 0;
  }
}

export default ProfileAchievements;