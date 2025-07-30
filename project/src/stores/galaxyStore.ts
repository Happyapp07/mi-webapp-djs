import { create } from 'zustand';
import { Galaxy, Planet } from '../types';

interface GalaxyState {
  galaxies: Galaxy[];
  selectedGalaxy: Galaxy | null;
  selectedPlanet: Planet | null;
  isLoading: boolean;
  error: string | null;
  fetchGalaxies: () => Promise<void>;
  selectGalaxy: (galaxyId: string) => void;
  selectPlanet: (planetId: string) => void;
}

// Updated galaxy data with new color schemes
const mockGalaxies: Galaxy[] = [
  {
    id: 'brimfull',
    name: 'Brimfull Galaxy',
    description: 'The heart of electronic dance music, where rhythm and melody collide.',
    color: '#FF6F1F',
    icon: 'music',
    nebulaPalette: {
      primary: '#FF6F1F',
      secondary: '#1FAEFF',
      accent: '#FFB347'
    },
    planets: [
      {
        id: 'house',
        galaxyId: 'brimfull',
        name: 'Planet House',
        description: 'Deep, soulful beats and melodic grooves define this vibrant world.',
        primaryColor: '#92d5c9',
        secondaryColor: '#00b389',
        icon: 'waveform',
        djCount: 42,
        eventCount: 12
      },
      {
        id: 'techno',
        galaxyId: 'brimfull',
        name: 'Planet Techno',
        description: 'Raw, mechanical rhythms and futuristic soundscapes.',
        primaryColor: '#b6f3f3',
        secondaryColor: '#6eb0ff',
        icon: 'zap',
        djCount: 35,
        eventCount: 8
      },
      {
        id: 'progressive',
        galaxyId: 'brimfull',
        name: 'Planet Progressive',
        description: 'Ever-evolving journeys through sound and emotion.',
        primaryColor: '#db98f2',
        secondaryColor: '#c768e3',
        icon: 'trending-up',
        djCount: 28,
        eventCount: 6
      },
      {
        id: 'trance',
        galaxyId: 'brimfull',
        name: 'Planet Trance',
        description: 'Euphoric melodies and hypnotic rhythms transport you to another dimension.',
        primaryColor: '#b9d2f5',
        secondaryColor: '#4e85ff',
        icon: 'sparkles',
        djCount: 21,
        eventCount: 5
      }
    ]
  },
  {
    id: 'burning',
    name: 'Burning Galaxy',
    description: 'The pulsating heart of Latin rhythms and urban beats.',
    color: '#D81E5B',
    icon: 'flame',
    nebulaPalette: {
      primary: '#D81E5B',
      secondary: '#8B00FF',
      accent: '#FF4B1F'
    },
    planets: [
      {
        id: 'reggaeton',
        galaxyId: 'burning',
        name: 'Planet Reggaeton',
        description: 'Urban Latin rhythms with infectious dembow beats.',
        primaryColor: '#ffa5a5',
        secondaryColor: '#ff7d7d',
        icon: 'music-2',
        djCount: 38,
        eventCount: 10
      },
      {
        id: 'dembow',
        galaxyId: 'burning',
        name: 'Planet Dembow',
        description: 'High-energy Dominican rhythms that keep the party moving.',
        primaryColor: '#ffc987',
        secondaryColor: '#fdae4f',
        icon: 'disc',
        djCount: 25,
        eventCount: 7
      },
      {
        id: 'electrolatino',
        galaxyId: 'burning',
        name: 'Planet Electrolatino',
        description: 'Where electronic beats meet Latin passion.',
        primaryColor: '#ffd1e2',
        secondaryColor: '#f180ae',
        icon: 'radio',
        djCount: 18,
        eventCount: 5
      },
      {
        id: 'mamboton',
        galaxyId: 'burning',
        name: 'Planet Mamboton',
        description: 'Modern fusion of mambo and urban rhythms.',
        primaryColor: '#f7c67c',
        secondaryColor: '#f7a349',
        icon: 'music',
        djCount: 30,
        eventCount: 9
      }
    ]
  },
  {
    id: 'bright',
    name: 'Bright Galaxy',
    description: 'Soul-stirring rhythms and urban vibes collide.',
    color: '#FFD700',
    icon: 'sun',
    nebulaPalette: {
      primary: '#FFD700',
      secondary: '#3C3C3C',
      accent: '#FFA500'
    },
    planets: [
      {
        id: 'funky',
        galaxyId: 'bright',
        name: 'Planet Funky',
        description: 'Groove-laden beats that make you move.',
        primaryColor: '#ffe57f',
        secondaryColor: '#ffb347',
        icon: 'music-4',
        djCount: 32,
        eventCount: 11
      },
      {
        id: 'rnb',
        galaxyId: 'bright',
        name: 'Planet R&B',
        description: 'Smooth, soulful sounds and emotional melodies.',
        primaryColor: '#d2bfff',
        secondaryColor: '#ab8aff',
        icon: 'heart',
        djCount: 24,
        eventCount: 6
      },
      {
        id: 'trap',
        galaxyId: 'bright',
        name: 'Planet Trap',
        description: 'Hard-hitting beats and atmospheric soundscapes.',
        primaryColor: '#c2c2c2',
        secondaryColor: '#7e7e7e',
        icon: 'triangle',
        djCount: 20,
        eventCount: 5
      },
      {
        id: 'gangsta',
        galaxyId: 'bright',
        name: 'Planet Gangsta',
        description: 'Raw, unfiltered urban energy.',
        primaryColor: '#000000',
        secondaryColor: '#5a5a5a',
        icon: 'star',
        djCount: 27,
        eventCount: 8
      }
    ]
  },
  {
    id: 'breaker',
    name: 'Breaker Galaxy',
    description: 'High-energy beats and bass-heavy atmospheres.',
    color: '#00FF9C',
    icon: 'zap',
    nebulaPalette: {
      primary: '#00FF9C',
      secondary: '#111111',
      accent: '#00FFB3'
    },
    planets: [
      {
        id: 'drumandbass',
        galaxyId: 'breaker',
        name: 'Planet Drum&Bass',
        description: 'Fast-paced rhythms and rolling basslines.',
        primaryColor: '#fffb99',
        secondaryColor: '#d6db4a',
        icon: 'activity',
        djCount: 22,
        eventCount: 4
      },
      {
        id: 'breakbeat',
        galaxyId: 'breaker',
        name: 'Planet Breakbeat',
        description: 'Broken rhythms and funky grooves.',
        primaryColor: '#91ffbf',
        secondaryColor: '#33ff99',
        icon: 'waves',
        djCount: 18,
        eventCount: 3
      },
      {
        id: 'dubstep',
        galaxyId: 'breaker',
        name: 'Planet Dubstep',
        description: 'Heavy bass and experimental sounds.',
        primaryColor: '#e7b9ff',
        secondaryColor: '#a262f7',
        icon: 'waveform',
        djCount: 15,
        eventCount: 2
      },
      {
        id: 'hardcore',
        galaxyId: 'breaker',
        name: 'Planet Hardcore',
        description: 'Maximum energy and intensity.',
        primaryColor: '#ff3c3c',
        secondaryColor: '#c10000',
        icon: 'flame',
        djCount: 29,
        eventCount: 6
      }
    ]
  }
];

// Simulate fetching data
const mockFetchDelay = () => new Promise((resolve) => setTimeout(resolve, 800));

export const useGalaxyStore = create<GalaxyState>((set, get) => ({
  galaxies: [],
  selectedGalaxy: null,
  selectedPlanet: null,
  isLoading: false,
  error: null,
  
  fetchGalaxies: async () => {
    try {
      set({ isLoading: true, error: null });
      await mockFetchDelay();
      
      set({ 
        galaxies: mockGalaxies,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch galaxies', 
        isLoading: false 
      });
    }
  },
  
  selectGalaxy: (galaxyId: string) => {
    const { galaxies } = get();
    const galaxy = galaxies.find(g => g.id === galaxyId) || null;
    
    set({ 
      selectedGalaxy: galaxy,
      selectedPlanet: null
    });
  },
  
  selectPlanet: (planetId: string) => {
    const { galaxies } = get();
    
    for (const galaxy of galaxies) {
      const planet = galaxy.planets.find(p => p.id === planetId);
      
      if (planet) {
        set({ 
          selectedGalaxy: galaxy,
          selectedPlanet: planet
        });
        return;
      }
    }
    
    set({ selectedPlanet: null });
  }
}));