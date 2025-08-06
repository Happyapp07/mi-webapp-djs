import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, AlertTriangle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildRedirectionState, getRedirectionPath } from '../../utils/redirectionUtils';
import ReferralCodeInput from '../referral/ReferralCodeInput';
import { UserType } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  userType?: UserType;
  redirectToProfile?: boolean;
  planId?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  userType,
  redirectToProfile,
  planId
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate authentication
    setTimeout(() => {
      // For demo purposes, always succeed
      setIsLoading(false);
      setSuccess(mode === 'login' ? 'Login successful!' : 'Registration successful!');
      
      // Store mock user data in localStorage
      const mockUser = {
        id: `user_${Date.now()}`,
        userId: `user_${Date.now()}`,
        email,
        username: username || email.split('@')[0],
        userType: userType || UserType.PARTYGOER,
        level: 1,
        beatcoins: 100,
        createdAt: new Date(),
        isAuthenticated: true
      };
      
      localStorage.setItem('cosmic_user', JSON.stringify(mockUser));
      
      // Redirect after a short delay
      setTimeout(() => {
        // Build redirection state
        const redirectState = buildRedirectionState(
          mockUser.userType as UserType,
          planId,
          {
            userId: mockUser.id,
            redirectToProfile: true // Always redirect to profile after login
          }
        );
        
        // Get the appropriate redirection path
        const redirectPath = getRedirectionPath(redirectState);
        
        // Navigate to the appropriate path
        navigate(redirectPath, {
          state: redirectState
        });
      }, 1000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card p-6 rounded-xl max-w-md w-full relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
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
            <h2 className="text-2xl font-display text-center mb-6 neon-text">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start"
              >
                <AlertTriangle size={18} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-400">{error}</span>
              </motion.div>
            )}
            
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
              >
                <span className="text-sm text-green-400">{success}</span>
              </motion.div>
            )}
            
            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your username"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {mode === 'register' && !showReferralInput && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowReferralInput(true)}
                    className="text-indigo-400 hover:text-indigo-300 text-sm"
                  >
                    ¿Tienes un código de invitación?
                  </button>
                </div>
              )}
              
              {mode === 'register' && showReferralInput && (
                <ReferralCodeInput />
              )}
              
              <button
                type="submit"
                className="w-full glassmorphism-primary-button px-4 py-2 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span>{mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</span>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                {mode === 'login'
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia Sesión'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
