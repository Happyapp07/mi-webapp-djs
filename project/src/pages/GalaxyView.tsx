import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGalaxyStore } from '../stores/galaxyStore';
import { useAuthStore } from '../stores/authStore';
import GalaxyCanvas from '../components/galaxy/GalaxyCanvas';

const GalaxyView: React.FC = () => {
  const navigate = useNavigate();
  const { galaxies, isLoading, error, fetchGalaxies, selectGalaxy, selectedGalaxy } = useGalaxyStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  
  useEffect(() => {
    fetchGalaxies();
  }, [fetchGalaxies]);
  
  const handleGalaxySelect = (galaxyId: string) => {
    selectGalaxy(galaxyId);
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 space-bg"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-display neon-text-pink mb-2">SCANNING GALAXIES</h3>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="text-cyan-400/70 font-mono text-xs mt-1">SCANNING COSMIC FREQUENCIES...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 space-bg"></div>
        <div className="glass-card p-8 rounded-xl border border-red-500/30 relative z-10">
          <div className="hologram-grid"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-display mb-4 neon-text">ACCESS RESTRICTED</h2>
            <p className="text-red-400/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen galaxy canvas */}
      <div className="fixed inset-0">
        <GalaxyCanvas 
          galaxies={selectedGalaxy ? [selectedGalaxy] : galaxies} 
          onSelectGalaxy={handleGalaxySelect} 
        />
      </div>
      
      {/* HUD Overlay */}
      <div className="fixed top-20 left-0 right-0 z-20 pointer-events-none flex justify-center">
        <div className="flex justify-between items-start max-w-5xl w-full px-6">
          <motion.div 
            className="glass-card p-4 rounded-xl border border-cyan-500/30 pointer-events-auto ml-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hologram-grid"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-display neon-text mb-2">GALAXY MAP</h3>
              <div className="space-y-1 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">Systems:</span>
                  <span className="text-cyan-400">{galaxies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">Status:</span>
                  <span className="text-green-400">ONLINE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400/70">Sync:</span>
                  <span className="text-purple-400">REAL-TIME</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-card p-4 rounded-xl border border-purple-500/30 pointer-events-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="hologram-grid"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-display neon-text-pink mb-2">NAVIGATION</h3>
              <div className="text-sm font-mono text-purple-400/70">
                Click on any galaxy to explore
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Auth prompt overlay */}
      {showAuthPrompt && (
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="glass-card p-8 rounded-xl max-w-md w-full text-center border border-cyan-500/30 relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="hologram-grid"></div>
            <div className="scanner-effect"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-display mb-4 neon-text">ACCESS REQUIRED</h2>
              <p className="text-cyan-400/70 mb-6 font-mono">
                Initialize pilot credentials to explore {selectedGalaxy?.name || 'the galaxy'} and connect with cosmic frequencies across the universe.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="w-full btn btn-primary"
                >
                  INITIALIZE PILOT
                </button>
                <button 
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full btn btn-secondary"
                >
                  CONTINUE SCANNING
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GalaxyView;