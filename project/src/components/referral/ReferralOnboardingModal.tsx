import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Award, Star, X, Gift, UserPlus, Eye, ThumbsUp, MapPin, Users, MessageSquare, Radio, Zap, Check } from 'lucide-react';
import Confetti from 'react-confetti';
import useMeasure from 'react-use-measure';
import { ReferralActionType, REFERRAL_ACTION_REWARDS } from '../../types/referral';

interface ReferralOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedMissions: string[];
  onCompleteMission: (missionId: string) => void;
}

const ReferralOnboardingModal: React.FC<ReferralOnboardingModalProps> = ({
  isOpen,
  onClose,
  completedMissions,
  onCompleteMission
}) => {
  const [ref, bounds] = useMeasure();
  const [activeTab, setActiveTab] = useState<'missions' | 'badges'>('missions');
  
  const missions = [
    {
      id: 'profile_completion',
      type: ReferralActionType.PROFILE_COMPLETION,
      title: 'DNA Upload',
      description: 'Completa tu perfil al 100% para sincronizar tu identidad genética con el sistema de la nave',
      icon: <UserPlus size={20} className="text-indigo-400" />,
      reward: REFERRAL_ACTION_REWARDS[ReferralActionType.PROFILE_COMPLETION],
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
      badgeCode: '🚨',
      badgeLabel: 'Distress Signal'
    },
    {
      id: 'upload_session',
      type: ReferralActionType.UPLOAD_SESSION,
      title: 'Cosmic Transmission',
      description: 'Sube tu primera sesión para transmitir tus ondas sonoras al cosmos',
      icon: <Zap size={20} className="text-cyan-400" />,
      reward: REFERRAL_ACTION_REWARDS[ReferralActionType.UPLOAD_SESSION],
      badgeCode: '⚡',
      badgeLabel: 'Cosmic Transmission'
    }
  ];
  
  const allCompleted = missions.every(mission => completedMissions.includes(mission.id));
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" ref={ref}>
      {allCompleted && (
        <Confetti
          width={bounds.width}
          height={bounds.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          colors={['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ffffff']}
        />
      )}
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
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
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                <Rocket size={24} className="text-indigo-400 relative z-10" />
                <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pase de Desembarco Galáctico</h2>
                <p className="text-gray-400">Completa misiones para desbloquear insignias y recompensas</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Progreso de Onboarding</span>
                <span>{Math.round((completedMissions.length / missions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedMissions.length / missions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-800 mb-6">
              <button
                className={`pb-2 px-4 font-medium ${
                  activeTab === 'missions' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('missions')}
              >
                Misiones
              </button>
              <button
                className={`pb-2 px-4 font-medium ${
                  activeTab === 'badges' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('badges')}
              >
                Insignias
              </button>
            </div>
            
            {activeTab === 'missions' ? (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {missions.map((mission) => {
                  const isCompleted = completedMissions.includes(mission.id);
                  
                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg relative overflow-hidden ${
                        isCompleted 
                          ? 'border border-green-500/30' 
                          : 'border border-gray-700'
                      }`}
                    >
                      {/* Background effect */}
                      {isCompleted ? (
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
                            {!isCompleted && (
                              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium mr-2">{mission.badgeCode} {mission.title}</span>
                              {isCompleted && (
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
                        
                        {!isCompleted && (
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => onCompleteMission(mission.id)}
                              className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded text-sm hover:bg-indigo-500/30 transition-colors"
                            >
                              Completar Misión
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
                {missions.map((mission) => {
                  const isEarned = completedMissions.includes(mission.id);
                  
                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-lg relative overflow-hidden ${
                        isEarned 
                          ? 'border border-green-500/30' 
                          : 'border border-gray-700'
                      }`}
                    >
                      {/* Background effect */}
                      {isEarned ? (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10"></div>
                      ) : (
                        <div className="absolute inset-0 bg-gray-800/50"></div>
                      )}
                      
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-3 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                          <div className="text-3xl relative z-10">{mission.badgeCode}</div>
                          {!isEarned && (
                            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                          )}
                        </div>
                        
                        <h3 className="font-medium mb-1">{mission.badgeLabel}</h3>
                        
                        {isEarned ? (
                          <div className="flex items-center text-green-400 text-sm">
                            <Check size={14} className="mr-1" />
                            <span>Desbloqueado</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">Por desbloquear</div>
                        )}
                        
                        <div className="mt-2 px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs">
                          +{mission.reward} BC
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* Starborn Cadet Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-lg relative overflow-hidden col-span-2 ${
                    allCompleted 
                      ? 'border border-yellow-500/30' 
                      : 'border border-gray-700'
                  }`}
                >
                  {/* Background effect */}
                  {allCompleted ? (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10"></div>
                  ) : (
                    <div className="absolute inset-0 bg-gray-800/50"></div>
                  )}
                  
                  <div className="relative z-10 flex items-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10"></div>
                      <div className="text-3xl relative z-10">🌟</div>
                      {!allCompleted && (
                        <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg">Starborn Cadet</h3>
                      <p className="text-sm text-gray-300 mb-2">Completa todas las misiones en 7 días para desbloquear esta insignia especial</p>
                      
                      <div className="flex items-center">
                        <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs mr-2">
                          +10 Beatcoins
                        </div>
                        <div className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs">
                          Pack Aleatorio
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            
            {/* All Completed */}
            {allCompleted && (
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
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="glassmorphism-primary-button px-6 py-2.5"
              >
                Continuar
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ReferralOnboardingModal;