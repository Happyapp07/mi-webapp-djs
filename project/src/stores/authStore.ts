import { create } from 'zustand';
import { UserType, User, DJProfile, PartygoerProfile, ClubProfile, ReporterProfile } from '../types';

interface AuthState {
  user: User | DJProfile | PartygoerProfile | ClubProfile | ReporterProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, always succeed
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        username: email.split('@')[0],
        userType: UserType.PARTYGOER,
        createdAt: new Date(),
        level: 1,
        beatcoins: 100,
        achievements: []
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('cosmic_user', JSON.stringify(mockUser));
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed', 
        isLoading: false 
      });
    }
  },
  
  register: async (userData: Partial<User>, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser = {
        id: `user_${Date.now()}`,
        email: userData.email,
        username: userData.username || userData.email?.split('@')[0],
        userType: userData.userType || UserType.PARTYGOER,
        createdAt: new Date(),
        level: 1,
        beatcoins: 100,
        achievements: [],
        ...userData
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('cosmic_user', JSON.stringify(mockUser));
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed', 
        isLoading: false 
      });
    }
  },
  
  logout: async () => {
    try {
      // Remove from localStorage
      localStorage.removeItem('cosmic_user');
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  updateProfile: async (profileData: Partial<User>) => {
    try {
      set({ isLoading: true, error: null });
      
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('Not authenticated');
      
      const updatedUser = { ...user, ...profileData };
      
      // Update in localStorage
      localStorage.setItem('cosmic_user', JSON.stringify(updatedUser));
      
      set({ 
        user: updatedUser, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Profile update failed', 
        isLoading: false 
      });
    }
  },
  
  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      // Check localStorage for existing user
      const userJson = localStorage.getItem('cosmic_user');
      
      if (userJson) {
        const user = JSON.parse(userJson);
        set({ 
          user, 
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));