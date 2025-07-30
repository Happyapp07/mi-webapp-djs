import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Star, X, Award, Zap, Clock, Calendar, UserPlus } from 'lucide-react';
import Confetti from 'react-confetti';
import useMeasure from 'react-use-measure';
import { useReferralStore } from '../../stores/referralStore';
import { useAuthStore } from '../../stores/authStore';
import { ReferralActionType } from '../../types/referral';

interface CompletionRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  percentage: number;
  beatcoinsEarned: number;
  earnedBadge: boolean;
}

const CompletionRewardModal: React.FC<CompletionRewardModalProps> = ({
  isOpen,
  onClose,
  percentage,
  beatcoinsEarned,
  earnedBadge
}) => {
  const [ref, bounds] = useMeasure();
  const { user } = useAuthStore();
  const { completeReferralAction, getReferralStats } = useReferralStore();
  
  useEffect(() => {
    // Check if profile completion action should be triggered
    const checkReferralAction = async () => {
      if (isOpen && percentage >= 80 && user) {
        try {
          // Get user's referrals
          const stats = await getReferralStats(user.id);
          
          // Find pending referrals with incomplete profile action
          const pendingReferrals = stats.referralDetails
            .filter(detail => detail.status === 'pending')
            .filter(detail => {
              const profileAction = detail.actions.find(a => a.type === ReferralActionType.PROFILE_COMPLETION);
              return profileAction && !profileAction.completed;
            });
          
          // Complete the action for the first pending referral
          if (pendingReferrals.length > 0) {
            await completeReferralAction(
              pendingReferrals[0].id, 
              ReferralActionType.PROFILE_COMPLETION
            );
          }
        } catch (error) {
          console.error('Failed to complete profile action:', error);
        }
      }
    };
    
    checkReferralAction();
  }, [isOpen, percentage, user, completeReferralAction, getReferralStats]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" ref={ref}>
      <Confetti
        width={bounds.width}
        height={bounds.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.15}
        colors={['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ffffff']}
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="glass-card p-8 rounded-xl max-w-md w-full relative border border-indigo-500/30 overflow-hidden"
        >
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="relative z-10 text-center">
            <motion.div 
              className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {earnedBadge ? (
                <Award size={40} className="text-white" />
              ) : (
                <Gift size={40} className="text-white" />
              )}
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-2 neon-text">
              {percentage >= 100 
                ? '¡Perfil Completo!' 
                : `${percentage}% Completado`}
            </h2>
            
            <p className="text-gray-300 mb-6">
              {percentage >= 100 
                ? 'Has completado tu perfil y desbloqueado todas las recompensas.' 
                : 'Has avanzado mucho en completar tu perfil.'}
            </p>
            
            <div className="space-y-4 mb-6">
              <motion.div 
                className="p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg flex items-center border border-yellow-500/30"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Zap size={24} className="text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-bold text-xl">+{beatcoinsEarned} Beatcoins</div>
                  <div className="text-sm text-gray-300">Añadidos a tu cuenta</div>
                </div>
              </motion.div>
              
              {earnedBadge && (
                <motion.div 
                  className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center border border-indigo-500/30"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Star size={24} className="text-indigo-400 mr-3 flex-shrink-0" fill="currentColor" />
                  <div>
                    <div className="font-bold text-xl">Insignia Exclusiva de Perfil</div>
                    <div className="text-sm text-gray-300">Tu perfil ahora destaca en la comunidad</div>
                  </div>
                </motion.div>
              )}
              
              {percentage >= 80 && (
                <motion.div 
                  className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center border border-green-500/30"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <UserPlus size={24} className="text-green-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-xl">Recompensa de Referido</div>
                    <div className="text-sm text-gray-300">Si fuiste invitado, ambos habéis recibido Beatcoins extra</div>
                  </div>
                </motion.div>
              )}
              
              {percentage >= 100 && (
                <motion.div 
                  className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center border border-green-500/30"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Award size={24} className="text-green-400 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-xl">Mayor Visibilidad</div>
                    <div className="text-sm text-gray-300">Tu perfil aparecerá de forma más destacada</div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="glassmorphism-primary-button px-6 py-3 w-full"
            >
              Continuar
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CompletionRewardModal;