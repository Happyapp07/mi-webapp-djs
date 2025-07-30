export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  code: string;
  status: ReferralStatus;
  createdAt: Date;
  completedAt?: Date;
  beatcoinsRewarded?: number;
  actions?: ReferralAction[];
  badges?: string[];
}

export enum ReferralStatus {
  PENDING = 'pending',
  VALID = 'valid',
  INVALID = 'invalid'
}

export interface ReferralAction {
  id: string;
  referralId: string;
  type: ReferralActionType;
  completed: boolean;
  completedAt?: Date;
  beatcoinsRewarded?: number;
  dualReward: boolean;
}

export enum ReferralActionType {
  PROFILE_COMPLETION = 'profile_completion',
  SCAN_QR = 'scan_qr',
  VOTE = 'vote',
  MATCH = 'match',
  UPLOAD_SESSION = 'upload_session'
}

export interface ReferralStats {
  totalReferrals: number;
  validReferrals: number;
  pendingReferrals: number;
  totalBeatcoinsEarned: number;
  milestones: ReferralMilestone[];
  nextMilestone?: ReferralMilestone;
  weeklyReferrals: number;
  weeklyReferralsLimit: number;
  referralDetails: ReferralDetail[];
}

export interface ReferralDetail {
  id: string;
  referredUsername: string;
  referredAvatar: string;
  status: ReferralStatus;
  createdAt: Date;
  completedAt?: Date;
  beatcoinsEarned: number;
  actions: {
    type: ReferralActionType;
    completed: boolean;
    beatcoinsRewarded?: number;
  }[];
  timeRemaining: number; // Days remaining for completion
}

export interface ReferralMilestone {
  count: number;
  reward: {
    type: 'beatcoins' | 'subscription' | 'item' | 'feature';
    value: string | number;
    description: string;
  };
  isCompleted: boolean;
}

// Referral rewards by user role
export const REFERRAL_REWARDS = {
  dj: {
    beatcoinsPerReferral: 50,
    rankingPointsPerReferral: 1,
    milestones: [
      {
        count: 5,
        reward: {
          type: 'subscription',
          value: 'technic',
          description: '1 mes Technic gratis'
        }
      },
      {
        count: 10,
        reward: {
          type: 'beatcoins',
          value: 500,
          description: '500 Beatcoins extra'
        }
      },
      {
        count: 20,
        reward: {
          type: 'subscription',
          value: 'master',
          description: '1 mes Master gratis'
        }
      }
    ]
  },
  partygoer: {
    beatcoinsPerReferral: 30,
    milestones: [
      {
        count: 5,
        reward: {
          type: 'beatcoins',
          value: 200,
          description: '200 Beatcoins extra'
        }
      },
      {
        count: 10,
        reward: {
          type: 'item',
          value: 'free_drink',
          description: '1 consumición gratis en club adherido'
        }
      },
      {
        count: 20,
        reward: {
          type: 'subscription',
          value: 'supporter',
          description: '1 mes Supporter gratis'
        }
      }
    ]
  },
  reporter: {
    beatcoinsPerReferral: 40,
    milestones: [
      {
        count: 5,
        reward: {
          type: 'feature',
          value: 'exclusive_training',
          description: 'Acceso a formación exclusiva'
        }
      },
      {
        count: 10,
        reward: {
          type: 'beatcoins',
          value: 300,
          description: '300 Beatcoins extra'
        }
      },
      {
        count: 20,
        reward: {
          type: 'item',
          value: 'premium_equipment',
          description: 'Acceso a equipamiento premium'
        }
      }
    ]
  },
  club: {
    beatcoinsPerReferral: 100,
    milestones: [
      {
        count: 3,
        reward: {
          type: 'feature',
          value: 'map_highlight',
          description: 'Destacado en mapa durante 1 semana'
        }
      },
      {
        count: 10,
        reward: {
          type: 'subscription',
          value: 'embassy',
          description: '1 mes Embassy gratis'
        }
      },
      {
        count: 20,
        reward: {
          type: 'feature',
          value: 'premium_analytics',
          description: 'Acceso a analíticas premium por 3 meses'
        }
      }
    ]
  }
};

// Badges for referral achievements
export const REFERRAL_BADGES = [
  {
    id: 'signal_beacon',
    name: 'Signal Beacon',
    requirement: 3,
    icon: 'radio',
    description: 'Tu señal ha alcanzado a 3 nuevos tripulantes',
    reward: 50
  },
  {
    id: 'orbital_influencer',
    name: 'Orbital Influencer',
    requirement: 10,
    icon: 'satellite',
    description: 'Tu influencia se extiende por toda la órbita',
    reward: 100
  },
  {
    id: 'wormhole_captain',
    name: 'Wormhole Captain',
    requirement: 20,
    icon: 'compass',
    description: 'Has abierto un agujero de gusano para 20 nuevos tripulantes',
    reward: 200
  },
  {
    id: 'fleet_commander',
    name: 'Fleet Commander',
    requirement: 50,
    icon: 'users',
    description: 'Comandas una flota de 50 tripulantes',
    reward: 500
  },
  {
    id: 'high_council_strategist',
    name: 'High Council Strategist',
    requirement: 100,
    icon: 'crown',
    description: 'Tus estrategias de reclutamiento son legendarias',
    reward: 1000
  }
];

// Referral action rewards
export const REFERRAL_ACTION_REWARDS = {
  [ReferralActionType.PROFILE_COMPLETION]: 10,
  [ReferralActionType.SCAN_QR]: 5,
  [ReferralActionType.VOTE]: 5,
  [ReferralActionType.MATCH]: 3,
  [ReferralActionType.UPLOAD_SESSION]: 10
};

// Weekly referral limit
export const WEEKLY_REFERRAL_LIMIT = 5;

// Referral expiration time (7 days)
export const REFERRAL_EXPIRATION_DAYS = 7;

// Onboarding badges
export const ONBOARDING_BADGES = [
  {
    id: 'dna_upload',
    code: '🧬',
    label: 'DNA Upload',
    description: 'Tu identidad genética ha sido cargada en el sistema de la nave',
    reward: 5,
    action: ReferralActionType.PROFILE_COMPLETION
  },
  {
    id: 'first_scan',
    code: '👁️',
    label: 'First Scan',
    description: 'Has escaneado tu entorno y detectado señales musicales',
    reward: 2,
    action: 'view_profiles'
  },
  {
    id: 'pulse_check',
    code: '👍',
    label: 'Pulse Check',
    description: 'Has enviado tu primer pulso de energía a un DJ',
    reward: 2,
    action: ReferralActionType.VOTE
  },
  {
    id: 'beacon_contact',
    code: '🛰️',
    label: 'Beacon Contact',
    description: 'Has sido localizado por una lanzadera aliada',
    reward: 5,
    action: ReferralActionType.SCAN_QR
  },
  {
    id: 'crew_sync',
    code: '💫',
    label: 'Crew Sync',
    description: 'Tu frecuencia emocional ha sincronizado con otro tripulante',
    reward: 2,
    action: ReferralActionType.MATCH
  },
  {
    id: 'signal_sent',
    code: '🗨️',
    label: 'Signal Sent',
    description: 'Has iniciado comunicación con la tripulación',
    reward: 1,
    action: 'comment'
  },
  {
    id: 'distress_signal',
    code: '🚨',
    label: 'Distress Signal',
    description: 'Has recibido tu primera llamada de auxilio festivo',
    reward: 3,
    action: 'crowdparty'
  },
  {
    id: 'starborn_cadet',
    code: '🌟',
    label: 'Starborn Cadet',
    description: 'Has completado todas las misiones de onboarding',
    reward: 10,
    action: 'complete_all'
  }
];