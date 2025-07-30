import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowRight, AlertCircle } from 'lucide-react';

interface PaymentMethodSelectorProps {
  onSelectMethod: (method: 'card' | 'paypal' | 'apple_pay' | 'google_pay') => void;
  onCancel: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSelectMethod,
  onCancel
}) => {
  return (
    <div className="glass-card p-6 rounded-xl max-w-md w-full relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            <CreditCard size={24} className="text-indigo-400 relative z-10" />
            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Seleccionar Método de Pago</h2>
            <p className="text-gray-400 text-sm">Elige cómo quieres realizar tu pago</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelectMethod('card')}
            className="w-full p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                <CreditCard size={20} className="text-indigo-400" />
              </div>
              <div>
                <div className="font-medium">Tarjeta de Crédito/Débito</div>
                <div className="text-xs text-gray-400">Visa, Mastercard, American Express</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-indigo-400" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelectMethod('paypal')}
            className="w-full p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <span className="text-blue-400 font-bold">P</span>
              </div>
              <div>
                <div className="font-medium">PayPal</div>
                <div className="text-xs text-gray-400">Pago rápido y seguro</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-indigo-400" />
          </motion.button>
          
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center opacity-50 cursor-not-allowed">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <span className="text-gray-400 font-bold">A</span>
              </div>
              <div>
                <div className="font-medium">Apple Pay</div>
                <div className="text-xs text-gray-400">Próximamente</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex items-center opacity-50 cursor-not-allowed">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <span className="text-gray-400 font-bold">G</span>
              </div>
              <div>
                <div className="font-medium">Google Pay</div>
                <div className="text-xs text-gray-400">Próximamente</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <AlertCircle size={14} className="mr-2 text-indigo-400" />
          <span>Todos los pagos se procesan de forma segura a través de Stripe</span>
        </div>
        
        <button
          onClick={onCancel}
          className="w-full glassmorphism-button px-4 py-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;