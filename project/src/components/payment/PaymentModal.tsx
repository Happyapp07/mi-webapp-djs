import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionPlan } from '../../types/subscription';
import PaymentMethodSelector from './PaymentMethodSelector';
import StripeElements from '../subscription/StripeElements';
import PaymentSuccessModal from './PaymentSuccessModal';
import { useAuthStore } from '../../stores/authStore';
import { buildRedirectionState, getRedirectionPath } from '../../utils/redirectionUtils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  interval: 'month' | 'year';
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  plan,
  interval,
  onSuccess
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<'method_selection' | 'payment_form'>('method_selection');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay' | 'google_pay' | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const handleSelectMethod = (method: 'card' | 'paypal' | 'apple_pay' | 'google_pay') => {
    setPaymentMethod(method);
    setStep('payment_form');
  };
  
  const handlePaymentSuccess = () => {
    // Generate a random invoice number
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    
    // Show success modal briefly
    setShowSuccessModal(true);  

    // Wait a moment before redirecting
    setTimeout(() => {
      if (user) {
        // Build redirection state
        const redirectState = buildRedirectionState(
          user.userType as any,
          plan.id,
          {
            interval,
            userId: user.id
          }
        );
        
        // Get the appropriate redirection path
        const redirectPath = getRedirectionPath(redirectState);
        
        // Navigate to the appropriate path
        navigate(redirectPath, {
          state: redirectState
        });
      } else {
        // If no user, just call the success callback
        onSuccess();
      }
    }, 2000);
  };
  
  const handleClose = () => {
    // Reset state
    setStep('method_selection');
    setPaymentMethod(null);
    
    // Close modal
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <AnimatePresence mode="wait">
        {step === 'method_selection' && (
          <motion.div
            key="method_selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <PaymentMethodSelector
              onSelectMethod={handleSelectMethod}
              onCancel={handleClose}
            />
          </motion.div>
        )}
        
        {step === 'payment_form' && paymentMethod === 'card' && (
          <motion.div
            key="payment_form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <StripeElements
              plan={plan}
              interval={interval}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setStep('method_selection')}
            />
          </motion.div>
        )}
        
        {step === 'payment_form' && paymentMethod === 'paypal' && (
          <motion.div
            key="paypal_form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-6 rounded-xl max-w-md w-full relative overflow-hidden"
          >
            <div className="hologram-grid absolute inset-0 opacity-20"></div>
            <div className="scanner-effect"></div>
            
            <button
              onClick={() => setStep('method_selection')}
              className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-4">Pago con PayPal</h2>
              <p className="text-gray-300 mb-6">
                Serás redirigido a PayPal para completar el pago de forma segura.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('method_selection')}
                  className="flex-1 glassmorphism-button px-4 py-2"
                >
                  Cancelar
                </button>
                
                <button
                  className="flex-1 glassmorphism-button-primary px-4 py-2"
                >
                  <p className="text-sm text-gray-300">
                    Conectar múltiples cuentas mejora la seguridad de tu cuenta y facilita el acceso.
                    Debes mantener al menos un método de acceso activo.
                  </p>
                  Continuar a PayPal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={handleClose}
        plan={plan}
        interval={interval}
        invoiceNumber={`INV-${Date.now().toString().slice(-8)}`}
      />
    </div>
  );
};

export default PaymentModal;