import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, Gift, Star } from 'lucide-react';
import { UserRole } from '../../types/profiles';

interface ProfileCompletionIndicatorProps {
  completionPercentage: number;
  role: UserRole;
  isOwnProfile: boolean;
  onCompleteProfile?: () => void;
}

const ProfileCompletionIndicator: React.FC<ProfileCompletionIndicatorProps> = ({
  completionPercentage,
  role,
  isOwnProfile,
  onCompleteProfile
}) => {
  // Calculate rewards based on completion percentage
  const getReward = (percentage: number) => {
    if (percentage >= 100) return { beatcoins: 150, badge: true };
    if (percentage >= 75) return { beatcoins: 100, badge: false };
    if (percentage >= 50) return { beatcoins: 50, badge: false };
    return { beatcoins: 0, badge: false };
  };

  const reward = getReward(completionPercentage);
  
  // Only show to profile owners
  if (!isOwnProfile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-xl border border-indigo-500/30 mb-6 relative overflow-hidden"
    >
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
        {/* Circular progress indicator */}
        <div className="relative flex-shrink-0 w-24 h-24 mx-auto md:mx-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(0, 255, 255, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke={
                completionPercentage >= 100 ? '#10B981' :
                completionPercentage >= 75 ? '#FBBF24' :
                completionPercentage >= 50 ? '#F59E0B' :
                '#EF4444'
              }
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 45 * (1 - completionPercentage / 100) 
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Percentage text */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              fontWeight="bold"
              fill={
                completionPercentage >= 100 ? '#10B981' :
                completionPercentage >= 75 ? '#FBBF24' :
                completionPercentage >= 50 ? '#F59E0B' :
                '#EF4444'
              }
            >
              {completionPercentage}%
            </text>
          </svg>
          
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 20px ${
                completionPercentage >= 100 ? 'rgba(16, 185, 129, 0.5)' :
                completionPercentage >= 75 ? 'rgba(251, 191, 36, 0.5)' :
                completionPercentage >= 50 ? 'rgba(245, 158, 11, 0.5)' :
                'rgba(239, 68, 68, 0.5)'
              }`
            }}
          ></div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start">
            {completionPercentage < 100 ? (
              <>
                <AlertTriangle size={24} className="text-yellow-500 mr-2" />
                Completa Tu Perfil
              </>
            ) : (
              <>
                <Check size={24} className="text-green-500 mr-2" />
                ¡Perfil Completo!
              </>
            )}
          </h3>
          
          <div className="mb-4">
            <p className="text-gray-300">
              {completionPercentage < 100 
                ? 'Completa tu perfil para desbloquear recompensas y mejorar tu visibilidad en la comunidad.'
                : '¡Felicidades! Tu perfil está completamente optimizado para máxima visibilidad.'}
            </p>
          </div>
          
          <div className="space-y-3">
            {completionPercentage < 50 && (
              <div className="flex items-center text-sm bg-gray-800/50 p-3 rounded-lg">
                <Gift size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                <span>Alcanza el 50% para ganar +50 Beatcoins</span>
              </div>
            )}
            
            {completionPercentage >= 50 && completionPercentage < 75 && (
              <div className="flex items-center text-sm bg-gray-800/50 p-3 rounded-lg">
                <Gift size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                <span>Alcanza el 75% para ganar +50 Beatcoins más</span>
              </div>
            )}
            
            {completionPercentage >= 75 && completionPercentage < 100 && (
              <div className="flex items-center text-sm bg-gray-800/50 p-3 rounded-lg">
                <Gift size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                <span>Alcanza el 100% para ganar +50 Beatcoins más y una insignia exclusiva</span>
              </div>
            )}
            
            {completionPercentage >= 100 && (
              <div className="flex items-center text-sm bg-green-500/20 p-3 rounded-lg border border-green-500/30">
                <Star size={16} className="text-green-400 mr-2 flex-shrink-0" fill="currentColor" />
                <span>Has ganado 150 Beatcoins y una insignia exclusiva</span>
              </div>
            )}
          </div>
          
          {completionPercentage < 100 && onCompleteProfile && (
            <button
              onClick={onCompleteProfile}
              className="mt-4 w-full md:w-auto glassmorphism-primary-button px-6 py-2.5"
            >
              Completar Tu Perfil
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCompletionIndicator;