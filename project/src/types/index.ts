import { User } from './user';
import { Galaxy } from './galaxy';
import { Event } from './event';

export enum UserType {
  DJ = 'dj',
  PARTYGOER = 'partygoer',
  CLUB = 'club',
  PRODUCER = 'producer',
  RECORD_LABEL = 'record_label',
  RADIO = 'radio',
  STORE = 'store',
  REPORTER = 'reporter'
}

export enum DJLevel {
  PIONEER = 'Pioneer',
  TECHNIC = 'Technic',
  MASTER = 'Master'
}

export enum PartygoerRank {
  BEGINNER = 'Beginner',
  EXPERT = 'Expert',
  COMMANDER = 'Commander'
}

export enum VoteType {
  NORMAL = 'normal',
  STAR = 'star',
  GEO = 'geo'
}

export enum ConnectionType {
  FOLLOW = 'follow',
  COLLABORATION = 'collaboration',
  BOOKING = 'booking',
  SPONSORSHIP = 'sponsorship',
  RECORD_DEAL = 'record_deal',
  RADIO_PLAY = 'radio_play'
}

export interface DJProfile extends User {
  userType: UserType.DJ;
  artistName: string;
  galaxyId: string;
  planetId: string;
  rank: DJLevel;
  area: string;
  lightyears: number;
  honorRoll?: {
    seasonId: string;
    finalRank: number;
    group: number;
    lightyears: number;
    achievements: {
      type: 'monthly_champion' | 'season_champion' | 'most_improved' | 'crowd_favorite';
      date: Date;
      description: string;
    }[];
  }[];
  latestSet?: {
    id: string;
    title: string;
    date: Date;
  };
  bio?: string;
  socialLinks?: SocialLinks;
  upcomingEvents?: Event[];
  followers?: number;
  plays?: number;
}

export interface Connection {
  id: string;
  type: ConnectionType;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'active' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    contractDetails?: string;
    duration?: string;
    terms?: string;
  };
}

export interface ProducerProfile extends User {
  userType: UserType.PRODUCER;
  artistName: string;
  genres: string[];
  tracks: Track[];
  collaborations: Connection[];
  recordDeals: Connection[];
}

export interface RecordLabelProfile extends User {
  userType: UserType.RECORD_LABEL;
  labelName: string;
  artists: Connection[];
  releases: Release[];
}

export interface RadioProfile extends User {
  userType: UserType.RADIO;
  stationName: string;
  mainGenre: string;
  broadcasts: Broadcast[];
  featuredArtists: Connection[];
}

export interface StoreProfile extends User {
  userType: UserType.STORE;
  storeName: string;
  products: Product[];
  sponsoredArtists: Connection[];
}

export interface ReporterProfile extends User {
  userType: UserType.REPORTER;
  reporterName: string;
  assignedDJs: string[];
  equipment: {
    cameras: string[];
    lights?: string[];
    software: string[];
  };
  portfolio: {
    id: string;
    djId: string;
    eventId: string;
    mediaUrl: string;
    date: Date;
    type: 'photo' | 'video';
  }[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDate?: Date;
  contractedClubs: string[];
}

export interface Track {
  id: string;
  producerId: string;
  title: string;
  genre: string;
  releaseDate: Date;
  plays: number;
  likes: number;
  usedByDJs: string[];
}

export interface Release {
  id: string;
  labelId: string;
  artistId: string;
  title: string;
  releaseDate: Date;
  tracks: Track[];
}

export interface Broadcast {
  id: string;
  radioId: string;
  djId: string;
  title: string;
  scheduledTime: Date;
  duration: number;
  listeners: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  category: 'hardware' | 'software' | 'merchandise';
  beatcoinDiscount?: number;
}

export interface SocialLinks {
  instagram?: string;
  soundcloud?: string;
  spotify?: string;
  website?: string;
}

// Re-export existing types
export * from './user';
export * from './galaxy';
export * from './event';
export * from './subscription';