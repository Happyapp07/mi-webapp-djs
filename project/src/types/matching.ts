import { UserType } from './index';

export interface MatchingProfile {
  userId: string;
  answers: MatchingAnswer[];
  preferences: MatchingPreferences;
  completionPercentage: number;
  lastUpdated: Date;
}

export interface MatchingAnswer {
  questionId: string;
  categoryId: string;
  value: string | string[];
  weight: number;
}

export interface MatchingPreferences {
  minAge?: number;
  maxAge?: number;
  genders?: string[];
  distance?: number;
  intentionTypes?: IntentionType[];
  dealbreakers?: string[];
}

export interface MatchingQuestion {
  id: string;
  categoryId: string;
  text: string;
  type: QuestionType;
  options?: string[];
  weight: number;
  required: boolean;
}

export interface MatchingCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  questions: MatchingQuestion[];
}

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  SLIDER = 'slider',
  TEXT = 'text'
}

export enum IntentionType {
  FRIENDSHIP = 'friendship',
  DATING = 'dating',
  BUSINESS = 'business',
  MUSIC_COLLAB = 'music_collab'
}

export interface Match {
  id: string;
  userIds: [string, string];
  score: number;
  matchDate: Date;
  status: MatchStatus;
  lastInteraction?: Date;
}

export enum MatchStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}