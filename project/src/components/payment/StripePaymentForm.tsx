import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, AlertTriangle, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { SubscriptionPlan, SubscriptionTier } from '../../types/subscription';
import { useAuthStore } from '../../stores/authStore';
import { buildRedirectionState, getRedirectionPath } from '../../utils/redirectionUtils';

interface StripePaymentFormProps {
  plan: SubscriptionPlan;
  interval: 'month' | 'year';
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  plan,
  interval,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showLegalInfo, setShowLegalInfo] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    country: 'ES'
  });

  // Calculate price based on interval
  const price = interval === 'year' 
    ? Math.round(plan.price * 12 * 0.8) 
    : plan.price;
  
  // Calculate VAT (21% in Spain)
  const vatRate = 0.21;
  const vatAmount = Math.round(price * vatRate);
  const totalAmount = price + vatAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Stripe is properly configured
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_STRIPE_PUBLIC_KEY === 'pk_test_your_stripe_public_key') {
      setError('Stripe no está configurado correctamente. Por favor, contacta al administrador.');
      return;
    }
    
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones para continuar');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, this would:
      // 1. Create a payment intent or subscription on the server
      // 2. Use Stripe.js to collect and tokenize card details
      // 3. Confirm the payment with the token
      
      // For demo purposes, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      setSuccess(true);
      
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
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
      setIsLoading(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
    
    setCardDetails({ ...cardDetails, number: formattedValue });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 2) {
      setCardDetails({ ...cardDetails, expiry: value });
    } else {
      const month = value.slice(0, 2);
      const year = value.slice(2, 4);
      setCardDetails({ ...cardDetails, expiry: `${month}/${year}` });
    }
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardDetails({ ...cardDetails, cvc: value });
  };

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
            <h2 className="text-xl font-bold">Completar Pago</h2>
            <p className="text-gray-400 text-sm">Membresía {plan.name} - {interval === 'year' ? 'Anual' : 'Mensual'}</p>
          </div>
        </div>
        
        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center"
          >
            <Check size={20} className="text-green-500 mr-3" />
            <div>
              <h3 className="font-medium text-green-400">¡Pago completado con éxito!</h3>
              <p className="text-sm text-gray-300">Tu membresía ha sido activada correctamente.</p>
            </div>
          </motion.div>
        )}
        
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
        
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Summary */}
            <div className="p-4 bg-gray-800/50 rounded-lg mb-6">
              <h3 className="font-medium mb-3">Resumen del Pedido</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Membresía {plan.name} ({interval === 'year' ? 'Anual' : 'Mensual'})</span>
                  <span>{price}€</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>IVA (21%)</span>
                  <span>{vatAmount}€</span>
                </div>
                <div className="border-t border-gray-700 my-2 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{totalAmount}€</span>
                </div>
              </div>
            </div>
            
            {/* Card Details */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nombre en la tarjeta
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nombre completo"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Número de tarjeta
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={handleCardNumberChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CreditCard size={20} className="text-gray-500" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Fecha de expiración
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={handleExpiryChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="MM/YY"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  value={cardDetails.cvc}
                  onChange={handleCVCChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123"
                  required
                  maxLength={3}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                País
              </label>
              <select
                value={cardDetails.country}
                onChange={(e) => setCardDetails({ ...cardDetails, country: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="ES">España</option>
                <option value="US">Estados Unidos</option>
                <option value="MX">México</option>
                <option value="AR">Argentina</option>
                <option value="CO">Colombia</option>
                <option value="CL">Chile</option>
                <option value="PE">Perú</option>
                <option value="DE">Alemania</option>
                <option value="FR">Francia</option>
                <option value="GB">Reino Unido</option>
                <option value="IT">Italia</option>
              </select>
            </div>
            
            {/* Legal Information */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowLegalInfo(!showLegalInfo)}
                className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 mb-2"
              >
                {showLegalInfo ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                Información legal y fiscal
              </button>
              
              {showLegalInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-gray-800/50 rounded-lg mb-4 text-sm"
                >
                  <p className="mb-2">
                    <strong>Proveedor del servicio:</strong> CosmicBeats S.L.
                  </p>
                  <p className="mb-2">
                    <strong>NIF/CIF:</strong> B12345678
                  </p>
                  <p className="mb-2">
                    <strong>Dirección fiscal:</strong> Calle Ejemplo 123, 28001 Madrid, España
                  </p>
                  <p className="mb-2">
                    <strong>Procesador de pagos:</strong> Stripe Payments Europe, Ltd.
                  </p>
                  <p>
                    Recibirás una factura electrónica en tu correo electrónico después de cada pago.
                    Los pagos se procesan de forma segura a través de Stripe, cumpliendo con los estándares PCI DSS.
                  </p>
                </motion.div>
              )}
              
              <div className="flex items-start mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 mr-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  Acepto los <a href="/terms.html" target="_blank" className="text-indigo-400 hover:text-indigo-300">Términos y Condiciones</a>, 
                  la <a href="/privacy.html" target="_blank" className="text-indigo-400 hover:text-indigo-300">Política de Privacidad</a> y 
                  autorizo el procesamiento de mis datos personales y de pago para la gestión de mi suscripción.
                </label>
              </div>
            </div>
            
            {/* Secure Payment Notice */}
            <div className="flex items-center justify-center text-sm text-gray-400 mb-4">
              <Lock size={14} className="mr-1" />
              <span>Pago seguro con Stripe. Tus datos están protegidos.</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 glassmorphism-button px-4 py-2"
                disabled={isLoading}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="flex-1 glassmorphism-primary-button px-4 py-2 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <Lock size={16} className="mr-2" />
                )}
                Pagar {totalAmount}€
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StripePaymentForm;