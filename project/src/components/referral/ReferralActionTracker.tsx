import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Gift, AlertTriangle, Rocket, Zap, Target, Award } from 'lucide-react';
import { useReferralStore } from '../../stores/referralStore';
import { useAuthStore } from '../../stores/authStore';
import { ReferralActionType, REFERRAL_ACTION_REWARDS, REFERRAL_EXPIRATION_DAYS } from '../../types/referral';

const ReferralActionTracker: React.FC = () => {
  const { user } = useAuthStore();
  const { getReferralStats, completeReferralAction } = useReferralStore();
  const [pendingReferrals, setPendingReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadReferralData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const stats = await getReferralStats(user.id);
          
          // Filter pending referrals with incomplete actions
          const pending = stats.referralDetails
            .filter(detail => detail.status === 'pending')
            .filter(detail => detail.actions.some(action => !action.completed));
          
          setPendingReferrals(pending);
        } catch (error) {
          console.error('Failed to load referral data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadReferralData();
  }, [user, getReferralStats]);
  
  const handleCompleteAction = async (referralId: string, actionType: ReferralActionType) => {
    try {
      await completeReferralAction(referralId, actionType);
      
      // Update the UI
      setPendingReferrals(prev => 
        prev.map(referral => {
          if (referral.id === referralId) {
            return {
              ...referral,
              actions: referral.actions.map((action: any) => 
                action.type === actionType 
                  ? { ...action, completed: true, beatcoinsRewarded: REFERRAL_ACTION_REWARDS[actionType] }
                  : action
              )
            };
          }
          return referral;
        })
      );
    } catch (error) {
      console.error('Failed to complete action:', error);
    }
  };
  
  const getActionLabel = (actionType: ReferralActionType) => {
    switch (actionType) {
      case ReferralActionType.PROFILE_COMPLETION:
        return 'Completar perfil al 80%';
      case ReferralActionType.SCAN_QR:
        return 'Escanear QR en local';
      case ReferralActionType.VOTE:
        return 'Realizar voto o geovoto';
      case ReferralActionType.MATCH:
        return 'Hacer match';
      case ReferralActionType.UPLOAD_SESSION:
        return 'Subir sesión (DJ)';
      default:
        return 'Acción desconocida';
    }
  };
  
  const getActionIcon = (actionType: ReferralActionType) => {
    switch (actionType) {
      case ReferralActionType.PROFILE_COMPLETION:
        return <Award size={14} className="text-indigo-400" />;
      case ReferralActionType.SCAN_QR:
        return <Target size={14} className="text-green-400" />;
      case ReferralActionType.VOTE:
        return <Zap size={14} className="text-yellow-400" />;
      case ReferralActionType.MATCH:
        return <Gift size={14} className="text-pink-400" />;
      case ReferralActionType.UPLOAD_SESSION:
        return <Rocket size={14} className="text-purple-400" />;
      default:
        return <Gift size={14} className="text-indigo-400" />;
    }
  };
  
  const getDaysRemaining = (createdAt: Date) => {
    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + REFERRAL_EXPIRATION_DAYS);
    
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (pendingReferrals.length === 0) {
    return null;
  }
  
  return (
    <div className="glass-card p-4 rounded-xl mb-6 relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <h3 className="font-medium mb-3 flex items-center">
          <Rocket size={18} className="mr-2 text-indigo-400" />
          Misiones de Reclutamiento
        </h3>
        
        <div className="space-y-4">
          {pendingReferrals.map((referral) => {
            const daysRemaining = getDaysRemaining(referral.createdAt);
            const isExpiringSoon = daysRemaining <= 2 && daysRemaining > 0;
            const isExpired = daysRemaining === 0;
            
            return (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border ${
                  isExpired ? 'bg-red-500/10 border-red-500/30' :
                  isExpiringSoon ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-gray-800/50 border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <img 
                      src={referral.referredAvatar} 
                      alt={referral.referredUsername}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="font-medium">@{referral.referredUsername}</span>
                  </div>
                  
                  <div className="flex items-center text-xs">
                    <Clock size={12} className={`mr-1 ${
                      isExpired ? 'text-red-400' :
                      isExpiringSoon ? 'text-yellow-400' :
                      'text-gray-400'
                    }`} />
                    <span className={
                      isExpired ? 'text-red-400' :
                      isExpiringSoon ? 'text-yellow-400' :
                      'text-gray-400'
                    }>
                      {isExpired ? 'Expirado' : `${daysRemaining} días restantes`}
                    </span>
                  </div>
                </div>
                
                {(isExpiringSoon || isExpired) && (
                  <div className="flex items-center text-xs mb-2">
                    <AlertTriangle size={12} className={`mr-1 ${isExpired ? 'text-red-400' : 'text-yellow-400'}`} />
                    <span className={isExpired ? 'text-red-400' : 'text-yellow-400'}>
                      {isExpired 
                        ? 'El período de recompensas ha expirado' 
                        : 'El período de recompensas está por expirar'}
                    </span>
                  </div>
                )}
                
                <div className="space-y-2 mt-2">
                  {referral.actions
                    .filter((action: any) => !action.completed)
                    .map((action: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                            {getActionIcon(action.type)}
                          </div>
                          <span>{getActionLabel(action.type)}</span>
                        </div>
                        
                        {!isExpired && (
                          <button
                            onClick={() => handleCompleteAction(referral.id, action.type)}
                            className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors"
                          >
                            Completar
                          </button>
                        )}
                      </div>
                    ))}
                  
                  {referral.actions.filter((action: any) => !action.completed).length === 0 && (
                    <div className="text-center text-sm text-green-400">
                      ¡Todas las acciones completadas!
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReferralActionTracker;