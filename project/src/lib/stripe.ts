import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe with the public key from environment variables
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY && import.meta.env.VITE_STRIPE_PUBLIC_KEY !== 'pk_test_your_stripe_public_key' 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) 
  : null;

export async function createSubscription(priceId: string, userId: string) {
  try {
    const { data: { session_url }, error } = await supabase.functions.invoke('create-subscription', {
      body: { priceId, userId }
    });

    if (error) throw error;

    window.location.href = session_url;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Function to create a payment session for a subscription
export async function createSubscriptionSession(planId: string, interval: 'month' | 'year', userId: string) {
  try {
    // In a real implementation, this would call a Supabase Edge Function
    // that creates a Stripe Checkout Session for the subscription
    
    // For demo purposes, we'll just simulate a successful session creation
    console.log(`Creating subscription session for plan ${planId}, interval ${interval}, user ${userId}`);
    
    // Return a mock session URL
    return {
      sessionUrl: '#',
      success: true
    };
  } catch (error) {
    console.error('Error creating subscription session:', error);
    throw error;
  }
}

// Function to validate a payment method
export async function validatePaymentMethod(paymentMethodId: string) {
  try {
    // In a real implementation, this would call a Supabase Edge Function
    // that validates the payment method with Stripe
    
    // For demo purposes, we'll just simulate a successful validation
    console.log(`Validating payment method ${paymentMethodId}`);
    
    return {
      valid: true,
      message: 'Payment method validated successfully'
    };
  } catch (error) {
    console.error('Error validating payment method:', error);
    throw error;
  }
}

// Function to generate an invoice for a subscription
export async function generateInvoice(subscriptionId: string) {
  try {
    // In a real implementation, this would call a Supabase Edge Function
    // that generates an invoice for the subscription
    
    // For demo purposes, we'll just simulate a successful invoice generation
    console.log(`Generating invoice for subscription ${subscriptionId}`);
    
    return {
      invoiceUrl: '#',
      invoiceNumber: `INV-${Date.now().toString().slice(-8)}`,
      success: true
    };
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
}

export async function createPayment({
  amount,
  currency = 'usd',
  paymentType,
  metadata = {}
}: {
  amount: number;
  currency?: string;
  paymentType: 'ticket' | 'merchandise' | 'tip';
  metadata?: Record<string, any>;
}) {
  try {
    const { data: { clientSecret }, error } = await supabase.functions.invoke('create-payment', {
      body: { amount, currency, paymentType, metadata }
    });

    if (error) throw error;

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret);
    if (stripeError) throw stripeError;

    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}

export async function addPaymentMethod() {
  try {
    const { data: { setup_intent }, error } = await supabase.functions.invoke('create-setup-intent');

    if (error) throw error;

    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { error: stripeError } = await stripe.confirmCardSetup(setup_intent.client_secret);
    if (stripeError) throw stripeError;

    return true;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
}

export async function getPaymentMethods() {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
}

export async function createPaymentIntent({
  amount,
  currency = 'eur',
  paymentType,
  metadata = {}
}: {
  amount: number;
  currency?: string;
  paymentType: 'subscription' | 'ticket' | 'merchandise' | 'tip';
  metadata?: Record<string, any>;
}) {
  try {
    // In a real app, this would call a Supabase Edge Function
    // For demo, we'll simulate a successful payment intent creation
    console.log('Creating payment intent:', { amount, currency, paymentType, metadata });
    
    // Simulate API response
    const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2)}`;
    
    return { clientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function confirmPayment(clientSecret: string, paymentMethod: any) {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');
    
    // In a real app, this would call Stripe's confirmCardPayment API
    // For demo, we'll simulate a successful payment confirmation
    console.log('Confirming payment:', { clientSecret, paymentMethod });
    
    return { success: true };
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
}