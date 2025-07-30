import { UserType } from './index';

export enum AchievementLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  userType: UserType | 'all';
  category: AchievementCategory;
  levels: AchievementLevelDetail[];
  unlockedLevel?: AchievementLevel;
  unlockedAt?: Date;
}

export interface AchievementLevelDetail {
  level: AchievementLevel;
  requirement: number;
  reward: {
    beatcoins: number;
    extraReward?: {
      type: 'feature' | 'item' | 'subscription' | 'badge';
      value: string;
      description: string;
    };
  };
}

export enum AchievementCategory {
  CONTENT = 'content',
  SOCIAL = 'social',
  ATTENDANCE = 'attendance',
  PERFORMANCE = 'performance',
  ENGAGEMENT = 'engagement'
}

// DJ (Pilot) Achievements
export const DJ_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'sessions_uploaded',
    name: 'Launch Cadence',
    description: 'Tu nave deja estelas sonoras',
    icon: 'rocket',
    userType: UserType.DJ,
    category: AchievementCategory.CONTENT,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 1,
        reward: { beatcoins: 3 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 5,
        reward: { beatcoins: 5 }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 10,
        reward: { beatcoins: 10 }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 25,
        reward: { 
          beatcoins: 25,
          extraReward: {
            type: 'badge',
            value: 'sonic_transmitter',
            description: 'Insignia exclusiva de Transmisor Sónico'
          }
        }
      }
    ]
  },
  {
    id: 'votes_received',
    name: 'Signal Amplifier',
    description: 'Las ondas llegan a más sistemas',
    icon: 'zap',
    userType: UserType.DJ,
    category: AchievementCategory.ENGAGEMENT,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 50,
        reward: { beatcoins: 5 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 200,
        reward: { beatcoins: 10 }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 500,
        reward: { beatcoins: 20 }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 1000,
        reward: { 
          beatcoins: 50,
          extraReward: {
            type: 'feature',
            value: 'analytics_boost',
            description: 'Acceso a analíticas avanzadas de audiencia'
          }
        }
      }
    ]
  },
  {
    id: 'style_consistency',
    name: 'Planet Loyalty',
    description: 'Tu estilo deja huella gravitacional',
    icon: 'planet',
    userType: UserType.DJ,
    category: AchievementCategory.PERFORMANCE,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 3,
        reward: { beatcoins: 10 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 6,
        reward: { beatcoins: 20 }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 12,
        reward: { 
          beatcoins: 30,
          extraReward: {
            type: 'badge',
            value: 'planet_guardian',
            description: 'Distintivo visible de Guardián Planetario'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 24,
        reward: { 
          beatcoins: 50,
          extraReward: {
            type: 'feature',
            value: 'planet_ambassador',
            description: 'Estatus de Embajador Planetario con visibilidad prioritaria'
          }
        }
      }
    ]
  },
  {
    id: 'club_approved',
    name: 'Club Certified',
    description: 'Validado por lanzaderas locales',
    icon: 'building',
    userType: UserType.DJ,
    category: AchievementCategory.SOCIAL,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 1,
        reward: { 
          beatcoins: 10,
          extraReward: {
            type: 'feature',
            value: 'crowdparty_access',
            description: 'Acceso a crowdparties'
          }
        }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 3,
        reward: { 
          beatcoins: 20,
          extraReward: {
            type: 'badge',
            value: 'club_favorite',
            description: 'Insignia de DJ Favorito de Clubes'
          }
        }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 5,
        reward: { 
          beatcoins: 30,
          extraReward: {
            type: 'feature',
            value: 'club_priority',
            description: 'Prioridad en eventos de clubes asociados'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 10,
        reward: { 
          beatcoins: 50,
          extraReward: {
            type: 'subscription',
            value: 'pro_month',
            description: '1 mes de suscripción Pro gratis'
          }
        }
      }
    ]
  }
];

// Partygoer (Ally) Achievements
export const PARTYGOER_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'club_attendance',
    name: 'Surface Walker',
    description: 'Has recorrido múltiples lunas',
    icon: 'footprints',
    userType: UserType.PARTYGOER,
    category: AchievementCategory.ATTENDANCE,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 5,
        reward: { beatcoins: 5 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 10,
        reward: { beatcoins: 10 }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 20,
        reward: { beatcoins: 20 }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 50,
        reward: { 
          beatcoins: 50,
          extraReward: {
            type: 'badge',
            value: 'cosmic_explorer',
            description: 'Insignia de Explorador Cósmico'
          }
        }
      }
    ]
  },
  {
    id: 'matches_made',
    name: 'Crew Aligner',
    description: 'Has conectado mentes y ritmos',
    icon: 'users',
    userType: UserType.PARTYGOER,
    category: AchievementCategory.SOCIAL,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 3,
        reward: { beatcoins: 3 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 10,
        reward: { 
          beatcoins: 7,
          extraReward: {
            type: 'badge',
            value: 'social_connector',
            description: 'Logotipo animado de Conector Social'
          }
        }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 25,
        reward: { 
          beatcoins: 15,
          extraReward: {
            type: 'feature',
            value: 'match_boost',
            description: 'Prioridad en el sistema de matches'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 50,
        reward: { 
          beatcoins: 30,
          extraReward: {
            type: 'subscription',
            value: 'supporter_month',
            description: '1 mes de suscripción Supporter gratis'
          }
        }
      }
    ]
  },
  {
    id: 'crowdparty_participation',
    name: 'Pulse Tracker',
    description: 'Acudes donde la energía se concentra',
    icon: 'radio',
    userType: UserType.PARTYGOER,
    category: AchievementCategory.ENGAGEMENT,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 1,
        reward: { beatcoins: 5 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 3,
        reward: { 
          beatcoins: 10,
          extraReward: {
            type: 'feature',
            value: 'vip_access',
            description: 'Acceso anticipado a eventos VIP'
          }
        }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 5,
        reward: { 
          beatcoins: 15,
          extraReward: {
            type: 'item',
            value: 'free_drink',
            description: 'Consumición gratis en club adherido'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 10,
        reward: { 
          beatcoins: 25,
          extraReward: {
            type: 'feature',
            value: 'crowdparty_vip',
            description: 'Estatus VIP en todos los CrowdParty'
          }
        }
      }
    ]
  },
  {
    id: 'profile_completion',
    name: 'Full Bio Scan',
    description: 'Aumentas tu presencia en el sistema de emparejamientos',
    icon: 'scan',
    userType: UserType.PARTYGOER,
    category: AchievementCategory.CONTENT,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 50,
        reward: { beatcoins: 5 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 75,
        reward: { beatcoins: 10 }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 90,
        reward: { beatcoins: 15 }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 100,
        reward: { 
          beatcoins: 20,
          extraReward: {
            type: 'feature',
            value: 'profile_visibility',
            description: 'Visibilidad preferente en búsquedas y recomendaciones'
          }
        }
      }
    ]
  }
];

// Club (Hangar) Achievements
export const CLUB_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'crowdparty_events',
    name: 'Crowd Commander',
    description: 'Tu base mueve masas',
    icon: 'users',
    userType: UserType.CLUB,
    category: AchievementCategory.ENGAGEMENT,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 1,
        reward: { beatcoins: 15 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 5,
        reward: { beatcoins: 25 }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 10,
        reward: { 
          beatcoins: 50,
          extraReward: {
            type: 'badge',
            value: 'party_hub',
            description: 'Distintivo de Hub de Fiestas'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 25,
        reward: { 
          beatcoins: 100,
          extraReward: {
            type: 'feature',
            value: 'featured_club',
            description: 'Destacado en la sección de clubes recomendados'
          }
        }
      }
    ]
  },
  {
    id: 'active_reporters',
    name: 'Recon Unit',
    description: 'Tus ojos están en todas partes',
    icon: 'camera',
    userType: UserType.CLUB,
    category: AchievementCategory.SOCIAL,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 1,
        reward: { beatcoins: 5 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 3,
        reward: { beatcoins: 10 }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 5,
        reward: { 
          beatcoins: 25,
          extraReward: {
            type: 'feature',
            value: 'media_boost',
            description: 'Prioridad en la galería de medios'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 10,
        reward: { 
          beatcoins: 50,
          extraReward: {
            type: 'subscription',
            value: 'embassy_month',
            description: '1 mes de suscripción Embassy gratis'
          }
        }
      }
    ]
  },
  {
    id: 'data_usage',
    name: 'Intel Analyst',
    description: 'Utilizas bien los datos para captar tripulaciones',
    icon: 'bar-chart',
    userType: UserType.CLUB,
    category: AchievementCategory.PERFORMANCE,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 10,
        reward: { 
          beatcoins: 10,
          extraReward: {
            type: 'feature',
            value: 'basic_reports',
            description: 'Informes básicos de asistencia'
          }
        }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 25,
        reward: { 
          beatcoins: 20,
          extraReward: {
            type: 'feature',
            value: 'advanced_reports',
            description: 'Informes avanzados de comportamiento'
          }
        }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 50,
        reward: { 
          beatcoins: 30,
          extraReward: {
            type: 'feature',
            value: 'premium_analytics',
            description: 'Acceso a features avanzados de análisis'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 100,
        reward: { 
          beatcoins: 50,
          extraReward: {
            type: 'feature',
            value: 'predictive_analytics',
            description: 'Análisis predictivo de tendencias'
          }
        }
      }
    ]
  }
];

// Reporter Achievements
export const REPORTER_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'videos_uploaded',
    name: 'Recorder of Legends',
    description: 'Archivas hazañas musicales',
    icon: 'video',
    userType: UserType.REPORTER,
    category: AchievementCategory.CONTENT,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 3,
        reward: { beatcoins: 3 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 10,
        reward: { beatcoins: 7 }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 25,
        reward: { 
          beatcoins: 15,
          extraReward: {
            type: 'badge',
            value: 'elite_recorder',
            description: 'Insignia de Grabador de Élite'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 50,
        reward: { 
          beatcoins: 30,
          extraReward: {
            type: 'feature',
            value: 'premium_equipment',
            description: 'Acceso a equipamiento premium'
          }
        }
      }
    ]
  },
  {
    id: 'views_accumulated',
    name: 'Eye Catcher',
    description: 'Tus archivos recorren el sistema',
    icon: 'eye',
    userType: UserType.REPORTER,
    category: AchievementCategory.ENGAGEMENT,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 100,
        reward: { beatcoins: 3 }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 500,
        reward: { beatcoins: 7 }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 2000,
        reward: { 
          beatcoins: 15,
          extraReward: {
            type: 'badge',
            value: 'viral_recorder',
            description: 'Insignia de Grabador Viral'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 10000,
        reward: { 
          beatcoins: 30,
          extraReward: {
            type: 'feature',
            value: 'featured_reporter',
            description: 'Destacado en la sección de reporteros'
          }
        }
      }
    ]
  },
  {
    id: 'federation_approval',
    name: 'Trusted Recon',
    description: 'Tienes pase completo de observador galáctico',
    icon: 'shield',
    userType: UserType.REPORTER,
    category: AchievementCategory.PERFORMANCE,
    levels: [
      {
        level: AchievementLevel.BRONZE,
        requirement: 1,
        reward: { 
          beatcoins: 10,
          extraReward: {
            type: 'badge',
            value: 'scout_official',
            description: 'Insignia de "Scout oficial"'
          }
        }
      },
      {
        level: AchievementLevel.SILVER,
        requirement: 3,
        reward: { 
          beatcoins: 20,
          extraReward: {
            type: 'feature',
            value: 'top_visibility',
            description: 'Visibilidad top en la plataforma'
          }
        }
      },
      {
        level: AchievementLevel.GOLD,
        requirement: 5,
        reward: { 
          beatcoins: 30,
          extraReward: {
            type: 'feature',
            value: 'exclusive_access',
            description: 'Acceso exclusivo a eventos privados'
          }
        }
      },
      {
        level: AchievementLevel.PLATINUM,
        requirement: 10,
        reward: { 
          beatcoins: 50,
          extraReward: {
            type: 'subscription',
            value: 'verified_year',
            description: '1 año de suscripción Verified gratis'
          }
        }
      }
    ]
  }
];

// Special "Galactic Influencer" Achievement
export const GALACTIC_INFLUENCER_ACHIEVEMENT: Achievement = {
  id: 'galactic_influencer',
  name: 'Galactic Influencer',
  description: 'Tu influencia se extiende por toda la galaxia',
  icon: 'star',
  userType: 'all',
  category: AchievementCategory.PERFORMANCE,
  levels: [
    {
      level: AchievementLevel.PLATINUM,
      requirement: 3, // 3 logros en nivel Platinum
      reward: { 
        beatcoins: 100,
        extraReward: {
          type: 'badge',
          value: 'galactic_influencer',
          description: 'Badge animado premium en tu perfil'
        }
      }
    }
  ]
};

// Get all achievements for a specific user type
export const getAchievementsByUserType = (userType: UserType): Achievement[] => {
  switch (userType) {
    case UserType.DJ:
      return DJ_ACHIEVEMENTS;
    case UserType.PARTYGOER:
      return PARTYGOER_ACHIEVEMENTS;
    case UserType.CLUB:
      return CLUB_ACHIEVEMENTS;
    case UserType.REPORTER:
      return REPORTER_ACHIEVEMENTS;
    default:
      return [];
  }
};

// Get all achievements
export const getAllAchievements = (): Achievement[] => {
  return [
    ...DJ_ACHIEVEMENTS,
    ...PARTYGOER_ACHIEVEMENTS,
    ...CLUB_ACHIEVEMENTS,
    ...REPORTER_ACHIEVEMENTS,
    GALACTIC_INFLUENCER_ACHIEVEMENT
  ];
};