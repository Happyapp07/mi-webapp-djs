import { create } from 'zustand';
import { DJRanking, DJLevel, DJRank, RankingFilters, VideoSession, Season, SeasonChampion, SeasonStats } from '../types/ranking';

interface RankingState {
  djRankings: DJRanking[];
  filters: RankingFilters;
  isLoading: boolean;
  error: string | null;
  currentSeason: {
    id: string;
    startDate: Date;
    endDate: Date;
  };
  seasons: Season[];
  champions: SeasonChampion[];
  seasonStats: SeasonStats[];
  fetchRankings: (filters?: RankingFilters) => Promise<void>;
  fetchSeasons: () => Promise<void>;
  fetchChampions: (seasonId?: string, planetId?: string, country?: string, area?: string) => Promise<void>;
  fetchSeasonStats: (djId: string, seasonId?: string) => Promise<void>;
  resetSeason: () => Promise<void>;
  updateFilters: (newFilters: Partial<RankingFilters>) => void;
  submitVideoSession: (djId: string, videoUrl: string, title: string) => Promise<void>;
  voteForSession: (sessionId: string, userId: string) => Promise<void>;
  canSubmitVideo: (djId: string) => boolean;
  getSquadSize: (level: DJLevel, rank: DJRank, squad: number) => number;
}

const SQUAD_SIZE = 25;
const VIDEO_SUBMISSION_WINDOW = {
  start: { day: 1, hour: 13 }, // Monday 13:00
  end: { day: 5, hour: 13 }    // Friday 13:00
};

export const useRankingStore = create<RankingState>((set, get) => ({
  djRankings: [],
  filters: {},
  isLoading: false,
  error: null,
  seasons: [],
  champions: [],
  seasonStats: [],
  currentSeason: {
    id: 'season_2023_2024',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-06-30')
  },

  fetchSeasons: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For real user testing, start with current season only
      const currentSeason: Season = {
        id: 'season_2025_2026',
        name: 'Season 2025-2026',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-06-30'),
        isActive: true
      };
      
      set({ 
        seasons: [currentSeason],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch seasons',
        isLoading: false 
      });
    }
  },

  fetchChampions: async (seasonId?: string, planetId?: string, country?: string, area?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For real user testing, start with empty champions
      const filtered: SeasonChampion[] = [];
      
      set({ 
        champions: filtered,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch champions',
        isLoading: false 
      });
    }
  },

  fetchSeasonStats: async (djId: string, seasonId?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For real user testing, start with empty stats
      const filtered: SeasonStats[] = [];
      
      set({ 
        seasonStats: filtered,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch season stats',
        isLoading: false 
      });
    }
  },

  resetSeason: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would:
      // 1. Archive current season data
      // 2. Create a new season
      // 3. Reset rankings while preserving user profiles
      // 4. Reset missions and other seasonal data
      
      // For demo, we'll create a new season and reset rankings
      const now = new Date();
      const nextSeasonStartYear = now.getFullYear();
      const nextSeasonEndYear = now.getFullYear() + 1;
      
      const newSeason: Season = {
        id: `season_${nextSeasonStartYear}_${nextSeasonEndYear}`,
        name: `Season ${nextSeasonStartYear}-${nextSeasonEndYear}`,
        startDate: new Date(`${nextSeasonStartYear}-09-01`),
        endDate: new Date(`${nextSeasonEndYear}-06-30`),
        isActive: true,
        previousSeasonId: 'season_2025_2026'
      };
      
      // Update current season
      set(state => ({
        currentSeason: {
          id: newSeason.id,
          startDate: newSeason.startDate,
          endDate: newSeason.endDate
        },
        seasons: [
          newSeason,
          ...state.seasons.map(s => ({
            ...s,
            isActive: false
          }))
        ],
        isLoading: false
      }));
      
      // Reset rankings would happen here in a real app
      
      return newSeason;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset season',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchRankings: async (filters?: RankingFilters) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      // For real user testing, start with empty rankings
      const rankings: DJRanking[] = [];
      
      set({ 
        djRankings: rankings,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch rankings',
        isLoading: false 
      });
    }
  },

  updateFilters: (newFilters: Partial<RankingFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  submitVideoSession: async (djId: string, videoUrl: string, title: string) => {
    try {
      set({ isLoading: true, error: null });

      // Check submission window
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hour = now.getHours();

      if (day < VIDEO_SUBMISSION_WINDOW.start.day || 
          day > VIDEO_SUBMISSION_WINDOW.end.day ||
          (day === VIDEO_SUBMISSION_WINDOW.start.day && hour < VIDEO_SUBMISSION_WINDOW.start.hour) ||
          (day === VIDEO_SUBMISSION_WINDOW.end.day && hour >= VIDEO_SUBMISSION_WINDOW.end.hour)) {
        throw new Error('Video submissions are only allowed between Monday 13:00 and Friday 13:00');
      }

      // Validate URL (basic example)
      const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|vimeo\.com|twitch\.tv)\/.+$/;
      if (!videoPattern.test(videoUrl)) {
        throw new Error('Invalid video URL. Please use YouTube, Vimeo, or Twitch.');
      }

      // In a real app, this would be an API call
      // For demo, we'll just update the local state
      const session: VideoSession = {
        id: `session_${Date.now()}`,
        djId,
        url: videoUrl,
        title,
        platform: videoUrl.includes('youtube.com') ? 'youtube' :
                 videoUrl.includes('vimeo.com') ? 'vimeo' : 'twitch',
        uploadDate: new Date(),
        votes: 0,
        frozen: false,
        monthlyScore: 0,
        seasonScore: 0
      };

      // Update DJ's current session
      set(state => ({
        djRankings: state.djRankings.map(dj =>
          dj.id === djId
            ? {
                ...dj,
                currentSession: {
                  url: session.url,
                  thumbnail: '', // Would be extracted from the video platform
                  title: session.title,
                  uploadDate: session.uploadDate,
                  votes: 0,
                  frozen: false
                }
              }
            : dj
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit video',
        isLoading: false 
      });
    }
  },

  voteForSession: async (sessionId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });

      // In a real app, this would be an API call
      // For demo, we'll just update the local state
      set(state => ({
        djRankings: state.djRankings.map(dj =>
          dj.currentSession?.url.includes(sessionId)
            ? {
                ...dj,
                currentSession: {
                  ...dj.currentSession,
                  votes: (dj.currentSession.votes || 0) + 1
                }
              }
            : dj
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to vote',
        isLoading: false 
      });
    }
  },

  canSubmitVideo: (djId: string) => {
    const { djRankings } = get();
    const dj = djRankings.find(d => d.id === djId);
    
    if (!dj?.currentSession) return true;

    const lastUpload = new Date(dj.currentSession.uploadDate);
    const now = new Date();
    
    // Check if last upload was this week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    weekStart.setHours(0, 0, 0, 0);
    
    return lastUpload < weekStart;
  },

  getSquadSize: (level: DJLevel, rank: DJRank, squad: number) => {
    const { djRankings } = get();
    return djRankings.filter(dj => 
      dj.level === level && 
      dj.rank === rank && 
      dj.squad === squad
    ).length;
  }
}));

