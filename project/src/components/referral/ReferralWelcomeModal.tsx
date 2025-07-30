import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Gift, Star, X, Check, UserPlus, Eye, ThumbsUp, MapPin, Users, MessageSquare, Radio, Zap } from 'lucide-react';
import { useReferralStore } from '../../stores/referralStore';
import { useAuthStore } from '../../stores/authStore';
import { ReferralActionType, REFERRAL_ACTION_REWARDS, REFERRAL_EXPIRATION_DAYS } from '../../types/referral';

interface ReferralWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

const ReferralWelcomeModal: React.FC<ReferralWelcomeModalProps> = ({
  isOpen,
  onClose,
  referralCode
}) => {
  const { user } = useAuthStore();
  const { applyReferralCode, isLoading, error } = useReferralStore();
  const [step, setStep] = useState(1);
  const [code, setCode] = useState(referralCode || '');
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (referralCode) {
      setCode(referralCode);
    }
  }, [referralCode]);
  
  const handleApplyCode = async () => {
    if (!code.trim()) return;
    
    try {
      await applyReferralCode(code);
      setSuccess(true);
      setStep(2);
      setShowConfetti(true);
      
      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to apply referral code:', error);
    }
  };
  
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
          className="glass-card p-6 rounded-xl max-w-md w-full relative overflow-hidden"
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
            {step === 1 ? (
              <>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                    <Rocket size={24} className="text-indigo-400 relative z-10" />
                    <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">¡Bienvenido a CosmicBeats!</h2>
                    <p className="text-gray-400 text-sm">¿Alguien te ha invitado a unirte?</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código de Invitación (opcional)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Introduce el código de invitación"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  
                  {error && (
                    <div className="mt-2 text-red-500 text-sm flex items-center">
                      <X size={14} className="mr-1" />
                      {error}
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30 mb-6">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Gift size={16} className="mr-2 text-indigo-400" />
                    Beneficios de Unirse con Código
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <Check size={14} className="text-green-500 mr-2 mt-0.5" />
                      <span>Recompensas de Beatcoins para ambos</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="text-green-500 mr-2 mt-0.5" />
                      <span>Desbloqueo de misiones especiales</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="text-green-500 mr-2 mt-0.5" />
                      <span>Acceso a insignias exclusivas</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Continuar sin código
                  </button>
                  <button
                    onClick={handleApplyCode}
                    disabled={isLoading || !code.trim()}
                    className="flex-1 glassmorphism-primary-button px-4 py-2 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <Rocket size={16} className="mr-2" />
                        Aplicar Código
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10"></div>
                    <Rocket size={32} className="text-green-400 relative z-10" />
                    <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">¡Has sido reclutado por un tripulante de élite!</h2>
                  <p className="text-gray-300">Completa estas misiones en los próximos {REFERRAL_EXPIRATION_DAYS} días para que ambos recibáis recompensas cósmicas</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                        <UserPlus size={16} className="text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-medium">🧬 DNA Upload</div>
                        <div className="text-xs text-gray-400">Completa tu perfil al 100%</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-medium">
                      +{REFERRAL_ACTION_REWARDS[ReferralActionType.PROFILE_COMPLETION]} BC
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <Eye size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">👁️ First Scan</div>
                        <div className="text-xs text-gray-400">Explora 5 perfiles o sesiones</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-medium">
                      +2 BC
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                        <ThumbsUp size={16} className="text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">👍 Pulse Check</div>
                        <div className="text-xs text-gray-400">Vota una sesión</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-medium">
                      +{REFERRAL_ACTION_REWARDS[ReferralActionType.VOTE]} BC
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                        <MapPin size={16} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-medium">🛰️ Beacon Contact</div>
                        <div className="text-xs text-gray-400">Escanea un QR en un club</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-medium">
                      +{REFERRAL_ACTION_REWARDS[ReferralActionType.SCAN_QR]} BC
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-lg border border-yellow-500/30 mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10"></div>
                      <Star size={20} className="text-yellow-400 relative z-10" />
                      <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">Bonus por completar todas las misiones</h3>
                      <p className="text-sm text-gray-300">Completa todas las misiones en 7 días para recibir la insignia <span className="text-yellow-400 font-medium">🌟 Starborn Cadet</span> y +10 beatcoins extra</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="w-full glassmorphism-primary-button px-4 py-2 flex items-center justify-center"
                >
                  <Rocket size={16} className="mr-2" />
                  ¡Comenzar mi viaje cósmico!
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReferralWelcomeModal;