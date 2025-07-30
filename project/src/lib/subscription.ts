import { supabase } from './supabase';
import { createSubscriptionSession } from './stripe';
import { SubscriptionTier } from '../types/subscription';

export async function getCurrentSubscription() {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

export async function subscribe(tier: SubscriptionTier, interval: 'month' | 'year' = 'month') {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Check if Supabase is configured
    const isConfigured = import.meta.env.VITE_SUPABASE_URL && 
                         import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-ref.supabase.co' &&
                         import.meta.env.VITE_SUPABASE_ANON_KEY && 
                         import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-actual-anon-key-here';
    
    if (!isConfigured) {
      console.warn('Supabase not configured. Using mock implementation.');
      
      // Return a mock subscription object
      return {
        id: `sub_${Date.now()}`,
        tier,
        interval,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + (interval === 'year' ? 12 : 1) * 30 * 24 * 60 * 60 * 1000)
      };
    }

    // Get the price ID for the selected tier and interval
    const { data: prices, error: pricesError } = await supabase
      .from('stripe_prices')
      .select('stripe_price_id')
      .eq('metadata->tier', tier)
      .eq('interval', interval)
      .eq('active', true)
      .single();
    
    if (pricesError) {
      console.error('Error fetching price:', pricesError);
      throw new Error('Failed to find subscription plan');
    }
    
    // Create a subscription session
    const { sessionUrl } = await createSubscriptionSession(prices.stripe_price_id, interval, user.id);
    
    // Redirect to the checkout page
    window.location.href = sessionUrl;
    
    // Return a mock subscription object
    return {
      id: `sub_${Date.now()}`,
      tier,
      interval,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + (interval === 'year' ? 12 : 1) * 30 * 24 * 60 * 60 * 1000)
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function cancelSubscription() {
  try {
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .single();

    if (fetchError) throw fetchError;
    if (!subscription) throw new Error('No active subscription found');

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('id', subscription.id);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export async function checkFeatureAccess(feature: string): Promise<boolean> {
  try {
    const subscription = await getCurrentSubscription();
    if (!subscription || subscription.status !== 'active') return false;

    // Get feature access based on subscription tier
    const { data: features, error } = await supabase
      .from('subscription_features')
      .select('*')
      .eq('tier', subscription.tier)
      .contains('features', [feature]);

    if (error) throw error;
    return features.length > 0;
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}

export async function getRemainingQuota(feature: string): Promise<number> {
  try {
    const subscription = await getCurrentSubscription();
    if (!subscription || subscription.status !== 'active') return 0;

    // Get quota limits and usage
    const { data: quota, error: quotaError } = await supabase
      .from('subscription_quotas')
      .select('*')
      .eq('tier', subscription.tier)
      .eq('feature', feature)
      .single();

    if (quotaError) throw quotaError;

    const { data: usage, error: usageError } = await supabase
      .from('feature_usage')
      .select('count')
      .eq('subscription_id', subscription.id)
      .eq('feature', feature)
      .single();

    if (usageError && usageError.code !== 'PGRST116') throw usageError;

    return quota.limit - (usage?.count || 0);
  } catch (error) {
    console.error('Error checking quota:', error);
    return 0;
  }
}