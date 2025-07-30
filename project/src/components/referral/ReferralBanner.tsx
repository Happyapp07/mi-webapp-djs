import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, X, ChevronRight, FileText, Gift, Rocket, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReferralStore } from '../../stores/referralStore';
import { useAuthStore } from '../../stores/authStore';

interface ReferralBannerProps {
  onClose: () => void;
}

const ReferralBanner: React.FC<ReferralBannerProps> = ({ onClose }) => {
  const { user } = useAuthStore();
  const { getUserReferralCode } = useReferralStore();
  const [referralCode, setReferralCode] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(30);
  
  useEffect(() => {
    const loadReferralCode = async () => {
      if (user) {
        try {
          const code = await getUserReferralCode();
          setReferralCode(code);
        } catch (error) {
          console.error('Failed to load referral code:', error);
        }
      }
    };
    
    loadReferralCode();
  }, [user, getUserReferralCode]);
  
  // Auto-hide banner after inactivity
  useEffect(() => {
    if (!isVisible) return;
    
    // Set timer to hide banner after 30 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      
      // Show banner again after 2 minutes
      setTimeout(() => {
        setIsVisible(true);
        setTimeRemaining(30);
      }, 120000); // 2 minutes
    }, 30000); // 30 seconds
    
    // Update countdown timer every second
    const countdownTimer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => {
      clearTimeout(hideTimer);
      clearInterval(countdownTimer);
    };
  }, [isVisible]);
  
  // Reset timer on user interaction
  const handleUserInteraction = () => {
    setTimeRemaining(30);
  };
  
  if (!isVisible) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-0 left-0 right-0 z-40 p-4" 
      onMouseMove={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onKeyDown={handleUserInteraction}
    >
      <div className="max-w-4xl mx-auto glass-card p-4 rounded-xl border border-indigo-500/30 relative overflow-hidden">
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="scanner-effect"></div>
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
              <UserPlus size={20} className="text-indigo-400 relative z-10" /> 
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <div>
              <h3 className="font-medium">¡Invita a tus amigos y gana recompensas!</h3>
              <p className="text-sm text-gray-400">Tu código: <span className="font-mono text-indigo-400">{referralCode}</span></p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="flex items-center text-sm text-indigo-400">
              <div className="flex items-center">
                <Gift size={16} className="mr-1" />
                <span>Recompensa dual: ¡Ambos ganan Beatcoins!</span>
              </div>
              <div className="ml-3 flex items-center text-xs text-gray-400">
                <Clock size={12} className="mr-1" />
                <span>Cerrando en {timeRemaining}s</span>
              </div>
            </div>
            
            <Link to="/referral-policy" className="text-xs text-indigo-400 hover:text-indigo-300">
              <FileText size={12} className="inline mr-1" />
              Política de referidos
            </Link>
            
            <button
              onClick={() => window.location.href = '/profile/referrals'}
              className="btn btn-primary flex items-center"
            >
              <Rocket size={16} className="mr-1" />
              Ver Programa de Referidos
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralBanner;