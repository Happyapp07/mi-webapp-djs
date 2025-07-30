import { UserType } from './index';

export interface Alliance {
  id: string;
  userId1: string;
  userId2: string;
  createdAt: Date;
  status: AllianceStatus;
  lastMeetupAt?: Date;
  meetupCount: number;
  sharedEvents: string[];
  sharedClubs: string[];
}

export enum AllianceStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface Crew {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  founderUserId: string;
  members: CrewMember[];
  rank: number;
  score: number;
  completedMissions: string[];
  badges: string[];
  image?: string;
}

export interface CrewMember {
  userId: string;
  username: string;
  userType: UserType;
  joinedAt: Date;
  role: CrewRole;
  contributionScore: number;
  avatar?: string;
}

export enum CrewRole {
  FOUNDER = 'founder',
  CAPTAIN = 'captain',
  MEMBER = 'member'
}

export interface PhysicalMission {
  id: string;
  title: string;
  description: string;
  type: PhysicalMissionType;
  requirements: PhysicalMissionRequirement[];
  reward: {
    beatcoins: number;
    badge?: string;
    crewPoints?: number;
    extraReward?: {
      type: 'item' | 'feature' | 'experience';
      value: string;
      description: string;
    };
  };
  expiresAt?: Date;
  isActive: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  minMembers: number;
  maxMembers?: number;
}

export enum PhysicalMissionType {
  PLANET_RESTORATION = 'planet_restoration',
  COSMIC_ALLIANCE = 'cosmic_alliance',
  HARMONY_GATHERING = 'harmony_gathering',
  MEMORY_PRESERVATION = 'memory_preservation',
  RESONANCE_AMPLIFICATION = 'resonance_amplification',
  GALACTIC_CELEBRATION = 'galactic_celebration',
  SOUND_EXPEDITION = 'sound_expedition'
}

export interface PhysicalMissionRequirement {
  type: PhysicalMissionRequirementType;
  count: number;
  timeframe?: number; // in days
  specificClubIds?: string[];
  specificEventIds?: string[];
}

export enum PhysicalMissionRequirementType {
  ESTABLISH_ALLIANCE = 'establish_alliance',
  EXPLORE_SOUND_OUTPOSTS = 'explore_sound_outposts',
  JOIN_HARMONY_GATHERING = 'join_harmony_gathering',
  CAPTURE_COSMIC_MOMENT = 'capture_cosmic_moment',
  AMPLIFY_PILOT_SIGNAL = 'amplify_pilot_signal'
}

// Crew badges
export const CREW_BADGES = [
  {
    id: 'cosmic_restorers',
    name: 'Cosmic Restorers',
    description: 'Tripulación que ha restaurado 3 zonas de silencio',
    image: '🌟',
    requirement: 3 // missions completed
  },
  {
    id: 'sound_pioneers',
    name: 'Sound Pioneers',
    description: 'Tripulación que ha explorado 5 outposts sonoros diferentes',
    image: '🛡️',
    requirement: 5 // different clubs
  },
  {
    id: 'harmonic_resonators',
    name: 'Harmonic Resonators',
    description: 'Tripulación con más de 10 encuentros de resonancia registrados',
    image: '⚡',
    requirement: 10 // meetups
  },
  {
    id: 'harmony_keepers',
    name: 'Harmony Keepers',
    description: 'Tripulación que ha participado en 3 Reuniones de Armonía juntos',
    image: '🎭',
    requirement: 3 // crowdparties
  },
  {
    id: 'cosmic_cartographers',
    name: 'Cosmic Cartographers',
    description: 'Tripulación que ha mapeado outposts sonoros en 3 regiones diferentes',
    image: '🚀',
    requirement: 3 // different cities
  }
];

// Physical missions
export const PHYSICAL_MISSIONS: PhysicalMission[] = [
  {
    id: 'mission_form_alliance',
    title: 'Alianza Contra el Silencio',
    description: 'Forma una alianza con 3 tripulantes distintos para combatir el Silencio Cósmico',
    type: PhysicalMissionType.COSMIC_ALLIANCE,
    requirements: [
      {
        type: PhysicalMissionRequirementType.ESTABLISH_ALLIANCE,
        count: 3
      }
    ],
    reward: {
      beatcoins: 50,
      badge: 'cosmic_restorers',
      crewPoints: 100
    },
    isActive: true,
    difficulty: 'easy',
    minMembers: 3
  },
  {
    id: 'mission_sound_expedition',
    title: 'Expedición Sonora',
    description: 'Explora 3 outposts sonoros distintos con tu tripulación en un mismo ciclo lunar',
    type: PhysicalMissionType.SOUND_EXPEDITION,
    requirements: [
      {
        type: PhysicalMissionRequirementType.EXPLORE_SOUND_OUTPOSTS,
        count: 3,
        timeframe: 30
      }
    ],
    reward: {
      beatcoins: 100,
      badge: 'sound_pioneers',
      crewPoints: 200
    },
    isActive: true,
    difficulty: 'medium',
    minMembers: 2
  },
  {
    id: 'mission_harmony_gathering',
    title: 'Guardianes de la Armonía',
    description: 'Participad juntos en 2 Reuniones de Armonía para restaurar las frecuencias cósmicas',
    type: PhysicalMissionType.HARMONY_GATHERING,
    requirements: [
      {
        type: PhysicalMissionRequirementType.JOIN_HARMONY_GATHERING,
        count: 2
      }
    ],
    reward: {
      beatcoins: 75,
      badge: 'harmony_keepers',
      crewPoints: 150
    },
    isActive: true,
    difficulty: 'medium',
    minMembers: 2
  },
  {
    id: 'mission_memory_preservation',
    title: 'Preservadores de Memorias',
    description: 'Capturad un momento cósmico para preservar la historia sonora del outpost',
    type: PhysicalMissionType.MEMORY_PRESERVATION,
    requirements: [
      {
        type: PhysicalMissionRequirementType.CAPTURE_COSMIC_MOMENT,
        count: 1
      }
    ],
    reward: {
      beatcoins: 60,
      crewPoints: 120,
      extraReward: {
        type: 'experience',
        value: 'memory_archive',
        description: 'Tu tripulación aparecerá en los Archivos de Memoria Cósmica'
      }
    },
    isActive: true,
    difficulty: 'easy',
    minMembers: 3
  },
  {
    id: 'mission_amplify_signal',
    title: 'Amplificadores de Señal',
    description: 'Amplificad la señal de un piloto desde el mismo outpost para fortalecer su transmisión',
    type: PhysicalMissionType.RESONANCE_AMPLIFICATION,
    requirements: [
      {
        type: PhysicalMissionRequirementType.AMPLIFY_PILOT_SIGNAL,
        count: 1
      }
    ],
    reward: {
      beatcoins: 40,
      crewPoints: 80
    },
    isActive: true,
    difficulty: 'easy',
    minMembers: 2
  }
];