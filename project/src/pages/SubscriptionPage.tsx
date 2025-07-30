import React, { useEffect } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import SubscriptionPlans from '../components/subscription/SubscriptionPlans';
import SubscriptionStatus from '../components/subscription/SubscriptionStatus';
import SubscriptionManager from '../components/subscription/SubscriptionManager';
import SubscriptionQuota from '../components/subscription/SubscriptionQuota';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    plans,
    currentSubscription,
    isLoading,
    error,
    fetchPlans,
    getRemainingQuota
  } = useSubscriptionStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPlans(user.userType);
    }
  }, [user, fetchPlans]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
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

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
          Gestión de Membresía
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Administra tu membresía y desbloquea funciones premium
        </p>
      </motion.div>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium">Estado de la Membresía</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full mt-2 ${
                  currentSubscription.status === 'active' ? 'text-green-500 bg-green-500/10' :
                  currentSubscription.status === 'past_due' ? 'text-red-500 bg-red-500/10' :
                  'text-gray-500 bg-gray-500/10'
                }`}>
                  <span className="text-sm capitalize">{
                    currentSubscription.status === 'active' ? 'Activa' :
                    currentSubscription.status === 'past_due' ? 'Pago pendiente' :
                    'Cancelada'
                  }</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowSubscriptionManager(true)}
                className="btn btn-secondary"
              >
                Gestionar Membresía
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar size={16} className="mr-2 text-gray-400" />
                <span>
                  Periodo actual finaliza: {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>

              {currentSubscription.status === 'past_due' && (
                <div className="flex items-start p-4 bg-red-500/10 rounded-lg">
                  <AlertTriangle size={20} className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-500 font-medium mb-1">Pago Requerido</h4>
                    <p className="text-sm text-gray-300">
                      Tu suscripción tiene un pago pendiente. Por favor, actualiza tu método de pago para continuar accediendo a las funciones premium.
                    </p>
                  </div>
                </div>
              )}

              {currentSubscription.cancelAtPeriodEnd && (
                <div className="flex items-start p-4 bg-yellow-500/10 rounded-lg">
                  <AlertTriangle size={20} className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-500 font-medium mb-1">Suscripción Finalizando</h4>
                    <p className="text-sm text-gray-300">
                      Tu suscripción finalizará el {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}.
                      Puedes reactivarla en cualquier momento antes de esta fecha para mantener tus beneficios.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {user?.userType === 'dj' && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SubscriptionQuota
                feature="Planetas"
                used={1}
                total={getRemainingQuota('planets')}
                unit="planetas"
              />
              <SubscriptionQuota
                feature="Competiciones"
                used={0}
                total={getRemainingQuota('competitions')}
                unit="activas"
              />
              <SubscriptionQuota
                feature="Sesiones"
                used={2}
                total={10}
                unit="videos"
              />
            </div>
          )}

          {user?.userType === 'club' && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SubscriptionQuota
                feature="Eventos Promocionados"
                used={1}
                total={getRemainingQuota('promotedEvents')}
                unit="eventos"
              />
              <SubscriptionQuota
                feature="Sesiones de Streaming"
                used={0}
                total={getRemainingQuota('streamingSessions')}
                unit="sesiones"
              />
              <SubscriptionQuota
                feature="Análisis de Datos"
                used={30}
                total={100}
                unit="días"
              />
            </div>
          )}
        </>
      )}

      {/* Subscription Plans */}
      {!currentSubscription && <SubscriptionPlans />}

      {/* Upgrade Modal */}
      {showSubscriptionManager && (
        <SubscriptionManager onClose={() => setShowSubscriptionManager(false)} />
      )}

      {/* Secure Payments Info */}
      <div className="mt-16 max-w-2xl mx-auto">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-indigo-400 mr-2" />
            <h2 className="text-lg font-medium">Pagos Seguros</h2>
          </div>
          <p className="text-sm text-gray-400">
            Todos los pagos se procesan de forma segura a través de Stripe. Tu información de pago nunca se almacena en nuestros servidores.
            Puedes cancelar o actualizar tu suscripción en cualquier momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;