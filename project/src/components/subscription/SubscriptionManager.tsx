import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, AlertTriangle, Check, ArrowUpDown, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { SubscriptionPlan } from '../../types/subscription';
import StripeElements from './StripeElements';

interface SubscriptionManagerProps {
  onClose: () => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onClose }) => {
  const { user } = useAuthStore();
  const { 
    plans, 
    currentSubscription, 
    fetchPlans, 
    cancelSubscription 
  } = useSubscriptionStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');
  
  useEffect(() => {
    if (user) {
      fetchPlans(user.userType);
    }
  }, [user, fetchPlans]);
  
  const handleCancelSubscription = async () => {
    if (!confirm('¿Estás seguro de que quieres cancelar tu suscripción? Seguirás teniendo acceso hasta el final del período actual.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await cancelSubscription();
      
      setSuccess('Tu suscripción ha sido cancelada. Seguirás teniendo acceso hasta el final del período actual.');
      
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cancelar la suscripción');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpgradeSubscription = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };
  
  const handlePaymentSuccess = () => {
    setShowUpgradeModal(false);
    setSuccess('Tu suscripción ha sido actualizada correctamente.');
    
    setTimeout(() => {
      setSuccess(null);
      onClose();
    }, 3000);
  };
  
  const getCurrentPlan = () => {
    if (!currentSubscription) return null;
    
    return plans.find(p => p.id === currentSubscription.planId);
  };
  
  const currentPlan = getCurrentPlan();
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card p-6 rounded-xl max-w-2xl w-full relative overflow-hidden"
      >
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="scanner-effect"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
              <CreditCard size={24} className="text-indigo-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Gestionar Suscripción</h2>
              <p className="text-gray-400">Administra tu plan y métodos de pago</p>
            </div>
          </div>
          
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
          
          {/* Current Subscription */}
          {currentSubscription && currentPlan && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Plan Actual</h3>
              
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">{currentPlan.name}</h4>
                    <p className="text-gray-400 text-sm">{currentPlan.description}</p>
                    
                    <div className="mt-2 flex items-center">
                      <Calendar size={16} className="text-indigo-400 mr-2" />
                      <span className="text-sm">
                        Próximo pago: {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      {currentSubscription.isTrialPeriod ? (
                        <span className="text-green-400">Prueba Gratuita</span>
                      ) : (
                        <>
                          {currentPlan.price}€
                          <span className="text-sm text-gray-400">
                            /{currentSubscription.planId.includes('year') ? 'año' : 'mes'}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {currentSubscription.isTrialPeriod && currentSubscription.trialEndsAt && (
                      <div className="text-sm text-gray-400">
                        Finaliza el {new Date(currentSubscription.trialEndsAt).toLocaleDateString()}
                      </div>
                    )}
                    
                    {currentSubscription.cancelAtPeriodEnd && (
                      <div className="mt-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs inline-block">
                        Cancelada - Finaliza el {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Subscription Actions */}
                <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-3">
                  {!currentSubscription.cancelAtPeriodEnd && (
                    <button
                      onClick={handleCancelSubscription}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm"
                      disabled={isLoading}
                    >
                      Cancelar Suscripción
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors text-sm flex items-center"
                    disabled={isLoading}
                  >
                    <ArrowUpDown size={14} className="mr-1" />
                    Cambiar Plan
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Métodos de Pago</h3>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                    <CreditCard size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-sm text-gray-400">Expira 12/25</div>
                  </div>
                </div>
                
                <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                  Predeterminado
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors text-sm"
                >
                  Añadir Método de Pago
                </button>
              </div>
            </div>
          </div>
          
          {/* Billing History */}
          <div>
            <h3 className="text-lg font-medium mb-4">Historial de Facturación</h3>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Factura #INV-2025001</div>
                    <div className="text-sm text-gray-400">01/06/2025</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-green-400 mr-3">9.00€</div>
                    <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-indigo-400">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <StripeElements
            plan={selectedPlan}
            interval={selectedInterval}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowUpgradeModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;