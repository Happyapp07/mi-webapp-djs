import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, CheckCircle, AlertCircle, Users, Radio, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Confetti from 'react-confetti';
import useMeasure from 'react-use-measure';
import AllianceQRScanner from '../components/alliance/AllianceQRScanner';
import AlliancesList from '../components/alliance/AlliancesList';

const ScanQrPage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [showScanner, setShowScanner] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [beatcoinsEarned, setBeatcoinsEarned] = useState(0);
  const [error, setError] = useState('');
  const [ref, bounds] = useMeasure();
  const [activeTab, setActiveTab] = useState<'club' | 'alliance'>('club');
  
  // Mock QR scanning for club check-in
  const handleStartScan = () => {
    setShowScanner(true);
    
    // Simulate scanning process
    setTimeout(() => {
      // Mock successful scan
      setShowScanner(false);
      setShowSuccess(true);
      
      // Random beatcoins between 10 and 50
      const coins = Math.floor(Math.random() * 41) + 10;
      setBeatcoinsEarned(coins);
      setSuccessMessage('¡Código de restauración verificado!');
      
      // Update user's beatcoins (if we have a user)
      if (user) {
        updateProfile({
          beatcoins: user.beatcoins + coins
        });
      }
      
      // Reset after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 3000);
  };
  
  // Mock manual code entry for club check-in
  const [manualCode, setManualCode] = useState('');
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (manualCode.trim() === '') {
      setError('Please enter a code');
      return;
    }
    
    // Simulate verification
    setError('');
    setShowSuccess(true);
    
    // Random beatcoins between 10 and 50
    const coins = Math.floor(Math.random() * 41) + 10;
    setBeatcoinsEarned(coins);
    setSuccessMessage('Code verified successfully!');
    
    // Update user's beatcoins (if we have a user)
    if (user) {
      updateProfile({
        beatcoins: user.beatcoins + coins
      });
    }
    
    // Reset after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setManualCode('');
    }, 5000);
  };
  
  // Handle alliance scan success
  const handleAllianceSuccess = (allianceId: string) => {
    console.log('Alliance created/updated:', allianceId);
  };
  
  // Handle alliance scan error
  const handleAllianceError = (error: string) => {
    setError(error);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setError('');
    }, 3000);
  };
  
  return (
    <div className="container mx-auto max-w-md" ref={ref}>
      {/* Success overlay with confetti */}
      {showSuccess && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Confetti
            width={bounds.width}
            height={bounds.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.15}
          />
          
          <motion.div 
            className="glass-card p-8 rounded-xl text-center max-w-sm mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            
            <h2 className="text-xl font-bold mb-2">{successMessage}</h2>
            <p className="text-gray-300 mb-6">¡Has ganado {beatcoinsEarned} BeatCoins por combatir el Silencio!</p>
            
            <button 
              onClick={() => setShowSuccess(false)}
              className="btn btn-primary w-full"
            >
              ¡Excelente!
            </button>
          </motion.div>
        </motion.div>
      )}
      
      <h1 className="text-2xl font-display text-center mb-6">Scan QR Code</h1>
      
      {/* Tabs */}
      <div className="flex mb-6 bg-gray-800/50 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('club')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'club' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Restaurar Outpost
        </button>
        <button
          onClick={() => setActiveTab('alliance')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'alliance' 
              ? 'bg-indigo-500 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Alianzas Cósmicas
        </button>
      </div>
      
      {activeTab === 'club' ? (
        <>
          <div className="glass-card p-6 rounded-lg mb-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-900/30 flex items-center justify-center mx-auto mb-3">
                <QrCode size={28} className="text-indigo-400" />
              </div>
              <p className="text-gray-300">
                Scan a club's QR code to check in and earn BeatCoins
              </p>
            </div>
            
            {showScanner ? (
              <div className="relative">
                <div className="aspect-square bg-black rounded-lg overflow-hidden mb-4">
                  {/* Mock camera viewport */}
                  <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <div className="animate-pulse text-gray-500">
                      <Camera size={48} />
                    </div>
                  </div>
                  
                  {/* Scanner animation */}
                  <div className="absolute inset-0">
                    <motion.div 
                      className="h-0.5 w-full bg-indigo-500"
                      initial={{ top: 0 }}
                      animate={{ top: '100%' }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: 'reverse' 
                      }}
                    ></motion.div>
                  </div>
                  
                  {/* Corner markers */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-500"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-indigo-500"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-indigo-500"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500"></div>
                </div>
                
                <button 
                  onClick={() => setShowScanner(false)}
                  className="w-full btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={handleStartScan}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                <Camera size={18} className="mr-2" />
                Start Scan
              </button>
            )}
            
            <div className="text-center mt-4">
              <div className="w-16 h-16 rounded-full bg-indigo-900/30 flex items-center justify-center mx-auto mb-3">
                <Radio size={28} className="text-indigo-400" />
              </div>
              <p className="text-gray-300 text-sm">
                Scan the QR code of an outpost to restore its frequencies and earn BeatCoins
              </p>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Enter Restoration Code</h3>
            
            <form onSubmit={handleManualSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Outpost Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter the outpost code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
                
                {error && (
                  <div className="mt-2 flex items-center text-red-500 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {error}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full btn btn-secondary"
              >
                Verify Code
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <AllianceQRScanner 
            onSuccess={handleAllianceSuccess}
            onError={handleAllianceError}
          />
          
          <div className="mt-6">
            <AlliancesList maxDisplay={3} />
          </div>
        </>
      )}
    </div>
  );
};

export default ScanQrPage;