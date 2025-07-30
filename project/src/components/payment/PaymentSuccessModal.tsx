import React from 'react';
import { motion } from 'framer-motion';
import { Check, Download, X, Calendar, CreditCard } from 'lucide-react';
import Confetti from 'react-confetti';
import useMeasure from 'react-use-measure';
import { SubscriptionPlan } from '../../types/subscription';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  interval: 'month' | 'year';
  invoiceNumber: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  plan,
  interval,
  invoiceNumber
}) => {
  const [ref, bounds] = useMeasure();
  
  if (!isOpen) return null;
  
  // Calculate price based on interval
  const price = interval === 'year' 
    ? Math.round(plan.price * 12 * 0.8) 
    : plan.price;
  
  // Calculate VAT (21% in Spain)
  const vatRate = 0.21;
  const vatAmount = Math.round(price * vatRate);
  const totalAmount = price + vatAmount;
  
  // Calculate next billing date
  const nextBillingDate = new Date();
  if (interval === 'year') {
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  } else {
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" ref={ref}>
      <Confetti
        width={bounds.width}
        height={bounds.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.15}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="glass-card p-6 rounded-xl max-w-md w-full relative overflow-hidden"
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
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">¡Pago Completado!</h2>
            <p className="text-gray-300 text-center">
              Tu membresía {plan.name} ha sido activada correctamente.
            </p>
          </div>
          
          <div className="p-4 bg-gray-800/50 rounded-lg mb-6">
            <h3 className="font-medium mb-3">Detalles del Pago</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Membresía:</span>
                <span>{plan.name} ({interval === 'year' ? 'Anual' : 'Mensual'})</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal:</span>
                <span>{price}€</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">IVA (21%):</span>
                <span>{vatAmount}€</span>
              </div>
              
              <div className="flex justify-between font-medium border-t border-gray-700 pt-2 mt-2">
                <span>Total:</span>
                <span>{totalAmount}€</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <CreditCard size={18} className="text-indigo-400 mr-2" />
              <span className="text-sm">Factura #{invoiceNumber}</span>
              <button className="ml-auto p-1 hover:bg-gray-700 rounded transition-colors">
                <Download size={16} className="text-indigo-400" />
              </button>
            </div>
            
            <div className="flex items-center">
              <Calendar size={18} className="text-indigo-400 mr-2" />
              <span className="text-sm">
                Próximo pago: {nextBillingDate.toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full glassmorphism-primary-button px-4 py-2"
          >
            Continuar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessModal;