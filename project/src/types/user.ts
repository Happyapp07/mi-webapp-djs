import { Event, Achievement, Connection } from './index';
import { Brand } from './brand';

export enum UserType {
  PILOT = 'pilot',
  ALLIED = 'allied',
  STADIUM = 'stadium',
  OBSERVER = 'observer'
}

export enum PilotRank {
  CADET = 'Cadet',
  CAPTAIN = 'Captain',
  COMMANDER = 'Commander'
}

export enum AlliedRank {
  SUPPORTER = 'Supporter',
  REBEL = 'Rebel',
  COMMANDER = 'Commander'
}

export enum StadiumRank {
  CLUB = 'Club',
  EMBASSY = 'Embassy',
  STADIUM = 'Stadium'
}

export enum ObserverRank {
  TRAINEE = 'Trainee',
  VERIFIED = 'Verified',
  EXPERT = 'Expert'
}

interface BaseUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  profileImage?: string;
  level: number;
  beatcoins: number;
  achievements: Achievement[];
  completionPercentage: number;
}

export interface PilotProfile extends BaseUser {
  userType: UserType.PILOT;
  artistName: string;
  galaxyId: string;
  planetId: string;
  rank: PilotRank;
  area: string;
  lightyears: number;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    soundcloud?: string;
    mixcloud?: string;
    beatport?: string;
    spotify?: string;
  };
  videos?: {
    id: string;
    url: string;
    title: string;
    type: 'training' | 'competition';
    plays: number;
    uploadDate: Date;
  }[];
  equipment?: string[]; // Brand IDs for DJ equipment
  software?: string[]; // Brand IDs for DJ software
  favoriteDrinks?: string[]; // Brand IDs for drinks
  preferredLanguage?: string;
  homeClub?: string;
  followers: number;
  plays: number;
  upcomingEvents?: Event[];
  connections: Connection[];
  setup: {
    controllers?: string[];
    mixers?: string[];
    players?: string[];
    software: {
      main: string;
      plugins?: string[];
    };
    daw?: string;
  };
  analytics: {
    reachByCountry: { [countryCode: string]: number };
    topVotedSessions: string[];
    averageRating: number;
    totalGeoVotes: number;
  };
}

export interface AlliedProfile extends BaseUser {
  userType: UserType.ALLIED;
  displayName?: string;
  rank: AlliedRank;
  favoriteGalaxies: string[];
  favoritePlanets: string[];
  favoritePilots: string[];
  homeClub?: string;
  visitedClubs: {
    clubId: string;
    visits: number;
    lastVisit: Date;
  }[];
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    bereal?: string;
    threads?: string;
  };
  preferences: {
    musicStyles: string[];
    favoriteDrinks: string[]; // Brand IDs for drinks
    age?: number;
    gender?: string;
    interests: string[];
    partyDays: ('FRI' | 'SAT' | 'SUN')[];
    venueTypes: ('club' | 'festival' | 'underground' | 'rooftop')[];
  };
  matchPreferences: {
    ageRange: [number, number];
    musicStyles: string[];
    partyDays: ('FRI' | 'SAT' | 'SUN')[];
    drinkPreferences: string[];
  };
  crews: {
    id: string;
    name: string;
    role: string;
    joinedAt: Date;
  }[];
  analytics: {
    averageArrivalTime: string;
    favoriteDrinks: string[];
    activeDays: ('MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN')[];
    averageSpending: number;
  };
}

export interface StadiumProfile extends BaseUser {
  userType: UserType.STADIUM;
  clubName: string;
  rank: StadiumRank;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  media: {
    logo?: string;
    coverImage?: string;
    gallery: string[];
    videos: {
      url: string;
      thumbnail?: string;
      title?: string;
    }[];
  };
  residentPilots: string[];
  upcomingEvents: Event[];
  crowdpartyEnabled: boolean;
  capacity: number;
  rating: number;
  reviews: number;
  sponsoredBrands?: string[]; // Brand IDs for sponsored drinks/equipment
  team: {
    pilots: string[];
    bartenders: string[];
    pr: string[];
    security: string[];
    dancers: string[];
  };
  analytics: {
    peakHours: { [hour: string]: number };
    popularDrinks: { [drinkId: string]: number };
    musicPreferences: { [style: string]: number };
    averageAge: number;
    genderDistribution: { [gender: string]: number };
  };
}

export interface ObserverProfile extends BaseUser {
  userType: UserType.OBSERVER;
  rank: ObserverRank;
  assignedPilots: string[];
  equipment: {
    cameras: string[];
    lights?: string[];
    software: string[];
  };
  portfolio: {
    id: string;
    pilotId: string;
    eventId: string;
    mediaUrl: string;
    date: Date;
    type: 'photo' | 'video';
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    validUntil: Date;
  }[];
  availability: {
    days: ('MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN')[];
    hours: {
      start: string;
      end: string;
    };
  };
}

export type User = PilotProfile | AlliedProfile | StadiumProfile | ObserverProfile;