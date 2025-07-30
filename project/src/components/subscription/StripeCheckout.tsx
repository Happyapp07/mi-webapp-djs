import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Check, X, AlertTriangle, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { SubscriptionPlan } from '../../types/subscription';
import { buildRedirectionState, getRedirectionPath } from '../../utils/redirectionUtils';

interface StripeCheckoutProps {
  plan: SubscriptionPlan;
  interval: 'month' | 'year';
  onSuccess: () => void;
  onCancel: () => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
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
  
  // Calculate price with discount for annual plans
  const price = interval === 'year' 
    ? Math.round(plan.price * 12 * 0.8) 
    : plan.price;
  
  // Calculate tax (VAT) - in a real app, this would be based on user's country
  const taxRate = 0.21; // 21% VAT for example
  const taxAmount = Math.round(price * taxRate);
  const totalAmount = price + taxAmount;
  
  // For demo purposes, we'll simulate a successful payment
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
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
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment processing failed');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto">
      <div className="glass-card p-6 rounded-xl relative overflow-hidden">
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
              <h2 className="text-xl font-bold">Checkout</h2>
              <p className="text-gray-400 text-sm">Complete your subscription payment</p>
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
              <div>
                <h3 className="font-medium text-green-400">Payment Successful</h3>
                <p className="text-sm text-gray-300">Your subscription has been activated.</p>
              </div>
            </motion.div>
          )}
          
          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>{plan.name} ({interval === 'year' ? 'Annual' : 'Monthly'})</span>
                <span>{price}€</span>
              </div>
              
              {interval === 'year' && (
                <div className="flex justify-between items-center text-green-400 text-sm">
                  <span>Annual discount (20%)</span>
                  <span>-{Math.round(plan.price * 12 * 0.2)}€</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>VAT (21%)</span>
                <span>{taxAmount}€</span>
              </div>
              
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>{totalAmount}€</span>
                </div>
                
                <div className="text-xs text-gray-400 mt-1">
                  {interval === 'year' 
                    ? 'Billed annually' 
                    : `Billed monthly (${plan.price}€/month)`}
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Form */}
          {!success && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Payment Method</h3>
              
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="card-payment"
                      name="payment-method"
                      className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                      checked
                      readOnly
                    />
                    <label htmlFor="card-payment" className="ml-2 text-sm font-medium">
                      Credit / Debit Card
                    </label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="w-8 h-5 bg-gray-700 rounded"></div>
                    <div className="w-8 h-5 bg-gray-700 rounded"></div>
                    <div className="w-8 h-5 bg-gray-700 rounded"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="4242 4242 4242 4242"
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Lock size={16} className="text-gray-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="MM/YY"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        CVC
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="123"
                          disabled={isLoading}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          <Lock size={16} className="text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                  Acepto los{" "}
                  <a 
                    href="/terms.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Términos y Condiciones
                  </a>
                  ,{" "}la{" "}
                  <a 
                    href="/privacy.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Política de Privacidad
                  </a>
                  {" "}y{" "}
                  autorizo el procesamiento de mis datos personales y de pago para la gestión de mi suscripción.
                </label>
              </div>
            </div>
          )}
          
          {/* Security Notice */}
          <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30 flex items-start mb-6">
            <Shield size={20} className="text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="mb-1">Your payment is processed securely by Stripe.</p>
              <p>We never store your full card details on our servers.</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 glassmorphism-button px-4 py-2"
              disabled={isLoading || success}
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
            
            {!success && (
              <button
                onClick={handlePayment}
                className="flex-1 glassmorphism-primary-button px-4 py-2 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <CreditCard size={16} className="mr-2" />
                    Pay {totalAmount}€
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;