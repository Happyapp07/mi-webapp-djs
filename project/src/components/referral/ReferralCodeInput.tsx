import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Check, X, AlertTriangle, Gift, Rocket } from 'lucide-react';
import { useReferralStore } from '../../stores/referralStore';
import { ReferralActionType, REFERRAL_ACTION_REWARDS } from '../../types/referral';

interface ReferralCodeInputProps {
  onSuccess?: () => void;
}

const ReferralCodeInput: React.FC<ReferralCodeInputProps> = ({ onSuccess }) => {
  const { applyReferralCode, isLoading, error } = useReferralStore();
  const [code, setCode] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) return;
    
    try {
      await applyReferralCode(code);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to apply referral code:', error);
    }
  };
  
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/30 relative overflow-hidden"
      >
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="scanner-effect"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
              <Rocket size={18} className="text-green-400" />
            </div>
            <h3 className="font-medium text-green-400">¡Has sido reclutado por un tripulante de élite!</h3>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">Completa estas misiones en los próximos 7 días para que ambos recibáis recompensas cósmicas:</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
              <span>Completar perfil al 80%</span>
              <span className="text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.PROFILE_COMPLETION]} BC</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
              <span>Escanear QR en local</span>
              <span className="text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.SCAN_QR]} BC</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
              <span>Realizar voto o geovoto</span>
              <span className="text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.VOTE]} BC</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
              <span>Hacer match</span>
              <span className="text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.MATCH]} BC</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
              <span>Subir sesión (solo DJs)</span>
              <span className="text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.UPLOAD_SESSION]} BC</span>
            </div>
          </div>
          
          <div className="flex items-center mt-3 text-sm text-gray-400">
            <Gift size={14} className="mr-1" />
            <span>¡Tanto tú como quien te invitó recibiréis estas recompensas!</span>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="glass-card p-4 rounded-lg relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <h3 className="font-medium mb-3 flex items-center">
          <UserPlus size={18} className="mr-2 text-indigo-400" />
          ¿Tienes un código de invitación?
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Introduce el código"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            
            {error && (
              <div className="mt-2 flex items-center text-red-500 text-sm">
                <AlertTriangle size={14} className="mr-1" />
                {error}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full glassmorphism-primary-button px-4 py-2.5 flex items-center justify-center"
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Verificando...
              </span>
            ) : (
              <>
                <Rocket size={16} className="mr-2" />
                Unirse a la Tripulación
              </>
            )}
          </button>
          
          <div className="text-xs text-gray-400 text-center">
            <Gift size={12} className="inline mr-1" />
            Ambos recibiréis recompensas cuando completes acciones clave
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralCodeInput;