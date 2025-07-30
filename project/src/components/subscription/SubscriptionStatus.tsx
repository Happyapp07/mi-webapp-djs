import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface SubscriptionStatusProps {
  status: 'active' | 'past_due' | 'canceled';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  onManageSubscription: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  status,
  currentPeriodEnd,
  cancelAtPeriodEnd,
  onManageSubscription
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-500/10';
      case 'past_due':
        return 'text-red-500 bg-red-500/10';
      case 'canceled':
        return 'text-gray-500 bg-gray-500/10';
      default:
        return 'text-yellow-500 bg-yellow-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium">Estado de la Membresía</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full mt-2 ${getStatusColor()}`}>
            <span className="text-sm capitalize">{
              status === 'active' ? 'Activa' :
              status === 'past_due' ? 'Pago pendiente' :
              'Cancelada'
            }</span>
          </div>
        </div>
        
        <button
          onClick={onManageSubscription}
          className="btn btn-secondary"
        >
          Gestionar Membresía
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-sm">
          <Calendar size={16} className="mr-2 text-gray-400" />
          <span>
            Periodo actual finaliza: {format(new Date(currentPeriodEnd), 'd MMMM, yyyy')}
          </span>
        </div>

        {status === 'past_due' && (
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

        {cancelAtPeriodEnd && (
          <div className="flex items-start p-4 bg-yellow-500/10 rounded-lg">
            <AlertTriangle size={20} className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-500 font-medium mb-1">Suscripción Finalizando</h4>
              <p className="text-sm text-gray-300">
                Tu suscripción finalizará el {format(new Date(currentPeriodEnd), 'd MMMM, yyyy')}.
                Puedes reactivarla en cualquier momento antes de esta fecha para mantener tus beneficios.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubscriptionStatus;