import { create } from 'zustand';
import { loadStripe } from '@stripe/stripe-js';
import { SubscriptionPlan, SUBSCRIPTION_PLANS, SubscriptionTier } from '../types/subscription';
import { UserType } from '../types';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
  selectedPlan: SubscriptionPlan | null;
  currentSubscription?: {
    planId: string;
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    isTrialPeriod?: boolean;
    trialEndsAt?: Date;
  };
  fetchPlans: (userType: UserType) => Promise<void>;
  selectPlan: (planId: string) => void;
  subscribe: (planId: string, interval?: 'month' | 'year') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  checkFeatureAccess: (feature: string) => boolean;
  getRemainingQuota: (feature: 'planets' | 'competitions' | 'promotedEvents' | 'streamingSessions') => number;
  canAccessPremiumFeature: (feature: string) => boolean;
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Premium features by subscription tier
const PREMIUM_FEATURES = {
  [SubscriptionTier.SUPPORTER]: [
    'vote_partygoers',
    'social_rankings',
    'party_photos',
    'match_chat',
    'supporter_card'
  ],
  [SubscriptionTier.HUNTER]: [
    'vip_access',
    'skip_lines',
    'share_privileges',
    'exclusive_events',
    'priority_card'
  ],
  [SubscriptionTier.EXPERT]: [
    'compete',
    'video_upload',
    'segmented_rankings',
    'pro_card',
    'competition_group'
  ],
  [SubscriptionTier.PRO]: [
    'follower_analytics',
    'playlist_insights',
    'geo_data',
    'voting_analytics',
    'expert_card'
  ],
  [SubscriptionTier.RECRUIT]: [
    'crowdparty',
    'customer_analytics',
    'promoted_events',
    'premium_club_card'
  ],
  [SubscriptionTier.STADIUM]: [
    'dj_competitions',
    'live_streaming',
    'premium_badge',
    'realtime_analytics',
    'promo_codes'
  ]
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plans: [],
  isLoading: false,
  error: null,
  selectedPlan: null,
  currentSubscription: undefined,

  fetchPlans: async (userType: UserType) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get base plans
      const userTypeKey = userType.toLowerCase();
      const basePlans = SUBSCRIPTION_PLANS[userTypeKey] || [];
      
      // Add season pricing with 20% discount for annual plans
      const plansWithSeasonPricing = basePlans.map(plan => {
        if (plan.price === 0) return plan;
        
        const seasonPrice = Math.round(plan.price * 12 * 0.8); // 12 months with 20% off
        return {
          ...plan,
          seasonPrice,
          seasonSavings: Math.round(plan.price * 12 * 0.2) // Amount saved
        };
      });
      
      set({ 
        plans: plansWithSeasonPricing,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch plans',
        isLoading: false 
      });
    }
  },

  selectPlan: (planId: string) => {
    const { plans } = get();
    const plan = plans.find(p => p.id === planId);
    set({ selectedPlan: plan || null });
  },

  subscribe: async (planId: string, interval: 'month' | 'year' = 'month') => {
    try {
      set({ isLoading: true, error: null });
      
      const { plans } = get();
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Determine trial eligibility before processing payment
      const isEligibleForTrial = !localStorage.getItem('has_used_trial');
      const shouldStartTrial = isEligibleForTrial && plan.price > 0;

      const stripe = await stripePromise;

      // Check if Stripe is properly configured
      if (!stripe || !import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
        console.warn('Stripe not configured. Using mock implementation.');

        // For demo, simulate successful subscription
        set({
          currentSubscription: {
            planId: plan.id,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + (interval === 'year' ? 12 : 1) * 30 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false,
            isTrialPeriod: shouldStartTrial,
            trialEndsAt: shouldStartTrial ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : undefined
          },
          isLoading: false
        });

        // Mark trial as used
        if (shouldStartTrial) {
          localStorage.setItem('has_used_trial', 'true');
        }

        return;
      }

      // In a real implementation, this would redirect to Stripe Checkout
      // or use Stripe Elements to collect payment information

      // For now, we'll use the same mock implementation
      set({
        currentSubscription: {
          planId: plan.id,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + (interval === 'year' ? 12 : 1) * 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
          isTrialPeriod: shouldStartTrial,
          trialEndsAt: shouldStartTrial ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) : undefined
        },
        isLoading: false
      });

      // Mark trial as used
      if (shouldStartTrial) {
        localStorage.setItem('has_used_trial', 'true');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to process subscription',
        isLoading: false 
      });
    }
  },

  cancelSubscription: async () => {
    try {
      set({ isLoading: true, error: null });
      
      set(state => ({
        currentSubscription: state.currentSubscription ? {
          ...state.currentSubscription,
          cancelAtPeriodEnd: true
        } : undefined,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel subscription',
        isLoading: false 
      });
    }
  },

  checkFeatureAccess: (feature: string) => {
    const { currentSubscription, plans } = get();
    if (!currentSubscription) return false;

    const currentPlan = plans.find(p => p.id === currentSubscription.planId);
    if (!currentPlan) return false;

    return PREMIUM_FEATURES[currentPlan.tier]?.includes(feature) || false;
  },

  getRemainingQuota: (feature: 'planets' | 'competitions' | 'promotedEvents' | 'streamingSessions') => {
    const { currentSubscription, plans } = get();
    if (!currentSubscription) return 0;

    const currentPlan = plans.find(p => p.id === currentSubscription.planId);
    if (!currentPlan) return 0;

    switch (feature) {
      case 'planets':
        return currentPlan.maxPlanets || 0;
      case 'competitions':
        return currentPlan.maxCompetitions || 0;
      case 'promotedEvents':
        return currentPlan.maxPromotedEvents || 0;
      case 'streamingSessions':
        return currentPlan.maxStreamingSessions || 0;
      default:
        return 0;
    }
  },

  canAccessPremiumFeature: (feature: string) => {
    const { currentSubscription, plans } = get();
    if (!currentSubscription || currentSubscription.status !== 'active') {
      return false;
    }

    const currentPlan = plans.find(p => p.id === currentSubscription.planId);
    if (!currentPlan) return false;

    // Free tier features
    const freeTierFeatures = {
      partygoer: ['geo_voting', 'public_rankings', 'basic_card'],
      dj: ['event_photos', 'dj_voting', 'planet_rankings', 'basic_card'],
      club: ['club_profile', 'map_listing', 'provincial_rankings', 'basic_card']
    };

    // Check if feature is available in free tier
    const userType = currentPlan.userType as keyof typeof freeTierFeatures;
    if (freeTierFeatures[userType]?.includes(feature)) {
      return true;
    }

    // Check if feature is available in current subscription tier
    return PREMIUM_FEATURES[currentPlan.tier]?.includes(feature) || false;
  }
}));