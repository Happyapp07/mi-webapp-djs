import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Check, Gift, Star, Trophy, Crown, Rocket, Zap } from 'lucide-react';
import { useReferralStore } from '../../stores/referralStore';
import { useAuthStore } from '../../stores/authStore';
import { ReferralMilestone } from '../../types/referral';

const ReferralMilestoneTracker: React.FC = () => {
  const { user } = useAuthStore();
  const { getReferralStats } = useReferralStore();
  const [milestones, setMilestones] = useState<ReferralMilestone[]>([]);
  const [validReferrals, setValidReferrals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadMilestones = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const stats = await getReferralStats(user.id);
          setMilestones(stats.milestones);
          setValidReferrals(stats.validReferrals);
        } catch (error) {
          console.error('Failed to load milestones:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadMilestones();
  }, [user, getReferralStats]);
  
  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'beatcoins':
        return <Gift size={16} className="text-yellow-400" />;
      case 'subscription':
        return <Crown size={16} className="text-indigo-400" />;
      case 'item':
        return <Star size={16} className="text-green-400" />;
      case 'feature':
        return <Trophy size={16} className="text-purple-400" />;
      default:
        return <Gift size={16} className="text-yellow-400" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (milestones.length === 0) {
    return null;
  }
  
  return (
    <div className="glass-card p-4 rounded-xl mb-6 relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <h3 className="font-medium mb-3 flex items-center">
          <Rocket size={18} className="mr-2 text-indigo-400" />
          Hitos de Reclutamiento
        </h3>
        
        <div className="space-y-3">
          {milestones.map((milestone, index) => {
            const progress = Math.min(validReferrals / milestone.count, 1) * 100;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg relative overflow-hidden ${
                  milestone.isCompleted 
                    ? 'border border-green-500/30' 
                    : 'border border-gray-700'
                }`}
              >
                {/* Background effect */}
                {milestone.isCompleted ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10"></div>
                ) : (
                  <div className="absolute inset-0 bg-gray-800/50"></div>
                )}
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      {milestone.isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                          <Check size={14} className="text-green-500" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                          <span className="text-xs">{milestone.count}</span>
                        </div>
                      )}
                      <span className="font-medium">{milestone.count} Invitados</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      {getRewardIcon(milestone.reward.type)}
                      <span className="ml-1">{milestone.reward.description}</span>
                    </div>
                  </div>
                  
                  {!milestone.isCompleted && (
                    <>
                      <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{validReferrals}/{milestone.count}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Cosmic Ranks */}
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/30">
          <h4 className="font-medium mb-3 flex items-center">
            <Zap size={16} className="mr-2 text-indigo-400" />
            Rangos Cósmicos
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="p-2 bg-gray-800/50 rounded-lg">
              <div className="font-medium mb-1 flex items-center">
                <Star size={14} className="mr-1 text-indigo-400" />
                Signal Beacon (3)
              </div>
              <div className="text-xs text-gray-400">Tu señal ha alcanzado a 3 nuevos tripulantes</div>
            </div>
            <div className="p-2 bg-gray-800/50 rounded-lg">
              <div className="font-medium mb-1 flex items-center">
                <Rocket size={14} className="mr-1 text-purple-400" />
                Orbital Influencer (10)
              </div>
              <div className="text-xs text-gray-400">Tu influencia se extiende por toda la órbita</div>
            </div>
            <div className="p-2 bg-gray-800/50 rounded-lg">
              <div className="font-medium mb-1 flex items-center">
                <Crown size={14} className="mr-1 text-yellow-400" />
                Fleet Commander (50)
              </div>
              <div className="text-xs text-gray-400">Comandas una flota de 50 tripulantes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralMilestoneTracker;