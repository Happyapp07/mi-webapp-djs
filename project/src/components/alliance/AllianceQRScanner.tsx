import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, CheckCircle, AlertCircle, Users, Rocket, Zap, Radio, Shield } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAllianceStore } from '../../stores/allianceStore';
import Confetti from 'react-confetti';
import useMeasure from 'react-use-measure';

interface AllianceQRScannerProps {
  onSuccess?: (allianceId: string) => void;
  onError?: (error: string) => void;
}

const AllianceQRScanner: React.FC<AllianceQRScannerProps> = ({ onSuccess, onError }) => {
  const { user } = useAuthStore();
  const { createAlliance, checkAlliance } = useAllianceStore();
  const [showScanner, setShowScanner] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [ref, bounds] = useMeasure();
  const [scannedUserId, setScannedUserId] = useState<string | null>(null);
  
  // Mock QR scanning
  const handleStartScan = () => {
    setShowScanner(true);
    
    // Simulate scanning process
    setTimeout(() => {
      // Generate a random user ID for demo purposes
      const mockUserId = `user_${Math.floor(Math.random() * 1000)}`;
      handleQRCodeScanned(mockUserId);
    }, 3000);
  };
  
  const handleQRCodeScanned = async (userId: string) => {
    try {
      setScannedUserId(userId);
      
      // Check if user is trying to scan their own QR code
      if (user?.id === userId) {
        throw new Error('No puedes formar una alianza contigo mismo');
      }
      
      // Check if alliance already exists
      const existingAlliance = checkAlliance(user?.id || '', userId);
      
      if (existingAlliance) {
        setSuccessMessage('¡Alianza fortalecida! Habéis registrado un nuevo encuentro contra el Silencio Cósmico.');
      } else {
        // Create new alliance
        const alliance = await createAlliance(user?.id || '', userId);
        
        setSuccessMessage('¡Nueva alianza formada! Unidos contra el Silencio Cósmico, ahora podéis restaurar planetas juntos.');
        
        if (onSuccess) {
          onSuccess(alliance.id);
        }
      }
      
      setShowScanner(false);
      setShowSuccess(true);
      
      // Reset after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setScannedUserId(null);
      }, 5000);
    } catch (error) {
      setShowScanner(false);
      setError(error instanceof Error ? error.message : 'Error al escanear el código QR');
      
      if (onError) {
        onError(error instanceof Error ? error.message : 'Error al escanear el código QR');
      }
      
      // Reset after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  // Mock manual code entry
  const [manualCode, setManualCode] = useState('');
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (manualCode.trim() === '') {
      setError('Por favor, introduce un código');
      return;
    }
    
    // Simulate verification
    handleQRCodeScanned(manualCode);
    setManualCode('');
  };
  
  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden" ref={ref}>
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      {/* Success overlay with confetti */}
      {showSuccess && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
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
            className="glass-card p-8 rounded-xl text-center max-w-sm mx-4 relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className="hologram-grid absolute inset-0 opacity-20"></div>
            <div className="scanner-effect"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10"></div>
                <Users size={32} className="text-green-500 relative z-10" />
                <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
              </div>
              
              <h2 className="text-xl font-bold mb-2">{successMessage}</h2>
              
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30 mr-2">
                  <img 
                    src={user?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id}`} 
                    alt="Your avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <Radio size={24} className="mx-2 text-indigo-400" />
                
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30 ml-2">
                  <img 
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${scannedUserId}`}
                    alt="Ally avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
                Ahora podéis formar una tripulación y restaurar planetas musicales juntos para combatir el Silencio Cósmico.
              <p className="text-gray-300 mb-6">Ahora podéis formar un crew y completar misiones juntos para ganar recompensas exclusivas.</p>
              
              <button 
                onClick={() => setShowSuccess(false)}
                className="glassmorphism-primary-button px-6 py-2.5"
              >
                ¡Genial!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            <Users size={24} className="text-indigo-400 relative z-10" />
            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Escanear Alianza</h2>
            <p className="text-gray-300">Escanea el código QR de otro tripulante para formar una alianza contra el Silencio Cósmico</p>
          </div>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center"
          >
            <AlertCircle size={20} className="text-red-500 mr-3" />
            <span className="text-red-400">{error}</span>
          </motion.div>
        )}
        
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
              className="w-full glassmorphism-button px-4 py-2.5"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={handleStartScan}
              className="w-full glassmorphism-primary-button px-4 py-2.5 flex items-center justify-center"
            >
              <Camera size={18} className="mr-2" />
              Escanear QR de Tripulante
            </button>
            
            <div className="text-center text-sm text-gray-400">- transmisión alternativa -</div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Introducir Código de Tripulante</h3>
              
              <form onSubmit={handleManualSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Código de usuario"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="glassmorphism-button px-4 py-2"
                >
                  Verificar
                </button>
              </form>
            </div>
            
            <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
              <h3 className="font-medium mb-2 flex items-center">
                <Shield size={16} className="mr-2 text-indigo-400" />
                Beneficios de las Alianzas Cósmicas
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <CheckCircle size={14} className="text-green-500 mr-2 mt-1" />
                  <span>Acceso a misiones de restauración planetaria</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={14} className="text-green-500 mr-2 mt-1" />
                  <span>Bonus de beatcoins por combatir juntos el Silencio Cósmico</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={14} className="text-green-500 mr-2 mt-1" />
                  <span>Resonancia armónica mejorada con datos de ambos tripulantes</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllianceQRScanner;