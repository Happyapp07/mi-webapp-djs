import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface FallbackErrorPageProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
  showCompleteProfileButton?: boolean;
}

const FallbackErrorPage: React.FC<FallbackErrorPageProps> = ({
  title = 'Algo salió mal',
  message = 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.',
  showHomeButton = true,
  showRetryButton = true,
  showCompleteProfileButton = false
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-xl max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-500" />
        </div>

        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-300 mb-8">{message}</p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {showHomeButton && (
            <Link to="/" className="glassmorphism-button px-6 py-3 flex items-center justify-center">
              <Home size={18} className="mr-2" />
              Volver al inicio
            </Link>
          )}

          {showRetryButton && (
            <button
              onClick={handleRetry}
              className="glassmorphism-button px-6 py-3 flex items-center justify-center"
            >
              <RefreshCw size={18} className="mr-2" />
              Reintentar
            </button>
          )}

          {showCompleteProfileButton && (
            <Link
              to="/complete-profile"
              className="glassmorphism-primary-button px-6 py-3 flex items-center justify-center"
            >
              Completar perfil
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FallbackErrorPage;