import { create } from 'zustand';
import { 
  Achievement, 
  AchievementLevel, 
  getAchievementsByUserType, 
  GALACTIC_INFLUENCER_ACHIEVEMENT 
} from '../types/achievement';
import { UserType } from '../types';
import { useAuthStore } from './authStore';

interface AchievementState {
  achievements: Achievement[];
  userAchievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  fetchAchievements: () => Promise<void>;
  fetchUserAchievements: (userId: string) => Promise<Achievement[]>;
  updateAchievementProgress: (achievementId: string, progress: number) => Promise<void>;
  checkAchievementUnlock: (achievementId: string, value: number) => Promise<boolean>;
  checkGalacticInfluencer: (userId: string) => Promise<boolean>;
  getAchievementProgress: (achievementId: string) => number;
  getNextLevelRequirement: (achievementId: string) => number | null;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  userAchievements: [],
  isLoading: false,
  error: null,

  fetchAchievements: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      // Get achievements for user type
      const achievements = getAchievementsByUserType(user.userType as UserType);
      
      set({ 
        achievements,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch achievements',
        isLoading: false 
      });
    }
  },

  fetchUserAchievements: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      // For real user testing, start with empty achievements
      
      // Get achievements for user type
      const achievements = getAchievementsByUserType(user.userType as UserType);
      
      // Start with no unlocked achievements for real users
      const userAchievements = achievements.map(achievement => {
        return {
          ...achievement,
          unlockedLevel: undefined,
          unlockedAt: undefined
        };
      });
      
      set({ 
        userAchievements,
        isLoading: false 
      });
      
      return userAchievements;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user achievements',
        isLoading: false 
      });
      return [];
    }
  },

  updateAchievementProgress: async (achievementId: string, progress: number) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');
      
      // In a real app, this would update the progress in the database
      // For demo, we'll just log it
      console.log(`Updating achievement ${achievementId} progress to ${progress}`);
      
      // Check if achievement is unlocked
      const unlocked = await get().checkAchievementUnlock(achievementId, progress);
      
      set({ isLoading: false });
      
      return unlocked;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update achievement progress',
        isLoading: false 
      });
      return false;
    }
  },

  checkAchievementUnlock: async (achievementId: string, value: number) => {
    try {
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) return false;
      
      // Get achievement
      const { achievements, userAchievements } = get();
      const achievement = achievements.find(a => a.id === achievementId);
      if (!achievement) return false;
      
      // Get user achievement
      const userAchievement = userAchievements.find(a => a.id === achievementId);
      
      // Check if achievement is already unlocked at platinum level
      if (userAchievement?.unlockedLevel === AchievementLevel.PLATINUM) return false;
      
      // Check if achievement is unlocked at a new level
      let newLevel: AchievementLevel | undefined;
      
      // Check from highest to lowest level
      for (const levelDetail of [...achievement.levels].reverse()) {
        if (value >= levelDetail.requirement) {
          // If this level is higher than the current unlocked level, unlock it
          if (!userAchievement?.unlockedLevel || 
              getAchievementLevelValue(levelDetail.level) > getAchievementLevelValue(userAchievement.unlockedLevel)) {
            newLevel = levelDetail.level;
            break;
          }
        }
      }
      
      if (newLevel) {
        // Update user achievement
        const updatedUserAchievements = userAchievements.map(a => {
          if (a.id === achievementId) {
            return {
              ...a,
              unlockedLevel: newLevel,
              unlockedAt: new Date()
            };
          }
          return a;
        });
        
        // If achievement wasn't in the list, add it
        if (!userAchievements.find(a => a.id === achievementId)) {
          updatedUserAchievements.push({
            ...achievement,
            unlockedLevel: newLevel,
            unlockedAt: new Date()
          });
        }
        
        set({ userAchievements: updatedUserAchievements });
        
        // Check if Galactic Influencer achievement should be unlocked
        await get().checkGalacticInfluencer(user.id);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking achievement unlock:', error);
      return false;
    }
  },

  checkGalacticInfluencer: async (userId: string) => {
    try {
      // Get user achievements
      const { userAchievements } = get();
      
      // Count platinum achievements
      const platinumCount = userAchievements.filter(a => a.unlockedLevel === AchievementLevel.PLATINUM).length;
      
      // Check if Galactic Influencer is already unlocked
      const hasGalacticInfluencer = userAchievements.some(a => a.id === GALACTIC_INFLUENCER_ACHIEVEMENT.id);
      
      // If user has 3 or more platinum achievements and doesn't have Galactic Influencer yet, unlock it
      if (platinumCount >= 3 && !hasGalacticInfluencer) {
        const updatedUserAchievements = [
          ...userAchievements,
          {
            ...GALACTIC_INFLUENCER_ACHIEVEMENT,
            unlockedLevel: AchievementLevel.PLATINUM,
            unlockedAt: new Date()
          }
        ];
        
        set({ userAchievements: updatedUserAchievements });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking Galactic Influencer:', error);
      return false;
    }
  },

  getAchievementProgress: (achievementId: string) => {
    // In a real app, this would fetch the progress from the database
    // For demo, we'll return a random value
    return Math.floor(Math.random() * 100);
  },

  getNextLevelRequirement: (achievementId: string) => {
    const { achievements, userAchievements } = get();
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return null;
    
    const userAchievement = userAchievements.find(a => a.id === achievementId);
    if (!userAchievement || !userAchievement.unlockedLevel) {
      // If not unlocked yet, return the first level requirement
      return achievement.levels[0].requirement;
    }
    
    // Find the next level
    const currentLevelValue = getAchievementLevelValue(userAchievement.unlockedLevel);
    const nextLevel = achievement.levels.find(level => 
      getAchievementLevelValue(level.level) > currentLevelValue
    );
    
    return nextLevel?.requirement || null;
  }
}));

// Helper function to convert achievement level to numeric value for comparison
function getAchievementLevelValue(level: AchievementLevel): number {
  switch (level) {
    case AchievementLevel.BRONZE:
      return 1;
    case AchievementLevel.SILVER:
      return 2;
    case AchievementLevel.GOLD:
      return 3;
    case AchievementLevel.PLATINUM:
      return 4;
    default:
      return 0;
  }
}