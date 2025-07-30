import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import Stripe from 'npm:stripe@14.12.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionChange(subscription);
        break;

      case 'payment_intent.succeeded':
        const payment = event.data.object;
        await handlePaymentSuccess(payment);
        break;

      // Add more event handlers as needed
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { status: 400 }
    );
  }
});

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      stripe_subscription_id: subscription.id,
      user_id: subscription.metadata.user_id,
      tier: subscription.metadata.tier,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date()
    });

  if (error) {
    throw new Error(`Error updating subscription: ${error.message}`);
  }
}

async function handlePaymentSuccess(payment: Stripe.PaymentIntent) {
  const { error } = await supabase
    .from('payments')
    .insert({
      stripe_payment_id: payment.id,
      user_id: payment.metadata.user_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      payment_type: payment.metadata.payment_type,
      metadata: payment.metadata
    });

  if (error) {
    throw new Error(`Error recording payment: ${error.message}`);
  }
}