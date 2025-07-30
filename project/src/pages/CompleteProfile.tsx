import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Music, Building2, Camera, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { UserType } from '../types';
import { buildRedirectionState, getRedirectionPath } from '../utils/redirectionUtils';

const CompleteProfile: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: '',
    planetId: '',
    competitionEnabled: true,
    displayName: '',
    bio: '',
    location: '',
    musicStyle: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Pre-fill form data from user and location state
  useEffect(() => {
    if (user) {
      const state = location.state as any;
      setFormData(prev => ({
        ...prev,
        userType: user.userType || state?.userType || '',
        planetId: state?.planetId || '',
        competitionEnabled: state?.competitionEnabled !== undefined ? state.competitionEnabled : true,
        displayName: user.username || ''
      }));
    }
  }, [user, location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.userType) {
      setError('Por favor, selecciona un tipo de usuario');
      return;
    }
    
    if (formData.userType === UserType.DJ && formData.competitionEnabled && !formData.planetId) {
      setError('Por favor, selecciona un planeta (estilo musical)');
      return;
    }
    
    if (!formData.displayName) {
      setError('Por favor, introduce un nombre para mostrar');
      return;
    }
    
    // Build redirection state
    const redirectState = buildRedirectionState(
      formData.userType as UserType,
      undefined,
      {
        competitionEnabled: formData.competitionEnabled,
        planetId: formData.planetId,
        userId: user?.id
      }
    );
    
    // Get the appropriate redirection path
    const redirectPath = getRedirectionPath(redirectState);
    
    // Navigate to the appropriate path
    navigate(redirectPath, {
      state: redirectState
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <h1 className="text-2xl font-display text-center mb-6">Completa tu perfil</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
            <AlertTriangle size={20} className="text-red-500 mr-3" />
            <span className="text-red-400">{error}</span>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Paso {step} de 3</span>
            <span className="text-sm text-gray-400">{Math.round((step / 3) * 100)}% completado</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-lg font-medium mb-4">¿Qué tipo de usuario eres?</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: UserType.DJ })}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    formData.userType === UserType.DJ 
                      ? 'border-indigo-500 bg-indigo-500/20' 
                      : 'border-gray-700 hover:border-indigo-500/50 bg-gray-800/50'
                  }`}
                >
                  <Music size={32} className="mb-2 text-purple-400" />
                  <span>Piloto (DJ)</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: UserType.PARTYGOER })}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    formData.userType === UserType.PARTYGOER 
                      ? 'border-indigo-500 bg-indigo-500/20' 
                      : 'border-gray-700 hover:border-indigo-500/50 bg-gray-800/50'
                  }`}
                >
                  <User size={32} className="mb-2 text-blue-400" />
                  <span>Aliado (Fiestero)</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: UserType.CLUB })}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    formData.userType === UserType.CLUB 
                      ? 'border-indigo-500 bg-indigo-500/20' 
                      : 'border-gray-700 hover:border-indigo-500/50 bg-gray-800/50'
                  }`}
                >
                  <Building2 size={32} className="mb-2 text-orange-400" />
                  <span>Hangar (Club)</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: UserType.REPORTER })}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    formData.userType === UserType.REPORTER 
                      ? 'border-indigo-500 bg-indigo-500/20' 
                      : 'border-gray-700 hover:border-indigo-500/50 bg-gray-800/50'
                  }`}
                >
                  <Camera size={32} className="mb-2 text-green-400" />
                  <span>Reportero</span>
                </button>
              </div>
            </motion.div>
          )}
          
          {step === 2 && formData.userType === UserType.DJ && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-lg font-medium mb-4">Configuración de DJ</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  ¿Quieres competir en el ranking?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, competitionEnabled: true })}
                    className={`p-3 rounded-lg text-center transition-all ${
                      formData.competitionEnabled
                        ? 'bg-indigo-500/20 border-2 border-indigo-500'
                        : 'bg-gray-800/50 border-2 border-gray-700 hover:border-indigo-500/50'
                    }`}
                  >
                    Sí, quiero competir
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, competitionEnabled: false })}
                    className={`p-3 rounded-lg text-center transition-all ${
                      !formData.competitionEnabled
                        ? 'bg-indigo-500/20 border-2 border-indigo-500'
                        : 'bg-gray-800/50 border-2 border-gray-700 hover:border-indigo-500/50'
                    }`}
                  >
                    No, solo mostrar
                  </button>
                </div>
              </div>
              
              {formData.competitionEnabled && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Selecciona tu planeta (estilo musical)
                  </label>
                  <select
                    value={formData.planetId}
                    onChange={(e) => setFormData({ ...formData, planetId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Selecciona un estilo</option>
                    <option value="house">House</option>
                    <option value="techno">Techno</option>
                    <option value="trance">Trance</option>
                    <option value="progressive">Progressive</option>
                    <option value="deep-house">Deep House</option>
                    <option value="tech-house">Tech House</option>
                    <option value="minimal-techno">Minimal Techno</option>
                    <option value="drum-and-bass">Drum & Bass</option>
                  </select>
                  
                  <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <div className="flex items-start">
                      <AlertTriangle size={18} className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-400">
                        <strong>Importante:</strong> Una vez seleccionado el planeta, no podrás cambiarlo. Tu perfil será visible públicamente como DJ compitiendo en este estilo.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-lg font-medium mb-4">Información básica</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nombre para mostrar
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tu nombre artístico o alias"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Biografía (opcional)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                </div>
                
                {formData.userType === UserType.CLUB && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Ciudad, País"
                    />
                  </div>
                )}
                
                {(formData.userType === UserType.DJ || formData.userType === UserType.PARTYGOER) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Estilo musical favorito
                    </label>
                    <input
                      type="text"
                      value={formData.musicStyle}
                      onChange={(e) => setFormData({ ...formData, musicStyle: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="House, Techno, Trance, etc."
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="glassmorphism-button px-6 py-2.5"
              >
                Atrás
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="glassmorphism-primary-button px-6 py-2.5 ml-auto flex items-center"
              >
                Siguiente
                <ChevronRight size={16} className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="glassmorphism-primary-button px-6 py-2.5 ml-auto"
              >
                Completar perfil
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;