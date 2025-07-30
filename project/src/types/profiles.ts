export enum UserRole {
  DJ = 'dj',
  RAVER = 'ally', 
  CLUB = 'club',
  REPORTER = 'reporter',
  FESTIVAL = 'festival'
}

export enum DJLevel {
  PIONEER = 'Pioneer',
  TECHNIC = 'Technic', 
  MASTER = 'Master'
}

export enum RaverLevel {
  ROOKIE = 'Rookie',
  HUNTER = 'Hunter',
  COMMANDER = 'Commander'
}

export enum ClubMembership {
  RECRUIT = 'Recruit',
  EMBASSY = 'Embassy',
  COMMAND_BASE = 'Command Base'
}

export interface BaseProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  completionPercentage: number;
  beatcoins: number;
  level: number;
  createdAt: Date;
  lastActive: Date;
  isVerified: boolean;
  missions: Mission[];
  membership: {
    tier: string;
    isActive: boolean;
    expiresAt?: Date;
  };
}

export interface DJProfile extends BaseProfile {
  role: UserRole.DJ;
  djName: string;
  realName: string; // Hidden, verified only
  level: DJLevel;
  musicStyle: string; // Only one style per account
  equipment: {
    hardware: EquipmentBrand[];
    software: SoftwareBrand[];
  };
  socialLinks: {
    soundcloud?: string;
    beatport?: string;
    mixcloud?: string;
  };
  planetId: string;
  rankingPosition?: number;
  assignedReporter?: string;
  competitionEnabled?: boolean;
  sessions: DJSession[];
  stats: {
    totalVotes: number;
    clubsVisited: number;
    eventsPlayed: number;
  };
  biography: string;
  events: Event[];
}

export interface RaverProfile extends BaseProfile {
  role: UserRole.RAVER;
  alias: string;
  level: RaverLevel;
  preferences: {
    musicStyles: string[];
    favoriteDrinks: DrinkBrand[];
    behaviors: {
      attendance: 'frequent' | 'occasional' | 'rare';
      geoVoting: boolean;
      consumption: 'light' | 'moderate' | 'heavy';
    };
  };
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    spotify?: string;
  };
  activity: {
    recentCheckins: ClubCheckin[];
    matches: Match[];
    taggedPhotos: Photo[];
    followedClubs: string[];
  };
}

export interface ClubProfile extends BaseProfile {
  role: UserRole.CLUB;
  clubName: string;
  membership: ClubMembership;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  capacity: number;
  dominantStyle: string;
  staff: {
    djs: string[];
    vjs: string[];
    ljs: string[];
    pr: string[];
    bartenders: string[];
    dancers: string[];
  };
  crowdpartyActive: boolean;
  qrCode: {
    current: string;
    expiresAt: Date;
  };
  events: Event[];
  stats: {
    attendanceRate: number;
    averageRating: number;
    totalEvents: number;
  };
  gallery: Photo[];
  campaigns: Campaign[];
}

export interface ReporterProfile extends BaseProfile {
  role: UserRole.REPORTER;
  assignedDJ: string;
  isVerified: boolean;
  recordings: Recording[];
  guidelines: {
    contentRules: string[];
    violations: number;
    lastWarning?: Date;
  };
  contractedClubs: string[];
}

export interface FestivalProfile extends BaseProfile {
  role: UserRole.FESTIVAL;
  festivalName: string;
  location: {
    venue: string;
    city: string;
    country: string;
  };
  dates: {
    start: Date;
    end: Date;
  };
  categories: string[];
  participants: {
    djs: string[];
    rankings: FestivalRanking[];
  };
  gallery: Photo[];
  results: FestivalResult[];
}

// Supporting interfaces
export interface EquipmentBrand {
  id: string;
  name: string;
  logo: string;
  category: 'mixer' | 'controller' | 'turntables' | 'speakers';
  website?: string;
}

export interface SoftwareBrand {
  id: string;
  name: string;
  logo: string;
  type: 'dj_software' | 'daw' | 'plugin';
  website?: string;
}

export interface DrinkBrand {
  id: string;
  name: string;
  logo: string;
  category: 'beer' | 'spirits' | 'cocktail' | 'energy';
  website?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'upload' | 'vote' | 'attend' | 'complete_profile';
  progress: number;
  maxProgress: number;
  reward: number;
  isCompleted: boolean;
  expiresAt?: Date;
}

export interface DJSession {
  id: string;
  title: string;
  videoUrl: string;
  uploadDate: Date;
  votes: number;
  duration: string;
  thumbnail: string;
}

export interface Event {
  id: string;
  name: string;
  date: Date;
  venue: string;
  participants: string[];
  type: 'club_night' | 'festival' | 'private';
}

export interface ClubCheckin {
  id: string;
  clubId: string;
  date: Date;
  beatcoinsEarned: number;
}

export interface Match {
  id: string;
  userId: string;
  compatibility: number;
  status: 'pending' | 'matched' | 'declined';
  matchedAt: Date;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: Date;
  tags: string[];
}

export interface Recording {
  id: string;
  title: string;
  videoUrl: string;
  djId: string;
  uploadDate: Date;
  views: number;
  approved: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface FestivalRanking {
  djId: string;
  position: number;
  score: number;
  category: string;
}

export interface FestivalResult {
  category: string;
  winner: string;
  runners: string[];
  totalParticipants: number;
}

export type Profile = DJProfile | RaverProfile | ClubProfile | ReporterProfile | FestivalProfile;