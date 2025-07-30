export enum EntityType {
  MENTOR_LABEL = 'mentor_label',
  ACADEMY = 'academy',
  FREQUENCY_STATION = 'frequency_station',
  MUSIC_DEPOT = 'music_depot'
}

export interface BaseEntityProfile {
  id: string;
  name: string;
  logo: string;
  website: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  location: {
    address?: string;
    city: string;
    country: string;
    isOnline: boolean;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  entityType: EntityType;
  musicStyles: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

export interface MentorLabelProfile extends BaseEntityProfile {
  entityType: EntityType.MENTOR_LABEL;
  artists: string[]; // DJ IDs
  releases: {
    id: string;
    title: string;
    artist: string;
    releaseDate: Date;
    coverImage: string;
    link: string;
  }[];
  upcomingReleases: {
    id: string;
    title: string;
    artist: string;
    releaseDate: Date;
    coverImage?: string;
  }[];
  talentSubmissionOpen: boolean;
}

export interface AcademyProfile extends BaseEntityProfile {
  entityType: EntityType.ACADEMY;
  courses: {
    id: string;
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    duration: string;
    infoLink: string;
  }[];
  graduates: string[]; // DJ IDs
  certifications: string[];
  scholarshipAvailable: boolean;
}

export interface FrequencyStationProfile extends BaseEntityProfile {
  entityType: EntityType.FREQUENCY_STATION;
  broadcastType: 'online' | 'fm' | 'both';
  frequency?: string; // For FM stations
  streamUrl?: string; // For online stations
  featuredDJs: string[]; // DJ IDs
  shows: {
    id: string;
    title: string;
    description: string;
    schedule: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
    hostName: string;
    hostId?: string; // DJ ID if applicable
  }[];
  customRankings: {
    id: string;
    title: string;
    description: string;
    djIds: string[];
    createdAt: Date;
  }[];
}

export interface MusicDepotProfile extends BaseEntityProfile {
  entityType: EntityType.MUSIC_DEPOT;
  brands: {
    id: string;
    name: string;
    logo: string;
    category: 'hardware' | 'software' | 'vinyl' | 'merchandise';
  }[];
  promotionalEvents: {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    infoLink: string;
  }[];
  specialOffers: {
    id: string;
    title: string;
    description: string;
    validUntil: Date;
    discountCode?: string;
    link: string;
  }[];
}

export type EntityProfile = MentorLabelProfile | AcademyProfile | FrequencyStationProfile | MusicDepotProfile;