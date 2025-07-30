import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, X, Upload, AlertTriangle, Music, Tag, Clock, FileText, Link as LinkIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useDJStore } from '../../stores/djStore';

interface SessionUploadButtonProps {
  djId: string;
  isOwnProfile?: boolean;
}

const SessionUploadButton: React.FC<SessionUploadButtonProps> = ({ djId, isOwnProfile = false }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    tags: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuthStore();
  const { submitVideoSession, canSubmitVideo } = useDJStore();
  
  const canUpload = isOwnProfile && user?.id === djId && canSubmitVideo(djId);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Por favor, introduce un título para tu sesión');
      return;
    }
    
    if (!formData.videoUrl.trim()) {
      setError('Por favor, introduce una URL de vídeo');
      return;
    }
    
    // Validate YouTube URL (simple validation)
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(formData.videoUrl)) {
      setError('Por favor, introduce una URL válida de YouTube');
      return;
    }
    
    if (!showGuidelines) {
      setShowGuidelines(true);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await submitVideoSession(djId, formData.videoUrl, formData.title);
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        tags: ''
      });
      setShowUploadModal(false);
      setShowGuidelines(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al subir la sesión');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!canUpload) return null;
  
  return (
    <>
      <button
        onClick={() => setShowUploadModal(true)}
        className="glassmorphism-primary-button px-6 py-3 flex items-center justify-center fixed bottom-6 right-6 z-30 rounded-full shadow-lg"
        aria-label="Subir sesión"
      >
        <Radio size={20} className="mr-2" />
        SEND
      </button>
      
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
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
                onClick={() => {
                  setShowUploadModal(false);
                  setShowGuidelines(false);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              <div className="relative z-10">
                {showGuidelines ? (
                  <>
                    <div className="flex items-start mb-6">
                      <AlertTriangle size={24} className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold mb-2">Directrices de Competición</h3>
                        <p className="text-sm text-gray-300 mb-4">
                          Al subir esta sesión, aceptas las siguientes directrices:
                        </p>
                        <ul className="space-y-2 text-sm text-gray-300 mb-4">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Tu sesión debe tener entre 15-60 minutos de duración</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>El contenido debe ser apropiado y seguir las normas de la comunidad</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Debes tener derechos sobre toda la música reproducida en tu sesión</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Las sesiones no pueden eliminarse una vez subidas y votadas</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Solo puedes subir una sesión por semana de competición</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowGuidelines(false);
                          setShowUploadModal(false);
                        }}
                        className="glassmorphism-button px-4 py-2"
                      >
                        <X size={16} className="mr-2" />
                        Cancelar
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="glassmorphism-primary-button px-4 py-2 flex items-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        ) : (
                          <Upload size={16} className="mr-2" />
                        )}
                        Acepto y Envío
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                        <Radio size={24} className="text-indigo-400 relative z-10" />
                        <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Subir Nueva Sesión</h2>
                        <p className="text-gray-400 text-sm">Comparte tu música con la galaxia</p>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start">
                        <AlertTriangle size={18} className="text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-red-400">{error}</span>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                          <Music size={16} className="mr-2 text-indigo-400" />
                          Título de la Sesión *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Ej: Deep House Journey Vol. 3"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                          <FileText size={16} className="mr-2 text-indigo-400" />
                          Descripción
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe tu sesión..."
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                          <LinkIcon size={16} className="mr-2 text-indigo-400" />
                          URL de YouTube *
                        </label>
                        <input
                          type="url"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                            <Clock size={16} className="mr-2 text-indigo-400" />
                            Duración
                          </label>
                          <input
                            type="text"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="Ej: 45:30"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                            <Tag size={16} className="mr-2 text-indigo-400" />
                            Etiquetas
                          </label>
                          <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="Ej: house, deep, melodic"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowUploadModal(false)}
                          className="glassmorphism-button px-4 py-2"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="glassmorphism-primary-button px-4 py-2 flex items-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          ) : (
                            <Radio size={16} className="mr-2" />
                          )}
                          Continuar
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SessionUploadButton;