// Mock data generation helper
const mockFetchRankings = async (filters?: RankingFilters): Promise<DJRanking[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const rankings: DJRanking[] = [];
  const levels = Object.values(DJLevel);
  const ranks = Object.values(DJRank);

  // Generate rankings for each level, rank, and squad
  levels.forEach(level => {
    ranks.forEach(rank => {
      // Create 3 squads by default
      for (let squad = 1; squad <= 3; squad++) {
        // Each squad has exactly 25 DJs
        for (let i = 0; i < SQUAD_SIZE; i++) {
          const dj: DJRanking = {
            id: `dj_${level}_${rank}_${squad}_${i}`,
            djId: `user_${level}_${rank}_${squad}_${i}`,
            planetId: filters?.planetId || 'house',
            galaxyId: 'brimfull',
            level,
            rank,
            squad,
            position: i + 1,
            area: {
              code: 'BCN',
              name: 'Barcelona',
              country: 'ES',
              flag: '🇪🇸'
            },
            lightyears: Math.floor(Math.random() * 10000),
            lastUpdated: new Date(),
            stats: {
              monthlyPlays: Math.floor(Math.random() * 1000),
              totalVotes: Math.floor(Math.random() * 500),
              geoVotes: Math.floor(Math.random() * 100),
              eventParticipation: Math.floor(Math.random() * 10),
              weeklyPoints: Math.floor(Math.random() * 100),
              weeklyGeoVotes: Math.floor(Math.random() * 20),
              weeklySessionCount: Math.floor(Math.random() * 3),
              joinDate: new Date(Date.now() - Math.random() * 31536000000),
              lastActivity: new Date()
            },
            seasonId: 'season_2023_2024',
            momentum: {
              trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
              percentage: Math.floor(Math.random() * 100),
              lastPosition: i + 1 + (Math.random() > 0.5 ? 1 : -1)
            },
            socialLinks: {
              instagram: `https://instagram.com/dj_${i}`,
              soundcloud: `https://soundcloud.com/dj_${i}`
            },
            competitionStatus: {
              inactiveWeeks: Math.floor(Math.random() * 3),
              promotionEligible: i < 5,
              relegationRisk: i >= 20,
              squadHistory: []
            }
          };

          // Add current session for some DJs
          if (Math.random() > 0.5) {
            dj.currentSession = {
              url: 'https://youtube.com/watch?v=example',
              thumbnail: 'https://example.com/thumbnail.jpg',
              title: 'Weekend Mix Session',
              uploadDate: new Date(),
              votes: Math.floor(Math.random() * 100),
              frozen: false
            };
          }

          rankings.push(dj);
        }
      }
    });
  });

  // Apply filters
  let filtered = rankings;
  
  if (filters?.country) {
    filtered = filtered.filter(dj => dj.area.country === filters.country);
  }
  
  if (filters?.level) {
    filtered = filtered.filter(dj => dj.level === filters.level);
  }
  
  if (filters?.rank) {
    filtered = filtered.filter(dj => dj.rank === filters.rank);
  }
  
  if (filters?.squad) {
    filtered = filtered.filter(dj => dj.squad === filters.squad);
  }

  // Sort by position within squad by default
  return filtered.sort((a, b) => {
    if (a.level !== b.level) return levels.indexOf(a.level) - levels.indexOf(b.level);
    if (a.rank !== b.rank) return ranks.indexOf(a.rank) - ranks.indexOf(b.rank);
    if (a.squad !== b.squad) return a.squad - b.squad;
    return a.position - b.position;
  });
};