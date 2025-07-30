import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Check, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const ConnectedAccounts: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    // Fetch connected providers
    const fetchProviders = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        const identities = data.user?.identities || [];
        const providers = identities.map(identity => identity.provider);
        setConnectedProviders(providers);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    
    fetchProviders();
  }, [user, navigate]);
  
  const handleConnectProvider = async (provider: 'google' | 'tiktok' | 'twitter') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/connected-accounts`
        }
      });
      
      if (error) throw error;
      
      // The user will be redirected to the provider's auth page
    } catch (error: any) {
      setError(error.message || 'Error connecting provider');
      setIsLoading(false);
    }
  };
  
  const handleDisconnectProvider = async (provider: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.unlinkIdentity({
        provider: provider as any
      });
      
      if (error) throw error;
      
      // Update connected providers
      setConnectedProviders(prev => prev.filter(p => p !== provider));
      setSuccess(`${provider.charAt(0).toUpperCase() + provider.slice(1)} desconectado correctamente`);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Error disconnecting provider');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display flex items-center">
          <Shield size={32} className="mr-3 text-indigo-500" />
          Cuentas Conectadas
        </h1>
        <p className="text-gray-400 mt-2">
          Administra tus métodos de acceso y seguridad
        </p>
      </motion.div>
      
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start"
        >
          <AlertTriangle size={20} className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <span className="text-red-400">{error}</span>
        </motion.div>
      )}
      
      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start"
        >
          <Check size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <span className="text-green-400">{success}</span>
        </motion.div>
      )}
      
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-xl mb-8"
        >
          <h2 className="text-xl font-medium mb-6">Métodos de Acceso</h2>
          
          <div className="space-y-4">
            {/* Google */}
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      fill="#EA4335"
                      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1272727,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-lg">Google</div>
                  <div className="text-sm text-gray-400">
                    {connectedProviders.includes('google') 
                      ? 'Conectado' 
                      : 'No conectado'}
                  </div>
                </div>
              </div>
              
              {connectedProviders.includes('google') ? (
                <button
                  onClick={() => handleDisconnectProvider('google')}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  disabled={isLoading || connectedProviders.length <= 1}
                  title={connectedProviders.length <= 1 ? "Debes tener al menos un método de acceso" : ""}
                >
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={() => handleConnectProvider('google')}
                  className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
                  disabled={isLoading}
                >
                  Conectar
                </button>
              )}
            </div>
            
            {/* TikTok */}
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mr-4">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      fill="white"
                      d="M19.321 5.562a5.124 5.124 0 0 1-5.16-5.016h-3.323v16.2c0 1.667-1.507 3.018-3.175 3.018a3.097 3.097 0 0 1-3.175-3.018c0-1.667 1.507-3.018 3.175-3.018.32 0 .64.048.943.146v-3.22a6.34 6.34 0 0 0-.943-.068C4.439 10.587 1.5 13.526 1.5 17.16c0 3.635 2.939 6.574 6.574 6.574 3.635 0 6.574-2.939 6.574-6.574V9.49a8.594 8.594 0 0 0 4.673 1.36v-5.29z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-lg">TikTok</div>
                  <div className="text-sm text-gray-400">
                    {connectedProviders.includes('tiktok') 
                      ? 'Conectado' 
                      : 'No conectado'}
                  </div>
                </div>
              </div>
              
              {connectedProviders.includes('tiktok') ? (
                <button
                  onClick={() => handleDisconnectProvider('tiktok')}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  disabled={isLoading || connectedProviders.length <= 1}
                  title={connectedProviders.length <= 1 ? "Debes tener al menos un método de acceso" : ""}
                >
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={() => handleConnectProvider('tiktok')}
                  className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
                  disabled={isLoading}
                >
                  Conectar
                </button>
              )}
            </div>
            
            {/* Twitter (X) */}
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mr-4">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      fill="white"
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-lg">X (Twitter)</div>
                  <div className="text-sm text-gray-400">
                    {connectedProviders.includes('twitter') 
                      ? 'Conectado' 
                      : 'No conectado'}
                  </div>
                </div>
              </div>
              
              {connectedProviders.includes('twitter') ? (
                <button
                  onClick={() => handleDisconnectProvider('twitter')}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  disabled={isLoading || connectedProviders.length <= 1}
                  title={connectedProviders.length <= 1 ? "Debes tener al menos un método de acceso" : ""}
                >
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={() => handleConnectProvider('twitter')}
                  className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
                  disabled={isLoading}
                >
                  Conectar
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-indigo-500/10 rounded-lg">
            <div className="flex items-start">
              <Shield size={20} className="text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="mb-2">
                  <strong>Mejora tu seguridad conectando múltiples cuentas.</strong>
                </p>
                <p>
                  Conectar varias cuentas te permite acceder a tu perfil de CosmicBeats a través de diferentes 
                  plataformas y te proporciona métodos alternativos de recuperación de cuenta.
                </p>
                <p className="mt-2">
                  <strong>Nota:</strong> Debes mantener al menos un método de acceso activo en todo momento.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConnectedAccounts;