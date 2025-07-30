import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Check, X, AlertTriangle, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { SubscriptionPlan } from '../../types/subscription';
import { useAuthStore } from '../../stores/authStore';
import { createPaymentIntent } from '../../lib/stripe';

interface StripeElementsProps {
  plan: SubscriptionPlan;
  interval: 'month' | 'year';
  onSuccess: () => void;
  onCancel: () => void;
}

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY && import.meta.env.VITE_STRIPE_PUBLIC_KEY !== 'pk_test_your_stripe_public_key' 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) 
  : null;

const CheckoutForm: React.FC<{
  plan: SubscriptionPlan;
  interval: 'month' | 'year';
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ plan, interval, onSuccess, onCancel }) => {
  const { user } = useAuthStore();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // Calculate price with discount for annual plans
  const price = interval === 'year' 
    ? Math.round(plan.price * 12 * 0.8) 
    : plan.price;
  
  // Calculate tax (VAT) - in a real app, this would be based on user's country
  const taxRate = 0.21; // 21% VAT for example
  const taxAmount = Math.round(price * taxRate);
  const totalAmount = price + taxAmount;
  
  useEffect(() => {
    // Create a payment intent when the component mounts
    const createIntent = async () => {
      try {
        if (!user) return;
        
        const { clientSecret: secret } = await createPaymentIntent({
          amount: totalAmount,
          currency: 'eur',
          paymentType: 'subscription',
          metadata: {
            plan_id: plan.id,
            interval,
            user_id: user.id
          }
        });
        
        setClientSecret(secret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setError('Failed to initialize payment. Please try again.');
      }
    };
    
    createIntent();
  }, [plan.id, interval, totalAmount, user]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    if (!acceptTerms) {
      setError('You must accept the terms and conditions to continue');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!clientSecret) {
        throw new Error('Payment not initialized');
      }
      
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.username || '',
            email: user?.email || '',
          },
        },
      });
      
      if (stripeError) {
        throw new Error(stripeError.message);
      }
      
      if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment processing failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      
      {/* Card Element */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
        
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Card Details
          </label>
          <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#FFFFFF',
                    '::placeholder': {
                      color: '#9CA3AF',
                    },
                  },
                  invalid: {
                    color: '#EF4444',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div className="flex items-start mb-4">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
            disabled={isLoading}
          />
        </div>
        <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
          I accept the{" "}
          <a href="/terms.html" className="text-indigo-400 hover:text-indigo-300 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy.html" className="text-indigo-400 hover:text-indigo-300 underline">
            Privacy Policy
          </a>.
        </label>
      </div>
      
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
          type="button"
          onClick={onCancel}
          className="flex-1 glassmorphism-button px-4 py-2"
          disabled={isLoading || success}
        >
          <X size={16} className="mr-2" />
          Cancel
        </button>
        
        {!success && (
          <button
            type="submit"
            className="flex-1 glassmorphism-primary-button px-4 py-2 flex items-center justify-center"
            disabled={isLoading || !stripe || !elements}
          >
            {isLoading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <Lock size={16} className="mr-2" />
                Pay {totalAmount}€
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};

const StripeElements: React.FC<StripeElementsProps> = (props) => {
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
            <h2 className="text-xl font-bold">Secure Checkout</h2>
            <p className="text-gray-400 text-sm">Complete your subscription payment</p>
          </div>
        </div>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm {...props} />
        </Elements>
      </div>
    </div>
  );
};

export default StripeElements;