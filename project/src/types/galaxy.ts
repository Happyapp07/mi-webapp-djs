export interface Galaxy {
  id: string;
  name: string;
  description: string;
  silenceLevel?: number; // 0-100, where 100 is completely silenced
  color: string;
  icon: string;
  nebulaPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  planets: Planet[];
}

export interface Planet {
  id: string;
  galaxyId: string;
  name: string;
  description: string;
  silenceLevel?: number; // 0-100, where 100 is completely silenced
  restorationProgress?: number; // 0-100, where 100 is fully restored
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  djCount: number;
  eventCount: number;
}