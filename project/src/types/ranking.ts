import { UserType } from './index';

export enum DJLevel {
  MASTER = 'Master',
  TECHNIC = 'Technic',
  PIONEER = 'Pioneer'
}

export enum DJRank {
  COMMANDER = 'Commander',
  CAPTAIN = 'Captain',
  CADET = 'Cadet'
}

export interface Area {
  code: string; // IATA code
  name: string;
  country: string;
  flag: string; // Country flag emoji
  provinceFlag?: string; // Province flag URL (if available)
}

export interface DJRanking {
  id: string;
  djId: string;
  planetId: string;
  galaxyId: string;
  level: DJLevel;
  rank: DJRank;
  squad: number;
  position: number;
  area: Area;
  lightyears: number;
  lastUpdated: Date;
  stats: {
    monthlyPlays: number;
    totalVotes: number;
    geoVotes: number;
    eventParticipation: number;
    weeklyPoints: number; // For weekly competition
    weeklyGeoVotes: number; // For tiebreakers
    weeklySessionCount: number; // For tiebreakers
    joinDate: Date; // For tiebreakers
    lastActivity: Date; // For inactivity tracking
  };
  seasonId: string;
  momentum: {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    lastPosition: number;
  };
  currentSession?: {
    url: string;
    thumbnail: string;
    title: string;
    uploadDate: Date;
    votes: number;
    frozen: boolean;
  };
  isStar?: boolean;
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    soundcloud?: string;
  };
  competitionStatus: {
    inactiveWeeks: number;
    promotionEligible: boolean;
    relegationRisk: boolean;
    squadHistory: {
      date: Date;
      fromSquad: number;
      toSquad: number;
      reason: string;
    }[];
  };
}

export interface RankingFilters {
  planetId?: string;
  country?: string;
  area?: string;
  level?: DJLevel;
  rank?: DJRank;
  squad?: number;
  seasonId?: string;
}

export interface CompetitionSchedule {
  submissionStart: Date; // Monday 13:00
  submissionEnd: Date; // Friday 13:00
  votingEnd: Date; // Sunday 23:59
  nextUpdate: Date;
}

export interface CompetitionRules {
  squadSize: number; // 25 DJs per squad
  promotionCount: number; // Top 5 DJs
  relegationCount: number; // Bottom 5 DJs
  inactivityThreshold: number; // 3 weeks
  minSessionsPerWeek: number;
  pointValues: {
    normalVote: number; // 1 point
    starVote: number; // 3 points
    geoVote: number; // 5 points
  };
  tiebreakers: [
    'weeklyPoints',
    'weeklyGeoVotes',
    'weeklySessionCount',
    'joinDate'
  ];
}

export interface SquadMovement {
  type: 'promotion' | 'relegation' | 'inactivity';
  fromSquad: number;
  toSquad: number;
  reason: string;
  date: Date;
}

export interface RankingUpdate {
  djId: string;
  oldRank: {
    level: DJLevel;
    rank: DJRank;
    squad: number;
    position: number;
  };
  newRank: {
    level: DJLevel;
    rank: DJRank;
    squad: number;
    position: number;
  };
  reason: string;
  date: Date;
}

export interface Season {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  previousSeasonId?: string;
}

export interface SeasonChampion {
  seasonId: string;
  planetId: string;
  djId: string;
  score: number;
  country: string;
  area: string;
  rank: DJRank;
  level: DJLevel;
}

export interface SeasonStats {
  seasonId: string;
  djId: string;
  totalVotes: number;
  geoVotes: number;
  sessionsUploaded: number;
  eventsAttended: number;
  bestPosition: number;
  finalPosition: number;
  lightyears: number;
}

export interface VideoSession {
  id: string;
  djId: string;
  url: string;
  title: string;
  platform: 'youtube' | 'vimeo' | 'twitch';
  uploadDate: Date;
  votes: number;
  frozen: boolean;
  monthlyScore: number;
  seasonScore: number;
}