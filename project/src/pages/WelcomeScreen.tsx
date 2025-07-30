import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, ArrowRight, HeartHandshake as Handshake, User, MapPin, Rocket } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import AuthModal from '../components/auth/AuthModal';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/galaxy');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background elements - static with slow animation */}
      <div className="absolute inset-0 bg-space-900 bg-cover bg-no-repeat bg-center">
        {/* Slow moving stars background */}
        <div className="absolute inset-0 stars-background"></div>
        
        {/* Shooting stars */}
        <div className="absolute inset-0 shooting-stars"></div>
      </div>
      
      {/* Static sparkles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
      
      <div className="max-w-md w-full z-10 glass-card p-8 rounded-2xl">
        <motion.div 
          className="mb-8 flex items-center justify-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glassmorphism headphones icon */}
          <div className="w-14 h-14 mr-3 relative rounded-xl overflow-hidden
                        backdrop-blur-md border border-cyan-500/30
                        bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                        shadow-[0_0_15px_rgba(0,255,255,0.3)]
                        flex items-center justify-center">
            <Headphones size={28} className="text-cyan-400 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
          </div>
          
          <h1 className="text-4xl font-display tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
            CosmicBeats
          </h1>
        </motion.div>
        
        <motion.p 
          className="text-center text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Explora el universo cósmico de la música, conéctate con DJs y descubre eventos en esta experiencia social de ciencia ficción.
        </motion.p>
        
        <motion.div 
          className="space-y-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={() => navigate('/register')}
            className="w-full btn btn-primary flex items-center justify-center"
          >
            <User size={18} className="mr-2" />
            Registrarse
            <ArrowRight size={16} className="ml-2" />
          </button>
          
          <button
            onClick={() => handleOpenAuth('login')}
            className="w-full btn btn-secondary flex items-center justify-center"
          >
            ¿Ya tienes cuenta? Iniciar Sesión
          </button>
        </motion.div>
        
        <motion.div 
          className="mt-12 grid grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Glassmorphism feature icons */}
          {[
            { icon: <Headphones size={20} className="text-cyan-400" />, text: "Pilots" },
            { icon: <MapPin size={20} className="text-cyan-400" />, text: "Attend Events" },
            { icon: <Handshake size={20} className="text-cyan-400" />, text: "Find Allies" }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-xl relative overflow-hidden
                              backdrop-blur-md border border-cyan-500/30
                              bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                              shadow-[0_0_15px_rgba(0,255,255,0.3)]
                              flex items-center justify-center">
                  <div className="relative z-10">{item.icon}</div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
                </div>
              </div>
              <p className="text-xs text-gray-400">{item.text}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authMode}
      />
    </motion.div>
  );
}