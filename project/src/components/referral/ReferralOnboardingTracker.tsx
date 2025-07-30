import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  UserPlus, 
  Star, 
  Gift, 
  Users, 
  MessageSquare, 
  Radio, 
  Clock, 
  Check, 
  Award, 
  Eye, 
  ThumbsUp, 
  MapPin, 
  Zap
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useReferralStore } from '../../stores/referralStore';
import { ReferralActionType, REFERRAL_ACTION_REWARDS, REFERRAL_EXPIRATION_DAYS } from '../../types/referral';

interface OnboardingMission {
  id: string;
  type: ReferralActionType | 'view_profiles' | 'comment' | 'crowdparty';
  title: string;
  description: string;
  icon: React.ReactNode;
  reward: number;
  completed: boolean;
  badgeCode: string;
  badgeLabel: string;
}

const ReferralOnboardingTracker: React.FC = () => {
  const { user } = useAuthStore();
  const { getReferralStats, completeReferralAction } = useReferralStore();
  const [missions, setMissions] = useState<OnboardingMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(7);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isReferredUser, setIsReferredUser] = useState(false);
  const [referralId, setReferralId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadOnboardingData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Check if user was referred
        const stats = await getReferralStats(user.id);
        
        // Find referrals where this user is the referred user
        const referrals = stats.referralDetails.filter(detail => 
          detail.status === 'pending' && detail.timeRemaining > 0
        );
        
        if (referrals.length > 0) {
          setIsReferredUser(true);
          setReferralId(referrals[0].id);
          setDaysRemaining(referrals[0].timeRemaining);
          
          // Map actions to missions
          const missionData: OnboardingMission[] = [
            {
              id: 'profile_completion',
              type: ReferralActionType.PROFILE_COMPLETION,
              title: 'DNA Upload',
              description: 'Completa tu perfil al 100% para sincronizar tu identidad genética con el sistema de la nave',
              icon: <UserPlus size={20} className="text-indigo-400" />,
              reward: REFERRAL_ACTION_REWARDS[ReferralActionType.PROFILE_COMPLETION],
              completed: referrals[0].actions.find(a => a.type === ReferralActionType.PROFILE_COMPLETION)?.completed || false,
              badgeCode: '🧬',
              badgeLabel: 'DNA Upload'
            },
            {
              id: 'view_profiles',
              type: 'view_profiles',
              title: 'First Scan',
              description: 'Explora 5 perfiles o sesiones para escanear tu entorno y detectar señales musicales',
              icon: <Eye size={20} className="text-blue-400" />,
              reward: 2,
              completed: false,
              badgeCode: '👁️',
              badgeLabel: 'First Scan'
            },
            {
              id: 'vote',
              type: ReferralActionType.VOTE,
              title: 'Pulse Check',
              description: 'Vota una sesión para enviar tu primer pulso de energía a un DJ',
              icon: <ThumbsUp size={20} className="text-green-400" />,
              reward: REFERRAL_ACTION_REWARDS[ReferralActionType.VOTE],
              completed: referrals[0].actions.find(a => a.type === ReferralActionType.VOTE)?.completed || false,
              badgeCode: '👍',
              badgeLabel: 'Pulse Check'
            },
            {
              id: 'scan_qr',
              type: ReferralActionType.SCAN_QR,
              title: 'Beacon Contact',
              description: 'Escanea un QR en un club para ser localizado por una lanzadera aliada',
              icon: <MapPin size={20} className="text-yellow-400" />,
              reward: REFERRAL_ACTION_REWARDS[ReferralActionType.SCAN_QR],
              completed: referrals[0].actions.find(a => a.type === ReferralActionType.SCAN_QR)?.completed || false,
              badgeCode: '🛰️',
              badgeLabel: 'Beacon Contact'
            },
            {
              id: 'match',
              type: ReferralActionType.MATCH,
              title: 'Crew Sync',
              description: 'Crea un match con otro aliado para sincronizar tu frecuencia emocional',
              icon: <Users size={20} className="text-purple-400" />,
              reward: REFERRAL_ACTION_REWARDS[ReferralActionType.MATCH],
              completed: referrals[0].actions.find(a => a.type === ReferralActionType.MATCH)?.completed || false,
              badgeCode: '💫',
              badgeLabel: 'Crew Sync'
            },
            {
              id: 'comment',
              type: 'comment',
              title: 'Signal Sent',
              description: 'Comenta una sesión o post para iniciar comunicación con la tripulación',
              icon: <MessageSquare size={20} className="text-orange-400" />,
              reward: 1,
              completed: false,
              badgeCode: '🗨️',
              badgeLabel: 'Signal Sent'
            },
            {
              id: 'crowdparty',
              type: 'crowdparty',
              title: 'Distress Signal',
              description: 'Accede a CrowdParty para recibir tu primera llamada de auxilio festivo',
              icon: <Radio size={20} className="text-red-400" />,
              reward: 3,
              completed: false,
              badgeCode: '🚨',
              badgeLabel: 'Distress Signal'
            }
          ];
          
          // Add upload session mission for DJs
          if (user.userType === 'dj') {
            missionData.push({
              id: 'upload_session',
              type: ReferralActionType.UPLOAD_SESSION,
              title: 'Cosmic Transmission',
              description: 'Sube tu primera sesión para transmitir tus ondas sonoras al cosmos',
              icon: <Zap size={20} className="text-cyan-400" />,
              reward: REFERRAL_ACTION_REWARDS[ReferralActionType.UPLOAD_SESSION],
              completed: referrals[0].actions.find(a => a.type === ReferralActionType.UPLOAD_SESSION)?.completed || false,
              badgeCode: '⚡',
              badgeLabel: 'Cosmic Transmission'
            });
          }
          
          setMissions(missionData);
          
          // Calculate completion percentage
          const completedMissions = missionData.filter(mission => mission.completed).length;
          setCompletionPercentage(Math.round((completedMissions / missionData.length) * 100));
        }
      } catch (error) {
        console.error('Failed to load onboarding data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOnboardingData();
  }, [user, getReferralStats]);
  
  const handleCompleteMission = async (missionId: string) => {
    if (!referralId) return;
    
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;
    
    // Only handle ReferralActionType missions through the store
    if (Object.values(ReferralActionType).includes(mission.type as ReferralActionType)) {
      try {
        await completeReferralAction(referralId, mission.type as ReferralActionType);
        
        // Update missions
        setMissions(prev => prev.map(m => 
          m.id === missionId ? { ...m, completed: true } : m
        ));
        
        // Update completion percentage
        const updatedMissions = missions.map(m => 
          m.id === missionId ? { ...m, completed: true } : m
        );
        const completedCount = updatedMissions.filter(m => m.completed).length;
        setCompletionPercentage(Math.round((completedCount / updatedMissions.length) * 100));
      } catch (error) {
        console.error('Failed to complete mission:', error);
      }
    } else {
      // For non-ReferralActionType missions, just update the UI
      // In a real app, these would be tracked and completed through other means
      setMissions(prev => prev.map(m => 
        m.id === missionId ? { ...m, completed: true } : m
      ));
      
      // Update completion percentage
      const updatedMissions = missions.map(m => 
        m.id === missionId ? { ...m, completed: true } : m
      );
      const completedCount = updatedMissions.filter(m => m.completed).length;
      setCompletionPercentage(Math.round((completedCount / updatedMissions.length) * 100));
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!isReferredUser || missions.length === 0) {
    return null;
  }
  
  return (
    <div className="glass-card p-6 rounded-xl mb-6 relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
              <Rocket size={20} className="text-indigo-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold">Pase de Desembarco Galáctico</h2>
              <div className="flex items-center text-sm text-gray-400">
                <Clock size={14} className="mr-1" />
                <span>{daysRemaining} días restantes para completar misiones</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold">{completionPercentage}%</div>
            <div className="text-sm text-gray-400">Completado</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Special Bonus */}
        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-lg border border-yellow-500/30 mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10"></div>
              <Award size={20} className="text-yellow-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <div>
              <h3 className="font-medium">Bonus por completar todas las misiones</h3>
              <p className="text-sm text-gray-300">Completa todas las misiones en 7 días para recibir la insignia <span className="text-yellow-400 font-medium">🌟 Starborn Cadet</span> y +10 beatcoins extra</p>
            </div>
          </div>
        </div>
        
        {/* Missions */}
        <div className="space-y-4">
          {missions.map((mission) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg relative overflow-hidden ${
                mission.completed 
                  ? 'border border-green-500/30' 
                  : 'border border-gray-700'
              }`}
            >
              {/* Background effect */}
              {mission.completed ? (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10"></div>
              ) : (
                <div className="absolute inset-0 bg-gray-800/50"></div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                    <div className="relative z-10">
                      {mission.icon}
                    </div>
                    {!mission.completed && (
                      <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{mission.badgeCode} {mission.title}</span>
                      {mission.completed && (
                        <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                          Completado
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{mission.description}</p>
                  </div>
                  
                  <div className="ml-3 text-right">
                    <div className="text-green-400 font-medium">+{mission.reward} BC</div>
                    <div className="text-xs text-gray-400">Recompensa dual</div>
                  </div>
                </div>
                
                {!mission.completed && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleCompleteMission(mission.id)}
                      className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded text-sm hover:bg-indigo-500/30 transition-colors"
                    >
                      Completar Misión
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* All Completed */}
        {completionPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/30 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10"></div>
              <Award size={32} className="text-green-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <h3 className="text-lg font-bold mb-1">¡Todas las misiones completadas!</h3>
            <p className="text-gray-300 mb-3">Has desbloqueado la insignia <span className="text-yellow-400 font-medium">🌟 Starborn Cadet</span></p>
            <div className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
              +10 Beatcoins Extra
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReferralOnboardingTracker;