import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { 
  Referral, 
  ReferralStatus, 
  ReferralStats, 
  REFERRAL_REWARDS, 
  REFERRAL_BADGES, 
  ReferralActionType, 
  ReferralAction,
  REFERRAL_ACTION_REWARDS,
  WEEKLY_REFERRAL_LIMIT,
  REFERRAL_EXPIRATION_DAYS
} from '../types/referral';
import { useAuthStore } from './authStore';

interface ReferralState {
  referrals: Referral[];
  userReferralCode: string | null;
  stats: ReferralStats | null;
  topReferrers: {
    weekly: { userId: string; count: number }[];
    monthly: { userId: string; count: number }[];
  };
  isLoading: boolean;
  error: string | null;
  generateReferralCode: () => Promise<string>;
  getReferralStats: (userId: string) => Promise<ReferralStats>;
  applyReferralCode: (code: string) => Promise<void>;
  validateReferral: (referralId: string) => Promise<void>;
  getTopReferrers: (period: 'weekly' | 'monthly') => Promise<{ userId: string; count: number }[]>;
  getSharingLink: (platform?: 'instagram' | 'tiktok' | 'whatsapp' | 'twitter' | 'telegram') => string;
  getUserReferralCode: () => Promise<string>;
  checkReferralMilestones: (userId: string) => Promise<void>;
  completeReferralAction: (referralId: string, actionType: ReferralActionType) => Promise<void>;
  getReferralDetails: (referralId: string) => Promise<Referral | null>;
  getWeeklyReferralsCount: (userId: string) => Promise<number>;
  checkReferralExpiration: () => Promise<void>;
  awardReferralBadge: (userId: string, badgeId: string) => Promise<void>;
  getReferralBadges: (userId: string) => Promise<string[]>;
}

export const useReferralStore = create<ReferralState>((set, get) => ({
  referrals: [],
  userReferralCode: null,
  stats: null,
  topReferrers: {
    weekly: [],
    monthly: []
  },
  isLoading: false,
  error: null,

  generateReferralCode: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      // Generate a unique code
      const code = nanoid(8);
      
      // Store the code
      set({ userReferralCode: code, isLoading: false });
      
      // In a real app, this would be stored in the database
      localStorage.setItem(`referral_code_${user.id}`, code);
      
      return code;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate referral code',
        isLoading: false 
      });
      throw error;
    }
  },

  getReferralStats: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // For real user testing, start with empty referral stats
      
      // Get user's referrals
      const { referrals } = get();
      const userReferrals = referrals.filter(r => r.referrerId === userId);
      
      // Count valid and pending referrals
      const validReferrals = userReferrals.filter(r => r.status === ReferralStatus.VALID).length;
      const pendingReferrals = userReferrals.filter(r => r.status === ReferralStatus.PENDING).length;
      
      // Calculate total beatcoins earned
      const totalBeatcoins = userReferrals
        .filter(r => r.status === ReferralStatus.VALID)
        .reduce((sum, r) => {
          const baseReward = r.beatcoinsRewarded || 0;
          const actionRewards = (r.actions || [])
            .filter(a => a.completed)
            .reduce((sum, a) => sum + (a.beatcoinsRewarded || 0), 0);
          return sum + baseReward + actionRewards;
        }, 0);
      
      // Get user type for milestones
      const { user } = useAuthStore.getState();
      const userType = user?.userType.toLowerCase() || 'partygoer';
      
      // Get milestones for user type
      const rewardConfig = REFERRAL_REWARDS[userType as keyof typeof REFERRAL_REWARDS] || REFERRAL_REWARDS.partygoer;
      
      // Mark completed milestones
      const milestones = rewardConfig.milestones.map(milestone => ({
        ...milestone,
        isCompleted: validReferrals >= milestone.count
      }));
      
      // Find next milestone
      const nextMilestone = milestones.find(m => !m.isCompleted);
      
      // Get weekly referrals count
      const weeklyReferrals = await get().getWeeklyReferralsCount(userId);
      
      // Get referral details
      const referralDetails = userReferrals.map(referral => {
        // Calculate days remaining
        const createdDate = new Date(referral.createdAt);
        const expirationDate = new Date(createdDate);
        expirationDate.setDate(expirationDate.getDate() + REFERRAL_EXPIRATION_DAYS);
        
        const now = new Date();
        const timeRemaining = Math.max(0, Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        
        return {
          id: referral.id,
          referredUsername: referral.referredId,
          referredAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${referral.referredId}`,
          status: referral.status,
          createdAt: referral.createdAt,
          completedAt: referral.completedAt,
          beatcoinsEarned: (referral.beatcoinsRewarded || 0) + 
            ((referral.actions || [])
              .filter(a => a.completed)
              .reduce((sum, a) => sum + (a.beatcoinsRewarded || 0), 0)),
          actions: (referral.actions || []).map(action => ({
            type: action.type,
            completed: action.completed,
            beatcoinsRewarded: action.beatcoinsRewarded
          })),
          timeRemaining
        };
      });
      
      const stats: ReferralStats = {
        totalReferrals: userReferrals.length,
        validReferrals,
        pendingReferrals,
        totalBeatcoinsEarned: totalBeatcoins,
        milestones,
        nextMilestone,
        weeklyReferrals,
        weeklyReferralsLimit: WEEKLY_REFERRAL_LIMIT,
        referralDetails
      };
      
      set({ stats, isLoading: false });
      return stats;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get referral stats',
        isLoading: false 
      });
      throw error;
    }
  },

  applyReferralCode: async (code: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      // Check if code exists
      // In a real app, this would check against a database
      // For demo, we'll simulate this
      const referrerId = Object.keys(localStorage)
        .filter(key => key.startsWith('referral_code_'))
        .find(key => localStorage.getItem(key) === code);
      
      if (!referrerId) {
        throw new Error('Invalid referral code');
      }
      
      const actualReferrerId = referrerId.replace('referral_code_', '');
      
      // Check if user is trying to refer themselves
      if (actualReferrerId === user.id) {
        throw new Error('You cannot refer yourself');
      }
      
      // Check weekly referral limit for referrer
      const weeklyCount = await get().getWeeklyReferralsCount(actualReferrerId);
      if (weeklyCount >= WEEKLY_REFERRAL_LIMIT) {
        throw new Error('Referrer has reached their weekly limit');
      }
      
      // Create a new referral
      const referral: Referral = {
        id: `ref_${Date.now()}`,
        referrerId: actualReferrerId,
        referredId: user.id,
        code,
        status: ReferralStatus.PENDING,
        createdAt: new Date(),
        actions: [
          {
            id: `action_profile_${Date.now()}`,
            referralId: `ref_${Date.now()}`,
            type: ReferralActionType.PROFILE_COMPLETION,
            completed: false,
            dualReward: true
          },
          {
            id: `action_scan_${Date.now()}`,
            referralId: `ref_${Date.now()}`,
            type: ReferralActionType.SCAN_QR,
            completed: false,
            dualReward: true
          },
          {
            id: `action_vote_${Date.now()}`,
            referralId: `ref_${Date.now()}`,
            type: ReferralActionType.VOTE,
            completed: false,
            dualReward: true
          },
          {
            id: `action_match_${Date.now()}`,
            referralId: `ref_${Date.now()}`,
            type: ReferralActionType.MATCH,
            completed: false,
            dualReward: true
          }
        ]
      };
      
      // If user is a DJ, add upload session action
      if (user.userType === 'dj') {
        referral.actions?.push({
          id: `action_upload_${Date.now()}`,
          referralId: `ref_${Date.now()}`,
          type: ReferralActionType.UPLOAD_SESSION,
          completed: false,
          dualReward: true
        });
      }
      
      // Add to referrals
      set(state => ({
        referrals: [...state.referrals, referral],
        isLoading: false
      }));
      
      // In a real app, this would be stored in the database
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to apply referral code',
        isLoading: false 
      });
      throw error;
    }
  },

  validateReferral: async (referralId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      // Find the referral
      const { referrals } = get();
      const referralIndex = referrals.findIndex(r => r.id === referralId);
      
      if (referralIndex === -1) {
        throw new Error('Referral not found');
      }
      
      const referral = referrals[referralIndex];
      
      // Check if user is the referrer
      if (referral.referrerId !== user.id) {
        throw new Error('You are not the referrer');
      }
      
      // Check if referral is already validated
      if (referral.status !== ReferralStatus.PENDING) {
        throw new Error('Referral is already processed');
      }
      
      // Get user type for reward calculation
      const userType = user.userType.toLowerCase();
      const rewardConfig = REFERRAL_REWARDS[userType as keyof typeof REFERRAL_REWARDS] || REFERRAL_REWARDS.partygoer;
      
      // Calculate reward
      const beatcoinsRewarded = rewardConfig.beatcoinsPerReferral;
      
      // Update referral
      const updatedReferral: Referral = {
        ...referral,
        status: ReferralStatus.VALID,
        completedAt: new Date(),
        beatcoinsRewarded
      };
      
      // Update referrals
      const updatedReferrals = [...referrals];
      updatedReferrals[referralIndex] = updatedReferral;
      
      set({ 
        referrals: updatedReferrals,
        isLoading: false 
      });
      
      // In a real app, this would update the database and add beatcoins to the user
      // For demo, we'll update the user's beatcoins directly
      const { updateProfile } = useAuthStore.getState();
      if (updateProfile) {
        updateProfile({
          beatcoins: (user.beatcoins || 0) + beatcoinsRewarded
        });
      }
      
      // Check for milestones
      await get().checkReferralMilestones(user.id);
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to validate referral',
        isLoading: false 
      });
      throw error;
    }
  },

  getTopReferrers: async (period: 'weekly' | 'monthly') => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would fetch from an API
      // For demo, we'll use mock data
      const mockTopReferrers = [
        { userId: 'user_1', count: 15 },
        { userId: 'user_2', count: 12 },
        { userId: 'user_3', count: 10 },
        { userId: 'user_4', count: 8 },
        { userId: 'user_5', count: 7 }
      ];
      
      set({ 
        topReferrers: {
          ...get().topReferrers,
          [period]: mockTopReferrers
        },
        isLoading: false 
      });
      
      return mockTopReferrers;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get top referrers',
        isLoading: false 
      });
      throw error;
    }
  },

  getSharingLink: (platform?: 'instagram' | 'tiktok' | 'whatsapp' | 'twitter' | 'telegram') => {
    const { userReferralCode } = get();
    if (!userReferralCode) return '';
    
    const baseUrl = window.location.origin;
    const referralUrl = `${baseUrl}/register?ref=${userReferralCode}`;
    
    // Create platform-specific sharing links
    switch (platform) {
      case 'instagram':
        // Instagram doesn't support direct sharing links, so we just return the URL to copy
        return referralUrl;
      case 'tiktok':
        // TikTok doesn't have a direct sharing API, so we just return the URL to copy
        return referralUrl;
      case 'whatsapp':
        return `https://wa.me/?text=¡Únete a CosmicBeats con mi código de invitación! ${referralUrl}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=¡Únete a CosmicBeats con mi código de invitación!&url=${encodeURIComponent(referralUrl)}`;
      case 'telegram':
        return `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=¡Únete a CosmicBeats con mi código de invitación!`;
      default:
        return referralUrl;
    }
  },

  getUserReferralCode: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      // Check if we already have a code
      const { userReferralCode } = get();
      if (userReferralCode) {
        set({ isLoading: false });
        return userReferralCode;
      }
      
      // Check localStorage for existing code
      const storedCode = localStorage.getItem(`referral_code_${user.id}`);
      if (storedCode) {
        set({ userReferralCode: storedCode, isLoading: false });
        return storedCode;
      }
      
      // Generate a new code
      return await get().generateReferralCode();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get referral code',
        isLoading: false 
      });
      throw error;
    }
  },

  checkReferralMilestones: async (userId: string) => {
    try {
      // Get user's stats
      const stats = await get().getReferralStats(userId);
      
      // Get user type
      const { user } = useAuthStore.getState();
      if (!user) return;
      
      const userType = user.userType.toLowerCase();
      
      // Check for completed milestones
      const completedMilestones = stats.milestones.filter(m => m.isCompleted);
      
      // Process rewards for completed milestones
      // In a real app, this would grant the actual rewards
      // For demo, we'll just log them
      completedMilestones.forEach(milestone => {
        console.log(`User ${userId} earned milestone reward:`, milestone.reward);
      });
      
      // Check for badges
      REFERRAL_BADGES.forEach(badge => {
        if (stats.validReferrals >= badge.requirement) {
          // Award the badge
          get().awardReferralBadge(userId, badge.id);
        }
      });
    } catch (error) {
      console.error('Failed to check referral milestones:', error);
    }
  },

  completeReferralAction: async (referralId: string, actionType: ReferralActionType) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find the referral
      const { referrals } = get();
      const referralIndex = referrals.findIndex(r => r.id === referralId);
      
      if (referralIndex === -1) {
        throw new Error('Referral not found');
      }
      
      const referral = referrals[referralIndex];
      
      // Find the action
      const actionIndex = referral.actions?.findIndex(a => a.type === actionType) ?? -1;
      
      if (actionIndex === -1 || !referral.actions) {
        throw new Error('Action not found');
      }
      
      // Check if action is already completed
      if (referral.actions[actionIndex].completed) {
        throw new Error('Action already completed');
      }
      
      // Get reward amount
      const rewardAmount = REFERRAL_ACTION_REWARDS[actionType];
      
      // Update action
      const updatedAction: ReferralAction = {
        ...referral.actions[actionIndex],
        completed: true,
        completedAt: new Date(),
        beatcoinsRewarded: rewardAmount,
        dualReward: true
      };
      
      // Update referral
      const updatedActions = [...referral.actions];
      updatedActions[actionIndex] = updatedAction;
      
      const updatedReferral: Referral = {
        ...referral,
        actions: updatedActions
      };
      
      // Update referrals
      const updatedReferrals = [...referrals];
      updatedReferrals[referralIndex] = updatedReferral;
      
      set({ 
        referrals: updatedReferrals,
        isLoading: false 
      });
      
      // In a real app, this would update the database and add beatcoins to both users
      // For demo, we'll update the referrer's beatcoins directly
      const { user, updateProfile } = useAuthStore.getState();
      if (user && updateProfile && user.id === referral.referrerId) {
        updateProfile({
          beatcoins: (user.beatcoins || 0) + rewardAmount
        });
      }
      
      // We would also update the referred user's beatcoins
      // But for demo, we'll just log it
      console.log(`Referred user ${referral.referredId} earned ${rewardAmount} beatcoins`);
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to complete referral action',
        isLoading: false 
      });
      throw error;
    }
  },

  getReferralDetails: async (referralId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find the referral
      const { referrals } = get();
      const referral = referrals.find(r => r.id === referralId);
      
      set({ isLoading: false });
      
      return referral || null;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get referral details',
        isLoading: false 
      });
      throw error;
    }
  },

  getWeeklyReferralsCount: async (userId: string) => {
    try {
      // Get user's referrals
      const { referrals } = get();
      
      // Get current week's start (Monday)
      const now = new Date();
      const dayOfWeek = now.getDay() || 7; // Convert Sunday (0) to 7
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - dayOfWeek + 1); // Monday
      weekStart.setHours(0, 0, 0, 0);
      
      // Count referrals created this week
      const weeklyReferrals = referrals.filter(r => 
        r.referrerId === userId && 
        r.createdAt >= weekStart
      ).length;
      
      return weeklyReferrals;
    } catch (error) {
      console.error('Failed to get weekly referrals count:', error);
      return 0;
    }
  },

  checkReferralExpiration: async () => {
    try {
      // Get all pending referrals
      const { referrals } = get();
      const pendingReferrals = referrals.filter(r => r.status === ReferralStatus.PENDING);
      
      // Get current date
      const now = new Date();
      
      // Check each referral for expiration
      const updatedReferrals = referrals.map(referral => {
        if (referral.status !== ReferralStatus.PENDING) return referral;
        
        // Calculate expiration date (7 days after creation)
        const expirationDate = new Date(referral.createdAt);
        expirationDate.setDate(expirationDate.getDate() + REFERRAL_EXPIRATION_DAYS);
        
        // If expired, mark as invalid
        if (now > expirationDate) {
          return {
            ...referral,
            status: ReferralStatus.INVALID
          };
        }
        
        return referral;
      });
      
      // Update referrals if any changed
      if (JSON.stringify(updatedReferrals) !== JSON.stringify(referrals)) {
        set({ referrals: updatedReferrals });
      }
    } catch (error) {
      console.error('Failed to check referral expiration:', error);
    }
  },

  awardReferralBadge: async (userId: string, badgeId: string) => {
    try {
      // Get user's referrals
      const { referrals } = get();
      const userReferrals = referrals.filter(r => r.referrerId === userId);
      
      // Check if badge already awarded
      const badgeAlreadyAwarded = userReferrals.some(r => r.badges?.includes(badgeId));
      if (badgeAlreadyAwarded) return;
      
      // Find the badge
      const badge = REFERRAL_BADGES.find(b => b.id === badgeId);
      if (!badge) return;
      
      // Award the badge to the first valid referral (just for storage)
      const validReferral = userReferrals.find(r => r.status === ReferralStatus.VALID);
      if (!validReferral) return;
      
      // Update the referral with the badge
      const updatedReferrals = referrals.map(r => {
        if (r.id === validReferral.id) {
          return {
            ...r,
            badges: [...(r.badges || []), badgeId]
          };
        }
        return r;
      });
      
      set({ referrals: updatedReferrals });
      
      // Award beatcoins for the badge
      const { user, updateProfile } = useAuthStore.getState();
      if (user && updateProfile && user.id === userId) {
        updateProfile({
          beatcoins: (user.beatcoins || 0) + badge.reward
        });
      }
      
      console.log(`User ${userId} awarded badge: ${badge.name} (+${badge.reward} Beatcoins)`);
    } catch (error) {
      console.error('Failed to award badge:', error);
    }
  },

  getReferralBadges: async (userId: string) => {
    try {
      // Get user's referrals
      const { referrals } = get();
      const userReferrals = referrals.filter(r => r.referrerId === userId);
      
      // Extract all badges
      const badges = userReferrals.reduce((acc, r) => {
        if (r.badges && r.badges.length > 0) {
          return [...acc, ...r.badges];
        }
        return acc;
      }, [] as string[]);
      
      // Remove duplicates
      return [...new Set(badges)];
    } catch (error) {
      console.error('Failed to get badges:', error);
      return [];
    }
  }
}));