import { create } from 'zustand';

interface Area {
  code: string;
  name: string;
  country: string;
}

interface Country {
  code: string;
  name: string;
}

interface AreaState {
  countries: Country[];
  areas: Area[];
  isLoading: boolean;
  error: string | null;
  fetchAreas: () => Promise<void>;
  getCountryByCode: (code: string) => Country | undefined;
  getAreaByCode: (code: string) => Area | undefined;
  getAreasByCountry: (countryCode: string) => Area[];
}

// Mock data for countries and areas
const mockCountries: Country[] = [
  { code: 'ES', name: 'Spain' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'US', name: 'United States' },
  { code: 'JP', name: 'Japan' }
];

const mockAreas: Area[] = [
  // Spain
  { code: 'BCN', name: 'Barcelona', country: 'ES' },
  { code: 'MAD', name: 'Madrid', country: 'ES' },
  { code: 'IBZ', name: 'Ibiza', country: 'ES' },
  { code: 'VLC', name: 'Valencia', country: 'ES' },
  
  // Germany
  { code: 'BER', name: 'Berlin', country: 'DE' },
  { code: 'HAM', name: 'Hamburg', country: 'DE' },
  { code: 'MUC', name: 'Munich', country: 'DE' },
  { code: 'CGN', name: 'Cologne', country: 'DE' },
  
  // UK
  { code: 'LON', name: 'London', country: 'GB' },
  { code: 'MAN', name: 'Manchester', country: 'GB' },
  { code: 'BHX', name: 'Birmingham', country: 'GB' },
  { code: 'BRS', name: 'Bristol', country: 'GB' },
  
  // Netherlands
  { code: 'AMS', name: 'Amsterdam', country: 'NL' },
  { code: 'RTM', name: 'Rotterdam', country: 'NL' },
  { code: 'EIN', name: 'Eindhoven', country: 'NL' },
  
  // France
  { code: 'PAR', name: 'Paris', country: 'FR' },
  { code: 'MRS', name: 'Marseille', country: 'FR' },
  { code: 'LYS', name: 'Lyon', country: 'FR' },
  
  // Italy
  { code: 'ROM', name: 'Rome', country: 'IT' },
  { code: 'MIL', name: 'Milan', country: 'IT' },
  { code: 'NAP', name: 'Naples', country: 'IT' },
  
  // USA
  { code: 'NYC', name: 'New York', country: 'US' },
  { code: 'LAX', name: 'Los Angeles', country: 'US' },
  { code: 'MIA', name: 'Miami', country: 'US' },
  { code: 'CHI', name: 'Chicago', country: 'US' },
  
  // Japan
  { code: 'TYO', name: 'Tokyo', country: 'JP' },
  { code: 'OSA', name: 'Osaka', country: 'JP' },
  { code: 'FUK', name: 'Fukuoka', country: 'JP' }
];

export const useAreaStore = create<AreaState>((set, get) => ({
  countries: [],
  areas: [],
  isLoading: false,
  error: null,

  fetchAreas: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ 
        countries: mockCountries,
        areas: mockAreas,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch areas',
        isLoading: false 
      });
    }
  },

  getCountryByCode: (code: string) => {
    return get().countries.find(country => country.code === code);
  },

  getAreaByCode: (code: string) => {
    return get().areas.find(area => area.code === code);
  },

  getAreasByCountry: (countryCode: string) => {
    return get().areas.filter(area => area.country === countryCode);
  }
}));