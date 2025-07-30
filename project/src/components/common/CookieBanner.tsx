import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown, ChevronUp } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookie-consent');
    if (!hasAcceptedCookies) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };
  
  const handleAcceptSelected = () => {
    // In a real implementation, this would save the selected cookie preferences
    localStorage.setItem('cookie-consent', 'selected');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="glass-card p-4 md:p-6 rounded-xl border border-cyan-500/30 max-w-4xl mx-auto relative overflow-hidden">
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <div className="relative z-10">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                <Cookie size={20} className="text-indigo-400 relative z-10" />
                <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Utilizamos cookies para mejorar tu experiencia</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Utilizamos cookies y tecnologías similares para personalizar contenido, proporcionar funciones de redes sociales y analizar nuestro tráfico. También compartimos información sobre tu uso de nuestro sitio con nuestros socios de redes sociales, publicidad y análisis.
                </p>
                
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center text-indigo-400 hover:text-indigo-300 text-sm mb-4"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp size={16} className="mr-1" />
                      Ocultar detalles
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-1" />
                      Mostrar detalles
                    </>
                  )}
                </button>
                
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div>
                            <div className="font-medium">Cookies Esenciales</div>
                            <div className="text-xs text-gray-400">Necesarias para el funcionamiento básico</div>
                          </div>
                          <div className="w-10 h-5 bg-indigo-500 rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div>
                            <div className="font-medium">Cookies Analíticas</div>
                            <div className="text-xs text-gray-400">Nos ayudan a mejorar nuestros servicios</div>
                          </div>
                          <div className="w-10 h-5 bg-gray-700 rounded-full relative cursor-pointer">
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div>
                            <div className="font-medium">Cookies de Marketing</div>
                            <div className="text-xs text-gray-400">Para mostrarte contenido personalizado</div>
                          </div>
                          <div className="w-10 h-5 bg-gray-700 rounded-full relative cursor-pointer">
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <a
                    href="/cookies.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm self-center sm:self-end"
                  >
                    Más información
                  </a>
                  
                  {showDetails && (
                    <button
                      onClick={handleAcceptSelected}
                      className="glassmorphism-button px-4 py-2 text-sm"
                    >
                      Aceptar seleccionadas
                    </button>
                  )}
                  
                  <button
                    onClick={handleAccept}
                    className="glassmorphism-primary-button px-4 py-2 text-sm"
                  >
                    Aceptar todas
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors ml-2"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieBanner;