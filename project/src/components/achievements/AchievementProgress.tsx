import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronRight } from 'lucide-react';
import { useAchievementStore } from '../../stores/achievementStore';
import { useAuthStore } from '../../stores/authStore';
import { Achievement, AchievementLevel } from '../../types/achievement';
import { Link } from 'react-router-dom';

interface AchievementProgressProps {
  maxDisplay?: number;
  showViewAll?: boolean;
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({
  maxDisplay = 3,
  showViewAll = true
}) => {
  const { user } = useAuthStore();
  const { 
    fetchUserAchievements, 
    userAchievements, 
    isLoading,
    getAchievementProgress,
    getNextLevelRequirement
  } = useAchievementStore();
  
  const [inProgressAchievements, setInProgressAchievements] = useState<Achievement[]>([]);
  
  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) return;
      
      await fetchUserAchievements(user.id);
    };
    
    loadAchievements();
  }, [user, fetchUserAchievements]);
  
  useEffect(() => {
    // Find achievements that are in progress
    // These are achievements that have been unlocked but not at platinum level,
    // or achievements that haven't been unlocked yet
    const inProgress = userAchievements
      .filter(a => a.unlockedLevel !== AchievementLevel.PLATINUM)
      .sort((a, b) => {
        // Sort by level (unlocked achievements first)
        if (a.unlockedLevel && !b.unlockedLevel) return -1;
        if (!a.unlockedLevel && b.unlockedLevel) return 1;
        
        // Then sort by progress percentage
        const aProgress = getAchievementProgress(a.id);
        const bProgress = getAchievementProgress(b.id);
        const aRequirement = getNextLevelRequirement(a.id) || 1;
        const bRequirement = getNextLevelRequirement(b.id) || 1;
        
        const aPercentage = aProgress / aRequirement;
        const bPercentage = bProgress / bRequirement;
        
        return bPercentage - aPercentage;
      })
      .slice(0, maxDisplay);
    
    setInProgressAchievements(inProgress);
  }, [userAchievements, getAchievementProgress, getNextLevelRequirement, maxDisplay]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (inProgressAchievements.length === 0) {
    return null;
  }
  
  return (
    <div className="glass-card p-4 rounded-xl mb-6 relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium flex items-center">
            <Award size={18} className="mr-2 text-indigo-400" />
            Logros en Progreso
          </h3>
          
          {showViewAll && (
            <Link 
              to="/achievements" 
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              Ver todos
              <ChevronRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
        
        <div className="space-y-4">
          {inProgressAchievements.map((achievement) => {
            const progress = getAchievementProgress(achievement.id);
            const nextRequirement = getNextLevelRequirement(achievement.id) || 1;
            const percentage = Math.min((progress / nextRequirement) * 100, 100);
            
            const nextLevel = achievement.levels.find(level => 
              !achievement.unlockedLevel || 
              getAchievementLevelValue(level.level) > getAchievementLevelValue(achievement.unlockedLevel)
            );
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-sm text-gray-400">
                    {achievement.unlockedLevel ? (
                      <span className={
                        achievement.unlockedLevel === AchievementLevel.BRONZE ? 'text-amber-500' :
                        achievement.unlockedLevel === AchievementLevel.SILVER ? 'text-gray-300' :
                        'text-yellow-400'
                      }>
                        Nivel {getLevelName(achievement.unlockedLevel)}
                      </span>
                    ) : (
                      <span>No desbloqueado</span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progreso hacia {nextLevel ? getLevelName(nextLevel.level) : 'Desconocido'}</span>
                  <span>{progress}/{nextRequirement}</span>
                </div>
                
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${
                      nextLevel?.level === AchievementLevel.BRONZE ? 'bg-amber-600' :
                      nextLevel?.level === AchievementLevel.SILVER ? 'bg-gray-400' :
                      nextLevel?.level === AchievementLevel.GOLD ? 'bg-yellow-500' :
                      'bg-gradient-to-r from-cyan-500 to-indigo-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                {nextLevel && (
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <div className="text-gray-400">
                      Recompensa: <span className="text-green-400">+{nextLevel.reward.beatcoins} BC</span>
                    </div>
                    {nextLevel.reward.extraReward && (
                      <div className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded">
                        {nextLevel.reward.extraReward.type === 'badge' ? 'Insignia' :
                         nextLevel.reward.extraReward.type === 'feature' ? 'Feature' :
                         nextLevel.reward.extraReward.type === 'subscription' ? 'Suscripción' :
                         'Item'}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper function to get level name
function getLevelName(level: AchievementLevel): string {
  switch (level) {
    case AchievementLevel.BRONZE:
      return 'Bronce';
    case AchievementLevel.SILVER:
      return 'Plata';
    case AchievementLevel.GOLD:
      return 'Oro';
    case AchievementLevel.PLATINUM:
      return 'Platino';
    default:
      return 'Desconocido';
  }
}

// Helper function to convert achievement level to numeric value for comparison
function getAchievementLevelValue(level: AchievementLevel): number {
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

export default AchievementProgress;