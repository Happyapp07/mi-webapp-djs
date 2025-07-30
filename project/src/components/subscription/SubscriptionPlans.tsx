import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Crown, Loader, Clock, Calendar } from 'lucide-react';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useAuthStore } from '../../stores/authStore';
import { SubscriptionTier } from '../../types/subscription';
import { UserType } from '../../types';
import StripeElements from './StripeElements';

const SubscriptionPlans: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    plans, 
    isLoading, 
    error, 
    subscribe,
    fetchPlans,
    currentSubscription
  } = useSubscriptionStore();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');

  React.useEffect(() => {
    if (user) {
      fetchPlans(user.userType);
    }
  }, [user, fetchPlans]);

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.WALKER:
      case SubscriptionTier.BASIC:
      case SubscriptionTier.BASE:
        return <Star className="w-5 h-5 text-gray-400" />;
      case SubscriptionTier.SUPPORTER:
      case SubscriptionTier.EXPERT:
      case SubscriptionTier.RECRUIT:
      case SubscriptionTier.VERIFIED:
        return <Zap className="w-5 h-5 text-indigo-400" />;
      case SubscriptionTier.HUNTER:
      case SubscriptionTier.PRO:
      case SubscriptionTier.STADIUM:
        return <Crown className="w-5 h-5 text-yellow-400" />;
    }
  };

  const handleSubscribe = (planId: string, interval: 'month' | 'year' = 'month') => {
    // Check if Stripe is properly configured
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_STRIPE_PUBLIC_KEY === 'pk_test_your_stripe_public_key') {
      alert('Stripe no está configurado correctamente. Por favor, contacta al administrador.');
      return;
    }
    
    setSelectedPlanId(planId);
    setSelectedInterval(interval);
    setShowCheckout(true);
  };
  
  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    // Refresh subscription status
    if (user) {
      fetchPlans(user.userType as UserType);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  const isEligibleForTrial = !localStorage.getItem('has_used_trial');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Trial Promotion Banner */}
      {isEligibleForTrial && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-xl p-4 border border-indigo-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock size={24} className="text-indigo-400 mr-3" />
              <div>
                <h3 className="text-xl font-display mb-1">¡3 Meses Gratis!</h3>
                <p className="text-gray-300">Prueba cualquier membresía de pago gratis durante 3 meses. Oferta por tiempo limitado.</p>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-400 font-medium">
                Primera Suscripción
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Annual Discount Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar size={24} className="text-yellow-400 mr-3" />
            <div>
              <h3 className="text-xl font-display mb-1">Descuento Anual</h3>
              <p className="text-gray-300">¡Ahorra un 20% al suscribirte anualmente!</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedInterval('month')}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedInterval === 'month' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              Mensual
            </button>
            <button 
              onClick={() => setSelectedInterval('year')}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedInterval === 'year' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              Anual
            </button>
          </div>
        </div>
      </motion.div>

      {/* Role-based sections */}
      {user?.userType === 'partygoer' && (
        <div className="mb-12">
          <h2 className="text-2xl font-display mb-6 flex items-center">
            🧑‍🚀 Membresías para Aliados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => {
              // Mark Supporter plan as recommended for Allies
              const isRecommended = 
                (user?.userType === 'partygoer' && plan.tier === SubscriptionTier.SUPPORTER) ||
                (user?.userType === 'dj' && plan.tier === SubscriptionTier.EXPERT) ||
                (user?.userType === 'club' && plan.tier === SubscriptionTier.RECRUIT);
              
              return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-xl overflow-hidden ${
                  isRecommended ? 'border-2 border-yellow-500/30' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display">{plan.name}</h3>
                    {isRecommended && (
                      <span className="px-3 py-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    {plan.price > 0 ? (
                      <>
                        <div className="text-3xl font-bold">{selectedInterval === 'year' ? Math.round(plan.price * 12 * 0.8) : plan.price}€</div>
                        <div className="text-sm text-gray-400">
                          {selectedInterval === 'year' ? '/año' : '/mes'}
                          {selectedInterval === 'year' && (
                            <span className="ml-2 text-green-400">-20%</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-3xl font-bold">Gratis</div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id, selectedInterval)}
                    className={`w-full btn ${
                      isRecommended ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {isEligibleForTrial && plan.price > 0 
                      ? '3 Meses Gratis' 
                      : plan.price > 0 
                        ? 'Suscribirse' 
                        : 'Comenzar Gratis'}
                  </button>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      )}

      {user?.userType === 'dj' && (
        <div className="mb-12">
          <h2 className="text-2xl font-display mb-6 flex items-center">
            🎧 Membresías para Pilotos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-xl overflow-hidden ${
                  plan.recommended ? 'border-2 border-yellow-500/30' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display">{plan.name}</h3>
                    {plan.recommended && (
                      <span className="px-3 py-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    {plan.price > 0 ? (
                      <>
                        <div className="text-3xl font-bold">{selectedInterval === 'year' ? Math.round(plan.price * 12 * 0.8) : plan.price}€</div>
                        <div className="text-sm text-gray-400">
                          {selectedInterval === 'year' ? '/año' : '/mes'}
                          {selectedInterval === 'year' && (
                            <span className="ml-2 text-green-400">-20%</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-3xl font-bold">Gratis</div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id, selectedInterval)}
                    className={`w-full btn ${
                      plan.recommended ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {isEligibleForTrial && plan.price > 0 
                      ? '3 Meses Gratis' 
                      : plan.price > 0 
                        ? 'Suscribirse' 
                        : 'Comenzar Gratis'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {user?.userType === 'club' && (
        <div className="mb-12">
          <h2 className="text-2xl font-display mb-6 flex items-center">
            🏟️ Membresías para Hangares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-xl overflow-hidden ${
                  plan.recommended ? 'border-2 border-yellow-500/30' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display">{plan.name}</h3>
                    {plan.recommended && (
                      <span className="px-3 py-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    {plan.price > 0 ? (
                      <>
                        <div className="text-3xl font-bold">{plan.price}€</div>
                        <div className="text-sm text-gray-400">/año</div>
                      </>
                    ) : (
                      <div className="text-3xl font-bold">Gratis</div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id, 'year')}
                    className={`w-full btn ${
                      plan.recommended ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {plan.price > 0 
                      ? 'Suscribirse' 
                      : 'Comenzar Gratis'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {user?.userType === 'reporter' && (
        <div className="mb-12">
          <h2 className="text-2xl font-display mb-6 flex items-center">
            📸 Membresía para Reporteros
          </h2>
          <div className="max-w-md mx-auto">
            {plans.map(plan => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display">{plan.name}</h3>
                    <span className="px-3 py-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full">
                      Gratuito
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold">Gratis</div>
                    <div className="text-sm text-gray-400">Con validación</div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className="w-full btn btn-primary"
                  >
                    Solicitar Verificación
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Common Features Section */}
      <div className="mt-12 glass-card p-6 rounded-xl">
        <h3 className="text-xl font-display mb-6">🎟️ Características Comunes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-3">Carnet Digital con QR Dinámico</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Valida privilegios y accesos</li>
              <li>• Muestra nivel y membresía</li>
              <li>• Actualización en tiempo real</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Pasaporte Virtual</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Registro de clubs visitados</li>
              <li>• Historial de eventos</li>
              <li>• Validación por QR en locales</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Sistema Beatcoins</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Gana por participar</li>
              <li>• Canjea por recompensas</li>
              <li>• Descuentos exclusivos</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Checkout Modal */}
      {showCheckout && selectedPlanId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <StripeElements
            plan={plans.find(p => p.id === selectedPlanId)!}
            interval={selectedInterval}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowCheckout(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;