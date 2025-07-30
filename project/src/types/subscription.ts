export enum SubscriptionTier {
  // Partygoer tiers
  WALKER = 'walker',
  SUPPORTER = 'supporter', 
  HUNTER = 'hunter',

  // DJ tiers
  BASIC = 'basic',
  PRO = 'pro',
  EXPERT = 'expert',

  // Club tiers
  BASE = 'base',
  RECRUIT = 'recruit',
  STADIUM = 'stadium',
  
  // Reporter tiers
  VERIFIED = 'verified'
}

// Payment methods
export const PAYMENT_METHODS = [
  {
    id: 'credit_card', 
    name: 'Tarjeta de Crédito',
    icon: 'credit-card'
  },
  {
    id: 'debit_card',
    name: 'Tarjeta de Débito',
    icon: 'credit-card' 
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'arrow-up'
  },
  {
    id: 'bank_transfer',
    name: 'Transferencia',
    icon: 'chevron-right'
  }
];

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  userType: 'partygoer' | 'dj' | 'club' | 'reporter';
  stripePriceId?: string;
  seasonPrice?: number;
  seasonSavings?: number;
  maxPlanets?: number;
  maxCompetitions?: number;
  maxPromotedEvents?: number;
  maxStreamingSessions?: number;
  recommended?: boolean;
}

// Subscription plans for each user type
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan[]> = {
  partygoer: [
    {
      id: 'partygoer-walker',
      tier: SubscriptionTier.WALKER,
      name: 'Walker',
      description: 'Comienza tu viaje',
      price: 0,
      interval: 'month',
      features: [
        'Voto geolocalizado en clubs',
        'Acceso a rankings públicos',
        'Carnet digital básico'
      ],
      userType: 'partygoer'
    },
    {
      id: 'partygoer-supporter',
      tier: SubscriptionTier.SUPPORTER,
      name: 'Supporter',
      description: 'Funciones sociales',
      price: 5,
      interval: 'month',
      features: [
        'Votar y ser votado',
        'Rankings sociales',
        'Subir fotos de fiestas',
        'Match y chat con otros usuarios',
        'Carnet Supporter con QR'
      ],
      userType: 'partygoer'
    },
    {
      id: 'partygoer-hunter',
      tier: SubscriptionTier.HUNTER,
      name: 'Hunter',
      description: 'Experiencia VIP completa',
      price: 9,
      interval: 'month',
      features: [
        'Todos los beneficios Supporter',
        'Acceso VIP y sin colas',
        'Invitar a un amigo',
        'Eventos exclusivos',
        'Carnet Hunter premium'
      ],
      userType: 'partygoer',
      recommended: true
    }
  ],
  dj: [
    {
      id: 'dj-basic',
      tier: SubscriptionTier.BASIC,
      name: 'Basic',
      description: 'Comienza como DJ',
      price: 0,
      interval: 'month',
      features: [
        'Subir fotos y contenido',
        'Votar a otros DJs',
        'Ver rankings de planeta',
        'Carnet digital básico'
      ],
      userType: 'dj'
    },
    {
      id: 'dj-expert',
      tier: SubscriptionTier.EXPERT,
      name: 'Expert',
      description: 'Competir y analizar',
      price: 7,
      interval: 'month',
      features: [
        'Competir en un planeta',
        'Subir videos semanales',
        'Rankings segmentados',
        'Carnet Expert DJ',
        'Grupo competitivo de 25 DJs'
      ],
      userType: 'dj',
      recommended: true
    },
    {
      id: 'dj-pro',
      tier: SubscriptionTier.PRO,
      name: 'Pro',
      description: 'Máxima visibilidad y análisis',
      price: 12,
      interval: 'month',
      features: [
        'Todos los beneficios Expert',
        'Análisis de seguidores',
        'Insights de playlists',
        'Datos de participación geo',
        'Análisis de votos',
        'Carnet Pro DJ'
      ],
      userType: 'dj'
    }
  ],
  club: [
    {
      id: 'club-base',
      tier: SubscriptionTier.BASE,
      name: 'Base',
      description: 'Funciones básicas',
      price: 0,
      interval: 'year',
      features: [
        'Perfil y contenido del club',
        'Aparece en el mapa',
        'Rankings provinciales',
        'Carnet digital básico'
      ],
      userType: 'club'
    },
    {
      id: 'club-recruit',
      tier: SubscriptionTier.RECRUIT,
      name: 'Recruit',
      description: 'Análisis y promoción',
      price: 50,
      interval: 'year',
      features: [
        'Sistema Crowdparty',
        'Análisis de clientes',
        'Eventos promocionados',
        'Carnet premium de club'
      ],
      userType: 'club',
      recommended: true
    },
    {
      id: 'club-stadium',
      tier: SubscriptionTier.STADIUM,
      name: 'Stadium',
      description: 'Funciones premium completas',
      price: 100,
      interval: 'year',
      features: [
        'Todos los beneficios Recruit',
        'Competiciones de DJs',
        'Streaming en vivo',
        'Distintivo premium',
        'Análisis en tiempo real',
        'Códigos promocionales'
      ],
      userType: 'club'
    }
  ],
  reporter: [
    {
      id: 'reporter-verified',
      tier: SubscriptionTier.VERIFIED,
      name: 'Verified',
      description: 'Reportero oficial',
      price: 0,
      interval: 'month',
      features: [
        'Perfil de reportero verificado',
        'Subir contenido ilimitado',
        'Asignación a DJs',
        'Acceso a eventos exclusivos',
        'Carnet de reportero verificado'
      ],
      userType: 'reporter'
    }
  ]
};