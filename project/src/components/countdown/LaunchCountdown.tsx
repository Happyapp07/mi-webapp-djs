import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Volume2, VolumeX, Calendar, Clock, Share2, UserPlus, Mail, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

interface LaunchCountdownProps {
  launchDate: Date;
  navigateToRegister: () => void;
  navigateToWelcome: () => void;
  onPreRegister?: (email: string, role: string) => void;
}

// Motivational phrases that will rotate
const MOTIVATIONAL_PHRASES = [
  "La misión está en marcha...",
  "Tripulación en formación…",
  "Los motores del beat se están calentando…",
  "Prepárate para abordar el viaje musical más grande del universo…",
  "Sincronizando frecuencias cósmicas...",
  "Calibrando sensores de ritmo...",
  "Cargando coordenadas de la galaxia musical...",
  "Activando escudos contra el silencio...",
  "Preparando salto hiperespacial a la dimensión del sonido...",
  "Reclutando pilotos para la misión contra el silencio..."
];

const LaunchCountdown: React.FC<LaunchCountdownProps> = ({ 
  launchDate,
  navigateToRegister,
  navigateToWelcome,
  onPreRegister 
}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [showPreRegister, setShowPreRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('pilot');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/ambient-space.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle sound toggle
  const toggleSound = () => {
    if (audioRef.current) {
      if (isSoundOn) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.log('Audio playback was prevented by browser policy. User interaction required.');
        });
      }
      setIsSoundOn(!isSoundOn);
    }
  };
  
  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }
      
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);
      
      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [launchDate]);
  
  // Rotate motivational phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % MOTIVATIONAL_PHRASES.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle pre-registration
  const handlePreRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onPreRegister) {
        onPreRegister(email, role);
      }
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setShowPreRegister(false);
        setEmail('');
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  // Handle social sharing
  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const text = `¡CosmicBeats despega en ${days} días! Únete a la revolución musical. #CosmicBeats #Countdown`;
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
  };
  
  // Generate random stars for background
  const generateStars = (count: number) => {
    return Array.from({ length: count }).map(() => {
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      const animationDuration = Math.random() * 3 + 2;
      const delay = Math.random() * 5;
      
      return (
        <motion.div
          key={nanoid()}
          className="absolute rounded-full bg-white"
          style={{
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity
          }}
          animate={{
            opacity: [opacity, opacity * 1.5, opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            delay
          }}
        />
      );
    });
  };
  
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#050314] via-[#0a0a2e] to-[#050314] px-4 py-12">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {generateStars(150)}
      </div>
      
      {/* Animated meteor */}
      <motion.div
        className="absolute w-[150px] h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        style={{ 
          top: '20%', 
          left: '-10%',
          transform: 'rotate(-45deg)',
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.8), 0 0 20px rgba(99, 102, 241, 0.5)'
        }}
        animate={{
          left: ['120%', '-10%'],
          top: ['10%', '60%']
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          delay: 3
        }}
      />
      
      {/* Animated meteor 2 */}
      <motion.div
        className="absolute w-[100px] h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        style={{ 
          top: '70%', 
          right: '-5%',
          transform: 'rotate(30deg)',
          boxShadow: '0 0 10px rgba(168, 85, 247, 0.8), 0 0 20px rgba(168, 85, 247, 0.5)'
        }}
        animate={{
          right: ['-5%', '110%'],
          top: ['70%', '30%']
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          delay: 1
        }}
      />
      
      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className="absolute top-4 right-4 p-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 hover:bg-gray-800/70 transition-colors z-10"
        aria-label={isSoundOn ? "Mute sound" : "Enable sound"}
      >
        {isSoundOn ? (
          <Volume2 size={20} className="text-indigo-400" />
        ) : (
          <VolumeX size={20} className="text-gray-400" />
        )}
      </button>
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
              <Rocket size={32} className="text-indigo-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400">
              COSMIC BEATS
            </h1>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-display text-white mb-2"
          >
            CUENTA ATRÁS PARA EL DESPEGUE
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center text-gray-400 mb-8"
          >
            <Calendar size={16} className="mr-1" />
            <span>Lanzamiento: {launchDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <Clock size={16} className="ml-3 mr-1" />
            <span>{launchDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
          </motion.div>
        </div>
        
        {/* Countdown timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'DÍAS', value: days },
            { label: 'HORAS', value: hours },
            { label: 'MINUTOS', value: minutes },
            { label: 'SEGUNDOS', value: seconds }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="glass-card p-6 rounded-xl border border-indigo-500/30 relative overflow-hidden"
            >
              <div className="hologram-grid absolute inset-0 opacity-20"></div>
              <div className="scanner-effect"></div>
              
              <div className="relative z-10 text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-indigo-400 font-mono tracking-wider">
                  {item.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Motivational phrase */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mb-12"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPhrase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-2xl text-indigo-300 font-display"
            >
              {MOTIVATIONAL_PHRASES[currentPhrase]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
        
        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12"
        >
          <button
            onClick={navigateToRegister}
            className="w-full md:w-auto glassmorphism-primary-button px-8 py-4 flex items-center justify-center"
          >
            <Rocket size={20} className="mr-2" />
            Quiero ser parte
          </button>
          
          <button
            onClick={() => setShowPreRegister(true)}
            className="w-full md:w-auto glassmorphism-button px-8 py-4 flex items-center justify-center"
          >
            <UserPlus size={20} className="mr-2" />
            Pre-registro
          </button>
        </motion.div>
        
        {/* Social sharing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex justify-center gap-4"
        >
          <button
            onClick={() => handleShare('twitter')}
            className="p-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 hover:bg-gray-800/70 transition-colors"
            aria-label="Share on X (Twitter)"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </button>
          
          <button
            onClick={() => handleShare('facebook')}
            className="p-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 hover:bg-gray-800/70 transition-colors"
            aria-label="Share on Facebook"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </button>
          
          <button
            onClick={() => handleShare('whatsapp')}
            className="p-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 hover:bg-gray-800/70 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </button>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('¡Enlace copiado al portapapeles!');
            }}
            className="p-3 rounded-full bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 hover:bg-gray-800/70 transition-colors"
            aria-label="Copy link"
          >
            <Share2 size={20} className="text-indigo-400" />
          </button>
        </motion.div>
      </motion.div>
      
      {/* Pre-registration modal */}
      <AnimatePresence>
        {showPreRegister && (
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
                onClick={() => setShowPreRegister(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <UserPlus size={24} className="mr-2 text-indigo-400" />
                  Pre-registro
                </h2>
                
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg mb-4"
                  >
                    <div className="flex items-center">
                      <Check size={20} className="text-green-500 mr-2" />
                      <div>
                        <h3 className="font-medium text-green-400">¡Pre-registro completado!</h3>
                        <p className="text-sm text-gray-300">Te notificaremos cuando la plataforma esté lista.</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handlePreRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="tu.email@ejemplo.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Rol que te interesa
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="pilot">Piloto (DJ)</option>
                        <option value="allied">Aliado (Fiestero)</option>
                        <option value="stadium">Hangar (Club)</option>
                        <option value="observer">Reportero</option>
                      </select>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full glassmorphism-primary-button px-4 py-3 flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        ) : (
                          <Rocket size={18} className="mr-2" />
                        )}
                        {isSubmitting ? 'Procesando...' : 'Completar Pre-registro'}
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-400 text-center">
                      Al registrarte, aceptas recibir comunicaciones sobre el lanzamiento de CosmicBeats.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating DJ spaceship */}
      <motion.div
        className="absolute bottom-10 right-10 hidden md:block"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-xl"></div>
          <img 
            src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="DJ Spaceship" 
            className="w-full h-full object-cover rounded-full border-2 border-indigo-500/50"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <Rocket size={16} className="text-white" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LaunchCountdown;