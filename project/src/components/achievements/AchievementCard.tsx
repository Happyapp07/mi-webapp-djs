import React from 'react';
import { motion } from 'framer-motion';
import { Award, Rocket, Zap, Plane as Planet, Building2, Footprints, Users, Radio, Scan, BarChart2, Camera, Video, Eye, Shield, Star, Gift, Lock } from 'lucide-react';
import { Achievement, AchievementLevel } from '../../types/achievement';

interface AchievementCardProps {
  achievement: Achievement;
  progress?: number;
  onClick?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement, 
  progress = 0,
  onClick 
}) => {
  const getAchievementIcon = () => {
    switch (achievement.icon) {
      case 'rocket':
        return <Rocket size={24} className="text-indigo-400" />;
      case 'zap':
        return <Zap size={24} className="text-yellow-400" />;
      case 'planet':
        return <Planet size={24} className="text-cyan-400" />;
      case 'building':
        return <Building2 size={24} className="text-orange-400" />;
      case 'footprints':
        return <Footprints size={24} className="text-green-400" />;
      case 'users':
        return <Users size={24} className="text-purple-400" />;
      case 'radio':
        return <Radio size={24} className="text-red-400" />;
      case 'scan':
        return <Scan size={24} className="text-blue-400" />;
      case 'bar-chart':
        return <BarChart2 size={24} className="text-teal-400" />;
      case 'camera':
        return <Camera size={24} className="text-pink-400" />;
      case 'video':
        return <Video size={24} className="text-emerald-400" />;
      case 'eye':
        return <Eye size={24} className="text-blue-400" />;
      case 'shield':
        return <Shield size={24} className="text-gray-400" />;
      case 'star':
        return <Star size={24} className="text-yellow-400" />;
      default:
        return <Award size={24} className="text-indigo-400" />;
    }
  };

  const getLevelColor = (level?: AchievementLevel) => {
    if (!level) return 'from-gray-700/50 to-gray-600/50 border-gray-700';
    
    switch (level) {
      case AchievementLevel.BRONZE:
        return 'from-amber-700/30 to-amber-600/30 border-amber-700/50';
      case AchievementLevel.SILVER:
        return 'from-gray-400/30 to-gray-300/30 border-gray-400/50';
      case AchievementLevel.GOLD:
        return 'from-yellow-500/30 to-yellow-400/30 border-yellow-500/50';
      case AchievementLevel.PLATINUM:
        return 'from-cyan-500/30 to-indigo-500/30 border-cyan-500/50';
      default:
        return 'from-gray-700/50 to-gray-600/50 border-gray-700';
    }
  };

  const getLevelName = (level?: AchievementLevel) => {
    if (!level) return 'Bloqueado';
    
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
  };

  const getNextLevel = () => {
    if (!achievement.unlockedLevel) {
      return achievement.levels[0];
    }
    
    const currentLevelIndex = achievement.levels.findIndex(l => l.level === achievement.unlockedLevel);
    if (currentLevelIndex === -1 || currentLevelIndex === achievement.levels.length - 1) {
      return null; // No next level
    }
    
    return achievement.levels[currentLevelIndex + 1];
  };

  const nextLevel = getNextLevel();
  const isMaxLevel = achievement.unlockedLevel === AchievementLevel.PLATINUM;

  return (
    <motion.div
      className={`p-4 rounded-xl relative overflow-hidden border bg-gradient-to-br ${getLevelColor(achievement.unlockedLevel)}`}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center mr-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            <div className="relative z-10">
              {getAchievementIcon()}
            </div>
            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg">{achievement.name}</h3>
            <div className="flex items-center">
              {achievement.unlockedLevel ? (
                <div className={`text-sm ${
                  achievement.unlockedLevel === AchievementLevel.BRONZE ? 'text-amber-500' :
                  achievement.unlockedLevel === AchievementLevel.SILVER ? 'text-gray-300' :
                  achievement.unlockedLevel === AchievementLevel.GOLD ? 'text-yellow-400' :
                  'text-cyan-400'
                }`}>
                  Nivel {getLevelName(achievement.unlockedLevel)}
                </div>
              ) : (
                <div className="text-sm text-gray-400 flex items-center">
                  <Lock size={12} className="mr-1" />
                  Bloqueado
                </div>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>
        
        {!isMaxLevel && nextLevel && (
          <>
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span>Progreso hacia {getLevelName(nextLevel.level)}</span>
              <span>{progress}/{nextLevel.requirement}</span>
            </div>
            
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
              <motion.div 
                className={`h-full ${
                  nextLevel.level === AchievementLevel.BRONZE ? 'bg-amber-600' :
                  nextLevel.level === AchievementLevel.SILVER ? 'bg-gray-400' :
                  nextLevel.level === AchievementLevel.GOLD ? 'bg-yellow-500' :
                  'bg-gradient-to-r from-cyan-500 to-indigo-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((progress / nextLevel.requirement) * 100, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </>
        )}
        
        <div className="flex justify-between items-center">
          {nextLevel ? (
            <div className="flex items-center text-sm">
              <Gift size={14} className="text-green-400 mr-1" />
              <span className="text-green-400">+{nextLevel.reward.beatcoins} BC</span>
            </div>
          ) : (
            <div className="flex items-center text-sm">
              <Star size={14} className="text-yellow-400 mr-1" fill="currentColor" />
              <span className="text-yellow-400">Nivel Máximo</span>
            </div>
          )}
          
          {nextLevel?.reward.extraReward && (
            <div className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs">
              {nextLevel.reward.extraReward.type === 'badge' ? 'Insignia' :
               nextLevel.reward.extraReward.type === 'feature' ? 'Feature' :
               nextLevel.reward.extraReward.type === 'subscription' ? 'Suscripción' :
               'Item'}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;