import React from 'react';
import { motion } from 'framer-motion';
import { Award, Rocket, Zap, Plane as Planet, Building2, Footprints, Users, Radio, Scan, BarChart2, Camera, Video, Eye, Shield, Star } from 'lucide-react';
import { Achievement, AchievementLevel } from '../../types/achievement';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showTooltip = true
}) => {
  const getAchievementIcon = () => {
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 32 : 24;
    
    switch (achievement.icon) {
      case 'rocket':
        return <Rocket size={iconSize} className="text-indigo-400" />;
      case 'zap':
        return <Zap size={iconSize} className="text-yellow-400" />;
      case 'planet':
        return <Planet size={iconSize} className="text-cyan-400" />;
      case 'building':
        return <Building2 size={iconSize} className="text-orange-400" />;
      case 'footprints':
        return <Footprints size={iconSize} className="text-green-400" />;
      case 'users':
        return <Users size={iconSize} className="text-purple-400" />;
      case 'radio':
        return <Radio size={iconSize} className="text-red-400" />;
      case 'scan':
        return <Scan size={iconSize} className="text-blue-400" />;
      case 'bar-chart':
        return <BarChart2 size={iconSize} className="text-teal-400" />;
      case 'camera':
        return <Camera size={iconSize} className="text-pink-400" />;
      case 'video':
        return <Video size={iconSize} className="text-emerald-400" />;
      case 'eye':
        return <Eye size={iconSize} className="text-blue-400" />;
      case 'shield':
        return <Shield size={iconSize} className="text-gray-400" />;
      case 'star':
        return <Star size={iconSize} className="text-yellow-400" />;
      default:
        return <Award size={iconSize} className="text-indigo-400" />;
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
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

  return (
    <div className="relative group">
      <motion.div
        className={`${getBadgeSize()} rounded-full bg-gradient-to-br ${getLevelColor(achievement.unlockedLevel)} flex items-center justify-center relative overflow-hidden`}
        whileHover={{ scale: 1.1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
        <div className="relative z-10">
          {getAchievementIcon()}
        </div>
        <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
      </motion.div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-gray-900/90 text-white px-2 py-1 rounded whitespace-nowrap text-center">
            <div className="font-medium text-sm">{achievement.name}</div>
            <div className="text-xs text-gray-300">Nivel {getLevelName(achievement.unlockedLevel)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;