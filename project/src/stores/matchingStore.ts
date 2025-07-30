import { create } from 'zustand';
import { MatchingProfile, MatchingQuestion, MatchingCategory, Match, IntentionType, QuestionType } from '../types/matching';

interface MatchingState {
  categories: MatchingCategory[];
  userProfile?: MatchingProfile;
  potentialMatches: Match[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  saveAnswers: (answers: MatchingProfile) => Promise<void>;
  findMatches: () => Promise<void>;
  respondToMatch: (matchId: string, accept: boolean) => Promise<void>;
}

// Mock categories and questions
const mockCategories: MatchingCategory[] = [
  {
    id: 'party',
    name: 'Party & Music',
    icon: 'music',
    description: 'Your party preferences and music taste',
    questions: [
      {
        id: 'venue_type',
        categoryId: 'party',
        text: 'What type of venues do you prefer?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Large clubs', 'Intimate venues', 'Underground raves', 'Rooftop parties'],
        weight: 4,
        required: true
      },
      {
        id: 'music_genres',
        categoryId: 'party',
        text: 'Select your top 3 music genres',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['House', 'Techno', 'Trance', 'Drum & Bass', 'Ambient'],
        weight: 5,
        required: true
      },
      {
        id: 'party_frequency',
        categoryId: 'party',
        text: 'How often do you go out?',
        type: QuestionType.SINGLE_CHOICE,
        options: ['Multiple times a week', 'Weekly', 'Monthly', 'Occasionally'],
        weight: 3,
        required: true
      }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: 'coffee',
    description: 'Your daily habits and preferences',
    questions: [
      {
        id: 'drinking',
        categoryId: 'lifestyle',
        text: 'Do you drink alcohol?',
        type: QuestionType.SINGLE_CHOICE,
        options: ['Yes, regularly', 'Yes, occasionally', 'No, never'],
        weight: 4,
        required: true
      },
      {
        id: 'smoking',
        categoryId: 'lifestyle',
        text: 'Do you smoke?',
        type: QuestionType.SINGLE_CHOICE,
        options: ['Yes', 'No', 'Socially'],
        weight: 4,
        required: true
      }
    ]
  },
  {
    id: 'interests',
    name: 'Interests & Culture',
    icon: 'film',
    description: 'Your entertainment and cultural preferences',
    questions: [
      {
        id: 'movies',
        categoryId: 'interests',
        text: 'Favorite movie genres',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'],
        weight: 2,
        required: false
      },
      {
        id: 'hobbies',
        categoryId: 'interests',
        text: 'What are your hobbies?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Sports', 'Reading', 'Gaming', 'Travel', 'Art', 'Cooking'],
        weight: 3,
        required: true
      }
    ]
  }
];

export const useMatchingStore = create<MatchingState>((set, get) => ({
  categories: [],
  potentialMatches: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ categories: mockCategories, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false 
      });
    }
  },

  saveAnswers: async (profile: MatchingProfile) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ userProfile: profile, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save answers',
        isLoading: false 
      });
    }
  },

  findMatches: async () => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For real user testing, start with empty matches
      const matches: Match[] = [];
      
      set({ potentialMatches: matches, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to find matches',
        isLoading: false 
      });
    }
  },

  respondToMatch: async (matchId: string, accept: boolean) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        potentialMatches: state.potentialMatches.map(match =>
          match.id === matchId
            ? { ...match, status: accept ? 'accepted' : 'rejected' }
            : match
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to respond to match',
        isLoading: false 
      });
    }
  }
}));