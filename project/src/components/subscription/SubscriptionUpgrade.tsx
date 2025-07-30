import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { SubscriptionPlan, SubscriptionTier } from '../../types/subscription';
import { subscribe } from '../../lib/subscription';
import SubscriptionFeatures from './SubscriptionFeatures';

interface SubscriptionUpgradeProps {
  currentPlan: SubscriptionPlan;
  availablePlans: SubscriptionPlan[];
  onClose: () => void;
}

const SubscriptionUpgrade: React.FC<SubscriptionUpgradeProps> = ({
  currentPlan,
  availablePlans,
  onClose
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [interval, setInterval] = useState<'month' | 'year'>(currentPlan.interval === 'year' ? 'year' : 'month');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      setIsLoading(true);
      setError(null);
      await subscribe(selectedPlan.tier, interval);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const isDowngrade = (plan: SubscriptionPlan) => {
    const tiers = Object.values(SubscriptionTier);
    return tiers.indexOf(plan.tier) < tiers.indexOf(currentPlan.tier);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-4xl w-full bg-space-900 rounded-xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-display mb-6">Cambiar Plan de Membresía</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {availablePlans.map(plan => (
            <motion.div
              key={plan.id}
              className={`glass-card p-6 rounded-xl cursor-pointer transition-all ${
                selectedPlan?.id === plan.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => setSelectedPlan(plan)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                {plan.id === currentPlan.id && (
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                    Plan Actual
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}€</span>
                  <span className="text-gray-400 ml-1">/{plan.interval}</span>
                </div>
                {plan.seasonPrice && interval === 'month' && (
                  <div className="mt-2 p-2 bg-yellow-500/10 rounded-lg">
                    <div className="text-sm text-yellow-400">
                      {plan.seasonPrice}€/año (Ahorra {plan.seasonSavings}€)
                    </div>
                  </div>
                )}
              </div>

              <SubscriptionFeatures
                tier={plan.tier}
                features={plan.features}
                isCurrentTier={plan.id === currentPlan.id}
              />
            </motion.div>
          ))}
        </div>

        {selectedPlan && isDowngrade(selectedPlan) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-500/10 rounded-lg flex items-start"
          >
            <AlertTriangle size={20} className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-500 font-medium mb-1">Aviso de Downgrade</h4>
              <p className="text-sm text-gray-300">
                Bajar de plan tendrá efecto al final de tu periodo de facturación actual.
                Mantendrás acceso a tus funciones actuales hasta entonces.
              </p>
            </div>
          </motion.div>
        )}

        {selectedPlan && selectedPlan.price > 0 && selectedPlan.interval !== 'year' && (
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3">Intervalo de Facturación</h4>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setInterval('month')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  interval === 'month'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-700 hover:border-indigo-500/50'
                }`}
              >
                <div className="font-medium mb-1">Mensual</div>
                <div className="text-sm text-gray-400">
                  {selectedPlan.price}€/mes
                </div>
              </button>

              <button
                type="button"
                onClick={() => setInterval('year')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  interval === 'year'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-700 hover:border-indigo-500/50'
                }`}
              >
                <div className="font-medium mb-1">Anual (20% descuento)</div>
                <div className="text-sm text-gray-400">
                  {Math.round(selectedPlan.price * 12 * 0.8)}€/año
                </div>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleUpgrade}
            disabled={!selectedPlan || isLoading || selectedPlan.id === currentPlan.id}
            className="btn btn-primary flex items-center"
          >
            {isLoading ? (
              <motion.span
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                {selectedPlan?.id === currentPlan.id ? (
                  <Check size={20} className="mr-2" />
                ) : (
                  <ArrowRight size={20} className="mr-2" />
                )}
              </>
            )}
            {selectedPlan?.id === currentPlan.id
              ? 'Plan Actual'
              : isDowngrade(selectedPlan!)
              ? 'Bajar de Plan'
              : 'Mejorar Plan'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionUpgrade;