import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Gift, Star, Shield, Calendar, Rocket, Zap, Plane as Planet, Building2, Footprints, Users, Radio, Scan, BarChart2, Camera, Video, Eye, Lock } from 'lucide-react';
import { Achievement, AchievementLevel } from '../../types/achievement';

interface AchievementDetailModalProps {
  achievement: Achievement;
  isOpen: boolean;
  onClose: () => void;
  progress?: number;
}

const AchievementDetailModal: React.FC<AchievementDetailModalProps> = ({
  achievement,
  isOpen,
  onClose,
  progress = 0
}) => {
  const getAchievementIcon = () => {
    switch (achievement.icon) {
      case 'rocket':
        return <Rocket size={32} className="text-indigo-400" />;
      case 'zap':
        return <Zap size={32} className="text-yellow-400" />;
      case 'planet':
        return <Planet size={32} className="text-cyan-400" />;
      case 'building':
        return <Building2 size={32} className="text-orange-400" />;
      case 'footprints':
        return <Footprints size={32} className="text-green-400" />;
      case 'users':
        return <Users size={32} className="text-purple-400" />;
      case 'radio':
        return <Radio size={32} className="text-red-400" />;
      case 'scan':
        return <Scan size={32} className="text-blue-400" />;
      case 'bar-chart':
        return <BarChart2 size={32} className="text-teal-400" />;
      case 'camera':
        return <Camera size={32} className="text-pink-400" />;
      case 'video':
        return <Video size={32} className="text-emerald-400" />;
      case 'eye':
        return <Eye size={32} className="text-blue-400" />;
      case 'shield':
        return <Shield size={32} className="text-gray-400" />;
      case 'star':
        return <Star size={32} className="text-yellow-400" />;
      default:
        return <Award size={32} className="text-indigo-400" />;
    }
  };

  const getLevelColor = (level: AchievementLevel) => {
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

  const getLevelName = (level: AchievementLevel) => {
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

  const getCurrentLevelIndex = () => {
    if (!achievement.unlockedLevel) return -1;
    return achievement.levels.findIndex(l => l.level === achievement.unlockedLevel);
  };

  const currentLevelIndex = getCurrentLevelIndex();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card p-6 rounded-xl max-w-2xl w-full relative overflow-hidden"
        >
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                <div className="relative z-10">
                  {getAchievementIcon()}
                </div>
                <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">{achievement.name}</h2>
                <p className="text-gray-300">{achievement.description}</p>
                
                {achievement.unlockedLevel && achievement.unlockedAt && (
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <Calendar size={14} className="mr-1" />
                    <span>Desbloqueado el {achievement.unlockedAt.toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Achievement Levels */}
            <div className="space-y-4 mb-6">
              {achievement.levels.map((level, index) => {
                const isUnlocked = achievement.unlockedLevel && 
                  index <= currentLevelIndex;
                
                const isCurrentLevel = achievement.unlockedLevel === level.level;
                
                // Calculate progress for the next level
                let levelProgress = 0;
                if (!isUnlocked && index === currentLevelIndex + 1) {
                  const prevRequirement = index > 0 ? achievement.levels[index - 1].requirement : 0;
                  const requirementDiff = level.requirement - prevRequirement;
                  const progressDiff = progress - prevRequirement;
                  levelProgress = Math.max(0, Math.min(100, (progressDiff / requirementDiff) * 100));
                }
                
                return (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg relative overflow-hidden border bg-gradient-to-br ${
                      isUnlocked 
                        ? getLevelColor(level.level)
                        : 'from-gray-800/50 to-gray-700/50 border-gray-700'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            isUnlocked 
                              ? level.level === AchievementLevel.BRONZE ? 'bg-amber-700/30' :
                                level.level === AchievementLevel.SILVER ? 'bg-gray-400/30' :
                                level.level === AchievementLevel.GOLD ? 'bg-yellow-500/30' :
                                'bg-cyan-500/30'
                              : 'bg-gray-700'
                          }`}>
                            {isUnlocked ? (
                              <Star size={16} className={
                                level.level === AchievementLevel.BRONZE ? 'text-amber-500' :
                                level.level === AchievementLevel.SILVER ? 'text-gray-300' :
                                level.level === AchievementLevel.GOLD ? 'text-yellow-400' :
                                'text-cyan-400'
                              } fill="currentColor" />
                            ) : (
                              <Lock size={16} className="text-gray-500" />
                            )}
                          </div>
                          
                          <div>
                            <div className="font-medium">Nivel {getLevelName(level.level)}</div>
                            <div className="text-sm text-gray-400">
                              Requisito: {level.requirement} {getAchievementUnit(achievement.id)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Gift size={16} className="text-green-400 mr-1" />
                          <span className="text-green-400">+{level.reward.beatcoins} BC</span>
                        </div>
                      </div>
                      
                      {level.reward.extraReward && (
                        <div className="p-3 bg-black/30 rounded-lg mt-2">
                          <div className="flex items-center">
                            {level.reward.extraReward.type === 'badge' ? (
                              <Award size={16} className="text-yellow-400 mr-2" />
                            ) : level.reward.extraReward.type === 'feature' ? (
                              <Zap size={16} className="text-indigo-400 mr-2" />
                            ) : level.reward.extraReward.type === 'subscription' ? (
                              <Star size={16} className="text-purple-400 mr-2" />
                            ) : (
                              <Gift size={16} className="text-green-400 mr-2" />
                            )}
                            <span className="text-sm">{level.reward.extraReward.description}</span>
                          </div>
                        </div>
                      )}
                      
                      {!isUnlocked && index === currentLevelIndex + 1 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progreso actual</span>
                            <span>{progress}/{level.requirement}</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${
                                level.level === AchievementLevel.BRONZE ? 'bg-amber-600' :
                                level.level === AchievementLevel.SILVER ? 'bg-gray-400' :
                                level.level === AchievementLevel.GOLD ? 'bg-yellow-500' :
                                'bg-gradient-to-r from-cyan-500 to-indigo-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${levelProgress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {isCurrentLevel && (
                        <div className="mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm inline-block">
                          Nivel actual
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Special note for Galactic Influencer */}
            {achievement.id === 'galactic_influencer' && (
              <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-lg border border-yellow-500/30 mb-6">
                <div className="flex items-center">
                  <Shield size={20} className="text-yellow-400 mr-3" />
                  <div>
                    <h3 className="font-medium">Logro Especial</h3>
                    <p className="text-sm text-gray-300">Este logro se desbloquea automáticamente al conseguir 3 logros en nivel Platino.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="glassmorphism-primary-button px-6 py-2.5"
              >
                Cerrar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Helper function to get the unit for each achievement
function getAchievementUnit(achievementId: string): string {
  switch (achievementId) {
    case 'sessions_uploaded':
      return 'sesiones';
    case 'votes_received':
      return 'votos';
    case 'style_consistency':
      return 'meses';
    case 'club_approved':
      return 'clubs';
    case 'club_attendance':
      return 'clubs';
    case 'matches_made':
      return 'matches';
    case 'crowdparty_participation':
      return 'participaciones';
    case 'profile_completion':
      return '% completado';
    case 'crowdparty_events':
      return 'eventos';
    case 'active_reporters':
      return 'reporteros';
    case 'data_usage':
      return 'usos';
    case 'videos_uploaded':
      return 'videos';
    case 'views_accumulated':
      return 'vistas';
    case 'federation_approval':
      return 'aprobaciones';
    case 'galactic_influencer':
      return 'logros platino';
    default:
      return 'unidades';
  }
}

export default AchievementDetailModal;