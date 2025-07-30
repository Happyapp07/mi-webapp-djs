import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Zap, Crown, Check, ArrowRight, Calendar, Shield, Info, ChevronRight, CreditCard, Lock } from 'lucide-react';
import { UserType } from '../types';
import { SubscriptionTier } from '../types/subscription';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { buildRedirectionState, getRedirectionPath } from '../utils/redirectionUtils';
import StripeCheckout from '../components/subscription/StripeCheckout';
import PaymentModal from '../components/payment/PaymentModal';

const SubscriptionSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');
  const [showPilotWarning, setShowPilotWarning] = useState(false);
  const [competitionEnabled, setCompetitionEnabled] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { user } = useAuthStore();
  const { plans, fetchPlans } = useSubscriptionStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Get the selected role from location state
    const state = location.state as { userType?: UserType };
    if (state?.userType) {  
      setSelectedRole(state.userType);
      setShowPilotWarning(state.userType === UserType.DJ);
    } else {
      // If no role is selected, redirect to register page
      navigate('/register');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (selectedRole) {
      fetchPlans(selectedRole);
    }
  }, [selectedRole, fetchPlans]);

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

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    const planDetails = plans.find(p => p.id === planId);
    // If it's a free plan, proceed directly
    if (planDetails && planDetails.price === 0) {
      handleContinue(planId);
    } else {
      // For paid plans, show checkout
      setShowCheckout(true);
    }
  };

  const handleContinue = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    // If user is already logged in, redirect to profile
    if (user) {
      const redirectState = buildRedirectionState(
        selectedRole,
        planId,
        {
          interval: selectedInterval,
          competitionEnabled,
          userId: user.id,
          redirectToProfile: true // Always redirect to profile after subscription selection
        }
      );
      
      const redirectPath = getRedirectionPath(redirectState);
      
      navigate(redirectPath, {
        state: redirectState
      });
    } else {
      // Build redirection state for registration
      const redirectState = buildRedirectionState(
        selectedRole,
        planId,
        {
          interval: selectedInterval,
          competitionEnabled,
          redirectToProfile: true
        }
      );

      // Navigate to register with the state
      navigate('/register', {
        state: redirectState
      });
    }
  };
  
  const handlePaymentSuccess = () => {
    if (selectedPlan) {
      handleContinue(selectedPlan);
    }
  };
  
  const handlePaymentCancel = () => {
    setShowCheckout(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-space-900">
      {/* Background elements - static with slow animation */}
      <div className="absolute inset-0 bg-space-900 bg-cover bg-no-repeat bg-center">
        {/* Slow moving stars background */}
        <div className="absolute inset-0 stars-background"></div>
        
        {/* Shooting stars */}
        <div className="absolute inset-0 shooting-stars"></div>
      </div>
      
      <div className="container max-w-6xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
            Elige tu Membresía
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Selecciona el plan que mejor se adapte a tus necesidades para combatir el Silencio Cósmico
          </p>
        </motion.div>

        {/* Annual Discount Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30 ${selectedRole === UserType.REPORTER ? 'hidden' : ''}`}
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

        {/* Pilot Competition Toggle */}
        {selectedRole === UserType.DJ && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-4 border border-indigo-500/30"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start">
                <Shield size={24} className="text-indigo-400 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-display mb-1">Modo de Intervención</h3>
                  <p className="text-gray-300">Elige cómo quieres participar como Piloto en la misión contra el Silencio Cósmico</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCompetitionEnabled(true)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    competitionEnabled
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  Competir
                </button>
                <button 
                  onClick={() => setCompetitionEnabled(false)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    !competitionEnabled
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  No Competir
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pilot Warning */}
        {showPilotWarning && competitionEnabled && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30 flex items-start"
          >
            <Info size={24} className="text-yellow-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-yellow-500 mb-1">Información Importante para Pilotos</h3>
              <p className="text-gray-300 mb-2">
                Solo puedes postularte como piloto a un único planeta (estilo musical).
                Una vez elegido, no se podrá cambiar. Tu perfil será visible públicamente como DJ compitiendo en ese estilo.
              </p>
              {!competitionEnabled && (
                <div className="p-3 bg-gray-800/50 rounded-lg mt-2">
                  <h4 className="font-medium text-gray-300 mb-1">Modo sin competición</h4>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>• Tu perfil será público solo como currículum musical</li>
                    <li>• No estarás vinculado a ningún planeta ni ranking</li>
                    <li>• Podrás subir fotos/carteles ordenados cronológicamente</li>
                    <li>• Podrás embeder sesiones de otras plataformas</li>
                    <li>• Podrás realizar misiones y obtener Beatcoins</li>
                    <li>• No competirás ni serás visible en rankings</li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Reporter Info */}
        {selectedRole === UserType.REPORTER && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30 flex items-start"
          >
            <Info size={24} className="text-green-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-green-500 mb-1">Información para Reporteros</h3>
              <p className="text-gray-300 mb-2">
                El acceso como Reportero está vinculado a invitación o asociación directa con un Piloto.
                Debes ser verificado por la plataforma para acceder a todas las funcionalidades.
              </p>
              <div className="p-3 bg-gray-800/50 rounded-lg mt-2">
                <h4 className="font-medium text-gray-300 mb-1">Proceso de verificación</h4>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Completa tu perfil con información profesional</li>
                  <li>• Asocia tu cuenta con un Piloto (DJ) existente</li>
                  <li>• Sube ejemplos de tu trabajo previo</li>
                  <li>• Espera la verificación por parte del equipo</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            // Calculate annual price with 20% discount
            const annualPrice = plan.price > 0 && selectedRole !== UserType.REPORTER
              ? Math.round(plan.price * 12 * 0.8) 
              : 0;
            
            // Determine if this plan is available based on competition setting
            const isPlanAvailable = selectedRole !== UserType.DJ || 
              (plan.tier === SubscriptionTier.BASIC) || 
              competitionEnabled;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isPlanAvailable ? 1 : 0.5, y: 0 }}
                transition={{ delay: plans.indexOf(plan) * 0.1 }}
                className={`glass-card rounded-xl overflow-hidden ${
                  plan.recommended ? 'border-2 border-yellow-500/30' : ''
                } ${!isPlanAvailable ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display">{plan.name}</h3>
                    {plan.recommended && (
                      <span className="px-3 py-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 rounded-full">
                        Recomendado
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    {plan.price > 0 ? (
                      <>
                        <div className="text-3xl font-bold">
                          {selectedInterval === 'year' && selectedRole !== UserType.REPORTER ? annualPrice : plan.price}€
                        </div>
                        <div className="text-sm text-gray-400">
                          {selectedInterval === 'year' && selectedRole !== UserType.REPORTER ? '/año' : '/mes'}
                          {selectedInterval === 'year' && selectedRole !== UserType.REPORTER && (
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
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full btn ${
                      plan.recommended || plan.price === 0 ? 'btn-primary' : 'btn-secondary'
                    } flex items-center justify-center`}
                    disabled={!isPlanAvailable}
                  >
                    {plan.price > 0 ? (
                      <>
                        <CreditCard size={16} className="mr-2" />
                        Suscribirse
                      </>
                    ) : (
                      <>
                        Seleccionar
                      </>
                    )}
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

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
      </div>
      
      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          interval={selectedInterval}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <StripeCheckout
            plan={plans.find(p => p.id === selectedPlan)!}
            interval={selectedInterval}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </motion.div>
      )}
    </div>
  );
};

export default SubscriptionSelectionPage;