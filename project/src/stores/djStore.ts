import { create } from 'zustand';
import { DJProfile, Vote, VoteType } from '../types';
import { DJRank } from '../types/ranking';

interface DJState {
  djs: DJProfile[];
  djRankings: {
    [planetId: string]: DJProfile[];
  };
  votes: {
    [djId: string]: Vote[];
  };
  isLoading: boolean;
  error: string | null;
  fetchDJs: (planetId?: string) => Promise<void>;
  fetchDJDetail: (djId: string) => Promise<DJProfile | null>;
  voteForDJ: (djId: string, type: VoteType, userId: string) => Promise<void>;
  getDJScore: (djId: string) => number;
  submitVideoSession: (djId: string, videoUrl: string, title: string) => Promise<void>;
  canSubmitVideo: (djId: string) => boolean;
}

// Simulate fetching data
const mockFetchDelay = () => new Promise((resolve) => setTimeout(resolve, 800));

export const useDJStore = create<DJState>((set, get) => ({
  djs: [],
  djRankings: {},
  votes: {},
  isLoading: false,
  error: null,
  
  submitVideoSession: async (djId: string, videoUrl: string, title: string) => {
    try {
      set({ isLoading: true, error: null });
      await mockFetchDelay();
      
      // In a real app, this would be an API call
      // For demo, we'll just update the local state
      const session = {
        id: `session_${Date.now()}`,
        title,
        videoUrl,
        uploadDate: new Date(),
        votes: 0,
        duration: '0:00', // This would be fetched from the video API in a real app
        thumbnail: `https://img.youtube.com/vi/${getYouTubeVideoId(videoUrl)}/maxresdefault.jpg`
      };
      
      set(state => ({
        djs: state.djs.map(dj => 
          dj.id === djId 
            ? { 
                ...dj, 
                videos: [...(dj.videos || []), session]
              }
            : dj
        ),
        isLoading: false
      }));
      
      return session;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit video session', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  canSubmitVideo: (djId: string) => {
    const { djs } = get();
    const dj = djs.find(d => d.id === djId);
    
    if (!dj?.videos?.length) return true;
    
    const lastUpload = new Date(dj.videos[dj.videos.length - 1].uploadDate);
    const now = new Date();
    
    // Check if last upload was this week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    weekStart.setHours(0, 0, 0, 0);
    
    return lastUpload < weekStart;
  },
  
  fetchDJs: async (planetId?: string) => {
    try {
      set({ isLoading: true, error: null });
      await mockFetchDelay();
      
      // In a real app, we would fetch from an API
      // For now, return empty arrays for real user testing
      set({ djs: [], djRankings: {}, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch DJs', 
        isLoading: false 
      });
    }
  },
  
  fetchDJDetail: async (djId: string) => {
    const { djs } = get();
    const dj = djs.find(d => d.id === djId);
    
    if (dj) return dj;
    
    try {
      set({ isLoading: true, error: null });
      await mockFetchDelay();
      
      // In a real app, we would fetch a specific DJ from an API
      // For now, return null for real user testing
      set({ isLoading: false });
      return null;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch DJ details', 
        isLoading: false 
      });
      return null;
    }
  },
  
  voteForDJ: async (djId: string, type: VoteType, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      await mockFetchDelay();
      
      // Calculate vote value based on type
      let voteValue = 1;
      if (type === VoteType.STAR) voteValue = 3;
      if (type === VoteType.GEO) voteValue = 5;
      
      const newVote: Vote = {
        id: `vote_${Date.now()}`,
        djId,
        userId,
        type,
        timestamp: new Date(),
        value: voteValue
      };
      
      set(state => {
        const djVotes = state.votes[djId] || [];
        
        // Check if user has already voted for this DJ
        const existingVoteIndex = djVotes.findIndex(v => v.userId === userId);
        
        if (existingVoteIndex >= 0) {
          // Replace existing vote
          djVotes[existingVoteIndex] = newVote;
        } else {
          // Add new vote
          djVotes.push(newVote);
        }
        
        return {
          votes: {
            ...state.votes,
            [djId]: djVotes
          },
          isLoading: false
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to vote', 
        isLoading: false 
      });
    }
  },
  
  getDJScore: (djId: string) => {
    const { votes } = get();
    const djVotes = votes[djId] || [];
    
    // Calculate score as sum of vote values
    return djVotes.reduce((total, vote) => total + vote.value, 0);
  }
}));

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};